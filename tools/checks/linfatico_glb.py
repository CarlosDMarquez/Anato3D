"""Comprueba en el GLB publicado del linfático (no en el .blend) los ganglios: piezas, n.º de ganglios, vértices por
ganglio, eje largo frente al objetivo de su grupo (lymphatics.SIZES) y simetría izquierda/derecha. Hito 9.
Y los vasos linfáticos generados (segunda parte): que estén todas las piezas del contrato (lymphatics.VPIECES) con su
grupo, tejido, «major» y material; que la geometría exportada conserve los extremos de cada tubo medidos al construir
(build/linfatico/comprobaciones-<modelo>.json) y que cada extremo toque otro tubo, un ganglio o el ángulo venoso en el
propio GLB (cabos sueltos = solo los orígenes distales declarados); final del conducto torácico y del conducto linfático
derecho frente al ángulo venoso; n.º de mallas y tamaño del archivo.

Uso (desde la raíz del proyecto):
  /Applications/Blender.app/Contents/MacOS/Blender -b --factory-startup --python-exit-code 1 \
    --python tools/checks/linfatico_glb.py -- web/public/models/male-lymphatic.glb [salida.json]
"""
import bpy, bmesh, sys, os, re, json
import numpy as np

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
argv = sys.argv[sys.argv.index('--') + 1:]
GLB, OUT = argv[0], (argv[1] if len(argv) > 1 else None)

SIZES = None
src = open(os.path.join(ROOT, 'tools', 'lymphatics.py'), encoding='utf-8').read()
import ast
for node in ast.parse(src).body:
    if isinstance(node, ast.Assign) and getattr(node.targets[0], 'id', '') in ('SIZES', 'MIN_SCALE', 'VARIATION'):
        globals()[node.targets[0].id] = ast.literal_eval(node.value)


def target(base):
    for pat, mm in SIZES:
        if re.search(pat, base): return mm
    return 6.0


for o in list(bpy.data.objects): bpy.data.objects.remove(o)
bpy.ops.import_scene.gltf(filepath=GLB)
pieces, bad = {}, []
for o in bpy.data.objects:
    if o.type != 'MESH': continue
    ex = {k: o[k] for k in o.keys() if isinstance(o[k], (str, int, float, bool))}
    if ex.get('tissue') != 'node': continue
    bm = bmesh.new(); bm.from_mesh(o.data); bm.transform(o.matrix_world)
    islands, seen = [], set()
    bm.verts.ensure_lookup_table()
    for v in bm.verts:
        if v.index in seen: continue
        st, comp = [v], []; seen.add(v.index)
        while st:
            x = st.pop(); comp.append(x.co[:])
            for e in x.link_edges:
                y = e.other_vert(x)
                if y.index not in seen: seen.add(y.index); st.append(y)
        islands.append(np.array(comp))
    bm.free()
    name = re.sub(r'\.\d{3}$', '', o.name)
    base = re.sub(r'_[LR]$', '', name)
    rows = []
    for P in islands:
        c = P.mean(0); ext = np.ptp((P - c) @ np.linalg.svd(P - c)[2].T, axis=0) * 1000
        rows.append({'c': c.tolist(), 'ext_mm': sorted(ext.tolist(), reverse=True), 'verts': len(P)})
    pieces[name] = {'base': base, 'target_mm': target(base), 'nodes': rows}
ratio, verts, out_of_range = [], set(), []
for name, p in pieces.items():
    for r in p['nodes']:
        verts.add(r['verts'])
        q = r['ext_mm'][0] / p['target_mm']; ratio.append(q)
        if q < MIN_SCALE * (1 - VARIATION) - 0.02 or q > (1 + VARIATION) * 1.05: out_of_range.append((name, round(q, 2)))
asym = []
for name, p in pieces.items():
    if not name.endswith('_L') or name[:-2] + '_R' not in pieces: continue
    A = np.array([r['c'] for r in p['nodes']]); B = np.array([r['c'] for r in pieces[name[:-2] + '_R']['nodes']])
    B[:, 0] *= -1
    d = max(min(np.linalg.norm(B - a, axis=1)) for a in A) * 1000 if len(A) and len(B) else None
    asym.append((name[:-2], round(d, 2)))
asym.sort(key=lambda t: -t[1])
res = {'glb': os.path.relpath(GLB, ROOT), 'piezas_nodo': len(pieces), 'ganglios': sum(len(p['nodes']) for p in pieces.values()),
       'vertices_por_ganglio': sorted(verts), 'eje_largo_entre_objetivo': {'min': round(min(ratio), 3), 'mediana': round(float(np.median(ratio)), 3), 'max': round(max(ratio), 3)},
       'fuera_de_intervalo': out_of_range, 'asimetria_max_mm': asym[:8],
       'pares_con_asimetria_mayor_2mm': sum(1 for _, d in asym if d > 2.0), 'pares': len(asym)}
# ── Vasos linfáticos ─────────────────────────────────────────────────────────
from mathutils import kdtree
VP = None
for node in ast.parse(src).body:
    if isinstance(node, ast.Assign) and getattr(node.targets[0], 'id', '') in ('PAIRED',):
        PAIRED = ast.literal_eval(node.value) if isinstance(node.value, ast.Set) else None
vp_src = src[src.index('VPIECES = {'):src.index('PAIRED = {')]
VNAMES = re.findall(r"^    '([A-Za-z_]+)': \(", vp_src, re.M)
MAJOR = {n for n in VNAMES if re.search(r"TRUNKS, True\)", vp_src.split(f"'{n}':")[1].split('\n    \'')[0])}
expected = set()
for n in VNAMES:
    expected |= {f'{n}_L', f'{n}_R'} if n in PAIRED else {n}
