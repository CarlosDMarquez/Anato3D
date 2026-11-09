// Lección «Pulmones, bronquios y pleura». Formato y evidencias: ../formato.js.
import { leccion, W, T, GUIA } from '../formato.js';

const PUL = 'thorax/organs/lungs';
const PLE = 'thorax/organs/pleurae';
const TRB = 'thorax/organs/tracheobronchial-tree';
const org = (nombre, piezas, extra = {}) => ({ nombre, piezas, lado: 'impar', papel: 'nucleo', tipo: 'organo', ...extra });
const vaso = (nombre, piezas, tipo) => ({ nombre, piezas, lado: 'impar', papel: 'nucleo', tipo });
const contexto = (nombre, piezas, tipo, lado = 'impar') => ({ nombre, piezas, lado, papel: 'contexto', tipo });

const DERECHO = ['lobulo-sup-der', 'lobulo-med-der', 'lobulo-inf-der'];
const IZQUIERDO = ['lobulo-sup-izq', 'lobulo-inf-izq'];
const LOBULOS = [...DERECHO, ...IZQUIERDO];
const PRINCIPALES = ['bronquio-derecho', 'bronquio-izquierdo'];
const LOBARES = ['lobares-derechos', 'lobares-izquierdos'];
const HILIO = ['arteria-pulmonar-derecha', 'arteria-pulmonar-izquierda', 'venas-pulmonares'];

