// Lección «Boca: dientes, lengua y glándulas salivales». Formato y evidencias: ../formato.js.
import { leccion, T, ES, GUIA, MODELO } from '../formato.js';

const ORA = 'head/organs/mouth/oral-cavity';
const DEN = 'head/organs/mouth/child-adult-dentition';
const LEN = 'head/muscles/tongue';
const PAR = 'head/organs/salivary-glands/parotid';
const SUB = 'head/organs/salivary-glands/submandibular';
const SLI = 'head/organs/salivary-glands/sublingual';
const nucleo = (nombre, piezas, tipo, lado = 'ambos', extra = {}) => ({ nombre, piezas, lado, papel: 'nucleo', tipo, ...extra });
const contexto = (nombre, piezas, tipo, lado = 'ambos') => ({ nombre, piezas, lado, papel: 'contexto', tipo });
const dientes = (...nombres) => nombres.flatMap((n) => [`Tooth_Upper_${n}`, `Tooth_Lower_${n}`]);

const DIENTES = ['incisivos', 'caninos', 'premolares', 'molares'];
const SALIVALES = ['parotida', 'submandibular', 'sublingual'];

export default leccion({
  id: 'cab-boca',
  version: 1,
  titulo: 'Boca: dientes, lengua y glándulas salivales',
  fuentesTerminologia: [ES('Molar', 'Los dientes molares (o muelas)')],
  resumen: 'La cavidad oral y sus partes; los tipos de dientes (incisivos, caninos, premolares y molares o muelas), las dos denticiones y las partes de un diente; los músculos de la lengua y qué nervios llevan su movimiento, su tacto y su gusto; y las tres glándulas salivales mayores con el lugar donde vierte cada una.',
  lugares: [['cabeza', 'cavidad-oral']],
  sistemas: ['digestivo'],
  formato: 'estructuras',
  temas: ['organos', 'nervios'],
  nivel: 2,
  minutos: 20,
  requisitos: ['sis-digestivo', 'cab-cara-huesos'],
  siguiente: ['cab-masticacion', 'cue-visceras', 'cab-nervios-craneales'],
  objetivos: [
    'Describir las partes de la cavidad oral, el vestíbulo y la boca propiamente dicha, y sus límites.',
    'Distinguir los tipos de dientes, contar las dos denticiones y describir las partes de un diente.',
    'Distinguir los músculos intrínsecos y extrínsecos de la lengua y decir qué nervio los mueve.',
    'Explicar qué nervios llevan el tacto y el gusto de los dos tercios anteriores y del tercio posterior de la lengua.',
    'Situar las tres glándulas salivales mayores y decir dónde se abre cada conducto.',
  ],
  estructuras: {
    incisivos: nucleo('Incisivos', dientes('Medial_Incisor', 'Lateral_Incisor'), 'diente'),
    caninos: nucleo('Caninos', dientes('Canine'), 'diente'),
    premolares: nucleo('Premolares', dientes('First_Premolar', 'Second_Premolar'), 'diente'),
    molares: nucleo('Molares (muelas)', dientes('First_Molar', 'Second_Molar'), 'diente'),
    lengua: nucleo('Lengua', ['Tongue'], 'organo', 'impar'),
    'paladar-blando': nucleo('Paladar blando', ['Soft_palate'], 'organo', 'impar'),
    geniogloso: nucleo('Geniogloso', ['Genioglossus_muscle'], 'musculo'),
    hiogloso: nucleo('Hiogloso', ['Hyoglossus_muscle'], 'musculo'),
    hipogloso: nucleo('Nervio hipogloso (XII)', ['Hypoglossal_nerve_XII'], 'nervio'),
    lingual: nucleo('Nervio lingual', ['Lingual_nerve'], 'nervio'),
    parotida: nucleo('Glándula parótida', ['Parotid_gland'], 'glandula', 'ambos', { confusiones: ['Glándula lagrimal', 'Glándula tiroides'] }),
    submandibular: nucleo('Glándula submandibular', ['Submandibular_gland'], 'glandula'),
    sublingual: nucleo('Glándula sublingual', ['Sublingual_gland'], 'glandula'),
    'conducto-parotideo': contexto('Conducto parotídeo', ['Parotid_duct'], 'organo'),
    'conducto-submandibular': contexto('Conducto submandibular', ['Submandibular_duct'], 'organo'),
    milohioideo: contexto('Milohioideos', ['Mylohyoid_muscle'], 'musculo'),
    geniohioideo: contexto('Geniohioideos', ['Geniohyoid_muscle'], 'musculo'),
    masetero: contexto('Masetero', ['Superficial_part_of_masseter'], 'musculo'),
    mandibula: contexto('Mandíbula', ['Mandible'], 'hueso', 'impar'),
    maxilares: contexto('Maxilares y palatinos', ['Maxilla', 'Palatine_Bone'], 'hueso'),
    hioides: contexto('Hueso hioides', ['Hyoid_Bone'], 'hueso', 'impar'),
  },
  pasos: [
    {
      id: 'orientacion', tipo: 'orientacion', titulo: 'La cavidad oral',
      texto: [
        ['La boca es la entrada del tubo digestivo y un paso compartido para comer, hablar y respirar.', T(ORA, 'The oral cavity (the mouth) is the entry point of the digestive tract. It serves as a shared passageway for eating, speaking, and breathing:')],
        ['Va de la hendidura de los labios al istmo de las fauces, la entrada de la orofaringe; las arcadas dentarias la dividen en el vestíbulo, entre labios o mejillas y dientes, y la boca propiamente dicha.', T(ORA, 'The oral cavity extends from the oral fissure anteriorly (the opening between the lips) to the oropharyngeal isthmus posteriorly (the entrance to the oropharynx).'), T(ORA, 'It is divided into two regions by the upper and lower dental arches – the vestibule and oral cavity proper.'), T(ORA, 'It is the space between the lips/cheeks, and the gums/teeth.')],
        ['El techo es el paladar, duro delante (una lámina de hueso que la separa de la nariz) y blando y muscular detrás; la lengua llena buena parte de la boca, y en el suelo están los milohioideos.', T(ORA, 'The roof of the mouth proper consists of the hard and soft palates.'), T(ORA, 'It is a bony plate that separates the nasal cavity from the oral cavity.'), T(ORA, 'In contrast to the hard palate, it is a muscular structure.'), T(ORA, 'The tongue fills a large proportion of the cavity of the mouth proper.'), T(ORA, 'Muscular diaphragm – comprised of the bilateral mylohyoid muscles.')],
        ['Mírala de frente y de lado.', GUIA],
      ],
      detalle: [
        ['El paladar blando hace de válvula: baja para cerrar el istmo de las fauces y sube para separar la nasofaringe de la orofaringe.', T(ORA, 'It acts as a valve that can lower to close the oropharyngeal isthmus, and elevate to separate the nasopharynx from the oropharynx.')],
        ['Las mejillas las forma el buccinador, que mantiene la comida entre los dientes al masticar.', T(ORA, 'The cheeks are formed by the buccinator muscle'), T(ORA, 'The buccinator muscle contracts to keep food between the teeth when chewing')],
      ],
      vista: { ver: ['lengua', ...DIENTES, 'paladar-blando'], contexto: ['mandibula', 'maxilares', 'milohioideo'], camara: 'anterolateral' },
      actividad: { tipo: 'vistas', texto: 'Recorre la boca.', vistas: [{ nombre: 'Tres cuartos', camara: 'anterolateral' }, { nombre: 'De lado', camara: 'lateral' }, { nombre: 'Desde abajo', camara: 'inferior' }] },
      comprobar: 'rel-vestibulo',
    },
    {
      id: 'dientes', tipo: 'exploracion', titulo: 'Los dientes',
      texto: [
        ['La dentición temporal tiene 20 dientes (dos incisivos, un canino y dos molares por cuadrante) y empieza a salir a los 6 meses; la permanente tiene 32 (dos incisivos, un canino, dos premolares y tres molares por cuadrante).', T(DEN, 'The primary dentition is composed of 20 teeth, with 10 in each arch. There are five teeth in each quadrant, composed of two incisors (central and lateral), a canine, and two molars.'), T(DEN, 'The primary teeth begin to erupt at 6 months of age.'), T(DEN, 'The permanent dentition is composed of 32 teeth with 16 in each arch. There are eight teeth in each quadrant, composed of two incisors (central and lateral), a canine, two premolars, and three molars.')],
        ['Los permanentes empiezan a sustituir a los temporales a los 6 años y terminan hacia los 13, salvo las muelas del juicio, que suelen salir hacia los 21.', T(DEN, 'The permanent teeth begin to erupt, and replace the primary teeth, at 6 years of age. The permanent teeth complete eruption by approximately age 13 years – with the exception of the 3rd molar ‘wisdom’ teeth, which usually erupt by the age of 21 years.')],
        ['Los incisivos cortan; la cúspide de los caninos perfora y sujeta; los premolares solo existen en la dentición permanente, y los molares trituran y mastican.', T(DEN, 'Central and lateral incisors have straight edges that are designed to incise into food.'), T(DEN, 'The function of the cusp is to pierce and hold food.'), T(DEN, 'There are no premolars in the primary dentition.'), T(DEN, 'They are located at the back of the mouth, and are designed to crush and chew food, prior to swallowing.')],
      ],
      detalle: [
        ['Cada diente tiene corona, cubierta de esmalte, y raíz, cubierta de cemento; debajo está la dentina, y dentro, la pulpa, con vasos y nervios que entran por el agujero del vértice de la raíz.', T(DEN, 'Generally, the anatomic crown is covered by enamel, whilst the anatomic root is covered by cementum:'), T(DEN, 'A layer of dentine lies beneath the enamel and cementum, throughout the crown and root.'), T(DEN, 'The pulp cavity is the space within a tooth root that is filled with the vital dental pulp, a pink mass of innervated, vascular tissue.'), T(DEN, 'The apical foramen is the space at the apex through which blood vessels and nerves enter the dental pulp')],
        ['Los molares se cariesan con facilidad por los surcos profundos de su cara de masticación, difíciles de limpiar.', T(DEN, 'Molar teeth are particularly at risk of dental caries (decay) due to the presence of deep grooves that run across the occlusal (top) surface of the teeth')],
        ['El modelo tiene la dentición permanente sin los terceros molares: 28 dientes.', MODELO],
      ],
      vista: { ver: DIENTES, contexto: ['mandibula', 'maxilares'], camara: 'anterolateral' },
      actividad: { tipo: 'comparar', estructuras: DIENTES, texto: 'Alterna los cuatro tipos de dientes, de delante atrás.' },
      comprobar: 'comp-denticion',
    },
    {
      id: 'lengua', tipo: 'exploracion', titulo: 'Los músculos de la lengua',
      texto: [
        ['La lengua es un órgano muscular del suelo de la boca: el principal órgano del gusto y clave al empezar a tragar.', T(LEN, 'The tongue is a muscular structure located on the floor of the oral cavity.'), T(LEN, 'It is the primary taste organ and plays a key role in the initial phases of swallowing.')],
        ['Sus cuatro músculos intrínsecos (longitudinales superior e inferior, transverso y vertical) cambian su forma; los extrínsecos, que vienen de fuera, cambian su posición.', T(LEN, 'There are four paired intrinsic muscles of the tongue and they are named by the direction in which they travel – the superior longitudinal, inferior longitudinal, transverse and vertical muscles of the tongue.'), T(LEN, "The tongue's movement is controlled by intrinsic muscles, which change its shape, and extrinsic muscles, which alter its position.")],
        ['El geniogloso, grande, nace de la sínfisis de la mandíbula y saca la lengua; el hiogloso, del hioides, la baja y la retrae, y el estilogloso la retrae y la eleva.', T(LEN, 'Arises from the mandibular symphysis.'), T(LEN, 'Function: Protrusion (‘sticking the tongue out’) and depression of the tongue.'), T(LEN, 'Arises from the hyoid bone and inserts onto the lateral aspect of the tongue.'), T(LEN, 'Function: Depression and retraction of the tongue.'), T(LEN, 'Function: Retraction and elevation of the tongue.')],
        ['Todos los mueve el hipogloso (XII), salvo el palatogloso, que por su relación con el paladar blando depende del vago.', T(LEN, 'The motor innervation to the intrinsic muscles of the tongue is via the hypoglossal nerve (CN XII).'), T(LEN, 'They are innervated by the hypoglossal nerve – with the exception of the palatoglossus, which is innervated by the vagus nerve.')],
      ],
      detalle: [
        ['El modelo representa la lengua como una sola pieza, sin los músculos intrínsecos, y no tiene el estilogloso ni el palatogloso.', MODELO],
      ],
      vista: { ver: ['geniogloso', 'hiogloso', 'hipogloso'], contexto: ['mandibula', 'hioides', 'geniohioideo'], fantasma: ['lengua'], camara: 'lateral' },
      actividad: { tipo: 'comparar', estructuras: ['geniogloso', 'hiogloso'], texto: 'Alterna el geniogloso, que saca la lengua, y el hiogloso, que la baja y la retrae.' },
      comprobar: 'fun-geniogloso',
    },
    {
      id: 'inervacion', tipo: 'relaciones', titulo: 'El tacto y el gusto de la lengua',
      texto: [
        ['Para su sensibilidad, la lengua se divide en dos tercios anteriores y un tercio posterior.', T(LEN, 'we need to start looking at its division into an anterior 2/3, and a posterior 1/3.')],
        ['En los dos tercios anteriores, la sensibilidad general llega por el nervio lingual, rama de la división mandibular del trigémino, y el gusto, por la cuerda del tímpano, rama del facial.', T(LEN, 'In the anterior 2/3, general sensation is supplied by the trigeminal nerve (CNV). Specifically the lingual nerve, a branch of the mandibular nerve (CN V3).'), T(LEN, 'On the other hand, taste in the anterior 2/3 is supplied from the facial nerve (CNVII).'), T(LEN, 'one of which is chorda tympani. This travels through the middle ear, and continues on to the tongue.')],
        ['En el tercio posterior, el tacto y el gusto los lleva el glosofaríngeo (IX).', T(LEN, 'The posterior 1/3 of the tongue is slightly easier. Both touch and taste are supplied by the glossopharyngeal nerve (CNIX).')],
        ['La razón está en su desarrollo: la lengua se forma a partir de los cuatro primeros arcos branquiales, y cada arco tiene su nervio.', T(LEN, 'with contribution from the first four branchial arches.'), T(LEN, 'One of the central points is that the first branchial arch is supplied by the trigeminal nerve, the second by the facial, the third by the glossopharyngeal, and the fourth and sixth by the vagus.')],
      ],
      detalle: [
        ['La irriga sobre todo la arteria lingual, rama de la carótida externa, y la drena la vena lingual hacia la yugular interna.', T(LEN, 'The arterial supply to the tongue is mainly from the lingual artery (a branch of the external carotid artery).'), T(LEN, 'Venous drainage is by the lingual vein – which empties into the internal jugular vein.')],
        ['Atrás, el agujero ciego marca el punto de donde partió el tiroides al bajar hacia el cuello durante el desarrollo.', T(LEN, 'the foramen cecum (blind window), at the end of which lies the thyroid gland. During development, this descends from the tongue down into the neck')],
        ['El modelo no tiene la arteria lingual ni la cuerda del tímpano.', MODELO],
      ],
      vista: { ver: ['lingual', 'hipogloso'], contexto: ['mandibula', 'hioides'], fantasma: ['lengua'], camara: 'lateral' },
      actividad: { tipo: 'comparar', estructuras: ['lingual', 'hipogloso'], texto: 'Alterna el lingual, que lleva la sensibilidad, y el hipogloso, que mueve la lengua.' },
      comprobar: 'rel-gusto-anterior',
    },
    {
      id: 'salivales', tipo: 'exploracion', titulo: 'Las glándulas salivales mayores',
      texto: [
        ['La parótida, entre la oreja y el masetero, produce saliva serosa, acuosa y rica en enzimas; su conducto cruza el masetero, atraviesa el buccinador y se abre en el vestíbulo, frente al segundo molar superior.', T(PAR, 'Anteriorly – Masseter muscle.'), T(PAR, 'Posteriorly – External ear and sternocleidomastoid.'), T(PAR, 'It produces serous saliva – a watery solution rich in enzymes'), T(PAR, 'It arises from the anterior aspect of the gland, running across the surface of the masseter muscle.'), T(PAR, 'The duct then pierces the buccinator, moving medially.'), T(ORA, 'Opposite the upper second molar tooth, the duct of the parotid gland opens out into the vestibule')],
        ['La submandibular, de saliva mixta, se engancha al borde posterior del milohioideo; su conducto, de unos 5 cm, se abre en una papila a cada lado del frenillo de la lengua.', T(SUB, 'Their mixed serous and mucous salivary secretions'), T(SUB, 'The positioning of these arms is in relation to the mylohyoid muscle, which the gland hooks around.'), T(SUB, 'This is approximately 5cm in length'), T(SUB, 'The duct ascends on its course to open as 1-3 orifices on a small sublingual papilla (caruncle) at the base of the lingual frenulum bilaterally.')],
        ['La sublingual, la más pequeña y profunda, aporta solo el 3 al 5 % de la saliva, sobre todo mucosa, por muchos conductillos que se abren en el pliegue sublingual.', T(SLI, 'The sublingual glands are the smallest of the three paired salivary glands and the most deeply situated.'), T(SLI, 'Both glands contribute to only 3-5% of overall salivary volume, producing mixed secretions which are predominately mucous in nature.'), T(SLI, 'Secretions drain into the oral cavity by minor sublingual ducts (of Rivinus), of which there are 8-20 excretory ducts per gland, each opening out onto the sublingual folds.')],
      ],
      detalle: [
        ['El nervio facial atraviesa la parótida, la divide en dos lóbulos y se ramifica dentro de ella.', T(PAR, 'Anatomically, it can be divided into deep and superficial lobes, which are separated by the facial nerve.'), T(PAR, 'Facial nerve (CN VII) – gives rise to five terminal branches within the parotid gland.')],
        ['El conducto submandibular tiene muy cerca el nervio lingual, que pasa por debajo de él.', T(SUB, 'Lingual nerve: Beginning lateral to the submandibular duct, this nerve courses anteromedially by looping beneath the duct')],
      ],
      vista: { ver: SALIVALES, contexto: ['conducto-parotideo', 'conducto-submandibular', 'mandibula', 'milohioideo', 'lengua'], fantasma: ['masetero'], camara: 'lateral' },
      actividad: { tipo: 'comparar', estructuras: SALIVALES, texto: 'Alterna las tres glándulas salivales mayores y sigue sus conductos.' },
      comprobar: 'rel-conducto-parotideo',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['Boca: vestíbulo y boca propiamente dicha, con el paladar duro y blando por techo y los milohioideos en el suelo.', T(ORA, 'the vestibule and oral cavity proper.'), T(ORA, 'The roof of the mouth proper consists of the hard and soft palates.'), T(ORA, 'comprised of the bilateral mylohyoid muscles.')],
        ['Dientes: 20 temporales y 32 permanentes; incisivos, caninos, premolares (solo permanentes) y molares.', T(DEN, 'The primary dentition is composed of 20 teeth'), T(DEN, 'The permanent dentition is composed of 32 teeth'), T(DEN, 'There are no premolars in the primary dentition.')],
        ['Lengua: movimiento por el hipogloso (salvo el palatogloso); dos tercios anteriores, lingual y cuerda del tímpano; tercio posterior, glosofaríngeo. Saliva: parótida al vestíbulo, submandibular junto al frenillo y sublingual al pliegue sublingual.', T(LEN, 'They are innervated by the hypoglossal nerve – with the exception of the palatoglossus'), T(LEN, 'Both touch and taste are supplied by the glossopharyngeal nerve (CNIX).'), T(ORA, 'the duct of the parotid gland opens out into the vestibule'), T(SUB, 'at the base of the lingual frenulum bilaterally.'), T(SLI, 'each opening out onto the sublingual folds.')],
      ],
    },
  ],
  preguntas: [
    {
      id: 'rel-vestibulo', tipo: 'relacion', objetivo: 0, paso: 'orientacion', estructuras: DIENTES,
      enunciado: '¿Qué es el vestíbulo de la boca?',
      correcta: 'El espacio entre los labios o las mejillas y los dientes',
      distractores: ['El espacio entre la lengua y el paladar', 'La entrada de la orofaringe', 'El suelo de la boca, bajo la lengua'],
      explicacion: 'Las arcadas dentarias separan el vestíbulo, por fuera, de la boca propiamente dicha, por dentro.',
      evidencia: [T(ORA, 'It is the space between the lips/cheeks, and the gums/teeth.')],
    },
    {
      id: 'comp-paladar', tipo: 'comparacion', objetivo: 0, paso: 'orientacion', estructuras: ['paladar-blando'],
      enunciado: '¿Qué diferencia el paladar duro del blando?',
      correcta: 'El duro es una lámina de hueso, delante; el blando es muscular y está detrás',
      distractores: ['El duro es muscular y el blando, de hueso', 'Los dos son de hueso', 'El blando está delante y el duro detrás'],
      explicacion: 'El duro separa la boca de la nariz; el blando lo continúa por detrás y hace de válvula.',
      evidencia: [T(ORA, 'The hard palate is found anteriorly. It is a bony plate that separates the nasal cavity from the oral cavity.'), T(ORA, 'In contrast to the hard palate, it is a muscular structure.')],
    },
    {
      id: 'comp-denticion', tipo: 'comparacion', objetivo: 1, paso: 'dientes', estructuras: DIENTES,
      enunciado: '¿Qué tipo de diente no existe en la dentición temporal?',
      correcta: 'Los premolares',
      distractores: ['Los caninos', 'Los molares', 'Los incisivos laterales'],
      explicacion: 'Cada cuadrante temporal tiene dos incisivos, un canino y dos molares; los premolares aparecen con la dentición permanente.',
      evidencia: [T(DEN, 'There are no premolars in the primary dentition.')],
    },
    {
      id: 'rel-cuantos', tipo: 'relacion', objetivo: 1, paso: 'dientes', estructuras: DIENTES,
      enunciado: '¿Cuántos dientes tiene la dentición permanente completa?',
      correcta: '32',
      distractores: ['20', '28', '24'],
      explicacion: 'Son 32, ocho por cuadrante; 20 es la dentición temporal. El modelo muestra 28 porque no tiene las muelas del juicio.',
      evidencia: [T(DEN, 'The permanent dentition is composed of 32 teeth with 16 in each arch.')],
    },
    {
      id: 'fun-caninos', tipo: 'funcion', objetivo: 1, paso: 'dientes', estructuras: ['caninos'],
      enunciado: '¿Para qué sirve la cúspide de los caninos?',
      correcta: 'Para perforar y sujetar el alimento',
      distractores: ['Para cortarlo con un borde recto', 'Para triturarlo y masticarlo', 'Para separar la lengua de los dientes'],
      explicacion: 'Cortar es de los incisivos y triturar, de los molares.',
      evidencia: [T(DEN, 'The function of the cusp is to pierce and hold food.')],
    },
    { id: 'id-molares', tipo: 'identificar', estructura: 'molares', objetivo: 1, paso: 'dientes' },
    { id: 'loc-caninos', tipo: 'localizar', estructura: 'caninos', candidatas: ['incisivos', 'premolares'], objetivo: 1, paso: 'dientes' },
    {
      id: 'fun-geniogloso', tipo: 'funcion', objetivo: 2, paso: 'lengua', estructuras: ['geniogloso'],
      enunciado: '¿Qué músculo saca la lengua?',
      correcta: 'El geniogloso',
      distractores: ['El hiogloso', 'El estilogloso', 'El palatogloso'],
      explicacion: 'El geniogloso la saca y la baja; el hiogloso la baja y la retrae, el estilogloso la retrae y la eleva y el palatogloso eleva su parte posterior.',
      evidencia: [T(LEN, 'Function: Protrusion (‘sticking the tongue out’) and depression of the tongue.')],
    },
    {
      id: 'rel-palatogloso', tipo: 'relacion', objetivo: 2, paso: 'lengua', estructuras: ['hipogloso'],
      enunciado: '¿Qué músculo de la lengua no lo mueve el hipogloso?',
      correcta: 'El palatogloso, que depende del vago',
      distractores: ['El geniogloso', 'El hiogloso', 'Los músculos intrínsecos'],
      explicacion: 'El palatogloso se relaciona con el paladar blando y, como él, lo inerva el vago.',
      evidencia: [T(LEN, 'with the exception of the palatoglossus, which is innervated by the vagus nerve.')],
    },
    {
      id: 'comp-intrinsecos', tipo: 'comparacion', objetivo: 2, paso: 'lengua', estructuras: ['lengua', 'geniogloso'],
      enunciado: '¿En qué se diferencian los músculos intrínsecos de la lengua de los extrínsecos?',
      correcta: 'Los intrínsecos cambian su forma; los extrínsecos, que vienen de fuera, cambian su posición',
      distractores: ['Los intrínsecos la sacan y los extrínsecos la meten', 'Los intrínsecos los inerva el vago y los extrínsecos, el hipogloso', 'Los intrínsecos están fuera de la lengua'],
      explicacion: 'Los intrínsecos nacen y acaban dentro de la lengua; los extrínsecos vienen de huesos o del paladar. Casi todos dependen del hipogloso.',
      evidencia: [T(LEN, "The tongue's movement is controlled by intrinsic muscles, which change its shape, and extrinsic muscles, which alter its position.")],
    },
    { id: 'id-geniogloso', tipo: 'identificar', estructura: 'geniogloso', objetivo: 2, paso: 'lengua' },
    {
      id: 'rel-gusto-anterior', tipo: 'relacion', objetivo: 3, paso: 'inervacion', estructuras: ['lingual'],
      enunciado: '¿Qué nervio lleva el gusto de los dos tercios anteriores de la lengua?',
      correcta: 'El facial, por la cuerda del tímpano',
      distractores: ['El lingual, rama del trigémino', 'El glosofaríngeo', 'El hipogloso'],
      explicacion: 'El lingual lleva la sensibilidad general de esos dos tercios, pero el gusto llega por la cuerda del tímpano, rama del facial.',
      evidencia: [T(LEN, 'On the other hand, taste in the anterior 2/3 is supplied from the facial nerve (CNVII).')],
    },
    {
      id: 'rel-tercio-posterior', tipo: 'relacion', objetivo: 3, paso: 'inervacion', estructuras: ['lengua'],
      enunciado: '¿Qué nervio lleva el tacto y el gusto del tercio posterior de la lengua?',
      correcta: 'El glosofaríngeo (IX)',
      distractores: ['El facial (VII)', 'El trigémino (V)', 'El hipogloso (XII)'],
      explicacion: 'En el tercio posterior, un solo nervio, el glosofaríngeo, lleva las dos cosas.',
      evidencia: [T(LEN, 'Both touch and taste are supplied by the glossopharyngeal nerve (CNIX).')],
    },
    {
      id: 'rel-conducto-parotideo', tipo: 'relacion', objetivo: 4, paso: 'salivales', estructuras: ['parotida'],
      enunciado: '¿Dónde se abre el conducto de la parótida?',
      correcta: 'En el vestíbulo, frente al segundo molar superior',
      distractores: ['A cada lado del frenillo de la lengua', 'En el pliegue sublingual', 'En la orofaringe'],
      explicacion: 'Junto al frenillo se abre el conducto submandibular y en el pliegue sublingual, los de la sublingual.',
      evidencia: [T(ORA, 'Opposite the upper second molar tooth, the duct of the parotid gland opens out into the vestibule')],
    },
    {
      id: 'rel-submandibular', tipo: 'relacion', objetivo: 4, paso: 'salivales', estructuras: ['submandibular'],
      enunciado: '¿Dónde se abre el conducto submandibular?',
      correcta: 'En una papila a cada lado del frenillo de la lengua',
      distractores: ['En el vestíbulo, frente al segundo molar superior', 'En el paladar blando', 'En la nasofaringe'],
      explicacion: 'Sube unos 5 cm desde la glándula y se abre junto a la base del frenillo.',
      evidencia: [T(SUB, 'The duct ascends on its course to open as 1-3 orifices on a small sublingual papilla (caruncle) at the base of the lingual frenulum bilaterally.')],
    },
    {
      id: 'comp-sublingual', tipo: 'comparacion', objetivo: 4, paso: 'salivales', estructuras: SALIVALES,
      enunciado: '¿Cuál es la más pequeña de las glándulas salivales mayores?',
      correcta: 'La sublingual',
      distractores: ['La submandibular', 'La parótida', 'Las tres son del mismo tamaño'],
      explicacion: 'La sublingual es la más pequeña y profunda, y aporta solo el 3 al 5 % de la saliva.',
      evidencia: [T(SLI, 'The sublingual glands are the smallest of the three paired salivary glands and the most deeply situated.')],
    },
    { id: 'id-parotida', tipo: 'identificar', estructura: 'parotida', objetivo: 4, paso: 'salivales' },
  ],
});
