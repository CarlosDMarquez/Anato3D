---
title: Fuentes de las fichas linfáticas del abdomen
date: 2026-11-12
---

# Fuentes de las fichas linfáticas del abdomen (2026-11-12)

Qué fuente respalda cada frase de las fichas de los nodos (ganglios) del abdomen (`web/src/data/linfatico/abdomen.js`): lumbares (aórticos laterales, preaórticos, retroaórticos, intermedios, cavales laterales, precavales y retrocavales), diafragmáticos inferiores, epigástricos inferiores, celíacos, gástricos derechos, gastroomentales derechos, pilóricos (suprapilórico, subpilóricos y retropilóricos), pancreáticos superiores e inferiores, esplénicos, pancreaticoduodenales superiores, cístico, mesentéricos superiores (yuxtaintestinales, centrales, ileocólicos, prececales, retrocecales, apendiculares, paracólicos, cólicos derechos y medios) y mesentéricos inferiores (cólicos izquierdos y sigmoideos). Son 31 fichas para las 32 piezas del grupo `Abdominal_lymph_nodes` (los epigástricos inferiores tienen pieza izquierda y derecha). La app muestra el número de la fuente tras cada frase y la cita literal al pasar el puntero.

Todo es **borrador** redactado con IA (Claude) a partir de las fuentes citadas, **sin revisión de un especialista**.

## Cómo se comprobó

1. Páginas bajadas con `node scripts/linfatico-citas.mjs bajar …` (Wikipedia en inglés, CC BY-SA 4.0; texto plano de la API, sin recuadros ni pies de imagen) y registradas con su revisión en `web/src/data/linfatico/comprobadas.js`.
2. `node scripts/linfatico-citas.mjs comprobar`: las 264 citas de este archivo, en 39 páginas, están en su página palabra por palabra (0 sin encontrar en todo el linfático).
3. `node scripts/check-cards.mjs`: «todo correcto»; 21 avisos de campos pendientes en estas fichas.
4. TeachMeAnatomy no se cita. Casi todas las páginas de grupos de nodos incorporan texto de dominio público del Gray de 1918.

## Decisiones y límites declarados

- **Dos clasificaciones.** El Gray (y Wikipedia, que lo copia) llama *preaórticos* al conjunto de celíacos, mesentéricos superiores y mesentéricos inferiores. La TA2 pone los *preaórticos* (n.º 5272) entre los nodos lumbares izquierdos, que son parietales, y clasifica los celíacos y los mesentéricos como viscerales. La ficha `Pre_aortic_nodes` usa lo que la fuente dice de los preaórticos y lo declara.
- **Lumbares derechos.** La fuente describe juntos los *paraaórticos derechos* (en parte delante de la cava, en parte detrás). Las fichas de los cavales laterales, precavales y retrocavales aplican esa descripción y la división de la TA2 (n.º 5275–5278). La fuente llama *paraaórticos* al grupo aórtico lateral.
- **Identificaciones con la TA2** (la fuente no usa el término de la TA2; cada una se dice en «En este modelo»): prececales = ileocólicos anteriores; retrocecales = ileocólicos posteriores detrás del ciego; apendicular = el nodo del mesoapéndice; paracólicos mesentéricos superiores = mesocólicos; yuxtaintestinales = mesentéricos junto a la pared del intestino; mesentéricos superiores centrales = los que rodean el origen de la arteria; suprapilórico = el nodo satélite sobre la arteria gástrica derecha; pancreáticos superiores e inferiores = suprapancreáticos e infrapancreáticos.
- **Subpilóricos.** La fuente los cuenta en la cadena hepática; la TA2, en los pilóricos.
- **Sin fuente** (solo nomenclatura de la TA2 y lo que se ve en el modelo; el resto en `pendientes`): gástricos derechos, retropilóricos (salvo lo que la fuente dice de los pilóricos en conjunto), diafragmáticos inferiores, epigástricos inferiores y lumbares intermedios; localización y reparo de los pancreáticos superiores e inferiores.
- **Grupos de la TA2 sin pieza en el modelo:** gástricos izquierdos (5284), gastroomentales izquierdos (5287), pancreaticoduodenales inferiores (5298), hepáticos (5299), nodo del foramen omental (5301), mesentéricos inferiores alrededor de la arteria (5312), paracólicos mesentéricos inferiores (5313) y anorrectales superiores (5316). Se dice en las fichas que los echan en falta.
- **Pilóricos nuevos.** `Suprapyloric_node`, `Subpyloric_nodes` y `Retropyloric_nodes` son piezas que Z-Anatomy traía ocultas (nombre entre paréntesis, igual que en la TA2).
- **Colectores esquemáticos.** Donde la geometría (`web/src/data/linfatico-rutas.js`) une grupos por un camino que la fuente no describe, la ficha lo dice en «En este modelo»; las `vias` de las fichas siguen a la fuente, no a la geometría.

## Contraste con la tabla de drenaje del encargo

- Confirmadas: Lateral_aortic → Lumbar_trunk_L; cavales (laterales, pre y retro) → Lumbar_trunk_R; Coeliac y Central_superior_mesenteric → Intestinal_trunks → Cisterna_chyli; suprapilórico y subpilóricos → Coeliac; pancreáticos superiores e inferiores → Coeliac.
- Matizadas: Splenic → Coeliac (pasa por supra e infrapancreáticos y omentales); Cystic_node → Coeliac (pasa por los hepáticos, que no están en el modelo); Superior_pancreaticoduodenal → Coeliac (pasa por los pilóricos); Appendicular, Precaecal y Retrocaecal → Ileocolic (la fuente los describe como subgrupos de la cadena ileocólica, no como escalones); los paraaórticos también drenan en preaórticos y retroaórticos y, a través de los pilares del diafragma, en el conducto torácico.
- Contradichas: Retro_aortic → Lumbar_trunk_L (fuente: sus eferentes terminan en la cisterna del quilo); Pre_aortic → Lumbar_trunk_L (fuente: la mayoría forma el tronco intestinal y algunos van a los retroaórticos); Left_colic y Sigmoid → Pre_aortic (fuente: van a los mesentéricos superiores y al final a los preaórticos; solo los que rodean la arteria mesentérica inferior van directos).
- Sin fuente: Right_gastric → Coeliac; Right_gastro_omental → Coeliac (la fuente solo dice que la linfa gástrica llega por el tronco intestinal a la cisterna); Retropyloric → Coeliac; Juxta_intestinal → Central_superior_mesenteric; Right_colic y Middle_colic → Central_superior_mesenteric (la fuente solo dice que los mesentéricos superiores van a los preaórticos); Intermediate_lumbar → troncos lumbares; Inferior_diaphragmatic → lumbares; Inferior_epigastric → ilíacos externos.

## Páginas citadas

