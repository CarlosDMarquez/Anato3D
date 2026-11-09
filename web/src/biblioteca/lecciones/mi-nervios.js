// Lección «Nervios del miembro inferior». Formato y evidencias: ../formato.js.
import { leccion, T, GUIA, MODELO } from '../formato.js';

const LUM = 'lower-limb/nerves/lumbar-plexus';
const SAC = 'lower-limb/nerves/sacral-plexus';
const CIA = 'lower-limb/nerves/sciatic-nerve';
const TIB = 'lower-limb/nerves/tibial-nerve';
const FIB = 'lower-limb/nerves/common-fibular-nerve';
const FEM = 'lower-limb/nerves/femoral-nerve';
const OBT = 'lower-limb/nerves/obturator-nerve';
const nervio = (nombre, piezas, extra = {}) => ({ nombre, piezas, lado: 'bilateral', papel: 'nucleo', tipo: 'nervio', ...extra });
const contexto = (nombre, piezas, tipo, lado = 'bilateral') => ({ nombre, piezas, lado, papel: 'contexto', tipo });

const LUMBARES = ['iliohipogastrico', 'ilioinguinal', 'genitofemoral', 'cutaneo-femoral-lateral', 'femoral', 'obturador'];
const SACROS = ['gluteo-superior', 'ciatico', 'cutaneo-femoral-posterior'];
const RAMAS_CIATICO = ['tibial', 'fibular-comun', 'fibular-superficial', 'fibular-profundo'];
const HUESOS = ['coxal', 'femur', 'tibia', 'fibula'];

