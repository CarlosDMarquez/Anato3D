"""Piel de la vulva, que no existe en la piel femenina de MakeHuman (tiene el pubis liso).

La vulva sustituye a la piel del cuerpo en su región (female_perineum.vulva_region: el «techo» entre los muslos alrededor
de la línea de la vulva), con el mismo borde: fix_neck.py recorta esa región de la piel al exportar female.glb y la deja
aparte, lisa («Skin_Vulva_Smooth»), para la opción «Mostrar genitales externos» desactivada. Así la vulva puede hundirse
(vestíbulo, orificios) y no hay costura de forma, de normales ni de color. Antes era un parche por fuera de la piel: con
otro tono, un borde que se notaba y sin orificios.

Cómo:
  - Las caras de la región se subdividen (5 veces, ~0,25 mm) y se curvan con la interpolación de Phong de las normales de
    la piel (en el borde, nada: coincide con sus aristas); normal y tono del cuerpo, interpolados sobre ellas.
  - Relieve a lo largo de la normal, en función de la posición a lo largo de la línea (s) y de la distancia a la línea
    media (u), con medidas de adulta (Lloyd 2005):
      - labios mayores: dos almohadillas de 5 mm y contorno elíptico (2,3 cm de ancho entre los dos), del monte del pubis
        (comisura anterior) a la horquilla (comisura posterior), con la hendidura vulvar entre ellas;
      - dentro: hendidura de 2,5 mm, labios menores (pliegues finos a 2 mm de la línea media que asoman entre los
        mayores), capuchón y glande del clítoris;
      - vestíbulo: orificio de la uretra (hoyuelo de 1 mm con un reborde) y orificio vaginal (hendidura de 16 × 8 mm, de
        paredes empinadas, que llega a la vagina, a 9 mm, con el borde del himen).
  - El relieve va a lo largo de la normal de la piel en la línea de la vulva (suave) y se anula en el borde (6 mm), donde
    la normal pasa a ser la del cuerpo.
  - Color («Tono», multiplicador como en la piel del cuerpo): el tono del cuerpo × un matiz por zona (labios mayores algo
    más pigmentados; cara interna, rosada; orificios, más oscuros). En el borde, el del cuerpo.

Uso (desde la raíz del proyecto, después de construir los sistemas femeninos):
  A3D_MODEL=female /Applications/Blender.app/Contents/MacOS/Blender -b --disable-autoexec Anato3D_Female_30_Fase2.blend \\
    --python tools/build_female_skin.py
"""
import bpy, bmesh, os, sys, json, time
import numpy as np
from mathutils import Vector, bvhtree, kdtree
sys.path.insert(0, os.path.dirname(__file__))
from female_perineum import frame, vulva_controls, vulva_line, line_coords, vulva_region

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
FACES = 60000
_t0 = time.time()
def log(*a): print(f'[vulva] {time.time() - _t0:5.1f}s', *a, flush=True)

def world(o):
    m = np.array(o.matrix_world)
    co = np.empty(len(o.data.vertices) * 3); o.data.vertices.foreach_get('co', co)
    return co.reshape(-1, 3) @ m[:3, :3].T + m[:3, 3]

def sm(t):
    t = np.clip(t, 0.0, 1.0)
    return t * t * (3 - 2 * t)

skin = bpy.data.objects['Skin_Body']
SW = world(skin)
SN = np.array([(skin.matrix_world.to_3x3() @ v.normal).normalized()[:] for v in skin.data.vertices])
polys = [p.vertices[:] for p in skin.data.polygons]
SKIN_BVH = bvhtree.BVHTree.FromPolygons(SW.tolist(), polys)
tone = skin.data.color_attributes.get('Tono')
BT = np.ones((len(SW), 3))
if tone:
    BT = np.empty(len(tone.data) * 4); tone.data.foreach_get('color', BT); BT = BT.reshape(-1, 4)[:, :3]

F = frame({o.name: o for o in bpy.data.objects}, SW)
line, s_line = vulva_line(F, SKIN_BVH)
# Región: la que guardó fix_neck.py en la piel (atributo de cara «vulva»), para que el borde coincida con el del corte.
attr = skin.data.attributes.get('vulva')
if attr is not None:
    mask = np.zeros(len(polys), dtype=np.int8); attr.data.foreach_get('value', mask); mask = mask.astype(bool)
else:
    mask = vulva_region(F, SW, polys, SKIN_BVH)
    log('aviso: la piel no trae la región («vulva»); calculada aquí')
