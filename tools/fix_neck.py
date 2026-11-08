"""Corrige la morfología de la Fase 2 (piel de MakeHuman con los huesos de Z-Anatomy ajustados a ella) y la reexporta.

El cuello quedó un 23 % más largo que el de referencia anatómica (Z-Anatomy), con las vértebras C3–C6 deformadas; la
rodilla, a media pierna (tibia un 24 % más larga que la real), y el codo, 3,6 cm alto (húmero un 13 % más corto).

Qué hace:
  1. Las vértebras C1–C7 se rehacen con la forma de Z-Anatomy (escala uniforme y un solo giro para todo el cuello,
     el que mejor sigue al ajuste anterior) y se apilan desde C7 con la separación vertical real de Z-Anatomy,
     conservando la curvatura.
  2. La cabeza (cráneo, mandíbula, dientes, ojos) baja en vertical, de forma rígida, lo mismo que baja C1.
  3. La piel del cuello se acorta con una transición suave entre la base del cuello y la línea
     mandíbula–occipucio, sin mover hombros ni clavículas.
  3a. Extremidades con las proporciones de Z-Anatomy (tools/proportions.py): la rodilla baja ~4,7 cm y el codo ~3,3 cm;
     huesos largos por tramos (cada tramo, afín) y piel con el mismo campo, suavizado.
  3a2. Hombros (tools/proportions.py): la clavícula gira sobre el esternón hasta subir el acromion 8 mm, la escápula la
     sigue y el brazo se separa 3° del tronco; la piel, con ellos.
  3b–c. La piel se subdivide y se infla donde un hueso queda a menos de 3–5 mm (mandíbula, C5–C7, tibia…), con
     abultamientos anchos y unidos (sin bultos sueltos ni surcos entre ellos); la nuca se alisa.
  3c2–3. La piel se infla sobre el deltoides de Z-Anatomy, y la complexión musculosa (tools/musculature.py) engrosa
     hombros, brazos y tórax; el campo en el volumen queda en Anato3D_Male_30_Fase2_musculature.npz.
  4. Lo mismo para la piel femenina (misma malla base de MakeHuman), escalado a su estatura; el esqueleto masculino se
     lleva a ella (tools/female.py) y la pelvis toma la forma femenina (tools/female_pelvis.py; el campo para los demás
     tejidos queda en Anato3D_Female_30_Fase2_pelvis.npz). La región de la vulva se guarda en la piel (atributo «vulva»)
     y, al exportar, se recorta de ella y queda aparte («Skin_Vulva_Smooth»): la vulva de build_female_skin.py la sustituye.
  3e. Las piezas del esqueleto del revés (las izquierdas y el vómer) se ponen del derecho, con su AO bien horneado
     (tools/huesos_invertidos.py).
  5. Al exportar, la piel se divide en zonas (tools/skin_regions.py: cuero cabelludo, cara, párpados, nariz, labios,
     orejas, cuello, hombros, brazos, manos, tronco, piernas…) para que la web pueda seleccionar cada una. Las Fase 2
     guardan la piel entera.

Guarda una copia de los originales en sources/originals/ la primera vez.

Uso (desde la raíz del proyecto):
  /Applications/Blender.app/Contents/MacOS/Blender -b --disable-autoexec --python tools/fix_neck.py
"""
import bpy, bmesh, os, re, sys, shutil
from mathutils import Vector, kdtree, bvhtree
sys.path.insert(0, os.path.dirname(__file__))
from skin_tone import male_layers, female_layers, apply_layers
import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
WEB = os.environ.get('A3D_WEB_MODELS') or os.path.join(ROOT, 'web/public/models')   # build_all.sh base: preparación
ZA = os.path.join(ROOT, 'sources/z-anatomy/extracted/Z-Anatomy/Startup.blend')
MALE = 'Anato3D_Male_30_Fase2'
FEMALE = 'Anato3D_Female_30_Fase1'
ORIG = os.path.join(ROOT, 'sources/originals')
CERVICAL = ['Vertebra_C1_Atlas', 'Vertebra_C2_Axis', 'Vertebra_C3', 'Vertebra_C4', 'Vertebra_C5', 'Vertebra_C6', 'Vertebra_C7']

# Copia de seguridad de los modelos originales.
os.makedirs(ORIG, exist_ok=True)
for name in (f'{MALE}.blend', f'{MALE}_draco.glb', f'{FEMALE}.blend', f'{FEMALE}.glb'):
    dst = os.path.join(ORIG, name)
    if not os.path.exists(dst): shutil.copy2(os.path.join(ROOT, name), dst)

def world(o):
    m = np.array(o.matrix_world)
    co = np.empty(len(o.data.vertices) * 3); o.data.vertices.foreach_get('co', co)
    return co.reshape(-1, 3) @ m[:3, :3].T + m[:3, 3]

def set_world(o, W):
    inv = np.linalg.inv(np.array(o.matrix_world))
    new = W @ inv[:3, :3].T + inv[:3, 3]
    # La piel de MakeHuman tiene shape keys (Basis, Obesity) y el exportador glTF usa la Basis: hay que mover
    # también cada shape key, o el GLB conserva la forma anterior (pasó hasta el 2026-10-26: el cuello corregido
    # no llegaba a la app y la mandíbula asomaba bajo el mentón).
    if o.data.shape_keys:
        old = np.empty(len(o.data.vertices) * 3); o.data.vertices.foreach_get('co', old)
        delta = new - old.reshape(-1, 3)
        for kb in o.data.shape_keys.key_blocks:
            k = np.empty(len(kb.data) * 3); kb.data.foreach_get('co', k)
            kb.data.foreach_set('co', (k.reshape(-1, 3) + delta).ravel())
    o.data.vertices.foreach_set('co', new.ravel())
    o.data.update()

def smooth(t):
    t = np.clip(t, 0, 1)
    return t * t * (3 - 2 * t)

