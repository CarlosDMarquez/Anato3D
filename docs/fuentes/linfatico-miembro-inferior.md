---
title: Fuentes de las fichas linfáticas del miembro inferior
date: 2026-11-12
---

# Fuentes de las fichas linfáticas del miembro inferior (2026-11-12)

Qué fuente respalda cada frase de las fichas de los nodos (ganglios) del miembro inferior (`web/src/data/linfatico/miembro-inferior.js`): inguinales superficiales (superomediales, superolaterales e inferiores), inguinales profundos (proximal e intermedio), poplíteos (superficiales y profundos), tibiales anterior y posterior y fibular. La app muestra el número de la fuente tras cada frase y la cita literal al pasar el puntero.

Todo es **borrador** redactado con IA (Claude) a partir de las fuentes citadas, **sin revisión de un especialista**.

## Cómo se comprobó

1. Páginas bajadas con `node scripts/linfatico-citas.mjs bajar …` (Wikipedia en inglés, CC BY-SA 4.0; texto plano de la API, sin recuadros ni pies de imagen), registradas con su revisión en `web/src/data/linfatico/comprobadas.js`.
2. `node scripts/linfatico-citas.mjs comprobar`: las 112 citas de este archivo están en su página, palabra por palabra (0 sin encontrar).
3. `node scripts/check-cards.mjs`: sin errores en estas fichas; 10 avisos de campos pendientes (nodos tibiales y fibular).
4. TeachMeAnatomy no se cita. «Popliteal lymph nodes» incorpora texto de dominio público del Gray de 1918.

## Decisiones y límites declarados

- **Nodo de Cloquet**: las fuentes llaman nodo de Cloquet (o de Rosenmüller) al más superior de los inguinales profundos. La ficha lo identifica con el *nodo inguinal profundo proximal* de la TA2 (n.º 5354), que no da el epónimo; la equivalencia se declara en «En este modelo».
- **Nodo inguinal profundo intermedio**: ninguna fuente lo describe por separado; su ficha usa lo que se dice del conjunto de los inguinales profundos. El *nodo inguinal profundo distal* de la TA2 (n.º 5356) no está en Z-Anatomy y no se representa.
- **Poplíteos superficiales y profundos**: la fuente (Gray 1918) describe los nodos poplíteos por su posición y no usa esos nombres. Se asigna al grupo superficial el nodo bajo la fascia poplítea junto a la safena menor, y al profundo el que está entre la arteria poplítea y la rodilla y los que flanquean los vasos poplíteos.
- **Nodos tibiales anterior y posterior y fibular**: ninguna fuente libre consultada los describe. Solo se afirma su nombre en la TA2 (entre paréntesis) y, en los tibiales, que los troncos profundos que acompañan a los vasos tibiales llegan a los poplíteos. Localización, reparo y drenaje quedan pendientes; su posición en el modelo viene de Z-Anatomy.
- **Aferentes de los inguinales superficiales**: la fuente da un territorio principal para cada subgrupo y una lista común para el conjunto; las fichas no reparten esa lista entre los subgrupos.
- **Tamaño**: la fuente da hasta 2 cm de diámetro y, en el eje corto, una media de 5,4 mm (2,1–13,6 mm) con un límite habitual de 10 mm. Los nodos del modelo (esferas de Z-Anatomy de 2–4 mm) son más pequeños que esa media.
- Las piezas `Proximal_deep_inguinal_node`, `Intermediate_deep_inguinal_node`, `Anterior_tibial_node`, `Posterior_tibial_node` y `Fibular_node` son nuevas: Z-Anatomy las traía ocultas (nombre entre paréntesis).

## Páginas

