---
title: Fuentes de las fichas de vasos y nervios
date: 2026-11-08
---

# Fuentes de las fichas de vasos y nervios (2026-11-08)

Qué página dice cada frase de las fichas de los vasos, el corazón y el sistema nervioso (con el ojo y el oído), con un fragmento corto de la frase para encontrarla. La app muestra estas páginas en el apartado «Fuentes» de cada ficha (`fuentesVaso` y `fuentesNervio`, en `web/src/data/fuentes.js`); el texto está en `web/src/data/vasos.js` y `web/src/data/nervios.js`. La etimología no está aquí: se genera del nombre latino con el glosario de la app.

## Cómo se comprobó

1. **Fichas que ya existían: lectura con citas literales.** Diez agentes de lectura web leyeron las páginas de cada ficha y devolvieron, para cada frase de la descripción, de la función y de los puntos clave (291 en total), un veredicto y la frase copiada tal cual de la página: 161 *sí*, 126 *en parte* y 4 *no*.
2. **Comprobación mecánica de esas citas.** Todas se buscaron en el texto de su página: 279 en el texto del artículo, 4 en el recuadro de datos y 1 en el pie de una imagen. Cinco veredictos no traían cita (los cuatro *no* y la etimología del nervio vago, que se encontró después en la página) y 2 citas no estaban en la página (las de la rama ovárica de la arteria uterina): esas frases se reescribieron con otra cita.
3. **Reescritura.** Lo que la página decía solo en parte se reescribió para decir solo eso, y lo que no decía ninguna página se quitó: 161 frases cambiaron. Por ejemplo, la vena cava inferior ya no es «la vena más grande del cuerpo», el trigémino ya no es «el par craneal más grueso» sino el más complejo, el cuerpo calloso tiene de 200 a 300 millones de axones (no «unos 200 millones»), el hipocampo no «significa» caballito de mar (Aranzi lo comparó con uno), y una lesión limitada al área de Broca no basta para causar la afasia de Broca. Se quitaron el nervio femoral como «responsable del reflejo rotuliano», los atlas que pintan los nervios de amarillo y el herpes zóster en la ficha de los nervios intercostales.
4. **Fichas nuevas.** 108 fichas propias para vasos y nervios que solo tenían el texto general de su tipo (64 vasos y 44 nervios): todas las arterias y venas que el modelo marca como principales y los nervios con nombre del trigémino, del plexo braquial y de los miembros. Se escribieron a partir de la entradilla y el apartado clínico de su página, frase a frase, cada una con el fragmento literal que la respalda (marcadas **nueva** en su apartado).
5. **Comprobación completa.** Todas las referencias de las frases reescritas y de las fichas nuevas se buscaron en el texto de su página (o en la página completa, si están en el recuadro de datos): estaban todas. En total, 758 citas en 239 fichas.

Cada frase lleva la página y el comienzo de la cita; **(reescrita)** marca el texto que cambió el 2026-11-08. Los fragmentos están en inglés, como en la página, y son cortos a propósito (Wikipedia, CC BY-SA 4.0). Esto no sustituye a la revisión de un especialista: dice que cada frase está en una fuente pública, no que la fuente tenga razón.

## Vasos y corazón: descripciones por tipo

### Tipo «Arteria» (`TIPO.artery`)