def skin_weights(P):
    """Peso 0→1 entre la base del cuello y la línea mandíbula–occipucio (Z arriba, delante = −Y)."""
    u = np.clip((P[:, 1] + 0.10) / 0.14, 0, 1)                 # 0 delante (y=−0,10) … 1 detrás (y=+0,04)
    base = 1.405 + u * 0.050                                   # escotadura yugular … C7
    head = 1.505 + u * 0.060                                   # borde inferior de la mandíbula … base del cráneo
    st = smooth((P[:, 2] - base) / (head - base))
    lat = 1 - smooth((np.abs(P[:, 0]) - 0.07) / 0.05)          # el cuello mide ±6 cm; los hombros no se tocan
    return st * (lat + (1 - lat) * st)

def export(glb_paths, collection):
    vl = bpy.context.view_layer
    vl.active_layer_collection = vl.layer_collection.children[collection]
    for path in glb_paths:
        bpy.ops.export_scene.gltf(
            filepath=path, export_format='GLB', use_active_collection=True, use_active_collection_with_nested=True,
            export_extras=True, export_yup=True, export_apply=False, export_hierarchy_full_collections=True,
            export_vertex_color='ACTIVE',
            # WebP (EXT_texture_webp, que three.js carga): las texturas de los huesos pasaban de 10,7 MB en JPEG; el
            # modelo baja de 14,8 a 11,2 MB con la misma calidad aparente.
            export_image_format='WEBP', export_image_quality=80,
            export_draco_mesh_compression_enable=True, export_draco_mesh_compression_level=7,
            export_draco_position_quantization=14, export_draco_normal_quantization=10)
        print('exportado', path)

# ── Modelo masculino (Fase 2) ───────────────────────────────────────────────
bpy.ops.wm.open_mainfile(filepath=os.path.join(ORIG, f'{MALE}.blend'), load_ui=False)
objs = {o.name: o for o in bpy.data.objects}

# 0. Esqueleto simétrico. La piel de MakeHuman lo es (0,1 mm de media), pero en la Fase 2 el tórax (vértebras C7–L1,
#    esternón, costillas, clavículas, escápulas) quedó 3–3,5 mm a la izquierda y el húmero izquierdo un 7–9 % más
#    grueso que el derecho: los músculos del brazo izquierdo salían de la piel y se aplastaban contra ella (cabeza
#    lateral del tríceps: 28 % de sus vértices corregidos, frente al 4 % del derecho). Cada pareja izquierda/derecha
#    se sustituye por la media de una y el espejo de la otra (Z-Anatomy las tiene en espejo vértice a vértice, así
#    que la media sigue siendo una transformación afín de Z-Anatomy); los huesos de la línea media se centran.
MIRROR = np.array([-1.0, 1.0, 1.0])
def symmetrize():
    pairs, moved = 0, 0
    for name, o in objs.items():
        if o.type != 'MESH' or o.get('system') != 'skeletal': continue
        if name.endswith('_L') and name[:-2] + '_R' in objs:
            r = objs[name[:-2] + '_R']; L = world(o); R = world(r) * MIRROR
            if len(L) == len(R) and np.linalg.norm(L - R, axis=1).max() < 0.02:
                A = (L + R) / 2                                 # correspondencia vértice a vértice
            else:
                A = L + ((L.mean(0) + R.mean(0)) / 2 - L.mean(0))   # solo se igualan los centros
                set_world(r, (world(r) * MIRROR + (A.mean(0) - R.mean(0))) * MIRROR); set_world(o, A); pairs += 1
                continue
            set_world(o, A); set_world(r, A * MIRROR); pairs += 1
        elif not name.endswith(('_L', '_R')):
            W = world(o); dx = (W[:, 0].min() + W[:, 0].max()) / 2
            if abs(dx) > 1e-4: set_world(o, W - np.array([dx, 0, 0])); moved += 1
    for name, o in objs.items():                               # marcas de las articulaciones, también en espejo
        if o.type == 'EMPTY' and name.startswith('Landmark_Left_') and name.replace('Left', 'Right') in objs:
            r = objs[name.replace('Left', 'Right')]
            a = (np.array(o.matrix_world.translation) + np.array(r.matrix_world.translation) * MIRROR) / 2
            o.location = o.location + Vector(a - np.array(o.matrix_world.translation))
            r.location = r.location + Vector(a * MIRROR - np.array(r.matrix_world.translation))
    print(f'simetría: {pairs} parejas de huesos promediadas con su espejo, {moved} huesos de la línea media centrados')
symmetrize()
za_names ={k: re.search(r'Z-Anatomy object "(.+?)"', objs[k]['source']).group(1) for k in CERVICAL}
with bpy.data.libraries.load(ZA) as (src, dst):
    dst.objects = list(za_names.values())
za = dict(zip(za_names.keys(), dst.objects))
tmp = bpy.data.collections.new('za_tmp'); bpy.context.scene.collection.children.link(tmp)
for o in za.values(): tmp.objects.link(o)
bpy.context.view_layer.update()

# 1. Vértebras cervicales con forma de Z-Anatomy, apiladas desde C7 con la separación de Z-Anatomy.
old_c = {k: world(objs[k]).mean(0) for k in CERVICAL}
za_c = {k: world(za[k]).mean(0) for k in CERVICAL}
# Solo cambia la altura: la curvatura (lordosis) y la línea media se mantienen como estaban.
new_c = {'Vertebra_C7': old_c['Vertebra_C7']}
for upper, lower in zip(CERVICAL[-2::-1], CERVICAL[:0:-1]):
    new_c[upper] = old_c[upper].copy()
    new_c[upper][2] = new_c[lower][2] + (za_c[upper][2] - za_c[lower][2])
# Un solo giro para todo el cuello (Procrustes de C1–C7 de Z-Anatomy sobre las del ajuste anterior, cada vértebra centrada
# en la suya): con el giro de cada una sacado de su ajuste anterior (deformado), C3–C5 y C7 quedaban unos 10° más
# inclinadas que C2 y C6, en zigzag, y C6 se apoyaba en C7 sin espacio para el disco (0,2 mm; en Z-Anatomy, 4 mm: el
# núcleo pulposo C6–C7 quedaba dentro de C7). Así los discos tienen la altura de Z-Anatomy (3–7 mm).
Pz = np.vstack([world(za[k]) - za_c[k] for k in CERVICAL]); Pa = np.vstack([world(objs[k]) - old_c[k] for k in CERVICAL])
U, S, Vt = np.linalg.svd(Pz.T @ Pa)
D = np.diag([1.0, 1.0, np.sign(np.linalg.det(U @ Vt))])
R = (U @ D @ Vt).T                                             # columna: a = R·z
spread = []
for k in CERVICAL:
    Z = world(za[k]); A = world(objs[k])
    M, *_ = np.linalg.lstsq(np.c_[Z, np.ones(len(Z))], A, rcond=None)
    U, S, Vt = np.linalg.svd(M[:3].T)
    s = float(np.prod(S) ** (1 / 3))                           # misma escala en todas direcciones
    Rk = U @ Vt
    spread.append(np.degrees(np.arccos(np.clip((np.trace(Rk.T @ R) - 1) / 2, -1, 1))))
    set_world(objs[k], s * (Z - za_c[k]) @ R.T + new_c[k])
