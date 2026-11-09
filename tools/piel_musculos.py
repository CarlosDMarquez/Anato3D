"""Piel ajustada a los músculos (2026-11-08): la piel masculina sigue a lo que tiene debajo con un grosor realista.

Por qué. Al ajustar la piel de MakeHuman a Z-Anatomy, la piel se infló por su cuenta: sobre el deltoides (fix_neck.py,
paso 3c2) y con los abultamientos de la complexión musculosa (tools/musculature.py: 13 mm sobre el deltoides, 14 sobre el
trapecio, 9 sobre cada pectoral y nada sobre el esternón). Medido contra los músculos ya ajustados, entre la piel y el
músculo había 37 mm de mediana en los hombros (hasta 55) y 27 en el pecho, cuando lo normal son unos 5–10: hombros como
hombreras y un pecho que parecía hundido entre dos pectorales abultados. Y al revés en la espalda alta y el tríceps (0–3
mm): el trapecio, los romboides, el tríceps, el dorsal ancho y el esternocleidomastoideo llegaban a la piel; el ajuste de
los músculos (Fitter.keep_inside_skin) los aplastaba contra ella y, en la axila, donde su prueba de dentro/fuera se
confunde, el dorsal asomaba 3–5 mm.

Cómo:
  1. Lo que hay bajo la piel: los músculos de Z-Anatomy (sin los internos ni el platisma) y los cartílagos de la laringe,
     colocados como en build_muscular.py (anato3d_fit.Fitter con el campo de la complexión), y los huesos de la Fase 2.
  2. Contorno: para cada vértice, una bola de radio R (de 1,6 a 2,5 cm; 4 en el cuello y 4,5 en la axila) que llega
     desde fuera según la normal suavizada hasta tocar ese tejido. No cabe en los huecos estrechos entre músculos, igual
     que la grasa subcutánea: la piel no se hunde en ellos. En el cuello, con 2 cm, la piel se pegaba a los músculos
     suprahioideos e infrahioideos y quedaba con bultos bajo la mandíbula; un cuello real es liso ahí (grasa submentoniana
     y platisma). Y en el cuello la suavidad es 13 veces mayor: el grosor mínimo saca la piel sobre la laringe y el
     hioides, y sin ella esa meseta dejaba un pliegue marcado bajo la mandíbula.
  3. La piel va a un grosor realista sobre ese contorno, por zona (delante / detrás, en mm): cuello 6/8, hombro 7/8,
     brazo 8/12, codo 5/6, antebrazo 6/7, tórax 9, espalda 10, abdomen 16, región lumbar 13, axila 10. La cabeza, las
     manos, el periné, el miembro inferior y el bajo vientre junto al periné no se tocan (sus vértices quedan fijos,
     exactamente donde estaban: de esa piel sale la piel genital); entre zonas, transiciones suaves.
  4. El desplazamiento va según la normal suavizada y se resuelve por mínimos cuadrados con suavidad (gradiente
     conjugado sobre la malla): así se conserva el detalle de la piel de MakeHuman y la forma sigue a los músculos sin
     dibujar cada borde. En los pliegues de la axila la suavidad es mucho mayor: con la de las demás zonas, la piel de la
     espalda (que sale para cubrir el dorsal) y la del brazo (que entra hacia el tríceps) se juntaban en una arista.
  5. Grosor mínimo de 3 mm: donde un músculo o un hueso queda más cerca, la condición entra en el sistema como
     restricción fuerte y se vuelve a resolver (conjunto activo), hasta 30 mm más fuera. Repartido con suavidad, sin
     picos. Solo cuenta el tejido que está bajo cada trozo de piel: un rayo que empieza fuera (hasta 2 cm, y menos
     donde la piel de enfrente está cerca: en la axila, un punto algo más lejano ya estaría dentro del brazo) y entra.
     Así también se ve el tejido que ya atraviesa la piel.
  6. Nada a la vista: un vértice de tejido que se ve desde fuera (algún rayo de 96 direcciones sale sin tocar la piel)
     pide que la piel que lo mira pase por encima con el grosor mínimo. Lo necesita el pliegue posterior de la axila: la
     porción lateral del dorsal ancho, camino del húmero, y el redondo mayor pasan por la muesca donde se tocan la piel
     del brazo y la del tórax, fuera de las dos, y ningún rayo de la piel los encuentra.

La piel resultante queda en la Fase 2 (los sistemas la usan para saber qué está dentro del cuerpo): al reconstruirlos, los
músculos ya no se aplastan contra ella.

Límite conocido: el brazo cuelga pegado al costado y, donde toca el tórax, la piel del brazo y la del tronco se cortan
(ya lo hacían en la piel de MakeHuman: 80 pares de caras; tras el ajuste, unos 170, en una costura vertical bajo la
axila). No se ve desde fuera (queda entre el brazo y el tórax) y no engaña a las pruebas de dentro/fuera
(anato3d_fit.keep_inside_skin, audit_models.py): lo que queda entre las dos hojas está detrás de las dos, así que no se
mueve ni cuenta como fuera. Separarlas se probó (relajar la malla o llevar las dos hojas a su superficie media) y no
convergía: con el brazo tan cerca, no caben dos pieles de grosor normal.
"""
import os, re
import numpy as np
import bpy
from mathutils import Vector, bvhtree, kdtree

