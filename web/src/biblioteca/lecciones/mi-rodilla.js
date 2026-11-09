// Lección «Articulación de la rodilla». Formato y evidencias: ../formato.js.
import { leccion, T, GUIA, MODELO } from '../formato.js';

const ROD = 'lower-limb/joints/knee-joint';
const nucleo = (nombre, piezas, tipo, extra = {}) => ({ nombre, piezas, lado: 'bilateral', papel: 'nucleo', tipo, ...extra });
const contexto = (nombre, piezas, tipo) => ({ nombre, piezas, lado: 'bilateral', papel: 'contexto', tipo });

const HUESOS = ['femur', 'tibia', 'rotula', 'fibula'];
const COLATERALES = ['colateral-tibial', 'colateral-fibular'];
const CRUZADOS = ['lca', 'lcp'];
const MENISCOS = ['menisco-medial', 'menisco-lateral'];
const BOLSAS = ['bolsa-suprarrotuliana', 'bolsa-prerrotuliana', 'bolsas-infrarrotulianas', 'bolsa-semimembranoso'];

export default leccion({
  id: 'mi-rodilla',
  version: 1,
  titulo: 'Articulación de la rodilla',
  resumen: 'La rodilla por dentro: sus dos articulaciones (tibiofemoral y femororrotuliana), los meniscos, los ligamentos colaterales y cruzados con lo que frena cada uno, las bolsas principales y los músculos que la mueven. Incluye las lesiones típicas que se explican por esta anatomía.',
  lugares: [['miembro-inferior', 'rodilla']],
  sistemas: ['articular'],
  formato: 'articulacion',
  temas: ['articulaciones', 'movimientos'],
  nivel: 2,
  minutos: 18,
  requisitos: ['mi-huesos', 'sis-articular'],
  siguiente: ['mi-muslo-posterior', 'mi-pierna-posterior', 'comp-miembro-inferior'],
  objetivos: [
    'Describir las dos articulaciones de la rodilla y qué movimientos permite.',
    'Localizar los meniscos y explicar sus funciones y por qué el medial se lesiona junto al ligamento colateral tibial.',
    'Localizar los ligamentos colaterales y cruzados y explicar qué desplazamiento frena cada uno.',
    'Situar las bolsas principales de la rodilla.',
    'Relacionar los músculos con los movimientos de la rodilla.',
  ],
  estructuras: {
    'menisco-medial': nucleo('Menisco medial', ['Medial_meniscus'], 'cartilago'),
    'menisco-lateral': nucleo('Menisco lateral', ['Lateral_meniscus'], 'cartilago'),
    'colateral-tibial': nucleo('Ligamento colateral tibial (medial)', ['Superficial_part_of_tibial_collateral_ligament', 'Deep_part_of_tibial_collateral_ligament'], 'ligamento'),
    'colateral-fibular': nucleo('Ligamento colateral fibular (lateral)', ['Fibular_collateral_ligament'], 'ligamento'),
    lca: nucleo('Ligamento cruzado anterior', ['Anterior_cruciate_ligament'], 'ligamento'),
    lcp: nucleo('Ligamento cruzado posterior', ['Posterior_cruciate_ligament'], 'ligamento'),
    'bolsa-suprarrotuliana': nucleo('Bolsa suprarrotuliana', ['Suprapatellar_bursa'], 'bolsa'),
    'bolsa-prerrotuliana': nucleo('Bolsa prerrotuliana', ['Subcutaneous_prepatellar_bursa'], 'bolsa'),
    'bolsas-infrarrotulianas': nucleo('Bolsas infrarrotulianas (profunda y superficial)', ['Deep_infrapatellar_bursa', 'Subcutaneous_infrapatellar_bursa'], 'bolsa'),
    'bolsa-semimembranoso': nucleo('Bolsa del semimembranoso', ['Semimembranosus_bursa'], 'bolsa'),
    capsula: contexto('Cápsula articular de la rodilla', ['Articular_capsule_of_knee_joint'], 'capsula'),
    retinaculos: contexto('Retináculos rotulianos', ['Medial_patellar_retinaculum', 'Lateral_patellar_retinaculum'], 'ligamento'),
    femur: contexto('Fémur', ['Femur'], 'hueso'),
    tibia: contexto('Tibia', ['Tibia'], 'hueso'),
    rotula: contexto('Rótula', ['Patella'], 'hueso'),
    fibula: contexto('Fíbula', ['Fibula'], 'hueso'),
    cuadriceps: contexto('Músculo cuádriceps femoral', ['Rectus_femoris_muscle', 'Vastus_lateralis_muscle', 'Vastus_medialis_muscle', 'Vastus_intermedius_muscle'], 'musculo'),
    isquiotibiales: contexto('Músculos isquiotibiales', ['Long_head_of_biceps_femoris', 'Short_head_of_biceps_femoris', 'Semitendinosus_muscle', 'Semimembranosus_muscle'], 'musculo'),
    popliteo: contexto('Músculo poplíteo', ['Popliteus_muscle'], 'musculo'),
  },
  pasos: [
    {
      id: 'orientacion', tipo: 'orientacion', titulo: 'La rodilla',
      texto: [
        ['La rodilla es una articulación sinovial en bisagra: permite sobre todo flexión y extensión, y un poco de rotación medial y lateral.', T(ROD, 'The knee joint is a hinge type synovial joint, which mainly allows for flexion and extension (and a small degree of medial and lateral rotation).')],
        ['La forman la rótula, el fémur y la tibia.', T(ROD, 'It is formed by articulations between the patella, femur and tibia.')],
        ['Mírala de frente y por detrás; con los huesos a la vista, gira hasta ver los ligamentos de dentro.', GUIA],
      ],
      vista: { ver: [...MENISCOS, ...COLATERALES, ...CRUZADOS], contexto: HUESOS, camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'Recorre la rodilla.', vistas: [{ nombre: 'De frente', camara: 'anterior' }, { nombre: 'Por dentro', camara: 'medial' }, { nombre: 'Por detrás', camara: 'posterior' }, { nombre: 'Por fuera', camara: 'lateral' }] },
    },
    {
      id: 'superficies', tipo: 'explicacion', titulo: 'Dos articulaciones en una',
      texto: [
        ['La rodilla tiene dos articulaciones, la tibiofemoral y la femororrotuliana, revestidas de cartílago hialino y dentro de una sola cavidad.', T(ROD, 'The knee joint consists of two articulations – tibiofemoral and patellofemoral. The joint surfaces are lined with hyaline cartilage and are enclosed within a single joint cavity.')],
        ['En la tibiofemoral, los cóndilos del fémur se apoyan en los de la tibia: es la parte que soporta el peso.', T(ROD, 'Tibiofemoral – medial and lateral condyles of the femur articulate with the tibial condyles. It is the weight-bearing component of the knee joint.')],
        ['En la femororrotuliana, la cara anterior del extremo del fémur se articula con la rótula, que hace de punto de apoyo y da más fuerza al cuádriceps para extender la rodilla.', T(ROD, 'Patellofemoral – anterior aspect of the distal femur articulates with the patella.'), T(ROD, 'it provides a fulcrum to increase power of the knee extensor')],
      ],
      vista: { ver: ['capsula'], contexto: ['femur', 'tibia', 'rotula', 'fibula'], camara: 'anterolateral', lado: 'R' },
      comprobar: 'rel-carga',
    },
    {
      id: 'meniscos', tipo: 'exploracion', titulo: 'Los meniscos',
      texto: [
        ['Los meniscos medial y lateral son anillos de fibrocartílago en forma de C, dentro de la articulación.', T(ROD, 'The medial and lateral menisci are C-shaped fibrocartilage rings located within the knee joint.')],
        ['Hacen más profunda la superficie de la tibia, lo que da estabilidad, y amortiguan, porque reparten las fuerzas que pasan por la rodilla.', T(ROD, 'Deepens the articular surface of the tibia – increasing the stability of the joint.'), T(ROD, 'Acts as shock absorbers– increasing surface area to further dissipate forces that are transmitted across the joint.')],
        ['Los dos se fijan por sus extremos a la zona intercondílea de la tibia; el medial, además, al ligamento colateral tibial y a la cápsula, y por eso las lesiones de ese ligamento suelen ir con roturas del menisco medial.', T(ROD, 'They are attached at both ends to the intercondylar area of the tibia.'), T(ROD, 'In addition to this attachment, the medial meniscus is also fixed to the medial collateral ligament and the joint capsule. Damage to the medial collateral ligament is often associated with a medial meniscal tear.')],
        ['El lateral es más pequeño y, al no tener otras uniones, más móvil.', T(ROD, 'The lateral meniscus is smaller and does not have any additional attachments, rendering it more mobile.')],
      ],
      vista: { ver: MENISCOS, contexto: ['tibia', 'colateral-tibial'], camara: 'superior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: MENISCOS, texto: 'Desde arriba, sin el fémur: el medial, más abierto, toca el colateral tibial; el lateral es más pequeño.' },
      comprobar: 'rel-menisco-medial',
    },
    {
      id: 'colaterales', tipo: 'relaciones', titulo: 'Los ligamentos colaterales',
      texto: [
        ['Los colaterales son dos ligamentos en forma de correa que estabilizan la bisagra e impiden que la rodilla se abra en exceso hacia dentro o hacia fuera.', T(ROD, 'Collateral ligaments – two strap-like ligaments. They act to stabilise the hinge motion of the knee, preventing excessive medial or lateral movement')],
        ['El colateral tibial (medial), ancho y plano, va del epicóndilo medial del fémur al cóndilo medial de la tibia.', T(ROD, 'Medial collateral ligament – wide and flat ligament, found on the medial side of the joint. Proximally, it attaches to the medial epicondyle of the femur, distally it attaches to the medial condyle of the tibia.')],
        ['El colateral fibular (lateral), más fino y redondeado, va del epicóndilo lateral del fémur a la cabeza de la fíbula.', T(ROD, 'Lateral collateral ligament – thinner and rounder than the medial collateral ligament. It attaches proximally to the lateral epicondyle of the femur and distally to a depression on the lateral surface of the fibular head.')],
      ],
      detalle: [
        ['Por delante, el ligamento rotuliano continúa el tendón del cuádriceps por debajo de la rótula hasta la tuberosidad tibial.', T(ROD, 'Patellar ligament – a continuation of the quadriceps femoris tendon distal to the patella. It attaches to the tibial tuberosity.')],
        ['El ligamento rotuliano no es una pieza aparte en el modelo.', MODELO],
        ['Las lesiones de los colaterales son las más frecuentes de la rodilla: se producen por un golpe lateral con el pie apoyado.', T(ROD, 'Injury to the collateral ligaments is the most common pathology affecting the knee joint. It is caused by a force being applied to the side of the knee when the foot is placed on the ground.')],
      ],
      vista: { ver: COLATERALES, contexto: ['femur', 'tibia', 'fibula', 'menisco-medial'], camara: 'medial', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: COLATERALES, texto: 'Alterna: el tibial, ancho, por dentro; el fibular, fino, por fuera hasta la cabeza de la fíbula. Gira la rodilla para verlos.' },
      comprobar: 'rel-colateral-fibular',
    },
    {
      id: 'cruzados', tipo: 'relaciones', titulo: 'Los ligamentos cruzados',
      texto: [
        ['Los cruzados unen el fémur con la tibia y se cruzan entre sí, como una X.', T(ROD, 'Cruciate ligaments – these two ligaments connect the femur and the tibia. In doing so, they cross each other, hence the term ‘cruciate’ (Latin for like a cross)')],
        ['El anterior sale de la parte anterior de la zona intercondílea de la tibia, sube hacia atrás hasta la fosa intercondílea del fémur e impide que la tibia se desplace hacia delante.', T(ROD, 'Anterior cruciate ligament – attaches at the anterior intercondylar region of the tibia where it blends with the medial meniscus. It ascends posteriorly to attach to the femur in the intercondylar fossa. It prevents anterior dislocation of the tibia onto the femur.')],
        ['El posterior sale de la parte posterior, sube hacia delante hasta el cóndilo medial del fémur e impide que la tibia se desplace hacia atrás.', T(ROD, 'Posterior cruciate ligament – attaches at the posterior intercondylar region of the tibia and ascends anteriorly to attach to the anteromedial femoral condyle. It prevents posterior dislocation of the tibia onto the femur.')],
      ],
      detalle: [
        ['El anterior se rompe con una hiperextensión o con un golpe fuerte por detrás con la rodilla algo flexionada; se explora con el cajón anterior, tirando de la tibia hacia delante.', T(ROD, 'The anterior cruciate ligament (ACL) can be torn by hyperextension of the knee joint, or by the application of a large force to the back of the knee with the joint partly flexed.'), T(ROD, 'To test for this, you can perform an anterior drawer test, where you attempt to pull the tibia forwards, if it moves, the ligament has been torn.')],
      ],
      vista: { ver: CRUZADOS, contexto: ['tibia', ...MENISCOS], fantasma: ['femur', 'rotula'], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: CRUZADOS, texto: 'Alterna y gira: el anterior sube hacia atrás y el posterior hacia delante.' },
      comprobar: 'fun-lca',
    },
    {
      id: 'bolsas', tipo: 'exploracion', titulo: 'Las bolsas de la rodilla',
      texto: [
        ['Una bolsa es un saco con un poco de líquido sinovial que reduce el roce entre tendones, hueso y piel.', T(ROD, 'A bursa is a sac-like structure containing a small amount of synovial fluid. It functions to decrease friction between tendons, bone, and skin during movement.')],
        ['La suprarrotuliana está entre el cuádriceps y el fémur; la prerrotuliana, entre la rótula y la piel.', T(ROD, 'Suprapatellar bursa – located between the quadriceps femoris and the femur.'), T(ROD, 'Prepatellar bursa – located between the apex of the patella and the skin.')],
        ['Las infrarrotulianas son dos: la profunda, entre la tibia y el ligamento rotuliano, y la superficial, entre ese ligamento y la piel; por detrás está la del semimembranoso.', T(ROD, 'Infrapatellar bursa – split into deep and superficial. The deep bursa lies between the tibia and the patella ligament. The superficial lies between the patella ligament and the skin.'), T(ROD, 'Semimembranosus bursa – located posterior to the knee joint, between the semimembranosus muscle and the medial head of the gastrocnemius.')],
      ],
      detalle: [
        ['El roce repetido al arrodillarse inflama la bolsa prerrotuliana (la «rodilla de fregona»).', T(ROD, 'Friction between the skin and the patella cause the prepatellar bursa to become inflamed, producing a swelling on the anterior side of the knee. This is known as housemaid’s knee.')],
      ],
      vista: { ver: BOLSAS, contexto: ['femur', 'tibia', 'rotula'], camara: 'lateral', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'bolsa-suprarrotuliana', texto: 'Toca la bolsa que queda entre el cuádriceps y el fémur, por encima de la rótula.' },
      comprobar: 'rel-prerrotuliana',
    },
    {
      id: 'movimientos', tipo: 'funcion', titulo: 'Los músculos que mueven la rodilla',
      texto: [
        ['La extiende el cuádriceps, que se inserta en la tuberosidad tibial; la flexionan los isquiotibiales, el grácil, el sartorio y el poplíteo.', T(ROD, 'Extension – produced by the quadriceps femoris, which inserts into the tibial tuberosity.'), T(ROD, 'Flexion – produced by the hamstrings, gracilis, sartorius and popliteus.')],
        ['La rota hacia fuera el bíceps femoral, y hacia dentro, cinco músculos: semimembranoso, semitendinoso, grácil, sartorio y poplíteo.', T(ROD, 'Lateral rotation – produced by the biceps femoris.'), T(ROD, 'Medial rotation – produced by five muscles; semimembranosus, semitendinosus, gracilis, sartorius and popliteus.')],
        ['Las rotaciones solo se dan con la rodilla flexionada; con ella extendida, la rotación ocurre en la cadera.', T(ROD, 'NB: Lateral and medial rotation can only occur when the knee is flexed (if the knee is not flexed, the medial/lateral rotation occurs at the hip joint).')],
      ],
      detalle: [
        ['Un golpe lateral con la rodilla extendida, como un placaje, puede romper a la vez el colateral tibial, el menisco medial y el cruzado anterior: la «tríada desgraciada».', T(ROD, 'A lateral force to an extended knee, such as a rugby tackle, can rupture the medial collateral ligament, damaging the medial meniscus in the process. The ACL is also affected, which completes the ‘unhappy triad’.')],
      ],
      vista: { ver: ['cuadriceps', 'isquiotibiales'], contexto: ['popliteo', ...HUESOS], camara: 'lateral', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['cuadriceps', 'isquiotibiales'], texto: 'Alterna: el cuádriceps, por delante, extiende la rodilla; los isquiotibiales, por detrás, la flexionan.' },
      comprobar: 'fun-rotacion',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['La rodilla es una bisagra con dos articulaciones: la tibiofemoral, que carga el peso, y la femororrotuliana.', T(ROD, 'The knee joint is a hinge type synovial joint'), T(ROD, 'It is the weight-bearing component of the knee joint.')],
        ['Los meniscos profundizan la tibia y amortiguan; el medial está unido al colateral tibial.', T(ROD, 'Deepens the articular surface of the tibia'), T(ROD, 'the medial meniscus is also fixed to the medial collateral ligament and the joint capsule')],
        ['Los colaterales frenan la apertura lateral y medial; el cruzado anterior, el deslizamiento de la tibia hacia delante, y el posterior, hacia atrás.', T(ROD, 'preventing excessive medial or lateral movement'), T(ROD, 'It prevents anterior dislocation of the tibia onto the femur.'), T(ROD, 'It prevents posterior dislocation of the tibia onto the femur.')],
        ['El cuádriceps extiende la rodilla; los isquiotibiales, el grácil, el sartorio y el poplíteo la flexionan.', T(ROD, 'Extension – produced by the quadriceps femoris'), T(ROD, 'Flexion – produced by the hamstrings, gracilis, sartorius and popliteus.')],
      ],
    },
  ],
  preguntas: [
    {
      id: 'rel-carga', tipo: 'relacion', objetivo: 0, paso: 'superficies', estructuras: ['femur', 'tibia'],
      enunciado: '¿Qué parte de la rodilla soporta el peso?',
      correcta: 'La articulación tibiofemoral',
      distractores: ['La articulación femororrotuliana', 'La articulación tibiofibular superior', 'Los ligamentos cruzados'],
      explicacion: 'Los cóndilos del fémur apoyan en los de la tibia: es la parte que carga el peso; la femororrotuliana sirve al cuádriceps.',
      evidencia: [T(ROD, 'Tibiofemoral – medial and lateral condyles of the femur articulate with the tibial condyles. It is the weight-bearing component of the knee joint.')],
    },
    {
      id: 'rel-tipo', tipo: 'relacion', objetivo: 0, paso: 'orientacion', estructuras: ['femur', 'tibia'],
      enunciado: '¿Qué tipo de articulación es la rodilla?',
      correcta: 'Sinovial en bisagra, con algo de rotación',
      distractores: ['Esferoidea, como la cadera', 'Cartilaginosa, como la sínfisis del pubis', 'Fibrosa, como las suturas'],
      explicacion: 'Permite sobre todo flexión y extensión, y un poco de rotación con la rodilla flexionada.',
      evidencia: [T(ROD, 'The knee joint is a hinge type synovial joint, which mainly allows for flexion and extension (and a small degree of medial and lateral rotation).')],
    },
    { id: 'id-menisco-medial', tipo: 'identificar', estructura: 'menisco-medial', objetivo: 1, paso: 'meniscos' },
    { id: 'id-menisco-lateral', tipo: 'identificar', estructura: 'menisco-lateral', objetivo: 1, paso: 'meniscos' },
    {
      id: 'rel-menisco-medial', tipo: 'relacion', objetivo: 1, paso: 'meniscos', estructuras: ['menisco-medial', 'colateral-tibial'],
      enunciado: '¿Por qué una lesión del ligamento colateral tibial suele ir con una rotura del menisco medial?',
      correcta: 'Porque el menisco medial está unido a ese ligamento y a la cápsula',
      distractores: ['Porque el menisco medial es el más pequeño y móvil', 'Porque los dos están en la cara lateral de la rodilla', 'Porque el menisco medial se une a la cabeza de la fíbula'],
      explicacion: 'El medial está fijo al colateral tibial y a la cápsula; el lateral, más pequeño, no tiene esas uniones y es más móvil.',
      evidencia: [T(ROD, 'the medial meniscus is also fixed to the medial collateral ligament and the joint capsule. Damage to the medial collateral ligament is often associated with a medial meniscal tear.')],
    },
    {
      id: 'fun-meniscos', tipo: 'funcion', objetivo: 1, paso: 'meniscos', estructuras: MENISCOS,
      enunciado: '¿Para qué sirven los meniscos?',
      correcta: 'Para hacer más profunda la superficie de la tibia y amortiguar',
      distractores: ['Para unir la rótula con la tibia', 'Para producir el líquido sinovial', 'Para impedir que la tibia se desplace hacia delante'],
      explicacion: 'Profundizan la superficie articular de la tibia, lo que estabiliza, y reparten las fuerzas que atraviesan la rodilla.',
      evidencia: [T(ROD, 'Deepens the articular surface of the tibia – increasing the stability of the joint.'), T(ROD, 'Acts as shock absorbers')],
    },
    { id: 'id-colateral-tibial', tipo: 'identificar', estructura: 'colateral-tibial', objetivo: 2, paso: 'colaterales' },
    { id: 'id-colateral-fibular', tipo: 'identificar', estructura: 'colateral-fibular', objetivo: 2, paso: 'colaterales' },
    { id: 'id-lca', tipo: 'identificar', estructura: 'lca', objetivo: 2, paso: 'cruzados' },
    { id: 'id-lcp', tipo: 'identificar', estructura: 'lcp', objetivo: 2, paso: 'cruzados' },
    {
      id: 'rel-colateral-fibular', tipo: 'relacion', objetivo: 2, paso: 'colaterales', estructuras: ['colateral-fibular'],
      enunciado: '¿Dónde se inserta abajo el ligamento colateral fibular?',
      correcta: 'En la cabeza de la fíbula',
      distractores: ['En el cóndilo medial de la tibia', 'En la tuberosidad tibial', 'En el menisco lateral'],
      explicacion: 'El colateral fibular va del epicóndilo lateral del fémur a la cabeza de la fíbula; el tibial, del epicóndilo medial al cóndilo medial de la tibia.',
      evidencia: [T(ROD, 'It attaches proximally to the lateral epicondyle of the femur and distally to a depression on the lateral surface of the fibular head.')],
    },
    {
      id: 'fun-lca', tipo: 'funcion', objetivo: 2, paso: 'cruzados', estructuras: ['lca'],
      enunciado: '¿Qué impide el ligamento cruzado anterior?',
      correcta: 'Que la tibia se desplace hacia delante sobre el fémur',
      distractores: ['Que la tibia se desplace hacia atrás', 'Que la rodilla se abra hacia dentro', 'Que la rótula se luxe hacia fuera'],
      explicacion: 'Por eso se explora tirando de la tibia hacia delante (cajón anterior).',
      evidencia: [T(ROD, 'It prevents anterior dislocation of the tibia onto the femur.')],
    },
    {
      id: 'fun-colaterales', tipo: 'funcion', objetivo: 2, paso: 'colaterales', estructuras: COLATERALES,
      enunciado: '¿Qué movimiento frenan los ligamentos colaterales?',
      correcta: 'Que la rodilla se abra en exceso hacia dentro o hacia fuera',
      distractores: ['Que la tibia se desplace hacia delante o hacia atrás', 'Que la rodilla se flexione', 'Que la rótula suba'],
      explicacion: 'Los colaterales estabilizan la bisagra a los lados; los cruzados frenan los deslizamientos hacia delante y hacia atrás.',
      evidencia: [T(ROD, 'They act to stabilise the hinge motion of the knee, preventing excessive medial or lateral movement')],
    },
    { id: 'id-bolsa-suprarrotuliana', tipo: 'identificar', estructura: 'bolsa-suprarrotuliana', objetivo: 3, paso: 'bolsas' },
    { id: 'id-bolsa-prerrotuliana', tipo: 'identificar', estructura: 'bolsa-prerrotuliana', objetivo: 3, paso: 'bolsas' },
    {
      id: 'rel-prerrotuliana', tipo: 'relacion', objetivo: 3, paso: 'bolsas', estructuras: ['bolsa-prerrotuliana'],
      enunciado: '¿Dónde está la bolsa prerrotuliana?',
      correcta: 'Entre la rótula y la piel',
      distractores: ['Entre el cuádriceps y el fémur', 'Entre la tibia y el ligamento rotuliano', 'Detrás de la rodilla, junto al semimembranoso'],
      explicacion: 'La prerrotuliana está delante de la rótula; la suprarrotuliana, entre el cuádriceps y el fémur; la infrarrotuliana profunda, entre la tibia y el ligamento rotuliano.',
      evidencia: [T(ROD, 'Prepatellar bursa – located between the apex of the patella and the skin.')],
    },
    {
      id: 'fun-rotacion', tipo: 'funcion', objetivo: 4, paso: 'movimientos', estructuras: ['isquiotibiales'],
      enunciado: '¿Qué músculo rota la rodilla hacia fuera?',
      correcta: 'El bíceps femoral',
      distractores: ['El semimembranoso', 'El sartorio', 'El cuádriceps'],
      explicacion: 'El bíceps femoral rota hacia fuera; el semimembranoso, el semitendinoso, el grácil, el sartorio y el poplíteo, hacia dentro. Solo con la rodilla flexionada.',
      evidencia: [T(ROD, 'Lateral rotation – produced by the biceps femoris.')],
    },
    {
      id: 'fun-extension', tipo: 'funcion', objetivo: 4, paso: 'movimientos', estructuras: ['cuadriceps'],
      enunciado: '¿Qué músculo extiende la rodilla?',
      correcta: 'El cuádriceps femoral',
      distractores: ['Los isquiotibiales', 'El poplíteo', 'El grácil'],
      explicacion: 'El cuádriceps, a través de la rótula, se inserta en la tuberosidad tibial y extiende la rodilla; los otros la flexionan.',
      evidencia: [T(ROD, 'Extension – produced by the quadriceps femoris, which inserts into the tibial tuberosity.')],
    },
  ],
});
