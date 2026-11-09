// Lección «Arterias del encéfalo». Formato y evidencias: ../formato.js.
import { leccion, W, T, GUIA, MODELO } from '../formato.js';

const ENC = 'neuroanatomy/vessels/arterial-supply';
const WIL = 'Circle_of_Willis';
const arteria = (nombre, piezas, lado = 'ambos') => ({ nombre, piezas, lado, papel: 'nucleo', tipo: 'arteria' });
const contexto = (nombre, piezas, tipo, lado = 'ambos') => ({ nombre, piezas, lado, papel: 'contexto', tipo });

const CEREBRALES = ['cerebral-anterior', 'cerebral-media', 'cerebral-posterior'];
const COMUNICANTES = ['comunicante-anterior', 'comunicante-posterior'];
const POLIGONO = ['carotida-interna', 'cerebral-anterior', 'cerebral-posterior', ...COMUNICANTES];

export default leccion({
  id: 'cab-arterias-encefalo',
  version: 1,
  titulo: 'Arterias del encéfalo',
  resumen: 'Cómo llega la sangre al encéfalo: las dos carótidas internas y las dos vertebrales, que se unen en la basilar; el polígono de Willis que forman en la base del cerebro, las tres arterias cerebrales y qué parte irriga cada una, y por qué los aneurismas de ese polígono son tan peligrosos.',
  lugares: [['cabeza', 'encefalo']],
  sistemas: ['cardiovascular'],
  formato: 'trayectos',
  temas: ['arterias-venas'],
  nivel: 3,
  minutos: 16,
  requisitos: ['cab-encefalo', 'sis-cardiovascular'],
  siguiente: ['cue-vasos', 'cab-nervios-craneales', 'esp-medula'],
  objetivos: [
    'Nombrar las dos parejas de arterias que llevan la sangre al encéfalo y seguir su camino desde el cuello.',
    'Describir el polígono de Willis y los vasos que lo cierran.',
    'Asociar cada arteria cerebral con la parte del cerebro que irriga.',
    'Explicar por qué un aneurisma del polígono de Willis es una urgencia.',
  ],
  estructuras: {
    'carotida-interna': arteria('Arterias carótidas internas', ['Internal_carotid_artery']),
    vertebral: arteria('Arterias vertebrales', ['Vertebral_artery']),
    basilar: arteria('Arteria basilar', ['Basilar_artery'], 'impar'),
    'cerebral-anterior': arteria('Arterias cerebrales anteriores', ['Anterior_cerebral_artery']),
    'cerebral-media': arteria('Arterias cerebrales medias', ['Middle_cerebral_artery_M1_segment', 'Middle_cerebral_artery_M3_segment']),
    'cerebral-posterior': arteria('Arterias cerebrales posteriores', ['Posterior_cerebral_artery']),
    'comunicante-anterior': arteria('Arteria comunicante anterior', ['Anterior_communicating_artery'], 'impar'),
    'comunicante-posterior': arteria('Arterias comunicantes posteriores', ['Posterior_communicating_artery']),
    oftalmica: contexto('Arterias oftálmicas', ['Ophthalmic_artery'], 'arteria'),
    'cerebelosa-inferior-posterior': contexto('Arterias cerebelosas inferiores posteriores', ['Posterior_inferior_cerebellar_artery'], 'arteria'),
    'cerebelosa-superior': contexto('Arterias cerebelosas superiores', ['Superior_cerebellar_artery'], 'arteria'),
    'espinal-anterior': contexto('Arteria espinal anterior', ['Anterior_spinal_artery'], 'arteria'),
    'carotida-comun': contexto('Arteria carótida común derecha', ['Right_common_carotid_artery'], 'arteria', 'impar'),
    puente: contexto('Puente', ['Pons'], 'snc'),
    bulbo: contexto('Bulbo raquídeo', ['Medulla_oblongata'], 'snc'),
    occipital: contexto('Hueso occipital', ['Occipital_Bone'], 'hueso', 'impar'),
    temporal: contexto('Huesos temporales', ['Temporal_Bone'], 'hueso'),
    esfenoides: contexto('Esfenoides', ['Sphenoid_Bone'], 'hueso', 'impar'),
  },
  pasos: [
    {
      id: 'orientacion', tipo: 'orientacion', titulo: 'Sangre para el encéfalo',
      texto: [
        ['El encéfalo gasta mucho oxígeno, una quinta parte del total del cuerpo en reposo, y sus células mueren en minutos si les falta.', T(ENC, 'at rest it represents one fifth of the body’s total oxygen consumption. It is also very sensitive to oxygen deprivation, with ischemic cell death resulting within minutes.')],
        ['Le llevan la sangre dos parejas de arterias que suben desde el cuello: las vertebrales y las carótidas internas.', T(ENC, 'There are two paired arteries which are responsible for the blood supply to the brain; the vertebral arteries, and the internal carotid arteries. These arteries arise in the neck, and ascend to the cranium.')],
        ['Dentro del cráneo, sus ramas terminales se unen en un círculo, el polígono de Willis, del que salen las arterias de casi todo el cerebro.', T(ENC, 'Within the cranial vault, the terminal branches of these arteries form an anastomotic circle, called the Circle of Willis. From this circle, branches arise which supply the majority of the cerebrum.')],
        ['Mira las arterias de frente y desde abajo.', GUIA],
      ],
      vista: { ver: ['carotida-interna', 'vertebral', 'basilar'], contexto: [...CEREBRALES, ...COMUNICANTES], fantasma: ['occipital', 'temporal'], camara: 'anterior' },
      actividad: { tipo: 'vistas', texto: 'Recorre las arterias.', vistas: [{ nombre: 'De frente', camara: 'anterior' }, { nombre: 'De lado', camara: 'lateral' }, { nombre: 'Desde abajo', camara: 'inferior' }] },
      comprobar: 'rel-dos-parejas',
    },
    {
      id: 'carotidas', tipo: 'exploracion', titulo: 'Las carótidas internas',
      texto: [
        ['Nacen de la bifurcación de la carótida común, a la altura de C4, suben por la vaina carotídea y entran por el conducto carotídeo del temporal, sin dar ramas a la cara ni al cuello.', T(ENC, 'The internal carotid arteries (ICA) originate at the bifurcation of the left and right common carotid arteries, at the level of the fourth cervical vertebrae (C4).'), T(ENC, 'They move superiorly within the carotid sheath, and enter the brain via the carotid canal of the temporal bone. They do not supply any branches to the face or neck.')],
        ['Dentro dan la oftálmica (para la órbita), la comunicante posterior y la cerebral anterior, y siguen como cerebral media.', T(ENC, 'Ophthalmic artery – supplies the structures of the orbit.'), T(ENC, 'Posterior communicating artery – acts as an anastomotic'), T(ENC, 'Anterior cerebral artery – supplies part of the cerebrum.'), T(ENC, 'The internal carotids then continue as the middle cerebral artery, which supplies the lateral portions of the cerebrum.')],
      ],
      vista: { ver: ['carotida-interna', 'cerebral-anterior', 'cerebral-media'], contexto: ['oftalmica', 'carotida-comun', 'comunicante-posterior'], fantasma: ['temporal', 'esfenoides'], camara: 'lateral', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['carotida-interna', 'cerebral-anterior', 'cerebral-media'], texto: 'Alterna: la carótida interna sube; arriba da la cerebral anterior y sigue como cerebral media.' },
      comprobar: 'rel-carotida-ramas',
    },
    {
      id: 'vertebrales', tipo: 'exploracion', titulo: 'Las vertebrales y la basilar',
      texto: [
        ['Las vertebrales salen de las subclavias, suben por los agujeros transversos de las vértebras cervicales y entran en el cráneo por el agujero magno.', T(ENC, 'The right and left vertebral arteries arise from the subclavian arteries, medial to the anterior scalene muscle. They then ascend the posterior aspect of the neck, through holes in the transverse processes of the cervical vertebrae, known as foramen transversarium.'), T(ENC, 'The vertebral arteries enter the cranial cavity via the foramen magnum.')],
        ['Dan las arterias espinales y la cerebelosa inferior posterior, y se unen en la arteria basilar.', T(ENC, 'Anterior and posterior spinal arteries – supplies the spinal cord, spanning its entire length.'), T(ENC, 'Posterior inferior cerebellar artery – supplies the cerebellum.'), T(ENC, 'After this, the two vertebral arteries converge to form the basilar artery.')],
        ['La basilar irriga el cerebelo y el puente y acaba dividiéndose en las dos cerebrales posteriores.', T(ENC, 'Several branches from the basilar artery originate here, and go onto supply the cerebellum and pons. The basilar artery terminates by bifurcating into the posterior cerebral arteries.')],
      ],
      vista: { ver: ['vertebral', 'basilar', 'cerebral-posterior'], contexto: ['cerebelosa-inferior-posterior', 'cerebelosa-superior', 'espinal-anterior', 'puente', 'bulbo'], camara: 'inferior' },
      actividad: { tipo: 'localizar', estructura: 'basilar', texto: 'Toca la arteria única que forman las dos vertebrales al unirse.' },
      comprobar: 'rel-basilar',
    },
    {
      id: 'poligono', tipo: 'relaciones', titulo: 'El polígono de Willis',
      texto: [
        ['Las ramas terminales de las vertebrales y las carótidas internas se unen en un círculo: el polígono de Willis.', T(ENC, 'The terminal branches of the vertebral and internal carotid arteries all anastomose to form a circular blood vessel, called the circle of Willis.')],
        ['Lo forman las cerebrales anteriores, las carótidas internas y las cerebrales posteriores, cerrados por dos comunicantes: la anterior une las dos cerebrales anteriores; las posteriores unen cada carótida con la cerebral posterior.', T(ENC, 'There are three main (paired) constituents of the circle of Willis:'), T(ENC, 'Anterior communicating artery – connects the two anterior cerebral arteries.'), T(ENC, 'this artery connects the ICA to the posterior cerebral artery.')],
      ],
      detalle: [
        ['Se cree que esta disposición da redundancia: si un vaso falla, la sangre puede llegar por otro.', W(WIL, 'arteries into the circle of Willis is believed to create redundancy (analogous to engineered redundancy) for collateral circulation in the cerebral circulation.')],
        ['La forma clásica solo se ve en un tercio de las personas; hay muchas variantes.', W(WIL, 'Considerable anatomic variation exists in the circle of Willis, with classic anatomy seen only in about one-third of people.')],
      ],
      vista: { ver: POLIGONO, contexto: ['basilar', 'cerebral-media', 'puente'], camara: 'inferior' },
      actividad: { tipo: 'comparar', estructuras: COMUNICANTES, texto: 'Alterna las comunicantes: la anterior, delante y en el centro; las posteriores, a los lados.' },
      comprobar: 'rel-comunicante-anterior',
    },
    {
      id: 'territorios', tipo: 'funcion', titulo: 'Qué irriga cada una',
      texto: [
        ['Las cerebrales anteriores irrigan la parte anteromedial del cerebro.', T(ENC, 'The anterior cerebral arteries supply the anteromedial portion of the cerebrum.')],
        ['Las medias, laterales, irrigan la mayor parte de la cara lateral.', T(ENC, 'The middle cerebral arteries are situated laterally, supplying the majority of the lateral part of the brain.')],
        ['Las posteriores irrigan la parte posterior del cerebro, por dentro y por fuera.', T(ENC, 'The posterior cerebral arteries supply both the medial and lateral parts of the posterior cerebrum.')],
      ],
      detalle: [
        ['El modelo tiene los segmentos M1 y M3 de la cerebral media y sus ramas, pero las ramas insulares (M2) tienen un nombre distinto en cada lado.', MODELO],
      ],
      vista: { ver: CEREBRALES, contexto: ['carotida-interna', 'basilar'], camara: 'lateral', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: CEREBRALES, texto: 'Alterna las tres cerebrales y mira hacia dónde se reparte cada una.' },
      comprobar: 'fun-media',
    },
    {
      id: 'clinica', tipo: 'relaciones', titulo: 'Ictus y aneurismas',
      texto: [
        ['Un ictus es la aparición brusca de un déficit neurológico por un fallo en el riego del encéfalo.', T(ENC, 'A stroke is an acute development of a neurological deficit, due to a disturbance in the blood supply of the brain.')],
        ['Los aneurismas son más probables en los vasos del polígono de Willis; dan pocos síntomas hasta que se rompen.', T(ENC, 'They are most likely to occur to occur in the vessels contributing to the Circle of Willis. They are particularly dangerous – producing few symptoms until they rupture.')],
        ['Al romperse, la sangre se acumula en el espacio subaracnoideo y sube la presión dentro del cráneo: es una urgencia.', T(ENC, 'Upon rupture, blood typically accumulates in the subarachnoid space – with a subsequent increase in intracranial pressure.'), T(ENC, 'Once the artery wall has ruptured, it is a medical emergency')],
      ],
      vista: { ver: POLIGONO, contexto: ['basilar', 'cerebral-media'], camara: 'inferior' },
      comprobar: 'rel-aneurisma',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['Dos carótidas internas por delante y dos vertebrales por detrás, que forman la basilar.', T(ENC, 'the vertebral arteries, and the internal carotid arteries'), T(ENC, 'the two vertebral arteries converge to form the basilar artery.')],
        ['Polígono de Willis: cerebrales anteriores, carótidas internas, cerebrales posteriores y las comunicantes anterior y posteriores.', T(ENC, 'There are three main (paired) constituents of the circle of Willis:')],
        ['Anterior: cara medial; media: cara lateral; posterior: parte posterior.', T(ENC, 'They each supply a different portion of the cerebrum.')],
      ],
    },
  ],
  preguntas: [
    {
      id: 'rel-dos-parejas', tipo: 'relacion', objetivo: 0, paso: 'orientacion', estructuras: ['carotida-interna', 'vertebral'],
      enunciado: '¿Qué arterias llevan la sangre al encéfalo?',
      correcta: 'Las dos carótidas internas y las dos vertebrales',
      distractores: ['Las dos carótidas externas', 'Las dos subclavias directamente', 'Las arterias meníngeas medias'],
      explicacion: 'Las carótidas externas irrigan la cara y el cuello; las vertebrales nacen de las subclavias.',
      evidencia: [T(ENC, 'There are two paired arteries which are responsible for the blood supply to the brain; the vertebral arteries, and the internal carotid arteries.')],
    },
    { id: 'id-carotida-interna', tipo: 'identificar', estructura: 'carotida-interna', objetivo: 0, paso: 'carotidas' },
    { id: 'id-vertebral', tipo: 'identificar', estructura: 'vertebral', objetivo: 0, paso: 'vertebrales' },
    { id: 'id-basilar', tipo: 'identificar', estructura: 'basilar', objetivo: 0, paso: 'vertebrales' },
    {
      id: 'rel-carotida-ramas', tipo: 'relacion', objetivo: 0, paso: 'carotidas', estructuras: ['carotida-interna'],
      enunciado: '¿Qué ramas da la carótida interna en el cuello?',
      correcta: 'Ninguna',
      distractores: ['La tiroidea superior', 'La facial', 'La vertebral'],
      explicacion: 'La carótida interna no da ramas a la cara ni al cuello; las da la externa.',
      evidencia: [T(ENC, 'They do not supply any branches to the face or neck.')],
    },
    {
      id: 'rel-basilar', tipo: 'relacion', objetivo: 0, paso: 'vertebrales', estructuras: ['basilar', 'vertebral'],
      enunciado: '¿Cómo se forma la arteria basilar?',
      correcta: 'Por la unión de las dos arterias vertebrales',
      distractores: ['Por la unión de las dos carótidas internas', 'Es una rama de la cerebral media', 'Sale directamente del cayado de la aorta'],
      explicacion: 'Las vertebrales entran por el agujero magno y se unen; la basilar acaba en las dos cerebrales posteriores.',
      evidencia: [T(ENC, 'After this, the two vertebral arteries converge to form the basilar artery.')],
    },
    {
      id: 'sec-vertebral', tipo: 'secuencia', objetivo: 0, paso: 'vertebrales',
      enunciado: 'Ordena el camino de la sangre desde la subclavia hasta el cerebro posterior.',
      orden: ['Arteria subclavia', 'Arteria vertebral', 'Arteria basilar', 'Arteria cerebral posterior'],
      explicacion: 'La vertebral sale de la subclavia, se une con la del otro lado en la basilar y esta acaba en las cerebrales posteriores.',
      evidencia: [T(ENC, 'The right and left vertebral arteries arise from the subclavian arteries'), T(ENC, 'The basilar artery terminates by bifurcating into the posterior cerebral arteries.')],
    },
    {
      id: 'rel-comunicante-anterior', tipo: 'relacion', objetivo: 1, paso: 'poligono', estructuras: ['comunicante-anterior'],
      enunciado: '¿Qué une la arteria comunicante anterior?',
      correcta: 'Las dos cerebrales anteriores',
      distractores: ['La carótida interna con la cerebral posterior', 'Las dos vertebrales', 'La basilar con la cerebral media'],
      explicacion: 'La comunicante posterior es la que une la carótida interna con la cerebral posterior.',
      evidencia: [T(ENC, 'Anterior communicating artery – connects the two anterior cerebral arteries.')],
    },
    { id: 'id-comunicante-posterior', tipo: 'identificar', estructura: 'comunicante-posterior', objetivo: 1, paso: 'poligono' },
    {
      id: 'rel-variantes', tipo: 'relacion', objetivo: 1, paso: 'poligono', estructuras: POLIGONO,
      enunciado: '¿Cuántas personas tienen el polígono de Willis con su forma clásica?',
      correcta: 'Alrededor de un tercio',
      distractores: ['Prácticamente todas', 'Ninguna', 'Solo las mujeres'],
      explicacion: 'Hay mucha variación: por ejemplo, una comunicante posterior grande que lleva sangre de la carótida a la parte posterior.',
      evidencia: [W(WIL, 'classic anatomy seen only in about one-third of people.')],
    },
    {
      id: 'fun-media', tipo: 'funcion', objetivo: 2, paso: 'territorios', estructuras: ['cerebral-media'],
      enunciado: '¿Qué parte del cerebro irriga sobre todo la arteria cerebral media?',
      correcta: 'La mayor parte de la cara lateral',
      distractores: ['La parte anteromedial', 'Solo el cerebelo', 'La parte posterior, por dentro y por fuera'],
      explicacion: 'La anteromedial es de la cerebral anterior y la posterior, de la cerebral posterior.',
      evidencia: [T(ENC, 'The middle cerebral arteries are situated laterally, supplying the majority of the lateral part of the brain.')],
    },
    { id: 'id-cerebral-media', tipo: 'identificar', estructura: 'cerebral-media', objetivo: 2, paso: 'territorios' },
    {
      id: 'rel-aneurisma', tipo: 'relacion', objetivo: 3, paso: 'clinica', estructuras: POLIGONO,
      enunciado: '¿Dónde se acumula la sangre cuando se rompe un aneurisma del polígono de Willis?',
      correcta: 'En el espacio subaracnoideo',
      distractores: ['En el espacio epidural de la médula', 'En los ventrículos del corazón', 'En el seno maxilar'],
      explicacion: 'Al romperse sube la presión dentro del cráneo; es una urgencia.',
      evidencia: [T(ENC, 'Upon rupture, blood typically accumulates in the subarachnoid space')],
    },
  ],
});
