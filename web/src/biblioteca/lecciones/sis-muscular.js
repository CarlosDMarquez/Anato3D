// Lección «El músculo esquelético: origen, inserción, acción e inervación». Formato y evidencias: ../formato.js.
import { leccion, W, GUIA, MODELO } from '../formato.js';

const ME = 'Skeletal_muscle';
const TM = 'Anatomical_terms_of_muscle';
const M = (nombre, piezas, papel = 'nucleo', tipo = 'musculo', lado = 'bilateral') => ({ nombre, piezas, lado, papel, tipo });

export default leccion({
  id: 'sis-muscular',
  version: 1,
  titulo: 'El músculo esquelético: origen, inserción, acción e inervación',
  resumen: 'Los tres tipos de músculo, cómo está hecho un músculo esquelético y cómo se une al hueso, qué son su origen y su inserción y cómo colaboran agonistas, antagonistas y sinergistas en un movimiento.',
  lugares: [],
  sistemas: ['muscular'],
  formato: 'vision-general',
  temas: ['musculos', 'movimientos'],
  nivel: 1,
  minutos: 11,
  requisitos: ['fund-movimientos'],
  siguiente: ['ms-hombro-musculos', 'brazo', 'esp-musculos'],
  objetivos: [
    'Distinguir los tres tipos de tejido muscular y decir cuál se contrae de forma voluntaria.',
    'Describir cómo se une un músculo esquelético al hueso.',
    'Explicar qué son el origen y la inserción de un músculo y reconocerlos en un ejemplo.',
    'Explicar qué hacen el agonista, el antagonista y el sinergista en un movimiento.',
  ],
  estructuras: {
    biceps: M('Músculo bíceps braquial', ['Long_head_of_biceps_brachii', 'Short_head_of_biceps_brachii']),
    braquial: M('Músculo braquial', ['Brachialis_muscle']),
    triceps: M('Músculo tríceps braquial', ['Long_head_of_triceps_brachii', 'Lateral_head_of_triceps_brachii', 'Medial_head_of_triceps_brachii']),
    dorsal: M('Músculo latísimo del dorso', ['Latissimus_dorsi_muscle']),
    gastrocnemio: M('Músculo gastrocnemio', ['Medial_head_of_gastrocnemius', 'Lateral_head_of_gastrocnemius']),
    soleo: M('Músculo sóleo', ['Soleus_muscle']),
    'tendon-calcaneo': M('Tendón calcáneo', ['Calcaneal_tendon'], 'nucleo', 'tendon'),
    humero: M('Húmero', ['Humerus'], 'contexto', 'hueso'),
    escapula: M('Escápula', ['Scapula'], 'contexto', 'hueso'),
    calcaneo: M('Calcáneo', ['Calcaneus'], 'contexto', 'hueso'),
  },
  pasos: [
    {
      id: 'tipos', tipo: 'orientacion', titulo: 'Tres tipos de músculo',
      texto: [
        ['Hay tres tipos de tejido muscular: esquelético, cardíaco y liso.', W('Muscle', 'There are three types of muscle tissues in vertebrates: skeletal muscle tissue, cardiac muscle tissue, and smooth muscle tissue.')],
        ['El liso y el cardíaco se contraen de forma involuntaria; el esquelético solo se contrae de forma voluntaria, bajo el control del sistema nervioso central.', W('Muscle', 'Smooth and cardiac muscle contract involuntarily, without conscious intervention.'), W('Muscle', 'Skeletal muscle only contracts voluntarily, under the influence of the central nervous system.')],
        ['Hay más de 600 músculos esqueléticos, que en adultos jóvenes sanos son alrededor del 40 % del peso del cuerpo.', W(ME, 'There are more than 600 skeletal muscles in the human body, making up around 40% of body weight in healthy young adults.')],
        ['El modelo muestra los músculos esqueléticos; el músculo cardíaco forma parte del corazón.', MODELO],
      ],
      vista: { capas: { muscular: 'superficial' }, ver: [], contexto: [], camara: 'anterior', lado: 'R' },
    },
    {
      id: 'estructura', tipo: 'explicacion', titulo: 'De la fibra al tendón',
      texto: [
        ['Un músculo esquelético contiene muchos fascículos, haces de fibras musculares, y cada fibra y cada músculo están rodeados por una capa de fascia.', W(ME, 'A skeletal muscle contains multiple fascicles – bundles of muscle fibers.'), W(ME, 'Each individual fiber and each muscle is surrounded by a type of connective tissue layer of fascia.')],
        ['En cada extremo, la parte que no se contrae forma el tendón, de tejido conjuntivo fibroso denso.', W(ME, 'a muscle contains a non-contractile part of dense fibrous connective tissue that makes up the tendon at each end')],
        ['Los tendones unen los músculos a los huesos y así producen el movimiento del esqueleto.', W(ME, 'The tendons attach the muscles to bones to give skeletal movement.')],
        ['Mira el gastrocnemio y el sóleo, en la pantorrilla: terminan juntos en el tendón calcáneo, que llega al talón.', GUIA],
      ],
      vista: { ver: ['tendon-calcaneo'], contexto: ['gastrocnemio', 'soleo', 'calcaneo'], esqueleto: true, camara: 'posterior', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'tendon-calcaneo', texto: 'Toca el tendón que une los músculos de la pantorrilla al talón.' },
    },
    {
      id: 'origen-insercion', tipo: 'explicacion', titulo: 'Origen e inserción',
      texto: [
        ['El origen de un músculo es el hueso, normalmente proximal, que tiene más masa y está más estable durante la contracción.', W(TM, 'The origin of a muscle is the bone, typically proximal, which has greater mass and is more stable during a contraction than a muscle\'s insertion.')],
        ['La inserción es la estructura a la que se une y que tiende a moverse cuando se contrae: suele ser distal, con menos masa y más movimiento.', W(TM, 'The insertion of a muscle is the structure that it attaches to and tends to be moved by the contraction of the muscle.'), W(TM, 'The insertion is a bone that tends to be distal, have less mass, and greater motion than the origin during a contraction.')],
        ['El latísimo del dorso nace en el tronco y se inserta en el brazo: al contraerse suele moverse el brazo, aunque en una dominada es el tronco el que sube hacia el brazo.', W(TM, 'For example, with the latissimus dorsi muscle, the origin site is the torso, and the insertion is the arm.'), W(TM, 'When this muscle contracts, normally the arm moves due to having less mass than the torso.'), W(TM, 'This can be reversed however, such as in a chin up where the torso moves up to meet the arm.')],
      ],
      vista: { ver: ['dorsal'], contexto: ['humero', 'escapula'], esqueleto: true, camara: 'posterior', lado: 'R' },
      comprobar: 'origen',
    },
    {
      id: 'agonistas', tipo: 'funcion', titulo: 'Agonistas, antagonistas y sinergistas',
      texto: [
        ['Los agonistas, o motores principales, producen la mayor parte de la fuerza de un movimiento.', W(TM, 'Agonist muscles are also called prime movers since they produce most of the force, and control of an action.')],
        ['Los antagonistas producen un momento de giro opuesto al de los agonistas; los sinergistas ayudan a la acción del agonista alrededor de la articulación.', W(TM, 'Antagonist muscles are simply the muscles that produce an opposing joint torque to the agonist muscles.'), W(TM, 'Synergist muscles also called fixators, act around a joint to help the action of an agonist muscle.')],
        ['Al levantar una mancuerna flexionando el codo, los flexores del codo son los agonistas y los extensores, los antagonistas.', W(TM, 'The elbow flexor group is the agonist, shortening during the lifting phase (elbow flexion).'), W(TM, 'During the dumbbell curl, the elbow extensors are the antagonists for both the lifting and lowering phases.')],
        ['Ser antagonista no es una propiedad fija de un músculo: depende de qué músculo actúa como agonista.', W(TM, 'Antagonism is not an intrinsic property of a particular muscle or muscle group; it is a role that a muscle plays depending on which muscle is currently the agonist.')],
      ],
      vista: { ver: ['biceps', 'braquial'], contexto: ['triceps', 'humero'], esqueleto: true, camara: 'lateral', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['biceps', 'triceps'], texto: 'Alterna entre un flexor del codo, delante, y el extensor, detrás.' },
    },
    {
      id: 'nervios', tipo: 'relaciones', titulo: 'Cada músculo, su nervio',
      texto: [
        ['Las fibras musculares son células excitables que estimulan las neuronas motoras.', W(ME, 'Muscle fibers are excitable cells stimulated by motor neurons.')],
        ['Una unidad motora es una neurona motora y todas las fibras con las que contacta.', W(ME, 'The motor unit consists of a motor neuron and the many fibers that it makes contact with.')],
        ['Los músculos de los miembros los inervan las ramas anteriores de los nervios espinales.', W(ME, 'All other muscles, including those of the limbs are hypaxial, and innervated by the ventral rami of the spinal nerves.')],
      ],
      vista: { capas: { muscular: 'superficial', nervous: 'pns' }, ver: [], contexto: [], camara: 'anterior', lado: 'R' },
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['Tres tipos de músculo: el esquelético, voluntario, y el cardíaco y el liso, involuntarios.', W('Muscle', 'Skeletal muscle only contracts voluntarily'), W('Muscle', 'Smooth and cardiac muscle contract involuntarily')],
        ['Los tendones unen el músculo al hueso: el origen es el extremo estable y la inserción, el que se mueve.', W(ME, 'The tendons attach the muscles to bones to give skeletal movement.'), W(TM, 'tends to be moved by the contraction of the muscle')],
        ['En cada movimiento, el agonista lo produce, el antagonista se opone y los sinergistas ayudan; y cada músculo recibe su nervio motor.', W(TM, 'they produce most of the force'), W(TM, 'produce an opposing joint torque to the agonist muscles'), W(TM, 'help the action of an agonist muscle')],
      ],
    },
  ],
  preguntas: [
    { id: 'id-dorsal', tipo: 'identificar', estructura: 'dorsal', objetivo: 2, paso: 'origen-insercion' },
    { id: 'id-triceps', tipo: 'identificar', estructura: 'triceps', objetivo: 3, paso: 'agonistas' },
    { id: 'loc-biceps', tipo: 'localizar', estructura: 'biceps', candidatas: ['triceps', 'braquial'], objetivo: 3, paso: 'agonistas' },
    {
      id: 'voluntario', tipo: 'relacion', objetivo: 0, paso: 'tipos',
      enunciado: '¿Qué tipo de músculo se contrae solo de forma voluntaria?',
      correcta: 'El esquelético', distractores: ['El cardíaco', 'El liso', 'Los tres por igual'],
      explicacion: 'El liso y el cardíaco se contraen sin intervención consciente.',
      evidencia: [W('Muscle', 'Skeletal muscle only contracts voluntarily, under the influence of the central nervous system.')],
    },
    {
      id: 'tendon', tipo: 'funcion', objetivo: 1, paso: 'estructura', estructuras: ['tendon-calcaneo'],
      enunciado: '¿Qué une un músculo esquelético al hueso?',
      correcta: 'El tendón', distractores: ['El ligamento', 'El cartílago articular', 'La membrana sinovial'],
      explicacion: 'El tendón es la parte no contráctil del músculo, de tejido conjuntivo fibroso denso; los ligamentos unen hueso con hueso.',
      evidencia: [W(ME, 'The tendons attach the muscles to bones to give skeletal movement.')],
    },
    {
      id: 'fasciculo', tipo: 'relacion', objetivo: 1, paso: 'estructura',
      enunciado: '¿Qué es un fascículo de un músculo esquelético?',
      correcta: 'Un haz de fibras musculares', distractores: ['Una fibra muscular aislada', 'La capa de fascia que rodea el músculo', 'El tendón de cada extremo'],
      explicacion: 'El músculo contiene muchos fascículos, haces de fibras, y la fascia rodea cada fibra y cada músculo.',
      evidencia: [W(ME, 'A skeletal muscle contains multiple fascicles – bundles of muscle fibers.')],
    },
    {
      id: 'origen', tipo: 'relacion', objetivo: 2, paso: 'origen-insercion',
      enunciado: 'El origen de un músculo suele ser…',
      correcta: 'el extremo proximal, más estable durante la contracción', distractores: ['el extremo distal, el que más se mueve', 'el punto donde entra su nervio', 'el centro de su vientre muscular'],
      explicacion: 'El origen es el hueso más fijo y normalmente proximal; la inserción, el que tiende a moverse.',
      evidencia: [W(TM, 'The origin of a muscle is the bone, typically proximal, which has greater mass and is more stable during a contraction')],
    },
    {
      id: 'dominada', tipo: 'relacion', objetivo: 2, paso: 'origen-insercion', estructuras: ['dorsal'],
      enunciado: 'En una dominada, el latísimo del dorso sube el tronco hacia el brazo. ¿Qué ocurre con su origen y su inserción?',
      correcta: 'Se invierten: se mueve el origen (el tronco) hacia la inserción (el brazo)', distractores: ['Nada: se sigue moviendo el brazo', 'El músculo cambia de inserción', 'El origen pasa a ser el brazo para siempre'],
      explicacion: 'Normalmente se mueve el brazo, que tiene menos masa; en la dominada se invierte y es el tronco el que sube.',
      evidencia: [W(TM, 'This can be reversed however, such as in a chin up where the torso moves up to meet the arm.')],
    },
    {
      id: 'agonista-curl', tipo: 'funcion', objetivo: 3, paso: 'agonistas', estructuras: ['biceps', 'triceps'],
      enunciado: 'Al subir una mancuerna flexionando el codo, ¿qué músculos son los agonistas?',
      correcta: 'Los flexores del codo', distractores: ['Los extensores del codo', 'Los músculos de la pantorrilla', 'Ninguno: el peso hace el trabajo'],
      explicacion: 'Los flexores (como el bíceps y el braquial) producen la flexión; los extensores (el tríceps) son los antagonistas.',
      evidencia: [W(TM, 'The elbow flexor group is the agonist, shortening during the lifting phase (elbow flexion).')],
    },
    {
      id: 'sinergista', tipo: 'relacion', objetivo: 3, paso: 'agonistas',
      enunciado: '¿Qué hace un músculo sinergista?',
      correcta: 'Ayuda a la acción del agonista alrededor de la articulación', distractores: ['Produce un momento de giro opuesto al del agonista', 'Produce la mayor parte de la fuerza', 'Une el músculo al hueso'],
      explicacion: 'El agonista produce la fuerza principal, el antagonista se opone y el sinergista ayuda.',
      evidencia: [W(TM, 'Synergist muscles also called fixators, act around a joint to help the action of an agonist muscle.')],
    },
  ],
});
