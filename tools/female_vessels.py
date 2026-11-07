"""Vasos ováricos y uterinos del modelo femenino. Z-Anatomy es un cuerpo masculino: tiene arterias y venas testiculares
(que la mujer no lleva, ver male_only) y ninguna ovárica, uterina ni vaginal. Los llama build_vascular.py.

Trayectos (anatomía de referencia; las formas de los órganos son las de female_organs.py, que build_visceral.py guarda en
build/female_pelvic_organs.npz):
  - Arteria ovárica: nace de la aorta bajo las renales y baja sobre el psoas, por delante del uréter. Ese tramo es igual
    que el de la testicular y se toma de la testicular de Z-Anatomy, con el mismo ajuste. En el estrecho superior de la
    pelvis cruza por delante de los vasos ilíacos externos, junto a su origen, baja por el ligamento suspensorio, por
    dentro y por detrás de la vena ilíaca externa, y entra en el ovario por el hilio, en su borde anterior (mesovárico).
    Ahí se une a la rama ovárica de la uterina.
  - Vena ovárica: sale de un plexo de venas finas junto al hilio y acompaña a la arteria. La derecha desemboca en la cava
    inferior y la izquierda en la vena renal izquierda (tramo abdominal: venas testiculares de Z-Anatomy).
  - Arteria uterina: nace de la división anterior de la ilíaca interna, baja y avanza por la pared de la pelvis, cruza
    por encima del uréter a 1,5–2 cm del cuello del útero y llega al istmo. Sube tortuosa por el borde lateral del útero
    hasta cerca del cuerno y allí da la rama tubárica (bajo la trompa) y la ovárica (sobre el ligamento propio del
    ovario, hasta el hilio). Desde el istmo, las ramas vaginales bajan por el borde del cuello y la pared de la vagina.
  - Plexo venoso uterino: dos cordones tortuosos a cada lado del útero, por delante y por detrás de la arteria, unidos
    por venas cortas que pasan por fuera de ella y comunicados con las venas del ovario. Venas uterinas: dos, del plexo a
    la ilíaca interna, a los lados de la arteria.
Calibres (diámetro): ovárica 1,5 mm; uterina 2,2 mm en su origen; vena ovárica 2,6 mm al desembocar; venas uterinas
2,4 mm. Cada vaso se aparta de los órganos, de los vasos de Z-Anatomy, de los huesos y de los vasos ya trazados.
"""
import numpy as np
from mathutils import Vector, bvhtree, geometry
from female_organs import tube, _frames, _unit

SIDES = (('L', 1.0), ('R', -1.0))
# name_en (como en la TA2) → (español, latín). TA2: sources/z-anatomy/TA2.csv; a la derecha, su número.
NAMES = {
    'Ovarian artery': ('Arteria ovárica', 'Arteria ovarica'),                                                   # 4285
    'Uterine artery': ('Arteria uterina', 'Arteria uterina'),                                                   # 4330
    'Vaginal branches of uterine artery': ('Ramas vaginales de la arteria uterina', 'Rami vaginales arteriae uterinae'),  # 4332
    'Ovarian branch of uterine artery': ('Rama ovárica de la arteria uterina', 'Ramus ovaricus arteriae uterinae'),       # 4334
    'Tubal branch of uterine artery': ('Rama tubárica de la arteria uterina', 'Ramus tubarius arteriae uterinae'),        # 4335
    'Left ovarian vein': ('Vena ovárica izquierda', 'Vena ovarica sinistra'),                                   # 5014
    'Right ovarian vein': ('Vena ovárica derecha', 'Vena ovarica dextra'),                                      # 5017
    'Uterine veins': ('Venas uterinas', 'Venae uterinae'),                                                      # 5046
    'Uterine venous plexus': ('Plexo venoso uterino', 'Plexus venosus uterinus'),                               # 5047
}
# Curvas de Z-Anatomy en las que se apoyan (las testiculares, sin sufijo de lado salvo la arteria derecha).
ZNAMES = {
    'testicular_artery': {'L': 'Left testicular artery', 'R': 'Right testicular artery.r'},
    'testicular_vein': {'L': 'Left testicular vein', 'R': 'Right testicular vein'},
    'external_iliac_artery': 'External iliac artery', 'external_iliac_vein': 'External iliac vein',
    'anterior_division': 'Anterior division of internal iliac artery', 'internal_iliac_vein': 'Internal iliac vein',
}
STEP = 0.0012          # separación de los anillos en la pelvis (m)
S_VAULT = 0.16         # fracción del eje del útero por debajo de la cual el cuello está dentro de la vagina
MARGIN = 0.0006        # holgura mínima entre la pared de un vaso y lo que tiene al lado


