"""Sistema nervioso (central y periférico) y órganos de los sentidos de Z-Anatomy, ajustados al cuerpo de
Anato3D con el mismo ajuste que el esqueleto (ver anato3d_fit.py).

Uso (desde la raíz del proyecto):
  /Applications/Blender.app/Contents/MacOS/Blender -b --disable-autoexec \
    sources/z-anatomy/extracted/Z-Anatomy/Startup.blend \
    --python tools/build_nervous.py -- [--budget 220000] [--only "vagus,cerebellum"]

Subsistemas: cns (encéfalo, médula y meninges), pns (nervios craneales, espinales y autónomos) y
special_senses (ojo y oído). Los nervios son curvas con grosor: su resolución se ajusta al calibre.
En el SNC, la corteza, la sustancia blanca del telencéfalo y las meninges forman la capa 1; el resto
(núcleos, tronco, ventrículos, fascículos) la capa 2, que se ve en «Encéfalo profundo».

Salida: build/male_nervous.blend, build/male_nervous.json y web/public/models/male-nervous.json.
"""
import bpy, os, re, sys, json, collections
sys.path.insert(0, os.path.dirname(__file__))
from anato3d_fit import (Fitter, Extractor, Groups, bonus_paths, es, la, sanitize, source_name, principled, save,
                         log, parse_args, male_only, MODEL)

opt = parse_args({'budget': 220000, 'only': None})

fitter = Fitter()
paths = bonus_paths()
col = bpy.data.collections['7: Nervous system & Sense organs']

def clean(name):
    """Z-Anatomy marca algunas variantes con «*» y deja espacios sobrantes."""
    return re.sub(r'\*+', '', name).strip()

def nervous_path(name):
    ps = [p[1:] for p in paths[name] if p[0] == 'Nervous system']
    return max(ps, key=len) if ps else None

EYE_PARTS = ('cornea', 'lens', 'vitreous', 'sclera', 'iris', 'retina', 'zonular', 'chamber of eyeball', 'segment of eyeball')
DEEP_PNS = ('intercostal', 'sympathetic', 'splanchnic', 'pudendal', 'genitofemoral', 'ilio', 'obturator', 'lumbar', 'sacral',
            'phrenic', 'vagus', 'root', 'cauda', 'ganglion', 'ganglia', 'plexus', 'trunk of brachial', 'division of',
            'cord of brachial', 'subclavian nerve', 'pectoral nerve', 'long thoracic', 'thoracodorsal', 'subscapular', 'quadratus femoris')

def classify(o, base):
    """→ (subsistema, tejido, capa) o None si no es una estructura que mostrar."""
    mat = o.active_material.name if o.active_material else None
    low = base.lower()
    path = nervous_path(o.name)
    if mat in (None, 'Text'): return None                                # ejes y líneas de referencia del ojo
    if path and path[0] == 'Sense organs' or any(k in low for k in EYE_PARTS) or low == 'auditory tube':
        return 'special_senses', 'sense', 1
    if mat.startswith('Nerve') or mat in ('Bone-4',) or (path and path[0] == 'Peripheral nervous system'):
        tissue = 'ganglion' if 'gangli' in low else 'nerve'
        cns = any(k in low for k in ('optic chiasm', 'optic tract', 'stria terminalis'))
        return ('cns', 'nerve', 2) if cns else ('pns', tissue, 1)
    if path and path[:2] == ('Central nervous system', 'Meninges'):
        if 'root' in low or 'cauda' in low or 'nerve' in low: return 'pns', 'nerve', 1
        if 'choroid' in low: return 'cns', 'csf', 2
        return 'cns', 'meninges', 1
    if mat == 'LCR': return 'cns', 'csf', 2
    if mat == 'Cerebellum': return 'cns', 'cerebellum', 1
    if any(k in low for k in ('medulla oblongata', 'pons', 'midbrain', 'peduncle', 'interpeduncular')): return 'cns', 'brainstem', 2
    if low == 'white matter of telencephalon': return 'cns', 'white_matter', 1
    if mat == 'White matter' or any(k in low for k in ('corpus callosum', 'commissure', 'fornix', 'tract', 'fasciculus', 'septum pellucidum')):
        return 'cns', 'white_matter', 2
    if mat.startswith('Nucleus') or any(k in low for k in ('horn of spinal', 'intermediate substance', 'nucleus')): return 'cns', 'nucleus', 2
    if any(k in low for k in ('gyrus', 'sulcus', 'sulci', 'lobule', 'insula', 'cuneus', 'pole', 'operculum', 'lobe')) or mat in (
            'Brain-Inner', 'Frontal lobe', 'Parietal lobe', 'Temporal lobe', 'Insula', 'Interlobar sulci', 'Brain'):
        return 'cns', 'cortex', 1
    return 'cns', 'nucleus', 2

