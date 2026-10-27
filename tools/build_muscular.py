"""Fase 3: extrae el sistema muscular de Z-Anatomy y lo ajusta al cuerpo de Anato3D (ver anato3d_fit.py).

Uso (desde la raíz del proyecto):
  /Applications/Blender.app/Contents/MacOS/Blender -b --disable-autoexec \
    sources/z-anatomy/extracted/Z-Anatomy/Startup.blend \
    --python tools/build_muscular.py -- [--budget 450000] [--only "deltoid,biceps"]

Salida: build/male_muscular.blend, build/male_muscular.json y web/public/models/male-muscular.json.
"""
import bpy, os, sys, json, collections
from mathutils import Matrix, bvhtree
sys.path.insert(0, os.path.dirname(__file__))
from anato3d_fit import (Fitter, Extractor, Groups, bonus_paths, deepest, es, la, sanitize, source_name,
                         is_structure, principled, save, log, parse_args)

opt = parse_args({'budget': 500000, 'only': None})

FUNCTION_ES = {
    'Abductor': 'Abducción', 'Adductor': 'Aducción', 'Extension': 'Extensión', 'Flexion': 'Flexión',
    'Levator': 'Elevación', 'Depressor': 'Descenso', 'External rotation': 'Rotación externa',
    'Internal rotator': 'Rotación interna', 'Orbicularis/Constrictor': 'Cierre de orificios (esfínter)',
    'Flexion fingers': 'Flexión de los dedos', 'Extensor extremities': 'Extensión de los dedos',
    'Extension hand/foot': 'Extensión de la mano o del pie', 'Flexion hand/foot': 'Flexión de la mano o del pie',
    'Biarticular': 'Músculo biarticular', 'Ingestion': 'Deglución', 'Phonation': 'Fonación',
    'Masticator': 'Masticación', 'Diaphragm': 'Respiración',
}
# Músculos internos de cabeza, cuello y pelvis: no están junto a la piel, el ajuste por huesos ya los
# coloca bien, y la piel de MakeHuman tiene aberturas (boca, ojos) que confundirían la corrección.
INTERNAL = ('pterygoid', 'glossus', 'geniohyoid', 'palat', 'pharyng', 'superior rectus', 'inferior rectus', 'lateral rectus',
            'medial rectus', 'superior oblique', 'inferior oblique', 'levator palpebrae', 'tendinous ring', 'trochlea',
            'longus colli', 'longus capitis', 'rectus anterior capitis', 'rectus lateralis capitis', 'coccyg', 'levator ani',
            'pubo', 'diaphragm', 'transversus thoracis', 'innermost intercostal', 'psoas', 'iliacus', 'quadratus lumborum')
INTERNAL_REGIONS = {'Pharyngeal muscles', 'Laryngeal muscles'}
NON_MUSCLE = {'Fascia', 'Bursa', 'Articular capsule', 'Ligament', 'Cartilage', 'Text'}
GENERIC = {'Superficial muscles', 'Muscles', 'Fascia', 'Tendon sheaths', 'Bursae', 'Synovial bursae'}

fitter = Fitter()
paths = bonus_paths()
superficial = {o.name for o in bpy.data.collections['Superficial muscles'].objects}

def region_path(name):
    cands = [p[1:] for p in paths[name] if p[0] == 'Muscular system' and p[1] not in GENERIC]
    return max(cands, key=len) if cands else ()

items = []
for o in bpy.data.collections['4: Muscular system'].objects:
    if not is_structure(o): continue
    # Los músculos de Z-Anatomy tienen un material por cara: el del vientre (según su acción) y «Tendon» en las partes
    # tendinosas. El material «activo» es arbitrario (el esternocleidomastoideo izquierdo salía entero como tendón y el
    # derecho como músculo): se cuentan las caras de cada uno.
    slots = [sl.material.name if sl.material else None for sl in o.material_slots]
    counts = collections.Counter(pl.material_index for pl in o.data.polygons)
    tendon_faces = sum(c for i, c in counts.items() if i < len(slots) and slots[i] == 'Tendon')
    belly = max((i for i in counts if i < len(slots) and slots[i] not in (None, 'Tendon')), key=counts.get, default=None)
    mat = slots[belly] if belly is not None else (slots[0] if slots else None)
    if mat in NON_MUSCLE: continue
    base, side = source_name(o.name)
    if opt['only'] and not any(k in base.lower() for k in opt['only']): continue
    tissue = 'tendon' if not counts or tendon_faces / sum(counts.values()) > 0.9 else 'muscle'
    items.append({'obj': o, 'src': o.name, 'base': base, 'side': side, 'mat': mat, 'tissue': tissue, 'slots': slots})

ex = Extractor(fitter, [it['obj'] for it in items], opt['budget'])
TONES = [(0.50, 0.10, 0.08), (0.56, 0.12, 0.09), (0.46, 0.09, 0.08), (0.53, 0.13, 0.11), (0.48, 0.11, 0.07)]
MATS = {f'muscle_{i}': principled(f'MAT_Muscle_{i}', t, 0.5, coat=0.25) for i, t in enumerate(TONES)}
MATS['tendon'] = principled('MAT_Tendon', (0.86, 0.82, 0.74), 0.38, coat=0.35)

