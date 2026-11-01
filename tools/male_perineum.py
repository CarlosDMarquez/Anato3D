"""Periné masculino: músculos del triángulo urogenital, membrana perineal y cuerpo perineal.

Z-Anatomy tampoco los tiene en el hombre: solo el suelo de la pelvis y el esfínter externo del ano. Aquí se generan
sobre sus órganos ya ajustados al cuerpo (raíces de los cuerpos cavernosos, bulbo del cuerpo esponjoso, uretra y
próstata), con los generadores de mallas del periné femenino (female_perineum.py). Cada músculo envuelve el órgano que
cubre con la sección medida sobre él: se corta el órgano con planos y se mide el radio de cada corte cada 5° (con
elipses, las láminas salían planas y separadas del bulbo, como ladrillos).

Anatomía del adulto (Gray, Netter, Oelrich 1980):
  - isquiocavernoso: cubre la cara libre de cada raíz (pilar) del pene, de la tuberosidad isquiática y la rama
    isquiopubiana a la unión de las raíces bajo la sínfisis; más grueso que en la mujer;
  - bulboesponjoso: dos mitades unidas por un rafe bajo el bulbo del pene; nacen del cuerpo perineal y del rafe,
    rodean el bulbo por abajo y por los lados y se fijan en la membrana perineal;
  - transverso superficial del periné: de la tuberosidad al cuerpo perineal;
  - membrana perineal: lámina triangular entre las ramas isquiopubianas, bajo la próstata; las raíces y el bulbo se
    fijan en su cara inferior;
  - transverso profundo del periné: sobre la membrana, de la rama al cuerpo perineal;
  - esfínter externo de la uretra: en herradura, abierto hacia atrás, alrededor de la uretra membranosa, y sube por la
    cara anterior de la próstata;
  - cuerpo perineal: nudo fibromuscular entre el bulbo y el conducto anal.
En Z-Anatomy la próstata se apoya en el bulbo: falta la uretra membranosa (1–2 cm entre los dos). El esfínter es una
funda sobre el vértice de la próstata, por donde sale la uretra, y la membrana pasa entre la próstata y el bulbo, en
los ~3 mm que quedan.
Coordenadas de Blender: Z arriba, delante = −Y, izquierda = +X.
"""
import numpy as np
from mathutils import Vector, bvhtree, kdtree
from female_organs import landmarks, tube, ellipsoid, curve, _unit
from female_perineum import rami, ramus_medial, shell, slab, _frames

DIRS = [Vector(d) for d in ((1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1))]


class Organ:
    """Malla de un órgano en coordenadas de mundo (m), con caras triangulares: BVH, orientación y cortes."""
    def __init__(self, V, F):
        self.V = np.asarray(V, float); self.F = np.asarray(F, int)
        self.T = bvhtree.BVHTree.FromPolygons([Vector(v) for v in self.V], self.F.tolist())
        a, b, c = (self.V[self.F[:, k]] for k in range(3))
        self.sign = 1.0 if np.einsum('ij,ij->i', a, np.cross(b, c)).sum() >= 0 else -1.0

    def section(self, o, n, dense=4):
        """Puntos del corte con el plano que pasa por o con normal n: cada segmento del corte, en `dense` tramos."""
        d = (self.V - o) @ n
        P, M = [], []
        for i, j in ((0, 1), (1, 2), (2, 0)):
            a, b = self.F[:, i], self.F[:, j]
            m = (d[a] < 0) != (d[b] < 0)
            t = np.where(m, d[a] / np.where(m, d[a] - d[b], 1.0), 0.0)
            P.append(self.V[a] + t[:, None] * (self.V[b] - self.V[a])); M.append(m)
        P, M = np.stack(P, 1), np.stack(M, 1)
        sel = M.sum(1) == 2
        P, M = P[sel], M[sel]
        k = np.argsort(~M, axis=1, kind='stable')[:, :2]                 # las dos aristas cortadas de cada triángulo
        a, b = P[np.arange(len(P)), k[:, 0]], P[np.arange(len(P)), k[:, 1]]
        u = np.linspace(0, 1, dense + 1)
        return (a[:, None] + (b - a)[:, None] * u[None, :, None]).reshape(-1, 3)

    def inside(self, p):
        odd = 0
        for d in DIRS:
            o, n = Vector(p), 0
            while n < 16:
                hit = self.T.ray_cast(o + d * 1e-5, d)[0]
                if hit is None: break
                n += 1; o = hit
            odd += n % 2
        return odd >= 4

    def top(self, x, y, z0):
        """Altura de la cara superior del órgano bajo (x, y), mirando hacia abajo desde z0; None si no está debajo."""
        hit = self.T.ray_cast(Vector((x, y, z0)), Vector((0, 0, -1)), 0.2)[0]
        return None if hit is None else hit.z

    def bottom(self, x, y, z0):
        hit = self.T.ray_cast(Vector((x, y, z0)), Vector((0, 0, 1)), 0.2)[0]
        return None if hit is None else hit.z


