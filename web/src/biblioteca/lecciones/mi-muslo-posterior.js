// Lección «Muslo: compartimento posterior y fosa poplítea». Formato y evidencias: ../formato.js.
import { leccion, T, GUIA, MODELO } from '../formato.js';

const ISQ = 'lower-limb/muscles/thigh/hamstrings';
const POP = 'lower-limb/areas/popliteal-fossa';
const nucleo = (nombre, piezas, tipo) => ({ nombre, piezas, lado: 'bilateral', papel: 'nucleo', tipo });
const contexto = (nombre, piezas, tipo) => ({ nombre, piezas, lado: 'bilateral', papel: 'contexto', tipo });

const ISQUIOTIBIALES = ['biceps-larga', 'biceps-corta', 'semitendinoso', 'semimembranoso'];
const CONTENIDO = ['arteria-poplitea', 'vena-poplitea', 'nervio-tibial', 'nervio-fibular-comun'];
const HUESOS = ['coxal', 'femur', 'tibia', 'fibula'];

export default leccion({
  id: 'mi-muslo-posterior',
  version: 1,
  titulo: 'Muslo: compartimento posterior y fosa poplítea',
  resumen: 'Los isquiotibiales (bíceps femoral, semitendinoso y semimembranoso): de dónde salen, dónde acaban, qué hacen en la cadera y la rodilla y qué parte del ciático inerva cada uno. Y la fosa poplítea que forman detrás de la rodilla, con sus límites y su contenido.',
  lugares: [['miembro-inferior', 'muslo'], ['miembro-inferior', 'rodilla']],
  sistemas: ['muscular'],
  formato: 'estructuras',
  temas: ['musculos', 'compartimentos'],
  nivel: 2,
  minutos: 16,
  requisitos: ['mi-huesos', 'mi-glutea'],
  siguiente: ['mi-rodilla', 'mi-pierna-posterior', 'comp-miembro-inferior'],
  objetivos: [
    'Identificar los isquiotibiales: las dos cabezas del bíceps femoral, el semitendinoso y el semimembranoso.',
    'Describir dónde se originan e insertan y qué hacen en la cadera y en la rodilla.',
    'Relacionar cada isquiotibial con la parte del nervio ciático que lo inerva.',
    'Describir los límites y el contenido de la fosa poplítea, de medial a lateral y de profundo a superficial.',
  ],
  estructuras: {
    'biceps-larga': nucleo('Cabeza larga del bíceps femoral', ['Long_head_of_biceps_femoris'], 'musculo'),
    'biceps-corta': nucleo('Cabeza corta del bíceps femoral', ['Short_head_of_biceps_femoris'], 'musculo'),
    semitendinoso: nucleo('Músculo semitendinoso', ['Semitendinosus_muscle'], 'musculo'),
    semimembranoso: nucleo('Músculo semimembranoso', ['Semimembranosus_muscle'], 'musculo'),
    'arteria-poplitea': nucleo('Arteria poplítea', ['Popliteal_artery'], 'arteria'),
    'vena-poplitea': nucleo('Vena poplítea', ['Popliteal_vein'], 'vena'),
    'nervio-tibial': { ...nucleo('Nervio tibial', ['Tibial_nerve'], 'nervio'), confusiones: ['Nervio sural'] },
    'nervio-fibular-comun': nucleo('Nervio fibular común', ['Common_fibular_nerve'], 'nervio'),
    ciatico: contexto('Nervio ciático', ['Sciatic_nerve'], 'nervio'),
    'arterias-perforantes': contexto('Arterias perforantes', ['Perforating_femoral_arteries'], 'arteria'),
    'safena-menor': contexto('Vena safena menor', ['Small_saphenous_vein'], 'vena'),
    'aductor-mayor': contexto('Músculo aductor mayor', ['Adductor_magnus'], 'musculo'),
    gastrocnemio: contexto('Cabezas del gastrocnemio', ['Medial_head_of_gastrocnemius', 'Lateral_head_of_gastrocnemius'], 'musculo'),
    plantar: contexto('Músculo plantar', ['Plantaris_muscle'], 'musculo'),
    popliteo: contexto('Músculo poplíteo', ['Popliteus_muscle'], 'musculo'),
    'fascia-poplitea': contexto('Fascia poplítea', ['Popliteal_fascia'], 'fascia'),
    'bolsa-semimembranoso': contexto('Bolsa del semimembranoso', ['Semimembranosus_bursa'], 'bolsa'),
    coxal: contexto('Hueso coxal', ['Hip_Bone'], 'hueso'),
    femur: contexto('Fémur', ['Femur'], 'hueso'),
    tibia: contexto('Tibia', ['Tibia'], 'hueso'),
    fibula: contexto('Fíbula', ['Fibula'], 'hueso'),
  },
  pasos: [
    {
      id: 'orientacion', tipo: 'orientacion', titulo: 'Los isquiotibiales',
      texto: [
        ['Los músculos del compartimento posterior del muslo se llaman en conjunto isquiotibiales: extienden la cadera y flexionan la rodilla.', T(ISQ, 'The muscles in the posterior compartment of the thigh are collectively known as the hamstrings. They collectively act to extend at the hip and flex at the knee.')],
        ['Son el bíceps femoral, el semitendinoso y el semimembranoso; los inerva el nervio ciático y reciben sangre de la arteria glútea inferior y de las perforantes de la femoral profunda.', T(ISQ, 'The muscles located within the posterior compartment of the thigh are the biceps femoris, semitendinosus and semimembranosus.'), T(ISQ, 'These muscles are innervated by the sciatic nerve (L4-S3), with arterial supply from the inferior gluteal artery and perforating branches of the deep femoral artery.')],
        ['Míralos por detrás, de la nalga a la rodilla.', GUIA],
      ],
      vista: { ver: ISQUIOTIBIALES, contexto: ['ciatico', ...HUESOS], camara: 'posterior', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'Recorre el muslo por detrás.', vistas: [{ nombre: 'Por detrás', camara: 'posterior' }, { nombre: 'Por dentro', camara: 'medial' }, { nombre: 'Por fuera', camara: 'lateral' }] },
      comprobar: 'fun-acciones',
    },
    {
      id: 'biceps', tipo: 'exploracion', titulo: 'El bíceps femoral',
      texto: [
        ['El bíceps femoral es el más lateral; su tendón común se palpa en el lado de fuera de la fosa poplítea.', T(ISQ, 'is the most lateral of the muscles in the posterior thigh. The common tendon of the two heads can be palpated laterally within the popliteal fossa (posterior knee region).')],
        ['Su cabeza larga sale de la tuberosidad isquiática y la corta, de la línea áspera del fémur; las dos acaban en la cabeza de la fíbula.', T(ISQ, 'The long head originates from the ischial tuberosity of the pelvis. The short head originates from the linea aspera on posterior surface of the femur. Together, the heads form a tendon, which inserts into the head of the fibula.')],
        ['Flexiona la rodilla, ayuda a extender la cadera y rota hacia fuera la cadera y la rodilla (la rodilla, solo flexionada).', T(ISQ, 'Actions: Flexion at the knee. It also contributes to extension of the thigh at the hip, and lateral rotation at both the hip and the knee — the latter occurring only when the knee is flexed.')],
      ],
      vista: { ver: ['biceps-larga', 'biceps-corta'], contexto: ['semitendinoso', 'semimembranoso', ...HUESOS], camara: 'posterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['biceps-larga', 'biceps-corta'], texto: 'Alterna las dos cabezas: la larga baja desde la pelvis; la corta nace en el propio fémur.' },
      comprobar: 'rel-biceps-insercion',
    },
    {
      id: 'mediales', tipo: 'exploracion', titulo: 'Semitendinoso y semimembranoso',
      texto: [
        ['El semitendinoso, casi todo tendón, va por la cara medial y por encima del semimembranoso; acaba en la cara medial de la tibia.', T(ISQ, 'The semitendinosus is a largely tendinous muscle. It is situated on the medial aspect of the posterior thigh and superficial to the semimembranosus.'), T(ISQ, 'Originates from the ischial tuberosity of the pelvis and attaches to the medial surface of the tibia.')],
        ['El semimembranoso, plano y ancho, está debajo de él y acaba en el cóndilo medial de la tibia.', T(ISQ, 'The semimembranosus muscle is flat and broad. It is located deep to the semitendinosus on the medial aspect of the posterior thigh.'), T(ISQ, 'Attaches to the medial tibial condyle.')],
        ['Los dos flexionan la rodilla, extienden la cadera y rotan hacia dentro la cadera y la rodilla.', T(ISQ, 'Flexion of the leg at the knee joint. Extension of thigh at the hip. Medially rotates the thigh at the hip joint and the leg at the knee joint.')],
      ],
      vista: { ver: ['semitendinoso', 'semimembranoso'], contexto: ['biceps-larga', 'biceps-corta', 'aductor-mayor', ...HUESOS], camara: 'posterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['semitendinoso', 'semimembranoso'], texto: 'Alterna: el semitendinoso, encima, con su largo tendón; el semimembranoso, debajo, plano y ancho.' },
      comprobar: 'comp-rotacion',
    },
    {
      id: 'inervacion', tipo: 'relaciones', titulo: 'El ciático y sus dos partes',
      texto: [
        ['Todos salen de la tuberosidad isquiática, salvo la cabeza corta del bíceps.', T(ISQ, 'The muscles of the posterior thigh all originate from the ischial tuberosity of the pelvis.'), T(ISQ, 'The short head originates from the linea aspera')],
        ['La parte tibial del ciático inerva la cabeza larga del bíceps, el semitendinoso y el semimembranoso; la parte fibular común, solo la cabeza corta.', T(ISQ, 'Long head innervated by the tibial part of the sciatic nerve, whereas the short head is innervated by the common fibular part of the sciatic nerve.'), T(ISQ, 'Innervation: Tibial part of the sciatic nerve.')],
      ],
      detalle: [
        ['Una contracción brusca y fuerte puede arrancar un fragmento de la tuberosidad isquiática (fractura por avulsión), sobre todo en adolescentes.', T(ISQ, 'In rare cases (predominantly adolescents), sudden and forceful contraction of the hamstrings can result in an avulsion fracture of the ischial tuberosity.')],
      ],
      vista: { ver: ['ciatico', 'biceps-corta'], contexto: ['biceps-larga', 'semitendinoso', 'semimembranoso', 'coxal', 'femur'], camara: 'posterior', lado: 'R' },
      comprobar: 'rel-cabeza-corta',
    },
    {
      id: 'fosa', tipo: 'relaciones', titulo: 'La fosa poplítea',
      texto: [
        ['Detrás de la rodilla queda la fosa poplítea, en forma de rombo: el paso principal de vasos y nervios entre el muslo y la pierna.', T(POP, 'The popliteal fossa is a diamond shaped area located on the posterior aspect of the knee. It is the main path by which vessels and nerves pass between the thigh and the leg.')],
        ['Arriba la limitan el semimembranoso (por dentro) y el bíceps femoral (por fuera); abajo, las dos cabezas del gastrocnemio y el plantar.', T(POP, 'Superomedial – semimembranosus.'), T(POP, 'Superolateral – biceps femoris.'), T(POP, 'Inferomedial – medial head of the gastrocnemius.'), T(POP, 'Inferolateral – lateral head of the gastrocnemius and plantaris.')],
        ['Su suelo lo forman la cápsula de la rodilla, el poplíteo y el fémur; su techo, la fascia poplítea y la piel.', T(POP, 'The floor of the popliteal fossa is formed by the posterior surface of the knee joint capsule, popliteus muscle and posterior femur. The roof is made of up two layers: popliteal fascia and skin.')],
      ],
      vista: { ver: ['semimembranoso', 'biceps-larga', 'biceps-corta'], contexto: ['gastrocnemio', 'plantar', 'popliteo', 'femur', 'tibia', 'fibula'], camara: 'posterior', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'Mira el rombo por detrás.', vistas: [{ nombre: 'Por detrás', camara: 'posterior' }, { nombre: 'Desde atrás y fuera', camara: 'posterolateral' }] },
      comprobar: 'rel-limites',
    },
    {
      id: 'contenido', tipo: 'exploracion', titulo: 'Lo que pasa por la fosa',
      texto: [
        ['De medial a lateral: la arteria poplítea, la vena poplítea, el nervio tibial y el fibular común.', T(POP, 'Its contents are (medial to lateral): Popliteal artery Popliteal vein Tibial nerve Common fibular nerve (common peroneal nerve)')],
        ['Los nervios son lo más superficial; el fibular común sigue el tendón del bíceps por el borde lateral.', T(POP, 'The tibial and common fibular nerves are the most superficial of the contents of the popliteal fossa.'), T(POP, 'The common fibular nerve follows the biceps femoris tendon, travelling along the lateral margin of the popliteal fossa.')],
        ['Lo más profundo es la arteria poplítea, que continúa la femoral; la safena menor atraviesa la fascia y desemboca en la vena poplítea.', T(POP, 'In the popliteal fossa, the deepest structure is the popliteal artery. It is a continuation of the femoral artery'), T(POP, 'The small saphenous vein pierces the popliteal fascia and passes between the two heads of gastrocnemius to empty into the popliteal vein.')],
      ],
      detalle: [
        ['La fascia del techo es dura y no se estira: un aneurisma de la arteria poplítea comprime lo que la rodea, sobre todo el nervio tibial.', T(POP, 'The popliteal fascia (the roof of the popliteal fossa) is tough and non-extensible, and so an aneurysm of the popliteal artery has consequences for the other contents of the popliteal fossa.'), T(POP, 'The tibial nerve is particularly susceptible to compression from the popliteal artery.')],
        ['El quiste de Baker es la inflamación de la bolsa del semimembranoso, a menudo con artrosis de rodilla.', T(POP, 'refers to the inflammation and swelling of the semimembranosus bursa'), T(POP, 'It usually arises in conjunction with osteoarthritis of the knee.')],
        ['La fascia poplítea del modelo es la del techo de la fosa; la piel se ve con la capa del tegumento.', MODELO],
      ],
      vista: { ver: CONTENIDO, contexto: ['safena-menor', 'gastrocnemio', 'femur', 'tibia', 'fibula'], camara: 'posterior', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'arteria-poplitea', texto: 'Toca el vaso más profundo de la fosa, el que continúa la arteria femoral.' },
      comprobar: 'rel-profundo',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['Los isquiotibiales extienden la cadera y flexionan la rodilla; el bíceps rota hacia fuera y los dos mediales, hacia dentro.', T(ISQ, 'They collectively act to extend at the hip and flex at the knee.'), T(ISQ, 'Medially rotates the thigh at the hip joint and the leg at the knee joint.')],
        ['La parte tibial del ciático los inerva a todos, salvo la cabeza corta del bíceps, que es de la fibular común.', T(ISQ, 'whereas the short head is innervated by the common fibular part of the sciatic nerve.')],
        ['En la fosa poplítea, de medial a lateral: arteria, vena, nervio tibial y fibular común; la arteria es la más profunda.', T(POP, 'Its contents are (medial to lateral): Popliteal artery Popliteal vein Tibial nerve Common fibular nerve (common peroneal nerve)'), T(POP, 'the deepest structure is the popliteal artery')],
      ],
    },
  ],
  preguntas: [
    {
      id: 'fun-acciones', tipo: 'funcion', objetivo: 1, paso: 'orientacion', estructuras: ISQUIOTIBIALES,
      enunciado: '¿Qué hacen en conjunto los isquiotibiales?',
      correcta: 'Extienden la cadera y flexionan la rodilla',
      distractores: ['Flexionan la cadera y extienden la rodilla', 'Aducen el muslo', 'Hacen la flexión plantar del pie'],
      explicacion: 'Cruzan la cadera por detrás y la rodilla por detrás: extienden una y flexionan la otra.',
      evidencia: [T(ISQ, 'They collectively act to extend at the hip and flex at the knee.')],
    },
    { id: 'id-biceps-larga', tipo: 'identificar', estructura: 'biceps-larga', objetivo: 0, paso: 'biceps' },
    { id: 'id-semitendinoso', tipo: 'identificar', estructura: 'semitendinoso', objetivo: 0, paso: 'mediales' },
    { id: 'id-semimembranoso', tipo: 'identificar', estructura: 'semimembranoso', objetivo: 0, paso: 'mediales' },
    { id: 'loc-biceps', tipo: 'localizar', estructura: 'biceps-larga', candidatas: ['semitendinoso', 'semimembranoso'], objetivo: 0, paso: 'biceps' },
    {
      id: 'rel-biceps-insercion', tipo: 'relacion', objetivo: 1, paso: 'biceps', estructuras: ['biceps-larga', 'biceps-corta', 'fibula'],
      enunciado: '¿Dónde se inserta el bíceps femoral?',
      correcta: 'En la cabeza de la fíbula',
      distractores: ['En la cara medial de la tibia', 'En el cóndilo medial de la tibia', 'En la tuberosidad tibial'],
      explicacion: 'El bíceps va a la cabeza de la fíbula; el semitendinoso, a la cara medial de la tibia; el semimembranoso, a su cóndilo medial.',
      evidencia: [T(ISQ, 'Together, the heads form a tendon, which inserts into the head of the fibula.')],
    },
    {
      id: 'comp-rotacion', tipo: 'comparacion', objetivo: 1, paso: 'mediales', estructuras: ['semitendinoso', 'semimembranoso', 'biceps-larga'],
      enunciado: '¿En qué se diferencian el bíceps femoral y los dos isquiotibiales mediales en la rotación?',
      correcta: 'El bíceps rota hacia fuera; el semitendinoso y el semimembranoso, hacia dentro',
      distractores: ['El bíceps rota hacia dentro; los mediales, hacia fuera', 'Ninguno rota: solo flexionan la rodilla', 'Los tres rotan hacia fuera'],
      explicacion: 'El bíceps, lateral, rota hacia fuera; los mediales rotan hacia dentro la cadera y la rodilla.',
      evidencia: [T(ISQ, 'lateral rotation at both the hip and the knee'), T(ISQ, 'Medially rotates the thigh at the hip joint and the leg at the knee joint.')],
    },
    {
      id: 'rel-origen', tipo: 'relacion', objetivo: 1, paso: 'inervacion', estructuras: ['biceps-corta'],
      enunciado: '¿Cuál de estos músculos NO nace en la tuberosidad isquiática?',
      correcta: 'La cabeza corta del bíceps femoral',
      distractores: ['La cabeza larga del bíceps femoral', 'El semitendinoso', 'El semimembranoso'],
      explicacion: 'La cabeza corta nace en la línea áspera del fémur; los demás, en la tuberosidad isquiática.',
      evidencia: [T(ISQ, 'The short head originates from the linea aspera on posterior surface of the femur.')],
    },
    {
      id: 'rel-cabeza-corta', tipo: 'relacion', objetivo: 2, paso: 'inervacion', estructuras: ['biceps-corta', 'ciatico'],
      enunciado: '¿Qué parte del nervio ciático inerva la cabeza corta del bíceps femoral?',
      correcta: 'La parte fibular común',
      distractores: ['La parte tibial', 'El nervio femoral', 'El nervio obturador'],
      explicacion: 'La cabeza corta es la única del compartimento que inerva la parte fibular común; las demás, la tibial.',
      evidencia: [T(ISQ, 'whereas the short head is innervated by the common fibular part of the sciatic nerve.')],
    },
    {
      id: 'fun-semitendinoso-nervio', tipo: 'funcion', objetivo: 2, paso: 'inervacion', estructuras: ['semitendinoso', 'semimembranoso'],
      enunciado: '¿Qué inerva el semitendinoso y el semimembranoso?',
      correcta: 'La parte tibial del nervio ciático',
      distractores: ['La parte fibular común del nervio ciático', 'El nervio femoral', 'El nervio glúteo inferior'],
      explicacion: 'Los dos mediales y la cabeza larga del bíceps son de la parte tibial.',
      evidencia: [T(ISQ, 'Innervation: Tibial part of the sciatic nerve.')],
    },
    {
      id: 'rel-limites', tipo: 'relacion', objetivo: 3, paso: 'fosa', estructuras: ['semimembranoso', 'biceps-larga'],
      enunciado: '¿Qué músculo forma el límite superolateral de la fosa poplítea?',
      correcta: 'El bíceps femoral',
      distractores: ['El semimembranoso', 'La cabeza medial del gastrocnemio', 'El poplíteo'],
      explicacion: 'Arriba y dentro, el semimembranoso; arriba y fuera, el bíceps; abajo, las cabezas del gastrocnemio. El poplíteo forma parte del suelo.',
      evidencia: [T(POP, 'Superolateral – biceps femoris.')],
    },
    { id: 'id-arteria-poplitea', tipo: 'identificar', estructura: 'arteria-poplitea', objetivo: 3, paso: 'contenido' },
    { id: 'id-nervio-tibial', tipo: 'identificar', estructura: 'nervio-tibial', objetivo: 3, paso: 'contenido' },
    {
      id: 'rel-profundo', tipo: 'relacion', objetivo: 3, paso: 'contenido', estructuras: CONTENIDO,
      enunciado: '¿Cuál es la estructura más profunda de la fosa poplítea?',
      correcta: 'La arteria poplítea',
      distractores: ['El nervio tibial', 'El nervio fibular común', 'La vena safena menor'],
      explicacion: 'Los nervios son lo más superficial; la arteria, que continúa la femoral, es lo más profundo.',
      evidencia: [T(POP, 'In the popliteal fossa, the deepest structure is the popliteal artery.')],
    },
    {
      id: 'sec-contenido', tipo: 'secuencia', objetivo: 3, paso: 'contenido',
      enunciado: 'Ordena el contenido de la fosa poplítea de medial a lateral.',
      orden: ['Arteria poplítea', 'Vena poplítea', 'Nervio tibial', 'Nervio fibular común'],
      explicacion: 'De medial a lateral: arteria, vena, nervio tibial y fibular común.',
      evidencia: [T(POP, 'Its contents are (medial to lateral): Popliteal artery Popliteal vein Tibial nerve Common fibular nerve (common peroneal nerve)')],
    },
  ],
});