stats = []
for n, it in enumerate(items):
    o = it['obj']
    rp = region_path(it['src'])
    name = sanitize(it['base']) + (f'_{it["side"]}' if it['side'] else '')
    internal = any(k in it['base'].lower() for k in INTERNAL) or any(g in INTERNAL_REGIONS for g in rp)
    # Los superficiales se ven de cerca: más detalle; los profundos, menos (con el 23 % se veían facetas).
    obj, moved, worst = ex.fit(o, name, skin_offset=None if internal else 0.0015,
                               detail=1.8 if it['src'] in superficial else 0.75, keep_slots=True)
    me = obj.data
    belly_mat = MATS[f'muscle_{sum(map(ord, it["base"])) % 5}']
    if it['tissue'] == 'tendon':
        me.materials.append(MATS['tendon'])
        for pl in me.polygons: pl.material_index = 0
    else:
        # Una ranura por ranura de Z-Anatomy (las caras conservan su índice): vientre rojo y partes tendinosas blancas.
        for sl in it['slots'] or [None]: me.materials.append(MATS['tendon'] if sl == 'Tendon' else belly_mat)
    nerves = sorted({p[-1] for p in deepest(paths, it['src'], 'Nervous system')})
    obj['anato3d_id'] = 'muscle_' + name.lower()
    obj['system'] = 'muscular'
    obj['tissue'] = it['tissue']
    obj['superficial'] = it['src'] in superficial
    obj['name_en'] = it['base']
    obj['name_la'] = la(it['base']) or ''
    obj['name_es'] = es(it['base']) or ''
    obj['region'] = json.dumps([sanitize(g) for g in rp])
    obj['innervation_es'] = json.dumps([es(x) or x for x in nerves], ensure_ascii=False)
    obj['function_es'] = FUNCTION_ES.get(it['mat'], '')
    obj['source'] = f'Z-Anatomy object "{it['src']}" (BodyParts3D, DBCLS) CC BY-SA 4.0; refitted to the Anato3D skin'
    it.update(out=obj, region=rp)
    stats.append({'name': name, 'faces': len(me.polygons), 'moved_out_of_skin': moved, 'verts': len(me.vertices), 'worst_mm': round(worst * 1000, 1)})
    if n % 50 == 0: log(f'  {n}/{len(items)} {name}: {len(me.polygons)} caras, {moved}/{len(me.vertices)} vértices corregidos por la piel')

# ── Capas: superficial / intermedia / profunda por oclusión ────────────────
verts, polys, owner = [], [], []
for k, it in enumerate(items):
    me = it['out'].data; mw = Matrix.Translation(it['out'].location); off = len(verts)
    verts += [mw @ v.co for v in me.vertices]
    for p in me.polygons:
        polys.append([off + i for i in p.vertices]); owner.append(k)
bvh = bvhtree.BVHTree.FromPolygons(verts, polys)
# Solo cuenta la cara externa de cada músculo: desde sus vértices que miran hacia la piel se lanza
# un rayo hacia el punto de piel más cercano; si antes de llegar choca con otro músculo, está cubierto.
occluders = []
for k, it in enumerate(items):
    me = it['out'].data; mw = Matrix.Translation(it['out'].location)
    hits = collections.Counter(); outer = 0
    for i in range(0, len(me.vertices), max(1, len(me.vertices) // 160)):
        v = me.vertices[i]
        origin = mw @ v.co
        loc, _, _, dist = fitter.skin.find_nearest(origin)
        if loc is None or dist < 1e-4: continue
        d = (loc - origin).normalized()
        if v.normal.normalized().dot(d) < 0.3: continue
        outer += 1
        o = origin
        for _ in range(4):
            hit, _, fi, _ = bvh.ray_cast(o + d * 0.0005, d, dist)
            if hit is None: break
            if owner[fi] != k:
                hits[owner[fi]] += 1; break
            o = hit
    covered = sum(hits.values()) / max(outer, 1)
    occ = [j for j, c in hits.items() if c >= 0.15 * outer]
    occluders.append(occ if covered >= 0.4 else [])
layer = [1 if (it['out']['superficial'] or not occluders[k]) else None for k, it in enumerate(items)]
for _ in range(6):
    for k in range(len(items)):
        if layer[k] == 1: continue
        known = [layer[j] for j in occluders[k] if layer[j]]
        layer[k] = min(3, 1 + max(known)) if known else 2
for k, it in enumerate(items):
    it['out']['layer'] = layer[k]
log('capas:', collections.Counter(layer))

groups = Groups('Muscular_System')
for it in items:
    groups.collection(it['region']).objects.link(it['out'])
save('male_muscular', groups, stats, {'ratio': ex.ratio, 'layers': dict(collections.Counter(layer))})
