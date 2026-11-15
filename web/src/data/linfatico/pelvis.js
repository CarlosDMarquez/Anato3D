// Fichas de los nodos de la pelvis (ilíacos, sacros, viscerales) y los lacunares: grupo «Pelvic_lymph_nodes».
// Formato y reglas: ./formato.js (cada frase con su fuente; MODELO solo en «En este modelo»). Clave = nombre de la pieza
// sin _L/_R. Comprobar: node scripts/linfatico-citas.mjs comprobar && node scripts/check-cards.mjs
//
// BORRADOR redactado con IA a partir de las fuentes citadas, sin revisión de un especialista. Las páginas de Wikipedia
// de los nodos de la pelvis incorporan texto de dominio público del Gray's Anatomy de 1918; la división en subgrupos
// (mediales, intermedios, laterales, lacunares…) es la de la Terminologia Anatomica 2, que se cita por su número. Tabla de
// fuentes y contraste con la tabla de drenaje: docs/fuentes/linfatico-pelvis.md.
import { W, ES, TA, MODELO } from './formato.js';

// ── Citas que se repiten ──
// Nodos ilíacos comunes (Gray 1918, p. 704)
const CI_SITIO = W('Common_iliac_lymph_nodes', 'are grouped behind and on the sides of the common iliac artery');
const CI_NUMERO = W('Common_iliac_lymph_nodes', 'The common iliac lymph nodes, four to six in number');
const CI_BIFURCACION = W('Common_iliac_lymph_nodes', 'one or two being placed below the bifurcation of the aorta, in front of the fifth lumbar vertebra');
const CI_RECIBE = W('Common_iliac_lymph_nodes', 'They drain chiefly the hypogastric and external iliac glands');
const CI_DRENA = W('Common_iliac_lymph_nodes', 'their efferents pass to the lateral aortic glands');
const LUMBARES_RECIBEN = W('Lumbar_lymph_nodes', '(a) the efferents of the common iliac lymph nodes');
const LUMBARES_DERECHOS = W('Lumbar_lymph_nodes', 'The right paraaortic nodes, are situated partly in front of the inferior vena cava');
// Arteria ilíaca común
const ACI_ORIGEN = W('Common_iliac_artery', 'It originates from the aortic bifurcation at the level of the 4th lumbar vertebra.');
const ACI_PSOAS = W('Common_iliac_artery', 'It runs inferolaterally, along the medial border of the psoas muscles.');
const ACI_FIN = W('Common_iliac_artery', 'It bifurcates into the external iliac artery and the internal iliac artery at the pelvic brim, in front of the sacroiliac joints.');
const ACI_VENAS = W('Common_iliac_artery', 'Both common iliac arteries are accompanied along their course by the two common iliac veins, which lie posteriorly and to the right.');
// Nodos ilíacos externos (Gray 1918, p. 703)
const EI_SITIO = W('External_iliac_lymph_nodes', 'from eight to ten in number, that lie along the external iliac vessels');
const EI_GRUPOS = W('External_iliac_lymph_nodes', 'They are arranged in three groups, one on the lateral, another on the medial, and a third on the anterior aspect of the vessels; the third group is, however, sometimes absent.');
const EI_INGUINALES = W('External_iliac_lymph_nodes', 'Their principal afferents are derived from the inguinal lymph nodes');
const EI_PARED = W('External_iliac_lymph_nodes', 'the deep lymphatics of the abdominal wall below the umbilicus and of the adductor region of the thigh');
const EI_VISCERAS = W('External_iliac_lymph_nodes', 'the lymphatics from the glans penis, glans clitoridis, the membranous urethra, the prostate, the fundus of the urinary bladder, the cervix uteri, and upper part of the vagina');
const INGUINALES_PROFUNDOS_DRENAN = W('Deep_inguinal_lymph_nodes', 'The deep inguinal lymph nodes drain superiorly to the external iliac lymph nodes');
// Arteria ilíaca externa
const AIE_PSOAS = W('External_iliac_artery', 'They proceed anterior and inferior along the medial border of the psoas major muscles.');
const AIE_FEMORAL = W('External_iliac_artery', 'The external iliac artery passes beneath the inguinal ligament in the lower part of the abdomen and becomes the femoral artery.');
// Nodos ilíacos internos (hipogástricos; Gray 1918, p. 704)
const II_NOMBRE = W('Internal_iliac_lymph_nodes', 'The internal iliac lymph nodes (or hypogastric lymph nodes)');
const II_SITIO = W('Internal_iliac_lymph_nodes', 'surround the internal iliac artery and its branches');
const II_VISCERAS = W('Internal_iliac_lymph_nodes', 'they receive lymphatics from all the pelvic viscera, from the deeper parts of the perineum, including the membranous and cavernous portions of the urethra');
const II_NALGA = W('Internal_iliac_lymph_nodes', 'and from the buttock and back of the thigh');
const II_RECTO = W('Internal_iliac_lymph_nodes', 'The internal iliac lymph nodes also drain the superior half of the rectum, above the pectinate line.');
const II_GONADAS = W('Internal_iliac_lymph_nodes', 'It does not receive lymph from the ovary or testis, which drain to the paraaortic lymph nodes.');
// Nodos sacros (Gray 1918, p. 704)
const SACROS_SITIO = W('Sacral_lymph_nodes', 'The sacral lymph nodes are placed in the concavity of the sacrum, in relation to the middle and lateral sacral arteries');
const SACROS_RECIBEN = W('Sacral_lymph_nodes', 'they receive lymphatics from the rectum and posterior wall of the pelvis');

