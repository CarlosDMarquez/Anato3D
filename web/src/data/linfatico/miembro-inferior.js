// Fichas de los nodos del miembro inferior (inguinales, poplíteos, tibiales y fibular): grupo «Lymph_nodes_of_lower_limb».
// Formato y reglas: ./formato.js (cada frase con su fuente; MODELO solo en «En este modelo»). Clave = nombre de la pieza
// sin _L/_R. Comprobar: node scripts/linfatico-citas.mjs comprobar && node scripts/check-cards.mjs
// BORRADOR redactado con IA, sin revisión médica. Tabla de fuentes: docs/fuentes/linfatico-miembro-inferior.md.
//
// Fuentes: casi todo sale de dos páginas de Wikipedia en inglés («Inguinal lymph nodes» y «Popliteal lymph nodes»; esta
// última incorpora texto de dominio público del Gray de 1918) y de las páginas de sus reparos (triángulo femoral, conducto
// femoral, hiato safeno, venas safenas, fosa poplítea). Ninguna fuente libre consultada describe los nodos tibiales ni el
// fibular: de ellos solo se afirma la nomenclatura de la TA2 y lo que se ve en el modelo; el resto queda en «pendientes».
import { W, TA, MODELO } from './formato.js';

// ── Frases comunes ───────────────────────────────────────────────────────────────────────────────────────────────────
const REPRESENTATIVO = ['En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.', MODELO];
const UN_NODO = ['En este modelo el nodo se representa con una forma y un tamaño esquemáticos.', MODELO];
const NUEVA = ['Es una pieza que Z-Anatomy traía oculta (su nombre va entre paréntesis) y que Anato3D añade al modelo en la revisión del sistema linfático de noviembre de 2026.', MODELO];
const PARENTESIS = (n) => ['En la Terminologia Anatomica 2 su nombre figura entre paréntesis.', TA(n)];

// Nodos inguinales superficiales (tres subgrupos alrededor del hiato safeno).
const ING_SUP_QUE = ['Forman parte de los nodos (ganglios) inguinales superficiales, una cadena de unos 10 nodos situada inmediatamente por debajo del ligamento inguinal.', W('Inguinal_lymph_nodes', 'form a chain immediately inferior to the inguinal ligament'), W('Inguinal_lymph_nodes', 'There are approximately 10 superficial lymph nodes.')];
const ING_SUP_TRES = ['Los inguinales superficiales se dividen en tres grupos: inferior, superolateral y superomedial.', W('Inguinal_lymph_nodes', 'They are divided into three groups:'), TA(5350), TA(5351), TA(5352)];
const ING_SUP_FASCIA = ['Están en el triángulo femoral, en la fascia superficial (bajo la fascia de Camper), sobre los vasos femorales en la cara medial del muslo.', W('Femoral_triangle', 'The superficial fascia contains the superficial inguinal lymph nodes'), W('Inguinal_lymph_nodes', 'They lie deep to the fascia of Camper that overlies the femoral vessels at the medial aspect of the thigh.')];
const ING_SUP_LIMITES = ['Su territorio está limitado por arriba por el ligamento inguinal, lateralmente por el borde del sartorio y medialmente por el aductor largo.', W('Inguinal_lymph_nodes', 'They are bounded superiorly by the inguinal ligament in the femoral triangle, laterally by the border of the sartorius muscle, and medially by the adductor longus muscle.')];
const HIATO = ['El hiato safeno es una abertura ovalada de la fascia lata, 3–4 cm por debajo y lateral al tubérculo del pubis; por él la vena safena magna atraviesa la fascia cribiforme para unirse a la vena femoral.', W('Saphenous_opening', 'is an oval opening in the upper mid part of the fascia lata of the thigh'), W('Saphenous_opening', 'It lies 3–4 cm below and lateral to the pubic tubercle'), W('Great_saphenous_vein', 'dives down deep through the cribriform fascia of the saphenous opening to join the femoral vein')];
const ING_SUP_AFERENTES = ['El conjunto de los inguinales superficiales puede recibir, según el caso, la piel del pene, el escroto, el periné, la nalga, la pared abdominal por debajo del ombligo, la espalda por debajo de la cresta ilíaca, la vulva y el ano por debajo de la línea pectínea.', W('Inguinal_lymph_nodes', 'They may receive lymphatic afferents from the following as applicable'), W('Inguinal_lymph_nodes', 'integument of the penis scrotum perineum buttock abdominal wall below the level of the umbilicus back below the level of the iliac crest vulva anus (below the pectinate line)')];
const ING_SUP_DRENA = ['Drenan en los nodos inguinales profundos.', W('Inguinal_lymph_nodes', 'They drain to the deep inguinal lymph nodes.'), W('Femoral_triangle', 'It receives lymphatic drainage from superficial inguinal lymph nodes')];
const ING_TAMANO = ['La fuente da dos cifras de tamaño normal: hasta 2 cm de diámetro y, medido en el eje corto, una media de 5,4 mm con un límite habitual de 10 mm.', W('Inguinal_lymph_nodes', 'They normally measure up to 2 cm in diameter.'), W('Inguinal_lymph_nodes', 'The mean size of an inguinal lymph node, as measured over the short-axis, is approximately 5.4 mm (range 2.1-13.6 mm)'), W('Inguinal_lymph_nodes', 'A size of up to 10 mm is generally regarded as a cut-off value for normal vs abnormal inguinal lymph node size.')];
const ING_CLINICA = ['Su aumento de tamaño es un signo clínico importante: puede indicar una infección o la metástasis de un cáncer, como el de ano o el de vulva.', W('Inguinal_lymph_nodes', 'The presence of swollen inguinal lymph nodes is an important clinical sign because lymphadenopathy (swelling) may indicate an infection, or spread as a metastasis from cancers, such as anal cancer and vulvar cancer.')];
const PALPABLES = ['Los nodos inguinales, cerca del pliegue de la ingle, se pueden palpar cuando aumentan de tamaño y a veces sin aumentar.', W('Lymph_node', 'Some lymph nodes can be felt when enlarged (and occasionally when not)'), W('Lymph_node', 'the inguinal lymph nodes near the groin crease')];
const DRENAJE_SUP = ['Esta ficha no reparte entre los tres subgrupos los aferentes del conjunto: la fuente da una lista común y un territorio principal para cada subgrupo.', MODELO];

