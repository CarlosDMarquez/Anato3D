// Lección «El sistema linfático». Formato y evidencias: ../formato.js.
// Versión 2 (2026-11-12): el modelo ya tiene la cisterna del quilo, el conducto torácico, el conducto linfático derecho,
// los troncos y unos colectores esquemáticos entre los nodos (docs/hitos/09-sistema-linfatico.md). Se corrige el
// territorio del conducto torácico (todo el cuerpo salvo el cuadrante superior derecho, no «el lado izquierdo») y su
// desembocadura (el ángulo venoso). Los colectores solo salen como contexto: son trazados esquemáticos, no se evalúan.
import { leccion, W, GUIA, MODELO } from '../formato.js';

const LIN = 'Lymphatic_system';
const VAS = 'Lymphatic_vessel';
const TD = 'Thoracic_duct';
const CIS = 'Cisterna_chyli';
const VA = 'Venous_angle';
const O = (nombre, piezas, tipo, lado = 'impar', papel = 'nucleo', extra = {}) => ({ nombre, piezas, lado, papel, tipo, ...extra });

const TRONCOS = ['Jugular_trunk', 'Subclavian_trunk', 'Bronchomediastinal_trunk', 'Lumbar_trunk'].flatMap((p) => [`${p}_L`, `${p}_R`]);
const NODOS = ['cervicales', 'axilares', 'lumbares', 'inguinales'];
const CENTRAL = ['cisterna', 'conducto-toracico', 'conducto-derecho', 'troncos'];
const VENAS = ['subclavias', 'braquiocefalicas', 'yugulares'];

