"""Piel de la vulva, que no existe en la piel femenina de MakeHuman (tiene el pubis liso).

Una copia de la piel del cuerpo alrededor de la vulva, subdividida (~0,6 mm) y con un relieve a lo largo de su normal:
siempre 0,4 mm por fuera de la piel del cuerpo y, en su borde, 1,2 mm por dentro (la unión no se ve ni parpadea). Con la
opción «Mostrar genitales externos» desactivada se oculta y queda la piel lisa del cuerpo.
  - Línea de la vulva: de la comisura anterior (sobre el monte del pubis) a la posterior, pasando por el glande del
    clítoris, el orificio de la uretra y el de la vagina (de los órganos de tools/female_organs.py), sobre la piel.
  - En esta piel los muslos dejan entre ellos una ranura de ~14 mm: la hendidura vulvar, entre los labios mayores
    apretados. Labios mayores: dos relieves bajos (máximo a 6 mm de la línea media) con un surco entre ellos (la
    hendidura, visible en el monte del pubis).
  - Labios menores: dos pliegues finos que asoman de la ranura, del clítoris a la horquilla; capuchón del clítoris.
Color por vértice («Tono»): los labios mayores, algo más pigmentados que el muslo; los menores y el capuchón, rosados;
junto a la unión, el tono de la piel del cuerpo. Es una primera versión, para perfeccionar.

Uso (desde la raíz del proyecto, después de construir los sistemas femeninos):
  A3D_MODEL=female /Applications/Blender.app/Contents/MacOS/Blender -b --disable-autoexec Anato3D_Female_30_Fase2.blend \
    --python tools/build_female_skin.py
"""
import bpy, bmesh, os, json, time
import numpy as np
from mathutils import Vector, Matrix, bvhtree, kdtree

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
FACES = 30000
_t0 = time.time()
def log(*a): print(f'[vulva] {time.time() - _t0:5.1f}s', *a, flush=True)

with bpy.data.libraries.load(os.path.join(ROOT, 'build', 'female_urogenital.blend')) as (src, dst):
    dst.collections = ['Urogenital_System']
bpy.context.scene.collection.children.link(dst.collections[0])
bpy.context.view_layer.update()

def world(o):
    m = np.array(o.matrix_world)
    co = np.empty(len(o.data.vertices) * 3); o.data.vertices.foreach_get('co', co)
    return co.reshape(-1, 3) @ m[:3, :3].T + m[:3, 3]

skin = bpy.data.objects['Skin_Body']
SW = world(skin)
SKIN_BVH = bvhtree.BVHTree.FromPolygons(SW.tolist(), [p.vertices[:] for p in skin.data.polygons])

def body_sd(P):
    out = np.empty(len(P))
    for i, p in enumerate(P):
        loc, nrm, _, d = SKIN_BVH.find_nearest(Vector(p))
        out[i] = d if (Vector(p) - loc).dot(nrm) >= 0 else -d
    return out

def sm(t):
    t = np.clip(t, 0.0, 1.0)
    return t * t * (3 - 2 * t)

def on_skin(p):
    loc, nrm, _, _ = SKIN_BVH.find_nearest(Vector(p))
    return np.array(loc), np.array(nrm)

# ── Línea de la vulva ───────────────────────────────────────────────────────
G = world(bpy.data.objects['Glans_of_clitoris']).mean(0)
U = world(bpy.data.objects['Urethra']); U = U[np.argmin(U[:, 2])]
Vg = world(bpy.data.objects['Vagina']); O = Vg[np.argmin(Vg[:, 2])]
A = G + np.array([0, -0.01, 0.028])                               # comisura anterior, sobre el monte del pubis
Pc = O + np.array([0, 0.016, -0.006])                             # comisura posterior (horquilla)
ctrl = [A, G, U, O, Pc]
t = np.linspace(0, 1, 60)[:, None]
P = [np.broadcast_to(np.asarray(p, float), (60, 3)) for p in ctrl]
while len(P) > 1:
    P = [P[i] * (1 - t) + P[i + 1] * t for i in range(len(P) - 1)]
line = P[0]
SN = np.array([on_skin(p) for p in line])
line_s = SN[:, 0]                                                  # sobre la piel
g_loc = on_skin(G)[0]                                              # el glande, bajo el capuchón
log(f'línea de la vulva: {np.linalg.norm(np.diff(line_s, axis=0), axis=1).sum() * 100:.1f} cm sobre la piel')

