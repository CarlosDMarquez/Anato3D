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
SHEETS = {'Platysma'}
# Láminas anchas de la pared del abdomen, entre las costillas y la pelvis: la mezcla de las transformaciones de costillas,
# cartílagos y coxal las arrugaba (el recto pasaba de 15 a 136 aristas dobladas) y los pliegues se veían a través de la
# vaina. Se suaviza el desplazamiento donde se pliega (ver Extractor.fit); lo que entra en el hueso se saca después.
WALL = {'Rectus abdominis muscle', 'External abdominal oblique muscle', 'Internal abdominal oblique muscle',
        'Transversus abdominis muscle'}
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
# Aponeurosis de los músculos anchos del abdomen: blanca; el visor toma la opacidad del alfa del color de cada vértice
# (velo delante del recto, blanca a los lados).
MATS['aponeurosis'] = principled('MAT_Aponeurosis', (0.9, 0.87, 0.83), 0.35, coat=0.35)

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
                               detail=1.8 if it['src'] in superficial else 0.75, keep_slots=True, out_of_bone=True,
                               smooth=4 if it['base'] in WALL else 0)
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
    # Lámina muscular de la piel (platisma): el visor la dibuja translúcida, como en los atlas, para que se vean el
    # esternocleidomastoideo y los infrahioideos que cubre.
    if it['base'] in SHEETS: obj['sheet'] = True
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
def move_smoothly(obj, V, D, fixed):
    """Desplaza los vértices `fixed` en D (mundo) y extiende el desplazamiento con suavidad a sus vecinos, sin que nada
    vuelva a entrar en el hueso."""
    me = obj.data
    E = np.empty(len(me.edges) * 2, dtype=np.int64); me.edges.foreach_get('vertices', E); E = E.reshape(-1, 2)
    deg = np.maximum(np.bincount(E.ravel(), minlength=len(V)), 1)[:, None]
    D0 = D.copy()
    for _ in range(6):
        acc = np.zeros_like(D); np.add.at(acc, E[:, 0], D[E[:, 1]]); np.add.at(acc, E[:, 1], D[E[:, 0]])
        D = np.where(fixed[:, None], D0, 0.5 * D + 0.5 * acc / deg)
    V = V + D
    fitter.push_out_of_bone(V)
    me.vertices.foreach_set('co', (V - np.array(obj.location)).ravel()); me.update()
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
        it = items[a]; A = state[a]
        D = np.zeros_like(A['V']); fixed = np.zeros(len(A['V']), bool)
        for i, d in moves.items(): D[i] = d; fixed[i] = True
        move_smoothly(it['out'], A['V'], D, fixed)
        total += len(moves)
    log(f'separación, ronda {rnd + 1}: {len(req)} músculos ceden, {total} vértices sacados de otro músculo')

# ── Bordes de los tendones ──────────────────────────────────────────────────
# Z-Anatomy marca el tendón cara a cara: el borde entre vientre y tendón salía en dientes de sierra, y las intersecciones
# tendinosas del recto, deshilachadas. Se corta por la isolínea de la fracción de tendón de cada vértice (por área de sus
# caras): la escalera de triángulos queda como una línea y se van los dientes y las islas sueltas. Si el tendón cambia más
# de un 25 % de área (una tira fina que desaparecería), el músculo se deja como estaba.
def cut_iso(obj, F, slot_of, accept=lambda bm: True):
    """Corta la malla por la isolínea F = 0 (F por vértice) y da a cada cara la ranura slot_of(cara, F medio).
    Devuelve False (y no toca la malla) si accept(bmesh) lo rechaza."""
    me = obj.data
    bm = bmesh.new(); bm.from_mesh(me)
    fl = bm.verts.layers.float.new('field'); new = bm.verts.layers.int.new('new')
    for v, f in zip(bm.verts, F): v[fl] = f if f != 0 else 1e-9
    for e in [e for e in bm.edges if (e.verts[0][fl] < 0) != (e.verts[1][fl] < 0)]:
        a, b = e.verts
        t = min(max(a[fl] / (a[fl] - b[fl]), 0.05), 0.95)
        co = a.co.lerp(b.co, t)
        nv = bmesh.utils.edge_split(e, a, t)[1]
        nv.co = co; nv[fl] = 0.0; nv[new] = 1
    for f in list(bm.faces):
        vs = [v for v in f.verts if v[new]]
        if len(vs) == 2:
            try: bmesh.utils.face_split(f, vs[0], vs[1])
            except ValueError: pass
    for f in bm.faces:
        f.material_index = slot_of(f, sum(v[fl] for v in f.verts) / len(f.verts))
    bm.verts.layers.float.remove(fl); bm.verts.layers.int.remove(new)
    ok = accept(bm)
    if ok: bm.to_mesh(me); me.update()
    bm.free()
    return ok

