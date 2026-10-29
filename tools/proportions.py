"""Proporciones de las extremidades: baja la rodilla y el codo hasta las proporciones de Z-Anatomy.

La piel de MakeHuman tiene la pierna y el antebrazo largos y el muslo y el brazo cortos. Al ajustar a ella los huesos de
Z-Anatomy (Fase 2), la tibia quedó un 24 % más larga que la real, igual de larga que el fémur, y la rodilla a media
pierna. El húmero quedó un 13 % más corto y el codo 3,6 cm alto. Aquí se reparte de nuevo la longitud de cada extremidad
con la proporción de Z-Anatomy (pierna/muslo 0,836; antebrazo/brazo 0,861), sin cambiar su longitud total. La cadera,
el tobillo, el hombro y la muñeca no se mueven.

Cómo:
  - Cada extremidad se describe por su eje (desde la cadera o el hombro) y un desplazamiento a lo largo de él, lineal por
    tramos: cero junto a la articulación fija, la diáfisis del hueso proximal se estira, la rodilla o el codo bajan en
    bloque (así la articulación no cambia) y la diáfisis distal se encoge.
  - Los huesos se mueven con ese campo exacto. Cada tramo es una transformación afín de Z-Anatomy, y el hueso guarda los
    límites de sus tramos (propiedad «segments»). Así anato3d_fit.py calcula una transformación por tramo y los músculos,
    vasos y nervios siguen al hueso.
  - La piel se mueve con el mismo campo suavizado (sin aristas en los cambios de tramo). Pertenece a la pierna lo que
    está por debajo de la ingle (sin las manos) y al brazo lo que tiene un hueso del brazo como el más cercano, con
    transición suave en la axila.
"""
import json
import numpy as np
from mathutils import Vector, bvhtree

# Pierna (rodilla→tobillo) / muslo (cadera→rodilla) y antebrazo / brazo, medidos en Z-Anatomy entre centros articulares.
SHANK_THIGH = 0.836
FOREARM_ARM = 0.861
LEG_BONES = ('Femur', 'Patella', 'Tibia', 'Fibula')
ARM_BONES = ('Humerus', 'Radius', 'Ulna')
HAND = ('Capitate', 'Hamate', 'Lunate', 'Pisiform', 'Scaphoid', 'Trapezium', 'Trapezoid', 'Triquetrum', 'Metacarpal',
        'Phalanx_Hand')


def _sphere(P):
    A = np.c_[2 * P, np.ones(len(P))]
    c, *_ = np.linalg.lstsq(A, (P ** 2).sum(1), rcond=None)
    return c[:3]


def joints(world, objs, s):
    """Centros articulares de un lado (s = 'L' o 'R'), en metros, Z arriba."""
    F = world(objs[f'Femur_{s}']); T = world(objs[f'Tibia_{s}']); H = world(objs[f'Humerus_{s}'])
    R = world(objs[f'Radius_{s}']); Ta = world(objs[f'Talus_{s}'])
    top = F[F[:, 2] > F[:, 2].max() - 0.06]
    head = top[np.abs(top[:, 0]) < np.percentile(np.abs(top[:, 0]), 45)]      # cabeza femoral: lo más medial
    J = {'hip': _sphere(head)}
    J['knee'] = np.r_[F[F[:, 2] < F[:, 2].min() + 0.02].mean(0)[:2], (F[:, 2].min() + T[:, 2].max()) / 2]
    J['talus_top'] = Ta[:, 2].max()
    J['ankle'] = np.r_[Ta.mean(0)[:2], J['talus_top'] - 0.012]
    J['shoulder'] = _sphere(H[H[:, 2] > H[:, 2].max() - 0.05])
    J['elbow'] = H[H[:, 2] < H[:, 2].min() + 0.02].mean(0)
    J['wrist'] = R[R[:, 2] < R[:, 2].min() + 0.015].mean(0)
    return J