// Laguna vascular, nodo de Cloquet y ligamento lacunar
const LAGUNA = W('Lacuna_vasorum', 'is the medial compartment beneath the inguinal ligament');
const LAGUNA_PASO = W('Lacuna_vasorum', 'It gives passage to the femoral vessels, lymph vessels and lymph nodes.');
const LAGUNA_LIMITES = W('Lacuna_vasorum', 'Its boundaries are the iliopectineal arch, the inguinal ligament, the lacunar ligament, and the superior border of the pubis.');
const LAGUNA_CONTENIDO = W('Lacuna_vasorum', "The structures found in the vascular lacuna, from medial to lateral, are: Cloquet's node Femoral vein Femoral artery");
// Arteria obturadora
const OBTURADORA = W('Obturator_artery', 'passes antero-inferiorly (forwards and downwards) on the lateral wall of the pelvis, to the upper part of the obturator foramen, and, escaping from the pelvic cavity through the obturator canal');
// Vejiga urinaria
const VEJIGA_REDES = W('Urinary_bladder', 'The lymph drained from the bladder begins in a series of networks throughout the mucosal, muscular and serosal layers.');
const VEJIGA_TRES = W('Urinary_bladder', 'These then form three sets of vessels: one set near the trigone draining the bottom of the bladder; one set draining the top of the bladder; and another set draining the outer undersurface of the bladder.');
const VEJIGA_DRENA = W('Urinary_bladder', 'The majority of these vessels drain into the external iliac lymph nodes.');

// ── Frases de «En este modelo» que se repiten ──
const NODOS_ESQUEMATICOS = ['En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.', MODELO];
const SIN_LADO = ['En este modelo es una sola pieza, sin lado izquierdo ni derecho.', MODELO];
const LATIN_CORREGIDO = ['El latín del modelo se escribe sin tilde, como en la Terminologia Anatomica: «laterales» y no «latérales».', MODELO];
const SUBGRUPO_TA = (que) => [`La posición de los nodos ${que} dentro del grupo sigue su nombre en la Terminologia Anatomica; las fuentes libres consultadas no la describen por separado.`, MODELO];
const PIEZA_NUEVA = ['Es una pieza nueva de Anato3D: en Z-Anatomy estaba oculta, porque en la Terminologia Anatomica su nombre va entre paréntesis; su forma y su tamaño son esquemáticos.', MODELO];
const LACUNAR_COLOCADO = ['En este modelo los tres nodos lacunares se recolocaron en la laguna vascular, al final de los vasos ilíacos externos, por orden de medial a lateral; es una colocación esquemática.', MODELO];

// ── Plantillas por grupo (cada ficha añade su descripción y su término) ──
const ILIACO_COMUN = {
  localizacion: [
    ['Los nodos ilíacos comunes, de cuatro a seis, se agrupan por detrás y a los lados de la arteria ilíaca común.', CI_NUMERO, CI_SITIO],
    ['La arteria ilíaca común nace de la bifurcación de la aorta, a la altura de la cuarta vértebra lumbar, baja por el borde medial del psoas y se divide en el borde de la pelvis, delante de la articulación sacroilíaca.', ACI_ORIGEN, ACI_PSOAS, ACI_FIN],
  ],
  reparo: [
    ['La arteria ilíaca común, con su vena, que va por detrás y a la derecha de ella.', CI_SITIO, ACI_VENAS],
  ],
  recibe: [
    ['Reciben sobre todo la linfa de los nodos ilíacos internos (hipogástricos) y de los ilíacos externos.', CI_RECIBE, II_NOMBRE],
  ],
  drena: [
    ['Sus eferentes van a los nodos aórticos laterales (lumbares).', CI_DRENA, LUMBARES_RECIBEN],
    ['En el lado derecho, esos nodos lumbares están en parte delante de la vena cava inferior.', LUMBARES_DERECHOS],
  ],
  vias: {
    recibe: ['Medial_external_iliac_nodes', 'Intermediate_external_iliac_nodes', 'Superior_gluteal_nodes', 'Inferior_gluteal_nodes', 'Lateral_sacral_nodes'],
    drena: ['Lateral_aortic_nodes', 'Lateral_caval_nodes'],
  },
};