passes = collections.Counter()
for it in items:
    me = it['out'].data
    tendon = [i for i, m in enumerate(me.materials) if m == MATS['tendon']]
    if it['tissue'] == 'tendon' or not tendon or len(tendon) == len(me.materials): continue
    idx = np.empty(len(me.polygons), dtype=np.int32); me.polygons.foreach_get('material_index', idx)
    is_t = np.isin(idx, tendon)
    if not is_t.any() or is_t.all(): continue
    area = np.empty(len(me.polygons)); me.polygons.foreach_get('area', area)
    num, den = np.zeros(len(me.vertices)), np.zeros(len(me.vertices))
    for p in me.polygons:
        vs = list(p.vertices); num[vs] += area[p.index] * is_t[p.index]; den[vs] += area[p.index]
    t_slot = tendon[0]
    b_slot = collections.Counter(idx[~is_t].tolist()).most_common(1)[0][0]
    before = area[is_t].sum()
    def accept(bm):
        return 0.75 < sum(f.calc_area() for f in bm.faces if f.material_index == t_slot) / before < 1.25
    # Dientes de más de una cara (las intersecciones del recto): se suaviza también la fracción entre vecinos, lo más
    # que permita el área (3 pasadas, 1 o ninguna).
    T = num / np.maximum(den, 1e-12)
    E = np.empty(len(me.edges) * 2, dtype=np.int64); me.edges.foreach_get('vertices', E); E = E.reshape(-1, 2)
    deg = np.maximum(np.bincount(E.ravel(), minlength=len(T)), 1)
    fields = [T]
    for _ in range(3):
        acc = np.zeros_like(T); np.add.at(acc, E[:, 0], T[E[:, 1]]); np.add.at(acc, E[:, 1], T[E[:, 0]])
        T = 0.5 * T + 0.5 * acc / deg; fields.append(T)
    for k in (3, 1, 0):
        if cut_iso(it['out'], 0.5 - fields[k], lambda f, m: t_slot if m < 0 else b_slot, accept):
            passes[k] += 1; break
log(f'bordes de tendón alisados: {dict(passes)} músculos por pasadas de suavizado')

# ── Vaina del recto y aponeurosis de los músculos anchos del abdomen ────────
# Z-Anatomy modela el oblicuo externo, el interno y el transverso enteros con el material del vientre, también sus
# aponeurosis: delante del recto y en la ingle salían rojos, como si el músculo llegara a la línea media, y el oblicuo
# interno asomaba a parches por delante del recto (a menos de 1 mm de él). La aponeurosis del oblicuo externo forma la
# vaina anterior del recto (un velo que deja verlo) y baja hasta el ligamento inguinal; las del oblicuo interno y del
# transverso empiezan en el borde del recto. Se mide sobre la huella del recto vista de frente (rejilla de 2 mm): distancia
# con signo a su borde y profundidad de sus caras anterior y posterior. Las mallas se cortan por la isolínea (borde limpio,
# no la escalera de triángulos de antes) y la opacidad va por vértice, en el alfa del color: blanca a los lados del recto,
# velo delante de él.
GRID = 0.002
def smin(a, b, k):
    h = np.clip(0.5 + 0.5 * (b - a) / k, 0, 1)
    return b + (a - b) * h - k * h * (1 - h)
