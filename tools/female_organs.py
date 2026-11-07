"""Órganos femeninos que Z-Anatomy no tiene (es un cuerpo masculino): genitales internos y externos, uretra femenina y
glándulas mamarias. Formas paramétricas con medidas de adulta nulípara, colocadas sobre referencias de la pelvis y de la
piel femeninas. Es una primera versión, para perfeccionar.

Medidas (cm):
  - útero 7,5 de largo (cuello 3) × 5 de ancho en el fondo × 3 de grosor; en anteversión (90° respecto a la vagina) y
    anteflexión (20° más), apoyado sobre la vejiga; si así el fondo quedara por delante del pubis, más vertical;
  - vagina 8 de largo, aplanada (3 × 1,2), de la vulva hacia arriba y atrás (60° sobre la horizontal); el cuello del
    útero entra en su bóveda;
  - ovarios 3,5 × 2 × 1,4, en la pared lateral de la pelvis, junto al fondo del útero;
  - trompas uterinas 10–11: istmo (0,4 de diámetro), ampolla (1) e infundíbulo (1,6) con fimbrias sobre el ovario;
  - ligamentos redondos (del ángulo del útero al anillo inguinal profundo y, por el conducto inguinal, al labio mayor)
    y ligamentos propios del ovario;
  - uretra femenina 4 × 0,6, del cuello de la vejiga al vestíbulo, delante de la vagina;
  - vestíbulo (orificios de la vagina y de la uretra) a la altura de la piel del periné, 3 cm por detrás del borde
    inferior de la sínfisis: la piel de MakeHuman no tiene vulva; build_female_skin.py la modela;
  - genitales externos profundos (clítoris, bulbos del vestíbulo, glándulas vestibulares mayores): female_perineum.py;
  - glándula mamaria: del borde del esternón a la línea axilar media y de la 2.ª a la 6.ª costilla, con prolongación
    axilar; 8 mm bajo la piel (3 mm tras el pezón) y delante del pectoral; 15 lóbulos; 14 conductos galactóforos con su
    seno, del pezón al interior de la glándula.
Coordenadas de Blender: Z arriba, delante = −Y.
"""
import numpy as np


def _world(o):
    m = np.array(o.matrix_world)
    co = np.empty(len(o.data.vertices) * 3); o.data.vertices.foreach_get('co', co)
    return co.reshape(-1, 3) @ m[:3, :3].T + m[:3, 3]


def _unit(v):
    return v / np.linalg.norm(v)


def _dir(theta_deg):
    """Dirección en el plano medio (y–z): 0° = hacia atrás (+y), 90° = arriba."""
    t = np.radians(theta_deg)
    return np.array([0.0, np.cos(t), np.sin(t)])


def landmarks(objs):
    """Referencias de la pelvis femenina, en metros."""
    H = {s: _world(objs[f'Hip_Bone_{s}']) for s in 'LR'}
    S = _world(objs['Sacrum']); C = _world(objs['Coccyx'])
    both = np.vstack([H['L'], H['R']])
    sym = both[np.abs(both[:, 0]) < 0.012]                         # caras de la sínfisis del pubis
    sym = sym[sym[:, 1] < np.median(both[:, 1])]                   # la parte anterior (no el sacro ni el ilion)
    L = {'ps_top': sym[np.argmax(sym[:, 2])], 'ps_bottom': sym[np.argmin(sym[:, 2])], 'ps_center': sym.mean(0)}
    top = S[S[:, 2] > S[:, 2].max() - 0.025]
    L['promontory'] = top[np.argmin(top[:, 1])]
    L['coccyx'] = C[np.argmin(C[:, 2])]
    for s, sx in (('L', 1), ('R', -1)):
        h = H[s]
        upper = h[h[:, 2] > np.percentile(h[:, 2], 70)]
        L[f'asis_{s}'] = upper[np.argmin(upper[:, 1])]
        L[f'tuber_{s}'] = h[np.argmin(h[:, 2])]                    # tuberosidad isquiática
        # Línea arcuata (borde de la entrada de la pelvis): lo más medial del ilion bajo el promontorio, entre el pubis y
        # el sacro (por detrás del promontorio, lo más medial es la articulación sacroilíaca).
        zp = L['promontory'][2]
        band = h[(h[:, 2] > zp - 0.06) & (h[:, 2] < zp - 0.01) & (h[:, 1] > L['ps_top'][1] + 0.02) & (h[:, 1] < L['promontory'][1] - 0.005)]
        L[f'inlet_{s}'] = band[np.argmin(np.abs(band[:, 0]))]
    L['inlet_center'] = (L['ps_top'] + L['promontory']) / 2
    return L