def _smooth(A, passes, fixed_ends=True):
    A = np.array(A, float)
    for _ in range(passes):
        B = A.copy(); B[1:-1] = (A[:-2] + 2 * A[1:-1] + A[2:]) / 4
        if not fixed_ends: B[0] = (2 * A[0] + A[1]) / 3; B[-1] = (2 * A[-1] + A[-2]) / 3
        A = B
    return A


ANG = np.radians(np.arange(-180.0, 180.0, 5.0))                        # ángulos del perfil de cada corte


def measure(org, p0, p1, n, ref, keep=None):
    """Eje y perfil de la parte de un órgano entre p0 y p1, cortada con planos perpendiculares a p0→p1:
    (camino (n, 3) por el centro de cada corte, marcos (N, B) transportados desde `ref`, R (n, len(ANG)): radio del corte
    en cada ángulo de ANG, medido desde N hacia B). `keep(q, p)`: máscara de los puntos del corte que son de esa parte
    (p. ej. un solo lado). Las láminas que envuelven el órgano siguen así su forma, no una elipse."""
    ax = _unit(p1 - p0)
    path = p0 + np.outer(np.linspace(0, 1, n), p1 - p0)
    secs = []
    for p in path:
        q = org.section(p, ax)
        if keep is not None and len(q): q = q[keep(q, p)]
        secs.append(q)
    ok = np.array([len(q) >= 8 for q in secs])
    fill = lambda A: np.interp(np.arange(n), np.flatnonzero(ok), A[ok])
    for _ in range(2):                                                    # centra el camino en cada corte
        T, N, B = _frames(path, np.asarray(ref, float))
        for i, q in enumerate(secs):
            if not ok[i]: continue
            u, v = (q - path[i]) @ N[i], (q - path[i]) @ B[i]
            path[i] = path[i] + N[i] * (u.max() + u.min()) / 2 + B[i] * (v.max() + v.min()) / 2
        path = _smooth(np.column_stack([fill(path[:, k]) for k in range(3)]), 2)
    T, N, B = _frames(path, np.asarray(ref, float))
    R = np.zeros((n, len(ANG)))
    for i, q in enumerate(secs):
        if not ok[i]: continue
        u, v = (q - path[i]) @ N[i], (q - path[i]) @ B[i]
        phi, rho = np.arctan2(v, u), np.hypot(u, v)
        diff = np.abs((phi[None] - ANG[:, None] + np.pi) % (2 * np.pi) - np.pi)
        r = np.where(diff < np.radians(6), rho[None], 0.0).max(1)
        R[i] = np.interp(ANG, ANG[r > 0], r[r > 0], period=2 * np.pi) if (r > 0).sum() > 3 else rho.max()
    R = np.column_stack([fill(R[:, j]) for j in range(len(ANG))])
    for _ in range(2):                                                    # suave alrededor y a lo largo
        R = (np.roll(R, 1, 1) + 2 * R + np.roll(R, -1, 1)) / 4
    R = _smooth(R, 2)
    return path, N, B, R


def profile_of(R):
    return lambda i, th: np.interp(th, ANG, R[i], period=2 * np.pi)


def angle_of(d, N, B):
    """Ángulo de la dirección d en el marco (N, B) de cada anillo."""
    return np.arctan2(B @ d, N @ d)


