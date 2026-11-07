"""Región del cuerpo de cada vaso (arterias y venas), para la ficha de la web.

Las colecciones de Z-Anatomy no sirven como región: todas las arterias de la cabeza, el cuello y el tronco cuelgan de
«Aorta», y las de los miembros de «Miembro superior/inferior». Este script mira dónde está cada vaso de verdad. Toma hasta
400 vértices de cada vaso y clasifica cada uno:
  - encéfalo: a menos de 2 mm del encéfalo, o a menos de 6 mm y dentro de la cavidad del cráneo (los rayos lanzados
    desde el punto chocan con los huesos del cráneo en al menos 11 de 14 direcciones, midiendo desde fuera del hueso si el punto quedó dentro de él);
    más lejos pero rodeado de cráneo (13 de 14), «cavidad craneal» (senos de la duramadre, arterias meníngeas). Las
    arterias por fuera del cráneo, como las temporales profundas, quedan fuera;
  - corazón: a menos de 4 mm de él, solo en los vasos propios del corazón (en la aorta, la cava o los vasos pulmonares
    cuenta como tórax);
  - si no, por el hueso más cercano: cráneo → cabeza; vértebras cervicales e hioides → cuello; clavícula y escápula →
    hombro; húmero → brazo; radio y ulna → antebrazo; carpo y dedos → mano; costillas, esternón y vértebras torácicas →
    tórax; lumbares → abdomen; coxal, sacro y cóccix → pelvis; fémur → muslo; tibia y fíbula → pierna; tarso y dedos → pie;
  - y lo corrige con referencias del esqueleto: el 12 % de los huesos largos junto al codo o a la rodilla; lo que queda
    por debajo del hioides es cuello; por encima de la abertura superior del tórax, cuello; entre la pared del tórax y el
    húmero, axila; por debajo del diafragma (algún rayo hacia arriba lo encuentra), abdomen; delante de la pelvis, por
    encima del ligamento inguinal, abdomen y, por debajo, muslo; en la cara externa del coxal, región glútea; bajo el arco
    del pubis, periné o, por delante, genitales externos.
La región del vaso son las que reúnen al menos el 20 % de sus vértices (hasta tres), de la cabeza a los pies. Lo que no
encaja con la anatomía tras revisar la lista se corrige en OVERRIDES.

Uso (desde la raíz del proyecto; necesita build/<modelo>_{arterial,venous,nervous,muscular}.blend):
  /Applications/Blender.app/Contents/MacOS/Blender -b --factory-startup --python tools/vessel_regions.py -- male
Escribe build/vessel_regions_<modelo>.json y web/src/data/regiones-vasos.js (la tabla de la app: la del hombre más los vasos
que solo tiene la mujer).
"""
import bpy, os, re, sys, json, collections, math
import numpy as np
from mathutils import Vector, bvhtree

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
MODEL = sys.argv[sys.argv.index('--') + 1] if '--' in sys.argv else 'male'
FASE2 = os.path.join(ROOT, f'Anato3D_{"Male" if MODEL == "male" else "Female"}_30_Fase2.blend')
ORDER = ['encefalo', 'craneo', 'cabeza', 'cuello', 'hombro', 'axila', 'brazo', 'codo', 'antebrazo', 'mano', 'torax', 'corazon',
         'abdomen', 'pelvis', 'gluteo', 'perine', 'genitales', 'muslo', 'rodilla', 'pierna', 'pie']
LABEL = {'encefalo': 'encéfalo', 'craneo': 'cavidad craneal', 'cabeza': 'cabeza', 'cuello': 'cuello', 'hombro': 'hombro', 'axila': 'axila', 'brazo': 'brazo',
         'codo': 'codo', 'antebrazo': 'antebrazo', 'mano': 'mano', 'torax': 'tórax', 'corazon': 'corazón', 'abdomen': 'abdomen',
         'pelvis': 'pelvis', 'gluteo': 'región glútea', 'perine': 'periné', 'genitales': 'genitales externos', 'muslo': 'muslo',
         'rodilla': 'rodilla', 'pierna': 'pierna', 'pie': 'pie'}
