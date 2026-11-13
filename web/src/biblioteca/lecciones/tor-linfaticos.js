// Lección «Nodos linfáticos del tórax». Formato y evidencias: ../formato.js.
// Parte del hueco del mediastino (docs/estudio/cobertura.md): los catorce grupos de nodos del tórax del modelo. Las
// fuentes describen bien los nodos de la pared (paraesternales, intercostales y diafragmáticos) y los del pulmón y la
// tráquea; de los demás grupos del mediastino (yuxtaesofágicos, pericárdicos, prevertebrales, braquiocefálicos y los
// nodos del arco de la ácigos y del ligamento arterioso) solo hay fuentes generales: la lección dice dónde están en el
// modelo, que es junto a la estructura que les da nombre. Versión 2 (2026-11-12): el modelo ya tiene el conducto
// torácico, el conducto linfático derecho y los troncos broncomediastínicos (piezas generadas, trazado esquemático,
// variante clásica: docs/hitos/09-sistema-linfatico.md); se enseñan en 3D en el mediastino posterior.
import { leccion, W, T, GUIA, MODELO } from '../formato.js';

const LIS = 'List_of_lymph_nodes_of_the_human_body';
const MED = 'thorax/areas/middle-mediastinum';
const POS = 'thorax/areas/posterior-mediastinum';
const TD = 'Thoracic_duct';
const nodos = (nombre, piezas, lado = 'impar', extra = {}) => ({ nombre, piezas, lado, papel: 'nucleo', tipo: 'nodo', ...extra });
const linfatico = (nombre, piezas, lado = 'impar', extra = {}) => ({ nombre, piezas, lado, papel: 'nucleo', tipo: 'linfatico', ...extra });
const contexto = (nombre, piezas, tipo, lado = 'impar') => ({ nombre, piezas, lado, papel: 'contexto', tipo });
const COSTILLAS = Array.from({ length: 12 }, (_, i) => `Rib_${i + 1}`);
const TORACICAS = Array.from({ length: 12 }, (_, i) => `Vertebra_T${i + 1}`);

const PARED = ['nodos-paraesternales', 'nodos-intercostales', 'nodos-diafragmaticos'];
const PULMON = ['nodos-intrapulmonares', 'nodos-traqueobronquiales-inferiores', 'nodos-traqueobronquiales-superiores', 'nodos-paratraqueales'];
const MEDIASTINO = ['nodos-yuxtaesofagicos', 'nodos-pericardicos', 'nodos-prevertebrales', 'nodos-braquiocefalicos', 'nodo-arco-acigos', 'nodo-ligamento-arterioso'];
const PULMONES = ['pulmon-derecho', 'pulmon-izquierdo'];
const CORAZON = ['corazon'];