FALLBACK = {'cns': ('Central nervous system', 'Spinal cord'), 'pns': ('Peripheral nervous system', 'Nerves'),
            'special_senses': ('Sense organs', 'Eye')}
items = []
for o in col.objects:
    if o.type not in ('MESH', 'CURVE') or o.name.startswith(('(', '?')) or '//' in o.name or o.name.endswith(('.j', '.g', '.t')): continue
    if male_only(o.name): continue
    base, side = source_name(o.name)
    base = clean(base)
    if opt['only'] and not any(k in base.lower() for k in opt['only']): continue
    cls = classify(o, base)
    if not cls: continue
    sub, tissue, layer = cls
    items.append({'obj': o, 'src': o.name, 'base': base, 'side': side, 'sub': sub, 'tissue': tissue, 'layer': layer,
                  'path': nervous_path(o.name) or FALLBACK[sub], 'mat': o.active_material.name})
log(f'{len(items)} estructuras:', dict(collections.Counter((it['sub'], it['tissue']) for it in items)))

# Resolución de los nervios según su calibre.
for it in items:
    o = it['obj']
    if o.type != 'CURVE': continue
    radius = o.data.bevel_depth * max((p.radius for s in o.data.splines for p in s.bezier_points), default=1)
    o.data.bevel_resolution = 2 if radius > 0.003 else 1
    o.data.resolution_u = 6 if radius > 0.003 else 4

