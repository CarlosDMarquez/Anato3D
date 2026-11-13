// Fichas de los nodos del miembro superior y de la axila: grupo «Lymph_nodes_of_upper_limb».
// Formato y reglas: ./formato.js (cada frase con su fuente; MODELO solo en «En este modelo»). Clave = nombre de la pieza
// sin _L/_R. Comprobar: node scripts/linfatico-citas.mjs comprobar && node scripts/check-cards.mjs
//
// BORRADOR redactado con IA a partir de las fuentes citadas, sin revisión de un especialista. Fuentes: Wikipedia en
// inglés y en español (CC BY-SA 4.0; varias páginas incorporan texto de dominio público del Gray de 1918) y la TA2.
// Tabla de fuentes y contraste con la tabla de drenaje: docs/fuentes/linfatico-miembro-superior.md.
//
// Ojo con los nombres: el Gray de 1918 (y con él la Wikipedia inglesa) llama «brachial glands/lymph nodes» al grupo
// axilar LATERAL y «subclavicular» al APICAL; la TA2 distingue «Nodi brachiales» (5244) de «Nodi axillares laterales;
// nodi humerales» (5239). Aquí las citas de «Brachial_lymph_nodes» respaldan la ficha de Lateral_axillary_nodes.
import { W, ES, TA, MODELO } from './formato.js';

// ── Frases que se repiten ──
const REPRESENTATIVO = ['En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.', MODELO];
const AXILARES_GRUPOS = ['Los nodos axilares son entre 20 y 49 y se dividen en grupos según su posición en la axila.', W('Axillary_lymph_nodes', 'Between 20 and 49 in number'), W('Axillary_lymph_nodes', 'They are divided in several groups according to their location in the armpit.'), TA(5236)];
const A_CENTRALES = ['Su linfa va a los nodos axilares centrales, que reciben la de los grupos lateral, anterior y posterior.', W('Axillary_lymph_nodes', 'these nodes receive lymph from the above three groups'), W('Central_lymph_nodes', 'Its afferent lymphatic vessels are the efferent vessels of all the preceding groups of axillary lymph nodes')];
const A_APICALES = ['Los nodos axilares apicales reciben los eferentes de todos los demás grupos axilares.', W('Axillary_lymph_nodes', 'these nodes receive the efferent lymph vessels from all the other axillary nodes'), W('Apical_lymph_nodes', 'However, it receives the efferents of all the other axillary glands.')];
const sinonimo = (s) => [`El latín del modelo pone el sinónimo de la TA2, «${s}», tras punto y coma.`, MODELO];

