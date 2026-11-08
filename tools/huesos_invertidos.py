"""Huesos del revés de la Fase 2 y su oclusión ambiental (AO) horneada, corregidos en origen (2026-11-07). Lo llama
fix_neck.py antes de guardar la Fase 2 masculina; el esqueleto femenino sale de ella.

El problema: las piezas izquierdas del esqueleto son el espejo de las derechas vértice a vértice (Z-Anatomy;
fix_neck.symmetrize las deja en espejo exacto), con las mismas caras en el mismo orden. Reflejada, la malla queda del revés
(volumen negativo, normales hacia dentro), y el AO que se horneó así salió casi negro: en el canal R de las texturas ORM,
media 0,26 en las izquierdas frente a 0,67 en las derechas, y muchas a 0,157 («tapado por completo»). El vómer, igual. Hasta
ahora el visor les daba la vuelta al cargar y les quitaba el AO (web/src/viewer.js, fixInvertedWinding).

Qué hace:
  1. El AO de cada pieza izquierda se copia de su pareja derecha, cara por cara (la cara i de la izquierda es la cara i de
     la derecha en espejo): se hornea con Cycles («Emit»), en las UV de la izquierda, el canal R de la textura ORM leído en
     las UV de la derecha. Solo se escribe ese canal, dentro de las islas de la izquierda y su margen; las islas de las
     demás piezas (con 3 píxeles de holgura) y los canales de rugosidad y metal no cambian.
  2. Se les da la vuelta a las caras de todas las piezas del revés (normales hacia fuera).
  3. El vómer, que no tiene pareja, se hornea de nuevo (Cycles, «AO», con los demás huesos y sin la piel), con la distancia
     que mejor reproduce el AO de las piezas del cráneo que estaban bien (AO_DISTANCE).
Las texturas cambiadas se vuelven a empaquetar en el .blend.
"""
import bpy, bmesh
import numpy as np

MARGIN = 6             # píxeles de margen alrededor de las islas horneadas (para las mipmaps)
GUARD = 3              # píxeles alrededor de las islas de las demás piezas que no se tocan
# Distancia del AO: calibrada el 2026-11-07 (calibrate) horneando de nuevo las piezas del cráneo que estaban bien y
# comparando con su AO original. Error medio: 3 mm 0,146; 6 mm 0,089; 12 mm 0,056; 24 mm 0,096 (media 0,711 frente a 0,719).
AO_DISTANCE = 0.012    # m
AO_SAMPLES = 64


def volume(o):
    bm = bmesh.new(); bm.from_mesh(o.data)
    v = bm.calc_volume(signed=True); bm.free()
    return v


def orm_node(mat):
    return next(n for n in mat.node_tree.nodes if n.type == 'TEX_IMAGE' and n.image and n.image.name.endswith('_orm'))


def pixels(img):
    w, h = img.size
    a = np.empty(w * h * 4, np.float32); img.pixels.foreach_get(a)
    return a.reshape(h, w, 4)


def dilate(mask, steps):
    m = mask.copy()
    for _ in range(steps):
        d = m.copy()
        d[1:] |= m[:-1]; d[:-1] |= m[1:]; d[:, 1:] |= m[:, :-1]; d[:, :-1] |= m[:, 1:]
        m = d
    return m


def same_faces(a, b):
    """¿Las dos mallas tienen las mismas caras, con los mismos vértices en el mismo orden?"""
    if len(a.data.loops) != len(b.data.loops) or len(a.data.polygons) != len(b.data.polygons): return False
    va = np.empty(len(a.data.loops), np.int32); a.data.loops.foreach_get('vertex_index', va)
    vb = np.empty(len(b.data.loops), np.int32); b.data.loops.foreach_get('vertex_index', vb)
    return bool((va == vb).all())