def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)
def neighbours(A, pad):
    P = np.pad(A, 1, constant_values=pad)
    return np.stack([P[:-2, 1:-1], P[2:, 1:-1], P[1:-1, :-2], P[1:-1, 2:]])
def fill_nan(A):
    """Rellena los huecos (NaN) con la media de los vecinos, de dentro afuera."""
    A = A.copy()
    while np.isnan(A).any():
        N = neighbours(A, np.nan); n = (~np.isnan(N)).sum(0)
        A = np.where(np.isnan(A) & (n > 0), np.nan_to_num(N).sum(0) / np.maximum(n, 1), A)
    return A

class Footprint:
    """Huella del recto vista de frente (hacia +y): distancia con signo a su borde (negativa dentro) y cara anterior y
    posterior (y) en cada punto; fuera de la huella, las del borde más cercano."""
    def __init__(self, ra):
        bm = bmesh.new(); bm.from_mesh(ra.data); bm.transform(Matrix.Translation(ra.location))
        T = bvhtree.BVHTree.FromBMesh(bm); V = np.array([v.co[:] for v in bm.verts]); bm.free()
        lo, hi = V.min(0), V.max(0)
        self.xs = np.arange(lo[0] - 0.08, hi[0] + 0.08, GRID); self.zs = np.arange(lo[2] - 0.06, hi[2] + 0.06, GRID)
        yf = np.full((len(self.zs), len(self.xs)), np.nan); yb = yf.copy()
        y0, y1 = lo[1] - 0.05, hi[1] + 0.05
        for j, z in enumerate(self.zs):
            for i, x in enumerate(self.xs):
                if not (lo[0] <= x <= hi[0] and lo[2] <= z <= hi[2]): continue
                a = T.ray_cast(Vector((x, y0, z)), Vector((0, 1, 0)), y1 - y0)[0]
                if a is None: continue
                yf[j, i] = a.y; yb[j, i] = T.ray_cast(Vector((x, y1, z)), Vector((0, -1, 0)), y1 - y0)[0].y
        inside = ~np.isnan(yf)
        for grow in (True, True, False, False):               # cierre: rayos que se colaban por una arista
            inside = neighbours(inside, False).any(0) | inside if grow else neighbours(inside, False).all(0) & inside
        X, Z = np.meshgrid(self.xs, self.zs)
        hx, vz = inside[:, :-1] != inside[:, 1:], inside[:-1] != inside[1:]
        B = np.concatenate([np.column_stack([X[:, :-1][hx] + GRID / 2, Z[:, :-1][hx]]),
                            np.column_stack([X[:-1][vz], Z[:-1][vz] + GRID / 2])])
        P = np.column_stack([X.ravel(), Z.ravel()]); d = np.empty(len(P))
        for k in range(0, len(P), 2048):
            d[k:k + 2048] = np.sqrt(((P[k:k + 2048, None] - B[None]) ** 2).sum(-1)).min(1)
        sd = np.where(inside.ravel(), -d, d).reshape(inside.shape)
        n, m = sd.shape
        for _ in range(2):                                    # sin los escalones de la rejilla
            Q = np.pad(sd, 1, mode='edge')
            sd = sum(Q[1 + dj:1 + dj + n, 1 + di:1 + di + m] for dj in (-1, 0, 1) for di in (-1, 0, 1)) / 9
        self.sd = sd
        self.yf, self.yb = (fill_nan(np.where(inside, A, np.nan)) for A in (yf, yb))

    def at(self, G, P):
        fx = np.clip((P[:, 0] - self.xs[0]) / GRID, 0, len(self.xs) - 1.001)
        fz = np.clip((P[:, 2] - self.zs[0]) / GRID, 0, len(self.zs) - 1.001)
        i, j = fx.astype(int), fz.astype(int); u, v = fx - i, fz - j
        return G[j, i] * (1 - u) * (1 - v) + G[j, i + 1] * u * (1 - v) + G[j + 1, i] * (1 - u) * v + G[j + 1, i + 1] * u * v

