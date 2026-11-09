// Lección «Huesos del pie y articulación del tobillo». Formato y evidencias: ../formato.js.
import { leccion, W, T, GUIA, MODELO } from '../formato.js';

const PIE = 'lower-limb/bones/bones-of-the-foot-tarsals-metatarsals-and-phalanges';
const TOB = 'lower-limb/joints/ankle-joint';
const hueso = (nombre, piezas, extra = {}) => ({ nombre, piezas, lado: 'bilateral', papel: 'nucleo', tipo: 'hueso', ...extra });
const ligamento = (nombre, piezas) => ({ nombre, piezas, lado: 'bilateral', papel: 'nucleo', tipo: 'ligamento' });
const contexto = (nombre, piezas, tipo) => ({ nombre, piezas, lado: 'bilateral', papel: 'contexto', tipo });
const serie = (base, desde, hasta) => Array.from({ length: hasta - desde + 1 }, (_, i) => `${base}_${desde + i}`);

const CUNEIFORMES = ['cuneiforme-medial', 'cuneiforme-intermedio', 'cuneiforme-lateral'];
const TARSO = ['talus', 'calcaneo', 'navicular', 'cuboides', ...CUNEIFORMES];
const ANTEPIE = ['metatarsianos', 'falanges-proximales', 'falanges-medias', 'falanges-distales', 'sesamoideos'];