# ── Relieve sobre un parche de la piel del cuerpo ───────────────────────────
# En esta piel los muslos quedan a ~7 mm de la línea media a lo largo de 6 cm: la hendidura vulvar es esa ranura, y sus
# paredes, los labios mayores apretados entre los muslos. Los labios no caben como volúmenes aparte (con una función de
# distancia salían de los muslos, y un relieve tan bajo, casi tangente a la piel del cuerpo, la cruzaba una y otra vez y
# parpadeaba). Así que la piel de la vulva es una copia de la piel del cuerpo alrededor de la línea, subdividida, con un
# relieve a lo largo de su normal. Solo emerge donde hay relieve (los labios y el surco entre ellos, al menos 0,4 mm por
# fuera); alrededor queda 0,8–1,2 mm bajo la piel del cuerpo, y la cruza con pendiente, sin escalón ni parpadeo.
R_PATCH = 0.017
SEG_A, SEG_B = line_s[:-1], line_s[1:]

def line_coords(P):
    """(posición a lo largo de la línea, 0–1; distancia a ella) de cada punto."""
    best = np.full(len(P), np.inf); pos = np.zeros(len(P))
    for i in range(len(SEG_A)):
        ab = SEG_B[i] - SEG_A[i]
        h = np.clip(((P - SEG_A[i]) @ ab) / max(ab @ ab, 1e-12), 0, 1)
        d = np.linalg.norm(P - (SEG_A[i] + h[:, None] * ab), axis=1)
        closer = d < best
        best[closer] = d[closer]; pos[closer] = (i + h[closer]) / len(SEG_A)
    return pos, best

_, d_sk = line_coords(SW)
near = d_sk < R_PATCH + 0.012
bm = bmesh.new(); vmap = {}
for f in skin.data.polygons:
    if not all(near[k] for k in f.vertices): continue
    for k in f.vertices:
        if k not in vmap: vmap[k] = bm.verts.new(SW[k])
    bm.faces.new([vmap[k] for k in f.vertices])
for _ in range(4):                                                   # ~0,3 mm entre vértices
    bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=1, use_grid_fill=True)
# Recorte a R_PATCH de la línea con la malla ya fina (con las caras de la piel, el borde quedaba escalonado).
_, d_v = line_coords(np.array([v.co[:] for v in bm.verts]))
bm.verts.ensure_lookup_table()
bmesh.ops.delete(bm, geom=[f for f in bm.faces if any(d_v[v.index] > R_PATCH for v in f.verts)], context='FACES')
bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
for v in bm.verts: v.co = SKIN_BVH.find_nearest(v.co)[0]            # sobre la piel del cuerpo
bm.normal_update()
bm.verts.ensure_lookup_table(); bm.verts.index_update()
P = np.array([v.co[:] for v in bm.verts]); Nv = np.array([v.normal[:] for v in bm.verts])
E = np.array([(e.verts[0].index, e.verts[1].index) for e in bm.edges])
# Distancia (sobre la malla) al borde del parche, para que el relieve se hunda bajo la piel del cuerpo en el borde.
L = np.linalg.norm(P[E[:, 0]] - P[E[:, 1]], axis=1)
g = np.where([v.is_boundary for v in bm.verts], 0.0, 1.0)
for _ in range(40):
    np.minimum.at(g, E[:, 0], g[E[:, 1]] + L); np.minimum.at(g, E[:, 1], g[E[:, 0]] + L)
pos, d = line_coords(P)
u = np.abs(P[:, 0])                                                  # distancia a la línea media
ends = sm(pos / 0.3) * sm((1 - pos) / 0.18)                         # se funden con el monte del pubis y el periné
# Labios mayores: un relieve a cada lado (máximo a 6 mm de la línea media; 1,5 mm en el monte del pubis y 2,7 mm entre
# los muslos), con el surco de la hendidura entre ellos (que no baja de 0,4 mm por fuera de la piel del cuerpo).
# En el extremo anterior se unen en uno solo (la comisura anterior): el surco aparece a partir de ~1,5 cm.
crease = sm((pos - 0.12) / 0.2)
profile = crease * np.sin(np.pi * np.clip(d / 0.012, 0, 1)) ** 2 + (1 - crease) * np.cos(0.5 * np.pi * np.clip(d / 0.012, 0, 1)) ** 2
h_maj = (0.0023 + 0.0012 * sm((pos - 0.1) / 0.25)) * ends * profile
h_maj = np.maximum(h_maj, 0.0012 * ends * crease * (1 - sm((d - 0.006) / 0.004)))
# Labios menores: pliegues finos a 1,8 mm de la línea media que asoman hasta 4 mm, del clítoris a la horquilla.
h_min = 0.0048 * np.sin(np.pi * np.clip((pos - 0.32) / 0.52, 0, 1)) ** 0.8 * np.exp(-((u - 0.0019) / 0.0011) ** 2)
# Capuchón del clítoris, sobre el glande.
h_hood = 0.0038 * np.exp(-(np.linalg.norm(P - g_loc, axis=1) / 0.0038) ** 2)
edge = sm(g / 0.004)
off = -0.0012 * (1 - edge) + edge * (h_maj + h_min + h_hood - 0.0008)
P = P + Nv * off[:, None]
for i, v in enumerate(bm.verts): v.co = P[i]
for f in bm.faces: f.smooth = True
bmesh.ops.triangulate(bm, faces=bm.faces[:])
me = bpy.data.meshes.new('Skin_Genitals'); bm.to_mesh(me); bm.free()
obj = bpy.data.objects.new('Skin_Genitals', me)
bpy.context.scene.collection.objects.link(obj)
if len(me.polygons) > FACES:
    m = obj.modifiers.new('reduce', 'DECIMATE'); m.ratio = FACES / len(me.polygons); m.use_symmetry = True; m.symmetry_axis = 'X'
    dg = bpy.context.evaluated_depsgraph_get(); dg.update()
    new = bpy.data.meshes.new_from_object(obj.evaluated_get(dg), depsgraph=dg)
    obj.modifiers.clear(); obj.data = new; bpy.data.meshes.remove(me); me = new; me.name = 'Skin_Genitals'
