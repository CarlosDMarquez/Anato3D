"""Simetría izquierda/derecha y picos de las mallas de un modelo (hombre o mujer). Lo llama tools/check_all.sh.

Uso (desde la raíz del proyecto):
  A3D_MODEL=male /Applications/Blender.app/Contents/MacOS/Blender -b --disable-autoexec Anato3D_Male_30_Fase2.blend \
    --python-exit-code 1 --python tools/checks/simetria_picos.py [-- --systems muscular,nervous]
  Modelo femenino: A3D_MODEL=female y Anato3D_Female_30_Fase2.blend.

Carga, como tools/audit_models.py, los sistemas construidos (build/<modelo>_<sistema>.blend y la piel genital) junto a la
Fase 2 abierta, y mide:
  - Simetría: cada pieza izquierda (_L) frente a su pareja derecha (_R) reflejada en el plano sagital (x → −x). En unos 400
    vértices de cada una, la distancia a la otra: la máxima (Hausdorff) y la mediana. Una máxima alta con la mediana casi
    cero delata un pico (así se encontraron los de hasta 8 cm de los pliegues el 2026-11-01); las dos altas, una pieza
    descolocada o deformada de un solo lado. Hay asimetrías reales (el nervio vago, las arterias intercostales
    posteriores, los vasos lumbares, el surco subparietal femenino): por eso se compara con una referencia y no con cero.
  - Picos: aristas de más de 2 cm y más de 8 veces la mediana de las aristas de su malla (un vértice que salió disparado).
Escribe build/checks/<modelo>_simetria.json y build/checks/<modelo>_picos.json; tools/checks/comparar.py los compara con
la referencia guardada.

Recuperado el 2026-11-08 de la revisión de errores del 2026-11-01 (symmetry.py y spikes_all.py), que solo estaban en una
carpeta temporal: ahora mide en coordenadas del mundo, lee el modelo de A3D_MODEL y carga los sistemas como la auditoría.
"""
import bpy, os, re, sys, json, time
import numpy as np
from mathutils import kdtree

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
MODEL = os.environ.get('A3D_MODEL', 'male')
SYSTEMS = {'muscular': 'Muscular_System', 'connective': 'Connective_System', 'arterial': 'Arterial_System',
           'venous': 'Venous_System', 'nervous': 'Nervous_System', 'respiratory': 'Respiratory_System',
           'digestive': 'Digestive_System', 'urogenital': 'Urogenital_System', 'endocrine': 'Endocrine_System',
           'lymphatic': 'Lymphatic_System', 'integumentary': 'Genital_Skin'}
argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
wanted = argv[argv.index('--systems') + 1].split(',') if '--systems' in argv else list(SYSTEMS)
SAMPLES = 400          # vértices por pieza para la simetría
SPIKE_MIN = 0.02       # m: una arista de pico mide más de 2 cm…
SPIKE_RATIO = 8        # …y más de 8 veces la mediana de su malla
OUT = os.path.join(ROOT, 'build', 'checks')


def log(*a):
    print('[simetria]', *a, flush=True)


t0 = time.time()
for s in wanted:
    path = os.path.join(ROOT, 'build', f'{MODEL}_{s}.blend')
    if not os.path.exists(path):
        log('falta', path)
        continue
    with bpy.data.libraries.load(path) as (src, dst):
        dst.collections = [SYSTEMS[s]]
    bpy.context.scene.collection.children.link(dst.collections[0])
bpy.context.view_layer.update()

base = lambda n: re.sub(r'\.\d{3}$', '', n)       # Sacrum.001 → Sacrum (nombres repetidos al juntar archivos)
meshes = [o for o in bpy.context.scene.objects if o.type == 'MESH' and len(o.data.vertices)]


def world(o):
    m = np.array(o.matrix_world)
    co = np.empty(len(o.data.vertices) * 3)
    o.data.vertices.foreach_get('co', co)
    return co.reshape(-1, 3) @ m[:3, :3].T + m[:3, 3]


def system_of(o):
    return o.get('system') or ('skin' if o.name.startswith('Skin') else 'otro')


# ── Picos ─────────────────────────────────────────────────────────────────────
picos = []
W = {}
for o in meshes:
    V = world(o)
    W[o.name] = V
    if not len(o.data.edges):
        continue
    E = np.empty(len(o.data.edges) * 2, dtype=np.int64)
    o.data.edges.foreach_get('vertices', E)
    E = E.reshape(-1, 2)
    L = np.linalg.norm(V[E[:, 0]] - V[E[:, 1]], axis=1)
    med = float(np.median(L))
    bad = (L > SPIKE_MIN) & (L > SPIKE_RATIO * med)
    if bad.any():
        k = int(np.argmax(np.where(bad, L, 0)))
        picos.append({'name': o.name, 'system': system_of(o), 'n': int(bad.sum()), 'max_mm': round(float(L[k]) * 1000, 1),
                      'median_mm': round(med * 1000, 2), 'at_cm': [round(float(x) * 100, 1) for x in V[E[k]].mean(0)]})
log(f'picos: {len(picos)} mallas con aristas sospechosas')


# ── Simetría ──────────────────────────────────────────────────────────────────
def tree(P):
    t = kdtree.KDTree(len(P))
    for i, q in enumerate(P):
        t.insert(q, i)
    t.balance()
    return t


by_key = {}
for o in meshes:
    by_key.setdefault((system_of(o), base(o.name)), []).append(o)
simetria = []
for (sysname, name), objs in sorted(by_key.items()):
    if not name.endswith('_L'):
        continue
    other = by_key.get((sysname, name[:-2] + '_R'))
    if not other or len(objs) != 1 or len(other) != 1:
        continue
    A, B = W[objs[0].name], W[other[0].name] * np.array([-1.0, 1.0, 1.0])
    if len(A) < 4 or len(B) < 4:
        continue
    ta, tb = tree(A), tree(B)
    sa, sb = A[::max(1, len(A) // SAMPLES)], B[::max(1, len(B) // SAMPLES)]
    da = np.array([tb.find(q)[2] for q in sa])
    db = np.array([ta.find(q)[2] for q in sb])
    size = float(np.ptp(np.vstack([A, B]), axis=0).max())
    simetria.append({'name': name[:-2], 'system': sysname, 'max_mm': round(float(max(da.max(), db.max())) * 1000, 1),
                     'median_mm': round(float(np.median(np.r_[da, db])) * 1000, 2), 'size_cm': round(size * 100, 1)})
log(f'simetría: {len(simetria)} parejas; máxima ≥ 10 mm en {sum(s["max_mm"] >= 10 for s in simetria)}')

os.makedirs(OUT, exist_ok=True)
for nombre, datos in (('simetria', simetria), ('picos', picos)):
    with open(os.path.join(OUT, f'{MODEL}_{nombre}.json'), 'w') as f:
        json.dump(datos, f, ensure_ascii=False, indent=0)
log(f'listo en {time.time() - t0:.0f} s: build/checks/{MODEL}_simetria.json y {MODEL}_picos.json')
