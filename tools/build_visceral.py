"""Sistemas viscerales de Z-Anatomy (respiratorio, digestivo, urogenital, endocrino y linfático) ajustados al cuerpo de
Anato3D con el mismo ajuste que el esqueleto (ver anato3d_fit.py). Un GLB por sistema.

Uso (desde la raíz del proyecto):
  /Applications/Blender.app/Contents/MacOS/Blender -b --disable-autoexec \
    sources/z-anatomy/extracted/Z-Anatomy/Startup.blend \
    --python tools/build_visceral.py -- [--budget 260000] [--systems respiratory,digestive,urogenital,endocrine,lymphatic]
    [--only "lung,stomach"]

Las vísceras están lejos de la piel: no se corrigen por ella (el ajuste por huesos basta, y la piel tiene la
cavidad de la boca). Solo los nodos linfáticos superficiales se meten bajo la piel. Los cartílagos de la laringe y
de la nariz están en el sistema esquelético de Z-Anatomy; los órganos linfoides, en «6: Lymphoid organs».

Salida: build/male_<sistema>.blend y .json, y web/public/models/male-<sistema>.json.
"""
import bpy, bmesh, os, re, sys, json, collections
sys.path.insert(0, os.path.dirname(__file__))
from anato3d_fit import (Fitter, Extractor, Groups, bonus_paths, es, la, sanitize, source_name, principled, save,
                         log, parse_args)
from mathutils import Matrix, Vector, bvhtree
import numpy as np

opt = parse_args({'budget': 260000, 'only': None})
argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
wanted = (argv[argv.index('--systems') + 1] if '--systems' in argv else 'respiratory,digestive,urogenital,endocrine,lymphatic').split(',')

fitter = Fitter()
paths = bonus_paths()

def visceral_path(name):
    ps = [p[1:] for p in paths[name] if p[0] == 'Visceral systems']
    return max(ps, key=len) if ps else None

AIRWAY_CARTILAGES = ('thyroid cartilage', 'cricoid', 'arytenoid cartilage', 'corniculate', 'cuneiform cartilage', 'triticeal',
                     'alar cartilage', 'nasal septal', 'nasal cartilage', 'vomeronasal', 'lateral process of nasal')
UPPER_AIRWAY = ('mucosa of nasal cavity', 'nasopharynx', 'epiglottis')
UPPER_GI = ('oropharynx', 'laryngopharynx', 'soft palate', 'uvula')

def classify(o, base, mat, path):
    """→ (sistema, subsistema, tejido, principal) o None."""
    low = base.lower()
    if o.users_collection and o.users_collection[0].name.startswith('1:') or any(k in low for k in AIRWAY_CARTILAGES):
        if mat == 'Cartilage' and any(k in low for k in AIRWAY_CARTILAGES):
            return 'respiratory', 'airways', 'cartilage', True
        return None
    if any(k in low for k in UPPER_AIRWAY): return 'respiratory', 'airways', 'cartilage' if mat == 'Cartilage' else 'mucosa', True
    if any(k in low for k in UPPER_GI): return 'digestive', 'gi_tract', 'mucosa', True
    if path and path[0] == 'Respiratory system':
        if low == 'pleura': return 'respiratory', 'pleura', 'pleura', False
        if len(path) > 1 and path[1] == 'Lungs': return 'respiratory', 'lungs', 'lung', True
        main = low in ('trachea', 'right main bronchus', 'left main bronchus')
        return 'respiratory', 'airways', 'bronchus', main
    if path and path[0] == 'Abdominopelvic cavity' or low == 'meso-appendix':
        return 'digestive', 'peritoneum', 'peritoneum', False
    if path and path[0] == 'Digestive system':
        sub = path[1] if len(path) > 1 else None
        if sub == 'Liver' or low == 'liver': return 'digestive', 'accessory', 'liver', True
        if mat in ('Gallbladder',): return 'digestive', 'accessory', 'gallbladder', True
        if mat == 'Gland' or 'duct' in low: return 'digestive', 'accessory', 'gland', True
        if 'taenia' in low: return 'digestive', 'gi_tract', 'taenia', False
        if low in ('tongue', 'gingiva'): return 'digestive', 'gi_tract', 'mouth', True
        return 'digestive', 'gi_tract', 'stomach' if 'stomach' in low else 'colon' if ('colon' in low or 'appendix' in low) else 'intestine', True
    return None


