"""Ajuste compartido para llevar estructuras de Z-Anatomy al cuerpo de Anato3D (lo usan los scripts build_*.py).

Cómo funciona el ajuste:
  Los huesos de la Fase 2 son una transformación afín exacta de los huesos de Z-Anatomy, cada uno con
  la suya. Cada vértice se mueve con la mezcla de las transformaciones de los huesos más cercanos,
  ponderadas por la inversa de la distancia, como la piel con su esqueleto. Luego se aplica la complexión
  musculosa (tools/musculature.py: el campo que engrosa hombros, brazos y tórax, el mismo que infló la piel).
  Después, opcionalmente, se meten bajo la piel los vértices que quedaran fuera de ella.
"""
import bpy, bmesh, sys, os, re, csv, json, time, collections
import numpy as np
from mathutils import Vector, kdtree, bvhtree

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
# Modelo: masculino (por defecto) o femenino (A3D_MODEL=female). El femenino tiene su propia Fase 2 (su piel y el
# esqueleto masculino transformado hasta ella, ver fix_neck.py), no tiene la complexión musculosa del masculino y no lleva
# los órganos que solo tiene el hombre (male_only).
MODEL = os.environ.get('A3D_MODEL', 'male')
FASE2 = os.path.join(ROOT, 'Anato3D_Male_30_Fase2.blend' if MODEL == 'male' else 'Anato3D_Female_30_Fase2.blend')
MUSCULATURE = os.path.join(ROOT, 'Anato3D_Male_30_Fase2_musculature.npz') if MODEL == 'male' else ''  # fix_neck.py
TRANSLATIONS = os.path.join(ROOT, 'sources/z-anatomy/translations.csv')
OUT_DIR = os.path.join(ROOT, 'build')
WEB_MODELS = os.path.join(ROOT, 'web/public/models')

SKIN_OFFSET = 0.0015      # profundidad mínima bajo la piel tras la corrección
IDW_POWER = 4
MAX_AFFINE_ERROR = 0.005  # m; los huesos con más error no guían el ajuste
K_NEAREST = 48

_t0 = time.time()
def log(*a):
    print(f'[{time.time() - _t0:6.1f}s]', *a, flush=True)

def parse_args(defaults):
    argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    opt = dict(defaults)
    for i, a in enumerate(argv):
        if a == '--budget': opt['budget'] = int(argv[i + 1])
        if a == '--only': opt['only'] = [s.strip().lower() for s in argv[i + 1].split(',')]
    return opt

# ── Traducciones (inglés → latín, español) ──────────────────────────────────
TR = {}
with open(TRANSLATIONS, encoding='utf-8') as f:
    for row in csv.reader(f, delimiter=';'):
        if len(row) >= 4: TR[row[0].strip()] = (row[1].strip(), row[3].strip())

# Erratas conocidas de la traducción de Z-Anatomy.
ES_FIXES = [(r'^Musculo\b', 'Músculo'), (r'\bulmonar', 'pulmonar'), (r'\bcorazon\b', 'corazón'), (r'farínge', 'faringe'),
            (r'^Gingiva$', 'Encía'), (r'accessori', 'accesori'), (r'pancreáticoduodenal', 'pancreaticoduodenal'),
            (r'\bsegm\. ', 'segmentario '), (r'\bsup\. ', 'superior '), (r'-pulmón\b', ' del pulmón'), (r'-arteria\b', ' de la arteria'),
            (r'^Septum pellucidum$', 'Septo pelúcido'), (r'\bdel la\b', 'de la')]
# Traducciones oficiales equivocadas (clave: término inglés de Z-Anatomy).
ES_OVERRIDES = {
    'Posterior septal branches of sphenopalatine artery': 'Ramas septales posteriores de la arteria esfenopalatina',
    'Anterior septal branches of anterior ethmoidal artery': 'Ramas septales anteriores de la arteria etmoidal anterior',
    'Short head of biceps brachii': 'Cabeza corta del músculo bíceps braquial',
}
_UNACCENT = str.maketrans('áéíóú', 'aeiou')

def es(term):
    if term in ES_OVERRIDES: return ES_OVERRIDES[term]
    s = TR.get(term, (None, None))[1]
    if not s: return None
    for pat, rep in ES_FIXES: s = re.sub(pat, rep, s)
    # Compuestos con prefijo: en español van juntos y sin tilde en el primer elemento
    # («coraco-acromial» → «coracoacromial», «calcáneo-cuboideo» → «calcaneocuboideo»).
    s = re.sub(r'\b([a-záéíóúñ]+)-([a-záéíóúñ]+)', lambda m: m.group(1).translate(_UNACCENT) + m.group(2), s)
    return s

