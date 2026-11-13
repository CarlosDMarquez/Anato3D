// Fichas de los nodos del tórax (parietales, mediastínicos y pulmonares): grupo «Thoracic_lymph_nodes».
// Formato y reglas: ./formato.js (cada frase con su fuente; MODELO solo en «En este modelo»). Clave = nombre de la pieza
// sin _L/_R. Comprobar: node scripts/linfatico-citas.mjs comprobar && node scripts/check-cards.mjs
// BORRADOR redactado con IA, sin revisión médica. Tabla de fuentes: docs/fuentes/linfatico-torax.md.
//
// Fuentes: las páginas de Wikipedia en inglés de los nodos paraesternales, intercostales, diafragmáticos superiores y
// traqueobronquiales incorporan texto de dominio público del Gray de 1918; el resto sale de las páginas de sus reparos
// (arteria torácica interna, espacio intercostal, vena ácigos, ligamento arterioso, ventana aortopulmonar, carina) y de
// «Heart», «Esophagus» y «List of lymph nodes of the human body». Ninguna fuente libre consultada (Wikipedia en inglés y en
// español) describe por separado los nodos braquiocefálicos, prepericárdicos, pericárdicos laterales, yuxtaesofágicos y
// prevertebrales, ni los dos nodos de nombre entre paréntesis: de ellos se afirma la nomenclatura de la TA2, lo que dicen
// las fuentes de su reparo y lo que se ve en el modelo; lo demás queda en «pendientes».
//
// Las frases «En este modelo» con números (nodos por pieza, vaso más cercano, distancias) salen de las medidas de la
// construcción en build/linfatico/nodos-{male,female}.json y relaciones-{male,female}.json (12 nov 2026).
import { W, ES, TA, MODELO } from './formato.js';

// ── Frases comunes ───────────────────────────────────────────────────────────────────────────────────────────────────
const REPRESENTATIVO = ['En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.', MODELO];
const UN_NODO = ['En este modelo el nodo se representa con una forma y un tamaño esquemáticos.', MODELO];
const PARENTESIS = (n) => ['En la Terminologia Anatomica 2 su nombre figura entre paréntesis.', TA(n)];
const SIN_FUENTE = 'Ninguna fuente libre consultada (Wikipedia en inglés y en español) lo describe para este grupo.';
const SIN_FUENTE_NODO = 'Ninguna fuente libre consultada (Wikipedia en inglés y en español) lo describe para este nodo.';
const RUTA_SIN_FUENTE = (a, uno = false) => [`En este modelo sus colectores esquemáticos ${uno ? 'lo' : 'los'} unen ${a.startsWith('el ') ? `al ${a.slice(3)}` : `a ${a}`}; ninguna fuente consultada describe esa conexión.`, MODELO];

// Parietales y mediastínicos (clasificación de la TA2 y del Gray de 1918).
const PARIETALES = ['La Terminologia Anatomica 2 los cuenta entre los nodos (ganglios) parietales del tórax, los que están en la pared torácica.', TA(5248), W('Thoracic_lymph_nodes', 'the former being situated in the thoracic wall')];
const MEDIASTINICOS = (n) => ['La Terminologia Anatomica 2 los cuenta entre los nodos (ganglios) mediastínicos.', TA(5254), TA(n)];
const MEDIASTINO_GRUPOS = ['Los nodos del mediastino forman varios grupos, sobre todo a lo largo de la tráquea, a lo largo del esófago y entre el pulmón y el diafragma.', W('List_of_lymph_nodes_of_the_human_body', 'especially along the trachea (5 groups), along the esophagus and between the lung and the diaphragm')];