# ── Urogenital, endocrino y linfático: devuelven también la ruta de grupos (empieza por el sistema) ──
UROGENITAL = 'Urogenital system'
URINARY = {'kidney': 'kidney', 'renal pelvis': 'renal_pelvis', 'ureter': 'ureter', 'urethra': 'ureter', 'urinary bladder': 'bladder'}
GENITAL_INTERNAL = {'testis': 'testis', 'epididymis': 'epididymis', 'ductus deferens': 'duct', 'ejaculatory duct': 'duct',
                    'seminal gland': 'seminal', 'prostate': 'prostate'}
GENITAL_EXTERNAL = {'corpus cavernosum of penis': 'erectile', 'corpus spongiosum of penis': 'erectile', 'glans penis': 'erectile'}
ENDOCRINE = {'adenohypophysis': ('pituitary', 'pituitary'), 'neurohypophysis': ('pituitary', 'pituitary'), 'pineal gland': ('pineal', 'pineal'),
             'thyroid gland': ('thyroid', 'thyroid'), 'superior parathyroid gland': ('thyroid', 'parathyroid'),
             'inferior parathyroid gland': ('thyroid', 'parathyroid'), 'suprarenal gland': ('adrenal', 'adrenal')}
# Regiones de los nodos linfáticos (TA2), por palabras del nombre; el orden importa (p. ej. «paratracheal cervical»).
NODE_REGIONS = [
    ('Lymph nodes of head', ('occipital', 'mastoid', 'parotid', 'auricular', 'bucinator', 'nasolabial', 'mandibular', 'submental')),
    ('Lymph nodes of neck', ('cervical', 'jugul', 'retropharyngeal', 'pretracheal', 'thyroid nodes', 'supraclavicular')),
    ('Lymph nodes of upper limb', ('axillary', 'brachial', 'cubital', 'supratrochlear', 'infraclavicular', 'interpectoral')),
    ('Thoracic lymph nodes', ('parasternal', 'intercostal', 'prevertebral', 'superior diaphragmatic', 'pericardial', 'brachiocephalic',
                              'tracheobronchial', 'paratracheal thoracic', 'oesophageal', 'intrapulmonary', 'azygos', 'ligamentum arteriosum')),
    ('Pelvic lymph nodes', ('iliac', 'obturator', 'sacral', 'gluteal', 'vesical', 'pararectal', 'lacunar')),
    ('Lymph nodes of lower limb', ('inguinal', 'popliteal', 'tibial', 'fibular')),
]
# Nodos que pueden quedar fuera de la piel tras el ajuste (están bajo el tejido subcutáneo).
SUPERFICIAL_NODES = ('superficial', 'axillary', 'cubital', 'supratrochlear', 'occipital', 'mastoid', 'parotid', 'auricular', 'bucinator',
                     'nasolabial', 'mandibular', 'submental', 'popliteal', 'inguinal', 'brachial', 'infraclavicular', 'interpectoral',
                     'jugul', 'supraclavicular', 'tibial', 'fibular')

