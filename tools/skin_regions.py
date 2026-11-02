"""Zonas de la piel: divide la piel de MakeHuman en piezas por región del cuerpo para que la web pueda seleccionar, ocultar
o aislar cada zona (cuero cabelludo, cara, párpados, nariz, labios, orejas, cuello, hombro, axila, brazo, codo, antebrazo,
mano, tórax, mama, abdomen, espalda, región lumbar, glúteo, periné, muslo, rodilla, pierna, pie).

La piel no trae grupos de vértices: cada cara se asigna con referencias del esqueleto de la Fase 2 (Z arriba, delante = −Y,
la izquierda del cuerpo en +X):
  - la cabeza, por encima del plano del borde inferior de la mandíbula a la base del occipital; en ella, los párpados
    alrededor de los ojos, los labios alrededor de los incisivos, la nariz donde la piel sobresale de la línea de las
    mejillas, las orejas donde la piel es una lámina fina (un rayo hacia dentro vuelve a encontrar piel muy cerca) y la
    cara por delante de las orejas y por debajo del nacimiento del pelo;
  - los miembros, por el hueso más cercano y planos perpendiculares al eje del miembro en el hombro, el codo, la muñeca,
    la cadera, la rodilla y el tobillo;
  - el tronco, dividido en delante y detrás por el centro de cada corte horizontal; el reborde costal separa el tórax del
    abdomen, el ligamento inguinal el abdomen del muslo, la 12.ª costilla la espalda de la región lumbar, la cresta
    ilíaca la región lumbar de los glúteos y el pliegue glúteo (bajo la tuberosidad isquiática) los glúteos del muslo.
Después, un filtro de mayoría entre caras vecinas (cuatro pasadas) suaviza los bordes y cada zona se queda en un solo
trozo: los fragmentos sueltos pasan a la zona que más los rodea.

split(skin, labels) pasa cada zona a un objeto propio (Skin_<Zona>[_L|_R]) que conserva las normales de la piel entera:
en los bordes no hay costura de sombreado.
"""
import re
import numpy as np
import bmesh
from mathutils import Vector, bvhtree

# id: (nombre inglés, nombre español, latín y término de la Terminologia Anatomica 2 de la región, grupo). Las zonas con
# lado llevan _L/_R al final.
REGIONS = {
    'Scalp': ('Scalp', 'Cuero cabelludo', 'Calva', '7113', 'Skin_of_head'),
    'Face': ('Skin of face', 'Piel de la cara', 'Facies', '112', 'Skin_of_head'),
    'Eyelids': ('Eyelids', 'Párpados', 'Palpebrae', '6822', 'Skin_of_head'),
    'Nose': ('External nose', 'Nariz', 'Nasus externus', '117', 'Skin_of_head'),
    'Lips': ('Lips', 'Labios', 'Labia oris', '2775', 'Skin_of_head'),
    'Ear': ('Auricle', 'Oreja', 'Auricula', '104', 'Skin_of_head'),
    'Neck': ('Skin of neck', 'Piel del cuello', 'Collum', '123', 'Skin_of_neck'),
    'Chest': ('Skin of thorax', 'Piel del tórax', 'Thorax', '125', 'Skin_of_trunk'),
    'Breast': ('Breast', 'Mama', 'Mamma', '7097', 'Skin_of_trunk'),
    'Abdomen': ('Skin of abdomen', 'Piel del abdomen', 'Abdomen', '127', 'Skin_of_trunk'),
    'Back': ('Skin of back', 'Piel de la espalda', 'Dorsum thoracis', '136', 'Skin_of_trunk'),
    'Lumbar': ('Skin of lumbar region', 'Piel de la región lumbar', 'Regio lumbalis', '269', 'Skin_of_trunk'),
    'Buttock': ('Skin of gluteal region', 'Piel de la región glútea', 'Regio glutea', '313', 'Skin_of_trunk'),
    'Perineum': ('Skin of perineum', 'Piel del periné', 'Perineum', '131', 'Skin_of_trunk'),
    'Shoulder': ('Skin of deltoid region', 'Piel del hombro', 'Regio deltoidea', '283', 'Skin_of_upper_limb'),
    'Axilla': ('Skin of axilla', 'Piel de la axila', 'Regio axillaris', '281', 'Skin_of_upper_limb'),
    'Arm': ('Skin of arm', 'Piel del brazo', 'Brachium', '144', 'Skin_of_upper_limb'),
    'Elbow': ('Skin of elbow', 'Piel del codo', 'Regio cubitalis', '289', 'Skin_of_upper_limb'),
    'Forearm': ('Skin of forearm', 'Piel del antebrazo', 'Antebrachium', '146', 'Skin_of_upper_limb'),
    'Hand': ('Skin of hand', 'Piel de la mano', 'Manus', '148', 'Skin_of_upper_limb'),
    'Thigh': ('Skin of thigh', 'Piel del muslo', 'Femur', '160', 'Skin_of_lower_limb'),
    'Knee': ('Skin of knee', 'Piel de la rodilla', 'Genu', '161', 'Skin_of_lower_limb'),
    'Leg': ('Skin of leg', 'Piel de la pierna', 'Crus', '163', 'Skin_of_lower_limb'),
    'Foot': ('Skin of foot', 'Piel del pie', 'Pes', '166', 'Skin_of_lower_limb'),
}
SIDED = {'Eyelids', 'Ear', 'Breast', 'Buttock', 'Shoulder', 'Axilla', 'Arm', 'Elbow', 'Forearm', 'Hand', 'Thigh', 'Knee', 'Leg', 'Foot'}
GROUPS = {'Skin_of_head': 'Skin of head', 'Skin_of_neck': 'Skin of neck', 'Skin_of_trunk': 'Skin of trunk',
          'Skin_of_upper_limb': 'Skin of upper limb', 'Skin_of_lower_limb': 'Skin of lower limb'}


