// Lección «Pierna: compartimentos anterior y lateral». Formato y evidencias: ../formato.js.
import { leccion, T, GUIA } from '../formato.js';

const ANT = 'lower-limb/muscles/leg/anterior-compartment';
const LAT = 'lower-limb/muscles/leg/lateral-compartment';
const FIB = 'lower-limb/nerves/common-fibular-nerve';
const nucleo = (nombre, piezas, tipo = 'musculo') => ({ nombre, piezas, lado: 'bilateral', papel: 'nucleo', tipo });
const contexto = (nombre, piezas, tipo) => ({ nombre, piezas, lado: 'bilateral', papel: 'contexto', tipo });

const ANTERIORES = ['tibial-anterior', 'extensor-dedos', 'extensor-hallux', 'fibular-tercero'];
const LATERALES = ['fibular-largo', 'fibular-corto'];
const HUESOS = ['tibia', 'fibula', 'talus', 'calcaneo', 'cuneiforme-medial', 'metatarsiano-1', 'metatarsiano-5'];

export default leccion({
  id: 'mi-pierna-anterior-lateral',
  version: 1,
  titulo: 'Pierna: compartimentos anterior y lateral',
  resumen: 'Los cuatro músculos de delante de la pierna (tibial anterior, extensor largo de los dedos, extensor largo del dedo gordo y fibular tercero), que levantan el pie, y los dos fibulares del lado de fuera, que lo giran hacia fuera. Sus nervios (fibular profundo y superficial), la arteria tibial anterior y el pie caído.',
  lugares: [['miembro-inferior', 'pierna']],
  sistemas: ['muscular'],
  formato: 'estructuras',
  temas: ['musculos', 'compartimentos', 'movimientos'],
  nivel: 2,
  minutos: 14,
  requisitos: ['mi-huesos', 'mi-pie-huesos-tobillo'],
  siguiente: ['mi-pierna-posterior', 'mi-pie-musculos', 'mi-nervios'],
  objetivos: [
    'Identificar los músculos del compartimento anterior y los del lateral.',
    'Relacionar cada músculo con su acción en el tobillo y los dedos.',
    'Asociar cada compartimento con su nervio y el anterior con su arteria.',
    'Predecir qué pasa al caminar si se paralizan los músculos del compartimento anterior.',
  ],
  estructuras: {
    'tibial-anterior': nucleo('Músculo tibial anterior', ['Tibialis_anterior_muscle']),
    'extensor-dedos': nucleo('Músculo extensor largo de los dedos', ['Extensor_digitorum_longus']),
    'extensor-hallux': nucleo('Músculo extensor largo del dedo gordo', ['Extensor_hallucis_longus']),
    'fibular-tercero': nucleo('Músculo fibular tercero', ['Fibularis_tertius_muscle']),
    'fibular-largo': nucleo('Músculo fibular largo', ['Fibularis_longus_muscle']),
    'fibular-corto': nucleo('Músculo fibular corto', ['Fibularis_brevis_muscle']),
    'nervio-fibular-profundo': { ...nucleo('Nervio fibular profundo', ['Deep_fibular_nerve', 'Muscular_branches_of_deep_fibular_nerve'], 'nervio'), confusiones: ['Nervio tibial', 'Nervio safeno'] },
    'nervio-fibular-superficial': nucleo('Nervio fibular superficial', ['Superficial_fibular_nerve'], 'nervio'),
    'arteria-tibial-anterior': { ...nucleo('Arteria tibial anterior', ['Anterior_tibial_artery'], 'arteria'), confusiones: ['Arteria tibial posterior', 'Arteria fibular', 'Arteria poplítea'] },
    'nervio-fibular-comun': contexto('Nervio fibular común', ['Common_fibular_nerve'], 'nervio'),
    'retinaculos-extensores': contexto('Retináculos de los extensores', ['Superior_extensor_retinaculum_of_ankle', 'Inferior_extensor_retinaculum_of_ankle'], 'ligamento'),
    'retinaculos-fibulares': contexto('Retináculos fibulares', ['Superior_fibular_retinaculum', 'Inferior_fibular_retinaculum'], 'ligamento'),
    'membrana-interosea': contexto('Membrana interósea de la pierna', ['Interosseous_membrane_of_leg'], 'ligamento'),
    tibia: contexto('Tibia', ['Tibia'], 'hueso'),
    fibula: contexto('Fíbula', ['Fibula'], 'hueso'),
    talus: contexto('Talus', ['Talus'], 'hueso'),
    calcaneo: contexto('Calcáneo', ['Calcaneus'], 'hueso'),
    'cuneiforme-medial': contexto('Cuneiforme medial', ['Medial_Cuneiform'], 'hueso'),
    'metatarsiano-1': contexto('Primer metatarsiano', ['Metatarsal_1'], 'hueso'),
    'metatarsiano-5': contexto('Quinto metatarsiano', ['Metatarsal_5'], 'hueso'),
  },
  pasos: [
    {
      id: 'orientacion', tipo: 'orientacion', titulo: 'Delante y fuera de la pierna',
      texto: [
        ['Delante de la pierna hay cuatro músculos que hacen la flexión dorsal del pie (lo levantan); los inerva el nervio fibular profundo y los irriga la arteria tibial anterior.', T(ANT, 'The muscles in the anterior compartment of the leg are a group of four muscles that act to dorsiflex'), T(ANT, 'These muscles are collectively innervated by the deep fibular nerve (L4-S2). The arterial supply is through the anterior tibial artery.')],
        ['En el lado de fuera hay dos, los fibulares largo y corto, que hacen la eversión (giran la planta hacia fuera); los inerva el nervio fibular superficial.', T(LAT, 'There are two muscles in the lateral compartment of the leg; the fibularis longus and brevis (also known as peroneus longus and brevis).'), T(LAT, 'The common function of the muscles is eversion – turning the sole of the foot outwards. They are both innervated by the superficial fibular nerve.')],
        ['Mira la pierna de frente y de lado.', GUIA],
      ],
      vista: { ver: [...ANTERIORES, ...LATERALES], contexto: HUESOS, camara: 'anterolateral', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'Recorre los dos compartimentos.', vistas: [{ nombre: 'De frente', camara: 'anterior' }, { nombre: 'Por fuera', camara: 'lateral' }] },
      comprobar: 'comp-compartimentos',
    },
    {
      id: 'anteriores', tipo: 'exploracion', titulo: 'El compartimento anterior',
      texto: [
        ['El tibial anterior va junto a la cara lateral de la tibia hasta el cuneiforme medial y el primer metatarsiano; es el flexor dorsal más fuerte y además invierte el pie.', T(ANT, 'The tibialis anterior muscle is located alongside the lateral surface of the tibia. It is the strongest dorsiflexor of the foot.'), T(ANT, 'attaches to the medial cuneiform and the base of metatarsal I.'), T(ANT, 'Actions: Dorsiflexion and inversion of the foot.')],
        ['El extensor largo de los dedos, lateral y más profundo, da cuatro tendones a los dedos; el del dedo gordo, más profundo aún, asoma entre ambos.', T(ANT, 'The extensor digitorum longus lies laterally and deep to the tibialis anterior.'), T(ANT, 'The tendon splits into four and each tendon inserts onto a toe.'), T(ANT, 'The extensor hallucis longus is positioned deep to tibialis anterior and extensor digitorum longus. Its tendon emerges from between the two muscles to insert onto the big toe.')],
        ['El fibular tercero, que no tienen todas las personas, llega al quinto metatarsiano y hace la eversión y la flexión dorsal.', T(ANT, 'It is not present in all individuals.'), T(ANT, 'attaches to the fifth metatarsal.'), T(ANT, 'Actions: Eversion and dorsiflexion of the foot.')],
      ],
      vista: { ver: ANTERIORES, contexto: ['retinaculos-extensores', ...HUESOS], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['tibial-anterior', 'extensor-hallux', 'extensor-dedos'], texto: 'Alterna de dentro afuera: tibial anterior, extensor del dedo gordo y extensor de los dedos.' },
      comprobar: 'fun-tibial-anterior',
    },
    {
      id: 'laterales', tipo: 'exploracion', titulo: 'El compartimento lateral',
      texto: [
        ['El fibular largo es el más grande y superficial; su tendón pasa por detrás del maléolo lateral, cruza bajo el pie y llega al cuneiforme medial y el primer metatarsiano.', T(LAT, 'The fibularis longus is the larger and more superficial muscle within the compartment.'), T(LAT, 'The fibres converge into a tendon, which descends into the foot, posterior to the lateral malleolus.'), T(LAT, 'The tendon crosses under the foot, and attaches to the bones on the medial side, namely the medial cuneiform and base of metatarsal I.')],
        ['El fibular corto, más profundo y corto, baja con él y acaba en el quinto metatarsiano.', T(LAT, 'The fibularis brevis muscle is deeper and shorter than the fibularis longus.'), T(LAT, 'The tendon then attaches to a tubercle on the 5th metatarsal.')],
        ['Desde la posición anatómica la eversión es escasa: su papel real es fijar el borde medial del pie al correr y evitar una inversión excesiva.', T(LAT, 'From the anatomical position, only a few degrees of eversion are possible. In reality, the job of these muscles is to ‘fix’ the medial margin of the foot during running, and prevent excessive inversion.')],
      ],
      vista: { ver: LATERALES, contexto: ['retinaculos-fibulares', ...HUESOS], camara: 'lateral', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: LATERALES, texto: 'Alterna: el largo, superficial, cruza bajo el pie; el corto, debajo, acaba en el quinto metatarsiano.' },
      comprobar: 'rel-fibular-largo',
    },
    {
      id: 'nervios', tipo: 'relaciones', titulo: 'Nervios y arteria',
      texto: [
        ['El nervio fibular común rodea el cuello de la fíbula, entre las inserciones del fibular largo, y allí se divide en el profundo y el superficial.', T(LAT, 'The common fibular nerve passes through this gap, and is easily identified.'), T(LAT, 'After passing through the gap, the nerve terminates by bifurcating into two terminal branches; the deep and superficial fibular nerve.')],
        ['El profundo inerva el compartimento anterior y el superficial, el lateral; la arteria tibial anterior irriga el anterior.', T(FIB, 'Deep fibular nerve: Innervates the muscles of the anterior compartment of the leg'), T(FIB, 'Superficial fibular nerve: Innervates the muscles of the lateral compartment of the leg; fibularis longus and brevis.'), T(ANT, 'The arterial supply is through the anterior tibial artery.')],
      ],
      vista: { ver: ['nervio-fibular-profundo', 'nervio-fibular-superficial', 'arteria-tibial-anterior'], contexto: ['nervio-fibular-comun', 'membrana-interosea', 'tibia', 'fibula'], fantasma: ['fibular-largo', 'extensor-dedos'], camara: 'anterolateral', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['nervio-fibular-profundo', 'nervio-fibular-superficial'], texto: 'Alterna los dos nervios: el profundo baja con la arteria tibial anterior; el superficial, entre los fibulares.' },
      comprobar: 'rel-nervio-anterior',
    },
    {
      id: 'pie-caido', tipo: 'funcion', titulo: 'El pie caído',
      texto: [
        ['Si se paralizan los músculos anteriores, el pie no se levanta y cae por su peso: es el pie caído.', T(ANT, 'Footdrop is a clinical sign that refers to an inability to dorsiflex the foot at the ankle joint – resulting in the foot “dropping” under the influence of gravity.')],
        ['Suele deberse a una lesión del nervio fibular común, del que sale el profundo; al andar, el pie arrastra y el paciente lo lanza hacia fuera para evitarlo.', T(ANT, 'typically occurs as a consequence of damage to the common fibular nerve (from which the deep fibular nerve arises)'), T(ANT, 'The inability to dorsiflex the foot can interfere with walking – as the affected foot drags along the ground. To circumvent this, the patient can flick the foot outwards while walking')],
      ],
      vista: { ver: ANTERIORES, contexto: ['nervio-fibular-comun', 'nervio-fibular-profundo', ...HUESOS], camara: 'anterolateral', lado: 'R' },
      comprobar: 'rel-pie-caido',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['Anterior: tibial anterior, extensores largos de los dedos y del dedo gordo, y fibular tercero; levantan el pie. Nervio fibular profundo y arteria tibial anterior.', T(ANT, 'a group of four muscles that act to dorsiflex'), T(ANT, 'collectively innervated by the deep fibular nerve')],
        ['Lateral: fibulares largo y corto; giran la planta hacia fuera. Nervio fibular superficial.', T(LAT, 'The common function of the muscles is eversion'), T(LAT, 'They are both innervated by the superficial fibular nerve.')],
        ['Sin el compartimento anterior, el pie cae.', T(ANT, 'It indicates paralysis or weakness of the muscles in the anterior compartment of the leg')],
      ],
    },
  ],
  preguntas: [
    {
      id: 'comp-compartimentos', tipo: 'comparacion', objetivo: 1, paso: 'orientacion', estructuras: [...ANTERIORES, ...LATERALES],
      enunciado: '¿Qué movimiento comparten los dos fibulares del compartimento lateral?',
      correcta: 'La eversión: girar la planta hacia fuera',
      distractores: ['La flexión dorsal', 'La inversión', 'La extensión de los dedos'],
      explicacion: 'Los laterales evierten; los anteriores hacen la flexión dorsal.',
      evidencia: [T(LAT, 'The common function of the muscles is eversion – turning the sole of the foot outwards.')],
    },
    { id: 'id-tibial-anterior', tipo: 'identificar', estructura: 'tibial-anterior', objetivo: 0, paso: 'anteriores' },
    { id: 'id-extensor-dedos', tipo: 'identificar', estructura: 'extensor-dedos', objetivo: 0, paso: 'anteriores' },
    { id: 'id-extensor-hallux', tipo: 'identificar', estructura: 'extensor-hallux', objetivo: 0, paso: 'anteriores' },
    { id: 'id-fibular-largo', tipo: 'identificar', estructura: 'fibular-largo', objetivo: 0, paso: 'laterales' },
    { id: 'loc-tibial-anterior', tipo: 'localizar', estructura: 'tibial-anterior', candidatas: ['extensor-dedos', 'fibular-largo'], objetivo: 0, paso: 'anteriores' },
    {
      id: 'fun-tibial-anterior', tipo: 'funcion', objetivo: 1, paso: 'anteriores', estructuras: ['tibial-anterior'],
      enunciado: '¿Qué hace el tibial anterior?',
      correcta: 'Es el flexor dorsal más fuerte del pie y además lo invierte',
      distractores: ['Hace la flexión plantar', 'Hace la eversión del pie', 'Extiende los cuatro dedos laterales'],
      explicacion: 'Levanta el pie con más fuerza que ningún otro y lo gira hacia dentro.',
      evidencia: [T(ANT, 'It is the strongest dorsiflexor of the foot.'), T(ANT, 'Actions: Dorsiflexion and inversion of the foot.')],
    },
    {
      id: 'fun-extensor-dedos', tipo: 'funcion', objetivo: 1, paso: 'anteriores', estructuras: ['extensor-dedos'],
      enunciado: '¿Qué hace el extensor largo de los dedos?',
      correcta: 'Extiende los cuatro dedos laterales y ayuda a levantar el pie',
      distractores: ['Flexiona los cuatro dedos laterales', 'Extiende solo el dedo gordo', 'Hace la eversión del pie'],
      explicacion: 'Sus cuatro tendones van a los cuatro dedos laterales; el dedo gordo tiene su propio extensor.',
      evidencia: [T(ANT, 'Actions: Extension of the lateral four toes, and dorsiflexion of the foot.')],
    },
    {
      id: 'rel-fibular-largo', tipo: 'relacion', objetivo: 1, paso: 'laterales', estructuras: ['fibular-largo'],
      enunciado: '¿Por dónde pasa el tendón del fibular largo?',
      correcta: 'Por detrás del maléolo lateral y cruzando bajo el pie hasta su lado medial',
      distractores: ['Por delante del maléolo medial', 'Por el túnel tarsiano', 'Por encima del dorso del pie hasta el quinto dedo'],
      explicacion: 'Baja detrás del maléolo lateral y cruza la planta hasta el cuneiforme medial y el primer metatarsiano.',
      evidencia: [T(LAT, 'which descends into the foot, posterior to the lateral malleolus.'), T(LAT, 'The tendon crosses under the foot, and attaches to the bones on the medial side')],
    },
    {
      id: 'fun-fibular-corto', tipo: 'funcion', objetivo: 1, paso: 'laterales', estructuras: ['fibular-corto'],
      enunciado: '¿Dónde se inserta el fibular corto?',
      correcta: 'En el quinto metatarsiano',
      distractores: ['En el primer metatarsiano', 'En el calcáneo', 'En la falange distal del dedo gordo'],
      explicacion: 'El corto acaba en el tubérculo del quinto metatarsiano; el largo cruza hasta el lado medial.',
      evidencia: [T(LAT, 'The tendon then attaches to a tubercle on the 5th metatarsal.')],
    },
    { id: 'id-nervio-fibular-profundo', tipo: 'identificar', estructura: 'nervio-fibular-profundo', objetivo: 2, paso: 'nervios' },
    {
      id: 'rel-nervio-anterior', tipo: 'relacion', objetivo: 2, paso: 'nervios', estructuras: ['nervio-fibular-profundo'],
      enunciado: '¿Qué nervio inerva el compartimento anterior de la pierna?',
      correcta: 'El fibular profundo',
      distractores: ['El fibular superficial', 'El tibial', 'El safeno'],
      explicacion: 'El profundo inerva el anterior; el superficial, el lateral; el tibial, el posterior.',
      evidencia: [T(ANT, 'These muscles are collectively innervated by the deep fibular nerve')],
    },
    {
      id: 'rel-arteria', tipo: 'relacion', objetivo: 2, paso: 'nervios', estructuras: ['arteria-tibial-anterior'],
      enunciado: '¿Qué arteria irriga el compartimento anterior de la pierna?',
      correcta: 'La tibial anterior',
      distractores: ['La tibial posterior', 'La fibular', 'La femoral profunda'],
      explicacion: 'La tibial posterior irriga el compartimento posterior.',
      evidencia: [T(ANT, 'The arterial supply is through the anterior tibial artery.')],
    },
    {
      id: 'rel-pie-caido', tipo: 'relacion', objetivo: 3, paso: 'pie-caido', estructuras: ANTERIORES,
      enunciado: 'Si se paralizan los músculos del compartimento anterior, ¿qué ocurre al andar?',
      correcta: 'El pie cae y arrastra; se compensa lanzándolo hacia fuera',
      distractores: ['El pie no puede girar la planta hacia fuera', 'No se puede ponerse de puntillas', 'Se pierde la flexión de la rodilla'],
      explicacion: 'Sin flexión dorsal el pie cuelga por su peso (pie caído); ponerse de puntillas depende del compartimento posterior.',
      evidencia: [T(ANT, 'Footdrop is a clinical sign that refers to an inability to dorsiflex the foot at the ankle joint'), T(ANT, 'the affected foot drags along the ground. To circumvent this, the patient can flick the foot outwards while walking')],
    },
  ],
});
