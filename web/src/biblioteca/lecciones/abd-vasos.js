// Lección «Aorta abdominal, vena cava inferior y vena porta». Formato y evidencias: ../formato.js.
import { leccion, T, GUIA } from '../formato.js';

const AO = 'abdomen/vasculature/arteries/aorta';
const CEL = 'abdomen/vasculature/arteries/coeliac-trunk';
const AMS = 'abdomen/vasculature/arteries/superior-mesenteric';
const AMI = 'abdomen/vasculature/arteries/inferior-mesenteric';
const VEN = 'abdomen/vasculature/venous-drainage';
const vaso = (nombre, piezas, tipo, lado = 'impar') => ({ nombre, piezas, lado, papel: 'nucleo', tipo });
const contexto = (nombre, piezas, tipo, lado = 'impar') => ({ nombre, piezas, lado, papel: 'contexto', tipo });

const TRONCOS = ['celiaco', 'mesenterica-superior', 'mesenterica-inferior'];
const PORTA = ['porta', 'esplenica-vena', 'mesenterica-superior-vena'];
const VERTEBRAS = ['t12', 'l1', 'l2', 'l3', 'l4', 'l5'];

export default leccion({
  id: 'abd-vasos',
  version: 1,
  titulo: 'Aorta abdominal, vena cava inferior y vena porta',
  resumen: 'Los grandes vasos del abdomen: la aorta abdominal, de T12 a L4, con sus tres troncos para el tubo digestivo (celíaco, mesentérica superior e inferior) y sus ramas pares; la vena cava inferior y lo que recoge; y la vena porta, que lleva al hígado la sangre del intestino, con las anastomosis que se dilatan en la hipertensión portal.',
  lugares: [['abdomen', 'vasos-nervios-abdomen']],
  sistemas: ['cardiovascular'],
  formato: 'trayectos',
  temas: ['arterias-venas'],
  nivel: 3,
  minutos: 18,
  requisitos: ['sis-cardiovascular', 'sis-digestivo'],
  siguiente: ['abd-rinones', 'abd-tubo-digestivo', 'abd-higado-pancreas'],
  objetivos: [
    'Situar la aorta abdominal respecto a las vértebras y ordenar sus ramas principales.',
    'Asociar el tronco celíaco y las mesentéricas con las partes del tubo digestivo que irrigan.',
    'Describir la formación y el recorrido de la vena cava inferior.',
    'Explicar cómo se forma la vena porta y qué pasa en la hipertensión portal.',
  ],
  estructuras: {
    aorta: vaso('Aorta abdominal', ['Abdominal_aorta'], 'arteria'),
    celiaco: vaso('Tronco celíaco', ['Coeliac_trunk'], 'arteria'),
    'mesenterica-superior': vaso('Arteria mesentérica superior', ['Superior_mesenteric_artery'], 'arteria'),
    'mesenterica-inferior': vaso('Arteria mesentérica inferior', ['Inferior_mesenteric_artery'], 'arteria'),
    'esplenica-arteria': vaso('Arteria esplénica', ['Splenic_artery'], 'arteria'),
    'hepatica-comun': vaso('Arteria hepática común', ['Common_hepatic_artery'], 'arteria'),
    'gastrica-izquierda': vaso('Arteria gástrica izquierda', ['Left_gastric_artery'], 'arteria'),
    'iliacas-comunes': vaso('Arterias ilíacas comunes', ['Common_iliac_artery'], 'arteria', 'ambos'),
    cava: vaso('Vena cava inferior', ['Inferior_vena_cava_abdominal_part'], 'vena'),
    porta: vaso('Vena porta hepática', ['Hepatic_portal_vein'], 'vena'),
    'esplenica-vena': vaso('Vena esplénica', ['Splenic_vein'], 'vena'),
    'mesenterica-superior-vena': vaso('Vena mesentérica superior', ['Superior_mesenteric_vein'], 'vena'),
    'renales-arterias': contexto('Arterias renales', ['Right_renal_artery', 'Left_renal_artery'], 'arteria'),
    'renales-venas': contexto('Venas renales', ['Right_renal_vein', 'Left_renal_vein'], 'vena'),
    'iliacas-venas': contexto('Venas ilíacas comunes', ['Common_iliac_vein'], 'vena', 'ambos'),
    'venas-hepaticas': contexto('Venas hepáticas', ['Hepatic_veins'], 'vena'),
    'mesenterica-inferior-vena': contexto('Vena mesentérica inferior', ['Inferior_mesenteric_vein'], 'vena'),
    'frenicas': contexto('Arterias frénicas inferiores', ['Inferior_phrenic_artery'], 'arteria'),
    rinones: contexto('Riñones', ['Kidney'], 'organo', 'ambos'),
    higado: contexto('Hígado', ['Liver'], 'organo'),
    bazo: contexto('Bazo', ['Spleen'], 'organo'),
    diafragma: contexto('Diafragma', ['Diaphragm'], 'musculo'),
    t12: contexto('Vértebra T12', ['Vertebra_T12'], 'hueso'),
    l1: contexto('Vértebra L1', ['Vertebra_L1'], 'hueso'),
    l2: contexto('Vértebra L2', ['Vertebra_L2'], 'hueso'),
    l3: contexto('Vértebra L3', ['Vertebra_L3'], 'hueso'),
    l4: contexto('Vértebra L4', ['Vertebra_L4'], 'hueso'),
    l5: contexto('Vértebra L5', ['Vertebra_L5'], 'hueso'),
  },
  pasos: [
    {
      id: 'orientacion', tipo: 'orientacion', titulo: 'Los grandes vasos del abdomen',
      texto: [
        ['La aorta, la arteria más grande del cuerpo, sale del ventrículo izquierdo y reparte la sangre oxigenada; su última parte es la aorta abdominal.', T(AO, 'The aorta is the largest artery in the body'), T(AO, 'It receives blood from the left ventricle and distributes oxygenated blood to the entire body via the systemic circulation.')],
        ['Las venas del abdomen forman dos sistemas: el portal, que lleva la sangre al hígado para procesarla, y el sistémico, que la devuelve a la aurícula derecha.', T(VEN, 'Portal venous system – transports venous blood to the liver for processing'), T(VEN, 'Systemic venous system – returns blood to the right atrium of the heart.')],
        ['Mira los vasos de frente, delante de la columna.', GUIA],
      ],
      vista: { ver: ['aorta', 'cava', 'porta'], contexto: [...TRONCOS, 'iliacas-comunes', ...VERTEBRAS], camara: 'anterior' },
      actividad: { tipo: 'vistas', texto: 'Recorre los vasos.', vistas: [{ nombre: 'De frente', camara: 'anterior' }, { nombre: 'De lado', camara: 'lateral' }] },
      comprobar: 'rel-dos-sistemas',
    },
    {
      id: 'aorta', tipo: 'exploracion', titulo: 'La aorta abdominal',
      texto: [
        ['La aorta abdominal empieza en T12, justo por debajo del hiato aórtico del diafragma, y baja delante de la columna.', T(AO, 'The abdominal aorta begins at the level of T12, immediately below the aortic hiatus of the diaphragm, and descends anterior to the vertebral column.')],
        ['Acaba en L4, dividiéndose en las ilíacas comunes derecha e izquierda.', T(AO, 'It terminates at the level of L4, dividing into the right and left common iliac arteries.')],
        ['Además de los tres troncos digestivos, da ramas pares: las frénicas inferiores (T12), las renales (entre L1 y L2) y las gonadales (L2).', T(AO, 'Inferior phrenic arteries: Paired parietal arteries arising posteriorly at the level of T12.'), T(AO, 'Renal arteries: Paired visceral arteries that arise laterally at the level between L1 and L2.'), T(AO, 'Gonadal arteries: Paired visceral arteries that arise laterally at the level of L2.')],
      ],
      detalle: [
        ['Un aneurisma de aorta es una dilatación de más de 1,5 veces su diámetro; el sitio más frecuente es por debajo de las renales, hasta L4.', T(AO, 'An aortic aneurysm is defined as dilation of the aorta to greater than 1.5 times its normal diameter.'), T(AO, 'The most common site is the infrarenal abdominal aorta, between the renal arteries and the bifurcation at L4.')],
      ],
      vista: { ver: ['aorta', 'iliacas-comunes'], contexto: ['renales-arterias', 'frenicas', ...TRONCOS, 'diafragma', ...VERTEBRAS], camara: 'anterior' },
      actividad: { tipo: 'localizar', estructura: 'iliacas-comunes', texto: 'Toca las dos arterias en que se divide la aorta abajo.' },
      comprobar: 'rel-bifurcacion',
    },
    {
      id: 'troncos', tipo: 'relaciones', titulo: 'Tres troncos para el tubo digestivo',
      texto: [
        ['El tronco celíaco sale por delante en T12 y, al cabo de 1 cm, se divide en la gástrica izquierda, la esplénica y la hepática común: irriga estómago, bazo, hígado, vesícula, páncreas y duodeno.', T(CEL, 'It arises from the anterior aspect of the aorta at the aortic hiatus of the diaphragm (T12 level).'), T(CEL, 'the coeliac trunk extends approximately 1cm before dividing into three major branches – left gastric, splenic and common hepatic arteries.'), T(CEL, 'they are the major arterial supply to the stomach, spleen, liver, gall bladder, abdominal oesophagus, pancreas and duodenum.')],
        ['La mesentérica superior sale en L1 e irriga el intestino medio, hasta los dos tercios proximales del colon transverso.', T(AMS, 'It arises anteriorly from the abdominal aorta at the level of the L1 vertebrae, immediately inferior to the origin of the coeliac trunk.'), T(AMS, 'supplies arterial blood to the organs of the midgut')],
        ['La mesentérica inferior sale en L3 e irriga el intestino posterior: el tercio distal del transverso, el descendente, el sigmoide y el recto.', T(AMI, 'It arises at the L3 vertebral level'), T(AMI, 'It supplies arterial blood to the organs of the hindgut – the distal 1/3 of the transverse colon, splenic flexure, descending colon, sigmoid colon and rectum.')],
      ],
      vista: { ver: TRONCOS, contexto: ['aorta', 'esplenica-arteria', 'hepatica-comun', 'gastrica-izquierda', 't12', 'l1', 'l3'], camara: 'lateral', lado: 'L' },
      actividad: { tipo: 'comparar', estructuras: TRONCOS, texto: 'Alterna los tres de arriba abajo: celíaco (T12), mesentérica superior (L1) y mesentérica inferior (L3).' },
      comprobar: 'rel-celiaco',
    },
    {
      id: 'cava', tipo: 'exploracion', titulo: 'La vena cava inferior',
      texto: [
        ['La cava inferior recoge la sangre de todo lo que está por debajo del diafragma; va en la pared posterior, delante de la columna y a la derecha de la aorta.', T(VEN, 'The inferior vena cava is the common convergence of venous drainage from all structures below the diaphragm. It is located on the posterior abdominal wall; anteriorly to the vertebral column and to the right of the abdominal aorta.')],
        ['Se forma en L5 por la unión de las ilíacas comunes, sube y atraviesa el centro tendinoso del diafragma en T8 para llegar a la aurícula derecha.', T(VEN, 'The vessel is formed by the union of the common iliac veins at the L5 vertebral level. It ascends superiorly, and leaves the abdomen by piercing the central tendon of the diaphragm at the T8 level (the caval hiatus).')],
        ['Recibe las renales, las lumbares, las hepáticas y las frénicas inferiores, pero nada del bazo, el páncreas ni el tubo digestivo, que van antes al sistema porta.', T(VEN, 'Renal veins – drain the kidneys, left adrenal gland and left testis/ovary.'), T(VEN, 'Hepatic veins – drain the liver.'), T(VEN, 'There are no tributaries from the spleen, pancreas, gallbladder or the abdominal part of the GI tract – as these structures are first drained into the portal venous system.')],
      ],
      vista: { ver: ['cava'], contexto: ['renales-venas', 'iliacas-venas', 'venas-hepaticas', 'aorta', 'rinones', ...VERTEBRAS], camara: 'anterior' },
      actividad: { tipo: 'comparar', estructuras: ['cava', 'aorta'], texto: 'Alterna la cava y la aorta: la cava, a la derecha; la aorta, a la izquierda.' },
      comprobar: 'rel-cava-formacion',
    },
    {
      id: 'porta', tipo: 'relaciones', titulo: 'La vena porta',
      texto: [
        ['La vena porta se forma en L2, detrás del cuello del páncreas, por la unión de la esplénica y la mesentérica superior.', T(VEN, 'The portal vein is formed by the union of the splenic vein and the superior mesenteric vein, posterior to the neck of the pancreas, at the level of L2.')],
        ['Sube hacia el hígado por detrás del duodeno y del colédoco, y antes de entrar se divide en ramas derecha e izquierda.', T(VEN, 'As it ascends towards the liver, the portal vein passes posteriorly to the superior part of the duodenum and the bile duct.'), T(VEN, 'Immediately before entering the liver, the portal vein divides into right and left branches')],
      ],
      detalle: [
        ['Si el paso por el hígado se obstruye (cirrosis, trombosis), sube la presión portal; por encima de 20 mmHg es hipertensión portal.', T(VEN, 'When blood flow through the portal system is obstructed (e.g due to cirrhosis, portal vein thrombosis, or external pressure from a tumour), the pressure within portal system increases. A portal venous pressure in excess of 20mmHg is defined as portal hypertension.')],
        ['La sangre busca entonces las anastomosis con el sistema sistémico (en el esófago, el recto, el ombligo…), cuyas venas se dilatan en varices.', T(VEN, 'In portal hypertension, blood may be re-directed through the porto-systemic anastomoses (as these are now under a lower pressure).'), T(VEN, 'Oesophageal – Between the oesophageal branch of the left gastric vein and the oesophageal tributaries to the azygos system.')],
      ],
      vista: { ver: PORTA, contexto: ['mesenterica-inferior-vena', 'higado', 'bazo', 'cava'], camara: 'anterior' },
      actividad: { tipo: 'comparar', estructuras: PORTA, texto: 'Alterna las tres: la esplénica y la mesentérica superior se unen en la porta, que sube al hígado.' },
      comprobar: 'rel-porta',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['Aorta abdominal de T12 a L4: tronco celíaco (T12), mesentérica superior (L1), renales (L1–L2), gonadales (L2), mesentérica inferior (L3) e ilíacas comunes (L4).', T(AO, 'The abdominal aorta begins at the level of T12'), T(AMI, 'It arises at the L3 vertebral level'), T(AO, 'It terminates at the level of L4, dividing into the right and left common iliac arteries.')],
        ['La cava inferior nace en L5 y sube a la derecha de la aorta; la porta, de la esplénica y la mesentérica superior, lleva al hígado la sangre del intestino.', T(VEN, 'The vessel is formed by the union of the common iliac veins at the L5 vertebral level.'), T(VEN, 'The portal vein is formed by the union of the splenic vein and superior mesenteric vein.')],
      ],
    },
  ],
  preguntas: [
    {
      id: 'rel-dos-sistemas', tipo: 'relacion', objetivo: 3, paso: 'orientacion', estructuras: ['porta', 'cava'],
      enunciado: '¿Adónde lleva la sangre el sistema venoso portal?',
      correcta: 'Al hígado, para procesarla',
      distractores: ['Directamente a la aurícula derecha', 'A los riñones', 'A los pulmones'],
      explicacion: 'El sistema sistémico (la cava) la devuelve al corazón; el portal pasa antes por el hígado.',
      evidencia: [T(VEN, 'Portal venous system – transports venous blood to the liver for processing')],
    },
    { id: 'id-aorta', tipo: 'identificar', estructura: 'aorta', objetivo: 0, paso: 'aorta' },
    {
      id: 'rel-bifurcacion', tipo: 'relacion', objetivo: 0, paso: 'aorta', estructuras: ['aorta', 'iliacas-comunes'],
      enunciado: '¿A qué altura se divide la aorta abdominal en las ilíacas comunes?',
      correcta: 'En L4',
      distractores: ['En T12', 'En L1', 'En S2'],
      explicacion: 'Empieza en T12, bajo el diafragma, y acaba en L4.',
      evidencia: [T(AO, 'It terminates at the level of L4, dividing into the right and left common iliac arteries.')],
    },
    {
      id: 'sec-ramas', tipo: 'secuencia', objetivo: 0, paso: 'troncos',
      enunciado: 'Ordena de arriba abajo estas ramas de la aorta abdominal.',
      orden: ['Tronco celíaco', 'Arteria mesentérica superior', 'Arterias renales', 'Arteria mesentérica inferior', 'Arterias ilíacas comunes'],
      explicacion: 'T12, L1, entre L1 y L2, L3 y L4.',
      evidencia: [T(CEL, 'aortic hiatus of the diaphragm (T12 level)'), T(AMS, 'at the level of the L1 vertebrae'), T(AO, 'Renal arteries: Paired visceral arteries that arise laterally at the level between L1 and L2.'), T(AMI, 'It arises at the L3 vertebral level'), T(AO, 'It terminates at the level of L4')],
    },
    { id: 'id-celiaco', tipo: 'identificar', estructura: 'celiaco', objetivo: 1, paso: 'troncos' },
    { id: 'id-mesenterica-superior', tipo: 'identificar', estructura: 'mesenterica-superior', objetivo: 1, paso: 'troncos' },
    {
      id: 'rel-celiaco', tipo: 'relacion', objetivo: 1, paso: 'troncos', estructuras: ['celiaco'],
      enunciado: '¿En qué tres arterias se divide el tronco celíaco?',
      correcta: 'Gástrica izquierda, esplénica y hepática común',
      distractores: ['Renal, gonadal y frénica', 'Cólica media, cólica derecha e ileocólica', 'Cólica izquierda, sigmoideas y rectal superior'],
      explicacion: 'Las cólicas son de las mesentéricas; las renales y gonadales, de la propia aorta.',
      evidencia: [T(CEL, 'dividing into three major branches – left gastric, splenic and common hepatic arteries.')],
    },
    {
      id: 'fun-mesenterica-inferior', tipo: 'funcion', objetivo: 1, paso: 'troncos', estructuras: ['mesenterica-inferior'],
      enunciado: '¿Qué irriga la arteria mesentérica inferior?',
      correcta: 'El intestino posterior: final del transverso, descendente, sigmoide y recto',
      distractores: ['El estómago y el hígado', 'El intestino delgado y el colon ascendente', 'Los riñones'],
      explicacion: 'El intestino medio es de la mesentérica superior y el estómago y el hígado, del celíaco.',
      evidencia: [T(AMI, 'It supplies arterial blood to the organs of the hindgut – the distal 1/3 of the transverse colon, splenic flexure, descending colon, sigmoid colon and rectum.')],
    },
    { id: 'id-cava', tipo: 'identificar', estructura: 'cava', objetivo: 2, paso: 'cava' },
    {
      id: 'rel-cava-formacion', tipo: 'relacion', objetivo: 2, paso: 'cava', estructuras: ['cava'],
      enunciado: '¿Cómo se forma la vena cava inferior?',
      correcta: 'Por la unión de las dos ilíacas comunes en L5',
      distractores: ['Por la unión de la esplénica y la mesentérica superior', 'Por la unión de las dos renales', 'Sale directamente del hígado'],
      explicacion: 'La unión de la esplénica y la mesentérica superior forma la porta.',
      evidencia: [T(VEN, 'The vessel is formed by the union of the common iliac veins at the L5 vertebral level.')],
    },
    {
      id: 'rel-sin-tubo', tipo: 'relacion', objetivo: 2, paso: 'cava', estructuras: ['cava', 'porta'],
      enunciado: '¿Por qué la vena cava inferior no recibe venas del bazo ni del intestino?',
      correcta: 'Porque esa sangre va antes al sistema porta, que pasa por el hígado',
      distractores: ['Porque el bazo no tiene venas', 'Porque van a la vena cava superior', 'Porque desembocan en los riñones'],
      explicacion: 'Esa sangre llega a la cava más tarde, por las venas hepáticas.',
      evidencia: [T(VEN, 'There are no tributaries from the spleen, pancreas, gallbladder or the abdominal part of the GI tract – as these structures are first drained into the portal venous system.')],
    },
    { id: 'id-porta', tipo: 'identificar', estructura: 'porta', objetivo: 3, paso: 'porta' },
    {
      id: 'rel-porta', tipo: 'relacion', objetivo: 3, paso: 'porta', estructuras: PORTA,
      enunciado: '¿Qué venas forman la vena porta?',
      correcta: 'La esplénica y la mesentérica superior',
      distractores: ['Las dos ilíacas comunes', 'Las venas hepáticas', 'Las renales derecha e izquierda'],
      explicacion: 'Se unen detrás del cuello del páncreas, a la altura de L2.',
      evidencia: [T(VEN, 'The portal vein is formed by the union of the splenic vein and the superior mesenteric vein, posterior to the neck of the pancreas, at the level of L2.')],
    },
    {
      id: 'rel-hipertension', tipo: 'relacion', objetivo: 3, paso: 'porta', estructuras: ['porta'],
      enunciado: 'En la hipertensión portal, ¿por qué aparecen varices en el esófago?',
      correcta: 'Porque la sangre se desvía por las anastomosis entre el sistema porta y el sistémico',
      distractores: ['Porque se rompe la aorta', 'Porque la cava inferior se cierra', 'Porque el esófago no tiene venas'],
      explicacion: 'Las venas de esas anastomosis, a menos presión, reciben mucha sangre y se dilatan.',
      evidencia: [T(VEN, 'In portal hypertension, blood may be re-directed through the porto-systemic anastomoses (as these are now under a lower pressure).')],
    },
  ],
});
