"""Pelvis femenina: forma propia de la pelvis de la mujer sobre el esqueleto masculino llevado a su piel (tools/female.py).

El esqueleto femenino es el masculino de Z-Anatomy con la transformación afín que mejor sigue a la piel de la mujer: la
pelvis tiene sus proporciones, pero no su forma. Medida sobre el modelo (femenino, antes de este paso): estrecho
superior acorazonado, espinas ciáticas a 8,0 cm, arco del pubis de 54°, tuberosidades isquiáticas juntas y una pelvis
alta para su estatura: una pelvis androide.

Aquí se deforma hacia una pelvis ginecoide, con las diferencias sexuales de los atlas y de la pelvimetría:
  - arco del pubis amplio y redondeado (~85–90°): las ramas isquiopubianas se abren desde la sínfisis;
  - tuberosidades y espinas isquiáticas más separadas (estrecho inferior y medio más amplios);
  - estrecho superior más redondo: pubis más largo y abierto por delante, líneas arcuatas más separadas;
  - sínfisis algo más adelante y abajo (estrecho superior más largo); ilion más bajo y abierto (crestas más bajas y
    hacia fuera);
  - sacro más ancho, más corto y menos curvo, con el vértice y el cóccix más atrás.

Cómo:
  - Puntos de control detectados en los huesos (acetábulo, sínfisis, ramas, espinas, tuberosidades, línea arcuata,
    cresta, sacro, cóccix), cada uno con su desplazamiento (DESIGN, en mm), y su imagen especular en el lado derecho.
  - Una interpolación suave (spline poliarmónico r³ con parte lineal) da el desplazamiento en todo el espacio; se aplica
    a los coxales, el sacro y el cóccix. Al ser una sola función, las articulaciones (sacroilíacas, sínfisis) siguen
    encajadas. El acetábulo y la base del sacro no se mueven: fémures y columna lumbar quedan donde estaban.
  - Lo demás (músculos, vasos, nervios, vísceras) sigue con un campo armónico en el volumen (`reshape`): igual al de
    la pelvis en sus huesos, cero en los demás huesos y en la piel. anato3d_fit.Fitter lo aplica tras el ajuste a los
    huesos, que se hace con los huesos antes de deformar (guardados con el campo): el coxal deformado ya no es una
    transformación afín del de Z-Anatomy.

Resultado (pelvimetría de `pelvimetry`, antes → después, con el pubis más largo del 2026-11-06): arco del pubis
54° → 87°; diámetro entre las espinas ciáticas 8,0 → 10,2 cm; entre las tuberosidades 6,2 → 9,1 cm; estrecho superior
12,7 → 13,6 cm de ancho y conjugada obstétrica 9,8 → 10,9 cm (antes de alargar el pubis, 10,1); sínfisis–cóccix
8,1 → 9,8 cm; sacro 11,0 × 10,1 → 11,9 × 9,5 cm (ancho × largo); altura del coxal 20,4 → 19,2 cm. Los huesos se mueven
hasta 17,4 mm (coxales), 9,2 (sacro) y 13,0 (cóccix).
"""
import numpy as np
from mathutils import Vector, bvhtree

PELVIC = ('Hip_Bone_L', 'Hip_Bone_R', 'Sacrum', 'Coccyx')