# Los ojos, la cóclea y los núcleos pequeños de Z-Anatomy dependen de su Subsurf (sin él salen facetados).
# Reparto del presupuesto de caras: la corteza y el cerebelo se ven de cerca (con el 31 % se veían facetados); la
# sustancia blanca casi siempre queda oculta.
DETAIL = {'cortex': 3.0, 'cerebellum': 2.0, 'white_matter': 0.3}
ex = Extractor(fitter, [it['obj'] for it in items], opt['budget'], keep_subsurf_below=2000)
MATS = {
    'cortex': principled('MAT_Cortex', (0.62, 0.36, 0.33), 0.55, coat=0.2),
    'cerebellum': principled('MAT_Cerebellum', (0.58, 0.33, 0.31), 0.55, coat=0.2),
    'brainstem': principled('MAT_Brainstem', (0.70, 0.55, 0.47), 0.5, coat=0.2),
    'white_matter': principled('MAT_White_Matter', (0.80, 0.74, 0.62), 0.5, coat=0.2),
    'nucleus': principled('MAT_Gray_Nucleus', (0.50, 0.32, 0.36), 0.5, coat=0.2),
    'csf': principled('MAT_CSF', (0.30, 0.55, 0.85), 0.2, coat=0.6, alpha=0.65),
    'meninges': principled('MAT_Meninges', (0.80, 0.76, 0.66), 0.45, coat=0.3, alpha=0.55),
    'nerve': principled('MAT_Nerve', (0.86, 0.66, 0.16), 0.4, coat=0.4),
    'ganglion': principled('MAT_Ganglion', (0.78, 0.55, 0.12), 0.45, coat=0.3),
}
SENSE = {  # material de Z-Anatomy → material propio para las partes del ojo y del oído
    'Cornea': principled('MAT_Cornea', (0.80, 0.88, 0.95), 0.05, coat=1.0, alpha=0.25),
    'Eye': principled('MAT_Sclera', (0.92, 0.90, 0.86), 0.35, coat=0.6),
    'Iris': principled('MAT_Iris', (0.30, 0.16, 0.08), 0.45),
    'Orbicularis/Constrictor': principled('MAT_Ciliary', (0.55, 0.25, 0.20), 0.5),
    'Mucosa': principled('MAT_Mucosa', (0.80, 0.42, 0.42), 0.4, coat=0.4),
    'Cartilage': principled('MAT_Sense_Cartilage', (0.62, 0.70, 0.80), 0.45, coat=0.4),
    'Ligament': principled('MAT_Sense_Ligament', (0.85, 0.83, 0.78), 0.4),
    'Bone-1': principled('MAT_Labyrinth', (0.85, 0.80, 0.68), 0.45),
    'Gland': principled('MAT_Lacrimal_Gland', (0.75, 0.50, 0.40), 0.5),
}
SENSE_DEFAULT = principled('MAT_Sense', (0.85, 0.80, 0.75), 0.4)
NAMES_ES = {'Central nervous system': 'Sistema nervioso central', 'Peripheral nervous system': 'Sistema nervioso periférico',
            'Sense organs': 'Órganos de los sentidos', 'Eye': 'Ojo', 'Ear': 'Oído', 'Nerves': 'Nervios',
            'Automatic division of peripheral nervous system': 'Sistema nervioso autónomo', 'Neo-cortex': 'Neocorteza',
            'Dura': 'Duramadre', 'Pia': 'Piamadre', 'Interlobular sulci': 'Surcos interlobulares',
            'Inferior parietal lobe': 'Lobulillo parietal inferior', 'Projection fibers of telencephalon': 'Fibras de proyección del telencéfalo',
            'Fornix': 'Fórnix', 'Septum pellucidum': 'Septo pelúcido', 'Anterior rami of thoracic nerves': 'Ramos anteriores de los nervios torácicos',
            'Lacrimal canliculus': 'Canalículo lagrimal'}
# Estructuras que faltan en la traducción oficial (clave: nombre inglés con «_»); se completan tras revisar el registro.
PARTS_ES = {
    'Anterior_occipital_sulcus': 'Surco occipital anterior', 'Central_canal': 'Conducto central de la médula',
    'Cingulate_gyrus_Posteroventral_part': 'Giro del cíngulo (parte posteroventral)',
    'Cingulate_gyrus_and_sulcus_Middle_anterior_part': 'Giro y surco del cíngulo (parte media anterior)',
    'Cingulate_gyrus_and_sulcus_Middle_posterior_part': 'Giro y surco del cíngulo (parte media posterior)',
    'Cingulate_gyrus_and_sulcus_Posterior_dorsal_part': 'Giro y surco del cíngulo (parte dorsal posterior)',
    'Cingulate_sulcus_Marginal_part': 'Surco del cíngulo (parte marginal)',
    'Inferior_occipital_gyrus_and_sulcus': 'Giro y surco occipitales inferiores',
    'Insula_Subcentral_gyrus_and_ant_and_post_sulci': 'Ínsula (giro subcentral y surcos anterior y posterior)',
    'Lat_Fis_ant_Horizont': 'Rama horizontal anterior del surco lateral', 'Lat_Fis_ant_Vertical': 'Rama ascendente anterior del surco lateral',
    'Lat_Fis_post': 'Rama posterior del surco lateral', 'Lateral_occipital_gyrus_Middle_occipital_gyrus': 'Giro occipital lateral (giro occipital medio)',
    'Lunate_sulcus': 'Surco semilunar', 'Medial_occipitotemporal_gyrus_Parahippocampal': 'Giro occipitotemporal medial (parahipocampal)',
    'Occipitotemporal_sulcus_Lateral_part': 'Surco occipitotemporal (parte lateral)',
    'Orbital_gyri_Frontomarginal_gyrus_and_sulcus': 'Giros orbitarios (giro y surco frontomarginales)',
    'Orbital_part_of_inferior_frontal_gyrus': 'Porción orbitaria del giro frontal inferior',
    'Orbital_sulci_H_shaped_orbital_sulci': 'Surcos orbitarios (en forma de H)', 'Orbital_sulci_Lateral_Orbital_sulcus': 'Surco orbitario lateral',
    'Paracentral_gyrus_and_sulcus': 'Giro y surco paracentrales', 'Posterior_transverse_collateral_sulcus': 'Surco colateral transverso posterior',
    'Precentral_sulcus_Superior_part': 'Surco precentral (parte superior)', 'Precentral_sulcus_inferior_part': 'Surco precentral (parte inferior)',
    'Straight_gyrus_Gyrus_rectus': 'Giro recto', 'Sulcus_interm_prim_Jensen': 'Surco intermedio primario (de Jensen)',
    'Superior_temporal_gyrus_Lateral_part': 'Giro temporal superior (parte lateral)',
}