# Vasos propios del corazón: en ellos, la cercanía al corazón sí cuenta como «corazón».
CARDIAC = re.compile(r'coronar|cardiac|interventricular|Circumflex_artery_of_heart|Coronary_sinus|ventricle|atrium|leaflet|papillary|Right_inferolateral', re.I)
# Corregidos a mano tras revisar la lista (2026-11-01), con el motivo.
OVERRIDES = {
    'Great_saphenous_vein': ['pie', 'pierna', 'muslo'],          # sube del pie a la ingle; la mayor parte del muslo queda <20 %
    'Hepatic_portal_vein': ['abdomen'],                         # bajo el diafragma; el rayo pasa por el hiato de la cava
    'Hepatic_veins': ['abdomen'],
    'Inferior_vena_cava_thoracic_part': ['torax'],              # tramo corto entre el diafragma y el atrio derecho
    'Inferior_phrenic_artery': ['abdomen'],                     # cara inferior del diafragma
    'Superior_phrenic_arteries': ['torax'],                     # cara superior del diafragma (el ajuste los hunde)
    'Right_superior_phrenic_vein': ['torax'],
    'Musculophrenic_artery': ['torax', 'abdomen'],              # borde costal: diafragma, espacios intercostales y pared
    'Musculophrenic_veins': ['torax', 'abdomen'],
    'Superior_epigastric_artery': ['torax', 'abdomen'],         # baja tras los cartílagos costales a la vaina del recto
    'Superior_epigastric_veins': ['torax', 'abdomen'],
    'Left_testicular_artery': ['abdomen', 'genitales'],         # del abdomen al escroto por el conducto inguinal
    'Right_testicular_artery': ['abdomen', 'genitales'],
    'Left_testicular_vein': ['abdomen', 'genitales'],
    'Right_testicular_vein': ['abdomen', 'genitales'],
    # Raíz del cuello: nacen de la subclavia o la acompañan por encima de la primera costilla.
    'Thyrocervical_trunk': ['cuello'], 'Costocervical_trunk': ['cuello'], 'Inferior_thyroid_artery': ['cuello'],
    'Deep_cervical_artery': ['cuello'], 'Transverse_cervical_artery': ['cuello', 'hombro'], 'Anterior_jugular_vein': ['cuello'],
    'Left_subclavian_artery': ['torax', 'cuello'],              # nace en el mediastino y cruza la raíz del cuello
    'Right_subclavian_artery': ['cuello'], 'Left_subclavian_vein': ['cuello'], 'Right_subclavian_vein': ['cuello'],
    'Common_facial_vein': ['cabeza', 'cuello'],
    # Hombro: la supraescapular cruza el triángulo posterior del cuello hasta la escápula; la circunfleja de la escápula pasa
    # de la axila a la fosa infraespinosa; la axilar está en la axila (la clavícula y el húmero cercanos la sacaban de ella).
    'Suprascapular_artery': ['cuello', 'hombro'], 'Suprascapular_vein': ['cuello', 'hombro'],
    'Circumflex_scapular_artery': ['axila', 'hombro'], 'Circumflex_scapular_vein': ['axila', 'hombro'], 'Axillary_artery': ['axila'],
    # Pared del tórax: los espacios intercostales bajos quedan por fuera del diafragma, pero son tórax.
    'Posterior_intercostal_arteries': ['torax'], 'Left_superior_intercostal_vein': ['torax'], 'Right_superior_intercostal_vein': ['torax'],
    # Por fuera del cráneo: el hueso fino de la sien y la mastoides confunden la prueba de los rayos.
    'Anterior_deep_temporal_artery': ['cabeza'], 'Posterior_deep_temporal_artery': ['cabeza'],
    'Posterior_auricular_vein': ['cabeza'], 'Retromandibular_vein': ['cabeza'],
    'Branch_to_angular_gyrus': ['encefalo'],
    'Middle_meningeal_artery': ['craneo', 'cabeza'],            # entra por el agujero espinoso; corre por la duramadre
    # Pene y vasos pudendos externos (del muslo a los genitales).
    'Deep_artery_of_penis': ['genitales'], 'Dorsal_artery_of_penis': ['genitales'], 'Deep_dorsal_vein_of_penis': ['genitales'],
    'Superficial_dorsal_veins_of_penis': ['genitales'], 'External_pudendal_veins': ['muslo', 'genitales'],
    'Superficial_external_pudendal_artery': ['muslo', 'genitales'], 'Deep_external_pudendal_artery': ['muslo', 'genitales'],
    # Ovario y útero (solo en la mujer, tools/female_vessels.py): las ováricas bajan del abdomen a la pelvis; el resto, pelvis.
    'Ovarian_artery': ['abdomen', 'pelvis'], 'Left_ovarian_vein': ['abdomen', 'pelvis'], 'Right_ovarian_vein': ['abdomen', 'pelvis'],
    'Uterine_artery': ['pelvis'], 'Vaginal_branches_of_uterine_artery': ['pelvis'], 'Tubal_branch_of_uterine_artery': ['pelvis'],
    'Ovarian_branch_of_uterine_artery': ['pelvis'], 'Uterine_veins': ['pelvis'], 'Uterine_venous_plexus': ['pelvis'],
}
# Senos venosos de la duramadre y plexo basilar: están en la cavidad craneal, no en el encéfalo.
SINUS = re.compile(r'(?<!Coronary)_sinus$|Basilar_venous_plexus')