# ── Mallas ────────────────────────────────────────────────────────────────
def _frames(path, ref):
    T = np.gradient(path, axis=0); T /= np.linalg.norm(T, axis=1)[:, None]
    N = np.empty_like(T)
    n = ref - (ref @ T[0]) * T[0]; N[0] = _unit(n)
    for i in range(1, len(T)):                                      # transporte paralelo
        n = N[i - 1] - (N[i - 1] @ T[i]) * T[i]
        N[i] = _unit(n)
    return T, N, np.cross(T, N)


def tube(path, ra, rb, seg=24, ref=(1.0, 0.0, 0.0), caps=(True, True)):
    """Tubo de sección elíptica (semiejes ra según `ref`, rb perpendicular) a lo largo de `path`, con casquetes
    redondeados. Devuelve (vértices, caras)."""
    path = np.asarray(path, float); ra = np.broadcast_to(ra, len(path)).astype(float); rb = np.broadcast_to(rb, len(path)).astype(float)
    T, N, B = _frames(path, np.asarray(ref, float))
    th = np.linspace(0, 2 * np.pi, seg, endpoint=False)
    rings = [path[i] + np.outer(np.cos(th), N[i] * ra[i]) + np.outer(np.sin(th), B[i] * rb[i]) for i in range(len(path))]
    # Casquetes: anillos que se cierran en un polo (media esfera aplanada según el radio local).
    def cap(i, sign, k=5):
        out = []
        for phi in np.linspace(0, np.pi / 2, k + 1)[1:]:
            c = path[i] + sign * T[i] * min(ra[i], rb[i]) * np.sin(phi)
            out.append(c + np.outer(np.cos(th), N[i] * ra[i] * np.cos(phi)) + np.outer(np.sin(th), B[i] * rb[i] * np.cos(phi)))
        return out
    seq = (cap(0, -1)[::-1] if caps[0] else []) + rings + (cap(len(path) - 1, 1) if caps[1] else [])
    V = np.vstack(seq); F = []
    for r in range(len(seq) - 1):
        for j in range(seg):
            a, b = r * seg + j, r * seg + (j + 1) % seg
            F.append((a, b, b + seg, a + seg))
    return V, F


def ellipsoid(c, axes, res=(24, 16), bumps=None):
    """Elipsoide de centro c y semiejes en las filas de `axes` (vectores). `bumps`: función de la dirección → factor."""
    u = np.linspace(0, 2 * np.pi, res[0], endpoint=False); v = np.linspace(-np.pi / 2, np.pi / 2, res[1] + 1)[1:-1]
    U, Vv = np.meshgrid(u, v)
    d = np.stack([np.cos(Vv) * np.cos(U), np.cos(Vv) * np.sin(U), np.sin(Vv)], -1).reshape(-1, 3)
    f = bumps(d) if bumps else 1.0
    V = list(c + (d * np.atleast_1d(f)[:, None] if bumps else d) @ np.asarray(axes))
    V += [c - np.asarray(axes)[2], c + np.asarray(axes)[2]]       # polos
    n_u, n_v = res[0], res[1] - 1
    F = []
    for i in range(n_v - 1):
        for j in range(n_u):
            a, b = i * n_u + j, i * n_u + (j + 1) % n_u
            F.append((a, b, b + n_u, a + n_u))
    s, nN = len(V) - 2, len(V) - 1
    for j in range(n_u):
        F.append((s, (j + 1) % n_u, j)); top = (n_v - 1) * n_u
        F.append((nN, top + j, top + (j + 1) % n_u))
    if np.linalg.det(np.asarray(axes, float)) < 0:                   # ejes levógiros (un lado en espejo): caras al revés
        F = [tuple(reversed(f)) for f in F]
    return np.array(V), F