# Desplazamientos del lado izquierdo (x > 0), en mm: (fuera, atrás, arriba). Los de la línea media no se mueven en x.
# Pubis más largo (2026-11-06): la conjugada obstétrica se quedaba en 10,1 cm. En esta pelvis el borde superior de la
# sínfisis está 8,7 cm por debajo del promontorio y solo 4,5 por delante: adelantarla alarga poco la conjugada (y la
# deformación arrastraba el promontorio 4 mm hacia delante). Ahora el promontorio queda fijo (sobre él va L5) y la
# sínfisis va 10 mm hacia delante y 6–7 mm hacia abajo, con el tubérculo y el pecten; las ramas, más abiertas junto a la
# sínfisis para no cerrar el arco. En la mujer el pubis es más largo que en el hombre (índice isquiopubiano).
DESIGN = {
    'acetabulum': (0, 0, 0),
    's1': (0, 0, 0),
    'promontory': (0, 0, 0),
    'symphysis': ((0, -10.5, -7), (0, -10, -6.5), (0, -9.5, -6)),           # arriba, centro, abajo
    'pubic_tubercle': (9, -7.5, -3.5),
    'pecten': ((10, -6.5, -2.5), (7, -2.5, -0.5)),                           # hacia el acetábulo
    'arcuate': ((7, -1, 0), (5, 0, 0), (3, 0, 0)),                          # de delante atrás
    'sacroiliac': (4, 0, 0),
    'ala': (5, 0, 0),
    'sacrum_mid': (0, 2, 2),
    'sacrum_apex': (0, 6, 6),
    'coccyx': (0, 9, 8),
    'spine': (13, 4, 0),
    'tuberosity': ((10, 0, 4), (13, 0, 4), (12, 0, 5)),                     # medial anterior, lateral, centro
    'ramus': ((11, 0, -0.5), (14, 0, 2.5), (15.5, 0.5, 4.5)),               # a 15, 30 y 45 mm de la sínfisis
    'crest': (5, 0, -7),
    'asis': (4, -1, -5),
    'psis': (2, 0, -3),
}


def _world(o):
    m = np.array(o.matrix_world)
    co = np.empty(len(o.data.vertices) * 3); o.data.vertices.foreach_get('co', co)
    return co.reshape(-1, 3) @ m[:3, :3].T + m[:3, 3]


def _bvh(objs):
    import bmesh, bpy
    bm = bmesh.new()
    for o in objs:
        b = bmesh.new(); b.from_mesh(o.data); b.transform(o.matrix_world)
        me = bpy.data.meshes.new('_tmp'); b.to_mesh(me); b.free(); bm.from_mesh(me); bpy.data.meshes.remove(me)
    t = bvhtree.BVHTree.FromBMesh(bm); bm.free()
    return t


def _fps(P, k):
    """k puntos repartidos (muestreo del más lejano)."""
    idx = [int(np.argmax(np.linalg.norm(P - P.mean(0), axis=1)))]
    d = np.linalg.norm(P - P[idx[0]], axis=1)
    for _ in range(min(k, len(P)) - 1):
        idx.append(int(np.argmax(d))); d = np.minimum(d, np.linalg.norm(P - P[idx[-1]], axis=1))
    return P[idx]


def _sphere(P):
    A = np.c_[2 * P, np.ones(len(P))]; b = (P ** 2).sum(1)
    x = np.linalg.lstsq(A, b, rcond=None)[0]
    return x[:3], float(np.sqrt(x[3] + x[:3] @ x[:3]))