// Conjunto traqueobronquial (Gray 1918 en Wikipedia): paratraqueales, traqueobronquiales, broncopulmonares y pulmonares.
const TB_CUATRO = ['Alrededor de la división de la tráquea y de los bronquios principales hay cuatro grupos principales de nodos: paratraqueales, traqueobronquiales, broncopulmonares y pulmonares.', W('Tracheobronchial_lymph_nodes', 'are located around the division of trachea and main bronchi'), W('Tracheobronchial_lymph_nodes', 'These lymph nodes form four main groups including paratracheal, tracheobronchial, bronchopulmonary and pulmonary nodes.')];
const TB_TRES = ['Los traqueobronquiales propiamente dichos son tres: un superior derecho, un superior izquierdo y un inferior.', W('Tracheobronchial_lymph_nodes', 'Tracheobronchial nodes can be divided into three nodes including left and right superior tracheobronchial nodes, and the inferior tracheobronchial node.')];
const TB_AFERENTES = ['Los aferentes del conjunto traqueobronquial drenan los pulmones y los bronquios, la parte torácica de la tráquea y el corazón; a él llegan también algunos eferentes de los nodos mediastínicos posteriores.', W('Tracheobronchial_lymph_nodes', 'The afferents of the tracheobronchial glands drain the lungs and bronchi, the thoracic part of the trachea and the heart; some of the efferents of the posterior mediastinal glands also end in this group.')];
const TB_EFERENTES = ['Los eferentes del conjunto traqueobronquial suben sobre la tráquea y se unen con los de los nodos mamarios internos y mediastínicos anteriores para formar los troncos broncomediastínicos derecho e izquierdo.', W('Tracheobronchial_lymph_nodes', 'Their efferent vessels ascend upon the trachea and unite with efferents of the internal mammary and anterior mediastinal glands to form the right and left bronchomediastinal trunks.')];
const CARINA = ['La carina, la cresta que separa las entradas de los dos bronquios principales, está en el extremo inferior de la tráquea, en general a la altura del plano que pasa por detrás por el disco entre T4 y T5 y por delante por el ángulo del esternón.', ES('Carina_de_la_tráquea', 'que separa las aberturas de los bronquios principales izquierdo y derecho'), ES('Carina_de_la_tráquea', 'La carina se sitúa en el extremo inferior de la tráquea, generalmente a la altura del plano torácico transverso'), ES('Carina_de_la_tráquea', 'el disco intervertebral entre las vértebras torácicas T4 y T5'), ES('Carina_de_la_tráquea', 'el segundo cartílago costal y el ángulo de Louis')];
const CARINA_ACIGOS = ['A la derecha de la tráquea pasa la vena ácigos, que cruza por encima del bronquio principal derecho a la altura de la carina; el arco aórtico cruza hacia la izquierda de la tráquea.', ES('Carina_de_la_tráquea', 'La vena ácigos discurre por el lado derecho de la tráquea, cruzando por encima del bronquio principal derecho a nivel de la carina.'), ES('Carina_de_la_tráquea', 'donde el arco aórtico cruza hacia la izquierda de la tráquea')];
const TB_MODELO_CADENA = ['En este modelo los colectores esquemáticos encadenan intrapulmonares, traqueobronquiales inferiores, traqueobronquiales superiores y paratraqueales hasta el tronco broncomediastínico; la fuente describe el drenaje del conjunto, sin ese orden.', MODELO];
const ESTACIONES = ['Para estadificar el cáncer de pulmón, los nodos del tórax se agrupan en catorce estaciones numeradas: las 1 a 9 son del mediastino y las 10 a 14, hiliares y periféricas.', W('Lung_cancer_staging', 'There are fourteen numbered nodal stations.'), W('Lung_cancer_staging', 'Lymph nodes considered to be in the mediastinum are stations 1–9, which are thus potential N2 or N3 locations, while stations 10-14 are hilar and peripheral nodes, and thus potential N1 locations.')];

// Diafragmáticos superiores (Gray 1918 en Wikipedia).
const SD = 'Superior_diaphragmatic_lymph_nodes';

