// Lección «Huesos de la muñeca y la mano». Formato y evidencias: ../formato.js.
import { leccion, W, T, GUIA } from '../formato.js';

const MAN = 'upper-limb/bones/bones-of-the-hand-carpals-metacarpals-and-phalanges';
const hueso = (nombre, piezas, extra = {}) => ({ nombre, piezas, lado: 'bilateral', papel: 'nucleo', tipo: 'hueso', ...extra });
const contexto = (nombre, piezas, tipo) => ({ nombre, piezas, lado: 'bilateral', papel: 'contexto', tipo });
const serie = (base, desde, hasta) => Array.from({ length: hasta - desde + 1 }, (_, i) => `${base}_${desde + i}`);

const PROXIMAL = ['escafoides', 'semilunar', 'piramidal', 'pisiforme'];
const DISTAL = ['trapecio', 'trapezoide', 'grande', 'ganchoso'];
const CARPO = [...PROXIMAL, ...DISTAL];
const FALANGES = ['falanges-proximales', 'falanges-medias', 'falanges-distales'];

export default leccion({
  id: 'ms-mano-huesos',
  version: 1,
  titulo: 'Huesos de la muñeca y la mano',
  resumen: 'Los 27 huesos de la mano: los ocho del carpo en sus dos filas, los cinco metacarpianos y las catorce falanges. Con qué se articula cada grupo, qué forma el túnel carpiano y por qué la fractura del escafoides es delicada.',
  lugares: [['miembro-superior', 'muneca'], ['miembro-superior', 'mano']],
  sistemas: ['oseo'],
  formato: 'estructuras',
  temas: ['huesos', 'accidentes-oseos', 'articulaciones'],
  nivel: 1,
  minutos: 14,
  requisitos: ['fund-orientacion', 'antebrazo'],
  siguiente: ['ms-mano-musculos', 'ms-antebrazo-posterior'],
  objetivos: [
    'Localizar los ocho huesos del carpo y decir en qué fila está cada uno.',
    'Localizar los metacarpianos y las falanges y decir cuántas falanges tiene cada dedo.',
    'Describir con qué se articula el carpo y qué forma el túnel carpiano.',
    'Explicar por qué la fractura del escafoides puede dejar parte del hueso sin riego.',
  ],
  estructuras: {
    escafoides: hueso('Escafoides', ['Scaphoid']),
    semilunar: hueso('Semilunar', ['Lunate']),
    piramidal: hueso('Piramidal', ['Triquetrum']),
    pisiforme: hueso('Pisiforme', ['Pisiform']),
    trapecio: hueso('Trapecio', ['Trapezium'], { confusiones: ['Trapezoide'] }),
    trapezoide: hueso('Trapezoide', ['Trapezoid'], { confusiones: ['Trapecio'] }),
    grande: hueso('Hueso grande (capitado)', ['Capitate']),
    ganchoso: hueso('Hueso ganchoso (hamato)', ['Hamate']),
    metacarpianos: hueso('Metacarpianos', serie('Metacarpal', 1, 5)),
    'falanges-proximales': hueso('Falanges proximales', serie('Proximal_Phalanx_Hand', 1, 5)),
    'falanges-medias': hueso('Falanges medias', serie('Middle_Phalanx_Hand', 2, 5)),
    'falanges-distales': hueso('Falanges distales', serie('Distal_Phalanx_Hand', 1, 5)),
    radio: contexto('Radio', ['Radius'], 'hueso'),
    ulna: contexto('Ulna (cúbito)', ['Ulna'], 'hueso'),
    retinaculo: contexto('Retináculo de los flexores', ['Flexor_retinaculum_of_wrist'], 'ligamento'),
  },
  pasos: [
    {
      id: 'orientacion', tipo: 'orientacion', titulo: 'Los huesos de la mano',
      texto: [
        ['Los huesos de la mano son de tres tipos: los ocho del carpo, en la muñeca; los cinco metacarpianos, en la palma, y las falanges, en los dedos.', T(MAN, 'Carpal bones (proximal) – a set of eight irregularly shaped bones. They are located in the area of the wrist.'), T(MAN, 'Metacarpals – a set of five bones, each one related to a digit. They are located in the area of the palm.'), T(MAN, 'Phalanges (distal) – the bones of the digits.')],
        ['En total, cada mano tiene 27 huesos, sin contar los sesamoideos, cuyo número varía de una persona a otra.', W('Hand', 'Each human hand has 27 bones, not including the sesamoid bone, the number of which varies among people.')],
        ['Mira la mano por la palma y por el dorso.', GUIA],
      ],
      vista: { ver: [...CARPO, 'metacarpianos', ...FALANGES], contexto: ['radio', 'ulna'], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'En posición anatómica, la palma mira hacia delante.', vistas: [{ nombre: 'Palma', camara: 'anterior' }, { nombre: 'Dorso', camara: 'posterior' }, { nombre: 'Lado del pulgar', camara: 'lateral' }] },
    },
    {
      id: 'carpo', tipo: 'explicacion', titulo: 'El carpo: dos filas de cuatro',
      texto: [
        ['Los ocho huesos del carpo se ordenan en dos filas, una proximal y otra distal.', T(MAN, 'They are organised into two rows – proximal and distal:')],
        ['En la fila proximal están el escafoides, el semilunar, el piramidal y el pisiforme; en la distal, el trapecio, el trapezoide, el grande y el ganchoso.', T(MAN, 'The carpal bones are organised into two rows: the proximal row includes the scaphoid, lunate, triquetrum, and pisiform, while the distal row comprises the trapezium, trapezoid, capitate, and hamate.')],
        ['El pisiforme es un hueso sesamoideo, formado dentro del tendón del flexor ulnar del carpo; el ganchoso tiene en la cara palmar una prolongación, el gancho.', T(MAN, 'Pisiform (a sesamoid bone, formed within the tendon of the flexor carpi ulnaris)'), T(MAN, 'has a projection on its palmar surface, known as the ‘hook of hamate’')],
      ],
      detalle: [
        ['El escafoides es el más grande de la fila proximal; su nombre viene del griego y alude a la forma de una barca.', W('Scaphoid_bone', 'The scaphoid bone is the largest bone of the proximal row of wrist bones'), W('Scaphoid_bone', 'The name refers to the shape of the bone, supposedly reminiscent of a boat.')],
      ],
      vista: { ver: CARPO, contexto: ['radio', 'ulna', 'metacarpianos'], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: CARPO, texto: 'Resalta uno a uno los ocho huesos: primero la fila proximal y después la distal.' },
      comprobar: 'rel-fila-distal',
    },
    {
      id: 'muneca', tipo: 'relaciones', titulo: 'La muñeca y el túnel carpiano',
      texto: [
        ['El escafoides y el semilunar, de la fila proximal, se articulan con el radio y forman la articulación de la muñeca (radiocarpiana).', T(MAN, 'In the proximal row, the scaphoid and lunate articulate with the radius to form the wrist joint (radiocarpal joint).')],
        ['La fila distal se articula con los metacarpianos en las articulaciones carpometacarpianas.', T(MAN, 'The distal row of carpal bones articulate with the metacarpals at the carpometacarpal joints.')],
        ['Los huesos del carpo forman un arco; el retináculo de los flexores lo cierra por delante y forma el túnel carpiano.', T(MAN, 'The carpal bones collectively form an arch in the coronal plane. A membranous band, the flexor retinaculum, spans between the medial and lateral edges of the arch, forming the carpal tunnel.')],
        ['Por el túnel carpiano pasan hacia la mano el nervio mediano y los tendones de los músculos anteriores del antebrazo.', W('Carpal_bones', 'to form part of the rigid carpal tunnel which allows the median nerve and tendons of the anterior forearm muscles to be transmitted to the hand and fingers.')],
      ],
      vista: { ver: ['escafoides', 'semilunar', 'retinaculo'], contexto: ['radio', 'ulna', 'piramidal', 'pisiforme', ...DISTAL], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'semilunar', texto: 'Toca el hueso de la fila proximal que, junto al escafoides, se articula con el radio.' },
      comprobar: 'rel-radiocarpiana',
    },
    {
      id: 'metacarpianos', tipo: 'explicacion', titulo: 'Los metacarpianos',
      texto: [
        ['Los cinco metacarpianos se articulan con el carpo por arriba y con las falanges proximales por abajo; se numeran del I, el del pulgar, al V, el del meñique.', T(MAN, 'The metacarpal bones articulate proximally with the carpals, and distally with the proximal phalanges.'), T(MAN, 'Metacarpal I – thumb.'), T(MAN, 'Metacarpal V – little finger.')],
        ['Cada uno tiene una base, un cuerpo y una cabeza.', T(MAN, 'Each metacarpal consists of a base, shaft and a head.')],
        ['El del pulgar se articula con el trapecio y se mueve con independencia de los demás; el del índice es el más fijo.', W('Metacarpal_bones', 'The index metacarpal is the most firmly fixed, while the thumb metacarpal articulates with the trapezium and acts independently from the others.')],
        ['Sus caras laterales, cóncavas, dan inserción a los músculos interóseos.', T(MAN, 'The medial and lateral surfaces of the metacarpals are concave, allowing attachment of the interossei muscles.')],
      ],
      vista: { ver: ['metacarpianos'], contexto: [...DISTAL, 'falanges-proximales'], camara: 'posterior', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'trapecio', texto: 'Toca el hueso del carpo con el que se articula el metacarpiano del pulgar.' },
      comprobar: 'rel-trapecio',
    },
    {
      id: 'falanges', tipo: 'exploracion', titulo: 'Las falanges',
      texto: [
        ['Cada mano tiene 14 falanges: tres en cada dedo y solo dos en el pulgar.', W('Phalanx_bone', 'There are 56 phalanges in the human body, with fourteen on each hand and foot.'), W('Phalanx_bone', 'Three phalanges are present on each finger and toe, with the exception of the thumb and big toe, which possess only two.')],
        ['Se llaman proximal, media y distal; el pulgar no tiene falange media.', W('Phalanx_bone', 'A phalanx is named according to whether it is proximal, middle, or distal and its associated finger or toe.'), W('Phalanx_bone', 'The thumb and large toe do not have middle phalanges.')],
        ['Las proximales se articulan con los metacarpianos en las articulaciones metacarpofalángicas; las distales están en la punta de los dedos.', W('Phalanx_bone', 'The proximal phalanges join with the metacarpals of the hand or metatarsals of the foot at the metacarpophalangeal joint or metatarsophalangeal joint.'), W('Phalanx_bone', 'The distal phalanges are the bones at the tips of the fingers or toes.')],
      ],
      vista: { ver: FALANGES, contexto: ['metacarpianos'], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: FALANGES, texto: 'Resalta cada fila de falanges y fíjate en el pulgar: no tiene falange media.' },
      comprobar: 'rel-pulgar',
    },
    {
      id: 'escafoides', tipo: 'relaciones', titulo: 'El escafoides y las caídas',
      texto: [
        ['El escafoides es el hueso del carpo que más se fractura, casi siempre al caer sobre la mano extendida.', T(MAN, 'The scaphoid bone of the hand is the most commonly fractured carpal bone – typically by falling on an outstretched hand (FOOSH).')],
        ['Su fractura duele de forma característica en la tabaquera anatómica.', T(MAN, 'In a fracture of the scaphoid, the characteristic clinical feature is pain and tenderness in the anatomical snuffbox.')],
        ['La sangre le entra por el extremo distal; por eso, si se rompe por la cintura, la parte proximal puede quedarse sin riego y necrosarse.', T(MAN, 'The scaphoid is at particular risk of avascular necrosis after fracture because of its so-called ‘retrograde blood supply’ which enters at its distal end.'), T(MAN, 'This means that a fracture to the middle (or ‘waist’) of the scaphoid may interrupt the blood supply to the proximal part of the scaphoid bone rendering it avascular.')],
      ],
      detalle: [
        ['La fractura del boxeador es la del cuello del quinto metacarpiano; suele producirse al golpear con el puño cerrado contra algo duro.', T(MAN, 'Boxer’s fracture – A fracture of the 5th metacarpal neck. It is usually caused by a clenched fist striking a hard object.')],
      ],
      vista: { ver: ['escafoides'], contexto: ['radio', 'semilunar', 'trapecio', 'trapezoide', 'grande'], camara: 'lateral', lado: 'R' },
      comprobar: 'fun-riego',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['La mano tiene 27 huesos: 8 del carpo, 5 metacarpianos y 14 falanges.', W('Hand', 'These include 14 phalanges (5 proximal, 4 intermediate and 5 distal) of the fingers and thumb, 5 metacarpal bones, and the 8 carpal bones that articulate with the forearm (radius and ulna) at the wrist.')],
        ['Fila proximal: escafoides, semilunar, piramidal y pisiforme; fila distal: trapecio, trapezoide, grande y ganchoso.', T(MAN, 'the proximal row includes the scaphoid, lunate, triquetrum, and pisiform, while the distal row comprises the trapezium, trapezoid, capitate, and hamate.')],
        ['El escafoides y el semilunar forman la muñeca con el radio; el retináculo de los flexores cierra el túnel carpiano, por donde pasa el nervio mediano.', T(MAN, 'the scaphoid and lunate articulate with the radius to form the wrist joint (radiocarpal joint).'), W('Carpal_bones', 'which allows the median nerve and tendons of the anterior forearm muscles to be transmitted to the hand and fingers.')],
        ['El pulgar tiene dos falanges y su metacarpiano, independiente, se articula con el trapecio.', W('Phalanx_bone', 'The thumb and large toe do not have middle phalanges.'), W('Metacarpal_bones', 'the thumb metacarpal articulates with the trapezium and acts independently from the others.')],
      ],
    },
  ],
  preguntas: [
    { id: 'id-escafoides', tipo: 'identificar', estructura: 'escafoides', objetivo: 0, paso: 'carpo' },
    { id: 'id-semilunar', tipo: 'identificar', estructura: 'semilunar', objetivo: 0, paso: 'carpo' },
    { id: 'id-piramidal', tipo: 'identificar', estructura: 'piramidal', objetivo: 0, paso: 'carpo' },
    { id: 'id-pisiforme', tipo: 'identificar', estructura: 'pisiforme', objetivo: 0, paso: 'carpo' },
    { id: 'id-trapecio', tipo: 'identificar', estructura: 'trapecio', objetivo: 0, paso: 'carpo' },
    { id: 'id-trapezoide', tipo: 'identificar', estructura: 'trapezoide', objetivo: 0, paso: 'carpo' },
    { id: 'id-grande', tipo: 'identificar', estructura: 'grande', objetivo: 0, paso: 'carpo' },
    { id: 'id-ganchoso', tipo: 'identificar', estructura: 'ganchoso', objetivo: 0, paso: 'carpo' },
    { id: 'loc-pisiforme', tipo: 'localizar', estructura: 'pisiforme', candidatas: ['piramidal', 'ganchoso'], objetivo: 0, paso: 'carpo' },
    {
      id: 'rel-fila-distal', tipo: 'relacion', objetivo: 0, paso: 'carpo', estructuras: DISTAL,
      enunciado: '¿Qué huesos forman la fila distal del carpo?',
      correcta: 'El trapecio, el trapezoide, el grande y el ganchoso',
      distractores: ['El escafoides, el semilunar, el piramidal y el pisiforme', 'El trapecio, el escafoides, el grande y el pisiforme', 'El semilunar, el trapezoide, el piramidal y el ganchoso'],
      explicacion: 'La fila proximal es escafoides, semilunar, piramidal y pisiforme; la distal, trapecio, trapezoide, grande y ganchoso.',
      evidencia: [T(MAN, 'while the distal row comprises the trapezium, trapezoid, capitate, and hamate.')],
    },
    { id: 'id-metacarpianos', tipo: 'identificar', estructura: 'metacarpianos', objetivo: 1, paso: 'metacarpianos' },
    { id: 'id-falanges-medias', tipo: 'identificar', estructura: 'falanges-medias', objetivo: 1, paso: 'falanges' },
    { id: 'id-falanges-distales', tipo: 'identificar', estructura: 'falanges-distales', objetivo: 1, paso: 'falanges' },
    {
      id: 'rel-pulgar', tipo: 'relacion', objetivo: 1, paso: 'falanges', estructuras: ['falanges-proximales', 'falanges-distales'],
      enunciado: '¿Cuántas falanges tiene el pulgar?',
      correcta: 'Dos: proximal y distal',
      distractores: ['Tres: proximal, media y distal', 'Una sola', 'Dos: media y distal'],
      explicacion: 'Los demás dedos tienen tres falanges; el pulgar, solo la proximal y la distal.',
      evidencia: [W('Phalanx_bone', 'The thumb and large toe do not have middle phalanges.')],
    },
    {
      id: 'rel-total', tipo: 'relacion', objetivo: 1, paso: 'falanges', estructuras: FALANGES,
      enunciado: '¿Cuántas falanges tiene cada mano?',
      correcta: '14',
      distractores: ['15', '10', '12'],
      explicacion: 'Cuatro dedos con tres falanges y el pulgar con dos: 4 × 3 + 2 = 14.',
      evidencia: [W('Phalanx_bone', 'There are 56 phalanges in the human body, with fourteen on each hand and foot.')],
    },
    {
      id: 'rel-radiocarpiana', tipo: 'relacion', objetivo: 2, paso: 'muneca', estructuras: ['escafoides', 'semilunar', 'radio'],
      enunciado: '¿Qué huesos del carpo se articulan con el radio en la muñeca?',
      correcta: 'El escafoides y el semilunar',
      distractores: ['El pisiforme y el piramidal', 'El trapecio y el trapezoide', 'El grande y el ganchoso'],
      explicacion: 'El escafoides y el semilunar, de la fila proximal, forman con el radio la articulación radiocarpiana.',
      evidencia: [T(MAN, 'In the proximal row, the scaphoid and lunate articulate with the radius to form the wrist joint (radiocarpal joint).')],
    },
    {
      id: 'rel-tunel', tipo: 'relacion', objetivo: 2, paso: 'muneca', estructuras: CARPO,
      enunciado: '¿Qué cierra por delante el arco de los huesos del carpo y forma el túnel carpiano?',
      correcta: 'El retináculo de los flexores',
      distractores: ['El retináculo de los extensores', 'La membrana interósea del antebrazo', 'El ligamento colateral ulnar del carpo'],
      explicacion: 'El retináculo de los flexores va de un borde al otro del arco carpiano y lo convierte en un túnel.',
      evidencia: [T(MAN, 'A membranous band, the flexor retinaculum, spans between the medial and lateral edges of the arch, forming the carpal tunnel.')],
    },
    {
      id: 'rel-mediano', tipo: 'relacion', objetivo: 2, paso: 'muneca', estructuras: CARPO,
      enunciado: '¿Qué nervio pasa por el túnel carpiano?',
      correcta: 'El nervio mediano',
      distractores: ['El nervio ulnar', 'El nervio radial', 'El nervio musculocutáneo'],
      explicacion: 'Por el túnel carpiano pasan el nervio mediano y los tendones de los músculos anteriores del antebrazo.',
      evidencia: [W('Carpal_bones', 'which allows the median nerve and tendons of the anterior forearm muscles to be transmitted to the hand and fingers.')],
    },
    {
      id: 'rel-trapecio', tipo: 'relacion', objetivo: 2, paso: 'metacarpianos', estructuras: ['trapecio', 'metacarpianos'],
      enunciado: '¿Con qué hueso del carpo se articula el metacarpiano del pulgar?',
      correcta: 'Con el trapecio',
      distractores: ['Con el trapezoide', 'Con el escafoides', 'Con el grande'],
      explicacion: 'El metacarpiano del pulgar se articula con el trapecio y se mueve con independencia del resto.',
      evidencia: [W('Metacarpal_bones', 'the thumb metacarpal articulates with the trapezium and acts independently from the others.')],
    },
    {
      id: 'seq-pulgar', tipo: 'secuencia', objetivo: 2, paso: 'metacarpianos', estructuras: ['escafoides', 'trapecio', 'metacarpianos', 'falanges-proximales', 'falanges-distales'],
      enunciado: 'Ordena los huesos del radio a la punta del pulgar:',
      orden: ['Radio', 'Escafoides', 'Trapecio', 'Metacarpiano del pulgar', 'Falange proximal del pulgar', 'Falange distal del pulgar'],
      explicacion: 'El escafoides se articula con el radio y, por abajo, con el trapecio; el trapecio, con el metacarpiano del pulgar; después vienen sus dos falanges.',
      evidencia: [T(MAN, 'the scaphoid and lunate articulate with the radius'), W('Carpal_bones', 'the scaphoid contributes to midcarpal stability by articulating distally with the trapezium and the trapezoid.'), W('Metacarpal_bones', 'the thumb metacarpal articulates with the trapezium'), W('Phalanx_bone', 'The proximal phalanges join with the metacarpals')],
    },
    {
      id: 'rel-fractura', tipo: 'relacion', objetivo: 3, paso: 'escafoides', estructuras: ['escafoides'],
      enunciado: '¿Cuál es el hueso del carpo que más se fractura?',
      correcta: 'El escafoides',
      distractores: ['El semilunar', 'El pisiforme', 'El ganchoso'],
      explicacion: 'El escafoides se rompe sobre todo al caer sobre la mano extendida; duele en la tabaquera anatómica.',
      evidencia: [T(MAN, 'The scaphoid bone of the hand is the most commonly fractured carpal bone – typically by falling on an outstretched hand (FOOSH).')],
    },
    {
      id: 'fun-riego', tipo: 'funcion', objetivo: 3, paso: 'escafoides', estructuras: ['escafoides'],
      enunciado: '¿Por qué una fractura por la cintura del escafoides puede dejar sin riego su parte proximal?',
      correcta: 'Porque la sangre le entra por el extremo distal',
      distractores: ['Porque el escafoides no tiene arterias', 'Porque la sangre le entra por el extremo proximal', 'Porque el retináculo de los flexores comprime sus vasos'],
      explicacion: 'El riego del escafoides va de distal a proximal: una fractura por la cintura puede cortarlo para la parte proximal, que puede necrosarse.',
      evidencia: [T(MAN, 'because of its so-called ‘retrograde blood supply’ which enters at its distal end.'), T(MAN, 'may interrupt the blood supply to the proximal part of the scaphoid bone rendering it avascular.')],
    },
  ],
});
