// Lección «Músculos de la masticación y articulación temporomandibular». Formato y evidencias: ../formato.js.
import { leccion, W, T, GUIA } from '../formato.js';

const MAS = 'head/muscles/mastication';
const ATM = 'head/joints/temporomandibular';
const nucleo = (nombre, piezas, tipo = 'musculo', extra = {}) => ({ nombre, piezas, lado: 'bilateral', papel: 'nucleo', tipo, ...extra });
const contexto = (nombre, piezas, tipo, lado = 'bilateral') => ({ nombre, piezas, lado, papel: 'contexto', tipo });

const MUSCULOS = ['masetero', 'temporal', 'pterigoideo-medial', 'pterigoideo-lateral'];
const LIGAMENTOS = ['ligamento-lateral', 'esfenomandibular', 'estilomandibular'];
const HUESOS = ['mandibula', 'hueso-temporal', 'cigomatico', 'esfenoides', 'maxilar'];

export default leccion({
  id: 'cab-masticacion',
  version: 1,
  titulo: 'Músculos de la masticación y articulación temporomandibular',
  resumen: 'Los cuatro músculos de la masticación (masetero, temporal y los dos pterigoideos), todos del nervio mandibular, y la articulación temporomandibular: el disco que separa sus superficies en dos cavidades, sus ligamentos, qué movimiento hace cada parte y por qué la mandíbula se luxa hacia delante.',
  lugares: [['cabeza', 'cara']],
  sistemas: ['muscular', 'articular'],
  formato: 'estructuras',
  temas: ['musculos', 'articulaciones', 'movimientos'],
  nivel: 2,
  minutos: 16,
  requisitos: ['cab-cara-huesos', 'cab-craneo'],
  siguiente: ['cab-musculos-cara', 'cue-musculos', 'cab-boca'],
  objetivos: [
    'Identificar los cuatro músculos de la masticación y decir qué nervio los inerva.',
    'Relacionar cada músculo con el movimiento de la mandíbula que produce.',
    'Describir las superficies de la articulación temporomandibular y el disco que las separa.',
    'Localizar los ligamentos de la articulación y explicar por qué la luxación suele ser anterior.',
  ],
  estructuras: {
    masetero: nucleo('Músculo masetero', ['Superficial_part_of_masseter', 'Deep_part_of_masseter']),
    temporal: nucleo('Músculo temporal', ['Temporalis_muscle']),
    'pterigoideo-medial': nucleo('Músculo pterigoideo medial', ['Medial_pterygoid_muscle']),
    'pterigoideo-lateral': nucleo('Músculo pterigoideo lateral', ['Superior_head_of_lateral_pterygoid_muscle', 'Inferior_head_of_lateral_pterygoid_muscle']),
    capsula: nucleo('Cápsula de la articulación temporomandibular', ['Articular_capsule_of_temporomandibular_joint'], 'capsula'),
    disco: nucleo('Disco articular temporomandibular', ['Articular_disc_of_temporomandibular_joint'], 'cartilago', { confusiones: ['Disco articular de la articulación esternoclavicular', 'Menisco lateral'] }),
    'ligamento-lateral': nucleo('Ligamento lateral (temporomandibular)', ['Lateral_temporomandibular_ligament'], 'ligamento'),
    esfenomandibular: nucleo('Ligamento esfenomandibular', ['Sphenomandibular_ligament'], 'ligamento'),
    estilomandibular: nucleo('Ligamento estilomandibular', ['Stylomandibular_ligament'], 'ligamento'),
    digastrico: contexto('Músculo digástrico', ['Anterior_belly_of_digastric_muscle', 'Posterior_belly_of_digastric_muscle'], 'musculo'),
    'temporal-superficial': contexto('Arteria temporal superficial', ['Superficial_temporal_artery'], 'arteria'),
    mandibula: contexto('Mandíbula', ['Mandible'], 'hueso', 'impar'),
    'hueso-temporal': contexto('Hueso temporal', ['Temporal_Bone'], 'hueso'),
    cigomatico: contexto('Hueso cigomático', ['Zygomatic_Bone'], 'hueso'),
    esfenoides: contexto('Esfenoides', ['Sphenoid_Bone'], 'hueso', 'impar'),
    maxilar: contexto('Maxilar', ['Maxilla'], 'hueso'),
  },
  pasos: [
    {
      id: 'orientacion', tipo: 'orientacion', titulo: 'Masticar',
      texto: [
        ['Los músculos de la masticación mueven la mandíbula en la articulación temporomandibular; son cuatro: masetero, temporal, pterigoideo medial y pterigoideo lateral.', T(MAS, 'The muscles of mastication are associated with movements of the jaw (temporomandibular joint). There are four muscles:')],
        ['Nacen del primer arco faríngeo, y por eso los inerva el nervio mandibular, rama del trigémino.', T(MAS, 'The muscles of mastication develop from the first pharyngeal arch. They are therefore innervated by a branch of the trigeminal nerve (CN V), the mandibular nerve.')],
        ['Mira la cara de lado; los pterigoideos quedan por dentro de la rama de la mandíbula.', GUIA],
      ],
      vista: { ver: ['masetero', 'temporal'], contexto: HUESOS, camara: 'lateral', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'Recorre la región.', vistas: [{ nombre: 'De lado', camara: 'lateral' }, { nombre: 'De frente', camara: 'anterior' }, { nombre: 'Desde abajo', camara: 'inferior' }] },
      comprobar: 'rel-nervio',
    },
    {
      id: 'superficiales', tipo: 'exploracion', titulo: 'Masetero y temporal',
      texto: [
        ['El masetero es el más potente: cuadrangular, con una parte superficial (del cigomático) y otra profunda (del arco cigomático), que acaban en la rama de la mandíbula.', T(MAS, 'The masseter muscle is the most powerful muscle of mastication. It is quadrangular in shape and has two parts: deep and superficial.'), T(MAS, 'The superficial part originates from maxillary process of the zygomatic bone.'), T(MAS, 'The deep part originates from the zygomatic arch of the temporal bone.'), T(MAS, 'Both parts attach to the ramus of the mandible.')],
        ['El temporal llena la fosa temporal del cráneo y se inserta en la apófisis coronoides; cierra la boca y lleva la mandíbula hacia atrás.', T(MAS, 'Originates from the temporal fossa of the skull and attaches onto the coronoid process of the mandible.'), T(MAS, 'Actions: Elevation of the mandible (closing the mouth). Also performs retraction of the mandible (moving the jaw posteriorly).')],
      ],
      vista: { ver: ['masetero', 'temporal'], contexto: HUESOS, camara: 'lateral', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['masetero', 'temporal'], texto: 'Alterna: el masetero, sobre la rama de la mandíbula; el temporal, en abanico sobre el lado del cráneo.' },
      comprobar: 'fun-masetero',
    },
    {
      id: 'pterigoideos', tipo: 'exploracion', titulo: 'Los pterigoideos',
      texto: [
        ['El pterigoideo medial, cuadrangular y por debajo del lateral, llega a la rama de la mandíbula junto al ángulo y también cierra la boca.', T(MAS, 'The medial pterygoid muscle has a quadrangular shape with two heads: deep and superficial. It is located inferiorly to the lateral pterygoid.'), T(MAS, 'Both heads attach to the ramus of the mandible near the angle of mandible.'), T(MAS, 'Actions: Elevation of the mandible (closing the mouth).')],
        ['El pterigoideo lateral, de fibras horizontales, es el principal protractor: lleva la mandíbula hacia delante y, actuando de un solo lado, la mueve de lado a lado.', T(MAS, 'It has horizontally orientated muscle fibres, and thus is the major protractor of the mandible.'), T(MAS, 'Bilateral action – protraction of the mandible and depression of the chin.'), T(MAS, 'Unilateral action – ‘side to side’ movement of the jaw.')],
      ],
      vista: { ver: ['pterigoideo-medial', 'pterigoideo-lateral'], contexto: ['esfenoides', 'hueso-temporal', 'maxilar'], fantasma: ['mandibula', 'masetero'], camara: 'lateral', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['pterigoideo-medial', 'pterigoideo-lateral'], texto: 'Alterna, con la mandíbula translúcida: el medial baja hacia el ángulo; el lateral va horizontal hacia el cuello de la mandíbula.' },
      comprobar: 'fun-pterigoideo-lateral',
    },
    {
      id: 'articulacion', tipo: 'explicacion', titulo: 'La articulación temporomandibular',
      texto: [
        ['La articulación temporomandibular une la mandíbula con el hueso temporal, por delante del trago de la oreja.', T(ATM, 'The temporomandibular joint (TMJ) is formed by the articulation of the mandible and the temporal bone of the cranium. It is located anteriorly to the tragus of the ear, on the lateral aspect of the face.')],
        ['Sus superficies (la fosa mandibular y el tubérculo articular del temporal, y la cabeza de la mandíbula) nunca se tocan: las separa un disco que divide la articulación en dos cavidades.', T(ATM, 'the mandibular fossa and articular tubercle (from the squamous part of the temporal bone), and the head of mandible.'), T(ATM, 'the articular surfaces of the bones never come into contact with each other – they are separated by an articular disk. The presence of such a disk splits the joint into two synovial joint cavities')],
        ['Las superficies están cubiertas de fibrocartílago, no de cartílago hialino.', T(ATM, 'The articular surface of the bones are covered by fibrocartilage, not hyaline cartilage.')],
      ],
      detalle: [
        ['Las dos articulaciones, la derecha y la izquierda, trabajan juntas porque comparten la mandíbula.', W('Temporomandibular_joint', 'The joints are unique in their bilateral function, being connected via the mandible.')],
        ['Su trastorno más frecuente es el desplazamiento del disco; al abrir la boca puede notarse un «clic».', W('Temporomandibular_joint', 'The most common disorder of a temporomandibular joint is disc displacement.'), W('Temporomandibular_joint', 'can sometimes be heard and usually felt also, indicating the condyle is moving back onto the disk')],
      ],
      vista: { ver: ['disco'], contexto: ['mandibula', 'hueso-temporal'], fantasma: ['capsula'], camara: 'lateral', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'disco', texto: 'Toca el disco que separa la cabeza de la mandíbula del hueso temporal.' },
      comprobar: 'rel-disco',
    },
    {
      id: 'ligamentos-movimientos', tipo: 'relaciones', titulo: 'Ligamentos y movimientos',
      texto: [
        ['Tres ligamentos la estabilizan: el lateral, engrosamiento de la cápsula que impide la luxación posterior; el esfenomandibular, y el estilomandibular.', T(ATM, 'There are three extracapsular ligaments. They act to stabilise the temporomandibular joint.'), T(ATM, 'It is a thickening of the joint capsule, and acts to prevent posterior dislocation of the joint.'), T(ATM, 'Sphenomandibular ligament – originates from the sphenoid spine, and attaches to the mandible.')],
        ['La cavidad de arriba permite llevar la mandíbula hacia delante y hacia atrás; la de abajo, abrir y cerrar la boca.', T(ATM, 'The upper part of the joint allows protrusion and retraction of the mandible'), T(ATM, 'The lower part of the joint permits elevation and depression of the mandible; opening and closing the mouth.')],
        ['Abrir la boca es sobre todo obra de la gravedad (con el digástrico si hay resistencia); cerrarla, del temporal, el masetero y el pterigoideo medial.', T(ATM, 'Depression is mostly caused by gravity. However, if there is resistance, the digastric, geniohyoid, and mylohyoid muscles assist.'), T(ATM, 'Elevation is very strong movement, caused by the contraction of the temporalis, masseter, and medial pterygoid muscles.')],
      ],
      vista: { ver: LIGAMENTOS, contexto: ['capsula', 'digastrico', ...HUESOS], camara: 'lateral', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: LIGAMENTOS, texto: 'Alterna los tres: el lateral, sobre la cápsula; el esfenomandibular y el estilomandibular, por dentro y por detrás.' },
      comprobar: 'fun-abrir',
    },
    {
      id: 'luxacion', tipo: 'relaciones', titulo: 'La luxación de la mandíbula',
      texto: [
        ['Un golpe en el lado de la cara, un bostezo o un mordisco grande pueden luxarla: la cabeza de la mandíbula sale de la fosa y se va hacia delante, y la boca no se puede cerrar.', T(ATM, 'A dislocation of the temporomandibular joint can occur via a blow to the side of the face, yawning, or taking a large bite. The head of the mandible ‘slips’ out of the mandibular fossa, and is pulled anteriorly.'), T(ATM, 'The patient becomes unable to close their mouth.')],
        ['Las luxaciones posteriores son muy raras: tendrían que vencer el tubérculo posglenoideo y el fuerte ligamento lateral.', T(ATM, 'Posterior dislocations of the TMJ are possible, but very rare, requiring a large amount of force to overcome the postglenoid tubercle and strong intrinsic lateral ligament.')],
      ],
      vista: { ver: ['ligamento-lateral', 'capsula'], contexto: ['temporal-superficial', ...HUESOS], camara: 'lateral', lado: 'R' },
      comprobar: 'rel-luxacion',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['Cierran la boca el masetero, el temporal y el pterigoideo medial; el pterigoideo lateral la lleva hacia delante y de lado a lado.', T(ATM, 'caused by the contraction of the temporalis, masseter, and medial pterygoid muscles.'), T(MAS, 'is the major protractor of the mandible.')],
        ['Todos los inerva el nervio mandibular (V3).', T(MAS, 'Innervation: Mandibular nerve (V3).')],
        ['La articulación tiene un disco que la divide en dos cavidades: arriba, delante y atrás; abajo, abrir y cerrar.', T(ATM, 'The presence of such a disk splits the joint into two synovial joint cavities')],
      ],
    },
  ],
  preguntas: [
    {
      id: 'rel-nervio', tipo: 'relacion', objetivo: 0, paso: 'orientacion', estructuras: MUSCULOS,
      enunciado: '¿Qué nervio inerva los músculos de la masticación?',
      correcta: 'El nervio mandibular, rama del trigémino',
      distractores: ['El nervio facial', 'El nervio hipogloso', 'El nervio maxilar'],
      explicacion: 'Nacen del primer arco faríngeo, cuyo nervio es el trigémino; la rama que los inerva es la mandibular. El facial inerva los músculos de la expresión.',
      evidencia: [T(MAS, 'They are therefore innervated by a branch of the trigeminal nerve (CN V), the mandibular nerve.')],
    },
    { id: 'id-masetero', tipo: 'identificar', estructura: 'masetero', objetivo: 0, paso: 'superficiales' },
    { id: 'id-temporal', tipo: 'identificar', estructura: 'temporal', objetivo: 0, paso: 'superficiales' },
    { id: 'id-pterigoideo-lateral', tipo: 'identificar', estructura: 'pterigoideo-lateral', objetivo: 0, paso: 'pterigoideos' },
    { id: 'id-pterigoideo-medial', tipo: 'identificar', estructura: 'pterigoideo-medial', objetivo: 0, paso: 'pterigoideos' },
    {
      id: 'fun-masetero', tipo: 'funcion', objetivo: 1, paso: 'superficiales', estructuras: ['masetero'],
      enunciado: '¿Qué hace el masetero?',
      correcta: 'Eleva la mandíbula: cierra la boca',
      distractores: ['Abre la boca', 'Lleva la mandíbula hacia delante', 'Mueve la mandíbula de lado a lado'],
      explicacion: 'Es el más potente de los cuatro y cierra la boca con el temporal y el pterigoideo medial.',
      evidencia: [T(MAS, 'Actions: Elevation of the mandible (closes the mouth).')],
    },
    {
      id: 'fun-temporal', tipo: 'funcion', objetivo: 1, paso: 'superficiales', estructuras: ['temporal'],
      enunciado: '¿Qué hace el temporal, además de cerrar la boca?',
      correcta: 'Lleva la mandíbula hacia atrás (retracción)',
      distractores: ['La lleva hacia delante (protrusión)', 'Abre la boca', 'Eleva la ceja'],
      explicacion: 'Sus fibras posteriores retraen la mandíbula; la protrusión es del pterigoideo lateral.',
      evidencia: [T(MAS, 'Also performs retraction of the mandible (moving the jaw posteriorly).')],
    },
    {
      id: 'fun-pterigoideo-lateral', tipo: 'funcion', objetivo: 1, paso: 'pterigoideos', estructuras: ['pterigoideo-lateral'],
      enunciado: '¿Qué hace el pterigoideo lateral cuando actúan los dos a la vez?',
      correcta: 'Lleva la mandíbula hacia delante y baja el mentón',
      distractores: ['Cierra la boca con fuerza', 'Lleva la mandíbula hacia atrás', 'Eleva la lengua'],
      explicacion: 'Sus fibras horizontales tiran hacia delante; si actúa uno solo, la mandíbula va de lado a lado.',
      evidencia: [T(MAS, 'Bilateral action – protraction of the mandible and depression of the chin.')],
    },
    {
      id: 'rel-disco', tipo: 'relacion', objetivo: 2, paso: 'articulacion', estructuras: ['disco'],
      enunciado: '¿Qué tiene de particular la articulación temporomandibular?',
      correcta: 'Un disco separa sus superficies, que nunca se tocan, y la divide en dos cavidades',
      distractores: ['No tiene cápsula', 'Sus superficies tienen cartílago hialino', 'Es una articulación fibrosa sin movimiento'],
      explicacion: 'Las superficies, cubiertas de fibrocartílago, quedan separadas por el disco.',
      evidencia: [T(ATM, 'the articular surfaces of the bones never come into contact with each other – they are separated by an articular disk.')],
    },
    { id: 'id-disco', tipo: 'identificar', estructura: 'disco', objetivo: 2, paso: 'articulacion' },
    {
      id: 'fun-abrir', tipo: 'funcion', objetivo: 1, paso: 'ligamentos-movimientos', estructuras: ['digastrico'],
      enunciado: '¿Qué abre la boca normalmente?',
      correcta: 'Sobre todo la gravedad; el digástrico ayuda si hay resistencia',
      distractores: ['El masetero', 'El temporal', 'El pterigoideo medial'],
      explicacion: 'Los tres de la lista cierran la boca.',
      evidencia: [T(ATM, 'Depression is mostly caused by gravity. However, if there is resistance, the digastric, geniohyoid, and mylohyoid muscles assist.')],
    },
    { id: 'id-ligamento-lateral', tipo: 'identificar', estructura: 'ligamento-lateral', objetivo: 3, paso: 'ligamentos-movimientos' },
    {
      id: 'rel-luxacion', tipo: 'relacion', objetivo: 3, paso: 'luxacion', estructuras: ['ligamento-lateral', 'mandibula'],
      enunciado: '¿Hacia dónde se luxa normalmente la mandíbula?',
      correcta: 'Hacia delante, y la boca no puede cerrarse',
      distractores: ['Hacia atrás, hacia el oído', 'Hacia arriba, dentro del cráneo', 'Hacia dentro, bajo la lengua'],
      explicacion: 'La cabeza sale de la fosa y se va hacia delante; hacia atrás lo impiden el tubérculo posglenoideo y el ligamento lateral.',
      evidencia: [T(ATM, 'The head of the mandible ‘slips’ out of the mandibular fossa, and is pulled anteriorly.'), T(ATM, 'Posterior dislocations of the TMJ are possible, but very rare')],
    },
  ],
});
