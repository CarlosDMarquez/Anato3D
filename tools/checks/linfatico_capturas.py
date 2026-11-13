"""Capturas del sistema linfático para revisarlo a ojo (hito 9). Renderiza con Workbench, fondo oscuro y colores por
material, lo construido en build/ junto a la Fase 2: huesos, ganglios (y vasos linfáticos si los hay), venas y arterias,
y en algunas vistas músculos de referencia.

Uso (desde la raíz del proyecto):
  A3D_MODEL=male /Applications/Blender.app/Contents/MacOS/Blender -b --disable-autoexec Anato3D_Male_30_Fase2.blend \
    --python-exit-code 1 --python tools/checks/linfatico_capturas.py -- [--out build/linfatico/capturas] [--views a,b]
    [--lymph otro.blend Coleccion]
Escribe <out>/<modelo>_<vista>.png. Vistas: VIEWS (cuerpo de frente y de espalda, cuello izquierdo y derecho con la
yugular interna, cuello con el esternocleidomastoideo, axila, tórax posterior, abdomen, ingle y tres cuartos).
"""
import bpy, os, sys, re, math
import numpy as np
from mathutils import Vector

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
MODEL = os.environ.get('A3D_MODEL', 'male')
argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
arg = lambda k, d=None: argv[argv.index(k) + 1] if k in argv else d
OUT = os.path.join(ROOT, arg('--out', 'build/linfatico/capturas'))
WANT = arg('--views')
LYMPH = (argv[argv.index('--lymph') + 1], argv[argv.index('--lymph') + 2]) if '--lymph' in argv else \
    (os.path.join(ROOT, 'build', f'{MODEL}_lymphatic.blend'), 'Lymphatic_System')


def load(path, col):
    if not os.path.exists(path): print('falta', path); return None
    with bpy.data.libraries.load(path) as (src, dst): dst.collections = [col]
    c = dst.collections[0]; bpy.context.scene.collection.children.link(c)
    return c


cols = {'lymphatic': load(*LYMPH)}
for s, c in (('venous', 'Venous_System'), ('arterial', 'Arterial_System'), ('muscular', 'Muscular_System'),
             ('respiratory', 'Respiratory_System'), ('digestive', 'Digestive_System')):
    cols[s] = load(os.path.join(ROOT, 'build', f'{MODEL}_{s}.blend'), c)
bpy.context.view_layer.update()


def base_color(m):
    if m.use_nodes and 'Principled BSDF' in m.node_tree.nodes:
        return tuple(m.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value)
    return tuple(m.diffuse_color)


for m in bpy.data.materials:
    c = base_color(m)
    m.diffuse_color = (c[0], c[1], c[2], 1.0)
# --resalta <patrón>: pinta de amarillo intenso las piezas del linfático cuyo nombre case (para revisar una pieza).
HL = arg('--resalta')
if HL:
    hl_mat = bpy.data.materials.new('cap_hl'); hl_mat.diffuse_color = (1.0, 0.85, 0.05, 1)
    for o in bpy.data.objects:
        if o.type == 'MESH' and o.get('system') == 'lymphatic' and re.search(HL, o.name):
            o.data.materials.clear(); o.data.materials.append(hl_mat)
bone_mat = bpy.data.materials.new('cap_bone'); bone_mat.diffuse_color = (0.55, 0.53, 0.48, 1)
ghost_mat = bpy.data.materials.new('cap_muscle'); ghost_mat.diffuse_color = (0.45, 0.16, 0.14, 1)
for o in bpy.data.objects:
    if o.type == 'MESH' and o.get('system') == 'skeletal':
        o.data.materials.clear(); o.data.materials.append(bone_mat)

scene = bpy.context.scene
scene.render.engine = 'BLENDER_WORKBENCH'
scene.display.shading.light = 'STUDIO'
scene.display.shading.color_type = 'MATERIAL'
scene.display.shading.show_cavity = True
scene.display.shading.cavity_type = 'WORLD'
scene.display.shading.show_shadows = False
scene.display.shading.show_specular_highlight = True
if scene.world is None: scene.world = bpy.data.worlds.new('W')
scene.world.color = (0.018, 0.02, 0.026)
scene.render.resolution_x, scene.render.resolution_y = 1400, 1400
scene.render.film_transparent = False
cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); scene.collection.objects.link(cam); scene.camera = cam
cam.data.type = 'ORTHO'; cam.data.clip_start = 0.001; cam.data.clip_end = 10


def objs(system=None):
    return [o for o in scene.objects if o.type == 'MESH' and (system is None or o.get('system') == system)]


def center_of(names):
    pts = []
    for o in scene.objects:
        if o.type == 'MESH' and o.name in names:
            pts += [o.matrix_world @ Vector(b) for b in o.bound_box]
    if not pts: return None
    P = np.array([p[:] for p in pts]); return (P.min(0) + P.max(0)) / 2