def curve(points, n=24):
    """Curva de Bézier por puntos de control → (n, 3)."""
    P = [np.broadcast_to(np.asarray(p, float), (n, 3)) for p in points]
    t = np.linspace(0, 1, n)[:, None]
    while len(P) > 1:
        P = [P[i] * (1 - t) + P[i + 1] * t for i in range(len(P) - 1)]
    return P[0]


# ── Órganos ───────────────────────────────────────────────────────────────
def pelvic_organs(objs, bladder_world, skin_world=None):
    """Lista de (nombre, tejido, vértices, caras, externo) de los órganos pélvicos femeninos.
    `skin_world`: vértices de la piel; los orificios del vestíbulo y el glande del clítoris se colocan sobre ella."""
    from female_perineum import frame, deep_genitals                        # (importa este módulo)
    L = landmarks(objs)
    out = []
    ps_b, ps_t = L['ps_bottom'], L['ps_top']
    # Vestíbulo, orificios y uretra (female_perineum.frame, común con la vulva y los músculos del periné): el orificio
    # vaginal, 3 cm por detrás del borde inferior de la sínfisis; el de la uretra, 1,7 cm por delante; el glande del
    # clítoris, 2,2 cm por delante de él, bajo su capuchón.
    Fp = frame(objs, skin_world, bladder_world)
    introitus, urethral_os = Fp['introitus'], Fp['urethral_os']
    dv = _dir(60)                                                    # vagina: arriba y atrás
    v_len = 0.08
    vagina_path = curve([introitus, introitus + dv * v_len * 0.5 + np.array([0, -0.004, 0]), introitus + dv * v_len], 16)
    s = np.linspace(0, 1, len(vagina_path))
    # El orificio, una hendidura de delante atrás (8 × 5 mm), como el de la vulva (build_female_skin.py); más arriba, la
    # luz se aplana de lado a lado y se ensancha (fondos de saco).
    va = np.interp(s, [0, 0.12, 0.25, 0.7, 1], [0.0024, 0.0075, 0.011, 0.015, 0.014])    # de lado a lado
    rb = np.interp(s, [0, 0.12, 0.3, 1], [0.0042, 0.0055, 0.006, 0.008])                # de delante atrás
    V, F = tube(vagina_path, va, rb, caps=(False, True))                 # abierta en el orificio (con casquete, asomaba)
    out.append(('Vagina', 'vagina', V, F, False))
    # Útero: el orificio externo del cuello, dentro de la bóveda de la vagina; cuello en anteversión, cuerpo en anteflexión.
    # Con la anteversión y la anteflexión habituales (90° y 20°) el fondo llega por delante del pubis en esta pelvis (corta
    # de delante atrás: conjugada obstétrica de 10,1 cm): se usa la más inclinada con el fondo a 1,2 cm por detrás. Con la
    # pelvis femenina (female_pelvis.py) queda en 70° y 15°; con la masculina adaptada, en 65° y 10°.
    os_ext = introitus + dv * (v_len - 0.016) + np.array([0, -0.004, 0])
    s = np.linspace(0, 1, 24)
    ra = np.interp(s, [0, 0.35, 0.45, 0.8, 1.0], [0.011, 0.012, 0.013, 0.025, 0.022])   # ancho (lateral)
    rb = np.interp(s, [0, 0.35, 0.45, 0.8, 1.0], [0.010, 0.011, 0.011, 0.016, 0.015])   # grosor
    for version, flexion in ((90, 20), (85, 15), (80, 15), (75, 15), (70, 15), (70, 10), (65, 10), (60, 10)):
        dc = _dir(60 + version); db = _dir(60 + version + flexion)
        p_isthmus = os_ext + dc * 0.03
        p_fundus = p_isthmus + db * 0.042
        upath = curve([os_ext, os_ext + dc * 0.02, p_isthmus + dc * 0.012, p_isthmus + db * 0.02, p_fundus], 24)
        if p_fundus[1] - rb[-1] >= ps_t[1] + 0.012: break
    L['uterus_pose'] = (version, flexion)
    # Por encima de la vejiga (la anteflexión la apoya sobre ella): sube el útero si la atraviesa.
    if bladder_world is not None and len(bladder_world):
        top_b = bladder_world[bladder_world[:, 1] > np.percentile(bladder_world[:, 1], 40)][:, 2].max()
        lift = max(0.0, top_b + 0.004 - (upath[-6:, 2] - rb[-6:]).min())
        upath = upath + np.array([0, 0, lift]) * s[:, None] ** 2
    V, F = tube(upath, ra, rb, ref=(1.0, 0.0, 0.0))
    out.append(('Uterus', 'uterus', V, F, False))
    fundus = upath[-1]; fundus_dir = _unit(upath[-1] - upath[-4])
    for side, sx in (('L', 1), ('R', -1)):
        cornu = upath[-5] + np.array([sx * 0.022, 0, 0]) + fundus_dir * 0.004
        # En la fosa ovárica: junto a la pared lateral de la pelvis, a la altura del fondo del útero y algo por detrás.
        inlet = L[f'inlet_{side}']
        ovary_c = np.array([sx * max(0.04, abs(inlet[0]) - 0.012), max(fundus[1] + 0.02, L['inlet_center'][1] + 0.008),
                            fundus[2] - 0.008])
        V, F = ellipsoid(ovary_c, [[0.007 * sx, 0, 0], [0, 0.010, 0], [0, 0, 0.0175]],
                         bumps=lambda d: 1 + 0.06 * np.sin(5 * d[:, 0] + 3 * d[:, 2]) * np.cos(4 * d[:, 1]))
        out.append((f'Ovary_{side}', 'ovary', V, F, False))
        # Trompa: del ángulo del útero hacia fuera, sobre el polo superior del ovario, y hacia atrás y abajo.
        # (Sin pasar del ovario hacia fuera: más allá está el ilion.)
        tpath = curve([cornu, cornu + np.array([sx * 0.025, 0.0, 0.006]), ovary_c + np.array([sx * 0.001, -0.012, 0.03]),
                       ovary_c + np.array([sx * 0.004, 0.012, 0.022]), ovary_c + np.array([-sx * 0.002, 0.017, 0.006])], 28)
        s = np.linspace(0, 1, len(tpath))
        r = np.interp(s, [0, 0.35, 0.8, 1.0], [0.002, 0.0025, 0.005, 0.008])
        V, F = tube(tpath, r, r, seg=16, ref=(0.0, 0.0, 1.0))
        out.append((f'Uterine_tube_{side}', 'tube', V, F, False))
        end, tdir = tpath[-1], _unit(tpath[-1] - tpath[-3])
        for k in range(7):                                          # fimbrias
            a = 2 * np.pi * k / 7
            off = np.cross(tdir, [0, 0, 1]); off = _unit(off) if np.linalg.norm(off) > 1e-6 else np.array([1, 0, 0])
            up = np.cross(tdir, off)
            tip = end + tdir * 0.009 + (off * np.cos(a) + up * np.sin(a)) * 0.007
            V, F = tube(curve([end + (off * np.cos(a) + up * np.sin(a)) * 0.006, tip], 5), np.linspace(0.0016, 0.0008, 5),
                        np.linspace(0.0016, 0.0008, 5), seg=8)
            out.append((f'Fimbriae_of_uterine_tube_{side}', 'tube', V, F, False))
        # Ligamento propio del ovario: del polo inferior del ovario al ángulo del útero, bajo la trompa.
        V, F = tube(curve([ovary_c + np.array([-sx * 0.004, 0, -0.012]), (ovary_c + cornu) / 2 + np.array([0, 0.004, -0.012]),
                           cornu + np.array([0, 0.004, -0.008])], 12), 0.0025, 0.0022, seg=12)
        out.append((f'Ligament_of_ovary_{side}', 'ligament', V, F, False))
        # Ligamento redondo: del ángulo del útero al anillo inguinal profundo, por el conducto inguinal al labio mayor.
        asis = L[f'asis_{side}']; tubercle = np.array([sx * 0.022, ps_t[1] - 0.004, ps_t[2] + 0.004])
        deep_ring = (asis + tubercle) / 2 + np.array([-sx * 0.008, 0.012, 0.012])
        sup_ring = tubercle + np.array([sx * 0.012, -0.006, 0.006])
        labium = np.array([sx * 0.016, ps_b[1] - 0.006, ps_b[2] - 0.012])
        V, F = tube(curve([cornu + np.array([0, -0.004, -0.004]), cornu + np.array([sx * 0.03, -0.03, 0.0]), deep_ring], 18),
                    0.0025, 0.0022, seg=12, caps=(True, False))
        V2, F2 = tube(curve([deep_ring, sup_ring, labium], 14), 0.0022, 0.002, seg=12, caps=(False, True))
        out.append((f'Round_ligament_of_uterus_{side}', 'ligament', np.vstack([V, V2]), F + [tuple(i + len(V) for i in f) for f in F2], False))
    # Uretra femenina: del punto más bajo de la vejiga (junto a la línea media) al vestíbulo.
    ur = np.interp(np.linspace(0, 1, len(Fp['urethra'])), [0, 0.75, 1], [0.003, 0.003, 0.0012])   # el meato, estrecho
    V, F = tube(Fp['urethra'], ur, ur, seg=12)
    out.append(('Urethra', 'urethra', V, F, False))
    # Genitales externos profundos (female_perineum.py): clítoris, bulbos, glándulas vestibulares mayores y sus conductos.
    out += deep_genitals(Fp)
    return out, L


