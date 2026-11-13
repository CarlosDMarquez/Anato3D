// Sistemas anatómicos y sus etapas (capas), al estilo de la barra inferior de Complete Anatomy.
// Cada parte del modelo se asigna a un sistema con classify(); cada etapa decide qué partes
// de ese sistema se muestran. Las etapas sin partes en el modelo actual aparecen como "Próximamente".
//
// Contrato de datos para nuevas fases (custom properties en Blender → extras en glTF):
//   system: 'skeletal' | 'connective' | 'muscular' | 'arterial' | 'venous' | 'lymphatic' | 'nervous'
//           | 'respiratory' | 'digestive' | 'endocrine' | 'urogenital' | 'integumentary' | 'special_senses'
//   tissue: 'bone' | 'tooth' | 'cartilage' | 'ligament' | 'capsule' | 'fascia' | 'bursa' | 'sheath' | 'fat'
//           | 'muscle' | 'tendon' | 'vessel' | 'nerve' | 'organ' ...
//   layer:  1 = superficial, 2 = intermedia, 3 = profunda (músculos; se calcula por oclusión al construir)
//   major:  true para vasos/nervios principales
//   subsystem: 'cns' | 'pns' | 'urinary' | 'reproductive' | 'gi_tract' | 'accessory' | 'organs' | 'nodes'
//           | 'pituitary' | 'thyroid' | 'adrenal' | 'pineal' ...

const inGroup = (name) => (p) => p.groups.includes(name);
const all = () => true;
// El hígado entero y sus 8 segmentos de Couinaud ocupan el mismo sitio: nunca se muestran a la vez.
const liverSegment = (p) => /segment_of_liver/.test(p.id);

