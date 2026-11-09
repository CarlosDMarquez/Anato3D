import { GRUPOS } from './grupos.js';
import { latinEtymology } from './musculos.js';
import { REGIONES_VASOS } from './regiones-vasos.js';
import { fuentesVaso } from './fuentes.js';

// Fichas de los sistemas arterial y venoso y del corazón. Cada tipo de vaso tiene una descripción
// general; los vasos y cavidades principales tienen ficha propia (clave: nombre inglés con «_»).

const TIPO = {
  artery: {
    tipo: 'Arteria', sangre: 'Rica en oxígeno',
    descripcion: 'Vaso que lleva la sangre desde el corazón hacia los tejidos. Sus paredes tienen músculo liso y tejido elástico para soportar la presión de la sangre.',
    datos: ['En el modelo, las arterias son rojas: salvo las pulmonares, llevan sangre rica en oxígeno.'],
  },
  pulmonary_artery: {
    tipo: 'Arteria pulmonar', sangre: 'Pobre en oxígeno',
    descripcion: 'Lleva sangre pobre en oxígeno desde el ventrículo derecho hacia los pulmones, donde se oxigena.',
    datos: ['En el modelo es azul porque, aunque es una arteria, lleva sangre pobre en oxígeno.'],
  },
  vein: {
    tipo: 'Vena', sangre: 'Pobre en oxígeno',
    descripcion: 'Vaso que devuelve la sangre de los tejidos al corazón. Sus paredes son más finas que las de las arterias, y muchas tienen válvulas que impiden que la sangre retroceda.',
    datos: ['En el modelo, las venas son azules: salvo las pulmonares, llevan sangre pobre en oxígeno.', 'En realidad, la sangre de las venas es de color rojo oscuro: las de la piel se ven azuladas por cómo la piel dispersa la luz y por cómo el cerebro procesa lo que vemos.'],
  },
  pulmonary_vein: {
    tipo: 'Vena pulmonar', sangre: 'Rica en oxígeno',
    descripcion: 'Devuelve la sangre recién oxigenada desde los pulmones hasta el atrio (aurícula) izquierdo.',
    datos: ['En el modelo es roja porque, aunque es una vena, lleva sangre rica en oxígeno.'],
  },
  heart: {
    tipo: 'Corazón',
    descripcion: 'Parte del corazón, el órgano muscular que bombea la sangre por los vasos sanguíneos. En reposo, el corazón adulto late unas 72 veces por minuto.',
    datos: [],
  },
  valve: {
    tipo: 'Válvula cardíaca',
    descripcion: 'Válvula del corazón: sus velos (valvas) se abren para dejar pasar la sangre y se cierran para que no retroceda, de modo que la sangre circula en un solo sentido.',
    datos: ['El cierre de las válvulas produce los ruidos del corazón que se oyen con el estetoscopio.'],
  },
};

