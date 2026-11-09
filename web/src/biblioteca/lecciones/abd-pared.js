// Lección «Pared abdominal anterolateral». Formato y evidencias: ../formato.js.
import { leccion, T, GUIA, MODELO } from '../formato.js';

const PAR = 'abdomen/muscles/abdominal-wall';
const ING = 'abdomen/areas/inguinal-canal';
const TRI = 'lower-limb/areas/femoral-triangle';
const musculo = (nombre, piezas, extra = {}) => ({ nombre, piezas, lado: 'bilateral', papel: 'nucleo', tipo: 'musculo', ...extra });
const contexto = (nombre, piezas, tipo, extra = {}) => ({ nombre, piezas, lado: 'bilateral', papel: 'contexto', tipo, ...extra });

const PLANOS = ['oblicuo-externo', 'oblicuo-interno', 'transverso'];
const MUSCULOS = [...PLANOS, 'recto', 'piramidal'];
const HUESOS = ['costillas', 'cartilagos', 'xifoides', 'coxal'];

export default leccion({
  id: 'abd-pared',
  version: 1,
  titulo: 'Pared abdominal anterolateral',
  resumen: 'Los músculos de la pared del abdomen: los tres planos (oblicuo externo, oblicuo interno y transverso) y los verticales (recto y piramidal); cómo sus aponeurosis forman la vaina de los rectos y la línea alba; qué hace la pared, y el ligamento y el conducto inguinales.',
  lugares: [['abdomen', 'pared-abdominal']],
  sistemas: ['muscular'],
  formato: 'estructuras',
  temas: ['musculos', 'movimientos'],
  nivel: 2,
  minutos: 16,
  requisitos: ['sis-muscular', 'tor-caja', 'pel-pelvis-osea'],
  siguiente: ['abd-tubo-digestivo', 'tor-respiracion'],
  objetivos: [
    'Localizar los músculos planos (oblicuo externo, oblicuo interno y transverso) y los verticales (recto y piramidal) de la pared abdominal.',
    'Describir la dirección de las fibras de cada músculo plano y el orden de sus capas.',
    'Explicar cómo forman las aponeurosis la vaina de los rectos y la línea alba.',
    'Explicar las funciones de la pared abdominal y de cada músculo.',
    'Describir el ligamento inguinal y el conducto inguinal y qué pasa por él.',
  ],
  estructuras: {
    'oblicuo-externo': musculo('Músculo oblicuo externo del abdomen', ['External_abdominal_oblique_muscle']),
    'oblicuo-interno': musculo('Músculo oblicuo interno del abdomen', ['Internal_abdominal_oblique_muscle']),
    transverso: musculo('Músculo transverso del abdomen', ['Transversus_abdominis_muscle']),
    recto: musculo('Músculo recto del abdomen', ['Rectus_abdominis_muscle']),
    piramidal: musculo('Músculo piramidal', ['Pyramidalis_muscle']),
    'linea-alba': { nombre: 'Línea alba', piezas: ['Linea_alba'], lado: 'impar', papel: 'nucleo', tipo: 'ligamento', confusiones: ['Línea semilunar', 'Ligamento lacunar'] },
    'ligamento-inguinal': { nombre: 'Ligamento inguinal', piezas: ['Inguinal_ligament'], lado: 'bilateral', papel: 'nucleo', tipo: 'ligamento', confusiones: ['Ligamento lacunar', 'Ligamento iliolumbar'] },
    'fascia-transversal': { nombre: 'Fascia transversal', piezas: ['Transversalis_fascia'], lado: 'impar', papel: 'contexto', tipo: 'fascia' },
    'cuadrado-lumbar': contexto('Músculo cuadrado lumbar', ['Quadratus_lumborum_muscle'], 'musculo'),
    'nervio-ilioinguinal': contexto('Nervio ilioinguinal', ['Ilio_inguinal_nerve'], 'nervio'),
    'conducto-deferente': contexto('Conducto deferente (en el cordón espermático)', ['Ductus_deferens'], 'organo', { modelos: ['male'] }),
    'ligamento-redondo': contexto('Ligamento redondo del útero', ['Round_ligament_of_uterus'], 'organo', { modelos: ['female'] }),
    costillas: contexto('Costillas 5.ª a 12.ª', ['Rib_5', 'Rib_6', 'Rib_7', 'Rib_8', 'Rib_9', 'Rib_10', 'Rib_11', 'Rib_12'], 'hueso'),
    cartilagos: contexto('Cartílagos costales 5.º a 7.º', ['Costal_Cartilage_5', 'Costal_Cartilage_6', 'Costal_Cartilage_7'], 'cartilago'),
    xifoides: { nombre: 'Apófisis xifoides', piezas: ['Sternum_Xiphoid_Process'], lado: 'impar', papel: 'contexto', tipo: 'hueso' },
    coxal: contexto('Hueso coxal', ['Hip_Bone'], 'hueso'),
  },
  pasos: [
    {
      id: 'orientacion', tipo: 'orientacion', titulo: 'La pared abdominal',
      texto: [
        ['La pared del abdomen encierra la cavidad abdominal y tiene una parte anterolateral y otra posterior.', T(PAR, 'The abdominal wall encloses the abdominal cavity and can be divided into anterolateral and posterior sections.')],
        ['La anterolateral tiene cuatro capas, de fuera adentro: piel, fascia superficial, músculos con sus fascias y peritoneo parietal.', T(PAR, 'The anterolateral abdominal wall consists of four main layers (external to internal): skin, superficial fascia, muscles and associated fascia, and parietal peritoneum.')],
        ['Sus músculos son de dos tipos: tres planos, a cada lado, y dos verticales, junto a la línea media.', T(PAR, 'Flat muscles – three flat muscles, situated laterally on either side of the abdomen.'), T(PAR, 'Vertical muscles – two vertical muscles, situated near the mid-line of the body.')],
        ['Mira el abdomen de frente y de lado.', GUIA],
      ],
      vista: { ver: MUSCULOS, contexto: [...HUESOS, 'linea-alba'], camara: 'anterolateral', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'De frente se ven los rectos; de lado, los músculos planos.', vistas: [{ nombre: 'De frente', camara: 'anterior' }, { nombre: 'De lado', camara: 'lateral' }] },
    },
    {
      id: 'planos', tipo: 'explicacion', titulo: 'Los tres músculos planos',
      texto: [
        ['Los tres músculos planos están superpuestos y sus fibras se cruzan en direcciones distintas: así refuerzan la pared y reducen el riesgo de hernias.', T(PAR, 'There are three flat muscles located laterally in the abdominal wall, stacked upon one another. Their fibres run in differing directions and cross each other – strengthening the wall and decreasing the risk of abdominal contents herniating through the wall.')],
        ['El oblicuo externo es el más grande y superficial; sus fibras bajan hacia dentro, desde las costillas 5.ª a 12.ª hasta la cresta ilíaca y el tubérculo del pubis.', T(PAR, 'The external oblique is the largest and most superficial flat muscle in the abdominal wall. Its fibres run inferomedially.'), T(PAR, 'Originates from ribs 5-12 and inserts onto the iliac crest and pubic tubercle.')],
        ['El oblicuo interno, debajo, es más pequeño y delgado; sus fibras suben hacia dentro, perpendiculares a las del externo.', T(PAR, 'The internal oblique lies deep to the external oblique. It is smaller and thinner in structure, with its fibres running superomedially (perpendicular to the fibres of the external oblique).')],
        ['El transverso es el más profundo y sus fibras son horizontales; por dentro de él está la fascia transversal.', T(PAR, 'The transversus abdominis is the deepest of the flat muscles, with transversely running fibres. Deep to this muscle is a well-formed layer of fascia, known as the transversalis fascia.')],
      ],
      vista: { ver: PLANOS, contexto: ['costillas', 'coxal', 'fascia-transversal'], camara: 'lateral', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: PLANOS, texto: 'Resalta cada capa y fíjate en la dirección de sus fibras: hacia abajo, hacia arriba y horizontal.' },
      comprobar: 'comp-fibras',
    },
    {
      id: 'verticales', tipo: 'explicacion', titulo: 'El recto del abdomen y el piramidal',
      texto: [
        ['El recto del abdomen es un músculo largo, uno a cada lado de la línea media; la línea alba separa los dos.', T(PAR, 'The rectus abdominis is long, paired muscle, found either side of the midline in the abdominal wall. It is split into two by the linea alba.')],
        ['Va de la cresta del pubis a la apófisis xifoides y a los cartílagos de las costillas 5.ª a 7.ª.', T(PAR, 'Originates from the crest of the pubis bone. It inserts onto the xiphoid process of the sternum and the costal cartilage of ribs 5-7.')],
        ['Lo cruzan bandas fibrosas, las intersecciones tendinosas, que con la línea alba dibujan la «tableta» de quien lo tiene muy desarrollado.', T(PAR, 'At several places, the muscle is intersected by fibrous strips, known as tendinous intersections. The tendinous intersections and the linea alba give rise to the ‘six pack’ seen in individuals with a well-developed rectus abdominis.')],
        ['El piramidal es pequeño y triangular, delante de la parte baja del recto, con la base en el pubis; tensa la línea alba.', T(PAR, 'This is a small triangular muscle, found superficially to the rectus abdominis. It is located inferiorly, with its base on the pubis bone, and the apex of the triangle attached to the linea alba.'), T(PAR, 'Actions: Tenses the linea alba.')],
      ],
      vista: { ver: ['recto', 'piramidal'], contexto: ['linea-alba', 'coxal', 'xifoides', 'cartilagos'], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'recto', texto: 'Toca el músculo vertical que va del pubis a las costillas, junto a la línea media.' },
    },
    {
      id: 'vaina', tipo: 'relaciones', titulo: 'Aponeurosis, vaina de los rectos y línea alba',
      texto: [
        ['Por delante, cada músculo plano termina en una aponeurosis, un tendón ancho y plano, que cubre el recto.', T(PAR, 'In the anteromedial aspect of the abdominal wall, each flat muscle forms an aponeurosis (a broad, flat tendon), which covers the vertical rectus abdominis muscle.')],
        ['Las aponeurosis de los tres se entrelazan en la línea media y forman la línea alba, que va de la xifoides a la sínfisis del pubis.', T(PAR, 'The aponeuroses of all the flat muscles become entwined in the midline, forming the linea alba (a fibrous structure that extends from the xiphoid process of the sternum to the pubic symphysis).')],
        ['También forman la vaina de los rectos, que envuelve el recto y el piramidal: delante pasan la aponeurosis del oblicuo externo y la mitad de la del interno; detrás, la otra mitad del interno y la del transverso.', T(PAR, 'The rectus sheath is formed by the aponeuroses of the three flat muscles and encloses the rectus abdominis and pyramidalis muscles.'), T(PAR, 'Anterior wall – formed by the aponeuroses of the external oblique, and of half of the internal oblique.'), T(PAR, 'Posterior wall – formed by the aponeuroses of half the internal oblique and of the transversus abdominis.')],
        ['A medio camino entre el ombligo y el pubis, todas pasan por delante: desde ahí la vaina ya no tiene pared posterior.', T(PAR, 'Approximately midway between the umbilicus and the pubic symphysis, all the aponeuroses move to the anterior wall of the rectus sheath. At this point, there is no posterior wall to the sheath')],
      ],
      detalle: [
        ['El modelo no tiene las aponeurosis ni la vaina como piezas aparte; la línea alba, sí.', MODELO],
      ],
      vista: { ver: ['linea-alba'], contexto: ['recto', 'oblicuo-externo', 'oblicuo-interno', 'transverso', 'xifoides', 'coxal'], camara: 'anterior', lado: 'R' },
      comprobar: 'rel-linea-alba',
    },
    {
      id: 'funciones', tipo: 'funcion', titulo: 'Qué hace la pared abdominal',
      texto: [
        ['Mantiene las vísceras dentro de la cavidad y en su sitio frente a la gravedad, y las protege.', T(PAR, 'Forms a firm, yet flexible boundary which keeps the abdominal viscera in the abdominal cavity and assists the viscera in maintaining their anatomical position against gravity.'), T(PAR, 'Protects the abdominal viscera from injury.')],
        ['Ayuda a espirar con fuerza empujando las vísceras hacia arriba e interviene en todo lo que aumenta la presión del abdomen: toser, vomitar o defecar.', T(PAR, 'Assists in forceful expiration by pushing the abdominal viscera upwards.'), T(PAR, 'Is involved in any action (coughing, vomiting, defecation) that increases intra-abdominal pressure.')],
        ['El oblicuo externo gira el tronco hacia el lado contrario; el interno, si se contrae de un solo lado, lo gira hacia el mismo lado, y si se contraen los dos, comprime el abdomen.', T(PAR, 'Actions: Contralateral rotation of the torso.'), T(PAR, 'Actions: Bilateral contraction compresses the abdomen, while unilateral contraction ipsilaterally rotates the torso.')],
        ['El transverso comprime el contenido del abdomen; el recto ayuda a comprimirlo, estabiliza la pelvis al andar y baja las costillas.', T(PAR, 'Actions: Compression of abdominal contents.'), T(PAR, 'As well as assisting the flat muscles in compressing the abdominal viscera, the rectus abdominis also stabilises the pelvis during walking, and depresses the ribs.')],
      ],
      detalle: [
        ['Los inervan los nervios toracoabdominales (T7-T11) y el subcostal (T12); el oblicuo interno y el transverso reciben además ramas del plexo lumbar.', T(PAR, 'Innervation: Thoracoabdominal nerves (T7-T11) and subcostal nerve (T12).'), T(PAR, 'Innervation: Thoracoabdominal nerves (T7-T11), subcostal nerve (T12) and branches of the lumbar plexus.')],
      ],
      vista: { ver: ['oblicuo-externo', 'oblicuo-interno', 'transverso', 'recto'], contexto: HUESOS, camara: 'anterolateral', lado: 'R' },
      comprobar: 'fun-oblicuo-externo',
    },
    {
      id: 'inguinal', tipo: 'relaciones', titulo: 'El ligamento y el conducto inguinales',
      texto: [
        ['El ligamento inguinal va de la espina ilíaca anterosuperior al tubérculo del pubis; es una parte enrollada de la aponeurosis del oblicuo externo.', T(TRI, 'inguinal ligament (a ligament that runs from the anterior superior iliac spine to the pubic tubercle)'), T(ING, 'inguinal ligament (a ‘rolled up’ portion of the external oblique aponeurosis)')],
        ['Justo encima y en paralelo a él, el conducto inguinal atraviesa la parte baja de la pared abdominal, hacia abajo y hacia dentro.', T(ING, 'The inguinal canal is a short passage that extends inferiorly and medially through the inferior part of the abdominal wall. It is superior and parallel to the inguinal ligament.')],
        ['Se abre por el anillo profundo, encima del punto medio del ligamento, y por el superficial, justo encima del tubérculo del pubis.', T(ING, 'Found above the midpoint of the inguinal ligament (lateral to the epigastric vessels).'), T(ING, 'Lies just superior to the pubic tubercle.')],
        ['Por él pasan el cordón espermático en el hombre o el ligamento redondo del útero en la mujer, además del nervio ilioinguinal.', T(ING, 'Spermatic cord (biological males only) – contains neurovascular and reproductive structures that supply and drain the testes.'), T(ING, 'Round ligament (biological females only) – originates from the uterine horn and travels through the inguinal canal to attach at the labia majora.'), T(ING, 'Ilioinguinal nerve – contributes towards the sensory innervation of the genitalia')],
      ],
      detalle: [
        ['Es un punto débil de la pared y un lugar frecuente de hernias.', T(ING, 'It is of clinical importance as a potential weakness in the abdominal wall, and thus a common site of herniation.')],
        ['En el modelo masculino se ve el conducto deferente, que va dentro del cordón espermático; en el femenino, el ligamento redondo del útero.', MODELO],
      ],
      vista: { ver: ['ligamento-inguinal'], contexto: ['conducto-deferente', 'ligamento-redondo', 'nervio-ilioinguinal', 'coxal', 'oblicuo-interno'], fantasma: ['oblicuo-externo'], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'ligamento-inguinal', texto: 'Toca el ligamento que va de la espina ilíaca anterosuperior al tubérculo del pubis.' },
      comprobar: 'rel-contenido-inguinal',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['Tres músculos planos, de fuera adentro: oblicuo externo, oblicuo interno y transverso, con las fibras cruzadas; y dos verticales: recto y piramidal.', T(PAR, 'Their fibres run in differing directions and cross each other'), T(PAR, 'There are two vertical muscles located in the midline of the anterolateral abdominal wall – the rectus abdominis and pyramidalis.')],
        ['Sus aponeurosis forman la vaina de los rectos y se entrelazan en la línea alba, de la xifoides al pubis.', T(PAR, 'The rectus sheath is formed by the aponeuroses of the three flat muscles'), T(PAR, 'forming the linea alba (a fibrous structure that extends from the xiphoid process of the sternum to the pubic symphysis)')],
        ['La pared sostiene y protege las vísceras, ayuda a espirar con fuerza y aumenta la presión del abdomen; los oblicuos giran el tronco.', T(PAR, 'Protects the abdominal viscera from injury.'), T(PAR, 'Assists in forceful expiration by pushing the abdominal viscera upwards.'), T(PAR, 'Actions: Contralateral rotation of the torso.')],
        ['Encima del ligamento inguinal, el conducto inguinal lleva el cordón espermático o el ligamento redondo, y es un lugar frecuente de hernias.', T(ING, 'It is superior and parallel to the inguinal ligament.'), T(ING, 'thus a common site of herniation')],
      ],
    },
  ],
  preguntas: [
    { id: 'id-oblicuo-externo', tipo: 'identificar', estructura: 'oblicuo-externo', objetivo: 0, paso: 'planos' },
    { id: 'id-oblicuo-interno', tipo: 'identificar', estructura: 'oblicuo-interno', objetivo: 0, paso: 'planos' },
    { id: 'id-transverso', tipo: 'identificar', estructura: 'transverso', objetivo: 0, paso: 'planos' },
    { id: 'id-recto', tipo: 'identificar', estructura: 'recto', objetivo: 0, paso: 'verticales' },
    { id: 'id-piramidal', tipo: 'identificar', estructura: 'piramidal', objetivo: 0, paso: 'verticales' },
    { id: 'loc-recto', tipo: 'localizar', estructura: 'recto', candidatas: ['oblicuo-externo', 'piramidal'], objetivo: 0, paso: 'verticales' },
    {
      id: 'seq-capas', tipo: 'secuencia', objetivo: 1, paso: 'planos', estructuras: PLANOS,
      enunciado: 'Ordena de superficial a profundo:',
      orden: ['Oblicuo externo', 'Oblicuo interno', 'Transverso del abdomen', 'Fascia transversal'],
      explicacion: 'El oblicuo externo es el más superficial; debajo, el interno; el transverso es el más profundo, y por dentro queda la fascia transversal.',
      evidencia: [T(PAR, 'The external oblique is the largest and most superficial flat muscle in the abdominal wall.'), T(PAR, 'The internal oblique lies deep to the external oblique.'), T(PAR, 'Deep to this muscle is a well-formed layer of fascia, known as the transversalis fascia.')],
    },
    {
      id: 'comp-fibras', tipo: 'comparacion', objetivo: 1, paso: 'planos', estructuras: ['oblicuo-externo', 'oblicuo-interno'],
      enunciado: '¿Cómo van las fibras del oblicuo interno respecto a las del externo?',
      correcta: 'Perpendiculares: suben hacia dentro, mientras las del externo bajan hacia dentro',
      distractores: ['Paralelas a las del externo', 'Verticales, como las del recto', 'Horizontales, como las del transverso'],
      explicacion: 'Las fibras de los tres músculos planos se cruzan: el externo baja hacia dentro, el interno sube hacia dentro y el transverso es horizontal.',
      evidencia: [T(PAR, 'with its fibres running superomedially (perpendicular to the fibres of the external oblique)')],
    },
    { id: 'id-linea-alba', tipo: 'identificar', estructura: 'linea-alba', objetivo: 2, paso: 'vaina' },
    {
      id: 'rel-linea-alba', tipo: 'relacion', objetivo: 2, paso: 'vaina', estructuras: ['linea-alba'],
      enunciado: '¿Qué es la línea alba?',
      correcta: 'El entrelazado de las aponeurosis de los músculos planos en la línea media, de la xifoides al pubis',
      distractores: ['Una intersección tendinosa del recto', 'El borde lateral del recto del abdomen', 'El borde inferior enrollado de la aponeurosis del oblicuo externo'],
      explicacion: 'La línea alba es fibrosa y está en la línea media; el borde lateral del recto es la línea semilunar, y el borde enrollado del oblicuo externo, el ligamento inguinal.',
      evidencia: [T(PAR, 'The aponeuroses of all the flat muscles become entwined in the midline, forming the linea alba (a fibrous structure that extends from the xiphoid process of the sternum to the pubic symphysis).')],
    },
    {
      id: 'rel-vaina', tipo: 'relacion', objetivo: 2, paso: 'vaina', estructuras: ['recto', 'piramidal'],
      enunciado: '¿Qué envuelve la vaina de los rectos?',
      correcta: 'El recto del abdomen y el piramidal',
      distractores: ['El oblicuo externo', 'El cordón espermático', 'El transverso del abdomen'],
      explicacion: 'La vaina, formada por las aponeurosis de los tres músculos planos, envuelve los dos músculos verticales.',
      evidencia: [T(PAR, 'The rectus sheath is formed by the aponeuroses of the three flat muscles and encloses the rectus abdominis and pyramidalis muscles.')],
    },
    {
      id: 'rel-vaina-posterior', tipo: 'relacion', objetivo: 2, paso: 'vaina', estructuras: ['recto'],
      enunciado: '¿Qué ocurre con la vaina de los rectos a medio camino entre el ombligo y el pubis?',
      correcta: 'Todas las aponeurosis pasan por delante y la vaina se queda sin pared posterior',
      distractores: ['Desaparece la pared anterior', 'El recto sale de la vaina y se une al oblicuo externo', 'La vaina se une al ligamento inguinal'],
      explicacion: 'Por debajo de ese punto, el recto queda directamente sobre la fascia transversal.',
      evidencia: [T(PAR, 'Approximately midway between the umbilicus and the pubic symphysis, all the aponeuroses move to the anterior wall of the rectus sheath.')],
    },
    {
      id: 'fun-oblicuo-externo', tipo: 'funcion', objetivo: 3, paso: 'funciones', estructuras: ['oblicuo-externo'],
      enunciado: '¿Hacia dónde gira el tronco el oblicuo externo de un lado?',
      correcta: 'Hacia el lado contrario',
      distractores: ['Hacia su mismo lado', 'No lo gira: solo lo extiende', 'Hacia delante, flexionándolo'],
      explicacion: 'El oblicuo externo gira el tronco hacia el lado opuesto; el interno de un lado, hacia el mismo lado.',
      evidencia: [T(PAR, 'Actions: Contralateral rotation of the torso.')],
    },
    {
      id: 'fun-presion', tipo: 'funcion', objetivo: 3, paso: 'funciones', estructuras: MUSCULOS,
      enunciado: '¿En cuál de estas acciones aumenta la pared abdominal la presión dentro del abdomen?',
      correcta: 'Al toser',
      distractores: ['Al inspirar en reposo', 'Al tragar', 'Al girar la cabeza'],
      explicacion: 'Toser, vomitar o defecar exigen aumentar la presión intraabdominal, y en eso interviene la pared.',
      evidencia: [T(PAR, 'Is involved in any action (coughing, vomiting, defecation) that increases intra-abdominal pressure.')],
    },
    {
      id: 'fun-recto', tipo: 'funcion', objetivo: 3, paso: 'funciones', estructuras: ['recto'],
      enunciado: '¿Qué hace el recto del abdomen, además de ayudar a comprimir el abdomen?',
      correcta: 'Estabiliza la pelvis al andar y baja las costillas',
      distractores: ['Gira el tronco hacia el lado contrario', 'Eleva las costillas al inspirar', 'Tensa la línea alba'],
      explicacion: 'El recto estabiliza la pelvis y baja las costillas; tensar la línea alba es la acción del piramidal.',
      evidencia: [T(PAR, 'the rectus abdominis also stabilises the pelvis during walking, and depresses the ribs.')],
    },
    { id: 'id-ligamento-inguinal', tipo: 'identificar', estructura: 'ligamento-inguinal', objetivo: 4, paso: 'inguinal' },
    {
      id: 'rel-contenido-inguinal', tipo: 'relacion', objetivo: 4, paso: 'inguinal', estructuras: ['ligamento-inguinal'],
      enunciado: '¿Qué pasa por el conducto inguinal en la mujer?',
      correcta: 'El ligamento redondo del útero',
      distractores: ['El cordón espermático', 'La arteria femoral', 'El nervio obturador'],
      explicacion: 'En el hombre pasa el cordón espermático; en la mujer, el ligamento redondo; en los dos, el nervio ilioinguinal.',
      evidencia: [T(ING, 'Round ligament (biological females only) – originates from the uterine horn and travels through the inguinal canal to attach at the labia majora.')],
    },
    {
      id: 'rel-ligamento-inguinal', tipo: 'relacion', objetivo: 4, paso: 'inguinal', estructuras: ['ligamento-inguinal'],
      enunciado: '¿Entre qué dos puntos va el ligamento inguinal?',
      correcta: 'De la espina ilíaca anterosuperior al tubérculo del pubis',
      distractores: ['De la apófisis xifoides a la sínfisis del pubis', 'De la cresta ilíaca a la duodécima costilla', 'De la espina isquiática al sacro'],
      explicacion: 'El ligamento inguinal es el borde inferior enrollado de la aponeurosis del oblicuo externo; de la xifoides al pubis va la línea alba.',
      evidencia: [T(TRI, 'inguinal ligament (a ligament that runs from the anterior superior iliac spine to the pubic tubercle)')],
    },
  ],
});