def landmarks(objs):
    """Puntos de referencia de la pelvis (lado izquierdo y línea media), en metros."""
    h = _world(objs['Hip_Bone_L']); S = _world(objs['Sacrum']); C = _world(objs['Coccyx']); F = _world(objs['Femur_L'])
    HT = _bvh([objs['Hip_Bone_L']])
    near = np.array([HT.find_nearest(Vector(p))[3] for p in F])
    c_h, r_h = _sphere(F[near < 0.006])
    L = {'head': c_h, 'head_r': r_h}
    L['acetabulum'] = _fps(h[np.abs(np.linalg.norm(h - c_h, axis=1) - r_h) < 0.005], 20)
    med = h[(h[:, 0] < h[:, 0].min() + 0.004) & (h[:, 1] < c_h[1])]
    top, bot = med[np.argmax(med[:, 2])], med[np.argmin(med[:, 2])]
    L['ps_top'], L['ps_bottom'] = top * [0, 1, 1], bot * [0, 1, 1]
    L['symphysis'] = np.array([top, (top + bot) / 2, bot])
    # Sacro: promontorio, base (fija: sobre ella va L5), vértice y cara anterior a media altura; cóccix; alas.
    mid = S[np.abs(S[:, 0]) < 0.012]
    top_s = mid[mid[:, 2] > S[:, 2].max() - 0.03]
    prom = top_s[np.argmin(top_s[:, 1])]
    L['promontory'] = prom * [0, 1, 1]
    L['s1'] = _fps(S[(S[:, 2] > S[:, 2].max() - 0.012) & (np.abs(S[:, 0]) < 0.026)], 10)   # cuerpo y apófisis articulares
    apex = mid[np.argmin(mid[:, 2])]
    L['sacrum_apex'] = apex[None]
    sm = mid[(mid[:, 2] > (prom[2] + apex[2]) / 2 - 0.004) & (mid[:, 2] < (prom[2] + apex[2]) / 2 + 0.004)]
    L['sacrum_mid'] = sm[np.argmin(sm[:, 1])][None]                 # cara anterior (pelviana) del sacro, a media altura
    L['coccyx'] = C[np.argmin(C[:, 2])][None]
    L['ala'] = _fps(S[S[:, 0] > S[:, 0].max() - 0.006], 2)
    ST = _bvh([objs['Sacrum']])
    si = h[np.array([ST.find_nearest(Vector(p))[3] for p in h]) < 0.004]
    L['sacroiliac'] = _fps(si, 4)
    # Isquion: tuberosidad (lo más bajo, a lo largo), espina (lo más medial detrás del acetábulo, entre ambas alturas).
    tub = h[h[:, 2] < h[:, 2].min() + 0.012]
    L['tuberosity'] = _fps(tub, 3); L['tuber_c'] = tub.mean(0)
    band = h[(h[:, 2] > tub[:, 2].mean() + 0.02) & (h[:, 2] < c_h[2]) & (h[:, 1] > c_h[1] + 0.01)]
    L['spine'] = band[np.argmin(band[:, 0])][None]
    # Rama isquiopubiana: borde medial a 15, 30 y 45 mm de la sínfisis inferior.
    ram = []
    for d in (0.015, 0.03, 0.045):
        r = np.linalg.norm(h - bot * [0, 1, 1], axis=1)
        sel = h[(np.abs(r - d) < 0.003) & (h[:, 2] < bot[2] + 0.002)]
        ram.append(sel[np.argmin(sel[:, 0])])
    L['ramus'] = np.array(ram)
    # Pubis: tubérculo (lo más alto, a 1–3 cm de la sínfisis) y pecten (borde superior de la rama, hacia el acetábulo).
    ant = h[h[:, 1] < c_h[1] - 0.01]
    pt = ant[(ant[:, 0] > top[0] + 0.01) & (ant[:, 0] < top[0] + 0.03)]
    L['pubic_tubercle'] = pt[np.argmax(pt[:, 2])][None]
    pec = []
    for f in (0.45, 0.7):
        x = top[0] + f * (c_h[0] - top[0])
        sel = ant[(np.abs(ant[:, 0] - x) < 0.003) & (ant[:, 2] < c_h[2] + 0.04)]
        pec.append(sel[np.argmax(sel[:, 2])])
    L['pecten'] = np.array(pec)
    # Línea arcuata: lo más medial del ilion entre el pubis y la articulación sacroilíaca, en el plano del estrecho.
    u = prom * [0, 1, 1] - top * [0, 1, 1]
    arc = []
    for f in (0.35, 0.55, 0.75):
        y = top[1] + f * u[1]; z = top[2] + f * u[2]
        sel = h[(np.abs(h[:, 1] - y) < 0.003) & (np.abs(h[:, 2] - z) < 0.012)]
        if len(sel): arc.append(sel[np.argmin(sel[:, 0])])
    L['arcuate'] = np.array(arc)
    # Cresta ilíaca: lo más alto en franjas de delante atrás; espinas ilíacas anterior y posterior superiores.
    up = h[h[:, 2] > c_h[2] + 0.05]
    L['asis'] = up[np.argmin(up[:, 1])][None]
    L['psis'] = up[np.argmax(up[:, 1])][None]
    ys = np.linspace(up[:, 1].min() + 0.02, up[:, 1].max() - 0.02, 5)
    L['crest'] = np.array([up[np.abs(up[:, 1] - y) < 0.004][np.argmax(up[np.abs(up[:, 1] - y) < 0.004][:, 2])] for y in ys])
    return L