const ILIACO_EXTERNO = {
  localizacion: [
    ['Los nodos ilíacos externos, de ocho a diez, están a lo largo de los vasos ilíacos externos.', EI_SITIO],
    ['La arteria ilíaca externa baja hacia delante por el borde medial del psoas mayor y pasa bajo el ligamento inguinal, donde se convierte en la arteria femoral.', AIE_PSOAS, AIE_FEMORAL],
  ],
  reparo: [
    ['La arteria y la vena ilíacas externas, en el borde medial del psoas mayor.', EI_SITIO, AIE_PSOAS],
  ],
  recibe: [
    ['Sus aferentes principales vienen de los nodos inguinales.', EI_INGUINALES, INGUINALES_PROFUNDOS_DRENAN],
    ['También reciben los linfáticos profundos de la pared abdominal por debajo del ombligo y de la región de los aductores del muslo.', EI_PARED],
    ['Y los del glande, el clítoris, la uretra membranosa, la próstata, el fondo de la vejiga, el cuello del útero y la parte superior de la vagina.', EI_VISCERAS],
  ],
  drena: [
    ['Drenan en los nodos ilíacos comunes, que a su vez llevan la linfa a los nodos aórticos laterales.', CI_RECIBE, CI_DRENA],
  ],
  vias: {
    recibe: ['Proximal_deep_inguinal_node', 'Intermediate_deep_inguinal_node', 'Superomedial_superficial_inguinal_nodes', 'Superolateral_superficial_inguinal_nodes', 'Inferior_superficial_inguinal_nodes'],
    drena: ['Medial_common_iliac_nodes', 'Intermediate_common_iliac_nodes', 'Lateral_common_iliac_nodes'],
  },
};

const ILIACO_INTERNO_RECIBE = [
  ['El grupo ilíaco interno al que pertenecen recibe la linfa de todas las vísceras de la pelvis y de la parte profunda del periné, incluidas las porciones membranosa y cavernosa de la uretra.', II_VISCERAS],
  ['También recibe la de la nalga y la parte posterior del muslo.', II_NALGA],
  ['No recibe la del ovario ni la del testículo, que van a los nodos lumbares.', II_GONADAS],
];
const ILIACO_INTERNO_DRENA = [
  ['Los nodos ilíacos internos (hipogástricos) drenan en los nodos ilíacos comunes.', II_NOMBRE, CI_RECIBE],
];
const VIAS_ILIACO_INTERNO = { drena: ['Medial_common_iliac_nodes', 'Intermediate_common_iliac_nodes', 'Lateral_common_iliac_nodes'] };

const LACUNAR_SITIO = [
  ['Los nodos lacunares toman su nombre de la laguna vascular, el compartimento medial que queda por debajo del ligamento inguinal.', TA(5329), LAGUNA],
  ['La laguna vascular está limitada por el arco iliopectíneo, el ligamento inguinal, el ligamento lacunar y el borde superior del pubis; por ella pasan los vasos femorales, vasos linfáticos y nodos linfáticos.', LAGUNA_LIMITES, LAGUNA_PASO],
];
const LACUNAR_RECIBE = [
  ['Por la laguna vascular suben, junto a los vasos femorales, los vasos linfáticos del miembro inferior: los nodos inguinales profundos drenan hacia arriba en los nodos ilíacos externos.', LAGUNA_PASO, INGUINALES_PROFUNDOS_DRENAN],
];
const LACUNAR_DRENA = [
  ['Como parte de los nodos ilíacos externos, su linfa sigue hacia los nodos ilíacos comunes.', TA(5325), CI_RECIBE],
];
const VIAS_LACUNAR = {
  recibe: ['Proximal_deep_inguinal_node', 'Intermediate_deep_inguinal_node'],
  drena: ['Medial_common_iliac_nodes', 'Intermediate_common_iliac_nodes', 'Lateral_common_iliac_nodes'],
};
const CLOQUET_SIN_IDENTIFICAR = ['Las fuentes libres consultadas no dicen a qué nodo de la Terminologia Anatomica corresponde el nodo de Cloquet (si al lacunar medial o al inguinal profundo proximal). Esta app lo identifica, como decisión propia, con el nodo inguinal profundo proximal (ver su ficha), no con este.', MODELO];
const CLOQUET_NOTA = ['El nodo de Cloquet (o de Rosenmüller), bajo el ligamento inguinal, puede considerarse el más inferior de los ilíacos externos o el más superior de los inguinales profundos, y se considera un posible nodo centinela.', W('Deep_inguinal_lymph_nodes', 'The superior-most node is situated in the groin, deep to the inguinal ligament, and is termed the Cloquet\'s node (also Rosenmuller\'s node).'), W('Deep_inguinal_lymph_nodes', 'It can instead be considered as the inferior-most of the external iliac lymph nodes.'), W('Deep_inguinal_lymph_nodes', 'Cloquet\'s node is also considered as a potential sentinel lymph node.')];