# zona: (peso, grosor delante mm, grosor detrás mm, radio de la bola mm)
ZONAS = {'Neck': (0.85, 6, 8, 40), 'Shoulder': (1.0, 7, 8, 20), 'Axilla': (0.4, 10, 10, 45), 'Arm': (1.0, 8, 12, 20),
         'Elbow': (0.8, 5, 6, 18), 'Forearm': (0.5, 6, 7, 16), 'Chest': (1.0, 9, 9, 20), 'Back': (1.0, 10, 10, 22),
         'Abdomen': (0.75, 16, 16, 25), 'Lumbar': (0.75, 13, 13, 25)}
QUIETAS = ('Scalp', 'Face', 'Eyelids', 'Nose', 'Lips', 'Ear', 'Hand', 'Thigh', 'Knee', 'Leg', 'Foot', 'Buttock', 'Perineum')
MINIMO = ('Neck', 'Shoulder', 'Axilla', 'Arm', 'Elbow', 'Forearm', 'Chest', 'Back', 'Abdomen', 'Lumbar')
P = {'lam': 14.0,        # suavidad del desplazamiento (peso de las aristas frente al de los datos)
     'alpha': 4.0,       # peso que deja quieta la piel de las zonas sin ajuste
     'tmin': 0.003,      # grosor mínimo (m)
     'wc': 200.0,        # peso de las restricciones de grosor mínimo
     'cap': 0.03,        # lo más que una restricción saca la piel por encima del ajuste suave (m)
     'rondas': 10,
     'mapas': 30,        # suavizado de los mapas de peso, grosor y radio (transiciones entre zonas)
     'axila': 60.0, 'axila_dil': 16, 'axila_caida': 0.93,   # suavidad extra en los pliegues de la axila
     'genital': 0.11,    # el abdomen a menos de esto del periné no se toca (de él sale la piel genital)
     'cuello': 12.0}     # suavidad extra en el cuello (×13): reparte el empuje sobre la laringe y el hioides
# Músculos internos de cabeza, cuello y pelvis (los mismos que build_muscular.py no corrige con la piel).
INTERNOS = ('pterygoid', 'glossus', 'geniohyoid', 'palat', 'pharyng', 'superior rectus', 'inferior rectus', 'lateral rectus',
            'medial rectus', 'superior oblique', 'inferior oblique', 'levator palpebrae', 'tendinous ring', 'trochlea',
            'longus colli', 'longus capitis', 'rectus anterior capitis', 'rectus lateralis capitis', 'coccyg', 'levator ani',
            'pubo', 'diaphragm', 'transversus thoracis', 'innermost intercostal', 'psoas', 'iliacus', 'quadratus lumborum')


