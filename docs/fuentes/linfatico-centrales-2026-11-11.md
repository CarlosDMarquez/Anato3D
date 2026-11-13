---
title: Fuentes de las fichas centrales del sistema linfático
date: 2026-11-11
---

# Fuentes de las fichas centrales del sistema linfático (2026-11-11)

Qué fuente respalda cada frase de las fichas centrales del linfático (`web/src/data/linfatico/centrales.js`): troncos y conductos, cisterna del quilo, colectores regionales, bazo, timo, amígdalas, ficha general del nodo y descripciones de los grupos. La app muestra el número de la fuente tras cada frase y la cita literal al pasar el puntero (`web/src/ui/info.js`, `linfaBody`).

## Cómo se comprobó

1. Las páginas se bajaron con `node scripts/linfatico-citas.mjs bajar …` (Wikipedia en inglés y en español, CC BY-SA 4.0; texto plano de la API, sin recuadros ni pies de imagen) y se registraron con su número de revisión en `web/src/data/linfatico/comprobadas.js`. Si la biblioteca de estudio ya tenía la página, se usó la misma revisión.
2. Cada frase se redactó a partir de una cita literal de esas páginas; `node scripts/linfatico-citas.mjs comprobar` buscó cada cita, palabra por palabra (comillas, guiones y espacios normalizados), en el texto guardado: 258 citas en 47 páginas, 0 sin encontrar.
3. `node scripts/check-cards.mjs` exige que toda frase tenga fuente, que cada cita esté entre las comprobadas, que los números de la TA2 existan en `sources/z-anatomy/TA2.csv` y que «Modelo 3D» solo aparezca en «En este modelo».
4. TeachMeAnatomy no se cita. Las frases marcadas *Modelo 3D* describen el modelo de Anato3D (trazado esquemático, variante elegida, latín formado), no a una persona.

Todo es **borrador** redactado con IA (Claude) a partir de las fuentes citadas, **sin revisión de un especialista**.

## Variantes y esquemas declarados

- Conducto torácico: variante clásica, un solo conducto desde la cisterna del quilo hasta el ángulo venoso izquierdo (la fuente dice que esa anatomía característica solo se da en alrededor de la mitad de las personas).
- Cisterna del quilo: se representa; falta en alrededor de la mitad de las personas.
- Lado derecho: los troncos yugular, subclavio y broncomediastínico derechos se unen en un conducto linfático derecho corto. La fuente dice que el broncomediastínico desemboca con más frecuencia por separado; esa forma no se representa.
- Lado izquierdo: los tres troncos terminan en el final del conducto torácico, junto al ángulo venoso izquierdo.
- Colectores regionales (grupo «Vasos linfáticos»): mallas esquemáticas por región y lado; su latín es descriptivo (la TA2 solo tiene *Vasa lymphatica*, n.º 3915, *Vas lymphaticum superficiale* 3916 y *profundum* 3917).
- Amígdalas faríngea, lingual y tubáricas: si se construyen, son formas generadas y esquemáticas.

Si la geometría representa otra variante, hay que cambiar el campo «En este modelo» y `vias` de las fichas afectadas.

## Latín

- Latín del modelo con erratas heredadas de Z-Anatomy (`latérales`, `paratrachéales`, `prepericadiaci`): se corrige al mostrarlo (`latinLinf` en `formato.js`); los sinónimos de la TA de los axilares e infraclaviculares van tras «;».
- Conducto linfático derecho: *Ductus lymphaticus dexter* (la tabla de Z-Anatomy trae la errata «lymphatlcus»).
- Colectores: latín formado por descripción con palabras de la TA (*Vasa lymphatica capitis*, *colli*, *superficialia/profunda membri superioris*, *parietis thoracis*, *mediastini*, *abdominis*, *pelvis*, *superficialia/profunda membri inferioris*).

## Fichas

### Conducto torácico (`Thoracic_duct`)

Nombre: TA2 n.º 5137.

