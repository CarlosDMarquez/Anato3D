"""Periné femenino: referencias comunes, genitales externos profundos y músculos del periné.

Z-Anatomy no tiene los músculos del triángulo urogenital (bulboesponjoso, isquiocavernoso, transversos del periné,
esfínteres de la uretra) ni la membrana ni el cuerpo perineal, y sus genitales son masculinos. Aquí se generan los
femeninos con formas paramétricas, sobre las mismas referencias que la vulva (build_female_skin.py) y los órganos
pélvicos (female_organs.py): todos usan `frame`, que solo depende de la pelvis y de la piel.

Medidas de adulta (cm), de disecciones y resonancias (O'Connell 2005, Lloyd 2005):
  - clítoris: glande 0,5 × 0,6, bajo el capuchón; cuerpo 2,5–3 (0,9 de ancho), acodado (rodilla) bajo la sínfisis;
    raíces 5, aplanadas contra la cara inferomedial de las ramas isquiopubianas;
  - bulbos del vestíbulo 3,5 × 1,2 × 0,8, en media luna a los lados del vestíbulo: la punta anterior bajo el cuerpo
    del clítoris, la parte gruesa junto al orificio de la vagina;
  - glándulas vestibulares mayores 0,8 × 1 × 0,7, detrás de los bulbos; su conducto (2) se abre en el vestíbulo, por
    fuera del himen, a las 5 y a las 7;
  - glande–orificio uretral 2,2; orificio uretral–centro del orificio vaginal 1,7; horquilla–ano ~2,5.
Músculos (superficial → profundo):
  - isquiocavernoso: cubre la raíz del clítoris, de la tuberosidad isquiática a la rodilla;
  - bulboesponjoso: cubre el bulbo y la glándula, del cuerpo perineal al cuerpo del clítoris, rodeando el vestíbulo;
  - transverso superficial del periné: de la tuberosidad al cuerpo perineal;
  - membrana perineal: lámina entre las ramas isquiopubianas, por encima de raíces y bulbos;
  - transverso profundo del periné, compresor de la uretra, esfínter uretrovaginal y esfínter externo de la uretra,
    por encima de la membrana;
  - cuerpo perineal: nudo fibromuscular entre la vagina y el ano.
Coordenadas de Blender: Z arriba, delante = −Y, izquierda = +X.
"""
import numpy as np
from mathutils import Vector, bvhtree
from female_organs import landmarks, tube, ellipsoid, curve, _unit, _world


def _bvh(objs):
    import bmesh, bpy
    bm = bmesh.new()
    for o in objs:
        b = bmesh.new(); b.from_mesh(o.data); b.transform(o.matrix_world)
        me = bpy.data.meshes.new('_tmp'); b.to_mesh(me); b.free(); bm.from_mesh(me); bpy.data.meshes.remove(me)
    t = bvhtree.BVHTree.FromBMesh(bm); bm.free()
    return t


