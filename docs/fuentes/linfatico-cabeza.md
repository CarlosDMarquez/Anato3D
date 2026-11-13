---
title: Fuentes de las fichas linfáticas de la cabeza
date: 2026-11-12
---

# Fuentes de las fichas linfáticas de la cabeza (2026-11-12)

Qué fuente respalda cada frase de las fichas de `web/src/data/linfatico/cabeza.js`: nodos occipitales, mastoideos, parotídeos superficiales, preauriculares, infraauriculares, parotídeos intraglandulares, faciales (nasolabial, bucinador, mandibular), submandibulares y submentonianos. Son 11 fichas, una por clave sin lado; cada una sirve a las piezas `_L` y `_R` de los dos modelos (hombre y mujer).

Todo es **borrador** redactado con IA (Claude) a partir de las fuentes citadas, **sin revisión de un especialista**.

## Cómo se comprobó

1. Páginas bajadas con `node scripts/linfatico-citas.mjs bajar …` (Wikipedia en inglés y en español, CC BY-SA 4.0; texto plano de la API, sin recuadros ni pies de imagen) y registradas con su revisión en `web/src/data/linfatico/comprobadas.js`. Varias incorporan texto de dominio público del Gray de 1918.
2. `node scripts/linfatico-citas.mjs comprobar`: las 106 citas de estas fichas, en 16 páginas, se encontraron palabra por palabra (588 en total con las demás regiones el 12 nov 2026, 0 sin encontrar).
3. `node scripts/check-cards.mjs`: «todo correcto»; 4 avisos de campos pendientes (`Pre_auricular_nodes` e `Infra_auricular_nodes`: localización y reparo).
4. TeachMeAnatomy no se cita. Las frases *Modelo 3D* describen el modelo de Anato3D.

## Estado en el modelo publicado (12 nov 2026)

- Las 18 piezas del grupo `Lymph_nodes_of_head` (9 claves) tienen ficha propia en los dos modelos.
- `Submandibular_nodes` y `Submental_nodes` están ahora, como en la TA2, en el grupo del cuello (`Lymph_nodes_of_neck`). Sus fichas siguen en `cabeza.js` (una clave solo puede estar en un archivo); su campo «En este modelo» ya dice que están en el cuello. Si se pasan a `cuello.js`, hay que quitarlas de aquí.
- Los submentonianos se recolocaron bajo el milohioideo y entre los vientres anteriores del digástrico (recolocación de grupo declarada en `docs/hitos/09-sistema-linfatico.md`); en `build/linfatico/relaciones-<modelo>.json` cumplen 4 de 8 nodos en hombre y mujer (los 8 bajo el milohioideo; 4 entre los vientres). La ficha lo declara como colocación esquemática.
- El nodo malar de la TA2 no está en Z-Anatomy ni en el modelo.

## Contraste con la tabla de drenaje del encargo

Confirmadas por las fuentes:
- Occipitales → cervicales profundos superiores (*Occipital lymph nodes*: «Their efferents in turn drain into the superior deep cervical glands.»).
- Mastoideos → cervicales profundos superiores (*Mastoid lymph nodes*).
- Parotídeos superficiales, preauriculares, infraauriculares e intraglandulares → cervicales profundos superiores (*Superficial parotid lymph nodes*; *Deep parotid lymph nodes*: «Their efferents pass to the superior deep cervical glands.»; *Parotid gland*: «ultimately drain to the deep cervical chain»).
- Nasolabial → bucinador → mandibular → submandibulares (*Facial lymph nodes*: «each node drains into the one immediately inferior to it, with the last draining into submandibular lymph nodes»).
- Submentonianos → submandibulares, o directamente a la cadena cervical profunda (*Submental lymph nodes*).

Matizadas:
- «Occipital → … y Superficial_lateral_cervical»: ninguna fuente lleva los occipitales a los cervicales laterales superficiales. La fuente añade otra vía: un vaso que baja por el borde posterior del esternocleidomastoideo directo a los cervicales profundos inferiores (en «Punto clave»).
- «Submandibular → Jugulodigastric»: la fuente dice «superior deep cervical lymph nodes», sin nombrar el yugulodigástrico.
- Infraauriculares y parotídeos: además de la cadena profunda, los cervicales laterales superficiales (junto a la yugular externa) están intercalados en los vasos que los drenan (*Superficial lateral cervical lymph nodes*). Se añadió a la ficha de los infraauriculares y a sus vías.
- Las rutas generadas (`web/src/data/linfatico-rutas.js`) encadenan parotídeos superficiales e intraglandulares → infraauriculares → yugulodigástrico, marcadas *esquemático*: ninguna fuente describe ese paso por los infraauriculares.

Contradicciones: ninguna.

## Páginas citadas

