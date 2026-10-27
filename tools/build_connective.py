"""Tejido conjuntivo: ligamentos, cápsulas articulares, discos y meniscos, fascias, bursas y vainas tendinosas
de Z-Anatomy, ajustados al cuerpo de Anato3D con el mismo ajuste que el esqueleto (ver anato3d_fit.py).

Uso (desde la raíz del proyecto):
  /Applications/Blender.app/Contents/MacOS/Blender -b --disable-autoexec \
    sources/z-anatomy/extracted/Z-Anatomy/Startup.blend \
    --python tools/build_connective.py -- [--budget 200000] [--only "cruciate,meniscus"]

Salida: build/male_connective.blend, build/male_connective.json y web/public/models/male-connective.json.
"""
import bpy, os, re, sys, json, collections
sys.path.insert(0, os.path.dirname(__file__))
from anato3d_fit import (Fitter, Extractor, Groups, bonus_paths, es, la, sanitize, source_name, is_structure,
                         principled, save, log, parse_args)

opt = parse_args({'budget': 200000, 'only': None})

# Material de Z-Anatomy → tejido de Anato3D, según la colección de origen.
JOINTS = {'Ligament': 'ligament', 'Articular capsule': 'capsule', 'Cartilage': 'cartilage', 'Fat': 'fat'}
MUSCULAR = {'Fascia': 'fascia', 'Bursa': 'bursa', 'Articular capsule': 'sheath', 'Ligament': 'ligament'}

# Profundidad bajo la piel tras la corrección: las fascias quedan justo por fuera de los músculos (1,5 mm).
SKIN_OFFSET = {'fascia': 0.001, 'bursa': 0.0015, 'sheath': 0.0015, 'ligament': 0.0015, 'capsule': 0.0015,
               'cartilage': 0.0015, 'fat': 0.0015}
# Articulaciones profundas: el ajuste por huesos basta y la corrección de piel solo podría estropearlas.
DEEP_JOINTS = {'Joints of skull', 'Joints of auditory ossicles', 'Laryngeal joints', 'Joints of vertebral column', 'Thoracic joints'}
DEEP_NAMES = ('sacro', 'pubic', 'iliolumbar', 'pelvi', 'obturator', 'interosseous membrane', 'intervertebral', 'longitudinal ligament')

# Grupos de reserva cuando Z-Anatomy no da una articulación concreta.
FALLBACK = {'fascia': 'Fasciae', 'bursa': 'Synovial bursae', 'sheath': 'Tendon sheaths', 'ligament': 'Ligaments of muscles'}
NAMES_ES = {'Arthrology': 'Artrología', 'Fasciae': 'Fascias', 'Synovial bursae': 'Bolsas sinoviales (bursas)',
            'Tendon sheaths': 'Vainas tendinosas', 'Ligaments of muscles': 'Ligamentos y retináculos musculares',
            'Cranial syndesmosis': 'Sindesmosis craneales', 'Crico-arythenoid joint': 'Articulación cricoaritenoidea',
            'Medial collateral ligament': 'Ligamento colateral medial', 'Lateral collateral ligament': 'Ligamento colateral lateral',
            'Cuboidonavicular joint': 'Articulación cuboideonavicular'}
# Estructuras que faltan en la traducción oficial de Z-Anatomy.
PARTS_ES = {
    'Coracobrachial bursa': 'Bolsa coracobraquial',
    'Cruciform part of fibrous sheath of digit of hand': 'Porción cruciforme de la vaina fibrosa de los dedos de la mano',
    'Frenula capsulae': 'Frenillos de la cápsula articular',
    'Subcutaneous acromial bursa': 'Bolsa subcutánea acromial',
    'Subfacial prepatellar bursa': 'Bolsa prerrotuliana subfascial',
    'Tendon sheath abd pollicis longus ext pollicis brevis': 'Vaina tendinosa del abductor largo y del extensor corto del pulgar',
    'Tendon sheath of extensor digiti minimi manus': 'Vaina tendinosa del extensor del meñique',
    'Tendon sheath of extensor digitorum and extensor indicis': 'Vaina tendinosa del extensor de los dedos y del extensor del índice',
    'Tendon sheath of extensor pollicis longus': 'Vaina tendinosa del extensor largo del pulgar',
    'Tendon sheath of extensors carpi radialis': 'Vaina tendinosa de los extensores radiales del carpo',
    'Tendon sheath of tibialis anterior': 'Vaina tendinosa del tibial anterior',
    'Trochanteric bursa of gluteus medius muscle': 'Bolsa trocantérea del músculo glúteo medio',
}