def centerline(org, r=0.0035, iters=6):
    """Línea central de un tubo (la uretra): cada vértice va a la media de sus vecinos a menos de r, varias veces."""
    P = org.V.copy()
    for _ in range(iters):
        kd = kdtree.KDTree(len(P))
        for i, p in enumerate(P): kd.insert(p, i)
        kd.balance()
        P = np.array([np.mean([P[j] for _, j, _ in kd.find_range(p, r)], axis=0) for p in P])
    return P


def frame(objs, organs, anal=None):
    """Referencias del periné masculino (m). `objs`: huesos de la Fase 2 (por nombre, sin sufijos); `organs`: dict con
    (vértices, caras triangulares) de 'cc' (cuerpos cavernosos), 'cs' (cuerpo esponjoso), 'urethra' y 'prostate', ya
    ajustados al cuerpo; `anal`: vértices del esfínter externo del ano, si se tienen."""
    L = landmarks(objs)
    F = {'L': L, 'ps_bottom': np.array([0.0, L['ps_bottom'][1], L['ps_bottom'][2]])}
    F['ramus'], F['ramus_dir'], F['hip'] = rami(objs, L)
    O = F['org'] = {k: Organ(*v) for k, v in organs.items()}
    cc, cs = O['cc'].V, O['cs'].V
    # Unión de las raíces: yendo hacia delante, donde la separación entre la izquierda y la derecha baja de 3 mm.
    root = cc[cc[:, 1] > F['ps_bottom'][1]]
    y_join = root[:, 1].min()
    for y in np.arange(root[:, 1].max() - 0.004, root[:, 1].min(), -0.001):
        band = root[np.abs(root[:, 1] - y) < 0.001]
        l, r = band[band[:, 0] > 0], band[band[:, 0] < 0]
        if len(l) and len(r) and l[:, 0].min() - r[:, 0].max() < 0.003: y_join = y; break
    F['y_join'] = y_join
    # Raíces (pilares): la parte de cada lado por detrás de la unión, de su extremo posterior a la unión.
    F['crus'] = {}
    for s, sx in (('L', 1.0), ('R', -1.0)):
        P = cc[(cc[:, 0] * sx > 0.001) & (cc[:, 1] > y_join)]
        c = P.mean(0); ax = np.linalg.svd(P - c)[2][0]
        ax = ax if ax[1] > 0 else -ax                                     # hacia atrás
        t = (P - c) @ ax
        p0, p1 = c + ax * (t.max() - 0.002), c + ax * (t.min() + 0.004)   # extremo posterior → unión
        m = F['ramus_dir'][s]
        F['crus'][s] = measure(O['cc'], p0, p1, 16, m, keep=lambda q, p, sx=sx: (q[:, 0] * sx > 0) & (np.linalg.norm(q - p, axis=1) < 0.012))
    # Bulbo: la parte del cuerpo esponjoso por detrás de la sínfisis, de su extremo posterior hacia delante, y 1 cm más
    # del cuerpo esponjoso (las fibras anteriores del bulboesponjoso lo rodean).
    B = cs[cs[:, 1] > F['ps_bottom'][1] - 0.012]
    back = B[B[:, 1] > B[:, 1].max() - 0.003].mean(0)
    front_y = F['ps_bottom'][1] - 0.010
    front = B[np.abs(B[:, 1] - front_y) < 0.003].mean(0)
    F['bulb'] = measure(O['cs'], back + _unit(front - back) * 0.0015, front, 22, (0.0, 0.0, 1.0),
                        keep=lambda q, p: np.linalg.norm(q - p, axis=1) < 0.015)
    F['bulb_back'] = B[np.argmax(B[:, 1])]
    # Cuerpo perineal: detrás del bulbo y delante del ano.
    bb = F['bulb_back']
    if anal is not None and len(anal):
        a_front = anal[np.argmin(anal[:, 1])]
        F['perineal_body'] = np.array([0.0, (bb[1] + a_front[1]) / 2, bb[2] + 0.002])
    else:
        F['perineal_body'] = np.array([0.0, bb[1] + 0.010, bb[2] + 0.002])
    # Punto por donde la uretra sale de la próstata (abajo y delante): el de su línea central, fuera de la próstata y por
    # debajo de su centro, más cercano a ella.
    C = centerline(O['urethra'])
    pr = O['prostate']
    low = np.array([not pr.inside(p) for p in C]) & (C[:, 2] < pr.V[:, 2].mean())
    dist = np.array([(Vector(p) - pr.T.find_nearest(Vector(p))[0]).length for p in C])
    F['urethra_exit'] = C[low][np.argmin(dist[low])]
    # Altura de la membrana en cada fila (de la unión de las raíces a la línea de las tuberosidades).
    F['y_front'] = y_join - 0.004
    F['y_back'] = F['perineal_body'][1] - 0.002
    return F


