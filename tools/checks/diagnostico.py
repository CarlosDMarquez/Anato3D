"""Diagnóstico de un problema concreto que señala tools/check_all.sh: dónde entra una pieza en el hueso, por qué una pareja
no es simétrica, dónde está un pico o qué disco intervertebral se mete en una vértebra.

Uso (desde la raíz del proyecto; modelo femenino: A3D_MODEL=female y su Fase 2):
  B=/Applications/Blender.app/Contents/MacOS/Blender
  A3D_MODEL=male $B -b --disable-autoexec Anato3D_Male_30_Fase2.blend --python tools/checks/diagnostico.py -- <orden> …

Órdenes:
  hueso <sistemas> [nombres]   piezas de esos sistemas (separados por comas) con más del 3 % de sus vértices dentro de
                               un hueso: en cuáles y hasta qué profundidad. Con nombres (separados por comas), solo esas.
  asimetria <nombres>          para cada nombre sin lado (p. ej. «Vagus_nerve»): trozos sueltos de cada lado y vértices a
                               más de 8 mm de la pareja reflejada, con su centro.
  picos <nombres>              las aristas más largas de esas mallas, con su longitud y su posición.
  discos                       cada disco intervertebral y núcleo pulposo: altura y qué vértebras invaden (y cuánto).

Lo que mide es lo último construido en build/<modelo>_<sistema>.blend, junto a la Fase 2.
Recuperado el 2026-11-08 de la revisión de errores del 2026-11-01 (inbone_where.py, outliers.py, spike_find.py y
discs.py, que solo estaban en una carpeta temporal).
"""
import bpy, bmesh, os, re, sys, collections
import numpy as np
from mathutils import Vector, bvhtree, kdtree

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
MODEL = os.environ.get('A3D_MODEL', 'male')
SYSTEMS = {'muscular': 'Muscular_System', 'connective': 'Connective_System', 'arterial': 'Arterial_System',
           'venous': 'Venous_System', 'nervous': 'Nervous_System', 'respiratory': 'Respiratory_System',
           'digestive': 'Digestive_System', 'urogenital': 'Urogenital_System', 'endocrine': 'Endocrine_System',
           'lymphatic': 'Lymphatic_System', 'integumentary': 'Genital_Skin'}
DIRS = [Vector(v) for v in ((1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1))]
argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
base = lambda n: re.sub(r'\.\d{3}$', '', n)


def load(systems):
    for s in systems:
        path = os.path.join(ROOT, 'build', f'{MODEL}_{s}.blend')
        if not os.path.exists(path):
            print('falta', path)
            continue
        with bpy.data.libraries.load(path) as (src, dst):
            dst.collections = [SYSTEMS[s]]
        bpy.context.scene.collection.children.link(dst.collections[0])
    bpy.context.view_layer.update()


def world(o):
    m = np.array(o.matrix_world)
    co = np.empty(len(o.data.vertices) * 3)
    o.data.vertices.foreach_get('co', co)
    return co.reshape(-1, 3) @ m[:3, :3].T + m[:3, 3]


def bvh_world(o):
    bm = bmesh.new()
    bm.from_mesh(o.data)
    bm.transform(o.matrix_world)
    closed = all(e.is_manifold for e in bm.edges)
    sign = 1.0 if bm.calc_volume(signed=True) >= 0 else -1.0
    t = bvhtree.BVHTree.FromBMesh(bm)
    bm.free()
    return t, sign, closed


def parity(t, p):
    """Dentro de una malla cerrada: número impar de cortes en al menos 4 de 6 direcciones."""
    odd = 0
    for d in DIRS:
        o, n = Vector(p), 0
        while n < 24:
            h = t.ray_cast(o + d * 1e-5, d)[0]
            if h is None:
                break
            n += 1
            o = h
        odd += n % 2
    return odd >= 4


def kd(P):
    t = kdtree.KDTree(len(P))
    for i, q in enumerate(P):
        t.insert(q, i)
    t.balance()
    return t


def by_name():
    return {base(o.name): o for o in bpy.context.scene.objects if o.type == 'MESH'}


