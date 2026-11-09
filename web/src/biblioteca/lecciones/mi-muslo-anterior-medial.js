// Lección «Muslo: compartimentos anterior y medial». Formato y evidencias: ../formato.js.
import { leccion, T, GUIA } from '../formato.js';

const ANT = 'lower-limb/muscles/thigh/anterior-compartment';
const MED = 'lower-limb/muscles/thigh/medial-compartment';
const TRI = 'lower-limb/areas/femoral-triangle';
const FEM = 'lower-limb/nerves/femoral-nerve';
const OBT = 'lower-limb/nerves/obturator-nerve';
const musculo = (nombre, piezas, extra = {}) => ({ nombre, piezas, lado: 'bilateral', papel: 'nucleo', tipo: 'musculo', ...extra });
const contexto = (nombre, piezas, tipo) => ({ nombre, piezas, lado: 'bilateral', papel: 'contexto', tipo });

const CUADRICEPS = ['recto-femoral', 'vasto-lateral', 'vasto-intermedio', 'vasto-medial'];
const ANTERIOR = [...CUADRICEPS, 'sartorio', 'iliopsoas', 'pectineo'];
const MEDIAL = ['aductor-largo', 'aductor-corto', 'aductor-mayor', 'gracil', 'obturador-externo'];
const HUESOS = ['coxal', 'femur', 'rotula', 'tibia'];