def push_out(V, Fc, organs, gap=0.0004):
    """Lleva fuera de los órganos (a `gap` de su superficie) los vértices que quedan dentro, y extiende el
    desplazamiento con suavidad a sus vecinos. Devuelve cuántos se movieron."""
    D = np.zeros_like(V); fixed = np.zeros(len(V), bool)
    for i, p in enumerate(V):
        for org in organs:
            loc, nrm, _, dist = org.T.find_nearest(Vector(p))
            if loc is None or dist > 0.02: continue
            if (Vector(p) - loc).dot(nrm) * org.sign > 0 or not org.inside(p): continue
            D[i] = np.array(loc + nrm * org.sign * gap) - p; fixed[i] = True; break
    if fixed.any():
        E = np.array([(f[k], f[(k + 1) % len(f)]) for f in Fc for k in range(len(f))])
        deg = np.maximum(np.bincount(E.ravel(), minlength=len(V)), 1)[:, None]
        D0 = D.copy()
        for _ in range(6):
            acc = np.zeros_like(D); np.add.at(acc, E[:, 0], D[E[:, 1]]); np.add.at(acc, E[:, 1], D[E[:, 0]])
            D = np.where(fixed[:, None], D0, 0.5 * D + 0.5 * acc / deg)
        V += D
    return int(fixed.sum())


def _membrane(F, nu=13, nv=29):
    """Membrana perineal: una lámina de rama a rama, sobre las raíces y el bulbo y bajo la próstata y la uretra."""
    O = F['org']
    roots = [O['cc'], O['cs']]
    above = [O['prostate'], O['urethra']]
    z_hi = F['L']['ps_top'][2]
    ys = np.linspace(F['y_front'], F['y_back'], nu)
    rows = []
    for y in ys:
        xs = np.linspace(-0.035, 0.035, 71)
        tops = [max([z for z in (o.top(x, y, z_hi) for o in roots) if z is not None], default=None) for x in xs]
        z_row = max([z for z in tops if z is not None], default=F['bulb_back'][2]) + 0.0012
        lim = {}
        for s, sx in (('L', 1.0), ('R', -1.0)):                           # hasta la cara medial de la rama
            hit = F['hip'][s].ray_cast(Vector((0.0, y, z_row)), Vector((sx, 0.0, 0.0)), 0.08)[0]
            lim[s] = (hit.x - sx * 0.0005) if hit is not None else sx * 0.03
        X = np.linspace(lim['R'], lim['L'], nv)
        Z = []
        for x in X:
            low = max([z for z in (o.top(x, y, z_hi) for o in roots) if z is not None], default=-1.0)
            cap = min([z for z in (o.bottom(x, y, low + 0.0002 if low > 0 else z_row - 0.02) for o in above) if z is not None], default=9.0)
            Z.append([low, cap])
        Z = np.array(Z)
        z = np.minimum(z_row, Z[:, 1] - 0.0008)
        rows.append((X, z, Z[:, 0]))
    P = np.zeros((nu, nv, 3)); lo = np.zeros((nu, nv))
    for i, (X, z, low) in enumerate(rows):
        P[i, :, 0], P[i, :, 1], P[i, :, 2] = X, ys[i], z; lo[i] = low
    # Suave, pero siempre sobre las raíces y el bulbo (se fijan en su cara inferior).
    for _ in range(6):
        Q = P[:, :, 2].copy()
        Q[1:-1, 1:-1] = (P[:-2, 1:-1, 2] + P[2:, 1:-1, 2] + P[1:-1, :-2, 2] + P[1:-1, 2:, 2] + 4 * P[1:-1, 1:-1, 2]) / 8
        P[:, :, 2] = np.maximum(Q, lo + 0.0006)
    return slab(P, 0.0009)


