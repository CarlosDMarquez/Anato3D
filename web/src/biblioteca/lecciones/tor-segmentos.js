// Lección «Segmentos broncopulmonares: bronquios, arterias y venas». Formato y evidencias: ../formato.js.
// Parte del hueco del mediastino y de los pulmones (docs/estudio/cobertura.md): las arterias y las venas lobares y
// segmentarias, que el modelo clasifica en el mediastino, y los bronquios lobares y segmentarios, que tor-pulmones solo
// muestra como contexto. Cada estructura agrupa las piezas de un lóbulo (sus bronquios, sus arterias o sus venas): se
// estudia qué segmentos tiene cada lóbulo y cómo van los vasos respecto a los bronquios, no cada pieza por separado.
// En el pulmón izquierdo del modelo, los bronquios basales anterior y medial (BVII y BVIII) son piezas separadas.
import { leccion, W, T, GUIA, MODELO } from '../formato.js';

const ARB = 'thorax/organs/tracheobronchial-tree';
const PUL = 'thorax/organs/lungs';
const grupo = (nombre, piezas, tipo, confusiones) => ({ nombre, piezas, lado: 'impar', papel: 'nucleo', tipo, confusiones });
const contexto = (nombre, piezas, tipo) => ({ nombre, piezas, lado: 'impar', papel: 'contexto', tipo });
const der = (x) => `${x}_of_right_lung`;
const izq = (x) => `${x}_of_left_lung`;

const BRONQUIOS = ['b-lsd', 'b-intermedio', 'b-lmd', 'b-lid', 'b-lsi', 'b-lii'];
const ARTERIAS = ['a-lsd', 'a-lmd', 'a-lid', 'a-lsi', 'a-lii'];
const VENAS = ['v-lsd', 'v-lmd', 'v-lid', 'v-lsi', 'v-lii'];
const PULMON_D = ['lobulo-sd', 'lobulo-md', 'lobulo-id'];
const PULMON_I = ['lobulo-si', 'lobulo-ii'];