def classify_new(o, base, mat):
    """→ (sistema, subsistema, tejido, principal, ruta) o None."""
    low = base.lower()
    if low in URINARY:
        path = (UROGENITAL, 'Urinary system') + (('Kidney',) if low in ('kidney', 'renal pelvis') else ())
        return 'urogenital', 'urinary', URINARY[low], True, path
    if low in GENITAL_INTERNAL:
        return 'urogenital', 'reproductive', GENITAL_INTERNAL[low], True, (UROGENITAL, 'Male genital system', 'Male internal genitalia')
    if low in GENITAL_EXTERNAL:
        return 'urogenital', 'reproductive', GENITAL_EXTERNAL[low], True, (UROGENITAL, 'Male genital system', 'Male external genitalia', 'Penis')
    if low in ENDOCRINE:
        sub, tissue = ENDOCRINE[low]
        return 'endocrine', sub, tissue, True, ('Endocrine glands',) + (('Hypophysis',) if sub == 'pituitary' else ())
    if '6: Lymphoid organs' not in [c.name for c in o.users_collection]: return None
    if low == 'spleen': return 'lymphatic', 'organs', 'spleen', True, ('Lymphoid system',)
    if 'thymus' in low: return 'lymphatic', 'organs', 'thymus', True, ('Lymphoid system', 'Thymus')
    if 'tonsil' in low: return 'lymphatic', 'organs', 'tonsil', True, ('Lymphoid system', 'Pharyngeal lymphoid ring')
    if 'node' in low:
        region = next((r for r, keys in NODE_REGIONS if any(k in low for k in keys)), 'Abdominal lymph nodes')
        return 'lymphatic', 'nodes', 'node', False, ('Lymphoid system', 'Lymph nodes', region)
    return None

# Huesos de la Fase 2 (cargados por Fitter), con la orientación de cada uno: las piezas _L tienen las normales hacia
# dentro y algunos huesos son mallas abiertas (el sacro), así que se usa la cara más cercana y no la paridad.
_bm, BONE_SIGN = bmesh.new(), []
for _o in bpy.data.collections['Fase2_ref'].objects:
    if _o.type != 'MESH' or _o.get('system') != 'skeletal': continue
    _b = bmesh.new(); _b.from_mesh(_o.data); _b.transform(_o.matrix_world)
    BONE_SIGN += [1.0 if _b.calc_volume(signed=True) >= 0 else -1.0] * len(_b.faces)
    _me = bpy.data.meshes.new('tmp'); _b.to_mesh(_me); _b.free(); _bm.from_mesh(_me); bpy.data.meshes.remove(_me)
BONES = bvhtree.BVHTree.FromBMesh(_bm); _bm.free()

def bone_depth(p):
    """(profundidad dentro del hueso más cercano en m, normal hacia fuera de ese hueso)."""
    loc, nrm, idx, _ = BONES.find_nearest(p)
    if loc is None: return 0.0, None
    n = nrm * BONE_SIGN[idx]
    return -(p - loc).dot(n), n

def skin_out(p):
    """(cuánto sale de la piel en m, normal de la piel), o None si está dentro."""
    loc, nrm, _, _ = fitter.skin.find_nearest(p)
    if loc is None: return None
    depth = (p - loc).dot(nrm)
    return (depth, nrm) if depth > -0.003 and (depth <= 0 or not fitter.inside_body(p)) else None

def components(bm):
    """Piezas sueltas de la malla (listas de vértices conectados)."""
    seen, comps = set(), []
    for v in bm.verts:
        if v.index in seen: continue
        stack, comp = [v], []; seen.add(v.index)
        while stack:
            x = stack.pop(); comp.append(x)
            for e in x.link_edges:
                y = e.other_vert(x)
                if y.index not in seen: seen.add(y.index); stack.append(y)
        comps.append(comp)
    return comps

def place_nodes(obj, superficial):
    """Coloca cada nodo (pieza suelta de la malla) moviéndolo entero, sin deformarlo:
    1. fuera de los huesos (el ajuste mezcla las transformaciones de huesos vecinos y alguno quedaba dentro);
    2. si es superficial, bajo la piel: hasta 3 mm, o menos si el hueco entre hueso y piel no da (cuero cabelludo).
    Devuelve (nodos movidos, mayor salida de la piel en m)."""
    bm = bmesh.new(); bm.from_mesh(obj.data); bm.verts.ensure_lookup_table()
    comps = components(bm)
    def worst_bone(comp, shift):
        return max((bone_depth(obj.location + v.co + shift) for v in comp), key=lambda t: t[0])
    moved, worst = 0, 0.0
    for comp in comps:
        shift = Vector()
        for _ in range(3):
            d, n = worst_bone(comp, shift)
            if n is None or d <= 0.0003: break
            shift += n * (d + 0.0005)
        if superficial:
            outs = [o for o in (skin_out(obj.location + v.co + shift) for v in comp) if o]
            if outs:
                d, n = max(outs, key=lambda t: t[0])
                worst = max(worst, d)
                for off in (0.003, 0.002, 0.001, 0.0005):
                    trial = shift - n * (d + off)
                    if worst_bone(comp, trial)[0] <= 0.0003 or off == 0.0005: shift = trial; break
        if shift.length > 1e-6:
            for v in comp: v.co += shift
            moved += 1
    bm.to_mesh(obj.data); bm.free(); obj.data.update()
    return moved, worst

