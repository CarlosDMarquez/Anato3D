// Lección «Médula espinal, meninges y nervios espinales». Formato y evidencias: ../formato.js.
import { leccion, W, T, GUIA, MODELO } from '../formato.js';

const MED = 'back/nerves/spinal-cord';
const SC = 'Spinal_cord';
const impar = (nombre, piezas, tipo = 'snc') => ({ nombre, piezas, lado: 'impar', papel: 'nucleo', tipo });
const bilateral = (nombre, piezas, tipo) => ({ nombre, piezas, lado: 'bilateral', papel: 'nucleo', tipo });
const contexto = (nombre, piezas, tipo, lado = 'impar') => ({ nombre, piezas, lado, papel: 'contexto', tipo });

const CERVICALES = ['Vertebra_C1_Atlas', 'Vertebra_C2_Axis', 'Vertebra_C3', 'Vertebra_C4', 'Vertebra_C5', 'Vertebra_C6', 'Vertebra_C7'];
const TORACICAS = ['Vertebra_T1', 'Vertebra_T2', 'Vertebra_T3', 'Vertebra_T4', 'Vertebra_T5', 'Vertebra_T6', 'Vertebra_T7', 'Vertebra_T8', 'Vertebra_T9', 'Vertebra_T10', 'Vertebra_T11', 'Vertebra_T12'];
const LUMBARES = ['Vertebra_L1', 'Vertebra_L2', 'Vertebra_L3', 'Vertebra_L4', 'Vertebra_L5'];
const TRACTOS = ['fasciculo-gracil', 'fasciculo-cuneiforme', 'espinotalamico', 'corticoespinal'];