region = [p for p, k in zip(polys, mask) if k]
log(f'región: {len(region)} caras de la piel; línea de la vulva {s_line[-1] * 100:.1f} cm')

# ── Malla: caras de la región, subdivididas ─────────────────────────────────
bm = bmesh.new(); vmap = {}
for p in region:
    for k in p:
        if k not in vmap: vmap[k] = bm.verts.new(SW[k])
    bm.faces.new([vmap[k] for k in p])
# La piel tiene vértices duplicados a lo largo de algunas filas (costuras): dentro de la región serían bordes, y el relieve
# se anulaba en ellos (bandas lisas). Se unen; los del borde de la región no cambian de sitio.
bmesh.ops.remove_doubles(bm, verts=bm.verts[:], dist=1e-6)
for _ in range(5):
    bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=1, use_grid_fill=True)
bm.verts.ensure_lookup_table(); bm.verts.index_update()
P = np.array([v.co[:] for v in bm.verts])
E = np.array([(e.verts[0].index, e.verts[1].index) for e in bm.edges])
boundary = np.array([v.is_boundary for v in bm.verts])
# Distancia (sobre la malla) al borde.
Le = np.linalg.norm(P[E[:, 0]] - P[E[:, 1]], axis=1)
g = np.where(boundary, 0.0, 1.0)
for _ in range(80):
    np.minimum.at(g, E[:, 0], g[E[:, 1]] + Le); np.minimum.at(g, E[:, 1], g[E[:, 0]] + Le)

# Envolvente suave de la región: el borde sigue las caras de la piel (8 mm, en dientes de sierra) y todo lo que se
# desvanecía con la distancia a él (relieve, curvatura, dirección) salía escalonado, una fila de caras por escalón. La
# envolvente va por dentro de todos los dientes: la menor distancia del borde a la línea media por franjas de 1 mm, el
# mínimo en ±6 mm y suavizada (σ 3 mm), menos 1 mm; a lo largo de la línea, del primer al último diente.
s_b, d_b, _ = line_coords(line, s_line, P[boundary]); u_b = np.abs(P[boundary][:, 0])
cs = np.arange(s_b.min(), s_b.max() + 0.001, 0.001)
cw = np.array([u_b[np.abs(s_b - x) < 0.0015].min() if (np.abs(s_b - x) < 0.0015).any() else np.inf for x in cs])
cw = np.where(np.isfinite(cw), cw, np.nanmin(np.where(np.isfinite(cw), cw, np.nan)))
cw = np.array([cw[max(0, i - 6):i + 7].min() for i in range(len(cw))])
ker = np.exp(-0.5 * (np.arange(-9, 10) / 3.0) ** 2); ker /= ker.sum()
cw = np.convolve(np.pad(cw, 9, mode='edge'), ker, mode='valid') - 0.001
s_lo, s_hi = cs.min() + 0.006, cs.max() - 0.006
W_env = lambda s: np.interp(s, cs, cw)
def envelope(s, au):
    """1 dentro de la región, 0 por dentro de sus dientes; suave."""
    W = W_env(s)
    return sm((W - au) / np.clip(0.6 * W, 0.002, 0.006)) * sm((s - s_lo) / 0.008) * sm((s_hi - s) / 0.008)
s0, _, _ = line_coords(line, s_line, P)
ENV = envelope(s0, np.abs(P[:, 0])) * sm(g / 0.0015)

# Interpolación de Phong sobre las caras originales: posición curvada (las caras de la piel miden 8 mm: planas, se
# notaban en el relieve y en el sombreado), normal y tono del cuerpo. En el borde no se curva: coincide con sus aristas.
RV = sorted({k for p in region for k in p}); ridx = {k: i for i, k in enumerate(RV)}
RT = bvhtree.BVHTree.FromPolygons(SW[RV].tolist(), [[ridx[k] for k in p] for p in region])
def weights(C, q):
    """Pesos de q en la cara de esquinas C (triángulo: baricéntricas; cuadrilátero: bilineales, por Newton)."""
    if len(C) == 3:
        v0, v1, v2 = C[1] - C[0], C[2] - C[0], q - C[0]
        d00, d01, d11, d20, d21 = v0 @ v0, v0 @ v1, v1 @ v1, v2 @ v0, v2 @ v1
        den = d00 * d11 - d01 * d01
        b = (d11 * d20 - d01 * d21) / den; c = (d00 * d21 - d01 * d20) / den
        return np.clip(np.array([1 - b - c, b, c]), 0, 1)
    u = v = 0.5
    for _ in range(8):
        B = (1 - u) * (1 - v) * C[0] + u * (1 - v) * C[1] + u * v * C[2] + (1 - u) * v * C[3]
        du = -(1 - v) * C[0] + (1 - v) * C[1] + v * C[2] - v * C[3]
        dv = -(1 - u) * C[0] - u * C[1] + u * C[2] + (1 - u) * C[3]
        step = np.linalg.lstsq(np.c_[du, dv], q - B, rcond=None)[0]
        u, v = np.clip(u + step[0], 0, 1), np.clip(v + step[1], 0, 1)
    return np.array([(1 - u) * (1 - v), u * (1 - v), u * v, (1 - u) * v])
