"""Piel de los genitales externos masculinos (pene y escroto), que no existe en la piel de MakeHuman.

La piel de MakeHuman tiene la ingle lisa. Este script construye la piel del pene y del escroto alrededor de los órganos
de Z-Anatomy ya colocados (anato3d_fit.GenitalPose: pene péndulo de ~8,5 cm visibles, testículos de adulto en el
escroto), como una función de distancia con signo muestreada en una rejilla de 0,8 mm y extraída con «surface nets»:
  - pene: un tubo que sigue el eje del pene con la sección real de los cuerpos cavernosos, el esponjoso y los vasos
    dorsales, más 3 mm de piel, con pliegues muy leves y un rodete de prepucio retraído detrás de la corona;
  - glande, descubierto: el de Z-Anatomy es un cilindro romo, así que se esculpe uno en forma de bellota que lo
    contiene, con corona oblicua y su reborde, y el meato como una hendidura en la punta;
  - escroto: un solo saco, dos lóbulos (un elipsoide por testículo con su epidídimo, orientado según sus ejes), un
    tabique y un cuello que entra en el periné, unidos con unión suave; un elipsoide por lado envuelve el cordón y los
    vasos pudendos externos donde quedan fuera de la piel del cuerpo; el izquierdo cuelga más; arrugas (rugae)
    irregulares y rafe en la línea media; donde roza los muslos se aplana contra ellos en vez de cruzarlos;
  - pene y escroto, una sola pieza: en la base del pene el escroto sube hasta su cara ventral y se une a ella (unión
    penoescrotal); más abajo el pene cuelga libre por delante y el escroto cede donde se apoya, con una holgura de GAP
    (sin ella se fundían a lo largo del tronco);
  - unión con la piel del cuerpo: donde nacen el pene y el escroto, unión suave con la piel de MakeHuman (sin escalón);
    lo que es solo piel del cuerpo se quita, y la franja que la toca se hunde 1,2 mm bajo ella (sin borde ni rendija).
Color por vértice («Tono», multiplicador del color de la piel): más pigmentado que el tronco, más oscuro en el escroto,
los surcos de las arrugas y el rafe; el glande, rosado; junto a la unión, el mismo tono que la piel del cuerpo.

Uso (desde la raíz del proyecto, después de construir los sistemas):
  /Applications/Blender.app/Contents/MacOS/Blender -b --disable-autoexec Anato3D_Male_30_Fase2.blend \
    --python tools/build_genital_skin.py
  /Applications/Blender.app/Contents/MacOS/Blender -b --disable-autoexec --python tools/export_glb.py -- \
    build/male_integumentary.blend Genital_Skin web/public/models/male-integumentary.glb
"""
import bpy, bmesh, os, re, sys, json, base64, time
import numpy as np
from mathutils import Vector, Matrix, bvhtree, kdtree

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
WEB = os.environ.get('A3D_WEB_MODELS') or os.path.join(ROOT, 'web/public/models')   # build_all.sh: preparación
VOX = 0.0008              # m, rejilla de la función de distancia
SKIN = 0.002              # grosor de la piel del pene sobre lo más externo (vena dorsal superficial)
COVER = 0.0045            # piel sobre los vasos y el cordón que quedan fuera de la piel del cuerpo
WALL = 0.0055             # pared del escroto (piel, dartos, fascias, túnica vaginal) sobre testículo y epidídimo
GAP = 0.0015              # holgura entre el pene y el escroto donde el pene se apoya en él
J_LEN = 0.012             # tramo de la cara ventral del pene, desde la salida de la piel, unido al escroto
FACES = 40000
PENIS = ('Corpus_cavernosum_of_penis', 'Corpus_spongiosum_of_penis', 'Glans_penis')
PENIS_TUBE = ('Corpus_cavernosum_of_penis', 'Corpus_spongiosum_of_penis', 'Dorsal_artery_of_penis_L',
              'Dorsal_artery_of_penis_R', 'Deep_dorsal_vein_of_penis', 'Superficial_dorsal_veins_of_penis')
SCROTAL = ('Testis_L', 'Testis_R', 'Epididymis_L', 'Epididymis_R')
CORD = re.compile(r'Ductus_deferens|testicular|pudendal|Genital_branch_of_genitofemoral|of_penis')
_t0 = time.time()

def log(*a): print(f'[genital] {time.time() - _t0:5.1f}s', *a, flush=True)

# Muscular, conjuntivo y linfático solo se cargan para comprobar que la región externa no los toca.
for system, col in (('urogenital', 'Urogenital_System'), ('arterial', 'Arterial_System'), ('venous', 'Venous_System'),
                    ('nervous', 'Nervous_System'), ('muscular', 'Muscular_System'), ('connective', 'Connective_System'),
                    ('lymphatic', 'Lymphatic_System')):
    with bpy.data.libraries.load(os.path.join(ROOT, 'build', f'male_{system}.blend')) as (src, dst):
        dst.collections = [col]
    bpy.context.scene.collection.children.link(dst.collections[0])
bpy.context.view_layer.update()

def world(o):
    m = np.array(o.matrix_world)
    co = np.empty(len(o.data.vertices) * 3); o.data.vertices.foreach_get('co', co)
    return co.reshape(-1, 3) @ m[:3, :3].T + m[:3, 3]

skin = bpy.data.objects['Skin_Body']
SW = world(skin)
SKIN_BVH = bvhtree.BVHTree.FromPolygons(SW.tolist(), [p.vertices[:] for p in skin.data.polygons])
DIRS = [Vector(d) for d in ((1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1))]

def depth(p):
    """Distancia con signo a la piel del cuerpo (positiva = fuera), confirmada por paridad como en anato3d_fit."""
    loc, nrm, _, dist = SKIN_BVH.find_nearest(p)
    odd = 0
    for d in DIRS:
        o, n = p, 0
        while n < 24:
            hit = SKIN_BVH.ray_cast(o + d * 1e-5, d)[0]
            if hit is None: break
            n += 1; o = hit
        odd += n % 2
    return -dist if odd >= 4 else dist

