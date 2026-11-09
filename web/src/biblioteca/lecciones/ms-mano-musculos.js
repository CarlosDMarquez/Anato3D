// Lección «Músculos de la mano». Formato y evidencias: ../formato.js.
import { leccion, T, GUIA, MODELO } from '../formato.js';

const MAN = 'upper-limb/muscles/hand';
const musculo = (nombre, piezas, extra = {}) => ({ nombre, piezas, lado: 'bilateral', papel: 'nucleo', tipo: 'musculo', ...extra });
const contexto = (nombre, piezas, tipo) => ({ nombre, piezas, lado: 'bilateral', papel: 'contexto', tipo });
const serie = (base, desde, hasta) => Array.from({ length: hasta - desde + 1 }, (_, i) => `${base}_${desde + i}`);

const TENAR = ['abductor-corto-pulgar', 'flexor-corto-pulgar', 'oponente-pulgar'];
const HIPOTENAR = ['abductor-minimo', 'flexor-minimo', 'oponente-minimo'];
const CENTRALES = ['lumbricales', 'interoseos-dorsales', 'interoseos-palmares'];

export default leccion({
  id: 'ms-mano-musculos',
  version: 1,
  titulo: 'Músculos de la mano',
  resumen: 'Los músculos propios de la mano, responsables de los movimientos finos: los tres de la eminencia tenar y el aductor del pulgar, los tres de la hipotenar, los lumbricales y los interóseos, con lo que hace cada grupo y qué nervio lo mueve, el mediano o el ulnar.',
  lugares: [['miembro-superior', 'mano']],
  sistemas: ['muscular'],
  formato: 'estructuras',
  temas: ['musculos', 'movimientos', 'nervios'],
  nivel: 2,
  minutos: 18,
  requisitos: ['ms-mano-huesos', 'antebrazo'],
  siguiente: ['ms-nervios', 'ms-vasos', 'comp-miembro-superior'],
  objetivos: [
    'Distinguir los músculos extrínsecos de la mano de los intrínsecos y decir qué hace cada grupo.',
    'Nombrar los músculos propios del pulgar (los tres tenares y el aductor) y explicar su acción.',
    'Nombrar los músculos de la eminencia hipotenar y situarlos por capas.',
    'Explicar la acción de los lumbricales y de los interóseos sobre los dedos.',
    'Asociar cada grupo de músculos de la mano con el nervio mediano o el ulnar.',
  ],
  estructuras: {
    'abductor-corto-pulgar': musculo('Abductor corto del pulgar', ['Abductor_pollicis_brevis']),
    'flexor-corto-pulgar': musculo('Flexor corto del pulgar', ['Superficial_head_of_flexor_pollicis_brevis', 'Deep_head_of_flexor_pollicis_brevis']),
    'oponente-pulgar': musculo('Oponente del pulgar', ['Opponens_pollicis_muscle']),
    'aductor-pulgar': musculo('Aductor del pulgar', ['Oblique_head_of_adductor_pollicis', 'Transverse_head_of_adductor_pollicis']),
    'abductor-minimo': musculo('Abductor del dedo mínimo', ['Abductor_digiti_minimi_of_hand'], { confusiones: ['Abductor del dedo pequeño del pie'] }),
    'flexor-minimo': musculo('Flexor corto del dedo mínimo', ['Flexor_digiti_minimi_of_hand']),
    'oponente-minimo': musculo('Oponente del dedo mínimo', ['Opponens_digiti_minimi_muscle_of_hand']),
    lumbricales: musculo('Lumbricales', ['Lumbrical_muscles_of_hand']),
    'interoseos-dorsales': musculo('Interóseos dorsales', ['Dorsal_interossei_muscles_of_hand']),
    'interoseos-palmares': musculo('Interóseos palmares', ['Palmar_interossei_muscles']),
    'huesos-mano': contexto('Huesos de la mano', ['Scaphoid', 'Lunate', 'Triquetrum', 'Pisiform', 'Trapezium', 'Trapezoid', 'Capitate', 'Hamate', ...serie('Metacarpal', 1, 5), ...serie('Proximal_Phalanx_Hand', 1, 5), ...serie('Middle_Phalanx_Hand', 2, 5), ...serie('Distal_Phalanx_Hand', 1, 5)], 'hueso'),
    retinaculo: contexto('Retináculo de los flexores', ['Flexor_retinaculum_of_wrist'], 'ligamento'),
    mediano: contexto('Nervio mediano', ['Median_nerve'], 'nervio'),
    'ulnar-profunda': contexto('Rama profunda del nervio ulnar', ['Deep_branch_of_ulnar_nerve'], 'nervio'),
    'flexor-profundo': contexto('Flexor profundo de los dedos', ['Flexor_digitorum_profundus'], 'musculo'),
    'arco-palmar-profundo': contexto('Arco palmar profundo', ['Deep_palmar_arch'], 'arteria'),
  },
  pasos: [
    {
      id: 'orientacion', tipo: 'orientacion', titulo: 'Los músculos propios de la mano',
      texto: [
        ['Los músculos que mueven la mano son de dos grupos: los extrínsecos, en el antebrazo, dan los movimientos amplios y la prensión fuerte; los intrínsecos, en la propia mano, los movimientos finos.', T(MAN, 'Extrinsic muscles – located in the anterior and posterior compartments of the forearm. They control crude movements and produce a forceful grip.'), T(MAN, 'Intrinsic muscles – located within the hand itself. They are responsible for the fine motor functions of the hand.')],
        ['Los intrínsecos forman dos relieves, la eminencia tenar en la base del pulgar y la hipotenar en la del meñique; entre los metacarpianos están los interóseos, y hay cuatro lumbricales, uno por dedo.', T(MAN, 'The thenar muscles are three short muscles located at the base of the thumb. The muscle bellies produce a bulge, known as the thenar eminence.'), T(MAN, 'a muscular protrusion on the medial side of the palm, at the base of the little finger.'), T(MAN, 'The interossei muscles are located between the metacarpal bones of the hand.'), T(MAN, 'There are four lumbricals in the hand, each associated with a finger.')],
        ['Mira la palma de la mano derecha y luego el dorso.', GUIA],
      ],
      vista: { ver: [...TENAR, 'aductor-pulgar', ...HIPOTENAR, ...CENTRALES], contexto: ['huesos-mano'], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'En posición anatómica, la palma mira hacia delante.', vistas: [{ nombre: 'Palma', camara: 'anterior' }, { nombre: 'Dorso', camara: 'posterior' }, { nombre: 'Lado del pulgar', camara: 'lateral' }] },
      comprobar: 'comp-extrinsecos',
    },
    {
      id: 'tenar', tipo: 'exploracion', titulo: 'La eminencia tenar',
      texto: [
        ['Los tres músculos tenares, en la base del pulgar, se encargan de sus movimientos finos, y los inerva el nervio mediano.', T(MAN, 'They are responsible for the fine movements of the thumb.'), T(MAN, 'The median nerve innervates all the thenar muscles.')],
        ['El abductor corto, el más superficial y lateral, separa el pulgar; el flexor corto, en el lado medial, flexiona su articulación metacarpofalángica.', T(MAN, 'The abductor pollicis brevis forms the anterolateral aspect of the thenar eminence, overlying the opponens pollicis.'), T(MAN, 'Actions: Abducts the thumb.'), T(MAN, 'The flexor pollicis brevis forms the medial aspect of the thenar eminence.'), T(MAN, 'Actions: Flexes the metacarpophalangeal joint of the thumb.')],
        ['Debajo de los dos está el oponente, el más grande: rota hacia dentro y flexiona el primer metacarpiano sobre el trapecio, y así opone el pulgar.', T(MAN, 'The opponens pollicis is the largest of the thenar muscles, and lies underneath the other two.'), T(MAN, 'Actions: Opposes the thumb, by medially rotating and flexing the metacarpal on the trapezium.')],
        ['Los tres nacen del retináculo de los flexores y de los tubérculos del trapecio y, en el abductor, también del escafoides.', T(MAN, 'Originates from the tubercle of the trapezium and the associated flexor retinaculum.'), T(MAN, 'Originates from the tubercles of the scaphoid and trapezium, and from the associated flexor retinaculum.'), T(MAN, 'Originates from the tubercle of the trapezium and from the associated flexor retinaculum.')],
      ],
      detalle: [
        ['La rama del mediano que llega a los tres es su rama recurrente; el modelo no la separa del resto del nervio.', T(MAN, 'Innervation: Median nerve (recurrent branch).'), MODELO],
        ['La cabeza profunda del flexor corto, que varía de tamaño, la inerva en cambio la rama profunda del nervio ulnar.', T(MAN, 'although the deep component is variable in size.'), T(MAN, 'The deep head is innervated by the deep branch of the ulnar nerve.')],
      ],
      vista: { ver: TENAR, contexto: ['huesos-mano', 'retinaculo', 'mediano'], camara: 'anterolateral', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: TENAR, texto: 'Alterna los tres tenares, de la superficie a la profundidad: abductor, flexor y oponente.' },
      comprobar: 'fun-oponente',
    },
    {
      id: 'hipotenar', tipo: 'exploracion', titulo: 'La eminencia hipotenar',
      texto: [
        ['Los hipotenares forman el relieve del lado medial de la palma, en la base del meñique; se parecen a los tenares en nombre y organización, y los inerva el nervio ulnar.', T(MAN, 'The hypothenar muscles form the hypothenar eminence – a muscular protrusion on the medial side of the palm, at the base of the little finger. These muscles are similar to the thenar muscles in both name and organisation.'), T(MAN, 'The ulnar nerve innervates the muscles of the hypothenar eminence.')],
        ['El abductor del meñique, el más superficial, nace del pisiforme y separa el meñique; el flexor corto, a su lado, flexiona su articulación metacarpofalángica.', T(MAN, 'The abductor digiti minimi is the most superficial of the hypothenar muscle group.'), T(MAN, 'Originates from the pisiform and the tendon of the flexor carpi ulnaris.'), T(MAN, 'Actions: Abducts the little finger.'), T(MAN, 'The flexor digiti minimi brevis lies laterally to the abductor digiti minimi in the hand.'), T(MAN, 'Actions: Flexes the metacarpophalangeal joint of the little finger.')],
        ['El oponente, el más profundo, lleva el quinto metacarpiano hacia la palma.', T(MAN, 'The opponens digit minimi lies deep to the other hypothenar muscles.'), T(MAN, 'It rotates the metacarpal of the little finger towards the palm, producing opposition.')],
      ],
      detalle: [
        ['El palmar corto, fino y metido en la piel de la eminencia hipotenar, arruga esa piel y ahueca la mano para agarrar mejor.', T(MAN, 'The palmaris brevis is a small, thin muscle, found superficially in the subcutaneous tissue of the hypothenar eminence.'), T(MAN, 'Wrinkles the skin of the hypothenar eminence and deepens the curvature of the hand, improving grip.')],
        ['El modelo no tiene el palmar corto.', MODELO],
      ],
      vista: { ver: HIPOTENAR, contexto: ['huesos-mano', 'retinaculo'], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: HIPOTENAR, texto: 'Alterna los tres hipotenares, de la superficie a la profundidad.' },
      comprobar: 'comp-hipotenar-profundo',
    },
    {
      id: 'centrales', tipo: 'relaciones', titulo: 'Lumbricales e interóseos',
      texto: [
        ['Cada lumbrical nace de un tendón del flexor profundo de los dedos y acaba en el aparato extensor: flexionan la metacarpofalángica y extienden las interfalángicas.', T(MAN, 'Each lumbrical originates from a tendon of the flexor digitorum profundus.'), T(MAN, 'and inserts into the extensor hood.'), T(MAN, 'Actions: Flexion at the MCP joint and extension at the interphalangeal (IP) joints of each digit.')],
        ['Los dos laterales, del índice y el medio, los inerva el mediano; los dos mediales, del anular y el meñique, el ulnar.', T(MAN, 'The lateral two lumbricals (of the index and middle fingers) are innervated by the median nerve. The medial two lumbricals (of the little and ring fingers) are innervated by the ulnar nerve.')],
        ['Los interóseos, entre los metacarpianos, separan los dedos (los cuatro dorsales) o los juntan (los tres palmares) y ayudan a los lumbricales; todos dependen de la rama profunda del ulnar.', T(MAN, 'In addition to their actions of abduction (dorsal interossei) and adduction (palmar interossei) of the fingers, the interossei also assist the lumbricals in flexion at the MCP joints and extension at the IP joints.'), T(MAN, 'There are four dorsal interossei muscles.'), T(MAN, 'There are three palmar interossei muscles'), T(MAN, 'Innervation: Ulnar nerve (deep branch).')],
      ],
      detalle: [
        ['Perder la inervación de los lumbricales está en la base de la garra ulnar y de la «mano de bendición».', T(MAN, 'Denervation of these muscles is the basis for the ulnar claw and hand of benediction.')],
        ['Algunos textos describen un cuarto interóseo palmar, en la base de la falange proximal del pulgar.', T(MAN, 'although some texts describe a fourth muscle at the base of the proximal phalanx of the thumb')],
      ],
      vista: { ver: CENTRALES, contexto: ['huesos-mano'], fantasma: ['flexor-profundo'], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: CENTRALES, texto: 'Alterna los tres grupos: los lumbricales van con los tendones flexores y los interóseos, entre los metacarpianos.' },
      comprobar: 'comp-interoseos',
    },
    {
      id: 'aductor', tipo: 'relaciones', titulo: 'El aductor del pulgar y los dos nervios',
      texto: [
        ['El aductor del pulgar es triangular y tiene dos cabezas: una nace del tercer metacarpiano y la otra del hueso grande y de los metacarpianos vecinos; las dos van a la falange proximal del pulgar y lo aducen.', T(MAN, 'The adductor pollicis large triangular muscle with two heads.'), T(MAN, 'One head originates from metacarpal III. The other head originates from the capitate and adjacent areas of metacarpals II and III. Both attach into the base of the proximal phalanx of the thumb.'), T(MAN, 'Actions: Adductor of the thumb.')],
        ['Entre sus dos cabezas pasa la arteria radial, que forma el arco palmar profundo.', T(MAN, 'The radial artery passes anteriorly through the space between the two heads, forming the deep palmar arch.')],
        ['Aunque mueve el pulgar, lo inerva el ulnar. En resumen, el mediano inerva los tenares y los dos lumbricales laterales; el ulnar, los hipotenares, los lumbricales mediales, los interóseos y el aductor.', T(MAN, 'Innervation: Ulnar nerve.'), T(MAN, 'The median nerve innervates all the thenar muscles.'), T(MAN, 'The lateral two lumbricals (of the index and middle fingers) are innervated by the median nerve.'), T(MAN, 'The ulnar nerve innervates the muscles of the hypothenar eminence.'), T(MAN, 'The medial two lumbricals (of the little and ring fingers) are innervated by the ulnar nerve.'), T(MAN, 'Innervation: Ulnar nerve (deep branch).')],
      ],
      vista: { ver: ['aductor-pulgar'], contexto: ['huesos-mano', 'arco-palmar-profundo', 'ulnar-profunda'], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'aductor-pulgar', texto: 'Toca el músculo de dos cabezas que aduce el pulgar.' },
      comprobar: 'rel-nervio-aductor',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['Los extrínsecos, en el antebrazo, dan fuerza; los intrínsecos, en la mano, precisión.', T(MAN, 'They control crude movements and produce a forceful grip.'), T(MAN, 'They are responsible for the fine motor functions of the hand.')],
        ['Tenares (abductor corto, flexor corto y oponente): mediano. Hipotenares, interóseos y aductor del pulgar: ulnar. Lumbricales: los dos laterales del mediano y los dos mediales del ulnar.', T(MAN, 'The median nerve innervates all the thenar muscles.'), T(MAN, 'The ulnar nerve innervates the muscles of the hypothenar eminence.'), T(MAN, 'Innervation: Ulnar nerve (deep branch).'), T(MAN, 'The lateral two lumbricals (of the index and middle fingers) are innervated by the median nerve.')],
        ['Lumbricales: flexionan la metacarpofalángica y extienden las interfalángicas; interóseos dorsales, separan los dedos, y palmares, los juntan.', T(MAN, 'Actions: Flexion at the MCP joint and extension at the interphalangeal (IP) joints of each digit.'), T(MAN, 'abduction (dorsal interossei) and adduction (palmar interossei) of the fingers')],
      ],
    },
  ],
  preguntas: [
    {
      id: 'comp-extrinsecos', tipo: 'comparacion', objetivo: 0, paso: 'orientacion', estructuras: [...TENAR, ...HIPOTENAR],
      enunciado: '¿Qué diferencia a los músculos intrínsecos de la mano de los extrínsecos?',
      correcta: 'Los intrínsecos están en la mano y hacen los movimientos finos; los extrínsecos, en el antebrazo, dan la prensión fuerte',
      distractores: ['Los intrínsecos están en el antebrazo y dan la prensión fuerte', 'Los intrínsecos solo extienden los dedos', 'Los extrínsecos son los de la eminencia tenar'],
      explicacion: 'Los extrínsecos están en los compartimentos del antebrazo y dan fuerza; los intrínsecos, dentro de la mano, dan precisión.',
      evidencia: [T(MAN, 'Intrinsic muscles – located within the hand itself. They are responsible for the fine motor functions of the hand.')],
    },
    {
      id: 'fun-oponente', tipo: 'funcion', objetivo: 1, paso: 'tenar', estructuras: ['oponente-pulgar'],
      enunciado: '¿Qué hace el oponente del pulgar?',
      correcta: 'Opone el pulgar, rotando hacia dentro y flexionando el primer metacarpiano',
      distractores: ['Separa el pulgar de la palma', 'Junta el pulgar a la palma', 'Extiende el pulgar'],
      explicacion: 'Separarlo es del abductor corto y juntarlo, del aductor; la extensión depende de músculos del antebrazo.',
      evidencia: [T(MAN, 'Actions: Opposes the thumb, by medially rotating and flexing the metacarpal on the trapezium.')],
    },
    { id: 'id-oponente-pulgar', tipo: 'identificar', estructura: 'oponente-pulgar', objetivo: 1, paso: 'tenar' },
    { id: 'loc-abductor-corto', tipo: 'localizar', estructura: 'abductor-corto-pulgar', candidatas: ['flexor-corto-pulgar', 'oponente-pulgar'], objetivo: 1, paso: 'tenar' },
    {
      id: 'rel-mediano-tenar', tipo: 'relacion', objetivo: 4, paso: 'tenar', estructuras: TENAR,
      enunciado: '¿Qué nervio inerva los músculos de la eminencia tenar?',
      correcta: 'El mediano',
      distractores: ['El ulnar', 'El radial', 'El musculocutáneo'],
      explicacion: 'Los tres tenares los inerva el mediano, por su rama recurrente; solo la cabeza profunda del flexor corto recibe la rama profunda del ulnar.',
      evidencia: [T(MAN, 'The median nerve innervates all the thenar muscles.')],
    },
    {
      id: 'comp-hipotenar-profundo', tipo: 'comparacion', objetivo: 2, paso: 'hipotenar', estructuras: HIPOTENAR,
      enunciado: '¿Cuál es el más profundo de los músculos hipotenares?',
      correcta: 'El oponente del dedo mínimo',
      distractores: ['El abductor del dedo mínimo', 'El flexor corto del dedo mínimo', 'El palmar corto'],
      explicacion: 'El abductor es el más superficial; el oponente queda debajo de los otros dos, igual que el oponente del pulgar en la eminencia tenar.',
      evidencia: [T(MAN, 'The opponens digit minimi lies deep to the other hypothenar muscles.'), T(MAN, 'The abductor digiti minimi is the most superficial of the hypothenar muscle group.')],
    },
    {
      id: 'rel-ulnar-hipotenar', tipo: 'relacion', objetivo: 4, paso: 'hipotenar', estructuras: HIPOTENAR,
      enunciado: '¿Qué nervio inerva los músculos de la eminencia hipotenar?',
      correcta: 'El ulnar',
      distractores: ['El mediano', 'El radial', 'El interóseo anterior'],
      explicacion: 'La hipotenar, en el lado del meñique, es del ulnar; la tenar, del mediano.',
      evidencia: [T(MAN, 'The ulnar nerve innervates the muscles of the hypothenar eminence.')],
    },
    { id: 'id-abductor-minimo', tipo: 'identificar', estructura: 'abductor-minimo', objetivo: 2, paso: 'hipotenar' },
    {
      id: 'fun-lumbricales', tipo: 'funcion', objetivo: 3, paso: 'centrales', estructuras: ['lumbricales'],
      enunciado: '¿Qué hacen los lumbricales?',
      correcta: 'Flexionan la metacarpofalángica y extienden las interfalángicas',
      distractores: ['Flexionan todas las articulaciones del dedo', 'Separan los dedos', 'Extienden la metacarpofalángica y flexionan las interfalángicas'],
      explicacion: 'Unen los tendones flexores con el aparato extensor: por eso flexionan la articulación de la base del dedo y extienden las de los dedos.',
      evidencia: [T(MAN, 'Actions: Flexion at the MCP joint and extension at the interphalangeal (IP) joints of each digit.'), T(MAN, 'linking the extensor tendons to the flexor tendons.')],
    },
    {
      id: 'comp-interoseos', tipo: 'comparacion', objetivo: 3, paso: 'centrales', estructuras: ['interoseos-dorsales', 'interoseos-palmares'],
      enunciado: '¿Qué diferencia a los interóseos dorsales de los palmares?',
      correcta: 'Los dorsales separan los dedos; los palmares los juntan',
      distractores: ['Los dorsales juntan los dedos; los palmares los separan', 'Los dorsales los inerva el mediano; los palmares, el ulnar', 'Los dorsales flexionan los dedos; los palmares los extienden'],
      explicacion: 'Dorsales, abducción; palmares, aducción. Los dos grupos ayudan a los lumbricales y los inerva la rama profunda del ulnar.',
      evidencia: [T(MAN, 'In addition to their actions of abduction (dorsal interossei) and adduction (palmar interossei) of the fingers')],
    },
    { id: 'id-interoseos-dorsales', tipo: 'identificar', estructura: 'interoseos-dorsales', objetivo: 3, paso: 'centrales' },
    {
      id: 'rel-lumbricales-nervios', tipo: 'relacion', objetivo: 4, paso: 'centrales', estructuras: ['lumbricales'],
      enunciado: '¿Qué nervio inerva los lumbricales del índice y del medio?',
      correcta: 'El mediano',
      distractores: ['El ulnar', 'El radial', 'La rama profunda del ulnar'],
      explicacion: 'Los dos lumbricales laterales son del mediano; los dos mediales, del anular y el meñique, del ulnar.',
      evidencia: [T(MAN, 'The lateral two lumbricals (of the index and middle fingers) are innervated by the median nerve.')],
    },
    {
      id: 'rel-nervio-aductor', tipo: 'relacion', objetivo: 4, paso: 'aductor', estructuras: ['aductor-pulgar'],
      enunciado: '¿Qué nervio inerva el aductor del pulgar?',
      correcta: 'El ulnar',
      distractores: ['El mediano', 'El radial', 'El musculocutáneo'],
      explicacion: 'Es una trampa clásica: mueve el pulgar, pero no es tenar y lo inerva el ulnar.',
      evidencia: [T(MAN, 'Actions: Adductor of the thumb. Innervation: Ulnar nerve.')],
    },
    {
      id: 'rel-arco-profundo', tipo: 'relacion', objetivo: 1, paso: 'aductor', estructuras: ['aductor-pulgar', 'arco-palmar-profundo'],
      enunciado: '¿Qué pasa entre las dos cabezas del aductor del pulgar?',
      correcta: 'La arteria radial, que forma el arco palmar profundo',
      distractores: ['El nervio mediano', 'El tendón del flexor largo del pulgar', 'La arteria ulnar, que forma el arco palmar superficial'],
      explicacion: 'La arteria radial cruza entre las dos cabezas hacia la palma y allí forma el arco palmar profundo.',
      evidencia: [T(MAN, 'The radial artery passes anteriorly through the space between the two heads, forming the deep palmar arch.')],
    },
  ],
});
