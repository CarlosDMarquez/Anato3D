// Fichas centrales del sistema linfático: troncos y conductos, colectores regionales (esquemáticos), órganos linfoides
// (bazo, timo y amígdalas) y la ficha general del nodo, que ven los grupos de nodos sin ficha propia. También las
// descripciones de los grupos (GRUPOS_LINF). BORRADOR redactado con IA a partir de las fuentes citadas, sin revisión de
// un especialista. Cada frase lleva la cita literal que la respalda (comprobada con scripts/linfatico-citas.mjs).
import { W, ES, TA, MODELO } from './formato.js';

// ── Frases que se repiten ──
const NOMBRE_DESCRIPTIVO = ['Su nombre latino es descriptivo: la Terminologia Anatomica solo tiene términos para los vasos linfáticos en general, superficiales o profundos, y no para los colectores de cada región.', TA(3915), TA(3916), TA(3917), MODELO];
const COLECTOR_GENERAL = [
  ['Los vasos que llevan la linfa hacia un nodo se llaman aferentes, y los que salen de él, eferentes.', W('Lymphatic_vessel', 'Lymph vessels that carry lymph to a lymph node are called afferent lymph vessels, and those that carry it from a lymph node are called efferent lymph vessels')],
  ['Sus paredes se contraen y tienen válvulas que impiden que la linfa retroceda.', W('Lymphatic_vessel', 'as well as valves to prevent the lymph from flowing backwards')],
];
// `impar`: una sola pieza para los dos lados (mediastino y abdomen); si no, una pieza por lado.
const malla = (que, { impar = false } = {}) => [`En este modelo es una malla esquemática${impar ? ', una sola pieza para los dos lados,' : ' por lado'} que une ${que}: no reproduce vasos concretos medidos en una persona.`, MODELO];
const ORGANO_GENERADO = ['Z-Anatomy no la incluye: si aparece en el modelo, es una forma generada para Anato3D, con tamaño y posición esquemáticos.', MODELO];
const SIN_AFERENTES = 'Ninguna de las fuentes libres consultadas dice qué vasos linfáticos llegan a ella; no se afirma nada.';