export default leccion({
  id: 'sis-linfatico',
  version: 2,
  titulo: 'El sistema linfático',
  resumen: 'Visión general: la linfa, los colectores, los nodos (ganglios) de las grandes regiones, los troncos, la cisterna del quilo y los dos conductos que devuelven la linfa a la sangre en el ángulo venoso, y los órganos linfoides (timo, bazo y amígdalas). No entra en los grupos de nodos de cada región: para eso están las lecciones regionales.',
  lugares: [],
  sistemas: ['linfatico'],
  formato: 'vision-general',
  temas: ['organos'],
  nivel: 1,
  minutos: 15,
  requisitos: ['sis-cardiovascular'],
  siguiente: ['cue-ganglios', 'ms-axila', 'tor-linfaticos', 'abd-linfaticos', 'mi-ganglios'],
  objetivos: [
    'Enumerar las partes del sistema linfático y explicar sus dos funciones principales.',
    'Describir el camino de la linfa: capilares, colectores, nodos, troncos y conductos hasta el ángulo venoso.',
    'Explicar qué territorio drena el conducto torácico y cuál el conducto linfático derecho.',
    'Localizar en el modelo la cisterna del quilo, el conducto torácico y los grandes grupos de nodos.',
    'Localizar el timo, el bazo y las amígdalas palatinas.',
  ],
  estructuras: {
    cervicales: O('Nodos cervicales profundos', ['Jugulodigastric_node', 'Lateral_superior_jugular_node', 'Anterior_inferior_jugular_nodes', 'Inferior_deep_lateral_cervical_nodes'], 'nodo', 'bilateral'),
    axilares: O('Nodos linfáticos axilares', ['Anterior_axillary_nodes', 'Apical_axillary_nodes', 'Central_axillary_nodes', 'Lateral_axillary_nodes', 'Posterior_axillary_nodes'], 'nodo', 'bilateral'),
    lumbares: O('Nodos lumbares (alrededor de la aorta y la cava)', ['Lateral_aortic_nodes', 'Pre_aortic_nodes', 'Lateral_caval_nodes', 'Intermediate_lumbar_nodes'], 'nodo'),
    inguinales: O('Nodos linfáticos inguinales superficiales', ['Inferior_superficial_inguinal_nodes', 'Superolateral_superficial_inguinal_nodes', 'Superomedial_superficial_inguinal_nodes'], 'nodo', 'bilateral'),
    cisterna: O('Cisterna del quilo', ['Cisterna_chyli'], 'linfatico', 'impar', 'nucleo', { confusiones: ['Vena cava inferior'] }),
    'conducto-toracico': O('Conducto torácico', ['Thoracic_duct'], 'linfatico', 'impar', 'nucleo', { confusiones: ['Vena ácigos'] }),
    'conducto-derecho': O('Conducto linfático derecho', ['Right_lymphatic_duct'], 'linfatico'),
    troncos: O('Troncos linfáticos (yugulares, subclavios, broncomediastínicos, lumbares e intestinales)', [...TRONCOS, 'Intestinal_trunks'], 'linfatico', 'exacto'),
    'colectores-mi': O('Colectores linfáticos del miembro inferior (esquemáticos)', ['Superficial_lymphatic_vessels_of_lower_limb', 'Deep_lymphatic_vessels_of_lower_limb'], 'linfatico', 'bilateral', 'contexto'),
    timo: O('Timo', ['Left_lobe_of_thymus', 'Right_lobe_of_thymus'], 'organo', 'impar', 'nucleo', { confusiones: ['Glándula tiroides', 'Pericardio'] }),
    bazo: O('Bazo', ['Spleen'], 'organo', 'impar', 'nucleo', { confusiones: ['Riñón izquierdo', 'Páncreas'] }),
    amigdala: O('Amígdala palatina', ['Palatine_tonsil'], 'organo', 'bilateral'),
    aorta: O('Aorta torácica y abdominal', ['Thoracic_aorta', 'Abdominal_aorta'], 'arteria', 'impar', 'contexto'),
    acigos: O('Vena ácigos', ['Azygos_vein'], 'vena', 'impar', 'contexto'),
    subclavias: O('Venas subclavias', ['Left_subclavian_vein', 'Right_subclavian_vein'], 'vena', 'impar', 'contexto'),
    braquiocefalicas: O('Venas braquiocefálicas', ['Left_brachiocephalic_vein', 'Right_brachiocephalic_vein'], 'vena', 'impar', 'contexto'),
    yugulares: O('Venas yugulares internas', ['Internal_jugular_vein'], 'vena', 'ambos', 'contexto'),
    'safena-magna': O('Vena safena magna', ['Great_saphenous_vein'], 'vena', 'bilateral', 'contexto'),
  },
  pasos: [
    {
      id: 'que-es', tipo: 'orientacion', titulo: 'Un sistema de drenaje y defensa',
      texto: [
        ['El sistema linfático forma parte del sistema inmunitario y complementa al circulatorio.', W(LIN, 'is part of the immune system and complementary to the circulatory system')],
        ['Lo forman una gran red de vasos linfáticos, los nodos linfáticos, los órganos y tejidos linfoides y la linfa.', W(LIN, 'It consists of a large network of lymphatic vessels, lymph nodes, lymphoid organs, lymphatic tissue and lymph.')],
        ['En el modelo están los nodos, los órganos linfoides, la cisterna del quilo, los conductos y los troncos, y unos colectores finos que unen los nodos; los capilares linfáticos no se representan.', MODELO],
        ['Mira el sistema entero de frente y de lado: el verde de los nodos y los colectores se reúne en el cuello, la axila, el abdomen y la ingle.', GUIA],
      ],
      vista: { capas: { skeletal: 'all', lymphatic: 'all' }, ver: [], contexto: [], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'Recorre el sistema linfático entero.', vistas: [{ nombre: 'De frente', camara: 'anterior' }, { nombre: 'De lado', camara: 'lateral' }, { nombre: 'Por detrás', camara: 'posterior' }] },
      comprobar: 'funciones',
    },
    {
      id: 'linfa', tipo: 'explicacion', titulo: 'De los tejidos a los nodos',
      texto: [
        ['El líquido que baña las células recoge desechos, bacterias y células dañadas y drena a los vasos linfáticos como linfa.', W(LIN, 'This fluid carries nutrients to the cells and collects waste products, bacteria, and damaged cells, before draining into the lymphatic vessels as lymph.')],
        ['La circulación linfática empieza en capilares linfáticos de extremo ciego, que desembocan en colectores más grandes con válvulas que impiden que la linfa retroceda.', W(VAS, 'begins with blind ending (closed at one end) highly permeable superficial lymph capillaries'), W(VAS, 'The lymph capillaries drain into larger collecting lymphatics.'), W(VAS, 'as well as valves to prevent the lymph from flowing backwards')],
        ['Los vasos que llevan la linfa a un nodo son aferentes, y los que salen de él, eferentes; un eferente puede ir a otro nodo o a uno de los conductos.', W(VAS, 'Lymph vessels that carry lymph to a lymph node are called afferent lymph vessels, and those that carry it from a lymph node are called efferent lymph vessels'), W(VAS, 'An efferent lymph vessel may directly drain into one of the (right or thoracic) lymph ducts, or may empty into another lymph node as its afferent lymph vessel.')],
        ['Los vasos finos que ves junto a la safena son colectores esquemáticos: unen los nodos según el drenaje que describen los manuales, pero no son vasos medidos en una persona ni dicen cuántos hay.', MODELO],
      ],
      vista: { ver: ['inguinales'], contexto: ['colectores-mi', 'safena-magna'], camara: 'anterior', lado: 'R' },
      comprobar: 'nodos-filtran',
    },
    {
      id: 'nodos', tipo: 'exploracion', titulo: 'Los nodos linfáticos',
      texto: [
        ['Un nodo linfático es un órgano con forma de riñón u ovalada, de 2 a 25 mm de largo.', W('Lymph_node', 'Lymph nodes are kidney or oval shaped and range in size from 2 mm to 25 mm on their long axis')],
        ['En su cara cóncava, el hilio, salen los vasos linfáticos y entran y salen los vasos sanguíneos.', W('Lymph_node', 'The hilum is an indent on the concave surface of the lymph node where lymphatic vessels leave and blood vessels enter and leave.')],
        ['Los vasos llevan la linfa por numerosos nodos, que filtran lo que sobra, como bacterias y células dañadas.', W(LIN, 'These vessels carry lymph throughout the body, passing through numerous lymph nodes, which filter out unwanted materials such as bacteria and damaged cells.')],
        ['Se agrupan en la raíz de los miembros (la ingle y la axila) y en el cuello, y abundan en el mediastino, la pelvis y junto a los vasos del intestino.', W(LIN, 'Lymph node clusters are commonly found at the proximal ends of limbs (e.g., groin or armpits) and in the neck'), W(LIN, 'Lymph nodes are particularly numerous in the mediastinum in the chest, neck, pelvis, axilla, groin (or inguinal region), and in association with the blood vessels of the intestines.')],
        ['Busca cuatro grandes grupos: los cervicales profundos, los axilares, los lumbares alrededor de la aorta y los inguinales.', GUIA],
      ],
      vista: { ver: NODOS, contexto: ['yugulares'], esqueleto: true, camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'axilares', texto: 'Toca los nodos linfáticos de la axila.' },
    },
    {
      id: 'via-central', tipo: 'exploracion', titulo: 'Cisterna del quilo y conducto torácico',
      texto: [
        ['La cisterna del quilo es un saco dilatado en el extremo inferior del conducto torácico, al que llegan el tronco intestinal y los dos troncos lumbares.', W(CIS, 'is a dilated sac at the lower end of the thoracic duct in most mammals into which lymph from the intestinal trunk and two lumbar lymphatic trunks flow')],
        ['Está detrás de la aorta abdominal, sobre los cuerpos de las vértebras L1 y L2.', W(CIS, 'In humans, the cisterna chyli is located posterior to the abdominal aorta on the anterior aspect of the bodies of the first and second lumbar vertebrae (L1 and L2).')],
        ['El conducto torácico nace de ella a la altura de T12, cruza el diafragma por el hiato aórtico y sube entre la aorta y la ácigos.', W(TD, 'The thoracic duct commences at the upper extremity of the cisterna chyli at the level of the T12 vertebra.'), W(TD, 'The thoracic duct traverses the diaphragm at the aortic hiatus to enter the posterior mediastinum.'), W(TD, 'It ascends the posterior mediastinum between the descending thoracic aorta (to its left) and the azygos vein (to its right)')],
        ['Hacia T5 cruza la línea media hacia la izquierda y sube hasta la raíz del cuello, a la altura de C7, antes de bajar a su desembocadura.', W(TD, 'It crosses the midline to the left side at about the T5 level, continuing to ascend.'), W(TD, 'reaching 2–3 cm superior to the clavicle, as high up as the C7 vertebral level.')],
        ['En el modelo son piezas generadas de trazado esquemático, y el cruce queda algo más bajo (T6–T5 en el hombre, T8–T7 en la mujer).', MODELO],
      ],
      detalle: [
        ['En el adulto mide de 38 a 45 cm y unos 5 mm de diámetro; lleva quilo, linfa con grasas emulsionadas.', W(TD, 'In adults, the thoracic duct is typically 38–45 cm in length and has an average diameter of about 5 mm.'), W(TD, 'The thoracic duct carries chyle, a liquid containing both lymph and emulsified fats, rather than pure lymph.')],
        ['Esta anatomía característica solo se da en alrededor de la mitad de las personas, y la cisterna falta en otra mitad: el modelo enseña la variante clásica.', W(TD, 'The characteristic anatomy of the thoracic duct is present in only about half of individuals.'), W(TD, 'A cisterna chyli is absent in about half of individuals'), MODELO],
      ],
      vista: { ver: ['cisterna', 'conducto-toracico'], contexto: ['acigos', 'subclavias', 'yugulares'], fantasma: ['aorta'], camara: 'anterolateral', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'conducto-toracico', texto: 'Sigue el conducto torácico desde la cisterna hasta el cuello y tócalo.' },
      comprobar: 'rel-cisterna',
    },
    {
      id: 'territorios', tipo: 'funcion', titulo: 'Dos conductos, dos territorios',
      texto: [
        ['El conducto torácico es el mayor de los dos y recoge la linfa de casi todo el cuerpo: todo salvo el lado derecho del tórax, el brazo derecho y el lado derecho de la cabeza y el cuello.', W(TD, 'is the larger of the two lymph ducts of the lymphatic system'), W(TD, 'It also collects most of the lymph in the body other than from the right thorax, arm, head, and neck')],
        ['Ese cuadrante superior derecho drena en el conducto linfático derecho.', W('Lymph_duct', 'The right lymphatic duct drains lymph from the right upper limb, right side of thorax and right halves of head and neck.')],
        ['Los dos vierten la linfa en el ángulo venoso de su lado, donde la yugular interna y la subclavia se unen para formar la braquiocefálica.', W(VA, 'The thoracic duct drains at the left venous angle, and the right lymphatic duct drains at the right venous angle.'), W(VA, 'is the junction where the ipsilateral internal jugular vein and subclavian vein unite to form the ipsilateral brachiocephalic vein.')],
        ['En el modelo, los troncos izquierdos acaban en el final del conducto torácico y los tres derechos forman un conducto linfático derecho corto: es una variante elegida para enseñar.', MODELO],
      ],
      detalle: [
        ['Los troncos derechos también pueden abrirse por separado en las venas; en el caso del broncomediastínico, eso es lo más frecuente.', W('Bronchomediastinal_trunk', 'more frequently, they open independently into the junction of the internal jugular vein and subclavian veins on their respective sides.')],
      ],
      vista: { ver: ['conducto-derecho', 'conducto-toracico', 'troncos'], contexto: VENAS, camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['conducto-toracico', 'conducto-derecho'], texto: 'Alterna los dos conductos y mira dónde termina cada uno.' },
      comprobar: 'conducto-toracico',
    },
    {
      id: 'organos', tipo: 'exploracion', titulo: 'Timo, bazo y amígdalas',
      texto: [
        ['El timo y la médula ósea son los órganos linfoides primarios: allí se producen y seleccionan los linfocitos.', W(LIN, 'The thymus and the bone marrow constitute the primary lymphoid organs involved in the production and early clonal selection of lymphocyte tissues.')],
        ['En el timo maduran los linfocitos T; está en la parte alta y anterior del tórax, detrás del esternón y delante del corazón.', W('Thymus', 'Within the thymus, T cells mature.'), W('Thymus', 'The thymus is located in the upper front part of the chest, in the anterior superior mediastinum, behind the sternum, and in front of the heart.')],
        ['El bazo, parecido a un gran nodo linfático, filtra sobre todo la sangre: retira los glóbulos rojos viejos y guarda una reserva de sangre.', W('Spleen', 'Similar in structure to a large lymph node, it acts primarily as a blood filter.'), W('Spleen', 'It removes old red blood cells and holds a reserve of blood')],
      ],
      vista: { ver: ['timo', 'bazo', 'amigdala'], contexto: [], esqueleto: true, camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['timo', 'bazo', 'amigdala'], texto: 'Alterna entre los tres órganos linfoides del modelo.' },
      comprobar: 'timo-funcion',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['Vasos, nodos, órganos y tejidos linfoides y la linfa: un sistema que drena líquido y defiende al cuerpo.', W(LIN, 'It consists of a large network of lymphatic vessels, lymph nodes, lymphoid organs, lymphatic tissue and lymph.'), W(LIN, 'The other main function is that of immune defense.')],
        ['Capilares, colectores con válvulas, nodos que filtran, troncos y conductos: la cisterna del quilo, sobre L1 y L2, da origen al conducto torácico.', W(VAS, 'The lymph capillaries drain into larger collecting lymphatics.'), W(LIN, 'passing through numerous lymph nodes, which filter out unwanted materials'), W(CIS, 'is a dilated sac at the lower end of the thoracic duct')],
        ['El conducto torácico recoge todo salvo el cuadrante superior derecho, que va al conducto linfático derecho; cada uno termina en el ángulo venoso de su lado.', W(TD, 'It also collects most of the lymph in the body other than from the right thorax, arm, head, and neck'), W(VA, 'The thoracic duct drains at the left venous angle, and the right lymphatic duct drains at the right venous angle.')],
        ['Timo: maduran los linfocitos T. Bazo: filtra la sangre.', W('Thymus', 'Within the thymus, T cells mature.'), W('Spleen', 'it acts primarily as a blood filter')],
      ],
    },
  ],
  preguntas: [
    {
      id: 'funciones', tipo: 'funcion', objetivo: 0, paso: 'que-es',
      enunciado: '¿De qué sistema forma parte el sistema linfático, además de complementar al circulatorio?',
      correcta: 'Del sistema inmunitario', distractores: ['Del sistema endocrino', 'Del sistema digestivo', 'Del sistema nervioso autónomo'],
      explicacion: 'Drena líquido y defiende al cuerpo: es parte del sistema inmunitario.',
      evidencia: [W(LIN, 'is part of the immune system and complementary to the circulatory system')],
    },
    {
      id: 'timo-funcion', tipo: 'funcion', objetivo: 0, paso: 'organos', estructuras: ['timo'],
      enunciado: '¿Qué ocurre en el timo?',
      correcta: 'Maduran los linfocitos T', distractores: ['Se filtran los glóbulos rojos viejos', 'Se produce la bilis', 'Se almacena el calcio'],
      explicacion: 'El timo es un órgano linfoide primario: allí maduran los linfocitos T. Filtrar glóbulos rojos viejos es cosa del bazo.',
      evidencia: [W('Thymus', 'Within the thymus, T cells mature.')],
    },
    {
      id: 'bazo-funcion', tipo: 'funcion', objetivo: 0, paso: 'organos', estructuras: ['bazo'],
      enunciado: '¿Qué hace principalmente el bazo?',
      correcta: 'Filtra la sangre y retira los glóbulos rojos viejos', distractores: ['Filtra la linfa del miembro inferior', 'Produce los linfocitos T', 'Devuelve la linfa a la sangre'],
      explicacion: 'Su estructura recuerda a la de un nodo linfático, pero filtra sangre, no linfa.',
      evidencia: [W('Spleen', 'it acts primarily as a blood filter'), W('Spleen', 'It removes old red blood cells')],
    },
    {
      id: 'nodos-filtran', tipo: 'funcion', objetivo: 1, paso: 'linfa', estructuras: ['inguinales'],
      enunciado: '¿Qué hacen los nodos linfáticos con la linfa que pasa por ellos?',
      correcta: 'La filtran: retienen bacterias y células dañadas', distractores: ['La convierten en sangre', 'La bombean hacia el corazón', 'La producen a partir de la sangre'],
      explicacion: 'Los vasos llevan la linfa por los nodos, que filtran lo que sobra.',
      evidencia: [W(LIN, 'passing through numerous lymph nodes, which filter out unwanted materials such as bacteria and damaged cells')],
    },
    {
      id: 'sec-camino', tipo: 'secuencia', objetivo: 1, paso: 'linfa',
      enunciado: 'Ordena el camino de la linfa desde los tejidos hasta la sangre:',
      orden: ['Capilares linfáticos de extremo ciego', 'Colectores con válvulas (vasos aferentes)', 'Nodo linfático', 'Conducto linfático', 'Ángulo venoso'],
      explicacion: 'Los capilares desembocan en colectores, que entran en los nodos como vasos aferentes; los eferentes van a otros nodos o a un conducto, y los conductos vierten en el ángulo venoso.',
      evidencia: [W(VAS, 'The lymph capillaries drain into larger collecting lymphatics.'), W(VAS, 'it becomes larger and eventually becomes an afferent lymph vessel as it enters a lymph node.'), W(VAS, 'An efferent lymph vessel may directly drain into one of the (right or thoracic) lymph ducts'), W(VA, 'The thoracic duct drains at the left venous angle, and the right lymphatic duct drains at the right venous angle.')],
    },
    {
      id: 'angulo-venoso', tipo: 'relacion', objetivo: 1, paso: 'territorios', estructuras: ['conducto-toracico', 'conducto-derecho'],
      enunciado: '¿Dónde vierten la linfa los dos conductos linfáticos?',
      correcta: 'En el ángulo venoso de su lado, la unión de la yugular interna y la subclavia', distractores: ['En la vena cava inferior', 'En el atrio derecho', 'En la vena porta'],
      explicacion: 'El conducto torácico termina en el ángulo venoso izquierdo y el linfático derecho en el derecho, donde la yugular interna y la subclavia forman la braquiocefálica.',
      evidencia: [W(VA, 'The thoracic duct drains at the left venous angle, and the right lymphatic duct drains at the right venous angle.'), W(VA, 'is the junction where the ipsilateral internal jugular vein and subclavian vein unite to form the ipsilateral brachiocephalic vein.')],
    },
    {
      id: 'conducto-toracico', tipo: 'relacion', objetivo: 2, paso: 'territorios', estructuras: ['conducto-toracico'],
      enunciado: '¿Qué drena el conducto torácico?',
      correcta: 'Todo el cuerpo salvo el miembro superior derecho y la mitad derecha de la cabeza, el cuello y el tórax',
      distractores: ['Solo el lado izquierdo del cuerpo', 'Solo el tórax', 'Solo los miembros inferiores y el abdomen'],
      explicacion: 'Recoge la linfa de casi todo el cuerpo, también de las dos piernas y del abdomen entero; solo el cuadrante superior derecho va al conducto linfático derecho.',
      evidencia: [W(TD, 'It also collects most of the lymph in the body other than from the right thorax, arm, head, and neck')],
    },
    {
      id: 'conducto-derecho', tipo: 'relacion', objetivo: 2, paso: 'territorios', estructuras: ['conducto-derecho'],
      enunciado: '¿Qué drena el conducto linfático derecho?',
      correcta: 'El miembro superior derecho y la mitad derecha de la cabeza, el cuello y el tórax',
      distractores: ['Todo el lado derecho del cuerpo, también la pierna derecha', 'Solo el pulmón derecho', 'El abdomen y la pelvis'],
      explicacion: 'Drena el cuadrante superior derecho; la pierna derecha, el abdomen y la pelvis van al conducto torácico.',
      evidencia: [W('Lymph_duct', 'The right lymphatic duct drains lymph from the right upper limb, right side of thorax and right halves of head and neck.')],
    },
    {
      id: 'rel-cisterna', tipo: 'relacion', objetivo: 3, paso: 'via-central', estructuras: ['cisterna'],
      enunciado: '¿Qué llega a la cisterna del quilo?',
      correcta: 'El tronco intestinal y los dos troncos lumbares', distractores: ['Los troncos yugulares', 'Los troncos subclavios', 'El conducto linfático derecho'],
      explicacion: 'La cisterna, detrás de la aorta sobre L1 y L2, recibe el tronco intestinal y los dos lumbares y se continúa con el conducto torácico.',
      evidencia: [W(CIS, 'into which lymph from the intestinal trunk and two lumbar lymphatic trunks flow'), W(CIS, 'located posterior to the abdominal aorta on the anterior aspect of the bodies of the first and second lumbar vertebrae')],
    },
    { id: 'id-conducto-toracico', tipo: 'identificar', estructura: 'conducto-toracico', objetivo: 3, paso: 'via-central' },
    { id: 'id-cisterna', tipo: 'identificar', estructura: 'cisterna', objetivo: 3, paso: 'via-central' },
    { id: 'loc-cisterna', tipo: 'localizar', estructura: 'cisterna', candidatas: ['conducto-derecho', 'lumbares', 'inguinales'], objetivo: 3, paso: 'via-central' },
    { id: 'loc-inguinales', tipo: 'localizar', estructura: 'inguinales', candidatas: ['axilares', 'cervicales', 'lumbares'], objetivo: 3, paso: 'nodos' },
    { id: 'id-cervicales', tipo: 'identificar', estructura: 'cervicales', objetivo: 3, paso: 'nodos' },
    { id: 'id-bazo', tipo: 'identificar', estructura: 'bazo', objetivo: 4, paso: 'organos' },
    { id: 'id-timo', tipo: 'identificar', estructura: 'timo', objetivo: 4, paso: 'organos' },
  ],
});