def body_sd(P):
    """Distancia con signo a la piel del cuerpo por la cara más cercana (cerca de la superficie basta)."""
    out = np.empty(len(P))
    for i, p in enumerate(P):
        loc, nrm, _, d = SKIN_BVH.find_nearest(Vector(p))
        out[i] = d if (Vector(p) - loc).dot(nrm) >= 0 else -d
    return out

def sm(t):
    t = np.clip(t, 0.0, 1.0)
    return t * t * (3 - 2 * t)

def smin(a, b, k):
    """Unión suave (polinómica); k puede variar por punto. Con k = 0 es el mínimo."""
    k = np.maximum(k, 1e-9)
    h = np.clip(0.5 + 0.5 * (b - a) / k, 0, 1)
    return b + (a - b) * h - k * h * (1 - h)

def ellipsoid_sd(P, c, E, r):
    """Distancia (aprox. de Quílez) a un elipsoide de centro c, ejes en las filas de E y semiejes r."""
    q = (P - c) @ E.T
    k0 = np.linalg.norm(q / r, axis=1); k1 = np.linalg.norm(q / (r * r), axis=1)
    return k0 * (k0 - 1) / np.maximum(k1, 1e-9)

# ── Pene: eje, sección y extremos ───────────────────────────────────────────
pts = {n: world(bpy.data.objects[n]) for n in PENIS_TUBE + PENIS + SCROTAL if n in bpy.data.objects}
CC, GL = pts['Corpus_cavernosum_of_penis'], pts['Glans_penis']
y0 = CC[:, 1].min() + 0.37 * np.ptp(CC[:, 1])
D = np.vstack([CC[CC[:, 1] < y0], GL]); pc = D.mean(0)
U = np.linalg.svd(D - pc)[2][0]; U = U if U @ (GL.mean(0) - pc) > 0 else -U          # hacia la punta
EW = np.array([1.0, 0, 0]) - U[0] * U; EW /= np.linalg.norm(EW)                       # lateral
EH = np.cross(U, EW)                                                                   # dorsal–ventral
sg = (GL - pc) @ U
S_TIP, S_COR = sg.max(), np.percentile(sg, 4)
s_exit = S_COR
while s_exit > S_COR - 0.2 and depth(Vector(pc + U * s_exit)) > 0: s_exit -= 0.001
# Sección del tubo cada 2 mm: centro y semiejes de lo que hay dentro (cuerpos, vasos dorsales), suavizados.
T = np.vstack([pts[n] for n in PENIS_TUBE if n in pts])
ts = (T - pc) @ U; tw = (T - pc) @ EW; th = (T - pc) @ EH
S_GRID = np.arange(s_exit - 0.03, S_COR + 0.0021, 0.002)
# Cerca de la base solo cuenta lo que asoma de la piel del cuerpo: dentro del pubis el tubo no
# hace falta, y si seguía con su sección completa, su dorso corría casi paralelo al monte del pubis y dejaba una cresta.
outside = body_sd(T) > 0.0
prof = []
for s in S_GRID:
    sel = (np.abs(ts - s) < 0.003) & (outside | (s > s_exit + 0.01))
    if sel.sum() < 6: prof.append((prof[-1][0], prof[-1][1], 0.003, 0.003) if prof else (0, 0, 0.003, 0.003)); continue
    w0, w1 = tw[sel].min(), tw[sel].max(); h0, h1 = th[sel].min(), th[sel].max()
    cw, ch, a, b = (w0 + w1) / 2, (h0 + h1) / 2, max((w1 - w0) / 2, 0.003), max((h1 - h0) / 2, 0.003)
    # La elipse inscrita en la caja deja fuera las «esquinas» de los dos cuerpos cavernosos: se agranda hasta
    # contenerlos todos.
    qmax = np.hypot((tw[sel] - cw) / a, (th[sel] - ch) / b).max()
    prof.append((cw, ch, a * max(qmax, 1.0), b * max(qmax, 1.0)))
prof = np.array(prof)
# Suavizado que no encoge: primero la envolvente (máximo en ±6 mm), luego la media con los vecinos, nunca por debajo
# de lo que hay que cubrir (sin la envolvente quedaban anillos cada centímetro).
raw = prof.copy()
env = raw.copy()
for k in range(1, 4):
    env[k:, 2:] = np.maximum(env[k:, 2:], raw[:-k, 2:]); env[:-k, 2:] = np.maximum(env[:-k, 2:], raw[k:, 2:])
prof[:, 2:] = env[:, 2:]
# En la base, nunca más ancha que el tronco (+15 %): las crura divergen justo bajo la piel y la abrían como una trompeta.
mid_ab = np.median(prof[(S_GRID > s_exit + 0.015) & (S_GRID < S_COR - 0.01), 2:], axis=0)
base = S_GRID < s_exit + 0.015
prof[base, 2:] = np.minimum(prof[base, 2:], mid_ab * 1.15)
raw[base, 2:] = np.minimum(raw[base, 2:], mid_ab * 1.15)
for _ in range(10):
    prof[1:-1] = 0.25 * prof[:-2] + 0.5 * prof[1:-1] + 0.25 * prof[2:]
    prof[:, 2:] = np.maximum(prof[:, 2:], raw[:, 2:] - 0.0002)
log(f'pene: eje {np.round(U, 2)}, sale de la piel a {(S_TIP - s_exit) * 100:.1f} cm de la punta; '
    f'sección del tronco {2 * prof[len(prof) // 2, 2] * 100:.1f} × {2 * prof[len(prof) // 2, 3] * 100:.1f} cm sin piel')

