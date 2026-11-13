---
title: Fuentes de las fichas linfáticas de la pelvis
date: 2026-11-12
---

# Fuentes de las fichas linfáticas de la pelvis (2026-11-12)

Qué fuente respalda cada frase de las fichas de `web/src/data/linfatico/pelvis.js` (grupo `Pelvic_lymph_nodes`): nodos ilíacos comunes (mediales, intermedios, laterales, subaórticos, sacros medianos), ilíacos externos (mediales, intermedios), lacunares (medial, intermedio, lateral), obturadores, glúteos superiores e inferiores, sacros laterales, paravesicales (prevesicales, retrovesicales, vesicales laterales) y pararrectales. Son 18 fichas, una por clave sin lado; cada una sirve a las piezas `_L` y `_R` (o a la pieza impar) de los dos modelos.

Todo es **borrador** redactado con IA (Claude) a partir de las fuentes citadas, **sin revisión de un especialista**.

## Cómo se comprobó

1. Páginas bajadas con `node scripts/linfatico-citas.mjs bajar …` (Wikipedia en inglés y en español, CC BY-SA 4.0; texto plano de la API) y registradas con su revisión en `web/src/data/linfatico/comprobadas.js`. Las páginas de los nodos ilíacos, sacros e ilíacos internos incorporan texto de dominio público del Gray de 1918 (pp. 703–704).
2. `node scripts/linfatico-citas.mjs comprobar`: las 165 citas de estas fichas, en 20 páginas, se encontraron palabra por palabra (588 en total con las demás regiones el 12 nov 2026, 0 sin encontrar).
3. `node scripts/check-cards.mjs`: «todo correcto»; 2 avisos de campos pendientes (`drena` de `Median_sacral_nodes` y de `Obturator_nodes`).
4. La subdivisión en mediales, intermedios, laterales, lacunares, etc. es la de la TA2 y se cita por su número; las fuentes libres describen los grupos en conjunto.

## Estado en el modelo publicado (12 nov 2026)

- Las 28 piezas del grupo `Pelvic_lymph_nodes` (18 claves) tienen ficha propia en los dos modelos, incluidos los lacunares nuevos y `Subaortic_nodes`.
- `Subaortic_nodes` pasó del abdomen a la pelvis (ilíacos comunes, TA2 n.º 5323), como en Z-Anatomy y en la TA2. Su ficha lo dice en «En este modelo».
- Los lacunares (`Medial_`, `Intermediate_`, `Lateral_lacunar_node`) son piezas nuevas: Z-Anatomy los traía ocultos (nombre entre paréntesis en la TA2) pero con malla válida. Se recolocaron en la laguna vascular, al final de los vasos ilíacos externos (recolocación declarada en `docs/hitos/09-sistema-linfatico.md`). La frase anterior de la ficha («a veces solo como un punto sin malla») se corrigió.
- Relaciones medidas (`build/linfatico/relaciones-<modelo>.json`, regla «a ≤ 8 mm de la arteria o la vena ilíaca externa»): lacunares 6/6, ilíacos externos 30/30, ilíacos comunes 18/18, subaórticos 3/3 y obturadores 8/8, en hombre y mujer.

## Contraste con la tabla de drenaje del encargo

Confirmadas por las fuentes:
- Ilíacos externos (y lacunares, que la TA2 incluye en ellos) → ilíacos comunes → aórticos laterales (*Common iliac lymph nodes*: «They drain chiefly the hypogastric and external iliac glands», «their efferents pass to the lateral aortic glands»).
- Glúteos superiores e inferiores y sacros laterales (ilíacos internos) → ilíacos comunes (misma cita).
- Subaórticos → ilíacos comunes / lumbares: como parte de los ilíacos comunes (TA2), sus eferentes van a los aórticos laterales.

Matizadas:
- «Lacunares → ilíacos comunes»: las rutas del modelo los llevan antes a los ilíacos externos mediales e intermedios; la ficha los trata como parte de los ilíacos externos (TA2 n.º 5325) y no afirma un paso intermedio.
- «Median_sacral → ilíacos comunes/lumbares»: ninguna fuente libre consultada lo dice; `drena` queda pendiente. La ruta del modelo (sacros medianos → ilíacos comunes mediales) está marcada *esquemático*.

Contradicciones y vías sin fuente:
- CONTRADICCIÓN: `Pararectal_nodes` · tabla: «Pararectal → ilíacos internos» · fuente: wp:Pararectal_lymph_nodes «Their efferent lymph ducts pass to the pre-aortic lymph nodes.» · se escribió: drenan en los preaórticos (vía `Pre_aortic_nodes`); la mitad superior del recto drena también en los ilíacos internos (*Internal iliac lymph nodes*), dicho en «En este modelo». La ruta del modelo lleva los pararrectales a los sacros laterales.
- CONTRADICCIÓN: `Prevesical_nodes`, `Postvesical_nodes`, `Lateral_vesical_nodes` · tabla: «→ ilíacos internos» · fuente: wp:Urinary_bladder «The majority of these vessels drain into the external iliac lymph nodes.» y wpes:Vejiga_urinaria «de ahí a los ilíacos externos y a los hipogástricos» · se escribió: sobre todo a los ilíacos externos, también a los hipogástricos (vías a los ilíacos externos). Las rutas del modelo los llevan a los glúteos inferiores.
- SIN FUENTE: `Obturator_nodes` · tabla: «Obturator → Medial_external_iliac» · ninguna fuente libre consultada dice adónde van; `drena` queda pendiente. La ruta del modelo está marcada *documentado* y debería ser *esquemático*.

## Páginas citadas