export default leccion({
  id: 'tor-segmentos',
  version: 1,
  titulo: 'Segmentos broncopulmonares: bronquios, arterias y venas',
  resumen: 'Qué es un segmento broncopulmonar y por qué se puede extirpar solo; los segmentos de cada lóbulo con sus bronquios lobares y segmentarios, incluido el bronquio intermedio y la língula; las arterias pulmonares, que siguen a los bronquios, y las venas, que corren entre los segmentos hasta el atrio izquierdo.',
  lugares: [['torax', 'pulmones-pleura'], ['torax', 'mediastino']],
  sistemas: ['respiratorio', 'cardiovascular'],
  formato: 'estructuras',
  temas: ['organos', 'arterias-venas'],
  nivel: 3,
  minutos: 20,
  requisitos: ['tor-pulmones'],
  siguiente: ['tor-linfaticos', 'tor-mediastino'],
  objetivos: [
    'Explicar qué es un segmento broncopulmonar y por qué se puede extirpar sin afectar a los demás.',
    'Nombrar los segmentos de cada lóbulo de los dos pulmones.',
    'Localizar los bronquios lobares y segmentarios de cada pulmón, incluido el bronquio intermedio.',
    'Seguir las arterias pulmonares hasta sus ramas lobares y segmentarias y decir por dónde van respecto a los bronquios.',
    'Explicar por dónde corren las venas pulmonares y adónde llevan la sangre.',
  ],
  estructuras: {
    'b-lsd': grupo('Bronquios del lóbulo superior derecho', ['Right_superior_lobar_bronchus', 'Apical_segmental_bronchus_of_right_lung_BI', 'Posterior_segmental_bronchus_of_right_lung_BII', 'Anterior_segmental_bronchus_of_right_lung_BIII'], 'organo'),
    'b-intermedio': grupo('Bronquio intermedio', ['Intermediate_bronchus_R'], 'organo', ['Bronquio principal derecho', 'Bronquio lobar medio']),
    'b-lmd': grupo('Bronquios del lóbulo medio', ['Middle_lobar_bronchus_R', 'Lateral_segmental_bronchus_of_right_lung_BIV', 'Medial_segmental_bronchus_of_right_lung_BV'], 'organo'),
    'b-lid': grupo('Bronquios del lóbulo inferior derecho', ['Right_inferior_lobar_bronchus', 'Superior_segmental_bronchus_of_right_lung_BVI', 'Medial_basal_segmental_bronchus_of_right_lung_BVII', 'Anterior_basal_segmental_bronchus_of_right_lung_BVIII', 'Lateral_basal_segmental_bronchus_of_right_lung_BIX', 'Posterior_basal_segmental_bronchus_of_right_lung_BX'], 'organo'),
    'b-lsi': grupo('Bronquios del lóbulo superior izquierdo', ['Left_superior_lobar_bronchus', 'Apicoposterior_segmental_bronchus_of_left_lung_BI_BII', 'Anterior_segmental_bronchus_of_left_lung_BIII', 'Superior_lingular_segmental_bronchus_of_left_lung_BIV', 'Inferior_lingular_segmental_bronchus_of_left_lung_BV'], 'organo'),
    'b-lii': grupo('Bronquios del lóbulo inferior izquierdo', ['Left_inferior_lobar_bronchus', 'Superior_segmental_bronchus_of_left_lung_BVI', 'Medial_basal_segmental_bronchus_of_left_lung_BVII', 'Anterior_basal_segmental_bronchus_of_left_lung_BVIII', 'Lateral_basal_segmental_bronchus_of_left_lung_BIX', 'Posterior_basal_segmental_bronchus_of_left_lung_BX'], 'organo'),
    'a-lsd': grupo('Arterias del lóbulo superior derecho', [der('Superior_lobar_artery'), der('Apical_segmental_artery'), der('Anterior_segmental_artery'), der('Posterior_segmental_artery')], 'arteria'),
    'a-lmd': grupo('Arterias del lóbulo medio', [der('Middle_lobar_artery'), der('Lateral_segmental_artery'), der('Medial_segmental_artery')], 'arteria'),
    'a-lid': grupo('Arterias del lóbulo inferior derecho', [der('Inferior_lobar_artery'), der('Superior_segmental_artery'), der('Medial_basal_segmental_artery'), der('Anterior_basal_segmental_artery'), der('Lateral_basal_segmental_artery'), der('Posterior_basal_segmental_artery')], 'arteria'),
    'a-lsi': grupo('Arterias del lóbulo superior izquierdo', [izq('Apical_segmental_artery'), izq('Anterior_segmental_artery'), izq('Posterior_segmental_artery'), izq('Superior_lingular_artery'), izq('Inferior_lingular_artery')], 'arteria'),
    'a-lii': grupo('Arterias del lóbulo inferior izquierdo', [izq('Superior_segmental_artery'), izq('Medial_basal_segmental_artery'), izq('Anterior_basal_segmental_artery'), izq('Lateral_basal_segmental_artery'), izq('Posterior_basal_segmental_artery')], 'arteria'),
    'v-lsd': grupo('Venas del lóbulo superior derecho', [der('Apical_vein'), der('Anterior_vein'), der('Posterior_vein')], 'vena'),
    'v-lmd': grupo('Venas del lóbulo medio', [der('Lateral_vein'), der('Medial_vein')], 'vena'),
    'v-lid': grupo('Venas del lóbulo inferior derecho', [der('Superior_vein'), der('Superior_basal_vein'), der('Inferior_basal_vein')], 'vena'),
    'v-lsi': grupo('Venas del lóbulo superior izquierdo', [izq('Apicoposterior_vein'), izq('Anterior_vein'), izq('Lingular_vein'), izq('Superior_lingular_vein'), izq('Inferior_lingular_vein')], 'vena'),
    'v-lii': grupo('Venas del lóbulo inferior izquierdo', [izq('Superior_vein'), izq('Superior_basal_vein'), izq('Inferior_basal_vein')], 'vena'),
    traquea: contexto('Tráquea', ['Trachea'], 'organo'),
    'bronquio-derecho': contexto('Bronquio principal derecho', ['Right_main_bronchus'], 'organo'),
    'bronquio-izquierdo': contexto('Bronquio principal izquierdo', ['Left_main_bronchus'], 'organo'),
    'tronco-pulmonar': contexto('Tronco pulmonar', ['Pulmonary_trunk'], 'arteria'),
    'arteria-pulmonar-derecha': contexto('Arteria pulmonar derecha', ['Right_pulmonary_artery'], 'arteria'),
    'arteria-pulmonar-izquierda': contexto('Arteria pulmonar izquierda', ['Left_pulmonary_artery'], 'arteria'),
    'venas-pulmonares': contexto('Venas pulmonares principales', ['Right_superior_pulmonary_vein', 'Right_inferior_pulmonary_vein', 'Left_superior_pulmonary_vein', 'Left_inferior_pulmonary_vein'], 'vena'),
    'atrio-izquierdo': contexto('Atrio izquierdo', ['Left_atrium'], 'corazon'),
    'lobulo-sd': contexto('Lóbulo superior derecho', ['Superior_lobe_of_right_lung'], 'organo'),
    'lobulo-md': contexto('Lóbulo medio', ['Middle_lobe_of_right_lung'], 'organo'),
    'lobulo-id': contexto('Lóbulo inferior derecho', ['Inferior_lobe_of_right_lung'], 'organo'),
    'lobulo-si': contexto('Lóbulo superior izquierdo', ['Superior_lobe_of_left_lung'], 'organo'),
    'lobulo-ii': contexto('Lóbulo inferior izquierdo', ['Inferior_lobe_of_left_lung'], 'organo'),
  },
  pasos: [
    {
      id: 'orientacion', tipo: 'orientacion', titulo: 'Lóbulos y segmentos',
      texto: [
        ['El pulmón derecho tiene tres lóbulos y el izquierdo, dos, separados por cisuras.', W('Lung', 'The right lung has three lobes and the left has two.'), T(PUL, 'Lobes (two or three) – These are separated by fissures within the lung.')],
        ['Cada lóbulo se divide en segmentos broncopulmonares.', W('Lung', 'The lobes are further divided into bronchopulmonary segments and lobules.')],
        ['Cada bronquio lobar ventila un lóbulo y se divide en bronquios segmentarios, uno para cada segmento.', T(ARB, 'Each secondary bronchi supplies a lobe of the lung, and gives rise to several segmental bronchi.'), W('Bronchus', 'The secondary bronchi divide further into tertiary bronchi, (also known as segmental bronchi), each of which supplies a bronchopulmonary segment.')],
        ['En el modelo, los lóbulos se ven translúcidos y cada estructura agrupa los bronquios, las arterias o las venas de un lóbulo.', MODELO],
        ['Mira el árbol bronquial de frente y desde los lados.', GUIA],
      ],
      vista: { ver: BRONQUIOS, contexto: ['traquea', 'bronquio-derecho', 'bronquio-izquierdo'], fantasma: [...PULMON_D, ...PULMON_I], camara: 'anterior' },
      actividad: { tipo: 'vistas', texto: 'Recorre el árbol bronquial desde delante, la derecha y la izquierda.', vistas: [{ nombre: 'De frente', camara: 'anterior' }, { nombre: 'Por la derecha', camara: 'lateral' }, { nombre: 'Por detrás', camara: 'posterior' }] },
      comprobar: 'rel-segmento',
    },
    {
      id: 'segmento', tipo: 'explicacion', titulo: 'Qué es un segmento broncopulmonar',
      texto: [
        ['Un segmento broncopulmonar es la parte del pulmón que ventila un bronquio segmentario, con sus vasos.', W('Bronchopulmonary_segment', 'A bronchopulmonary segment is a portion of lung supplied by a specific segmental bronchus and its vessels.')],
        ['Sus arterias recorren el centro del segmento junto al bronquio; las venas y los linfáticos drenan por sus bordes.', W('Bronchopulmonary_segment', 'run together through the center of the segment.'), W('Bronchopulmonary_segment', 'Veins and lymphatic vessels drain along the edges of the segment.')],
        ['Cada segmento está separado de los demás por tejido conectivo, así que se puede extirpar sin afectar a los otros.', W('Bronchopulmonary_segment', 'The segments are separated from each other by layers of connective tissue that forms them into discrete anatomical and functional units.'), W('Bronchopulmonary_segment', 'This separation means that a bronchopulmonary segment can be surgically removed without affecting the function of the others.')],
        ['Por eso una infección suele quedarse en su segmento, aunque la tuberculosis y el cáncer de bronquio pueden pasar a otros.', W('Bronchopulmonary_segment', 'Usually the infection of the bronchopulmonary segment remains restricted to it, although tuberculosis and bronchogenic carcinoma may spread from one segment to another.')],
      ],
      vista: { ver: ['b-lid', 'a-lid', 'v-lid'], contexto: ['bronquio-derecho'], fantasma: ['lobulo-id'], camara: 'lateral', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['b-lid', 'a-lid', 'v-lid'], texto: 'Alterna los bronquios, las arterias y las venas del lóbulo inferior derecho y compara por dónde va cada uno.' },
      comprobar: 'fun-segmentectomia',
    },
    {
      id: 'derecho', tipo: 'exploracion', titulo: 'El pulmón derecho: tres lóbulos y diez segmentos',
      texto: [
        ['El pulmón derecho tiene diez segmentos: tres en el lóbulo superior (apical, posterior y anterior), dos en el medio (lateral y medial) y cinco en el inferior (superior y cuatro basales).', W('Bronchopulmonary_segment', 'There are ten bronchopulmonary segments in the right lung: three in the superior lobe, two in the middle lobe, and five in the inferior lobe.')],
        ['El bronquio del lóbulo superior sale del principal derecho a unos 2 cm de su origen, por encima de la arteria pulmonar: por eso se le llama epiarterial.', W('Bronchus', 'About 2 cm from its commencement it gives off a branch to the superior lobe of the right lung, which is also called the eparterial bronchus.'), W('Bronchus', 'Eparterial refers to its position above the right pulmonary artery.')],
        ['Después, el bronquio continúa por debajo de la arteria como bronquio intermedio y se divide en los bronquios de los lóbulos medio e inferior.', W('Bronchus', 'The right bronchus now passes below the artery, and is known as the hyparterial branch which divides into the two lobar bronchi to the middle and lower lobes.'), W('Pulmonary_artery', 'running together with bronchus intermedius.')],
      ],
      detalle: [
        ['Los cuatro segmentos basales del lóbulo inferior derecho son el medial, el anterior, el lateral y el posterior.', W('Bronchopulmonary_segment', 'medial-basal segment'), W('Bronchopulmonary_segment', 'anterior-basal segment'), W('Bronchopulmonary_segment', 'lateral-basal segment'), W('Bronchopulmonary_segment', 'posterior-basal segment')],
      ],
      vista: { ver: ['b-lsd', 'b-intermedio', 'b-lmd', 'b-lid'], contexto: ['traquea', 'bronquio-derecho', 'arteria-pulmonar-derecha'], fantasma: PULMON_D, camara: 'anterior' },
      actividad: { tipo: 'localizar', estructura: 'b-intermedio', texto: 'Toca el tramo de bronquio que queda entre la salida del bronquio del lóbulo superior y los del medio y el inferior.' },
      comprobar: 'rel-epiarterial',
    },
    {
      id: 'izquierdo', tipo: 'exploracion', titulo: 'El pulmón izquierdo: dos lóbulos y la língula',
      texto: [
        ['El bronquio principal izquierdo es más estrecho y más largo, y se divide en los bronquios de los lóbulos superior e inferior.', W('Bronchus', 'The left main bronchus is smaller in caliber but longer than the right, being 5 cm long.'), W('Bronchus', 'The left main bronchus divides into two secondary bronchi or lobar bronchi, to deliver air to the two lobes of the left lung—the superior and the inferior lobe.')],
        ['Algunos segmentos se fusionan, así que el pulmón izquierdo suele tener ocho o nueve, de cuatro a cinco por lóbulo.', W('Bronchopulmonary_segment', 'Some of the segments may fuse in the left lung to form usually eight to nine segments (four to five in the upper lobe and four to five in the lower lobe.')],
        ['El lóbulo superior tiene el segmento apicoposterior, el anterior y la língula, con sus segmentos lingulares superior e inferior.', W('Bronchopulmonary_segment', 'apico-posterior segment (merger of "apical" and "posterior")'), W('Bronchopulmonary_segment', 'Lingula of superior lobe'), W('Bronchopulmonary_segment', 'inferior lingular segment'), W('Bronchopulmonary_segment', 'superior lingular segment')],
        ['El lóbulo inferior tiene un segmento superior y los basales; el anterior y el medial suelen formar uno solo, el anteromedial.', W('Bronchopulmonary_segment', 'anteromedial basal segment (merger of "anterior basal" and "medial basal")')],
        ['En el modelo, los bronquios basales anterior y medial del pulmón izquierdo son piezas separadas.', MODELO],
      ],
      vista: { ver: ['b-lsi', 'b-lii'], contexto: ['traquea', 'bronquio-izquierdo', 'arteria-pulmonar-izquierda'], fantasma: PULMON_I, camara: 'lateral', lado: 'L' },
      actividad: { tipo: 'comparar', estructuras: ['b-lsi', 'b-lii'], texto: 'Compara los bronquios de los dos lóbulos izquierdos y busca los de la língula.' },
      comprobar: 'rel-lingula',
    },
    {
      id: 'arterias', tipo: 'relaciones', titulo: 'Las arterias pulmonares siguen a los bronquios',
      texto: [
        ['Las arterias pulmonares llevan a los pulmones la sangre pobre en oxígeno del lado derecho del corazón.', W('Pulmonary_artery', 'A pulmonary artery is an artery in the pulmonary circulation that carries deoxygenated blood from the right side of the heart to the lungs.')],
        ['El tronco pulmonar se divide debajo del arco de la aorta, delante del bronquio principal izquierdo.', W('Pulmonary_artery', 'The pulmonary trunk bifurcates into right and left pulmonary arteries below the arch of aorta and in front of the left main bronchus.')],
        ['La derecha da la arteria del lóbulo superior y sigue como interlobar junto al bronquio intermedio; la izquierda se divide en una arteria para cada lóbulo.', W('Pulmonary_artery', 'it bifurcates into artery that supplies the right upper lobe of the lung'), W('Pulmonary_artery', 'interlobar artery that supplies the right middle and inferior lobes of the lung, running together with bronchus intermedius.'), W('Pulmonary_artery', 'The left main pulmonary artery then divides into two lobar arteries, one for each lobe of the left lung.')],
        ['Las arterias lobares dan una arteria segmentaria por segmento, que va pegada a su bronquio segmentario, por su cara posterolateral.', W('Pulmonary_artery', 'The lobar arteries branch into segmental arteries (roughly 1 for each segment).'), W('Pulmonary_artery', 'Segmental arteries run together with segmental bronchi, at the posterolateral surfaces of the bronchi.')],
        ['En el pulmón izquierdo del modelo, las arterias segmentarias salen directamente de la pulmonar izquierda, sin piezas lobares.', MODELO],
      ],
      vista: { ver: ARTERIAS, contexto: ['tronco-pulmonar', 'arteria-pulmonar-derecha', 'arteria-pulmonar-izquierda'], fantasma: [...PULMON_D, ...PULMON_I], camara: 'anterior' },
      actividad: { tipo: 'localizar', estructura: 'a-lmd', texto: 'Toca las arterias que van al lóbulo medio.' },
      comprobar: 'rel-arterias-bronquios',
    },
    {
      id: 'venas', tipo: 'relaciones', titulo: 'Las venas pulmonares, entre los segmentos',
      texto: [
        ['Las venas pulmonares llevan la sangre oxigenada de los pulmones al atrio izquierdo.', W('Pulmonary_vein', 'The pulmonary veins are the veins that transfer oxygenated blood from the lungs to the heart.'), W('Pulmonary_vein', 'two from each lung that drain into the left atrium of the heart.')],
        ['De cada hilio salen dos venas principales, una superior y una inferior, que reciben de tres a cuatro venas de su pulmón.', W('Pulmonary_vein', 'There are four main pulmonary veins, two from each lung – an inferior and a superior main vein, emerging from each hilum.'), W('Pulmonary_vein', 'The main pulmonary veins receive blood from three or four feeding veins in each lung')],
        ['Las venas pequeñas no siguen a los bronquios: corren entre los segmentos que drenan.', W('Pulmonary_vein', 'The peripheral feeding veins do not follow the bronchial tree.'), W('Pulmonary_vein', 'They run between the pulmonary segments from which they drain the blood.')],
        ['Las principales varían: al atrio pueden llegar de tres a cinco; las dos izquierdas se unen en una sola en una de cada cuatro personas.', W('Pulmonary_vein', 'the number of pulmonary veins opening into the left atrium can vary between three and five in the healthy population.'), W('Pulmonary_vein', 'The two left lobar veins may be united as a single pulmonary vein in about 25% of people')],
      ],
      vista: { ver: VENAS, contexto: ['venas-pulmonares', 'atrio-izquierdo'], fantasma: [...PULMON_D, ...PULMON_I], camara: 'posterior' },
      actividad: { tipo: 'comparar', estructuras: ['v-lsd', 'v-lid'], texto: 'Compara las venas de los lóbulos superior e inferior derechos y sigue cada grupo hasta su vena principal.' },
      comprobar: 'rel-venas-segmentos',
    },
    {
      id: 'importancia', tipo: 'funcion', titulo: 'Por qué el lado derecho es distinto',
      texto: [
        ['El bronquio principal derecho es más ancho, más corto y más vertical que el izquierdo.', W('Bronchus', 'The right main bronchus is wider, shorter, and more vertical than the left main bronchus')],
        ['El izquierdo sale de la tráquea con más ángulo, y por eso lo que se aspira suele ir al pulmón derecho.', W('Bronchus', 'The left main bronchus departs from the trachea at a greater angle than that of the right main bronchus.'), W('Bronchus', 'these differences predispose the right lung to aspirational problems.')],
        ['Con un broncoscopio, que entra por la boca y la tráquea, se ven por dentro los bronquios hasta los segmentarios.', W('Bronchopulmonary_segment', 'Visualising the interior of the bronchi through a bronchoscope passed through the mouth and trachea, procedure is called bronchoscopy.')],
      ],
      vista: { ver: ['b-intermedio', 'b-lid'], contexto: ['traquea', 'bronquio-derecho', 'bronquio-izquierdo'], fantasma: PULMON_D, camara: 'anterior' },
      comprobar: 'fun-aspiracion',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'Repaso',
      texto: [
        ['Cada segmento tiene su bronquio segmentario y su arteria en el centro; las venas van por sus bordes.', W('Bronchopulmonary_segment', 'A bronchopulmonary segment is a portion of lung supplied by a specific segmental bronchus and its vessels.'), W('Bronchopulmonary_segment', 'Veins and lymphatic vessels drain along the edges of the segment.')],
        ['El pulmón derecho tiene diez segmentos (3, 2 y 5); el izquierdo, de ocho a nueve, con la língula en el lóbulo superior.', W('Bronchopulmonary_segment', 'There are ten bronchopulmonary segments in the right lung: three in the superior lobe, two in the middle lobe, and five in the inferior lobe.'), W('Bronchopulmonary_segment', 'Some of the segments may fuse in the left lung to form usually eight to nine segments')],
        ['Las arterias llevan la sangre pobre en oxígeno junto a los bronquios; las venas devuelven la oxigenada al atrio izquierdo.', W('Pulmonary_artery', 'Segmental arteries run together with segmental bronchi'), W('Pulmonary_vein', 'The pulmonary veins are the veins that transfer oxygenated blood from the lungs to the heart.')],
      ],
    },
  ],
  preguntas: [
    {
      id: 'rel-segmento', tipo: 'relacion', objetivo: 0, paso: 'segmento',
      enunciado: '¿Qué es un segmento broncopulmonar?',
      correcta: 'La parte del pulmón que ventila un bronquio segmentario, con sus vasos',
      distractores: ['La parte del pulmón que separa cada cisura', 'Cada uno de los alvéolos del pulmón', 'La zona del pulmón que drena una vena pulmonar principal'],
      explicacion: 'Cada segmento tiene su propio bronquio segmentario, con su arteria en el centro; las cisuras separan lóbulos, que contienen varios segmentos.',
      evidencia: [W('Bronchopulmonary_segment', 'A bronchopulmonary segment is a portion of lung supplied by a specific segmental bronchus and its vessels.'), W('Lung', 'The inner visceral pleura divides each lung as fissures into sections called lobes.')],
    },
    {
      id: 'fun-segmentectomia', tipo: 'funcion', objetivo: 0, paso: 'segmento',
      enunciado: '¿Por qué se puede extirpar un segmento broncopulmonar sin afectar a los demás?',
      correcta: 'Porque tiene su propio bronquio y sus vasos y lo separa tejido conectivo',
      distractores: ['Porque no recibe sangre de las arterias pulmonares', 'Porque los segmentos no intercambian gases', 'Porque cada segmento es un lóbulo independiente'],
      explicacion: 'Los segmentos están separados por capas de tejido conectivo y cada uno tiene su bronquio y sus vasos: son unidades anatómicas y funcionales.',
      evidencia: [W('Bronchopulmonary_segment', 'The segments are separated from each other by layers of connective tissue that forms them into discrete anatomical and functional units.'), W('Bronchopulmonary_segment', 'This separation means that a bronchopulmonary segment can be surgically removed without affecting the function of the others.')],
    },
    {
      id: 'rel-numero', tipo: 'relacion', objetivo: 1, paso: 'derecho',
      enunciado: '¿Cuántos segmentos tiene el pulmón derecho y cómo se reparten?',
      correcta: 'Diez: tres en el lóbulo superior, dos en el medio y cinco en el inferior',
      distractores: ['Diez: cuatro en el superior, dos en el medio y cuatro en el inferior', 'Ocho: tres en el superior, dos en el medio y tres en el inferior', 'Doce: cuatro en cada lóbulo'],
      explicacion: 'El lóbulo superior tiene los segmentos apical, posterior y anterior; el medio, lateral y medial, y el inferior, el superior y cuatro basales.',
      evidencia: [W('Bronchopulmonary_segment', 'There are ten bronchopulmonary segments in the right lung: three in the superior lobe, two in the middle lobe, and five in the inferior lobe.')],
    },
    {
      id: 'rel-lingula', tipo: 'relacion', objetivo: 1, paso: 'izquierdo', estructuras: ['b-lsi'],
      enunciado: '¿A qué lóbulo pertenece la língula?',
      correcta: 'Al lóbulo superior izquierdo',
      distractores: ['Al lóbulo inferior izquierdo', 'Al lóbulo medio derecho', 'A ninguno: es un lóbulo propio'],
      explicacion: 'La língula es la parte del lóbulo superior izquierdo que tiene los segmentos lingulares superior e inferior.',
      evidencia: [W('Bronchopulmonary_segment', 'Lingula of superior lobe'), W('Bronchopulmonary_segment', 'superior lingular segment')],
    },
    {
      id: 'rel-izquierdo', tipo: 'relacion', objetivo: 1, paso: 'izquierdo', estructuras: ['b-lsi', 'b-lii'],
      enunciado: '¿Por qué el pulmón izquierdo suele tener menos segmentos que el derecho?',
      correcta: 'Porque algunos segmentos se fusionan, como el apicoposterior',
      distractores: ['Porque no tiene bronquios segmentarios', 'Porque la língula no tiene segmentos', 'Porque sus arterias no siguen a los bronquios'],
      explicacion: 'En el izquierdo se fusionan algunos: el apical y el posterior forman el apicoposterior, y el basal anterior y el medial, el anteromedial. Suelen quedar ocho o nueve.',
      evidencia: [W('Bronchopulmonary_segment', 'Some of the segments may fuse in the left lung to form usually eight to nine segments'), W('Bronchopulmonary_segment', 'apico-posterior segment (merger of "apical" and "posterior")'), W('Bronchopulmonary_segment', 'anteromedial basal segment (merger of "anterior basal" and "medial basal")')],
    },
    ...BRONQUIOS.map((e) => ({ id: `id-${e}`, tipo: 'identificar', estructura: e, objetivo: 2, paso: e.endsWith('i') && e !== 'b-intermedio' ? 'izquierdo' : 'derecho' })),
    { id: 'loc-b-intermedio', tipo: 'localizar', estructura: 'b-intermedio', candidatas: ['b-lsd', 'b-lmd', 'b-lid'], objetivo: 2, paso: 'derecho' },
    {
      id: 'rel-epiarterial', tipo: 'relacion', objetivo: 2, paso: 'derecho', estructuras: ['b-lsd'],
      enunciado: '¿Por qué se llama epiarterial al bronquio del lóbulo superior derecho?',
      correcta: 'Porque sale por encima de la arteria pulmonar derecha',
      distractores: ['Porque lleva una arteria por dentro', 'Porque nace de la arteria pulmonar', 'Porque pasa por delante de la aorta'],
      explicacion: 'Sale del bronquio principal derecho a unos 2 cm de su origen, por encima de la arteria pulmonar; después el bronquio pasa por debajo de ella como bronquio intermedio.',
      evidencia: [W('Bronchus', 'About 2 cm from its commencement it gives off a branch to the superior lobe of the right lung, which is also called the eparterial bronchus.'), W('Bronchus', 'Eparterial refers to its position above the right pulmonary artery.'), W('Bronchus', 'The right bronchus now passes below the artery')],
    },
    {
      id: 'rel-intermedio', tipo: 'relacion', objetivo: 2, paso: 'derecho', estructuras: ['b-intermedio'],
      enunciado: '¿Qué lóbulos ventila el bronquio intermedio?',
      correcta: 'El medio y el inferior del pulmón derecho',
      distractores: ['El superior y el medio del pulmón derecho', 'Solo el lóbulo inferior derecho', 'La língula del pulmón izquierdo'],
      explicacion: 'Tras dar el bronquio del lóbulo superior, el derecho sigue como bronquio intermedio y se divide en los bronquios de los lóbulos medio e inferior.',
      evidencia: [W('Bronchus', 'The right bronchus now passes below the artery, and is known as the hyparterial branch which divides into the two lobar bronchi to the middle and lower lobes.')],
    },
    {
      id: 'sec-aire', tipo: 'secuencia', objetivo: 2, paso: 'derecho', estructuras: ['b-intermedio', 'b-lid'],
      enunciado: 'Ordena el camino del aire hasta el segmento basal anterior del pulmón derecho:',
      orden: ['Tráquea', 'Bronquio principal derecho', 'Bronquio intermedio', 'Bronquio lobar inferior derecho', 'Bronquio segmentario basal anterior'],
      explicacion: 'Tras el bronquio principal derecho viene el intermedio, que da el lobar inferior; este se divide en los segmentarios, entre ellos el basal anterior.',
      evidencia: [W('Bronchus', 'The first or primary bronchi to branch from the trachea at the carina are the right main bronchus and the left main bronchus.'), W('Bronchus', 'is known as the hyparterial branch which divides into the two lobar bronchi to the middle and lower lobes.'), W('Bronchus', 'The main bronchi branch into narrower secondary bronchi or lobar bronchi, and these branch into narrower tertiary bronchi or segmental bronchi.')],
    },
    {
      id: 'fun-aspiracion', tipo: 'funcion', objetivo: 2, paso: 'importancia', estructuras: ['b-intermedio'],
      enunciado: '¿Por qué lo que se aspira suele ir al pulmón derecho?',
      correcta: 'Porque su bronquio principal es más ancho, más corto y más vertical',
      distractores: ['Porque es el único pulmón con tres lóbulos', 'Porque el izquierdo tiene la língula delante', 'Porque el corazón empuja el aire hacia la derecha'],
      explicacion: 'El bronquio principal derecho es más ancho y sigue una dirección más vertical, mientras que el izquierdo sale con más ángulo: lo aspirado cae más fácilmente a la derecha.',
      evidencia: [W('Bronchus', 'The right main bronchus is wider, shorter, and more vertical than the left main bronchus'), W('Bronchus', 'The left main bronchus departs from the trachea at a greater angle than that of the right main bronchus.'), W('Bronchus', 'these differences predispose the right lung to aspirational problems.')],
    },
    ...ARTERIAS.map((e) => ({ id: `id-${e}`, tipo: 'identificar', estructura: e, objetivo: 3, paso: 'arterias' })),
    { id: 'loc-a-lmd', tipo: 'localizar', estructura: 'a-lmd', candidatas: ['a-lsd', 'a-lid', 'v-lmd'], objetivo: 3, paso: 'arterias' },
    {
      id: 'rel-arterias-bronquios', tipo: 'relacion', objetivo: 3, paso: 'arterias', estructuras: ARTERIAS,
      enunciado: '¿Por dónde van las arterias segmentarias respecto a los bronquios segmentarios?',
      correcta: 'Pegadas a ellos, por su cara posterolateral',
      distractores: ['Entre los segmentos, lejos de los bronquios', 'Dentro de la pared de cada bronquio', 'Por debajo de la pleura, en la superficie del pulmón'],
      explicacion: 'Cada arteria segmentaria acompaña a su bronquio segmentario por el centro del segmento; las que van entre los segmentos son las venas.',
      evidencia: [W('Pulmonary_artery', 'Segmental arteries run together with segmental bronchi, at the posterolateral surfaces of the bronchi.'), W('Pulmonary_vein', 'They run between the pulmonary segments from which they drain the blood.')],
    },
    {
      id: 'rel-tronco-pulmonar', tipo: 'relacion', objetivo: 3, paso: 'arterias', estructuras: ['tronco-pulmonar'],
      enunciado: '¿Dónde se divide el tronco pulmonar en las dos arterias pulmonares?',
      correcta: 'Debajo del arco de la aorta, delante del bronquio principal izquierdo',
      distractores: ['Encima del arco de la aorta, junto a la tráquea', 'En el hilio de cada pulmón', 'Detrás del esófago, junto a la columna'],
      explicacion: 'El tronco sale del ventrículo derecho y se divide bajo el arco de la aorta; la arteria derecha cruza por debajo de la carina hacia el pulmón derecho.',
      evidencia: [W('Pulmonary_artery', 'The pulmonary trunk bifurcates into right and left pulmonary arteries below the arch of aorta and in front of the left main bronchus.'), W('Pulmonary_artery', 'The right pulmonary artery passes across the midline of the body, below the carina of trachea')],
    },
    ...VENAS.map((e) => ({ id: `id-${e}`, tipo: 'identificar', estructura: e, objetivo: 4, paso: 'venas' })),
    {
      id: 'rel-venas-segmentos', tipo: 'relacion', objetivo: 4, paso: 'venas', estructuras: VENAS,
      enunciado: '¿Por dónde corren las venas pequeñas del pulmón?',
      correcta: 'Entre los segmentos, sin seguir a los bronquios',
      distractores: ['Junto a los bronquios segmentarios, con las arterias', 'Por el centro de cada segmento', 'Por fuera de la pleura visceral'],
      explicacion: 'Las venas periféricas no siguen al árbol bronquial: corren entre los segmentos que drenan y se reúnen en las venas pulmonares principales.',
      evidencia: [W('Pulmonary_vein', 'The peripheral feeding veins do not follow the bronchial tree.'), W('Pulmonary_vein', 'They run between the pulmonary segments from which they drain the blood.')],
    },
    {
      id: 'fun-venas', tipo: 'funcion', objetivo: 4, paso: 'venas', estructuras: ['venas-pulmonares'],
      enunciado: '¿Qué sangre llevan las venas pulmonares y adónde?',
      correcta: 'Oxigenada, al atrio izquierdo',
      distractores: ['Pobre en oxígeno, al atrio derecho', 'Oxigenada, al ventrículo derecho', 'Pobre en oxígeno, al ventrículo izquierdo'],
      explicacion: 'Son la excepción de las venas: llevan sangre oxigenada en los alvéolos y la devuelven al atrio izquierdo.',
      evidencia: [W('Pulmonary_vein', 'The pulmonary veins play an essential role in respiration, by receiving blood that has been oxygenated in the alveoli and returning it to the left atrium.')],
    },
    {
      id: 'rel-cuantas-venas', tipo: 'relacion', objetivo: 4, paso: 'venas', estructuras: ['venas-pulmonares'],
      enunciado: '¿Cuántas venas pulmonares principales llegan normalmente al atrio izquierdo?',
      correcta: 'Cuatro: una superior y una inferior de cada pulmón',
      distractores: ['Dos: una de cada pulmón', 'Cinco: una por cada lóbulo', 'Seis: tres de cada pulmón'],
      explicacion: 'Lo habitual son cuatro, dos por pulmón. Varía de tres a cinco: las dos izquierdas se unen en una de cada cuatro personas.',
      evidencia: [W('Pulmonary_vein', 'There are four main pulmonary veins, two from each lung – an inferior and a superior main vein, emerging from each hilum.'), W('Pulmonary_vein', 'the number of pulmonary veins opening into the left atrium can vary between three and five in the healthy population.')],
    },
  ],
});
