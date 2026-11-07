"""Auditoría de los modelos del cuerpo (masculino o femenino): busca errores medibles en todos los sistemas generados.

Uso (desde la raíz del proyecto):
  /Applications/Blender.app/Contents/MacOS/Blender -b --disable-autoexec Anato3D_Male_30_Fase2.blend \
    --python tools/audit_models.py [-- --systems urogenital,endocrine]
  Modelo femenino: A3D_MODEL=female y Anato3D_Female_30_Fase2.blend.

Qué mide, por objeto:
  - piel: vértices que salen de la piel (confirmado por paridad, como en anato3d_fit) y cuánto salen;
  - hueso: en las vísceras, proporción de vértices dentro de algún hueso;
  - malla: caras de área nula, mallas vacías y mallas cerradas con las caras invertidas (volumen negativo);
  - nombres: sin nombre en español o con restos de latín;
  - choques entre órganos: vértices de un órgano dentro de otro (solo mallas cerradas de vísceras), con su profundidad;
    separa los choques (1 mm o más) de los roces y de las uniones y contenidos reales (NATURAL).
Además compara la posición de algunos órganos con las vértebras (niveles de referencia de los atlas).

Salida: build/audit.json (build/female_audit.json) y un resumen en la consola.
"""
import bpy, bmesh, os, re, sys, json, collections
import numpy as np
from mathutils import Vector, bvhtree

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
MODEL = os.environ.get('A3D_MODEL', 'male')
SYSTEMS = {'muscular': 'Muscular_System', 'connective': 'Connective_System', 'arterial': 'Arterial_System',
           'venous': 'Venous_System', 'nervous': 'Nervous_System', 'respiratory': 'Respiratory_System',
           'digestive': 'Digestive_System', 'urogenital': 'Urogenital_System', 'endocrine': 'Endocrine_System',
           'lymphatic': 'Lymphatic_System'}
VISCERA = {'respiratory', 'digestive', 'urogenital', 'endocrine', 'lymphatic'}
argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
wanted = argv[argv.index('--systems') + 1].split(',') if '--systems' in argv else list(SYSTEMS)

def log(*a): print('[audit]', *a, flush=True)

# ── Cargar los sistemas generados junto a la Fase 2 ─────────────────────────
for s in wanted:
    path = os.path.join(ROOT, 'build', f'{MODEL}_{s}.blend')
    if not os.path.exists(path): log('falta', path); continue
    with bpy.data.libraries.load(path) as (src, dst):
        dst.collections = [SYSTEMS[s]]
    bpy.context.scene.collection.children.link(dst.collections[0])
bpy.context.view_layer.update()

def world_mesh(o):
    bm = bmesh.new(); bm.from_mesh(o.data); bm.transform(o.matrix_world)
    return bm

skin = bpy.data.objects['Skin_Body']
bm = world_mesh(skin); SKIN = bvhtree.BVHTree.FromBMesh(bm); bm.free()
# Piel de los genitales (build_genital_skin.py): malla abierta, se usa la cara más cercana y su normal.
GENITAL = None
gpath = os.path.join(ROOT, 'build', f'{MODEL}_integumentary.blend')
if os.path.exists(gpath):
    with bpy.data.libraries.load(gpath) as (src, dst):
        dst.collections = ['Genital_Skin']
    bpy.context.scene.collection.children.link(dst.collections[0]); bpy.context.view_layer.update()
    g = dst.collections[0].objects[0]; bm = world_mesh(g); GENITAL = bvhtree.BVHTree.FromBMesh(bm); bm.free()
def in_genital_skin(p):
    # Solo cerca de ella (2 cm): lejos, la normal de la cara más cercana de una malla abierta no dice nada, y daba por
    # «dentro» los dientes o los ojos.
    if GENITAL is None: return False
    loc, nrm, _, dist = GENITAL.find_nearest(p, 0.02)
    return loc is not None and (p - loc).dot(nrm) < 0
bones = [o for o in bpy.data.objects if o.type == 'MESH' and o.get('system') == 'skeletal']
# Algunos huesos son mallas abiertas (el sacro, p. ej.): la paridad de rayos no sirve. Se usa la cara más cercana
# y su normal, orientada según el volumen con signo de cada hueso (las piezas _L tienen las normales hacia dentro).
bm = bmesh.new(); FACE_SIGN = []; FACE_CLOSED = []; FACE_BONE = []; BONE_TREE = []
for o in bones:
    b = world_mesh(o); sign = 1.0 if b.calc_volume(signed=True) >= 0 else -1.0
    closed = all(e.is_manifold for e in b.edges)
    BONE_TREE.append(bvhtree.BVHTree.FromBMesh(b))
    me = bpy.data.meshes.new('tmp'); b.to_mesh(me); FACE_SIGN += [sign] * len(b.faces); FACE_CLOSED += [closed] * len(b.faces)
    FACE_BONE += [len(BONE_TREE) - 1] * len(b.faces); b.free()
    bm.from_mesh(me); bpy.data.meshes.remove(me)