export default leccion({
  id: 'tor-linfaticos',
  version: 2,
  titulo: 'Nodos linfáticos del tórax',
  resumen: 'Los nodos de la pared del tórax (paraesternales, intercostales y diafragmáticos), el camino de la linfa del pulmón hasta los nodos traqueobronquiales y paratraqueales, los demás grupos del mediastino, el recorrido del conducto torácico por el mediastino posterior, adónde va la linfa por él, por el conducto linfático derecho y por los troncos broncomediastínicos, y por qué estos nodos importan en las infecciones y los tumores.',
  lugares: [['torax', 'mediastino']],
  sistemas: ['linfatico'],
  formato: 'topografia',
  temas: ['organos'],
  nivel: 3,
  minutos: 18,
  requisitos: ['sis-linfatico', 'tor-mediastino'],
  siguiente: ['tor-segmentos', 'tor-pared-vasos'],
  objetivos: [
    'Localizar los nodos de la pared del tórax y decir qué drena cada grupo.',
    'Seguir el camino de la linfa del pulmón hasta los nodos traqueobronquiales y paratraqueales.',
    'Identificar los demás grupos de nodos del mediastino por la estructura que tienen al lado.',
    'Seguir el conducto torácico por el mediastino posterior y explicar adónde va la linfa del tórax: conducto torácico, conducto linfático derecho y troncos broncomediastínicos.',
    'Relacionar los nodos del tórax con la extensión de los tumores.',
  ],
  estructuras: {
    'nodos-paraesternales': nodos('Nodos paraesternales', ['Parasternal_nodes'], 'bilateral'),
    'nodos-intercostales': nodos('Nodos intercostales', ['Intercostal_nodes'], 'bilateral'),
    'nodos-diafragmaticos': nodos('Nodos diafragmáticos superiores', ['Superior_diaphragmatic_nodes']),
    'nodos-intrapulmonares': nodos('Nodos intrapulmonares', ['Intrapulmonary_nodes']),
    'nodos-traqueobronquiales-inferiores': nodos('Nodos traqueobronquiales inferiores', ['Inferior_tracheobronchial_nodes']),
    'nodos-traqueobronquiales-superiores': nodos('Nodos traqueobronquiales superiores', ['Superior_tracheobronchial_nodes']),
    'nodos-paratraqueales': nodos('Nodos paratraqueales', ['Paratracheal_thoracic_nodes']),
    'nodos-yuxtaesofagicos': nodos('Nodos yuxtaesofágicos', ['Juxta_oesophageal_nodes']),
    'nodos-pericardicos': nodos('Nodos pericárdicos laterales y prepericárdicos', ['Lateral_pericardial_nodes', 'Prepericardial_nodes']),
    'nodos-prevertebrales': nodos('Nodos prevertebrales', ['Prevertebral_nodes']),
    'nodos-braquiocefalicos': nodos('Nodos braquiocefálicos', ['Brachiocephalic_nodes']),
    'nodo-arco-acigos': nodos('Nodo del arco de la vena ácigos', ['Node_of_arch_of_azygos_vein']),
    'nodo-ligamento-arterioso': nodos('Nodo del ligamento arterioso', ['Node_of_ligamentum_arteriosum']),
    'conducto-toracico': linfatico('Conducto torácico', ['Thoracic_duct'], 'impar', { confusiones: ['Vena ácigos', 'Vena hemiácigos'] }),
    'troncos-broncomediastinicos': linfatico('Troncos broncomediastínicos', ['Bronchomediastinal_trunk'], 'ambos'),
    'conducto-derecho': linfatico('Conducto linfático derecho', ['Right_lymphatic_duct']),
    'colectores-mediastino': { ...linfatico('Colectores del mediastino (esquemáticos)', ['Lymphatic_vessels_of_mediastinum']), papel: 'contexto' },
    traquea: contexto('Tráquea', ['Trachea'], 'organo'),
    bronquios: contexto('Bronquios principales', ['Right_main_bronchus', 'Left_main_bronchus'], 'organo'),
    esofago: contexto('Esófago', ['Oesophagus'], 'organo'),
    corazon: contexto('Corazón', ['Right_atrium', 'Right_ventricle', 'Left_ventricle', 'Left_atrium'], 'corazon'),
    cayado: contexto('Arco de la aorta', ['Aortic_arch'], 'arteria'),
    'tronco-pulmonar': contexto('Tronco pulmonar', ['Pulmonary_trunk'], 'arteria'),
    'aorta-toracica': contexto('Aorta torácica', ['Thoracic_aorta'], 'arteria'),
    'toracica-interna': contexto('Arteria torácica interna', ['Internal_thoracic_artery'], 'arteria', 'bilateral'),
    'intercostales-arterias': contexto('Arterias intercostales posteriores', ['Posterior_intercostal_arteries'], 'arteria', 'bilateral'),
    braquiocefalicas: contexto('Venas braquiocefálicas', ['Right_brachiocephalic_vein', 'Left_brachiocephalic_vein'], 'vena'),
    subclavias: contexto('Venas subclavias', ['Left_subclavian_vein', 'Right_subclavian_vein'], 'vena'),
    yugulares: contexto('Venas yugulares internas', ['Internal_jugular_vein'], 'vena', 'ambos'),
    'cava-superior': contexto('Vena cava superior', ['Superior_vena_cava'], 'vena'),
    acigos: contexto('Vena ácigos', ['Azygos_vein'], 'vena'),
    diafragma: contexto('Diafragma', ['Diaphragm'], 'musculo'),
    'pulmon-derecho': contexto('Pulmón derecho', ['Superior_lobe_of_right_lung', 'Middle_lobe_of_right_lung', 'Inferior_lobe_of_right_lung'], 'organo'),
    'pulmon-izquierdo': contexto('Pulmón izquierdo', ['Superior_lobe_of_left_lung', 'Inferior_lobe_of_left_lung'], 'organo'),
    esternon: contexto('Esternón', ['Sternum_Manubrium', 'Sternum_Body', 'Sternum_Xiphoid_Process'], 'hueso'),
    costillas: contexto('Costillas', COSTILLAS, 'hueso', 'bilateral'),
    vertebras: contexto('Vértebras torácicas', TORACICAS, 'hueso'),
  },
  pasos: [
    {
      id: 'orientacion', tipo: 'orientacion', titulo: 'La linfa del tórax',
      texto: [
        ['Los pulmones tienen el mayor sistema de drenaje linfático de todos los órganos.', W('Lung', 'The lungs are supplied with the largest lymphatic drainage system of any other organ in the body.')],
        ['En el mediastino están los nodos linfáticos del centro del tórax, en varios grupos: sobre todo a lo largo de la tráquea, a lo largo del esófago y entre el pulmón y el diafragma.', W('Mediastinum', 'the thymus and the lymph nodes of the central chest.'), W(LIS, 'They consist of several lymph node groups, especially along the trachea (5 groups), along the esophagus and between the lung and the diaphragm.')],
        ['En el modelo, los nodos son piezas pequeñas: se ven mejor con los pulmones translúcidos y acercando la cámara.', MODELO],
        ['Gira el modelo y acércate a la tráquea y al esófago.', GUIA],
      ],
      vista: { ver: [...PULMON, ...MEDIASTINO], contexto: ['traquea', 'bronquios', 'esofago', 'cayado'], fantasma: [...PULMONES, ...CORAZON], camara: 'anterior' },
      actividad: { tipo: 'vistas', texto: 'Recorre los nodos del mediastino desde delante, la derecha y detrás.', vistas: [{ nombre: 'De frente', camara: 'anterior' }, { nombre: 'Por la derecha', camara: 'lateral' }, { nombre: 'Por detrás', camara: 'posterior' }] },
      comprobar: 'rel-grupos',
    },
    {
      id: 'pared', tipo: 'explicacion', titulo: 'Los nodos de la pared',
      texto: [
        ['Los paraesternales están en los extremos anteriores de los espacios intercostales, junto a la arteria torácica interna.', W('Parasternal_lymph_nodes', 'are placed at the anterior ends of the intercostal spaces, by the side of the internal thoracic artery.')],
        ['Reciben la linfa de la mama, de la pared anterior del abdomen por encima del ombligo, de la cara superior del hígado y de la pared anterior del tórax.', W('Parasternal_lymph_nodes', 'They derive afferents from the mamma; from the deeper structures of the anterior abdominal wall above the level of the umbilicus; from the upper surface of the liver')],
        ['Los intercostales ocupan la parte posterior de los espacios intercostales, junto a los vasos intercostales, y recogen la linfa profunda de la parte posterolateral del tórax.', W('Intercostal_lymph_nodes', 'occupy the posterior parts of the intercostal spaces, in relation to the intercostal vessels.'), W('Intercostal_lymph_nodes', 'They receive the deep lymphatics from the postero-lateral aspect of the chest')],
        ['Los diafragmáticos superiores están sobre la cara torácica del diafragma; los anteriores, detrás del xifoides, reciben linfa de la cara convexa del hígado.', W('Superior_diaphragmatic_lymph_nodes', 'The superior diaphragmatic lymph nodes lie on the thoracic aspect of the diaphragm'), W('Superior_diaphragmatic_lymph_nodes', 'two or three small nodes behind the base of the xiphoid process, which receive afferents from the convex surface of the liver')],
      ],
      detalle: [
        ['Los nodos diafragmáticos anteriores envían su linfa a los paraesternales.', W('Superior_diaphragmatic_lymph_nodes', 'The efferent vessels of the anterior set pass to the parasternal lymph nodes.')],
      ],
      vista: { ver: PARED, contexto: ['toracica-interna', 'intercostales-arterias', 'diafragma'], fantasma: ['costillas', 'esternon'], camara: 'anterolateral', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: PARED, texto: 'Alterna los tres grupos de la pared: delante, detrás y abajo.' },
      comprobar: 'rel-paraesternales',
    },
    {
      id: 'pulmon', tipo: 'explicacion', titulo: 'Del pulmón a la tráquea',
      texto: [
        ['La linfa del pulmón pasa por nodos segmentarios, lobares e interlobares hasta los nodos del hilio, y de ahí a los del mediastino.', W(LIS, 'The lymph is drained from the lung tissue through subsegmental, segmental, lobar and interlobar lymph nodes to the hilar lymph nodes'), W(LIS, 'The lymph flows subsequently to the mediastinal lymph nodes.')],
        ['Los nodos pulmonares están dentro del pulmón, sobre los bronquios grandes, y los broncopulmonares, en el hilio.', W('Tracheobronchial_lymph_nodes', 'Pulmonary nodes are embedded the lung substance on the larger branches of the bronchi.'), W('Tracheobronchial_lymph_nodes', 'Bronchopulmonary nodes (hilar nodes) situate in the hilum of each lung.')],
        ['Los traqueobronquiales superiores están a cada lado de la tráquea, justo antes de su división; los inferiores, debajo de la división, entre los dos bronquios.', W('Tracheobronchial_lymph_nodes', 'The two superior tracheobronchial nodes are located on either side of trachea just before its bifurcation.'), W('Tracheobronchial_lymph_nodes', 'The inferior tracheobronchial node is located just below the bifurcation in the angle between the two bronchi.')],
        ['Los paratraqueales están a cada lado de la tráquea.', W('Tracheobronchial_lymph_nodes', 'Paratracheal  nodes are located on either side of the trachea.')],
        ['El modelo no tiene los nodos broncopulmonares del hilio como pieza propia.', MODELO],
      ],
      vista: { ver: PULMON, contexto: ['traquea', 'bronquios'], fantasma: PULMONES, camara: 'anterior' },
      actividad: { tipo: 'localizar', estructura: 'nodos-traqueobronquiales-inferiores', texto: 'Toca los nodos que están en el ángulo entre los dos bronquios principales.' },
      comprobar: 'rel-traqueobronquiales',
    },
    {
      id: 'mediastino', tipo: 'relaciones', titulo: 'Otros grupos del mediastino',
      texto: [
        ['Además de los de la tráquea, el mediastino tiene nodos a lo largo del esófago, unidos a los del abdomen que acompañan al esófago y al estómago.', W(LIS, 'especially along the trachea (5 groups), along the esophagus'), W(LIS, 'The mediastinal lymph nodes along the esophagus are in tight connection with the abdominal lymph nodes along the esophagus and the stomach.')],
        ['La parte media del esófago drena en los nodos mediastínicos superiores y posteriores.', W('Oesophagus', 'the middle into the superior and posterior mediastinal lymph nodes')],
        ['El mediastino anterior tiene sobre todo tejido conectivo, grasa, vasos linfáticos y nodos.', T('thorax/areas/anterior-mediastinum', 'It primarily contains loose connective tissue, fat, lymphatic vessels, lymph nodes, and branches of the internal thoracic vessels.')],
        ['En el modelo, cada uno de estos grupos está junto a la estructura que le da nombre: el esófago, el pericardio, la columna, las venas braquiocefálicas, el arco de la ácigos y el ligamento arterioso.', MODELO],
      ],
      vista: { ver: MEDIASTINO, contexto: ['esofago', 'braquiocefalicas', 'cava-superior', 'acigos', 'cayado', 'tronco-pulmonar'], fantasma: [...CORAZON, 'vertebras'], camara: 'anterolateral', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: MEDIASTINO, texto: 'Alterna los seis grupos y busca la estructura que da nombre a cada uno.' },
      comprobar: 'rel-esofago',
    },
    {
      id: 'recorrido', tipo: 'relaciones', titulo: 'El conducto torácico en el mediastino posterior',
      texto: [
        ['El conducto torácico cruza el diafragma por el hiato aórtico y sube por el mediastino posterior entre la aorta torácica, a su izquierda, y la ácigos, a su derecha.', W(TD, 'The thoracic duct traverses the diaphragm at the aortic hiatus to enter the posterior mediastinum.'), W(TD, 'It ascends the posterior mediastinum between the descending thoracic aorta (to its left) and the azygos vein (to its right)')],
        ['A la altura de T7 está detrás del esófago; hacia T5 cruza la línea media hacia la izquierda y sigue por detrás de la aorta y a la izquierda del esófago.', W(TD, 'is situated posterior to the esophagus at the T7 vertebral level'), W(TD, 'It crosses the midline to the left side at about the T5 level'), W(TD, 'It then passes posterior to the aorta, and to the left of the oesophagus.')],
        ['En el mediastino superior queda detrás y a la izquierda del esófago, y sube hasta la raíz del cuello, a la altura de C7.', W(TD, 'In the superior mediastinum, the thoracic duct is situated posterior to and to the left of the esophagus.'), W(TD, 'as high up as the C7 vertebral level')],
        ['En el modelo es una pieza generada de trazado esquemático, y el cruce queda algo más bajo (T6–T5 en el hombre, T8–T7 en la mujer).', MODELO],
        ['Míralo desde atrás con las vértebras translúcidas y síguelo de abajo arriba.', GUIA],
      ],
      vista: { ver: ['conducto-toracico'], contexto: ['aorta-toracica', 'acigos', 'esofago'], fantasma: ['vertebras', 'diafragma'], camara: 'posterior' },
      actividad: { tipo: 'localizar', estructura: 'conducto-toracico', texto: 'Toca el conducto que sube entre la aorta y la ácigos.' },
      comprobar: 'rel-recorrido-conducto',
    },
    {
      id: 'conductos', tipo: 'funcion', titulo: 'Adónde va la linfa',
      texto: [
        ['La linfa de los nodos traqueobronquiales sube por la tráquea y forma los troncos broncomediastínicos derecho e izquierdo.', W('Tracheobronchial_lymph_nodes', 'Their efferent vessels ascend upon the trachea and unite with efferents of the internal mammary and anterior mediastinal glands to form the right and left bronchomediastinal trunks.')],
        ['El conducto torácico, el mayor de los dos conductos linfáticos, recoge la linfa de casi todo el cuerpo salvo el lado derecho del tórax, el brazo derecho y el lado derecho de la cabeza y el cuello.', W(TD, 'is the larger of the two lymph ducts of the lymphatic system'), W(TD, 'It also collects most of the lymph in the body other than from the right thorax, arm, head, and neck (which are drained by the right lymphatic duct).')],
        ['Los dos conductos vierten la linfa en el ángulo venoso: el torácico en el izquierdo y el linfático derecho en el derecho.', W('Venous_angle', 'The thoracic duct drains at the left venous angle, and the right lymphatic duct drains at the right venous angle.')],
        ['En el modelo, el tronco broncomediastínico izquierdo acaba en el final del conducto torácico y el derecho se une a los otros dos troncos derechos en un conducto linfático derecho corto: es una variante elegida para enseñar.', MODELO],
      ],
      detalle: [
        ['Lo más frecuente es que cada tronco broncomediastínico se abra por separado en la unión de la yugular interna y la subclavia de su lado.', W('Bronchomediastinal_trunk', 'more frequently, they open independently into the junction of the internal jugular vein and subclavian veins on their respective sides.')],
        ['Los nodos intercostales de los espacios superiores izquierdos van al conducto torácico; los derechos, al conducto linfático derecho.', W('Intercostal_lymph_nodes', 'The efferents of the glands in the upper spaces of the left side end in the thoracic duct; those of the corresponding right spaces, in the right lymphatic duct.')],
        ['En algunas personas, el conducto linfático derecho drena también el lóbulo inferior del pulmón izquierdo.', W('Right_lymphatic_duct', 'also, in some individuals, the lower lobe of the left lung.')],
        ['Si el conducto torácico se rompe, la linfa inunda la cavidad pleural: es el quilotórax.', W(TD, 'When the duct ruptures, the resulting flood of liquid into the pleural cavity is known as chylothorax.')],
      ],
      vista: { ver: ['troncos-broncomediastinicos', 'conducto-derecho', 'conducto-toracico'], contexto: ['traquea', 'braquiocefalicas', 'subclavias', 'yugulares'], fantasma: PULMONES, camara: 'anterior' },
      actividad: { tipo: 'comparar', estructuras: ['troncos-broncomediastinicos', 'conducto-derecho', 'conducto-toracico'], texto: 'Alterna los troncos broncomediastínicos y los dos conductos: mira dónde acaba cada uno.' },
      comprobar: 'rel-conducto-toracico',
    },
    {
      id: 'clinica', tipo: 'funcion', titulo: 'Por qué importan',
      texto: [
        ['Los nodos traqueobronquiales del mediastino medio suelen agrandarse en las enfermedades del pulmón.', T(MED, 'The tracheobronchial lymph nodes are located within the middle mediastinum.'), T(MED, 'are characteristically enlarged in certain lung pathologies.')],
        ['En el mediastino medio, unos nodos grandes pueden deberse a metástasis de un cáncer de pulmón.', W('Mediastinum', 'Middle mediastinum: lymphadenopathy, metastatic disease such as from small cell carcinoma from the lung.')],
        ['Por la unión de los nodos del esófago con los del abdomen, los cánceres de estómago y, sobre todo, de esófago se extienden con facilidad.', W(LIS, 'That fact facilitates spreading of tumor cells through these lymphatics in cases of cancers of the stomach and particularly of the esophagus.')],
      ],
      vista: { ver: ['nodos-traqueobronquiales-inferiores', 'nodos-traqueobronquiales-superiores', 'nodos-yuxtaesofagicos'], contexto: ['traquea', 'bronquios', 'esofago'], fantasma: PULMONES, camara: 'anterior' },
      comprobar: 'fun-cancer-esofago',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'Repaso',
      texto: [
        ['En la pared: paraesternales junto a la torácica interna, intercostales por detrás y diafragmáticos sobre el diafragma.', W('Parasternal_lymph_nodes', 'by the side of the internal thoracic artery.'), W('Intercostal_lymph_nodes', 'occupy the posterior parts of the intercostal spaces'), W('Superior_diaphragmatic_lymph_nodes', 'lie on the thoracic aspect of the diaphragm')],
        ['La linfa del pulmón pasa del pulmón al hilio y a los nodos de la tráquea, y sigue por los troncos broncomediastínicos.', W(LIS, 'to the hilar lymph nodes'), W('Tracheobronchial_lymph_nodes', 'to form the right and left bronchomediastinal trunks.')],
        ['El conducto torácico sube entre la aorta y la ácigos, detrás del esófago, y cruza a la izquierda hacia T5; recoge casi toda la linfa del cuerpo, y el linfático derecho, la del cuadrante superior derecho.', W(TD, 'It ascends the posterior mediastinum between the descending thoracic aorta (to its left) and the azygos vein (to its right)'), W(TD, 'It crosses the midline to the left side at about the T5 level'), W('Thoracic_duct', 'It also collects most of the lymph in the body other than from the right thorax, arm, head, and neck'), W('Right_lymphatic_duct', 'is an important lymphatic vessel that drains the right upper quadrant of the human body.')],
      ],
    },
  ],
  preguntas: [
    {
      id: 'rel-grupos', tipo: 'relacion', objetivo: 2, paso: 'orientacion',
      enunciado: '¿A lo largo de qué estructuras se reúnen sobre todo los nodos del mediastino?',
      correcta: 'La tráquea, el esófago y el espacio entre el pulmón y el diafragma',
      distractores: ['Las costillas y los cartílagos costales', 'La aorta ascendente y las coronarias', 'El esternón y las clavículas'],
      explicacion: 'Los nodos mediastínicos forman varios grupos, sobre todo a lo largo de la tráquea, a lo largo del esófago y entre el pulmón y el diafragma.',
      evidencia: [W(LIS, 'They consist of several lymph node groups, especially along the trachea (5 groups), along the esophagus and between the lung and the diaphragm.')],
    },
    { id: 'id-nodos-paraesternales', tipo: 'identificar', estructura: 'nodos-paraesternales', objetivo: 0, paso: 'pared' },
    { id: 'id-nodos-intercostales', tipo: 'identificar', estructura: 'nodos-intercostales', objetivo: 0, paso: 'pared' },
    { id: 'id-nodos-diafragmaticos', tipo: 'identificar', estructura: 'nodos-diafragmaticos', objetivo: 0, paso: 'pared' },
    {
      id: 'rel-paraesternales', tipo: 'relacion', objetivo: 0, paso: 'pared', estructuras: ['nodos-paraesternales'],
      enunciado: '¿De dónde reciben linfa los nodos paraesternales?',
      correcta: 'De la mama, la pared abdominal sobre el ombligo y la cara superior del hígado',
      distractores: ['Del pulmón y de los bronquios', 'Del esófago y del estómago', 'De la parte posterolateral del tórax'],
      explicacion: 'Están junto a la arteria torácica interna y reciben la linfa de la mama, de la pared anterior del abdomen por encima del ombligo, de la cara superior del hígado y de la pared anterior del tórax. La parte posterolateral drena en los intercostales.',
      evidencia: [W('Parasternal_lymph_nodes', 'They derive afferents from the mamma; from the deeper structures of the anterior abdominal wall above the level of the umbilicus; from the upper surface of the liver'), W('Intercostal_lymph_nodes', 'They receive the deep lymphatics from the postero-lateral aspect of the chest')],
    },
    {
      id: 'comp-pared', tipo: 'comparacion', objetivo: 0, paso: 'pared', estructuras: ['nodos-paraesternales', 'nodos-intercostales'],
      enunciado: '¿En qué se diferencian los nodos paraesternales y los intercostales?',
      correcta: 'Los paraesternales están delante, junto al esternón; los intercostales, en la parte posterior de los espacios',
      distractores: ['Los paraesternales están detrás, junto a la columna; los intercostales, delante', 'Los dos están dentro del pulmón', 'Los paraesternales están sobre el diafragma; los intercostales, en el cuello'],
      explicacion: 'Los paraesternales ocupan los extremos anteriores de los espacios intercostales, junto a la torácica interna; los intercostales, sus partes posteriores, junto a los vasos intercostales.',
      evidencia: [W('Parasternal_lymph_nodes', 'are placed at the anterior ends of the intercostal spaces, by the side of the internal thoracic artery.'), W('Intercostal_lymph_nodes', 'occupy the posterior parts of the intercostal spaces, in relation to the intercostal vessels.')],
    },
    {
      id: 'rel-diafragmaticos', tipo: 'relacion', objetivo: 0, paso: 'pared', estructuras: ['nodos-diafragmaticos'],
      enunciado: '¿De qué órgano del abdomen reciben linfa los nodos diafragmáticos anteriores, detrás del xifoides?',
      correcta: 'Del hígado, de su cara convexa',
      distractores: ['Del estómago', 'Del bazo', 'Del riñón derecho'],
      explicacion: 'Los nodos diafragmáticos anteriores, detrás del xifoides, reciben linfa de la cara convexa del hígado y la envían a los paraesternales.',
      evidencia: [W('Superior_diaphragmatic_lymph_nodes', 'two or three small nodes behind the base of the xiphoid process, which receive afferents from the convex surface of the liver'), W('Superior_diaphragmatic_lymph_nodes', 'The efferent vessels of the anterior set pass to the parasternal lymph nodes.')],
    },
    { id: 'id-nodos-intrapulmonares', tipo: 'identificar', estructura: 'nodos-intrapulmonares', objetivo: 1, paso: 'pulmon' },
    { id: 'id-nodos-traqueobronquiales-inferiores', tipo: 'identificar', estructura: 'nodos-traqueobronquiales-inferiores', objetivo: 1, paso: 'pulmon' },
    { id: 'id-nodos-traqueobronquiales-superiores', tipo: 'identificar', estructura: 'nodos-traqueobronquiales-superiores', objetivo: 1, paso: 'pulmon' },
    { id: 'id-nodos-paratraqueales', tipo: 'identificar', estructura: 'nodos-paratraqueales', objetivo: 1, paso: 'pulmon' },
    { id: 'loc-traqueobronquiales-inferiores', tipo: 'localizar', estructura: 'nodos-traqueobronquiales-inferiores', candidatas: ['nodos-traqueobronquiales-superiores', 'nodos-paratraqueales', 'nodos-intrapulmonares'], objetivo: 1, paso: 'pulmon' },
    {
      id: 'rel-traqueobronquiales', tipo: 'relacion', objetivo: 1, paso: 'pulmon', estructuras: ['nodos-traqueobronquiales-inferiores', 'nodos-traqueobronquiales-superiores'],
      enunciado: '¿Dónde están los nodos traqueobronquiales inferiores?',
      correcta: 'Debajo de la división de la tráquea, entre los dos bronquios principales',
      distractores: ['A cada lado de la tráquea, antes de su división', 'Dentro del pulmón, sobre los bronquios grandes', 'Detrás del esófago, junto a la aorta'],
      explicacion: 'Los inferiores están en el ángulo entre los dos bronquios, debajo de la división de la tráquea; los superiores, a cada lado de la tráquea justo antes de dividirse, y los pulmonares, dentro del pulmón.',
      evidencia: [W('Tracheobronchial_lymph_nodes', 'The inferior tracheobronchial node is located just below the bifurcation in the angle between the two bronchi.'), W('Tracheobronchial_lymph_nodes', 'The two superior tracheobronchial nodes are located on either side of trachea just before its bifurcation.'), W('Tracheobronchial_lymph_nodes', 'Pulmonary nodes are embedded the lung substance on the larger branches of the bronchi.')],
    },
    {
      id: 'sec-linfa-pulmon', tipo: 'secuencia', objetivo: 1, paso: 'pulmon', estructuras: ['nodos-intrapulmonares', 'nodos-traqueobronquiales-inferiores'],
      enunciado: 'Ordena el camino de la linfa del pulmón:',
      orden: ['Nodos segmentarios y lobares del pulmón', 'Nodos del hilio', 'Nodos del mediastino, junto a la tráquea', 'Troncos broncomediastínicos'],
      explicacion: 'La linfa va de los nodos del interior del pulmón a los del hilio y de ahí a los del mediastino, junto a la tráquea; sus vasos eferentes forman los troncos broncomediastínicos.',
      evidencia: [W(LIS, 'The lymph is drained from the lung tissue through subsegmental, segmental, lobar and interlobar lymph nodes to the hilar lymph nodes'), W(LIS, 'The lymph flows subsequently to the mediastinal lymph nodes.'), W('Tracheobronchial_lymph_nodes', 'to form the right and left bronchomediastinal trunks.')],
    },
    { id: 'id-nodos-yuxtaesofagicos', tipo: 'identificar', estructura: 'nodos-yuxtaesofagicos', objetivo: 2, paso: 'mediastino' },
    { id: 'id-nodos-pericardicos', tipo: 'identificar', estructura: 'nodos-pericardicos', objetivo: 2, paso: 'mediastino' },
    { id: 'id-nodos-prevertebrales', tipo: 'identificar', estructura: 'nodos-prevertebrales', objetivo: 2, paso: 'mediastino' },
    { id: 'id-nodos-braquiocefalicos', tipo: 'identificar', estructura: 'nodos-braquiocefalicos', objetivo: 2, paso: 'mediastino' },
    { id: 'id-nodo-arco-acigos', tipo: 'identificar', estructura: 'nodo-arco-acigos', objetivo: 2, paso: 'mediastino' },
    { id: 'id-nodo-ligamento-arterioso', tipo: 'identificar', estructura: 'nodo-ligamento-arterioso', objetivo: 2, paso: 'mediastino' },
    {
      id: 'rel-esofago', tipo: 'relacion', objetivo: 2, paso: 'mediastino', estructuras: ['nodos-yuxtaesofagicos', 'esofago'],
      enunciado: '¿A qué nodos drena la parte media del esófago?',
      correcta: 'A los mediastínicos superiores y posteriores',
      distractores: ['A los cervicales profundos', 'A los gástricos y celíacos', 'A los paraesternales'],
      explicacion: 'El tercio superior del esófago drena en los cervicales profundos, el medio en los mediastínicos superiores y posteriores, y el inferior en los gástricos y celíacos.',
      evidencia: [W('Oesophagus', 'Lymphatically, the upper third of the esophagus drains into the deep cervical lymph nodes, the middle into the superior and posterior mediastinal lymph nodes, and the lower esophagus into the gastric and celiac lymph nodes.')],
    },
    {
      id: 'rel-conducto-toracico', tipo: 'relacion', objetivo: 3, paso: 'conductos',
      enunciado: '¿De qué partes del cuerpo no recoge linfa el conducto torácico?',
      correcta: 'Del lado derecho del tórax, el brazo derecho y el lado derecho de la cabeza y el cuello',
      distractores: ['De las piernas y la pelvis', 'Del abdomen y del intestino', 'Del lado izquierdo de la cabeza y el cuello'],
      explicacion: 'El conducto torácico recoge casi toda la linfa del cuerpo; la del cuadrante superior derecho la lleva el conducto linfático derecho.',
      evidencia: [W('Thoracic_duct', 'It also collects most of the lymph in the body other than from the right thorax, arm, head, and neck (which are drained by the right lymphatic duct).')],
    },
    {
      id: 'rel-recorrido-conducto', tipo: 'relacion', objetivo: 3, paso: 'recorrido', estructuras: ['conducto-toracico', 'aorta-toracica', 'acigos'],
      enunciado: '¿Entre qué dos vasos sube el conducto torácico por el mediastino posterior?',
      correcta: 'Entre la aorta torácica, a su izquierda, y la ácigos, a su derecha',
      distractores: ['Entre la cava superior y la aorta ascendente', 'Entre las dos venas braquiocefálicas', 'Entre la aorta, a su derecha, y la hemiácigos, a su izquierda'],
      explicacion: 'Sube por el mediastino posterior entre la aorta torácica y la ácigos, por detrás del esófago a la altura de T7, y termina en el ángulo venoso.',
      evidencia: [W('Thoracic_duct', 'It ascends the posterior mediastinum between the descending thoracic aorta (to its left) and the azygos vein (to its right), and is situated posterior to the esophagus at the T7 vertebral level.')],
    },
    { id: 'id-conducto-toracico', tipo: 'identificar', estructura: 'conducto-toracico', objetivo: 3, paso: 'recorrido' },
    { id: 'loc-conducto-toracico', tipo: 'localizar', estructura: 'conducto-toracico', candidatas: ['nodos-prevertebrales', 'nodos-yuxtaesofagicos', 'troncos-broncomediastinicos'], objetivo: 3, paso: 'recorrido' },
    { id: 'id-troncos-broncomediastinicos', tipo: 'identificar', estructura: 'troncos-broncomediastinicos', objetivo: 3, paso: 'conductos' },
    {
      id: 'rel-cruce', tipo: 'relacion', objetivo: 3, paso: 'recorrido', estructuras: ['conducto-toracico', 'esofago'],
      enunciado: '¿Hacia qué nivel cruza el conducto torácico la línea media para pasar a la izquierda?',
      correcta: 'Hacia la vértebra T5', distractores: ['En T12, al cruzar el hiato aórtico', 'En C7, en la raíz del cuello', 'En L2, junto a la cisterna del quilo'],
      explicacion: 'Sube a la derecha de la línea media entre la aorta y la ácigos y cruza a la izquierda hacia T5; en el modelo el cruce queda algo más bajo, así que el nivel lo da la fuente, no la pieza.',
      evidencia: [W(TD, 'It crosses the midline to the left side at about the T5 level, continuing to ascend.')],
    },
    {
      id: 'rel-troncos', tipo: 'relacion', objetivo: 3, paso: 'conductos', estructuras: ['nodos-traqueobronquiales-superiores', 'troncos-broncomediastinicos'],
      enunciado: '¿Qué forman los vasos que salen de los nodos traqueobronquiales?',
      correcta: 'Los troncos broncomediastínicos derecho e izquierdo',
      distractores: ['El conducto torácico', 'La cisterna del quilo', 'Los troncos yugulares'],
      explicacion: 'Sus eferentes suben por la tráquea y, con los de los nodos paraesternales y mediastínicos anteriores, forman los troncos broncomediastínicos.',
      evidencia: [W('Tracheobronchial_lymph_nodes', 'Their efferent vessels ascend upon the trachea and unite with efferents of the internal mammary and anterior mediastinal glands to form the right and left bronchomediastinal trunks.')],
    },
    {
      id: 'fun-cancer-esofago', tipo: 'funcion', objetivo: 4, paso: 'clinica', estructuras: ['nodos-yuxtaesofagicos'],
      enunciado: '¿Por qué el cáncer de esófago se extiende con facilidad hacia el abdomen?',
      correcta: 'Porque los nodos que rodean el esófago están unidos a los del abdomen',
      distractores: ['Porque el esófago no tiene nodos linfáticos', 'Porque su linfa va directa a los pulmones', 'Porque el conducto torácico baja por delante del esófago'],
      explicacion: 'Los nodos del mediastino que acompañan al esófago están muy unidos a los del abdomen que siguen al esófago y al estómago, y las células tumorales se extienden por ellos.',
      evidencia: [W(LIS, 'The mediastinal lymph nodes along the esophagus are in tight connection with the abdominal lymph nodes along the esophagus and the stomach.'), W(LIS, 'That fact facilitates spreading of tumor cells through these lymphatics in cases of cancers of the stomach and particularly of the esophagus.')],
    },
    {
      id: 'rel-pulmon-enfermo', tipo: 'relacion', objetivo: 4, paso: 'clinica', estructuras: ['nodos-traqueobronquiales-inferiores'],
      enunciado: '¿Qué nodos del mediastino medio suelen agrandarse en las enfermedades del pulmón?',
      correcta: 'Los traqueobronquiales',
      distractores: ['Los paraesternales', 'Los diafragmáticos superiores', 'Los intercostales'],
      explicacion: 'Los traqueobronquiales, en el mediastino medio, reciben la linfa de los pulmones y suelen agrandarse en sus enfermedades, también por metástasis de un cáncer de pulmón.',
      evidencia: [T(MED, 'The tracheobronchial lymph nodes are located within the middle mediastinum.'), T(MED, 'are characteristically enlarged in certain lung pathologies.'), W('Mediastinum', 'Middle mediastinum: lymphadenopathy, metastatic disease such as from small cell carcinoma from the lung.')],
    },
  ],
});