# ── Geometría ────────────────────────────────────────────────────────────────
def centerline(o, fitter):
    """Eje de una curva de Z-Anatomy (su tramo más largo) ajustado al cuerpo como su malla, y su radio."""
    M = o.matrix_world
    best_p, best_r = [], []
    for s in o.data.splines:
        bp = s.bezier_points
        if len(bp) < 2: continue
        P, R = [], []
        for i in range(len(bp) - 1):
            seg = geometry.interpolate_bezier(bp[i].co, bp[i].handle_right, bp[i + 1].handle_left, bp[i + 1].co, 12)
            k = 0 if i == 0 else 1
            P += [(M @ p)[:] for p in seg[k:]]
            R += list(np.linspace(bp[i].radius, bp[i + 1].radius, 12)[k:])
        if len(P) > len(best_p): best_p, best_r = P, R
    if not best_p: raise ValueError(f'female_vessels: la curva «{o.name}» no tiene tramos')
    P, r = fitter.deform(np.array(best_p)), np.abs(np.array(best_r) * o.data.bevel_depth * np.mean(M.to_scale()))
    return (P, r) if P[0, 2] >= P[-1, 2] else (P[::-1], r[::-1])     # el extremo más alto primero


def arclength(P):
    return np.r_[0, np.cumsum(np.linalg.norm(np.diff(P, axis=0), axis=1))]


def resample(P, step):
    """Puntos cada `step` m a lo largo de la poligonal P."""
    s = arclength(P)
    t = np.linspace(0, s[-1], max(2, int(np.ceil(s[-1] / step)) + 1))
    return np.stack([np.interp(t, s, P[:, k]) for k in range(3)], 1)


def spline(points, step=STEP):
    """Curva de Catmull-Rom centrípeta por los puntos (sin bucles en los giros cerrados), cada `step` m."""
    P = np.asarray(points, float)
    P = np.vstack([2 * P[0] - P[1], P, 2 * P[-1] - P[-2]])
    out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1:i + 3]
        t1 = np.linalg.norm(p1 - p0) ** 0.5 + 1e-9
        t2 = t1 + np.linalg.norm(p2 - p1) ** 0.5 + 1e-9
        t3 = t2 + np.linalg.norm(p3 - p2) ** 0.5 + 1e-9
        n = max(2, int(np.linalg.norm(p2 - p1) / (step / 4)))
        for t in np.linspace(t1, t2, n, endpoint=i == len(P) - 3):
            a1 = (t1 - t) / t1 * p0 + t / t1 * p1
            a2 = (t2 - t) / (t2 - t1) * p1 + (t - t1) / (t2 - t1) * p2
            a3 = (t3 - t) / (t3 - t2) * p2 + (t - t2) / (t3 - t2) * p3
            b1 = (t2 - t) / t2 * a1 + t / t2 * a2
            b2 = (t3 - t) / (t3 - t1) * a2 + (t - t1) / (t3 - t1) * a3
            out.append((t2 - t) / (t2 - t1) * b1 + (t - t1) / (t2 - t1) * b2)
    return resample(np.array(out), step)


def extend(head, points):
    """Sigue la poligonal `head` por los puntos, con la tangente de su final (sin volver atrás)."""
    S = spline([head[-2], head[-1], *points])
    k = int(np.argmin(np.linalg.norm(S - head[-1], axis=1)))
    return np.vstack([head, S[k + 1:]])


def at_height(P, z, r):
    """Punto y radio de un eje que baja (el más alto primero), a la altura z."""
    i = int(np.clip(np.searchsorted(-P[:, 2], -z), 1, len(P) - 1))
    f = np.clip((P[i - 1, 2] - z) / max(P[i - 1, 2] - P[i, 2], 1e-9), 0, 1)
    return P[i - 1] * (1 - f) + P[i] * f, r[i - 1] * (1 - f) + r[i] * f


def at_fraction(P, f):
    s = arclength(P)
    return np.array([np.interp(f * s[-1], s, P[:, k]) for k in range(3)])


def offset_along(P, start_dir, d):
    """Paralela a P a la distancia d, del lado de `start_dir` en el primer punto (transporte paralelo: no se enrosca)."""
    _, N, _ = _frames(P, np.asarray(start_dir, float))
    return P + N * d