def bone_class(name):
    n = re.sub(r'\.\d{3}$', '', name)
    if re.match(r'Vertebra_C|Hyoid', n): return 'cuello'
    if re.match(r'Vertebra_T|Rib_|Costal_Cartilage|Sternum', n): return 'torax'
    if re.match(r'Vertebra_L', n): return 'abdomen'
    if re.match(r'Sacrum|Coccyx|Hip_Bone', n): return 'pelvis'
    if re.match(r'Clavicle|Scapula', n): return 'hombro'
    if re.match(r'Humerus', n): return 'brazo'
    if re.match(r'Radius|Ulna', n): return 'antebrazo'
    if re.match(r'Scaphoid|Lunate|Triquetrum|Pisiform|Trapezium|Trapezoid|Capitate|Hamate|Metacarpal|.*Phalanx_Hand', n): return 'mano'
    if re.match(r'Femur', n): return 'muslo'
    if re.match(r'Patella', n): return 'rodilla'
    if re.match(r'Tibia|Fibula', n): return 'pierna'
    if re.match(r'Calcaneus|Talus|Navicular|Cuboid|.*Cuneiform|Metatarsal|.*Phalanx_Foot|Sesamoid_Bones_Foot', n): return 'pie'
    return 'cabeza'                                          # huesos del cráneo y de la cara, dientes y huesecillos

def load(path, pred=lambda o: True):
    with bpy.data.libraries.load(path) as (src, dst):
        dst.objects = list(src.objects)
    return [o for o in dst.objects if o is not None and o.type == 'MESH' and pred(o)]

def verts(o):
    m = np.array(o.matrix_basis)                            # no están en la escena: matrix_world sin calcular
    co = np.empty(len(o.data.vertices) * 3); o.data.vertices.foreach_get('co', co)
    return co.reshape(-1, 3) @ m[:3, :3].T + m[:3, 3]

def bvh(objs):
    V, F, off = [], [], 0
    for o in objs:
        v = verts(o); V.append(v)
        for p in o.data.polygons: F.append([i + off for i in p.vertices])
        off += len(v)
    return bvhtree.BVHTree.FromPolygons([tuple(x) for x in np.vstack(V)], F)

bones = load(FASE2, lambda o: o.get('tissue') in ('bone', 'tooth', 'cartilage'))
BV = {o.name: verts(o) for o in bones}
B = {o.name: (bvh([o]), bone_class(o.name)) for o in bones}
def pts(pattern): return np.vstack([v for n, v in BV.items() if re.match(pattern, n)])

# Huesos largos de los miembros: eje principal y extremo proximal (el más alto), para el codo y la rodilla.
AXIS = {}
for n, v in BV.items():
    if re.match(r'(Humerus|Radius|Ulna|Femur|Tibia|Fibula)', n):
        c = v.mean(0); u = np.linalg.svd(v - c)[2][0]
        t = (v - c) @ u; a, b = c + u * t.min(), c + u * t.max()
        AXIS[n] = (a, b) if a[2] > b[2] else (b, a)
# Referencias del esqueleto (Z arriba, delante = −Y).
Z_HYOID_TOP = pts('Hyoid')[:, 2].max()
t1, man = pts('Vertebra_T1$'), pts('Sternum_Manubrium')
P_T1 = np.array([0, t1[:, 1].min(), t1[:, 2].max()])        # borde anterosuperior del cuerpo de T1
P_JUG = np.array([0, man[:, 1].min(), man[:, 2].max()])     # escotadura yugular
def above_aperture(p):                                      # plano de la abertura superior del tórax (de T1 a la escotadura)
    t = (p[1] - P_JUG[1]) / (P_T1[1] - P_JUG[1] or 1e-6)
    return p[2] > P_JUG[2] + t * (P_T1[2] - P_JUG[2])
