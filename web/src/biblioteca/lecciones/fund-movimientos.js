// Lección «Términos de movimiento». Formato y evidencias: ../formato.js.
import { leccion, W, GUIA, MODELO } from '../formato.js';

const MOV = 'Anatomical_terms_of_motion';
const hueso = (nombre, piezas, lado = 'bilateral') => ({ nombre, piezas, lado, papel: 'contexto', tipo: 'hueso' });

export default leccion({
  id: 'fund-movimientos',
  version: 1,
  titulo: 'Términos de movimiento',
  resumen: 'Cómo se nombran los movimientos de las articulaciones: flexión y extensión, abducción y aducción, rotaciones, circunducción, pronación y supinación, los movimientos del pie y la elevación y la depresión.',
  lugares: [],
  sistemas: ['articular', 'muscular'],
  formato: 'fundamentos',
  temas: ['movimientos', 'articulaciones'],
  nivel: 1,
  minutos: 12,
  requisitos: ['fund-orientacion'],
  siguiente: ['sis-articular', 'sis-muscular'],
  objetivos: [
    'Explicar qué cambia en la flexión y en la extensión y aplicarlo al codo, al hombro y a la cadera.',
    'Distinguir la abducción de la aducción y la rotación medial de la lateral.',
    'Describir la pronación y la supinación del antebrazo.',
    'Nombrar los movimientos del pie: flexión dorsal, flexión plantar, inversión y eversión.',
    'Reconocer la elevación, la depresión y la circunducción.',
  ],
  estructuras: {
    humero: hueso('Húmero', ['Humerus']),
    radio: hueso('Radio', ['Radius']),
    ulna: hueso('Ulna', ['Ulna']),
    escapula: hueso('Escápula', ['Scapula']),
    clavicula: hueso('Clavícula', ['Clavicle']),
    femur: hueso('Fémur', ['Femur']),
    coxal: hueso('Hueso coxal', ['Hip_Bone']),
    tibia: hueso('Tibia', ['Tibia']),
    fibula: hueso('Fíbula', ['Fibula']),
    talus: hueso('Talus', ['Talus']),
    calcaneo: hueso('Calcáneo', ['Calcaneus']),
  },
  pasos: [
    {
      id: 'angulos', tipo: 'orientacion', titulo: 'Moverse es cambiar ángulos',
      texto: [
        ['Los movimientos angulares se producen en las articulaciones sinoviales y aumentan o disminuyen el ángulo entre los huesos.', W(MOV, 'Angular motions occur over synovial joints and either increase or decrease the angles between bones.')],
        ['La flexión y la extensión son movimientos angulares: acercan o separan dos ejes de una articulación.', W(MOV, 'Flexion and extension are examples of angular motions, in which two axes of a joint are brought closer together or moved further apart.')],
        ['El modelo está quieto en posición anatómica: imagina cada movimiento partiendo de ella.', MODELO],
      ],
      vista: { ver: [], contexto: [], esqueleto: true, camara: 'anterolateral', lado: 'R' },
    },
    {
      id: 'flexion', tipo: 'explicacion', titulo: 'Flexión y extensión',
      texto: [
        ['La flexión es un movimiento de doblar que disminuye el ángulo entre un segmento y el segmento proximal a él.', W(MOV, 'Flexion is a bending movement that decreases the angle between a segment and its proximal segment.')],
        ['La extensión es lo contrario: un movimiento de enderezar que aumenta el ángulo.', W(MOV, 'Extension is the opposite of flexion, a straightening movement that increases the angle between body parts.')],
        ['En el hombro y en la cadera, flexionar lleva el brazo o la pierna hacia delante y extender, hacia atrás.', W(MOV, 'Flexion of the shoulder or hip is movement of the arm or leg forward.'), W(MOV, 'Extension of the hip or shoulder moves the arm or leg backward.')],
        ['Mira el codo de lado: al flexionarlo, el antebrazo se acercaría al brazo y el ángulo entre ellos se cerraría.', GUIA],
      ],
      vista: { ver: ['humero', 'radio', 'ulna'], contexto: [], camara: 'lateral', lado: 'R' },
      comprobar: 'flexion-codo',
    },
    {
      id: 'abduccion', tipo: 'explicacion', titulo: 'Abducción y aducción',
      texto: [
        ['La abducción aleja una parte de la línea media del cuerpo y la aducción la acerca.', W(MOV, 'Abduction is the motion of a structure away from the midline while adduction is motion towards the center of the body.')],
        ['Los músculos que lo hacen se llaman abductores y aductores.', W(MOV, 'carried out by one or more abductor muscles'), W(MOV, 'carried out by one or more adductor muscles')],
        ['Separa el brazo del costado (abducción) y vuelve a pegarlo (aducción): el movimiento ocurre en el hombro.', GUIA],
      ],
      detalle: [
        ['En la muñeca, la aducción se llama desviación ulnar (la mano va hacia el meñique) y la abducción, desviación radial (hacia el pulgar).', W(MOV, 'Adduction of the wrist is also known as ulnar deviation which moves the hand towards the ulnar styloid (or, towards the little finger).'), W(MOV, 'Abduction of the wrist is also called radial deviation which moves the hand moving towards the radial styloid (or, towards the thumb).')],
      ],
      vista: { ver: ['humero'], contexto: ['escapula', 'clavicula'], esqueleto: true, camara: 'anterior', lado: 'R' },
    },
    {
      id: 'rotacion', tipo: 'explicacion', titulo: 'Rotación y circunducción',
      texto: [
        ['La rotación medial (o interna) gira hacia el eje del cuerpo y la rotación lateral (o externa) se aleja de él.', W(MOV, 'Internal rotation (medial rotation or intorsion) is rotation towards the axis of the body, carried out by internal rotators.'), W(MOV, 'External rotation (lateral rotation or extorsion) is rotation away from the center of the body, carried out by external rotators.')],
        ['La circunducción es un movimiento en cono que combina flexión, extensión, aducción y abducción.', W(MOV, 'Circumduction is a conical movement of a body part'), W(MOV, 'Circumduction is a combination of flexion, extension, adduction and abduction.')],
        ['Se hace mejor en las articulaciones esféricas, como la cadera y el hombro.', W(MOV, 'Circumduction can be best performed at ball and socket joints, such as the hip and shoulder')],
      ],
      vista: { ver: ['femur', 'coxal'], contexto: [], camara: 'anterior', lado: 'R' },
    },
    {
      id: 'pronacion', tipo: 'exploracion', titulo: 'Pronación y supinación',
      texto: [
        ['En la supinación la palma mira hacia delante y en la pronación, hacia atrás (en la posición anatómica).', W(MOV, 'they are the rotation of the forearm or foot so that in the standard anatomical position the palm or sole is facing anteriorly when in supination and posteriorly when in pronation')],
        ['En la pronación del antebrazo, el pulgar apunta hacia el cuerpo; en la supinación, el antebrazo o la palma giran hacia fuera.', W(MOV, 'Pronation at the forearm is a rotational movement where the hand and upper arm are turned so the thumbs point towards the body.'), W(MOV, 'Supination of the forearm occurs when the forearm or palm are rotated outwards.')],
        ['La articulación radioulnar es la que permite la supinación y la pronación.', W('Radius_(bone)', 'The radioulnar joint allows for supination and pronation of the forearm.')],
        ['En el modelo, los antebrazos están en supinación, como pide la posición anatómica: el radio y la ulna, paralelos.', MODELO],
      ],
      vista: { ver: ['radio', 'ulna'], contexto: ['humero'], camara: 'anterior', lado: 'R' },
      comprobar: 'palma-pronacion',
    },
    {
      id: 'pie', tipo: 'explicacion', titulo: 'Los movimientos del pie',
      texto: [
        ['La flexión dorsal y la flexión plantar son la extensión y la flexión del pie en el tobillo.', W(MOV, 'Dorsiflexion and plantar flexion refer to extension or flexion of the foot at the ankle.')],
        ['En la flexión dorsal, los dedos se acercan a la espinilla; en la flexión plantar disminuye el ángulo entre la planta y la parte posterior de la pierna, como al ponerse de puntillas.', W(MOV, 'Dorsiflexion is where the toes are brought closer to the shin.'), W(MOV, 'Plantar flexion or plantarflexion is the movement which decreases the angle between the sole of the foot and the back of the leg; for example, the movement when depressing a car pedal or standing on tiptoes.')],
        ['La inversión gira la planta hacia el plano medio y la eversión, en sentido contrario.', W(MOV, 'Inversion is the movement of the sole towards the median plane.'), W(MOV, 'Eversion is the movement of the sole of the foot away from the median plane.')],
      ],
      detalle: [
        ['Un tobillo torcido es, precisamente, una inversión.', W(MOV, 'For example, inversion describes the motion when an ankle is twisted.')],
      ],
      vista: { ver: ['talus', 'calcaneo'], contexto: ['tibia', 'fibula'], camara: 'lateral', lado: 'R' },
    },
    {
      id: 'elevacion', tipo: 'explicacion', titulo: 'Elevación, depresión y otros',
      texto: [
        ['La elevación es un movimiento hacia arriba y la depresión, hacia abajo; encoger los hombros es elevar la escápula.', W(MOV, 'Elevation is movement in a superior direction.'), W(MOV, 'Depression is movement in an inferior direction, the opposite of elevation.'), W(MOV, 'For example, shrugging is an example of elevation of the scapula.')],
        ['La protracción y la retracción son movimientos hacia delante y hacia atrás, como los del brazo en el hombro.', W(MOV, 'Protraction and retraction is an anterior (protraction) or posterior (retraction) movement, such as of the arm at the shoulders')],
        ['La oposición es el movimiento de agarrar con el pulgar y los dedos.', W(MOV, 'Opposition is the movement that involves grasping of the thumb and fingers.')],
      ],
      vista: { ver: ['escapula', 'clavicula'], contexto: [], esqueleto: true, camara: 'posterior', lado: 'R' },
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['Flexión: cierra el ángulo; extensión: lo abre.', W(MOV, 'decreases the angle between a segment and its proximal segment'), W(MOV, 'a straightening movement that increases the angle between body parts')],
        ['Abducción: lejos de la línea media; aducción: hacia ella. Rotación medial: hacia el eje del cuerpo; lateral: lejos de él.', W(MOV, 'Abduction is the motion of a structure away from the midline while adduction is motion towards the center of the body.'), W(MOV, 'is rotation towards the axis of the body')],
        ['Supinación: palma hacia delante; pronación: hacia atrás. En el pie: flexión dorsal y plantar, inversión y eversión.', W(MOV, 'the palm or sole is facing anteriorly when in supination and posteriorly when in pronation'), W(MOV, 'Dorsiflexion and plantar flexion refer to extension or flexion of the foot at the ankle.')],
      ],
    },
  ],
  preguntas: [
    {
      id: 'flexion-codo', tipo: 'funcion', objetivo: 0, paso: 'flexion',
      enunciado: '¿Qué le ocurre al ángulo entre el brazo y el antebrazo cuando se flexiona el codo?',
      correcta: 'Disminuye', distractores: ['Aumenta', 'No cambia: solo gira el antebrazo', 'Aumenta y luego disminuye'],
      explicacion: 'Flexionar es doblar: disminuye el ángulo entre un segmento y el proximal a él.',
      evidencia: [W(MOV, 'Flexion is a bending movement that decreases the angle between a segment and its proximal segment.')],
    },
    {
      id: 'flexion-cadera', tipo: 'funcion', objetivo: 0, paso: 'flexion',
      enunciado: 'Flexionar la cadera lleva la pierna…',
      correcta: 'hacia delante', distractores: ['hacia atrás', 'hacia fuera, lejos de la línea media', 'hacia dentro, hacia la otra pierna'],
      explicacion: 'En el hombro y la cadera, la flexión lleva el miembro hacia delante y la extensión, hacia atrás.',
      evidencia: [W(MOV, 'Flexion of the shoulder or hip is movement of the arm or leg forward.')],
    },
    {
      id: 'abduccion', tipo: 'funcion', objetivo: 1, paso: 'abduccion',
      enunciado: 'Separar el brazo del costado, alejándolo de la línea media, es una…',
      correcta: 'abducción', distractores: ['aducción', 'flexión', 'rotación medial'],
      explicacion: 'Abducción: lejos de la línea media. Aducción: hacia ella.',
      evidencia: [W(MOV, 'Abduction is the motion of a structure away from the midline')],
    },
    {
      id: 'rotacion', tipo: 'funcion', objetivo: 1, paso: 'rotacion',
      enunciado: 'La rotación que gira una parte hacia el eje del cuerpo se llama…',
      correcta: 'rotación medial (o interna)', distractores: ['rotación lateral (o externa)', 'circunducción', 'abducción'],
      explicacion: 'Medial o interna: hacia el eje del cuerpo. Lateral o externa: lejos de él.',
      evidencia: [W(MOV, 'Internal rotation (medial rotation or intorsion) is rotation towards the axis of the body')],
    },
    {
      id: 'palma-pronacion', tipo: 'funcion', objetivo: 2, paso: 'pronacion',
      enunciado: 'Partiendo de la posición anatómica, en la pronación la palma de la mano mira…',
      correcta: 'hacia atrás', distractores: ['hacia delante', 'hacia arriba', 'hacia el muslo, sin girar'],
      explicacion: 'Supinación: palma hacia delante (como en la posición anatómica). Pronación: hacia atrás, con el pulgar hacia el cuerpo.',
      evidencia: [W(MOV, 'the palm or sole is facing anteriorly when in supination and posteriorly when in pronation')],
    },
    {
      id: 'radioulnar', tipo: 'relacion', objetivo: 2, paso: 'pronacion', estructuras: ['radio', 'ulna'],
      enunciado: '¿Qué articulación permite la pronación y la supinación del antebrazo?',
      correcta: 'La articulación radioulnar', distractores: ['La articulación del hombro', 'La articulación entre el húmero y la ulna', 'Las articulaciones de los dedos'],
      explicacion: 'Es la articulación entre el radio y la ulna la que permite girar el antebrazo.',
      evidencia: [W('Radius_(bone)', 'The radioulnar joint allows for supination and pronation of the forearm.')],
    },
    {
      id: 'puntillas', tipo: 'funcion', objetivo: 3, paso: 'pie',
      enunciado: 'Ponerse de puntillas es un ejemplo de…',
      correcta: 'flexión plantar', distractores: ['flexión dorsal', 'inversión', 'eversión'],
      explicacion: 'La flexión plantar disminuye el ángulo entre la planta y la parte posterior de la pierna.',
      evidencia: [W(MOV, 'for example, the movement when depressing a car pedal or standing on tiptoes')],
    },
    {
      id: 'inversion', tipo: 'funcion', objetivo: 3, paso: 'pie',
      enunciado: 'Girar la planta del pie hacia el plano medio es una…',
      correcta: 'inversión', distractores: ['eversión', 'flexión dorsal', 'aducción'],
      explicacion: 'Inversión: la planta hacia el plano medio. Eversión: lejos de él.',
      evidencia: [W(MOV, 'Inversion is the movement of the sole towards the median plane.')],
    },
    {
      id: 'encoger', tipo: 'funcion', objetivo: 4, paso: 'elevacion',
      enunciado: 'Encoger los hombros es una…',
      correcta: 'elevación de la escápula', distractores: ['depresión de la escápula', 'abducción del brazo', 'retracción del brazo'],
      explicacion: 'Elevación es un movimiento hacia arriba; encoger los hombros eleva la escápula.',
      evidencia: [W(MOV, 'For example, shrugging is an example of elevation of the scapula.')],
    },
    {
      id: 'circunduccion', tipo: 'funcion', objetivo: 4, paso: 'rotacion',
      enunciado: '¿Qué movimiento describe un cono y combina flexión, extensión, aducción y abducción?',
      correcta: 'La circunducción', distractores: ['La rotación lateral', 'La oposición', 'La protracción'],
      explicacion: 'La circunducción se hace sobre todo en articulaciones esféricas como la cadera y el hombro.',
      evidencia: [W(MOV, 'Circumduction is a combination of flexion, extension, adduction and abduction.')],
    },
  ],
});