const VEJIGA_ES = ES('Vejiga_urinaria', 'La linfa de la vejiga drena en los ganglios perivesicales, de ahí a los ilíacos externos y a los hipogástricos');
const VESICAL_RECIBE = [
  ['Reciben la linfa de la vejiga urinaria.', VEJIGA_ES],
  ['La linfa de la vejiga nace en redes de las capas mucosa, muscular y serosa.', VEJIGA_REDES],
  ['Esas redes forman tres grupos de vasos: uno junto al trígono, que drena el fondo de la vejiga; otro que drena la parte superior; y otro que drena la cara inferior externa.', VEJIGA_TRES],
];
const VESICAL_DRENA = [
  ['De los nodos que rodean la vejiga, la linfa pasa a los nodos ilíacos externos y a los hipogástricos (ilíacos internos).', VEJIGA_ES, II_NOMBRE],
  ['La mayoría de los vasos linfáticos de la vejiga drena en los nodos ilíacos externos.', VEJIGA_DRENA],
  ['Los nodos ilíacos externos reciben, entre otros, los linfáticos del fondo de la vejiga.', EI_VISCERAS],
];
const VESICAL_MODELO = ['En este modelo los nodos paravesicales se colocan junto a la vejiga, en el trayecto de sus vasos linfáticos; las fuentes libres consultadas no describen por separado qué parte de la vejiga drena en cada subgrupo.', MODELO];
const VIAS_VESICAL = { drena: ['Medial_external_iliac_nodes', 'Intermediate_external_iliac_nodes'] };