def penis_sd(P):
    s = (P - pc) @ U; w = (P - pc) @ EW; h = (P - pc) @ EH
    cw = np.interp(s, S_GRID, prof[:, 0]); ch = np.interp(s, S_GRID, prof[:, 1])
    # Base algo más ancha (se funde con el pubis) y piel de SKIN sobre lo más externo.
    flare = 0.002 * (1 - sm((s - s_exit) / 0.02))
    a = np.interp(s, S_GRID, prof[:, 2]) + SKIN + flare; b = np.interp(s, S_GRID, prof[:, 3]) + SKIN + flare
    q = np.hypot((w - cw) / a, (h - ch) / b)
    radial = (q - 1) * np.minimum(a, b)
    # Rodete del prepucio retraído: un anillo de 2,2 mm justo detrás de la corona.
    s_col = S_COR - 0.0055
    collar = np.hypot((s - s_col) * 0.7, np.maximum(radial, -0.002)) - 0.0015
    shaft = smin(radial, collar, 0.0025)
    # Piel del tronco: pliegues longitudinales muy leves (sin ellos parecía un tubo de plástico).
    ang = np.arctan2((h - ch) / b, (w - cw) / a)
    wr = (0.7 * np.sin(ang * 9 + s * 140) + 0.3 * np.sin(ang * 14 - s * 210 + 1.0)) * sm((s - s_exit - 0.01) / 0.01) * (1 - sm((s - s_col + 0.008) / 0.004))
    shaft = shaft - 0.0001 * wr * sm(1 - np.abs(shaft) / 0.002)
    # Extremo distal metido bajo el glande (romo); el proximal, dentro del cuerpo.
    end = s - (S_COR + 0.002)
    shaft = np.maximum(shaft, end)
    shaft = np.maximum(shaft, (s_exit - 0.035) - s)
    return smin(shaft, glans_sd(s, w, h), 0.0008), s              # surco balanoprepucial sin arista dentada

# ── Glande: el de Z-Anatomy es un cilindro romo (2,3–2,9 cm, sin corona marcada). La piel lleva uno esculpido en forma
#    de bellota que lo contiene: se estrecha hacia la punta, corona oblicua (más distal por la cara ventral) con su
#    reborde, más débil junto al frenillo, y el meato como una hendidura en la punta.
gs = (GL - pc) @ U; gw = (GL - pc) @ EW; gh = (GL - pc) @ EH
G0 = S_COR - 0.0015                                       # base de la corona en la cara dorsal
GLEN = S_TIP - G0 + 0.0012
T_GRID = np.linspace(0, GLEN, 50)
# Centro y radio de cada sección (centro de su caja: la media se va hacia la cara ventral, más poblada de vértices).
g_c, r_za = [], []
for t in T_GRID:
    sel = np.abs(gs - G0 - t) < 0.0015
    if sel.sum() < 6: g_c.append(g_c[-1] if g_c else (gw.mean(), gh.mean())); r_za.append(0.0); continue
    cw, ch = (gw[sel].min() + gw[sel].max()) / 2, (gh[sel].min() + gh[sel].max()) / 2
    g_c.append((cw, ch)); r_za.append(np.percentile(np.hypot(gw[sel] - cw, gh[sel] - ch), 97))
g_c = np.array(g_c); r_za = np.array(r_za)
# El eje del glande, recto: los centros de las secciones del de Z-Anatomy oscilan y la superficie, que los sigue,
# salía con anillos. Recta ajustada por mínimos cuadrados en su tramo central.
fit = (T_GRID > 0.004) & (T_GRID < GLEN - 0.003)
for k in range(2):
    g_c[:, k] = np.polyval(np.polyfit(T_GRID[fit], g_c[fit, k], 1), T_GRID)
# Sin el reborde de la base del de Z-Anatomy (dejaba un ala ancha alrededor de la corona) y suavizado (dejaba anillos).
r_za[T_GRID < 0.0025] = r_za[np.argmax(T_GRID >= 0.0025)]
for _ in range(6): r_za[1:-1] = 0.25 * r_za[:-2] + 0.5 * r_za[1:-1] + 0.25 * r_za[2:]
# La corona sobresale algo del tronco (con su piel), como en un pene real.
shaft_r = (prof[-4:, 2:].mean(0) + SKIN).max()
R_C = max(r_za.max() + 0.0006, shaft_r + 0.0015)
r_shape = R_C * np.clip(1 - (T_GRID / GLEN) ** 2.3, 0, 1) ** 0.55
G_PROF = np.maximum(r_shape, r_za + 0.0004)
log(f'glande: {2 * R_C * 100:.1f} cm de diámetro en la corona, {GLEN * 100:.1f} cm de largo')

def glans_sd(s, w, h):
    t = s - G0
    G_CW, G_CH = np.interp(t, T_GRID, g_c[:, 0]), np.interp(t, T_GRID, g_c[:, 1])
    rho = np.hypot(w - G_CW, h - G_CH)
    hn = np.clip((h - G_CH) / np.maximum(rho, 1e-6), -1, 1)          # +1 dorsal, −1 ventral
    t_base = 0.0025 * np.maximum(0.0, -hn)                            # corona oblicua
    rim = 0.0011 * np.exp(-((t - t_base - 0.0014) / 0.0014) ** 2) * (1 - 0.75 * np.maximum(0.0, -hn))
    r = np.interp(t, T_GRID, G_PROF, right=0.0) + rim
    d = -smin(-(rho - r), -(t_base - t), 0.002)                    # canto posterior de la corona, redondeado
    # Meato: hendidura dorsoventral de 6 mm en la punta.
    tip = np.array([g_c[-1, 0], g_c[-1, 1] - 0.0006, GLEN])
    q = np.stack([w - tip[0], h - tip[1], t - tip[2]], -1)
    slit = np.hypot(q[:, 0] / 0.0007, np.maximum(np.abs(q[:, 1]) - 0.0028, 0) / 0.0007)
    slit = (np.minimum(slit, 3) - 1) * 0.0007 + np.maximum(-q[:, 2] - 0.0012, 0)   # 1,2 mm: más hondo asomaba la uretra
    return -smin(-d, slit, 0.0006)