SPINE = re.compile(r'^(Vertebra|Sacrum|Coccyx|Hip_Bone|Os_Coxae|Ilium|Pubis|Ischium)', re.I)
NO_THORAX_WALL = lambda o: not re.match(r'^(Rib|Costal|Sternum|Scapula|Clavicle)', o.name)
# vista: (centro (m) o piezas para centrar, dirección de la cámara (hacia el objetivo), escala ortográfica (m), qué se ve)
S = 1.0 if MODEL == 'male' else -1.0
VIEWS = {
    'cuerpo_frente': ((0, 0, 1.0), (0, 1, 0), 1.9, {'bones': 'all', 'veins': 'major', 'arteries': None}),
    'cuerpo_espalda': ((0, 0, 1.0), (0, -1, 0), 1.9, {'bones': 'all', 'veins': 'major', 'arteries': None}),
    'tres_cuartos': ((0, 0, 1.05), (-0.6, 0.8, -0.1), 1.6, {'bones': 'all', 'veins': 'major', 'arteries': None}),
    'cuello_izq': (['Internal_jugular_vein_L'], (-1, 0, 0), 0.20, {'bones': 'all', 'veins': 'all', 'arteries': 'all'}),
    'cuello_der': (['Internal_jugular_vein_R'], (1, 0, 0), 0.20, {'bones': 'all', 'veins': 'all', 'arteries': 'all'}),
    'cuello_izq_3q': (['Internal_jugular_vein_L'], (-0.75, 0.62, -0.2), 0.20, {'bones': 'all', 'veins': 'all', 'arteries': 'all'}),
    'cuello_scm_izq': (['Internal_jugular_vein_L'], (-1, 0.15, 0), 0.20, {'bones': 'all', 'veins': 'all', 'arteries': None,
                                                                         'muscles': r'^Sternocleidomastoid|^Digastric|belly_of_digastric|Omohyoid'}),
    'cuello_frente': (['Internal_jugular_vein_L', 'Internal_jugular_vein_R'], (0, 1, 0.15), 0.22, {'bones': 'all', 'veins': 'all', 'arteries': 'all'}),
    'submenton': (['Anterior_belly_of_digastric_muscle_L', 'Anterior_belly_of_digastric_muscle_R'], (0, 0.35, 1), 0.16,
                  {'bones': 'all', 'veins': 'all', 'arteries': None, 'muscles': r'belly_of_digastric|^Mylohyoid'}),
    'retrofaringe': (['Longus_capitis_muscle_L', 'Longus_capitis_muscle_R'], (-1, 0, 0), 0.16,
                     {'bones': 'spine', 'veins': None, 'arteries': 'all', 'muscles': r'^Longus_(capitis|colli)|pharyngeal_constrictor',
                      'organs': r'pharynx'}),
    'axila_izq': (['Axillary_vein_L'], (-0.5, 0.7, 0.5), 0.26, {'bones': 'all', 'veins': 'all', 'arteries': 'all'}),
    'torax_posterior': (['Thoracic_aorta', 'Azygos_vein'], (0, -1, 0), 0.42, {'bones': 'spine', 'veins': 'all', 'arteries': 'all'}),
    # Vía central (conducto torácico, cisterna, troncos): mediastino desde la derecha y desde atrás con el esófago, ángulos
    # venosos de cerca.
    'mediastino_der': (['Thoracic_aorta', 'Azygos_vein'], (1, 0, 0), 0.46, {'bones': 'spine', 'veins': 'all', 'arteries': 'all',
                                                                            'organs': r'^Oesophagus$'}),
    'mediastino_post': (['Thoracic_aorta', 'Azygos_vein'], (0, -1, 0), 0.46, {'bones': None, 'veins': 'all', 'arteries': 'all',
                                                                              'organs': r'^Oesophagus$'}),
    'angulo_venoso_izq': (['Left_subclavian_vein', 'Internal_jugular_vein_L'], (-0.35, 0.85, -0.25), 0.13,
                          {'bones': 'spine', 'veins': 'all', 'arteries': 'all'}),
    'angulo_venoso_der': (['Right_subclavian_vein', 'Internal_jugular_vein_R'], (0.35, 0.85, -0.25), 0.13,
                          {'bones': 'spine', 'veins': 'all', 'arteries': 'all'}),
    'cisterna': (['Abdominal_aorta'], (-0.5, -0.85, 0.1), 0.22, {'bones': 'spine', 'veins': 'major', 'arteries': 'all'}),
    'torax_frente': (['Thoracic_aorta', 'Aortic_arch'], (0, 1, 0), 0.42, {'bones': 'nowall', 'veins': 'all', 'arteries': 'all'}),
    'abdomen': (['Abdominal_aorta', 'Inferior_vena_cava_abdominal_part'], (0, 1, 0), 0.40, {'bones': 'spine', 'veins': 'major', 'arteries': 'all'}),
    'abdomen_lado': (['Abdominal_aorta', 'Inferior_vena_cava_abdominal_part'], (-1, 0.3, 0), 0.40, {'bones': 'spine', 'veins': 'major', 'arteries': 'all'}),
    'pelvis': (['Common_iliac_artery_L', 'Common_iliac_artery_R'], (0, 0.8, -0.6), 0.36, {'bones': 'all', 'veins': 'all', 'arteries': 'all'}),
    'ingle_izq': (['Femoral_vein_L'], (-0.3, 1, 0), 0.24, {'bones': 'all', 'veins': 'all', 'arteries': 'all', 'zmin': 0.72}),
    'popliteo_izq': (['Popliteal_vein_L'], (-0.2, -1, 0), 0.24, {'bones': 'all', 'veins': 'all', 'arteries': 'all'}),
    'codo_izq': (['Basilic_vein_L'], (-0.4, 0.9, 0), 0.24, {'bones': 'all', 'veins': 'all', 'arteries': 'all', 'zmin': 0.95, 'zmax': 1.25}),
    # Vasos linfáticos generados (segunda parte del hito 9): centradas en las piezas nuevas.
    'cisterna_der': (['Cisterna_chyli'], (1, 0.45, 0.05), 0.20, {'bones': 'spine', 'veins': 'major', 'arteries': 'major'}),
    'via_central_frente': (['Thoracic_duct'], (0, 1, 0), 0.62, {'bones': None, 'veins': 'major', 'arteries': 'major'}),
    'via_central_der': (['Thoracic_duct'], (1, 0, 0), 0.62, {'bones': 'spine', 'veins': 'major', 'arteries': 'major'}),
    'ingle_frente_izq': (['Superomedial_superficial_inguinal_nodes_L', 'Proximal_deep_inguinal_node_L'], (-0.3, 1, 0), 0.22,
                         {'bones': 'all', 'veins': 'all', 'arteries': None}),
    'cuerpo_frente_linf': ((0, 0, 1.0), (0, 1, 0), 1.9, {'bones': None, 'veins': None, 'arteries': None}),
}
# Con --comp <comprobaciones-<modelo>.json> (build_vessels), las vistas de los ángulos venosos se centran en el ángulo medido.
COMP = arg('--comp')
if COMP and os.path.exists(COMP):
    import json
    ang = json.load(open(COMP)).get('angulos_venosos', {})
    for side, key in (('L', 'angulo_venoso_izq'), ('R', 'angulo_venoso_der')):
        if side in ang:
            c, d, sc, spec = VIEWS[key]; VIEWS[key] = (ang[side]['punto_m'], d, 0.10, spec)