- **Descripción.** Es el mayor de los dos conductos linfáticos; el otro es el conducto linfático derecho.
  - [Thoracic duct](https://en.wikipedia.org/w/index.php?title=Thoracic_duct&oldid=1360742155): “is the larger of the two lymph ducts of the lymphatic system (the other being the right lymphatic duct)”
- **Descripción.** Recoge la linfa de casi todo el cuerpo: todo salvo el miembro superior derecho y la mitad derecha de la cabeza, el cuello y el tórax, que drenan en el conducto linfático derecho.
  - [Thoracic duct](https://en.wikipedia.org/w/index.php?title=Thoracic_duct&oldid=1360742155): “It also collects most of the lymph in the body other than from the right thorax, arm, head, and neck”
  - [Lymph duct](https://en.wikipedia.org/w/index.php?title=Lymph_duct&oldid=1320936601): “The right lymphatic duct drains lymph from the right upper limb, right side of thorax and right halves of head and neck.”
  - [es: Conducto torácico](https://es.wikipedia.org/w/index.php?title=Conducto_tor%C3%A1cico&oldid=162801800): “recoge la mayor parte de la linfa del cuerpo, exceptuando el cuadrante superior derecho”
- **Descripción.** Lleva quilo, un líquido con linfa y grasas emulsionadas, y no linfa pura.
  - [Thoracic duct](https://en.wikipedia.org/w/index.php?title=Thoracic_duct&oldid=1360742155): “The thoracic duct carries chyle, a liquid containing both lymph and emulsified fats, rather than pure lymph.”
- **Descripción.** En el adulto mide de 38 a 45 cm de largo y unos 5 mm de diámetro medio.
  - [Thoracic duct](https://en.wikipedia.org/w/index.php?title=Thoracic_duct&oldid=1360742155): “In adults, the thoracic duct is typically 38–45 cm in length and has an average diameter of about 5 mm.”
- **Localización.** Empieza en el extremo superior de la cisterna del quilo, a la altura de la vértebra T12.
  - [Thoracic duct](https://en.wikipedia.org/w/index.php?title=Thoracic_duct&oldid=1360742155): “The thoracic duct commences at the upper extremity of the cisterna chyli at the level of the T12 vertebra.”
- **Localización.** Sale del abdomen por el hiato aórtico del diafragma y sube primero por el mediastino posterior y después por el superior, hasta la raíz del cuello.
  - [Thoracic duct](https://en.wikipedia.org/w/index.php?title=Thoracic_duct&oldid=1360742155): “passing out of the abdomen through the aortic hiatus into first the posterior mediastinum and then the superior mediastinum, extending as high up as the root of the neck”
- **Localización.** Hacia la vértebra T5 cruza la línea media hacia la izquierda, y en el cuello sube hasta 2 o 3 cm por encima de la clavícula, a la altura de C7, antes de bajar a su desembocadura.
  - [Thoracic duct](https://en.wikipedia.org/w/index.php?title=Thoracic_duct&oldid=1360742155): “It crosses the midline to the left side at about the T5 level”
  - [Thoracic duct](https://en.wikipedia.org/w/index.php?title=Thoracic_duct&oldid=1360742155): “reaching 2–3 cm superior to the clavicle, as high up as the C7 vertebral level”
- **Reparo.** En el mediastino posterior sube entre la aorta torácica descendente, a su izquierda, y la vena ácigos, a su derecha.
  - [Thoracic duct](https://en.wikipedia.org/w/index.php?title=Thoracic_duct&oldid=1360742155): “It ascends the posterior mediastinum between the descending thoracic aorta (to its left) and the azygos vein (to its right)”
- **Reparo.** A la altura de T7 está detrás del esófago.
  - [Thoracic duct](https://en.wikipedia.org/w/index.php?title=Thoracic_duct&oldid=1360742155): “is situated posterior to the esophagus at the T7 vertebral level”
- **Reparo.** En el cuello pasa por detrás de la arteria carótida común izquierda, del nervio vago y de la vena yugular interna; a la altura de C7 queda por detrás y por fuera de la vaina carotídea.
  - [Thoracic duct](https://en.wikipedia.org/w/index.php?title=Thoracic_duct&oldid=1360742155): “It passes posterior to the left common carotid artery, vagus nerve (CN X), and internal jugular vein.”
  - [Thoracic duct](https://en.wikipedia.org/w/index.php?title=Thoracic_duct&oldid=1360742155): “At C7 level, it lies posterolaterally to the carotid sheath.”
- **Recibe.** Nace de la cisterna del quilo, a la que llegan el tronco intestinal y los dos troncos lumbares.
  - [Cisterna chyli](https://en.wikipedia.org/w/index.php?title=Cisterna_chyli&oldid=1380880257): “into which lymph from the intestinal trunk and two lumbar lymphatic trunks flow”
- **Recibe.** Recibe los vasos de los nodos intercostales: los de los espacios inferiores llegan a la cisterna o al comienzo del conducto, y los de los espacios superiores del lado izquierdo terminan en él.
  - [Intercostal lymph nodes](https://en.wikipedia.org/w/index.php?title=Intercostal_lymph_nodes&oldid=1224153313): “opens either into the cisterna chyli or into the commencement of the thoracic duct”
  - [Intercostal lymph nodes](https://en.wikipedia.org/w/index.php?title=Intercostal_lymph_nodes&oldid=1224153313): “The efferents of the glands in the upper spaces of the left side end in the thoracic duct”
- **Recibe.** En el lado izquierdo pueden unirse a él los troncos yugular, subclavio y broncomediastínico, aunque también pueden desembocar directamente en las venas.
  - [Jugular lymph trunk](https://en.wikipedia.org/w/index.php?title=Jugular_lymph_trunk&oldid=1223570811): “On the left side it joins the thoracic duct.”
  - [Subclavian lymph trunk](https://en.wikipedia.org/w/index.php?title=Subclavian_lymph_trunk&oldid=1224153204): “on the left side it may end in the thoracic duct”
  - [Bronchomediastinal lymph trunk](https://en.wikipedia.org/w/index.php?title=Bronchomediastinal_lymph_trunk&oldid=1304448227): “The left bronchomediastinal lymph trunk often empties into the thoracic duct or directly into the venous angle”
- **Drena en.** Suele desembocar en el ángulo venoso izquierdo, donde la vena subclavia izquierda y la yugular interna izquierda se unen para formar la vena braquiocefálica izquierda.
  - [Thoracic duct](https://en.wikipedia.org/w/index.php?title=Thoracic_duct&oldid=1360742155): “The thoracic duct usually drains into the systemic (blood) circulation at the left venous angle where left subclavian and left internal jugular veins unite to form the left brachiocephalic vein.”
- **Drena en.** En más del 95 % de las personas termina en el ángulo venoso, en la yugular interna o en la subclavia; en una minoría, en otras venas.
  - [Thoracic duct](https://en.wikipedia.org/w/index.php?title=Thoracic_duct&oldid=1360742155): “In over 95% of individuals, the thoracic duct ends by draining either at the venous angle, or into the internal jugular vein, or the subclavian vein”
- **Drena en.** En su unión con la vena tiene dos válvulas que impiden que la sangre entre en el conducto.
  - [Thoracic duct](https://en.wikipedia.org/w/index.php?title=Thoracic_duct&oldid=1360742155): “There are also two valves at the junction of the duct with the left subclavian vein, to prevent the flow of venous blood into the duct.”
- **En este modelo.** En este modelo es un tubo generado para Anato3D (Z-Anatomy no lo incluye) con trazado esquemático: sigue los reparos de las fuentes, pero su recorrido y su grosor no se han medido en una persona.
  - *Modelo 3D (Anato3D)*
- **En este modelo.** Se representa la variante clásica: un solo conducto que nace de la cisterna del quilo y termina en el ángulo venoso izquierdo.
  - *Modelo 3D (Anato3D)*
- **En este modelo.** Esa anatomía característica solo se encuentra en alrededor de la mitad de las personas.
  - [Thoracic duct](https://en.wikipedia.org/w/index.php?title=Thoracic_duct&oldid=1360742155): “The characteristic anatomy of the thoracic duct is present in only about half of individuals.”
- **Puntos clave.** Si se rompe o se bloquea, la linfa se acumula en la cavidad pleural: es el quilotórax.
  - [Thoracic duct](https://en.wikipedia.org/w/index.php?title=Thoracic_duct&oldid=1360742155): “When the duct ruptures, the resulting flood of liquid into the pleural cavity is known as chylothorax.”
- **Puntos clave.** El aumento del nodo de Virchow, un nodo supraclavicular izquierdo cercano a su desembocadura, puede ser la primera señal de un cáncer, sobre todo abdominal.
  - [Thoracic duct](https://en.wikipedia.org/w/index.php?title=Thoracic_duct&oldid=1360742155): “The first sign of a malignancy, especially an intra-abdominal one, may be an enlarged Virchow's node”
- **Puntos clave.** En el adulto transporta hasta 4 litros de linfa al día.
  - [Thoracic duct](https://en.wikipedia.org/w/index.php?title=Thoracic_duct&oldid=1360742155): “In adults, the thoracic duct transports up to 4 L of lymph per day.”
- *Vías (claves)*: recibe Cisterna_chyli, Intercostal_nodes, Jugular_trunk, Subclavian_trunk, Bronchomediastinal_trunk; drena Left_subclavian_vein, Internal_jugular_vein.

### Cisterna del quilo (`Cisterna_chyli`)

Nombre: TA2 n.º 5145.

- **Descripción.** Saco dilatado en el extremo inferior del conducto torácico, al que llega la linfa del tronco intestinal y de los dos troncos lumbares.
  - [Cisterna chyli](https://en.wikipedia.org/w/index.php?title=Cisterna_chyli&oldid=1380880257): “is a dilated sac at the lower end of the thoracic duct in most mammals into which lymph from the intestinal trunk and two lumbar lymphatic trunks flow”
- **Descripción.** Recibe de los intestinos el quilo, rico en grasas.
  - [Cisterna chyli](https://en.wikipedia.org/w/index.php?title=Cisterna_chyli&oldid=1380880257): “It receives fatty chyle from the intestines”
- **Descripción.** Es una estructura retroperitoneal.
  - [Cisterna chyli](https://en.wikipedia.org/w/index.php?title=Cisterna_chyli&oldid=1380880257): “The cisterna chyli is a retroperitoneal structure.”
- **Descripción.** En la Terminologia Anatomica su nombre figura entre paréntesis.
  - TA2 n.º 5145
- **Localización.** Está detrás de la aorta abdominal, sobre la cara anterior de los cuerpos de las vértebras L1 y L2.
  - [Cisterna chyli](https://en.wikipedia.org/w/index.php?title=Cisterna_chyli&oldid=1380880257): “is located posterior to the abdominal aorta on the anterior aspect of the bodies of the first and second lumbar vertebrae (L1 and L2)”
- **Reparo.** La aorta abdominal, por delante, y los cuerpos de L1 y L2, por detrás; de su extremo superior sale el conducto torácico hacia el hiato aórtico del diafragma.
  - [Cisterna chyli](https://en.wikipedia.org/w/index.php?title=Cisterna_chyli&oldid=1380880257): “is located posterior to the abdominal aorta on the anterior aspect of the bodies of the first and second lumbar vertebrae (L1 and L2)”
  - [Cisterna chyli](https://en.wikipedia.org/w/index.php?title=Cisterna_chyli&oldid=1380880257): “There it forms the beginning of the primary lymph vessel, the thoracic duct, which transports lymph and chyle from the abdomen via the aortic opening of the diaphragm”
- **Recibe.** Recibe el tronco intestinal y los troncos lumbares derecho e izquierdo.
  - [es: Cisterna del quilo](https://es.wikipedia.org/w/index.php?title=Cisterna_del_quilo&oldid=159518610): “proveniente de tres vasos linfáticos mayores (el tronco intestinal y los troncos lumbares)”
- **Recibe.** Los troncos lumbares le traen la linfa de los miembros inferiores, de las paredes y las vísceras de la pelvis, de los riñones y de las glándulas suprarrenales.
  - [Lumbar lymph trunk](https://en.wikipedia.org/w/index.php?title=Lumbar_lymph_trunk&oldid=1224154015): “They receive the lymph from the lower limbs, from the walls and viscera of the pelvis, from the kidneys and suprarenal glands”
- **Drena en.** Se continúa hacia arriba con el conducto torácico.
  - [es: Cisterna del quilo](https://es.wikipedia.org/w/index.php?title=Cisterna_del_quilo&oldid=159518610): “se continua superiormente por el conducto torácico”
- **En este modelo.** En este modelo se representa la variante con cisterna, como un saco alargado de forma esquemática generado para Anato3D.
  - *Modelo 3D (Anato3D)*
- **En este modelo.** La cisterna falta en alrededor de la mitad de las personas; en ellas puede haber, en su lugar, una dilatación de los troncos lumbares.
  - [Thoracic duct](https://en.wikipedia.org/w/index.php?title=Thoracic_duct&oldid=1360742155): “A cisterna chyli is absent in about half of individuals”
  - [Thoracic duct](https://en.wikipedia.org/w/index.php?title=Thoracic_duct&oldid=1360742155): “dilation of the lumbar trunks may be present instead”
- *Vías (claves)*: recibe Lumbar_trunk, Intestinal_trunks; drena Thoracic_duct.

### Conducto linfático derecho (`Right_lymphatic_duct`)

Nombre: TA2 n.º 5132. Latín mostrado: *Ductus lymphaticus dexter*.

- **Descripción.** Vaso linfático corto que recoge la linfa del miembro superior derecho y de la mitad derecha del tórax, la cabeza y el cuello.
  - [Lymph duct](https://en.wikipedia.org/w/index.php?title=Lymph_duct&oldid=1320936601): “The right lymphatic duct drains lymph from the right upper limb, right side of thorax and right halves of head and neck.”
- **Descripción.** Mide alrededor de 1,25 cm de largo.
  - [Right lymphatic duct](https://en.wikipedia.org/w/index.php?title=Right_lymphatic_duct&oldid=1380954628): “It is approximately 1.25 cm long.”
- **Descripción.** Todo el resto del cuerpo drena en el conducto torácico.
  - [Right lymphatic duct](https://en.wikipedia.org/w/index.php?title=Right_lymphatic_duct&oldid=1380954628): “All other sections of the human body are drained by the thoracic duct.”
- **Localización.** Está en la raíz del cuello, en el lado derecho, junto a la vena subclavia derecha y la yugular interna derecha.
  - [Right lymphatic duct](https://en.wikipedia.org/w/index.php?title=Right_lymphatic_duct&oldid=1380954628): “courses along the medial border of the anterior scalene at the root of the neck”
  - [Right lymphatic duct](https://en.wikipedia.org/w/index.php?title=Right_lymphatic_duct&oldid=1380954628): “It forms various combinations with the right subclavian vein and right internal jugular vein.”
- **Reparo.** Sigue el borde medial del músculo escaleno anterior.
  - [Right lymphatic duct](https://en.wikipedia.org/w/index.php?title=Right_lymphatic_duct&oldid=1380954628): “courses along the medial border of the anterior scalene”
- **Recibe.** Se forma por la unión de los troncos yugular, subclavio y broncomediastínico derechos.
  - [es: Conducto linfático derecho](https://es.wikipedia.org/w/index.php?title=Conducto_linf%C3%A1tico_derecho&oldid=154492397): “Se forma por la unión de 3 ramas, el tronco yugular, el subclavio y el broncomediastínico derecho.”
- **Recibe.** En algunas personas recibe también linfa del lóbulo inferior del pulmón izquierdo.
  - [Right lymphatic duct](https://en.wikipedia.org/w/index.php?title=Right_lymphatic_duct&oldid=1380954628): “also, in some individuals, the lower lobe of the left lung”
- **Drena en.** Desemboca en el ángulo venoso derecho, la unión de la vena yugular interna y la subclavia derechas.
  - [Venous angle](https://en.wikipedia.org/w/index.php?title=Venous_angle&oldid=1341405227): “the right lymphatic duct drains at the right venous angle”
  - [Venous angle](https://en.wikipedia.org/w/index.php?title=Venous_angle&oldid=1341405227): “is the junction where the ipsilateral internal jugular vein and subclavian vein unite”
- **Drena en.** Su unión con esas venas varía, y es poco frecuente que entre justo en la confluencia.
  - [Right lymphatic duct](https://en.wikipedia.org/w/index.php?title=Right_lymphatic_duct&oldid=1380954628): “A right lymphatic duct that enters directly into the junction of the internal jugular and subclavian veins is uncommon.”
- **En este modelo.** En este modelo los tres troncos derechos se unen en un conducto linfático derecho corto que termina en el ángulo venoso derecho: es una variante elegida para enseñar, generada para Anato3D y de trazado esquemático.
  - *Modelo 3D (Anato3D)*
- **En este modelo.** Los troncos derechos también pueden desembocar por separado en las venas, y en el caso del broncomediastínico eso es lo más frecuente.
  - [Bronchomediastinal lymph trunk](https://en.wikipedia.org/w/index.php?title=Bronchomediastinal_lymph_trunk&oldid=1304448227): “more frequently, they open independently into the junction of the internal jugular vein and subclavian veins”
- **En este modelo.** El latín del modelo corrige una errata de la tabla de la Terminologia que usa Z-Anatomy («lymphatlcus»).
  - TA2 n.º 5132
  - *Modelo 3D (Anato3D)*
- *Vías (claves)*: recibe Jugular_trunk, Subclavian_trunk, Bronchomediastinal_trunk; drena Right_subclavian_vein, Internal_jugular_vein.

### Tronco yugular (`Jugular_trunk`)

Nombre: TA2 n.º 5133, 5140.

- **Descripción.** Tronco linfático del cuello, uno a cada lado, que lleva la linfa de la cabeza y el cuello de su lado.
  - [Deep cervical lymph nodes](https://en.wikipedia.org/w/index.php?title=Deep_cervical_lymph_nodes&oldid=1322812686): “All lymphatic vessels of the head and neck ultimately drain to the deep cervical lymph nodes”
  - [Deep cervical lymph nodes](https://en.wikipedia.org/w/index.php?title=Deep_cervical_lymph_nodes&oldid=1322812686): “Efferents of the deep cervical lymph nodes form the ipsilateral jugular trunk.”
- **Descripción.** Lo forman los vasos que salen de los nodos cervicales profundos superiores al unirse con los eferentes de los inferiores.
  - [Jugular lymph trunk](https://en.wikipedia.org/w/index.php?title=Jugular_lymph_trunk&oldid=1223570811): “It is formed by vessels that emerge from the superior deep cervical lymph nodes and unite to efferents of the inferior deep cervical lymph nodes.”
- **Localización.** Está en el cuello, al final de la cadena cervical profunda, que acompaña a la vena yugular interna dentro de la vaina carotídea.
  - [Deep cervical lymph nodes](https://en.wikipedia.org/w/index.php?title=Deep_cervical_lymph_nodes&oldid=1322812686): “form a chain along the internal jugular vein within the carotid sheath”
  - [Deep cervical lymph nodes](https://en.wikipedia.org/w/index.php?title=Deep_cervical_lymph_nodes&oldid=1322812686): “Efferents of the deep cervical lymph nodes form the ipsilateral jugular trunk.”
- **Reparo.** La vena yugular interna: la cadena de nodos que lo forma va a lo largo de ella.
  - [Deep cervical lymph nodes](https://en.wikipedia.org/w/index.php?title=Deep_cervical_lymph_nodes&oldid=1322812686): “form a chain along the internal jugular vein within the carotid sheath”
- **Recibe.** Recibe los eferentes de los nodos cervicales profundos, a los que acaban llegando todos los vasos linfáticos de la cabeza y el cuello, directamente o a través de otros nodos.
  - [Deep cervical lymph nodes](https://en.wikipedia.org/w/index.php?title=Deep_cervical_lymph_nodes&oldid=1322812686): “All lymphatic vessels of the head and neck ultimately drain to the deep cervical lymph nodes - either by way of other lymph nodes or directly from tissues.”
- **Drena en.** En el lado derecho termina en el ángulo venoso, la unión de la yugular interna y la subclavia; en el izquierdo se une al conducto torácico.
  - [Jugular lymph trunk](https://en.wikipedia.org/w/index.php?title=Jugular_lymph_trunk&oldid=1223570811): “On the right side, this trunk ends in the junction of the internal jugular and subclavian veins, called the venous angle.”
  - [Jugular lymph trunk](https://en.wikipedia.org/w/index.php?title=Jugular_lymph_trunk&oldid=1223570811): “On the left side it joins the thoracic duct.”
- **Drena en.** En el lado derecho también se describe como una de las tres ramas que forman el conducto linfático derecho.
  - [es: Conducto linfático derecho](https://es.wikipedia.org/w/index.php?title=Conducto_linf%C3%A1tico_derecho&oldid=154492397): “Se forma por la unión de 3 ramas, el tronco yugular, el subclavio y el broncomediastínico derecho.”
- **En este modelo.** En este modelo es un tubo de trazado esquemático junto a la vena yugular interna, generado para Anato3D. Variante elegida: el derecho termina en el conducto linfático derecho y el izquierdo en el final del conducto torácico, junto al ángulo venoso izquierdo.
  - *Modelo 3D (Anato3D)*
- **En este modelo.** El nombre latino del modelo es la forma breve; la Terminologia Anatomica 2 lo llama Truncus lymphaticus jugularis dexter o sinister.
  - TA2 n.º 5133
  - TA2 n.º 5140
  - *Modelo 3D (Anato3D)*
- *Vías (claves)*: recibe Lateral_superior_jugular_node, Inferior_deep_lateral_cervical_nodes, Anterior_inferior_jugular_nodes; drena Right_lymphatic_duct, Thoracic_duct.

### Tronco subclavio (`Subclavian_trunk`)

Nombre: TA2 n.º 5134, 5141.

- **Descripción.** Tronco linfático, uno a cada lado, que lleva la linfa del miembro superior y de la axila.
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “and the vessels from the upper limb”
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “The apical nodes drain into the subclavian lymph trunk.”
- **Descripción.** Lo forman los eferentes del grupo apical (subclavicular) de los nodos axilares.
  - [Subclavian lymph trunk](https://en.wikipedia.org/w/index.php?title=Subclavian_lymph_trunk&oldid=1224153204): “The efferent vessels of the subclavicular group unite to form the subclavian trunk”
- **Localización.** Va desde el vértice de la axila, donde están los nodos apicales, hasta las grandes venas de la raíz del cuello.
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “Lying at the apex of the axilla at the lateral border of the 1st rib”
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “the lymph trunks may drain directly into one of the large veins at the root of the neck”
- **Reparo.** La primera costilla: los nodos apicales que lo forman están en su borde lateral, en el vértice de la axila.
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “Lying at the apex of the axilla at the lateral border of the 1st rib”
- **Recibe.** Recibe la linfa de los nodos apicales, que a su vez reciben los eferentes de todos los demás nodos axilares.
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “these nodes receive the efferent lymph vessels from all the other axillary nodes”
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “The apical nodes drain into the subclavian lymph trunk.”
- **Drena en.** Puede abrirse directamente en la unión de la yugular interna y la subclavia o en el tronco yugular; en el lado izquierdo puede terminar en el conducto torácico.
  - [Subclavian lymph trunk](https://en.wikipedia.org/w/index.php?title=Subclavian_lymph_trunk&oldid=1224153204): “which opens either directly into the junction of the internal jugular and subclavian veins or into the jugular lymphatic trunk; on the left side it may end in the thoracic duct”
- **Drena en.** En el lado derecho drena en el conducto linfático derecho.
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “on the right side, it drains into the right lymphatic duct”
- **En este modelo.** En este modelo es un tubo de trazado esquemático generado para Anato3D, desde los nodos axilares apicales hasta el ángulo venoso de su lado. Variante elegida: el derecho termina en el conducto linfático derecho y el izquierdo en el final del conducto torácico.
  - *Modelo 3D (Anato3D)*
- **En este modelo.** El nombre latino del modelo es la forma breve; la Terminologia Anatomica 2 lo llama Truncus lymphaticus subclavius dexter o sinister.
  - TA2 n.º 5134
  - TA2 n.º 5141
  - *Modelo 3D (Anato3D)*
- *Vías (claves)*: recibe Apical_axillary_nodes; drena Right_lymphatic_duct, Thoracic_duct.

### Tronco broncomediastínico (`Bronchomediastinal_trunk`)

Nombre: TA2 n.º 5135, 5136.

- **Descripción.** Tronco linfático del tórax, normalmente uno a cada lado, que recoge la linfa de los nodos traqueobronquiales, paraesternales (mamarios internos) y mediastínicos anteriores.
  - [Bronchomediastinal lymph trunk](https://en.wikipedia.org/w/index.php?title=Bronchomediastinal_lymph_trunk&oldid=1304448227): “tasked with draining lymph from the tracheobronchial, internal mammary, and anterior mediastinal lymph nodes”
  - [Bronchomediastinal lymph trunk](https://en.wikipedia.org/w/index.php?title=Bronchomediastinal_lymph_trunk&oldid=1304448227): “Typically, there are two trunks - one on each side of the body.”
- **Descripción.** Por esos nodos le llega la linfa del corazón, los pulmones, la tráquea y la pleura.
  - [Bronchomediastinal lymph trunk](https://en.wikipedia.org/w/index.php?title=Bronchomediastinal_lymph_trunk&oldid=1304448227): “drain lymph from the heart, lungs, trachea, and pleura”
- **Localización.** Está en el mediastino: cada tronco va, por el lado, desde la abertura superior del tórax hasta la raíz del cuello.
  - [Bronchomediastinal lymph trunk](https://en.wikipedia.org/w/index.php?title=Bronchomediastinal_lymph_trunk&oldid=1304448227): “Each trunk extends from the thoracic inlet to the root of the neck, positioned laterally.”
- **Reparo.** La tráquea: los vasos eferentes que lo forman suben sobre ella.
  - [Tracheobronchial lymph nodes](https://en.wikipedia.org/w/index.php?title=Tracheobronchial_lymph_nodes&oldid=1380892676): “Their efferent vessels ascend upon the trachea”
- **Recibe.** Se forma al unirse los eferentes de los nodos traqueobronquiales con los de los nodos mamarios internos (paraesternales) y mediastínicos anteriores.
  - [Tracheobronchial lymph nodes](https://en.wikipedia.org/w/index.php?title=Tracheobronchial_lymph_nodes&oldid=1380892676): “unite with efferents of the internal mammary and anterior mediastinal glands to form the right and left bronchomediastinal trunks”
- **Recibe.** Los nodos paraesternales drenan en él.
  - [Parasternal lymph nodes](https://en.wikipedia.org/w/index.php?title=Parasternal_lymph_nodes&oldid=1224153266): “The parasternal lymph nodes drain into the bronchomediastinal trunks”
- **Drena en.** El derecho puede unirse al conducto linfático derecho y el izquierdo al conducto torácico, pero lo más frecuente es que cada uno se abra por separado en la unión de la yugular interna y la subclavia de su lado.
  - [Bronchomediastinal lymph trunk](https://en.wikipedia.org/w/index.php?title=Bronchomediastinal_lymph_trunk&oldid=1304448227): “The right bronchomediastinal trunk may connect the right lymphatic duct, and the left trunk to the thoracic duct”
  - [Bronchomediastinal lymph trunk](https://en.wikipedia.org/w/index.php?title=Bronchomediastinal_lymph_trunk&oldid=1304448227): “more frequently, they open independently into the junction of the internal jugular vein and subclavian veins”
- **En este modelo.** En este modelo es un tubo de trazado esquemático generado para Anato3D. Variante elegida: el derecho termina en el conducto linfático derecho y el izquierdo en el final del conducto torácico; la desembocadura por separado en las venas, que es la más frecuente, no se representa.
  - *Modelo 3D (Anato3D)*
- **En este modelo.** El nombre latino del modelo es la forma breve; la Terminologia Anatomica 2 lo llama Truncus lymphaticus bronchomediastinalis dexter o sinister.
  - TA2 n.º 5135
  - TA2 n.º 5136
  - *Modelo 3D (Anato3D)*
- *Vías (claves)*: recibe Paratracheal_thoracic_nodes, Parasternal_nodes, Brachiocephalic_nodes; drena Right_lymphatic_duct, Thoracic_duct.

### Tronco lumbar (`Lumbar_trunk`)

Nombre: TA2 n.º 5146, 5147.

- **Descripción.** Tronco linfático del abdomen, uno derecho y otro izquierdo, formado por la unión de los eferentes de los nodos aórticos laterales.
  - [Lumbar lymph trunk](https://en.wikipedia.org/w/index.php?title=Lumbar_lymph_trunk&oldid=1224154015): “The lumbar trunks are formed by the union of the efferent vessels from the lateral aortic lymph nodes.”
- **Descripción.** Lleva la linfa de los miembros inferiores, de las paredes y vísceras de la pelvis, de los riñones y las glándulas suprarrenales y de los linfáticos profundos de la mayor parte de la pared abdominal.
  - [Lumbar lymph trunk](https://en.wikipedia.org/w/index.php?title=Lumbar_lymph_trunk&oldid=1224154015): “They receive the lymph from the lower limbs, from the walls and viscera of the pelvis, from the kidneys and suprarenal glands and the deep lymphatics of the greater part of the abdominal wall.”
- **Localización.** Está en la pared posterior del abdomen: los nodos que lo forman están junto a la aorta, delante de la columna, y llegan por fuera hasta el borde del psoas mayor.
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “The lateral group nodes are located adjacent to the aorta, anterior to the spine, extending laterally to the edge of the psoas major muscles”
- **Reparo.** La aorta abdominal y el psoas mayor: los nodos izquierdos forman una cadena al lado izquierdo de la aorta, delante del origen del psoas mayor; los derechos están en parte delante de la vena cava inferior, cerca de la desembocadura de la vena renal, y en parte detrás de ella.
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “The left paraaortic nodes form a chain on the left side of the abdominal aorta in front of the origin of the psoas major”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “are situated partly in front of the inferior vena cava near the termination of the renal vein, and partly behind it”
- **Recibe.** A sus nodos de origen llegan los eferentes de los nodos ilíacos comunes, la linfa del testículo (o del ovario, la trompa y el útero), la del riñón y la glándula suprarrenal y la de los músculos laterales del abdomen.
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “the efferents of the common iliac lymph nodes”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “the lymphatics from the testis in the male, and from the ovary, uterine tube, and uterus in the female”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “the lymphatics from the kidney and suprarenal gland”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “the lymphatics draining the lateral abdominal muscles”
- **Drena en.** Desemboca en la cisterna del quilo, la dilatación del comienzo del conducto torácico.
  - [Lumbar lymph trunk](https://en.wikipedia.org/w/index.php?title=Lumbar_lymph_trunk&oldid=1224154015): “Ultimately, the lumbar trunks empty into the cisterna chyli, a dilatation at the beginning of the thoracic duct.”
- **Drena en.** Algunos eferentes de los nodos aórticos laterales atraviesan los pilares del diafragma y se unen directamente al extremo inferior del conducto torácico.
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “others pierce the crura of the diaphragm to join the lower end of the thoracic duct”
- **En este modelo.** En este modelo es un tubo de trazado esquemático generado para Anato3D, desde los nodos lumbares de su lado hasta la cisterna del quilo.
  - *Modelo 3D (Anato3D)*
- **En este modelo.** El nombre latino del modelo es la forma breve; la Terminologia Anatomica 2 lo llama Truncus lymphaticus lumbalis dexter o sinister.
  - TA2 n.º 5146
  - TA2 n.º 5147
  - *Modelo 3D (Anato3D)*
- *Vías (claves)*: recibe Lateral_aortic_nodes, Lateral_caval_nodes, Intermediate_lumbar_nodes; drena Cisterna_chyli.

### Troncos intestinales (`Intestinal_trunks`)

Nombre: TA2 n.º 5148.

- **Descripción.** Vasos linfáticos que llevan la linfa del estómago y los intestinos, del páncreas y el bazo, y de la parte inferior y anterior del hígado.
  - [Intestinal lymph trunk](https://en.wikipedia.org/w/index.php?title=Intestinal_lymph_trunk&oldid=1290203291): “receives the lymph from the stomach and intestines, from the pancreas and spleen, and from the lower and front part of the liver”
- **Localización.** Nacen de los nodos preaórticos, que están delante de la aorta abdominal, alrededor del origen del tronco celíaco y de las arterias mesentéricas superior e inferior.
  - [Preaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Preaortic_lymph_nodes&oldid=1336732047): “The preaortic lymph nodes lie in front of the aorta”
  - [Preaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Preaortic_lymph_nodes&oldid=1336732047): “arranged around the origins of the corresponding arteries”
  - [Preaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Preaortic_lymph_nodes&oldid=1336732047): “the majority unite to form the intestinal lymph trunk”
- **Reparo.** El origen del tronco celíaco y de las arterias mesentéricas en la cara anterior de la aorta: alrededor de ellos están los nodos preaórticos de los que salen.
  - [Preaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Preaortic_lymph_nodes&oldid=1336732047): “arranged around the origins of the corresponding arteries”
- **Recibe.** Reciben la mayoría de los eferentes de los nodos preaórticos: celíacos, mesentéricos superiores y mesentéricos inferiores.
  - [Preaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Preaortic_lymph_nodes&oldid=1336732047): “may be divided into celiac lymph nodes, superior mesenteric lymph nodes, and inferior mesenteric lymph nodes groups”
  - [Preaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Preaortic_lymph_nodes&oldid=1336732047): “the majority unite to form the intestinal lymph trunk”
- **Drena en.** Desembocan en la cisterna del quilo, que a su vez drena en el conducto torácico.
  - [Intestinal lymph trunk](https://en.wikipedia.org/w/index.php?title=Intestinal_lymph_trunk&oldid=1290203291): “empties lymph into the cisterna chyli, which in turn drains into the thoracic duct”
- **En este modelo.** En este modelo son una sola pieza de trazado esquemático, generada para Anato3D, entre los nodos preaórticos y la cisterna del quilo.
  - *Modelo 3D (Anato3D)*
- **En este modelo.** La Terminologia Anatomica 2 lo nombra en singular: Truncus lymphaticus intestinalis.
  - TA2 n.º 5148
- *Vías (claves)*: recibe Coeliac_nodes, Central_superior_mesenteric_nodes, Pre_aortic_nodes; drena Cisterna_chyli.

### Vasos linfáticos de la cabeza (`Lymphatic_vessels_of_head`)

Latín formado: *Vasa lymphatica capitis*.

- **Descripción.** Vasos linfáticos colectores de la cabeza: llevan la linfa de los tejidos a los nodos de la cabeza y, de ellos, a los del cuello.
  - [Lymphatic vessel](https://en.wikipedia.org/w/index.php?title=Lymphatic_vessel&oldid=1324604892): “Lymph vessels that carry lymph to a lymph node are called afferent lymph vessels”
  - [Deep cervical lymph nodes](https://en.wikipedia.org/w/index.php?title=Deep_cervical_lymph_nodes&oldid=1322812686): “All lymphatic vessels of the head and neck ultimately drain to the deep cervical lymph nodes”
- **Descripción.** Los vasos que llevan la linfa hacia un nodo se llaman aferentes, y los que salen de él, eferentes.
  - [Lymphatic vessel](https://en.wikipedia.org/w/index.php?title=Lymphatic_vessel&oldid=1324604892): “Lymph vessels that carry lymph to a lymph node are called afferent lymph vessels, and those that carry it from a lymph node are called efferent lymph vessels”
- **Descripción.** Sus paredes se contraen y tienen válvulas que impiden que la linfa retroceda.
  - [Lymphatic vessel](https://en.wikipedia.org/w/index.php?title=Lymphatic_vessel&oldid=1324604892): “as well as valves to prevent the lymph from flowing backwards”
- **Localización.** Salen del cuero cabelludo, la cara, la boca, las fosas nasales y la faringe y van hacia los nodos de la cabeza y la cadena cervical profunda.
  - [Occipital lymph nodes](https://en.wikipedia.org/w/index.php?title=Occipital_lymph_nodes&oldid=1315085330): “drain part of the scalp of the occiput”
  - [Jugulodigastric lymph node](https://en.wikipedia.org/w/index.php?title=Jugulodigastric_lymph_node&oldid=1292012926): “are the first to receive lymphatic drainage from face, mouth, pharynx, and tonsils”
  - [Retropharyngeal lymph nodes](https://en.wikipedia.org/w/index.php?title=Retropharyngeal_lymph_nodes&oldid=1224152509): “Their afferents drain the nasal cavities, the nasal part of the pharynx, and the auditory tubes.”
- **Reparo.** Ejemplo: un vaso de la región occipital del cuero cabelludo baja por el borde posterior del esternocleidomastoideo hasta los nodos cervicales profundos inferiores.
  - [Occipital lymph nodes](https://en.wikipedia.org/w/index.php?title=Occipital_lymph_nodes&oldid=1315085330): “a lymphatic vessel which passes along the posterior border of the sternocleidomastoid muscle to drain directly into the inferior deep cervical lymph nodes”
- **Recibe.** Recogen la linfa del cuero cabelludo, la cara, la boca, la faringe, las amígdalas, las fosas nasales y las trompas auditivas.
  - [Occipital lymph nodes](https://en.wikipedia.org/w/index.php?title=Occipital_lymph_nodes&oldid=1315085330): “drain part of the scalp of the occiput”
  - [Jugulodigastric lymph node](https://en.wikipedia.org/w/index.php?title=Jugulodigastric_lymph_node&oldid=1292012926): “are the first to receive lymphatic drainage from face, mouth, pharynx, and tonsils”
  - [Retropharyngeal lymph nodes](https://en.wikipedia.org/w/index.php?title=Retropharyngeal_lymph_nodes&oldid=1224152509): “Their afferents drain the nasal cavities, the nasal part of the pharynx, and the auditory tubes.”
- **Drena en.** Pasan por nodos de la cabeza, como los occipitales o los retrofaríngeos, cuyos eferentes van a los nodos cervicales profundos superiores.
  - [Occipital lymph nodes](https://en.wikipedia.org/w/index.php?title=Occipital_lymph_nodes&oldid=1315085330): “Their efferents in turn drain into the superior deep cervical glands.”
  - [Retropharyngeal lymph nodes](https://en.wikipedia.org/w/index.php?title=Retropharyngeal_lymph_nodes&oldid=1224152509): “Their efferents pass to the superior deep cervical lymph nodes.”
- **En este modelo.** En este modelo es una malla esquemática por lado que une los nodos de la cabeza entre sí y con la cadena cervical profunda: no reproduce vasos concretos medidos en una persona.
  - *Modelo 3D (Anato3D)*
- **En este modelo.** Su nombre latino es descriptivo: la Terminologia Anatomica solo tiene términos para los vasos linfáticos en general, superficiales o profundos, y no para los colectores de cada región.
  - TA2 n.º 3915
  - TA2 n.º 3916
  - TA2 n.º 3917
  - *Modelo 3D (Anato3D)*

### Vasos linfáticos del cuello (`Lymphatic_vessels_of_neck`)

Latín formado: *Vasa lymphatica colli*.

- **Descripción.** Vasos linfáticos colectores del cuello: unen los nodos cervicales entre sí y llevan la linfa hacia el tronco yugular.
  - [Jugular lymph trunk](https://en.wikipedia.org/w/index.php?title=Jugular_lymph_trunk&oldid=1223570811): “It is formed by vessels that emerge from the superior deep cervical lymph nodes and unite to efferents of the inferior deep cervical lymph nodes.”
- **Descripción.** Los vasos que llevan la linfa hacia un nodo se llaman aferentes, y los que salen de él, eferentes.
  - [Lymphatic vessel](https://en.wikipedia.org/w/index.php?title=Lymphatic_vessel&oldid=1324604892): “Lymph vessels that carry lymph to a lymph node are called afferent lymph vessels, and those that carry it from a lymph node are called efferent lymph vessels”
- **Descripción.** Sus paredes se contraen y tienen válvulas que impiden que la linfa retroceda.
  - [Lymphatic vessel](https://en.wikipedia.org/w/index.php?title=Lymphatic_vessel&oldid=1324604892): “as well as valves to prevent the lymph from flowing backwards”
- **Localización.** Siguen sobre todo la cadena cervical profunda, a lo largo de la vena yugular interna dentro de la vaina carotídea; los superficiales siguen la vena yugular externa.
  - [Deep cervical lymph nodes](https://en.wikipedia.org/w/index.php?title=Deep_cervical_lymph_nodes&oldid=1322812686): “form a chain along the internal jugular vein within the carotid sheath”
  - [Superficial cervical lymph nodes](https://en.wikipedia.org/w/index.php?title=Superficial_cervical_lymph_nodes&oldid=1252113728): “Some sources state simply that they lie along the external jugular vein”
- **Reparo.** La vena yugular interna, para la cadena profunda, y la yugular externa, para la superficial.
  - [Deep cervical lymph nodes](https://en.wikipedia.org/w/index.php?title=Deep_cervical_lymph_nodes&oldid=1322812686): “form a chain along the internal jugular vein within the carotid sheath”
  - [Superficial cervical lymph nodes](https://en.wikipedia.org/w/index.php?title=Superficial_cervical_lymph_nodes&oldid=1252113728): “Some sources state simply that they lie along the external jugular vein”
- **Recibe.** Reciben la linfa de los nodos de la cabeza y de los del cuello, y también la de los vasos linfáticos meníngeos, que llegan a los cervicales profundos.
  - [Deep cervical lymph nodes](https://en.wikipedia.org/w/index.php?title=Deep_cervical_lymph_nodes&oldid=1322812686): “All lymphatic vessels of the head and neck ultimately drain to the deep cervical lymph nodes”
  - [Lymph node](https://en.wikipedia.org/w/index.php?title=Lymph_node&oldid=1360517815): “Lymph from the meningeal lymphatic vessels in the CNS drains to the deep cervical lymph nodes.”
- **Drena en.** Los eferentes de los nodos cervicales profundos forman el tronco yugular de su lado.
  - [Deep cervical lymph nodes](https://en.wikipedia.org/w/index.php?title=Deep_cervical_lymph_nodes&oldid=1322812686): “Efferents of the deep cervical lymph nodes form the ipsilateral jugular trunk.”
- **En este modelo.** En este modelo es una malla esquemática por lado que une los nodos del cuello entre sí y con el tronco yugular: no reproduce vasos concretos medidos en una persona.
  - *Modelo 3D (Anato3D)*
- **En este modelo.** Su nombre latino es descriptivo: la Terminologia Anatomica solo tiene términos para los vasos linfáticos en general, superficiales o profundos, y no para los colectores de cada región.
  - TA2 n.º 3915
  - TA2 n.º 3916
  - TA2 n.º 3917
  - *Modelo 3D (Anato3D)*

### Vasos linfáticos superficiales del miembro superior (`Superficial_lymphatic_vessels_of_upper_limb`)

Latín formado: *Vasa lymphatica superficialia membri superioris*.

- **Descripción.** Vasos linfáticos superficiales del miembro superior, bajo la piel, que siguen a las venas superficiales.
  - [Supratrochlear lymph nodes](https://en.wikipedia.org/w/index.php?title=Supratrochlear_lymph_nodes&oldid=1383412698): “Their efferents accompany the basilic vein and join the deeper vessels.”
  - [Deltopectoral lymph nodes](https://en.wikipedia.org/w/index.php?title=Deltopectoral_lymph_nodes&oldid=1224153162): “are found beside the cephalic vein”
- **Descripción.** Los vasos que llevan la linfa hacia un nodo se llaman aferentes, y los que salen de él, eferentes.
  - [Lymphatic vessel](https://en.wikipedia.org/w/index.php?title=Lymphatic_vessel&oldid=1324604892): “Lymph vessels that carry lymph to a lymph node are called afferent lymph vessels, and those that carry it from a lymph node are called efferent lymph vessels”
- **Descripción.** Sus paredes se contraen y tienen válvulas que impiden que la linfa retroceda.
  - [Lymphatic vessel](https://en.wikipedia.org/w/index.php?title=Lymphatic_vessel&oldid=1324604892): “as well as valves to prevent the lymph from flowing backwards”
- **Localización.** Los del lado cubital del antebrazo y de la mano siguen la vena basílica; los del lado lateral de la mano, el antebrazo y el brazo siguen la vena cefálica hasta el surco entre el deltoides y el pectoral mayor.
  - [Supratrochlear lymph nodes](https://en.wikipedia.org/w/index.php?title=Supratrochlear_lymph_nodes&oldid=1383412698): “Their afferents drain the middle, ring, and little fingers, the medial portion of the hand, and the superficial area over the ulnar side of the forearm”
  - [Supratrochlear lymph nodes](https://en.wikipedia.org/w/index.php?title=Supratrochlear_lymph_nodes&oldid=1383412698): “Their efferents accompany the basilic vein”
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “They lie in the groove between the deltoid and pectoralis major muscles and receive superficial lymph vessels from the lateral side of the hand, forearm, and arm.”
- **Reparo.** Las venas basílica y cefálica; por encima del epicóndilo medial, medial a la basílica, están los nodos supratrocleares.
  - [Supratrochlear lymph nodes](https://en.wikipedia.org/w/index.php?title=Supratrochlear_lymph_nodes&oldid=1383412698): “are placed above the medial epicondyle of the humerus, medial to the basilic vein”
  - [Deltopectoral lymph nodes](https://en.wikipedia.org/w/index.php?title=Deltopectoral_lymph_nodes&oldid=1224153162): “are found beside the cephalic vein, between the pectoralis major and deltoideus”
- **Recibe.** Recogen la linfa de la piel y el tejido subcutáneo de los dedos, la mano, el antebrazo y el brazo.
  - [Supratrochlear lymph nodes](https://en.wikipedia.org/w/index.php?title=Supratrochlear_lymph_nodes&oldid=1383412698): “Their afferents drain the middle, ring, and little fingers, the medial portion of the hand, and the superficial area over the ulnar side of the forearm”
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “receive superficial lymph vessels from the lateral side of the hand, forearm, and arm”
- **Drena en.** Los mediales pasan por los nodos supratrocleares y se unen a los vasos profundos; los laterales llegan a los nodos infraclaviculares (deltopectorales).
  - [Supratrochlear lymph nodes](https://en.wikipedia.org/w/index.php?title=Supratrochlear_lymph_nodes&oldid=1383412698): “Their efferents accompany the basilic vein and join the deeper vessels.”
  - [Deltopectoral lymph nodes](https://en.wikipedia.org/w/index.php?title=Deltopectoral_lymph_nodes&oldid=1224153162): “They are situated in the course of the external collecting trunks of the arm.”
- **Drena en.** Casi toda la linfa del miembro superior acaba en los nodos axilares laterales.
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “these nodes receive most of the lymph vessels of the upper limb”
- **En este modelo.** En este modelo es una malla esquemática por lado que une los nodos cubitales y supratrocleares con los axilares, junto a la vena basílica, y la vía de la vena cefálica con los nodos infraclaviculares: no reproduce vasos concretos medidos en una persona.
  - *Modelo 3D (Anato3D)*
- **En este modelo.** Su nombre latino es descriptivo: la Terminologia Anatomica solo tiene términos para los vasos linfáticos en general, superficiales o profundos, y no para los colectores de cada región.
  - TA2 n.º 3915
  - TA2 n.º 3916
  - TA2 n.º 3917
  - *Modelo 3D (Anato3D)*

### Vasos linfáticos profundos del miembro superior (`Deep_lymphatic_vessels_of_upper_limb`)

Latín formado: *Vasa lymphatica profunda membri superioris*.

- **Descripción.** Vasos linfáticos profundos del miembro superior, bajo la fascia, que llevan la linfa de los músculos y las articulaciones hacia la axila.
  - [Brachial lymph nodes](https://en.wikipedia.org/w/index.php?title=Brachial_lymph_nodes&oldid=1224152961): “the afferents of these glands drain the whole arm with the exception of that portion whose vessels accompany the cephalic vein”
- **Descripción.** Los vasos que llevan la linfa hacia un nodo se llaman aferentes, y los que salen de él, eferentes.
  - [Lymphatic vessel](https://en.wikipedia.org/w/index.php?title=Lymphatic_vessel&oldid=1324604892): “Lymph vessels that carry lymph to a lymph node are called afferent lymph vessels, and those that carry it from a lymph node are called efferent lymph vessels”
- **Descripción.** Sus paredes se contraen y tienen válvulas que impiden que la linfa retroceda.
  - [Lymphatic vessel](https://en.wikipedia.org/w/index.php?title=Lymphatic_vessel&oldid=1324604892): “as well as valves to prevent the lymph from flowing backwards”
- **Localización.** Suben hacia los nodos axilares laterales (humerales), que están junto a las caras medial y posterior de la vena axilar.
  - [Brachial lymph nodes](https://en.wikipedia.org/w/index.php?title=Brachial_lymph_nodes&oldid=1224152961): “which lies in relation to the medial and posterior aspects of the axillary vein”
- **Reparo.** La vena axilar: los nodos en los que terminan están en su cara medial y posterior.
  - [Brachial lymph nodes](https://en.wikipedia.org/w/index.php?title=Brachial_lymph_nodes&oldid=1224152961): “which lies in relation to the medial and posterior aspects of the axillary vein”
- **Recibe.** Reciben la linfa de todo el miembro salvo la de los vasos que acompañan a la vena cefálica; los superficiales del lado cubital se unen a ellos tras los nodos supratrocleares.
  - [Brachial lymph nodes](https://en.wikipedia.org/w/index.php?title=Brachial_lymph_nodes&oldid=1224152961): “the afferents of these glands drain the whole arm with the exception of that portion whose vessels accompany the cephalic vein”
  - [Supratrochlear lymph nodes](https://en.wikipedia.org/w/index.php?title=Supratrochlear_lymph_nodes&oldid=1383412698): “Their efferents accompany the basilic vein and join the deeper vessels.”
- **Drena en.** Terminan en los nodos axilares laterales, que reciben la mayor parte de los vasos linfáticos del miembro superior.
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “these nodes receive most of the lymph vessels of the upper limb”
- **En este modelo.** En este modelo es una malla esquemática por lado que une los nodos braquiales con los axilares laterales siguiendo los vasos radiales, cubitales y braquiales; ese recorrido junto a las arterias es una simplificación: no reproduce vasos concretos medidos en una persona.
  - *Modelo 3D (Anato3D)*
- **En este modelo.** Su nombre latino es descriptivo: la Terminologia Anatomica solo tiene términos para los vasos linfáticos en general, superficiales o profundos, y no para los colectores de cada región.
  - TA2 n.º 3915
  - TA2 n.º 3916
  - TA2 n.º 3917
  - *Modelo 3D (Anato3D)*

### Vasos linfáticos de la pared torácica (`Lymphatic_vessels_of_thoracic_wall`)

Latín formado: *Vasa lymphatica parietis thoracis*.

- **Descripción.** Vasos linfáticos colectores de la pared del tórax, que unen los nodos paraesternales, delante, y los intercostales, detrás.
  - [Parasternal lymph nodes](https://en.wikipedia.org/w/index.php?title=Parasternal_lymph_nodes&oldid=1224153266): “are placed at the anterior ends of the intercostal spaces”
  - [Intercostal lymph nodes](https://en.wikipedia.org/w/index.php?title=Intercostal_lymph_nodes&oldid=1224153313): “occupy the posterior parts of the intercostal spaces”
- **Descripción.** Los vasos que llevan la linfa hacia un nodo se llaman aferentes, y los que salen de él, eferentes.
  - [Lymphatic vessel](https://en.wikipedia.org/w/index.php?title=Lymphatic_vessel&oldid=1324604892): “Lymph vessels that carry lymph to a lymph node are called afferent lymph vessels, and those that carry it from a lymph node are called efferent lymph vessels”
- **Descripción.** Sus paredes se contraen y tienen válvulas que impiden que la linfa retroceda.
  - [Lymphatic vessel](https://en.wikipedia.org/w/index.php?title=Lymphatic_vessel&oldid=1324604892): “as well as valves to prevent the lymph from flowing backwards”
- **Localización.** Delante, junto a la arteria torácica interna, en los extremos anteriores de los espacios intercostales; detrás, en la parte posterior de esos espacios, junto a los vasos intercostales.
  - [Parasternal lymph nodes](https://en.wikipedia.org/w/index.php?title=Parasternal_lymph_nodes&oldid=1224153266): “are placed at the anterior ends of the intercostal spaces, by the side of the internal thoracic artery”
  - [Intercostal lymph nodes](https://en.wikipedia.org/w/index.php?title=Intercostal_lymph_nodes&oldid=1224153313): “occupy the posterior parts of the intercostal spaces, in relation to the intercostal vessels”
- **Reparo.** La arteria torácica interna, por delante, y los vasos intercostales, por detrás.
  - [Parasternal lymph nodes](https://en.wikipedia.org/w/index.php?title=Parasternal_lymph_nodes&oldid=1224153266): “by the side of the internal thoracic artery”
  - [Intercostal lymph nodes](https://en.wikipedia.org/w/index.php?title=Intercostal_lymph_nodes&oldid=1224153313): “in relation to the intercostal vessels”
- **Recibe.** Los paraesternales reciben linfa de la mama, de la parte profunda de la pared anterior del abdomen por encima del ombligo, de la cara superior del hígado y de la parte anterior de la pared del tórax.
  - [Parasternal lymph nodes](https://en.wikipedia.org/w/index.php?title=Parasternal_lymph_nodes&oldid=1224153266): “They derive afferents from the mamma; from the deeper structures of the anterior abdominal wall above the level of the umbilicus; from the upper surface of the liver”
- **Recibe.** Los intercostales reciben los linfáticos profundos de la parte posterolateral del tórax.
  - [Intercostal lymph nodes](https://en.wikipedia.org/w/index.php?title=Intercostal_lymph_nodes&oldid=1224153313): “They receive the deep lymphatics from the postero-lateral aspect of the chest”
- **Drena en.** Los paraesternales drenan en el tronco broncomediastínico, igual que los intercostales superiores.
  - [Parasternal lymph nodes](https://en.wikipedia.org/w/index.php?title=Parasternal_lymph_nodes&oldid=1224153266): “The parasternal lymph nodes drain into the bronchomediastinal trunks, in a similar fashion to the upper intercostal lymph nodes.”
- **Drena en.** Los intercostales de los cuatro o cinco espacios inferiores forman un tronco que baja a la cisterna del quilo o al comienzo del conducto torácico; los superiores izquierdos terminan en el conducto torácico, y los derechos, en el conducto linfático derecho.
  - [Intercostal lymph nodes](https://en.wikipedia.org/w/index.php?title=Intercostal_lymph_nodes&oldid=1224153313): “The efferents of the glands in the lower four or five spaces unite to form a trunk, which descends and opens either into the cisterna chyli or into the commencement of the thoracic duct.”
  - [Intercostal lymph nodes](https://en.wikipedia.org/w/index.php?title=Intercostal_lymph_nodes&oldid=1224153313): “The efferents of the glands in the upper spaces of the left side end in the thoracic duct; those of the corresponding right spaces, in the right lymphatic duct.”
- **En este modelo.** En este modelo es una malla esquemática por lado que une los nodos paraesternales e intercostales con sus troncos: no reproduce vasos concretos medidos en una persona.
  - *Modelo 3D (Anato3D)*
- **En este modelo.** Su nombre latino es descriptivo: la Terminologia Anatomica solo tiene términos para los vasos linfáticos en general, superficiales o profundos, y no para los colectores de cada región.
  - TA2 n.º 3915
  - TA2 n.º 3916
  - TA2 n.º 3917
  - *Modelo 3D (Anato3D)*

### Vasos linfáticos del mediastino (`Lymphatic_vessels_of_mediastinum`)

Latín formado: *Vasa lymphatica mediastini*.

- **Descripción.** Vasos linfáticos colectores del mediastino, que llevan la linfa de los pulmones, los bronquios, la tráquea y el corazón hacia los troncos broncomediastínicos.
  - [Tracheobronchial lymph nodes](https://en.wikipedia.org/w/index.php?title=Tracheobronchial_lymph_nodes&oldid=1380892676): “The afferents of the tracheobronchial glands drain the lungs and bronchi, the thoracic part of the trachea and the heart”
  - [Tracheobronchial lymph nodes](https://en.wikipedia.org/w/index.php?title=Tracheobronchial_lymph_nodes&oldid=1380892676): “to form the right and left bronchomediastinal trunks”
- **Descripción.** Los vasos que llevan la linfa hacia un nodo se llaman aferentes, y los que salen de él, eferentes.
  - [Lymphatic vessel](https://en.wikipedia.org/w/index.php?title=Lymphatic_vessel&oldid=1324604892): “Lymph vessels that carry lymph to a lymph node are called afferent lymph vessels, and those that carry it from a lymph node are called efferent lymph vessels”
- **Descripción.** Sus paredes se contraen y tienen válvulas que impiden que la linfa retroceda.
  - [Lymphatic vessel](https://en.wikipedia.org/w/index.php?title=Lymphatic_vessel&oldid=1324604892): “as well as valves to prevent the lymph from flowing backwards”
- **Localización.** Unen los nodos de dentro del pulmón, los del hilio, los de alrededor de la bifurcación de la tráquea y los de sus lados.
  - [Tracheobronchial lymph nodes](https://en.wikipedia.org/w/index.php?title=Tracheobronchial_lymph_nodes&oldid=1380892676): “These lymph nodes form four main groups including paratracheal, tracheobronchial, bronchopulmonary and pulmonary nodes.”
- **Reparo.** La tráquea y su bifurcación: los nodos traqueobronquiales superiores están a cada lado de la tráquea, justo antes de dividirse, y el inferior, en el ángulo entre los dos bronquios.
  - [Tracheobronchial lymph nodes](https://en.wikipedia.org/w/index.php?title=Tracheobronchial_lymph_nodes&oldid=1380892676): “The two superior tracheobronchial nodes are located on either side of trachea just before its bifurcation.”
  - [Tracheobronchial lymph nodes](https://en.wikipedia.org/w/index.php?title=Tracheobronchial_lymph_nodes&oldid=1380892676): “The inferior tracheobronchial node is located just below the bifurcation in the angle between the two bronchi.”
- **Recibe.** Reciben la linfa de los pulmones y los bronquios, de la parte torácica de la tráquea y del corazón, y parte de la de los nodos mediastínicos posteriores.
  - [Tracheobronchial lymph nodes](https://en.wikipedia.org/w/index.php?title=Tracheobronchial_lymph_nodes&oldid=1380892676): “The afferents of the tracheobronchial glands drain the lungs and bronchi, the thoracic part of the trachea and the heart; some of the efferents of the posterior mediastinal glands also end in this group.”
- **Drena en.** Sus eferentes suben sobre la tráquea y se unen a los de los nodos mamarios internos y mediastínicos anteriores para formar los troncos broncomediastínicos.
  - [Tracheobronchial lymph nodes](https://en.wikipedia.org/w/index.php?title=Tracheobronchial_lymph_nodes&oldid=1380892676): “Their efferent vessels ascend upon the trachea and unite with efferents of the internal mammary and anterior mediastinal glands to form the right and left bronchomediastinal trunks.”
- **En este modelo.** En este modelo es una malla esquemática por lado que une los nodos del mediastino entre sí y con los troncos broncomediastínicos (aquí una sola pieza para los dos lados): no reproduce vasos concretos medidos en una persona.
  - *Modelo 3D (Anato3D)*
- **En este modelo.** Su nombre latino es descriptivo: la Terminologia Anatomica solo tiene términos para los vasos linfáticos en general, superficiales o profundos, y no para los colectores de cada región.
  - TA2 n.º 3915
  - TA2 n.º 3916
  - TA2 n.º 3917
  - *Modelo 3D (Anato3D)*

### Vasos linfáticos del abdomen (`Lymphatic_vessels_of_abdomen`)

Latín formado: *Vasa lymphatica abdominis*.

- **Descripción.** Vasos linfáticos colectores del abdomen: llevan la linfa de las vísceras a los nodos preaórticos y la de la pared y los órganos retroperitoneales a los nodos lumbares.
  - [Preaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Preaortic_lymph_nodes&oldid=1336732047): “their principal afferents are derived from the organs supplied by the three arteries with which they are associated”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “the lymphatics from the kidney and suprarenal gland”
- **Descripción.** Los vasos que llevan la linfa hacia un nodo se llaman aferentes, y los que salen de él, eferentes.
  - [Lymphatic vessel](https://en.wikipedia.org/w/index.php?title=Lymphatic_vessel&oldid=1324604892): “Lymph vessels that carry lymph to a lymph node are called afferent lymph vessels, and those that carry it from a lymph node are called efferent lymph vessels”
- **Descripción.** Sus paredes se contraen y tienen válvulas que impiden que la linfa retroceda.
  - [Lymphatic vessel](https://en.wikipedia.org/w/index.php?title=Lymphatic_vessel&oldid=1324604892): “as well as valves to prevent the lymph from flowing backwards”
- **Localización.** En el mesenterio y junto a las arterias de las vísceras, hasta los nodos de delante y de los lados de la aorta.
  - [Superior mesenteric lymph nodes](https://en.wikipedia.org/w/index.php?title=Superior_mesenteric_lymph_nodes&oldid=1223115643): “lie between the layers of the mesentery”
  - [Preaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Preaortic_lymph_nodes&oldid=1336732047): “arranged around the origins of the corresponding arteries”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “The lateral group nodes are located adjacent to the aorta”
- **Reparo.** El tronco celíaco y las arterias mesentéricas superior e inferior, para la vía visceral; la aorta y la vena cava inferior, para la lumbar.
  - [Preaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Preaortic_lymph_nodes&oldid=1336732047): “the celiac, superior and inferior mesenteric arteries”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “are situated partly in front of the inferior vena cava”
- **Recibe.** Reciben la linfa del tubo digestivo y sus glándulas, del bazo, de los riñones y las glándulas suprarrenales, de las gónadas y de los músculos laterales del abdomen.
  - [Intestinal lymph trunk](https://en.wikipedia.org/w/index.php?title=Intestinal_lymph_trunk&oldid=1290203291): “receives the lymph from the stomach and intestines, from the pancreas and spleen”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “the lymphatics from the testis in the male, and from the ovary, uterine tube, and uterus in the female”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “the lymphatics from the kidney and suprarenal gland”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “the lymphatics draining the lateral abdominal muscles”
- **Drena en.** De los nodos preaórticos sale el tronco intestinal, y de los aórticos laterales, los troncos lumbares; todos llegan a la cisterna del quilo.
  - [Preaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Preaortic_lymph_nodes&oldid=1336732047): “the majority unite to form the intestinal lymph trunk, which enters the cisterna chyli”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “converge to form the right and left lumbar trunks which join the cisterna chyli”
- **En este modelo.** En este modelo es una malla esquemática por lado que une los nodos del abdomen entre sí y con los troncos intestinales y lumbares (aquí una sola pieza para los dos lados): no reproduce vasos concretos medidos en una persona.
  - *Modelo 3D (Anato3D)*
- **En este modelo.** Su nombre latino es descriptivo: la Terminologia Anatomica solo tiene términos para los vasos linfáticos en general, superficiales o profundos, y no para los colectores de cada región.
  - TA2 n.º 3915
  - TA2 n.º 3916
  - TA2 n.º 3917
  - *Modelo 3D (Anato3D)*

### Vasos linfáticos de la pelvis (`Lymphatic_vessels_of_pelvis`)

Latín formado: *Vasa lymphatica pelvis*.

- **Descripción.** Vasos linfáticos colectores de la pelvis, que siguen a los vasos ilíacos y llevan la linfa hacia los nodos lumbares.
  - [External iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=External_iliac_lymph_nodes&oldid=1223684511): “lie along the external iliac vessels”
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “their efferents pass to the lateral aortic glands”
- **Descripción.** Los vasos que llevan la linfa hacia un nodo se llaman aferentes, y los que salen de él, eferentes.
  - [Lymphatic vessel](https://en.wikipedia.org/w/index.php?title=Lymphatic_vessel&oldid=1324604892): “Lymph vessels that carry lymph to a lymph node are called afferent lymph vessels, and those that carry it from a lymph node are called efferent lymph vessels”
- **Descripción.** Sus paredes se contraen y tienen válvulas que impiden que la linfa retroceda.
  - [Lymphatic vessel](https://en.wikipedia.org/w/index.php?title=Lymphatic_vessel&oldid=1324604892): “as well as valves to prevent the lymph from flowing backwards”
- **Localización.** Van a lo largo de los vasos ilíacos externos, alrededor de la arteria ilíaca interna y sus ramas y por detrás y a los lados de la arteria ilíaca común.
  - [External iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=External_iliac_lymph_nodes&oldid=1223684511): “lie along the external iliac vessels”
  - [Internal iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Internal_iliac_lymph_nodes&oldid=1358630094): “surround the internal iliac artery and its branches”
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “are grouped behind and on the sides of the common iliac artery”
- **Reparo.** Las arterias ilíacas común, externa e interna.
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “are grouped behind and on the sides of the common iliac artery”
  - [External iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=External_iliac_lymph_nodes&oldid=1223684511): “lie along the external iliac vessels”
  - [Internal iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Internal_iliac_lymph_nodes&oldid=1358630094): “surround the internal iliac artery and its branches”
- **Recibe.** Reciben la linfa de los nodos inguinales, de todas las vísceras de la pelvis, de la parte profunda del periné y de la nalga y la parte posterior del muslo.
  - [External iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=External_iliac_lymph_nodes&oldid=1223684511): “Their principal afferents are derived from the inguinal lymph nodes”
  - [Internal iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Internal_iliac_lymph_nodes&oldid=1358630094): “they receive lymphatics from all the pelvic viscera, from the deeper parts of the perineum”
  - [Internal iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Internal_iliac_lymph_nodes&oldid=1358630094): “from the buttock and back of the thigh”
- **Recibe.** La linfa del ovario y del testículo no pasa por la pelvis: va a los nodos lumbares.
  - [Internal iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Internal_iliac_lymph_nodes&oldid=1358630094): “It does not receive lymph from the ovary or testis, which drain to the paraaortic lymph nodes.”
- **Drena en.** Los ilíacos externos e internos drenan en los ilíacos comunes, cuyos eferentes van a los nodos aórticos laterales.
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “They drain chiefly the hypogastric and external iliac glands, and their efferents pass to the lateral aortic glands.”
- **En este modelo.** En este modelo es una malla esquemática por lado que une los nodos de la pelvis entre sí, a lo largo de los vasos ilíacos, hasta los nodos lumbares: no reproduce vasos concretos medidos en una persona.
  - *Modelo 3D (Anato3D)*
- **En este modelo.** Su nombre latino es descriptivo: la Terminologia Anatomica solo tiene términos para los vasos linfáticos en general, superficiales o profundos, y no para los colectores de cada región.
  - TA2 n.º 3915
  - TA2 n.º 3916
  - TA2 n.º 3917
  - *Modelo 3D (Anato3D)*

### Vasos linfáticos superficiales del miembro inferior (`Superficial_lymphatic_vessels_of_lower_limb`)

Latín formado: *Vasa lymphatica superficialia membri inferioris*.

- **Descripción.** Vasos linfáticos superficiales del miembro inferior, bajo la piel, que llevan la linfa hacia los nodos inguinales superficiales y, desde la parte posterolateral de la pierna, hacia los poplíteos.
  - [Inguinal lymph nodes](https://en.wikipedia.org/w/index.php?title=Inguinal_lymph_nodes&oldid=1330887775): “the thigh and the medial side of the leg (the lateral leg drains to the popliteal lymph nodes first)”
- **Descripción.** Los vasos que llevan la linfa hacia un nodo se llaman aferentes, y los que salen de él, eferentes.
  - [Lymphatic vessel](https://en.wikipedia.org/w/index.php?title=Lymphatic_vessel&oldid=1324604892): “Lymph vessels that carry lymph to a lymph node are called afferent lymph vessels, and those that carry it from a lymph node are called efferent lymph vessels”
- **Descripción.** Sus paredes se contraen y tienen válvulas que impiden que la linfa retroceda.
  - [Lymphatic vessel](https://en.wikipedia.org/w/index.php?title=Lymphatic_vessel&oldid=1324604892): “as well as valves to prevent the lymph from flowing backwards”
- **Localización.** La mayoría sube por el muslo y la cara medial de la pierna hasta la ingle; los de la región de la vena safena menor llegan a un nodo poplíteo junto a la desembocadura de esa vena.
  - [Inguinal lymph nodes](https://en.wikipedia.org/w/index.php?title=Inguinal_lymph_nodes&oldid=1330887775): “the thigh and the medial side of the leg”
  - [Popliteal lymph nodes](https://en.wikipedia.org/w/index.php?title=Popliteal_lymph_nodes&oldid=1277704248): “near the terminal part of the small saphenous vein, and drains the region from which this vein derives its tributaries”
- **Reparo.** El hiato safeno: los nodos inguinales superficiales están por debajo, a su lado y en su centro.
  - [Inguinal lymph nodes](https://en.wikipedia.org/w/index.php?title=Inguinal_lymph_nodes&oldid=1330887775): “inferior – inferior of the saphenous opening of the leg”
  - [Inguinal lymph nodes](https://en.wikipedia.org/w/index.php?title=Inguinal_lymph_nodes&oldid=1330887775): “superolateral – on the side of the saphenous opening”
  - [Inguinal lymph nodes](https://en.wikipedia.org/w/index.php?title=Inguinal_lymph_nodes&oldid=1330887775): “superomedial – located at the middle of the saphenous opening”
- **Reparo.** La vena safena menor, en la pierna: su territorio drena en el nodo poplíteo superficial.
  - [Popliteal lymph nodes](https://en.wikipedia.org/w/index.php?title=Popliteal_lymph_nodes&oldid=1277704248): “near the terminal part of the small saphenous vein, and drains the region from which this vein derives its tributaries”
- **Recibe.** Recogen la linfa de la piel y el tejido subcutáneo del pie, la pierna y el muslo; la de la parte posterolateral de la pierna y la planta del pie va al nodo poplíteo superficial.
  - [Popliteal lymph nodes](https://en.wikipedia.org/w/index.php?title=Popliteal_lymph_nodes&oldid=1277704248): “such as superficial regions of the posterolateral aspect of the leg and the plantar aspect of the foot”
- **Drena en.** Los inguinales superficiales drenan en los inguinales profundos.
  - [Inguinal lymph nodes](https://en.wikipedia.org/w/index.php?title=Inguinal_lymph_nodes&oldid=1330887775): “They drain to the deep inguinal lymph nodes.”
- **En este modelo.** En este modelo es una malla esquemática por lado que une los nodos inguinales superficiales con la vía de la safena magna y el nodo poplíteo superficial con la de la safena menor: no reproduce vasos concretos medidos en una persona.
  - *Modelo 3D (Anato3D)*
- **En este modelo.** Su nombre latino es descriptivo: la Terminologia Anatomica solo tiene términos para los vasos linfáticos en general, superficiales o profundos, y no para los colectores de cada región.
  - TA2 n.º 3915
  - TA2 n.º 3916
  - TA2 n.º 3917
  - *Modelo 3D (Anato3D)*

### Vasos linfáticos profundos del miembro inferior (`Deep_lymphatic_vessels_of_lower_limb`)

Latín formado: *Vasa lymphatica profunda membri inferioris*.

- **Descripción.** Vasos linfáticos profundos del miembro inferior, que acompañan a los vasos tibiales y femorales y llevan la linfa a los nodos poplíteos y a los inguinales profundos.
  - [Popliteal lymph nodes](https://en.wikipedia.org/w/index.php?title=Popliteal_lymph_nodes&oldid=1277704248): “the trunks that accompany the anterior and posterior tibial vessels”
  - [Popliteal lymph nodes](https://en.wikipedia.org/w/index.php?title=Popliteal_lymph_nodes&oldid=1277704248): “The efferents of the popliteal lymph nodes pass almost entirely alongside the femoral vessels to the deep inguinal lymph nodes”
- **Descripción.** Los vasos que llevan la linfa hacia un nodo se llaman aferentes, y los que salen de él, eferentes.
  - [Lymphatic vessel](https://en.wikipedia.org/w/index.php?title=Lymphatic_vessel&oldid=1324604892): “Lymph vessels that carry lymph to a lymph node are called afferent lymph vessels, and those that carry it from a lymph node are called efferent lymph vessels”
- **Descripción.** Sus paredes se contraen y tienen válvulas que impiden que la linfa retroceda.
  - [Lymphatic vessel](https://en.wikipedia.org/w/index.php?title=Lymphatic_vessel&oldid=1324604892): “as well as valves to prevent the lymph from flowing backwards”
- **Localización.** En la pierna acompañan a los vasos tibiales anteriores y posteriores hasta la fosa poplítea; en el muslo siguen los vasos femorales hasta los nodos inguinales profundos.
  - [Popliteal lymph nodes](https://en.wikipedia.org/w/index.php?title=Popliteal_lymph_nodes&oldid=1277704248): “the trunks that accompany the anterior and posterior tibial vessels”
  - [Popliteal lymph nodes](https://en.wikipedia.org/w/index.php?title=Popliteal_lymph_nodes&oldid=1277704248): “pass almost entirely alongside the femoral vessels to the deep inguinal lymph nodes”
- **Reparo.** Los vasos poplíteos y la vena femoral: los nodos poplíteos profundos están a los lados de los vasos poplíteos y los inguinales profundos, mediales a la vena femoral.
  - [Popliteal lymph nodes](https://en.wikipedia.org/w/index.php?title=Popliteal_lymph_nodes&oldid=1277704248): “The others lie at the sides of the popliteal vessels”
  - [Inguinal lymph nodes](https://en.wikipedia.org/w/index.php?title=Inguinal_lymph_nodes&oldid=1330887775): “They lie medial to the femoral vein deep to the cribriform fascia.”
- **Recibe.** Reciben la linfa de la articulación de la rodilla y de las regiones profundas de la pierna y el muslo.
  - [Popliteal lymph nodes](https://en.wikipedia.org/w/index.php?title=Popliteal_lymph_nodes&oldid=1277704248): “It receives afferents from the knee-joint, together with those that accompany the genicular arteries.”
  - [Femoral triangle](https://en.wikipedia.org/w/index.php?title=Femoral_triangle&oldid=1380880813): “and from the deep lymphatics of the lower limb”
- **Drena en.** Terminan en los nodos inguinales profundos, que drenan hacia arriba en los ilíacos externos.
  - [Popliteal lymph nodes](https://en.wikipedia.org/w/index.php?title=Popliteal_lymph_nodes&oldid=1277704248): “pass almost entirely alongside the femoral vessels to the deep inguinal lymph nodes”
  - [Inguinal lymph nodes](https://en.wikipedia.org/w/index.php?title=Inguinal_lymph_nodes&oldid=1330887775): “The deep inguinal lymph nodes drain superiorly to the external iliac lymph nodes”
- **Drena en.** Unos pocos eferentes poplíteos acompañan a la vena safena magna y terminan en los inguinales superficiales.
  - [Popliteal lymph nodes](https://en.wikipedia.org/w/index.php?title=Popliteal_lymph_nodes&oldid=1277704248): “but a few may accompany the great saphenous vein”
- **En este modelo.** En este modelo es una malla esquemática por lado que une los nodos tibiales, fibular y poplíteos profundos con los inguinales profundos, junto a los vasos tibiales, poplíteos y femorales: no reproduce vasos concretos medidos en una persona.
  - *Modelo 3D (Anato3D)*
- **En este modelo.** Su nombre latino es descriptivo: la Terminologia Anatomica solo tiene términos para los vasos linfáticos en general, superficiales o profundos, y no para los colectores de cada región.
  - TA2 n.º 3915
  - TA2 n.º 3916
  - TA2 n.º 3917
  - *Modelo 3D (Anato3D)*

### Bazo (`Spleen`)

Nombre: TA2 n.º 5159.

- **Descripción.** Órgano linfoide que actúa sobre todo como filtro de la sangre: retira los glóbulos rojos viejos y guarda una reserva de sangre.
  - [Spleen](https://en.wikipedia.org/w/index.php?title=Spleen&oldid=1384138456): “it acts primarily as a blood filter”
  - [Spleen](https://en.wikipedia.org/w/index.php?title=Spleen&oldid=1384138456): “It removes old red blood cells and holds a reserve of blood”
- **Descripción.** Es el mayor acúmulo de tejido linfoide del cuerpo.
  - [Spleen](https://en.wikipedia.org/w/index.php?title=Spleen&oldid=1384138456): “The spleen is the largest collection of lymphoid tissue in the body.”
- **Descripción.** En el adulto sano mide de 7 a 14 cm de largo.
  - [Spleen](https://en.wikipedia.org/w/index.php?title=Spleen&oldid=1384138456): “is approximately 7 to 14 centimetres”
- **Localización.** Está debajo de la parte izquierda del diafragma, bajo las costillas novena, décima y undécima.
  - [Spleen](https://en.wikipedia.org/w/index.php?title=Spleen&oldid=1384138456): “the spleen is underneath the left part of the thoracic diaphragm”
  - [Spleen](https://en.wikipedia.org/w/index.php?title=Spleen&oldid=1384138456): “It is underneath the ninth, tenth, and eleventh ribs.”
- **Reparo.** Su hilio, una fisura larga hacia el centro de la cara visceral, es donde entran la arteria y la vena esplénicas.
  - [Spleen](https://en.wikipedia.org/w/index.php?title=Spleen&oldid=1384138456): “Near the middle of the spleen is a long fissure, the splenic hilum”
  - [Spleen](https://en.wikipedia.org/w/index.php?title=Spleen&oldid=1384138456): “The splenic artery and splenic vein enter the spleen at the splenic hilum.”
- **Recibe.** No filtra linfa sino sangre, que le llega por la arteria esplénica y las arterias gástricas cortas.
  - [Spleen](https://en.wikipedia.org/w/index.php?title=Spleen&oldid=1384138456): “it acts primarily as a blood filter”
  - [Spleen](https://en.wikipedia.org/w/index.php?title=Spleen&oldid=1384138456): “Both the short gastric arteries and the splenic artery supply it with blood.”
- **Recibe.** Como el timo, solo tiene vasos linfáticos eferentes.
  - [Spleen](https://en.wikipedia.org/w/index.php?title=Spleen&oldid=1384138456): “Like the thymus, the spleen possesses only efferent lymphatic vessels.”
- **Drena en.** Su linfa va a los nodos celíacos, que reciben la del bazo, el estómago, el páncreas y el hígado.
  - [Celiac lymph nodes](https://en.wikipedia.org/w/index.php?title=Celiac_lymph_nodes&oldid=1300899971): “They receive lymph from the stomach, duodenum, pancreas, spleen, liver, and gall bladder.”
- **En este modelo.** Pieza de Z-Anatomy ajustada al cuerpo de Anato3D. No se dibuja intercalada entre vasos linfáticos: no está en el camino de la linfa como un nodo.
  - *Modelo 3D (Anato3D)*
- **Puntos clave.** Sin bazo (por ejemplo, tras extirparlo: esplenectomía) aumenta el riesgo de sepsis por bacterias con cápsula de polisacáridos.
  - [Spleen](https://en.wikipedia.org/w/index.php?title=Spleen&oldid=1384138456): “The surgical process to remove the spleen is known as a splenectomy.”
  - [Spleen](https://en.wikipedia.org/w/index.php?title=Spleen&oldid=1384138456): “there is an increased risk of sepsis from polysaccharide-encapsulated bacteria”

### Lóbulo izquierdo del timo (`Left_lobe_of_thymus`)

Nombre: TA2 n.º 7224.

- **Descripción.** Lóbulo del timo, el órgano linfoide primario en el que maduran los linfocitos T.
  - [Thymus](https://en.wikipedia.org/w/index.php?title=Thymus&oldid=1382487861): “is a specialized primary lymphoid organ of the immune system”
  - [Thymus](https://en.wikipedia.org/w/index.php?title=Thymus&oldid=1382487861): “Within the thymus, T cells mature.”
- **Descripción.** El timo tiene dos lóbulos; cada uno tiene una médula central y una corteza externa, rodeadas por una cápsula.
  - [Thymus](https://en.wikipedia.org/w/index.php?title=Thymus&oldid=1382487861): “It is made up of two lobes, each consisting of a central medulla and an outer cortex, surrounded by a capsule.”
- **Descripción.** Los dos lóbulos difieren algo de tamaño, y el izquierdo suele estar más alto que el derecho.
  - [Thymus](https://en.wikipedia.org/w/index.php?title=Thymus&oldid=1382487861): “The two lobes differ slightly in size, with the left lobe usually higher than the right.”
- **Localización.** Está en el mediastino anterior y superior, detrás del esternón y delante del corazón; los lóbulos van desde debajo de la tiroides hasta el cartílago de la cuarta costilla.
  - [Thymus](https://en.wikipedia.org/w/index.php?title=Thymus&oldid=1382487861): “in the anterior superior mediastinum, behind the sternum, and in front of the heart”
  - [Thymus](https://en.wikipedia.org/w/index.php?title=Thymus&oldid=1382487861): “stretch from below the thyroid in the neck to as low as the cartilage of the fourth rib”
- **Reparo.** Se apoya en el pericardio, y una capa de fascia lo separa del arco aórtico y los grandes vasos; la vena braquiocefálica izquierda puede incluso quedar dentro de él.
  - [Thymus](https://en.wikipedia.org/w/index.php?title=Thymus&oldid=1382487861): “rests on the pericardium, and is separated from the aortic arch and great vessels by a layer of fascia”
  - [Thymus](https://en.wikipedia.org/w/index.php?title=Thymus&oldid=1382487861): “The left brachiocephalic vein may even be embedded within the thymus.”
- **Recibe.** No le llegan vasos linfáticos: los suyos solo salen de él, junto a las arterias y las venas.
  - [Thymus](https://en.wikipedia.org/w/index.php?title=Thymus&oldid=1382487861): “Lymphatic vessels travel only away from the thymus, accompanying the arteries and veins.”
- **Drena en.** Sus vasos linfáticos drenan en los nodos braquiocefálicos, traqueobronquiales y paraesternales.
  - [Thymus](https://en.wikipedia.org/w/index.php?title=Thymus&oldid=1382487861): “These drain into the brachiocephalic, tracheobronchial, and parasternal lymph nodes.”
- **En este modelo.** Pieza de Z-Anatomy ajustada al cuerpo de Anato3D; su tamaño es orientativo.
  - *Modelo 3D (Anato3D)*
- **En este modelo.** El tamaño del timo cambia con la edad: crece hasta la pubertad y desde el comienzo de la adolescencia se reduce y su tejido se va sustituyendo por grasa.
  - [Thymus](https://en.wikipedia.org/w/index.php?title=Thymus&oldid=1382487861): “It increases in size until puberty”
  - [Thymus](https://en.wikipedia.org/w/index.php?title=Thymus&oldid=1382487861): “By the early teens, the thymus begins to decrease in size and activity and its tissue is gradually replaced by fatty tissue.”
- *Vías (claves)*: recibe —; drena Brachiocephalic_nodes, Superior_tracheobronchial_nodes, Parasternal_nodes.

### Amígdala palatina (`Palatine_tonsil`)

Nombre: TA2 n.º 2853.

- **Descripción.** Masa de tejido linfoide a cada lado del fondo de la garganta: es lo que suele llamarse «amígdala».
  - [Palatine tonsil](https://en.wikipedia.org/w/index.php?title=Palatine_tonsil&oldid=1384978432): “commonly called the tonsils”
  - [Palatine tonsil](https://en.wikipedia.org/w/index.php?title=Palatine_tonsil&oldid=1384978432): “located on the left and right sides at the back of the throat”
- **Descripción.** Forma parte del anillo de Waldeyer, a la entrada de las vías respiratoria y digestiva.
  - [Palatine tonsil](https://en.wikipedia.org/w/index.php?title=Palatine_tonsil&oldid=1384978432): “It forms part of the Waldeyer's ring”
  - [Palatine tonsil](https://en.wikipedia.org/w/index.php?title=Palatine_tonsil&oldid=1384978432): “located at the entrance to the upper respiratory and gastrointestinal tracts”
- **Descripción.** En el adulto mide hasta unos 2,5 cm de largo, 2 cm de ancho y 1,2 cm de grosor.
  - [Tonsil](https://en.wikipedia.org/w/index.php?title=Tonsil&oldid=1383463067): “each palatine tonsil normally measures up to 2.5 cm in length, 2.0 cm in width and 1.2 cm in thickness”
- **Localización.** Está en el istmo de las fauces, en la orofaringe.
  - [Palatine tonsil](https://en.wikipedia.org/w/index.php?title=Palatine_tonsil&oldid=1384978432): “are located in the isthmus of the fauces”
  - [Waldeyer's tonsillar ring](https://en.wikipedia.org/w/index.php?title=Waldeyer's_tonsillar_ring&oldid=1364974513): “2 palatine tonsils (commonly called "the tonsils") located in the oropharynx”
- **Reparo.** Queda entre los arcos palatogloso y palatofaríngeo del paladar blando.
  - [Palatine tonsil](https://en.wikipedia.org/w/index.php?title=Palatine_tonsil&oldid=1384978432): “between the palatoglossal arch and the palatopharyngeal arch of the soft palate”
- **Drena en.** Su linfa llega primero a los nodos yugulodigástricos.
  - [Jugulodigastric lymph node](https://en.wikipedia.org/w/index.php?title=Jugulodigastric_lymph_node&oldid=1292012926): “are the first to receive lymphatic drainage from face, mouth, pharynx, and tonsils”
- **En este modelo.** Pieza de Z-Anatomy ajustada al cuerpo de Anato3D.
  - *Modelo 3D (Anato3D)*
- **Puntos clave.** Su inflamación es la amigdalitis, y en ella suelen aumentar los nodos yugulodigástricos.
  - [Palatine tonsil](https://en.wikipedia.org/w/index.php?title=Palatine_tonsil&oldid=1384978432): “Tonsillitis is an inflammation of the tonsils”
  - [Jugulodigastric lymph node](https://en.wikipedia.org/w/index.php?title=Jugulodigastric_lymph_node&oldid=1292012926): “Enlarged jugulodigastric lymph nodes are also commonly found in tonsillitis.”
- **Puntos clave.** Alcanza su mayor tamaño en la pubertad y después se atrofia poco a poco.
  - [Tonsil](https://en.wikipedia.org/w/index.php?title=Tonsil&oldid=1383463067): “The palatine tonsils tend to reach their largest size in puberty, and they gradually undergo atrophy thereafter.”
- **Recibe: pendiente.** Ninguna de las fuentes libres consultadas dice qué vasos linfáticos llegan a ella; no se afirma nada.
- *Vías (claves)*: recibe —; drena Jugulodigastric_node.

### Amígdala faríngea (`Pharyngeal_tonsil`)

Nombre: TA2 n.º 2865.

- **Descripción.** Masa de tejido linfoide detrás de la cavidad nasal, en el techo y la pared posterior de la nasofaringe; también se llama adenoides.
  - [Adenoid](https://en.wikipedia.org/w/index.php?title=Adenoid&oldid=1341004883): “It is a mass of lymphoid tissue located behind the nasal cavity, in the roof and the posterior wall of the nasopharynx”
  - [Adenoid](https://en.wikipedia.org/w/index.php?title=Adenoid&oldid=1341004883): “The adenoid, also known as the pharyngeal tonsil”
- **Descripción.** Es la más alta de las amígdalas.
  - [Adenoid](https://en.wikipedia.org/w/index.php?title=Adenoid&oldid=1341004883): “is the superior-most of the tonsils”
- **Descripción.** Tras el nacimiento crece hasta los 5 a 7 años.
  - [Adenoid](https://en.wikipedia.org/w/index.php?title=Adenoid&oldid=1341004883): “After birth, enlargement begins and continues until the ages of 5 to 7 years.”
- **Localización.** En el techo de la nasofaringe, bajo el hueso esfenoides.
  - [Waldeyer's tonsillar ring](https://en.wikipedia.org/w/index.php?title=Waldeyer's_tonsillar_ring&oldid=1364974513): “located on the roof of the nasopharynx, under the sphenoid bone”
- **Reparo.** El hueso esfenoides, por encima; en los niños forma un relieve blando justo por encima y por detrás de la úvula.
  - [Waldeyer's tonsillar ring](https://en.wikipedia.org/w/index.php?title=Waldeyer's_tonsillar_ring&oldid=1364974513): “under the sphenoid bone”
  - [Adenoid](https://en.wikipedia.org/w/index.php?title=Adenoid&oldid=1341004883): “just above and behind the uvula”
- **Drena en.** La linfa de la nasofaringe va a los nodos retrofaríngeos.
  - [Retropharyngeal lymph nodes](https://en.wikipedia.org/w/index.php?title=Retropharyngeal_lymph_nodes&oldid=1224152509): “Their afferents drain the nasal cavities, the nasal part of the pharynx”
- **En este modelo.** Z-Anatomy no la incluye: si aparece en el modelo, es una forma generada para Anato3D, con tamaño y posición esquemáticos.
  - *Modelo 3D (Anato3D)*
- **Puntos clave.** Cuando crece mucho (hipertrofia adenoidea) puede bloquear el paso del aire por la nariz.
  - [Adenoid](https://en.wikipedia.org/w/index.php?title=Adenoid&oldid=1341004883): “completely block airflow through the nasal passages”
- **Recibe: pendiente.** Ninguna de las fuentes libres consultadas dice qué vasos linfáticos llegan a ella; no se afirma nada.
- *Vías (claves)*: recibe —; drena Retropharyngeal_nodes.

### Amígdala lingual (`Lingual_tonsil`)

Nombre: TA2 n.º 2830.

- **Descripción.** Acúmulo de tejido linfoide en la lámina propia de la raíz de la lengua.
  - [Lingual tonsils](https://en.wikipedia.org/w/index.php?title=Lingual_tonsils&oldid=1326382552): “are a collection of lymphoid tissue located in the lamina propria of the root of the tongue”
- **Descripción.** Está formada por varias pequeñas prominencias; por eso muchos autores hablan de amígdalas linguales, en plural.
  - [Waldeyer's tonsillar ring](https://en.wikipedia.org/w/index.php?title=Waldeyer's_tonsillar_ring&oldid=1364974513): “Many authors also speak of lingual tonsils (in the plural), because this accumulation of lymphoid tissue consists of several little prominences”
- **Localización.** En la parte posterior de la lengua.
  - [Waldeyer's tonsillar ring](https://en.wikipedia.org/w/index.php?title=Waldeyer's_tonsillar_ring&oldid=1364974513): “located on the back part of the tongue”
- **Reparo.** La raíz de la lengua: la amígdala está en su lámina propia.
  - [Lingual tonsils](https://en.wikipedia.org/w/index.php?title=Lingual_tonsils&oldid=1326382552): “located in the lamina propria of the root of the tongue”
- **Drena en.** Como las demás amígdalas, drena primero en los nodos yugulodigástricos.
  - [Jugulodigastric lymph node](https://en.wikipedia.org/w/index.php?title=Jugulodigastric_lymph_node&oldid=1292012926): “are the first to receive lymphatic drainage from face, mouth, pharynx, and tonsils”
- **En este modelo.** Z-Anatomy no la incluye: si aparece en el modelo, es una forma generada para Anato3D, con tamaño y posición esquemáticos.
  - *Modelo 3D (Anato3D)*
- **En este modelo.** Se representa como una sola pieza, aunque es un conjunto de pequeñas prominencias.
  - *Modelo 3D (Anato3D)*
- **Recibe: pendiente.** Ninguna de las fuentes libres consultadas dice qué vasos linfáticos llegan a ella; no se afirma nada.
- *Vías (claves)*: recibe —; drena Jugulodigastric_node.

### Amígdala tubárica (`Tubal_tonsil`)

Nombre: TA2 n.º 2872.

- **Descripción.** Acúmulo de tejido linfoide de la nasofaringe, también llamado amígdala de Gerlach; es uno de los cuatro grupos principales del anillo de Waldeyer.
  - [Tubal tonsil](https://en.wikipedia.org/w/index.php?title=Tubal_tonsil&oldid=1224147634): “also known as Gerlach tonsil, is one of the four main tonsil groups forming Waldeyer's tonsillar ring”
- **Descripción.** Suele desarrollarse a partir del tejido linfoide de la amígdala faríngea.
  - [Waldeyer's tonsillar ring](https://en.wikipedia.org/w/index.php?title=Waldeyer's_tonsillar_ring&oldid=1364974513): “The tubal tonsils usually develop from an accumulation of lymphoid tissue in the pharyngeal tonsil.”
- **Localización.** Está detrás del orificio de la trompa auditiva, en la pared lateral de la nasofaringe.
  - [Tubal tonsil](https://en.wikipedia.org/w/index.php?title=Tubal_tonsil&oldid=1224147634): “is located posterior to the opening of the Eustachian tube on the lateral wall of the nasopharynx”
- **Reparo.** El rodete de la trompa (torus tubarius), muy cerca de ella.
  - [Tubal tonsil](https://en.wikipedia.org/w/index.php?title=Tubal_tonsil&oldid=1224147634): “It is very close to the torus tubarius”
- **Drena en.** La linfa de la nasofaringe y de las trompas auditivas va a los nodos retrofaríngeos.
  - [Retropharyngeal lymph nodes](https://en.wikipedia.org/w/index.php?title=Retropharyngeal_lymph_nodes&oldid=1224152509): “Their afferents drain the nasal cavities, the nasal part of the pharynx, and the auditory tubes.”
- **En este modelo.** Z-Anatomy no la incluye: si aparece en el modelo, es una forma generada para Anato3D, con tamaño y posición esquemáticos.
  - *Modelo 3D (Anato3D)*
- **Recibe: pendiente.** Ninguna de las fuentes libres consultadas dice qué vasos linfáticos llegan a ella; no se afirma nada.
- *Vías (claves)*: recibe —; drena Retropharyngeal_nodes.

### Ficha general del nodo linfático (`Lymph_node`)

Nombre: TA2 n.º 5192.

- **Descripción.** Grupo de nodos (ganglios) linfáticos: órganos pequeños, con forma de riñón u ovalada, que filtran la linfa.
  - [Lymph node](https://en.wikipedia.org/w/index.php?title=Lymph_node&oldid=1360517815): “Lymph nodes are kidney or oval shaped”
  - [Lymph node](https://en.wikipedia.org/w/index.php?title=Lymph_node&oldid=1360517815): “acting as filters for foreign particles including cancer cells”
- **Descripción.** Su eje largo mide de 2 a 25 mm, con una media de 15 mm.
  - [Lymph node](https://en.wikipedia.org/w/index.php?title=Lymph_node&oldid=1360517815): “range in size from 2 mm to 25 mm on their long axis, with an average of 15 mm”
- **Descripción.** En ellos se concentran los linfocitos B y T.
  - [Lymph node](https://en.wikipedia.org/w/index.php?title=Lymph_node&oldid=1360517815): “They are major sites of lymphocytes that include B and T cells.”
- **Localización.** En el adulto hay unos 450, agrupados por regiones y más concentrados en el tronco; la mayoría están junto a otras estructuras grandes, como la aorta o la tráquea.
  - [Lymph node](https://en.wikipedia.org/w/index.php?title=Lymph_node&oldid=1360517815): “There are about 450 lymph nodes in the adult.”
  - [Lymph node](https://en.wikipedia.org/w/index.php?title=Lymph_node&oldid=1360517815): “are more concentrated near and within the trunk, and are divided into groups”
  - [Lymph node](https://en.wikipedia.org/w/index.php?title=Lymph_node&oldid=1360517815): “Most lymph nodes lie within the trunk adjacent to other major structures in the body - such as the paraaortic lymph nodes and the tracheobronchial lymph nodes”
- **Reparo.** Algunos se pueden palpar cuando aumentan de tamaño, y a veces sin aumentar: los axilares, los del cuello y los inguinales.
  - [Lymph node](https://en.wikipedia.org/w/index.php?title=Lymph_node&oldid=1360517815): “Some lymph nodes can be felt when enlarged (and occasionally when not), such as the axillary lymph nodes under the arm, the cervical lymph nodes of the head and neck and the inguinal lymph nodes near the groin crease.”
- **Recibe.** La linfa entra por el lado convexo del nodo a través de varios vasos aferentes.
  - [Lymph node](https://en.wikipedia.org/w/index.php?title=Lymph_node&oldid=1360517815): “Lymph enters the convex side of a lymph node through multiple afferent lymphatic vessels”
- **Drena en.** Sale por los vasos eferentes, que abandonan el nodo por el hilio, en su lado cóncavo; de allí va a otro nodo, a una vena o a un conducto linfático mayor.
  - [Lymph node](https://en.wikipedia.org/w/index.php?title=Lymph_node&oldid=1360517815): “exiting at the hilum on the concave side”
  - [Lymphatic vessel](https://en.wikipedia.org/w/index.php?title=Lymphatic_vessel&oldid=1324604892): “from where the lymph may travel to another lymph node, may be returned to a vein, or may travel to a larger lymph duct”
- **En este modelo.** Este grupo aún no tiene ficha propia: esta es la ficha general del nodo linfático.
  - *Modelo 3D (Anato3D)*
- **En este modelo.** En este modelo la forma y el tamaño de cada nodo, y el número de nodos de cada grupo, son esquemáticos: no son medidas de una persona.
  - *Modelo 3D (Anato3D)*
- **Puntos clave.** Cuando se inflaman o aumentan de tamaño (linfadenopatía) pueden notarse firmes o dolorosos.
  - [Lymph node](https://en.wikipedia.org/w/index.php?title=Lymph_node&oldid=1360517815): “When inflamed or enlarged, lymph nodes can be firm or tender.”
  - [Lymph node](https://en.wikipedia.org/w/index.php?title=Lymph_node&oldid=1360517815): “Lymphadenopathy refers to glands that are enlarged or swollen.”
- **Puntos clave.** Su estado es muy importante para la estadificación del cáncer.
  - [Lymph node](https://en.wikipedia.org/w/index.php?title=Lymph_node&oldid=1360517815): “The condition of lymph nodes is very important in cancer staging”

### Lóbulo derecho del timo (`Right_lobe_of_thymus`)

Nombre: TA2 n.º 7223.

- **Descripción.** Lóbulo del timo, el órgano linfoide primario en el que maduran los linfocitos T.
  - [Thymus](https://en.wikipedia.org/w/index.php?title=Thymus&oldid=1382487861): “is a specialized primary lymphoid organ of the immune system”
  - [Thymus](https://en.wikipedia.org/w/index.php?title=Thymus&oldid=1382487861): “Within the thymus, T cells mature.”
- **Descripción.** El timo tiene dos lóbulos; cada uno tiene una médula central y una corteza externa, rodeadas por una cápsula.
  - [Thymus](https://en.wikipedia.org/w/index.php?title=Thymus&oldid=1382487861): “It is made up of two lobes, each consisting of a central medulla and an outer cortex, surrounded by a capsule.”
- **Descripción.** Los dos lóbulos difieren algo de tamaño, y el izquierdo suele estar más alto que el derecho.
  - [Thymus](https://en.wikipedia.org/w/index.php?title=Thymus&oldid=1382487861): “The two lobes differ slightly in size, with the left lobe usually higher than the right.”
- **Localización.** Está en el mediastino anterior y superior, detrás del esternón y delante del corazón; los lóbulos van desde debajo de la tiroides hasta el cartílago de la cuarta costilla.
  - [Thymus](https://en.wikipedia.org/w/index.php?title=Thymus&oldid=1382487861): “in the anterior superior mediastinum, behind the sternum, and in front of the heart”
  - [Thymus](https://en.wikipedia.org/w/index.php?title=Thymus&oldid=1382487861): “stretch from below the thyroid in the neck to as low as the cartilage of the fourth rib”
- **Reparo.** Se apoya en el pericardio, y una capa de fascia lo separa del arco aórtico y los grandes vasos; la vena braquiocefálica izquierda puede incluso quedar dentro de él.
  - [Thymus](https://en.wikipedia.org/w/index.php?title=Thymus&oldid=1382487861): “rests on the pericardium, and is separated from the aortic arch and great vessels by a layer of fascia”
  - [Thymus](https://en.wikipedia.org/w/index.php?title=Thymus&oldid=1382487861): “The left brachiocephalic vein may even be embedded within the thymus.”
- **Recibe.** No le llegan vasos linfáticos: los suyos solo salen de él, junto a las arterias y las venas.
  - [Thymus](https://en.wikipedia.org/w/index.php?title=Thymus&oldid=1382487861): “Lymphatic vessels travel only away from the thymus, accompanying the arteries and veins.”
- **Drena en.** Sus vasos linfáticos drenan en los nodos braquiocefálicos, traqueobronquiales y paraesternales.
  - [Thymus](https://en.wikipedia.org/w/index.php?title=Thymus&oldid=1382487861): “These drain into the brachiocephalic, tracheobronchial, and parasternal lymph nodes.”
- **En este modelo.** Pieza de Z-Anatomy ajustada al cuerpo de Anato3D; su tamaño es orientativo.
  - *Modelo 3D (Anato3D)*
- **En este modelo.** El tamaño del timo cambia con la edad: crece hasta la pubertad y desde el comienzo de la adolescencia se reduce y su tejido se va sustituyendo por grasa.
  - [Thymus](https://en.wikipedia.org/w/index.php?title=Thymus&oldid=1382487861): “It increases in size until puberty”
  - [Thymus](https://en.wikipedia.org/w/index.php?title=Thymus&oldid=1382487861): “By the early teens, the thymus begins to decrease in size and activity and its tissue is gradually replaced by fatty tissue.”
- *Vías (claves)*: recibe —; drena Brachiocephalic_nodes, Superior_tracheobronchial_nodes, Parasternal_nodes.

## Grupos

### Nodos linfáticos (`Lymph_nodes`)

Latín formado: *Nodi lymphoidei*.

- **Descripción.** Los nodos (ganglios) linfáticos del cuerpo, por regiones. En el adulto hay unos 450, y la mayoría están en el tronco.
  - [Lymph node](https://en.wikipedia.org/w/index.php?title=Lymph_node&oldid=1360517815): “There are about 450 lymph nodes in the adult.”
  - [Lymph node](https://en.wikipedia.org/w/index.php?title=Lymph_node&oldid=1360517815): “are more concentrated near and within the trunk, and are divided into groups”
- **Descripción.** El drenaje linfático varía de una persona a otra, e incluso entre los dos lados del mismo cuerpo.
  - [Lymph node](https://en.wikipedia.org/w/index.php?title=Lymph_node&oldid=1360517815): “The lymphatic drainage patterns are different from person to person and even asymmetrical on each side of the same body.”
- **Descripción.** En este modelo el número de nodos de cada grupo es representativo, no el real.
  - *Modelo 3D (Anato3D)*

### Nodos de la cabeza (`Lymph_nodes_of_head`)

Latín formado: *Nodi lymphoidei capitis*.

- **Descripción.** Grupos de nodos de la cabeza, casi todos superficiales, como los occipitales, que drenan el cuero cabelludo de la nuca.
  - [Occipital lymph nodes](https://en.wikipedia.org/w/index.php?title=Occipital_lymph_nodes&oldid=1315085330): “a group of 1-3 superficial lymph nodes of the head situated in the occipital region that drain part of the scalp of the occiput”
- **Descripción.** Toda la linfa de la cabeza acaba en los nodos cervicales profundos, directamente o a través de otros nodos.
  - [Deep cervical lymph nodes](https://en.wikipedia.org/w/index.php?title=Deep_cervical_lymph_nodes&oldid=1322812686): “All lymphatic vessels of the head and neck ultimately drain to the deep cervical lymph nodes - either by way of other lymph nodes or directly from tissues.”
- **Descripción.** En este modelo el número de nodos de cada grupo es representativo, no el real.
  - *Modelo 3D (Anato3D)*

### Nodos del cuello (`Lymph_nodes_of_neck`)

Latín formado: *Nodi lymphoidei colli*.

- **Descripción.** En el cuello hay unos 300 nodos.
  - [Cervical lymph nodes](https://en.wikipedia.org/w/index.php?title=Cervical_lymph_nodes&oldid=1360586838): “There are approximately 300 lymph nodes in the neck”
- **Descripción.** La cadena cervical profunda acompaña a la vena yugular interna dentro de la vaina carotídea, y sus eferentes forman el tronco yugular de su lado.
  - [Deep cervical lymph nodes](https://en.wikipedia.org/w/index.php?title=Deep_cervical_lymph_nodes&oldid=1322812686): “form a chain along the internal jugular vein within the carotid sheath”
  - [Deep cervical lymph nodes](https://en.wikipedia.org/w/index.php?title=Deep_cervical_lymph_nodes&oldid=1322812686): “Efferents of the deep cervical lymph nodes form the ipsilateral jugular trunk.”
- **Descripción.** Los cervicales superficiales están cerca de la superficie, junto a la vena yugular externa.
  - [Superficial cervical lymph nodes](https://en.wikipedia.org/w/index.php?title=Superficial_cervical_lymph_nodes&oldid=1252113728): “lie near the surface of the neck”
  - [Superficial cervical lymph nodes](https://en.wikipedia.org/w/index.php?title=Superficial_cervical_lymph_nodes&oldid=1252113728): “Some sources state simply that they lie along the external jugular vein”
- **Descripción.** En clínica se usan niveles numerados; este modelo sigue los grupos de la Terminologia Anatomica.
  - [Cervical lymph nodes](https://en.wikipedia.org/w/index.php?title=Cervical_lymph_nodes&oldid=1360586838): “The most commonly used system is one based on a classification of the lymph nodes into numbered groupings”
  - *Modelo 3D (Anato3D)*
- **Descripción.** En este modelo el número de nodos de cada grupo es representativo, no el real.
  - *Modelo 3D (Anato3D)*

### Nodos del miembro superior (`Lymph_nodes_of_upper_limb`)

Latín formado: *Nodi lymphoidei membri superioris*.

- **Descripción.** Los nodos axilares, entre 20 y 49, reciben los vasos del miembro superior, de los cuadrantes laterales de la mama y de la pared del tórax y del abdomen por encima del ombligo.
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “Between 20 and 49 in number, they drain lymph vessels from the lateral quadrants of the breast”
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “the superficial lymph vessels from thin walls of the chest and the abdomen above the level of the navel, and the vessels from the upper limb”
- **Descripción.** Fuera de la axila hay nodos más pequeños: los supratrocleares, por encima del epicóndilo medial, y los infraclaviculares (deltopectorales), junto a la vena cefálica.
  - [Supratrochlear lymph nodes](https://en.wikipedia.org/w/index.php?title=Supratrochlear_lymph_nodes&oldid=1383412698): “are placed above the medial epicondyle of the humerus”
  - [Deltopectoral lymph nodes](https://en.wikipedia.org/w/index.php?title=Deltopectoral_lymph_nodes&oldid=1224153162): “are found beside the cephalic vein”
- **Descripción.** Alrededor del 75 % de la linfa de la mama drena en los nodos axilares.
  - [Axillary lymph nodes](https://en.wikipedia.org/w/index.php?title=Axillary_lymph_nodes&oldid=1301012830): “About 75% of lymph from the breasts drains into the axillary lymph nodes”
- **Descripción.** En este modelo el número de nodos de cada grupo es representativo, no el real.
  - *Modelo 3D (Anato3D)*

### Nodos del tórax (`Thoracic_lymph_nodes`)

Latín formado: *Nodi lymphoidei thoracis*.

- **Descripción.** La Terminologia Anatomica divide los nodos del tórax en parietales, en la pared, y en mediastínicos y pulmonares.
  - TA2 n.º 5248
  - TA2 n.º 5254
  - TA2 n.º 5265
- **Descripción.** Los paraesternales están en el extremo anterior de los espacios intercostales, junto a la arteria torácica interna, y los intercostales en la parte posterior de esos espacios.
  - [Parasternal lymph nodes](https://en.wikipedia.org/w/index.php?title=Parasternal_lymph_nodes&oldid=1224153266): “are placed at the anterior ends of the intercostal spaces, by the side of the internal thoracic artery”
  - [Intercostal lymph nodes](https://en.wikipedia.org/w/index.php?title=Intercostal_lymph_nodes&oldid=1224153313): “occupy the posterior parts of the intercostal spaces”
- **Descripción.** Alrededor de la bifurcación de la tráquea están los traqueobronquiales; en el hilio de cada pulmón, los broncopulmonares; y dentro del pulmón, los intrapulmonares.
  - [Tracheobronchial lymph nodes](https://en.wikipedia.org/w/index.php?title=Tracheobronchial_lymph_nodes&oldid=1380892676): “are located around the division of trachea and main bronchi”
  - [Tracheobronchial lymph nodes](https://en.wikipedia.org/w/index.php?title=Tracheobronchial_lymph_nodes&oldid=1380892676): “Bronchopulmonary nodes (hilar nodes) situate in the hilum of each lung.”
  - [Tracheobronchial lymph nodes](https://en.wikipedia.org/w/index.php?title=Tracheobronchial_lymph_nodes&oldid=1380892676): “Pulmonary nodes are embedded the lung substance on the larger branches of the bronchi.”
- **Descripción.** En este modelo no hay nodos broncopulmonares (hiliares): Z-Anatomy no los trae.
  - TA2 n.º 5266
  - *Modelo 3D (Anato3D)*
- **Descripción.** En este modelo el número de nodos de cada grupo es representativo, no el real.
  - *Modelo 3D (Anato3D)*

### Nodos del abdomen (`Abdominal_lymph_nodes`)

Latín formado: *Nodi lymphoidei abdominis*.

- **Descripción.** La Terminologia Anatomica divide los nodos del abdomen en parietales y viscerales.
  - TA2 n.º 5269
  - TA2 n.º 5281
- **Descripción.** Los preaórticos están delante de la aorta, alrededor del origen del tronco celíaco y de las arterias mesentéricas superior e inferior, y reciben la linfa de los órganos que irrigan esas arterias.
  - [Preaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Preaortic_lymph_nodes&oldid=1336732047): “The preaortic lymph nodes lie in front of the aorta”
  - [Preaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Preaortic_lymph_nodes&oldid=1336732047): “arranged around the origins of the corresponding arteries”
  - [Preaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Preaortic_lymph_nodes&oldid=1336732047): “their principal afferents are derived from the organs supplied by the three arteries with which they are associated”
- **Descripción.** Los lumbares, a los lados de la aorta y la vena cava inferior, reciben la linfa de la pelvis, los riñones y las gónadas, y sus eferentes forman los troncos lumbares.
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “the efferents of the common iliac lymph nodes”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “the lymphatics from the kidney and suprarenal gland”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “the lymphatics from the testis in the male, and from the ovary”
  - [Periaortic lymph nodes](https://en.wikipedia.org/w/index.php?title=Periaortic_lymph_nodes&oldid=1320392388): “converge to form the right and left lumbar trunks”
- **Descripción.** En este modelo el número de nodos de cada grupo es representativo, no el real.
  - *Modelo 3D (Anato3D)*

### Nodos de la pelvis (`Pelvic_lymph_nodes`)

Latín formado: *Nodi lymphoidei pelvis*.

- **Descripción.** Los nodos de la pelvis acompañan a las arterias ilíacas: los ilíacos comunes, por detrás y a los lados de la ilíaca común; los externos, a lo largo de los vasos ilíacos externos; y los internos, alrededor de la ilíaca interna y sus ramas.
  - [Common iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Common_iliac_lymph_nodes&oldid=1238348833): “are grouped behind and on the sides of the common iliac artery”
  - [External iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=External_iliac_lymph_nodes&oldid=1223684511): “lie along the external iliac vessels”
  - [Internal iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Internal_iliac_lymph_nodes&oldid=1358630094): “surround the internal iliac artery and its branches”
- **Descripción.** Los internos reciben la linfa de todas las vísceras de la pelvis, de la parte profunda del periné y de la nalga y la parte posterior del muslo.
  - [Internal iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Internal_iliac_lymph_nodes&oldid=1358630094): “they receive lymphatics from all the pelvic viscera, from the deeper parts of the perineum”
  - [Internal iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Internal_iliac_lymph_nodes&oldid=1358630094): “from the buttock and back of the thigh”
- **Descripción.** La linfa del ovario y del testículo no pasa por ellos: va a los nodos lumbares.
  - [Internal iliac lymph nodes](https://en.wikipedia.org/w/index.php?title=Internal_iliac_lymph_nodes&oldid=1358630094): “It does not receive lymph from the ovary or testis, which drain to the paraaortic lymph nodes.”
- **Descripción.** En este modelo el número de nodos de cada grupo es representativo, no el real.
  - *Modelo 3D (Anato3D)*

### Nodos del miembro inferior (`Lymph_nodes_of_lower_limb`)

Latín formado: *Nodi lymphoidei membri inferioris*.

- **Descripción.** Los nodos inguinales están en el triángulo femoral: los superficiales, alrededor del hiato safeno, y los profundos, de 3 a 5, mediales a la vena femoral.
  - [Inguinal lymph nodes](https://en.wikipedia.org/w/index.php?title=Inguinal_lymph_nodes&oldid=1330887775): “They are situated in the femoral triangle of the inguinal region.”
  - [Inguinal lymph nodes](https://en.wikipedia.org/w/index.php?title=Inguinal_lymph_nodes&oldid=1330887775): “located at the middle of the saphenous opening”
  - [Inguinal lymph nodes](https://en.wikipedia.org/w/index.php?title=Inguinal_lymph_nodes&oldid=1330887775): “The deep inguinal lymph nodes are 3-5 in number.”
  - [Inguinal lymph nodes](https://en.wikipedia.org/w/index.php?title=Inguinal_lymph_nodes&oldid=1330887775): “They lie medial to the femoral vein deep to the cribriform fascia.”
- **Descripción.** Los poplíteos, unos seis o siete, están en la grasa de la fosa poplítea.
  - [Popliteal lymph nodes](https://en.wikipedia.org/w/index.php?title=Popliteal_lymph_nodes&oldid=1277704248): “some six or seven in number, are embedded in the fat contained in the popliteal fossa”
- **Descripción.** Los inguinales profundos drenan hacia arriba en los ilíacos externos.
  - [Inguinal lymph nodes](https://en.wikipedia.org/w/index.php?title=Inguinal_lymph_nodes&oldid=1330887775): “The deep inguinal lymph nodes drain superiorly to the external iliac lymph nodes”
- **Descripción.** En este modelo el número de nodos de cada grupo es representativo, no el real.
  - *Modelo 3D (Anato3D)*

### Troncos y conductos linfáticos (`Lymphatic_trunks_and_ducts`)

Latín formado: *Trunci et ductus lymphatici*.

- **Descripción.** Los grandes vasos linfáticos: los troncos que reúnen la linfa de cada región y los dos conductos que la devuelven a la sangre.
  - [Lymphatic system](https://en.wikipedia.org/w/index.php?title=Lymphatic_system&oldid=1379857409): “Lymph then passes into much larger lymph vessels known as lymph ducts.”
  - [Lymph duct](https://en.wikipedia.org/w/index.php?title=Lymph_duct&oldid=1320936601): “A lymph duct (or lymphatic duct) is a great lymphatic vessel that empties lymph into one of the subclavian veins.”
- **Descripción.** El conducto torácico recoge la linfa de casi todo el cuerpo, y el conducto linfático derecho, la del miembro superior derecho y la mitad derecha de la cabeza, el cuello y el tórax.
  - [Thoracic duct](https://en.wikipedia.org/w/index.php?title=Thoracic_duct&oldid=1360742155): “It also collects most of the lymph in the body”
  - [Lymph duct](https://en.wikipedia.org/w/index.php?title=Lymph_duct&oldid=1320936601): “The right lymphatic duct drains lymph from the right upper limb, right side of thorax and right halves of head and neck.”
- **Descripción.** Cada conducto desemboca en el ángulo venoso de su lado, donde la yugular interna y la subclavia se unen para formar la vena braquiocefálica.
  - [Venous angle](https://en.wikipedia.org/w/index.php?title=Venous_angle&oldid=1341405227): “is the junction where the ipsilateral internal jugular vein and subclavian vein unite to form the ipsilateral brachiocephalic vein”
  - [Venous angle](https://en.wikipedia.org/w/index.php?title=Venous_angle&oldid=1341405227): “The thoracic duct drains at the left venous angle, and the right lymphatic duct drains at the right venous angle.”
- **Descripción.** En este modelo todos son trazados esquemáticos generados para Anato3D, porque Z-Anatomy no los incluye; cada ficha dice qué variante se representa.
  - *Modelo 3D (Anato3D)*

### Vasos linfáticos (`Lymphatic_vessels`)

Latín formado: *Vasa lymphatica*.

- **Descripción.** Vasos de pared fina que llevan la linfa; tienen válvulas.
  - [Lymphatic vessel](https://en.wikipedia.org/w/index.php?title=Lymphatic_vessel&oldid=1324604892): “are thin-walled vessels (tubes), structured like blood vessels, that carry lymph”
  - [Lymphatic vessel](https://en.wikipedia.org/w/index.php?title=Lymphatic_vessel&oldid=1324604892): “The lymphatic vessels contain valves.”
- **Descripción.** Los que llegan a un nodo se llaman aferentes, y los que salen de él, eferentes.
  - [Lymphatic vessel](https://en.wikipedia.org/w/index.php?title=Lymphatic_vessel&oldid=1324604892): “Lymph vessels that carry lymph to a lymph node are called afferent lymph vessels, and those that carry it from a lymph node are called efferent lymph vessels”
- **Descripción.** En este modelo son colectores esquemáticos: una malla por región y lado que une los nodos entre sí y con su tronco, sin representar cada vaso real.
  - *Modelo 3D (Anato3D)*

### Anillo linfático de la faringe (`Pharyngeal_lymphoid_ring`)

Latín formado: *Anulus lymphoideus pharyngis*.

- **Descripción.** Anillo de órganos linfoides en la faringe (anillo de Waldeyer): la amígdala faríngea, las dos tubáricas, las dos palatinas y las linguales.
  - [Waldeyer's tonsillar ring](https://en.wikipedia.org/w/index.php?title=Waldeyer's_tonsillar_ring&oldid=1364974513): “is a ringed arrangement of lymphoid organs in the pharynx”
  - [Tonsil](https://en.wikipedia.org/w/index.php?title=Tonsil&oldid=1383463067): “consists of the adenoid tonsil (or pharyngeal tonsil), two tubal tonsils, two palatine tonsils, and the lingual tonsils”
- **Descripción.** Rodea la nasofaringe y la orofaringe, con parte de su tejido por encima del paladar blando y parte por debajo.
  - [Waldeyer's tonsillar ring](https://en.wikipedia.org/w/index.php?title=Waldeyer's_tonsillar_ring&oldid=1364974513): “Waldeyer's ring surrounds the naso- and oropharynx, with some of its tonsillar tissue located above and some below the soft palate”
- **Descripción.** Z-Anatomy solo trae las amígdalas palatinas; las demás, si aparecen en este modelo, son formas esquemáticas generadas para Anato3D.
  - *Modelo 3D (Anato3D)*

### Timo (`Thymus`)

Latín formado: *Thymus*.

- **Descripción.** Órgano linfoide primario en el que maduran los linfocitos T, formado por dos lóbulos.
  - [Thymus](https://en.wikipedia.org/w/index.php?title=Thymus&oldid=1382487861): “is a specialized primary lymphoid organ of the immune system”
  - [Thymus](https://en.wikipedia.org/w/index.php?title=Thymus&oldid=1382487861): “Within the thymus, T cells mature.”
  - [Thymus](https://en.wikipedia.org/w/index.php?title=Thymus&oldid=1382487861): “It is made up of two lobes”
- **Descripción.** Está en el mediastino anterior y superior, detrás del esternón y delante del corazón.
  - [Thymus](https://en.wikipedia.org/w/index.php?title=Thymus&oldid=1382487861): “in the anterior superior mediastinum, behind the sternum, and in front of the heart”