export default {
  // ── Axila ──
  Anterior_axillary_nodes: {
    tipo: 'nodo', ta2: 5241,
    descripcion: [
      ['Grupo anterior o pectoral de los nodos (ganglios) axilares.', W('Axillary_lymph_nodes', 'Anterior (pectoral) group'), TA(5241)],
      AXILARES_GRUPOS,
    ],
    localizacion: [
      ['Están a lo largo del borde inferior del pectoral menor, por detrás del pectoral mayor.', W('Axillary_lymph_nodes', 'Lying along the lower border of the pectoralis minor behind the pectoralis major')],
    ],
    reparo: [
      ['El borde inferior del músculo pectoral menor.', W('Axillary_lymph_nodes', 'Lying along the lower border of the pectoralis minor')],
    ],
    recibe: [
      ['Reciben los vasos linfáticos de los cuadrantes laterales de la mama.', W('Axillary_lymph_nodes', 'these nodes receive lymph vessels from the lateral quadrants of the breast')],
      ['También les llegan los vasos superficiales de la pared anterolateral del abdomen situada por encima del ombligo.', W('Axillary_lymph_nodes', 'superficial vessels from the anterolateral abdominal wall above the level of the umbilicus')],
    ],
    drena: [A_CENTRALES, A_APICALES],
    modelo: [REPRESENTATIVO, sinonimo('nodi pectorales')],
    notas: [
      ['Alrededor del 75 % de la linfa de la mama drena en los nodos axilares, que por eso importan en el diagnóstico y la estadificación del cáncer de mama.', W('Axillary_lymph_nodes', 'About 75% of lymph from the breasts drains into the axillary lymph nodes, making them important in the diagnosis and staging of breast cancer.')],
    ],
    vias: { drena: ['Central_axillary_nodes', 'Apical_axillary_nodes'] },
  },

  Posterior_axillary_nodes: {
    tipo: 'nodo', ta2: 5240,
    descripcion: [
      ['Grupo posterior o subescapular de los nodos (ganglios) axilares.', W('Axillary_lymph_nodes', 'Posterior (subscapular) group'), TA(5240)],
      AXILARES_GRUPOS,
    ],
    localizacion: [
      ['Están por delante del músculo subescapular, que forma la pared posterior de la axila junto con el redondo mayor y el dorsal ancho.', W('Axillary_lymph_nodes', 'Lying in front of the subscapularis muscle'), W('Axilla', 'posteriorly by the subscapularis, teres major and latissimus dorsi muscle')],
    ],
    reparo: [
      ['El músculo subescapular, por detrás de ellos.', W('Axillary_lymph_nodes', 'Lying in front of the subscapularis muscle')],
    ],
    recibe: [
      ['Reciben los vasos linfáticos superficiales de la espalda, hasta la altura de las crestas ilíacas.', W('Axillary_lymph_nodes', 'these nodes receive superficial lymph vessels from the back, down as far as the level of the iliac crests')],
    ],
    drena: [A_CENTRALES, A_APICALES],
    modelo: [REPRESENTATIVO, sinonimo('nodi subscapulares')],
    vias: { drena: ['Central_axillary_nodes', 'Apical_axillary_nodes'] },
  },

  Lateral_axillary_nodes: {
    tipo: 'nodo', ta2: 5239,
    descripcion: [
      ['Grupo lateral de los nodos (ganglios) axilares, llamados también nodos humerales.', W('Axillary_lymph_nodes', 'Lateral group'), TA(5239)],
      ['Son de cuatro a seis nodos.', W('Brachial_lymph_nodes', 'group of four to six lymph nodes')],
      ['La Wikipedia inglesa, que sigue el texto del Gray de 1918, llama a este grupo «brachial lymph nodes»; en la TA2, «nodos braquiales» es otro grupo.', W('Brachial_lymph_nodes', 'A brachial lymph nodes (or lateral group)'), W('Brachial_lymph_nodes', 'incorporates text in the public domain from the 20th edition of Gray'), TA(5244)],
    ],
    localizacion: [
      ['Están a lo largo del lado medial de la vena axilar, en relación con sus caras medial y posterior.', W('Axillary_lymph_nodes', 'Lying along the medial side of the axillary vein'), W('Brachial_lymph_nodes', 'which lies in relation to the medial and posterior aspects of the axillary vein')],
    ],
    reparo: [
      ['La vena axilar: los nodos quedan por dentro y por detrás de ella.', W('Brachial_lymph_nodes', 'which lies in relation to the medial and posterior aspects of the axillary vein')],
    ],
    recibe: [
      ['Reciben la mayoría de los vasos linfáticos del miembro superior.', W('Axillary_lymph_nodes', 'these nodes receive most of the lymph vessels of the upper limb')],
      ['Se exceptúan los vasos superficiales del lado lateral, que acompañan a la vena cefálica y van a los nodos infraclaviculares.', W('Axillary_lymph_nodes', 'except those superficial vessels draining the lateral side—see infraclavicular nodes, below'), W('Brachial_lymph_nodes', 'with the exception of that portion whose vessels accompany the cephalic vein'), W('Axillary_lymph_nodes', 'receive superficial lymph vessels from the lateral side of the hand, forearm, and arm')],
      ['Les llegan los vasos eferentes de los nodos del codo.', W('Elbow', 'The efferent lymph vessels from the elbow proceed to the lateral group of axillary lymph nodes.')],
    ],
    drena: [
      ['Sus eferentes van en parte a los nodos axilares centrales y apicales (subclaviculares) y en parte a los nodos cervicales profundos inferiores.', W('Brachial_lymph_nodes', 'The efferent vessels pass partly to the central and subclavicular groups of axillary glands and partly to the inferior deep cervical glands.'), W('Apical_lymph_nodes', 'An apical (or medial or subclavicular) group')],
    ],
    modelo: [
      REPRESENTATIVO,
      ['El latín heredado de Z-Anatomy decía «latérales», con tilde francesa; aquí se escribe «laterales» y el sinónimo «nodi humerales» va tras punto y coma.', MODELO],
    ],
    notas: [
      ['En las mujeres, el linfedema es más frecuente en un miembro superior tras la cirugía del cáncer de mama, sobre todo tras la disección de los nodos axilares.', W('Lymphedema', 'In women, it is most prevalent in an upper limb after breast cancer surgery, especially axillary lymph node dissection')],
    ],
    vias: {
      recibe: ['Cubital_nodes', 'Deep_lymphatic_vessels_of_upper_limb', 'Superficial_lymphatic_vessels_of_upper_limb'],
      drena: ['Central_axillary_nodes', 'Apical_axillary_nodes', 'Inferior_deep_lateral_cervical_nodes'],
    },
  },

  Central_axillary_nodes: {
    tipo: 'nodo', ta2: 5238,
    descripcion: [
      ['Grupo central o intermedio de los nodos (ganglios) axilares: tres o cuatro nodos grandes.', W('Central_lymph_nodes', 'The central lymph nodes or intermediate group of lymph nodes are three or four large lymph nodes'), TA(5238)],
      AXILARES_GRUPOS,
    ],
    localizacion: [
      ['Están en el centro de la axila, metidos en la grasa axilar, cerca de la base de la axila.', W('Axillary_lymph_nodes', 'Lying in the center of the axilla in the axillary fat'), W('Central_lymph_nodes', 'imbedded in the adipose tissue near the base of the axilla')],
    ],
    reparo: [
      ['El centro del hueco axilar, limitado por los músculos pectorales por delante, el subescapular, el redondo mayor y el dorsal ancho por detrás y el serrato anterior por dentro.', W('Axilla', 'medially by the serratus anterior muscle and thoracolumbar fascia, anteriorly by the pectoral muscles and posteriorly by the subscapularis, teres major and latissimus dorsi muscle')],
    ],
    recibe: [
      ['Reciben la linfa de los grupos axilares lateral, anterior y posterior.', W('Axillary_lymph_nodes', 'these nodes receive lymph from the above three groups'), W('Central_lymph_nodes', 'Its afferent lymphatic vessels are the efferent vessels of all the preceding groups of axillary lymph nodes')],
    ],
    drena: [
      ['Sus eferentes van a los nodos axilares apicales, llamados también subclaviculares.', W('Central_lymph_nodes', 'its efferents pass to the subclavicular group'), W('Apical_lymph_nodes', 'An apical (or medial or subclavicular) group')],
    ],
    modelo: [REPRESENTATIVO],
    vias: { recibe: ['Lateral_axillary_nodes', 'Anterior_axillary_nodes', 'Posterior_axillary_nodes'], drena: ['Apical_axillary_nodes'] },
  },

  Apical_axillary_nodes: {
    tipo: 'nodo', ta2: 5237,
    descripcion: [
      ['Grupo apical de los nodos (ganglios) axilares, llamado también medial o subclavicular: de seis a doce nodos.', W('Apical_lymph_nodes', 'An apical (or medial or subclavicular) group of six to twelve glands'), TA(5237)],
      ['Es la última estación de la axila: le llegan los eferentes de todos los demás grupos axilares.', W('Axillary_lymph_nodes', 'these nodes receive the efferent lymph vessels from all the other axillary nodes')],
    ],
    localizacion: [
      ['Están en el vértice de la axila, en el borde lateral de la primera costilla.', W('Axillary_lymph_nodes', 'Lying at the apex of the axilla at the lateral border of the 1st rib')],
      ['Quedan en parte por detrás de la porción superior del pectoral menor y en parte por encima de su borde superior.', W('Apical_lymph_nodes', 'is situated partly posterior to the upper portion of the pectoralis minor and partly above the upper border of this muscle')],
    ],
    reparo: [
      ['El borde superior del pectoral menor y el borde lateral de la primera costilla.', W('Apical_lymph_nodes', 'partly above the upper border of this muscle'), W('Axillary_lymph_nodes', 'at the lateral border of the 1st rib')],
    ],
    recibe: [
      ['Reciben los eferentes de todos los demás nodos axilares.', W('Apical_lymph_nodes', 'However, it receives the efferents of all the other axillary glands.')],
      ['Sus únicas aferencias directas desde un territorio son los vasos que acompañan a la vena cefálica y uno que drena la parte periférica superior de la mama.', W('Apical_lymph_nodes', 'Its only direct territorial afferents are those that accompany the cephalic vein, and one that drains the upper peripheral part of the mamma.')],
    ],
    drena: [
      ['Sus eferentes se unen y forman el tronco subclavio.', W('Apical_lymph_nodes', 'The efferent vessels of the subclavicular group unite to form the subclavian trunk'), W('Axillary_lymph_nodes', 'The apical nodes drain into the subclavian lymph trunk.')],
      ['Unos pocos eferentes suelen ir a los nodos cervicales profundos inferiores.', W('Apical_lymph_nodes', 'A few efferents from the subclavicular glands usually pass to the inferior deep cervical glands.')],
      ['El tronco subclavio desemboca a la izquierda en el conducto torácico y a la derecha en el conducto linfático derecho, o bien directamente en una de las grandes venas de la raíz del cuello.', W('Axillary_lymph_nodes', 'On the left side, this trunk drains into the thoracic duct; on the right side, it drains into the right lymphatic duct.'), W('Axillary_lymph_nodes', 'Alternatively, the lymph trunks may drain directly into one of the large veins at the root of the neck.')],
    ],
    modelo: [REPRESENTATIVO],
    vias: {
      recibe: ['Lateral_axillary_nodes', 'Anterior_axillary_nodes', 'Posterior_axillary_nodes', 'Central_axillary_nodes', 'Infraclavicular_nodes'],
      drena: ['Subclavian_trunk', 'Inferior_deep_lateral_cervical_nodes'],
    },
  },

  Interpectoral_nodes: {
    tipo: 'nodo', ta2: 5242,
    descripcion: [
      ['Nodos (ganglios) pequeños situados entre el pectoral mayor y el pectoral menor, llamados también nodos de Rotter.', W("Rotter's_lymph_nodes", "Rotter's lymph nodes are small interpectoral lymph nodes located between the pectoralis major and pectoralis minor muscles"), TA(5242)],
      ['Llevan el nombre del cirujano alemán Josef Rotter, que los describió a finales del siglo XIX.', W("Rotter's_lymph_nodes", 'named after German surgeon Josef Rotter (1857-1924), who described them in the late 19th century')],
    ],
    localizacion: [
      ['Están entre los músculos pectoral mayor y pectoral menor.', W("Rotter's_lymph_nodes", 'located between the pectoralis major and pectoralis minor muscles')],
    ],
    reparo: [
      ['El plano entre el pectoral mayor, por delante, y el pectoral menor, por detrás.', W("Rotter's_lymph_nodes", 'located between the pectoralis major and pectoralis minor muscles')],
    ],
    recibe: [
      ['Reciben linfa de los músculos y de la glándula mamaria.', W("Rotter's_lymph_nodes", 'They receive lymphatic fluid from the muscles and the mammary gland')],
    ],
    drena: [
      ['Su linfa pasa al plexo linfático axilar.', W("Rotter's_lymph_nodes", 'deliver lymphatic fluid to the axillary lymphatic plexus')],
    ],
    modelo: [REPRESENTATIVO],
    notas: [
      ['El cáncer de mama a veces se extiende a estos nodos.', W("Rotter's_lymph_nodes", 'as the cancer sometimes spreads (metastasizes) to the interpectoral lymph nodes')],
    ],
  },

  Infraclavicular_nodes: {
    tipo: 'nodo', ta2: 5243,
    descripcion: [
      ['Uno o dos nodos (ganglios) junto a la vena cefálica, llamados también deltopectorales.', W('Deltopectoral_lymph_nodes', 'One or two deltopectoral lymph nodes (or infraclavicular nodes) are found beside the cephalic vein'), TA(5243)],
      ['No son nodos axilares en sentido estricto, porque están fuera de la axila.', W('Axillary_lymph_nodes', 'These nodes are not strictly axillary nodes because they are located outside the axilla.')],
    ],
    localizacion: [
      ['Están en el surco entre el deltoides y el pectoral mayor, justo por debajo de la clavícula.', W('Deltopectoral_lymph_nodes', 'between the pectoralis major and deltoideus, immediately below the clavicle'), W('Axillary_lymph_nodes', 'They lie in the groove between the deltoid and pectoralis major muscles')],
    ],
    reparo: [
      ['La vena cefálica, que cerca del hombro pasa por el surco deltopectoral.', W('Deltopectoral_lymph_nodes', 'are found beside the cephalic vein'), W('Cephalic_vein', 'Near the shoulder, the cephalic vein passes between the deltoid and pectoralis major muscles (deltopectoral groove)')],
    ],
    recibe: [
      ['Reciben los vasos linfáticos superficiales del lado lateral de la mano, el antebrazo y el brazo.', W('Axillary_lymph_nodes', 'receive superficial lymph vessels from the lateral side of the hand, forearm, and arm')],
      ['Están intercalados en el trayecto de los colectores externos del brazo.', W('Deltopectoral_lymph_nodes', 'They are situated in the course of the external collecting trunks of the arm.')],
    ],
    drena: [
      ['Los colectores que acompañan a la vena cefálica, en cuyo trayecto están estos nodos, llegan directamente a los nodos axilares apicales.', W('Deltopectoral_lymph_nodes', 'They are situated in the course of the external collecting trunks of the arm.'), W('Apical_lymph_nodes', 'Its only direct territorial afferents are those that accompany the cephalic vein')],
    ],
    modelo: [REPRESENTATIVO, sinonimo('nodi deltopectorales')],
    vias: { recibe: ['Superficial_lymphatic_vessels_of_upper_limb'], drena: ['Apical_axillary_nodes'] },
  },

  // ── Brazo y codo ──
  Brachial_nodes: {
    tipo: 'nodo', ta2: 5244,
    descripcion: [
      ['Término de la TA2 para un grupo de nodos (ganglios) del miembro superior distinto de los nodos axilares laterales o humerales.', TA(5244), TA(5239)],
      ['Cuidado con el nombre: la Wikipedia inglesa, con texto del Gray de 1918, llama «brachial lymph nodes» al grupo axilar lateral, no a este.', W('Brachial_lymph_nodes', 'A brachial lymph nodes (or lateral group)'), W('Brachial_lymph_nodes', 'incorporates text in the public domain from the 20th edition of Gray')],
    ],
    modelo: [REPRESENTATIVO],
    pendientes: {
      localizacion: 'Ninguna fuente libre consultada (Wikipedia en inglés y en español) describe dónde están los nodos braquiales de la TA2; la página «Brachial lymph nodes» describe el grupo axilar lateral.',
      reparo: 'Sin fuente libre que dé un reparo para los nodos braquiales de la TA2.',
      recibe: 'Sin fuente libre sobre las aferencias de los nodos braquiales de la TA2.',
      drena: 'Sin fuente libre sobre las eferencias de los nodos braquiales de la TA2.',
    },
  },

  Cubital_nodes: {
    tipo: 'nodo', ta2: 5245,
    descripcion: [
      ['Nodos (ganglios) del codo, llamados también epitrocleares; «cubital» viene de «cubitus», el codo en latín.', W('Elbow', 'The name for the elbow in Latin is cubitus, and so the word cubital is used in some elbow-related terms, as in cubital nodes for example'), W('Elbow', 'the deep and superficial cubital nodes (also called epitrochlear nodes)'), TA(5245)],
      ['Hay dos grupos, uno profundo y otro superficial.', W('Elbow', 'There are two sets of lymphatic nodes at the elbow'), W('Elbow', 'the deep and superficial cubital nodes')],
      ['La TA los separa de los nodos supratrocleares, aunque la región es parecida.', W('Supratrochlear_lymph_nodes', 'They are distinguished in Terminologia anatomica from the "epitrochlear" (or "cubital") lymph nodes'), W('Supratrochlear_lymph_nodes', 'but the region is similar'), TA(5246)],
    ],
    localizacion: [
      ['Suelen estar por encima del epicóndilo medial.', W('Elbow', 'normally located above the medial epicondyle')],
      ['Los profundos están en la bifurcación de la arteria braquial.', W('Elbow', 'through the deep nodes at the bifurcation of the brachial artery')],
    ],
    reparo: [
      ['La bifurcación de la arteria braquial en el codo, para el grupo profundo.', W('Elbow', 'through the deep nodes at the bifurcation of the brachial artery')],
    ],
    recibe: [
      ['Los superficiales drenan el antebrazo y el lado cubital de la mano.', W('Elbow', 'the superficial nodes drain the forearm and the ulnar side of the hand')],
      ['El drenaje linfático del codo pasa por los nodos profundos.', W('Elbow', 'The lymphatic drainage at the elbow is through the deep nodes at the bifurcation of the brachial artery')],
    ],
    drena: [
      ['Los vasos eferentes del codo van al grupo lateral de los nodos axilares.', W('Elbow', 'The efferent lymph vessels from the elbow proceed to the lateral group of axillary lymph nodes.')],
    ],
    modelo: [
      REPRESENTATIVO,
      ['En este modelo los cubitales superficiales y profundos forman una sola pieza.', MODELO],
    ],
    vias: { recibe: ['Superficial_lymphatic_vessels_of_upper_limb', 'Deep_lymphatic_vessels_of_upper_limb'], drena: ['Lateral_axillary_nodes'] },
  },

  Supratrochlear_nodes: {
    tipo: 'nodo', ta2: 5246,
    descripcion: [
      ['Uno o dos nodos (ganglios) superficiales del brazo, por encima del epicóndilo medial del húmero.', W('Supratrochlear_lymph_nodes', 'One or two supratrochlear lymph nodes are placed above the medial epicondyle of the humerus'), W('List_of_lymph_nodes_of_the_human_body', 'Superficial lymph nodes of the arm'), TA(5246)],
      ['La TA los distingue de los nodos cubitales o epitrocleares, aunque la región es parecida.', W('Supratrochlear_lymph_nodes', 'They are distinguished in Terminologia anatomica from the "epitrochlear" (or "cubital") lymph nodes'), W('Supratrochlear_lymph_nodes', 'but the region is similar'), TA(5245)],
    ],
    localizacion: [
      ['Están por encima del epicóndilo medial del húmero, por dentro de la vena basílica.', W('Supratrochlear_lymph_nodes', 'are placed above the medial epicondyle of the humerus, medial to the basilic vein')],
    ],
    reparo: [
      ['La vena basílica: los nodos quedan por dentro de ella, sobre el epicóndilo medial.', W('Supratrochlear_lymph_nodes', 'are placed above the medial epicondyle of the humerus, medial to the basilic vein')],
    ],
    recibe: [
      ['Sus aferentes drenan los dedos medio, anular y meñique, la parte medial de la mano y la zona superficial del lado cubital del antebrazo.', W('Supratrochlear_lymph_nodes', 'Their afferents drain the middle, ring, and little fingers, the medial portion of the hand, and the superficial area over the ulnar side of the forearm')],
      ['Esos vasos se comunican libremente con los demás vasos linfáticos del antebrazo.', W('Supratrochlear_lymph_nodes', 'these vessels are, however, in free communication with the other lymphatic vessels of the forearm')],
      ['Su territorio corresponde a los dermatomas C7 y C8.', W('List_of_lymph_nodes_of_the_human_body', 'they drain the C7 and C8 dermatomes')],
    ],
    drena: [
      ['Sus eferentes acompañan a la vena basílica y se unen a los vasos profundos.', W('Supratrochlear_lymph_nodes', 'Their efferents accompany the basilic vein and join the deeper vessels.')],
    ],
    modelo: [
      REPRESENTATIVO,
      ['En este modelo los nodos se recolocaron por encima del epicóndilo medial, a pocos milímetros de la vena basílica; es una colocación esquemática.', MODELO],
    ],
    notas: [
      ['Se hinchan cuando hay una infección y entonces pueden palparse.', W('Supratrochlear_lymph_nodes', 'The supratrochlear lymph nodes swell up when an infection is detected in the body.'), W('Supratrochlear_lymph_nodes', 'They may be palpable.')],
    ],
    vias: { recibe: ['Superficial_lymphatic_vessels_of_upper_limb'], drena: ['Deep_lymphatic_vessels_of_upper_limb'] },
  },
};
