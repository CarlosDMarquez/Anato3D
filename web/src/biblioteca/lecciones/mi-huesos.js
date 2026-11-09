// Lección «Fémur, rótula, tibia y fíbula». Formato y evidencias: ../formato.js.
import { leccion, W, T, GUIA, MODELO } from '../formato.js';

const FEM = 'lower-limb/bones/femur';
const ROT = 'lower-limb/bones/patella';
const TIB = 'lower-limb/bones/tibia';
const TOB = 'lower-limb/joints/ankle-joint';
const hueso = (nombre, piezas, extra = {}) => ({ nombre, piezas, lado: 'bilateral', papel: 'nucleo', tipo: 'hueso', ...extra });
const contexto = (nombre, piezas, tipo) => ({ nombre, piezas, lado: 'bilateral', papel: 'contexto', tipo });

const HUESOS = ['femur', 'rotula', 'tibia', 'fibula'];

export default leccion({
  id: 'mi-huesos',
  version: 1,
  titulo: 'Fémur, rótula, tibia y fíbula',
  resumen: 'Los huesos largos del miembro inferior y la rótula: los accidentes del fémur en la cadera y en la rodilla, la forma y las funciones de la rótula, la tibia que carga el peso y la fíbula, delgada, que forma el maléolo lateral. Con qué se articula cada uno.',
  lugares: [['miembro-inferior', 'muslo'], ['miembro-inferior', 'rodilla'], ['miembro-inferior', 'pierna']],
  sistemas: ['oseo'],
  formato: 'estructuras',
  temas: ['huesos', 'accidentes-oseos'],
  nivel: 1,
  minutos: 15,
  requisitos: ['fund-orientacion', 'pel-pelvis-osea'],
  siguiente: ['mi-pie-huesos-tobillo', 'mi-rodilla', 'mi-cadera'],
  objetivos: [
    'Localizar el fémur, la rótula, la tibia y la fíbula y decir con qué se articula cada uno.',
    'Señalar los accidentes del extremo proximal del fémur (cabeza, cuello y trocánteres) y del distal (cóndilos y epicóndilos).',
    'Describir la rótula y explicar sus dos funciones.',
    'Distinguir la tibia de la fíbula por su posición, su papel en la carga del peso y sus accidentes.',
  ],
  estructuras: {
    femur: hueso('Fémur', ['Femur']),
    rotula: hueso('Rótula (patela)', ['Patella']),
    tibia: hueso('Tibia', ['Tibia'], { confusiones: ['Fíbula (peroné)'] }),
    fibula: hueso('Fíbula (peroné)', ['Fibula'], { confusiones: ['Tibia'] }),
    coxal: contexto('Hueso coxal', ['Hip_Bone'], 'hueso'),
    talus: contexto('Astrágalo (talus)', ['Talus'], 'hueso'),
    'membrana-interosea': contexto('Membrana interósea de la pierna', ['Interosseous_membrane_of_leg'], 'ligamento'),
  },
  pasos: [
    {
      id: 'orientacion', tipo: 'orientacion', titulo: 'Los huesos del muslo y de la pierna',
      texto: [
        ['El fémur es el único hueso del muslo, entre la cadera y la rodilla, y el hueso más largo del cuerpo.', W('Femur', 'or thigh bone is the only bone in the thigh — the region of the lower limb between the hip and the knee.'), W('Femur', 'The femur is the only bone in the upper leg and the longest bone in the human body.')],
        ['En la pierna hay dos: la tibia, el hueso principal, que forma la espinilla, y la fíbula (peroné), por fuera de la tibia.', T(TIB, 'The tibia is the main bone of the lower leg, forming what is more commonly known as the shin.'), W('Fibula', 'is a leg bone on the lateral side of the tibia, to which it is connected above and below.')],
        ['Delante de la rodilla, en el surco rotuliano del fémur, está la rótula.', T(ROT, 'The patella (kneecap) is located at the front of the knee joint, within the patellofemoral groove of the femur.')],
        ['Míralos primero de frente y después de lado.', GUIA],
      ],
      vista: { ver: HUESOS, contexto: ['coxal', 'talus'], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'Recorre el miembro inferior desde varios lados.', vistas: [{ nombre: 'Desde delante', camara: 'anterior' }, { nombre: 'Desde fuera', camara: 'lateral' }, { nombre: 'Desde atrás', camara: 'posterior' }] },
    },
    {
      id: 'femur-proximal', tipo: 'explicacion', titulo: 'El extremo proximal del fémur',
      texto: [
        ['Arriba, el fémur se articula con el acetábulo de la pelvis y forma la articulación de la cadera.', T(FEM, 'The proximal aspect of the femur articulates with the acetabulum of the pelvis to form the hip joint.')],
        ['Tiene una cabeza, un cuello y dos salientes: los trocánteres mayor y menor.', T(FEM, 'It consists of a head and neck, and two bony processes – the greater and lesser trochanters.')],
        ['El cuello une la cabeza con la diáfisis formando un ángulo de unos 135°, que da más movilidad a la cadera.', T(FEM, 'Neck – connects the head of the femur with the shaft.'), T(FEM, 'It is set at an angle of approximately 135 degrees to the shaft. This angle of projection allows for an increased range of movement at the hip joint.')],
        ['El trocánter mayor, el saliente más lateral que se palpa, recibe músculos glúteos como el medio y el menor; el menor, en la cara posteromedial, recibe el iliopsoas.', T(FEM, 'Greater trochanter – the most lateral palpable projection of bone'), T(FEM, 'It is the site of attachment for many of the muscles in the gluteal region, such as gluteus medius, gluteus minimus and piriformis.'), T(FEM, 'It projects from the posteromedial side of the femur, just inferior to the neck-shaft junction.'), T(FEM, 'It is the site of attachment for iliopsoas')],
      ],
      detalle: [
        ['Entre los dos trocánteres corren la línea intertrocantérea, por delante, y la cresta intertrocantérea, por detrás.', T(FEM, 'There are also two bony ridges connecting the two trochanters; the intertrochanteric line anteriorly and the trochanteric crest posteriorly.')],
        ['Las fracturas del cuello del fémur son cada vez más frecuentes en personas mayores con huesos osteoporóticos, tras caídas leves.', T(FEM, 'Neck of femur fractures (NOFs) are increasingly common and tend to be sustained by the elderly population as a result of low energy falls in the presence of osteoporotic bone.')],
        ['En el modelo, el fémur es una sola pieza: la cabeza, el cuello y los trocánteres se reconocen por la forma.', MODELO],
      ],
      vista: { ver: ['femur'], contexto: ['coxal'], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'El trocánter mayor se ve bien por delante y por fuera; el menor, por detrás y por dentro.', vistas: [{ nombre: 'Desde delante', camara: 'anterior' }, { nombre: 'Desde atrás', camara: 'posterior' }, { nombre: 'Desde dentro', camara: 'medial' }] },
      comprobar: 'rel-trocanter-menor',
    },
    {
      id: 'femur-distal', tipo: 'exploracion', titulo: 'La diáfisis y el extremo distal del fémur',
      texto: [
        ['La diáfisis baja un poco hacia dentro, lo que acerca las rodillas al centro de gravedad y da estabilidad.', T(FEM, 'The shaft of the femur descends in a slight medial direction. This brings the knees closer to the body’s centre of gravity, increasing stability.')],
        ['Por detrás tiene unas crestas rugosas, la línea áspera.', T(FEM, 'On the posterior surface of the femoral shaft, there are roughened ridges of bone, called the linea aspera (Latin for rough line).')],
        ['Abajo, los cóndilos medial y lateral se articulan con la tibia y con la rótula en la rodilla.', T(FEM, 'The distal end of the femur is characterised by the presence of the medial and lateral condyles, which articulate with the tibia and patella to form the knee joint.')],
        ['De los epicóndilos, por encima de los cóndilos, nacen los ligamentos colaterales de la rodilla; entre los cóndilos, por detrás, la fosa intercondílea recibe los ligamentos de dentro de la articulación.', T(FEM, 'The medial and lateral collateral ligaments of the knee originate from their respective epicondyles.'), T(FEM, 'Intercondylar fossa – a deep notch on the posterior surface of the femur, between the two condyles. It contains two facets for attachment of intracapsular knee ligaments')],
      ],
      vista: { ver: ['femur'], contexto: ['rotula', 'tibia', 'fibula'], camara: 'posterior', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'Por detrás se ven la línea áspera y la fosa intercondílea; de frente, la superficie para la rótula.', vistas: [{ nombre: 'Desde atrás', camara: 'posterior' }, { nombre: 'Desde delante', camara: 'anterior' }, { nombre: 'Desde abajo', camara: 'inferior' }] },
      comprobar: 'rel-epicondilos',
    },
    {
      id: 'rotula', tipo: 'explicacion', titulo: 'La rótula',
      texto: [
        ['La rótula es un hueso sesamoideo, situado dentro del tendón del cuádriceps, y el mayor sesamoideo del cuerpo.', T(ROT, 'It is classified as a sesamoid type bone due to its position within the quadriceps tendon, and is the largest sesamoid bone in the body.')],
        ['Es triangular: su vértice, abajo, se une a la tuberosidad de la tibia por el ligamento rotuliano, y su base, arriba, recibe el tendón del cuádriceps.', T(ROT, 'The patella has a triangular shape, with anterior and posterior surfaces.'), T(ROT, 'The apex of the patella is situated inferiorly and is connected to the tibial tuberosity by the patellar ligament.'), T(ROT, 'The base forms the superior aspect of the bone and provides the attachment area for the quadriceps tendon.')],
        ['Su cara posterior se articula con el fémur por dos carillas, una para cada cóndilo.', T(ROT, 'The posterior surface of the patella articulates with the femur, and is marked by two facets:'), T(ROT, 'Medial facet – articulates with the medial condyle of the femur.'), T(ROT, 'Lateral facet – articulates with the lateral condyle of the femur.')],
        ['Tiene dos funciones: aumenta la palanca del cuádriceps para extender la pierna y protege la parte anterior de la rodilla.', T(ROT, 'Leg extension – Enhances the leverage that the quadriceps tendon can exert on the femur, increasing the efficiency of the muscle.'), T(ROT, 'Protection – Protects the anterior aspect of the knee joint from physical trauma.')],
      ],
      detalle: [
        ['Casi todas las luxaciones de rótula son hacia fuera; el cóndilo lateral del fémur, más prominente, ayuda a evitarlas.', T(ROT, 'Most dislocations occur laterally'), T(FEM, 'The more prominent lateral condyle helps prevent the natural lateral movement of the patella')],
      ],
      vista: { ver: ['rotula'], contexto: ['femur', 'tibia'], camara: 'anterolateral', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'rotula', texto: 'Toca el hueso sesamoideo que está delante de la rodilla.' },
      comprobar: 'fun-rotula',
    },
    {
      id: 'tibia', tipo: 'exploracion', titulo: 'La tibia',
      texto: [
        ['La tibia es el segundo hueso más grande del cuerpo y una pieza clave para soportar el peso.', T(TIB, 'The tibia is the second largest bone in the body and it is a key weight-bearing structure.')],
        ['Arriba, sus cóndilos forman una superficie plana, la meseta tibial, que se articula con los cóndilos del fémur en la rodilla.', T(TIB, 'The condyles form a flat surface, known as the tibial plateau. This structure articulates with the femoral condyles to form the key articulation of the knee joint.')],
        ['Su borde anterior se palpa bajo la piel (la espinilla); en su parte alta está la tuberosidad tibial, donde se inserta el ligamento rotuliano.', T(TIB, 'Anterior border – palpable subcutaneously down the anterior surface of the leg as the shin.'), T(TIB, 'The proximal aspect of the anterior border is marked by the tibial tuberosity; the attachment site for the patella ligament.')],
        ['Abajo, el maléolo medial baja por el lado interno y forma parte del tobillo.', T(TIB, 'The medial malleolus is a bony projection continuing inferiorly on the medial aspect of the tibia. It articulates with the tarsal bones to form part of the ankle joint.')],
      ],
      detalle: [
        ['Entre los cóndilos, la eminencia intercondílea es el principal lugar de inserción de los ligamentos y los meniscos de la rodilla.', T(TIB, 'Located between the condyles is a region called the intercondylar eminence'), T(TIB, 'This area is the main site of attachment for the ligaments and the menisci of the knee joint.')],
      ],
      vista: { ver: ['tibia'], contexto: ['femur', 'fibula', 'rotula', 'talus'], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'La meseta se ve desde arriba; el maléolo medial, desde dentro.', vistas: [{ nombre: 'Desde delante', camara: 'anterior' }, { nombre: 'Desde dentro', camara: 'medial' }, { nombre: 'Meseta, desde arriba', camara: 'superior' }] },
      comprobar: 'rel-tuberosidad',
    },
    {
      id: 'fibula', tipo: 'relaciones', titulo: 'La fíbula y su unión con la tibia',
      texto: [
        ['La fíbula es la más pequeña de las dos y, para su longitud, el más delgado de los huesos largos.', W('Fibula', 'It is the smaller of the two bones and, in proportion to its length, the most slender of all the long bones.')],
        ['Su cabeza queda por detrás de la cabeza de la tibia, debajo de la rodilla, y no forma parte de esa articulación.', W('Fibula', 'Its upper extremity is small, placed toward the back of the head of the tibia, below the knee joint and excluded from the formation of this joint.')],
        ['Abajo sobresale por debajo de la tibia y forma la parte lateral del tobillo: el maléolo lateral.', W('Fibula', 'it projects below the tibia and forms the lateral part of the ankle joint.'), T(TOB, 'The lateral ligament originates from the lateral malleolus (a bony prominence projecting from the lateral aspect of the distal fibula).')],
        ['Tibia y fíbula se unen arriba por la articulación tibiofibular superior, abajo por la sindesmosis tibiofibular y, a lo largo, por la membrana interósea.', W('Fibula', 'The superior tibiofibular articulation is an arthrodial joint between the lateral condyle of the tibia and the head of the fibula.'), W('Fibula', 'The inferior tibiofibular articulation (tibiofibular syndesmosis)'), T(TIB, 'It gives attachment to the interosseous membrane that binds the tibia and the fibula together.')],
      ],
      detalle: [
        ['En la cabeza de la fíbula se insertan el tendón del bíceps femoral y el ligamento colateral fibular de la rodilla.', W('Fibula', 'gives attachment to the tendon of the biceps femoris and to the fibular collateral ligament of the knee-joint')],
      ],
      vista: { ver: ['fibula', 'tibia'], contexto: ['membrana-interosea', 'femur', 'talus'], camara: 'lateral', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['tibia', 'fibula'], texto: 'Compara su grosor y fíjate en dónde llega cada una: la tibia a la rodilla; la fíbula, no.' },
      comprobar: 'comp-tibia-fibula',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['El fémur, el más largo del cuerpo, se articula con el acetábulo arriba y con la tibia y la rótula abajo.', W('Femur', 'the longest bone in the human body'), T(FEM, 'The proximal aspect of the femur articulates with the acetabulum of the pelvis to form the hip joint.'), T(FEM, 'which articulate with the tibia and patella to form the knee joint.')],
        ['Arriba tiene cabeza, cuello (a unos 135°) y trocánteres; abajo, cóndilos y epicóndilos.', T(FEM, 'It consists of a head and neck, and two bony processes – the greater and lesser trochanters.'), T(FEM, 'It is set at an angle of approximately 135 degrees to the shaft.'), T(FEM, 'Medial and lateral epicondyles – bony elevations on the non-articular areas of the condyles.')],
        ['La rótula, el mayor sesamoideo, da palanca al cuádriceps y protege la rodilla.', T(ROT, 'is the largest sesamoid bone in the body'), T(ROT, 'Enhances the leverage that the quadriceps tendon can exert on the femur'), T(ROT, 'Protects the anterior aspect of the knee joint from physical trauma.')],
        ['La tibia, medial, carga el peso y forma el maléolo medial; la fíbula, lateral y delgada, forma el maléolo lateral.', T(TIB, 'it is a key weight-bearing structure'), T(TIB, 'The medial malleolus is a bony projection continuing inferiorly on the medial aspect of the tibia.'), T(TOB, 'the lateral malleolus (a bony prominence projecting from the lateral aspect of the distal fibula)')],
      ],
    },
  ],
  preguntas: [
    { id: 'id-femur', tipo: 'identificar', estructura: 'femur', objetivo: 0, paso: 'orientacion' },
    { id: 'id-rotula', tipo: 'identificar', estructura: 'rotula', objetivo: 0, paso: 'rotula' },
    { id: 'id-tibia', tipo: 'identificar', estructura: 'tibia', objetivo: 0, paso: 'tibia' },
    { id: 'id-fibula', tipo: 'identificar', estructura: 'fibula', objetivo: 0, paso: 'fibula' },
    { id: 'loc-fibula', tipo: 'localizar', estructura: 'fibula', candidatas: ['tibia', 'femur'], objetivo: 0, paso: 'fibula' },
    {
      id: 'seq-cadera-tobillo', tipo: 'secuencia', objetivo: 0, paso: 'orientacion', estructuras: ['femur', 'tibia'],
      enunciado: 'Ordena de arriba abajo:',
      orden: ['Acetábulo del coxal', 'Cabeza del fémur', 'Cóndilos del fémur', 'Meseta tibial', 'Maléolo medial'],
      explicacion: 'La cabeza del fémur encaja en el acetábulo; los cóndilos del fémur apoyan en la meseta tibial, y la tibia acaba abajo en el maléolo medial.',
      evidencia: [T(FEM, 'Head – articulates with the acetabulum of the pelvis to form the hip joint.'), T(TIB, 'This structure articulates with the femoral condyles to form the key articulation of the knee joint.'), T(TIB, 'The medial malleolus is a bony projection continuing inferiorly on the medial aspect of the tibia.')],
    },
    {
      id: 'rel-trocanter-menor', tipo: 'relacion', objetivo: 1, paso: 'femur-proximal', estructuras: ['femur'],
      enunciado: '¿Qué músculo se inserta en el trocánter menor del fémur?',
      correcta: 'El iliopsoas',
      distractores: ['El glúteo medio', 'El piriforme', 'El glúteo menor'],
      explicacion: 'El iliopsoas va al trocánter menor; el glúteo medio, el glúteo menor y el piriforme, al trocánter mayor.',
      evidencia: [T(FEM, 'It is the site of attachment for iliopsoas'), T(FEM, 'such as gluteus medius, gluteus minimus and piriformis')],
    },
    {
      id: 'rel-angulo', tipo: 'relacion', objetivo: 1, paso: 'femur-proximal', estructuras: ['femur'],
      enunciado: '¿Qué ángulo forma el cuello del fémur con la diáfisis?',
      correcta: 'Unos 135°',
      distractores: ['Unos 90°', 'Unos 180°: siguen en línea recta', 'Unos 45°'],
      explicacion: 'El cuello sale hacia arriba y hacia dentro, a unos 135° de la diáfisis, y eso amplía el movimiento de la cadera.',
      evidencia: [T(FEM, 'It is set at an angle of approximately 135 degrees to the shaft.')],
    },
    {
      id: 'rel-epicondilos', tipo: 'relacion', objetivo: 1, paso: 'femur-distal', estructuras: ['femur'],
      enunciado: '¿Qué nace en los epicóndilos del fémur?',
      correcta: 'Los ligamentos colaterales de la rodilla',
      distractores: ['Los ligamentos cruzados', 'El ligamento rotuliano', 'Los meniscos'],
      explicacion: 'Los colaterales nacen en los epicóndilos; los cruzados se fijan en la fosa intercondílea.',
      evidencia: [T(FEM, 'The medial and lateral collateral ligaments of the knee originate from their respective epicondyles.')],
    },
    {
      id: 'fun-rotula', tipo: 'funcion', objetivo: 2, paso: 'rotula', estructuras: ['rotula'],
      enunciado: '¿Cuáles son las dos funciones de la rótula?',
      correcta: 'Dar más palanca al cuádriceps y proteger la parte anterior de la rodilla',
      distractores: ['Soportar el peso del cuerpo y unir la tibia con la fíbula', 'Flexionar la rodilla y estabilizar el tobillo', 'Sujetar los meniscos y los ligamentos cruzados'],
      explicacion: 'Dentro del tendón del cuádriceps, la rótula mejora la palanca para extender la pierna y protege la rodilla por delante.',
      evidencia: [T(ROT, 'Leg extension – Enhances the leverage that the quadriceps tendon can exert on the femur, increasing the efficiency of the muscle.'), T(ROT, 'Protection – Protects the anterior aspect of the knee joint from physical trauma.')],
    },
    {
      id: 'rel-sesamoideo', tipo: 'relacion', objetivo: 2, paso: 'rotula', estructuras: ['rotula'],
      enunciado: '¿Qué tipo de hueso es la rótula?',
      correcta: 'Un hueso sesamoideo, el mayor del cuerpo',
      distractores: ['Un hueso largo, como el fémur', 'Un hueso plano, como los del cráneo', 'Un hueso irregular, como las vértebras'],
      explicacion: 'La rótula se forma dentro del tendón del cuádriceps: es un sesamoideo, el mayor del cuerpo.',
      evidencia: [T(ROT, 'It is classified as a sesamoid type bone due to its position within the quadriceps tendon, and is the largest sesamoid bone in the body.')],
    },
    {
      id: 'rel-tuberosidad', tipo: 'relacion', objetivo: 3, paso: 'tibia', estructuras: ['tibia', 'rotula'],
      enunciado: '¿Qué se inserta en la tuberosidad tibial?',
      correcta: 'El ligamento rotuliano',
      distractores: ['El ligamento colateral fibular', 'El ligamento cruzado anterior', 'La membrana interósea'],
      explicacion: 'El ligamento rotuliano une el vértice de la rótula con la tuberosidad tibial.',
      evidencia: [T(TIB, 'The proximal aspect of the anterior border is marked by the tibial tuberosity; the attachment site for the patella ligament.')],
    },
    {
      id: 'comp-tibia-fibula', tipo: 'comparacion', objetivo: 3, paso: 'fibula', estructuras: ['tibia', 'fibula'],
      enunciado: '¿Qué diferencia a la tibia de la fíbula?',
      correcta: 'La tibia es medial y carga el peso; la fíbula es lateral, delgada y no forma parte de la rodilla',
      distractores: [
        'La fíbula es medial y carga el peso; la tibia es lateral',
        'Las dos se articulan con el fémur en la rodilla',
        'La tibia forma el maléolo lateral y la fíbula, el medial',
      ],
      explicacion: 'La tibia, el hueso principal de la pierna, carga el peso y forma el maléolo medial; la fíbula, por fuera, queda debajo de la rodilla y forma el maléolo lateral.',
      evidencia: [T(TIB, 'it is a key weight-bearing structure'), W('Fibula', 'is a leg bone on the lateral side of the tibia'), W('Fibula', 'below the knee joint and excluded from the formation of this joint.')],
    },
    {
      id: 'rel-maleolo-lateral', tipo: 'relacion', objetivo: 3, paso: 'fibula', estructuras: ['fibula'],
      enunciado: '¿Qué hueso forma el maléolo lateral del tobillo?',
      correcta: 'La fíbula',
      distractores: ['La tibia', 'El astrágalo', 'El calcáneo'],
      explicacion: 'El maléolo lateral es el extremo distal de la fíbula; el medial, de la tibia.',
      evidencia: [T(TOB, 'the lateral malleolus (a bony prominence projecting from the lateral aspect of the distal fibula)')],
    },
  ],
});