FALLBACK = {('respiratory', 'airways'): ('Respiratory system', 'Upper respiratory tract'),
            ('digestive', 'gi_tract'): ('Digestive system', 'Pharynx'),
            ('digestive', 'peritoneum'): ('Digestive system', 'Peritoneum')}
items = []
sources = [o for c in ('8: Visceral systems', '1: Skeletal system', '6: Lymphoid organs') for o in bpy.data.collections[c].objects]
for o in sources:
    if o.type not in ('MESH', 'CURVE') or o.name.startswith(('(', '?')) or '//' in o.name or o.name.endswith(('.j', '.g', '.t', '.i')): continue
    base, side = source_name(o.name)
    base = re.sub(r'\*+', '', base).strip()
    mat = o.active_material.name if o.active_material else None
    new = classify_new(o, base, mat)
    path = new[4] if new else visceral_path(o.name)
    cls = new[:4] if new else classify(o, base, mat, path)
    if not cls or cls[0] not in wanted: continue
    if opt['only'] and not any(k in base.lower() for k in opt['only']): continue
    system, sub, tissue, major = cls
    if not new and (not path or o.users_collection[0].name.startswith('1:')):
        path = FALLBACK.get((system, sub), ('Respiratory system', 'Larynx') if tissue == 'cartilage' else (system.capitalize(),))
        if tissue == 'cartilage' and any(k in base.lower() for k in ('alar', 'nasal')): path = ('Respiratory system', 'Nose')
        elif tissue == 'cartilage': path = ('Respiratory system', 'Larynx')
    items.append({'obj': o, 'src': o.name, 'base': base, 'side': side, 'system': system, 'sub': sub, 'tissue': tissue, 'major': major, 'path': path})
log(f'{len(items)} estructuras:', dict(collections.Counter((it['system'], it['sub'], it['tissue']) for it in items)))

ex = Extractor(fitter, [it['obj'] for it in items], opt['budget'], keep_subsurf_below=2000)
def srgb(*c):
    """Color de atlas en sRGB → lineal, que es lo que espera Blender."""
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)

