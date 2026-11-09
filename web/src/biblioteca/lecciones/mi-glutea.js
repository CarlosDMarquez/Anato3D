// Lección «Región glútea». Formato y evidencias: ../formato.js.
import { leccion, W, T, GUIA } from '../formato.js';

const GLU = 'lower-limb/muscles/gluteal-region';
const CIA = 'lower-limb/nerves/sciatic-nerve';
const SAC = 'lower-limb/nerves/sacral-plexus';
const musculo = (nombre, piezas) => ({ nombre, piezas, lado: 'bilateral', papel: 'nucleo', tipo: 'musculo' });
const nucleo = (nombre, piezas, tipo) => ({ nombre, piezas, lado: 'bilateral', papel: 'nucleo', tipo });
const contexto = (nombre, piezas, tipo, lado = 'bilateral') => ({ nombre, piezas, lado, papel: 'contexto', tipo });

const SUPERFICIALES = ['gluteo-mayor', 'gluteo-medio', 'gluteo-menor', 'tensor'];
const PROFUNDOS = ['piriforme', 'gemelo-superior', 'obturador-interno', 'gemelo-inferior', 'cuadrado-femoral'];
const HUESOS = ['coxal', 'sacro', 'femur'];

export default leccion({
  id: 'mi-glutea',
  version: 1,
  titulo: 'Región glútea',
  resumen: 'Los músculos de la nalga en dos grupos —los glúteos y el tensor de la fascia lata, que abducen y extienden, y los rotadores laterales profundos—, el piriforme como referencia para los vasos y nervios que salen de la pelvis, el nervio ciático y el signo de Trendelenburg.',
  lugares: [['miembro-inferior', 'glutea']],
  sistemas: ['muscular', 'nervioso'],
  formato: 'estructuras',
  temas: ['musculos', 'movimientos', 'nervios'],
  nivel: 2,
  minutos: 16,
  requisitos: ['pel-pelvis-osea', 'mi-cadera'],
  siguiente: ['mi-muslo-posterior', 'mi-nervios'],
  objetivos: [
    'Distinguir los dos grupos de músculos glúteos: los superficiales, que abducen y extienden, y los profundos, rotadores laterales.',
    'Localizar los glúteos mayor, medio y menor y el tensor de la fascia lata, y describir su acción.',
    'Identificar los rotadores laterales profundos, del piriforme al cuadrado femoral.',
    'Usar el piriforme como referencia para situar los vasos y nervios glúteos y el nervio ciático.',
    'Explicar el signo de Trendelenburg a partir de la función del glúteo medio y el menor.',
  ],
  estructuras: {
    'gluteo-mayor': musculo('Músculo glúteo mayor', ['Gluteus_maximus_muscle']),
    'gluteo-medio': musculo('Músculo glúteo medio', ['Gluteus_medius_muscle']),
    'gluteo-menor': musculo('Músculo glúteo menor', ['Gluteus_minimus_muscle']),
    tensor: musculo('Músculo tensor de la fascia lata', ['Tensor_fasciae_latae']),
    piriforme: musculo('Músculo piriforme', ['Piriformis_muscle']),
    'gemelo-superior': musculo('Músculo gemelo superior', ['Superior_gemellus_muscle']),
    'obturador-interno': musculo('Músculo obturador interno', ['Obturator_internus']),
    'gemelo-inferior': musculo('Músculo gemelo inferior', ['Inferior_gemellus_muscle']),
    'cuadrado-femoral': musculo('Músculo cuadrado femoral', ['Quadratus_femoris_muscle']),
    'nervio-gluteo-superior': nucleo('Nervio glúteo superior', ['Superior_gluteal_nerve'], 'nervio'),
    ciatico: nucleo('Nervio ciático', ['Sciatic_nerve'], 'nervio'),
    'arteria-glutea-superior': nucleo('Arteria glútea superior', ['Superior_gluteal_artery'], 'arteria'),
    'arteria-glutea-inferior': nucleo('Arteria glútea inferior', ['Inferior_gluteal_artery'], 'arteria'),
    'arteria-pudenda': contexto('Arteria pudenda interna', ['Internal_pudendal_artery'], 'arteria'),
    'tracto-iliotibial': contexto('Tracto iliotibial', ['Iliotibial_tract'], 'tendon'),
    sacrotuberoso: contexto('Ligamento sacrotuberoso', ['Sacrotuberous_ligament'], 'ligamento'),
    coxal: contexto('Hueso coxal', ['Hip_Bone'], 'hueso'),
    sacro: contexto('Sacro', ['Sacrum'], 'hueso', 'impar'),
    femur: contexto('Fémur', ['Femur'], 'hueso'),
  },
  pasos: [
    {
      id: 'orientacion', tipo: 'orientacion', titulo: 'La región glútea',
      texto: [
        ['La región glútea está detrás de la cintura pélvica, en el extremo superior del fémur; sus músculos mueven el miembro inferior en la cadera.', T(GLU, 'The gluteal region is an anatomical area located posteriorly to the pelvic girdle, at the proximal end of the femur. The muscles in this region move the lower limb at the hip joint.')],
        ['Se dividen en dos grupos: los superficiales (los tres glúteos y el tensor de la fascia lata), que abducen y extienden, y los profundos, más pequeños, que rotan el muslo hacia fuera.', T(GLU, 'Superficial abductors and extenders – group of large muscles that abduct and extend the femur. Includes the gluteus maximus, gluteus medius, gluteus minimus and tensor fascia lata.'), T(GLU, 'Deep lateral rotators – group of smaller muscles that mainly act to laterally rotate the femur.')],
        ['Mírala por detrás y por fuera.', GUIA],
      ],
      vista: { ver: SUPERFICIALES, contexto: [...PROFUNDOS, ...HUESOS], camara: 'posterior', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'Recorre la nalga.', vistas: [{ nombre: 'Por detrás', camara: 'posterior' }, { nombre: 'Por fuera', camara: 'lateral' }, { nombre: 'Desde atrás y fuera', camara: 'posterolateral' }] },
      comprobar: 'comp-grupos',
    },
    {
      id: 'gluteo-mayor', tipo: 'exploracion', titulo: 'El glúteo mayor',
      texto: [
        ['El glúteo mayor es el más grande y el más superficial de los glúteos, y da forma a la nalga.', T(GLU, 'The gluteus maximus is the largest of the gluteal muscles. It is also the most superficial, producing the shape of the buttocks.')],
        ['Nace del ilion, el sacro y el cóccix; sus fibras bajan en diagonal hasta el tracto iliotibial y la tuberosidad glútea del fémur.', T(GLU, 'Originates from the gluteal (posterior) surface of the ilium, sacrum and coccyx. The fibres slope across the buttock at a 45 degree angle and insert onto the iliotibial tract and gluteal tuberosity of the femur.')],
        ['Es el principal extensor del muslo y ayuda a rotarlo hacia fuera, pero solo actúa cuando hace falta fuerza, como al correr o trepar; lo inerva el nervio glúteo inferior.', T(GLU, 'It is the main extensor of the thigh, and assists with lateral rotation. However, it is only used when force is required, such as running or climbing.'), T(GLU, 'Innervation: Inferior gluteal nerve.')],
      ],
      detalle: [
        ['Es el músculo más grande del cuerpo humano.', W('Gluteus_maximus', 'It is the single largest muscle in the human body.')],
      ],
      vista: { ver: ['gluteo-mayor'], contexto: ['tracto-iliotibial', ...HUESOS], camara: 'posterior', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'gluteo-mayor', texto: 'Toca el músculo que da forma a la nalga.' },
      comprobar: 'fun-gluteo-mayor',
    },
    {
      id: 'medio-menor', tipo: 'exploracion', titulo: 'Glúteo medio, glúteo menor y tensor',
      texto: [
        ['El glúteo medio, en abanico, está entre el mayor y el menor; va del ilion a la cara lateral del trocánter mayor.', T(GLU, 'The gluteus medius muscle is fan-shaped and lies between to the gluteus maximus and the minimus.'), T(GLU, 'Originates from the gluteal surface of the ilium and inserts into the lateral surface of the greater trochanter.')],
        ['El glúteo menor, el más profundo y pequeño, llega a la cara anterior del trocánter mayor; los dos abducen y rotan hacia dentro el miembro, y sujetan la pelvis al andar.', T(GLU, 'The gluteus minimus is the deepest and smallest of the superficial gluteal muscles.'), T(GLU, 'inserting to the anterior side of the greater trochanter.'), T(GLU, 'Abduction and medial rotation of the lower limb. It stabilises the pelvis during locomotion')],
        ['El tensor de la fascia lata va de la espina ilíaca anterosuperior al tracto iliotibial y los ayuda; a los tres los inerva el nervio glúteo superior.', T(GLU, 'It inserts into the iliotibial tract, which itself attaches to the lateral condyle of the tibia.'), T(GLU, 'Assists the gluteus medius and minimus in abduction and medial rotation of the lower limb.'), T(GLU, 'Innervation: Superior gluteal nerve.')],
      ],
      vista: { ver: ['gluteo-medio', 'gluteo-menor', 'tensor'], contexto: ['tracto-iliotibial', ...HUESOS], fantasma: ['gluteo-mayor'], camara: 'posterolateral', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['gluteo-medio', 'gluteo-menor', 'tensor'], texto: 'Alterna los tres: el medio cubre al menor; el tensor queda delante, hacia la espina ilíaca.' },
      comprobar: 'fun-medio',
    },
    {
      id: 'profundos', tipo: 'exploracion', titulo: 'Los rotadores laterales profundos',
      texto: [
        ['Debajo del glúteo menor hay músculos más pequeños que rotan el miembro hacia fuera y estabilizan la cadera.', T(GLU, 'The deep gluteal muscles are a set of smaller muscles, located underneath the gluteus minimus. The general action of these muscles is to laterally rotate the lower limb. They also stabilise the hip joint by')],
        ['De arriba abajo: el piriforme, el más alto; los dos gemelos, separados por el tendón del obturador interno, y el cuadrado femoral, el más bajo.', T(GLU, 'It is the most superior of the deep muscles.'), T(GLU, 'They are separated by the obturator internus tendon.'), T(GLU, 'It is the most inferior of the deep gluteal muscles, located below the gemelli and obturator internus.')],
        ['Todos acaban en el fémur, casi todos en el trocánter mayor.', T(GLU, 'to insert onto the greater trochanter of the femur.'), T(GLU, 'They both attach to the greater trochanter of the femur.'), T(GLU, 'attaches to the quadrate tuberosity on the intertrochanteric crest.')],
      ],
      vista: { ver: PROFUNDOS, contexto: ['sacrotuberoso', ...HUESOS], camara: 'posterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['piriforme', 'obturador-interno', 'cuadrado-femoral'], texto: 'Alterna de arriba abajo: el piriforme, el obturador interno entre los dos gemelos y el cuadrado femoral.' },
      comprobar: 'rel-gemelos',
    },
    {
      id: 'piriforme', tipo: 'relaciones', titulo: 'El piriforme, la referencia',
      texto: [
        ['El piriforme sale de la pelvis por el agujero ciático mayor y divide la región en una parte superior y otra inferior.', T(GLU, 'As the muscle travels through the greater sciatic foramen, it effectively divides the gluteal region into an inferior and superior part.')],
        ['Por encima salen el nervio y los vasos glúteos superiores; por debajo, los inferiores.', T(GLU, 'The superior gluteal nerve and vessels emerge into the gluteal region superiorly to the piriformis (and vice versa for the inferior gluteal nerve).')],
        ['El nervio ciático entra justo por debajo del piriforme, como una banda plana de unos 2 cm.', T(GLU, 'The sciatic nerve enters the gluteal region directly inferior to the piriformis, and is visible as a flat band, approximately 2cm wide.')],
      ],
      detalle: [
        ['En torno al 80 % de las personas el ciático pasa por debajo del piriforme; en un 17 %, el músculo lo atraviesa en parte o entero.', W('Piriformis_muscle', 'In around 80% of the population, the sciatic nerve travels below the piriformis muscle.'), W('Piriformis_muscle', 'In 17% of people, the piriformis muscle is pierced by parts or all of the sciatic nerve.')],
        ['Las inyecciones en la nalga se ponen en el cuadrante superolateral, lejos del ciático.', T(CIA, 'intramuscular injections are given only in the upper lateral quadrant of the gluteal region.')],
      ],
      vista: { ver: ['piriforme', 'nervio-gluteo-superior', 'arteria-glutea-superior', 'arteria-glutea-inferior', 'ciatico'], contexto: ['arteria-pudenda', 'sacrotuberoso', ...HUESOS], camara: 'posterior', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'ciatico', texto: 'Toca el nervio que sale justo por debajo del piriforme.' },
      comprobar: 'rel-encima',
    },
    {
      id: 'trendelenburg', tipo: 'funcion', titulo: 'Sostener la pelvis al andar',
      texto: [
        ['De pie, al levantar una pierna, el glúteo medio y el menor del otro lado se contraen e impiden que la pelvis caiga hacia la pierna levantada.', T(GLU, 'In the standing position, the gluteus minimus and medius contract when the contralateral leg is raised, preventing the pelvis from dropping on that side.')],
        ['Si se lesiona el nervio glúteo superior, se paralizan y la pelvis cae del lado que no apoya: es el signo de Trendelenburg.', T(GLU, 'If the superior gluteal nerve is damaged, the previously described muscles are paralysed – and the pelvis becomes unsteady.'), T(GLU, 'In a positive sign, pelvic drop will occur on the unsupported leg.')],
        ['Por ejemplo, con los glúteos izquierdos débiles, al apoyarse en la pierna izquierda cae el lado derecho de la pelvis.', T(GLU, 'if the left gluteal muscles are weak, the right side of the pelvis will drop when the patient stands on their left leg (and the right leg is unsupported).')],
      ],
      vista: { ver: ['gluteo-medio', 'gluteo-menor', 'nervio-gluteo-superior'], contexto: HUESOS, camara: 'posterior', lado: 'R' },
      comprobar: 'rel-trendelenburg',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['Superficiales: el glúteo mayor extiende con fuerza; el medio, el menor y el tensor abducen y rotan hacia dentro.', T(GLU, 'It is the main extensor of the thigh'), T(GLU, 'Abduction and medial rotation of the lower limb.')],
        ['Profundos: piriforme, gemelos, obturador interno y cuadrado femoral rotan hacia fuera.', T(GLU, 'Deep lateral rotators – group of smaller muscles that mainly act to laterally rotate the femur.')],
        ['El piriforme separa lo superior (nervio y vasos glúteos superiores) de lo inferior (glúteos inferiores y ciático).', T(GLU, 'The superior gluteal nerve and vessels emerge into the gluteal region superiorly to the piriformis'), T(GLU, 'The sciatic nerve enters the gluteal region directly inferior to the piriformis')],
      ],
    },
  ],
  preguntas: [
    {
      id: 'comp-grupos', tipo: 'comparacion', objetivo: 0, paso: 'orientacion', estructuras: PROFUNDOS,
      enunciado: '¿Qué hacen sobre todo los músculos glúteos profundos?',
      correcta: 'Rotar el muslo hacia fuera',
      distractores: ['Extender el muslo con fuerza', 'Flexionar la rodilla', 'Aducir el muslo'],
      explicacion: 'Los profundos son rotadores laterales; los superficiales abducen y extienden.',
      evidencia: [T(GLU, 'Deep lateral rotators – group of smaller muscles that mainly act to laterally rotate the femur.')],
    },
    {
      id: 'comp-superficiales', tipo: 'comparacion', objetivo: 0, paso: 'orientacion', estructuras: SUPERFICIALES,
      enunciado: '¿Qué músculos forman el grupo superficial de la región glútea?',
      correcta: 'Los tres glúteos y el tensor de la fascia lata',
      distractores: ['El piriforme y los gemelos', 'El obturador interno y el cuadrado femoral', 'Los isquiotibiales'],
      explicacion: 'Los superficiales son grandes y abducen y extienden; el piriforme, los gemelos, el obturador interno y el cuadrado femoral son los profundos.',
      evidencia: [T(GLU, 'Includes the gluteus maximus, gluteus medius, gluteus minimus and tensor fascia lata.')],
    },
    { id: 'id-gluteo-mayor', tipo: 'identificar', estructura: 'gluteo-mayor', objetivo: 1, paso: 'gluteo-mayor' },
    { id: 'id-gluteo-medio', tipo: 'identificar', estructura: 'gluteo-medio', objetivo: 1, paso: 'medio-menor' },
    { id: 'id-tensor', tipo: 'identificar', estructura: 'tensor', objetivo: 1, paso: 'medio-menor' },
    {
      id: 'fun-gluteo-mayor', tipo: 'funcion', objetivo: 1, paso: 'gluteo-mayor', estructuras: ['gluteo-mayor'],
      enunciado: '¿Cuándo actúa sobre todo el glúteo mayor?',
      correcta: 'Cuando hace falta fuerza, como al correr o trepar',
      distractores: ['Al estar de pie quieto', 'Al flexionar la cadera para subir la pierna', 'Al rotar la pierna hacia dentro'],
      explicacion: 'Es el principal extensor del muslo, pero solo entra en juego cuando se necesita fuerza.',
      evidencia: [T(GLU, 'However, it is only used when force is required, such as running or climbing.')],
    },
    {
      id: 'fun-medio', tipo: 'funcion', objetivo: 1, paso: 'medio-menor', estructuras: ['gluteo-medio', 'gluteo-menor'],
      enunciado: '¿Qué hacen el glúteo medio y el menor?',
      correcta: 'Abducen y rotan hacia dentro el miembro, y sujetan la pelvis al andar',
      distractores: ['Extienden el muslo con fuerza', 'Rotan el muslo hacia fuera', 'Flexionan la rodilla'],
      explicacion: 'Extender con fuerza es del glúteo mayor; rotar hacia fuera, de los profundos.',
      evidencia: [T(GLU, 'Abduction and medial rotation of the lower limb. It stabilises the pelvis during locomotion')],
    },
    { id: 'id-piriforme', tipo: 'identificar', estructura: 'piriforme', objetivo: 2, paso: 'profundos' },
    { id: 'id-obturador-interno', tipo: 'identificar', estructura: 'obturador-interno', objetivo: 2, paso: 'profundos' },
    { id: 'id-cuadrado-femoral', tipo: 'identificar', estructura: 'cuadrado-femoral', objetivo: 2, paso: 'profundos' },
    {
      id: 'rel-gemelos', tipo: 'relacion', objetivo: 2, paso: 'profundos', estructuras: ['gemelo-superior', 'gemelo-inferior', 'obturador-interno'],
      enunciado: '¿Qué separa el gemelo superior del inferior?',
      correcta: 'El tendón del obturador interno',
      distractores: ['El piriforme', 'El nervio ciático', 'El cuadrado femoral'],
      explicacion: 'Los dos gemelos están a los lados del tendón del obturador interno; el piriforme queda por encima y el cuadrado femoral por debajo.',
      evidencia: [T(GLU, 'They are separated by the obturator internus tendon.')],
    },
    {
      id: 'rel-encima', tipo: 'relacion', objetivo: 3, paso: 'piriforme', estructuras: ['piriforme', 'nervio-gluteo-superior', 'arteria-glutea-superior'],
      enunciado: '¿Qué sale de la pelvis por encima del piriforme?',
      correcta: 'El nervio y los vasos glúteos superiores',
      distractores: ['El nervio ciático', 'El nervio y los vasos glúteos inferiores', 'La arteria pudenda interna'],
      explicacion: 'Por encima, los glúteos superiores; por debajo, los inferiores y el ciático.',
      evidencia: [T(GLU, 'The superior gluteal nerve and vessels emerge into the gluteal region superiorly to the piriformis (and vice versa for the inferior gluteal nerve).')],
    },
    { id: 'loc-ciatico', tipo: 'localizar', estructura: 'ciatico', candidatas: ['nervio-gluteo-superior', 'piriforme'], objetivo: 3, paso: 'piriforme' },
    {
      id: 'rel-inyeccion', tipo: 'relacion', objetivo: 3, paso: 'piriforme', estructuras: ['ciatico'],
      enunciado: '¿En qué cuadrante de la nalga se ponen las inyecciones intramusculares para no dañar el ciático?',
      correcta: 'En el superolateral',
      distractores: ['En el inferomedial', 'En el inferolateral', 'En el superomedial'],
      explicacion: 'El ciático pasa por el cuadrante inferomedial; el superolateral queda lejos de él.',
      evidencia: [T(CIA, 'The sciatic nerve passes through the lower medial quadrant. To avoid damaging the sciatic nerve therefore, intramuscular injections are given only in the upper lateral quadrant of the gluteal region.')],
    },
    {
      id: 'rel-trendelenburg', tipo: 'relacion', objetivo: 4, paso: 'trendelenburg', estructuras: ['gluteo-medio', 'gluteo-menor'],
      enunciado: 'Con los glúteos medio y menor izquierdos débiles, la persona se apoya solo en la pierna izquierda. ¿Qué ocurre?',
      correcta: 'La pelvis cae del lado derecho, el que no apoya',
      distractores: ['La pelvis cae del lado izquierdo', 'La rodilla izquierda se dobla', 'Nada, si el glúteo mayor está sano'],
      explicacion: 'Los glúteos del lado que apoya sostienen la pelvis; si fallan, cae el lado contrario (signo de Trendelenburg).',
      evidencia: [T(GLU, 'if the left gluteal muscles are weak, the right side of the pelvis will drop when the patient stands on their left leg (and the right leg is unsupported).')],
    },
    {
      id: 'fun-nervio-gluteo-superior', tipo: 'funcion', objetivo: 4, paso: 'trendelenburg', estructuras: ['nervio-gluteo-superior'],
      enunciado: '¿Qué nervio inerva el glúteo medio, el glúteo menor y el tensor de la fascia lata?',
      correcta: 'El glúteo superior',
      distractores: ['El glúteo inferior', 'El ciático', 'El femoral'],
      explicacion: 'El glúteo inferior inerva el glúteo mayor; el ciático no inerva ningún músculo glúteo.',
      evidencia: [T(SAC, 'Motor Functions: Innervates the gluteus minimus, gluteus medius and tensor fascia lata.')],
    },
  ],
});