# ── Escroto ────────────────────────────────────────────────────────────────
lobes = []
for side in ('L', 'R'):
    Pt, Pe = pts[f'Testis_{side}'], pts[f'Epididymis_{side}']
    ct = Pt.mean(0); E = np.linalg.svd(Pt - ct)[2]; E[0] = E[0] if E[0][2] > 0 else -E[0]
    # Con los vasos testiculares y el conducto deferente que bajan por detrás del testículo (asomaban 1–2 mm).
    vessels = [world(o) for o in bpy.data.objects if o.type == 'MESH' and re.search(
        r'testicular_(artery|vein)|Ductus_deferens', o.name) and ('Left' in o.name or o.name.endswith('_L')) == (side == 'L')]
    V_ = np.vstack(vessels) if vessels else np.zeros((0, 3))
    V_ = V_[(np.linalg.norm(V_ - ct, axis=1) < 0.035) & (V_[:, 2] < Pt[:, 2].max())]
    both = np.vstack([Pt, Pe, V_]); q = (both - ct) @ E.T
    lo, hi = q.min(0), q.max(0)
    c = ct + ((lo + hi) / 2) @ E
    r = (hi - lo) / 2 + WALL
    # El saco cuelga: algo más de holgura abajo (el centro baja 2 mm y el eje largo crece 2 mm).
    c = c - E[0] * 0.002; r = r + np.array([0.002, 0.0, 0.0])
    lobes.append((c, E, r, side))
    log(f'escroto {side}: lóbulo centrado en {np.round(c * 100, 1)} cm, semiejes {np.round(r * 100, 2)} cm')
cL, cR = lobes[0][0], lobes[1][0]
mid = (cL + cR) / 2
# Tabique: une los dos lóbulos en un solo saco (sin él parecían dos huevos colgando, separados).
sep_c = mid.copy(); sep_r = np.array([abs(cL[0] - cR[0]) * 0.55, (lobes[0][2][1] + lobes[1][2][1]) / 2 * 0.9,
                                      (lobes[0][2][0] + lobes[1][2][0]) / 2 * 0.8])
sep_E = np.eye(3)
# Lo que tiene que cubrir la piel además de los lóbulos: los cordones espermáticos y los vasos pudendos externos
# donde quedan fuera de la piel del cuerpo (la ingle de MakeHuman es cóncava). Una cápsula hacia arriba dejaba dos
# «cuernos» en el aire; aquí la piel los envuelve donde están.
cover_names = [o.name for o in bpy.data.objects if o.type == 'MESH' and re.search(
    r'Ductus_deferens|testicular_(artery|vein)|Genital_branch_of_genitofemoral|external_pudendal', o.name)]
CP = np.vstack([world(bpy.data.objects[n]) for n in cover_names])
tops = max(c[2] + r[0] * E[0][2] for c, E, r, _ in lobes)
CP = CP[(CP[:, 2] > tops - 0.025) & (np.abs(CP[:, 0]) < 0.05) & (CP[:, 1] < -0.05)]
CP = CP[body_sd(CP) > -0.002]
# Un elipsoide por lado que los envuelve (envolver cada vaso dejaba el escroto lleno de bultos).
cover_ell = []
for sx in (1, -1):
    Q = CP[CP[:, 0] * sx > 0]
    if len(Q) < 10: continue
    c = Q.mean(0); E = np.linalg.svd(Q - c)[2]
    r = np.maximum(np.abs((Q - c) @ E.T).max(0) + COVER, 0.008)
    cover_ell.append((c, E, r))
log(f'cordón y vasos a cubrir: {len(CP)} puntos fuera de la piel del cuerpo, de '
    f'{", ".join(sorted({re.sub("_[LR]$", "", n) for n in cover_names}))}; elipsoides de '
    + ', '.join(f'{np.round(r * 200, 1)} cm' for _, _, r in cover_ell))
# Cuello: de la base del pene (cara ventral) al periné, entre los muslos; ancho, para que el escroto nazca de la ingle.
neck_c = np.array([0.0, (CP[:, 1].mean() if len(CP) else mid[1]) + 0.002, tops + 0.012])
neck_E = np.eye(3); neck_r = np.array([max(0.028, np.abs(CP[:, 0]).max() + 0.004 if len(CP) else 0.028), 0.02, 0.019])
Z_ROOT = tops - 0.008                 # por encima, el escroto se une al cuerpo (ingle); por debajo, se aplana contra los muslos

def ridges(P):
    """Arrugas (rugae): sobre todo transversales, irregulares (dos familias de bandas de 4–7 mm con el dominio
    deformado por ruido, que se cortan y se desvanecen a trozos) y un fino rizado; valores en torno a ±1."""
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    warp = (0.0022 * np.sin(x * 330 + y * 140 + 0.7) + 0.0016 * np.sin(y * 410 - x * 260 + 1.9)
            + 0.0012 * np.sin(x * 690 + z * 380 + 2.6) + 0.0008 * np.sin(z * 900 - y * 520))
    a = np.sin((z + 0.35 * x + warp) * 2 * np.pi / 0.0055)
    b = np.sin((z - 0.45 * x + 0.8 * warp) * 2 * np.pi / 0.0068 + 1.1)
    patch = 0.5 + 0.5 * np.sin(x * 260 + y * 310 + z * 180)               # dónde domina cada familia
    fine = 0.3 * np.sin(x * 1700 + y * 1100 + z * 800) * np.sin(y * 1500 - z * 1300 + x * 400)
    return patch * a + (1 - patch) * b + fine

def rugae_amp(P):
    """Altura de las arrugas: más marcadas delante y abajo; nada en el cuello ni en el rafe."""
    front = sm((mid[1] - P[:, 1]) / 0.02 + 0.5)
    return 0.0002 * (0.4 + 0.6 * front) * (1 - sm((P[:, 2] - (Z_ROOT - 0.014)) / 0.012)) * sm(np.abs(P[:, 0]) / 0.004)