LIVER = [srgb(0.55, 0.20, 0.16), srgb(0.60, 0.23, 0.18), srgb(0.52, 0.18, 0.15), srgb(0.58, 0.22, 0.19)]
MATS = {
    'lung': [principled(f'MAT_Lung_{i}', srgb(*c), 0.6, coat=0.25) for i, c in enumerate([(0.84, 0.52, 0.54), (0.86, 0.56, 0.56), (0.82, 0.50, 0.53)])],
    'bronchus': principled('MAT_Bronchus', srgb(0.92, 0.84, 0.80), 0.45, coat=0.3),
    'cartilage': principled('MAT_Airway_Cartilage', srgb(0.80, 0.85, 0.90), 0.45, coat=0.4),
    'mucosa': principled('MAT_Mucosa', srgb(0.86, 0.50, 0.50), 0.4, coat=0.4),
    'pleura': principled('MAT_Pleura', srgb(0.90, 0.91, 0.96), 0.3, coat=0.6, alpha=0.18),
    'mouth': principled('MAT_Tongue', srgb(0.82, 0.42, 0.44), 0.45, coat=0.4),
    'stomach': principled('MAT_Stomach', srgb(0.86, 0.55, 0.52), 0.45, coat=0.3),
    'intestine': principled('MAT_Small_Intestine', srgb(0.90, 0.66, 0.60), 0.45, coat=0.3),
    'colon': principled('MAT_Colon', srgb(0.80, 0.62, 0.50), 0.45, coat=0.3),
    'taenia': principled('MAT_Taenia', srgb(0.92, 0.88, 0.80), 0.45),
    'liver': [principled(f'MAT_Liver_{i}', c, 0.4, coat=0.4) for i, c in enumerate(LIVER)],
    'gallbladder': principled('MAT_Gallbladder', srgb(0.35, 0.55, 0.22), 0.35, coat=0.5),
    'gland': principled('MAT_Gland', srgb(0.92, 0.78, 0.58), 0.5, coat=0.3),
    'peritoneum': principled('MAT_Omentum', srgb(0.96, 0.86, 0.58), 0.5, coat=0.2, alpha=0.8),
    # Urogenital
    'kidney': principled('MAT_Kidney', srgb(0.56, 0.22, 0.19), 0.4, coat=0.45),
    'renal_pelvis': principled('MAT_Renal_Pelvis', srgb(0.93, 0.84, 0.60), 0.45, coat=0.3),
    'ureter': principled('MAT_Ureter', srgb(0.93, 0.84, 0.60), 0.45, coat=0.3),
    'bladder': principled('MAT_Bladder', srgb(0.88, 0.66, 0.58), 0.45, coat=0.35),
    'testis': principled('MAT_Testis', srgb(0.90, 0.86, 0.84), 0.35, coat=0.5),
    'epididymis': principled('MAT_Epididymis', srgb(0.80, 0.56, 0.50), 0.45, coat=0.3),
    'duct': principled('MAT_Ductus_Deferens', srgb(0.93, 0.87, 0.72), 0.45, coat=0.3),
    'seminal': principled('MAT_Seminal_Gland', srgb(0.86, 0.72, 0.58), 0.5, coat=0.3),
    'prostate': principled('MAT_Prostate', srgb(0.78, 0.54, 0.46), 0.5, coat=0.3),
    'erectile': principled('MAT_Erectile', srgb(0.80, 0.50, 0.48), 0.45, coat=0.3),
    # Endocrino
    'thyroid': principled('MAT_Thyroid', srgb(0.66, 0.26, 0.27), 0.4, coat=0.4),
    'parathyroid': principled('MAT_Parathyroid', srgb(0.82, 0.62, 0.34), 0.4, coat=0.3),
    'adrenal': principled('MAT_Adrenal', srgb(0.88, 0.66, 0.28), 0.45, coat=0.3),
    'pituitary': principled('MAT_Pituitary', srgb(0.86, 0.64, 0.58), 0.45, coat=0.3),
    'pineal': principled('MAT_Pineal', srgb(0.76, 0.58, 0.62), 0.45, coat=0.3),
    # Linfático (nodos en verde, como en los atlas)
    'spleen': principled('MAT_Spleen', srgb(0.46, 0.18, 0.28), 0.4, coat=0.45),
    'thymus': principled('MAT_Thymus', srgb(0.90, 0.80, 0.66), 0.5, coat=0.25),
    'tonsil': principled('MAT_Tonsil', srgb(0.84, 0.52, 0.52), 0.45, coat=0.35),
    'node': [principled(f'MAT_Lymph_Node_{i}', srgb(*c), 0.45, coat=0.3) for i, c in enumerate([(0.52, 0.74, 0.34), (0.48, 0.70, 0.32), (0.56, 0.76, 0.38)])],
}
NAMES_ES = {'Respiratory system': 'Sistema respiratorio', 'Digestive system': 'Sistema digestivo', 'Lungs': 'Pulmones',
            'Tracheobronchial tree': 'Árbol traqueobronquial', 'Digestive canal': 'Tubo digestivo', 'Liver': 'Hígado', 'Mouth': 'Boca',
            'Upper respiratory tract': 'Vías respiratorias altas', 'Larynx': 'Laringe', 'Nose': 'Nariz', 'Pharynx': 'Faringe',
            'Peritoneum': 'Peritoneo', 'Abdominopelvic cavity': 'Cavidad abdominopélvica', 'Peritoneal structures': 'Estructuras peritoneales',
            'Urinary system': 'Sistema urinario', 'Kidney': 'Riñón', 'Male genital system': 'Órganos genitales masculinos',
            'Male internal genitalia': 'Órganos genitales internos', 'Male external genitalia': 'Órganos genitales externos', 'Penis': 'Pene',
            'Hypophysis': 'Hipófisis', 'Thymus': 'Timo', 'Pharyngeal lymphoid ring': 'Anillo linfático de la faringe',
            'Lymph nodes': 'Nodos linfáticos', 'Lymph nodes of head': 'Nodos de la cabeza', 'Lymph nodes of neck': 'Nodos del cuello',
            'Lymph nodes of upper limb': 'Nodos del miembro superior', 'Thoracic lymph nodes': 'Nodos del tórax',
            'Abdominal lymph nodes': 'Nodos del abdomen', 'Pelvic lymph nodes': 'Nodos de la pelvis',
            'Lymph nodes of lower limb': 'Nodos del miembro inferior'}