- `wp:Abdominal_aorta`: [Abdominal aorta](https://en.wikipedia.org/w/index.php?title=Abdominal_aorta&oldid=1297251855) · revisión 1297251855, consultada 2026-11-13, CC BY-SA 4.0
- `wp:Appendicular_artery`: [Appendicular artery](https://en.wikipedia.org/w/index.php?title=Appendicular_artery&oldid=1380889304) · revisión 1380889304, consultada 2026-11-10, CC BY-SA 4.0
- `wp:Appendix_(anatomy)`: [Appendix (anatomy)](https://en.wikipedia.org/w/index.php?title=Appendix_(anatomy)&oldid=1382437093) · revisión 1382437093, consultada 2026-11-13, CC BY-SA 4.0
- `wp:Cecum`: [Cecum](https://en.wikipedia.org/w/index.php?title=Cecum&oldid=1380879850) · revisión 1380879850, consultada 2026-11-13, CC BY-SA 4.0
- `wp:Celiac_artery`: [Celiac artery](https://en.wikipedia.org/w/index.php?title=Celiac_artery&oldid=1360626712) · revisión 1360626712, consultada 2026-11-13, CC BY-SA 4.0
- `wp:Celiac_lymph_nodes`: [Celiac lymph nodes](https://en.wikipedia.org/w/index.php?title=Celiac_lymph_nodes&oldid=1300899971) · revisión 1300899971, consultada 2026-11-12, CC BY-SA 4.0
- `wp:Cystic_node`: [Cystic node](https://en.wikipedia.org/w/index.php?title=Cystic_node&oldid=1324251163) · revisión 1324251163, consultada 2026-11-13, CC BY-SA 4.0
- `wp:Cystohepatic_triangle`: [Cystohepatic triangle](https://en.wikipedia.org/w/index.php?title=Cystohepatic_triangle&oldid=1339888990) · revisión 1339888990, consultada 2026-11-13, CC BY-SA 4.0
- `wp:Duodenum`: [Duodenum](https://en.wikipedia.org/w/index.php?title=Duodenum&oldid=1385143543) · revisión 1385143543, consultada 2026-11-13, CC BY-SA 4.0
- `wp:Gallbladder`: [Gallbladder](https://en.wikipedia.org/w/index.php?title=Gallbladder&oldid=1378026106) · revisión 1378026106, consultada 2026-11-13, CC BY-SA 4.0
- `wp:Gastric_lymph_nodes`: [Gastric lymph nodes](https://en.wikipedia.org/w/index.php?title=Gastric_lymph_nodes&oldid=1253404266) · revisión 1253404266, consultada 2026-11-12, CC BY-SA 4.0
- `wp:Gastroduodenal_artery`: [Gastroduodenal artery](https://en.wikipedia.org/w/index.php?title=Gastroduodenal_artery&oldid=1380886741) · revisión 1380886741, consultada 2026-11-13, CC BY-SA 4.0
- `wp:Hepatic_lymph_nodes`: [Hepatic lymph nodes](https://en.wikipedia.org/w/index.php?title=Hepatic_lymph_nodes&oldid=1224153783) · revisión 1224153783, consultada 2026-11-12, CC BY-SA 4.0
- `wp:Ileocolic_artery`: [Ileocolic artery](https://en.wikipedia.org/w/index.php?title=Ileocolic_artery&oldid=1380884317) · revisión 1380884317, consultada 2026-11-10, CC BY-SA 4.0
- `wp:Inferior_mesenteric_artery`: [Inferior mesenteric artery](https://en.wikipedia.org/w/index.php?title=Inferior_mesenteric_artery&oldid=1380880057) · revisión 1380880057, consultada 2026-11-13, CC BY-SA 4.0
- `wp:Inferior_mesenteric_lymph_nodes`: [Inferior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Inferior_mesenteric_lymph_nodes&oldid=1300990457) · revisión 1300990457, consultada 2026-11-12, CC BY-SA 4.0
- `wp:Inferior_vena_cava`: [Inferior vena cava](https://en.wikipedia.org/w/index.php?title=Inferior_vena_cava&oldid=1380879153) · revisión 1380879153, consultada 2026-11-13, CC BY-SA 4.0
- `wp:Intestinal_trunk`: [Intestinal lymph trunk](https://en.wikipedia.org/w/index.php?title=Intestinal_lymph_trunk&oldid=1290203291) · revisión 1290203291, consultada 2026-11-12, CC BY-SA 4.0
- `wp:Large_intestine`: [Large intestine](https://en.wikipedia.org/w/index.php?title=Large_intestine&oldid=1385065993) · revisión 1385065993, consultada 2026-11-13, CC BY-SA 4.0
- `wp:Left_colic_artery`: [Left colic artery](https://en.wikipedia.org/w/index.php?title=Left_colic_artery&oldid=1380884170) · revisión 1380884170, consultada 2026-11-13, CC BY-SA 4.0
- `wp:Lumbar_lymph_nodes`: [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388) · revisión 1320392388, consultada 2026-11-10, CC BY-SA 4.0
- `wp:Lumbar_trunk`: [Lumbar lymph trunk](https://en.wikipedia.org/w/index.php?title=Lumbar_lymph_trunk&oldid=1224154015) · revisión 1224154015, consultada 2026-11-12, CC BY-SA 4.0
- `wp:Mesentery`: [Mesentery](https://en.wikipedia.org/w/index.php?title=Mesentery&oldid=1384603638) · revisión 1384603638, consultada 2026-11-10, CC BY-SA 4.0
- `wp:Middle_colic_artery`: [Middle colic artery](https://en.wikipedia.org/w/index.php?title=Middle_colic_artery&oldid=1380884257) · revisión 1380884257, consultada 2026-11-10, CC BY-SA 4.0
- `wp:Pancreas`: [Pancreas](https://en.wikipedia.org/w/index.php?title=Pancreas&oldid=1380834414) · revisión 1380834414, consultada 2026-11-09, CC BY-SA 4.0
- `wp:Preaortic_lymph_nodes`: [Preaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Preaortic_lymph_nodes&oldid=1336732047) · revisión 1336732047, consultada 2026-11-12, CC BY-SA 4.0
- `wp:Retroaortic_lymph_nodes`: [Retroaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Retroaortic_lymph_nodes&oldid=1224153655) · revisión 1224153655, consultada 2026-11-12, CC BY-SA 4.0
- `wp:Retroperitoneal_lymph_node_dissection`: [Retroperitoneal lymph node dissection](https://en.wikipedia.org/w/index.php?title=Retroperitoneal_lymph_node_dissection&oldid=1372797086) · revisión 1372797086, consultada 2026-11-13, CC BY-SA 4.0
- `wp:Right_colic_artery`: [Right colic artery](https://en.wikipedia.org/w/index.php?title=Right_colic_artery&oldid=1380889233) · revisión 1380889233, consultada 2026-11-13, CC BY-SA 4.0
- `wp:Right_gastric_artery`: [Right gastric artery](https://en.wikipedia.org/w/index.php?title=Right_gastric_artery&oldid=1380886820) · revisión 1380886820, consultada 2026-11-13, CC BY-SA 4.0
- `wp:Right_gastroepiploic_artery`: [Right gastroepiploic artery](https://en.wikipedia.org/w/index.php?title=Right_gastroepiploic_artery&oldid=1380884236) · revisión 1380884236, consultada 2026-11-13, CC BY-SA 4.0
- `wp:Sigmoid_arteries`: [Sigmoid arteries](https://en.wikipedia.org/w/index.php?title=Sigmoid_arteries&oldid=1380884284) · revisión 1380884284, consultada 2026-11-10, CC BY-SA 4.0
- `wp:Spleen`: [Spleen](https://en.wikipedia.org/w/index.php?title=Spleen&oldid=1384138456) · revisión 1384138456, consultada 2026-11-09, CC BY-SA 4.0
- `wp:Splenic_artery`: [Splenic artery](https://en.wikipedia.org/w/index.php?title=Splenic_artery&oldid=1380884757) · revisión 1380884757, consultada 2026-11-13, CC BY-SA 4.0
- `wp:Splenic_lymph_nodes`: [Splenic lymph node](https://en.wikipedia.org/w/index.php?title=Splenic_lymph_node&oldid=1224153827) · revisión 1224153827, consultada 2026-11-12, CC BY-SA 4.0
- `wp:Stomach`: [Stomach](https://en.wikipedia.org/w/index.php?title=Stomach&oldid=1383647983) · revisión 1383647983, consultada 2026-11-13, CC BY-SA 4.0
- `wp:Superior_mesenteric_artery`: [Superior mesenteric artery](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_artery&oldid=1380880787) · revisión 1380880787, consultada 2026-11-13, CC BY-SA 4.0
- `wp:Superior_mesenteric_lymph_nodes`: [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643) · revisión 1223115643, consultada 2026-11-12, CC BY-SA 4.0
- `wp:Superior_pancreaticoduodenal_artery`: [Superior pancreaticoduodenal artery](https://en.wikipedia.org/w/index.php?title=Superior_pancreaticoduodenal_artery&oldid=1380892432) · revisión 1380892432, consultada 2026-11-13, CC BY-SA 4.0

## Fichas

### Nodos aórticos laterales (`Lateral_aortic_nodes`)

Nombre: TA2 n.º 5271 (*Nodi aortici latérales*; Lateral aortic nodes).

- **Descripción.** Forman parte de los nodos (ganglios) lumbares o periaórticos, que están delante de las vértebras lumbares, cerca de la aorta.
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “are a group of lymph nodes that lie in front of the lumbar vertebrae near the aorta”
- **Descripción.** La fuente llama paraaórticos al grupo aórtico lateral.
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “The paraaortic group is synonymous with the lateral aortic group.”
- **Descripción.** La Terminologia Anatomica 2 divide los nodos lumbares en izquierdos (aórticos laterales, preaórticos y retroaórticos), intermedios y derechos (cavales laterales, precavales y retrocavales).
  - TA2 n.º 5270: Left lumbar nodes (*Nodi lumbales sinistri*)
  - TA2 n.º 5271: Lateral aortic nodes (*Nodi aortici latérales*)
  - TA2 n.º 5272: Pre-aortic nodes (*Nodi preaortici*)
  - TA2 n.º 5273: Retro-aortic nodes (*Nodi retroaortici*)
  - TA2 n.º 5274: Intermediate lumbar nodes (*Nodi lumbales intermedii*)
  - TA2 n.º 5275: Right lumbar nodes (*Nodi lumbales dextri*)
  - TA2 n.º 5276: Lateral caval nodes (*Nodi cavales latérales*)
  - TA2 n.º 5277: Precaval nodes (*Nodi precavales*)
  - TA2 n.º 5278: Retrocaval nodes (*Nodi retrocavales*)
- **Localización.** Los paraaórticos están junto a la aorta, delante de la columna, y llegan lateralmente hasta el borde del psoas mayor y, hacia arriba, hasta los pilares del diafragma.
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “The lateral group nodes are located adjacent to the aorta, anterior to the spine, extending laterally to the edge of the psoas major muscles, and superiorly to the crura of the diaphragm.”
- **Localización.** Los del lado izquierdo forman una cadena a la izquierda de la aorta abdominal, delante del origen del psoas mayor y sobre el pilar izquierdo del diafragma.
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “The left paraaortic nodes form a chain on the left side of the abdominal aorta in front of the origin of the psoas major and on the left crus of the diaphragm.”
- **Reparo.** La aorta abdominal, que baja por la pared posterior del abdomen delante de la columna, algo a la izquierda de la línea media, desde T12 hasta su bifurcación en L4.
  - [Abdominal aorta](https://en.wikipedia.org/w/index.php?title=Abdominal_aorta&oldid=1297251855): “It travels down the posterior wall of the abdomen, anterior to the vertebral column.”
  - [Abdominal aorta](https://en.wikipedia.org/w/index.php?title=Abdominal_aorta&oldid=1297251855): “The abdominal aorta lies slightly to the left of the midline of the body.”
  - [Abdominal aorta](https://en.wikipedia.org/w/index.php?title=Abdominal_aorta&oldid=1297251855): “It begins at T12 and ends at L4 with its bifurcation into the common iliac arteries”
- **Recibe.** El grupo aórtico lateral drena los nodos ilíacos, los ovarios, los testículos y otros órganos de la pelvis.
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “The paraaortic group (also known as lateral aortic group) drains the iliac nodes, the ovaries, the testes and other pelvic organs.”
- **Recibe.** Los paraaórticos y los retroaórticos reciben los eferentes de los nodos ilíacos comunes, la linfa del testículo (o del ovario, la trompa uterina y el útero), la del riñón y la glándula suprarrenal y la de los músculos laterales del abdomen, cuyos linfáticos acompañan a las venas lumbares.
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “The paraaortic and retroaortic nodes receive:”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “(a) the efferents of the common iliac lymph nodes”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “(b) the lymphatics from the testis in the male, and from the ovary, uterine tube, and uterus in the female”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “(c) the lymphatics from the kidney and suprarenal gland”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “(d) the lymphatics draining the lateral abdominal muscles and accompanying the lumbar veins”
- **Drena en.** La mayoría de los eferentes de los paraaórticos se unen en los troncos lumbares derecho e izquierdo, que van a la cisterna del quilo; algunos van a los preaórticos y los retroaórticos, y otros atraviesan los pilares del diafragma para unirse al extremo inferior del conducto torácico.
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “Most of the efferent vessels from the paraaortic nodes converge to form the right and left lumbar trunks which join the cisterna chyli”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “but some enter the preaortic and retroaortic lymph nodes, and others pierce the crura of the diaphragm to join the lower end of the thoracic duct”
- **Drena en.** Los troncos lumbares se forman por la unión de los eferentes de los nodos aórticos laterales.
  - [Lumbar lymph trunk](https://en.wikipedia.org/w/index.php?title=Lumbar_lymph_trunk&oldid=1224154015): “The lumbar trunks are formed by the union of the efferent vessels from the lateral aortic lymph nodes.”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** La TA2 pone los aórticos laterales entre los nodos lumbares izquierdos; en este modelo son una sola pieza a la izquierda de la aorta, de la que nace el tronco lumbar izquierdo, y los paraaórticos del lado derecho se representan como nodos cavales.
  - TA2 n.º 5270: Left lumbar nodes (*Nodi lumbales sinistri*)
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **Nota.** Los aórticos laterales, de 15 a 20 por lado según la fuente, son los que se suelen elegir para la disección o la biopsia en el diagnóstico o el tratamiento del cáncer.
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “The lateral aortic lymph nodes, typically 15 to 20 on each side, are the ones usually chosen for dissection or biopsy in the treatment or diagnosis of cancer.”
- **Nota.** El cáncer de testículo se extiende de forma previsible y los nodos del retroperitoneo suelen ser el primer lugar al que llega.
  - [Retroperitoneal lymph node dissection](https://en.wikipedia.org/w/index.php?title=Retroperitoneal_lymph_node_dissection&oldid=1372797086): “Testicular cancer metastasizes in a predictable pattern, and lymph nodes in the retroperitoneum are typically the first place it lands.”
- Vías en la app: recibe `Lateral_common_iliac_nodes`, `Intermediate_common_iliac_nodes`, `Medial_common_iliac_nodes`; drena en `Lumbar_trunk`, `Pre_aortic_nodes`, `Retro_aortic_nodes`, `Thoracic_duct`.

### Nodi prae-aortici (`Pre_aortic_nodes`)

Nombre: TA2 n.º 5272 (*Nodi preaortici*; Pre-aortic nodes).

- **Descripción.** Nodos (ganglios) situados delante de la aorta.
  - [Preaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Preaortic_lymph_nodes&oldid=1336732047): “The preaortic lymph nodes lie in front of the aorta”
- **Descripción.** La fuente reparte los preaórticos en tres grupos (celíacos, mesentéricos superiores y mesentéricos inferiores), dispuestos alrededor del origen de sus arterias.
  - [Preaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Preaortic_lymph_nodes&oldid=1336732047): “may be divided into celiac lymph nodes, superior mesenteric lymph nodes, and inferior mesenteric lymph nodes groups, arranged around the origins of the corresponding arteries”
- **Descripción.** La Terminologia Anatomica 2, en cambio, pone los preaórticos entre los nodos lumbares izquierdos, que son parietales, y clasifica los celíacos y los mesentéricos como viscerales.
  - TA2 n.º 5269: Parietal abdominal lymph nodes (*Nodi lymphoideiparietaies abdominis*)
  - TA2 n.º 5270: Left lumbar nodes (*Nodi lumbales sinistri*)
  - TA2 n.º 5272: Pre-aortic nodes (*Nodi preaortici*)
  - TA2 n.º 5281: Visceral abdominal lymph nodes (*Nodi lymphoidei visceraies abdominis*)
  - TA2 n.º 5282: Coeliac nodes (*Nodi coeliaci*)
  - TA2 n.º 5302: Superior mesenteric nodes (*Nodi mesenterici superiores*)
  - TA2 n.º 5312: Inferior mesenteric nodes (*Nodi mesenterici inferiores*)
- **Localización.** Están delante de la aorta abdominal, que baja por la pared posterior del abdomen delante de la columna.
  - [Preaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Preaortic_lymph_nodes&oldid=1336732047): “The preaortic lymph nodes lie in front of the aorta”
  - [Abdominal aorta](https://en.wikipedia.org/w/index.php?title=Abdominal_aorta&oldid=1297251855): “It travels down the posterior wall of the abdomen, anterior to the vertebral column.”
- **Reparo.** La cara anterior de la aorta abdominal, de la que salen, de arriba abajo, el tronco celíaco (a la altura de T12–L1), la arteria mesentérica superior (justo por debajo, delante del borde inferior de L1) y la mesentérica inferior (en L3).
  - [Celiac artery](https://en.wikipedia.org/w/index.php?title=Celiac_artery&oldid=1360626712): “In typical anatomy, this is at the T12-L1 vertebral level.”
  - [Superior mesenteric artery](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_artery&oldid=1380880787): “arises from the anterior surface of the abdominal aorta, just inferior to the origin of the celiac trunk”
  - [Superior mesenteric artery](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_artery&oldid=1380880787): “In the adult, the SMA arises anterior to inferior border of vertebra L1 (transpyloric plane).”
  - [Inferior mesenteric artery](https://en.wikipedia.org/w/index.php?title=Inferior_mesenteric_artery&oldid=1380880057): “is the third main branch of the abdominal aorta and arises at the level of L3”
- **Recibe.** Reciben unos pocos vasos de los nodos aórticos laterales, pero sus aferentes principales vienen de los órganos que irrigan el tronco celíaco y las arterias mesentéricas superior e inferior.
  - [Preaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Preaortic_lymph_nodes&oldid=1336732047): “The preaortic lymph nodes receive a few vessels from the lateral aortic lymph nodes”
  - [Preaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Preaortic_lymph_nodes&oldid=1336732047): “their principal afferents are derived from the organs supplied by the three arteries with which they are associated”
- **Recibe.** Los nodos que rodean la arteria mesentérica inferior drenan directamente en los preaórticos.
  - [Inferior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Inferior_mesenteric_lymph_nodes&oldid=1300990457): “Lymph nodes surrounding the inferior mesenteric artery drain directly into the preaortic nodes.”
- **Drena en.** La mayoría de los eferentes de los preaórticos se unen en el tronco intestinal, que desemboca en la cisterna del quilo; algunos van a los retroaórticos.
  - [Preaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Preaortic_lymph_nodes&oldid=1336732047): “Some of their efferents pass to the retroaortic lymph nodes, but the majority unite to form the intestinal lymph trunk, which enters the cisterna chyli.”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo, como en la TA2, los preaórticos son una pieza aparte de los celíacos y los mesentéricos; lo que la fuente dice de sus aferentes y eferentes se refiere al conjunto que ella llama preaórtico.
  - TA2 n.º 5272: Pre-aortic nodes (*Nodi preaortici*)
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo el colector esquemático lleva su linfa a los nodos aórticos laterales y de ahí al tronco lumbar izquierdo, no al tronco intestinal que describe la fuente.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe `Lateral_aortic_nodes`, `Left_colic_nodes`, `Sigmoid_nodes`; drena en `Intestinal_trunks`, `Retro_aortic_nodes`.

### Nodi postaortici (`Retro_aortic_nodes`)

Nombre: TA2 n.º 5273 (*Nodi retroaortici*; Retro-aortic nodes).

- **Descripción.** Nodos (ganglios) lumbares que también se llaman postaórticos.
  - [Retroaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Retroaortic_lymph_nodes&oldid=1224153655): “The retroaortic lymph nodes (or postaortic lymph nodes)”
- **Descripción.** La Terminologia Anatomica 2 divide los nodos lumbares en izquierdos (aórticos laterales, preaórticos y retroaórticos), intermedios y derechos (cavales laterales, precavales y retrocavales).
  - TA2 n.º 5270: Left lumbar nodes (*Nodi lumbales sinistri*)
  - TA2 n.º 5271: Lateral aortic nodes (*Nodi aortici latérales*)
  - TA2 n.º 5272: Pre-aortic nodes (*Nodi preaortici*)
  - TA2 n.º 5273: Retro-aortic nodes (*Nodi retroaortici*)
  - TA2 n.º 5274: Intermediate lumbar nodes (*Nodi lumbales intermedii*)
  - TA2 n.º 5275: Right lumbar nodes (*Nodi lumbales dextri*)
  - TA2 n.º 5276: Lateral caval nodes (*Nodi cavales latérales*)
  - TA2 n.º 5277: Precaval nodes (*Nodi precavales*)
  - TA2 n.º 5278: Retrocaval nodes (*Nodi retrocavales*)
- **Localización.** Están por debajo de la cisterna del quilo, sobre los cuerpos de la tercera y la cuarta vértebras lumbares.
  - [Retroaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Retroaortic_lymph_nodes&oldid=1224153655): “are placed below the cisterna chyli, on the bodies of the third and fourth lumbar vertebrae”
- **Localización.** A veces se incluyen en el grupo paraaórtico por su posición, también lateral, y porque drenan igual.
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “The retroaortic group are sometimes included in the paraaortic group due to their position (which is also lateral) and the same pattern of lymphatic drainage.”
- **Reparo.** Los cuerpos de las vértebras L3 y L4, sobre los que están, por debajo de la cisterna del quilo.
  - [Retroaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Retroaortic_lymph_nodes&oldid=1224153655): “are placed below the cisterna chyli, on the bodies of the third and fourth lumbar vertebrae”
- **Recibe.** Reciben troncos linfáticos de los nodos aórticos laterales y de los preaórticos.
  - [Retroaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Retroaortic_lymph_nodes&oldid=1224153655): “They receive lymphatic trunks from the lateral and preaortic glands”
- **Recibe.** Los paraaórticos y los retroaórticos reciben los eferentes de los nodos ilíacos comunes, la linfa del testículo (o del ovario, la trompa uterina y el útero), la del riñón y la glándula suprarrenal y la de los músculos laterales del abdomen, cuyos linfáticos acompañan a las venas lumbares.
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “The paraaortic and retroaortic nodes receive:”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “(a) the efferents of the common iliac lymph nodes”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “(b) the lymphatics from the testis in the male, and from the ovary, uterine tube, and uterus in the female”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “(c) the lymphatics from the kidney and suprarenal gland”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “(d) the lymphatics draining the lateral abdominal muscles and accompanying the lumbar veins”
- **Drena en.** Sus eferentes terminan en la cisterna del quilo.
  - [Retroaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Retroaortic_lymph_nodes&oldid=1224153655): “while their efferents end in the cisterna chyli”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo el colector esquemático une los retroaórticos con los aórticos laterales, y no directamente con la cisterna del quilo como dice la fuente.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe `Lateral_aortic_nodes`, `Pre_aortic_nodes`; drena en `Cisterna_chyli`.

### Nodos lumbares intermedios (`Intermediate_lumbar_nodes`)

Nombre: TA2 n.º 5274 (*Nodi lumbales intermedii*; Intermediate lumbar nodes).

- **Descripción.** Nodos (ganglios) lumbares que la Terminologia Anatomica 2 llama lumbares intermedios y que pone, en su lista, entre los lumbares izquierdos y los derechos.
  - TA2 n.º 5270: Left lumbar nodes (*Nodi lumbales sinistri*)
  - TA2 n.º 5274: Intermediate lumbar nodes (*Nodi lumbales intermedii*)
  - TA2 n.º 5275: Right lumbar nodes (*Nodi lumbales dextri*)
- **Descripción.** La Terminologia Anatomica 2 los clasifica entre los nodos parietales del abdomen.
  - TA2 n.º 5269: Parietal abdominal lymph nodes (*Nodi lymphoideiparietaies abdominis*)
  - TA2 n.º 5274: Intermediate lumbar nodes (*Nodi lumbales intermedii*)
- **Localización.** Como el resto de los nodos lumbares, están delante de las vértebras lumbares, cerca de la aorta.
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “are a group of lymph nodes that lie in front of the lumbar vertebrae near the aorta”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo el vaso más próximo a sus cinco nodos es la aorta abdominal.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo un colector esquemático los une con los aórticos laterales y con los cavales laterales; no hay fuente citada para ese trayecto.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **Reparo: pendiente.** Ninguna fuente libre consultada (Wikipedia en inglés) describe este grupo por separado.
- **Recibe: pendiente.** Ninguna fuente libre consultada (Wikipedia en inglés) describe este grupo por separado.
- **Drena en: pendiente.** Ninguna fuente libre consultada (Wikipedia en inglés) describe este grupo por separado. La tabla del encargo supone que drena en los dos troncos lumbares, pero no se afirma sin fuente.

### Nodos cavales laterales (`Lateral_caval_nodes`)

Nombre: TA2 n.º 5276 (*Nodi cavales latérales*; Lateral caval nodes).

- **Descripción.** Forman parte de los nodos (ganglios) lumbares o periaórticos, que están delante de las vértebras lumbares, cerca de la aorta.
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “are a group of lymph nodes that lie in front of the lumbar vertebrae near the aorta”
- **Descripción.** La Terminologia Anatomica 2 divide los nodos lumbares en izquierdos (aórticos laterales, preaórticos y retroaórticos), intermedios y derechos (cavales laterales, precavales y retrocavales).
  - TA2 n.º 5270: Left lumbar nodes (*Nodi lumbales sinistri*)
  - TA2 n.º 5271: Lateral aortic nodes (*Nodi aortici latérales*)
  - TA2 n.º 5272: Pre-aortic nodes (*Nodi preaortici*)
  - TA2 n.º 5273: Retro-aortic nodes (*Nodi retroaortici*)
  - TA2 n.º 5274: Intermediate lumbar nodes (*Nodi lumbales intermedii*)
  - TA2 n.º 5275: Right lumbar nodes (*Nodi lumbales dextri*)
  - TA2 n.º 5276: Lateral caval nodes (*Nodi cavales latérales*)
  - TA2 n.º 5277: Precaval nodes (*Nodi precavales*)
  - TA2 n.º 5278: Retrocaval nodes (*Nodi retrocavales*)
- **Localización.** Los paraaórticos derechos están en parte delante de la vena cava inferior, cerca de la desembocadura de la vena renal, y en parte detrás de ella, sobre el origen del psoas mayor y sobre el pilar derecho del diafragma.
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “The right paraaortic nodes, are situated partly in front of the inferior vena cava near the termination of the renal vein, and partly behind it on the origin of the psoas major, and on the right crus of diaphragm.”
- **Reparo.** La vena cava inferior, que sube por detrás de la cavidad abdominal a la derecha de la columna y de la aorta; se forma a la altura de L5 por la unión de las dos venas ilíacas comunes.
  - [Inferior vena cava](https://en.wikipedia.org/w/index.php?title=Inferior_vena_cava&oldid=1380879153): “It is a large retroperitoneal vein that lies posterior to the abdominal cavity and runs along the right side of the vertebral column.”
  - [Inferior vena cava](https://en.wikipedia.org/w/index.php?title=Inferior_vena_cava&oldid=1380879153): “It passes to the right of the descending aorta.”
  - [Inferior vena cava](https://en.wikipedia.org/w/index.php?title=Inferior_vena_cava&oldid=1380879153): “It is formed by the joining of the right and the left common iliac veins, usually at the level of the fifth lumbar vertebra.”
- **Recibe.** Los paraaórticos y los retroaórticos reciben los eferentes de los nodos ilíacos comunes, la linfa del testículo (o del ovario, la trompa uterina y el útero), la del riñón y la glándula suprarrenal y la de los músculos laterales del abdomen, cuyos linfáticos acompañan a las venas lumbares.
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “The paraaortic and retroaortic nodes receive:”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “(a) the efferents of the common iliac lymph nodes”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “(b) the lymphatics from the testis in the male, and from the ovary, uterine tube, and uterus in the female”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “(c) the lymphatics from the kidney and suprarenal gland”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “(d) the lymphatics draining the lateral abdominal muscles and accompanying the lumbar veins”
- **Drena en.** La mayoría de los eferentes de los paraaórticos se unen en los troncos lumbares derecho e izquierdo, que van a la cisterna del quilo; algunos van a los preaórticos y los retroaórticos, y otros atraviesan los pilares del diafragma para unirse al extremo inferior del conducto torácico.
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “Most of the efferent vessels from the paraaortic nodes converge to form the right and left lumbar trunks which join the cisterna chyli”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “but some enter the preaortic and retroaortic lymph nodes, and others pierce the crura of the diaphragm to join the lower end of the thoracic duct”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** La fuente describe juntos los paraaórticos derechos, sin dividirlos; esta ficha les aplica lo que la fuente dice de ellos y la división de la TA2 en cavales laterales, precavales y retrocavales.
  - TA2 n.º 5275: Right lumbar nodes (*Nodi lumbales dextri*)
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo los eferentes del lado derecho llegan a la cisterna del quilo por el tronco lumbar derecho, que nace de los nodos cavales laterales.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **Nota.** El cáncer de testículo se extiende de forma previsible y los nodos del retroperitoneo suelen ser el primer lugar al que llega.
  - [Retroperitoneal lymph node dissection](https://en.wikipedia.org/w/index.php?title=Retroperitoneal_lymph_node_dissection&oldid=1372797086): “Testicular cancer metastasizes in a predictable pattern, and lymph nodes in the retroperitoneum are typically the first place it lands.”
- Vías en la app: recibe `Lateral_common_iliac_nodes`, `Intermediate_common_iliac_nodes`, `Medial_common_iliac_nodes`; drena en `Lumbar_trunk`, `Pre_aortic_nodes`, `Retro_aortic_nodes`, `Thoracic_duct`.

### Nodos praecavales (`Precaval_nodes`)

Nombre: TA2 n.º 5277 (*Nodi precavales*; Precaval nodes).

- **Descripción.** Forman parte de los nodos (ganglios) lumbares o periaórticos, que están delante de las vértebras lumbares, cerca de la aorta.
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “are a group of lymph nodes that lie in front of the lumbar vertebrae near the aorta”
- **Descripción.** La Terminologia Anatomica 2 divide los nodos lumbares en izquierdos (aórticos laterales, preaórticos y retroaórticos), intermedios y derechos (cavales laterales, precavales y retrocavales).
  - TA2 n.º 5270: Left lumbar nodes (*Nodi lumbales sinistri*)
  - TA2 n.º 5271: Lateral aortic nodes (*Nodi aortici latérales*)
  - TA2 n.º 5272: Pre-aortic nodes (*Nodi preaortici*)
  - TA2 n.º 5273: Retro-aortic nodes (*Nodi retroaortici*)
  - TA2 n.º 5274: Intermediate lumbar nodes (*Nodi lumbales intermedii*)
  - TA2 n.º 5275: Right lumbar nodes (*Nodi lumbales dextri*)
  - TA2 n.º 5276: Lateral caval nodes (*Nodi cavales latérales*)
  - TA2 n.º 5277: Precaval nodes (*Nodi precavales*)
  - TA2 n.º 5278: Retrocaval nodes (*Nodi retrocavales*)
- **Localización.** Corresponden a la parte de los paraaórticos derechos que está delante de la vena cava inferior, cerca de la desembocadura de la vena renal.
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “The right paraaortic nodes, are situated partly in front of the inferior vena cava near the termination of the renal vein”
- **Reparo.** La vena cava inferior, que sube por detrás de la cavidad abdominal a la derecha de la columna y de la aorta; se forma a la altura de L5 por la unión de las dos venas ilíacas comunes.
  - [Inferior vena cava](https://en.wikipedia.org/w/index.php?title=Inferior_vena_cava&oldid=1380879153): “It is a large retroperitoneal vein that lies posterior to the abdominal cavity and runs along the right side of the vertebral column.”
  - [Inferior vena cava](https://en.wikipedia.org/w/index.php?title=Inferior_vena_cava&oldid=1380879153): “It passes to the right of the descending aorta.”
  - [Inferior vena cava](https://en.wikipedia.org/w/index.php?title=Inferior_vena_cava&oldid=1380879153): “It is formed by the joining of the right and the left common iliac veins, usually at the level of the fifth lumbar vertebra.”
- **Recibe.** Los paraaórticos y los retroaórticos reciben los eferentes de los nodos ilíacos comunes, la linfa del testículo (o del ovario, la trompa uterina y el útero), la del riñón y la glándula suprarrenal y la de los músculos laterales del abdomen, cuyos linfáticos acompañan a las venas lumbares.
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “The paraaortic and retroaortic nodes receive:”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “(a) the efferents of the common iliac lymph nodes”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “(b) the lymphatics from the testis in the male, and from the ovary, uterine tube, and uterus in the female”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “(c) the lymphatics from the kidney and suprarenal gland”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “(d) the lymphatics draining the lateral abdominal muscles and accompanying the lumbar veins”
- **Drena en.** La mayoría de los eferentes de los paraaórticos se unen en los troncos lumbares derecho e izquierdo, que van a la cisterna del quilo; algunos van a los preaórticos y los retroaórticos, y otros atraviesan los pilares del diafragma para unirse al extremo inferior del conducto torácico.
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “Most of the efferent vessels from the paraaortic nodes converge to form the right and left lumbar trunks which join the cisterna chyli”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “but some enter the preaortic and retroaortic lymph nodes, and others pierce the crura of the diaphragm to join the lower end of the thoracic duct”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** La fuente describe juntos los paraaórticos derechos, sin dividirlos; esta ficha les aplica lo que la fuente dice de ellos y la división de la TA2 en cavales laterales, precavales y retrocavales.
  - TA2 n.º 5275: Right lumbar nodes (*Nodi lumbales dextri*)
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo los eferentes del lado derecho llegan a la cisterna del quilo por el tronco lumbar derecho, que nace de los nodos cavales laterales.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe `Lateral_common_iliac_nodes`, `Intermediate_common_iliac_nodes`, `Medial_common_iliac_nodes`; drena en `Lumbar_trunk`, `Pre_aortic_nodes`, `Retro_aortic_nodes`, `Thoracic_duct`.

### Nodos postcavales (`Retrocaval_nodes`)

Nombre: TA2 n.º 5278 (*Nodi retrocavales*; Retrocaval nodes).

- **Descripción.** Forman parte de los nodos (ganglios) lumbares o periaórticos, que están delante de las vértebras lumbares, cerca de la aorta.
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “are a group of lymph nodes that lie in front of the lumbar vertebrae near the aorta”
- **Descripción.** La Terminologia Anatomica 2 divide los nodos lumbares en izquierdos (aórticos laterales, preaórticos y retroaórticos), intermedios y derechos (cavales laterales, precavales y retrocavales).
  - TA2 n.º 5270: Left lumbar nodes (*Nodi lumbales sinistri*)
  - TA2 n.º 5271: Lateral aortic nodes (*Nodi aortici latérales*)
  - TA2 n.º 5272: Pre-aortic nodes (*Nodi preaortici*)
  - TA2 n.º 5273: Retro-aortic nodes (*Nodi retroaortici*)
  - TA2 n.º 5274: Intermediate lumbar nodes (*Nodi lumbales intermedii*)
  - TA2 n.º 5275: Right lumbar nodes (*Nodi lumbales dextri*)
  - TA2 n.º 5276: Lateral caval nodes (*Nodi cavales latérales*)
  - TA2 n.º 5277: Precaval nodes (*Nodi precavales*)
  - TA2 n.º 5278: Retrocaval nodes (*Nodi retrocavales*)
- **Localización.** Corresponden a la parte de los paraaórticos derechos que está detrás de la vena cava inferior, sobre el origen del psoas mayor y sobre el pilar derecho del diafragma.
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “and partly behind it on the origin of the psoas major, and on the right crus of diaphragm”
- **Reparo.** La vena cava inferior, que sube por detrás de la cavidad abdominal a la derecha de la columna y de la aorta; se forma a la altura de L5 por la unión de las dos venas ilíacas comunes.
  - [Inferior vena cava](https://en.wikipedia.org/w/index.php?title=Inferior_vena_cava&oldid=1380879153): “It is a large retroperitoneal vein that lies posterior to the abdominal cavity and runs along the right side of the vertebral column.”
  - [Inferior vena cava](https://en.wikipedia.org/w/index.php?title=Inferior_vena_cava&oldid=1380879153): “It passes to the right of the descending aorta.”
  - [Inferior vena cava](https://en.wikipedia.org/w/index.php?title=Inferior_vena_cava&oldid=1380879153): “It is formed by the joining of the right and the left common iliac veins, usually at the level of the fifth lumbar vertebra.”
- **Recibe.** Los paraaórticos y los retroaórticos reciben los eferentes de los nodos ilíacos comunes, la linfa del testículo (o del ovario, la trompa uterina y el útero), la del riñón y la glándula suprarrenal y la de los músculos laterales del abdomen, cuyos linfáticos acompañan a las venas lumbares.
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “The paraaortic and retroaortic nodes receive:”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “(a) the efferents of the common iliac lymph nodes”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “(b) the lymphatics from the testis in the male, and from the ovary, uterine tube, and uterus in the female”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “(c) the lymphatics from the kidney and suprarenal gland”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “(d) the lymphatics draining the lateral abdominal muscles and accompanying the lumbar veins”
- **Drena en.** La mayoría de los eferentes de los paraaórticos se unen en los troncos lumbares derecho e izquierdo, que van a la cisterna del quilo; algunos van a los preaórticos y los retroaórticos, y otros atraviesan los pilares del diafragma para unirse al extremo inferior del conducto torácico.
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “Most of the efferent vessels from the paraaortic nodes converge to form the right and left lumbar trunks which join the cisterna chyli”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “but some enter the preaortic and retroaortic lymph nodes, and others pierce the crura of the diaphragm to join the lower end of the thoracic duct”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** La fuente describe juntos los paraaórticos derechos, sin dividirlos; esta ficha les aplica lo que la fuente dice de ellos y la división de la TA2 en cavales laterales, precavales y retrocavales.
  - TA2 n.º 5275: Right lumbar nodes (*Nodi lumbales dextri*)
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo los eferentes del lado derecho llegan a la cisterna del quilo por el tronco lumbar derecho, que nace de los nodos cavales laterales.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe `Lateral_common_iliac_nodes`, `Intermediate_common_iliac_nodes`, `Medial_common_iliac_nodes`; drena en `Lumbar_trunk`, `Pre_aortic_nodes`, `Retro_aortic_nodes`, `Thoracic_duct`.

### Nodos diafragmáticos inferiores (`Inferior_diaphragmatic_nodes`)

Nombre: TA2 n.º 5279 (*Nodi phrenici inferiores*; Inferior diaphragmatic nodes).

- **Descripción.** Nodos (ganglios) que la Terminologia Anatomica 2 llama nodos frénicos (diafragmáticos) inferiores.
  - TA2 n.º 5279: Inferior diaphragmatic nodes (*Nodi phrenici inferiores*)
- **Descripción.** La Terminologia Anatomica 2 los clasifica entre los nodos parietales del abdomen.
  - TA2 n.º 5269: Parietal abdominal lymph nodes (*Nodi lymphoideiparietaies abdominis*)
  - TA2 n.º 5279: Inferior diaphragmatic nodes (*Nodi phrenici inferiores*)
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo los nodos están arriba, cerca del diafragma; los vasos más próximos son la vena cava inferior, la aorta y las venas hepáticas.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo un colector esquemático los une con los nodos lumbares de su lado; no hay fuente citada para ese trayecto.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **Localización: pendiente.** Ninguna fuente libre consultada (Wikipedia en inglés) describe este grupo por separado.
- **Reparo: pendiente.** Ninguna fuente libre consultada (Wikipedia en inglés) describe este grupo por separado.
- **Recibe: pendiente.** Ninguna fuente libre consultada (Wikipedia en inglés) describe este grupo por separado.
- **Drena en: pendiente.** Ninguna fuente libre consultada (Wikipedia en inglés) describe este grupo por separado. La tabla del encargo supone que drena en los nodos lumbares, pero no se afirma sin fuente.

### Nodos epigástricos inferiores (`Inferior_epigastric_nodes`)

Nombre: TA2 n.º 5280 (*Nodi epigastrici inferiores*; Inferior epigastric nodes).

- **Descripción.** Nodos (ganglios) de la pared del abdomen que la Terminologia Anatomica 2 llama nodos epigástricos inferiores.
  - TA2 n.º 5280: Inferior epigastric nodes (*Nodi epigastrici inferiores*)
- **Descripción.** La Terminologia Anatomica 2 los clasifica entre los nodos parietales del abdomen.
  - TA2 n.º 5269: Parietal abdominal lymph nodes (*Nodi lymphoideiparietaies abdominis*)
  - TA2 n.º 5280: Inferior epigastric nodes (*Nodi epigastrici inferiores*)
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo los nodos están en la posición que les da Z-Anatomy; esa posición no procede de una fuente citada.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo un colector esquemático los une con los nodos ilíacos externos mediales de su lado; no hay fuente citada para ese trayecto.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **Localización: pendiente.** Ninguna fuente libre consultada (Wikipedia en inglés) describe este grupo por separado.
- **Reparo: pendiente.** Ninguna fuente libre consultada (Wikipedia en inglés) describe este grupo por separado. Su nombre los relaciona con los vasos epigástricos inferiores, pero ninguna fuente consultada describe esa relación.
- **Recibe: pendiente.** Ninguna fuente libre consultada (Wikipedia en inglés) describe este grupo por separado.
- **Drena en: pendiente.** Ninguna fuente libre consultada (Wikipedia en inglés) describe este grupo por separado. La tabla del encargo supone que drena en los nodos ilíacos externos, pero no se afirma sin fuente.

### Nodos celiacos (`Coeliac_nodes`)

Nombre: TA2 n.º 5282 (*Nodi coeliaci*; Coeliac nodes).

- **Descripción.** Nodos (ganglios) asociados a las ramas del tronco celíaco.
  - [Celiac lymph nodes](https://en.wikipedia.org/w/index.php?title=Celiac_lymph_nodes&oldid=1300899971): “The celiac lymph nodes are associated with the branches of the celiac artery.”
- **Descripción.** La fuente los agrupa en tres conjuntos: gástricos, hepáticos y esplénicos.
  - [Celiac lymph nodes](https://en.wikipedia.org/w/index.php?title=Celiac_lymph_nodes&oldid=1300899971): “The celiac lymph nodes are grouped into three sets: the gastric, hepatic and splenic lymph nodes.”
- **Descripción.** Son uno de los tres grupos de nodos preaórticos de la fuente (celíacos, mesentéricos superiores y mesentéricos inferiores), dispuestos alrededor del origen de sus arterias.
  - [Preaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Preaortic_lymph_nodes&oldid=1336732047): “may be divided into celiac lymph nodes, superior mesenteric lymph nodes, and inferior mesenteric lymph nodes groups, arranged around the origins of the corresponding arteries”
- **Localización.** Están delante de la columna, en el origen del tronco celíaco desde la aorta.
  - [Stomach](https://en.wikipedia.org/w/index.php?title=Stomach&oldid=1383647983): “Lymph from these organs is drained to the prevertebral celiac nodes at the origin of the celiac artery from the aorta.”
- **Reparo.** El tronco celíaco, primera rama grande de la aorta abdominal, que sale de ella en ángulo recto a la altura del disco entre T12 y L1.
  - [Celiac artery](https://en.wikipedia.org/w/index.php?title=Celiac_artery&oldid=1360626712): “is the first major branch of the abdominal aorta”
  - [Celiac artery](https://en.wikipedia.org/w/index.php?title=Celiac_artery&oldid=1360626712): “branching at a 90° angle”
  - [Celiac artery](https://en.wikipedia.org/w/index.php?title=Celiac_artery&oldid=1360626712): “Branching from the aorta at the level of the T12-L1 intervertebral disc in typical anatomy”
- **Recibe.** Reciben la linfa del estómago, el duodeno, el páncreas, el bazo, el hígado y la vesícula biliar.
  - [Celiac lymph nodes](https://en.wikipedia.org/w/index.php?title=Celiac_lymph_nodes&oldid=1300899971): “They receive lymph from the stomach, duodenum, pancreas, spleen, liver, and gall bladder.”
- **Recibe.** Les llegan los eferentes de la cadena hepática y, a través de los nodos suprapancreáticos, infrapancreáticos y omentales, los de los nodos esplénicos.
  - [Hepatic lymph nodes](https://en.wikipedia.org/w/index.php?title=Hepatic_lymph_nodes&oldid=1224153783): “their efferents join the celiac group of preaortic lymph nodes”
  - [Splenic lymph node](https://en.wikipedia.org/w/index.php?title=Splenic_lymph_node&oldid=1224153827): “The splenic lymph nodes empty into the suprapancreatic, infrapancreatic and omental lymph nodes, which then drain to the coeliac nodes and cisterna chyli.”
- **Recibe.** Toda la linfa de la vesícula biliar acaba en ellos, y también la de los nodos del duodeno.
  - [Gallbladder](https://en.wikipedia.org/w/index.php?title=Gallbladder&oldid=1378026106): “All the lymph finally drains into celiac lymph nodes.”
  - [Duodenum](https://en.wikipedia.org/w/index.php?title=Duodenum&oldid=1385143543): “Efferent lymphatic vessels from the duodenal lymph nodes ultimately pass into the celiac lymph nodes.”
- **Drena en.** La mayoría de los eferentes de los preaórticos se unen en el tronco intestinal, que desemboca en la cisterna del quilo; algunos van a los retroaórticos.
  - [Preaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Preaortic_lymph_nodes&oldid=1336732047): “Some of their efferents pass to the retroaortic lymph nodes, but the majority unite to form the intestinal lymph trunk, which enters the cisterna chyli.”
- **Drena en.** El tronco intestinal recibe la linfa del estómago y los intestinos, del páncreas y el bazo y de la parte inferior y anterior del hígado, y la vierte en la cisterna del quilo.
  - [Intestinal lymph trunk](https://en.wikipedia.org/w/index.php?title=Intestinal_lymph_trunk&oldid=1290203291): “receives the lymph from the stomach and intestines, from the pancreas and spleen, and from the lower and front part of the liver, and empties lymph into the cisterna chyli”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En los dos modelos los centros de los nodos celíacos están a 11–17 mm del origen del tronco celíaco (medido al construir).
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo no hay pieza de nodos hepáticos (TA2 n.º 5299).
  - TA2 n.º 5299: Hepatic nodes (*Nodi hepatici*)
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo los troncos intestinales nacen de los celíacos y de los mesentéricos superiores centrales y van a la cisterna del quilo.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe `Suprapyloric_node`, `Subpyloric_nodes`, `Cystic_node`, `Superior_pancreatic_nodes`, `Inferior_pancreatic_nodes`; drena en `Intestinal_trunks`, `Retro_aortic_nodes`.

### Nodos gástricos derechos (`Right_gastric_nodes`)

Nombre: TA2 n.º 5283 (*Nodi gastrici dextri caudales*; Right gastric nodes).

- **Descripción.** Nodos (ganglios) del estómago que la Terminologia Anatomica 2 llama nodos gástricos derechos.
  - TA2 n.º 5283: Right gastric nodes (*Nodi gastrici dextri caudales*)
- **Descripción.** La Terminologia Anatomica 2 los clasifica entre los nodos viscerales del abdomen.
  - TA2 n.º 5281: Visceral abdominal lymph nodes (*Nodi lymphoidei visceraies abdominis*)
  - TA2 n.º 5283: Right gastric nodes (*Nodi gastrici dextri caudales*)
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo los nodos están en la posición que les da Z-Anatomy; esa posición no procede de una fuente citada.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** La fuente sobre los nodos gástricos describe un grupo superior junto a la arteria gástrica izquierda y uno inferior en la curvatura mayor; no describe un grupo gástrico derecho.
  - [Gastric lymph nodes](https://en.wikipedia.org/w/index.php?title=Gastric_lymph_nodes&oldid=1253404266): “The superior gastric lymph nodes (Latin: lymphoglandulæ gastricæ superiores) accompany the left gastric artery”
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo no hay pieza de nodos gástricos izquierdos (TA2 n.º 5284) ni gastroomentales izquierdos (n.º 5287).
  - TA2 n.º 5284: Left gastric nodes (*Nodi gastrici sinistri craniales*)
  - TA2 n.º 5287: Left gastro-omental nodes (*Nodi gastroomentales sinistri*)
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **Localización: pendiente.** Ninguna fuente libre consultada (Wikipedia en inglés) describe este grupo por separado.
- **Reparo: pendiente.** Ninguna fuente libre consultada (Wikipedia en inglés) describe este grupo por separado. Su nombre los relaciona con la arteria gástrica derecha, pero ninguna fuente consultada describe esa relación.
- **Recibe: pendiente.** Ninguna fuente libre consultada (Wikipedia en inglés) describe este grupo por separado.
- **Drena en: pendiente.** Ninguna fuente libre consultada (Wikipedia en inglés) describe este grupo por separado. La tabla del encargo supone que drena en los celíacos, pero no se afirma sin fuente.

### Nodos gastro-omentales derechos (`Right_gastro_omental_nodes`)

Nombre: TA2 n.º 5286 (*Nodi gastroomentales dextri*; Right gastro-omental nodes).

- **Descripción.** Son los nodos (ganglios) gástricos inferiores, también llamados gastroepiploicos derechos: de cuatro a siete.
  - [Gastric lymph nodes](https://en.wikipedia.org/w/index.php?title=Gastric_lymph_nodes&oldid=1253404266): “The inferior gastric lymph nodes (Latin: lymphoglandulæ gastricæ inferiores; right gastroepiploic lymph nodes), four to seven in number”
- **Descripción.** La fuente divide los nodos gástricos, que drenan el estómago, en dos grupos: superior e inferior.
  - [Gastric lymph nodes](https://en.wikipedia.org/w/index.php?title=Gastric_lymph_nodes&oldid=1253404266): “which drain the stomach and consist of two sets, superior and inferior”
- **Localización.** Están entre las dos hojas del omento mayor, a lo largo de la mitad pilórica de la curvatura mayor del estómago.
  - [Gastric lymph nodes](https://en.wikipedia.org/w/index.php?title=Gastric_lymph_nodes&oldid=1253404266): “lie between the two layers of the greater omentum along the pyloric half of the greater curvature of the stomach”
- **Reparo.** La arteria gastroomental (gastroepiploica) derecha, rama terminal de la gastroduodenal, que recorre de derecha a izquierda la curvatura mayor del estómago entre las hojas del omento mayor, a un través de dedo de ella salvo en el píloro.
  - [Right gastroepiploic artery](https://en.wikipedia.org/w/index.php?title=Right_gastroepiploic_artery&oldid=1380884236): “The right gastroepiploic artery (or right gastro-omental artery)  is one of the two terminal branches of the gastroduodenal artery.”
  - [Right gastroepiploic artery](https://en.wikipedia.org/w/index.php?title=Right_gastroepiploic_artery&oldid=1380884236): “It runs from right to left along the greater curvature of the stomach, between the layers of the greater omentum”
  - [Right gastroepiploic artery](https://en.wikipedia.org/w/index.php?title=Right_gastroepiploic_artery&oldid=1380884236): “Except at the pylorus where it is in contact with the stomach, it lies about a finger's breadth from the greater curvature.”
- **Recibe.** Drenan el estómago.
  - [Gastric lymph nodes](https://en.wikipedia.org/w/index.php?title=Gastric_lymph_nodes&oldid=1253404266): “The gastric lymph nodes are lymph nodes (also known as lymph glands) which drain the stomach”
- **Drena en.** La linfa de los dos grupos de nodos gástricos llega, por el tronco intestinal, a la cisterna del quilo.
  - [Stomach](https://en.wikipedia.org/w/index.php?title=Stomach&oldid=1383647983): “The two sets of gastric lymph nodes drain the stomach's tissue fluid into the lymphatic system through the intestinal lymph trunk, to the cisterna chyli.”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo un colector esquemático los lleva a los nodos subpilóricos y de ahí a los celíacos; la fuente no describe ese paso.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe —; drena en `Intestinal_trunks`.

### (Nodo suprapilórico) (`Suprapyloric_node`)

Nombre: TA2 n.º 5289 (*(Nodus suprapyloricus)*; (Suprapyloric node)).

- **Descripción.** Nodo (ganglio) que la Terminologia Anatomica 2 llama nodo suprapilórico, uno de los nodos pilóricos.
  - TA2 n.º 5288: Pyloric nodes (*Nodi pylorici*)
  - TA2 n.º 5289: (Suprapyloric node) (*(Nodus suprapyloricus)*)
- **Descripción.** En la Terminologia Anatomica 2 su nombre figura entre paréntesis.
  - TA2 n.º 5289: (Suprapyloric node) (*(Nodus suprapyloricus)*)
- **Localización.** A veces hay un nodo satélite de los subpilóricos por encima del duodeno, sobre la arteria gástrica derecha (pilórica).
  - [Hepatic lymph nodes](https://en.wikipedia.org/w/index.php?title=Hepatic_lymph_nodes&oldid=1224153783): “an outlying member of this group is sometimes found above the duodenum on the right gastric (pyloric) artery”
- **Localización.** Los nodos pilóricos están a lo largo de la arteria gastroduodenal.
  - [Duodenum](https://en.wikipedia.org/w/index.php?title=Duodenum&oldid=1385143543): “pyloric lymph nodes (along the gastroduodenal artery)”
- **Reparo.** La arteria gástrica derecha, que suele nacer de la arteria hepática propia y baja hasta el extremo pilórico del estómago antes de recorrer la curvatura menor de derecha a izquierda.
  - [Right gastric artery](https://en.wikipedia.org/w/index.php?title=Right_gastric_artery&oldid=1380886820): “The right gastric artery usually arises from the proper hepatic artery.”
  - [Right gastric artery](https://en.wikipedia.org/w/index.php?title=Right_gastric_artery&oldid=1380886820): “It descends to the pyloric end of the stomach before passing from right to left along its lesser curvature”
- **Recibe.** La fuente incluye los subpilóricos en la cadena hepática, cuyos nodos reciben aferentes del estómago, el duodeno, el hígado, la vesícula biliar y el páncreas.
  - [Hepatic lymph nodes](https://en.wikipedia.org/w/index.php?title=Hepatic_lymph_nodes&oldid=1224153783): “subpyloric, four or five in number”
  - [Hepatic lymph nodes](https://en.wikipedia.org/w/index.php?title=Hepatic_lymph_nodes&oldid=1224153783): “The lymph nodes of the hepatic chain receive afferents from the stomach, duodenum, liver, gall-bladder, and pancreas”
- **Recibe.** Los linfáticos anteriores del duodeno van a los nodos pancreaticoduodenales, a lo largo de las arterias pancreaticoduodenales superior e inferior, y de ahí a los nodos pilóricos.
  - [Duodenum](https://en.wikipedia.org/w/index.php?title=Duodenum&oldid=1385143543): “The anterior lymphatic vessels drain into the pancreatoduodenal lymph nodes located along the superior and inferior pancreatoduodenal arteries and then into the pyloric lymph nodes”
- **Drena en.** Los eferentes de la cadena hepática se unen al grupo celíaco de los nodos preaórticos.
  - [Hepatic lymph nodes](https://en.wikipedia.org/w/index.php?title=Hepatic_lymph_nodes&oldid=1224153783): “their efferents join the celiac group of preaortic lymph nodes”
- **En este modelo.** En este modelo el nodo se representa con una forma y un tamaño esquemáticos.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** Es una pieza que Z-Anatomy traía oculta (su nombre va entre paréntesis) y que Anato3D añade al modelo en la revisión del sistema linfático de noviembre de 2026.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** Esta ficha identifica el nodo suprapilórico de la TA2 con el nodo satélite que la fuente sitúa sobre la arteria gástrica derecha, por encima del duodeno; la fuente no usa el término de la TA2.
  - TA2 n.º 5289: (Suprapyloric node) (*(Nodus suprapyloricus)*)
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe —; drena en `Coeliac_nodes`.

### (Nodos subpilóricos) (`Subpyloric_nodes`)

Nombre: TA2 n.º 5290 (*(Nodi subpylorici)*; (Subpyloric nodes)).

- **Descripción.** Nodos (ganglios) pilóricos situados por debajo del píloro, de cuatro a cinco según la fuente.
  - TA2 n.º 5288: Pyloric nodes (*Nodi pylorici*)
  - TA2 n.º 5290: (Subpyloric nodes) (*(Nodi subpylorici)*)
  - [Hepatic lymph nodes](https://en.wikipedia.org/w/index.php?title=Hepatic_lymph_nodes&oldid=1224153783): “subpyloric, four or five in number”
- **Descripción.** En la Terminologia Anatomica 2 su nombre figura entre paréntesis.
  - TA2 n.º 5290: (Subpyloric nodes) (*(Nodi subpylorici)*)
- **Descripción.** La Terminologia Anatomica 2 reúne bajo los nodos pilóricos un nodo suprapilórico, los subpilóricos y los retropilóricos.
  - TA2 n.º 5288: Pyloric nodes (*Nodi pylorici*)
  - TA2 n.º 5289: (Suprapyloric node) (*(Nodus suprapyloricus)*)
  - TA2 n.º 5290: (Subpyloric nodes) (*(Nodi subpylorici)*)
  - TA2 n.º 5291: (Retropyloric nodes) (*(Nodi retropylorici)*)
- **Localización.** Están muy cerca de la bifurcación de la arteria gastroduodenal, en el ángulo entre las porciones superior y descendente del duodeno.
  - [Hepatic lymph nodes](https://en.wikipedia.org/w/index.php?title=Hepatic_lymph_nodes&oldid=1224153783): “in close relation to the bifurcation of the gastroduodenal artery, in the angle between the superior and descending parts of the duodenum”
- **Localización.** Los nodos pilóricos están a lo largo de la arteria gastroduodenal.
  - [Duodenum](https://en.wikipedia.org/w/index.php?title=Duodenum&oldid=1385143543): “pyloric lymph nodes (along the gastroduodenal artery)”
- **Reparo.** La bifurcación de la arteria gastroduodenal en la gastroomental derecha y la pancreaticoduodenal superior anterior.
  - [Gastroduodenal artery](https://en.wikipedia.org/w/index.php?title=Gastroduodenal_artery&oldid=1380886741): “It terminates in a bifurcation when it splits into the right gastroepiploic artery and the anterior superior pancreaticoduodenal artery”
- **Recibe.** La fuente incluye los subpilóricos en la cadena hepática, cuyos nodos reciben aferentes del estómago, el duodeno, el hígado, la vesícula biliar y el páncreas.
  - [Hepatic lymph nodes](https://en.wikipedia.org/w/index.php?title=Hepatic_lymph_nodes&oldid=1224153783): “subpyloric, four or five in number”
  - [Hepatic lymph nodes](https://en.wikipedia.org/w/index.php?title=Hepatic_lymph_nodes&oldid=1224153783): “The lymph nodes of the hepatic chain receive afferents from the stomach, duodenum, liver, gall-bladder, and pancreas”
- **Recibe.** Los linfáticos anteriores del duodeno van a los nodos pancreaticoduodenales, a lo largo de las arterias pancreaticoduodenales superior e inferior, y de ahí a los nodos pilóricos.
  - [Duodenum](https://en.wikipedia.org/w/index.php?title=Duodenum&oldid=1385143543): “The anterior lymphatic vessels drain into the pancreatoduodenal lymph nodes located along the superior and inferior pancreatoduodenal arteries and then into the pyloric lymph nodes”
- **Drena en.** Los eferentes de la cadena hepática se unen al grupo celíaco de los nodos preaórticos.
  - [Hepatic lymph nodes](https://en.wikipedia.org/w/index.php?title=Hepatic_lymph_nodes&oldid=1224153783): “their efferents join the celiac group of preaortic lymph nodes”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** Es una pieza que Z-Anatomy traía oculta (su nombre va entre paréntesis) y que Anato3D añade al modelo en la revisión del sistema linfático de noviembre de 2026.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** La fuente cuenta los subpilóricos en la cadena hepática; la TA2 los pone entre los nodos pilóricos.
  - [Hepatic lymph nodes](https://en.wikipedia.org/w/index.php?title=Hepatic_lymph_nodes&oldid=1224153783): “The hepatic lymph nodes consist of the following groups:”
  - TA2 n.º 5288: Pyloric nodes (*Nodi pylorici*)
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe `Superior_pancreaticoduodenal_nodes`; drena en `Coeliac_nodes`.

### (Nodos retropilóricos) (`Retropyloric_nodes`)

Nombre: TA2 n.º 5291 (*(Nodi retropylorici)*; (Retropyloric nodes)).

- **Descripción.** Nodos (ganglios) que la Terminologia Anatomica 2 llama retropilóricos, uno de los grupos de nodos pilóricos.
  - TA2 n.º 5288: Pyloric nodes (*Nodi pylorici*)
  - TA2 n.º 5291: (Retropyloric nodes) (*(Nodi retropylorici)*)
- **Descripción.** En la Terminologia Anatomica 2 su nombre figura entre paréntesis.
  - TA2 n.º 5291: (Retropyloric nodes) (*(Nodi retropylorici)*)
- **Descripción.** La Terminologia Anatomica 2 reúne bajo los nodos pilóricos un nodo suprapilórico, los subpilóricos y los retropilóricos.
  - TA2 n.º 5288: Pyloric nodes (*Nodi pylorici*)
  - TA2 n.º 5289: (Suprapyloric node) (*(Nodus suprapyloricus)*)
  - TA2 n.º 5290: (Subpyloric nodes) (*(Nodi subpylorici)*)
  - TA2 n.º 5291: (Retropyloric nodes) (*(Nodi retropylorici)*)
- **Localización.** Los nodos pilóricos están a lo largo de la arteria gastroduodenal.
  - [Duodenum](https://en.wikipedia.org/w/index.php?title=Duodenum&oldid=1385143543): “pyloric lymph nodes (along the gastroduodenal artery)”
- **Recibe.** Los linfáticos anteriores del duodeno van a los nodos pancreaticoduodenales, a lo largo de las arterias pancreaticoduodenales superior e inferior, y de ahí a los nodos pilóricos.
  - [Duodenum](https://en.wikipedia.org/w/index.php?title=Duodenum&oldid=1385143543): “The anterior lymphatic vessels drain into the pancreatoduodenal lymph nodes located along the superior and inferior pancreatoduodenal arteries and then into the pyloric lymph nodes”
- **En este modelo.** En este modelo el nodo se representa con una forma y un tamaño esquemáticos.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** Es una pieza que Z-Anatomy traía oculta (su nombre va entre paréntesis) y que Anato3D añade al modelo en la revisión del sistema linfático de noviembre de 2026.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** La fuente habla de los nodos pilóricos en conjunto; esta ficha les aplica lo que dice de ellos porque no describe los retropilóricos por separado.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **Reparo: pendiente.** Ninguna fuente libre consultada (Wikipedia en inglés) describe este grupo por separado.
- **Drena en: pendiente.** Ninguna fuente libre consultada (Wikipedia en inglés) describe este grupo por separado. La tabla del encargo supone que drena en los celíacos, pero no se afirma sin fuente.
- Vías en la app: recibe `Superior_pancreaticoduodenal_nodes`; drena en —.

### Nodos pancreáticos superiores (`Superior_pancreatic_nodes`)

Nombre: TA2 n.º 5293 (*Nodi pancreatici superiores*; Superior pancreatic nodes).

- **Descripción.** Nodos (ganglios) pancreáticos que la Terminologia Anatomica 2 llama superiores.
  - TA2 n.º 5292: Pancreatic nodes (*Nodi pancreatic*)
  - TA2 n.º 5293: Superior pancreatic nodes (*Nodi pancreatici superiores*)
- **Descripción.** La Terminologia Anatomica 2 los clasifica entre los nodos viscerales del abdomen.
  - TA2 n.º 5281: Visceral abdominal lymph nodes (*Nodi lymphoidei visceraies abdominis*)
  - TA2 n.º 5293: Superior pancreatic nodes (*Nodi pancreatici superiores*)
- **Recibe.** Los nodos esplénicos vierten su linfa en los nodos suprapancreáticos, infrapancreáticos y omentales.
  - [Splenic lymph node](https://en.wikipedia.org/w/index.php?title=Splenic_lymph_node&oldid=1224153827): “The splenic lymph nodes empty into the suprapancreatic, infrapancreatic and omental lymph nodes”
- **Drena en.** Los suprapancreáticos, los infrapancreáticos y los omentales drenan en los nodos celíacos y en la cisterna del quilo.
  - [Splenic lymph node](https://en.wikipedia.org/w/index.php?title=Splenic_lymph_node&oldid=1224153827): “which then drain to the coeliac nodes and cisterna chyli”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** Esta ficha identifica los nodos pancreáticos superiores de la TA2 con los suprapancreáticos que nombra la fuente; la fuente no los describe más.
  - TA2 n.º 5293: Superior pancreatic nodes (*Nodi pancreatici superiores*)
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En los dos modelos, dos de sus cuatro nodos tienen como vaso más próximo la arteria esplénica.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **Localización: pendiente.** Ninguna fuente libre consultada (Wikipedia en inglés) describe este grupo por separado.
- **Reparo: pendiente.** Ninguna fuente libre consultada (Wikipedia en inglés) describe este grupo por separado.
- Vías en la app: recibe `Splenic_nodes`; drena en `Coeliac_nodes`, `Cisterna_chyli`.

### Nodos pancreáticos inferiores (`Inferior_pancreatic_nodes`)

Nombre: TA2 n.º 5294 (*Nodi pancreatici inferiores*; Inferior pancreatic nodes).

- **Descripción.** Nodos (ganglios) pancreáticos que la Terminologia Anatomica 2 llama inferiores.
  - TA2 n.º 5292: Pancreatic nodes (*Nodi pancreatic*)
  - TA2 n.º 5294: Inferior pancreatic nodes (*Nodi pancreatici inferiores*)
- **Descripción.** La Terminologia Anatomica 2 los clasifica entre los nodos viscerales del abdomen.
  - TA2 n.º 5281: Visceral abdominal lymph nodes (*Nodi lymphoidei visceraies abdominis*)
  - TA2 n.º 5294: Inferior pancreatic nodes (*Nodi pancreatici inferiores*)
- **Recibe.** Los nodos esplénicos vierten su linfa en los nodos suprapancreáticos, infrapancreáticos y omentales.
  - [Splenic lymph node](https://en.wikipedia.org/w/index.php?title=Splenic_lymph_node&oldid=1224153827): “The splenic lymph nodes empty into the suprapancreatic, infrapancreatic and omental lymph nodes”
- **Drena en.** Los suprapancreáticos, los infrapancreáticos y los omentales drenan en los nodos celíacos y en la cisterna del quilo.
  - [Splenic lymph node](https://en.wikipedia.org/w/index.php?title=Splenic_lymph_node&oldid=1224153827): “which then drain to the coeliac nodes and cisterna chyli”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** Esta ficha identifica los nodos pancreáticos inferiores de la TA2 con los infrapancreáticos que nombra la fuente; la fuente no los describe más.
  - TA2 n.º 5294: Inferior pancreatic nodes (*Nodi pancreatici inferiores*)
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **Localización: pendiente.** Ninguna fuente libre consultada (Wikipedia en inglés) describe este grupo por separado.
- **Reparo: pendiente.** Ninguna fuente libre consultada (Wikipedia en inglés) describe este grupo por separado.
- Vías en la app: recibe `Splenic_nodes`; drena en `Coeliac_nodes`, `Cisterna_chyli`.

### Nodos lienales (`Splenic_nodes`)

Nombre: TA2 n.º 5295 (*Nodi splenici*; Splenic nodes).

- **Descripción.** Nodos (ganglios) del hilio del bazo; los que están junto a la cola del páncreas se llaman también pancreaticoesplénicos.
  - [Splenic lymph node](https://en.wikipedia.org/w/index.php?title=Splenic_lymph_node&oldid=1224153827): “The splenic lymph nodes are found at the splenic hilum and in relation to the tail of the pancreas (pancreaticolienal lymph nodes).”
- **Descripción.** La fuente los cuenta entre los tres conjuntos de nodos celíacos.
  - [Celiac lymph nodes](https://en.wikipedia.org/w/index.php?title=Celiac_lymph_nodes&oldid=1300899971): “The celiac lymph nodes are grouped into three sets: the gastric, hepatic and splenic lymph nodes.”
- **Localización.** Están en el hilio del bazo y junto a la cola del páncreas.
  - [Splenic lymph node](https://en.wikipedia.org/w/index.php?title=Splenic_lymph_node&oldid=1224153827): “are found at the splenic hilum and in relation to the tail of the pancreas”
- **Reparo.** El hilio del bazo, por donde entran la arteria y la vena esplénicas; la arteria esplénica, rama del tronco celíaco, llega a él por encima del páncreas.
  - [Spleen](https://en.wikipedia.org/w/index.php?title=Spleen&oldid=1384138456): “The splenic artery and splenic vein enter the spleen at the splenic hilum.”
  - [Splenic artery](https://en.wikipedia.org/w/index.php?title=Splenic_artery&oldid=1380884757): “It branches from the celiac artery, and follows a course superior to the pancreas.”
- **Recibe.** Sus aferentes vienen del estómago, el bazo y el páncreas.
  - [Splenic lymph node](https://en.wikipedia.org/w/index.php?title=Splenic_lymph_node&oldid=1224153827): “Their afferents are derived from the stomach, spleen, and pancreas.”
- **Recibe.** A ellos van los linfáticos del cuerpo y la cola del páncreas.
  - [Pancreas](https://en.wikipedia.org/w/index.php?title=Pancreas&oldid=1380834414): “The lymphatic vessels of the body and tail drain into splenic lymph nodes”
- **Drena en.** Vierten en los nodos suprapancreáticos, infrapancreáticos y omentales, que drenan en los nodos celíacos y en la cisterna del quilo.
  - [Splenic lymph node](https://en.wikipedia.org/w/index.php?title=Splenic_lymph_node&oldid=1224153827): “The splenic lymph nodes empty into the suprapancreatic, infrapancreatic and omental lymph nodes, which then drain to the coeliac nodes and cisterna chyli.”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo un colector esquemático los lleva directamente a los nodos celíacos.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe —; drena en `Superior_pancreatic_nodes`, `Inferior_pancreatic_nodes`.

### Nodos pancreatoduodenales superiores (`Superior_pancreaticoduodenal_nodes`)

Nombre: TA2 n.º 5297 (*Nodi pancreaticoduodenales superiores*; Superior pancreaticoduodenal nodes).

- **Descripción.** Nodos (ganglios) pancreaticoduodenales que la Terminologia Anatomica 2 llama superiores.
  - TA2 n.º 5296: Pancreaticoduodenal nodes (*Nodi pancreaticoduodenales*)
  - TA2 n.º 5297: Superior pancreaticoduodenal nodes (*Nodi pancreaticoduodenales superiores*)
- **Descripción.** La Terminologia Anatomica 2 los clasifica entre los nodos viscerales del abdomen.
  - TA2 n.º 5281: Visceral abdominal lymph nodes (*Nodi lymphoidei visceraies abdominis*)
  - TA2 n.º 5297: Superior pancreaticoduodenal nodes (*Nodi pancreaticoduodenales superiores*)
- **Localización.** Los nodos pancreaticoduodenales están a lo largo de las arterias pancreaticoduodenales superior e inferior.
  - [Duodenum](https://en.wikipedia.org/w/index.php?title=Duodenum&oldid=1385143543): “the pancreatoduodenal lymph nodes located along the superior and inferior pancreatoduodenal arteries”
- **Reparo.** La arteria pancreaticoduodenal superior, rama de la gastroduodenal, cuyas ramas anterior y posterior rodean la cabeza del páncreas y el duodeno.
  - [Superior pancreaticoduodenal artery](https://en.wikipedia.org/w/index.php?title=Superior_pancreaticoduodenal_artery&oldid=1380892432): “It is a branch of the gastroduodenal artery”
  - [Superior pancreaticoduodenal artery](https://en.wikipedia.org/w/index.php?title=Superior_pancreaticoduodenal_artery&oldid=1380892432): “These branches then travel around the head of the pancreas and duodenum”
- **Recibe.** A ellos van los linfáticos anteriores del duodeno.
  - [Duodenum](https://en.wikipedia.org/w/index.php?title=Duodenum&oldid=1385143543): “The anterior lymphatic vessels drain into the pancreatoduodenal lymph nodes”
- **Recibe.** Los linfáticos de la cabeza y el cuello del páncreas van a vasos linfáticos intermedios alrededor de las arterias pancreaticoduodenales, mesentéricas y hepáticas, y de ahí a los nodos situados delante de la aorta.
  - [Pancreas](https://en.wikipedia.org/w/index.php?title=Pancreas&oldid=1380834414): “The lymphatic vessels of the head and neck drain into intermediate lymphatic vessels around the pancreaticoduodenal, mesenteric and hepatic arteries, and from there into the lymph nodes that lie in front of the aorta.”
- **Drena en.** Drenan en los nodos pilóricos, a lo largo de la arteria gastroduodenal.
  - [Duodenum](https://en.wikipedia.org/w/index.php?title=Duodenum&oldid=1385143543): “and then into the pyloric lymph nodes (along the gastroduodenal artery)”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo no hay pieza de nodos pancreaticoduodenales inferiores (TA2 n.º 5298).
  - TA2 n.º 5298: Inferior pancreaticoduodenal nodes (*Nodi pancreaticoduodenales inferiores*)
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo un colector esquemático los lleva directamente a los nodos celíacos, sin pasar por los pilóricos que describe la fuente.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe —; drena en `Subpyloric_nodes`, `Suprapyloric_node`, `Retropyloric_nodes`.

### Nodo quístico (`Cystic_node`)

Nombre: TA2 n.º 5300 (*Nodus cysticus*; Cystic node).

- **Descripción.** Nodo (ganglio) centinela de la vesícula biliar, también llamado nodo de Lund o de Mascagni; a menudo se le llama, por error, nodo de Calot.
  - [Cystic node](https://en.wikipedia.org/w/index.php?title=Cystic_node&oldid=1324251163): “cystic lymph node of Lund, Lund's node, or Mascagni's lymph node and often erroneously referred to as Calot's node) is the sentinel lymph node of the gall bladder”
- **Descripción.** La fuente lo cuenta en la cadena hepática.
  - [Hepatic lymph nodes](https://en.wikipedia.org/w/index.php?title=Hepatic_lymph_nodes&oldid=1224153783): “the cystic gland, a member of this group, is placed near the neck of the gall-bladder”
- **Localización.** Está en el cuello de la vesícula biliar, dentro del triángulo cistohepático (de Calot), siempre por fuera de la vía biliar.
  - [Cystic node](https://en.wikipedia.org/w/index.php?title=Cystic_node&oldid=1324251163): “The cystic lymph node is situated at the neck of the gallbladder.”
  - [Cystic node](https://en.wikipedia.org/w/index.php?title=Cystic_node&oldid=1324251163): “It is located within the cystohepatic triangle (Calot's triangle).”
  - [Cystic node](https://en.wikipedia.org/w/index.php?title=Cystic_node&oldid=1324251163): “It is invariably situated lateral to the biliary tree.”
- **Localización.** Queda entre el conducto cístico y el conducto hepático común.
  - [Gallbladder](https://en.wikipedia.org/w/index.php?title=Gallbladder&oldid=1378026106): “which is located between the cystic duct and the common hepatic duct”
- **Reparo.** El triángulo cistohepático, que contiene grasa y tejido conectivo, vasos linfáticos y el nodo cístico, nervios autónomos y, por lo general, la arteria cística.
  - [Cystohepatic triangle](https://en.wikipedia.org/w/index.php?title=Cystohepatic_triangle&oldid=1339888990): “The triangle contains: adipose and connective tissue, lymphatic vessels and the cystic lymph node, autonomic nerves, (usually) cystic artery”
- **Reparo.** En un estudio retrospectivo, cuando se identificó el nodo, estaba en relación con la arteria cística en alrededor del 97 % de los casos.
  - [Cystic node](https://en.wikipedia.org/w/index.php?title=Cystic_node&oldid=1324251163): “the node was related to the cystic artery in ~97% of cases”
- **Recibe.** Recibe la linfa de la vesícula biliar, el conducto cístico, el conducto hepático y la parte superior del colédoco.
  - [Cystic node](https://en.wikipedia.org/w/index.php?title=Cystic_node&oldid=1324251163): “The node receives lymphatic drainage from the gallbladder, cystic duct, hepatic duct, and the superior portion of the common bile duct.”
- **Drena en.** Drena en los nodos hepáticos.
  - [Cystic node](https://en.wikipedia.org/w/index.php?title=Cystic_node&oldid=1324251163): “It in turn drains lymph into the hepatic lymph nodes.”
- **Drena en.** Toda la linfa de la vesícula biliar acaba en los nodos celíacos.
  - [Gallbladder](https://en.wikipedia.org/w/index.php?title=Gallbladder&oldid=1378026106): “All the lymph finally drains into celiac lymph nodes.”
- **En este modelo.** En este modelo el nodo se representa con una forma y un tamaño esquemáticos.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo no hay pieza de nodos hepáticos (TA2 n.º 5299).
  - TA2 n.º 5299: Hepatic nodes (*Nodi hepatici*)
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo un colector esquemático lo une directamente con los nodos celíacos.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **Nota.** Aumenta de tamaño en la colecistitis y la colangitis.
  - [Cystic node](https://en.wikipedia.org/w/index.php?title=Cystic_node&oldid=1324251163): “It increases in size in cholecystitis and cholangitis”
- **Nota.** Es un reparo anatómico en la colecistectomía para evitar lesionar la vía biliar.
  - [Cystic node](https://en.wikipedia.org/w/index.php?title=Cystic_node&oldid=1324251163): “It is an anatomic landmark and may be removed along with the gallbladder in cholecystectomy.”
  - [Cystic node](https://en.wikipedia.org/w/index.php?title=Cystic_node&oldid=1324251163): “The node can be used as a landmark to prevent iatrogenic injury during surgery in the cystohepatic triangle”
- Vías en la app: recibe —; drena en `Coeliac_nodes`.

### Nodos mesentéricos yuxta-intestinales (`Juxta_intestinal_mesenteric_nodes`)

Nombre: TA2 n.º 5303 (*Nodi juxtaintestinales*; Juxta-intestinal mesenteric nodes).

- **Descripción.** La fuente divide los nodos mesentéricos superiores en tres grupos principales: mesentéricos, ileocólicos y mesocólicos.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “The superior mesenteric lymph nodes may be divided into three principal groups:”
- **Descripción.** Los nodos mesentéricos están entre las hojas del mesenterio y son de cien a ciento cincuenta.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “lie between the layers of the mesentery”
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “They number from one hundred to one hundred and fifty”
- **Localización.** Uno de sus grupos está junto a la pared del intestino delgado, entre las últimas ramas de la arteria mesentérica superior.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “lying close to the wall of the small intestine, among the terminal twigs of the superior mesenteric artery”
- **Reparo.** Las últimas ramas de la arteria mesentérica superior junto a la pared del intestino delgado.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “among the terminal twigs of the superior mesenteric artery”
- **Recibe.** Los mesentéricos superiores reciben la linfa del yeyuno, el íleon, el ciego, el apéndice vermiforme y las partes ascendente y transversa del colon.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “The superior mesenteric glands receive lymph from the jejunum, ileum, cecum, vermiform process, and the ascending and transverse parts of the colon”
- **Drena en.** La linfa de los mesentéricos superiores va a los nodos preaórticos.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “lymph drains into the preaortic glands”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** Esta ficha identifica los nodos yuxtaintestinales de la TA2 con el grupo de nodos mesentéricos que la fuente sitúa junto a la pared del intestino; en este modelo son 15 frente a los cien o más de la fuente.
  - TA2 n.º 5303: Juxta-intestinal mesenteric nodes (*Nodi juxtaintestinales*)
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe —; drena en `Central_superior_mesenteric_nodes`.

### Nodos mesentéricos superiores centrales (`Central_superior_mesenteric_nodes`)

Nombre: TA2 n.º 5304 (*Nodi mesenterici superiores centrales*; Central superior mesenteric nodes).

- **Descripción.** La fuente divide los nodos mesentéricos superiores en tres grupos principales: mesentéricos, ileocólicos y mesocólicos.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “The superior mesenteric lymph nodes may be divided into three principal groups:”
- **Descripción.** Son uno de los tres grupos de nodos preaórticos de la fuente (celíacos, mesentéricos superiores y mesentéricos inferiores), dispuestos alrededor del origen de sus arterias.
  - [Preaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Preaortic_lymph_nodes&oldid=1336732047): “may be divided into celiac lymph nodes, superior mesenteric lymph nodes, and inferior mesenteric lymph nodes groups, arranged around the origins of the corresponding arteries”
- **Localización.** Los nodos mesentéricos superiores, uno de los grupos preaórticos, están alrededor del origen de su arteria, delante de la aorta.
  - [Preaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Preaortic_lymph_nodes&oldid=1336732047): “superior mesenteric lymph nodes”
  - [Preaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Preaortic_lymph_nodes&oldid=1336732047): “arranged around the origins of the corresponding arteries”
  - [Preaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Preaortic_lymph_nodes&oldid=1336732047): “The preaortic lymph nodes lie in front of the aorta”
- **Reparo.** La arteria mesentérica superior, que sale de la cara anterior de la aorta justo por debajo del tronco celíaco, delante del borde inferior de L1, y va a la izquierda de su vena.
  - [Superior mesenteric artery](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_artery&oldid=1380880787): “arises from the anterior surface of the abdominal aorta, just inferior to the origin of the celiac trunk”
  - [Superior mesenteric artery](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_artery&oldid=1380880787): “In the adult, the SMA arises anterior to inferior border of vertebra L1 (transpyloric plane).”
  - [Superior mesenteric artery](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_artery&oldid=1380880787): “The SMA typically runs to the left of its associated vein, the superior mesenteric vein.”
- **Recibe.** Los mesentéricos superiores reciben la linfa del yeyuno, el íleon, el ciego, el apéndice vermiforme y las partes ascendente y transversa del colon.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “The superior mesenteric glands receive lymph from the jejunum, ileum, cecum, vermiform process, and the ascending and transverse parts of the colon”
- **Recibe.** Les llegan los linfáticos posteriores del duodeno, que pasan por detrás de la cabeza del páncreas.
  - [Duodenum](https://en.wikipedia.org/w/index.php?title=Duodenum&oldid=1385143543): “The posterior lymphatic vessels pass posterior to the head of the pancreas and drain into the superior mesenteric lymph nodes.”
- **Recibe.** Los mesentéricos inferiores drenan en los mesentéricos superiores.
  - [Inferior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Inferior_mesenteric_lymph_nodes&oldid=1300990457): “They drain into the superior mesenteric lymph nodes and ultimately to the preaortic lymph nodes.”
- **Recibe.** La linfa del cuerpo y la cola del páncreas pasa por los nodos esplénicos y acaba en nodos situados delante de la aorta, entre el tronco celíaco y la arteria mesentérica superior.
  - [Pancreas](https://en.wikipedia.org/w/index.php?title=Pancreas&oldid=1380834414): “The lymphatic vessels of the body and tail drain into splenic lymph nodes, and eventually into lymph nodes that lie in front of the aorta, between the coeliac and superior mesenteric arteries.”
- **Drena en.** La linfa de los mesentéricos superiores va a los nodos preaórticos.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “lymph drains into the preaortic glands”
- **Drena en.** La mayoría de los eferentes de los preaórticos se unen en el tronco intestinal, que desemboca en la cisterna del quilo; algunos van a los retroaórticos.
  - [Preaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Preaortic_lymph_nodes&oldid=1336732047): “Some of their efferents pass to the retroaortic lymph nodes, but the majority unite to form the intestinal lymph trunk, which enters the cisterna chyli.”
- **Drena en.** El tronco intestinal recibe la linfa del estómago y los intestinos, del páncreas y el bazo y de la parte inferior y anterior del hígado, y la vierte en la cisterna del quilo.
  - [Intestinal lymph trunk](https://en.wikipedia.org/w/index.php?title=Intestinal_lymph_trunk&oldid=1290203291): “receives the lymph from the stomach and intestines, from the pancreas and spleen, and from the lower and front part of the liver, and empties lymph into the cisterna chyli”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** Esta ficha identifica los mesentéricos superiores centrales de la TA2 con los nodos que la fuente coloca alrededor del origen de la arteria mesentérica superior.
  - TA2 n.º 5304: Central superior mesenteric nodes (*Nodi mesenterici superiores centrales*)
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo los vasos más próximos a sus nodos son la arteria y la vena mesentéricas superiores, y de ellos nacen, con los celíacos, los troncos intestinales.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe `Juxta_intestinal_mesenteric_nodes`, `Ileocolic_nodes`, `Right_colic_nodes`, `Middle_colic_nodes`, `Paracolic_superior_mesenteric_nodes`, `Left_colic_nodes`, `Sigmoid_nodes`; drena en `Intestinal_trunks`.

### Nodos ileocólicos (`Ileocolic_nodes`)

Nombre: TA2 n.º 5305 (*Nodi ileocolici*; Ileocolic nodes).

- **Descripción.** La fuente divide los nodos mesentéricos superiores en tres grupos principales: mesentéricos, ileocólicos y mesocólicos.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “The superior mesenteric lymph nodes may be divided into three principal groups:”
- **Descripción.** Los nodos ileocólicos son de diez a veinte y forman una cadena alrededor de la arteria ileocólica.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “The ileocolic lymph nodes, from ten to twenty in number, form a chain around the ileocolic artery”
- **Localización.** La cadena tiende a dividirse en dos grupos: uno cerca del duodeno y otro en la parte baja del tronco de la arteria.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “tend to subdivide into two groups, one near the duodenum and the other on the lower part of the trunk of the artery”
- **Localización.** Donde la arteria da sus ramas terminales, la cadena se rompe en varios grupos: ileales, ileocólicos anteriores y posteriores, un nodo apendicular y cólicos derechos.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “Where the vessel divides into its terminal branches the chain is broken up into several groups:”
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “(a) ileal, in relation to the ileal branch of the artery”
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “(b) anterior ileocolic”
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “(c) posterior ileocolic”
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “(d) a single gland, between the layers of the mesenteriole of the appendix”
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “(e) right colic, along the medial side of the ascending colon”
- **Reparo.** La arteria ileocólica, la rama más baja de la concavidad de la mesentérica superior, que baja hacia la derecha por detrás del peritoneo hasta la fosa ilíaca derecha.
  - [Ileocolic artery](https://en.wikipedia.org/w/index.php?title=Ileocolic_artery&oldid=1380884317): “The ileocolic artery is the lowest branch arising from the concavity of the superior mesenteric artery.”
  - [Ileocolic artery](https://en.wikipedia.org/w/index.php?title=Ileocolic_artery&oldid=1380884317): “It passes downward and to the right behind the peritoneum toward the right iliac fossa”
- **Recibe.** La linfa del colon ascendente y de los dos tercios proximales del colon transverso va a los nodos ileocólicos y a los mesentéricos superiores, que drenan en la cisterna del quilo.
  - [Large intestine](https://en.wikipedia.org/w/index.php?title=Large_intestine&oldid=1385065993): “Lymphatic drainage from the ascending colon and proximal two-thirds of the transverse colon is to the ileocolic lymph nodes and the superior mesenteric lymph nodes, which drain into the cisterna chyli.”
- **Recibe.** Los mesentéricos superiores reciben la linfa del yeyuno, el íleon, el ciego, el apéndice vermiforme y las partes ascendente y transversa del colon.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “The superior mesenteric glands receive lymph from the jejunum, ileum, cecum, vermiform process, and the ascending and transverse parts of the colon”
- **Drena en.** La linfa de los mesentéricos superiores va a los nodos preaórticos.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “lymph drains into the preaortic glands”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo el grupo tiene 2 nodos, frente a los diez a veinte de la fuente; los prececales, retrocecales y apendiculares son piezas aparte.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe `Appendicular_nodes`, `Precaecal_nodes`, `Retrocaecal_nodes`; drena en `Central_superior_mesenteric_nodes`.

### Nodos praecaecales (`Precaecal_nodes`)

Nombre: TA2 n.º 5306 (*Nodi precaecales*; Precaecal nodes).

- **Descripción.** Nodos (ganglios) situados delante del ciego, que la fuente llama ileocólicos anteriores.
  - TA2 n.º 5306: Precaecal nodes (*Nodi precaecales*)
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “anterior ileocolic, usually of three glands, in the ileocolic fold, near the wall of the cecum”
- **Descripción.** La fuente lo cuenta entre los grupos en que se divide la cadena ileocólica donde la arteria da sus ramas terminales.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “Where the vessel divides into its terminal branches the chain is broken up into several groups:”
- **Localización.** Suelen ser tres y están en el pliegue ileocólico, cerca de la pared del ciego.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “anterior ileocolic, usually of three glands, in the ileocolic fold, near the wall of the cecum”
- **Reparo.** El ciego, bolsa del lado derecho que inicia el intestino grueso: recibe el contenido del íleon y se continúa con el colon ascendente.
  - [Cecum](https://en.wikipedia.org/w/index.php?title=Cecum&oldid=1380879850): “is a pouch within the peritoneum that is considered to be the beginning of the large intestine”
  - [Cecum](https://en.wikipedia.org/w/index.php?title=Cecum&oldid=1380879850): “It is typically located on the right side of the body”
  - [Cecum](https://en.wikipedia.org/w/index.php?title=Cecum&oldid=1380879850): “It receives chyme from the ileum, and connects to the ascending colon of the large intestine.”
- **Recibe.** La linfa del colon ascendente y de los dos tercios proximales del colon transverso va a los nodos ileocólicos y a los mesentéricos superiores, que drenan en la cisterna del quilo.
  - [Large intestine](https://en.wikipedia.org/w/index.php?title=Large_intestine&oldid=1385065993): “Lymphatic drainage from the ascending colon and proximal two-thirds of the transverse colon is to the ileocolic lymph nodes and the superior mesenteric lymph nodes, which drain into the cisterna chyli.”
- **Recibe.** Los mesentéricos superiores reciben la linfa del yeyuno, el íleon, el ciego, el apéndice vermiforme y las partes ascendente y transversa del colon.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “The superior mesenteric glands receive lymph from the jejunum, ileum, cecum, vermiform process, and the ascending and transverse parts of the colon”
- **Drena en.** La linfa de los mesentéricos superiores va a los nodos preaórticos.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “lymph drains into the preaortic glands”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** Esta ficha identifica los prececales de la TA2 con los ileocólicos anteriores de la fuente.
  - TA2 n.º 5306: Precaecal nodes (*Nodi precaecales*)
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe —; drena en `Ileocolic_nodes`.

### Nodos retrocecales (`Retrocaecal_nodes`)

Nombre: TA2 n.º 5307 (*Nodi retrocaecales*; Retrocaecal nodes).

- **Descripción.** Nodos (ganglios) situados detrás del ciego, que la fuente incluye en los ileocólicos posteriores.
  - TA2 n.º 5307: Retrocaecal nodes (*Nodi retrocaecales*)
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “posterior ileocolic, mostly placed in the angle between the ileum and the colon, but partly lying behind the cecum at its junction with the ascending colon”
- **Descripción.** La fuente lo cuenta entre los grupos en que se divide la cadena ileocólica donde la arteria da sus ramas terminales.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “Where the vessel divides into its terminal branches the chain is broken up into several groups:”
- **Localización.** Los ileocólicos posteriores están sobre todo en el ángulo entre el íleon y el colon, y en parte detrás del ciego, donde se une con el colon ascendente.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “posterior ileocolic, mostly placed in the angle between the ileum and the colon, but partly lying behind the cecum at its junction with the ascending colon”
- **Reparo.** El ciego, bolsa del lado derecho que inicia el intestino grueso: recibe el contenido del íleon y se continúa con el colon ascendente.
  - [Cecum](https://en.wikipedia.org/w/index.php?title=Cecum&oldid=1380879850): “is a pouch within the peritoneum that is considered to be the beginning of the large intestine”
  - [Cecum](https://en.wikipedia.org/w/index.php?title=Cecum&oldid=1380879850): “It is typically located on the right side of the body”
  - [Cecum](https://en.wikipedia.org/w/index.php?title=Cecum&oldid=1380879850): “It receives chyme from the ileum, and connects to the ascending colon of the large intestine.”
- **Recibe.** La linfa del colon ascendente y de los dos tercios proximales del colon transverso va a los nodos ileocólicos y a los mesentéricos superiores, que drenan en la cisterna del quilo.
  - [Large intestine](https://en.wikipedia.org/w/index.php?title=Large_intestine&oldid=1385065993): “Lymphatic drainage from the ascending colon and proximal two-thirds of the transverse colon is to the ileocolic lymph nodes and the superior mesenteric lymph nodes, which drain into the cisterna chyli.”
- **Recibe.** Los mesentéricos superiores reciben la linfa del yeyuno, el íleon, el ciego, el apéndice vermiforme y las partes ascendente y transversa del colon.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “The superior mesenteric glands receive lymph from the jejunum, ileum, cecum, vermiform process, and the ascending and transverse parts of the colon”
- **Drena en.** La linfa de los mesentéricos superiores va a los nodos preaórticos.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “lymph drains into the preaortic glands”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** Esta ficha identifica los retrocecales de la TA2 con la parte de los ileocólicos posteriores de la fuente que está detrás del ciego.
  - TA2 n.º 5307: Retrocaecal nodes (*Nodi retrocaecales*)
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe —; drena en `Ileocolic_nodes`.

### Nodos apendiculares (`Appendicular_nodes`)

Nombre: TA2 n.º 5308 (*Nodi appendiculares*; Appendicular nodes).

- **Descripción.** Nodo (ganglio) del mesoapéndice: la fuente describe uno solo, entre las hojas del meso del apéndice, como uno de los grupos de la cadena ileocólica.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “a single gland, between the layers of the mesenteriole of the appendix”
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “Where the vessel divides into its terminal branches the chain is broken up into several groups:”
- **Localización.** El mesoapéndice une el apéndice con el mesenterio de la parte baja del íleon y contiene la arteria y la vena apendiculares, vasos linfáticos, nervios y, a menudo, un nodo linfático.
  - [Appendix (anatomy)](https://en.wikipedia.org/w/index.php?title=Appendix_(anatomy)&oldid=1382437093): “The appendix is connected to the mesentery in the lower region of the ileum, by a short region of the mesocolon known as the mesoappendix.”
  - [Mesentery](https://en.wikipedia.org/w/index.php?title=Mesentery&oldid=1384603638): “It encloses the appendicular artery and vein, as well as lymphatic vessels, nerves, and often a lymph node.”
- **Reparo.** La arteria apendicular, que suele nacer de la rama terminal de la ileocólica, baja por detrás del final del íleon y entra en el mesoapéndice, cerca de su borde libre.
  - [Appendicular artery](https://en.wikipedia.org/w/index.php?title=Appendicular_artery&oldid=1380889304): “commonly arises from the terminal branch of the ileocolic artery”
  - [Appendicular artery](https://en.wikipedia.org/w/index.php?title=Appendicular_artery&oldid=1380889304): “It descends behind the termination of the ileum and enters the mesoappendix of the vermiform appendix.”
  - [Appendicular artery](https://en.wikipedia.org/w/index.php?title=Appendicular_artery&oldid=1380889304): “It runs near the free margin of the mesoappendix”
- **Recibe.** Los mesentéricos superiores reciben la linfa del yeyuno, el íleon, el ciego, el apéndice vermiforme y las partes ascendente y transversa del colon.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “The superior mesenteric glands receive lymph from the jejunum, ileum, cecum, vermiform process, and the ascending and transverse parts of the colon”
- **Drena en.** La linfa de los mesentéricos superiores va a los nodos preaórticos.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “lymph drains into the preaortic glands”
- **En este modelo.** En este modelo el grupo tiene 3 nodos de forma y tamaño esquemáticos, aunque la fuente describe un solo nodo.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo un colector esquemático lo une con los nodos ileocólicos.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe —; drena en `Ileocolic_nodes`.

### Nodos mesentéricos superiores paracólicos (`Paracolic_superior_mesenteric_nodes`)

Nombre: TA2 n.º 5309 (*Nodi mesenterici superiores paracolici*; Paracolic superior mesenteric nodes).

- **Descripción.** La fuente divide los nodos mesentéricos superiores en tres grupos principales: mesentéricos, ileocólicos y mesocólicos.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “The superior mesenteric lymph nodes may be divided into three principal groups:”
- **Descripción.** Los nodos mesocólicos son numerosos y están entre las hojas del mesocolon transverso, muy cerca del colon transverso; están más desarrollados cerca de las flexuras cólicas derecha e izquierda.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “The mesocolic lymph nodes are numerous, and lie between the layers of the transverse mesocolon, in close relation to the transverse colon; they are best developed in the neighborhood of the right and left colic flexures.”
- **Localización.** Los nodos mesocólicos son numerosos y están entre las hojas del mesocolon transverso, muy cerca del colon transverso; están más desarrollados cerca de las flexuras cólicas derecha e izquierda.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “The mesocolic lymph nodes are numerous, and lie between the layers of the transverse mesocolon, in close relation to the transverse colon; they are best developed in the neighborhood of the right and left colic flexures.”
- **Reparo.** El colon transverso y su mesocolon, la parte del mesenterio que lo une a la pared posterior del abdomen.
  - [Mesentery](https://en.wikipedia.org/w/index.php?title=Mesentery&oldid=1384603638): “the transverse mesocolon attaching to the transverse colon”
  - [Mesentery](https://en.wikipedia.org/w/index.php?title=Mesentery&oldid=1384603638): “The mesocolon (the part of the mesentery that attaches the colon to the abdominal wall)”
- **Recibe.** La linfa del colon ascendente y de los dos tercios proximales del colon transverso va a los nodos ileocólicos y a los mesentéricos superiores, que drenan en la cisterna del quilo.
  - [Large intestine](https://en.wikipedia.org/w/index.php?title=Large_intestine&oldid=1385065993): “Lymphatic drainage from the ascending colon and proximal two-thirds of the transverse colon is to the ileocolic lymph nodes and the superior mesenteric lymph nodes, which drain into the cisterna chyli.”
- **Recibe.** Los mesentéricos superiores reciben la linfa del yeyuno, el íleon, el ciego, el apéndice vermiforme y las partes ascendente y transversa del colon.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “The superior mesenteric glands receive lymph from the jejunum, ileum, cecum, vermiform process, and the ascending and transverse parts of the colon”
- **Drena en.** La linfa de los mesentéricos superiores va a los nodos preaórticos.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “lymph drains into the preaortic glands”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** Esta ficha identifica los paracólicos mesentéricos superiores de la TA2 con los nodos mesocólicos de la fuente.
  - TA2 n.º 5309: Paracolic superior mesenteric nodes (*Nodi mesenterici superiores paracolici*)
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo un colector esquemático los lleva a los nodos cólicos derechos y medios.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe —; drena en `Right_colic_nodes`, `Middle_colic_nodes`, `Central_superior_mesenteric_nodes`.

### Nodos cólicos derechos (`Right_colic_nodes`)

Nombre: TA2 n.º 5310 (*Nodi colici dextri*; Right colic nodes).

- **Descripción.** La fuente divide los nodos mesentéricos superiores en tres grupos principales: mesentéricos, ileocólicos y mesocólicos.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “The superior mesenteric lymph nodes may be divided into three principal groups:”
- **Descripción.** La fuente describe nodos cólicos derechos en dos sitios: a lo largo del lado medial del colon ascendente, al final de la cadena ileocólica, y, alguna vez, uno o dos pequeños en el tronco de la arteria cólica derecha.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “(e) right colic, along the medial side of the ascending colon”
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “One or two small glands are occasionally seen along the trunk of the right colic artery”
- **Localización.** Están a lo largo del lado medial del colon ascendente.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “right colic, along the medial side of the ascending colon”
- **Reparo.** La arteria cólica derecha, rama de la mesentérica superior, que va hacia la derecha por detrás del peritoneo, por delante de los vasos gonadales, el uréter y el psoas mayor derechos, hacia la mitad del colon ascendente.
  - [Right colic artery](https://en.wikipedia.org/w/index.php?title=Right_colic_artery&oldid=1380889233): “The right colic artery is a branch of the superior mesenteric artery.”
  - [Right colic artery](https://en.wikipedia.org/w/index.php?title=Right_colic_artery&oldid=1380889233): “It passes right-ward posterior to the peritoneum, and anterior to the right gonadal vessels, the right ureter, the psoas major muscle, passing toward the middle of the ascending colon.”
- **Recibe.** La linfa del colon ascendente y de los dos tercios proximales del colon transverso va a los nodos ileocólicos y a los mesentéricos superiores, que drenan en la cisterna del quilo.
  - [Large intestine](https://en.wikipedia.org/w/index.php?title=Large_intestine&oldid=1385065993): “Lymphatic drainage from the ascending colon and proximal two-thirds of the transverse colon is to the ileocolic lymph nodes and the superior mesenteric lymph nodes, which drain into the cisterna chyli.”
- **Recibe.** Los mesentéricos superiores reciben la linfa del yeyuno, el íleon, el ciego, el apéndice vermiforme y las partes ascendente y transversa del colon.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “The superior mesenteric glands receive lymph from the jejunum, ileum, cecum, vermiform process, and the ascending and transverse parts of the colon”
- **Drena en.** La linfa de los mesentéricos superiores va a los nodos preaórticos.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “lymph drains into the preaortic glands”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe —; drena en `Central_superior_mesenteric_nodes`.

### Nodos cólicos medios (`Middle_colic_nodes`)

Nombre: TA2 n.º 5311 (*Nodi colici medii*; Middle colic nodes).

- **Descripción.** La fuente divide los nodos mesentéricos superiores en tres grupos principales: mesentéricos, ileocólicos y mesocólicos.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “The superior mesenteric lymph nodes may be divided into three principal groups:”
- **Descripción.** La fuente describe, entre los mesocólicos, nodos en relación con el tronco y las ramas de la arteria cólica media.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “others are found in relation to the trunk and branches of the middle colic artery”
- **Localización.** Están en el tronco y las ramas de la arteria cólica media, entre las hojas del mesocolon transverso.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “others are found in relation to the trunk and branches of the middle colic artery”
  - [Middle colic artery](https://en.wikipedia.org/w/index.php?title=Middle_colic_artery&oldid=1380884257): “passes anterosuperiorly between the layers of the transverse mesocolon”
- **Reparo.** La arteria cólica media, que sale del lado derecho de la mesentérica superior justo por debajo del cuello del páncreas y sube entre las hojas del mesocolon transverso, a la derecha de la línea media, hasta dividirse en dos ramas.
  - [Middle colic artery](https://en.wikipedia.org/w/index.php?title=Middle_colic_artery&oldid=1380884257): “branching off from its right aspect. Its origin is situated just inferior the neck of the pancreas.”
  - [Middle colic artery](https://en.wikipedia.org/w/index.php?title=Middle_colic_artery&oldid=1380884257): “The middle colic artery passes anterosuperiorly between the layers of the transverse mesocolon just right of the midline before dividing into left and right terminal branches.”
- **Recibe.** La linfa del colon ascendente y de los dos tercios proximales del colon transverso va a los nodos ileocólicos y a los mesentéricos superiores, que drenan en la cisterna del quilo.
  - [Large intestine](https://en.wikipedia.org/w/index.php?title=Large_intestine&oldid=1385065993): “Lymphatic drainage from the ascending colon and proximal two-thirds of the transverse colon is to the ileocolic lymph nodes and the superior mesenteric lymph nodes, which drain into the cisterna chyli.”
- **Recibe.** Los mesentéricos superiores reciben la linfa del yeyuno, el íleon, el ciego, el apéndice vermiforme y las partes ascendente y transversa del colon.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “The superior mesenteric glands receive lymph from the jejunum, ileum, cecum, vermiform process, and the ascending and transverse parts of the colon”
- **Drena en.** La linfa de los mesentéricos superiores va a los nodos preaórticos.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “lymph drains into the preaortic glands”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- Vías en la app: recibe —; drena en `Central_superior_mesenteric_nodes`.

### Nodos cólicos izquierdos (`Left_colic_nodes`)

Nombre: TA2 n.º 5314 (*Nodi colici sinistri*; Left colic nodes).

- **Descripción.** Pequeños nodos (ganglios) mesentéricos inferiores situados en las ramas de la arteria cólica izquierda.
  - [Inferior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Inferior_mesenteric_lymph_nodes&oldid=1300990457): “(a) small glands on the branches of the left colic and sigmoid arteries”
  - TA2 n.º 5312: Inferior mesenteric nodes (*Nodi mesenterici inferiores*)
  - TA2 n.º 5314: Left colic nodes (*Nodi colici sinistri*)
- **Descripción.** Los nodos mesentéricos inferiores están a lo largo de todo el intestino posterior.
  - [Inferior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Inferior_mesenteric_lymph_nodes&oldid=1300990457): “The inferior mesenteric lymph nodes are lymph nodes present throughout the hindgut.”
- **Localización.** Están en las ramas de la arteria cólica izquierda.
  - [Inferior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Inferior_mesenteric_lymph_nodes&oldid=1300990457): “small glands on the branches of the left colic and sigmoid arteries”
- **Reparo.** La arteria cólica izquierda, rama de la mesentérica inferior para el colon descendente y la parte izquierda del transverso, que va a la izquierda por detrás del peritoneo y se divide en una rama ascendente y otra descendente.
  - [Left colic artery](https://en.wikipedia.org/w/index.php?title=Left_colic_artery&oldid=1380884170): “The left colic artery is a branch of the inferior mesenteric artery distributed to the descending colon, and left part of the transverse colon.”
  - [Left colic artery](https://en.wikipedia.org/w/index.php?title=Left_colic_artery&oldid=1380884170): “The left colic artery passes to the left posterior to the peritoneum.”
  - [Left colic artery](https://en.wikipedia.org/w/index.php?title=Left_colic_artery&oldid=1380884170): “it divides into an ascending branch and a descending branch”
- **Recibe.** Los mesentéricos inferiores drenan estructuras del intestino posterior: reciben la linfa del colon descendente, el colon sigmoide y la parte proximal del recto.
  - [Inferior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Inferior_mesenteric_lymph_nodes&oldid=1300990457): “they receive lymph from the descending colon, sigmoid colon, and proximal part of the rectum”
- **Recibe.** La linfa del tercio distal del colon transverso, el colon descendente, el colon sigmoide y la parte alta del recto va a los nodos mesentéricos inferiores y cólicos.
  - [Large intestine](https://en.wikipedia.org/w/index.php?title=Large_intestine&oldid=1385065993): “The lymph from the distal one-third of the transverse colon, the descending colon, the sigmoid colon, and the upper rectum drain into the inferior mesenteric and colic lymph nodes.”
- **Drena en.** Drenan en los mesentéricos superiores y, al final, en los preaórticos; los nodos que rodean la arteria mesentérica inferior drenan directamente en los preaórticos.
  - [Inferior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Inferior_mesenteric_lymph_nodes&oldid=1300990457): “They drain into the superior mesenteric lymph nodes and ultimately to the preaortic lymph nodes.”
  - [Inferior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Inferior_mesenteric_lymph_nodes&oldid=1300990457): “Lymph nodes surrounding the inferior mesenteric artery drain directly into the preaortic nodes.”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo no hay pieza propia para los nodos mesentéricos inferiores alrededor de la arteria (TA2 n.º 5312) ni para los anorrectales superiores (n.º 5316).
  - TA2 n.º 5312: Inferior mesenteric nodes (*Nodi mesenterici inferiores*)
  - TA2 n.º 5316: Superior anorectal nodes (*Nodi anorectales superiores*)
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo un colector esquemático los lleva a los nodos preaórticos.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **Nota.** El cáncer colorrectal puede dar metástasis en los nodos mesentéricos inferiores.
  - [Inferior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Inferior_mesenteric_lymph_nodes&oldid=1300990457): “Colorectal cancer may metastasise to the inferior mesenteric lymph nodes.”
- Vías en la app: recibe —; drena en `Central_superior_mesenteric_nodes`, `Pre_aortic_nodes`.

### Nodos sigmoides (`Sigmoid_nodes`)

Nombre: TA2 n.º 5315 (*Nodi sigmoidei*; Sigmoid nodes).

- **Descripción.** Nodos (ganglios) mesentéricos inferiores del colon sigmoide.
  - TA2 n.º 5312: Inferior mesenteric nodes (*Nodi mesenterici inferiores*)
  - TA2 n.º 5315: Sigmoid nodes (*Nodi sigmoidei*)
- **Descripción.** La fuente describe pequeños nodos en las ramas de las arterias sigmoideas y un grupo en el mesocolon sigmoide, alrededor de la arteria hemorroidal (rectal) superior.
  - [Inferior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Inferior_mesenteric_lymph_nodes&oldid=1300990457): “(a) small glands on the branches of the left colic and sigmoid arteries”
  - [Inferior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Inferior_mesenteric_lymph_nodes&oldid=1300990457): “(b) a group in the sigmoid mesocolon, around the superior hemorrhoidal artery”
- **Localización.** Están en las ramas de las arterias sigmoideas y en el mesocolon sigmoide.
  - [Inferior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Inferior_mesenteric_lymph_nodes&oldid=1300990457): “small glands on the branches of the left colic and sigmoid arteries”
  - [Inferior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Inferior_mesenteric_lymph_nodes&oldid=1300990457): “a group in the sigmoid mesocolon, around the superior hemorrhoidal artery”
- **Reparo.** Las arterias sigmoideas, de dos a cinco ramas de la mesentérica inferior para el final del colon descendente y el colon sigmoide, que bajan oblicuas hacia la izquierda por detrás del peritoneo y por delante del psoas mayor y el uréter.
  - [Sigmoid arteries](https://en.wikipedia.org/w/index.php?title=Sigmoid_arteries&oldid=1380884284): “The sigmoid arteries are 2–5 branches of the inferior mesenteric artery that are distributed to the distal descending colon and the sigmoid colon.”
  - [Sigmoid arteries](https://en.wikipedia.org/w/index.php?title=Sigmoid_arteries&oldid=1380884284): “The sigmoid arteries course obliquely inferior-ward and to the left, passing posterior to the peritoneum and in anterior to the psoas major, ureter”
- **Recibe.** Los mesentéricos inferiores drenan estructuras del intestino posterior: reciben la linfa del colon descendente, el colon sigmoide y la parte proximal del recto.
  - [Inferior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Inferior_mesenteric_lymph_nodes&oldid=1300990457): “they receive lymph from the descending colon, sigmoid colon, and proximal part of the rectum”
- **Recibe.** La linfa del tercio distal del colon transverso, el colon descendente, el colon sigmoide y la parte alta del recto va a los nodos mesentéricos inferiores y cólicos.
  - [Large intestine](https://en.wikipedia.org/w/index.php?title=Large_intestine&oldid=1385065993): “The lymph from the distal one-third of the transverse colon, the descending colon, the sigmoid colon, and the upper rectum drain into the inferior mesenteric and colic lymph nodes.”
- **Drena en.** Drenan en los mesentéricos superiores y, al final, en los preaórticos; los nodos que rodean la arteria mesentérica inferior drenan directamente en los preaórticos.
  - [Inferior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Inferior_mesenteric_lymph_nodes&oldid=1300990457): “They drain into the superior mesenteric lymph nodes and ultimately to the preaortic lymph nodes.”
  - [Inferior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Inferior_mesenteric_lymph_nodes&oldid=1300990457): “Lymph nodes surrounding the inferior mesenteric artery drain directly into the preaortic nodes.”
- **En este modelo.** En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo no hay pieza propia para los nodos mesentéricos inferiores alrededor de la arteria (TA2 n.º 5312) ni para los anorrectales superiores (n.º 5316).
  - TA2 n.º 5312: Inferior mesenteric nodes (*Nodi mesenterici inferiores*)
  - TA2 n.º 5316: Superior anorectal nodes (*Nodi anorectales superiores*)
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **En este modelo.** En este modelo un colector esquemático los lleva a los nodos preaórticos.
  - *Modelo 3D* (afirmación sobre el modelo de Anato3D)
- **Nota.** El cáncer colorrectal puede dar metástasis en los nodos mesentéricos inferiores.
  - [Inferior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Inferior_mesenteric_lymph_nodes&oldid=1300990457): “Colorectal cancer may metastasise to the inferior mesenteric lymph nodes.”
- Vías en la app: recibe —; drena en `Central_superior_mesenteric_nodes`, `Pre_aortic_nodes`.