- `wp:Buccal_lymph_nodes`: «Buccinator lymph node», revisión 1224152120 (https://en.wikipedia.org/w/index.php?title=Buccinator_lymph_node&oldid=1224152120), consultada 2026-11-12, CC BY-SA 4.0
- `wp:Cervical_lymph_nodes`: «Cervical lymph nodes», revisión 1360586838 (https://en.wikipedia.org/w/index.php?title=Cervical_lymph_nodes&oldid=1360586838), consultada 2026-11-12, CC BY-SA 4.0
- `wp:Deep_parotid_lymph_nodes`: «Deep parotid lymph nodes», revisión 1210345997 (https://en.wikipedia.org/w/index.php?title=Deep_parotid_lymph_nodes&oldid=1210345997), consultada 2026-11-12, CC BY-SA 4.0
- `wp:Facial_artery`: «Facial artery», revisión 1380880316 (https://en.wikipedia.org/w/index.php?title=Facial_artery&oldid=1380880316), consultada 2026-11-12, CC BY-SA 4.0
- `wp:Facial_lymph_nodes`: «Facial lymph nodes», revisión 1384390704 (https://en.wikipedia.org/w/index.php?title=Facial_lymph_nodes&oldid=1384390704), consultada 2026-11-12, CC BY-SA 4.0
- `wp:Facial_vein`: «Facial vein», revisión 1240668445 (https://en.wikipedia.org/w/index.php?title=Facial_vein&oldid=1240668445), consultada 2026-11-12, CC BY-SA 4.0
- `wp:Mastoid_lymph_nodes`: «Mastoid lymph nodes», revisión 1319318381 (https://en.wikipedia.org/w/index.php?title=Mastoid_lymph_nodes&oldid=1319318381), consultada 2026-11-12, CC BY-SA 4.0
- `wp:Nasolabial_lymph_nodes`: «Nasolabial lymph node», revisión 1224152148 (https://en.wikipedia.org/w/index.php?title=Nasolabial_lymph_node&oldid=1224152148), consultada 2026-11-12, CC BY-SA 4.0
- `wp:Occipital_lymph_nodes`: «Occipital lymph nodes», revisión 1315085330 (https://en.wikipedia.org/w/index.php?title=Occipital_lymph_nodes&oldid=1315085330), consultada 2026-11-12, CC BY-SA 4.0
- `wp:Parotid_gland`: «Parotid gland», revisión 1350643404 (https://en.wikipedia.org/w/index.php?title=Parotid_gland&oldid=1350643404), consultada 2026-11-12, CC BY-SA 4.0
- `wp:Scalp`: «Scalp», revisión 1370497956 (https://en.wikipedia.org/w/index.php?title=Scalp&oldid=1370497956), consultada 2026-11-12, CC BY-SA 4.0
- `wp:Submandibular_lymph_nodes`: «Submandibular lymph nodes», revisión 1285412030 (https://en.wikipedia.org/w/index.php?title=Submandibular_lymph_nodes&oldid=1285412030), consultada 2026-11-12, CC BY-SA 4.0
- `wp:Submental_lymph_nodes`: «Submental lymph nodes», revisión 1370068512 (https://en.wikipedia.org/w/index.php?title=Submental_lymph_nodes&oldid=1370068512), consultada 2026-11-12, CC BY-SA 4.0
- `wp:Superficial_lateral_cervical_lymph_nodes`: «Superficial lateral cervical lymph nodes», revisión 1252113790 (https://en.wikipedia.org/w/index.php?title=Superficial_lateral_cervical_lymph_nodes&oldid=1252113790), consultada 2026-11-12, CC BY-SA 4.0
- `wp:Superficial_parotid_lymph_nodes`: «Superficial parotid lymph nodes», revisión 1328184079 (https://en.wikipedia.org/w/index.php?title=Superficial_parotid_lymph_nodes&oldid=1328184079), consultada 2026-11-12, CC BY-SA 4.0
- `wpes:Glándula_parótida`: «Glándula parótida», revisión 166099930 (https://es.wikipedia.org/w/index.php?title=Gl%C3%A1ndula_par%C3%B3tida&oldid=166099930), consultada 2026-11-12, CC BY-SA 4.0

## Fichas

### Occipital_nodes

Nombre: TA2 n.º 5199 (*Nodi occipitales*; Occipital nodes).

- **Descripción.** Grupo de 1 a 3 nodos (ganglios) linfáticos superficiales de la región occipital, que drenan parte del cuero cabelludo de la nuca.
  - [Occipital lymph nodes](https://en.wikipedia.org/w/index.php?title=Occipital_lymph_nodes&oldid=1315085330): “a group of 1-3 superficial lymph nodes of the head situated in the occipital region that drain part of the scalp of the occiput”
- **Localización.** Están en el borde del trapecio, apoyados sobre la inserción del semiespinoso de la cabeza.
  - [Occipital lymph nodes](https://en.wikipedia.org/w/index.php?title=Occipital_lymph_nodes&oldid=1315085330): “They are situated at the margin of the trapezius and resting on the insertion of the semispinalis capitis.”
- **Reparo.** El borde del músculo trapecio en la nuca y, debajo de los nodos, la inserción del semiespinoso de la cabeza.
  - [Occipital lymph nodes](https://en.wikipedia.org/w/index.php?title=Occipital_lymph_nodes&oldid=1315085330): “situated at the margin of the trapezius and resting on the insertion of the semispinalis capitis”
- **Recibe.** Sus aferentes drenan la región occipital del cuero cabelludo.
  - [Occipital lymph nodes](https://en.wikipedia.org/w/index.php?title=Occipital_lymph_nodes&oldid=1315085330): “Afferents of occipital lymph nodes contribute to the drainage of the occipital region of the scalp”
- **Drena en.** Sus eferentes van a los nodos cervicales profundos superiores.
  - [Occipital lymph nodes](https://en.wikipedia.org/w/index.php?title=Occipital_lymph_nodes&oldid=1315085330): “Their efferents in turn drain into the superior deep cervical glands.”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **Punto clave.** Parte de la linfa de la región occipital no pasa por ellos: un vaso linfático baja por el borde posterior del esternocleidomastoideo directamente a los nodos cervicales profundos inferiores.
  - [Occipital lymph nodes](https://en.wikipedia.org/w/index.php?title=Occipital_lymph_nodes&oldid=1315085330): “this region is also drained by a lymphatic vessel which passes along the posterior border of the sternocleidomastoid muscle to drain directly into the inferior deep cervical lymph nodes”
- **Punto clave.** En la exploración se palpan con la cabeza inclinada hacia delante, a los dos lados de la base de la cabeza.
  - [Occipital lymph nodes](https://en.wikipedia.org/w/index.php?title=Occipital_lymph_nodes&oldid=1315085330): “these nodes are examined by having the patient bend their head forward and bilaterally palpating the base of the side of the head”
- Vías en la app: recibe —; drena en `Lateral_superior_jugular_node`, `Jugulodigastric_node`.

### Mastoid_nodes

Nombre: TA2 n.º 5200 (*Nodi mastoidei*; Mastoid nodes).

- **Descripción.** Pequeño grupo de nodos (ganglios) linfáticos, normalmente dos, también llamados retroauriculares o auriculares posteriores.
  - [Mastoid lymph nodes](https://en.wikipedia.org/w/index.php?title=Mastoid_lymph_nodes&oldid=1319318381): “are a small group of lymph nodes, usually two in number”
  - [Mastoid lymph nodes](https://en.wikipedia.org/w/index.php?title=Mastoid_lymph_nodes&oldid=1319318381): “retroauricular lymph nodes or posterior auricular glands”
- **Localización.** Están sobre la inserción mastoidea del esternocleidomastoideo, por debajo del músculo auricular posterior.
  - [Mastoid lymph nodes](https://en.wikipedia.org/w/index.php?title=Mastoid_lymph_nodes&oldid=1319318381): “on the mastoid insertion of the sternocleidomastoideus muscle, beneath the posterior auricular muscle”
- **Reparo.** La inserción del esternocleidomastoideo en la mastoides, detrás de la oreja, cubierta por el músculo auricular posterior.
  - [Mastoid lymph nodes](https://en.wikipedia.org/w/index.php?title=Mastoid_lymph_nodes&oldid=1319318381): “on the mastoid insertion of the sternocleidomastoideus muscle, beneath the posterior auricular muscle”
  - [Mastoid lymph nodes](https://en.wikipedia.org/w/index.php?title=Mastoid_lymph_nodes&oldid=1319318381): “retroauricular lymph nodes”
- **Recibe.** Recibe la linfa de la parte posterior de la región temporoparietal, de la parte alta de la cara craneal de la oreja y de la parte posterior del conducto auditivo.
  - [Mastoid lymph nodes](https://en.wikipedia.org/w/index.php?title=Mastoid_lymph_nodes&oldid=1319318381): “receives lymph from the posterior part of the temporoparietal region, the upper part of the cranial surface of the visible ear and the back of the ear canal”
- **Drena en.** Su linfa pasa a los nodos cervicales profundos superiores.
  - [Mastoid lymph nodes](https://en.wikipedia.org/w/index.php?title=Mastoid_lymph_nodes&oldid=1319318381): “The lymph then passes to the superior deep cervical glands.”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe —; drena en `Lateral_superior_jugular_node`, `Jugulodigastric_node`.

### Superficial_parotid_nodes

Nombre: TA2 n.º 5201 (*Nodi parotidei superficiales*; Superficial parotid nodes).

- **Descripción.** Grupo de nodos (ganglios) linfáticos de la cabeza situados sobre la glándula parótida, por fuera o por dentro de la fascia parotídea; también se llaman paraparotídeos.
  - [Superficial parotid lymph nodes](https://en.wikipedia.org/w/index.php?title=Superficial_parotid_lymph_nodes&oldid=1328184079): “are a group of lymph nodes of the head situated superficial to either parotid gland (either superficial to or deep to the parotid fascia)”
  - [Superficial parotid lymph nodes](https://en.wikipedia.org/w/index.php?title=Superficial_parotid_lymph_nodes&oldid=1328184079): “paraparotid lymph nodes”
- **Localización.** Están en la cara externa de la parótida, justo delante del trago de la oreja.
  - [Superficial parotid lymph nodes](https://en.wikipedia.org/w/index.php?title=Superficial_parotid_lymph_nodes&oldid=1328184079): “situated superficial to either parotid gland”
  - [Superficial parotid lymph nodes](https://en.wikipedia.org/w/index.php?title=Superficial_parotid_lymph_nodes&oldid=1328184079): “They are situated just anterior to the tragus of the ear.”
- **Reparo.** El trago de la oreja, justo por detrás de ellos, y la vena temporal superficial, que baja delante del trago y entra en la parótida.
  - [Superficial parotid lymph nodes](https://en.wikipedia.org/w/index.php?title=Superficial_parotid_lymph_nodes&oldid=1328184079): “just anterior to the tragus of the ear”
  - [Scalp](https://en.wikipedia.org/w/index.php?title=Scalp&oldid=1370497956): “The superficial temporal vein descends in front of the tragus, enters the parotid gland”
- **Recibe.** Reciben linfa de las partes laterales de la frente, de las regiones temporal y cigomática, de la parte alta de la cara lateral de la oreja, de la pared anterior del conducto auditivo externo y de los párpados.
  - [Superficial parotid lymph nodes](https://en.wikipedia.org/w/index.php?title=Superficial_parotid_lymph_nodes&oldid=1328184079): “receive lymph from more lateral parts of the forehead and from the temporal and zygomatic region, the superior portion of the lateral auricular aspect and anterior wall of the external auditory meatus, and eyelids”
- **Recibe.** A los nodos parotídeos, en conjunto, llega la linfa de la mitad anterior del cuero cabelludo.
  - [Scalp](https://en.wikipedia.org/w/index.php?title=Scalp&oldid=1370497956): “Lymphatic channels from the anterior half drain to the parotid nodes.”
- **Drena en.** Vacían en los nodos cervicales profundos superiores.
  - [Superficial parotid lymph nodes](https://en.wikipedia.org/w/index.php?title=Superficial_parotid_lymph_nodes&oldid=1328184079): “Superficial parotid lymph nodes in turn empty into the superior deep cervical lymph nodes.”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **Punto clave.** A veces se agrupan con los nodos auriculares anteriores.
  - [Superficial parotid lymph nodes](https://en.wikipedia.org/w/index.php?title=Superficial_parotid_lymph_nodes&oldid=1328184079): “They may sometimes be grouped together with the anterior auricular lymph glands.”
- Vías en la app: recibe —; drena en `Lateral_superior_jugular_node`, `Jugulodigastric_node`.

### Pre_auricular_nodes

Nombre: TA2 n.º 5203 (*Nodi preauriculares*; Pre-auricular nodes).

- **Descripción.** Nodos (ganglios) linfáticos de la parótida situados delante de la oreja; la Terminologia Anatomica los clasifica entre los nodos parotídeos profundos.
  - TA2 n.º 5202: Deep parotid nodes (*Nodi parotidei profundi*)
  - TA2 n.º 5203: Pre-auricular nodes (*Nodi preauriculares*)
- **Descripción.** Junto con los demás nodos parotídeos, son el destino principal de la linfa de la glándula parótida.
  - [Parotid gland](https://en.wikipedia.org/w/index.php?title=Parotid_gland&oldid=1350643404): “The gland is mainly drained into the preauricular or parotid lymph nodes”
- **Recibe.** Reciben sobre todo la linfa de la glándula parótida.
  - [Parotid gland](https://en.wikipedia.org/w/index.php?title=Parotid_gland&oldid=1350643404): “The gland is mainly drained into the preauricular or parotid lymph nodes”
- **Recibe.** A los nodos parotídeos, en conjunto, llega la linfa de la mitad anterior del cuero cabelludo.
  - [Scalp](https://en.wikipedia.org/w/index.php?title=Scalp&oldid=1370497956): “Lymphatic channels from the anterior half drain to the parotid nodes.”
- **Drena en.** Como los demás nodos parotídeos, su linfa acaba en la cadena cervical profunda.
  - [Parotid gland](https://en.wikipedia.org/w/index.php?title=Parotid_gland&oldid=1350643404): “which ultimately drain to the deep cervical chain”
- **Drena en.** Los eferentes de los nodos parotídeos profundos van a los cervicales profundos superiores.
  - [Deep parotid lymph nodes](https://en.wikipedia.org/w/index.php?title=Deep_parotid_lymph_nodes&oldid=1210345997): “Their efferents pass to the superior deep cervical glands.”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **Localización: pendiente.** Ninguna fuente libre consultada describe su posición más allá del nombre («delante de la oreja»); no hay artículo propio en Wikipedia en inglés ni en español.
- **Reparo: pendiente.** Ninguna fuente libre consultada da un reparo propio de este grupo.
- Vías en la app: recibe —; drena en `Lateral_superior_jugular_node`, `Jugulodigastric_node`.

### Infra_auricular_nodes

Nombre: TA2 n.º 5204 (*Nodi infraauriculares*; Infra-auricular nodes).

- **Descripción.** Nodos (ganglios) linfáticos de la parótida situados, según su nombre, por debajo de la oreja; la Terminologia Anatomica los clasifica entre los nodos parotídeos profundos.
  - TA2 n.º 5202: Deep parotid nodes (*Nodi parotidei profundi*)
  - TA2 n.º 5204: Infra-auricular nodes (*Nodi infraauriculares*)
- **Recibe.** A los nodos parotídeos, en conjunto, llegan la linfa de la glándula parótida y la de la mitad anterior del cuero cabelludo.
  - [Parotid gland](https://en.wikipedia.org/w/index.php?title=Parotid_gland&oldid=1350643404): “The gland is mainly drained into the preauricular or parotid lymph nodes”
  - [Scalp](https://en.wikipedia.org/w/index.php?title=Scalp&oldid=1370497956): “Lymphatic channels from the anterior half drain to the parotid nodes.”
- **Drena en.** Los eferentes de los nodos parotídeos profundos van a los cervicales profundos superiores.
  - [Deep parotid lymph nodes](https://en.wikipedia.org/w/index.php?title=Deep_parotid_lymph_nodes&oldid=1210345997): “Their efferents pass to the superior deep cervical glands.”
- **Drena en.** En el trayecto de los vasos que drenan los nodos parotídeos e infraauriculares se intercalan los nodos cervicales laterales superficiales, que siguen la vena yugular externa.
  - [Superficial lateral cervical lymph nodes](https://en.wikipedia.org/w/index.php?title=Superficial_lateral_cervical_lymph_nodes&oldid=1252113790): “The nodes are intercalated along the course of the vessels draining the parotid nodes and the infraauricular nodes.”
  - [Superficial lateral cervical lymph nodes](https://en.wikipedia.org/w/index.php?title=Superficial_lateral_cervical_lymph_nodes&oldid=1252113790): “are found along the course of the external jugular vein”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **Localización: pendiente.** Ninguna fuente libre consultada describe su posición más allá del nombre («debajo de la oreja»); no hay artículo propio en Wikipedia.
- **Reparo: pendiente.** Ninguna fuente libre consultada da un reparo propio de este grupo.
- Vías en la app: recibe —; drena en `Lateral_superior_jugular_node`, `Jugulodigastric_node`, `Superficial_lateral_cervical_nodes`.

### Intraglandular_parotid_nodes

Nombre: TA2 n.º 5205 (*Nodi parotidei intraglandulares*; Intraglandular parotid nodes).

- **Descripción.** Nodos (ganglios) linfáticos dentro de la glándula parótida, como dice su nombre; la Terminologia Anatomica los clasifica entre los nodos parotídeos profundos.
  - TA2 n.º 5202: Deep parotid nodes (*Nodi parotidei profundi*)
  - TA2 n.º 5205: Intraglandular parotid nodes (*Nodi parotidei intraglandulares*)
- **Localización.** Están en el interior de la glándula parótida, entre los órganos intraparotídeos.
  - [es: Glándula parótida](https://es.wikipedia.org/w/index.php?title=Gl%C3%A1ndula_par%C3%B3tida&oldid=166099930): “En el interior de la glándula se encuentran ganglios linfáticos parotídeos.”
  - [es: Glándula parótida](https://es.wikipedia.org/w/index.php?title=Gl%C3%A1ndula_par%C3%B3tida&oldid=166099930): “se llaman órganos intraparotídeos”
- **Localización.** La glándula tiene una cápsula propia de tejido conjuntivo denso y, por fuera, una falsa cápsula formada por la lámina de revestimiento de la fascia cervical profunda.
  - [Parotid gland](https://en.wikipedia.org/w/index.php?title=Parotid_gland&oldid=1350643404): “The gland has a capsule of its own of dense connective tissue but is also provided with a false capsule by the investing layer of the deep cervical fascia.”
- **Reparo.** La glándula parótida y lo que la atraviesa: el nervio facial, la vena retromandibular y la arteria carótida externa.
  - [es: Glándula parótida](https://es.wikipedia.org/w/index.php?title=Gl%C3%A1ndula_par%C3%B3tida&oldid=166099930): “La atraviesan 3 estructuras importantes: el nervio facial, la vena retromandibular y la arteria carótida externa”
- **Reparo.** Dentro de la glándula el nervio facial se divide en sus ramas, y la arteria carótida externa da sus ramas terminales.
  - [Parotid gland](https://en.wikipedia.org/w/index.php?title=Parotid_gland&oldid=1350643404): “The facial nerve (CN VII) splits into its branches within the parotid gland”
  - [Parotid gland](https://en.wikipedia.org/w/index.php?title=Parotid_gland&oldid=1350643404): “The external carotid artery and its terminal branches within the gland”
- **Recibe.** A los nodos parotídeos, en conjunto, llegan la linfa de la glándula parótida y la de la mitad anterior del cuero cabelludo.
  - [Parotid gland](https://en.wikipedia.org/w/index.php?title=Parotid_gland&oldid=1350643404): “The gland is mainly drained into the preauricular or parotid lymph nodes”
  - [Scalp](https://en.wikipedia.org/w/index.php?title=Scalp&oldid=1370497956): “Lymphatic channels from the anterior half drain to the parotid nodes.”
- **Drena en.** Los eferentes de los nodos parotídeos profundos van a los cervicales profundos superiores.
  - [Deep parotid lymph nodes](https://en.wikipedia.org/w/index.php?title=Deep_parotid_lymph_nodes&oldid=1210345997): “Their efferents pass to the superior deep cervical glands.”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe —; drena en `Lateral_superior_jugular_node`, `Jugulodigastric_node`.

### Nasolabial_node

Nombre: TA2 n.º 5208 (*Nodus nasolabialis*; Nasolabial node).

- **Descripción.** Nodo (ganglio) linfático facial situado a lo largo del surco nasolabial, cerca de la nariz y del labio superior.
  - [Facial lymph nodes](https://en.wikipedia.org/w/index.php?title=Facial_lymph_nodes&oldid=1384390704): “Nasolabial lymph nodes - situated along the nasolabial sulcus.”
  - [Nasolabial lymph node](https://en.wikipedia.org/w/index.php?title=Nasolabial_lymph_node&oldid=1224152148): “is a facial node found near the nose and upper lip”
- **Descripción.** Pertenece a los nodos faciales: hasta 12 nodos superficiales, pequeños y de número variable, a lo largo de la vena facial.
  - [Facial lymph nodes](https://en.wikipedia.org/w/index.php?title=Facial_lymph_nodes&oldid=1384390704): “The facial lymph nodes are a group of up to 12 superficial lymph nodes of the head situated along the length of the facial vein”
  - [Facial lymph nodes](https://en.wikipedia.org/w/index.php?title=Facial_lymph_nodes&oldid=1384390704): “Facial lymph nodes are variable in number, usually small.”
- **Localización.** Está en la cara, a lo largo del surco nasolabial.
  - [Facial lymph nodes](https://en.wikipedia.org/w/index.php?title=Facial_lymph_nodes&oldid=1384390704): “situated along the nasolabial sulcus”
- **Reparo.** El surco nasolabial y, a lo largo de él, la vena facial, que siguen todos los nodos faciales.
  - [Facial lymph nodes](https://en.wikipedia.org/w/index.php?title=Facial_lymph_nodes&oldid=1384390704): “situated along the nasolabial sulcus”
  - [Facial lymph nodes](https://en.wikipedia.org/w/index.php?title=Facial_lymph_nodes&oldid=1384390704): “situated along the length of the facial vein”
- **Recibe.** Cada subgrupo facial drena la piel y la mucosa vecinas.
  - [Facial lymph nodes](https://en.wikipedia.org/w/index.php?title=Facial_lymph_nodes&oldid=1384390704): “Each subgroup is responsible for drainage of adjacent skin and mucosae.”
- **Recibe.** Los aferentes de los nodos faciales vienen de los párpados, la conjuntiva y la piel y la mucosa de la nariz y la mejilla.
  - [Facial lymph nodes](https://en.wikipedia.org/w/index.php?title=Facial_lymph_nodes&oldid=1384390704): “Their afferent vessels drain the eyelids, the conjunctiva, and the skin and mucous membrane of the nose and cheek.”
- **Drena en.** De arriba abajo, cada nodo facial drena en el que está justo por debajo, y el último drena en los nodos submandibulares.
  - [Facial lymph nodes](https://en.wikipedia.org/w/index.php?title=Facial_lymph_nodes&oldid=1384390704): “Superoinferiorly, each node drains into the one immediately inferior to it, with the last draining into submandibular lymph nodes”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo los tres nodos faciales quedan, de arriba abajo, en este orden: nasolabial, bucinador y mandibular; el nodo malar de la Terminologia Anatomica no está representado.
  - TA2 n.º 5209: Malar node (*Nodus malaris*)
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **Punto clave.** Cuando aumentan de tamaño se palpan como un «guisante firme»; la causa puede ser una infección dental.
  - [Facial lymph nodes](https://en.wikipedia.org/w/index.php?title=Facial_lymph_nodes&oldid=1384390704): “these nodes are described as feeling like a "firm pea"”
  - [Facial lymph nodes](https://en.wikipedia.org/w/index.php?title=Facial_lymph_nodes&oldid=1384390704): “Lymphadenopathy of these nodes may be result from dental infections.”
- Vías en la app: recibe —; drena en `Bucinator_node`.

### Bucinator_node

Nombre: TA2 n.º 5207 (*Nodus bucinatorius*; Bucinator node).

- **Descripción.** Uno o más nodos (ganglios) linfáticos colocados sobre el músculo buccinador, frente al ángulo de la boca.
  - [Buccinator lymph node](https://en.wikipedia.org/w/index.php?title=Buccinator_lymph_node&oldid=1224152120): “are one or more lymph nodes placed on the buccinator opposite the angle of the mouth”
- **Descripción.** Pertenece a los nodos faciales: hasta 12 nodos superficiales, pequeños y de número variable, a lo largo de la vena facial.
  - [Facial lymph nodes](https://en.wikipedia.org/w/index.php?title=Facial_lymph_nodes&oldid=1384390704): “The facial lymph nodes are a group of up to 12 superficial lymph nodes of the head situated along the length of the facial vein”
  - [Facial lymph nodes](https://en.wikipedia.org/w/index.php?title=Facial_lymph_nodes&oldid=1384390704): “Facial lymph nodes are variable in number, usually small.”
- **Localización.** Está justo por fuera del músculo buccinador, a la altura del ángulo de la boca.
  - [Facial lymph nodes](https://en.wikipedia.org/w/index.php?title=Facial_lymph_nodes&oldid=1384390704): “situated immediately superficial to the bucinator muscle, opposite the angle of the mouth”
- **Reparo.** El músculo buccinador, por dentro, frente a la comisura de la boca; la vena facial pasa cerca, porque los nodos faciales la siguen.
  - [Facial lymph nodes](https://en.wikipedia.org/w/index.php?title=Facial_lymph_nodes&oldid=1384390704): “situated immediately superficial to the bucinator muscle, opposite the angle of the mouth”
  - [Facial lymph nodes](https://en.wikipedia.org/w/index.php?title=Facial_lymph_nodes&oldid=1384390704): “situated along the length of the facial vein”
- **Recibe.** Cada subgrupo facial drena la piel y la mucosa vecinas.
  - [Facial lymph nodes](https://en.wikipedia.org/w/index.php?title=Facial_lymph_nodes&oldid=1384390704): “Each subgroup is responsible for drainage of adjacent skin and mucosae.”
- **Recibe.** Los aferentes de los nodos faciales vienen de los párpados, la conjuntiva y la piel y la mucosa de la nariz y la mejilla.
  - [Facial lymph nodes](https://en.wikipedia.org/w/index.php?title=Facial_lymph_nodes&oldid=1384390704): “Their afferent vessels drain the eyelids, the conjunctiva, and the skin and mucous membrane of the nose and cheek.”
- **Recibe.** También le llega la linfa del nodo facial que está justo por encima.
  - [Facial lymph nodes](https://en.wikipedia.org/w/index.php?title=Facial_lymph_nodes&oldid=1384390704): “Superoinferiorly, each node drains into the one immediately inferior to it”
- **Drena en.** De arriba abajo, cada nodo facial drena en el que está justo por debajo, y el último drena en los nodos submandibulares.
  - [Facial lymph nodes](https://en.wikipedia.org/w/index.php?title=Facial_lymph_nodes&oldid=1384390704): “Superoinferiorly, each node drains into the one immediately inferior to it, with the last draining into submandibular lymph nodes”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo los tres nodos faciales quedan, de arriba abajo, en este orden: nasolabial, bucinador y mandibular; el nodo malar de la Terminologia Anatomica no está representado.
  - TA2 n.º 5209: Malar node (*Nodus malaris*)
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **Punto clave.** Cuando aumentan de tamaño se palpan como un «guisante firme»; la causa puede ser una infección dental.
  - [Facial lymph nodes](https://en.wikipedia.org/w/index.php?title=Facial_lymph_nodes&oldid=1384390704): “these nodes are described as feeling like a "firm pea"”
  - [Facial lymph nodes](https://en.wikipedia.org/w/index.php?title=Facial_lymph_nodes&oldid=1384390704): “Lymphadenopathy of these nodes may be result from dental infections.”
- Vías en la app: recibe `Nasolabial_node`; drena en `Mandibular_node`.

### Mandibular_node

Nombre: TA2 n.º 5210 (*Nodus mandibularis*; Mandibular node).

- **Descripción.** Nodo (ganglio) linfático facial situado sobre la mandíbula, delante del músculo masetero.
  - [Facial lymph nodes](https://en.wikipedia.org/w/index.php?title=Facial_lymph_nodes&oldid=1384390704): “situated within tissues superior to the surface of the mandible and anterior to the masseter muscle”
- **Descripción.** Pertenece a los nodos faciales: hasta 12 nodos superficiales, pequeños y de número variable, a lo largo de la vena facial.
  - [Facial lymph nodes](https://en.wikipedia.org/w/index.php?title=Facial_lymph_nodes&oldid=1384390704): “The facial lymph nodes are a group of up to 12 superficial lymph nodes of the head situated along the length of the facial vein”
  - [Facial lymph nodes](https://en.wikipedia.org/w/index.php?title=Facial_lymph_nodes&oldid=1384390704): “Facial lymph nodes are variable in number, usually small.”
- **Localización.** Está en los tejidos que cubren la cara externa de la mandíbula, por delante del masetero.
  - [Facial lymph nodes](https://en.wikipedia.org/w/index.php?title=Facial_lymph_nodes&oldid=1384390704): “situated within tissues superior to the surface of the mandible and anterior to the masseter muscle”
- **Reparo.** El borde anterior del masetero sobre la mandíbula, donde el nodo toca la arteria facial (en textos antiguos, «maxilar externa») y la vena facial (antes, «facial anterior»).
  - [Facial lymph nodes](https://en.wikipedia.org/w/index.php?title=Facial_lymph_nodes&oldid=1384390704): “placed alongside and in contact with external maxillary artery and anterior facial vein”
  - [Facial artery](https://en.wikipedia.org/w/index.php?title=Facial_artery&oldid=1380880316): “The facial artery, formerly called the external maxillary artery”
  - [Facial vein](https://en.wikipedia.org/w/index.php?title=Facial_vein&oldid=1240668445): “The facial vein (or anterior facial vein)”
- **Reparo.** La arteria facial cruza el cuerpo de la mandíbula en el ángulo anteroinferior del masetero (la escotadura antegonial).
  - [Facial artery](https://en.wikipedia.org/w/index.php?title=Facial_artery&oldid=1380880316): “It then curves upward over the body of the mandible at the antero-inferior angle of the masseter (the antegonial notch)”
- **Recibe.** Cada subgrupo facial drena la piel y la mucosa vecinas.
  - [Facial lymph nodes](https://en.wikipedia.org/w/index.php?title=Facial_lymph_nodes&oldid=1384390704): “Each subgroup is responsible for drainage of adjacent skin and mucosae.”
- **Recibe.** Los aferentes de los nodos faciales vienen de los párpados, la conjuntiva y la piel y la mucosa de la nariz y la mejilla.
  - [Facial lymph nodes](https://en.wikipedia.org/w/index.php?title=Facial_lymph_nodes&oldid=1384390704): “Their afferent vessels drain the eyelids, the conjunctiva, and the skin and mucous membrane of the nose and cheek.”
- **Recibe.** También le llega la linfa del nodo facial que está justo por encima.
  - [Facial lymph nodes](https://en.wikipedia.org/w/index.php?title=Facial_lymph_nodes&oldid=1384390704): “Superoinferiorly, each node drains into the one immediately inferior to it”
- **Drena en.** Es el último de la cadena facial: drena en los nodos submandibulares.
  - [Facial lymph nodes](https://en.wikipedia.org/w/index.php?title=Facial_lymph_nodes&oldid=1384390704): “with the last draining into submandibular lymph nodes”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo los tres nodos faciales quedan, de arriba abajo, en este orden: nasolabial, bucinador y mandibular; el nodo malar de la Terminologia Anatomica no está representado.
  - TA2 n.º 5209: Malar node (*Nodus malaris*)
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **Punto clave.** Cuando aumentan de tamaño se palpan como un «guisante firme»; la causa puede ser una infección dental.
  - [Facial lymph nodes](https://en.wikipedia.org/w/index.php?title=Facial_lymph_nodes&oldid=1384390704): “these nodes are described as feeling like a "firm pea"”
  - [Facial lymph nodes](https://en.wikipedia.org/w/index.php?title=Facial_lymph_nodes&oldid=1384390704): “Lymphadenopathy of these nodes may be result from dental infections.”
- Vías en la app: recibe `Bucinator_node`; drena en `Submandibular_nodes`.

### Submandibular_nodes

Nombre: TA2 n.º 5214 (*Nodi submandibulares*; Submandibular nodes).

- **Descripción.** Grupo de unos 3 a 6 nodos (ganglios) linfáticos bajo el cuerpo de la mandíbula; en textos antiguos, «glándulas submaxilares».
  - [Submandibular lymph nodes](https://en.wikipedia.org/w/index.php?title=Submandibular_lymph_nodes&oldid=1285412030): “submaxillary glands in older texts”
  - [Submandibular lymph nodes](https://en.wikipedia.org/w/index.php?title=Submandibular_lymph_nodes&oldid=1285412030): “are some 3-6 lymph nodes”
- **Localización.** Están en el triángulo submandibular, entre el vientre anterior del digástrico, el estilohioideo y el cuerpo de la mandíbula.
  - [Cervical lymph nodes](https://en.wikipedia.org/w/index.php?title=Cervical_lymph_nodes&oldid=1360586838): “Submandibular triangle - posterolateral to the anterior belly of the digastric muscle between the area formed by its margin, the stylohyoid muscle and the body of the mandible”
- **Localización.** Quedan justo por fuera de la glándula submandibular y por detrás y por fuera del vientre anterior del digástrico.
  - [Submandibular lymph nodes](https://en.wikipedia.org/w/index.php?title=Submandibular_lymph_nodes&oldid=1285412030): “They are situated just superficial to the submandibular salivary gland, and posterolateral to the anterior belly of either digastric muscle.”
- **Reparo.** La glándula submandibular, que queda más profunda que los nodos.
  - [Submandibular lymph nodes](https://en.wikipedia.org/w/index.php?title=Submandibular_lymph_nodes&oldid=1285412030): “just superficial to the submandibular salivary gland”
- **Reparo.** La arteria facial donde rodea el borde de la mandíbula: sobre ella está el nodo más constante, el nodo medio de Stahr.
  - [Submandibular lymph nodes](https://en.wikipedia.org/w/index.php?title=Submandibular_lymph_nodes&oldid=1285412030): “the middle gland of Stahr, which lies on the facial artery as it turns over the mandible, is the most constant of the series”
- **Recibe.** Drenan el labio superior, el cuerpo de la lengua, las mejillas, la parte anterior del paladar duro y la mayoría de los dientes con su periodonto y su encía; no los incisivos inferiores ni los terceros molares.
  - [Submandibular lymph nodes](https://en.wikipedia.org/w/index.php?title=Submandibular_lymph_nodes&oldid=1285412030): “They drain the upper lip, body of tongue, cheeks, anterior portion of the hard palate, and most teeth with their associated periodontium and gingiva (except for the mandibular incisor teeth and third molar teeth).”
- **Recibe.** También pueden recibir la linfa de los nodos faciales y de los submentonianos.
  - [Submandibular lymph nodes](https://en.wikipedia.org/w/index.php?title=Submandibular_lymph_nodes&oldid=1285412030): “The facial and submental lymph nodes may also drain into the submandibular glands.”
- **Drena en.** Drenan en los nodos cervicales profundos superiores.
  - [Submandibular lymph nodes](https://en.wikipedia.org/w/index.php?title=Submandibular_lymph_nodes&oldid=1285412030): “They drain to the superior deep cervical lymph nodes.”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo están en el grupo de los nodos del cuello, como en la Terminologia Anatomica 2.
  - TA2 n.º 5212: Lymph nodes of neck (*Nodi lymphoidei colli*)
  - TA2 n.º 5214: Submandibular nodes (*Nodi submandibulares*)
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **Punto clave.** En la clasificación clínica por niveles, los submandibulares forman el nivel IB y los submentonianos el IA.
  - [Cervical lymph nodes](https://en.wikipedia.org/w/index.php?title=Cervical_lymph_nodes&oldid=1360586838): “Level I: Submental and submandibular nodes”
  - [Cervical lymph nodes](https://en.wikipedia.org/w/index.php?title=Cervical_lymph_nodes&oldid=1360586838): “Level Ib: Submandibular triangle”
- **Punto clave.** Su aumento de tamaño se debe sobre todo a infecciones de la cabeza, el cuello, los oídos, los ojos, los senos paranasales, la faringe y el cuero cabelludo.
  - [Submandibular lymph nodes](https://en.wikipedia.org/w/index.php?title=Submandibular_lymph_nodes&oldid=1285412030): “The most common causes of enlargement of the submandibular lymph nodes are infections of the head, neck, ears, eyes, nasal sinuses, pharynx, and scalp.”
- Vías en la app: recibe `Mandibular_node`, `Submental_nodes`; drena en `Lateral_superior_jugular_node`, `Jugulodigastric_node`.

### Submental_nodes

Nombre: TA2 n.º 5213 (*Nodi submentales*; Submental nodes).

- **Descripción.** Grupo de nodos (ganglios) linfáticos del triángulo submentoniano: son 2 o 3 y también se llaman suprahioideos.
  - [Submental lymph nodes](https://en.wikipedia.org/w/index.php?title=Submental_lymph_nodes&oldid=1370068512): “are 2-3 lymph nodes situated in the submental triangle”
  - [Submental lymph nodes](https://en.wikipedia.org/w/index.php?title=Submental_lymph_nodes&oldid=1370068512): “or suprahyoid lymph nodes”
- **Localización.** Están en el triángulo submentoniano, entre los vientres anteriores de los dos digástricos y el hueso hioides, cerca de la línea media.
  - [Submental lymph nodes](https://en.wikipedia.org/w/index.php?title=Submental_lymph_nodes&oldid=1370068512): “situated in the submental triangle, between the anterior bellies of the digastric muscle and the hyoid bone”
  - [Submental lymph nodes](https://en.wikipedia.org/w/index.php?title=Submental_lymph_nodes&oldid=1370068512): “They are situated close to the midline.”
- **Localización.** Ocupan el espacio fascial submentoniano, justo por fuera del músculo milohioideo.
  - [Submental lymph nodes](https://en.wikipedia.org/w/index.php?title=Submental_lymph_nodes&oldid=1370068512): “situated in the submental fascial space”
  - [Submental lymph nodes](https://en.wikipedia.org/w/index.php?title=Submental_lymph_nodes&oldid=1370068512): “They are immediately superficial to the mylohyoid muscle.”
- **Reparo.** Los vientres anteriores de los digástricos, a cada lado, y el cuerpo del hioides, como base del triángulo; el milohioideo queda por encima de ellos, más profundo.
  - [Cervical lymph nodes](https://en.wikipedia.org/w/index.php?title=Cervical_lymph_nodes&oldid=1360586838): “between a triangle formed by the anterior belly of the digastric muscles on each side, and with the hyoid as its base”
  - [Submental lymph nodes](https://en.wikipedia.org/w/index.php?title=Submental_lymph_nodes&oldid=1370068512): “They are immediately superficial to the mylohyoid muscle.”
- **Recibe.** Drenan el labio inferior, el suelo de la boca, la punta de la lengua, el mentón y los incisivos inferiores con su periodonto y su encía.
  - [Submental lymph nodes](https://en.wikipedia.org/w/index.php?title=Submental_lymph_nodes&oldid=1370068512): “They drain the lower lip, floor of the mouth, apex of the tongue, chin, and inferior/mandibular incisor teeth and their associated periodontium and gingiva.”
- **Drena en.** Drenan en los nodos submandibulares, que a su vez van a los cervicales profundos, o directamente en los cervicales profundos.
  - [Submental lymph nodes](https://en.wikipedia.org/w/index.php?title=Submental_lymph_nodes&oldid=1370068512): “They drain either to submandibular lymph nodes (which then drain to deep cervical lymph nodes), or to the deep cervical lymph nodes directly.”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo el grupo es una pieza por lado, aunque los nodos están cerca de la línea media.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo están en el grupo de los nodos del cuello, como en la Terminologia Anatomica 2.
  - TA2 n.º 5212: Lymph nodes of neck (*Nodi lymphoidei colli*)
  - TA2 n.º 5213: Submental nodes (*Nodi submentales*)
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo los nodos se recolocaron por debajo del milohioideo y, en parte, entre los vientres anteriores de los digástricos; es una colocación esquemática.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **Punto clave.** En la clasificación clínica por niveles forman el nivel IA.
  - [Cervical lymph nodes](https://en.wikipedia.org/w/index.php?title=Cervical_lymph_nodes&oldid=1360586838): “Level Ia: Submental”
- **Punto clave.** Su aumento de tamaño se debe sobre todo a infecciones, entre ellas las dentales.
  - [Submental lymph nodes](https://en.wikipedia.org/w/index.php?title=Submental_lymph_nodes&oldid=1370068512): “The most common cause of enlargement of the submental lymph nodes are infections”
  - [Submental lymph nodes](https://en.wikipedia.org/w/index.php?title=Submental_lymph_nodes&oldid=1370068512): “and dental infections”
- Vías en la app: recibe —; drena en `Submandibular_nodes`, `Lateral_superior_jugular_node`, `Jugulodigastric_node`.
