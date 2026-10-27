"""Sistemas arterial y venoso (separados) de Z-Anatomy, más el corazón, ajustados al cuerpo de Anato3D con el
mismo ajuste que el esqueleto (ver anato3d_fit.py).

Uso (desde la raíz del proyecto):
  /Applications/Blender.app/Contents/MacOS/Blender -b --disable-autoexec \
    sources/z-anatomy/extracted/Z-Anatomy/Startup.blend \
    --python tools/build_vascular.py -- [--budget 120000] [--only "aorta,femoral"]

Los vasos de Z-Anatomy son curvas con grosor (radio por punto): su detalle se ajusta con la resolución de la
curva según el calibre. El corazón (cavidades, válvulas, músculos papilares) va con el sistema arterial.
Colores según la oxigenación, como en los atlas: arterias pulmonares en azul y venas pulmonares en rojo.

Salida: build/male_arterial.* y build/male_venous.*, y sus .json en web/public/models/.
"""
import bpy, os, re, sys, json, collections
sys.path.insert(0, os.path.dirname(__file__))
from anato3d_fit import (Fitter, Extractor, Groups, bonus_paths, es, la, sanitize, source_name, principled, save,
                         log, parse_args)

opt = parse_args({'budget': 120000, 'only': None})   # presupuesto de caras para las mallas (corazón)

KIND = {'Artery': ('arterial', 'artery'), 'Pulmonary artery': ('arterial', 'pulmonary_artery'),
        'Vein': ('venous', 'vein'), 'Pulmonary vein': ('venous', 'pulmonary_vein')}

# Vasos de la capa «Principales» (sin «right/left»).
MAJOR = {
    'ascending aorta', 'aortic arch', 'thoracic aorta', 'abdominal aorta', 'brachiocephalic trunk', 'common carotid artery',
    'internal carotid artery', 'external carotid artery', 'vertebral artery', 'basilar artery', 'subclavian artery',
    'axillary artery', 'brachial artery', 'radial artery', 'ulnar artery', 'superficial palmar arch', 'deep palmar arch',
    'coeliac trunk', 'superior mesenteric artery', 'inferior mesenteric artery', 'renal artery', 'common iliac artery',
    'external iliac artery', 'internal iliac artery', 'femoral artery', 'deep femoral artery', 'popliteal artery',
    'anterior tibial artery', 'posterior tibial artery', 'fibular artery', 'dorsalis pedis artery', 'pulmonary trunk',
    'bifurcation of pulmonary trunk', 'pulmonary artery', 'coronary artery', 'splenic artery', 'common hepatic artery',
    'facial artery', 'superficial temporal artery', 'anterior cerebral artery', 'middle cerebral artery (m1-segment)',
    'posterior cerebral artery', 'internal thoracic artery',
    'superior vena cava', 'inferior vena cava (abdominal part)', 'inferior vena cava (thoracic part)', 'brachiocephalic vein',
    'internal jugular vein', 'external jugular vein', 'subclavian vein', 'axillary vein', 'cephalic vein', 'basilic vein',
    'median cubital vein', 'brachial veins', 'common iliac vein', 'external iliac vein', 'internal iliac vein', 'femoral vein',
    'great saphenous vein', 'small saphenous vein', 'popliteal vein', 'renal vein', 'hepatic portal vein', 'splenic vein',
    'superior mesenteric vein', 'inferior mesenteric vein', 'azygos vein', 'hemi-azygos vein', 'superior pulmonary vein',
    'inferior pulmonary vein', 'coronary sinus', 'great cardiac vein', 'superior sagittal sinus', 'transverse sinus',
    'sigmoid sinus', 'hepatic veins', 'dorsal venous arch of foot', 'dorsal venous network of hand',
}
# Vasos profundos de cabeza y tronco: el ajuste por huesos basta y la piel tiene cavidades (boca, ojos).
DEEP = ('cerebr', 'cerebell', 'basilar', 'communicating', 'callosomarginal', 'pericallosal', 'striate', 'insular', 'ophthalmic',
        'retinal', 'ciliary', 'meningeal', 'palatine', 'alveolar', 'sphenopalatine', 'pterygoid', 'ethmoidal', 'lingual', 'pontine',
        'sulc', 'frontobasal', 'parieto', 'temporo-occipital', 'prefrontal', 'postcentral', 'angular gyrus', 'orbitofrontal', 'sinus',
        'cavernous', 'petrosal', 'pharyngeal', 'pulmonary', 'lung', 'lobar', 'coronary', 'cardiac', 'interventricular', 'of heart',
        'aorta', 'aortic', 'vena cava', 'azygos', 'renal', 'mesenteric', 'coeliac', 'gastr', 'hepatic', 'splenic', 'portal', 'iliac',
        'intercostal', 'lumbar', 'testicular', 'pancreat', 'colic', 'sigmoid', 'anorectal', 'phrenic', 'suprarenal', 'internal thoracic',
        'brachiocephalic', 'subcostal', 'sacral', 'pudendal', 'gluteal', 'obturator', 'penis', 'maxillary', 'infra-orbital',
        'supra-orbital', 'supratrochlear', 'lacrimal', 'venous plexus', 'vertebral', 'thyroid', 'epigastric', 'appendicular', 'ileal',
        'gastroduodenal', 'marginal artery', 'ileocolic', 'gastro-omental', 'musculophrenic', 'iliolumbar', 'buccal')

