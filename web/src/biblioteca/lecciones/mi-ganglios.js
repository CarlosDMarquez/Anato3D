// Lección «Nodos inguinales y poplíteos: el drenaje del miembro inferior». Formato y evidencias: ../formato.js.
// Escrita el 2026-11-12, con los nodos inguinales profundos y los lacunares que el modelo incorporó ese día y sus
// colectores esquemáticos (docs/hitos/09-sistema-linfatico.md). Defectos conocidos del modelo que la lección evita:
// el nodo inguinal profundo intermedio queda delante de la vena femoral y no por dentro de ella (la relación se enseña
// con la fuente, no con la pieza), y el tibial anterior queda dentro del músculo (los nodos de la pierna no se usan).
// Testículo y ovario no se muestran: solo se cita adónde va su linfa.
import { leccion, W, GUIA, MODELO } from '../formato.js';

const ING = 'Inguinal_lymph_nodes';
const POP = 'Popliteal_lymph_nodes';
const FT = 'Femoral_triangle';
const EIL = 'External_iliac_lymph_nodes';
const nodos = (nombre, piezas, lado = 'bilateral', extra = {}) => ({ nombre, piezas, lado, papel: 'nucleo', tipo: 'nodo', ...extra });
const contexto = (nombre, piezas, tipo, lado = 'bilateral') => ({ nombre, piezas, lado, papel: 'contexto', tipo });

const SUPERFICIALES = ['inguinales-superolaterales', 'inguinales-superomediales', 'inguinales-inferiores'];
const POPLITEOS = ['popliteos-superficiales', 'popliteos-profundos'];