export default leccion({
  id: 'mi-pie-huesos-tobillo',
  version: 1,
  titulo: 'Huesos del pie y articulación del tobillo',
  resumen: 'Los huesos del pie (siete del tarso, cinco metatarsianos, catorce falanges y los sesamoideos) y la articulación del tobillo: la mortaja de la tibia y la fíbula, el astrágalo, los movimientos que permite y sus ligamentos medial y lateral, el que más se lesiona en un esguince.',
  lugares: [['miembro-inferior', 'tobillo'], ['miembro-inferior', 'pie']],
  sistemas: ['oseo', 'articular'],
  formato: 'estructuras',
  temas: ['huesos', 'articulaciones', 'accidentes-oseos'],
  nivel: 1,
  minutos: 16,
  requisitos: ['fund-orientacion', 'mi-huesos'],
  siguiente: ['mi-pie-musculos', 'mi-pierna-posterior'],
  objetivos: [
    'Localizar los siete huesos del tarso y decir en qué parte del pie está cada uno.',
    'Localizar los metatarsianos, las falanges y los sesamoideos del pie.',
    'Describir la articulación del tobillo: qué huesos la forman, qué movimientos permite y en qué posición es más estable.',
    'Distinguir el ligamento lateral del medial del tobillo y explicar por qué el lateral se lesiona más.',
  ],
  estructuras: {
    talus: hueso('Astrágalo (talus)', ['Talus']),
    calcaneo: hueso('Calcáneo', ['Calcaneus']),
    navicular: hueso('Navicular', ['Navicular']),
    cuboides: hueso('Cuboides', ['Cuboid']),
    'cuneiforme-medial': hueso('Cuneiforme medial', ['Medial_Cuneiform']),
    'cuneiforme-intermedio': hueso('Cuneiforme intermedio', ['Intermediate_Cuneiform']),
    'cuneiforme-lateral': hueso('Cuneiforme lateral', ['Lateral_Cuneiform']),
    metatarsianos: hueso('Metatarsianos', serie('Metatarsal', 1, 5)),
    'falanges-proximales': hueso('Falanges proximales del pie', serie('Proximal_Phalanx_Foot', 1, 5)),
    'falanges-medias': hueso('Falanges medias del pie', serie('Middle_Phalanx_Foot', 2, 5)),
    'falanges-distales': hueso('Falanges distales del pie', serie('Distal_Phalanx_Foot', 1, 5)),
    sesamoideos: hueso('Sesamoideos del pie', ['Sesamoid_Bones_Foot']),
    'lig-lateral': ligamento('Ligamento lateral del tobillo (talofibulares y calcaneofibular)', ['Anterior_talofibular_ligament', 'Posterior_talofibular_ligament', 'Calcaneofibular_ligament']),
    'lig-medial': ligamento('Ligamento medial o deltoideo', ['Tibiocalcaneal_ligament', 'Tibionavicular_ligament', 'Posterior_tibiotalar_ligament']),
    'lig-calcaneonavicular': contexto('Ligamento calcaneonavicular plantar', ['Plantar_calcaneonavicular_ligament'], 'ligamento'),
    'retinaculos-extensores': contexto('Retináculos de los extensores del tobillo', ['Superior_extensor_retinaculum_of_ankle', 'Inferior_extensor_retinaculum_of_ankle'], 'ligamento'),
    tibia: contexto('Tibia', ['Tibia'], 'hueso'),
    fibula: contexto('Fíbula (peroné)', ['Fibula'], 'hueso'),
  },
  pasos: [
    {
      id: 'orientacion', tipo: 'orientacion', titulo: 'Los huesos del pie',
      texto: [
        ['Los huesos del pie lo ayudan a soportar el peso del cuerpo, de pie y en movimiento.', T(PIE, 'helping the foot withstand the weight of the body whilst standing and in motion.')],
        ['Son de tres grupos: los siete huesos del tarso, cinco metatarsianos (uno por dedo) y las falanges de los dedos.', T(PIE, 'Tarsals – a set of seven irregularly shaped bones.'), T(PIE, 'There are five in number – one for each digit.'), T(PIE, 'Phalanges – the bones of the toes.')],
        ['El pie también se divide en retropié (astrágalo y calcáneo), mediopié (navicular, cuboides y cuneiformes) y antepié (metatarsianos y falanges).', T(PIE, 'The foot can also be divided up into three regions: (i) Hindfoot – talus and calcaneus; (ii) Midfoot – navicular, cuboid, and cuneiforms; and (iii) Forefoot – metatarsals and phalanges.')],
        ['Mira el pie desde arriba, desde dentro y desde abajo.', GUIA],
      ],
      detalle: [
        ['En total, el pie tiene 26 huesos y 33 articulaciones.', W('Foot', 'The human foot is a strong and complex mechanical structure containing 26 bones, 33 joints (20 of which are actively articulated)')],
      ],
      vista: { ver: [...TARSO, ...ANTEPIE], contexto: ['tibia', 'fibula'], camara: 'anterolateral', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'Recorre el pie desde tres lados.', vistas: [{ nombre: 'Desde arriba', camara: 'superior' }, { nombre: 'Desde dentro', camara: 'medial' }, { nombre: 'Desde abajo', camara: 'inferior' }] },
      comprobar: 'rel-retropie',
    },
    {
      id: 'retropie', tipo: 'explicacion', titulo: 'El astrágalo y el calcáneo',
      texto: [
        ['El astrágalo (talus) es el más alto de los huesos del tarso y transmite al pie el peso de todo el cuerpo.', T(PIE, 'The talus is the most superior of the tarsal bones. It transmits the weight of the entire body to the foot.')],
        ['Se articula arriba con la tibia y la fíbula (tobillo), abajo con el calcáneo (articulación subastragalina) y delante con el navicular.', T(PIE, 'Superiorly – ankle joint – between the talus and the bones of the leg (the tibia and fibula).'), T(PIE, 'Inferiorly – subtalar joint – between the talus and calcaneus.'), T(PIE, 'Anteriorly – talonavicular joint – between the talus and the navicular.')],
        ['En él se fijan muchos ligamentos pero ningún músculo, y su riego depende de las fascias: por eso tiene un riesgo alto de necrosis.', T(PIE, 'Whilst numerous ligaments attach to the talus, no muscles originate from or insert onto it. This means there is a high risk of avascular necrosis as the vascular supply is dependent on fascial structures.')],
        ['El calcáneo es el mayor hueso del tarso: está debajo del astrágalo, forma el talón y, en su tuberosidad, recibe el tendón de Aquiles.', T(PIE, 'The calcaneus is the largest tarsal bone and lies underneath the talus where it constitutes the heel.'), T(PIE, 'The posterior aspect of the calcaneus is marked by calcaneal tuberosity, to which the Achilles tendon attaches.')],
      ],
      vista: { ver: ['talus', 'calcaneo'], contexto: ['tibia', 'fibula', 'navicular', 'cuboides'], camara: 'lateral', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'talus', texto: 'Toca el hueso del tarso que se articula con la tibia y la fíbula.' },
      comprobar: 'rel-aquiles',
    },
    {
      id: 'mediopie', tipo: 'exploracion', titulo: 'Navicular, cuboides y cuneiformes',
      texto: [
        ['La fila intermedia del tarso tiene un solo hueso, el navicular, con forma de barca, en el lado medial: se articula detrás con el astrágalo, delante con los tres cuneiformes y por fuera con el cuboides.', T(PIE, 'The intermediate row of tarsal bones contains one bone, the navicular (given its name because it is shaped like a boat).'), T(PIE, 'Positioned medially, it articulates with the talus posteriorly, all three cuneiform bones anteriorly, and the cuboid bone laterally.')],
        ['La fila distal tiene cuatro, el cuboides y los tres cuneiformes, que se articulan con los metatarsianos.', T(PIE, 'In the distal row, there are four tarsal bones – the cuboid and the three cuneiforms. These bones articulate with the metatarsals of the foot')],
        ['El cuboides es el más lateral: queda delante del calcáneo y detrás del cuarto y el quinto metatarsianos.', T(PIE, 'The cuboid is furthest lateral, lying anterior to the calcaneus and behind the fourth and fifth metatarsals.')],
        ['Los cuneiformes (medial, intermedio y lateral) tienen forma de cuña y ayudan a formar el arco transversal del pie.', T(PIE, 'The three cuneiforms (lateral, intermediate (or middle) and medial) are wedge shaped bones.'), T(PIE, 'The shape of the bones helps form a transverse arch across the foot.')],
      ],
      detalle: [
        ['En el cuneiforme medial se insertan el tibial anterior, parte del tibial posterior y el fibular largo.', T(PIE, 'Medial cuneiform – tibialis anterior, (part of) tibialis posterior, and fibularis longus')],
      ],
      vista: { ver: ['navicular', 'cuboides', ...CUNEIFORMES], contexto: ['talus', 'calcaneo', 'metatarsianos'], camara: 'superior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['navicular', 'cuboides', ...CUNEIFORMES], texto: 'Resalta cada hueso del mediopié y sigue con qué contacta.' },
      comprobar: 'rel-navicular',
    },
    {
      id: 'antepie', tipo: 'explicacion', titulo: 'Metatarsianos, falanges y sesamoideos',
      texto: [
        ['Los metatarsianos, en el antepié, se numeran del I al V de medial a lateral; cada uno tiene cabeza, cuello, cuerpo y base.', T(PIE, 'The metatarsals are located in the forefoot, between the tarsals and phalanges. They are numbered I-V (medial to lateral).'), T(PIE, 'They are convex dorsally and consist of a head, neck, shaft, and base (distal to proximal).')],
        ['Cada dedo tiene tres falanges, proximal, media y distal, salvo el dedo gordo, que tiene dos.', T(PIE, 'Each toe has three phalanges – proximal, intermediate, and distal (except the big toe, which only has two phalanges).')],
        ['Donde el primer metatarsiano se une al dedo gordo suele haber dos sesamoideos, dentro del tendón del flexor corto del dedo gordo.', W('Sesamoid_bone', 'the first metatarsal bone usually has two sesamoid bones at its connection to the big toe (both within the tendon of flexor hallucis brevis).')],
      ],
      detalle: [
        ['Las fracturas por estrés son frecuentes en deportistas, sobre todo en los cuellos del segundo y el tercer metatarsianos y en la base del quinto.', T(PIE, 'It is common in athletes and occurs most frequently at the necks of the second and third metatarsals and the proximal fifth metatarsal.')],
        ['En el modelo, los sesamoideos de cada pie son una sola pieza.', MODELO],
      ],
      vista: { ver: ANTEPIE, contexto: [...CUNEIFORMES, 'cuboides'], camara: 'superior', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'Los sesamoideos solo se ven desde abajo.', vistas: [{ nombre: 'Desde arriba', camara: 'superior' }, { nombre: 'Desde abajo', camara: 'inferior' }] },
      comprobar: 'rel-dedo-gordo',
    },
    {
      id: 'tobillo', tipo: 'relaciones', titulo: 'La articulación del tobillo',
      texto: [
        ['El tobillo (articulación talocrural) une los extremos de la tibia y la fíbula con el astrágalo; es una articulación sinovial en bisagra.', W('Ankle', 'The talocrural joint is a synovial hinge joint that connects the distal ends of the tibia and fibula in the lower limb with the proximal end of the talus.')],
        ['La tibia y la fíbula forman una cavidad en forma de horquilla, la mortaja, en la que encaja el cuerpo del astrágalo.', T(TOB, 'Together, they form a bracket shaped socket, covered in hyaline cartilage.'), T(TOB, 'This socket is known as a mortise.'), T(TOB, 'The body of the talus fits snugly into the mortise formed by the bones of the leg.')],
        ['Se mueve en un solo plano: flexión dorsal y flexión plantar; la inversión y la eversión se hacen en otras articulaciones del pie, como la subastragalina.', T(TOB, 'The ankle joint is a hinge type joint, with movement permitted in one plane.'), T(TOB, 'Thus, plantarflexion and dorsiflexion are the main movements that occur at the ankle joint.'), T(TOB, 'Eversion and inversion are produced at the other joints of the foot, such as the subtalar joint.')],
        ['El astrágalo es más ancho por delante: en flexión dorsal encaja esa parte y el tobillo es más estable; en flexión plantar, menos.', T(TOB, 'The articulating part of the talus is wedge shaped – it is broad anteriorly, and narrow posteriorly:'), T(TOB, 'Dorsiflexion – the anterior part of the talus is held in the mortise, and the joint is more stable.'), T(TOB, 'Plantarflexion – the posterior part of the talus is held in the mortise, and the joint is less stable.')],
      ],
      vista: { ver: ['talus'], contexto: ['tibia', 'fibula', 'calcaneo'], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'Mira la mortaja de frente y el astrágalo encajado desde los lados.', vistas: [{ nombre: 'De frente', camara: 'anterior' }, { nombre: 'Por fuera', camara: 'lateral' }, { nombre: 'Por dentro', camara: 'medial' }] },
      comprobar: 'fun-estable',
    },
    {
      id: 'ligamentos', tipo: 'relaciones', titulo: 'Los ligamentos del tobillo',
      texto: [
        ['El ligamento medial, o deltoideo, sale del maléolo medial y se abre en abanico hacia el astrágalo, el calcáneo y el navicular; frena la eversión excesiva.', T(TOB, 'The medial ligament (or deltoid ligament) is attached to the medial malleolus'), T(TOB, 'It consists of four ligaments, which fan out from the malleolus, attaching to the talus, calcaneus and navicular bones.'), T(TOB, 'The primary action of the medial ligament is to resist over-eversion of the foot.')],
        ['El ligamento lateral sale del maléolo lateral, frena la inversión excesiva y tiene tres partes: los talofibulares anterior y posterior y el calcaneofibular.', T(TOB, 'The lateral ligament originates from the lateral malleolus'), T(TOB, 'It resists over-inversion of the foot, and is comprised of three distinct and separate ligaments:'), T(TOB, 'Anterior talofibular – spans between the lateral malleolus and lateral aspect of the talus.'), T(TOB, 'Calcaneofibular – spans between the lateral malleolus and the calcaneus.')],
        ['El esguince típico se produce por una inversión excesiva con el pie en flexión plantar y cargando peso.', T(TOB, 'It usually occurs via excessive inversion to a plantarflexed and weight-bearing foot.')],
        ['Se lesiona más el ligamento lateral, porque es más débil y frena la inversión; el talofibular anterior es el más expuesto.', T(TOB, 'The lateral ligament is weaker than the medial ligament.'), T(TOB, 'The lateral ligament resists inversion.'), T(TOB, 'The anterior talofibular ligament is the lateral ligament most at risk of irreversible damage.')],
      ],
      detalle: [
        ['En el modelo, el ligamento deltoideo está representado por tres de sus partes: la tibiocalcánea, la tibionavicular y la tibioastragalina posterior.', MODELO],
      ],
      vista: { ver: ['lig-lateral', 'lig-medial'], contexto: ['tibia', 'fibula', 'talus', 'calcaneo', 'navicular', 'lig-calcaneonavicular', 'retinaculos-extensores'], camara: 'lateral', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['lig-lateral', 'lig-medial'], texto: 'Alterna entre los dos: el lateral se ve por fuera; el deltoideo, por dentro. Gira el modelo para ver cada uno.' },
      comprobar: 'rel-esguince',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['El pie tiene siete huesos del tarso, cinco metatarsianos y catorce falanges, además de los sesamoideos.', T(PIE, 'Tarsals – a set of seven irregularly shaped bones.'), T(PIE, 'There are five in number – one for each digit.'), W('Phalanx_bone', 'There are 56 phalanges in the human body, with fourteen on each hand and foot.')],
        ['Retropié: astrágalo y calcáneo; mediopié: navicular, cuboides y cuneiformes; antepié: metatarsianos y falanges.', T(PIE, '(i) Hindfoot – talus and calcaneus; (ii) Midfoot – navicular, cuboid, and cuneiforms; and (iii) Forefoot – metatarsals and phalanges.')],
        ['El tobillo es una bisagra: el astrágalo encaja en la mortaja de la tibia y la fíbula, y solo permite flexión dorsal y plantar.', T(TOB, 'The body of the talus fits snugly into the mortise formed by the bones of the leg.'), T(TOB, 'Thus, plantarflexion and dorsiflexion are the main movements that occur at the ankle joint.')],
        ['El ligamento deltoideo frena la eversión; el lateral, más débil, frena la inversión y es el que más se lesiona.', T(TOB, 'The primary action of the medial ligament is to resist over-eversion of the foot.'), T(TOB, 'The lateral ligament is weaker than the medial ligament.')],
      ],
    },
  ],
  preguntas: [
    { id: 'id-talus', tipo: 'identificar', estructura: 'talus', objetivo: 0, paso: 'retropie' },
    { id: 'id-calcaneo', tipo: 'identificar', estructura: 'calcaneo', objetivo: 0, paso: 'retropie' },
    { id: 'id-navicular', tipo: 'identificar', estructura: 'navicular', objetivo: 0, paso: 'mediopie' },
    { id: 'id-cuboides', tipo: 'identificar', estructura: 'cuboides', objetivo: 0, paso: 'mediopie' },
    { id: 'id-cuneiforme-medial', tipo: 'identificar', estructura: 'cuneiforme-medial', objetivo: 0, paso: 'mediopie' },
    { id: 'loc-calcaneo', tipo: 'localizar', estructura: 'calcaneo', candidatas: ['talus', 'cuboides'], objetivo: 0, paso: 'retropie' },
    {
      id: 'rel-retropie', tipo: 'relacion', objetivo: 0, paso: 'orientacion', estructuras: ['talus', 'calcaneo'],
      enunciado: '¿Qué huesos forman el retropié?',
      correcta: 'El astrágalo y el calcáneo',
      distractores: ['El navicular y el cuboides', 'Los tres cuneiformes', 'Los metatarsianos'],
      explicacion: 'Retropié: astrágalo y calcáneo; mediopié: navicular, cuboides y cuneiformes; antepié: metatarsianos y falanges.',
      evidencia: [T(PIE, '(i) Hindfoot – talus and calcaneus')],
    },
    {
      id: 'rel-aquiles', tipo: 'relacion', objetivo: 0, paso: 'retropie', estructuras: ['calcaneo'],
      enunciado: '¿En qué hueso se inserta el tendón de Aquiles?',
      correcta: 'En el calcáneo',
      distractores: ['En el astrágalo', 'En el navicular', 'En el cuboides'],
      explicacion: 'El tendón de Aquiles se inserta en la tuberosidad del calcáneo, en la parte posterior del talón.',
      evidencia: [T(PIE, 'The posterior aspect of the calcaneus is marked by calcaneal tuberosity, to which the Achilles tendon attaches.')],
    },
    {
      id: 'rel-navicular', tipo: 'relacion', objetivo: 0, paso: 'mediopie', estructuras: ['navicular'],
      enunciado: '¿Con qué se articula el navicular por delante?',
      correcta: 'Con los tres cuneiformes',
      distractores: ['Con el calcáneo', 'Con los metatarsianos', 'Con la tibia'],
      explicacion: 'El navicular se articula detrás con el astrágalo, delante con los tres cuneiformes y por fuera con el cuboides.',
      evidencia: [T(PIE, 'it articulates with the talus posteriorly, all three cuneiform bones anteriorly, and the cuboid bone laterally.')],
    },
    {
      id: 'seq-pie', tipo: 'secuencia', objetivo: 0, paso: 'mediopie', estructuras: ['talus', 'navicular', 'cuneiforme-medial', 'metatarsianos'],
      enunciado: 'Ordena de atrás adelante los huesos del borde medial del pie:',
      orden: ['Astrágalo', 'Navicular', 'Cuneiforme medial', 'Primer metatarsiano', 'Falange proximal del dedo gordo'],
      explicacion: 'El astrágalo se articula delante con el navicular; este, con los cuneiformes, que se articulan con los metatarsianos; el metatarsiano, con la falange proximal.',
      evidencia: [T(PIE, 'Anteriorly – talonavicular joint – between the talus and the navicular.'), T(PIE, 'They articulate with the navicular posteriorly, and the metatarsals anteriorly.'), T(PIE, 'Distally – metatarsophalangeal joint – between the metatarsal head and the proximal phalanx.')],
    },
    { id: 'id-metatarsianos', tipo: 'identificar', estructura: 'metatarsianos', objetivo: 1, paso: 'antepie' },
    { id: 'id-sesamoideos', tipo: 'identificar', estructura: 'sesamoideos', objetivo: 1, paso: 'antepie' },
    { id: 'id-falanges-distales', tipo: 'identificar', estructura: 'falanges-distales', objetivo: 1, paso: 'antepie' },
    {
      id: 'rel-dedo-gordo', tipo: 'relacion', objetivo: 1, paso: 'antepie', estructuras: ['falanges-proximales', 'falanges-distales'],
      enunciado: '¿Cuántas falanges tiene el dedo gordo del pie?',
      correcta: 'Dos',
      distractores: ['Tres', 'Una', 'Cuatro'],
      explicacion: 'Los demás dedos tienen tres (proximal, media y distal); el dedo gordo, solo proximal y distal.',
      evidencia: [T(PIE, 'Each toe has three phalanges – proximal, intermediate, and distal (except the big toe, which only has two phalanges).')],
    },
    {
      id: 'rel-numeracion', tipo: 'relacion', objetivo: 1, paso: 'antepie', estructuras: ['metatarsianos'],
      enunciado: '¿Cómo se numeran los metatarsianos?',
      correcta: 'Del I al V, de medial a lateral',
      distractores: ['Del I al V, de lateral a medial', 'Del I al V, de proximal a distal', 'Del I al V, de plantar a dorsal'],
      explicacion: 'El I es el del dedo gordo, en el borde medial; el V, el del dedo pequeño, en el lateral.',
      evidencia: [T(PIE, 'They are numbered I-V (medial to lateral).')],
    },
    {
      id: 'rel-tobillo-huesos', tipo: 'relacion', objetivo: 2, paso: 'tobillo', estructuras: ['talus', 'tibia', 'fibula'],
      enunciado: '¿Qué huesos forman la articulación del tobillo?',
      correcta: 'La tibia, la fíbula y el astrágalo',
      distractores: ['La tibia, la fíbula y el calcáneo', 'El astrágalo y el calcáneo', 'La tibia, el astrágalo y el navicular'],
      explicacion: 'La tibia y la fíbula forman la mortaja y el astrágalo encaja en ella. Astrágalo y calcáneo forman la subastragalina.',
      evidencia: [T(TOB, 'The ankle joint is formed by three bones; the tibia and fibula of the leg, and the talus of the foot:')],
    },
    {
      id: 'rel-movimientos', tipo: 'relacion', objetivo: 2, paso: 'tobillo', estructuras: ['talus'],
      enunciado: '¿Qué movimientos se hacen en la articulación del tobillo?',
      correcta: 'Flexión dorsal y flexión plantar',
      distractores: ['Inversión y eversión', 'Rotación medial y lateral', 'Abducción y aducción'],
      explicacion: 'Es una bisagra que se mueve en un solo plano; la inversión y la eversión ocurren en otras articulaciones, como la subastragalina.',
      evidencia: [T(TOB, 'Thus, plantarflexion and dorsiflexion are the main movements that occur at the ankle joint.'), T(TOB, 'Eversion and inversion are produced at the other joints of the foot, such as the subtalar joint.')],
    },
    {
      id: 'fun-estable', tipo: 'funcion', objetivo: 2, paso: 'tobillo', estructuras: ['talus'],
      enunciado: '¿En qué posición es más estable el tobillo?',
      correcta: 'En flexión dorsal, porque la parte ancha del astrágalo queda encajada en la mortaja',
      distractores: ['En flexión plantar, porque la parte ancha del astrágalo queda encajada en la mortaja', 'En inversión, porque se tensa el ligamento deltoideo', 'Es igual de estable en todas las posiciones'],
      explicacion: 'El astrágalo es más ancho por delante: en flexión dorsal esa parte llena la mortaja; en flexión plantar queda la parte estrecha y el tobillo es menos estable.',
      evidencia: [T(TOB, 'Dorsiflexion – the anterior part of the talus is held in the mortise, and the joint is more stable.')],
    },
    { id: 'id-lig-lateral', tipo: 'identificar', estructura: 'lig-lateral', objetivo: 3, paso: 'ligamentos' },
    { id: 'id-lig-medial', tipo: 'identificar', estructura: 'lig-medial', objetivo: 3, paso: 'ligamentos' },
    {
      id: 'rel-esguince', tipo: 'relacion', objetivo: 3, paso: 'ligamentos', estructuras: ['lig-lateral'],
      enunciado: '¿Qué ligamento corre más riesgo en un esguince de tobillo por inversión?',
      correcta: 'El talofibular anterior, del ligamento lateral',
      distractores: ['El tibiocalcáneo, del ligamento deltoideo', 'El calcaneonavicular plantar', 'El tibionavicular, del ligamento deltoideo'],
      explicacion: 'La inversión forzada tensa el ligamento lateral, más débil; de sus tres partes, la más expuesta es el talofibular anterior.',
      evidencia: [T(TOB, 'The anterior talofibular ligament is the lateral ligament most at risk of irreversible damage.')],
    },
    {
      id: 'comp-ligamentos', tipo: 'comparacion', objetivo: 3, paso: 'ligamentos', estructuras: ['lig-lateral', 'lig-medial'],
      enunciado: '¿Qué diferencia el ligamento lateral del tobillo del ligamento medial (deltoideo)?',
      correcta: 'El lateral sale del maléolo lateral y frena la inversión; el medial sale del maléolo medial y frena la eversión',
      distractores: [
        'El lateral sale del maléolo medial y frena la eversión; el medial, del maléolo lateral y frena la inversión',
        'Los dos frenan la flexión dorsal',
        'El lateral es más fuerte que el medial y por eso se lesiona menos',
      ],
      explicacion: 'Cada uno nace de su maléolo: el lateral (fíbula) frena la inversión y es más débil; el deltoideo (tibia) frena la eversión.',
      evidencia: [T(TOB, 'It resists over-inversion of the foot'), T(TOB, 'The primary action of the medial ligament is to resist over-eversion of the foot.'), T(TOB, 'The lateral ligament is weaker than the medial ligament.')],
    },
  ],
});