def breast_fat_and_ligaments(side, S, N, front, depth, R, th, u, K, M, areola=0.017, dermis=0.002, gap=0.0003):
    """Grasa de la mama y ligamentos suspensorios (de Cooper), sobre la rejilla polar de la glándula (2026-11-06).

    - Grasa: de la dermis (2 mm bajo la piel) a la cara anterior de la glándula (0,3 mm por delante), desde el borde
      de la areola (1,7 cm del pezón: bajo la areola y el pezón no hay grasa) hasta el contorno de la base. Una lente
      con un agujero en el centro, cerrada con dos paredes finas en sus bordes. Rellena los surcos entre los lóbulos.
    - Ligamentos: 15 tabiques de 0,5 mm, uno en la cresta de cada lóbulo, de la glándula a la dermis, a lo largo del
      radio desde la areola hasta el 92 % del contorno. Atraviesan la grasa, como en el cuerpo.
    `S`, `N`: puntos y normales de la piel en la rejilla (el pezón y luego K anillos de M radios); `front`, `depth`: cara
    anterior de la glándula y su profundidad bajo la piel; `R`: distancia del pezón al contorno en cada radio."""
    def along(arr, j, d):
        """Valor de `arr` en el radio j a la distancia d del pezón (interpolado entre anillos)."""
        ds = np.r_[0.0, u * R[j]]
        vals = np.vstack([arr[0], arr[1 + np.arange(K) * M + j]])
        return np.array([np.interp(d, ds, vals[:, c]) for c in range(vals.shape[1])])
    def at_angle(arr, a, d):
        """Entre los dos radios vecinos del ángulo a."""
        step = 2 * np.pi / M
        j0 = int(np.floor(a / step)) % M; f = a / step - np.floor(a / step)
        return (1 - f) * along(arr, j0, d) + f * along(arr, (j0 + 1) % M, d)
    out = []
    # Hasta dónde llega de verdad cada radio: en la prolongación axilar los rayos sobre la piel no alcanzan el contorno y
    # los últimos anillos repiten el mismo punto (la grasa, a 2 mm fijos de la piel, tenía ahí caras de área nula).
    R_eff = R.copy()
    for j in range(M):
        ring = S[1 + np.arange(K) * M + j]
        same = np.nonzero(np.linalg.norm(np.diff(ring, axis=0), axis=1) < 1e-6)[0]
        if len(same): R_eff[j] = u[same[0]] * R[j]
    # Grasa: rejilla propia (anillos de la areola al contorno) en los mismos radios.
    K2 = 18
    cols = []
    for j in range(M):
        ds = np.linspace(areola, R_eff[j], K2)
        Sd = np.array([along(S, j, d) for d in ds]); Nd = np.array([along(N, j, d) for d in ds])
        Nd /= np.linalg.norm(Nd, axis=1)[:, None]
        dd = np.array([along(depth[:, None], j, d)[0] for d in ds])
        cols.append((Sd - Nd * dermis, Sd - Nd * np.maximum(dd - gap, dermis + 0.0004)[:, None]))
    fr = np.array([c[0] for c in cols]).transpose(1, 0, 2).reshape(-1, 3)        # [anillo, radio]
    bk = np.array([c[1] for c in cols]).transpose(1, 0, 2).reshape(-1, 3)
    n = K2 * M
    V = np.vstack([fr, bk])
    idx = lambda k, j, b=0: b * n + k * M + j % M
    F = []
    for k in range(K2 - 1):
        for j in range(M):
            F.append((idx(k, j), idx(k, j + 1), idx(k + 1, j + 1), idx(k + 1, j)))            # delante
            F.append((idx(k, j, 1), idx(k + 1, j, 1), idx(k + 1, j + 1, 1), idx(k, j + 1, 1)))  # detrás
    for j in range(M):                                                # paredes: borde de la areola y contorno
        F.append((idx(0, j), idx(0, j, 1), idx(0, j + 1, 1), idx(0, j + 1)))
        F.append((idx(K2 - 1, j), idx(K2 - 1, j + 1), idx(K2 - 1, j + 1, 1), idx(K2 - 1, j, 1)))
    out.append((f'Fat_of_breast_{side}', 'fat', V, _outward(V, F), False))
    # Ligamentos: en las crestas (lobes = 0 en th = 2πk/15).
    LV, LF = [], []
    for k in range(15):
        a = 2 * np.pi * k / 15
        jR = R_eff[int(round(a / (2 * np.pi / M))) % M]
        ds = np.linspace(areola + 0.002, 0.92 * jR, 14)
        Sd = np.array([at_angle(S, a, d) for d in ds]); Nd = np.array([at_angle(N, a, d) for d in ds])
        Nd /= np.linalg.norm(Nd, axis=1)[:, None]
        Gd = np.array([at_angle(front, a, d) for d in ds])
        bot = Gd + Nd * gap; top = Sd - Nd * (dermis - 0.0001)
        radial = np.gradient(Sd, axis=0); radial /= np.linalg.norm(radial, axis=1)[:, None]
        tv = np.cross(Nd, radial); tv /= np.linalg.norm(tv, axis=1)[:, None]
        h = 0.00025
        P = np.stack([bot - tv * h, bot + tv * h, top + tv * h, top - tv * h], 1)    # [paso, 4]
        base = sum(len(v) for v in LV)
        LV.append(P.reshape(-1, 3))
        q = lambda i, c: base + i * 4 + c
        for i in range(len(ds) - 1):
            for c in range(4):
                LF.append((q(i, c), q(i, (c + 1) % 4), q(i + 1, (c + 1) % 4), q(i + 1, c)))
        LF.append((q(0, 3), q(0, 2), q(0, 1), q(0, 0)))
        LF.append(tuple(q(len(ds) - 1, c) for c in range(4)))
    LV = np.vstack(LV)
    out.append((f'Suspensory_ligaments_of_breast_{side}', 'ligament', LV, _outward(LV, LF), False))
    return out