Fuentes: [Artery](https://en.wikipedia.org/wiki/Artery).

- **Descripción.** Vaso que lleva la sangre desde el corazón hacia los tejidos.
  - [Artery](https://en.wikipedia.org/wiki/Artery): “Arteries carry oxygenated blood away from the heart to the tissues”
- **Descripción (sigue).** Sus paredes tienen músculo liso y tejido elástico para soportar la presión de la sangre. **(reescrita)**
  - [Artery](https://en.wikipedia.org/wiki/Artery): “To withstand and adapt to the pressures within, arteries are surrounded by varying thicknesses…”
- **Punto clave.** En el modelo, las arterias son rojas: salvo las pulmonares, llevan sangre rica en oxígeno. **(reescrita)**
  - El color es el que usa el modelo de la app; lo que dice de la sangre está en la cita.
  - [Artery](https://en.wikipedia.org/wiki/Artery): “Arteries carry oxygenated blood away from the heart to the tissues, except for pulmonary…”

### Tipo «Arteria pulmonar» (`TIPO.pulmonary_artery`)

Fuentes: [Pulmonary artery](https://en.wikipedia.org/wiki/Pulmonary_artery).

- **Descripción.** Lleva sangre pobre en oxígeno desde el ventrículo derecho hacia los pulmones, donde se oxigena.
  - [Pulmonary artery](https://en.wikipedia.org/wiki/Pulmonary_artery): “The pulmonary artery carries deoxygenated blood from the right ventricle to the lungs.”
- **Punto clave.** En el modelo es azul porque, aunque es una arteria, lleva sangre pobre en oxígeno. **(reescrita)**
  - El color es el que usa el modelo de la app; lo que dice de la sangre está en la cita.
  - [Pulmonary artery](https://en.wikipedia.org/wiki/Pulmonary_artery): “The pulmonary artery carries deoxygenated blood from the right ventricle to the lungs.”

### Tipo «Vena» (`TIPO.vein`)

Fuentes: [Vein](https://en.wikipedia.org/wiki/Vein).

- **Descripción.** Vaso que devuelve la sangre de los tejidos al corazón.
  - [Vein](https://en.wikipedia.org/wiki/Vein): “Most veins carry deoxygenated blood from the tissues back to the heart; exceptions are…”
- **Descripción (sigue).** Sus paredes son más finas que las de las arterias, y muchas tienen válvulas que impiden que la sangre retroceda.
  - [Vein](https://en.wikipedia.org/wiki/Vein): “Because of their thinner walls and wider lumens they are able to expand and…”
- **Punto clave.** En el modelo, las venas son azules: salvo las pulmonares, llevan sangre pobre en oxígeno. **(reescrita)**
  - El color es el que usa el modelo de la app; lo que dice de la sangre está en la cita.
  - [Vein](https://en.wikipedia.org/wiki/Vein): “Most veins carry deoxygenated blood from the tissues back to the heart; exceptions are…”
- **Punto clave.** En realidad, la sangre de las venas es de color rojo oscuro: las de la piel se ven azuladas por cómo la piel dispersa la luz y por cómo el cerebro procesa lo que vemos. **(reescrita)**
  - [Vein](https://en.wikipedia.org/wiki/Vein): “related to the light-scattering properties of the skin and the processing of visual input…”

### Tipo «Vena pulmonar» (`TIPO.pulmonary_vein`)

Fuentes: [Pulmonary vein](https://en.wikipedia.org/wiki/Pulmonary_vein).

- **Descripción.** Devuelve la sangre recién oxigenada desde los pulmones hasta el atrio (aurícula) izquierdo.
  - [Pulmonary vein](https://en.wikipedia.org/wiki/Pulmonary_vein): “The pulmonary veins play an essential role in respiration, by receiving blood that has…”
- **Punto clave.** En el modelo es roja porque, aunque es una vena, lleva sangre rica en oxígeno. **(reescrita)**
  - El color es el que usa el modelo de la app; lo que dice de la sangre está en la cita.
  - [Pulmonary vein](https://en.wikipedia.org/wiki/Pulmonary_vein): “The pulmonary veins are the veins that transfer oxygenated blood from the lungs to…”

### Tipo «Corazón» (`TIPO.heart`)

Fuentes: [Heart](https://en.wikipedia.org/wiki/Heart).

- **Descripción.** Parte del corazón, el órgano muscular que bombea la sangre por los vasos sanguíneos. **(reescrita)**
  - [Heart](https://en.wikipedia.org/wiki/Heart): “The heart is a muscular organ found in humans and other animals.”
  - [Heart](https://en.wikipedia.org/wiki/Heart): “This organ pumps blood through the blood vessels.”
- **Descripción (sigue).** En reposo, el corazón adulto late unas 72 veces por minuto. **(reescrita)**
  - [Heart](https://en.wikipedia.org/wiki/Heart): “The adult heart beats at a resting rate close to 72 beats per minute.”

### Tipo «Válvula cardíaca» (`TIPO.valve`)

Fuentes: [Heart valve](https://en.wikipedia.org/wiki/Heart_valve), [Heart sounds](https://en.wikipedia.org/wiki/Heart_sounds).

- **Descripción.** Válvula del corazón: sus velos (valvas) se abren para dejar pasar la sangre y se cierran para que no retroceda, de modo que la sangre circula en un solo sentido. **(reescrita)**
  - [Heart valve](https://en.wikipedia.org/wiki/Heart_valve): “which are pushed open to allow blood flow and which then close together to…”
  - [Heart valve](https://en.wikipedia.org/wiki/Heart_valve): “allows blood to flow in one direction through the chambers of the heart”
- **Punto clave.** El cierre de las válvulas produce los ruidos del corazón que se oyen con el estetoscopio.
  - [Heart sounds](https://en.wikipedia.org/wiki/Heart_sounds): “Specifically, the sounds reflect the turbulence created when the heart valves snap shut.”

## Vasos y corazón: fichas que ya existían

### Aorta ascendente (`Ascending_aorta`)

Fuentes: [Ascending aorta](https://en.wikipedia.org/wiki/Ascending_aorta), [Aorta](https://en.wikipedia.org/wiki/Aorta).

- **Descripción.** Primer tramo de la aorta, desde el ventrículo izquierdo hasta el arco.
  - [Ascending aorta](https://en.wikipedia.org/wiki/Ascending_aorta): “The ascending aorta (AAo) is a portion of the aorta commencing at the upper…”
- **Descripción (sigue).** La aorta es la arteria más grande del cuerpo: sale del ventrículo izquierdo y reparte la sangre oxigenada a todo el organismo.
  - [Aorta](https://en.wikipedia.org/wiki/Aorta): “The aorta distributes oxygenated blood to all parts of the body through the systemic…”
- **Punto clave.** De su raíz salen las arterias coronarias, que irrigan el propio corazón.
  - [Ascending aorta](https://en.wikipedia.org/wiki/Ascending_aorta): “The only branches of the ascending aorta are the two coronary arteries which supply…”

### Arco aórtico (`Aortic_arch`)

Fuentes: [Aortic arch](https://en.wikipedia.org/wiki/Aortic_arch), [Aorta](https://en.wikipedia.org/wiki/Aorta).

- **Descripción.** Parte de la aorta entre la aorta ascendente y la descendente. **(reescrita)**
  - [Aortic arch](https://en.wikipedia.org/wiki/Aortic_arch): “is the part of the aorta between the ascending and descending aorta”
- **Descripción (sigue).** La aorta es la arteria más grande del cuerpo: sale del ventrículo izquierdo y reparte la sangre oxigenada a todo el organismo.
  - [Aorta](https://en.wikipedia.org/wiki/Aorta): “The aorta distributes oxygenated blood to all parts of the body through the systemic…”
- **Punto clave.** De él salen el tronco braquiocefálico, la carótida común izquierda y la subclavia izquierda.
  - [Aortic arch](https://en.wikipedia.org/wiki/Aortic_arch): “The aortic arch has three branches, the brachiocephalic trunk, left common carotid artery, and…” (en el recuadro de datos de la página)

### Aorta torácica (`Thoracic_aorta`)

Fuentes: [Thoracic aorta](https://en.wikipedia.org/wiki/Thoracic_aorta), [Aorta](https://en.wikipedia.org/wiki/Aorta).

- **Descripción.** Tramo de la aorta que desciende por el tórax, junto a la columna.
  - [Thoracic aorta](https://en.wikipedia.org/wiki/Thoracic_aorta): “The descending thoracic aorta begins at the lower border of the fourth thoracic vertebra…”
- **Descripción (sigue).** La aorta es la arteria más grande del cuerpo: sale del ventrículo izquierdo y reparte la sangre oxigenada a todo el organismo.
  - [Aorta](https://en.wikipedia.org/wiki/Aorta): “The aorta distributes oxygenated blood to all parts of the body through the systemic…”
- **Punto clave.** Atraviesa el diafragma a la altura de T12.
  - [Thoracic aorta](https://en.wikipedia.org/wiki/Thoracic_aorta): “The descending thoracic aorta begins at the lower border of the fourth thoracic vertebra…”

### Aorta abdominal (`Abdominal_aorta`)

Fuentes: [Abdominal aorta](https://en.wikipedia.org/wiki/Abdominal_aorta), [Aorta](https://en.wikipedia.org/wiki/Aorta), [Abdominal aortic aneurysm](https://en.wikipedia.org/wiki/Abdominal_aortic_aneurysm).

- **Descripción.** Tramo de la aorta en el abdomen, hasta su división en las ilíacas comunes a la altura de L4.
  - [Abdominal aorta](https://en.wikipedia.org/wiki/Abdominal_aorta): “It begins at T12 and ends at L4 with its bifurcation into the common…”
- **Descripción (sigue).** La aorta es la arteria más grande del cuerpo: sale del ventrículo izquierdo y reparte la sangre oxigenada a todo el organismo.
  - [Aorta](https://en.wikipedia.org/wiki/Aorta): “The aorta distributes oxygenated blood to all parts of the body through the systemic…”
- **Punto clave.** Su dilatación (aneurisma de aorta abdominal) puede palparse como una masa que late.
  - [Abdominal aortic aneurysm](https://en.wikipedia.org/wiki/Abdominal_aortic_aneurysm): “On physical examination, a palpable and pulsatile abdominal mass can be noted.”

### Tronco pulmonar (`Pulmonary_trunk`)

Fuentes: [Pulmonary artery](https://en.wikipedia.org/wiki/Pulmonary_artery).

- **Descripción.** Arteria gruesa que sale del ventrículo derecho y se divide en las arterias pulmonares derecha e izquierda.
  - [Pulmonary artery](https://en.wikipedia.org/wiki/Pulmonary_artery): “The pulmonary trunk bifurcates into right and left pulmonary arteries below the arch of…”

### Tronco braquiocefálico (`Brachiocephalic_trunk`)

Fuentes: [Brachiocephalic artery](https://en.wikipedia.org/wiki/Brachiocephalic_artery).

- **Descripción.** Primera rama del arco aórtico.
  - [Brachiocephalic artery](https://en.wikipedia.org/wiki/Brachiocephalic_artery): “It is the first branch of the aortic arch.”
- **Descripción (sigue).** Se divide en la carótida común y la subclavia derechas.
  - [Brachiocephalic artery](https://en.wikipedia.org/wiki/Brachiocephalic_artery): “Soon after it emerges, the brachiocephalic artery divides into the right common carotid artery…”
- **Punto clave.** Solo existe en el lado derecho.
  - [Brachiocephalic artery](https://en.wikipedia.org/wiki/Brachiocephalic_artery): “There is no brachiocephalic artery for the left side of the body.”

### Arteria carótida común derecha (`Right_common_carotid_artery`)

Fuentes: [Common carotid artery](https://en.wikipedia.org/wiki/Common_carotid_artery).

- **Descripción.** Arteria del cuello que lleva sangre oxigenada a la cabeza y el cuello. **(reescrita)**
  - [Common carotid artery](https://en.wikipedia.org/wiki/Common_carotid_artery): “are arteries that supply the head and neck with oxygenated blood; they divide in…”
- **Descripción (sigue).** Se divide en carótida interna (encéfalo) y externa (cara y cuello).
  - [Common carotid artery](https://en.wikipedia.org/wiki/Common_carotid_artery): “The external carotid artery travels more closely to the surface, and sends off numerous…”
- **Punto clave.** Su pulso se toma palpando bajo el borde anterior del músculo esternocleidomastoideo, a la altura del borde superior del cartílago tiroides. **(reescrita)**
  - [Common carotid artery](https://en.wikipedia.org/wiki/Common_carotid_artery): “The pulse is taken by palpating the artery just deep to the anterior border…”

### Arteria carótida común izquierda (`Left_common_carotid_artery`)

Fuentes: [Common carotid artery](https://en.wikipedia.org/wiki/Common_carotid_artery).

- **Descripción.** Arteria del cuello que lleva sangre oxigenada a la cabeza y el cuello. **(reescrita)**
  - [Common carotid artery](https://en.wikipedia.org/wiki/Common_carotid_artery): “are arteries that supply the head and neck with oxygenated blood; they divide in…”
- **Descripción (sigue).** Sale directamente del arco aórtico y se divide en carótida interna y externa.
  - [Common carotid artery](https://en.wikipedia.org/wiki/Common_carotid_artery): “Only the left common carotid artery has a substantial presence in the thorax. It…”
- **Punto clave.** Su pulso se toma palpando bajo el borde anterior del músculo esternocleidomastoideo, a la altura del borde superior del cartílago tiroides. **(reescrita)**
  - [Common carotid artery](https://en.wikipedia.org/wiki/Common_carotid_artery): “The pulse is taken by palpating the artery just deep to the anterior border…”

### Arteria carótida interna (`Internal_carotid_artery`)

Fuentes: [Internal carotid artery](https://en.wikipedia.org/wiki/Internal_carotid_artery), [Carotid artery stenosis](https://en.wikipedia.org/wiki/Carotid_artery_stenosis).

- **Descripción.** Rama de la carótida común que irriga el encéfalo, incluidos los ojos. **(reescrita)**
  - [Internal carotid artery](https://en.wikipedia.org/wiki/Internal_carotid_artery): “The internal carotid artery supplies the brain, including the eyes, while the external carotid…”
- **Punto clave.** Si se desprende un trozo de la placa de ateroma que la estrecha, puede subir al encéfalo, tapar la circulación y causar un ictus isquémico. **(reescrita)**
  - [Carotid artery stenosis](https://en.wikipedia.org/wiki/Carotid_artery_stenosis): “A piece of this material can break off and travel (embolize) up through the…”
  - [Carotid artery stenosis](https://en.wikipedia.org/wiki/Carotid_artery_stenosis): “an inflammatory build-up of atheromatous plaque inside the common carotid artery, or the internal…”

### Arteria basilar (`Basilar_artery`)

Fuentes: [Basilar artery](https://en.wikipedia.org/wiki/Basilar_artery).

- **Descripción.** Arteria formada por la unión de las dos vertebrales en la base del encéfalo.
  - [Basilar artery](https://en.wikipedia.org/wiki/Basilar_artery): “The basilar artery lies at the front of the brainstem in the midline and…” (en el recuadro de datos de la página)
- **Descripción (sigue).** Irriga la protuberancia y el cerebelo. **(reescrita)**
  - [Basilar artery](https://en.wikipedia.org/wiki/Basilar_artery): “Pons, and superior and inferior aspects of the cerebellum” (en el recuadro de datos de la página)
- **Punto clave.** Con las dos vertebrales lleva sangre a la parte posterior del círculo arterial del cerebro (polígono de Willis). **(reescrita)**
  - [Basilar artery](https://en.wikipedia.org/wiki/Basilar_artery): “which supplies blood to the posterior part of the circle of Willis”

### Arteria subclavia (`Subclavian_artery`)

Fuentes: [Subclavian artery](https://en.wikipedia.org/wiki/Subclavian_artery).

- **Descripción.** Arteria que pasa bajo la clavícula hacia el brazo; al cruzar la primera costilla pasa a llamarse axilar.
  - [Subclavian artery](https://en.wikipedia.org/wiki/Subclavian_artery): “As the subclavian artery crosses the lateral border of the first rib, it becomes…”

### Arteria braquial (`Brachial_artery`)

Fuentes: [Brachial artery](https://en.wikipedia.org/wiki/Brachial_artery), [Sphygmomanometer](https://en.wikipedia.org/wiki/Sphygmomanometer).

- **Descripción.** Arteria principal del brazo.
  - [Brachial artery](https://en.wikipedia.org/wiki/Brachial_artery): “The brachial artery is the major blood vessel of the (upper) arm.”
- **Descripción (sigue).** Continúa a la axilar y en el codo se divide en radial y ulnar.
  - [Brachial artery](https://en.wikipedia.org/wiki/Brachial_artery): “It continues down the ventral surface of the arm until it reaches the cubital…”
- **Punto clave.** Sobre ella se coloca el estetoscopio al medir la presión arterial.
  - [Sphygmomanometer](https://en.wikipedia.org/wiki/Sphygmomanometer): “With a manual instrument, listening with a stethoscope to the brachial artery, the examiner…”

### Arteria radial (`Radial_artery`)

Fuentes: [Radial artery](https://en.wikipedia.org/wiki/Radial_artery), [Pulse](https://en.wikipedia.org/wiki/Pulse).

- **Descripción.** Arteria principal de la cara lateral del antebrazo. **(reescrita)**
  - [Radial artery](https://en.wikipedia.org/wiki/Radial_artery): “In human anatomy, the radial artery is the main artery of the lateral aspect…”
- **Descripción (sigue).** Termina en la mano formando el arco palmar profundo. **(reescrita)**
  - [Radial artery](https://en.wikipedia.org/wiki/Radial_artery): “and becomes the deep palmar arch, which joins with the deep branch of the…”
- **Punto clave.** En la muñeca es donde se toma habitualmente el pulso.
  - [Pulse](https://en.wikipedia.org/wiki/Pulse): “The pulse is most commonly measured at the wrist or neck for adults and…”

### Arteria femoral (`Femoral_artery`)

Fuentes: [Femoral artery](https://en.wikipedia.org/wiki/Femoral_artery), [Cardiac catheterization](https://en.wikipedia.org/wiki/Cardiac_catheterization).

- **Descripción.** Arteria principal del muslo.
  - [Femoral artery](https://en.wikipedia.org/wiki/Femoral_artery): “The femoral artery is a large artery in the thigh and the main arterial…”
- **Descripción (sigue).** Continúa a la ilíaca externa bajo el ligamento inguinal.
  - [Femoral artery](https://en.wikipedia.org/wiki/Femoral_artery): “The femoral artery represents the continuation of the external iliac artery beyond the inguinal…”
- **Punto clave.** Su pulso se palpa mejor en la cara interna del muslo, en el punto medio inguinal: a medio camino entre la sínfisis del pubis y la espina ilíaca anterosuperior. **(reescrita)**
  - [Femoral artery](https://en.wikipedia.org/wiki/Femoral_artery): “The site for optimally palpating the femoral pulse is in the inner thigh, at…”
- **Punto clave.** Es una vía habitual para los cateterismos.
  - [Cardiac catheterization](https://en.wikipedia.org/wiki/Cardiac_catheterization): “Access to the heart is obtained through a peripheral artery or vein. Commonly, this…”

### Arteria poplítea (`Popliteal_artery`)

Fuentes: [Popliteal artery](https://en.wikipedia.org/wiki/Popliteal_artery).

- **Descripción.** Continuación profunda de la arteria femoral, que recorre la fosa poplítea. **(reescrita)**
  - [Popliteal artery](https://en.wikipedia.org/wiki/Popliteal_artery): “The popliteal artery is a deeply placed continuation of the femoral artery opening in…”
- **Descripción (sigue).** Se divide en las tibiales anterior y posterior.
  - [Popliteal artery](https://en.wikipedia.org/wiki/Popliteal_artery): “It courses through the popliteal fossa and ends at the lower border of the…”
- **Punto clave.** Su pulso suele explorarse con la persona boca abajo y la rodilla flexionada, para relajar la fascia poplítea y los isquiotibiales. **(reescrita)**
  - [Popliteal artery](https://en.wikipedia.org/wiki/Popliteal_artery): “Palpation (checking) of this pulse is commonly performed with the person in the prone…”

### Arteria dorsal del pie (`Dorsalis_pedis_artery`)

Fuentes: [Dorsalis pedis artery](https://en.wikipedia.org/wiki/Dorsalis_pedis_artery).

- **Descripción.** Continuación de la tibial anterior en el dorso del pie.
  - [Dorsalis pedis artery](https://en.wikipedia.org/wiki/Dorsalis_pedis_artery): “It arises at the anterior aspect of the ankle joint and is a continuation…”
- **Punto clave.** Los médicos suelen explorarla para valorar si hay enfermedad vascular periférica. **(reescrita)**
  - [Dorsalis pedis artery](https://en.wikipedia.org/wiki/Dorsalis_pedis_artery): “It is often examined, by physicians, when assessing whether a given patient has peripheral…”

### Arteria coronaria derecha (`Right_coronary_artery`)

Fuentes: [Right coronary artery](https://en.wikipedia.org/wiki/Right_coronary_artery).

- **Descripción.** Arteria que nace de la aorta y recorre el surco coronario derecho. **(reescrita)**
  - [Right coronary artery](https://en.wikipedia.org/wiki/Right_coronary_artery): “In the blood supply of the heart, the right coronary artery (RCA) is an…”
- **Descripción (sigue).** Irriga el atrio y el ventrículo derechos y, en un 60 % de las personas, el nódulo sinusal. **(reescrita)**
  - [Right coronary artery](https://en.wikipedia.org/wiki/Right_coronary_artery): “The RCA also supplies the SA nodal artery in 60% of people.”
- **Punto clave.** En cerca del 80 % de las personas da la arteria descendente posterior, que irriga la cara inferior del corazón. **(reescrita)**
  - [Right coronary artery](https://en.wikipedia.org/wiki/Right_coronary_artery): “In approximately 80% of patients (right dominant), the RCA gives off the posterior descending…”
  - [Right coronary artery](https://en.wikipedia.org/wiki/Right_coronary_artery): “The PDA supplies the inferior wall, ventricular septum, and the posteromedial papillary muscle.”

### Arteria coronaria izquierda (`Left_coronary_artery`)

Fuentes: [Left coronary artery](https://en.wikipedia.org/wiki/Left_coronary_artery), [Coronary arteries](https://en.wikipedia.org/wiki/Coronary_arteries).

- **Descripción.** Arteria que nace de la aorta y, tras recorrer de 10 a 25 mm, se divide en la interventricular anterior y la circunfleja. **(reescrita)**
  - [Left coronary artery](https://en.wikipedia.org/wiki/Left_coronary_artery): “The left coronary artery typically runs for 10–25 mm, then bifurcates into the left…”
- **Descripción (sigue).** La interventricular anterior irriga el tabique y la pared anterior del ventrículo izquierdo; la circunfleja, su pared libre. **(reescrita)**
  - [Coronary arteries](https://en.wikipedia.org/wiki/Coronary_arteries): “The left anterior descending artery perfuses the interventricular septum and anterior wall of the…”

### Arteria interventricular anterior (`Anterior_interventricular_artery`)

Fuentes: [Left anterior descending artery](https://en.wikipedia.org/wiki/Left_anterior_descending_artery).

- **Descripción.** Rama de la coronaria izquierda que baja por el surco interventricular anterior hasta la escotadura de la punta del corazón. **(reescrita)**
  - [Left anterior descending artery](https://en.wikipedia.org/wiki/Left_anterior_descending_artery): “It advances to the anterior interventricular sulcus, along which it descends to the notch…”
- **Punto clave.** Por su mal pronóstico, al infarto por obstrucción de su primer tramo se le llama en inglés «widow-maker» («el que deja viudas»). **(reescrita)**
  - [Left anterior descending artery](https://en.wikipedia.org/wiki/Left_anterior_descending_artery): “Blockage of the proximal LAD is often dubbed the "widow-maker" infarction due to its…”

### Vena cava superior (`Superior_vena_cava`)

Fuentes: [Superior vena cava](https://en.wikipedia.org/wiki/Superior_vena_cava).

- **Descripción.** Vena gruesa y corta (unos 24 mm de diámetro y 7 cm de largo) que recoge la sangre de la mitad superior del cuerpo y la lleva al atrio derecho. **(reescrita)**
  - [Superior vena cava](https://en.wikipedia.org/wiki/Superior_vena_cava): “It is a large-diameter (24 mm) short length (~7 cm) vein that receives venous…”
  - [Superior vena cava](https://en.wikipedia.org/wiki/Superior_vena_cava): “return deoxygenated blood from the systemic circulation to the right atrium of the heart”
- **Punto clave.** Se forma por la unión de las dos venas braquiocefálicas.
  - [Superior vena cava](https://en.wikipedia.org/wiki/Superior_vena_cava): “The superior vena cava is formed by the left and right brachiocephalic veins”

### Vena cava inferior (partes abdominal y torácica) (`Inferior_vena_cava_abdominal_part`)

Fuentes: [Inferior vena cava](https://en.wikipedia.org/wiki/Inferior_vena_cava), [Aortocaval compression syndrome](https://en.wikipedia.org/wiki/Aortocaval_compression_syndrome).

- **Descripción.** Vena grande que lleva la sangre pobre en oxígeno de la parte inferior y media del cuerpo al atrio derecho. **(reescrita)**
  - [Inferior vena cava](https://en.wikipedia.org/wiki/Inferior_vena_cava): “carries the deoxygenated blood from the lower and middle body into the right atrium…”
- **Punto clave.** Atraviesa el diafragma a la altura de T8.
  - [Inferior vena cava](https://en.wikipedia.org/wiki/Inferior_vena_cava): “It passes through the thoracic diaphragm at the caval opening at the level of…”
- **Punto clave.** En el embarazo, el útero puede comprimirla, junto con la aorta, cuando la mujer se tumba boca arriba. **(reescrita)**
  - [Aortocaval compression syndrome](https://en.wikipedia.org/wiki/Aortocaval_compression_syndrome): “compression of the abdominal aorta and inferior vena cava by the gravid uterus when…”

### Vena yugular interna (`Internal_jugular_vein`)

Fuentes: [Internal jugular vein](https://en.wikipedia.org/wiki/Internal_jugular_vein).

- **Descripción.** Vena del cuello que recoge la sangre del encéfalo y de las partes superficiales de la cara y el cuello. **(reescrita)**
  - [Internal jugular vein](https://en.wikipedia.org/wiki/Internal_jugular_vein): “collects blood from the brain and the superficial parts of the face and neck”
- **Punto clave.** Corre junto a la carótida común dentro de la vaina carotídea.
  - [Internal jugular vein](https://en.wikipedia.org/wiki/Internal_jugular_vein): “This vein runs in the carotid sheath with the common carotid artery and vagus…”
- **Punto clave.** Es una vía habitual para colocar catéteres venosos centrales.
  - [Internal jugular vein](https://en.wikipedia.org/wiki/Internal_jugular_vein): “As the internal jugular is large, central and relatively superficial, it is often used…”

### Vena yugular externa (`External_jugular_vein`)

Fuentes: [External jugular vein](https://en.wikipedia.org/wiki/External_jugular_vein).

- **Descripción.** Vena del cuello que cruza en diagonal el músculo esternocleidomastoideo, bajo el platisma. **(reescrita)**
  - [External jugular vein](https://en.wikipedia.org/wiki/External_jugular_vein): “In its course, it crosses the sternocleidomastoid muscle obliquely”
  - [External jugular vein](https://en.wikipedia.org/wiki/External_jugular_vein): “is covered by the platysma”
- **Punto clave.** Normalmente se ve a través de la piel. **(reescrita)**
  - [External jugular vein](https://en.wikipedia.org/wiki/External_jugular_vein): “In typical anatomy, the vein is visible through the skin.”

### Vena cubital mediana (`Median_cubital_vein`)

Fuentes: [Median cubital vein](https://en.wikipedia.org/wiki/Median_cubital_vein).

- **Descripción.** Vena superficial de la flexura del codo que une la cefálica con la basílica.
  - [Median cubital vein](https://en.wikipedia.org/wiki/Median_cubital_vein): “It bridges the cephalic vein and the basilic vein.”
- **Punto clave.** Se usa de forma habitual para sacar sangre. **(reescrita)**
  - [Median cubital vein](https://en.wikipedia.org/wiki/Median_cubital_vein): “The median cubital vein is routinely used for phlebotomy and venipuncture (taking blood)”

### Vena cefálica (`Cephalic_vein`)

Fuentes: [Cephalic vein](https://en.wikipedia.org/wiki/Cephalic_vein).

- **Descripción.** Vena superficial del brazo que sube por su lado radial (lateral) y desemboca en la vena axilar. **(reescrita)**
  - [Cephalic vein](https://en.wikipedia.org/wiki/Cephalic_vein): “the cephalic vein is a superficial vein in the arm”
  - [Cephalic vein](https://en.wikipedia.org/wiki/Cephalic_vein): “ascends along the radial (lateral) side of the arm before emptying into the axillary…”

### Vena basílica (`Basilic_vein`)

Fuentes: [Basilic vein](https://en.wikipedia.org/wiki/Basilic_vein).

- **Descripción.** Vena superficial que sube por el lado medial del brazo y se une a las venas braquiales.
  - [Basilic vein](https://en.wikipedia.org/wiki/Basilic_vein): “The basilic vein terminates by uniting with the brachial veins to form the axillary…”

### Gran vena safena (`Great_saphenous_vein`)

Fuentes: [Great saphenous vein](https://en.wikipedia.org/wiki/Great_saphenous_vein).

- **Descripción.** La vena más larga del cuerpo: sube por la cara medial de la pierna y el muslo desde el pie hasta la vena femoral.
  - [Great saphenous vein](https://en.wikipedia.org/wiki/Great_saphenous_vein): “It is the longest vein in the body, running along the length of the…”
- **Punto clave.** Se usa como injerto en la cirugía de bypass coronario.
  - [Great saphenous vein](https://en.wikipedia.org/wiki/Great_saphenous_vein): “used for autotransplantation in coronary artery bypass operations”
- **Punto clave.** Su dilatación forma varices.
  - [Great saphenous vein](https://en.wikipedia.org/wiki/Great_saphenous_vein): “The great saphenous vein, like other superficial veins, can become varicose; swollen, twisted and…”

### Pequeña vena safena (`Small_saphenous_vein`)

Fuentes: [Small saphenous vein](https://en.wikipedia.org/wiki/Small_saphenous_vein).

- **Descripción.** Vena superficial de la parte posterior de la pierna, que desemboca en la poplítea.
  - [Small saphenous vein](https://en.wikipedia.org/wiki/Small_saphenous_vein): “is a relatively large superficial vein of the posterior leg”

### Vena femoral (`Femoral_vein`)

Fuentes: [Femoral vein](https://en.wikipedia.org/wiki/Femoral_vein).

- **Descripción.** Vena profunda que acompaña a la arteria femoral dentro de la vaina femoral. **(reescrita)**
  - [Femoral vein](https://en.wikipedia.org/wiki/Femoral_vein): “the femoral vein is the vein that accompanies the femoral artery in the femoral…”
- **Punto clave.** Es un sitio frecuente de trombosis venosa profunda.
  - [Femoral vein](https://en.wikipedia.org/wiki/Femoral_vein): “The femoral vein is a common site for a deep vein thrombosis.”

### Vena porta hepática (`Hepatic_portal_vein`)

Fuentes: [Portal vein](https://en.wikipedia.org/wiki/Portal_vein).

- **Descripción.** Vena que lleva al hígado la sangre del tubo digestivo, la vesícula biliar, el páncreas y el bazo. **(reescrita)**
  - [Portal vein](https://en.wikipedia.org/wiki/Portal_vein): “is a blood vessel that carries blood from the gastrointestinal tract, gallbladder, pancreas and…”
- **Descripción (sigue).** Esa sangre contiene los nutrientes, y también las toxinas, que se extraen de la digestión. **(reescrita)**
  - [Portal vein](https://en.wikipedia.org/wiki/Portal_vein): “This blood contains nutrients and toxins extracted from digested contents.”
- **Punto clave.** Se forma detrás del cuello del páncreas por la unión de la vena esplénica y la mesentérica superior. **(reescrita)**
  - [Portal vein](https://en.wikipedia.org/wiki/Portal_vein): “In most individuals, the portal vein is formed by the union of the superior…”
  - [Portal vein](https://en.wikipedia.org/wiki/Portal_vein): “originating behind the neck of the pancreas”

### Arteria ovárica (`Ovarian_artery`)

Fuentes: [Ovarian artery](https://en.wikipedia.org/wiki/Ovarian_artery).

- **Descripción.** Arteria que lleva sangre oxigenada al ovario. **(reescrita)**
  - [Ovarian artery](https://en.wikipedia.org/wiki/Ovarian_artery): “The ovarian artery is an artery that supplies oxygenated blood to the ovary in…”
- **Descripción (sigue).** Nace de la aorta abdominal, por debajo de la arteria renal, y recorre el ligamento suspensorio del ovario hasta el mesoovario. **(reescrita)**
  - [Ovarian artery](https://en.wikipedia.org/wiki/Ovarian_artery): “It arises from the abdominal aorta below the renal artery.”
  - [Ovarian artery](https://en.wikipedia.org/wiki/Ovarian_artery): “After emerging from the aorta, the artery travels within the suspensory ligament of the…”
- **Descripción (sigue).** Una de sus ramas llega al lado del útero y se une a la arteria uterina. **(reescrita)**
  - [Ovarian artery](https://en.wikipedia.org/wiki/Ovarian_artery): “one passes on to the side of the uterus, and unites with the uterine…”
- **Punto clave.** En el hombre le corresponde la arteria testicular. **(reescrita)**
  - [Ovarian artery](https://en.wikipedia.org/wiki/Ovarian_artery): “The ovarian arteries are the corresponding arteries in the female to the testicular artery…”
- **Punto clave.** Dentro del ligamento suspensorio del ovario va por delante de la vena ovárica y del uréter. **(reescrita)**
  - [Ovarian artery](https://en.wikipedia.org/wiki/Ovarian_artery): “It can be found within the suspensory ligament of the ovary, anterior to the…”

### Arteria uterina (`Uterine_artery`)

Fuentes: [Uterine artery](https://en.wikipedia.org/wiki/Uterine_artery), [Vaginal artery](https://en.wikipedia.org/wiki/Vaginal_artery), [Hysterectomy](https://en.wikipedia.org/wiki/Hysterectomy).

- **Descripción.** Principal arteria del útero. **(reescrita)**
  - [Uterine artery](https://en.wikipedia.org/wiki/Uterine_artery): “The uterine artery is the major blood supply to the uterus and enlarges significantly…”
- **Descripción (sigue).** Suele nacer de la división anterior de la arteria ilíaca interna y llega al útero cruzando por delante del uréter. **(reescrita)**
  - [Uterine artery](https://en.wikipedia.org/wiki/Uterine_artery): “The uterine artery usually arises from the anterior division of the internal iliac artery.”
  - [Uterine artery](https://en.wikipedia.org/wiki/Uterine_artery): “crossing the ureter anteriorly”
- **Descripción (sigue).** Da ramas para la vagina, la trompa y el ovario. **(reescrita)**
  - [Uterine artery](https://en.wikipedia.org/wiki/Uterine_artery): “uterine tube ("tubal branch")”
  - [Uterine artery](https://en.wikipedia.org/wiki/Uterine_artery): “ovary ("ovarian branches")”
  - [Vaginal artery](https://en.wikipedia.org/wiki/Vaginal_artery): “vaginal branches of uterine artery”
- **Punto clave.** En la histerectomía, el uréter puede lesionarse donde pasa por debajo de la arteria uterina, a menudo al pinzar a ciegas para cortar una hemorragia. **(reescrita)**
  - [Hysterectomy](https://en.wikipedia.org/wiki/Hysterectomy): “The injury usually occurs in the distal ureter close to the infundibulopelvic ligament or…”
- **Punto clave.** Aumenta mucho de calibre durante el embarazo. **(reescrita)**
  - [Uterine artery](https://en.wikipedia.org/wiki/Uterine_artery): “The uterine artery is the major blood supply to the uterus and enlarges significantly…”

### Ramas vaginales de la arteria uterina (`Vaginal_branches_of_uterine_artery`)

Fuentes: [Vaginal artery](https://en.wikipedia.org/wiki/Vaginal_artery).

- **Descripción.** Ramas de la arteria uterina que llevan sangre a la vagina. **(reescrita)**
  - [Vaginal artery](https://en.wikipedia.org/wiki/Vaginal_artery): “but the phrase vaginal branches of uterine artery is the term for blood supply…”
- **Descripción (sigue).** Se comunican con la arteria vaginal, que suele ser rama de la ilíaca interna. **(reescrita)**
  - [Vaginal artery](https://en.wikipedia.org/wiki/Vaginal_artery): “They anastomose with branches from the uterine artery.”
  - [Vaginal artery](https://en.wikipedia.org/wiki/Vaginal_artery): “The vaginal artery is usually a branch of the internal iliac artery.”

### Rama tubárica de la arteria uterina (`Tubal_branch_of_uterine_artery`)

Fuentes: [Uterine artery](https://en.wikipedia.org/wiki/Uterine_artery), [Ovarian artery](https://en.wikipedia.org/wiki/Ovarian_artery).

- **Descripción.** Rama de la arteria uterina que lleva sangre a la trompa uterina. **(reescrita)**
  - [Uterine artery](https://en.wikipedia.org/wiki/Uterine_artery): “uterine tube ("tubal branch")”
- **Descripción (sigue).** La arteria ovárica también da pequeñas ramas a la trompa. **(reescrita)**
  - [Ovarian artery](https://en.wikipedia.org/wiki/Ovarian_artery): “Small branches are given to the ureter and the uterine tube”

### Rama ovárica de la arteria uterina (`Ovarian_branch_of_uterine_artery`)

Fuentes: [Uterine artery](https://en.wikipedia.org/wiki/Uterine_artery), [Ovarian artery](https://en.wikipedia.org/wiki/Ovarian_artery).

- **Descripción.** Ramas de la arteria uterina que llevan sangre al ovario. **(reescrita)**
  - [Uterine artery](https://en.wikipedia.org/wiki/Uterine_artery): “ovary ("ovarian branches")”
- **Descripción (sigue).** La arteria ovárica, por su parte, envía una rama al lado del útero que se une a la arteria uterina. **(reescrita)**
  - [Ovarian artery](https://en.wikipedia.org/wiki/Ovarian_artery): “one passes on to the side of the uterus, and unites with the uterine…”

### Vena ovárica izquierda (`Left_ovarian_vein`)

Fuentes: [Ovarian vein](https://en.wikipedia.org/wiki/Ovarian_vein).

- **Descripción.** Lleva la sangre pobre en oxígeno del ovario izquierdo. **(reescrita)**
  - [Ovarian vein](https://en.wikipedia.org/wiki/Ovarian_vein): “carries deoxygenated blood from its corresponding ovary to inferior vena cava or one of…”
- **Descripción (sigue).** A diferencia de la derecha, a menudo desemboca en la vena renal izquierda y no en la cava inferior. **(reescrita)**
  - [Ovarian vein](https://en.wikipedia.org/wiki/Ovarian_vein): “The left ovarian vein, unlike the right, often joins the left renal vein instead…”
- **Punto clave.** La vena ovárica derecha, en cambio, recorre el ligamento suspensorio del ovario y en general desemboca en la cava inferior. **(reescrita)**
  - [Ovarian vein](https://en.wikipedia.org/wiki/Ovarian_vein): “The right ovarian vein travels through the suspensatory ligament of the ovary and generally…”

### Vena ovárica derecha (`Right_ovarian_vein`)

Fuentes: [Ovarian vein](https://en.wikipedia.org/wiki/Ovarian_vein).

- **Descripción.** Lleva la sangre pobre en oxígeno del ovario derecho. **(reescrita)**
  - [Ovarian vein](https://en.wikipedia.org/wiki/Ovarian_vein): “carries deoxygenated blood from its corresponding ovary to inferior vena cava or one of…”
- **Descripción (sigue).** Recorre el ligamento suspensorio del ovario y en general desemboca en la vena cava inferior. **(reescrita)**
  - [Ovarian vein](https://en.wikipedia.org/wiki/Ovarian_vein): “The right ovarian vein travels through the suspensatory ligament of the ovary and generally…”
- **Punto clave.** La vena ovárica izquierda, en cambio, a menudo desemboca en la vena renal izquierda. **(reescrita)**
  - [Ovarian vein](https://en.wikipedia.org/wiki/Ovarian_vein): “The left ovarian vein, unlike the right, often joins the left renal vein instead…”

### Plexo venoso uterino (`Uterine_venous_plexus`)

Fuentes: [Uterine venous plexus](https://en.wikipedia.org/wiki/Uterine_venous_plexus).

- **Descripción.** Red de venas a los lados del útero, entre las dos hojas del ligamento ancho. **(reescrita)**
  - [Uterine venous plexus](https://en.wikipedia.org/wiki/Uterine_venous_plexus): “The uterine plexuses lie along the sides and superior angles of the uterus between…”
- **Descripción (sigue).** Se comunica con los plexos venosos ovárico y vaginal, y la drenan dos venas uterinas a cada lado. **(reescrita)**
  - [Uterine venous plexus](https://en.wikipedia.org/wiki/Uterine_venous_plexus): “The uterine plexuses lie along the sides and superior angles of the uterus between…”
  - [Uterine venous plexus](https://en.wikipedia.org/wiki/Uterine_venous_plexus): “They are drained by a pair of uterine veins on either side”

### Venas uterinas (`Uterine_veins`)

Fuentes: [Uterine vein](https://en.wikipedia.org/wiki/Uterine_vein).

- **Descripción.** Venas que llevan la sangre del plexo venoso uterino a la vena ilíaca interna.
  - [Uterine vein](https://en.wikipedia.org/wiki/Uterine_vein): “It drains into the internal iliac vein.”
- **Descripción (sigue).** Siguen un trayecto parecido al de la arteria uterina. **(reescrita)**
  - [Uterine vein](https://en.wikipedia.org/wiki/Uterine_vein): “It follows a similar course to the uterine artery.”

### Seno coronario (`Coronary_sinus`)

Fuentes: [Coronary sinus](https://en.wikipedia.org/wiki/Coronary_sinus).

- **Descripción.** Vena del surco coronario, en la cara posterior del corazón, que recoge más de la mitad de la sangre pobre en oxígeno del músculo cardíaco y la vierte en el atrio derecho. **(reescrita)**
  - [Coronary sinus](https://en.wikipedia.org/wiki/Coronary_sinus): “The coronary sinus runs transversely in the left atrioventricular groove (coronary sulcus) on the…”
  - [Coronary sinus](https://en.wikipedia.org/wiki/Coronary_sinus): “It drains over half of the deoxygenated blood from the heart muscle into the…”

### Seno sagital superior (`Superior_sagittal_sinus`)

Fuentes: [Superior sagittal sinus](https://en.wikipedia.org/wiki/Superior_sagittal_sinus).

- **Descripción.** Seno venoso impar de la duramadre, a lo largo del borde por el que se fija la hoz del cerebro. **(reescrita)**
  - [Superior sagittal sinus](https://en.wikipedia.org/wiki/Superior_sagittal_sinus): “is an unpaired dural venous sinus lying along the attached margin of the falx…”
- **Descripción (sigue).** Recoge sangre de las caras laterales de los hemisferios cerebrales, y en él drena el líquido cefalorraquídeo, que así vuelve a la circulación venosa. **(reescrita)**
  - [Superior sagittal sinus](https://en.wikipedia.org/wiki/Superior_sagittal_sinus): “It allows blood to drain from the lateral aspects of the anterior cerebral hemispheres…”
  - [Superior sagittal sinus](https://en.wikipedia.org/wiki/Superior_sagittal_sinus): “Cerebrospinal fluid drains through arachnoid granulations into the superior sagittal sinus and is returned…”

### Atrio derecho (`Right_atrium`)

Fuentes: [Atrium (heart)](https://en.wikipedia.org/wiki/Atrium_%28heart%29), [Sinoatrial node](https://en.wikipedia.org/wiki/Sinoatrial_node).

- **Descripción.** Cavidad que recibe la sangre pobre en oxígeno de todo el cuerpo por las venas cavas y la pasa al ventrículo derecho.
  - [Atrium (heart)](https://en.wikipedia.org/wiki/Atrium_%28heart%29): “The right atrium receives and holds deoxygenated blood from the superior vena cava, inferior…”
- **Punto clave.** En su pared está el nódulo sinusal, el marcapasos natural del corazón.
  - [Sinoatrial node](https://en.wikipedia.org/wiki/Sinoatrial_node): “In a healthy heart, the SA node continuously produces action potentials, setting the rhythm…”

### Atrio izquierdo (`Left_atrium`)

Fuentes: [Atrium (heart)](https://en.wikipedia.org/wiki/Atrium_%28heart%29).

- **Descripción.** Cavidad que recibe la sangre oxigenada de las venas pulmonares derechas e izquierdas y la bombea al ventrículo izquierdo. **(reescrita)**
  - [Atrium (heart)](https://en.wikipedia.org/wiki/Atrium_%28heart%29): “The left atrium receives the oxygenated blood from the left and right pulmonary veins,…”
- **Punto clave.** En la fibrilación auricular, la orejuela izquierda tiembla en vez de contraerse y la sangre se estanca, lo que favorece que se formen coágulos. **(reescrita)**
  - [Atrium (heart)](https://en.wikipedia.org/wiki/Atrium_%28heart%29): “the left atrial appendage fibrillates rather than contracts resulting in blood stasis that predisposes…”

### Ventrículo derecho (`Right_ventricle`)

Fuentes: [Ventricle (heart)](https://en.wikipedia.org/wiki/Ventricle_%28heart%29).

- **Descripción.** Cavidad que bombea la sangre pobre en oxígeno hacia los pulmones por el tronco pulmonar.
  - [Ventricle (heart)](https://en.wikipedia.org/wiki/Ventricle_%28heart%29): “The right ventricle receives deoxygenated blood from the right atrium via the tricuspid valve…”
- **Punto clave.** Su pared es más fina que la del ventrículo izquierdo, que bombea la sangre a casi todo el cuerpo; el derecho solo la envía a los pulmones. **(reescrita)**
  - [Ventricle (heart)](https://en.wikipedia.org/wiki/Ventricle_%28heart%29): “the left ventricle has thicker walls than the right because it needs to pump…”

### Ventrículo izquierdo (`Left_ventricle`)

Fuentes: [Ventricle (heart)](https://en.wikipedia.org/wiki/Ventricle_%28heart%29).

- **Descripción.** Cavidad que bombea la sangre a la circulación sistémica a través de la aorta. **(reescrita)**
  - [Ventricle (heart)](https://en.wikipedia.org/wiki/Ventricle_%28heart%29): “the left ventricle pumps blood into the systemic circulation through the aorta”
- **Punto clave.** En el adulto joven, su pared es de tres a seis veces más gruesa que la del ventrículo derecho. **(reescrita)**
  - [Ventricle (heart)](https://en.wikipedia.org/wiki/Ventricle_%28heart%29): “By young adulthood, the walls of the left ventricle have thickened from three to…”

## Vasos: fichas nuevas

Todas sus frases son **nuevas** (8 nov 2026).

### Arteria cerebral anterior (`Anterior_cerebral_artery`)

Fuentes: [Anterior cerebral artery](https://en.wikipedia.org/wiki/Anterior_cerebral_artery).

- **Descripción.** Una de las dos arterias cerebrales anteriores, que llevan sangre oxigenada a la mayor parte de la zona media de los lóbulos frontales y a la parte superior y medial de los lóbulos parietales.
  - [Anterior cerebral artery](https://en.wikipedia.org/wiki/Anterior_cerebral_artery): “is one of a pair of cerebral arteries that supplies oxygenated blood to most…”
- **Descripción (sigue).** Nacen de la carótida interna, forman parte del círculo arterial del cerebro (polígono de Willis) y las une la arteria comunicante anterior.
  - [Anterior cerebral artery](https://en.wikipedia.org/wiki/Anterior_cerebral_artery): “The two anterior cerebral arteries arise from the internal carotid artery and are part…”
  - [Anterior cerebral artery](https://en.wikipedia.org/wiki/Anterior_cerebral_artery): “The left and right anterior cerebral arteries are connected by the anterior communicating artery.”
- **Punto clave.** Un ictus en su territorio causa debilidad y pérdida de sensibilidad en la pierna y el pie del lado opuesto, y cambios de conducta.
  - [Anterior cerebral artery](https://en.wikipedia.org/wiki/Anterior_cerebral_artery): “Anterior cerebral artery syndrome refers to symptoms that follow a stroke”
  - [Anterior cerebral artery](https://en.wikipedia.org/wiki/Anterior_cerebral_artery): “It is characterized by weakness and sensory loss in the lower leg and foot…”

### Tronco celiaco (`Coeliac_trunk`)

Fuentes: [Celiac artery](https://en.wikipedia.org/wiki/Celiac_artery).

- **Descripción.** Primera gran rama de la aorta abdominal; mide alrededor de 1,27 cm.
  - [Celiac artery](https://en.wikipedia.org/wiki/Celiac_artery): “is the first major branch of the abdominal aorta”
  - [Celiac artery](https://en.wikipedia.org/wiki/Celiac_artery): “It is about 1.27 cm (half an inch) in length.”
- **Descripción (sigue).** Sale de la aorta a la altura del disco entre T12 y L1 y es una de sus tres ramas anteriores, junto con las arterias mesentéricas superior e inferior.
  - [Celiac artery](https://en.wikipedia.org/wiki/Celiac_artery): “Branching from the aorta at the level of the T12-L1 intervertebral disc in typical…”
- **Punto clave.** El pilar del diafragma puede comprimirlo con la respiración: es el síndrome del ligamento arcuato medio.
  - [Celiac artery](https://en.wikipedia.org/wiki/Celiac_artery): “The celiac artery is vulnerable to compression from the crus of the diaphragm during…”
  - [Celiac artery](https://en.wikipedia.org/wiki/Celiac_artery): “This is known as median arcuate ligament syndrome.”

### Arteria hepática común (`Common_hepatic_artery`)

Fuentes: [Common hepatic artery](https://en.wikipedia.org/wiki/Common_hepatic_artery).

- **Descripción.** Arteria corta que nace del tronco celíaco y lleva sangre oxigenada al hígado, al píloro del estómago, al duodeno, al páncreas y a la vesícula biliar.
  - [Common hepatic artery](https://en.wikipedia.org/wiki/Common_hepatic_artery): “The common hepatic artery is a short blood vessel that supplies oxygenated blood to…”
  - [Common hepatic artery](https://en.wikipedia.org/wiki/Common_hepatic_artery): “It arises from the celiac artery”

### Arteria ilíaca común (`Common_iliac_artery`)

Fuentes: [Common iliac artery](https://en.wikipedia.org/wiki/Common_iliac_artery).

- **Descripción.** Gran arteria del abdomen, una a cada lado.
  - [Common iliac artery](https://en.wikipedia.org/wiki/Common_iliac_artery): “The common iliac artery is a large artery of the abdomen paired on each…”
- **Descripción (sigue).** Nace de la bifurcación de la aorta a la altura de la cuarta vértebra lumbar y termina delante de la articulación sacroilíaca, donde se divide en las arterias ilíacas externa e interna.
  - [Common iliac artery](https://en.wikipedia.org/wiki/Common_iliac_artery): “It originates from the aortic bifurcation at the level of the 4th lumbar vertebra.”
  - [Common iliac artery](https://en.wikipedia.org/wiki/Common_iliac_artery): “It ends in front of the sacroiliac joint, one on either side, and each…”

### Arteria carótida externa (`External_carotid_artery`)

Fuentes: [External carotid artery](https://en.wikipedia.org/wiki/External_carotid_artery).

- **Descripción.** Principal arteria de la cabeza y de la parte alta del cuello.
  - [External carotid artery](https://en.wikipedia.org/wiki/External_carotid_artery): “The external carotid artery is the major artery of the head and upper neck.”
- **Descripción (sigue).** Nace de la carótida común y termina dentro de la glándula parótida, donde se divide en las arterias temporal superficial y maxilar.
  - [External carotid artery](https://en.wikipedia.org/wiki/External_carotid_artery): “It arises from the common carotid artery.”
  - [External carotid artery](https://en.wikipedia.org/wiki/External_carotid_artery): “It terminates by splitting into the superficial temporal and maxillary artery within the parotid…”

### Arteria iliaca externa (`External_iliac_artery`)

Fuentes: [External iliac artery](https://en.wikipedia.org/wiki/External_iliac_artery).

- **Descripción.** Gran arteria que nace de la ilíaca común delante de la articulación sacroilíaca de la pelvis.
  - [External iliac artery](https://en.wikipedia.org/wiki/External_iliac_artery): “are two major arteries which bifurcate off the common iliac arteries anterior to the…”
- **Descripción (sigue).** Pasa por debajo del ligamento inguinal y se convierte en la arteria femoral.
  - [External iliac artery](https://en.wikipedia.org/wiki/External_iliac_artery): “The external iliac artery passes beneath the inguinal ligament in the lower part of…”
- **Punto clave.** En un trasplante de riñón suele ser la arteria a la que se une la arteria renal del riñón trasplantado.
  - [External iliac artery](https://en.wikipedia.org/wiki/External_iliac_artery): “The external iliac artery is usually the artery used to attach the renal artery…”

### Arteria facial (`Facial_artery`)

Fuentes: [Facial artery](https://en.wikipedia.org/wiki/Facial_artery).

- **Descripción.** Rama de la carótida externa que lleva sangre a las estructuras superficiales de la parte media de la cara.
  - [Facial artery](https://en.wikipedia.org/wiki/Facial_artery): “is a branch of the external carotid artery that supplies blood to superficial structures…”
- **Descripción (sigue).** Antes se llamaba arteria maxilar externa.
  - [Facial artery](https://en.wikipedia.org/wiki/Facial_artery): “formerly called the external maxillary artery”
- **Punto clave.** Puede dañarse en la cirugía maxilofacial, y entonces suele sangrar mucho.
  - [Facial artery](https://en.wikipedia.org/wiki/Facial_artery): “The facial artery may be punctured during maxillofacial surgery, and is likely to haemorrhage…”

### Arteria mesentérica inferior (`Inferior_mesenteric_artery`)

Fuentes: [Inferior mesenteric artery](https://en.wikipedia.org/wiki/Inferior_mesenteric_artery).

- **Descripción.** Tercera rama principal de la aorta abdominal; nace a la altura de L3.
  - [Inferior mesenteric artery](https://en.wikipedia.org/wiki/Inferior_mesenteric_artery): “is the third main branch of the abdominal aorta and arises at the level…”
- **Descripción (sigue).** Irriga el intestino grueso desde la parte final del colon transverso hasta la parte alta del conducto anal: el colon descendente, el colon sigmoide y parte del recto.
  - [Inferior mesenteric artery](https://en.wikipedia.org/wiki/Inferior_mesenteric_artery): “supplying the large intestine from the distal transverse colon to the upper part of…”
  - [Inferior mesenteric artery](https://en.wikipedia.org/wiki/Inferior_mesenteric_artery): “The regions supplied by the IMA are the descending colon, the sigmoid colon, and…”
- **Punto clave.** En la hemicolectomía izquierda hay que extirpar esta arteria o sus ramas.
  - [Inferior mesenteric artery](https://en.wikipedia.org/wiki/Inferior_mesenteric_artery): “The IMA and/or its branches must be resected for a left hemicolectomy.”
- **Punto clave.** El riñón en herradura, una anomalía frecuente (1 de cada 500 personas), queda por debajo de esta arteria.
  - [Inferior mesenteric artery](https://en.wikipedia.org/wiki/Inferior_mesenteric_artery): “A horseshoe kidney, a common (1 in 500) anomaly of the kidneys, will be…”

### Arteria ilíaca interna (`Internal_iliac_artery`)

Fuentes: [Internal iliac artery](https://en.wikipedia.org/wiki/Internal_iliac_artery), [Common iliac artery](https://en.wikipedia.org/wiki/Common_iliac_artery).

- **Descripción.** Principal arteria de la pelvis; antes se llamaba arteria hipogástrica.
  - [Internal iliac artery](https://en.wikipedia.org/wiki/Internal_iliac_artery): “The internal iliac artery (formerly known as the hypogastric artery) is the main artery…”
- **Descripción (sigue).** Nace de la arteria ilíaca común.
  - [Common iliac artery](https://en.wikipedia.org/wiki/Common_iliac_artery): “each bifurcates into the external and internal iliac arteries”

### Arteria renal (`Renal_artery`)

Fuentes: [Renal artery](https://en.wikipedia.org/wiki/Renal_artery).

- **Descripción.** Arteria que lleva la sangre al riñón; hay una a cada lado.
  - [Renal artery](https://en.wikipedia.org/wiki/Renal_artery): “The renal arteries are paired arteries that supply the kidneys with blood.”
- **Descripción (sigue).** Por las arterias renales puede pasar hasta un tercio de toda la sangre que bombea el corazón, para que los riñones la filtren.
  - [Renal artery](https://en.wikipedia.org/wiki/Renal_artery): “Up to a third of total cardiac output can pass through the renal arteries…”
- **Punto clave.** Su estrechamiento (estenosis) causa hipertensión: el riñón afectado libera renina para subir la presión y mantener su riego.
  - [Renal artery](https://en.wikipedia.org/wiki/Renal_artery): “Renal artery stenosis, or narrowing of one or both renal arteries will lead to…”

### Arteria cerebral media (Segmento M1) (`Middle_cerebral_artery_M1_segment`)

Fuentes: [Middle cerebral artery](https://en.wikipedia.org/wiki/Middle_cerebral_artery).

- **Descripción.** Primer tramo (M1 o segmento esfenoidal) de la arteria cerebral media, una de las tres grandes arterias pares que irrigan el cerebro.
  - [Middle cerebral artery](https://en.wikipedia.org/wiki/Middle_cerebral_artery): “M1: The sphenoidal segment (stem)”
  - [Middle cerebral artery](https://en.wikipedia.org/wiki/Middle_cerebral_artery): “is one of the three major paired cerebral arteries that supply blood to the…”
- **Descripción (sigue).** La arteria nace de la carótida interna, entra en el surco lateral y allí se ramifica hacia gran parte de la cara lateral de la corteza cerebral; también irriga la parte anterior de los lóbulos temporales y la ínsula.
  - [Middle cerebral artery](https://en.wikipedia.org/wiki/Middle_cerebral_artery): “The MCA arises from the internal carotid artery and continues into the lateral sulcus…”
  - [Middle cerebral artery](https://en.wikipedia.org/wiki/Middle_cerebral_artery): “It also supplies blood to the anterior temporal lobes and the insular cortices.”
- **Punto clave.** Del segmento M1 salen numerosas arterias pequeñas (lenticuloestriadas laterales) que irrigan los núcleos de la base.
  - [Middle cerebral artery](https://en.wikipedia.org/wiki/Middle_cerebral_artery): “The M1 segment perforates the brain with numerous anterolateral central (lateral lenticulostriate) arteries, which…”
- **Punto clave.** No se considera parte del círculo arterial del cerebro (polígono de Willis).
  - [Middle cerebral artery](https://en.wikipedia.org/wiki/Middle_cerebral_artery): “The MCAs are not considered a part of the Circle of Willis.”

### Arteria esplénica (`Splenic_artery`)

Fuentes: [Splenic artery](https://en.wikipedia.org/wiki/Splenic_artery).

- **Descripción.** Arteria que lleva sangre oxigenada al bazo.
  - [Splenic artery](https://en.wikipedia.org/wiki/Splenic_artery): “is the blood vessel that supplies oxygenated blood to the spleen”
- **Descripción (sigue).** Nace del tronco celíaco y va por encima del páncreas con un trayecto muy tortuoso.
  - [Splenic artery](https://en.wikipedia.org/wiki/Splenic_artery): “It branches from the celiac artery, and follows a course superior to the pancreas.”
  - [Splenic artery](https://en.wikipedia.org/wiki/Splenic_artery): “It is known for its tortuous path to the spleen.”
- **Punto clave.** Sus aneurismas son raros, pero son los terceros más frecuentes del abdomen, tras los de la aorta abdominal y las arterias ilíacas.
  - [Splenic artery](https://en.wikipedia.org/wiki/Splenic_artery): “but still the third most common abdominal aneurysm, after aneurysms of the abdominal aorta…”

### Arteria temporal superficial (`Superficial_temporal_artery`)

Fuentes: [Superficial temporal artery](https://en.wikipedia.org/wiki/Superficial_temporal_artery).

- **Descripción.** Arteria importante de la cabeza. Nace de la carótida externa, cuando esta se divide en las arterias temporal superficial y maxilar.
  - [Superficial temporal artery](https://en.wikipedia.org/wiki/Superficial_temporal_artery): “the superficial temporal artery is a major artery of the head”
  - [Superficial temporal artery](https://en.wikipedia.org/wiki/Superficial_temporal_artery): “It arises from the external carotid artery when it splits into the superficial temporal…”
- **Punto clave.** Su pulso se nota por encima del arco cigomático, delante y por encima del trago de la oreja.
  - [Superficial temporal artery](https://en.wikipedia.org/wiki/Superficial_temporal_artery): “Its pulse can be felt above the zygomatic arch, above and in front of…”
- **Punto clave.** Suele afectarse en la arteritis de células gigantes, y se biopsia cuando se sospecha esta enfermedad.
  - [Superficial temporal artery](https://en.wikipedia.org/wiki/Superficial_temporal_artery): “The superficial temporal artery is often affected in giant-cell arteritis and biopsied if the…”

### Arteria mesentérica superior (`Superior_mesenteric_artery`)

Fuentes: [Superior mesenteric artery](https://en.wikipedia.org/wiki/Superior_mesenteric_artery).

- **Descripción.** Arteria que nace de la cara anterior de la aorta abdominal, justo por debajo del tronco celíaco.
  - [Superior mesenteric artery](https://en.wikipedia.org/wiki/Superior_mesenteric_artery): “is an artery which arises from the anterior surface of the abdominal aorta, just…”
- **Descripción (sigue).** Irriga el intestino desde la parte baja del duodeno hasta los dos tercios del colon transverso, y también el páncreas.
  - [Superior mesenteric artery](https://en.wikipedia.org/wiki/Superior_mesenteric_artery): “supplies blood to the intestine from the lower part of the duodenum through two-thirds…”
- **Punto clave.** Su obstrucción brusca casi siempre deja sin riego el intestino, y hasta el 80 % de estas obstrucciones causan la muerte.
  - [Superior mesenteric artery](https://en.wikipedia.org/wiki/Superior_mesenteric_artery): “Acute occlusion of the SMA almost invariably leads to intestinal ischemia and often has…”
- **Punto clave.** Puede comprimir la vena renal izquierda contra la aorta: es el síndrome del cascanueces.
  - [Superior mesenteric artery](https://en.wikipedia.org/wiki/Superior_mesenteric_artery): “The SMA can compress the left renal vein, leading to nutcracker syndrome”

### Arteria tibial anterior (`Anterior_tibial_artery`)

Fuentes: [Anterior tibial artery](https://en.wikipedia.org/wiki/Anterior_tibial_artery), [Dorsalis pedis artery](https://en.wikipedia.org/wiki/Dorsalis_pedis_artery).

- **Descripción.** Arteria de la pierna que nace de la poplítea y lleva sangre al compartimento anterior de la pierna y al dorso del pie.
  - [Anterior tibial artery](https://en.wikipedia.org/wiki/Anterior_tibial_artery): “It carries blood to the anterior compartment of the leg and dorsal surface of…”
- **Descripción (sigue).** Continúa en el dorso del pie como arteria dorsal del pie.
  - [Dorsalis pedis artery](https://en.wikipedia.org/wiki/Dorsalis_pedis_artery): “is a continuation of the anterior tibial artery”
- **Punto clave.** Como pasa por dentro del cuello de la fíbula, puede dañarse en una osteotomía de la tibia.
  - [Anterior tibial artery](https://en.wikipedia.org/wiki/Anterior_tibial_artery): “As the artery passes medial to the fibular neck, it becomes vulnerable to damage…”

### Arteria femoral profunda (`Deep_femoral_artery`)

Fuentes: [Deep femoral artery](https://en.wikipedia.org/wiki/Deep_femoral_artery).

- **Descripción.** Gran rama de la arteria femoral que va más profunda que el resto de la femoral.
  - [Deep femoral artery](https://en.wikipedia.org/wiki/Deep_femoral_artery): “is a large branch of the femoral artery”
  - [Deep femoral artery](https://en.wikipedia.org/wiki/Deep_femoral_artery): “It travels more deeply ("profoundly") than the rest of the femoral artery.”
- **Descripción (sigue).** Da las arterias circunflejas femorales lateral y medial y las arterias perforantes, y termina en el muslo.
  - [Deep femoral artery](https://en.wikipedia.org/wiki/Deep_femoral_artery): “It gives rise to the lateral circumflex femoral artery and medial circumflex femoral artery,…”

### Arteria fibular (`Fibular_artery`)

Fuentes: [Fibular artery](https://en.wikipedia.org/wiki/Fibular_artery).

- **Descripción.** Arteria que nace del tronco tibiofibular y lleva sangre al compartimento lateral de la pierna. También se llama arteria peronea.
  - [Fibular artery](https://en.wikipedia.org/wiki/Fibular_artery): “supplies blood to the lateral compartment of the leg”
  - [Fibular artery](https://en.wikipedia.org/wiki/Fibular_artery): “It arises from the tibial-fibular trunk.”
  - [Fibular artery](https://en.wikipedia.org/wiki/Fibular_artery): “also known as the peroneal artery”

### Arteria tibial posterior (`Posterior_tibial_artery`)

Fuentes: [Posterior tibial artery](https://en.wikipedia.org/wiki/Posterior_tibial_artery).

- **Descripción.** Arteria del miembro inferior que lleva sangre al compartimento posterior de la pierna y a la planta del pie.
  - [Posterior tibial artery](https://en.wikipedia.org/wiki/Posterior_tibial_artery): “is an artery that carries blood to the posterior compartment of the leg and…”
- **Descripción (sigue).** Nace de la poplítea a través del tronco tibiofibular y pasa justo por detrás del maléolo medial.
  - [Posterior tibial artery](https://en.wikipedia.org/wiki/Posterior_tibial_artery): “It branches from the popliteal artery via the tibial-fibular trunk.”
  - [Posterior tibial artery](https://en.wikipedia.org/wiki/Posterior_tibial_artery): “It passes just posterior to the medial malleolus of the tibia”
- **Punto clave.** Su pulso se palpa fácilmente a medio camino entre el borde posterior del maléolo medial y el tendón de Aquiles.
  - [Posterior tibial artery](https://en.wikipedia.org/wiki/Posterior_tibial_artery): “The posterior tibial artery pulse can be readily palpated halfway between the posterior border…”

### Arteria cerebral posterior (`Posterior_cerebral_artery`)

Fuentes: [Posterior cerebral artery](https://en.wikipedia.org/wiki/Posterior_cerebral_artery).

- **Descripción.** Una de las dos arterias cerebrales posteriores, que llevan sangre oxigenada al lóbulo occipital y a las caras medial e inferior del lóbulo temporal.
  - [Posterior cerebral artery](https://en.wikipedia.org/wiki/Posterior_cerebral_artery): “is one of a pair of cerebral arteries that supply oxygenated blood to the…”
- **Descripción (sigue).** Nacen del final de la arteria basilar, que se divide en las dos, y se comunican con las cerebrales medias y las carótidas internas a través de las arterias comunicantes posteriores.
  - [Posterior cerebral artery](https://en.wikipedia.org/wiki/Posterior_cerebral_artery): “The two arteries originate from the distal end of the basilar artery, where it…”
  - [Posterior cerebral artery](https://en.wikipedia.org/wiki/Posterior_cerebral_artery): “These anastomose with the middle cerebral arteries and internal carotid arteries via the posterior…”

### Arteria vertebral (`Vertebral_artery`)

Fuentes: [Vertebral artery](https://en.wikipedia.org/wiki/Vertebral_artery).

- **Descripción.** Gran arteria del cuello, una a cada lado. Suele nacer de la subclavia, sube por el cuello y, dentro del cráneo, se une a la del otro lado para formar la arteria basilar.
  - [Vertebral artery](https://en.wikipedia.org/wiki/Vertebral_artery): “The vertebral arteries are major arteries of the neck.”
  - [Vertebral artery](https://en.wikipedia.org/wiki/Vertebral_artery): “Typically, the vertebral arteries originate from the subclavian arteries.”
  - [Vertebral artery](https://en.wikipedia.org/wiki/Vertebral_artery): “Each vessel courses superiorly along each side of the neck, merging within the skull…”
- **Descripción (sigue).** Lleva sangre a la parte alta de la médula espinal, al tronco del encéfalo, al cerebelo y a la parte posterior del encéfalo.
  - [Vertebral artery](https://en.wikipedia.org/wiki/Vertebral_artery): “the vertebral arteries supply blood to the upper spinal cord, brainstem, cerebellum, and posterior…”
- **Punto clave.** La manipulación quiropráctica del cuello puede causar su disección.
  - [Vertebral artery](https://en.wikipedia.org/wiki/Vertebral_artery): “Chiropractic manipulation of the neck has the potential to cause a vertebral arterial dissection.”

### Arteria axilar (`Axillary_artery`)

Fuentes: [Axillary artery](https://en.wikipedia.org/wiki/Axillary_artery).

- **Descripción.** Gran arteria que lleva sangre oxigenada a la cara lateral del tórax, a la axila y al miembro superior.
  - [Axillary artery](https://en.wikipedia.org/wiki/Axillary_artery): “is a large blood vessel that conveys oxygenated blood to the lateral aspect of…”
- **Descripción (sigue).** Empieza en el borde lateral de la primera costilla, donde la subclavia cambia de nombre, y al pasar el borde inferior del músculo redondo mayor pasa a llamarse arteria braquial.
  - [Axillary artery](https://en.wikipedia.org/wiki/Axillary_artery): “Its origin is at the lateral margin of the first rib, before which it…”
  - [Axillary artery](https://en.wikipedia.org/wiki/Axillary_artery): “After passing the lower margin of teres major it becomes the brachial artery.”
- **Punto clave.** Se puede pinzar sin poner en peligro el brazo, pero solo antes del origen de la arteria subescapular: la red de arterias que rodea la escápula lleva la sangre al brazo por otro camino.
  - [Axillary artery](https://en.wikipedia.org/wiki/Axillary_artery): “The axillary artery can be safely clamped without endangering the arm, but only in…”
  - [Axillary artery](https://en.wikipedia.org/wiki/Axillary_artery): “The anastomotic network surrounding the scapula provides an alternate path for collateral circulation to…”

### Arteria torácica interna (`Internal_thoracic_artery`)

Fuentes: [Internal thoracic artery](https://en.wikipedia.org/wiki/Internal_thoracic_artery).

- **Descripción.** Arteria que irriga la pared anterior del tórax y las mamas; también se llama arteria mamaria interna.
  - [Internal thoracic artery](https://en.wikipedia.org/wiki/Internal_thoracic_artery): “also known as the internal mammary artery, is an artery that supplies the anterior…”
- **Descripción (sigue).** Hay una a cada lado del esternón, y al final se divide en las arterias epigástrica superior y musculofrénica.
  - [Internal thoracic artery](https://en.wikipedia.org/wiki/Internal_thoracic_artery): “It is a paired artery, with one running along each side of the sternum,…”
- **Punto clave.** Es el vaso que prefieren los cirujanos cardíacos para los bypass coronarios.
  - [Internal thoracic artery](https://en.wikipedia.org/wiki/Internal_thoracic_artery): “blood vessel of choice for coronary artery bypass grafting”

### Arco palmar profundo (`Deep_palmar_arch`)

Fuentes: [Deep palmar arch](https://en.wikipedia.org/wiki/Deep_palmar_arch).

- **Descripción.** Red arterial de la palma de la mano.
  - [Deep palmar arch](https://en.wikipedia.org/wiki/Deep_palmar_arch): “is an arterial network found in the palm”
- **Descripción (sigue).** La forma sobre todo el final de la arteria radial, con la contribución de la ulnar; el arco palmar superficial, en cambio, lo forma sobre todo la ulnar.
  - [Deep palmar arch](https://en.wikipedia.org/wiki/Deep_palmar_arch): “It is usually primarily formed from the terminal part of the radial artery.”
  - [Deep palmar arch](https://en.wikipedia.org/wiki/Deep_palmar_arch): “The ulnar artery also contributes through an anastomosis.”
  - [Deep palmar arch](https://en.wikipedia.org/wiki/Deep_palmar_arch): “This is in contrast to the superficial palmar arch, which is formed predominantly by…”

### Arco palmar superficial (`Superficial_palmar_arch`)

Fuentes: [Superficial palmar arch](https://en.wikipedia.org/wiki/Superficial_palmar_arch).

- **Descripción.** Arco arterial de la palma de la mano formado sobre todo por la arteria ulnar, con la contribución de la rama palmar superficial de la radial.
  - [Superficial palmar arch](https://en.wikipedia.org/wiki/Superficial_palmar_arch): “The superficial palmar arch is formed predominantly by the ulnar artery, with a contribution…”
- **Descripción (sigue).** Cruza la palma en curva, con la convexidad hacia los dedos.
  - [Superficial palmar arch](https://en.wikipedia.org/wiki/Superficial_palmar_arch): “The arch passes across the palm in a curve”
  - [Superficial palmar arch](https://en.wikipedia.org/wiki/Superficial_palmar_arch): “with its convexity downward”

### Arteria ulnar (`Ulnar_artery`)

Fuentes: [Ulnar artery](https://en.wikipedia.org/wiki/Ulnar_artery).

- **Descripción.** Arteria principal de la cara medial del antebrazo.
  - [Ulnar artery](https://en.wikipedia.org/wiki/Ulnar_artery): “The ulnar artery is the main blood vessel, with oxygenated blood, of the medial…”
- **Descripción (sigue).** Es la mayor de las dos ramas en que se divide la braquial, un poco por debajo del pliegue del codo, y termina en el arco palmar superficial.
  - [Ulnar artery](https://en.wikipedia.org/wiki/Ulnar_artery): “the larger of the two terminal branches of the brachial, begins a little below…”
  - [Ulnar artery](https://en.wikipedia.org/wiki/Ulnar_artery): “It arises from the brachial artery and terminates in the superficial palmar arch”
- **Punto clave.** Se palpa en la cara anterior y medial de la muñeca.
  - [Ulnar artery](https://en.wikipedia.org/wiki/Ulnar_artery): “It is palpable on the anterior and medial aspect of the wrist.”

### Arteria circunfleja del corazón (`Circumflex_artery_of_heart`)

Fuentes: [Circumflex branch of left coronary artery](https://en.wikipedia.org/wiki/Circumflex_branch_of_left_coronary_artery).

- **Descripción.** Rama de la arteria coronaria izquierda que rodea el lado izquierdo del corazón por el surco coronario e irriga la parte posterolateral del ventrículo izquierdo.
  - [Circumflex branch of left coronary artery](https://en.wikipedia.org/wiki/Circumflex_branch_of_left_coronary_artery): “is a branch of the left coronary artery”
  - [Circumflex branch of left coronary artery](https://en.wikipedia.org/wiki/Circumflex_branch_of_left_coronary_artery): “It winds around the left side of the heart along the atrioventricular groove (coronary…”
  - [Circumflex branch of left coronary artery](https://en.wikipedia.org/wiki/Circumflex_branch_of_left_coronary_artery): “It supplies the posterolateral portion of the left ventricle.”
- **Punto clave.** En una minoría de personas da la arteria interventricular posterior: se dice entonces que el corazón tiene dominancia izquierda.
  - [Circumflex branch of left coronary artery](https://en.wikipedia.org/wiki/Circumflex_branch_of_left_coronary_artery): “In a minority of individuals, the left circumflex artery gives rise to the posterior…”

### Arteria comunicante anterior (`Anterior_communicating_artery`)

Fuentes: [Anterior communicating artery](https://en.wikipedia.org/wiki/Anterior_communicating_artery), [Posterior communicating artery](https://en.wikipedia.org/wiki/Posterior_communicating_artery).

- **Descripción.** Vaso del encéfalo que une las dos arterias cerebrales anteriores, la derecha y la izquierda.
  - [Anterior communicating artery](https://en.wikipedia.org/wiki/Anterior_communicating_artery): “is a blood vessel of the brain that connects the left and right anterior…”
- **Punto clave.** Sus aneurismas son los más frecuentes del círculo arterial del cerebro (polígono de Willis).
  - [Posterior communicating artery](https://en.wikipedia.org/wiki/Posterior_communicating_artery): “the most common are anterior communicating artery aneurysms”

### Arteria comunicante posterior (`Posterior_communicating_artery`)

Fuentes: [Posterior communicating artery](https://en.wikipedia.org/wiki/Posterior_communicating_artery).

- **Descripción.** Pequeña arteria de la base del encéfalo, una a cada lado, que forma parte del círculo arterial del cerebro (polígono de Willis).
  - [Posterior communicating artery](https://en.wikipedia.org/wiki/Posterior_communicating_artery): “the left and right posterior communicating arteries are small arteries at the base of…”
- **Descripción (sigue).** Por delante se une a la carótida interna y por detrás, a la cerebral posterior; con la comunicante anterior forma un sistema de circulación colateral en el encéfalo.
  - [Posterior communicating artery](https://en.wikipedia.org/wiki/Posterior_communicating_artery): “Anteriorly, it unites with the internal carotid artery”
  - [Posterior communicating artery](https://en.wikipedia.org/wiki/Posterior_communicating_artery): “posteriorly, it unites with the posterior cerebral artery”
  - [Posterior communicating artery](https://en.wikipedia.org/wiki/Posterior_communicating_artery): “With the anterior communicating artery, the posterior communicating arteries establish a system of collateral…”
- **Punto clave.** Sus aneurismas son los terceros más frecuentes del polígono de Willis y pueden paralizar el nervio oculomotor.
  - [Posterior communicating artery](https://en.wikipedia.org/wiki/Posterior_communicating_artery): “Aneurysms of the posterior communicating artery are the third most common circle of Willis…”
  - [Posterior communicating artery](https://en.wikipedia.org/wiki/Posterior_communicating_artery): “and can lead to oculomotor nerve palsy”

### Arteria oftálmica (`Ophthalmic_artery`)

Fuentes: [Ophthalmic artery](https://en.wikipedia.org/wiki/Ophthalmic_artery).

- **Descripción.** Arteria de la cabeza: es la primera rama de la carótida interna después del seno cavernoso.
  - [Ophthalmic artery](https://en.wikipedia.org/wiki/Ophthalmic_artery): “It is the first branch of the internal carotid artery distal to the cavernous…”
- **Descripción (sigue).** Sus ramas irrigan todas las estructuras de la órbita que rodean el ojo y algunas de la nariz, la cara y las meninges.
  - [Ophthalmic artery](https://en.wikipedia.org/wiki/Ophthalmic_artery): “Branches of the ophthalmic artery supply all the structures in the orbit around the…”
- **Punto clave.** Su obstrucción, o la de sus ramas, puede poner en peligro la vista.
  - [Ophthalmic artery](https://en.wikipedia.org/wiki/Ophthalmic_artery): “Occlusion of the ophthalmic artery or its branches can produce sight-threatening conditions.”

### Arteria meníngea media (`Middle_meningeal_artery`)

Fuentes: [Middle meningeal artery](https://en.wikipedia.org/wiki/Middle_meningeal_artery).

- **Descripción.** Rama de la arteria maxilar que entra en el cráneo por el foramen espinoso e irriga la duramadre y la bóveda del cráneo.
  - [Middle meningeal artery](https://en.wikipedia.org/wiki/Middle_meningeal_artery): “is typically the third branch of the first portion of the maxillary artery”
  - [Middle meningeal artery](https://en.wikipedia.org/wiki/Middle_meningeal_artery): “it runs through the foramen spinosum to supply the dura mater (the outer meningeal…”
- **Descripción (sigue).** Es la mayor de las tres arterias que irrigan las meninges.
  - [Middle meningeal artery](https://en.wikipedia.org/wiki/Middle_meningeal_artery): “The middle meningeal artery is the largest of the three (paired) arteries that supply…”
- **Punto clave.** Su rama anterior pasa bajo el pterion, donde el cráneo es fino; un golpe en la cabeza puede romperla, y su lesión es la causa más frecuente de hematoma epidural.
  - [Middle meningeal artery](https://en.wikipedia.org/wiki/Middle_meningeal_artery): “The anterior branch of the middle meningeal artery runs beneath the pterion.”
  - [Middle meningeal artery](https://en.wikipedia.org/wiki/Middle_meningeal_artery): “It is vulnerable to injury at this point, where the skull is thin.”
  - [Middle meningeal artery](https://en.wikipedia.org/wiki/Middle_meningeal_artery): “A head injury (e.g., from a road traffic accident or sports injury) is required…”
  - [Middle meningeal artery](https://en.wikipedia.org/wiki/Middle_meningeal_artery): “An injured middle meningeal artery is the most common cause of an epidural hematoma.”

### Arteria maxilar (`Maxillary_artery`)

Fuentes: [Maxillary artery](https://en.wikipedia.org/wiki/Maxillary_artery).

- **Descripción.** Arteria que irriga las estructuras profundas de la cara. Nace de la carótida externa, por dentro del cuello de la mandíbula.
  - [Maxillary artery](https://en.wikipedia.org/wiki/Maxillary_artery): “supplies deep structures of the face”
  - [Maxillary artery](https://en.wikipedia.org/wiki/Maxillary_artery): “It branches from the external carotid artery just deep to the neck of the…”

### Arteria gástrica izquierda (`Left_gastric_artery`)

Fuentes: [Left gastric artery](https://en.wikipedia.org/wiki/Left_gastric_artery).

- **Descripción.** Arteria que nace del tronco celíaco y recorre la parte alta de la curvatura menor del estómago hasta unirse con la arteria gástrica derecha.
  - [Left gastric artery](https://en.wikipedia.org/wiki/Left_gastric_artery): “arises from the celiac artery and runs along the superior portion of the lesser…”
- **Descripción (sigue).** También da ramas para la parte baja del esófago.
  - [Left gastric artery](https://en.wikipedia.org/wiki/Left_gastric_artery): “It also issues esophageal branches that supply lower esophagus”
- **Punto clave.** Si una úlcera péptica erosiona una de sus ramas, puede causar una gran hemorragia en el estómago, con vómitos de sangre o heces negras.
  - [Left gastric artery](https://en.wikipedia.org/wiki/Left_gastric_artery): “if an ulcer erodes through the stomach mucosa into a branch of the artery,…”

### Arteria gastroduodenal (`Gastroduodenal_artery`)

Fuentes: [Gastroduodenal artery](https://en.wikipedia.org/wiki/Gastroduodenal_artery).

- **Descripción.** Pequeña arteria del abdomen que lleva sangre al píloro y a la primera parte del duodeno, y de forma indirecta a la cabeza del páncreas.
  - [Gastroduodenal artery](https://en.wikipedia.org/wiki/Gastroduodenal_artery): “is a small blood vessel in the abdomen”
  - [Gastroduodenal artery](https://en.wikipedia.org/wiki/Gastroduodenal_artery): “It supplies blood directly to the pylorus (distal part of the stomach) and proximal…”
  - [Gastroduodenal artery](https://en.wikipedia.org/wiki/Gastroduodenal_artery): “It also indirectly supplies the pancreatic head”
- **Punto clave.** Puede sangrar mucho como complicación de una úlcera péptica.
  - [Gastroduodenal artery](https://en.wikipedia.org/wiki/Gastroduodenal_artery): “The gastroduodenal artery can be the source of a significant gastrointestinal bleed, which may…”

### Arteria testicular (`Testicular_artery`)

Fuentes: [Testicular artery](https://en.wikipedia.org/wiki/Testicular_artery).

- **Descripción.** Rama de la aorta abdominal que lleva sangre al testículo; hay una para cada testículo.
  - [Testicular artery](https://en.wikipedia.org/wiki/Testicular_artery): “is a branch of the abdominal aorta that supplies blood to the testicle”
  - [Testicular artery](https://en.wikipedia.org/wiki/Testicular_artery): “It is a paired artery, with one for each of the testicles.”
- **Descripción (sigue).** Nace de la parte anterior de la aorta, un poco por debajo de las arterias renales, y baja por detrás del peritoneo, apoyada en el músculo psoas mayor.
  - [Testicular artery](https://en.wikipedia.org/wiki/Testicular_artery): “arise from the front of the aorta a little below the renal arteries”
  - [Testicular artery](https://en.wikipedia.org/wiki/Testicular_artery): “Each passes obliquely downward and lateralward behind the peritoneum, resting on the psoas major”
- **Punto clave.** Es la equivalente masculina de la arteria ovárica; como el testículo está en otro lugar, su trayecto es distinto.
  - [Testicular artery](https://en.wikipedia.org/wiki/Testicular_artery): “It is the male equivalent of the ovarian artery.”
  - [Testicular artery](https://en.wikipedia.org/wiki/Testicular_artery): “it has a different course than the ovarian artery”
- **Punto clave.** Puede dañarse al operar una hernia inguinal, lo que a veces atrofia poco a poco el testículo.
  - [Testicular artery](https://en.wikipedia.org/wiki/Testicular_artery): “The testicular artery may be damaged during inguinal hernia repair, possibly resulting in insidious…”

### Arteria epigástrica inferior (`Inferior_epigastric_artery`)

Fuentes: [Inferior epigastric artery](https://en.wikipedia.org/wiki/Inferior_epigastric_artery).

- **Descripción.** Arteria que nace de la ilíaca externa y sube, junto con su vena, por el pliegue umbilical lateral.
  - [Inferior epigastric artery](https://en.wikipedia.org/wiki/Inferior_epigastric_artery): “is an artery that arises from the external iliac artery”
  - [Inferior epigastric artery](https://en.wikipedia.org/wiki/Inferior_epigastric_artery): “It is accompanied by the inferior epigastric vein; inferiorly, these two inferior epigastric vessels…”
- **Descripción (sigue).** Después entra en la vaina del músculo recto del abdomen y allí se une con la arteria epigástrica superior.
  - [Inferior epigastric artery](https://en.wikipedia.org/wiki/Inferior_epigastric_artery): “then anastomoses with the superior epigastric artery within the rectus sheath”
- **Punto clave.** El pliegue umbilical lateral marca el borde del triángulo de Hesselbach, por donde salen las hernias inguinales directas.
  - [Inferior epigastric artery](https://en.wikipedia.org/wiki/Inferior_epigastric_artery): “the area through which direct inguinal hernias protrude”

### Arteria braquial profunda (`Deep_brachial_artery`)

Fuentes: [Deep artery of arm](https://en.wikipedia.org/wiki/Deep_artery_of_arm).

- **Descripción.** Gran arteria del brazo que nace de la braquial, baja por el brazo y termina uniéndose a la arteria recurrente radial.
  - [Deep artery of arm](https://en.wikipedia.org/wiki/Deep_artery_of_arm): “is a large artery of the arm which arises from the brachial artery”
  - [Deep artery of arm](https://en.wikipedia.org/wiki/Deep_artery_of_arm): “It descends in the arm before ending by anastomosing with the radial recurrent artery.”

### Arco plantar (`Plantar_arch`)

Fuentes: [Plantar arch](https://en.wikipedia.org/wiki/Plantar_arch).

- **Descripción.** Arco arterial que irriga la planta del pie; va desde el quinto metatarsiano hasta el primero.
  - [Plantar arch](https://en.wikipedia.org/wiki/Plantar_arch): “The plantar arch supplies the underside, or sole, of the foot.”
  - [Plantar arch](https://en.wikipedia.org/wiki/Plantar_arch): “The plantar arch runs from the 5th metatarsal and extends medially to the 1st…”
- **Descripción (sigue).** Lo forman la arteria plantar lateral y la rama plantar profunda de la arteria dorsal del pie, que se unen entre las bases del primer y el segundo metatarsianos.
  - [Plantar arch](https://en.wikipedia.org/wiki/Plantar_arch): “The arch is formed when the lateral plantar artery turns medially to the interval…”

### Vena cardíaca mayor (`Great_cardiac_vein`)

Fuentes: [Great cardiac vein](https://en.wikipedia.org/wiki/Great_cardiac_vein).

- **Descripción.** Vena del corazón, también llamada vena coronaria izquierda.
  - [Great cardiac vein](https://en.wikipedia.org/wiki/Great_cardiac_vein): “The great cardiac vein (left coronary vein) is a vein of the heart.”
- **Descripción (sigue).** Empieza en la punta del corazón, sube por el surco interventricular anterior y, en la cara posterior del corazón, se une a la vena oblicua del atrio izquierdo para formar el seno coronario.
  - [Great cardiac vein](https://en.wikipedia.org/wiki/Great_cardiac_vein): “It begins at the apex of the heart and ascends along the anterior interventricular…”

### Vena cardiaca media (`Middle_cardiac_vein`)

Fuentes: [Middle cardiac vein](https://en.wikipedia.org/wiki/Middle_cardiac_vein).

- **Descripción.** Vena del corazón que empieza en la punta y va hacia atrás por el surco interventricular inferior hasta el seno coronario, cerca de su desembocadura.
  - [Middle cardiac vein](https://en.wikipedia.org/wiki/Middle_cardiac_vein): “The middle cardiac vein commences at the apex of the heart.”
  - [Middle cardiac vein](https://en.wikipedia.org/wiki/Middle_cardiac_vein): “It passes posteriorly along the inferior interventricular sulcus to end at the coronary sinus…”
- **Punto clave.** Sirve para llegar desde la superficie del corazón a la cara inferior de los ventrículos.
  - [Middle cardiac vein](https://en.wikipedia.org/wiki/Middle_cardiac_vein): “The middle cardiac vein is useful for epicardial access to the inferior side of…”

### Seno sigmoideo (`Sigmoid_sinus`)

Fuentes: [Sigmoid sinus](https://en.wikipedia.org/wiki/Sigmoid_sinus), [Transverse sinuses](https://en.wikipedia.org/wiki/Transverse_sinuses).

- **Descripción.** Seno venoso de la duramadre con forma de S, uno a cada lado del cráneo.
  - [Sigmoid sinus](https://en.wikipedia.org/wiki/Sigmoid_sinus): “sigma- or s-shaped hollow curve”
  - [Sigmoid sinus](https://en.wikipedia.org/wiki/Sigmoid_sinus): “are paired dural venous sinuses within the skull”
- **Descripción (sigue).** Recibe la sangre del seno transverso y la lleva hacia la vena yugular interna.
  - [Sigmoid sinus](https://en.wikipedia.org/wiki/Sigmoid_sinus): “that receive blood from posterior transverse sinuses”
  - [Transverse sinuses](https://en.wikipedia.org/wiki/Transverse_sinuses): “to the sigmoid sinuses, which ultimately connect to the internal jugular vein”

### Seno transverso (`Transverse_sinus`)

Fuentes: [Transverse sinuses](https://en.wikipedia.org/wiki/Transverse_sinuses).

- **Descripción.** Uno de los dos senos transversos, conductos situados bajo el encéfalo que drenan la sangre de la parte posterior de la cabeza.
  - [Transverse sinuses](https://en.wikipedia.org/wiki/Transverse_sinuses): “are two areas beneath the brain which allow blood to drain from the back…”
- **Descripción (sigue).** Corre por un surco de la cara interna del hueso occipital, desde la confluencia de los senos hasta el seno sigmoideo, que acaba en la vena yugular interna.
  - [Transverse sinuses](https://en.wikipedia.org/wiki/Transverse_sinuses): “They run laterally in a groove along the interior surface of the occipital bone.”
  - [Transverse sinuses](https://en.wikipedia.org/wiki/Transverse_sinuses): “They drain from the confluence of sinuses (by the internal occipital protuberance) to the…”

### Seno cavernoso (`Cavernous_sinus`)

Fuentes: [Cavernous sinus](https://en.wikipedia.org/wiki/Cavernous_sinus).

- **Descripción.** Seno venoso de la duramadre situado a cada lado de la silla turca, entre el hueso temporal y el esfenoides.
  - [Cavernous sinus](https://en.wikipedia.org/wiki/Cavernous_sinus): “is one of the dural venous sinuses creating a cavity called the lateral sellar…”
- **Punto clave.** Es el único lugar del cuerpo donde una arteria, la carótida interna, atraviesa por completo una estructura venosa; si se rompe dentro de él, se forma una fístula carótido-cavernosa.
  - [Cavernous sinus](https://en.wikipedia.org/wiki/Cavernous_sinus): “It is the only anatomic location in the body in which an artery travels…”
  - [Cavernous sinus](https://en.wikipedia.org/wiki/Cavernous_sinus): “If the internal carotid artery ruptures within the cavernous sinus, an arteriovenous fistula is…”

### Seno recto (`Straight_sinus`)

Fuentes: [Straight sinus](https://en.wikipedia.org/wiki/Straight_sinus).

- **Descripción.** Conducto venoso del interior del cráneo, bajo el encéfalo.
  - [Straight sinus](https://en.wikipedia.org/wiki/Straight_sinus): “is an area within the skull beneath the brain”
- **Descripción (sigue).** Recibe la sangre del seno sagital inferior y de la vena cerebral magna, y la lleva a la confluencia de los senos.
  - [Straight sinus](https://en.wikipedia.org/wiki/Straight_sinus): “It receives blood from the inferior sagittal sinus and the great cerebral vein, and…”

### Arco venoso dorsal del pie (`Dorsal_venous_arch_of_foot`)

Fuentes: [Dorsal venous arch of the foot](https://en.wikipedia.org/wiki/Dorsal_venous_arch_of_the_foot).

- **Descripción.** Vena superficial del dorso del pie que une la vena safena menor con la safena mayor.
  - [Dorsal venous arch of the foot](https://en.wikipedia.org/wiki/Dorsal_venous_arch_of_the_foot): “is a superficial vein that connects the small saphenous vein and the great saphenous…”
- **Descripción (sigue).** Está sobre los metatarsianos, a medio camino entre el tobillo y las articulaciones metatarsofalángicas.
  - [Dorsal venous arch of the foot](https://en.wikipedia.org/wiki/Dorsal_venous_arch_of_the_foot): “It lies superior to the metatarsal bones approximately midway between the ankle joint and…”
- **Punto clave.** Suele ser fácil de palpar y de ver con el pie descalzo.
  - [Dorsal venous arch of the foot](https://en.wikipedia.org/wiki/Dorsal_venous_arch_of_the_foot): “It is usually fairly easy to palpate and visualize (if the patient is barefoot).”

### Vena poplítea (`Popliteal_vein`)

Fuentes: [Popliteal vein](https://en.wikipedia.org/wiki/Popliteal_vein).

- **Descripción.** Vena del miembro inferior que drena la sangre de la pierna.
  - [Popliteal vein](https://en.wikipedia.org/wiki/Popliteal_vein): “The popliteal vein is a vein of the lower limb.”
  - [Popliteal vein](https://en.wikipedia.org/wiki/Popliteal_vein): “It drains blood from the leg.”
- **Descripción (sigue).** La forman las venas tibiales anterior y posterior; va por dentro de la arteria poplítea y se continúa con la vena femoral.
  - [Popliteal vein](https://en.wikipedia.org/wiki/Popliteal_vein): “It is formed from the anterior tibial vein and the posterior tibial vein.”
  - [Popliteal vein](https://en.wikipedia.org/wiki/Popliteal_vein): “It travels medial to the popliteal artery, and becomes the femoral vein.”
- **Punto clave.** Se puede ver con ecografía Doppler, y en ella pueden formarse trombos.
  - [Popliteal vein](https://en.wikipedia.org/wiki/Popliteal_vein): “The popliteal vein can be visualised using medical ultrasound, including Doppler ultrasonography.”
  - [Popliteal vein](https://en.wikipedia.org/wiki/Popliteal_vein): “It may be affected by a thrombus.”

### Vena ácigos (`Azygos_vein`)

Fuentes: [Azygos vein](https://en.wikipedia.org/wiki/Azygos_vein).

- **Descripción.** Vena que sube por el lado derecho de la columna torácica y desemboca en la vena cava superior.
  - [Azygos vein](https://en.wikipedia.org/wiki/Azygos_vein): “is a vein running up the right side of the thoracic vertebral column draining…”
- **Descripción (sigue).** Une los territorios de las dos venas cavas, así que puede llevar la sangre al atrio derecho por otro camino si una de ellas se obstruye.
  - [Azygos vein](https://en.wikipedia.org/wiki/Azygos_vein): “It connects the systems of superior vena cava and inferior vena cava and can…”
- **Punto clave.** Su nombre viene del griego ázygos, «sin pareja».
  - [Azygos vein](https://en.wikipedia.org/wiki/Azygos_vein): “meaning 'unwedded' or 'unpaired'”

### Vena hemiácigos (`Hemi_azygos_vein`)

Fuentes: [Hemiazygos vein](https://en.wikipedia.org/wiki/Hemiazygos_vein).

- **Descripción.** Vena que sube por la parte baja del tórax, justo a la izquierda de la columna vertebral.
  - [Hemiazygos vein](https://en.wikipedia.org/wiki/Hemiazygos_vein): “is a vein running superiorly in the lower thoracic region, just to the left…”
- **Descripción (sigue).** Con la vena hemiácigos accesoria hace en el lado izquierdo el papel de la ácigos: drena la mayoría de las venas intercostales posteriores izquierdas.
  - [Hemiazygos vein](https://en.wikipedia.org/wiki/Hemiazygos_vein): “The hemiazygos vein and the accessory hemiazygos vein, when taken together, essentially serve as…”
  - [Hemiazygos vein](https://en.wikipedia.org/wiki/Hemiazygos_vein): “the hemiazygos vein and the accessory hemiazygos vein drain most of the posterior intercostal…”

### Vena iliaca común (`Common_iliac_vein`)

Fuentes: [Common iliac vein](https://en.wikipedia.org/wiki/Common_iliac_vein).

- **Descripción.** Vena que drena la sangre de la pelvis y del miembro inferior. La forman las venas ilíacas externa e interna.
  - [Common iliac vein](https://en.wikipedia.org/wiki/Common_iliac_vein): “They drain blood from the pelvis and lower limbs.”
  - [Common iliac vein](https://en.wikipedia.org/wiki/Common_iliac_vein): “the common iliac veins are formed by the external iliac veins and internal iliac…”
- **Descripción (sigue).** Las dos venas ilíacas comunes se unen a la altura de la quinta vértebra lumbar para formar la vena cava inferior.
  - [Common iliac vein](https://en.wikipedia.org/wiki/Common_iliac_vein): “The left and right common iliac veins come together in the abdomen at the…”
- **Punto clave.** La arteria ilíaca común derecha puede comprimir la vena ilíaca común izquierda contra la quinta vértebra lumbar: es el síndrome de May-Thurner.
  - [Common iliac vein](https://en.wikipedia.org/wiki/Common_iliac_vein): “Compression of the left common iliac vein against the fifth lumbar vertebral body by…”

### Vena iliaca externa (`External_iliac_vein`)

Fuentes: [External iliac vein](https://en.wikipedia.org/wiki/External_iliac_vein).

- **Descripción.** Gran vena que une la vena femoral con la ilíaca común.
  - [External iliac vein](https://en.wikipedia.org/wiki/External_iliac_vein): “The external iliac veins are large veins that connect the femoral veins to the…”
- **Descripción (sigue).** Empieza en el borde inferior del ligamento inguinal y termina al unirse con la vena ilíaca interna; la acompaña la arteria ilíaca externa.
  - [External iliac vein](https://en.wikipedia.org/wiki/External_iliac_vein): “Their origin is at the inferior margin of the inguinal ligaments and they terminate…”
  - [External iliac vein](https://en.wikipedia.org/wiki/External_iliac_vein): “Both external iliac veins are accompanied along their course by external iliac arteries.”

### Vena iliaca interna (`Internal_iliac_vein`)

Fuentes: [Internal iliac vein](https://en.wikipedia.org/wiki/Internal_iliac_vein).

- **Descripción.** También llamada vena hipogástrica, empieza cerca de la parte alta del foramen ciático mayor y sube por detrás de la arteria ilíaca interna.
  - [Internal iliac vein](https://en.wikipedia.org/wiki/Internal_iliac_vein): “The internal iliac vein (hypogastric vein) begins near the upper part of the greater…”
- **Descripción (sigue).** En el borde de la pelvis se une a la vena ilíaca externa para formar la ilíaca común.
  - [Internal iliac vein](https://en.wikipedia.org/wiki/Internal_iliac_vein): “at the brim of the pelvis, joins with the external iliac vein to form…”
- **Punto clave.** Si una trombosis corta el paso por las venas ilíacas externas, sus afluentes son un camino importante de vuelta para la sangre de la pierna.
  - [Internal iliac vein](https://en.wikipedia.org/wiki/Internal_iliac_vein): “If thrombosis disrupts blood flow in the external iliac systems, the internal iliac tributaries…”

### Venas hepáticas (`Hepatic_veins`)

Fuentes: [Hepatic veins](https://en.wikipedia.org/wiki/Hepatic_veins).

- **Descripción.** Venas que llevan la sangre del hígado a la vena cava inferior; la vena porta, en cambio, lleva al hígado la sangre del tubo digestivo.
  - [Hepatic veins](https://en.wikipedia.org/wiki/Hepatic_veins): “the hepatic veins are the veins that drain venous blood from the liver into…”
- **Descripción (sigue).** Suele haber tres grandes venas hepáticas superiores, de las partes izquierda, media y derecha del hígado, y de 6 a 20 inferiores; ninguna tiene válvulas.
  - [Hepatic veins](https://en.wikipedia.org/wiki/Hepatic_veins): “There are usually three large upper hepatic veins draining from the left, middle, and…”
  - [Hepatic veins](https://en.wikipedia.org/wiki/Hepatic_veins): “All hepatic veins are valveless.”
- **Punto clave.** Su obstrucción, por ejemplo por un coágulo, causa el síndrome de Budd-Chiari: dolor abdominal, ascitis y aumento del tamaño del hígado.
  - [Hepatic veins](https://en.wikipedia.org/wiki/Hepatic_veins): “is a condition caused by blockage of the hepatic veins, such as by a…”
  - [Hepatic veins](https://en.wikipedia.org/wiki/Hepatic_veins): “of abdominal pain, ascites, and liver enlargement”

### Vena mesentérica inferior (`Inferior_mesenteric_vein`)

Fuentes: [Inferior mesenteric vein](https://en.wikipedia.org/wiki/Inferior_mesenteric_vein).

- **Descripción.** Vena que drena la sangre del intestino grueso.
  - [Inferior mesenteric vein](https://en.wikipedia.org/wiki/Inferior_mesenteric_vein): “is a blood vessel that drains blood from the large intestine”
- **Descripción (sigue).** Suele terminar en la vena esplénica, que después forma la vena porta con la mesentérica superior.
  - [Inferior mesenteric vein](https://en.wikipedia.org/wiki/Inferior_mesenteric_vein): “It usually terminates when reaching the splenic vein, which goes on to form the…”
- **Punto clave.** Si se desgarra en una cirugía del páncreas, se puede ligar: otras venas también drenan el intestino grueso.
  - [Inferior mesenteric vein](https://en.wikipedia.org/wiki/Inferior_mesenteric_vein): “may be damaged during surgery on the body and tail of the pancreas”
  - [Inferior mesenteric vein](https://en.wikipedia.org/wiki/Inferior_mesenteric_vein): “If a serious laceration occurs, the inferior mesenteric vein may be ligated, as other…”

### Vena mesentérica superior (`Superior_mesenteric_vein`)

Fuentes: [Superior mesenteric vein](https://en.wikipedia.org/wiki/Superior_mesenteric_vein).

- **Descripción.** Vena que drena la sangre del intestino delgado (yeyuno e íleon); va a la derecha de la arteria mesentérica superior.
  - [Superior mesenteric vein](https://en.wikipedia.org/wiki/Superior_mesenteric_vein): “is a blood vessel that drains blood from the small intestine (jejunum and ileum)”
  - [Superior mesenteric vein](https://en.wikipedia.org/wiki/Superior_mesenteric_vein): “The superior mesenteric vein lies to the right of the similarly named artery”
- **Descripción (sigue).** Detrás del cuello del páncreas se une con la vena esplénica para formar la vena porta, que lleva la sangre al hígado.
  - [Superior mesenteric vein](https://en.wikipedia.org/wiki/Superior_mesenteric_vein): “Behind the neck of the pancreas, the superior mesenteric vein combines with the splenic…”
- **Punto clave.** Su trombosis es rara, pero es una causa importante de isquemia mesentérica y puede ser mortal.
  - [Superior mesenteric vein](https://en.wikipedia.org/wiki/Superior_mesenteric_vein): “Thrombosis of the superior mesenteric vein is quite rare, but a significant cause of…”

### Vena esplénica (`Splenic_vein`)

Fuentes: [Splenic vein](https://en.wikipedia.org/wiki/Splenic_vein).

- **Descripción.** Vena que drena la sangre del bazo, del fondo del estómago y de parte del páncreas. Forma parte del sistema porta del hígado.
  - [Splenic vein](https://en.wikipedia.org/wiki/Splenic_vein): “is a blood vessel that drains blood from the spleen, the stomach fundus and…”
  - [Splenic vein](https://en.wikipedia.org/wiki/Splenic_vein): “It is part of the hepatic portal system.”
- **Punto clave.** Su trombosis puede causar varices en la pared del estómago.
  - [Splenic vein](https://en.wikipedia.org/wiki/Splenic_vein): “The splenic vein can be affected by thrombosis”
  - [Splenic vein](https://en.wikipedia.org/wiki/Splenic_vein): “These include varices in the stomach wall due to hypertension in the short gastric…”

### Vena braquiocefálica izquierda (`Left_brachiocephalic_vein`)

Fuentes: [Brachiocephalic vein](https://en.wikipedia.org/wiki/Brachiocephalic_vein).

- **Descripción.** Gran vena de la parte alta del tórax que se forma detrás de la articulación esternoclavicular izquierda, al unirse la yugular interna y la subclavia izquierdas.
  - [Brachiocephalic vein](https://en.wikipedia.org/wiki/Brachiocephalic_vein): “are major veins in the upper chest, formed by the union of the ipsilateral…”
- **Descripción (sigue).** Mide más del doble que la derecha, y las dos se unen para formar la vena cava superior.
  - [Brachiocephalic vein](https://en.wikipedia.org/wiki/Brachiocephalic_vein): “The left brachiocephalic vein is more than twice the length of the right brachiocephalic…”
  - [Brachiocephalic vein](https://en.wikipedia.org/wiki/Brachiocephalic_vein): “These veins merge to form the superior vena cava”
- **Punto clave.** Antes se llamaban venas innominadas.
  - [Brachiocephalic vein](https://en.wikipedia.org/wiki/Brachiocephalic_vein): “previously called innominate veins”

### Vena braquiocefálica derecha (`Right_brachiocephalic_vein`)

Fuentes: [Brachiocephalic vein](https://en.wikipedia.org/wiki/Brachiocephalic_vein).

- **Descripción.** Gran vena de la parte alta del tórax que se forma detrás de la articulación esternoclavicular derecha, al unirse la yugular interna y la subclavia derechas.
  - [Brachiocephalic vein](https://en.wikipedia.org/wiki/Brachiocephalic_vein): “are major veins in the upper chest, formed by the union of the ipsilateral…”
- **Descripción (sigue).** La izquierda mide más del doble que ella, y las dos se unen para formar la vena cava superior.
  - [Brachiocephalic vein](https://en.wikipedia.org/wiki/Brachiocephalic_vein): “The left brachiocephalic vein is more than twice the length of the right brachiocephalic…”
  - [Brachiocephalic vein](https://en.wikipedia.org/wiki/Brachiocephalic_vein): “These veins merge to form the superior vena cava”
- **Punto clave.** Antes se llamaban venas innominadas.
  - [Brachiocephalic vein](https://en.wikipedia.org/wiki/Brachiocephalic_vein): “previously called innominate veins”

### Vena renal izquierda (`Left_renal_vein`)

Fuentes: [Renal vein](https://en.wikipedia.org/wiki/Renal_vein), [Superior mesenteric artery](https://en.wikipedia.org/wiki/Superior_mesenteric_artery), [Ovarian vein](https://en.wikipedia.org/wiki/Ovarian_vein).

- **Descripción.** Gran vena que lleva a la cava inferior la sangre ya filtrada por el riñón izquierdo; la forman las venas interlobares del riñón.
  - [Renal vein](https://en.wikipedia.org/wiki/Renal_vein): “are large-calibre veins that drain blood filtered by the kidneys into the inferior vena…”
  - [Renal vein](https://en.wikipedia.org/wiki/Renal_vein): “Each renal vein is formed by the convergence of the interlobar veins of one…”
- **Descripción (sigue).** Es más larga que la derecha porque la vena cava inferior está en la mitad derecha del cuerpo.
  - [Renal vein](https://en.wikipedia.org/wiki/Renal_vein): “Because the inferior vena cava is on the right half of the body, the…”
- **Punto clave.** Puede quedar atrapada entre la arteria mesentérica superior y la aorta: es el síndrome del cascanueces.
  - [Superior mesenteric artery](https://en.wikipedia.org/wiki/Superior_mesenteric_artery): “can be compressed between the SMA and the abdominal aorta at this location, leading…”
- **Punto clave.** En la mujer, a menudo recibe la vena ovárica izquierda.
  - [Ovarian vein](https://en.wikipedia.org/wiki/Ovarian_vein): “The left ovarian vein, unlike the right, often joins the left renal vein”

### Vena renal derecha (`Right_renal_vein`)

Fuentes: [Renal vein](https://en.wikipedia.org/wiki/Renal_vein).

- **Descripción.** Gran vena que lleva a la cava inferior la sangre ya filtrada por el riñón derecho; la forman las venas interlobares del riñón.
  - [Renal vein](https://en.wikipedia.org/wiki/Renal_vein): “are large-calibre veins that drain blood filtered by the kidneys into the inferior vena…”
  - [Renal vein](https://en.wikipedia.org/wiki/Renal_vein): “Each renal vein is formed by the convergence of the interlobar veins of one…”
- **Descripción (sigue).** Es más corta que la izquierda porque la vena cava inferior está en la mitad derecha del cuerpo.
  - [Renal vein](https://en.wikipedia.org/wiki/Renal_vein): “Because the inferior vena cava is on the right half of the body, the…”

### Vena subclavia (`Subclavian_vein`)

Fuentes: [Subclavian vein](https://en.wikipedia.org/wiki/Subclavian_vein).

- **Descripción.** Gran vena, una a cada lado, que drena la sangre del miembro superior para que vuelva al corazón. Mide de 1 a 2 cm de diámetro.
  - [Subclavian vein](https://en.wikipedia.org/wiki/Subclavian_vein): “is a paired large vein, one on either side of the body, that is…”
  - [Subclavian vein](https://en.wikipedia.org/wiki/Subclavian_vein): “The diameter of the subclavian veins is approximately 1–2 cm, depending on the individual.”
- **Punto clave.** La izquierda recibe la linfa del conducto torácico, y con ella pasan a la sangre las grasas absorbidas.
  - [Subclavian vein](https://en.wikipedia.org/wiki/Subclavian_vein): “The left subclavian vein plays a key role in the absorption of lipids, by…”

### Vena axilar (`Axillary_vein`)

Fuentes: [Axillary vein](https://en.wikipedia.org/wiki/Axillary_vein), [Brachial veins](https://en.wikipedia.org/wiki/Brachial_veins).

- **Descripción.** Gran vena que lleva hacia el corazón la sangre de la cara lateral del tórax, de la axila y del miembro superior; hay una a cada lado.
  - [Axillary vein](https://en.wikipedia.org/wiki/Axillary_vein): “is a large blood vessel that conveys blood from the lateral aspect of the…”
  - [Axillary vein](https://en.wikipedia.org/wiki/Axillary_vein): “There is one axillary vein on each side of the body.”
- **Descripción (sigue).** Se forma por la unión de las venas braquiales con la vena basílica.
  - [Brachial veins](https://en.wikipedia.org/wiki/Brachial_veins): “the brachial veins join the basilic vein to form the axillary vein”

### Venas braquiales (`Brachial_veins`)

Fuentes: [Brachial veins](https://en.wikipedia.org/wiki/Brachial_veins).

- **Descripción.** Venas profundas que acompañan a la arteria braquial en el brazo.
  - [Brachial veins](https://en.wikipedia.org/wiki/Brachial_veins): “the brachial veins are venae comitantes of the brachial artery in the arm proper”
  - [Brachial veins](https://en.wikipedia.org/wiki/Brachial_veins): “Because they are deep to muscle, they are considered deep veins.”
- **Descripción (sigue).** Empiezan donde se unen las venas radiales y ulnares, y en el borde inferior del músculo redondo mayor se unen a la vena basílica para formar la vena axilar.
  - [Brachial veins](https://en.wikipedia.org/wiki/Brachial_veins): “they begin where radial veins and ulnar veins join”
  - [Brachial veins](https://en.wikipedia.org/wiki/Brachial_veins): “They end at the inferior border of the teres major muscle.”
  - [Brachial veins](https://en.wikipedia.org/wiki/Brachial_veins): “the brachial veins join the basilic vein to form the axillary vein”
- **Punto clave.** Reciben pequeñas venas de los músculos del brazo, como el bíceps y el tríceps.
  - [Brachial veins](https://en.wikipedia.org/wiki/Brachial_veins): “The brachial veins also have small tributaries that drain the muscles of the upper…”

### Red venosa dorsal de la mano (`Dorsal_venous_network_of_hand`)

Fuentes: [Dorsal venous network of hand](https://en.wikipedia.org/wiki/Dorsal_venous_network_of_hand).

- **Descripción.** Red de venas del dorso de la mano, formada por las venas metacarpianas dorsales y por venas digitales dorsales del índice, del meñique y del pulgar.
  - [Dorsal venous network of hand](https://en.wikipedia.org/wiki/Dorsal_venous_network_of_hand): “is a venous network on the dorsum (backside) of hand”
  - [Dorsal venous network of hand](https://en.wikipedia.org/wiki/Dorsal_venous_network_of_hand): “It is formed by the dorsal metacarpal veins (three in number)”
- **Descripción (sigue).** De ella nacen las venas cefálica y basílica.
  - [Dorsal venous network of hand](https://en.wikipedia.org/wiki/Dorsal_venous_network_of_hand): “The venous network gives rise to the cephalic vein and the basilic vein”

### Vena facial (`Facial_vein`)

Fuentes: [Facial vein](https://en.wikipedia.org/wiki/Facial_vein).

- **Descripción.** Vena relativamente grande de la cara. Empieza junto a la raíz de la nariz, como continuación de la vena angular, y va por detrás de la arteria facial con un trayecto menos tortuoso.
  - [Facial vein](https://en.wikipedia.org/wiki/Facial_vein): “is a relatively large vein in the human face”
  - [Facial vein](https://en.wikipedia.org/wiki/Facial_vein): “It commences at the side of the root of the nose and is a…”
  - [Facial vein](https://en.wikipedia.org/wiki/Facial_vein): “It lies behind the facial artery and follows a less tortuous course.”
- **Descripción (sigue).** Termina uniéndose a la rama anterior de la vena retromandibular o directamente en la vena yugular interna.
  - [Facial vein](https://en.wikipedia.org/wiki/Facial_vein): “either joins the anterior branch of the retromandibular vein to form the common facial…”
- **Punto clave.** Las infecciones de la cara pueden extenderse por ella hasta los senos venosos de la duramadre; un coágulo infectado puede llegar al seno cavernoso.
  - [Facial vein](https://en.wikipedia.org/wiki/Facial_vein): “Infections may spread from the facial veins into the dural venous sinuses.”
  - [Facial vein](https://en.wikipedia.org/wiki/Facial_vein): “can result in pieces of an infected clot extending into the cavernous sinus”

### Vena retromandibular (`Retromandibular_vein`)

Fuentes: [Retromandibular vein](https://en.wikipedia.org/wiki/Retromandibular_vein).

- **Descripción.** Vena importante de la cara que se forma dentro de la glándula parótida, al unirse las venas maxilar y temporal superficial.
  - [Retromandibular vein](https://en.wikipedia.org/wiki/Retromandibular_vein): “is a major vein of the face”
  - [Retromandibular vein](https://en.wikipedia.org/wiki/Retromandibular_vein): “It is formed within the parotid gland by the confluence of the maxillary vein,…”
- **Descripción (sigue).** Al salir de la glándula se divide en dos ramas: la anterior se une a la vena facial y la posterior forma, con la auricular posterior, la vena yugular externa.
  - [Retromandibular vein](https://en.wikipedia.org/wiki/Retromandibular_vein): “It descends in the gland and splits into two branches upon emerging from the…”
  - [Retromandibular vein](https://en.wikipedia.org/wiki/Retromandibular_vein): “Its anterior branch then joins the (anterior) facial vein forming the common facial vein,…”

## Sistema nervioso: descripciones por tejido

### Tejido «Corteza cerebral» (`TEJIDO.cortex`)

Fuentes: [Cerebral cortex](https://en.wikipedia.org/wiki/Cerebral_cortex).

- **Descripción.** Parte de la corteza cerebral, la capa externa de tejido nervioso del cerebro, de 2 a 4 mm de grosor en el ser humano. **(reescrita)**
  - [Cerebral cortex](https://en.wikipedia.org/wiki/Cerebral_cortex): “is the outer layer of neural tissue of the cerebrum of the brain in…”
  - [Cerebral cortex](https://en.wikipedia.org/wiki/Cerebral_cortex): “the ones with the largest brains, such as humans and fin whales, have thicknesses…”
- **Descripción (sigue).** Está plegada, lo que le da más superficie dentro del cráneo, e interviene en la atención, la percepción, el pensamiento, la memoria, el lenguaje y la conciencia. **(reescrita)**
  - [Cerebral cortex](https://en.wikipedia.org/wiki/Cerebral_cortex): “the cerebral cortex is folded, providing a greater surface area in the confined volume…”
  - [Cerebral cortex](https://en.wikipedia.org/wiki/Cerebral_cortex): “and plays a key role in attention, perception, awareness, thought, memory, language, and consciousness.”

### Tejido «Cerebelo» (`TEJIDO.cerebellum`)

Fuentes: [Cerebellum](https://en.wikipedia.org/wiki/Cerebellum).

- **Descripción.** Parte del cerebelo, que no inicia los movimientos pero contribuye a coordinarlos y a que sean precisos y a tiempo. **(reescrita)**
  - [Cerebellum](https://en.wikipedia.org/wiki/Cerebellum): “The human cerebellum does not initiate movement, but contributes to motor coordination, precision, and…”
- **Descripción (sigue).** Su lesión altera los movimientos finos, el equilibrio y la postura. **(reescrita)**
  - [Cerebellum](https://en.wikipedia.org/wiki/Cerebellum): “Cerebellar damage produces disorders in fine movement, equilibrium, posture, and motor learning in humans.”
- **Descripción (sigue).** Ocupa solo un 10 % del volumen del encéfalo, pero tiene más neuronas que todo el resto junto. **(reescrita)**
  - [Cerebellum](https://en.wikipedia.org/wiki/Cerebellum): “Because of its large number of tiny granule cells, the cerebellum contains more neurons…”

### Tejido «Tronco del encéfalo» (`TEJIDO.brainstem`)

Fuentes: [Brainstem](https://en.wikipedia.org/wiki/Brainstem).

- **Descripción.** Parte del tronco del encéfalo, que une el cerebro con la médula espinal.
  - [Brainstem](https://en.wikipedia.org/wiki/Brainstem): “The brainstem (or brain stem) is the posterior stalk-like part of the brain that…”
- **Descripción (sigue).** Regula la función del corazón y la respiración, y de él salen diez pares de nervios craneales. **(reescrita)**
  - [Brainstem](https://en.wikipedia.org/wiki/Brainstem): “It has the critical roles of regulating heart and respiratory function”
  - [Brainstem](https://en.wikipedia.org/wiki/Brainstem): “Ten pairs of cranial nerves come from the brainstem.”

### Tejido «Sustancia blanca» (`TEJIDO.white_matter`)

Fuentes: [White matter](https://en.wikipedia.org/wiki/White_matter), [Myelin](https://en.wikipedia.org/wiki/Myelin).

- **Descripción.** Haces de fibras nerviosas recubiertas de mielina que conectan unas regiones con otras y transmiten las señales a gran velocidad.
  - [White matter](https://en.wikipedia.org/wiki/White_matter): “White matter is composed of bundles, which connect various grey matter areas (the locations…”
- **Descripción (sigue).** La mielina, rica en grasa, le da su color blanquecino.
  - [Myelin](https://en.wikipedia.org/wiki/Myelin): “Being rich in lipid, myelin appears white, hence its earlier name of white matter…”

### Tejido «Núcleo de sustancia gris» (`TEJIDO.nucleus`)

Fuentes: [Nucleus (neuroanatomy)](https://en.wikipedia.org/wiki/Nucleus_%28neuroanatomy%29).

- **Descripción.** Agrupación de neuronas en el interior del sistema nervioso central: en los hemisferios cerebrales, el tronco del encéfalo o el cerebelo. **(reescrita)**
  - [Nucleus (neuroanatomy)](https://en.wikipedia.org/wiki/Nucleus_%28neuroanatomy%29): “In neuroanatomy, a nucleus (pl.: nuclei) is a cluster of neurons in the central…”
- **Descripción (sigue).** Las neuronas de un mismo núcleo suelen tener conexiones y funciones parecidas. **(reescrita)**
  - [Nucleus (neuroanatomy)](https://en.wikipedia.org/wiki/Nucleus_%28neuroanatomy%29): “The neurons in one nucleus usually have roughly similar connections and functions.”

### Tejido «Sistema ventricular» (`TEJIDO.csf`)

Fuentes: [Ventricular system](https://en.wikipedia.org/wiki/Ventricular_system).

- **Descripción.** Parte de los ventrículos, las cavidades llenas de líquido cefalorraquídeo, que baña y amortigua el encéfalo y la médula espinal. **(reescrita)**
  - [Ventricular system](https://en.wikipedia.org/wiki/Ventricular_system): “The ventricles are filled with cerebrospinal fluid (CSF) which bathes and cushions the brain…”

### Tejido «Meninges» (`TEJIDO.meninges`)

Fuentes: [Meninges](https://en.wikipedia.org/wiki/Meninges).

- **Descripción.** Parte de las meninges, las membranas que envuelven y protegen el encéfalo y la médula: duramadre (externa y resistente), aracnoides y piamadre (pegada al tejido nervioso).
  - [Meninges](https://en.wikipedia.org/wiki/Meninges): “is a durable, thick fibrous membrane that attaches to the inside of the skull…”

### Tejido «Nervio» (`TEJIDO.nerve`)

Fuentes: [Nerve](https://en.wikipedia.org/wiki/Nerve).

- **Descripción.** Haz de fibras nerviosas (axones) que conecta el sistema nervioso central con el resto del cuerpo: lleva órdenes a los músculos y las glándulas, y trae al sistema nervioso central la información de las neuronas sensitivas, por ejemplo de la piel. **(reescrita)**
  - [Nerve](https://en.wikipedia.org/wiki/Nerve): “The PNS consists mainly of nerves, which are enclosed bundles of the long fibers…”
  - [Nerve](https://en.wikipedia.org/wiki/Nerve): “Efferent nerves conduct signals from the central nervous system along motor neurons to their…”
  - [Nerve](https://en.wikipedia.org/wiki/Nerve): “Afferent nerves conduct sensory information from sensory neurons to the central nervous system, for…”

### Tejido «Ganglio» (`TEJIDO.ganglion`)

Fuentes: [Ganglion](https://en.wikipedia.org/wiki/Ganglion).

- **Descripción.** Agrupación de cuerpos de neuronas en el sistema nervioso periférico. **(reescrita)**
  - [Ganglion](https://en.wikipedia.org/wiki/Ganglion): “A ganglion (pl.: ganglia) is a group of neuron cell bodies in the peripheral…”

## Sistema nervioso: fichas que ya existían

### Nervio olfatorio (I) (`Olfactory_nerve_I`)

Fuentes: [Olfactory nerve](https://en.wikipedia.org/wiki/Olfactory_nerve), [Anosmia](https://en.wikipedia.org/wiki/Anosmia).

- **Descripción.** Fibras que nacen en la mucosa olfatoria, en la parte alta de la cavidad nasal, y suben a través de la lámina cribosa del etmoides hasta el bulbo olfatorio. **(reescrita)**
  - [Olfactory nerve](https://en.wikipedia.org/wiki/Olfactory_nerve): “The olfactory nerve is sensory in nature and originates on the olfactory mucosa in…”
  - [Olfactory nerve](https://en.wikipedia.org/wiki/Olfactory_nerve): “The olfactory nerves consist of a collection of many sensory nerve fibers that extend…”
- **Función.** Nervio sensitivo. Función: Olfato.
  - [Olfactory nerve](https://en.wikipedia.org/wiki/Olfactory_nerve): “The olfactory nerve, also known as the first cranial nerve, cranial nerve I, or…”
- **Punto clave.** Un golpe en la cabeza puede lesionarlo, y el daño de este nervio es una de las causas de pérdida del olfato (anosmia). **(reescrita)**
  - [Olfactory nerve](https://en.wikipedia.org/wiki/Olfactory_nerve): “Lesions to the olfactory nerve can occur because of "blunt trauma", such as coup-contrecoup…”
  - [Anosmia](https://en.wikipedia.org/wiki/Anosmia): “brain injury in which there is damage to the olfactory nerve”

### Nervio óptico (II) (`Optic_nerve_II`)

Fuentes: [Optic nerve](https://en.wikipedia.org/wiki/Optic_nerve), [Papilledema](https://en.wikipedia.org/wiki/Papilledema).

- **Descripción.** Lleva la información visual desde la retina hasta el quiasma óptico.
  - [Optic nerve](https://en.wikipedia.org/wiki/Optic_nerve): “it extends from the optic disc to the optic chiasma and continues as the…”
- **Descripción (sigue).** En realidad es una prolongación del encéfalo, envuelta por meninges.
  - [Optic nerve](https://en.wikipedia.org/wiki/Optic_nerve): “but it is technically a myelinated tract of the central nervous system, rather than…”
- **Función.** Visión.
  - [Optic nerve](https://en.wikipedia.org/wiki/Optic_nerve): “is a paired cranial nerve that transmits visual information from the retina to the…”
- **Punto clave.** En el fondo de ojo se ve su origen, la papila óptica, que se hincha si aumenta la presión intracraneal.
  - [Papilledema](https://en.wikipedia.org/wiki/Papilledema): “Papilledema or papilloedema is optic disc swelling that is caused by increased intracranial pressure…”

### Nervio oculomotor (III) (`Oculomotor_nerve_III`)

Fuentes: [Oculomotor nerve palsy](https://en.wikipedia.org/wiki/Oculomotor_nerve_palsy), [Oculomotor nerve](https://en.wikipedia.org/wiki/Oculomotor_nerve).

- **Descripción.** Sale del mesencéfalo e inerva cuatro de los seis músculos que mueven el ojo.
  - [Oculomotor nerve palsy](https://en.wikipedia.org/wiki/Oculomotor_nerve_palsy): “As the name suggests, the oculomotor nerve supplies the majority of the muscles controlling…”
- **Función.** Nervio motor. Función: Mueve el ojo (la mayoría de sus músculos), eleva el párpado y contrae la pupila.
  - [Oculomotor nerve](https://en.wikipedia.org/wiki/Oculomotor_nerve): “innervates extraocular muscles that enable most movements of the eye and that raise the…”
- **Punto clave.** Su lesión deja el ojo mirando hacia abajo y afuera, con el párpado caído y la pupila dilatada.
  - [Oculomotor nerve palsy](https://en.wikipedia.org/wiki/Oculomotor_nerve_palsy): “A complete oculomotor nerve palsy will result in a characteristic displacement outward (exotropia) and…”

### Nervio troclear (IV) (`Trochlear_nerve_IV`)

Fuentes: [Trochlear nerve](https://en.wikipedia.org/wiki/Trochlear_nerve).

- **Descripción.** El par craneal más delgado y el único que sale por la cara posterior del tronco del encéfalo.
  - [Trochlear nerve](https://en.wikipedia.org/wiki/Trochlear_nerve): “It is the only cranial nerve that exits from the dorsal (rear) aspect of…”
- **Función.** Nervio motor. Función: Inerva el músculo oblicuo superior del ojo.
  - [Trochlear nerve](https://en.wikipedia.org/wiki/Trochlear_nerve): “that innervates a single muscle - the superior oblique muscle of the eye”
- **Punto clave.** La visión doble al leer o al bajar escaleras puede ser el primer síntoma de su lesión. **(reescrita)**
  - [Trochlear nerve](https://en.wikipedia.org/wiki/Trochlear_nerve): “Common activities requiring this type of convergent gaze are reading the newspaper and walking…”

### Nervio trigémino (V) (`Trigeminal_nerve_V`)

Fuentes: [Trigeminal nerve](https://en.wikipedia.org/wiki/Trigeminal_nerve), [Trigeminal neuralgia](https://en.wikipedia.org/wiki/Trigeminal_neuralgia).

- **Descripción.** El más complejo de los pares craneales. **(reescrita)**
  - [Trigeminal nerve](https://en.wikipedia.org/wiki/Trigeminal_nerve): “it is the most complex of the cranial nerves”
- **Descripción (sigue).** Se divide en tres ramas: oftálmica, maxilar y mandibular.
  - [Trigeminal nerve](https://en.wikipedia.org/wiki/Trigeminal_nerve): “having three major branches: the ophthalmic nerve (V1), the maxillary nerve (V2), and the…”
- **Función.** Nervio mixto. Función: Sensibilidad de la cara y movimientos de la masticación.
  - [Trigeminal neuralgia](https://en.wikipedia.org/wiki/Trigeminal_neuralgia): “The trigeminal nerve is a mixed cranial nerve responsible for sensory data such as…”
- **Punto clave.** Su neuralgia causa episodios de dolor muy intenso y súbito, como una descarga, en un lado de la cara. **(reescrita)**
  - [Trigeminal neuralgia](https://en.wikipedia.org/wiki/Trigeminal_neuralgia): “The typical form results in episodes of severe, sudden, shock-like pain in one side…”

### Nervio abducens (VI) (`Abducens_nerve_VI`)

Fuentes: [Abducens nerve](https://en.wikipedia.org/wiki/Abducens_nerve), [Sixth nerve palsy](https://en.wikipedia.org/wiki/Sixth_nerve_palsy).

- **Descripción.** Sale entre la protuberancia y el bulbo raquídeo y llega a la órbita.
  - [Abducens nerve](https://en.wikipedia.org/wiki/Abducens_nerve): “The abducens nerve emerges from the brainstem at the junction of the pons and…”
- **Función.** Nervio motor. Función: Inerva el músculo recto lateral, que lleva el ojo hacia fuera.
  - [Abducens nerve](https://en.wikipedia.org/wiki/Abducens_nerve): “The abducens nerve supplies the lateral rectus muscle of the human eye. This muscle…”
- **Punto clave.** Como sale cerca de la base del encéfalo, a menudo es el primer nervio que se comprime cuando sube la presión dentro del cráneo. **(reescrita)**
  - [Sixth nerve palsy](https://en.wikipedia.org/wiki/Sixth_nerve_palsy): “Because the nerve emerges near the bottom of the brain, it is often the…”

### Nervio facial (VII) (`Facial_nerve_VII`)

Fuentes: [Facial nerve](https://en.wikipedia.org/wiki/Facial_nerve), [Bell's palsy](https://en.wikipedia.org/wiki/Bell's_palsy).

- **Descripción.** Sale de la protuberancia, recorre el canal facial del hueso temporal y sale del cráneo por el foramen estilomastoideo. **(reescrita)**
  - [Facial nerve](https://en.wikipedia.org/wiki/Facial_nerve): “The nerve typically travels from the pons through the facial canal in the temporal…”
- **Descripción (sigue).** Después atraviesa la glándula parótida, sin inervarla, y forma el plexo parotídeo. **(reescrita)**
  - [Facial nerve](https://en.wikipedia.org/wiki/Facial_nerve): “The facial nerve then passes through the parotid gland, which it does not innervate,…”
- **Función.** Músculos de la expresión facial, gusto de los dos tercios anteriores de la lengua, y glándulas lagrimales y salivales.
  - [Facial nerve](https://en.wikipedia.org/wiki/Facial_nerve): “controls the muscles of facial expression, and functions in the conveyance of taste sensations…”
  - [Facial nerve](https://en.wikipedia.org/wiki/Facial_nerve): “provides parasympathetic innervation to several glands, including the nasal glands, the palatine glands, and…”
  - [Facial nerve](https://en.wikipedia.org/wiki/Facial_nerve): “The main function of the facial nerve is motor control of all the muscles…”
- **Punto clave.** La parálisis de Bell impide, de forma temporal, mover los músculos de un lado de la cara. **(reescrita)**
  - [Bell's palsy](https://en.wikipedia.org/wiki/Bell's_palsy): “Bell's palsy is a type of facial paralysis that results in a temporary inability…”

### Nervio vestibulococlear (VIII) (`Vestibulocochlear_nerve_VIII`)

Fuentes: [Vestibulocochlear nerve](https://en.wikipedia.org/wiki/Vestibulocochlear_nerve), [Vestibular schwannoma](https://en.wikipedia.org/wiki/Vestibular_schwannoma).

- **Descripción.** Lleva la información del sonido y del equilibrio desde el oído interno hasta el encéfalo. **(reescrita)**
  - [Vestibulocochlear nerve](https://en.wikipedia.org/wiki/Vestibulocochlear_nerve): “that transmits sound and equilibrium (balance) information from the inner ear to the brain.”
- **Función.** Nervio sensitivo. Función: Audición (porción coclear) y equilibrio (porción vestibular).
  - [Vestibulocochlear nerve](https://en.wikipedia.org/wiki/Vestibulocochlear_nerve): “The vestibulocochlear nerve carries axons of type special somatic afferent.”
- **Punto clave.** El schwannoma vestibular (neurinoma del acústico) es un tumor benigno de este nervio; su primer síntoma suele ser una pérdida lenta de la audición de los sonidos agudos en un solo oído. **(reescrita)**
  - [Vestibular schwannoma](https://en.wikipedia.org/wiki/Vestibular_schwannoma): “is a benign tumor that develops on the vestibulocochlear nerve”
  - [Vestibular schwannoma](https://en.wikipedia.org/wiki/Vestibular_schwannoma): “Gradual single-sided hearing loss in the high frequencies is the first most obvious symptom…”

### Nervio glosofaríngeo (IX) (`Glossopharyngeal_nerve_IX`)

Fuentes: [Glossopharyngeal nerve](https://en.wikipedia.org/wiki/Glossopharyngeal_nerve).

- **Descripción.** Sale del tronco del encéfalo por los lados de la parte alta del bulbo raquídeo, justo por delante del vago. **(reescrita)**
  - [Glossopharyngeal nerve](https://en.wikipedia.org/wiki/Glossopharyngeal_nerve): “that exits the brainstem from the sides of the upper medulla, just anterior (closer…”
- **Función.** Nervio mixto. Función: Gusto del tercio posterior de la lengua, sensibilidad de la faringe y deglución.
  - [Glossopharyngeal nerve](https://en.wikipedia.org/wiki/Glossopharyngeal_nerve): “Being a mixed nerve (sensorimotor), it carries afferent sensory and efferent motor information.”
- **Punto clave.** Participa en el reflejo nauseoso.
  - [Glossopharyngeal nerve](https://en.wikipedia.org/wiki/Glossopharyngeal_nerve): “The visceral sensory fibers of CN IX mediate the afferent limb of the pharyngeal…”

### Nervio vago (X) (`Vagus_nerve_X`)

Fuentes: [Vagus nerve](https://en.wikipedia.org/wiki/Vagus_nerve), [Vagal maneuver](https://en.wikipedia.org/wiki/Vagal_maneuver).

- **Descripción.** El nervio más largo del sistema nervioso autónomo: sale del bulbo raquídeo, atraviesa el foramen yugular y baja por el cuello y el tórax hasta el abdomen. **(reescrita)**
  - [Vagus nerve](https://en.wikipedia.org/wiki/Vagus_nerve): “The vagus nerve is the longest nerve of the autonomic nervous system in the…”
  - [Vagus nerve](https://en.wikipedia.org/wiki/Vagus_nerve): “the vagus nerve extends through the jugular foramen, then passes into the carotid sheath…”
- **Función.** Nervio mixto. Función: Inervación parasimpática del corazón, los pulmones y el tubo digestivo; músculos de la laringe y la faringe.
  - [Vagus nerve](https://en.wikipedia.org/wiki/Vagus_nerve): “The vagus nerve supplies motor parasympathetic fibers to all the organs (except the adrenal…”
- **Punto clave.** Su nombre viene del latín vagus, que significa «errante». **(reescrita)**
  - [Vagus nerve](https://en.wikipedia.org/wiki/Vagus_nerve): “The Latin word vagus means literally "wandering"”
- **Punto clave.** Frena el corazón: por eso algunas maniobras vagales detienen ciertas taquicardias.
  - [Vagal maneuver](https://en.wikipedia.org/wiki/Vagal_maneuver): “Vagal maneuvers are the first-line treatment of hemodynamically stable supraventricular tachycardia, serving to slow…”

### Nervio accesorio (XI) (`Accessory_nerve_XI`)

Fuentes: [Accessory nerve](https://en.wikipedia.org/wiki/Accessory_nerve).

- **Descripción.** Nace de la médula cervical alta, sube al cráneo y vuelve a salir por el foramen yugular.
  - [Accessory nerve](https://en.wikipedia.org/wiki/Accessory_nerve): “The fibres of the spinal accessory nerve originate solely in neurons situated in the…”
- **Función.** Nervio motor. Función: Inerva los músculos esternocleidomastoideo y trapecio.
  - [Accessory nerve](https://en.wikipedia.org/wiki/Accessory_nerve): “The spinal component of the accessory nerve provides motor control of the sternocleidomastoid and…”
- **Punto clave.** Su lesión puede causar atrofia de los músculos del hombro, escápula alada y debilidad para separar el brazo y girarlo hacia fuera. **(reescrita)**
  - [Accessory nerve](https://en.wikipedia.org/wiki/Accessory_nerve): “Injury can cause wasting of the shoulder muscles, winging of the scapula, and weakness…”

### Nervio hipogloso (XII) (`Hypoglossal_nerve_XII`)

Fuentes: [Hypoglossal nerve](https://en.wikipedia.org/wiki/Hypoglossal_nerve).

- **Descripción.** Sale del bulbo raquídeo y llega a los músculos de la lengua.
  - [Hypoglossal nerve](https://en.wikipedia.org/wiki/Hypoglossal_nerve): “The hypoglossal nerve arises as a number of small rootlets from the front of…”
- **Función.** Nervio motor. Función: Movimientos de la lengua.
  - [Hypoglossal nerve](https://en.wikipedia.org/wiki/Hypoglossal_nerve): “CN XII is a nerve with a sole motor function”
- **Punto clave.** Si se lesiona, la lengua se desvía hacia el lado lesionado al sacarla.
  - [Hypoglossal nerve](https://en.wikipedia.org/wiki/Hypoglossal_nerve): “Damage to the hypoglossal nucleus will lead to wasting of muscles of the tongue…”

### Bulbo raquídeo (`Medulla_oblongata`)

Fuentes: [Medulla oblongata](https://en.wikipedia.org/wiki/Medulla_oblongata), [Pyramidal tracts](https://en.wikipedia.org/wiki/Pyramidal_tracts).

- **Descripción.** Parte inferior del tronco del encéfalo, que continúa con la médula espinal en el foramen magno.
  - [Medulla oblongata](https://en.wikipedia.org/wiki/Medulla_oblongata): “Medulla-animated as it protrudes from the foramen magnum of the skull-base, after which it…” (en el pie de una imagen)
- **Descripción (sigue).** Contiene los centros que controlan la respiración, el ritmo cardíaco y la presión arterial.
  - [Medulla oblongata](https://en.wikipedia.org/wiki/Medulla_oblongata): “The medulla contains the cardiovascular center, the respiratory center, vomiting and vasomotor centers, responsible…”
- **Punto clave.** En sus pirámides se cruzan la mayoría de las fibras motoras: por eso cada hemisferio controla el lado opuesto del cuerpo.
  - [Pyramidal tracts](https://en.wikipedia.org/wiki/Pyramidal_tracts): “The majority of fibres of the corticospinal tract cross over in the medulla oblongata,…”

### Puente troncoencefálico (`Pons`)

Fuentes: [Pons](https://en.wikipedia.org/wiki/Pons).

- **Descripción.** Porción del tronco del encéfalo entre el mesencéfalo y el bulbo raquídeo.
  - [Pons](https://en.wikipedia.org/wiki/Pons): “It is the part of the brainstem situated between the midbrain and the medulla…”
- **Descripción (sigue).** Su nombre viene del latín pons, «puente». **(reescrita)**
  - [Pons](https://en.wikipedia.org/wiki/Pons): “The pons (from Latin pons, 'bridge') is the part of the brainstem”
- **Punto clave.** Participa en el control de la respiración y del sueño.
  - [Pons](https://en.wikipedia.org/wiki/Pons): “along with nuclei that deal primarily with sleep, respiration, swallowing, bladder control, hearing, equilibrium,…”

### Mesencéfalo (`Midbrain`)

Fuentes: [Midbrain](https://en.wikipedia.org/wiki/Midbrain).

- **Descripción.** Parte superior del tronco del encéfalo.
  - [Midbrain](https://en.wikipedia.org/wiki/Midbrain): “The midbrain or mesencephalon is the uppermost portion of the brainstem connecting the diencephalon…”
- **Descripción (sigue).** Contiene centros de los reflejos visuales y auditivos, y la sustancia negra, que interviene en el movimiento.
  - [Midbrain](https://en.wikipedia.org/wiki/Midbrain): “It is involved in certain reflexes in response to visual or auditory stimuli.”
- **Punto clave.** La pérdida de neuronas de la sustancia negra causa la enfermedad de Parkinson.
  - [Midbrain](https://en.wikipedia.org/wiki/Midbrain): “the loss of dopamine-producing neurons in this region contributes to the progression of Parkinson's…”

### Tálamo (`Thalamus`)

Fuentes: [Thalamus](https://en.wikipedia.org/wiki/Thalamus).

- **Descripción.** Gran masa de sustancia gris cerca del centro del encéfalo. **(reescrita)**
  - [Thalamus](https://en.wikipedia.org/wiki/Thalamus): “is a large mass of gray matter on the lateral wall of the third…”
  - [Thalamus](https://en.wikipedia.org/wiki/Thalamus): “near the center of the brain”
- **Descripción (sigue).** Todos los sentidos salvo el olfato tienen en él un núcleo que recibe sus señales y las envía a la corteza. **(reescrita)**
  - [Thalamus](https://en.wikipedia.org/wiki/Thalamus): “every sensory system (with the exception of the olfactory system) includes a thalamic nucleus…”

### Hipotálamo (`Hypothalamus`)

Fuentes: [Hypothalamus](https://en.wikipedia.org/wiki/Hypothalamus).

- **Descripción.** Pequeña región, del tamaño de una almendra, situada bajo el tálamo. **(reescrita)**
  - [Hypothalamus](https://en.wikipedia.org/wiki/Hypothalamus): “In humans, it is about the size of an almond.”
  - [Hypothalamus](https://en.wikipedia.org/wiki/Hypothalamus): “The hypothalamus is located below the thalamus”
- **Descripción (sigue).** Controla la temperatura del cuerpo, el hambre, la sed, el cansancio y el sueño, y une el sistema nervioso con el sistema hormonal a través de la hipófisis. **(reescrita)**
  - [Hypothalamus](https://en.wikipedia.org/wiki/Hypothalamus): “The hypothalamus controls body temperature, hunger”
  - [Hypothalamus](https://en.wikipedia.org/wiki/Hypothalamus): “One of the most important functions is to link the nervous system to the…”

### Hipocampo (`Hippocampus`)

Fuentes: [Hippocampus](https://en.wikipedia.org/wiki/Hippocampus).

- **Descripción.** Estructura curva del lóbulo temporal que interviene en pasar la información de la memoria a corto plazo a la de largo plazo, y en la memoria espacial que permite orientarse. **(reescrita)**
  - [Hippocampus](https://en.wikipedia.org/wiki/Hippocampus): “have the shape of a curved, rolled-up tube”
  - [Hippocampus](https://en.wikipedia.org/wiki/Hippocampus): “The hippocampus plays important roles in the consolidation of information from short-term memory to…”
- **Función.** Función: Memoria y orientación espacial.
  - [Hippocampus](https://en.wikipedia.org/wiki/Hippocampus): “The hippocampus plays important roles in the consolidation of information from short-term memory to…”
- **Punto clave.** Es de las primeras regiones afectadas en la enfermedad de Alzheimer.
  - [Hippocampus](https://en.wikipedia.org/wiki/Hippocampus): “In Alzheimer's disease (and other forms of dementia), the hippocampus is one of the…”
- **Punto clave.** El anatomista veneciano Julius Caesar Aranzi lo comparó en 1587 primero con un gusano de seda y después con un caballito de mar (en latín, hippocampus). **(reescrita)**
  - [Hippocampus](https://en.wikipedia.org/wiki/Hippocampus): “who likened it first to a silkworm and then to a seahorse (Latin hippocampus”

### Cuerpo amigdaloide (`Amygdaloid_body`)

Fuentes: [Amygdala](https://en.wikipedia.org/wiki/Amygdala).

- **Descripción.** Conjunto par de núcleos situado en la parte medial del lóbulo temporal. **(reescrita)**
  - [Amygdala](https://en.wikipedia.org/wiki/Amygdala): “is a paired nuclear complex present in the cerebral hemispheres of vertebrates”
  - [Amygdala](https://en.wikipedia.org/wiki/Amygdala): “In primates, it is located medially within the temporal lobes.”
- **Descripción (sigue).** Interviene en la memoria, la toma de decisiones y las respuestas emocionales, como el miedo, la ansiedad y la agresividad. **(reescrita)**
  - [Amygdala](https://en.wikipedia.org/wiki/Amygdala): “The amygdala has a primary role in the processing of memory, decision-making, and emotional…”

### Cuerpo calloso (`Corpus_callosum`)

Fuentes: [Corpus callosum](https://en.wikipedia.org/wiki/Corpus_callosum), [Corpus callosotomy](https://en.wikipedia.org/wiki/Corpus_callosotomy).

- **Descripción.** La mayor estructura de sustancia blanca del encéfalo: mide unos 10 cm y tiene de 200 a 300 millones de axones que conectan los dos hemisferios. **(reescrita)**
  - [Corpus callosum](https://en.wikipedia.org/wiki/Corpus_callosum): “It is the largest white matter structure in the human brain, about 10 cm…”
- **Punto clave.** Cortarlo (callosotomía) es una operación paliativa para epilepsias que no responden a los fármacos. **(reescrita)**
  - [Corpus callosotomy](https://en.wikipedia.org/wiki/Corpus_callosotomy): “is a palliative surgical procedure for the treatment of medically refractory epilepsy”

### Núcleo caudado (`Caudate_nucleus`)

Fuentes: [Caudate nucleus](https://en.wikipedia.org/wiki/Caudate_nucleus), [Huntington's disease](https://en.wikipedia.org/wiki/Huntington's_disease).

- **Descripción.** Núcleo de la base con forma de C junto al ventrículo lateral.
  - [Caudate nucleus](https://en.wikipedia.org/wiki/Caudate_nucleus): “Each nucleus is C-shaped”
- **Descripción (sigue).** Participa en el control del movimiento y en el aprendizaje.
  - [Caudate nucleus](https://en.wikipedia.org/wiki/Caudate_nucleus): “Activity associated with successful classification learning (correct categorization) was concentrated to the body and…”
- **Punto clave.** Puede atrofiarse desde las primeras fases de la enfermedad de Huntington. **(reescrita)**
  - [Huntington's disease](https://en.wikipedia.org/wiki/Huntington's_disease): “can show atrophy of the caudate nuclei early in the disease”

### Putamen (`Putamen`)

Fuentes: [Putamen](https://en.wikipedia.org/wiki/Putamen).

- **Descripción.** Núcleo de la base que, con el globo pálido, forma el núcleo lentiforme.
  - [Putamen](https://en.wikipedia.org/wiki/Putamen): “The putamen, together with the globus pallidus, makes up the lentiform nucleus.”
- **Descripción (sigue).** Regula el movimiento.
  - [Putamen](https://en.wikipedia.org/wiki/Putamen): “A primary function of the putamen is to regulate movements at various stages such…”

### Globo pálido (`Globus_pallidus`)

Fuentes: [Globus pallidus](https://en.wikipedia.org/wiki/Globus_pallidus).

- **Descripción.** Núcleo de la base que interviene en la regulación del movimiento voluntario. **(reescrita)**
  - [Globus pallidus](https://en.wikipedia.org/wiki/Globus_pallidus): “The globus pallidus is a structure in the brain involved in the regulation of…”

### Ventrículo lateral (`Lateral_ventricle`)

Fuentes: [Lateral ventricles](https://en.wikipedia.org/wiki/Lateral_ventricles), [Cerebrospinal fluid](https://en.wikipedia.org/wiki/Cerebrospinal_fluid).

- **Descripción.** La mayor de las cavidades del encéfalo, una en cada hemisferio, llena de líquido cefalorraquídeo.
  - [Lateral ventricles](https://en.wikipedia.org/wiki/Lateral_ventricles): “The lateral ventricles are the two largest ventricles of the brain and contain cerebrospinal…”
- **Punto clave.** El líquido cefalorraquídeo se produce sobre todo en los plexos coroideos de los ventrículos: unos 500 ml al día. **(reescrita)**
  - [Cerebrospinal fluid](https://en.wikipedia.org/wiki/Cerebrospinal_fluid): “CSF is mostly produced by the epithelial cells in the choroid plexuses of the…”
  - [Cerebrospinal fluid](https://en.wikipedia.org/wiki/Cerebrospinal_fluid): “The brain produces roughly 500 mL of cerebrospinal fluid per day at a rate…”

### Tercer ventrículo (`Third_ventricle`)

Fuentes: [Third ventricle](https://en.wikipedia.org/wiki/Third_ventricle).

- **Descripción.** Cavidad estrecha en la línea media, entre los dos tálamos, llena de líquido cefalorraquídeo.
  - [Third ventricle](https://en.wikipedia.org/wiki/Third_ventricle): “It is a slit-like cavity formed in the diencephalon between the two thalami, in…”

### Cuarto ventrículo (`Fourth_ventricle`)

Fuentes: [Fourth ventricle](https://en.wikipedia.org/wiki/Fourth_ventricle).

- **Descripción.** Cavidad situada en la protuberancia o en la parte alta del bulbo raquídeo; sus paredes laterales las forman los pedúnculos cerebelosos. **(reescrita)**
  - [Fourth ventricle](https://en.wikipedia.org/wiki/Fourth_ventricle): “It is located within the pons or in the upper part of the medulla…”
  - [Fourth ventricle](https://en.wikipedia.org/wiki/Fourth_ventricle): “side walls formed by the cerebellar peduncles”
- **Descripción (sigue).** Une el sistema ventricular, donde se produce el líquido cefalorraquídeo, con el espacio subaracnoideo, donde se reabsorbe. **(reescrita)**
  - [Fourth ventricle](https://en.wikipedia.org/wiki/Fourth_ventricle): “The fourth ventricle is the connector between the ventricular system (where CSF is produced)…”

### Acueducto del mesencéfalo (`Aqueduct_of_midbrain`)

Fuentes: [Cerebral aqueduct](https://en.wikipedia.org/wiki/Cerebral_aqueduct), [Hydrocephalus](https://en.wikipedia.org/wiki/Hydrocephalus).

- **Descripción.** Conducto estrecho que comunica el tercer y el cuarto ventrículos a través del mesencéfalo.
  - [Cerebral aqueduct](https://en.wikipedia.org/wiki/Cerebral_aqueduct): “is a small, narrow tube connecting the third and fourth ventricles of the brain”
- **Punto clave.** Su estrechamiento es la causa más frecuente de hidrocefalia congénita. **(reescrita)**
  - [Hydrocephalus](https://en.wikipedia.org/wiki/Hydrocephalus): “The most common cause of congenital hydrocephalus is aqueductal stenosis”

### Giro precentral (`Precentral_gyrus`)

Fuentes: [Precentral gyrus](https://en.wikipedia.org/wiki/Precentral_gyrus), [Primary motor cortex](https://en.wikipedia.org/wiki/Primary_motor_cortex), [Cortical homunculus](https://en.wikipedia.org/wiki/Cortical_homunculus).

- **Descripción.** Giro situado delante del surco central: es la corteza motora primaria.
  - [Precentral gyrus](https://en.wikipedia.org/wiki/Precentral_gyrus): “It is the site of the primary motor cortex that in humans is cytoarchitecturally…”
- **Función.** Función: Movimiento voluntario del lado opuesto del cuerpo.
  - [Primary motor cortex](https://en.wikipedia.org/wiki/Primary_motor_cortex): “Each cerebral hemisphere of the primary motor cortex only contains a motor representation of…”
- **Punto clave.** Cada parte del cuerpo tiene aquí su zona, en un mapa llamado homúnculo motor.
  - [Cortical homunculus](https://en.wikipedia.org/wiki/Cortical_homunculus): “A motor homunculus represents a map of brain areas dedicated to motor processing for…”

### Giro poscentral (`Postcentral_gyrus`)

Fuentes: [Postcentral gyrus](https://en.wikipedia.org/wiki/Postcentral_gyrus), [Primary somatosensory cortex](https://en.wikipedia.org/wiki/Primary_somatosensory_cortex).

- **Descripción.** Giro situado detrás del surco central: es la corteza somatosensorial primaria.
  - [Postcentral gyrus](https://en.wikipedia.org/wiki/Postcentral_gyrus): “It is the location of the primary somatosensory cortex, the main sensory receptive area…”
- **Función.** Tacto y sentido de la posición del cuerpo. **(reescrita)**
  - [Postcentral gyrus](https://en.wikipedia.org/wiki/Postcentral_gyrus): “the main sensory receptive area for the sense of touch”
  - [Primary somatosensory cortex](https://en.wikipedia.org/wiki/Primary_somatosensory_cortex): “loss of vibration, proprioception and fine touch”

### Surco central (`Central_sulcus`)

Fuentes: [Central sulcus](https://en.wikipedia.org/wiki/Central_sulcus).

- **Descripción.** Surco que separa el lóbulo frontal del parietal, y la corteza motora primaria de la somatosensorial primaria. **(reescrita)**
  - [Central sulcus](https://en.wikipedia.org/wiki/Central_sulcus): “The central sulcus is a prominent landmark of the brain, separating the parietal lobe…”

### Surco calcarino (`Calcarine_sulcus`)

Fuentes: [Calcarine sulcus](https://en.wikipedia.org/wiki/Calcarine_sulcus).

- **Descripción.** Surco en la cara medial del lóbulo occipital, rodeado por la corteza visual primaria.
  - [Calcarine sulcus](https://en.wikipedia.org/wiki/Calcarine_sulcus): “located at the caudal end of the medial surface of the brain”
- **Función.** Función: Visión.
  - [Calcarine sulcus](https://en.wikipedia.org/wiki/Calcarine_sulcus): “The calcarine sulcus is associated with the visual cortex”

### Porciones triangular y opercular del giro frontal inferior (área de Broca) (`Triangular_part_of_inferior_frontal_gyrus`)

Fuentes: [Broca's area](https://en.wikipedia.org/wiki/Broca's_area), [Expressive aphasia](https://en.wikipedia.org/wiki/Expressive_aphasia).

- **Descripción.** Junto con la porción opercular forma el área de Broca, en el hemisferio dominante (normalmente el izquierdo).
  - [Broca's area](https://en.wikipedia.org/wiki/Broca's_area): “Broca's area is made up of Brodmann areas 44 (pars opercularis) and 45 (pars…” (en el recuadro de datos de la página)
- **Función.** Producción del habla. **(reescrita)**
  - [Broca's area](https://en.wikipedia.org/wiki/Broca's_area): “with functions linked to speech production”
- **Punto clave.** Una lesión limitada a esta zona no basta para causar la afasia de Broca, en la que cuesta mucho producir el lenguaje aunque se suele entender. **(reescrita)**
  - [Broca's area](https://en.wikipedia.org/wiki/Broca's_area): “Lesions to Broca's area alone do not result in Broca's aphasia”
  - [Expressive aphasia](https://en.wikipedia.org/wiki/Expressive_aphasia): “characterized by partial loss of the ability to produce language (spoken, manual, or written),…”

### Giros temporales transversos (`Transverse_temporal_gyri`)

Fuentes: [Transverse temporal gyrus](https://en.wikipedia.org/wiki/Transverse_temporal_gyrus).

- **Descripción.** Giros enterrados en el surco lateral, en la zona de la corteza auditiva primaria. **(reescrita)**
  - [Transverse temporal gyrus](https://en.wikipedia.org/wiki/Transverse_temporal_gyrus): “is a gyrus found in the area of each primary auditory cortex buried within…”
- **Descripción (sigue).** Son las primeras estructuras de la corteza que procesan la información auditiva. **(reescrita)**
  - [Transverse temporal gyrus](https://en.wikipedia.org/wiki/Transverse_temporal_gyrus): “Transverse temporal gyri are the first cortical structures to process incoming auditory information.”
- **Función.** Función: Audición.
  - [Transverse temporal gyrus](https://en.wikipedia.org/wiki/Transverse_temporal_gyrus): “Transverse temporal gyri are the first cortical structures to process incoming auditory information.”

### Giro supramarginal (`Supramarginal_gyrus`)

Fuentes: [Supramarginal gyrus](https://en.wikipedia.org/wiki/Supramarginal_gyrus).

- **Descripción.** Giro del lóbulo parietal inferior, situado justo delante del giro angular. **(reescrita)**
  - [Supramarginal gyrus](https://en.wikipedia.org/wiki/Supramarginal_gyrus): “The supramarginal gyrus is located just anterior to the angular gyrus allowing these two…”
- **Descripción (sigue).** Probablemente interviene en la percepción y el procesamiento del lenguaje, y su lesión puede causar afasia receptiva. **(reescrita)**
  - [Supramarginal gyrus](https://en.wikipedia.org/wiki/Supramarginal_gyrus): “It is probably involved with language perception and processing, and lesions in it may…”
- **Función.** Función: Lenguaje y sensibilidad.
  - [Supramarginal gyrus](https://en.wikipedia.org/wiki/Supramarginal_gyrus): “The supramarginal gyrus is part of the somatosensory association cortex, which interprets tactile sensory…”

### Giro angular (`Angular_gyrus`)

Fuentes: [Angular gyrus](https://en.wikipedia.org/wiki/Angular_gyrus).

- **Descripción.** Giro del lóbulo parietal inferior que lleva la información visual al área de Wernicke para dar sentido a las palabras que se leen. **(reescrita)**
  - [Angular gyrus](https://en.wikipedia.org/wiki/Angular_gyrus): “Its significance is in transferring visual information to Wernicke's area, in order to make…”
- **Función.** Función: Lectura y escritura.
  - [Angular gyrus](https://en.wikipedia.org/wiki/Angular_gyrus): “The angular gyrus is the part of the brain associated with complex language functions…”

### Quiasma óptico (`Optic_chiasm`)

Fuentes: [Optic chiasm](https://en.wikipedia.org/wiki/Optic_chiasm), [Bitemporal hemianopsia](https://en.wikipedia.org/wiki/Bitemporal_hemianopsia).

- **Descripción.** Punto donde se cruzan parcialmente los nervios ópticos: las fibras de la mitad nasal de cada retina pasan al lado opuesto.
  - [Optic chiasm](https://en.wikipedia.org/wiki/Optic_chiasm): “In the case of such partial decussation, the optic nerve fibres on the medial…”
- **Punto clave.** Un tumor de hipófisis que lo comprime causa la pérdida de la visión lateral de ambos ojos.
  - [Bitemporal hemianopsia](https://en.wikipedia.org/wiki/Bitemporal_hemianopsia): “Bitemporal hemianopsia most commonly occurs as a result of tumors located at the mid-optic…”

### Núcleo rojo (`Red_nucleus`)

Fuentes: [Red nucleus](https://en.wikipedia.org/wiki/Red_nucleus).

- **Descripción.** Núcleo de la parte alta del mesencéfalo que interviene en la coordinación de los movimientos. **(reescrita)**
  - [Red nucleus](https://en.wikipedia.org/wiki/Red_nucleus): “is a structure in the rostral midbrain involved in motor coordination”
- **Descripción (sigue).** Es de color rosa pálido, probablemente por el hierro que contiene. **(reescrita)**
  - [Red nucleus](https://en.wikipedia.org/wiki/Red_nucleus): “The red nucleus is pale pink, which is believed to be due to the…”

### Colículo superior (`Superior_colliculus`)

Fuentes: [Superior colliculus](https://en.wikipedia.org/wiki/Superior_colliculus).

- **Descripción.** Relieve del techo del mesencéfalo que dirige los movimientos de los ojos y los giros de la cabeza hacia un punto del espacio. **(reescrita)**
  - [Superior colliculus](https://en.wikipedia.org/wiki/Superior_colliculus): “is a structure lying on the roof of the mammalian midbrain”
  - [Superior colliculus](https://en.wikipedia.org/wiki/Superior_colliculus): “its role in directing eye movements”
  - [Superior colliculus](https://en.wikipedia.org/wiki/Superior_colliculus): “generating spatially directed head turns”

### Colículo inferior (`Inferior_colliculus`)

Fuentes: [Inferior colliculus](https://en.wikipedia.org/wiki/Inferior_colliculus).

- **Descripción.** Principal núcleo de la vía auditiva en el mesencéfalo; forma parte de su techo (tectum). **(reescrita)**
  - [Inferior colliculus](https://en.wikipedia.org/wiki/Inferior_colliculus): “The inferior colliculus (IC) (Latin for lower hill) is the principal midbrain nucleus of…”
  - [Inferior colliculus](https://en.wikipedia.org/wiki/Inferior_colliculus): “and also part of the midbrain tectum”

### Tracto corticoespinal lateral (`Lateral_corticospinal_tract`)

Fuentes: [Lateral corticospinal tract](https://en.wikipedia.org/wiki/Lateral_corticospinal_tract), [Corticospinal tract](https://en.wikipedia.org/wiki/Corticospinal_tract).

- **Descripción.** La mayor parte del tracto corticoespinal: vía motora que baja desde la corteza cerebral. **(reescrita)**
  - [Lateral corticospinal tract](https://en.wikipedia.org/wiki/Lateral_corticospinal_tract): “is the largest part of the corticospinal tract”
  - [Lateral corticospinal tract](https://en.wikipedia.org/wiki/Lateral_corticospinal_tract): “The lateral corticospinal tract is a descending motor pathway that begins in the cerebral…”
- **Punto clave.** La mayoría de sus fibras se cruzan en el bulbo raquídeo.
  - [Corticospinal tract](https://en.wikipedia.org/wiki/Corticospinal_tract): “the vast majority cross over in the medulla, while the rest (about 2-3%) remain…”

### Dura espinal (`Spinal_dura`)

Fuentes: [Dura mater](https://en.wikipedia.org/wiki/Dura_mater), [Epidural administration](https://en.wikipedia.org/wiki/Epidural_administration).

- **Descripción.** Duramadre que envuelve la médula espinal (saco dural). A diferencia de la del cráneo, tiene una sola capa. **(reescrita)**
  - [Dura mater](https://en.wikipedia.org/wiki/Dura_mater): “The dura mater covering the spinal cord is known as the dural sac or…”
- **Punto clave.** Por fuera de ella, en el espacio epidural, se pone la anestesia epidural.
  - [Epidural administration](https://en.wikipedia.org/wiki/Epidural_administration): “An epidural is injected into the epidural space, inside the bony spinal canal but…”

### Hoz del cerebro (`Falx_cerebri`)

Fuentes: [Falx cerebri](https://en.wikipedia.org/wiki/Falx_cerebri).

- **Descripción.** Pliegue de duramadre en forma de hoz que se introduce entre los dos hemisferios cerebrales.
  - [Falx cerebri](https://en.wikipedia.org/wiki/Falx_cerebri): “is a large, crescent-shaped fold of dura mater that descends vertically into the longitudinal…”

### Tienda del cerebello (`Tentorium_cerebelli`)

Fuentes: [Dura mater](https://en.wikipedia.org/wiki/Dura_mater).

- **Descripción.** Pliegue de duramadre que forma una tienda sobre el cerebelo y lo separa de los lóbulos occipitales.
  - [Dura mater](https://en.wikipedia.org/wiki/Dura_mater): “The tentorium cerebelli exists between and separates the cerebellum and brainstem from the occipital…”

### Cauda equina (`Cauda_equina`)

Fuentes: [Cauda equina](https://en.wikipedia.org/wiki/Cauda_equina).

- **Descripción.** Haz de raíces nerviosas lumbares y sacras que desciende por el conducto vertebral por debajo del final de la médula (L1–L2).
  - [Cauda equina](https://en.wikipedia.org/wiki/Cauda_equina): “is a bundle of spinal nerves and spinal nerve rootlets, consisting of the second…”
- **Descripción (sigue).** Su nombre significa «cola de caballo».
  - [Cauda equina](https://en.wikipedia.org/wiki/Cauda_equina): “The cauda equina (from Latin tail of horse) is a bundle of spinal nerves”
- **Punto clave.** Como la médula termina hacia L1–L2, la punción lumbar se hace entre L3 y L4 o entre L4 y L5, donde no hay riesgo de dañarla. **(reescrita)**
  - [Cauda equina](https://en.wikipedia.org/wiki/Cauda_equina): “Because the spinal cord terminates at level L1/L2, lumbar puncture (or colloquially, "spinal tap")…”

### Nervio ciático (`Sciatic_nerve`)

Fuentes: [Sciatic nerve](https://en.wikipedia.org/wiki/Sciatic_nerve).

- **Descripción.** El nervio más largo y ancho del cuerpo. **(reescrita)**
  - [Sciatic nerve](https://en.wikipedia.org/wiki/Sciatic_nerve): “It is the longest and widest single nerve in the human body”
- **Descripción (sigue).** Sale de la pelvis por debajo del piriforme, baja por la parte posterior del muslo y se divide en el tibial y el fibular común.
  - [Sciatic nerve](https://en.wikipedia.org/wiki/Sciatic_nerve): “The nerve passes beneath the piriformis and through the greater sciatic foramen, exiting the…”
- **Punto clave.** La ciática es el dolor por compresión o irritación de este nervio desde la zona lumbar. **(reescrita)**
  - [Sciatic nerve](https://en.wikipedia.org/wiki/Sciatic_nerve): “Pain caused by compression or irritation of the sciatic nerve by a problem in…”

### Nervio mediano (`Median_nerve`)

Fuentes: [Median nerve](https://en.wikipedia.org/wiki/Median_nerve), [Carpal tunnel syndrome](https://en.wikipedia.org/wiki/Carpal_tunnel_syndrome).

- **Descripción.** Nervio del brazo y del antebrazo que llega a la mano por el túnel carpiano.
  - [Median nerve](https://en.wikipedia.org/wiki/Median_nerve): “The median nerve enters the hand through the carpal tunnel, deep to the flexor…”
- **Descripción (sigue).** Inerva los flexores del antebrazo y los músculos del pulgar.
  - [Median nerve](https://en.wikipedia.org/wiki/Median_nerve): “It innervates all of the flexors in the forearm, except flexor carpi ulnaris and…”
- **Punto clave.** Su compresión en la muñeca es el síndrome del túnel carpiano.
  - [Carpal tunnel syndrome](https://en.wikipedia.org/wiki/Carpal_tunnel_syndrome): “Carpal tunnel syndrome (CTS) is the symptoms and signs characteristic of compressive median neuropathy…”

### Nervio ulnar (`Ulnar_nerve`)

Fuentes: [Ulnar nerve](https://en.wikipedia.org/wiki/Ulnar_nerve), [Median nerve](https://en.wikipedia.org/wiki/Median_nerve).

- **Descripción.** Nervio que pasa por detrás del epicóndilo medial del húmero, donde puede palparse. **(reescrita)**
  - [Ulnar nerve](https://en.wikipedia.org/wiki/Ulnar_nerve): “passing behind the medial epicondyle (in the cubital tunnel) at the elbow, where it…”
- **Descripción (sigue).** En la mano inerva los músculos propios que no inerva el nervio mediano. **(reescrita)**
  - [Median nerve](https://en.wikipedia.org/wiki/Median_nerve): “The rest of the intrinsic muscles of the hand are supplied by the ulnar…”
- **Punto clave.** Golpearlo en el codo produce el calambre del «hueso de la risa».
  - [Ulnar nerve](https://en.wikipedia.org/wiki/Ulnar_nerve): “This nerve can cause an electric shock-like sensation by striking the medial epicondyle of…”

### Nervio radial (`Radial_nerve`)

Fuentes: [Radial nerve](https://en.wikipedia.org/wiki/Radial_nerve).

- **Descripción.** Nervio que inerva las cabezas medial y lateral del tríceps braquial y los 12 músculos del compartimento posterior del antebrazo, en su mayoría extensores. **(reescrita)**
  - [Radial nerve](https://en.wikipedia.org/wiki/Radial_nerve): “It innervates the medial and lateral heads of the triceps brachii muscle of the…”
  - [Radial nerve](https://en.wikipedia.org/wiki/Radial_nerve): “which are mostly extensors”
- **Punto clave.** Su lesión en el brazo produce la «mano caída».
  - [Radial nerve](https://en.wikipedia.org/wiki/Radial_nerve): “Presence of wrist drop, due to inability to extend the hand and fingers.”

### Nervio axilar (`Axillary_nerve`)

Fuentes: [Axillary nerve](https://en.wikipedia.org/wiki/Axillary_nerve).

- **Descripción.** Nervio que rodea el cuello quirúrgico del húmero e inerva el deltoides y el redondo menor.
  - [Axillary nerve](https://en.wikipedia.org/wiki/Axillary_nerve): “The posterior cord of the brachial plexus splits inferiorly to the glenohumeral joint giving…”
- **Punto clave.** Puede lesionarse en luxaciones de hombro y fracturas del cuello del húmero.
  - [Axillary nerve](https://en.wikipedia.org/wiki/Axillary_nerve): “The axillary nerve may be injured in anterior-inferior dislocations of the shoulder joint, compression…”

### Nervio musculocutáneo (`Musculocutaneous_nerve`)

Fuentes: [Musculocutaneous nerve](https://en.wikipedia.org/wiki/Musculocutaneous_nerve).

- **Descripción.** Nervio que inerva los músculos del compartimento anterior del brazo: coracobraquial, bíceps braquial y braquial. **(reescrita)**
  - [Musculocutaneous nerve](https://en.wikipedia.org/wiki/Musculocutaneous_nerve): “It provides motor innervation to the muscles of the anterior compartment of the arm:…”

### Nervio femoral (`Femoral_nerve`)

Fuentes: [Femoral nerve](https://en.wikipedia.org/wiki/Femoral_nerve).

- **Descripción.** Nervio del muslo que inerva los músculos que extienden la rodilla y la piel de la parte alta del muslo y de la cara interna de la pierna. **(reescrita)**
  - [Femoral nerve](https://en.wikipedia.org/wiki/Femoral_nerve): “The femoral nerve is a nerve in the thigh that supplies skin on the…”
- **Descripción (sigue).** Entra en el triángulo femoral pasando por debajo del ligamento inguinal. **(reescrita)**
  - [Femoral nerve](https://en.wikipedia.org/wiki/Femoral_nerve): “The nerve enters the femoral triangle by passing beneath the inguinal ligament”

### Nervio fibular común (`Common_fibular_nerve`)

Fuentes: [Common fibular nerve](https://en.wikipedia.org/wiki/Common_fibular_nerve).

- **Descripción.** Rama terminal menor del nervio ciático. **(reescrita)**
  - [Common fibular nerve](https://en.wikipedia.org/wiki/Common_fibular_nerve): “The common fibular nerve is the smaller terminal branch of the sciatic nerve.”
- **Descripción (sigue).** Rodea el cuello de la fíbula y se divide en los nervios fibulares superficial y profundo. **(reescrita)**
  - [Common fibular nerve](https://en.wikipedia.org/wiki/Common_fibular_nerve): “It then winds around the neck of the fibula to pierce the fibularis longus…”
- **Punto clave.** Su lesión produce «pie caído»; la causa más frecuente es cruzar las piernas por costumbre, que lo comprime donde rodea el cuello de la fíbula. **(reescrita)**
  - [Common fibular nerve](https://en.wikipedia.org/wiki/Common_fibular_nerve): “When the common fibular nerve is damaged or compressed, foot drop can ensue.”
  - [Common fibular nerve](https://en.wikipedia.org/wiki/Common_fibular_nerve): “The most common cause is habitual leg crossing that compresses the common fibular nerve…”

### Nervio tibial (`Tibial_nerve`)

Fuentes: [Tibial nerve](https://en.wikipedia.org/wiki/Tibial_nerve).

- **Descripción.** Rama del ciático que baja por la parte posterior de la pierna e inerva los flexores del pie y la planta.
  - [Tibial nerve](https://en.wikipedia.org/wiki/Tibial_nerve): “The tibial nerve is a branch of the sciatic nerve.”

### Nervio torácico largo (`Long_thoracic_nerve`)

Fuentes: [Long thoracic nerve](https://en.wikipedia.org/wiki/Long_thoracic_nerve).

- **Descripción.** Nervio que desciende por la pared lateral del tórax e inerva el serrato anterior.
  - [Long thoracic nerve](https://en.wikipedia.org/wiki/Long_thoracic_nerve): “It extends along the side of the thorax to the lower border of the…”
- **Punto clave.** Su lesión produce la «escápula alada».
  - [Long thoracic nerve](https://en.wikipedia.org/wiki/Long_thoracic_nerve): “Some injuries, particularly lesions, can paralyse the serratus anterior muscle to produce a winged…”

### Nervios intercostales (`Intercostal_nerves`)

Fuentes: [Intercostal nerves](https://en.wikipedia.org/wiki/Intercostal_nerves).

- **Descripción.** Nervios del sistema nervioso somático que nacen de los ramos anteriores de los nervios torácicos T1 a T11 y recorren los espacios intercostales. **(reescrita)**
  - [Intercostal nerves](https://en.wikipedia.org/wiki/Intercostal_nerves): “The intercostal nerves are part of the somatic nervous system, and arise from the…”
  - [Intercostal nerves](https://en.wikipedia.org/wiki/Intercostal_nerves): “They pass forward in the intercostal spaces below the intercostal vessels.”

### Tronco simpático (`Sympathetic_trunk`)

Fuentes: [Sympathetic trunk](https://en.wikipedia.org/wiki/Sympathetic_trunk), [Sympathetic nervous system](https://en.wikipedia.org/wiki/Sympathetic_nervous_system).

- **Descripción.** Par de cordones de fibras nerviosas que van desde la base del cráneo hasta el cóccix, con ganglios a lo largo de su recorrido. **(reescrita)**
  - [Sympathetic trunk](https://en.wikipedia.org/wiki/Sympathetic_trunk): “The sympathetic trunk (sympathetic chain, gangliated cord) is a paired bundle of nerve fibers…”
  - [Sympathetic trunk](https://en.wikipedia.org/wiki/Sympathetic_trunk): “Along the length of the sympathetic trunk are sympathetic ganglia known as paravertebral ganglia.”
- **Descripción (sigue).** Es una parte fundamental del sistema nervioso simpático, que pone en marcha la respuesta de «lucha o huida». **(reescrita)**
  - [Sympathetic trunk](https://en.wikipedia.org/wiki/Sympathetic_trunk): “The sympathetic trunk is a fundamental part of the sympathetic nervous system, and part…”
  - [Sympathetic nervous system](https://en.wikipedia.org/wiki/Sympathetic_nervous_system): “The sympathetic nervous system's primary process is to stimulate the body's fight-or-flight response.”

### Raíces del plexo braquial (`Roots_of_brachial_plexus`)

Fuentes: [Brachial plexus](https://en.wikipedia.org/wiki/Brachial_plexus).

- **Descripción.** Raíces del plexo braquial: los ramos anteriores de los nervios C5, C6, C7, C8 y T1. **(reescrita)**
  - [Brachial plexus](https://en.wikipedia.org/wiki/Brachial_plexus): “The brachial plexus is a network of nerves (nerve plexus) formed by the anterior…”
- **Descripción (sigue).** El plexo lleva fibras nerviosas al tórax, el hombro, el brazo, el antebrazo y la mano. **(reescrita)**
  - [Brachial plexus](https://en.wikipedia.org/wiki/Brachial_plexus): “It supplies afferent and efferent nerve fibers to the chest, shoulder, arm, forearm, and…”

### Nervio pudendo (`Pudendal_nerve`)

Fuentes: [Pudendal nerve](https://en.wikipedia.org/wiki/Pudendal_nerve).

- **Descripción.** Nervio principal del periné: inerva los esfínteres y da sensibilidad a los genitales.
  - [Pudendal nerve](https://en.wikipedia.org/wiki/Pudendal_nerve): “The pudendal nerve is the main nerve of the perineum.”

### Nervio safeno (`Saphenous_nerve`)

Fuentes: [Saphenous nerve](https://en.wikipedia.org/wiki/Saphenous_nerve).

- **Descripción.** Rama sensitiva del nervio femoral que acompaña a la vena safena mayor por la cara medial de la pierna. **(reescrita)**
  - [Saphenous nerve](https://en.wikipedia.org/wiki/Saphenous_nerve): “is the largest cutaneous branch of the femoral nerve”
  - [Saphenous nerve](https://en.wikipedia.org/wiki/Saphenous_nerve): “The nerve then passes along the tibial side of the leg, accompanied by the…”

### Nervio sural (`Sural_nerve`)

Fuentes: [Sural nerve](https://en.wikipedia.org/wiki/Sural_nerve).

- **Descripción.** Nervio cutáneo de la cara posterolateral de la pierna, que llega hasta el lado externo del tobillo. **(reescrita)**
  - [Sural nerve](https://en.wikipedia.org/wiki/Sural_nerve): “The sural nerve (L4-S1) is generally considered a pure cutaneous nerve of the posterolateral…”
- **Punto clave.** Es el nervio donante que más se usa para injertos de nervio. **(reescrita)**
  - [Sural nerve](https://en.wikipedia.org/wiki/Sural_nerve): “the sural nerve is the most frequently accessed donor nerve site for peripheral nerve…”

### Córnea (`Cornea`)

Fuentes: [Cornea](https://en.wikipedia.org/wiki/Cornea).

- **Descripción.** Capa transparente y abombada en la parte frontal del ojo.
  - [Cornea](https://en.wikipedia.org/wiki/Cornea): “The cornea is the transparent front part of the eyeball which covers the iris,…”
- **Descripción (sigue).** Aporta unas dos terceras partes del poder de enfoque del ojo.
  - [Cornea](https://en.wikipedia.org/wiki/Cornea): “Along with the anterior chamber and lens, the cornea refracts light, accounting for approximately…”
- **Punto clave.** No tiene vasos sanguíneos: se nutre de las lágrimas y del humor acuoso.
  - [Cornea](https://en.wikipedia.org/wiki/Cornea): “Because transparency is of prime importance, the healthy cornea does not have or need…”
- **Punto clave.** Es uno de los tejidos más sensibles del cuerpo: tiene una densa red de fibras nerviosas. **(reescrita)**
  - [Cornea](https://en.wikipedia.org/wiki/Cornea): “The cornea is one of the most sensitive tissues of the body, as it…”

### Lente (`Lens`)

Fuentes: [Lens (vertebrate anatomy)](https://en.wikipedia.org/wiki/Lens_%28vertebrate_anatomy%29), [Cataract](https://en.wikipedia.org/wiki/Cataract), [Presbyopia](https://en.wikipedia.org/wiki/Presbyopia).

- **Descripción.** Lente biconvexa y transparente detrás del iris que cambia de forma para enfocar de cerca o de lejos.
  - [Lens (vertebrate anatomy)](https://en.wikipedia.org/wiki/Lens_%28vertebrate_anatomy%29): “The lens, or crystalline lens, is a transparent biconvex structure in most land vertebrate…”
- **Punto clave.** Su opacificación es la catarata.
  - [Cataract](https://en.wikipedia.org/wiki/Cataract): “A cataract is a cloudy area in the lens of the eye that impairs…”
- **Punto clave.** Con la edad pierde elasticidad y se endurece: es la causa de la presbicia (vista cansada). **(reescrita)**
  - [Presbyopia](https://en.wikipedia.org/wiki/Presbyopia): “It occurs due to age-related changes in the lens (decreased elasticity and increased hardness)”

### Retina (`Retina`)

Fuentes: [Retina](https://en.wikipedia.org/wiki/Retina), [Retinal detachment](https://en.wikipedia.org/wiki/Retinal_detachment).

- **Descripción.** Capa interna del ojo con las células sensibles a la luz (conos y bastones), que transforma la imagen en señales nerviosas.
  - [Retina](https://en.wikipedia.org/wiki/Retina): “The retina (from Latin rete 'net'; pl. retinae or retinas) is the innermost, light-sensitive…”
- **Punto clave.** Su desprendimiento es una urgencia que puede causar ceguera.
  - [Retinal detachment](https://en.wikipedia.org/wiki/Retinal_detachment): “It may start in a small area, but without quick treatment, it can spread…”

### Iris (`Iris`)

Fuentes: [Iris (anatomy)](https://en.wikipedia.org/wiki/Iris_%28anatomy%29).

- **Descripción.** Disco de color con un orificio central, la pupila, cuyo tamaño regula la cantidad de luz que entra al ojo.
  - [Iris (anatomy)](https://en.wikipedia.org/wiki/Iris_%28anatomy%29): “The iris (pl.: irides or irises) is a thin, ring-shaped structure in the eye…”

### Esclera (`Sclera`)

Fuentes: [Sclera](https://en.wikipedia.org/wiki/Sclera).

- **Descripción.** Capa externa del ojo, blanca y resistente: el «blanco del ojo».
  - [Sclera](https://en.wikipedia.org/wiki/Sclera): “The sclera, also known as the white of the eye or, in older literature,…”
- **Punto clave.** Se vuelve amarilla en la ictericia.
  - [Sclera](https://en.wikipedia.org/wiki/Sclera): “Yellowing or a light green color of the sclera is a visual symptom of…”

### Cuerpo vitreo (`Vitreous_body`)

Fuentes: [Vitreous body](https://en.wikipedia.org/wiki/Vitreous_body), [Floater](https://en.wikipedia.org/wiki/Floater).

- **Descripción.** Gel transparente que rellena la parte posterior del ojo y mantiene su forma.
  - [Vitreous body](https://en.wikipedia.org/wiki/Vitreous_body): “The vitreous humor is a transparent, colorless, gelatinous mass that fills the space in…”
- **Punto clave.** Los pequeños grumos que se forman en él son las «moscas volantes».
  - [Floater](https://en.wikipedia.org/wiki/Floater): “They are also called muscae volitantes (Latin for 'flying flies'), or mouches volantes (from…”

### Cóclea (`Cochlea`)

Fuentes: [Cochlea](https://en.wikipedia.org/wiki/Cochlea), [Cochlear implant](https://en.wikipedia.org/wiki/Cochlear_implant).

- **Descripción.** Conducto en espiral del oído interno, con forma de caracol, que transforma las vibraciones del sonido en señales nerviosas.
  - [Cochlea](https://en.wikipedia.org/wiki/Cochlea): “The cochlea receives sound in the form of vibrations, which cause the stereocilia to…”
- **Punto clave.** Los implantes cocleares estimulan directamente su nervio.
  - [Cochlear implant](https://en.wikipedia.org/wiki/Cochlear_implant): “A CI bypasses acoustic hearing by direct electrical stimulation of the auditory nerve.”

### Membrana timpánica (`Tympanic_membrane`)

Fuentes: [Eardrum](https://en.wikipedia.org/wiki/Eardrum), [Perforated eardrum](https://en.wikipedia.org/wiki/Perforated_eardrum).

- **Descripción.** Membrana fina en forma de cono que separa el oído externo del oído medio y transmite a los huesecillos los cambios de presión del sonido. **(reescrita)**
  - [Eardrum](https://en.wikipedia.org/wiki/Eardrum): “In the anatomy of humans and various other tetrapods, the eardrum, also called the…”
  - [Eardrum](https://en.wikipedia.org/wiki/Eardrum): “Its function is to transmit changes in pressure of sound from the air to…”
- **Punto clave.** Puede perforarse por una infección (otitis media), un golpe, un ruido muy fuerte o cambios de presión en el oído medio. **(reescrita)**
  - [Perforated eardrum](https://en.wikipedia.org/wiki/Perforated_eardrum): “It can be caused by infection (otitis media), trauma, overpressure (loud noise), inappropriate ear…”

### Tubo auditivo (`Auditory_tube`)

Fuentes: [Eustachian tube](https://en.wikipedia.org/wiki/Eustachian_tube).

- **Descripción.** Conducto que comunica el oído medio con la nasofaringe y permite que la presión del oído medio se iguale con la del exterior. **(reescrita)**
  - [Eustachian tube](https://en.wikipedia.org/wiki/Eustachian_tube): “also called the auditory tube or pharyngotympanic tube, is a tube that links the…”
  - [Eustachian tube](https://en.wikipedia.org/wiki/Eustachian_tube): “allowing the middle ear's pressure to adjust to the atmospheric pressure”
- **Punto clave.** Tragar o bostezar la abre: por eso se «destapan» los oídos en los aviones.
  - [Eustachian tube](https://en.wikipedia.org/wiki/Eustachian_tube): “Various methods of ear clearing such as yawning, swallowing, or chewing gum may be…”

### Glándula lagrimal (`Lacrimal_gland`)

Fuentes: [Lacrimal gland](https://en.wikipedia.org/wiki/Lacrimal_gland).

- **Descripción.** Glándula situada en la parte superior y externa de la órbita que produce las lágrimas.
  - [Lacrimal gland](https://en.wikipedia.org/wiki/Lacrimal_gland): “In humans, they are situated in the upper lateral region of each orbit, in…”

### Vestíbulo (`Vestibule`)

Fuentes: [Vestibule of the ear](https://en.wikipedia.org/wiki/Vestibule_of_the_ear), [Vestibular system](https://en.wikipedia.org/wiki/Vestibular_system).

- **Descripción.** Parte central del laberinto óseo del oído interno: está detrás de la cóclea y delante de los tres conductos semicirculares. **(reescrita)**
  - [Vestibule of the ear](https://en.wikipedia.org/wiki/Vestibule_of_the_ear): “The vestibule is the central part of the bony labyrinth in the inner ear,…”
- **Descripción (sigue).** Forma parte del sistema vestibular, que da el sentido del equilibrio. **(reescrita)**
  - [Vestibular system](https://en.wikipedia.org/wiki/Vestibular_system): “is a sensory system that creates the sense of balance and spatial orientation”

## Sistema nervioso: fichas nuevas

Todas sus frases son **nuevas** (8 nov 2026).

### Tracto óptico (`Optic_tract`)

Fuentes: [Optic tract](https://en.wikipedia.org/wiki/Optic_tract).

- **Descripción.** Continuación del nervio óptico más allá del quiasma: lleva la información visual al núcleo geniculado lateral, a los núcleos pretectales y al colículo superior de su lado.
  - [Optic tract](https://en.wikipedia.org/wiki/Optic_tract): “It is a continuation of the optic nerve that relays information from the optic…”
- **Descripción (sigue).** Cada tracto lleva la información de la mitad opuesta del campo visual, con fibras de los dos ojos: las de la mitad temporal de la retina del mismo lado y las de la mitad nasal de la retina del otro.
  - [Optic tract](https://en.wikipedia.org/wiki/Optic_tract): “each of which conveys visual information exclusive to its respective contralateral half of the…”
  - [Optic tract](https://en.wikipedia.org/wiki/Optic_tract): “the optic tract contains fibers from the ipsilateral temporal hemiretina and contralateral nasal hemiretina”

### Nervio oftálmico (`Ophthalmic_nerve`)

Fuentes: [Ophthalmic nerve](https://en.wikipedia.org/wiki/Ophthalmic_nerve).

- **Descripción.** Nervio sensitivo de la cabeza: una de las tres divisiones del nervio trigémino (V1).
  - [Ophthalmic nerve](https://en.wikipedia.org/wiki/Ophthalmic_nerve): “The ophthalmic nerve (CN V1) is a sensory nerve of the head.”
  - [Ophthalmic nerve](https://en.wikipedia.org/wiki/Ophthalmic_nerve): “It is one of three divisions of the trigeminal nerve (CN V), the fifth…”
- **Descripción (sigue).** Sus tres ramas principales dan sensibilidad al ojo, a la piel de la parte alta de la cara y a la parte anterior del cuero cabelludo, entre otras estructuras.
  - [Ophthalmic nerve](https://en.wikipedia.org/wiki/Ophthalmic_nerve): “It has three major branches which provide sensory innervation to the eye, and the…”
- **Punto clave.** Si se lesiona, puede perderse el reflejo corneal, y la córnea queda más expuesta a dañarse.
  - [Ophthalmic nerve](https://en.wikipedia.org/wiki/Ophthalmic_nerve): “The corneal reflex may be lost, which can increase the risk of damage to…”

### Nervio maxilar (`Maxillary_nerve`)

Fuentes: [Maxillary nerve](https://en.wikipedia.org/wiki/Maxillary_nerve).

- **Descripción.** Una de las tres divisiones del nervio trigémino (V2), intermedia en posición y en tamaño entre el nervio oftálmico y el mandibular.
  - [Maxillary nerve](https://en.wikipedia.org/wiki/Maxillary_nerve): “is one of the three branches or divisions of the trigeminal nerve”
  - [Maxillary nerve](https://en.wikipedia.org/wiki/Maxillary_nerve): “is intermediate, both in position and size, between the ophthalmic nerve and the mandibular…”
- **Descripción (sigue).** Da la sensibilidad del maxilar, la cavidad nasal, los senos paranasales, el paladar y la parte media de la cara.
  - [Maxillary nerve](https://en.wikipedia.org/wiki/Maxillary_nerve): “It comprises the principal functions of sensation from the maxilla, nasal cavity, sinuses, the…”

### Nervio lingual (`Lingual_nerve`)

Fuentes: [Lingual nerve](https://en.wikipedia.org/wiki/Lingual_nerve).

- **Descripción.** Nervio que lleva la sensibilidad de los dos tercios anteriores de la lengua.
  - [Lingual nerve](https://en.wikipedia.org/wiki/Lingual_nerve): “The lingual nerve carries sensory innervation from the anterior two-thirds of the tongue.”
- **Descripción (sigue).** Tiene fibras de la división mandibular del trigémino, para el tacto, el dolor y la temperatura, y del nervio facial, para el gusto.
  - [Lingual nerve](https://en.wikipedia.org/wiki/Lingual_nerve): “It contains fibres from both the mandibular division of the trigeminal nerve (CN V3)…”
  - [Lingual nerve](https://en.wikipedia.org/wiki/Lingual_nerve): “The fibres from the trigeminal nerve are for touch, pain and temperature (general sensation),…”

### Nervio alveolar inferior (`Inferior_alveolar_nerve`)

Fuentes: [Inferior alveolar nerve](https://en.wikipedia.org/wiki/Inferior_alveolar_nerve).

- **Descripción.** Rama sensitiva del nervio mandibular (V3), la tercera rama del trigémino.
  - [Inferior alveolar nerve](https://en.wikipedia.org/wiki/Inferior_alveolar_nerve): “is a sensory branch of the mandibular nerve (CN V3) (which is itself the…”
- **Descripción (sigue).** Da sensibilidad a los dientes inferiores y a su encía y, a través del nervio mentoniano, a una pequeña zona de la cara.
  - [Inferior alveolar nerve](https://en.wikipedia.org/wiki/Inferior_alveolar_nerve): “The nerve provides sensory innervation to the lower/mandibular teeth and their corresponding gingiva as…”
- **Punto clave.** Puede lesionarse en cirugías como la extracción de una muela del juicio, la colocación de implantes en la mandíbula o las endodoncias, o con inyecciones profundas de anestesia dental.
  - [Inferior alveolar nerve](https://en.wikipedia.org/wiki/Inferior_alveolar_nerve): “Inferior nerve injury most commonly occurs during surgery including wisdom tooth, dental implant placement…”

### Nervio mental (`Mental_nerve`)

Fuentes: [Mental nerve](https://en.wikipedia.org/wiki/Mental_nerve).

- **Descripción.** Nervio sensitivo de la cara, también llamado nervio mentoniano.
  - [Mental nerve](https://en.wikipedia.org/wiki/Mental_nerve): “The mental nerve is a sensory nerve of the face.”
- **Descripción (sigue).** Es una rama del nervio alveolar inferior, que a su vez lo es del mandibular (V3), rama del trigémino.
  - [Mental nerve](https://en.wikipedia.org/wiki/Mental_nerve): “It is a branch of the posterior trunk of the inferior alveolar nerve, itself…”
- **Descripción (sigue).** Da sensibilidad a la parte anterior del mentón, al labio inferior y a la encía de los dientes inferiores anteriores.
  - [Mental nerve](https://en.wikipedia.org/wiki/Mental_nerve): “It provides sensation to the front of the chin and the lower lip, as…”
- **Punto clave.** Se puede bloquear con anestesia local para intervenir en el mentón, el labio inferior o la mucosa del interior de la mejilla; sus problemas causan entumecimiento del mentón.
  - [Mental nerve](https://en.wikipedia.org/wiki/Mental_nerve): “It can be blocked with local anaesthesia for procedures on the chin, lower lip,…”
  - [Mental nerve](https://en.wikipedia.org/wiki/Mental_nerve): “Problems with the nerve cause chin numbness.”

### Cuerda del tímpano (`Chorda_tympani`)

Fuentes: [Chorda tympani](https://en.wikipedia.org/wiki/Chorda_tympani).

- **Descripción.** Rama del nervio facial que lleva el gusto de la parte anterior de la lengua y las fibras que hacen secretar a las glándulas salivales submandibular y sublingual.
  - [Chorda tympani](https://en.wikipedia.org/wiki/Chorda_tympani): “is a branch of the facial nerve that carries gustatory (taste) sensory innervation from…”
- **Descripción (sigue).** Su trayecto es complejo: desde el tronco del encéfalo atraviesa el hueso temporal y el oído medio, llega a la fosa infratemporal y termina en la boca.
  - [Chorda tympani](https://en.wikipedia.org/wiki/Chorda_tympani): “Chorda tympani has a complex course from the brainstem, through the temporal bone and…”

### Nervio coclear (`Cochlear_nerve`)

Fuentes: [Cochlear nerve](https://en.wikipedia.org/wiki/Cochlear_nerve).

- **Descripción.** Una de las dos partes del nervio vestibulococlear; también se llama nervio auditivo o acústico.
  - [Cochlear nerve](https://en.wikipedia.org/wiki/Cochlear_nerve): “The cochlear nerve (also auditory nerve or acoustic nerve) is one of two parts…”
- **Descripción (sigue).** Lleva la información auditiva desde la cóclea del oído interno directamente al encéfalo.
  - [Cochlear nerve](https://en.wikipedia.org/wiki/Cochlear_nerve): “The cochlear nerve carries auditory sensory information from the cochlea of the inner ear…”
- **Función.** Audición.
  - [Cochlear nerve](https://en.wikipedia.org/wiki/Cochlear_nerve): “The cochlear nerve carries auditory sensory information from the cochlea of the inner ear…”

### Nervio vestibular (`Vestibular_nerve`)

Fuentes: [Vestibular nerve](https://en.wikipedia.org/wiki/Vestibular_nerve).

- **Descripción.** Una de las dos ramas del nervio vestibulococlear.
  - [Vestibular nerve](https://en.wikipedia.org/wiki/Vestibular_nerve): “The vestibular nerve is one of the two branches of the vestibulocochlear nerve”
- **Descripción (sigue).** Lleva la información de los órganos otolíticos (utrículo y sáculo), que detectan la gravedad y las aceleraciones lineales de la cabeza, y de los tres conductos semicirculares, que detectan sus giros.
  - [Vestibular nerve](https://en.wikipedia.org/wiki/Vestibular_nerve): “the vestibular nerve transmits sensory information from vestibular hair cells located in the two…”
  - [Vestibular nerve](https://en.wikipedia.org/wiki/Vestibular_nerve): “Information from the otolith organs reflects gravity and linear accelerations of the head.”
  - [Vestibular nerve](https://en.wikipedia.org/wiki/Vestibular_nerve): “Information from the semicircular canals reflects rotational movement of the head.”
- **Punto clave.** Las dos informaciones hacen falta para notar la posición del cuerpo y mantener la mirada estable cuando el entorno se mueve.
  - [Vestibular nerve](https://en.wikipedia.org/wiki/Vestibular_nerve): “Both are necessary for the sensation of body position and gaze stability in relation…”

### Tronco superior del plexo braquial (`Superior_trunk_of_brachial_plexus`)

Fuentes: [Upper trunk](https://en.wikipedia.org/wiki/Upper_trunk), [Brachial plexus](https://en.wikipedia.org/wiki/Brachial_plexus).

- **Descripción.** Parte del plexo braquial formada por la unión de los ramos anteriores de los nervios cervicales quinto y sexto (C5 y C6).
  - [Upper trunk](https://en.wikipedia.org/wiki/Upper_trunk): “It is formed by joining of the ventral rami of the fifth (C5) and…”
- **Descripción (sigue).** Se divide en una división anterior y otra posterior, y de él salen los nervios subclavio y supraescapular.
  - [Upper trunk](https://en.wikipedia.org/wiki/Upper_trunk): “The upper trunk divides into an anterior and posterior division.”
  - [Upper trunk](https://en.wikipedia.org/wiki/Upper_trunk): “subclavian nerve (C5-C6)”
  - [Upper trunk](https://en.wikipedia.org/wiki/Upper_trunk): “suprascapular nerve (C5-C6)”
- **Punto clave.** Los nervios axilar, radial, musculocutáneo y mediano llevan fibras que vienen de él.
  - [Upper trunk](https://en.wikipedia.org/wiki/Upper_trunk): “The axillary, radial, musculocutaneous and median nerves all contain axons derived from the upper…”
- **Punto clave.** El plexo braquial tiene cinco raíces, tres troncos, seis divisiones (tres anteriores y tres posteriores), tres fascículos y cinco ramas terminales.
  - [Brachial plexus](https://en.wikipedia.org/wiki/Brachial_plexus): “The brachial plexus is divided into five roots, three trunks, six divisions (three anterior…”

### Tronco medio del plexo braquial (`Middle_trunk_of_brachial_plexus`)

Fuentes: [Brachial plexus](https://en.wikipedia.org/wiki/Brachial_plexus).

- **Descripción.** Parte del plexo braquial formada solo por el ramo anterior del nervio cervical C7.
  - [Brachial plexus](https://en.wikipedia.org/wiki/Brachial_plexus): “C7 continuously forms the middle trunk”
- **Punto clave.** El plexo braquial tiene cinco raíces, tres troncos, seis divisiones (tres anteriores y tres posteriores), tres fascículos y cinco ramas terminales.
  - [Brachial plexus](https://en.wikipedia.org/wiki/Brachial_plexus): “The brachial plexus is divided into five roots, three trunks, six divisions (three anterior…”

### Tronco inferior del plexo braquial (`Inferior_trunk_of_brachial_plexus`)

Fuentes: [Brachial plexus](https://en.wikipedia.org/wiki/Brachial_plexus).

- **Descripción.** Parte del plexo braquial formada por la unión de los ramos anteriores de los nervios C8 y T1.
  - [Brachial plexus](https://en.wikipedia.org/wiki/Brachial_plexus): “C8 and T1 merge to establish the lower trunk”
- **Punto clave.** La lesión de la parte inferior del plexo braquial es mucho menos frecuente; puede ocurrir al agarrarse a algo para frenar una caída o si se tira demasiado del brazo de un bebé durante el parto.
  - [Brachial plexus](https://en.wikipedia.org/wiki/Brachial_plexus): “An inferior brachial plexus injury is far less common but can occur when a…”
- **Punto clave.** El plexo braquial tiene cinco raíces, tres troncos, seis divisiones (tres anteriores y tres posteriores), tres fascículos y cinco ramas terminales.
  - [Brachial plexus](https://en.wikipedia.org/wiki/Brachial_plexus): “The brachial plexus is divided into five roots, three trunks, six divisions (three anterior…”

### Fascículo posterior del plexo braquial (`Posterior_cord_of_brachial_plexus`)

Fuentes: [Posterior cord](https://en.wikipedia.org/wiki/Posterior_cord), [Deep branch of radial nerve](https://en.wikipedia.org/wiki/Deep_branch_of_radial_nerve), [Upper subscapular nerve](https://en.wikipedia.org/wiki/Upper_subscapular_nerve), [Lower subscapular nerve](https://en.wikipedia.org/wiki/Lower_subscapular_nerve), [Thoracodorsal nerve](https://en.wikipedia.org/wiki/Thoracodorsal_nerve), [Axillary nerve](https://en.wikipedia.org/wiki/Axillary_nerve), [Brachial plexus](https://en.wikipedia.org/wiki/Brachial_plexus).

- **Descripción.** Parte del plexo braquial que recibe fibras de todas sus raíces, a través de los tres troncos.
  - [Posterior cord](https://en.wikipedia.org/wiki/Posterior_cord): “It consists of contributions from all of the roots of the brachial plexus.”
  - [Deep branch of radial nerve](https://en.wikipedia.org/wiki/Deep_branch_of_radial_nerve): “The posterior cord takes nerves from the upper, lower, and middle trunk”
- **Descripción (sigue).** De él salen los nervios subescapulares superior e inferior, el toracodorsal, el axilar y el radial.
  - [Upper subscapular nerve](https://en.wikipedia.org/wiki/Upper_subscapular_nerve): “is the first branch of the posterior cord of the brachial plexus”
  - [Lower subscapular nerve](https://en.wikipedia.org/wiki/Lower_subscapular_nerve): “is the third branch of the posterior cord of the brachial plexus”
  - [Thoracodorsal nerve](https://en.wikipedia.org/wiki/Thoracodorsal_nerve): “The thoracodorsal nerve arises from the posterior cord of the brachial plexus.”
  - [Axillary nerve](https://en.wikipedia.org/wiki/Axillary_nerve): “The posterior cord of the brachial plexus splits”
  - [Deep branch of radial nerve](https://en.wikipedia.org/wiki/Deep_branch_of_radial_nerve): “The radial nerve arises from the posterior cord of the brachial plexus.”
- **Punto clave.** El plexo braquial tiene cinco raíces, tres troncos, seis divisiones (tres anteriores y tres posteriores), tres fascículos y cinco ramas terminales.
  - [Brachial plexus](https://en.wikipedia.org/wiki/Brachial_plexus): “The brachial plexus is divided into five roots, three trunks, six divisions (three anterior…”

### Nervio supraescapular (`Suprascapular_nerve`)

Fuentes: [Suprascapular nerve](https://en.wikipedia.org/wiki/Suprascapular_nerve).

- **Descripción.** Nervio mixto, sensitivo y motor, que sale del tronco superior del plexo braquial con fibras de C5 y C6. Inerva los músculos supraespinoso e infraespinoso.
  - [Suprascapular nerve](https://en.wikipedia.org/wiki/Suprascapular_nerve): “is a mixed (sensory and motor) nerve that branches from the upper trunk of…”
  - [Suprascapular nerve](https://en.wikipedia.org/wiki/Suprascapular_nerve): “It is derived from the ventral rami of cervical nerves C5-C6.”
  - [Suprascapular nerve](https://en.wikipedia.org/wiki/Suprascapular_nerve): “It provides motor innervation to the supraspinatus muscle, and the infraspinatus muscle.”
- **Punto clave.** Su atrapamiento causa dolor de hombro y atrofia de los músculos que inerva.
  - [Suprascapular nerve](https://en.wikipedia.org/wiki/Suprascapular_nerve): “Suprascapular nerve entrapment syndrome, causing shoulder pain and localized muscular atrophy”

### Nervio escapular dorsal (`Dorsal_scapular_nerve`)

Fuentes: [Dorsal scapular nerve](https://en.wikipedia.org/wiki/Dorsal_scapular_nerve).

- **Descripción.** Rama del plexo braquial que suele venir del ramo anterior del nervio C5. Inerva los músculos romboides mayor y menor y el elevador de la escápula.
  - [Dorsal scapular nerve](https://en.wikipedia.org/wiki/Dorsal_scapular_nerve): “is a branch of the brachial plexus, usually derived from the ventral ramus of…”
  - [Dorsal scapular nerve](https://en.wikipedia.org/wiki/Dorsal_scapular_nerve): “It provides motor innervation to the rhomboid major muscle, rhomboid minor muscle, and levator…”
- **Punto clave.** Si se lesiona, la escápula de ese lado queda más lejos de la línea media y no se pueden echar los hombros hacia atrás, como al ponerse firme.
  - [Dorsal scapular nerve](https://en.wikipedia.org/wiki/Dorsal_scapular_nerve): “when the scapula on the injured side is located farther from the midline than…”
  - [Dorsal scapular nerve](https://en.wikipedia.org/wiki/Dorsal_scapular_nerve): “The patient would be unable to pull their shoulder back, as when standing at…”

### Nervio toracodorsal (`Thoracodorsal_nerve`)

Fuentes: [Thoracodorsal nerve](https://en.wikipedia.org/wiki/Thoracodorsal_nerve).

- **Descripción.** Nervio que sale del fascículo posterior del plexo braquial e inerva el músculo dorsal ancho; también se llama nervio subescapular medio o largo.
  - [Thoracodorsal nerve](https://en.wikipedia.org/wiki/Thoracodorsal_nerve): “The thoracodorsal nerve arises from the posterior cord of the brachial plexus.”
  - [Thoracodorsal nerve](https://en.wikipedia.org/wiki/Thoracodorsal_nerve): “It supplies the latissimus dorsi muscle.”
  - [Thoracodorsal nerve](https://en.wikipedia.org/wiki/Thoracodorsal_nerve): “also known as the middle subscapular nerve or the long subscapular nerve”
- **Punto clave.** Cuando el dorsal ancho se usa en un trasplante, se conserva este nervio y se trasplanta con el músculo.
  - [Thoracodorsal nerve](https://en.wikipedia.org/wiki/Thoracodorsal_nerve): “The latissimus dorsi is occasionally used for transplantation”
  - [Thoracodorsal nerve](https://en.wikipedia.org/wiki/Thoracodorsal_nerve): “In these cases, the nerve supply is preserved, and transplanted with the muscle”

### Nervio pectoral lateral (`Lateral_pectoral_nerve`)

Fuentes: [Lateral pectoral nerve](https://en.wikipedia.org/wiki/Lateral_pectoral_nerve).

- **Descripción.** Nervio que nace del fascículo lateral del plexo braquial, con fibras de C5 a C7.
  - [Lateral pectoral nerve](https://en.wikipedia.org/wiki/Lateral_pectoral_nerve): “arises from the lateral cord of the brachial plexus, and through it from the…”
- **Descripción (sigue).** Cruza la arteria y la vena axilares, atraviesa la fascia clavipectoral y entra en el músculo pectoral mayor por su cara profunda para inervarlo.
  - [Lateral pectoral nerve](https://en.wikipedia.org/wiki/Lateral_pectoral_nerve): “It passes across the axillary artery and vein, pierces the clavipectoral (coracoclavicular) fascia, and…”

### Nervio pectoral medial (`Medial_pectoral_nerve`)

Fuentes: [Medial pectoral nerve](https://en.wikipedia.org/wiki/Medial_pectoral_nerve).

- **Descripción.** Rama, por lo general, del fascículo medial del plexo braquial, con fibras de C8 y T1.
  - [Medial pectoral nerve](https://en.wikipedia.org/wiki/Medial_pectoral_nerve): “is (typically) a branch of the medial cord of the brachial plexus and is…”
- **Descripción (sigue).** Inerva el pectoral menor y la mitad inferior (parte esternal) del pectoral mayor, y va por el borde inferior del pectoral menor.
  - [Medial pectoral nerve](https://en.wikipedia.org/wiki/Medial_pectoral_nerve): “It provides motor innervation to the pectoralis minor muscle, and the lower half (sternal…”
  - [Medial pectoral nerve](https://en.wikipedia.org/wiki/Medial_pectoral_nerve): “It runs along the inferior border of the pectoralis minor muscle.”
- **Punto clave.** Se puede usar como nervio donante para reconstruir un plexo braquial o un nervio axilar dañados.
  - [Medial pectoral nerve](https://en.wikipedia.org/wiki/Medial_pectoral_nerve): “The medial pectoral nerve can be used as a donor nerve when reconstructing a…”

### Nervio subescapular superior (`Superior_subscapular_nerve`)

Fuentes: [Upper subscapular nerve](https://en.wikipedia.org/wiki/Upper_subscapular_nerve).

- **Descripción.** Primera rama del fascículo posterior del plexo braquial, con fibras de C5 y C6.
  - [Upper subscapular nerve](https://en.wikipedia.org/wiki/Upper_subscapular_nerve): “is the first branch of the posterior cord of the brachial plexus”
  - [Upper subscapular nerve](https://en.wikipedia.org/wiki/Upper_subscapular_nerve): “The upper subscapular nerve contains axons from the ventral rami of the C5 and…”
- **Descripción (sigue).** Inerva la parte superior del músculo subescapular; la inferior la inerva el nervio subescapular inferior.
  - [Upper subscapular nerve](https://en.wikipedia.org/wiki/Upper_subscapular_nerve): “It innervates the superior portion of the subscapularis muscle.”
  - [Upper subscapular nerve](https://en.wikipedia.org/wiki/Upper_subscapular_nerve): “The inferior portion of the subscapularis is innervated by the lower subscapular nerve.”
- **Punto clave.** Su lesión puede reducir la rotación interna del hombro, aunque otros músculos la suplen.
  - [Upper subscapular nerve](https://en.wikipedia.org/wiki/Upper_subscapular_nerve): “A lesion to the upper subscapular nerve can cause a reduced ability to medially…”

### Nervio subescapular inferior (`Inferior_subscapular_nerve`)

Fuentes: [Lower subscapular nerve](https://en.wikipedia.org/wiki/Lower_subscapular_nerve).

- **Descripción.** Tercera rama del fascículo posterior del plexo braquial. Inerva la parte inferior del músculo subescapular y el redondo mayor.
  - [Lower subscapular nerve](https://en.wikipedia.org/wiki/Lower_subscapular_nerve): “is the third branch of the posterior cord of the brachial plexus”
  - [Lower subscapular nerve](https://en.wikipedia.org/wiki/Lower_subscapular_nerve): “It innervates the inferior portion of the subscapularis muscle and the teres major muscle.”

### Nervio cutáneo antebraquial medial (`Medial_antebrachial_cutaneous_nerve`)

Fuentes: [Medial cutaneous nerve of forearm](https://en.wikipedia.org/wiki/Medial_cutaneous_nerve_of_forearm).

- **Descripción.** Rama sensitiva del fascículo medial del plexo braquial, con fibras de C8 y T1. Da sensibilidad a la piel de la cara medial del antebrazo y de encima del olécranon.
  - [Medial cutaneous nerve of forearm](https://en.wikipedia.org/wiki/Medial_cutaneous_nerve_of_forearm): “is a sensory branch of the medial cord of the brachial plexus derived from…”
  - [Medial cutaneous nerve of forearm](https://en.wikipedia.org/wiki/Medial_cutaneous_nerve_of_forearm): “It provides sensory innervation to the skin of the medial forearm and skin overlying…”
- **Descripción (sigue).** Baja por el brazo junto a la vena basílica y se divide en una rama anterior y otra posterior, que llegan hasta la muñeca.
  - [Medial cutaneous nerve of forearm](https://en.wikipedia.org/wiki/Medial_cutaneous_nerve_of_forearm): “It descends through the (upper) arm within the brachial fascia alongside the basilic vein,…”
  - [Medial cutaneous nerve of forearm](https://en.wikipedia.org/wiki/Medial_cutaneous_nerve_of_forearm): “the two terminal branches travel as far distally as the wrist”

### Nervio cutáneo braquial medial (`Medial_brachial_cutaneous_nerve`)

Fuentes: [Medial cutaneous nerve of arm](https://en.wikipedia.org/wiki/Medial_cutaneous_nerve_of_arm).

- **Descripción.** Rama sensitiva del fascículo medial del plexo braquial, con fibras de C8 y T1, que da sensibilidad a la cara medial del brazo. Baja acompañando a la vena basílica.
  - [Medial cutaneous nerve of arm](https://en.wikipedia.org/wiki/Medial_cutaneous_nerve_of_arm): “is a sensory branch of the medial cord of the brachial plexus derived from…”
  - [Medial cutaneous nerve of arm](https://en.wikipedia.org/wiki/Medial_cutaneous_nerve_of_arm): “It provides sensory innervation to the medial arm.”
  - [Medial cutaneous nerve of arm](https://en.wikipedia.org/wiki/Medial_cutaneous_nerve_of_arm): “It descends accompanied by the basilic vein.”

### Nervio cutáneo antebraquial lateral (`Lateral_antebrachial_cutaneous_nerve`)

Fuentes: [Lateral cutaneous nerve of forearm](https://en.wikipedia.org/wiki/Lateral_cutaneous_nerve_of_forearm).

- **Descripción.** Nervio sensitivo que continúa al nervio musculocutáneo más allá del borde lateral del tendón del bíceps braquial.
  - [Lateral cutaneous nerve of forearm](https://en.wikipedia.org/wiki/Lateral_cutaneous_nerve_of_forearm): “is a sensory nerve representing the continuation of the musculocutaneous nerve beyond the lateral…”
- **Descripción (sigue).** Da sensibilidad a la piel de la cara lateral del antebrazo y se divide en una rama palmar y otra dorsal.
  - [Lateral cutaneous nerve of forearm](https://en.wikipedia.org/wiki/Lateral_cutaneous_nerve_of_forearm): “The lateral cutaneous nerve provides sensory innervation to the skin of the lateral forearm.”
  - [Lateral cutaneous nerve of forearm](https://en.wikipedia.org/wiki/Lateral_cutaneous_nerve_of_forearm): “before splitting into a volar branch and a dorsal branch”

### Nervio cutáneo antebraquial posterior (`Posterior_antebrachial_cutaneous_nerve`)

Fuentes: [Posterior cutaneous nerve of forearm](https://en.wikipedia.org/wiki/Posterior_cutaneous_nerve_of_forearm).

- **Descripción.** Nervio cutáneo del antebrazo, es decir, que da sensibilidad a la piel. Nace del nervio radial en el compartimento posterior del brazo.
  - [Posterior cutaneous nerve of forearm](https://en.wikipedia.org/wiki/Posterior_cutaneous_nerve_of_forearm): “It is a cutaneous nerve (a nerve that supplies skin) of the forearm.”
  - [Posterior cutaneous nerve of forearm](https://en.wikipedia.org/wiki/Posterior_cutaneous_nerve_of_forearm): “It arises from the radial nerve in the posterior compartment of the arm”
- **Punto clave.** Su rama superior, más pequeña, pasa por delante del codo, cerca de la vena cefálica, y da sensibilidad a la mitad inferior del brazo.
  - [Posterior cutaneous nerve of forearm](https://en.wikipedia.org/wiki/Posterior_cutaneous_nerve_of_forearm): “The upper and smaller branch of the nerve passes to the front of the…”

### Nervio interóseo posterior del antebrazo (`Posterior_interosseous_nerve_of_forearm`)

Fuentes: [Posterior interosseous nerve](https://en.wikipedia.org/wiki/Posterior_interosseous_nerve).

- **Descripción.** Nervio del antebrazo que continúa a la rama profunda del nervio radial después de que esta cruza el músculo supinador; es bastante más fino que ella.
  - [Posterior interosseous nerve](https://en.wikipedia.org/wiki/Posterior_interosseous_nerve): “It is the continuation of the deep branch of the radial nerve, after this…”
  - [Posterior interosseous nerve](https://en.wikipedia.org/wiki/Posterior_interosseous_nerve): “It is considerably diminished in size compared to the deep branch of the radial…”
- **Descripción (sigue).** Sus fibras vienen de los segmentos C7 y C8 de la médula.
  - [Posterior interosseous nerve](https://en.wikipedia.org/wiki/Posterior_interosseous_nerve): “The nerve fibers originate from cervical segments C7 and C8 in the spinal column.”
- **Punto clave.** Puede quedar atrapado en la arcada de Frohse, que forma parte del músculo supinador, y lesionarse en la fractura de Monteggia.
  - [Posterior interosseous nerve](https://en.wikipedia.org/wiki/Posterior_interosseous_nerve): “The posterior interosseous nerve may be entrapped at the arcade of Frohse, which is…”
  - [Posterior interosseous nerve](https://en.wikipedia.org/wiki/Posterior_interosseous_nerve): “This nerve can be injured in Monteggia fracture”
- **Punto clave.** Su lesión es solo motora: los dedos caen porque no se pueden extender.
  - [Posterior interosseous nerve](https://en.wikipedia.org/wiki/Posterior_interosseous_nerve): “Posterior interosseous neuropathy is purely a motor syndrome resulting in finger drop”

### Nervio interóseo anterior del antebrazo (`Anterior_interosseous_nerve_of_forearm`)

Fuentes: [Anterior interosseous nerve](https://en.wikipedia.org/wiki/Anterior_interosseous_nerve).

- **Descripción.** Rama del nervio mediano que inerva los músculos profundos de la cara anterior del antebrazo, salvo la mitad ulnar del flexor profundo de los dedos; sus raíces vienen de C8 y T1.
  - [Anterior interosseous nerve](https://en.wikipedia.org/wiki/Anterior_interosseous_nerve): “is a branch of the median nerve that supplies the deep muscles on the…”
  - [Anterior interosseous nerve](https://en.wikipedia.org/wiki/Anterior_interosseous_nerve): “Its nerve roots come from C8 and T1.”
- **Descripción (sigue).** Acompaña a la arteria interósea anterior sobre la membrana interósea y termina en el pronador cuadrado y en la articulación de la muñeca.
  - [Anterior interosseous nerve](https://en.wikipedia.org/wiki/Anterior_interosseous_nerve): “It accompanies the anterior interosseous artery along the anterior of the interosseous membrane of…”
  - [Anterior interosseous nerve](https://en.wikipedia.org/wiki/Anterior_interosseous_nerve): “and ending below in the pronator quadratus and wrist joint”
- **Punto clave.** Tras una lesión del nervio ulnar se usa a menudo como rama donante para volver a inervar los músculos paralizados.
  - [Anterior interosseous nerve](https://en.wikipedia.org/wiki/Anterior_interosseous_nerve): “Following peripheral nerve injury to the ulnar nerve, the AIN is often used as…”

### Rama superficial del nervio radial (`Superficial_branch_of_radial_nerve`)

Fuentes: [Superficial branch of radial nerve](https://en.wikipedia.org/wiki/Superficial_branch_of_radial_nerve).

- **Descripción.** Rama sensitiva del nervio radial que baja por delante del lado radial del antebrazo, al principio oculta bajo el músculo braquiorradial y junto a la arteria radial.
  - [Superficial branch of radial nerve](https://en.wikipedia.org/wiki/Superficial_branch_of_radial_nerve): “passes along the front of the radial side of the forearm”
  - [Superficial branch of radial nerve](https://en.wikipedia.org/wiki/Superficial_branch_of_radial_nerve): “It is a sensory nerve.”
  - [Superficial branch of radial nerve](https://en.wikipedia.org/wiki/Superficial_branch_of_radial_nerve): “It lies at first slightly lateral to the radial artery, concealed beneath the brachioradialis.”
- **Descripción (sigue).** Unos 7 cm por encima de la muñeca se separa de la arteria, atraviesa la fascia y se divide en dos ramas, lateral y medial.
  - [Superficial branch of radial nerve](https://en.wikipedia.org/wiki/Superficial_branch_of_radial_nerve): “It quits the artery about 7 cm. above the wrist”
  - [Superficial branch of radial nerve](https://en.wikipedia.org/wiki/Superficial_branch_of_radial_nerve): “divides into two branches: lateral and medial”
- **Punto clave.** Una pulsera, un reloj o una muñequera apretados pueden comprimirlo: es el síndrome de Wartenberg.
  - [Superficial branch of radial nerve](https://en.wikipedia.org/wiki/Superficial_branch_of_radial_nerve): “is associated with an entrapment neuropathy called Wartenberg”
  - [Superficial branch of radial nerve](https://en.wikipedia.org/wiki/Superficial_branch_of_radial_nerve): “The nerve may be compressed due to wearing a tight wristband, watch or bracelet.”

### Rama profunda del nervio radial (`Deep_branch_of_radial_nerve`)

Fuentes: [Deep branch of radial nerve](https://en.wikipedia.org/wiki/Deep_branch_of_radial_nerve), [Posterior interosseous nerve](https://en.wikipedia.org/wiki/Posterior_interosseous_nerve).

- **Descripción.** Rama motora del nervio radial, que se separa de la rama superficial en la fosa del codo.
  - [Deep branch of radial nerve](https://en.wikipedia.org/wiki/Deep_branch_of_radial_nerve): “The radial nerve divides into a superficial (sensory) and deep (motor) branch at the…”
- **Descripción (sigue).** Rodea el radio por fuera, entre las dos capas del músculo supinador, hasta la parte posterior del antebrazo, e inerva los músculos del compartimento posterior, sobre todo los extensores de la mano.
  - [Deep branch of radial nerve](https://en.wikipedia.org/wiki/Deep_branch_of_radial_nerve): “winds to the back of the forearm around the lateral side of the radius…”
  - [Deep branch of radial nerve](https://en.wikipedia.org/wiki/Deep_branch_of_radial_nerve): “The deep branch provides motor function to the muscles in the posterior compartment of…”
- **Punto clave.** Tras cruzar el supinador continúa como nervio interóseo posterior.
  - [Posterior interosseous nerve](https://en.wikipedia.org/wiki/Posterior_interosseous_nerve): “It is the continuation of the deep branch of the radial nerve, after this…”

### Rama profunda del nervio ulnar (`Deep_branch_of_ulnar_nerve`)

Fuentes: [Deep branch of ulnar nerve](https://en.wikipedia.org/wiki/Deep_branch_of_ulnar_nerve).

- **Descripción.** Rama terminal, sobre todo motora, del nervio ulnar; la acompaña la rama palmar profunda de la arteria ulnar.
  - [Deep branch of ulnar nerve](https://en.wikipedia.org/wiki/Deep_branch_of_ulnar_nerve): “is a terminal, primarily motor branch of the ulnar nerve”
  - [Deep branch of ulnar nerve](https://en.wikipedia.org/wiki/Deep_branch_of_ulnar_nerve): “It is accompanied by the deep palmar branch of ulnar artery.”

### Nervio obturador (`Obturator_nerve`)

Fuentes: [Obturator nerve](https://en.wikipedia.org/wiki/Obturator_nerve).

- **Descripción.** Nervio del plexo lumbar que nace de las divisiones ventrales de los nervios lumbares segundo, tercero y cuarto.
  - [Obturator nerve](https://en.wikipedia.org/wiki/Obturator_nerve): “arises from the ventral divisions of the second, third, and fourth lumbar nerves in…”
- **Descripción (sigue).** Entra en el muslo por el conducto obturador, inerva los músculos aductores y da sensibilidad a la piel de la cara medial del muslo.
  - [Obturator nerve](https://en.wikipedia.org/wiki/Obturator_nerve): “Here it enters the thigh, through the obturator canal”
  - [Obturator nerve](https://en.wikipedia.org/wiki/Obturator_nerve): “The nerve is also responsible for the motor innervation of the adductor muscles of…”
  - [Obturator nerve](https://en.wikipedia.org/wiki/Obturator_nerve): “The obturator nerve is responsible for the sensory innervation of the skin of the…”
- **Punto clave.** Su bloqueo anestésico se usa, junto con otros anestésicos, en cirugías de rodilla y de uretra.
  - [Obturator nerve](https://en.wikipedia.org/wiki/Obturator_nerve): “An obturator nerve block may be used during knee surgery and urethral surgery in…”

### Nervio genitofemoral (`Genitofemoral_nerve`)

Fuentes: [Genitofemoral nerve](https://en.wikipedia.org/wiki/Genitofemoral_nerve).

- **Descripción.** Rama mixta del plexo lumbar, de los ramos anteriores de L1 y L2, que se divide en una rama genital y otra femoral.
  - [Genitofemoral nerve](https://en.wikipedia.org/wiki/Genitofemoral_nerve): “is a mixed branch of the lumbar plexus derived from anterior rami of lumbar…”
  - [Genitofemoral nerve](https://en.wikipedia.org/wiki/Genitofemoral_nerve): “It splits into a genital branch and a femoral branch.”
- **Descripción (sigue).** Da sensibilidad a la parte alta y anterior del muslo y a la piel de la parte anterior del escroto en el hombre o del monte del pubis en la mujer; por su rama genital inerva el músculo cremáster.
  - [Genitofemoral nerve](https://en.wikipedia.org/wiki/Genitofemoral_nerve): “It provides sensory innervation to the upper anterior thigh, as well as the skin…”
  - [Genitofemoral nerve](https://en.wikipedia.org/wiki/Genitofemoral_nerve): “It also provides motor innervation to the cremaster muscle (via its genital branch).”

### Nervio ilioinguinal (`Ilio_inguinal_nerve`)

Fuentes: [Ilioinguinal nerve](https://en.wikipedia.org/wiki/Ilioinguinal_nerve).

- **Descripción.** Rama del primer nervio lumbar (L1), que se separa de él junto con el nervio iliohipogástrico, más grueso.
  - [Ilioinguinal nerve](https://en.wikipedia.org/wiki/Ilioinguinal_nerve): “The ilioinguinal nerve is a branch of the first lumbar nerve (L1).”
  - [Ilioinguinal nerve](https://en.wikipedia.org/wiki/Ilioinguinal_nerve): “It separates from the first lumbar nerve along with the larger iliohypogastric nerve.”
- **Descripción (sigue).** Atraviesa los músculos de la pared del abdomen y acompaña al cordón espermático en el hombre, o al ligamento redondo del útero en la mujer, por el anillo inguinal superficial; da sensibilidad a la piel de la parte alta y medial del muslo.
  - [Ilioinguinal nerve](https://en.wikipedia.org/wiki/Ilioinguinal_nerve): “then perforates the transversus abdominis”
  - [Ilioinguinal nerve](https://en.wikipedia.org/wiki/Ilioinguinal_nerve): “accompanies the spermatic cord (in males) or the round ligament of uterus (in females)…”
  - [Ilioinguinal nerve](https://en.wikipedia.org/wiki/Ilioinguinal_nerve): “Its fibres are then distributed to the skin of the upper and medial part…”

### Nervio iliohipogástrico (`Iliohypogastric_nerve`)

Fuentes: [Iliohypogastric nerve](https://en.wikipedia.org/wiki/Iliohypogastric_nerve).

- **Descripción.** Nervio del plexo lumbar que da sensibilidad a la piel de la región glútea lateral y del hipogastrio, e inerva los músculos oblicuo interno y transverso del abdomen.
  - [Iliohypogastric nerve](https://en.wikipedia.org/wiki/Iliohypogastric_nerve): “is a nerve that originates from the lumbar plexus that supplies sensation to skin…”
- **Punto clave.** Puede dañarse donde atraviesa los músculos oblicuos, sobre todo como complicación de una cirugía.
  - [Iliohypogastric nerve](https://en.wikipedia.org/wiki/Iliohypogastric_nerve): “may be damaged at the points where it passes through the internal oblique muscle…”
  - [Iliohypogastric nerve](https://en.wikipedia.org/wiki/Iliohypogastric_nerve): “It is most often damaged as a result of surgical complications.”

### Nervio cutáneo femoral lateral (`Lateral_femoral_cutaneous_nerve`)

Fuentes: [Lateral cutaneous nerve of thigh](https://en.wikipedia.org/wiki/Lateral_cutaneous_nerve_of_thigh).

- **Descripción.** Nervio cutáneo del muslo que nace de las divisiones dorsales de los nervios lumbares segundo y tercero, en el plexo lumbar.
  - [Lateral cutaneous nerve of thigh](https://en.wikipedia.org/wiki/Lateral_cutaneous_nerve_of_thigh): “It originates from the dorsal divisions of the second and third lumbar nerves from…”
- **Descripción (sigue).** Pasa por debajo del ligamento inguinal y da sensibilidad a la piel de la cara lateral del muslo.
  - [Lateral cutaneous nerve of thigh](https://en.wikipedia.org/wiki/Lateral_cutaneous_nerve_of_thigh): “It passes under the inguinal ligament to reach the thigh.”
  - [Lateral cutaneous nerve of thigh](https://en.wikipedia.org/wiki/Lateral_cutaneous_nerve_of_thigh): “It supplies sensation to the skin on the lateral part of the thigh”
- **Punto clave.** Su compresión, casi siempre junto al ligamento inguinal, causa la meralgia parestésica.
  - [Lateral cutaneous nerve of thigh](https://en.wikipedia.org/wiki/Lateral_cutaneous_nerve_of_thigh): “Nerve compression (usually around the inguinal ligament) can cause meralgia paraesthetica.”

### Nervio cutáneo femoral posterior (`Posterior_femoral_cutaneous_nerve`)

Fuentes: [Posterior cutaneous nerve of thigh](https://en.wikipedia.org/wiki/Posterior_cutaneous_nerve_of_thigh).

- **Descripción.** Nervio sensitivo del muslo, rama del plexo sacro. Da sensibilidad a la piel de la cara posterior del muslo y de la pierna, a la nalga y al periné.
  - [Posterior cutaneous nerve of thigh](https://en.wikipedia.org/wiki/Posterior_cutaneous_nerve_of_thigh): “is a sensory nerve of the thigh”
  - [Posterior cutaneous nerve of thigh](https://en.wikipedia.org/wiki/Posterior_cutaneous_nerve_of_thigh): “It is a branch of the sacral plexus.”
  - [Posterior cutaneous nerve of thigh](https://en.wikipedia.org/wiki/Posterior_cutaneous_nerve_of_thigh): “It supplies the skin of the posterior surface of the thigh, leg, buttock, and…”
- **Punto clave.** A diferencia de la mayoría de los nervios cutáneos, casi todo su recorrido está bajo la fascia profunda: solo sus ramas finales pasan al tejido subcutáneo.
  - [Posterior cutaneous nerve of thigh](https://en.wikipedia.org/wiki/Posterior_cutaneous_nerve_of_thigh): “only the terminal branches of this nerve pass into subcutaneous tissue before being distributed…”

### Nervio glúteo superior (`Superior_gluteal_nerve`)

Fuentes: [Superior gluteal nerve](https://en.wikipedia.org/wiki/Superior_gluteal_nerve).

- **Descripción.** Nervio mixto, motor y sensitivo, del plexo sacro, que nace en la pelvis. Inerva los músculos glúteo medio, glúteo menor y tensor de la fascia lata, y tiene una rama cutánea.
  - [Superior gluteal nerve](https://en.wikipedia.org/wiki/Superior_gluteal_nerve): “is a mixed (motor and sensory) nerve of the sacral plexus that originates in…”
  - [Superior gluteal nerve](https://en.wikipedia.org/wiki/Superior_gluteal_nerve): “It provides motor innervation to the gluteus medius, gluteus minimus, tensor fasciae latae; it…”
- **Punto clave.** Si se lesiona, los glúteos medio y menor se debilitan y no sujetan bien la pelvis al caminar: es la marcha de Trendelenburg.
  - [Superior gluteal nerve](https://en.wikipedia.org/wiki/Superior_gluteal_nerve): “In normal gait, the small gluteal muscles on the stance side can stabilize the…”
  - [Superior gluteal nerve](https://en.wikipedia.org/wiki/Superior_gluteal_nerve): “Weakness or paralysis of these muscles caused by a damaged superior gluteal nerve can…”
  - [Superior gluteal nerve](https://en.wikipedia.org/wiki/Superior_gluteal_nerve): “This gait disturbance is known as Trendelenburg gait.”

### Nervio fibular profundo (`Deep_fibular_nerve`)

Fuentes: [Deep fibular nerve](https://en.wikipedia.org/wiki/Deep_fibular_nerve).

- **Descripción.** Rama del nervio fibular común, también llamada nervio peroneo profundo, que nace entre la fíbula y el músculo fibular largo.
  - [Deep fibular nerve](https://en.wikipedia.org/wiki/Deep_fibular_nerve): “also known as deep peroneal nerve”
  - [Deep fibular nerve](https://en.wikipedia.org/wiki/Deep_fibular_nerve): “begins at the bifurcation of the common fibular nerve between the fibula and upper…”
- **Descripción (sigue).** Baja por delante de la membrana interósea junto a la arteria tibial anterior y, delante del tobillo, se divide en una rama terminal lateral y otra medial.
  - [Deep fibular nerve](https://en.wikipedia.org/wiki/Deep_fibular_nerve): “to the anterior surface of the interosseous membrane, and comes into relation with the…”
  - [Deep fibular nerve](https://en.wikipedia.org/wiki/Deep_fibular_nerve): “it then descends with the artery to the front of the ankle-joint, where it…”
- **Punto clave.** Su lesión, por ejemplo por un traumatismo en la cara lateral de la rodilla, produce «pie caído».
  - [Deep fibular nerve](https://en.wikipedia.org/wiki/Deep_fibular_nerve): “Damage to the deep fibular nerve, as is possible with traumatic injury to the…”

### Nervio fibular superficial (`Superficial_fibular_nerve`)

Fuentes: [Superficial fibular nerve](https://en.wikipedia.org/wiki/Superficial_fibular_nerve).

- **Descripción.** Nervio mixto, también llamado peroneo superficial, que inerva los músculos fibulares largo y corto y da sensibilidad a la piel de la cara anterolateral de la pierna y de casi todo el dorso del pie, salvo el primer espacio entre los dedos.
  - [Superficial fibular nerve](https://en.wikipedia.org/wiki/Superficial_fibular_nerve): “also known as superficial peroneal nerve”
  - [Superficial fibular nerve](https://en.wikipedia.org/wiki/Superficial_fibular_nerve): “is a mixed (motor and sensory) nerve that provides motor innervation to the fibularis…”
- **Punto clave.** Su lesión impide girar la planta del pie hacia fuera (eversión) y quita la sensibilidad del dorso del pie.
  - [Superficial fibular nerve](https://en.wikipedia.org/wiki/Superficial_fibular_nerve): “Injury to the nerve can result in an inability to evert the foot and…”

### Nervio plantar medial (`Medial_plantar_nerve`)

Fuentes: [Medial plantar nerve](https://en.wikipedia.org/wiki/Medial_plantar_nerve).

- **Descripción.** La mayor de las dos ramas terminales del nervio tibial; la acompaña la arteria plantar medial.
  - [Medial plantar nerve](https://en.wikipedia.org/wiki/Medial_plantar_nerve): “is the larger of the two terminal divisions of the tibial nerve”
  - [Medial plantar nerve](https://en.wikipedia.org/wiki/Medial_plantar_nerve): “which accompanies the medial plantar artery”
- **Descripción (sigue).** Pasa bajo el músculo abductor del dedo gordo y, a la altura de las bases de los metatarsianos, se divide en tres nervios digitales plantares comunes.
  - [Medial plantar nerve](https://en.wikipedia.org/wiki/Medial_plantar_nerve): “it passes under cover of the abductor hallucis muscle”
  - [Medial plantar nerve](https://en.wikipedia.org/wiki/Medial_plantar_nerve): “finally divides opposite the bases of the metatarsal bones into three common digital plantar…”

### Nervio plantar lateral (`Lateral_plantar_nerve`)

Fuentes: [Lateral plantar nerve](https://en.wikipedia.org/wiki/Lateral_plantar_nerve).

- **Descripción.** Rama del nervio tibial que da sensibilidad a la piel del quinto dedo y de la mitad lateral del cuarto, e inerva la mayoría de los músculos profundos de la planta: su reparto se parece al del nervio ulnar en la mano.
  - [Lateral plantar nerve](https://en.wikipedia.org/wiki/Lateral_plantar_nerve): “is a branch of the tibial nerve”
  - [Lateral plantar nerve](https://en.wikipedia.org/wiki/Lateral_plantar_nerve): “supplies the skin of the fifth toe and lateral half of the fourth, as…”
- **Descripción (sigue).** Va con la arteria plantar lateral hacia el lado externo del pie y se divide en una rama superficial y otra profunda.
  - [Lateral plantar nerve](https://en.wikipedia.org/wiki/Lateral_plantar_nerve): “It passes obliquely forward with the lateral plantar artery to the lateral side of…”
  - [Lateral plantar nerve](https://en.wikipedia.org/wiki/Lateral_plantar_nerve): “It divides into deep and superficial branches.”

### Nervio cutáneo sural medial (`Medial_sural_cutaneous_nerve`)

Fuentes: [Medial sural cutaneous nerve](https://en.wikipedia.org/wiki/Medial_sural_cutaneous_nerve).

- **Descripción.** Nervio sensitivo de la pierna (L4–S3) que da sensibilidad a la piel de la cara posteromedial de la pierna.
  - [Medial sural cutaneous nerve](https://en.wikipedia.org/wiki/Medial_sural_cutaneous_nerve): “is a sensory nerve of the leg”
  - [Medial sural cutaneous nerve](https://en.wikipedia.org/wiki/Medial_sural_cutaneous_nerve): “It supplies cutaneous innervation to the posteromedial leg.”

### Raíz anterior del nervio espinal (`Anterior_root_of_spinal_nerve`)

Fuentes: [Ventral root of spinal nerve](https://en.wikipedia.org/wiki/Ventral_root_of_spinal_nerve).

- **Descripción.** Raíz motora del nervio espinal: por ella salen de la médula las fibras motoras. En su extremo se une a la raíz posterior para formar un nervio espinal mixto.
  - [Ventral root of spinal nerve](https://en.wikipedia.org/wiki/Ventral_root_of_spinal_nerve): “or motor root is the efferent motor root of a spinal nerve”
  - [Ventral root of spinal nerve](https://en.wikipedia.org/wiki/Ventral_root_of_spinal_nerve): “At its distal end, the ventral root joins with the dorsal root to form…”

### Raíz posterior del nervio espinal (`Posterior_root_of_spinal_nerve`)

Fuentes: [Dorsal root of spinal nerve](https://en.wikipedia.org/wiki/Dorsal_root_of_spinal_nerve).

- **Descripción.** Raíz sensitiva del nervio espinal: sale de la médula espinal y llega al ganglio de la raíz posterior.
  - [Dorsal root of spinal nerve](https://en.wikipedia.org/wiki/Dorsal_root_of_spinal_nerve): “It emerges directly from the spinal cord and travels to the dorsal root ganglion.”
- **Descripción (sigue).** Lleva la información sensitiva, y sus fibras se unen a las de la raíz anterior para formar el nervio espinal.
  - [Dorsal root of spinal nerve](https://en.wikipedia.org/wiki/Dorsal_root_of_spinal_nerve): “The dorsal root transmits sensory information, forming the afferent sensory root of a spinal…”
  - [Dorsal root of spinal nerve](https://en.wikipedia.org/wiki/Dorsal_root_of_spinal_nerve): “Nerve fibres with the ventral root then combine to form a spinal nerve.”

### Stria terminalis (`Stria_terminalis`)

Fuentes: [Stria terminalis](https://en.wikipedia.org/wiki/Stria_terminalis).

- **Descripción.** Estría terminal: banda de fibras nerviosas que corre por el borde lateral de la cara ventricular del tálamo.
  - [Stria terminalis](https://en.wikipedia.org/wiki/Stria_terminalis): “or terminal stria”
  - [Stria terminalis](https://en.wikipedia.org/wiki/Stria_terminalis): “is a structure in the brain consisting of a band of fibers running along…”
- **Descripción (sigue).** Es una de las principales vías de salida de la amígdala: va desde su parte centromedial hasta el núcleo ventromedial del hipotálamo.
  - [Stria terminalis](https://en.wikipedia.org/wiki/Stria_terminalis): “Serving as a major output pathway of the amygdala, the stria terminalis runs from…”
