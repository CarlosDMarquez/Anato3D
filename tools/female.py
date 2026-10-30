"""Modelo femenino: el esqueleto masculino llevado al cuerpo de la mujer.

Z-Anatomy (BodyParts3D) es un cuerpo masculino y no hay en datos abiertos un esqueleto femenino con la misma estructura.
Pero la piel femenina de MakeHuman tiene la misma malla que la masculina, vértice a vértice: se sabe a dónde va cada
punto de la piel del hombre en la mujer.

Cómo:
  - Un campo de desplazamiento en el volumen (musculature.Field, armónico) lleva la piel masculina a la femenina. Se
    calcula sobre la piel y los huesos masculinos tal como quedan tras corregir el cuello y las extremidades, que son las
    mismas correcciones que recibe la piel femenina. Antes de subir los hombros y de la complexión musculosa, que son
    solo del hombre.
  - El desplazamiento de la piel que mueve los huesos no lleva las mamas y está suavizado (breastless): los huesos siguen
    la forma general del cuerpo, no la grasa local.
  - Cada hueso pasa a ser la transformación afín que mejor sigue a ese campo (mínimos cuadrados); los huesos largos, una
    por trozo de ~6 cm (female_bone). Así sigue siendo una transformación afín de Z-Anatomy, como en el hombre, y el
    ajuste de anato3d_fit.py lleva músculos, vasos, nervios y vísceras de Z-Anatomy al esqueleto femenino igual que al
    masculino.
  - Los tramos de los huesos largos («segments», en coordenadas de mundo) se mueven con su hueso.
  - La pelvis, el sacro y el tórax toman las proporciones de la piel femenina (más ancha de cadera, más estrecha de
    hombros), no la forma propia de la pelvis femenina: es un primer paso.
"""
import json
import numpy as np


def breastless(F, M, faces, iterations=300, smooth=40):
    """Desplazamiento piel masculina → femenina para mover los huesos: sin las mamas y suavizado.
      - En la zona de cada mama se sustituye por la interpolación suave (Laplace sobre la malla) de su contorno. Si no,
        el campo empujaba el tórax hacia delante y doblaba las costillas 5–8 (hasta 12 mm de error afín).
      - Después se suaviza `smooth` pasadas sobre la malla (~9 cm): los huesos siguen la forma general del cuerpo, no la
        grasa local; sin ello, la tibia se cizallaba hasta 2 cm entre su borde anterior, junto a la piel, y el resto."""
    D = F - M
    E = np.concatenate([np.c_[f, np.roll(f, -1)] for f in (np.array(x) for x in faces)])
    n = len(F)
    mask = np.zeros(n, bool)
    for side in (1, -1):
        chest = (np.sign(F[:, 0]) == side) & (F[:, 2] > F[:, 2].max() * 0.66) & (F[:, 2] < F[:, 2].max() * 0.84)
        nipple = F[chest][np.argmin(F[chest][:, 1])]                # lo más anterior del tórax de ese lado
        mask |= (np.sign(F[:, 0]) == side) & (np.linalg.norm(F - nipple, axis=1) < 0.1) & (F[:, 1] < nipple[1] + 0.06)
    deg = np.maximum(np.bincount(E.ravel(), minlength=n), 1)[:, None]
    out = D.copy()
    for _ in range(iterations):
        acc = np.zeros_like(out); np.add.at(acc, E[:, 0], out[E[:, 1]]); np.add.at(acc, E[:, 1], out[E[:, 0]])
        out[mask] = (acc / deg)[mask]
    for _ in range(smooth):
        acc = np.zeros_like(out); np.add.at(acc, E[:, 0], out[E[:, 1]]); np.add.at(acc, E[:, 1], out[E[:, 0]])
        out = 0.5 * out + 0.5 * acc / deg
    return out, int(mask.sum())


def female_bone(field, P, seg_json, blend=0.005, piece=0.06):
    """Vértices del hueso en la mujer y sus tramos. Siempre transformaciones afines (así cada tramo sigue siendo una
    transformación afín de Z-Anatomy y anato3d_fit.py lo usa para el ajuste): una por hueso, o en los huesos largos una
    por trozo de ~`piece` (en el fémur, una sola dejaba 28 mm de error; una por tramo masculino, hasta 15 mm dentro del
    tramo), unidas con una transición de ±`blend` en cada nudo. Los trozos no cruzan los nudos masculinos: dentro de
    cada uno el hueso masculino ya es una sola transformación de Z-Anatomy."""
    T = P + field.sample(P)
    X = np.c_[P, np.ones(len(P))]
    A0, *_ = np.linalg.lstsq(X, T, rcond=None)
    if not seg_json:
        return X @ A0, float(np.linalg.norm(X @ A0 - T, axis=1).max()), None
    seg = json.loads(seg_json)
    o, a, male_knots = np.array(seg['origin']), np.array(seg['axis']), np.array(seg['knots'])
    z = (P - o) @ a
    bounds = np.r_[z.min(), male_knots[(male_knots > z.min()) & (male_knots < z.max())], z.max()]
    knots = list(male_knots)
    for lo, hi in zip(bounds[:-1], bounds[1:]):
        n = int(np.ceil((hi - lo) / piece))
        knots += list(np.linspace(lo, hi, n + 1)[1:-1])
    knots = np.array(sorted(knots))
    lab = np.searchsorted(knots, z)
    A = {}
    for j in np.unique(lab):
        sel = lab == j
        A[j] = np.linalg.lstsq(X[sel], T[sel], rcond=None)[0] if sel.sum() >= 30 else A0
    # Pesos por tramo, con transición suave en cada nudo.
    ids = sorted(A)
    W = np.zeros((len(P), len(ids)))
    for c, j in enumerate(ids):
        lo = knots[j - 1] if j > 0 else -np.inf
        hi = knots[j] if j < len(knots) else np.inf
        W[:, c] = np.clip((z - lo) / (2 * blend) + 0.5, 0, 1) * np.clip((hi - z) / (2 * blend) + 0.5, 0, 1)
    W /= np.maximum(W.sum(1, keepdims=True), 1e-9)
    out = sum(W[:, [c]] * (X @ A[j]) for c, j in enumerate(ids))
    # Tramos en la mujer: origen y eje con la transformación global; cada nudo, con la de sus tramos vecinos.
    o2 = np.r_[o, 1] @ A0
    a2 = a @ A0[:3]; a2 /= np.linalg.norm(a2)
    k2 = []
    for j, k in enumerate(knots):
        Aj = (A.get(j, A0) + A.get(j + 1, A0)) / 2
        k2.append(float((np.r_[o + k * a, 1] @ Aj - o2) @ a2))
    seg2 = json.dumps({'origin': [round(float(x), 6) for x in o2], 'axis': [round(float(x), 6) for x in a2],
                       'knots': [round(k, 6) for k in k2]})
    return out, float(np.linalg.norm(out - T, axis=1).max()), seg2


def apply_affine(A, P):
    return np.c_[P, np.ones(len(P))] @ A
