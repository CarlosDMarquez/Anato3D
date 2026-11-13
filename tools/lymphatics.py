"""Sistema linfático: ganglios con forma y tamaño de ganglio, colocados y comprobados, y la base para los vasos
linfáticos (troncos, conductos y colectores). Lo llama tools/build_visceral.py; no se ejecuta solo.

Qué hace (hito 9, docs/hitos/09-sistema-linfatico.md):
  1. Inventario. Los nodos de la colección «6: Lymphoid organs» de Z-Anatomy, también los 11 que Z-Anatomy esconde con
     el nombre entre paréntesis (en la TA2, estructuras inconstantes: inguinales profundos proximal e intermedio,
     lacunares, tibiales, fibular y pilóricos; HIDDEN). La región (cabeza, cuello…) sale de la jerarquía de Z-Anatomy (los
     padres «….g»), que sigue la TA2: con las palabras del nombre (NODE_REGIONS de build_visceral.py) los submandibulares
     y submentonianos caían en la cabeza y los subaórticos en el abdomen.
  2. Forma. Cada esfera de Z-Anatomy (una por ganglio, 2–3 mm, todas iguales) pasa a ser un ganglio ovalado, algo
     arriñonado, con un hilio discreto (bean): 92 vértices, normales suaves. Eje largo según el grupo (SIZES: dimensiones
     del modelo dentro de lo normal, no medidas de un cuerpo), proporción largo : medio : corto ≈ 1 : 0,62 : 0,45, y una
     variación de ±12 % sembrada con el nombre (crc32: la misma en cada construcción; el lado derecho es el espejo del
     izquierdo).
  3. Orientación. El eje largo sigue el vaso vecino (si hay uno a menos de 1 cm) o, si no, el eje principal del grupo;
     el hilio mira al vaso; en los ganglios superficiales el eje corto va hacia la piel (quedan aplanados bajo ella).
  4. Colocación (place). Cada ganglio se mueve entero, lo mínimo, hasta quedar fuera del hueso, bajo la piel (≥ 1 mm),
     fuera de los órganos cerrados (salvo los contenidos reales de NATURAL), fuera de la luz de arterias y venas (curvas
     de «5: Cardiovascular system» ajustadas exactamente como en build_vascular.py) y fuera de los músculos (los de
     build/<modelo>_muscular.blend). Dos ganglios no se solapan: se encogen lo justo (nunca por debajo del 60 % del
     objetivo) y, si no basta, se separan hasta 2 mm cada uno. En los grupos pares las correcciones son simétricas: el
     derecho se mueve como el espejo del izquierdo, salvo donde un lado no cabe (queda registrado).
  5. Informes en build/linfatico/: inventario.json (objeto de Z-Anatomy → pieza → grupo → lado → ganglios → nombres),
     nodos-<modelo>.json (centro, ejes y semiejes de cada ganglio, y lo que se movió) y relaciones-<modelo>.json (las
     relaciones de la tabla de territorios, medidas en el modelo).
  6. build_vessels(ctx): vacía y documentada. Ahí irán la cisterna del quilo, el conducto torácico, los troncos y los
     colectores; ctx lleva todo lo que hace falta (ver Context).

Coordenadas de Blender: Z arriba, delante = −Y, izquierda del cuerpo = +X. Metros.
"""
import os, re, ast, json, zlib, collections
import numpy as np
import bpy, bmesh
from mathutils import Vector, kdtree
from anato3d_fit import ROOT, OUT_DIR, MODEL, log, sanitize, source_name, ring_size, skull_bone, male_only

REPORT_DIR = os.path.join(OUT_DIR, 'linfatico')
ZCOL = '6: Lymphoid organs'
MIRROR = np.diag([-1.0, 1.0, 1.0])

# ── Inventario ────────────────────────────────────────────────────────────────
# Regiones de la TA2 (5198, 5212, 5235, 5247, 5268, 5317, 5347): son los padres «….g» de Z-Anatomy.
REGIONS = ('Lymph nodes of head', 'Lymph nodes of neck', 'Lymph nodes of upper limb', 'Thoracic lymph nodes',
           'Abdominal lymph nodes', 'Pelvic lymph nodes', 'Lymph nodes of lower limb')
# Nodos que Z-Anatomy esconde (nombre entre paréntesis, como en la TA2: estructuras inconstantes). Nombre inglés de
# Z-Anatomy → (español, latín, n.º de la TA2; sources/z-anatomy/TA2.csv, sin los paréntesis).
HIDDEN = {
    'Proximal deep inguinal node': ('Nodo inguinal profundo proximal', 'Nodus inguinalis profundus proximalis', 5354),
    'Intermediate deep inguinal node': ('Nodo inguinal profundo intermedio', 'Nodus inguinalis profundus intermedius', 5355),
    'Medial lacunar node': ('Nodo lacunar medial', 'Nodus lacunaris medialis', 5329),
    'Intermediate lacunar node': ('Nodo lacunar intermedio', 'Nodus lacunaris intermedius', 5330),
    'Lateral lacunar node': ('Nodo lacunar lateral', 'Nodus lacunaris lateralis', 5331),
    'Anterior tibial node': ('Nodo tibial anterior', 'Nodus tibialis anterior', 5360),
    'Posterior tibial node': ('Nodo tibial posterior', 'Nodus tibialis posterior', 5361),
    'Fibular node': ('Nodo fibular', 'Nodus fibularis', 5362),
    'Suprapyloric node': ('Nodo suprapilórico', 'Nodus suprapyloricus', 5289),
    'Subpyloric nodes': ('Nodos subpilóricos', 'Nodi subpylorici', 5290),
    'Retropyloric nodes': ('Nodos retropilóricos', 'Nodi retropylorici', 5291),
}
# Grupos nuevos del sistema (para los vasos linfáticos): nombre inglés → (español, latín). El latín de «Vasos
# linfáticos» es el de la TA2 (3915); el de «Troncos y conductos», descriptivo (la TA2 no tiene ese grupo).
GROUP_NAMES = {'Lymphatic trunks and ducts': ('Troncos y conductos linfáticos', 'Trunci et ductus lymphatici'),
               'Lymphatic vessels': ('Vasos linfáticos', 'Vasa lymphatica')}


def zname(name):
    """«(Proximal deep inguinal node).l» → ('Proximal deep inguinal node', 'L', True)."""
    base, side = source_name(name)
    hidden = base.startswith('(') and base.endswith(')')
    return base.strip('()').strip(), side, hidden


def is_node_source(o):
    """Objetos de nodos de Z-Anatomy que entran en el modelo: los visibles con «node» en el nombre y los de HIDDEN."""
    if o.type != 'MESH' or ZCOL not in [c.name for c in o.users_collection] or o.name.endswith(('.j', '.g', '.t', '.i')):
        return False
    base, _, hidden = zname(o.name)
    return base in HIDDEN if hidden else (not o.name.startswith('?') and '//' not in o.name and 'node' in base.lower())


def region_of(o):
    """Región de la TA2 de un nodo, por sus padres en Z-Anatomy («Lymph nodes of neck.g»…), o None."""
    p = o.parent
    while p is not None:
        n = re.sub(r'\.g$', '', p.name)
        if n in REGIONS: return n
        p = p.parent
    return None


def names_of(base):
    """(español, latín) de un nodo de HIDDEN, o None (los demás usan la traducción de Z-Anatomy)."""
    return HIDDEN.get(base, (None, None, None))[:2] if base in HIDDEN else None


# ── Tamaño y forma ────────────────────────────────────────────────────────────
# Eje largo objetivo de cada grupo (mm): dimensiones del modelo dentro del intervalo normal publicado, fijadas por el
# encargo del 2026-11-11 (no son medidas de un cuerpo). Gana el primer patrón que coincide con el nombre de la pieza.
SIZES = [
    (r'^Jugulodigastric', 14), (r'^Lateral_superior_jugular', 10), (r'^(Anterior_inferior_jugular|Inferior_deep_lateral_cervical)', 9),
    (r'^Submandibular', 9), (r'^Submental', 6),
    (r'^(Superficial_parotid|Mastoid|Occipital)', 6), (r'^(Intraglandular_parotid|Pre_auricular|Infra_auricular)', 5.5),
    (r'^Mandibular', 5), (r'^(Bucinator|Nasolabial)', 4.5),
    (r'^Retropharyngeal', 7), (r'^Superficial_(lateral|anterior)_cervical', 6), (r'^Supraclavicular', 8),
    (r'^(Pretracheal|Paratracheal_cervical|Thyroid_nodes)', 5),
    (r'^Central_axillary', 11), (r'^(Apical|Lateral)_axillary', 10), (r'^(Anterior|Posterior)_axillary', 9),
    (r'^Brachial', 6), (r'^(Cubital|Supratrochlear)', 5), (r'^Infraclavicular', 6), (r'^Interpectoral', 5),
    (r'^Inferior_tracheobronchial', 10), (r'^(Paratracheal_thoracic|Superior_tracheobronchial)', 9), (r'^Intrapulmonary', 5),
    (r'^(Parasternal|Intercostal)', 4), (r'^(Prevertebral|Juxta_oesophageal)', 6),
    (r'^(Superior_diaphragmatic|Inferior_diaphragmatic|Prepericardial|Lateral_pericardial)', 5),
    (r'^(Brachiocephalic|Node_of_arch_of_azygos|Node_of_ligamentum)', 7),
    (r'^Coeliac', 9), (r'^Central_superior_mesenteric', 8), (r'^Juxta_intestinal', 4), (r'^Paracolic', 5),
    (r'^((Right|Middle|Left)_colic|Ileocolic|Sigmoid)', 6), (r'^(Appendicular|Precaecal|Retrocaecal)', 5),
    (r'^(Lateral_aortic|Pre_aortic|Retro_aortic|Lateral_caval|Precaval|Retrocaval|Intermediate_lumbar)', 10),
    (r'^(Right_gastric|Right_gastro_omental|Superior_pancreatic|Inferior_pancreatic|Superior_pancreaticoduodenal|Splenic)', 6),
    (r'^Cystic', 7), (r'pyloric', 5), (r'^Inferior_epigastric', 4),
    (r'(common_iliac|external_iliac)|^Subaortic', 10), (r'lacunar', 9), (r'^Obturator', 8), (r'sacral', 6), (r'gluteal', 5),
    (r'vesical', 4), (r'^Pararectal', 5), (r'superficial_inguinal', 12), (r'deep_inguinal', 9), (r'popliteal', 7),
    (r'tibial|^Fibular', 4),
]
RATIO = (1.0, 0.62, 0.45)            # largo : medio : corto
VARIATION = 0.12                      # ± en el eje largo
MIN_SCALE = 0.60                      # nunca por debajo del 60 % del objetivo
MAX_SEPARATION = 0.002                # m que un ganglio puede apartarse de otro
BEND, DENT = 0.10, 0.12               # arqueado (lado cóncavo = hilio) y muesca del hilio, en fracción del semieje medio
# Ganglios superficiales (bajo la piel, en el tejido subcutáneo o justo bajo la fascia): eje corto hacia la piel.
SUPERFICIAL = re.compile(r'^(Occipital|Mastoid|Superficial_parotid|Pre_auricular|Infra_auricular|Bucinator|Nasolabial|'
                         r'Mandibular|Submental|Superficial_(lateral|anterior)_cervical|Cubital|Supratrochlear|Infraclavicular|'
                         r'Superficial_popliteal|.*superficial_inguinal)')
# Contenidos reales: (patrón de la pieza de nodos, patrón del órgano). Los intraglandulares van dentro de la parótida;
# los apendiculares, en el mesoapéndice; los intrapulmonares, dentro del pulmón (y de su pleura).
NATURAL = [(r'^Intraglandular', r''), (r'', r'^Meso'), (r'^Intrapulmonary', r'lobe_of_.*lung|^Pleura|lung')]
MARGIN = {'bone': 0.0003, 'skin': 0.001, 'vessel': 0.0002, 'organ': 0.0003, 'muscle': 0.0003}


def size_of(base):
    for pat, mm in SIZES:
        if re.search(pat, base): return pat, mm
    return None, 6.0


def natural(piece, organ):
    return any(re.search(a, piece) and re.search(b, organ) for a, b in NATURAL)


def bean(n_u=9, n_v=10):
    """Ganglio unidad: elipsoide de semiejes 1 (x, largo), 1 (y, medio) y 1 (z, corto), arqueado hacia +y (el lado −y,
    cóncavo, es el hilio) y con una muesca discreta en el hilio. 92 vértices (9 anillos de 10 y 2 polos), 100 caras.
    Devuelve (vértices, caras, centro y semiejes de la elipse que lo contiene)."""
    us = np.linspace(0, np.pi, n_u + 2)[1:-1]
    vs = np.linspace(0, 2 * np.pi, n_v, endpoint=False)
    P = [(1.0, 0.0, 0.0)] + [(np.cos(u), np.sin(u) * np.cos(v), np.sin(u) * np.sin(v)) for u in us for v in vs] + [(-1.0, 0.0, 0.0)]
    P = np.array(P)
    x, y, z = P.T
    hil = np.clip(-y, 0, None) ** 3 * np.exp(-(x / 0.42) ** 2) * np.exp(-(z / 0.55) ** 2)
    Y = y + BEND * (1 - x ** 2) + DENT * hil
    V = np.column_stack([x, Y, z])
    F = [(0, 1 + (j + 1) % n_v, 1 + j) for j in range(n_v)]
    for i in range(n_u - 1):
        for j in range(n_v):
            a, b = 1 + i * n_v + j, 1 + i * n_v + (j + 1) % n_v
            F.append((a, b, b + n_v, a + n_v))
    last = len(V) - 1; top = 1 + (n_u - 1) * n_v
    F += [(last, top + j, top + (j + 1) % n_v) for j in range(n_v)]
    # Caras hacia fuera (volumen con signo positivo).
    vol = sum(np.dot(V[f[0]], np.cross(V[f[k]], V[f[k + 1]])) for f in F for k in range(1, len(f) - 1))
    if vol < 0: F = [tuple(reversed(f)) for f in F]
    return V, F, np.array([0.0, BEND / 2, 0.0]), np.array([1.0, 1.0 + BEND / 2, 1.0]) * 1.03


BEAN_V, BEAN_F, BOUND_C, BOUND_S = bean()
SAMPLE = BEAN_V[::2]                  # puntos de la superficie para las comprobaciones durante la colocación


# ── Obstáculos ────────────────────────────────────────────────────────────────
DIRS6 = [Vector(d) for d in ((1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1))]


def parity_inside(T, p, need=5):
    odd = 0
    for d in DIRS6:
        o, n = Vector(p), 0
        while n < 24:
            hit = T.ray_cast(o + d * 1e-5, d)[0]
            if hit is None: break
            n += 1; o = hit
        odd += n % 2
    return odd >= need


class Solid:
    """Malla cerrada que un ganglio no debe atravesar (órgano, músculo, corazón)."""
    def __init__(self, name, T, lo, hi, sign, kind, closed=True):
        name = re.sub(r'\.\d{3}$', '', name)
        self.name, self.T, self.lo, self.hi, self.sign, self.kind = name, T, np.asarray(lo), np.asarray(hi), sign, kind
        self.closed = closed                 # las abiertas (láminas) no son obstáculo: sirven para medir relaciones

    def depth(self, P):
        """Lo más hondo que entra algún punto de P (m) y la dirección para salir, o None."""
        sel = np.flatnonzero(((P >= self.lo) & (P <= self.hi)).all(1))
        best = None
        for i in sel:
            loc, nrm, _, d = self.T.find_nearest(Vector(P[i]))
            if loc is None: continue
            n = np.array(nrm) * self.sign
            if np.dot(P[i] - np.array(loc), n) >= 0: continue               # fuera según la cara más cercana
            if d < 0.003 or parity_inside(self.T, P[i]):
                if best is None or d > best[0]: best = (d, n)
        return best


def solids_from_blend(path, collection, keep, kind):
    """Mallas cerradas de un .blend construido (p. ej. build/male_muscular.blend), en coordenadas del mundo. Lo que se
    carga se quita después de bpy.data (no debe acabar en el .blend del linfático)."""
    if not os.path.exists(path):
        log(f'  linfático: falta {os.path.relpath(path, ROOT)}; sin {kind}s como obstáculo'); return []
    with bpy.data.libraries.load(path) as (src, dst):
        dst.collections = [collection]
    col = dst.collections[0]
    out, junk_o, junk_m, junk_mat = [], [], set(), set()
    for o in col.all_objects:
        junk_o.append(o)
        if o.type != 'MESH': continue
        junk_m.add(o.data); junk_mat.update(m for m in o.data.materials if m)
        if not keep(o): continue
        bm = bmesh.new(); bm.from_mesh(o.data); bm.transform(o.matrix_basis)
        if not bm.faces: bm.free(); continue
        closed = all(e.is_manifold for e in bm.edges)
        V = np.array([v.co[:] for v in bm.verts])
        from mathutils import bvhtree
        out.append(Solid(o.name, bvhtree.BVHTree.FromBMesh(bm), V.min(0), V.max(0),
                         (1.0 if bm.calc_volume(signed=True) >= 0 else -1.0) if closed else 1.0, kind, closed))
        bm.free()
    cols = [col] + list(col.children_recursive)
    bpy.data.batch_remove(junk_o); bpy.data.batch_remove(list(junk_m))
    bpy.data.batch_remove([m for m in junk_mat if m.users == 0]); bpy.data.batch_remove(cols)
    return out


def _vascular_constants():
    """DEEP, SUBCUTANEOUS, MAJOR y KIND de tools/build_vascular.py, leídos sin ejecutarlo (ast): así los ejes de los
    vasos salen como los publicados aunque esa lista cambie."""
    tree = ast.parse(open(os.path.join(ROOT, 'tools', 'build_vascular.py'), encoding='utf-8').read())
    out = {}
    for node in tree.body:
        if isinstance(node, ast.Assign) and len(node.targets) == 1 and isinstance(node.targets[0], ast.Name) \
                and node.targets[0].id in ('DEEP', 'SUBCUTANEOUS', 'MAJOR', 'KIND'):
            out[node.targets[0].id] = ast.literal_eval(node.value)
    if MODEL == 'female': out['SUBCUTANEOUS'] = tuple(out['SUBCUTANEOUS']) + ('external pudendal',)
    return out


