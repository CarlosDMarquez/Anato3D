// Fichas de los nodos del abdomen (lumbares, celíacos, mesentéricos…) y los pilóricos: grupo «Abdominal_lymph_nodes».
// Formato y reglas: ./formato.js (cada frase con su fuente; MODELO solo en «En este modelo»). Clave = nombre de la pieza
// sin _L/_R. Comprobar: node scripts/linfatico-citas.mjs comprobar && node scripts/check-cards.mjs
// BORRADOR redactado con IA, sin revisión médica. Tabla de fuentes: docs/fuentes/linfatico-abdomen.md.
//
// Fuentes: páginas de Wikipedia en inglés de los grupos de nodos (casi todas incorporan texto de dominio público del Gray
// de 1918: «Periaortic lymph nodes», «Preaortic…», «Retroaortic…», «Celiac…», «Superior mesenteric…», «Inferior
// mesenteric…», «Gastric…», «Hepatic…», «Splenic lymph node», «Cystic node») y de sus reparos (aorta, cava, tronco celíaco,
// arterias mesentéricas, cólicas, gastroduodenal…). El Gray agrupa los nodos de otra manera que la Terminologia Anatomica 2
// (p. ej., llama «preaórticos» al conjunto de celíacos y mesentéricos, y pone los subpilóricos en la cadena hepática): cada
// ficha dice en «En este modelo» qué grupo de la fuente identifica con el término de la TA2. Sin fuente libre para los nodos
// gástricos derechos, retropilóricos, diafragmáticos inferiores, epigástricos inferiores y lumbares intermedios: de ellos
// solo se afirma lo que la fuente dice del grupo mayor y la nomenclatura; el resto queda en «pendientes».
import { W, TA, MODELO } from './formato.js';

// ── Frases comunes ───────────────────────────────────────────────────────────────────────────────────────────────────
const REPRESENTATIVO = ['En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.', MODELO];
const UN_NODO = ['En este modelo el nodo se representa con una forma y un tamaño esquemáticos.', MODELO];
const NUEVA = ['Es una pieza que Z-Anatomy traía oculta (su nombre va entre paréntesis) y que Anato3D añade al modelo en la revisión del sistema linfático de noviembre de 2026.', MODELO];
const PARENTESIS = (n) => ['En la Terminologia Anatomica 2 su nombre figura entre paréntesis.', TA(n)];
const POSICION_ZA = ['En este modelo los nodos están en la posición que les da Z-Anatomy; esa posición no procede de una fuente citada.', MODELO];
const PARIETALES = (n) => ['La Terminologia Anatomica 2 los clasifica entre los nodos parietales del abdomen.', TA(5269), TA(n)];
const VISCERALES = (n) => ['La Terminologia Anatomica 2 los clasifica entre los nodos viscerales del abdomen.', TA(5281), TA(n)];

// Nodos lumbares (periaórticos). «Periaortic lymph nodes» (wp:Lumbar_lymph_nodes) se basa en el Gray.
const LUMB = (c) => W('Lumbar_lymph_nodes', c);
const LUMB_QUE = ['Forman parte de los nodos (ganglios) lumbares o periaórticos, que están delante de las vértebras lumbares, cerca de la aorta.', LUMB('are a group of lymph nodes that lie in front of the lumbar vertebrae near the aorta')];
const LUMB_TA = ['La Terminologia Anatomica 2 divide los nodos lumbares en izquierdos (aórticos laterales, preaórticos y retroaórticos), intermedios y derechos (cavales laterales, precavales y retrocavales).', TA(5270), TA(5271), TA(5272), TA(5273), TA(5274), TA(5275), TA(5276), TA(5277), TA(5278)];
const PARA_SINONIMO = ['La fuente llama paraaórticos al grupo aórtico lateral.', LUMB('The paraaortic group is synonymous with the lateral aortic group.')];
const PARA_SITIO = ['Los paraaórticos están junto a la aorta, delante de la columna, y llegan lateralmente hasta el borde del psoas mayor y, hacia arriba, hasta los pilares del diafragma.', LUMB('The lateral group nodes are located adjacent to the aorta, anterior to the spine, extending laterally to the edge of the psoas major muscles, and superiorly to the crura of the diaphragm.')];
const PARA_DERECHOS = ['Los paraaórticos derechos están en parte delante de la vena cava inferior, cerca de la desembocadura de la vena renal, y en parte detrás de ella, sobre el origen del psoas mayor y sobre el pilar derecho del diafragma.', LUMB('The right paraaortic nodes, are situated partly in front of the inferior vena cava near the termination of the renal vein, and partly behind it on the origin of the psoas major, and on the right crus of diaphragm.')];
const PARA_RECIBE = ['Los paraaórticos y los retroaórticos reciben los eferentes de los nodos ilíacos comunes, la linfa del testículo (o del ovario, la trompa uterina y el útero), la del riñón y la glándula suprarrenal y la de los músculos laterales del abdomen, cuyos linfáticos acompañan a las venas lumbares.', LUMB('The paraaortic and retroaortic nodes receive:'), LUMB('(a) the efferents of the common iliac lymph nodes'), LUMB('(b) the lymphatics from the testis in the male, and from the ovary, uterine tube, and uterus in the female'), LUMB('(c) the lymphatics from the kidney and suprarenal gland'), LUMB('(d) the lymphatics draining the lateral abdominal muscles and accompanying the lumbar veins')];
const PARA_DRENA = ['La mayoría de los eferentes de los paraaórticos se unen en los troncos lumbares derecho e izquierdo, que van a la cisterna del quilo; algunos van a los preaórticos y los retroaórticos, y otros atraviesan los pilares del diafragma para unirse al extremo inferior del conducto torácico.', LUMB('Most of the efferent vessels from the paraaortic nodes converge to form the right and left lumbar trunks which join the cisterna chyli'), LUMB('but some enter the preaortic and retroaortic lymph nodes, and others pierce the crura of the diaphragm to join the lower end of the thoracic duct')];
const AORTA = ['La aorta abdominal, que baja por la pared posterior del abdomen delante de la columna, algo a la izquierda de la línea media, desde T12 hasta su bifurcación en L4.', W('Abdominal_aorta', 'It travels down the posterior wall of the abdomen, anterior to the vertebral column.'), W('Abdominal_aorta', 'The abdominal aorta lies slightly to the left of the midline of the body.'), W('Abdominal_aorta', 'It begins at T12 and ends at L4 with its bifurcation into the common iliac arteries')];
const CAVA = ['La vena cava inferior, que sube por detrás de la cavidad abdominal a la derecha de la columna y de la aorta; se forma a la altura de L5 por la unión de las dos venas ilíacas comunes.', W('Inferior_vena_cava', 'It is a large retroperitoneal vein that lies posterior to the abdominal cavity and runs along the right side of the vertebral column.'), W('Inferior_vena_cava', 'It passes to the right of the descending aorta.'), W('Inferior_vena_cava', 'It is formed by the joining of the right and the left common iliac veins, usually at the level of the fifth lumbar vertebra.')];
const DERECHOS_MODELO = ['La fuente describe juntos los paraaórticos derechos, sin dividirlos; esta ficha les aplica lo que la fuente dice de ellos y la división de la TA2 en cavales laterales, precavales y retrocavales.', TA(5275), MODELO];
const TRONCO_DCHO = ['En este modelo los eferentes del lado derecho llegan a la cisterna del quilo por el tronco lumbar derecho, que nace de los nodos cavales laterales.', MODELO];
const RETROPERITONEO = ['El cáncer de testículo se extiende de forma previsible y los nodos del retroperitoneo suelen ser el primer lugar al que llega.', W('Retroperitoneal_lymph_node_dissection', 'Testicular cancer metastasizes in a predictable pattern, and lymph nodes in the retroperitoneum are typically the first place it lands.')];
const SIN_FUENTE = 'Ninguna fuente libre consultada (Wikipedia en inglés) describe este grupo por separado.';
const ILIACOS_COMUNES = ['Lateral_common_iliac_nodes', 'Intermediate_common_iliac_nodes', 'Medial_common_iliac_nodes'];