export default leccion({
  id: 'mi-ganglios',
  version: 1,
  titulo: 'Nodos inguinales y poplíteos: el drenaje del miembro inferior',
  resumen: 'Los nodos inguinales superficiales y sus tres grupos junto al final de la safena magna, los inguinales profundos junto a la vena femoral, los poplíteos, los colectores superficiales y profundos del miembro inferior y el paso a los ilíacos externos; y una distinción que se confunde a menudo: la piel del escroto o de la vulva drena a los inguinales, pero el testículo y el ovario, a los lumbares.',
  lugares: [['miembro-inferior', 'muslo'], ['miembro-inferior', 'rodilla']],
  sistemas: ['linfatico'],
  formato: 'topografia',
  temas: ['organos'],
  nivel: 2,
  minutos: 16,
  requisitos: ['sis-linfatico', 'mi-vasos'],
  siguiente: ['pel-nervios-linfaticos', 'abd-linfaticos'],
  objetivos: [
    'Localizar los tres grupos de nodos inguinales superficiales respecto al ligamento inguinal y al hiato safeno.',
    'Distinguir los nodos inguinales superficiales de los profundos por su situación y por lo que drenan.',
    'Seguir la linfa de la pierna por los colectores superficiales y profundos hasta los nodos poplíteos e inguinales.',
    'Ordenar el paso de la linfa de los inguinales profundos a los ilíacos externos y los lumbares.',
    'Diferenciar el drenaje de la piel del escroto o de la vulva del drenaje del testículo y del ovario.',
  ],
  estructuras: {
    'inguinales-superolaterales': nodos('Nodos inguinales superficiales superolaterales', ['Superolateral_superficial_inguinal_nodes']),
    'inguinales-superomediales': nodos('Nodos inguinales superficiales superomediales', ['Superomedial_superficial_inguinal_nodes']),
    'inguinales-inferiores': nodos('Nodos inguinales superficiales inferiores', ['Inferior_superficial_inguinal_nodes']),
    'inguinales-profundos': nodos('Nodos inguinales profundos', ['Proximal_deep_inguinal_node', 'Intermediate_deep_inguinal_node']),
    'popliteos-superficiales': nodos('Nodos poplíteos superficiales', ['Superficial_popliteal_nodes']),
    'popliteos-profundos': nodos('Nodos poplíteos profundos', ['Deep_popliteal_nodes']),
    'iliacos-externos': nodos('Nodos ilíacos externos y lacunares', ['Medial_external_iliac_nodes', 'Intermediate_external_iliac_nodes', 'Medial_lacunar_node', 'Intermediate_lacunar_node', 'Lateral_lacunar_node']),
    'colectores-superficiales': { nombre: 'Colectores superficiales del miembro inferior (esquemáticos)', piezas: ['Superficial_lymphatic_vessels_of_lower_limb'], lado: 'bilateral', papel: 'contexto', tipo: 'linfatico' },
    'colectores-profundos': { nombre: 'Colectores profundos del miembro inferior (esquemáticos)', piezas: ['Deep_lymphatic_vessels_of_lower_limb'], lado: 'bilateral', papel: 'contexto', tipo: 'linfatico' },
    'safena-magna': contexto('Vena safena magna', ['Great_saphenous_vein'], 'vena'),
    'safena-menor': contexto('Vena safena menor', ['Small_saphenous_vein'], 'vena'),
    'vena-femoral': contexto('Vena femoral', ['Femoral_vein'], 'vena'),
    'arteria-femoral': contexto('Arteria femoral', ['Femoral_artery'], 'arteria'),
    'vena-poplitea': contexto('Vena poplítea', ['Popliteal_vein'], 'vena'),
    'arteria-poplitea': contexto('Arteria poplítea', ['Popliteal_artery'], 'arteria'),
    'iliaca-externa': contexto('Vena ilíaca externa', ['External_iliac_vein'], 'vena'),
    'ligamento-inguinal': contexto('Ligamento inguinal', ['Inguinal_ligament'], 'ligamento'),
    sartorio: contexto('Músculo sartorio', ['Sartorius_muscle'], 'musculo'),
    'aductor-largo': contexto('Aductor largo', ['Adductor_longus'], 'musculo'),
  },
  pasos: [
    {
      id: 'orientacion', tipo: 'orientacion', titulo: 'La ingle recoge la pierna',
      texto: [
        ['Los nodos se agrupan en la raíz de los miembros, como la ingle, donde llega la linfa de zonas que se hieren con facilidad.', W('Lymphatic_system', 'Lymph node clusters are commonly found at the proximal ends of limbs (e.g., groin or armpits) and in the neck, where lymph is collected from body regions likely to sustain pathogen contamination from injuries.')],
        ['Los nodos inguinales están en el triángulo femoral y se dividen en superficiales y profundos.', W(ING, 'They are situated in the femoral triangle of the inguinal region.'), W(ING, 'They are subdivided into two groups: the superficial inguinal lymph nodes and deep inguinal lymph nodes.')],
        ['En el modelo, los colectores son trazados esquemáticos que salen del tobillo junto a las venas y unen los grupos de nodos; no son vasos medidos ni dicen cuántos hay.', MODELO],
        ['Mira la pierna de frente para la ingle y por detrás para la rodilla.', GUIA],
      ],
      vista: { ver: [...SUPERFICIALES, 'inguinales-profundos', ...POPLITEOS], contexto: ['colectores-superficiales', 'safena-magna'], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'Recorre los nodos del miembro inferior.', vistas: [{ nombre: 'De frente', camara: 'anterior' }, { nombre: 'Por dentro', camara: 'medial' }, { nombre: 'Por detrás', camara: 'posterior' }] },
    },
    {
      id: 'superficiales', tipo: 'exploracion', titulo: 'Los inguinales superficiales',
      texto: [
        ['Forman una cadena justo por debajo del ligamento inguinal, entre el sartorio por fuera y el aductor largo por dentro; suelen ser unos diez.', W(ING, 'The superficial inguinal lymph nodes are the inguinal lymph nodes that form a chain immediately inferior to the inguinal ligament.'), W(ING, 'laterally by the border of the sartorius muscle, and medially by the adductor longus muscle.'), W(ING, 'There are approximately 10 superficial lymph nodes.')],
        ['Están en la fascia superficial del triángulo femoral, junto a la parte alta de la safena magna.', W(FT, 'The superficial fascia contains the superficial inguinal lymph nodes'), W(FT, 'and upper part of the great saphenous vein.')],
        ['Se agrupan alrededor del hiato safeno: los inferiores, por debajo; los superolaterales, a su lado, y los superomediales, en la parte media.', W(ING, 'inferior – inferior of the saphenous opening of the leg'), W(ING, 'superolateral – on the side of the saphenous opening'), W(ING, 'superomedial – located at the middle of the saphenous opening')],
      ],
      vista: { ver: SUPERFICIALES, contexto: ['ligamento-inguinal', 'safena-magna', 'vena-femoral'], fantasma: ['sartorio', 'aductor-largo'], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: SUPERFICIALES, texto: 'Alterna los tres grupos alrededor del final de la safena magna.' },
      comprobar: 'rel-limites',
    },
    {
      id: 'territorios', tipo: 'funcion', titulo: 'Qué drenan los superficiales',
      texto: [
        ['Los inferiores reciben la linfa de la pierna; los superolaterales, de la parte lateral de la nalga y de la pared abdominal baja, y los superomediales, del periné y los genitales.', W(ING, 'receive drainage from lower legs'), W(ING, 'receive drainage from the side buttocks and the lower abdominal wall.'), W(ING, 'take drainage from the perineum and genitals.')],
        ['También les llega la pared abdominal por debajo del ombligo, la espalda por debajo de la cresta ilíaca y el ano por debajo de la línea pectínea.', W(ING, 'abdominal wall below the level of the umbilicus'), W(ING, 'back below the level of the iliac crest'), W(ING, 'anus (below the pectinate line)')],
        ['Su linfa va a los inguinales profundos.', W(ING, 'They drain to the deep inguinal lymph nodes.')],
      ],
      vista: { ver: SUPERFICIALES, contexto: ['colectores-superficiales', 'safena-magna', 'ligamento-inguinal'], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'inguinales-inferiores', texto: 'Toca el grupo que recibe la linfa de la pierna, por debajo del hiato safeno.' },
      comprobar: 'fun-territorio',
    },
    {
      id: 'profundos', tipo: 'relaciones', titulo: 'Los inguinales profundos',
      texto: [
        ['Los inguinales profundos son de tres a cinco y están por dentro de la vena femoral, bajo la fascia cribiforme, en el conducto femoral.', W(ING, 'The deep inguinal lymph nodes are 3-5 in number.'), W(ING, 'They lie medial to the femoral vein deep to the cribriform fascia.'), W(FT, 'medial to the upper part of the femoral vein, inside the femoral canal')],
        ['Reciben la linfa de los superficiales, del glande del pene o del clítoris y de los linfáticos profundos del miembro inferior.', W(FT, 'It receives lymphatic drainage from superficial inguinal lymph nodes, lymphatic drainage from the glans penis or clitoris, and from the deep lymphatics of the lower limb.')],
        ['El más alto, bajo el ligamento inguinal, es el nodo de Cloquet, que también puede contarse como el más bajo de los ilíacos externos.', W(ING, "The superior-most node is situated in the groin, deep to the inguinal ligament, and is termed the Cloquet's node"), W(ING, 'It can instead be considered as the inferior-most of the external iliac lymph nodes.')],
        ['En el modelo, el nodo inguinal profundo intermedio queda delante de la vena femoral y no por dentro de ella: para esa relación fíate de la fuente, no de la pieza.', MODELO],
      ],
      vista: { ver: ['inguinales-profundos'], contexto: ['vena-femoral', 'arteria-femoral', 'ligamento-inguinal'], fantasma: ['sartorio', 'aductor-largo'], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['inguinales-profundos', 'inguinales-superomediales'], texto: 'Compara los profundos, junto a la vena femoral, con los superficiales que tienen encima.' },
      comprobar: 'comp-superficiales-profundos',
    },
    {
      id: 'pierna', tipo: 'explicacion', titulo: 'La pierna y el hueco poplíteo',
      texto: [
        ['Los poplíteos, pequeños y unos seis o siete, están en la grasa del hueco poplíteo.', W(POP, 'The popliteal lymph nodes, small in size and some six or seven in number, are embedded in the fat contained in the popliteal fossa')],
        ['Uno está junto al final de la safena menor y drena lo que drena esa vena: la parte posterolateral de la pierna y la planta del pie.', W(POP, 'near the terminal part of the small saphenous vein, and drains the region from which this vein derives its tributaries, such as superficial regions of the posterolateral aspect of the leg and the plantar aspect of the foot.')],
        ['Los demás están a los lados de los vasos poplíteos y reciben los troncos que acompañan a los vasos tibiales.', W(POP, 'The others lie at the sides of the popliteal vessels, and receive, as efferents, the trunks that accompany the anterior and posterior tibial vessels.')],
        ['Sus eferentes suben casi todos junto a los vasos femorales hasta los inguinales profundos; unos pocos acompañan a la safena magna hasta los superficiales.', W(POP, 'The efferents of the popliteal lymph nodes pass almost entirely alongside the femoral vessels to the deep inguinal lymph nodes, but a few may accompany the great saphenous vein')],
      ],
      detalle: [
        ['El muslo y la cara medial de la pierna van directamente a los inguinales superficiales; la cara lateral de la pierna pasa antes por los poplíteos.', W(ING, 'the thigh and the medial side of the leg (the lateral leg drains to the popliteal lymph nodes first).')],
        ['Al caminar, la contracción de la pantorrilla empuja la linfa hacia arriba, y las válvulas impiden que vuelva.', W(POP, 'during walking the calf muscle contracts, squeezing lymph out of the leg via the lymphatic vessels.'), W(POP, 'When the muscle relaxes, valves in the vessels shut preventing the fluid from returning to the lower extremities.')],
      ],
      vista: { ver: POPLITEOS, contexto: ['safena-menor', 'vena-poplitea', 'arteria-poplitea', 'colectores-profundos', 'colectores-superficiales'], camara: 'posterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: POPLITEOS, texto: 'Compara el poplíteo superficial, junto a la safena menor, con los profundos, junto a los vasos poplíteos.' },
      comprobar: 'rel-safena-menor',
    },
    {
      id: 'pelvis', tipo: 'relaciones', titulo: 'Hacia la pelvis',
      texto: [
        ['Los inguinales profundos drenan hacia arriba en los ilíacos externos, de ahí a los nodos de la pelvis y luego a los paraaórticos.', W(ING, 'The deep inguinal lymph nodes drain superiorly to the external iliac lymph nodes, then to the pelvic lymph nodes and on to the paraaortic lymph nodes.')],
        ['Los ilíacos externos, de ocho a diez, siguen los vasos ilíacos externos, y sus principales aferentes vienen de los nodos inguinales.', W(EIL, 'from eight to ten in number, that lie along the external iliac vessels.'), W(EIL, 'Their principal afferents are derived from the inguinal lymph nodes')],
        ['En el modelo, los lacunares están en la laguna vascular, al final de los vasos ilíacos externos, colocados de forma esquemática.', MODELO],
      ],
      vista: { ver: ['inguinales-profundos', 'iliacos-externos'], contexto: ['iliaca-externa', 'vena-femoral', 'ligamento-inguinal'], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'iliacos-externos', texto: 'Toca los nodos que siguen a la vena ilíaca externa por encima del ligamento inguinal.' },
      comprobar: 'rel-iliacos',
    },
    {
      id: 'genitales', tipo: 'funcion', titulo: 'Piel del escroto frente a testículo',
      texto: [
        ['La linfa del escroto va primero a los inguinales superficiales y de ahí a los profundos.', W('Scrotum', 'The scrotal lymph initially drains into the superficial inguinal lymph nodes, this then drains into the deep inguinal lymph nodes.')],
        ['La del testículo, en cambio, sigue a las arterias testiculares hasta los nodos paraaórticos (lumbares).', W('Testicle', 'Lymphatic drainage of the testes follows the testicular arteries back to the paraaortic lymph nodes, while lymph from the scrotum drains to the inguinal lymph nodes.')],
        ['En la mujer, la vulva drena a los inguinales superficiales, mientras que los paraaórticos reciben linfa del ovario, de la trompa y del útero.', W('Vulva', 'The organs and tissues of the vulva are drained by a chain of superficial inguinal lymph nodes located along the blood vessels.'), W('Lumbar_lymph_nodes', 'the lymphatics from the testis in the male, and from the ovary, uterine tube, and uterus in the female')],
      ],
      vista: { ver: ['inguinales-superomediales'], contexto: ['ligamento-inguinal', 'safena-magna'], camara: 'anterior', lado: 'R' },
      comprobar: 'comp-escroto-testiculo',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'Repaso',
      texto: [
        ['Superficiales bajo el ligamento inguinal, alrededor del hiato safeno (inferiores, superolaterales y superomediales); profundos por dentro de la vena femoral.', W(ING, 'form a chain immediately inferior to the inguinal ligament.'), W(ING, 'They lie medial to the femoral vein deep to the cribriform fascia.')],
        ['La pierna lateral y la planta pasan por los poplíteos; la linfa sube junto a los vasos femorales a los profundos y de ahí a los ilíacos externos.', W(ING, 'the lateral leg drains to the popliteal lymph nodes first'), W(POP, 'pass almost entirely alongside the femoral vessels to the deep inguinal lymph nodes'), W(ING, 'The deep inguinal lymph nodes drain superiorly to the external iliac lymph nodes')],
        ['Escroto y vulva, a los inguinales; testículo y ovario, a los lumbares.', W('Testicle', 'Lymphatic drainage of the testes follows the testicular arteries back to the paraaortic lymph nodes, while lymph from the scrotum drains to the inguinal lymph nodes.'), W('Vulva', 'The organs and tissues of the vulva are drained by a chain of superficial inguinal lymph nodes')],
      ],
    },
  ],
  preguntas: [
    { id: 'id-inguinales-inferiores', tipo: 'identificar', estructura: 'inguinales-inferiores', objetivo: 0, paso: 'superficiales' },
    { id: 'id-inguinales-superolaterales', tipo: 'identificar', estructura: 'inguinales-superolaterales', objetivo: 0, paso: 'superficiales' },
    { id: 'loc-inguinales-superomediales', tipo: 'localizar', estructura: 'inguinales-superomediales', candidatas: ['inguinales-superolaterales', 'inguinales-inferiores', 'iliacos-externos'], objetivo: 0, paso: 'superficiales' },
    {
      id: 'rel-limites', tipo: 'relacion', objetivo: 0, paso: 'superficiales', estructuras: SUPERFICIALES,
      enunciado: '¿Qué limita por fuera y por dentro la zona de los nodos inguinales superficiales?',
      correcta: 'El sartorio por fuera y el aductor largo por dentro',
      distractores: ['El tensor de la fascia lata por fuera y el grácil por dentro', 'La arteria femoral por fuera y la vena femoral por dentro', 'El ligamento inguinal por fuera y la sínfisis del pubis por dentro'],
      explicacion: 'Están en el triángulo femoral, bajo el ligamento inguinal, entre el borde del sartorio y el aductor largo.',
      evidencia: [W(ING, 'They are bounded superiorly by the inguinal ligament in the femoral triangle, laterally by the border of the sartorius muscle, and medially by the adductor longus muscle.')],
    },
    {
      id: 'fun-territorio', tipo: 'funcion', objetivo: 1, paso: 'territorios', estructuras: SUPERFICIALES,
      enunciado: '¿Cuál de estas zonas drena en los nodos inguinales superficiales?',
      correcta: 'La pared abdominal por debajo del ombligo',
      distractores: ['El testículo', 'La pared abdominal por encima del ombligo', 'El ovario'],
      explicacion: 'Reciben la pared abdominal por debajo del ombligo; los planos profundos de la pared por encima del ombligo van a los paraesternales, y el testículo y el ovario, a los lumbares.',
      evidencia: [W(ING, 'abdominal wall below the level of the umbilicus'), W('Parasternal_lymph_nodes', 'from the deeper structures of the anterior abdominal wall above the level of the umbilicus'), W('Testicle', 'Lymphatic drainage of the testes follows the testicular arteries back to the paraaortic lymph nodes')],
    },
    {
      id: 'comp-superficiales-profundos', tipo: 'comparacion', objetivo: 1, paso: 'profundos', estructuras: ['inguinales-profundos', 'inguinales-superomediales'],
      enunciado: '¿En qué se distinguen los nodos inguinales profundos de los superficiales?',
      correcta: 'Son de tres a cinco, por dentro de la vena femoral y bajo la fascia cribiforme, y reciben la linfa de los superficiales',
      distractores: ['Son unos diez, en la fascia superficial, junto a la safena magna', 'Están por fuera de la arteria femoral, sobre el sartorio', 'Drenan directamente en el conducto torácico, sin pasar por la pelvis'],
      explicacion: 'Los superficiales, unos diez, están en la fascia superficial junto a la safena magna y vierten en los profundos; estos, por dentro de la vena femoral, vierten en los ilíacos externos.',
      evidencia: [W(ING, 'The deep inguinal lymph nodes are 3-5 in number.'), W(ING, 'They lie medial to the femoral vein deep to the cribriform fascia.'), W(ING, 'They drain to the deep inguinal lymph nodes.')],
    },
    { id: 'id-inguinales-profundos', tipo: 'identificar', estructura: 'inguinales-profundos', objetivo: 1, paso: 'profundos' },
    {
      id: 'rel-safena-menor', tipo: 'relacion', objetivo: 2, paso: 'pierna', estructuras: ['popliteos-superficiales'],
      enunciado: '¿Qué drena el nodo poplíteo que está junto al final de la safena menor?',
      correcta: 'La parte posterolateral de la pierna y la planta del pie',
      distractores: ['La cara medial de la pierna y el muslo', 'La articulación de la cadera', 'El periné'],
      explicacion: 'Drena el territorio de la safena menor; la cara medial de la pierna y el muslo van directamente a los inguinales superficiales.',
      evidencia: [W(POP, 'drains the region from which this vein derives its tributaries, such as superficial regions of the posterolateral aspect of the leg and the plantar aspect of the foot.'), W(ING, 'the thigh and the medial side of the leg (the lateral leg drains to the popliteal lymph nodes first).')],
    },
    {
      id: 'rel-profundos-tibiales', tipo: 'relacion', objetivo: 2, paso: 'pierna', estructuras: ['popliteos-profundos'],
      enunciado: '¿Qué colectores llegan a los nodos poplíteos que están a los lados de los vasos poplíteos?',
      correcta: 'Los que acompañan a los vasos tibiales anteriores y posteriores',
      distractores: ['Los que acompañan a la safena magna', 'Los de la pared abdominal', 'Los del periné'],
      explicacion: 'Los colectores profundos siguen a los vasos tibiales hasta los poplíteos profundos; los de la safena magna van a los inguinales superficiales.',
      evidencia: [W(POP, 'The others lie at the sides of the popliteal vessels, and receive, as efferents, the trunks that accompany the anterior and posterior tibial vessels.')],
    },
    { id: 'id-popliteos-profundos', tipo: 'identificar', estructura: 'popliteos-profundos', objetivo: 2, paso: 'pierna' },
    {
      id: 'sec-pierna-aorta', tipo: 'secuencia', objetivo: 3, paso: 'pelvis',
      enunciado: 'Ordena el camino de la linfa profunda de la pierna:',
      orden: ['Nodos poplíteos', 'Nodos inguinales profundos', 'Nodos ilíacos externos', 'Nodos paraaórticos (lumbares)'],
      explicacion: 'Los eferentes poplíteos suben junto a los vasos femorales a los inguinales profundos; estos drenan en los ilíacos externos, luego en los de la pelvis y en los paraaórticos.',
      evidencia: [W(POP, 'The efferents of the popliteal lymph nodes pass almost entirely alongside the femoral vessels to the deep inguinal lymph nodes'), W(ING, 'The deep inguinal lymph nodes drain superiorly to the external iliac lymph nodes, then to the pelvic lymph nodes and on to the paraaortic lymph nodes.')],
    },
    {
      id: 'rel-iliacos', tipo: 'relacion', objetivo: 3, paso: 'pelvis', estructuras: ['iliacos-externos'],
      enunciado: '¿De dónde reciben sobre todo la linfa los nodos ilíacos externos?',
      correcta: 'De los nodos inguinales',
      distractores: ['Del testículo', 'Del estómago', 'De los nodos axilares'],
      explicacion: 'Siguen a los vasos ilíacos externos y sus principales aferentes vienen de los inguinales; el testículo va a los lumbares.',
      evidencia: [W(EIL, 'Their principal afferents are derived from the inguinal lymph nodes')],
    },
    { id: 'id-iliacos-externos', tipo: 'identificar', estructura: 'iliacos-externos', objetivo: 3, paso: 'pelvis' },
    {
      id: 'comp-escroto-testiculo', tipo: 'comparacion', objetivo: 4, paso: 'genitales',
      enunciado: '¿Adónde va la linfa de la piel del escroto y adónde la del testículo?',
      correcta: 'El escroto, a los inguinales superficiales; el testículo, a los paraaórticos (lumbares)',
      distractores: ['Los dos, a los inguinales superficiales', 'Los dos, a los paraaórticos', 'El escroto, a los paraaórticos; el testículo, a los inguinales'],
      explicacion: 'La linfa del testículo sigue a las arterias testiculares hasta los nodos paraaórticos; la del escroto va a los inguinales.',
      evidencia: [W('Testicle', 'Lymphatic drainage of the testes follows the testicular arteries back to the paraaortic lymph nodes, while lymph from the scrotum drains to the inguinal lymph nodes.'), W('Scrotum', 'The scrotal lymph initially drains into the superficial inguinal lymph nodes')],
    },
    {
      id: 'rel-ovario', tipo: 'relacion', objetivo: 4, paso: 'genitales',
      enunciado: '¿A qué nodos drena el ovario?',
      correcta: 'A los paraaórticos (lumbares)',
      distractores: ['A los inguinales superficiales', 'A los inguinales profundos', 'A los poplíteos'],
      explicacion: 'Los paraaórticos reciben la linfa del ovario, la trompa y el útero; la vulva, en cambio, drena a los inguinales superficiales.',
      evidencia: [W('Lumbar_lymph_nodes', 'the lymphatics from the testis in the male, and from the ovary, uterine tube, and uterus in the female'), W('Vulva', 'The organs and tissues of the vulva are drained by a chain of superficial inguinal lymph nodes')],
    },
  ],
});
