"""Complexión musculosa: hombros, brazos y tórax más llenos, como en los atlas.

La piel de MakeHuman es la de un hombre delgado y los músculos de Z-Anatomy, ajustados a ella, también. Frente a una
imagen de referencia (vista anterior de un atlas 3D), con la misma estatura:
  - el brazo medía un ~20 % menos de ancho a la altura del deltoides;
  - el antebrazo, un ~20 % menos bajo el codo;
  - el trapecio apenas subía por el cuello.

Cómo:
  - La piel sale un abultamiento por músculo (`targets`), medido contra la referencia: deltoides 13 mm hacia fuera,
    bíceps y tríceps 8, antebrazo bajo el codo 6–8 (nada en la muñeca), pectoral 9, trapecio superior 14, esternocleidomastoideo 4, dorsal ancho
    y serrato 8, flancos 10, pantorrilla 7–8. Se suaviza sobre la malla y va según la normal suavizada.
    - Donde la piel tiene otra piel enfrente (el brazo frente al tórax), sale como mucho un tercio del hueco.
    - Antes era un factor de engrosamiento por región × la distancia al hueso: sobre el hombro, que el paso del
      deltoides ya había inflado 23 mm, salía cuadrado, como una hombrera.
  - Un campo de desplazamiento en el volumen (rejilla de 6 mm) arrastra con ella lo que hay dentro: es cero en los
    huesos, igual al de la piel en la piel y armónico (Laplace) entre medias.
    - anato3d_fit.Fitter lo aplica a todo lo que ajusta (músculos, vasos, nervios, vísceras). Así todo se engrosa a la
      vez y nada se cruza: el músculo junto a la piel sale tanto como ella y el que está sobre el hueso apenas se mueve.
"""
import numpy as np
from mathutils import Vector, bvhtree, kdtree

from proportions import joints

SKULL_HAND = ('Frontal', 'Parietal', 'Occipital', 'Temporal', 'Sphenoid', 'Ethmoid', 'Mandible', 'Maxilla', 'Zygomatic',
              'Nasal', 'Lacrimal', 'Palatine', 'Vomer', 'Inferior_Nasal_Concha', 'Tooth', 'Hyoid', 'Capitate', 'Hamate',
              'Lunate', 'Pisiform', 'Scaphoid', 'Trapezium', 'Trapezoid', 'Triquetrum', 'Metacarpal', 'Phalanx_Hand')


def _smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def _averager(edges, n):
    deg = np.maximum(np.bincount(edges.ravel(), minlength=n), 1)
    def avg(x):
        acc = np.zeros_like(x)
        np.add.at(acc, edges[:, 0], x[edges[:, 1]]); np.add.at(acc, edges[:, 1], x[edges[:, 0]])
        return acc / (deg if x.ndim == 1 else deg[:, None])
    return avg


def _tent(x, a, b, c):
    """0 hasta a, sube a 1 en b y vuelve a 0 en c (con curvas suaves)."""
    return _smoothstep(a, b, x) * (1 - _smoothstep(b, c, x))


