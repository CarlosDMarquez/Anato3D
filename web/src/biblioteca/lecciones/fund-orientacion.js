// Lección «Posición anatómica, planos y términos de dirección». Formato y evidencias: ../formato.js.
import { leccion, W, GUIA, MODELO } from '../formato.js';

const POS = 'Standard_anatomical_position';
const PLA = 'Anatomical_plane';
const LOC = 'Anatomical_terms_of_location';
const MANO = ['Scaphoid', 'Lunate', 'Triquetrum', 'Pisiform', 'Trapezium', 'Trapezoid', 'Capitate', 'Hamate',
  ...[1, 2, 3, 4, 5].flatMap((n) => [`Metacarpal_${n}`, `Proximal_Phalanx_Hand_${n}`, `Distal_Phalanx_Hand_${n}`]),
  ...[2, 3, 4, 5].map((n) => `Middle_Phalanx_Hand_${n}`)];

export default leccion({
  id: 'fund-orientacion',
  version: 1,
  titulo: 'Posición anatómica, planos y términos de dirección',
  resumen: 'La postura de referencia con la que se describe el cuerpo, los tres planos que lo dividen y los términos para decir dónde está una estructura respecto a otra: anterior y posterior, superior e inferior, medial y lateral, proximal y distal, superficial y profundo.',
  lugares: [],
  sistemas: [],
  formato: 'fundamentos',
  temas: [],
  nivel: 1,
  minutos: 10,
  siguiente: ['fund-movimientos', 'sis-oseo'],
  objetivos: [
    'Describir la posición anatómica y explicar por qué todas las descripciones se refieren a ella.',
    'Nombrar los tres planos principales y qué partes del cuerpo separa cada uno.',
    'Usar anterior y posterior, superior e inferior y medial y lateral para situar una estructura respecto a otra.',
    'Usar proximal y distal en los miembros y superficial y profundo respecto a la superficie del cuerpo.',
  ],
  estructuras: {
    radio: { nombre: 'Radio', piezas: ['Radius'], lado: 'bilateral', papel: 'nucleo', tipo: 'hueso', confusiones: ['Ulna', 'Húmero', 'Peroné'] },
    ulna: { nombre: 'Ulna', piezas: ['Ulna'], lado: 'bilateral', papel: 'nucleo', tipo: 'hueso', confusiones: ['Radio', 'Húmero', 'Tibia'] },
    humero: { nombre: 'Húmero', piezas: ['Humerus'], lado: 'bilateral', papel: 'contexto', tipo: 'hueso' },
    mano: { nombre: 'Huesos de la mano', piezas: MANO, lado: 'bilateral', papel: 'contexto', tipo: 'hueso' },
    esternon: { nombre: 'Esternón', piezas: ['Sternum_Manubrium', 'Sternum_Body', 'Sternum_Xiphoid_Process'], lado: 'impar', papel: 'contexto', tipo: 'hueso' },
    'piel-antebrazo': { nombre: 'Piel del antebrazo', piezas: ['Skin_Forearm'], lado: 'bilateral', papel: 'contexto', tipo: 'piel' },
  },
  pasos: [
    {
      id: 'posicion', tipo: 'orientacion', titulo: 'La posición de referencia',
      texto: [
        ['En medicina, toda referencia a un lugar del cuerpo se hace respecto a la posición anatómica.', W(POS, 'In medical disciplines, all references to a location on or in the body are made based upon the standard anatomical position.')],
        ['En ella, el cuerpo está de pie, erguido y en reposo.', W(POS, 'In standard anatomical position, the human body is standing erect and at rest.')],
        ['Los pies están juntos o algo separados y los brazos, girados hacia fuera, con las palmas hacia delante y los pulgares apuntando hacia fuera del cuerpo.', W(POS, 'the body has its feet together (or slightly separated), and its arms are rotated outward so that the palms are forward, and the thumbs are pointed away from the body (forearms supine)')],
        ['El modelo 3D está en esta posición: mira cómo el radio y la ulna quedan paralelos y el pulgar, hacia fuera.', MODELO],
      ],
      detalle: [
        ['Se toma siempre la misma postura para evitar confusiones al describir el mismo cuerpo en posturas distintas.', W(POS, 'This helps avoid confusion in terminology when referring to the same organism in different postures.')],
      ],
      vista: { ver: [], contexto: [], esqueleto: true, camara: 'anterior', lado: 'R' },
    },
    {
      id: 'planos', tipo: 'explicacion', titulo: 'Tres planos',
      texto: [
        ['En anatomía humana se usan tres planos principales: el sagital, el coronal (o frontal) y el transversal.', W(PLA, 'In human anatomy three principal planes are used: the sagittal plane, coronal plane (frontal plane), and transverse plane.')],
        ['Un plano sagital es vertical y separa la izquierda de la derecha; el plano medio es el sagital que pasa por el centro del cuerpo.', W(PLA, 'A sagittal plane (also known as anteroposterior plane) is perpendicular to the ground, separating left from right.'), W(PLA, 'The median (or midsagittal) plane is the sagittal plane in the middle of the body')],
        ['Un plano coronal también es vertical y separa la parte anterior de la posterior.', W(PLA, 'A coronal plane (also known as frontal plane) is perpendicular to the ground; it separates the anterior from the posterior')],
        ['Un plano transversal es paralelo al suelo y separa lo superior de lo inferior.', W(PLA, 'A transverse plane (also known as axial or horizontal plane) is parallel to the ground; it separates the superior from the inferior')],
      ],
      vista: { ver: [], contexto: [], esqueleto: true, camara: 'anterior', lado: 'R' },
      actividad: {
        tipo: 'vistas', texto: 'Cambia de vista: de frente miras un plano coronal; de lado, uno sagital; desde arriba, uno transversal.',
        vistas: [{ nombre: 'De frente', camara: 'anterior' }, { nombre: 'De lado', camara: 'lateral' }, { nombre: 'Desde arriba', camara: 'superior' }],
      },
      comprobar: 'plano-sagital',
    },
    {
      id: 'anterior-superior', tipo: 'explicacion', titulo: 'Delante y detrás, arriba y abajo',
      texto: [
        ['Anterior es lo que está delante y posterior, lo que está detrás.', W(LOC, 'Anterior (from Latin  ante \'before\') describes what is in front, and posterior (from Latin  post \'after\') describes what is to the back of something.')],
        ['Superior (o craneal) es lo más cercano a la cabeza e inferior (o caudal), lo que está más abajo, más cerca de los pies.', W(LOC, 'superior (from Latin  super \'above\') or cranial, describes something that is nearer to the head, and inferior (from Latin  inferus \'below\') or caudal describes what is below, and nearer to the feet')],
        ['Por ejemplo, el esternón forma la parte delantera de la caja torácica.', W('Sternum', 'It connects to the ribs via cartilage and forms the front of the rib cage')],
        ['Gira el modelo de lado para ver el esternón delante de la columna.', GUIA],
      ],
      vista: { ver: ['esternon'], contexto: [], esqueleto: true, camara: 'lateral', lado: 'R' },
    },
    {
      id: 'medial-lateral', tipo: 'exploracion', titulo: 'Medial y lateral',
      texto: [
        ['Medial es lo que está cerca del plano medio, o más cerca que otra estructura; lateral, lo que está hacia los lados.', W(LOC, 'Medial (from Latin  medius \'middle\') describes structures close to the median plane, or closer to the median plane than another structure.'), W(LOC, 'Lateral (from Latin  lateralis \'to the side\') describes something to the sides of an animal')],
        ['Por ejemplo, los brazos son laterales al tronco.', W(LOC, 'For example, in a human, the arms are lateral to the torso.')],
        ['En el antebrazo, en posición anatómica, la ulna está en el lado medial y el radio va del lado lateral del codo al lado del pulgar de la muñeca.', W('Ulna', 'when in standard anatomical position, is found on the medial side of the forearm'), W('Radius_(bone)', 'It extends from the lateral side of the elbow to the thumb side of the wrist and runs parallel to the ulna.')],
      ],
      vista: { ver: ['radio', 'ulna'], contexto: ['humero', 'mano'], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'radio', texto: 'Toca el hueso lateral del antebrazo, el del lado del pulgar.' },
    },
    {
      id: 'proximal-distal', tipo: 'explicacion', titulo: 'Proximal y distal',
      texto: [
        ['Proximal y distal describen lo que está cerca o lejos de la masa principal del cuerpo: el brazo es proximal y la mano, distal.', W(LOC, 'are used to describe parts of a feature that are close to or distant from the main mass of the body, respectively'), W(LOC, 'Thus the upper arm in humans is proximal and the hand is distal.')],
        ['Son términos relativos: el codo es distal a una herida del brazo, pero proximal a una del antebrazo.', W(LOC, 'Thus the elbow is distal to a wound on the upper arm, but proximal to a wound on the lower arm.')],
        ['Y se refieren siempre a la posición anatómica: con el codo flexionado, la mano sigue siendo distal al hombro aunque se acerque a él.', W(POS, 'if the elbow is flexed, the hand remains distal to the shoulder even if it approaches the shoulder')],
      ],
      vista: { ver: ['humero', 'radio', 'ulna', 'mano'], contexto: [], camara: 'anterior', lado: 'R' },
      comprobar: 'codo-flexionado',
    },
    {
      id: 'superficial-profundo', tipo: 'explicacion', titulo: 'Superficial y profundo',
      texto: [
        ['Superficial es lo que está cerca de la superficie del cuerpo; profundo, lo que está más lejos de ella.', W(LOC, 'Superficial (from Latin  superficies \'surface\') describes something near the outer surface of the organism.'), W(LOC, 'Deep (from Old English) describes something further away from the surface of the organism.')],
        ['Por ejemplo, el músculo oblicuo externo del abdomen es profundo respecto a la piel.', W(LOC, 'For example, the external oblique muscle of the abdomen is deep to the skin.')],
        ['Aquí la piel del antebrazo se ve translúcida sobre el radio y la ulna, que están en profundidad.', MODELO],
      ],
      vista: { ver: ['radio', 'ulna'], contexto: [], fantasma: ['piel-antebrazo'], camara: 'anterior', lado: 'R' },
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['Todo se describe en la posición anatómica: de pie, con las palmas hacia delante y los pulgares hacia fuera.', W(POS, 'its arms are rotated outward so that the palms are forward, and the thumbs are pointed away from the body')],
        ['Plano sagital: izquierda y derecha. Coronal: delante y detrás. Transversal: arriba y abajo.', W(PLA, 'separating left from right'), W(PLA, 'it separates the anterior from the posterior'), W(PLA, 'it separates the superior from the inferior')],
        ['Medial, hacia el plano medio; lateral, hacia los lados; proximal y distal, hacia el tronco o lejos de él en los miembros; superficial y profundo, respecto a la superficie.', W(LOC, 'describes structures close to the median plane'), W(LOC, 'close to or distant from the main mass of the body'), W(LOC, 'describes something near the outer surface of the organism')],
      ],
    },
  ],
  preguntas: [
    {
      id: 'palmas', tipo: 'relacion', objetivo: 0, paso: 'posicion',
      enunciado: 'En la posición anatómica, ¿hacia dónde miran las palmas de las manos?',
      correcta: 'Hacia delante', distractores: ['Hacia atrás', 'Hacia los muslos', 'Hacia abajo'],
      explicacion: 'Los brazos están girados hacia fuera: las palmas miran hacia delante y los pulgares, hacia fuera del cuerpo.',
      evidencia: [W(POS, 'so that the palms are forward, and the thumbs are pointed away from the body')],
    },
    {
      id: 'por-que', tipo: 'relacion', objetivo: 0, paso: 'posicion',
      enunciado: '¿Por qué se describen todas las estructuras respecto a la posición anatómica?',
      correcta: 'Para no confundirse cuando el mismo cuerpo está en posturas distintas',
      distractores: ['Porque es la postura en la que se estudian los cadáveres', 'Porque es la única postura en la que se ven todos los huesos', 'Porque los términos cambian con cada movimiento'],
      explicacion: 'Una sola postura de referencia hace que «distal» o «lateral» signifiquen lo mismo sea cual sea la postura real.',
      evidencia: [W(POS, 'This helps avoid confusion in terminology when referring to the same organism in different postures.')],
    },
    {
      id: 'plano-sagital', tipo: 'relacion', objetivo: 1, paso: 'planos',
      enunciado: '¿Qué plano separa la mitad izquierda del cuerpo de la derecha?',
      correcta: 'El plano sagital', distractores: ['El plano coronal', 'El plano transversal', 'El plano oblicuo'],
      explicacion: 'El sagital separa izquierda y derecha; el plano medio es el sagital que pasa justo por el centro.',
      evidencia: [W(PLA, 'A sagittal plane (also known as anteroposterior plane) is perpendicular to the ground, separating left from right.')],
    },
    {
      id: 'plano-coronal', tipo: 'relacion', objetivo: 1, paso: 'planos',
      enunciado: '¿Qué separa el plano coronal (o frontal)?',
      correcta: 'La parte anterior de la posterior', distractores: ['La mitad izquierda de la derecha', 'La parte superior de la inferior', 'Lo proximal de lo distal'],
      explicacion: 'El coronal es vertical, como el sagital, pero separa delante de detrás.',
      evidencia: [W(PLA, 'A coronal plane (also known as frontal plane) is perpendicular to the ground; it separates the anterior from the posterior')],
    },
    {
      id: 'plano-transversal', tipo: 'relacion', objetivo: 1, paso: 'planos',
      enunciado: '¿Cómo es el plano transversal respecto al suelo?',
      correcta: 'Paralelo al suelo', distractores: ['Perpendicular al suelo y de lado a lado', 'Perpendicular al suelo y de delante atrás', 'Oblicuo, a 45 grados'],
      explicacion: 'Es horizontal: separa lo superior de lo inferior.',
      evidencia: [W(PLA, 'A transverse plane (also known as axial or horizontal plane) is parallel to the ground')],
    },
    {
      id: 'radio-lateral', tipo: 'relacion', objetivo: 2, paso: 'medial-lateral', estructuras: ['radio', 'ulna'],
      enunciado: 'En la posición anatómica, ¿qué hueso del antebrazo es lateral?',
      correcta: 'El radio', distractores: ['La ulna', 'El húmero', 'Ninguno: uno está delante del otro'],
      explicacion: 'El radio va del lado lateral del codo al lado del pulgar; la ulna está en el lado medial.',
      evidencia: [W('Radius_(bone)', 'It extends from the lateral side of the elbow to the thumb side of the wrist'), W('Ulna', 'is found on the medial side of the forearm')],
    },
    { id: 'loc-radio', tipo: 'localizar', estructura: 'radio', candidatas: ['ulna', 'humero'], objetivo: 2, paso: 'medial-lateral' },
    {
      id: 'cabeza-pies', tipo: 'relacion', objetivo: 2, paso: 'anterior-superior',
      enunciado: 'Una estructura más cercana a la cabeza que otra es…',
      correcta: 'superior (o craneal) respecto a ella', distractores: ['inferior (o caudal) respecto a ella', 'proximal respecto a ella', 'anterior respecto a ella'],
      explicacion: 'Superior o craneal: hacia la cabeza. Inferior o caudal: hacia los pies.',
      evidencia: [W(LOC, 'or cranial, describes something that is nearer to the head')],
    },
    {
      id: 'codo-flexionado', tipo: 'relacion', objetivo: 3, paso: 'proximal-distal',
      enunciado: 'Con el codo flexionado y la mano cerca del hombro, ¿la mano es distal o proximal al hombro?',
      correcta: 'Distal, igual que en la posición anatómica', distractores: ['Proximal, porque ahora está cerca', 'Depende de cuánto se flexione el codo', 'Ninguna de las dos: solo vale con el brazo estirado'],
      explicacion: 'Los términos se refieren a la posición anatómica, no a la postura del momento.',
      evidencia: [W(POS, 'if the elbow is flexed, the hand remains distal to the shoulder even if it approaches the shoulder')],
    },
    {
      id: 'orden-proximal', tipo: 'secuencia', objetivo: 3, paso: 'proximal-distal',
      enunciado: 'Ordena de proximal a distal.',
      orden: ['El brazo', 'El codo', 'El antebrazo', 'La mano'],
      explicacion: 'Del tronco hacia fuera: el brazo es proximal, la mano distal, y el codo queda entre los dos segmentos.',
      evidencia: [W(LOC, 'Thus the upper arm in humans is proximal and the hand is distal.'), W(LOC, 'Thus the elbow is distal to a wound on the upper arm, but proximal to a wound on the lower arm.')],
    },
    {
      id: 'profundo', tipo: 'relacion', objetivo: 3, paso: 'superficial-profundo',
      enunciado: 'Respecto a la piel, el músculo oblicuo externo del abdomen es…',
      correcta: 'profundo', distractores: ['superficial', 'proximal', 'lateral'],
      explicacion: 'Está más lejos de la superficie que la piel: es profundo a ella.',
      evidencia: [W(LOC, 'For example, the external oblique muscle of the abdomen is deep to the skin.')],
    },
  ],
});
