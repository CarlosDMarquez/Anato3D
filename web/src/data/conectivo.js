import { GRUPOS } from './grupos.js';
import { latinEtymology } from './musculos.js';

// Fichas del tejido conjuntivo: ligamentos, cápsulas, discos y meniscos, fascias, bursas y vainas.
// Cada tejido tiene una descripción general; las estructuras más importantes tienen ficha propia.

const TEJIDO = {
  ligament: {
    tipo: 'Ligamento',
    descripcion: 'Banda de tejido conectivo fibroso denso que une hueso con hueso. Estabiliza la articulación y limita los movimientos excesivos.',
    datos: ['Los ligamentos tienen poca irrigación, por eso cicatrizan lentamente tras un esguince.'],
  },
  capsule: {
    tipo: 'Cápsula articular',
    descripcion: 'Manguito fibroso que envuelve una articulación sinovial. Su capa interna, la membrana sinovial, produce el líquido que lubrica y nutre el cartílago.',
    datos: [],
  },
  cartilage: {
    tipo: 'Fibrocartílago',
    descripcion: 'Pieza de cartílago situada entre dos superficies óseas que mejora su encaje y amortigua las cargas.',
    datos: ['El cartílago no tiene vasos sanguíneos: se nutre por difusión, lo que dificulta su reparación.'],
  },
  fascia: {
    tipo: 'Fascia',
    descripcion: 'Lámina de tejido conectivo que envuelve los músculos y los agrupa en compartimentos. Transmite fuerzas y permite que los músculos se deslicen entre sí.',
    datos: ['El aumento de presión dentro de un compartimento fascial puede dañar músculos y nervios (síndrome compartimental).'],
  },
  bursa: {
    tipo: 'Bolsa sinovial (bursa)',
    descripcion: 'Pequeña bolsa con líquido sinovial situada donde un tendón o un músculo roza contra un hueso o la piel. Reduce la fricción.',
    datos: ['Su inflamación se llama bursitis.'],
  },
  sheath: {
    tipo: 'Vaina tendinosa',
    descripcion: 'Vaina sinovial que envuelve un tendón donde pasa por zonas de roce (muñeca, tobillo, dedos), para que se deslice sin fricción.',
    datos: ['Su inflamación se llama tenosinovitis.'],
  },
  fat: {
    tipo: 'Almohadilla adiposa',
    descripcion: 'Acúmulo de grasa que rellena espacios dentro de la articulación y amortigua sus movimientos.',
    datos: [],
  },
};