def targets(W, N, nearest, world, objs):
    """Cuánto sale la piel (m) en cada vértice: un abultamiento por músculo, medido contra la imagen de referencia."""
    mm = np.zeros(len(W))
    is_ = lambda *names: np.any([np.char.startswith(nearest, n) for n in names], axis=0)
    for side in 'LR':
        J = joints(world, objs, side)
        sh, el, wr = J['shoulder'], J['elbow'], J['wrist']
        out = np.array([np.sign(sh[0]), 0, 0]); fwd = np.array([0, -1.0, 0])     # hacia fuera y hacia delante
        mine = np.sign(W[:, 0]) == np.sign(sh[0])

        def frame(a, b):
            """Posición a lo largo del segmento a→b (0–1), distancia al eje y orientación del radio."""
            ax = (b - a) / np.linalg.norm(b - a)
            t = (W - a) @ ax / np.linalg.norm(b - a)
            rv = (W - a) - np.outer((W - a) @ ax, ax); r = np.linalg.norm(rv, axis=1)
            rh = rv / np.maximum(r, 1e-6)[:, None]
            lat = rh @ (out - (out @ ax) * ax); front = rh @ (fwd - (fwd @ ax) * ax)
            return t, r, np.maximum(lat, 0), np.maximum(-lat, 0), np.maximum(front, 0), np.maximum(-front, 0)

        # Brazo: deltoides (más ancho hacia fuera, como en la referencia: +13 mm), bíceps delante, tríceps detrás.
        t, r, lat, med, fr, bk = frame(sh, el)
        arm = mine & is_('Humerus', 'Scapula', 'Clavicle') & (r < 0.09)
        k = 1 - _smoothstep(0.055, 0.09, r)
        mm[arm] += (k * (_tent(t, -0.12, 0.18, 0.52) * (13 * lat + 8 * (fr + bk))
                         + _tent(t, 0.3, 0.62, 0.95) * 8 * fr + _tent(t, 0.2, 0.45, 0.9) * 8 * bk
                         + _tent(t, 0.35, 0.7, 1.0) * 3 * (lat + med)))[arm]
        # Antebrazo (palma hacia delante): flexores delante, extensores detrás, braquiorradial por fuera; en la muñeca,
        # solo tendones.
        t, r, lat, med, fr, bk = frame(el, wr)
        fore = mine & is_('Radius', 'Ulna', 'Humerus') & (r < 0.07) & (t > -0.15)
        k = 1 - _smoothstep(0.045, 0.07, r)
        mm[fore] += (k * (_tent(t, -0.05, 0.25, 0.65) * 6 * fr + _tent(t, -0.05, 0.22, 0.6) * 6 * bk
                          + _tent(t, -0.1, 0.15, 0.55) * 8 * lat + _tent(t, -0.05, 0.25, 0.6) * 4 * med))[fore]
        # Pectoral mayor: del esternón al pliegue axilar y de la clavícula a su borde inferior.
        u = np.abs(W[:, 0]) / abs(sh[0]); v = (W[:, 2] - (sh[2] - 0.19)) / 0.22
        chest = mine & is_('Rib', 'Costal', 'Sternum', 'Clavicle') & (N[:, 1] < -0.2)
        mm[chest] += (_tent(u, 0.05, 0.55, 1.0) * _tent(v, -0.08, 0.45, 1.05) * 9 * _smoothstep(-0.2, -0.6, N[:, 1]))[chest]
        # Trapecio superior: la pendiente de la base del cuello al acromion, en la piel que mira arriba o atrás. Antes el
        # abultamiento (22 mm) culminaba 8 cm por encima del hombro, en el propio cuello, y lo hinchaba por todos lados:
        # 13–14 cm de ancho a la altura de C2–C3 frente a 11 en MakeHuman, un tubo hasta la mandíbula.
        u = (np.abs(W[:, 0]) - 0.04) / (abs(sh[0]) - 0.04); dz = W[:, 2] - sh[2]
        facing = np.maximum(N[:, 2], N[:, 1])                  # arriba o atrás; no los lados del cuello
        trap = mine & (dz > -0.06) & (dz < 0.14) & (facing > 0.1)
        mm[trap] += (_tent(u, 0.05, 0.45, 0.95) * _tent(dz, -0.05, 0.03, 0.13) * 14 * _smoothstep(0.1, 0.5, facing))[trap]
        # Esternocleidomastoideo: de la apófisis mastoides a la articulación esternoclavicular. En la referencia forma una
        # «V» marcada; aquí era una cinta fina. Solo la piel sobre él (a menos de 4,5 cm de esa línea, que va de hueso a
        # hueso, 2–3 cm por debajo de la piel) y que mira hacia delante o afuera, para no volver a hinchar el cuello entero.
        T = world(objs[f'Temporal_Bone_{side}'])
        back = T[T[:, 1] > np.median(T[:, 1])]
        mastoid = back[np.argmin(back[:, 2])]                    # lo más bajo de la mitad posterior del temporal
        C = world(objs[f'Clavicle_{side}'])
        sterno = C[np.argsort(np.abs(C[:, 0]))[:max(3, len(C) // 20)]].mean(0)
        ax = sterno - mastoid; L = np.linalg.norm(ax); ax /= L
        t = (W - mastoid) @ ax / L
        d = np.linalg.norm((W - mastoid) - np.outer(t * L, ax), axis=1)
        scm = mine & (t > 0) & (t < 1) & (d < 0.045) & (N[:, 1] < 0.3)
        mm[scm] += (_tent(t, 0.05, 0.6, 1.0) * (1 - _smoothstep(0.03, 0.045, d)) * 4 * _smoothstep(0.3, -0.2, N[:, 1]))[scm]
        # Dorsal ancho y serrato: los lados del tórax bajo la axila (la referencia es más ancha ahí).
        lats = mine & is_('Rib', 'Costal', 'Scapula', 'Vertebra_T') & (np.abs(N[:, 0]) > 0.35) & (N[:, 1] > -0.6)
        mm[lats] += (_tent(dz, -0.42, -0.2, -0.04) * 8 * _smoothstep(0.35, 0.8, np.abs(N[:, 0])))[lats]
        # Flancos (oblicuo externo, dorsal ancho bajo): la cintura de la referencia es ~2 cm más ancha por lado.
        flank = mine & is_('Rib', 'Costal', 'Vertebra_T', 'Vertebra_L', 'Hip_Bone') & (np.abs(N[:, 0]) > 0.35)
        mm[flank] += (_tent(dz, -0.6, -0.43, -0.28) * 10 * _smoothstep(0.35, 0.8, np.abs(N[:, 0])))[flank]
        # Espalda alta: infraespinoso, redondo mayor, romboides.
        back = mine & is_('Scapula', 'Rib', 'Vertebra_T') & (N[:, 1] > 0.35)
        mm[back] += (_tent(dz, -0.24, -0.08, 0.04) * _tent(np.abs(W[:, 0]) / abs(sh[0]), 0.05, 0.55, 1.0) * 4)[back]
        # Pantorrilla (gemelos y sóleo): en la referencia, ~1 cm más ancha por lado.
        kn, an = J['knee'], J['ankle']
        t, r, lat, med, fr, bk = frame(kn, an)
        calf = mine & is_('Tibia', 'Fibula', 'Femur', 'Patella') & (r < 0.08) & (t > -0.1)
        k = 1 - _smoothstep(0.06, 0.08, r)
        mm[calf] += (k * _tent(t, 0.0, 0.3, 0.7) * (8 * (lat + med) + 7 * bk))[calf]
    return mm / 1000


def bones_bvh(bones, world):
    """Todos los huesos juntos (mundo) y el nombre del hueso de cada cara."""
    verts, faces, owner = [], [], []
    for name, o in bones.items():
        B = world(o); base = len(verts); verts += B.tolist()
        faces += [[base + i for i in p.vertices] for p in o.data.polygons]; owner += [name] * len(o.data.polygons)
    return bvhtree.BVHTree.FromPolygons(verts, faces), owner


def skin_target(W, N, edges, polys, BT, owner, world, objs):
    """Desplazamiento de cada vértice de piel (m, mundo) y un resumen."""
    nearest = np.array([owner[BT.find_nearest(Vector(w))[2]] for w in W], dtype=object)
    nearest = nearest.astype(str)
    avg = _averager(edges, len(W))
    mag = targets(W, N, nearest, world, objs)
    for h in SKULL_HAND: mag[np.char.find(nearest, h) >= 0] = 0
    for _ in range(20): mag = 0.5 * mag + 0.5 * avg(mag)
    # Normales suavizadas (en los pliegues cóncavos, las de cada vértice convergen y la piel haría un saliente).
    Ns = N.copy()
    for _ in range(30): Ns = 0.5 * Ns + 0.5 * avg(Ns)
    Ns /= np.linalg.norm(Ns, axis=1)[:, None]
    # Piel frente a piel (el brazo y el tórax, junto a la axila): como mucho un tercio del hueco.
    T = bvhtree.BVHTree.FromPolygons(W.tolist(), polys)
    limited = 0
    for i in np.where(mag > 1e-4)[0]:
        hit = T.ray_cast(Vector(W[i] + N[i] * 1e-4), Vector(N[i]), 0.06)[0]
        if hit is not None:
            g = (hit - Vector(W[i])).length
            if mag[i] > g / 3: mag[i] = g / 3; limited += 1
    for _ in range(6): mag = np.minimum(mag, 0.5 * mag + 0.5 * avg(mag) + 1e-4)
    report = {'max_mm': round(float(mag.max()) * 1000, 1), 'verts': int((mag > 5e-4).sum()), 'limited': limited}
    return Ns * mag[:, None], report


class Field:
    """Desplazamiento en una rejilla regular (m), muestreado con interpolación trilineal; fuera de ella, cero."""
    def __init__(self, origin, h, D):
        self.o = np.asarray(origin, float); self.h = float(h); self.D = np.asarray(D, np.float32)

    @classmethod
    def solve(cls, W, polys, disp, bones_bvh, h=0.006, iterations=600, omega=1.85, extend=False):
        """`extend`: fuera del cuerpo, el desplazamiento del vértice de piel más cercano en lugar de cero. Para el campo
        hombre→mujer: la boca de MakeHuman es una cavidad cerrada (fuera del cuerpo) y los dientes, el maxilar y la
        mandíbula, que la rodean, quedaban con desplazamiento cero (la mandíbula salía con 114 mm de error afín)."""
        active = np.linalg.norm(disp, axis=1) > 2e-4
        lo = np.maximum(W[active].min(0) - 0.04, W.min(0) - h)
        hi = np.minimum(W[active].max(0) + 0.04, W.max(0) + h)
        xs, ys, zs = (np.arange(lo[a], hi[a] + h, h) for a in range(3))
        n = (len(xs), len(ys), len(zs))
        T = bvhtree.BVHTree.FromPolygons(W.tolist(), polys)
        # Dentro del cuerpo: paridad de los cruces con la piel a lo largo de cada columna (en y).
        inside = np.zeros(n, bool)
        y0, y1 = W[:, 1].min() - 0.01, W[:, 1].max() + 0.01          # desde fuera del cuerpo entero
        for i, x in enumerate(xs):
            for k, z in enumerate(zs):
                o, hits = Vector((x, y0, z)), []
                while True:
                    hit = T.ray_cast(o, Vector((0, 1, 0)), y1 - o.y)[0]
                    if hit is None: break
                    hits.append(hit.y); o = hit + Vector((0, 1e-5, 0))
                for a, b in zip(hits[0::2], hits[1::2]): inside[i, (ys >= a) & (ys < b), k] = True
        # Piel: las celdas a un lado y otro de cada cruce toman el desplazamiento del vértice de piel más cercano.
        surf = np.zeros(n, bool)
        for a in range(3):
            d = np.diff(inside.astype(np.int8), axis=a) != 0
            lo_, hi_ = [slice(None)] * 3, [slice(None)] * 3
            lo_[a] = slice(0, -1); hi_[a] = slice(1, None)
            surf[tuple(lo_)] |= d; surf[tuple(hi_)] |= d
        kd = kdtree.KDTree(len(W))
        for i, w in enumerate(W): kd.insert(w, i)
        kd.balance()
        C = lambda idx: np.stack([xs[idx[0]], ys[idx[1]], zs[idx[2]]], 1)
        D = np.zeros(n + (3,), np.float32)
        si = np.nonzero(surf)
        D[si] = disp[[kd.find(p)[1] for p in C(si)]]
        # Hueso: cero dentro y a menos de una celda de su superficie.
        zero = np.zeros(n, bool)
        ii = np.nonzero(inside & ~surf)
        if bones_bvh is not None:                               # sin huesos (el campo hombre→mujer los mueve también)
            zero[ii] = [bones_bvh.find_nearest(Vector(p), 0.9 * h)[0] is not None for p in C(ii)]
        free = inside & ~surf & ~zero
        free[[0, -1], :, :] = free[:, [0, -1], :] = free[:, :, [0, -1]] = False
        # Laplace por sobrerrelajación rojo-negro sobre las celdas libres (índices planos).
        flat = D.reshape(-1, 3)
        stride = np.array([n[1] * n[2], n[2], 1])
        I, J, K = np.nonzero(free)
        color = (I + J + K) % 2
        idx = I * stride[0] + J * stride[1] + K * stride[2]
        groups = [idx[color == c] for c in (0, 1)]
        offs = [s * d for s in stride for d in (1, -1)]
        for it in range(iterations):
            change = 0.0
            for g in groups:
                avg = sum(flat[g + o] for o in offs) / 6
                delta = omega * (avg - flat[g])
                flat[g] += delta
                change = max(change, float(np.abs(delta).max()) if len(g) else 0.0)
            if change < 2e-6: break
        if extend:
            oi = np.nonzero(~inside & ~surf)
            D[oi] = disp[[kd.find(p)[1] for p in C(oi)]]
        f = cls(lo, h, D)
        f.report = {'grid': n, 'free': int(free.sum()), 'skin_cells': int(surf.sum()), 'bone_cells': int(zero.sum()),
                    'iterations': it + 1, 'last_change_um': round(change * 1e6, 2)}
        return f

    def save(self, path):
        np.savez_compressed(path, origin=self.o, h=self.h, D=self.D.astype(np.float16))

    @classmethod
    def load(cls, path):
        z = np.load(path)
        return cls(z['origin'], float(z['h']), z['D'].astype(np.float32))

    def sample(self, P):
        P = np.asarray(P, float)
        u = (P - self.o) / self.h
        n = np.array(self.D.shape[:3])
        ok = ((u >= 0) & (u <= n - 1.001)).all(1)
        out = np.zeros((len(P), 3))
        if not ok.any(): return out
        u = u[ok]; i = np.floor(u).astype(int); t = u - i
        acc = np.zeros((len(u), 3))
        for dx in (0, 1):
            for dy in (0, 1):
                for dz in (0, 1):
                    w = (t[:, 0] if dx else 1 - t[:, 0]) * (t[:, 1] if dy else 1 - t[:, 1]) * (t[:, 2] if dz else 1 - t[:, 2])
                    acc += w[:, None] * self.D[i[:, 0] + dx, i[:, 1] + dy, i[:, 2] + dz]
        out[ok] = acc
        return out