fitter = Fitter()
paths = bonus_paths()

def region_path(name, tissue):
    arth = [p for p in paths[name] if p[0] == 'Arthrology']
    if arth: return max(arth, key=len)
    return (FALLBACK.get(tissue, 'Fasciae'),)

items = []
for col_name, table in (('3: Joints', JOINTS), ('4: Muscular system', MUSCULAR)):
    for o in bpy.data.collections[col_name].objects:
        if not is_structure(o): continue
        mat = o.active_material.name if o.active_material else None
        if mat not in table: continue
        base, side = source_name(o.name)
        if opt['only'] and not any(k in base.lower() for k in opt['only']): continue
        items.append({'obj': o, 'src': o.name, 'base': base, 'side': side, 'tissue': table[mat]})
log(f'{len(items)} estructuras de tejido conjuntivo:', dict(collections.Counter(it['tissue'] for it in items)))

ex = Extractor(fitter, [it['obj'] for it in items], opt['budget'])
MATS = {
    # Blanco frío y nacarado, para distinguirlos del hueso (marfil).
    'ligament': principled('MAT_Ligament', (0.62, 0.67, 0.72), 0.32, coat=0.45),
    'capsule': principled('MAT_Capsule', (0.58, 0.63, 0.69), 0.38, coat=0.35),
    'cartilage': principled('MAT_Cartilage', (0.62, 0.70, 0.80), 0.45, coat=0.4),
    'fat': principled('MAT_Fat', (0.92, 0.76, 0.40), 0.5),
    'fascia': principled('MAT_Fascia', (0.86, 0.86, 0.90), 0.4, alpha=0.55),
    'bursa': principled('MAT_Bursa', (0.55, 0.66, 0.82), 0.3, coat=0.5, alpha=0.6),
    'sheath': principled('MAT_Sheath', (0.60, 0.72, 0.84), 0.3, coat=0.5, alpha=0.6),
}

groups = Groups('Connective_System', NAMES_ES)
stats = []
for n, it in enumerate(items):
    o = it['obj']
    rp = region_path(it['src'], it['tissue'])
    # El ligamento nucal va justo bajo la piel de la nuca: se corrige aunque sea de la columna (salía hasta 11 mm).
    # El supraespinoso no: no salía, y al corregirlo se hundía en las apófisis espinosas.
    superficial = 'nuchal ligament' in it['base'].lower()
    deep = not superficial and (any(g in DEEP_JOINTS for g in rp) or any(k in it['base'].lower() for k in DEEP_NAMES))
    name = sanitize(it['base']) + (f'_{it["side"]}' if it['side'] else '')
    # Las fascias se separan 1,2 mm de los músculos que envuelven para que no los atraviesen.
    obj, moved, worst = ex.fit(o, name, skin_offset=None if deep else SKIN_OFFSET[it['tissue']],
                               inflate=0.0012 if it['tissue'] == 'fascia' else 0.0)
    obj.data.materials.append(MATS[it['tissue']])
    obj['anato3d_id'] = 'connective_' + name.lower()
    obj['system'] = 'connective'
    obj['tissue'] = it['tissue']
    obj['name_en'] = it['base']
    obj['name_la'] = la(it['base']) or ''
    obj['name_es'] = es(it['base']) or PARTS_ES.get(re.sub(r'[^A-Za-z0-9]+', ' ', it['base']).strip()) or ''
    obj['region'] = json.dumps([sanitize(g) for g in rp])
    obj['source'] = f'Z-Anatomy object "{it['src']}" (BodyParts3D, DBCLS) CC BY-SA 4.0; refitted to the Anato3D skin'
    groups.collection(rp).objects.link(obj)
    stats.append({'name': name, 'tissue': it['tissue'], 'faces': len(obj.data.polygons), 'moved_out_of_skin': moved,
                  'verts': len(obj.data.vertices), 'worst_mm': round(worst * 1000, 1), 'name_es': obj['name_es']})
    if n % 50 == 0: log(f'  {n}/{len(items)} {name}: {len(obj.data.polygons)} caras, {moved}/{len(obj.data.vertices)} vértices corregidos por la piel')

save('male_connective', groups, stats, {'ratio': ex.ratio, 'tissues': dict(collections.Counter(it['tissue'] for it in items))})