export const SYSTEMS = [
  {
    id: 'skeletal', label: 'Esquelético', color: '#e6dcc6',
    stages: [
      { id: 'all', label: 'Completo', filter: all },
      { id: 'axial', label: 'Axial', filter: inGroup('Axial_Skeleton') },
      { id: 'appendicular', label: 'Apendicular', filter: inGroup('Appendicular_Skeleton') },
      { id: 'skull', label: 'Cráneo', filter: inGroup('Skull') },
    ],
  },
  {
    id: 'connective', label: 'T. Conjuntivo', noun: 'tejido conjuntivo', color: '#b9c4cf',
    stages: [
      { id: 'cartilage', label: 'Cartílagos', filter: (p) => p.tissue === 'cartilage' },
      { id: 'joints', label: 'Articulaciones', filter: (p) => ['cartilage', 'ligament', 'capsule', 'fat'].includes(p.tissue) },
      { id: 'fascia', label: 'Fascias', filter: (p) => p.tissue === 'fascia' },
      { id: 'bursae', label: 'Bursas y vainas', filter: (p) => p.tissue === 'bursa' || p.tissue === 'sheath' },
      { id: 'all', label: 'Completo', filter: all },
    ],
  },
  {
    // Las capas se «pelan» como en los atlas: se ve todo y luego se retiran las más superficiales.
    id: 'muscular', label: 'Muscular', color: '#c8463d',
    stages: [
      { id: 'superficial', label: 'Superficial', filter: all },
      { id: 'intermediate', label: 'Intermedio', filter: (p) => p.layer >= 2 },
      { id: 'deep', label: 'Profundo', filter: (p) => p.layer >= 3 },
    ],
    // Como en los atlas, los músculos se ven sobre el esqueleto, con ligamentos, retináculos y aponeurosis, los ojos,
    // los cartílagos de la nariz y la laringe y los genitales externos. Si su sistema está apagado, se muestran como
    // contexto (y respetan la opción «Mostrar genitales externos»).
    context: {
      skeletal: (p) => p.tissue !== 'tooth',
      connective: (p) => p.tissue === 'ligament',
      integumentary: (p) => p.subsystem === 'eyes',
      respiratory: (p) => p.tissue === 'cartilage',
      urogenital: (p) => /penis|Glans|Testis|Epididymis/.test(p.id),
    },
  },
  {
    id: 'arterial', label: 'Arterial', color: '#d23a3a',
    stages: [
      { id: 'heart', label: 'Corazón', filter: (p) => p.subsystem === 'heart' },
      { id: 'major', label: 'Principales', filter: (p) => p.major },
      { id: 'all', label: 'Completo', filter: all },
    ],
  },
  {
    id: 'venous', label: 'Venoso', color: '#3d6fd1',
    stages: [
      { id: 'major', label: 'Principales', filter: (p) => p.major },
      { id: 'all', label: 'Completo', filter: all },
    ],
  },
  {
    // «Completo» primero: es la capa que sale al pulsar el botón (antes salían solo los órganos y los nodos, que son casi
    // todo el sistema, quedaban en la segunda). Los ids 'all', 'nodes' y 'organs' los usan las lecciones.
    // 'vessels' son los vasos linfáticos (tissue 'lymph_vessel'); los conductos y troncos llevan major.
    id: 'lymphatic', label: 'Linfático', color: '#8fbf5a',
    stages: [
      { id: 'all', label: 'Completo', filter: all },
      { id: 'nodes', label: 'Nodos y vasos', filter: (p) => p.subsystem === 'nodes' || p.subsystem === 'vessels' },
      { id: 'ducts', label: 'Conductos y troncos', filter: (p) => p.subsystem === 'vessels' && p.major },
      { id: 'organs', label: 'Órganos', filter: (p) => p.subsystem === 'organs' },
    ],
    // Sin contexto de otros sistemas: Carlos no quiere que al encender el linfático aparezcan las venas (12 nov 2026).
    // Quien quiera ver la yugular o el ángulo venoso enciende el sistema venoso (las lecciones lo hacen con sus capas).
  },
  {
    id: 'nervous', label: 'Nervioso', color: '#e8c547',
    stages: [
      { id: 'cns', label: 'Central', filter: (p) => p.subsystem === 'cns' },
      { id: 'deep', label: 'Encéfalo profundo', filter: (p) => p.subsystem === 'cns' && p.layer >= 2 },
      { id: 'pns', label: 'Periférico', filter: (p) => p.subsystem === 'pns' },
      { id: 'senses', label: 'Sentidos', filter: (p) => p.subsystem === 'special_senses' },
      { id: 'all', label: 'Completo', filter: all },
    ],
  },
  {
    id: 'respiratory', label: 'Respiratorio', color: '#e59ab0',
    stages: [
      { id: 'airways', label: 'Vías aéreas', filter: (p) => p.subsystem === 'airways' },
      { id: 'lungs', label: 'Pulmones', filter: (p) => p.subsystem === 'lungs' || (p.subsystem === 'airways' && p.major) },
      { id: 'all', label: 'Completo', filter: all },
    ],
  },
  {
    id: 'digestive', label: 'Digestivo', color: '#d98a4e',
    stages: [
      { id: 'tract', label: 'Tubo digestivo', filter: (p) => p.subsystem === 'gi_tract' },
      { id: 'glands', label: 'Glándulas anexas', filter: (p) => p.subsystem === 'accessory' && !liverSegment(p) },
      { id: 'segments', label: 'Segmentos hepáticos', filter: (p) => liverSegment(p) || p.tissue === 'gallbladder' },
      { id: 'organs', label: 'Órganos', filter: (p) => (p.subsystem === 'gi_tract' || p.subsystem === 'accessory') && !liverSegment(p) },
      { id: 'all', label: 'Completo', filter: (p) => !liverSegment(p) },
    ],
  },
  {
    id: 'endocrine', label: 'Endocrino', color: '#b07fd6',
    stages: [{ id: 'all', label: 'Glándulas', filter: all }],
  },
  {
    id: 'urogenital', label: 'Urogenital', color: '#d4a63b',
    stages: [
      { id: 'urinary', label: 'Urinario', filter: (p) => p.subsystem === 'urinary' },
      { id: 'reproductive', label: 'Reproductor', filter: (p) => p.subsystem === 'reproductive' },
      { id: 'all', label: 'Completo', filter: all },
    ],
  },
  {
    id: 'integumentary', label: 'Tegumentario', color: '#d9a58a',
    stages: [
      { id: 'skin', label: 'Piel', filter: all },
      { id: 'translucent', label: 'Translúcido', filter: all, ghost: true },
    ],
  },
];

export const SYSTEM_BY_ID = Object.fromEntries(SYSTEMS.map((s) => [s.id, s]));

// Asigna una parte a un sistema de la barra. Los ojos de MakeHuman forman parte del aspecto exterior y van
// con la piel; los órganos de los sentidos anatómicos (ojo y oído de Z-Anatomy) van con el nervioso.
export function classify(extras) {
  const sys = extras.system;
  if (sys === 'skeletal' && extras.tissue === 'cartilage') return { system: 'connective' };
  if (sys === 'special_senses') return { system: 'integumentary', subsystem: 'eyes' };
  if (sys && SYSTEM_BY_ID[sys]) return { system: sys };
  return null;
}

// Estado inicial: esqueleto y cartílagos visibles, como en la pantalla de inicio de Complete Anatomy.
export const DEFAULT_STAGES = {
  skeletal: 'all',
  connective: 'cartilage',
};