export default leccion({
  id: 'esp-medula',
  version: 1,
  titulo: 'Médula espinal, meninges y nervios espinales',
  resumen: 'La médula espinal, del bulbo raquídeo a L2, con sus dos engrosamientos y la cola de caballo; las meninges que la envuelven; por dentro, la sustancia gris en forma de mariposa y los tractos de la sustancia blanca (qué lleva cada uno y dónde se cruza), y cómo nacen los 31 pares de nervios espinales.',
  lugares: [['espalda', 'medula']],
  sistemas: ['nervioso'],
  formato: 'estructuras',
  temas: ['nervios'],
  nivel: 2,
  minutos: 20,
  requisitos: ['esp-columna', 'sis-nervioso'],
  siguiente: ['ms-nervios', 'mi-nervios', 'cab-encefalo'],
  objetivos: [
    'Describir dónde empieza y acaba la médula y qué es la cola de caballo.',
    'Enumerar las meninges y explicar por qué la punción lumbar se hace por debajo de L2.',
    'Distinguir la sustancia gris de la blanca y las astas anterior y posterior.',
    'Relacionar los grandes tractos con lo que llevan y dónde se cruzan.',
    'Explicar cómo se forma un nervio espinal a partir de sus raíces.',
  ],
  estructuras: {
    'sustancia-blanca': impar('Sustancia blanca de la médula espinal', ['White_matter_of_spinal_cord']),
    'asta-anterior': impar('Asta anterior de la médula', ['Anterior_horn_of_spinal_cord']),
    'asta-posterior': impar('Asta posterior de la médula', ['Posterior_horn_of_spinal_cord']),
    'canal-central': impar('Canal central de la médula', ['Central_canal']),
    'cola-caballo': { ...impar('Cola de caballo', ['Cauda_equina'], 'nervio'), confusiones: ['Nervio ciático', 'Raíces anteriores de los nervios espinales'] },
    dura: impar('Duramadre espinal', ['Spinal_dura']),
    'fasciculo-gracil': impar('Fascículo grácil', ['Gracile_fasciculus']),
    'fasciculo-cuneiforme': impar('Fascículo cuneiforme', ['Cuneate_fasciculus']),
    espinotalamico: impar('Tracto espinotalámico lateral', ['Lateral_spinothalamic_tract']),
    corticoespinal: impar('Tracto corticoespinal lateral', ['Lateral_corticospinal_tract']),
    'raiz-anterior': { ...bilateral('Raíces anteriores de los nervios espinales', ['Anterior_root_of_spinal_nerve'], 'nervio'), confusiones: ['Tronco simpático'] },
    'raiz-posterior': bilateral('Raíces posteriores de los nervios espinales', ['Posterior_root_of_spinal_nerve'], 'nervio'),
    ganglio: { ...bilateral('Ganglios espinales', ['Spinal_ganglion'], 'ganglio'), papel: 'contexto' },
    bulbo: contexto('Bulbo raquídeo', ['Medulla_oblongata'], 'snc', 'ambos'),
    'arteria-espinal': contexto('Arteria espinal anterior', ['Anterior_spinal_artery'], 'arteria', 'ambos'),
    cervicales: contexto('Vértebras cervicales', CERVICALES, 'hueso'),
    toracicas: contexto('Vértebras torácicas', TORACICAS, 'hueso'),
    lumbares: contexto('Vértebras lumbares', LUMBARES, 'hueso'),
    l2: contexto('Vértebra L2', ['Vertebra_L2'], 'hueso'),
    sacro: contexto('Sacro', ['Sacrum'], 'hueso'),
  },
  pasos: [
    {
      id: 'orientacion', tipo: 'orientacion', titulo: 'La médula espinal',
      texto: [
        ['La médula espinal es un cordón de tejido nervioso que va del tronco del encéfalo a las vértebras lumbares; con el encéfalo forma el sistema nervioso central.', T(MED, 'The spinal cord is a tubular bundle of nervous tissue and supporting cells that extends from the brainstem to the lumbar vertebrae. Together, the spinal cord and the brain form the central nervous system.')],
        ['Lleva las órdenes de la corteza motora al cuerpo y la información de los nervios sensitivos al encéfalo.', W(SC, 'The spinal cord functions primarily in the transmission of nerve signals from the motor cortex to the body, and from the afferent fibers of the sensory neurons to the sensory cortex.')],
        ['Mírala de lado, dentro de la columna translúcida.', GUIA],
      ],
      vista: { ver: ['sustancia-blanca'], contexto: ['bulbo', 'cola-caballo'], fantasma: ['cervicales', 'toracicas', 'lumbares', 'sacro'], camara: 'lateral', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'Recorre la médula.', vistas: [{ nombre: 'De lado', camara: 'lateral' }, { nombre: 'Por detrás', camara: 'posterior' }] },
      comprobar: 'fun-medula',
    },
    {
      id: 'recorrido', tipo: 'explicacion', titulo: 'De dónde a dónde',
      texto: [
        ['Continúa el bulbo raquídeo, baja por el canal vertebral y se afila en L2, en el cono medular: ocupa unos dos tercios del canal.', T(MED, 'The spinal cord arises cranially as a continuation of the medulla oblongata (part of the brainstem).'), T(MED, 'At the L2 vertebral level the spinal cord tapers off, forming the conus medullaris.'), T(MED, 'it occupies around two thirds of the vertebral canal.')],
        ['Por debajo, los nervios espinales bajan juntos en la cola de caballo, llamada así por su parecido.', T(MED, 'The spinal nerves that arise from the end of the spinal cord are bundled together, forming a structure known as the cauda equina.'), W('Cauda_equina', 'The cauda equina was named after its resemblance to a horse')],
        ['Tiene dos engrosamientos: el cervical (C4 a T1), de donde sale el plexo braquial, y el lumbar (T11 a L1), de donde salen los plexos lumbar y sacro.', T(MED, 'The cervical enlargement is located proximally, at the C4-T1 level. It represents the origin of the brachial plexus. Between T11 and L1 is the lumbar enlargement, representing the origin of the lumbar and sacral plexi.')],
      ],
      vista: { ver: ['cola-caballo'], contexto: ['sustancia-blanca', 'l2', 'sacro'], fantasma: ['lumbares'], camara: 'lateral', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'cola-caballo', texto: 'Toca el haz de nervios que sigue por debajo del final de la médula.' },
      comprobar: 'rel-fin',
    },
    {
      id: 'meninges', tipo: 'explicacion', titulo: 'Las meninges',
      texto: [
        ['Tres membranas la envuelven: la duramadre, la aracnoides y la piamadre; contienen el líquido cefalorraquídeo, que la sostiene y protege.', T(MED, 'The spinal meninges are three membranes that surround the spinal cord – the dura mater, arachnoid mater, and pia mater. They contain cerebrospinal fluid, acting to support and protect the spinal cord.')],
        ['La duramadre, la más externa, va del agujero magno al filum terminal; entre ella y las vértebras queda el espacio epidural.', T(MED, 'The spinal dura mater is the most external of the meninges. It extends from the foramen magnum to the filum terminale, separated from the walls of the vertebral canal by the epidural space.')],
        ['Por debajo del cono medular, el espacio subaracnoideo se ensancha en la cisterna lumbar, donde se hace la punción lumbar.', T(MED, 'Distal to the conus medullaris, the subarachnoid space expands, forming the lumbar cistern. This space accessed during a lumbar puncture (to obtain CSF fluid) and spinal anaesthesia.')],
      ],
      detalle: [
        ['El modelo tiene la duramadre espinal, pero no la aracnoides ni la piamadre.', MODELO],
      ],
      vista: { ver: ['dura'], contexto: ['cola-caballo', 'l2', 'sacro'], fantasma: ['lumbares'], camara: 'posterior', lado: 'R' },
      comprobar: 'rel-puncion',
    },
    {
      id: 'gris-blanca', tipo: 'exploracion', titulo: 'Sustancia gris y blanca',
      texto: [
        ['Por fuera está la sustancia blanca, con los tractos de axones motores y sensitivos; por dentro, la gris, en forma de mariposa.', W(SC, 'In cross-section, the peripheral region of the cord contains neuronal white matter tracts containing sensory and motor axons.'), W(SC, 'Internal to this peripheral region is the grey matter, which contains the nerve cell bodies arranged in the three grey columns that give the region its butterfly-shape.')],
        ['Las columnas anterior y posterior de la sustancia gris se llaman astas; en las anteriores están las neuronas motoras.', W(SC, 'The anterior and posterior grey columns present as projections of grey matter and are also known as the horns of the spinal cord.'), W(SC, 'Ventral roots consist of efferent fibers that arise from motor neurons whose cell bodies are found in the ventral (or anterior) gray horns of the spinal cord.')],
      ],
      vista: { ver: ['asta-anterior', 'asta-posterior'], contexto: ['canal-central'], fantasma: ['sustancia-blanca'], camara: 'lateral', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['asta-anterior', 'asta-posterior'], texto: 'Alterna las dos astas, con la sustancia blanca translúcida: la anterior, motora; la posterior, sensitiva.' },
      comprobar: 'rel-asta-anterior',
    },
    {
      id: 'tractos', tipo: 'funcion', titulo: 'Los grandes tractos',
      texto: [
        ['Las columnas posteriores llevan el tacto fino, la vibración y la posición del cuerpo: lo de debajo de T6 por el fascículo grácil y lo de encima por el cuneiforme.', W('Dorsal_column-medial_lemniscus_pathway', 'conveys sensations of fine touch, vibration'), W(SC, 'If the primary axon enters below spinal level T6, the axon travels in the gracile fasciculus, the medial part of the column. If the axon enters above level T6, then it travels in the cuneate fasciculus')],
        ['El espinotalámico lateral lleva el dolor y la temperatura, y se cruza ya en la médula.', W('Spinothalamic_tract', 'The lateral spinothalamic tract conveys pain and temperature.'), W('Spinothalamic_tract', 'The pathway crosses over (decussates) at the level of the spinal cord')],
        ['El corticoespinal lateral baja las órdenes motoras; el 90 % de sus axones se cruza antes, en el bulbo.', W('Corticospinal_tract', 'is a white matter motor pathway starting at the cerebral cortex that terminates on lower motor neurons and interneurons in the spinal cord'), W(SC, 'where about 90% of the axons cross to the contralateral side at the decussation of the pyramids. They then descend as the lateral corticospinal tract.')],
      ],
      vista: { ver: TRACTOS, fantasma: ['sustancia-blanca'], camara: 'posterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: TRACTOS, texto: 'Alterna los cuatro: los dos fascículos posteriores, el espinotalámico y el corticoespinal, más lateral.' },
      comprobar: 'fun-espinotalamico',
    },
    {
      id: 'nervios', tipo: 'relaciones', titulo: 'Cómo nace un nervio espinal',
      texto: [
        ['Cada nervio espinal nace de una raíz anterior (motora) y otra posterior (sensitiva), que se unen en el agujero intervertebral.', T(MED, 'Each spinal nerve begins as an anterior (motor) and a posterior (sensory) nerve root. These roots arise from the spinal cord, and unite at the intervertebral foramina, forming a single spinal nerve.')],
        ['La raíz posterior tiene un ganglio con los cuerpos de sus neuronas; la médula da 31 pares de nervios espinales.', W(SC, 'The roots terminate in dorsal root ganglia, which are composed of the cell bodies of the corresponding neurons.'), W(SC, 'It is made of 31 segments from which branch one pair of sensory nerve roots and one pair of motor nerve roots.')],
        ['Al salir, el nervio se divide en un ramo posterior (espalda) y otro anterior, para casi todo el resto del cuerpo.', T(MED, 'Posterior rami – supplies nerve fibres to the synovial joints of the vertebral column, deep muscles of the back, and the overlying skin.'), T(MED, 'Anterior rami – supplies nerve fibres to much of the remaining area of the body, both motor and sensory.')],
      ],
      vista: { ver: ['raiz-anterior', 'raiz-posterior'], contexto: ['ganglio', 'sustancia-blanca'], camara: 'lateral', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['raiz-anterior', 'raiz-posterior'], texto: 'Alterna las raíces: la anterior, motora; la posterior, sensitiva, con su ganglio.' },
      comprobar: 'rel-raices',
    },
    {
      id: 'clinica', tipo: 'relaciones', titulo: 'Sangre y lesiones',
      texto: [
        ['La irrigan una arteria espinal anterior, de las vertebrales, que corre por la fisura media anterior, y dos posteriores.', T(MED, 'The arterial supply to the spinal cord is via three longitudinal arteries – the anterior spinal artery and the paired posterior spinal arteries.'), T(MED, 'Anterior spinal artery – formed from branches of the vertebral arteries. They travel in the anterior median fissure.')],
        ['Si algo comprime la cola de caballo (una hernia de disco, un tumor), aparece el síndrome de la cola de caballo: anestesia en silla de montar e incontinencia, entre otros signos.', T(MED, 'Compression of these nerves produces a range of signs and symptoms collectively termed cauda equina syndrome. There are many causes of compression, including intervertebral disc prolapse'), T(MED, 'Saddle-area anaesthesia.'), T(MED, 'Incontinence / retention of urine or faeces.')],
      ],
      vista: { ver: ['arteria-espinal', 'cola-caballo'], contexto: ['sustancia-blanca', 'l2'], fantasma: ['lumbares', 'sacro'], camara: 'lateral', lado: 'R' },
      comprobar: 'rel-cola-caballo',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['La médula va del bulbo a L2; debajo sigue la cola de caballo, en la cisterna lumbar.', T(MED, 'At the L2 vertebral level the spinal cord tapers off, forming the conus medullaris.')],
        ['Gris dentro (astas: anterior motora, posterior sensitiva); blanca fuera, con los tractos.', W(SC, 'In cross-section, the peripheral region of the cord contains neuronal white matter tracts containing sensory and motor axons.')],
        ['Tacto fino por las columnas posteriores, dolor y temperatura por el espinotalámico, órdenes motoras por el corticoespinal.', W('Dorsal_column-medial_lemniscus_pathway', 'conveys sensations of fine touch, vibration'), W('Spinothalamic_tract', 'The lateral spinothalamic tract conveys pain and temperature.')],
      ],
    },
  ],
  preguntas: [
    {
      id: 'fun-medula', tipo: 'funcion', objetivo: 0, paso: 'orientacion', estructuras: ['sustancia-blanca'],
      enunciado: '¿Qué forman juntos la médula espinal y el encéfalo?',
      correcta: 'El sistema nervioso central',
      distractores: ['El sistema nervioso periférico', 'El sistema nervioso autónomo', 'El plexo braquial'],
      explicacion: 'Los nervios espinales, sus raíces y ganglios forman parte del periférico.',
      evidencia: [T(MED, 'Together, the spinal cord and the brain form the central nervous system.')],
    },
    {
      id: 'rel-fin', tipo: 'relacion', objetivo: 0, paso: 'recorrido', estructuras: ['cola-caballo', 'l2'],
      enunciado: '¿Dónde acaba la médula espinal en el adulto?',
      correcta: 'Hacia L2, en el cono medular',
      distractores: ['En el sacro', 'En T6', 'En el cóccix'],
      explicacion: 'Por debajo solo quedan las raíces de la cola de caballo.',
      evidencia: [T(MED, 'At the L2 vertebral level the spinal cord tapers off, forming the conus medullaris.')],
    },
    { id: 'id-cola-caballo', tipo: 'identificar', estructura: 'cola-caballo', objetivo: 0, paso: 'recorrido' },
    {
      id: 'rel-puncion', tipo: 'relacion', objetivo: 1, paso: 'meninges', estructuras: ['dura', 'cola-caballo'],
      enunciado: '¿Por qué la punción lumbar se hace por debajo del cono medular?',
      correcta: 'Porque allí el espacio subaracnoideo se ensancha en la cisterna lumbar, sin médula',
      distractores: ['Porque allí no hay líquido cefalorraquídeo', 'Porque allí no hay duramadre', 'Porque allí la médula es más gruesa'],
      explicacion: 'Bajo el cono medular solo hay raíces de la cola de caballo flotando en el líquido.',
      evidencia: [T(MED, 'Distal to the conus medullaris, the subarachnoid space expands, forming the lumbar cistern. This space accessed during a lumbar puncture')],
    },
    {
      id: 'sec-meninges', tipo: 'secuencia', objetivo: 1, paso: 'meninges',
      enunciado: 'Ordena las meninges de fuera adentro.',
      orden: ['Duramadre', 'Aracnoides', 'Piamadre'],
      explicacion: 'La dura es la más externa y la pía, pegada a la médula, la más interna.',
      evidencia: [T(MED, 'The spinal dura mater is the most external of the meninges.'), T(MED, 'The spinal arachnoid mater is a delicate membrane, located between the dura mater and the pia mater.'), T(MED, 'The spinal pia mater is the innermost of the meninges.')],
    },
    { id: 'id-dura', tipo: 'identificar', estructura: 'dura', objetivo: 1, paso: 'meninges' },
    {
      id: 'rel-asta-anterior', tipo: 'relacion', objetivo: 2, paso: 'gris-blanca', estructuras: ['asta-anterior'],
      enunciado: '¿Qué hay en las astas anteriores de la médula?',
      correcta: 'Los cuerpos de las neuronas motoras',
      distractores: ['Los cuerpos de las neuronas sensitivas', 'Solo axones mielinizados', 'El líquido cefalorraquídeo'],
      explicacion: 'Las neuronas motoras están en el asta anterior; los cuerpos de las sensitivas, en los ganglios de las raíces posteriores.',
      evidencia: [W(SC, 'motor neurons whose cell bodies are found in the ventral (or anterior) gray horns of the spinal cord.')],
    },
    {
      id: 'comp-gris-blanca', tipo: 'comparacion', objetivo: 2, paso: 'gris-blanca', estructuras: ['sustancia-blanca', 'asta-anterior'],
      enunciado: '¿Dónde está la sustancia gris en la médula espinal?',
      correcta: 'Por dentro, en forma de mariposa, rodeada de sustancia blanca',
      distractores: ['Por fuera, rodeando a la blanca', 'Solo en el cono medular', 'En las raíces de los nervios'],
      explicacion: 'Al revés que en la corteza del cerebro: en la médula la gris está dentro y la blanca, fuera.',
      evidencia: [W(SC, 'Internal to this peripheral region is the grey matter')],
    },
    { id: 'id-asta-anterior', tipo: 'identificar', estructura: 'asta-anterior', objetivo: 2, paso: 'gris-blanca' },
    {
      id: 'fun-espinotalamico', tipo: 'funcion', objetivo: 3, paso: 'tractos', estructuras: ['espinotalamico'],
      enunciado: '¿Qué lleva el tracto espinotalámico lateral?',
      correcta: 'El dolor y la temperatura',
      distractores: ['El tacto fino y la vibración', 'Las órdenes motoras voluntarias', 'La posición del cuerpo'],
      explicacion: 'El tacto fino, la vibración y la posición van por las columnas posteriores; las órdenes, por el corticoespinal.',
      evidencia: [W('Spinothalamic_tract', 'The lateral spinothalamic tract conveys pain and temperature.')],
    },
    {
      id: 'rel-cruce', tipo: 'relacion', objetivo: 3, paso: 'tractos', estructuras: ['espinotalamico', 'corticoespinal'],
      enunciado: '¿Dónde se cruza al otro lado la vía del dolor y la temperatura?',
      correcta: 'En la propia médula espinal',
      distractores: ['En el bulbo raquídeo, como el corticoespinal', 'En la corteza cerebral', 'No se cruza'],
      explicacion: 'El espinotalámico se cruza en la médula; las columnas posteriores y el corticoespinal lateral, en el tronco del encéfalo.',
      evidencia: [W('Spinothalamic_tract', 'The pathway crosses over (decussates) at the level of the spinal cord, rather than in the brainstem like the dorsal column-medial lemniscus pathway and lateral corticospinal tract.')],
    },
    { id: 'id-fasciculo-gracil', tipo: 'identificar', estructura: 'fasciculo-gracil', objetivo: 3, paso: 'tractos' },
    {
      id: 'rel-raices', tipo: 'relacion', objetivo: 4, paso: 'nervios', estructuras: ['raiz-anterior', 'raiz-posterior'],
      enunciado: '¿Qué lleva la raíz posterior de un nervio espinal?',
      correcta: 'Información sensitiva',
      distractores: ['Solo órdenes motoras', 'Líquido cefalorraquídeo', 'Sangre para la médula'],
      explicacion: 'La raíz anterior es motora y la posterior, sensitiva; se unen en el agujero intervertebral.',
      evidencia: [T(MED, 'Each spinal nerve begins as an anterior (motor) and a posterior (sensory) nerve root.')],
    },
    { id: 'id-raiz-anterior', tipo: 'identificar', estructura: 'raiz-anterior', objetivo: 4, paso: 'nervios' },
    {
      id: 'rel-cola-caballo', tipo: 'relacion', objetivo: 0, paso: 'clinica', estructuras: ['cola-caballo'],
      enunciado: '¿Qué signo es típico del síndrome de la cola de caballo?',
      correcta: 'Anestesia en silla de montar',
      distractores: ['Ceguera de un ojo', 'Parálisis de la cara', 'Pérdida del olfato'],
      explicacion: 'La compresión de las raíces lumbares y sacras quita la sensibilidad de la zona que tocaría una silla de montar.',
      evidencia: [T(MED, 'Saddle-area anaesthesia.')],
    },
  ],
});