def _outward(V, F):
    """Caras con las normales hacia fuera (volumen con signo positivo)."""
    vol = 0.0
    for f in F:
        for i in range(1, len(f) - 1):
            vol += np.dot(V[f[0]], np.cross(V[f[i]], V[f[i + 1]]))
    return F if vol >= 0 else [tuple(reversed(f)) for f in F]


def mammary_glands(skin_world, skin_normals, ribs_bvh, skin_bvh):
    """Glándula mamaria y conductos galactóforos de cada lado. `ribs_bvh`: costillas y esternón (mundo).

    La glándula sale del propio relieve de la mama de la piel: una lente cuya cara anterior va 8 mm bajo la piel (3 mm
    tras el pezón, donde no hay grasa) y la posterior, sobre el pectoral (18 mm delante de las costillas), con el contorno
    de la base de la mama (del borde del esternón a la línea axilar media, de la 2.ª a la 6.ª costilla) y la
    prolongación axilar. Lóbulos: surcos de 3 mm en su cara anterior."""
    from mathutils import Vector
    out = []
    H = skin_world[:, 2].max()
    for side, sx in (('L', 1), ('R', -1)):
        chest = (np.sign(skin_world[:, 0]) == sx) & (skin_world[:, 2] > 0.66 * H) & (skin_world[:, 2] < 0.84 * H) & \
                (np.abs(skin_world[:, 0]) > 0.04)
        i = np.argmin(np.where(chest, skin_world[:, 1], np.inf))
        nipple = skin_world[i]
        n = _unit(skin_normals[i] * np.array([0.6, 1, 0.6]))         # eje de la mama: más hacia delante que la normal
        lat = _unit(np.cross([0, 0, 1], n)) * sx; up = np.cross(n, lat) * sx

        # Rejilla polar alrededor del pezón (anillos × radios), proyectada sobre la piel con rayos desde un punto 10 cm
        # por detrás del pezón, dentro del tórax: así rodea el costado hasta la línea axilar media. Contorno de la base:
        # elipse (del borde del esternón a la línea axilar media) más la prolongación axilar.
        K, M = 22, 72
        C = nipple - n * 0.10
        th = np.linspace(0, 2 * np.pi, M, endpoint=False)
        c, sn = np.cos(th), np.sin(th)
        ra = np.where(c > 0, 0.10, 0.085); rb = np.where(sn > 0, 0.09, 0.07)      # distancias sobre la piel
        R = 1 / np.sqrt((c / ra) ** 2 + (sn / rb) ** 2)
        t_ang = np.arctan2(0.65, 0.75)                               # prolongación axilar: arriba y afuera
        R += 0.04 * np.exp(-((np.angle(np.exp(1j * (th - t_ang)))) / 0.3) ** 2)
        u = np.linspace(0, 1, K + 1)[1:]
        grid = np.empty((K, M, 2, 3))
        for j in range(M):                                           # cada radio: puntos a la distancia u·R sobre la piel
            prev, arc, k = nipple, 0.0, 0
            for phi in np.linspace(0.005, 1.4, 280):
                d = n * np.cos(phi) + (lat * c[j] + up * sn[j]) * np.sin(phi)
                loc, nrm, _, _ = skin_bvh.ray_cast(Vector(C), Vector(d), 0.4)
                if loc is None: continue
                p = np.array(loc); arc += np.linalg.norm(p - prev); prev = p
                while k < K and arc >= u[k] * R[j]:
                    grid[k, j] = p, np.array(nrm); k += 1
                if k == K: break
            while k < K: grid[k, j] = prev, grid[k - 1, j, 1]; k += 1
        S = np.vstack([nipple, grid[:, :, 0].reshape(-1, 3)])
        N = np.vstack([skin_normals[i], grid[:, :, 1].reshape(-1, 3)])
        uu = np.r_[0, np.repeat(u, M)]; tt = np.r_[0, np.tile(th, K)]
        def at(k, j): return 0 if k < 0 else 1 + k * M + j % M      # anillo k (0 = el primero), radio j
        F = [(0, at(0, j), at(0, j + 1)) for j in range(M)]
        F += [(at(k, j), at(k + 1, j), at(k + 1, j + 1), at(k, j + 1)) for k in range(K - 1) for j in range(M)]
        # Orientación de la cara anterior: hacia delante (+n).
        a0, b0, c0 = S[F[1][0]], S[F[1][1]], S[F[1][2]]
        if np.cross(b0 - a0, c0 - a0) @ n < 0: F = [tuple(reversed(f)) for f in F]
        boundary = uu >= 1 - 1e-9
        s = np.clip((1 - uu) / 0.35, 0, 1); s = s * s * (3 - 2 * s)  # grosor: 0 en el contorno
        d_ax = uu * np.r_[0, np.tile(R, K)]
        lobes = 0.5 - 0.5 * np.cos(15 * tt)                         # 15 lóbulos alrededor del pezón
        q = np.clip((d_ax - 0.012) / 0.02, 0, 1); q = q * q * (3 - 2 * q)
        # Profundidad de la cara anterior bajo la piel (2026-11-06, con la grasa): 3 mm tras el pezón; fuera, 9 mm en las
        # crestas de los lóbulos (donde se insertan los ligamentos suspensorios) y 14 mm entre ellos; hacia el contorno
        # vuelve a 3 mm, donde la mama se funde con la pared del tórax. Antes, 8 mm con surcos de 3.
        edge = 1 - np.clip((uu - 0.7) / 0.3, 0, 1) ** 2 * (3 - 2 * np.clip((uu - 0.7) / 0.3, 0, 1))
        depth = 0.003 + (0.006 * q + 0.005 * lobes * q * s) * edge
        front = S - N * depth[:, None]
        # Espacio hasta el pectoral (18 mm delante de las costillas), hacia el centro de la rejilla.
        inward = C - front; inward /= np.linalg.norm(inward, axis=1)[:, None]
        room = np.empty(len(S))
        for k, p in enumerate(front):
            h, _, _, dist = ribs_bvh.ray_cast(Vector(p), Vector(inward[k]), 0.2)
            if h is None: _, _, _, dist = ribs_bvh.find_nearest(Vector(p))
            room[k] = max(0.0, (dist if dist is not None else 0.05) - 0.018)
        E = np.array([(f[i], f[(i + 1) % len(f)]) for f in F for i in range(len(f))])
        deg = np.maximum(np.bincount(E.ravel(), minlength=len(S)), 1)
        t = np.minimum(room, 0.03) * s
        for _ in range(30):                                          # sin la huella de cada costilla
            acc = np.zeros(len(S)); np.add.at(acc, E[:, 0], t[E[:, 1]]); np.add.at(acc, E[:, 1], t[E[:, 0]])
            t = np.where(boundary, 0.0, np.minimum(0.5 * t + 0.5 * acc / deg, np.minimum(room, 0.03)))
        back = front + inward * t[:, None]
        # Lente cerrada: cara anterior y posterior (invertida); el contorno es común.
        nb = len(S)
        idx_back = np.where(boundary, np.arange(nb), nb + np.cumsum(~boundary) - 1)
        V = np.vstack([front, back[~boundary]])
        F = F + [tuple(int(idx_back[k]) for k in reversed(f)) for f in F]
        out.append((f'Mammary_gland_{side}', 'mammary', V, F, False))
        out += breast_fat_and_ligaments(side, S, N, front, depth, R, th, u, K, M)
        # Conductos galactóforos: del pezón al interior de la glándula, con su seno junto a la areola.
        base = nipple - n * 0.002
        mid = (front + back) / 2
        for k in range(14):
            a = 2 * np.pi * (k + 0.5) / 14
            rdir = lat * np.cos(a) + up * np.sin(a)
            target = nipple + rdir * 0.042
            j = np.argmin(np.linalg.norm(S - target, axis=1))
            p2 = mid[j]
            p1 = nipple - n * 0.007 + rdir * 0.006
            path = curve([base, p1, (p1 + p2) / 2 - n * 0.002, p2], 16)
            r = np.interp(np.linspace(0, 1, 16), [0, 0.2, 0.35, 1], [0.0009, 0.0020, 0.0011, 0.0007])
            V, F = tube(path, r, r, seg=8)
            out.append((f'Lactiferous_ducts_{side}', 'duct_f', V, F, False))
    return out