log(f'piel de la vulva: {len(me.vertices)} vértices, {len(me.polygons)} caras; relieve hasta {off.max() * 1000:.1f} mm')

# ── Qué órganos externos quedan fuera de la piel ───────────────────────────
bm = bmesh.new(); bm.from_mesh(me); GT = bvhtree.BVHTree.FromBMesh(bm); bm.free()
for name in ('Glans_of_clitoris', 'Body_of_clitoris', 'Bulb_of_vestibule_L', 'Bulb_of_vestibule_R', 'Urethra', 'Vagina'):
    o = bpy.data.objects.get(name)
    if not o: continue
    W = world(o); out = body_sd(W)
    n_out = int((out > 0.0005).sum())
    covered = sum(1 for p in W[out > 0.0005] if (lambda r: r[0] is not None and (Vector(p) - r[0]).dot(r[1]) < 0)(GT.find_nearest(Vector(p))))
    if n_out: log(f'  {name}: {n_out} vértices fuera de la piel del cuerpo, {covered} bajo la de la vulva (hasta {out.max() * 1000:.1f} mm)')

# ── Tono por vértice ───────────────────────────────────────────────────────
GV = np.array([v.co[:] for v in me.vertices])
# Por cercanía a los vértices del parche (el diezmado los mueve): rosado en labios menores y capuchón.
KD = kdtree.KDTree(len(P))
for i, p in enumerate(P): KD.insert(p, i)
KD.balance()
src = np.array([KD.find(p)[1] for p in GV])
pink = sm((h_min + h_hood)[src] / 0.0015)
MAJ = np.array([0.84, 0.70, 0.66]); PINK = np.array([0.94, 0.62, 0.64])
col = MAJ * (1 - pink[:, None]) + PINK * pink[:, None]
tone = skin.data.color_attributes.get('Tono')
if tone:
    BT = np.empty(len(tone.data) * 4); tone.data.foreach_get('color', BT); BT = BT.reshape(-1, 4)[:, :3]
    kd = kdtree.KDTree(len(SW))
    for i, p in enumerate(SW): kd.insert(p, i)
    kd.balance()
    near = np.array([kd.find(p)[1] for p in GV])
    w = sm(g[src] / 0.006)[:, None]                                  # junto al borde, el tono del cuerpo
    col = BT[near] * (1 - w) + col * w
attr = me.color_attributes.new('Tono', 'FLOAT_COLOR', 'POINT')
attr.data.foreach_set('color', np.c_[col, np.ones(len(col))].ravel())
me.color_attributes.active_color = attr

# ── Centro, material y propiedades; guardado ────────────────────────────────
center = (GV.min(0) + GV.max(0)) / 2
me.transform(Matrix.Translation(-Vector(center))); obj.location = Vector(center)
me.materials.clear(); me.materials.append(skin.data.materials[0])
for k, v in {'anato3d_id': 'integument_skin_genitals', 'system': 'integumentary', 'subsystem': 'skin', 'tissue': 'skin',
             'name_en': 'Skin of vulva', 'name_la': 'Pudendum femininum', 'name_es': 'Piel de la vulva (labios mayores y menores)',
             'source': 'Anato3D: generada sobre la piel de MakeHuman y los órganos femeninos de tools/female_organs.py'}.items():
    obj[k] = v
col = bpy.data.collections.new('Genital_Skin'); col.objects.link(obj)
out = os.path.join(ROOT, 'build', 'female_integumentary.blend')
bpy.data.libraries.write(out, {col}, fake_user=True)
json.dump({'groups': {}}, open(os.path.join(ROOT, 'web/public/models/female-integumentary.json'), 'w'))
log('guardado', out)
