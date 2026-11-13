// Lección «Nodos lumbares y viscerales del abdomen, cisterna del quilo». Formato y evidencias: ../formato.js.
// Escrita el 2026-11-12, cuando el modelo pasó a tener la cisterna del quilo, el conducto torácico, los troncos lumbares
// e intestinales y los nodos pilóricos (docs/hitos/09-sistema-linfatico.md). Simplificaciones del modelo que la lección
// declara: los lumbares están colocados a su lado de la aorta o de la cava de forma esquemática; la cisterna es un saco
// generado de L2 a L1, a la derecha y por detrás de la aorta; el tronco intestinal son dos ramas que se unen.
import { leccion, W, GUIA, MODELO } from '../formato.js';

const PAN = 'Lumbar_lymph_nodes';
const PRE = 'Preaortic_lymph_nodes';
const CEL = 'Celiac_lymph_nodes';
const SMN = 'Superior_mesenteric_lymph_nodes';
const IMN = 'Inferior_mesenteric_lymph_nodes';
const CIS = 'Cisterna_chyli';
const TD = 'Thoracic_duct';
const HIA = 'Aortic_hiatus';
const nodos = (nombre, piezas, extra = {}) => ({ nombre, piezas, lado: 'impar', papel: 'nucleo', tipo: 'nodo', ...extra });
const linfatico = (nombre, piezas, lado = 'impar', papel = 'nucleo') => ({ nombre, piezas, lado, papel, tipo: 'linfatico' });
const contexto = (nombre, piezas, tipo, lado = 'impar') => ({ nombre, piezas, lado, papel: 'contexto', tipo });

const LUMBARES = ['aorticos-laterales', 'cavales', 'retroaorticos'];
const PREAORTICOS = ['celiacos', 'mesentericos-superiores', 'preaorticos'];
const ORGANOS = ['satelites-celiacos', 'colicos', 'colicos-izquierdos'];
const ARTERIAS = ['tronco-celiaco', 'mesenterica-superior', 'mesenterica-inferior'];