meshes = [o for o in bpy.data.objects if o.type == 'MESH']
vessels, allpts = {}, []
for o in meshes:
    V = np.array([o.matrix_world @ v.co for v in o.data.vertices])
    name = re.sub(r'\.\d{3}$', '', o.name)
    if len(V): allpts.append((name, V))
    if o.get('tissue') != 'lymph_vessel': continue
    reg = o.get('region', '')
    vessels[name] = {'V': V, 'major': bool(o.get('major')), 'subsystem': o.get('subsystem'), 'region': reg,
                     'material': o.active_material.name if o.active_material else None, 'name_es': o.get('name_es'), 'name_la': o.get('name_la')}
vres = {'piezas_vaso': len(vessels), 'faltan': sorted(expected - set(vessels)), 'sobran': sorted(set(vessels) - expected),
        'mal_marcadas': sorted(n for n, v in vessels.items() if v['subsystem'] != 'vessels' or v['major'] != (re.sub(r'_[LR]$', '', n) in MAJOR)
                               or not v['name_es'] or not v['name_la']
                               or ('Lymphatic_trunks_and_ducts' if v['major'] else 'Lymphatic_vessels') not in v['region']),
        'materiales': sorted({v['material'] for v in vessels.values()}),
        'vertices_vasos': int(sum(len(v['V']) for v in vessels.values())), 'mallas': len(meshes),
        'tamano_mb': round(os.path.getsize(GLB) / 1e6, 2)}
model = 'female' if 'female' in os.path.basename(GLB) else 'male'
comp_f = os.path.join(ROOT, 'build', 'linfatico', f'comprobaciones-{model}.json')
if os.path.exists(comp_f) and vessels:
    comp = json.load(open(comp_f))
    # Islas (piezas conexas) de cada malla: un tubo dentro de una pieza de vasos, o un ganglio dentro de una de nodos.
    isl_pts, isl_name, isl_node = [], [], []
    for o in meshes:
        me = o.data; n = len(me.vertices)
        if not n: continue
        par = list(range(n))
        def find(a):
            while par[a] != a: par[a] = par[par[a]]; a = par[a]
            return a
        for poly in me.polygons:
            vs = list(poly.vertices)
            for b in vs[1:]:
                ra, rb = find(vs[0]), find(b)
                if ra != rb: par[ra] = rb
        V = np.array([o.matrix_world @ v.co for v in me.vertices])
        roots = np.array([find(i) for i in range(n)])
        for r in np.unique(roots):
            isl_pts.append(V[roots == r]); isl_name.append(re.sub(r'\.\d{3}$', '', o.name)); isl_node.append(o.get('tissue') == 'node')
    kd_all = kdtree.KDTree(sum(len(P) for P in isl_pts)); own = []
    i = 0
    for k, P in enumerate(isl_pts):
        for q in P: kd_all.insert(q, i); own.append(k); i += 1
    kd_all.balance()
    ang = {s: (np.array(a['punto_m']), a['radio_mm'] / 1000) for s, a in comp.get('angulos_venosos', {}).items()}
    moved, loose = [], []
    for e in comp.get('extremos', []):
        piece = e['pieza']
        if piece not in vessels: continue
        V = vessels[piece]['V']
        for k in ('p0', 'p1'):
            p = np.array(e[k])
            d_own = float(np.min(np.linalg.norm(V - p, axis=1)))
            if d_own > e['r'] + 0.0012: moved.append((piece, k, round(d_own * 1000, 2)))
            # Su propia isla: la del vértice más cercano de su pieza. Toca algo si otra isla (otro tubo, aunque sea de la
            # misma pieza, u otro ganglio) tiene un vértice a menos de r + 1,5 mm, si el extremo está dentro de un ganglio
            # (el tubo nace hundido en él) o si llega al ángulo venoso.
            cand = [(d, own[j]) for _, j, d in kd_all.find_range(p, 0.012)]
            mine = min((c for c in cand if isl_name[c[1]] == piece), default=(None, None))[1]
            touch = any(d <= e['r'] + 0.0015 and isl != mine for d, isl in cand)
            for isl in {c[1] for c in cand if isl_node[c[1]]}:
                P = isl_pts[isl]; c = P.mean(0)
                if np.linalg.norm(p - c) <= np.linalg.norm(P - c, axis=1).max() * 1.1: touch = True
            at_vein = any(np.linalg.norm(p - a) <= rv + 0.0015 + e['r'] for a, rv in ang.values())
            if not touch and not at_vein and not (k == 'p0' and e['distal']):
                loose.append((piece, k, [round(x, 4) for x in p]))
    vres['extremos_desplazados'] = moved
    vres['cabos_sueltos_sin_declarar'] = len(loose); vres['cabos_lista'] = loose[:20]
    vres['origenes_distales_declarados'] = sum(1 for e in comp.get('extremos', []) if e['distal'])
    for piece, side in (('Thoracic_duct', 'L'), ('Right_lymphatic_duct', 'R')):
        if piece in vessels and side in ang:
            a, rv = ang[side]
            d = float(np.min(np.linalg.norm(vessels[piece]['V'] - a, axis=1)))
            vres[f'{piece}_al_angulo_venoso_mm'] = {'distancia': round(d * 1000, 2), 'limite': round((rv + 0.0015) * 1000, 2),
                                                    'ok': d <= rv + 0.0015}
res['vasos'] = vres
print('GLB_LINF', json.dumps(res, ensure_ascii=False))
if OUT: json.dump(res, open(OUT, 'w'), ensure_ascii=False, indent=1)
