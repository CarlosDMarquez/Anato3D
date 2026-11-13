---
title: Fuentes de las fichas linfáticas del miembro superior
date: 2026-11-12
---

# Fuentes de las fichas linfáticas del miembro superior (2026-11-12)

Qué fuente respalda cada frase de las fichas de los nodos del miembro superior y de la axila (`web/src/data/linfatico/miembro-superior.js`, grupo `Lymph_nodes_of_upper_limb`): axilares anteriores, posteriores, laterales, centrales y apicales, interpectorales, infraclaviculares (deltopectorales), braquiales, cubitales y supratrocleares. Diez fichas, una por clave sin lado; cada una sirve a las piezas `_L` y `_R` de los dos modelos (hombre y mujer).

Todo es **borrador** redactado con IA (Claude) a partir de las fuentes citadas, **sin revisión de un especialista**.

## Cómo se comprobó

1. Páginas bajadas con `node scripts/linfatico-citas.mjs bajar …` (Wikipedia en inglés, CC BY-SA 4.0; texto plano de la API, sin recuadros ni pies de imagen) y registradas con su revisión en `web/src/data/linfatico/comprobadas.js`. Varias incorporan texto de dominio público del Gray de 1918 (*Apical*, *Central*, *Brachial*, *Deltopectoral* y *Supratrochlear lymph nodes*).
2. `node scripts/linfatico-citas.mjs comprobar`: 104 citas de estas fichas en 12 páginas, todas encontradas palabra por palabra (467 en total con las demás regiones, 0 sin encontrar).
3. `node scripts/check-cards.mjs`: «todo correcto»; 4 avisos de campos pendientes en `Brachial_nodes`.
4. TeachMeAnatomy no se cita. Las frases *Modelo 3D* describen el modelo de Anato3D.

## Trampas de nomenclatura

- El Gray de 1918, y con él la Wikipedia inglesa, llama **«brachial glands / brachial lymph nodes»** al grupo axilar **lateral**, y **«subclavicular»** (o «medial») al **apical**. La TA2 distingue *Nodi brachiales* (5244) de *Nodi axillares laterales; nodi humerales* (5239). Por eso las citas de la página *Brachial lymph nodes* respaldan la ficha `Lateral_axillary_nodes`, no `Brachial_nodes`.
- La TA2 separa los nodos cubitales (5245) de los supratrocleares (5246); la Wikipedia (*Elbow*) llama «epitrocleares» a los cubitales y dice que hay un grupo superficial y otro profundo.
- La página *Central lymph nodes* (revisión 1384202649) mezcla en una frase los nodos centrales del cuello («groove between the Esophagus, Trachea, and Thyroid»): esa frase no se cita.
- Latín: `latinLinf` corrige «latérales» y separa con «;» los sinónimos de la TA (*nodi pectorales*, *subscapulares*, *humerales*, *deltopectorales*). La propia TA2.csv trae «latérales».

## Contraste con la tabla de drenaje del encargo

Confirmadas por las fuentes:
- Axila: lateral, anterior y posterior → central → apical → tronco subclavio → a la derecha, conducto linfático derecho; a la izquierda, conducto torácico o directamente en una vena (*Axillary lymph nodes*, *Central*, *Apical lymph nodes*).
- Colectores superficiales junto a la basílica → supratrocleares (*Supratrochlear lymph nodes*: «medial to the basilic vein», «Their efferents accompany the basilic vein»).
- Junto a la cefálica → infraclaviculares (deltopectorales) → apicales (*Deltopectoral lymph nodes*: «in the course of the external collecting trunks of the arm»; *Apical*: «Its only direct territorial afferents are those that accompany the cephalic vein»). La segunda flecha es una deducción de esas dos citas: ninguna fuente dice expresamente adónde van los eferentes de los infraclaviculares.
- Cubitales → axilares laterales (*Elbow*: «The efferent lymph vessels from the elbow proceed to the lateral group of axillary lymph nodes»).

