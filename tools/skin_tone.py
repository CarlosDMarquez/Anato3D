"""Mapa de tono de la piel por vértice (atributo de color «Tono»), para que la piel de MakeHuman no parezca un maniquí.

La piel no tiene textura: un solo color la hacía parecer de plástico. Aquí se calcula, en el hombre, un multiplicador
de color por vértice a partir de la geometría y del esqueleto:
  - curvatura: pliegues más oscuros y rojizos (párpados, surcos, entre los dedos), relieves algo más claros;
  - labios, nariz, mejillas y orejas más rojizos; párpados algo más oscuros;
  - sombra de barba muy leve (solo hombre) y pezones (en el hombre, a la altura del 4.º cartílago costal);
  - yemas de los dedos, codos y rodillas más rojizos; plantas más claras; cara y manos algo más tostadas.
La mujer comparte la topología de MakeHuman: se reutilizan las capas por índice de vértice, sin barba, y sus pezones
se colocan en el punto más anterior de cada mama.
"""
import numpy as np


def _sm(x):
    x = np.clip(x, 0.0, 1.0)
    return x * x * (3 - 2 * x)


def _normals(o):
    N = np.array([v.normal[:] for v in o.data.vertices]) @ np.linalg.inv(np.array(o.matrix_world)[:3, :3])
    return N / np.linalg.norm(N, axis=1)[:, None]


def _curvature(o, W, N):
    """> 0 en zonas cóncavas, < 0 en convexas (laplaciano proyectado en la normal, por longitud de arista)."""
    E = np.empty(len(o.data.edges) * 2, dtype=np.int64); o.data.edges.foreach_get('vertices', E); E = E.reshape(-1, 2)
    deg = np.bincount(E.ravel(), minlength=len(W)).astype(float)[:, None]
    acc = np.zeros_like(W); np.add.at(acc, E[:, 0], W[E[:, 1]]); np.add.at(acc, E[:, 1], W[E[:, 0]])
    L = acc / np.maximum(deg, 1) - W
    elen = np.linalg.norm(W[E[:, 0]] - W[E[:, 1]], axis=1).mean()
    c = np.einsum('ij,ij->i', L, N) / elen
    for _ in range(3):                                   # un poco de suavizado: sin ruido de malla
        a = np.zeros_like(c); np.add.at(a, E[:, 0], c[E[:, 1]]); np.add.at(a, E[:, 1], c[E[:, 0]])
        c = 0.5 * c + 0.5 * a / np.maximum(deg[:, 0], 1)
    return c