# Nombres que faltan en la traducción oficial o que tienen erratas (clave: nombre inglés con «_»). Tienen prioridad.
PARTS_ES = {
    'Node_of_arch_of_azygos_vein': 'Nodo del arco de la vena ácigos', 'Node_of_ligamentum_arteriosum': 'Nodo del ligamento arterioso',
    'Cystic_node': 'Nodo cístico', 'Pre_aortic_nodes': 'Nodos preaórticos', 'Retro_aortic_nodes': 'Nodos retroaórticos',
    'Precaecal_nodes': 'Nodos prececales', 'Retrocaecal_nodes': 'Nodos retrocecales', 'Precaval_nodes': 'Nodos precavales',
    'Retrocaval_nodes': 'Nodos retrocavales', 'Prevesical_nodes': 'Nodos prevesicales', 'Prepericardial_nodes': 'Nodos prepericárdicos',
    'Parasternal_nodes': 'Nodos paraesternales', 'Infra_auricular_nodes': 'Nodos infraauriculares', 'Pre_auricular_nodes': 'Nodos preauriculares',
    'Retropharyngeal_nodes': 'Nodos retrofaríngeos', 'Juxta_oesophageal_nodes': 'Nodos yuxtaesofágicos',
    'Juxta_intestinal_mesenteric_nodes': 'Nodos mesentéricos yuxtaintestinales', 'Right_gastro_omental_nodes': 'Nodos gastroomentales derechos',
    'Medial_external_iliac_nodes': 'Nodos ilíacos externos mediales', 'Anterior_inferior_jugular_nodes': 'Nodos yugulares anteroinferiores',
    'Superolateral_superficial_inguinal_nodes': 'Nodos inguinales superficiales superolaterales', 'Splenic_nodes': 'Nodos esplénicos',
    'Pararectal_nodes': 'Nodos pararrectales', 'Palatine_tonsil': 'Amígdala palatina', 'Glans_penis': 'Glande',
}

roots = {s: Groups(f'{s.capitalize()}_System', NAMES_ES) for s in wanted}
stats = {s: [] for s in wanted}
for n, it in enumerate(items):
    o = it['obj']
    name = sanitize(it['base']) + (f'_{it["side"]}' if it['side'] else '')
    superficial = it['tissue'] == 'node' and any(k in it['base'].lower() for k in SUPERFICIAL_NODES)
    # Los cartílagos de la nariz forman la nariz externa: sí se corrigen por la piel (asomaban hasta 4 mm).
    nose = it['tissue'] == 'cartilage' and any(k in it['base'].lower() for k in ('alar', 'nasal'))
    obj, moved, worst = ex.fit(o, name, skin_offset=0.0015 if nose else None, smooth=30, pin=0.002)
    if nose and moved: log(f'  {name}: {moved} vértices metidos bajo la piel (salían hasta {worst * 1000:.1f} mm)')
    if it['tissue'] == 'node':
        moved, worst = place_nodes(obj, superficial)
        if moved: log(f'  {name}: {moved} nodos recolocados' + (f' (salían de la piel hasta {worst * 1000:.1f} mm)' if worst > 0 else ''))
    m = MATS[it['tissue']]
    obj.data.materials.append(m[sum(map(ord, it['base'])) % len(m)] if isinstance(m, list) else m)
    obj['anato3d_id'] = f'{it["system"]}_{name.lower()}'
    obj['system'] = it['system']
    obj['subsystem'] = it['sub']
    obj['tissue'] = it['tissue']
    obj['major'] = bool(it['major'])
    obj['name_en'] = it['base']
    obj['name_la'] = la(it['base']) or ''
    obj['name_es'] = PARTS_ES.get(sanitize(it['base'])) or es(it['base']) or ''
    # La ruta empieza en el sistema (que ya es la raíz de la colección).
    rp = list(it['path'][1:]) if len(it['path']) > 1 else []
    obj['region'] = json.dumps([sanitize(g) for g in rp])
    obj['source'] = f'Z-Anatomy object "{it['src']}" (BodyParts3D, DBCLS) CC BY-SA 4.0; refitted to the Anato3D skin'
    roots[it['system']].collection(rp).objects.link(obj)
    it['out'] = obj
    stats[it['system']].append({'name': name, 'sub': it['sub'], 'tissue': it['tissue'], 'faces': len(obj.data.polygons),
                                'verts': len(obj.data.vertices), 'name_es': obj['name_es']})
    if n % 25 == 0: log(f'  {n}/{len(items)} {name}: {len(obj.data.polygons)} caras')

