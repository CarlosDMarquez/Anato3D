"""Fase 3: extrae el sistema muscular de Z-Anatomy y lo ajusta al cuerpo de Anato3D (ver anato3d_fit.py).

Uso (desde la raíz del proyecto):
  /Applications/Blender.app/Contents/MacOS/Blender -b --disable-autoexec \
    sources/z-anatomy/extracted/Z-Anatomy/Startup.blend \
    --python tools/build_muscular.py -- [--budget 450000] [--only "deltoid,biceps"]

Salida: build/male_muscular.blend, build/male_muscular.json y web/public/models/male-muscular.json.
"""
import bpy, bmesh, os, sys, json, collections
import numpy as np
from mathutils import Matrix, Vector, bvhtree
sys.path.insert(0, os.path.dirname(__file__))
from anato3d_fit import (Fitter, Extractor, Groups, bonus_paths, deepest, es, la, sanitize, source_name,
                         is_structure, principled, save, log, parse_args)

opt = parse_args({'budget': 500000, 'only': None})

FUNCTION_ES = {
    'Abductor': 'Abducción', 'Adductor': 'Aducción', 'Extension': 'Extensión', 'Flexion': 'Flexión',
    'Levator': 'Elevación', 'Depressor': 'Descenso', 'External rotation': 'Rotación externa',
    'Internal rotator': 'Rotación interna', 'Orbicularis/Constrictor': 'Cierre de orificios (esfínter)',
    'Flexion fingers': 'Flexión de los dedos', 'Extensor extremities': 'Extensión de los dedos',
    'Extension hand/foot': 'Extensión de la mano o del pie', 'Flexion hand/foot': 'Flexión de la mano o del pie',
    'Biarticular': 'Músculo biarticular', 'Ingestion': 'Deglución', 'Phonation': 'Fonación',
    'Masticator': 'Masticación', 'Diaphragm': 'Respiración',
}
# Músculos internos de cabeza, cuello y pelvis: no están junto a la piel, el ajuste por huesos ya los
# coloca bien, y la piel de MakeHuman tiene aberturas (boca, ojos) que confundirían la corrección.
INTERNAL = ('pterygoid', 'glossus', 'geniohyoid', 'palat', 'pharyng', 'superior rectus', 'inferior rectus', 'lateral rectus',
            'medial rectus', 'superior oblique', 'inferior oblique', 'levator palpebrae', 'tendinous ring', 'trochlea',
            'longus colli', 'longus capitis', 'rectus anterior capitis', 'rectus lateralis capitis', 'coccyg', 'levator ani',
            'pubo', 'diaphragm', 'transversus thoracis', 'innermost intercostal', 'psoas', 'iliacus', 'quadratus lumborum')
INTERNAL_REGIONS = {'Pharyngeal muscles', 'Laryngeal muscles'}
NON_MUSCLE = {'Fascia', 'Bursa', 'Articular capsule', 'Ligament', 'Cartilage', 'Text'}
# Músculos que Z-Anatomy marca en parte como tendón y son carnosos hasta su inserción: el platisma llega muscular al
# borde de la mandíbula (salía una banda blanca a lo largo de ella, como una correa).
ALL_FLESH = {'Platysma'}
GENERIC = {'Superficial muscles', 'Muscles', 'Fascia', 'Tendon sheaths', 'Bursae', 'Synovial bursae'}

fitter = Fitter()
paths = bonus_paths()
superficial = {o.name for o in bpy.data.collections['Superficial muscles'].objects}

def region_path(name):
    cands = [p[1:] for p in paths[name] if p[0] == 'Muscular system' and p[1] not in GENERIC]
    return max(cands, key=len) if cands else ()

