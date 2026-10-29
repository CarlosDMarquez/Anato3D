import { ANATOMIA } from './anatomia.js';
import { resolveMuscle } from './musculos.js';
import { resolveConnective } from './conectivo.js';
import { resolveVessel } from './vasos.js';
import { resolveNervous } from './nervios.js';
import { resolveVisceral } from './visceras.js';

// Convierte el nombre de un objeto del modelo (p. ej. "Rib_7_L", "Tooth_Upper_Canine_R")
// en la ficha que muestra la app: título, latín, etiquetas y datos adicionales.

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const ORDINAL_F = ['', 'Primera', 'Segunda', 'Tercera', 'Cuarta', 'Quinta', 'Sexta', 'Séptima', 'Octava', 'Novena', 'Décima', 'Undécima', 'Duodécima'];
const FINGERS = ['', 'pulgar', 'índice', 'dedo medio', 'anular', 'meñique'];
const TOES = ['', 'dedo gordo (hallux)', 'segundo dedo', 'tercer dedo', 'cuarto dedo', 'quinto dedo'];
const TOOTH_FDI = { Medial_Incisor: 1, Lateral_Incisor: 2, Canine: 3, First_Premolar: 4, Second_Premolar: 5, First_Molar: 6, Second_Molar: 7 };
const TISSUE = { bone: 'Hueso', tooth: 'Diente', cartilage: 'Cartílago' };

function splitSide(name) {
  const m = name.match(/^(.*)_(L|R)$/);
  if (m) return { base: m[1], side: m[2] };
  const e = name.match(/^(Left|Right)_(.*)$/);
  if (e) return { base: e[2], side: e[1] === 'Left' ? 'L' : 'R' };
  return { base: name, side: null };
}

function ribClass(n) {
  if (n <= 7) return { chip: 'Costilla verdadera', dato: 'Costilla verdadera: su cartílago llega directamente al esternón.' };
  if (n <= 10) return { chip: 'Costilla falsa', dato: 'Costilla falsa: su cartílago se une al de la costilla superior, no directamente al esternón.' };
  return { chip: 'Costilla flotante', dato: 'Costilla flotante: su extremo anterior termina libre entre los músculos de la pared abdominal.' };
}

export const sideOf = (name) => splitSide(name).side;

export function resolvePart(name, extras = {}) {
  if (extras.system === 'muscular') return resolveMuscle(name, extras);
  if (extras.system === 'connective') return resolveConnective(name, extras);
  if (extras.system === 'arterial' || extras.system === 'venous') return resolveVessel(name, extras);
  if (extras.system === 'nervous') return resolveNervous(name, extras);
  if (['respiratory', 'digestive', 'urogenital', 'endocrine', 'lymphatic'].includes(extras.system)) return resolveVisceral(name, extras);
  const { base, side } = splitSide(name);
  let key = base;
  let title = null;
  let latin = null;
  const chips = [];
  const extra = [];
  let m;

  if ((m = base.match(/^Rib_(\d+)$/))) {
    const n = +m[1];
    key = 'Rib';
    title = `${ORDINAL_F[n]} costilla`;
    latin = `Costa ${ROMAN[n]}`;
    const c = ribClass(n);
    chips.push(c.chip);
    extra.push(c.dato);
    if (n === 1) extra.push('Es la más corta, ancha y curva; sobre ella pasan la arteria y la vena subclavias.');
  } else if ((m = base.match(/^Costal_Cartilage_(\d+)$/))) {
    const n = +m[1];
    key = 'Costal_Cartilage';
    title = `Cartílago costal de la ${ORDINAL_F[n].toLowerCase()} costilla`;
    latin = `Cartilago costalis ${ROMAN[n]}`;
    chips.push(ribClass(n).chip);
  } else if (base === 'Vertebra_C1_Atlas') {
    key = 'Atlas';
  } else if (base === 'Vertebra_C2_Axis') {
    key = 'Axis';
  } else if ((m = base.match(/^Vertebra_([CTL])(\d+)$/))) {
    const region = { C: 'Cervical_Vertebra', T: 'Thoracic_Vertebra', L: 'Lumbar_Vertebra' }[m[1]];
    const label = { C: 'cervical', T: 'torácica', L: 'lumbar' }[m[1]];
    key = region;
    title = `Vértebra ${m[1]}${m[2]} (${label})`;
    latin = `${ANATOMIA[region].latin} ${m[1]}${ROMAN[+m[2]]}`;
    if (base === 'Vertebra_C7') extra.push('C7 se llama vértebra prominente: su apófisis espinosa es la que se palpa con facilidad en la base del cuello.');
    if (base === 'Vertebra_T12') extra.push('T12 es la vértebra de transición entre la columna torácica y la lumbar.');
    if (base === 'Vertebra_L5') extra.push('L5 se articula con el sacro; entre ambos está el promontorio, una referencia de la pelvis.');
  } else if ((m = base.match(/^Tooth_(Upper|Lower)_(.+)$/))) {
    key = m[2];
    const upper = m[1] === 'Upper';
    title = `${ANATOMIA[key]?.nombre ?? key} ${upper ? 'superior' : 'inferior'}`;
    // FDI: 1 = superior derecho, 2 = superior izquierdo, 3 = inferior izquierdo, 4 = inferior derecho.
    const quadrant = upper ? (side === 'R' ? 1 : 2) : (side === 'L' ? 3 : 4);
    if (TOOTH_FDI[key]) chips.push(`FDI ${quadrant}${TOOTH_FDI[key]}`);
  } else if ((m = base.match(/^Metacarpal_(\d)$/))) {
    const n = +m[1];
    key = 'Metacarpal';
    title = `Metacarpiano ${ROMAN[n]} (${FINGERS[n]})`;
    latin = `Os metacarpi ${ROMAN[n]}`;
  } else if ((m = base.match(/^Metatarsal_(\d)$/))) {
    const n = +m[1];
    key = 'Metatarsal';
    title = `Metatarsiano ${ROMAN[n]} (${TOES[n]})`;
    latin = `Os metatarsi ${ROMAN[n]}`;
  } else if ((m = base.match(/^(Proximal|Middle|Distal)_Phalanx_(Hand|Foot)_(\d)$/))) {
    const n = +m[3];
    key = `${m[1]}_Phalanx`;
    const hand = m[2] === 'Hand';
    title = `${ANATOMIA[key].nombre} del ${hand ? FINGERS[n] : TOES[n]}`;
    latin = `${ANATOMIA[key].latin} ${hand ? 'manus' : 'pedis'} ${ROMAN[n]}`;
    chips.push(hand ? 'Mano' : 'Pie');
  } else if (base === 'Eyeball') {
    key = 'Eyeball';
  }

  const entry = ANATOMIA[key] ?? null;
  if (entry?.tipo) chips.unshift(entry.tipo);
  if (side) chips.push(side === 'L' ? 'Lado izquierdo' : 'Lado derecho');

  return {
    key,
    side,
    title: title ?? entry?.nombre ?? extras.name_en ?? name.replace(/_/g, ' '),
    latin: latin ?? entry?.latin ?? extras.name_la ?? null,
    tissue: TISSUE[extras.tissue] ?? null,
    chips,
    entry,
    datos: [...extra, ...(entry?.datos ?? [])],
    source: extras.source ?? null,
  };
}