print('cuello: un giro común; el de cada vértebra se separaba de él', ', '.join(f'{k[9:]} {d:.1f}°' for k, d in zip(CERVICAL, spread)))
head_shift = new_c['Vertebra_C1_Atlas'] - old_c['Vertebra_C1_Atlas']
print('desplazamiento de la cabeza (cm):', np.round(head_shift * 100, 2))
for o in za.values(): bpy.data.objects.remove(o)
bpy.data.collections.remove(tmp)

# 2. Cabeza rígida; el hioides (que cuelga en el cuello) sigue la proporción de su altura.
z7, z1 = old_c['Vertebra_C7'][2], old_c['Vertebra_C1_Atlas'][2]
skull = set()
def collect(col):
    for o in col.objects: skull.add(o.name)
    for ch in col.children: collect(ch)
collect(bpy.data.collections['Skull'])
for o in bpy.data.objects:
    if o.name in CERVICAL: continue
    if o.type == 'MESH' and (o.name in skull or o.name.endswith('Eyeball')) and o.name != 'Hyoid_Bone':
        set_world(o, world(o) + head_shift)
    elif o.name == 'Hyoid_Bone':
        set_world(o, world(o) + head_shift * np.clip((world(o).mean(0)[2] - z7) / (z1 - z7), 0, 1))
    elif o.type == 'EMPTY' and o.name.startswith('Landmark_'):
        w = skin_weights(np.array([o.matrix_world.translation]))[0]
        o.location = o.location + type(o.location)(head_shift * w)

# 3. Piel del cuello.
skin = objs['Skin_Body']
P = world(skin)
weights = skin_weights(P)
set_world(skin, P + weights[:, None] * head_shift)
male_height = P[:, 2].max() - P[:, 2].min()
print(f'piel: {int((weights > 0.01).sum())} vértices movidos; estatura {male_height:.3f} → {world(skin)[:, 2].max():.3f} m')

# 3a. Proporciones de las extremidades (tools/proportions.py): la rodilla baja ~4,7 cm y el codo ~3,3 cm, hasta las
#     proporciones de Z-Anatomy; cadera, tobillo, hombro y muñeca no se mueven. Los huesos largos se mueven por tramos
#     (diáfisis estirada o encogida, articulaciones en bloque) y la piel con el mismo campo, suavizado.
from proportions import plan, move_bones, skin_displacement
fields, report = plan(world, objs)
print('proporciones:', report)
SK = skin.data
skin_edges = np.empty(len(SK.edges) * 2, dtype=np.int64); SK.edges.foreach_get('vertices', skin_edges)
skin_edges = skin_edges.reshape(-1, 2)
crotch_z = bvhtree.BVHTree.FromPolygons(world(skin).tolist(), [p.vertices[:] for p in SK.polygons]).ray_cast(
    Vector((0, -0.03, 0.5)), Vector((0, 0, 1)))[0].z
bones = {o.name: o for o in bpy.data.objects if o.type == 'MESH' and o.get('system') == 'skeletal'}
limb_disp = skin_displacement(world(skin), skin_edges, bones, world, fields, crotch_z)
moved = move_bones(world, set_world, objs, fields)
set_world(skin, world(skin) + limb_disp)
for s, side in (('L', 'Left'), ('R', 'Right')):
    for joint, key in (('Knee', 'leg'), ('Elbow', 'arm')):
        lm = objs.get(f'Landmark_{side}_{joint}_Joint')
        if lm:
            p = np.array(lm.matrix_world.translation)
            lm.location = lm.location + type(lm.location)(fields[f'{key}_{s}'].displace(p[None])[0])
print(f'extremidades: {len(moved)} huesos reproporcionados; piel movida hasta {np.linalg.norm(limb_disp, axis=1).max() * 100:.1f} cm '
      f'(entrepierna a {crotch_z:.3f} m)')

# Para el modelo femenino (tools/female.py): piel y esqueleto masculinos en este punto, corregidos igual que la piel
# femenina y antes de lo que solo es del hombre (hombros, complexión musculosa), con su colección y la jerarquía.
MALE_SKIN_3A = world(skin)
MALE_BONES_3A = {n: (world(o), o.get('segments'), o.users_collection[0].name) for n, o in objs.items()
                 if o.type == 'MESH' and o.get('system') == 'skeletal'}
MALE_PARENT = {ch.name: c.name for c in bpy.data.collections for ch in c.children}

# 3a2. Hombros (tools/proportions.py): la clavícula gira sobre el esternón hasta subir el acromion 8 mm, la escápula la
#      sigue y el brazo se separa 3° del tronco, como en la imagen de referencia; la piel, con ellos.
from proportions import raise_shoulders
girdle_disp, girdle_moved, report = raise_shoulders(world, set_world, objs, world(skin), skin_edges)
set_world(skin, world(skin) + girdle_disp)
print(f'hombros: {len(girdle_moved)} huesos movidos; {report}; piel movida hasta {np.linalg.norm(girdle_disp, axis=1).max() * 100:.1f} cm')