items = []
for o in bpy.data.collections['4: Muscular system'].objects:
    if not is_structure(o): continue
    # Los músculos de Z-Anatomy tienen un material por cara: el del vientre (según su acción) y «Tendon» en las partes
    # tendinosas. El material «activo» es arbitrario (el esternocleidomastoideo izquierdo salía entero como tendón y el
    # derecho como músculo): se cuentan las caras de cada uno.
    slots = [sl.material.name if sl.material else None for sl in o.material_slots]
    counts = collections.Counter(pl.material_index for pl in o.data.polygons)
    tendon_faces = sum(c for i, c in counts.items() if i < len(slots) and slots[i] == 'Tendon')
    belly = max((i for i in counts if i < len(slots) and slots[i] not in (None, 'Tendon')), key=counts.get, default=None)
    mat = slots[belly] if belly is not None else (slots[0] if slots else None)
    if mat in NON_MUSCLE: continue
    base, side = source_name(o.name)
    if opt['only'] and not any(k in base.lower() for k in opt['only']): continue
    tissue = 'tendon' if not counts or tendon_faces / sum(counts.values()) > 0.9 else 'muscle'
    items.append({'obj': o, 'src': o.name, 'base': base, 'side': side, 'mat': mat, 'tissue': tissue, 'slots': slots})

ex = Extractor(fitter, [it['obj'] for it in items], opt['budget'])
TONES = [(0.50, 0.10, 0.08), (0.56, 0.12, 0.09), (0.46, 0.09, 0.08), (0.53, 0.13, 0.11), (0.48, 0.11, 0.07)]
MATS = {f'muscle_{i}': principled(f'MAT_Muscle_{i}', t, 0.5, coat=0.25) for i, t in enumerate(TONES)}
MATS['tendon'] = principled('MAT_Tendon', (0.86, 0.82, 0.74), 0.38, coat=0.35)

stats = []
for n, it in enumerate(items):
    o = it['obj']
    rp = region_path(it['src'])
    name = sanitize(it['base']) + (f'_{it["side"]}' if it['side'] else '')
    internal = any(k in it['base'].lower() for k in INTERNAL) or any(g in INTERNAL_REGIONS for g in rp)
    # Los superficiales se ven de cerca: más detalle; los profundos, menos (con el 23 % se veían facetas).
    # Fuera del hueso: 58 músculos entraban más de un 3 % en él (la cabeza cubital del extensor cubital del carpo, un
    # 31 %; el aductor mayor, 6 mm); el ajuste por huesos vecinos los mete en el hueso y a la vista sin esqueleto
    # se veían deformes. Se llevan a su superficie (+0,5 mm), como se insertan en realidad.
    obj, moved, worst = ex.fit(o, name, skin_offset=None if internal else 0.0015,
                               detail=1.8 if it['src'] in superficial else 0.75, keep_slots=True, out_of_bone=True)
    me = obj.data
    belly_mat = MATS[f'muscle_{sum(map(ord, it["base"])) % 5}']
    if it['tissue'] == 'tendon':
        me.materials.append(MATS['tendon'])
        for pl in me.polygons: pl.material_index = 0
    else:
        # Una ranura por ranura de Z-Anatomy (las caras conservan su índice): vientre rojo y partes tendinosas blancas.
        for sl in it['slots'] or [None]:
            me.materials.append(MATS['tendon'] if sl == 'Tendon' and it['base'] not in ALL_FLESH else belly_mat)
    nerves = sorted({p[-1] for p in deepest(paths, it['src'], 'Nervous system')})
    obj['anato3d_id'] = 'muscle_' + name.lower()
    obj['system'] = 'muscular'
    obj['tissue'] = it['tissue']
    obj['superficial'] = it['src'] in superficial
    obj['name_en'] = it['base']
    obj['name_la'] = la(it['base']) or ''
    obj['name_es'] = es(it['base']) or ''
    obj['region'] = json.dumps([sanitize(g) for g in rp])
    obj['innervation_es'] = json.dumps([es(x) or x for x in nerves], ensure_ascii=False)
    obj['function_es'] = FUNCTION_ES.get(it['mat'], '')
    obj['source'] = f'Z-Anatomy object "{it['src']}" (BodyParts3D, DBCLS) CC BY-SA 4.0; refitted to the Anato3D skin'
    it.update(out=obj, region=rp)
    stats.append({'name': name, 'faces': len(me.polygons), 'moved_out_of_skin': moved, 'verts': len(me.vertices), 'worst_mm': round(worst * 1000, 1)})
    if n % 50 == 0: log(f'  {n}/{len(items)} {name}: {len(me.polygons)} caras, {moved}/{len(me.vertices)} vértices corregidos por la piel')