# Vasos subcutáneos de la pared del abdomen que coinciden con alguna palabra de DEEP: sí se corrigen. Los pudendos
# externos no: sus ramas van al escroto, fuera de la piel de MakeHuman (los cubre build_genital_skin.py), y al
# meterlos bajo la piel el tubo se estiraba de un lado a otro del pliegue de la ingle y asomaba.
SUBCUTANEOUS = ('superficial epigastric', 'superficial circumflex iliac', 'thoraco-epigastric')

fitter = Fitter()
paths = bonus_paths()
col = bpy.data.collections['5: Cardiovascular system']

def region_path(name, system):
    cv = [p[1:] for p in paths[name] if p[0] == 'Cardiovascular system']
    path = max(cv, key=len) if cv else (('Systemic arteries',) if system == 'arterial' else ('Systemic veins',))
    if len(path) == 1:
        # Sin subgrupo en Z-Anatomy: se agrupa por región del cuerpo, sin lado.
        regions = [p[2] for p in paths[name] if p[:2] == ('Regions of human body', 'Main divisions') and len(p) > 2]
        if regions: path = path + (re.sub(r'^(Right|Left) ', '', regions[0]).capitalize(),)
    return path

items = []
for o in col.objects:
    # Fuera: etiquetas (.j/.g/.t), variantes entre paréntesis y duplicados con nombre corrupto («?», «//»).
    if o.type not in ('MESH', 'CURVE') or o.name.startswith(('(', '?')) or '//' in o.name or o.name.endswith(('.j', '.g', '.t')): continue
    mat = o.active_material.name if o.active_material else None
    base, side = source_name(o.name)
    in_heart = any(p[:2] == ('Cardiovascular system', 'Heart') for p in paths[o.name])
    if in_heart:
        system, tissue = 'arterial', ('valve' if mat in ('Cartilage', 'Ligament') else 'heart')
    elif mat in KIND:
        system, tissue = KIND[mat]
    else:
        continue
    if opt['only'] and not any(k in base.lower() for k in opt['only']): continue
    plain = re.sub(r'^(right|left) ', '', base.lower())
    items.append({'obj': o, 'src': o.name, 'base': base, 'side': side, 'system': system, 'tissue': tissue,
                  'major': plain in MAJOR or tissue in ('heart', 'valve'), 'heart': in_heart or 'coronary' in plain or 'cardiac' in plain
                  or 'interventricular' in plain or plain == 'circumflex artery of heart' or plain.startswith('inferior vein of left ventricle')})
log(f'{len(items)} estructuras:', dict(collections.Counter((it['system'], it['tissue']) for it in items)))

# Resolución de los tubos según su calibre (radio = bevel_depth · radio del punto).
for it in items:
    o = it['obj']
    if o.type != 'CURVE': continue
    radius = o.data.bevel_depth * max((p.radius for s in o.data.splines for p in s.bezier_points), default=1)
    o.data.bevel_resolution = 3 if radius > 0.006 else 2 if radius > 0.002 else 1
    o.data.resolution_u = 6 if radius > 0.006 else 4