class Baker:
    """Horneados con Cycles a una imagen temporal del tamaño de la textura ORM, con materiales temporales."""
    def __init__(self, scene):
        self.scene = scene
        if scene.world is None: scene.world = bpy.data.worlds.new('tmp_mundo')
        self.settings = (scene.render.engine, scene.world.light_settings.distance)
        scene.render.engine = 'CYCLES'
        scene.cycles.device = 'CPU'
        self.saved = {}

    def done(self):
        """Deja el render como estaba y quita los materiales temporales."""
        self.scene.render.engine, self.scene.world.light_settings.distance = self.settings
        for m in [m for m in bpy.data.materials if m.name.startswith('tmp_')]: bpy.data.materials.remove(m)

    def target(self, like, name):
        w, h = like.size
        img = bpy.data.images.new(name, w, h, alpha=True, float_buffer=True)
        img.colorspace_settings.name = 'Non-Color'
        img.pixels.foreach_set(np.zeros(w * h * 4, np.float32))
        return img

    def material(self, name, target, emit=None):
        """Material temporal: emisión `emit(nodes, links)` (o blanca) y la imagen `target` como nodo activo."""
        mat = bpy.data.materials.new(name)
        nt = mat.node_tree
        nt.nodes.clear()
        out = nt.nodes.new('ShaderNodeOutputMaterial')
        em = nt.nodes.new('ShaderNodeEmission')
        nt.links.new(em.outputs['Emission'], out.inputs['Surface'])
        if emit: nt.links.new(emit(nt.nodes, nt.links), em.inputs['Color'])
        node = nt.nodes.new('ShaderNodeTexImage'); node.image = target
        nt.nodes.active = node
        return mat

    def assign(self, objs, mat):
        for o in objs:
            self.saved.setdefault(o.name, o.data.materials[0])
            o.data.materials[0] = mat

    def restore(self):
        for name, mat in self.saved.items():
            bpy.data.objects[name].data.materials[0] = mat
        self.saved.clear()

    def bake(self, objs, kind, margin):
        vl = bpy.context.view_layer
        for o in vl.objects: o.select_set(False)
        for o in objs: o.select_set(True)
        vl.objects.active = objs[0]
        bpy.ops.object.bake(type=kind, margin=margin, margin_type='EXTEND', use_clear=False, target='IMAGE_TEXTURES')

    def coverage(self, objs, like, margin=0):
        """Máscara de los píxeles de la textura que cubren las caras de `objs` (más `margin`)."""
        img = self.target(like, 'tmp_cobertura')
        self.assign(objs, self.material('tmp_cobertura', img))
        self.scene.cycles.samples = 1
        self.bake(objs, 'EMIT', margin)
        self.restore()
        m = pixels(img)[..., 3] > 0
        bpy.data.images.remove(img)
        return m


def ao_from_right(baker, lefts, orm):
    """Canal R de `orm` en las islas de `lefts`, leído en las UV de su pareja derecha (capa «AO_R» de cada izquierda)."""
    img = baker.target(orm, 'tmp_ao_derecha')
    def emit(nodes, links):
        uv = nodes.new('ShaderNodeUVMap'); uv.uv_map = 'AO_R'
        tex = nodes.new('ShaderNodeTexImage'); tex.image = orm; tex.interpolation = 'Linear'
        sep = nodes.new('ShaderNodeSeparateColor'); comb = nodes.new('ShaderNodeCombineColor')
        links.new(uv.outputs['UV'], tex.inputs['Vector']); links.new(tex.outputs['Color'], sep.inputs['Color'])
        for c in ('Red', 'Green', 'Blue'): links.new(sep.outputs['Red'], comb.inputs[c])
        return comb.outputs['Color']
    baker.assign(lefts, baker.material('tmp_ao_derecha', img, emit))
    baker.scene.cycles.samples = 1
    baker.bake(lefts, 'EMIT', MARGIN)
    baker.restore()
    a = pixels(img); bpy.data.images.remove(img)
    return a[..., 0], a[..., 3] > 0


def baked_ao(baker, objs, orm, distance=AO_DISTANCE, samples=AO_SAMPLES):
    """AO horneado de nuevo para `objs`, con los huesos como únicos oclusores (la piel y lo demás, ocultos)."""
    img = baker.target(orm, 'tmp_ao')
    hidden = [o for o in bpy.context.view_layer.objects if o.type == 'MESH' and o.get('system') != 'skeletal' and not o.hide_render]
    for o in hidden: o.hide_render = True
    baker.scene.world.light_settings.distance = distance
    baker.scene.cycles.samples = samples
    baker.assign(objs, baker.material('tmp_ao', img))
    baker.bake(objs, 'AO', MARGIN)
    baker.restore()
    for o in hidden: o.hide_render = False
    a = pixels(img); bpy.data.images.remove(img)
    return a[..., 0], a[..., 3] > 0