def _world(o):
    m = np.array(o.matrix_world)
    co = np.empty(len(o.data.vertices) * 3); o.data.vertices.foreach_get('co', co)
    return co.reshape(-1, 3) @ m[:3, :3].T + m[:3, 3]


def _axis(v):
    """Extremos (proximal, distal) del eje principal de un hueso largo: el proximal es el más alto."""
    c = v.mean(0); u = np.linalg.svd(v - c)[2][0]
    t = (v - c) @ u; a, b = c + u * t.min(), c + u * t.max()
    return (a, b) if a[2] > b[2] else (b, a)


def _unit(v): return v / np.linalg.norm(v)


def label(skin, objs, female=False):
    """Zona de cada cara de la piel (array de str, p. ej. 'Forearm_L')."""
    me = skin.data
    V = _world(skin)
    F = [p.vertices[:] for p in me.polygons]
    C = np.array([V[list(f)].mean(0) for f in F])
    N = np.array([p.normal[:] for p in me.polygons]) @ np.array(skin.matrix_world)[:3, :3].T
    N /= np.linalg.norm(N, axis=1, keepdims=True)
    bones = {n: _world(o) for n, o in objs.items() if o.type == 'MESH' and o.get('tissue') in ('bone', 'tooth', 'cartilage')}
    def P(pattern): return np.vstack([v for n, v in bones.items() if re.match(pattern, n)])

    # Hueso más cercano de cada cara (por el vértice de hueso más cercano: los huesos son mallas densas).
    from mathutils import kdtree
    names = list(bones)
    allv = np.vstack([bones[n] for n in names]); owner = np.repeat(np.arange(len(names)), [len(bones[n]) for n in names])
    kd = kdtree.KDTree(len(allv))
    for k, v in enumerate(allv): kd.insert(v, k)
    kd.balance()
    found = [kd.find(c) for c in C]
    near = np.array([names[owner[f[1]]] for f in found])
    dbone = np.array([f[2] for f in found])
    side = np.where(C[:, 0] >= 0, 'L', 'R')

    # Referencias.
    mand, occ = P('Mandible'), P('Occipital_Bone')
    chin = mand[np.argmin(mand[:, 2])]
    head_front = (mand[:, 1].min(), mand[:, 2].min() + 0.004)
    head_back = (occ[:, 1].max(), occ[:, 2].min() + 0.012)
    def z_head(y): return np.interp(y, [head_front[0], head_back[0]], [head_front[1], head_back[1]])
    man, c7 = P('Sternum_Manubrium'), P('Vertebra_C7')
    neck_front = (man[:, 1].min(), man[:, 2].max())
    neck_back = (c7[:, 1].max(), c7[c7[:, 1] > c7[:, 1].max() - 0.01, 2].mean())
    def z_neck(y): return np.interp(y, [neck_front[0], neck_back[0]], [neck_front[1], neck_back[1]])
    eyes = {s: _world(objs[n]) for s, n in (('L', 'Left_Eyeball'), ('R', 'Right_Eyeball')) if n in objs}
    eye_c = {s: v.mean(0) for s, v in eyes.items()}
    eye_r = {s: np.linalg.norm(v - eye_c[s], axis=1).mean() for s, v in eyes.items()}
    inc_up, inc_lo = P('Tooth_Upper_Medial_Incisor'), P('Tooth_Lower_Medial_Incisor')
    z_mouth = (inc_up[:, 2].min() + inc_lo[:, 2].max()) / 2
    y_teeth = min(inc_up[:, 1].min(), inc_lo[:, 1].min())
    z_eyes = np.mean([c[2] for c in eye_c.values()])

    J = {}
    for s in 'LR':
        hu, ra, ul, fe, ti = (_axis(bones[f'{b}_{s}']) for b in ('Humerus', 'Radius', 'Ulna', 'Femur', 'Tibia'))
        carp = np.vstack([bones[f'{b}_{s}'] for b in ('Scaphoid', 'Lunate', 'Triquetrum')])
        J[s] = dict(shoulder=hu[0], elbow=(hu[1] + ul[0]) / 2, wrist=(ra[1] + carp.mean(0)) / 2,
                    hip=fe[0], knee=(fe[1] + ti[0]) / 2, ankle=(ti[1] + bones[f'Talus_{s}'].mean(0)) / 2)
    hip = P('Hip_Bone')
    z_crest = hip[:, 2].max()
    ischium = hip[(hip[:, 1] > hip[:, 1].mean()) & (np.abs(hip[:, 0]) < 0.08)]
    z_fold = ischium[:, 2].min() - 0.015                      # pliegue glúteo: algo por debajo de la tuberosidad isquiática
    upper = hip[hip[:, 2] > np.median(hip[:, 2])]
    asis = upper[np.argmin(upper[:, 1])]
    mid = hip[np.abs(hip[:, 0]) < 0.035]
    tub = mid[np.argmin(mid[:, 1])]
    z_pubis_low = mid[:, 2].min()
    def below_inguinal(p):
        xa, za, xp, zp = abs(asis[0]), asis[2], abs(tub[0]), tub[2]
        t = np.clip((abs(p[0]) - xp) / (xa - xp), 0, 1)
        return p[2] < zp + t * (za - zp) - 0.005
    z_lumbar_top = P('Vertebra_T12$')[:, 2].min()           # región lumbar: de la 12.ª vértebra torácica a la cresta ilíaca
    # Reborde costal: el punto más bajo de los cartílagos y costillas 7–10 por delante, según la distancia a la línea media.
    cart = P(r'(Costal_Cartilage_(7|8|9|10)|Rib_(7|8|9|10)_|Sternum_Xiphoid)')
    cart = cart[cart[:, 1] < np.median(cart[:, 1])]
    xb = np.linspace(0, 0.16, 17)
    zc = np.array([cart[(np.abs(cart[:, 0]) >= a) & (np.abs(cart[:, 0]) < a + 0.012), 2].min(initial=np.inf) for a in xb])
    ok = np.isfinite(zc)
    fit = np.polyfit(xb[ok], zc[ok], 2)                         # curva suave (los tramos daban un borde en escalera)
    def z_costal(x): return np.polyval(fit, min(abs(x), xb[ok].max()))
    # Centro delante–detrás de cada corte horizontal del tronco.
    trunk = V[np.abs(V[:, 0]) < 0.08]
    zb = np.linspace(V[:, 2].min(), V[:, 2].max(), 120)
    ym = np.array([(lambda s: (s[:, 1].min() + s[:, 1].max()) / 2 if len(s) else np.nan)(trunk[(trunk[:, 2] >= z - 0.01) & (trunk[:, 2] < z + 0.01)]) for z in zb])
    ok2 = ~np.isnan(ym)
    def y_mid(z): return np.interp(z, zb[ok2], ym[ok2])
    ribs = P('Rib_')
    zr = np.linspace(ribs[:, 2].min(), ribs[:, 2].max(), 40)
    xcage = np.array([np.abs(ribs[(ribs[:, 2] > z - 0.02) & (ribs[:, 2] < z + 0.02), 0]).max(initial=0) for z in zr])
    def x_cage(z): return float(np.interp(z, zr, xcage))

    # Piel como lámina fina (orejas): un rayo hacia dentro vuelve a encontrar piel a menos de 9 mm.
    sk = bvhtree.BVHTree.FromPolygons([tuple(x) for x in V], F)
    def thin(i):
        q = Vector(C[i] - N[i] * 0.0005)
        hit = sk.ray_cast(q, Vector(-N[i]), 0.009)
        return hit[0] is not None
    # Línea de las mejillas para la nariz: «y» de la piel a 2,8–3,4 cm de la línea media, por alturas.
    face = (C[:, 2] > z_mouth - 0.03) & (C[:, 2] < z_eyes + 0.03) & (C[:, 1] < y_teeth + 0.03)
    cheek = C[face & (np.abs(C[:, 0]) > 0.028) & (np.abs(C[:, 0]) < 0.034)]
    zq = np.linspace(z_mouth - 0.02, z_eyes + 0.02, 30)
    yq = np.array([cheek[(cheek[:, 2] > z - 0.004) & (cheek[:, 2] < z + 0.004), 1].mean() if ((cheek[:, 2] > z - 0.004) & (cheek[:, 2] < z + 0.004)).any() else np.nan for z in zq])
    ok3 = ~np.isnan(yq)
    def y_cheek(z): return np.interp(z, zq[ok3], yq[ok3])

    ear_c = {}
    for s, sg in (('L', 1), ('R', -1)):
        e = eye_c.get(s)
        cand = [i for i in np.nonzero((np.sign(C[:, 0]) == sg) & (np.abs(C[:, 0]) > 0.05) & (C[:, 2] > z_mouth - 0.01)
                                      & (C[:, 2] < z_eyes + 0.03) & (C[:, 1] > (e[1] if e is not None else 0) + 0.06))[0] if thin(i)]
        if cand: ear_c[s] = np.median(C[cand], axis=0)

    out = np.empty(len(F), dtype=object)
    for i, (p, n, nb, s) in enumerate(zip(C, N, near, side)):
        x, y, z = p
        # ── Cabeza ──
        if z > z_head(y):
            e = eye_c.get(s)
            if e is not None and np.linalg.norm(p - e) < eye_r[s] + 0.011 and y < e[1] + 0.004:
                out[i] = f'Eyelids_{s}'; continue
            if (x / 0.027) ** 2 + ((z - z_mouth) / 0.016) ** 2 < 1 and y < y_teeth + 0.006:
                out[i] = 'Lips'; continue
            if abs(x) < 0.021 and z_mouth + 0.012 < z < z_eyes + 0.004 and y < y_cheek(z) - 0.006:
                out[i] = 'Nose'; continue
            ec = ear_c.get(s)
            if ec is not None and np.linalg.norm(p - ec) < 0.036 and abs(x) > abs(ec[0]) - 0.016 and (dbone[i] > 0.0095 or thin(i)):
                out[i] = f'Ear_{s}'; continue
            hair = z_eyes + 0.05 - 0.35 * max(abs(x) - 0.03, 0)   # nacimiento del pelo: baja hacia las sienes
            ear_front = (e[1] if e is not None else 0) + 0.07
            out[i] = 'Face' if (y < ear_front and z < hair) else 'Scalp'
            continue
        # ── Miembro superior ──
        if re.match(r'(Humerus|Radius|Ulna|Scaphoid|Lunate|Triquetrum|Pisiform|Trapezi|Capitate|Hamate|Metacarpal|.*Phalanx_Hand)', nb) or \
                (re.match(r'(Scapula|Clavicle)', nb) and np.linalg.norm(p - J[s]['shoulder']) < 0.09):
            j = J[s]
            arm, fore = _unit(j['elbow'] - j['shoulder']), _unit(j['wrist'] - j['elbow'])
            if np.dot(p - j['wrist'], fore) > 0: out[i] = f'Hand_{s}'; continue
            de = np.dot(p - j['elbow'], _unit(arm + fore))
            if abs(de) < 0.035: out[i] = f'Elbow_{s}'; continue
            if de > 0: out[i] = f'Forearm_{s}'; continue
            ds = np.dot(p - j['shoulder'], arm)
            if ds < 0.08:
                medial = abs(x) < abs(j['shoulder'][0]) - 0.02
                out[i] = f'Axilla_{s}' if (medial and n[2] < 0.3 and z < j['shoulder'][2] - 0.03) else f'Shoulder_{s}'
                continue
            out[i] = f'Arm_{s}'; continue
        # ── Miembro inferior ──
        if re.match(r'(Femur|Patella|Tibia|Fibula|Calcaneus|Talus|Navicular|Cuboid|.*Cuneiform|Metatarsal|.*Phalanx_Foot|Sesamoid_Bones_Foot)', nb):
            j = J[s]
            thigh, leg = _unit(j['knee'] - j['hip']), _unit(j['ankle'] - j['knee'])
            if np.dot(p - j['ankle'], leg) > -0.01 and z < j['ankle'][2] + 0.03: out[i] = f'Foot_{s}'; continue
            dk = np.dot(p - j['knee'], _unit(thigh + leg))
            if abs(dk) < 0.045: out[i] = f'Knee_{s}'; continue
            if dk > 0: out[i] = f'Leg_{s}'; continue
            back = y > y_mid(z)
            if back and z > z_fold: out[i] = f'Buttock_{s}'; continue
            if not back and not below_inguinal(p): out[i] = 'Abdomen'; continue
            out[i] = f'Thigh_{s}'; continue
        # ── Cuello ──
        if z > z_neck(y):
            out[i] = 'Neck' if abs(x) < 0.075 else f'Shoulder_{s}'; continue
        # ── Axila (entre la pared del tórax y el brazo) ──
        j = J[s]
        if j['shoulder'][2] - 0.13 < z < j['shoulder'][2] - 0.02 and abs(x) > x_cage(z) - 0.01 and abs(y - j['shoulder'][1]) < 0.045 \
                and n[2] < 0.1 and abs(n[1]) < 0.6:                 # la piel del hueco mira hacia abajo o de lado, no delante ni detrás
            out[i] = f'Axilla_{s}'; continue
        # ── Tronco ──
        back = y > y_mid(z)
        if back:
            if z > z_lumbar_top: out[i] = 'Back'
            elif z > z_crest: out[i] = 'Lumbar'
            elif z > z_fold: out[i] = f'Buttock_{s}'
            else: out[i] = 'Perineum' if abs(x) < 0.05 else f'Thigh_{s}'
            continue
        if z < z_pubis_low and abs(x) < 0.05: out[i] = 'Perineum'; continue
        if below_inguinal(p) and abs(x) > abs(tub[0]): out[i] = f'Thigh_{s}'; continue
        out[i] = 'Chest' if z > z_costal(x) else 'Abdomen'

    # Mama (solo en el modelo femenino): alrededor del punto más anterior del pecho de cada lado.
    if female:
        for s, sg in (('L', 1), ('R', -1)):
            m = (out == 'Chest') & (np.sign(C[:, 0]) == sg)
            nip = C[m][np.argmin(C[m][:, 1])]
            out[m & (np.linalg.norm(C - nip, axis=1) < 0.085)] = f'Breast_{s}'

    # Filtro de mayoría entre caras vecinas (cuatro pasadas): quita islas sueltas y suaviza los bordes.
    vf = [[] for _ in range(len(V))]
    for fi, f in enumerate(F):
        for v in f: vf[v].append(fi)
    for _ in range(4):
        new = out.copy()
        for fi, f in enumerate(F):
            cnt = {}
            for v in f:
                for g in vf[v]: cnt[out[g]] = cnt.get(out[g], 0) + 1
            best = max(cnt, key=cnt.get)
            if best != out[fi] and cnt[best] > cnt.get(out[fi], 0) * 1.5: new[fi] = best
        out = new
    # Cada zona, un solo trozo: los fragmentos sueltos (p. ej. piel del muslo junto a los dedos, cuyo hueso más cercano es
    # una falange) pasan a la zona que más los rodea.
    adj = [set() for _ in range(len(F))]
    edge_faces = {}
    for fi, f in enumerate(F):
        for a, b in zip(f, f[1:] + f[:1]):
            edge_faces.setdefault((min(a, b), max(a, b)), []).append(fi)
    for fs in edge_faces.values():
        for a in fs:
            adj[a].update(x for x in fs if x != a)
    for _ in range(6):
        comp = -np.ones(len(F), dtype=int); comps = []
        for start in range(len(F)):
            if comp[start] >= 0: continue
            stack, members = [start], []
            comp[start] = len(comps)
            while stack:
                f0 = stack.pop(); members.append(f0)
                for g in adj[f0]:
                    if comp[g] < 0 and out[g] == out[start]: comp[g] = len(comps); stack.append(g)
            comps.append(members)
        biggest = {}
        for ci, m in enumerate(comps):
            lab = out[m[0]]
            if lab not in biggest or len(m) > len(comps[biggest[lab]]): biggest[lab] = ci
        changed = 0
        for ci, m in enumerate(comps):
            if biggest[out[m[0]]] == ci: continue
            cnt = {}
            for f0 in m:
                for g in adj[f0]:
                    if comp[g] != ci: cnt[out[g]] = cnt.get(out[g], 0) + 1
            if cnt:
                new = max(cnt, key=cnt.get)
                for f0 in m: out[f0] = new
                changed += 1
        if not changed: break
    return out