// Nodos inguinales profundos.
const ING_PROF_QUE = ['Los nodos inguinales profundos son de 3 a 5.', W('Inguinal_lymph_nodes', 'The deep inguinal lymph nodes are 3-5 in number.')];
const ING_PROF_TRES = ['La Terminologia Anatomica 2 distingue tres nodos inguinales profundos: proximal, intermedio y distal; los dos primeros figuran entre paréntesis.', TA(5354), TA(5355), TA(5356)];
const ING_PROF_SITIO = ['Están por dentro de la parte superior de la vena femoral, en profundidad respecto a la fascia (la cribiforme, según una de las fuentes), dentro del conducto femoral, el compartimento medial de la vaina femoral.', W('Inguinal_lymph_nodes', 'They lie medial to the femoral vein deep to the cribriform fascia.'), W('Femoral_triangle', 'It lies deep to the deep fascia, medial to the upper part of the femoral vein, inside the femoral canal (medial compartment of the femoral sheath).')];
const CONDUCTO_FEMORAL = ['El conducto femoral contiene vasos linfáticos, tejido adiposo y tejido conectivo laxo y, a veces, un nodo inguinal profundo.', W('Femoral_canal', 'The femoral canal contains lymphatic vessels, and adipose and loose connective tissue, as well as - sometimes - a deep inguinal lymph node.')];
const VENA_FEMORAL = ['La vena femoral: los inguinales profundos quedan por dentro de ella, bajo la fascia cribiforme.', W('Inguinal_lymph_nodes', 'They lie medial to the femoral vein deep to the cribriform fascia.')];
const ING_PROF_RECIBE = ['Reciben la linfa de los inguinales superficiales, del glande del pene o del clítoris y de los linfáticos profundos del miembro inferior.', W('Femoral_triangle', 'It receives lymphatic drainage from superficial inguinal lymph nodes, lymphatic drainage from the glans penis or clitoris, and from the deep lymphatics of the lower limb.')];
const POPLITEOS_A_PROF = ['Los eferentes de los nodos poplíteos suben casi todos junto a los vasos femorales hasta los inguinales profundos.', W('Popliteal_lymph_nodes', 'The efferents of the popliteal lymph nodes pass almost entirely alongside the femoral vessels to the deep inguinal lymph nodes')];
const ING_PROF_DRENA = ['Drenan hacia arriba en los nodos ilíacos externos y, de ahí, en los nodos pélvicos y en los paraaórticos.', W('Inguinal_lymph_nodes', 'The deep inguinal lymph nodes drain superiorly to the external iliac lymph nodes, then to the pelvic lymph nodes and on to the paraaortic lymph nodes.'), W('External_iliac_lymph_nodes', 'Their principal afferents are derived from the inguinal lymph nodes')];
const CLOQUET = ['El nodo profundo más superior, situado en la ingle en profundidad respecto al ligamento inguinal, se llama nodo de Cloquet o de Rosenmüller; también puede considerarse el más inferior de los ilíacos externos.', W('Inguinal_lymph_nodes', 'The superior-most node is situated in the groin, deep to the inguinal ligament, and is termed the Cloquet\'s node (also Rosenmuller\'s node).'), W('Inguinal_lymph_nodes', 'It can instead be considered as the inferior-most of the external iliac lymph nodes.')];