def la(term):
    return TR.get(term, (None, None))[0]

def sanitize(s):
    return re.sub(r'[^A-Za-z0-9]+', '_', s).strip('_')

def source_name(name):
    """«Inguinal ligament.l» → («Inguinal ligament», 'L')."""
    m = re.match(r'^(.*)\.(l|r)$', name)
    return (m.group(1), m.group(2).upper()) if m else (name, None)

# Estructuras que solo tiene el hombre (Z-Anatomy es un cuerpo masculino): fuera del modelo femenino. La uretra de
# Z-Anatomy es la masculina (prostática, membranosa y esponjosa); la femenina se genera aparte.
MALE_ONLY = re.compile(r'penis|glans|testi(s|cular)|epididym|scrot|spermatic|cremaster|prostat|seminal|ductus deferens|'
                       r'deferent|ejaculatory|dartos|bulbourethral|pampiniform|^urethra(\.[lr])?$', re.I)
def male_only(name):
    return MODEL == 'female' and bool(MALE_ONLY.search(name))

def is_structure(o):
    """Objetos de malla reales: sin etiquetas (.j/.g) ni variantes entre paréntesis."""
    return o.type == 'MESH' and not o.name.startswith('(') and not o.name.endswith(('.j', '.g')) and not male_only(o.name)

# ── Colecciones «Bonus» de Z-Anatomy: región, articulación e inervación ─────
def bonus_paths():
    paths = collections.defaultdict(list)
    def walk(c, pre=()):
        for ch in c.children:
            for o in ch.objects: paths[o.name].append(pre + (ch.name,))
            walk(ch, pre + (ch.name,))
    walk(bpy.data.collections['Bonus collection'])
    return paths

def deepest(paths, name, root):
    ps = [p for p in paths[name] if p[0] == root]
    return [p for p in ps if not any(q != p and q[:len(p)] == p for q in ps)]

