// Lección «Tipos de articulaciones». Formato y evidencias: ../formato.js.
import { leccion, W, MODELO } from '../formato.js';

const ART = 'Joint';
const SIN = 'Synovial_joint';
const E = (nombre, piezas, tipo, lado = 'bilateral', papel = 'nucleo') => ({ nombre, piezas, lado, papel, tipo });

export default leccion({
  id: 'sis-articular',
  version: 1,
  titulo: 'Tipos de articulaciones',
  resumen: 'Qué es una articulación, cómo se clasifican por el tejido que une los huesos (fibrosas, cartilaginosas y sinoviales) y por lo que se mueven, y qué partes tiene una articulación sinovial, con ejemplos en el modelo.',
  lugares: [],
  sistemas: ['articular'],
  formato: 'vision-general',
  temas: ['articulaciones'],
  nivel: 1,
  minutos: 11,
  requisitos: ['sis-oseo'],
  siguiente: ['fund-movimientos', 'mi-rodilla', 'ms-hombro-articulacion'],
  objetivos: [
    'Clasificar una articulación como fibrosa, cartilaginosa o sinovial según el tejido que une los huesos.',
    'Relacionar cada clase funcional (sinartrosis, anfiartrosis y diartrosis) con lo que permite moverse.',
    'Describir las partes de una articulación sinovial: cápsula, membrana y líquido sinoviales, cartílago articular y ligamentos.',
    'Localizar en el modelo un ejemplo de cada clase estructural.',
  ],
  estructuras: {
    membrana: E('Membrana interósea del antebrazo', ['Interosseous_membrane_of_forearm'], 'ligamento'),
    sinfisis: E('Sínfisis púbica', ['Pubic_symphysis'], 'cartilago', 'impar'),
    disco: E('Disco intervertebral L3-L4', ['Intervertebral_disc_L3_L4'], 'cartilago', 'impar'),
    capsula: E('Cápsula articular de la rodilla', ['Articular_capsule_of_knee_joint'], 'capsula'),
    'menisco-medial': E('Menisco medial', ['Medial_meniscus'], 'cartilago'),
    'menisco-lateral': E('Menisco lateral', ['Lateral_meniscus'], 'cartilago'),
    lca: E('Ligamento cruzado anterior', ['Anterior_cruciate_ligament'], 'ligamento'),
    lcp: E('Ligamento cruzado posterior', ['Posterior_cruciate_ligament'], 'ligamento'),
    radio: E('Radio', ['Radius'], 'hueso', 'bilateral', 'contexto'),
    ulna: E('Ulna', ['Ulna'], 'hueso', 'bilateral', 'contexto'),
    coxal: E('Hueso coxal', ['Hip_Bone'], 'hueso', 'ambos', 'contexto'),
    vertebras: E('Vértebras L3 y L4', ['Vertebra_L3', 'Vertebra_L4'], 'hueso', 'impar', 'contexto'),
    femur: E('Fémur', ['Femur'], 'hueso', 'bilateral', 'contexto'),
    tibia: E('Tibia', ['Tibia'], 'hueso', 'bilateral', 'contexto'),
    rotula: E('Rótula', ['Patella'], 'hueso', 'bilateral', 'contexto'),
  },
  pasos: [
    {
      id: 'que-es', tipo: 'orientacion', titulo: 'Donde se unen los huesos',
      texto: [
        ['Una articulación es la conexión entre huesos u otras estructuras duras, que une el esqueleto en un todo funcional.', W(ART, 'A joint or articulation (or articular surface) is the connection made between bones, ossicles, or other hard structures in the body which link an animal\'s skeletal system into a functional whole.')],
        ['Se clasifican de dos maneras: por cómo se unen los huesos (estructural) y por cuánto se mueven (funcional).', W(ART, 'Structural classification is determined by how the bones connect to each other, while functional classification is determined by the degree of movement between the articulating bones.')],
        ['Además de permitir el movimiento, dan sostén y estabilidad al esqueleto y ayudan a mantener la postura y el equilibrio.', W(ART, 'joints provide structural support and stability to the skeleton, helping to maintain posture, balance, and the ability to bear weight during daily activities')],
      ],
      vista: { capas: { skeletal: 'all', connective: 'joints' }, ver: [], contexto: [], camara: 'anterior', lado: 'R' },
    },
    {
      id: 'fibrosas', tipo: 'exploracion', titulo: 'Fibrosas y cartilaginosas',
      texto: [
        ['En una articulación fibrosa, los huesos se unen por tejido conjuntivo denso rico en fibras de colágeno; en una cartilaginosa, por cartílago.', W(ART, 'fibrous joint – joined by dense regular connective tissue that is rich in collagen fibers'), W(ART, 'cartilaginous joint – joined by cartilage.')],
        ['La membrana interósea del antebrazo es una lámina fibrosa entre el radio y la ulna: la parte principal de una articulación fibrosa, la sindesmosis radioulnar.', W('Interosseous_membrane_of_forearm', 'is a fibrous sheet that connects the interosseous margins of the radius and the ulna'), W('Interosseous_membrane_of_forearm', 'It is the main part of the radio-ulnar syndesmosis, a fibrous joint between the two bones.')],
        ['La sínfisis púbica une los dos huesos coxales por delante y es una articulación cartilaginosa; cada disco intervertebral forma otra entre dos vértebras.', W('Pubic_symphysis', 'is a secondary cartilaginous joint between the left and right superior rami of the pubis of the hip bones'), W('Intervertebral_disc', 'Each disc forms a fibrocartilaginous joint (a symphysis)')],
      ],
      vista: { ver: ['membrana'], contexto: ['radio', 'ulna'], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['membrana', 'sinfisis', 'disco'], texto: 'Alterna entre una articulación fibrosa y dos cartilaginosas.' },
    },
    {
      id: 'sinoviales', tipo: 'explicacion', titulo: 'Sinoviales: las que más se mueven',
      texto: [
        ['En una articulación sinovial los huesos no se tocan directamente: hay una cavidad sinovial y los une una cápsula articular, a menudo con ligamentos accesorios.', W(ART, 'synovial joint – not directly joined – the bones have a synovial cavity and are united by the dense irregular connective tissue that forms the articular capsule that is normally associated with accessory ligaments')],
        ['Son las más frecuentes y las más móviles del cuerpo.', W(SIN, 'They are the most common and most movable type of joint in the body.')],
        ['La rodilla es una articulación sinovial y la más grande del cuerpo.', W('Knee', 'The knee is a modified hinge joint, a type of synovial joint'), W('Knee', 'The knee is the largest joint and one of the most important joints in the body.')],
      ],
      vista: { ver: ['capsula'], contexto: ['femur', 'tibia', 'rotula'], camara: 'anterolateral', lado: 'R' },
    },
    {
      id: 'partes', tipo: 'exploracion', titulo: 'Las partes de una articulación sinovial',
      texto: [
        ['La cápsula tiene una capa externa fibrosa, que mantiene unidos los huesos, y una interna, la membrana sinovial, que encierra el líquido sinovial.', W(SIN, 'The joint capsule is made up of an outer layer of fibrous membrane, which keeps the bones together structurally, and an inner layer, the synovial membrane, which seals in the synovial fluid.')],
        ['Los extremos de los huesos están cubiertos de cartílago hialino, que amortigua y reduce el rozamiento.', W(SIN, 'the bones of a synovial joint are covered by a layer of hyaline cartilage'), W(SIN, 'articular cartilage functions to absorb shock and reduce friction during movement')],
        ['Los ligamentos accesorios, dentro o fuera de la cápsula, resisten las tensiones e impiden movimientos extremos.', W(SIN, 'Accessory ligaments (extracapsular and intracapsular)'), W(SIN, 'highly adapted for resisting strains to prevent extreme movements that may damage the articulation')],
        ['En la rodilla, la cápsula se ve translúcida: dentro están los meniscos y los ligamentos cruzados.', MODELO],
      ],
      detalle: [
        ['Las bolsas sinoviales son sacos con un líquido parecido al sinovial que reducen el rozamiento en algunas articulaciones, como el hombro y la rodilla.', W(SIN, 'Bursae - sac-like structures that are situated strategically to alleviate friction in some joints (shoulder and knee) that are filled with fluid similar to synovial fluid')],
      ],
      vista: { ver: ['menisco-medial', 'menisco-lateral', 'lca', 'lcp'], contexto: ['femur', 'tibia'], fantasma: ['capsula'], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'lca', texto: 'Toca el ligamento cruzado anterior, dentro de la rodilla.' },
      comprobar: 'capsula-capas',
    },
    {
      id: 'funcional', tipo: 'explicacion', titulo: 'Por lo que se mueven',
      texto: [
        ['Por su movilidad, una sinartrosis permite poco o ningún movimiento, una anfiartrosis permite algo y una diartrosis se mueve libremente.', W(ART, 'synarthrosis – permits little or no mobility.'), W(ART, 'amphiarthrosis – permits slight mobility.'), W(ART, 'synovial joint (also known as a diarthrosis) – freely movable.')],
        ['La mayoría de las anfiartrosis son cartilaginosas: la sínfisis púbica lo es.', W(ART, 'Most amphiarthrosis joints are cartilaginous joints.'), W('Pubic_symphysis', 'The pubic symphysis is a nonsynovial amphiarthrodial joint.')],
        ['Los discos intervertebrales permiten un ligero movimiento entre vértebras y amortiguan la columna.', W('Intervertebral_disc', 'to allow slight movement of the vertebrae, to act as a ligament to hold the vertebrae together, and to function as a shock absorber for the spine')],
      ],
      vista: { ver: ['sinfisis', 'disco'], contexto: ['coxal', 'vertebras'], camara: 'anterior', lado: 'R' },
      comprobar: 'anfiartrosis',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['Por el tejido que las une: fibrosas (colágeno), cartilaginosas (cartílago) y sinoviales (cápsula y cavidad sinovial).', W(ART, 'joined by dense regular connective tissue that is rich in collagen fibers'), W(ART, 'cartilaginous joint – joined by cartilage.'), W(ART, 'the bones have a synovial cavity')],
        ['Por su movilidad: sinartrosis, anfiartrosis y diartrosis, que son las sinoviales.', W(ART, 'synovial joint (also known as a diarthrosis) – freely movable.')],
        ['Una articulación sinovial tiene cápsula (fibrosa por fuera, sinovial por dentro), líquido sinovial, cartílago articular y, a menudo, ligamentos accesorios.', W(SIN, 'The joint capsule is made up of an outer layer of fibrous membrane'), W(SIN, 'The synovial cavity/joint is filled with synovial fluid.')],
      ],
    },
  ],
  preguntas: [
    { id: 'id-lca', tipo: 'identificar', estructura: 'lca', objetivo: 3, paso: 'partes' },
    { id: 'id-menisco', tipo: 'identificar', estructura: 'menisco-medial', objetivo: 3, paso: 'partes' },
    { id: 'id-sinfisis', tipo: 'identificar', estructura: 'sinfisis', objetivo: 3, paso: 'funcional' },
    { id: 'loc-membrana', tipo: 'localizar', estructura: 'membrana', candidatas: ['radio', 'ulna'], objetivo: 3, paso: 'fibrosas' },
    {
      id: 'clase-membrana', tipo: 'relacion', objetivo: 0, paso: 'fibrosas', estructuras: ['membrana'],
      enunciado: 'La membrana interósea que une el radio y la ulna forma una articulación…',
      correcta: 'fibrosa', distractores: ['cartilaginosa', 'sinovial', 'ósea'],
      explicacion: 'Es una lámina fibrosa: la parte principal de la sindesmosis radioulnar, una articulación fibrosa.',
      evidencia: [W('Interosseous_membrane_of_forearm', 'It is the main part of the radio-ulnar syndesmosis, a fibrous joint between the two bones.')],
    },
    {
      id: 'clase-disco', tipo: 'relacion', objetivo: 0, paso: 'fibrosas', estructuras: ['disco'],
      enunciado: '¿Qué clase de articulación forma un disco intervertebral?',
      correcta: 'Cartilaginosa (una sínfisis)', distractores: ['Fibrosa (una sindesmosis)', 'Sinovial', 'Ninguna: el disco no es una articulación'],
      explicacion: 'Cada disco forma una articulación fibrocartilaginosa, una sínfisis, entre dos vértebras.',
      evidencia: [W('Intervertebral_disc', 'Each disc forms a fibrocartilaginous joint (a symphysis)')],
    },
    {
      id: 'anfiartrosis', tipo: 'relacion', objetivo: 1, paso: 'funcional',
      enunciado: 'Una anfiartrosis es una articulación que…',
      correcta: 'permite un ligero movimiento', distractores: ['no permite ningún movimiento', 'se mueve libremente', 'solo permite girar'],
      explicacion: 'Sinartrosis: poco o nada. Anfiartrosis: algo. Diartrosis (las sinoviales): movimiento libre.',
      evidencia: [W(ART, 'amphiarthrosis – permits slight mobility.')],
    },
    {
      id: 'diartrosis', tipo: 'relacion', objetivo: 1, paso: 'funcional',
      enunciado: '¿Qué articulaciones son diartrosis, es decir, se mueven libremente?',
      correcta: 'Las sinoviales', distractores: ['Las fibrosas', 'Las cartilaginosas', 'Las sínfisis'],
      explicacion: 'Las sinoviales son diartrosis: las más frecuentes y las más móviles.',
      evidencia: [W(ART, 'synovial joint (also known as a diarthrosis) – freely movable.')],
    },
    {
      id: 'capsula-capas', tipo: 'relacion', objetivo: 2, paso: 'partes', estructuras: ['capsula'],
      enunciado: '¿Qué capa de la cápsula articular encierra el líquido sinovial?',
      correcta: 'La interna, la membrana sinovial', distractores: ['La externa, la membrana fibrosa', 'El cartílago articular', 'El periostio'],
      explicacion: 'La capa fibrosa externa mantiene unidos los huesos; la membrana sinovial interna sella el líquido sinovial.',
      evidencia: [W(SIN, 'an inner layer, the synovial membrane, which seals in the synovial fluid')],
    },
    {
      id: 'cartilago', tipo: 'funcion', objetivo: 2, paso: 'partes',
      enunciado: '¿Para qué sirve el cartílago articular que cubre los huesos de una articulación sinovial?',
      correcta: 'Para amortiguar y reducir el rozamiento', distractores: ['Para unir los huesos entre sí', 'Para producir el líquido sinovial', 'Para impedir los movimientos extremos'],
      explicacion: 'Unir los huesos es cosa de la cápsula fibrosa; producir el líquido, de la membrana sinovial; frenar movimientos extremos, de los ligamentos.',
      evidencia: [W(SIN, 'articular cartilage functions to absorb shock and reduce friction during movement')],
    },
    {
      id: 'ligamentos', tipo: 'funcion', objetivo: 2, paso: 'partes', estructuras: ['lca', 'lcp'],
      enunciado: '¿Qué hacen los ligamentos accesorios de una articulación sinovial?',
      correcta: 'Resisten las tensiones e impiden movimientos extremos', distractores: ['Lubrican la articulación', 'Cubren los extremos de los huesos', 'Reducen el rozamiento de los tendones'],
      explicacion: 'Son haces de tejido conjuntivo denso adaptados a resistir tensiones.',
      evidencia: [W(SIN, 'highly adapted for resisting strains to prevent extreme movements that may damage the articulation')],
    },
  ],
});
