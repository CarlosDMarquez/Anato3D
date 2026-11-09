// Lección «La axila». Formato y evidencias: ../formato.js.
import { leccion, W, T, GUIA, MODELO } from '../formato.js';

const AXI = 'upper-limb/areas/axilla';
const GAN = 'Axillary_lymph_nodes';
const nucleo = (nombre, piezas, tipo, extra = {}) => ({ nombre, piezas, lado: 'bilateral', papel: 'nucleo', tipo, ...extra });
const contexto = (nombre, piezas, tipo) => ({ nombre, piezas, lado: 'bilateral', papel: 'contexto', tipo });

const VASOS_NERVIOS = ['arteria-axilar', 'vena-axilar', 'plexo'];
const GANGLIOS = ['ganglios-anteriores', 'ganglios-posteriores', 'ganglios-laterales', 'ganglios-centrales', 'ganglios-apicales'];
const PAREDES = ['pectoral-mayor', 'pectoral-menor', 'subclavio', 'subescapular', 'redondo-mayor', 'coracobraquial', 'biceps-corta'];
const OSEO = ['huesos', 'costillas'];

export default leccion({
  id: 'ms-axila',
  version: 1,
  titulo: 'La axila',
  resumen: 'La pirámide que une el brazo con el tórax: su vértice y sus cuatro paredes musculares, lo que pasa por ella (arteria y vena axilares y plexo braquial), sus tres salidas, los cinco grupos de ganglios linfáticos con el recorrido de la linfa de la mama, y dos problemas clínicos: el desfiladero torácico y el vaciamiento axilar.',
  lugares: [['miembro-superior', 'axila']],
  sistemas: ['cardiovascular', 'nervioso', 'linfatico'],
  formato: 'topografia',
  temas: ['arterias-venas', 'nervios'],
  nivel: 2,
  minutos: 20,
  requisitos: ['ms-nervios', 'ms-vasos'],
  siguiente: ['ms-hombro-musculos', 'brazo', 'sis-linfatico'],
  objetivos: [
    'Describir la forma de la axila, su vértice y sus cuatro paredes con los músculos que las forman.',
    'Enumerar el contenido de la axila: arteria y vena axilares, plexo braquial y ganglios linfáticos.',
    'Seguir las tres salidas de la axila y decir qué pasa por cada una.',
    'Ordenar los grupos de ganglios axilares según el recorrido de la linfa y relacionarlos con la mama.',
    'Explicar por qué pueden comprimirse los vasos y nervios en el vértice y qué nervio puede lesionarse al vaciar la axila.',
  ],
  estructuras: {
    'pectoral-mayor': nucleo('Pectoral mayor', ['Clavicular_head_of_pectoralis_major_muscle', 'Sternocostal_head_of_pectoralis_major_muscle'], 'musculo'),
    'pectoral-menor': nucleo('Pectoral menor', ['Pectoralis_minor_muscle'], 'musculo'),
    subclavio: nucleo('Subclavio', ['Subclavius_muscle'], 'musculo'),
    subescapular: nucleo('Subescapular', ['Subscapularis_muscle'], 'musculo'),
    'redondo-mayor': nucleo('Redondo mayor', ['Teres_major_muscle'], 'musculo'),
    coracobraquial: nucleo('Coracobraquial', ['Coracobrachialis_muscle'], 'musculo'),
    'biceps-corta': nucleo('Cabeza corta del bíceps', ['Short_head_of_biceps_brachii'], 'musculo'),
    'serrato-anterior': nucleo('Serrato anterior', ['Serratus_anterior_muscle'], 'musculo'),
    'arteria-axilar': nucleo('Arteria axilar', ['Axillary_artery'], 'arteria', { confusiones: ['Arteria subclavia', 'Arteria braquial'] }),
    'vena-axilar': nucleo('Vena axilar', ['Axillary_vein'], 'vena'),
    plexo: nucleo('Plexo braquial', ['Superior_trunk_of_brachial_plexus', 'Middle_trunk_of_brachial_plexus', 'Inferior_trunk_of_brachial_plexus', 'Anterior_division_of_superior_trunk_of_brachial_plexus', 'Anterior_division_of_middle_trunk_of_brachial_plexus', 'Anterior_division_of_inferior_trunk_of_brachial_plexus', 'Posterior_division_of_superior_trunk_of_brachial_plexus', 'Posterior_division_of_middle_trunk_of_brachial_plexus', 'Posterior_division_of_inferior_trunk_of_brachial_plexus', 'Posterior_cord_of_brachial_plexus'], 'nervio'),
    'nervio-axilar': nucleo('Nervio axilar', ['Axillary_nerve'], 'nervio'),
    'toracico-largo': nucleo('Nervio torácico largo', ['Long_thoracic_nerve'], 'nervio'),
    'circunfleja-posterior': nucleo('Arteria circunfleja humeral posterior', ['Posterior_circumflex_humeral_artery'], 'arteria'),
    'vena-cefalica': nucleo('Vena cefálica', ['Cephalic_vein'], 'vena'),
    'ganglios-anteriores': nucleo('Ganglios axilares anteriores (pectorales)', ['Anterior_axillary_nodes'], 'nodo'),
    'ganglios-posteriores': nucleo('Ganglios axilares posteriores (subescapulares)', ['Posterior_axillary_nodes'], 'nodo'),
    'ganglios-laterales': nucleo('Ganglios axilares laterales', ['Lateral_axillary_nodes'], 'nodo'),
    'ganglios-centrales': nucleo('Ganglios axilares centrales', ['Central_axillary_nodes'], 'nodo'),
    'ganglios-apicales': nucleo('Ganglios axilares apicales', ['Apical_axillary_nodes'], 'nodo'),
    'dorsal-ancho': contexto('Dorsal ancho', ['Latissimus_dorsi_muscle'], 'musculo'),
    huesos: contexto('Clavícula, escápula y húmero', ['Clavicle', 'Scapula', 'Humerus'], 'hueso'),
    costillas: contexto('Costillas 1.ª a 5.ª', ['Rib_1', 'Rib_2', 'Rib_3', 'Rib_4', 'Rib_5'], 'hueso'),
  },
  pasos: [
    {
      id: 'orientacion', tipo: 'orientacion', titulo: 'Una pirámide entre el brazo y el tórax',
      texto: [
        ['La axila es una región en forma de pirámide, bajo el hombro, entre el brazo y la pared del tórax: el paso por el que entran y salen del miembro superior vasos, nervios y músculos.', T(AXI, 'The axilla is a pyramidal region located inferior to the glenohumeral joint and shoulder girdle, at the junction of the upper limb and thoracic wall.'), T(AXI, 'It acts as a passageway by which neurovascular and muscular structures enter and leave the upper limb.')],
        ['Tiene un vértice, una base y cuatro paredes, y su forma cambia con la posición del brazo.', T(AXI, 'It consists of four walls, an apex, and a base:'), T(AXI, 'The size and shape of the axilla varies with arm position.')],
        ['El vértice, la entrada, lo limitan la clavícula delante, la primera costilla por dentro y el borde superior de la escápula detrás.', T(AXI, 'Apex (axillary inlet) – it is bounded by the clavicle anteriorly, the first rib medially, and the superior border of the scapula posteriorly.')],
        ['Mira la axila derecha de frente, con los pectorales translúcidos, y desde abajo.', GUIA],
      ],
      vista: { ver: VASOS_NERVIOS, contexto: OSEO, fantasma: ['pectoral-mayor', 'pectoral-menor'], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'Recorre la axila.', vistas: [{ nombre: 'De frente', camara: 'anterior' }, { nombre: 'Desde abajo', camara: 'inferior' }, { nombre: 'Tres cuartos', camara: 'anterolateral' }] },
      comprobar: 'rel-vertice',
    },
    {
      id: 'paredes', tipo: 'explicacion', titulo: 'Las cuatro paredes',
      texto: [
        ['La pared anterior es el pectoral mayor y, debajo, el pectoral menor y el subclavio.', T(AXI, 'Anterior wall – contains the pectoralis major and the underlying pectoralis minor and the subclavius muscles.')],
        ['La posterior la forman el subescapular, el redondo mayor y el dorsal ancho.', T(AXI, 'Posterior wall – formed by the subscapularis, teres major and latissimus dorsi.')],
        ['La medial es el serrato anterior sobre la pared del tórax, y la lateral, el surco intertubercular del húmero, el coracobraquial y la cabeza corta del bíceps.', T(AXI, 'Medial wall – consists of the serratus anterior and the thoracic wall (ribs and intercostal muscles).'), T(AXI, 'Lateral wall – formed by the intertubercular groove of the humerus, coracobrachialis muscle and short head of biceps brachii.')],
      ],
      vista: { ver: PAREDES, contexto: ['serrato-anterior', 'dorsal-ancho', ...OSEO], camara: 'anterolateral', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['pectoral-menor', 'subescapular', 'serrato-anterior', 'coracobraquial'], texto: 'Alterna un músculo de cada pared: anterior, posterior, medial y lateral.' },
      comprobar: 'comp-paredes',
    },
    {
      id: 'contenido', tipo: 'relaciones', titulo: 'Lo que pasa por la axila',
      texto: [
        ['La arteria axilar, la principal del miembro superior, se divide en tres partes según el pectoral menor: medial, posterior y lateral a él.', T(AXI, 'Axillary artery – the main artery supplying the upper limb. It is commonly referred as having three parts; one medial to the pectoralis minor, one posterior to pectoralis minor, and one lateral to pectoralis minor.')],
        ['La vena axilar, que forman las venas braquiales y la basílica, recibe la cefálica.', T(AXI, 'Axillary vein – the main vein draining the upper limb. It is formed by the brachial veins and basilic vein, and receives the cephalic vein as a major tributary.')],
        ['También pasan el plexo braquial (C5 a T1), del que salen los nervios del miembro superior, y los ganglios linfáticos axilares, que filtran la linfa del miembro superior, la mama y la región pectoral.', T(AXI, 'Brachial plexus – a network of spinal nerves (C5–T1) that gives rise to the peripheral nerves supplying the upper limb.'), T(AXI, 'Axillary lymph nodes – a group of lymph nodes that filter lymph drained from the upper limb, breast, and pectoral region.')],
      ],
      detalle: [
        ['El modelo no tiene los fascículos lateral y medial del plexo braquial; sí los troncos, sus divisiones y el fascículo posterior.', MODELO],
      ],
      vista: { ver: VASOS_NERVIOS, contexto: ['vena-cefalica', ...OSEO], fantasma: ['pectoral-menor'], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: VASOS_NERVIOS, texto: 'Alterna la arteria, la vena y el plexo; fíjate en dónde cruzan el pectoral menor.' },
      comprobar: 'rel-partes-axilar',
    },
    {
      id: 'salidas', tipo: 'relaciones', titulo: 'Tres salidas',
      texto: [
        ['La mayor parte de lo que contiene sale hacia abajo y afuera, al brazo.', T(AXI, 'The main route of exit is immediately inferiorly and laterally, into the upper limb. The majority of contents of the axilla region leave by this method.')],
        ['Por el espacio cuadrangular, un hueco de la pared posterior, pasan el nervio axilar y la arteria circunfleja humeral posterior hacia la parte de atrás del brazo y el hombro.', T(AXI, 'Another pathway is via the quadrangular space. This is a gap in the posterior wall of the axilla, allowing access to the posterior arm and shoulder area. Structures passing through include the axillary nerve and posterior circumflex humeral artery')],
        ['Por el triángulo clavipectoral, una abertura de la pared anterior entre el pectoral mayor, el deltoides y la clavícula, entra la vena cefálica.', T(AXI, 'The last passageway is the clavipectoral triangle, which is an opening in the anterior wall of the axilla. It is bounded by the pectoralis major, deltoid, and clavicle. The cephalic vein enters the axilla via this triangle.')],
      ],
      vista: { ver: ['nervio-axilar', 'circunfleja-posterior', 'vena-cefalica'], contexto: ['subescapular', 'redondo-mayor', 'arteria-axilar', 'vena-axilar', 'huesos'], camara: 'posterolateral', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'Busca por detrás el espacio cuadrangular y por delante la vena cefálica.', vistas: [{ nombre: 'Por detrás', camara: 'posterolateral' }, { nombre: 'De frente', camara: 'anterolateral' }] },
      comprobar: 'rel-cuadrangular',
    },
    {
      id: 'ganglios', tipo: 'exploracion', titulo: 'Los ganglios axilares',
      texto: [
        ['Hay entre 20 y 49 ganglios axilares; recogen la linfa de los cuadrantes laterales de la mama, de la pared del tórax y del abdomen por encima del ombligo, y del miembro superior.', W(GAN, 'Between 20 and 49 in number, they drain lymph vessels from the lateral quadrants of the breast, the superficial lymph vessels from thin walls of the chest and the abdomen above the level of the navel, and the vessels from the upper limb.')],
        ['Los anteriores (pectorales), bajo el borde del pectoral menor, reciben la mama; los posteriores (subescapulares), la espalda, y los laterales, junto a la vena axilar, casi todo el miembro superior.', W(GAN, 'Anterior (pectoral) group: Lying along the lower border of the pectoralis minor behind the pectoralis major, these nodes receive lymph vessels from the lateral quadrants of the breast'), W(GAN, 'Posterior (subscapular) group: Lying in front of the subscapularis muscle, these nodes receive superficial lymph vessels from the back'), W(GAN, 'Lateral group: Lying along the medial side of the axillary vein, these nodes receive most of the lymph vessels of the upper limb')],
        ['Los tres vierten en los centrales, en la grasa del centro de la axila, y todos acaban en los apicales, en el vértice, que drenan al tronco linfático subclavio.', W(GAN, 'Central group: Lying in the center of the axilla in the axillary fat, these nodes receive lymph from the above three groups.'), W(GAN, 'Apical group: Lying at the apex of the axilla at the lateral border of the 1st rib, these nodes receive the efferent lymph vessels from all the other axillary nodes.'), W(GAN, 'The apical nodes drain into the subclavian lymph trunk.')],
      ],
      detalle: [
        ['El tronco subclavio desemboca, a la izquierda, en el conducto torácico y, a la derecha, en el conducto linfático derecho, o directamente en una de las grandes venas de la base del cuello.', W(GAN, 'On the left side, this trunk drains into the thoracic duct; on the right side, it drains into the right lymphatic duct.'), W(GAN, 'Alternatively, the lymph trunks may drain directly into one of the large veins at the root of the neck.')],
      ],
      vista: { ver: GANGLIOS, contexto: ['vena-axilar', 'pectoral-menor', 'subescapular', ...OSEO], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: GANGLIOS, texto: 'Alterna los cinco grupos y sigue la linfa hasta el vértice.' },
      comprobar: 'rel-apicales',
    },
    {
      id: 'clinica', tipo: 'relaciones', titulo: 'El vértice y el vaciamiento axilar',
      texto: [
        ['En el vértice, entre la clavícula, la primera costilla y la escápula, los vasos y nervios pueden quedar comprimidos: es el síndrome del desfiladero torácico.', T(AXI, 'The apex of the axilla region is an opening between the clavicle, first rib and the scapula. In this apex, the vessels and nerves may become compressed between the bones – this is called thoracic outlet syndrome.')],
        ['Puede deberse a un traumatismo, a levantar mucho los brazos en el trabajo o a una costilla cervical de más, y da dolor, hormigueo, debilidad y cambios de color en el miembro.', T(AXI, 'Trauma – e.g. fractured clavicle.'), T(AXI, 'Repetitive movements – seen commonly in occupations that require lifting of the arms.'), T(AXI, 'Cervical rib – an extra rib which arises from the seventh cervical vertebra.'), T(AXI, 'tingling, muscle weakness and discolouration.')],
        ['Cerca del 75 % de la linfa de la mama va a los ganglios axilares; si hay cáncer de mama puede hacer falta quitarlos (vaciamiento axilar), y en esa cirugía puede lesionarse el nervio torácico largo, que inerva el serrato anterior, y quedar la escápula alada.', T(AXI, 'Approximately 75% of lymph from the breast drains into the axilla lymph nodes'), T(AXI, 'If breast cancer is confirmed, the axillary nodes may need to be removed to prevent the cancer spreading. This is known as axillary clearance. During this procedure, the long thoracic nerve may become damaged, resulting in winged scapula.'), W('Long_thoracic_nerve', 'The long thoracic nerve innervates the serratus anterior muscle.')],
      ],
      detalle: [
        ['El nervio torácico largo baja apoyado en la cara externa del serrato anterior, a lo largo del costado del tórax.', W('Long_thoracic_nerve', 'It rests on the outer surface of the serratus anterior muscle.'), W('Long_thoracic_nerve', 'It extends along the side of the thorax to the lower border of the serratus anterior muscle')],
        ['Tras vaciar la axila, el riesgo de linfedema ronda el 10 al 15 %.', W(GAN, 'The approximate risk of lymphedema following axillary lymph node dissection is 10-15%')],
      ],
      vista: { ver: ['toracico-largo'], contexto: ['serrato-anterior', ...OSEO], camara: 'lateral', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'toracico-largo', texto: 'Toca el nervio que baja sobre el serrato anterior.' },
      comprobar: 'rel-escapula-alada',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['Pirámide con el vértice entre la clavícula, la primera costilla y la escápula; paredes: pectorales delante, subescapular, redondo mayor y dorsal ancho detrás, serrato por dentro y húmero con coracobraquial y bíceps por fuera.', T(AXI, 'it is bounded by the clavicle anteriorly, the first rib medially, and the superior border of the scapula posteriorly.'), T(AXI, 'Posterior wall – formed by the subscapularis, teres major and latissimus dorsi.')],
        ['Contenido: arteria axilar (tres partes alrededor del pectoral menor), vena axilar, plexo braquial y ganglios; salidas: al brazo, por el espacio cuadrangular y por el triángulo clavipectoral.', T(AXI, 'It is commonly referred as having three parts'), T(AXI, 'Another pathway is via the quadrangular space.'), T(AXI, 'The last passageway is the clavipectoral triangle')],
        ['La linfa va de los ganglios anteriores, posteriores y laterales a los centrales y de ahí a los apicales; tres cuartas partes de la linfa de la mama pasan por ellos.', W(GAN, 'these nodes receive lymph from the above three groups.'), W(GAN, 'these nodes receive the efferent lymph vessels from all the other axillary nodes.'), T(AXI, 'Approximately 75% of lymph from the breast drains into the axilla lymph nodes')],
      ],
    },
  ],
  preguntas: [
    {
      id: 'rel-vertice', tipo: 'relacion', objetivo: 0, paso: 'orientacion', estructuras: ['huesos', 'costillas'],
      enunciado: '¿Qué limita el vértice de la axila?',
      correcta: 'La clavícula, la primera costilla y el borde superior de la escápula',
      distractores: ['El pectoral mayor, el deltoides y la clavícula', 'El húmero, el redondo mayor y el tríceps', 'El esternón, la clavícula y la primera costilla'],
      explicacion: 'Es la entrada de la axila desde el cuello; el pectoral mayor, el deltoides y la clavícula limitan el triángulo clavipectoral.',
      evidencia: [T(AXI, 'Apex (axillary inlet) – it is bounded by the clavicle anteriorly, the first rib medially, and the superior border of the scapula posteriorly.')],
    },
    {
      id: 'comp-paredes', tipo: 'comparacion', objetivo: 0, paso: 'paredes', estructuras: ['subescapular', 'redondo-mayor', 'dorsal-ancho'],
      enunciado: '¿Qué músculos forman la pared posterior de la axila?',
      correcta: 'El subescapular, el redondo mayor y el dorsal ancho',
      distractores: ['El pectoral mayor, el pectoral menor y el subclavio', 'El serrato anterior y los intercostales', 'El coracobraquial y la cabeza corta del bíceps'],
      explicacion: 'Las otras opciones son la pared anterior, la medial y la lateral.',
      evidencia: [T(AXI, 'Posterior wall – formed by the subscapularis, teres major and latissimus dorsi.')],
    },
    { id: 'id-pectoral-menor', tipo: 'identificar', estructura: 'pectoral-menor', objetivo: 0, paso: 'paredes' },
    { id: 'loc-subescapular', tipo: 'localizar', estructura: 'subescapular', candidatas: ['pectoral-menor', 'coracobraquial'], objetivo: 0, paso: 'paredes' },
    {
      id: 'rel-partes-axilar', tipo: 'relacion', objetivo: 1, paso: 'contenido', estructuras: ['arteria-axilar', 'pectoral-menor'],
      enunciado: '¿Qué músculo sirve para dividir la arteria axilar en tres partes?',
      correcta: 'El pectoral menor',
      distractores: ['El pectoral mayor', 'El subclavio', 'El redondo mayor'],
      explicacion: 'Una parte queda medial al pectoral menor, otra detrás y otra lateral a él.',
      evidencia: [T(AXI, 'It is commonly referred as having three parts; one medial to the pectoralis minor, one posterior to pectoralis minor, and one lateral to pectoralis minor.')],
    },
    {
      id: 'rel-vena-axilar', tipo: 'relacion', objetivo: 1, paso: 'contenido', estructuras: ['vena-axilar', 'vena-cefalica'],
      enunciado: '¿Qué venas forman la vena axilar?',
      correcta: 'Las braquiales y la basílica',
      distractores: ['La cefálica y la basílica', 'Las yugulares interna y externa', 'La subclavia y la braquiocefálica'],
      explicacion: 'Las braquiales y la basílica la forman; la cefálica llega después como afluente.',
      evidencia: [T(AXI, 'It is formed by the brachial veins and basilic vein, and receives the cephalic vein as a major tributary.')],
    },
    { id: 'id-arteria-axilar', tipo: 'identificar', estructura: 'arteria-axilar', objetivo: 1, paso: 'contenido' },
    {
      id: 'rel-cuadrangular', tipo: 'relacion', objetivo: 2, paso: 'salidas', estructuras: ['nervio-axilar', 'circunfleja-posterior'],
      enunciado: '¿Qué pasa por el espacio cuadrangular?',
      correcta: 'El nervio axilar y la arteria circunfleja humeral posterior',
      distractores: ['La vena cefálica', 'El nervio torácico largo', 'La arteria y la vena axilares'],
      explicacion: 'Es un hueco de la pared posterior hacia la parte de atrás del hombro; la cefálica entra por el triángulo clavipectoral.',
      evidencia: [T(AXI, 'Structures passing through include the axillary nerve and posterior circumflex humeral artery')],
    },
    {
      id: 'rel-clavipectoral', tipo: 'relacion', objetivo: 2, paso: 'salidas', estructuras: ['vena-cefalica'],
      enunciado: '¿Qué entra en la axila por el triángulo clavipectoral?',
      correcta: 'La vena cefálica',
      distractores: ['El nervio axilar', 'La arteria circunfleja humeral posterior', 'El nervio torácico largo'],
      explicacion: 'El triángulo está en la pared anterior, entre el pectoral mayor, el deltoides y la clavícula.',
      evidencia: [T(AXI, 'The cephalic vein enters the axilla via this triangle.')],
    },
    {
      id: 'sec-linfa', tipo: 'secuencia', objetivo: 3, paso: 'ganglios',
      enunciado: 'Ordena el recorrido de la linfa de la mama por los ganglios axilares.',
      orden: ['Ganglios anteriores (pectorales)', 'Ganglios centrales', 'Ganglios apicales', 'Tronco linfático subclavio'],
      explicacion: 'Los anteriores reciben la mama y vierten en los centrales; de ahí va a los apicales, en el vértice, y al tronco subclavio.',
      evidencia: [W(GAN, 'these nodes receive lymph vessels from the lateral quadrants of the breast'), W(GAN, 'Central group: Lying in the center of the axilla in the axillary fat, these nodes receive lymph from the above three groups.'), W(GAN, 'The apical nodes drain into the subclavian lymph trunk.')],
    },
    {
      id: 'rel-apicales', tipo: 'relacion', objetivo: 3, paso: 'ganglios', estructuras: ['ganglios-apicales'],
      enunciado: '¿Qué ganglios axilares reciben la linfa de todos los demás?',
      correcta: 'Los apicales, en el vértice de la axila',
      distractores: ['Los laterales, junto a la vena axilar', 'Los anteriores, bajo el pectoral menor', 'Los posteriores, delante del subescapular'],
      explicacion: 'Los apicales, junto al borde lateral de la primera costilla, son la última estación antes del tronco subclavio.',
      evidencia: [W(GAN, 'Apical group: Lying at the apex of the axilla at the lateral border of the 1st rib, these nodes receive the efferent lymph vessels from all the other axillary nodes.')],
    },
    {
      id: 'rel-mama', tipo: 'relacion', objetivo: 3, paso: 'ganglios', estructuras: ['ganglios-anteriores'],
      enunciado: '¿Qué parte de la linfa de la mama llega a los ganglios axilares?',
      correcta: 'Cerca del 75 %',
      distractores: ['Cerca del 10 %', 'Más o menos la mitad', 'Toda'],
      explicacion: 'Por eso estos ganglios son importantes para el diagnóstico y la estadificación del cáncer de mama.',
      evidencia: [W(GAN, 'About 75% of lymph from the breasts drains into the axillary lymph nodes, making them important in the diagnosis and staging of breast cancer.')],
    },
    { id: 'id-ganglios-apicales', tipo: 'identificar', estructura: 'ganglios-apicales', objetivo: 3, paso: 'ganglios' },
    {
      id: 'rel-desfiladero', tipo: 'relacion', objetivo: 4, paso: 'clinica', estructuras: ['plexo', 'arteria-axilar'],
      enunciado: '¿Qué es el síndrome del desfiladero torácico?',
      correcta: 'La compresión de vasos y nervios en el vértice de la axila, entre la clavícula, la primera costilla y la escápula',
      distractores: ['La obstrucción de los ganglios axilares', 'La lesión del nervio axilar en el espacio cuadrangular', 'La trombosis de la vena cefálica'],
      explicacion: 'Puede deberse a un traumatismo, a movimientos repetidos con los brazos en alto o a una costilla cervical.',
      evidencia: [T(AXI, 'In this apex, the vessels and nerves may become compressed between the bones – this is called thoracic outlet syndrome.')],
    },
    {
      id: 'rel-escapula-alada', tipo: 'relacion', objetivo: 4, paso: 'clinica', estructuras: ['toracico-largo', 'serrato-anterior'],
      enunciado: 'Al vaciar los ganglios axilares, ¿qué nervio puede lesionarse y dejar la escápula alada?',
      correcta: 'El torácico largo',
      distractores: ['El axilar', 'El musculocutáneo', 'El pectoral medial'],
      explicacion: 'El torácico largo inerva el serrato anterior; si falla, la escápula se despega del tórax.',
      evidencia: [T(AXI, 'During this procedure, the long thoracic nerve may become damaged, resulting in winged scapula.'), W('Long_thoracic_nerve', 'The long thoracic nerve innervates the serratus anterior muscle.')],
    },
  ],
});