ex = Extractor(fitter, [it['obj'] for it in items], opt['budget'])
MATS = {
    'artery': principled('MAT_Artery', (0.50, 0.035, 0.03), 0.35, coat=0.5),
    'pulmonary_artery': principled('MAT_Pulmonary_Artery', (0.10, 0.16, 0.55), 0.35, coat=0.5),
    'vein': principled('MAT_Vein', (0.07, 0.13, 0.50), 0.35, coat=0.5),
    'pulmonary_vein': principled('MAT_Pulmonary_Vein', (0.50, 0.04, 0.05), 0.35, coat=0.5),
    'heart': principled('MAT_Myocardium', (0.36, 0.06, 0.05), 0.45, coat=0.4),
    'valve': principled('MAT_Valve', (0.80, 0.74, 0.62), 0.4, coat=0.3),
}
# Estructuras que faltan en la traducción oficial de Z-Anatomy (clave: nombre inglés con «_»).
PARTS_ES = {
    'Anterior_temporal_branch': 'Rama temporal anterior', 'Posterior_temporal_branch': 'Rama temporal posterior',
    'Artery_of_central_sulcus': 'Arteria del surco central', 'Artery_of_precentral_sulcus': 'Arteria del surco precentral',
    'Branch_to_angular_gyrus': 'Rama del giro angular', 'Temporo_occipital_branch': 'Rama temporooccipital',
    'Distal_lateral_striate_branches': 'Ramas estriadas laterales distales',
    'Proximal_lateral_striate_branches': 'Ramas estriadas laterales proximales',
    'Insular_branches_of_middle_cerebral_artery_M2_segment': 'Ramas insulares de la arteria cerebral media (segmento M2)',
    'Lateral_frontobasal_artery': 'Arteria frontobasal lateral', 'Middle_cerebral_artery_M3_segment': 'Arteria cerebral media (segmento M3)',
    'Middle_genicular_artery': 'Arteria genicular media', 'Posterior_parietal_artery': 'Arteria parietal posterior',
    'Posterior_lateral_nasal_branches_of_sphenopalatine_artery': 'Ramas nasales posteriores laterales de la arteria esfenopalatina',
    'Prefrontal_artery': 'Arteria prefrontal',
}
NAMES_ES = {'Systemic arteries': 'Arterias sistémicas', 'Systemic veins': 'Venas sistémicas', 'Pulmonary vessels': 'Vasos pulmonares',
            'Cardiac vessels': 'Vasos del corazón', 'Heart': 'Corazón', 'Head': 'Cabeza', 'Neck': 'Cuello', 'Trunk': 'Tronco',
            'Upper limb': 'Miembro superior', 'Lower limb': 'Miembro inferior', 'Foot': 'Pie', 'Hand': 'Mano'}
roots = {'arterial': Groups('Arterial_System', NAMES_ES), 'venous': Groups('Venous_System', NAMES_ES)}
stats = {'arterial': [], 'venous': []}
for n, it in enumerate(items):
    o = it['obj']
    name = sanitize(it['base']) + (f'_{it["side"]}' if it['side'] else '')
    low = it['base'].lower()
    deep = it['heart'] or (any(k in low for k in DEEP) and not any(k in low for k in SUBCUTANEOUS))
    obj, moved, worst = ex.fit(o, name, skin_offset=None if deep else 0.002, smooth=30 if it['heart'] else 0)
    obj.data.materials.append(MATS[it['tissue']])
    rp = region_path(it['src'], it['system'])
    obj['anato3d_id'] = f'{it["system"]}_{name.lower()}'
    obj['system'] = it['system']
    obj['tissue'] = it['tissue']
    obj['major'] = bool(it['major'])
    if it['heart']: obj['subsystem'] = 'heart'
    obj['name_en'] = it['base']
    obj['name_la'] = la(it['base']) or ''
    obj['name_es'] = es(it['base']) or PARTS_ES.get(sanitize(it['base'])) or ''
    obj['region'] = json.dumps([sanitize(g) for g in rp])
    obj['source'] = f'Z-Anatomy object "{it['src']}" (BodyParts3D, DBCLS) CC BY-SA 4.0; refitted to the Anato3D skin'
    roots[it['system']].collection(rp).objects.link(obj)
    stats[it['system']].append({'name': name, 'tissue': it['tissue'], 'major': it['major'], 'faces': len(obj.data.polygons),
                                'moved_out_of_skin': moved, 'verts': len(obj.data.vertices), 'worst_mm': round(worst * 1000, 1),
                                'name_es': obj['name_es']})
    if n % 100 == 0: log(f'  {n}/{len(items)} {name}: {len(obj.data.polygons)} caras, {moved}/{len(obj.data.vertices)} vértices corregidos por la piel')

for system, groups in roots.items():
    save(f'male_{system}', groups, stats[system], {'major': sum(s['major'] for s in stats[system])})