// Nodos preaórticos (en el sentido del Gray: celíacos y mesentéricos) y tronco intestinal.
const PRE = (c) => W('Preaortic_lymph_nodes', c);
const PRE_TRES = ['Son uno de los tres grupos de nodos preaórticos de la fuente (celíacos, mesentéricos superiores y mesentéricos inferiores), dispuestos alrededor del origen de sus arterias.', PRE('may be divided into celiac lymph nodes, superior mesenteric lymph nodes, and inferior mesenteric lymph nodes groups, arranged around the origins of the corresponding arteries')];
const PRE_DRENA = ['La mayoría de los eferentes de los preaórticos se unen en el tronco intestinal, que desemboca en la cisterna del quilo; algunos van a los retroaórticos.', PRE('Some of their efferents pass to the retroaortic lymph nodes, but the majority unite to form the intestinal lymph trunk, which enters the cisterna chyli.')];
const TRONCO_INTESTINAL = ['El tronco intestinal recibe la linfa del estómago y los intestinos, del páncreas y el bazo y de la parte inferior y anterior del hígado, y la vierte en la cisterna del quilo.', W('Intestinal_trunk', 'receives the lymph from the stomach and intestines, from the pancreas and spleen, and from the lower and front part of the liver, and empties lymph into the cisterna chyli')];
const GASTRICOS_A_CISTERNA = ['La linfa de los dos grupos de nodos gástricos llega, por el tronco intestinal, a la cisterna del quilo.', W('Stomach', 'The two sets of gastric lymph nodes drain the stomach\'s tissue fluid into the lymphatic system through the intestinal lymph trunk, to the cisterna chyli.')];

// Cadena hepática y nodos pilóricos (Gray, en «Hepatic lymph nodes» y «Duodenum»).
const HEP = (c) => W('Hepatic_lymph_nodes', c);
const HEP_RECIBE = ['La fuente incluye los subpilóricos en la cadena hepática, cuyos nodos reciben aferentes del estómago, el duodeno, el hígado, la vesícula biliar y el páncreas.', HEP('subpyloric, four or five in number'), HEP('The lymph nodes of the hepatic chain receive afferents from the stomach, duodenum, liver, gall-bladder, and pancreas')];
const HEP_DRENA = ['Los eferentes de la cadena hepática se unen al grupo celíaco de los nodos preaórticos.', HEP('their efferents join the celiac group of preaortic lymph nodes')];
const PILORICOS_GDA = ['Los nodos pilóricos están a lo largo de la arteria gastroduodenal.', W('Duodenum', 'pyloric lymph nodes (along the gastroduodenal artery)')];
const DUODENO_A_PILORICOS = ['Los linfáticos anteriores del duodeno van a los nodos pancreaticoduodenales, a lo largo de las arterias pancreaticoduodenales superior e inferior, y de ahí a los nodos pilóricos.', W('Duodenum', 'The anterior lymphatic vessels drain into the pancreatoduodenal lymph nodes located along the superior and inferior pancreatoduodenal arteries and then into the pyloric lymph nodes')];
const PILORICOS_TA = ['La Terminologia Anatomica 2 reúne bajo los nodos pilóricos un nodo suprapilórico, los subpilóricos y los retropilóricos.', TA(5288), TA(5289), TA(5290), TA(5291)];
const SIN_HEPATICOS = ['En este modelo no hay pieza de nodos hepáticos (TA2 n.º 5299).', TA(5299), MODELO];

// Nodos mesentéricos superiores (Gray, en «Superior mesenteric lymph nodes»).
const SM = (c) => W('Superior_mesenteric_lymph_nodes', c);
const SM_TRES = ['La fuente divide los nodos mesentéricos superiores en tres grupos principales: mesentéricos, ileocólicos y mesocólicos.', SM('The superior mesenteric lymph nodes may be divided into three principal groups:')];
const SM_RECIBE = ['Los mesentéricos superiores reciben la linfa del yeyuno, el íleon, el ciego, el apéndice vermiforme y las partes ascendente y transversa del colon.', SM('The superior mesenteric glands receive lymph from the jejunum, ileum, cecum, vermiform process, and the ascending and transverse parts of the colon')];
const SM_DRENA = ['La linfa de los mesentéricos superiores va a los nodos preaórticos.', SM('lymph drains into the preaortic glands')];
const COLON_DCHO = ['La linfa del colon ascendente y de los dos tercios proximales del colon transverso va a los nodos ileocólicos y a los mesentéricos superiores, que drenan en la cisterna del quilo.', W('Large_intestine', 'Lymphatic drainage from the ascending colon and proximal two-thirds of the transverse colon is to the ileocolic lymph nodes and the superior mesenteric lymph nodes, which drain into the cisterna chyli.')];
const ILEOCOLICA = ['La arteria ileocólica, la rama más baja de la concavidad de la mesentérica superior, que baja hacia la derecha por detrás del peritoneo hasta la fosa ilíaca derecha.', W('Ileocolic_artery', 'The ileocolic artery is the lowest branch arising from the concavity of the superior mesenteric artery.'), W('Ileocolic_artery', 'It passes downward and to the right behind the peritoneum toward the right iliac fossa')];
const CADENA_ILEOCOLICA = ['La fuente lo cuenta entre los grupos en que se divide la cadena ileocólica donde la arteria da sus ramas terminales.', SM('Where the vessel divides into its terminal branches the chain is broken up into several groups:')];
const CIEGO = ['El ciego, bolsa del lado derecho que inicia el intestino grueso: recibe el contenido del íleon y se continúa con el colon ascendente.', W('Cecum', 'is a pouch within the peritoneum that is considered to be the beginning of the large intestine'), W('Cecum', 'It is typically located on the right side of the body'), W('Cecum', 'It receives chyme from the ileum, and connects to the ascending colon of the large intestine.')];
const MESOCOLICOS = ['Los nodos mesocólicos son numerosos y están entre las hojas del mesocolon transverso, muy cerca del colon transverso; están más desarrollados cerca de las flexuras cólicas derecha e izquierda.', SM('The mesocolic lymph nodes are numerous, and lie between the layers of the transverse mesocolon, in close relation to the transverse colon; they are best developed in the neighborhood of the right and left colic flexures.')];

// Nodos mesentéricos inferiores (Gray, en «Inferior mesenteric lymph nodes»).
const IM = (c) => W('Inferior_mesenteric_lymph_nodes', c);
const IM_RECIBE = ['Los mesentéricos inferiores drenan estructuras del intestino posterior: reciben la linfa del colon descendente, el colon sigmoide y la parte proximal del recto.', IM('they receive lymph from the descending colon, sigmoid colon, and proximal part of the rectum')];
const COLON_IZDO = ['La linfa del tercio distal del colon transverso, el colon descendente, el colon sigmoide y la parte alta del recto va a los nodos mesentéricos inferiores y cólicos.', W('Large_intestine', 'The lymph from the distal one-third of the transverse colon, the descending colon, the sigmoid colon, and the upper rectum drain into the inferior mesenteric and colic lymph nodes.')];
const IM_DRENA = ['Drenan en los mesentéricos superiores y, al final, en los preaórticos; los nodos que rodean la arteria mesentérica inferior drenan directamente en los preaórticos.', IM('They drain into the superior mesenteric lymph nodes and ultimately to the preaortic lymph nodes.'), IM('Lymph nodes surrounding the inferior mesenteric artery drain directly into the preaortic nodes.')];
const IM_CLINICA = ['El cáncer colorrectal puede dar metástasis en los nodos mesentéricos inferiores.', IM('Colorectal cancer may metastasise to the inferior mesenteric lymph nodes.')];
const IM_SIN_CENTRALES = ['En este modelo no hay pieza propia para los nodos mesentéricos inferiores alrededor de la arteria (TA2 n.º 5312) ni para los anorrectales superiores (n.º 5316).', TA(5312), TA(5316), MODELO];