// Nodos poplíteos (texto del Gray de 1918 en Wikipedia).
const POPL_QUE = ['Los nodos (ganglios) poplíteos son pequeños, unos seis o siete, y están en la grasa de la fosa poplítea, detrás de la rodilla.', W('Popliteal_lymph_nodes', 'small in size and some six or seven in number, are embedded in the fat contained in the popliteal fossa'), W('Popliteal_fossa', 'is a shallow depression located at the back of the knee joint')];
const POPL_FOSA = ['La fosa poplítea, como otras superficies de flexión de las grandes articulaciones, tiene un mayor número de nodos linfáticos.', W('Popliteal_fossa', 'it is an area where blood vessels and nerves pass relatively superficially, and with an increased number of lymph nodes')];
const POPL_A_SUP = ['Unos pocos eferentes poplíteos acompañan a la vena safena magna y terminan en los nodos inguinales superficiales (el grupo «subinguinal superficial» de la fuente).', W('Popliteal_lymph_nodes', 'but a few may accompany the great saphenous vein, and end in the glands of the superficial subinguinal group')];
const BOMBA = ['La linfa de las piernas sube hacia el corazón gracias a la bomba de la pantorrilla: al caminar, el músculo de la pantorrilla se contrae y exprime la linfa; al relajarse, las válvulas de los vasos impiden que vuelva.', W('Popliteal_lymph_nodes', 'The flow of lymph from the legs towards the heart is the result of the calf pump'), W('Popliteal_lymph_nodes', 'during walking the calf muscle contracts, squeezing lymph out of the leg via the lymphatic vessels'), W('Popliteal_lymph_nodes', 'valves in the vessels shut preventing the fluid from returning to the lower extremities')];
const POPL_NOMBRES = ['La fuente describe los nodos poplíteos por su posición, sin llamarlos superficiales o profundos; esta ficha asigna al grupo superficial el nodo bajo la fascia poplítea, junto a la safena menor, y al profundo los que están junto a los vasos poplíteos y la articulación.', MODELO];

// Nodos tibiales y fibular (piezas nuevas): solo nomenclatura con fuente.
const TIBIALES_VASOS = ['En la pierna, los troncos linfáticos profundos acompañan a los vasos tibiales anteriores y posteriores y llegan a los nodos poplíteos situados a los lados de los vasos poplíteos.', W('Popliteal_lymph_nodes', 'The others lie at the sides of the popliteal vessels, and receive, as efferents, the trunks that accompany the anterior and posterior tibial vessels.')];
const SIN_FUENTE_PIERNA = 'Ninguna fuente libre consultada (Wikipedia en inglés y en español) describe este nodo.';