export default {
  // ── Nodos ilíacos comunes ──
  Medial_common_iliac_nodes: {
    tipo: 'nodo', ta2: 5320,
    descripcion: [
      ['Nodos (ganglios) ilíacos comunes mediales: el subgrupo medial de los nodos ilíacos comunes en la Terminologia Anatomica.', TA(5319), TA(5320)],
      ['Los nodos ilíacos comunes recogen sobre todo la linfa de los ilíacos internos y externos y la pasan a los nodos lumbares.', CI_RECIBE, CI_DRENA],
    ],
    ...ILIACO_COMUN,
    modelo: [NODOS_ESQUEMATICOS, SIN_LADO, SUBGRUPO_TA('mediales')],
  },
  Intermediate_common_iliac_nodes: {
    tipo: 'nodo', ta2: 5321,
    descripcion: [
      ['Nodos (ganglios) ilíacos comunes intermedios: el subgrupo intermedio de los nodos ilíacos comunes en la Terminologia Anatomica.', TA(5319), TA(5321)],
      ['Los nodos ilíacos comunes recogen sobre todo la linfa de los ilíacos internos y externos y la pasan a los nodos lumbares.', CI_RECIBE, CI_DRENA],
    ],
    ...ILIACO_COMUN,
    modelo: [NODOS_ESQUEMATICOS, SIN_LADO, SUBGRUPO_TA('intermedios')],
  },
  Lateral_common_iliac_nodes: {
    tipo: 'nodo', ta2: 5322,
    descripcion: [
      ['Nodos (ganglios) ilíacos comunes laterales: el subgrupo lateral de los nodos ilíacos comunes en la Terminologia Anatomica.', TA(5319), TA(5322)],
      ['Los nodos ilíacos comunes recogen sobre todo la linfa de los ilíacos internos y externos y la pasan a los nodos lumbares.', CI_RECIBE, CI_DRENA],
    ],
    ...ILIACO_COMUN,
    modelo: [NODOS_ESQUEMATICOS, ['En este modelo una sola pieza, sin lado, reúne los nodos de los dos lados.', MODELO], SUBGRUPO_TA('laterales'), LATIN_CORREGIDO],
  },
  Subaortic_nodes: {
    tipo: 'nodo', ta2: 5323,
    descripcion: [
      ['Nodos (ganglios) subaórticos: en la Terminologia Anatomica forman parte de los nodos ilíacos comunes.', TA(5319), TA(5323)],
    ],
    localizacion: [
      ['Entre los nodos ilíacos comunes, uno o dos se sitúan por debajo de la bifurcación de la aorta, delante de la quinta vértebra lumbar.', CI_BIFURCACION],
      ['La aorta se bifurca en las dos arterias ilíacas comunes a la altura de la cuarta vértebra lumbar.', ACI_ORIGEN],
    ],
    reparo: [
      ['La bifurcación de la aorta, entre el origen de las dos arterias ilíacas comunes.', CI_BIFURCACION, ACI_ORIGEN],
    ],
    recibe: [
      ['Como nodos ilíacos comunes, reciben sobre todo la linfa de los nodos ilíacos internos y externos.', CI_RECIBE],
    ],
    drena: [
      ['Como nodos ilíacos comunes, sus eferentes van a los nodos aórticos laterales.', CI_DRENA, LUMBARES_RECIBEN],
    ],
    modelo: [
      NODOS_ESQUEMATICOS, SIN_LADO,
      ['Se interpreta que los uno o dos nodos que Gray sitúa bajo la bifurcación de la aorta son estos nodos subaórticos; las fuentes libres consultadas no lo dicen con ese nombre.', MODELO],
      ['En este modelo la pieza está en el grupo de los nodos de la pelvis, con los ilíacos comunes, como en Z-Anatomy y en la Terminologia Anatomica; en versiones anteriores del modelo aparecía entre los nodos del abdomen.', TA(5319), TA(5323), MODELO],
    ],
    vias: { recibe: ['Medial_external_iliac_nodes', 'Intermediate_external_iliac_nodes'], drena: ['Lateral_aortic_nodes', 'Lateral_caval_nodes'] },
  },
  Median_sacral_nodes: {
    tipo: 'nodo', ta2: 5324,
    descripcion: [
      ['Nodos (ganglios) sacros medianos: en la Terminologia Anatomica forman parte de los nodos ilíacos comunes.', TA(5319), TA(5324)],
    ],
    localizacion: [
      ['Los nodos sacros están en la concavidad del sacro, en relación con las arterias sacras media y laterales.', SACROS_SITIO],
      ['La arteria sacra media baja por la línea media delante de la cuarta y la quinta vértebras lumbares, del sacro y del cóccix.', W('Median_sacral_artery', 'It descends in the middle line in front of the fourth and fifth lumbar vertebrae, the sacrum and coccyx')],
    ],
    reparo: [
      ['La arteria sacra media, en la línea media, sobre la cara anterior del sacro.', SACROS_SITIO, W('Median_sacral_artery', 'It descends in the middle line in front of the fourth and fifth lumbar vertebrae, the sacrum and coccyx')],
    ],
    recibe: [
      ['Los nodos sacros reciben la linfa del recto y de la pared posterior de la pelvis.', SACROS_RECIBEN],
      ['A los nodos sacros llega también linfa de la próstata.', W('Prostate', 'Vessels of the prostate itself also drain into the obturator and sacral lymph nodes.')],
    ],
    modelo: [NODOS_ESQUEMATICOS, SIN_LADO],
    pendientes: { drena: 'Ninguna fuente libre consultada describe adónde van los eferentes de los nodos sacros medianos; no se afirma nada.' },
  },

  // ── Nodos ilíacos externos ──
  Medial_external_iliac_nodes: {
    tipo: 'nodo', ta2: 5326,
    descripcion: [
      ['Nodos (ganglios) ilíacos externos mediales: el subgrupo medial de los nodos ilíacos externos.', TA(5325), TA(5326)],
      ['Gray describe los nodos ilíacos externos en tres grupos: uno en la cara lateral de los vasos, otro en la medial y un tercero en la anterior, que a veces falta.', EI_GRUPOS],
    ],
    ...ILIACO_EXTERNO,
    modelo: [NODOS_ESQUEMATICOS, SUBGRUPO_TA('mediales')],
  },
  Intermediate_external_iliac_nodes: {
    tipo: 'nodo', ta2: 5327,
    descripcion: [
      ['Nodos (ganglios) ilíacos externos intermedios: en la Terminologia Anatomica, el subgrupo entre los mediales y los laterales de los nodos ilíacos externos.', TA(5325), TA(5326), TA(5327), TA(5328)],
      ['Gray los describe de otra manera, en tres grupos: uno en la cara lateral de los vasos, otro en la medial y un tercero en la anterior, que a veces falta.', EI_GRUPOS],
    ],
    ...ILIACO_EXTERNO,
    modelo: [NODOS_ESQUEMATICOS, SUBGRUPO_TA('intermedios')],
  },

  // ── Nodos lacunares (piezas nuevas): en la TA2, dentro de los ilíacos externos, con el nombre entre paréntesis ──
  Medial_lacunar_node: {
    tipo: 'nodo', ta2: 5329,
    descripcion: [
      ['Nodo (ganglio) lacunar medial: en la Terminologia Anatomica, uno de los nodos lacunares, que forman parte de los nodos ilíacos externos; su nombre figura entre paréntesis.', TA(5325), TA(5329)],
    ],
    localizacion: [...LACUNAR_SITIO],
    reparo: [
      ['En la laguna vascular, de medial a lateral, se encuentran el nodo de Cloquet, la vena femoral y la arteria femoral.', LAGUNA_CONTENIDO],
      ['El ligamento lacunar forma el límite medial del anillo femoral.', W('Lacunar_ligament', 'Its base is concave, thin, and sharp, and forms the medial boundary of the femoral ring.')],
    ],
    recibe: [...LACUNAR_RECIBE],
    drena: [...LACUNAR_DRENA],
    modelo: [PIEZA_NUEVA, LACUNAR_COLOCADO, SUBGRUPO_TA('lacunares'), CLOQUET_SIN_IDENTIFICAR],
    notas: [CLOQUET_NOTA],
    vias: { ...VIAS_LACUNAR },
  },
  Intermediate_lacunar_node: {
    tipo: 'nodo', ta2: 5330,
    descripcion: [
      ['Nodo (ganglio) lacunar intermedio: en la Terminologia Anatomica, uno de los nodos lacunares, que forman parte de los nodos ilíacos externos; su nombre figura entre paréntesis.', TA(5325), TA(5330)],
    ],
    localizacion: [...LACUNAR_SITIO],
    reparo: [
      ['Los vasos femorales a su paso bajo el ligamento inguinal: en la laguna vascular, de medial a lateral, están la vena femoral y la arteria femoral.', LAGUNA_CONTENIDO, AIE_FEMORAL],
    ],
    recibe: [...LACUNAR_RECIBE],
    drena: [...LACUNAR_DRENA],
    modelo: [PIEZA_NUEVA, LACUNAR_COLOCADO, SUBGRUPO_TA('lacunares')],
    vias: { ...VIAS_LACUNAR },
  },
  Lateral_lacunar_node: {
    tipo: 'nodo', ta2: 5331,
    descripcion: [
      ['Nodo (ganglio) lacunar lateral: en la Terminologia Anatomica, uno de los nodos lacunares, que forman parte de los nodos ilíacos externos; su nombre figura entre paréntesis.', TA(5325), TA(5331)],
    ],
    localizacion: [...LACUNAR_SITIO],
    reparo: [
      ['La arteria femoral, que es lo más lateral de los vasos de la laguna vascular: allí continúa la arteria ilíaca externa al pasar bajo el ligamento inguinal.', LAGUNA_CONTENIDO, AIE_FEMORAL],
    ],
    recibe: [...LACUNAR_RECIBE],
    drena: [...LACUNAR_DRENA],
    modelo: [PIEZA_NUEVA, LACUNAR_COLOCADO, SUBGRUPO_TA('lacunares')],
    vias: { ...VIAS_LACUNAR },
  },

  // ── Nodos obturadores (en la TA2, dentro de los ilíacos externos) ──
  Obturator_nodes: {
    tipo: 'nodo', ta2: 5333,
    descripcion: [
      ['Nodos (ganglios) obturadores: la Terminologia Anatomica los incluye en el grupo de los nodos ilíacos externos.', TA(5325), TA(5333)],
    ],
    localizacion: [
      ['Llevan el nombre del paquete obturador, que recorre la pared lateral de la pelvis: la arteria obturadora va hacia delante y abajo por esa pared hasta la parte superior del agujero obturador y sale de la pelvis por el canal obturador.', TA(5333), OBTURADORA],
    ],
    reparo: [
      ['La arteria obturadora, rama de la ilíaca interna, en la pared lateral de la pelvis camino del canal obturador.', OBTURADORA, W('Obturator_artery', 'The obturator artery usually arises from the internal iliac artery.')],
    ],
    recibe: [
      ['En el varón, a los nodos obturadores y a los sacros llegan vasos de la propia próstata.', W('Prostate', 'Vessels of the prostate itself also drain into the obturator and sacral lymph nodes.')],
      ['En la mujer, la parte posterior del cuello del útero drena en los nodos obturadores y presacros.', W('Cervix', 'the posterior section of the cervix drains to the obturator and presacral lymph nodes')],
      ['El drenaje del cuello del útero varía entre personas.', W('Cervix', 'However, there are variations as lymphatic drainage from the cervix travels to different sets of pelvic nodes in some people.')],
    ],
    modelo: [NODOS_ESQUEMATICOS],
    pendientes: { drena: 'Ninguna fuente libre consultada describe adónde van los eferentes de los nodos obturadores; la tabla de partida («→ ilíacos externos mediales») no tiene fuente y no se afirma.' },
  },

  // ── Nodos ilíacos internos: glúteos y sacros laterales ──
  Superior_gluteal_nodes: {
    tipo: 'nodo', ta2: 5336,
    descripcion: [
      ['Nodos (ganglios) glúteos superiores: en la Terminologia Anatomica, parte de los nodos glúteos, uno de los subgrupos de los nodos ilíacos internos.', TA(5334), TA(5335), TA(5336)],
    ],
    localizacion: [
      ['Los nodos ilíacos internos rodean la arteria ilíaca interna y sus ramas.', II_SITIO],
      ['La arteria glútea superior es la rama más grande y la última de la arteria ilíaca interna: continúa su división posterior.', W('Superior_gluteal_artery', 'The superior gluteal artery is the largest and final branch of the internal iliac artery.'), W('Superior_gluteal_artery', 'it represents the continuation of the posterior division')],
    ],
    reparo: [
      ['La arteria glútea superior, que sale de la pelvis por el agujero ciático mayor, por encima del músculo piriforme.', W('Superior_gluteal_artery', 'It exits the pelvis through the greater sciatic foramen superior to the piriformis muscle')],
    ],
    recibe: [...ILIACO_INTERNO_RECIBE],
    drena: [...ILIACO_INTERNO_DRENA],
    modelo: [NODOS_ESQUEMATICOS, ['Su posición junto a la arteria glútea superior sigue su nombre en la Terminologia Anatomica; las fuentes libres consultadas solo describen el grupo ilíaco interno en conjunto.', MODELO]],
    vias: { ...VIAS_ILIACO_INTERNO },
  },
  Inferior_gluteal_nodes: {
    tipo: 'nodo', ta2: 5337,
    descripcion: [
      ['Nodos (ganglios) glúteos inferiores: en la Terminologia Anatomica, parte de los nodos glúteos, uno de los subgrupos de los nodos ilíacos internos.', TA(5334), TA(5335), TA(5337)],
    ],
    localizacion: [
      ['Los nodos ilíacos internos rodean la arteria ilíaca interna y sus ramas.', II_SITIO],
      ['La arteria glútea inferior es una rama terminal del tronco anterior de la arteria ilíaca interna.', W('Inferior_gluteal_artery', 'is a terminal branch of the anterior trunk of the internal iliac artery')],
    ],
    reparo: [
      ['La arteria glútea inferior, que pasa por la parte inferior del agujero ciático mayor y sigue por detrás del muslo.', W('Inferior_gluteal_artery', 'It passes through the inferior part of the greater sciatic foramen.'), W('Inferior_gluteal_artery', 'It continues down the back of the thigh')],
    ],
    recibe: [...ILIACO_INTERNO_RECIBE],
    drena: [...ILIACO_INTERNO_DRENA],
    modelo: [NODOS_ESQUEMATICOS, ['Su posición junto a la arteria glútea inferior sigue su nombre en la Terminologia Anatomica; las fuentes libres consultadas solo describen el grupo ilíaco interno en conjunto.', MODELO]],
    vias: { ...VIAS_ILIACO_INTERNO },
  },
  Lateral_sacral_nodes: {
    tipo: 'nodo', ta2: 5338,
    descripcion: [
      ['Nodos (ganglios) sacros laterales: en la Terminologia Anatomica forman parte de los nodos ilíacos internos.', TA(5334), TA(5338)],
    ],
    localizacion: [
      ['Los nodos sacros están en la concavidad del sacro, en relación con las arterias sacras media y laterales.', SACROS_SITIO],
      ['La arteria sacra lateral nace de la división posterior de la arteria ilíaca interna.', W('Lateral_sacral_artery', 'arises from the posterior division of the internal iliac artery')],
    ],
    reparo: [
      ['La arteria sacra lateral, que cruza por delante del piriforme y de los nervios sacros hasta el lado medial de los agujeros sacros anteriores y baja por la cara anterior del sacro.', W('Lateral_sacral_artery', 'The inferior runs obliquely across the front of the piriformis and the sacral nerves to the medial side of the anterior sacral foramina, descends on the front of the sacrum')],
    ],
    recibe: [
      ['Los nodos sacros reciben la linfa del recto y de la pared posterior de la pelvis.', SACROS_RECIBEN],
      ['En el varón les llegan también vasos de la próstata.', W('Prostate', 'Vessels of the prostate itself also drain into the obturator and sacral lymph nodes.')],
    ],
    drena: [
      ['Como nodos ilíacos internos (hipogástricos), su linfa va a los nodos ilíacos comunes.', TA(5334), TA(5338), II_NOMBRE, CI_RECIBE],
    ],
    modelo: [NODOS_ESQUEMATICOS, LATIN_CORREGIDO],
    vias: { ...VIAS_ILIACO_INTERNO },
  },

  // ── Nodos viscerales de la pelvis: paravesicales y pararrectales ──
  Prevesical_nodes: {
    tipo: 'nodo', ta2: 5341,
    descripcion: [
      ['Nodos (ganglios) prevesicales: en la Terminologia Anatomica, uno de los subgrupos de los nodos paravesicales, que son nodos viscerales de la pelvis.', TA(5339), TA(5340), TA(5341)],
    ],
    localizacion: [
      ['Su nombre los sitúa delante de la vejiga urinaria.', TA(5341)],
    ],
    reparo: [
      ['La cara anterior de la vejiga urinaria.', TA(5341)],
    ],
    recibe: [...VESICAL_RECIBE],
    drena: [...VESICAL_DRENA],
    modelo: [NODOS_ESQUEMATICOS, SIN_LADO, VESICAL_MODELO],
    vias: { ...VIAS_VESICAL },
  },
  Postvesical_nodes: {
    tipo: 'nodo', ta2: 5342,
    descripcion: [
      ['Nodos (ganglios) retrovesicales: en la Terminologia Anatomica, uno de los subgrupos de los nodos paravesicales, que son nodos viscerales de la pelvis.', TA(5339), TA(5340), TA(5342)],
    ],
    localizacion: [
      ['Su nombre los sitúa detrás de la vejiga urinaria.', TA(5342)],
    ],
    reparo: [
      ['La cara posterior de la vejiga urinaria.', TA(5342)],
    ],
    recibe: [...VESICAL_RECIBE],
    drena: [...VESICAL_DRENA],
    modelo: [NODOS_ESQUEMATICOS, SIN_LADO, VESICAL_MODELO],
    vias: { ...VIAS_VESICAL },
  },
  Lateral_vesical_nodes: {
    tipo: 'nodo', ta2: 5343,
    descripcion: [
      ['Nodos (ganglios) vesicales laterales: en la Terminologia Anatomica, uno de los subgrupos de los nodos paravesicales, que son nodos viscerales de la pelvis.', TA(5339), TA(5340), TA(5343)],
    ],
    localizacion: [
      ['Su nombre los sitúa a los lados de la vejiga urinaria.', TA(5343)],
    ],
    reparo: [
      ['Las caras laterales de la vejiga, por donde las venas vesicales siguen los ligamentos laterales de la vejiga hacia las venas ilíacas internas.', TA(5343), W('Urinary_bladder', 'which coalesce and travel with the lateral ligaments of the bladder into the internal iliac veins')],
    ],
    recibe: [...VESICAL_RECIBE],
    drena: [...VESICAL_DRENA],
    modelo: [NODOS_ESQUEMATICOS, VESICAL_MODELO, LATIN_CORREGIDO],
    vias: { ...VIAS_VESICAL },
  },
  Pararectal_nodes: {
    tipo: 'nodo', ta2: 5346,
    descripcion: [
      ['Nodos (ganglios) pararrectales: nodos en contacto con la superficie muscular del recto.', W('Pararectal_lymph_nodes', 'The pararectal lymph nodes are lymph nodes that are in contact with the muscular surface of the rectum.')],
      ['En la Terminologia Anatomica son nodos viscerales de la pelvis.', TA(5339), TA(5346)],
    ],
    localizacion: [
      ['Están a la izquierda y a la derecha del recto.', W('Pararectal_lymph_nodes', 'The pararectal lymph nodes are located on the left and right of the rectum.')],
    ],
    reparo: [
      ['La pared muscular del recto, con la que están en contacto.', W('Pararectal_lymph_nodes', 'are lymph nodes that are in contact with the muscular surface of the rectum')],
    ],
    recibe: [
      ['Drenan la porción ilíaca del colon descendente, el colon sigmoide y la parte superior del recto.', W('Pararectal_lymph_nodes', 'The pararectal lymph nodes drain the descending iliac and sigmoid parts of the large intestine, and the upper part of the rectum.')],
    ],
    drena: [
      ['Sus vasos eferentes van a los nodos preaórticos.', W('Pararectal_lymph_nodes', 'Their efferent lymph ducts pass to the pre-aortic lymph nodes.')],
    ],
    modelo: [
      NODOS_ESQUEMATICOS,
      ['En este modelo una sola pieza, sin lado, reúne los nodos de los dos lados del recto.', MODELO],
      ['La mitad superior del recto, por encima de la línea pectínea, drena también en los nodos ilíacos internos; el modelo no traza esa vía por separado.', II_RECTO, MODELO],
    ],
    vias: { drena: ['Pre_aortic_nodes'] },
  },
};