export default leccion({
  id: 'tor-pulmones',
  version: 1,
  titulo: 'Pulmones, bronquios y pleura',
  resumen: 'Los pulmones por dentro y por fuera: sus lóbulos y cisuras (tres a la derecha, dos a la izquierda), el árbol bronquial de la tráquea a los bronquios segmentarios, la raíz y el hilio por donde entran bronquios y vasos, y la pleura, cuya cavidad hace que el pulmón siga al tórax al respirar.',
  lugares: [['torax', 'pulmones-pleura']],
  sistemas: ['respiratorio'],
  formato: 'topografia',
  temas: ['organos'],
  nivel: 2,
  minutos: 18,
  requisitos: ['sis-respiratorio', 'tor-caja'],
  siguiente: ['tor-respiracion', 'tor-mediastino', 'tor-corazon'],
  objetivos: [
    'Localizar los lóbulos de cada pulmón y las cisuras que los separan.',
    'Seguir el árbol bronquial desde la tráquea hasta los bronquios segmentarios.',
    'Explicar por qué los cuerpos extraños suelen ir al bronquio principal derecho.',
    'Enumerar lo que entra y sale por la raíz del pulmón.',
    'Describir la pleura y explicar qué pasa en un neumotórax.',
  ],
  estructuras: {
    'lobulo-sup-der': org('Lóbulo superior del pulmón derecho', ['Superior_lobe_of_right_lung']),
    'lobulo-med-der': org('Lóbulo medio del pulmón derecho', ['Middle_lobe_of_right_lung']),
    'lobulo-inf-der': org('Lóbulo inferior del pulmón derecho', ['Inferior_lobe_of_right_lung']),
    'lobulo-sup-izq': org('Lóbulo superior del pulmón izquierdo', ['Superior_lobe_of_left_lung']),
    'lobulo-inf-izq': org('Lóbulo inferior del pulmón izquierdo', ['Inferior_lobe_of_left_lung']),
    'bronquio-derecho': org('Bronquio principal derecho', ['Right_main_bronchus']),
    'bronquio-izquierdo': org('Bronquio principal izquierdo', ['Left_main_bronchus']),
    'lobares-derechos': org('Bronquios lobares derechos', ['Right_superior_lobar_bronchus', 'Middle_lobar_bronchus_R', 'Right_inferior_lobar_bronchus']),
    'lobares-izquierdos': org('Bronquios lobares izquierdos', ['Left_superior_lobar_bronchus', 'Left_inferior_lobar_bronchus']),
    'arteria-pulmonar-derecha': vaso('Arteria pulmonar derecha', ['Right_pulmonary_artery'], 'arteria'),
    'arteria-pulmonar-izquierda': vaso('Arteria pulmonar izquierda', ['Left_pulmonary_artery'], 'arteria'),
    'venas-pulmonares': vaso('Venas pulmonares', ['Right_superior_pulmonary_vein', 'Right_inferior_pulmonary_vein', 'Left_superior_pulmonary_vein', 'Left_inferior_pulmonary_vein'], 'vena'),
    pleura: org('Pleura', ['Pleura']),
    traquea: contexto('Tráquea', ['Trachea'], 'organo'),
    segmentarios: contexto('Bronquios segmentarios', [
      'Apical_segmental_bronchus_of_right_lung_BI', 'Posterior_segmental_bronchus_of_right_lung_BII', 'Anterior_segmental_bronchus_of_right_lung_BIII',
      'Lateral_segmental_bronchus_of_right_lung_BIV', 'Medial_segmental_bronchus_of_right_lung_BV', 'Anterior_basal_segmental_bronchus_of_right_lung_BVIII',
      'Lateral_basal_segmental_bronchus_of_right_lung_BIX', 'Posterior_basal_segmental_bronchus_of_right_lung_BX', 'Medial_basal_segmental_bronchus_of_right_lung_BVII',
      'Apicoposterior_segmental_bronchus_of_left_lung_BI_BII', 'Anterior_segmental_bronchus_of_left_lung_BIII', 'Superior_lingular_segmental_bronchus_of_left_lung_BIV',
      'Inferior_lingular_segmental_bronchus_of_left_lung_BV', 'Anterior_basal_segmental_bronchus_of_left_lung_BVIII', 'Lateral_basal_segmental_bronchus_of_left_lung_BIX',
      'Posterior_basal_segmental_bronchus_of_left_lung_BX', 'Medial_basal_segmental_bronchus_of_left_lung_BVII',
    ], 'organo'),
    'tronco-pulmonar': contexto('Tronco pulmonar', ['Pulmonary_trunk'], 'arteria'),
    'atrio-izquierdo': contexto('Atrio izquierdo', ['Left_atrium'], 'corazon'),
    'ventriculo-izquierdo': contexto('Ventrículo izquierdo', ['Left_ventricle'], 'corazon'),
    diafragma: contexto('Diafragma', ['Diaphragm'], 'musculo'),
    'costilla-1': contexto('Primera costilla', ['Rib_1'], 'hueso', 'ambos'),
    'costilla-4': contexto('Cuarta costilla', ['Rib_4'], 'hueso', 'ambos'),
    esternon: contexto('Esternón', ['Sternum_Manubrium', 'Sternum_Body'], 'hueso'),
  },
  pasos: [
    {
      id: 'orientacion', tipo: 'orientacion', titulo: 'Los pulmones',
      texto: [
        ['Los pulmones son los órganos de la respiración, a cada lado del mediastino; oxigenan la sangre poniendo el aire en contacto con la de los capilares pulmonares.', T(PUL, 'The lungs are the organs of respiration. They are located in the thorax, either side of the mediastinum.'), T(PUL, 'The function of the lungs is to oxygenate blood.')],
        ['Cada pulmón está rodeado por su cavidad pleural y cuelga del mediastino por la raíz del pulmón.', T(PUL, 'Each lung is surrounded by a pleural cavity, which is formed by the visceral and parietal pleura.'), T(PUL, 'They are suspended from the mediastinum by the lung root')],
        ['Míralos de frente y de lado.', GUIA],
      ],
      vista: { ver: LOBULOS, contexto: ['traquea', 'costilla-1', 'esternon'], camara: 'anterior' },
      actividad: { tipo: 'vistas', texto: 'Recorre los pulmones.', vistas: [{ nombre: 'De frente', camara: 'anterior' }, { nombre: 'Por la derecha', camara: 'lateral' }, { nombre: 'Por detrás', camara: 'posterior' }] },
      comprobar: 'rel-funcion',
    },
    {
      id: 'lobulos', tipo: 'exploracion', titulo: 'Lóbulos y cisuras',
      texto: [
        ['Cada pulmón tiene forma de cono: el vértice sube por encima de la primera costilla y la base apoya en el diafragma; el izquierdo es algo más pequeño por el corazón.', T(PUL, 'Apex – The blunt superior end of the lung. It projects upwards, above the level of the 1st rib and into the floor of the neck.'), T(PUL, 'Base – The inferior surface of the lung, which sits on the diaphragm.'), T(PUL, 'The left lung is slightly smaller than the right – this is due to the presence of the heart.')],
        ['El derecho tiene tres lóbulos, separados por la cisura oblicua y la horizontal (a la altura de la cuarta costilla); el izquierdo, dos, separados por la oblicua.', T(PUL, 'The right lung has three lobes; superior, middle and inferior. The lobes are divided from each other by two fissures:'), T(PUL, 'Runs horizontally from the sternum, at the level of the 4th rib, to meet the oblique fissure.'), T(PUL, 'The left lung contains superior and inferior lobes, which are separated by a similar oblique fissure.')],
      ],
      vista: { ver: DERECHO, contexto: ['costilla-4', 'costilla-1', 'diafragma'], camara: 'lateral', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: DERECHO, texto: 'Alterna los tres lóbulos del pulmón derecho y busca dónde los separan las cisuras.' },
      comprobar: 'rel-lobulos',
    },
    {
      id: 'bronquios', tipo: 'relaciones', titulo: 'El árbol bronquial',
      texto: [
        ['La tráquea empieza bajo el cartílago cricoides y, a la altura del ángulo esternal, se divide en los bronquios principales derecho e izquierdo.', T(TRB, 'It arises at the lower border of cricoid cartilage in the neck, as a continuation of the larynx.'), T(TRB, 'At the level of the sternal angle, the trachea bifurcates into the right and left main bronchi.')],
        ['Cada bronquio principal da bronquios lobares, uno por lóbulo (tres a la derecha y dos a la izquierda), y estos, segmentarios, uno por segmento broncopulmonar.', T(TRB, 'Each secondary bronchi supplies a lobe of the lung, thus there are 3 right lobar bronchi and 2 left.'), T(TRB, 'The lobar bronchi then bifurcate into several segmental (tertiary) bronchi, each of which supplies a bronchopulmonary segment.')],
        ['El bronquio derecho es más ancho, más corto y más vertical; por eso es más fácil que un cuerpo extraño acabe en él.', T(TRB, 'Right main bronchus – wider, shorter, and descends more vertically than its left-sided counterpart. Clinically, this results in a higher incidence of foreign body inhalation.')],
      ],
      detalle: [
        ['En la bifurcación, la carina es la zona de la tráquea más sensible para desencadenar la tos.', T(TRB, 'This is the most sensitive area of the trachea for triggering the cough reflex')],
        ['Los segmentos broncopulmonares son las unidades funcionales de los pulmones.', T(TRB, 'Bronchopulmonary segments are subdivisions of the lung lobes, and act as the functional unit of the lungs.')],
      ],
      vista: { ver: [...PRINCIPALES, ...LOBARES], contexto: ['traquea', 'segmentarios'], fantasma: LOBULOS, camara: 'anterior' },
      actividad: { tipo: 'comparar', estructuras: PRINCIPALES, texto: 'Alterna los bronquios principales: el derecho, corto y casi vertical; el izquierdo, largo y más horizontal.' },
      comprobar: 'rel-cuerpo-extrano',
    },
    {
      id: 'hilio', tipo: 'relaciones', titulo: 'La raíz y el hilio',
      texto: [
        ['El hilio, por donde entran y salen las estructuras del pulmón, está en su cara mediastínica.', T(PUL, 'The lung hilum (where structures enter and leave the lung) is located on this surface.')],
        ['Cada raíz lleva un bronquio, una arteria pulmonar, dos venas pulmonares, los vasos bronquiales, nervios y linfáticos.', T(PUL, 'Each root contains a bronchus, pulmonary artery, two pulmonary veins, bronchial vessels, pulmonary plexus of nerves and lymphatic vessels.')],
        ['Por las arterias pulmonares llega del corazón derecho la sangre pobre en oxígeno; por las venas pulmonares vuelve, ya oxigenada, al corazón izquierdo.', W('Circulatory_system', 'The pulmonary circulation is a circuit loop from the right heart taking deoxygenated blood to the lungs where it is oxygenated and returned to the left heart.')],
      ],
      vista: { ver: HILIO, contexto: ['tronco-pulmonar', 'atrio-izquierdo', ...PRINCIPALES], fantasma: LOBULOS, camara: 'anterior' },
      actividad: { tipo: 'comparar', estructuras: HILIO, texto: 'Alterna: las dos arterias pulmonares, que salen del tronco pulmonar, y las cuatro venas, que llegan al atrio izquierdo.' },
      comprobar: 'rel-raiz',
    },
    {
      id: 'pleura', tipo: 'explicacion', titulo: 'La pleura',
      texto: [
        ['La pleura visceral cubre el pulmón y la parietal, el interior del tórax; las dos se continúan en el hilio y dejan entre ellas la cavidad pleural.', T(PLE, 'Visceral pleura – covers the lungs.'), T(PLE, 'Parietal pleura – covers the internal surface of the thoracic cavity.'), T(PLE, 'These two parts are continuous with each other at the hilum of each lung. There is a potential space between the viscera and parietal pleura, known as the pleural cavity.')],
        ['Un poco de líquido seroso las lubrica y, por tensión superficial, las mantiene juntas: cuando el tórax se expande, el pulmón lo sigue.', T(PLE, 'It lubricates the surfaces of the pleurae, allowing them to slide over each other. The serous fluid also produces a surface tension, pulling the parietal and visceral pleura together. This ensures that when the thorax expands, the lung also expands, filling with air.')],
        ['Si entra aire en la cavidad, esa tensión se pierde: es el neumotórax.', T(PLE, 'if air enters the pleural cavity, this surface tension is lost – a condition known as pneumothorax')],
      ],
      detalle: [
        ['En los recesos pleurales, como el costodiafragmático, puede acumularse líquido (derrame pleural).', T(PLE, 'These recesses are of clinical importance, as they provide a location where fluid can collect (such as in a pleural effusion).')],
      ],
      vista: { ver: ['pleura'], contexto: ['diafragma'], fantasma: LOBULOS, camara: 'anterior' },
      comprobar: 'rel-neumotorax',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['Derecho: tres lóbulos (cisuras oblicua y horizontal). Izquierdo: dos (cisura oblicua).', T(PUL, 'The right lung has three lobes; superior, middle and inferior.'), T(PUL, 'The left lung contains superior and inferior lobes')],
        ['Tráquea → bronquios principales (el derecho, más vertical) → lobares → segmentarios.', T(TRB, 'the trachea bifurcates into the right and left main bronchi.'), T(TRB, 'The lobar bronchi then bifurcate into several segmental (tertiary) bronchi')],
        ['La pleura visceral y la parietal dejan una cavidad cuya tensión superficial hace que el pulmón siga al tórax.', T(PLE, 'This ensures that when the thorax expands, the lung also expands, filling with air.')],
      ],
    },
  ],
  preguntas: [
    {
      id: 'rel-funcion', tipo: 'relacion', objetivo: 0, paso: 'orientacion', estructuras: LOBULOS,
      enunciado: '¿Dónde están los pulmones?',
      correcta: 'En el tórax, a cada lado del mediastino',
      distractores: ['Dentro del mediastino, detrás del corazón', 'En el abdomen, bajo el diafragma', 'En el cuello, junto a la tráquea'],
      explicacion: 'El mediastino, con el corazón, queda entre los dos pulmones.',
      evidencia: [T(PUL, 'They are located in the thorax, either side of the mediastinum.')],
    },
    { id: 'id-lobulo-med-der', tipo: 'identificar', estructura: 'lobulo-med-der', objetivo: 0, paso: 'lobulos' },
    { id: 'id-lobulo-sup-izq', tipo: 'identificar', estructura: 'lobulo-sup-izq', objetivo: 0, paso: 'orientacion' },
    {
      id: 'rel-lobulos', tipo: 'relacion', objetivo: 0, paso: 'lobulos', estructuras: LOBULOS,
      enunciado: '¿Cuántos lóbulos tiene cada pulmón?',
      correcta: 'El derecho, tres; el izquierdo, dos',
      distractores: ['Los dos, tres', 'El derecho, dos; el izquierdo, tres', 'Los dos, dos'],
      explicacion: 'El derecho tiene cisura oblicua y horizontal; el izquierdo, solo la oblicua.',
      evidencia: [T(PUL, 'The right lung has three lobes; superior, middle and inferior.'), T(PUL, 'The left lung contains superior and inferior lobes')],
    },
    {
      id: 'rel-horizontal', tipo: 'relacion', objetivo: 0, paso: 'lobulos', estructuras: ['lobulo-med-der', 'costilla-4'],
      enunciado: '¿Qué separa la cisura horizontal del pulmón derecho?',
      correcta: 'El lóbulo superior del medio, a la altura de la cuarta costilla',
      distractores: ['El lóbulo medio del inferior', 'Los dos lóbulos del pulmón izquierdo', 'El pulmón del diafragma'],
      explicacion: 'La oblicua separa el inferior de los otros dos.',
      evidencia: [T(PUL, 'Horizontal fissure– Runs horizontally from the sternum, at the level of the 4th rib, to meet the oblique fissure.')],
    },
    { id: 'id-bronquio-derecho', tipo: 'identificar', estructura: 'bronquio-derecho', objetivo: 1, paso: 'bronquios' },
    {
      id: 'sec-arbol', tipo: 'secuencia', objetivo: 1, paso: 'bronquios',
      enunciado: 'Ordena el camino del aire hacia un segmento del pulmón.',
      orden: ['Tráquea', 'Bronquio principal', 'Bronquio lobar', 'Bronquio segmentario'],
      explicacion: 'Cada nivel se divide: principal por pulmón, lobar por lóbulo y segmentario por segmento.',
      evidencia: [T(TRB, 'the trachea bifurcates into the right and left main bronchi.'), T(TRB, 'Each secondary bronchi supplies a lobe of the lung'), T(TRB, 'each of which supplies a bronchopulmonary segment.')],
    },
    {
      id: 'rel-cuerpo-extrano', tipo: 'relacion', objetivo: 2, paso: 'bronquios', estructuras: PRINCIPALES,
      enunciado: '¿Por qué los cuerpos extraños inhalados van más a menudo al bronquio derecho?',
      correcta: 'Porque es más ancho, más corto y más vertical',
      distractores: ['Porque es más estrecho y largo', 'Porque el pulmón derecho es más pequeño', 'Porque pasa por debajo del cayado de la aorta'],
      explicacion: 'El izquierdo, más horizontal, pasa bajo el cayado de la aorta.',
      evidencia: [T(TRB, 'Right main bronchus – wider, shorter, and descends more vertically than its left-sided counterpart. Clinically, this results in a higher incidence of foreign body inhalation.')],
    },
    {
      id: 'rel-raiz', tipo: 'relacion', objetivo: 3, paso: 'hilio', estructuras: HILIO,
      enunciado: '¿Qué contiene la raíz de cada pulmón?',
      correcta: 'Un bronquio, una arteria pulmonar y dos venas pulmonares, entre otros',
      distractores: ['La aorta y la vena cava', 'El esófago y la tráquea', 'Solo el bronquio principal'],
      explicacion: 'También lleva los vasos bronquiales, los nervios y los linfáticos.',
      evidencia: [T(PUL, 'Each root contains a bronchus, pulmonary artery, two pulmonary veins, bronchial vessels, pulmonary plexus of nerves and lymphatic vessels.')],
    },
    { id: 'id-venas-pulmonares', tipo: 'identificar', estructura: 'venas-pulmonares', objetivo: 3, paso: 'hilio' },
    {
      id: 'rel-neumotorax', tipo: 'relacion', objetivo: 4, paso: 'pleura', estructuras: ['pleura'],
      enunciado: '¿Qué pasa en un neumotórax?',
      correcta: 'Entra aire en la cavidad pleural y se pierde la tensión que mantiene el pulmón pegado al tórax',
      distractores: ['Se llena de agua un bronquio', 'Se rompe la tráquea', 'El diafragma se paraliza'],
      explicacion: 'Sin esa tensión, el pulmón ya no sigue al tórax cuando se expande.',
      evidencia: [T(PLE, 'if air enters the pleural cavity, this surface tension is lost – a condition known as pneumothorax')],
    },
    {
      id: 'comp-pleuras', tipo: 'comparacion', objetivo: 4, paso: 'pleura', estructuras: ['pleura'],
      enunciado: '¿Qué cubre la pleura visceral?',
      correcta: 'La superficie del pulmón',
      distractores: ['La cara interna de las costillas', 'El diafragma', 'El mediastino'],
      explicacion: 'Las costillas, el diafragma y el mediastino los cubre la parietal.',
      evidencia: [T(PLE, 'Visceral pleura – covers the lungs.'), T(PLE, 'Parietal pleura – covers the internal surface of the thoracic cavity.')],
    },
  ],
});