NI = np.zeros_like(P); TI = np.zeros_like(P); PH = P.copy()
for i, q in enumerate(P):
    _, _, fi, _ = RT.find_nearest(Vector(q))
    ks = list(region[fi]); C = SW[ks]; N = SN[ks]
    w = weights(C, q); w = w / w.sum()
    NI[i] = w @ N; TI[i] = w @ BT[ks]
    PH[i] = sum(w[j] * (q - ((q - C[j]) @ N[j]) * N[j]) for j in range(len(ks)))
NI /= np.linalg.norm(NI, axis=1)[:, None]
P = P + (0.75 * ENV)[:, None] * (PH - P)

# ── Relieve ─────────────────────────────────────────────────────────────────
s, d, _ = line_coords(line, s_line, P)
u = P[:, 0]; au = np.abs(u)
def sp(p):
    """Posición s (m) a lo largo de la línea del punto de la piel más cercano a p."""
    return line_coords(line, s_line, np.array([SKIN_BVH.find_nearest(Vector(p))[0][:]]))[0][0]
s_G, s_U, s_O = sp(F['glans']), sp(F['urethral_os']), sp(F['introitus'])
s_A, s_P = sp(vulva_controls(F)[0]), sp(vulva_controls(F)[-1])
mm = 0.001
# Labios mayores: dos almohadillas de contorno elíptico, de la comisura anterior (monte del pubis) a la posterior; la
# cresta a mitad de su anchura y, entre ellas, la hendidura vulvar.
s_E = s_P + 0.005
t = np.clip((s - s_A) / (s_E - s_A), 0, 1) ** 0.85                  # más llenos por delante
# Anchura disponible: la de la envolvente, menos 4 mm (los labios no llegan a la esquina del techo con los muslos).
W_avail = W_env(s) - 0.004
W_out = np.minimum(12.0 * mm * np.sin(np.pi * t) ** 0.6, np.maximum(W_avail, 4 * mm))   # los dos labios juntos, /2
a_maj = 5.0 * mm * np.sin(np.pi * t) ** 1.5                           # comisuras redondeadas, no en punta
r = au / np.maximum(W_out, 1e-6)
inner_slope = 0.10 + 0.90 * sm(r / 0.42)                              # de la hendidura (0) a la cresta (r = 0,42)
outer_slope = 0.5 + 0.5 * np.cos(np.pi * np.clip((r - 0.42) / 0.58, 0, 1))
h_maj = a_maj * np.where(r < 0.42, inner_slope, outer_slope) * (r < 1)
# Hendidura entre ellos (el espacio interlabial), del capuchón a la horquilla.
span = sm((s - s_G + 0.006) / 0.004) * (1 - sm((s - s_P + 0.003) / 0.004))
h_cleft = -2.5 * mm * span * (1 - sm((au - 2.0 * mm) / (1.8 * mm)))
# Labios menores: pliegues finos que suben desde el fondo de la hendidura y asoman entre los mayores.
mspan = sm((s - s_G + 0.003) / 0.004) * (1 - sm((s - s_P + 0.004) / 0.005))
H_min = 3.4 * mm * np.sin(np.pi * np.clip((s - s_G + 0.003) / (s_P - s_G - 0.001), 0, 1)) ** 0.45 * mspan
h_min = H_min * np.exp(-((au - 2.1 * mm) / (0.62 * mm)) ** 2)
# Capuchón (prepucio) y glande del clítoris; frenillo (el capuchón se une a los labios menores).
h_hood = 1.9 * mm * np.exp(-((s - s_G + 0.0025) / 0.0045) ** 2 - (u / (3.0 * mm)) ** 2)
h_glans = 1.1 * mm * np.exp(-((s - s_G - 0.0015) / 0.0022) ** 2 - (u / (2.0 * mm)) ** 2)
# Vestíbulo: entre los labios menores, del glande a la horquilla.
vspan = sm((s - s_G - 0.003) / 0.003) * (1 - sm((s - s_P + 0.004) / 0.003))
h_vest = -0.8 * mm * vspan * (1 - sm((au - 1.4 * mm) / (0.6 * mm)))
# Orificio de la uretra: hoyuelo con un reborde.
ru = np.sqrt(((s - s_U) / (1.4 * mm)) ** 2 + (u / (1.1 * mm)) ** 2)
h_meat = -2.2 * mm * np.exp(-ru ** 2) + 0.35 * mm * np.exp(-((ru - 1.6) / 0.5) ** 2)
# Orificio vaginal: embudo elíptico hasta la vagina, con el borde del himen.
rho = np.sqrt(((s - s_O) / (8.0 * mm)) ** 2 + (u / (4.2 * mm)) ** 2)
theta = np.arctan2(u, s - s_O)
h_intro = -6.2 * mm * sm((1 - rho) / 0.3) + 0.55 * mm * np.exp(-((rho - 0.86) / 0.07) ** 2) * (1 + 0.3 * np.sin(9 * theta))
inner = h_cleft + h_min + h_hood + h_glans + h_vest + h_meat + h_intro
h = (np.maximum(h_maj, 0) + inner) * ENV
# Dirección del relieve: la normal de la piel a lo largo de la línea de la vulva (suave, solo depende de s), que pasa a la
# normal local junto al borde. Con la normal interpolada en las caras de la piel (8 mm, en la esquina del techo con los
# muslos gira hasta 90°) los labios mayores salían escalonados, una fila de caras por escalón.
LN = np.array([SKIN_BVH.find_nearest(Vector(p))[1][:] for p in line])
for _ in range(20): LN[1:-1] = (LN[:-2] + 2 * LN[1:-1] + LN[2:]) / 4
LN /= np.linalg.norm(LN, axis=1)[:, None]
DIR = np.column_stack([np.interp(s, s_line, LN[:, k]) for k in range(3)])
DIR = DIR * ENV[:, None] + NI * (1 - ENV)[:, None]
DIR /= np.linalg.norm(DIR, axis=1)[:, None]
P = P + DIR * h[:, None]
for i, v in enumerate(bm.verts): v.co = P[i]
if os.environ.get('A3D_DEBUG_VULVA'):                                # para dibujar el relieve fuera de Blender
    np.savez(os.environ['A3D_DEBUG_VULVA'], s=s, u=u, h=h, h_maj=h_maj, inner=inner, marks=[s_A, s_G, s_U, s_O, s_P], env=ENV,
             sb=s_b, ub=u_b, cs=cs, cw=cw, slo=s_lo, shi=s_hi, P=P, W_out=W_out)