def cut_aponeurosis(obj, field):
    """Corta la malla por la isolínea field = 0 y pone la aponeurosis (field < 0) en su propia ranura."""
    me = obj.data
    P = np.empty(len(me.vertices) * 3); me.vertices.foreach_get('co', P); P = P.reshape(-1, 3) + np.array(obj.location)
    me.materials.append(MATS['aponeurosis']); slot = len(me.materials) - 1
    cut_iso(obj, field(P), lambda f, m: slot if m < 0 else f.material_index)
    idx = np.empty(len(me.polygons), dtype=np.int32); me.polygons.foreach_get('material_index', idx)
    return (idx == slot).mean()

def tuck_under(obj, cover, gap=0.0008):
    """Lo que asoma por fuera de `cover` (BVH, mundo) en dirección a la piel pasa `gap` por debajo de él, con suavidad."""
    me = obj.data
    V = np.empty(len(me.vertices) * 3); me.vertices.foreach_get('co', V); V = V.reshape(-1, 3) + np.array(obj.location)
    D = np.zeros_like(V); fixed = np.zeros(len(V), bool)
    for i, p in enumerate(map(Vector, V)):
        q, _, _, dist = fitter.skin.find_nearest(p)
        if q is None or dist < 1e-4: continue
        d = (q - p).normalized()
        if cover.ray_cast(p + d * 1e-5, d, dist)[0] is not None: continue      # ya está debajo
        h = cover.ray_cast(p - d * 1e-5, -d, 0.01)[0]
        if h is None: continue                                               # no lo cubre
        D[i] = np.array(h - d * gap - p); fixed[i] = True
    if fixed.any(): move_smoothly(obj, V, D, fixed)
    return int(fixed.sum())

def world_bvh(*objs):
    verts, polys = [], []
    for o in objs:
        mw = Matrix.Translation(o.location); off = len(verts)
        verts += [mw @ v.co for v in o.data.vertices]; polys += [[off + i for i in p.vertices] for p in o.data.polygons]
    return bvhtree.BVHTree.FromPolygons(verts, polys)

def set_alpha(obj, alpha):
    """Opacidad por vértice (alfa del color, que exporta el glTF): la de la aponeurosis; el resto, opaco."""
    me = obj.data; loc = np.array(obj.location)
    P = np.empty(len(me.vertices) * 3); me.vertices.foreach_get('co', P); P = P.reshape(-1, 3) + loc
    slot = next(i for i, m in enumerate(me.materials) if m == MATS['aponeurosis'])
    on = np.zeros(len(P), bool)
    for f in me.polygons:
        if f.material_index == slot: on[list(f.vertices)] = True
    A = np.where(on, alpha(P), 1.0)
    ca = me.color_attributes.new('Aponeurosis_alpha', 'FLOAT_COLOR', 'POINT')
    ca.data.foreach_set('color', np.column_stack([np.ones((len(P), 3)), A]).astype(np.float32).ravel())
    me.color_attributes.active_color = ca
    me.color_attributes.render_color_index = me.color_attributes.find(ca.name)