- `wp:Cervix`: «Cervix», revisión 1382456224 (https://en.wikipedia.org/w/index.php?title=Cervix&oldid=1382456224), consultada 2026-11-12, CC BY-SA 4.0
- `wp:Common_iliac_artery`: «Common iliac artery», revisión 1380880982 (https://en.wikipedia.org/w/index.php?title=Common_iliac_artery&oldid=1380880982), consultada 2026-11-10, CC BY-SA 4.0
- `wp:Common_iliac_lymph_nodes`: «Common iliac lymph nodes», revisión 1238348833 (https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833), consultada 2026-11-10, CC BY-SA 4.0
- `wp:Deep_inguinal_lymph_nodes`: «Inguinal lymph nodes», revisión 1330887775 (https://en.wikipedia.org/w/index.php?title=Inguinal_lymph_nodes&oldid=1330887775), consultada 2026-11-12, CC BY-SA 4.0
- `wp:External_iliac_artery`: «External iliac artery», revisión 1380894405 (https://en.wikipedia.org/w/index.php?title=External_iliac_artery&oldid=1380894405), consultada 2026-11-10, CC BY-SA 4.0
- `wp:External_iliac_lymph_nodes`: «External iliac lymph nodes», revisión 1223684511 (https://en.wikipedia.org/w/index.php?title=External_iliac_lymph_nodes&oldid=1223684511), consultada 2026-11-10, CC BY-SA 4.0
- `wp:Inferior_gluteal_artery`: «Inferior gluteal artery», revisión 1293709222 (https://en.wikipedia.org/w/index.php?title=Inferior_gluteal_artery&oldid=1293709222), consultada 2026-11-10, CC BY-SA 4.0
- `wp:Internal_iliac_lymph_nodes`: «Internal iliac lymph nodes», revisión 1358630094 (https://en.wikipedia.org/w/index.php?title=Internal_iliac_lymph_nodes&oldid=1358630094), consultada 2026-11-10, CC BY-SA 4.0
- `wp:Lacuna_vasorum`: «Vascular lacuna», revisión 1345649176 (https://en.wikipedia.org/w/index.php?title=Vascular_lacuna&oldid=1345649176), consultada 2026-11-12, CC BY-SA 4.0
- `wp:Lacunar_ligament`: «Lacunar ligament», revisión 1257215334 (https://en.wikipedia.org/w/index.php?title=Lacunar_ligament&oldid=1257215334), consultada 2026-11-12, CC BY-SA 4.0
- `wp:Lateral_sacral_artery`: «Lateral sacral artery», revisión 1380881537 (https://en.wikipedia.org/w/index.php?title=Lateral_sacral_artery&oldid=1380881537), consultada 2026-11-10, CC BY-SA 4.0
- `wp:Lumbar_lymph_nodes`: «Periaortic lymph nodes», revisión 1320392388 (https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388), consultada 2026-11-10, CC BY-SA 4.0
- `wp:Median_sacral_artery`: «Median sacral artery», revisión 1380884477 (https://en.wikipedia.org/w/index.php?title=Median_sacral_artery&oldid=1380884477), consultada 2026-11-10, CC BY-SA 4.0
- `wp:Obturator_artery`: «Obturator artery», revisión 1380881122 (https://en.wikipedia.org/w/index.php?title=Obturator_artery&oldid=1380881122), consultada 2026-11-10, CC BY-SA 4.0
- `wp:Pararectal_lymph_nodes`: «Pararectal lymph nodes», revisión 1358630243 (https://en.wikipedia.org/w/index.php?title=Pararectal_lymph_nodes&oldid=1358630243), consultada 2026-11-10, CC BY-SA 4.0
- `wp:Prostate`: «Prostate», revisión 1379380115 (https://en.wikipedia.org/w/index.php?title=Prostate&oldid=1379380115), consultada 2026-11-12, CC BY-SA 4.0
- `wp:Sacral_lymph_nodes`: «Sacral lymph nodes», revisión 1302423600 (https://en.wikipedia.org/w/index.php?title=Sacral_lymph_nodes&oldid=1302423600), consultada 2026-11-10, CC BY-SA 4.0
- `wp:Superior_gluteal_artery`: «Superior gluteal artery», revisión 1380892550 (https://en.wikipedia.org/w/index.php?title=Superior_gluteal_artery&oldid=1380892550), consultada 2026-11-10, CC BY-SA 4.0
- `wp:Urinary_bladder`: «Bladder», revisión 1379190325 (https://en.wikipedia.org/w/index.php?title=Bladder&oldid=1379190325), consultada 2026-11-12, CC BY-SA 4.0
- `wpes:Vejiga_urinaria`: «Vejiga urinaria», revisión 174975432 (https://es.wikipedia.org/w/index.php?title=Vejiga_urinaria&oldid=174975432), consultada 2026-11-12, CC BY-SA 4.0

## Fichas

### Medial_common_iliac_nodes

Nombre: TA2 n.º 5320 (*Nodi iliaci communes mediales*; Medial common iliac nodes).

- **Descripción.** Nodos (ganglios) ilíacos comunes mediales: el subgrupo medial de los nodos ilíacos comunes en la Terminologia Anatomica.
  - TA2 n.º 5319: Common iliac nodes (*Nodi iliaci communes*)
  - TA2 n.º 5320: Medial common iliac nodes (*Nodi iliaci communes mediales*)
- **Descripción.** Los nodos ilíacos comunes recogen sobre todo la linfa de los ilíacos internos y externos y la pasan a los nodos lumbares.
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “They drain chiefly the hypogastric and external iliac glands”
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “their efferents pass to the lateral aortic glands”
- **Localización.** Los nodos ilíacos comunes, de cuatro a seis, se agrupan por detrás y a los lados de la arteria ilíaca común.
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “The common iliac lymph nodes, four to six in number”
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “are grouped behind and on the sides of the common iliac artery”
- **Localización.** La arteria ilíaca común nace de la bifurcación de la aorta, a la altura de la cuarta vértebra lumbar, baja por el borde medial del psoas y se divide en el borde de la pelvis, delante de la articulación sacroilíaca.
  - [Common iliac artery](https://en.wikipedia.org/w/index.php?title=Common_iliac_artery&oldid=1380880982): “It originates from the aortic bifurcation at the level of the 4th lumbar vertebra.”
  - [Common iliac artery](https://en.wikipedia.org/w/index.php?title=Common_iliac_artery&oldid=1380880982): “It runs inferolaterally, along the medial border of the psoas muscles.”
  - [Common iliac artery](https://en.wikipedia.org/w/index.php?title=Common_iliac_artery&oldid=1380880982): “It bifurcates into the external iliac artery and the internal iliac artery at the pelvic brim, in front of the sacroiliac joints.”
- **Reparo.** La arteria ilíaca común, con su vena, que va por detrás y a la derecha de ella.
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “are grouped behind and on the sides of the common iliac artery”
  - [Common iliac artery](https://en.wikipedia.org/w/index.php?title=Common_iliac_artery&oldid=1380880982): “Both common iliac arteries are accompanied along their course by the two common iliac veins, which lie posteriorly and to the right.”
- **Recibe.** Reciben sobre todo la linfa de los nodos ilíacos internos (hipogástricos) y de los ilíacos externos.
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “They drain chiefly the hypogastric and external iliac glands”
  - [Internal iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Internal_iliac_lymph_nodes&oldid=1358630094): “The internal iliac lymph nodes (or hypogastric lymph nodes)”
- **Drena en.** Sus eferentes van a los nodos aórticos laterales (lumbares).
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “their efferents pass to the lateral aortic glands”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “(a) the efferents of the common iliac lymph nodes”
- **Drena en.** En el lado derecho, esos nodos lumbares están en parte delante de la vena cava inferior.
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “The right paraaortic nodes, are situated partly in front of the inferior vena cava”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo es una sola pieza, sin lado izquierdo ni derecho.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** La posición de los nodos mediales dentro del grupo sigue su nombre en la Terminologia Anatomica; las fuentes libres consultadas no la describen por separado.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe `Medial_external_iliac_nodes`, `Intermediate_external_iliac_nodes`, `Superior_gluteal_nodes`, `Inferior_gluteal_nodes`, `Lateral_sacral_nodes`; drena en `Lateral_aortic_nodes`, `Lateral_caval_nodes`.

### Intermediate_common_iliac_nodes

Nombre: TA2 n.º 5321 (*Nodi iliaci communes intermedii*; Intermediate common iliac nodes).

- **Descripción.** Nodos (ganglios) ilíacos comunes intermedios: el subgrupo intermedio de los nodos ilíacos comunes en la Terminologia Anatomica.
  - TA2 n.º 5319: Common iliac nodes (*Nodi iliaci communes*)
  - TA2 n.º 5321: Intermediate common iliac nodes (*Nodi iliaci communes intermedii*)
- **Descripción.** Los nodos ilíacos comunes recogen sobre todo la linfa de los ilíacos internos y externos y la pasan a los nodos lumbares.
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “They drain chiefly the hypogastric and external iliac glands”
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “their efferents pass to the lateral aortic glands”
- **Localización.** Los nodos ilíacos comunes, de cuatro a seis, se agrupan por detrás y a los lados de la arteria ilíaca común.
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “The common iliac lymph nodes, four to six in number”
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “are grouped behind and on the sides of the common iliac artery”
- **Localización.** La arteria ilíaca común nace de la bifurcación de la aorta, a la altura de la cuarta vértebra lumbar, baja por el borde medial del psoas y se divide en el borde de la pelvis, delante de la articulación sacroilíaca.
  - [Common iliac artery](https://en.wikipedia.org/w/index.php?title=Common_iliac_artery&oldid=1380880982): “It originates from the aortic bifurcation at the level of the 4th lumbar vertebra.”
  - [Common iliac artery](https://en.wikipedia.org/w/index.php?title=Common_iliac_artery&oldid=1380880982): “It runs inferolaterally, along the medial border of the psoas muscles.”
  - [Common iliac artery](https://en.wikipedia.org/w/index.php?title=Common_iliac_artery&oldid=1380880982): “It bifurcates into the external iliac artery and the internal iliac artery at the pelvic brim, in front of the sacroiliac joints.”
- **Reparo.** La arteria ilíaca común, con su vena, que va por detrás y a la derecha de ella.
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “are grouped behind and on the sides of the common iliac artery”
  - [Common iliac artery](https://en.wikipedia.org/w/index.php?title=Common_iliac_artery&oldid=1380880982): “Both common iliac arteries are accompanied along their course by the two common iliac veins, which lie posteriorly and to the right.”
- **Recibe.** Reciben sobre todo la linfa de los nodos ilíacos internos (hipogástricos) y de los ilíacos externos.
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “They drain chiefly the hypogastric and external iliac glands”
  - [Internal iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Internal_iliac_lymph_nodes&oldid=1358630094): “The internal iliac lymph nodes (or hypogastric lymph nodes)”
- **Drena en.** Sus eferentes van a los nodos aórticos laterales (lumbares).
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “their efferents pass to the lateral aortic glands”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “(a) the efferents of the common iliac lymph nodes”
- **Drena en.** En el lado derecho, esos nodos lumbares están en parte delante de la vena cava inferior.
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “The right paraaortic nodes, are situated partly in front of the inferior vena cava”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo es una sola pieza, sin lado izquierdo ni derecho.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** La posición de los nodos intermedios dentro del grupo sigue su nombre en la Terminologia Anatomica; las fuentes libres consultadas no la describen por separado.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe `Medial_external_iliac_nodes`, `Intermediate_external_iliac_nodes`, `Superior_gluteal_nodes`, `Inferior_gluteal_nodes`, `Lateral_sacral_nodes`; drena en `Lateral_aortic_nodes`, `Lateral_caval_nodes`.

### Lateral_common_iliac_nodes

Nombre: TA2 n.º 5322 (*Nodi iliaci communes latérales*; Lateral common iliac nodes).

- **Descripción.** Nodos (ganglios) ilíacos comunes laterales: el subgrupo lateral de los nodos ilíacos comunes en la Terminologia Anatomica.
  - TA2 n.º 5319: Common iliac nodes (*Nodi iliaci communes*)
  - TA2 n.º 5322: Lateral common iliac nodes (*Nodi iliaci communes latérales*)
- **Descripción.** Los nodos ilíacos comunes recogen sobre todo la linfa de los ilíacos internos y externos y la pasan a los nodos lumbares.
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “They drain chiefly the hypogastric and external iliac glands”
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “their efferents pass to the lateral aortic glands”
- **Localización.** Los nodos ilíacos comunes, de cuatro a seis, se agrupan por detrás y a los lados de la arteria ilíaca común.
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “The common iliac lymph nodes, four to six in number”
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “are grouped behind and on the sides of the common iliac artery”
- **Localización.** La arteria ilíaca común nace de la bifurcación de la aorta, a la altura de la cuarta vértebra lumbar, baja por el borde medial del psoas y se divide en el borde de la pelvis, delante de la articulación sacroilíaca.
  - [Common iliac artery](https://en.wikipedia.org/w/index.php?title=Common_iliac_artery&oldid=1380880982): “It originates from the aortic bifurcation at the level of the 4th lumbar vertebra.”
  - [Common iliac artery](https://en.wikipedia.org/w/index.php?title=Common_iliac_artery&oldid=1380880982): “It runs inferolaterally, along the medial border of the psoas muscles.”
  - [Common iliac artery](https://en.wikipedia.org/w/index.php?title=Common_iliac_artery&oldid=1380880982): “It bifurcates into the external iliac artery and the internal iliac artery at the pelvic brim, in front of the sacroiliac joints.”
- **Reparo.** La arteria ilíaca común, con su vena, que va por detrás y a la derecha de ella.
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “are grouped behind and on the sides of the common iliac artery”
  - [Common iliac artery](https://en.wikipedia.org/w/index.php?title=Common_iliac_artery&oldid=1380880982): “Both common iliac arteries are accompanied along their course by the two common iliac veins, which lie posteriorly and to the right.”
- **Recibe.** Reciben sobre todo la linfa de los nodos ilíacos internos (hipogástricos) y de los ilíacos externos.
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “They drain chiefly the hypogastric and external iliac glands”
  - [Internal iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Internal_iliac_lymph_nodes&oldid=1358630094): “The internal iliac lymph nodes (or hypogastric lymph nodes)”
- **Drena en.** Sus eferentes van a los nodos aórticos laterales (lumbares).
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “their efferents pass to the lateral aortic glands”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “(a) the efferents of the common iliac lymph nodes”
- **Drena en.** En el lado derecho, esos nodos lumbares están en parte delante de la vena cava inferior.
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “The right paraaortic nodes, are situated partly in front of the inferior vena cava”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo una sola pieza, sin lado, reúne los nodos de los dos lados.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** La posición de los nodos laterales dentro del grupo sigue su nombre en la Terminologia Anatomica; las fuentes libres consultadas no la describen por separado.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** El latín del modelo se escribe sin tilde, como en la Terminologia Anatomica: «laterales» y no «latérales».
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe `Medial_external_iliac_nodes`, `Intermediate_external_iliac_nodes`, `Superior_gluteal_nodes`, `Inferior_gluteal_nodes`, `Lateral_sacral_nodes`; drena en `Lateral_aortic_nodes`, `Lateral_caval_nodes`.

### Subaortic_nodes

Nombre: TA2 n.º 5323 (*Nodi subaortici*; Subaortic nodes).

- **Descripción.** Nodos (ganglios) subaórticos: en la Terminologia Anatomica forman parte de los nodos ilíacos comunes.
  - TA2 n.º 5319: Common iliac nodes (*Nodi iliaci communes*)
  - TA2 n.º 5323: Subaortic nodes (*Nodi subaortici*)
- **Localización.** Entre los nodos ilíacos comunes, uno o dos se sitúan por debajo de la bifurcación de la aorta, delante de la quinta vértebra lumbar.
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “one or two being placed below the bifurcation of the aorta, in front of the fifth lumbar vertebra”
- **Localización.** La aorta se bifurca en las dos arterias ilíacas comunes a la altura de la cuarta vértebra lumbar.
  - [Common iliac artery](https://en.wikipedia.org/w/index.php?title=Common_iliac_artery&oldid=1380880982): “It originates from the aortic bifurcation at the level of the 4th lumbar vertebra.”
- **Reparo.** La bifurcación de la aorta, entre el origen de las dos arterias ilíacas comunes.
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “one or two being placed below the bifurcation of the aorta, in front of the fifth lumbar vertebra”
  - [Common iliac artery](https://en.wikipedia.org/w/index.php?title=Common_iliac_artery&oldid=1380880982): “It originates from the aortic bifurcation at the level of the 4th lumbar vertebra.”
- **Recibe.** Como nodos ilíacos comunes, reciben sobre todo la linfa de los nodos ilíacos internos y externos.
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “They drain chiefly the hypogastric and external iliac glands”
- **Drena en.** Como nodos ilíacos comunes, sus eferentes van a los nodos aórticos laterales.
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “their efferents pass to the lateral aortic glands”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “(a) the efferents of the common iliac lymph nodes”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo es una sola pieza, sin lado izquierdo ni derecho.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** Se interpreta que los uno o dos nodos que Gray sitúa bajo la bifurcación de la aorta son estos nodos subaórticos; las fuentes libres consultadas no lo dicen con ese nombre.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo la pieza está en el grupo de los nodos de la pelvis, con los ilíacos comunes, como en Z-Anatomy y en la Terminologia Anatomica; en versiones anteriores del modelo aparecía entre los nodos del abdomen.
  - TA2 n.º 5319: Common iliac nodes (*Nodi iliaci communes*)
  - TA2 n.º 5323: Subaortic nodes (*Nodi subaortici*)
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe `Medial_external_iliac_nodes`, `Intermediate_external_iliac_nodes`; drena en `Lateral_aortic_nodes`, `Lateral_caval_nodes`.

### Median_sacral_nodes

Nombre: TA2 n.º 5324 (*Nodi sacrales mediani*; Median sacral nodes).

- **Descripción.** Nodos (ganglios) sacros medianos: en la Terminologia Anatomica forman parte de los nodos ilíacos comunes.
  - TA2 n.º 5319: Common iliac nodes (*Nodi iliaci communes*)
  - TA2 n.º 5324: Median sacral nodes (*Nodi sacrales mediani*)
- **Localización.** Los nodos sacros están en la concavidad del sacro, en relación con las arterias sacras media y laterales.
  - [Sacral lymph nodes](https://en.wikipedia.org/w/index.php?title=Sacral_lymph_nodes&oldid=1302423600): “The sacral lymph nodes are placed in the concavity of the sacrum, in relation to the middle and lateral sacral arteries”
- **Localización.** La arteria sacra media baja por la línea media delante de la cuarta y la quinta vértebras lumbares, del sacro y del cóccix.
  - [Median sacral artery](https://en.wikipedia.org/w/index.php?title=Median_sacral_artery&oldid=1380884477): “It descends in the middle line in front of the fourth and fifth lumbar vertebrae, the sacrum and coccyx”
- **Reparo.** La arteria sacra media, en la línea media, sobre la cara anterior del sacro.
  - [Sacral lymph nodes](https://en.wikipedia.org/w/index.php?title=Sacral_lymph_nodes&oldid=1302423600): “The sacral lymph nodes are placed in the concavity of the sacrum, in relation to the middle and lateral sacral arteries”
  - [Median sacral artery](https://en.wikipedia.org/w/index.php?title=Median_sacral_artery&oldid=1380884477): “It descends in the middle line in front of the fourth and fifth lumbar vertebrae, the sacrum and coccyx”
- **Recibe.** Los nodos sacros reciben la linfa del recto y de la pared posterior de la pelvis.
  - [Sacral lymph nodes](https://en.wikipedia.org/w/index.php?title=Sacral_lymph_nodes&oldid=1302423600): “they receive lymphatics from the rectum and posterior wall of the pelvis”
- **Recibe.** A los nodos sacros llega también linfa de la próstata.
  - [Prostate](https://en.wikipedia.org/w/index.php?title=Prostate&oldid=1379380115): “Vessels of the prostate itself also drain into the obturator and sacral lymph nodes.”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo es una sola pieza, sin lado izquierdo ni derecho.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **Drena en: pendiente.** Ninguna fuente libre consultada describe adónde van los eferentes de los nodos sacros medianos; no se afirma nada.

### Medial_external_iliac_nodes

Nombre: TA2 n.º 5326 (*Nodi iliaci externi mediales*; Medial external iliac nodes).

- **Descripción.** Nodos (ganglios) ilíacos externos mediales: el subgrupo medial de los nodos ilíacos externos.
  - TA2 n.º 5325: External iliac nodes (*Nodi iliaci externi*)
  - TA2 n.º 5326: Medial external iliac nodes (*Nodi iliaci externi mediales*)
- **Descripción.** Gray describe los nodos ilíacos externos en tres grupos: uno en la cara lateral de los vasos, otro en la medial y un tercero en la anterior, que a veces falta.
  - [External iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=External_iliac_lymph_nodes&oldid=1223684511): “They are arranged in three groups, one on the lateral, another on the medial, and a third on the anterior aspect of the vessels; the third group is, however, sometimes absent.”
- **Localización.** Los nodos ilíacos externos, de ocho a diez, están a lo largo de los vasos ilíacos externos.
  - [External iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=External_iliac_lymph_nodes&oldid=1223684511): “from eight to ten in number, that lie along the external iliac vessels”
- **Localización.** La arteria ilíaca externa baja hacia delante por el borde medial del psoas mayor y pasa bajo el ligamento inguinal, donde se convierte en la arteria femoral.
  - [External iliac artery](https://en.wikipedia.org/w/index.php?title=External_iliac_artery&oldid=1380894405): “They proceed anterior and inferior along the medial border of the psoas major muscles.”
  - [External iliac artery](https://en.wikipedia.org/w/index.php?title=External_iliac_artery&oldid=1380894405): “The external iliac artery passes beneath the inguinal ligament in the lower part of the abdomen and becomes the femoral artery.”
- **Reparo.** La arteria y la vena ilíacas externas, en el borde medial del psoas mayor.
  - [External iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=External_iliac_lymph_nodes&oldid=1223684511): “from eight to ten in number, that lie along the external iliac vessels”
  - [External iliac artery](https://en.wikipedia.org/w/index.php?title=External_iliac_artery&oldid=1380894405): “They proceed anterior and inferior along the medial border of the psoas major muscles.”
- **Recibe.** Sus aferentes principales vienen de los nodos inguinales.
  - [External iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=External_iliac_lymph_nodes&oldid=1223684511): “Their principal afferents are derived from the inguinal lymph nodes”
  - [Inguinal lymph nodes](https://en.wikipedia.org/w/index.php?title=Inguinal_lymph_nodes&oldid=1330887775): “The deep inguinal lymph nodes drain superiorly to the external iliac lymph nodes”
- **Recibe.** También reciben los linfáticos profundos de la pared abdominal por debajo del ombligo y de la región de los aductores del muslo.
  - [External iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=External_iliac_lymph_nodes&oldid=1223684511): “the deep lymphatics of the abdominal wall below the umbilicus and of the adductor region of the thigh”
- **Recibe.** Y los del glande, el clítoris, la uretra membranosa, la próstata, el fondo de la vejiga, el cuello del útero y la parte superior de la vagina.
  - [External iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=External_iliac_lymph_nodes&oldid=1223684511): “the lymphatics from the glans penis, glans clitoridis, the membranous urethra, the prostate, the fundus of the urinary bladder, the cervix uteri, and upper part of the vagina”
- **Drena en.** Drenan en los nodos ilíacos comunes, que a su vez llevan la linfa a los nodos aórticos laterales.
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “They drain chiefly the hypogastric and external iliac glands”
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “their efferents pass to the lateral aortic glands”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** La posición de los nodos mediales dentro del grupo sigue su nombre en la Terminologia Anatomica; las fuentes libres consultadas no la describen por separado.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe `Proximal_deep_inguinal_node`, `Intermediate_deep_inguinal_node`, `Superomedial_superficial_inguinal_nodes`, `Superolateral_superficial_inguinal_nodes`, `Inferior_superficial_inguinal_nodes`; drena en `Medial_common_iliac_nodes`, `Intermediate_common_iliac_nodes`, `Lateral_common_iliac_nodes`.

### Intermediate_external_iliac_nodes

Nombre: TA2 n.º 5327 (*Nodi iliaci externi intermedii*; Intermediate external iliac nodes).

- **Descripción.** Nodos (ganglios) ilíacos externos intermedios: en la Terminologia Anatomica, el subgrupo entre los mediales y los laterales de los nodos ilíacos externos.
  - TA2 n.º 5325: External iliac nodes (*Nodi iliaci externi*)
  - TA2 n.º 5326: Medial external iliac nodes (*Nodi iliaci externi mediales*)
  - TA2 n.º 5327: Intermediate external iliac nodes (*Nodi iliaci externi intermedii*)
  - TA2 n.º 5328: Lateral external iliac nodes (*Nodi iliaci externi latérales*)
- **Descripción.** Gray los describe de otra manera, en tres grupos: uno en la cara lateral de los vasos, otro en la medial y un tercero en la anterior, que a veces falta.
  - [External iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=External_iliac_lymph_nodes&oldid=1223684511): “They are arranged in three groups, one on the lateral, another on the medial, and a third on the anterior aspect of the vessels; the third group is, however, sometimes absent.”
- **Localización.** Los nodos ilíacos externos, de ocho a diez, están a lo largo de los vasos ilíacos externos.
  - [External iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=External_iliac_lymph_nodes&oldid=1223684511): “from eight to ten in number, that lie along the external iliac vessels”
- **Localización.** La arteria ilíaca externa baja hacia delante por el borde medial del psoas mayor y pasa bajo el ligamento inguinal, donde se convierte en la arteria femoral.
  - [External iliac artery](https://en.wikipedia.org/w/index.php?title=External_iliac_artery&oldid=1380894405): “They proceed anterior and inferior along the medial border of the psoas major muscles.”
  - [External iliac artery](https://en.wikipedia.org/w/index.php?title=External_iliac_artery&oldid=1380894405): “The external iliac artery passes beneath the inguinal ligament in the lower part of the abdomen and becomes the femoral artery.”
- **Reparo.** La arteria y la vena ilíacas externas, en el borde medial del psoas mayor.
  - [External iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=External_iliac_lymph_nodes&oldid=1223684511): “from eight to ten in number, that lie along the external iliac vessels”
  - [External iliac artery](https://en.wikipedia.org/w/index.php?title=External_iliac_artery&oldid=1380894405): “They proceed anterior and inferior along the medial border of the psoas major muscles.”
- **Recibe.** Sus aferentes principales vienen de los nodos inguinales.
  - [External iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=External_iliac_lymph_nodes&oldid=1223684511): “Their principal afferents are derived from the inguinal lymph nodes”
  - [Inguinal lymph nodes](https://en.wikipedia.org/w/index.php?title=Inguinal_lymph_nodes&oldid=1330887775): “The deep inguinal lymph nodes drain superiorly to the external iliac lymph nodes”
- **Recibe.** También reciben los linfáticos profundos de la pared abdominal por debajo del ombligo y de la región de los aductores del muslo.
  - [External iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=External_iliac_lymph_nodes&oldid=1223684511): “the deep lymphatics of the abdominal wall below the umbilicus and of the adductor region of the thigh”
- **Recibe.** Y los del glande, el clítoris, la uretra membranosa, la próstata, el fondo de la vejiga, el cuello del útero y la parte superior de la vagina.
  - [External iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=External_iliac_lymph_nodes&oldid=1223684511): “the lymphatics from the glans penis, glans clitoridis, the membranous urethra, the prostate, the fundus of the urinary bladder, the cervix uteri, and upper part of the vagina”
- **Drena en.** Drenan en los nodos ilíacos comunes, que a su vez llevan la linfa a los nodos aórticos laterales.
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “They drain chiefly the hypogastric and external iliac glands”
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “their efferents pass to the lateral aortic glands”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** La posición de los nodos intermedios dentro del grupo sigue su nombre en la Terminologia Anatomica; las fuentes libres consultadas no la describen por separado.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe `Proximal_deep_inguinal_node`, `Intermediate_deep_inguinal_node`, `Superomedial_superficial_inguinal_nodes`, `Superolateral_superficial_inguinal_nodes`, `Inferior_superficial_inguinal_nodes`; drena en `Medial_common_iliac_nodes`, `Intermediate_common_iliac_nodes`, `Lateral_common_iliac_nodes`.

### Medial_lacunar_node

Nombre: TA2 n.º 5329 (*(Nodus lacunaris medialis)*; (Medial lacunar node)).

- **Descripción.** Nodo (ganglio) lacunar medial: en la Terminologia Anatomica, uno de los nodos lacunares, que forman parte de los nodos ilíacos externos; su nombre figura entre paréntesis.
  - TA2 n.º 5325: External iliac nodes (*Nodi iliaci externi*)
  - TA2 n.º 5329: (Medial lacunar node) (*(Nodus lacunaris medialis)*)
- **Localización.** Los nodos lacunares toman su nombre de la laguna vascular, el compartimento medial que queda por debajo del ligamento inguinal.
  - TA2 n.º 5329: (Medial lacunar node) (*(Nodus lacunaris medialis)*)
  - [Vascular lacuna](https://en.wikipedia.org/w/index.php?title=Vascular_lacuna&oldid=1345649176): “is the medial compartment beneath the inguinal ligament”
- **Localización.** La laguna vascular está limitada por el arco iliopectíneo, el ligamento inguinal, el ligamento lacunar y el borde superior del pubis; por ella pasan los vasos femorales, vasos linfáticos y nodos linfáticos.
  - [Vascular lacuna](https://en.wikipedia.org/w/index.php?title=Vascular_lacuna&oldid=1345649176): “Its boundaries are the iliopectineal arch, the inguinal ligament, the lacunar ligament, and the superior border of the pubis.”
  - [Vascular lacuna](https://en.wikipedia.org/w/index.php?title=Vascular_lacuna&oldid=1345649176): “It gives passage to the femoral vessels, lymph vessels and lymph nodes.”
- **Reparo.** En la laguna vascular, de medial a lateral, se encuentran el nodo de Cloquet, la vena femoral y la arteria femoral.
  - [Vascular lacuna](https://en.wikipedia.org/w/index.php?title=Vascular_lacuna&oldid=1345649176): “The structures found in the vascular lacuna, from medial to lateral, are: Cloquet's node Femoral vein Femoral artery”
- **Reparo.** El ligamento lacunar forma el límite medial del anillo femoral.
  - [Lacunar ligament](https://en.wikipedia.org/w/index.php?title=Lacunar_ligament&oldid=1257215334): “Its base is concave, thin, and sharp, and forms the medial boundary of the femoral ring.”
- **Recibe.** Por la laguna vascular suben, junto a los vasos femorales, los vasos linfáticos del miembro inferior: los nodos inguinales profundos drenan hacia arriba en los nodos ilíacos externos.
  - [Vascular lacuna](https://en.wikipedia.org/w/index.php?title=Vascular_lacuna&oldid=1345649176): “It gives passage to the femoral vessels, lymph vessels and lymph nodes.”
  - [Inguinal lymph nodes](https://en.wikipedia.org/w/index.php?title=Inguinal_lymph_nodes&oldid=1330887775): “The deep inguinal lymph nodes drain superiorly to the external iliac lymph nodes”
- **Drena en.** Como parte de los nodos ilíacos externos, su linfa sigue hacia los nodos ilíacos comunes.
  - TA2 n.º 5325: External iliac nodes (*Nodi iliaci externi*)
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “They drain chiefly the hypogastric and external iliac glands”
- **En este modelo.** Es una pieza nueva de Anato3D: en Z-Anatomy estaba oculta, porque en la Terminologia Anatomica su nombre va entre paréntesis; su forma y su tamaño son esquemáticos.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo los tres nodos lacunares se recolocaron en la laguna vascular, al final de los vasos ilíacos externos, por orden de medial a lateral; es una colocación esquemática.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** La posición de los nodos lacunares dentro del grupo sigue su nombre en la Terminologia Anatomica; las fuentes libres consultadas no la describen por separado.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** Las fuentes libres consultadas no dicen a qué nodo de la Terminologia Anatomica corresponde el nodo de Cloquet (si al lacunar medial o al inguinal profundo proximal); aquí no se identifica con ninguno.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **Punto clave.** El nodo de Cloquet (o de Rosenmüller), bajo el ligamento inguinal, puede considerarse el más inferior de los ilíacos externos o el más superior de los inguinales profundos, y se considera un posible nodo centinela.
  - [Inguinal lymph nodes](https://en.wikipedia.org/w/index.php?title=Inguinal_lymph_nodes&oldid=1330887775): “The superior-most node is situated in the groin, deep to the inguinal ligament, and is termed the Cloquet's node (also Rosenmuller's node).”
  - [Inguinal lymph nodes](https://en.wikipedia.org/w/index.php?title=Inguinal_lymph_nodes&oldid=1330887775): “It can instead be considered as the inferior-most of the external iliac lymph nodes.”
  - [Inguinal lymph nodes](https://en.wikipedia.org/w/index.php?title=Inguinal_lymph_nodes&oldid=1330887775): “Cloquet's node is also considered as a potential sentinel lymph node.”
- Vías en la app: recibe `Proximal_deep_inguinal_node`, `Intermediate_deep_inguinal_node`; drena en `Medial_common_iliac_nodes`, `Intermediate_common_iliac_nodes`, `Lateral_common_iliac_nodes`.

### Intermediate_lacunar_node

Nombre: TA2 n.º 5330 (*(Nodus lacunaris intermedius)*; (Intermediate lacunar node)).

- **Descripción.** Nodo (ganglio) lacunar intermedio: en la Terminologia Anatomica, uno de los nodos lacunares, que forman parte de los nodos ilíacos externos; su nombre figura entre paréntesis.
  - TA2 n.º 5325: External iliac nodes (*Nodi iliaci externi*)
  - TA2 n.º 5330: (Intermediate lacunar node) (*(Nodus lacunaris intermedius)*)
- **Localización.** Los nodos lacunares toman su nombre de la laguna vascular, el compartimento medial que queda por debajo del ligamento inguinal.
  - TA2 n.º 5329: (Medial lacunar node) (*(Nodus lacunaris medialis)*)
  - [Vascular lacuna](https://en.wikipedia.org/w/index.php?title=Vascular_lacuna&oldid=1345649176): “is the medial compartment beneath the inguinal ligament”
- **Localización.** La laguna vascular está limitada por el arco iliopectíneo, el ligamento inguinal, el ligamento lacunar y el borde superior del pubis; por ella pasan los vasos femorales, vasos linfáticos y nodos linfáticos.
  - [Vascular lacuna](https://en.wikipedia.org/w/index.php?title=Vascular_lacuna&oldid=1345649176): “Its boundaries are the iliopectineal arch, the inguinal ligament, the lacunar ligament, and the superior border of the pubis.”
  - [Vascular lacuna](https://en.wikipedia.org/w/index.php?title=Vascular_lacuna&oldid=1345649176): “It gives passage to the femoral vessels, lymph vessels and lymph nodes.”
- **Reparo.** Los vasos femorales a su paso bajo el ligamento inguinal: en la laguna vascular, de medial a lateral, están la vena femoral y la arteria femoral.
  - [Vascular lacuna](https://en.wikipedia.org/w/index.php?title=Vascular_lacuna&oldid=1345649176): “The structures found in the vascular lacuna, from medial to lateral, are: Cloquet's node Femoral vein Femoral artery”
  - [External iliac artery](https://en.wikipedia.org/w/index.php?title=External_iliac_artery&oldid=1380894405): “The external iliac artery passes beneath the inguinal ligament in the lower part of the abdomen and becomes the femoral artery.”
- **Recibe.** Por la laguna vascular suben, junto a los vasos femorales, los vasos linfáticos del miembro inferior: los nodos inguinales profundos drenan hacia arriba en los nodos ilíacos externos.
  - [Vascular lacuna](https://en.wikipedia.org/w/index.php?title=Vascular_lacuna&oldid=1345649176): “It gives passage to the femoral vessels, lymph vessels and lymph nodes.”
  - [Inguinal lymph nodes](https://en.wikipedia.org/w/index.php?title=Inguinal_lymph_nodes&oldid=1330887775): “The deep inguinal lymph nodes drain superiorly to the external iliac lymph nodes”
- **Drena en.** Como parte de los nodos ilíacos externos, su linfa sigue hacia los nodos ilíacos comunes.
  - TA2 n.º 5325: External iliac nodes (*Nodi iliaci externi*)
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “They drain chiefly the hypogastric and external iliac glands”
- **En este modelo.** Es una pieza nueva de Anato3D: en Z-Anatomy estaba oculta, porque en la Terminologia Anatomica su nombre va entre paréntesis; su forma y su tamaño son esquemáticos.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo los tres nodos lacunares se recolocaron en la laguna vascular, al final de los vasos ilíacos externos, por orden de medial a lateral; es una colocación esquemática.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** La posición de los nodos lacunares dentro del grupo sigue su nombre en la Terminologia Anatomica; las fuentes libres consultadas no la describen por separado.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe `Proximal_deep_inguinal_node`, `Intermediate_deep_inguinal_node`; drena en `Medial_common_iliac_nodes`, `Intermediate_common_iliac_nodes`, `Lateral_common_iliac_nodes`.

### Lateral_lacunar_node

Nombre: TA2 n.º 5331 (*(Nodus lacunaris lateralis)*; (Lateral lacunar node)).

- **Descripción.** Nodo (ganglio) lacunar lateral: en la Terminologia Anatomica, uno de los nodos lacunares, que forman parte de los nodos ilíacos externos; su nombre figura entre paréntesis.
  - TA2 n.º 5325: External iliac nodes (*Nodi iliaci externi*)
  - TA2 n.º 5331: (Lateral lacunar node) (*(Nodus lacunaris lateralis)*)
- **Localización.** Los nodos lacunares toman su nombre de la laguna vascular, el compartimento medial que queda por debajo del ligamento inguinal.
  - TA2 n.º 5329: (Medial lacunar node) (*(Nodus lacunaris medialis)*)
  - [Vascular lacuna](https://en.wikipedia.org/w/index.php?title=Vascular_lacuna&oldid=1345649176): “is the medial compartment beneath the inguinal ligament”
- **Localización.** La laguna vascular está limitada por el arco iliopectíneo, el ligamento inguinal, el ligamento lacunar y el borde superior del pubis; por ella pasan los vasos femorales, vasos linfáticos y nodos linfáticos.
  - [Vascular lacuna](https://en.wikipedia.org/w/index.php?title=Vascular_lacuna&oldid=1345649176): “Its boundaries are the iliopectineal arch, the inguinal ligament, the lacunar ligament, and the superior border of the pubis.”
  - [Vascular lacuna](https://en.wikipedia.org/w/index.php?title=Vascular_lacuna&oldid=1345649176): “It gives passage to the femoral vessels, lymph vessels and lymph nodes.”
- **Reparo.** La arteria femoral, que es lo más lateral de los vasos de la laguna vascular: allí continúa la arteria ilíaca externa al pasar bajo el ligamento inguinal.
  - [Vascular lacuna](https://en.wikipedia.org/w/index.php?title=Vascular_lacuna&oldid=1345649176): “The structures found in the vascular lacuna, from medial to lateral, are: Cloquet's node Femoral vein Femoral artery”
  - [External iliac artery](https://en.wikipedia.org/w/index.php?title=External_iliac_artery&oldid=1380894405): “The external iliac artery passes beneath the inguinal ligament in the lower part of the abdomen and becomes the femoral artery.”
- **Recibe.** Por la laguna vascular suben, junto a los vasos femorales, los vasos linfáticos del miembro inferior: los nodos inguinales profundos drenan hacia arriba en los nodos ilíacos externos.
  - [Vascular lacuna](https://en.wikipedia.org/w/index.php?title=Vascular_lacuna&oldid=1345649176): “It gives passage to the femoral vessels, lymph vessels and lymph nodes.”
  - [Inguinal lymph nodes](https://en.wikipedia.org/w/index.php?title=Inguinal_lymph_nodes&oldid=1330887775): “The deep inguinal lymph nodes drain superiorly to the external iliac lymph nodes”
- **Drena en.** Como parte de los nodos ilíacos externos, su linfa sigue hacia los nodos ilíacos comunes.
  - TA2 n.º 5325: External iliac nodes (*Nodi iliaci externi*)
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “They drain chiefly the hypogastric and external iliac glands”
- **En este modelo.** Es una pieza nueva de Anato3D: en Z-Anatomy estaba oculta, porque en la Terminologia Anatomica su nombre va entre paréntesis; su forma y su tamaño son esquemáticos.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo los tres nodos lacunares se recolocaron en la laguna vascular, al final de los vasos ilíacos externos, por orden de medial a lateral; es una colocación esquemática.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** La posición de los nodos lacunares dentro del grupo sigue su nombre en la Terminologia Anatomica; las fuentes libres consultadas no la describen por separado.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe `Proximal_deep_inguinal_node`, `Intermediate_deep_inguinal_node`; drena en `Medial_common_iliac_nodes`, `Intermediate_common_iliac_nodes`, `Lateral_common_iliac_nodes`.

### Obturator_nodes

Nombre: TA2 n.º 5333 (*Nodi obturatorii*; Obturator nodes).

- **Descripción.** Nodos (ganglios) obturadores: la Terminologia Anatomica los incluye en el grupo de los nodos ilíacos externos.
  - TA2 n.º 5325: External iliac nodes (*Nodi iliaci externi*)
  - TA2 n.º 5333: Obturator nodes (*Nodi obturatorii*)
- **Localización.** Llevan el nombre del paquete obturador, que recorre la pared lateral de la pelvis: la arteria obturadora va hacia delante y abajo por esa pared hasta la parte superior del agujero obturador y sale de la pelvis por el canal obturador.
  - TA2 n.º 5333: Obturator nodes (*Nodi obturatorii*)
  - [Obturator artery](https://en.wikipedia.org/w/index.php?title=Obturator_artery&oldid=1380881122): “passes antero-inferiorly (forwards and downwards) on the lateral wall of the pelvis, to the upper part of the obturator foramen, and, escaping from the pelvic cavity through the obturator canal”
- **Reparo.** La arteria obturadora, rama de la ilíaca interna, en la pared lateral de la pelvis camino del canal obturador.
  - [Obturator artery](https://en.wikipedia.org/w/index.php?title=Obturator_artery&oldid=1380881122): “passes antero-inferiorly (forwards and downwards) on the lateral wall of the pelvis, to the upper part of the obturator foramen, and, escaping from the pelvic cavity through the obturator canal”
  - [Obturator artery](https://en.wikipedia.org/w/index.php?title=Obturator_artery&oldid=1380881122): “The obturator artery usually arises from the internal iliac artery.”
- **Recibe.** En el varón, a los nodos obturadores y a los sacros llegan vasos de la propia próstata.
  - [Prostate](https://en.wikipedia.org/w/index.php?title=Prostate&oldid=1379380115): “Vessels of the prostate itself also drain into the obturator and sacral lymph nodes.”
- **Recibe.** En la mujer, la parte posterior del cuello del útero drena en los nodos obturadores y presacros.
  - [Cervix](https://en.wikipedia.org/w/index.php?title=Cervix&oldid=1382456224): “the posterior section of the cervix drains to the obturator and presacral lymph nodes”
- **Recibe.** El drenaje del cuello del útero varía entre personas.
  - [Cervix](https://en.wikipedia.org/w/index.php?title=Cervix&oldid=1382456224): “However, there are variations as lymphatic drainage from the cervix travels to different sets of pelvic nodes in some people.”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **Drena en: pendiente.** Ninguna fuente libre consultada describe adónde van los eferentes de los nodos obturadores; la tabla de partida («→ ilíacos externos mediales») no tiene fuente y no se afirma.

### Superior_gluteal_nodes

Nombre: TA2 n.º 5336 (*Nodi glutei superiores*; Superior gluteal nodes).

- **Descripción.** Nodos (ganglios) glúteos superiores: en la Terminologia Anatomica, parte de los nodos glúteos, uno de los subgrupos de los nodos ilíacos internos.
  - TA2 n.º 5334: Internal iliac nodes (*Nodi iliaci interni*)
  - TA2 n.º 5335: Gluteal nodes (*Nodi glutei*)
  - TA2 n.º 5336: Superior gluteal nodes (*Nodi glutei superiores*)
- **Localización.** Los nodos ilíacos internos rodean la arteria ilíaca interna y sus ramas.
  - [Internal iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Internal_iliac_lymph_nodes&oldid=1358630094): “surround the internal iliac artery and its branches”
- **Localización.** La arteria glútea superior es la rama más grande y la última de la arteria ilíaca interna: continúa su división posterior.
  - [Superior gluteal artery](https://en.wikipedia.org/w/index.php?title=Superior_gluteal_artery&oldid=1380892550): “The superior gluteal artery is the largest and final branch of the internal iliac artery.”
  - [Superior gluteal artery](https://en.wikipedia.org/w/index.php?title=Superior_gluteal_artery&oldid=1380892550): “it represents the continuation of the posterior division”
- **Reparo.** La arteria glútea superior, que sale de la pelvis por el agujero ciático mayor, por encima del músculo piriforme.
  - [Superior gluteal artery](https://en.wikipedia.org/w/index.php?title=Superior_gluteal_artery&oldid=1380892550): “It exits the pelvis through the greater sciatic foramen superior to the piriformis muscle”
- **Recibe.** El grupo ilíaco interno al que pertenecen recibe la linfa de todas las vísceras de la pelvis y de la parte profunda del periné, incluidas las porciones membranosa y cavernosa de la uretra.
  - [Internal iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Internal_iliac_lymph_nodes&oldid=1358630094): “they receive lymphatics from all the pelvic viscera, from the deeper parts of the perineum, including the membranous and cavernous portions of the urethra”
- **Recibe.** También recibe la de la nalga y la parte posterior del muslo.
  - [Internal iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Internal_iliac_lymph_nodes&oldid=1358630094): “and from the buttock and back of the thigh”
- **Recibe.** No recibe la del ovario ni la del testículo, que van a los nodos lumbares.
  - [Internal iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Internal_iliac_lymph_nodes&oldid=1358630094): “It does not receive lymph from the ovary or testis, which drain to the paraaortic lymph nodes.”
- **Drena en.** Los nodos ilíacos internos (hipogástricos) drenan en los nodos ilíacos comunes.
  - [Internal iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Internal_iliac_lymph_nodes&oldid=1358630094): “The internal iliac lymph nodes (or hypogastric lymph nodes)”
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “They drain chiefly the hypogastric and external iliac glands”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** Su posición junto a la arteria glútea superior sigue su nombre en la Terminologia Anatomica; las fuentes libres consultadas solo describen el grupo ilíaco interno en conjunto.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe —; drena en `Medial_common_iliac_nodes`, `Intermediate_common_iliac_nodes`, `Lateral_common_iliac_nodes`.

### Inferior_gluteal_nodes

Nombre: TA2 n.º 5337 (*Nodi glutei inferiores*; Inferior gluteal nodes).

- **Descripción.** Nodos (ganglios) glúteos inferiores: en la Terminologia Anatomica, parte de los nodos glúteos, uno de los subgrupos de los nodos ilíacos internos.
  - TA2 n.º 5334: Internal iliac nodes (*Nodi iliaci interni*)
  - TA2 n.º 5335: Gluteal nodes (*Nodi glutei*)
  - TA2 n.º 5337: Inferior gluteal nodes (*Nodi glutei inferiores*)
- **Localización.** Los nodos ilíacos internos rodean la arteria ilíaca interna y sus ramas.
  - [Internal iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Internal_iliac_lymph_nodes&oldid=1358630094): “surround the internal iliac artery and its branches”
- **Localización.** La arteria glútea inferior es una rama terminal del tronco anterior de la arteria ilíaca interna.
  - [Inferior gluteal artery](https://en.wikipedia.org/w/index.php?title=Inferior_gluteal_artery&oldid=1293709222): “is a terminal branch of the anterior trunk of the internal iliac artery”
- **Reparo.** La arteria glútea inferior, que pasa por la parte inferior del agujero ciático mayor y sigue por detrás del muslo.
  - [Inferior gluteal artery](https://en.wikipedia.org/w/index.php?title=Inferior_gluteal_artery&oldid=1293709222): “It passes through the inferior part of the greater sciatic foramen.”
  - [Inferior gluteal artery](https://en.wikipedia.org/w/index.php?title=Inferior_gluteal_artery&oldid=1293709222): “It continues down the back of the thigh”
- **Recibe.** El grupo ilíaco interno al que pertenecen recibe la linfa de todas las vísceras de la pelvis y de la parte profunda del periné, incluidas las porciones membranosa y cavernosa de la uretra.
  - [Internal iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Internal_iliac_lymph_nodes&oldid=1358630094): “they receive lymphatics from all the pelvic viscera, from the deeper parts of the perineum, including the membranous and cavernous portions of the urethra”
- **Recibe.** También recibe la de la nalga y la parte posterior del muslo.
  - [Internal iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Internal_iliac_lymph_nodes&oldid=1358630094): “and from the buttock and back of the thigh”
- **Recibe.** No recibe la del ovario ni la del testículo, que van a los nodos lumbares.
  - [Internal iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Internal_iliac_lymph_nodes&oldid=1358630094): “It does not receive lymph from the ovary or testis, which drain to the paraaortic lymph nodes.”
- **Drena en.** Los nodos ilíacos internos (hipogástricos) drenan en los nodos ilíacos comunes.
  - [Internal iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Internal_iliac_lymph_nodes&oldid=1358630094): “The internal iliac lymph nodes (or hypogastric lymph nodes)”
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “They drain chiefly the hypogastric and external iliac glands”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** Su posición junto a la arteria glútea inferior sigue su nombre en la Terminologia Anatomica; las fuentes libres consultadas solo describen el grupo ilíaco interno en conjunto.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe —; drena en `Medial_common_iliac_nodes`, `Intermediate_common_iliac_nodes`, `Lateral_common_iliac_nodes`.

### Lateral_sacral_nodes

Nombre: TA2 n.º 5338 (*Nodi sacrales latérales*; Lateral sacral nodes).

- **Descripción.** Nodos (ganglios) sacros laterales: en la Terminologia Anatomica forman parte de los nodos ilíacos internos.
  - TA2 n.º 5334: Internal iliac nodes (*Nodi iliaci interni*)
  - TA2 n.º 5338: Lateral sacral nodes (*Nodi sacrales latérales*)
- **Localización.** Los nodos sacros están en la concavidad del sacro, en relación con las arterias sacras media y laterales.
  - [Sacral lymph nodes](https://en.wikipedia.org/w/index.php?title=Sacral_lymph_nodes&oldid=1302423600): “The sacral lymph nodes are placed in the concavity of the sacrum, in relation to the middle and lateral sacral arteries”
- **Localización.** La arteria sacra lateral nace de la división posterior de la arteria ilíaca interna.
  - [Lateral sacral artery](https://en.wikipedia.org/w/index.php?title=Lateral_sacral_artery&oldid=1380881537): “arises from the posterior division of the internal iliac artery”
- **Reparo.** La arteria sacra lateral, que cruza por delante del piriforme y de los nervios sacros hasta el lado medial de los agujeros sacros anteriores y baja por la cara anterior del sacro.
  - [Lateral sacral artery](https://en.wikipedia.org/w/index.php?title=Lateral_sacral_artery&oldid=1380881537): “The inferior runs obliquely across the front of the piriformis and the sacral nerves to the medial side of the anterior sacral foramina, descends on the front of the sacrum”
- **Recibe.** Los nodos sacros reciben la linfa del recto y de la pared posterior de la pelvis.
  - [Sacral lymph nodes](https://en.wikipedia.org/w/index.php?title=Sacral_lymph_nodes&oldid=1302423600): “they receive lymphatics from the rectum and posterior wall of the pelvis”
- **Recibe.** En el varón les llegan también vasos de la próstata.
  - [Prostate](https://en.wikipedia.org/w/index.php?title=Prostate&oldid=1379380115): “Vessels of the prostate itself also drain into the obturator and sacral lymph nodes.”
- **Drena en.** Como nodos ilíacos internos (hipogástricos), su linfa va a los nodos ilíacos comunes.
  - TA2 n.º 5334: Internal iliac nodes (*Nodi iliaci interni*)
  - TA2 n.º 5338: Lateral sacral nodes (*Nodi sacrales latérales*)
  - [Internal iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Internal_iliac_lymph_nodes&oldid=1358630094): “The internal iliac lymph nodes (or hypogastric lymph nodes)”
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “They drain chiefly the hypogastric and external iliac glands”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** El latín del modelo se escribe sin tilde, como en la Terminologia Anatomica: «laterales» y no «latérales».
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe —; drena en `Medial_common_iliac_nodes`, `Intermediate_common_iliac_nodes`, `Lateral_common_iliac_nodes`.

### Prevesical_nodes

Nombre: TA2 n.º 5341 (*Nodi prevesicales*; Prevesical nodes).

- **Descripción.** Nodos (ganglios) prevesicales: en la Terminologia Anatomica, uno de los subgrupos de los nodos paravesicales, que son nodos viscerales de la pelvis.
  - TA2 n.º 5339: Visceral pelvic lymph nodes (*Nodi iymphoidei viscérales*)
  - TA2 n.º 5340: Paravesical nodes (*Nodi paravesicales*)
  - TA2 n.º 5341: Prevesical nodes (*Nodi prevesicales*)
- **Localización.** Su nombre los sitúa delante de la vejiga urinaria.
  - TA2 n.º 5341: Prevesical nodes (*Nodi prevesicales*)
- **Reparo.** La cara anterior de la vejiga urinaria.
  - TA2 n.º 5341: Prevesical nodes (*Nodi prevesicales*)
- **Recibe.** Reciben la linfa de la vejiga urinaria.
  - [es: Vejiga urinaria](https://es.wikipedia.org/w/index.php?title=Vejiga_urinaria&oldid=174975432): “La linfa de la vejiga drena en los ganglios perivesicales, de ahí a los ilíacos externos y a los hipogástricos”
- **Recibe.** La linfa de la vejiga nace en redes de las capas mucosa, muscular y serosa.
  - [Bladder](https://en.wikipedia.org/w/index.php?title=Bladder&oldid=1379190325): “The lymph drained from the bladder begins in a series of networks throughout the mucosal, muscular and serosal layers.”
- **Recibe.** Esas redes forman tres grupos de vasos: uno junto al trígono, que drena el fondo de la vejiga; otro que drena la parte superior; y otro que drena la cara inferior externa.
  - [Bladder](https://en.wikipedia.org/w/index.php?title=Bladder&oldid=1379190325): “These then form three sets of vessels: one set near the trigone draining the bottom of the bladder; one set draining the top of the bladder; and another set draining the outer undersurface of the bladder.”
- **Drena en.** De los nodos que rodean la vejiga, la linfa pasa a los nodos ilíacos externos y a los hipogástricos (ilíacos internos).
  - [es: Vejiga urinaria](https://es.wikipedia.org/w/index.php?title=Vejiga_urinaria&oldid=174975432): “La linfa de la vejiga drena en los ganglios perivesicales, de ahí a los ilíacos externos y a los hipogástricos”
  - [Internal iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Internal_iliac_lymph_nodes&oldid=1358630094): “The internal iliac lymph nodes (or hypogastric lymph nodes)”
- **Drena en.** La mayoría de los vasos linfáticos de la vejiga drena en los nodos ilíacos externos.
  - [Bladder](https://en.wikipedia.org/w/index.php?title=Bladder&oldid=1379190325): “The majority of these vessels drain into the external iliac lymph nodes.”
- **Drena en.** Los nodos ilíacos externos reciben, entre otros, los linfáticos del fondo de la vejiga.
  - [External iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=External_iliac_lymph_nodes&oldid=1223684511): “the lymphatics from the glans penis, glans clitoridis, the membranous urethra, the prostate, the fundus of the urinary bladder, the cervix uteri, and upper part of the vagina”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo es una sola pieza, sin lado izquierdo ni derecho.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo los nodos paravesicales se colocan junto a la vejiga, en el trayecto de sus vasos linfáticos; las fuentes libres consultadas no describen por separado qué parte de la vejiga drena en cada subgrupo.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe —; drena en `Medial_external_iliac_nodes`, `Intermediate_external_iliac_nodes`.

### Postvesical_nodes

Nombre: TA2 n.º 5342 (*Nodi postvesicales*; Postvesical nodes).

- **Descripción.** Nodos (ganglios) retrovesicales: en la Terminologia Anatomica, uno de los subgrupos de los nodos paravesicales, que son nodos viscerales de la pelvis.
  - TA2 n.º 5339: Visceral pelvic lymph nodes (*Nodi iymphoidei viscérales*)
  - TA2 n.º 5340: Paravesical nodes (*Nodi paravesicales*)
  - TA2 n.º 5342: Postvesical nodes (*Nodi postvesicales*)
- **Localización.** Su nombre los sitúa detrás de la vejiga urinaria.
  - TA2 n.º 5342: Postvesical nodes (*Nodi postvesicales*)
- **Reparo.** La cara posterior de la vejiga urinaria.
  - TA2 n.º 5342: Postvesical nodes (*Nodi postvesicales*)
- **Recibe.** Reciben la linfa de la vejiga urinaria.
  - [es: Vejiga urinaria](https://es.wikipedia.org/w/index.php?title=Vejiga_urinaria&oldid=174975432): “La linfa de la vejiga drena en los ganglios perivesicales, de ahí a los ilíacos externos y a los hipogástricos”
- **Recibe.** La linfa de la vejiga nace en redes de las capas mucosa, muscular y serosa.
  - [Bladder](https://en.wikipedia.org/w/index.php?title=Bladder&oldid=1379190325): “The lymph drained from the bladder begins in a series of networks throughout the mucosal, muscular and serosal layers.”
- **Recibe.** Esas redes forman tres grupos de vasos: uno junto al trígono, que drena el fondo de la vejiga; otro que drena la parte superior; y otro que drena la cara inferior externa.
  - [Bladder](https://en.wikipedia.org/w/index.php?title=Bladder&oldid=1379190325): “These then form three sets of vessels: one set near the trigone draining the bottom of the bladder; one set draining the top of the bladder; and another set draining the outer undersurface of the bladder.”
- **Drena en.** De los nodos que rodean la vejiga, la linfa pasa a los nodos ilíacos externos y a los hipogástricos (ilíacos internos).
  - [es: Vejiga urinaria](https://es.wikipedia.org/w/index.php?title=Vejiga_urinaria&oldid=174975432): “La linfa de la vejiga drena en los ganglios perivesicales, de ahí a los ilíacos externos y a los hipogástricos”
  - [Internal iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Internal_iliac_lymph_nodes&oldid=1358630094): “The internal iliac lymph nodes (or hypogastric lymph nodes)”
- **Drena en.** La mayoría de los vasos linfáticos de la vejiga drena en los nodos ilíacos externos.
  - [Bladder](https://en.wikipedia.org/w/index.php?title=Bladder&oldid=1379190325): “The majority of these vessels drain into the external iliac lymph nodes.”
- **Drena en.** Los nodos ilíacos externos reciben, entre otros, los linfáticos del fondo de la vejiga.
  - [External iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=External_iliac_lymph_nodes&oldid=1223684511): “the lymphatics from the glans penis, glans clitoridis, the membranous urethra, the prostate, the fundus of the urinary bladder, the cervix uteri, and upper part of the vagina”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo es una sola pieza, sin lado izquierdo ni derecho.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo los nodos paravesicales se colocan junto a la vejiga, en el trayecto de sus vasos linfáticos; las fuentes libres consultadas no describen por separado qué parte de la vejiga drena en cada subgrupo.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe —; drena en `Medial_external_iliac_nodes`, `Intermediate_external_iliac_nodes`.

### Lateral_vesical_nodes

Nombre: TA2 n.º 5343 (*Nodi vesicales latérales*; Lateral vesical nodes).

- **Descripción.** Nodos (ganglios) vesicales laterales: en la Terminologia Anatomica, uno de los subgrupos de los nodos paravesicales, que son nodos viscerales de la pelvis.
  - TA2 n.º 5339: Visceral pelvic lymph nodes (*Nodi iymphoidei viscérales*)
  - TA2 n.º 5340: Paravesical nodes (*Nodi paravesicales*)
  - TA2 n.º 5343: Lateral vesical nodes (*Nodi vesicales latérales*)
- **Localización.** Su nombre los sitúa a los lados de la vejiga urinaria.
  - TA2 n.º 5343: Lateral vesical nodes (*Nodi vesicales latérales*)
- **Reparo.** Las caras laterales de la vejiga, por donde las venas vesicales siguen los ligamentos laterales de la vejiga hacia las venas ilíacas internas.
  - TA2 n.º 5343: Lateral vesical nodes (*Nodi vesicales latérales*)
  - [Bladder](https://en.wikipedia.org/w/index.php?title=Bladder&oldid=1379190325): “which coalesce and travel with the lateral ligaments of the bladder into the internal iliac veins”
- **Recibe.** Reciben la linfa de la vejiga urinaria.
  - [es: Vejiga urinaria](https://es.wikipedia.org/w/index.php?title=Vejiga_urinaria&oldid=174975432): “La linfa de la vejiga drena en los ganglios perivesicales, de ahí a los ilíacos externos y a los hipogástricos”
- **Recibe.** La linfa de la vejiga nace en redes de las capas mucosa, muscular y serosa.
  - [Bladder](https://en.wikipedia.org/w/index.php?title=Bladder&oldid=1379190325): “The lymph drained from the bladder begins in a series of networks throughout the mucosal, muscular and serosal layers.”
- **Recibe.** Esas redes forman tres grupos de vasos: uno junto al trígono, que drena el fondo de la vejiga; otro que drena la parte superior; y otro que drena la cara inferior externa.
  - [Bladder](https://en.wikipedia.org/w/index.php?title=Bladder&oldid=1379190325): “These then form three sets of vessels: one set near the trigone draining the bottom of the bladder; one set draining the top of the bladder; and another set draining the outer undersurface of the bladder.”
- **Drena en.** De los nodos que rodean la vejiga, la linfa pasa a los nodos ilíacos externos y a los hipogástricos (ilíacos internos).
  - [es: Vejiga urinaria](https://es.wikipedia.org/w/index.php?title=Vejiga_urinaria&oldid=174975432): “La linfa de la vejiga drena en los ganglios perivesicales, de ahí a los ilíacos externos y a los hipogástricos”
  - [Internal iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Internal_iliac_lymph_nodes&oldid=1358630094): “The internal iliac lymph nodes (or hypogastric lymph nodes)”
- **Drena en.** La mayoría de los vasos linfáticos de la vejiga drena en los nodos ilíacos externos.
  - [Bladder](https://en.wikipedia.org/w/index.php?title=Bladder&oldid=1379190325): “The majority of these vessels drain into the external iliac lymph nodes.”
- **Drena en.** Los nodos ilíacos externos reciben, entre otros, los linfáticos del fondo de la vejiga.
  - [External iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=External_iliac_lymph_nodes&oldid=1223684511): “the lymphatics from the glans penis, glans clitoridis, the membranous urethra, the prostate, the fundus of the urinary bladder, the cervix uteri, and upper part of the vagina”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo los nodos paravesicales se colocan junto a la vejiga, en el trayecto de sus vasos linfáticos; las fuentes libres consultadas no describen por separado qué parte de la vejiga drena en cada subgrupo.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** El latín del modelo se escribe sin tilde, como en la Terminologia Anatomica: «laterales» y no «latérales».
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe —; drena en `Medial_external_iliac_nodes`, `Intermediate_external_iliac_nodes`.

### Pararectal_nodes

Nombre: TA2 n.º 5346 (*Nodi pararectales*; Pararectal nodes).

- **Descripción.** Nodos (ganglios) pararrectales: nodos en contacto con la superficie muscular del recto.
  - [Pararectal lymph nodes](https://en.wikipedia.org/w/index.php?title=Pararectal_lymph_nodes&oldid=1358630243): “The pararectal lymph nodes are lymph nodes that are in contact with the muscular surface of the rectum.”
- **Descripción.** En la Terminologia Anatomica son nodos viscerales de la pelvis.
  - TA2 n.º 5339: Visceral pelvic lymph nodes (*Nodi iymphoidei viscérales*)
  - TA2 n.º 5346: Pararectal nodes (*Nodi pararectales*)
- **Localización.** Están a la izquierda y a la derecha del recto.
  - [Pararectal lymph nodes](https://en.wikipedia.org/w/index.php?title=Pararectal_lymph_nodes&oldid=1358630243): “The pararectal lymph nodes are located on the left and right of the rectum.”
- **Reparo.** La pared muscular del recto, con la que están en contacto.
  - [Pararectal lymph nodes](https://en.wikipedia.org/w/index.php?title=Pararectal_lymph_nodes&oldid=1358630243): “are lymph nodes that are in contact with the muscular surface of the rectum”
- **Recibe.** Drenan la porción ilíaca del colon descendente, el colon sigmoide y la parte superior del recto.
  - [Pararectal lymph nodes](https://en.wikipedia.org/w/index.php?title=Pararectal_lymph_nodes&oldid=1358630243): “The pararectal lymph nodes drain the descending iliac and sigmoid parts of the large intestine, and the upper part of the rectum.”
- **Drena en.** Sus vasos eferentes van a los nodos preaórticos.
  - [Pararectal lymph nodes](https://en.wikipedia.org/w/index.php?title=Pararectal_lymph_nodes&oldid=1358630243): “Their efferent lymph ducts pass to the pre-aortic lymph nodes.”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo una sola pieza, sin lado, reúne los nodos de los dos lados del recto.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** La mitad superior del recto, por encima de la línea pectínea, drena también en los nodos ilíacos internos; el modelo no traza esa vía por separado.
  - [Internal iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Internal_iliac_lymph_nodes&oldid=1358630094): “The internal iliac lymph nodes also drain the superior half of the rectum, above the pectinate line.”
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe —; drena en `Pre_aortic_nodes`.
