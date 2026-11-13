---
title: Fuentes de las fichas linfáticas del tórax
date: 2026-11-12
---

# Fuentes de las fichas linfáticas del tórax (2026-11-12)

Qué fuente respalda cada frase de las fichas de los nodos (ganglios) del tórax (`web/src/data/linfatico/torax.js`, grupo `Thoracic_lymph_nodes`): paraesternales, intercostales, diafragmáticos superiores, braquiocefálicos, nodo del ligamento arterioso, nodo del arco de la vena ácigos, prepericárdicos, pericárdicos laterales, paratraqueales torácicos, traqueobronquiales superiores e inferiores, intrapulmonares, yuxtaesofágicos y prevertebrales (14 fichas para las 16 piezas publicadas de cada modelo). La app muestra el número de la fuente tras cada frase y la cita literal al pasar el puntero.

Todo es **borrador** redactado con IA (Claude) a partir de las fuentes citadas, **sin revisión de un especialista**.

## Cómo se comprobó

1. Páginas bajadas con `node scripts/linfatico-citas.mjs bajar …` (Wikipedia en inglés y en español, CC BY-SA 4.0; texto plano de la API, sin recuadros ni pies de imagen), registradas con su revisión en `web/src/data/linfatico/comprobadas.js`.
2. `node scripts/linfatico-citas.mjs comprobar`: las 112 citas de este archivo (en 18 páginas) están en su página, palabra por palabra; 0 sin encontrar en todo el linfático.
3. `node scripts/check-cards.mjs`: «todo correcto»; los avisos de este archivo son los campos pendientes de la lista de abajo.
4. TeachMeAnatomy no se cita. «Parasternal lymph nodes», «Intercostal lymph nodes», «Superior diaphragmatic lymph nodes», «Tracheobronchial lymph nodes» y «Thoracic lymph nodes» incorporan texto de dominio público del Gray de 1918.
5. Las frases «En este modelo» con números (nodos por pieza, vaso más próximo, distancia a los vasos torácicos internos) salen de las medidas de la construcción: `build/linfatico/nodos-{male,female}.json` y `relaciones-{male,female}.json` (12 nov 2026). Hombre y mujer tienen los mismos recuentos.

## Decisiones y límites declarados

- **Sin fuente propia**: Wikipedia en inglés y en español no tiene artículo de los nodos mediastínicos anteriores ni posteriores, ni de los braquiocefálicos, prepericárdicos, pericárdicos laterales, yuxtaesofágicos o prevertebrales. De esos grupos solo se afirma la nomenclatura de la TA2 (y el sitio que indica el nombre: «junto al esófago», «delante de la columna vertebral», «junto al ligamento arterioso», «en el arco de la ácigos») y lo que las fuentes dicen de su reparo. No se equiparan los grupos de la TA2 con los «mediastínicos anteriores/posteriores» del Gray sin una fuente que lo diga.
- **Pendientes**: braquiocefálicos (localización, reparo, drenaje); nodo del ligamento arterioso y nodo del arco de la ácigos (aferentes y eferentes); prepericárdicos y pericárdicos laterales (los cuatro campos); yuxtaesofágicos (aferentes y eferentes); prevertebrales (reparo, aferentes y eferentes).
- **Traqueobronquiales**: la fuente describe tres nodos (superior derecho, superior izquierdo e inferior); el modelo tiene 5 superiores y 10 inferiores. Los aferentes y eferentes se dan para el conjunto traqueobronquial, que en la fuente incluye a los paratraqueales; el orden en cadena intrapulmonares → traqueobronquiales inferiores → superiores → paratraqueales → tronco broncomediastínico es del modelo, no de la fuente.
- **Broncopulmonares (hiliares)**: no están en Z-Anatomy ni en el modelo; la ficha de los intrapulmonares lo dice.
- **Intercostales**: la fuente lleva los eferentes de los espacios superiores derechos al conducto linfático derecho; en el modelo, los colectores de los dos lados van al conducto torácico.
- **Latín**: «Nodi prepericadiaci» (TA2 y Z-Anatomy) se muestra corregido como «Nodi prepericardiaci» (`latinLinf` en `formato.js`). Los dos nodos de nombre entre paréntesis en la TA2 (ligamento arterioso, n.º 5256; arco de la ácigos, n.º 5257) no tienen latín en el modelo.

## Páginas