class Wall:
    """Eje de un órgano tubular de female_organs.py (útero, vagina) con sus semiejes: `ra` hacia los lados (x) y `rb`
    hacia sus caras. Sitúa puntos junto a su borde lateral."""
    def __init__(self, path, ra, rb):
        self.P = np.asarray(path, float)
        self.ra, self.rb = np.broadcast_to(ra, len(self.P)), np.broadcast_to(rb, len(self.P))
        self.T, self.N, self.B = _frames(self.P, np.array([1.0, 0, 0]))
        self.s = np.linspace(0, 1, len(self.P))

    def _at(self, arr, s):
        arr = np.asarray(arr)
        return np.interp(s, self.s, arr) if arr.ndim == 1 else np.array([np.interp(s, self.s, arr[:, k]) for k in range(3)])

    def side(self, s, sx, out, b=0.0):
        """Punto a `out` m por fuera del borde lateral (lado sx) en la fracción s del eje, desplazado b m hacia la cara
        B (la posterosuperior del útero en anteversión). Fuera del borde, la sección es una elipse: con b, se estrecha."""
        C, N, B = self._at(self.P, s), _unit(self._at(self.N, s)), _unit(self._at(self.B, s))
        ra, rb = self._at(self.ra, s), self._at(self.rb, s)
        return C + sx * N * (ra * np.sqrt(max(0.0, 1 - (b / rb) ** 2)) + out) + B * b


def wavy(wall, s0, s1, sx, out, b0=0.0, amp_b=0.0, amp_n=0.0, wave=0.008, phase=0.0, ramp=0.004):
    """Puntos junto al borde lateral, de la fracción s0 a la s1 del eje, con un vaivén (la tortuosidad de los vasos
    uterinos) de amplitud amp_b hacia las caras y amp_n hacia fuera, de longitud de onda `wave`; el vaivén entra poco a
    poco en los primeros `ramp` m."""
    S = np.linspace(s0, s1, 200)
    d = arclength(np.array([wall.side(s, sx, out, b0) for s in S]))
    d_new = np.arange(0, d[-1], STEP / 2)
    out_pts = []
    for dd, s in zip(d_new, np.interp(d_new, d, S)):
        e = min(1.0, dd / ramp) if ramp else 1.0
        a = 2 * np.pi * dd / wave + phase
        out_pts.append(wall.side(s, sx, out + e * amp_n * (1 - np.cos(a)) / 2, b0 + e * amp_b * np.sin(a)))
    return np.array(out_pts)


