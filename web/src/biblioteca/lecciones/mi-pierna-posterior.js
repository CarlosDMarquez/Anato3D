// Lección «Pierna: compartimento posterior». Formato y evidencias: ../formato.js.
import { leccion, W, T, ES, GUIA } from '../formato.js';

const POS = 'lower-limb/muscles/leg/posterior-compartment';
const TUN = 'lower-limb/areas/tarsal-tunnel';
const TIB = 'lower-limb/nerves/tibial-nerve';
const nucleo = (nombre, piezas, tipo = 'musculo') => ({ nombre, piezas, lado: 'bilateral', papel: 'nucleo', tipo });
const contexto = (nombre, piezas, tipo) => ({ nombre, piezas, lado: 'bilateral', papel: 'contexto', tipo });

const SUPERFICIALES = ['gastrocnemio', 'soleo', 'plantar'];
const PROFUNDOS = ['popliteo', 'flexor-dedos', 'flexor-hallux', 'tibial-posterior'];
const HUESOS = ['femur', 'tibia', 'fibula', 'calcaneo', 'talus'];

export default leccion({
  id: 'mi-pierna-posterior',
  version: 1,
  titulo: 'Pierna: compartimento posterior',
  fuentesTerminologia: [ES('Músculo_gastrocnemio', 'también llamado musculus gastrocnemius y popularmente gemelos')],
  resumen: 'Los siete músculos de la pantorrilla en dos capas: la superficial (gastrocnemio, sóleo y plantar), que forma el tendón calcáneo, y la profunda (poplíteo, flexores largos de los dedos y del dedo gordo, y tibial posterior). Qué hace cada uno, el nervio tibial y la arteria tibial posterior, y el túnel tarsiano.',
  lugares: [['miembro-inferior', 'pierna']],
  sistemas: ['muscular'],
  formato: 'estructuras',
  temas: ['musculos', 'compartimentos', 'movimientos'],
  nivel: 2,
  minutos: 16,
  requisitos: ['mi-huesos', 'mi-muslo-posterior'],
  siguiente: ['mi-pierna-anterior-lateral', 'mi-pie-huesos-tobillo', 'mi-nervios'],
  objetivos: [
    'Distinguir la capa superficial y la profunda del compartimento posterior y nombrar sus músculos.',
    'Describir el tendón calcáneo: qué músculos lo forman y dónde se inserta.',
    'Relacionar cada músculo con su acción en el tobillo, el pie o la rodilla.',
    'Ordenar lo que pasa por el túnel tarsiano, detrás del maléolo medial.',
  ],
  estructuras: {
    gastrocnemio: nucleo('Músculo gastrocnemio (gemelos)', ['Medial_head_of_gastrocnemius', 'Lateral_head_of_gastrocnemius']),
    soleo: nucleo('Músculo sóleo', ['Soleus_muscle']),
    plantar: nucleo('Músculo plantar', ['Plantaris_muscle']),
    'tendon-calcaneo': nucleo('Tendón calcáneo (de Aquiles)', ['Calcaneal_tendon'], 'tendon'),
    popliteo: nucleo('Músculo poplíteo', ['Popliteus_muscle']),
    'flexor-dedos': nucleo('Músculo flexor largo de los dedos', ['Flexor_digitorum_longus']),
    'flexor-hallux': nucleo('Músculo flexor largo del dedo gordo', ['Flexor_hallucis_longus']),
    'tibial-posterior': nucleo('Músculo tibial posterior', ['Tibialis_posterior_muscle']),
    'nervio-tibial': { ...nucleo('Nervio tibial', ['Tibial_nerve'], 'nervio'), confusiones: ['Nervio fibular común', 'Nervio sural', 'Nervio safeno'] },
    'arteria-tibial-posterior': { ...nucleo('Arteria tibial posterior', ['Posterior_tibial_artery'], 'arteria'), confusiones: ['Arteria tibial anterior'] },
    'arteria-fibular': contexto('Arteria fibular', ['Fibular_artery'], 'arteria'),
    'retinaculo-flexores': contexto('Retináculo de los flexores del tobillo', ['Flexor_retinaculum_of_ankle'], 'ligamento'),
    'membrana-interosea': contexto('Membrana interósea de la pierna', ['Interosseous_membrane_of_leg'], 'ligamento'),
    femur: contexto('Fémur', ['Femur'], 'hueso'),
    tibia: contexto('Tibia', ['Tibia'], 'hueso'),
    fibula: contexto('Fíbula', ['Fibula'], 'hueso'),
    calcaneo: contexto('Calcáneo', ['Calcaneus'], 'hueso'),
    talus: contexto('Talus', ['Talus'], 'hueso'),
  },
  pasos: [
    {
      id: 'orientacion', tipo: 'orientacion', titulo: 'La pantorrilla',
      texto: [
        ['El compartimento posterior de la pierna tiene siete músculos en dos capas, superficial y profunda.', T(POS, 'The posterior compartment of the leg contains seven muscles and can be subdivided into superficial and deep compartments.')],
        ['Hacen la flexión plantar y la inversión del pie; los inerva el nervio tibial y su sangre llega sobre todo por la arteria tibial posterior.', T(POS, 'The muscles in this compartment act to plantarflex and invert the foot. They are innervated by the tibial nerve (a branch of the sciatic nerve). Blood supply chiefly from the posterior tibial artery.')],
        ['Mírala por detrás y por dentro.', GUIA],
      ],
      vista: { ver: SUPERFICIALES, contexto: ['tendon-calcaneo', ...HUESOS], camara: 'posterior', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'Recorre la pantorrilla.', vistas: [{ nombre: 'Por detrás', camara: 'posterior' }, { nombre: 'Por dentro', camara: 'medial' }, { nombre: 'Por fuera', camara: 'lateral' }] },
      comprobar: 'fun-compartimento',
    },
    {
      id: 'superficiales', tipo: 'exploracion', titulo: 'Gastrocnemio, sóleo y plantar',
      texto: [
        ['El gastrocnemio es el más superficial: sus dos cabezas salen de los cóndilos del fémur y dan a la pantorrilla su forma; flexiona el tobillo hacia la planta y la rodilla.', T(POS, 'The gastrocnemius is the most superficial of all the muscles in the posterior leg. It has medial and lateral heads and forms the characteristic “calf” shape of the leg.'), T(POS, 'The lateral head originates from the lateral femoral condyle. The medial head originates from the medial femoral condyle.'), T(POS, 'Actions: Plantarflexion at the ankle joint and flexion at the knee joint.')],
        ['El sóleo, plano, está debajo; sale de la tibia y la fíbula y solo hace la flexión plantar.', T(POS, 'The soleus is a flat muscle located underneath the gastrocnemius.'), T(POS, 'Originates from the soleal line of the tibia and proximal fibula.'), T(POS, 'Actions: Plantarflexion of the foot at the ankle joint.')],
        ['El plantar es pequeño y falta en un 10 % de las personas; su tendón baja entre los otros dos.', T(POS, 'The plantaris is a small muscle which is absent in approximately 10% of the population.'), T(POS, 'The fibres condense into a tendon which travels down the leg, between the gastrocnemius and soleus muscles.')],
      ],
      vista: { ver: SUPERFICIALES, contexto: ['tendon-calcaneo', ...HUESOS], camara: 'posterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: SUPERFICIALES, texto: 'Alterna los tres: el gastrocnemio por encima, el sóleo debajo y el delgado plantar entre ellos.' },
      comprobar: 'comp-gastro-soleo',
    },
    {
      id: 'tendon', tipo: 'relaciones', titulo: 'El tendón calcáneo',
      texto: [
        ['Los tres superficiales acaban en el calcáneo a través del tendón calcáneo, el más grueso del cuerpo.', T(POS, 'They all insert onto the calcaneus (heel bone) of the foot, via the calcaneal tendon.'), W('Achilles_tendon', 'is a tendon at the back of the lower leg, and is the thickest in the human body.')],
        ['Dos bolsas reducen el roce: una entre la piel y el tendón, y otra entre el tendón y el calcáneo.', T(POS, 'Subcutaneous calcaneal bursa – lies between the skin and the calcaneal tendon.'), T(POS, 'Deep bursa of the calcaneal tendon – lies between the tendon and the calcaneus.')],
      ],
      detalle: [
        ['Se rompe sobre todo en una flexión plantar brusca: después el pie no hace fuerza hacia la planta contra resistencia.', T(POS, 'The injury is usually sustained during forceful plantarflexion of the foot. The patient will be unable to plantarflex the foot against resistance')],
        ['De pie, el sóleo impide que el cuerpo caiga hacia delante y, al contraerse, empuja la sangre venosa hacia el corazón.', W('Soleus_muscle', 'The soleus plays an important role in maintaining standing posture; if not for its constant pull, the body would fall forward.'), W('Soleus_muscle', 'the soleus is responsible for pumping venous blood back into the heart from the periphery each time it contracts')],
      ],
      vista: { ver: ['tendon-calcaneo'], contexto: ['gastrocnemio', 'soleo', 'calcaneo', 'talus', 'tibia', 'fibula'], camara: 'posterolateral', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'tendon-calcaneo', texto: 'Toca el tendón que llega al talón.' },
      comprobar: 'rel-tendon',
    },
    {
      id: 'profundos', tipo: 'exploracion', titulo: 'La capa profunda',
      texto: [
        ['La capa profunda tiene cuatro músculos: el poplíteo, que solo actúa sobre la rodilla, y tres que mueven el tobillo y el pie.', T(POS, 'There are four muscles in the deep compartment of the posterior leg. One muscle, the popliteus, acts only on the knee joint. The remaining three muscles (tibialis posterior, flexor hallucis longus and flexor digitorum longus) act on the ankle and foot.')],
        ['El poplíteo rota el fémur sobre la tibia y «desbloquea» la rodilla para que pueda flexionarse.', T(POS, 'Actions: Lateral rotation of the femur relative to the tibia.'), T(POS, 'unlocks’ the knee joint so that flexion can occur.')],
        ['El flexor largo de los dedos va por dentro; el del dedo gordo, curiosamente, por fuera; el tibial posterior, el más profundo, queda entre los dos.', T(POS, 'The flexor digitorum longus is a thin muscle and is located medially within the posterior leg.'), T(POS, 'The flexor hallucis longus muscle is located laterally within the posterior compartment (this is slightly counter-intuitive, as it is the opposite side to the great toe).'), T(POS, 'The tibialis posterior is the deepest out of the four muscles. It lies between the flexor digitorum longus and the flexor hallucis longus.')],
      ],
      vista: { ver: PROFUNDOS, contexto: ['membrana-interosea', ...HUESOS], fantasma: ['soleo'], camara: 'posterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['flexor-dedos', 'tibial-posterior', 'flexor-hallux'], texto: 'Alterna de dentro afuera: flexor largo de los dedos, tibial posterior y flexor largo del dedo gordo.' },
      comprobar: 'rel-hallux-lateral',
    },
    {
      id: 'acciones', tipo: 'funcion', titulo: 'Qué hace cada uno',
      texto: [
        ['El flexor largo de los dedos flexiona los cuatro dedos laterales, y el del dedo gordo, el dedo gordo.', T(POS, 'Actions: Flexion of the lateral four toes.'), T(POS, 'Actions: Flexion of the great toe.')],
        ['El tibial posterior entra en el pie por detrás del maléolo medial, hace la inversión y la flexión plantar y ayuda a sostener el arco medial.', T(POS, 'The tendon enters the foot posterior to the medial malleolus and attaches to the plantar surfaces of the medial tarsal bones.'), T(POS, 'Actions: Inversion and plantarflexion of the foot. It also contributes to the medial arch of the foot.')],
        ['El gastrocnemio y el plantar cruzan también la rodilla y ayudan a flexionarla; el sóleo no.', T(POS, 'Actions: Plantarflexion at the ankle joint and flexion at the knee joint.'), T(POS, 'Contributes to plantarflexion at the ankle joint and flexion at the knee joint.'), T(POS, 'Actions: Plantarflexion of the foot at the ankle joint.')],
      ],
      vista: { ver: ['tibial-posterior', 'flexor-dedos', 'flexor-hallux'], contexto: ['calcaneo', 'talus', 'tibia', 'fibula'], camara: 'medial', lado: 'R' },
      comprobar: 'fun-tibial-posterior',
    },
    {
      id: 'tunel', tipo: 'relaciones', titulo: 'El túnel tarsiano',
      texto: [
        ['El nervio tibial y la arteria tibial posterior pasan con los tendones profundos por detrás y por debajo del maléolo medial, por el túnel tarsiano.', T(TIB, 'At the foot, the nerve passes posteriorly and inferiorly to the medial malleolus, through a structure known as the tarsal tunnel.')],
        ['El techo del túnel es el retináculo de los flexores, del maléolo medial al calcáneo.', T(TUN, 'The roof of the tarsal tunnel is formed by a flexor retinaculum extending from the medial malleolus to the medial tubercle of the calcaneus.')],
        ['De delante atrás pasan: tibial posterior, flexor largo de los dedos, arteria y vena tibiales posteriores, nervio tibial y flexor largo del dedo gordo.', T(TUN, 'Its contents (anterior to posterior) are: Tibialis posterior tendon Flexor digitorum longus tendon Posterior tibial artery and vein Tibial nerve Flexor hallucis longus tendon')],
      ],
      detalle: [
        ['El síndrome del túnel tarsiano es la compresión del nervio tibial dentro del túnel.', T(TIB, 'Tarsal tunnel syndrome refers to entrapment and compression of the tibial nerve as it passes through the tarsal tunnel.')],
      ],
      vista: { ver: ['nervio-tibial', 'arteria-tibial-posterior', 'tibial-posterior', 'flexor-dedos', 'flexor-hallux'], contexto: ['retinaculo-flexores', 'arteria-fibular', 'calcaneo', 'talus', 'tibia'], camara: 'medial', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'nervio-tibial', texto: 'Toca el nervio que pasa por detrás del maléolo medial.' },
      comprobar: 'rel-tunel-techo',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['Capa superficial: gastrocnemio, sóleo y plantar, que acaban en el calcáneo por el tendón calcáneo.', T(POS, 'They all insert onto the calcaneus (heel bone) of the foot, via the calcaneal tendon.')],
        ['Capa profunda: el poplíteo, para la rodilla, y el tibial posterior y los dos flexores largos, para el tobillo y el pie.', T(POS, 'One muscle, the popliteus, acts only on the knee joint.')],
        ['Todos los inerva el nervio tibial; el compartimento hace la flexión plantar y la inversión.', T(POS, 'The muscles in this compartment act to plantarflex and invert the foot. They are innervated by the tibial nerve')],
      ],
    },
  ],
  preguntas: [
    {
      id: 'fun-compartimento', tipo: 'funcion', objetivo: 2, paso: 'orientacion', estructuras: SUPERFICIALES,
      enunciado: '¿Qué movimientos del pie hace el compartimento posterior de la pierna?',
      correcta: 'La flexión plantar y la inversión',
      distractores: ['La flexión dorsal y la eversión', 'Solo la eversión', 'La flexión dorsal y la inversión'],
      explicacion: 'El compartimento posterior baja la punta del pie y la gira hacia dentro; el anterior hace la flexión dorsal y el lateral, la eversión.',
      evidencia: [T(POS, 'The muscles in this compartment act to plantarflex and invert the foot.')],
    },
    { id: 'id-gastrocnemio', tipo: 'identificar', estructura: 'gastrocnemio', objetivo: 0, paso: 'superficiales' },
    { id: 'id-soleo', tipo: 'identificar', estructura: 'soleo', objetivo: 0, paso: 'superficiales' },
    { id: 'id-tibial-posterior', tipo: 'identificar', estructura: 'tibial-posterior', objetivo: 0, paso: 'profundos' },
    { id: 'id-flexor-hallux', tipo: 'identificar', estructura: 'flexor-hallux', objetivo: 0, paso: 'profundos' },
    {
      id: 'comp-gastro-soleo', tipo: 'comparacion', objetivo: 2, paso: 'superficiales', estructuras: ['gastrocnemio', 'soleo'],
      enunciado: '¿En qué se diferencian el gastrocnemio y el sóleo?',
      correcta: 'El gastrocnemio también flexiona la rodilla; el sóleo solo actúa en el tobillo',
      distractores: ['El sóleo flexiona la rodilla; el gastrocnemio no', 'El gastrocnemio hace la flexión dorsal', 'El sóleo se inserta en la tibia, no en el calcáneo'],
      explicacion: 'Las cabezas del gastrocnemio salen del fémur y cruzan la rodilla; el sóleo sale de la tibia y la fíbula.',
      evidencia: [T(POS, 'Actions: Plantarflexion at the ankle joint and flexion at the knee joint.'), T(POS, 'Actions: Plantarflexion of the foot at the ankle joint.')],
    },
    {
      id: 'rel-tendon', tipo: 'relacion', objetivo: 1, paso: 'tendon', estructuras: ['tendon-calcaneo'],
      enunciado: '¿Dónde se inserta el tendón calcáneo?',
      correcta: 'En el calcáneo, el hueso del talón',
      distractores: ['En el talus', 'En la base del primer metatarsiano', 'En el maléolo medial'],
      explicacion: 'Une el gastrocnemio, el sóleo y el plantar al calcáneo.',
      evidencia: [T(POS, 'They all insert onto the calcaneus (heel bone) of the foot, via the calcaneal tendon.')],
    },
    {
      id: 'rel-tendon-musculos', tipo: 'relacion', objetivo: 1, paso: 'tendon', estructuras: ['tendon-calcaneo', 'gastrocnemio', 'soleo'],
      enunciado: '¿Qué músculos forman el tendón calcáneo?',
      correcta: 'El gastrocnemio, el sóleo y el plantar',
      distractores: ['El tibial posterior y los flexores largos', 'El tibial anterior y los extensores', 'Los fibulares largo y corto'],
      explicacion: 'Son los tres de la capa superficial; los profundos pasan por detrás del maléolo medial.',
      evidencia: [W('Achilles_tendon', 'It serves to attach the plantaris, gastrocnemius (calf) and soleus muscles to the calcaneus (heel) bone.')],
    },
    { id: 'loc-tendon', tipo: 'localizar', estructura: 'tendon-calcaneo', candidatas: ['soleo', 'tibial-posterior'], objetivo: 1, paso: 'tendon' },
    {
      id: 'rel-hallux-lateral', tipo: 'relacion', objetivo: 0, paso: 'profundos', estructuras: ['flexor-hallux', 'flexor-dedos'],
      enunciado: '¿Dónde está el flexor largo del dedo gordo dentro del compartimento posterior?',
      correcta: 'Por fuera, en el lado de la fíbula',
      distractores: ['Por dentro, en el lado de la tibia', 'Por encima del gastrocnemio', 'En el compartimento anterior'],
      explicacion: 'Aunque mueve el dedo gordo, está en el lado lateral; el flexor largo de los dedos va por dentro.',
      evidencia: [T(POS, 'The flexor hallucis longus muscle is located laterally within the posterior compartment')],
    },
    {
      id: 'fun-popliteo', tipo: 'funcion', objetivo: 2, paso: 'profundos', estructuras: ['popliteo'],
      enunciado: '¿Qué hace el músculo poplíteo?',
      correcta: 'Desbloquea la rodilla para que pueda flexionarse',
      distractores: ['Hace la flexión plantar del tobillo', 'Flexiona el dedo gordo', 'Hace la inversión del pie'],
      explicacion: 'Rota el fémur sobre la tibia; es el único de la capa profunda que actúa solo sobre la rodilla.',
      evidencia: [T(POS, 'Actions: Lateral rotation of the femur relative to the tibia.'), T(POS, 'One muscle, the popliteus, acts only on the knee joint.')],
    },
    {
      id: 'fun-tibial-posterior', tipo: 'funcion', objetivo: 2, paso: 'acciones', estructuras: ['tibial-posterior'],
      enunciado: '¿Qué hace el tibial posterior?',
      correcta: 'Inversión y flexión plantar, y sostiene el arco medial',
      distractores: ['Flexión dorsal y eversión', 'Flexión de los cuatro dedos laterales', 'Solo flexiona la rodilla'],
      explicacion: 'Su tendón pasa por detrás del maléolo medial hasta los huesos mediales del tarso.',
      evidencia: [T(POS, 'Actions: Inversion and plantarflexion of the foot. It also contributes to the medial arch of the foot.')],
    },
    { id: 'id-nervio-tibial', tipo: 'identificar', estructura: 'nervio-tibial', objetivo: 3, paso: 'tunel' },
    {
      id: 'rel-tunel-techo', tipo: 'relacion', objetivo: 3, paso: 'tunel', estructuras: ['retinaculo-flexores'],
      enunciado: '¿Qué forma el techo del túnel tarsiano?',
      correcta: 'El retináculo de los flexores',
      distractores: ['El tendón calcáneo', 'La membrana interósea', 'El retináculo de los extensores'],
      explicacion: 'Va del maléolo medial al tubérculo medial del calcáneo y cierra el túnel por fuera.',
      evidencia: [T(TUN, 'The roof of the tarsal tunnel is formed by a flexor retinaculum extending from the medial malleolus to the medial tubercle of the calcaneus.')],
    },
    {
      id: 'sec-tunel', tipo: 'secuencia', objetivo: 3, paso: 'tunel',
      enunciado: 'Ordena el contenido del túnel tarsiano de delante atrás.',
      orden: ['Tendón del tibial posterior', 'Tendón del flexor largo de los dedos', 'Arteria y vena tibiales posteriores', 'Nervio tibial', 'Tendón del flexor largo del dedo gordo'],
      explicacion: 'De delante atrás: tibial posterior, flexor de los dedos, vasos tibiales posteriores, nervio tibial y flexor del dedo gordo.',
      evidencia: [T(TUN, 'Its contents (anterior to posterior) are: Tibialis posterior tendon Flexor digitorum longus tendon Posterior tibial artery and vein Tibial nerve Flexor hallucis longus tendon')],
    },
  ],
});