export default {
  Parasternal_nodes: {
    tipo: 'nodo', ta2: 5250,
    descripcion: [
      ['Los nodos (ganglios) paraesternales, también llamados esternales, son nodos de la pared anterior del tórax, junto al esternón.', W('Parasternal_lymph_nodes', 'The parasternal lymph nodes (or sternal glands)'), W('Breast', 'the parasternal nodes (beside the sternum bone)')],
      PARIETALES,
    ],
    localizacion: [
      ['Están en el extremo anterior de los espacios intercostales, al lado de la arteria torácica interna.', W('Parasternal_lymph_nodes', 'are placed at the anterior ends of the intercostal spaces, by the side of the internal thoracic artery')],
    ],
    reparo: [
      ['La arteria torácica interna, que baja por dentro de la caja torácica a alrededor de 1 cm del borde del esternón; esa distancia crece hacia abajo, hasta 1,1–1,3 cm en el sexto espacio intercostal.', W('Parasternal_lymph_nodes', 'by the side of the internal thoracic artery'), W('Internal_thoracic_artery', 'It travels downward on the inside of the rib cage, approximately 1 cm from the sides of the sternum'), W('Internal_thoracic_artery', 'The gap between the artery and lateral border of the sternum increases when going downwards, up to 1.1 cm to 1.3 cm at the sixth intercostal space.')],
    ],
    recibe: [
      ['Reciben aferentes de la mama, de las partes profundas de la pared anterior del abdomen por encima del ombligo, de la cara superior del hígado (a través de un pequeño grupo de nodos situado detrás de la apófisis xifoides) y de las partes profundas de la pared anterior del tórax.', W('Parasternal_lymph_nodes', 'They derive afferents from the mamma; from the deeper structures of the anterior abdominal wall above the level of the umbilicus; from the upper surface of the liver through a small group of glands which lie behind the xiphoid process; and from the deeper parts of the anterior portion of the thoracic wall.')],
      ['Alrededor del 25 % de la linfa de la mama va a los nodos paraesternales; el 75 % va a los nodos axilares del mismo lado.', W('Breast', 'Approximately 75% of the lymph from the breast travels to the axillary lymph nodes on the same side of the body, while 25% of the lymph travels to the parasternal nodes (beside the sternum bone).')],
      ['También les llegan los eferentes del grupo anterior de los nodos diafragmáticos superiores.', W(SD, 'The efferent vessels of the anterior set pass to the parasternal lymph nodes.')],
    ],
    drena: [
      ['Sus eferentes suelen unirse en un solo tronco a cada lado, que puede abrirse directamente en la unión de la yugular interna y la subclavia; el derecho puede unirse también al tronco subclavio derecho y el izquierdo, al conducto torácico.', W('Parasternal_lymph_nodes', 'Their efferents usually unite to form a single trunk on either side; this may open directly into the junction of the internal jugular and subclavian veins, or that of the right side may join the right subclavian trunk, and that of the left the thoracic duct.')],
      ['Drenan en los troncos broncomediastínicos, como los nodos intercostales superiores.', W('Parasternal_lymph_nodes', 'The parasternal lymph nodes drain into the bronchomediastinal trunks, in a similar fashion to the upper intercostal lymph nodes.')],
    ],
    modelo: [
      REPRESENTATIVO,
      ['En este modelo hay ocho nodos a cada lado, todos a 5 mm o menos de la arteria o las venas torácicas internas, en el hombre y en la mujer.', MODELO],
      ['En este modelo sus colectores esquemáticos llevan la linfa al tronco broncomediastínico de su lado.', MODELO],
    ],
    vias: { recibe: ['Superior_diaphragmatic_nodes'], drena: ['Bronchomediastinal_trunk', 'Subclavian_trunk', 'Thoracic_duct'] },
  },

  Intercostal_nodes: {
    tipo: 'nodo', ta2: 5251,
    descripcion: [
      ['Los nodos (ganglios) intercostales son nodos de la pared posterior del tórax, dentro de los espacios intercostales.', W('Intercostal_lymph_nodes', 'The intercostal lymph nodes (intercostal glands) occupy the posterior parts of the intercostal spaces'), W('Intercostal_space', 'intercostal lymph nodes')],
      PARIETALES,
    ],
    localizacion: [
      ['Ocupan la parte posterior de los espacios intercostales, junto a los vasos intercostales.', W('Intercostal_lymph_nodes', 'occupy the posterior parts of the intercostal spaces, in relation to the intercostal vessels')],
    ],
    reparo: [
      ['Los vasos intercostales, en la parte posterior de cada espacio.', W('Intercostal_lymph_nodes', 'in relation to the intercostal vessels')],
      ['En cada espacio, el paquete vasculonervioso va entre los músculos intercostal interno e íntimo, con la vena arriba, la arteria en medio y el nervio abajo.', W('Intercostal_space', 'Neurovascular bundles are located between the internal intercostal muscle and the innermost intercostal muscle.'), W('Intercostal_space', 'The neurovascular bundle has a strict order of vein-artery-nerve (VAN), from top to bottom.')],
    ],
    recibe: [
      ['Reciben los linfáticos profundos de la cara posterolateral del tórax; algunos de esos vasos pasan antes por pequeños nodos intercostales laterales.', W('Intercostal_lymph_nodes', 'They receive the deep lymphatics from the postero-lateral aspect of the chest; some of these vessels are interrupted by small lateral intercostal glands.')],
    ],
    drena: [
      ['Los eferentes de los nodos de los cuatro o cinco espacios inferiores se unen en un tronco que baja y se abre en la cisterna del quilo o en el comienzo del conducto torácico.', W('Intercostal_lymph_nodes', 'The efferents of the glands in the lower four or five spaces unite to form a trunk, which descends and opens either into the cisterna chyli or into the commencement of the thoracic duct.')],
      ['Los de los espacios superiores terminan, en el lado izquierdo, en el conducto torácico y, en el derecho, en el conducto linfático derecho.', W('Intercostal_lymph_nodes', 'The efferents of the glands in the upper spaces of the left side end in the thoracic duct; those of the corresponding right spaces, in the right lymphatic duct.')],
      ['La página de los nodos paraesternales dice además que los intercostales superiores drenan, como ellos, en los troncos broncomediastínicos.', W('Parasternal_lymph_nodes', 'The parasternal lymph nodes drain into the bronchomediastinal trunks, in a similar fashion to the upper intercostal lymph nodes.')],
    ],
    modelo: [
      REPRESENTATIVO,
      ['En este modelo hay doce nodos a cada lado.', MODELO],
      ['En este modelo los colectores esquemáticos de los dos lados llevan la linfa al conducto torácico; la terminación de los espacios superiores derechos en el conducto linfático derecho no se representa.', MODELO],
    ],
    vias: { drena: ['Thoracic_duct', 'Cisterna_chyli', 'Right_lymphatic_duct', 'Bronchomediastinal_trunk'] },
  },

  Superior_diaphragmatic_nodes: {
    tipo: 'nodo', ta2: 5253,
    descripcion: [
      ['Los nodos (ganglios) diafragmáticos superiores están sobre la cara torácica del diafragma y forman tres grupos: anterior, medio y posterior.', W(SD, 'lie on the thoracic aspect of the diaphragm, and consist of three sets – anterior, middle, and posterior')],
      ['La Terminologia Anatomica 2 los cuenta entre los nodos parietales del tórax.', TA(5248), TA(5253)],
    ],
    localizacion: [
      ['El grupo anterior tiene dos o tres nodos pequeños detrás de la base de la apófisis xifoides y uno o dos a cada lado, cerca de la unión de la séptima costilla con su cartílago.', W(SD, 'two or three small nodes behind the base of the xiphoid process'), W(SD, 'one or two nodes on either side near the junction of the seventh rib with its cartilage')],
      ['El grupo medio tiene dos o tres nodos a cada lado, cerca de donde los nervios frénicos entran en el diafragma; en el lado derecho, algunos están dentro del saco fibroso del pericardio, delante de la terminación de la vena cava inferior.', W(SD, 'The middle set consists of two or three nodes on either side close to where the phrenic nerves enter the diaphragm.'), W(SD, 'On the right side some of the lymph nodes of this group lie within the fibrous sac of the pericardium, on the front of the termination of the inferior vena cava.')],
      ['El grupo posterior tiene unos pocos nodos en la cara posterior de los pilares del diafragma.', W(SD, 'The posterior set consists of a few nodes situated on the back of the crura of the diaphragm')],
    ],
    reparo: [
      ['La cara superior del diafragma: la apófisis xifoides para el grupo anterior, la entrada de los nervios frénicos y la terminación de la vena cava inferior para el medio, y los pilares del diafragma para el posterior.', W(SD, 'behind the base of the xiphoid process'), W(SD, 'close to where the phrenic nerves enter the diaphragm'), W(SD, 'on the front of the termination of the inferior vena cava'), W(SD, 'situated on the back of the crura of the diaphragm')],
    ],
    recibe: [
      ['Los nodos anteriores de detrás de la apófisis xifoides reciben aferentes de la cara convexa del hígado, y los de junto a la séptima costilla, vasos de la parte anterior del diafragma.', W(SD, 'which receive afferents from the convex surface of the liver'), W(SD, 'which receive lymphatic vessels from the front part of the diaphragm')],
      ['El grupo medio recibe la linfa de la parte media del diafragma; los nodos del lado derecho reciben también aferentes de la cara convexa del hígado.', W(SD, 'The afferents of this set are derived from the middle part of the diaphragm, those on the right side also receiving afferents from the convex surface of the liver.')],
    ],
    drena: [
      ['Los eferentes del grupo anterior van a los nodos paraesternales.', W(SD, 'The efferent vessels of the anterior set pass to the parasternal lymph nodes.')],
      ['Los del grupo medio van a los nodos mediastínicos posteriores.', W(SD, 'Their efferents pass to the posterior mediastinal lymph nodes.')],
      ['El grupo posterior está conectado, por un lado, con los nodos lumbares y, por el otro, con los mediastínicos posteriores.', W(SD, 'connected on one side with the lumbar lymph nodes and on the other with the posterior mediastinal nodes')],
    ],
    modelo: [
      REPRESENTATIVO,
      ['En este modelo hay seis nodos sobre el diafragma, la mayoría junto a la porción torácica de la vena cava inferior; el modelo no separa los tres grupos que describe la fuente.', MODELO],
      ['En este modelo los colectores esquemáticos los unen a los nodos paraesternales y a los yuxtaesofágicos; la fuente habla de nodos mediastínicos posteriores, sin nombrar los yuxtaesofágicos.', MODELO],
    ],
    vias: { drena: ['Parasternal_nodes'] },
  },

  Brachiocephalic_nodes: {
    tipo: 'nodo', ta2: 5255,
    descripcion: [MEDIASTINICOS(5255), MEDIASTINO_GRUPOS],
    recibe: [
      ['Les llega el colector linfático derecho del corazón: recorre la aurícula derecha y la parte del ventrículo derecho que se apoya en el diafragma, suele pasar por delante de la aorta ascendente y termina en un nodo braquiocefálico.', W('Heart', 'The right vessel travels along the right atrium and the part of the right ventricle sitting on the diaphragm.'), W('Heart', 'It usually then travels in front of the ascending aorta and then ends in a brachiocephalic node.')],
    ],
    modelo: [
      REPRESENTATIVO,
      ['En este modelo hay tres nodos, todos junto a la vena braquiocefálica derecha.', MODELO],
      RUTA_SIN_FUENTE('los nodos pericárdicos laterales y al tronco broncomediastínico'),
    ],
    pendientes: { localizacion: SIN_FUENTE, reparo: SIN_FUENTE, drena: SIN_FUENTE },
  },

  Node_of_ligamentum_arteriosum: {
    tipo: 'nodo', ta2: 5256,
    descripcion: [
      ['Nodo (ganglio) mediastínico que la Terminologia Anatomica 2 llama nodo del ligamento arterioso.', TA(5254), TA(5256)],
      PARENTESIS(5256),
    ],
    localizacion: [
      ['Su nombre lo sitúa junto al ligamento arterioso, que está en la ventana aortopulmonar: un pequeño espacio entre el arco aórtico y la arteria pulmonar que contiene el ligamento, el nervio laríngeo recurrente izquierdo, nodos linfáticos y grasa.', TA(5256), W('Aortopulmonary_space', 'is a small space between the aortic arch and the pulmonary artery'), W('Aortopulmonary_space', 'It contains the ligamentum arteriosum, the left recurrent laryngeal nerve, lymph nodes, and fatty tissue.')],
      ['La ventana aortopulmonar está limitada por delante por la aorta ascendente, por detrás por la aorta descendente, por dentro por el bronquio principal izquierdo y por fuera por la pleura mediastínica.', W('Aortopulmonary_space', 'The space is bounded anteriorly by the ascending aorta, posteriorly by the descending aorta, medially by the left main bronchus, and laterally by mediastinal pleura.')],
    ],
    reparo: [
      ['El ligamento arterioso, resto del conducto arterioso fetal: une el final del arco aórtico (el istmo) o el comienzo de la aorta descendente con la parte alta de la arteria pulmonar izquierda.', W('Ligamentum_arteriosum', 'is the remnant of the ductus arteriosus'), W('Ligamentum_arteriosum', 'At the superior end, the ligamentum attaches to the aorta—at the final part of the aortic arch (the isthmus of aorta) or the first part of the descending aorta.'), W('Ligamentum_arteriosum', 'the ligamentum is attached to the top of the left pulmonary artery')],
      ['El nervio laríngeo recurrente izquierdo rodea el arco aórtico por detrás del ligamento.', W('Ligamentum_arteriosum', 'the left recurrent laryngeal loops around the aortic arch behind the ligamentum arteriosum')],
    ],
    modelo: [
      UN_NODO,
      ['En este modelo es un solo nodo, junto a la bifurcación del tronco pulmonar.', MODELO],
      RUTA_SIN_FUENTE('los nodos paratraqueales', true),
    ],
    notas: [
      ['En la estadificación del cáncer de pulmón, los nodos de la ventana aortopulmonar (subaórticos) forman la estación 5.', W('Lung_cancer_staging', 'aorto-pulmonary space (subaortic) lymph nodes (station 5)')],
      ['En la radiografía, una densidad de agua en la ventana aortopulmonar puede indicar nodos aumentados de tamaño o un tumor.', W('Aortopulmonary_space', 'The presence of water radiodensity in this space on radiography may indicate a lymphadenopathy or neoplasm is occupying this space.')],
    ],
    pendientes: { recibe: SIN_FUENTE_NODO, drena: SIN_FUENTE_NODO },
  },

  Node_of_arch_of_azygos_vein: {
    tipo: 'nodo', ta2: 5257,
    descripcion: [
      ['Nodo (ganglio) mediastínico que la Terminologia Anatomica 2 llama nodo del arco de la vena ácigos.', TA(5254), TA(5257)],
      PARENTESIS(5257),
    ],
    localizacion: [
      ['Su nombre lo sitúa en el arco de la vena ácigos, que a la altura de la vértebra T4 pasa por encima de la raíz del pulmón derecho, de atrás adelante, para unirse a la vena cava superior.', TA(5257), W('Azygos_vein', 'At the level of T4 vertebrae, it arches over the root of the right lung from behind to the front to join the superior vena cava.')],
      ['La tráquea y el esófago quedan por dentro del arco.', W('Azygos_vein', 'The trachea and oesophagus is located medially to the arch of the azygous vein.')],
    ],
    reparo: [
      ['El arco de la vena ácigos, un reparo anatómico importante, con la raíz del pulmón derecho por debajo.', W('Azygos_vein', 'is an important anatomic landmark'), W('Root_of_the_lung', 'The root of the right lung lies behind the superior vena cava and part of the right atrium, and below the azygos vein.')],
    ],
    modelo: [
      UN_NODO,
      ['En este modelo es un solo nodo, junto a la vena ácigos.', MODELO],
      RUTA_SIN_FUENTE('los nodos paratraqueales', true),
    ],
    pendientes: { recibe: SIN_FUENTE_NODO, drena: SIN_FUENTE_NODO },
  },

  Prepericardial_nodes: {
    tipo: 'nodo', ta2: 5258,
    descripcion: [MEDIASTINICOS(5258), MEDIASTINO_GRUPOS],
    modelo: [
      REPRESENTATIVO,
      ['En este modelo hay cuatro nodos en el lado derecho, junto a la vena braquiocefálica derecha, la vena cava superior y los vasos torácicos internos derechos.', MODELO],
      RUTA_SIN_FUENTE('los nodos paraesternales'),
      ['El latín «Nodi prepericadiaci» de la TA2 y de Z-Anatomy tiene una errata; la app escribe «Nodi prepericardiaci».', TA(5258), MODELO],
    ],
    pendientes: { localizacion: SIN_FUENTE, reparo: SIN_FUENTE, recibe: SIN_FUENTE, drena: SIN_FUENTE },
  },

  Lateral_pericardial_nodes: {
    tipo: 'nodo', ta2: 5259,
    descripcion: [MEDIASTINICOS(5259), MEDIASTINO_GRUPOS],
    modelo: [
      REPRESENTATIVO,
      ['En este modelo hay cuatro nodos en el lado derecho, junto a la vena media del pulmón derecho y la porción torácica de la vena cava inferior.', MODELO],
      RUTA_SIN_FUENTE('los nodos braquiocefálicos'),
    ],
    pendientes: { localizacion: SIN_FUENTE, reparo: SIN_FUENTE, recibe: SIN_FUENTE, drena: SIN_FUENTE },
  },

  Paratracheal_thoracic_nodes: {
    tipo: 'nodo', ta2: 5260,
    descripcion: [
      ['Los nodos (ganglios) paratraqueales del tórax están a los dos lados de la tráquea; la Terminologia Anatomica 2 los distingue de los paratraqueales del cuello.', W('Tracheobronchial_lymph_nodes', 'nodes are located on either side of the trachea'), TA(5260), TA(5222)],
      TB_CUATRO,
    ],
    localizacion: [
      ['Están a cada lado de la tráquea.', W('Tracheobronchial_lymph_nodes', 'nodes are located on either side of the trachea'), W('Trachea', 'paratracheal lymph nodes that lie beside it')],
      MEDIASTINO_GRUPOS,
    ],
    reparo: [
      ['La tráquea, a cuyos lados están.', W('Trachea', 'paratracheal lymph nodes that lie beside it')],
      CARINA_ACIGOS,
    ],
    recibe: [
      ['Reciben vasos linfáticos de la tráquea, que drenan en los nodos pretraqueales, delante de ella, y en los paratraqueales, a su lado.', W('Trachea', 'The lymphatic vessels of the trachea drain into the pretracheal nodes that lie in front of the trachea, and paratracheal lymph nodes that lie beside it.')],
      TB_AFERENTES,
    ],
    drena: [TB_EFERENTES],
    modelo: [
      REPRESENTATIVO,
      ['En este modelo hay diez nodos, cinco a cada lado de la tráquea, junto al tronco braquiocefálico, la vena braquiocefálica derecha, la carótida común izquierda y el arco aórtico.', MODELO],
      TB_MODELO_CADENA,
    ],
    notas: [ESTACIONES],
    vias: { drena: ['Bronchomediastinal_trunk'] },
  },

  Superior_tracheobronchial_nodes: {
    tipo: 'nodo', ta2: 5262,
    descripcion: [TB_TRES, TB_CUATRO],
    localizacion: [
      ['Los dos traqueobronquiales superiores están a cada lado de la tráquea, justo antes de su bifurcación.', W('Tracheobronchial_lymph_nodes', 'The two superior tracheobronchial nodes are located on either side of trachea just before its bifurcation.')],
    ],
    reparo: [CARINA, CARINA_ACIGOS],
    recibe: [TB_AFERENTES],
    drena: [TB_EFERENTES],
    modelo: [
      REPRESENTATIVO,
      ['En este modelo hay cinco nodos, tres a la derecha y dos a la izquierda, junto a la vena cava superior y el arco aórtico; la fuente habla de un nodo a cada lado.', MODELO],
      TB_MODELO_CADENA,
    ],
    vias: { drena: ['Bronchomediastinal_trunk'] },
  },

  Inferior_tracheobronchial_nodes: {
    tipo: 'nodo', ta2: 5263,
    descripcion: [TB_TRES, TB_CUATRO],
    localizacion: [
      ['El traqueobronquial inferior está justo debajo de la bifurcación de la tráquea, en el ángulo entre los dos bronquios principales.', W('Tracheobronchial_lymph_nodes', 'The inferior tracheobronchial node is located just below the bifurcation in the angle between the two bronchi.')],
    ],
    reparo: [CARINA, CARINA_ACIGOS],
    recibe: [
      TB_AFERENTES,
      ['Le llega el colector linfático izquierdo del corazón, que recorre la arteria pulmonar y la aurícula izquierda.', W('Heart', 'The left vessel joins with this third vessel, and travels along the pulmonary artery and left atrium, ending in the inferior tracheobronchial node.')],
    ],
    drena: [TB_EFERENTES],
    modelo: [
      REPRESENTATIVO,
      ['En este modelo hay diez nodos, junto a la vena ácigos, el arco aórtico, la arteria pulmonar derecha y la bifurcación del tronco pulmonar; la fuente habla de un solo nodo.', MODELO],
      TB_MODELO_CADENA,
    ],
    notas: [
      ['El aumento de tamaño de los nodos de la región subcarinal se debe con frecuencia a metástasis.', ES('Carina_de_la_tráquea', 'Adenopatías (ganglios linfáticos aumentados de tamaño) en la región subcarinal, frecuentemente por procesos metastásicos.')],
    ],
    vias: { drena: ['Bronchomediastinal_trunk'] },
  },

  Intrapulmonary_nodes: {
    tipo: 'nodo', ta2: 5267,
    descripcion: [
      ['La Terminologia Anatomica 2 divide los nodos (ganglios) pulmonares en broncopulmonares, en el hilio, e intrapulmonares, dentro del pulmón.', TA(5265), TA(5266), TA(5267), W('Tracheobronchial_lymph_nodes', 'Bronchopulmonary nodes (hilar nodes) situate in the hilum of each lung.')],
      TB_CUATRO,
    ],
    localizacion: [
      ['Están dentro del pulmón, sobre las ramas mayores de los bronquios.', W('Tracheobronchial_lymph_nodes', 'Pulmonary nodes are embedded the lung substance on the larger branches of the bronchi.')],
    ],
    reparo: [
      ['Las ramas mayores de los bronquios dentro del pulmón.', W('Tracheobronchial_lymph_nodes', 'on the larger branches of the bronchi')],
    ],
    recibe: [
      ['Reciben la linfa del tejido pulmonar, que pasa por nodos subsegmentarios, segmentarios, lobares e interlobares.', W('List_of_lymph_nodes_of_the_human_body', 'The lymph is drained from the lung tissue through subsegmental, segmental, lobar and interlobar lymph nodes')],
      ['La tráquea y los bronquios tienen plexos de capilares linfáticos en la mucosa y la submucosa; los bronquios pequeños tienen una sola capa y en los alvéolos no hay.', W('Lung', 'The trachea and bronchi have plexuses of lymph capillaries in their mucosa and submucosa.'), W('Lung', 'The smaller bronchi have a single layer of lymph capillaries, and they are absent in the alveoli.')],
    ],
    drena: [
      ['La linfa sigue hacia los nodos hiliares, alrededor del hilio de cada pulmón, y de ahí a los nodos del mediastino.', W('List_of_lymph_nodes_of_the_human_body', 'to the hilar lymph nodes, which are located around the hilum'), W('List_of_lymph_nodes_of_the_human_body', 'The lymph flows subsequently to the mediastinal lymph nodes.')],
    ],
    modelo: [
      REPRESENTATIVO,
      ['En este modelo hay veintitrés nodos repartidos por los dos pulmones, junto a ramas segmentarias de las arterias y venas pulmonares.', MODELO],
      ['En este modelo no hay nodos broncopulmonares (hiliares), porque Z-Anatomy no los trae; los colectores esquemáticos llevan la linfa de estos nodos directamente a los traqueobronquiales inferiores.', TA(5266), MODELO],
    ],
    notas: [ESTACIONES],
  },

  Juxta_oesophageal_nodes: {
    tipo: 'nodo', ta2: 5264,
    descripcion: [MEDIASTINICOS(5264)],
    localizacion: [
      ['Su nombre en la Terminologia Anatomica 2 los sitúa junto al esófago.', TA(5264)],
      MEDIASTINO_GRUPOS,
    ],
    reparo: [
      ['El esófago, al que deben su nombre.', TA(5264)],
    ],
    modelo: [
      REPRESENTATIVO,
      ['En este modelo hay diez nodos en fila vertical cerca de la línea media, junto a la aorta torácica, el arco aórtico, la vena ácigos y las arterias intercostales posteriores.', MODELO],
      RUTA_SIN_FUENTE('el conducto torácico'),
    ],
    notas: [
      ['Los nodos del mediastino que hay a lo largo del esófago están muy conectados con los nodos abdominales del esófago y del estómago, lo que facilita la extensión de los cánceres de estómago y, sobre todo, de esófago.', W('List_of_lymph_nodes_of_the_human_body', 'The mediastinal lymph nodes along the esophagus are in tight connection with the abdominal lymph nodes along the esophagus and the stomach.'), W('List_of_lymph_nodes_of_the_human_body', 'That fact facilitates spreading of tumor cells through these lymphatics in cases of cancers of the stomach and particularly of the esophagus.')],
    ],
    pendientes: {
      recibe: 'Ninguna fuente libre consultada nombra los aferentes de este grupo; «Esophagus» solo dice que el tercio medio del esófago drena en los nodos mediastínicos superiores y posteriores, sin nombrar los yuxtaesofágicos.',
      drena: SIN_FUENTE,
    },
  },

  Prevertebral_nodes: {
    tipo: 'nodo', ta2: 5252,
    descripcion: [
      ['La Terminologia Anatomica 2 cuenta los nodos (ganglios) prevertebrales entre los nodos parietales del tórax.', TA(5248), TA(5252)],
    ],
    localizacion: [
      ['Su nombre en la Terminologia Anatomica 2 los sitúa delante de la columna vertebral.', TA(5252)],
    ],
    modelo: [
      REPRESENTATIVO,
      ['En este modelo hay diez nodos en fila vertical cerca de la línea media, junto a la aorta torácica, el arco aórtico y las arterias intercostales posteriores.', MODELO],
      RUTA_SIN_FUENTE('el conducto torácico'),
    ],
    pendientes: { reparo: SIN_FUENTE, recibe: SIN_FUENTE, drena: SIN_FUENTE },
  },
};