def fix(objects, log=print):
    """Corrige las piezas del esqueleto del revés: su AO (copiado de la pareja derecha, o rehorneado) y sus caras.
    Devuelve (piezas corregidas, cuántas con pareja, las que no tenían)."""
    bones = {o.name: o for o in objects if o.type == 'MESH' and o.get('system') == 'skeletal'}
    bad = [o for o in bones.values() if volume(o) < 0]
    pairs = {o.name: bones[o.name[:-2] + '_R'] for o in bad
             if o.name.endswith('_L') and o.name[:-2] + '_R' in bones and same_faces(o, bones[o.name[:-2] + '_R'])}
    single = [o for o in bad if o.name not in pairs]
    image = lambda o: orm_node(o.data.materials[0]).image
    baker = Baker(bpy.context.scene)
    changed = {}                                                # textura ORM → píxeles nuevos

    def write(orm, objs, ao, m, what):
        others = [x for x in bones.values() if image(x) == orm and x not in objs]
        if others: m = m & ~dilate(baker.coverage(others, orm), GUARD)
        A = changed.setdefault(orm.name, pixels(orm).copy())
        before = A[m, 0].mean()
        A[m, 0] = ao[m]
        log(f'  {orm.name}: {what} ({m.sum()} píxeles; AO medio {before:.3f} → {A[m, 0].mean():.3f})')

    # 1. AO copiado de la pareja derecha, antes de dar la vuelta a las caras (el orden de las esquinas aún coincide).
    for name, r in pairs.items():
        o = bones[name]
        u = np.empty(len(r.data.loops) * 2, np.float32); r.data.uv_layers.active.data.foreach_get('uv', u)
        main = o.data.uv_layers.active
        o.data.uv_layers.new(name='AO_R').data.foreach_set('uv', u)
        o.data.uv_layers.active = main                         # el horneado escribe en las UV propias de la pieza
        main.active_render = True
    for orm in sorted({image(bones[n]) for n in pairs}, key=lambda i: i.name):
        lefts = [bones[n] for n in pairs if image(bones[n]) == orm]
        ao, m = ao_from_right(baker, lefts, orm)
        write(orm, lefts, ao, m, f'AO de {len(lefts)} piezas izquierdas copiado de las derechas')
    for name in pairs:
        lay = bones[name].data.uv_layers
        lay.remove(lay['AO_R'])
    # 2. Caras del derecho.
    for o in bad:
        bm = bmesh.new(); bm.from_mesh(o.data)
        bmesh.ops.reverse_faces(bm, faces=bm.faces[:])
        bm.to_mesh(o.data); bm.free(); o.data.update()
    still = [n for n, o in bones.items() if volume(o) < 0]
    log(f'  caras del derecho en {len(bad)} huesos; quedan del revés: {still or "ninguno"}')
    # 3. Las que no tienen pareja (el vómer): AO horneado de nuevo, ya con las caras bien.
    for o in single:
        ao, m = baked_ao(baker, [o], image(o))
        write(image(o), [o], ao, m, f'AO de {o.name} horneado de nuevo')
    for name, A in changed.items():
        img = bpy.data.images[name]
        img.pixels.foreach_set(A.ravel())
        img.pack()
    baker.done()
    return len(bad), len(pairs), [o.name for o in single]


def calibrate(objects, image_name, distances, samples=32, log=print):
    """Error medio del AO horneado de nuevo frente al que ya tenían las piezas que estaban bien de una textura, para
    elegir AO_DISTANCE (solo para desarrollo)."""
    bones = [o for o in objects if o.type == 'MESH' and o.get('system') == 'skeletal']
    good = [o for o in bones if orm_node(o.data.materials[0]).image.name == image_name and volume(o) > 0]
    orm = bpy.data.images[image_name]
    baker = Baker(bpy.context.scene)
    old = pixels(orm)[..., 0]
    out = {}
    for d in distances:
        ao, m = baked_ao(baker, good, orm, distance=d, samples=samples)
        cover = baker.coverage(good, orm)
        m &= cover
        out[d] = (float(np.abs(ao[m] - old[m]).mean()), float(ao[m].mean()), float(old[m].mean()))
        log(f'  distancia {d * 1000:.1f} mm: error medio {out[d][0]:.3f}; media nueva {out[d][1]:.3f}, antigua {out[d][2]:.3f}')
    baker.done()
    return out