# 3b. La mandíbula asomaba bajo el mentón ya en la Fase 2 original (hasta 12 mm); el hioides (hasta 6 mm) y la
#     apófisis espinosa de C6 (3,8 mm), tras acortar el cuello. Se infla la piel solo ahí, con caída suave, para dejar al menos SOFT de partes blandas.
#     Solo la superficie exterior: la cavidad de la boca de MakeHuman no se toca.
RADIUS = 0.015
def soften(need, rounds=4):
    """Une los abultamientos cercanos en uno solo, sin surco entre ellos (las apófisis espinosas de C7 y T1 dejaban dos
    bultos con un pliegue en medio), y suaviza su borde."""
    E = np.empty(len(skin.data.edges) * 2, dtype=np.int64); skin.data.edges.foreach_get('vertices', E); E = E.reshape(-1, 2)
    deg = np.maximum(np.bincount(E.ravel(), minlength=len(need)), 1)
    def avg(x):
        acc = np.zeros_like(x); np.add.at(acc, E[:, 0], x[E[:, 1]]); np.add.at(acc, E[:, 1], x[E[:, 0]])
        return acc / deg
    for _ in range(2 * rounds): need = np.maximum(need, 0.92 * avg(need))
    for _ in range(rounds): need = 0.5 * need + 0.5 * avg(need)
    return need

def cover(bone_names, soft=0.005, rounds=3, label='mandíbula e hioides'):
    for r in range(rounds):
        W = world(skin)
        polys = [p.vertices[:] for p in skin.data.polygons]
        T = bvhtree.BVHTree.FromPolygons(W.tolist(), polys)
        N = np.array([v.normal[:] for v in skin.data.vertices]) @ np.linalg.inv(np.array(skin.matrix_world)[:3, :3])
        N /= np.linalg.norm(N, axis=1)[:, None]
        # Exterior: el rayo según la normal no vuelve a tocar la piel antes de 3,5 cm (dentro de la boca sí lo hace;
        # bajo el mentón, el rayo hacia abajo acaba en el pecho, más lejos).
        external = np.array([T.ray_cast(Vector(w + n * 1e-4), Vector(n), 0.035)[0] is None for w, n in zip(W, N)])
        kd = kdtree.KDTree(len(W))
        for i, w in enumerate(W): kd.insert(w, i)
        kd.balance()
        need = np.zeros(len(W)); hits = 0; worst = {}
        for name in bone_names:
            for p in world(objs[name]):
                loc, nrm, f, _ = T.find_nearest(Vector(p))
                if loc is None or not all(external[i] for i in polys[f]): continue
                d = (Vector(p) - loc).dot(nrm) + soft
                if d <= 0: continue
                hits += 1
                if d > worst.get(name, (0,))[0]: worst[name] = (d, tuple(np.round(p * 100, 1)), tuple(np.round(np.array(loc) * 100, 1)))
                # Cuanto más asoma, más ancho el abultamiento (la apófisis espinosa de C7 dejaba un bulto puntiagudo);
                # la mandíbula no, que asoma hasta 17 mm y con un radio mayor el mentón se inflaba sin control.
                R = RADIUS if name in ('Mandible', 'Hyoid_Bone') else min(max(RADIUS, 3.5 * d), 0.025)
                for _, i, dist in kd.find_range(loc, R):
                    need[i] = max(need[i], d * (1 - smooth(dist / R)))
        print(f'{label}, ronda {r + 1}: {hits} vértices de hueso a menos de {soft * 1000:.0f} mm; '
              f'piel inflada hasta {need.max() * 1000:.1f} mm en {(need > 1e-4).sum()} vértices')
        if os.environ.get('A3D_DEBUG'): print('  peores:', {k: (round(v[0] * 1000, 1), v[1], v[2]) for k, v in sorted(worst.items(), key=lambda x: -x[1][0])[:25]})
        if not hits: break
        set_world(skin, W + N * soften(need)[:, None])
# 3c. Piel subdividida (Catmull-Clark, un nivel): la malla base de MakeHuman (13 380 vértices) está pensada para
#     subdividirse; sin ello se veían facetas en el contorno de la cabeza y los hombros. Las shape keys (Obesity) no
#     las usa la app y no dejan aplicar la subdivisión: se quitan.
def subdivide(o):
    o.shape_key_clear()
    m = o.modifiers.new('subdivision', 'SUBSURF'); m.levels = m.render_levels = 1; m.quality = 3
    dg = bpy.context.evaluated_depsgraph_get(); dg.update()
    me = bpy.data.meshes.new_from_object(o.evaluated_get(dg), depsgraph=dg)
    o.modifiers.clear(); old = o.data; o.data = me; me.name = old.name; bpy.data.meshes.remove(old)
    for f in me.polygons: f.use_smooth = True
    print(f'{o.name}: subdividida a {len(me.vertices)} vértices')
subdivide(skin)

# La apófisis espinosa de C6 también asomaba por la nuca (3,8 mm).
# Solo C5–C7: el atlas y el axis están tras la boca, y la pared del fondo de la cavidad bucal de MakeHuman pasaba por
# «exterior» (los labios no cierran del todo): se empujaba hasta 33 mm hacia delante.
NAPE = ['Vertebra_C5', 'Vertebra_C6', 'Vertebra_C7']
cover(['Mandible', 'Hyoid_Bone'] + NAPE)
# La nuca: los abultamientos sobre las apófisis espinosas de C6 y C7 dejaban un escalón entre ellos. Se alisa la zona
# (suavizado laplaciano con peso que se desvanece en los bordes) y se vuelve a cubrir el hueso.
def relax(mask, iterations=16):
    W = world(skin)
    E = np.empty(len(skin.data.edges) * 2, dtype=np.int64); skin.data.edges.foreach_get('vertices', E); E = E.reshape(-1, 2)
    deg = np.maximum(np.bincount(E.ravel(), minlength=len(W)), 1)[:, None]
    for _ in range(iterations):
        acc = np.zeros_like(W); np.add.at(acc, E[:, 0], W[E[:, 1]]); np.add.at(acc, E[:, 1], W[E[:, 0]])
        W = W + 0.5 * mask[:, None] * (acc / deg - W)
    set_world(skin, W)
W = world(skin)
nape = (smooth((W[:, 1] - 0.0) / 0.02) * smooth(1 - np.abs(W[:, 0]) / 0.07)
        * smooth((W[:, 2] - 1.36) / 0.03) * smooth((1.52 - W[:, 2]) / 0.03))