export default {
  // ── Lumbares (parietales) ──────────────────────────────────────────────────────────────────────────────────────────
  Lateral_aortic_nodes: {
    tipo: 'nodo', ta2: 5271,
    descripcion: [LUMB_QUE, PARA_SINONIMO, LUMB_TA],
    localizacion: [
      PARA_SITIO,
      ['Los del lado izquierdo forman una cadena a la izquierda de la aorta abdominal, delante del origen del psoas mayor y sobre el pilar izquierdo del diafragma.', LUMB('The left paraaortic nodes form a chain on the left side of the abdominal aorta in front of the origin of the psoas major and on the left crus of the diaphragm.')],
    ],
    reparo: [AORTA],
    recibe: [
      ['El grupo aórtico lateral drena los nodos ilíacos, los ovarios, los testículos y otros órganos de la pelvis.', LUMB('The paraaortic group (also known as lateral aortic group) drains the iliac nodes, the ovaries, the testes and other pelvic organs.')],
      PARA_RECIBE,
    ],
    drena: [
      PARA_DRENA,
      ['Los troncos lumbares se forman por la unión de los eferentes de los nodos aórticos laterales.', W('Lumbar_trunk', 'The lumbar trunks are formed by the union of the efferent vessels from the lateral aortic lymph nodes.')],
    ],
    modelo: [
      REPRESENTATIVO,
      ['La TA2 pone los aórticos laterales entre los nodos lumbares izquierdos; en este modelo son una sola pieza a la izquierda de la aorta, de la que nace el tronco lumbar izquierdo, y los paraaórticos del lado derecho se representan como nodos cavales.', TA(5270), MODELO],
    ],
    notas: [
      ['Los aórticos laterales, de 15 a 20 por lado según la fuente, son los que se suelen elegir para la disección o la biopsia en el diagnóstico o el tratamiento del cáncer.', LUMB('The lateral aortic lymph nodes, typically 15 to 20 on each side, are the ones usually chosen for dissection or biopsy in the treatment or diagnosis of cancer.')],
      RETROPERITONEO,
    ],
    vias: { recibe: ILIACOS_COMUNES, drena: ['Lumbar_trunk', 'Pre_aortic_nodes', 'Retro_aortic_nodes', 'Thoracic_duct'] },
  },

  Pre_aortic_nodes: {
    tipo: 'nodo', ta2: 5272,
    descripcion: [
      ['Nodos (ganglios) situados delante de la aorta.', PRE('The preaortic lymph nodes lie in front of the aorta')],
      ['La fuente reparte los preaórticos en tres grupos (celíacos, mesentéricos superiores y mesentéricos inferiores), dispuestos alrededor del origen de sus arterias.', PRE('may be divided into celiac lymph nodes, superior mesenteric lymph nodes, and inferior mesenteric lymph nodes groups, arranged around the origins of the corresponding arteries')],
      ['La Terminologia Anatomica 2, en cambio, pone los preaórticos entre los nodos lumbares izquierdos, que son parietales, y clasifica los celíacos y los mesentéricos como viscerales.', TA(5269), TA(5270), TA(5272), TA(5281), TA(5282), TA(5302), TA(5312)],
    ],
    localizacion: [
      ['Están delante de la aorta abdominal, que baja por la pared posterior del abdomen delante de la columna.', PRE('The preaortic lymph nodes lie in front of the aorta'), W('Abdominal_aorta', 'It travels down the posterior wall of the abdomen, anterior to the vertebral column.')],
    ],
    reparo: [
      ['La cara anterior de la aorta abdominal, de la que salen, de arriba abajo, el tronco celíaco (a la altura de T12–L1), la arteria mesentérica superior (justo por debajo, delante del borde inferior de L1) y la mesentérica inferior (en L3).', W('Celiac_artery', 'In typical anatomy, this is at the T12-L1 vertebral level.'), W('Superior_mesenteric_artery', 'arises from the anterior surface of the abdominal aorta, just inferior to the origin of the celiac trunk'), W('Superior_mesenteric_artery', 'In the adult, the SMA arises anterior to inferior border of vertebra L1 (transpyloric plane).'), W('Inferior_mesenteric_artery', 'is the third main branch of the abdominal aorta and arises at the level of L3')],
    ],
    recibe: [
      ['Reciben unos pocos vasos de los nodos aórticos laterales, pero sus aferentes principales vienen de los órganos que irrigan el tronco celíaco y las arterias mesentéricas superior e inferior.', PRE('The preaortic lymph nodes receive a few vessels from the lateral aortic lymph nodes'), PRE('their principal afferents are derived from the organs supplied by the three arteries with which they are associated')],
      ['Los nodos que rodean la arteria mesentérica inferior drenan directamente en los preaórticos.', IM('Lymph nodes surrounding the inferior mesenteric artery drain directly into the preaortic nodes.')],
    ],
    drena: [PRE_DRENA],
    modelo: [
      REPRESENTATIVO,
      ['En este modelo, como en la TA2, los preaórticos son una pieza aparte de los celíacos y los mesentéricos; lo que la fuente dice de sus aferentes y eferentes se refiere al conjunto que ella llama preaórtico.', TA(5272), MODELO],
      ['En este modelo el colector esquemático lleva su linfa a los nodos aórticos laterales y de ahí al tronco lumbar izquierdo, no al tronco intestinal que describe la fuente.', MODELO],
    ],
    vias: { recibe: ['Lateral_aortic_nodes', 'Left_colic_nodes', 'Sigmoid_nodes'], drena: ['Intestinal_trunks', 'Retro_aortic_nodes'] },
  },

  Retro_aortic_nodes: {
    tipo: 'nodo', ta2: 5273,
    descripcion: [
      ['Nodos (ganglios) lumbares que también se llaman postaórticos.', W('Retroaortic_lymph_nodes', 'The retroaortic lymph nodes (or postaortic lymph nodes)')],
      LUMB_TA,
    ],
    localizacion: [
      ['Están por debajo de la cisterna del quilo, sobre los cuerpos de la tercera y la cuarta vértebras lumbares.', W('Retroaortic_lymph_nodes', 'are placed below the cisterna chyli, on the bodies of the third and fourth lumbar vertebrae')],
      ['A veces se incluyen en el grupo paraaórtico por su posición, también lateral, y porque drenan igual.', LUMB('The retroaortic group are sometimes included in the paraaortic group due to their position (which is also lateral) and the same pattern of lymphatic drainage.')],
    ],
    reparo: [
      ['Los cuerpos de las vértebras L3 y L4, sobre los que están, por debajo de la cisterna del quilo.', W('Retroaortic_lymph_nodes', 'are placed below the cisterna chyli, on the bodies of the third and fourth lumbar vertebrae')],
    ],
    recibe: [
      ['Reciben troncos linfáticos de los nodos aórticos laterales y de los preaórticos.', W('Retroaortic_lymph_nodes', 'They receive lymphatic trunks from the lateral and preaortic glands')],
      PARA_RECIBE,
    ],
    drena: [
      ['Sus eferentes terminan en la cisterna del quilo.', W('Retroaortic_lymph_nodes', 'while their efferents end in the cisterna chyli')],
    ],
    modelo: [
      REPRESENTATIVO,
      ['En este modelo el colector esquemático une los retroaórticos con los aórticos laterales, y no directamente con la cisterna del quilo como dice la fuente.', MODELO],
    ],
    vias: { recibe: ['Lateral_aortic_nodes', 'Pre_aortic_nodes'], drena: ['Cisterna_chyli'] },
  },

  Intermediate_lumbar_nodes: {
    tipo: 'nodo', ta2: 5274,
    descripcion: [
      ['Nodos (ganglios) lumbares que la Terminologia Anatomica 2 llama lumbares intermedios y que pone, en su lista, entre los lumbares izquierdos y los derechos.', TA(5270), TA(5274), TA(5275)],
      PARIETALES(5274),
    ],
    localizacion: [
      ['Como el resto de los nodos lumbares, están delante de las vértebras lumbares, cerca de la aorta.', LUMB('are a group of lymph nodes that lie in front of the lumbar vertebrae near the aorta')],
    ],
    modelo: [
      REPRESENTATIVO,
      ['En este modelo el vaso más próximo a sus cinco nodos es la aorta abdominal.', MODELO],
      ['En este modelo un colector esquemático los une con los aórticos laterales y con los cavales laterales; no hay fuente citada para ese trayecto.', MODELO],
    ],
    pendientes: {
      reparo: SIN_FUENTE,
      recibe: SIN_FUENTE,
      drena: `${SIN_FUENTE} La tabla del encargo supone que drena en los dos troncos lumbares, pero no se afirma sin fuente.`,
    },
  },

  Lateral_caval_nodes: {
    tipo: 'nodo', ta2: 5276,
    descripcion: [LUMB_QUE, LUMB_TA],
    localizacion: [PARA_DERECHOS],
    reparo: [CAVA],
    recibe: [PARA_RECIBE],
    drena: [PARA_DRENA],
    modelo: [REPRESENTATIVO, DERECHOS_MODELO, TRONCO_DCHO],
    notas: [RETROPERITONEO],
    vias: { recibe: ILIACOS_COMUNES, drena: ['Lumbar_trunk', 'Pre_aortic_nodes', 'Retro_aortic_nodes', 'Thoracic_duct'] },
  },

  Precaval_nodes: {
    tipo: 'nodo', ta2: 5277,
    descripcion: [LUMB_QUE, LUMB_TA],
    localizacion: [
      ['Corresponden a la parte de los paraaórticos derechos que está delante de la vena cava inferior, cerca de la desembocadura de la vena renal.', LUMB('The right paraaortic nodes, are situated partly in front of the inferior vena cava near the termination of the renal vein')],
    ],
    reparo: [CAVA],
    recibe: [PARA_RECIBE],
    drena: [PARA_DRENA],
    modelo: [REPRESENTATIVO, DERECHOS_MODELO, TRONCO_DCHO],
    vias: { recibe: ILIACOS_COMUNES, drena: ['Lumbar_trunk', 'Pre_aortic_nodes', 'Retro_aortic_nodes', 'Thoracic_duct'] },
  },

  Retrocaval_nodes: {
    tipo: 'nodo', ta2: 5278,
    descripcion: [LUMB_QUE, LUMB_TA],
    localizacion: [
      ['Corresponden a la parte de los paraaórticos derechos que está detrás de la vena cava inferior, sobre el origen del psoas mayor y sobre el pilar derecho del diafragma.', LUMB('and partly behind it on the origin of the psoas major, and on the right crus of diaphragm')],
    ],
    reparo: [CAVA],
    recibe: [PARA_RECIBE],
    drena: [PARA_DRENA],
    modelo: [REPRESENTATIVO, DERECHOS_MODELO, TRONCO_DCHO],
    vias: { recibe: ILIACOS_COMUNES, drena: ['Lumbar_trunk', 'Pre_aortic_nodes', 'Retro_aortic_nodes', 'Thoracic_duct'] },
  },

  // ── Otros parietales ───────────────────────────────────────────────────────────────────────────────────────────────
  Inferior_diaphragmatic_nodes: {
    tipo: 'nodo', ta2: 5279,
    descripcion: [
      ['Nodos (ganglios) que la Terminologia Anatomica 2 llama nodos frénicos (diafragmáticos) inferiores.', TA(5279)],
      PARIETALES(5279),
    ],
    modelo: [
      REPRESENTATIVO,
      ['En este modelo los nodos están arriba, cerca del diafragma; los vasos más próximos son la vena cava inferior, la aorta y las venas hepáticas.', MODELO],
      ['En este modelo un colector esquemático los une con los nodos lumbares de su lado; no hay fuente citada para ese trayecto.', MODELO],
    ],
    pendientes: {
      localizacion: SIN_FUENTE,
      reparo: SIN_FUENTE,
      recibe: SIN_FUENTE,
      drena: `${SIN_FUENTE} La tabla del encargo supone que drena en los nodos lumbares, pero no se afirma sin fuente.`,
    },
  },

  Inferior_epigastric_nodes: {
    tipo: 'nodo', ta2: 5280,
    descripcion: [
      ['Nodos (ganglios) de la pared del abdomen que la Terminologia Anatomica 2 llama nodos epigástricos inferiores.', TA(5280)],
      PARIETALES(5280),
    ],
    modelo: [
      REPRESENTATIVO,
      POSICION_ZA,
      ['En este modelo un colector esquemático los une con los nodos ilíacos externos mediales de su lado; no hay fuente citada para ese trayecto.', MODELO],
    ],
    pendientes: {
      localizacion: SIN_FUENTE,
      reparo: `${SIN_FUENTE} Su nombre los relaciona con los vasos epigástricos inferiores, pero ninguna fuente consultada describe esa relación.`,
      recibe: SIN_FUENTE,
      drena: `${SIN_FUENTE} La tabla del encargo supone que drena en los nodos ilíacos externos, pero no se afirma sin fuente.`,
    },
  },

  // ── Celíacos y sus satélites ───────────────────────────────────────────────────────────────────────────────────────
  Coeliac_nodes: {
    tipo: 'nodo', ta2: 5282,
    descripcion: [
      ['Nodos (ganglios) asociados a las ramas del tronco celíaco.', W('Celiac_lymph_nodes', 'The celiac lymph nodes are associated with the branches of the celiac artery.')],
      ['La fuente los agrupa en tres conjuntos: gástricos, hepáticos y esplénicos.', W('Celiac_lymph_nodes', 'The celiac lymph nodes are grouped into three sets: the gastric, hepatic and splenic lymph nodes.')],
      PRE_TRES,
    ],
    localizacion: [
      ['Están delante de la columna, en el origen del tronco celíaco desde la aorta.', W('Stomach', 'Lymph from these organs is drained to the prevertebral celiac nodes at the origin of the celiac artery from the aorta.')],
    ],
    reparo: [
      ['El tronco celíaco, primera rama grande de la aorta abdominal, que sale de ella en ángulo recto a la altura del disco entre T12 y L1.', W('Celiac_artery', 'is the first major branch of the abdominal aorta'), W('Celiac_artery', 'branching at a 90° angle'), W('Celiac_artery', 'Branching from the aorta at the level of the T12-L1 intervertebral disc in typical anatomy')],
    ],
    recibe: [
      ['Reciben la linfa del estómago, el duodeno, el páncreas, el bazo, el hígado y la vesícula biliar.', W('Celiac_lymph_nodes', 'They receive lymph from the stomach, duodenum, pancreas, spleen, liver, and gall bladder.')],
      ['Les llegan los eferentes de la cadena hepática y, a través de los nodos suprapancreáticos, infrapancreáticos y omentales, los de los nodos esplénicos.', HEP('their efferents join the celiac group of preaortic lymph nodes'), W('Splenic_lymph_nodes', 'The splenic lymph nodes empty into the suprapancreatic, infrapancreatic and omental lymph nodes, which then drain to the coeliac nodes and cisterna chyli.')],
      ['Toda la linfa de la vesícula biliar acaba en ellos, y también la de los nodos del duodeno.', W('Gallbladder', 'All the lymph finally drains into celiac lymph nodes.'), W('Duodenum', 'Efferent lymphatic vessels from the duodenal lymph nodes ultimately pass into the celiac lymph nodes.')],
    ],
    drena: [PRE_DRENA, TRONCO_INTESTINAL],
    modelo: [
      REPRESENTATIVO,
      ['En los dos modelos los centros de los nodos celíacos están a 11–17 mm del origen del tronco celíaco (medido al construir).', MODELO],
      SIN_HEPATICOS,
      ['En este modelo los troncos intestinales nacen de los celíacos y de los mesentéricos superiores centrales y van a la cisterna del quilo.', MODELO],
    ],
    vias: {
      recibe: ['Suprapyloric_node', 'Subpyloric_nodes', 'Cystic_node', 'Superior_pancreatic_nodes', 'Inferior_pancreatic_nodes'],
      drena: ['Intestinal_trunks', 'Retro_aortic_nodes'],
    },
  },

  Right_gastric_nodes: {
    tipo: 'nodo', ta2: 5283,
    descripcion: [
      ['Nodos (ganglios) del estómago que la Terminologia Anatomica 2 llama nodos gástricos derechos.', TA(5283)],
      VISCERALES(5283),
    ],
    modelo: [
      REPRESENTATIVO,
      POSICION_ZA,
      ['La fuente sobre los nodos gástricos describe un grupo superior junto a la arteria gástrica izquierda y uno inferior en la curvatura mayor; no describe un grupo gástrico derecho.', W('Gastric_lymph_nodes', 'The superior gastric lymph nodes (Latin: lymphoglandulæ gastricæ superiores) accompany the left gastric artery'), MODELO],
      ['En este modelo no hay pieza de nodos gástricos izquierdos (TA2 n.º 5284) ni gastroomentales izquierdos (n.º 5287).', TA(5284), TA(5287), MODELO],
    ],
    pendientes: {
      localizacion: SIN_FUENTE,
      reparo: `${SIN_FUENTE} Su nombre los relaciona con la arteria gástrica derecha, pero ninguna fuente consultada describe esa relación.`,
      recibe: SIN_FUENTE,
      drena: `${SIN_FUENTE} La tabla del encargo supone que drena en los celíacos, pero no se afirma sin fuente.`,
    },
  },

  Right_gastro_omental_nodes: {
    tipo: 'nodo', ta2: 5286,
    descripcion: [
      ['Son los nodos (ganglios) gástricos inferiores, también llamados gastroepiploicos derechos: de cuatro a siete.', W('Gastric_lymph_nodes', 'The inferior gastric lymph nodes (Latin: lymphoglandulæ gastricæ inferiores; right gastroepiploic lymph nodes), four to seven in number')],
      ['La fuente divide los nodos gástricos, que drenan el estómago, en dos grupos: superior e inferior.', W('Gastric_lymph_nodes', 'which drain the stomach and consist of two sets, superior and inferior')],
    ],
    localizacion: [
      ['Están entre las dos hojas del omento mayor, a lo largo de la mitad pilórica de la curvatura mayor del estómago.', W('Gastric_lymph_nodes', 'lie between the two layers of the greater omentum along the pyloric half of the greater curvature of the stomach')],
    ],
    reparo: [
      ['La arteria gastroomental (gastroepiploica) derecha, rama terminal de la gastroduodenal, que recorre de derecha a izquierda la curvatura mayor del estómago entre las hojas del omento mayor, a un través de dedo de ella salvo en el píloro.', W('Right_gastroepiploic_artery', 'The right gastroepiploic artery (or right gastro-omental artery)  is one of the two terminal branches of the gastroduodenal artery.'), W('Right_gastroepiploic_artery', 'It runs from right to left along the greater curvature of the stomach, between the layers of the greater omentum'), W('Right_gastroepiploic_artery', 'Except at the pylorus where it is in contact with the stomach, it lies about a finger\'s breadth from the greater curvature.')],
    ],
    recibe: [
      ['Drenan el estómago.', W('Gastric_lymph_nodes', 'The gastric lymph nodes are lymph nodes (also known as lymph glands) which drain the stomach')],
    ],
    drena: [GASTRICOS_A_CISTERNA],
    modelo: [
      REPRESENTATIVO,
      ['En este modelo un colector esquemático los lleva a los nodos subpilóricos y de ahí a los celíacos; la fuente no describe ese paso.', MODELO],
    ],
    vias: { drena: ['Intestinal_trunks'] },
  },

  Suprapyloric_node: {
    tipo: 'nodo', ta2: 5289,
    descripcion: [
      ['Nodo (ganglio) que la Terminologia Anatomica 2 llama nodo suprapilórico, uno de los nodos pilóricos.', TA(5288), TA(5289)],
      PARENTESIS(5289),
    ],
    localizacion: [
      ['A veces hay un nodo satélite de los subpilóricos por encima del duodeno, sobre la arteria gástrica derecha (pilórica).', HEP('an outlying member of this group is sometimes found above the duodenum on the right gastric (pyloric) artery')],
      PILORICOS_GDA,
    ],
    reparo: [
      ['La arteria gástrica derecha, que suele nacer de la arteria hepática propia y baja hasta el extremo pilórico del estómago antes de recorrer la curvatura menor de derecha a izquierda.', W('Right_gastric_artery', 'The right gastric artery usually arises from the proper hepatic artery.'), W('Right_gastric_artery', 'It descends to the pyloric end of the stomach before passing from right to left along its lesser curvature')],
    ],
    recibe: [HEP_RECIBE, DUODENO_A_PILORICOS],
    drena: [HEP_DRENA],
    modelo: [
      UN_NODO,
      NUEVA,
      ['Esta ficha identifica el nodo suprapilórico de la TA2 con el nodo satélite que la fuente sitúa sobre la arteria gástrica derecha, por encima del duodeno; la fuente no usa el término de la TA2.', TA(5289), MODELO],
    ],
    vias: { drena: ['Coeliac_nodes'] },
  },

  Subpyloric_nodes: {
    tipo: 'nodo', ta2: 5290,
    descripcion: [
      ['Nodos (ganglios) pilóricos situados por debajo del píloro, de cuatro a cinco según la fuente.', TA(5288), TA(5290), HEP('subpyloric, four or five in number')],
      PARENTESIS(5290),
      PILORICOS_TA,
    ],
    localizacion: [
      ['Están muy cerca de la bifurcación de la arteria gastroduodenal, en el ángulo entre las porciones superior y descendente del duodeno.', HEP('in close relation to the bifurcation of the gastroduodenal artery, in the angle between the superior and descending parts of the duodenum')],
      PILORICOS_GDA,
    ],
    reparo: [
      ['La bifurcación de la arteria gastroduodenal en la gastroomental derecha y la pancreaticoduodenal superior anterior.', W('Gastroduodenal_artery', 'It terminates in a bifurcation when it splits into the right gastroepiploic artery and the anterior superior pancreaticoduodenal artery')],
    ],
    recibe: [HEP_RECIBE, DUODENO_A_PILORICOS],
    drena: [HEP_DRENA],
    modelo: [
      REPRESENTATIVO,
      NUEVA,
      ['La fuente cuenta los subpilóricos en la cadena hepática; la TA2 los pone entre los nodos pilóricos.', HEP('The hepatic lymph nodes consist of the following groups:'), TA(5288), MODELO],
    ],
    vias: { recibe: ['Superior_pancreaticoduodenal_nodes'], drena: ['Coeliac_nodes'] },
  },

  Retropyloric_nodes: {
    tipo: 'nodo', ta2: 5291,
    descripcion: [
      ['Nodos (ganglios) que la Terminologia Anatomica 2 llama retropilóricos, uno de los grupos de nodos pilóricos.', TA(5288), TA(5291)],
      PARENTESIS(5291),
      PILORICOS_TA,
    ],
    localizacion: [PILORICOS_GDA],
    recibe: [DUODENO_A_PILORICOS],
    modelo: [
      UN_NODO,
      NUEVA,
      ['La fuente habla de los nodos pilóricos en conjunto; esta ficha les aplica lo que dice de ellos porque no describe los retropilóricos por separado.', MODELO],
    ],
    pendientes: {
      reparo: SIN_FUENTE,
      drena: `${SIN_FUENTE} La tabla del encargo supone que drena en los celíacos, pero no se afirma sin fuente.`,
    },
    vias: { recibe: ['Superior_pancreaticoduodenal_nodes'] },
  },

  Superior_pancreatic_nodes: {
    tipo: 'nodo', ta2: 5293,
    descripcion: [
      ['Nodos (ganglios) pancreáticos que la Terminologia Anatomica 2 llama superiores.', TA(5292), TA(5293)],
      VISCERALES(5293),
    ],
    recibe: [
      ['Los nodos esplénicos vierten su linfa en los nodos suprapancreáticos, infrapancreáticos y omentales.', W('Splenic_lymph_nodes', 'The splenic lymph nodes empty into the suprapancreatic, infrapancreatic and omental lymph nodes')],
    ],
    drena: [
      ['Los suprapancreáticos, los infrapancreáticos y los omentales drenan en los nodos celíacos y en la cisterna del quilo.', W('Splenic_lymph_nodes', 'which then drain to the coeliac nodes and cisterna chyli')],
    ],
    modelo: [
      REPRESENTATIVO,
      ['Esta ficha identifica los nodos pancreáticos superiores de la TA2 con los suprapancreáticos que nombra la fuente; la fuente no los describe más.', TA(5293), MODELO],
      ['En los dos modelos, dos de sus cuatro nodos tienen como vaso más próximo la arteria esplénica.', MODELO],
    ],
    pendientes: { localizacion: SIN_FUENTE, reparo: SIN_FUENTE },
    vias: { recibe: ['Splenic_nodes'], drena: ['Coeliac_nodes', 'Cisterna_chyli'] },
  },

  Inferior_pancreatic_nodes: {
    tipo: 'nodo', ta2: 5294,
    descripcion: [
      ['Nodos (ganglios) pancreáticos que la Terminologia Anatomica 2 llama inferiores.', TA(5292), TA(5294)],
      VISCERALES(5294),
    ],
    recibe: [
      ['Los nodos esplénicos vierten su linfa en los nodos suprapancreáticos, infrapancreáticos y omentales.', W('Splenic_lymph_nodes', 'The splenic lymph nodes empty into the suprapancreatic, infrapancreatic and omental lymph nodes')],
    ],
    drena: [
      ['Los suprapancreáticos, los infrapancreáticos y los omentales drenan en los nodos celíacos y en la cisterna del quilo.', W('Splenic_lymph_nodes', 'which then drain to the coeliac nodes and cisterna chyli')],
    ],
    modelo: [
      REPRESENTATIVO,
      ['Esta ficha identifica los nodos pancreáticos inferiores de la TA2 con los infrapancreáticos que nombra la fuente; la fuente no los describe más.', TA(5294), MODELO],
    ],
    pendientes: { localizacion: SIN_FUENTE, reparo: SIN_FUENTE },
    vias: { recibe: ['Splenic_nodes'], drena: ['Coeliac_nodes', 'Cisterna_chyli'] },
  },

  Splenic_nodes: {
    tipo: 'nodo', ta2: 5295,
    descripcion: [
      ['Nodos (ganglios) del hilio del bazo; los que están junto a la cola del páncreas se llaman también pancreaticoesplénicos.', W('Splenic_lymph_nodes', 'The splenic lymph nodes are found at the splenic hilum and in relation to the tail of the pancreas (pancreaticolienal lymph nodes).')],
      ['La fuente los cuenta entre los tres conjuntos de nodos celíacos.', W('Celiac_lymph_nodes', 'The celiac lymph nodes are grouped into three sets: the gastric, hepatic and splenic lymph nodes.')],
    ],
    localizacion: [
      ['Están en el hilio del bazo y junto a la cola del páncreas.', W('Splenic_lymph_nodes', 'are found at the splenic hilum and in relation to the tail of the pancreas')],
    ],
    reparo: [
      ['El hilio del bazo, por donde entran la arteria y la vena esplénicas; la arteria esplénica, rama del tronco celíaco, llega a él por encima del páncreas.', W('Spleen', 'The splenic artery and splenic vein enter the spleen at the splenic hilum.'), W('Splenic_artery', 'It branches from the celiac artery, and follows a course superior to the pancreas.')],
    ],
    recibe: [
      ['Sus aferentes vienen del estómago, el bazo y el páncreas.', W('Splenic_lymph_nodes', 'Their afferents are derived from the stomach, spleen, and pancreas.')],
      ['A ellos van los linfáticos del cuerpo y la cola del páncreas.', W('Pancreas', 'The lymphatic vessels of the body and tail drain into splenic lymph nodes')],
    ],
    drena: [
      ['Vierten en los nodos suprapancreáticos, infrapancreáticos y omentales, que drenan en los nodos celíacos y en la cisterna del quilo.', W('Splenic_lymph_nodes', 'The splenic lymph nodes empty into the suprapancreatic, infrapancreatic and omental lymph nodes, which then drain to the coeliac nodes and cisterna chyli.')],
    ],
    modelo: [
      REPRESENTATIVO,
      ['En este modelo un colector esquemático los lleva directamente a los nodos celíacos.', MODELO],
    ],
    vias: { drena: ['Superior_pancreatic_nodes', 'Inferior_pancreatic_nodes'] },
  },

  Superior_pancreaticoduodenal_nodes: {
    tipo: 'nodo', ta2: 5297,
    descripcion: [
      ['Nodos (ganglios) pancreaticoduodenales que la Terminologia Anatomica 2 llama superiores.', TA(5296), TA(5297)],
      VISCERALES(5297),
    ],
    localizacion: [
      ['Los nodos pancreaticoduodenales están a lo largo de las arterias pancreaticoduodenales superior e inferior.', W('Duodenum', 'the pancreatoduodenal lymph nodes located along the superior and inferior pancreatoduodenal arteries')],
    ],
    reparo: [
      ['La arteria pancreaticoduodenal superior, rama de la gastroduodenal, cuyas ramas anterior y posterior rodean la cabeza del páncreas y el duodeno.', W('Superior_pancreaticoduodenal_artery', 'It is a branch of the gastroduodenal artery'), W('Superior_pancreaticoduodenal_artery', 'These branches then travel around the head of the pancreas and duodenum')],
    ],
    recibe: [
      ['A ellos van los linfáticos anteriores del duodeno.', W('Duodenum', 'The anterior lymphatic vessels drain into the pancreatoduodenal lymph nodes')],
      ['Los linfáticos de la cabeza y el cuello del páncreas van a vasos linfáticos intermedios alrededor de las arterias pancreaticoduodenales, mesentéricas y hepáticas, y de ahí a los nodos situados delante de la aorta.', W('Pancreas', 'The lymphatic vessels of the head and neck drain into intermediate lymphatic vessels around the pancreaticoduodenal, mesenteric and hepatic arteries, and from there into the lymph nodes that lie in front of the aorta.')],
    ],
    drena: [
      ['Drenan en los nodos pilóricos, a lo largo de la arteria gastroduodenal.', W('Duodenum', 'and then into the pyloric lymph nodes (along the gastroduodenal artery)')],
    ],
    modelo: [
      REPRESENTATIVO,
      ['En este modelo no hay pieza de nodos pancreaticoduodenales inferiores (TA2 n.º 5298).', TA(5298), MODELO],
      ['En este modelo un colector esquemático los lleva directamente a los nodos celíacos, sin pasar por los pilóricos que describe la fuente.', MODELO],
    ],
    vias: { drena: ['Subpyloric_nodes', 'Suprapyloric_node', 'Retropyloric_nodes'] },
  },

  Cystic_node: {
    tipo: 'nodo', ta2: 5300,
    descripcion: [
      ['Nodo (ganglio) centinela de la vesícula biliar, también llamado nodo de Lund o de Mascagni; a menudo se le llama, por error, nodo de Calot.', W('Cystic_node', 'cystic lymph node of Lund, Lund\'s node, or Mascagni\'s lymph node and often erroneously referred to as Calot\'s node) is the sentinel lymph node of the gall bladder')],
      ['La fuente lo cuenta en la cadena hepática.', HEP('the cystic gland, a member of this group, is placed near the neck of the gall-bladder')],
    ],
    localizacion: [
      ['Está en el cuello de la vesícula biliar, dentro del triángulo cistohepático (de Calot), siempre por fuera de la vía biliar.', W('Cystic_node', 'The cystic lymph node is situated at the neck of the gallbladder.'), W('Cystic_node', 'It is located within the cystohepatic triangle (Calot\'s triangle).'), W('Cystic_node', 'It is invariably situated lateral to the biliary tree.')],
      ['Queda entre el conducto cístico y el conducto hepático común.', W('Gallbladder', 'which is located between the cystic duct and the common hepatic duct')],
    ],
    reparo: [
      ['El triángulo cistohepático, que contiene grasa y tejido conectivo, vasos linfáticos y el nodo cístico, nervios autónomos y, por lo general, la arteria cística.', W('Cystohepatic_triangle', 'The triangle contains: adipose and connective tissue, lymphatic vessels and the cystic lymph node, autonomic nerves, (usually) cystic artery')],
      ['En un estudio retrospectivo, cuando se identificó el nodo, estaba en relación con la arteria cística en alrededor del 97 % de los casos.', W('Cystic_node', 'the node was related to the cystic artery in ~97% of cases')],
    ],
    recibe: [
      ['Recibe la linfa de la vesícula biliar, el conducto cístico, el conducto hepático y la parte superior del colédoco.', W('Cystic_node', 'The node receives lymphatic drainage from the gallbladder, cystic duct, hepatic duct, and the superior portion of the common bile duct.')],
    ],
    drena: [
      ['Drena en los nodos hepáticos.', W('Cystic_node', 'It in turn drains lymph into the hepatic lymph nodes.')],
      ['Toda la linfa de la vesícula biliar acaba en los nodos celíacos.', W('Gallbladder', 'All the lymph finally drains into celiac lymph nodes.')],
    ],
    modelo: [
      UN_NODO,
      SIN_HEPATICOS,
      ['En este modelo un colector esquemático lo une directamente con los nodos celíacos.', MODELO],
    ],
    notas: [
      ['Aumenta de tamaño en la colecistitis y la colangitis.', W('Cystic_node', 'It increases in size in cholecystitis and cholangitis')],
      ['Es un reparo anatómico en la colecistectomía para evitar lesionar la vía biliar.', W('Cystic_node', 'It is an anatomic landmark and may be removed along with the gallbladder in cholecystectomy.'), W('Cystic_node', 'The node can be used as a landmark to prevent iatrogenic injury during surgery in the cystohepatic triangle')],
    ],
    vias: { drena: ['Coeliac_nodes'] },
  },

  // ── Mesentéricos superiores ────────────────────────────────────────────────────────────────────────────────────────
  Juxta_intestinal_mesenteric_nodes: {
    tipo: 'nodo', ta2: 5303,
    descripcion: [
      SM_TRES,
      ['Los nodos mesentéricos están entre las hojas del mesenterio y son de cien a ciento cincuenta.', SM('lie between the layers of the mesentery'), SM('They number from one hundred to one hundred and fifty')],
    ],
    localizacion: [
      ['Uno de sus grupos está junto a la pared del intestino delgado, entre las últimas ramas de la arteria mesentérica superior.', SM('lying close to the wall of the small intestine, among the terminal twigs of the superior mesenteric artery')],
    ],
    reparo: [
      ['Las últimas ramas de la arteria mesentérica superior junto a la pared del intestino delgado.', SM('among the terminal twigs of the superior mesenteric artery')],
    ],
    recibe: [SM_RECIBE],
    drena: [SM_DRENA],
    modelo: [
      REPRESENTATIVO,
      ['Esta ficha identifica los nodos yuxtaintestinales de la TA2 con el grupo de nodos mesentéricos que la fuente sitúa junto a la pared del intestino; en este modelo son 15 frente a los cien o más de la fuente.', TA(5303), MODELO],
    ],
    vias: { drena: ['Central_superior_mesenteric_nodes'] },
  },

  Central_superior_mesenteric_nodes: {
    tipo: 'nodo', ta2: 5304,
    descripcion: [
      SM_TRES,
      PRE_TRES,
    ],
    localizacion: [
      ['Los nodos mesentéricos superiores, uno de los grupos preaórticos, están alrededor del origen de su arteria, delante de la aorta.', PRE('superior mesenteric lymph nodes'), PRE('arranged around the origins of the corresponding arteries'), PRE('The preaortic lymph nodes lie in front of the aorta')],
    ],
    reparo: [
      ['La arteria mesentérica superior, que sale de la cara anterior de la aorta justo por debajo del tronco celíaco, delante del borde inferior de L1, y va a la izquierda de su vena.', W('Superior_mesenteric_artery', 'arises from the anterior surface of the abdominal aorta, just inferior to the origin of the celiac trunk'), W('Superior_mesenteric_artery', 'In the adult, the SMA arises anterior to inferior border of vertebra L1 (transpyloric plane).'), W('Superior_mesenteric_artery', 'The SMA typically runs to the left of its associated vein, the superior mesenteric vein.')],
    ],
    recibe: [
      SM_RECIBE,
      ['Les llegan los linfáticos posteriores del duodeno, que pasan por detrás de la cabeza del páncreas.', W('Duodenum', 'The posterior lymphatic vessels pass posterior to the head of the pancreas and drain into the superior mesenteric lymph nodes.')],
      ['Los mesentéricos inferiores drenan en los mesentéricos superiores.', IM('They drain into the superior mesenteric lymph nodes and ultimately to the preaortic lymph nodes.')],
      ['La linfa del cuerpo y la cola del páncreas pasa por los nodos esplénicos y acaba en nodos situados delante de la aorta, entre el tronco celíaco y la arteria mesentérica superior.', W('Pancreas', 'The lymphatic vessels of the body and tail drain into splenic lymph nodes, and eventually into lymph nodes that lie in front of the aorta, between the coeliac and superior mesenteric arteries.')],
    ],
    drena: [SM_DRENA, PRE_DRENA, TRONCO_INTESTINAL],
    modelo: [
      REPRESENTATIVO,
      ['Esta ficha identifica los mesentéricos superiores centrales de la TA2 con los nodos que la fuente coloca alrededor del origen de la arteria mesentérica superior.', TA(5304), MODELO],
      ['En este modelo los vasos más próximos a sus nodos son la arteria y la vena mesentéricas superiores, y de ellos nacen, con los celíacos, los troncos intestinales.', MODELO],
    ],
    vias: {
      recibe: ['Juxta_intestinal_mesenteric_nodes', 'Ileocolic_nodes', 'Right_colic_nodes', 'Middle_colic_nodes', 'Paracolic_superior_mesenteric_nodes', 'Left_colic_nodes', 'Sigmoid_nodes'],
      drena: ['Intestinal_trunks'],
    },
  },

  Ileocolic_nodes: {
    tipo: 'nodo', ta2: 5305,
    descripcion: [
      SM_TRES,
      ['Los nodos ileocólicos son de diez a veinte y forman una cadena alrededor de la arteria ileocólica.', SM('The ileocolic lymph nodes, from ten to twenty in number, form a chain around the ileocolic artery')],
    ],
    localizacion: [
      ['La cadena tiende a dividirse en dos grupos: uno cerca del duodeno y otro en la parte baja del tronco de la arteria.', SM('tend to subdivide into two groups, one near the duodenum and the other on the lower part of the trunk of the artery')],
      ['Donde la arteria da sus ramas terminales, la cadena se rompe en varios grupos: ileales, ileocólicos anteriores y posteriores, un nodo apendicular y cólicos derechos.', SM('Where the vessel divides into its terminal branches the chain is broken up into several groups:'), SM('(a) ileal, in relation to the ileal branch of the artery'), SM('(b) anterior ileocolic'), SM('(c) posterior ileocolic'), SM('(d) a single gland, between the layers of the mesenteriole of the appendix'), SM('(e) right colic, along the medial side of the ascending colon')],
    ],
    reparo: [ILEOCOLICA],
    recibe: [COLON_DCHO, SM_RECIBE],
    drena: [SM_DRENA],
    modelo: [
      REPRESENTATIVO,
      ['En este modelo el grupo tiene 2 nodos, frente a los diez a veinte de la fuente; los prececales, retrocecales y apendiculares son piezas aparte.', MODELO],
    ],
    vias: {
      recibe: ['Appendicular_nodes', 'Precaecal_nodes', 'Retrocaecal_nodes'],
      drena: ['Central_superior_mesenteric_nodes'],
    },
  },

  Precaecal_nodes: {
    tipo: 'nodo', ta2: 5306,
    descripcion: [
      ['Nodos (ganglios) situados delante del ciego, que la fuente llama ileocólicos anteriores.', TA(5306), SM('anterior ileocolic, usually of three glands, in the ileocolic fold, near the wall of the cecum')],
      CADENA_ILEOCOLICA,
    ],
    localizacion: [
      ['Suelen ser tres y están en el pliegue ileocólico, cerca de la pared del ciego.', SM('anterior ileocolic, usually of three glands, in the ileocolic fold, near the wall of the cecum')],
    ],
    reparo: [CIEGO],
    recibe: [COLON_DCHO, SM_RECIBE],
    drena: [SM_DRENA],
    modelo: [
      REPRESENTATIVO,
      ['Esta ficha identifica los prececales de la TA2 con los ileocólicos anteriores de la fuente.', TA(5306), MODELO],
    ],
    vias: { drena: ['Ileocolic_nodes'] },
  },

  Retrocaecal_nodes: {
    tipo: 'nodo', ta2: 5307,
    descripcion: [
      ['Nodos (ganglios) situados detrás del ciego, que la fuente incluye en los ileocólicos posteriores.', TA(5307), SM('posterior ileocolic, mostly placed in the angle between the ileum and the colon, but partly lying behind the cecum at its junction with the ascending colon')],
      CADENA_ILEOCOLICA,
    ],
    localizacion: [
      ['Los ileocólicos posteriores están sobre todo en el ángulo entre el íleon y el colon, y en parte detrás del ciego, donde se une con el colon ascendente.', SM('posterior ileocolic, mostly placed in the angle between the ileum and the colon, but partly lying behind the cecum at its junction with the ascending colon')],
    ],
    reparo: [CIEGO],
    recibe: [COLON_DCHO, SM_RECIBE],
    drena: [SM_DRENA],
    modelo: [
      REPRESENTATIVO,
      ['Esta ficha identifica los retrocecales de la TA2 con la parte de los ileocólicos posteriores de la fuente que está detrás del ciego.', TA(5307), MODELO],
    ],
    vias: { drena: ['Ileocolic_nodes'] },
  },

  Appendicular_nodes: {
    tipo: 'nodo', ta2: 5308,
    descripcion: [
      ['Nodo (ganglio) del mesoapéndice: la fuente describe uno solo, entre las hojas del meso del apéndice, como uno de los grupos de la cadena ileocólica.', SM('a single gland, between the layers of the mesenteriole of the appendix'), SM('Where the vessel divides into its terminal branches the chain is broken up into several groups:')],
    ],
    localizacion: [
      ['El mesoapéndice une el apéndice con el mesenterio de la parte baja del íleon y contiene la arteria y la vena apendiculares, vasos linfáticos, nervios y, a menudo, un nodo linfático.', W('Appendix_(anatomy)', 'The appendix is connected to the mesentery in the lower region of the ileum, by a short region of the mesocolon known as the mesoappendix.'), W('Mesentery', 'It encloses the appendicular artery and vein, as well as lymphatic vessels, nerves, and often a lymph node.')],
    ],
    reparo: [
      ['La arteria apendicular, que suele nacer de la rama terminal de la ileocólica, baja por detrás del final del íleon y entra en el mesoapéndice, cerca de su borde libre.', W('Appendicular_artery', 'commonly arises from the terminal branch of the ileocolic artery'), W('Appendicular_artery', 'It descends behind the termination of the ileum and enters the mesoappendix of the vermiform appendix.'), W('Appendicular_artery', 'It runs near the free margin of the mesoappendix')],
    ],
    recibe: [SM_RECIBE],
    drena: [SM_DRENA],
    modelo: [
      ['En este modelo el grupo tiene 3 nodos de forma y tamaño esquemáticos, aunque la fuente describe un solo nodo.', MODELO],
      ['En este modelo un colector esquemático lo une con los nodos ileocólicos.', MODELO],
    ],
    vias: { drena: ['Ileocolic_nodes'] },
  },

  Paracolic_superior_mesenteric_nodes: {
    tipo: 'nodo', ta2: 5309,
    descripcion: [SM_TRES, MESOCOLICOS],
    localizacion: [MESOCOLICOS],
    reparo: [
      ['El colon transverso y su mesocolon, la parte del mesenterio que lo une a la pared posterior del abdomen.', W('Mesentery', 'the transverse mesocolon attaching to the transverse colon'), W('Mesentery', 'The mesocolon (the part of the mesentery that attaches the colon to the abdominal wall)')],
    ],
    recibe: [COLON_DCHO, SM_RECIBE],
    drena: [SM_DRENA],
    modelo: [
      REPRESENTATIVO,
      ['Esta ficha identifica los paracólicos mesentéricos superiores de la TA2 con los nodos mesocólicos de la fuente.', TA(5309), MODELO],
      ['En este modelo un colector esquemático los lleva a los nodos cólicos derechos y medios.', MODELO],
    ],
    vias: { drena: ['Right_colic_nodes', 'Middle_colic_nodes', 'Central_superior_mesenteric_nodes'] },
  },

  Right_colic_nodes: {
    tipo: 'nodo', ta2: 5310,
    descripcion: [
      SM_TRES,
      ['La fuente describe nodos cólicos derechos en dos sitios: a lo largo del lado medial del colon ascendente, al final de la cadena ileocólica, y, alguna vez, uno o dos pequeños en el tronco de la arteria cólica derecha.', SM('(e) right colic, along the medial side of the ascending colon'), SM('One or two small glands are occasionally seen along the trunk of the right colic artery')],
    ],
    localizacion: [
      ['Están a lo largo del lado medial del colon ascendente.', SM('right colic, along the medial side of the ascending colon')],
    ],
    reparo: [
      ['La arteria cólica derecha, rama de la mesentérica superior, que va hacia la derecha por detrás del peritoneo, por delante de los vasos gonadales, el uréter y el psoas mayor derechos, hacia la mitad del colon ascendente.', W('Right_colic_artery', 'The right colic artery is a branch of the superior mesenteric artery.'), W('Right_colic_artery', 'It passes right-ward posterior to the peritoneum, and anterior to the right gonadal vessels, the right ureter, the psoas major muscle, passing toward the middle of the ascending colon.')],
    ],
    recibe: [COLON_DCHO, SM_RECIBE],
    drena: [SM_DRENA],
    modelo: [REPRESENTATIVO],
    vias: { drena: ['Central_superior_mesenteric_nodes'] },
  },

  Middle_colic_nodes: {
    tipo: 'nodo', ta2: 5311,
    descripcion: [
      SM_TRES,
      ['La fuente describe, entre los mesocólicos, nodos en relación con el tronco y las ramas de la arteria cólica media.', SM('others are found in relation to the trunk and branches of the middle colic artery')],
    ],
    localizacion: [
      ['Están en el tronco y las ramas de la arteria cólica media, entre las hojas del mesocolon transverso.', SM('others are found in relation to the trunk and branches of the middle colic artery'), W('Middle_colic_artery', 'passes anterosuperiorly between the layers of the transverse mesocolon')],
    ],
    reparo: [
      ['La arteria cólica media, que sale del lado derecho de la mesentérica superior justo por debajo del cuello del páncreas y sube entre las hojas del mesocolon transverso, a la derecha de la línea media, hasta dividirse en dos ramas.', W('Middle_colic_artery', 'branching off from its right aspect. Its origin is situated just inferior the neck of the pancreas.'), W('Middle_colic_artery', 'The middle colic artery passes anterosuperiorly between the layers of the transverse mesocolon just right of the midline before dividing into left and right terminal branches.')],
    ],
    recibe: [COLON_DCHO, SM_RECIBE],
    drena: [SM_DRENA],
    modelo: [REPRESENTATIVO],
    vias: { drena: ['Central_superior_mesenteric_nodes'] },
  },

  // ── Mesentéricos inferiores ────────────────────────────────────────────────────────────────────────────────────────
  Left_colic_nodes: {
    tipo: 'nodo', ta2: 5314,
    descripcion: [
      ['Pequeños nodos (ganglios) mesentéricos inferiores situados en las ramas de la arteria cólica izquierda.', IM('(a) small glands on the branches of the left colic and sigmoid arteries'), TA(5312), TA(5314)],
      ['Los nodos mesentéricos inferiores están a lo largo de todo el intestino posterior.', IM('The inferior mesenteric lymph nodes are lymph nodes present throughout the hindgut.')],
    ],
    localizacion: [
      ['Están en las ramas de la arteria cólica izquierda.', IM('small glands on the branches of the left colic and sigmoid arteries')],
    ],
    reparo: [
      ['La arteria cólica izquierda, rama de la mesentérica inferior para el colon descendente y la parte izquierda del transverso, que va a la izquierda por detrás del peritoneo y se divide en una rama ascendente y otra descendente.', W('Left_colic_artery', 'The left colic artery is a branch of the inferior mesenteric artery distributed to the descending colon, and left part of the transverse colon.'), W('Left_colic_artery', 'The left colic artery passes to the left posterior to the peritoneum.'), W('Left_colic_artery', 'it divides into an ascending branch and a descending branch')],
    ],
    recibe: [IM_RECIBE, COLON_IZDO],
    drena: [IM_DRENA],
    modelo: [
      REPRESENTATIVO,
      IM_SIN_CENTRALES,
      ['En este modelo un colector esquemático los lleva a los nodos preaórticos.', MODELO],
    ],
    notas: [IM_CLINICA],
    vias: { drena: ['Central_superior_mesenteric_nodes', 'Pre_aortic_nodes'] },
  },

  Sigmoid_nodes: {
    tipo: 'nodo', ta2: 5315,
    descripcion: [
      ['Nodos (ganglios) mesentéricos inferiores del colon sigmoide.', TA(5312), TA(5315)],
      ['La fuente describe pequeños nodos en las ramas de las arterias sigmoideas y un grupo en el mesocolon sigmoide, alrededor de la arteria hemorroidal (rectal) superior.', IM('(a) small glands on the branches of the left colic and sigmoid arteries'), IM('(b) a group in the sigmoid mesocolon, around the superior hemorrhoidal artery')],
    ],
    localizacion: [
      ['Están en las ramas de las arterias sigmoideas y en el mesocolon sigmoide.', IM('small glands on the branches of the left colic and sigmoid arteries'), IM('a group in the sigmoid mesocolon, around the superior hemorrhoidal artery')],
    ],
    reparo: [
      ['Las arterias sigmoideas, de dos a cinco ramas de la mesentérica inferior para el final del colon descendente y el colon sigmoide, que bajan oblicuas hacia la izquierda por detrás del peritoneo y por delante del psoas mayor y el uréter.', W('Sigmoid_arteries', 'The sigmoid arteries are 2–5 branches of the inferior mesenteric artery that are distributed to the distal descending colon and the sigmoid colon.'), W('Sigmoid_arteries', 'The sigmoid arteries course obliquely inferior-ward and to the left, passing posterior to the peritoneum and in anterior to the psoas major, ureter')],
    ],
    recibe: [IM_RECIBE, COLON_IZDO],
    drena: [IM_DRENA],
    modelo: [
      REPRESENTATIVO,
      IM_SIN_CENTRALES,
      ['En este modelo un colector esquemático los lleva a los nodos preaórticos.', MODELO],
    ],
    notas: [IM_CLINICA],
    vias: { drena: ['Central_superior_mesenteric_nodes', 'Pre_aortic_nodes'] },
  },
};