def tejido(objs, world, field, za_path):
    """Triángulos (V, T) de lo que hay bajo la piel: músculos y cartílagos de la laringe de Z-Anatomy ajustados como en
    build_muscular.py, y los huesos de la Fase 2. `objs`: objetos de la Fase 2; `field`: campo de la complexión."""
    from anato3d_fit import Fitter, is_structure, source_name
    bones = [o for o in objs.values() if o.type == 'MESH' and o.get('system') == 'skeletal']
    origin = {o.name: re.search(r'Z-Anatomy object "(.+?)"', o.get('source', '')) for o in bones}
    names = {m.group(1) for m in origin.values() if m}
    # Cuatro huesos de la Fase 2 (Sacrum, Coccyx, Mandible, Vomer) se llaman igual que su original de Z-Anatomy: al
    # cargarlo, el de Z-Anatomy pasaría a «.001» y el ajuste tomaría el de la Fase 2 por el original (transformación
    # identidad: los músculos bajo la mandíbula y junto al sacro, mal colocados). Mientras dura la carga se renombran.
    clash = [o for o in bones if origin[o.name] and origin[o.name].group(1) == o.name]
    for o in clash: o.name = o.name + '__fase2'
    cols_before = set(bpy.data.collections); objs_before = set(bpy.data.objects)
    try:
        with bpy.data.libraries.load(za_path) as (src, dst):
            dst.objects = sorted(names | {'Cricoid cartilage', 'Thyroid cartilage'})
            dst.collections = ['4: Muscular system']
        tmp = bpy.data.collections.new('za_piel'); bpy.context.scene.collection.children.link(tmp)
        for o in dst.objects:
            if o is not None: tmp.objects.link(o)
        musc_col = dst.collections[0]
        tmp.children.link(musc_col)                     # en la escena, para evaluar sus modificadores
        bpy.context.view_layer.update()
        fitter = Fitter([o for o in objs.values() if o.type == 'MESH'])
        fitter.bulk = field
        src = [o for o in musc_col.objects if o.type == 'MESH' and is_structure(o)
               and not any(k in source_name(o.name)[0].lower() for k in INTERNOS) and 'platysma' not in o.name.lower()]
        src += [o for o in dst.objects if o is not None and o.name in ('Cricoid cartilage', 'Thyroid cartilage')]
        for o in src:
            for m in o.modifiers:
                if m.type == 'SUBSURF': m.show_viewport = False
        dg = bpy.context.evaluated_depsgraph_get(); dg.update()
        V, T = [], []
        def add(P, polys):
            base = sum(len(x) for x in V); V.append(P)
            for f in polys:
                for k in range(1, len(f) - 1): T.append((base + f[0], base + f[k], base + f[k + 1]))
        for o in src:
            me = bpy.data.meshes.new_from_object(o.evaluated_get(dg), depsgraph=dg)
            me.transform(o.matrix_world)
            C = np.empty(len(me.vertices) * 3); me.vertices.foreach_get('co', C)
            add(fitter.deform(C.reshape(-1, 3)), [p.vertices[:] for p in me.polygons])
            bpy.data.meshes.remove(me)
        n_musc = len(src)
        for o in bones: add(world(o), [p.vertices[:] for p in o.data.polygons])
    finally:
        # Fuera todo lo cargado (objetos, colecciones de Z-Anatomy y la temporal) antes de devolver sus nombres a los
        # huesos de la Fase 2.
        # Todo lo que trajo la carga: también los padres y vacíos de agrupación de Z-Anatomy («….g») que arrastra un
        # objeto al cargarlo, y las colecciones (y la temporal).
        for o in set(bpy.data.objects) - objs_before: bpy.data.objects.remove(o)
        for c in set(bpy.data.collections) - cols_before: bpy.data.collections.remove(c)
        for o in clash: o.name = o.name[:-len('__fase2')]
    return np.concatenate(V), np.array(T, np.int64), n_musc


