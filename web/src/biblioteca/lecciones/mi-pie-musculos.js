// Lección «Músculos del pie». Formato y evidencias: ../formato.js.
import { leccion, T, GUIA, MODELO } from '../formato.js';

const PIE = 'lower-limb/muscles/foot';
const musculo = (nombre, piezas, extra = {}) => ({ nombre, piezas, lado: 'bilateral', papel: 'nucleo', tipo: 'musculo', ...extra });
const contexto = (nombre, piezas, tipo) => ({ nombre, piezas, lado: 'bilateral', papel: 'contexto', tipo });
const serie = (base, desde, hasta) => Array.from({ length: hasta - desde + 1 }, (_, i) => `${base}_${desde + i}`);

const DORSO = ['extensor-corto-dedos', 'extensor-corto-halux'];
const CAPA1 = ['abductor-halux', 'flexor-corto-dedos', 'abductor-minimo-pie'];
const CAPA2 = ['cuadrado-plantar', 'lumbricales-pie'];
const CAPA3 = ['flexor-corto-halux', 'aductor-halux', 'flexor-minimo-pie'];
const CAPA4 = ['interoseos-plantares', 'interoseos-dorsales-pie'];

export default leccion({
  id: 'mi-pie-musculos',
  version: 1,
  titulo: 'Músculos del pie',
  resumen: 'Los músculos propios del pie: los dos del dorso, con el nervio fibular profundo, y los diez de la planta en sus cuatro capas, con lo que hace cada uno sobre los dedos y los arcos y qué nervio plantar lo mueve.',
  lugares: [['miembro-inferior', 'pie']],
  sistemas: ['muscular'],
  formato: 'estructuras',
  temas: ['musculos', 'movimientos', 'nervios'],
  nivel: 2,
  minutos: 18,
  requisitos: ['mi-pie-huesos-tobillo', 'mi-pierna-posterior'],
  siguiente: ['mi-nervios', 'mi-vasos', 'comp-miembro-inferior'],
  objetivos: [
    'Distinguir los músculos extrínsecos e intrínsecos del pie y decir qué hace cada grupo.',
    'Situar los dos músculos del dorso del pie y decir qué nervio los inerva.',
    'Ordenar las cuatro capas de la planta y nombrar sus músculos.',
    'Explicar la acción de los músculos plantares sobre los dedos y los arcos del pie.',
    'Asociar los músculos de la planta con los nervios plantares medial y lateral.',
  ],
  estructuras: {
    'extensor-corto-dedos': musculo('Extensor corto de los dedos', ['Extensor_digitorum_brevis']),
    'extensor-corto-halux': musculo('Extensor corto del dedo gordo', ['Extensor_hallucis_brevis']),
    'abductor-halux': musculo('Abductor del dedo gordo', ['Abductor_hallucis']),
    'flexor-corto-dedos': musculo('Flexor corto de los dedos', ['Flexor_digitorum_brevis']),
    'abductor-minimo-pie': musculo('Abductor del dedo pequeño del pie', ['Abductor_digiti_minimi_of_foot'], { confusiones: ['Abductor del dedo mínimo de la mano'] }),
    'cuadrado-plantar': musculo('Cuadrado plantar', ['Quadratus_plantae_muscle']),
    'lumbricales-pie': musculo('Lumbricales del pie', ['Lumbrical_muscles_of_foot']),
    'flexor-corto-halux': musculo('Flexor corto del dedo gordo', ['Medial_head_of_flexor_hallucis_brevis', 'Lateral_head_of_flexor_hallucis_brevis']),
    'aductor-halux': musculo('Aductor del dedo gordo', ['Oblique_head_of_adductor_hallucis', 'Transverse_head_of_adductor_hallucis']),
    'flexor-minimo-pie': musculo('Flexor corto del dedo pequeño del pie', ['Flexor_digiti_minimi_of_foot']),
    'interoseos-plantares': musculo('Interóseos plantares', ['Plantar_interossei_muscles']),
    'interoseos-dorsales-pie': musculo('Interóseos dorsales del pie', ['Dorsal_interossei_muscles_of_foot']),
    'huesos-pie': contexto('Huesos del pie', ['Calcaneus', 'Talus', 'Navicular', 'Cuboid', 'Medial_Cuneiform', 'Intermediate_Cuneiform', 'Lateral_Cuneiform', ...serie('Metatarsal', 1, 5), ...serie('Proximal_Phalanx_Foot', 1, 5), ...serie('Middle_Phalanx_Foot', 2, 5), ...serie('Distal_Phalanx_Foot', 1, 5)], 'hueso'),
    'aponeurosis-plantar': contexto('Aponeurosis plantar', ['Plantar_aponeurosis'], 'fascia'),
    'retinaculo-extensor': contexto('Retináculo inferior de los extensores', ['Inferior_extensor_retinaculum_of_ankle'], 'ligamento'),
    'fibular-profundo': contexto('Nervio fibular profundo', ['Deep_fibular_nerve'], 'nervio'),
    'plantar-medial': contexto('Nervio plantar medial', ['Medial_plantar_nerve'], 'nervio'),
    'plantar-lateral': contexto('Nervio plantar lateral', ['Lateral_plantar_nerve'], 'nervio'),
    'flexor-largo-dedos': contexto('Flexor largo de los dedos', ['Flexor_digitorum_longus'], 'musculo'),
  },
  pasos: [
    {
      id: 'orientacion', tipo: 'orientacion', titulo: 'Los músculos propios del pie',
      texto: [
        ['Los músculos extrínsecos vienen de los compartimentos de la pierna y hacen sobre todo la eversión, la inversión y las flexiones plantar y dorsal del pie; los intrínsecos, dentro del pie, los movimientos finos, como mover cada dedo.', T(PIE, 'Extrinsic muscles arise from the anterior, posterior and lateral compartments of the leg. They are mainly responsible for actions such as eversion, inversion, plantarflexion and dorsiflexion of the foot.'), T(PIE, 'Intrinsic muscles are located within the foot and are responsible for the fine motor actions of the foot, for example movement of individual digits.')],
        ['Hay dos intrínsecos en el dorso y diez en la planta, dispuestos en cuatro capas.', T(PIE, 'There are two intrinsic muscles located within the dorsum of the foot'), T(PIE, 'There are ten intrinsic muscles located in the plantar aspect (sole) of the foot.'), T(PIE, 'The muscles of the plantar aspect are arranged in four layers (superficial to deep):')],
        ['Mira el pie derecho por la planta y por el dorso.', GUIA],
      ],
      vista: { ver: [...DORSO, ...CAPA1, ...CAPA2, ...CAPA3, ...CAPA4], contexto: ['huesos-pie'], camara: 'inferior', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'Recorre el pie por todos lados.', vistas: [{ nombre: 'Planta', camara: 'inferior' }, { nombre: 'Dorso', camara: 'superior' }, { nombre: 'Lado medial', camara: 'medial' }] },
      comprobar: 'comp-extrinsecos-pie',
    },
    {
      id: 'dorso', tipo: 'exploracion', titulo: 'El dorso del pie',
      texto: [
        ['En el dorso están el extensor corto de los dedos y el extensor corto del dedo gordo: ayudan a los extensores largos a extender los dedos y los inerva el nervio fibular profundo.', T(PIE, 'There are two intrinsic muscles located within the dorsum of the foot – the extensor digitorum brevis and extensor hallucis brevis.'), T(PIE, 'They assist the extrinsic muscles of the foot in extending the toes and are both innervated by the deep fibular nerve.')],
        ['Los dos nacen del calcáneo y del retináculo inferior de los extensores; el de los dedos acaba en los tendones extensores largos de los dedos 2.º a 4.º, y el del dedo gordo, en su falange proximal.', T(PIE, 'Originates from the calcaneus and inferior extensor retinaculum. It attaches onto the long extensor tendons of toes 2-4.'), T(PIE, 'It attaches to the base of the proximal phalanx of the great toe.')],
        ['El extensor corto del dedo gordo se considera a menudo la parte medial del de los dedos, más que un músculo aparte.', T(PIE, 'The extensor hallucis brevis is often considered to be the medial part of the extensor digitorum brevis muscle, rather than a separate structure.')],
      ],
      vista: { ver: DORSO, contexto: ['huesos-pie', 'retinaculo-extensor', 'fibular-profundo'], camara: 'superior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: DORSO, texto: 'Alterna los dos músculos del dorso: el del dedo gordo es la parte medial.' },
      comprobar: 'rel-fibular-profundo',
    },
    {
      id: 'capa1', tipo: 'exploracion', titulo: 'La primera capa de la planta',
      texto: [
        ['La primera capa, la más superficial, queda justo debajo de la aponeurosis plantar y tiene tres músculos.', T(PIE, 'The first layer contains three muscles. It is the most superficial and is located immediately underneath the plantar fascia.')],
        ['El abductor del dedo gordo, en el lado medial, separa y flexiona el dedo gordo; el flexor corto de los dedos, en el centro, flexiona los cuatro laterales; el abductor del dedo pequeño, en el lado lateral, separa y flexiona el quinto.', T(PIE, 'The abductor hallucis muscle is located on the medial side of the sole'), T(PIE, 'Actions: Abduction and flexion of the great toe.'), T(PIE, 'It sits in the centre of the sole'), T(PIE, 'Actions: Flexion of the lateral four toes at the proximal interphalangeal joints.'), T(PIE, 'The abductor digiti minimi muscle is located on the lateral side of the foot.'), T(PIE, 'Actions: Abduction and flexion of the little toe.')],
        ['Los dos primeros los inerva el nervio plantar medial, y el abductor del dedo pequeño, el lateral.', T(PIE, 'Innervation: Medial plantar nerve.'), T(PIE, 'Actions: Abduction and flexion of the little toe. Innervation: Lateral plantar nerve.')],
      ],
      detalle: [
        ['El nervio plantar medial puede quedar comprimido al pasar bajo el abductor del dedo gordo y dar dolor, adormecimiento y hormigueo en el lado medial de la planta.', T(PIE, 'The medial plantar nerve can become compressed and irritated as it passes deep to the abductor hallucis muscle.'), T(PIE, 'This can cause aching, numbness and paraesthesia on the medial side of the sole of the foot.')],
        ['El abductor del dedo pequeño es el equivalente del abductor del meñique de la mano.', T(PIE, 'It is homologous with the abductor digiti minimi of the hand.')],
      ],
      vista: { ver: CAPA1, contexto: ['huesos-pie', 'plantar-medial', 'plantar-lateral'], fantasma: ['aponeurosis-plantar'], camara: 'inferior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: CAPA1, texto: 'Alterna los tres músculos de la primera capa, de medial a lateral.' },
      comprobar: 'comp-capa1',
    },
    {
      id: 'capas-media', tipo: 'exploracion', titulo: 'La segunda y la tercera capas',
      texto: [
        ['La segunda capa tiene el cuadrado plantar, que se inserta en los tendones del flexor largo de los dedos y lo ayuda a flexionar los cuatro dedos laterales, y cuatro lumbricales que nacen de esos tendones.', T(PIE, 'The second plantar layer contains two muscles – the quadratus plantae and the lumbricals.'), T(PIE, 'It attaches to the tendons of flexor digitorum longus.'), T(PIE, 'Actions: Assists the flexor digitorum longus in flexion of the lateral four toes.'), T(PIE, 'There are four lumbrical muscles in the foot.'), T(PIE, 'Originates from the tendons of flexor digitorum longus.')],
        ['Como en la mano, los lumbricales flexionan la metatarsofalángica y extienden las interfalángicas.', T(PIE, 'Actions: Flexion at the metatarsophalangeal joints and extension at the interphalangeal joints.')],
        ['En la tercera, el flexor corto y el aductor mueven el dedo gordo, y el flexor corto del dedo pequeño, el quinto; el aductor, además, sostiene el arco transverso del pie.', T(PIE, 'The flexor hallucis brevis and adductor hallucis are associated with movements of the great toe. The remaining muscle, the flexor digiti minimi brevis, moves the little toe.'), T(PIE, 'Actions: Adduction of the great toe. Supports the transverse arch of the foot.')],
      ],
      detalle: [
        ['Los tendones del flexor largo de los dedos, un músculo de la pierna, pasan por la segunda capa.', T(PIE, 'The tendons of the flexor digitorum longus (an extrinsic muscle) also travel through this layer.')],
        ['El aductor del dedo gordo tiene una cabeza oblicua, de las bases de los metatarsianos 2.º a 4.º, y otra transversa, de los ligamentos plantares de las metatarsofalángicas.', T(PIE, 'It consists of an oblique and transverse head.'), T(PIE, 'Oblique head – originates from the bases of the 2nd, 3rd, and 4th metatarsals.'), T(PIE, 'Transverse head – originates from the plantar ligaments of the metatarsophalangeal joints.')],
      ],
      vista: { ver: [...CAPA2, ...CAPA3], contexto: ['huesos-pie'], fantasma: [...CAPA1, 'flexor-largo-dedos'], camara: 'inferior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: [...CAPA2, ...CAPA3], texto: 'Alterna los músculos de la segunda y la tercera capas.' },
      comprobar: 'fun-cuadrado-plantar',
    },
    {
      id: 'capa4', tipo: 'relaciones', titulo: 'La cuarta capa y los nervios plantares',
      texto: [
        ['La cuarta capa, la más profunda, son los interóseos, entre los metatarsianos: los tres plantares juntan los dedos 3.º a 5.º y los cuatro dorsales separan los cuatro laterales; además, flexionan las metatarsofalángicas.', T(PIE, 'The plantar and dorsal interossei comprise the fourth and final plantar muscle layer.'), T(PIE, 'There are three plantar interossei, which are located between the metatarsals.'), T(PIE, 'Actions: Adduction of the lateral three digits and flexion at the metatarsophalangeal joints.'), T(PIE, 'There are four dorsal interossei, which are located between the metatarsals.'), T(PIE, 'Actions: Abduction of the lateral four digits and flexion at the metatarsophalangeal joints.')],
        ['Juntos, los diez músculos de la planta estabilizan los arcos del pie; cada uno, por separado, mueve los dedos.', T(PIE, 'They act collectively to stabilise the arches of the foot and individually to control movement of the digits.')],
        ['Los inervan los nervios plantares, ramas del tibial: el medial, el abductor y el flexor corto del dedo gordo, el flexor corto de los dedos y el primer lumbrical; el lateral, todos los demás.', T(PIE, 'They are innervated by the medial or lateral plantar nerves – which are branches of the tibial nerve.'), T(PIE, 'Medial lumbrical – medial plantar nerve.'), T(PIE, 'Actions: Flexion of the great toe at the metatarsophalangeal joint. Innervation: Medial plantar nerve.'), T(PIE, 'Lateral three lumbricals – lateral plantar nerve'), T(PIE, 'Innervation: Deep branch of lateral plantar nerve.'), T(PIE, 'Innervation: Superficial branch of lateral plantar nerve.')],
      ],
      detalle: [
        ['Los interóseos plantares son unipenniformes y nacen cada uno de un metatarsiano; los dorsales son bipenniformes y nacen de dos.', T(PIE, 'The plantar interossei have a unipennate shape, while the dorsal interossei are bipennate.'), T(PIE, 'Each arises from a single metatarsal.'), T(PIE, 'Each arises from two metatarsals.')],
        ['El modelo no separa las ramas profunda y superficial del nervio plantar lateral.', MODELO],
      ],
      vista: { ver: CAPA4, contexto: ['huesos-pie', 'plantar-medial', 'plantar-lateral'], camara: 'inferior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: CAPA4, texto: 'Alterna los interóseos plantares y dorsales.' },
      comprobar: 'comp-interoseos-pie',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['Dorso: extensor corto de los dedos y del dedo gordo, del nervio fibular profundo.', T(PIE, 'are both innervated by the deep fibular nerve.')],
        ['Planta, de la superficie a la profundidad: abductor del dedo gordo, flexor corto de los dedos y abductor del dedo pequeño; cuadrado plantar y lumbricales; flexor corto y aductor del dedo gordo y flexor corto del dedo pequeño; interóseos.', T(PIE, 'The first layer contains three muscles.'), T(PIE, 'The second plantar layer contains two muscles – the quadratus plantae and the lumbricals.'), T(PIE, 'The third layer contains three muscles.'), T(PIE, 'The plantar and dorsal interossei comprise the fourth and final plantar muscle layer.')],
        ['Todos los de la planta dependen de los nervios plantares, ramas del tibial, y juntos sostienen los arcos.', T(PIE, 'They are innervated by the medial or lateral plantar nerves – which are branches of the tibial nerve.'), T(PIE, 'They act collectively to stabilise the arches of the foot')],
      ],
    },
  ],
  preguntas: [
    {
      id: 'comp-extrinsecos-pie', tipo: 'comparacion', objetivo: 0, paso: 'orientacion', estructuras: [...DORSO, ...CAPA1],
      enunciado: '¿Qué diferencia a los músculos intrínsecos del pie de los extrínsecos?',
      correcta: 'Los intrínsecos están en el pie y hacen los movimientos finos, como mover cada dedo; los extrínsecos vienen de la pierna',
      distractores: ['Los intrínsecos están en la pierna y hacen la flexión dorsal', 'Los intrínsecos solo están en el dorso del pie', 'Los extrínsecos son los de la primera capa de la planta'],
      explicacion: 'Los extrínsecos, de los compartimentos de la pierna, mueven el pie entero; los intrínsecos, en el dorso y en la planta, dan los movimientos finos.',
      evidencia: [T(PIE, 'Intrinsic muscles are located within the foot and are responsible for the fine motor actions of the foot, for example movement of individual digits.')],
    },
    {
      id: 'rel-fibular-profundo', tipo: 'relacion', objetivo: 1, paso: 'dorso', estructuras: DORSO,
      enunciado: '¿Qué nervio inerva los músculos del dorso del pie?',
      correcta: 'El fibular profundo',
      distractores: ['El plantar medial', 'El plantar lateral', 'El fibular superficial'],
      explicacion: 'Los dos extensores cortos son del fibular profundo, el mismo nervio de los extensores largos; los de la planta son de los plantares.',
      evidencia: [T(PIE, 'They assist the extrinsic muscles of the foot in extending the toes and are both innervated by the deep fibular nerve.')],
    },
    { id: 'id-extensor-corto-dedos', tipo: 'identificar', estructura: 'extensor-corto-dedos', objetivo: 1, paso: 'dorso' },
    {
      id: 'comp-capa1', tipo: 'comparacion', objetivo: 2, paso: 'capa1', estructuras: CAPA1,
      enunciado: '¿Qué músculo de la primera capa ocupa el centro de la planta?',
      correcta: 'El flexor corto de los dedos',
      distractores: ['El abductor del dedo gordo', 'El abductor del dedo pequeño del pie', 'El cuadrado plantar'],
      explicacion: 'El abductor del dedo gordo va por el lado medial y el del dedo pequeño, por el lateral; el cuadrado plantar es de la segunda capa.',
      evidencia: [T(PIE, 'It sits in the centre of the sole, sandwiched between the plantar aponeurosis and the tendons of flexor digitorum longus.')],
    },
    { id: 'id-abductor-halux', tipo: 'identificar', estructura: 'abductor-halux', objetivo: 2, paso: 'capa1' },
    { id: 'loc-abductor-minimo-pie', tipo: 'localizar', estructura: 'abductor-minimo-pie', candidatas: ['abductor-halux', 'flexor-corto-dedos'], objetivo: 2, paso: 'capa1' },
    {
      id: 'rel-atrapamiento', tipo: 'relacion', objetivo: 4, paso: 'capa1', estructuras: ['abductor-halux', 'plantar-medial'],
      enunciado: '¿Bajo qué músculo puede quedar comprimido el nervio plantar medial?',
      correcta: 'El abductor del dedo gordo',
      distractores: ['El abductor del dedo pequeño del pie', 'El cuadrado plantar', 'El extensor corto de los dedos'],
      explicacion: 'El nervio pasa por debajo del abductor del dedo gordo; si se comprime, duele y hormiguea el lado medial de la planta.',
      evidencia: [T(PIE, 'The medial plantar nerve can become compressed and irritated as it passes deep to the abductor hallucis muscle.')],
    },
    {
      id: 'sec-capas', tipo: 'secuencia', objetivo: 2, paso: 'capa4',
      enunciado: 'Ordena de la superficie a la profundidad lo que se encuentra en la planta.',
      orden: ['Aponeurosis plantar', 'Flexor corto de los dedos', 'Cuadrado plantar', 'Aductor del dedo gordo', 'Interóseos'],
      explicacion: 'Bajo la aponeurosis, la primera capa (con el flexor corto de los dedos); luego el cuadrado plantar, de la segunda; el aductor del dedo gordo, de la tercera, y los interóseos, la cuarta.',
      evidencia: [T(PIE, 'It is the most superficial and is located immediately underneath the plantar fascia.'), T(PIE, 'The second plantar layer contains two muscles – the quadratus plantae and the lumbricals.'), T(PIE, 'The third layer contains three muscles.'), T(PIE, 'The plantar and dorsal interossei comprise the fourth and final plantar muscle layer.')],
    },
    {
      id: 'fun-cuadrado-plantar', tipo: 'funcion', objetivo: 3, paso: 'capas-media', estructuras: ['cuadrado-plantar', 'flexor-largo-dedos'],
      enunciado: '¿Qué hace el cuadrado plantar?',
      correcta: 'Ayuda al flexor largo de los dedos a flexionar los cuatro dedos laterales',
      distractores: ['Separa el dedo gordo', 'Extiende los dedos', 'Junta los dedos tercero a quinto'],
      explicacion: 'Se inserta en los tendones del flexor largo de los dedos y colabora en su flexión.',
      evidencia: [T(PIE, 'Actions: Assists the flexor digitorum longus in flexion of the lateral four toes.')],
    },
    {
      id: 'fun-aductor-halux', tipo: 'funcion', objetivo: 3, paso: 'capas-media', estructuras: ['aductor-halux'],
      enunciado: 'Además de aducir el dedo gordo, ¿qué hace el aductor del dedo gordo?',
      correcta: 'Sostiene el arco transverso del pie',
      distractores: ['Extiende el dedo gordo', 'Flexiona los cuatro dedos laterales', 'Separa el dedo pequeño'],
      explicacion: 'Sus dos cabezas cruzan la planta por debajo de los metatarsianos y ayudan a mantener el arco transverso.',
      evidencia: [T(PIE, 'Actions: Adduction of the great toe. Supports the transverse arch of the foot.')],
    },
    { id: 'id-cuadrado-plantar', tipo: 'identificar', estructura: 'cuadrado-plantar', objetivo: 2, paso: 'capas-media' },
    {
      id: 'rel-lumbrical-medial', tipo: 'relacion', objetivo: 4, paso: 'capas-media', estructuras: ['lumbricales-pie'],
      enunciado: '¿Qué nervio inerva el lumbrical más medial del pie?',
      correcta: 'El plantar medial',
      distractores: ['El plantar lateral', 'El fibular profundo', 'El sural'],
      explicacion: 'El lumbrical medial es del plantar medial; los tres laterales, del plantar lateral.',
      evidencia: [T(PIE, 'Medial lumbrical – medial plantar nerve.'), T(PIE, 'Lateral three lumbricals – lateral plantar nerve')],
    },
    {
      id: 'comp-interoseos-pie', tipo: 'comparacion', objetivo: 3, paso: 'capa4', estructuras: CAPA4,
      enunciado: '¿Qué diferencia a los interóseos dorsales del pie de los plantares?',
      correcta: 'Los dorsales separan los dedos; los plantares los juntan',
      distractores: ['Los dorsales juntan los dedos; los plantares los separan', 'Los dorsales los inerva el fibular profundo; los plantares, el tibial', 'Los dorsales extienden los dedos; los plantares los flexionan'],
      explicacion: 'Igual que en la mano: dorsales, abducción; plantares, aducción. Todos los inerva el plantar lateral y flexionan las metatarsofalángicas.',
      evidencia: [T(PIE, 'Actions: Abduction of the lateral four digits and flexion at the metatarsophalangeal joints.'), T(PIE, 'Actions: Adduction of the lateral three digits and flexion at the metatarsophalangeal joints.')],
    },
    {
      id: 'rel-tibial', tipo: 'relacion', objetivo: 4, paso: 'capa4', estructuras: ['plantar-medial', 'plantar-lateral'],
      enunciado: '¿De qué nervio son ramas los nervios plantares medial y lateral?',
      correcta: 'Del tibial',
      distractores: ['Del fibular común', 'Del fibular profundo', 'Del sural'],
      explicacion: 'Los dos plantares son ramas del tibial; el fibular profundo inerva el dorso del pie.',
      evidencia: [T(PIE, 'They are innervated by the medial or lateral plantar nerves – which are branches of the tibial nerve.')],
    },
  ],
});