# ── Solapes entre órganos ───────────────────────────────────────────────────
# El ajuste mezcla las transformaciones de huesos vecinos y algunos órganos acababan unos dentro de otros. La auditoría
# encontraba:
#   - el polo superior del riñón metido en la glándula suprarrenal (11 % de sus vértices);
#   - una tenia del colon dentro del riñón derecho;
#   - la vesícula seminal dentro del colon sigmoide;
#   - 20 grupos de nodos linfáticos hundidos en el páncreas, el colon, la vejiga, la pleura, la lengua o el hígado
#     (hasta un 33 %).
# Los nodos se sacan moviendo cada uno entero, como ya se sacaban de los huesos; no los intraglandulares de la parótida
# ni los de los mesos, que van dentro. Entre órganos solo se separan los de grupos distintos (riñón, suprarrenal, bazo,
# hígado, páncreas, colon, estómago e intestino, pelvis, testículo, pulmones, timo, tiroides, laringe), y cede el más
# pequeño: sus vértices dentro del otro pasan a su superficie (+0,5 mm) y el desplazamiento se extiende con suavidad a
# los vecinos. Dentro de un grupo hay continuidades y uniones reales (el sigma con el colon descendente, la vesícula
# seminal con la próstata, los segmentos del hígado); la boca, las mucosas, el peritoneo, los conductos y el tejido
# eréctil no se tocan: con todos los pares, la úvula salía del paladar blando y las glándulas salivales de la encía.
DIRS6 = [Vector(d) for d in ((1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1))]
def inside(T, p):
    odd = 0
    for d in DIRS6:
        o, n = p, 0
        while n < 16:
            hit = T.ray_cast(o + d * 1e-5, d)[0]
            if hit is None: break
            n += 1; o = hit
        odd += n % 2
    return odd >= 5

def solid(it):
    obj = it['out']
    bm = bmesh.new(); bm.from_mesh(obj.data); bm.transform(Matrix.Translation(obj.location))
    V = np.array([v.co[:] for v in bm.verts])
    out = dict(it=it, name=obj.name, T=bvhtree.BVHTree.FromBMesh(bm), V=V, lo=V.min(0), hi=V.max(0),
               closed=all(e.is_manifold for e in bm.edges), volume=abs(bm.calc_volume()),
               sign=1.0 if bm.calc_volume(signed=True) >= 0 else -1.0)
    bm.free()
    return out

NATURAL = [('Intraglandular', ''), ('', 'Meso')]
def natural(a, b):
    a, b = a.lower(), b.lower()
    return any((x.lower() in a and y.lower() in b) or (x.lower() in b and y.lower() in a) for x, y in NATURAL)