groups = Groups('Nervous_System', NAMES_ES)
stats = []
for n, it in enumerate(items):
    o = it['obj']
    low = it['base'].lower()
    name = sanitize(it['base']) + (f'_{it["side"]}' if it['side'] else '')
    # Solo los nervios periféricos superficiales (cutáneos, de los miembros) se corrigen por la piel.
    near_skin = it['sub'] == 'pns' and not any(k in low for k in DEEP_PNS) and it['path'][1] != 'Cranial nerves'
    # En la mujer, la rama genital del genitofemoral (al labio mayor) y la anterior del obturador quedan bajo la piel: en el
    # hombre la primera va al escroto (la cubre su piel).
    near_skin = near_skin or (MODEL == 'female' and ('genital branch of genitofemoral' in low or 'anterior branch of obturator' in low))
    # La sustancia blanca casi siempre queda oculta bajo la corteza: se reduce más.
    obj, moved, worst = ex.fit(o, name, skin_offset=0.002 if near_skin else None,
                               detail=DETAIL.get(it['tissue'], 1.0),
                               # El encéfalo nunca está dentro de un hueso (sí la cóclea o los nervios en sus conductos).
                               out_of_bone=it['tissue'] in ('cortex', 'cerebellum', 'white_matter', 'brainstem', 'meninges'))
    obj.data.materials.append(SENSE.get(it['mat'], SENSE_DEFAULT) if it['tissue'] == 'sense' else MATS[it['tissue']])
    obj['anato3d_id'] = 'nervous_' + name.lower()
    obj['system'] = 'nervous'
    obj['subsystem'] = it['sub']
    obj['tissue'] = it['tissue']
    obj['layer'] = it['layer']
    obj['name_en'] = it['base']
    obj['name_la'] = la(it['base']) or ''
    obj['name_es'] = es(it['base']) or PARTS_ES.get(sanitize(it['base'])) or ''
    obj['region'] = json.dumps([sanitize(re.sub(r"['*]+$", '', g)) for g in it['path']])
    obj['source'] = f'Z-Anatomy object "{it['src']}" (BodyParts3D, DBCLS) CC BY-SA 4.0; refitted to the Anato3D skin'
    groups.collection(it['path']).objects.link(obj)
    stats.append({'name': name, 'sub': it['sub'], 'tissue': it['tissue'], 'faces': len(obj.data.polygons),
                  'moved_out_of_skin': moved, 'verts': len(obj.data.vertices), 'worst_mm': round(worst * 1000, 1),
                  'name_es': obj['name_es']})
    if n % 100 == 0: log(f'  {n}/{len(items)} {name}: {len(obj.data.polygons)} caras, {moved}/{len(obj.data.vertices)} vértices corregidos por la piel')

save('male_nervous', groups, stats, {'subsystems': dict(collections.Counter(s['sub'] for s in stats))})