log(f'relieve: labios mayores {h_maj.max() / mm:.1f} mm, hasta {h.min() / mm:.1f} mm hacia dentro (orificio vaginal); '
    f's: glande {s_G * 100:.1f}, uretra {s_U * 100:.1f}, vagina {s_O * 100:.1f}, horquilla {s_P * 100:.1f} cm')

# Normales en la malla completa (al reducirla, los vértices se mueven y salían con ruido); en el borde, las del cuerpo
# (sin costura de sombreado).
bm.normal_update(); NG = np.array([v.normal[:] for v in bm.verts])

# Matiz por zona (multiplica el tono del cuerpo).
MAJ, OUTER, PINK, DEEP = np.array([0.93, 0.86, 0.84]), np.array([0.95, 0.78, 0.78]), np.array([1.0, 0.70, 0.72]), np.array([0.80, 0.42, 0.46])
m_maj = sm(h_maj / (2.0 * mm)) * sm((au - 3.0 * mm) / (2.0 * mm))
m_out = (1 - sm((au - 3.6 * mm) / (1.5 * mm))) * np.maximum(span, mspan)
m_pink = (1 - sm((au - 2.3 * mm) / (0.6 * mm))) * np.maximum(vspan, np.maximum(sm((h_glans + h_hood) / (0.8 * mm)), 0) * (au < 3 * mm))
m_deep = sm((-inner - 3.6 * mm) / (2.0 * mm))
tint = np.ones_like(P)
for m, col in ((m_maj, MAJ), (m_out, OUTER), (m_pink, PINK), (m_deep, DEEP)):
    tint = tint * (1 - m[:, None]) + col * m[:, None]