def frame(objs, skin_world, bladder_world=None):
    """Referencias del periné (m). `objs`: huesos de la Fase 2 (por nombre, sin sufijos); `skin_world`: vértices de la
    piel; `bladder_world`: vértices de la vejiga (el cuello, inicio de la uretra), si se tienen."""
    L = landmarks(objs)
    mid = lambda p: np.array([0.0, p[1], p[2]])
    ps_b, ps_t = mid(L['ps_bottom']), mid(L['ps_top'])
    tub = (L['tuber_L'] + L['tuber_R']) / 2
    # Piel del periné en la línea media (la piel de MakeHuman no tiene vulva: el vestíbulo queda a su altura).
    perineum = skin_world[(np.abs(skin_world[:, 0]) < 0.008) & (skin_world[:, 2] < ps_b[2])]
    def at_skin(y, depth, z_default=None):
        sel = perineum[np.abs(perineum[:, 1] - y) < 0.004]
        return np.array([0.0, y, sel[:, 2].min() + depth if len(sel) else z_default])
    F = {'L': L, 'ps_bottom': ps_b, 'ps_top': ps_t, 'at_skin': at_skin}
    F['introitus'] = at_skin(ps_b[1] + 0.03, 0.008, min(ps_b[2] - 0.02, (ps_b[2] + tub[2]) / 2))
    F['urethral_os'] = at_skin(F['introitus'][1] - 0.017, 0.004, F['introitus'][2] + 0.004)
    F['glans'] = at_skin(F['urethral_os'][1] - 0.022, 0.0055, F['urethral_os'][2] + 0.012)
    F['knee'] = np.array([0.0, ps_b[1] + 0.006, ps_b[2] - 0.004])            # rodilla del clítoris, bajo la sínfisis
    F['skin_z'] = lambda y: at_skin(y, 0.0)[2]
    # Cuerpo perineal: entre la pared posterior de la vagina y el conducto anal.
    F['perineal_body'] = F['introitus'] + np.array([0.0, 0.020, 0.010])
    # Uretra: del cuello de la vejiga (su punto más bajo junto a la línea media) al orificio.
    if bladder_world is not None and len(bladder_world):
        m = bladder_world[np.abs(bladder_world[:, 0]) < 0.01]
        neck = m[np.argmin(m[:, 2])] if len(m) else bladder_world[np.argmin(bladder_world[:, 2])]
    else:
        neck = ps_b + np.array([0, 0.03, 0.02])
    F['urethra'] = curve([neck, (neck + F['urethral_os']) / 2 + np.array([0, -0.004, 0]), F['urethral_os']], 12)
    # Ramas isquiopubianas: su cara inferomedial (la del periné), de la sínfisis a la tuberosidad, con rayos.
    F['ramus'], F['ramus_dir'], F['hip'] = {}, {}, {}
    for s, sx in (('L', 1.0), ('R', -1.0)):
        T = F['hip'][s] = _bvh([objs[f'Hip_Bone_{s}']])
        start = np.array([sx * abs(L['ps_bottom'][0]), ps_b[1], ps_b[2]])
        end = L[f'tuber_{s}']
        m = _unit(np.array([-sx, 0.0, -1.2]))                              # hacia el periné: dentro y abajo
        pts = []
        for t in np.linspace(0.05, 1.0, 20):
            p = start + t * (end - start)
            hit = T.ray_cast(Vector(p + m * 0.03), Vector(-m), 0.05)[0]
            pts.append(np.array(hit) if hit is not None else p)
        F['ramus'][s] = np.array(pts); F['ramus_dir'][s] = m
    return F


def ramus_medial(F, s, t, dz, gap=0.003):
    """Punto de la cara medial de la rama isquiopubiana a la fracción t (0 = sínfisis, 1 = tuberosidad), `dz` por encima
    de su borde inferomedial, separado `gap` hacia la línea media."""
    sx = 1.0 if s == 'L' else -1.0
    E = F['ramus'][s]; tt = np.linspace(0.05, 1.0, len(E))
    p = np.array([np.interp(t, tt, E[:, k]) for k in range(3)]) + np.array([0, 0, dz])
    hit = F['hip'][s].ray_cast(Vector((0.0, p[1], p[2])), Vector((sx, 0.0, 0.0)), 0.12)[0]
    q = np.array(hit) if hit is not None else p
    return q - np.array([sx * gap, 0, 0])


def vulva_controls(F):
    """Puntos de control de la línea de la vulva (aún no proyectados en la piel): comisura anterior (sobre el monte del
    pubis), glande, orificio uretral, orificio vaginal y comisura posterior (horquilla)."""
    G, U, O = F['glans'], F['urethral_os'], F['introitus']
    return [G + np.array([0, -0.008, 0.014]), G, U, O, O + np.array([0, 0.016, -0.006])]


def vulva_line(F, skin_bvh, n=120):
    """Línea de la vulva sobre la piel: (puntos (n, 3), longitud de arco s de cada uno, en m)."""
    raw = curve(vulva_controls(F), n)
    # Se prolonga 15 mm por cada extremo (monte del pubis y periné), para que s cubra toda la región.
    pre = raw[0] + np.outer(np.linspace(0.015, 0.0, 12, endpoint=False), _unit(raw[0] - raw[3]))
    post = raw[-1] + np.outer(np.linspace(0.0, 0.015, 13)[1:], _unit(raw[-1] - raw[-4]))
    raw = np.vstack([pre, raw, post])
    # Junto a la piel pero suave: proyectada sobre ella y suavizada después, sin volver a proyectarla. Proyectada al final
    # zigzagueaba sobre las caras de la piel (8 mm) y la posición s de los puntos cercanos saltaba en cada quiebro: el
    # relieve, que depende de s, salía escalonado.
    line = np.array([skin_bvh.find_nearest(Vector(p))[0][:] for p in raw])
    for _ in range(40):
        line[1:-1] = (line[:-2] + 2 * line[1:-1] + line[2:]) / 4
    s = np.r_[0, np.cumsum(np.linalg.norm(np.diff(line, axis=0), axis=1))]
    return line, s