relax(nape)
cover(NAPE, label='nuca')
# Ningún hueso a menos de 3 mm de la piel (la subdivisión la retrae algo en las zonas convexas: nudillos, tibia…).
# Ni la cara más cercana con su normal ni la paridad de rayos bastan solas: para una costilla, la piel más cercana puede
# ser la cara interna del brazo, cuya normal apunta al tórax, y la daría por «fuera»; en los dedos, que se tocan entre
# sí, la paridad se equivoca y daba por fuera falanges que estaban dentro (la piel se inflaba 10 mm en anillos). Un
# punto de hueso solo está fuera si las dos pruebas lo dicen. Solo huesos a pocos milímetros de la piel; los de las
# cavidades de la boca y la nariz no cuentan.
DIRS = [Vector(d) for d in ((1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1))]
def inside_skin(T, p):
    odd = 0
    for d in DIRS:
        o, n = p, 0
        while n < 24:
            hit = T.ray_cast(o + d * 1e-5, d)[0]
            if hit is None: break
            n += 1; o = hit
        odd += n % 2
    return odd >= 4

def cover_close(bone_names, soft=0.003, reach=0.01, rounds=3):
    for r in range(rounds):
        W = world(skin)
        polys = [p.vertices[:] for p in skin.data.polygons]
        T = bvhtree.BVHTree.FromPolygons(W.tolist(), polys)
        N = np.array([v.normal[:] for v in skin.data.vertices]) @ np.linalg.inv(np.array(skin.matrix_world)[:3, :3])
        N /= np.linalg.norm(N, axis=1)[:, None]
        external = np.array([T.ray_cast(Vector(w + n * 1e-4), Vector(n), 0.035)[0] is None for w, n in zip(W, N)])
        kd = kdtree.KDTree(len(W))
        for i, w in enumerate(W): kd.insert(w, i)
        kd.balance()
        need = np.zeros(len(W)); hits = 0; worst = {}
        for name in bone_names:
            for p in world(objs[name]):
                P = Vector(p)
                loc, nrm, f, dist = T.find_nearest(P)
                if loc is None or dist > reach or not all(external[i] for i in polys[f]): continue
                d = soft - dist if (P - loc).dot(nrm) < 0 or inside_skin(T, P) else soft + dist
                if d <= 0: continue
                hits += 1; worst[name] = max(worst.get(name, 0), d)
                R = min(max(RADIUS, 3.5 * d), 0.025)
                for _, i, dd in kd.find_range(loc, R):
                    need[i] = max(need[i], d * (1 - smooth(dd / R)))
        print(f'huesos cerca de la piel, ronda {r + 1}: {hits} vértices a menos de {soft * 1000:.0f} mm; '
              f'piel inflada hasta {need.max() * 1000:.1f} mm en {(need > 1e-4).sum()} vértices')
        if os.environ.get('A3D_DEBUG'): print('  peores:', {k: round(v * 1000, 1) for k, v in sorted(worst.items(), key=lambda x: -x[1])[:15]})
        if not hits: break
        set_world(skin, W + N * soften(need)[:, None])

CAVITY = ('Maxilla', 'Palatine', 'Sphenoid', 'Vomer', 'Ethmoid', 'Inferior_Nasal_Concha', 'Lacrimal', 'Tooth', 'Mandible', 'Hyoid',
          'Vertebra_C1', 'Vertebra_C2', 'Vertebra_C3', 'Vertebra_C4')
cover_close([o.name for o in bpy.data.objects if o.type == 'MESH' and o.get('system') == 'skeletal'
             and not o.name.startswith(CAVITY)])

# 3c2. Hombro: el deltoides de Z-Anatomy (un cuerpo real) no cabe en el hombro de MakeHuman, más delgado por detrás. Su
#      porción espinal (posterior) asomaba hasta 21 mm y el ajuste la aplastaba contra la piel: salía plana, como un
#      escudo con el borde inferior en arista. Se ajusta el deltoides de Z-Anatomy a este esqueleto (el mismo ajuste
#      que en build_muscular.py) y la piel se infla sobre él con 3 mm de tejido subcutáneo, con caída suave.
SHOULDER = [f'{p} part of deltoid muscle.{s}' for p in ('Scapular spinal', 'Acromial', 'Clavicular') for s in 'lr']
def make_room(za_muscles, margin=0.003):
    sys.path.insert(0, os.path.dirname(__file__))
    from anato3d_fit import Fitter
    names = {re.search(r'Z-Anatomy object "(.+?)"', o['source']).group(1) for o in objs.values()
             if o.type == 'MESH' and o.get('system') == 'skeletal' and re.search(r'Z-Anatomy object "', o.get('source', ''))}
    with bpy.data.libraries.load(ZA) as (src, dst):
        dst.objects = sorted(names | set(za_muscles))
    tmp = bpy.data.collections.new('za_tmp'); bpy.context.scene.collection.children.link(tmp)
    for o in dst.objects:
        if o is not None: tmp.objects.link(o)
    bpy.context.view_layer.update()
    fitter = Fitter([o for o in objs.values() if o.type == 'MESH'])
    P = np.vstack([fitter.deform(world(bpy.data.objects[n])) for n in za_muscles])
    for o in list(tmp.objects): bpy.data.objects.remove(o)
    bpy.data.collections.remove(tmp)
    # Solo la piel del hombro y del brazo (su hueso más cercano es el húmero, la escápula o la clavícula): junto a la
    # axila, el deltoides tenía por piel más cercana la pared del tórax, y la inflaba hacia el brazo.
    verts, faces, owner = [], [], []
    for n, o in objs.items():
        if o.type != 'MESH' or o.get('system') != 'skeletal': continue
        B = world(o); base = len(verts); verts += B.tolist()
        faces += [[base + i for i in p.vertices] for p in o.data.polygons]
        owner += [n.startswith(('Humerus', 'Scapula', 'Clavicle'))] * len(o.data.polygons)
    BT = bvhtree.BVHTree.FromPolygons(verts, faces)
    W = world(skin)
    shoulder = np.array([owner[BT.find_nearest(Vector(w))[2]] for w in W])
    T = bvhtree.BVHTree.FromPolygons(W.tolist(), [p.vertices[:] for p in skin.data.polygons])
    N = np.array([v.normal[:] for v in skin.data.vertices]) @ np.linalg.inv(np.array(skin.matrix_world)[:3, :3])
    N /= np.linalg.norm(N, axis=1)[:, None]
    kd = kdtree.KDTree(len(W))
    for i, w in enumerate(W): kd.insert(w, i)
    kd.balance()
    need = np.zeros(len(W)); hits = 0; worst = 0.0
    for p in P:
        loc, nrm, _, _ = T.find_nearest(Vector(p))
        d = (Vector(p) - loc).dot(nrm) + margin
        if d <= 0 or not shoulder[kd.find(loc)[1]]: continue
        # Solo la cara posterior y lateral del hombro: en la bóveda de la axila (piel que mira arriba o abajo) el
        # deltoides no tiene que asomar y ahí no se infla.
        if not (nrm.y > 0.25 or abs(nrm.x) > 0.6) or abs(nrm.z) > 0.6: continue
        hits += 1; worst = max(worst, d)
        R = min(max(0.02, 4 * d), 0.05)
        n0 = np.array(nrm)
        for _, i, dd in kd.find_range(loc, R):
            if N[i] @ n0 < 0.5 or not shoulder[i]: continue      # ni la piel de enfrente (el tórax frente al brazo)
            need[i] = max(need[i], d * (1 - smooth(dd / R)))
    print(f'hombro: {hits} vértices del deltoides a menos de {margin * 1000:.0f} mm de la piel (hasta {worst * 1000:.1f} mm); '
          f'piel inflada hasta {need.max() * 1000:.1f} mm en {(need > 1e-4).sum()} vértices')
    if not hits: return
    # Dirección: las normales suavizadas sobre la malla. En el pliegue axilar posterior, que es cóncavo, las normales de
    # cada vértice convergen y la piel inflada hacía un saliente. Una sola pasada: una segunda perseguía puntos en los
    # pliegues de la piel recién inflada, junto a la axila.
    E = np.empty(len(skin.data.edges) * 2, dtype=np.int64); skin.data.edges.foreach_get('vertices', E); E = E.reshape(-1, 2)
    deg = np.maximum(np.bincount(E.ravel(), minlength=len(W)), 1)[:, None]
    Ns = N.copy()
    for _ in range(30):
        acc = np.zeros_like(Ns); np.add.at(acc, E[:, 0], Ns[E[:, 1]]); np.add.at(acc, E[:, 1], Ns[E[:, 0]])
        Ns = 0.5 * Ns + 0.5 * acc / deg
    Ns /= np.linalg.norm(Ns, axis=1)[:, None]
    set_world(skin, W + Ns * soften(need)[:, None])