export default {
  Superomedial_superficial_inguinal_nodes: {
    tipo: 'nodo', ta2: 5350,
    descripcion: [ING_SUP_QUE, ING_SUP_TRES],
    localizacion: [
      ['Los superomediales están a la altura de la parte media del hiato safeno.', W('Inguinal_lymph_nodes', 'superomedial – located at the middle of the saphenous opening')],
      ING_SUP_FASCIA,
      ING_SUP_LIMITES,
    ],
    reparo: [HIATO],
    recibe: [
      ['Reciben la linfa del periné y de los genitales.', W('Inguinal_lymph_nodes', 'take drainage from the perineum and genitals')],
      ING_SUP_AFERENTES,
    ],
    drena: [ING_SUP_DRENA],
    modelo: [REPRESENTATIVO, DRENAJE_SUP],
    notas: [ING_CLINICA, PALPABLES],
    vias: { drena: ['Proximal_deep_inguinal_node', 'Intermediate_deep_inguinal_node'] },
  },

  Superolateral_superficial_inguinal_nodes: {
    tipo: 'nodo', ta2: 5351,
    descripcion: [ING_SUP_QUE, ING_SUP_TRES],
    localizacion: [
      ['Los superolaterales están a un lado del hiato safeno.', W('Inguinal_lymph_nodes', 'superolateral – on the side of the saphenous opening')],
      ING_SUP_FASCIA,
      ING_SUP_LIMITES,
    ],
    reparo: [HIATO],
    recibe: [
      ['Reciben la linfa de la parte lateral de la nalga y de la parte baja de la pared abdominal.', W('Inguinal_lymph_nodes', 'receive drainage from the side buttocks and the lower abdominal wall')],
      ING_SUP_AFERENTES,
    ],
    drena: [ING_SUP_DRENA],
    modelo: [REPRESENTATIVO, DRENAJE_SUP],
    notas: [ING_CLINICA, PALPABLES],
    vias: { drena: ['Proximal_deep_inguinal_node', 'Intermediate_deep_inguinal_node'] },
  },

  Inferior_superficial_inguinal_nodes: {
    tipo: 'nodo', ta2: 5352,
    descripcion: [ING_SUP_QUE, ING_SUP_TRES],
    localizacion: [
      ['Los inferiores están por debajo del hiato safeno.', W('Inguinal_lymph_nodes', 'inferior – inferior of the saphenous opening of the leg')],
      ING_SUP_FASCIA,
      ING_SUP_LIMITES,
    ],
    reparo: [
      HIATO,
      ['La parte alta de la vena safena magna, que está en la misma fascia superficial del triángulo femoral que los inguinales superficiales.', W('Femoral_triangle', 'The superficial fascia contains the superficial inguinal lymph nodes, femoral branch of the genitofemoral nerve, branches of the ilioinguinal nerve, superficial branches of the femoral artery with accompanying veins, and upper part of the great saphenous vein.')],
    ],
    recibe: [
      ['Reciben la linfa de las piernas.', W('Inguinal_lymph_nodes', 'receive drainage from lower legs')],
      ['Al conjunto superficial le llega la linfa del muslo y de la cara medial de la pierna; la de la cara lateral de la pierna pasa antes por los nodos poplíteos.', W('Inguinal_lymph_nodes', 'the thigh and the medial side of the leg (the lateral leg drains to the popliteal lymph nodes first)')],
      POPL_A_SUP,
    ],
    drena: [ING_SUP_DRENA],
    modelo: [REPRESENTATIVO, DRENAJE_SUP],
    notas: [ING_TAMANO, PALPABLES],
    vias: { recibe: ['Superficial_lymphatic_vessels_of_lower_limb'], drena: ['Proximal_deep_inguinal_node', 'Intermediate_deep_inguinal_node'] },
  },

  Intermediate_deep_inguinal_node: {
    tipo: 'nodo', ta2: 5355,
    descripcion: [ING_PROF_QUE, ING_PROF_TRES],
    localizacion: [ING_PROF_SITIO, CONDUCTO_FEMORAL],
    reparo: [VENA_FEMORAL],
    recibe: [ING_PROF_RECIBE, POPLITEOS_A_PROF],
    drena: [ING_PROF_DRENA],
    modelo: [
      UN_NODO,
      NUEVA,
      ['La fuente no describe por separado el nodo intermedio: lo que dice esta ficha vale para el conjunto de los inguinales profundos.', MODELO],
      ['El nodo inguinal profundo distal de la TA2 no está en Z-Anatomy y no se representa.', TA(5356), MODELO],
    ],
    vias: {
      recibe: ['Superomedial_superficial_inguinal_nodes', 'Superolateral_superficial_inguinal_nodes', 'Inferior_superficial_inguinal_nodes', 'Deep_popliteal_nodes', 'Deep_lymphatic_vessels_of_lower_limb'],
      drena: ['Medial_external_iliac_nodes', 'Intermediate_external_iliac_nodes'],
    },
  },

  Proximal_deep_inguinal_node: {
    tipo: 'nodo', ta2: 5354,
    descripcion: [ING_PROF_QUE, ING_PROF_TRES, CLOQUET],
    localizacion: [
      ['El más superior de los inguinales profundos está en la ingle, en profundidad respecto al ligamento inguinal, dentro del conducto femoral.', W('Inguinal_lymph_nodes', 'The superior-most node is situated in the groin, deep to the inguinal ligament'), W('Femoral_triangle', 'Cloquet\'s node (also known as Rosenmuller\'s node) also lies in this canal.')],
      ING_PROF_SITIO,
    ],
    reparo: [
      ['El ligamento inguinal, que lo cubre por delante, y la vena femoral, que queda por fuera de él.', W('Inguinal_lymph_nodes', 'deep to the inguinal ligament'), W('Inguinal_lymph_nodes', 'They lie medial to the femoral vein deep to the cribriform fascia.')],
    ],
    recibe: [ING_PROF_RECIBE, POPLITEOS_A_PROF],
    drena: [ING_PROF_DRENA],
    modelo: [
      UN_NODO,
      NUEVA,
      ['Esta ficha identifica el nodo inguinal profundo proximal de la TA2 con el nodo de Cloquet porque las fuentes llaman así al más superior de los profundos; la TA2 no da el epónimo.', TA(5354), MODELO],
    ],
    notas: [
      ['El nodo de Cloquet se considera un posible nodo centinela.', W('Inguinal_lymph_nodes', 'Cloquet\'s node is also considered as a potential sentinel lymph node.')],
      ['Tras una biopsia de nodo centinela positiva se suelen extirpar solo los nodos superficiales, salvo que el nodo de Cloquet esté afectado clínicamente.', W('Femoral_triangle', 'generally only the superficial nodes are removed, unless Cloquet\'s node (the most superior of the deep nodes) is clinically positive')],
      ['El epónimo recuerda al cirujano francés Jules Germain Cloquet o al anatomista alemán Johann Christian Rosenmüller.', W('Inguinal_lymph_nodes', 'This node is named for French surgeon Jules Germain Cloquet, or for German anatomist Johann Christian Rosenmüller.')],
    ],
    vias: {
      recibe: ['Superomedial_superficial_inguinal_nodes', 'Superolateral_superficial_inguinal_nodes', 'Inferior_superficial_inguinal_nodes', 'Deep_popliteal_nodes', 'Deep_lymphatic_vessels_of_lower_limb'],
      drena: ['Medial_external_iliac_nodes', 'Intermediate_external_iliac_nodes'],
    },
  },

  Superficial_popliteal_nodes: {
    tipo: 'nodo', ta2: 5358,
    descripcion: [POPL_QUE, POPL_FOSA],
    localizacion: [
      ['Uno de los nodos poplíteos está justo bajo la fascia poplítea, cerca de la parte final de la vena safena menor.', W('Popliteal_lymph_nodes', 'One lies immediately beneath the popliteal fascia, near the terminal part of the small saphenous vein')],
    ],
    reparo: [
      ['La terminación de la vena safena menor, que sube por la cara posterior de la pierna, pasa entre las cabezas del gastrocnemio y suele desembocar en la vena poplítea a la altura de la rodilla o por encima.', W('Popliteal_lymph_nodes', 'near the terminal part of the small saphenous vein'), W('Small_saphenous_vein', 'runs along the posterior aspect of the leg (with the sural nerve), where it passes between the heads of the gastrocnemius muscle'), W('Small_saphenous_vein', 'Usually, it drains into the popliteal vein, at or above the level of the knee joint.')],
    ],
    recibe: [
      ['Drena la región de la que la safena menor recoge sus tributarias: las zonas superficiales de la cara posterolateral de la pierna y la planta del pie.', W('Popliteal_lymph_nodes', 'drains the region from which this vein derives its tributaries, such as superficial regions of the posterolateral aspect of the leg and the plantar aspect of the foot')],
      ['La linfa de la cara lateral de la pierna pasa por los nodos poplíteos antes de llegar a los inguinales.', W('Inguinal_lymph_nodes', 'the lateral leg drains to the popliteal lymph nodes first')],
    ],
    drena: [POPLITEOS_A_PROF, POPL_A_SUP],
    modelo: [REPRESENTATIVO, POPL_NOMBRES],
    notas: [BOMBA],
    vias: { recibe: ['Superficial_lymphatic_vessels_of_lower_limb'], drena: ['Intermediate_deep_inguinal_node', 'Inferior_superficial_inguinal_nodes'] },
  },

  Deep_popliteal_nodes: {
    tipo: 'nodo', ta2: 5359,
    descripcion: [POPL_QUE, POPL_FOSA],
    localizacion: [
      ['Uno está entre la arteria poplítea y la cara posterior de la articulación de la rodilla.', W('Popliteal_lymph_nodes', 'Another is between the popliteal artery and the posterior surface of the knee-joint.')],
      ['Los demás están a los lados de los vasos poplíteos.', W('Popliteal_lymph_nodes', 'The others lie at the sides of the popliteal vessels')],
    ],
    reparo: [
      ['La arteria y la vena poplíteas, en la fosa poplítea; la arteria poplítea continúa a la arteria femoral.', W('Popliteal_lymph_nodes', 'The others lie at the sides of the popliteal vessels'), W('Popliteal_fossa', 'popliteal artery, a continuation of the femoral artery')],
    ],
    recibe: [
      ['El nodo situado detrás de la rodilla recibe la linfa de la articulación de la rodilla y los vasos que acompañan a las arterias geniculares.', W('Popliteal_lymph_nodes', 'It receives afferents from the knee-joint, together with those that accompany the genicular arteries.')],
      TIBIALES_VASOS,
    ],
    drena: [POPLITEOS_A_PROF, POPL_A_SUP],
    modelo: [REPRESENTATIVO, POPL_NOMBRES],
    notas: [BOMBA],
    vias: {
      recibe: ['Deep_lymphatic_vessels_of_lower_limb'],
      drena: ['Intermediate_deep_inguinal_node', 'Proximal_deep_inguinal_node', 'Inferior_superficial_inguinal_nodes'],
    },
  },

  Anterior_tibial_node: {
    tipo: 'nodo', ta2: 5360,
    descripcion: [
      ['Nodo (ganglio) linfático de la pierna que la Terminologia Anatomica 2 llama nodo tibial anterior.', TA(5360)],
      PARENTESIS(5360),
    ],
    recibe: [TIBIALES_VASOS],
    modelo: [
      UN_NODO,
      NUEVA,
      ['En este modelo el nodo está en la parte alta de la pierna, en la posición que le da Z-Anatomy; esa posición no procede de una fuente citada.', MODELO],
    ],
    pendientes: {
      localizacion: SIN_FUENTE_PIERNA,
      reparo: SIN_FUENTE_PIERNA,
      drena: `${SIN_FUENTE_PIERNA} La tabla del encargo supone que drena en los poplíteos profundos, pero no se afirma sin fuente.`,
    },
    vias: { recibe: ['Deep_lymphatic_vessels_of_lower_limb'] },
  },

  Posterior_tibial_node: {
    tipo: 'nodo', ta2: 5361,
    descripcion: [
      ['Nodo (ganglio) linfático de la pierna que la Terminologia Anatomica 2 llama nodo tibial posterior.', TA(5361)],
      PARENTESIS(5361),
    ],
    recibe: [TIBIALES_VASOS],
    modelo: [
      UN_NODO,
      NUEVA,
      ['En este modelo el nodo está en la parte alta de la pierna, en la posición que le da Z-Anatomy; esa posición no procede de una fuente citada.', MODELO],
    ],
    pendientes: {
      localizacion: SIN_FUENTE_PIERNA,
      reparo: SIN_FUENTE_PIERNA,
      drena: `${SIN_FUENTE_PIERNA} La tabla del encargo supone que drena en los poplíteos profundos, pero no se afirma sin fuente.`,
    },
    vias: { recibe: ['Deep_lymphatic_vessels_of_lower_limb'] },
  },

  Fibular_node: {
    tipo: 'nodo', ta2: 5362,
    descripcion: [
      ['Nodo (ganglio) linfático de la pierna que la Terminologia Anatomica 2 llama nodo fibular.', TA(5362)],
      PARENTESIS(5362),
    ],
    modelo: [
      UN_NODO,
      NUEVA,
      ['En este modelo el nodo está en la parte alta de la pierna, en la posición que le da Z-Anatomy; esa posición no procede de una fuente citada.', MODELO],
    ],
    pendientes: {
      localizacion: SIN_FUENTE_PIERNA,
      reparo: SIN_FUENTE_PIERNA,
      recibe: `${SIN_FUENTE_PIERNA} La fuente sobre los poplíteos solo nombra los troncos que acompañan a los vasos tibiales, no a los fibulares.`,
      drena: `${SIN_FUENTE_PIERNA} La tabla del encargo supone que drena en los poplíteos profundos, pero no se afirma sin fuente.`,
    },
  },
};