def scrotum_sd(P):
    a = ellipsoid_sd(P, *lobes[0][:3]); b = ellipsoid_sd(P, *lobes[1][:3])
    d = smin(smin(a, b, 0.012), ellipsoid_sd(P, sep_c, sep_E, sep_r), 0.012)   # un solo saco, surco suave en medio
    d = smin(d, ellipsoid_sd(P, neck_c, neck_E, neck_r), 0.012)
    d = d - rugae_amp(P) * ridges(P) * sm(1 - np.abs(d) / 0.004)
    # Rafe: un cordoncillo de 0,3 mm en la línea media.
    d = d - 0.0003 * np.exp(-(P[:, 0] / 0.0012) ** 2) * (1 - sm((P[:, 2] - Z_ROOT) / 0.01))
    return d

def scrotum_full(P):
    """El escroto con la piel que cubre el cordón y los vasos que quedan fuera del cuerpo, en unión suave."""
    d = scrotum_sd(P)
    for c, E, r in cover_ell: d = smin(d, ellipsoid_sd(P, c, E, r), 0.012)
    return d

def genitals(P):
    """Pene (distancia y posición s en su eje) y escroto como una sola pieza: en los primeros J_LEN del pene, el escroto
    se une a su cara ventral con una unión suave ancha (unión penoescrotal; antes quedaba entre los dos piel del cuerpo y
    el pene parecía salir solo del bajo vientre); más abajo, el escroto cede donde se apoya el pene (máximo suave con
    GAP − distancia al pene) y el pene cuelga libre delante."""
    sp, s_ax = penis_sd(P)
    ss = scrotum_full(P)
    wj = 1 - sm((s_ax - s_exit - J_LEN) / 0.014)
    # Solo por la cara ventral (y algo por los lados): unida también por los lados, la base quedaba como un bloque de
    # techo plano, más ancho que el pene.
    hv = ((P - pc) @ EH - np.interp(s_ax, S_GRID, prof[:, 1])) / (np.interp(s_ax, S_GRID, prof[:, 3]) + SKIN)
    joined = smin(ss, sp, 0.016 * (1 - sm((hv + 0.2) / 0.6)))
    carved = -smin(-ss, sp - GAP, 0.004)
    return sp, s_ax, wj * joined + (1 - wj) * carved

# ── Campo completo en la rejilla ───────────────────────────────────────────
def bounds():
    ext = [GL, pts['Corpus_cavernosum_of_penis'][((pts['Corpus_cavernosum_of_penis'] - pc) @ U) > s_exit - 0.02]]
    for c, E, r, _ in lobes: ext.append(c + np.array([[sx, sy, sz] for sx in (-1, 1) for sy in (-1, 1) for sz in (-1, 1)]) * r.max())
    ext.append(neck_c + neck_r * np.array([[-1, -1, -1], [1, 1, 1]]))
    A = np.vstack(ext)
    return A.min(0) - 0.012, A.max(0) + 0.012
lo, hi = bounds()
dims = np.ceil((hi - lo) / VOX).astype(int) + 1
gx, gy, gz = [lo[i] + np.arange(dims[i]) * VOX for i in range(3)]
G = np.stack(np.meshgrid(gx, gy, gz, indexing='ij'), -1).reshape(-1, 3)
log(f'rejilla {dims.tolist()} ({len(G) / 1e6:.1f} M puntos)')
def field(P, verbose=False):
    """La función completa: pene y escroto, con su unión con la piel del cuerpo."""
    sp, s_ax, ss = genitals(P)
    gen = np.minimum(sp, ss)
    # Distancia a la piel del cuerpo, solo en la banda donde importa (cerca de los genitales).
    band = gen < 0.014
    bd = np.full(len(P), 1.0); bd[band] = body_sd(P[band])
    if verbose: log(f'distancia a la piel del cuerpo en {band.sum() / 1e6:.2f} M puntos')
    # Unión suave con el cuerpo donde nacen: base del pene (primeros 2,5 cm) y raíz del escroto; más abajo el escroto
    # se aplana contra los muslos (diferencia con la piel del cuerpo, 1,5 mm de holgura) en vez de atravesarlos.
    k_pen = 0.006 * (1 - sm((s_ax - s_exit) / 0.02))        # la piel del pubis sigue por el dorso del pene
    # Unión con el cuerpo solo cerca de la línea media (periné y base del pene): a los lados formaba membranas finas
    # hasta el muslo. Contra el muslo, aplanado con el canto redondeado.
    w_root = sm((P[:, 2] - (Z_ROOT - 0.012)) / 0.012) * (1 - sm((np.abs(P[:, 0]) - 0.018) / 0.01))
    scro = (1 - w_root) * -smin(-ss, -(0.0015 - bd), 0.003) + w_root * smin(ss, bd, 0.009)
    pen = smin(sp, bd, k_pen)
    return np.where(band, np.minimum(pen, scro), gen)

F = field(G, verbose=True)
F = F.reshape(dims)

# ── Surface nets ───────────────────────────────────────────────────────────
inside = F < 0
corners = [(i, j, k) for k in (0, 1) for j in (0, 1) for i in (0, 1)]
nx, ny, nz = dims - 1
cnt = np.zeros((nx, ny, nz), np.int8)
for (i, j, k) in corners: cnt += inside[i:i + nx, j:j + ny, k:k + nz]
active = (cnt > 0) & (cnt < 8)
acc = np.zeros((nx, ny, nz, 3)); num = np.zeros((nx, ny, nz))
EDGES = [((0, 0, 0), (1, 0, 0)), ((0, 1, 0), (1, 1, 0)), ((0, 0, 1), (1, 0, 1)), ((0, 1, 1), (1, 1, 1)),
         ((0, 0, 0), (0, 1, 0)), ((1, 0, 0), (1, 1, 0)), ((0, 0, 1), (0, 1, 1)), ((1, 0, 1), (1, 1, 1)),
         ((0, 0, 0), (0, 0, 1)), ((1, 0, 0), (1, 0, 1)), ((0, 1, 0), (0, 1, 1)), ((1, 1, 0), (1, 1, 1))]