def ajustar(skin, labels, V, T, world, set_world, log=print):
    """Lleva la piel (`skin`, con `labels` = zona de cada cara, de skin_regions.label) a su grosor sobre el tejido (V, T).
    Devuelve un resumen."""
    tissue = bvhtree.BVHTree.FromPolygons(V.tolist(), T.tolist())
    W = world(skin); n = len(W)
    polys = [p.vertices[:] for p in skin.data.polygons]
    E = np.empty(len(skin.data.edges) * 2, dtype=np.int64); skin.data.edges.foreach_get('vertices', E); E = E.reshape(-1, 2)
    deg = np.bincount(E.ravel(), minlength=n).astype(float)
    def adj(x):
        acc = np.zeros_like(x); np.add.at(acc, E[:, 0], x[E[:, 1]]); np.add.at(acc, E[:, 1], x[E[:, 0]]); return acc
    def avg(x): return adj(x) / (np.maximum(deg, 1) if x.ndim == 1 else np.maximum(deg, 1)[:, None])
    TF = np.array([(f[0], f[k], f[k + 1]) for f in polys for k in range(1, len(f) - 1)])
    def normals(W, k):
        fn = np.cross(W[TF[:, 1]] - W[TF[:, 0]], W[TF[:, 2]] - W[TF[:, 0]])
        N = np.zeros_like(W)
        for j in range(3): np.add.at(N, TF[:, j], fn)
        N /= np.maximum(np.linalg.norm(N, axis=1), 1e-12)[:, None]
        for _ in range(k): N = 0.5 * N + 0.5 * avg(N)
        return N / np.linalg.norm(N, axis=1)[:, None]
    # Zona de cada vértice (la de una de sus caras; los bordes entre zonas se suavizan después).
    zona = np.empty(n, dtype=object)
    for f, lab in zip(polys, labels):
        for v in f: zona[v] = lab
    zona = np.array([z[:-2] if z.endswith(('_L', '_R')) else z for z in zona.astype(str)])

    Ns = normals(W, 10)
    m = np.zeros(n); tf = np.zeros(n); tb = np.zeros(n); R = np.full(n, 0.02)
    for k, (w, a, b, r) in ZONAS.items():
        s_ = zona == k; m[s_] = w; tf[s_] = a / 1000; tb[s_] = b / 1000; R[s_] = r / 1000
    known = np.isin(zona, list(ZONAS)); quieta = np.isin(zona, QUIETAS)
    # El bajo vientre junto a los genitales tampoco se toca: la piel genital (build_genital_skin.py) sale de las
    # distancias a esta piel en una rejilla alrededor del pene y el escroto, y con moverla menos de 1 mm cambiaba (un
    # vértice de los cuerpos cavernoso y esponjoso quedaba fuera de ella).
    per = np.where(zona == 'Perineum')[0]
    if len(per):
        kdp = kdtree.KDTree(len(per))
        for k, i in enumerate(per): kdp.insert(W[i], k)
        kdp.balance()
        ab = np.where(zona == 'Abdomen')[0]
        quieta[ab[[kdp.find(W[i])[2] < P['genital'] for i in ab]]] = True
    for _ in range(P['mapas']): m = np.where(quieta, 0.0, 0.5 * m + 0.5 * avg(m))
    for arr in (tf, tb, R):
        v = arr.copy()
        for _ in range(P['mapas']): v = np.where(known, 0.5 * v + 0.5 * avg(v), avg(v))
        arr[:] = v
    back = np.clip((Ns[:, 1] + 0.3) / 0.6, 0, 1); back = back * back * (3 - 2 * back)        # detrás = +Y
    grosor = tf * (1 - back) + tb * back

    # Suavidad por arista: mucho mayor en los pliegues de la axila.
    ax = (zona == 'Axilla').astype(float)
    for _ in range(P['axila_dil']):
        acc = np.zeros(n); np.maximum.at(acc, E[:, 0], ax[E[:, 1]]); np.maximum.at(acc, E[:, 1], ax[E[:, 0]])
        ax = np.maximum(ax, P['axila_caida'] * acc)
    for _ in range(6): ax = 0.5 * ax + 0.5 * avg(ax)
    lam_e = P['lam'] * (1 + P['axila'] * 0.5 * (ax[E[:, 0]] + ax[E[:, 1]]))
    cu = (zona == 'Neck').astype(float)
    for _ in range(6): cu = 0.5 * cu + 0.5 * avg(cu)
    lam_e = lam_e * (1 + P['cuello'] * 0.5 * (cu[E[:, 0]] + cu[E[:, 1]]))
    deg_l = np.zeros(n); np.add.at(deg_l, E[:, 0], lam_e); np.add.at(deg_l, E[:, 1], lam_e)
    def lap(x):
        acc = np.zeros_like(x); np.add.at(acc, E[:, 0], lam_e * x[E[:, 1]]); np.add.at(acc, E[:, 1], lam_e * x[E[:, 0]])
        return deg_l * x - acc
    # Las zonas que no se ajustan quedan exactamente donde estaban (s = 0 fijo): con solo un peso que las retiene, el
    # suavizado arrastraba hasta 2,3 mm la mano, 1,4 el glúteo y 0,5 la cara, y una décima el periné, de donde salen la
    # piel genital y los genitales. El gradiente conjugado trabaja solo con los vértices libres.
    libre = (~quieta).astype(float)
    def solve(wd, b, x0):
        s = x0 * libre; r = (b - (wd * s + lap(s))) * libre; p = r.copy(); rr = r @ r
        for it in range(4000):
            Ap = (wd * p + lap(p)) * libre; al = rr / (p @ Ap); s += al * p; r -= al * Ap
            rr2 = r @ r
            if rr2 < 1e-18 * n: break
            p = r + (rr2 / rr) * p; rr = rr2
        return s, it + 1

    def tree(W): return bvhtree.BVHTree.FromPolygons(W.tolist(), polys)
    def gap(ST, w, nrm):                     # hasta la piel de enfrente (el brazo frente al tórax), como mucho 8 cm
        h = ST.ray_cast(Vector(w + nrm * 1e-4), Vector(nrm), 0.08)
        return 0.08 if h[0] is None else h[3]
    def contorno(w, nrm, R, g):
        """Posición del contorno según la normal (m; > 0 fuera de la piel): la bola de radio R que llega desde fuera.
        (Se probó limitar la bola al hueco hasta la piel de enfrente, para que no tocara los músculos del otro lado: bajo
        la mandíbula quedaban cientos de vértices sin dato y el cuello salía con bultos. Lo que asoma en los huecos lo
        resuelven las restricciones de los pasos 5 y 6.)"""
        u = min(0.02, 0.45 * g)
        for _ in range(120):
            loc, _, _, d = tissue.find_nearest(Vector(w + u * nrm), 0.25)
            if loc is None: return np.nan
            if abs(d - R) < 1e-4: break
            u = min(u - (d - R), 0.9 * g)
            if u < -0.12: return np.nan
        return u - R

    ST = tree(W)
    act = np.where(m > 0.01)[0]
    env = np.full(n, np.nan)
    for i in act: env[i] = contorno(W[i], Ns[i], R[i], gap(ST, W[i], Ns[i]))
    target = env + grosor
    ok = ~np.isnan(target)
    w1 = np.where(ok, m, 0.0)
    wd = w1 + P['alpha'] * (1 - m); b = w1 * np.nan_to_num(target)
    s, its = solve(wd, b, np.zeros(n))
    s0 = s.copy()
    log(f'piel sobre los músculos: contorno en {len(act)} vértices ({int((~ok[act]).sum())} sin contorno); '
        f'ajuste suave en {its} iteraciones, de {s.min() * 1000:.1f} a {s.max() * 1000:.1f} mm')

    # Grosor mínimo (conjunto activo).
    idx = np.where(np.isin(zona, MINIMO))[0]
    cons = np.full(n, -np.inf)
    DIRS = [Vector(d) for d in ((1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1))]
    def dentro(STc, p):                       # paridad de rayos, como anato3d_fit y audit_models.py
        odd = 0
        for d in DIRS:
            o, k = p, 0
            while k < 40:
                hit = STc.ray_cast(o + d * 1e-5, d)[0]
                if hit is None: break
                k += 1; o = hit
            odd += k % 2
        return odd >= 4
    # Lo que se ve desde fuera, mirado desde el tejido. En el pliegue posterior de la axila, la porción lateral del dorsal
    # ancho (camino del húmero) y el redondo mayor pasan por la muesca donde se tocan la piel del brazo y la del tórax:
    # quedan fuera de las dos y ningún rayo de la piel los encuentra (la piel de enfrente está a 3–7 mm). Un vértice de
    # tejido a menos de 2 cm de la piel que se ve desde fuera (algún rayo de 96 direcciones sale sin tocarla) pide que la
    # piel que lo mira, en 15 mm a la redonda, pase por encima de él con el grosor mínimo.
    usado = np.zeros(len(V), bool); usado[T.ravel()] = True        # los vértices sueltos de un hueso no se ven
    kd0 = kdtree.KDTree(n)                  # toda la piel: el tejido cuenta si su piel más cercana se puede mover
    for i in range(n): kd0.insert(W[i], i)
    kd0.balance()
    lo, hi = W[act].min(0) - 0.02, W[act].max(0) + 0.02
    cerca = np.where(usado & (V >= lo).all(1) & (V <= hi).all(1))[0]
    def movible(j):
        _, i, d = kd0.find(V[j]); return d < 0.02 and m[i] >= 0.2
    cand = np.array([j for j in cerca if movible(j)], dtype=np.int64)
    kk = np.arange(96) + 0.5; fi_ = np.arccos(1 - 2 * kk / 96); th_ = np.pi * (1 + 5 ** 0.5) * kk
    DV = [Vector(v) for v in np.c_[np.cos(th_) * np.sin(fi_), np.sin(th_) * np.sin(fi_), np.cos(fi_)]]
    def asoman(Wc, Nn, STc):
        kd = kdtree.KDTree(len(act))
        for i in act: kd.insert(Wc[i], int(i))
        kd.balance()
        out = {}; nvis = 0
        for j in cand:
            p = Vector(V[j]); loc, nrm, _, _ = STc.find_nearest(p, 0.02)
            if loc is None or (p - loc).dot(nrm) < -0.0015: continue
            if all(STc.ray_cast(p + d * 1e-5, d)[0] is not None for d in DV): continue
            nvis += 1
            for _, i, _ in kd.find_range(p, 0.015):
                need = float((V[j] - Wc[i]) @ Nn[i]) + P['tmin']
                if need > out.get(i, 1e-4): out[i] = need
        return list(out.items()), nvis

    def faltas(Wc, Nn, STc):
        # Un rayo que empieza fuera (hasta 2 cm, o 0,4 del hueco hasta la piel de enfrente) y entra hasta tmin bajo la
        # piel. El tejido que encuentra bajo la piel pide grosor; el que encuentra delante de ella la atraviesa y pide
        # sacarla por encima, pero solo si ese punto está fuera del cuerpo (paridad): donde el brazo toca el tórax y
        # las dos pieles se cortan, el rayo de la piel del tórax nace dentro del brazo y encuentra el tríceps, que no
        # sale de nada. Empezando el rayo a 6 mm, como antes, el cuerpo del esternón, que el ajuste suave dejaba 7 mm
        # fuera, no se veía (el rayo nacía dentro del hueso).
        out = []
        for i in idx:
            g = gap(STc, Wc[i], Nn[i]); u0 = min(0.02, 0.4 * g)
            o = Vector(Wc[i] + Nn[i] * u0); d = Vector(-Nn[i]); t = 0.0; need = 0.0
            for _ in range(12):
                h = tissue.ray_cast(o, d, u0 + P['tmin'] + 0.001 - t)
                if h[0] is None: break
                t += h[3]
                if t >= u0: need = P['tmin'] - (t - u0); break        # bajo la piel
                if not dentro(STc, h[0]): need = (u0 - t) + P['tmin']; break   # delante de la piel y fuera del cuerpo
                o = h[0] + d * 1e-5; t += 1e-5
            need = min(need, 0.4 * g)
            if need > 1e-4: out.append((i, need))
        return out
    def comprobar(s):
        Wc = W + s[:, None] * Ns; Nn = normals(Wc, 6); STc = tree(Wc)
        viol = faltas(Wc, Nn, STc)
        vis, nvis = asoman(Wc, Nn, STc)
        return Wc, viol, vis, nvis
    antes = None
    for rnd in range(P['rondas']):
        Wc, viol, vis, nvis = comprobar(s)
        log(f'piel sobre los músculos: ronda {rnd + 1}, {len(viol)} vértices sin grosor, {nvis} vértices de tejido a la vista')
        # Sin nada que arreglar, o con las mismas faltas que la ronda anterior (las que no se pueden arreglar: donde el
        # brazo toca el tórax, la piel de enfrente no deja sacar más esta), se para.
        ahora = {i for i, _ in viol}
        if not vis and (not viol or ahora == antes): break
        antes = ahora
        for i, need in viol + vis: cons[i] = min(max(cons[i], s[i] + need + 0.0003), s0[i] + P['cap'])
        c = np.isfinite(cons); wc = np.where(c, P['wc'], 0.0)
        s, its = solve(wd + wc, b + wc * np.where(c, cons, 0.0), s)
    Wf, viol, vis, nvis = comprobar(s)
    # Caras de piel que se cortan entre sí (no vecinas, en las zonas ajustadas): el brazo, pegado al costado, toca el tórax.
    vecinas = [set(p) for p in polys]
    STf = tree(Wf)
    cruces = sum(1 for fa, fb in STf.overlap(STf)
                 if fa < fb and not (vecinas[fa] & vecinas[fb]) and (m[list(polys[fa]) + list(polys[fb])] > 0.01).all())
    set_world(skin, Wf)
    rep = {'vertices': int((np.abs(s) > 1e-4).sum()), 'dentro_mm': round(float(-s.min()) * 1000, 1),
           'fuera_mm': round(float(s.max()) * 1000, 1), 'restricciones': int(np.isfinite(cons).sum()),
           'quedan_a_menos_de_3mm': len(viol), 'peor_mm': round(max((v for _, v in viol), default=0.0) * 1000, 1),
           'tejido_a_la_vista': nvis, 'caras_que_se_cruzan': cruces}
    log('piel sobre los músculos:', rep)
    return rep