class Field:
    """Desplazamiento a lo largo de `axis` (unitario) en función de ζ = (p − origin)·axis, lineal entre nudos."""
    def __init__(self, origin, axis, knots):
        self.o = np.asarray(origin, float); self.a = np.asarray(axis, float) / np.linalg.norm(axis)
        self.k = np.array([k for k, _ in knots]); self.d = np.array([d for _, d in knots])

    def zeta(self, P):
        return (np.asarray(P) - self.o) @ self.a

    def delta(self, z):
        return np.interp(z, self.k, self.d)

    def smooth_delta(self, z, sigma=0.015):
        """El mismo perfil convolucionado con una gaussiana: sin cambios bruscos de pendiente en la piel."""
        g = np.linspace(self.k[0] - 4 * sigma, self.k[-1] + 4 * sigma, 2000)
        h = self.delta(g); step = g[1] - g[0]
        t = np.arange(-4 * sigma, 4 * sigma + step, step); w = np.exp(-0.5 * (t / sigma) ** 2); w /= w.sum()
        hs = np.convolve(np.pad(h, len(t) // 2, mode='edge'), w, mode='valid')[:len(g)]
        return np.interp(z, g, hs)

    def displace(self, P, smooth=False):
        z = self.zeta(P)
        return np.outer(self.smooth_delta(z) if smooth else self.delta(z), self.a)

    def new_knots(self):
        return (self.k + self.d).tolist()                       # ζ de cada nudo tras moverse a lo largo del eje


def plan(world, objs):
    """Los cuatro campos (pierna y brazo de cada lado) y un resumen de lo que cambia."""
    fields, report = {}, {}
    for s in 'LR':
        J = joints(world, objs, s)
        L1 = np.linalg.norm(J['knee'] - J['hip']); L2 = np.linalg.norm(J['ankle'] - J['knee'])
        dk = (L1 + L2) / (1 + SHANK_THIGH) - L1                 # cuánto baja la rodilla
        down = np.array([0.0, 0.0, -1.0])
        zk = (J['knee'] - J['hip']) @ down; zt = J['hip'][2] - J['talus_top']
        # Cuello y trocánteres fijos (7 cm bajo el centro de la cabeza); diáfisis femoral estirada; de 5 cm sobre la
        # interlínea hasta ella, en bloque (cóndilos, rótula, espinas tibiales); tibia y peroné, encogidos hasta el astrágalo.
        fields[f'leg_{s}'] = Field(J['hip'], down, [(0.07, 0.0), (zk - 0.05, dk), (zk, dk), (zt, 0.0)])
        A1 = np.linalg.norm(J['elbow'] - J['shoulder']); A2 = np.linalg.norm(J['wrist'] - J['elbow'])
        de = (A1 + A2) / (1 + FOREARM_ARM) - A1                 # cuánto baja el codo
        u = (J['wrist'] - J['shoulder']) / np.linalg.norm(J['wrist'] - J['shoulder'])
        ze = (J['elbow'] - J['shoulder']) @ u; zw = (J['wrist'] - J['shoulder']) @ u
        # Cabeza y cuello quirúrgico del húmero fijos; el codo (olécranon, epicóndilos, cabeza del radio) en bloque ±3 cm.
        fields[f'arm_{s}'] = Field(J['shoulder'], u, [(0.05, 0.0), (ze - 0.03, de), (ze + 0.03, de), (zw - 0.03, 0.0)])
        report[s] = {'rodilla_baja_cm': round(dk * 100, 2), 'codo_baja_cm': round(de * 100, 2),
                     'muslo_cm': [round(L1 * 100, 1), round((L1 + dk) * 100, 1)],
                     'pierna_cm': [round(L2 * 100, 1), round((L2 - dk) * 100, 1)],
                     'brazo_cm': [round(A1 * 100, 1), round((A1 + de) * 100, 1)],
                     'antebrazo_cm': [round(A2 * 100, 1), round((A2 - de) * 100, 1)]}
    return fields, report


def limb_of(name):
    for s in 'LR':
        if name.endswith('_' + s):
            if name.startswith(LEG_BONES): return f'leg_{s}'
            if name.startswith(ARM_BONES): return f'arm_{s}'
    return None


def move_bones(world, set_world, objs, fields):
    """Mueve fémur, rótula, tibia, peroné, húmero, radio y cúbito; cada uno guarda sus tramos para anato3d_fit.py."""
    moved = []
    for name, o in objs.items():
        if o.type != 'MESH': continue
        key = limb_of(name)
        if not key: continue
        f = fields[key]
        set_world(o, world(o) + f.displace(world(o)))
        o['segments'] = json.dumps({'origin': [round(float(x), 6) for x in f.o], 'axis': [round(float(x), 6) for x in f.a],
                                    'knots': [round(float(x), 6) for x in f.new_knots()]})
        moved.append(name)
    return moved


def skin_displacement(W, edges, bone_objs, world, fields, crotch_z):
    """Desplazamiento de cada vértice de la piel (coordenadas de mundo W), con pertenencia suave a cada extremidad."""
    # Hueso más cercano: brazo (incluida la mano) o no. Las manos cuelgan junto a los muslos y no deben bajar con ellos.
    verts, faces, owner = [], [], []
    for name, o in bone_objs.items():
        P = world(o); base = len(verts); verts += P.tolist()
        faces += [[base + i for i in p.vertices] for p in o.data.polygons]
        tag = 'arm_L' if name.endswith('_L') else 'arm_R'
        tag = tag if name.startswith(ARM_BONES) or any(h in name for h in HAND) else 'other'
        owner += [tag] * len(o.data.polygons)
    T = bvhtree.BVHTree.FromPolygons(verts, faces)
    near = np.array([owner[T.find_nearest(Vector(p))[2]] for p in W])
    n = len(W)
    deg = np.bincount(edges.ravel(), minlength=n).astype(float)
    def smooth(w, it):
        for _ in range(it):
            acc = np.zeros(n); np.add.at(acc, edges[:, 0], w[edges[:, 1]]); np.add.at(acc, edges[:, 1], w[edges[:, 0]])
            w = 0.5 * w + 0.5 * acc / np.maximum(deg, 1)
        return w
    D = np.zeros_like(W)
    hand_or_arm = (near == 'arm_L') | (near == 'arm_R')
    for s, sx in (('L', 1), ('R', -1)):
        w = smooth((near == f'arm_{s}').astype(float), 12)
        D += w[:, None] * fields[f'arm_{s}'].displace(W, smooth=True)
        # Pierna: por debajo de la ingle (con transición de 3 cm), de su lado, sin la mano.
        x = W[:, 0] * sx
        side = np.clip((x + 0.01) / 0.02, 0, 1); side = side * side * (3 - 2 * side)
        below = np.clip((crotch_z + 0.03 - W[:, 2]) / 0.03, 0, 1)
        wl = smooth(side * below * (~hand_or_arm), 4)
        D += wl[:, None] * fields[f'leg_{s}'].displace(W, smooth=True)
    return D


# ── Cintura escapular ───────────────────────────────────────────────────────
# Los hombros de MakeHuman caen: frente a la imagen de referencia, con la misma estatura, el acromion quedaba ~2,5 cm más
# bajo respecto al mentón, las clavículas horizontales y el brazo más pegado al tronco (la mano, ~3 cm más adentro).
# La clavícula gira sobre su extremo esternal hasta subir el acromion SHOULDER_RISE; la escápula la sigue (se traslada
# lo que se mueve la articulación acromioclavicular), y el brazo entero, con una abducción de ABDUCTION grados sobre el
# hombro. Todo son movimientos rígidos (los huesos siguen siendo transformaciones afines de Z-Anatomy). La piel sigue a
# cada hueso con pesos suaves, como en las extremidades: sube el hombro, el trapecio queda más inclinado y el cuello y
# el tórax no se mueven.
SHOULDER_RISE = 0.02
ABDUCTION = 3.0


def _rot_xz(angle, center):
    """Giro en el plano frontal (alrededor del eje y) por `center`, como función de puntos (n, 3)."""
    c, s = np.cos(angle), np.sin(angle)
    R = np.array([[c, 0, -s], [0, 1, 0], [s, 0, c]])
    return R, (lambda P: (np.asarray(P) - center) @ R.T + center)


def girdle_moves(world, objs, s):
    """Transformaciones (función de puntos y rotación) de clavícula, escápula y brazo de un lado."""
    C = world(objs[f'Clavicle_{s}'])
    order = np.argsort(np.abs(C[:, 0])); k = max(3, len(C) // 20)
    sc, ac = C[order[:k]].mean(0), C[order[-k:]].mean(0)            # extremos esternal y acromial
    v = ac - sc; L = np.hypot(v[0], v[2]); z1 = v[2] + SHOULDER_RISE
    theta = np.arctan2(z1, np.sign(v[0]) * np.sqrt(L * L - z1 * z1)) - np.arctan2(v[2], v[0])
    Rc, clav = _rot_xz(theta, sc)
    lift = clav(ac[None])[0] - ac
    sh = joints(world, objs, s)['shoulder']
    Ra, abd = _rot_xz(np.radians(ABDUCTION) * np.sign(sh[0]), sh)
    return {'clav': (clav, Rc), 'scap': (lambda P: np.asarray(P) + lift, np.eye(3)),
            'arm': (lambda P: abd(P) + lift, Ra), 'lift': lift, 'theta': theta}


def _girdle_part(name, s):
    if not name.endswith('_' + s): return None
    if name.startswith('Clavicle'): return 'clav'
    if name.startswith('Scapula'): return 'scap'
    if name.startswith(ARM_BONES) or any(h in name for h in HAND): return 'arm'
    return None


def raise_shoulders(world, set_world, objs, W, edges):
    """Mueve la cintura escapular y el brazo de los dos lados; devuelve el desplazamiento de la piel y un resumen."""
    moves = {s: girdle_moves(world, objs, s) for s in 'LR'}
    # Pertenencia de la piel (antes de mover los huesos): hueso más cercano, con transición suave.
    verts, faces, owner = [], [], []
    for name, o in objs.items():
        if o.type != 'MESH' or o.get('system') != 'skeletal': continue
        P = world(o); base = len(verts); verts += P.tolist()
        faces += [[base + i for i in p.vertices] for p in o.data.polygons]
        part = _girdle_part(name, 'L') or _girdle_part(name, 'R')
        owner += [f'{part}_{name[-1]}' if part else 'other'] * len(o.data.polygons)
    T = bvhtree.BVHTree.FromPolygons(verts, faces)
    near = np.array([owner[T.find_nearest(Vector(p))[2]] for p in W])
    n = len(W); deg = np.maximum(np.bincount(edges.ravel(), minlength=n), 1).astype(float)
    def smooth(w, it=12):
        for _ in range(it):
            acc = np.zeros(n); np.add.at(acc, edges[:, 0], w[edges[:, 1]]); np.add.at(acc, edges[:, 1], w[edges[:, 0]])
            w = 0.5 * w + 0.5 * acc / deg
        return w
    D = np.zeros_like(W)
    for s, m in moves.items():
        for part in ('clav', 'scap', 'arm'):
            D += smooth((near == f'{part}_{s}').astype(float))[:, None] * (m[part][0](W) - W)
    # Huesos (y sus tramos, que anato3d_fit.py lee en coordenadas de mundo).
    moved = []
    for name, o in objs.items():
        if o.type != 'MESH' or o.get('system') != 'skeletal': continue
        s = name[-1]; part = _girdle_part(name, s) if s in 'LR' else None
        if not part: continue
        f, R = moves[s][part]
        set_world(o, f(world(o)))
        if 'segments' in o:
            seg = json.loads(o['segments'])
            seg['origin'] = [round(float(x), 6) for x in f(np.array([seg['origin']]))[0]]
            seg['axis'] = [round(float(x), 6) for x in R @ np.array(seg['axis'])]
            o['segments'] = json.dumps(seg)
        moved.append(name)
    for s, side in (('L', 'Left'), ('R', 'Right')):
        for joint in ('Shoulder', 'Elbow', 'Wrist'):
            lm = objs.get(f'Landmark_{side}_{joint}_Joint')
            if lm: lm.location = type(lm.location)(moves[s]['arm'][0](np.array([lm.matrix_world.translation]))[0])
    report = {s: {'clavícula_grados': round(float(np.degrees(m['theta'])), 1),
                  'acromion_sube_cm': round(float(m['lift'][2]) * 100, 2)} for s, m in moves.items()}
    return D, moved, report