def male_layers(skin, objs, world):
    """Capas (máscara 0–1 por vértice, multiplicador RGB) calculadas sobre la piel masculina."""
    W = world(skin); N = _normals(skin)
    x, y, z = W[:, 0], W[:, 1], W[:, 2]
    blob = lambda c, r: _sm(1 - np.linalg.norm(W - np.asarray(c), axis=1) / r)
    front = _sm((-N[:, 1] - 0.1) / 0.4)                  # cara anterior (delante = −Y)
    layers = {}

    c = _curvature(skin, W, N)
    layers['pliegues'] = (_sm(c / 0.3), (0.84, 0.76, 0.74))
    layers['relieves'] = (_sm(-c / 0.3), (1.03, 1.03, 1.03))

    # Boca: plano oclusal entre los incisivos centrales superiores e inferiores.
    up = np.vstack([world(objs[f'Tooth_Upper_Medial_Incisor_{s}']) for s in 'LR'])
    lo = np.vstack([world(objs[f'Tooth_Lower_Medial_Incisor_{s}']) for s in 'LR'])
    zm = (up[:, 2].min() + lo[:, 2].max()) / 2
    yf = min(up[:, 1].min(), lo[:, 1].min())
    q = np.sqrt((x / 0.026) ** 2 + ((z - zm) / 0.0125) ** 2 + ((y - (yf - 0.012)) / 0.018) ** 2)
    lips = _sm((1 - q) / 0.35) * (y < yf + 0.004)
    layers['labios'] = (lips, (0.86, 0.6, 0.6))

    # Nariz: el punto más anterior de la línea media entre la boca y los ojos.
    eyes = [world(objs[n]) for n in ('Left_Eyeball', 'Right_Eyeball') if n in objs]
    ez = np.mean([e[:, 2].mean() for e in eyes]) if eyes else zm + 0.07
    sel = np.where((np.abs(x) < 0.012) & (z > zm + 0.015) & (z < ez))[0]
    tip = W[sel[np.argmin(y[sel])]]
    layers['nariz'] = (blob(tip, 0.024), (1.0, 0.87, 0.85))
    for e in eyes:
        ec = e.mean(0); sx = np.sign(ec[0])
        layers.setdefault('mejillas', [np.zeros(len(W)), (1.0, 0.89, 0.87)])
        cheek = W[np.argmin(np.linalg.norm(W - (ec + np.array([sx * 0.014, -0.005, -0.035])), axis=1))]
        layers['mejillas'][0] = np.maximum(layers['mejillas'][0], blob(cheek, 0.03) * front)
        layers.setdefault('párpados', [np.zeros(len(W)), (0.93, 0.87, 0.88)])
        layers['párpados'][0] = np.maximum(layers['párpados'][0], blob(ec, 0.024) * front)
    layers['mejillas'] = tuple(layers['mejillas']); layers['párpados'] = tuple(layers['párpados'])

    # Orejas: lo que sobresale a los lados de la cabeza, detrás de los ojos.
    ey = np.mean([e[:, 1].mean() for e in eyes]) if eyes else tip[1] + 0.03
    ears = _sm((np.abs(x) - 0.06) / 0.012) * _sm(1 - np.abs(z - (ez - 0.01)) / 0.045) * _sm(1 - np.abs(y - (ey + 0.085)) / 0.045)
    layers['orejas'] = (ears, (1.0, 0.85, 0.83))

    # Sombra de barba: del labio superior a la mandíbula, sin los labios.
    mand = world(objs['Mandible'])
    from mathutils import kdtree, Vector
    kd = kdtree.KDTree(len(mand))
    for i, p in enumerate(mand): kd.insert(p, i)
    kd.balance()
    dm = np.array([kd.find(Vector(p))[2] for p in W])
    beard = np.maximum(_sm(1 - dm / 0.016) * (z < zm + 0.006), blob((0, yf - 0.012, zm + 0.014), 0.017) * front)
    beard *= (1 - lips) * (z > zm - 0.075)
    layers['barba'] = (beard, (0.95, 0.95, 0.985))

    # Pezones: en la línea medioclavicular, a la altura del extremo anterior del 4.º cartílago costal.
    nip = np.zeros(len(W))
    for s, sx in (('L', 1), ('R', -1)):
        cc = world(objs[f'Costal_Cartilage_4_{s}'])
        zc = cc[np.argmin(cc[:, 1]), 2]
        cand = np.where((np.abs(x - sx * 0.098) < 0.012) & (np.abs(z - zc) < 0.012))[0]
        if len(cand):
            p = W[cand[np.argmin(y[cand])]]
            nip = np.maximum(nip, blob(p, 0.017) * 0.8 + blob(p, 0.006) * 0.2)
    layers['pezones'] = (nip, (0.78, 0.6, 0.56))

    # Yemas de los dedos, codos y rodillas.
    tips = np.zeros(len(W))
    for s in 'LR':
        for f in range(1, 6):
            n = f'Distal_Phalanx_Hand_{f}_{s}'
            if n in objs: tips = np.maximum(tips, blob(world(objs[n]).mean(0), 0.014))
            n = f'Distal_Phalanx_Foot_{f}_{s}'
            if n in objs: tips = np.maximum(tips, blob(world(objs[n]).mean(0), 0.012))
    layers['yemas'] = (tips, (1.0, 0.88, 0.85))
    joints = np.zeros(len(W))
    for s in ('Left', 'Right'):
        el = objs.get(f'Landmark_{s}_Elbow_Joint')
        if el:
            p = np.array(el.matrix_world.translation) + np.array([0, 0.035, 0])
            joints = np.maximum(joints, blob(W[np.argmin(np.linalg.norm(W - p, axis=1))], 0.035))
    for s in 'LR':
        pa = world(objs[f'Patella_{s}']).mean(0)
        joints = np.maximum(joints, blob(W[np.argmin(np.linalg.norm(W - (pa + np.array([0, -0.02, 0])), axis=1))], 0.04))
    layers['codos y rodillas'] = (joints, (0.96, 0.88, 0.86))

    # Plantas más claras; cara y manos algo más tostadas que el tronco.
    layers['plantas'] = (_sm((-N[:, 2] - 0.5) / 0.3) * (z < 0.035), (1.05, 1.0, 0.96))
    neck = objs.get('Landmark_Neck')
    zn = neck.matrix_world.translation.z if neck else 1.49
    layers['cara'] = (_sm((z - zn - 0.03) / 0.03), (0.98, 0.95, 0.93))
    hands = np.zeros(len(W))
    for s in ('Left', 'Right'):
        wr, sh = objs.get(f'Landmark_{s}_Wrist_Joint'), objs.get(f'Landmark_{s}_Shoulder_Joint')
        if wr and sh:
            a = np.array(sh.matrix_world.translation); b = np.array(wr.matrix_world.translation)
            t = (W - a) @ (b - a) / np.dot(b - a, b - a)
            hands = np.maximum(hands, _sm((t - 0.75) / 0.25) * (np.abs(x) > 0.15))
    layers['antebrazos y manos'] = (hands, (0.97, 0.93, 0.91))
    return layers


def female_layers(skin, male, world):
    """Las capas del hombre por índice de vértice, sin barba ni pezones masculinos; pezones en el vértice de cada mama."""
    W = world(skin); N = _normals(skin)
    layers = {k: v for k, v in male.items() if k not in ('barba', 'pezones')}
    x, y, z = W[:, 0], W[:, 1], W[:, 2]
    blob = lambda c, r: _sm(1 - np.linalg.norm(W - np.asarray(c), axis=1) / r)
    nip = np.zeros(len(W))
    zmax = z.max()
    for sx in (1, -1):
        # Mama: entre el 70 y el 78 % de la estatura, a 5–15 cm de la línea media; su punto más anterior.
        cand = np.where((sx * x > 0.05) & (sx * x < 0.15) & (z > 0.7 * zmax) & (z < 0.78 * zmax))[0]
        if len(cand):
            p = W[cand[np.argmin(y[cand])]]
            nip = np.maximum(nip, blob(p, 0.02) * 0.8 + blob(p, 0.007) * 0.2)
    layers['pezones'] = (nip, (0.8, 0.62, 0.58))
    return layers


def apply_layers(skin, layers):
    """Combina las capas y las escribe como atributo de color «Tono» (lineal), activo para exportarlo a glTF."""
    col = np.ones((len(skin.data.vertices), 3))
    for mask, rgb in layers.values():
        col *= 1 + np.asarray(mask)[:, None] * (np.asarray(rgb) - 1)
    me = skin.data
    attr = me.color_attributes.get('Tono') or me.color_attributes.new('Tono', 'FLOAT_COLOR', 'POINT')
    attr.data.foreach_set('color', np.c_[col, np.ones(len(col))].ravel())
    me.color_attributes.active_color = attr
    print(f'{skin.name}: tono de piel por vértice; multiplicador {col.min():.2f}–{col.max():.2f}')
    return col