const FICHAS = {
  // ── Conductos y cisterna ──
  Thoracic_duct: {
    tipo: 'conducto', ta2: 5137, chips: ['Conducto linfático'],
    descripcion: [
      ['Es el mayor de los dos conductos linfáticos; el otro es el conducto linfático derecho.', W('Thoracic_duct', 'is the larger of the two lymph ducts of the lymphatic system (the other being the right lymphatic duct)')],
      ['Recoge la linfa de casi todo el cuerpo: todo salvo el miembro superior derecho y la mitad derecha de la cabeza, el cuello y el tórax, que drenan en el conducto linfático derecho.', W('Thoracic_duct', 'It also collects most of the lymph in the body other than from the right thorax, arm, head, and neck'), W('Lymph_duct', 'The right lymphatic duct drains lymph from the right upper limb, right side of thorax and right halves of head and neck.'), ES('Conducto_torácico', 'recoge la mayor parte de la linfa del cuerpo, exceptuando el cuadrante superior derecho')],
      ['Lleva quilo, un líquido con linfa y grasas emulsionadas, y no linfa pura.', W('Thoracic_duct', 'The thoracic duct carries chyle, a liquid containing both lymph and emulsified fats, rather than pure lymph.')],
      ['En el adulto mide de 38 a 45 cm de largo y unos 5 mm de diámetro medio.', W('Thoracic_duct', 'In adults, the thoracic duct is typically 38–45 cm in length and has an average diameter of about 5 mm.')],
    ],
    localizacion: [
      ['Empieza en el extremo superior de la cisterna del quilo, a la altura de la vértebra T12.', W('Thoracic_duct', 'The thoracic duct commences at the upper extremity of the cisterna chyli at the level of the T12 vertebra.')],
      ['Sale del abdomen por el hiato aórtico del diafragma y sube primero por el mediastino posterior y después por el superior, hasta la raíz del cuello.', W('Thoracic_duct', 'passing out of the abdomen through the aortic hiatus into first the posterior mediastinum and then the superior mediastinum, extending as high up as the root of the neck')],
      ['Hacia la vértebra T5 cruza la línea media hacia la izquierda, y en el cuello sube hasta 2 o 3 cm por encima de la clavícula, a la altura de C7, antes de bajar a su desembocadura.', W('Thoracic_duct', 'It crosses the midline to the left side at about the T5 level'), W('Thoracic_duct', 'reaching 2–3 cm superior to the clavicle, as high up as the C7 vertebral level')],
    ],
    reparo: [
      ['En el mediastino posterior sube entre la aorta torácica descendente, a su izquierda, y la vena ácigos, a su derecha.', W('Thoracic_duct', 'It ascends the posterior mediastinum between the descending thoracic aorta (to its left) and the azygos vein (to its right)')],
      ['A la altura de T7 está detrás del esófago.', W('Thoracic_duct', 'is situated posterior to the esophagus at the T7 vertebral level')],
      ['En el cuello pasa por detrás de la arteria carótida común izquierda, del nervio vago y de la vena yugular interna; a la altura de C7 queda por detrás y por fuera de la vaina carotídea.', W('Thoracic_duct', 'It passes posterior to the left common carotid artery, vagus nerve (CN X), and internal jugular vein.'), W('Thoracic_duct', 'At C7 level, it lies posterolaterally to the carotid sheath.')],
    ],
    recibe: [
      ['Nace de la cisterna del quilo, a la que llegan el tronco intestinal y los dos troncos lumbares.', W('Cisterna_chyli', 'into which lymph from the intestinal trunk and two lumbar lymphatic trunks flow')],
      ['Recibe los vasos de los nodos intercostales: los de los espacios inferiores llegan a la cisterna o al comienzo del conducto, y los de los espacios superiores del lado izquierdo terminan en él.', W('Intercostal_lymph_nodes', 'opens either into the cisterna chyli or into the commencement of the thoracic duct'), W('Intercostal_lymph_nodes', 'The efferents of the glands in the upper spaces of the left side end in the thoracic duct')],
      ['En el lado izquierdo pueden unirse a él los troncos yugular, subclavio y broncomediastínico, aunque también pueden desembocar directamente en las venas.', W('Jugular_trunk', 'On the left side it joins the thoracic duct.'), W('Subclavian_trunk', 'on the left side it may end in the thoracic duct'), W('Bronchomediastinal_trunk', 'The left bronchomediastinal lymph trunk often empties into the thoracic duct or directly into the venous angle')],
    ],
    drena: [
      ['Suele desembocar en el ángulo venoso izquierdo, donde la vena subclavia izquierda y la yugular interna izquierda se unen para formar la vena braquiocefálica izquierda.', W('Thoracic_duct', 'The thoracic duct usually drains into the systemic (blood) circulation at the left venous angle where left subclavian and left internal jugular veins unite to form the left brachiocephalic vein.')],
      ['En más del 95 % de las personas termina en el ángulo venoso, en la yugular interna o en la subclavia; en una minoría, en otras venas.', W('Thoracic_duct', 'In over 95% of individuals, the thoracic duct ends by draining either at the venous angle, or into the internal jugular vein, or the subclavian vein')],
      ['En su unión con la vena tiene dos válvulas que impiden que la sangre entre en el conducto.', W('Thoracic_duct', 'There are also two valves at the junction of the duct with the left subclavian vein, to prevent the flow of venous blood into the duct.')],
    ],
    modelo: [
      ['En este modelo es un tubo generado para Anato3D (Z-Anatomy no lo incluye) con trazado esquemático: sigue los reparos de las fuentes, pero su recorrido y su grosor no se han medido en una persona.', MODELO],
      ['Se representa la variante clásica: un solo conducto que nace de la cisterna del quilo y termina en el ángulo venoso izquierdo.', MODELO],
      ['Esa anatomía característica solo se encuentra en alrededor de la mitad de las personas.', W('Thoracic_duct', 'The characteristic anatomy of the thoracic duct is present in only about half of individuals.')],
    ],
    notas: [
      ['Si se rompe o se bloquea, la linfa se acumula en la cavidad pleural: es el quilotórax.', W('Thoracic_duct', 'When the duct ruptures, the resulting flood of liquid into the pleural cavity is known as chylothorax.')],
      ['El aumento del nodo de Virchow, un nodo supraclavicular izquierdo cercano a su desembocadura, puede ser la primera señal de un cáncer, sobre todo abdominal.', W('Thoracic_duct', "The first sign of a malignancy, especially an intra-abdominal one, may be an enlarged Virchow's node")],
      ['En el adulto transporta hasta 4 litros de linfa al día.', W('Thoracic_duct', 'In adults, the thoracic duct transports up to 4 L of lymph per day.')],
    ],
    vias: { recibe: ['Cisterna_chyli', 'Intercostal_nodes', 'Jugular_trunk', 'Subclavian_trunk', 'Bronchomediastinal_trunk'], drena: ['Left_subclavian_vein', 'Internal_jugular_vein'] },
  },
  Cisterna_chyli: {
    tipo: 'cisterna', ta2: 5145, chips: ['Variante elegida'],
    descripcion: [
      ['Saco dilatado en el extremo inferior del conducto torácico, al que llega la linfa del tronco intestinal y de los dos troncos lumbares.', W('Cisterna_chyli', 'is a dilated sac at the lower end of the thoracic duct in most mammals into which lymph from the intestinal trunk and two lumbar lymphatic trunks flow')],
      ['Recibe de los intestinos el quilo, rico en grasas.', W('Cisterna_chyli', 'It receives fatty chyle from the intestines')],
      ['Es una estructura retroperitoneal.', W('Cisterna_chyli', 'The cisterna chyli is a retroperitoneal structure.')],
      ['En la Terminologia Anatomica su nombre figura entre paréntesis.', TA(5145)],
    ],
    localizacion: [
      ['Está detrás de la aorta abdominal, sobre la cara anterior de los cuerpos de las vértebras L1 y L2.', W('Cisterna_chyli', 'is located posterior to the abdominal aorta on the anterior aspect of the bodies of the first and second lumbar vertebrae (L1 and L2)')],
    ],
    reparo: [
      ['La aorta abdominal, por delante, y los cuerpos de L1 y L2, por detrás; de su extremo superior sale el conducto torácico hacia el hiato aórtico del diafragma.', W('Cisterna_chyli', 'is located posterior to the abdominal aorta on the anterior aspect of the bodies of the first and second lumbar vertebrae (L1 and L2)'), W('Cisterna_chyli', 'There it forms the beginning of the primary lymph vessel, the thoracic duct, which transports lymph and chyle from the abdomen via the aortic opening of the diaphragm')],
    ],
    recibe: [
      ['Recibe el tronco intestinal y los troncos lumbares derecho e izquierdo.', ES('Cisterna_del_quilo', 'proveniente de tres vasos linfáticos mayores (el tronco intestinal y los troncos lumbares)')],
      ['Los troncos lumbares le traen la linfa de los miembros inferiores, de las paredes y las vísceras de la pelvis, de los riñones y de las glándulas suprarrenales.', W('Lumbar_trunk', 'They receive the lymph from the lower limbs, from the walls and viscera of the pelvis, from the kidneys and suprarenal glands')],
    ],
    drena: [
      ['Se continúa hacia arriba con el conducto torácico.', ES('Cisterna_del_quilo', 'se continua superiormente por el conducto torácico')],
    ],
    modelo: [
      ['En este modelo se representa la variante con cisterna, como un saco alargado de forma esquemática generado para Anato3D.', MODELO],
      ['La cisterna falta en alrededor de la mitad de las personas; en ellas puede haber, en su lugar, una dilatación de los troncos lumbares.', W('Thoracic_duct', 'A cisterna chyli is absent in about half of individuals'), W('Thoracic_duct', 'dilation of the lumbar trunks may be present instead')],
    ],
    vias: { recibe: ['Lumbar_trunk', 'Intestinal_trunks'], drena: ['Thoracic_duct'] },
  },
  Right_lymphatic_duct: {
    tipo: 'conducto', ta2: 5132, latin: 'Ductus lymphaticus dexter', chips: ['Conducto linfático', 'Variante elegida'],
    descripcion: [
      ['Vaso linfático corto que recoge la linfa del miembro superior derecho y de la mitad derecha del tórax, la cabeza y el cuello.', W('Lymph_duct', 'The right lymphatic duct drains lymph from the right upper limb, right side of thorax and right halves of head and neck.')],
      ['Mide alrededor de 1,25 cm de largo.', W('Right_lymphatic_duct', 'It is approximately 1.25 cm long.')],
      ['Todo el resto del cuerpo drena en el conducto torácico.', W('Right_lymphatic_duct', 'All other sections of the human body are drained by the thoracic duct.')],
    ],
    localizacion: [
      ['Está en la raíz del cuello, en el lado derecho, junto a la vena subclavia derecha y la yugular interna derecha.', W('Right_lymphatic_duct', 'courses along the medial border of the anterior scalene at the root of the neck'), W('Right_lymphatic_duct', 'It forms various combinations with the right subclavian vein and right internal jugular vein.')],
    ],
    reparo: [
      ['Sigue el borde medial del músculo escaleno anterior.', W('Right_lymphatic_duct', 'courses along the medial border of the anterior scalene')],
    ],
    recibe: [
      ['Se forma por la unión de los troncos yugular, subclavio y broncomediastínico derechos.', ES('Conducto_linfático_derecho', 'Se forma por la unión de 3 ramas, el tronco yugular, el subclavio y el broncomediastínico derecho.')],
      ['En algunas personas recibe también linfa del lóbulo inferior del pulmón izquierdo.', W('Right_lymphatic_duct', 'also, in some individuals, the lower lobe of the left lung')],
    ],
    drena: [
      ['Desemboca en el ángulo venoso derecho, la unión de la vena yugular interna y la subclavia derechas.', W('Venous_angle', 'the right lymphatic duct drains at the right venous angle'), W('Venous_angle', 'is the junction where the ipsilateral internal jugular vein and subclavian vein unite')],
      ['Su unión con esas venas varía, y es poco frecuente que entre justo en la confluencia.', W('Right_lymphatic_duct', 'A right lymphatic duct that enters directly into the junction of the internal jugular and subclavian veins is uncommon.')],
    ],
    modelo: [
      ['En este modelo los tres troncos derechos se unen en un conducto linfático derecho corto que termina en el ángulo venoso derecho: es una variante elegida para enseñar, generada para Anato3D y de trazado esquemático.', MODELO],
      ['Los troncos derechos también pueden desembocar por separado en las venas, y en el caso del broncomediastínico eso es lo más frecuente.', W('Bronchomediastinal_trunk', 'more frequently, they open independently into the junction of the internal jugular vein and subclavian veins')],
      ['El latín del modelo corrige una errata de la tabla de la Terminologia que usa Z-Anatomy («lymphatlcus»).', TA(5132), MODELO],
    ],
    vias: { recibe: ['Jugular_trunk', 'Subclavian_trunk', 'Bronchomediastinal_trunk'], drena: ['Right_subclavian_vein', 'Internal_jugular_vein'] },
  },
  // ── Troncos ──
  Jugular_trunk: {
    tipo: 'tronco', ta2: [5133, 5140], chips: ['Tronco linfático'],
    descripcion: [
      ['Tronco linfático del cuello, uno a cada lado, que lleva la linfa de la cabeza y el cuello de su lado.', W('Deep_cervical_lymph_nodes', 'All lymphatic vessels of the head and neck ultimately drain to the deep cervical lymph nodes'), W('Deep_cervical_lymph_nodes', 'Efferents of the deep cervical lymph nodes form the ipsilateral jugular trunk.')],
      ['Lo forman los vasos que salen de los nodos cervicales profundos superiores al unirse con los eferentes de los inferiores.', W('Jugular_trunk', 'It is formed by vessels that emerge from the superior deep cervical lymph nodes and unite to efferents of the inferior deep cervical lymph nodes.')],
    ],
    localizacion: [
      ['Está en el cuello, al final de la cadena cervical profunda, que acompaña a la vena yugular interna dentro de la vaina carotídea.', W('Deep_cervical_lymph_nodes', 'form a chain along the internal jugular vein within the carotid sheath'), W('Deep_cervical_lymph_nodes', 'Efferents of the deep cervical lymph nodes form the ipsilateral jugular trunk.')],
    ],
    reparo: [
      ['La vena yugular interna: la cadena de nodos que lo forma va a lo largo de ella.', W('Deep_cervical_lymph_nodes', 'form a chain along the internal jugular vein within the carotid sheath')],
    ],
    recibe: [
      ['Recibe los eferentes de los nodos cervicales profundos, a los que acaban llegando todos los vasos linfáticos de la cabeza y el cuello, directamente o a través de otros nodos.', W('Deep_cervical_lymph_nodes', 'All lymphatic vessels of the head and neck ultimately drain to the deep cervical lymph nodes - either by way of other lymph nodes or directly from tissues.')],
    ],
    drena: [
      ['En el lado derecho termina en el ángulo venoso, la unión de la yugular interna y la subclavia; en el izquierdo se une al conducto torácico.', W('Jugular_trunk', 'On the right side, this trunk ends in the junction of the internal jugular and subclavian veins, called the venous angle.'), W('Jugular_trunk', 'On the left side it joins the thoracic duct.')],
      ['En el lado derecho también se describe como una de las tres ramas que forman el conducto linfático derecho.', ES('Conducto_linfático_derecho', 'Se forma por la unión de 3 ramas, el tronco yugular, el subclavio y el broncomediastínico derecho.')],
    ],
    modelo: [
      ['En este modelo es un tubo de trazado esquemático junto a la vena yugular interna, generado para Anato3D. Variante elegida: el derecho termina en el conducto linfático derecho y el izquierdo en el final del conducto torácico, junto al ángulo venoso izquierdo.', MODELO],
      ['El nombre latino del modelo es la forma breve; la Terminologia Anatomica 2 lo llama Truncus lymphaticus jugularis dexter o sinister.', TA(5133), TA(5140), MODELO],
    ],
    vias: { recibe: ['Lateral_superior_jugular_node', 'Inferior_deep_lateral_cervical_nodes', 'Anterior_inferior_jugular_nodes'], drena: ['Right_lymphatic_duct', 'Thoracic_duct'] },
  },
  Subclavian_trunk: {
    tipo: 'tronco', ta2: [5134, 5141], chips: ['Tronco linfático'],
    descripcion: [
      ['Tronco linfático, uno a cada lado, que lleva la linfa del miembro superior y de la axila.', W('Axillary_lymph_nodes', 'and the vessels from the upper limb'), W('Axillary_lymph_nodes', 'The apical nodes drain into the subclavian lymph trunk.')],
      ['Lo forman los eferentes del grupo apical (subclavicular) de los nodos axilares.', W('Subclavian_trunk', 'The efferent vessels of the subclavicular group unite to form the subclavian trunk')],
    ],
    localizacion: [
      ['Va desde el vértice de la axila, donde están los nodos apicales, hasta las grandes venas de la raíz del cuello.', W('Axillary_lymph_nodes', 'Lying at the apex of the axilla at the lateral border of the 1st rib'), W('Axillary_lymph_nodes', 'the lymph trunks may drain directly into one of the large veins at the root of the neck')],
    ],
    reparo: [
      ['La primera costilla: los nodos apicales que lo forman están en su borde lateral, en el vértice de la axila.', W('Axillary_lymph_nodes', 'Lying at the apex of the axilla at the lateral border of the 1st rib')],
    ],
    recibe: [
      ['Recibe la linfa de los nodos apicales, que a su vez reciben los eferentes de todos los demás nodos axilares.', W('Axillary_lymph_nodes', 'these nodes receive the efferent lymph vessels from all the other axillary nodes'), W('Axillary_lymph_nodes', 'The apical nodes drain into the subclavian lymph trunk.')],
    ],
    drena: [
      ['Puede abrirse directamente en la unión de la yugular interna y la subclavia o en el tronco yugular; en el lado izquierdo puede terminar en el conducto torácico.', W('Subclavian_trunk', 'which opens either directly into the junction of the internal jugular and subclavian veins or into the jugular lymphatic trunk; on the left side it may end in the thoracic duct')],
      ['En el lado derecho drena en el conducto linfático derecho.', W('Axillary_lymph_nodes', 'on the right side, it drains into the right lymphatic duct')],
    ],
    modelo: [
      ['En este modelo es un tubo de trazado esquemático generado para Anato3D, desde los nodos axilares apicales hasta el ángulo venoso de su lado. Variante elegida: el derecho termina en el conducto linfático derecho y el izquierdo en el final del conducto torácico.', MODELO],
      ['El nombre latino del modelo es la forma breve; la Terminologia Anatomica 2 lo llama Truncus lymphaticus subclavius dexter o sinister.', TA(5134), TA(5141), MODELO],
    ],
    vias: { recibe: ['Apical_axillary_nodes'], drena: ['Right_lymphatic_duct', 'Thoracic_duct'] },
  },
  Bronchomediastinal_trunk: {
    tipo: 'tronco', ta2: [5135, 5136], chips: ['Tronco linfático'],
    descripcion: [
      ['Tronco linfático del tórax, normalmente uno a cada lado, que recoge la linfa de los nodos traqueobronquiales, paraesternales (mamarios internos) y mediastínicos anteriores.', W('Bronchomediastinal_trunk', 'tasked with draining lymph from the tracheobronchial, internal mammary, and anterior mediastinal lymph nodes'), W('Bronchomediastinal_trunk', 'Typically, there are two trunks - one on each side of the body.')],
      ['Por esos nodos le llega la linfa del corazón, los pulmones, la tráquea y la pleura.', W('Bronchomediastinal_trunk', 'drain lymph from the heart, lungs, trachea, and pleura')],
    ],
    localizacion: [
      ['Está en el mediastino: cada tronco va, por el lado, desde la abertura superior del tórax hasta la raíz del cuello.', W('Bronchomediastinal_trunk', 'Each trunk extends from the thoracic inlet to the root of the neck, positioned laterally.')],
    ],
    reparo: [
      ['La tráquea: los vasos eferentes que lo forman suben sobre ella.', W('Tracheobronchial_lymph_nodes', 'Their efferent vessels ascend upon the trachea')],
    ],
    recibe: [
      ['Se forma al unirse los eferentes de los nodos traqueobronquiales con los de los nodos mamarios internos (paraesternales) y mediastínicos anteriores.', W('Tracheobronchial_lymph_nodes', 'unite with efferents of the internal mammary and anterior mediastinal glands to form the right and left bronchomediastinal trunks')],
      ['Los nodos paraesternales drenan en él.', W('Parasternal_lymph_nodes', 'The parasternal lymph nodes drain into the bronchomediastinal trunks')],
    ],
    drena: [
      ['El derecho puede unirse al conducto linfático derecho y el izquierdo al conducto torácico, pero lo más frecuente es que cada uno se abra por separado en la unión de la yugular interna y la subclavia de su lado.', W('Bronchomediastinal_trunk', 'The right bronchomediastinal trunk may connect the right lymphatic duct, and the left trunk to the thoracic duct'), W('Bronchomediastinal_trunk', 'more frequently, they open independently into the junction of the internal jugular vein and subclavian veins')],
    ],
    modelo: [
      ['En este modelo es un tubo de trazado esquemático generado para Anato3D. Variante elegida: el derecho termina en el conducto linfático derecho y el izquierdo en el final del conducto torácico; la desembocadura por separado en las venas, que es la más frecuente, no se representa.', MODELO],
      ['El nombre latino del modelo es la forma breve; la Terminologia Anatomica 2 lo llama Truncus lymphaticus bronchomediastinalis dexter o sinister.', TA(5135), TA(5136), MODELO],
    ],
    vias: { recibe: ['Paratracheal_thoracic_nodes', 'Parasternal_nodes', 'Brachiocephalic_nodes'], drena: ['Right_lymphatic_duct', 'Thoracic_duct'] },
  },
  Lumbar_trunk: {
    tipo: 'tronco', ta2: [5146, 5147], chips: ['Tronco linfático'],
    descripcion: [
      ['Tronco linfático del abdomen, uno derecho y otro izquierdo, formado por la unión de los eferentes de los nodos aórticos laterales.', W('Lumbar_trunk', 'The lumbar trunks are formed by the union of the efferent vessels from the lateral aortic lymph nodes.')],
      ['Lleva la linfa de los miembros inferiores, de las paredes y vísceras de la pelvis, de los riñones y las glándulas suprarrenales y de los linfáticos profundos de la mayor parte de la pared abdominal.', W('Lumbar_trunk', 'They receive the lymph from the lower limbs, from the walls and viscera of the pelvis, from the kidneys and suprarenal glands and the deep lymphatics of the greater part of the abdominal wall.')],
    ],
    localizacion: [
      ['Está en la pared posterior del abdomen: los nodos que lo forman están junto a la aorta, delante de la columna, y llegan por fuera hasta el borde del psoas mayor.', W('Lumbar_lymph_nodes', 'The lateral group nodes are located adjacent to the aorta, anterior to the spine, extending laterally to the edge of the psoas major muscles')],
    ],
    reparo: [
      ['La aorta abdominal y el psoas mayor: los nodos izquierdos forman una cadena al lado izquierdo de la aorta, delante del origen del psoas mayor; los derechos están en parte delante de la vena cava inferior, cerca de la desembocadura de la vena renal, y en parte detrás de ella.', W('Lumbar_lymph_nodes', 'The left paraaortic nodes form a chain on the left side of the abdominal aorta in front of the origin of the psoas major'), W('Lumbar_lymph_nodes', 'are situated partly in front of the inferior vena cava near the termination of the renal vein, and partly behind it')],
    ],
    recibe: [
      ['A sus nodos de origen llegan los eferentes de los nodos ilíacos comunes, la linfa del testículo (o del ovario, la trompa y el útero), la del riñón y la glándula suprarrenal y la de los músculos laterales del abdomen.', W('Lumbar_lymph_nodes', 'the efferents of the common iliac lymph nodes'), W('Lumbar_lymph_nodes', 'the lymphatics from the testis in the male, and from the ovary, uterine tube, and uterus in the female'), W('Lumbar_lymph_nodes', 'the lymphatics from the kidney and suprarenal gland'), W('Lumbar_lymph_nodes', 'the lymphatics draining the lateral abdominal muscles')],
    ],
    drena: [
      ['Desemboca en la cisterna del quilo, la dilatación del comienzo del conducto torácico.', W('Lumbar_trunk', 'Ultimately, the lumbar trunks empty into the cisterna chyli, a dilatation at the beginning of the thoracic duct.')],
      ['Algunos eferentes de los nodos aórticos laterales atraviesan los pilares del diafragma y se unen directamente al extremo inferior del conducto torácico.', W('Lumbar_lymph_nodes', 'others pierce the crura of the diaphragm to join the lower end of the thoracic duct')],
    ],
    modelo: [
      ['En este modelo es un tubo de trazado esquemático generado para Anato3D, desde los nodos lumbares de su lado hasta la cisterna del quilo.', MODELO],
      ['El nombre latino del modelo es la forma breve; la Terminologia Anatomica 2 lo llama Truncus lymphaticus lumbalis dexter o sinister.', TA(5146), TA(5147), MODELO],
    ],
    vias: { recibe: ['Lateral_aortic_nodes', 'Lateral_caval_nodes', 'Intermediate_lumbar_nodes'], drena: ['Cisterna_chyli'] },
  },
  Intestinal_trunks: {
    tipo: 'tronco', ta2: 5148, chips: ['Tronco linfático'],
    descripcion: [
      ['Vasos linfáticos que llevan la linfa del estómago y los intestinos, del páncreas y el bazo, y de la parte inferior y anterior del hígado.', W('Intestinal_trunk', 'receives the lymph from the stomach and intestines, from the pancreas and spleen, and from the lower and front part of the liver')],
    ],
    localizacion: [
      ['Nacen de los nodos preaórticos, que están delante de la aorta abdominal, alrededor del origen del tronco celíaco y de las arterias mesentéricas superior e inferior.', W('Preaortic_lymph_nodes', 'The preaortic lymph nodes lie in front of the aorta'), W('Preaortic_lymph_nodes', 'arranged around the origins of the corresponding arteries'), W('Preaortic_lymph_nodes', 'the majority unite to form the intestinal lymph trunk')],
    ],
    reparo: [
      ['El origen del tronco celíaco y de las arterias mesentéricas en la cara anterior de la aorta: alrededor de ellos están los nodos preaórticos de los que salen.', W('Preaortic_lymph_nodes', 'arranged around the origins of the corresponding arteries')],
    ],
    recibe: [
      ['Reciben la mayoría de los eferentes de los nodos preaórticos: celíacos, mesentéricos superiores y mesentéricos inferiores.', W('Preaortic_lymph_nodes', 'may be divided into celiac lymph nodes, superior mesenteric lymph nodes, and inferior mesenteric lymph nodes groups'), W('Preaortic_lymph_nodes', 'the majority unite to form the intestinal lymph trunk')],
    ],
    drena: [
      ['Desembocan en la cisterna del quilo, que a su vez drena en el conducto torácico.', W('Intestinal_trunk', 'empties lymph into the cisterna chyli, which in turn drains into the thoracic duct')],
    ],
    modelo: [
      ['En este modelo son una sola pieza de trazado esquemático, generada para Anato3D, entre los nodos preaórticos y la cisterna del quilo.', MODELO],
      ['La Terminologia Anatomica 2 lo nombra en singular: Truncus lymphaticus intestinalis.', TA(5148)],
    ],
    vias: { recibe: ['Coeliac_nodes', 'Central_superior_mesenteric_nodes', 'Pre_aortic_nodes'], drena: ['Cisterna_chyli'] },
  },
  // ── Colectores regionales (esquemáticos) ──
  Lymphatic_vessels_of_head: {
    tipo: 'colector', latinFormado: true, latin: 'Vasa lymphatica capitis', chips: ['Trazado esquemático'],
    descripcion: [
      ['Vasos linfáticos colectores de la cabeza: llevan la linfa de los tejidos a los nodos de la cabeza y, de ellos, a los del cuello.', W('Lymphatic_vessel', 'Lymph vessels that carry lymph to a lymph node are called afferent lymph vessels'), W('Deep_cervical_lymph_nodes', 'All lymphatic vessels of the head and neck ultimately drain to the deep cervical lymph nodes')],
      ...COLECTOR_GENERAL,
    ],
    localizacion: [
      ['Salen del cuero cabelludo, la cara, la boca, las fosas nasales y la faringe y van hacia los nodos de la cabeza y la cadena cervical profunda.', W('Occipital_lymph_nodes', 'drain part of the scalp of the occiput'), W('Jugulodigastric_lymph_node', 'are the first to receive lymphatic drainage from face, mouth, pharynx, and tonsils'), W('Retropharyngeal_lymph_nodes', 'Their afferents drain the nasal cavities, the nasal part of the pharynx, and the auditory tubes.')],
    ],
    reparo: [
      ['Ejemplo: un vaso de la región occipital del cuero cabelludo baja por el borde posterior del esternocleidomastoideo hasta los nodos cervicales profundos inferiores.', W('Occipital_lymph_nodes', 'a lymphatic vessel which passes along the posterior border of the sternocleidomastoid muscle to drain directly into the inferior deep cervical lymph nodes')],
    ],
    recibe: [
      ['Recogen la linfa del cuero cabelludo, la cara, la boca, la faringe, las amígdalas, las fosas nasales y las trompas auditivas.', W('Occipital_lymph_nodes', 'drain part of the scalp of the occiput'), W('Jugulodigastric_lymph_node', 'are the first to receive lymphatic drainage from face, mouth, pharynx, and tonsils'), W('Retropharyngeal_lymph_nodes', 'Their afferents drain the nasal cavities, the nasal part of the pharynx, and the auditory tubes.')],
    ],
    drena: [
      ['Pasan por nodos de la cabeza, como los occipitales o los retrofaríngeos, cuyos eferentes van a los nodos cervicales profundos superiores.', W('Occipital_lymph_nodes', 'Their efferents in turn drain into the superior deep cervical glands.'), W('Retropharyngeal_lymph_nodes', 'Their efferents pass to the superior deep cervical lymph nodes.')],
    ],
    modelo: [malla('los nodos de la cabeza entre sí y con la cadena cervical profunda'), NOMBRE_DESCRIPTIVO],
  },
  Lymphatic_vessels_of_neck: {
    tipo: 'colector', latinFormado: true, latin: 'Vasa lymphatica colli', chips: ['Trazado esquemático'],
    descripcion: [
      ['Vasos linfáticos colectores del cuello: unen los nodos cervicales entre sí y llevan la linfa hacia el tronco yugular.', W('Jugular_trunk', 'It is formed by vessels that emerge from the superior deep cervical lymph nodes and unite to efferents of the inferior deep cervical lymph nodes.')],
      ...COLECTOR_GENERAL,
    ],
    localizacion: [
      ['Siguen sobre todo la cadena cervical profunda, a lo largo de la vena yugular interna dentro de la vaina carotídea; los superficiales siguen la vena yugular externa.', W('Deep_cervical_lymph_nodes', 'form a chain along the internal jugular vein within the carotid sheath'), W('Superficial_cervical_lymph_nodes', 'Some sources state simply that they lie along the external jugular vein')],
    ],
    reparo: [
      ['La vena yugular interna, para la cadena profunda, y la yugular externa, para la superficial.', W('Deep_cervical_lymph_nodes', 'form a chain along the internal jugular vein within the carotid sheath'), W('Superficial_cervical_lymph_nodes', 'Some sources state simply that they lie along the external jugular vein')],
    ],
    recibe: [
      ['Reciben la linfa de los nodos de la cabeza y de los del cuello, y también la de los vasos linfáticos meníngeos, que llegan a los cervicales profundos.', W('Deep_cervical_lymph_nodes', 'All lymphatic vessels of the head and neck ultimately drain to the deep cervical lymph nodes'), W('Lymph_node', 'Lymph from the meningeal lymphatic vessels in the CNS drains to the deep cervical lymph nodes.')],
    ],
    drena: [
      ['Los eferentes de los nodos cervicales profundos forman el tronco yugular de su lado.', W('Deep_cervical_lymph_nodes', 'Efferents of the deep cervical lymph nodes form the ipsilateral jugular trunk.')],
    ],
    modelo: [malla('los nodos del cuello entre sí y con el tronco yugular'), NOMBRE_DESCRIPTIVO],
  },
  Superficial_lymphatic_vessels_of_upper_limb: {
    tipo: 'colector', latinFormado: true, latin: 'Vasa lymphatica superficialia membri superioris', chips: ['Trazado esquemático'],
    descripcion: [
      ['Vasos linfáticos superficiales del miembro superior, bajo la piel, que siguen a las venas superficiales.', W('Supratrochlear_lymph_nodes', 'Their efferents accompany the basilic vein and join the deeper vessels.'), W('Deltopectoral_lymph_nodes', 'are found beside the cephalic vein')],
      ...COLECTOR_GENERAL,
    ],
    localizacion: [
      ['Los del lado cubital del antebrazo y de la mano siguen la vena basílica; los del lado lateral de la mano, el antebrazo y el brazo siguen la vena cefálica hasta el surco entre el deltoides y el pectoral mayor.', W('Supratrochlear_lymph_nodes', 'Their afferents drain the middle, ring, and little fingers, the medial portion of the hand, and the superficial area over the ulnar side of the forearm'), W('Supratrochlear_lymph_nodes', 'Their efferents accompany the basilic vein'), W('Axillary_lymph_nodes', 'They lie in the groove between the deltoid and pectoralis major muscles and receive superficial lymph vessels from the lateral side of the hand, forearm, and arm.')],
    ],
    reparo: [
      ['Las venas basílica y cefálica; por encima del epicóndilo medial, medial a la basílica, están los nodos supratrocleares.', W('Supratrochlear_lymph_nodes', 'are placed above the medial epicondyle of the humerus, medial to the basilic vein'), W('Deltopectoral_lymph_nodes', 'are found beside the cephalic vein, between the pectoralis major and deltoideus')],
    ],
    recibe: [
      ['Recogen la linfa de la piel y el tejido subcutáneo de los dedos, la mano, el antebrazo y el brazo.', W('Supratrochlear_lymph_nodes', 'Their afferents drain the middle, ring, and little fingers, the medial portion of the hand, and the superficial area over the ulnar side of the forearm'), W('Axillary_lymph_nodes', 'receive superficial lymph vessels from the lateral side of the hand, forearm, and arm')],
    ],
    drena: [
      ['Los mediales pasan por los nodos supratrocleares y se unen a los vasos profundos; los laterales llegan a los nodos infraclaviculares (deltopectorales).', W('Supratrochlear_lymph_nodes', 'Their efferents accompany the basilic vein and join the deeper vessels.'), W('Deltopectoral_lymph_nodes', 'They are situated in the course of the external collecting trunks of the arm.')],
      ['Casi toda la linfa del miembro superior acaba en los nodos axilares laterales.', W('Axillary_lymph_nodes', 'these nodes receive most of the lymph vessels of the upper limb')],
    ],
    modelo: [malla('los nodos cubitales y supratrocleares con los axilares, junto a la vena basílica, y la vía de la vena cefálica con los nodos infraclaviculares'), NOMBRE_DESCRIPTIVO],
  },
  Deep_lymphatic_vessels_of_upper_limb: {
    tipo: 'colector', latinFormado: true, latin: 'Vasa lymphatica profunda membri superioris', chips: ['Trazado esquemático'],
    descripcion: [
      ['Vasos linfáticos profundos del miembro superior, bajo la fascia, que llevan la linfa de los músculos y las articulaciones hacia la axila.', W('Brachial_lymph_nodes', 'the afferents of these glands drain the whole arm with the exception of that portion whose vessels accompany the cephalic vein')],
      ...COLECTOR_GENERAL,
    ],
    localizacion: [
      ['Suben hacia los nodos axilares laterales (humerales), que están junto a las caras medial y posterior de la vena axilar.', W('Brachial_lymph_nodes', 'which lies in relation to the medial and posterior aspects of the axillary vein')],
    ],
    reparo: [
      ['La vena axilar: los nodos en los que terminan están en su cara medial y posterior.', W('Brachial_lymph_nodes', 'which lies in relation to the medial and posterior aspects of the axillary vein')],
    ],
    recibe: [
      ['Reciben la linfa de todo el miembro salvo la de los vasos que acompañan a la vena cefálica; los superficiales del lado cubital se unen a ellos tras los nodos supratrocleares.', W('Brachial_lymph_nodes', 'the afferents of these glands drain the whole arm with the exception of that portion whose vessels accompany the cephalic vein'), W('Supratrochlear_lymph_nodes', 'Their efferents accompany the basilic vein and join the deeper vessels.')],
    ],
    drena: [
      ['Terminan en los nodos axilares laterales, que reciben la mayor parte de los vasos linfáticos del miembro superior.', W('Axillary_lymph_nodes', 'these nodes receive most of the lymph vessels of the upper limb')],
    ],
    modelo: [malla('los nodos braquiales con los axilares laterales siguiendo los vasos radiales, cubitales y braquiales; ese recorrido junto a las arterias es una simplificación'), NOMBRE_DESCRIPTIVO],
  },
  Lymphatic_vessels_of_thoracic_wall: {
    tipo: 'colector', latinFormado: true, latin: 'Vasa lymphatica parietis thoracis', chips: ['Trazado esquemático'],
    descripcion: [
      ['Vasos linfáticos colectores de la pared del tórax, que unen los nodos paraesternales, delante, y los intercostales, detrás.', W('Parasternal_lymph_nodes', 'are placed at the anterior ends of the intercostal spaces'), W('Intercostal_lymph_nodes', 'occupy the posterior parts of the intercostal spaces')],
      ...COLECTOR_GENERAL,
    ],
    localizacion: [
      ['Delante, junto a la arteria torácica interna, en los extremos anteriores de los espacios intercostales; detrás, en la parte posterior de esos espacios, junto a los vasos intercostales.', W('Parasternal_lymph_nodes', 'are placed at the anterior ends of the intercostal spaces, by the side of the internal thoracic artery'), W('Intercostal_lymph_nodes', 'occupy the posterior parts of the intercostal spaces, in relation to the intercostal vessels')],
    ],
    reparo: [
      ['La arteria torácica interna, por delante, y los vasos intercostales, por detrás.', W('Parasternal_lymph_nodes', 'by the side of the internal thoracic artery'), W('Intercostal_lymph_nodes', 'in relation to the intercostal vessels')],
    ],
    recibe: [
      ['Los paraesternales reciben linfa de la mama, de la parte profunda de la pared anterior del abdomen por encima del ombligo, de la cara superior del hígado y de la parte anterior de la pared del tórax.', W('Parasternal_lymph_nodes', 'They derive afferents from the mamma; from the deeper structures of the anterior abdominal wall above the level of the umbilicus; from the upper surface of the liver')],
      ['Los intercostales reciben los linfáticos profundos de la parte posterolateral del tórax.', W('Intercostal_lymph_nodes', 'They receive the deep lymphatics from the postero-lateral aspect of the chest')],
    ],
    drena: [
      ['Los paraesternales drenan en el tronco broncomediastínico, igual que los intercostales superiores.', W('Parasternal_lymph_nodes', 'The parasternal lymph nodes drain into the bronchomediastinal trunks, in a similar fashion to the upper intercostal lymph nodes.')],
      ['Los intercostales de los cuatro o cinco espacios inferiores forman un tronco que baja a la cisterna del quilo o al comienzo del conducto torácico; los superiores izquierdos terminan en el conducto torácico, y los derechos, en el conducto linfático derecho.', W('Intercostal_lymph_nodes', 'The efferents of the glands in the lower four or five spaces unite to form a trunk, which descends and opens either into the cisterna chyli or into the commencement of the thoracic duct.'), W('Intercostal_lymph_nodes', 'The efferents of the glands in the upper spaces of the left side end in the thoracic duct; those of the corresponding right spaces, in the right lymphatic duct.')],
    ],
    modelo: [malla('los nodos paraesternales e intercostales con sus troncos'), NOMBRE_DESCRIPTIVO],
  },
  Lymphatic_vessels_of_mediastinum: {
    tipo: 'colector', latinFormado: true, latin: 'Vasa lymphatica mediastini', chips: ['Trazado esquemático'],
    descripcion: [
      ['Vasos linfáticos colectores del mediastino, que llevan la linfa de los pulmones, los bronquios, la tráquea y el corazón hacia los troncos broncomediastínicos.', W('Tracheobronchial_lymph_nodes', 'The afferents of the tracheobronchial glands drain the lungs and bronchi, the thoracic part of the trachea and the heart'), W('Tracheobronchial_lymph_nodes', 'to form the right and left bronchomediastinal trunks')],
      ...COLECTOR_GENERAL,
    ],
    localizacion: [
      ['Unen los nodos de dentro del pulmón, los del hilio, los de alrededor de la bifurcación de la tráquea y los de sus lados.', W('Tracheobronchial_lymph_nodes', 'These lymph nodes form four main groups including paratracheal, tracheobronchial, bronchopulmonary and pulmonary nodes.')],
    ],
    reparo: [
      ['La tráquea y su bifurcación: los nodos traqueobronquiales superiores están a cada lado de la tráquea, justo antes de dividirse, y el inferior, en el ángulo entre los dos bronquios.', W('Tracheobronchial_lymph_nodes', 'The two superior tracheobronchial nodes are located on either side of trachea just before its bifurcation.'), W('Tracheobronchial_lymph_nodes', 'The inferior tracheobronchial node is located just below the bifurcation in the angle between the two bronchi.')],
    ],
    recibe: [
      ['Reciben la linfa de los pulmones y los bronquios, de la parte torácica de la tráquea y del corazón, y parte de la de los nodos mediastínicos posteriores.', W('Tracheobronchial_lymph_nodes', 'The afferents of the tracheobronchial glands drain the lungs and bronchi, the thoracic part of the trachea and the heart; some of the efferents of the posterior mediastinal glands also end in this group.')],
    ],
    drena: [
      ['Sus eferentes suben sobre la tráquea y se unen a los de los nodos mamarios internos y mediastínicos anteriores para formar los troncos broncomediastínicos.', W('Tracheobronchial_lymph_nodes', 'Their efferent vessels ascend upon the trachea and unite with efferents of the internal mammary and anterior mediastinal glands to form the right and left bronchomediastinal trunks.')],
    ],
    modelo: [malla('los nodos del mediastino entre sí y con los troncos broncomediastínicos', { impar: true }), NOMBRE_DESCRIPTIVO],
  },
  Lymphatic_vessels_of_abdomen: {
    tipo: 'colector', latinFormado: true, latin: 'Vasa lymphatica abdominis', chips: ['Trazado esquemático'],
    descripcion: [
      ['Vasos linfáticos colectores del abdomen: llevan la linfa de las vísceras a los nodos preaórticos y la de la pared y los órganos retroperitoneales a los nodos lumbares.', W('Preaortic_lymph_nodes', 'their principal afferents are derived from the organs supplied by the three arteries with which they are associated'), W('Lumbar_lymph_nodes', 'the lymphatics from the kidney and suprarenal gland')],
      ...COLECTOR_GENERAL,
    ],
    localizacion: [
      ['En el mesenterio y junto a las arterias de las vísceras, hasta los nodos de delante y de los lados de la aorta.', W('Superior_mesenteric_lymph_nodes', 'lie between the layers of the mesentery'), W('Preaortic_lymph_nodes', 'arranged around the origins of the corresponding arteries'), W('Lumbar_lymph_nodes', 'The lateral group nodes are located adjacent to the aorta')],
    ],
    reparo: [
      ['El tronco celíaco y las arterias mesentéricas superior e inferior, para la vía visceral; la aorta y la vena cava inferior, para la lumbar.', W('Preaortic_lymph_nodes', 'the celiac, superior and inferior mesenteric arteries'), W('Lumbar_lymph_nodes', 'are situated partly in front of the inferior vena cava')],
    ],
    recibe: [
      ['Reciben la linfa del tubo digestivo y sus glándulas, del bazo, de los riñones y las glándulas suprarrenales, de las gónadas y de los músculos laterales del abdomen.', W('Intestinal_trunk', 'receives the lymph from the stomach and intestines, from the pancreas and spleen'), W('Lumbar_lymph_nodes', 'the lymphatics from the testis in the male, and from the ovary, uterine tube, and uterus in the female'), W('Lumbar_lymph_nodes', 'the lymphatics from the kidney and suprarenal gland'), W('Lumbar_lymph_nodes', 'the lymphatics draining the lateral abdominal muscles')],
    ],
    drena: [
      ['De los nodos preaórticos sale el tronco intestinal, y de los aórticos laterales, los troncos lumbares; todos llegan a la cisterna del quilo.', W('Preaortic_lymph_nodes', 'the majority unite to form the intestinal lymph trunk, which enters the cisterna chyli'), W('Lumbar_lymph_nodes', 'converge to form the right and left lumbar trunks which join the cisterna chyli')],
    ],
    modelo: [malla('los nodos del abdomen entre sí y con los troncos intestinales y lumbares', { impar: true }), NOMBRE_DESCRIPTIVO],
  },
  Lymphatic_vessels_of_pelvis: {
    tipo: 'colector', latinFormado: true, latin: 'Vasa lymphatica pelvis', chips: ['Trazado esquemático'],
    descripcion: [
      ['Vasos linfáticos colectores de la pelvis, que siguen a los vasos ilíacos y llevan la linfa hacia los nodos lumbares.', W('External_iliac_lymph_nodes', 'lie along the external iliac vessels'), W('Common_iliac_lymph_nodes', 'their efferents pass to the lateral aortic glands')],
      ...COLECTOR_GENERAL,
    ],
    localizacion: [
      ['Van a lo largo de los vasos ilíacos externos, alrededor de la arteria ilíaca interna y sus ramas y por detrás y a los lados de la arteria ilíaca común.', W('External_iliac_lymph_nodes', 'lie along the external iliac vessels'), W('Internal_iliac_lymph_nodes', 'surround the internal iliac artery and its branches'), W('Common_iliac_lymph_nodes', 'are grouped behind and on the sides of the common iliac artery')],
    ],
    reparo: [
      ['Las arterias ilíacas común, externa e interna.', W('Common_iliac_lymph_nodes', 'are grouped behind and on the sides of the common iliac artery'), W('External_iliac_lymph_nodes', 'lie along the external iliac vessels'), W('Internal_iliac_lymph_nodes', 'surround the internal iliac artery and its branches')],
    ],
    recibe: [
      ['Reciben la linfa de los nodos inguinales, de todas las vísceras de la pelvis, de la parte profunda del periné y de la nalga y la parte posterior del muslo.', W('External_iliac_lymph_nodes', 'Their principal afferents are derived from the inguinal lymph nodes'), W('Internal_iliac_lymph_nodes', 'they receive lymphatics from all the pelvic viscera, from the deeper parts of the perineum'), W('Internal_iliac_lymph_nodes', 'from the buttock and back of the thigh')],
      ['La linfa del ovario y del testículo no pasa por la pelvis: va a los nodos lumbares.', W('Internal_iliac_lymph_nodes', 'It does not receive lymph from the ovary or testis, which drain to the paraaortic lymph nodes.')],
    ],
    drena: [
      ['Los ilíacos externos e internos drenan en los ilíacos comunes, cuyos eferentes van a los nodos aórticos laterales.', W('Common_iliac_lymph_nodes', 'They drain chiefly the hypogastric and external iliac glands, and their efferents pass to the lateral aortic glands.')],
    ],
    modelo: [malla('los nodos de la pelvis entre sí, a lo largo de los vasos ilíacos, hasta los nodos lumbares'), NOMBRE_DESCRIPTIVO],
  },
  Superficial_lymphatic_vessels_of_lower_limb: {
    tipo: 'colector', latinFormado: true, latin: 'Vasa lymphatica superficialia membri inferioris', chips: ['Trazado esquemático'],
    descripcion: [
      ['Vasos linfáticos superficiales del miembro inferior, bajo la piel, que llevan la linfa hacia los nodos inguinales superficiales y, desde la parte posterolateral de la pierna, hacia los poplíteos.', W('Inguinal_lymph_nodes', 'the thigh and the medial side of the leg (the lateral leg drains to the popliteal lymph nodes first)')],
      ...COLECTOR_GENERAL,
    ],
    localizacion: [
      ['La mayoría sube por el muslo y la cara medial de la pierna hasta la ingle; los de la región de la vena safena menor llegan a un nodo poplíteo junto a la desembocadura de esa vena.', W('Inguinal_lymph_nodes', 'the thigh and the medial side of the leg'), W('Popliteal_lymph_nodes', 'near the terminal part of the small saphenous vein, and drains the region from which this vein derives its tributaries')],
    ],
    reparo: [
      ['El hiato safeno: los nodos inguinales superficiales están por debajo, a su lado y en su centro.', W('Inguinal_lymph_nodes', 'inferior – inferior of the saphenous opening of the leg'), W('Inguinal_lymph_nodes', 'superolateral – on the side of the saphenous opening'), W('Inguinal_lymph_nodes', 'superomedial – located at the middle of the saphenous opening')],
      ['La vena safena menor, en la pierna: su territorio drena en el nodo poplíteo superficial.', W('Popliteal_lymph_nodes', 'near the terminal part of the small saphenous vein, and drains the region from which this vein derives its tributaries')],
    ],
    recibe: [
      ['Recogen la linfa de la piel y el tejido subcutáneo del pie, la pierna y el muslo; la de la parte posterolateral de la pierna y la planta del pie va al nodo poplíteo superficial.', W('Popliteal_lymph_nodes', 'such as superficial regions of the posterolateral aspect of the leg and the plantar aspect of the foot')],
    ],
    drena: [
      ['Los inguinales superficiales drenan en los inguinales profundos.', W('Inguinal_lymph_nodes', 'They drain to the deep inguinal lymph nodes.')],
    ],
    modelo: [malla('los nodos inguinales superficiales con la vía de la safena magna y el nodo poplíteo superficial con la de la safena menor'), NOMBRE_DESCRIPTIVO],
  },
  Deep_lymphatic_vessels_of_lower_limb: {
    tipo: 'colector', latinFormado: true, latin: 'Vasa lymphatica profunda membri inferioris', chips: ['Trazado esquemático'],
    descripcion: [
      ['Vasos linfáticos profundos del miembro inferior, que acompañan a los vasos tibiales y femorales y llevan la linfa a los nodos poplíteos y a los inguinales profundos.', W('Popliteal_lymph_nodes', 'the trunks that accompany the anterior and posterior tibial vessels'), W('Popliteal_lymph_nodes', 'The efferents of the popliteal lymph nodes pass almost entirely alongside the femoral vessels to the deep inguinal lymph nodes')],
      ...COLECTOR_GENERAL,
    ],
    localizacion: [
      ['En la pierna acompañan a los vasos tibiales anteriores y posteriores hasta la fosa poplítea; en el muslo siguen los vasos femorales hasta los nodos inguinales profundos.', W('Popliteal_lymph_nodes', 'the trunks that accompany the anterior and posterior tibial vessels'), W('Popliteal_lymph_nodes', 'pass almost entirely alongside the femoral vessels to the deep inguinal lymph nodes')],
    ],
    reparo: [
      ['Los vasos poplíteos y la vena femoral: los nodos poplíteos profundos están a los lados de los vasos poplíteos y los inguinales profundos, mediales a la vena femoral.', W('Popliteal_lymph_nodes', 'The others lie at the sides of the popliteal vessels'), W('Inguinal_lymph_nodes', 'They lie medial to the femoral vein deep to the cribriform fascia.')],
    ],
    recibe: [
      ['Reciben la linfa de la articulación de la rodilla y de las regiones profundas de la pierna y el muslo.', W('Popliteal_lymph_nodes', 'It receives afferents from the knee-joint, together with those that accompany the genicular arteries.'), W('Femoral_triangle', 'and from the deep lymphatics of the lower limb')],
    ],
    drena: [
      ['Terminan en los nodos inguinales profundos, que drenan hacia arriba en los ilíacos externos.', W('Popliteal_lymph_nodes', 'pass almost entirely alongside the femoral vessels to the deep inguinal lymph nodes'), W('Inguinal_lymph_nodes', 'The deep inguinal lymph nodes drain superiorly to the external iliac lymph nodes')],
      ['Unos pocos eferentes poplíteos acompañan a la vena safena magna y terminan en los inguinales superficiales.', W('Popliteal_lymph_nodes', 'but a few may accompany the great saphenous vein')],
    ],
    modelo: [malla('los nodos tibiales, fibular y poplíteos profundos con los inguinales profundos, junto a los vasos tibiales, poplíteos y femorales'), NOMBRE_DESCRIPTIVO],
  },
  // ── Órganos linfoides ──
  Spleen: {
    tipo: 'organo', ta2: 5159,
    descripcion: [
      ['Órgano linfoide que actúa sobre todo como filtro de la sangre: retira los glóbulos rojos viejos y guarda una reserva de sangre.', W('Spleen', 'it acts primarily as a blood filter'), W('Spleen', 'It removes old red blood cells and holds a reserve of blood')],
      ['Es el mayor acúmulo de tejido linfoide del cuerpo.', W('Spleen', 'The spleen is the largest collection of lymphoid tissue in the body.')],
      ['En el adulto sano mide de 7 a 14 cm de largo.', W('Spleen', 'is approximately 7 to 14 centimetres')],
    ],
    localizacion: [
      ['Está debajo de la parte izquierda del diafragma, bajo las costillas novena, décima y undécima.', W('Spleen', 'the spleen is underneath the left part of the thoracic diaphragm'), W('Spleen', 'It is underneath the ninth, tenth, and eleventh ribs.')],
    ],
    reparo: [
      ['Su hilio, una fisura larga hacia el centro de la cara visceral, es donde entran la arteria y la vena esplénicas.', W('Spleen', 'Near the middle of the spleen is a long fissure, the splenic hilum'), W('Spleen', 'The splenic artery and splenic vein enter the spleen at the splenic hilum.')],
    ],
    recibe: [
      ['No filtra linfa sino sangre, que le llega por la arteria esplénica y las arterias gástricas cortas.', W('Spleen', 'it acts primarily as a blood filter'), W('Spleen', 'Both the short gastric arteries and the splenic artery supply it with blood.')],
      ['Como el timo, solo tiene vasos linfáticos eferentes.', W('Spleen', 'Like the thymus, the spleen possesses only efferent lymphatic vessels.')],
    ],
    drena: [
      ['Su linfa va a los nodos celíacos, que reciben la del bazo, el estómago, el páncreas y el hígado.', W('Celiac_lymph_nodes', 'They receive lymph from the stomach, duodenum, pancreas, spleen, liver, and gall bladder.')],
    ],
    modelo: [
      ['Pieza de Z-Anatomy ajustada al cuerpo de Anato3D. No se dibuja intercalada entre vasos linfáticos: no está en el camino de la linfa como un nodo.', MODELO],
    ],
    notas: [
      ['Sin bazo (por ejemplo, tras extirparlo: esplenectomía) aumenta el riesgo de sepsis por bacterias con cápsula de polisacáridos.', W('Spleen', 'The surgical process to remove the spleen is known as a splenectomy.'), W('Spleen', 'there is an increased risk of sepsis from polysaccharide-encapsulated bacteria')],
    ],
  },
  Left_lobe_of_thymus: null,   // se rellena abajo (los dos lóbulos comparten el texto)
  Palatine_tonsil: {
    tipo: 'organo', ta2: 2853,
    descripcion: [
      ['Masa de tejido linfoide a cada lado del fondo de la garganta: es lo que suele llamarse «amígdala».', W('Palatine_tonsil', 'commonly called the tonsils'), W('Palatine_tonsil', 'located on the left and right sides at the back of the throat')],
      ['Forma parte del anillo de Waldeyer, a la entrada de las vías respiratoria y digestiva.', W('Palatine_tonsil', "It forms part of the Waldeyer's ring"), W('Palatine_tonsil', 'located at the entrance to the upper respiratory and gastrointestinal tracts')],
      ['En el adulto mide hasta unos 2,5 cm de largo, 2 cm de ancho y 1,2 cm de grosor.', W('Tonsil', 'each palatine tonsil normally measures up to 2.5 cm in length, 2.0 cm in width and 1.2 cm in thickness')],
    ],
    localizacion: [
      ['Está en el istmo de las fauces, en la orofaringe.', W('Palatine_tonsil', 'are located in the isthmus of the fauces'), W("Waldeyer's_tonsillar_ring", '2 palatine tonsils (commonly called "the tonsils") located in the oropharynx')],
    ],
    reparo: [
      ['Queda entre los arcos palatogloso y palatofaríngeo del paladar blando.', W('Palatine_tonsil', 'between the palatoglossal arch and the palatopharyngeal arch of the soft palate')],
    ],
    drena: [
      ['Su linfa llega primero a los nodos yugulodigástricos.', W('Jugulodigastric_lymph_node', 'are the first to receive lymphatic drainage from face, mouth, pharynx, and tonsils')],
    ],
    pendientes: { recibe: SIN_AFERENTES },
    modelo: [
      ['Pieza de Z-Anatomy ajustada al cuerpo de Anato3D.', MODELO],
    ],
    notas: [
      ['Su inflamación es la amigdalitis, y en ella suelen aumentar los nodos yugulodigástricos.', W('Palatine_tonsil', 'Tonsillitis is an inflammation of the tonsils'), W('Jugulodigastric_lymph_node', 'Enlarged jugulodigastric lymph nodes are also commonly found in tonsillitis.')],
      ['Alcanza su mayor tamaño en la pubertad y después se atrofia poco a poco.', W('Tonsil', 'The palatine tonsils tend to reach their largest size in puberty, and they gradually undergo atrophy thereafter.')],
    ],
    vias: { drena: ['Jugulodigastric_node'] },
  },
  Pharyngeal_tonsil: {
    tipo: 'organo', ta2: 2865,
    descripcion: [
      ['Masa de tejido linfoide detrás de la cavidad nasal, en el techo y la pared posterior de la nasofaringe; también se llama adenoides.', W('Adenoid', 'It is a mass of lymphoid tissue located behind the nasal cavity, in the roof and the posterior wall of the nasopharynx'), W('Adenoid', 'The adenoid, also known as the pharyngeal tonsil')],
      ['Es la más alta de las amígdalas.', W('Adenoid', 'is the superior-most of the tonsils')],
      ['Tras el nacimiento crece hasta los 5 a 7 años.', W('Adenoid', 'After birth, enlargement begins and continues until the ages of 5 to 7 years.')],
    ],
    localizacion: [
      ['En el techo de la nasofaringe, bajo el hueso esfenoides.', W("Waldeyer's_tonsillar_ring", 'located on the roof of the nasopharynx, under the sphenoid bone')],
    ],
    reparo: [
      ['El hueso esfenoides, por encima; en los niños forma un relieve blando justo por encima y por detrás de la úvula.', W("Waldeyer's_tonsillar_ring", 'under the sphenoid bone'), W('Adenoid', 'just above and behind the uvula')],
    ],
    drena: [
      ['La linfa de la nasofaringe va a los nodos retrofaríngeos.', W('Retropharyngeal_lymph_nodes', 'Their afferents drain the nasal cavities, the nasal part of the pharynx')],
    ],
    pendientes: { recibe: SIN_AFERENTES },
    modelo: [ORGANO_GENERADO],
    notas: [
      ['Cuando crece mucho (hipertrofia adenoidea) puede bloquear el paso del aire por la nariz.', W('Adenoid', 'completely block airflow through the nasal passages')],
    ],
    vias: { drena: ['Retropharyngeal_nodes'] },
  },
  Lingual_tonsil: {
    tipo: 'organo', ta2: 2830,
    descripcion: [
      ['Acúmulo de tejido linfoide en la lámina propia de la raíz de la lengua.', W('Lingual_tonsils', 'are a collection of lymphoid tissue located in the lamina propria of the root of the tongue')],
      ['Está formada por varias pequeñas prominencias; por eso muchos autores hablan de amígdalas linguales, en plural.', W("Waldeyer's_tonsillar_ring", 'Many authors also speak of lingual tonsils (in the plural), because this accumulation of lymphoid tissue consists of several little prominences')],
    ],
    localizacion: [
      ['En la parte posterior de la lengua.', W("Waldeyer's_tonsillar_ring", 'located on the back part of the tongue')],
    ],
    reparo: [
      ['La raíz de la lengua: la amígdala está en su lámina propia.', W('Lingual_tonsils', 'located in the lamina propria of the root of the tongue')],
    ],
    drena: [
      ['Como las demás amígdalas, drena primero en los nodos yugulodigástricos.', W('Jugulodigastric_lymph_node', 'are the first to receive lymphatic drainage from face, mouth, pharynx, and tonsils')],
    ],
    pendientes: { recibe: SIN_AFERENTES },
    modelo: [ORGANO_GENERADO, ['Se representa como una sola pieza, aunque es un conjunto de pequeñas prominencias.', MODELO]],
    vias: { drena: ['Jugulodigastric_node'] },
  },
  Tubal_tonsil: {
    tipo: 'organo', ta2: 2872,
    descripcion: [
      ['Acúmulo de tejido linfoide de la nasofaringe, también llamado amígdala de Gerlach; es uno de los cuatro grupos principales del anillo de Waldeyer.', W('Tubal_tonsil', "also known as Gerlach tonsil, is one of the four main tonsil groups forming Waldeyer's tonsillar ring")],
      ['Suele desarrollarse a partir del tejido linfoide de la amígdala faríngea.', W("Waldeyer's_tonsillar_ring", 'The tubal tonsils usually develop from an accumulation of lymphoid tissue in the pharyngeal tonsil.')],
    ],
    localizacion: [
      ['Está detrás del orificio de la trompa auditiva, en la pared lateral de la nasofaringe.', W('Tubal_tonsil', 'is located posterior to the opening of the Eustachian tube on the lateral wall of the nasopharynx')],
    ],
    reparo: [
      ['El rodete de la trompa (torus tubarius), muy cerca de ella.', W('Tubal_tonsil', 'It is very close to the torus tubarius')],
    ],
    drena: [
      ['La linfa de la nasofaringe y de las trompas auditivas va a los nodos retrofaríngeos.', W('Retropharyngeal_lymph_nodes', 'Their afferents drain the nasal cavities, the nasal part of the pharynx, and the auditory tubes.')],
    ],
    pendientes: { recibe: SIN_AFERENTES },
    modelo: [ORGANO_GENERADO],
    vias: { drena: ['Retropharyngeal_nodes'] },
  },
  // ── Ficha general del nodo: la ven los grupos de nodos que aún no tienen ficha propia ──
  Lymph_node: {
    tipo: 'nodo', ta2: 5192, generica: true,
    descripcion: [
      ['Grupo de nodos (ganglios) linfáticos: órganos pequeños, con forma de riñón u ovalada, que filtran la linfa.', W('Lymph_node', 'Lymph nodes are kidney or oval shaped'), W('Lymph_node', 'acting as filters for foreign particles including cancer cells')],
      ['Su eje largo mide de 2 a 25 mm, con una media de 15 mm.', W('Lymph_node', 'range in size from 2 mm to 25 mm on their long axis, with an average of 15 mm')],
      ['En ellos se concentran los linfocitos B y T.', W('Lymph_node', 'They are major sites of lymphocytes that include B and T cells.')],
    ],
    localizacion: [
      ['En el adulto hay unos 450, agrupados por regiones y más concentrados en el tronco; la mayoría están junto a otras estructuras grandes, como la aorta o la tráquea.', W('Lymph_node', 'There are about 450 lymph nodes in the adult.'), W('Lymph_node', 'are more concentrated near and within the trunk, and are divided into groups'), W('Lymph_node', 'Most lymph nodes lie within the trunk adjacent to other major structures in the body - such as the paraaortic lymph nodes and the tracheobronchial lymph nodes')],
    ],
    reparo: [
      ['Algunos se pueden palpar cuando aumentan de tamaño, y a veces sin aumentar: los axilares, los del cuello y los inguinales.', W('Lymph_node', 'Some lymph nodes can be felt when enlarged (and occasionally when not), such as the axillary lymph nodes under the arm, the cervical lymph nodes of the head and neck and the inguinal lymph nodes near the groin crease.')],
    ],
    recibe: [
      ['La linfa entra por el lado convexo del nodo a través de varios vasos aferentes.', W('Lymph_node', 'Lymph enters the convex side of a lymph node through multiple afferent lymphatic vessels')],
    ],
    drena: [
      ['Sale por los vasos eferentes, que abandonan el nodo por el hilio, en su lado cóncavo; de allí va a otro nodo, a una vena o a un conducto linfático mayor.', W('Lymph_node', 'exiting at the hilum on the concave side'), W('Lymphatic_vessel', 'from where the lymph may travel to another lymph node, may be returned to a vein, or may travel to a larger lymph duct')],
    ],
    modelo: [
      ['Este grupo aún no tiene ficha propia: esta es la ficha general del nodo linfático.', MODELO],
      ['En este modelo la forma y el tamaño de cada nodo, y el número de nodos de cada grupo, son esquemáticos: no son medidas de una persona.', MODELO],
    ],
    notas: [
      ['Cuando se inflaman o aumentan de tamaño (linfadenopatía) pueden notarse firmes o dolorosos.', W('Lymph_node', 'When inflamed or enlarged, lymph nodes can be firm or tender.'), W('Lymph_node', 'Lymphadenopathy refers to glands that are enlarged or swollen.')],
      ['Su estado es muy importante para la estadificación del cáncer.', W('Lymph_node', 'The condition of lymph nodes is very important in cancer staging')],
    ],
  },
};