- `wp:External_iliac_lymph_nodes`: «External iliac lymph nodes», revisión 1223684511 (https://en.wikipedia.org/w/index.php?title=External_iliac_lymph_nodes&oldid=1223684511), consultada 2026-11-10, CC BY-SA 4.0
- `wp:Femoral_canal`: «Femoral canal», revisión 1300949940 (https://en.wikipedia.org/w/index.php?title=Femoral_canal&oldid=1300949940), consultada 2026-11-12, CC BY-SA 4.0
- `wp:Femoral_triangle`: «Femoral triangle», revisión 1380880813 (https://en.wikipedia.org/w/index.php?title=Femoral_triangle&oldid=1380880813), consultada 2026-11-09, CC BY-SA 4.0
- `wp:Great_saphenous_vein`: «Great saphenous vein», revisión 1380879332 (https://en.wikipedia.org/w/index.php?title=Great_saphenous_vein&oldid=1380879332), consultada 2026-11-12, CC BY-SA 4.0
- `wp:Inguinal_lymph_nodes`: «Inguinal lymph nodes», revisión 1330887775 (https://en.wikipedia.org/w/index.php?title=Inguinal_lymph_nodes&oldid=1330887775), consultada 2026-11-12, CC BY-SA 4.0
- `wp:Lymph_node`: «Lymph node», revisión 1360517815 (https://en.wikipedia.org/w/index.php?title=Lymph_node&oldid=1360517815), consultada 2026-11-12, CC BY-SA 4.0
- `wp:Popliteal_fossa`: «Popliteal fossa», revisión 1338086809 (https://en.wikipedia.org/w/index.php?title=Popliteal_fossa&oldid=1338086809), consultada 2026-11-12, CC BY-SA 4.0
- `wp:Popliteal_lymph_nodes`: «Popliteal lymph nodes», revisión 1277704248 (https://en.wikipedia.org/w/index.php?title=Popliteal_lymph_nodes&oldid=1277704248), consultada 2026-11-12, CC BY-SA 4.0
- `wp:Saphenous_opening`: «Saphenous opening», revisión 1320927768 (https://en.wikipedia.org/w/index.php?title=Saphenous_opening&oldid=1320927768), consultada 2026-11-12, CC BY-SA 4.0
- `wp:Small_saphenous_vein`: «Small saphenous vein», revisión 1360737448 (https://en.wikipedia.org/w/index.php?title=Small_saphenous_vein&oldid=1360737448), consultada 2026-11-12, CC BY-SA 4.0

## Fichas

### Superomedial_superficial_inguinal_nodes

Nombre: TA2 n.º 5350.

- **Qué es**: Forman parte de los nodos (ganglios) inguinales superficiales, una cadena de unos 10 nodos situada inmediatamente por debajo del ligamento inguinal. — wp:Inguinal_lymph_nodes «form a chain immediately inferior to the inguinal ligament»; wp:Inguinal_lymph_nodes «There are approximately 10 superficial lymph nodes.»
- **Qué es**: Los inguinales superficiales se dividen en tres grupos: inferior, superolateral y superomedial. — wp:Inguinal_lymph_nodes «They are divided into three groups:»; TA2 n.º 5350; TA2 n.º 5351; TA2 n.º 5352
- **Localización**: Los superomediales están a la altura de la parte media del hiato safeno. — wp:Inguinal_lymph_nodes «superomedial – located at the middle of the saphenous opening»
- **Localización**: Están en el triángulo femoral, en la fascia superficial (bajo la fascia de Camper), sobre los vasos femorales en la cara medial del muslo. — wp:Femoral_triangle «The superficial fascia contains the superficial inguinal lymph nodes»; wp:Inguinal_lymph_nodes «They lie deep to the fascia of Camper that overlies the femoral vessels at the medial aspect of the thigh.»
- **Localización**: Su territorio está limitado por arriba por el ligamento inguinal, lateralmente por el borde del sartorio y medialmente por el aductor largo. — wp:Inguinal_lymph_nodes «They are bounded superiorly by the inguinal ligament in the femoral triangle, laterally by the border of the sartorius muscle, and medially by the adductor longus muscle.»
- **Reparo**: El hiato safeno es una abertura ovalada de la fascia lata, 3–4 cm por debajo y lateral al tubérculo del pubis; por él la vena safena magna atraviesa la fascia cribiforme para unirse a la vena femoral. — wp:Saphenous_opening «is an oval opening in the upper mid part of the fascia lata of the thigh»; wp:Saphenous_opening «It lies 3–4 cm below and lateral to the pubic tubercle»; wp:Great_saphenous_vein «dives down deep through the cribriform fascia of the saphenous opening to join the femoral vein»
- **Recibe**: Reciben la linfa del periné y de los genitales. — wp:Inguinal_lymph_nodes «take drainage from the perineum and genitals»
- **Recibe**: El conjunto de los inguinales superficiales puede recibir, según el caso, la piel del pene, el escroto, el periné, la nalga, la pared abdominal por debajo del ombligo, la espalda por debajo de la cresta ilíaca, la vulva y el ano por debajo de la línea pectínea. — wp:Inguinal_lymph_nodes «They may receive lymphatic afferents from the following as applicable»; wp:Inguinal_lymph_nodes «integument of the penis scrotum perineum buttock abdominal wall below the level of the umbilicus back below the level of the iliac crest vulva anus (below the pectinate line)»
- **Drena en**: Drenan en los nodos inguinales profundos. — wp:Inguinal_lymph_nodes «They drain to the deep inguinal lymph nodes.»; wp:Femoral_triangle «It receives lymphatic drainage from superficial inguinal lymph nodes»
- **En este modelo**: En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real. — *Modelo 3D*
- **En este modelo**: Esta ficha no reparte entre los tres subgrupos los aferentes del conjunto: la fuente da una lista común y un territorio principal para cada subgrupo. — *Modelo 3D*
- **Puntos clave**: Su aumento de tamaño es un signo clínico importante: puede indicar una infección o la metástasis de un cáncer, como el de ano o el de vulva. — wp:Inguinal_lymph_nodes «The presence of swollen inguinal lymph nodes is an important clinical sign because lymphadenopathy (swelling) may indicate an infection, or spread as a metastasis from cancers, such as anal cancer and vulvar cancer.»
- **Puntos clave**: Los nodos inguinales, cerca del pliegue de la ingle, se pueden palpar cuando aumentan de tamaño y a veces sin aumentar. — wp:Lymph_node «Some lymph nodes can be felt when enlarged (and occasionally when not)»; wp:Lymph_node «the inguinal lymph nodes near the groin crease»
- *vías*: drena: Proximal_deep_inguinal_node, Intermediate_deep_inguinal_node

### Superolateral_superficial_inguinal_nodes

Nombre: TA2 n.º 5351.

- **Qué es**: Forman parte de los nodos (ganglios) inguinales superficiales, una cadena de unos 10 nodos situada inmediatamente por debajo del ligamento inguinal. — wp:Inguinal_lymph_nodes «form a chain immediately inferior to the inguinal ligament»; wp:Inguinal_lymph_nodes «There are approximately 10 superficial lymph nodes.»
- **Qué es**: Los inguinales superficiales se dividen en tres grupos: inferior, superolateral y superomedial. — wp:Inguinal_lymph_nodes «They are divided into three groups:»; TA2 n.º 5350; TA2 n.º 5351; TA2 n.º 5352
- **Localización**: Los superolaterales están a un lado del hiato safeno. — wp:Inguinal_lymph_nodes «superolateral – on the side of the saphenous opening»
- **Localización**: Están en el triángulo femoral, en la fascia superficial (bajo la fascia de Camper), sobre los vasos femorales en la cara medial del muslo. — wp:Femoral_triangle «The superficial fascia contains the superficial inguinal lymph nodes»; wp:Inguinal_lymph_nodes «They lie deep to the fascia of Camper that overlies the femoral vessels at the medial aspect of the thigh.»
- **Localización**: Su territorio está limitado por arriba por el ligamento inguinal, lateralmente por el borde del sartorio y medialmente por el aductor largo. — wp:Inguinal_lymph_nodes «They are bounded superiorly by the inguinal ligament in the femoral triangle, laterally by the border of the sartorius muscle, and medially by the adductor longus muscle.»
- **Reparo**: El hiato safeno es una abertura ovalada de la fascia lata, 3–4 cm por debajo y lateral al tubérculo del pubis; por él la vena safena magna atraviesa la fascia cribiforme para unirse a la vena femoral. — wp:Saphenous_opening «is an oval opening in the upper mid part of the fascia lata of the thigh»; wp:Saphenous_opening «It lies 3–4 cm below and lateral to the pubic tubercle»; wp:Great_saphenous_vein «dives down deep through the cribriform fascia of the saphenous opening to join the femoral vein»
- **Recibe**: Reciben la linfa de la parte lateral de la nalga y de la parte baja de la pared abdominal. — wp:Inguinal_lymph_nodes «receive drainage from the side buttocks and the lower abdominal wall»
- **Recibe**: El conjunto de los inguinales superficiales puede recibir, según el caso, la piel del pene, el escroto, el periné, la nalga, la pared abdominal por debajo del ombligo, la espalda por debajo de la cresta ilíaca, la vulva y el ano por debajo de la línea pectínea. — wp:Inguinal_lymph_nodes «They may receive lymphatic afferents from the following as applicable»; wp:Inguinal_lymph_nodes «integument of the penis scrotum perineum buttock abdominal wall below the level of the umbilicus back below the level of the iliac crest vulva anus (below the pectinate line)»
- **Drena en**: Drenan en los nodos inguinales profundos. — wp:Inguinal_lymph_nodes «They drain to the deep inguinal lymph nodes.»; wp:Femoral_triangle «It receives lymphatic drainage from superficial inguinal lymph nodes»
- **En este modelo**: En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real. — *Modelo 3D*
- **En este modelo**: Esta ficha no reparte entre los tres subgrupos los aferentes del conjunto: la fuente da una lista común y un territorio principal para cada subgrupo. — *Modelo 3D*
- **Puntos clave**: Su aumento de tamaño es un signo clínico importante: puede indicar una infección o la metástasis de un cáncer, como el de ano o el de vulva. — wp:Inguinal_lymph_nodes «The presence of swollen inguinal lymph nodes is an important clinical sign because lymphadenopathy (swelling) may indicate an infection, or spread as a metastasis from cancers, such as anal cancer and vulvar cancer.»
- **Puntos clave**: Los nodos inguinales, cerca del pliegue de la ingle, se pueden palpar cuando aumentan de tamaño y a veces sin aumentar. — wp:Lymph_node «Some lymph nodes can be felt when enlarged (and occasionally when not)»; wp:Lymph_node «the inguinal lymph nodes near the groin crease»
- *vías*: drena: Proximal_deep_inguinal_node, Intermediate_deep_inguinal_node

### Inferior_superficial_inguinal_nodes

Nombre: TA2 n.º 5352.

- **Qué es**: Forman parte de los nodos (ganglios) inguinales superficiales, una cadena de unos 10 nodos situada inmediatamente por debajo del ligamento inguinal. — wp:Inguinal_lymph_nodes «form a chain immediately inferior to the inguinal ligament»; wp:Inguinal_lymph_nodes «There are approximately 10 superficial lymph nodes.»
- **Qué es**: Los inguinales superficiales se dividen en tres grupos: inferior, superolateral y superomedial. — wp:Inguinal_lymph_nodes «They are divided into three groups:»; TA2 n.º 5350; TA2 n.º 5351; TA2 n.º 5352
- **Localización**: Los inferiores están por debajo del hiato safeno. — wp:Inguinal_lymph_nodes «inferior – inferior of the saphenous opening of the leg»
- **Localización**: Están en el triángulo femoral, en la fascia superficial (bajo la fascia de Camper), sobre los vasos femorales en la cara medial del muslo. — wp:Femoral_triangle «The superficial fascia contains the superficial inguinal lymph nodes»; wp:Inguinal_lymph_nodes «They lie deep to the fascia of Camper that overlies the femoral vessels at the medial aspect of the thigh.»
- **Localización**: Su territorio está limitado por arriba por el ligamento inguinal, lateralmente por el borde del sartorio y medialmente por el aductor largo. — wp:Inguinal_lymph_nodes «They are bounded superiorly by the inguinal ligament in the femoral triangle, laterally by the border of the sartorius muscle, and medially by the adductor longus muscle.»
- **Reparo**: El hiato safeno es una abertura ovalada de la fascia lata, 3–4 cm por debajo y lateral al tubérculo del pubis; por él la vena safena magna atraviesa la fascia cribiforme para unirse a la vena femoral. — wp:Saphenous_opening «is an oval opening in the upper mid part of the fascia lata of the thigh»; wp:Saphenous_opening «It lies 3–4 cm below and lateral to the pubic tubercle»; wp:Great_saphenous_vein «dives down deep through the cribriform fascia of the saphenous opening to join the femoral vein»
- **Reparo**: La parte alta de la vena safena magna, que está en la misma fascia superficial del triángulo femoral que los inguinales superficiales. — wp:Femoral_triangle «The superficial fascia contains the superficial inguinal lymph nodes, femoral branch of the genitofemoral nerve, branches of the ilioinguinal nerve, superficial branches of the femoral artery with accompanying veins, and upper part of the great saphenous vein.»
- **Recibe**: Reciben la linfa de las piernas. — wp:Inguinal_lymph_nodes «receive drainage from lower legs»
- **Recibe**: Al conjunto superficial le llega la linfa del muslo y de la cara medial de la pierna; la de la cara lateral de la pierna pasa antes por los nodos poplíteos. — wp:Inguinal_lymph_nodes «the thigh and the medial side of the leg (the lateral leg drains to the popliteal lymph nodes first)»
- **Recibe**: Unos pocos eferentes poplíteos acompañan a la vena safena magna y terminan en los nodos inguinales superficiales (el grupo «subinguinal superficial» de la fuente). — wp:Popliteal_lymph_nodes «but a few may accompany the great saphenous vein, and end in the glands of the superficial subinguinal group»
- **Drena en**: Drenan en los nodos inguinales profundos. — wp:Inguinal_lymph_nodes «They drain to the deep inguinal lymph nodes.»; wp:Femoral_triangle «It receives lymphatic drainage from superficial inguinal lymph nodes»
- **En este modelo**: En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real. — *Modelo 3D*
- **En este modelo**: Esta ficha no reparte entre los tres subgrupos los aferentes del conjunto: la fuente da una lista común y un territorio principal para cada subgrupo. — *Modelo 3D*
- **Puntos clave**: La fuente da dos cifras de tamaño normal: hasta 2 cm de diámetro y, medido en el eje corto, una media de 5,4 mm con un límite habitual de 10 mm. — wp:Inguinal_lymph_nodes «They normally measure up to 2 cm in diameter.»; wp:Inguinal_lymph_nodes «The mean size of an inguinal lymph node, as measured over the short-axis, is approximately 5.4 mm (range 2.1-13.6 mm)»; wp:Inguinal_lymph_nodes «A size of up to 10 mm is generally regarded as a cut-off value for normal vs abnormal inguinal lymph node size.»
- **Puntos clave**: Los nodos inguinales, cerca del pliegue de la ingle, se pueden palpar cuando aumentan de tamaño y a veces sin aumentar. — wp:Lymph_node «Some lymph nodes can be felt when enlarged (and occasionally when not)»; wp:Lymph_node «the inguinal lymph nodes near the groin crease»
- *vías*: recibe: Superficial_lymphatic_vessels_of_lower_limb · drena: Proximal_deep_inguinal_node, Intermediate_deep_inguinal_node

### Intermediate_deep_inguinal_node

Nombre: TA2 n.º 5355.

- **Qué es**: Los nodos inguinales profundos son de 3 a 5. — wp:Inguinal_lymph_nodes «The deep inguinal lymph nodes are 3-5 in number.»
- **Qué es**: La Terminologia Anatomica 2 distingue tres nodos inguinales profundos: proximal, intermedio y distal; los dos primeros figuran entre paréntesis. — TA2 n.º 5354; TA2 n.º 5355; TA2 n.º 5356
- **Localización**: Están por dentro de la parte superior de la vena femoral, en profundidad respecto a la fascia (la cribiforme, según una de las fuentes), dentro del conducto femoral, el compartimento medial de la vaina femoral. — wp:Inguinal_lymph_nodes «They lie medial to the femoral vein deep to the cribriform fascia.»; wp:Femoral_triangle «It lies deep to the deep fascia, medial to the upper part of the femoral vein, inside the femoral canal (medial compartment of the femoral sheath).»
- **Localización**: El conducto femoral contiene vasos linfáticos, tejido adiposo y tejido conectivo laxo y, a veces, un nodo inguinal profundo. — wp:Femoral_canal «The femoral canal contains lymphatic vessels, and adipose and loose connective tissue, as well as - sometimes - a deep inguinal lymph node.»
- **Reparo**: La vena femoral: los inguinales profundos quedan por dentro de ella, bajo la fascia cribiforme. — wp:Inguinal_lymph_nodes «They lie medial to the femoral vein deep to the cribriform fascia.»
- **Recibe**: Reciben la linfa de los inguinales superficiales, del glande del pene o del clítoris y de los linfáticos profundos del miembro inferior. — wp:Femoral_triangle «It receives lymphatic drainage from superficial inguinal lymph nodes, lymphatic drainage from the glans penis or clitoris, and from the deep lymphatics of the lower limb.»
- **Recibe**: Los eferentes de los nodos poplíteos suben casi todos junto a los vasos femorales hasta los inguinales profundos. — wp:Popliteal_lymph_nodes «The efferents of the popliteal lymph nodes pass almost entirely alongside the femoral vessels to the deep inguinal lymph nodes»
- **Drena en**: Drenan hacia arriba en los nodos ilíacos externos y, de ahí, en los nodos pélvicos y en los paraaórticos. — wp:Inguinal_lymph_nodes «The deep inguinal lymph nodes drain superiorly to the external iliac lymph nodes, then to the pelvic lymph nodes and on to the paraaortic lymph nodes.»; wp:External_iliac_lymph_nodes «Their principal afferents are derived from the inguinal lymph nodes»
- **En este modelo**: En este modelo el nodo se representa con una forma y un tamaño esquemáticos. — *Modelo 3D*
- **En este modelo**: Es una pieza que Z-Anatomy traía oculta (su nombre va entre paréntesis) y que Anato3D añade al modelo en la revisión del sistema linfático de noviembre de 2026. — *Modelo 3D*
- **En este modelo**: La fuente no describe por separado el nodo intermedio: lo que dice esta ficha vale para el conjunto de los inguinales profundos. — *Modelo 3D*
- **En este modelo**: El nodo inguinal profundo distal de la TA2 no está en Z-Anatomy y no se representa. — TA2 n.º 5356; *Modelo 3D*
- *vías*: recibe: Superomedial_superficial_inguinal_nodes, Superolateral_superficial_inguinal_nodes, Inferior_superficial_inguinal_nodes, Deep_popliteal_nodes, Deep_lymphatic_vessels_of_lower_limb · drena: Medial_external_iliac_nodes, Intermediate_external_iliac_nodes

### Proximal_deep_inguinal_node

Nombre: TA2 n.º 5354.

- **Qué es**: Los nodos inguinales profundos son de 3 a 5. — wp:Inguinal_lymph_nodes «The deep inguinal lymph nodes are 3-5 in number.»
- **Qué es**: La Terminologia Anatomica 2 distingue tres nodos inguinales profundos: proximal, intermedio y distal; los dos primeros figuran entre paréntesis. — TA2 n.º 5354; TA2 n.º 5355; TA2 n.º 5356
- **Qué es**: El nodo profundo más superior, situado en la ingle en profundidad respecto al ligamento inguinal, se llama nodo de Cloquet o de Rosenmüller; también puede considerarse el más inferior de los ilíacos externos. — wp:Inguinal_lymph_nodes «The superior-most node is situated in the groin, deep to the inguinal ligament, and is termed the Cloquet's node (also Rosenmuller's node).»; wp:Inguinal_lymph_nodes «It can instead be considered as the inferior-most of the external iliac lymph nodes.»
- **Localización**: El más superior de los inguinales profundos está en la ingle, en profundidad respecto al ligamento inguinal, dentro del conducto femoral. — wp:Inguinal_lymph_nodes «The superior-most node is situated in the groin, deep to the inguinal ligament»; wp:Femoral_triangle «Cloquet's node (also known as Rosenmuller's node) also lies in this canal.»
- **Localización**: Están por dentro de la parte superior de la vena femoral, en profundidad respecto a la fascia (la cribiforme, según una de las fuentes), dentro del conducto femoral, el compartimento medial de la vaina femoral. — wp:Inguinal_lymph_nodes «They lie medial to the femoral vein deep to the cribriform fascia.»; wp:Femoral_triangle «It lies deep to the deep fascia, medial to the upper part of the femoral vein, inside the femoral canal (medial compartment of the femoral sheath).»
- **Reparo**: El ligamento inguinal, que lo cubre por delante, y la vena femoral, que queda por fuera de él. — wp:Inguinal_lymph_nodes «deep to the inguinal ligament»; wp:Inguinal_lymph_nodes «They lie medial to the femoral vein deep to the cribriform fascia.»
- **Recibe**: Reciben la linfa de los inguinales superficiales, del glande del pene o del clítoris y de los linfáticos profundos del miembro inferior. — wp:Femoral_triangle «It receives lymphatic drainage from superficial inguinal lymph nodes, lymphatic drainage from the glans penis or clitoris, and from the deep lymphatics of the lower limb.»
- **Recibe**: Los eferentes de los nodos poplíteos suben casi todos junto a los vasos femorales hasta los inguinales profundos. — wp:Popliteal_lymph_nodes «The efferents of the popliteal lymph nodes pass almost entirely alongside the femoral vessels to the deep inguinal lymph nodes»
- **Drena en**: Drenan hacia arriba en los nodos ilíacos externos y, de ahí, en los nodos pélvicos y en los paraaórticos. — wp:Inguinal_lymph_nodes «The deep inguinal lymph nodes drain superiorly to the external iliac lymph nodes, then to the pelvic lymph nodes and on to the paraaortic lymph nodes.»; wp:External_iliac_lymph_nodes «Their principal afferents are derived from the inguinal lymph nodes»
- **En este modelo**: En este modelo el nodo se representa con una forma y un tamaño esquemáticos. — *Modelo 3D*
- **En este modelo**: Es una pieza que Z-Anatomy traía oculta (su nombre va entre paréntesis) y que Anato3D añade al modelo en la revisión del sistema linfático de noviembre de 2026. — *Modelo 3D*
- **En este modelo**: Esta ficha identifica el nodo inguinal profundo proximal de la TA2 con el nodo de Cloquet porque las fuentes llaman así al más superior de los profundos; la TA2 no da el epónimo. — TA2 n.º 5354; *Modelo 3D*
- **Puntos clave**: El nodo de Cloquet se considera un posible nodo centinela. — wp:Inguinal_lymph_nodes «Cloquet's node is also considered as a potential sentinel lymph node.»
- **Puntos clave**: Tras una biopsia de nodo centinela positiva se suelen extirpar solo los nodos superficiales, salvo que el nodo de Cloquet esté afectado clínicamente. — wp:Femoral_triangle «generally only the superficial nodes are removed, unless Cloquet's node (the most superior of the deep nodes) is clinically positive»
- **Puntos clave**: El epónimo recuerda al cirujano francés Jules Germain Cloquet o al anatomista alemán Johann Christian Rosenmüller. — wp:Inguinal_lymph_nodes «This node is named for French surgeon Jules Germain Cloquet, or for German anatomist Johann Christian Rosenmüller.»
- *vías*: recibe: Superomedial_superficial_inguinal_nodes, Superolateral_superficial_inguinal_nodes, Inferior_superficial_inguinal_nodes, Deep_popliteal_nodes, Deep_lymphatic_vessels_of_lower_limb · drena: Medial_external_iliac_nodes, Intermediate_external_iliac_nodes

### Superficial_popliteal_nodes

Nombre: TA2 n.º 5358.

- **Qué es**: Los nodos (ganglios) poplíteos son pequeños, unos seis o siete, y están en la grasa de la fosa poplítea, detrás de la rodilla. — wp:Popliteal_lymph_nodes «small in size and some six or seven in number, are embedded in the fat contained in the popliteal fossa»; wp:Popliteal_fossa «is a shallow depression located at the back of the knee joint»
- **Qué es**: La fosa poplítea, como otras superficies de flexión de las grandes articulaciones, tiene un mayor número de nodos linfáticos. — wp:Popliteal_fossa «it is an area where blood vessels and nerves pass relatively superficially, and with an increased number of lymph nodes»
- **Localización**: Uno de los nodos poplíteos está justo bajo la fascia poplítea, cerca de la parte final de la vena safena menor. — wp:Popliteal_lymph_nodes «One lies immediately beneath the popliteal fascia, near the terminal part of the small saphenous vein»
- **Reparo**: La terminación de la vena safena menor, que sube por la cara posterior de la pierna, pasa entre las cabezas del gastrocnemio y suele desembocar en la vena poplítea a la altura de la rodilla o por encima. — wp:Popliteal_lymph_nodes «near the terminal part of the small saphenous vein»; wp:Small_saphenous_vein «runs along the posterior aspect of the leg (with the sural nerve), where it passes between the heads of the gastrocnemius muscle»; wp:Small_saphenous_vein «Usually, it drains into the popliteal vein, at or above the level of the knee joint.»
- **Recibe**: Drena la región de la que la safena menor recoge sus tributarias: las zonas superficiales de la cara posterolateral de la pierna y la planta del pie. — wp:Popliteal_lymph_nodes «drains the region from which this vein derives its tributaries, such as superficial regions of the posterolateral aspect of the leg and the plantar aspect of the foot»
- **Recibe**: La linfa de la cara lateral de la pierna pasa por los nodos poplíteos antes de llegar a los inguinales. — wp:Inguinal_lymph_nodes «the lateral leg drains to the popliteal lymph nodes first»
- **Drena en**: Los eferentes de los nodos poplíteos suben casi todos junto a los vasos femorales hasta los inguinales profundos. — wp:Popliteal_lymph_nodes «The efferents of the popliteal lymph nodes pass almost entirely alongside the femoral vessels to the deep inguinal lymph nodes»
- **Drena en**: Unos pocos eferentes poplíteos acompañan a la vena safena magna y terminan en los nodos inguinales superficiales (el grupo «subinguinal superficial» de la fuente). — wp:Popliteal_lymph_nodes «but a few may accompany the great saphenous vein, and end in the glands of the superficial subinguinal group»
- **En este modelo**: En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real. — *Modelo 3D*
- **En este modelo**: La fuente describe los nodos poplíteos por su posición, sin llamarlos superficiales o profundos; esta ficha asigna al grupo superficial el nodo bajo la fascia poplítea, junto a la safena menor, y al profundo los que están junto a los vasos poplíteos y la articulación. — *Modelo 3D*
- **Puntos clave**: La linfa de las piernas sube hacia el corazón gracias a la bomba de la pantorrilla: al caminar, el músculo de la pantorrilla se contrae y exprime la linfa; al relajarse, las válvulas de los vasos impiden que vuelva. — wp:Popliteal_lymph_nodes «The flow of lymph from the legs towards the heart is the result of the calf pump»; wp:Popliteal_lymph_nodes «during walking the calf muscle contracts, squeezing lymph out of the leg via the lymphatic vessels»; wp:Popliteal_lymph_nodes «valves in the vessels shut preventing the fluid from returning to the lower extremities»
- *vías*: recibe: Superficial_lymphatic_vessels_of_lower_limb · drena: Intermediate_deep_inguinal_node, Inferior_superficial_inguinal_nodes

### Deep_popliteal_nodes

Nombre: TA2 n.º 5359.

- **Qué es**: Los nodos (ganglios) poplíteos son pequeños, unos seis o siete, y están en la grasa de la fosa poplítea, detrás de la rodilla. — wp:Popliteal_lymph_nodes «small in size and some six or seven in number, are embedded in the fat contained in the popliteal fossa»; wp:Popliteal_fossa «is a shallow depression located at the back of the knee joint»
- **Qué es**: La fosa poplítea, como otras superficies de flexión de las grandes articulaciones, tiene un mayor número de nodos linfáticos. — wp:Popliteal_fossa «it is an area where blood vessels and nerves pass relatively superficially, and with an increased number of lymph nodes»
- **Localización**: Uno está entre la arteria poplítea y la cara posterior de la articulación de la rodilla. — wp:Popliteal_lymph_nodes «Another is between the popliteal artery and the posterior surface of the knee-joint.»
- **Localización**: Los demás están a los lados de los vasos poplíteos. — wp:Popliteal_lymph_nodes «The others lie at the sides of the popliteal vessels»
- **Reparo**: La arteria y la vena poplíteas, en la fosa poplítea; la arteria poplítea continúa a la arteria femoral. — wp:Popliteal_lymph_nodes «The others lie at the sides of the popliteal vessels»; wp:Popliteal_fossa «popliteal artery, a continuation of the femoral artery»
- **Recibe**: El nodo situado detrás de la rodilla recibe la linfa de la articulación de la rodilla y los vasos que acompañan a las arterias geniculares. — wp:Popliteal_lymph_nodes «It receives afferents from the knee-joint, together with those that accompany the genicular arteries.»
- **Recibe**: En la pierna, los troncos linfáticos profundos acompañan a los vasos tibiales anteriores y posteriores y llegan a los nodos poplíteos situados a los lados de los vasos poplíteos. — wp:Popliteal_lymph_nodes «The others lie at the sides of the popliteal vessels, and receive, as efferents, the trunks that accompany the anterior and posterior tibial vessels.»
- **Drena en**: Los eferentes de los nodos poplíteos suben casi todos junto a los vasos femorales hasta los inguinales profundos. — wp:Popliteal_lymph_nodes «The efferents of the popliteal lymph nodes pass almost entirely alongside the femoral vessels to the deep inguinal lymph nodes»
- **Drena en**: Unos pocos eferentes poplíteos acompañan a la vena safena magna y terminan en los nodos inguinales superficiales (el grupo «subinguinal superficial» de la fuente). — wp:Popliteal_lymph_nodes «but a few may accompany the great saphenous vein, and end in the glands of the superficial subinguinal group»
- **En este modelo**: En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real. — *Modelo 3D*
- **En este modelo**: La fuente describe los nodos poplíteos por su posición, sin llamarlos superficiales o profundos; esta ficha asigna al grupo superficial el nodo bajo la fascia poplítea, junto a la safena menor, y al profundo los que están junto a los vasos poplíteos y la articulación. — *Modelo 3D*
- **Puntos clave**: La linfa de las piernas sube hacia el corazón gracias a la bomba de la pantorrilla: al caminar, el músculo de la pantorrilla se contrae y exprime la linfa; al relajarse, las válvulas de los vasos impiden que vuelva. — wp:Popliteal_lymph_nodes «The flow of lymph from the legs towards the heart is the result of the calf pump»; wp:Popliteal_lymph_nodes «during walking the calf muscle contracts, squeezing lymph out of the leg via the lymphatic vessels»; wp:Popliteal_lymph_nodes «valves in the vessels shut preventing the fluid from returning to the lower extremities»
- *vías*: recibe: Deep_lymphatic_vessels_of_lower_limb · drena: Intermediate_deep_inguinal_node, Proximal_deep_inguinal_node, Inferior_superficial_inguinal_nodes

### Anterior_tibial_node

Nombre: TA2 n.º 5360.

- **Qué es**: Nodo (ganglio) linfático de la pierna que la Terminologia Anatomica 2 llama nodo tibial anterior. — TA2 n.º 5360
- **Qué es**: En la Terminologia Anatomica 2 su nombre figura entre paréntesis. — TA2 n.º 5360
- **Localización**: pendiente. Ninguna fuente libre consultada (Wikipedia en inglés y en español) describe este nodo.
- **Reparo**: pendiente. Ninguna fuente libre consultada (Wikipedia en inglés y en español) describe este nodo.
- **Recibe**: En la pierna, los troncos linfáticos profundos acompañan a los vasos tibiales anteriores y posteriores y llegan a los nodos poplíteos situados a los lados de los vasos poplíteos. — wp:Popliteal_lymph_nodes «The others lie at the sides of the popliteal vessels, and receive, as efferents, the trunks that accompany the anterior and posterior tibial vessels.»
- **Drena en**: pendiente. Ninguna fuente libre consultada (Wikipedia en inglés y en español) describe este nodo. La tabla del encargo supone que drena en los poplíteos profundos, pero no se afirma sin fuente.
- **En este modelo**: En este modelo el nodo se representa con una forma y un tamaño esquemáticos. — *Modelo 3D*
- **En este modelo**: Es una pieza que Z-Anatomy traía oculta (su nombre va entre paréntesis) y que Anato3D añade al modelo en la revisión del sistema linfático de noviembre de 2026. — *Modelo 3D*
- **En este modelo**: En este modelo el nodo está en la parte alta de la pierna, en la posición que le da Z-Anatomy; esa posición no procede de una fuente citada. — *Modelo 3D*
- *vías*: recibe: Deep_lymphatic_vessels_of_lower_limb

### Posterior_tibial_node

Nombre: TA2 n.º 5361.

- **Qué es**: Nodo (ganglio) linfático de la pierna que la Terminologia Anatomica 2 llama nodo tibial posterior. — TA2 n.º 5361
- **Qué es**: En la Terminologia Anatomica 2 su nombre figura entre paréntesis. — TA2 n.º 5361
- **Localización**: pendiente. Ninguna fuente libre consultada (Wikipedia en inglés y en español) describe este nodo.
- **Reparo**: pendiente. Ninguna fuente libre consultada (Wikipedia en inglés y en español) describe este nodo.
- **Recibe**: En la pierna, los troncos linfáticos profundos acompañan a los vasos tibiales anteriores y posteriores y llegan a los nodos poplíteos situados a los lados de los vasos poplíteos. — wp:Popliteal_lymph_nodes «The others lie at the sides of the popliteal vessels, and receive, as efferents, the trunks that accompany the anterior and posterior tibial vessels.»
- **Drena en**: pendiente. Ninguna fuente libre consultada (Wikipedia en inglés y en español) describe este nodo. La tabla del encargo supone que drena en los poplíteos profundos, pero no se afirma sin fuente.
- **En este modelo**: En este modelo el nodo se representa con una forma y un tamaño esquemáticos. — *Modelo 3D*
- **En este modelo**: Es una pieza que Z-Anatomy traía oculta (su nombre va entre paréntesis) y que Anato3D añade al modelo en la revisión del sistema linfático de noviembre de 2026. — *Modelo 3D*
- **En este modelo**: En este modelo el nodo está en la parte alta de la pierna, en la posición que le da Z-Anatomy; esa posición no procede de una fuente citada. — *Modelo 3D*
- *vías*: recibe: Deep_lymphatic_vessels_of_lower_limb

### Fibular_node

Nombre: TA2 n.º 5362.

- **Qué es**: Nodo (ganglio) linfático de la pierna que la Terminologia Anatomica 2 llama nodo fibular. — TA2 n.º 5362
- **Qué es**: En la Terminologia Anatomica 2 su nombre figura entre paréntesis. — TA2 n.º 5362
- **Localización**: pendiente. Ninguna fuente libre consultada (Wikipedia en inglés y en español) describe este nodo.
- **Reparo**: pendiente. Ninguna fuente libre consultada (Wikipedia en inglés y en español) describe este nodo.
- **Recibe**: pendiente. Ninguna fuente libre consultada (Wikipedia en inglés y en español) describe este nodo. La fuente sobre los poplíteos solo nombra los troncos que acompañan a los vasos tibiales, no a los fibulares.
- **Drena en**: pendiente. Ninguna fuente libre consultada (Wikipedia en inglés y en español) describe este nodo. La tabla del encargo supone que drena en los poplíteos profundos, pero no se afirma sin fuente.
- **En este modelo**: En este modelo el nodo se representa con una forma y un tamaño esquemáticos. — *Modelo 3D*
- **En este modelo**: Es una pieza que Z-Anatomy traía oculta (su nombre va entre paréntesis) y que Anato3D añade al modelo en la revisión del sistema linfático de noviembre de 2026. — *Modelo 3D*
- **En este modelo**: En este modelo el nodo está en la parte alta de la pierna, en la posición que le da Z-Anatomy; esa posición no procede de una fuente citada. — *Modelo 3D*