- `wp:Aortopulmonary_space`: «Aortopulmonary space», revisión 1322882928 (https://en.wikipedia.org/w/index.php?title=Aortopulmonary_space&oldid=1322882928), consultada 2026-11-13, CC BY-SA 4.0
- `wp:Azygos_vein`: «Azygos vein», revisión 1360614728 (https://en.wikipedia.org/w/index.php?title=Azygos_vein&oldid=1360614728), consultada 2026-11-10, CC BY-SA 4.0
- `wp:Breast`: «Breast», revisión 1377856311 (https://en.wikipedia.org/w/index.php?title=Breast&oldid=1377856311), consultada 2026-11-13, CC BY-SA 4.0
- `wp:Heart`: «Heart», revisión 1383668909 (https://en.wikipedia.org/w/index.php?title=Heart&oldid=1383668909), consultada 2026-11-09, CC BY-SA 4.0
- `wp:Intercostal_lymph_nodes`: «Intercostal lymph nodes», revisión 1224153313 (https://en.wikipedia.org/w/index.php?title=Intercostal_lymph_nodes&oldid=1224153313), consultada 2026-11-10, CC BY-SA 4.0
- `wp:Intercostal_space`: «Intercostal space», revisión 1380893068 (https://en.wikipedia.org/w/index.php?title=Intercostal_space&oldid=1380893068), consultada 2026-11-10, CC BY-SA 4.0
- `wp:Internal_thoracic_artery`: «Internal thoracic artery», revisión 1365849262 (https://en.wikipedia.org/w/index.php?title=Internal_thoracic_artery&oldid=1365849262), consultada 2026-11-10, CC BY-SA 4.0
- `wp:Ligamentum_arteriosum`: «Ligamentum arteriosum», revisión 1380878967 (https://en.wikipedia.org/w/index.php?title=Ligamentum_arteriosum&oldid=1380878967), consultada 2026-11-10, CC BY-SA 4.0
- `wp:List_of_lymph_nodes_of_the_human_body`: «List of lymph nodes of the human body», revisión 1321358933 (https://en.wikipedia.org/w/index.php?title=List_of_lymph_nodes_of_the_human_body&oldid=1321358933), consultada 2026-11-10, CC BY-SA 4.0
- `wp:Lung`: «Lung», revisión 1383783274 (https://en.wikipedia.org/w/index.php?title=Lung&oldid=1383783274), consultada 2026-11-09, CC BY-SA 4.0
- `wp:Lung_cancer_staging`: «Lung cancer staging», revisión 1343459078 (https://en.wikipedia.org/w/index.php?title=Lung_cancer_staging&oldid=1343459078), consultada 2026-11-13, CC BY-SA 4.0
- `wp:Parasternal_lymph_nodes`: «Parasternal lymph nodes», revisión 1224153266 (https://en.wikipedia.org/w/index.php?title=Parasternal_lymph_nodes&oldid=1224153266), consultada 2026-11-10, CC BY-SA 4.0
- `wp:Root_of_the_lung`: «Root of the lung», revisión 1339854779 (https://en.wikipedia.org/w/index.php?title=Root_of_the_lung&oldid=1339854779), consultada 2026-11-13, CC BY-SA 4.0
- `wp:Superior_diaphragmatic_lymph_nodes`: «Superior diaphragmatic lymph nodes», revisión 1315200480 (https://en.wikipedia.org/w/index.php?title=Superior_diaphragmatic_lymph_nodes&oldid=1315200480), consultada 2026-11-10, CC BY-SA 4.0
- `wp:Thoracic_lymph_nodes`: «Thoracic lymph nodes», revisión 1379260096 (https://en.wikipedia.org/w/index.php?title=Thoracic_lymph_nodes&oldid=1379260096), consultada 2026-11-12, CC BY-SA 4.0
- `wp:Trachea`: «Trachea», revisión 1381221726 (https://en.wikipedia.org/w/index.php?title=Trachea&oldid=1381221726), consultada 2026-11-13, CC BY-SA 4.0
- `wp:Tracheobronchial_lymph_nodes`: «Tracheobronchial lymph nodes», revisión 1380892676 (https://en.wikipedia.org/w/index.php?title=Tracheobronchial_lymph_nodes&oldid=1380892676), consultada 2026-11-10, CC BY-SA 4.0
- `wpes:Carina_de_la_tráquea`: «Carina de la tráquea», revisión 172162372 (https://es.wikipedia.org/w/index.php?title=Carina_de_la_tr%C3%A1quea&oldid=172162372), consultada 2026-11-13, CC BY-SA 4.0

## Fichas

### Parasternal_nodes

Nombre: TA2 n.º 5250.

- **Qué es**: Los nodos (ganglios) paraesternales, también llamados esternales, son nodos de la pared anterior del tórax, junto al esternón. — wp:Parasternal_lymph_nodes «The parasternal lymph nodes (or sternal glands)»; wp:Breast «the parasternal nodes (beside the sternum bone)»
- **Qué es**: La Terminologia Anatomica 2 los cuenta entre los nodos (ganglios) parietales del tórax, los que están en la pared torácica. — TA2 n.º 5248; wp:Thoracic_lymph_nodes «the former being situated in the thoracic wall»
- **Localización**: Están en el extremo anterior de los espacios intercostales, al lado de la arteria torácica interna. — wp:Parasternal_lymph_nodes «are placed at the anterior ends of the intercostal spaces, by the side of the internal thoracic artery»
- **Reparo**: La arteria torácica interna, que baja por dentro de la caja torácica a alrededor de 1 cm del borde del esternón; esa distancia crece hacia abajo, hasta 1,1–1,3 cm en el sexto espacio intercostal. — wp:Parasternal_lymph_nodes «by the side of the internal thoracic artery»; wp:Internal_thoracic_artery «It travels downward on the inside of the rib cage, approximately 1 cm from the sides of the sternum»; wp:Internal_thoracic_artery «The gap between the artery and lateral border of the sternum increases when going downwards, up to 1.1 cm to 1.3 cm at the sixth intercostal space.»
- **Recibe**: Reciben aferentes de la mama, de las partes profundas de la pared anterior del abdomen por encima del ombligo, de la cara superior del hígado (a través de un pequeño grupo de nodos situado detrás de la apófisis xifoides) y de las partes profundas de la pared anterior del tórax. — wp:Parasternal_lymph_nodes «They derive afferents from the mamma; from the deeper structures of the anterior abdominal wall above the level of the umbilicus; from the upper surface of the liver through a small group of glands which lie behind the xiphoid process; and from the deeper parts of the anterior portion of the thoracic wall.»
- **Recibe**: Alrededor del 25 % de la linfa de la mama va a los nodos paraesternales; el 75 % va a los nodos axilares del mismo lado. — wp:Breast «Approximately 75% of the lymph from the breast travels to the axillary lymph nodes on the same side of the body, while 25% of the lymph travels to the parasternal nodes (beside the sternum bone).»
- **Recibe**: También les llegan los eferentes del grupo anterior de los nodos diafragmáticos superiores. — wp:Superior_diaphragmatic_lymph_nodes «The efferent vessels of the anterior set pass to the parasternal lymph nodes.»
- **Drena en**: Sus eferentes suelen unirse en un solo tronco a cada lado, que puede abrirse directamente en la unión de la yugular interna y la subclavia; el derecho puede unirse también al tronco subclavio derecho y el izquierdo, al conducto torácico. — wp:Parasternal_lymph_nodes «Their efferents usually unite to form a single trunk on either side; this may open directly into the junction of the internal jugular and subclavian veins, or that of the right side may join the right subclavian trunk, and that of the left the thoracic duct.»
- **Drena en**: Drenan en los troncos broncomediastínicos, como los nodos intercostales superiores. — wp:Parasternal_lymph_nodes «The parasternal lymph nodes drain into the bronchomediastinal trunks, in a similar fashion to the upper intercostal lymph nodes.»
- **En este modelo**: En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real. — *Modelo 3D*
- **En este modelo**: En este modelo hay ocho nodos a cada lado, todos a 5 mm o menos de la arteria o las venas torácicas internas, en el hombre y en la mujer. — *Modelo 3D*
- **En este modelo**: En este modelo sus colectores esquemáticos llevan la linfa al tronco broncomediastínico de su lado. — *Modelo 3D*
- *vías*: recibe: Superior_diaphragmatic_nodes; drena: Bronchomediastinal_trunk, Subclavian_trunk, Thoracic_duct

### Intercostal_nodes

Nombre: TA2 n.º 5251.

- **Qué es**: Los nodos (ganglios) intercostales son nodos de la pared posterior del tórax, dentro de los espacios intercostales. — wp:Intercostal_lymph_nodes «The intercostal lymph nodes (intercostal glands) occupy the posterior parts of the intercostal spaces»; wp:Intercostal_space «intercostal lymph nodes»
- **Qué es**: La Terminologia Anatomica 2 los cuenta entre los nodos (ganglios) parietales del tórax, los que están en la pared torácica. — TA2 n.º 5248; wp:Thoracic_lymph_nodes «the former being situated in the thoracic wall»
- **Localización**: Ocupan la parte posterior de los espacios intercostales, junto a los vasos intercostales. — wp:Intercostal_lymph_nodes «occupy the posterior parts of the intercostal spaces, in relation to the intercostal vessels»
- **Reparo**: Los vasos intercostales, en la parte posterior de cada espacio. — wp:Intercostal_lymph_nodes «in relation to the intercostal vessels»
- **Reparo**: En cada espacio, el paquete vasculonervioso va entre los músculos intercostal interno e íntimo, con la vena arriba, la arteria en medio y el nervio abajo. — wp:Intercostal_space «Neurovascular bundles are located between the internal intercostal muscle and the innermost intercostal muscle.»; wp:Intercostal_space «The neurovascular bundle has a strict order of vein-artery-nerve (VAN), from top to bottom.»
- **Recibe**: Reciben los linfáticos profundos de la cara posterolateral del tórax; algunos de esos vasos pasan antes por pequeños nodos intercostales laterales. — wp:Intercostal_lymph_nodes «They receive the deep lymphatics from the postero-lateral aspect of the chest; some of these vessels are interrupted by small lateral intercostal glands.»
- **Drena en**: Los eferentes de los nodos de los cuatro o cinco espacios inferiores se unen en un tronco que baja y se abre en la cisterna del quilo o en el comienzo del conducto torácico. — wp:Intercostal_lymph_nodes «The efferents of the glands in the lower four or five spaces unite to form a trunk, which descends and opens either into the cisterna chyli or into the commencement of the thoracic duct.»
- **Drena en**: Los de los espacios superiores terminan, en el lado izquierdo, en el conducto torácico y, en el derecho, en el conducto linfático derecho. — wp:Intercostal_lymph_nodes «The efferents of the glands in the upper spaces of the left side end in the thoracic duct; those of the corresponding right spaces, in the right lymphatic duct.»
- **Drena en**: La página de los nodos paraesternales dice además que los intercostales superiores drenan, como ellos, en los troncos broncomediastínicos. — wp:Parasternal_lymph_nodes «The parasternal lymph nodes drain into the bronchomediastinal trunks, in a similar fashion to the upper intercostal lymph nodes.»
- **En este modelo**: En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real. — *Modelo 3D*
- **En este modelo**: En este modelo hay doce nodos a cada lado. — *Modelo 3D*
- **En este modelo**: En este modelo los colectores esquemáticos de los dos lados llevan la linfa al conducto torácico; la terminación de los espacios superiores derechos en el conducto linfático derecho no se representa. — *Modelo 3D*
- *vías*: drena: Thoracic_duct, Cisterna_chyli, Right_lymphatic_duct, Bronchomediastinal_trunk

### Superior_diaphragmatic_nodes

Nombre: TA2 n.º 5253.

- **Qué es**: Los nodos (ganglios) diafragmáticos superiores están sobre la cara torácica del diafragma y forman tres grupos: anterior, medio y posterior. — wp:Superior_diaphragmatic_lymph_nodes «lie on the thoracic aspect of the diaphragm, and consist of three sets – anterior, middle, and posterior»
- **Qué es**: La Terminologia Anatomica 2 los cuenta entre los nodos parietales del tórax. — TA2 n.º 5248; TA2 n.º 5253
- **Localización**: El grupo anterior tiene dos o tres nodos pequeños detrás de la base de la apófisis xifoides y uno o dos a cada lado, cerca de la unión de la séptima costilla con su cartílago. — wp:Superior_diaphragmatic_lymph_nodes «two or three small nodes behind the base of the xiphoid process»; wp:Superior_diaphragmatic_lymph_nodes «one or two nodes on either side near the junction of the seventh rib with its cartilage»
- **Localización**: El grupo medio tiene dos o tres nodos a cada lado, cerca de donde los nervios frénicos entran en el diafragma; en el lado derecho, algunos están dentro del saco fibroso del pericardio, delante de la terminación de la vena cava inferior. — wp:Superior_diaphragmatic_lymph_nodes «The middle set consists of two or three nodes on either side close to where the phrenic nerves enter the diaphragm.»; wp:Superior_diaphragmatic_lymph_nodes «On the right side some of the lymph nodes of this group lie within the fibrous sac of the pericardium, on the front of the termination of the inferior vena cava.»
- **Localización**: El grupo posterior tiene unos pocos nodos en la cara posterior de los pilares del diafragma. — wp:Superior_diaphragmatic_lymph_nodes «The posterior set consists of a few nodes situated on the back of the crura of the diaphragm»
- **Reparo**: La cara superior del diafragma: la apófisis xifoides para el grupo anterior, la entrada de los nervios frénicos y la terminación de la vena cava inferior para el medio, y los pilares del diafragma para el posterior. — wp:Superior_diaphragmatic_lymph_nodes «behind the base of the xiphoid process»; wp:Superior_diaphragmatic_lymph_nodes «close to where the phrenic nerves enter the diaphragm»; wp:Superior_diaphragmatic_lymph_nodes «on the front of the termination of the inferior vena cava»; wp:Superior_diaphragmatic_lymph_nodes «situated on the back of the crura of the diaphragm»
- **Recibe**: Los nodos anteriores de detrás de la apófisis xifoides reciben aferentes de la cara convexa del hígado, y los de junto a la séptima costilla, vasos de la parte anterior del diafragma. — wp:Superior_diaphragmatic_lymph_nodes «which receive afferents from the convex surface of the liver»; wp:Superior_diaphragmatic_lymph_nodes «which receive lymphatic vessels from the front part of the diaphragm»
- **Recibe**: El grupo medio recibe la linfa de la parte media del diafragma; los nodos del lado derecho reciben también aferentes de la cara convexa del hígado. — wp:Superior_diaphragmatic_lymph_nodes «The afferents of this set are derived from the middle part of the diaphragm, those on the right side also receiving afferents from the convex surface of the liver.»
- **Drena en**: Los eferentes del grupo anterior van a los nodos paraesternales. — wp:Superior_diaphragmatic_lymph_nodes «The efferent vessels of the anterior set pass to the parasternal lymph nodes.»
- **Drena en**: Los del grupo medio van a los nodos mediastínicos posteriores. — wp:Superior_diaphragmatic_lymph_nodes «Their efferents pass to the posterior mediastinal lymph nodes.»
- **Drena en**: El grupo posterior está conectado, por un lado, con los nodos lumbares y, por el otro, con los mediastínicos posteriores. — wp:Superior_diaphragmatic_lymph_nodes «connected on one side with the lumbar lymph nodes and on the other with the posterior mediastinal nodes»
- **En este modelo**: En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real. — *Modelo 3D*
- **En este modelo**: En este modelo hay seis nodos sobre el diafragma, la mayoría junto a la porción torácica de la vena cava inferior; el modelo no separa los tres grupos que describe la fuente. — *Modelo 3D*
- **En este modelo**: En este modelo los colectores esquemáticos los unen a los nodos paraesternales y a los yuxtaesofágicos; la fuente habla de nodos mediastínicos posteriores, sin nombrar los yuxtaesofágicos. — *Modelo 3D*
- *vías*: drena: Parasternal_nodes

### Brachiocephalic_nodes

Nombre: TA2 n.º 5255.

- **Qué es**: La Terminologia Anatomica 2 los cuenta entre los nodos (ganglios) mediastínicos. — TA2 n.º 5254; TA2 n.º 5255
- **Qué es**: Los nodos del mediastino forman varios grupos, sobre todo a lo largo de la tráquea, a lo largo del esófago y entre el pulmón y el diafragma. — wp:List_of_lymph_nodes_of_the_human_body «especially along the trachea (5 groups), along the esophagus and between the lung and the diaphragm»
- **Localización**: *pendiente* — Ninguna fuente libre consultada (Wikipedia en inglés y en español) lo describe para este grupo.
- **Reparo**: *pendiente* — Ninguna fuente libre consultada (Wikipedia en inglés y en español) lo describe para este grupo.
- **Recibe**: Les llega el colector linfático derecho del corazón: recorre la aurícula derecha y la parte del ventrículo derecho que se apoya en el diafragma, suele pasar por delante de la aorta ascendente y termina en un nodo braquiocefálico. — wp:Heart «The right vessel travels along the right atrium and the part of the right ventricle sitting on the diaphragm.»; wp:Heart «It usually then travels in front of the ascending aorta and then ends in a brachiocephalic node.»
- **Drena en**: *pendiente* — Ninguna fuente libre consultada (Wikipedia en inglés y en español) lo describe para este grupo.
- **En este modelo**: En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real. — *Modelo 3D*
- **En este modelo**: En este modelo hay tres nodos, todos junto a la vena braquiocefálica derecha. — *Modelo 3D*
- **En este modelo**: En este modelo sus colectores esquemáticos los unen a los nodos pericárdicos laterales y al tronco broncomediastínico; ninguna fuente consultada describe esa conexión. — *Modelo 3D*

### Node_of_ligamentum_arteriosum

Nombre: TA2 n.º 5256.

- **Qué es**: Nodo (ganglio) mediastínico que la Terminologia Anatomica 2 llama nodo del ligamento arterioso. — TA2 n.º 5254; TA2 n.º 5256
- **Qué es**: En la Terminologia Anatomica 2 su nombre figura entre paréntesis. — TA2 n.º 5256
- **Localización**: Su nombre lo sitúa junto al ligamento arterioso, que está en la ventana aortopulmonar: un pequeño espacio entre el arco aórtico y la arteria pulmonar que contiene el ligamento, el nervio laríngeo recurrente izquierdo, nodos linfáticos y grasa. — TA2 n.º 5256; wp:Aortopulmonary_space «is a small space between the aortic arch and the pulmonary artery»; wp:Aortopulmonary_space «It contains the ligamentum arteriosum, the left recurrent laryngeal nerve, lymph nodes, and fatty tissue.»
- **Localización**: La ventana aortopulmonar está limitada por delante por la aorta ascendente, por detrás por la aorta descendente, por dentro por el bronquio principal izquierdo y por fuera por la pleura mediastínica. — wp:Aortopulmonary_space «The space is bounded anteriorly by the ascending aorta, posteriorly by the descending aorta, medially by the left main bronchus, and laterally by mediastinal pleura.»
- **Reparo**: El ligamento arterioso, resto del conducto arterioso fetal: une el final del arco aórtico (el istmo) o el comienzo de la aorta descendente con la parte alta de la arteria pulmonar izquierda. — wp:Ligamentum_arteriosum «is the remnant of the ductus arteriosus»; wp:Ligamentum_arteriosum «At the superior end, the ligamentum attaches to the aorta—at the final part of the aortic arch (the isthmus of aorta) or the first part of the descending aorta.»; wp:Ligamentum_arteriosum «the ligamentum is attached to the top of the left pulmonary artery»
- **Reparo**: El nervio laríngeo recurrente izquierdo rodea el arco aórtico por detrás del ligamento. — wp:Ligamentum_arteriosum «the left recurrent laryngeal loops around the aortic arch behind the ligamentum arteriosum»
- **Recibe**: *pendiente* — Ninguna fuente libre consultada (Wikipedia en inglés y en español) lo describe para este nodo.
- **Drena en**: *pendiente* — Ninguna fuente libre consultada (Wikipedia en inglés y en español) lo describe para este nodo.
- **En este modelo**: En este modelo el nodo se representa con una forma y un tamaño esquemáticos. — *Modelo 3D*
- **En este modelo**: En este modelo es un solo nodo, junto a la bifurcación del tronco pulmonar. — *Modelo 3D*
- **En este modelo**: En este modelo sus colectores esquemáticos lo unen a los nodos paratraqueales; ninguna fuente consultada describe esa conexión. — *Modelo 3D*
- **Puntos clave**: En la estadificación del cáncer de pulmón, los nodos de la ventana aortopulmonar (subaórticos) forman la estación 5. — wp:Lung_cancer_staging «aorto-pulmonary space (subaortic) lymph nodes (station 5)»
- **Puntos clave**: En la radiografía, una densidad de agua en la ventana aortopulmonar puede indicar nodos aumentados de tamaño o un tumor. — wp:Aortopulmonary_space «The presence of water radiodensity in this space on radiography may indicate a lymphadenopathy or neoplasm is occupying this space.»

### Node_of_arch_of_azygos_vein

Nombre: TA2 n.º 5257.

- **Qué es**: Nodo (ganglio) mediastínico que la Terminologia Anatomica 2 llama nodo del arco de la vena ácigos. — TA2 n.º 5254; TA2 n.º 5257
- **Qué es**: En la Terminologia Anatomica 2 su nombre figura entre paréntesis. — TA2 n.º 5257
- **Localización**: Su nombre lo sitúa en el arco de la vena ácigos, que a la altura de la vértebra T4 pasa por encima de la raíz del pulmón derecho, de atrás adelante, para unirse a la vena cava superior. — TA2 n.º 5257; wp:Azygos_vein «At the level of T4 vertebrae, it arches over the root of the right lung from behind to the front to join the superior vena cava.»
- **Localización**: La tráquea y el esófago quedan por dentro del arco. — wp:Azygos_vein «The trachea and oesophagus is located medially to the arch of the azygous vein.»
- **Reparo**: El arco de la vena ácigos, un reparo anatómico importante, con la raíz del pulmón derecho por debajo. — wp:Azygos_vein «is an important anatomic landmark»; wp:Root_of_the_lung «The root of the right lung lies behind the superior vena cava and part of the right atrium, and below the azygos vein.»
- **Recibe**: *pendiente* — Ninguna fuente libre consultada (Wikipedia en inglés y en español) lo describe para este nodo.
- **Drena en**: *pendiente* — Ninguna fuente libre consultada (Wikipedia en inglés y en español) lo describe para este nodo.
- **En este modelo**: En este modelo el nodo se representa con una forma y un tamaño esquemáticos. — *Modelo 3D*
- **En este modelo**: En este modelo es un solo nodo, junto a la vena ácigos. — *Modelo 3D*
- **En este modelo**: En este modelo sus colectores esquemáticos lo unen a los nodos paratraqueales; ninguna fuente consultada describe esa conexión. — *Modelo 3D*

### Prepericardial_nodes

Nombre: TA2 n.º 5258.

- **Qué es**: La Terminologia Anatomica 2 los cuenta entre los nodos (ganglios) mediastínicos. — TA2 n.º 5254; TA2 n.º 5258
- **Qué es**: Los nodos del mediastino forman varios grupos, sobre todo a lo largo de la tráquea, a lo largo del esófago y entre el pulmón y el diafragma. — wp:List_of_lymph_nodes_of_the_human_body «especially along the trachea (5 groups), along the esophagus and between the lung and the diaphragm»
- **Localización**: *pendiente* — Ninguna fuente libre consultada (Wikipedia en inglés y en español) lo describe para este grupo.
- **Reparo**: *pendiente* — Ninguna fuente libre consultada (Wikipedia en inglés y en español) lo describe para este grupo.
- **Recibe**: *pendiente* — Ninguna fuente libre consultada (Wikipedia en inglés y en español) lo describe para este grupo.
- **Drena en**: *pendiente* — Ninguna fuente libre consultada (Wikipedia en inglés y en español) lo describe para este grupo.
- **En este modelo**: En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real. — *Modelo 3D*
- **En este modelo**: En este modelo hay cuatro nodos en el lado derecho, junto a la vena braquiocefálica derecha, la vena cava superior y los vasos torácicos internos derechos. — *Modelo 3D*
- **En este modelo**: En este modelo sus colectores esquemáticos los unen a los nodos paraesternales; ninguna fuente consultada describe esa conexión. — *Modelo 3D*
- **En este modelo**: El latín «Nodi prepericadiaci» de la TA2 y de Z-Anatomy tiene una errata; la app escribe «Nodi prepericardiaci». — TA2 n.º 5258; *Modelo 3D*

### Lateral_pericardial_nodes

Nombre: TA2 n.º 5259.

- **Qué es**: La Terminologia Anatomica 2 los cuenta entre los nodos (ganglios) mediastínicos. — TA2 n.º 5254; TA2 n.º 5259
- **Qué es**: Los nodos del mediastino forman varios grupos, sobre todo a lo largo de la tráquea, a lo largo del esófago y entre el pulmón y el diafragma. — wp:List_of_lymph_nodes_of_the_human_body «especially along the trachea (5 groups), along the esophagus and between the lung and the diaphragm»
- **Localización**: *pendiente* — Ninguna fuente libre consultada (Wikipedia en inglés y en español) lo describe para este grupo.
- **Reparo**: *pendiente* — Ninguna fuente libre consultada (Wikipedia en inglés y en español) lo describe para este grupo.
- **Recibe**: *pendiente* — Ninguna fuente libre consultada (Wikipedia en inglés y en español) lo describe para este grupo.
- **Drena en**: *pendiente* — Ninguna fuente libre consultada (Wikipedia en inglés y en español) lo describe para este grupo.
- **En este modelo**: En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real. — *Modelo 3D*
- **En este modelo**: En este modelo hay cuatro nodos en el lado derecho, junto a la vena media del pulmón derecho y la porción torácica de la vena cava inferior. — *Modelo 3D*
- **En este modelo**: En este modelo sus colectores esquemáticos los unen a los nodos braquiocefálicos; ninguna fuente consultada describe esa conexión. — *Modelo 3D*

### Paratracheal_thoracic_nodes

Nombre: TA2 n.º 5260.

- **Qué es**: Los nodos (ganglios) paratraqueales del tórax están a los dos lados de la tráquea; la Terminologia Anatomica 2 los distingue de los paratraqueales del cuello. — wp:Tracheobronchial_lymph_nodes «nodes are located on either side of the trachea»; TA2 n.º 5260; TA2 n.º 5222
- **Qué es**: Alrededor de la división de la tráquea y de los bronquios principales hay cuatro grupos principales de nodos: paratraqueales, traqueobronquiales, broncopulmonares y pulmonares. — wp:Tracheobronchial_lymph_nodes «are located around the division of trachea and main bronchi»; wp:Tracheobronchial_lymph_nodes «These lymph nodes form four main groups including paratracheal, tracheobronchial, bronchopulmonary and pulmonary nodes.»
- **Localización**: Están a cada lado de la tráquea. — wp:Tracheobronchial_lymph_nodes «nodes are located on either side of the trachea»; wp:Trachea «paratracheal lymph nodes that lie beside it»
- **Localización**: Los nodos del mediastino forman varios grupos, sobre todo a lo largo de la tráquea, a lo largo del esófago y entre el pulmón y el diafragma. — wp:List_of_lymph_nodes_of_the_human_body «especially along the trachea (5 groups), along the esophagus and between the lung and the diaphragm»
- **Reparo**: La tráquea, a cuyos lados están. — wp:Trachea «paratracheal lymph nodes that lie beside it»
- **Reparo**: A la derecha de la tráquea pasa la vena ácigos, que cruza por encima del bronquio principal derecho a la altura de la carina; el arco aórtico cruza hacia la izquierda de la tráquea. — wpes:Carina_de_la_tráquea «La vena ácigos discurre por el lado derecho de la tráquea, cruzando por encima del bronquio principal derecho a nivel de la carina.»; wpes:Carina_de_la_tráquea «donde el arco aórtico cruza hacia la izquierda de la tráquea»
- **Recibe**: Reciben vasos linfáticos de la tráquea, que drenan en los nodos pretraqueales, delante de ella, y en los paratraqueales, a su lado. — wp:Trachea «The lymphatic vessels of the trachea drain into the pretracheal nodes that lie in front of the trachea, and paratracheal lymph nodes that lie beside it.»
- **Recibe**: Los aferentes del conjunto traqueobronquial drenan los pulmones y los bronquios, la parte torácica de la tráquea y el corazón; a él llegan también algunos eferentes de los nodos mediastínicos posteriores. — wp:Tracheobronchial_lymph_nodes «The afferents of the tracheobronchial glands drain the lungs and bronchi, the thoracic part of the trachea and the heart; some of the efferents of the posterior mediastinal glands also end in this group.»
- **Drena en**: Los eferentes del conjunto traqueobronquial suben sobre la tráquea y se unen con los de los nodos mamarios internos y mediastínicos anteriores para formar los troncos broncomediastínicos derecho e izquierdo. — wp:Tracheobronchial_lymph_nodes «Their efferent vessels ascend upon the trachea and unite with efferents of the internal mammary and anterior mediastinal glands to form the right and left bronchomediastinal trunks.»
- **En este modelo**: En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real. — *Modelo 3D*
- **En este modelo**: En este modelo hay diez nodos, cinco a cada lado de la tráquea, junto al tronco braquiocefálico, la vena braquiocefálica derecha, la carótida común izquierda y el arco aórtico. — *Modelo 3D*
- **En este modelo**: En este modelo los colectores esquemáticos encadenan intrapulmonares, traqueobronquiales inferiores, traqueobronquiales superiores y paratraqueales hasta el tronco broncomediastínico; la fuente describe el drenaje del conjunto, sin ese orden. — *Modelo 3D*
- **Puntos clave**: Para estadificar el cáncer de pulmón, los nodos del tórax se agrupan en catorce estaciones numeradas: las 1 a 9 son del mediastino y las 10 a 14, hiliares y periféricas. — wp:Lung_cancer_staging «There are fourteen numbered nodal stations.»; wp:Lung_cancer_staging «Lymph nodes considered to be in the mediastinum are stations 1–9, which are thus potential N2 or N3 locations, while stations 10-14 are hilar and peripheral nodes, and thus potential N1 locations.»
- *vías*: drena: Bronchomediastinal_trunk

### Superior_tracheobronchial_nodes

Nombre: TA2 n.º 5262.

- **Qué es**: Los traqueobronquiales propiamente dichos son tres: un superior derecho, un superior izquierdo y un inferior. — wp:Tracheobronchial_lymph_nodes «Tracheobronchial nodes can be divided into three nodes including left and right superior tracheobronchial nodes, and the inferior tracheobronchial node.»
- **Qué es**: Alrededor de la división de la tráquea y de los bronquios principales hay cuatro grupos principales de nodos: paratraqueales, traqueobronquiales, broncopulmonares y pulmonares. — wp:Tracheobronchial_lymph_nodes «are located around the division of trachea and main bronchi»; wp:Tracheobronchial_lymph_nodes «These lymph nodes form four main groups including paratracheal, tracheobronchial, bronchopulmonary and pulmonary nodes.»
- **Localización**: Los dos traqueobronquiales superiores están a cada lado de la tráquea, justo antes de su bifurcación. — wp:Tracheobronchial_lymph_nodes «The two superior tracheobronchial nodes are located on either side of trachea just before its bifurcation.»
- **Reparo**: La carina, la cresta que separa las entradas de los dos bronquios principales, está en el extremo inferior de la tráquea, en general a la altura del plano que pasa por detrás por el disco entre T4 y T5 y por delante por el ángulo del esternón. — wpes:Carina_de_la_tráquea «que separa las aberturas de los bronquios principales izquierdo y derecho»; wpes:Carina_de_la_tráquea «La carina se sitúa en el extremo inferior de la tráquea, generalmente a la altura del plano torácico transverso»; wpes:Carina_de_la_tráquea «el disco intervertebral entre las vértebras torácicas T4 y T5»; wpes:Carina_de_la_tráquea «el segundo cartílago costal y el ángulo de Louis»
- **Reparo**: A la derecha de la tráquea pasa la vena ácigos, que cruza por encima del bronquio principal derecho a la altura de la carina; el arco aórtico cruza hacia la izquierda de la tráquea. — wpes:Carina_de_la_tráquea «La vena ácigos discurre por el lado derecho de la tráquea, cruzando por encima del bronquio principal derecho a nivel de la carina.»; wpes:Carina_de_la_tráquea «donde el arco aórtico cruza hacia la izquierda de la tráquea»
- **Recibe**: Los aferentes del conjunto traqueobronquial drenan los pulmones y los bronquios, la parte torácica de la tráquea y el corazón; a él llegan también algunos eferentes de los nodos mediastínicos posteriores. — wp:Tracheobronchial_lymph_nodes «The afferents of the tracheobronchial glands drain the lungs and bronchi, the thoracic part of the trachea and the heart; some of the efferents of the posterior mediastinal glands also end in this group.»
- **Drena en**: Los eferentes del conjunto traqueobronquial suben sobre la tráquea y se unen con los de los nodos mamarios internos y mediastínicos anteriores para formar los troncos broncomediastínicos derecho e izquierdo. — wp:Tracheobronchial_lymph_nodes «Their efferent vessels ascend upon the trachea and unite with efferents of the internal mammary and anterior mediastinal glands to form the right and left bronchomediastinal trunks.»
- **En este modelo**: En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real. — *Modelo 3D*
- **En este modelo**: En este modelo hay cinco nodos, tres a la derecha y dos a la izquierda, junto a la vena cava superior y el arco aórtico; la fuente habla de un nodo a cada lado. — *Modelo 3D*
- **En este modelo**: En este modelo los colectores esquemáticos encadenan intrapulmonares, traqueobronquiales inferiores, traqueobronquiales superiores y paratraqueales hasta el tronco broncomediastínico; la fuente describe el drenaje del conjunto, sin ese orden. — *Modelo 3D*
- *vías*: drena: Bronchomediastinal_trunk

### Inferior_tracheobronchial_nodes

Nombre: TA2 n.º 5263.

- **Qué es**: Los traqueobronquiales propiamente dichos son tres: un superior derecho, un superior izquierdo y un inferior. — wp:Tracheobronchial_lymph_nodes «Tracheobronchial nodes can be divided into three nodes including left and right superior tracheobronchial nodes, and the inferior tracheobronchial node.»
- **Qué es**: Alrededor de la división de la tráquea y de los bronquios principales hay cuatro grupos principales de nodos: paratraqueales, traqueobronquiales, broncopulmonares y pulmonares. — wp:Tracheobronchial_lymph_nodes «are located around the division of trachea and main bronchi»; wp:Tracheobronchial_lymph_nodes «These lymph nodes form four main groups including paratracheal, tracheobronchial, bronchopulmonary and pulmonary nodes.»
- **Localización**: El traqueobronquial inferior está justo debajo de la bifurcación de la tráquea, en el ángulo entre los dos bronquios principales. — wp:Tracheobronchial_lymph_nodes «The inferior tracheobronchial node is located just below the bifurcation in the angle between the two bronchi.»
- **Reparo**: La carina, la cresta que separa las entradas de los dos bronquios principales, está en el extremo inferior de la tráquea, en general a la altura del plano que pasa por detrás por el disco entre T4 y T5 y por delante por el ángulo del esternón. — wpes:Carina_de_la_tráquea «que separa las aberturas de los bronquios principales izquierdo y derecho»; wpes:Carina_de_la_tráquea «La carina se sitúa en el extremo inferior de la tráquea, generalmente a la altura del plano torácico transverso»; wpes:Carina_de_la_tráquea «el disco intervertebral entre las vértebras torácicas T4 y T5»; wpes:Carina_de_la_tráquea «el segundo cartílago costal y el ángulo de Louis»
- **Reparo**: A la derecha de la tráquea pasa la vena ácigos, que cruza por encima del bronquio principal derecho a la altura de la carina; el arco aórtico cruza hacia la izquierda de la tráquea. — wpes:Carina_de_la_tráquea «La vena ácigos discurre por el lado derecho de la tráquea, cruzando por encima del bronquio principal derecho a nivel de la carina.»; wpes:Carina_de_la_tráquea «donde el arco aórtico cruza hacia la izquierda de la tráquea»
- **Recibe**: Los aferentes del conjunto traqueobronquial drenan los pulmones y los bronquios, la parte torácica de la tráquea y el corazón; a él llegan también algunos eferentes de los nodos mediastínicos posteriores. — wp:Tracheobronchial_lymph_nodes «The afferents of the tracheobronchial glands drain the lungs and bronchi, the thoracic part of the trachea and the heart; some of the efferents of the posterior mediastinal glands also end in this group.»
- **Recibe**: Le llega el colector linfático izquierdo del corazón, que recorre la arteria pulmonar y la aurícula izquierda. — wp:Heart «The left vessel joins with this third vessel, and travels along the pulmonary artery and left atrium, ending in the inferior tracheobronchial node.»
- **Drena en**: Los eferentes del conjunto traqueobronquial suben sobre la tráquea y se unen con los de los nodos mamarios internos y mediastínicos anteriores para formar los troncos broncomediastínicos derecho e izquierdo. — wp:Tracheobronchial_lymph_nodes «Their efferent vessels ascend upon the trachea and unite with efferents of the internal mammary and anterior mediastinal glands to form the right and left bronchomediastinal trunks.»
- **En este modelo**: En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real. — *Modelo 3D*
- **En este modelo**: En este modelo hay diez nodos, junto a la vena ácigos, el arco aórtico, la arteria pulmonar derecha y la bifurcación del tronco pulmonar; la fuente habla de un solo nodo. — *Modelo 3D*
- **En este modelo**: En este modelo los colectores esquemáticos encadenan intrapulmonares, traqueobronquiales inferiores, traqueobronquiales superiores y paratraqueales hasta el tronco broncomediastínico; la fuente describe el drenaje del conjunto, sin ese orden. — *Modelo 3D*
- **Puntos clave**: El aumento de tamaño de los nodos de la región subcarinal se debe con frecuencia a metástasis. — wpes:Carina_de_la_tráquea «Adenopatías (ganglios linfáticos aumentados de tamaño) en la región subcarinal, frecuentemente por procesos metastásicos.»
- *vías*: drena: Bronchomediastinal_trunk

### Intrapulmonary_nodes

Nombre: TA2 n.º 5267.

- **Qué es**: La Terminologia Anatomica 2 divide los nodos (ganglios) pulmonares en broncopulmonares, en el hilio, e intrapulmonares, dentro del pulmón. — TA2 n.º 5265; TA2 n.º 5266; TA2 n.º 5267; wp:Tracheobronchial_lymph_nodes «Bronchopulmonary nodes (hilar nodes) situate in the hilum of each lung.»
- **Qué es**: Alrededor de la división de la tráquea y de los bronquios principales hay cuatro grupos principales de nodos: paratraqueales, traqueobronquiales, broncopulmonares y pulmonares. — wp:Tracheobronchial_lymph_nodes «are located around the division of trachea and main bronchi»; wp:Tracheobronchial_lymph_nodes «These lymph nodes form four main groups including paratracheal, tracheobronchial, bronchopulmonary and pulmonary nodes.»
- **Localización**: Están dentro del pulmón, sobre las ramas mayores de los bronquios. — wp:Tracheobronchial_lymph_nodes «Pulmonary nodes are embedded the lung substance on the larger branches of the bronchi.»
- **Reparo**: Las ramas mayores de los bronquios dentro del pulmón. — wp:Tracheobronchial_lymph_nodes «on the larger branches of the bronchi»
- **Recibe**: Reciben la linfa del tejido pulmonar, que pasa por nodos subsegmentarios, segmentarios, lobares e interlobares. — wp:List_of_lymph_nodes_of_the_human_body «The lymph is drained from the lung tissue through subsegmental, segmental, lobar and interlobar lymph nodes»
- **Recibe**: La tráquea y los bronquios tienen plexos de capilares linfáticos en la mucosa y la submucosa; los bronquios pequeños tienen una sola capa y en los alvéolos no hay. — wp:Lung «The trachea and bronchi have plexuses of lymph capillaries in their mucosa and submucosa.»; wp:Lung «The smaller bronchi have a single layer of lymph capillaries, and they are absent in the alveoli.»
- **Drena en**: La linfa sigue hacia los nodos hiliares, alrededor del hilio de cada pulmón, y de ahí a los nodos del mediastino. — wp:List_of_lymph_nodes_of_the_human_body «to the hilar lymph nodes, which are located around the hilum»; wp:List_of_lymph_nodes_of_the_human_body «The lymph flows subsequently to the mediastinal lymph nodes.»
- **En este modelo**: En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real. — *Modelo 3D*
- **En este modelo**: En este modelo hay veintitrés nodos repartidos por los dos pulmones, junto a ramas segmentarias de las arterias y venas pulmonares. — *Modelo 3D*
- **En este modelo**: En este modelo no hay nodos broncopulmonares (hiliares), porque Z-Anatomy no los trae; los colectores esquemáticos llevan la linfa de estos nodos directamente a los traqueobronquiales inferiores. — TA2 n.º 5266; *Modelo 3D*
- **Puntos clave**: Para estadificar el cáncer de pulmón, los nodos del tórax se agrupan en catorce estaciones numeradas: las 1 a 9 son del mediastino y las 10 a 14, hiliares y periféricas. — wp:Lung_cancer_staging «There are fourteen numbered nodal stations.»; wp:Lung_cancer_staging «Lymph nodes considered to be in the mediastinum are stations 1–9, which are thus potential N2 or N3 locations, while stations 10-14 are hilar and peripheral nodes, and thus potential N1 locations.»

### Juxta_oesophageal_nodes

Nombre: TA2 n.º 5264.

- **Qué es**: La Terminologia Anatomica 2 los cuenta entre los nodos (ganglios) mediastínicos. — TA2 n.º 5254; TA2 n.º 5264
- **Localización**: Su nombre en la Terminologia Anatomica 2 los sitúa junto al esófago. — TA2 n.º 5264
- **Localización**: Los nodos del mediastino forman varios grupos, sobre todo a lo largo de la tráquea, a lo largo del esófago y entre el pulmón y el diafragma. — wp:List_of_lymph_nodes_of_the_human_body «especially along the trachea (5 groups), along the esophagus and between the lung and the diaphragm»
- **Reparo**: El esófago, al que deben su nombre. — TA2 n.º 5264
- **Recibe**: *pendiente* — Ninguna fuente libre consultada nombra los aferentes de este grupo; «Esophagus» solo dice que el tercio medio del esófago drena en los nodos mediastínicos superiores y posteriores, sin nombrar los yuxtaesofágicos.
- **Drena en**: *pendiente* — Ninguna fuente libre consultada (Wikipedia en inglés y en español) lo describe para este grupo.
- **En este modelo**: En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real. — *Modelo 3D*
- **En este modelo**: En este modelo hay diez nodos en fila vertical cerca de la línea media, junto a la aorta torácica, el arco aórtico, la vena ácigos y las arterias intercostales posteriores. — *Modelo 3D*
- **En este modelo**: En este modelo sus colectores esquemáticos los unen a el conducto torácico; ninguna fuente consultada describe esa conexión. — *Modelo 3D*
- **Puntos clave**: Los nodos del mediastino que hay a lo largo del esófago están muy conectados con los nodos abdominales del esófago y del estómago, lo que facilita la extensión de los cánceres de estómago y, sobre todo, de esófago. — wp:List_of_lymph_nodes_of_the_human_body «The mediastinal lymph nodes along the esophagus are in tight connection with the abdominal lymph nodes along the esophagus and the stomach.»; wp:List_of_lymph_nodes_of_the_human_body «That fact facilitates spreading of tumor cells through these lymphatics in cases of cancers of the stomach and particularly of the esophagus.»

### Prevertebral_nodes

Nombre: TA2 n.º 5252.

- **Qué es**: La Terminologia Anatomica 2 cuenta los nodos (ganglios) prevertebrales entre los nodos parietales del tórax. — TA2 n.º 5248; TA2 n.º 5252
- **Localización**: Su nombre en la Terminologia Anatomica 2 los sitúa delante de la columna vertebral. — TA2 n.º 5252
- **Reparo**: *pendiente* — Ninguna fuente libre consultada (Wikipedia en inglés y en español) lo describe para este grupo.
- **Recibe**: *pendiente* — Ninguna fuente libre consultada (Wikipedia en inglés y en español) lo describe para este grupo.
- **Drena en**: *pendiente* — Ninguna fuente libre consultada (Wikipedia en inglés y en español) lo describe para este grupo.
- **En este modelo**: En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real. — *Modelo 3D*
- **En este modelo**: En este modelo hay diez nodos en fila vertical cerca de la línea media, junto a la aorta torácica, el arco aórtico y las arterias intercostales posteriores. — *Modelo 3D*
- **En este modelo**: En este modelo sus colectores esquemáticos los unen a el conducto torácico; ninguna fuente consultada describe esa conexión. — *Modelo 3D*
