// Taxonomía educativa de la biblioteca de estudio: regiones (con subregiones), sistemas, formatos de lección, temas
// (objetivos de estudio) y niveles. Es la clasificación con la que se estudia, distinta de la organización técnica de
// los modelos: systems.js agrupa las piezas en las capas del visor (Esquelético, T. Conjuntivo, Arterial…), y aquí un
// ligamento es del sistema articular, una fascia del muscular y la mama de la pared del tórax. Cada sistema dice en qué
// capas del visor están sus piezas (`visor`). Sin DOM: lo usan la app, las pruebas y scripts/biblioteca.mjs.
//
// Términos: los nombres de las regiones y los sistemas, con su número de la Terminologia Anatomica 2 (FIPAT, 2019) cuando
// lo tienen (`ta2`), y con el inglés y el latín de esa misma entrada (tabla sources/z-anatomy/TA2.csv): el buscador los
// usa para encontrar «leg» o «crus». Donde el nombre español de la TA2 no es el corriente («Carpo» para la muñeca,
// «Tarso» para el tobillo, «Seno» para la mama), se usa el corriente y se guarda el número de la entrada. Las agrupaciones
// sin entrada propia en la TA2 (órbita y ojo, oído, órganos de los sentidos, pared torácica…) no llevan número.
// `buscar`: otras formas con las que se busca (plurales, palabras de uso común), sin acentos; no son términos anatómicos.