class Warp:
    """Spline poliarmónico (r³) con parte lineal: interpola desplazamientos dados en puntos de control."""
    def __init__(self, C, D, center, scale=0.1, reg=1e-6):
        self.c, self.s = np.asarray(center, float), float(scale)
        X = (np.asarray(C) - self.c) / self.s
        n = len(X)
        K = np.linalg.norm(X[:, None] - X[None], axis=2) ** 3 + reg * np.eye(n)
        P = np.c_[np.ones(n), X]
        A = np.block([[K, P], [P.T, np.zeros((4, 4))]])
        sol = np.linalg.solve(A, np.r_[np.asarray(D, float), np.zeros((4, 3))])
        self.X, self.w, self.a = X, sol[:n], sol[n:]

    def __call__(self, P):
        P = (np.asarray(P, float) - self.c) / self.s
        out = np.empty((len(P), 3))
        for i in range(0, len(P), 4096):
            Q = P[i:i + 4096]
            out[i:i + 4096] = (np.linalg.norm(Q[:, None] - self.X[None], axis=2) ** 3) @ self.w + np.c_[np.ones(len(Q)), Q] @ self.a
        return out


def controls(L, design=DESIGN):
    """Puntos de control (los dos lados) y sus desplazamientos en metros."""
    C, D = [], []
    for key, val in design.items():
        pts = np.atleast_2d(L[key])
        vals = np.array(val, float).reshape(-1, 3) / 1000
        if len(vals) == 1: vals = np.repeat(vals, len(pts), 0)
        for p, d in zip(pts, vals):
            if abs(p[0]) < 0.004 or key in ('sacrum_apex', 'sacrum_mid', 'coccyx'):
                C.append(p * [0, 1, 1]); D.append(d * [0, 1, 1])           # línea media
            else:
                C += [p, p * [-1, 1, 1]]; D += [d, d * [-1, 1, 1]]
    return np.array(C), np.array(D)