export default leccion({
  id: 'mi-nervios',
  version: 1,
  titulo: 'Nervios del miembro inferior',
  resumen: 'Los plexos lumbar y sacro y sus nervios: los seis del plexo lumbar (con el femoral y el obturador para el muslo), el glúteo superior y el ciático, el más grande del cuerpo, que se divide en el tibial y el fibular común. Qué compartimento inerva cada uno y dónde se lesionan.',
  lugares: [['miembro-inferior', 'glutea'], ['miembro-inferior', 'muslo'], ['miembro-inferior', 'pierna'], ['miembro-inferior', 'pie']],
  sistemas: ['nervioso'],
  formato: 'trayectos',
  temas: ['nervios'],
  nivel: 2,
  minutos: 20,
  requisitos: ['sis-nervioso', 'mi-muslo-anterior-medial'],
  siguiente: ['mi-glutea', 'mi-pierna-anterior-lateral', 'comp-miembro-inferior'],
  objetivos: [
    'Describir dónde están los plexos lumbar y sacro y qué ramos los forman.',
    'Nombrar los nervios principales de cada plexo y localizarlos en el modelo.',
    'Seguir el trayecto del nervio ciático y de sus dos ramas terminales.',
    'Relacionar cada nervio con el compartimento que inerva.',
    'Predecir qué falla cuando se lesiona el nervio fibular común o el glúteo superior.',
  ],
  estructuras: {
    iliohipogastrico: nervio('Nervio iliohipogástrico', ['Iliohypogastric_nerve']),
    ilioinguinal: nervio('Nervio ilioinguinal', ['Ilio_inguinal_nerve']),
    genitofemoral: nervio('Nervio genitofemoral', ['Genitofemoral_nerve', 'Genital_branch_of_genitofemoral_nerve', 'Femoral_branch_of_genitofemoral_nerve']),
    'cutaneo-femoral-lateral': nervio('Nervio cutáneo femoral lateral', ['Lateral_femoral_cutaneous_nerve']),
    femoral: nervio('Nervio femoral', ['Femoral_nerve'], { confusiones: ['Nervio ciático'] }),
    obturador: nervio('Nervio obturador', ['Obturator_nerve', 'Anterior_branch_of_obturator_nerve', 'Posterior_branch_of_obturator_nerve']),
    safeno: nervio('Nervio safeno', ['Saphenous_nerve']),
    'gluteo-superior': nervio('Nervio glúteo superior', ['Superior_gluteal_nerve']),
    ciatico: nervio('Nervio ciático', ['Sciatic_nerve']),
    'cutaneo-femoral-posterior': nervio('Nervio cutáneo femoral posterior', ['Posterior_femoral_cutaneous_nerve']),
    pudendo: { nombre: 'Nervio pudendo', piezas: ['Pudendal_nerve'], lado: 'bilateral', papel: 'contexto', tipo: 'nervio' },
    tibial: nervio('Nervio tibial', ['Tibial_nerve']),
    'fibular-comun': nervio('Nervio fibular común (peroneo común)', ['Common_fibular_nerve']),
    'fibular-superficial': nervio('Nervio fibular superficial', ['Superficial_fibular_nerve']),
    'fibular-profundo': nervio('Nervio fibular profundo', ['Deep_fibular_nerve', 'Muscular_branches_of_deep_fibular_nerve']),
    plantares: contexto('Nervios plantares medial y lateral', ['Medial_plantar_nerve', 'Lateral_plantar_nerve'], 'nervio'),
    psoas: contexto('Músculo psoas mayor', ['Psoas_major'], 'musculo'),
    'cuadrado-lumbar': contexto('Músculo cuadrado lumbar', ['Quadratus_lumborum_muscle'], 'musculo'),
    piriforme: contexto('Músculo piriforme', ['Piriformis_muscle'], 'musculo'),
    'biceps-femoral': contexto('Músculo bíceps femoral', ['Long_head_of_biceps_femoris', 'Short_head_of_biceps_femoris'], 'musculo'),
    'fibular-largo': contexto('Músculo fibular largo', ['Fibularis_longus_muscle'], 'musculo'),
    'ligamento-inguinal': contexto('Ligamento inguinal', ['Inguinal_ligament'], 'ligamento'),
    lumbares: contexto('Vértebras lumbares', ['Vertebra_L1', 'Vertebra_L2', 'Vertebra_L3', 'Vertebra_L4', 'Vertebra_L5'], 'hueso', 'impar'),
    sacro: contexto('Sacro', ['Sacrum'], 'hueso', 'impar'),
    coxal: contexto('Hueso coxal', ['Hip_Bone'], 'hueso'),
    femur: contexto('Fémur', ['Femur'], 'hueso'),
    tibia: contexto('Tibia', ['Tibia'], 'hueso'),
    fibula: contexto('Fíbula', ['Fibula'], 'hueso'),
  },
  pasos: [
    {
      id: 'orientacion', tipo: 'orientacion', titulo: 'Dos plexos para la pierna',
      texto: [
        ['El plexo lumbar está dentro del psoas mayor, delante de las apófisis transversas lumbares; lo forman los ramos anteriores de L1 a L4, con ayuda de T12.', T(LUM, 'It is located in the lumbar region, within the substance of the psoas major muscle and anterior to the transverse processes of the lumbar vertebrae.'), T(LUM, 'The plexus is formed by the anterior rami (divisions) of the lumbar spinal nerves L1, L2, L3 and L4. It also receives contributions from thoracic spinal nerve 12.')],
        ['El plexo sacro está en la pared posterior de la pelvis, delante del piriforme; lo forman S1 a S4, con L4 y L5.', T(SAC, 'It is located on the surface of the posterior pelvic wall, anterior to the piriformis muscle.'), T(SAC, 'The plexus is formed by the anterior rami (divisions) of the sacral spinal nerves S1, S2, S3 and S4. It also receives contributions from the lumbar spinal nerves L4 and L5.')],
        ['Míralos de frente y por detrás, con la pelvis y el fémur de referencia.', GUIA],
      ],
      vista: { ver: [...LUMBARES, ...SACROS], contexto: ['lumbares', 'sacro', 'coxal', 'femur'], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'Recorre los dos plexos.', vistas: [{ nombre: 'De frente', camara: 'anterior' }, { nombre: 'Por detrás', camara: 'posterior' }, { nombre: 'Por fuera', camara: 'lateral' }] },
      comprobar: 'rel-plexo-lumbar',
    },
    {
      id: 'lumbar', tipo: 'exploracion', titulo: 'Las ramas del plexo lumbar',
      texto: [
        ['El plexo lumbar da seis nervios que bajan por la pared posterior del abdomen.', T(LUM, 'These cords then combine together to form the six major peripheral nerves of the lumbar plexus. These nerves then descend down the posterior abdominal wall to reach the lower limb')],
        ['El iliohipogástrico y el ilioinguinal (L1) inervan el oblicuo interno y el transverso; el genitofemoral (L1 y L2) se divide en una rama genital y otra femoral.', T(LUM, 'Roots: L1 (with contributions from T12).'), T(LUM, 'Motor Functions: Innervates the internal oblique and transversus abdominis.'), T(LUM, 'the genitofemoral nerve quickly divides into a genital branch, and a femoral branch.')],
        ['El cutáneo femoral lateral (L2 y L3) es solo sensitivo: entra en el muslo por el extremo lateral del ligamento inguinal.', T(LUM, 'This nerve has a purely sensory function. It enters the thigh at the lateral aspect of the inguinal ligament')],
      ],
      vista: { ver: ['iliohipogastrico', 'ilioinguinal', 'genitofemoral', 'cutaneo-femoral-lateral'], contexto: ['psoas', 'cuadrado-lumbar', 'ligamento-inguinal', 'lumbares', 'coxal'], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['iliohipogastrico', 'ilioinguinal', 'genitofemoral', 'cutaneo-femoral-lateral'], texto: 'Alterna los cuatro: los dos primeros van hacia la cresta ilíaca, el genitofemoral baja sobre el psoas y el cutáneo lateral sale por fuera del ligamento inguinal.' },
      comprobar: 'rel-cutaneo-lateral',
    },
    {
      id: 'femoral-obturador', tipo: 'exploracion', titulo: 'Femoral y obturador',
      texto: [
        ['El femoral (L2 a L4), la rama más grande del plexo lumbar, baja a través del psoas y pasa bajo el ligamento inguinal al triángulo femoral.', T(FEM, 'The femoral nerve is the largest branch of the lumbar plexus.'), T(FEM, 'It is derived from the anterior rami of nerve roots L2, L3 and L4.'), T(FEM, 'The femoral nerve then passes underneath the inguinal ligament to enter the femoral triangle.')],
        ['Su rama cutánea final es el safeno, que recoge la cara medial de la pierna y del pie.', T(FEM, 'The terminal cutaneous branch of the femoral nerve is the saphenous nerve.'), T(FEM, 'The saphenous nerve innervates the medial aspect of the leg and the foot.')],
        ['El obturador (L2 a L4) sale por el borde medial del psoas y va por la pared de la pelvis hacia el agujero obturador.', T(OBT, 'After its formation, the obturator nerve descends through the fibres of the psoas major and emerges from its medial border.'), T(OBT, 'towards the obturator foramen of the pelvis.')],
      ],
      vista: { ver: ['femoral', 'obturador', 'safeno'], contexto: ['psoas', 'ligamento-inguinal', 'coxal', 'femur', 'tibia'], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['femoral', 'obturador'], texto: 'Alterna: el femoral sale por fuera del psoas y pasa bajo el ligamento inguinal; el obturador sale por dentro y va al agujero obturador.' },
      comprobar: 'rel-femoral-entrada',
    },
    {
      id: 'sacro', tipo: 'exploracion', titulo: 'El plexo sacro y el glúteo superior',
      texto: [
        ['Los nervios del plexo sacro salen de la pelvis por el agujero ciático mayor hacia la región glútea, o se quedan en la pelvis.', T(SAC, 'Leave the pelvis via the greater sciatic foramen – these nerves enter the gluteal region of the lower limb, innervating the structures there.'), T(SAC, 'Remain in the pelvis – these nerves innervate the pelvic muscles, organs and perineum.')],
        ['El glúteo superior sale por encima del piriforme e inerva el glúteo menor, el glúteo medio y el tensor de la fascia lata.', T(SAC, 'entering the gluteal region superiorly to the piriformis muscle.'), T(SAC, 'Motor Functions: Innervates the gluteus minimus, gluteus medius and tensor fascia lata.')],
        ['El glúteo inferior sale por debajo del piriforme e inerva el glúteo mayor.', T(SAC, 'The inferior gluteal nerve leaves the pelvis via the greater sciatic foramen, entering the gluteal region inferiorly to the piriformis muscle.'), T(SAC, 'Motor Functions: Innervates gluteus maximus.')],
      ],
      detalle: [
        ['El modelo no tiene el nervio glúteo inferior como pieza propia; el pudendo, que se queda en la pelvis y el periné, sí está.', MODELO],
      ],
      vista: { ver: ['gluteo-superior', 'ciatico', 'cutaneo-femoral-posterior'], contexto: ['pudendo', 'piriforme', 'sacro', 'coxal', 'femur'], camara: 'posterior', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'gluteo-superior', texto: 'Toca el nervio que sale por encima del piriforme.' },
      comprobar: 'rel-piriforme',
    },
    {
      id: 'ciatico', tipo: 'exploracion', titulo: 'El nervio ciático',
      texto: [
        ['El ciático (L4 a S3) es el nervio más grande del cuerpo: una banda plana de unos 2 cm.', T(CIA, 'It is a thick flat band, approximately 2cm wide – the largest nerve in the body.'), T(SAC, 'Roots: L4, L5, S1, S2, S3')],
        ['Sale de la pelvis por el agujero ciático mayor, por debajo del piriforme, y entra en el muslo por debajo de la cabeza larga del bíceps femoral.', T(CIA, 'it leaves the pelvis and enters the gluteal region via greater sciatic foramen. It emerges inferiorly to the piriformis muscle'), T(CIA, 'It then enters the posterior thigh by passing deep to the long head of the biceps femoris.')],
        ['En el vértice de la fosa poplítea se divide en los nervios tibial y fibular común.', T(CIA, 'When the sciatic nerve reaches the apex of the popliteal fossa, it terminates by bifurcating into the tibial and common fibular nerves.')],
      ],
      detalle: [
        ['Pasa por el cuadrante inferomedial de la nalga: las inyecciones intramusculares se ponen solo en el superolateral.', T(CIA, 'The sciatic nerve passes through the lower medial quadrant. To avoid damaging the sciatic nerve therefore, intramuscular injections are given only in the upper lateral quadrant of the gluteal region.')],
        ['Aunque cruza la región glútea, no inerva ningún músculo glúteo.', T(CIA, 'Although the sciatic nerve passes through the gluteal region, it does not innervate any muscles there.')],
      ],
      vista: { ver: ['ciatico', 'tibial', 'fibular-comun'], contexto: ['piriforme', 'biceps-femoral', 'coxal', 'femur', 'tibia', 'fibula'], camara: 'posterior', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'ciatico', texto: 'Toca el nervio más grueso del muslo, por detrás.' },
      comprobar: 'rel-division',
    },
    {
      id: 'tibial-fibular', tipo: 'relaciones', titulo: 'Tibial y fibular común',
      texto: [
        ['El tibial cruza la fosa poplítea y pasa por detrás del maléolo medial, por el túnel tarsiano, hacia la planta.', T(TIB, 'It travels through the popliteal fossa, giving off branches to muscles in the superficial posterior compartment of the leg.'), T(TIB, 'At the foot, the nerve passes posteriorly and inferiorly to the medial malleolus, through a structure known as the tarsal tunnel.')],
        ['El fibular común sigue el borde medial del bíceps femoral y rodea el cuello de la fíbula, donde se divide en el fibular superficial y el profundo.', T(FIB, 'It follows the medial border of the biceps femoris, running in an inferolateral direction, over the lateral head of the gastrocnemius.'), T(FIB, 'To enter the lateral compartment of the leg, the nerve wraps around the neck of the fibula'), T(FIB, 'Here, the common fibular nerve terminates by dividing into the superficial fibular and deep fibular nerves.')],
        ['Por eso una fractura del cuello de la fíbula o una escayola apretada pueden dañarlo: el pie queda caído, en flexión plantar.', T(FIB, 'The common fibular nerve is most commonly damaged by a fracture of the fibula, or the use of a tight plaster cast.'), T(FIB, 'The anatomical course of the common fibular nerve causes it to wrap round the neck of the fibular, and so any fractures of the fibular neck can cause nerve palsy.'), T(FIB, 'Hence the foot will appear permanently plantarflexed – known as footdrop.')],
      ],
      vista: { ver: RAMAS_CIATICO, contexto: ['plantares', 'biceps-femoral', 'fibular-largo', 'tibia', 'fibula', 'femur'], camara: 'posterolateral', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['tibial', 'fibular-comun'], texto: 'Alterna: el tibial sigue recto por detrás hacia el tobillo; el fibular común se va hacia fuera y rodea el cuello de la fíbula.' },
      comprobar: 'rel-cuello-fibula',
    },
    {
      id: 'territorios', tipo: 'funcion', titulo: 'Qué inerva cada uno',
      texto: [
        ['Muslo: el femoral inerva el compartimento anterior; el obturador, el medial, y el ciático, el posterior.', T(FEM, 'Motor functions: Innervates the anterior thigh muscles that flex the hip joint'), T(OBT, 'Motor functions: Innervates the muscles of the medial compartment of the thigh'), T(CIA, 'the sciatic nerve does directly innervate the muscles in the posterior compartment of the thigh')],
        ['Pierna y pie: el tibial inerva el compartimento posterior y la mayoría de los músculos del pie; el fibular superficial, el lateral, y el profundo, el anterior.', T(TIB, 'Motor: Innervates the posterior compartment of the leg and the majority of the intrinsic foot muscles.'), T(FIB, 'Superficial fibular nerve: Innervates the muscles of the lateral compartment of the leg; fibularis longus and brevis.'), T(FIB, 'Deep fibular nerve: Innervates the muscles of the anterior compartment of the leg')],
        ['Los músculos anteriores de la pierna hacen la flexión dorsal del pie y extienden los dedos.', T(FIB, 'These muscles act to dorsiflex the foot and extend the digits.')],
      ],
      vista: { ver: ['femoral', 'obturador', 'ciatico', 'tibial', 'fibular-superficial', 'fibular-profundo'], contexto: HUESOS, camara: 'anterolateral', lado: 'R' },
      comprobar: 'fun-fibular-profundo',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['El plexo lumbar (L1 a L4) da el femoral y el obturador para el muslo; el sacro (L4 a S4) da los glúteos y el ciático.', T(LUM, 'The plexus is formed by the anterior rami (divisions) of the lumbar spinal nerves L1, L2, L3 and L4.'), T(SAC, 'Some Irish Sailor Pesters Polly')],
        ['El ciático sale por debajo del piriforme y se divide en el vértice de la fosa poplítea en el tibial y el fibular común.', T(CIA, 'It emerges inferiorly to the piriformis muscle'), T(CIA, 'it terminates by bifurcating into the tibial and common fibular nerves.')],
        ['El fibular común rodea el cuello de la fíbula: si se lesiona ahí, el pie cae.', T(FIB, 'wrap round the neck of the fibular, and so any fractures of the fibular neck can cause nerve palsy.'), T(FIB, 'Hence the foot will appear permanently plantarflexed – known as footdrop.')],
      ],
    },
  ],
  preguntas: [
    {
      id: 'rel-plexo-lumbar', tipo: 'relacion', objetivo: 0, paso: 'orientacion', estructuras: ['psoas'],
      enunciado: '¿Dónde está el plexo lumbar?',
      correcta: 'Dentro del músculo psoas mayor',
      distractores: ['Delante del músculo piriforme', 'Entre los escalenos anterior y medio', 'Dentro del conducto inguinal'],
      explicacion: 'El plexo lumbar está dentro del psoas mayor; el sacro, delante del piriforme; entre los escalenos pasa el plexo braquial.',
      evidencia: [T(LUM, 'within the substance of the psoas major muscle')],
    },
    {
      id: 'rel-plexo-sacro', tipo: 'relacion', objetivo: 0, paso: 'orientacion', estructuras: ['sacro', 'piriforme'],
      enunciado: '¿Qué ramos forman el plexo sacro?',
      correcta: 'Los ramos anteriores de S1 a S4, con L4 y L5',
      distractores: ['Los ramos anteriores de L1 a L4, con T12', 'Los ramos posteriores de S1 a S4', 'Los ramos anteriores de C5 a T1'],
      explicacion: 'L1 a L4 (con T12) forman el plexo lumbar; C5 a T1, el braquial.',
      evidencia: [T(SAC, 'The plexus is formed by the anterior rami (divisions) of the sacral spinal nerves S1, S2, S3 and S4. It also receives contributions from the lumbar spinal nerves L4 and L5.')],
    },
    { id: 'id-cutaneo-femoral-lateral', tipo: 'identificar', estructura: 'cutaneo-femoral-lateral', objetivo: 1, paso: 'lumbar' },
    {
      id: 'rel-cutaneo-lateral', tipo: 'relacion', objetivo: 1, paso: 'lumbar', estructuras: ['cutaneo-femoral-lateral'],
      enunciado: '¿Qué tiene de particular el nervio cutáneo femoral lateral?',
      correcta: 'Es solo sensitivo: no inerva ningún músculo',
      distractores: ['Inerva el cuádriceps', 'Inerva los músculos aductores', 'Sale de la pelvis por el agujero ciático mayor'],
      explicacion: 'Entra en el muslo por el extremo lateral del ligamento inguinal y solo recoge la piel de la cara anterior y lateral del muslo.',
      evidencia: [T(LUM, 'This nerve has a purely sensory function.'), T(LUM, 'Sensory Functions: Innervates the anterior and lateral thigh down to the level of the knee.')],
    },
    { id: 'id-femoral', tipo: 'identificar', estructura: 'femoral', objetivo: 1, paso: 'femoral-obturador' },
    { id: 'loc-obturador', tipo: 'localizar', estructura: 'obturador', candidatas: ['femoral', 'genitofemoral'], objetivo: 1, paso: 'femoral-obturador' },
    {
      id: 'rel-femoral-entrada', tipo: 'relacion', objetivo: 1, paso: 'femoral-obturador', estructuras: ['femoral'],
      enunciado: '¿Por dónde entra el nervio femoral en el muslo?',
      correcta: 'Por debajo del ligamento inguinal, al triángulo femoral',
      distractores: ['Por el agujero obturador', 'Por el agujero ciático mayor, bajo el piriforme', 'Por detrás del maléolo medial'],
      explicacion: 'Por el agujero obturador va el obturador; por el ciático mayor, el ciático, y por detrás del maléolo medial, el tibial.',
      evidencia: [T(FEM, 'The femoral nerve then passes underneath the inguinal ligament to enter the femoral triangle.')],
    },
    { id: 'id-gluteo-superior', tipo: 'identificar', estructura: 'gluteo-superior', objetivo: 1, paso: 'sacro' },
    { id: 'id-ciatico', tipo: 'identificar', estructura: 'ciatico', objetivo: 2, paso: 'ciatico' },
    { id: 'id-tibial', tipo: 'identificar', estructura: 'tibial', objetivo: 2, paso: 'tibial-fibular' },
    { id: 'id-fibular-comun', tipo: 'identificar', estructura: 'fibular-comun', objetivo: 2, paso: 'tibial-fibular' },
    {
      id: 'rel-piriforme', tipo: 'relacion', objetivo: 2, paso: 'sacro', estructuras: ['ciatico', 'piriforme'],
      enunciado: '¿Por dónde entra el nervio ciático en la región glútea?',
      correcta: 'Por el agujero ciático mayor, por debajo del piriforme',
      distractores: ['Por el agujero ciático mayor, por encima del piriforme', 'Por debajo del ligamento inguinal', 'Por el agujero obturador'],
      explicacion: 'Por encima del piriforme sale el glúteo superior; bajo el ligamento inguinal pasa el femoral; por el agujero obturador, el obturador.',
      evidencia: [T(CIA, 'enters the gluteal region via greater sciatic foramen. It emerges inferiorly to the piriformis muscle')],
    },
    {
      id: 'rel-division', tipo: 'relacion', objetivo: 2, paso: 'ciatico', estructuras: ['ciatico'],
      enunciado: '¿Dónde se divide normalmente el nervio ciático?',
      correcta: 'En el vértice de la fosa poplítea',
      distractores: ['En la región glútea, bajo el piriforme', 'En el túnel tarsiano', 'En el cuello de la fíbula'],
      explicacion: 'Se divide en el tibial y el fibular común en el vértice de la fosa poplítea; en un 12 % de personas se separan ya al salir de la pelvis.',
      evidencia: [T(CIA, 'When the sciatic nerve reaches the apex of the popliteal fossa, it terminates by bifurcating into the tibial and common fibular nerves.'), T(CIA, 'however in approximately 12% of people they separate as they leave the pelvis.')],
    },
    {
      id: 'sec-ciatico', tipo: 'secuencia', objetivo: 2, paso: 'ciatico',
      enunciado: 'Ordena el trayecto del nervio ciático y de su rama fibular.',
      orden: ['Agujero ciático mayor', 'Debajo del piriforme', 'Muslo, bajo el bíceps femoral', 'Vértice de la fosa poplítea', 'Cuello de la fíbula'],
      explicacion: 'Sale de la pelvis bajo el piriforme, baja por el muslo y se divide en la fosa poplítea; el fibular común rodea luego el cuello de la fíbula.',
      evidencia: [T(CIA, 'enters the gluteal region via greater sciatic foramen'), T(CIA, 'It then enters the posterior thigh by passing deep to the long head of the biceps femoris.'), T(FIB, 'the nerve wraps around the neck of the fibula')],
    },
    {
      id: 'fun-femoral', tipo: 'funcion', objetivo: 3, paso: 'territorios', estructuras: ['femoral'],
      enunciado: '¿Qué compartimento del muslo inerva el nervio femoral?',
      correcta: 'El anterior',
      distractores: ['El medial', 'El posterior', 'Ninguno: es solo sensitivo'],
      explicacion: 'El femoral inerva los músculos anteriores (cuádriceps, sartorio); el obturador, los mediales, y el ciático, los posteriores.',
      evidencia: [T(FEM, 'Motor functions: Innervates the anterior thigh muscles that flex the hip joint (pectineus, iliacus, sartorius) and extend the knee')],
    },
    {
      id: 'fun-fibular-profundo', tipo: 'funcion', objetivo: 3, paso: 'territorios', estructuras: ['fibular-profundo'],
      enunciado: '¿Qué músculos inerva el nervio fibular profundo?',
      correcta: 'Los del compartimento anterior de la pierna',
      distractores: ['Los del compartimento lateral de la pierna', 'Los del compartimento posterior de la pierna', 'Los de la planta del pie'],
      explicacion: 'El profundo inerva el tibial anterior y los extensores largos; el superficial, los fibulares, y el tibial, los posteriores y la planta.',
      evidencia: [T(FIB, 'Deep fibular nerve: Innervates the muscles of the anterior compartment of the leg; tibialis anterior, extensor digitorum longus and extensor hallucis longus.')],
    },
    {
      id: 'fun-tibial', tipo: 'funcion', objetivo: 3, paso: 'territorios', estructuras: ['tibial'],
      enunciado: '¿Qué inerva el nervio tibial?',
      correcta: 'El compartimento posterior de la pierna y casi todos los músculos del pie',
      distractores: ['El compartimento anterior de la pierna', 'Los músculos fibulares largo y corto', 'El cuádriceps femoral'],
      explicacion: 'El anterior es del fibular profundo, los fibulares del superficial y el cuádriceps del femoral.',
      evidencia: [T(TIB, 'Motor: Innervates the posterior compartment of the leg and the majority of the intrinsic foot muscles.')],
    },
    {
      id: 'rel-cuello-fibula', tipo: 'relacion', objetivo: 4, paso: 'tibial-fibular', estructuras: ['fibular-comun', 'fibula'],
      enunciado: 'Tras una fractura del cuello de la fíbula, el pie cuelga en flexión plantar. ¿Qué nervio se ha lesionado?',
      correcta: 'El fibular común',
      distractores: ['El tibial', 'El femoral', 'El obturador'],
      explicacion: 'El fibular común rodea el cuello de la fíbula; sin los músculos anteriores, el pie no se levanta (pie caído).',
      evidencia: [T(FIB, 'any fractures of the fibular neck can cause nerve palsy.'), T(FIB, 'Hence the foot will appear permanently plantarflexed – known as footdrop.')],
    },
    {
      id: 'rel-gluteo-superior', tipo: 'relacion', objetivo: 4, paso: 'sacro', estructuras: ['gluteo-superior'],
      enunciado: 'Si se lesiona el nervio glúteo superior, ¿qué músculos se paralizan?',
      correcta: 'El glúteo medio, el glúteo menor y el tensor de la fascia lata',
      distractores: ['El glúteo mayor', 'Los isquiotibiales', 'El piriforme y los gemelos'],
      explicacion: 'El glúteo superior inerva los dos abductores profundos y el tensor; el glúteo mayor es del glúteo inferior.',
      evidencia: [T(SAC, 'Motor Functions: Innervates the gluteus minimus, gluteus medius and tensor fascia lata.')],
    },
  ],
});