export const REGIONES = [
  {
    id: 'cabeza', nombre: 'Cabeza', ta2: 98, en: 'Head', la: 'Caput', buscar: ['craneal'],
    sub: [
      { id: 'craneo', nombre: 'Cráneo', ta2: 406, en: 'Cranium', la: 'Cranium', buscar: ['neurocraneo', 'skull'] },
      { id: 'encefalo', nombre: 'Encéfalo y meninges', ta2: 5415, en: 'Brain', la: 'Encephalon', buscar: ['cerebro', 'meninges'] },
      { id: 'cara', nombre: 'Cara', ta2: 112, en: 'Face', la: 'Facies', buscar: ['facial', 'rostro'] },
      { id: 'orbita-ojo', nombre: 'Órbita y ojo', en: 'Orbit and eye', buscar: ['ojo', 'ojos', 'orbita', 'eye'] },
      { id: 'oido', nombre: 'Oído', en: 'Ear', buscar: ['oreja', 'ear'] },
      { id: 'cavidad-nasal', nombre: 'Nariz y cavidad nasal', en: 'Nose and nasal cavity', buscar: ['nariz', 'nasal', 'nose'] },
      { id: 'cavidad-oral', nombre: 'Boca y cavidad oral', en: 'Mouth and oral cavity', buscar: ['boca', 'oral', 'dientes', 'lengua', 'mouth'] },
    ],
  },
  {
    id: 'cuello', nombre: 'Cuello', ta2: 123, en: 'Neck', la: 'Collum', buscar: ['cervical'],
    sub: [
      { id: 'musculos-cuello', nombre: 'Músculos del cuello', en: 'Muscles of neck' },
      { id: 'visceras-cuello', nombre: 'Laringe, faringe y tiroides', en: 'Larynx, pharynx and thyroid', buscar: ['laringe', 'faringe', 'tiroides', 'garganta'] },
      { id: 'vasos-nervios-cuello', nombre: 'Vasos y nervios del cuello', en: 'Vessels and nerves of neck' },
    ],
  },
  {
    id: 'espalda', nombre: 'Espalda y columna', ta2: 135, en: 'Back', la: 'Dorsum', buscar: ['dorso', 'espalda', 'columna'],
    sub: [
      { id: 'columna', nombre: 'Columna vertebral', ta2: 1001, en: 'Vertebral column', la: 'Columna vertebralis', buscar: ['vertebras', 'raquis', 'espina dorsal'] },
      { id: 'musculos-espalda', nombre: 'Músculos de la espalda', en: 'Muscles of back' },
      { id: 'medula', nombre: 'Médula espinal', ta2: 6049, en: 'Spinal cord', la: 'Medulla spinalis', buscar: ['medula'] },
    ],
  },
  {
    id: 'torax', nombre: 'Tórax', ta2: 125, en: 'Thorax', la: 'Thorax', buscar: ['pecho', 'toracico', 'chest'],
    sub: [
      { id: 'pared-toracica', nombre: 'Pared torácica', en: 'Thoracic wall', buscar: ['costillas', 'caja toracica', 'esternon'] },
      { id: 'mama', nombre: 'Mama', ta2: 7097, en: 'Breast', la: 'Mamma', buscar: ['seno', 'pecho', 'mamaria'] },
      { id: 'diafragma', nombre: 'Diafragma', ta2: 2327, en: 'Diaphragm', la: 'Diaphragma' },
      { id: 'mediastino', nombre: 'Mediastino', ta2: 3333, en: 'Mediastinum', la: 'Mediastinum' },
      { id: 'corazon', nombre: 'Corazón', ta2: 3932, en: 'Heart', la: 'Cor', buscar: ['cardiaco'] },
      { id: 'pulmones-pleura', nombre: 'Pulmones y pleura', ta2: 3265, en: 'Lungs', la: 'Pulmones', buscar: ['pulmon', 'pleura', 'bronquios'] },
    ],
  },
  {
    id: 'abdomen', nombre: 'Abdomen', ta2: 127, en: 'Abdomen', la: 'Abdomen', buscar: ['abdominal', 'vientre', 'barriga', 'panza'],
    sub: [
      { id: 'pared-abdominal', nombre: 'Pared abdominal', en: 'Abdominal wall', buscar: ['abdominales'] },
      { id: 'peritoneo', nombre: 'Cavidad abdominal y peritoneo', en: 'Peritoneum', buscar: ['peritoneo', 'epiplon', 'omento'] },
      { id: 'organos-abdominales', nombre: 'Órganos abdominales', en: 'Abdominal organs', buscar: ['estomago', 'intestino', 'higado'] },
      { id: 'retroperitoneo', nombre: 'Riñones y retroperitoneo', en: 'Retroperitoneum', buscar: ['rinon', 'rinones', 'retroperitoneal'] },
      { id: 'vasos-nervios-abdomen', nombre: 'Vasos y nervios del abdomen', en: 'Vessels and nerves of abdomen' },
    ],
  },
  {
    id: 'pelvis', nombre: 'Pelvis y periné', ta2: 129, en: 'Pelvis', la: 'Pelvis', buscar: ['pelvico', 'perine', 'perineo'],
    sub: [
      { id: 'pelvis-osea', nombre: 'Pelvis ósea', en: 'Bony pelvis', buscar: ['hueso coxal', 'cadera osea'] },
      { id: 'suelo-pelvico', nombre: 'Suelo pélvico', en: 'Pelvic floor', buscar: ['piso pelvico', 'diafragma pelvico'] },
      { id: 'organos-pelvicos', nombre: 'Órganos pélvicos', en: 'Pelvic organs', buscar: ['vejiga', 'recto', 'utero', 'prostata'] },
      { id: 'perine', nombre: 'Periné y genitales externos', ta2: 131, en: 'Perineum', la: 'Perineum', buscar: ['perineo', 'genitales'] },
      { id: 'vasos-nervios-pelvis', nombre: 'Vasos y nervios de la pelvis', en: 'Vessels and nerves of pelvis' },
    ],
  },
  {
    id: 'miembro-superior', nombre: 'Miembro superior', ta2: 138, en: 'Upper limb', la: 'Membrum superius',
    buscar: ['extremidad superior', 'brazo entero', 'upper extremity'],
    sub: [
      { id: 'cintura-escapular', nombre: 'Cintura escapular', ta2: 361, en: 'Pectoral girdle', la: 'Cingulum pectorale', buscar: ['cingulo pectoral', 'escapula', 'clavicula'] },
      { id: 'hombro', nombre: 'Hombro', ta2: 139, en: 'Shoulder', la: 'Omos', buscar: ['hombros'] },
      { id: 'axila', nombre: 'Axila', ta2: 140, en: 'Axilla', la: 'Axilla', buscar: ['sobaco', 'axilar'] },
      { id: 'brazo', nombre: 'Brazo', ta2: 144, en: 'Arm', la: 'Brachium', buscar: ['braquial'] },
      { id: 'codo', nombre: 'Codo', ta2: 145, en: 'Elbow', la: 'Cubitus', buscar: ['fosa cubital'] },
      { id: 'antebrazo', nombre: 'Antebrazo', ta2: 146, en: 'Forearm', la: 'Antebrachium', buscar: ['antebraquial'] },
      { id: 'muneca', nombre: 'Muñeca', ta2: 147, en: 'Wrist', la: 'Carpus', buscar: ['carpo', 'carpiano'] },
      { id: 'mano', nombre: 'Mano', ta2: 148, en: 'Hand', la: 'Manus', buscar: ['manos', 'dedos'] },
    ],
  },
  {
    id: 'miembro-inferior', nombre: 'Miembro inferior', ta2: 156, en: 'Lower limb', la: 'Membrum inferius',
    buscar: ['extremidad inferior', 'pierna entera', 'lower extremity'],
    sub: [
      { id: 'cintura-pelvica', nombre: 'Cintura pélvica', ta2: 364, en: 'Pelvic girdle', la: 'Cingulum pelvicum', buscar: ['cingulo pelvico', 'coxal'] },
      { id: 'glutea', nombre: 'Región glútea', ta2: 313, en: 'Gluteal region', la: 'Regio glutea', buscar: ['gluteo', 'gluteos', 'nalga'] },
      { id: 'cadera', nombre: 'Cadera', ta2: 158, en: 'Hip', la: 'Coxa' },
      { id: 'muslo', nombre: 'Muslo', ta2: 160, en: 'Thigh', la: 'Femur', buscar: ['femoral'] },
      { id: 'rodilla', nombre: 'Rodilla', ta2: 161, en: 'Knee', la: 'Genu' },
      { id: 'pierna', nombre: 'Pierna', ta2: 163, en: 'Leg', la: 'Crus', buscar: ['crural', 'pantorrilla'] },
      { id: 'tobillo', nombre: 'Tobillo', ta2: 165, en: 'Ankle', la: 'Talus', buscar: ['tarso'] },
      { id: 'pie', nombre: 'Pie', ta2: 166, en: 'Foot', la: 'Pes', buscar: ['pies', 'planta'] },
    ],
  },
];

