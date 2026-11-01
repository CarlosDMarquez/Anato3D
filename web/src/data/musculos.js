import { GRUPOS } from './grupos.js';
import { LATIN } from './latin.js';
import { MUSCULOS } from './musculos-fichas.js';
import { MUSCULOS_RESTO } from './musculos-fichas-resto.js';
import { LATIN_SEXO, fuentesMusculo } from './fuentes.js';

const FICHAS = { ...MUSCULOS, ...MUSCULOS_RESTO };

// Ficha de un músculo o tendón a partir de los datos que trae el modelo (nombre en español y latín de
// la traducción de Z-Anatomy, acción, inervación, región y capa) más la ficha escrita a mano. Todos los músculos tienen
// ficha propia (musculos-fichas.js y musculos-fichas-resto.js); la acción y la inervación de la ficha, contrastadas con
// las fuentes, tienen prioridad sobre las del modelo.

const LAYER = { 1: 'Capa superficial', 2: 'Capa intermedia', 3: 'Capa profunda' };
const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const parse = (s) => {
  try { return JSON.parse(s || '[]'); } catch { return []; }
};

// Etimología generada palabra por palabra a partir del término latino.
export function latinEtymology(latin) {
  if (!latin) return null;
  const words = latin.replace(/[()[\],]/g, ' ').split(/\s+/).filter(Boolean);
  const parts = [];
  const seen = new Set();
  for (const w of words) {
    const key = w.toLowerCase();
    const meaning = LATIN[key];
    if (!meaning || seen.has(key)) continue;
    seen.add(key);
    parts.push(`${w.toLowerCase()}, «${meaning}»`);
  }
  if (!parts.length) return null;
  return `Del latín ${parts.join('; ')}.`;
}

export function resolveMuscle(name, x) {
  const side = /_L$/.test(name) ? 'L' : /_R$/.test(name) ? 'R' : null;
  const region = parse(x.region);
  const nerves = parse(x.innervation_es);
  // Ficha escrita: primero la del propio músculo, después la del músculo o grupo que lo contiene.
  const key = String(x.name_en ?? '').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '');
  // Músculos del periné: cada sexo tiene su ficha («Bulbospongiosus_muscle@male»); sin ella, la general.
  const cardKey = [x.sex && `${key}@${x.sex}`, key, ...[...region].reverse()].find((k) => k && FICHAS[k]) ?? null;
  const entry = cardKey ? FICHAS[cardKey] : null;
  const latin = LATIN_SEXO[key]?.[x.sex]?.[0] ?? x.name_la ?? null;
  const group = [...region].reverse().map((g) => GRUPOS[g]).find(Boolean);
  const fields = [
    group && { label: 'Región', value: group.nombre },
    (entry?.accion ?? x.function_es) && { label: 'Acción', value: entry?.accion ?? x.function_es },
    (entry?.inervacion ?? nerves.length) && { label: 'Inervación', value: entry?.inervacion ?? nerves.join(', ') },
    entry?.origen && { label: 'Origen', value: entry.origen },
    entry?.insercion && { label: 'Inserción', value: entry.insercion },
  ].filter(Boolean);
  // Láminas, nudos y poleas fibrosos que el modelo cuenta como músculo o tendón.
  const fibrous = /^(Perineal (membrane|body)|Trochlea of superior oblique muscle|Tendinous arch of levator ani)$/.test(x.name_en ?? '');
  const chips = [fibrous ? 'Tejido fibroso' : x.tissue === 'tendon' ? 'Tendón' : 'Músculo esquelético', LAYER[x.layer], side && (side === 'L' ? 'Lado izquierdo' : 'Lado derecho')].filter(Boolean);
  return {
    key: x.name_en,
    side,
    title: cap(x.name_es || x.name_en),
    latin: latin || null,
    tissue: null,
    chips,
    fields,
    entry: {
      descripcion: entry?.descripcion ?? null,
      etimologia: entry?.etimologia ?? latinEtymology(latin),
    },
    datos: entry?.datos ?? [],
    source: x.source ?? null,
    fuentes: fuentesMusculo(cardKey?.replace(/@.*/, ''), key, x.sex),
  };
}