# ── Capas: superficial / intermedia / profunda ──────────────────────────────
# Superficial: lo que se ve al quitar la piel. Profunda: lo que queda cubierto y descansa directamente sobre el hueso
# (o las vísceras), sin otro músculo debajo; intermedia: lo que tiene músculos encima y debajo. Antes «profunda» era
# «bajo dos capas de músculo», y en la pierna o el hombro, que tienen dos planos, nunca se llegaba: la capa profunda
# no mostraba el tibial posterior, el poplíteo ni el manguito de los rotadores.
verts, polys, owner = [], [], []
for k, it in enumerate(items):
    me = it['out'].data; mw = Matrix.Translation(it['out'].location); off = len(verts)
    verts += [mw @ v.co for v in me.vertices]
    for p in me.polygons:
        polys.append([off + i for i in p.vertices]); owner.append(k)
bvh = bvhtree.BVHTree.FromPolygons(verts, polys)
def first_other(k, o, d, reach):
    """Primer músculo distinto de k en la dirección d (a menos de `reach`), y a qué distancia del origen."""
    start = o
    for _ in range(4):
        hit, _, fi, dist = bvh.ray_cast(o + d * 0.0005, d, reach)
        if hit is None: return None, None
        if owner[fi] != k: return owner[fi], (hit - start).length
        o = hit
    return None, None