def hueso(systems, names=None):
    load(systems)
    bones = {base(o.name): bvh_world(o) for o in bpy.context.scene.objects if o.type == 'MESH' and o.get('system') == 'skeletal'}
    for o in sorted(bpy.context.scene.objects, key=lambda o: o.name):
        if o.type != 'MESH' or o.get('system') == 'skeletal' or o.get('system') not in systems:
            continue
        if names and base(o.name) not in names:
            continue
        V = world(o)
        P = V[::max(1, len(V) // 400)]
        hits, deep = collections.Counter(), collections.defaultdict(float)
        for p in P:
            pv = Vector(p)
            for bn, (t, sign, closed) in bones.items():
                loc, nrm, _, dist = t.find_nearest(pv, 0.012)
                if loc is None:
                    continue
                depth = -(pv - loc).dot(nrm) * sign
                # Lejos de un hueso fino la normal de la cara más cercana engaña: más de 6 mm se confirma por paridad.
                if depth > 0.0003 and (depth < 0.006 or (closed and parity(t, pv))):
                    hits[bn] += 1
                    deep[bn] = max(deep[bn], depth)
                    break
        frac = sum(hits.values()) / len(P)
        if frac > 0.03 or names:
            detalle = ', '.join(f'{b} {c / len(P) * 100:.0f} % (hasta {deep[b] * 1000:.1f} mm)' for b, c in hits.most_common(4))
            print(f'[hueso] {o.name}: {frac * 100:.0f} % dentro{": " + detalle if detalle else ""}')


def asimetria(names):
    load(list(SYSTEMS))
    objs = by_name()
    for n in names:
        a, b = objs.get(n + '_L'), objs.get(n + '_R')
        if not a or not b:
            print(f'[asimetria] {n}: falta {"_L" if not a else "_R"}')
            continue
        A, B = world(a), world(b) * np.array([-1.0, 1, 1])
        ta, tb = kd(A), kd(B)
        da = np.array([tb.find(q)[2] for q in A])
        db = np.array([ta.find(q)[2] for q in B])

        def trozos(o):
            bm = bmesh.new()
            bm.from_mesh(o.data)
            seen, out = set(), []
            for v in bm.verts:
                if v.index in seen:
                    continue
                stack, comp = [v], 0
                seen.add(v.index)
                while stack:
                    x = stack.pop()
                    comp += 1
                    for e in x.link_edges:
                        y = e.other_vert(x)
                        if y.index not in seen:
                            seen.add(y.index)
                            stack.append(y)
                out.append(comp)
            bm.free()
            return sorted(out, reverse=True)
        ca, cb = trozos(a), trozos(b)
        print(f'[asimetria] {n}: L {len(A)} vértices en {len(ca)} trozos {ca[:5]}; R {len(B)} en {len(cb)} trozos {cb[:5]}; '
              f'máxima {max(da.max(), db.max()) * 1000:.1f} mm, mediana {np.median(np.r_[da, db]) * 1000:.2f} mm')
        for side, D, P in (('L', da, A), ('R', db, B * np.array([-1.0, 1, 1]))):
            bad = D > 0.008
            if bad.any():
                print(f'   {side}: {bad.sum()} vértices a más de 8 mm de la pareja (hasta {D.max() * 1000:.0f} mm), '
                      f'centro {np.round(P[bad].mean(0) * 100, 1).tolist()} cm')


def picos(names):
    load(list(SYSTEMS))
    objs = by_name()
    for n in names:
        o = objs.get(n)
        if not o:
            print(f'[picos] {n}: no está')
            continue
        V = world(o)
        E = np.empty(len(o.data.edges) * 2, dtype=np.int64)
        o.data.edges.foreach_get('vertices', E)
        E = E.reshape(-1, 2)
        L = np.linalg.norm(V[E[:, 0]] - V[E[:, 1]], axis=1)
        print(f'[picos] {n}: mediana de las aristas {np.median(L) * 1000:.2f} mm')
        for k in np.argsort(-L)[:8]:
            i, j = E[k]
            print(f'   {L[k] * 1000:7.1f} mm  v{i} {np.round(V[i] * 100, 2).tolist()} → v{j} {np.round(V[j] * 100, 2).tolist()} cm')


def discos():
    load(['connective'])
    vert = {base(o.name): (bvh_world(o)[0], world(o)) for o in bpy.context.scene.objects
            if o.type == 'MESH' and o.get('system') == 'skeletal' and base(o.name).startswith('Vertebra')}
    for o in sorted(bpy.context.scene.objects, key=lambda o: o.name):
        if o.type != 'MESH' or not re.search(r'ntervertebral|ucleus_pulposus', o.name):
            continue
        V = world(o)
        c = V.mean(0)
        res = []
        for vn, (t, Vb) in vert.items():
            if np.linalg.norm(Vb.mean(0) - c) > 0.06:
                continue
            f = np.mean([parity(t, p) for p in V[::max(1, len(V) // 150)]])
            if f > 0.02:
                res.append(f'{vn} {f * 100:.0f} %')
        print(f'[discos] {o.name:40s} alto {np.ptp(V[:, 2]) * 1000:5.1f} mm, z {c[2] * 100:6.1f} cm; dentro de: {", ".join(res) or "ninguna"}')


if not argv:
    print(__doc__)
elif argv[0] == 'hueso':
    hueso(argv[1].split(','), set(argv[2].split(',')) if len(argv) > 2 else None)
elif argv[0] == 'asimetria':
    asimetria(argv[1].split(','))
elif argv[0] == 'picos':
    picos(argv[1].split(','))
elif argv[0] == 'discos':
    discos()
else:
    raise SystemExit(f'orden desconocida: {argv[0]}')