Matizadas:
- «Supratrochlear → Lateral_axillary»: la fuente dice que sus eferentes «join the deeper vessels»; no nombra el grupo axilar. Las vías de la ficha llevan a los colectores profundos.
- «Lateral → Central»: además, parte de sus eferentes van directos a los apicales y a los cervicales profundos inferiores (*Brachial lymph nodes*: «pass partly to the central and subclavicular groups … and partly to the inferior deep cervical glands»). Lo mismo para unos pocos eferentes apicales (*Apical lymph nodes*).
- «Interpectoral → Apical_axillary»: la fuente dice solo «deliver lymphatic fluid to the axillary lymphatic plexus» (*Rotter's lymph nodes*). No se pone vía a un grupo concreto.
- Los apicales reciben también, directamente, un vaso de la parte periférica superior de la mama (*Apical lymph nodes*).

Sin fuente libre:
- «Colectores profundos junto a los vasos radiales, cubitales y braquiales → Brachial → Lateral_axillary»: ninguna página libre describe los nodos braquiales de la TA2 (su posición, aferentes ni eferentes). La ficha deja esos cuatro campos en `pendientes`.

Contradicciones: ninguna.

## Posición de los nodos en el modelo publicado (ganglios nuevos, 12 nov 2026)

La tabla anterior de esta sección medía las esferas de Z-Anatomy de antes de la reconstrucción del sistema linfático y ya no vale. Ahora cada nodo es un ganglio ovalado de tamaño esquemático colocado con las reglas de `docs/hitos/09-sistema-linfatico.md`. Las relaciones medidas en el modelo construido (`build/linfatico/relaciones-<modelo>.json`; cumplen / total, hombre · mujer):

| Grupo | Regla medida | Hombre | Mujer |
|---|---|---|---|
| Axilares laterales | a ≤ 8 mm de la vena axilar | 4/4 | 4/4 |
| Axilares apicales | a ≤ 10 mm de la axilar o la subclavia | 4/4 | 4/4 |
| Axilares anteriores | a ≤ 10 mm de los vasos torácicos laterales | 12/12 | 12/12 |
| Axilares posteriores | a ≤ 12 mm de los subescapulares | 12/12 | 12/12 |
| Axilares centrales | a ≤ 30 mm de la vena axilar, en la grasa | 4/4 | 4/4 |
| Supratrocleares | 0–80 mm por encima del epicóndilo medial y a ≤ 8 mm de la basílica | 10/10 | 10/10 |
| Cubitales | junto a la basílica y a la altura del epicóndilo medial (en el hombre, un nodo por lado queda 65 mm por debajo del epicóndilo) | 10/12 | 12/12 |

- Los supratrocleares se recolocaron por encima del epicóndilo medial (recolocación de grupo declarada en el hito); su ficha lo dice en «En este modelo».
- `Brachial_nodes` no tiene regla medida porque ninguna fuente libre dice dónde están; su posición viene de Z-Anatomy.
- Las rutas generadas (`web/src/data/linfatico-rutas.js`) marcan «braquiales → axilares laterales» como *documentado*, pero la ficha no tiene fuente para esa vía (ver «Sin fuente libre»).

## Páginas citadas

- [Apical lymph nodes](https://en.wikipedia.org/w/index.php?title=Apical_lymph_nodes&oldid=1224153102) · revisión 1224153102 (2024-05-16), consultada 2026-11-12, CC BY-SA 4.0
- [Axilla](https://en.wikipedia.org/w/index.php?title=Axilla&oldid=1384020168) · revisión 1384020168 (2026-11-06), consultada 2026-11-12, CC BY-SA 4.0
- [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830) · revisión 1301012830 (2025-07-17), consultada 2026-11-09, CC BY-SA 4.0
- [Brachial lymph nodes](https://en.wikipedia.org/w/index.php?title=Brachial_lymph_nodes&oldid=1224152961) · revisión 1224152961 (2024-05-16), consultada 2026-11-12, CC BY-SA 4.0
- [Central lymph nodes](https://en.wikipedia.org/w/index.php?title=Central_lymph_nodes&oldid=1384202649) · revisión 1384202649 (2026-11-07), consultada 2026-11-12, CC BY-SA 4.0
- [Cephalic vein](https://en.wikipedia.org/w/index.php?title=Cephalic_vein&oldid=1375572338) · revisión 1375572338 (2026-09-18), consultada 2026-11-09, CC BY-SA 4.0
- [Deltopectoral lymph nodes](https://en.wikipedia.org/w/index.php?title=Deltopectoral_lymph_nodes&oldid=1224153162) · revisión 1224153162 (2024-05-16), consultada 2026-11-12, CC BY-SA 4.0
- [Elbow](https://en.wikipedia.org/w/index.php?title=Elbow&oldid=1380372262) · revisión 1380372262 (2026-10-15), consultada 2026-11-09, CC BY-SA 4.0
- [List of lymph nodes of the human body](https://en.wikipedia.org/w/index.php?title=List_of_lymph_nodes_of_the_human_body&oldid=1321358933) · revisión 1321358933 (2025-11-10), consultada 2026-11-10, CC BY-SA 4.0
- [Lymphedema](https://en.wikipedia.org/w/index.php?title=Lymphedema&oldid=1382679430) · revisión 1382679430 (2026-10-29), consultada 2026-11-12, CC BY-SA 4.0
- [Rotter's lymph nodes](https://en.wikipedia.org/w/index.php?title=Rotter's_lymph_nodes&oldid=1277665395) · revisión 1277665395 (2025-02-26), consultada 2026-11-12, CC BY-SA 4.0
- [Supratrochlear lymph nodes](https://en.wikipedia.org/w/index.php?title=Supratrochlear_lymph_nodes&oldid=1383412698) · revisión 1383412698 (2026-11-02), consultada 2026-11-12, CC BY-SA 4.0

## Fichas

### Nodos axilares anteriores (`Anterior_axillary_nodes`)

Nombre: TA2 n.º 5241 (*Nodi axillares anteriores nodi pectorales*; Anterior axillary nodes).

- **Descripción.** Grupo anterior o pectoral de los nodos (ganglios) axilares.
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “Anterior (pectoral) group”
  - TA2 n.º 5241: Anterior axillary nodes (*Nodi axillares anteriores nodi pectorales*)
- **Descripción.** Los nodos axilares son entre 20 y 49 y se dividen en grupos según su posición en la axila.
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “Between 20 and 49 in number”
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “They are divided in several groups according to their location in the armpit.”
  - TA2 n.º 5236: Axillary nodes (*Nodi axillares*)
- **Localización.** Están a lo largo del borde inferior del pectoral menor, por detrás del pectoral mayor.
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “Lying along the lower border of the pectoralis minor behind the pectoralis major”
- **Reparo.** El borde inferior del músculo pectoral menor.
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “Lying along the lower border of the pectoralis minor”
- **Recibe.** Reciben los vasos linfáticos de los cuadrantes laterales de la mama.
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “these nodes receive lymph vessels from the lateral quadrants of the breast”
- **Recibe.** También les llegan los vasos superficiales de la pared anterolateral del abdomen situada por encima del ombligo.
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “superficial vessels from the anterolateral abdominal wall above the level of the umbilicus”
- **Drena en.** Su linfa va a los nodos axilares centrales, que reciben la de los grupos lateral, anterior y posterior.
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “these nodes receive lymph from the above three groups”
  - [Central lymph nodes](https://en.wikipedia.org/w/index.php?title=Central_lymph_nodes&oldid=1384202649): “Its afferent lymphatic vessels are the efferent vessels of all the preceding groups of axillary lymph nodes”
- **Drena en.** Los nodos axilares apicales reciben los eferentes de todos los demás grupos axilares.
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “these nodes receive the efferent lymph vessels from all the other axillary nodes”
  - [Apical lymph nodes](https://en.wikipedia.org/w/index.php?title=Apical_lymph_nodes&oldid=1224153102): “However, it receives the efferents of all the other axillary glands.”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** El latín del modelo pone el sinónimo de la TA2, «nodi pectorales», tras punto y coma.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **Nota.** Alrededor del 75 % de la linfa de la mama drena en los nodos axilares, que por eso importan en el diagnóstico y la estadificación del cáncer de mama.
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “About 75% of lymph from the breasts drains into the axillary lymph nodes, making them important in the diagnosis and staging of breast cancer.”
- Vías en la app: recibe —; drena en `Central_axillary_nodes`, `Apical_axillary_nodes`.

### Nodos axilares posteriores (`Posterior_axillary_nodes`)

Nombre: TA2 n.º 5240 (*Nodi axillares posteriores nodi subscapulares*; Posterior axillary nodes).

- **Descripción.** Grupo posterior o subescapular de los nodos (ganglios) axilares.
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “Posterior (subscapular) group”
  - TA2 n.º 5240: Posterior axillary nodes (*Nodi axillares posteriores nodi subscapulares*)
- **Descripción.** Los nodos axilares son entre 20 y 49 y se dividen en grupos según su posición en la axila.
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “Between 20 and 49 in number”
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “They are divided in several groups according to their location in the armpit.”
  - TA2 n.º 5236: Axillary nodes (*Nodi axillares*)
- **Localización.** Están por delante del músculo subescapular, que forma la pared posterior de la axila junto con el redondo mayor y el dorsal ancho.
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “Lying in front of the subscapularis muscle”
  - [Axilla](https://en.wikipedia.org/w/index.php?title=Axilla&oldid=1384020168): “posteriorly by the subscapularis, teres major and latissimus dorsi muscle”
- **Reparo.** El músculo subescapular, por detrás de ellos.
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “Lying in front of the subscapularis muscle”
- **Recibe.** Reciben los vasos linfáticos superficiales de la espalda, hasta la altura de las crestas ilíacas.
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “these nodes receive superficial lymph vessels from the back, down as far as the level of the iliac crests”
- **Drena en.** Su linfa va a los nodos axilares centrales, que reciben la de los grupos lateral, anterior y posterior.
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “these nodes receive lymph from the above three groups”
  - [Central lymph nodes](https://en.wikipedia.org/w/index.php?title=Central_lymph_nodes&oldid=1384202649): “Its afferent lymphatic vessels are the efferent vessels of all the preceding groups of axillary lymph nodes”
- **Drena en.** Los nodos axilares apicales reciben los eferentes de todos los demás grupos axilares.
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “these nodes receive the efferent lymph vessels from all the other axillary nodes”
  - [Apical lymph nodes](https://en.wikipedia.org/w/index.php?title=Apical_lymph_nodes&oldid=1224153102): “However, it receives the efferents of all the other axillary glands.”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** El latín del modelo pone el sinónimo de la TA2, «nodi subscapulares», tras punto y coma.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe —; drena en `Central_axillary_nodes`, `Apical_axillary_nodes`.

### Nodos axilares laterales (`Lateral_axillary_nodes`)

Nombre: TA2 n.º 5239 (*Nodi axillares latérales nodi humerales*; Lateral axillary nodes).

- **Descripción.** Grupo lateral de los nodos (ganglios) axilares, llamados también nodos humerales.
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “Lateral group”
  - TA2 n.º 5239: Lateral axillary nodes (*Nodi axillares latérales nodi humerales*)
- **Descripción.** Son de cuatro a seis nodos.
  - [Brachial lymph nodes](https://en.wikipedia.org/w/index.php?title=Brachial_lymph_nodes&oldid=1224152961): “group of four to six lymph nodes”
- **Descripción.** La Wikipedia inglesa, que sigue el texto del Gray de 1918, llama a este grupo «brachial lymph nodes»; en la TA2, «nodos braquiales» es otro grupo.
  - [Brachial lymph nodes](https://en.wikipedia.org/w/index.php?title=Brachial_lymph_nodes&oldid=1224152961): “A brachial lymph nodes (or lateral group)”
  - [Brachial lymph nodes](https://en.wikipedia.org/w/index.php?title=Brachial_lymph_nodes&oldid=1224152961): “incorporates text in the public domain from the 20th edition of Gray”
  - TA2 n.º 5244: Brachial nodes (*Nodi brachiales*)
- **Localización.** Están a lo largo del lado medial de la vena axilar, en relación con sus caras medial y posterior.
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “Lying along the medial side of the axillary vein”
  - [Brachial lymph nodes](https://en.wikipedia.org/w/index.php?title=Brachial_lymph_nodes&oldid=1224152961): “which lies in relation to the medial and posterior aspects of the axillary vein”
- **Reparo.** La vena axilar: los nodos quedan por dentro y por detrás de ella.
  - [Brachial lymph nodes](https://en.wikipedia.org/w/index.php?title=Brachial_lymph_nodes&oldid=1224152961): “which lies in relation to the medial and posterior aspects of the axillary vein”
- **Recibe.** Reciben la mayoría de los vasos linfáticos del miembro superior.
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “these nodes receive most of the lymph vessels of the upper limb”
- **Recibe.** Se exceptúan los vasos superficiales del lado lateral, que acompañan a la vena cefálica y van a los nodos infraclaviculares.
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “except those superficial vessels draining the lateral side—see infraclavicular nodes, below”
  - [Brachial lymph nodes](https://en.wikipedia.org/w/index.php?title=Brachial_lymph_nodes&oldid=1224152961): “with the exception of that portion whose vessels accompany the cephalic vein”
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “receive superficial lymph vessels from the lateral side of the hand, forearm, and arm”
- **Recibe.** Les llegan los vasos eferentes de los nodos del codo.
  - [Elbow](https://en.wikipedia.org/w/index.php?title=Elbow&oldid=1380372262): “The efferent lymph vessels from the elbow proceed to the lateral group of axillary lymph nodes.”
- **Drena en.** Sus eferentes van en parte a los nodos axilares centrales y apicales (subclaviculares) y en parte a los nodos cervicales profundos inferiores.
  - [Brachial lymph nodes](https://en.wikipedia.org/w/index.php?title=Brachial_lymph_nodes&oldid=1224152961): “The efferent vessels pass partly to the central and subclavicular groups of axillary glands and partly to the inferior deep cervical glands.”
  - [Apical lymph nodes](https://en.wikipedia.org/w/index.php?title=Apical_lymph_nodes&oldid=1224153102): “An apical (or medial or subclavicular) group”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** El latín heredado de Z-Anatomy decía «latérales», con tilde francesa; aquí se escribe «laterales» y el sinónimo «nodi humerales» va tras punto y coma.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **Nota.** En las mujeres, el linfedema es más frecuente en un miembro superior tras la cirugía del cáncer de mama, sobre todo tras la disección de los nodos axilares.
  - [Lymphedema](https://en.wikipedia.org/w/index.php?title=Lymphedema&oldid=1382679430): “In women, it is most prevalent in an upper limb after breast cancer surgery, especially axillary lymph node dissection”
- Vías en la app: recibe `Cubital_nodes`, `Deep_lymphatic_vessels_of_upper_limb`, `Superficial_lymphatic_vessels_of_upper_limb`; drena en `Central_axillary_nodes`, `Apical_axillary_nodes`, `Inferior_deep_lateral_cervical_nodes`.

### Nodos axilares centrales (`Central_axillary_nodes`)

Nombre: TA2 n.º 5238 (*Nodi axillares centrales*; Central axillary nodes).

- **Descripción.** Grupo central o intermedio de los nodos (ganglios) axilares: tres o cuatro nodos grandes.
  - [Central lymph nodes](https://en.wikipedia.org/w/index.php?title=Central_lymph_nodes&oldid=1384202649): “The central lymph nodes or intermediate group of lymph nodes are three or four large lymph nodes”
  - TA2 n.º 5238: Central axillary nodes (*Nodi axillares centrales*)
- **Descripción.** Los nodos axilares son entre 20 y 49 y se dividen en grupos según su posición en la axila.
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “Between 20 and 49 in number”
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “They are divided in several groups according to their location in the armpit.”
  - TA2 n.º 5236: Axillary nodes (*Nodi axillares*)
- **Localización.** Están en el centro de la axila, metidos en la grasa axilar, cerca de la base de la axila.
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “Lying in the center of the axilla in the axillary fat”
  - [Central lymph nodes](https://en.wikipedia.org/w/index.php?title=Central_lymph_nodes&oldid=1384202649): “imbedded in the adipose tissue near the base of the axilla”
- **Reparo.** El centro del hueco axilar, limitado por los músculos pectorales por delante, el subescapular, el redondo mayor y el dorsal ancho por detrás y el serrato anterior por dentro.
  - [Axilla](https://en.wikipedia.org/w/index.php?title=Axilla&oldid=1384020168): “medially by the serratus anterior muscle and thoracolumbar fascia, anteriorly by the pectoral muscles and posteriorly by the subscapularis, teres major and latissimus dorsi muscle”
- **Recibe.** Reciben la linfa de los grupos axilares lateral, anterior y posterior.
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “these nodes receive lymph from the above three groups”
  - [Central lymph nodes](https://en.wikipedia.org/w/index.php?title=Central_lymph_nodes&oldid=1384202649): “Its afferent lymphatic vessels are the efferent vessels of all the preceding groups of axillary lymph nodes”
- **Drena en.** Sus eferentes van a los nodos axilares apicales, llamados también subclaviculares.
  - [Central lymph nodes](https://en.wikipedia.org/w/index.php?title=Central_lymph_nodes&oldid=1384202649): “its efferents pass to the subclavicular group”
  - [Apical lymph nodes](https://en.wikipedia.org/w/index.php?title=Apical_lymph_nodes&oldid=1224153102): “An apical (or medial or subclavicular) group”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe `Lateral_axillary_nodes`, `Anterior_axillary_nodes`, `Posterior_axillary_nodes`; drena en `Apical_axillary_nodes`.

### Nodos axilares apicales (`Apical_axillary_nodes`)

Nombre: TA2 n.º 5237 (*Nodi axillares apicales*; Apical axillary nodes).

- **Descripción.** Grupo apical de los nodos (ganglios) axilares, llamado también medial o subclavicular: de seis a doce nodos.
  - [Apical lymph nodes](https://en.wikipedia.org/w/index.php?title=Apical_lymph_nodes&oldid=1224153102): “An apical (or medial or subclavicular) group of six to twelve glands”
  - TA2 n.º 5237: Apical axillary nodes (*Nodi axillares apicales*)
- **Descripción.** Es la última estación de la axila: le llegan los eferentes de todos los demás grupos axilares.
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “these nodes receive the efferent lymph vessels from all the other axillary nodes”
- **Localización.** Están en el vértice de la axila, en el borde lateral de la primera costilla.
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “Lying at the apex of the axilla at the lateral border of the 1st rib”
- **Localización.** Quedan en parte por detrás de la porción superior del pectoral menor y en parte por encima de su borde superior.
  - [Apical lymph nodes](https://en.wikipedia.org/w/index.php?title=Apical_lymph_nodes&oldid=1224153102): “is situated partly posterior to the upper portion of the pectoralis minor and partly above the upper border of this muscle”
- **Reparo.** El borde superior del pectoral menor y el borde lateral de la primera costilla.
  - [Apical lymph nodes](https://en.wikipedia.org/w/index.php?title=Apical_lymph_nodes&oldid=1224153102): “partly above the upper border of this muscle”
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “at the lateral border of the 1st rib”
- **Recibe.** Reciben los eferentes de todos los demás nodos axilares.
  - [Apical lymph nodes](https://en.wikipedia.org/w/index.php?title=Apical_lymph_nodes&oldid=1224153102): “However, it receives the efferents of all the other axillary glands.”
- **Recibe.** Sus únicas aferencias directas desde un territorio son los vasos que acompañan a la vena cefálica y uno que drena la parte periférica superior de la mama.
  - [Apical lymph nodes](https://en.wikipedia.org/w/index.php?title=Apical_lymph_nodes&oldid=1224153102): “Its only direct territorial afferents are those that accompany the cephalic vein, and one that drains the upper peripheral part of the mamma.”
- **Drena en.** Sus eferentes se unen y forman el tronco subclavio.
  - [Apical lymph nodes](https://en.wikipedia.org/w/index.php?title=Apical_lymph_nodes&oldid=1224153102): “The efferent vessels of the subclavicular group unite to form the subclavian trunk”
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “The apical nodes drain into the subclavian lymph trunk.”
- **Drena en.** Unos pocos eferentes suelen ir a los nodos cervicales profundos inferiores.
  - [Apical lymph nodes](https://en.wikipedia.org/w/index.php?title=Apical_lymph_nodes&oldid=1224153102): “A few efferents from the subclavicular glands usually pass to the inferior deep cervical glands.”
- **Drena en.** El tronco subclavio desemboca a la izquierda en el conducto torácico y a la derecha en el conducto linfático derecho, o bien directamente en una de las grandes venas de la raíz del cuello.
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “On the left side, this trunk drains into the thoracic duct; on the right side, it drains into the right lymphatic duct.”
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “Alternatively, the lymph trunks may drain directly into one of the large veins at the root of the neck.”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe `Lateral_axillary_nodes`, `Anterior_axillary_nodes`, `Posterior_axillary_nodes`, `Central_axillary_nodes`, `Infraclavicular_nodes`; drena en `Subclavian_trunk`, `Inferior_deep_lateral_cervical_nodes`.

### Nodos interpectorales (`Interpectoral_nodes`)

Nombre: TA2 n.º 5242 (*Nodi interpectorales*; Interpectoral nodes).

- **Descripción.** Nodos (ganglios) pequeños situados entre el pectoral mayor y el pectoral menor, llamados también nodos de Rotter.
  - [Rotter's lymph nodes](https://en.wikipedia.org/w/index.php?title=Rotter's_lymph_nodes&oldid=1277665395): “Rotter's lymph nodes are small interpectoral lymph nodes located between the pectoralis major and pectoralis minor muscles”
  - TA2 n.º 5242: Interpectoral nodes (*Nodi interpectorales*)
- **Descripción.** Llevan el nombre del cirujano alemán Josef Rotter, que los describió a finales del siglo XIX.
  - [Rotter's lymph nodes](https://en.wikipedia.org/w/index.php?title=Rotter's_lymph_nodes&oldid=1277665395): “named after German surgeon Josef Rotter (1857-1924), who described them in the late 19th century”
- **Localización.** Están entre los músculos pectoral mayor y pectoral menor.
  - [Rotter's lymph nodes](https://en.wikipedia.org/w/index.php?title=Rotter's_lymph_nodes&oldid=1277665395): “located between the pectoralis major and pectoralis minor muscles”
- **Reparo.** El plano entre el pectoral mayor, por delante, y el pectoral menor, por detrás.
  - [Rotter's lymph nodes](https://en.wikipedia.org/w/index.php?title=Rotter's_lymph_nodes&oldid=1277665395): “located between the pectoralis major and pectoralis minor muscles”
- **Recibe.** Reciben linfa de los músculos y de la glándula mamaria.
  - [Rotter's lymph nodes](https://en.wikipedia.org/w/index.php?title=Rotter's_lymph_nodes&oldid=1277665395): “They receive lymphatic fluid from the muscles and the mammary gland”
- **Drena en.** Su linfa pasa al plexo linfático axilar.
  - [Rotter's lymph nodes](https://en.wikipedia.org/w/index.php?title=Rotter's_lymph_nodes&oldid=1277665395): “deliver lymphatic fluid to the axillary lymphatic plexus”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **Nota.** El cáncer de mama a veces se extiende a estos nodos.
  - [Rotter's lymph nodes](https://en.wikipedia.org/w/index.php?title=Rotter's_lymph_nodes&oldid=1277665395): “as the cancer sometimes spreads (metastasizes) to the interpectoral lymph nodes”

### Nodos infraclaviculares (`Infraclavicular_nodes`)

Nombre: TA2 n.º 5243 (*Nodi infraclaviculares nodi deltopectorales*; Infraclavicular nodes).

- **Descripción.** Uno o dos nodos (ganglios) junto a la vena cefálica, llamados también deltopectorales.
  - [Deltopectoral lymph nodes](https://en.wikipedia.org/w/index.php?title=Deltopectoral_lymph_nodes&oldid=1224153162): “One or two deltopectoral lymph nodes (or infraclavicular nodes) are found beside the cephalic vein”
  - TA2 n.º 5243: Infraclavicular nodes (*Nodi infraclaviculares nodi deltopectorales*)
- **Descripción.** No son nodos axilares en sentido estricto, porque están fuera de la axila.
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “These nodes are not strictly axillary nodes because they are located outside the axilla.”
- **Localización.** Están en el surco entre el deltoides y el pectoral mayor, justo por debajo de la clavícula.
  - [Deltopectoral lymph nodes](https://en.wikipedia.org/w/index.php?title=Deltopectoral_lymph_nodes&oldid=1224153162): “between the pectoralis major and deltoideus, immediately below the clavicle”
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “They lie in the groove between the deltoid and pectoralis major muscles”
- **Reparo.** La vena cefálica, que cerca del hombro pasa por el surco deltopectoral.
  - [Deltopectoral lymph nodes](https://en.wikipedia.org/w/index.php?title=Deltopectoral_lymph_nodes&oldid=1224153162): “are found beside the cephalic vein”
  - [Cephalic vein](https://en.wikipedia.org/w/index.php?title=Cephalic_vein&oldid=1375572338): “Near the shoulder, the cephalic vein passes between the deltoid and pectoralis major muscles (deltopectoral groove)”
- **Recibe.** Reciben los vasos linfáticos superficiales del lado lateral de la mano, el antebrazo y el brazo.
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “receive superficial lymph vessels from the lateral side of the hand, forearm, and arm”
- **Recibe.** Están intercalados en el trayecto de los colectores externos del brazo.
  - [Deltopectoral lymph nodes](https://en.wikipedia.org/w/index.php?title=Deltopectoral_lymph_nodes&oldid=1224153162): “They are situated in the course of the external collecting trunks of the arm.”
- **Drena en.** Los colectores que acompañan a la vena cefálica, en cuyo trayecto están estos nodos, llegan directamente a los nodos axilares apicales.
  - [Deltopectoral lymph nodes](https://en.wikipedia.org/w/index.php?title=Deltopectoral_lymph_nodes&oldid=1224153162): “They are situated in the course of the external collecting trunks of the arm.”
  - [Apical lymph nodes](https://en.wikipedia.org/w/index.php?title=Apical_lymph_nodes&oldid=1224153102): “Its only direct territorial afferents are those that accompany the cephalic vein”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** El latín del modelo pone el sinónimo de la TA2, «nodi deltopectorales», tras punto y coma.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe `Superficial_lymphatic_vessels_of_upper_limb`; drena en `Apical_axillary_nodes`.

### Nodos braquiales (`Brachial_nodes`)

Nombre: TA2 n.º 5244 (*Nodi brachiales*; Brachial nodes).

- **Descripción.** Término de la TA2 para un grupo de nodos (ganglios) del miembro superior distinto de los nodos axilares laterales o humerales.
  - TA2 n.º 5244: Brachial nodes (*Nodi brachiales*)
  - TA2 n.º 5239: Lateral axillary nodes (*Nodi axillares latérales nodi humerales*)
- **Descripción.** Cuidado con el nombre: la Wikipedia inglesa, con texto del Gray de 1918, llama «brachial lymph nodes» al grupo axilar lateral, no a este.
  - [Brachial lymph nodes](https://en.wikipedia.org/w/index.php?title=Brachial_lymph_nodes&oldid=1224152961): “A brachial lymph nodes (or lateral group)”
  - [Brachial lymph nodes](https://en.wikipedia.org/w/index.php?title=Brachial_lymph_nodes&oldid=1224152961): “incorporates text in the public domain from the 20th edition of Gray”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **Localización: pendiente.** Ninguna fuente libre consultada (Wikipedia en inglés y en español) describe dónde están los nodos braquiales de la TA2; la página «Brachial lymph nodes» describe el grupo axilar lateral.
- **Reparo: pendiente.** Sin fuente libre que dé un reparo para los nodos braquiales de la TA2.
- **Recibe: pendiente.** Sin fuente libre sobre las aferencias de los nodos braquiales de la TA2.
- **Drena en: pendiente.** Sin fuente libre sobre las eferencias de los nodos braquiales de la TA2.

### Nodos cubitales (`Cubital_nodes`)

Nombre: TA2 n.º 5245 (*Nodi cubitales*; Cubital nodes).

- **Descripción.** Nodos (ganglios) del codo, llamados también epitrocleares; «cubital» viene de «cubitus», el codo en latín.
  - [Elbow](https://en.wikipedia.org/w/index.php?title=Elbow&oldid=1380372262): “The name for the elbow in Latin is cubitus, and so the word cubital is used in some elbow-related terms, as in cubital nodes for example”
  - [Elbow](https://en.wikipedia.org/w/index.php?title=Elbow&oldid=1380372262): “the deep and superficial cubital nodes (also called epitrochlear nodes)”
  - TA2 n.º 5245: Cubital nodes (*Nodi cubitales*)
- **Descripción.** Hay dos grupos, uno profundo y otro superficial.
  - [Elbow](https://en.wikipedia.org/w/index.php?title=Elbow&oldid=1380372262): “There are two sets of lymphatic nodes at the elbow”
  - [Elbow](https://en.wikipedia.org/w/index.php?title=Elbow&oldid=1380372262): “the deep and superficial cubital nodes”
- **Descripción.** La TA los separa de los nodos supratrocleares, aunque la región es parecida.
  - [Supratrochlear lymph nodes](https://en.wikipedia.org/w/index.php?title=Supratrochlear_lymph_nodes&oldid=1383412698): “They are distinguished in Terminologia anatomica from the "epitrochlear" (or "cubital") lymph nodes”
  - [Supratrochlear lymph nodes](https://en.wikipedia.org/w/index.php?title=Supratrochlear_lymph_nodes&oldid=1383412698): “but the region is similar”
  - TA2 n.º 5246: Supratrochlear nodes (*Nodi supratrochleares*)
- **Localización.** Suelen estar por encima del epicóndilo medial.
  - [Elbow](https://en.wikipedia.org/w/index.php?title=Elbow&oldid=1380372262): “normally located above the medial epicondyle”
- **Localización.** Los profundos están en la bifurcación de la arteria braquial.
  - [Elbow](https://en.wikipedia.org/w/index.php?title=Elbow&oldid=1380372262): “through the deep nodes at the bifurcation of the brachial artery”
- **Reparo.** La bifurcación de la arteria braquial en el codo, para el grupo profundo.
  - [Elbow](https://en.wikipedia.org/w/index.php?title=Elbow&oldid=1380372262): “through the deep nodes at the bifurcation of the brachial artery”
- **Recibe.** Los superficiales drenan el antebrazo y el lado cubital de la mano.
  - [Elbow](https://en.wikipedia.org/w/index.php?title=Elbow&oldid=1380372262): “the superficial nodes drain the forearm and the ulnar side of the hand”
- **Recibe.** El drenaje linfático del codo pasa por los nodos profundos.
  - [Elbow](https://en.wikipedia.org/w/index.php?title=Elbow&oldid=1380372262): “The lymphatic drainage at the elbow is through the deep nodes at the bifurcation of the brachial artery”
- **Drena en.** Los vasos eferentes del codo van al grupo lateral de los nodos axilares.
  - [Elbow](https://en.wikipedia.org/w/index.php?title=Elbow&oldid=1380372262): “The efferent lymph vessels from the elbow proceed to the lateral group of axillary lymph nodes.”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo los cubitales superficiales y profundos forman una sola pieza.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe `Superficial_lymphatic_vessels_of_upper_limb`, `Deep_lymphatic_vessels_of_upper_limb`; drena en `Lateral_axillary_nodes`.

### Nodos supratrocleares (`Supratrochlear_nodes`)

Nombre: TA2 n.º 5246 (*Nodi supratrochleares*; Supratrochlear nodes).

- **Descripción.** Uno o dos nodos (ganglios) superficiales del brazo, por encima del epicóndilo medial del húmero.
  - [Supratrochlear lymph nodes](https://en.wikipedia.org/w/index.php?title=Supratrochlear_lymph_nodes&oldid=1383412698): “One or two supratrochlear lymph nodes are placed above the medial epicondyle of the humerus”
  - [List of lymph nodes of the human body](https://en.wikipedia.org/w/index.php?title=List_of_lymph_nodes_of_the_human_body&oldid=1321358933): “Superficial lymph nodes of the arm”
  - TA2 n.º 5246: Supratrochlear nodes (*Nodi supratrochleares*)
- **Descripción.** La TA los distingue de los nodos cubitales o epitrocleares, aunque la región es parecida.
  - [Supratrochlear lymph nodes](https://en.wikipedia.org/w/index.php?title=Supratrochlear_lymph_nodes&oldid=1383412698): “They are distinguished in Terminologia anatomica from the "epitrochlear" (or "cubital") lymph nodes”
  - [Supratrochlear lymph nodes](https://en.wikipedia.org/w/index.php?title=Supratrochlear_lymph_nodes&oldid=1383412698): “but the region is similar”
  - TA2 n.º 5245: Cubital nodes (*Nodi cubitales*)
- **Localización.** Están por encima del epicóndilo medial del húmero, por dentro de la vena basílica.
  - [Supratrochlear lymph nodes](https://en.wikipedia.org/w/index.php?title=Supratrochlear_lymph_nodes&oldid=1383412698): “are placed above the medial epicondyle of the humerus, medial to the basilic vein”
- **Reparo.** La vena basílica: los nodos quedan por dentro de ella, sobre el epicóndilo medial.
  - [Supratrochlear lymph nodes](https://en.wikipedia.org/w/index.php?title=Supratrochlear_lymph_nodes&oldid=1383412698): “are placed above the medial epicondyle of the humerus, medial to the basilic vein”
- **Recibe.** Sus aferentes drenan los dedos medio, anular y meñique, la parte medial de la mano y la zona superficial del lado cubital del antebrazo.
  - [Supratrochlear lymph nodes](https://en.wikipedia.org/w/index.php?title=Supratrochlear_lymph_nodes&oldid=1383412698): “Their afferents drain the middle, ring, and little fingers, the medial portion of the hand, and the superficial area over the ulnar side of the forearm”
- **Recibe.** Esos vasos se comunican libremente con los demás vasos linfáticos del antebrazo.
  - [Supratrochlear lymph nodes](https://en.wikipedia.org/w/index.php?title=Supratrochlear_lymph_nodes&oldid=1383412698): “these vessels are, however, in free communication with the other lymphatic vessels of the forearm”
- **Recibe.** Su territorio corresponde a los dermatomas C7 y C8.
  - [List of lymph nodes of the human body](https://en.wikipedia.org/w/index.php?title=List_of_lymph_nodes_of_the_human_body&oldid=1321358933): “they drain the C7 and C8 dermatomes”
- **Drena en.** Sus eferentes acompañan a la vena basílica y se unen a los vasos profundos.
  - [Supratrochlear lymph nodes](https://en.wikipedia.org/w/index.php?title=Supratrochlear_lymph_nodes&oldid=1383412698): “Their efferents accompany the basilic vein and join the deeper vessels.”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo los nodos se recolocaron por encima del epicóndilo medial, a pocos milímetros de la vena basílica; es una colocación esquemática.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **Nota.** Se hinchan cuando hay una infección y entonces pueden palparse.
  - [Supratrochlear lymph nodes](https://en.wikipedia.org/w/index.php?title=Supratrochlear_lymph_nodes&oldid=1383412698): “The supratrochlear lymph nodes swell up when an infection is detected in the body.”
  - [Supratrochlear lymph nodes](https://en.wikipedia.org/w/index.php?title=Supratrochlear_lymph_nodes&oldid=1383412698): “They may be palpable.”
- Vías en la app: recibe `Superficial_lymphatic_vessels_of_upper_limb`; drena en `Deep_lymphatic_vessels_of_upper_limb`.