def show(o, spec):
    s = o.get('system')
    if s == 'lymphatic': return True
    if s == 'skeletal':
        b = spec.get('bones')
        return b == 'all' or (b == 'spine' and bool(SPINE.search(o.name))) or (b == 'nowall' and NO_THORAX_WALL(o))
    if s == 'venous': return spec.get('veins') == 'all' or (spec.get('veins') == 'major' and o.get('major'))
    if s == 'arterial': return spec.get('arteries') == 'all' or (spec.get('arteries') == 'major' and o.get('major'))
    if s == 'muscular' and spec.get('muscles'): return bool(re.search(spec['muscles'], o.name))
    if s in ('respiratory', 'digestive') and spec.get('organs'): return bool(re.search(spec['organs'], o.name, re.I))
    return False


os.makedirs(OUT, exist_ok=True)
for name, (ctr, d, scale, spec) in VIEWS.items():
    if WANT and name not in WANT.split(','): continue
    c = np.array(ctr, float) if not isinstance(ctr, list) or not isinstance(ctr[0], str) else center_of(ctr)
    if c is None: print('sin centro', name); continue
    for o in scene.objects:
        if o.type != 'MESH': continue
        vis = show(o, spec)
        if vis and ('zmin' in spec or 'zmax' in spec):
            z = (o.matrix_world @ Vector(o.bound_box[0])).z, (o.matrix_world @ Vector(o.bound_box[6])).z
            if max(z) < spec.get('zmin', -9) or min(z) > spec.get('zmax', 9): vis = False
        o.hide_render = not vis
    d = Vector(d).normalized()
    cam.location = Vector(c) - d * 3.0
    cam.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    cam.data.ortho_scale = scale
    scene.render.filepath = os.path.join(OUT, f'{MODEL}_{name}.png')
    bpy.ops.render.render(write_still=True)
    print('captura', scene.render.filepath)