GROUP = {'kidney': 'kidney', 'renal_pelvis': 'kidney', 'adrenal': 'adrenal', 'spleen': 'spleen', 'liver': 'liver',
         'gallbladder': 'liver', 'colon': 'colon', 'taenia': 'colon', 'stomach': 'gi', 'intestine': 'gi',
         'bladder': 'pelvis', 'prostate': 'pelvis', 'seminal': 'pelvis', 'testis': 'testis', 'epididymis': 'testis',
         'lung': 'lungs', 'pleura': 'lungs', 'bronchus': 'lungs', 'thymus': 'thymus', 'thyroid': 'thyroid',
         'parathyroid': 'thyroid', 'cartilage': 'larynx'}
def group(o):
    return 'pancreas' if o['name'] == 'Pancreas' else GROUP.get(o['it']['tissue'])

organs = [solid(it) for it in items if 'out' in it and it['tissue'] != 'node']
organs = [o for o in organs if o['closed']]
def overlap(a, b): return not ((a['lo'] > b['hi']).any() or (a['hi'] < b['lo']).any())

# Nodos: enteros fuera de los órganos.
nodes_moved = 0
for it in items:
    if 'out' not in it or it['tissue'] != 'node': continue
    obj = it['out']; loc = Vector(obj.location)
    bm = bmesh.new(); bm.from_mesh(obj.data); bm.verts.ensure_lookup_table()
    for comp in components(bm):
        P0 = np.array([(loc + v.co)[:] for v in comp]); lo, hi = P0.min(0), P0.max(0)
        near = [o for o in organs if not natural(obj.name, o['name']) and not ((lo > o['hi']).any() or (hi < o['lo']).any())]
        shift = Vector()
        for _ in range(3):
            worst = (0.0, None)
            for o in near:
                for p in P0:
                    q = Vector(p) + shift
                    if not inside(o['T'], q): continue
                    hit, nrm, _, d = o['T'].find_nearest(q)
                    if d > worst[0]: worst = (d, nrm * o['sign'])
            if worst[1] is None: break
            shift += worst[1] * (worst[0] + 0.0005)
        if shift.length > 1e-6:
            for v in comp: v.co += shift
            nodes_moved += 1
    bm.to_mesh(obj.data); bm.free(); obj.data.update()
log(f'nodos sacados de los órganos: {nodes_moved}')

# Órganos: cede el más pequeño.
fixed_pairs = []
for i, a in enumerate(organs):
    for b in organs[i + 1:]:
        ga, gb = group(a), group(b)
        if not ga or not gb or ga == gb or not overlap(a, b): continue
        y, k = (a, b) if a['volume'] < b['volume'] else (b, a)
        A = y['V']; sel = np.where(((A >= k['lo']) & (A <= k['hi'])).all(1))[0]
        inn = [j for j in sel if inside(k['T'], Vector(A[j]))]
        frac = max(len(inn) / len(A), np.mean([inside(y['T'], Vector(p)) for p in k['V'][::max(1, len(k['V']) // 400)]]))
        if frac <= 0.02 or not inn: continue
        D = np.zeros_like(A); fixed = np.zeros(len(A), bool)
        for j in inn:
            hit, nrm, _, _ = k['T'].find_nearest(Vector(A[j]))
            D[j] = np.array(hit + nrm * k['sign'] * 0.0005) - A[j]; fixed[j] = True
        obj = y['it']['out']; me = obj.data
        E = np.empty(len(me.edges) * 2, dtype=np.int64); me.edges.foreach_get('vertices', E); E = E.reshape(-1, 2)
        deg = np.maximum(np.bincount(E.ravel(), minlength=len(A)), 1)[:, None]
        D0 = D.copy()
        for _ in range(6):
            acc = np.zeros_like(D); np.add.at(acc, E[:, 0], D[E[:, 1]]); np.add.at(acc, E[:, 1], D[E[:, 0]])
            D = np.where(fixed[:, None], D0, 0.5 * D + 0.5 * acc / deg)
        V = A + D
        fitter.push_out_of_bone(V)
        me.vertices.foreach_set('co', (V - np.array(obj.location)).ravel()); me.update()
        y.update(solid(y['it']))
        fixed_pairs.append(f'{y["name"]} fuera de {k["name"]} ({frac * 100:.0f} %, {len(inn)} vértices)')
log('órganos separados:', fixed_pairs)

for system, groups in roots.items():
    save(f'male_{system}', groups, stats[system])