def pelvimetry(objs):
    """Diámetros de la pelvis (cm) y ángulo subpubiano (°), con rayos sobre las mallas."""
    L = landmarks(objs)
    T = _bvh([objs[n] for n in PELVIC])
    def ray(o, d, far=0.12):
        hit = T.ray_cast(Vector(o), Vector(d), far)[0]
        return None if hit is None else np.array(hit)
    out = {}
    # Estrecho superior: en cada corte coronal entre la sínfisis y el promontorio, rayos hacia fuera a alturas crecientes;
    # el borde (línea arcuata) es lo más lateral de la pared de la pelvis menor antes del salto a la fosa ilíaca.
    pr, st = L['promontory'], L['ps_top']
    width = []
    for f in np.linspace(0.1, 0.9, 33):
        q = st + f * (pr - st)
        xs = []
        for dz in np.linspace(-0.03, 0.012, 43):
            hit = ray(q + [0, 0, dz], (1, 0, 0))
            xs.append(hit[0] if hit is not None else 1.0)              # sin choque: muy lejos
        xs = np.array(xs)
        jump = np.nonzero(np.diff(xs) > 0.012)[0]
        if len(jump) and xs[:jump[0] + 1].min() < 1.0:
            width.append((f, 2 * xs[:jump[0] + 1][xs[:jump[0] + 1] < 1.0].max()))
    f, w = max(width, key=lambda t: t[1])
    out['inlet_transverse'] = w * 100
    out['inlet_transverse_at'] = f                                     # 0 = sínfisis, 1 = promontorio
    sym = _world(objs['Hip_Bone_L']); sym = sym[(sym[:, 0] < sym[:, 0].min() + 0.01) & (sym[:, 1] < L['head'][1])]
    out['obstetric_conjugate'] = np.linalg.norm(sym * [0, 1, 1] - pr, axis=1).min() * 100
    out['interspinous'] = 2 * L['spine'][0, 0] * 100
    tc = L['tuber_c']
    hit = ray((0, tc[1], tc[2] + 0.004), (1, 0, 0))
    out['intertuberous'] = 2 * hit[0] * 100 if hit is not None else float('nan')
    out['outlet_ap'] = np.linalg.norm(L['ps_bottom'] - L['coccyx'][0] * [0, 1, 1]) * 100
    # Ángulo subpubiano, en el plano del arco (sínfisis inferior y tuberosidades).
    B = L['ps_bottom']; M = tc * [0, 1, 1]
    e1 = (M - B) / np.linalg.norm(M - B)
    half = []
    for d in np.linspace(0.006, 0.03, 9):
        hit = ray(B + e1 * d, (1, 0, 0), 0.06)
        if hit is not None: half.append((d, hit[0]))
    half = np.array(half)
    slope = np.polyfit(half[:, 0], half[:, 1], 1)[0]
    out['subpubic_angle'] = float(np.degrees(2 * np.arctan(slope)))
    S = _world(objs['Sacrum'])
    out['sacrum_width'] = np.ptp(S[:, 0]) * 100
    out['sacrum_length'] = np.linalg.norm(pr - L['sacrum_apex'][0] * [0, 1, 1]) * 100
    h = _world(objs['Hip_Bone_L'])
    out['intercristal'] = 2 * h[:, 0].max() * 100
    out['asis_distance'] = 2 * L['asis'][0, 0] * 100
    out['height'] = np.ptp(h[:, 2]) * 100
    out['symphysis_height'] = np.linalg.norm(L['ps_top'] - L['ps_bottom']) * 100
    return out, L


def reshape(objs, skin, world, set_world, path, h=0.006, margin=0.08):
    """Deforma la pelvis (coxales, sacro y cóccix de `objs`) y guarda en `path` el campo para los demás tejidos, con los
    huesos antes de deformar (pre_<nombre>, en coordenadas de mundo). `skin`: la piel femenina. Devuelve la pelvimetría
    antes y después."""
    from musculature import Field
    before, L = pelvimetry(objs)
    warp = Warp(*controls(L), center=L['head'] * [0, 1, 1])
    # Campo en el volumen, sobre los huesos sin deformar (el ajuste de anato3d_fit lleva ahí cada tejido y luego le suma
    # el campo): en las celdas de la pelvis, la deformación; en las de otros huesos y en la piel, cero.
    bones = [o for o in objs.values() if o.type == 'MESH' and o.get('system') == 'skeletal']
    pelvic, other = _bvh([objs[n] for n in PELVIC]), _bvh([o for o in bones if o.name not in PELVIC])
    def bone_disp(P):
        far = 1.0
        mine = np.array([(pelvic.find_nearest(Vector(p))[3] or far) <= (other.find_nearest(Vector(p))[3] or far) for p in P])
        return warp(P) * mine[:, None]
    pre = {n: world(objs[n]) for n in PELVIC}
    allP = np.vstack(list(pre.values()))
    W = world(skin)
    box = (np.maximum(allP.min(0) - margin, W.min(0)), np.minimum(allP.max(0) + margin, W.max(0)))
    field = Field.solve(W, [p.vertices[:] for p in skin.data.polygons], np.zeros_like(W), _bvh(bones), h=h, box=box,
                        bone_disp=bone_disp, iterations=2000, tol=2e-8)
    np.savez_compressed(path, origin=field.o, h=field.h, D=field.D.astype(np.float16),
                        **{f'pre_{n}': P.astype(np.float32) for n, P in pre.items()})
    moved = {}
    for n, P in pre.items():
        d = warp(P); set_world(objs[n], P + d); moved[n] = float(np.linalg.norm(d, axis=1).max())
    after, _ = pelvimetry(objs)
    return before, after, moved, field.report
