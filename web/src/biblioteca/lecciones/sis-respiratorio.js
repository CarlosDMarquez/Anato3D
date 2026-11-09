// Lección «Vías respiratorias y pulmones». Formato y evidencias: ../formato.js.
import { leccion, W, GUIA, MODELO } from '../formato.js';

const RES = 'Respiratory_system';
const O = (nombre, piezas, papel = 'nucleo', tipo = 'organo', lado = 'impar') => ({ nombre, piezas, lado, papel, tipo });

export default leccion({
  id: 'sis-respiratorio',
  version: 1,
  titulo: 'Vías respiratorias y pulmones',
  resumen: 'Las vías respiratorias altas y bajas, la tráquea y el árbol bronquial, los pulmones con sus lóbulos y cómo entra el aire: el diafragma y los músculos intercostales.',
  lugares: [['cuello', 'visceras-cuello'], ['torax', 'pulmones-pleura']],
  sistemas: ['respiratorio'],
  formato: 'vision-general',
  temas: ['organos'],
  nivel: 1,
  minutos: 11,
  requisitos: ['fund-orientacion'],
  siguiente: ['tor-pulmones', 'tor-respiracion', 'cue-visceras'],
  objetivos: [
    'Distinguir las vías respiratorias altas de las bajas y decir qué forma cada parte.',
    'Seguir el camino del aire desde la tráquea hasta los alvéolos.',
    'Localizar en el modelo la tráquea, los bronquios principales y los lóbulos de cada pulmón.',
    'Explicar qué músculos hacen entrar el aire en reposo.',
  ],
  estructuras: {
    traquea: O('Tráquea', ['Trachea']),
    'bronquio-derecho': O('Bronquio principal derecho', ['Right_main_bronchus']),
    'bronquio-izquierdo': O('Bronquio principal izquierdo', ['Left_main_bronchus']),
    'lobulo-sup-der': O('Lóbulo superior del pulmón derecho', ['Superior_lobe_of_right_lung']),
    'lobulo-med-der': O('Lóbulo medio del pulmón derecho', ['Middle_lobe_of_right_lung']),
    'lobulo-inf-der': O('Lóbulo inferior del pulmón derecho', ['Inferior_lobe_of_right_lung']),
    'lobulo-sup-izq': O('Lóbulo superior del pulmón izquierdo', ['Superior_lobe_of_left_lung']),
    'lobulo-inf-izq': O('Lóbulo inferior del pulmón izquierdo', ['Inferior_lobe_of_left_lung']),
    'mucosa-nasal': O('Mucosa de la cavidad nasal', ['Mucosa_of_nasal_cavity'], 'contexto'),
    nasofaringe: O('Nasofaringe', ['Nasopharynx'], 'contexto'),
    laringe: O('Cartílagos de la laringe', ['Thyroid_cartilage', 'Cricoid_cartilage', 'Epiglottis'], 'contexto'),
    pleura: O('Pleura', ['Pleura'], 'contexto'),
  },
  pasos: [
    {
      id: 'tramos', tipo: 'orientacion', titulo: 'Vías altas y vías bajas',
      texto: [
        ['El aparato respiratorio se divide en vías respiratorias altas y bajas.', W(RES, 'The tract is divided into an upper and a lower respiratory tract.')],
        ['Las altas son la nariz, las fosas nasales, los senos, la faringe y la parte de la laringe que está por encima de las cuerdas vocales.', W(RES, 'The upper tract includes the nose, nasal cavities, sinuses, pharynx and the part of the larynx above the vocal folds.')],
        ['Las bajas son la parte inferior de la laringe, la tráquea, los bronquios, los bronquiolos y los alvéolos.', W(RES, 'includes the lower part of the larynx, the trachea, bronchi, bronchioles and the alveoli')],
      ],
      vista: { capas: { skeletal: 'all', respiratory: 'all' }, ver: [], contexto: [], camara: 'anterior', lado: 'R' },
    },
    {
      id: 'altas', tipo: 'exploracion', titulo: 'Nariz, faringe y laringe',
      texto: [
        ['Las vías altas son la nariz y las fosas nasales, los senos, la faringe y la parte alta de la laringe.', W(RES, 'The upper tract includes the nose, nasal cavities, sinuses, pharynx and the part of the larynx above the vocal folds.')],
        ['En el modelo ves la mucosa de la cavidad nasal, la parte nasal de la faringe y los cartílagos de la laringe, con la epiglotis; los senos no están.', MODELO],
        ['Gira el modelo de lado para verlas entre la cabeza y el cuello.', GUIA],
      ],
      vista: { ver: ['mucosa-nasal', 'nasofaringe', 'laringe'], contexto: ['traquea'], esqueleto: true, camara: 'lateral', lado: 'R' },
    },
    {
      id: 'arbol', tipo: 'explicacion', titulo: 'La tráquea y el árbol bronquial',
      texto: [
        ['La vía más grande es la tráquea, que se divide en el centro del tórax en los dos bronquios principales.', W(RES, 'the largest of these is the trachea, which branches in the middle of the chest into the two main bronchi')],
        ['Los bronquios entran en los pulmones y se ramifican en bronquios secundarios y terciarios, cada vez más finos, y luego en bronquiolos.', W(RES, 'which enter the lungs and branch into progressively narrower secondary and tertiary bronchi, which in turn branch into numerous smaller tubes known as the bronchioles')],
        ['Los bronquiolos son las vías pequeñas que ya no tienen soporte de cartílago.', W(RES, 'Bronchioles are defined as the small airways lacking any cartilaginous support.')],
      ],
      vista: { ver: ['traquea', 'bronquio-derecho', 'bronquio-izquierdo'], contexto: [], esqueleto: true, camara: 'anterior', lado: 'R' },
      comprobar: 'traquea-divide',
    },
    {
      id: 'pulmones', tipo: 'exploracion', titulo: 'Dos pulmones, cinco lóbulos',
      texto: [
        ['Hay dos pulmones; el derecho es más grande, porque el izquierdo comparte espacio con el corazón.', W('Lung', 'Humans have two lungs, a right lung and a left lung.'), W('Lung', 'The right lung is bigger than the left, and the left lung shares space in the chest with the heart.')],
        ['La pleura visceral divide cada pulmón en lóbulos mediante cisuras: el derecho tiene tres y el izquierdo, dos.', W('Lung', 'The inner visceral pleura divides each lung as fissures into sections called lobes.'), W('Lung', 'The right lung has three lobes and the left has two.')],
        ['El pulmón izquierdo tiene en su borde una escotadura, la escotadura cardíaca, que deja sitio al corazón.', W('Lung', 'has an indentation in its border called the cardiac notch of the left lung to accommodate this')],
      ],
      vista: { ver: ['lobulo-sup-der', 'lobulo-med-der', 'lobulo-inf-der', 'lobulo-sup-izq', 'lobulo-inf-izq'], contexto: [], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'lobulo-med-der', texto: 'Toca el lóbulo que solo tiene el pulmón derecho.' },
    },
    {
      id: 'respirar', tipo: 'funcion', titulo: 'Cómo entra el aire',
      texto: [
        ['El intercambio de gases se produce en millones de pequeños sacos, los alvéolos.', W(RES, 'Gas exchange in the lungs occurs in millions of small air sacs.'), W(RES, 'In mammals and reptiles, these are called alveoli')],
        ['En reposo, la inspiración se debe sobre todo a la contracción del diafragma; a la vez, los músculos intercostales elevan las costillas.', W(RES, 'In mammals, inhalation at rest is primarily due to the contraction of the diaphragm.'), W(RES, 'the rib cage is simultaneously enlarged by the ribs being pulled upwards by the intercostal muscles')],
        ['El líquido entre las dos hojas de la pleura reduce el rozamiento cuando los pulmones se expanden y se contraen.', W(RES, 'pleura fluid between double-layered pleura covering of lungs helps in reducing friction while lungs expand and contract')],
        ['Los alvéolos no se ven en el modelo: son microscópicos.', MODELO],
      ],
      vista: { ver: ['lobulo-inf-der', 'lobulo-inf-izq'], contexto: [], fantasma: ['pleura'], esqueleto: true, camara: 'anterior', lado: 'R' },
      comprobar: 'diafragma',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['Vías altas: nariz, fosas nasales, senos, faringe y parte alta de la laringe. Vías bajas: el resto de la laringe, tráquea, bronquios, bronquiolos y alvéolos.', W(RES, 'The upper tract includes the nose, nasal cavities, sinuses, pharynx and the part of the larynx above the vocal folds.'), W(RES, 'includes the lower part of the larynx, the trachea, bronchi, bronchioles and the alveoli')],
        ['La tráquea se divide en dos bronquios principales, que se ramifican hasta los bronquiolos.', W(RES, 'the trachea, which branches in the middle of the chest into the two main bronchi')],
        ['Pulmón derecho: tres lóbulos; izquierdo: dos. El diafragma es el principal músculo de la inspiración en reposo.', W('Lung', 'The right lung has three lobes and the left has two.'), W(RES, 'inhalation at rest is primarily due to the contraction of the diaphragm')],
      ],
    },
  ],
  preguntas: [
    { id: 'id-traquea', tipo: 'identificar', estructura: 'traquea', objetivo: 2, paso: 'arbol' },
    { id: 'id-lobulo-medio', tipo: 'identificar', estructura: 'lobulo-med-der', objetivo: 2, paso: 'pulmones' },
    { id: 'id-bronquio', tipo: 'identificar', estructura: 'bronquio-izquierdo', objetivo: 2, paso: 'arbol' },
    {
      id: 'vias-bajas', tipo: 'relacion', objetivo: 0, paso: 'tramos',
      enunciado: '¿Cuál de estas estructuras pertenece a las vías respiratorias bajas?',
      correcta: 'La tráquea', distractores: ['La faringe', 'Las fosas nasales', 'Los senos paranasales'],
      explicacion: 'La faringe, la nariz, las fosas nasales y los senos son vías altas.',
      evidencia: [W(RES, 'includes the lower part of the larynx, the trachea, bronchi, bronchioles and the alveoli')],
    },
    {
      id: 'traquea-divide', tipo: 'relacion', objetivo: 1, paso: 'arbol', estructuras: ['traquea'],
      enunciado: '¿En qué se divide la tráquea?',
      correcta: 'En los dos bronquios principales', distractores: ['En los bronquiolos', 'En los lóbulos pulmonares', 'En la faringe y el esófago'],
      explicacion: 'Se divide en el centro del tórax en los bronquios principales derecho e izquierdo.',
      evidencia: [W(RES, 'the trachea, which branches in the middle of the chest into the two main bronchi')],
    },
    {
      id: 'orden-aire', tipo: 'secuencia', objetivo: 1, paso: 'arbol',
      enunciado: 'Ordena el camino del aire desde la tráquea.',
      orden: ['Tráquea', 'Bronquio principal', 'Bronquios secundarios y terciarios', 'Bronquiolos', 'Alvéolos'],
      explicacion: 'Cada vía es más fina que la anterior; el intercambio de gases ocurre en los alvéolos.',
      evidencia: [W(RES, 'which enter the lungs and branch into progressively narrower secondary and tertiary bronchi, which in turn branch into numerous smaller tubes known as the bronchioles'), W(RES, 'The bronchioles, or parabronchi, generally open into the microscopic alveoli (in mammals)')],
    },
    {
      id: 'lobulos', tipo: 'relacion', objetivo: 2, paso: 'pulmones',
      enunciado: '¿Cuántos lóbulos tiene cada pulmón?',
      correcta: 'El derecho tres y el izquierdo dos', distractores: ['El izquierdo tres y el derecho dos', 'Los dos tienen tres', 'Los dos tienen dos'],
      explicacion: 'El izquierdo comparte espacio con el corazón: es más pequeño y tiene dos lóbulos.',
      evidencia: [W('Lung', 'The right lung has three lobes and the left has two.')],
    },
    {
      id: 'diafragma', tipo: 'funcion', objetivo: 3, paso: 'respirar',
      enunciado: 'En reposo, ¿qué músculo produce sobre todo la inspiración?',
      correcta: 'El diafragma', distractores: ['Los músculos abdominales', 'El esternocleidomastoideo', 'El trapecio'],
      explicacion: 'El diafragma se contrae y los intercostales elevan las costillas: el tórax se agranda y entra el aire.',
      evidencia: [W(RES, 'In mammals, inhalation at rest is primarily due to the contraction of the diaphragm.')],
    },
    {
      id: 'pleura', tipo: 'funcion', objetivo: 3, paso: 'respirar',
      enunciado: '¿Para qué sirve el líquido entre las dos hojas de la pleura?',
      correcta: 'Reduce el rozamiento cuando los pulmones se expanden y se contraen', distractores: ['Intercambia oxígeno con la sangre', 'Filtra el aire que entra', 'Mantiene abierta la tráquea'],
      explicacion: 'El intercambio de gases ocurre en los alvéolos; la pleura solo facilita el deslizamiento.',
      evidencia: [W(RES, 'pleura fluid between double-layered pleura covering of lungs helps in reducing friction while lungs expand and contract')],
    },
  ],
});