def split(skin, labels):
    """Pasa cada zona a su objeto (Skin_<Zona>[_L|_R]) en la colección de su grupo, con las normales de la piel entera.
    Devuelve los objetos creados; la piel original se borra."""
    import bpy
    me = skin.data
    normals = np.array([v.normal[:] for v in me.vertices])
    me.attributes.new('orig_index', 'INT', 'POINT').data.foreach_set('value', np.arange(len(me.vertices), dtype=np.int32))
    parent = skin.users_collection[0]
    made = []
    for lab in sorted(set(labels)):
        base = re.sub(r'_[LR]$', '', lab)
        en, es, la, ta2, group = REGIONS[base]
        coll = bpy.data.collections.get(group)
        if coll is None:
            coll = bpy.data.collections.new(group); parent.children.link(coll)
        part = skin.copy(); part.data = me.copy(); part.name = part.data.name = f'Skin_{lab}'
        coll.objects.link(part)
        bm = bmesh.new(); bm.from_mesh(part.data); bm.faces.ensure_lookup_table()
        bmesh.ops.delete(bm, geom=[bm.faces[i] for i in np.nonzero(labels != lab)[0]], context='FACES')
        bm.to_mesh(part.data); bm.free()
        idx = np.empty(len(part.data.vertices), dtype=np.int32); part.data.attributes['orig_index'].data.foreach_get('value', idx)
        part.data.attributes.remove(part.data.attributes['orig_index'])
        part.data.normals_split_custom_set_from_vertices([tuple(n) for n in normals[idx]])
        sid = lab[-1] if lab[-2:] in ('_L', '_R') else None
        for k, v in {'anato3d_id': f'integument_skin_{lab.lower()}', 'system': 'integumentary', 'subsystem': 'skin', 'tissue': 'skin',
                     'name_en': en, 'name_es': es, 'name_la': la, 'ta2': ta2}.items():
            part[k] = v
        made.append(part)
    bpy.data.objects.remove(skin)
    return made