// `visor`: capas del visor donde están sus piezas. `modelos`: si solo existe en uno de los dos.
export const SISTEMAS = [
  { id: 'oseo', nombre: 'Sistema óseo', corto: 'Óseo', ta2: 352, en: 'Skeletal system', la: 'Systema skeletale', visor: ['skeletal'], buscar: ['huesos', 'hueso', 'esqueleto', 'esqueletico', 'osteologia', 'bones'] },
  { id: 'articular', nombre: 'Articulaciones y ligamentos', corto: 'Articular', ta2: 1515, en: 'Joints', la: 'Juncturae', visor: ['connective'], buscar: ['articulacion', 'articulaciones', 'ligamento', 'ligamentos', 'artrologia', 'joint'] },
  { id: 'muscular', nombre: 'Sistema muscular', corto: 'Muscular', ta2: 1974, en: 'Muscular system', la: 'Systema musculare', visor: ['muscular', 'connective'], buscar: ['musculo', 'musculos', 'miologia', 'muscle', 'muscles'] },
  {
    id: 'nervioso', nombre: 'Sistema nervioso', corto: 'Nervioso', ta2: 5363, en: 'Nervous system', la: 'Systema nervosum', visor: ['nervous'],
    buscar: ['nervio', 'nervios', 'neuro', 'nerve', 'nerves'],
    sub: [{ id: 'central', nombre: 'Sistema nervioso central' }, { id: 'periferico', nombre: 'Sistema nervioso periférico' }, { id: 'autonomo', nombre: 'Sistema nervioso autónomo' }],
  },
  {
    id: 'cardiovascular', nombre: 'Sistema cardiovascular', corto: 'Cardiovascular', ta2: 3891, en: 'Cardiovascular system', la: 'Systema cardiovasculare', visor: ['arterial', 'venous'],
    buscar: ['arteria', 'arterias', 'vena', 'venas', 'vaso', 'vasos', 'circulacion', 'sangre', 'vascular', 'artery', 'vein'],
    sub: [{ id: 'corazon', nombre: 'Corazón' }, { id: 'arterias', nombre: 'Arterias' }, { id: 'venas', nombre: 'Venas' }],
  },
  { id: 'linfatico', nombre: 'Sistema linfático', corto: 'Linfático', en: 'Lymphatic system', visor: ['lymphatic'], buscar: ['linfa', 'ganglios', 'nodos linfaticos', 'lymph'] },
  { id: 'respiratorio', nombre: 'Sistema respiratorio', corto: 'Respiratorio', ta2: 3133, en: 'Respiratory system', la: 'Systema respiratorium', visor: ['respiratory'], buscar: ['respiracion', 'vias aereas', 'pulmones'] },
  { id: 'digestivo', nombre: 'Sistema digestivo', corto: 'Digestivo', en: 'Digestive system', visor: ['digestive'], buscar: ['digestion', 'tubo digestivo', 'aparato digestivo', 'alimentary'] },
  { id: 'urinario', nombre: 'Sistema urinario', corto: 'Urinario', ta2: 3357, en: 'Urinary system', la: 'Systema urinarium', visor: ['urogenital'], buscar: ['orina', 'renal', 'rinones'] },
  { id: 'reproductor-masculino', nombre: 'Sistema reproductor masculino', corto: 'Reproductor masculino', en: 'Male genital system', visor: ['urogenital'], modelos: ['male'], buscar: ['genital masculino', 'aparato reproductor masculino', 'hombre'] },
  { id: 'reproductor-femenino', nombre: 'Sistema reproductor femenino', corto: 'Reproductor femenino', en: 'Female genital system', visor: ['urogenital'], modelos: ['female'], buscar: ['genital femenino', 'aparato reproductor femenino', 'mujer'] },
  { id: 'endocrino', nombre: 'Sistema endocrino', corto: 'Endocrino', ta2: 3852, en: 'Endocrine glands', la: 'Glandulae endocrinae', visor: ['endocrine'], buscar: ['glandulas', 'hormonas', 'endocrine'] },
  { id: 'tegumentario', nombre: 'Sistema tegumentario', corto: 'Tegumentario', en: 'Integumentary system', visor: ['integumentary'], buscar: ['piel', 'tegumento', 'skin'] },
  { id: 'sentidos', nombre: 'Órganos de los sentidos', corto: 'Sentidos', en: 'Sense organs', visor: ['nervous', 'integumentary'], buscar: ['sentidos', 'vista', 'oido', 'vision', 'audicion'] },
];