def line_coords(line, s, P):
    """(s, distancia a la línea, altura sobre ella) de cada punto P respecto a la línea de la vulva."""
    best = np.full(len(P), np.inf); pos = np.zeros(len(P)); dz = np.zeros(len(P))
    for i in range(len(line) - 1):
        a, b = line[i], line[i + 1]; ab = b - a
        h = np.clip(((P - a) @ ab) / max(ab @ ab, 1e-12), 0, 1)
        q = a + h[:, None] * ab
        d = np.linalg.norm(P - q, axis=1)
        c = d < best
        best[c] = d[c]; pos[c] = s[i] + h[c] * (s[i + 1] - s[i]); dz[c] = (P - q)[c, 2]
    return pos, best, dz


REGION_R = 0.021


def vulva_region(F, skin_world, polys, skin_bvh):
    """Caras de la piel que sustituye la vulva: a menos de REGION_R de su línea y no más de 5 mm por debajo de ella (el
    techo entre los muslos, no sus caras internas)."""
    line, s = vulva_line(F, skin_bvh)
    _, d, dz = line_coords(line, s, skin_world)
    ok = (d < REGION_R) & (dz > -0.005)
    return np.array([all(ok[k] for k in p) for p in polys])


# ── Mallas ────────────────────────────────────────────────────────────────
def _frames(path, ref):
    T = np.gradient(path, axis=0); T /= np.linalg.norm(T, axis=1)[:, None]
    N = np.empty_like(T)
    n = ref - (ref @ T[0]) * T[0]; N[0] = _unit(n)
    for i in range(1, len(T)):                                            # transporte paralelo
        n = N[i - 1] - (N[i - 1] @ T[i]) * T[i]
        N[i] = _unit(n)
    return T, N, np.cross(T, N)


def shell(path, ra, rb, ref, th0=-np.pi, th1=np.pi, gap=0.0004, thick=0.0018, seg=20):
    """Lámina de grosor `thick` que envuelve, a `gap` de distancia, la sección elíptica (ra según `ref`, rb
    perpendicular) a lo largo de `path`, entre los ángulos th0 y th1 (medidos desde `ref`). Con la vuelta entera, un
    anillo. Malla cerrada. Devuelve (vértices, caras)."""
    path = np.asarray(path, float); n = len(path)
    ra = np.broadcast_to(ra, n).astype(float); rb = np.broadcast_to(rb, n).astype(float)
    thick = np.broadcast_to(thick, n).astype(float)
    T, N, B = _frames(path, np.asarray(ref, float))
    full = th1 - th0 >= 2 * np.pi - 1e-6
    th = np.linspace(th0, th1, seg, endpoint=not full)
    k = len(th)
    V = []
    for i in range(n):
        for r_off in (gap, gap + thick[i]):                                # anillo interior y exterior
            V += list(path[i] + np.outer(np.cos(th), N[i] * (ra[i] + r_off)) + np.outer(np.sin(th), B[i] * (rb[i] + r_off)))
    V = np.array(V)
    idx = lambda i, layer, j: (2 * i + layer) * k + j
    F = []
    js = range(k) if full else range(k - 1)
    for i in range(n - 1):
        for j in js:
            j2 = (j + 1) % k
            F.append((idx(i, 1, j), idx(i, 1, j2), idx(i + 1, 1, j2), idx(i + 1, 1, j)))      # cara exterior
            F.append((idx(i, 0, j), idx(i + 1, 0, j), idx(i + 1, 0, j2), idx(i, 0, j2)))      # cara interior
        if not full:                                                       # bordes de la lámina
            F.append((idx(i, 0, 0), idx(i, 1, 0), idx(i + 1, 1, 0), idx(i + 1, 0, 0)))
            F.append((idx(i, 1, k - 1), idx(i, 0, k - 1), idx(i + 1, 0, k - 1), idx(i + 1, 1, k - 1)))
    for i, sign in ((0, 1), (n - 1, -1)):                                  # extremos
        for j in js:
            j2 = (j + 1) % k
            f = (idx(i, 0, j), idx(i, 0, j2), idx(i, 1, j2), idx(i, 1, j))
            F.append(f if sign > 0 else tuple(reversed(f)))
    return V, F