for a, b in EDGES:
    fa = F[a[0]:a[0] + nx, a[1]:a[1] + ny, a[2]:a[2] + nz]; fb = F[b[0]:b[0] + nx, b[1]:b[1] + ny, b[2]:b[2] + nz]
    cross = (fa < 0) != (fb < 0)
    t = np.where(cross, fa / np.where(cross, fa - fb, 1), 0)
    pos = np.stack([np.array(a)[i] + t * (b[i] - a[i]) for i in range(3)], -1)
    acc += pos * cross[..., None]; num += cross
idx = -np.ones((nx, ny, nz), np.int64)
cells = np.argwhere(active)
idx[tuple(cells.T)] = np.arange(len(cells))
V = lo + (cells + acc[tuple(cells.T)] / num[tuple(cells.T)][:, None]) * VOX
quads = []
for axis in range(3):
    # Aristas de la rejilla a lo largo de `axis` con cambio de signo; las cuatro celdas que las rodean.
    sl0 = [slice(None)] * 3; sl1 = [slice(None)] * 3; sl0[axis] = slice(0, -1); sl1[axis] = slice(1, None)
    f0, f1 = inside[tuple(sl0)], inside[tuple(sl1)]
    e = np.argwhere(f0 != f1)
    o1, o2 = [ax for ax in range(3) if ax != axis]
    ok = (e[:, o1] >= 1) & (e[:, o2] >= 1) & (e[:, o1] < dims[o1] - 1) & (e[:, o2] < dims[o2] - 1)
    e = e[ok]
    flip = f0[tuple(e.T)]
    c = []
    for d1, d2 in ((0, 0), (1, 0), (1, 1), (0, 1)):
        cc = e.copy(); cc[:, o1] -= 1 - d1; cc[:, o2] -= 1 - d2
        c.append(idx[tuple(cc.T)])
    q = np.stack(c, 1)
    q[flip] = q[flip][:, ::-1]
    quads.append(q[(q >= 0).all(1)])
Q = np.vstack(quads)
log(f'superficie: {len(V)} vértices, {len(Q)} cuadriláteros')

# Cada vértice, sobre la superficie exacta (dos pasos de Newton con el gradiente por diferencias centrales): con la
# posición de «surface nets» quedaban escalones de un vóxel que se veían como anillos donde la superficie es casi
# paralela a la rejilla (el glande).
def project(X, steps=2, h=0.0002):
    for _ in range(steps):
        f = field(X)
        g = np.stack([(field(X + h * e) - field(X - h * e)) / (2 * h) for e in np.eye(3)], 1)
        X = X - (f / np.maximum((g * g).sum(1), 0.25))[:, None] * g
    return X
V = project(V)
log('vértices proyectados sobre la superficie')
me = bpy.data.meshes.new('Skin_Genitals')
me.from_pydata(V.tolist(), [], Q.tolist()); me.update()
obj = bpy.data.objects.new('Skin_Genitals', me)
bpy.context.scene.collection.objects.link(obj)

# ── Recorte: fuera lo que es piel del cuerpo o queda dentro de él ──────────
bm = bmesh.new(); bm.from_mesh(me)
bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
bm.verts.ensure_lookup_table()
P = np.array([v.co[:] for v in bm.verts])
bdv = body_sd(P)
# Lo que es solo piel del cuerpo (pegado a ella y a más de 4 mm de los órganos) o queda hondo dentro de él, fuera.
# El borde del recorte queda así bajo la piel del cuerpo; además, la franja que la toca se hunde 1,2 mm (ver abajo):
# cortar a ras dejaba un borde dentado asomando.
sp_v, _, ss_v = genitals(P); genv = np.minimum(sp_v, ss_v)
drop = ((bdv < 0.0003) & (genv > 0.004)) | (bdv < -0.004)
bmesh.ops.delete(bm, geom=[f for f in bm.faces if all(drop[v.index] for v in f.verts)], context='FACES')
bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
# Solo el trozo grande (fuera restos sueltos).
bm.verts.ensure_lookup_table(); seen = set(); comps = []
for v in bm.verts:
    if v.index in seen: continue
    stack, comp = [v], []; seen.add(v.index)
    while stack:
        x = stack.pop(); comp.append(x)
        for e in x.link_edges:
            y = e.other_vert(x)
            if y.index not in seen: seen.add(y.index); stack.append(y)
    comps.append(comp)
comps.sort(key=len, reverse=True)
small = [c for c in comps[1:] if len(c) < 0.05 * len(comps[0])]
bmesh.ops.delete(bm, geom=[v for c in small for v in c], context='VERTS')
bmesh.ops.triangulate(bm, faces=bm.faces[:])
# Normales hacia fuera: la función de distancia crece en esa dirección.
bm.faces.ensure_lookup_table()
FC = np.array([f.calc_center_median()[:] for f in bm.faces]); FN = np.array([f.normal[:] for f in bm.faces])
probe = lambda X: np.minimum(*genitals(X)[::2])
if np.mean(probe(FC + FN * 0.0005) > probe(FC - FN * 0.0005)) < 0.5:
    bmesh.ops.reverse_faces(bm, faces=bm.faces[:])
bm.to_mesh(me); bm.free()
# Suavizado de Taubin (λ/μ: no encoge): la red de vóxeles deja escalones de un vóxel que, con el tono por curvatura,
# se veían como anillos en el glande. El borde no se mueve.
V = np.empty(len(me.vertices) * 3); me.vertices.foreach_get('co', V); V = V.reshape(-1, 3)
E = np.empty(len(me.edges) * 2, dtype=np.int64); me.edges.foreach_get('vertices', E); E = E.reshape(-1, 2)
deg = np.maximum(np.bincount(E.ravel(), minlength=len(V)), 1)[:, None]
bm = bmesh.new(); bm.from_mesh(me); bm.verts.ensure_lookup_table()
free = np.array([0.0 if v.is_boundary else 1.0 for v in bm.verts])[:, None]; bm.free()
def lap(X):
    acc = np.zeros_like(X); np.add.at(acc, E[:, 0], X[E[:, 1]]); np.add.at(acc, E[:, 1], X[E[:, 0]])
    return acc / deg - X