# ── Ajuste a los huesos y a la piel de la Fase 2 ────────────────────────────
class Fitter:
    def __init__(self, objects=None):
        """`objects`: los objetos de la Fase 2 ya cargados (fix_neck.py ajusta así músculos al esqueleto que está
        corrigiendo); sin ellos se cargan de Anato3D_Male_30_Fase2.blend, con su complexión musculosa."""
        self.bulk = None
        if objects is None:
            if MUSCULATURE and os.path.exists(MUSCULATURE):
                from musculature import Field
                self.bulk = Field.load(MUSCULATURE)
            with bpy.data.libraries.load(FASE2) as (src, dst):
                dst.objects = list(src.objects)
            ref = bpy.data.collections.new('Fase2_ref')
            bpy.context.scene.collection.children.link(ref)
            for o in dst.objects:
                if o is not None: ref.objects.link(o)
            bpy.context.view_layer.update()
            objects = [o for o in dst.objects if o is not None]

        bones, samples, sample_bone = [], [], []
        allV, allF = [], []                                    # todos los huesos juntos, para la distancia real
        for o in objects:
            if o is None or o.type != 'MESH' or o.get('system') != 'skeletal': continue
            m = re.search(r'Z-Anatomy object "(.+?)"', o.get('source', ''))
            z = bpy.data.objects.get(m.group(1)) if m else None
            if not z: continue
            A, Z = self._world(o), self._world(z)
            if len(A) != len(Z): continue
            base = sum(len(x) for x in allV)
            allV.append(Z); allF += [[base + i for i in pl.vertices] for pl in z.data.polygons]
            for part, sel in self._segments(o, A):
                X = np.c_[Z[sel], np.ones(int(sel.sum()))]
                M, *_ = np.linalg.lstsq(X, A[sel], rcond=None)  # (4,3): A ≈ [Z,1] @ M
                res = float(np.linalg.norm(X @ M - A[sel], axis=1).max())
                # Un hueso que no es una transformación afín del de Z-Anatomy (la apófisis xifoides: 15 mm de error) no
                # puede arrastrar lo que tiene cerca: deformaba la cara anterior del hígado como una cortina.
                if res > MAX_AFFINE_ERROR:
                    log(f'  {part}: error afín {res * 1000:.1f} mm; no se usa para el ajuste')
                    continue
                bones.append({'name': part, 'M': M, 'res': res})
                Zs = Z[sel]; step = max(1, len(Zs) // 300)
                samples.append(Zs[::step]); sample_bone += [len(bones) - 1] * len(Zs[::step])
        S = np.concatenate(samples)
        self.SB = np.array(sample_bone)
        self.kd = kdtree.KDTree(len(S))
        for i, p in enumerate(S): self.kd.insert(p, i)
        self.kd.balance()
        self.BM = np.stack([b['M'] for b in bones])
        self.bone_bvh = bvhtree.BVHTree.FromPolygons(np.concatenate(allV).tolist(), allF)
        self.bones = bones
        log(f'{len(bones)} huesos con transformación, {len(S)} muestras; mayor error de ajuste afín:',
            ', '.join(f'{b["name"]} {b["res"] * 1000:.1f} mm' for b in sorted(bones, key=lambda b: -b['res'])[:4]))

        skin = next(o for o in objects if o.name == 'Skin_Body')
        bm = bmesh.new(); bm.from_mesh(skin.data); bm.transform(skin.matrix_world)
        self.skin = bvhtree.BVHTree.FromBMesh(bm)
        self.genital = GenitalPose(self) if MODEL == 'male' and 'Corpus cavernosum of penis' in bpy.data.objects else None

        # Huesos de la Fase 2 juntos, con la orientación de cada uno (las piezas _L tienen las normales hacia dentro y
        # algunos huesos son mallas abiertas: se usa la cara más cercana, no la paridad).
        bm = bmesh.new(); self.bone_sign = []; self.bone_closed = []; self.bone_of_face = []; self.bone_trees = []
        for o in objects:
            if o is None or o.type != 'MESH' or o.get('system') != 'skeletal': continue
            b = bmesh.new(); b.from_mesh(o.data); b.transform(o.matrix_world)
            self.bone_sign += [1.0 if b.calc_volume(signed=True) >= 0 else -1.0] * len(b.faces)
            self.bone_closed += [all(e.is_manifold for e in b.edges)] * len(b.faces)
            self.bone_of_face += [len(self.bone_trees)] * len(b.faces)
            self.bone_trees.append(bvhtree.BVHTree.FromBMesh(b))
            me = bpy.data.meshes.new('tmp'); b.to_mesh(me); b.free(); bm.from_mesh(me); bpy.data.meshes.remove(me)
        self.fase2_bones = bvhtree.BVHTree.FromBMesh(bm); bm.free()

    def push_out_of_bone(self, V, margin=0.0005, rounds=2):
        """Saca de los huesos de la Fase 2 los vértices que quedaron dentro (más de 0,3 mm), hasta `margin` por fuera.
        Para tejidos que nunca están dentro de un hueso (el encéfalo): la mezcla de transformaciones de huesos vecinos
        (occipital y atlas, p. ej.) podía meter el cerebelo en el occipital."""
        moved = 0
        for _ in range(rounds):
            for i, v in enumerate(V):
                loc, nrm, idx, dist = self.fase2_bones.find_nearest(Vector(v))
                if loc is None: continue
                # En huesos abiertos (el occipital) la normal de la cara más cercana no es fiable lejos de ella: un
                # punto de la cavidad craneal a 2 cm salía «dentro». Ahí solo se corrige cerca de la superficie.
                if not self.bone_closed[idx] and dist > 0.004: continue
                n = np.array(nrm) * self.bone_sign[idx]
                depth = -np.dot(v - np.array(loc), n)
                # Lejos de un hueso fino (una costilla, un cartílago costal), la normal de su cara más cercana puede
                # apuntar al revés: un punto del recto a 5 cm de una costilla salía «dentro» y se llevaba a ella, en un
                # pico. Más de 6 mm se confirma por paridad en ese hueso.
                if depth > 0.006 and not self._parity_inside(self.bone_trees[self.bone_of_face[idx]], v): continue
                if depth > 0.0003:
                    V[i] = np.array(loc) + n * margin; moved += 1
        return moved

    @staticmethod
    def _segments(o, A):
        """Tramos del hueso, cada uno una transformación afín de Z-Anatomy. Los huesos largos de las extremidades se
        reproporcionaron por tramos (tools/proportions.py: la diáfisis se estira o se encoge, las epífisis no) y guardan
        los límites en «segments»; el resto es un solo tramo. Los tramos muy pequeños se unen al vecino."""
        if 'segments' not in o: return [(o.name, np.ones(len(A), bool))]
        seg = json.loads(o['segments'])
        z = (A - np.array(seg['origin'])) @ np.array(seg['axis'])
        lab = np.searchsorted(np.array(seg['knots']), z)
        parts = [lab == j for j in np.unique(lab)]
        merged = []
        for sel in parts:
            if merged and (sel.sum() < 60 or np.ptp(z[sel]) < 0.01): merged[-1] |= sel
            else: merged.append(sel.copy())
        if len(merged) > 1 and (merged[0].sum() < 60 or np.ptp(z[merged[0]]) < 0.01):
            first = merged.pop(0); merged[0] |= first            # (merged[1] |= merged.pop(0) fallaba con dos tramos)
        return [(f'{o.name}#{i}', sel) for i, sel in enumerate(merged)]

    @staticmethod
    def _world(obj):
        m = np.array(obj.matrix_world)
        co = np.empty(len(obj.data.vertices) * 3); obj.data.vertices.foreach_get('co', co)
        return co.reshape(-1, 3) @ m[:3, :3].T + m[:3, 3]

    def bone_distance(self, V):
        """Distancia de cada punto (coordenadas de Z-Anatomy) a la superficie del hueso más cercano."""
        return np.array([self.bone_bvh.find_nearest(Vector(v))[3] for v in V])

    def deform(self, V):
        out = np.empty_like(V)
        for i, v in enumerate(V):
            best = {}
            for _, idx, d in self.kd.find_n(v, K_NEAREST):
                b = self.SB[idx]
                if d < best.get(b, 1e9): best[b] = d
            ids = np.fromiter(best.keys(), int); d = np.fromiter(best.values(), float)
            w = 1.0 / np.maximum(d, 1e-3) ** IDW_POWER; w /= w.sum()
            out[i] = np.einsum('b,bk->k', w, np.append(v, 1.0) @ self.BM[ids])
        if self.bulk is not None: out += self.bulk.sample(out)
        return out

    # La piel de MakeHuman tiene cavidades (boca, ojos): estar «fuera» según la superficie más cercana no
    # basta. Se confirma por paridad: un punto dentro del cuerpo cruza la piel un número impar de veces.
    _DIRS = [Vector(d) for d in ((1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1))]
    def inside_body(self, p):
        return self._parity_inside(self.skin, Vector(p))

    def _parity_inside(self, tree, p):
        p = Vector(p); odd = 0
        for d in self._DIRS:
            o, n = p, 0
            while n < 24:
                hit, _, _, _ = tree.ray_cast(o + d * 1e-5, d)
                if hit is None: break
                n += 1; o = hit
            odd += n % 2
        return odd >= 4

    def keep_inside_skin(self, V, offset=SKIN_OFFSET):
        moved = 0; worst = 0.0
        for i, v in enumerate(V):
            p = Vector(v)
            loc, nrm, _, _ = self.skin.find_nearest(p)
            if loc is None: continue
            depth = (p - loc).dot(nrm)
            # Dentro pero a menos de `offset` de la piel, o fuera de verdad (no en una cavidad): se mete.
            if depth > -offset and (depth <= 0 or not self.inside_body(p)):
                worst = max(worst, depth); moved += 1
                V[i] = np.array(loc - nrm * offset)
        return moved, worst

# ── Posición de los genitales externos ──────────────────────────────────────
def _smoothstep(t):
    t = np.clip(t, 0.0, 1.0)
    return t * t * (3 - 2 * t)

class GenitalPose:
    """Ajuste de los genitales externos masculinos después del ajuste a los huesos, igual en todos los sistemas.

    En Z-Anatomy, una vez ajustado al cuerpo de MakeHuman, el pene apenas asoma 6 cm de la piel (la grasa del pubis de
    MakeHuman es gruesa) y su tronco mide 2,2 cm de ancho; los testículos miden 3,8 × 2,2 × 2,1 cm (9 ml, pequeños
    para un adulto) y quedaban altos, a la altura del glande y a sus lados. Aquí:
      - pene: la parte péndula se alarga (sin el glande) hasta ~8,5 cm visibles, como un pene flácido adulto, y engrosa
        un 12 %; con él, la uretra, los cuerpos cavernosos y esponjoso, y las arterias y venas del pene;
      - testículos: tamaño adulto (4,5 × 2,7 × 2,5 cm, unos 16 ml), más bajos (el izquierdo ~8 mm más que el derecho),
        algo delante para no chocar con los muslos, con el polo superior inclinado hacia delante y afuera. El epidídimo
        les sigue entero; el cordón espermático (conducto deferente, vasos testiculares, rama genital del
        genitofemoral) y las ramas escrotales de los vasos pudendos externos, cada vez menos hasta el anillo inguinal
        superficial, que no se mueve.
    Solo se aplica a las piezas cuyo nombre de Z-Anatomy coincide con PENIS o SCROTAL: los aductores o los vasos
    femorales, a pocos centímetros, no se tocan.
    """
    PENIS = re.compile(r'\bpenis\b|^urethra$', re.I)
    SCROTAL = re.compile(r'^(testis|epididymis)\b|ductus deferens|testicular (artery|vein)|external pudendal|'
                         r'genital branch of genitofemoral', re.I)
    VISIBLE = 0.085                     # m de pene fuera de la piel, de la salida del eje a la punta del glande
    GIRTH = 1.12
    TESTIS_SCALE = (1.2, 1.22, 1.2)     # eje largo, y los otros dos
    TESTIS_SHIFT = {'L': (0.0, -0.002, -0.016), 'R': (0.0, -0.002, -0.008)}   # m; el izquierdo, más bajo
    TESTIS_CENTER_X = 0.020             # m desde la línea media

    def __init__(self, fitter):
        fitted = lambda n: fitter.deform(Fitter._world(bpy.data.objects[n]))
        CC, G = fitted('Corpus cavernosum of penis'), fitted('Glans penis')
        # Eje del pene: componente principal de la parte distal del cuerpo cavernoso y del glande, hacia la punta.
        y0 = CC[:, 1].min() + 0.37 * np.ptp(CC[:, 1])
        D = np.vstack([CC[CC[:, 1] < y0], G]); c = D.mean(0)
        u = np.linalg.svd(D - c)[2][0]; u = -u if u @ (G.mean(0) - c) < 0 else u
        s_g = (G - c) @ u
        s_tip, s_cor = s_g.max(), np.percentile(s_g, 5)
        # Donde el eje sale de la piel (desde el glande hacia atrás, en pasos de 1 mm).
        s_exit = s_cor
        while s_exit > s_cor - 0.15:
            loc, nrm, _, _ = fitter.skin.find_nearest(Vector(c + u * s_exit))
            if (Vector(c + u * s_exit) - loc).dot(nrm) < 0: break
            s_exit -= 0.001
        s0 = s_exit - 0.005
        # Perfil de estiramiento: la derivada pasa de 1 a λ en ±5 mm alrededor de s0 y vuelve a 1 justo antes de la
        # corona (el glande no se estira). λ, por bisección, para que asomen VISIBLE m.
        grid = np.linspace(s0 - 0.03, s_tip + 0.03, 4000)
        def profile(lam):
            ds = 1 + (lam - 1) * _smoothstep((grid - s0 + 0.005) / 0.01) * (1 - _smoothstep((grid - s_cor + 0.004) / 0.004))
            return np.concatenate([[grid[0]], grid[0] + np.cumsum((ds[1:] + ds[:-1]) / 2 * np.diff(grid))])
        visible = lambda F: np.interp(s_tip, grid, F) - np.interp(s_exit, grid, F)
        lo, hi = 1.0, 4.0
        for _ in range(40):
            lam = (lo + hi) / 2
            lo, hi = (lam, hi) if visible(profile(lam)) < self.VISIBLE else (lo, lam)
        F = profile(lam)
        self.penis = dict(c=c, u=u, s0=s0, s_cor=s_cor, grid=grid, F=F, lam=lam)
        self.testes = {}
        for s in 'LR':
            P = fitted(f'Testis.{s.lower()}'); ct = P.mean(0)
            E = np.linalg.svd(P - ct)[2]                         # filas: ejes principales (el primero, el largo)
            E[0] = E[0] if E[0][2] > 0 else -E[0]
            half = np.abs((P - ct) @ E.T).max(0)
            sx = 1.0 if ct[0] > 0 else -1.0
            target = np.array([sx * 0.17, -0.30, 0.94]); target /= np.linalg.norm(target)
            R = _rotation(E[0], target)
            M = R @ E.T @ np.diag(self.TESTIS_SCALE) @ E
            shift = np.array(self.TESTIS_SHIFT[s]) + np.array([sx * self.TESTIS_CENTER_X - ct[0], 0, 0])
            top = (P @ np.array([0, 0, 1.0])).max()
            self.testes[s] = dict(c=ct, M=M, shift=shift, E=E, half=half, z_top=top + 0.012, z_ring=top + 0.06)
        log(f'genitales: pene {(s_tip - s_exit) * 100:.1f} → {visible(F) * 100:.1f} cm fuera de la piel (λ = {lam:.2f}); '
            f'testículos ×{self.TESTIS_SCALE}, bajan ' + ', '.join(f'{s} {-self.TESTIS_SHIFT[s][2] * 100:.1f} cm' for s in 'LR'))

    def penis_map(self, V):
        p = self.penis; c, u = p['c'], p['u']
        s = (V - c) @ u; r = V - c - np.outer(s, u)
        rho = np.linalg.norm(r, axis=1)
        w = (1 - _smoothstep((rho - 0.022) / 0.012)) * _smoothstep((s - p['s0'] + 0.01) / 0.01)
        g = 1 + (self.GIRTH - 1) * _smoothstep((s - p['s0']) / 0.015) * (1 - _smoothstep((s - p['s_cor'] + 0.003) / 0.006))
        new = c + np.outer(np.interp(s, p['grid'], p['F']), u) + r * g[:, None]
        new = np.where((s < p['grid'][0])[:, None], V, new)
        return V + w[:, None] * (new - V)

    def testis_map(self, V, side):
        t = self.testes[side]; d = V - t['c']
        dn = np.linalg.norm((d @ t['E'].T) / t['half'], axis=1)          # 1 en la superficie del testículo
        wt = 1 - _smoothstep((dn - 1.8) / 1.2)                            # transformación completa cerca del testículo
        wh = 1 - _smoothstep((V[:, 2] - t['z_top']) / (t['z_ring'] - t['z_top']))  # hasta el anillo inguinal
        return V + wh[:, None] * (t['shift'] + wt[:, None] * (d @ (t['M'] - np.eye(3)).T))

    def apply(self, source_name, V):
        """V: vértices ya ajustados (m). `source_name`: nombre del objeto en Z-Anatomy."""
        base = re.sub(r'\.(l|r)$', '', source_name)
        if self.PENIS.search(base): return self.penis_map(V)
        if self.SCROTAL.search(base):
            if source_name.endswith('.l') or base.lower().startswith('left'): return self.testis_map(V, 'L')
            if source_name.endswith('.r') or base.lower().startswith('right'): return self.testis_map(V, 'R')
            out = V.copy()                                                # sin lado: cada mitad con el suyo
            for s, sel in (('L', V[:, 0] > 0), ('R', V[:, 0] <= 0)):
                if sel.any(): out[sel] = self.testis_map(V[sel], s)
            return out
        return V

def _rotation(a, b):
    """Rotación mínima que lleva el vector unitario a al b."""
    a = a / np.linalg.norm(a); b = b / np.linalg.norm(b)
    v = np.cross(a, b); c = float(a @ b)
    if np.linalg.norm(v) < 1e-9: return np.eye(3)
    K = np.array([[0, -v[2], v[1]], [v[2], 0, -v[0]], [-v[1], v[0], 0]])
    return np.eye(3) + K + K @ K / (1 + c)

# ── Malla evaluada, reducida y ajustada ─────────────────────────────────────
class Extractor:
    """Evalúa los objetos de origen sin subdivisión, los reduce a un presupuesto de caras y los ajusta."""
    def __init__(self, fitter, sources, budget, keep_subsurf_below=0):
        """`keep_subsurf_below`: las mallas con menos caras que eso (sin subdivisión) conservan un nivel de Subsurf.
        Piezas como la faringe o la tiroides tienen 60–70 caras en Z-Anatomy y sin él quedan facetadas."""
        self.fitter = fitter
        self.dg = bpy.context.evaluated_depsgraph_get()
        for o in sources:
            for m in o.modifiers:
                if m.type == 'SUBSURF': m.show_viewport = False
        self.dg.update()
        def faces(o):
            e = o.evaluated_get(self.dg)
            if o.type == 'MESH': return len(e.data.polygons)
            me = e.to_mesh(); n = len(me.polygons); e.to_mesh_clear()
            return n
        if keep_subsurf_below:
            kept = 0
            for o in sources:
                subs = [m for m in o.modifiers if m.type == 'SUBSURF']
                if subs and faces(o) < keep_subsurf_below:
                    for m in subs: m.levels = 1; m.show_viewport = True
                    kept += 1
            self.dg.update()
            log(f'{kept} mallas de pocas caras conservan un nivel de subdivisión')
        total = sum(faces(o) for o in sources if o.type == 'MESH')
        curves = sum(faces(o) for o in sources if o.type != 'MESH')
        self.ratio = min(1.0, budget / max(total, 1))
        log(f'{len(sources)} objetos: {total} caras de mallas → proporción de reducción {self.ratio:.3f}'
            + (f'; {curves} caras de curvas (sin reducir)' if curves else ''))

    def fit(self, o, name, skin_offset=None, inflate=0.0, detail=1.0, smooth=0, keep_slots=False, pin=0.006, out_of_bone=False):
        """Devuelve (objeto nuevo, vértices corregidos por la piel, peor salida en m).
        `inflate` acerca la malla a la piel esa distancia (p. ej. fascias, para que no las atraviesen los músculos).
        `detail` multiplica la proporción de reducción (p. ej. 0,35 para estructuras que casi siempre quedan ocultas).
        `smooth`: iteraciones de suavizado del desplazamiento (no de la forma) sobre la malla. Quita los saltos entre
        las transformaciones de huesos vecinos (pliegues en el hígado junto al reborde costal) sin tocar el modelo.
        `keep_slots`: conserva el índice de material de cada cara (el que tenía en Z-Anatomy); si no, todas a 0.
        `pin`: hasta esa distancia de un hueso no se suaviza (músculos y ligamentos insertados en él); en las vísceras,
        que no se insertan en hueso, basta con 2 mm."""
        # Las curvas (vasos) no admiten «Decimate»: su detalle se ajusta con la resolución de la curva.
        dec = None
        if o.type == 'MESH':
            dec = o.modifiers.new('anato3d_decimate', 'DECIMATE')
            dec.ratio = max(self.ratio * detail, min(1.0, 300 / max(len(o.data.polygons), 1)))
            self.dg.update()
        me = bpy.data.meshes.new_from_object(o.evaluated_get(self.dg), depsgraph=self.dg)
        if dec: o.modifiers.remove(dec)
        me.transform(o.matrix_world)
        V = np.empty(len(me.vertices) * 3); me.vertices.foreach_get('co', V); V = V.reshape(-1, 3)
        V0 = V.copy()
        V = self.fitter.deform(V)
        if smooth and len(me.edges):
            E = np.empty(len(me.edges) * 2, dtype=np.int64); me.edges.foreach_get('vertices', E); E = E.reshape(-1, 2)
            deg = np.bincount(E.ravel(), minlength=len(V)).astype(float)[:, None]
            D = D0 = V - V0
            # Lo que está pegado a un hueso (a menos de 6 mm) conserva su desplazamiento exacto, para no despegarse ni
            # meterse en él (con suavizado uniforme, el cerebelo entraba 17 mm en el occipital); el suavizado entra
            # poco a poco hasta los 2 cm.
            t = np.clip((self.fitter.bone_distance(V0) - pin) / 0.014, 0, 1)
            free = t * t * (3 - 2 * t)
            # Y solo donde el ajuste deforma la malla: aristas que se estiran o encogen mucho más que la mediana de la
            # pieza (pliegues, desgarros). Donde el campo es regular no se toca (el bazo, suavizado entero, se movía
            # en bloque hasta meterse 4 mm en las costillas).
            ratio = np.linalg.norm(V[E[:, 1]] - V[E[:, 0]], axis=1) / np.maximum(np.linalg.norm(V0[E[:, 1]] - V0[E[:, 0]], axis=1), 1e-9)
            dev = np.abs(np.log(ratio / np.median(ratio)))
            vdev = np.zeros(len(V)); np.maximum.at(vdev, E[:, 0], dev); np.maximum.at(vdev, E[:, 1], dev)
            u = np.clip((vdev - 0.08) / 0.22, 0, 1); bad = u * u * (3 - 2 * u)
            for _ in range(4):                                 # se extiende un poco alrededor del pliegue
                acc = np.zeros(len(V)); np.maximum.at(acc, E[:, 0], bad[E[:, 1]]); np.maximum.at(acc, E[:, 1], bad[E[:, 0]])
                bad = np.maximum(bad, 0.7 * acc)
            free = (free * bad)[:, None]
            for _ in range(smooth):
                acc = np.zeros_like(D)
                np.add.at(acc, E[:, 0], D[E[:, 1]]); np.add.at(acc, E[:, 1], D[E[:, 0]])
                D = np.where(deg > 0, 0.5 * D + 0.5 * acc / np.maximum(deg, 1), D)
                D = free * D + (1 - free) * D0
            V = V0 + D
        if self.fitter.genital: V = self.fitter.genital.apply(o.name, V)
        if inflate:
            # Hacia la piel más cercana: en láminas abiertas la normal puede apuntar hacia dentro.
            for i, v in enumerate(V):
                loc, _, _, dist = self.fitter.skin.find_nearest(Vector(v))
                if loc is not None and dist > 1e-6: V[i] = v + (np.array(loc) - v) / dist * inflate
        if out_of_bone: self.fitter.push_out_of_bone(V)
        moved, worst = (0, 0.0) if skin_offset is None else self.fitter.keep_inside_skin(V, skin_offset)
        center = (V.min(0) + V.max(0)) / 2
        me.vertices.foreach_set('co', (V - center).ravel())
        bm = bmesh.new(); bm.from_mesh(me)
        # Caras de área nula (en la duramadre espinal había 10 100): se disuelven.
        bmesh.ops.dissolve_degenerate(bm, dist=1e-7, edges=bm.edges[:])
        # Las piezas izquierdas de Z-Anatomy están en espejo: se corrige la orientación de las caras.
        # Solo en mallas cerradas; en láminas y tubos abiertos el volumen con signo no significa nada.
        if all(e.is_manifold for e in bm.edges) and bm.calc_volume(signed=True) < 0:
            bmesh.ops.reverse_faces(bm, faces=bm.faces)
        for f in bm.faces: f.smooth = True
        bm.to_mesh(me); bm.free(); me.update()
        me.name = name
        # materials.clear() pone a 0 el índice de material de las caras: se guarda y se restaura si hace falta.
        slots = np.zeros(len(me.polygons), dtype=np.int32); me.polygons.foreach_get('material_index', slots)
        me.materials.clear()
        me.polygons.foreach_set('material_index', slots if keep_slots else np.zeros_like(slots))
        # Si Z-Anatomy ya tiene un objeto con ese nombre («Stomach», «Trachea»…), se aparta el suyo (solo en esta
        # sesión) para que el nuevo conserve el nombre limpio y no acabe como «Stomach.001».
        clash = bpy.data.objects.get(name)
        if clash is not None: clash.name = name + '_zanatomy'
        obj = bpy.data.objects.new(name, me)
        obj.location = center
        return obj, moved, worst

def principled(name, color, roughness, coat=0.0, alpha=1.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    p = mat.node_tree.nodes['Principled BSDF']
    p.inputs['Base Color'].default_value = (*color, 1)
    p.inputs['Roughness'].default_value = roughness
    p.inputs['Coat Weight'].default_value = coat
    if alpha < 1:
        p.inputs['Alpha'].default_value = alpha
        mat.surface_render_method = 'BLENDED'
    return mat

# ── Colecciones por región y guardado ───────────────────────────────────────
class Groups:
    def __init__(self, root_name, names_es=None):
        self.root = bpy.data.collections.new(root_name)
        self.cols = {}
        self.labels = {}
        self.names_es = names_es or {}

    def collection(self, path):
        parent, key = self.root, ()
        for g in path:
            # Z-Anatomy marca algunos grupos con un apóstrofo final y tiene alguna errata («pulonary»).
            g = re.sub(r"['*]+$", '', g).replace('pulonary', 'pulmonary')
            key += (g,)
            col = self.cols.get(key)
            if col is None:
                cid = sanitize(g)
                # Si Z-Anatomy ya usa ese nombre, se aparta la suya (solo en esta sesión) para conservar el id.
                clash = bpy.data.collections.get(cid)
                if clash is not None and clash not in self.cols.values(): clash.name = cid + '_zanatomy'
                col = bpy.data.collections.new(cid)
                parent.children.link(col)
                self.cols[key] = col
                self.labels[col.name] = {'nombre': self.names_es.get(g) or es(g) or g, 'latin': la(g) or '', 'en': g}
            parent = col
        return parent

def save(system_file, groups, stats, extra=None):
    """Escribe build/<system_file>.blend y .json, y la tabla de grupos que lee la app. «male_» pasa a ser el prefijo del
    modelo (female_muscular…)."""
    if system_file.startswith('male_'): system_file = MODEL + system_file[4:]
    os.makedirs(OUT_DIR, exist_ok=True)
    blend_out = os.path.join(OUT_DIR, f'{system_file}.blend')
    bpy.data.libraries.write(blend_out, {groups.root}, fake_user=True)
    json.dump({'groups': groups.labels, 'stats': stats, **(extra or {})},
              open(os.path.join(OUT_DIR, f'{system_file}.json'), 'w'), ensure_ascii=False, indent=1)
    web_meta = os.path.join(WEB_MODELS, system_file.replace('_', '-') + '.json')
    json.dump({'groups': {k: {'nombre': v['nombre'], 'latin': v['latin']} for k, v in groups.labels.items()}},
              open(web_meta, 'w'), ensure_ascii=False, indent=1)
    log('guardado', blend_out, f'{sum(s["faces"] for s in stats)} caras en total')
