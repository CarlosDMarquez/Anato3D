// Lección «Carótidas y yugulares». Formato y evidencias: ../formato.js.
import { leccion, T, GUIA, MODELO } from '../formato.js';

const CC = 'neck/vessels/arterial/common-carotid-artery';
const CE = 'neck/vessels/arterial/external-carotid-artery';
const VEN = 'neck/vessels/venous-drainage';
const vaso = (nombre, piezas, tipo, lado = 'bilateral') => ({ nombre, piezas, lado, papel: 'nucleo', tipo });
const contexto = (nombre, piezas, tipo, lado = 'bilateral') => ({ nombre, piezas, lado, papel: 'contexto', tipo });

const CAROTIDAS = ['carotida-comun', 'carotida-interna', 'carotida-externa'];
const YUGULARES = ['yugular-interna', 'yugular-externa', 'yugular-anterior'];
const REFERENCIAS = ['cartilago-tiroides', 'clavicula', 'mandibula'];

export default leccion({
  id: 'cue-vasos',
  version: 1,
  titulo: 'Carótidas y yugulares',
  resumen: 'Los grandes vasos del cuello: la carótida común, que sube en la vaina carotídea con la yugular interna y el vago y se divide en C4; el seno y el cuerpo carotídeos; la carótida externa y sus ramas para la cara; y las tres yugulares, con lo que se aprende mirando la yugular interna.',
  lugares: [['cuello', 'vasos-nervios-cuello']],
  sistemas: ['cardiovascular'],
  formato: 'trayectos',
  temas: ['arterias-venas'],
  nivel: 2,
  minutos: 16,
  requisitos: ['sis-cardiovascular', 'cue-musculos'],
  siguiente: ['cab-arterias-encefalo', 'cue-visceras', 'ms-vasos'],
  objetivos: [
    'Describir el origen y el trayecto de las carótidas comunes y dónde se dividen.',
    'Explicar qué detectan el seno y el cuerpo carotídeos.',
    'Enumerar las ramas principales de la carótida externa.',
    'Distinguir las tres venas yugulares y decir dónde desemboca cada una.',
  ],
  estructuras: {
    'carotida-comun': vaso('Arteria carótida común derecha', ['Right_common_carotid_artery'], 'arteria', 'impar'),
    'carotida-interna': vaso('Arteria carótida interna', ['Internal_carotid_artery'], 'arteria'),
    'carotida-externa': vaso('Arteria carótida externa', ['External_carotid_artery'], 'arteria'),
    facial: vaso('Arteria facial', ['Facial_artery'], 'arteria'),
    'temporal-superficial': vaso('Arteria temporal superficial', ['Superficial_temporal_artery'], 'arteria'),
    'yugular-interna': vaso('Vena yugular interna', ['Internal_jugular_vein'], 'vena'),
    'yugular-externa': vaso('Vena yugular externa', ['External_jugular_vein'], 'vena'),
    'yugular-anterior': vaso('Vena yugular anterior', ['Anterior_jugular_vein'], 'vena'),
    occipital: contexto('Arteria occipital', ['Occipital_artery'], 'arteria'),
    maxilar: contexto('Arteria maxilar', ['Maxillary_artery'], 'arteria'),
    'faringea-ascendente': contexto('Arteria faríngea ascendente', ['Ascending_pharyngeal_artery'], 'arteria'),
    'tronco-braquiocefalico': contexto('Tronco braquiocefálico', ['Brachiocephalic_trunk'], 'arteria', 'impar'),
    'braquiocefalica-vena': contexto('Vena braquiocefálica derecha', ['Right_brachiocephalic_vein'], 'vena', 'impar'),
    'subclavia-vena': contexto('Vena subclavia derecha', ['Right_subclavian_vein'], 'vena', 'impar'),
    vago: contexto('Nervio vago', ['Vagus_nerve_X'], 'nervio'),
    ecm: contexto('Músculo esternocleidomastoideo', ['Sternocleidomastoid_muscle'], 'musculo'),
    'cartilago-tiroides': contexto('Cartílago tiroides', ['Thyroid_cartilage'], 'cartilago', 'impar'),
    tiroides: contexto('Glándula tiroides', ['Thyroid_gland'], 'glandula', 'impar'),
    traquea: contexto('Tráquea', ['Trachea'], 'organo', 'impar'),
    clavicula: contexto('Clavícula', ['Clavicle'], 'hueso'),
    mandibula: contexto('Mandíbula', ['Mandible'], 'hueso', 'impar'),
  },
  pasos: [
    {
      id: 'orientacion', tipo: 'orientacion', titulo: 'Los vasos del cuello',
      texto: [
        ['La carótida común, con sus dos ramas terminales (la interna y la externa), lleva casi toda la sangre de la cabeza y el cuello.', T(CC, 'Through its terminal branches – the internal and external carotid arteries – it provides the majority of the arterial supply to the head and neck.')],
        ['La sangre vuelve por las venas yugulares: la externa, la interna y la anterior.', T(VEN, 'There are three main jugular veins – external, internal and anterior. They are ultimately responsible for the venous drainage of the whole head and neck.')],
        ['Míralos de lado, con el esternocleidomastoideo translúcido.', GUIA],
      ],
      vista: { ver: [...CAROTIDAS, 'yugular-interna'], contexto: REFERENCIAS, fantasma: ['ecm'], camara: 'anterolateral', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'Recorre el cuello.', vistas: [{ nombre: 'De lado y delante', camara: 'anterolateral' }, { nombre: 'De lado', camara: 'lateral' }, { nombre: 'De frente', camara: 'anterior' }] },
      comprobar: 'rel-ramas-terminales',
    },
    {
      id: 'comun', tipo: 'exploracion', titulo: 'La carótida común',
      texto: [
        ['La derecha nace del tronco braquiocefálico, a la altura de la articulación esternoclavicular; la izquierda, directamente del cayado de la aorta.', T(CC, 'Right common carotid artery – arises from the brachiocephalic trunk at the level of the sternoclavicular joint, within the root of the neck.'), T(CC, 'Left common carotid artery – arises directly from the arch of the aorta as its second branch')],
        ['Suben por la vaina carotídea con la yugular interna y el nervio vago.', T(CC, 'They ascend through the neck within the carotid sheath, accompanied by the internal jugular vein and vagus nerve.')],
        ['En C4, el borde superior del cartílago tiroides, se dividen en carótida interna y externa; ahí se toma el pulso carotídeo.', T(CC, 'At the level of C4 (the superior border of the thyroid cartilage), each common carotid artery terminates by bifurcating into the internal carotid artery and external carotid artery.'), T(CC, 'This occurs within the carotid triangle, where the carotid pulse can be palpated')],
      ],
      vista: { ver: ['carotida-comun'], contexto: ['yugular-interna', 'vago', 'tronco-braquiocefalico', 'cartilago-tiroides', 'traquea', 'clavicula'], camara: 'anterolateral', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'carotida-comun', texto: 'Toca la arteria que sube junto a la tráquea hasta el cartílago tiroides.' },
      comprobar: 'rel-c4',
    },
    {
      id: 'seno-cuerpo', tipo: 'funcion', titulo: 'Seno y cuerpo carotídeos',
      texto: [
        ['El seno carotídeo, una dilatación al final de la carótida común, tiene barorreceptores (del glosofaríngeo) que detectan la presión arterial.', T(CC, 'Carotid sinus – a dilatation at the terminal part of the common carotid artery (or proximal internal carotid artery). It contains baroreceptors innervated by the glossopharyngeal nerve (CN IX), which detect changes in blood pressure.')],
        ['El cuerpo carotídeo, detrás de la bifurcación, es un quimiorreceptor: detecta el oxígeno de la sangre.', T(CC, 'Carotid body – a small structure located posterior to the bifurcation of the common carotid artery. It acts as a chemoreceptor, detecting changes in blood oxygen levels.')],
      ],
      detalle: [
        ['La estenosis carotídea suele estar en la bifurcación; lo que más importa es la interna, porque riega el encéfalo y puede causar un ictus.', T(CC, 'It typically occurs at the bifurcation of the common carotid artery, where blood flow becomes less streamlined.'), T(CC, 'reduced flow in the internal carotid artery is of greatest clinical significance, as it supplies the brain and can result in transient ischaemic attack or stroke.')],
        ['El seno y el cuerpo carotídeos no son piezas aparte en el modelo: están en la bifurcación.', MODELO],
      ],
      vista: { ver: ['carotida-comun', 'carotida-interna', 'carotida-externa'], contexto: ['cartilago-tiroides', 'mandibula'], camara: 'lateral', lado: 'R' },
      comprobar: 'fun-seno',
    },
    {
      id: 'externa', tipo: 'exploracion', titulo: 'La carótida externa',
      texto: [
        ['La externa sube entre el cuello de la mandíbula y el lóbulo de la oreja, cubierta por el esternocleidomastoideo, y lleva la sangre al cuello, la cara y el cuero cabelludo.', T(CE, 'It then ascends superiorly and posteriorly, travelling between the neck of the mandible and the lobule of the external ear.'), T(CE, 'provides the main arterial supply to structures of the neck, face and scalp.')],
        ['Sus ramas son la tiroidea superior, la faríngea ascendente, la lingual, la facial, la occipital y la auricular posterior.', T(CE, 'Superior thyroid artery'), T(CE, 'Ascending pharyngeal artery'), T(CE, 'Posterior auricular artery')],
        ['Acaba dentro de la parótida, dividiéndose en la maxilar y la temporal superficial.', T(CE, 'The external carotid artery terminates within the substance of the parotid gland, where it divides into the maxillary artery and superficial temporal artery.')],
      ],
      vista: { ver: ['carotida-externa', 'facial', 'temporal-superficial'], contexto: ['occipital', 'maxilar', 'faringea-ascendente', 'mandibula'], camara: 'lateral', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['facial', 'temporal-superficial'], texto: 'Alterna dos ramas: la facial, hacia la cara; la temporal superficial, delante de la oreja hacia la sien.' },
      comprobar: 'rel-externa-fin',
    },
    {
      id: 'yugulares', tipo: 'exploracion', titulo: 'Las yugulares',
      texto: [
        ['La yugular externa se forma detrás del ángulo de la mandíbula, baja superficial cruzando el esternocleidomastoideo y desemboca en la subclavia.', T(VEN, 'These two veins combine immediately posterior to the angle of mandible, and inferior to the outer ear, forming the external jugular vein.'), T(VEN, 'In the root of the neck, the vein passes underneath the clavicle, and terminates by draining into the subclavian vein.')],
        ['Las yugulares anteriores bajan por la línea media y también acaban en la subclavia.', T(VEN, 'The anterior jugular veins descend down the midline of the neck, emptying into the subclavian vein.')],
        ['La interna continúa el seno sigmoideo, sale por el agujero yugular, baja en la vaina carotídea por fuera de la carótida y se une a la subclavia para formar la braquiocefálica.', T(VEN, 'The internal jugular vein (IJV) begins in the cranial cavity as a continuation of the sigmoid sinus.'), T(VEN, 'It exits the skull via the jugular foramen.'), T(VEN, 'the IJV combines with the subclavian vein to form the brachiocephalic vein.')],
      ],
      detalle: [
        ['Las pulsaciones de la yugular interna permiten estimar la presión de la aurícula derecha, porque no hay válvulas entre ellas.', T(VEN, 'the internal jugular vein can be observed for pulsations – the nature of which provide an estimation of right atrial pressure.'), T(VEN, 'There are no valves in the brachiocephalic or subclavian veins')],
      ],
      vista: { ver: YUGULARES, contexto: ['braquiocefalica-vena', 'subclavia-vena', 'carotida-comun', 'clavicula', 'mandibula'], fantasma: ['ecm'], camara: 'anterolateral', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: YUGULARES, texto: 'Alterna las tres: la interna, profunda junto a la carótida; la externa, sobre el músculo; la anterior, junto a la línea media.' },
      comprobar: 'rel-yugular-interna',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['Carótida común en la vaina carotídea (con la yugular interna y el vago), dividida en C4 en interna (encéfalo) y externa (cara y cuello).', T(CC, 'accompanied by the internal jugular vein and vagus nerve.'), T(CC, 'Internal carotid artery – supplies intracranial structures'), T(CC, 'External carotid artery – supplies extracranial structures')],
        ['Yugular interna → braquiocefálica; yugulares externa y anterior → subclavia.', T(VEN, 'the IJV combines with the subclavian vein to form the brachiocephalic vein.'), T(VEN, 'terminates by draining into the subclavian vein.')],
      ],
    },
  ],
  preguntas: [
    {
      id: 'rel-ramas-terminales', tipo: 'relacion', objetivo: 0, paso: 'orientacion', estructuras: CAROTIDAS,
      enunciado: '¿En qué dos arterias se divide la carótida común?',
      correcta: 'En la carótida interna y la externa',
      distractores: ['En la vertebral y la subclavia', 'En la facial y la lingual', 'En la maxilar y la temporal superficial'],
      explicacion: 'La maxilar y la temporal superficial son las ramas terminales de la carótida externa.',
      evidencia: [T(CC, 'each common carotid artery terminates by bifurcating into the internal carotid artery and external carotid artery.')],
    },
    {
      id: 'rel-c4', tipo: 'relacion', objetivo: 0, paso: 'comun', estructuras: ['carotida-comun', 'cartilago-tiroides'],
      enunciado: '¿A qué altura se divide la carótida común?',
      correcta: 'En C4, el borde superior del cartílago tiroides',
      distractores: ['En C1, junto al atlas', 'En la articulación esternoclavicular', 'En T4, junto al cayado de la aorta'],
      explicacion: 'En la articulación esternoclavicular nace la carótida común derecha.',
      evidencia: [T(CC, 'At the level of C4 (the superior border of the thyroid cartilage)')],
    },
    {
      id: 'rel-vaina', tipo: 'relacion', objetivo: 0, paso: 'comun', estructuras: ['carotida-comun', 'yugular-interna', 'vago'],
      enunciado: '¿Qué estructuras van con la carótida común en la vaina carotídea?',
      correcta: 'La vena yugular interna y el nervio vago',
      distractores: ['La yugular externa y el nervio frénico', 'La tráquea y el esófago', 'La arteria vertebral y el nervio accesorio'],
      explicacion: 'La yugular externa es superficial, sobre el esternocleidomastoideo.',
      evidencia: [T(CC, 'They ascend through the neck within the carotid sheath, accompanied by the internal jugular vein and vagus nerve.')],
    },
    { id: 'id-carotida-comun', tipo: 'identificar', estructura: 'carotida-comun', objetivo: 0, paso: 'comun' },
    {
      id: 'fun-seno', tipo: 'funcion', objetivo: 1, paso: 'seno-cuerpo', estructuras: ['carotida-comun'],
      enunciado: '¿Qué detecta el seno carotídeo?',
      correcta: 'Los cambios de la presión arterial',
      distractores: ['El oxígeno de la sangre', 'El azúcar de la sangre', 'La temperatura'],
      explicacion: 'El oxígeno lo detecta el cuerpo carotídeo, un quimiorreceptor.',
      evidencia: [T(CC, 'It contains baroreceptors innervated by the glossopharyngeal nerve (CN IX), which detect changes in blood pressure.')],
    },
    {
      id: 'comp-cuerpo', tipo: 'comparacion', objetivo: 1, paso: 'seno-cuerpo', estructuras: ['carotida-comun'],
      enunciado: '¿En qué se diferencia el cuerpo carotídeo del seno carotídeo?',
      correcta: 'El cuerpo detecta el oxígeno; el seno, la presión',
      distractores: ['El cuerpo detecta la presión; el seno, el oxígeno', 'Los dos detectan la presión', 'El cuerpo es una vena y el seno, una arteria'],
      explicacion: 'Uno es quimiorreceptor y el otro, barorreceptor.',
      evidencia: [T(CC, 'It acts as a chemoreceptor, detecting changes in blood oxygen levels.'), T(CC, 'which detect changes in blood pressure.')],
    },
    { id: 'id-carotida-externa', tipo: 'identificar', estructura: 'carotida-externa', objetivo: 2, paso: 'externa' },
    {
      id: 'rel-externa-fin', tipo: 'relacion', objetivo: 2, paso: 'externa', estructuras: ['carotida-externa', 'temporal-superficial'],
      enunciado: '¿Dónde y en qué acaba la carótida externa?',
      correcta: 'En la parótida, dividida en la maxilar y la temporal superficial',
      distractores: ['En el cráneo, como cerebral media', 'En el tiroides, como tiroidea superior', 'En la órbita, como oftálmica'],
      explicacion: 'La cerebral media y la oftálmica son de la carótida interna.',
      evidencia: [T(CE, 'The external carotid artery terminates within the substance of the parotid gland, where it divides into the maxillary artery and superficial temporal artery.')],
    },
    { id: 'id-facial', tipo: 'identificar', estructura: 'facial', objetivo: 2, paso: 'externa' },
    { id: 'id-yugular-interna', tipo: 'identificar', estructura: 'yugular-interna', objetivo: 3, paso: 'yugulares' },
    {
      id: 'rel-yugular-interna', tipo: 'relacion', objetivo: 3, paso: 'yugulares', estructuras: ['yugular-interna', 'braquiocefalica-vena'],
      enunciado: '¿Con qué vena se une la yugular interna para formar la braquiocefálica?',
      correcta: 'Con la subclavia',
      distractores: ['Con la yugular externa', 'Con la cava inferior', 'Con la vena facial'],
      explicacion: 'La unión ocurre detrás del extremo esternal de la clavícula.',
      evidencia: [T(VEN, 'the IJV combines with the subclavian vein to form the brachiocephalic vein.')],
    },
    {
      id: 'rel-yugular-externa', tipo: 'relacion', objetivo: 3, paso: 'yugulares', estructuras: ['yugular-externa'],
      enunciado: '¿Dónde desemboca la yugular externa?',
      correcta: 'En la vena subclavia',
      distractores: ['En la yugular interna, dentro del cráneo', 'En la vena cava inferior', 'En el seno sigmoideo'],
      explicacion: 'Baja superficial y, en la raíz del cuello, pasa bajo la clavícula hasta la subclavia.',
      evidencia: [T(VEN, 'terminates by draining into the subclavian vein.')],
    },
  ],
});
