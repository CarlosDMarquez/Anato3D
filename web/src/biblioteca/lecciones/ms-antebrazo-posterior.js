// Lección «El antebrazo: compartimento posterior». Formato y evidencias: ../formato.js.
import { leccion, T, GUIA } from '../formato.js';

const POS = 'upper-limb/muscles/posterior-forearm';
const RAD = 'upper-limb/nerves/radial-nerve';
const musculo = (nombre, piezas) => ({ nombre, piezas, lado: 'bilateral', papel: 'nucleo', tipo: 'musculo' });
const contexto = (nombre, piezas, tipo) => ({ nombre, piezas, lado: 'bilateral', papel: 'contexto', tipo });

const SUPERFICIALES = ['braquiorradial', 'radial-largo', 'radial-corto', 'extensor-dedos', 'extensor-menique', 'extensor-ulnar', 'anconeo'];
const COMUN = ['radial-corto', 'extensor-dedos', 'extensor-menique', 'extensor-ulnar'];
const PROFUNDOS = ['supinador', 'abductor-largo-pulgar', 'extensor-corto-pulgar', 'extensor-largo-pulgar', 'extensor-indice'];
const HUESOS = ['humero', 'radio', 'ulna', 'mano'];

export default leccion({
  id: 'ms-antebrazo-posterior',
  version: 1,
  titulo: 'El antebrazo: compartimento posterior',
  resumen: 'Los extensores del antebrazo, todos del nervio radial: los siete de la capa superficial (con el braquiorradial, que flexiona el codo, y los cuatro que comparten tendón en el epicóndilo lateral) y los cinco de la profunda (el supinador y los del pulgar y el índice), la tabaquera anatómica, el codo de tenista y la muñeca caída.',
  lugares: [['miembro-superior', 'antebrazo']],
  sistemas: ['muscular'],
  formato: 'estructuras',
  temas: ['musculos', 'compartimentos', 'movimientos'],
  nivel: 2,
  minutos: 16,
  requisitos: ['antebrazo', 'ms-nervios'],
  siguiente: ['ms-mano-musculos', 'ms-codo', 'comp-miembro-superior'],
  objetivos: [
    'Distinguir la capa superficial y la profunda de los extensores y nombrar sus músculos.',
    'Relacionar cada músculo con su acción en el codo, la muñeca, los dedos o el pulgar.',
    'Localizar los tendones que limitan la tabaquera anatómica.',
    'Explicar el codo de tenista y la muñeca caída a partir de la anatomía de este compartimento.',
  ],
  estructuras: {
    braquiorradial: musculo('Músculo braquiorradial', ['Brachioradialis_muscle']),
    'radial-largo': musculo('Músculo extensor radial largo del carpo', ['Extensor_carpi_radialis_longus']),
    'radial-corto': musculo('Músculo extensor radial corto del carpo', ['Extensor_carpi_radialis_brevis']),
    'extensor-dedos': musculo('Músculo extensor de los dedos', ['Extensor_digitorum']),
    'extensor-menique': musculo('Músculo extensor del dedo meñique', ['Extensor_digiti_minimi']),
    'extensor-ulnar': musculo('Músculo extensor ulnar del carpo', ['Humeral_head_of_extensor_carpi_ulnaris', 'Ulnar_head_of_extensor_carpi_ulnaris']),
    'anconeo': musculo('Músculo ancóneo', ['Anconeus_muscle']),
    supinador: musculo('Músculo supinador', ['Supinator']),
    'abductor-largo-pulgar': musculo('Músculo abductor largo del pulgar', ['Abductor_pollicis_longus']),
    'extensor-corto-pulgar': musculo('Músculo extensor corto del pulgar', ['Extensor_pollicis_brevis']),
    'extensor-largo-pulgar': musculo('Músculo extensor largo del pulgar', ['Extensor_pollicis_longus']),
    'extensor-indice': musculo('Músculo extensor del índice', ['Extensor_indicis']),
    'nervio-interoseo-posterior': contexto('Nervio interóseo posterior', ['Deep_branch_of_radial_nerve', 'Posterior_interosseous_nerve_of_forearm'], 'nervio'),
    retinaculo: contexto('Retináculo de los extensores', ['Extensor_retinaculum_of_wrist'], 'ligamento'),
    humero: contexto('Húmero', ['Humerus'], 'hueso'),
    radio: contexto('Radio', ['Radius'], 'hueso'),
    ulna: contexto('Ulna', ['Ulna'], 'hueso'),
    mano: contexto('Huesos de la mano', ['Metacarpal_1', 'Metacarpal_2', 'Metacarpal_3', 'Metacarpal_4', 'Metacarpal_5', 'Scaphoid', 'Trapezium'], 'hueso'),
  },
  pasos: [
    {
      id: 'orientacion', tipo: 'orientacion', titulo: 'Los extensores',
      texto: [
        ['Los músculos del compartimento posterior del antebrazo son los extensores: extienden la muñeca y los dedos, y los inerva el nervio radial.', T(POS, 'The muscles in the posterior compartment of the forearm are commonly known as the extensor muscles. The general function of these muscles is to produce extension at the wrist and fingers. They are all innervated by the radial nerve.')],
        ['Forman dos capas, superficial y profunda, separadas por una fascia.', T(POS, 'The muscles in this compartment are organised into two layers')],
        ['Míralos con el antebrazo por detrás.', GUIA],
      ],
      vista: { ver: SUPERFICIALES, contexto: HUESOS, camara: 'posterior', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'Recorre el antebrazo.', vistas: [{ nombre: 'Por detrás', camara: 'posterior' }, { nombre: 'Por fuera', camara: 'lateral' }] },
      comprobar: 'fun-compartimento',
    },
    {
      id: 'superficiales', tipo: 'exploracion', titulo: 'La capa superficial',
      texto: [
        ['La capa superficial tiene siete músculos; cuatro comparten tendón de origen en el epicóndilo lateral: el extensor radial corto del carpo, el de los dedos, el del meñique y el ulnar del carpo.', T(POS, 'The superficial layer of the posterior forearm contains seven muscles. Four of these muscles (extensor carpi radialis brevis, extensor digitorum, extensor carpi ulnaris and extensor digiti minimi) share a common tendinous origin at the lateral epicondyle.')],
        ['Los extensores radiales extienden y separan la muñeca; el ulnar la extiende y la acerca; el de los dedos es el extensor principal de los dedos.', T(POS, 'Actions: Extends and abducts the wrist.'), T(POS, 'Actions: Extension and adduction of wrist.'), T(POS, 'The extensor digitorum is the main extensor of the fingers.')],
        ['El ancóneo, junto al tríceps, extiende y estabiliza el codo.', T(POS, 'It is blended with the fibres of the triceps brachii'), T(POS, 'Actions: Extends and stabilises the elbow joint.')],
      ],
      vista: { ver: COMUN, contexto: ['braquiorradial', 'radial-largo', 'anconeo', 'retinaculo', ...HUESOS], camara: 'posterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['radial-corto', 'extensor-dedos', 'extensor-menique', 'extensor-ulnar'], texto: 'Alterna los cuatro que nacen juntos en el epicóndilo lateral, de fuera adentro.' },
      comprobar: 'comp-radial-ulnar',
    },
    {
      id: 'braquiorradial', tipo: 'relaciones', titulo: 'El braquiorradial, la excepción',
      texto: [
        ['El braquiorradial tiene el origen y la inervación de un extensor, pero flexiona el codo.', T(POS, 'The brachioradialis is a paradoxical muscle. Its origin and innervation are characteristic of an extensor muscle, but it is actually a flexor at the elbow.')],
        ['Va de la cresta supracondílea lateral del húmero al extremo del radio, y se marca con el antebrazo a medio pronar al flexionar el codo contra resistencia.', T(POS, 'Originates from the proximal aspect of the lateral supracondylar ridge of humerus, and attaches to the distal end of the radius, just before the radial styloid process.'), T(POS, 'The muscle is most visible when the forearm is half pronated, and flexing at the elbow against resistance.')],
      ],
      vista: { ver: ['braquiorradial'], contexto: ['radial-largo', ...HUESOS], camara: 'lateral', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'braquiorradial', texto: 'Toca el músculo que va del húmero a la punta del radio por el borde de fuera.' },
      comprobar: 'fun-braquiorradial',
    },
    {
      id: 'profundos', tipo: 'exploracion', titulo: 'La capa profunda',
      texto: [
        ['La capa profunda tiene cinco: el supinador, el abductor largo del pulgar, los extensores corto y largo del pulgar y el extensor del índice.', T(POS, 'There are five muscles in the deep compartment of the posterior forearm – the supinator, abductor pollicis longus, extensor pollicis brevis, extensor pollicis longus and extensor indicis.')],
        ['Salvo el supinador, actúan sobre el pulgar y el índice; el supinador gira el antebrazo y la rama profunda del radial pasa entre sus dos cabezas.', T(POS, 'With the exception of the supinator, these muscles act on the thumb and the index finger.'), T(POS, 'Actions: Supinates the forearm.'), T(POS, 'It has two heads, which the deep branch of the radial nerve passes between.')],
        ['El extensor del índice permite estirar el índice sin los demás dedos.', T(POS, 'This muscle allows the index finger to be independent of the other fingers during extension.')],
      ],
      vista: { ver: PROFUNDOS, contexto: ['nervio-interoseo-posterior', ...HUESOS], fantasma: ['extensor-dedos'], camara: 'posterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['supinador', 'abductor-largo-pulgar', 'extensor-largo-pulgar', 'extensor-indice'], texto: 'Alterna de arriba abajo: el supinador junto al codo y, debajo, los del pulgar y el índice.' },
      comprobar: 'rel-supinador',
    },
    {
      id: 'tabaquera', tipo: 'relaciones', titulo: 'La tabaquera anatómica',
      texto: [
        ['Los tendones del abductor largo y del extensor corto del pulgar forman el borde radial (lateral) de la tabaquera anatómica.', T(POS, 'In the hand, its tendon contributes to the radial (lateral) border of the anatomical snuffbox.')],
        ['El tendón del extensor largo del pulgar forma su borde ulnar (medial); antes rodea el tubérculo dorsal del radio como una polea.', T(POS, 'The tendon of the extensor pollicis longus forms the ulnar (medial) border of the anatomical snuffbox in the hand.'), T(POS, 'Its tendon travels medially to the dorsal tubercle at the wrist, using the tubercle as a')],
        ['El extensor largo del pulgar extiende todas sus articulaciones; el corto, las dos primeras.', T(POS, 'Actions: Extends all joints of the thumb: carpometacarpal, metacarpophalangeal and interphalangeal.'), T(POS, 'Actions: Extends at the metacarpophalangeal and carpometacarpal joints of the thumb.')],
      ],
      vista: { ver: ['abductor-largo-pulgar', 'extensor-corto-pulgar', 'extensor-largo-pulgar'], contexto: ['retinaculo', 'radio', 'mano'], camara: 'lateral', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['extensor-corto-pulgar', 'extensor-largo-pulgar'], texto: 'Alterna los dos bordes de la tabaquera: el extensor corto, por fuera; el largo, por dentro.' },
      comprobar: 'rel-tabaquera',
    },
    {
      id: 'clinica', tipo: 'funcion', titulo: 'Codo de tenista y muñeca caída',
      texto: [
        ['El codo de tenista es la inflamación del periostio del epicóndilo lateral, por el uso repetido de los extensores superficiales que tiran de su tendón común.', T(POS, 'Lateral epicondylitis (or tennis elbow) refers to inflammation of the periosteum of the lateral epicondyle.'), T(POS, 'It is caused by repeated use of the superficial extensor muscles, which strains their common tendinous attachment to the lateral epicondyle.')],
        ['Si el nervio radial se lesiona por encima del codo, se paralizan los extensores y la muñeca cae, porque nada se opone a los flexores.', T(POS, 'Wrist drop is a condition that arises from injury to the radial nerve, particularly when damaged proximal to the elbow. This injury results in paralysis of the extensor muscles, leading to unopposed flexion at the wrist due to the intact flexor muscles.')],
      ],
      vista: { ver: COMUN, contexto: ['nervio-interoseo-posterior', ...HUESOS], camara: 'posterolateral', lado: 'R' },
      comprobar: 'rel-tenista',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['Todos los extensores son del nervio radial; extienden la muñeca y los dedos.', T(POS, 'The general function of these muscles is to produce extension at the wrist and fingers. They are all innervated by the radial nerve.')],
        ['Superficiales: cuatro nacen juntos en el epicóndilo lateral; el braquiorradial, en cambio, flexiona el codo.', T(POS, 'share a common tendinous origin at the lateral epicondyle.'), T(POS, 'but it is actually a flexor at the elbow.')],
        ['Profundos: el supinador y cuatro para el pulgar y el índice, tres de ellos en los bordes de la tabaquera.', T(POS, 'With the exception of the supinator, these muscles act on the thumb and the index finger.')],
      ],
    },
  ],
  preguntas: [
    {
      id: 'fun-compartimento', tipo: 'funcion', objetivo: 1, paso: 'orientacion', estructuras: SUPERFICIALES,
      enunciado: '¿Qué nervio inerva todos los músculos del compartimento posterior del antebrazo?',
      correcta: 'El radial',
      distractores: ['El mediano', 'El ulnar', 'El musculocutáneo'],
      explicacion: 'El radial (sobre todo su rama profunda, el interóseo posterior) inerva todos los extensores.',
      evidencia: [T(POS, 'They are all innervated by the radial nerve.')],
    },
    { id: 'id-extensor-dedos', tipo: 'identificar', estructura: 'extensor-dedos', objetivo: 0, paso: 'superficiales' },
    { id: 'id-extensor-ulnar', tipo: 'identificar', estructura: 'extensor-ulnar', objetivo: 0, paso: 'superficiales' },
    { id: 'id-braquiorradial', tipo: 'identificar', estructura: 'braquiorradial', objetivo: 0, paso: 'braquiorradial' },
    { id: 'id-supinador', tipo: 'identificar', estructura: 'supinador', objetivo: 0, paso: 'profundos' },
    {
      id: 'comp-radial-ulnar', tipo: 'comparacion', objetivo: 1, paso: 'superficiales', estructuras: ['radial-largo', 'radial-corto', 'extensor-ulnar'],
      enunciado: '¿En qué se diferencian los extensores radiales del carpo y el extensor ulnar del carpo?',
      correcta: 'Los radiales extienden y separan la muñeca; el ulnar la extiende y la acerca',
      distractores: ['Los radiales flexionan la muñeca; el ulnar la extiende', 'Los tres extienden los dedos', 'El ulnar supina el antebrazo'],
      explicacion: 'Por su posición, los radiales (lado del pulgar) abducen y el ulnar (lado del meñique) aduce mientras extienden.',
      evidencia: [T(POS, 'Due to their position, they are able to produce abduction as well as extension at the wrist.'), T(POS, 'Due to its position, it is able to produce adduction as well as extension at the wrist.')],
    },
    {
      id: 'fun-braquiorradial', tipo: 'funcion', objetivo: 1, paso: 'braquiorradial', estructuras: ['braquiorradial'],
      enunciado: '¿Qué hace el braquiorradial, aunque esté entre los extensores?',
      correcta: 'Flexiona el codo',
      distractores: ['Extiende la muñeca', 'Extiende los dedos', 'Prona el antebrazo'],
      explicacion: 'Tiene el origen y el nervio de un extensor, pero flexiona el codo; también ayuda a supinar.',
      evidencia: [T(POS, 'Actions: Flexes at the elbow. Contributes to supination at the proximal radioulnar joint.')],
    },
    {
      id: 'rel-supinador', tipo: 'relacion', objetivo: 1, paso: 'profundos', estructuras: ['supinador', 'nervio-interoseo-posterior'],
      enunciado: '¿Qué pasa entre las dos cabezas del supinador?',
      correcta: 'La rama profunda del nervio radial',
      distractores: ['El nervio mediano', 'La arteria braquial', 'El tendón del bíceps'],
      explicacion: 'La rama profunda del radial atraviesa el supinador y sigue como nervio interóseo posterior.',
      evidencia: [T(POS, 'It has two heads, which the deep branch of the radial nerve passes between.')],
    },
    {
      id: 'fun-indice', tipo: 'funcion', objetivo: 1, paso: 'profundos', estructuras: ['extensor-indice'],
      enunciado: '¿Para qué sirve el extensor del índice?',
      correcta: 'Para estirar el índice independientemente de los otros dedos',
      distractores: ['Para separar el pulgar', 'Para flexionar el índice', 'Para extender la muñeca'],
      explicacion: 'Permite señalar con el índice mientras los demás dedos siguen flexionados.',
      evidencia: [T(POS, 'This muscle allows the index finger to be independent of the other fingers during extension.')],
    },
    {
      id: 'rel-tabaquera', tipo: 'relacion', objetivo: 2, paso: 'tabaquera', estructuras: ['extensor-largo-pulgar'],
      enunciado: '¿Qué tendón forma el borde medial (ulnar) de la tabaquera anatómica?',
      correcta: 'El del extensor largo del pulgar',
      distractores: ['El del extensor corto del pulgar', 'El del abductor largo del pulgar', 'El del extensor del índice'],
      explicacion: 'El extensor corto y el abductor largo forman el borde lateral; el extensor largo, el medial.',
      evidencia: [T(POS, 'The tendon of the extensor pollicis longus forms the ulnar (medial) border of the anatomical snuffbox in the hand.')],
    },
    { id: 'id-extensor-largo-pulgar', tipo: 'identificar', estructura: 'extensor-largo-pulgar', objetivo: 2, paso: 'tabaquera' },
    {
      id: 'rel-tenista', tipo: 'relacion', objetivo: 3, paso: 'clinica', estructuras: COMUN,
      enunciado: '¿Qué es el codo de tenista?',
      correcta: 'La inflamación del epicóndilo lateral por el uso repetido de los extensores superficiales',
      distractores: ['La inflamación del epicóndilo medial por los flexores', 'La compresión del nervio ulnar en el codo', 'La rotura del tendón del bíceps'],
      explicacion: 'Los extensores superficiales tiran de su tendón común en el epicóndilo lateral.',
      evidencia: [T(POS, 'It is caused by repeated use of the superficial extensor muscles, which strains their common tendinous attachment to the lateral epicondyle.')],
    },
    {
      id: 'rel-muneca-caida', tipo: 'relacion', objetivo: 3, paso: 'clinica', estructuras: ['extensor-dedos'],
      enunciado: '¿Por qué una lesión del nervio radial por encima del codo deja la muñeca caída?',
      correcta: 'Porque se paralizan los extensores y nada se opone a los flexores',
      distractores: ['Porque se paralizan los flexores', 'Porque se rompe el retináculo de los extensores', 'Porque se luxa la muñeca'],
      explicacion: 'Los flexores, del mediano y del ulnar, siguen funcionando y la muñeca queda flexionada.',
      evidencia: [T(POS, 'This injury results in paralysis of the extensor muscles, leading to unopposed flexion at the wrist due to the intact flexor muscles.'), T(RAD, 'Unopposed flexion of wrist occurs, known as wrist-drop.')],
    },
  ],
});