make_room(SHOULDER)

# 3c3. Complexión musculosa (tools/musculature.py): hombros, brazos y tórax más llenos, como en los atlas. La piel de
#      MakeHuman es la de un hombre delgado; frente a una imagen de referencia, el brazo medía un ~20 % menos de ancho
#      y el trapecio apenas subía por el cuello. La piel sale según el grosor de partes blandas que tiene debajo, y el
#      campo en el volumen (Anato3D_Male_30_Fase2_musculature.npz) lleva con ella todo lo que ajusta anato3d_fit.py.
from musculature import bones_bvh, skin_target, Field
W = world(skin)
E = np.empty(len(skin.data.edges) * 2, dtype=np.int64); skin.data.edges.foreach_get('vertices', E); E = E.reshape(-1, 2)
N = np.array([v.normal[:] for v in skin.data.vertices]) @ np.linalg.inv(np.array(skin.matrix_world)[:3, :3])
N /= np.linalg.norm(N, axis=1)[:, None]
polys = [p.vertices[:] for p in skin.data.polygons]
BT, owner = bones_bvh({o.name: o for o in bpy.data.objects if o.type == 'MESH' and o.get('system') == 'skeletal'}, world)
bulk, report = skin_target(W, N, E, polys, BT, owner, world, objs)
print('complexión, piel:', report)
field = Field.solve(W, polys, bulk, BT)
print('complexión, campo:', field.report)
field.save(os.path.join(ROOT, f'{MALE}_musculature.npz'))
set_world(skin, W + bulk)

# 3d. Tono de la piel por vértice (tools/skin_tone.py): sin él, un solo color la hacía parecer un maniquí.
MALE_TONE = male_layers(skin, objs, world)
apply_layers(skin, MALE_TONE)

# 3e. Huesos del revés (tools/huesos_invertidos.py): las piezas izquierdas (el espejo de las derechas con las mismas caras) y
#     el vómer tenían las caras del revés y un AO horneado casi negro; el visor les daba la vuelta y les quitaba el AO. Se
#     copia a cada izquierda el AO de su pareja derecha, el del vómer se hornea de nuevo y se les da la vuelta a las caras.
#     El esqueleto femenino sale de esta Fase 2 y lo hereda.
import huesos_invertidos
print('huesos del revés: %d corregidos (%d con el AO de su pareja derecha; horneados de nuevo: %s)'
      % huesos_invertidos.fix(list(bpy.data.objects)))

bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT, f'{MALE}.blend'))
# 5. Zonas de la piel (tools/skin_regions.py): solo en lo exportado; la Fase 2 guarda la piel entera, que los sistemas
#    usan para saber qué queda dentro del cuerpo.
import skin_regions
skin_regions.split(skin, skin_regions.label(skin, {o.name: o for o in bpy.data.objects}))
export([os.path.join(ROOT, f'{MALE}_draco.glb'), os.path.join(WEB, 'male.glb')], 'Anato3D_Male_30')

# ── Modelo femenino (Fase 2): misma malla base, misma corrección a escala, y el esqueleto masculino transformado ──
FEMALE_OUT = 'Anato3D_Female_30_Fase2'
bpy.ops.wm.open_mainfile(filepath=os.path.join(ORIG, f'{FEMALE}.blend'), load_ui=False)
fskin = bpy.data.objects['Skin_Body']
F = world(fskin)
assert len(F) == len(P), 'la piel femenina no comparte la malla base de MakeHuman'
k = (F[:, 2].max() - F[:, 2].min()) / male_height
f_shift = head_shift * k
set_world(fskin, F + weights[:, None] * f_shift + limb_disp * k)  # mismos pesos y extremidades por vértice
for o in bpy.data.objects:
    if o.type == 'MESH' and o.name.endswith('Eyeball'):
        set_world(o, world(o) + f_shift)
    elif o.type == 'EMPTY' and o.name.startswith('Landmark_'):
        # Peso del vértice de piel más cercano: la referencia del hombre no vale para otra estatura.
        idx = int(np.argmin(np.linalg.norm(F - np.array(o.matrix_world.translation), axis=1)))
        o.location = o.location + type(o.location)(f_shift * weights[idx] + limb_disp[idx] * k)