export default leccion({
  id: 'mi-muslo-anterior-medial',
  version: 1,
  titulo: 'Muslo: compartimentos anterior y medial',
  resumen: 'Los músculos de la cara anterior del muslo (cuádriceps, sartorio, iliopsoas y pectíneo), que extienden la rodilla y flexionan la cadera, y los del compartimento medial (aductores, grácil y obturador externo). Sus inserciones, su acción, su nervio (femoral u obturador) y el triángulo femoral.',
  lugares: [['miembro-inferior', 'muslo']],
  sistemas: ['muscular', 'nervioso'],
  formato: 'estructuras',
  temas: ['musculos', 'compartimentos', 'movimientos', 'nervios'],
  nivel: 2,
  minutos: 18,
  requisitos: ['mi-huesos', 'fund-movimientos'],
  siguiente: ['mi-muslo-posterior', 'mi-rodilla', 'mi-cadera'],
  objetivos: [
    'Localizar los músculos del compartimento anterior (cuádriceps, sartorio, iliopsoas y pectíneo) y del medial (aductores, grácil y obturador externo).',
    'Relacionar los músculos del compartimento anterior con su inserción y explicar cuáles cruzan dos articulaciones.',
    'Explicar la acción de los músculos del compartimento medial y qué tiene de especial el aductor mayor.',
    'Asociar cada compartimento con su nervio: el femoral para el anterior y el obturador para el medial.',
    'Describir los límites y el contenido del triángulo femoral.',
  ],
  estructuras: {
    'recto-femoral': musculo('Músculo recto femoral', ['Rectus_femoris_muscle']),
    'vasto-lateral': musculo('Músculo vasto lateral', ['Vastus_lateralis_muscle'], { confusiones: ['Músculo tensor de la fascia lata'] }),
    'vasto-intermedio': musculo('Músculo vasto intermedio', ['Vastus_intermedius_muscle']),
    'vasto-medial': musculo('Músculo vasto medial', ['Vastus_medialis_muscle']),
    sartorio: musculo('Músculo sartorio', ['Sartorius_muscle'], { confusiones: ['Músculo grácil'] }),
    iliopsoas: musculo('Músculo iliopsoas (psoas mayor e ilíaco)', ['Psoas_major', 'Iliacus_muscle']),
    pectineo: musculo('Músculo pectíneo', ['Pectineus_muscle']),
    'aductor-largo': musculo('Músculo aductor largo', ['Adductor_longus']),
    'aductor-corto': musculo('Músculo aductor corto', ['Adductor_brevis']),
    'aductor-mayor': musculo('Músculo aductor mayor', ['Adductor_magnus']),
    gracil: musculo('Músculo grácil', ['Gracilis_muscle'], { confusiones: ['Músculo sartorio'] }),
    'obturador-externo': musculo('Músculo obturador externo', ['Obturator_externus']),
    'nervio-femoral': { nombre: 'Nervio femoral', piezas: ['Femoral_nerve'], lado: 'bilateral', papel: 'nucleo', tipo: 'nervio', confusiones: ['Nervio ciático', 'Nervio safeno'] },
    'nervio-obturador': { nombre: 'Nervio obturador', piezas: ['Obturator_nerve', 'Anterior_branch_of_obturator_nerve', 'Posterior_branch_of_obturator_nerve'], lado: 'bilateral', papel: 'nucleo', tipo: 'nervio', confusiones: ['Nervio ciático', 'Nervio safeno'] },
    'arteria-femoral': contexto('Arteria femoral', ['Femoral_artery'], 'arteria'),
    'vena-femoral': contexto('Vena femoral', ['Femoral_vein'], 'vena'),
    'ligamento-inguinal': contexto('Ligamento inguinal', ['Inguinal_ligament'], 'ligamento'),
    coxal: contexto('Hueso coxal', ['Hip_Bone'], 'hueso'),
    femur: contexto('Fémur', ['Femur'], 'hueso'),
    rotula: contexto('Rótula', ['Patella'], 'hueso'),
    tibia: contexto('Tibia', ['Tibia'], 'hueso'),
  },
  pasos: [
    {
      id: 'orientacion', tipo: 'orientacion', titulo: 'Los compartimentos anterior y medial del muslo',
      texto: [
        ['Los músculos del compartimento anterior del muslo sirven sobre todo para extender la pierna en la rodilla; los inerva el nervio femoral y los irriga la arteria femoral.', T(ANT, 'The muscles of the anterior compartment of the thigh are a group of muscles that (mostly) act to extend the lower limb at the knee joint.'), T(ANT, 'They are collectively innervated by the femoral nerve (L2-L4), and receive arterial supply from the femoral artery.')],
        ['Los del compartimento medial son los aductores de la cadera: cinco músculos, inervados por el nervio obturador.', T(MED, 'The muscles in the medial compartment of the thigh are collectively known as the hip adductors.'), T(MED, 'There are five muscles in this group; gracilis, obturator externus, adductor brevis, adductor longus and adductor magnus.'), T(MED, 'All the medial thigh muscles are innervated by the obturator nerve, which arises from the lumbar plexus.')],
        ['Mira el muslo de frente y después desde dentro.', GUIA],
      ],
      vista: { ver: [...ANTERIOR, ...MEDIAL], contexto: HUESOS, camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'De frente domina el cuádriceps; desde dentro se ven los aductores.', vistas: [{ nombre: 'De frente', camara: 'anterior' }, { nombre: 'Desde dentro', camara: 'medial' }, { nombre: 'Desde fuera', camara: 'lateral' }] },
    },
    {
      id: 'cuadriceps', tipo: 'explicacion', titulo: 'El cuádriceps',
      texto: [
        ['El cuádriceps femoral son cuatro músculos, los tres vastos y el recto femoral; forma el grueso de la cara anterior del muslo y es uno de los músculos más potentes del cuerpo.', T(ANT, 'The quadriceps femoris consists of four individual muscles – the three vastus muscles and the rectus femoris. It forms the main bulk of the anterior thigh, and is one of the most powerful muscles in the body.')],
        ['Los cuatro se insertan en la rótula por el tendón del cuádriceps, y la rótula se une a la tuberosidad tibial por el ligamento rotuliano.', T(ANT, 'The four muscles collectively insert onto the patella via the quadriceps tendon. The patella, in turn, is attached to the tibial tuberosity by the patella ligament.')],
        ['El vasto lateral nace en el trocánter mayor y la línea áspera; el intermedio, en las caras anterior y lateral del fémur; el medial, en la línea intertrocantérea y la línea áspera.', T(ANT, 'Proximal attachment: Originates from the greater trochanter and the lateral lip of linea aspera of the femur.'), T(ANT, 'Proximal attachment: Originates from the anterior and lateral surfaces of the femoral shaft.'), T(ANT, 'Proximal attachment: Originates from the intertrochanteric line and medial lip of the linea aspera of the femur.')],
        ['Los tres vastos extienden la rodilla y ayudan a estabilizar la rótula.', T(ANT, 'Actions: Extension of the knee joint. It has a secondary function of stabilising the patella.')],
      ],
      vista: { ver: CUADRICEPS, contexto: HUESOS, camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: CUADRICEPS, texto: 'Resalta cada cabeza: el vasto intermedio queda escondido debajo del recto femoral.' },
      comprobar: 'rel-insercion-cuadriceps',
    },
    {
      id: 'dos-articulaciones', tipo: 'funcion', titulo: 'Los que cruzan la cadera',
      texto: [
        ['El recto femoral nace en el coxal (en la espina ilíaca anteroinferior y por encima del acetábulo): es el único del cuádriceps que cruza la cadera y la rodilla, así que extiende la rodilla y flexiona la cadera.', T(ANT, 'One head originates from the anterior inferior iliac spine and other from the supra-acetabular groove (of the ilium).'), T(ANT, 'Actions: Extension of the knee joint and flexion of the hip joint (it is the only muscle of the quadriceps group to cross both the hip and knee joints).')],
        ['El sartorio es el músculo más largo del cuerpo: cruza el muslo en diagonal, de la espina ilíaca anterosuperior a la cara medial de la tibia.', T(ANT, 'The sartorius is the longest muscle in the body. It is long and thin, running across the thigh in a inferomedial direction.'), T(ANT, 'Originates from the anterior superior iliac spine, and attaches to the superior, medial surface of the tibia.')],
        ['En la cadera, el sartorio flexiona, abduce y rota hacia fuera; en la rodilla, flexiona.', T(ANT, 'At the hip joint, it is a flexor, abductor and lateral rotator. At the knee joint, it is also a flexor.')],
        ['El iliopsoas (psoas mayor e ilíaco) llega desde la pelvis por debajo del ligamento inguinal y se inserta en el trocánter menor: flexiona el muslo en la cadera, pero no extiende la rodilla.', T(ANT, 'These muscles arise in the pelvis and pass under the inguinal ligament into the anterior compartment of the thigh – where they form a common tendon.'), T(ANT, 'They insert together onto the lesser trochanter of the femur.'), T(ANT, 'Actions: Flexion of the thigh at the hip joint.'), T(ANT, 'Unlike many of the anterior thigh muscles, the iliopsoas does not perform extension of the leg at the knee joint.')],
      ],
      detalle: [
        ['El pectíneo, plano y cuadrangular, aduce y flexiona la cadera; lo inerva el nervio femoral y a veces también una rama del obturador.', T(ANT, 'The pectineus is a flat, quadrangular-shaped muscle which contributes to the floor of the femoral triangle.'), T(ANT, 'Actions: Adduction and flexion at the hip joint.'), T(ANT, 'Innervation: Femoral nerve. May also receive a branch from the obturator nerve.')],
      ],
      vista: { ver: ['recto-femoral', 'sartorio', 'iliopsoas'], contexto: ['coxal', 'femur', 'tibia', 'ligamento-inguinal', 'pectineo'], camara: 'anterolateral', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'sartorio', texto: 'Toca el músculo más largo del cuerpo, el que cruza el muslo en diagonal.' },
      comprobar: 'fun-recto-femoral',
    },
    {
      id: 'aductores', tipo: 'explicacion', titulo: 'Los aductores',
      texto: [
        ['El aductor mayor es el más grande del compartimento medial y tiene dos partes: una aductora y otra que actúa como un isquiotibial.', T(MED, 'The adductor magnus is the largest muscle in the medial compartment of the thigh.'), T(MED, 'It is comprised of two parts – an adductor component and a hamstring component.')],
        ['El aductor largo, ancho y plano, cubre en parte al corto y al mayor; los tres van del pubis y el isquion a la línea áspera del fémur.', T(MED, 'The adductor longus is a large, flat muscle. It partially covers the adductor brevis and magnus.'), T(MED, 'It has a broad distal attachment along the linea aspera of the femur.'), T(MED, 'Originates from the body of pubis and inferior pubic rami. Attaches to the linea aspera on the posterior surface of the femur'), T(MED, 'Adductor – Originates from the inferior rami of the pubis and the rami of ischium, attaches to the linea aspera of the femur.')],
        ['El grácil es el más superficial y medial: cruza la cadera y la rodilla, aduce el muslo y flexiona la rodilla.', T(MED, 'The gracilis is the most superficial and medial of the muscles in this compartment. It crosses at both the hip and knee joints.'), T(MED, 'Actions: Adduction of the thigh at the hip and flexion of the leg at the knee.')],
        ['El obturador externo, pequeño y alto, pasa por debajo del cuello del fémur; aduce el muslo y lo rota hacia fuera.', T(MED, 'The obturator externus is one of the smaller muscles of the medial thigh and it is located superiorly within the compartment.'), T(MED, 'It passes under the neck of femur and attaches onto the posterior aspect of the greater trochanter.'), T(MED, 'Actions: Adduction and lateral rotation of the thigh.')],
      ],
      vista: { ver: MEDIAL, contexto: ['coxal', 'femur', 'tibia', 'pectineo'], camara: 'medial', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: MEDIAL, texto: 'Resalta cada aductor: el largo por delante, el corto debajo y el mayor, el más grande, detrás.' },
      comprobar: 'fun-aductor-mayor',
    },
    {
      id: 'nervios', tipo: 'relaciones', titulo: 'Dos compartimentos, dos nervios',
      texto: [
        ['El nervio femoral es la rama más grande del plexo lumbar y sale de las raíces L2 a L4.', T(FEM, 'The femoral nerve is the largest branch of the lumbar plexus.'), T(FEM, 'It is derived from the anterior rami of nerve roots L2, L3 and L4.')],
        ['Inerva los músculos anteriores que flexionan la cadera (pectíneo, ilíaco y sartorio) y los que extienden la rodilla (el cuádriceps).', T(FEM, 'Motor functions: Innervates the anterior thigh muscles that flex the hip joint (pectineus, iliacus, sartorius) and extend the knee (quadriceps femoris: rectus femoris, vastus lateralis, vastus medialis and vastus intermedius),')],
        ['El nervio obturador, también del plexo lumbar, inerva los cinco músculos del compartimento medial; el aductor corto separa sus ramas anterior y posterior.', T(OBT, 'Motor functions: Innervates the muscles of the medial compartment of the thigh (obturator externus, adductor longus, adductor brevis, adductor magnus and gracilis).'), T(MED, 'It separates the anterior and posterior branches of the obturator nerve and is an important anatomical landmark within the medial thigh.')],
        ['La excepción es la parte isquiotibial del aductor mayor, que la inerva la rama tibial del nervio ciático.', T(MED, 'Hamstring part – Tibial component of the sciatic nerve (L4-S3).')],
      ],
      vista: { ver: ['nervio-femoral', 'nervio-obturador'], contexto: ['coxal', 'femur'], fantasma: [...CUADRICEPS, ...MEDIAL, 'sartorio'], camara: 'anterior', lado: 'R' },
      comprobar: 'rel-obturador',
    },
    {
      id: 'triangulo', tipo: 'relaciones', titulo: 'El triángulo femoral',
      texto: [
        ['El triángulo femoral es una zona en forma de cuña en la parte alta y medial de la cara anterior del muslo; por él entran y salen estructuras del muslo.', T(TRI, 'The femoral triangle is a wedge-shaped area located within the superomedial aspect of the anterior thigh.'), T(TRI, 'It acts as a conduit for structures entering and leaving the anterior thigh.')],
        ['Lo limitan el ligamento inguinal por arriba, el borde medial del sartorio por fuera y el borde medial del aductor largo por dentro; su suelo lo forman el pectíneo, el iliopsoas y el aductor largo.', T(TRI, 'Superior border – inguinal ligament'), T(TRI, 'Lateral border – medial border of the sartorius muscle.'), T(TRI, 'Medial border – medial border of the adductor longus muscle.'), T(TRI, 'Floor – pectineus, iliopsoas, and adductor longus muscles.')],
        ['Contiene, de fuera adentro, el nervio femoral, la arteria femoral, la vena femoral y el conducto femoral.', T(TRI, 'Its contents (lateral to medial) are:'), T(TRI, 'Femoral nerve – innervates the anterior compartment of the thigh'), T(TRI, 'Femoral artery – responsible for the majority of the arterial supply to the lower limb.'), T(TRI, 'Femoral vein – the great saphenous vein drains into the femoral vein within the triangle.'), T(TRI, 'Femoral canal – contains deep lymph nodes and vessels.')],
      ],
      vista: { ver: ['nervio-femoral', 'arteria-femoral', 'vena-femoral'], contexto: ['sartorio', 'aductor-largo', 'pectineo', 'iliopsoas', 'ligamento-inguinal', 'coxal', 'femur'], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'nervio-femoral', texto: 'Toca la estructura más lateral del triángulo femoral.' },
      comprobar: 'rel-limite',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['Compartimento anterior: cuádriceps, sartorio, iliopsoas y pectíneo; extienden la rodilla o flexionan la cadera y los inerva el nervio femoral.', T(ANT, '(mostly) act to extend the lower limb at the knee joint'), T(FEM, 'Innervates the anterior thigh muscles that flex the hip joint (pectineus, iliacus, sartorius) and extend the knee')],
        ['El cuádriceps se inserta en la rótula y, por el ligamento rotuliano, en la tuberosidad tibial; el recto femoral cruza además la cadera.', T(ANT, 'The four muscles collectively insert onto the patella via the quadriceps tendon.'), T(ANT, 'it is the only muscle of the quadriceps group to cross both the hip and knee joints')],
        ['Compartimento medial: aductores largo, corto y mayor, grácil y obturador externo; aducen el muslo y los inerva el nervio obturador.', T(MED, 'There are five muscles in this group; gracilis, obturator externus, adductor brevis, adductor longus and adductor magnus.'), T(MED, 'All the medial thigh muscles are innervated by the obturator nerve')],
        ['En el triángulo femoral, bajo el ligamento inguinal, están de fuera adentro el nervio, la arteria y la vena femorales.', T(TRI, 'Superior border – inguinal ligament'), T(TRI, 'Its contents (lateral to medial) are:')],
      ],
    },
  ],
  preguntas: [
    { id: 'id-recto-femoral', tipo: 'identificar', estructura: 'recto-femoral', objetivo: 0, paso: 'cuadriceps' },
    { id: 'id-vasto-lateral', tipo: 'identificar', estructura: 'vasto-lateral', objetivo: 0, paso: 'cuadriceps' },
    { id: 'id-vasto-medial', tipo: 'identificar', estructura: 'vasto-medial', objetivo: 0, paso: 'cuadriceps' },
    { id: 'id-sartorio', tipo: 'identificar', estructura: 'sartorio', objetivo: 0, paso: 'dos-articulaciones' },
    { id: 'id-iliopsoas', tipo: 'identificar', estructura: 'iliopsoas', objetivo: 0, paso: 'dos-articulaciones' },
    { id: 'id-aductor-largo', tipo: 'identificar', estructura: 'aductor-largo', objetivo: 0, paso: 'aductores' },
    { id: 'id-aductor-mayor', tipo: 'identificar', estructura: 'aductor-mayor', objetivo: 0, paso: 'aductores' },
    { id: 'id-gracil', tipo: 'identificar', estructura: 'gracil', objetivo: 0, paso: 'aductores' },
    { id: 'loc-gracil', tipo: 'localizar', estructura: 'gracil', candidatas: ['sartorio', 'aductor-largo'], objetivo: 0, paso: 'aductores' },
    {
      id: 'rel-insercion-cuadriceps', tipo: 'relacion', objetivo: 1, paso: 'cuadriceps', estructuras: CUADRICEPS,
      enunciado: '¿Dónde se insertan los cuatro músculos del cuádriceps?',
      correcta: 'En la rótula, por el tendón del cuádriceps, y a través de ella en la tuberosidad tibial',
      distractores: ['En la línea áspera del fémur', 'En el trocánter menor', 'En la cara medial de la tibia, junto al sartorio'],
      explicacion: 'Los cuatro confluyen en el tendón del cuádriceps, que llega a la rótula; el ligamento rotuliano la une a la tuberosidad tibial.',
      evidencia: [T(ANT, 'The four muscles collectively insert onto the patella via the quadriceps tendon. The patella, in turn, is attached to the tibial tuberosity by the patella ligament.')],
    },
    {
      id: 'fun-recto-femoral', tipo: 'funcion', objetivo: 1, paso: 'dos-articulaciones', estructuras: ['recto-femoral'],
      enunciado: '¿Por qué el recto femoral, además de extender la rodilla, flexiona la cadera?',
      correcta: 'Porque es el único del cuádriceps que nace en el coxal y cruza la cadera',
      distractores: ['Porque se inserta en el trocánter menor', 'Porque lo inerva el nervio obturador', 'Porque nace en la línea áspera del fémur'],
      explicacion: 'Los vastos nacen en el fémur y solo cruzan la rodilla; el recto femoral nace en el ilion y cruza también la cadera.',
      evidencia: [T(ANT, 'it is the only muscle of the quadriceps group to cross both the hip and knee joints')],
    },
    {
      id: 'rel-sartorio', tipo: 'relacion', objetivo: 1, paso: 'dos-articulaciones', estructuras: ['sartorio'],
      enunciado: '¿Cuál es el músculo más largo del cuerpo?',
      correcta: 'El sartorio',
      distractores: ['El recto femoral', 'El grácil', 'El vasto lateral'],
      explicacion: 'El sartorio va de la espina ilíaca anterosuperior a la cara medial de la tibia, cruzando el muslo en diagonal.',
      evidencia: [T(ANT, 'The sartorius is the longest muscle in the body.')],
    },
    {
      id: 'comp-vastos', tipo: 'comparacion', objetivo: 1, paso: 'cuadriceps', estructuras: ['vasto-medial', 'vasto-lateral', 'vasto-intermedio'],
      enunciado: '¿Qué músculo del cuádriceps nace en la línea intertrocantérea y en el labio medial de la línea áspera?',
      correcta: 'El vasto medial',
      distractores: ['El vasto lateral', 'El vasto intermedio', 'El recto femoral'],
      explicacion: 'El vasto lateral nace en el trocánter mayor y el labio lateral; el intermedio, en la diáfisis; el recto femoral, en el coxal.',
      evidencia: [T(ANT, 'Proximal attachment: Originates from the intertrochanteric line and medial lip of the linea aspera of the femur.')],
    },
    {
      id: 'fun-aductor-mayor', tipo: 'funcion', objetivo: 2, paso: 'aductores', estructuras: ['aductor-mayor'],
      enunciado: '¿Qué tiene de particular el aductor mayor?',
      correcta: 'Tiene una parte aductora, inervada por el obturador, y otra isquiotibial, inervada por la rama tibial del ciático',
      distractores: ['Es el único aductor que inerva el nervio femoral', 'Se inserta en la rótula', 'Es el más superficial y medial del muslo'],
      explicacion: 'El aductor mayor, el más grande del compartimento, tiene dos partes con nervios distintos; el más superficial y medial es el grácil.',
      evidencia: [T(MED, 'It is comprised of two parts – an adductor component and a hamstring component.'), T(MED, 'Hamstring part – Tibial component of the sciatic nerve (L4-S3).')],
    },
    {
      id: 'fun-gracil', tipo: 'funcion', objetivo: 2, paso: 'aductores', estructuras: ['gracil'],
      enunciado: '¿Qué hace el músculo grácil?',
      correcta: 'Aduce el muslo y flexiona la rodilla',
      distractores: ['Extiende la rodilla', 'Flexiona la cadera y extiende la rodilla', 'Abduce el muslo y lo rota hacia fuera'],
      explicacion: 'El grácil cruza la cadera y la rodilla: aduce el muslo y flexiona la pierna.',
      evidencia: [T(MED, 'Actions: Adduction of the thigh at the hip and flexion of the leg at the knee.')],
    },
    { id: 'id-nervio-femoral', tipo: 'identificar', estructura: 'nervio-femoral', objetivo: 3, paso: 'nervios' },
    {
      id: 'rel-obturador', tipo: 'relacion', objetivo: 3, paso: 'nervios', estructuras: MEDIAL,
      enunciado: '¿Qué nervio inerva los músculos del compartimento medial del muslo?',
      correcta: 'El nervio obturador',
      distractores: ['El nervio femoral', 'El nervio ciático', 'El nervio safeno'],
      explicacion: 'El obturador inerva los cinco músculos mediales; el femoral, los anteriores.',
      evidencia: [T(MED, 'All the medial thigh muscles are innervated by the obturator nerve, which arises from the lumbar plexus.')],
    },
    {
      id: 'rel-femoral', tipo: 'relacion', objetivo: 3, paso: 'nervios', estructuras: CUADRICEPS,
      enunciado: '¿Qué nervio inerva el cuádriceps?',
      correcta: 'El nervio femoral',
      distractores: ['El nervio obturador', 'El nervio ciático', 'El nervio glúteo inferior'],
      explicacion: 'El femoral (L2-L4), la rama mayor del plexo lumbar, inerva los extensores de la rodilla.',
      evidencia: [T(FEM, 'and extend the knee (quadriceps femoris: rectus femoris, vastus lateralis, vastus medialis and vastus intermedius)')],
    },
    {
      id: 'seq-triangulo', tipo: 'secuencia', objetivo: 4, paso: 'triangulo', estructuras: ['nervio-femoral', 'arteria-femoral', 'vena-femoral'],
      enunciado: 'Ordena el contenido del triángulo femoral de fuera adentro:',
      orden: ['Nervio femoral', 'Arteria femoral', 'Vena femoral', 'Conducto femoral'],
      explicacion: 'De lateral a medial: nervio, arteria, vena y conducto femoral (con ganglios linfáticos).',
      evidencia: [T(TRI, 'Its contents (lateral to medial) are:'), T(TRI, 'Femoral canal – contains deep lymph nodes and vessels.')],
    },
    {
      id: 'rel-limite', tipo: 'relacion', objetivo: 4, paso: 'triangulo', estructuras: ['sartorio', 'aductor-largo'],
      enunciado: '¿Qué forma el límite superior del triángulo femoral?',
      correcta: 'El ligamento inguinal',
      distractores: ['El sartorio', 'El aductor largo', 'El pectíneo'],
      explicacion: 'Arriba, el ligamento inguinal; por fuera, el sartorio; por dentro, el aductor largo; el pectíneo forma parte del suelo.',
      evidencia: [T(TRI, 'Superior border – inguinal ligament')],
    },
  ],
});
