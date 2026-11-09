// Lección «Arterias y venas del miembro inferior». Formato y evidencias: ../formato.js.
import { leccion, T, GUIA, MODELO } from '../formato.js';

const ART = 'lower-limb/vessels/arterial-supply';
const VEN = 'lower-limb/vessels/venous-drainage';
const vaso = (nombre, piezas, tipo, extra = {}) => ({ nombre, piezas, lado: 'bilateral', papel: 'nucleo', tipo, ...extra });
const contexto = (nombre, piezas, tipo, lado = 'bilateral') => ({ nombre, piezas, lado, papel: 'contexto', tipo });

const ARTERIAS_MUSLO = ['iliaca-externa', 'femoral', 'femoral-profunda'];
const ARTERIAS_PIERNA = ['poplitea', 'tibial-anterior', 'tibial-posterior', 'fibular'];
const ARTERIAS_PIE = ['dorsal-pie', 'plantares', 'arco-plantar'];
const HUESOS = ['coxal', 'femur', 'tibia', 'fibula', 'pie'];

export default leccion({
  id: 'mi-vasos',
  version: 1,
  titulo: 'Arterias y venas del miembro inferior',
  resumen: 'El árbol arterial de la pierna, de la ilíaca externa al pie: femoral y femoral profunda, poplítea, tibiales y fibular, dorsal del pie y arco plantar. Y las venas: las profundas, que acompañan a las arterias, y las dos safenas, con lo que explica la trombosis venosa profunda y las varices.',
  lugares: [['miembro-inferior', null]],
  sistemas: ['cardiovascular'],
  formato: 'trayectos',
  temas: ['arterias-venas'],
  nivel: 2,
  minutos: 18,
  requisitos: ['sis-cardiovascular', 'mi-huesos'],
  siguiente: ['abd-vasos', 'mi-muslo-anterior-medial', 'mi-pierna-posterior'],
  objetivos: [
    'Seguir el recorrido de la arteria principal del miembro inferior desde la ilíaca externa hasta el pie.',
    'Nombrar las ramas de la femoral profunda y de la poplítea.',
    'Distinguir las venas profundas de las superficiales.',
    'Describir el trayecto de las safenas mayor y menor.',
    'Explicar por qué una trombosis venosa profunda puede acabar en una embolia pulmonar.',
  ],
  estructuras: {
    'iliaca-externa': vaso('Arteria ilíaca externa', ['External_iliac_artery'], 'arteria'),
    femoral: vaso('Arteria femoral', ['Femoral_artery'], 'arteria'),
    'femoral-profunda': vaso('Arteria femoral profunda', ['Deep_femoral_artery'], 'arteria'),
    poplitea: vaso('Arteria poplítea', ['Popliteal_artery'], 'arteria'),
    'tibial-anterior': vaso('Arteria tibial anterior', ['Anterior_tibial_artery'], 'arteria'),
    'tibial-posterior': vaso('Arteria tibial posterior', ['Posterior_tibial_artery'], 'arteria'),
    fibular: vaso('Arteria fibular', ['Fibular_artery'], 'arteria'),
    'dorsal-pie': vaso('Arteria dorsal del pie', ['Dorsalis_pedis_artery'], 'arteria'),
    plantares: vaso('Arterias plantares medial y lateral', ['Medial_plantar_artery', 'Lateral_plantar_artery'], 'arteria'),
    'arco-plantar': vaso('Arco plantar', ['Plantar_arch'], 'arteria'),
    'vena-femoral': vaso('Vena femoral', ['Femoral_vein'], 'vena'),
    'vena-poplitea': vaso('Vena poplítea', ['Popliteal_vein'], 'vena'),
    'safena-mayor': vaso('Vena safena mayor', ['Great_saphenous_vein'], 'vena'),
    'safena-menor': vaso('Vena safena menor', ['Small_saphenous_vein'], 'vena'),
    'arco-venoso': vaso('Arco venoso dorsal del pie', ['Dorsal_venous_arch_of_foot'], 'vena'),
    circunflejas: contexto('Arterias circunflejas femorales', ['Medial_circumflex_femoral_artery', 'Lateral_circumflex_femoral_artery'], 'arteria'),
    perforantes: contexto('Arterias perforantes', ['Perforating_femoral_arteries'], 'arteria'),
    geniculares: contexto('Arterias geniculares', ['Superior_medial_genicular_artery', 'Superior_lateral_genicular_artery', 'Middle_genicular_artery', 'Inferior_medial_genicular_artery', 'Inferior_lateral_genicular_artery'], 'arteria'),
    'venas-tibiales': contexto('Venas tibiales anteriores y posteriores', ['Anterior_tibial_veins', 'Posterior_tibial_veins'], 'vena'),
    'vena-femoral-profunda': contexto('Vena femoral profunda', ['Deep_femoral_vein'], 'vena'),
    'vena-iliaca-externa': contexto('Vena ilíaca externa', ['External_iliac_vein'], 'vena'),
    'ligamento-inguinal': contexto('Ligamento inguinal', ['Inguinal_ligament'], 'ligamento'),
    'aductor-mayor': contexto('Músculo aductor mayor', ['Adductor_magnus'], 'musculo'),
    'membrana-interosea': contexto('Membrana interósea de la pierna', ['Interosseous_membrane_of_leg'], 'ligamento'),
    coxal: contexto('Hueso coxal', ['Hip_Bone'], 'hueso'),
    femur: contexto('Fémur', ['Femur'], 'hueso'),
    tibia: contexto('Tibia', ['Tibia'], 'hueso'),
    fibula: contexto('Fíbula', ['Fibula'], 'hueso'),
    pie: contexto('Huesos del pie', ['Talus', 'Calcaneus', 'Navicular', 'Cuboid', 'Medial_Cuneiform', 'Intermediate_Cuneiform', 'Lateral_Cuneiform', 'Metatarsal_1', 'Metatarsal_2', 'Metatarsal_3', 'Metatarsal_4', 'Metatarsal_5'], 'hueso'),
  },
  pasos: [
    {
      id: 'orientacion', tipo: 'orientacion', titulo: 'La sangre de la pierna',
      texto: [
        ['La sangre llega al miembro inferior sobre todo por la arteria femoral y sus ramas.', T(ART, 'The arterial supply to the lower limb is chiefly supplied by the femoral artery and its branches.')],
        ['Vuelve por dos grupos de venas: las profundas, bajo la fascia y junto a las arterias, y las superficiales, bajo la piel, que acaban en las profundas.', T(VEN, 'They can be divided into two groups – deep and superficial:'), T(VEN, 'Deep veins are located underneath the deep fascia of the lower limb, accompanying the major arteries.'), T(VEN, 'Superficial veins are found in the subcutaneous tissue. They eventually drain into the deep veins.')],
        ['Sigue las arterias de arriba abajo.', GUIA],
      ],
      vista: { ver: [...ARTERIAS_MUSLO, ...ARTERIAS_PIERNA, 'dorsal-pie'], contexto: HUESOS, camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'Recorre el miembro.', vistas: [{ nombre: 'De frente', camara: 'anterior' }, { nombre: 'Por detrás', camara: 'posterior' }, { nombre: 'Por dentro', camara: 'medial' }] },
      comprobar: 'rel-femoral-origen',
    },
    {
      id: 'muslo', tipo: 'exploracion', titulo: 'En el muslo',
      texto: [
        ['La ilíaca externa pasa a llamarse femoral al cruzar bajo el ligamento inguinal y entrar en el triángulo femoral.', T(ART, 'The external iliac becomes the femoral artery when it crosses under the inguinal ligament and enters the femoral triangle.')],
        ['Allí da la femoral profunda, cuyas ramas son las perforantes y las circunflejas femorales lateral y medial.', T(ART, 'In the femoral triangle, the profunda femoris artery arises from the posterolateral aspect of the femoral artery. It travels posteriorly and distally, giving off three main branches:')],
        ['La femoral baja por el conducto aductor, atraviesa el hiato del aductor mayor y, detrás de la rodilla, pasa a llamarse poplítea.', T(ART, 'the femoral artery continues down the anterior aspect of the thigh, through a tunnel known as the adductor canal.'), T(ART, 'The adductor canal ends at an opening in the adductor magnus, called the adductor hiatus.'), T(ART, 'The femoral artery is now known as the popliteal artery.')],
      ],
      detalle: [
        ['En el triángulo femoral la arteria está superficial: por ella se introduce el catéter de la coronariografía.', T(ART, 'The femoral artery is located superficially within the femoral triangle, and is thus easy to access.'), T(ART, 'One such procedure is coronary angiography.')],
      ],
      vista: { ver: ARTERIAS_MUSLO, contexto: ['circunflejas', 'perforantes', 'ligamento-inguinal', 'aductor-mayor', 'coxal', 'femur'], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['femoral', 'femoral-profunda'], texto: 'Alterna: la femoral baja por delante y por dentro; la profunda se va hacia atrás y da sus ramas.' },
      comprobar: 'fun-profunda',
    },
    {
      id: 'pierna', tipo: 'exploracion', titulo: 'En la pierna',
      texto: [
        ['La poplítea cruza la fosa poplítea, da las arterias geniculares para la rodilla y, bajo el poplíteo, se divide en la tibial anterior y el tronco tibiofibular.', T(ART, 'The popliteal artery descends down the posterior thigh, giving rise to genicular branches that supply the knee joint.'), T(ART, 'At the lower border of the popliteus, the popliteal artery terminates by dividing into the anterior tibial artery and the tibioperoneal trunk.')],
        ['El tronco da la tibial posterior, que llega a la planta por el túnel tarsiano, y la fibular, detrás de la fíbula.', T(ART, 'In turn, the tibioperoneal trunk bifurcates into the posterior tibial and fibular arteries:'), T(ART, 'It enters the sole of the foot via the tarsal tunnel, accompanying the tibial nerve.'), T(ART, 'descends posteriorly to the fibula, within the posterior compartment of the leg.')],
        ['La tibial anterior atraviesa la membrana interósea y baja por delante hasta el pie, donde se llama dorsal del pie.', T(ART, 'passes anteriorly between the tibia and fibula, through a gap in the interosseous membrane.'), T(ART, 'It runs down the entire length of the leg, and into the foot, where it becomes the dorsalis pedis artery.')],
      ],
      detalle: [
        ['El tronco tibiofibular no está como pieza propia en el modelo.', MODELO],
      ],
      vista: { ver: ARTERIAS_PIERNA, contexto: ['geniculares', 'membrana-interosea', 'femur', 'tibia', 'fibula'], camara: 'posterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['tibial-anterior', 'tibial-posterior', 'fibular'], texto: 'Alterna las tres: la tibial anterior cruza hacia delante; la posterior y la fibular siguen por detrás.' },
      comprobar: 'rel-division',
    },
    {
      id: 'pie', tipo: 'exploracion', titulo: 'En el pie',
      texto: [
        ['El pie recibe sangre de la dorsal del pie (continuación de la tibial anterior) y de la tibial posterior.', T(ART, 'Arterial supply to the foot is delivered via two arteries:')],
        ['La dorsal del pie cruza el dorso del tarso y se une con la plantar lateral en el arco plantar profundo.', T(ART, 'The dorsalis pedis artery begins as the anterior tibial artery enters the foot. It passes over the dorsal aspect of the tarsal bones'), T(ART, 'It then anastomoses with the lateral plantar artery to form the deep plantar arch.')],
        ['La tibial posterior se divide en las plantares lateral y medial, que irrigan la planta.', T(ART, 'It then splits into the lateral and medial plantar arteries. These arteries supply the plantar side of the foot')],
      ],
      vista: { ver: ARTERIAS_PIE, contexto: ['tibial-anterior', 'tibial-posterior', 'pie', 'tibia', 'fibula'], camara: 'medial', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'Mira el dorso y la planta.', vistas: [{ nombre: 'Por dentro', camara: 'medial' }, { nombre: 'Por encima', camara: 'superior' }, { nombre: 'Por debajo', camara: 'inferior' }] },
      comprobar: 'rel-arco',
    },
    {
      id: 'profundas', tipo: 'relaciones', titulo: 'Las venas profundas',
      texto: [
        ['Las venas profundas acompañan a las arterias y llevan su nombre; a menudo comparten vaina, y el latido arterial ayuda al retorno.', T(VEN, 'As a general rule, the deep veins accompany and share the name of the major arteries in the lower limb. Often, the artery and vein are located within the same vascular sheath – so that the arterial pulsations aid the venous return.')],
        ['Detrás de la rodilla, las tibiales y las fibulares forman la vena poplítea, que en el muslo se llama femoral y, bajo el ligamento inguinal, ilíaca externa.', T(VEN, 'the anterior tibial, posterior tibial and fibular veins unite to form the popliteal vein.'), T(VEN, 'Once the popliteal vein has entered the thigh, it is known as the femoral vein.'), T(VEN, 'The femoral vein leaves the thigh by running underneath the inguinal ligament, at which point it is known as the external iliac vein.')],
      ],
      detalle: [
        ['Un coágulo en estas venas es una trombosis venosa profunda; si se suelta, puede viajar a la circulación pulmonar (embolia pulmonar).', T(VEN, 'Deep vein thrombosis (DVT) is the formation of the blood clot within the deep veins of the lower limbs'), T(VEN, 'The main complication of a DVT is pulmonary embolism. The thrombus can become dislodged, and travel into pulmonary circulation.')],
      ],
      vista: { ver: ['vena-poplitea', 'vena-femoral'], contexto: ['venas-tibiales', 'vena-femoral-profunda', 'vena-iliaca-externa', 'femoral', 'poplitea', 'femur', 'tibia'], camara: 'medial', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['vena-poplitea', 'vena-femoral'], texto: 'Alterna la poplítea y la femoral: la misma vena con dos nombres, por encima y por debajo del hiato aductor.' },
      comprobar: 'rel-tvp',
    },
    {
      id: 'superficiales', tipo: 'exploracion', titulo: 'Las safenas',
      texto: [
        ['La safena mayor sale del arco venoso dorsal, sube por la cara medial pasando por delante del maléolo medial y desemboca en la femoral, justo bajo el ligamento inguinal.', T(VEN, 'The long saphenous vein is formed by the dorsal venous arch of the foot, and the dorsal vein of the great toe. It ascends up the medial side of the leg, passing anteriorly to the medial malleolus'), T(VEN, 'The great saphenous vein terminates by draining into the femoral vein immediately inferior to the inguinal ligament.')],
        ['La safena menor sube por detrás, por detrás del maléolo lateral, y entre las cabezas del gastrocnemio desemboca en la poplítea.', T(VEN, 'It moves up the posterior side of the leg, passing posteriorly to the lateral malleolus'), T(VEN, 'the short saphenous vein passes between the two heads of the gastrocnemius muscle and empties into the popliteal vein in the popliteal fossa.')],
      ],
      detalle: [
        ['La safena mayor puede extraerse para usarla en un bypass coronario.', T(VEN, 'Surgically, the great saphenous vein can be harvested and used as a vessel in coronary artery bypasses.')],
        ['Si fallan las válvulas, la sangre refluye a las venas superficiales, que se dilatan y se retuercen: son las varices.', T(VEN, 'If these valves become incompetent, blood can flow back into the superficial veins.'), T(VEN, 'causing them to become dilated and tortuous. This condition is known as varicose veins.')],
      ],
      vista: { ver: ['safena-mayor', 'safena-menor', 'arco-venoso'], contexto: ['vena-femoral', 'vena-poplitea', ...HUESOS], camara: 'medial', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['safena-mayor', 'safena-menor'], texto: 'Alterna las dos safenas: la mayor por dentro hasta la ingle; la menor por detrás hasta la rodilla.' },
      comprobar: 'rel-safena-mayor',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['Ilíaca externa → femoral (con la profunda) → poplítea → tibiales y fibular → dorsal del pie y plantares.', T(ART, 'The external iliac becomes the femoral artery'), T(ART, 'The femoral artery is now known as the popliteal artery.'), T(ART, 'where it becomes the dorsalis pedis artery.')],
        ['Las venas profundas siguen a las arterias; las safenas, bajo la piel, desembocan en la femoral y en la poplítea.', T(VEN, 'the deep veins accompany and share the name of the major arteries'), T(VEN, 'draining into the femoral vein'), T(VEN, 'empties into the popliteal vein')],
      ],
    },
  ],
  preguntas: [
    {
      id: 'rel-femoral-origen', tipo: 'relacion', objetivo: 0, paso: 'orientacion', estructuras: ['iliaca-externa', 'femoral'],
      enunciado: '¿Dónde pasa a llamarse femoral la arteria ilíaca externa?',
      correcta: 'Al cruzar bajo el ligamento inguinal',
      distractores: ['Al atravesar el hiato del aductor', 'Al salir de la aorta', 'En la fosa poplítea'],
      explicacion: 'Bajo el ligamento inguinal entra en el triángulo femoral; en el hiato del aductor, la femoral pasa a ser poplítea.',
      evidencia: [T(ART, 'The external iliac becomes the femoral artery when it crosses under the inguinal ligament and enters the femoral triangle.')],
    },
    { id: 'id-femoral', tipo: 'identificar', estructura: 'femoral', objetivo: 0, paso: 'muslo' },
    { id: 'id-poplitea', tipo: 'identificar', estructura: 'poplitea', objetivo: 0, paso: 'pierna' },
    { id: 'id-tibial-anterior', tipo: 'identificar', estructura: 'tibial-anterior', objetivo: 0, paso: 'pierna' },
    {
      id: 'sec-arterias', tipo: 'secuencia', objetivo: 0, paso: 'muslo',
      enunciado: 'Ordena las arterias desde la pelvis hasta el dorso del pie.',
      orden: ['Ilíaca externa', 'Femoral', 'Poplítea', 'Tibial anterior', 'Dorsal del pie'],
      explicacion: 'Cada una continúa a la anterior y cambia de nombre al pasar una referencia.',
      evidencia: [T(ART, 'The external iliac becomes the femoral artery'), T(ART, 'The femoral artery is now known as the popliteal artery.'), T(ART, 'where it becomes the dorsalis pedis artery.')],
    },
    {
      id: 'fun-profunda', tipo: 'funcion', objetivo: 1, paso: 'muslo', estructuras: ['femoral-profunda', 'circunflejas', 'perforantes'],
      enunciado: '¿Qué ramas da la arteria femoral profunda?',
      correcta: 'Las perforantes y las circunflejas femorales lateral y medial',
      distractores: ['Las geniculares', 'Las tibiales anterior y posterior', 'Las plantares'],
      explicacion: 'Las geniculares son de la poplítea; las tibiales, de su división; las plantares, de la tibial posterior.',
      evidencia: [T(ART, 'Perforating branches – Consists of three or four arteries that perforate the adductor magnus'), T(ART, 'Lateral femoral circumflex artery'), T(ART, 'Medial femoral circumflex artery')],
    },
    {
      id: 'rel-division', tipo: 'relacion', objetivo: 1, paso: 'pierna', estructuras: ['poplitea', 'tibial-anterior'],
      enunciado: '¿En qué se divide la arteria poplítea?',
      correcta: 'En la tibial anterior y el tronco tibiofibular',
      distractores: ['En la femoral y la femoral profunda', 'En las plantares medial y lateral', 'En las circunflejas femorales'],
      explicacion: 'El tronco tibiofibular da después la tibial posterior y la fibular.',
      evidencia: [T(ART, 'the popliteal artery terminates by dividing into the anterior tibial artery and the tibioperoneal trunk.')],
    },
    {
      id: 'rel-arco', tipo: 'relacion', objetivo: 1, paso: 'pie', estructuras: ['dorsal-pie', 'arco-plantar'],
      enunciado: '¿Con qué arteria se une la dorsal del pie para formar el arco plantar profundo?',
      correcta: 'Con la plantar lateral',
      distractores: ['Con la fibular', 'Con la poplítea', 'Con la femoral profunda'],
      explicacion: 'La dorsal del pie baja hacia la planta y se anastomosa con la plantar lateral.',
      evidencia: [T(ART, 'It then anastomoses with the lateral plantar artery to form the deep plantar arch.')],
    },
    {
      id: 'comp-profundas', tipo: 'comparacion', objetivo: 2, paso: 'profundas', estructuras: ['vena-femoral', 'safena-mayor'],
      enunciado: '¿En qué se diferencian las venas profundas de las superficiales?',
      correcta: 'Las profundas van bajo la fascia junto a las arterias; las superficiales, bajo la piel',
      distractores: ['Las profundas llevan sangre oxigenada', 'Las superficiales acaban directamente en el corazón', 'Las profundas no tienen válvulas'],
      explicacion: 'Las superficiales acaban vaciándose en las profundas.',
      evidencia: [T(VEN, 'Deep veins are located underneath the deep fascia of the lower limb, accompanying the major arteries.'), T(VEN, 'Superficial veins are found in the subcutaneous tissue. They eventually drain into the deep veins.')],
    },
    { id: 'id-vena-femoral', tipo: 'identificar', estructura: 'vena-femoral', objetivo: 2, paso: 'profundas' },
    {
      id: 'rel-tvp', tipo: 'relacion', objetivo: 4, paso: 'profundas', estructuras: ['vena-femoral', 'vena-poplitea'],
      enunciado: '¿Cuál es la complicación principal de una trombosis venosa profunda de la pierna?',
      correcta: 'La embolia pulmonar',
      distractores: ['El infarto de miocardio', 'Las varices', 'La necrosis de la cabeza del fémur'],
      explicacion: 'El coágulo puede soltarse y llegar por las venas al corazón derecho y a la circulación pulmonar.',
      evidencia: [T(VEN, 'The main complication of a DVT is pulmonary embolism. The thrombus can become dislodged, and travel into pulmonary circulation.')],
    },
    { id: 'id-safena-mayor', tipo: 'identificar', estructura: 'safena-mayor', objetivo: 3, paso: 'superficiales' },
    {
      id: 'rel-safena-mayor', tipo: 'relacion', objetivo: 3, paso: 'superficiales', estructuras: ['safena-mayor'],
      enunciado: '¿Dónde desemboca la vena safena mayor?',
      correcta: 'En la vena femoral, justo bajo el ligamento inguinal',
      distractores: ['En la vena poplítea', 'En la vena ilíaca interna', 'En el arco venoso dorsal'],
      explicacion: 'La menor desemboca en la poplítea; la mayor sube hasta la ingle.',
      evidencia: [T(VEN, 'The great saphenous vein terminates by draining into the femoral vein immediately inferior to the inguinal ligament.')],
    },
    {
      id: 'rel-safena-menor', tipo: 'relacion', objetivo: 3, paso: 'superficiales', estructuras: ['safena-menor'],
      enunciado: '¿Por dónde pasa la vena safena menor en el tobillo?',
      correcta: 'Por detrás del maléolo lateral',
      distractores: ['Por delante del maléolo medial', 'Por el túnel tarsiano', 'Por delante del maléolo lateral'],
      explicacion: 'La mayor pasa por delante del maléolo medial.',
      evidencia: [T(VEN, 'passing posteriorly to the lateral malleolus')],
    },
  ],
});