X_RIB1 = np.abs(pts('Rib_1_')[:, 0]).max()
ribs = pts('Rib_')
ZB = np.linspace(ribs[:, 2].min(), ribs[:, 2].max(), 40)
XCAGE = [np.abs(ribs[(ribs[:, 2] > z - 0.02) & (ribs[:, 2] < z + 0.02), 0]).max(initial=0) for z in ZB]
def x_cage(z): return float(np.interp(z, ZB, XCAGE))
hum = pts('Humerus'); hum_up = hum[hum[:, 2] > np.median(hum[:, 2])]
X_HUM_MED = np.abs(hum_up[:, 0]).min()
scap = pts('Scapula'); Z_AX_LOW, Z_AX_HIGH, Y_SCAP = scap[:, 2].min(), pts('Clavicle')[:, 2].mean(), scap[:, 1].mean()
xi = pts('Sternum_Xiphoid'); Z_XIPHOID, Y_XIPHOID = xi[:, 2].min(), xi[:, 1].mean()
hip = pts('Hip_Bone'); Y_HIP = hip[:, 1].mean()
upper = hip[hip[:, 2] > np.median(hip[:, 2])]
asis = upper[np.argmin(upper[:, 1])]                        # espina ilíaca anterosuperior: lo más anterior de la mitad alta
mid = hip[np.abs(hip[:, 0]) < 0.035]
Z_PUBIS_LOW, Y_PUBIS_FRONT = mid[:, 2].min(), mid[:, 1].min()
tub = mid[np.argmin(mid[:, 1])]                             # tubérculo / cresta del pubis
def below_inguinal(p):
    xa, za, xp, zp = abs(asis[0]), asis[2], abs(tub[0]), tub[2]
    t = np.clip((abs(p[0]) - xp) / (xa - xp), 0, 1)
    return p[2] < zp + t * (za - zp)

brain = bvh(load(os.path.join(ROOT, f'build/{MODEL}_nervous.blend'), lambda o: o.get('tissue') in ('cortex', 'nucleus', 'white_matter', 'cerebellum', 'brainstem')))
vessels = load(os.path.join(ROOT, f'build/{MODEL}_arterial.blend')) + load(os.path.join(ROOT, f'build/{MODEL}_venous.blend'))
heart = bvh([o for o in vessels if o.get('tissue') in ('heart', 'valve')])
diaphragm = bvh(load(os.path.join(ROOT, f'build/{MODEL}_muscular.blend'), lambda o: o.name.startswith('Diaphragm')))
skull = bvh([o for o in bones if re.match(r'(Frontal|Parietal|Occipital|Temporal|Sphenoid|Ethmoid)_?Bone', o.name)])
DIRS = [Vector(v).normalized() for v in [(1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1)] +
        [(a, b, c) for a in (1, -1) for b in (1, -1) for c in (1, -1)]]
def skull_hits(q):
    # Cuántos de los 14 rayos chocan con el cráneo. El ajuste deja algunos vasos metidos en el hueso, y desde dentro de él
    # los rayos chocan en todas direcciones: entonces se mide desde la superficie más cercana, 2 mm por fuera del hueso
    # (en la tabla interna eso es la cavidad; en la externa, el cuero cabelludo).
    loc, nrm, _, _ = skull.find_nearest(q)
    if loc is not None and (q - loc).dot(nrm) < 0: q = loc + nrm * 0.002
    return sum(skull.ray_cast(q, r, 0.3)[0] is not None for r in DIRS)
RAYS = [Vector((0, 0, 1))] + [Vector((math.sin(0.3) * math.cos(a), math.sin(0.3) * math.sin(a), math.cos(0.3))) for a in (0, 1.57, 3.14, 4.71)]