for _ in range(4):
    V = V + 0.5 * free * lap(V)
    V = V - 0.53 * free * lap(V)
me.vertices.foreach_set('co', V.ravel()); me.update()
m = obj.modifiers.new('reduce', 'DECIMATE'); m.ratio = min(1.0, FACES / max(len(me.polygons), 1)); m.use_symmetry = True; m.symmetry_axis = 'X'
dg = bpy.context.evaluated_depsgraph_get(); dg.update()
new = bpy.data.meshes.new_from_object(obj.evaluated_get(dg), depsgraph=dg)
obj.modifiers.clear(); obj.data = new; bpy.data.meshes.remove(me); me = new; me.name = 'Skin_Genitals'
# La franja que toca la piel del cuerpo se hunde bajo ella (1,2 mm, con transición suave): la unión es el cruce de dos
# superficies casi tangentes, sin rendija, borde ni parpadeo.
bm = bmesh.new(); bm.from_mesh(me)
for v in bm.verts:
    loc, nrm, _, d = SKIN_BVH.find_nearest(v.co)
    d = d if (v.co - loc).dot(nrm) >= 0 else -d
    w = 1 - sm((d - 0.0002) / 0.0012)
    if w > 0: v.co = v.co - nrm * 0.0012 * float(w)
for f in bm.faces: f.smooth = True
bm.to_mesh(me); bm.free()
n_skin = len(me.vertices)

log(f'piel genital: {n_skin} vértices, {len(me.polygons)} caras')

# ── Comprobación: qué sigue saliendo de esta piel ──────────────────────────
bm = bmesh.new(); bm.from_mesh(me); GT = bvhtree.BVHTree.FromBMesh(bm); bm.free()
for o in sorted(bpy.data.objects, key=lambda o: o.name):
    if o.type != 'MESH' or o is obj or not (o.name in PENIS + SCROTAL or CORD.search(o.name)): continue
    out, worst, where = 0, 0.0, None
    for p in world(o):
        p = Vector(p)
        if depth(p) > 0.0005:      # fuera de la piel del cuerpo: ¿dentro de la genital?
            loc, nrm, _, dist = GT.find_nearest(p)
            if loc is not None and (p - loc).dot(nrm) > 0:
                out += 1
                if dist > worst: worst, where = dist, p
    if out: log(f'  {o.name}: {out} vértices fuera de la piel (hasta {worst * 1000:.1f} mm, en {np.round(np.array(where) * 100, 1)} cm, '
                f'a {((np.array(where) - pc) @ U - s_exit) * 100:.1f} cm de la salida del pene)')

# ── Región externa de los genitales, para la opción «Mostrar genitales externos» de la app ──
# Rejilla de 2 mm sobre la caja de esta piel; cada celda vale 1 si queda fuera de la piel del cuerpo. La app quita los
# triángulos de cualquier pieza con algún vértice en una celda externa (así la uretra o el conducto deferente pierden
# solo su tramo externo). En coordenadas glTF (Y arriba): glTF (x, y, z) = Blender (x, z, −y).
RVOX = 0.002
GV = np.array([v.co[:] for v in me.vertices])
rlo = np.array([GV[:, 0].min(), GV[:, 2].min(), -GV[:, 1].max()]) - 0.003
rhi = np.array([GV[:, 0].max(), GV[:, 2].max(), -GV[:, 1].min()]) + 0.003
rdims = np.ceil((rhi - rlo) / RVOX).astype(int)
bits = np.zeros(int(np.prod(rdims)), dtype=bool)
def inside_genital_skin(p):
    loc, nrm, _, _ = GT.find_nearest(p)
    return loc is not None and (p - loc).dot(nrm) < 0
for k in range(rdims[2]):
    for j in range(rdims[1]):
        for i in range(rdims[0]):
            x, y, z = rlo + (np.array([i, j, k]) + 0.5) * RVOX
            p = Vector((x, -z, y))
            # Externa si sale más de 0,6 mm de la piel del cuerpo (una celda que solo roza la piel no debe recortar la
            # fascia lata, que va 1 mm por debajo; con 1,5 mm quedaban a la vista los extremos de los conductos
            # deferentes), o si esta piel la tapa y queda por fuera de la superficie del cuerpo.
            loc, nrm, _, _ = SKIN_BVH.find_nearest(p)
            bits[i + rdims[0] * (j + rdims[1] * k)] = depth(p) > 0.0006 or (inside_genital_skin(p) and (p - loc).dot(nrm) > 0)
# Además, toda celda con un vértice de una pieza genital (cordón, vasos y nervios del pene y del escroto) que asome de
# la piel del cuerpo: con la rejilla de 2 mm, los conductos deferentes podían quedar a la vista (1–1,3 mm) en la ingle.
for o in bpy.data.objects:
    if o.type != 'MESH' or o is obj or not (o.name in PENIS + SCROTAL or CORD.search(o.name)): continue
    for p in world(o):
        q = (np.array([p[0], p[2], -p[1]]) - rlo) / RVOX
        if (q < 0).any() or (q >= rdims).any(): continue
        if depth(Vector(p)) > 0.0002:
            i, j, k = q.astype(int); bits[i + rdims[0] * (j + rdims[1] * k)] = True
json.dump({'voxel': RVOX, 'origin': [round(float(v), 5) for v in rlo], 'dims': rdims.tolist(),
           'bits': base64.b64encode(np.packbits(bits, bitorder='little').tobytes()).decode()},
          open(os.path.join(WEB, 'male-genital-region.json'), 'w'))
log(f'región externa: {rdims.tolist()} celdas de {RVOX * 1000:.0f} mm, {bits.mean() * 100:.0f} % fuera del cuerpo')
def external(p):
    q = (np.array([p.x, p.z, -p.y]) - rlo) / RVOX
    if (q < 0).any() or (q >= rdims).any(): return False
    i, j, k = q.astype(int); return bits[i + rdims[0] * (j + rdims[1] * k)]
hit = {o.name: n for o in bpy.data.objects if o.type == 'MESH' and o is not obj and o.name != 'Skin_Body'
       for n in [sum(external(Vector(p)) for p in world(o))] if n}