// Fichas propias (clave: nombre inglés de Z-Anatomy con «_»).
const DISCO = {
  descripcion: 'Disco de fibrocartílago entre dos cuerpos vertebrales. Tiene un anillo fibroso externo y un núcleo pulposo gelatinoso en el centro, que reparte y amortigua las cargas.',
  datos: ['Si el núcleo pulposo sale a través del anillo se produce una hernia de disco, más frecuente entre L4–L5 y L5–S1.', 'Con la edad pierden agua y altura: por eso la estatura disminuye ligeramente.'],
};
const NUCLEO = {
  descripcion: 'Centro gelatinoso del disco intervertebral, con mucha agua, rodeado por el anillo fibroso. Reparte la presión entre las vértebras como un cojín de agua.',
  datos: ['Es lo que sale en una hernia de disco al romperse el anillo fibroso.', 'Es el resto de la notocorda del embrión.'],
};
export const CONECTIVO = {
  Anterior_cruciate_ligament: {
    descripcion: 'Ligamento intraarticular de la rodilla que va de la tibia (delante) al cóndilo lateral del fémur (detrás). Impide que la tibia se desplace hacia delante.',
    datos: ['Se rompe con frecuencia en giros bruscos con el pie apoyado (fútbol, esquí).', 'Se explora con la prueba del cajón anterior y la de Lachman.'],
  },
  Posterior_cruciate_ligament: {
    descripcion: 'Ligamento intraarticular de la rodilla, más grueso que el cruzado anterior. Impide que la tibia se desplace hacia atrás.',
    datos: ['Suele lesionarse por un golpe en la tibia con la rodilla flexionada, por ejemplo contra el salpicadero.'],
  },
  Tibial_collateral_ligament: {
    descripcion: 'Ligamento colateral medial de la rodilla. Va del epicóndilo medial del fémur a la tibia y frena la apertura de la rodilla hacia dentro.',
    datos: ['Está unido al menisco medial; por eso suelen lesionarse juntos.'],
  },
  Fibular_collateral_ligament: {
    descripcion: 'Ligamento colateral lateral de la rodilla. Cordón redondeado que va del epicóndilo lateral del fémur a la cabeza de la fíbula.',
    datos: ['A diferencia del colateral medial, no está unido al menisco.'],
  },
  Medial_meniscus: {
    descripcion: 'Fibrocartílago en forma de C abierta sobre la meseta medial de la tibia. Mejora el encaje con el fémur y amortigua la rodilla.',
    datos: ['Es menos móvil que el lateral y se rompe con más frecuencia.'],
  },
  Lateral_meniscus: {
    descripcion: 'Fibrocartílago casi circular sobre la meseta lateral de la tibia. Mejora el encaje con el fémur y amortigua la rodilla.',
    datos: ['Es más móvil que el medial y se lesiona menos.'],
  },
  Patellar_ligament: {
    descripcion: 'Continuación del tendón del cuádriceps desde la rótula hasta la tuberosidad de la tibia.',
    datos: ['Al golpearlo con el martillo se provoca el reflejo rotuliano (L3–L4).'],
  },
  Inguinal_ligament: {
    descripcion: 'Borde inferior engrosado de la aponeurosis del oblicuo externo, tendido entre la espina ilíaca anterosuperior y el tubérculo del pubis.',
    datos: ['Por debajo pasan los vasos y el nervio femorales; por encima está el conducto inguinal, sitio de las hernias inguinales.'],
  },
  Linea_alba: {
    descripcion: 'Rafe fibroso en la línea media del abdomen, desde la apófisis xifoides hasta el pubis, formado por las aponeurosis de los músculos anchos del abdomen.',
    datos: ['Tiene pocos vasos: se usa para abrir el abdomen en cirugía.', 'El ombligo está en ella.'],
  },
  Flexor_retinaculum_of_wrist: {
    descripcion: 'Banda fibrosa transversal en la cara anterior de la muñeca que forma el techo del túnel carpiano.',
    datos: ['La compresión del nervio mediano bajo él produce el síndrome del túnel carpiano.'],
  },
  Anterior_talofibular_ligament: {
    descripcion: 'Ligamento lateral del tobillo que une la fíbula con el talus por delante.',
    datos: ['Es el ligamento que más se lesiona en los esguinces de tobillo por inversión.'],
  },
  Iliofemoral_ligament: {
    descripcion: 'Ligamento en forma de Y invertida en la cara anterior de la cadera. Es uno de los ligamentos más fuertes del cuerpo.',
    datos: ['Impide la hiperextensión de la cadera y permite mantenerse de pie con poco esfuerzo muscular.'],
  },
  Nuchal_ligament: {
    descripcion: 'Lámina fibrosa en la línea media de la nuca, desde la protuberancia occipital hasta la apófisis espinosa de C7.',
    datos: ['Sirve de inserción a músculos del cuello como el trapecio.'],
  },
  Anterior_longitudinal_ligament: {
    descripcion: 'Banda ancha que recorre la cara anterior de los cuerpos vertebrales desde el occipital hasta el sacro.',
    datos: ['Limita la extensión de la columna.'],
  },
  Posterior_longitudinal_ligament: {
    descripcion: 'Banda que recorre la cara posterior de los cuerpos vertebrales, dentro del conducto vertebral.',
    datos: ['Limita la flexión; es más estrecho en la región lumbar, por eso las hernias suelen ser posterolaterales.'],
  },
  Plantar_aponeurosis: {
    descripcion: 'Lámina fibrosa gruesa de la planta del pie, del calcáneo a los dedos. Sostiene el arco longitudinal.',
    datos: ['Su inflamación (fascitis plantar) es una causa muy frecuente de dolor de talón.'],
  },
};
for (const k of ['C2_C3', 'C3_C4', 'C4_C5', 'C5_C6', 'C6_C7', 'C7_T1', 'L1_L2', 'L2_L3', 'L3_L4', 'L4_L5', 'L5_S1']) CONECTIVO[`Intervertebral_disc_${k}`] = DISCO;

const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const parse = (s) => {
  try { return JSON.parse(s || '[]'); } catch { return []; }
};

export function resolveConnective(name, x) {
  const side = /_L$/.test(name) ? 'L' : /_R$/.test(name) ? 'R' : null;
  const region = parse(x.region);
  const key = String(x.name_en ?? '').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '');
  const own = CONECTIVO[key] ?? (key.startsWith('Intervertebral_disc') ? DISCO : key.startsWith('Nucleus_pulposus') ? NUCLEO : null);
  const tissue = TEJIDO[x.tissue] ?? TEJIDO.ligament;
  const group = [...region].reverse().map((g) => GRUPOS[g]).find(Boolean);
  return {
    key: x.name_en,
    side,
    title: cap(x.name_es || x.name_en),
    latin: x.name_la || null,
    tissue: null,
    chips: [tissue.tipo, side && (side === 'L' ? 'Lado izquierdo' : 'Lado derecho')].filter(Boolean),
    fields: [group && { label: 'Región', value: group.nombreEs ?? group.nombre }].filter(Boolean),
    entry: {
      descripcion: own?.descripcion ?? tissue.descripcion,
      etimologia: latinEtymology(x.name_la),
    },
    datos: [...(own?.datos ?? []), ...(own ? [] : tissue.datos)],
    source: x.source ?? null,
  };
}