def slab(P, thick):
    """Lámina cerrada de grosor `thick` sobre la rejilla de puntos P (nu, nv, 3)."""
    nu, nv, _ = P.shape
    du = np.gradient(P, axis=0); dv = np.gradient(P, axis=1)
    Nm = np.cross(du, dv); Nm /= np.maximum(np.linalg.norm(Nm, axis=2, keepdims=True), 1e-12)
    top, bot = P + Nm * thick / 2, P - Nm * thick / 2
    V = np.vstack([top.reshape(-1, 3), bot.reshape(-1, 3)])
    o = nu * nv
    q = lambda i, j: i * nv + j
    F = []
    for i in range(nu - 1):
        for j in range(nv - 1):
            F.append((q(i, j), q(i + 1, j), q(i + 1, j + 1), q(i, j + 1)))
            F.append((o + q(i, j), o + q(i, j + 1), o + q(i + 1, j + 1), o + q(i + 1, j)))
    border = [q(i, 0) for i in range(nu)] + [q(nu - 1, j) for j in range(1, nv)] + \
             [q(i, nv - 1) for i in range(nu - 2, -1, -1)] + [q(0, j) for j in range(nv - 2, 0, -1)]
    for a, b in zip(border, border[1:] + border[:1]):
        F.append((a, o + a, o + b, b))
    return V, F