// Formato de una lección: qué clase de estudio propone (filtro «Tipo»).
export const FORMATOS = [
  { id: 'fundamentos', nombre: 'Fundamentos' },
  { id: 'vision-general', nombre: 'Visión general de un sistema' },
  { id: 'estructuras', nombre: 'Estructuras de una región' },
  { id: 'articulacion', nombre: 'Articulación' },
  { id: 'trayectos', nombre: 'Trayectos de vasos y nervios' },
  { id: 'topografia', nombre: 'Región y relaciones' },
  { id: 'comparacion', nombre: 'Estructuras que se confunden' },
];

// Temas: los objetivos de estudio de los recorridos (filtro «Objetivo»).
export const TEMAS = [
  { id: 'huesos', nombre: 'Huesos', buscar: ['huesos', 'oseo'] },
  { id: 'accidentes-oseos', nombre: 'Accidentes óseos', buscar: ['accidentes', 'relieves oseos', 'reparos oseos', 'landmarks'] },
  { id: 'musculos', nombre: 'Músculos', buscar: ['musculos'] },
  { id: 'movimientos', nombre: 'Movimientos', buscar: ['movimiento', 'movimientos', 'acciones', 'flexion', 'extension'] },
  { id: 'articulaciones', nombre: 'Articulaciones', buscar: ['articulaciones'] },
  { id: 'arterias-venas', nombre: 'Arterias y venas', buscar: ['arterias', 'venas', 'irrigacion', 'drenaje venoso'] },
  { id: 'nervios', nombre: 'Nervios y territorios', buscar: ['nervios', 'inervacion', 'territorios'] },
  { id: 'organos', nombre: 'Órganos y relaciones', buscar: ['organos', 'visceras', 'relaciones'] },
  { id: 'compartimentos', nombre: 'Compartimentos', buscar: ['compartimento', 'compartimentos', 'logias'] },
  { id: 'confusiones', nombre: 'Estructuras que se confunden', buscar: ['confusiones', 'diferencias', 'confundir', 'comparar'] },
];

export const NIVELES = [
  { id: 1, nombre: 'Básico' },
  { id: 2, nombre: 'Intermedio' },
  { id: 3, nombre: 'Avanzado' },
];

// Duración, para el filtro: hasta 10 min, de 10 a 20 y más de 20.
export const DURACIONES = [
  { id: 'corta', nombre: 'Hasta 10 min', max: 10 },
  { id: 'media', nombre: '10–20 min', min: 11, max: 20 },
  { id: 'larga', nombre: 'Más de 20 min', min: 21 },
];

export const REGION_POR_ID = new Map(REGIONES.map((r) => [r.id, r]));
export const SUBREGION_POR_ID = new Map(REGIONES.flatMap((r) => r.sub.map((s) => [s.id, { ...s, region: r.id }])));
export const SISTEMA_POR_ID = new Map(SISTEMAS.map((s) => [s.id, s]));
export const FORMATO_POR_ID = new Map(FORMATOS.map((f) => [f.id, f]));
export const TEMA_POR_ID = new Map(TEMAS.map((t) => [t.id, t]));
export const NIVEL_POR_ID = new Map(NIVELES.map((n) => [n.id, n]));

/** Nombre de un lugar [región, subregión?]: «Miembro superior › Brazo». */
export function nombreLugar([region, sub]) {
  const r = REGION_POR_ID.get(region);
  const s = sub && SUBREGION_POR_ID.get(sub);
  return [r?.nombre ?? region, s?.nombre].filter(Boolean).join(' › ');
}

/** Errores de la propia taxonomía (identificadores repetidos o subregiones en dos regiones). */
export function revisarTaxonomia() {
  const out = [];
  const ids = [...REGIONES.map((r) => r.id), ...REGIONES.flatMap((r) => r.sub.map((s) => s.id))];
  const repes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (repes.length) out.push(`identificadores de región repetidos: ${repes.join(', ')}`);
  for (const lista of [SISTEMAS, FORMATOS, TEMAS]) {
    const x = lista.map((e) => e.id);
    const r = x.filter((id, i) => x.indexOf(id) !== i);
    if (r.length) out.push(`identificadores repetidos: ${r.join(', ')}`);
  }
  return out;
}