// Lóbulos del timo: el mismo texto, con su término de la TA2.
const TIMO = {
  tipo: 'organo',
  descripcion: [
    ['Lóbulo del timo, el órgano linfoide primario en el que maduran los linfocitos T.', W('Thymus', 'is a specialized primary lymphoid organ of the immune system'), W('Thymus', 'Within the thymus, T cells mature.')],
    ['El timo tiene dos lóbulos; cada uno tiene una médula central y una corteza externa, rodeadas por una cápsula.', W('Thymus', 'It is made up of two lobes, each consisting of a central medulla and an outer cortex, surrounded by a capsule.')],
    ['Los dos lóbulos difieren algo de tamaño, y el izquierdo suele estar más alto que el derecho.', W('Thymus', 'The two lobes differ slightly in size, with the left lobe usually higher than the right.')],
  ],
  localizacion: [
    ['Está en el mediastino anterior y superior, detrás del esternón y delante del corazón; los lóbulos van desde debajo de la tiroides hasta el cartílago de la cuarta costilla.', W('Thymus', 'in the anterior superior mediastinum, behind the sternum, and in front of the heart'), W('Thymus', 'stretch from below the thyroid in the neck to as low as the cartilage of the fourth rib')],
  ],
  reparo: [
    ['Se apoya en el pericardio, y una capa de fascia lo separa del arco aórtico y los grandes vasos; la vena braquiocefálica izquierda puede incluso quedar dentro de él.', W('Thymus', 'rests on the pericardium, and is separated from the aortic arch and great vessels by a layer of fascia'), W('Thymus', 'The left brachiocephalic vein may even be embedded within the thymus.')],
  ],
  recibe: [
    ['No le llegan vasos linfáticos: los suyos solo salen de él, junto a las arterias y las venas.', W('Thymus', 'Lymphatic vessels travel only away from the thymus, accompanying the arteries and veins.')],
  ],
  drena: [
    ['Sus vasos linfáticos drenan en los nodos braquiocefálicos, traqueobronquiales y paraesternales.', W('Thymus', 'These drain into the brachiocephalic, tracheobronchial, and parasternal lymph nodes.')],
  ],
  modelo: [
    ['Pieza de Z-Anatomy ajustada al cuerpo de Anato3D; su tamaño es orientativo.', MODELO],
    ['El tamaño del timo cambia con la edad: crece hasta la pubertad y desde el comienzo de la adolescencia se reduce y su tejido se va sustituyendo por grasa.', W('Thymus', 'It increases in size until puberty'), W('Thymus', 'By the early teens, the thymus begins to decrease in size and activity and its tissue is gradually replaced by fatty tissue.')],
  ],
  vias: { drena: ['Brachiocephalic_nodes', 'Superior_tracheobronchial_nodes', 'Parasternal_nodes'] },
};
FICHAS.Left_lobe_of_thymus = { ...TIMO, ta2: 7224 };
FICHAS.Right_lobe_of_thymus = { ...TIMO, ta2: 7223 };