# ── Obstáculos ────────────────────────────────────────────────────────────────
class Obstacles:
    """Lo que un vaso nuevo no debe atravesar: órganos (mallas cerradas), vasos (ejes con su radio) y los huesos.
    Dentro o fuera de un órgano se decide por paridad (rayos en 6 direcciones), no por la normal de la cara más cercana:
    el uréter de Z-Anatomy tiene las caras hacia dentro y, con la normal, los vasos acababan metidos en él y arrastrados
    a lo largo de su trayecto (hasta 3 cm)."""
    REACH = 0.03                                             # más lejos de un obstáculo no se mira
    DIRS = [Vector(d) for d in ((1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1))]

    def __init__(self, fitter, bone_skip=None):
        self.fitter, self.bone_skip = fitter, bone_skip
        self.meshes, self.tubes = {}, {}
        self.done = []                                       # ejes apartados, para la comprobación final

    def add_mesh(self, name, V, F):
        V = np.asarray(V, float)
        self.meshes[name] = (bvhtree.BVHTree.FromPolygons([tuple(v) for v in V], [tuple(f) for f in F]),
                             V.min(0) - self.REACH, V.max(0) + self.REACH)

    def _inside(self, T, p):
        odd = 0
        for d in self.DIRS:
            o, n = p, 0
            while n < 24:
                hit = T.ray_cast(o + d * 1e-5, d)[0]
                if hit is None: break
                n += 1; o = hit
            odd += n % 2
        return odd >= 4

    def add_tube(self, name, P, r):
        P = np.asarray(P, float); r = np.broadcast_to(np.asarray(r, float), len(P)).copy()
        self.tubes[name] = (P, r, P.min(0) - r.max() - 0.01, P.max(0) + r.max() + 0.01)

    def gap(self, name, p):
        """(holgura de p respecto al obstáculo `name`, dirección hacia fuera, punto de su superficie) o None si está lejos.
        La holgura es negativa dentro. 'bone': los huesos de la Fase 2 (Fitter.bone_depth)."""
        if name == 'bone':
            depth, n, loc = self.fitter.bone_depth(p, self.bone_skip)
            return None if n is None else (-depth, n, loc)
        if name in self.meshes:
            T, lo, hi = self.meshes[name]
            if (p < lo).any() or (p > hi).any(): return None
            loc, _, _, dist = T.find_nearest(Vector(p), self.REACH)
            if loc is None: return None
            loc = np.array(loc)
            inside = self._inside(T, Vector(p))
            n = (loc - p) if inside else (p - loc)
            return (-dist if inside else dist), n / max(np.linalg.norm(n), 1e-9), loc
        P, r, lo, hi = self.tubes[name]
        if (p < lo).any() or (p > hi).any(): return None
        A, AB = P[:-1], np.diff(P, axis=0)
        t = np.clip(np.einsum('ij,ij->i', p - A, AB) / np.maximum(np.einsum('ij,ij->i', AB, AB), 1e-12), 0, 1)
        C = A + AB * t[:, None]
        d = np.linalg.norm(p - C, axis=1)
        rr = r[:-1] * (1 - t) + r[1:] * t
        i = int(np.argmin(d - rr))
        n = (p - C[i]) / max(d[i], 1e-9)
        return d[i] - rr[i], n, C[i] + n * rr[i]

    def names(self):
        return [*self.meshes, *self.tubes, 'bone']

    def push(self, p, need, ignore=()):
        """Lleva p a `need` m de la superficie de cada obstáculo (salvo los de `ignore`). Devuelve el punto nuevo."""
        p = np.array(p, float)
        for name in self.names():
            if name in ignore: continue
            g = self.gap(name, p)
            if g is not None and g[0] < need: p = g[2] + g[1] * need
        return p

    def clear(self, P, r, keep_start=0.0, keep_end=0.0, ignore=(), ignore_start=(), ignore_end=(), rounds=10, tag=None):
        """Aparta el eje P (radio r por punto) de los obstáculos y lo suaviza. Los primeros `keep_start` m y los últimos
        `keep_end` m no se mueven (unión con el vaso de origen, entrada en el órgano). `ignore_start`/`ignore_end`: lo
        que no cuenta en los primeros o últimos 6 mm (el vaso del que sale, el órgano en el que entra). `tag`: (pieza,
        prefijo de sus propios tubos), para la comprobación final. Devuelve el eje y el mayor desplazamiento."""
        P0 = np.array(P, float); P = P0.copy(); r = np.broadcast_to(r, len(P)).astype(float)
        s = arclength(P)
        free = (s >= keep_start) & (s <= s[-1] - keep_end)
        free[0] = free[-1] = False
        ign = [set(ignore) | (set(ignore_start) if si < 0.006 else set()) | (set(ignore_end) if s[-1] - si < 0.006 else set())
               for si in s]
        for k in range(rounds):
            for i in np.flatnonzero(free):
                P[i] = self.push(P[i], r[i] + MARGIN, ign[i])
            if k < rounds - 2:                                     # las dos últimas vueltas, sin suavizar
                Q = P.copy(); Q[1:-1] = 0.5 * P[1:-1] + 0.25 * (P[:-2] + P[2:])
                P[free] = Q[free]
        if tag: self.done.append((tag, P.copy(), r, free, ign))
        return P, float(np.linalg.norm(P - P0, axis=1).max())

    def collisions(self):
        """Choques que quedan al final (con todo ya trazado): puntos libres de los ejes apartados cuya pared sigue más de
        0,2 mm dentro de un obstáculo, sin contar los tubos de su propia pieza ni las uniones (a menos de 6 mm del
        principio o del final de un vaso nuevo: ahí sale una rama o se unen dos). {pieza: {obstáculo: (puntos, mm)}}:
        cuántos puntos y cuánto entra el más hondo."""
        out = {}
        for (piece, own), P, r, free, ign in self.done:
            for i in np.flatnonzero(free):
                for name in self.names():
                    if name in ign[i] or name.startswith(own): continue
                    if name.startswith('new_') and min(np.linalg.norm(self.tubes[name][0][[0, -1]] - P[i], axis=1)) < 0.006: continue
                    g = self.gap(name, P[i])
                    if g is not None and g[0] < r[i] - 0.0002:
                        n, d = out.setdefault(piece, {}).get(name, (0, 0.0))
                        out[piece][name] = (n + 1, max(d, round(float(r[i] - g[0]) * 1000, 1)))
        return out