class Vessels:
    """Ejes y radios de las arterias y venas de Z-Anatomy («5: Cardiovascular system»), ajustados exactamente como los
    publicados (build_vascular.py → Extractor.fit): resolución de la curva según el calibre, Fitter.deform, pose genital,
    anillos fuera del hueso (push_tube_out_of_bone, salvo el cráneo) y, los superficiales, a 2 mm bajo la piel. De cada
    tubo se recuperan los anillos (ring_size): centro y radio de cada uno. Solo los vasos a menos de `reach` m de algún
    punto de `near` (coordenadas de Z-Anatomy)."""
    def __init__(self, fitter, near=None, reach=0.035):
        C = _vascular_constants()
        col = bpy.data.collections['5: Cardiovascular system']
        kd = None
        if near is not None and len(near):
            kd = kdtree.KDTree(len(near))
            for i, p in enumerate(near): kd.insert(p, i)
            kd.balance()
        cands = []
        for o in col.objects:
            if o.type != 'CURVE' or o.name.startswith(('(', '?')) or '//' in o.name or o.name.endswith(('.j', '.g', '.t')): continue
            if male_only(o.name): continue
            mat = o.active_material.name if o.active_material else None
            if mat not in C['KIND']: continue
            if kd is not None:
                M = o.matrix_world
                pts = [M @ p.co for s in o.data.splines for p in s.bezier_points]
                if not pts or min(kd.find(p)[2] for p in pts[::max(1, len(pts) // 40)]) > reach + 0.03: continue
            cands.append((o, C['KIND'][mat][0]))
        for o, _ in cands:                                             # como build_vascular.py
            r = o.data.bevel_depth * max((p.radius for s in o.data.splines for p in s.bezier_points), default=1)
            o.data.bevel_resolution = 3 if r > 0.006 else 2 if r > 0.002 else 1
            o.data.resolution_u = 6 if r > 0.006 else 4
        dg = bpy.context.evaluated_depsgraph_get(); dg.update()
        A, B, R, NAME, MAJ, SYS = [], [], [], [], [], []
        self.lines, self.failed = {}, []
        for o, system in cands:
            base, side = source_name(o.name)
            name = sanitize(base) + (f'_{side}' if side else '')
            low = base.lower()
            plain = re.sub(r'^(right|left) ', '', low)
            deep = any(k in low for k in C['DEEP']) and not any(k in low for k in C['SUBCUTANEOUS'])
            me = bpy.data.meshes.new_from_object(o.evaluated_get(dg), depsgraph=dg)
            me.transform(o.matrix_world)
            V = np.empty(len(me.vertices) * 3); me.vertices.foreach_get('co', V); V = V.reshape(-1, 3)
            bpy.data.meshes.remove(me)
            if not len(V): continue
            V = fitter.deform(V)
            if fitter.genital: V = fitter.genital.apply(o.name, V)
            fitter.push_tube_out_of_bone(V, skip=skull_bone)
            if not deep: fitter.keep_inside_skin(V, 0.002)
            # Anillos de 4 + 2·bevel_resolution vértices (los de ring_size, aunque el campo de la musculatura los haya
            # ovalado: en el hombro y la base del cuello ring_size no los reconoce y faltaban la axilar, la subclavia,
            # la carótida común izquierda y la cava superior). Radio: el mayor de cada anillo (el ovalado no se queda corto).
            k = 4 + 2 * o.data.bevel_resolution
            if len(V) % k == 0 and len(V) // k >= 2:
                G = V.reshape(-1, k, 3); r = np.linalg.norm(G - G.mean(1)[:, None], axis=2)
                if np.median(r.std(1) / np.maximum(r.mean(1), 1e-9)) > 0.35: k = None
            else:
                k = None
            if k is None:
                k = ring_size(V)
                if not k:
                    self.failed.append((name, len(V))); continue
            G = V.reshape(-1, k, 3); Cn = G.mean(1); Rn = np.linalg.norm(G - Cn[:, None], axis=2).max(1)
            step = np.linalg.norm(np.diff(Cn, axis=0), axis=1)
            cut = step > 4 * max(np.median(step), 1e-4)
            self.lines.setdefault(name, []).append((Cn, Rn))
            for i in np.flatnonzero(~cut):
                A.append(Cn[i]); B.append(Cn[i + 1]); R.append((Rn[i] + Rn[i + 1]) / 2)
                NAME.append(name); MAJ.append(plain in C['MAJOR']); SYS.append(system)
        self.A, self.B, self.r = np.array(A), np.array(B), np.array(R)
        self.AB = self.B - self.A; self.ab2 = np.maximum((self.AB ** 2).sum(1), 1e-12)
        self.name, self.major, self.system = NAME, np.array(MAJ), SYS
        idx = collections.defaultdict(list)
        for i, nm in enumerate(NAME): idx[nm].append(i)
        self.index = {k: np.array(v, dtype=int) for k, v in idx.items()}
        self.half = float(np.sqrt(self.ab2).max() / 2) if len(A) else 0.0
        self.rmax = float(self.r.max()) if len(A) else 0.0
        mid = (self.A + self.B) / 2
        self.kd = kdtree.KDTree(len(mid))
        for i, p in enumerate(mid): self.kd.insert(p, i)
        self.kd.balance()
        log(f'  linfático: {len(cands)} vasos de Z-Anatomy como referencia ({len(A)} tramos); sin anillos: {self.failed}')

    def near(self, p, radius):
        return np.array([i for _, i, _ in self.kd.find_range(Vector(p), radius + self.half + self.rmax)], dtype=int)

    def gaps(self, P, I):
        """Holgura de cada punto de P a la pared de cada tramo de I (m; negativa dentro de la luz) y el punto del eje."""
        A, AB = self.A[I], self.AB[I]
        t = np.clip(np.einsum('pij,ij->pi', P[:, None, :] - A[None], AB) / self.ab2[I][None], 0, 1)
        Q = A[None] + t[..., None] * AB[None]
        d = np.linalg.norm(P[:, None, :] - Q, axis=2)
        return d - self.r[I][None], Q, d

    def nearest(self, p, reach=0.015, prefer_major=True):
        """(holgura a la pared, dirección del eje, punto del eje, nombre, principal) del vaso más cercano a p, o None."""
        I = self.near(p, reach)
        if not len(I): return None
        g, Q, _ = self.gaps(np.asarray(p)[None], I)
        score = g[0] - (0.002 * self.major[I] if prefer_major else 0)
        j = int(np.argmin(score))
        if g[0, j] > reach: return None
        i = I[j]
        return g[0, j], self.AB[i] / np.sqrt(self.ab2[i]), Q[0, j], self.name[i], bool(self.major[i])

    def line(self, name):
        """Eje (puntos, radios) del tramo más largo del vaso `name` (p. ej. 'Internal_jugular_vein_L'), o None."""
        ls = self.lines.get(name)
        return max(ls, key=lambda t: len(t[0])) if ls else None


# ── Ganglios ──────────────────────────────────────────────────────────────────
class Node:
    """Un ganglio. `anchor`: su sitio en Z-Anatomy ajustado al cuerpo; `c`: el centro final; `R`: ejes (columnas: largo,
    medio, corto; en el lado derecho, espejo del izquierdo, con determinante −1); `shape`: semiejes al 100 %; `scale`."""
    def __init__(self, piece, base, side, k, anchor, source):
        self.piece, self.base, self.side, self.k, self.source = piece, base, side, k, source
        self.anchor = np.asarray(anchor, float); self.c = self.anchor.copy()
        self.R = np.eye(3); self.shape = np.array([0.003, 0.002, 0.0015]); self.scale = 1.0
        self.partner = None; self.primary = True
        self.sep = np.zeros(3); self.stuck = 0; self.flags = set()
        self.size_key, self.target_mm = size_of(base)
        self.superficial = bool(SUPERFICIAL.search(base))
        self.vessel = None; self.tether = None; self.cover = None; self.moved = True; self.left = {}

    @property
    def half(self): return self.shape * self.scale

    @property
    def ext(self): return float(self.half.max() * 1.15)

    def points(self, P=SAMPLE, c=None):
        return (self.c if c is None else c) + (P * self.half) @ self.R.T

    def inside_bound(self, P, c=None, grow=1.0):
        """Qué puntos de P caen dentro de la elipse que contiene al ganglio."""
        c = self.c if c is None else c
        L = ((P - c) @ self.R) / (self.half * grow) - BOUND_C
        return ((L / BOUND_S) ** 2).sum(1) < 1


def source_centers(o, dg):
    """Centro de cada ganglio (pieza suelta de la malla evaluada) de un objeto de Z-Anatomy, en el mundo."""
    me = bpy.data.meshes.new_from_object(o.evaluated_get(dg), depsgraph=dg)
    me.transform(o.matrix_world)
    bm = bmesh.new(); bm.from_mesh(me); bm.verts.ensure_lookup_table()
    seen, out = set(), []
    for v in bm.verts:
        if v.index in seen: continue
        st, comp = [v], []; seen.add(v.index)
        while st:
            x = st.pop(); comp.append(x.co[:])
            for e in x.link_edges:
                y = e.other_vert(x)
                if y.index not in seen: seen.add(y.index); st.append(y)
        out.append(np.mean(comp, axis=0))
    bm.free(); bpy.data.meshes.remove(me)
    return np.array(out)


def _rng(key):
    return np.random.default_rng(zlib.crc32(key.encode('utf-8')))


def _unit(v):
    n = np.linalg.norm(v)
    return v / n if n > 1e-12 else v


def _rot(axis, ang):
    a = _unit(axis); K = np.array([[0, -a[2], a[1]], [a[2], 0, -a[0]], [-a[1], a[0], 0]])
    return np.eye(3) + np.sin(ang) * K + (1 - np.cos(ang)) * K @ K


class Context:
    """Lo que necesitan la colocación de los ganglios y, después, build_vessels:
      fitter     Fitter (anato3d_fit): deform, bone_depth, push_tube_out_of_bone, skin (BVH), inside_body.
      nodes      todos los ganglios (Node); pieces: {pieza: [Node]} en el orden de la malla.
      vessels    Vessels: ejes y radios de arterias y venas (near, gaps, nearest, line(nombre)).
      solids     obstáculos cerrados: órganos (kind 'organ'), músculos ('muscle') y corazón ('heart').
      mats       materiales del sistema ('node', 'lymph_vessel', 'lymph_duct').
      add_piece  función de build_visceral.py que crea una pieza del linfático (ver build_vessels)."""
    def __init__(self, fitter, mats=None, add_piece=None):
        self.fitter, self.mats, self.add_piece = fitter, mats or {}, add_piece
        self.nodes, self.pieces, self.vessels, self.solids = [], {}, None, []
        self.inventory, self.report = [], collections.defaultdict(list)

    def add_nodes(self, piece, base, side, anchors, source):
        ns = [Node(piece, base, side, k, a, source) for k, a in enumerate(anchors)]
        self.pieces[piece] = ns; self.nodes += ns
        return ns

    def node_frames(self, piece):
        """[(centro, ejes 3×3, semiejes)] de los ganglios de una pieza, en m."""
        return [(n.c.copy(), n.R.copy(), n.half.copy()) for n in self.pieces.get(piece, [])]

    # Comprobaciones básicas (las usan la colocación y la auditoría de los vasos nuevos)
    def bone_gap(self, p):
        """Holgura al hueso (m, negativa dentro) y normal hacia fuera, o (None, None) lejos de él."""
        depth, n, _ = self.fitter.bone_depth(np.asarray(p, float))
        return (None, None) if n is None else (-depth, n)

    def skin_gap(self, p):
        """Profundidad bajo la piel (m, positiva dentro) y normal de la piel hacia fuera."""
        loc, nrm, _, dist = self.fitter.skin.find_nearest(Vector(p))
        if loc is None: return None, None
        d = float(np.dot(np.asarray(p) - np.array(loc), np.array(nrm)))
        if d > 0 and self.fitter.inside_body(p): d = -d if dist > 0.006 else min(-dist, -0.0001)
        return -d, np.array(nrm)


def pair_sides(ctx):
    """Empareja cada ganglio izquierdo con el derecho que es su espejo (el más cercano tras reflejar x)."""
    for piece, ns in ctx.pieces.items():
        if not piece.endswith('_L'): continue
        other = ctx.pieces.get(piece[:-2] + '_R')
        if not other or len(other) != len(ns): continue
        free = list(other)
        for n in ns:
            m = min(free, key=lambda o: np.linalg.norm(MIRROR @ o.anchor - n.anchor))
            free.remove(m); n.partner, m.partner, m.primary = m, n, False


def orient(ctx):
    """Tamaño y ejes de cada ganglio (ver la cabecera). Los derechos de una pareja copian al izquierdo en espejo."""
    for piece, ns in ctx.pieces.items():
        P = np.array([n.anchor for n in ns])
        axis = None
        if len(ns) >= 2:
            ev, evec = np.linalg.eigh(np.cov((P - P.mean(0)).T) + np.eye(3) * 1e-12)
            if len(ns) == 2 or ev[2] > 1.6 * ev[1]: axis = evec[:, 2]
        for n in ns:
            if not n.primary: continue
            g = _rng(f'{n.base}#{n.k}')
            u = g.uniform(-1, 1, 6)
            L = n.target_mm / 1000 * (1 + VARIATION * u[0])
            n.shape = L / 2 * np.array([RATIO[0], RATIO[1] * (1 + 0.06 * u[1]), RATIO[2] * (1 + 0.06 * u[2])])
            near = ctx.vessels.nearest(n.anchor, reach=0.010) if ctx.vessels else None
            toward = None
            if near:
                d = near[1]; toward = near[2] - n.anchor; n.vessel = near[3]
            elif axis is not None:
                d = axis
            else:
                d = np.array([0.0, 0.0, 1.0])
            d = _unit(d)
            if n.superficial:
                _, nrm = ctx.skin_gap(n.anchor)
                s_ax = _unit(nrm) if nrm is not None else np.array([0.0, -1.0, 0.0])
                l_ax = d - np.dot(d, s_ax) * s_ax
                if np.linalg.norm(l_ax) < 0.3: l_ax = np.cross(s_ax, [1.0, 0, 0] if abs(s_ax[0]) < 0.9 else [0, 0, 1.0])
                l_ax = _unit(l_ax); m_ax = np.cross(s_ax, l_ax)
                roll = np.radians(10) * u[4]
            else:
                l_ax = d
                ref = toward if toward is not None and np.linalg.norm(toward) > 1e-4 else g.normal(size=3)
                m_ax = -(ref - np.dot(ref, l_ax) * l_ax)                 # el hilio (−y) mira al vaso
                if np.linalg.norm(m_ax) < 1e-6: m_ax = np.cross(l_ax, [1.0, 0, 0] if abs(l_ax[0]) < 0.9 else [0, 0, 1.0])
                m_ax = _unit(m_ax); s_ax = np.cross(l_ax, m_ax)
                roll = np.radians(25) * u[4]
            R = np.column_stack([l_ax, m_ax, s_ax])
            R = _rot(s_ax, np.radians(12) * u[3]) @ R                      # el eje largo, ±12° respecto a la cadena
            R = _rot(R[:, 0], roll) @ R
            n.R = R
            if n.partner is not None:
                p = n.partner
                p.shape, p.R, p.vessel = n.shape.copy(), MIRROR @ n.R, (near[3][:-2] + '_R' if near and near[3].endswith('_L') else (near[3] if near else None))


def _bone(name):
    o = bpy.data.objects.get(name)
    if o is None:
        o = next((x for x in bpy.data.objects if re.sub(r'\.\d{3}$', '', x.name) == name and x.get('system') == 'skeletal'), None)
    if o is None or o.type != 'MESH': return None
    m = np.array(o.matrix_world)
    return np.array([v.co[:] for v in o.data.vertices]) @ m[:3, :3].T + m[:3, 3]


# ── Colocación ────────────────────────────────────────────────────────────────
ITER_EXTRA = 0.00025      # margen de más mientras se coloca: al final se comprueba con los 92 vértices y el margen justo
STEP_MAX = 0.006          # m que un ganglio se mueve como mucho en una vuelta por un obstáculo
# Ganglios que van junto a un vaso (relaciones de la tabla de territorios del segundo revisor): si su superficie queda a
# más de `mm` de la pared del vaso, se acercan a él. Patrón de la pieza → (vaso, mm). El lado se añade solo.
TETHERS = [
    (r'^(Jugulodigastric_node|Lateral_superior_jugular_node|Anterior_inferior_jugular_nodes)_[LR]$', 'Internal_jugular_vein', 3.0),
    (r'^(Proximal|Intermediate)_deep_inguinal_node_[LR]$', 'Femoral_vein', 3.0),
    (r'^Deep_popliteal_nodes_[LR]$', 'Popliteal_vein', 4.0),
    (r'^Superficial_popliteal_nodes_[LR]$', 'Small_saphenous_vein', 6.0),
    (r'^Parasternal_nodes_[LR]$', 'Internal_thoracic_artery', 5.0),
    (r'^Anterior_tibial_node_[LR]$', 'Anterior_tibial_artery', 3.0),
    (r'^Posterior_tibial_node_[LR]$', 'Posterior_tibial_artery', 3.0),
    (r'^Fibular_node_[LR]$', 'Fibular_artery', 3.0),
    (r'^Inferior_superficial_inguinal_nodes_[LR]$', 'Great_saphenous_vein', 6.0),
    (r'^Coeliac_nodes$', 'Coeliac_trunk', 6.0),
    (r'^Supratrochlear_nodes_[LR]$', 'Basilic_vein', 6.0),
    (r'^Lateral_axillary_nodes_[LR]$', 'Axillary_vein', 4.0),
    (r'^Apical_axillary_nodes_[LR]$', ('Axillary_vein', '{side}_subclavian_vein'), 5.0),
    (r'^Posterior_axillary_nodes_[LR]$', ('Subscapular_artery', 'Thoracodorsal_artery', 'Thoracodorsal_vein', 'Subscapular_vein'), 6.0),
    (r'^Medial_lacunar_node_[LR]$', ('External_iliac_vein', 'Femoral_vein'), 3.0),
    (r'^Intermediate_lacunar_node_[LR]$', ('External_iliac_vein', 'External_iliac_artery', 'Femoral_vein'), 4.0),
    (r'^Lateral_lacunar_node_[LR]$', ('External_iliac_artery', 'Femoral_artery'), 4.0),
]
# Lo mismo con un músculo: los retrofaríngeos, sobre el largo de la cabeza (delante del atlas y del axis).
SOLID_TETHERS = [(r'^Retropharyngeal_nodes_[LR]$', 'Longus_capitis_muscle', 2.0)]


def _tether_of(n):
    side = f'_{n.side}' if n.side else ''
    for pat, vessel, mm in TETHERS:
        if re.search(pat, n.piece):
            vs = vessel if isinstance(vessel, tuple) else (vessel,)
            return ('vessel', tuple(v.replace('{side}', 'Left' if n.side == 'L' else 'Right') if '{side}' in v else v + side for v in vs), mm / 1000)
    for pat, solid, mm in SOLID_TETHERS:
        if re.search(pat, n.piece): return ('solid', solid + side, mm / 1000)
    return None


def _push_bone(ctx, n, P, extra=0.0):
    """Lo más hondo que entra en el hueso y la normal, o None."""
    loc, _, _, dist = ctx.fitter.fase2_bones.find_nearest(Vector(n.c))
    if loc is not None and dist > n.ext + 0.003 and ctx.fitter.bone_depth(n.c)[0] <= 0: return None
    best = None
    for p in P:
        depth, nn, _ = ctx.fitter.bone_depth(p)
        if nn is None: continue
        v = depth + MARGIN['bone'] + extra
        if v > 0 and (best is None or v > best[0]): best = (v, nn)
    return best


# Piezas sin la regla de la piel: la cavidad de la boca de la piel de MakeHuman llega por detrás de la faringe (medido:
# ver relaciones-<modelo>.json, «retrofaringeos») y los retrofaríngeos, que por definición están ahí, quedaban «fuera».
NO_SKIN = re.compile(r'^Retropharyngeal_nodes_[LR]$')


def _push_skin(ctx, n, P, extra=0.0):
    """Lo que hay que meter el ganglio para que quede ≥ 1 mm bajo la piel (también la de las cavidades: boca, nariz)."""
    if NO_SKIN.search(n.piece): return None
    sk = ctx.fitter.skin
    m = MARGIN['skin'] + extra
    loc, nrm, _, dist = sk.find_nearest(Vector(n.c))
    if loc is None: return None
    if dist > n.ext + m + 0.002 and np.dot(n.c - np.array(loc), np.array(nrm)) < 0: return None
    best = None
    for p in P:
        loc, nrm, _, dist = sk.find_nearest(Vector(p))
        if loc is None: continue
        nrm = np.array(nrm); d = float(np.dot(p - np.array(loc), nrm))   # > 0: fuera según la cara más cercana
        if d > -m and (d > 0 or dist < 0.006):
            if d > 0 and ctx.fitter.inside_body(p): continue               # pliegue: la normal engaña
            v = d + m
            if best is None or v > best[0]: best = (v, -nrm)
    return best


def _push_vessels(ctx, n, P, extra=0.0):
    I = ctx.vessels.near(n.c, n.ext)
    if not len(I): return None
    g, Q, d = ctx.vessels.gaps(P, I)
    i, j = np.unravel_index(np.argmin(g), g.shape)
    v = MARGIN['vessel'] + extra - g[i, j]
    if v <= 0: return None
    if d[i, j] < 1e-6: return v, _unit(n.c - Q[i, j]), ctx.vessels.name[I[j]]
    return v, (P[i] - Q[i, j]) / d[i, j], ctx.vessels.name[I[j]]


def _toward_tether(ctx, n):
    """Dirección del centro del ganglio a su vaso de referencia (o None)."""
    t = n.tether
    if t is None or t[0] != 'vessel': return None
    I = np.concatenate([ctx.vessels.index[v] for v in t[1] if v in ctx.vessels.index]) if any(v in ctx.vessels.index for v in t[1]) else None
    if I is None: return None
    g, Q, _ = ctx.vessels.gaps(n.c[None], I)
    return _unit(Q[0, int(np.argmin(g[0]))] - n.c)


def _push_solids(ctx, n, P, kinds, extra=0.0):
    lo, hi = n.c - n.ext, n.c + n.ext
    best = None
    for s in ctx.solids:
        if not s.closed or s.kind not in kinds or (lo > s.hi).any() or (hi < s.lo).any(): continue
        if s.kind == 'organ' and natural(n.piece, s.name): continue
        r = s.depth(P)
        if r is None: continue
        v, d = r[0] + MARGIN[s.kind if s.kind in MARGIN else 'organ'] + extra, r[1]
        # Un ganglio de una cadena vascular metido en un músculo sale hacia su vaso (por el lado profundo del músculo),
        # no por la cara más cercana: los de la yugular interna, dentro del esternocleidomastoideo, salían por fuera.
        u = _toward_tether(ctx, n) if s.kind == 'muscle' else None
        if u is not None:
            exit_ = 0.0
            for p in P:
                if not parity_inside(s.T, p): continue
                hit = s.T.ray_cast(Vector(p) + Vector(u) * 1e-5, Vector(u), 0.05)
                if hit[0] is not None: exit_ = max(exit_, hit[3])
            if exit_ > 0: v, d = exit_ + MARGIN['muscle'] + extra, u
        if best is None or v > best[0]: best = (v, d, s.name)
    return best


def _push_tether(ctx, n, P, extra=0.0):
    """Si el ganglio está más lejos de su vaso (o músculo) de referencia de lo debido, hacia él."""
    t = n.tether
    if t is None: return None
    kind, name, gmax = t
    if kind == 'vessel':
        Is = [ctx.vessels.index[v] for v in name if v in ctx.vessels.index]
        if not Is: return None
        I = np.concatenate(Is)
        g, Q, _ = ctx.vessels.gaps(P, I)
        i, j = np.unravel_index(np.argmin(g), g.shape)
        if g[i, j] <= gmax: return None
        return g[i, j] - gmax, _unit(Q[i, j] - P[i]), ctx.vessels.name[I[j]]
    s = ctx.solid_by_name.get(name)
    if s is None: return None
    best = None
    for p in P:
        loc, _, _, d = s.T.find_nearest(Vector(p))
        if loc is not None and (best is None or d < best[0]): best = (d, np.array(loc) - p)
    if best is None or best[0] <= gmax: return None
    return best[0] - gmax, _unit(best[1]), name


# Ganglios que deben quedar cubiertos por un músculo vistos de lado (la cadena yugular, profunda al esternocleidomastoideo).
# Solo la parte alta de la cadena: los anteroinferiores, empujados bajo el músculo, acababan metidos en él (hasta 12 mm)
# porque la yugular baja ya va por detrás de su borde; su relación se sigue midiendo (relations) pero no se fuerza.
COVER = [(r'^(Jugulodigastric_node|Lateral_superior_jugular_node)_[LR]$', 'Sternocleidomastoid_muscle')]


def _cover_of(n):
    for pat, m in COVER:
        if re.search(pat, n.piece): return f'{m}_{n.side}'
    return None


def covered(ctx, n, c=None):
    """Cuántos de 3 rayos hacia fuera (lateral, ±30° adelante y atrás) cruzan el músculo de COVER antes que la piel."""
    m = ctx.solid_by_name.get(n.cover) if n.cover else None
    if m is None: return None
    c = n.c if c is None else c
    lat = np.array([1.0 if n.side == 'L' else -1.0, 0, 0])
    k = 0
    for d in (lat, _unit(lat + [0, -0.55, 0]), _unit(lat + [0, 0.55, 0])):
        h = m.T.ray_cast(Vector(c), Vector(d), 0.12)
        sk = ctx.fitter.skin.ray_cast(Vector(c), Vector(d), 0.2)
        if h[0] is not None and (sk[0] is None or h[3] < sk[3]): k += 1
    return k


def _push_cover(ctx, n, P, extra=0.0):
    if not n.cover: return None
    k = covered(ctx, n)
    if k is None or k >= 2: return None
    u = _toward_tether(ctx, n)
    if u is None: u = np.array([-1.0 if n.side == 'L' else 1.0, 0, 0])
    return 0.002, u, n.cover


CHECKS = (('vessel', _push_vessels), ('bone', _push_bone), ('skin', _push_skin),
          ('organ', lambda ctx, n, P, e=0.0: _push_solids(ctx, n, P, ('organ', 'heart'), e)),
          ('muscle', lambda ctx, n, P, e=0.0: _push_solids(ctx, n, P, ('muscle',), e)),
          ('tether', _push_tether), ('cover', _push_cover))


def violations(ctx, n, P=None, c=None, extra=0.0, first=False):
    """{comprobación: (cuánto, dirección[, con qué])} del ganglio en c (por defecto, su centro). `first`: para en la
    primera (para saber solo si un sitio vale)."""
    c0 = n.c
    if c is not None: n.c = np.asarray(c, float)
    P = n.points(SAMPLE if P is None else P)
    out = {}
    try:
        for key, fn in CHECKS:
            r = fn(ctx, n, P, extra)
            if r:
                out[key] = r
                if first: break
    finally:
        n.c = c0
    return out


def _combine(vs):
    """Junta empujes de varios obstáculos: lo que uno ya cubre en su dirección no se suma; los opuestos se anulan (y así
    se ve que el ganglio no cabe)."""
    vs = sorted((v for v in vs if np.linalg.norm(v) > 0), key=lambda v: -np.linalg.norm(v))
    if not vs: return np.zeros(3)
    d = vs[0].copy()
    for v in vs[1:]:
        nd = np.linalg.norm(d)
        if nd < 1e-12: d = d + v; continue
        u = d / nd
        d = d + v - u * min(max(float(v @ u), 0.0), nd)
    return d


def _step(ctx, n, extra=ITER_EXTRA):
    """(desplazamiento, mayor empuje) para sacar al ganglio de todos los obstáculos a la vez."""
    P = n.points()
    vs = []
    for key, fn in CHECKS:
        r = fn(ctx, n, P, extra)
        if r: vs.append(np.asarray(r[1]) * min(r[0], STEP_MAX))
    if not vs: return np.zeros(3), 0.0
    return _combine(vs), max(np.linalg.norm(v) for v in vs)


def _overlap(a, b, ca=None, cb=None, grow=1.0):
    return a.inside_bound(b.points(c=cb), ca, grow).any() or b.inside_bound(a.points(c=ca), cb, grow).any()


def _symmetrize(ctx):
    """Cada pareja izquierda/derecha se mueve igual (en espejo): el desplazamiento de los dos lados, juntos; la escala, la
    menor."""
    for n in ctx.nodes:
        p = n.partner
        if p is None or not n.primary: continue
        d = _combine([n.c - n.anchor, MIRROR @ (p.c - p.anchor)])
        n.c, p.c = n.anchor + d, p.anchor + MIRROR @ d
        s = min(n.scale, p.scale); n.scale = p.scale = s
        sep = _combine([n.sep, MIRROR @ p.sep])
        n.sep, p.sep = sep.copy(), MIRROR @ sep


def _kd(ctx):
    C = np.array([n.c for n in ctx.nodes])
    kd = kdtree.KDTree(len(C))
    for i, p in enumerate(C): kd.insert(p, i)
    kd.balance()
    return kd


def _resolve_overlaps(ctx):
    """Ganglios que se solapan: se encogen los dos lo justo (≥ 60 %) y, si no basta, se separan (≤ 2 mm cada uno, y solo
    hacia sitios libres de obstáculos)."""
    kd = _kd(ctx)
    rmax = max(n.ext for n in ctx.nodes)
    changed = 0
    for i, a in enumerate(ctx.nodes):
        for _, j, dist in kd.find_range(Vector(a.c), a.ext + rmax + 0.004):
            if j <= i: continue
            b = ctx.nodes[j]
            if np.linalg.norm(a.c - b.c) > a.ext + b.ext or not _overlap(a, b): continue
            changed += 1
            # 1. encoger los dos por igual, lo justo (la mayor escala sin solape)
            sa, sb = a.scale, b.scale
            kmin = max(MIN_SCALE / sa, MIN_SCALE / sb)
            a.scale, b.scale = sa * kmin, sb * kmin
            if not _overlap(a, b):
                lo, hi = kmin, 1.0
                for _ in range(10):
                    k = (lo + hi) / 2; a.scale, b.scale = sa * k, sb * k
                    lo, hi = (k, hi) if not _overlap(a, b) else (lo, k)
                a.scale, b.scale = sa * lo, sb * lo
                a.moved = b.moved = True
                continue
            # 2. separar, a lo largo de la recta que une los centros
            u = _unit(a.c - b.c) if np.linalg.norm(a.c - b.c) > 1e-6 else np.array([0.0, 0, 1])
            room_a, room_b = MAX_SEPARATION - np.linalg.norm(a.sep), MAX_SEPARATION - np.linalg.norm(b.sep)
            t = None
            for ta, tb in ((min(room_a, room_b), min(room_a, room_b)), (room_a, 0.0), (0.0, room_b)):
                if ta + tb <= 1e-5 or _overlap(a, b, a.c + u * ta, b.c - u * tb): continue
                lo, hi = 0.0, 1.0
                for _ in range(12):
                    f = (lo + hi) / 2
                    lo, hi = (f, hi) if _overlap(a, b, a.c + u * ta * f, b.c - u * tb * f) else (lo, f)
                ca, cb = a.c + u * ta * hi, b.c - u * tb * hi
                if (ta and violations(ctx, a, c=ca, first=True)) or (tb and violations(ctx, b, c=cb, first=True)): continue
                t = (ca - a.c, cb - b.c); break
            if t is None:
                a.flags.add('solape'); b.flags.add('solape'); continue
            a.c, b.c = a.c + t[0], b.c + t[1]
            a.sep, b.sep = a.sep + t[0], b.sep + t[1]
            a.moved = b.moved = True
    return changed


SHELL = None


def _shell(n=64):
    """Direcciones repartidas por la esfera (Fibonacci)."""
    i = np.arange(n) + 0.5
    phi = np.arccos(1 - 2 * i / n); th = np.pi * (1 + 5 ** 0.5) * i
    return np.column_stack([np.cos(th) * np.sin(phi), np.sin(th) * np.sin(phi), np.cos(phi)])


def _free(ctx, n, c, kd, extra):
    if violations(ctx, n, c=c, extra=extra, first=True): return False
    for _, j, _ in kd.find_range(Vector(c), n.ext + 0.035):
        o = ctx.nodes[j]
        if o is n or o is n.partner: continue
        if np.linalg.norm(o.c - c) < n.ext + o.ext and _overlap(n, o, c, None): return False
    return True


def _search(ctx, n, kd, extra=ITER_EXTRA, rmax=0.018):
    """Sitio libre más cercano (en capas de 1 mm alrededor del centro actual, hasta rmax), primero al tamaño actual y
    luego al 60 %; con su pareja en espejo. Devuelve True si lo encuentra."""
    global SHELL
    if SHELL is None: SHELL = _shell(64)
    p = n.partner
    for scale in sorted({n.scale, MIN_SCALE}, reverse=True):
        old = (n.scale, p.scale if p is not None else None)
        n.scale = scale
        if p is not None: p.scale = scale
        for r in np.arange(0.0, rmax + 1e-9, 0.001):
            D = SHELL * r if r > 0 else np.zeros((1, 3))
            order = np.argsort(np.linalg.norm(n.c + D - n.anchor, axis=1))
            for k in order:
                c = n.c + D[k]
                if not _free(ctx, n, c, kd, extra): continue
                if p is not None and not _free(ctx, p, p.c + MIRROR @ D[k], kd, extra): continue
                n.c = c
                if p is not None: p.c = p.c + MIRROR @ D[k]
                return True
        n.scale = old[0]
        if p is not None: p.scale = old[1]
    return False


# Grupos que Z-Anatomy pone mal respecto a sus vasos (medido en relaciones-<modelo>.json antes de corregir):
#  - lumbares: los seis grupos estaban amontonados en una franja de 2 cm delante de la columna, entre la aorta y la cava
#    (los «aórticos laterales» a la derecha de la aorta, sobre la cava). Se llevan al lado que dice su nombre, a la misma
#    altura: aórticos laterales a la izquierda de la aorta, precavales delante de la cava, etc. Es una colocación de
#    manual (esquemática), no medida.
#  - supratrocleares: estaban a la altura del epicóndilo medial (hasta 4 mm por debajo); suben juntos lo justo para quedar
#    por encima de él (≥ 5 mm), como en los atlas.
AROUND = {  # pieza: (vaso, dirección en el cuerpo: +x izquierda, −y delante; holgura a la pared en mm)
    'Lateral_aortic_nodes': ('Abdominal_aorta', (1.0, 0.35, 0.0), 1.0),
    'Pre_aortic_nodes': ('Abdominal_aorta', (0.15, -1.0, 0.0), 1.0),
    'Retro_aortic_nodes': ('Abdominal_aorta', (0.45, 1.0, 0.0), 1.0),
    'Lateral_caval_nodes': ('Inferior_vena_cava_abdominal_part', (-1.0, 0.35, 0.0), 1.0),
    'Precaval_nodes': ('Inferior_vena_cava_abdominal_part', (-0.15, -1.0, 0.0), 1.0),
    'Retrocaval_nodes': ('Inferior_vena_cava_abdominal_part', (-0.45, 1.0, 0.0), 1.0),
}
ABOVE_EPICONDYLE = (r'^Supratrochlear_nodes_[LR]$', 0.005)
#  - lacunares e inguinales profundos (nodos que Z-Anatomy esconde; medido antes de corregir: los lacunares a 11–22 mm de
#    los vasos ilíacos externos y el inguinal profundo proximal por fuera de la vena femoral). Los lacunares van en la
#    laguna vascular, bajo el ligamento inguinal (a la altura del final de la ilíaca externa): el medial por dentro de la
#    vena, el intermedio entre la vena y la arteria (por delante) y el lateral por fuera de la arteria; los inguinales
#    profundos, por dentro de la vena femoral, a su altura (TA2: «nodi inguinales profundi», mediales a la vena).
#    Colocación de manual (esquemática), no medida.
SIDED = {  # pieza sin lado: (lugar, holgura a la pared en mm)
    'Medial_lacunar_node': ('lacuna_medial', 1.0), 'Intermediate_lacunar_node': ('lacuna_between', 1.0),
    'Lateral_lacunar_node': ('lacuna_lateral', 1.0),
    'Proximal_deep_inguinal_node': ('femoral_medial', 1.0), 'Intermediate_deep_inguinal_node': ('femoral_medial', 1.0),
}
#  - submentonianos: Z-Anatomy los deja delante del milohioideo, junto a la sínfisis de la mandíbula (0 de 8 entre los
#    vientres anteriores del digástrico y bajo el milohioideo). Se llevan, cada uno lo justo, al triángulo submentoniano:
#    entre los bordes mediales de los dos vientres anteriores y apoyados en la cara inferior del milohioideo.
SUBMENTAL = r'^Submental_nodes_[LR]$'
SHALLOW_MAX = 0.012     # m: un inguinal superficial más hondo que esto bajo la piel sube al tejido subcutáneo


def _axis_point(ctx, vessel, z):
    ln = ctx.vessels.line(vessel)
    if ln is None: return None, None
    P, r = ln
    i = int(np.argmin(np.abs(P[:, 2] - z)))
    return P[i], r[i]


def medial_epicondyle(side):
    """Punto más medial del extremo distal del húmero (el epicóndilo medial) y el eje del húmero hacia arriba."""
    H = _bone(f'Humerus_{side}')
    if H is None: return None, None
    c = H.mean(0); ax = np.linalg.svd(H - c)[2][0]; ax = ax if ax[2] > 0 else -ax
    t = (H - c) @ ax
    low = H[t < t.min() + 0.04]
    return low[int(np.argmin(np.abs(low[:, 0])))], ax


def relocate(ctx):
    """Correcciones de grupo descritas arriba (AROUND, ABOVE_EPICONDYLE). Mueven el anclaje; el original queda en
    n.zanchor."""
    moved = collections.Counter()
    for piece, (vessel, d, g) in AROUND.items():
        for n in ctx.pieces.get(piece, []):
            c, r = _axis_point(ctx, vessel, n.anchor[2])
            if c is None: continue
            u = _unit(np.array(d, float))
            n.anchor = np.array([c[0], c[1], n.anchor[2]]) + u * (r + g / 1000 + n.shape[1])
            n.c = n.anchor.copy(); n.flags.add('recolocado'); moved[piece] += 1
    pat, gap = ABOVE_EPICONDYLE
    for piece, ns in ctx.pieces.items():
        if not re.search(pat, piece): continue
        epi, ax = medial_epicondyle(ns[0].side)
        if epi is None: continue
        low = min(float((n.anchor - epi) @ ax) for n in ns)
        if low >= gap: continue
        for n in ns:
            n.anchor = n.anchor + ax * (gap - low); n.c = n.anchor.copy(); n.flags.add('recolocado')
        moved[piece] += len(ns)
    # Lacunares e inguinales profundos (SIDED).
    for piece, ns in ctx.pieces.items():
        rule = SIDED.get(piece[:-2]) if piece.endswith(('_L', '_R')) else None
        if not rule: continue
        where, g = rule
        s = piece[-1]; medial = np.array([-1.0 if s == 'L' else 1.0, 0.0, 0.0])
        for n in ns:
            if where == 'femoral_medial':
                c, r = _axis_point(ctx, f'Femoral_vein_{s}', n.anchor[2])
                if c is None: continue
                u = _unit(medial * 0.8 + np.array([0, -0.6, 0]))          # por dentro y algo por delante (conducto femoral)
                n.anchor = c + u * (r + g / 1000 + n.shape[1])
            else:
                lv, la_ = ctx.vessels.line(f'External_iliac_vein_{s}'), ctx.vessels.line(f'External_iliac_artery_{s}')
                if lv is None or la_ is None: continue
                iv, ia = int(np.argmin(lv[0][:, 2])), int(np.argmin(la_[0][:, 2]))
                ve, rv, ae, ra = lv[0][iv], lv[1][iv], la_[0][ia], la_[1][ia]
                if where == 'lacuna_medial':
                    n.anchor = ve + medial * (rv + g / 1000 + n.shape[1])
                elif where == 'lacuna_lateral':
                    # por fuera y por delante de la arteria: justo por fuera está el iliopsoas (en la mujer quedaba 13 mm
                    # dentro de él)
                    u = _unit(-medial * 0.5 + np.array([0, -0.85, 0]))
                    n.anchor = ae + u * (ra + g / 1000 + n.shape[1])
                else:
                    n.anchor = (ve + ae) / 2 + np.array([0, -1.0, 0]) * (max(rv, ra) + g / 1000 + n.shape[2])
            n.c = n.anchor.copy(); n.flags.add('recolocado'); moved[piece] += 1
    # Inguinales superficiales hundidos (Z-Anatomy deja alguno a 33 mm bajo la piel, por encima del ligamento): al tejido
    # subcutáneo, a lo largo de la normal de la piel, con su semieje corto + 3 mm de piel encima.
    for piece, ns in ctx.pieces.items():
        if 'superficial_inguinal' not in piece: continue
        for n in ns:
            depth, nrm = ctx.skin_gap(n.anchor)
            if depth is None or depth <= SHALLOW_MAX: continue
            n.anchor = n.anchor + nrm * (depth - n.shape[2] - 0.003)
            n.c = n.anchor.copy(); n.flags.add('recolocado'); moved[piece] += 1
    # Submentonianos (SUBMENTAL).
    S = getattr(ctx, 'solid_by_name', {})
    bellies = [S.get(f'Anterior_belly_of_digastric_muscle_{s}') for s in 'LR']
    myl = [m for m in (S.get(f'Mylohyoid_muscle_{s}') for s in 'LR') if m is not None]
    if all(bellies) and myl:
        for piece, ns in ctx.pieces.items():
            if not re.search(SUBMENTAL, piece): continue
            for n in ns:
                p = n.anchor.copy(); w = n.shape[1] + 0.001
                for step in range(16):                                     # hacia atrás, de 2 en 2 mm, hasta el milohioideo
                    q = p + np.array([0, 0.002 * step, 0])
                    lim = min(abs(b.T.find_nearest(Vector((0.0, q[1], q[2])))[0][0]) for b in bellies)
                    x = float(np.clip(q[0], -max(lim - w, 0), max(lim - w, 0)))
                    hits = [h[0][2] for h in (m.T.ray_cast(Vector((x, q[1], q[2] - 0.04)), Vector((0, 0, 1.0)), 0.1) for m in myl)
                            if h[0] is not None]
                    if not hits: continue
                    n.anchor = np.array([x, q[1], min(hits) - n.shape[2] - 0.0008])
                    n.c = n.anchor.copy(); n.flags.add('recolocado'); moved[piece] += 1
                    break
    log(f'  linfático: grupos recolocados respecto a sus vasos o huesos: {dict(moved)}')


def place(ctx, rounds=30):
    """Coloca todos los ganglios (ver la cabecera). Devuelve las comprobaciones que quedan sin cumplir."""
    for n in ctx.nodes: n.zanchor = n.anchor.copy()
    ctx.solid_by_name = {s.name: s for s in ctx.solids}
    pair_sides(ctx); orient(ctx)
    relocate(ctx); orient(ctx)                 # la orientación, con los anclajes ya corregidos
    for n in ctx.nodes: n.tether, n.cover, n.moved = _tether_of(n), _cover_of(n), True
    # 1. Empujes de los obstáculos (los dos lados de una pareja a la vez) y solapes, por vueltas.
    for it in range(rounds):
        moved = 0
        for n in ctx.nodes:
            if not n.primary: continue
            if not n.moved and (n.partner is None or not n.partner.moved): continue
            d, worst = _step(ctx, n)
            if n.partner is not None:
                dr, wr = _step(ctx, n.partner)
                d, worst = _combine([d, MIRROR @ dr]), max(worst, wr)
            n.moved = False
            if n.partner is not None: n.partner.moved = False
            if worst <= 1e-5: n.stuck = 0; continue
            moved += 1
            n.c = n.c + d; n.moved = True
            if n.partner is not None: n.partner.c = n.partner.c + MIRROR @ d; n.partner.moved = True
            # Empujes que se anulan: el ganglio no cabe ahí. Más pequeño (hasta el 60 %).
            n.stuck = n.stuck + 1 if np.linalg.norm(d) < 0.5 * worst else max(0, n.stuck - 1)
            if n.stuck > 3 and n.scale > MIN_SCALE:
                n.scale = max(MIN_SCALE, n.scale * 0.92); n.stuck = 0
                if n.partner is not None: n.partner.scale = n.scale
        _symmetrize(ctx)
        ov = _resolve_overlaps(ctx)
        _symmetrize(ctx)
        if not moved and not ov: break
    # 2. Los que no han quedado bien: el sitio libre más cercano (con su pareja en espejo y, si no hay, cada lado solo).
    kd = _kd(ctx)
    searched = collections.Counter()
    for n in ctx.nodes:
        if not (n.primary or n.partner is None): continue
        bad = violations(ctx, n, extra=ITER_EXTRA, first=True) or \
            (n.partner is not None and violations(ctx, n.partner, extra=ITER_EXTRA, first=True))
        if not bad: continue
        if _search(ctx, n, kd): searched['simétrico' if n.partner is not None else 'impar'] += 1; continue
        if n.partner is not None:
            p, n.partner, p.partner = n.partner, None, None
            for m in (n, p):
                if violations(ctx, m, extra=ITER_EXTRA, first=True):
                    ok = _search(ctx, m, kd); m.flags.add('asimétrico')
                    searched['un lado' if ok else 'sin sitio'] += 1
                    if not ok: m.flags.add('sin sitio')
            n.partner, p.partner = p, n
        else:
            n.flags.add('sin sitio'); searched['sin sitio'] += 1
    _resolve_overlaps(ctx)
    # 3. Comprobación final con los 92 vértices de cada ganglio y el margen justo.
    left = collections.Counter()
    for n in ctx.nodes:
        v = violations(ctx, n, BEAN_V)
        n.left = {k: round(float(r[0]) * 1000, 2) for k, r in v.items() if r[0] > 5e-5}
        for k in n.left: left[k] += 1
    overl = sum(1 for n in ctx.nodes if 'solape' in n.flags)
    log(f'  linfático: {len(ctx.nodes)} ganglios en {it + 1} vueltas; búsqueda de sitio libre: {dict(searched) or "ninguna"}; '
        f'quedan fuera de regla: {dict(left) or "ninguno"}; con solape: {overl}')
    return left


def mesh_of(ns):
    """Malla de una pieza (sus ganglios): vértices en el mundo y caras."""
    Vs, F, off = [], [], 0
    for n in ns:
        Vs.append(n.c + (BEAN_V * n.half) @ n.R.T)
        faces = BEAN_F if np.linalg.det(n.R) > 0 else [tuple(reversed(f)) for f in BEAN_F]
        F += [tuple(i + off for i in f) for f in faces]; off += len(BEAN_V)
    return np.vstack(Vs), F


def write_piece(obj, ns):
    """Pone en el objeto la malla de sus ganglios (centrada en su caja, como las demás piezas)."""
    V, F = mesh_of(ns)
    center = (V.min(0) + V.max(0)) / 2
    me = obj.data
    me.clear_geometry(); me.from_pydata((V - center).tolist(), [], F); me.update()
    for f in me.polygons: f.use_smooth = True
    obj.location = center
    return len(me.vertices), len(me.polygons)


# ── Relaciones (tabla de territorios del segundo revisor) ─────────────────────
def points_from_blend(path, collection, names):
    """{nombre: vértices en el mundo} de algunas piezas de un .blend construido (p. ej. los ligamentos inguinales); lo
    cargado se quita después."""
    if not os.path.exists(path): return {}
    with bpy.data.libraries.load(path) as (src, dst):
        dst.collections = [collection]
    col = dst.collections[0]
    out, junk = {}, list(col.all_objects)
    meshes = {o.data for o in junk if o.type == 'MESH'}
    mats = {m for me in meshes for m in me.materials if m}
    for o in junk:
        nm = re.sub(r'\.\d{3}$', '', o.name)
        if o.type == 'MESH' and nm in names:
            m = np.array(o.matrix_basis)
            out[nm] = np.array([v.co[:] for v in o.data.vertices]) @ m[:3, :3].T + m[:3, 3]
    cols = [col] + list(col.children_recursive)
    bpy.data.batch_remove(junk); bpy.data.batch_remove(list(meshes))
    bpy.data.batch_remove([m for m in mats if m.users == 0]); bpy.data.batch_remove(cols)
    return out


def _ray_hits(T, p, d, far=0.08):
    hit = T.ray_cast(Vector(p), Vector(d), far)
    return None if hit[0] is None else hit[3]


def relations(ctx, extra=None):
    """Mide en el modelo las relaciones de la tabla de territorios. Devuelve {relación: {'regla', 'piezas': [{pieza, k,
    medidas…, ok}], 'ok': 'n/m'}}. `extra`: {nombre: vértices} de piezas que no están en ctx (ligamentos inguinales)."""
    extra = extra or {}
    V, S = ctx.vessels, ctx.solid_by_name
    out = {}

    def gap(n, vessel):
        I = V.index.get(vessel)
        if I is None: return None
        g, _, _ = V.gaps(n.points(BEAN_V), I)
        return round(float(g.min()) * 1000, 1)

    def axis_at(vessel, z):
        ln = V.line(vessel)
        if ln is None: return None
        P = ln[0]
        return P[int(np.argmin(np.abs(P[:, 2] - z)))]

    def add(rel, rule, n, ok, **kw):
        r = out.setdefault(rel, {'regla': rule, 'piezas': []})
        kw = {k: (bool(v) if isinstance(v, np.bool_) else float(v) if isinstance(v, np.floating) else v) for k, v in kw.items()}
        r['piezas'].append({'pieza': n.piece, 'k': n.k, 'ok': bool(ok), **kw})

    def nodes(pat):
        return [n for n in ctx.nodes if re.search(pat, n.piece)]

    sk = ctx.fitter.skin
    # 1. Cadena cervical profunda: a lo largo de la yugular interna y profunda al esternocleidomastoideo.
    for n in nodes(r'^(Jugulodigastric_node|Lateral_superior_jugular_node|Anterior_inferior_jugular_nodes)_[LR]$'):
        g = gap(n, f'Internal_jugular_vein_{n.side}')
        n.cover = f'Sternocleidomastoid_muscle_{n.side}'
        cv = covered(ctx, n)
        add('cadena_cervical_profunda', 'superficie a ≤ 4 mm de la pared de la yugular interna y cubierta por el '
            'esternocleidomastoideo vista de lado (2 de 3 rayos: lateral y ±30°)', n, g is not None and g <= 4.0 and cv is not None and cv >= 2,
            hueco_yugular_mm=g, rayos_bajo_ecm=f'{cv}/3' if cv is not None else None)
    # 2. Submentonianos: entre los vientres anteriores de los digástricos, bajo el milohioideo.
    bellies = [S.get(f'Anterior_belly_of_digastric_muscle_{s}') for s in 'LR']
    myl = [S.get(f'Mylohyoid_muscle_{s}') for s in 'LR']
    for n in nodes(r'^Submental_nodes_[LR]$'):
        inner = None
        if all(bellies):
            lim = []
            for b in bellies:
                Pts = np.array([b.T.find_nearest(Vector((x, n.c[1], n.c[2])))[0][:] for x in (-0.03, 0.0, 0.03)])
                lim.append(float(np.min(np.abs(Pts[:, 0]))))
            inner = abs(n.c[0]) < min(lim)
        below = any(m is not None and _ray_hits(m.T, n.c, (0, 0, 1.0), 0.05) is not None for m in myl)
        add('submentonianos', 'centro entre los bordes mediales de los dos vientres anteriores del digástrico y con el '
            'milohioideo encima', n, inner and below, entre_vientres=inner, bajo_milohioideo=below)
    # 3. Supratrocleares (cubitales superficiales): por encima del epicóndilo medial, junto a la basílica. Los demás
    #    cubitales de Z-Anatomy (los profundos), en la fosa del codo junto a los vasos.
    for n in nodes(r'^Supratrochlear_nodes_[LR]$'):
        epi, ax = medial_epicondyle(n.side)
        if epi is None: continue
        dz = float((n.c - epi) @ ax) * 1000
        g = gap(n, f'Basilic_vein_{n.side}')
        add('cubitales', 'supratrocleares: por encima del epicóndilo medial (0–80 mm, a lo largo del húmero) y a ≤ 8 mm '
            'de la basílica', n, 0 <= dz <= 80 and g is not None and g <= 8, sobre_epicondilo_mm=round(dz, 1), hueco_basilica_mm=g)
    for n in nodes(r'^Cubital_nodes_[LR]$'):
        s_ = n.side
        gs = [x for x in (gap(n, f'Brachial_artery_{s_}'), gap(n, f'Radial_artery_{s_}'), gap(n, f'Ulnar_artery_{s_}'),
                          gap(n, f'Median_cubital_vein_{s_}'), gap(n, f'Basilic_vein_{s_}')) if x is not None]
        g = min(gs) if gs else None
        epi, ax = medial_epicondyle(s_)
        dz = float((n.c - epi) @ ax) * 1000 if epi is not None else None
        add('cubitales', 'cubitales de la fosa del codo: a ≤ 12 mm de la arteria braquial o sus ramas, o de las venas '
            'basílica o mediana del codo, y a menos de 6 cm del epicóndilo', n,
            g is not None and g <= 12 and dz is not None and abs(dz) <= 60, hueco_mm=g, sobre_epicondilo_mm=round(dz, 1) if dz is not None else None)
    # 4. Paraesternales: junto a los vasos torácicos internos.
    for n in nodes(r'^Parasternal_nodes_[LR]$'):
        gs = [x for x in (gap(n, f'Internal_thoracic_artery_{n.side}'), gap(n, f'Internal_thoracic_veins_{n.side}')) if x is not None]
        g = min(gs) if gs else None
        add('paraesternales', 'a ≤ 5 mm de la arteria o las venas torácicas internas', n, g is not None and g <= 5, hueco_mm=g)
    # 5. Celíacos: alrededor del origen del tronco celíaco.
    ct, ao = V.line('Coeliac_trunk'), V.line('Abdominal_aorta')
    if ct is not None and ao is not None:
        P = ct[0]
        d_end = [np.min(np.linalg.norm(ao[0] - P[i], axis=1)) for i in (0, -1)]
        origin = P[0] if d_end[0] <= d_end[1] else P[-1]
        for n in nodes(r'^Coeliac_nodes$'):
            d = round(float(np.linalg.norm(n.c - origin)) * 1000, 1)
            g = gap(n, 'Coeliac_trunk')
            add('celiacos', 'centro a ≤ 25 mm del origen del tronco celíaco y superficie a ≤ 6 mm del tronco', n,
                d <= 25 and g is not None and g <= 6, al_origen_mm=d, hueco_tronco_mm=g)
    # 6. Inguinales superficiales: bajo el ligamento inguinal; los inferiores, junto al final de la safena magna.
    for n in nodes(r'superficial_inguinal_nodes_[LR]$'):
        lig = extra.get(f'Inguinal_ligament_{n.side}')
        below = None
        if lig is not None:
            near = lig[np.abs(lig[:, 0] - n.c[0]) < 0.008]
            if len(near): below = bool(n.c[2] < near[:, 2].mean())
        gsv = V.line(f'Great_saphenous_vein_{n.side}')
        d_end = None
        if gsv is not None:
            top = gsv[0][int(np.argmax(gsv[0][:, 2]))]
            d_end = round(float(np.linalg.norm(n.c - top)) * 1000, 1)
        depth = ctx.skin_gap(n.c)[0]
        fv = axis_at(f'Femoral_vein_{n.side}', n.c[2])
        front = None if fv is None else bool(n.c[1] < fv[1])
        inf = n.piece.startswith('Inferior')
        g_s = gap(n, f'Great_saphenous_vein_{n.side}')
        add('inguinales_superficiales', 'bajo el ligamento inguinal (su línea media) y por delante de la vena femoral; los '
            'inferiores, a ≤ 8 mm de la safena magna y a ≤ 70 mm de su final', n,
            below is not False and front is not False and (not inf or (g_s is not None and g_s <= 8 and d_end is not None and d_end <= 70)),
            bajo_ligamento=below, delante_vena_femoral=front, hueco_safena_mm=g_s, al_final_safena_mm=d_end,
            prof_piel_mm=round(depth * 1000, 1) if depth is not None else None)
    # 7. Inguinales profundos: mediales a la vena femoral.
    for n in nodes(r'deep_inguinal_node_[LR]$'):
        c = axis_at(f'Femoral_vein_{n.side}', n.c[2])
        g = gap(n, f'Femoral_vein_{n.side}')
        medial = None if c is None else bool(abs(n.c[0]) < abs(c[0]))
        add('inguinales_profundos', 'mediales a la vena femoral y a ≤ 4 mm de ella', n, medial and g is not None and g <= 4,
            medial=medial, hueco_vena_mm=g)
    # 8. Poplíteos: en la fosa poplítea, junto a sus vasos (los superficiales, junto a la safena menor).
    for n in nodes(r'popliteal_nodes_[LR]$'):
        F = _bone(f'Femur_{n.side}')
        behind = None
        if F is not None:
            sl = F[(np.abs(F[:, 2] - n.c[2]) < 0.02) & (np.abs(F[:, 0] - n.c[0]) < 0.012)]
            if len(sl): behind = bool(n.c[1] > sl[:, 1].max())
        deep = n.piece.startswith('Deep')
        gs = [x for x in ((gap(n, f'Popliteal_vein_{n.side}'), gap(n, f'Popliteal_artery_{n.side}')) if deep
                          else (gap(n, f'Small_saphenous_vein_{n.side}'),)) if x is not None]
        g = min(gs) if gs else None
        add('popliteos', 'detrás del fémur (en la fosa); los profundos a ≤ 5 mm de la vena o la arteria poplíteas, los '
            'superficiales a ≤ 8 mm de la safena menor', n, behind and g is not None and g <= (5 if deep else 8),
            detras_femur=behind, hueco_vaso_mm=g)
    # 9. Retrofaríngeos: detrás de la faringe y delante de los cuerpos vertebrales altos (sobre el largo de la cabeza).
    C1, C3 = _bone('Vertebra_C1_Atlas'), _bone('Vertebra_C3')
    phar = [S.get(nm) for nm in ('Nasopharynx', 'Oropharynx') if S.get(nm)] + \
           [S.get(f'Superior_pharyngeal_constrictor_{s}') for s in 'LR' if S.get(f'Superior_pharyngeal_constrictor_{s}')]
    for n in nodes(r'^Retropharyngeal_nodes_[LR]$'):
        front = min((h for h in (_ray_hits(t.T, n.c, (0, -1.0, 0), 0.05) for t in phar) if h is not None), default=None)
        lc = S.get(f'Longus_capitis_muscle_{n.side}')
        g_lc = None
        if lc is not None:
            loc, _, _, d = lc.T.find_nearest(Vector(n.c)); g_lc = round(float(d - n.half[2]) * 1000, 1)
        level = None
        if C1 is not None and C3 is not None:
            level = bool(C3[:, 2].mean() - 0.005 <= n.c[2] <= C1[:, 2].max() + 0.005)
        loc, nrm, _, dsk = sk.find_nearest(Vector(n.c))
        out_skin = loc is not None and float(np.dot(n.c - np.array(loc), np.array(nrm))) > 0 and not ctx.fitter.inside_body(n.c)
        back = sk.ray_cast(Vector(n.c), Vector((0, 1.0, 0)), 0.1)
        add('retrofaringeos', 'faringe delante (a ≤ 50 mm), a ≤ 3 mm del largo de la cabeza y entre el atlas y C3', n,
            front is not None and g_lc is not None and g_lc <= 3 and level,
            faringe_delante_mm=round(front * 1000, 1) if front is not None else None, hueco_largo_cabeza_mm=g_lc, nivel_c1_c3=level,
            en_cavidad_piel=bool(out_skin), pared_cavidad_detras_mm=round(back[3] * 1000, 1) if back[0] is not None and out_skin else None)
    # 10. Lumbares: a los lados, delante y detrás de la aorta y de la cava.
    rules = {'Lateral_aortic_nodes': ('Abdominal_aorta', 0, 1), 'Pre_aortic_nodes': ('Abdominal_aorta', 1, -1),
             'Retro_aortic_nodes': ('Abdominal_aorta', 1, 1), 'Lateral_caval_nodes': ('Inferior_vena_cava_abdominal_part', 0, -1),
             'Precaval_nodes': ('Inferior_vena_cava_abdominal_part', 1, -1), 'Retrocaval_nodes': ('Inferior_vena_cava_abdominal_part', 1, 1)}
    for piece, (vessel, ax, sign) in rules.items():
        for n in ctx.pieces.get(piece, []):
            c = axis_at(vessel, n.c[2])
            if c is None: continue
            side_ok = bool((n.c[ax] - c[ax]) * sign > 0)
            g = gap(n, vessel)
            add('lumbares', 'a su lado del vaso (izquierda/derecha, delante/detrás) y a ≤ 15 mm de él', n,
                side_ok and g is not None and g <= 15, lado_correcto=side_ok, hueco_mm=g, vaso=vessel)
    ao_c = lambda z: axis_at('Abdominal_aorta', z)
    for n in ctx.pieces.get('Intermediate_lumbar_nodes', []):
        a, v = ao_c(n.c[2]), axis_at('Inferior_vena_cava_abdominal_part', n.c[2])
        if a is None or v is None: continue
        between = bool(min(a[0], v[0]) <= n.c[0] <= max(a[0], v[0]))
        add('lumbares', 'intermedios: entre la aorta y la cava', n, between, entre_aorta_y_cava=between)
    # 11. Ilíacos y obturadores: junto a sus vasos.
    for n in nodes(r'external_iliac_nodes_[LR]$|lacunar_node_[LR]$'):
        gs = [x for x in (gap(n, f'External_iliac_artery_{n.side}'), gap(n, f'External_iliac_vein_{n.side}')) if x is not None]
        g = min(gs) if gs else None
        add('iliacos', 'externos y lacunares: a ≤ 8 mm de la arteria o la vena ilíaca externa', n, g is not None and g <= 8, hueco_mm=g)
    for n in nodes(r'common_iliac_nodes$|^Subaortic_nodes$'):
        gs = [x for s in 'LR' for x in (gap(n, f'Common_iliac_artery_{s}'), gap(n, f'Common_iliac_vein_{s}')) if x is not None]
        g = min(gs) if gs else None
        add('iliacos', 'comunes y subaórticos: a ≤ 10 mm de una arteria o vena ilíaca común', n, g is not None and g <= 10, hueco_mm=g)
    for n in nodes(r'^Obturator_nodes_[LR]$'):
        gs = [x for x in (gap(n, f'Obturator_artery_{n.side}'), gap(n, f'Obturator_veins_{n.side}'), gap(n, f'Obturator_vein_{n.side}')) if x is not None]
        g = min(gs) if gs else None
        add('iliacos', 'obturadores: a ≤ 8 mm de los vasos obturadores', n, g is not None and g <= 8, hueco_mm=g)
    # 12. Axilares.
    for n in nodes(r'_axillary_nodes_[LR]$'):
        s = n.side
        kind = n.piece.split('_')[0]
        ref = {'Lateral': [f'Axillary_vein_{s}'], 'Apical': [f'Axillary_vein_{s}', ('Left' if s == 'L' else 'Right') + '_subclavian_vein'],
               'Anterior': [f'Lateral_thoracic_artery_{s}', f'Lateral_thoracic_vein_{s}'],
               'Posterior': [f'Subscapular_artery_{s}', f'Thoracodorsal_artery_{s}', f'Subscapular_vein_{s}'],
               'Central': [f'Axillary_vein_{s}']}[kind]
        lim = {'Lateral': 8, 'Apical': 10, 'Anterior': 10, 'Posterior': 12, 'Central': 30}[kind]
        gs = [x for x in (gap(n, r) for r in ref) if x is not None]
        g = min(gs) if gs else None
        add('axilares', 'laterales a ≤ 8 mm de la vena axilar; apicales a ≤ 10 mm de la axilar o la subclavia; anteriores '
            'a ≤ 10 mm de los vasos torácicos laterales; posteriores a ≤ 12 mm de los subescapulares; centrales a ≤ 30 mm '
            'de la vena axilar (en la grasa)', n, g is not None and g <= lim, hueco_mm=g, referencia=ref[0])
    for r in out.values():
        r['ok'] = f"{sum(p['ok'] for p in r['piezas'])}/{len(r['piezas'])}"
    return out


# ── Informes ──────────────────────────────────────────────────────────────────
def save_reports(ctx, relations=None):
    os.makedirs(REPORT_DIR, exist_ok=True)
    inv_path = os.path.join(REPORT_DIR, 'inventario.json')
    inv = json.load(open(inv_path, encoding='utf-8')) if os.path.exists(inv_path) else {}
    inv[MODEL] = ctx.inventory
    json.dump(inv, open(inv_path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    rows = []
    for n in ctx.nodes:
        rows.append({'piece': n.piece, 'k': n.k, 'side': n.side, 'center_m': [round(float(x), 5) for x in n.c],
                     'axes': [[round(float(x), 4) for x in n.R[:, j]] for j in range(3)],
                     'semi_mm': [round(float(x) * 1000, 2) for x in n.half], 'scale': round(n.scale, 3),
                     'target_mm': n.target_mm, 'zanatomy_m': [round(float(x), 5) for x in getattr(n, 'zanchor', n.anchor)],
                     'moved_mm': round(float(np.linalg.norm(n.c - getattr(n, 'zanchor', n.anchor))) * 1000, 2),
                     'regroup_mm': round(float(np.linalg.norm(n.anchor - getattr(n, 'zanchor', n.anchor))) * 1000, 2),
                     'separated_mm': round(float(np.linalg.norm(n.sep)) * 1000, 2), 'vessel': n.vessel,
                     'left': getattr(n, 'left', {}), 'flags': sorted(n.flags)})
    json.dump(rows, open(os.path.join(REPORT_DIR, f'nodos-{MODEL}.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
    if relations is not None:
        json.dump(relations, open(os.path.join(REPORT_DIR, f'relaciones-{MODEL}.json'), 'w', encoding='utf-8'),
                  ensure_ascii=False, indent=1)


# ── Vasos linfáticos: conductos, troncos y colectores (hito 9, segunda parte) ─
# Todo se traza sobre el propio modelo (vértebras, aorta, ácigos, esófago, yugulares, subclavias… ya ajustados), no con
# coordenadas fijas: vale para el hombre y para la mujer. Lo esquemático y las variantes elegidas quedan registrados en
# RUTAS (build/linfatico/rutas-<modelo>.json y web/src/data/linfatico-rutas.js) y en el documento del hito.
V_STEP = 0.003                 # m entre los puntos del eje mientras se traza
R_DUCT = 0.0017                # radio del conducto torácico (3,4 mm de diámetro)…
R_DUCT_END = 0.0021            # …algo mayor en los extremos (4,2 mm)
R_CIST = 0.0030                # semieje mayor de la cisterna del quilo (6 mm de ancho; 4,8 mm de delante atrás)
CIST_LEN = 0.050               # longitud de la cisterna (m)
CIST_SQUASH = 0.8              # sección algo aplanada de delante atrás (6 × 4,8 mm en el centro); se comprueba con el radio entero
R_TRUNK = 0.0011               # troncos: 2,2 mm de diámetro
R_COLL = 0.0006                # colectores: 1,2 mm de diámetro
WALL = 0.0010                  # holgura de pared a pared con el vaso guía (0,5–1,5 mm)
MARG = {'bone': 0.0003, 'skin': 0.0005, 'vessel': 0.0002, 'organ': 0.0003}
SEG_DUCT, SEG_COLL = 8, 6      # lados de los tubos
# Vasos grandes (y el hueso) que los puntos de paso de la vía central evitan antes que los segmentarios finos.
BIG = r'aorta|vena_cava|Azygos|iliac|brachiocephalic|subclavian|jugular|Oesophagus'
# Venas superficiales (subcutáneas): los colectores van a su lado en el plano de la piel.
SURFACE_GUIDE = r'Basilic|Cephalic|saphenous|External_jugular|Anterior_jugular|Median_cubital|Median_antebrachial|Superficial_epigastric'

# Contrato de piezas (docs/hitos/09-sistema-linfatico.md): nombre → (inglés, español, latín, grupo, principal).
TRUNKS = 'Lymphatic trunks and ducts'
VESSELS = 'Lymphatic vessels'
VPIECES = {
    'Thoracic_duct': ('Thoracic duct', 'Conducto torácico', 'Ductus thoracicus', TRUNKS, True),
    'Cisterna_chyli': ('Cisterna chyli', 'Cisterna del quilo', 'Cisterna chyli', TRUNKS, True),
    'Right_lymphatic_duct': ('Right lymphatic duct', 'Conducto linfático derecho', 'Ductus lymphaticus dexter', TRUNKS, True),
    'Jugular_trunk': ('Jugular trunk', 'Tronco yugular', 'Truncus jugularis', TRUNKS, True),
    'Subclavian_trunk': ('Subclavian trunk', 'Tronco subclavio', 'Truncus subclavius', TRUNKS, True),
    'Bronchomediastinal_trunk': ('Bronchomediastinal trunk', 'Tronco broncomediastínico', 'Truncus bronchomediastinalis', TRUNKS, True),
    'Lumbar_trunk': ('Lumbar trunk', 'Tronco lumbar', 'Truncus lumbalis', TRUNKS, True),
    'Intestinal_trunks': ('Intestinal trunks', 'Troncos intestinales', 'Trunci intestinales', TRUNKS, True),
    # Colectores esquemáticos: latín descriptivo (la TA2 solo tiene «Vasa lymphatica superficialia/profunda»).
    'Lymphatic_vessels_of_head': ('Lymphatic vessels of head', 'Vasos linfáticos de la cabeza', 'Vasa lymphatica capitis', VESSELS, False),
    'Lymphatic_vessels_of_neck': ('Lymphatic vessels of neck', 'Vasos linfáticos del cuello', 'Vasa lymphatica colli', VESSELS, False),
    'Superficial_lymphatic_vessels_of_upper_limb': ('Superficial lymphatic vessels of upper limb', 'Vasos linfáticos superficiales del miembro superior',
                                                    'Vasa lymphatica superficialia membri superioris', VESSELS, False),
    'Deep_lymphatic_vessels_of_upper_limb': ('Deep lymphatic vessels of upper limb', 'Vasos linfáticos profundos del miembro superior',
                                             'Vasa lymphatica profunda membri superioris', VESSELS, False),
    'Lymphatic_vessels_of_thoracic_wall': ('Lymphatic vessels of thoracic wall', 'Vasos linfáticos de la pared torácica',
                                           'Vasa lymphatica parietis thoracis', VESSELS, False),
    'Lymphatic_vessels_of_mediastinum': ('Lymphatic vessels of mediastinum', 'Vasos linfáticos del mediastino', 'Vasa lymphatica mediastini', VESSELS, False),
    'Lymphatic_vessels_of_abdomen': ('Lymphatic vessels of abdomen', 'Vasos linfáticos del abdomen', 'Vasa lymphatica abdominis', VESSELS, False),
    'Lymphatic_vessels_of_pelvis': ('Lymphatic vessels of pelvis', 'Vasos linfáticos de la pelvis', 'Vasa lymphatica pelvis', VESSELS, False),
    'Superficial_lymphatic_vessels_of_lower_limb': ('Superficial lymphatic vessels of lower limb', 'Vasos linfáticos superficiales del miembro inferior',
                                                    'Vasa lymphatica superficialia membri inferioris', VESSELS, False),
    'Deep_lymphatic_vessels_of_lower_limb': ('Deep lymphatic vessels of lower limb', 'Vasos linfáticos profundos del miembro inferior',
                                             'Vasa lymphatica profunda membri inferioris', VESSELS, False),
}
PAIRED = {'Jugular_trunk', 'Subclavian_trunk', 'Bronchomediastinal_trunk', 'Lumbar_trunk', 'Lymphatic_vessels_of_head',
          'Lymphatic_vessels_of_neck', 'Superficial_lymphatic_vessels_of_upper_limb', 'Deep_lymphatic_vessels_of_upper_limb',
          'Lymphatic_vessels_of_thoracic_wall', 'Lymphatic_vessels_of_pelvis', 'Superficial_lymphatic_vessels_of_lower_limb',
          'Deep_lymphatic_vessels_of_lower_limb'}
SGN = {'L': 1.0, 'R': -1.0}
# Órganos que un colector sí atraviesa (dentro de un meso o de un órgano con ganglios propios): patrón de la pieza de
# vasos → patrón del órgano.
V_NATURAL = [(r'abdomen', r'^Meso|omentum'), (r'mediastinum', r'lobe_of_.*lung|^Pleura|bronch'), (r'head', r'^Parotid_gland')]


def _adaptive(P, lo=0.003, hi=0.005, ang=12.0):
    """Puntos del eje cada 3–6 mm: cada 5 mm en lo recto y cada 3 mm donde gira (más de `ang` grados)."""
    keep, last = [0], 0
    for i in range(1, len(P) - 1):
        d = np.linalg.norm(P[i] - P[last])
        if d < lo: continue
        a = P[last + 1] - P[last] if last + 1 < len(P) else P[i] - P[last]
        b = P[i + 1] - P[i]
        cosang = np.dot(a, b) / max(np.linalg.norm(a) * np.linalg.norm(b), 1e-12)
        if d >= hi or np.degrees(np.arccos(np.clip(cosang, -1, 1))) > ang: keep.append(i); last = i
    if np.linalg.norm(P[-1] - P[keep[-1]]) < lo * 0.5 and len(keep) > 1: keep[-1] = len(P) - 1
    else: keep.append(len(P) - 1)
    return P[keep]


def _tube_mesh(P, r, seg, squash=1.0):
    """Tubo de `seg` lados por el eje P (radio r por punto), cerrado con un polo en cada extremo. (vértices, caras).
    `squash` < 1 aplana la sección de delante atrás (eje y; la cisterna del quilo)."""
    from female_organs import _frames
    P = np.asarray(P, float); r = np.broadcast_to(r, len(P)).astype(float)
    T0 = P[1] - P[0]; T0 = T0 / np.linalg.norm(T0)
    ref = np.eye(3)[int(np.argmin(np.abs(T0)))]
    T, N, B = _frames(P, ref)
    th = np.linspace(0, 2 * np.pi, seg, endpoint=False)
    sq = np.array([1.0, squash, 1.0])
    V = [P[i] + (np.outer(np.cos(th), N[i] * r[i]) + np.outer(np.sin(th), B[i] * r[i])) * sq for i in range(len(P))]
    V = list(np.vstack(V))
    F = []
    for i in range(len(P) - 1):
        for j in range(seg):
            a, b = i * seg + j, i * seg + (j + 1) % seg
            F.append((a, b, b + seg, a + seg))
    for end, sign in ((0, -1.0), (len(P) - 1, 1.0)):
        pole = len(V); V.append(P[end] + sign * T[end] * r[end] * 0.8)
        base = end * seg
        for j in range(seg):
            a, b = base + j, base + (j + 1) % seg
            tri = (pole, a, b)
            nrm = np.cross(V[a] - V[pole], V[b] - V[pole])
            if np.dot(nrm, sign * T[end]) < 0: tri = (pole, b, a)
            F.append(tri)
    return np.array(V), F


class Tube:
    """Un tubo linfático: eje P (m), radio por punto, pieza, extremos (qué toca cada uno) y ruta."""
    def __init__(self, piece, P, r, kind, seg, ends, route=None, allow=None, exempt=(None, None)):
        self.piece, self.P, self.r, self.kind, self.seg = piece, np.asarray(P, float), np.broadcast_to(r, len(P)).astype(float), kind, seg
        self.ends, self.route, self.allow, self.exempt = list(ends), route, allow, exempt
        self.fails = {}


class Router:
    """Aparta los ejes de los tubos de los obstáculos (hueso, piel, luz de arterias y venas, órganos cerrados) y los
    comprueba anillo a anillo."""
    def __init__(self, ctx):
        self.ctx, self.V = ctx, ctx.vessels
        self.organs = [s for s in ctx.solids if s.kind in ('organ', 'heart') and s.closed]
        node_pts = [(n, n.c) for n in ctx.nodes]
        self.nodes = ctx.nodes
        self.kd = kdtree.KDTree(len(node_pts))
        for i, (_, c) in enumerate(node_pts): self.kd.insert(c, i)
        self.kd.balance()

    def inside_node(self, p, grow=1.0):
        for _, i, _ in self.kd.find_range(Vector(p), 0.012):
            n = self.nodes[i]
            if n.inside_bound(np.asarray(p)[None], grow=grow)[0]: return n
        return None

    def gaps(self, p, r, allow=None, exempt=()):
        """{obstáculo: (cuánto falta, dirección para salir, detalle)} de un anillo de centro p y radio r."""
        out = {}
        g, n = self.ctx.bone_gap(p)
        if g is not None and n is not None and g < r + MARG['bone']: out['bone'] = (r + MARG['bone'] - g, np.asarray(n), '')
        d, n = (None, None) if allow and 'NO_SKIN' in allow else self.ctx.skin_gap(p)
        if d is not None and d < r + MARG['skin']: out['skin'] = (r + MARG['skin'] - d, -np.asarray(n), '')
        I = self.V.near(p, r + 0.012)
        if len(I):
            gg, Q, dd = self.V.gaps(np.asarray(p)[None], I)
            gg = gg[0] - r
            for j in np.argsort(gg):
                if gg[j] >= MARG['vessel']: break
                nm = self.V.name[I[j]]
                if nm in exempt: continue
                v = p - Q[0, j]; nv = np.linalg.norm(v)
                nrm = v / nv if nv > 1e-9 else np.array([0, 1.0, 0])
                out['vessel'] = (MARG['vessel'] - gg[j], nrm, nm); break
        worst = None
        for s in self.organs:
            if allow and re.search(allow, s.name): continue
            if (p < s.lo - 0.008).any() or (p > s.hi + 0.008).any(): continue
            loc, nrm, _, dist = s.T.find_nearest(Vector(p))
            if loc is None: continue
            nn = np.array(nrm) * s.sign
            outside = np.dot(p - np.array(loc), nn) >= 0
            if not outside and dist > 0.003 and not parity_inside(s.T, p): outside = True
            gap = dist if outside else -dist
            need = r + MARG['organ'] - gap
            if need > 0 and (worst is None or need > worst[0]): worst = (need, nn, s.name)
        if worst: out['organ'] = worst
        return out

    def _skip(self, t, i):
        """Puntos que no se comprueban: los que quedan dentro del ganglio en el que empieza o acaba el tubo."""
        for e in t.ends:
            if e and e[0] == 'node' and e[2].inside_bound(t.P[i][None], grow=1.0)[0]: return True
        return False

    def _exempt(self, t, i):
        names, dist = t.exempt
        out = set()
        if names and (np.linalg.norm(t.P[i] - t.P[-1]) <= dist or np.linalg.norm(t.P[i] - t.P[0]) <= dist): out |= set(names)
        for nm, z0, z1 in getattr(t, 'zexempt', ()):                  # vasos aceptados en una franja de alturas
            if z0 <= t.P[i][2] <= z1: out |= set(nm)
        return out

    def relax(self, t, iters=40, fixed_ends=True):
        P = t.P.copy(); n = len(P)
        free = np.ones(n, bool)
        if fixed_ends: free[0] = free[-1] = False
        if t.ends and t.ends[0] and t.ends[0][0] == 'distal': free[0] = True
        active = set(np.flatnonzero(free))
        for it in range(iters):
            moved = set()
            D = np.zeros_like(P)
            for i in sorted(active):
                if not free[i]: continue
                t.P = P
                if self._skip(t, i): continue
                v = self.gaps(P[i], t.r[i], t.allow, self._exempt(t, i))
                if not v: continue
                d = sum(a * nn for a, nn, _ in v.values()) * 1.1
                L = np.linalg.norm(d)
                if L > 0.002: d *= 0.002 / L
                D[i] = d; moved.add(i)
            if not moved: break
            P += D
            win = set(j for i in moved for j in range(max(1, i - 4), min(n - 1, i + 5)))
            if it < iters - 8:
                for _ in range(2):
                    Q = P.copy()
                    for j in win:
                        if free[j]: Q[j] = P[j] + 0.35 * ((P[j - 1] + P[j + 1]) / 2 - P[j])
                    P = Q
            active = win
        t.P = P
        return t

    def check(self, t):
        """Anillos que fallan, por obstáculo: {obstáculo: [n.º, lo peor en mm, detalle]}."""
        fails = {}
        for i in range(len(t.P)):
            if self._skip(t, i): continue
            v = self.gaps(t.P[i], t.r[i] - 0.0001, t.allow, self._exempt(t, i))   # 0,1 mm de tolerancia
            for k, (a, _, det) in v.items():
                f = fails.setdefault(k, [0, 0.0, det])
                f[0] += 1
                if a * 1000 > f[1]: f[1], f[2] = round(a * 1000, 2), det
        t.fails = fails
        return fails


def _node_point(n, toward, inset=0.45, hilum=False):
    """Punto del ganglio n por el que entra o sale un vaso hacia `toward`: el hilio (lado −medio) si mira hacia allí,
    si no la superficie en esa dirección; hundido `inset` (fracción del semieje) para que el tubo nazca dentro."""
    u = _unit(np.asarray(toward, float) - n.c)
    h = -n.R[:, 1]
    if hilum and np.dot(h, u) > -0.2:
        return n.c + h * n.half[1] * (0.78 - inset * 0.5)
    v = n.R.T @ u
    t = 1.0 / np.sqrt(((v / n.half) ** 2).sum())
    return n.c + u * t * (1 - inset)


def _neutral(key):
    """La clave sin el lado (…_L/…_R, o la letra del lado tras «}» o al final): el mismo azar a izquierda y derecha."""
    return re.sub(r'(_|\})[LR](?=$|\d|[^a-z])', r'\1', key)


def _bow(S, E, key, frac=0.06):
    """Eje de S a E algo arqueado (no una regla), con el arco sembrado con `key`."""
    d = E - S; L = np.linalg.norm(d)
    if L < 1e-6: return np.array([S, E])
    rng = _rng(_neutral(key))
    v = rng.normal(size=3)
    if (S[0] + E[0]) < 0:          # lado derecho: el arco en espejo del izquierdo (piezas pares simétricas)
        v[0] = -v[0]; a = -_unit(np.cross(d, v))
    else:
        a = _unit(np.cross(d, v))
    mid = (S + E) / 2 + a * L * frac * rng.uniform(0.4, 1.0)
    from female_vessels import spline
    return spline([S, mid, E], V_STEP)


def _wave(P, key, amp=0.0004, wl=0.03):
    """Ondulación lateral suave (los colectores no copian el eje del vaso guía)."""
    from female_vessels import arclength
    from female_organs import _frames
    if len(P) < 4: return P
    s = arclength(P)
    T0 = _unit(P[1] - P[0])
    _, N, B = _frames(P, np.eye(3)[int(np.argmin(np.abs(T0)))])
    ph = _rng(_neutral(key)).uniform(0, 2 * np.pi)
    w = amp * np.sin(2 * np.pi * s / wl + ph) * np.sin(np.pi * s / s[-1])
    return P + N * w[:, None] + B * (0.5 * w[:, None])


class Lymph:
    """Traza las piezas de vasos linfáticos de un modelo (ver build_vessels)."""
    def __init__(self, ctx):
        self.ctx, self.V = ctx, ctx.vessels
        self.router = Router(ctx)
        self.tubes, self.routes, self.measures = [], [], {}
        self.picks = {}                # opción elegida por clave sin lado (simetría de las piezas pares)
        self.bones = {}
        for i, nm in enumerate(ctx.fitter.bone_names): self.bones.setdefault(nm, i)

    # ── Medidas del propio modelo ─────────────────────────────────────────
    def vertebra(self, name):
        """(centro del cuerpo vertebral, y de su cara anterior en la línea media) de una vértebra, o None."""
        V = _bone(name)
        if V is None: return None
        band = V[V[:, 1] < V[:, 1].min() + 0.02]
        c = band.mean(0)
        return c, self.front(c[2], 0.0, name)

    def front(self, z, x=0.0, name=None):
        """y de la cara anterior del raquis a la altura z (rayo hacia atrás desde delante)."""
        T = self.ctx.fitter.fase2_bones if name is None or name not in self.bones else self.ctx.fitter.bone_trees[self.bones[name]]
        o = Vector((x, -0.12, z))
        hit = T.ray_cast(o, Vector((0, 1.0, 0)), 0.3)
        if hit[0] is None: return None
        # El primer hueso que encuentra puede ser el esternón o una costilla: se sigue hasta uno cerca de la línea media.
        while hit[0] is not None and name is None:
            idx = hit[2]
            bn = self.ctx.fitter.bone_names[self.ctx.fitter.bone_of_face[idx]]
            if bn.startswith('Vertebra') or bn.startswith('Sacrum'): break
            hit = T.ray_cast(hit[0] + Vector((0, 1e-4, 0)), Vector((0, 1.0, 0)), 0.3)
        return None if hit[0] is None else float(hit[0][1])

    def axis(self, vessel, z):
        """(punto del eje, radio) de un vaso a la altura z (el punto de su eje más cercano a ese plano), o None."""
        ln = self.V.line(vessel)
        if ln is None: return None
        P, R = ln
        i = int(np.argmin(np.abs(P[:, 2] - z)))
        return P[i], float(R[i])

    def section(self, solid, z, x0=-0.035, x1=0.035, y0=-0.08, y1=0.03, step=0.001):
        """Corte de un órgano a la altura z: (centro, mín, máx) de los puntos de una rejilla que quedan dentro."""
        s = self.ctx.solid_by_name.get(solid) if hasattr(self.ctx, 'solid_by_name') else None
        if s is None: return None
        pts = []
        for x in np.arange(x0, x1, step):
            for y in np.arange(y0, y1, step):
                p = np.array([x, y, z])
                if ((p < s.lo) | (p > s.hi)).any(): continue
                loc, nrm, _, d = s.T.find_nearest(Vector(p))
                if loc is None: continue
                if np.dot(p - np.array(loc), np.array(nrm) * s.sign) < 0: pts.append(p)
        if not pts: return None
        A = np.array(pts)
        return A.mean(0), A.min(0), A.max(0)

    def spot(self, pref, r, win=0.008, step=0.001, keep=None, allow=None, exempt=(), margin=0.0004, prev=None, w=5.0):
        """Mejor punto para un eje en el plano horizontal de `pref`, en una rejilla de ±`win` m: el de menor coste
        w·(lo que se mete en hueso, piel, luz de vasos u órganos) + distancia a `pref` (+ la mitad del desvío lateral
        respecto a `prev`, para que los puntos de paso no zigzagueen). `keep(p)` descarta candidatos (p. ej. «a la
        derecha de la aorta»). Devuelve (punto, libre)."""
        pref = np.asarray(pref, float)
        best = None
        for dx in np.arange(-win, win + 1e-9, step):
            for dy in np.arange(-win, win + 1e-9, step):
                p = pref + np.array([dx, dy, 0.0])
                if keep is not None and not keep(p): continue
                d = np.hypot(dx, dy) + (0.5 * abs(p[0] - prev[0]) if prev is not None else 0.0)
                if best is not None and d >= best[0]: continue
                g = self.router.gaps(p, r + margin, allow, exempt)
                bad = sum(a * (4.0 if k == 'bone' or (k == 'vessel' and re.search(BIG, det)) else 1.0) for k, (a, _, det) in g.items())
                c = w * bad + d
                if best is None or c < best[0]: best = (c, p, bool(bad == 0))
        return (best[1], best[2]) if best else (pref, False)

    def column(self, prefs, radii, win=0.008, step=0.001, keeps=None, exempt=(), lam=1.5, w=5.0, margin=0.0004):
        """Puntos de paso de un eje casi vertical (cisterna, conducto torácico), uno por cada `prefs[k]` (cada uno en su
        plano horizontal), elegidos A LA VEZ por programación dinámica: coste de cada punto = w·(lo que se mete en hueso,
        luz de vasos u órganos; hueso y vasos grandes ×4) + distancia a su preferido, y entre niveles seguidos
        lam·desvío lateral (sin zigzag). Devuelve (puntos, [libre por nivel], [roces por nivel])."""
        offs = np.array([(dx, dy) for dx in np.arange(-win, win + 1e-9, step) for dy in np.arange(-win, win + 1e-9, step)])
        C, X, G = [], [], []
        for k, pref in enumerate(prefs):
            pref = np.asarray(pref, float)
            pts, cost, roz = [], [], []
            for dx, dy in offs:
                p = pref + np.array([dx, dy, 0.0])
                if keeps and keeps[k] is not None and not keeps[k](p): continue
                g = self.router.gaps(p, radii[k] + margin, None, exempt)
                bad = sum(a * (4.0 if kk == 'bone' or (kk == 'vessel' and re.search(BIG, det)) else 1.0) for kk, (a, _, det) in g.items())
                pts.append(p); cost.append(w * bad + np.hypot(dx, dy)); roz.append(g)
            if not pts: pts, cost, roz = [pref], [0.0], [{}]
            X.append(np.array(pts)); C.append(np.array(cost)); G.append(roz)
        acc, back = C[0].copy(), []
        for k in range(1, len(X)):
            jump = lam * np.linalg.norm(X[k][:, None, :2] - X[k - 1][None, :, :2], axis=2)
            tot = acc[None, :] + jump
            b = np.argmin(tot, axis=1); back.append(b)
            acc = C[k] + tot[np.arange(len(X[k])), b]
        i = int(np.argmin(acc)); idx = [i]
        for b in reversed(back):
            i = int(b[i]); idx.append(i)
        idx.reverse()
        P = [X[k][i] for k, i in enumerate(idx)]
        return P, [not G[k][i] for k, i in enumerate(idx)], [G[k][i] for k, i in enumerate(idx)]

    def venous_angle(self, side):
        """Ángulo venoso (unión de la yugular interna y la subclavia) de un lado: (punto, radio de la vena)."""
        ij = self.V.line(f'Internal_jugular_vein_{side}')
        sc = self.V.line(('Left' if side == 'L' else 'Right') + '_subclavian_vein')
        if ij is None or sc is None: return None
        d = np.linalg.norm(ij[0][:, None] - sc[0][None], axis=2)
        i, j = np.unravel_index(int(np.argmin(d)), d.shape)
        return (ij[0][i] + sc[0][j]) / 2, float(max(ij[1][i], sc[1][j]))

    # ── Utilidades ────────────────────────────────────────────────────────
    def group(self, spec, side=None):
        """Ganglios de un grupo: «Pieza_{s}» (con su lado) o «Pieza|s» (pieza impar, los de ese lado de la línea media)."""
        if '|' in spec:
            base = spec.split('|')[0]
            ns = self.ctx.pieces.get(base, [])
            if side is None: return list(ns)
            return [n for n in ns if n.c[0] * SGN[side] > 0] or list(ns)
        nm = spec.replace('{s}', side or '')
        return list(self.ctx.pieces.get(nm, []))

    def add(self, piece, P, r, kind, ends, route=None, allow=None, exempt=(None, None), relax=True, seg=None, alts=(), sym=None, zexempt=()):
        """Crea un tubo por el eje P, lo aparta de los obstáculos y lo comprueba; si aún falla algún anillo, prueba los
        ejes alternativos `alts` (otro arco, otro carril) y se queda con el que menos falla."""
        def make(P):
            t = Tube(piece, P, r, kind, seg or (SEG_DUCT if kind in ('duct', 'trunk') else SEG_COLL), ends, route, allow, exempt)
            t.zexempt = zexempt
            if relax:
                self.router.relax(t)
                from female_vessels import resample
                if len(t.P) > 3:
                    Q = resample(t.P, V_STEP)
                    t.r = np.interp(np.linspace(0, 1, len(Q)), np.linspace(0, 1, len(t.P)), t.r) if len(np.unique(t.r)) > 1 else np.full(len(Q), t.r[0])
                    t.P = Q
                    self.router.relax(t, iters=12)
            return t
        def score(t):
            f = self.router.check(t)
            return (sum(c for c, _, _ in f.values()), sum(mm for _, mm, _ in f.values()))
        opts = [P] + list(alts or [])
        memo = self.picks.get(_neutral(sym)) if sym else None     # la opción que se eligió en el lado izquierdo
        order = ([memo] if memo else []) + [i for i in range(len(opts)) if i != memo]
        best = sb = None; pick = 0
        for i in order:
            Q = opts[i]
            if Q is None or len(Q) < 2: continue
            t = make(Q)
            if not (relax and alts):
                best, pick = t, i; break
            st = score(t)
            if sb is None or st < sb: best, sb, pick = t, st, i
            if sb[0] == 0 or (i == memo and st[0] <= 2 and st[1] <= 1.0): break    # el lado derecho sigue al izquierdo
        if sym: self.picks.setdefault(_neutral(sym), pick)
        if relax and sb is not None and sb[0] > 0:              # aún roza algo: otra tanda de separación, más larga
            self.router.relax(best, iters=60)
        self.tubes.append(best)
        return best

    def route(self, de, a, side, piece, tipo, nota):
        r = {'de': de, 'a': a, 'lado': side, 'pieza': piece, 'tipo': tipo, 'nota': nota}
        self.routes.append(r)
        return r

    def along(self, S, E, guide, r, key, lane=0, i_start=None, wall=WALL):
        """Eje de S a E siguiendo el vaso `guide` a `wall` de su pared, o None. `lane`: carril (colectores paralelos; junto
        a una vena superficial, a un lado y a otro en el plano de la piel). Con S None empieza junto al punto `i_start`
        del eje del vaso (origen distal de los colectores de los miembros)."""
        from female_vessels import spline
        ln = self.V.line(guide)
        if ln is None: return None
        G, Rg = ln
        i = i_start if i_start is not None else int(np.argmin(np.linalg.norm(G - S, axis=1)))
        j = int(np.argmin(np.linalg.norm(G - E, axis=1)))
        if abs(i - j) < 3: return None
        idx = np.arange(i, j + 1) if j > i else np.arange(i, j - 1, -1)
        A, R = G[idx], Rg[idx]
        T = np.gradient(A, axis=0); T /= np.maximum(np.linalg.norm(T, axis=1)[:, None], 1e-12)
        def perp(v, t):
            v = np.asarray(v, float) - np.dot(v, t) * t; n = np.linalg.norm(v)
            return v / n if n > 1e-9 else None
        surface = bool(re.search(SURFACE_GUIDE, guide))
        d0 = perp(S - A[0], T[0]) if S is not None else None
        if d0 is None: d0 = perp([0, 1.0, 0], T[0])
        if d0 is None: d0 = perp([1.0, 0, 0], T[0])
        d1 = perp(E - A[-1], T[-1])
        if d1 is None: d1 = d0
        sk = self.ctx.fitter.skin
        off = []
        for k in range(len(A)):
            f = k / max(len(A) - 1, 1)
            d = perp((1 - f) * d0 + f * d1, T[k])
            if d is None: d = perp(d0, T[k]) if perp(d0, T[k]) is not None else d0
            extra = 0.0
            if surface:
                loc, nrm, _, _ = sk.find_nearest(Vector(A[k]))
                if nrm is not None:
                    q = np.cross(T[k], np.array(nrm))
                    if np.linalg.norm(q) > 1e-6:
                        q = q / np.linalg.norm(q); d = q if np.dot(q, d) >= 0 else -q
                if lane % 2 == 1: d = -d
                extra = 0.0015 * (lane // 2)
            elif lane:
                d = _rot(T[k], lane * 0.9 * (1 if A[:, 0].mean() >= 0 else -1)) @ d     # en espejo a la derecha
            off.append(A[k] + d * (R[k] + r + wall + extra))
        off = np.array(off)
        L1 = np.linalg.norm(off - E, axis=1)
        if S is None:
            S = off[0]; keep = (L1 > 0.006); keep[0] = False
        else:
            keep = (np.linalg.norm(off - S, axis=1) > 0.006) & (L1 > 0.006)
        mid = off[keep][::3]
        if not len(mid): return None
        return _wave(spline([S, *mid, E], V_STEP), key)

    # ── Vía central ───────────────────────────────────────────────────────
    def central(self):
        V, M = self.V, self.measures
        lv = {nm: self.vertebra(f'Vertebra_{nm}') for nm in ('L3', 'L2', 'L1', 'T12', 'T11', 'T10', 'T9', 'T8', 'T7', 'T6', 'T5', 'T4',
                                                               'T3', 'T2', 'T1', 'C7', 'C6')}
        z = {k: float(v[0][2]) for k, v in lv.items() if v}
        M['niveles_z_m'] = {k: round(v, 4) for k, v in z.items()}
        r_ao = lambda zz: self.axis('Abdominal_aorta' if zz < z['T12'] - 0.004 else 'Thoracic_aorta', zz)
        # 1. Cisterna del quilo: delante de L1–L2, a la derecha de la aorta, sobre los cuerpos vertebrales.
        # Cada corte: el sitio libre más cercano a «justo a la derecha de la aorta, apoyada en el cuerpo vertebral»,
        # sin pasar a la izquierda del borde derecho de la aorta (la cava queda delante y a la derecha).
        zb, zt = z['L2'] - 0.012, z['L2'] - 0.012 + CIST_LEN
        # En el modelo, la arteria renal derecha y los vasos segmentarios (lumbares, lumbar ascendente) van pegados al
        # cuerpo vertebral, justo donde está la cisterna; en el cuerpo real la cisterna es retrocrural y la renal pasa por
        # delante del pilar derecho. Se aceptan (y se cuentan aparte) sus roces en la franja de la cisterna.
        seg = [n for n in self.V.index if re.match(r'(Right_renal_artery|Lumbar_(arteries|veins)_[LR]|Right_ascending_lumbar_vein|'
                                                    r'Subcostal_artery_R|Right_subcostal_vein)$', n)]
        self.zex = [(set(seg), zb - 0.01, zt + 0.012)]
        M['cisterna_vasos_aceptados'] = sorted(seg)
        prefs, radii, keeps, zs = [], [], [], np.linspace(zb, zt, 9)
        for k, zz in enumerate(zs):
            a, ra = r_ao(zz)
            rk = 0.0019 + (R_CIST - 0.0019) * np.sin(np.pi * min(k / 8 * 1.05, 1)) ** 0.7
            x0 = a[0] - ra - rk - 0.0008
            yf = self.front(zz, x0)
            prefs.append([x0, (yf - rk - 0.0006) if yf is not None else a[1] + ra * 0.5, zz]); radii.append(rk)
            keeps.append(lambda p, a=a, ra=ra: p[0] < a[0] - ra * 0.5)
        pts, free, roz = self.column(prefs, radii, win=0.009, keeps=keeps, exempt=self.zex[0][0])
        M['cisterna_cortes'] = [{'z_mm': round(zz * 1000, 1), 'libre': f, 'x_mm': round(c[0] * 1000, 1), 'y_mm': round(c[1] * 1000, 1),
                                 'movido_mm': round(float(np.linalg.norm(c - np.asarray(pr))) * 1000, 1),
                                 'roces': {k: [round(v[0] * 1000, 2), v[2]] for k, v in g.items()}}
                                for zz, c, f, g, pr in zip(zs, pts, free, roz, prefs)]
        from female_vessels import spline, arclength
        C = spline(pts, V_STEP)
        s = arclength(C) / arclength(C)[-1]
        rc = 0.0019 + (R_CIST - 0.0019) * np.sin(np.pi * np.clip(s * 1.05, 0, 1)) ** 0.7
        cist = Tube('Cisterna_chyli', C, rc, 'duct', 12, [('join', 'lumbar'), ('tube', 'Thoracic_duct')])
        cist.squash = CIST_SQUASH
        cist.zexempt = self.zex
        self.router.relax(cist, iters=30)
        self.tubes.append(cist)
        self.route('Lumbar_trunk_L', 'Cisterna_chyli', 'L', 'Lumbar_trunk_L', 'documentado', 'los troncos lumbares forman la cisterna')
        # 2. Conducto torácico, con puntos de paso por niveles vertebrales; nace dentro de la cisterna y sale por su polo
        # superior.
        P = [cist.P[-5], cist.P[-1]]
        esoph, prefs, keeps, lvls = {}, [], [], ('T12', 'T11', 'T10', 'T9', 'T8', 'T7', 'T6', 'T5', 'T4', 'T3', 'T2', 'T1')
        for lvl in lvls:
            zz = z[lvl]
            a, ra = self.axis('Thoracic_aorta', zz) if lvl != 'T12' else r_ao(zz)
            az = self.axis('Azygos_vein', zz)
            es = self.section('Oesophagus', zz, y0=a[1] - 0.06, y1=a[1] + 0.03)
            esoph[lvl] = es
            # Hasta T7: entre la aorta y la ácigos, cerca de la ácigos (a la derecha de la línea media), sobre los
            # cuerpos vertebrales y detrás del esófago. T6: aún a la derecha; T5: cruza la línea media detrás del
            # esófago; de T4 arriba, por el borde izquierdo del esófago, detrás.
            keep = None
            if lvl in ('T12', 'T11', 'T10', 'T9', 'T8', 'T7'):
                xl, xh = ((az[0][0] + az[1]) if az else a[0] - ra - 0.012), a[0] - ra
                x = min(xl + 0.35 * (xh - xl), -0.0015)          # más cerca de la ácigos, a la derecha de la línea media
                if az: keep = lambda p, a=a, ra=ra, az=az: az[0][0] + az[1] + R_DUCT < p[0] < min(a[0] - ra - R_DUCT, 0.0)
            elif lvl == 'T6':
                x = -0.002
                keep = lambda p: p[0] < 0.0
            elif lvl == 'T5':
                x = 0.0015
                keep = lambda p: abs(p[0]) < 0.004
            else:
                x = (es[2][0] + R_DUCT + 0.0008) if es else 0.012
                keep = (lambda p, es=es: p[0] > es[0][0] + 0.002) if es else None
            yf = self.front(zz, x)
            y = (yf - R_DUCT - 0.0012) if yf is not None else a[1]
            if lvl in ('T4', 'T3', 'T2', 'T1') and es: y = min(es[0][1] + (es[2][1] - es[0][1]) * 0.6, y)
            prefs.append([x, y, zz]); keeps.append(keep)
        Q, free, roz = self.column(prefs, [R_DUCT] * len(prefs), win=0.007, keeps=keeps, exempt=self.zex[0][0], lam=1.0)
        M['conducto_cortes'] = [{'nivel': lvl, 'libre': f, 'x_mm': round(p[0] * 1000, 1), 'y_mm': round(p[1] * 1000, 1),
                                 'movido_mm': round(float(np.hypot(p[0] - pr[0], p[1] - pr[1])) * 1000, 1),
                                 'roces': {k: [round(v[0] * 1000, 2), v[2]] for k, v in g.items()}}
                                for lvl, p, f, g, pr in zip(lvls, Q, free, roz, prefs)]
        P += [list(q) for q in Q]
        # Arco cervical a la altura de C7, por detrás de la vaina carotídea, y bajada al ángulo venoso izquierdo.
        ang = self.venous_angle('L')
        cc = self.axis('Left_common_carotid_artery', z['C7'])
        ij = self.axis('Internal_jugular_vein_L', z['C7'])
        if ang is None or cc is None or ij is None: raise RuntimeError('vía central: faltan vasos del cuello izquierdo')
        A, rv = ang
        apex = np.array([(cc[0][0] + ij[0][0]) / 2, max(cc[0][1] + cc[1], ij[0][1] + ij[1]) + R_DUCT + 0.003, z['C7']])
        u = _unit(np.array([-0.15, 0.75, 0.65]))
        pre = A + u * (rv + 0.009)
        end = A + u * (rv + R_DUCT_END * 0.4)
        lateral = np.array([(apex[0] + pre[0]) / 2 + 0.004, (apex[1] + pre[1]) / 2, (apex[2] + pre[2]) / 2 + 0.004])
        P += [apex, lateral, pre, end]
        D = spline(P, V_STEP)
        s = arclength(D)
        L = s[-1]
        rd = np.full(len(D), R_DUCT)
        rd += (R_DUCT_END - R_DUCT) * np.clip(1 - s / 0.03, 0, 1) + (R_DUCT_END - R_DUCT) * np.clip(1 - (L - s) / 0.04, 0, 1)
        rd *= 1 + 0.10 * (0.5 + 0.5 * np.cos(2 * np.pi * s / 0.018)) ** 6        # válvulas: algo arrosariado
        exempt = ({'Internal_jugular_vein_L', 'Left_subclavian_vein', 'Left_brachiocephalic_vein'}, rv + 0.006)
        td = self.add('Thoracic_duct', D, rd, 'duct', [('tube', 'Cisterna_chyli'), ('vein', 'L')], exempt=exempt, zexempt=self.zex)
        self.route('Cisterna_chyli', 'Left_venous_angle', None, 'Thoracic_duct', 'variante',
                   'trayecto clásico: hiato aórtico, mediastino posterior, cruce a la izquierda hacia T5, arco en C7 y '
                   'terminación en el ángulo venoso izquierdo (una sola desembocadura; hay variantes con varias)')
        self.td, self.esoph, self.z = td, esoph, z
        self.angles = {'L': ang, 'R': self.venous_angle('R')}
        # 3. Conducto linfático derecho: 1,5 cm, al ángulo venoso derecho.
        AR, rvr = self.angles['R']
        uR = _unit(np.array([0.15, 0.75, 0.65]))
        J = AR + uR * (rvr + 0.015)
        endR = AR + uR * (rvr + R_TRUNK * 0.4)
        rld = self.add('Right_lymphatic_duct', np.vstack([J, (J + endR) / 2 + np.array([0.001, 0, 0]), endR]), 0.0015, 'duct',
                       [('join', 'R'), ('vein', 'R')], exempt=({'Internal_jugular_vein_R', 'Right_subclavian_vein',
                                                                  'Right_brachiocephalic_vein'}, rvr + 0.006))
        from female_vessels import resample
        rld.P = resample(spline(rld.P, V_STEP), 0.002); rld.r = np.full(len(rld.P), 0.0015)
        self.route('Jugular_trunk_R', 'Right_lymphatic_duct', 'R', 'Right_lymphatic_duct', 'documentado',
                   'los troncos yugular, subclavio y broncomediastínico derechos forman el conducto linfático derecho')
        self.route('Right_lymphatic_duct', 'Right_venous_angle', 'R', 'Right_lymphatic_duct', 'documentado', '')
        self.J = {'R': J}
        # 4. Troncos del cuello y del tórax.
        for side in 'LR':
            self.neck_trunks(side)
        # 5. Troncos lumbares e intestinales.
        self.abdominal_trunks(cist.P, cist)

    def join_point(self, side, frac):
        """Punto de llegada de un tronco: en el lado izquierdo, sobre el eje del final del conducto torácico (a `frac` m
        del final); en el derecho, el comienzo del conducto linfático derecho."""
        if side == 'R': return self.J['R'], ('tube', 'Right_lymphatic_duct')
        from female_vessels import arclength
        P = self.td.P; s = arclength(P)
        i = int(np.argmin(np.abs(s - (s[-1] - frac))))
        return P[i], ('tube', 'Thoracic_duct')

    def neck_trunks(self, side):
        from female_vessels import spline
        sg = SGN[side]
        # Tronco yugular: del ganglio más bajo de la cadena cervical profunda, junto a la yugular interna.
        chain = self.group('Inferior_deep_lateral_cervical_nodes_{s}', side) + self.group('Anterior_inferior_jugular_nodes_{s}', side)
        ijn = f'Internal_jugular_vein_{side}'
        cand = [n for n in chain if (self.V.index.get(ijn) is not None and
                                     self.V.gaps(n.c[None], self.V.index[ijn])[0].min() < 0.015)] or chain
        n0 = min(cand, key=lambda n: n.c[2])
        E, tgt = self.join_point(side, 0.012)
        S = _node_point(n0, E, hilum=True)
        P = self.along(S, E, ijn, R_TRUNK, f'jt{side}') if np.linalg.norm(S - E) > 0.02 else None
        if P is None: P = _bow(S, E, f'jt{side}', 0.04)
        exempt = (({ijn, 'Left_subclavian_vein', 'Left_brachiocephalic_vein'} if side == 'L' else
                   {ijn, 'Right_subclavian_vein', 'Right_brachiocephalic_vein'}), self.angles[side][1] + 0.006)
        self.add(f'Jugular_trunk_{side}', P, R_TRUNK, 'trunk', [('node', n0.piece, n0), tgt], exempt=exempt)
        self.route(n0.piece, tgt[1], side, f'Jugular_trunk_{side}', 'documentado' if side == 'R' else 'variante',
                   'tronco yugular: del último ganglio cervical profundo inferior' +
                   (' al conducto linfático derecho' if side == 'R' else ' al final del conducto torácico (variante elegida; '
                    'puede abrirse en la vena directamente)'))
        self.trunk_start = getattr(self, 'trunk_start', {})
        self.trunk_start[f'Jugular_trunk_{side}'] = n0
        # Tronco subclavio: del ganglio apical axilar más medial, junto a la vena subclavia.
        ap = self.group('Apical_axillary_nodes_{s}', side)
        E, tgt = self.join_point(side, 0.006)
        n1 = min(ap, key=lambda n: np.linalg.norm(n.c - E))
        S = _node_point(n1, E, hilum=True)
        sv = ('Left' if side == 'L' else 'Right') + '_subclavian_vein'
        P = self.along(S, E, sv, R_TRUNK, f'st{side}')
        if P is None: P = _bow(S, E, f'st{side}', 0.04)
        self.add(f'Subclavian_trunk_{side}', P, R_TRUNK, 'trunk', [('node', n1.piece, n1), tgt], exempt=exempt)
        self.route(n1.piece, tgt[1], side, f'Subclavian_trunk_{side}', 'documentado' if side == 'R' else 'variante',
                   'tronco subclavio: de los ganglios apicales axilares, junto a la vena subclavia' +
                   ('' if side == 'R' else '; termina en el conducto torácico (variante elegida)'))
        self.trunk_start[f'Subclavian_trunk_{side}'] = n1
        # Tronco broncomediastínico: del ganglio paratraqueal o braquiocefálico más alto de su lado.
        cand = [n for n in self.group('Paratracheal_thoracic_nodes|', side) + self.group('Brachiocephalic_nodes|', side)
                if n.c[0] * sg > 0] or self.group('Paratracheal_thoracic_nodes|', side)
        n2 = max(cand, key=lambda n: n.c[2])
        E, tgt = self.join_point(side, 0.018)
        S = _node_point(n2, E, hilum=True)
        mid = (S + E) / 2 + np.array([sg * 0.006, 0.004, 0.0])
        P = spline([S, mid, E], V_STEP)
        self.add(f'Bronchomediastinal_trunk_{side}', P, R_TRUNK, 'trunk', [('node', n2.piece, n2), tgt], exempt=exempt)
        self.route(n2.piece, tgt[1], side, f'Bronchomediastinal_trunk_{side}', 'documentado' if side == 'R' else 'variante',
                   'tronco broncomediastínico: de los ganglios paratraqueales y braquiocefálicos' +
                   ('' if side == 'R' else '; termina en el conducto torácico (variante elegida; a menudo se abre aparte en la vena)'))
        self.trunk_start[f'Bronchomediastinal_trunk_{side}'] = n2

    def abdominal_trunks(self, C, cist):
        from female_vessels import spline, arclength
        s = arclength(C) / arclength(C)[-1]
        base = C[0]                    # los dos troncos lumbares forman la cisterna por su polo inferior
        self.measures['troncos_lumbares'] = {}
        for side, piece in (('L', 'Lateral_aortic_nodes'), ('R', 'Lateral_caval_nodes')):
            ns = self.ctx.pieces.get(piece, [])
            n0 = max(ns, key=lambda n: n.c[2])
            S = _node_point(n0, base, hilum=True)
            zm = (S[2] + base[2]) / 2
            a, ra = self.axis('Abdominal_aorta', zm)
            if side == 'L':     # pasa por detrás de la aorta si hay sitio; si no, por su borde posterolateral
                pref = np.array([a[0], a[1] + ra + R_TRUNK + 0.0012, zm])
            else:
                pref = np.array([(S[0] + base[0]) / 2, max(S[1], base[1]) + 0.001, zm])
            mid, free = self.spot(pref, R_TRUNK, win=0.008)
            P = spline([S, mid, base], V_STEP)
            t = self.add(f'Lumbar_trunk_{side}', P, R_TRUNK, 'trunk', [('node', piece, n0), ('tube', 'Cisterna_chyli')], zexempt=self.zex,
                         alts=[spline([S, mid + d, base], V_STEP) for d in ([0, 0.003, 0], [0, -0.003, 0], [-SGN[side] * 0.003, 0, 0])])
            q = t.P[int(np.argmin(np.abs(t.P[:, 2] - zm)))]
            self.measures['troncos_lumbares'][side] = {'punto_medio_libre': free, 'x_mm': round(q[0] * 1000, 1),
                                                       'x_aorta_mm': round(a[0] * 1000, 1), 'radio_aorta_mm': round(ra * 1000, 1),
                                                       'detras_del_centro_de_la_aorta_mm': round(float(q[1] - a[1]) * 1000, 1)}
            self.route(piece, 'Cisterna_chyli', side, f'Lumbar_trunk_{side}', 'documentado',
                       'tronco lumbar: de los ganglios ' + ('lateroaórticos izquierdos, por detrás de la aorta' if side == 'L'
                                                          else 'laterocavos') + ', a la cisterna del quilo')
            self.trunk_start = getattr(self, 'trunk_start', {}); self.trunk_start[f'Lumbar_trunk_{side}'] = n0
        # Troncos intestinales: de los celíacos y de los mesentéricos superiores centrales, a la derecha de la aorta.
        tgt = C[int(np.argmin(np.abs(s - 0.8)))]       # llegan a la parte alta de la cisterna, entre la aorta y la cava
        co = self.ctx.pieces.get('Coeliac_nodes', []); sm = self.ctx.pieces.get('Central_superior_mesenteric_nodes', [])
        a, ra = self.axis('Abdominal_aorta', tgt[2] + 0.01)
        J, _ = self.spot([a[0] - ra - R_TRUNK - 0.0025, a[1] + ra * 0.2, tgt[2] + 0.012], R_TRUNK * 1.15, win=0.008,
                         allow=r'^Meso|omentum|Pancreas')
        n_c = min(co, key=lambda n: np.linalg.norm(n.c - J)); n_s = min(sm, key=lambda n: np.linalg.norm(n.c - J))
        for n, key in ((n_c, 'Coeliac_nodes'), (n_s, 'Central_superior_mesenteric_nodes')):
            S = _node_point(n, J, hilum=True)
            alts = [spline([S, (S + J) / 2 + d, J], V_STEP) for d in ([0.003, 0, 0], [0, 0.004, 0], [0, -0.004, 0], [-0.006, 0.003, 0])]
            P = spline([S, (S + J) / 2 + np.array([-0.003, 0, 0]), J], V_STEP)
            self.add('Intestinal_trunks', P, R_TRUNK, 'trunk', [('node', key, n), ('join', 'intestinal')], allow=r'^Meso|omentum|Pancreas',
                     alts=alts)
            self.route(key, 'Cisterna_chyli', None, 'Intestinal_trunks', 'documentado', 'troncos intestinales: de los ganglios '
                       'celíacos y mesentéricos superiores a la cisterna del quilo, a la derecha de la aorta')
        P = spline([J, (J + tgt) / 2 + np.array([0, 0.002, 0]), tgt], V_STEP)
        self.add('Intestinal_trunks', P, R_TRUNK * 1.15, 'trunk', [('join', 'intestinal'), ('tube', 'Cisterna_chyli')], zexempt=self.zex,
                 alts=[spline([J, (J + tgt) / 2 + d, tgt], V_STEP) for d in ([0.003, 0, 0], [-0.003, 0.003, 0], [0, -0.003, 0])])
        self.trunk_start['Intestinal_trunks'] = n_s

    # ── Colectores esquemáticos ───────────────────────────────────────────
    def alts(self, a, S, E, key, guide=None, lane=0, b=None):
        """Ejes alternativos de un colector de S a E (por si el primero roza un obstáculo): otro carril junto al vaso
        guía, arcos de otra curvatura y, saliendo por la superficie en lugar del hilio, un arco directo."""
        if guide:                  # junto a un vaso guía: solo otros carriles u otra holgura, nunca un atajo
            out = [self.along(S, E, guide, R_COLL, key + 'w', lane=lane, wall=WALL * 1.5),
                   self.along(S, E, guide, R_COLL, key + 'g', lane=lane + 2),
                   self.along(S, E, guide, R_COLL, key + 'h', lane=lane + 1, wall=WALL * 1.5)]
            if any(q is not None for q in out): return out
        S2 = _node_point(a, b.c if b is not None else E)
        E2 = _node_point(b, a.c, inset=0.25) if b is not None else E
        return [_bow(S, E, f'{key}3', 0.03), _bow(S2, E2, f'{key}s1', 0.06), _bow(S, E, f'{key}1', 0.10),
                _bow(S2, E2, f'{key}s2', 0.14), _bow(S, E, f'{key}2', 0.16), _bow(S, E, f'{key}4', 0.22)]

    def connect(self, src, dst, side, piece, guide=None, tipo='esquematico', nota='', n_par=1, allow=None, start_hilum=True):
        """Une el grupo `src` con el `dst` («A,B»: el más cercano de varios; «tube:Pieza»: un tubo) con `n_par` colectores."""
        A = self.group(src, side)
        if not A: return
        if dst.startswith('tube:'):
            tname = dst[5:].replace('{s}', side or '')
            tubes = [t for t in self.tubes if t.piece == tname]
            if not tubes: return
            if any(e and e[0] == 'node' and e[2] in A for t in tubes for e in t.ends):
                self.route(A[0].piece, tname, side, piece, tipo, nota + ' (el tubo nace en este grupo)'); return
            Pts = np.vstack([t.P for t in tubes])
            n, E = min(((n, Pts[int(np.argmin(np.linalg.norm(Pts - n.c, axis=1)))]) for n in A), key=lambda t: np.linalg.norm(t[1] - t[0].c))
            S = _node_point(n, E, hilum=start_hilum)
            P = self.along(S, E, guide, R_COLL, f'{src}{dst}{side}') if guide else None
            if P is None: P = _bow(S, E, f'{src}{dst}{side}')
            self.add(piece, P, R_COLL, 'collector', [('node', n.piece, n), ('tube', tname)], allow=allow,
                     alts=self.alts(n, S, E, f'{src}{dst}{side}', guide), sym=f'{src}{dst}{side}')
            self.route(n.piece, tname, side, piece, tipo, nota)
            return
        opts = [self.group(d, side) for d in dst.split(',')]
        opts = [B for B in opts if B and not any(b in A for b in B)]
        if not opts: return
        B = min(opts, key=lambda B: min(np.linalg.norm(a.c - b.c) for a in A for b in B))
        pairs = sorted(((a, b) for a in A for b in B), key=lambda t: np.linalg.norm(t[0].c - t[1].c))
        used = []
        for k in range(min(n_par, len(pairs))):
            a, b = next((p for p in pairs if p not in used and (k == 0 or (p[0] not in [u[0] for u in used]))), pairs[0])
            used.append((a, b))
            S = _node_point(a, b.c, hilum=start_hilum); E = _node_point(b, a.c)
            P = self.along(S, E, guide, R_COLL, f'{src}{dst}{side}{k}', lane=k) if guide else None
            if P is None: P = _bow(S, E, f'{src}{dst}{side}{k}')
            self.add(piece, P, R_COLL, 'collector', [('node', a.piece, a), ('node', b.piece, b)], allow=allow,
                     alts=self.alts(a, S, E, f'{src}{dst}{side}{k}', guide, k, b), sym=f'{src}{dst}{side}{k}')
        self.route(A[0].piece, B[0].piece, side, piece, tipo, nota)

    def within(self, spec, side, piece, allow=None, guide=None):
        """Árbol de expansión mínimo entre los ganglios de un grupo (colectores que los unen en cadena)."""
        ns = self.group(spec, side)
        if len(ns) < 2: return
        inside, rest = [ns[0]], ns[1:]
        while rest:
            a, b = min(((a, b) for a in inside for b in rest), key=lambda t: np.linalg.norm(t[0].c - t[1].c))
            S = _node_point(a, b.c); E = _node_point(b, a.c)
            P = self.along(S, E, guide, R_COLL, f'mst{a.piece}{a.k}{b.k}') if guide and np.linalg.norm(S - E) > 0.03 else None
            if P is None: P = _bow(S, E, f'mst{a.piece}{a.k}{b.k}')
            self.add(piece, P, R_COLL, 'collector', [('node', a.piece, a), ('node', b.piece, b)], allow=allow,
                     alts=self.alts(a, S, E, f'mst{a.piece}{a.k}{b.k}', guide if np.linalg.norm(S - E) > 0.03 else None, 0, b),
                     sym=f'mst{a.piece}{a.k}{b.k}')
            inside.append(b); rest.remove(b)
        self.route(ns[0].piece, ns[0].piece, side, piece, 'esquematico', 'colectores entre los ganglios del grupo (árbol mínimo)')

    def distal(self, guide, dst, side, piece, n_par=1, nota=''):
        """Colectores de un miembro desde el extremo distal del vaso guía (muñeca o tobillo; origen esquemático) hasta el
        grupo `dst`, a lo largo del vaso (`n_par` en paralelo)."""
        g = guide.replace('{s}', side)
        ln = self.V.line(g)
        B = self.group(dst, side)
        if ln is None or not B or g not in self.V.index: return
        G, Rg = ln
        i0 = 0 if min(np.linalg.norm(G[0] - n.c) for n in B) > min(np.linalg.norm(G[-1] - n.c) for n in B) else len(G) - 1
        I = self.V.index[g]
        order = sorted(B, key=lambda n: self.V.gaps(n.c[None], I)[0].min())
        made = 0
        for k in range(n_par):
            bb = order[k % len(order)]
            E = _node_point(bb, G[i0])
            P = self.along(None, E, g, R_COLL, f'd{g}{k}', lane=k, i_start=i0)
            if P is None: continue
            alts = [self.along(None, E, g, R_COLL, f'd{g}{k}{j}', lane=k + 2 * j, i_start=i0) for j in (1, 2)]
            alts += [self.along(None, E, g, R_COLL, f'd{g}{k}w', lane=k, i_start=i0, wall=WALL * 1.6)]
            self.add(piece, P, R_COLL, 'collector', [('distal', g), ('node', bb.piece, bb)], alts=alts, sym=f'd{g}{k}'); made += 1
        if made:
            self.route('distal:' + g, B[0].piece, side, piece, 'esquematico',
                       nota or 'origen distal esquemático (muñeca o tobillo); colectores junto al vaso guía')

    # ── Tabla de drenaje (colectores esquemáticos) ────────────────────────
    def collectors(self):
        D = 'documentado'
        for s in 'LR':
            h = f'Lymphatic_vessels_of_head_{s}'
            for g in ('Occipital_nodes_{s}', 'Mastoid_nodes_{s}', 'Pre_auricular_nodes_{s}', 'Superficial_parotid_nodes_{s}',
                      'Infra_auricular_nodes_{s}', 'Bucinator_node_{s}', 'Mandibular_node_{s}'):
                self.within(g, s, h)
            self.within('Intraglandular_parotid_nodes_{s}', s, h, allow=r'^Parotid_gland')
            self.connect('Occipital_nodes_{s}', 'Lateral_superior_jugular_node_{s}', s, h, nota='occipitales → cervicales profundos superiores')
            self.connect('Mastoid_nodes_{s}', 'Lateral_superior_jugular_node_{s}', s, h, nota='mastoideos → cervicales profundos superiores')
            self.connect('Pre_auricular_nodes_{s}', 'Superficial_parotid_nodes_{s}', s, h, nota='preauriculares → parotídeos (cadena esquemática)')
            self.connect('Superficial_parotid_nodes_{s}', 'Infra_auricular_nodes_{s}', s, h, nota='parotídeos superficiales → infraauriculares')
            self.connect('Intraglandular_parotid_nodes_{s}', 'Infra_auricular_nodes_{s}', s, h, allow=r'^Parotid_gland', nota='intraglandulares → infraauriculares')
            self.connect('Infra_auricular_nodes_{s}', 'Jugulodigastric_node_{s}', s, h, nota='parotídeos → yugulodigástrico (cervical profundo superior)')
            self.connect('Nasolabial_node_{s}', 'Bucinator_node_{s}', s, h, guide=f'Facial_vein_{s}', nota='faciales: junto a la vena facial')
            self.connect('Bucinator_node_{s}', 'Mandibular_node_{s}', s, h, guide=f'Facial_vein_{s}', nota='faciales: junto a la vena facial')
            self.connect('Mandibular_node_{s}', 'Submandibular_nodes_{s}', s, h, guide=f'Facial_vein_{s}', nota='mandibulares → submandibulares')
            n = f'Lymphatic_vessels_of_neck_{s}'
            ijv = f'Internal_jugular_vein_{s}'
            for g in ('Submandibular_nodes_{s}', 'Submental_nodes_{s}', 'Inferior_deep_lateral_cervical_nodes_{s}', 'Supraclavicular_nodes_{s}',
                      'Pretracheal_nodes_{s}', 'Thyroid_nodes_{s}', 'Paratracheal_cervical_nodes|',
                      'Superficial_anterior_cervical_nodes|'):
                self.within(g, s, n)
            self.within('Retropharyngeal_nodes_{s}', s, n, allow='NO_SKIN')
            self.within('Lateral_superior_jugular_node_{s}', s, n, guide=ijv)
            self.within('Anterior_inferior_jugular_nodes_{s}', s, n, guide=ijv)
            self.within('Superficial_lateral_cervical_nodes_{s}', s, n, guide=f'External_jugular_vein_{s}')
            self.connect('Submental_nodes_{s}', 'Submandibular_nodes_{s}', s, n, tipo=D, nota='submentonianos → submandibulares')
            self.connect('Submandibular_nodes_{s}', 'Jugulodigastric_node_{s}', s, n, tipo=D, nota='submandibulares → yugulodigástrico')
            # Los retrofaríngeos quedan junto a la pared de la faringe, que la «piel» del modelo recubre por dentro: su
            # colector no se comprueba contra la piel (NO_SKIN).
            self.connect('Retropharyngeal_nodes_{s}', 'Lateral_superior_jugular_node_{s}', s, n, allow='NO_SKIN',
                         nota='retrofaríngeos → cervicales profundos superiores')
            self.connect('Jugulodigastric_node_{s}', 'Lateral_superior_jugular_node_{s}', s, n, guide=ijv, tipo=D, nota='cadena yugular interna')
            self.connect('Lateral_superior_jugular_node_{s}', 'Anterior_inferior_jugular_nodes_{s}', s, n, guide=ijv, tipo=D, nota='cadena yugular interna')
            self.connect('Lateral_superior_jugular_node_{s}', 'Inferior_deep_lateral_cervical_nodes_{s}', s, n, guide=ijv, tipo=D, nota='cadena yugular interna')
            last = getattr(self, 'trunk_start', {}).get(f'Jugular_trunk_{s}')
            a, b = 'Anterior_inferior_jugular_nodes_{s}', 'Inferior_deep_lateral_cervical_nodes_{s}'
            if last is not None and last.piece.startswith('Anterior'): a, b = b, a
            self.connect(a, b, s, n, nota='cervicales profundos inferiores entre sí, hacia el tronco yugular')
            self.connect('Superficial_lateral_cervical_nodes_{s}', 'Inferior_deep_lateral_cervical_nodes_{s}', s, n,
                         nota='cervicales superficiales laterales (yugular externa) → cervicales profundos')
            self.connect('Superficial_anterior_cervical_nodes|', 'Anterior_inferior_jugular_nodes_{s}', s, n,
                         guide=f'Anterior_jugular_vein_{s}', nota='cervicales superficiales anteriores (yugular anterior) → cervicales profundos inferiores')
            for g in ('Pretracheal_nodes_{s}', 'Thyroid_nodes_{s}', 'Paratracheal_cervical_nodes|'):
                self.connect(g, 'Anterior_inferior_jugular_nodes_{s},Inferior_deep_lateral_cervical_nodes_{s}', s, n,
                             nota='→ cervicales profundos inferiores')
            self.connect('Supraclavicular_nodes_{s}', 'tube:Jugular_trunk_{s}', s, n, nota='supraclaviculares → tronco yugular (final de la cadena)')
            # Miembro superior.
            us, ud = f'Superficial_lymphatic_vessels_of_upper_limb_{s}', f'Deep_lymphatic_vessels_of_upper_limb_{s}'
            self.distal('Basilic_vein_{s}', 'Supratrochlear_nodes_{s}', s, us, n_par=2, nota='colectores mediales junto a la basílica (origen distal esquemático)')
            self.within('Supratrochlear_nodes_{s}', s, us)
            self.connect('Supratrochlear_nodes_{s}', 'Lateral_axillary_nodes_{s}', s, us, guide=f'Basilic_vein_{s}', tipo=D,
                         nota='supratrocleares → axilares laterales, junto a la basílica')
            self.distal('Cephalic_vein_{s}', 'Infraclavicular_nodes_{s}', s, us, nota='colectores laterales junto a la cefálica (origen distal esquemático)')
            self.within('Infraclavicular_nodes_{s}', s, us)
            self.connect('Infraclavicular_nodes_{s}', 'Apical_axillary_nodes_{s}', s, us, tipo=D, nota='deltopectorales → apicales')
            self.distal('Radial_veins_{s}', 'Cubital_nodes_{s}', s, ud, nota='colectores profundos junto a los vasos radiales')
            self.distal('Ulnar_veins_{s}', 'Cubital_nodes_{s}', s, ud, nota='colectores profundos junto a los vasos cubitales')
            self.within('Cubital_nodes_{s}', s, ud)
            self.connect('Cubital_nodes_{s}', 'Brachial_nodes_{s}', s, ud, guide=f'Brachial_veins_{s}', nota='cubitales → braquiales, junto a los vasos braquiales')
            self.within('Brachial_nodes_{s}', s, ud, guide=f'Brachial_veins_{s}')
            self.connect('Brachial_nodes_{s}', 'Lateral_axillary_nodes_{s}', s, ud, guide=f'Axillary_vein_{s}', tipo=D, nota='braquiales → axilares laterales')
            for g in ('Lateral', 'Anterior', 'Posterior', 'Central', 'Apical'):
                self.within(f'{g}_axillary_nodes_{{s}}', s, ud)
            self.within('Interpectoral_nodes_{s}', s, ud)
            for g in ('Lateral', 'Anterior', 'Posterior'):
                self.connect(f'{g}_axillary_nodes_{{s}}', 'Central_axillary_nodes_{s}', s, ud, tipo=D, nota='axilares → centrales')
            self.connect('Central_axillary_nodes_{s}', 'Apical_axillary_nodes_{s}', s, ud, tipo=D, nota='centrales → apicales')
            self.connect('Interpectoral_nodes_{s}', 'Apical_axillary_nodes_{s}', s, ud, tipo=D, nota='interpectorales → apicales')
            # Pared torácica.
            w = f'Lymphatic_vessels_of_thoracic_wall_{s}'
            self.within('Parasternal_nodes_{s}', s, w, guide=f'Internal_thoracic_veins_{s}')
            self.connect('Parasternal_nodes_{s}', f'tube:Bronchomediastinal_trunk_{s}', s, w, guide=f'Internal_thoracic_veins_{s}', tipo=D,
                         nota='paraesternales → tronco broncomediastínico, junto a los vasos torácicos internos')
            self.within('Intercostal_nodes_{s}', s, w)
            self.connect('Intercostal_nodes_{s}', 'tube:Thoracic_duct', s, w, tipo=D, nota='intercostales → conducto torácico')
            self.connect('Superior_diaphragmatic_nodes|', 'Parasternal_nodes_{s}', s, w, nota='frénicos superiores anteriores → paraesternales')
            # Pelvis.
            p = f'Lymphatic_vessels_of_pelvis_{s}'
            for g in ('Medial_external_iliac_nodes_{s}', 'Intermediate_external_iliac_nodes_{s}'):
                self.within(g, s, p, guide=f'External_iliac_vein_{s}')
            for g in ('Obturator_nodes_{s}', 'Superior_gluteal_nodes_{s}', 'Inferior_gluteal_nodes_{s}', 'Lateral_sacral_nodes_{s}',
                      'Lateral_vesical_nodes_{s}', 'Inferior_epigastric_nodes_{s}', 'Lateral_common_iliac_nodes|', 'Medial_common_iliac_nodes|',
                      'Intermediate_common_iliac_nodes|', 'Pararectal_nodes|', 'Postvesical_nodes|', 'Prevesical_nodes|', 'Median_sacral_nodes|',
                      'Subaortic_nodes|'):
                self.within(g, s, p)
            self.connect('Medial_lacunar_node_{s}', 'Medial_external_iliac_nodes_{s}', s, p, tipo=D, nota='lacunares → ilíacos externos')
            self.connect('Intermediate_lacunar_node_{s}', 'Intermediate_external_iliac_nodes_{s}', s, p, tipo=D, nota='lacunares → ilíacos externos')
            self.connect('Lateral_lacunar_node_{s}', 'Intermediate_external_iliac_nodes_{s}', s, p, tipo=D, nota='lacunares → ilíacos externos')
            self.connect('Medial_external_iliac_nodes_{s}', 'Medial_common_iliac_nodes|', s, p, guide=f'External_iliac_vein_{s}', tipo=D, nota='ilíacos externos → ilíacos comunes')
            self.connect('Intermediate_external_iliac_nodes_{s}', 'Lateral_common_iliac_nodes|', s, p, guide=f'External_iliac_artery_{s}', tipo=D, nota='ilíacos externos → ilíacos comunes')
            self.connect('Obturator_nodes_{s}', 'Medial_external_iliac_nodes_{s}', s, p, tipo=D, nota='obturadores → ilíacos externos mediales')
            for g in ('Superior_gluteal_nodes_{s}', 'Inferior_gluteal_nodes_{s}', 'Lateral_sacral_nodes_{s}'):
                self.connect(g, 'Intermediate_common_iliac_nodes|,Lateral_common_iliac_nodes|', s, p, guide=f'Internal_iliac_vein_{s}',
                             nota='ilíacos internos (glúteos, sacros) → ilíacos comunes')
            for g in ('Lateral_vesical_nodes_{s}', 'Prevesical_nodes|', 'Postvesical_nodes|', 'Pararectal_nodes|'):
                self.connect(g, 'Superior_gluteal_nodes_{s},Inferior_gluteal_nodes_{s},Lateral_sacral_nodes_{s}', s, p,
                             nota='viscerales de la pelvis → ilíacos internos')
            self.connect('Median_sacral_nodes|', 'Intermediate_common_iliac_nodes|,Medial_common_iliac_nodes|', s, p, nota='sacros medios → ilíacos comunes')
            self.connect('Medial_common_iliac_nodes|', 'Lateral_common_iliac_nodes|', s, p, nota='ilíacos comunes entre sí')
            self.connect('Intermediate_common_iliac_nodes|', 'Lateral_common_iliac_nodes|', s, p, nota='ilíacos comunes entre sí')
            lum = 'Lateral_aortic_nodes|' if s == 'L' else 'Lateral_caval_nodes|'
            self.connect('Lateral_common_iliac_nodes|', lum, s, p, guide=f'Common_iliac_vein_{s}', tipo=D, nota='ilíacos comunes → lumbares')
            self.connect('Subaortic_nodes|', lum, s, p, nota='subaórticos → lumbares')
            self.connect('Inferior_epigastric_nodes_{s}', 'Medial_external_iliac_nodes_{s}', s, p, guide=f'Inferior_epigastric_vein_{s}', tipo=D,
                         nota='epigástricos inferiores → ilíacos externos')
            # Miembro inferior.
            ls, ld = f'Superficial_lymphatic_vessels_of_lower_limb_{s}', f'Deep_lymphatic_vessels_of_lower_limb_{s}'
            self.distal('Great_saphenous_vein_{s}', 'Inferior_superficial_inguinal_nodes_{s}', s, ls, n_par=3,
                        nota='colectores mediales junto a la safena magna (origen distal esquemático)')
            for g in ('Inferior', 'Superomedial', 'Superolateral'):
                self.within(f'{g}_superficial_inguinal_nodes_{{s}}', s, ls)
            self.connect('Inferior_superficial_inguinal_nodes_{s}', 'Proximal_deep_inguinal_node_{s}', s, ls, tipo=D, nota='inguinales superficiales → profundos')
            self.connect('Superomedial_superficial_inguinal_nodes_{s}', 'Proximal_deep_inguinal_node_{s}', s, ls, tipo=D, nota='inguinales superficiales → profundos')
            self.connect('Superolateral_superficial_inguinal_nodes_{s}', 'Lateral_lacunar_node_{s}', s, ls, nota='inguinales superficiales → ilíacos externos (lacunares)')
            self.distal('Small_saphenous_vein_{s}', 'Superficial_popliteal_nodes_{s}', s, ls, nota='colectores posterolaterales junto a la safena menor (origen distal esquemático)')
            self.within('Superficial_popliteal_nodes_{s}', s, ls)
            self.connect('Superficial_popliteal_nodes_{s}', 'Deep_popliteal_nodes_{s}', s, ls, tipo=D, nota='poplíteos superficiales → profundos')
            for v, g in (('Anterior_tibial_veins', 'Anterior_tibial_node'), ('Posterior_tibial_veins', 'Posterior_tibial_node'), ('Fibular_veins', 'Fibular_node')):
                self.distal(f'{v}_{{s}}', f'{g}_{{s}}', s, ld, nota=f'colectores profundos junto a {v} (origen distal esquemático)')
                self.connect(f'{g}_{{s}}', 'Deep_popliteal_nodes_{s}', s, ld, guide=f'{v}_{s}', tipo=D, nota='tibiales y fibular → poplíteos profundos')
            self.within('Deep_popliteal_nodes_{s}', s, ld)
            self.connect('Deep_popliteal_nodes_{s}', 'Intermediate_deep_inguinal_node_{s}', s, ld, guide=f'Femoral_vein_{s}', tipo=D,
                         nota='poplíteos profundos → inguinales profundos, junto a la vena femoral')
            self.connect('Intermediate_deep_inguinal_node_{s}', 'Proximal_deep_inguinal_node_{s}', s, ld, guide=f'Femoral_vein_{s}', tipo=D, nota='inguinales profundos')
            self.connect('Proximal_deep_inguinal_node_{s}', 'Medial_lacunar_node_{s}', s, ld, tipo=D, nota='inguinales profundos → lacunares (ilíacos externos)')
        # Mediastino (impar).
        m = 'Lymphatic_vessels_of_mediastinum'
        lung = r'lobe_of_.*lung|^Pleura|bronch'
        for g in ('Prepericardial_nodes|', 'Lateral_pericardial_nodes|', 'Inferior_tracheobronchial_nodes|', 'Superior_tracheobronchial_nodes|',
                  'Paratracheal_thoracic_nodes|', 'Brachiocephalic_nodes|', 'Juxta_oesophageal_nodes|', 'Prevertebral_nodes|', 'Superior_diaphragmatic_nodes|'):
            for s in 'LR': self.within(g, s, m, allow=lung)
        for s in 'LR': self.within('Intrapulmonary_nodes|', s, m, allow=lung)
        for s in 'LR':
            self.connect('Intrapulmonary_nodes|', 'Inferior_tracheobronchial_nodes|', s, m, allow=lung, tipo=D, nota='intrapulmonares → traqueobronquiales')
            self.connect('Inferior_tracheobronchial_nodes|', 'Superior_tracheobronchial_nodes|', s, m, allow=lung, tipo=D, nota='traqueobronquiales inferiores → superiores')
            self.connect('Superior_tracheobronchial_nodes|', 'Paratracheal_thoracic_nodes|', s, m, allow=lung, tipo=D, nota='traqueobronquiales → paratraqueales')
            self.connect('Paratracheal_thoracic_nodes|', f'tube:Bronchomediastinal_trunk_{s}', s, m, tipo=D, nota='paratraqueales → tronco broncomediastínico')
            self.connect('Brachiocephalic_nodes|', f'tube:Bronchomediastinal_trunk_{s}', s, m, tipo=D, nota='braquiocefálicos → tronco broncomediastínico')
            self.connect('Prepericardial_nodes|', 'Parasternal_nodes_{s}', s, m, nota='prepericárdicos → paraesternales')
            self.connect('Lateral_pericardial_nodes|', 'Brachiocephalic_nodes|', s, m, nota='pericárdicos laterales → braquiocefálicos')
            self.connect('Juxta_oesophageal_nodes|', 'tube:Thoracic_duct', s, m, tipo=D, nota='yuxtaesofágicos → conducto torácico')
            self.connect('Prevertebral_nodes|', 'tube:Thoracic_duct', s, m, tipo=D, nota='prevertebrales → conducto torácico')
            self.connect('Superior_diaphragmatic_nodes|', 'Juxta_oesophageal_nodes|', s, m, nota='frénicos superiores posteriores → yuxtaesofágicos')
        self.connect('Node_of_ligamentum_arteriosum', 'Paratracheal_thoracic_nodes|', None, m, nota='nodo del ligamento arterioso → paratraqueales')
        self.connect('Node_of_arch_of_azygos_vein', 'Paratracheal_thoracic_nodes|', None, m, nota='nodo del arco de la ácigos → paratraqueales')
        # Abdomen (impar).
        a = 'Lymphatic_vessels_of_abdomen'
        mes = r'^Meso|omentum'
        for g in ('Right_gastric_nodes', 'Right_gastro_omental_nodes', 'Splenic_nodes', 'Superior_pancreatic_nodes', 'Inferior_pancreatic_nodes',
                  'Superior_pancreaticoduodenal_nodes', 'Coeliac_nodes', 'Juxta_intestinal_mesenteric_nodes', 'Paracolic_superior_mesenteric_nodes',
                  'Central_superior_mesenteric_nodes', 'Ileocolic_nodes', 'Appendicular_nodes', 'Precaecal_nodes', 'Retrocaecal_nodes',
                  'Right_colic_nodes', 'Middle_colic_nodes', 'Left_colic_nodes', 'Sigmoid_nodes', 'Lateral_aortic_nodes', 'Pre_aortic_nodes',
                  'Retro_aortic_nodes', 'Lateral_caval_nodes', 'Precaval_nodes', 'Retrocaval_nodes', 'Intermediate_lumbar_nodes',
                  'Inferior_diaphragmatic_nodes', 'Subpyloric_nodes'):
            self.within(g + '|', None, a, allow=mes)
        for g, t, kw in (('Right_gastric', 'Coeliac', {}), ('Right_gastro_omental', 'Subpyloric', {}), ('Subpyloric', 'Coeliac', {}),
                         ('Suprapyloric_node', 'Coeliac', {}), ('Retropyloric_nodes', 'Coeliac', {}), ('Splenic', 'Coeliac', {'guide': 'Splenic_artery'}),
                         ('Superior_pancreatic', 'Coeliac', {}), ('Inferior_pancreatic', 'Coeliac', {}), ('Superior_pancreaticoduodenal', 'Coeliac', {}),
                         ('Cystic_node', 'Coeliac', {'guide': 'Common_hepatic_artery'}),
                         ('Juxta_intestinal_mesenteric', 'Central_superior_mesenteric', {}), ('Paracolic_superior_mesenteric', 'Right_colic,Middle_colic', {}),
                         ('Appendicular', 'Ileocolic', {}), ('Precaecal', 'Ileocolic', {}), ('Retrocaecal', 'Ileocolic', {}),
                         ('Ileocolic', 'Central_superior_mesenteric', {'guide': 'Superior_mesenteric_vein'}),
                         ('Right_colic', 'Central_superior_mesenteric', {}), ('Middle_colic', 'Central_superior_mesenteric', {}),
                         ('Left_colic', 'Pre_aortic', {'guide': 'Inferior_mesenteric_vein'}), ('Sigmoid', 'Pre_aortic', {}),
                         ('Retro_aortic', 'Lateral_aortic', {}), ('Pre_aortic', 'Lateral_aortic', {}), ('Precaval', 'Lateral_caval', {}),
                         ('Retrocaval', 'Lateral_caval', {}), ('Intermediate_lumbar', 'Lateral_aortic', {}), ('Intermediate_lumbar', 'Lateral_caval', {})):
            src = g if g.endswith(('node', 'nodes')) else g + '_nodes'
            dst = ','.join((x if x.endswith(('node', 'nodes')) else x + '_nodes') + '|' for x in t.split(','))
            self.connect(src + ('|' if '|' not in src else ''), dst, None, a, allow=mes, nota=f'{g} → {t}', **kw)
        self.connect('Inferior_diaphragmatic_nodes|', 'Lateral_aortic_nodes|', 'L', a, allow=mes, nota='frénicos inferiores → lumbares')
        self.connect('Inferior_diaphragmatic_nodes|', 'Lateral_caval_nodes|', 'R', a, allow=mes, nota='frénicos inferiores → lumbares')

    # ── Comprobaciones ────────────────────────────────────────────────────
    def touches(self, ti, p, r_end):
        """Qué toca el punto p (extremo del tubo ti, de radio r_end): [('node', pieza, k) | ('tube', j) | ('vein', lado)]."""
        if getattr(self, '_tkd', None) is None or self._tkd_n != len(self.tubes):
            pts, own = [], []
            for j, t in enumerate(self.tubes):
                for i in range(len(t.P)): pts.append(t.P[i]); own.append((j, float(t.r[i])))
            self._tkd = kdtree.KDTree(len(pts))
            for i, q in enumerate(pts): self._tkd.insert(q, i)
            self._tkd.balance(); self._town = own; self._tkd_n = len(self.tubes)
        hits = set()
        for _, i, _ in self.router.kd.find_range(Vector(p), 0.015):
            n = self.router.nodes[i]
            if n.inside_bound(np.asarray(p)[None], grow=1.3)[0]: hits.add(('node', n.piece, n.k))
        for _, i, d in self._tkd.find_range(Vector(p), 0.006):
            j, rr = self._town[i]
            if j != ti and d <= rr + 0.0005: hits.add(('tube', j))
        for side, (A, rv) in self.angles.items():
            if np.linalg.norm(p - A) <= rv + 0.0015 + r_end: hits.add(('vein', side))
        return sorted(hits, key=str)

    def contacts(self):
        """Grafo de contactos por geometría: qué toca cada extremo de cada tubo (ganglio, otro tubo, vena)."""
        edges, loose = collections.defaultdict(set), []
        self._tkd = None
        for ti, t in enumerate(self.tubes):
            for e_i, p in ((0, t.P[0]), (1, t.P[-1])):
                hits = self.touches(ti, p, t.r[0 if e_i == 0 else -1])
                for h in hits:
                    edges[('tube', ti)].add(h); edges[h].add(('tube', ti))
                if not hits:
                    declared = t.ends[e_i] is not None and t.ends[e_i][0] == 'distal'
                    loose.append({'pieza': t.piece, 'extremo': e_i, 'declarado': declared, 'punto_m': [round(float(x), 4) for x in p]})
        return edges, loose

    def checks(self):
        from female_vessels import arclength
        M = self.measures
        edges, loose = self.contacts()
        # Desde cada ganglio, ¿se llega a una vena?
        sinks = {('vein', 'L'), ('vein', 'R')}
        reach, frontier = set(sinks), list(sinks)
        while frontier:
            x = frontier.pop()
            for y in edges.get(x, ()):
                if y not in reach: reach.add(y); frontier.append(y)
        no_way = sorted({f'{n.piece}#{n.k}' for n in self.ctx.nodes if ('node', n.piece, n.k) not in reach})
        M['grafo'] = {'ganglios': len(self.ctx.nodes), 'ganglios_sin_camino_a_vena': len(no_way), 'lista': no_way[:40],
                      'cabos_sueltos': len(loose), 'cabos_no_declarados': [l for l in loose if not l['declarado']]}
        # Rutas de la tabla: un tubo de esa pieza une de verdad los dos grupos (o el grupo consigo mismo).
        def ends_of(t):
            ti = self.tubes.index(t)
            out = []
            for p, rr in ((t.P[0], t.r[0]), (t.P[-1], t.r[-1])):
                hs = set()
                for h in self.touches(ti, p, rr):
                    if h[0] == 'node': hs.add(h[1])
                    elif h[0] == 'tube': hs.add(self.tubes[h[1]].piece)
                    else: hs.add(('Left' if h[1] == 'L' else 'Right') + '_venous_angle')
                hs.add(t.piece)            # el propio tubo (rutas «tronco → conducto» y «conducto → ángulo venoso»)
                out.append(hs)
            return out
        te = [(t, ends_of(t)) for t in self.tubes]
        bad = []
        for r in self.routes:
            de, a = r['de'], r['a']
            if de.startswith('distal:'):
                ok = any(t.piece == r['pieza'] and t.ends[0] and t.ends[0][0] == 'distal' and a in e[1] for t, e in te)
            elif r['pieza'] in ('Lumbar_trunk_L',) and de == 'Lumbar_trunk_L':
                ok = True
            else:
                ok = any((de in e[0] and a in e[1]) or (de in e[1] and a in e[0]) for t, e in te)
                if not ok and a == de: ok = True if len(self.group(de + '|') or self.ctx.pieces.get(de, [])) < 2 else ok
                if not ok:   # dos tubos encadenados (p. ej. ramas de los troncos intestinales)
                    ok = any(de in e[0] and any(a in f[1] for u, f in te if u.piece == t.piece) for t, e in te)
            r['comprobada'] = bool(ok)
            if not ok: bad.append(f"{de} → {a} ({r['pieza']})")
        M['rutas'] = {'total': len(self.routes), 'sin_comprobar': bad}
        # Anillos que fallan.
        tot = collections.Counter(); worst = {}
        for t in self.tubes:
            f = self.router.check(t)
            for k, (cnt, mm, det) in f.items():
                tot[k] += cnt
                if mm > worst.get(k, (0,))[0]: worst[k] = (mm, t.piece, det)
        def lab(e):
            return '' if not e else (f'{e[1]}#{e[2].k}' if e[0] == 'node' else f'{e[0]}:{e[1]}')
        M['anillos'] = {'total': int(sum(len(t.P) for t in self.tubes)), 'fallan': dict(tot), 'peor_mm': {k: list(v) for k, v in worst.items()},
                        'por_pieza': {p: dict(c) for p, c in self._fails_by_piece().items()},
                        'tubos_que_fallan': [{'pieza': t.piece, 'de': lab(t.ends[0]), 'a': lab(t.ends[1]), 'anillos': len(t.P),
                                              'fallos': {k: v for k, v in t.fails.items()}} for t in self.tubes if t.fails]}
        # Vía central.
        td = next(t for t in self.tubes if t.piece == 'Thoracic_duct')
        P, s = td.P, arclength(td.P)
        def at_z(zz):
            i = int(np.argmin(np.abs(P[:, 2] - zz) + (P[:, 2] > self.z['C7'] + 0.02)))
            return P[i]
        z = self.z
        out = {'longitud_mm': round(float(s[-1]) * 1000, 1), 'diametro_mm': [round(float(td.r.min()) * 2000, 2), round(float(td.r.max()) * 2000, 2)]}
        for lvl in ('T12', 'T8'):
            p = at_z(z[lvl])
            a, ra = self.axis('Thoracic_aorta', z[lvl]) if lvl == 'T8' else self.axis('Abdominal_aorta', z[lvl]) or self.axis('Thoracic_aorta', z[lvl])
            az = self.axis('Azygos_vein', z[lvl])
            yf = self.front(z[lvl], p[0])
            es = self.esoph.get(lvl)
            out[lvl] = {'x_mm': round(p[0] * 1000, 1), 'x_aorta_mm': round(a[0] * 1000, 1), 'x_azigos_mm': round(az[0][0] * 1000, 1) if az else None,
                        'entre_aorta_y_azigos': bool(az and min(a[0], az[0][0]) <= p[0] <= max(a[0], az[0][0])),
                        'delante_del_cuerpo_vertebral_mm': round((yf - p[1]) * 1000, 1) if yf else None,
                        'detras_del_centro_del_esofago_mm': round((p[1] - es[0][1]) * 1000, 1) if es else None}
        out['T8']['ok'] = bool(out['T8']['entre_aorta_y_azigos'] and (out['T8']['delante_del_cuerpo_vertebral_mm'] or -1) > 0 and
                               (out['T8']['detras_del_centro_del_esofago_mm'] or -1) > 0)
        out['T12']['ok'] = out['T12']['entre_aorta_y_azigos']
        # Cruce de la línea media (y del eje del esófago), de abajo arriba.
        def cross(xref):
            zs = [P[i, 2] for i in range(len(P) - 1) if (P[i, 0] - xref(P[i, 2])) < 0 <= (P[i + 1, 0] - xref(P[i + 1, 2])) and P[i, 2] < z['T1']]
            return zs
        zm = cross(lambda zz: 0.0)
        out['cruce_linea_media_z_mm'] = [round(v * 1000, 1) for v in zm]
        out['cruce_entre_T6_y_T4'] = bool(zm and z['T6'] - 0.004 <= zm[-1] <= z['T4'] + 0.004)
        left = []
        for lvl in ('T3', 'T2', 'T1'):
            p = at_z(z[lvl]); es = self.esoph.get(lvl)
            if es: left.append(round((p[0] - es[0][0]) * 1000, 1))
        out['por_encima_de_T4_a_la_izquierda_del_esofago_mm'] = left
        out['izquierda_del_esofago_ok'] = bool(left and min(left) > 0)
        out['arco_z_max_menos_C7_mm'] = round((P[:, 2].max() - z['C7']) * 1000, 1)
        A, rv = self.angles['L']
        out['final_al_angulo_venoso_mm'] = round(float(np.linalg.norm(P[-1] - A)) * 1000, 2)
        out['limite_mm'] = round((rv + 0.0015) * 1000, 2)
        out['termina_en_angulo_ok'] = bool(np.linalg.norm(P[-1] - A) <= rv + 0.0015)
        M['conducto_toracico'] = out
        c = next(t for t in self.tubes if t.piece == 'Cisterna_chyli')
        mid = c.P[len(c.P) // 2]
        a, ra = self.axis('Abdominal_aorta', mid[2])
        M['cisterna'] = {'z_mm': [round(c.P[:, 2].min() * 1000, 1), round(c.P[:, 2].max() * 1000, 1)],
                         'L2_L1_T12_z_mm': [round(z[k] * 1000, 1) for k in ('L2', 'L1', 'T12')],
                         'longitud_mm': round(float(arclength(c.P)[-1]) * 1000, 1), 'ancho_max_mm': round(float(c.r.max()) * 2000, 1),
                         'a_la_derecha_de_la_aorta_mm': round((a[0] - mid[0]) * 1000, 1),
                         'ok': bool(c.P[:, 2].min() <= z['L1'] and c.P[:, 2].max() >= z['L1'] and mid[0] < a[0])}
        tr = {}
        for t in self.tubes:
            if t.kind not in ('trunk', 'duct') or t.piece in ('Thoracic_duct', 'Cisterna_chyli'): continue
            e0, e1 = ends_of(t)
            row = tr.setdefault(t.piece, [])
            row.append({'longitud_mm': round(float(arclength(t.P)[-1]) * 1000, 1), 'origen_toca': sorted(map(str, e0)), 'final_toca': sorted(map(str, e1))})
            if t.piece == 'Right_lymphatic_duct':
                A, rv = self.angles['R']
                row[-1]['final_al_angulo_venoso_mm'] = round(float(np.linalg.norm(t.P[-1] - A)) * 1000, 2); row[-1]['limite_mm'] = round((rv + 0.0015) * 1000, 2)
        M['troncos'] = tr
        return M

    def _fails_by_piece(self):
        out = collections.defaultdict(collections.Counter)
        for t in self.tubes:
            for k, (cnt, _, _) in t.fails.items(): out[t.piece][k] += cnt
        return out


def _mirror_gap(pieces):
    """Simetría de las piezas pares: distancia (mm) del 95 % de los vértices del izquierdo, reflejados, al derecho."""
    out = {}
    for nm, V in pieces.items():
        if not nm.endswith('_L') or nm[:-2] + '_R' not in pieces: continue
        A = V * np.array([-1.0, 1, 1]); B = pieces[nm[:-2] + '_R']
        kd = kdtree.KDTree(len(B))
        for i, p in enumerate(B): kd.insert(p, i)
        kd.balance()
        d = np.array([kd.find(p)[2] for p in A[::max(1, len(A) // 3000)]])
        out[nm[:-2]] = round(float(np.percentile(d, 95)) * 1000, 2)
    return out


ROUTES_JS = os.path.join(ROOT, 'web', 'src', 'data', 'linfatico-rutas.js')


def write_routes_js():
    """web/src/data/linfatico-rutas.js a partir de build/linfatico/rutas-<modelo>.json (los modelos que haya): una fila
    por conexión (de, a, lado, pieza, tipo, nota), con los modelos en los que existe y si se comprobó por geometría en
    todos ellos. Lo usan las fichas."""
    rows, order = {}, []
    for m in ('male', 'female'):
        f = os.path.join(REPORT_DIR, f'rutas-{m}.json')
        if not os.path.exists(f): continue
        for r in json.load(open(f, encoding='utf-8')):
            k = (r['de'], r['a'], r['lado'], r['pieza'])
            if k not in rows:
                rows[k] = {'de': r['de'], 'a': r['a'], 'lado': r['lado'], 'pieza': r['pieza'], 'tipo': r['tipo'], 'nota': r['nota'],
                           'modelos': [], 'comprobada': True}
                order.append(k)
            rows[k]['modelos'].append(m); rows[k]['comprobada'] = rows[k]['comprobada'] and bool(r.get('comprobada'))
    body = ',\n'.join('  ' + json.dumps(rows[k], ensure_ascii=False) for k in order)
    with open(ROUTES_JS, 'w', encoding='utf-8') as f:
        f.write('// Generado por tools/lymphatics.py (write_routes_js) desde build/linfatico/rutas-<modelo>.json: no editar a mano.\n'
                '// Conexiones del sistema linfático tal como están trazadas en el modelo 3D (hito 9). «→» es el sentido de la linfa.\n'
                "// tipo: 'documentado' (trayecto de manual), 'esquematico' (colector trazado para unir grupos; no es anatomía\n"
                "// medida) o 'variante' (una de las variantes descritas, elegida y declarada). de/a: pieza de ganglios, tubo o\n"
                "// 'Left_venous_angle'/'Right_venous_angle'; 'distal:<vena>': origen distal esquemático de un colector del miembro.\n"
                '// modelos: en qué modelos existe; comprobada: el recorrido se sigue por geometría conectada en todos ellos.\n'
                f'export const RUTAS = [\n{body}\n]\n')


def build_vessels(ctx):
    """Cisterna del quilo, conducto torácico, conducto linfático derecho, troncos y colectores (hito 9, segunda parte).
    Devuelve los nombres de las piezas creadas. Informes: build/linfatico/rutas-<modelo>.json y comprobaciones-<modelo>.json.

    Qué usa de ctx (ver Context): los ganglios ya colocados (ctx.pieces: centro, ejes y semiejes; el hilio está en el lado
    −medio), ctx.vessels (ejes y radios de arterias y venas ajustados como los publicados), ctx.solids (órganos y corazón
    cerrados), ctx.bone_gap, ctx.skin_gap y ctx.fitter (vértebras de la Fase 2), y ctx.add_piece para crear las piezas.

    Método (docs/hitos/09-sistema-linfatico.md, «Conductos» y «Colectores»):
      1. Vía central, con puntos de paso medidos en el modelo: cisterna del quilo delante de L1–L2 a la derecha de la
         aorta; conducto torácico por el hiato aórtico entre la aorta y la ácigos, delante de los cuerpos vertebrales y
         detrás del esófago, cruce a la izquierda hacia T5, borde izquierdo del esófago, arco en C7 detrás de la vaina
         carotídea y final en contacto con el ángulo venoso izquierdo; conducto linfático derecho (1,5 cm) al ángulo
         derecho; troncos yugular, subclavio y broncomediastínico (izquierdos: al final del conducto torácico, variante
         elegida), lumbares (el izquierdo por detrás de la aorta) e intestinales.
      2. Colectores esquemáticos por región y lado: árbol mínimo entre los ganglios de cada grupo y la tabla de drenaje
         (Lymph.collectors), junto al vaso guía cuando lo hay (1 mm de pared a pared, con una ondulación suave y 2–3
         colectores paralelos junto a la basílica y la safena magna); en los miembros, origen distal esquemático.
      3. Cada eje se aparta de hueso, piel, luz de vasos y órganos (Router.relax) y se comprueba anillo a anillo.
    Con A3D_LINF_PRUEBA_TUBO=1 crea además la pieza de prueba Test_lymphatic_vessel_L (no se publica)."""
    if ctx.add_piece is None: return []
    import time as _t
    t0 = _t.time()
    if not hasattr(ctx, 'solid_by_name'): ctx.solid_by_name = {s.name: s for s in ctx.solids}
    L = Lymph(ctx)
    L.central()
    log(f'  linfático: vía central trazada ({_t.time() - t0:.0f} s)')
    if os.environ.get('A3D_LINF_SOLO_CENTRAL') != '1':
        L.collectors()
        log(f'  linfático: {sum(1 for t in L.tubes if t.kind == "collector")} colectores ({_t.time() - t0:.0f} s)')
    M = L.checks()
    # Piezas: los tubos de cada pieza juntos en una malla.
    by = collections.defaultdict(list)
    for t in L.tubes: by[t.piece].append(t)
    names, verts = [], {}
    for piece in sorted(by):
        Vs, Fs, off = [], [], 0
        for t in by[piece]:
            P, r = t.P, t.r
            if t.kind == 'collector' or t.piece.endswith(('_trunk_L', '_trunk_R')) or t.piece == 'Intestinal_trunks':
                keep = _adaptive(P)
                r = np.interp([int(np.argmin(np.linalg.norm(P - q, axis=1))) for q in keep], np.arange(len(P)), r); P = keep
            V, F = _tube_mesh(P, r, t.seg, getattr(t, 'squash', 1.0))
            Vs.append(V); Fs += [tuple(i + off for i in f) for f in F]; off += len(V)
        V = np.vstack(Vs)
        base = re.sub(r'_[LR]$', '', piece)
        en, es_, la_, group, major = VPIECES[base]
        ctx.add_piece(piece, V, Fs, group, tissue='lymph_vessel', subsystem='vessels', major=major, name_en=en, name_es=es_, name_la=la_,
                      source='Anato3D (generated on the model; tools/lymphatics.py build_vessels). '
                             + ('Schematic collectors' if not major else 'Classic textbook course') + ' — see docs/hitos/09-sistema-linfatico.md',
                      material='lymph_duct' if major else 'lymph_vessel')
        names.append(piece); verts[piece] = V
    M['simetria_p95_mm'] = _mirror_gap(verts)
    M['piezas'] = {p: {'tubos': len(by[p]), 'vertices': int(len(verts[p]))} for p in names}
    M['segundos'] = round(_t.time() - t0, 1)
    os.makedirs(REPORT_DIR, exist_ok=True)
    json.dump(L.routes, open(os.path.join(REPORT_DIR, f'rutas-{MODEL}.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    if os.environ.get('A3D_LINF_DEV') != '1': write_routes_js()
    # Extremos de cada tubo (para comprobarlos después en el GLB publicado).
    M['extremos'] = [{'pieza': t.piece, 'p0': [round(float(x), 5) for x in t.P[0]], 'p1': [round(float(x), 5) for x in t.P[-1]],
                      'r': round(float(t.r.max()), 5), 'distal': bool(t.ends[0] and t.ends[0][0] == 'distal')} for t in L.tubes]
    M['angulos_venosos'] = {s: {'punto_m': [round(float(x), 5) for x in a], 'radio_mm': round(rv * 1000, 2)} for s, (a, rv) in L.angles.items()}
    json.dump(M, open(os.path.join(REPORT_DIR, f'comprobaciones-{MODEL}.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    if os.environ.get('A3D_LINF_DEV') == '1':      # ejes de cada tubo, para analizar fuera de Blender
        lab = lambda e: '' if not e else (f'{e[1]}#{e[2].k}' if e[0] == 'node' else f'{e[0]}:{e[1]}')
        json.dump([{'pieza': t.piece, 'de': lab(t.ends[0]), 'a': lab(t.ends[1]), 'P': np.round(t.P, 5).tolist(), 'fallos': t.fails}
                   for t in L.tubes], open(os.path.join(REPORT_DIR, f'tubos-{MODEL}.json'), 'w'))
    log(f'  linfático: {len(names)} piezas de vasos, {len(L.tubes)} tubos; anillos que fallan {M["anillos"]["fallan"]}; '
        f'ganglios sin camino a una vena {M["grafo"]["ganglios_sin_camino_a_vena"]}; cabos sin declarar {len(M["grafo"]["cabos_no_declarados"])}; '
        f'rutas sin comprobar {len(M["rutas"]["sin_comprobar"])} ({_t.time() - t0:.0f} s)')
    if os.environ.get('A3D_LINF_PRUEBA_TUBO') == '1':
        from female_organs import tube
        line = ctx.vessels.line('Internal_jugular_vein_L')
        if line is not None:
            P, r = line; i = len(P) // 2
            side = _unit(np.cross(P[min(i + 1, len(P) - 1)] - P[i], [0, 1.0, 0]))
            V, F = tube(P[i:i + 12] + side * (r[i] + 0.004), 0.0008, 0.0008, seg=8, ref=(0, 0, 1.0))
            ctx.add_piece('Test_lymphatic_vessel_L', V, F, VESSELS, name_en='Test lymphatic vessel', name_es='Vaso linfático de prueba',
                          name_la='Vas lymphaticum', source='Anato3D (prueba; tools/lymphatics.py)', material='lymph_vessel')
            names.append('Test_lymphatic_vessel_L')
    return names


def materials(principled, srgb):
    """Materiales de los vasos linfáticos: verde amarillento claro, más claro y más amarillo que los nodos (verde) y
    distinto de las venas (azul) y de los nervios (amarillo anaranjado). El de los conductos y troncos, algo más intenso."""
    return {'lymph_vessel': principled('MAT_Lymph_Vessel', srgb(0.80, 0.88, 0.56), 0.38, coat=0.4),
            'lymph_duct': principled('MAT_Lymph_Duct', srgb(0.70, 0.84, 0.44), 0.36, coat=0.45)}