export default leccion({
  id: 'abd-linfaticos',
  version: 1,
  titulo: 'Nodos lumbares y viscerales del abdomen, cisterna del quilo',
  resumen: 'Los nodos lumbares (aórticos laterales, cavales y retroaórticos) y los preaórticos (celíacos y mesentéricos) con sus territorios, los troncos lumbares e intestinal, la cisterna del quilo sobre L1 y L2 y el comienzo del conducto torácico por el hiato aórtico. Los nodos de la pelvis tienen su propia lección.',
  lugares: [['abdomen', 'vasos-nervios-abdomen'], ['abdomen', 'retroperitoneo']],
  sistemas: ['linfatico'],
  formato: 'topografia',
  temas: ['organos'],
  nivel: 3,
  minutos: 18,
  requisitos: ['sis-linfatico', 'abd-vasos'],
  siguiente: ['tor-linfaticos', 'pel-nervios-linfaticos', 'mi-ganglios'],
  objetivos: [
    'Localizar los nodos lumbares (aórticos laterales, cavales y retroaórticos) respecto a la aorta y la vena cava inferior.',
    'Relacionar los nodos celíacos y mesentéricos con las arterias que acompañan y los órganos que drenan.',
    'Distinguir lo que llevan los troncos lumbares de lo que lleva el tronco intestinal.',
    'Localizar la cisterna del quilo y seguir el comienzo del conducto torácico por el hiato aórtico.',
  ],
  estructuras: {
    'aorticos-laterales': nodos('Nodos aórticos laterales', ['Lateral_aortic_nodes']),
    cavales: nodos('Nodos cavales (laterales, precavales y retrocavales)', ['Lateral_caval_nodes', 'Precaval_nodes', 'Retrocaval_nodes']),
    retroaorticos: nodos('Nodos retroaórticos', ['Retro_aortic_nodes']),
    intermedios: nodos('Nodos lumbares intermedios', ['Intermediate_lumbar_nodes']),
    preaorticos: nodos('Nodos preaórticos', ['Pre_aortic_nodes']),
    celiacos: nodos('Nodos celíacos', ['Coeliac_nodes']),
    'mesentericos-superiores': nodos('Nodos mesentéricos superiores', ['Central_superior_mesenteric_nodes', 'Juxta_intestinal_mesenteric_nodes']),
    'satelites-celiacos': nodos('Nodos gástricos, pilóricos, pancreáticos y esplénicos', ['Right_gastric_nodes', 'Right_gastro_omental_nodes', 'Suprapyloric_node', 'Subpyloric_nodes', 'Retropyloric_nodes', 'Superior_pancreatic_nodes', 'Inferior_pancreatic_nodes', 'Superior_pancreaticoduodenal_nodes', 'Splenic_nodes']),
    colicos: nodos('Nodos ileocólicos y cólicos derechos y medios', ['Ileocolic_nodes', 'Right_colic_nodes', 'Middle_colic_nodes']),
    'colicos-izquierdos': nodos('Nodos cólicos izquierdos y sigmoideos', ['Left_colic_nodes', 'Sigmoid_nodes']),
    cisterna: { ...linfatico('Cisterna del quilo', ['Cisterna_chyli']), confusiones: ['Vena cava inferior'] },
    'conducto-toracico': { ...linfatico('Conducto torácico', ['Thoracic_duct']), confusiones: ['Vena ácigos'] },
    'troncos-lumbares': linfatico('Troncos lumbares', ['Lumbar_trunk'], 'ambos'),
    'tronco-intestinal': linfatico('Tronco intestinal', ['Intestinal_trunks']),
    'colectores-abdomen': linfatico('Colectores del abdomen (esquemáticos)', ['Lymphatic_vessels_of_abdomen'], 'impar', 'contexto'),
    aorta: contexto('Aorta abdominal', ['Abdominal_aorta'], 'arteria'),
    'aorta-toracica': contexto('Aorta torácica', ['Thoracic_aorta'], 'arteria'),
    cava: contexto('Vena cava inferior', ['Inferior_vena_cava_abdominal_part'], 'vena'),
    'venas-renales': contexto('Venas renales', ['Left_renal_vein', 'Right_renal_vein'], 'vena'),
    'tronco-celiaco': contexto('Tronco celíaco', ['Coeliac_trunk'], 'arteria'),
    'mesenterica-superior': contexto('Arteria mesentérica superior', ['Superior_mesenteric_artery'], 'arteria'),
    'mesenterica-inferior': contexto('Arteria mesentérica inferior', ['Inferior_mesenteric_artery'], 'arteria'),
    acigos: contexto('Vena ácigos', ['Azygos_vein'], 'vena'),
    psoas: contexto('Psoas mayor', ['Psoas_major'], 'musculo', 'ambos'),
    diafragma: contexto('Diafragma', ['Diaphragm'], 'musculo'),
    vertebras: contexto('Vértebras T12 a L4', ['Vertebra_T12', 'Vertebra_L1', 'Vertebra_L2', 'Vertebra_L3', 'Vertebra_L4'], 'hueso'),
    estomago: contexto('Estómago', ['Stomach'], 'organo'),
    pancreas: contexto('Páncreas', ['Pancreas'], 'organo'),
  },
  pasos: [
    {
      id: 'orientacion', tipo: 'orientacion', titulo: 'Los nodos alrededor de la aorta',
      texto: [
        ['Los nodos periaórticos, o lumbares, están delante de las vértebras lumbares, cerca de la aorta, y reciben la linfa del tubo digestivo y de los órganos del abdomen.', W(PAN, 'are a group of lymph nodes that lie in front of the lumbar vertebrae near the aorta.'), W(PAN, 'These lymph nodes receive drainage from the gastrointestinal tract and the abdominal organs.')],
        ['Se dividen en preaórticos, paraaórticos (o aórticos laterales) y retroaórticos.', W(PAN, 'The periaortic group is the general group, that is subdivided into: preaortic, paraaortic, and retroaortic groups.'), W(PAN, 'The paraaortic group is synonymous with the lateral aortic group.')],
        ['En el modelo, los nodos lumbares están colocados a su lado de la aorta o de la cava de forma esquemática, y los colectores que los unen son trazados esquemáticos.', MODELO],
        ['Mira de frente con el estómago y el páncreas translúcidos.', GUIA],
      ],
      vista: { ver: [...LUMBARES, 'intermedios', ...PREAORTICOS], contexto: ['aorta', 'cava', 'colectores-abdomen'], fantasma: ['estomago', 'pancreas'], camara: 'anterior' },
      actividad: { tipo: 'vistas', texto: 'Recorre los nodos del abdomen.', vistas: [{ nombre: 'De frente', camara: 'anterior' }, { nombre: 'Por la derecha', camara: 'lateral' }, { nombre: 'Por detrás', camara: 'posterior' }] },
      comprobar: 'rel-divisiones',
    },
    {
      id: 'lumbares', tipo: 'exploracion', titulo: 'A los lados de la aorta y de la cava',
      texto: [
        ['Los aórticos laterales están junto a la aorta, delante de la columna, y llegan por fuera hasta el borde del psoas mayor y por arriba hasta los pilares del diafragma.', W(PAN, 'The lateral group nodes are located adjacent to the aorta, anterior to the spine, extending laterally to the edge of the psoas major muscles, and superiorly to the crura of the diaphragm.')],
        ['Los izquierdos forman una cadena al lado izquierdo de la aorta; los derechos están en parte delante de la cava inferior, cerca de la desembocadura de la vena renal, y en parte detrás de ella.', W(PAN, 'The left paraaortic nodes form a chain on the left side of the abdominal aorta in front of the origin of the psoas major'), W(PAN, 'The right paraaortic nodes, are situated partly in front of the inferior vena cava near the termination of the renal vein, and partly behind it')],
        ['Los retroaórticos están por debajo de la cisterna, sobre los cuerpos de L3 y L4.', W('Retroaortic_lymph_nodes', 'are placed below the cisterna chyli, on the bodies of the third and fourth lumbar vertebrae.')],
      ],
      detalle: [
        ['Reciben la linfa de los ilíacos comunes, del testículo o del ovario, la trompa y el útero, del riñón y la suprarrenal y de los músculos laterales del abdomen.', W(PAN, '(a) the efferents of the common iliac lymph nodes'), W(PAN, 'the lymphatics from the testis in the male, and from the ovary, uterine tube, and uterus in the female'), W(PAN, '(c) the lymphatics from the kidney and suprarenal gland')],
      ],
      vista: { ver: [...LUMBARES, 'intermedios'], contexto: ['aorta', 'cava', 'venas-renales', 'psoas', 'vertebras'], camara: 'anterior' },
      actividad: { tipo: 'comparar', estructuras: ['aorticos-laterales', 'cavales', 'retroaorticos'], texto: 'Alterna los grupos: junto a la aorta, junto a la cava y detrás de la aorta.' },
      comprobar: 'rel-recibe-lumbares',
    },
    {
      id: 'preaorticos', tipo: 'relaciones', titulo: 'Preaórticos: celíacos y mesentéricos',
      texto: [
        ['Los preaórticos están delante de la aorta y se dividen en celíacos, mesentéricos superiores y mesentéricos inferiores, alrededor del origen de esas arterias.', W(PRE, 'The preaortic lymph nodes lie in front of the aorta, and may be divided into celiac lymph nodes, superior mesenteric lymph nodes, and inferior mesenteric lymph nodes groups, arranged around the origins of the corresponding arteries.')],
        ['Su linfa viene sobre todo de los órganos que irrigan esas tres arterias.', W(PRE, 'but their principal afferents are derived from the organs supplied by the three arteries with which they are associated')],
        ['Los celíacos reciben la linfa del estómago, el duodeno, el páncreas, el bazo, el hígado y la vesícula.', W(CEL, 'They receive lymph from the stomach, duodenum, pancreas, spleen, liver, and gall bladder.')],
        ['Los mesentéricos superiores, la del yeyuno, el íleon, el ciego, el apéndice y el colon ascendente y transverso.', W(SMN, 'The superior mesenteric glands receive lymph from the jejunum, ileum, cecum, vermiform process, and the ascending and transverse parts of the colon')],
        ['Los mesentéricos inferiores, la del colon descendente, el sigmoide y la parte alta del recto.', W(IMN, 'they receive lymph from the descending colon, sigmoid colon, and proximal part of the rectum.')],
      ],
      vista: { ver: PREAORTICOS, contexto: ['aorta', ...ARTERIAS], fantasma: ['estomago', 'pancreas'], camara: 'anterior' },
      actividad: { tipo: 'localizar', estructura: 'celiacos', texto: 'Toca los nodos que rodean el origen del tronco celíaco.' },
      comprobar: 'rel-celiacos',
    },
    {
      id: 'organos', tipo: 'exploracion', titulo: 'De los órganos a los preaórticos',
      texto: [
        ['Los celíacos tienen tres conjuntos: los gástricos, los hepáticos y los esplénicos.', W(CEL, 'The celiac lymph nodes are grouped into three sets: the gastric, hepatic and splenic lymph nodes.')],
        ['Los ileocólicos, de diez a veinte, forman una cadena alrededor de la arteria ileocólica; los mesocólicos están en el mesocolon transverso.', W(SMN, 'The ileocolic lymph nodes, from ten to twenty in number, form a chain around the ileocolic artery'), W(SMN, 'The mesocolic lymph nodes are numerous, and lie between the layers of the transverse mesocolon')],
        ['Los nodos de las ramas cólicas izquierdas y sigmoideas pertenecen a los mesentéricos inferiores.', W(IMN, '(a) small glands on the branches of the left colic and sigmoid arteries')],
        ['En el modelo, los colectores que unen estos nodos con los preaórticos son trazados esquemáticos que siguen a las arterias del tubo digestivo.', MODELO],
      ],
      vista: { ver: ORGANOS, contexto: ['tronco-celiaco', 'mesenterica-superior', 'mesenterica-inferior', 'colectores-abdomen'], fantasma: ['estomago', 'pancreas'], camara: 'anterior' },
      actividad: { tipo: 'comparar', estructuras: ORGANOS, texto: 'Alterna los nodos del estómago y el páncreas, los del colon derecho y los del colon izquierdo.' },
      comprobar: 'rel-mesentericos-inferiores',
    },
    {
      id: 'troncos', tipo: 'funcion', titulo: 'Troncos lumbares y tronco intestinal',
      texto: [
        ['Los troncos lumbares se forman con los eferentes de los aórticos laterales y llevan la linfa de los miembros inferiores, la pelvis, los riñones y las suprarrenales.', W('Lumbar_trunk', 'The lumbar trunks are formed by the union of the efferent vessels from the lateral aortic lymph nodes.'), W('Lumbar_trunk', 'They receive the lymph from the lower limbs, from the walls and viscera of the pelvis, from the kidneys and suprarenal glands')],
        ['La mayoría de los eferentes preaórticos forman el tronco intestinal, que lleva la linfa del estómago y los intestinos, el páncreas, el bazo y parte del hígado.', W(PRE, 'the majority unite to form the intestinal lymph trunk, which enters the cisterna chyli.'), W('Intestinal_trunk', 'The intestinal lymph trunk receives the lymph from the stomach and intestines, from the pancreas and spleen, and from the lower and front part of the liver')],
        ['Todos desembocan en la cisterna del quilo.', W('Lumbar_trunk', 'Ultimately, the lumbar trunks empty into the cisterna chyli'), W('Intestinal_trunk', 'and empties lymph into the cisterna chyli')],
        ['En el modelo, el tronco intestinal son dos ramas, desde los celíacos y desde los mesentéricos superiores, que se unen antes de llegar a la cisterna; el tronco lumbar izquierdo pasa por detrás y a la izquierda de la aorta.', MODELO],
      ],
      vista: { ver: ['troncos-lumbares', 'tronco-intestinal', 'cisterna'], contexto: ['aorticos-laterales', 'celiacos', 'mesentericos-superiores', 'cava', 'vertebras'], fantasma: ['aorta'], camara: 'anterior' },
      actividad: { tipo: 'comparar', estructuras: ['troncos-lumbares', 'tronco-intestinal'], texto: 'Alterna los troncos lumbares y el intestinal y sigue cada uno hasta la cisterna.' },
      comprobar: 'comp-troncos',
    },
    {
      id: 'cisterna', tipo: 'relaciones', titulo: 'La cisterna y el hiato aórtico',
      texto: [
        ['La cisterna del quilo es un saco retroperitoneal en el extremo inferior del conducto torácico; está detrás de la aorta abdominal, sobre los cuerpos de L1 y L2.', W(CIS, 'is a dilated sac at the lower end of the thoracic duct'), W(CIS, 'The cisterna chyli is a retroperitoneal structure.'), W(CIS, 'In humans, the cisterna chyli is located posterior to the abdominal aorta on the anterior aspect of the bodies of the first and second lumbar vertebrae (L1 and L2).')],
        ['De su extremo superior, a la altura de T12, nace el conducto torácico, que sube delante y a la derecha de la columna, entre la aorta y la ácigos.', W(TD, 'The thoracic duct commences at the upper extremity of the cisterna chyli at the level of the T12 vertebra.'), W(TD, 'the thoracic duct ascends anterior to and to the right of the vertebral column, situated in between the aorta, and the azygos vein.')],
        ['Pasa al tórax por el hiato aórtico, entre los pilares del diafragma a la altura de T12: la aorta va a la izquierda, el conducto en medio y la ácigos a la derecha.', W(HIA, 'It is located at the level of the inferior border of the twelfth thoracic vertebra (T12), posterior to the median arcuate ligament between the two crura of the diaphragm.'), W(HIA, 'The aorta is situated on the left, the thoracic duct in the middle, and the azygos vein on the right.')],
        ['En el modelo, la cisterna es un saco generado de unos 5 cm, de L2 a L1, a la derecha y por detrás de la aorta; la cisterna falta en cerca de la mitad de las personas.', MODELO, W(TD, 'A cisterna chyli is absent in about half of individuals')],
      ],
      vista: { ver: ['cisterna', 'conducto-toracico'], contexto: ['acigos', 'aorta-toracica', 'vertebras'], fantasma: ['aorta', 'diafragma'], camara: 'anterolateral', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'cisterna', texto: 'Toca el saco alargado que hay detrás de la aorta, sobre L1 y L2.' },
      comprobar: 'rel-hiato',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'Repaso',
      texto: [
        ['Lumbares a los lados y detrás de la aorta y de la cava; preaórticos delante, alrededor del tronco celíaco y de las mesentéricas.', W(PAN, 'subdivided into: preaortic, paraaortic, and retroaortic groups'), W(PRE, 'arranged around the origins of the corresponding arteries')],
        ['Aórticos laterales → troncos lumbares; preaórticos → tronco intestinal; todos a la cisterna, sobre L1 y L2.', W('Lumbar_trunk', 'The lumbar trunks are formed by the union of the efferent vessels from the lateral aortic lymph nodes.'), W(PRE, 'the majority unite to form the intestinal lymph trunk, which enters the cisterna chyli.')],
        ['El conducto torácico nace de la cisterna en T12 y sube por el hiato aórtico entre la aorta y la ácigos.', W(TD, 'The thoracic duct commences at the upper extremity of the cisterna chyli at the level of the T12 vertebra.'), W(HIA, 'The aorta is situated on the left, the thoracic duct in the middle, and the azygos vein on the right.')],
      ],
    },
  ],
  preguntas: [
    {
      id: 'rel-divisiones', tipo: 'relacion', objetivo: 0, paso: 'orientacion', estructuras: LUMBARES,
      enunciado: '¿En qué grupos se dividen los nodos periaórticos (lumbares)?',
      correcta: 'Preaórticos, paraaórticos (aórticos laterales) y retroaórticos',
      distractores: ['Superficiales y profundos', 'Ilíacos internos y externos', 'Celíacos, esplénicos y cólicos'],
      explicacion: 'El grupo general periaórtico se divide en preaórticos, paraaórticos —el mismo grupo que los aórticos laterales— y retroaórticos.',
      evidencia: [W(PAN, 'The periaortic group is the general group, that is subdivided into: preaortic, paraaortic, and retroaortic groups.'), W(PAN, 'The paraaortic group is synonymous with the lateral aortic group.')],
    },
    { id: 'id-aorticos-laterales', tipo: 'identificar', estructura: 'aorticos-laterales', objetivo: 0, paso: 'lumbares' },
    { id: 'id-cavales', tipo: 'identificar', estructura: 'cavales', objetivo: 0, paso: 'lumbares' },
    { id: 'loc-retroaorticos', tipo: 'localizar', estructura: 'retroaorticos', candidatas: ['aorticos-laterales', 'cavales', 'preaorticos'], objetivo: 0, paso: 'lumbares' },
    {
      id: 'rel-recibe-lumbares', tipo: 'relacion', objetivo: 0, paso: 'lumbares', estructuras: ['aorticos-laterales'],
      enunciado: '¿Cuál de estos órganos drena en los nodos paraaórticos (aórticos laterales)?',
      correcta: 'El riñón',
      distractores: ['El estómago', 'El yeyuno', 'El colon transverso'],
      explicacion: 'Los paraaórticos reciben la linfa del riñón y la suprarrenal, del testículo o del ovario y de los ilíacos comunes; el estómago y el intestino van a los preaórticos.',
      evidencia: [W(PAN, '(c) the lymphatics from the kidney and suprarenal gland'), W(PRE, 'but their principal afferents are derived from the organs supplied by the three arteries with which they are associated')],
    },
    {
      id: 'rel-celiacos', tipo: 'relacion', objetivo: 1, paso: 'preaorticos', estructuras: ['celiacos'],
      enunciado: '¿De qué órganos reciben la linfa los nodos celíacos?',
      correcta: 'Del estómago, el duodeno, el páncreas, el bazo, el hígado y la vesícula',
      distractores: ['Del yeyuno, el íleon y el ciego', 'Del colon descendente y el sigmoide', 'De los riñones y las suprarrenales'],
      explicacion: 'Los celíacos drenan los órganos del tronco celíaco; el yeyuno, el íleon y el ciego van a los mesentéricos superiores, el colon descendente y el sigmoide a los inferiores, y los riñones a los paraaórticos.',
      evidencia: [W(CEL, 'They receive lymph from the stomach, duodenum, pancreas, spleen, liver, and gall bladder.')],
    },
    {
      id: 'rel-mesentericos-inferiores', tipo: 'relacion', objetivo: 1, paso: 'organos', estructuras: ['colicos-izquierdos'],
      enunciado: '¿Qué drenan los nodos mesentéricos inferiores?',
      correcta: 'El colon descendente, el sigmoide y la parte alta del recto',
      distractores: ['El yeyuno y el íleon', 'El estómago y el duodeno', 'El colon ascendente y el apéndice'],
      explicacion: 'Drenan el intestino posterior: colon descendente, sigmoide y parte alta del recto.',
      evidencia: [W(IMN, 'they receive lymph from the descending colon, sigmoid colon, and proximal part of the rectum.')],
    },
    { id: 'id-celiacos', tipo: 'identificar', estructura: 'celiacos', objetivo: 1, paso: 'preaorticos' },
    { id: 'id-mesentericos-superiores', tipo: 'identificar', estructura: 'mesentericos-superiores', objetivo: 1, paso: 'preaorticos' },
    { id: 'id-satelites-celiacos', tipo: 'identificar', estructura: 'satelites-celiacos', objetivo: 1, paso: 'organos' },
    {
      id: 'comp-troncos', tipo: 'comparacion', objetivo: 2, paso: 'troncos', estructuras: ['troncos-lumbares', 'tronco-intestinal'],
      enunciado: '¿En qué se diferencian los troncos lumbares del tronco intestinal?',
      correcta: 'Los lumbares llevan la linfa de los miembros inferiores, la pelvis y los riñones; el intestinal, la del estómago, los intestinos, el páncreas y el bazo',
      distractores: ['Los lumbares van al conducto linfático derecho y el intestinal al torácico', 'El intestinal nace de los aórticos laterales y los lumbares de los preaórticos', 'Los lumbares llevan la linfa del intestino y el intestinal la de las piernas'],
      explicacion: 'Los lumbares nacen de los aórticos laterales; el intestinal, de los preaórticos. Todos desembocan en la cisterna del quilo.',
      evidencia: [W('Lumbar_trunk', 'They receive the lymph from the lower limbs, from the walls and viscera of the pelvis, from the kidneys and suprarenal glands'), W('Intestinal_trunk', 'The intestinal lymph trunk receives the lymph from the stomach and intestines, from the pancreas and spleen'), W('Lumbar_trunk', 'The lumbar trunks are formed by the union of the efferent vessels from the lateral aortic lymph nodes.'), W(PRE, 'the majority unite to form the intestinal lymph trunk, which enters the cisterna chyli.')],
    },
    {
      id: 'fun-testiculo', tipo: 'funcion', objetivo: 2, paso: 'troncos', estructuras: ['aorticos-laterales', 'troncos-lumbares'],
      enunciado: '¿Por qué tronco llega a la cisterna la linfa del testículo?',
      correcta: 'Por un tronco lumbar, tras pasar por los nodos paraaórticos',
      distractores: ['Por el tronco intestinal', 'Por el tronco yugular', 'Por los inguinales superficiales y el tronco intestinal'],
      explicacion: 'La linfa del testículo va a los paraaórticos (aórticos laterales), cuyos eferentes forman los troncos lumbares.',
      evidencia: [W(PAN, 'the lymphatics from the testis in the male'), W('Lumbar_trunk', 'The lumbar trunks are formed by the union of the efferent vessels from the lateral aortic lymph nodes.')],
    },
    { id: 'id-tronco-intestinal', tipo: 'identificar', estructura: 'tronco-intestinal', objetivo: 2, paso: 'troncos' },
    {
      id: 'sec-cisterna', tipo: 'secuencia', objetivo: 3, paso: 'cisterna',
      enunciado: 'Ordena el camino de la linfa del riñón hasta el tórax:',
      orden: ['Nodos aórticos laterales', 'Tronco lumbar', 'Cisterna del quilo', 'Conducto torácico, por el hiato aórtico'],
      explicacion: 'El riñón drena en los paraaórticos; sus eferentes forman los troncos lumbares, que desembocan en la cisterna, de la que nace el conducto torácico, que cruza el hiato aórtico.',
      evidencia: [W(PAN, '(c) the lymphatics from the kidney and suprarenal gland'), W('Lumbar_trunk', 'Ultimately, the lumbar trunks empty into the cisterna chyli'), W(TD, 'The thoracic duct commences at the upper extremity of the cisterna chyli at the level of the T12 vertebra.'), W(TD, 'The thoracic duct traverses the diaphragm at the aortic hiatus to enter the posterior mediastinum.')],
    },
    {
      id: 'rel-hiato', tipo: 'relacion', objetivo: 3, paso: 'cisterna', estructuras: ['conducto-toracico'],
      enunciado: '¿Cómo están ordenados la aorta, el conducto torácico y la ácigos en el hiato aórtico?',
      correcta: 'La aorta a la izquierda, el conducto en medio y la ácigos a la derecha',
      distractores: ['El conducto a la izquierda, la aorta en medio y la ácigos a la derecha', 'La ácigos a la izquierda, la aorta en medio y el conducto a la derecha', 'La aorta delante y el conducto y la ácigos juntos detrás del esófago'],
      explicacion: 'El conducto torácico pasa por el hiato aórtico entre la aorta, a su izquierda, y la ácigos, a su derecha, y sigue entre ellas por el mediastino posterior.',
      evidencia: [W(HIA, 'The aorta is situated on the left, the thoracic duct in the middle, and the azygos vein on the right.')],
    },
    {
      id: 'rel-cisterna', tipo: 'relacion', objetivo: 3, paso: 'cisterna', estructuras: ['cisterna'],
      enunciado: '¿Dónde está la cisterna del quilo?',
      correcta: 'Detrás de la aorta abdominal, sobre los cuerpos de L1 y L2',
      distractores: ['Delante de la aorta, junto al tronco celíaco', 'En el mediastino posterior, a la altura de T7', 'Junto a la bifurcación de la aorta, sobre L4'],
      explicacion: 'Es retroperitoneal, detrás de la aorta, sobre la cara anterior de L1 y L2; de su extremo superior sale el conducto torácico.',
      evidencia: [W(CIS, 'In humans, the cisterna chyli is located posterior to the abdominal aorta on the anterior aspect of the bodies of the first and second lumbar vertebrae (L1 and L2).')],
    },
    { id: 'id-cisterna', tipo: 'identificar', estructura: 'cisterna', objetivo: 3, paso: 'cisterna' },
    { id: 'loc-cisterna', tipo: 'localizar', estructura: 'cisterna', candidatas: ['tronco-intestinal', 'preaorticos', 'retroaorticos'], objetivo: 3, paso: 'cisterna' },
  ],
});