export default FICHAS;

// ── Descripciones de los grupos (la ficha de grupo). nombre y latín: los del modelo, para que no cambie su traducción.
const MODELO_REPRESENTATIVO = ['En este modelo el número de nodos de cada grupo es representativo, no el real.', MODELO];
export const GRUPOS_LINF = {
  Lymph_nodes: {
    nombre: 'Nodos linfáticos', latin: 'Nodi lymphoidei',
    descripcion: [
      ['Los nodos (ganglios) linfáticos del cuerpo, por regiones. En el adulto hay unos 450, y la mayoría están en el tronco.', W('Lymph_node', 'There are about 450 lymph nodes in the adult.'), W('Lymph_node', 'are more concentrated near and within the trunk, and are divided into groups')],
      ['El drenaje linfático varía de una persona a otra, e incluso entre los dos lados del mismo cuerpo.', W('Lymph_node', 'The lymphatic drainage patterns are different from person to person and even asymmetrical on each side of the same body.')],
      MODELO_REPRESENTATIVO,
    ],
  },
  Lymph_nodes_of_head: {
    nombre: 'Nodos de la cabeza', latin: 'Nodi lymphoidei capitis',
    descripcion: [
      ['Grupos de nodos de la cabeza, casi todos superficiales, como los occipitales, que drenan el cuero cabelludo de la nuca.', W('Occipital_lymph_nodes', 'a group of 1-3 superficial lymph nodes of the head situated in the occipital region that drain part of the scalp of the occiput')],
      ['Toda la linfa de la cabeza acaba en los nodos cervicales profundos, directamente o a través de otros nodos.', W('Deep_cervical_lymph_nodes', 'All lymphatic vessels of the head and neck ultimately drain to the deep cervical lymph nodes - either by way of other lymph nodes or directly from tissues.')],
      MODELO_REPRESENTATIVO,
    ],
  },
  Lymph_nodes_of_neck: {
    nombre: 'Nodos del cuello', latin: 'Nodi lymphoidei colli',
    descripcion: [
      ['En el cuello hay unos 300 nodos.', W('Cervical_lymph_nodes', 'There are approximately 300 lymph nodes in the neck')],
      ['La cadena cervical profunda acompaña a la vena yugular interna dentro de la vaina carotídea, y sus eferentes forman el tronco yugular de su lado.', W('Deep_cervical_lymph_nodes', 'form a chain along the internal jugular vein within the carotid sheath'), W('Deep_cervical_lymph_nodes', 'Efferents of the deep cervical lymph nodes form the ipsilateral jugular trunk.')],
      ['Los cervicales superficiales están cerca de la superficie, junto a la vena yugular externa.', W('Superficial_cervical_lymph_nodes', 'lie near the surface of the neck'), W('Superficial_cervical_lymph_nodes', 'Some sources state simply that they lie along the external jugular vein')],
      ['En clínica se usan niveles numerados; este modelo sigue los grupos de la Terminologia Anatomica.', W('Cervical_lymph_nodes', 'The most commonly used system is one based on a classification of the lymph nodes into numbered groupings'), MODELO],
      MODELO_REPRESENTATIVO,
    ],
  },
  Lymph_nodes_of_upper_limb: {
    nombre: 'Nodos del miembro superior', latin: 'Nodi lymphoidei membri superioris',
    descripcion: [
      ['Los nodos axilares, entre 20 y 49, reciben los vasos del miembro superior, de los cuadrantes laterales de la mama y de la pared del tórax y del abdomen por encima del ombligo.', W('Axillary_lymph_nodes', 'Between 20 and 49 in number, they drain lymph vessels from the lateral quadrants of the breast'), W('Axillary_lymph_nodes', 'the superficial lymph vessels from thin walls of the chest and the abdomen above the level of the navel, and the vessels from the upper limb')],
      ['Fuera de la axila hay nodos más pequeños: los supratrocleares, por encima del epicóndilo medial, y los infraclaviculares (deltopectorales), junto a la vena cefálica.', W('Supratrochlear_lymph_nodes', 'are placed above the medial epicondyle of the humerus'), W('Deltopectoral_lymph_nodes', 'are found beside the cephalic vein')],
      ['Alrededor del 75 % de la linfa de la mama drena en los nodos axilares.', W('Axillary_lymph_nodes', 'About 75% of lymph from the breasts drains into the axillary lymph nodes')],
      MODELO_REPRESENTATIVO,
    ],
  },
  Thoracic_lymph_nodes: {
    nombre: 'Nodos del tórax', latin: 'Nodi lymphoidei thoracis',
    descripcion: [
      ['La Terminologia Anatomica divide los nodos del tórax en parietales, en la pared, y en mediastínicos y pulmonares.', TA(5248), TA(5254), TA(5265)],
      ['Los paraesternales están en el extremo anterior de los espacios intercostales, junto a la arteria torácica interna, y los intercostales en la parte posterior de esos espacios.', W('Parasternal_lymph_nodes', 'are placed at the anterior ends of the intercostal spaces, by the side of the internal thoracic artery'), W('Intercostal_lymph_nodes', 'occupy the posterior parts of the intercostal spaces')],
      ['Alrededor de la bifurcación de la tráquea están los traqueobronquiales; en el hilio de cada pulmón, los broncopulmonares; y dentro del pulmón, los intrapulmonares.', W('Tracheobronchial_lymph_nodes', 'are located around the division of trachea and main bronchi'), W('Tracheobronchial_lymph_nodes', 'Bronchopulmonary nodes (hilar nodes) situate in the hilum of each lung.'), W('Tracheobronchial_lymph_nodes', 'Pulmonary nodes are embedded the lung substance on the larger branches of the bronchi.')],
      ['En este modelo no hay nodos broncopulmonares (hiliares): Z-Anatomy no los trae.', TA(5266), MODELO],
      MODELO_REPRESENTATIVO,
    ],
  },
  Abdominal_lymph_nodes: {
    nombre: 'Nodos del abdomen', latin: 'Nodi lymphoidei abdominis',
    descripcion: [
      ['La Terminologia Anatomica divide los nodos del abdomen en parietales y viscerales.', TA(5269), TA(5281)],
      ['Los preaórticos están delante de la aorta, alrededor del origen del tronco celíaco y de las arterias mesentéricas superior e inferior, y reciben la linfa de los órganos que irrigan esas arterias.', W('Preaortic_lymph_nodes', 'The preaortic lymph nodes lie in front of the aorta'), W('Preaortic_lymph_nodes', 'arranged around the origins of the corresponding arteries'), W('Preaortic_lymph_nodes', 'their principal afferents are derived from the organs supplied by the three arteries with which they are associated')],
      ['Los lumbares, a los lados de la aorta y la vena cava inferior, reciben la linfa de la pelvis, los riñones y las gónadas, y sus eferentes forman los troncos lumbares.', W('Lumbar_lymph_nodes', 'the efferents of the common iliac lymph nodes'), W('Lumbar_lymph_nodes', 'the lymphatics from the kidney and suprarenal gland'), W('Lumbar_lymph_nodes', 'the lymphatics from the testis in the male, and from the ovary'), W('Lumbar_lymph_nodes', 'converge to form the right and left lumbar trunks')],
      MODELO_REPRESENTATIVO,
    ],
  },
  Pelvic_lymph_nodes: {
    nombre: 'Nodos de la pelvis', latin: 'Nodi lymphoidei pelvis',
    descripcion: [
      ['Los nodos de la pelvis acompañan a las arterias ilíacas: los ilíacos comunes, por detrás y a los lados de la ilíaca común; los externos, a lo largo de los vasos ilíacos externos; y los internos, alrededor de la ilíaca interna y sus ramas.', W('Common_iliac_lymph_nodes', 'are grouped behind and on the sides of the common iliac artery'), W('External_iliac_lymph_nodes', 'lie along the external iliac vessels'), W('Internal_iliac_lymph_nodes', 'surround the internal iliac artery and its branches')],
      ['Los internos reciben la linfa de todas las vísceras de la pelvis, de la parte profunda del periné y de la nalga y la parte posterior del muslo.', W('Internal_iliac_lymph_nodes', 'they receive lymphatics from all the pelvic viscera, from the deeper parts of the perineum'), W('Internal_iliac_lymph_nodes', 'from the buttock and back of the thigh')],
      ['La linfa del ovario y del testículo no pasa por ellos: va a los nodos lumbares.', W('Internal_iliac_lymph_nodes', 'It does not receive lymph from the ovary or testis, which drain to the paraaortic lymph nodes.')],
      MODELO_REPRESENTATIVO,
    ],
  },
  Lymph_nodes_of_lower_limb: {
    nombre: 'Nodos del miembro inferior', latin: 'Nodi lymphoidei membri inferioris',
    descripcion: [
      ['Los nodos inguinales están en el triángulo femoral: los superficiales, alrededor del hiato safeno, y los profundos, de 3 a 5, mediales a la vena femoral.', W('Inguinal_lymph_nodes', 'They are situated in the femoral triangle of the inguinal region.'), W('Inguinal_lymph_nodes', 'located at the middle of the saphenous opening'), W('Inguinal_lymph_nodes', 'The deep inguinal lymph nodes are 3-5 in number.'), W('Inguinal_lymph_nodes', 'They lie medial to the femoral vein deep to the cribriform fascia.')],
      ['Los poplíteos, unos seis o siete, están en la grasa de la fosa poplítea.', W('Popliteal_lymph_nodes', 'some six or seven in number, are embedded in the fat contained in the popliteal fossa')],
      ['Los inguinales profundos drenan hacia arriba en los ilíacos externos.', W('Inguinal_lymph_nodes', 'The deep inguinal lymph nodes drain superiorly to the external iliac lymph nodes')],
      MODELO_REPRESENTATIVO,
    ],
  },
  Lymphatic_trunks_and_ducts: {
    nombre: 'Troncos y conductos linfáticos', latin: 'Trunci et ductus lymphatici',
    descripcion: [
      ['Los grandes vasos linfáticos: los troncos que reúnen la linfa de cada región y los dos conductos que la devuelven a la sangre.', W('Lymphatic_system', 'Lymph then passes into much larger lymph vessels known as lymph ducts.'), W('Lymph_duct', 'A lymph duct (or lymphatic duct) is a great lymphatic vessel that empties lymph into one of the subclavian veins.')],
      ['El conducto torácico recoge la linfa de casi todo el cuerpo, y el conducto linfático derecho, la del miembro superior derecho y la mitad derecha de la cabeza, el cuello y el tórax.', W('Thoracic_duct', 'It also collects most of the lymph in the body'), W('Lymph_duct', 'The right lymphatic duct drains lymph from the right upper limb, right side of thorax and right halves of head and neck.')],
      ['Cada conducto desemboca en el ángulo venoso de su lado, donde la yugular interna y la subclavia se unen para formar la vena braquiocefálica.', W('Venous_angle', 'is the junction where the ipsilateral internal jugular vein and subclavian vein unite to form the ipsilateral brachiocephalic vein'), W('Venous_angle', 'The thoracic duct drains at the left venous angle, and the right lymphatic duct drains at the right venous angle.')],
      ['En este modelo todos son trazados esquemáticos generados para Anato3D, porque Z-Anatomy no los incluye; cada ficha dice qué variante se representa.', MODELO],
    ],
  },
  Lymphatic_vessels: {
    nombre: 'Vasos linfáticos', latin: 'Vasa lymphatica',
    descripcion: [
      ['Vasos de pared fina que llevan la linfa; tienen válvulas.', W('Lymphatic_vessel', 'are thin-walled vessels (tubes), structured like blood vessels, that carry lymph'), W('Lymphatic_vessel', 'The lymphatic vessels contain valves.')],
      ['Los que llegan a un nodo se llaman aferentes, y los que salen de él, eferentes.', W('Lymphatic_vessel', 'Lymph vessels that carry lymph to a lymph node are called afferent lymph vessels, and those that carry it from a lymph node are called efferent lymph vessels')],
      ['En este modelo son colectores esquemáticos: una malla por región y lado que une los nodos entre sí y con su tronco, sin representar cada vaso real.', MODELO],
    ],
  },
  Pharyngeal_lymphoid_ring: {
    nombre: 'Anillo linfático de la faringe', latin: 'Anulus lymphoideus pharyngis',
    descripcion: [
      ['Anillo de órganos linfoides en la faringe (anillo de Waldeyer): la amígdala faríngea, las dos tubáricas, las dos palatinas y las linguales.', W("Waldeyer's_tonsillar_ring", 'is a ringed arrangement of lymphoid organs in the pharynx'), W('Tonsil', 'consists of the adenoid tonsil (or pharyngeal tonsil), two tubal tonsils, two palatine tonsils, and the lingual tonsils')],
      ['Rodea la nasofaringe y la orofaringe, con parte de su tejido por encima del paladar blando y parte por debajo.', W("Waldeyer's_tonsillar_ring", "Waldeyer's ring surrounds the naso- and oropharynx, with some of its tonsillar tissue located above and some below the soft palate")],
      ['Z-Anatomy solo trae las amígdalas palatinas; las demás, si aparecen en este modelo, son formas esquemáticas generadas para Anato3D.', MODELO],
    ],
  },
  Thymus: {
    nombre: 'Timo', latin: 'Thymus',
    descripcion: [
      ['Órgano linfoide primario en el que maduran los linfocitos T, formado por dos lóbulos.', W('Thymus', 'is a specialized primary lymphoid organ of the immune system'), W('Thymus', 'Within the thymus, T cells mature.'), W('Thymus', 'It is made up of two lobes')],
      ['Está en el mediastino anterior y superior, detrás del esternón y delante del corazón.', W('Thymus', 'in the anterior superior mediastinum, behind the sternum, and in front of the heart')],
    ],
  },
};
