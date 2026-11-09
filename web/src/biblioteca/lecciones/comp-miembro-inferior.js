// Lección «Confusiones frecuentes del miembro inferior». Formato y evidencias: ../formato.js.
// Cinco parejas de estructuras vecinas o de nombre parecido, comparadas una al lado de la otra.
import { leccion, W, T, GUIA } from '../formato.js';

const TIB = 'lower-limb/bones/tibia';
const TOB = 'lower-limb/joints/ankle-joint';
const ANT = 'lower-limb/muscles/thigh/anterior-compartment';
const MED = 'lower-limb/muscles/thigh/medial-compartment';
const FEM = 'lower-limb/nerves/femoral-nerve';
const OBT = 'lower-limb/nerves/obturator-nerve';
const TRI = 'lower-limb/areas/femoral-triangle';
const ROD = 'lower-limb/joints/knee-joint';
const nucleo = (nombre, piezas, tipo, extra = {}) => ({ nombre, piezas, lado: 'bilateral', papel: 'nucleo', tipo, ...extra });
const contexto = (nombre, piezas, tipo) => ({ nombre, piezas, lado: 'bilateral', papel: 'contexto', tipo });

export default leccion({
  id: 'comp-miembro-inferior',
  version: 1,
  titulo: 'Confusiones frecuentes del miembro inferior',
  resumen: 'Cinco parejas que se suelen confundir, comparadas una al lado de la otra: tibia y fíbula, sartorio y grácil, nervios femoral y obturador, arteria y vena femorales, y ligamentos cruzados anterior y posterior. Qué las distingue por posición, inserción, función o recorrido.',
  lugares: [['miembro-inferior', null]],
  sistemas: ['muscular', 'oseo', 'nervioso', 'cardiovascular', 'articular'],
  formato: 'comparacion',
  temas: ['confusiones', 'musculos', 'huesos', 'nervios', 'arterias-venas', 'articulaciones'],
  nivel: 2,
  minutos: 16,
  requisitos: ['mi-huesos', 'mi-muslo-anterior-medial'],
  siguiente: ['comp-miembro-superior', 'mi-rodilla'],
  objetivos: [
    'Distinguir la tibia de la fíbula por su posición, su papel en la carga y su relación con la rodilla y el tobillo.',
    'Distinguir el sartorio del grácil por su origen, su compartimento y su nervio.',
    'Distinguir el nervio femoral del obturador por su recorrido y los músculos que inervan.',
    'Situar la arteria y la vena femorales en el triángulo femoral y decir cuál es lateral.',
    'Distinguir el ligamento cruzado anterior del posterior por sus inserciones y lo que impiden.',
  ],
  estructuras: {
    tibia: nucleo('Tibia', ['Tibia'], 'hueso'),
    fibula: nucleo('Fíbula (peroné)', ['Fibula'], 'hueso'),
    sartorio: nucleo('Músculo sartorio', ['Sartorius_muscle'], 'musculo', { confusiones: ['Músculo recto femoral', 'Músculo aductor largo'] }),
    gracil: nucleo('Músculo grácil', ['Gracilis_muscle'], 'musculo', { confusiones: ['Músculo recto femoral', 'Músculo aductor largo'] }),
    'nervio-femoral': nucleo('Nervio femoral', ['Femoral_nerve'], 'nervio', { confusiones: ['Nervio ciático', 'Nervio safeno'] }),
    'nervio-obturador': nucleo('Nervio obturador', ['Obturator_nerve', 'Anterior_branch_of_obturator_nerve', 'Posterior_branch_of_obturator_nerve'], 'nervio', { confusiones: ['Nervio ciático', 'Nervio safeno'] }),
    'arteria-femoral': nucleo('Arteria femoral', ['Femoral_artery'], 'arteria', { confusiones: ['Arteria femoral profunda', 'Arteria poplítea'] }),
    'vena-femoral': nucleo('Vena femoral', ['Femoral_vein'], 'vena', { confusiones: ['Vena safena mayor', 'Vena poplítea'] }),
    lca: nucleo('Ligamento cruzado anterior', ['Anterior_cruciate_ligament'], 'ligamento', { confusiones: ['Ligamento colateral tibial', 'Ligamento colateral fibular'] }),
    lcp: nucleo('Ligamento cruzado posterior', ['Posterior_cruciate_ligament'], 'ligamento', { confusiones: ['Ligamento colateral tibial', 'Ligamento colateral fibular'] }),
    femur: contexto('Fémur', ['Femur'], 'hueso'),
    coxal: contexto('Hueso coxal', ['Hip_Bone'], 'hueso'),
    rotula: contexto('Rótula', ['Patella'], 'hueso'),
    'ligamento-inguinal': contexto('Ligamento inguinal', ['Inguinal_ligament'], 'ligamento'),
    meniscos: contexto('Meniscos', ['Medial_meniscus', 'Lateral_meniscus'], 'cartilago'),
  },
  pasos: [
    {
      id: 'orientacion', tipo: 'orientacion', titulo: 'Parejas que se confunden',
      texto: [
        ['En el miembro inferior también hay estructuras vecinas o de nombre parecido que es fácil confundir.', GUIA],
        ['En cada paso verás una pareja: compárala con los botones y fíjate en lo que las distingue.', GUIA],
        ['Conviene haber estudiado antes los huesos y el muslo.', GUIA],
      ],
      vista: { ver: ['tibia', 'fibula', 'sartorio', 'gracil', 'nervio-femoral', 'arteria-femoral', 'vena-femoral'], contexto: ['femur', 'coxal', 'rotula'], camara: 'anterior', lado: 'R' },
    },
    {
      id: 'tibia-fibula', tipo: 'relaciones', titulo: 'Tibia y fíbula',
      texto: [
        ['La tibia es el hueso principal de la pierna y soporta el peso; la fíbula está por fuera de ella y es la más delgada.', T(TIB, 'The tibia is the main bone of the lower leg'), T(TIB, 'it is a key weight-bearing structure'), W('Fibula', 'is a leg bone on the lateral side of the tibia'), W('Fibula', 'It is the smaller of the two bones and, in proportion to its length, the most slender of all the long bones.')],
        ['Arriba, la tibia se articula con el fémur en la rodilla; la cabeza de la fíbula queda debajo y no forma parte de la rodilla.', T(TIB, 'This structure articulates with the femoral condyles to form the key articulation of the knee joint.'), W('Fibula', 'below the knee joint and excluded from the formation of this joint.')],
        ['Abajo, cada una forma un maléolo: la tibia, el medial; la fíbula, el lateral.', T(TIB, 'The medial malleolus is a bony projection continuing inferiorly on the medial aspect of the tibia.'), T(TOB, 'the lateral malleolus (a bony prominence projecting from the lateral aspect of the distal fibula)')],
      ],
      vista: { ver: ['tibia', 'fibula'], contexto: ['femur', 'rotula'], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['tibia', 'fibula'], texto: 'Alterna: la tibia, gruesa y medial, llega a la rodilla; la fíbula, fina y lateral, se queda debajo.' },
      comprobar: 'comp-tibia-fibula',
    },
    {
      id: 'sartorio-gracil', tipo: 'relaciones', titulo: 'Sartorio y grácil',
      texto: [
        ['Los dos son largos y finos, cruzan la cadera y la rodilla y terminan en la parte alta de la cara medial de la tibia, cerca uno del otro.', T(ANT, 'The sartorius is the longest muscle in the body. It is long and thin'), T(ANT, 'attaches to the superior, medial surface of the tibia.'), T(MED, 'It crosses at both the hip and knee joints.'), T(MED, 'attaches to the medial surface of the tibial shaft.')],
        ['El sartorio es del compartimento anterior: nace en la espina ilíaca anterosuperior, cruza el muslo en diagonal y lo inerva el nervio femoral.', T(ANT, 'Originates from the anterior superior iliac spine'), T(ANT, 'running across the thigh in a inferomedial direction.'), T(FEM, 'Innervates the anterior thigh muscles that flex the hip joint (pectineus, iliacus, sartorius)')],
        ['El grácil es del compartimento medial: nace en el pubis, baja recto por la cara medial del muslo y lo inerva el nervio obturador.', T(MED, 'Originates from the inferior rami of the pubis and the body of the pubis. It descends down the medial aspect of the thigh'), T(MED, 'The gracilis is the most superficial and medial of the muscles in this compartment.'), T(OBT, 'Innervates the muscles of the medial compartment of the thigh (obturator externus, adductor longus, adductor brevis, adductor magnus and gracilis).')],
        ['El sartorio flexiona, abduce y rota hacia fuera la cadera; el grácil la aduce. Los dos flexionan la rodilla.', T(ANT, 'At the hip joint, it is a flexor, abductor and lateral rotator. At the knee joint, it is also a flexor.'), T(MED, 'Actions: Adduction of the thigh at the hip and flexion of the leg at the knee.')],
      ],
      vista: { ver: ['sartorio', 'gracil'], contexto: ['coxal', 'femur', 'tibia'], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['sartorio', 'gracil'], texto: 'Alterna: el sartorio cruza en diagonal desde la cadera; el grácil baja recto por dentro desde el pubis.' },
      comprobar: 'comp-sartorio-gracil',
    },
    {
      id: 'nervios', tipo: 'relaciones', titulo: 'Nervio femoral y nervio obturador',
      texto: [
        ['Los dos salen del plexo lumbar, de las raíces L2 a L4.', T(FEM, 'The femoral nerve is the largest branch of the lumbar plexus.'), T(FEM, 'It is derived from the anterior rami of nerve roots L2, L3 and L4.'), T(MED, 'the obturator nerve, which arises from the lumbar plexus.')],
        ['El femoral pasa por debajo del ligamento inguinal al triángulo femoral e inerva el compartimento anterior: el cuádriceps, el sartorio, el ilíaco y el pectíneo.', T(FEM, 'The femoral nerve then passes underneath the inguinal ligament to enter the femoral triangle.'), T(FEM, 'Innervates the anterior thigh muscles that flex the hip joint (pectineus, iliacus, sartorius) and extend the knee')],
        ['El obturador llega al muslo por el agujero obturador e inerva el compartimento medial: los aductores, el grácil y el obturador externo.', T('pelvis/bones/hip-bone', 'enclose part of the obturator foramen – through which the obturator nerve, artery and vein pass through to reach the lower limb.'), T(OBT, 'Innervates the muscles of the medial compartment of the thigh (obturator externus, adductor longus, adductor brevis, adductor magnus and gracilis).')],
      ],
      vista: { ver: ['nervio-femoral', 'nervio-obturador'], contexto: ['coxal', 'femur', 'ligamento-inguinal'], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['nervio-femoral', 'nervio-obturador'], texto: 'Alterna: el femoral sale por debajo del ligamento inguinal; el obturador, por el agujero obturador, más medial.' },
      comprobar: 'comp-nervios',
    },
    {
      id: 'vasos-femorales', tipo: 'relaciones', titulo: 'Arteria y vena femorales',
      texto: [
        ['En el triángulo femoral, de fuera adentro, están el nervio femoral, la arteria femoral y la vena femoral: la arteria queda lateral a la vena.', T(TRI, 'Its contents (lateral to medial) are:'), T(TRI, 'Femoral nerve – innervates the anterior compartment of the thigh'), T(TRI, 'Femoral artery – responsible for the majority of the arterial supply to the lower limb.')],
        ['La arteria femoral lleva la mayor parte de la sangre arterial del miembro inferior; en la vena femoral desemboca, dentro del triángulo, la vena safena mayor.', T(TRI, 'Femoral artery – responsible for the majority of the arterial supply to the lower limb.'), T(TRI, 'Femoral vein – the great saphenous vein drains into the femoral vein within the triangle.')],
        ['El pulso femoral se palpa en el punto medio inguinal, entre la espina ilíaca anterosuperior y la sínfisis del pubis.', T('abdomen/areas/inguinal-canal', 'Mid-inguinal point – halfway between the pubic symphysis and the anterior superior iliac spine. The femoral pulse can be palpated here.')],
      ],
      vista: { ver: ['arteria-femoral', 'vena-femoral'], contexto: ['nervio-femoral', 'ligamento-inguinal', 'coxal', 'femur'], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['arteria-femoral', 'vena-femoral'], texto: 'Alterna: la arteria va por fuera de la vena; las dos bajan juntas por el muslo.' },
      comprobar: 'rel-lateral',
    },
    {
      id: 'cruzados', tipo: 'relaciones', titulo: 'Ligamentos cruzados anterior y posterior',
      texto: [
        ['Los dos unen el fémur con la tibia y se cruzan entre sí; de ahí su nombre.', T(ROD, 'Cruciate ligaments – these two ligaments connect the femur and the tibia. In doing so, they cross each other, hence the term ‘cruciate’ (Latin for like a cross)')],
        ['El anterior nace en la parte anterior de la zona intercondílea de la tibia y sube hacia atrás hasta la fosa intercondílea del fémur: impide que la tibia se desplace hacia delante.', T(ROD, 'Anterior cruciate ligament – attaches at the anterior intercondylar region of the tibia where it blends with the medial meniscus. It ascends posteriorly to attach to the femur in the intercondylar fossa. It prevents anterior dislocation of the tibia onto the femur.')],
        ['El posterior nace en la parte posterior de la zona intercondílea y sube hacia delante hasta el cóndilo medial del fémur: impide que la tibia se desplace hacia atrás.', T(ROD, 'Posterior cruciate ligament – attaches at the posterior intercondylar region of the tibia and ascends anteriorly to attach to the anteromedial femoral condyle. It prevents posterior dislocation of the tibia onto the femur.')],
      ],
      detalle: [
        ['El anterior se explora tirando de la tibia hacia delante (cajón anterior); el posterior suele romperse con un golpe en la espinilla con la rodilla flexionada, como contra el salpicadero de un coche.', T(ROD, 'To test for this, you can perform an anterior drawer test, where you attempt to pull the tibia forwards, if it moves, the ligament has been torn.'), T(ROD, 'This occurs when the knee is flexed, and a large force is applied to the shins, pushing the tibia posteriorly. This is often seen in car accidents, where the knee hits the dashboard.')],
      ],
      vista: { ver: ['lca', 'lcp'], contexto: ['femur', 'tibia', 'meniscos'], fantasma: ['rotula'], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['lca', 'lcp'], texto: 'Alterna y gira la rodilla: el anterior sube hacia atrás y el posterior hacia delante, formando una X.' },
      comprobar: 'comp-cruzados',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['Tibia: medial, carga el peso, llega a la rodilla y forma el maléolo medial. Fíbula: lateral, delgada, forma el maléolo lateral.', T(TIB, 'it is a key weight-bearing structure'), W('Fibula', 'excluded from the formation of this joint'), T(TOB, 'the lateral malleolus (a bony prominence projecting from the lateral aspect of the distal fibula)')],
        ['Sartorio: desde la espina ilíaca, compartimento anterior, nervio femoral. Grácil: desde el pubis, compartimento medial, nervio obturador.', T(ANT, 'Originates from the anterior superior iliac spine'), T(MED, 'Originates from the inferior rami of the pubis and the body of the pubis.')],
        ['Femoral: bajo el ligamento inguinal, compartimento anterior. Obturador: por el agujero obturador, compartimento medial. La arteria femoral va por fuera de la vena.', T(FEM, 'passes underneath the inguinal ligament'), T(OBT, 'Innervates the muscles of the medial compartment of the thigh'), T(TRI, 'Its contents (lateral to medial) are:')],
        ['Cruzado anterior: frena la tibia hacia delante. Cruzado posterior: la frena hacia atrás.', T(ROD, 'It prevents anterior dislocation of the tibia onto the femur.'), T(ROD, 'It prevents posterior dislocation of the tibia onto the femur.')],
      ],
    },
  ],
  preguntas: [
    { id: 'id-tibia', tipo: 'identificar', estructura: 'tibia', objetivo: 0, paso: 'tibia-fibula' },
    { id: 'id-fibula', tipo: 'identificar', estructura: 'fibula', objetivo: 0, paso: 'tibia-fibula' },
    {
      id: 'comp-tibia-fibula', tipo: 'comparacion', objetivo: 0, paso: 'tibia-fibula', estructuras: ['tibia', 'fibula'],
      enunciado: '¿Cuál de los dos huesos de la pierna forma parte de la articulación de la rodilla?',
      correcta: 'Solo la tibia',
      distractores: ['Solo la fíbula', 'Los dos', 'Ninguno: la rodilla es solo del fémur y la rótula'],
      explicacion: 'La tibia se articula con los cóndilos del fémur; la cabeza de la fíbula queda debajo de la rodilla, fuera de la articulación.',
      evidencia: [T(TIB, 'This structure articulates with the femoral condyles to form the key articulation of the knee joint.'), W('Fibula', 'below the knee joint and excluded from the formation of this joint.')],
    },
    {
      id: 'rel-maleolos', tipo: 'relacion', objetivo: 0, paso: 'tibia-fibula', estructuras: ['tibia', 'fibula'],
      enunciado: '¿Qué hueso forma el maléolo medial?',
      correcta: 'La tibia',
      distractores: ['La fíbula', 'El astrágalo', 'El calcáneo'],
      explicacion: 'El maléolo medial es de la tibia; el lateral, de la fíbula.',
      evidencia: [T(TIB, 'The medial malleolus is a bony projection continuing inferiorly on the medial aspect of the tibia.')],
    },
    { id: 'id-sartorio', tipo: 'identificar', estructura: 'sartorio', objetivo: 1, paso: 'sartorio-gracil' },
    { id: 'id-gracil', tipo: 'identificar', estructura: 'gracil', objetivo: 1, paso: 'sartorio-gracil' },
    {
      id: 'comp-sartorio-gracil', tipo: 'comparacion', objetivo: 1, paso: 'sartorio-gracil', estructuras: ['sartorio', 'gracil'],
      enunciado: '¿Qué diferencia al sartorio del grácil?',
      correcta: 'El sartorio nace en la espina ilíaca anterosuperior y lo inerva el femoral; el grácil nace en el pubis y lo inerva el obturador',
      distractores: [
        'El sartorio nace en el pubis y lo inerva el obturador; el grácil, en la espina ilíaca y lo inerva el femoral',
        'Los dos son del compartimento medial y los inerva el obturador',
        'El sartorio se inserta en la rótula y el grácil en la fíbula',
      ],
      explicacion: 'Los dos terminan en la cara medial de la tibia, pero el sartorio es anterior (femoral) y el grácil medial (obturador).',
      evidencia: [T(ANT, 'Originates from the anterior superior iliac spine'), T(MED, 'Originates from the inferior rami of the pubis and the body of the pubis.'), T(OBT, 'Innervates the muscles of the medial compartment of the thigh')],
    },
    { id: 'id-nervio-femoral', tipo: 'identificar', estructura: 'nervio-femoral', objetivo: 2, paso: 'nervios' },
    { id: 'id-nervio-obturador', tipo: 'identificar', estructura: 'nervio-obturador', objetivo: 2, paso: 'nervios' },
    {
      id: 'comp-nervios', tipo: 'comparacion', objetivo: 2, paso: 'nervios', estructuras: ['nervio-femoral', 'nervio-obturador'],
      enunciado: '¿Qué nervio pasa por debajo del ligamento inguinal e inerva el cuádriceps?',
      correcta: 'El nervio femoral',
      distractores: ['El nervio obturador', 'El nervio ciático', 'El nervio safeno'],
      explicacion: 'El femoral pasa bajo el ligamento inguinal al triángulo femoral; el obturador llega al muslo por el agujero obturador.',
      evidencia: [T(FEM, 'The femoral nerve then passes underneath the inguinal ligament to enter the femoral triangle.')],
    },
    {
      id: 'rel-obturador', tipo: 'relacion', objetivo: 2, paso: 'nervios', estructuras: ['nervio-obturador'],
      enunciado: '¿Qué músculos inerva el nervio obturador?',
      correcta: 'Los del compartimento medial del muslo: aductores, grácil y obturador externo',
      distractores: ['Los del compartimento anterior: cuádriceps y sartorio', 'Los isquiotibiales', 'Los músculos de la pierna'],
      explicacion: 'El obturador inerva el compartimento medial; el femoral, el anterior.',
      evidencia: [T(OBT, 'Motor functions: Innervates the muscles of the medial compartment of the thigh (obturator externus, adductor longus, adductor brevis, adductor magnus and gracilis).')],
    },
    { id: 'id-arteria-femoral', tipo: 'identificar', estructura: 'arteria-femoral', objetivo: 3, paso: 'vasos-femorales' },
    { id: 'id-vena-femoral', tipo: 'identificar', estructura: 'vena-femoral', objetivo: 3, paso: 'vasos-femorales' },
    {
      id: 'rel-lateral', tipo: 'relacion', objetivo: 3, paso: 'vasos-femorales', estructuras: ['arteria-femoral', 'vena-femoral'],
      enunciado: 'En el triángulo femoral, ¿qué está más lateral: la arteria o la vena femoral?',
      correcta: 'La arteria femoral',
      distractores: ['La vena femoral', 'Están una encima de la otra', 'Depende del lado del cuerpo'],
      explicacion: 'De fuera adentro: nervio, arteria y vena femorales, y el conducto femoral.',
      evidencia: [T(TRI, 'Its contents (lateral to medial) are:')],
    },
    {
      id: 'rel-safena', tipo: 'relacion', objetivo: 3, paso: 'vasos-femorales', estructuras: ['vena-femoral'],
      enunciado: '¿En qué vena desemboca la safena mayor, dentro del triángulo femoral?',
      correcta: 'En la vena femoral',
      distractores: ['En la arteria femoral', 'En la vena poplítea', 'En la vena cava inferior'],
      explicacion: 'La safena mayor, la gran vena superficial del miembro inferior, desemboca en la femoral dentro del triángulo.',
      evidencia: [T(TRI, 'Femoral vein – the great saphenous vein drains into the femoral vein within the triangle.')],
    },
    { id: 'id-lca', tipo: 'identificar', estructura: 'lca', objetivo: 4, paso: 'cruzados' },
    { id: 'id-lcp', tipo: 'identificar', estructura: 'lcp', objetivo: 4, paso: 'cruzados' },
    {
      id: 'comp-cruzados', tipo: 'comparacion', objetivo: 4, paso: 'cruzados', estructuras: ['lca', 'lcp'],
      enunciado: '¿Qué impide el ligamento cruzado anterior?',
      correcta: 'Que la tibia se desplace hacia delante sobre el fémur',
      distractores: ['Que la tibia se desplace hacia atrás sobre el fémur', 'Que la rodilla se abra hacia fuera', 'Que la rótula se luxe hacia fuera'],
      explicacion: 'El anterior frena el desplazamiento de la tibia hacia delante; el posterior, hacia atrás.',
      evidencia: [T(ROD, 'It prevents anterior dislocation of the tibia onto the femur.')],
    },
    {
      id: 'rel-salpicadero', tipo: 'relacion', objetivo: 4, paso: 'cruzados', estructuras: ['lcp'],
      enunciado: 'Un golpe en la espinilla con la rodilla flexionada, contra el salpicadero de un coche, suele romper…',
      correcta: 'El ligamento cruzado posterior',
      distractores: ['El ligamento cruzado anterior', 'El ligamento colateral fibular', 'El menisco lateral'],
      explicacion: 'El golpe empuja la tibia hacia atrás, justo lo que frena el cruzado posterior.',
      evidencia: [T(ROD, 'The most common mechanism of posterior cruciate ligament (PCL) damage is the ‘dashboard injury’.')],
    },
  ],
});