# ── Vasos ─────────────────────────────────────────────────────────────────────
def _piece(name, name_en, system, paths, seg, source, like):
    """Une los tubos (eje, radio) de una pieza en una malla. `like`: curva de Z-Anatomy cuya región (grupo) hereda."""
    Vs, F, off = [], [], 0
    for P, r in paths:
        V, f = tube(P, r, r, seg=seg, ref=(0.0, 0.0, 1.0))
        Vs.append(V); F += [tuple(i + off for i in q) for q in f]; off += len(V)
    es, la = NAMES[name_en]
    return {'name': name, 'name_en': name_en, 'name_es': es, 'name_la': la, 'system': system,
            'tissue': 'artery' if system == 'arterial' else 'vein', 'V': np.vstack(Vs), 'F': F, 'source': source,
            'like': like, 'paths': paths}


def pelvic_vessels(fitter, frame, organs, zvessels, bone_skip=None, log=print):
    """Piezas de los vasos ováricos y uterinos: lista de dicts con nombre, nombres, sistema, tejido, malla (mundo) y
    fuente. `frame`: referencias de female_organs.pelvic_organs (build/female_pelvic_organs.npz); `organs`: {nombre: (V,
    F)} de las mallas construidas, de las que hay que apartarse; `zvessels`: {nombre: curva de Z-Anatomy}: las de ZNAMES
    y los vasos de la pelvis de los que hay que apartarse."""
    Fm = {k: np.asarray(v, float) for k, v in frame.items()}
    uterus = Wall(Fm['uterus_path'], Fm['uterus_ra'], Fm['uterus_rb'])
    vagina = Wall(Fm['vagina_path'], Fm['vagina_va'], Fm['vagina_rb'])
    obst = Obstacles(fitter, bone_skip)
    for name, (V, F) in organs.items(): obst.add_mesh(name, V, F)
    lines = {}
    for name, o in zvessels.items():
        lines[name] = centerline(o, fitter)
        if 'testicular' not in name: obst.add_tube(name, *lines[name])

    def zv(key, side):
        n = ZNAMES[key]
        n = n[side] if isinstance(n, dict) else f'{n}.{side.lower()}'
        if n not in lines: raise KeyError(f'female_vessels: falta la curva de Z-Anatomy «{n}»')
        return (*lines[n], n)

    SRC = 'Anato3D (trayecto paramétrico sobre los órganos femeninos; tools/female_vessels.py)'
    src_z = lambda n: f'{SRC}; tramo abdominal: Z-Anatomy object "{n}" (BodyParts3D, DBCLS) CC BY-SA 4.0, refitted to the Anato3D skin'
    pieces = []
    for side, sx in SIDES:
        ovary_c = Fm[f'ovary_{side}']
        ovary = [f'Ovary_{side}']
        EA, rEA, _ = zv('external_iliac_artery', side)
        EV, rEV, _ = zv('external_iliac_vein', side)
        AD, _, n_ad = zv('anterior_division', side)
        IV, _, n_iv = zv('internal_iliac_vein', side)
        TA, _, n_ta = zv('testicular_artery', side)
        TV, _, n_tv = zv('testicular_vein', side)

        # ── Arteria ovárica: el tramo abdominal de la testicular hasta 1,8 cm por encima del origen de la ilíaca externa;
        # luego por delante de los vasos ilíacos externos (1 cm por debajo de su origen), por dentro de la vena y por
        # detrás de ella hasta el ovario, por debajo de la trompa, al hilio.
        z_bif = EA[0, 2]
        z_d = z_bif + 0.018
        top = resample(TA[:int(np.argmax(TA[:, 2] < z_d)) + 1], 0.003)
        z1 = z_bif - 0.010
        (a1, ra1), (v1, rv1) = at_height(EA, z1, rEA), at_height(EV, z1, rEV)
        X1 = np.array([(a1[0] + v1[0]) / 2, min(a1[1] - ra1, v1[1] - rv1) - 0.0035, z1])
        v2, rv2 = at_height(EV, z1 - 0.018, rEV)
        X2 = np.array([v2[0] - sx * (rv2 + 0.004), v2[1] + 0.002, z1 - 0.018])
        v3, rv3 = at_height(EV, ovary_c[2] + 0.027, rEV)
        X3 = np.array([v3[0], v3[1] + rv3 + 0.0075, v3[2]])
        X4 = ovary_c + np.array([-sx * 0.011, -0.006, 0.004])
        H = ovary_c + np.array([0.0, -0.0125, -0.001])               # hilio, en el borde anterior
        inside = ovary_c + np.array([0.0, -0.0075, -0.001])          # 3 mm dentro del ovario
        P = extend(top, [X1, X2, X3, X4, H, inside])
        n_top = len(top)
        r = np.r_[np.linspace(0.0008, 0.00075, n_top), np.linspace(0.00075, 0.00065, len(P) - n_top)]
        P, w = obst.clear(P, r, keep_start=arclength(top)[-1], keep_end=0.003, ignore_end=ovary,
                          tag=(f'Ovarian_artery_{side}', f'new_ovarian_artery_{side}'))
        ov_art = (P, r)
        pieces.append(_piece(f'Ovarian_artery_{side}', 'Ovarian artery', 'arterial', [ov_art], 8, src_z(n_ta), n_ta))
        obst.add_tube(f'new_ovarian_artery_{side}', *ov_art)
        log(f'  arteria ovárica {side}: {len(P)} anillos; desvío máximo para apartarse {w * 1000:.1f} mm')

        # ── Arteria uterina: de la división anterior de la ilíaca interna (al 70 % de su largo) hacia delante y abajo,
        # por encima del uréter, al istmo; sube por el borde del útero hasta el 70 % de su eje (bajo el cuerno).
        r_ut = 0.0011
        O_prev, O = at_fraction(AD, 0.45), at_fraction(AD, 0.7)
        U1 = O + np.array([sx * 0.002, -0.011, -0.017])
        U3 = uterus.side(0.40, sx, r_ut + 0.0015)
        U2 = U3 + np.array([sx * 0.010, -0.002, 0.010])
        if f'Ureter_{side}' in organs:                              # 2 mm por encima del uréter (de su tramo cercano)
            Vu = organs[f'Ureter_{side}'][0]
            near = Vu[(np.linalg.norm(Vu[:, :2] - U2[:2], axis=1) < 0.006) & (np.abs(Vu[:, 2] - U2[2]) < 0.02)]
            if len(near): U2[2] = max(U2[2], near[:, 2].max() + r_ut + 0.002)
        asc = wavy(uterus, 0.40, 0.70, sx, r_ut + 0.0015, amp_b=0.002, amp_n=0.0008, wave=0.007)
        P = spline([O_prev, O, U1, U2, *asc[::2], asc[-1]])
        r = np.linspace(r_ut, 0.0008, len(P))
        P, w = obst.clear(P, r, keep_start=0.006, ignore_start=(n_ad,), tag=(f'Uterine_artery_{side}', f'new_uterine_artery_{side}'))
        ut_art = (P, r)
        pieces.append(_piece(f'Uterine_artery_{side}', 'Uterine artery', 'arterial', [ut_art], 10, SRC, n_ad))
        obst.add_tube(f'new_uterine_artery_{side}', *ut_art)
        log(f'  arteria uterina {side}: {len(P)} anillos; desvío máximo {w * 1000:.1f} mm')
        E = P[-1]
        i3 = int(np.argmin(np.linalg.norm(P - U3, axis=1)))           # llegada al istmo
        from_ut = (f'new_uterine_artery_{side}', 'Uterus')

        # ── Rama tubárica: bajo la trompa, hasta antes de su arco sobre el ovario ──
        Tp, Tr = Fm[f'tube_{side}'], Fm[f'tube_r_{side}']
        Tt = np.gradient(Tp, axis=0); Tt /= np.linalg.norm(Tt, axis=1)[:, None]
        down = np.array([_unit(np.array([0, 0, -1.0]) + t * t[2]) for t in Tt])     # hacia abajo, perpendicular al eje
        below = Tp + down * (Tr + 0.0005 + 0.002)[:, None]
        u = np.linspace(0, 1, len(Tp))
        P = spline([E, E + np.array([sx * 0.002, -0.002, 0.003]), *below[(u > 0.12) & (u < 0.42)]])
        P, _ = obst.clear(P, 0.0005, keep_start=0.002, ignore_start=from_ut, tag=(f'Tubal_branch_{side}', f'new_tubal_{side}'))
        tubal = (P, np.full(len(P), 0.0005))
        pieces.append(_piece(f'Tubal_branch_of_uterine_artery_{side}', 'Tubal branch of uterine artery', 'arterial', [tubal], 8, SRC, n_ad))
        obst.add_tube(f'new_tubal_{side}', *tubal)

        # ── Rama ovárica: sobre el ligamento propio del ovario, hasta el hilio (se une a la arteria ovárica) ──
        Lp = Fm[f'ovary_ligament_{side}'][::-1]                       # del cuerno al ovario
        Lt = np.gradient(Lp, axis=0); Lt /= np.linalg.norm(Lt, axis=1)[:, None]
        up = np.array([_unit(np.array([0, 0, 1.0]) - t * t[2]) for t in Lt])
        above = Lp + up * (0.0025 + 0.0005 + 0.0006 + 0.0012)
        v = np.linspace(0, 1, len(Lp))
        P = spline([E, E + np.array([0, 0.002, -0.002]), *above[(v > 0.2) & (v < 0.75)], H, inside])
        P, _ = obst.clear(P, 0.0005, keep_start=0.002, keep_end=0.003, ignore_start=from_ut + (f'new_tubal_{side}',),
                          ignore_end=ovary + [f'new_ovarian_artery_{side}'], tag=(f'Ovarian_branch_{side}', f'new_ovarian_branch_{side}'))
        ovbr = (P, np.full(len(P), 0.0005))
        pieces.append(_piece(f'Ovarian_branch_of_uterine_artery_{side}', 'Ovarian branch of uterine artery', 'arterial', [ovbr], 8, SRC, n_ad))
        obst.add_tube(f'new_ovarian_branch_{side}', *ovbr)

        # ── Ramas vaginales: del istmo, por el borde del cuello (su porción supravaginal: la vaginal está dentro de la
        # vagina) y por la pared lateral de la vagina ──
        cerv = wavy(uterus, 0.37, S_VAULT, sx, 0.0021, amp_b=0.0012, wave=0.009, ramp=0.002)
        vag = [vagina.side(t, sx, 0.0021, 0.0008 * np.sin(9 * t)) for t in np.linspace(0.84, 0.32, 11)]
        P = spline([ut_art[0][max(0, i3 - 2)], ut_art[0][i3], *cerv[::3], *vag])
        r = np.linspace(0.0007, 0.0005, len(P))
        P, _ = obst.clear(P, r, keep_start=0.002, ignore_start=(f'new_uterine_artery_{side}',),
                          tag=(f'Vaginal_branches_{side}', f'new_vaginal_{side}'))
        vagb = (P, r)
        pieces.append(_piece(f'Vaginal_branches_of_uterine_artery_{side}', 'Vaginal branches of uterine artery', 'arterial', [vagb], 8, SRC, n_ad))
        obst.add_tube(f'new_vaginal_{side}', *vagb)
        log(f'  ramas de la uterina {side}: tubárica {len(tubal[0])}, ovárica {len(ovbr[0])}, vaginales {len(vagb[0])} anillos')

        # ── Vena ovárica: la testicular hasta la misma altura y, abajo, paralela a la arteria (3,2 mm) hasta 1,4 cm del
        # hilio; de ahí, tres venas finas del borde anterior del ovario (su plexo).
        vname = 'Left ovarian vein' if side == 'L' else 'Right ovarian vein'
        vtop = resample(TV[:int(np.argmax(TV[:, 2] < z_d)) + 1], 0.003)
        a_low = ov_art[0][n_top - 1:]
        s_low = arclength(a_low)
        lane = offset_along(a_low[:int(np.searchsorted(s_low, s_low[-1] - 0.014))], vtop[-1] - top[-1], 0.0032)
        P = extend(vtop, [*lane[6::6], lane[-1]])
        r = np.r_[np.linspace(0.0013, 0.0012, len(vtop)), np.linspace(0.0012, 0.001, len(P) - len(vtop))]
        P, w = obst.clear(P, r, keep_start=arclength(vtop)[-1], tag=(vname, f'new_ovarian_vein_{side}'))
        main = (P, r)
        roots = []
        for dz, dx in ((0.010, 0.002), (0.004, -0.002), (-0.008, 0.001)):
            tip, outer = ovary_c + np.array([sx * dx, -0.0075, dz]), ovary_c + np.array([sx * dx, -0.0128, dz])
            Q = spline([main[0][-3], main[0][-1], (main[0][-1] + outer) / 2 + np.array([0, -0.002, 0]), outer, tip])
            Q, _ = obst.clear(Q, 0.00055, keep_start=0.002, keep_end=0.003, ignore_end=ovary, tag=(vname, f'new_ovarian_vein_{side}'))
            roots.append((Q, np.full(len(Q), 0.00055)))
        pieces.append(_piece(vname.replace(' ', '_'), vname, 'venous', [main] + roots, 8, src_z(n_tv), n_tv))
        for k, q in enumerate([main] + roots): obst.add_tube(f'new_ovarian_vein_{side}_{k}', *q)
        log(f'  vena ovárica {side}: {len(P)} anillos y {len(roots)} venas del plexo; desvío máximo {w * 1000:.1f} mm')

        # ── Plexo venoso uterino: dos cordones (5 mm por delante y por detrás del borde), cuatro venas que los unen por
        # fuera de la arteria y una que sube al ovario sobre la rama ovárica ──
        r_pl, b_pl = 0.0008, 0.0055
        strands = []
        for b0, ph in ((b_pl, 0.0), (-b_pl, np.pi)):
            low = [vagina.side(t, sx, r_pl + 0.0012, 0.8 * b0) for t in (0.55, 0.68, 0.80)]
            up = wavy(uterus, S_VAULT + 0.04, 0.68, sx, r_pl + 0.0012, b0=b0, amp_b=0.0007, amp_n=0.0008, wave=0.009, phase=ph, ramp=0.0)
            Q, _ = obst.clear(spline([*low, *up[::6], up[-1]]), r_pl, tag=(f'Uterine_venous_plexus_{side}', f'new_plexus_{side}'))
            strands.append((Q, np.full(len(Q), r_pl)))
        rungs = []
        for k, s_k in enumerate((0.22, 0.34, 0.47, 0.59)):           # oblicuas, alternadas: una red y no una escalera
            ds = 0.05 if k % 2 else -0.05
            a, b = uterus.side(s_k, sx, r_pl + 0.0012, b_pl), uterus.side(s_k + ds, sx, r_pl + 0.0012, -b_pl)
            apex = uterus.side(s_k + ds / 2, sx, 0.0075)
            Q = spline([a, apex, b])
            Q, _ = obst.clear(Q, 0.0006, keep_start=0.0015, keep_end=0.0015, tag=(f'Uterine_venous_plexus_{side}', f'new_plexus_{side}'))
            rungs.append((Q, np.full(len(Q), 0.0006)))
        Q = spline([strands[0][0][-3], strands[0][0][-1], *(above[(v > 0.25) & (v < 0.7)] + np.array([0, -0.0015, 0.0035]))[::2],
                    ovary_c + np.array([0, -0.0125, -0.006]), ovary_c + np.array([0, -0.0075, -0.006])])
        Q, _ = obst.clear(Q, 0.0006, keep_start=0.002, keep_end=0.003, ignore_end=ovary + [f'new_ovarian_vein_{side}_{k}' for k in range(4)],
                          tag=(f'Uterine_venous_plexus_{side}', f'new_plexus_{side}'))
        comm = (Q, np.full(len(Q), 0.0006))
        pieces.append(_piece(f'Uterine_venous_plexus_{side}', 'Uterine venous plexus', 'venous', strands + rungs + [comm], 8, SRC, n_iv))
        for k, q in enumerate(strands + rungs + [comm]): obst.add_tube(f'new_plexus_{side}_{k}', *q)

        # ── Venas uterinas: del plexo, a la altura del istmo, a la ilíaca interna, una por encima y otra por debajo de la
        # arteria (3,4 mm) ──
        prox = ut_art[0][:i3 + 1][::-1]                              # del istmo al origen
        iv_end = at_fraction(IV, 0.85)                               # cerca del extremo inferior de la ilíaca interna
        veins = []
        for k, (st, _) in enumerate(strands):
            start = st[int(np.argmin(np.linalg.norm(st - U3, axis=1)))]
            lane = offset_along(prox, [0, 0, 1.0] if k == 0 else [0, 0, -1.0], 0.0034)
            cut = max(4, len(lane) - int(0.010 / STEP))
            Q = spline([start, *lane[3:cut:5], lane[cut - 1], iv_end])
            Q, _ = obst.clear(Q, 0.0012, keep_start=0.0015, keep_end=0.004, ignore_start=(f'new_plexus_{side}_{k}',),
                              ignore_end=(n_iv,), tag=(f'Uterine_veins_{side}', f'new_uterine_vein_{side}'))
            veins.append((Q, np.full(len(Q), 0.0012)))
        pieces.append(_piece(f'Uterine_veins_{side}', 'Uterine veins', 'venous', veins, 10, SRC, n_iv))
        for k, q in enumerate(veins): obst.add_tube(f'new_uterine_vein_{side}_{k}', *q)
    left = obst.collisions()
    log('  choques que quedan (puntos con la pared a más de 0,2 mm dentro de algo):',
        {p: c for p, c in left.items()} if left else 'ninguno')
    return pieces