print(f'piel femenina: desplazamiento de la cabeza {np.round(f_shift * 100, 2)} cm')

# Esqueleto femenino (tools/female.py): cada hueso masculino, con la transformación afín que mejor sigue al campo que
# convierte la piel masculina en la femenina.
from female import breastless, female_bone
fpolys = [p.vertices[:] for p in fskin.data.polygons]
D_bones, n_breast = breastless(world(fskin), MALE_SKIN_3A, fpolys)
mf_field = Field.solve(MALE_SKIN_3A, fpolys, D_bones, None, h=0.008, extend=True)
print(f'esqueleto femenino, campo (sin las mamas: {n_breast} vértices):', mf_field.report)
fem = {n: female_bone(mf_field, P, seg) for n, (P, seg, _) in MALE_BONES_3A.items()}
print('esqueleto femenino, mayor separación del campo (mm):',
      [(n, round(f[1] * 1000, 1)) for n, f in sorted(fem.items(), key=lambda x: -x[1][1])[:8]])
with bpy.data.libraries.load(os.path.join(ROOT, f'{MALE}.blend')) as (src, dst):
    dst.objects = [n for n in src.objects if n in MALE_BONES_3A]
def female_collection(name):
    """La colección con ese nombre en el archivo femenino, bajo su madre masculina. La piel femenina (Fase 1) ya traía
    colecciones del esqueleto con otra jerarquía (sin «Axial_Skeleton»: el cráneo, la columna y la caja torácica colgaban
    del sistema esquelético, y la capa «Axial» de la web salía vacía): se cuelgan como en el hombre."""
    if name == 'Anato3D_Male_30': return bpy.data.collections['Anato3D_Female_30']
    parent = female_collection(MALE_PARENT.get(name, 'Anato3D_Male_30'))
    col = bpy.data.collections.get(name)
    if col is None:
        col = bpy.data.collections.new(name)
        parent.children.link(col)
    elif col.name not in parent.children:
        for p in bpy.data.collections:
            if col.name in p.children: p.children.unlink(col)
        parent.children.link(col)
    return col
for o in dst.objects:
    female_collection(MALE_BONES_3A[o.name][2]).objects.link(o)
def empty_tree(c):
    return not c.objects and all(empty_tree(ch) for ch in c.children)
for c in list(bpy.data.collections['Skeletal_System'].children_recursive):
    if c.name not in MALE_PARENT and empty_tree(c):          # restos vacíos de la Fase 1 («Upper_Limb_Bones»…)
        bpy.data.collections.remove(c)
bpy.context.view_layer.update()                   # matrix_world de los objetos recién añadidos (el cráneo tiene ubicación)
for o in dst.objects:
    V, _, seg2 = fem[o.name]
    set_world(o, V)
    if seg2: o['segments'] = seg2
fbones = [o.name for o in dst.objects]
print(f'esqueleto femenino: {len(fbones)} huesos; estatura de la piel {world(fskin)[:, 2].max():.3f} m')
# Pelvis con forma femenina (tools/female_pelvis.py), con el campo para los demás tejidos.
from female_pelvis import reshape
pel_before, pel_after, pel_moved, pel_report = reshape({o.name: o for o in bpy.data.objects}, fskin, world, set_world,
                                                       os.path.join(ROOT, f'{FEMALE_OUT}_pelvis.npz'))
print('pelvis femenina, campo:', pel_report, '; huesos movidos hasta (mm):', {n: round(v * 1000, 1) for n, v in pel_moved.items()})
for key in pel_before:
    print(f'  {key}: {pel_before[key]:.1f} → {pel_after[key]:.1f}')
subdivide(fskin)
assert len(fskin.data.vertices) == len(MALE_TONE['pliegues'][0]), 'la piel femenina no comparte la topología subdividida'
# Ningún hueso a menos de 3 mm de la piel femenina, como en la masculina (las mismas funciones, sobre su piel).
skin, objs = fskin, {o.name: o for o in bpy.data.objects}
cover(['Mandible', 'Hyoid_Bone'] + NAPE)
cover_close([n for n in fbones if not n.startswith(CAVITY)])