edge = ENV[:, None]
COLOR = TI * (1 - edge + edge * tint)
BLEND = 1 - ENV                                                      # peso de la normal del cuerpo
NORMAL = NG * (1 - BLEND[:, None]) + NI * BLEND[:, None]
NORMAL /= np.linalg.norm(NORMAL, axis=1)[:, None]

# ── Malla final: triángulos, reducida (el borde no se toca), normales ───────
bmesh.ops.triangulate(bm, faces=bm.faces[:])
for f in bm.faces: f.smooth = True
me = bpy.data.meshes.new('Skin_Genitals'); bm.to_mesh(me); bm.free()
obj = bpy.data.objects.new('Skin_Genitals', me)
bpy.context.scene.collection.objects.link(obj)
if len(me.polygons) > FACES:
    vg = obj.vertex_groups.new(name='interior'); vg.add([int(i) for i in np.nonzero(~boundary)[0]], 1.0, 'REPLACE')
    m = obj.modifiers.new('reduce', 'DECIMATE'); m.ratio = FACES / len(me.polygons); m.vertex_group = 'interior'
    m.use_symmetry = True; m.symmetry_axis = 'X'
    dg = bpy.context.evaluated_depsgraph_get(); dg.update()
    new = bpy.data.meshes.new_from_object(obj.evaluated_get(dg), depsgraph=dg)
    obj.modifiers.clear(); obj.vertex_groups.clear(); obj.data = new; bpy.data.meshes.remove(me); me = new; me.name = 'Skin_Genitals'
GV = np.array([v.co[:] for v in me.vertices])
KD = kdtree.KDTree(len(P))
for i, p in enumerate(P): KD.insert(p, i)
KD.balance()
src = np.array([KD.find(p)[1] for p in GV])
moved = np.linalg.norm(GV - P[src], axis=1)
log(f'piel de la vulva: {len(me.vertices)} vértices, {len(me.polygons)} caras; borde intacto: '
    f'{int((boundary[src] & (moved < 1e-7)).sum())} de {int(boundary.sum())} vértices')
me.normals_split_custom_set_from_vertices([tuple(n) for n in NORMAL[src]])
col = me.color_attributes.new('Tono', 'FLOAT_COLOR', 'POINT')
col.data.foreach_set('color', np.c_[COLOR[src], np.ones(len(src))].ravel())
me.color_attributes.active_color = col

# ── Qué órganos externos quedan fuera de la piel ───────────────────────────
bmv = bmesh.new(); bmv.from_mesh(me); GT = bvhtree.BVHTree.FromBMesh(bmv); bmv.free()
with bpy.data.libraries.load(os.path.join(ROOT, 'build', 'female_urogenital.blend')) as (srcl, dst):
    dst.objects = [n for n in srcl.objects if n in ('Glans_of_clitoris', 'Body_of_clitoris', 'Bulb_of_vestibule_L', 'Bulb_of_vestibule_R',
                                                     'Urethra', 'Vagina', 'Duct_of_greater_vestibular_gland_L')]
for o in dst.objects:
    bpy.context.scene.collection.objects.link(o)
bpy.context.view_layer.update()
for o in dst.objects:
    W = np.array([(o.matrix_basis @ v.co)[:] for v in o.data.vertices])
    out = 0; worst = 0.0
    for p in W:
        loc, nrm, _, dist = GT.find_nearest(Vector(p))
        if loc is not None and dist < 0.01 and (Vector(p) - loc).dot(nrm) > 0.0003:
            out += 1; worst = max(worst, dist)
    log(f'  {o.name}: {out} vértices por fuera de la vulva' + (f' (hasta {worst * 1000:.1f} mm)' if out else ''))
for o in dst.objects: bpy.data.objects.remove(o)

# ── Material y propiedades; guardado ───────────────────────────────────────
me.materials.clear(); me.materials.append(skin.data.materials[0])
for k, v in {'anato3d_id': 'integument_skin_genitals', 'system': 'integumentary', 'subsystem': 'skin', 'tissue': 'skin',
             'name_en': 'Vulva', 'name_la': 'Vulva', 'name_es': 'Vulva',
             'source': 'Anato3D: modelada sobre la piel de MakeHuman con las referencias de tools/female_perineum.py'}.items():
    obj[k] = v
colc = bpy.data.collections.new('Genital_Skin'); colc.objects.link(obj)
out = os.path.join(ROOT, 'build', 'female_integumentary.blend')
bpy.data.libraries.write(out, {colc}, fake_user=True)
json.dump({'groups': {}}, open(os.path.join(ROOT, 'web/public/models/female-integumentary.json'), 'w'))
log('guardado', out)