def _crus_path(F, s):
    """Eje de la raíz del clítoris de ese lado: de la rodilla, junto a la cara inferomedial de la rama, hasta 2/3 del
    camino a la tuberosidad; y sus semiejes (contra el hueso, y hacia el periné)."""
    sx = 1.0 if s == 'L' else -1.0
    E, m = F['ramus'][s], F['ramus_dir'][s]
    t = np.linspace(0.05, 1.0, len(E))
    sel = (t > 0.14) & (t < 0.66)
    w = np.interp(t[sel], [0.14, 0.4, 0.66], [0.0042, 0.0036, 0.0016])     # contra el hueso
    h = np.interp(t[sel], [0.14, 0.4, 0.66], [0.0034, 0.0028, 0.0013])     # hacia el periné
    along = E[sel] + m * (h[:, None] + 0.0004)
    K = F['knee'] + np.array([sx * 0.0035, 0.0, 0.0])
    path = curve([K, K + np.array([sx * 0.008, 0.004, -0.002]), along[1], along[len(along) // 2], along[-1]], 20)
    a = np.interp(np.linspace(0, 1, 20), [0, 0.2, 1], [0.0034, 0.0042, 0.0016])
    b = np.interp(np.linspace(0, 1, 20), [0, 0.2, 1], [0.0030, 0.0034, 0.0013])
    return path, a, b, m


def _bulb_path(F, s):
    """Eje del bulbo del vestíbulo: en media luna, de la punta anterior (bajo el cuerpo del clítoris, junto a la línea
    media) a la parte gruesa, junto a la mitad posterior del orificio vaginal."""
    sx = 1.0 if s == 'L' else -1.0
    G, U, O = F['glans'], F['urethral_os'], F['introitus']
    tip = np.array([sx * 0.0025, G[1] + 0.009, G[2] + 0.006])
    path = curve([tip, np.array([sx * 0.009, U[1] - 0.004, U[2] + 0.005]), np.array([sx * 0.0125, U[1] + 0.008, O[2] + 0.006]),
                  np.array([sx * 0.0135, O[1] + 0.006, O[2] + 0.006])], 22)
    t = np.linspace(0, 1, 22)
    a = np.interp(t, [0, 0.3, 0.75, 1], [0.0012, 0.0035, 0.0058, 0.0055])   # alto (z)
    b = np.interp(t, [0, 0.3, 0.75, 1], [0.0010, 0.0024, 0.0040, 0.0038])   # ancho (x)
    return path, a, b


def deep_genitals(F):
    """Genitales externos profundos: lista de (nombre, tejido, vértices, caras, externo)."""
    out = []
    G, K = F['glans'], F['knee']
    # Glande: un cono redondeado de 6 mm, con la punta hacia delante y abajo, bajo el capuchón.
    ax = _unit(G - K)
    side = np.array([1.0, 0, 0]); up = np.cross(ax, side)
    V, Fc = ellipsoid(G, [side * 0.0026, up * 0.0024, ax * 0.0032],
                      bumps=lambda d: 1 - 0.18 * np.clip(-d[:, 2], 0, 1))     # algo más estrecho hacia la base
    out.append(('Glans_of_clitoris', 'erectile', V, Fc, True))
    # Cuerpo: de la base del glande a la rodilla, acodado (sube hacia la sínfisis y se dobla hacia atrás).
    body = curve([G - ax * 0.002, G - ax * 0.011 + np.array([0, 0.002, 0.003]), K + np.array([0, -0.006, 0.0]), K], 16)
    s = np.linspace(0, 1, 16)
    V, Fc = tube(body, np.interp(s, [0, 0.3, 1], [0.0024, 0.0040, 0.0046]), np.interp(s, [0, 0.3, 1], [0.0022, 0.0032, 0.0036]),
                 seg=16, ref=(1.0, 0.0, 0.0))
    out.append(('Body_of_clitoris', 'erectile', V, Fc, True))
    for side_name, sx in (('L', 1.0), ('R', -1.0)):
        path, a, b, m = _crus_path(F, side_name)
        V, Fc = tube(path, b, a, seg=14, ref=tuple(m))
        out.append((f'Crus_of_clitoris_{side_name}', 'erectile', V, Fc, True))
        path, a, b = _bulb_path(F, side_name)
        V, Fc = tube(path, a, b, seg=16, ref=(0.0, 0.0, 1.0))
        out.append((f'Bulb_of_vestibule_{side_name}', 'erectile', V, Fc, True))
        O = F['introitus']
        gc = np.array([sx * 0.0115, O[1] + 0.017, O[2] + 0.0055])
        V, Fc = ellipsoid(gc, [[0.0034 * sx, 0, 0], [0, 0.0048, 0], [0, 0, 0.0036]],
                          bumps=lambda d: 1 + 0.05 * np.sin(6 * d[:, 0]) * np.cos(5 * d[:, 1]))
        out.append((f'Greater_vestibular_gland_{side_name}', 'gland_f', V, Fc, True))
        # Conducto: de la cara anteromedial de la glándula al vestíbulo, por fuera del himen (a las 5 y a las 7).
        opening = np.array([sx * 0.0045, O[1] + 0.006, F['skin_z'](O[1] + 0.006) + 0.0025])
        duct = curve([gc + np.array([-sx * 0.0025, -0.003, -0.001]), np.array([sx * 0.008, O[1] + 0.009, gc[2] - 0.002]), opening], 12)
        V, Fc = tube(duct, 0.0006, 0.0006, seg=8)
        out.append((f'Duct_of_greater_vestibular_gland_{side_name}', 'gland_f', V, Fc, True))
    return out


def perineal_muscles(F):
    """Músculos del periné y sus láminas fibrosas: lista de dicts (name, en, tissue, V, F, superficial)."""
    out = []
    def add(name, en, V, Fc, tissue='muscle', superficial=False):
        out.append({'name': name, 'en': en, 'tissue': tissue, 'V': np.asarray(V), 'F': Fc, 'superficial': superficial})
    pb, O, U, G, K = F['perineal_body'], F['introitus'], F['urethral_os'], F['glans'], F['knee']
    Ur = F['urethra']                                                      # del cuello (0) al orificio (-1)
    ur_at = lambda f: Ur[int(round((1 - f) * (len(Ur) - 1)))]              # f: fracción desde el orificio
    for s, sx in (('L', 1.0), ('R', -1.0)):
        tub = F['L'][f'tuber_{s}']
        E, m = F['ramus'][s], F['ramus_dir'][s]
        # Isquiocavernoso: envuelve la raíz por su cara libre (la que no toca el hueso), de la tuberosidad a la rodilla.
        path, a, b, _ = _crus_path(F, s)
        tail = E[-3] + m * 0.0035                                          # junto a la tuberosidad
        ext = curve([path[-1], (path[-1] + tail) / 2 + np.array([0, 0, -0.001]), tail], 6)[1:]
        P = np.vstack([path[3:], ext])
        n = len(P)
        ra = np.r_[b[3:], np.linspace(b[-1], 0.0016, len(ext))]
        rb = np.r_[a[3:], np.linspace(a[-1], 0.0013, len(ext))]
        V, Fc = shell(P, ra, rb, ref=tuple(m), th0=-0.62 * np.pi, th1=0.62 * np.pi, thick=np.interp(np.linspace(0, 1, n), [0, 0.6, 1], [0.0012, 0.0024, 0.0016]))
        add(f'Ischiocavernosus_muscle_{s}', 'Ischiocavernosus muscle', V, Fc, superficial=True)
        # Bulboesponjoso: lámina sobre la cara lateral e inferior del bulbo y de la glándula, del cuerpo perineal al
        # cuerpo del clítoris (sus fibras anteriores lo cruzan por encima).
        bp, ba, bb = _bulb_path(F, s)
        gc = np.array([sx * 0.0115, O[1] + 0.017, O[2] + 0.0055])
        back = curve([bp[-1], gc + np.array([sx * 0.001, -0.002, 0.0]), np.array([sx * 0.006, pb[1] - 0.001, pb[2] - 0.004]),
                      np.array([sx * 0.003, pb[1] + 0.002, pb[2] - 0.003])], 8)[1:]
        front = curve([np.array([sx * 0.0045, G[1] + 0.012, G[2] + 0.010]), np.array([sx * 0.003, G[1] + 0.006, G[2] + 0.007]), bp[0]], 5)[:-1]
        P = np.vstack([front, bp, back])
        n = len(P)
        # Sección circular (el mayor semieje del bulbo): envuelve el bulbo aunque el marco de la lámina gire respecto al suyo.
        rr = np.r_[np.full(len(front), 0.0016), np.maximum(ba, bb), np.interp(np.linspace(0, 1, len(back)), [0, 0.3, 1], [0.0058, 0.0050, 0.0022])]
        ra = rb = rr
        lateral = _unit(np.array([sx, 0.0, -0.75]))                        # fuera y abajo: lejos del vestíbulo
        # La sección del bulbo usa (z, x); el ángulo se mide desde z: la cara libre está entre abajo (π) y fuera.
        V, Fc = shell(P, ra, rb, ref=(0.0, 0.0, 1.0), th0=0.15 * np.pi if sx > 0 else -1.15 * np.pi,
                      th1=1.15 * np.pi if sx > 0 else -0.15 * np.pi, thick=np.interp(np.linspace(0, 1, n), [0, 0.3, 0.8, 1], [0.0010, 0.0018, 0.0020, 0.0012]))
        add(f'Bulbospongiosus_muscle_{s}', 'Bulbospongiosus muscle', V, Fc, superficial=True)
        # Transverso superficial del periné: de la cara medial de la tuberosidad al cuerpo perineal.
        a0 = E[-3] + m * 0.0045
        b0 = np.array([sx * 0.0065, pb[1] + 0.001, pb[2] - 0.004])
        path = curve([a0, (a0 + b0) / 2 + np.array([0, 0.002, -0.003]), b0], 12)
        V, Fc = tube(path, np.linspace(0.0030, 0.0036, 12), np.linspace(0.0012, 0.0016, 12), seg=12, ref=(0.0, 1.0, 0.0))
        add(f'Superficial_transverse_perineal_muscle_{s}', 'Superficial transverse perineal muscle', V, Fc, superficial=True)
        # Transverso profundo del periné: más hondo (encima de la membrana), de la rama junto a la tuberosidad al cuerpo
        # perineal.
        a0 = ramus_medial(F, s, 0.82, 0.009)
        b0 = np.array([sx * 0.0062, pb[1] - 0.002, pb[2] + 0.006])
        path = curve([a0, (a0 + b0) / 2 + np.array([0, 0.0, 0.003]), b0], 12)
        V, Fc = tube(path, 0.0045, 0.0013, seg=12, ref=(0.0, 1.0, 0.0))
        add(f'Deep_transverse_perineal_muscle_{s}', 'Deep transverse perineal muscle', V, Fc)
        # Membrana perineal: lámina entre la rama (por encima de la raíz) y el borde de la uretra y la vagina, de la
        # sínfisis a la línea entre las tuberosidades.
        t = np.linspace(0.05, 1.0, len(E))
        vs = np.linspace(0.06, 0.86, 14)
        rim = np.array([np.interp(v, t, E[:, k]) for k in range(3) for v in vs]).reshape(3, -1).T
        rim = rim + m * 0.0015 + np.array([0, 0, 0.005])                   # sobre la raíz, pegada al hueso
        medial = np.column_stack([sx * np.interp(vs, [0.06, 0.35, 0.86], [0.0055, 0.0085, 0.0115]),
                                  np.interp(vs, [0.06, 0.86], [F['ps_bottom'][1] + 0.002, pb[1] - 0.004]),
                                  np.interp(vs, [0.06, 0.86], [U[2] + 0.020, O[2] + 0.0135])])
        Pm = np.array([[rim[j] + (medial[j] - rim[j]) * u for j in range(len(vs))] for u in np.linspace(0, 1, 8)])
        V, Fc = slab(Pm, 0.0009)
        add(f'Perineal_membrane_{s}', 'Perineal membrane', V, Fc, tissue='tendon')
        # Compresor de la uretra: de la rama, por encima de la membrana, en arco por delante de la uretra.
        q = ur_at(0.42)
        a0 = ramus_medial(F, s, 0.5, 0.006)
        path = curve([a0, np.array([sx * 0.009, q[1] - 0.003, q[2] - 0.004]), np.array([sx * 0.0035, q[1] - 0.0048, q[2]]),
                      np.array([0.0, q[1] - 0.0052, q[2] + 0.001])], 14)
        V, Fc = tube(path, 0.0026, 0.0011, seg=12, ref=(0.0, 0.0, 1.0))
        add(f'Compressor_urethrae_{s}', 'Compressor urethrae', V, Fc)
        # Esfínter uretrovaginal: rodea por delante la uretra y baja por los lados de la vagina hasta el cuerpo perineal.
        q = ur_at(0.32)
        path = curve([np.array([0.0, q[1] - 0.0048, q[2] - 0.001]), np.array([sx * 0.0075, q[1] + 0.001, q[2] - 0.001]),
                      np.array([sx * 0.0130, O[1] + 0.004, O[2] + 0.022]), np.array([sx * 0.0085, pb[1] - 0.006, pb[2] + 0.015]),
                      np.array([sx * 0.003, pb[1] - 0.005, pb[2] + 0.015])], 18)
        V, Fc = tube(path, 0.0022, 0.0011, seg=12, ref=(0.0, 0.0, 1.0))
        add(f'Sphincter_urethrovaginalis_{s}', 'Sphincter urethrovaginalis', V, Fc)
    # Esfínter externo de la uretra: anillo alrededor del tercio medio de la uretra.
    seg_u = Ur[int(0.35 * (len(Ur) - 1)):int(0.7 * (len(Ur) - 1)) + 1][::-1]
    seg_u = curve([seg_u[0], seg_u[len(seg_u) // 2], seg_u[-1]], 10)
    V, Fc = shell(seg_u, 0.003, 0.003, ref=(1.0, 0.0, 0.0), gap=0.0003, thick=0.0018, seg=20)
    add('External_urethral_sphincter', 'External urethral sphincter', V, Fc)
    # Cuerpo perineal: nudo fibromuscular piramidal entre la vagina y el ano.
    V, Fc = ellipsoid(pb, [[0.0060, 0, 0], [0, 0.0048, 0], [0, 0, 0.0085]], bumps=lambda d: 1 - 0.25 * np.clip(d[:, 2], 0, 1) ** 2)
    add('Perineal_body', 'Perineal body', V, Fc, tissue='tendon')
    return out