# Boca femenina (2026-11-06). La piel femenina de MakeHuman tiene los labios entreabiertos: una rendija de hasta 2,6 mm
# (1,8 de media) por la que se veían los dientes; la masculina cierra casi del todo. Y al inflar la piel sobre la
# mandíbula (cover), bajo el labio inferior quedaba un pliegue con un corte horizontal que no está en la piel original.
#   - Labios: la rendija se mide con rayos desde delante (alto de cada lado, cada milímetro de ancho) y los vértices de
#     los labios a menos de 5 mm de ella se mueven en vertical hacia su línea media, con 0,15 mm de solape y caída suave;
#     solo la piel de los labios (hasta 12 mm por detrás de su cara anterior), no la cavidad de la boca.
#   - Pliegue: suavizado laplaciano con máscara en la piel de delante, entre el labio inferior y el mentón.
# Los dientes y la mandíbula no quedan más cerca de la piel que antes (comprobado con el prototipo).
def close_mouth(skin, over=0.00015, reach=0.005):
    W = world(skin)
    T = bvhtree.BVHTree.FromPolygons(W.tolist(), [p.vertices[:] for p in skin.data.polygons])
    face = W[(np.abs(W[:, 0]) < 0.03) & (W[:, 2] > W[:, 2].max() - 0.25)]
    tip = face[np.argmin(face[:, 1])]                                   # punta de la nariz
    def front_y(x, z):
        h = T.ray_cast(Vector((x, tip[1] - 0.06, z)), Vector((0, 1, 0)))[0]
        return h.y if h else np.nan
    zs = np.arange(tip[2] - 0.040, tip[2] - 0.020, 0.0001)
    xk, zu, zl = [], [], []
    for x in np.arange(-0.030, 0.0301, 0.001):
        ys = np.array([front_y(x, z) for z in zs])
        env = np.array([np.nanmin(ys[max(0, i - 15):i + 16]) for i in range(len(ys))])
        deep = np.where((ys - env) > 0.002)[0]                          # 2 mm más hondo que lo de alrededor
        if not len(deep): continue
        run = max(np.split(deep, np.where(np.diff(deep) > 1)[0] + 1), key=len)
        xk.append(x); zu.append(zs[run[-1]] + 0.00005); zl.append(zs[run[0]] - 0.00005)
    xk, zu, zl = map(np.array, (xk, zu, zl))
    mid, gap = (zu + zl) / 2, zu - zl
    idx = np.where((W[:, 0] > xk.min() - 0.004) & (W[:, 0] < xk.max() + 0.004)
                   & (np.abs(W[:, 2] - np.interp(W[:, 0], xk, mid)) < reach))[0]
    idx = idx[np.array([W[i, 1] - front_y(W[i, 0], W[i, 2]) < 0.012 for i in idx])]
    dz = W[idx, 2] - np.interp(W[idx, 0], xk, mid)
    half = np.interp(W[idx, 0], xk, gap, left=0, right=0) / 2 + over
    W[idx, 2] -= np.sign(dz) * np.minimum(np.abs(dz), half) * (1 - smooth((np.abs(dz) - half) / (reach - half)))
    print(f'boca: rendija de {xk.min() * 100:.1f} a {xk.max() * 100:.1f} cm, hasta {gap.max() * 1000:.1f} mm '
          f'({gap.mean() * 1000:.1f} de media); {len(idx)} vértices de los labios cerrados')
    # Pliegue bajo el labio inferior (4,8 cm por debajo de la punta de la nariz).
    zf = tip[2] - 0.048
    box = np.where((np.abs(W[:, 0]) < 0.034) & (np.abs(W[:, 2] - zf) < 0.012))[0]
    box = box[np.array([W[i, 1] - front_y(W[i, 0], W[i, 2]) < 0.007 for i in box])]
    mask = np.zeros(len(W))
    mask[box] = (1 - smooth((np.abs(W[box, 2] - zf) - 0.004) / 0.008)) * (1 - smooth((np.abs(W[box, 0]) - 0.024) / 0.010))
    E = np.empty(len(skin.data.edges) * 2, dtype=np.int64); skin.data.edges.foreach_get('vertices', E); E = E.reshape(-1, 2)
    deg = np.maximum(np.bincount(E.ravel(), minlength=len(W)), 1)[:, None]
    W0 = W.copy()
    for _ in range(24):
        acc = np.zeros_like(W); np.add.at(acc, E[:, 0], W[E[:, 1]]); np.add.at(acc, E[:, 1], W[E[:, 0]])
        W = W + 0.5 * mask[:, None] * (acc / deg - W)
    print(f'boca: pliegue bajo el labio alisado en {(mask > 0.01).sum()} vértices (hasta {np.linalg.norm(W - W0, axis=1).max() * 1000:.1f} mm)')
    set_world(skin, W)
close_mouth(fskin)
apply_layers(fskin, female_layers(fskin, MALE_TONE, world))
# Región de la vulva (tools/female_perineum.py): se guarda en la piel (atributo de cara «vulva») para que
# build_female_skin.py modele la vulva con el mismo borde. La piel de la Fase 2 queda entera (los sistemas la usan para
# saber qué está dentro del cuerpo); solo al exportar se recorta.
from female_perineum import frame as perineum_frame, vulva_region
fW, fP = world(fskin), [p.vertices[:] for p in fskin.data.polygons]
vmask = vulva_region(perineum_frame({o.name: o for o in bpy.data.objects}, fW), fW, fP, bvhtree.BVHTree.FromPolygons(fW.tolist(), fP))
fskin.data.attributes.new('vulva', 'INT8', 'FACE').data.foreach_set('value', vmask.astype(np.int8))
print(f'vulva: {int(vmask.sum())} caras de la piel')
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT, f'{FEMALE_OUT}.blend'))

def split_vulva(skin, mask):
    """Pasa las caras de la vulva a un objeto aparte, «Skin_Vulva_Smooth» (la piel lisa que se ve con los genitales
    ocultos; la vulva de build_female_skin.py la sustituye con el mismo borde). Los dos conservan las normales de la piel
    entera: en el borde, sin costura de sombreado a ningún lado."""
    me = skin.data
    normals = np.array([v.normal[:] for v in me.vertices])
    me.attributes.new('orig_index', 'INT', 'POINT').data.foreach_set('value', np.arange(len(me.vertices), dtype=np.int32))
    part = skin.copy(); part.data = me.copy(); part.name = part.data.name = 'Skin_Vulva_Smooth'
    for c in skin.users_collection: c.objects.link(part)
    for obj, drop in ((skin, mask), (part, ~mask)):
        bm = bmesh.new(); bm.from_mesh(obj.data); bm.faces.ensure_lookup_table()
        bmesh.ops.delete(bm, geom=[bm.faces[i] for i in np.nonzero(drop)[0]], context='FACES')
        bm.to_mesh(obj.data); bm.free()
        idx = np.empty(len(obj.data.vertices), dtype=np.int32); obj.data.attributes['orig_index'].data.foreach_get('value', idx)
        obj.data.attributes.remove(obj.data.attributes['orig_index'])
        obj.data.normals_split_custom_set_from_vertices([tuple(n) for n in normals[idx]])
    for k, v in {'anato3d_id': 'integument_skin_vulva_smooth', 'system': 'integumentary', 'subsystem': 'skin'}.items(): part[k] = v
    return part
split_vulva(fskin, vmask)
skin_regions.split(fskin, skin_regions.label(fskin, {o.name: o for o in bpy.data.objects}, female=True))
export([os.path.join(ROOT, f'{FEMALE_OUT}_draco.glb'), os.path.join(WEB, 'female.glb')], 'Anato3D_Female_30')