const AORTA = 'La aorta es la arteria más grande del cuerpo: sale del ventrículo izquierdo y reparte la sangre oxigenada a todo el organismo.';
const CAVA_INF = {
  descripcion: 'Vena grande que lleva la sangre pobre en oxígeno de la parte inferior y media del cuerpo al atrio derecho.',
  datos: ['Atraviesa el diafragma a la altura de T8.', 'En el embarazo, el útero puede comprimirla, junto con la aorta, cuando la mujer se tumba boca arriba.'],
};
export const VASOS = {
  Ascending_aorta: { descripcion: `Primer tramo de la aorta, desde el ventrículo izquierdo hasta el arco. ${AORTA}`, datos: ['De su raíz salen las arterias coronarias, que irrigan el propio corazón.'] },
  Aortic_arch: { descripcion: `Parte de la aorta entre la aorta ascendente y la descendente. ${AORTA}`, datos: ['De él salen el tronco braquiocefálico, la carótida común izquierda y la subclavia izquierda.'] },
  Thoracic_aorta: { descripcion: `Tramo de la aorta que desciende por el tórax, junto a la columna. ${AORTA}`, datos: ['Atraviesa el diafragma a la altura de T12.'] },
  Abdominal_aorta: { descripcion: `Tramo de la aorta en el abdomen, hasta su división en las ilíacas comunes a la altura de L4. ${AORTA}`, datos: ['Su dilatación (aneurisma de aorta abdominal) puede palparse como una masa que late.'] },
  Pulmonary_trunk: { descripcion: 'Arteria gruesa que sale del ventrículo derecho y se divide en las arterias pulmonares derecha e izquierda.', datos: [] },
  Brachiocephalic_trunk: { descripcion: 'Primera rama del arco aórtico. Se divide en la carótida común y la subclavia derechas.', datos: ['Solo existe en el lado derecho.'] },
  Right_common_carotid_artery: { descripcion: 'Arteria del cuello que lleva sangre oxigenada a la cabeza y el cuello. Se divide en carótida interna (encéfalo) y externa (cara y cuello).', datos: ['Su pulso se toma palpando bajo el borde anterior del músculo esternocleidomastoideo, a la altura del borde superior del cartílago tiroides.'] },
  Left_common_carotid_artery: { descripcion: 'Arteria del cuello que lleva sangre oxigenada a la cabeza y el cuello. Sale directamente del arco aórtico y se divide en carótida interna y externa.', datos: ['Su pulso se toma palpando bajo el borde anterior del músculo esternocleidomastoideo, a la altura del borde superior del cartílago tiroides.'] },
  Internal_carotid_artery: { descripcion: 'Rama de la carótida común que irriga el encéfalo, incluidos los ojos.', datos: ['Si se desprende un trozo de la placa de ateroma que la estrecha, puede subir al encéfalo, tapar la circulación y causar un ictus isquémico.'] },
  Basilar_artery: { descripcion: 'Arteria formada por la unión de las dos vertebrales en la base del encéfalo. Irriga la protuberancia y el cerebelo.', datos: ['Con las dos vertebrales lleva sangre a la parte posterior del círculo arterial del cerebro (polígono de Willis).'] },
  Subclavian_artery: { descripcion: 'Arteria que pasa bajo la clavícula hacia el brazo; al cruzar la primera costilla pasa a llamarse axilar.', datos: [] },
  Brachial_artery: { descripcion: 'Arteria principal del brazo. Continúa a la axilar y en el codo se divide en radial y ulnar.', datos: ['Sobre ella se coloca el estetoscopio al medir la presión arterial.'] },
  Radial_artery: { descripcion: 'Arteria principal de la cara lateral del antebrazo. Termina en la mano formando el arco palmar profundo.', datos: ['En la muñeca es donde se toma habitualmente el pulso.'] },
  Femoral_artery: { descripcion: 'Arteria principal del muslo. Continúa a la ilíaca externa bajo el ligamento inguinal.', datos: ['Su pulso se palpa mejor en la cara interna del muslo, en el punto medio inguinal: a medio camino entre la sínfisis del pubis y la espina ilíaca anterosuperior.', 'Es una vía habitual para los cateterismos.'] },
  Popliteal_artery: { descripcion: 'Continuación profunda de la arteria femoral, que recorre la fosa poplítea. Se divide en las tibiales anterior y posterior.', datos: ['Su pulso suele explorarse con la persona boca abajo y la rodilla flexionada, para relajar la fascia poplítea y los isquiotibiales.'] },
  Dorsalis_pedis_artery: { descripcion: 'Continuación de la tibial anterior en el dorso del pie.', datos: ['Los médicos suelen explorarla para valorar si hay enfermedad vascular periférica.'] },
  Right_coronary_artery: { descripcion: 'Arteria que nace de la aorta y recorre el surco coronario derecho. Irriga el atrio y el ventrículo derechos y, en un 60 % de las personas, el nódulo sinusal.', datos: ['En cerca del 80 % de las personas da la arteria descendente posterior, que irriga la cara inferior del corazón.'] },
  Left_coronary_artery: { descripcion: 'Arteria que nace de la aorta y, tras recorrer de 10 a 25 mm, se divide en la interventricular anterior y la circunfleja. La interventricular anterior irriga el tabique y la pared anterior del ventrículo izquierdo; la circunfleja, su pared libre.', datos: [] },
  Anterior_interventricular_artery: { descripcion: 'Rama de la coronaria izquierda que baja por el surco interventricular anterior hasta la escotadura de la punta del corazón.', datos: ['Por su mal pronóstico, al infarto por obstrucción de su primer tramo se le llama en inglés «widow-maker» («el que deja viudas»).'] },
  Superior_vena_cava: { descripcion: 'Vena gruesa y corta (unos 24 mm de diámetro y 7 cm de largo) que recoge la sangre de la mitad superior del cuerpo y la lleva al atrio derecho.', datos: ['Se forma por la unión de las dos venas braquiocefálicas.'] },
  Inferior_vena_cava_abdominal_part: CAVA_INF,
  Inferior_vena_cava_thoracic_part: CAVA_INF,
  Internal_jugular_vein: { descripcion: 'Vena del cuello que recoge la sangre del encéfalo y de las partes superficiales de la cara y el cuello.', datos: ['Corre junto a la carótida común dentro de la vaina carotídea.', 'Es una vía habitual para colocar catéteres venosos centrales.'] },
  External_jugular_vein: { descripcion: 'Vena del cuello que cruza en diagonal el músculo esternocleidomastoideo, bajo el platisma.', datos: ['Normalmente se ve a través de la piel.'] },
  Median_cubital_vein: { descripcion: 'Vena superficial de la flexura del codo que une la cefálica con la basílica.', datos: ['Se usa de forma habitual para sacar sangre.'] },
  Cephalic_vein: { descripcion: 'Vena superficial del brazo que sube por su lado radial (lateral) y desemboca en la vena axilar.', datos: [] },
  Basilic_vein: { descripcion: 'Vena superficial que sube por el lado medial del brazo y se une a las venas braquiales.', datos: [] },
  Great_saphenous_vein: { descripcion: 'La vena más larga del cuerpo: sube por la cara medial de la pierna y el muslo desde el pie hasta la vena femoral.', datos: ['Se usa como injerto en la cirugía de bypass coronario.', 'Su dilatación forma varices.'] },
  Small_saphenous_vein: { descripcion: 'Vena superficial de la parte posterior de la pierna, que desemboca en la poplítea.', datos: [] },
  Femoral_vein: { descripcion: 'Vena profunda que acompaña a la arteria femoral dentro de la vaina femoral.', datos: ['Es un sitio frecuente de trombosis venosa profunda.'] },
  Hepatic_portal_vein: { descripcion: 'Vena que lleva al hígado la sangre del tubo digestivo, la vesícula biliar, el páncreas y el bazo. Esa sangre contiene los nutrientes, y también las toxinas, que se extraen de la digestión.', datos: ['Se forma detrás del cuello del páncreas por la unión de la vena esplénica y la mesentérica superior.'] },
  // Ovario y útero (solo en el modelo femenino: Z-Anatomy no los tiene; tools/female_vessels.py).
  Ovarian_artery: { descripcion: 'Arteria que lleva sangre oxigenada al ovario. Nace de la aorta abdominal, por debajo de la arteria renal, y recorre el ligamento suspensorio del ovario hasta el mesoovario. Una de sus ramas llega al lado del útero y se une a la arteria uterina.', datos: ['En el hombre le corresponde la arteria testicular.', 'Dentro del ligamento suspensorio del ovario va por delante de la vena ovárica y del uréter.'] },
  Uterine_artery: { descripcion: 'Principal arteria del útero. Suele nacer de la división anterior de la arteria ilíaca interna y llega al útero cruzando por delante del uréter. Da ramas para la vagina, la trompa y el ovario.', datos: ['En la histerectomía, el uréter puede lesionarse donde pasa por debajo de la arteria uterina, a menudo al pinzar a ciegas para cortar una hemorragia.', 'Aumenta mucho de calibre durante el embarazo.'] },
  Vaginal_branches_of_uterine_artery: { descripcion: 'Ramas de la arteria uterina que llevan sangre a la vagina. Se comunican con la arteria vaginal, que suele ser rama de la ilíaca interna.', datos: [] },
  Tubal_branch_of_uterine_artery: { descripcion: 'Rama de la arteria uterina que lleva sangre a la trompa uterina. La arteria ovárica también da pequeñas ramas a la trompa.', datos: [] },
  Ovarian_branch_of_uterine_artery: { descripcion: 'Ramas de la arteria uterina que llevan sangre al ovario. La arteria ovárica, por su parte, envía una rama al lado del útero que se une a la arteria uterina.', datos: [] },
  Left_ovarian_vein: { descripcion: 'Lleva la sangre pobre en oxígeno del ovario izquierdo. A diferencia de la derecha, a menudo desemboca en la vena renal izquierda y no en la cava inferior.', datos: ['La vena ovárica derecha, en cambio, recorre el ligamento suspensorio del ovario y en general desemboca en la cava inferior.'] },
  Right_ovarian_vein: { descripcion: 'Lleva la sangre pobre en oxígeno del ovario derecho. Recorre el ligamento suspensorio del ovario y en general desemboca en la vena cava inferior.', datos: ['La vena ovárica izquierda, en cambio, a menudo desemboca en la vena renal izquierda.'] },
  Uterine_venous_plexus: { descripcion: 'Red de venas a los lados del útero, entre las dos hojas del ligamento ancho. Se comunica con los plexos venosos ovárico y vaginal, y la drenan dos venas uterinas a cada lado.', datos: [] },
  Uterine_veins: { descripcion: 'Venas que llevan la sangre del plexo venoso uterino a la vena ilíaca interna. Siguen un trayecto parecido al de la arteria uterina.', datos: [] },
  Coronary_sinus: { descripcion: 'Vena del surco coronario, en la cara posterior del corazón, que recoge más de la mitad de la sangre pobre en oxígeno del músculo cardíaco y la vierte en el atrio derecho.', datos: [] },
  Superior_sagittal_sinus: { descripcion: 'Seno venoso impar de la duramadre, a lo largo del borde por el que se fija la hoz del cerebro. Recoge sangre de las caras laterales de los hemisferios cerebrales, y en él drena el líquido cefalorraquídeo, que así vuelve a la circulación venosa.', datos: [] },
  Right_atrium: { descripcion: 'Cavidad que recibe la sangre pobre en oxígeno de todo el cuerpo por las venas cavas y la pasa al ventrículo derecho.', datos: ['En su pared está el nódulo sinusal, el marcapasos natural del corazón.'] },
  Left_atrium: { descripcion: 'Cavidad que recibe la sangre oxigenada de las venas pulmonares derechas e izquierdas y la bombea al ventrículo izquierdo.', datos: ['En la fibrilación auricular, la orejuela izquierda tiembla en vez de contraerse y la sangre se estanca, lo que favorece que se formen coágulos.'] },
  Right_ventricle: { descripcion: 'Cavidad que bombea la sangre pobre en oxígeno hacia los pulmones por el tronco pulmonar.', datos: ['Su pared es más fina que la del ventrículo izquierdo, que bombea la sangre a casi todo el cuerpo; el derecho solo la envía a los pulmones.'] },
  Left_ventricle: { descripcion: 'Cavidad que bombea la sangre a la circulación sistémica a través de la aorta.', datos: ['En el adulto joven, su pared es de tres a seis veces más gruesa que la del ventrículo derecho.'] },
  // ── Ramas y troncos arteriales (fichas nuevas del 8 nov 2026) ──
  Anterior_cerebral_artery: { descripcion: 'Una de las dos arterias cerebrales anteriores, que llevan sangre oxigenada a la mayor parte de la zona media de los lóbulos frontales y a la parte superior y medial de los lóbulos parietales. Nacen de la carótida interna, forman parte del círculo arterial del cerebro (polígono de Willis) y las une la arteria comunicante anterior.', datos: ['Un ictus en su territorio causa debilidad y pérdida de sensibilidad en la pierna y el pie del lado opuesto, y cambios de conducta.'] },
  Coeliac_trunk: { descripcion: 'Primera gran rama de la aorta abdominal; mide alrededor de 1,27 cm. Sale de la aorta a la altura del disco entre T12 y L1 y es una de sus tres ramas anteriores, junto con las arterias mesentéricas superior e inferior.', datos: ['El pilar del diafragma puede comprimirlo con la respiración: es el síndrome del ligamento arcuato medio.'] },
  Common_hepatic_artery: { descripcion: 'Arteria corta que nace del tronco celíaco y lleva sangre oxigenada al hígado, al píloro del estómago, al duodeno, al páncreas y a la vesícula biliar.', datos: [] },
  Common_iliac_artery: { descripcion: 'Gran arteria del abdomen, una a cada lado. Nace de la bifurcación de la aorta a la altura de la cuarta vértebra lumbar y termina delante de la articulación sacroilíaca, donde se divide en las arterias ilíacas externa e interna.', datos: [] },
  External_carotid_artery: { descripcion: 'Principal arteria de la cabeza y de la parte alta del cuello. Nace de la carótida común y termina dentro de la glándula parótida, donde se divide en las arterias temporal superficial y maxilar.', datos: [] },
  External_iliac_artery: { descripcion: 'Gran arteria que nace de la ilíaca común delante de la articulación sacroilíaca de la pelvis. Pasa por debajo del ligamento inguinal y se convierte en la arteria femoral.', datos: ['En un trasplante de riñón suele ser la arteria a la que se une la arteria renal del riñón trasplantado.'] },
  Facial_artery: { descripcion: 'Rama de la carótida externa que lleva sangre a las estructuras superficiales de la parte media de la cara. Antes se llamaba arteria maxilar externa.', datos: ['Puede dañarse en la cirugía maxilofacial, y entonces suele sangrar mucho.'] },
  Inferior_mesenteric_artery: { descripcion: 'Tercera rama principal de la aorta abdominal; nace a la altura de L3. Irriga el intestino grueso desde la parte final del colon transverso hasta la parte alta del conducto anal: el colon descendente, el colon sigmoide y parte del recto.', datos: ['En la hemicolectomía izquierda hay que extirpar esta arteria o sus ramas.', 'El riñón en herradura, una anomalía frecuente (1 de cada 500 personas), queda por debajo de esta arteria.'] },
  Internal_iliac_artery: { descripcion: 'Principal arteria de la pelvis; antes se llamaba arteria hipogástrica. Nace de la arteria ilíaca común.', datos: [] },
  Renal_artery: { descripcion: 'Arteria que lleva la sangre al riñón; hay una a cada lado. Por las arterias renales puede pasar hasta un tercio de toda la sangre que bombea el corazón, para que los riñones la filtren.', datos: ['Su estrechamiento (estenosis) causa hipertensión: el riñón afectado libera renina para subir la presión y mantener su riego.'] },
  Middle_cerebral_artery_M1_segment: { descripcion: 'Primer tramo (M1 o segmento esfenoidal) de la arteria cerebral media, una de las tres grandes arterias pares que irrigan el cerebro. La arteria nace de la carótida interna, entra en el surco lateral y allí se ramifica hacia gran parte de la cara lateral de la corteza cerebral; también irriga la parte anterior de los lóbulos temporales y la ínsula.', datos: ['Del segmento M1 salen numerosas arterias pequeñas (lenticuloestriadas laterales) que irrigan los núcleos de la base.', 'No se considera parte del círculo arterial del cerebro (polígono de Willis).'] },
  Splenic_artery: { descripcion: 'Arteria que lleva sangre oxigenada al bazo. Nace del tronco celíaco y va por encima del páncreas con un trayecto muy tortuoso.', datos: ['Sus aneurismas son raros, pero son los terceros más frecuentes del abdomen, tras los de la aorta abdominal y las arterias ilíacas.'] },
  Superficial_temporal_artery: { descripcion: 'Arteria importante de la cabeza. Nace de la carótida externa, cuando esta se divide en las arterias temporal superficial y maxilar.', datos: ['Su pulso se nota por encima del arco cigomático, delante y por encima del trago de la oreja.', 'Suele afectarse en la arteritis de células gigantes, y se biopsia cuando se sospecha esta enfermedad.'] },
  Superior_mesenteric_artery: { descripcion: 'Arteria que nace de la cara anterior de la aorta abdominal, justo por debajo del tronco celíaco. Irriga el intestino desde la parte baja del duodeno hasta los dos tercios del colon transverso, y también el páncreas.', datos: ['Su obstrucción brusca casi siempre deja sin riego el intestino, y hasta el 80 % de estas obstrucciones causan la muerte.', 'Puede comprimir la vena renal izquierda contra la aorta: es el síndrome del cascanueces.'] },
  Anterior_tibial_artery: { descripcion: 'Arteria de la pierna que nace de la poplítea y lleva sangre al compartimento anterior de la pierna y al dorso del pie. Continúa en el dorso del pie como arteria dorsal del pie.', datos: ['Como pasa por dentro del cuello de la fíbula, puede dañarse en una osteotomía de la tibia.'] },
  Deep_femoral_artery: { descripcion: 'Gran rama de la arteria femoral que va más profunda que el resto de la femoral. Da las arterias circunflejas femorales lateral y medial y las arterias perforantes, y termina en el muslo.', datos: [] },
  Fibular_artery: { descripcion: 'Arteria que nace del tronco tibiofibular y lleva sangre al compartimento lateral de la pierna. También se llama arteria peronea.', datos: [] },
  Posterior_tibial_artery: { descripcion: 'Arteria del miembro inferior que lleva sangre al compartimento posterior de la pierna y a la planta del pie. Nace de la poplítea a través del tronco tibiofibular y pasa justo por detrás del maléolo medial.', datos: ['Su pulso se palpa fácilmente a medio camino entre el borde posterior del maléolo medial y el tendón de Aquiles.'] },
  Posterior_cerebral_artery: { descripcion: 'Una de las dos arterias cerebrales posteriores, que llevan sangre oxigenada al lóbulo occipital y a las caras medial e inferior del lóbulo temporal. Nacen del final de la arteria basilar, que se divide en las dos, y se comunican con las cerebrales medias y las carótidas internas a través de las arterias comunicantes posteriores.', datos: [] },
  Vertebral_artery: { descripcion: 'Gran arteria del cuello, una a cada lado. Suele nacer de la subclavia, sube por el cuello y, dentro del cráneo, se une a la del otro lado para formar la arteria basilar. Lleva sangre a la parte alta de la médula espinal, al tronco del encéfalo, al cerebelo y a la parte posterior del encéfalo.', datos: ['La manipulación quiropráctica del cuello puede causar su disección.'] },
  Axillary_artery: { descripcion: 'Gran arteria que lleva sangre oxigenada a la cara lateral del tórax, a la axila y al miembro superior. Empieza en el borde lateral de la primera costilla, donde la subclavia cambia de nombre, y al pasar el borde inferior del músculo redondo mayor pasa a llamarse arteria braquial.', datos: ['Se puede pinzar sin poner en peligro el brazo, pero solo antes del origen de la arteria subescapular: la red de arterias que rodea la escápula lleva la sangre al brazo por otro camino.'] },
  Internal_thoracic_artery: { descripcion: 'Arteria que irriga la pared anterior del tórax y las mamas; también se llama arteria mamaria interna. Hay una a cada lado del esternón, y al final se divide en las arterias epigástrica superior y musculofrénica.', datos: ['Es el vaso que prefieren los cirujanos cardíacos para los bypass coronarios.'] },
  Deep_palmar_arch: { descripcion: 'Red arterial de la palma de la mano. La forma sobre todo el final de la arteria radial, con la contribución de la ulnar; el arco palmar superficial, en cambio, lo forma sobre todo la ulnar.', datos: [] },
  Superficial_palmar_arch: { descripcion: 'Arco arterial de la palma de la mano formado sobre todo por la arteria ulnar, con la contribución de la rama palmar superficial de la radial. Cruza la palma en curva, con la convexidad hacia los dedos.', datos: [] },
  Ulnar_artery: { descripcion: 'Arteria principal de la cara medial del antebrazo. Es la mayor de las dos ramas en que se divide la braquial, un poco por debajo del pliegue del codo, y termina en el arco palmar superficial.', datos: ['Se palpa en la cara anterior y medial de la muñeca.'] },
  Circumflex_artery_of_heart: { descripcion: 'Rama de la arteria coronaria izquierda que rodea el lado izquierdo del corazón por el surco coronario e irriga la parte posterolateral del ventrículo izquierdo.', datos: ['En una minoría de personas da la arteria interventricular posterior: se dice entonces que el corazón tiene dominancia izquierda.'] },
  Anterior_communicating_artery: { descripcion: 'Vaso del encéfalo que une las dos arterias cerebrales anteriores, la derecha y la izquierda.', datos: ['Sus aneurismas son los más frecuentes del círculo arterial del cerebro (polígono de Willis).'] },
  Posterior_communicating_artery: { descripcion: 'Pequeña arteria de la base del encéfalo, una a cada lado, que forma parte del círculo arterial del cerebro (polígono de Willis). Por delante se une a la carótida interna y por detrás, a la cerebral posterior; con la comunicante anterior forma un sistema de circulación colateral en el encéfalo.', datos: ['Sus aneurismas son los terceros más frecuentes del polígono de Willis y pueden paralizar el nervio oculomotor.'] },
  Ophthalmic_artery: { descripcion: 'Arteria de la cabeza: es la primera rama de la carótida interna después del seno cavernoso. Sus ramas irrigan todas las estructuras de la órbita que rodean el ojo y algunas de la nariz, la cara y las meninges.', datos: ['Su obstrucción, o la de sus ramas, puede poner en peligro la vista.'] },
  Middle_meningeal_artery: { descripcion: 'Rama de la arteria maxilar que entra en el cráneo por el foramen espinoso e irriga la duramadre y la bóveda del cráneo. Es la mayor de las tres arterias que irrigan las meninges.', datos: ['Su rama anterior pasa bajo el pterion, donde el cráneo es fino; un golpe en la cabeza puede romperla, y su lesión es la causa más frecuente de hematoma epidural.'] },
  Maxillary_artery: { descripcion: 'Arteria que irriga las estructuras profundas de la cara. Nace de la carótida externa, por dentro del cuello de la mandíbula.', datos: [] },
  Left_gastric_artery: { descripcion: 'Arteria que nace del tronco celíaco y recorre la parte alta de la curvatura menor del estómago hasta unirse con la arteria gástrica derecha. También da ramas para la parte baja del esófago.', datos: ['Si una úlcera péptica erosiona una de sus ramas, puede causar una gran hemorragia en el estómago, con vómitos de sangre o heces negras.'] },
  Gastroduodenal_artery: { descripcion: 'Pequeña arteria del abdomen que lleva sangre al píloro y a la primera parte del duodeno, y de forma indirecta a la cabeza del páncreas.', datos: ['Puede sangrar mucho como complicación de una úlcera péptica.'] },
  Testicular_artery: { descripcion: 'Rama de la aorta abdominal que lleva sangre al testículo; hay una para cada testículo. Nace de la parte anterior de la aorta, un poco por debajo de las arterias renales, y baja por detrás del peritoneo, apoyada en el músculo psoas mayor.', datos: ['Es la equivalente masculina de la arteria ovárica; como el testículo está en otro lugar, su trayecto es distinto.', 'Puede dañarse al operar una hernia inguinal, lo que a veces atrofia poco a poco el testículo.'] },
  Inferior_epigastric_artery: { descripcion: 'Arteria que nace de la ilíaca externa y sube, junto con su vena, por el pliegue umbilical lateral. Después entra en la vaina del músculo recto del abdomen y allí se une con la arteria epigástrica superior.', datos: ['El pliegue umbilical lateral marca el borde del triángulo de Hesselbach, por donde salen las hernias inguinales directas.'] },
  Deep_brachial_artery: { descripcion: 'Gran arteria del brazo que nace de la braquial, baja por el brazo y termina uniéndose a la arteria recurrente radial.', datos: [] },
  Plantar_arch: { descripcion: 'Arco arterial que irriga la planta del pie; va desde el quinto metatarsiano hasta el primero. Lo forman la arteria plantar lateral y la rama plantar profunda de la arteria dorsal del pie, que se unen entre las bases del primer y el segundo metatarsianos.', datos: [] },
  // ── Venas y senos venosos (fichas nuevas del 8 nov 2026) ──
  Great_cardiac_vein: { descripcion: 'Vena del corazón, también llamada vena coronaria izquierda. Empieza en la punta del corazón, sube por el surco interventricular anterior y, en la cara posterior del corazón, se une a la vena oblicua del atrio izquierdo para formar el seno coronario.', datos: [] },
  Middle_cardiac_vein: { descripcion: 'Vena del corazón que empieza en la punta y va hacia atrás por el surco interventricular inferior hasta el seno coronario, cerca de su desembocadura.', datos: ['Sirve para llegar desde la superficie del corazón a la cara inferior de los ventrículos.'] },
  Sigmoid_sinus: { descripcion: 'Seno venoso de la duramadre con forma de S, uno a cada lado del cráneo. Recibe la sangre del seno transverso y la lleva hacia la vena yugular interna.', datos: [] },
  Transverse_sinus: { descripcion: 'Uno de los dos senos transversos, conductos situados bajo el encéfalo que drenan la sangre de la parte posterior de la cabeza. Corre por un surco de la cara interna del hueso occipital, desde la confluencia de los senos hasta el seno sigmoideo, que acaba en la vena yugular interna.', datos: [] },
  Cavernous_sinus: { descripcion: 'Seno venoso de la duramadre situado a cada lado de la silla turca, entre el hueso temporal y el esfenoides.', datos: ['Es el único lugar del cuerpo donde una arteria, la carótida interna, atraviesa por completo una estructura venosa; si se rompe dentro de él, se forma una fístula carótido-cavernosa.'] },
  Straight_sinus: { descripcion: 'Conducto venoso del interior del cráneo, bajo el encéfalo. Recibe la sangre del seno sagital inferior y de la vena cerebral magna, y la lleva a la confluencia de los senos.', datos: [] },
  Dorsal_venous_arch_of_foot: { descripcion: 'Vena superficial del dorso del pie que une la vena safena menor con la safena mayor. Está sobre los metatarsianos, a medio camino entre el tobillo y las articulaciones metatarsofalángicas.', datos: ['Suele ser fácil de palpar y de ver con el pie descalzo.'] },
  Popliteal_vein: { descripcion: 'Vena del miembro inferior que drena la sangre de la pierna. La forman las venas tibiales anterior y posterior; va por dentro de la arteria poplítea y se continúa con la vena femoral.', datos: ['Se puede ver con ecografía Doppler, y en ella pueden formarse trombos.'] },
  Azygos_vein: { descripcion: 'Vena que sube por el lado derecho de la columna torácica y desemboca en la vena cava superior. Une los territorios de las dos venas cavas, así que puede llevar la sangre al atrio derecho por otro camino si una de ellas se obstruye.', datos: ['Su nombre viene del griego ázygos, «sin pareja».'] },
  Hemi_azygos_vein: { descripcion: 'Vena que sube por la parte baja del tórax, justo a la izquierda de la columna vertebral. Con la vena hemiácigos accesoria hace en el lado izquierdo el papel de la ácigos: drena la mayoría de las venas intercostales posteriores izquierdas.', datos: [] },
  Common_iliac_vein: { descripcion: 'Vena que drena la sangre de la pelvis y del miembro inferior. La forman las venas ilíacas externa e interna. Las dos venas ilíacas comunes se unen a la altura de la quinta vértebra lumbar para formar la vena cava inferior.', datos: ['La arteria ilíaca común derecha puede comprimir la vena ilíaca común izquierda contra la quinta vértebra lumbar: es el síndrome de May-Thurner.'] },
  External_iliac_vein: { descripcion: 'Gran vena que une la vena femoral con la ilíaca común. Empieza en el borde inferior del ligamento inguinal y termina al unirse con la vena ilíaca interna; la acompaña la arteria ilíaca externa.', datos: [] },
  Internal_iliac_vein: { descripcion: 'También llamada vena hipogástrica, empieza cerca de la parte alta del foramen ciático mayor y sube por detrás de la arteria ilíaca interna. En el borde de la pelvis se une a la vena ilíaca externa para formar la ilíaca común.', datos: ['Si una trombosis corta el paso por las venas ilíacas externas, sus afluentes son un camino importante de vuelta para la sangre de la pierna.'] },
  Hepatic_veins: { descripcion: 'Venas que llevan la sangre del hígado a la vena cava inferior; la vena porta, en cambio, lleva al hígado la sangre del tubo digestivo. Suele haber tres grandes venas hepáticas superiores, de las partes izquierda, media y derecha del hígado, y de 6 a 20 inferiores; ninguna tiene válvulas.', datos: ['Su obstrucción, por ejemplo por un coágulo, causa el síndrome de Budd-Chiari: dolor abdominal, ascitis y aumento del tamaño del hígado.'] },
  Inferior_mesenteric_vein: { descripcion: 'Vena que drena la sangre del intestino grueso. Suele terminar en la vena esplénica, que después forma la vena porta con la mesentérica superior.', datos: ['Si se desgarra en una cirugía del páncreas, se puede ligar: otras venas también drenan el intestino grueso.'] },
  Superior_mesenteric_vein: { descripcion: 'Vena que drena la sangre del intestino delgado (yeyuno e íleon); va a la derecha de la arteria mesentérica superior. Detrás del cuello del páncreas se une con la vena esplénica para formar la vena porta, que lleva la sangre al hígado.', datos: ['Su trombosis es rara, pero es una causa importante de isquemia mesentérica y puede ser mortal.'] },
  Splenic_vein: { descripcion: 'Vena que drena la sangre del bazo, del fondo del estómago y de parte del páncreas. Forma parte del sistema porta del hígado.', datos: ['Su trombosis puede causar varices en la pared del estómago.'] },
  Left_brachiocephalic_vein: { descripcion: 'Gran vena de la parte alta del tórax que se forma detrás de la articulación esternoclavicular izquierda, al unirse la yugular interna y la subclavia izquierdas. Mide más del doble que la derecha, y las dos se unen para formar la vena cava superior.', datos: ['Antes se llamaban venas innominadas.'] },
  Right_brachiocephalic_vein: { descripcion: 'Gran vena de la parte alta del tórax que se forma detrás de la articulación esternoclavicular derecha, al unirse la yugular interna y la subclavia derechas. La izquierda mide más del doble que ella, y las dos se unen para formar la vena cava superior.', datos: ['Antes se llamaban venas innominadas.'] },
  Left_renal_vein: { descripcion: 'Gran vena que lleva a la cava inferior la sangre ya filtrada por el riñón izquierdo; la forman las venas interlobares del riñón. Es más larga que la derecha porque la vena cava inferior está en la mitad derecha del cuerpo.', datos: ['Puede quedar atrapada entre la arteria mesentérica superior y la aorta: es el síndrome del cascanueces.', 'En la mujer, a menudo recibe la vena ovárica izquierda.'] },
  Right_renal_vein: { descripcion: 'Gran vena que lleva a la cava inferior la sangre ya filtrada por el riñón derecho; la forman las venas interlobares del riñón. Es más corta que la izquierda porque la vena cava inferior está en la mitad derecha del cuerpo.', datos: [] },
  Subclavian_vein: { descripcion: 'Gran vena, una a cada lado, que drena la sangre del miembro superior para que vuelva al corazón. Mide de 1 a 2 cm de diámetro.', datos: ['La izquierda recibe la linfa del conducto torácico, y con ella pasan a la sangre las grasas absorbidas.'] },
  Axillary_vein: { descripcion: 'Gran vena que lleva hacia el corazón la sangre de la cara lateral del tórax, de la axila y del miembro superior; hay una a cada lado. Se forma por la unión de las venas braquiales con la vena basílica.', datos: [] },
  Brachial_veins: { descripcion: 'Venas profundas que acompañan a la arteria braquial en el brazo. Empiezan donde se unen las venas radiales y ulnares, y en el borde inferior del músculo redondo mayor se unen a la vena basílica para formar la vena axilar.', datos: ['Reciben pequeñas venas de los músculos del brazo, como el bíceps y el tríceps.'] },
  Dorsal_venous_network_of_hand: { descripcion: 'Red de venas del dorso de la mano, formada por las venas metacarpianas dorsales y por venas digitales dorsales del índice, del meñique y del pulgar. De ella nacen las venas cefálica y basílica.', datos: [] },
  Facial_vein: { descripcion: 'Vena relativamente grande de la cara. Empieza junto a la raíz de la nariz, como continuación de la vena angular, y va por detrás de la arteria facial con un trayecto menos tortuoso. Termina uniéndose a la rama anterior de la vena retromandibular o directamente en la vena yugular interna.', datos: ['Las infecciones de la cara pueden extenderse por ella hasta los senos venosos de la duramadre; un coágulo infectado puede llegar al seno cavernoso.'] },
  Retromandibular_vein: { descripcion: 'Vena importante de la cara que se forma dentro de la glándula parótida, al unirse las venas maxilar y temporal superficial. Al salir de la glándula se divide en dos ramas: la anterior se une a la vena facial y la posterior forma, con la auricular posterior, la vena yugular externa.', datos: [] },
};