covered, beneath = [], []
for k, it in enumerate(items):
    me = it['out'].data; mw = Matrix.Translation(it['out'].location)
    hits = collections.Counter(); outer = inner = under = 0
    for i in range(0, len(me.vertices), max(1, len(me.vertices) // 200)):
        v = me.vertices[i]
        origin = mw @ v.co
        loc, _, _, dist = fitter.skin.find_nearest(origin)
        if loc is None or dist < 1e-4: continue
        d = (loc - origin).normalized(); n = v.normal.normalized()
        if n.dot(d) > 0.3:                                    # cara externa: ¿la tapa otro músculo antes de la piel?
            outer += 1
            j, _ = first_other(k, origin, d, dist)
            if j is not None: hits[j] += 1
        elif n.dot(d) < -0.3:                                 # cara interna: ¿hay otro músculo antes que el hueso?
            inner += 1
            j, dm = first_other(k, origin, n, 0.04)
            if j is not None:
                hit = origin + n * dm
                bone = fitter.fase2_bones.ray_cast(origin + n * 0.0005, n, 0.04)[0]
                # Solo si está de verdad más hondo (4 mm más lejos de la piel): el vecino de al lado no cuenta (el
                # tibial posterior «tenía músculo debajo» por el flexor largo del dedo gordo, que va a su lado).
                if (bone is None or (bone - origin).length > dm) and fitter.skin.find_nearest(hit)[3] > dist + 0.004:
                    under += 1
    covered.append(sum(hits.values()) / max(outer, 1) >= 0.4)
    # Calibrado con los de libro: sobre el hueso, 0–0,17 (poplíteo, supraespinoso, braquial, vasto intermedio,
    # supinador); con un plano debajo, 0,18–0,44 (sóleo, intercostales internos, romboides, glúteo medio, oblicuo interno).
    beneath.append(under / max(inner, 1) >= 0.18)
layer = []
for k, it in enumerate(items):
    if it['out']['superficial'] or not covered[k]: layer.append(1)
    else: layer.append(2 if beneath[k] else 3)
for k, it in enumerate(items):
    it['out']['layer'] = layer[k]
log('capas:', collections.Counter(layer))

# ── Separación entre músculos ───────────────────────────────────────────────
# El ajuste mezcla las transformaciones de huesos vecinos y algunos músculos acaban unos dentro de otros (73 parejas
# con más del 5 % de vértices dentro de otra, hasta 8 mm: el aductor largo en el vasto medial, el subclavio en el
# pectoral mayor). Cede el más profundo (por capa y, a igual capa, el más alejado de la piel): sus vértices que quedan
# dentro del otro pasan a su superficie (+0,4 mm), el desplazamiento se extiende con suavidad a los vecinos (sin
# hoyos) y nada vuelve a entrar en el hueso. Dos rondas, por si al salir de uno entra en un tercero.
DIRS6 = [Vector(d) for d in ((1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1))]
def inside_mesh(T, p):
    odd = 0
    for d in DIRS6:
        o, n = p, 0
        while n < 16:
            hit = T.ray_cast(o + d * 1e-5, d)[0]
            if hit is None: break
            n += 1; o = hit
        odd += n % 2
    return odd >= 5
def mesh_state(it):
    me = it['out'].data; loc = np.array(it['out'].location)
    V = np.empty(len(me.vertices) * 3); me.vertices.foreach_get('co', V); V = V.reshape(-1, 3) + loc
    bm = bmesh.new(); bm.from_mesh(me); bm.transform(Matrix.Translation(it['out'].location))
    closed = all(e.is_manifold for e in bm.edges)
    sign = 1.0 if bm.calc_volume(signed=True) >= 0 else -1.0
    T = bvhtree.BVHTree.FromBMesh(bm); bm.free()
    return dict(V=V, T=T, lo=V.min(0), hi=V.max(0), closed=closed, sign=sign, loc=loc)
skin_depth = []
for it in items:
    me = it['out'].data; mw = Matrix.Translation(it['out'].location)
    step = max(1, len(me.vertices) // 60)
    skin_depth.append(np.mean([fitter.skin.find_nearest(mw @ me.vertices[i].co)[3] for i in range(0, len(me.vertices), step)]))
for rnd in range(2):
    state = [mesh_state(it) for it in items]
    req = collections.defaultdict(dict)                       # músculo → {vértice: desplazamiento}
    for a, A in enumerate(state):
        for b, B in enumerate(state):
            if a == b or not B['closed'] or (A['lo'] > B['hi']).any() or (A['hi'] < B['lo']).any(): continue
            if (layer[a], skin_depth[a]) < (layer[b], skin_depth[b]): continue      # cede el más profundo (a)
            sel = np.where(((A['V'] >= B['lo']) & (A['V'] <= B['hi'])).all(1))[0]
            for i in sel:
                p = Vector(A['V'][i])
                loc, nrm, _, dist = B['T'].find_nearest(p, 0.015)
                if loc is None or dist < 0.0005 or (p - loc).dot(nrm) * B['sign'] > 0: continue
                if not inside_mesh(B['T'], p): continue
                d = np.array(loc + nrm * B['sign'] * 0.0004 - p)
                if i not in req[a] or np.linalg.norm(d) > np.linalg.norm(req[a][i]): req[a][i] = d
    total = 0
    for a, moves in req.items():
        it = items[a]; me = it['out'].data; A = state[a]
        E = np.empty(len(me.edges) * 2, dtype=np.int64); me.edges.foreach_get('vertices', E); E = E.reshape(-1, 2)
        deg = np.maximum(np.bincount(E.ravel(), minlength=len(A['V'])), 1)[:, None]
        D = np.zeros_like(A['V']); fixed = np.zeros(len(A['V']), bool)
        for i, d in moves.items(): D[i] = d; fixed[i] = True
        D0 = D.copy()
        for _ in range(6):
            acc = np.zeros_like(D); np.add.at(acc, E[:, 0], D[E[:, 1]]); np.add.at(acc, E[:, 1], D[E[:, 0]])
            D = np.where(fixed[:, None], D0, 0.5 * D + 0.5 * acc / deg)
        V = A['V'] + D
        fitter.push_out_of_bone(V)
        me.vertices.foreach_set('co', (V - A['loc']).ravel()); me.update()
        total += len(moves)
    log(f'separación, ronda {rnd + 1}: {len(req)} músculos ceden, {total} vértices sacados de otro músculo')

groups = Groups('Muscular_System')
for it in items:
    groups.collection(it['region']).objects.link(it['out'])
save('male_muscular', groups, stats, {'ratio': ex.ratio, 'layers': dict(collections.Counter(layer))})
