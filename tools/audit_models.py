"""Auditoría de los modelos del cuerpo masculino: busca errores medibles en todos los sistemas generados.

Uso (desde la raíz del proyecto):
  /Applications/Blender.app/Contents/MacOS/Blender -b --disable-autoexec Anato3D_Male_30_Fase2.blend \
    --python tools/audit_models.py [-- --systems urogenital,endocrine]

Qué mide, por objeto:
  - piel: vértices que salen de la piel (confirmado por paridad, como en anato3d_fit) y cuánto salen;
  - hueso: en las vísceras, proporción de vértices dentro de algún hueso;
  - malla: caras de área nula, mallas vacías y mallas cerradas con las caras invertidas (volumen negativo);
  - nombres: sin nombre en español o con restos de latín;
  - choques entre órganos: vértices de un órgano dentro de otro (solo mallas cerradas de vísceras).
Además compara la posición de algunos órganos con las vértebras (niveles de referencia de los atlas).

Salida: build/audit.json y un resumen en la consola.
"""
import bpy, bmesh, os, re, sys, json, collections
import numpy as np
from mathutils import Vector, bvhtree

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
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
    path = os.path.join(ROOT, 'build', f'male_{s}.blend')
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
gpath = os.path.join(ROOT, 'build', 'male_integumentary.blend')
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
bm = bmesh.new(); FACE_SIGN = []; FACE_CLOSED = []
for o in bones:
    b = world_mesh(o); sign = 1.0 if b.calc_volume(signed=True) >= 0 else -1.0
    closed = all(e.is_manifold for e in b.edges)
    me = bpy.data.meshes.new('tmp'); b.to_mesh(me); FACE_SIGN += [sign] * len(b.faces); FACE_CLOSED += [closed] * len(b.faces); b.free()
    bm.from_mesh(me); bpy.data.meshes.remove(me)
BONES = bvhtree.BVHTree.FromBMesh(bm); bm.free()
def bone_depth(p):
    """Profundidad dentro del hueso más cercano (m, positiva = dentro)."""
    loc, nrm, idx, dist = BONES.find_nearest(p)
    if loc is None: return 0.0
    d = -(p - loc).dot(nrm) * FACE_SIGN[idx]
    # Hueso abierto (el occipital): lejos de su superficie la normal no dice si se está dentro.
    return d if FACE_CLOSED[idx] or dist < 0.004 else min(d, 0.0)

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
names = list(closed)
for a in range(len(names)):
    ta, amin, amax, VA = closed[names[a]]
    for b in range(a + 1, len(names)):
        tb, bmin, bmax, VB = closed[names[b]]
        if (amin > bmax).any() or (bmin > amax).any(): continue
        step = max(1, len(VA) // 300)
        S = [v for v in VA[::step] if (v >= bmin).all() and (v <= bmax).all()]
        if not S: continue
        k = sum(parity_inside(tb, Vector(v), need=5) for v in S)
        frac = k / len(VA[::step])
        if frac > 0.02: report['clashes'].append({'a': names[a], 'b': names[b], 'frac_a_in_b': round(frac, 3)})

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

json.dump(report, open(os.path.join(ROOT, 'build', 'audit.json'), 'w'), ensure_ascii=False, indent=1)

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
log('== Choques entre órganos (> 2 %)')
for c in sorted(report['clashes'], key=lambda c: -c['frac_a_in_b'])[:40]:
    log(f"  {c['a']} dentro de {c['b']}: {c['frac_a_in_b'] * 100:.0f} %")
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