def classify(p):
    q = Vector(p)
    best = None
    for name, (tree, cls) in B.items():
        loc, nrm, _, d = tree.find_nearest(q)
        if loc is not None and (best is None or d < best[0]): best = (d, name, cls, nrm, loc)
    d, name, cls, nrm, best_loc = best
    db = brain.find_nearest(q)[3]
    if db < 0.03:
        h = skull_hits(q)
        # Pegado al encéfalo (2 mm) basta; algo más lejos, además rodeado de cráneo. El agujero magno y la órbita dejan
        # escapar rayos: por eso el tronco del encéfalo se reconoce por la cercanía y la órbita no cuenta como cavidad.
        if h and (db < 0.002 or (db < 0.006 and h >= 11)): return 'encefalo'
        if h >= 13: return 'craneo'
    if heart.find_nearest(q)[3] < 0.004: return 'corazon'
    if name in AXIS:                                        # codo y rodilla: el 12 % del hueso junto a la articulación
        top, bot = AXIS[name]; L = np.linalg.norm(bot - top)
        t = np.dot(p - top, (bot - top) / L) / L
        if name.startswith('Humerus') and t > 0.88: cls = 'codo'
        if name.startswith(('Radius', 'Ulna')) and t < 0.12: cls = 'codo'
        if name.startswith('Femur') and t > 0.9: cls = 'rodilla'
        if name.startswith(('Tibia', 'Fibula')) and t < 0.1: cls = 'rodilla'
    if cls == 'cabeza' and p[2] < Z_HYOID_TOP:
        # Bajo el hioides es cuello, salvo lo que está en la mandíbula o encima de ella (labios, mentón, conducto alveolar).
        if not name.startswith(('Mandible', 'Tooth')) or (nrm.z < -0.5 and (q - best_loc).dot(nrm) > 0): return 'cuello'
    if Z_AX_LOW < p[2] < Z_AX_HIGH and x_cage(p[2]) - 0.005 < abs(p[0]) < X_HUM_MED and (
            cls in ('torax', 'brazo') or (cls == 'hombro' and p[1] < Y_SCAP)):
        return 'axila'
    if cls in ('torax', 'hombro') and abs(p[0]) < X_RIB1:
        if above_aperture(p): return 'cuello'
        if cls == 'hombro': cls = 'torax'
    if cls in ('torax', 'abdomen'):
        if any(diaphragm.ray_cast(q, r, 0.4)[0] is not None for r in RAYS): return 'abdomen'
        if cls == 'torax' and p[2] < Z_XIPHOID and abs(p[0]) < 0.08 and p[1] < Y_XIPHOID + 0.03: return 'abdomen'
    if cls == 'pelvis' and name.startswith('Hip_Bone'):
        if p[2] < Z_PUBIS_LOW and abs(p[0]) < 0.06: return 'genitales' if p[1] < Y_PUBIS_FRONT else 'perine'
        if nrm.y < -0.5 and p[1] < Y_HIP: return 'muslo' if below_inguinal(p) else 'abdomen'
        if nrm.x * np.sign(p[0]) > 0.35 and p[1] > Y_HIP: return 'gluteo'
    if cls == 'pelvis' and p[2] < Z_PUBIS_LOW and abs(p[0]) < 0.06 and p[1] < Y_PUBIS_FRONT: return 'genitales'
    return cls

key = lambda s: re.sub(r'^_|_$', '', re.sub(r'[^A-Za-z0-9]+', '_', s))
res = collections.defaultdict(collections.Counter)
for o in vessels:
    k = key(o.get('name_en') or o.name)
    v = verts(o)
    for p in v[:: max(1, len(v) // 400)]:
        c = classify(p)
        if c == 'corazon' and not (o.get('tissue') in ('heart', 'valve') or CARDIAC.search(k)): c = 'torax'
        res[k][c] += 1

def regions(c):
    tot = sum(c.values())
    return ([r for r in ORDER if c[r] / tot >= 0.2] or [c.most_common(1)[0][0]])[:3]
def label(rs):
    w = [LABEL[r] for r in rs]
    s = w[0] if len(w) == 1 else ', '.join(w[:-1]) + ' y ' + w[-1]
    return s[0].upper() + s[1:]

out = {k: regions(c) for k, c in sorted(res.items())}
for k in out:
    if SINUS.search(k): out[k] = ['craneo']
for k, v in OVERRIDES.items():
    if k in out: out[k] = v
json.dump({'regiones': out, 'detalle': {k: dict(c) for k, c in res.items()}}, open(os.path.join(ROOT, f'build/vessel_regions_{MODEL}.json'), 'w'), ensure_ascii=False, indent=0)
# Tabla de la app: la del modelo masculino y, del femenino, los vasos que el masculino no tiene (ováricos y uterinos, desde el
# 2026-11-07). Se escribe con cualquiera de los dos modelos, con lo que haya en build/.
table = {}
for m in ('male', 'female'):
    f = os.path.join(ROOT, f'build/vessel_regions_{m}.json')
    if os.path.exists(f):
        for k, v in json.load(open(f))['regiones'].items(): table.setdefault(k, v)
if table:
    lines = ['// Región del cuerpo de cada vaso (por su nombre inglés en Z-Anatomy). Generado por tools/vessel_regions.py:',
             '// las colecciones de Z-Anatomy («Aorta», «Miembro superior»…) no dicen dónde está cada vaso. No editar a mano.',
             'export const REGIONES_VASOS = {']
    lines += [f"  {k}: '{label(v)}'," for k, v in sorted(table.items())]
    lines.append('};')
    open(os.path.join(ROOT, 'web/src/data/regiones-vasos.js'), 'w').write('\n'.join(lines) + '\n')
print('[regiones]', len(out), 'vasos;', collections.Counter(label(v) for v in out.values()).most_common(15))