log('  piezas con vértices en la región:', dict(sorted(hit.items(), key=lambda x: -x[1])))
left = {}
box_lo, box_hi = GV.min(0) - 0.005, GV.max(0) + 0.005       # solo cerca de esta piel (es una malla abierta)
for o in bpy.data.objects:
    if o.type != 'MESH' or o is obj or o.name == 'Skin_Body' or o.get('system') in (None, 'skeletal'): continue
    for p in world(o):
        if (p < box_lo).any() or (p > box_hi).any(): continue
        p = Vector(p)
        if external(p) or not inside_genital_skin(p): continue
        loc, nrm, _, _ = SKIN_BVH.find_nearest(p)
        out = (p - loc).dot(nrm)
        if out > 0.0002: left[o.name] = max(left.get(o.name, 0), out)
# Lo que seguiría a la vista con la opción desactivada: fuera de la piel del cuerpo y fuera de la región.
still = {}
for o in bpy.data.objects:
    if o.type != 'MESH' or o is obj or o.name == 'Skin_Body' or o.get('system') in (None, 'skeletal'): continue
    for p in world(o):
        if (p < box_lo).any() or (p > box_hi).any(): continue
        p = Vector(p)
        if external(p): continue
        loc, nrm, _, _ = SKIN_BVH.find_nearest(p)
        out = (p - loc).dot(nrm)
        if out > 0.0003 and depth(p) > 0.0003: still[o.name] = max(still.get(o.name, 0), out)
log('  fuera del cuerpo y fuera de la región (se verían sin genitales):', {k: f'{v * 1000:.1f} mm' for k, v in sorted(still.items(), key=lambda x: -x[1])})
log('  tapado por la piel genital pero fuera de la región:', {k: f'{v * 1000:.1f} mm' for k, v in sorted(left.items(), key=lambda x: -x[1])})

# ── Tono por vértice ───────────────────────────────────────────────────────
GV = np.array([v.co[:] for v in me.vertices])
sp_v, s_v = penis_sd(GV); ss_v = scrotum_full(GV)
on_scrotum = sm((sp_v - ss_v) / 0.003)                      # 1 en el escroto, 0 en el pene
gl_v = glans_sd(s_v, (GV - pc) @ EW, (GV - pc) @ EH)
glans_w = (1 - sm((np.abs(gl_v) - 0.0004) / 0.0008)) * sm((s_v - G0 + 0.001) / 0.0015)   # 1 sobre el glande
is_glans = glans_w > 0.5
SHAFT = np.array([0.88, 0.74, 0.70]); SCRO = np.array([0.80, 0.63, 0.60]); GLANS = np.array([0.93, 0.6, 0.66])
col = SHAFT + on_scrotum[:, None] * (SCRO - SHAFT)
# Surcos de las arrugas más oscuros, con la misma función que les da relieve (la curvatura de la malla, irregular en
# una red de vóxeles, dibujaba bandas oscuras en el glande).
fold = sm(-ridges(GV) / 0.8) * (rugae_amp(GV) / 0.0002) * on_scrotum
col *= 1 - fold[:, None] * np.array([0.09, 0.13, 0.13])
raphe = np.exp(-(GV[:, 0] / 0.0015) ** 2) * (1 - sm((GV[:, 2] - Z_ROOT) / 0.01)) * on_scrotum
col *= 1 - raphe[:, None] * np.array([0.18, 0.24, 0.24])
col = col * (1 - glans_w[:, None]) + GLANS * glans_w[:, None]
# Junto a la unión con el cuerpo, el tono de la piel del cuerpo en ese punto (sin costura de color).
tone = skin.data.color_attributes.get('Tono')
if tone:
    BT = np.empty(len(tone.data) * 4); tone.data.foreach_get('color', BT); BT = BT.reshape(-1, 4)[:, :3]
    kd = kdtree.KDTree(len(SW))
    for i, p in enumerate(SW): kd.insert(p, i)
    kd.balance()
    near = np.array([kd.find(p)[1] for p in GV])
    # Solo en la unión de verdad (raíz del escroto y base del pene): donde el escroto solo se acerca al muslo, el tono
    # del cuerpo lo dejaba pálido.
    bdv = np.abs(body_sd(GV))
    joint = np.maximum(sm((GV[:, 2] - (Z_ROOT - 0.012)) / 0.012), 1 - sm((s_v - s_exit) / 0.015))
    w = (1 - joint * (1 - sm(bdv / 0.009)))[:, None] * (~is_glans[:, None])
    col = np.where(is_glans[:, None], col, BT[near] * (1 - w) + col * w)
attr = me.color_attributes.new('Tono', 'FLOAT_COLOR', 'POINT')
attr.data.foreach_set('color', np.c_[col, np.ones(len(col))].ravel())
me.color_attributes.active_color = attr

# ── Centro, material y propiedades; guardado ────────────────────────────────
center = (GV.min(0) + GV.max(0)) / 2
me.transform(Matrix.Translation(-Vector(center))); obj.location = Vector(center)
me.materials.clear(); me.materials.append(skin.data.materials[0])
for k, v in {'anato3d_id': 'integument_skin_genitals', 'system': 'integumentary', 'subsystem': 'skin', 'tissue': 'skin',
             'name_en': 'Skin of penis and scrotum', 'name_la': '', 'name_es': 'Piel del pene y del escroto',
             'source': 'Anato3D: generated around the Z-Anatomy (BodyParts3D, DBCLS) genital organs, CC BY-SA 4.0'}.items():
    obj[k] = v
col = bpy.data.collections.new('Genital_Skin'); col.objects.link(obj)   # «Integumentary_System» ya existe en la Fase 2
out = os.path.join(ROOT, 'build', 'male_integumentary.blend')
bpy.data.libraries.write(out, {col}, fake_user=True)
json.dump({'groups': {}}, open(os.path.join(WEB, 'male-integumentary.json'), 'w'))
log('guardado', out)