def perineal_muscles(F):
    """Músculos del periné masculino y sus láminas fibrosas: lista de dicts (name, en, tissue, V, F, superficial)."""
    out = []
    O = F['org']
    def add(name, en, V, Fc, tissue='muscle', superficial=False, avoid=('cc', 'cs', 'prostate', 'urethra')):
        V = np.asarray(V, float).copy()
        moved = sum(push_out(V, Fc, [O[k] for k in avoid]) for _ in range(2))
        out.append({'name': name, 'en': en, 'tissue': tissue, 'V': V, 'F': Fc, 'superficial': superficial, 'pushed': moved})
    def extend(path, N, B, R, pts, r_end, at_start=False):
        """Añade al camino los puntos `pts` (desde su extremo), con el marco de ese extremo y el perfil yendo hacia un
        círculo de radio r_end."""
        k = len(pts); a = np.linspace(0, 1, k + 1)[1:][:, None]
        i = 0 if at_start else -1
        Rx = R[i] * (1 - a) + r_end * a
        Nx, Bx = np.repeat(N[i][None], k, 0), np.repeat(B[i][None], k, 0)
        if at_start:
            return (np.vstack([pts[::-1], path]), np.vstack([Nx[::-1], N]), np.vstack([Bx[::-1], B]), np.vstack([Rx[::-1], R]))
        return np.vstack([path, pts]), np.vstack([N, Nx]), np.vstack([B, Bx]), np.vstack([R, Rx])
    pb = F['perineal_body']
    for s, sx in (('L', 1.0), ('R', -1.0)):
        E, m = F['ramus'][s], F['ramus_dir'][s]
        # Isquiocavernoso: envuelve la cara libre de la raíz (la que no toca el hueso), de la unión de las raíces a la
        # tuberosidad, donde nace.
        path, N, B, R = (A[::-1] for A in F['crus'][s])                   # de la unión a la tuberosidad
        tail = (path[-1] + E[-3] + m * 0.004) / 2                         # hacia la tuberosidad, sin llegar a ser un hilo
        ext = curve([path[-1], (path[-1] + tail) / 2 + np.array([0, 0, -0.0005]), tail], 4)[1:]
        P, N, B, R = extend(path, N, B, R, ext, 0.003)
        n = len(P); t = np.linspace(0, 1, n)
        c = angle_of(m, N, B)                                             # centrada en la cara libre
        w = np.interp(t, [0, 0.18, 0.85, 1], [0.2, 0.62, 0.62, 0.5]) * np.pi   # se afila en los extremos
        V, Fc = shell(P, 0, 0, None, th0=c - w, th1=c + w, gap=0.0004, seg=22, frames=(N, B), profile=profile_of(R),
                      thick=np.interp(t, [0, 0.15, 0.6, 1], [0.0003, 0.0022, 0.0030, 0.0016]))
        add(f'Ischiocavernosus_muscle_{s}', 'Ischiocavernosus muscle', V, Fc, superficial=True)
        # Bulboesponjoso: cada mitad, del rafe bajo el bulbo (abajo, en la línea media) por su cara lateral; por detrás,
        # desde el cuerpo perineal; por delante rodea el cuerpo esponjoso y se adelgaza.
        path, N, B, R = F['bulb']                                         # de atrás hacia delante
        back = curve([pb + np.array([0, -0.001, -0.002]), (pb + path[0]) / 2 + np.array([0, 0, -0.002]), path[0]], 5)[:-1]
        P, N, B, R = extend(path, N, B, R, back[::-1], 0.003, at_start=True)
        n = len(P); t = np.linspace(0, 1, n)
        bot = angle_of(np.array([0, 0, -1.0]), N, B)
        lat = angle_of(np.array([sx, 0, 0]), N, B)
        sg = np.sign(np.median((lat - bot + np.pi) % (2 * np.pi) - np.pi))  # hacia qué lado gira, del rafe al lado
        w = np.interp(t, [0, 0.25, 0.7, 1], [0.3, 0.75, 0.75, 0.5]) * np.pi
        th0, th1 = (bot + 0.005 * np.pi, bot + w) if sg > 0 else (bot - w, bot - 0.005 * np.pi)
        V, Fc = shell(P, 0, 0, None, th0=th0, th1=th1, gap=0.0004, seg=24, frames=(N, B), profile=profile_of(R),
                      thick=np.interp(t, [0, 0.2, 0.7, 1], [0.0006, 0.0028, 0.0024, 0.0002]))
        add(f'Bulbospongiosus_muscle_{s}', 'Bulbospongiosus muscle', V, Fc, superficial=True)
        # Transverso superficial del periné: de la cara medial de la tuberosidad al cuerpo perineal.
        a0 = E[-3] + m * 0.005
        b0 = np.array([sx * 0.006, pb[1], pb[2] - 0.002])
        path = curve([a0, (a0 + b0) / 2 + np.array([0, 0.001, -0.002]), b0], 12)
        V, Fc = tube(path, np.linspace(0.0030, 0.0036, 12), np.linspace(0.0012, 0.0015, 12), seg=12, ref=(0.0, 1.0, 0.0))
        add(f'Superficial_transverse_perineal_muscle_{s}', 'Superficial transverse perineal muscle', V, Fc, superficial=True)
        # Transverso profundo del periné: sobre la membrana, de la rama junto a la tuberosidad al cuerpo perineal.
        a0 = ramus_medial(F, s, 0.8, 0.010)
        b0 = np.array([sx * 0.006, pb[1] - 0.002, pb[2] + 0.007])
        path = curve([a0, (a0 + b0) / 2 + np.array([0, 0.0, 0.002]), b0], 12)
        V, Fc = tube(path, 0.0045, 0.0015, seg=12, ref=(0.0, 1.0, 0.0))
        add(f'Deep_transverse_perineal_muscle_{s}', 'Deep transverse perineal muscle', V, Fc)
    # Membrana perineal: una sola lámina (en la mujer, dos: la vagina la divide).
    V, Fc = _membrane(F)
    add('Perineal_membrane', 'Perineal membrane', V, Fc, tissue='tendon', avoid=('cc', 'cs', 'prostate'))
    # Esfínter externo de la uretra: funda en herradura sobre el vértice de la próstata, abierta hacia atrás, que abajo
    # rodea casi entera la salida de la uretra y sube estrechándose por la cara anterior. Un anillo propio alrededor de
    # la uretra no cabe: en Z-Anatomy sale de la próstata entre el bulbo y la unión de las raíces (no hay uretra
    # membranosa), y salía arrugado entre los tres.
    pr = O['prostate']
    z_lo, h = pr.V[:, 2].min(), np.ptp(pr.V[:, 2])
    ex = F['urethra_exit']
    path, N, B, R = measure(pr, np.array([0.0, ex[1] + 0.006, z_lo + 0.001]), np.array([0.0, ex[1] + 0.006, z_lo + 0.6 * h]), 12,
                            (0.0, -1.0, 0.0))
    t = np.linspace(0, 1, len(path))
    c = angle_of(np.array([0, -1.0, 0]), N, B)                            # centrada delante
    w = np.interp(t, [0, 0.3, 1], [0.8, 0.6, 0.35]) * np.pi
    V, Fc = shell(path, 0, 0, None, th0=c - w, th1=c + w, gap=0.0004, seg=26, frames=(N, B), profile=profile_of(R),
                  thick=np.interp(t, [0, 0.12, 0.4, 1], [0.0008, 0.0024, 0.0018, 0.0003]))
    add('External_urethral_sphincter', 'External urethral sphincter', V, Fc, avoid=('cc', 'cs', 'prostate'))
    # Cuerpo perineal: nudo fibromuscular entre el bulbo y el ano.
    V, Fc = ellipsoid(pb, [[0.0060, 0, 0], [0, 0.0048, 0], [0, 0, 0.0070]], bumps=lambda d: 1 - 0.2 * np.clip(d[:, 2], 0, 1) ** 2)
    add('Perineal_body', 'Perineal body', V, Fc, tissue='tendon')
    return out