BONES = bvhtree.BVHTree.FromBMesh(bm); bm.free()
def bone_depth(p):
    """Profundidad dentro del hueso más cercano (m, positiva = dentro)."""
    loc, nrm, idx, dist = BONES.find_nearest(p)
    if loc is None: return 0.0
    d = -(p - loc).dot(nrm) * FACE_SIGN[idx]
    # Hueso abierto (el occipital): lejos de su superficie la normal no dice si se está dentro.
    if not FACE_CLOSED[idx] and dist >= 0.004: return min(d, 0.0)
    # Lejos de la superficie, la normal de la cara más cercana de un hueso fino (una costilla, el ala ilíaca) puede
    # apuntar al revés: más de 6 mm «dentro» se confirma por paridad en ese hueso (salían venas «a 32 mm» de uno).
    if d > 0.006 and FACE_CLOSED[idx] and not parity_inside(BONE_TREE[FACE_BONE[idx]], p): return -dist
    return d

DIRS = [Vector(d) for d in ((1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1))]
def parity_inside(tree, p, dirs=DIRS, need=None):
    odd = 0
    for d in dirs:
        o, n = p, 0
        while n < 40:
            hit, _, _, _ = tree.ray_cast(o + d * 1e-5, d)
            if hit is None: break
            n += 1; o = hit
        odd += n % 2
    return odd >= (need or (len(dirs) * 2 + 2) // 3)

def verts_world(o):
    m = np.array(o.matrix_world)
    co = np.empty(len(o.data.vertices) * 3); o.data.vertices.foreach_get('co', co)
    return co.reshape(-1, 3) @ m[:3, :3].T + m[:3, 3]

# ── Por objeto ──────────────────────────────────────────────────────────────
report = {'objects': [], 'clashes': [], 'levels': {}, 'duplicates': []}
objs = [o for o in bpy.data.objects if o.type == 'MESH' and (o.get('system') in wanted or o.get('system') == 'skeletal')]
closed = {}
for i, o in enumerate(objs):
    sysname = o.get('system')
    V = verts_world(o)
    r = {'name': o.name, 'system': sysname, 'tissue': o.get('tissue'), 'verts': len(V), 'faces': len(o.data.polygons)}
    if not len(V):
        r['empty'] = True; report['objects'].append(r); continue
    # Piel
    out, worst = 0, 0.0
    for v in V:
        p = Vector(v)
        loc, nrm, _, _ = SKIN.find_nearest(p)
        if loc is None: continue
        depth = (p - loc).dot(nrm)
        if depth > 0.0005 and not parity_inside(SKIN, p) and not in_genital_skin(p):
            out += 1; worst = max(worst, depth)
    r['out_skin'] = out; r['out_skin_mm'] = round(worst * 1000, 1)
    # Visible desde fuera: algún rayo escapa sin tocar la piel ni la genital (si no, está en la cavidad de la boca o
    # de los ojos, o dentro del pene o del escroto aunque la cara más cercana de esa malla abierta diga lo contrario).
    def escapes(p, d):
        return SKIN.ray_cast(p + d * 1e-5, d)[0] is None and (GENITAL is None or GENITAL.ray_cast(p + d * 1e-5, d)[0] is None)
    if out:
        vis = 0
        for v in V[::max(1, len(V) // 200)]:
            p = Vector(v)
            if not parity_inside(SKIN, p) and not in_genital_skin(p) and any(escapes(p, d) for d in DIRS): vis += 1
        r['visible_out'] = vis
    # Dentro de hueso (muestreado)
    if sysname != 'skeletal':
        step = max(1, len(V) // (400 if sysname in VISCERA else 120))
        S = V[::step]
        depth = [bone_depth(Vector(v)) for v in S]
        r['in_bone'] = round(sum(d > 0.001 for d in depth) / len(S), 3)   # más de 1 mm dentro
        r['in_bone_mm'] = round(max(depth) * 1000, 1)
    # Malla
    bm = bmesh.new(); bm.from_mesh(o.data)
    r['zero_area'] = sum(f.calc_area() < 1e-12 for f in bm.faces)
    is_closed = all(e.is_manifold for e in bm.edges) and len(bm.faces) > 0
    if is_closed:
        r['volume_cm3'] = round(bm.calc_volume(signed=True) * 1e6, 2)
        if r['volume_cm3'] < 0: r['inverted'] = True
    bm.free()
    if sysname in VISCERA and is_closed:
        bm = world_mesh(o); closed[o.name] = (bvhtree.BVHTree.FromBMesh(bm), V.min(0), V.max(0), V); bm.free()
    # Nombres
    if sysname != 'skeletal':
        es = o.get('name_es', '')
        if not es: r['no_es'] = True
        elif re.search(r'\b(Nodi|Musculus|Nervus|Ramus|Arteriae|Venae|Septum)\b|ss|ph|th|[a-z]-[a-z]|\b(segm|sup)\.', es): r['latin_es'] = es
    dims = V.max(0) - V.min(0)
    r['size_cm'] = [round(float(x) * 100, 1) for x in dims]
    r['center'] = [round(float(x), 4) for x in (V.min(0) + V.max(0)) / 2]
    report['objects'].append(r)
    if i % 200 == 0: log(f'{i}/{len(objs)} {o.name}')

# ── Choques entre órganos cerrados ──────────────────────────────────────────
# En los dos sentidos (antes solo «a en b» con a antes que b en la lista) y con la profundidad: el más hondo de los
# vértices de a que están dentro de b, hasta la superficie de b.
# Revisión a mano del 2026-11-06 (docs/hitos/07-solapes-y-modelo-femenino.md): casi todos los choques eran roces de
# menos de 1 mm (dos piezas que se tocan) o uniones y contenidos reales. Estos últimos no son errores:
NATURAL = {
    ('Accessory_pancreatic_duct', 'Pancreas'): 'el conducto va dentro del páncreas',
    ('Intraglandular_parotid_nodes_L', 'Parotid_gland_L'): 'nodos dentro de la glándula, por definición',
    ('Intraglandular_parotid_nodes_R', 'Parotid_gland_R'): 'nodos dentro de la glándula, por definición',
    ('Appendicular_nodes', 'Meso_appendix'): 'los nodos del apéndice están en su meso',
    ('Meso_appendix', 'Vermiform_appendix'): 'el meso se une al apéndice',
    ('Mesocolon', 'Transverse_colon'): 'el mesocolon se une al colon',
    ('Mesocolic_taenia', 'Transverse_colon'): 'la tenia es parte de la pared del colon',
    ('Left_lobe_of_thymus', 'Right_lobe_of_thymus'): 'los dos lóbulos están unidos en la línea media',
    ('Prostate', 'Urinary_bladder'): 'el cuello de la vejiga descansa en la base de la próstata',
    ('Seminal_gland_L', 'Urinary_bladder'): 'apoyada en la cara posterior de la vejiga',
    ('Seminal_gland_R', 'Urinary_bladder'): 'apoyada en la cara posterior de la vejiga',
    ('Oropharynx', 'Soft_palate'): 'mucosa continua',
    ('Major_alar_cartilage_R', 'Nasal_septal_cartilage'): 'la rama medial se apoya en el tabique',
    ('Major_alar_cartilage_L', 'Nasal_septal_cartilage'): 'la rama medial se apoya en el tabique',
    ('Pancreatic_duct', 'Pancreas'): 'el conducto va dentro del páncreas',
    ('Seminal_gland_L', 'Prostate'): 'su extremo y su conducto entran en la base de la próstata',
    ('Seminal_gland_R', 'Prostate'): 'su extremo y su conducto entran en la base de la próstata',
    ('Testis_L', 'Epididymis_L'): 'el epidídimo va pegado al borde posterior del testículo',
    ('Testis_R', 'Epididymis_R'): 'el epidídimo va pegado al borde posterior del testículo',
    ('Uvula_of_palate', 'Soft_palate'): 'la úvula cuelga del paladar blando',
    ('Corpus_spongiosum_of_penis', 'Corpus_cavernosum_of_penis'): 'el cuerpo esponjoso va en el surco de los cavernosos',
    ('Suspensory_ligaments_of_breast_L', 'Fat_of_breast_L'): 'los ligamentos atraviesan la grasa de la piel a la glándula',
    ('Suspensory_ligaments_of_breast_R', 'Fat_of_breast_R'): 'los ligamentos atraviesan la grasa de la piel a la glándula',
}
# Heredados de Z-Anatomy y aceptados (mismo solape en la fuente; dentro de la boca, no se ve desde fuera). Separarlos
# deformaba la boca: la úvula salía del paladar blando y las glándulas salivales de la encía (revisión del 2026-11-01).
ACCEPTED = {
    ('Sublingual_gland_L', 'Gingiva'): 'la «encía» de Z-Anatomy llega al suelo de la boca, bajo cuya mucosa está la glándula',
    ('Sublingual_gland_R', 'Gingiva'): 'la «encía» de Z-Anatomy llega al suelo de la boca, bajo cuya mucosa está la glándula',
    ('Submandibular_gland_L', 'Gingiva'): 'su parte profunda llega al suelo de la boca, que la «encía» de Z-Anatomy incluye',
    ('Submandibular_gland_R', 'Gingiva'): 'su parte profunda llega al suelo de la boca, que la «encía» de Z-Anatomy incluye',
    ('Oropharynx', 'Gingiva'): 'mucosa continua al fondo de la boca',
}
CONTACT_MM = 1.0                     # menos que esto: dos superficies que se tocan (no se ve)
def natural(a, b):
    return NATURAL.get((a, b)) or NATURAL.get((b, a)) or (
        'segmentos vecinos del hígado' if 'segment_of_liver' in a and 'segment_of_liver' in b else None) or (
        'glándula en la superficie de la tiroides' if 'parathyroid' in a.lower() and b == 'Thyroid_gland' else None) or (
        'el omento menor se inserta en el hígado' if 'Lesser_omentum' in (a, b) and ('liver' in a + b) else None)
def accepted(a, b):
    return ACCEPTED.get((a, b)) or ACCEPTED.get((b, a))
names = list(closed)
def clash(a, b):
    ta, amin, amax, VA = closed[a]; tb, bmin, bmax, VB = closed[b]
    step = max(1, len(VA) // 300)
    S = [v for v in VA[::step] if (v >= bmin).all() and (v <= bmax).all()]
    inn = [v for v in S if parity_inside(tb, Vector(v), need=5)]
    frac = len(inn) / len(VA[::step])
    if frac <= 0.02: return
    depth = max(tb.find_nearest(Vector(v))[3] for v in inn) * 1000
    why = natural(a, b) or accepted(a, b)
    kind = 'natural' if natural(a, b) else 'aceptado' if accepted(a, b) else 'contacto' if depth < CONTACT_MM else 'choque'
    report['clashes'].append({'a': a, 'b': b, 'frac_a_in_b': round(frac, 3), 'depth_mm': round(depth, 1), 'kind': kind,
                              **({'why': why} if why else {})})
for i in range(len(names)):
    for j in range(i + 1, len(names)):
        _, amin, amax, _ = closed[names[i]]; _, bmin, bmax, _ = closed[names[j]]
        if (amin > bmax).any() or (bmin > amax).any(): continue
        clash(names[i], names[j]); clash(names[j], names[i])

# ── Representaciones duplicadas: una pieza casi entera dentro de otra del mismo sistema ─────────────────
# (p. ej. el hígado entero y sus segmentos de Couinaud, que no deben verse a la vez). Solo pares cuya caja está
# contenida en la del otro; se prueba con 40 vértices por paridad sobre la malla del contenedor.
dup_trees = {}
def tree_of(o):
    if o.name not in dup_trees:
        bm = world_mesh(o); dup_trees[o.name] = bvhtree.BVHTree.FromBMesh(bm); bm.free()
    return dup_trees[o.name]
gen = [o for o in objs if o.get('system') not in (None, 'skeletal')]
info = {o.name: verts_world(o) for o in gen}
bbox = {k: (V.min(0), V.max(0)) for k, V in info.items() if len(V)}
for a in gen:
    if a.name not in bbox: continue
    amin, amax = bbox[a.name]; va = np.prod(amax - amin)
    for b in gen:
        if b is a or b.name not in bbox or b.get('system') != a.get('system'): continue
        bmin, bmax = bbox[b.name]; vb = np.prod(bmax - bmin)
        if vb > va or vb < va * 0.03: continue
        inter = np.prod(np.clip(np.minimum(amax, bmax) - np.maximum(amin, bmin), 0, None))
        if inter < 0.9 * vb: continue
        S = info[b.name][::max(1, len(info[b.name]) // 40)]
        k = sum(parity_inside(tree_of(a), Vector(v), need=5) for v in S) / len(S)
        if k > 0.6: report.setdefault('nested', []).append({'outer': a.name, 'inner': b.name, 'frac': round(k, 2)})

# ── Niveles vertebrales ─────────────────────────────────────────────────────
vert = {}
for o in bones:
    m = re.match(r'^Vertebra_(C\d|T\d+|L\d)', o.name)
    if m:
        V = verts_world(o); vert[m.group(1)] = float((V[:, 2].min() + V[:, 2].max()) / 2)
order = sorted(vert, key=lambda k: -vert[k])
def level(z):
    """Vértebra cuya altura (centro) está más cerca de z."""
    return min(order, key=lambda k: abs(vert[k] - z)) if order else None
for o in objs:
    if o.get('system') not in VISCERA or o.get('tissue') == 'node': continue
    V = verts_world(o)
    report['levels'][o.name] = {'top': level(V[:, 2].max()), 'bottom': level(V[:, 2].min()),
                                'top_z': round(float(V[:, 2].max()), 3), 'bottom_z': round(float(V[:, 2].min()), 3)}
report['vertebrae_z'] = vert

# ── Duplicados de nombre en distintos sistemas ──────────────────────────────
seen = collections.defaultdict(list)
for o in objs:
    if o.get('system') != 'skeletal': seen[re.sub(r'\.\d+$', '', o.name)].append(o.get('system'))
report['duplicates'] = {k: v for k, v in seen.items() if len(v) > 1}

json.dump(report, open(os.path.join(ROOT, 'build', 'audit.json' if MODEL == 'male' else f'{MODEL}_audit.json'), 'w'), ensure_ascii=False, indent=1)

# ── Resumen ─────────────────────────────────────────────────────────────────
O = report['objects']
def top(key, n=25, f=lambda r: r.get(key, 0)):
    return sorted([r for r in O if f(r)], key=lambda r: -f(r))[:n]
log('== Salen de la piel y se ven desde fuera')
for r in sorted([r for r in O if r.get('visible_out')], key=lambda r: -r['out_skin_mm'])[:60]:
    log(f"  {r['system']:12} {r['name']:45} {r['out_skin']:5}/{r['verts']:<6} hasta {r['out_skin_mm']} mm")
log('== Salen de la piel solo hacia una cavidad (boca, nariz, ojos):', sum(1 for r in O if r.get('out_skin') and not r.get('visible_out')))
log('== Dentro de hueso (> 3 %), por sistema')
for s in wanted:
    rs = [r for r in O if r['system'] == s and 'in_bone' in r]
    if rs: log(f"  {s:12} media {np.mean([r['in_bone'] for r in rs]) * 100:.2f} %, {sum(r['in_bone'] > 0.03 for r in rs)} piezas > 3 %")
for r in top('in_bone', 50, lambda r: r.get('in_bone', 0) if r.get('in_bone', 0) > 0.03 else 0):
    log(f"  {r['system']:12} {r['name']:45} {r['in_bone'] * 100:.0f} % (hasta {r['in_bone_mm']} mm)")
for kind, title in (('choque', f'Choques entre órganos (> 2 % de los vértices, {CONTACT_MM:g} mm o más)'),
                    ('contacto', f'Roces (> 2 %, menos de {CONTACT_MM:g} mm)'), ('natural', 'Uniones y contenidos reales'),
                    ('aceptado', 'Heredados de Z-Anatomy y aceptados')):
    cs = sorted([c for c in report['clashes'] if c['kind'] == kind], key=lambda c: -c['depth_mm'])
    log(f'== {title}: {len(cs)}')
    for c in cs[:40]:
        log(f"  {c['a']} dentro de {c['b']}: {c['frac_a_in_b'] * 100:.0f} %, hasta {c['depth_mm']} mm" + (f" ({c['why']})" if c.get('why') else ''))
log('== Malla: invertidas', [r['name'] for r in O if r.get('inverted')][:40])
log('== Malla: vacías', [r['name'] for r in O if r.get('empty')])
log('== Malla: caras de área nula', [(r['name'], r['zero_area']) for r in O if r.get('zero_area')][:30])
log('== Sin nombre en español', [r['name'] for r in O if r.get('no_es')][:60])
log('== Restos de latín', [(r['name'], r['latin_es']) for r in O if r.get('latin_es')][:40])
log('== Duplicados', report['duplicates'])
log('== Piezas casi enteras dentro de otra del mismo sistema (> 60 %)')
for d in sorted(report.get('nested', []), key=lambda d: d['outer']): log(f"  {d['inner']} dentro de {d['outer']}: {d['frac'] * 100:.0f} %")
log('== Niveles', {k: (v['top'], v['bottom']) for k, v in report['levels'].items()
                   if re.match(r'(Kidney|Suprarenal|Spleen|Thyroid|Urinary_bladder|Liver|Stomach|Pancreas|Testis|Prostate|Left_lobe_of_thymus)', k)})