by_name = {it['out'].name: it['out'] for it in items}
for s in 'LR':
    ra = by_name.get(f'Rectus_abdominis_muscle_{s}')
    if not ra: continue
    fp = Footprint(ra)
    hip = bpy.data.objects[f'Hip_Bone_{s}']
    H = np.array([hip.matrix_world @ v.co for v in hip.data.vertices])
    upper = H[H[:, 2] > np.percentile(H[:, 2], 70)]
    asis = upper[np.argmin(upper[:, 1])]                      # espina ilíaca anterosuperior: lo más anterior del ala
    def front(P): return P[:, 1] < (fp.at(fp.yf, P) + fp.at(fp.yb, P)) / 2
    # Oblicuo externo: aponeurosis hasta 16 mm por fuera del borde del recto y, por debajo de la espina ilíaca, toda la
    # ingle hasta el ligamento inguinal; esquinas redondeadas. Delante del recto, un velo (28 %) que se vuelve blanco hacia
    # su borde; hacia el vientre se funde en 6 mm, como en los atlas (no un corte neto). Ninguna cara de la vaina queda por
    # detrás de la cara anterior del recto (salía el recto «desnudo» a parches), y su borde superior pasa por debajo del
    # pectoral mayor (asomaba en picos blancos sobre él).
    eo = by_name.get(f'External_abdominal_oblique_muscle_{s}')
    if eo:
        me = eo.data; loc = np.array(eo.location)
        V = np.empty(len(me.vertices) * 3); me.vertices.foreach_get('co', V); V = V.reshape(-1, 3) + loc
        limit = fp.at(fp.yf, V) - 0.0008
        w = smoothstep(0.0, -0.003, fp.at(fp.sd, V)) * front(V) * (V[:, 1] > limit)
        V[:, 1] += w * (limit - V[:, 1])
        me.vertices.foreach_set('co', (V - loc).ravel()); me.update()
        pectoral = [by_name[n] for n in (f'Sternocostal_head_of_pectoralis_major_muscle_{s}',) if n in by_name]
        tucked = tuck_under(eo, world_bvh(*pectoral), gap=0.0015) if pectoral else 0
        if pectoral: tucked += tuck_under(ra, world_bvh(*pectoral), gap=0.0025)
        groin = lambda P: -smin(-(P[:, 2] - asis[2] - 0.01), -(np.abs(P[:, 0]) - abs(asis[0]) + 0.005), 0.01)
        apo = lambda P: smin(fp.at(fp.sd, P) - 0.016, groin(P), 0.01)
        frac = cut_aponeurosis(eo, apo)
        sheath = lambda P: np.where(front(P), 0.28 + 0.62 * smoothstep(-0.010, 0.002, fp.at(fp.sd, P)), 0.9)
        set_alpha(eo, lambda P: sheath(P) * (0.4 + 0.6 * smoothstep(0.0, -0.006, apo(P))))
        log(f'aponeurosis del oblicuo externo {s}: {frac * 100:.0f} % de sus caras; {int((w > 0).sum())} vértices de la vaina'
            f' llevados delante del recto, {tucked} bajo el pectoral')
        # Lo que el oblicuo externo cubre no asoma a través de él: el oblicuo interno salía en una cuña sobre la vaina,
        # hasta 5,5 mm, y el recto en puntos rojos.
        cover = world_bvh(eo)
        for base in ('Internal_abdominal_oblique_muscle', 'Transversus_abdominis_muscle', 'Rectus_abdominis_muscle', 'Pyramidalis_muscle'):
            o = by_name.get(f'{base}_{s}')
            if o: log(f'  {base} {s}: {tuck_under(o, cover)} vértices bajo el oblicuo externo')
    # Oblicuo interno y transverso: aponeurosis desde 5 y 12 mm por fuera del borde del recto. Su lámina anterior es
    # invisible delante del recto (la vaina ya la dibuja el oblicuo externo); la posterior, blanca, se ve al quitar el recto.
    for base, width in (('Internal_abdominal_oblique_muscle', 0.005), ('Transversus_abdominis_muscle', 0.012)):
        o = by_name.get(f'{base}_{s}')
        if not o: continue
        frac = cut_aponeurosis(o, lambda P: fp.at(fp.sd, P) - width)
        set_alpha(o, lambda P: np.where(front(P), 0.9 * smoothstep(-0.006, 0.0, fp.at(fp.sd, P)), 0.9))
        log(f'aponeurosis de {base} {s}: {frac * 100:.0f} % de sus caras')

groups = Groups('Muscular_System')
for it in items:
    groups.collection(it['region']).objects.link(it['out'])
save('male_muscular', groups, stats, {'ratio': ex.ratio, 'layers': dict(collections.Counter(layer))})