const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const parse = (s) => {
  try { return JSON.parse(s || '[]'); } catch { return []; }
};

export function resolveVessel(name, x) {
  const side = /_L$/.test(name) ? 'L' : /_R$/.test(name) ? 'R' : null;
  const region = parse(x.region);
  const key = String(x.name_en ?? '').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '');
  // Ficha propia; si la pieza lleva lado en el nombre («Left subclavian artery»), la de la estructura sin lado.
  const sinLado = cap(key.replace(/^(Right|Left)_/, ''));
  const clave = VASOS[key] ? key : VASOS[sinLado] ? sinLado : null;
  const own = clave ? VASOS[clave] : null;
  const tipoKey = TIPO[x.tissue] ? x.tissue : 'artery';
  const tipo = TIPO[tipoKey];
  const group = [...region].reverse().map((g) => GRUPOS[g]).find(Boolean);
  return {
    key: x.name_en,
    side,
    title: cap(x.name_es || x.name_en),
    latin: x.name_la || null,
    tissue: null,
    chips: [tipo.tipo, x.major && x.tissue !== 'heart' && x.tissue !== 'valve' && 'Vaso principal', side && (side === 'L' ? 'Lado izquierdo' : 'Lado derecho')].filter(Boolean),
    fields: [
      // Región real del cuerpo (tools/vessel_regions.py); las colecciones de Z-Anatomy («Aorta»…) solo como reserva.
      (REGIONES_VASOS[key] ?? group) && { label: 'Región', value: REGIONES_VASOS[key] ?? group.nombreEs ?? group.nombre },
      tipo.sangre && { label: 'Sangre', value: tipo.sangre },
    ].filter(Boolean),
    entry: {
      descripcion: own?.descripcion ?? tipo.descripcion,
      etimologia: latinEtymology(x.name_la),
    },
    datos: [...(own?.datos ?? []), ...tipo.datos],
    source: x.source ?? null,
    // El texto del tipo se ve si no hay ficha propia o si el tipo tiene puntos clave (se suman a los de la ficha).
    fuentes: fuentesVaso(clave, tipoKey, !own?.descripcion || tipo.datos.length > 0),
  };
}
