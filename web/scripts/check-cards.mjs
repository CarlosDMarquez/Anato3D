// Revisa las fichas de todas las piezas de los modelos de la web, como las construye la app (resolvePart).
// Uso (desde web/): node scripts/check-cards.mjs
// Cuenta, por modelo: piezas sin nombre en español o con guiones bajos, sin latín, músculos sin ficha propia (descripción),
// sin inervación o sin fuentes, y textos raros («undefined», dobles espacios…). Termina con código 1 si algo falla.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { resolvePart } from '../src/data/resolve.js';
import { classify } from '../src/systems.js';

const MODELS = path.join(path.dirname(fileURLToPath(import.meta.url)), '../public/models');

// Nodos (nombre y datos) de un .glb: el JSON va en el primer bloque, tras la cabecera de 12 bytes.
function nodes(file) {
  const b = fs.readFileSync(path.join(MODELS, file));
  const json = JSON.parse(b.subarray(20, 20 + b.readUInt32LE(12)).toString('utf8'));
  return json.nodes ?? [];
}

const RARO = /\s{2,}|\bdel el\b|\bde el\b|\ba el\b| ,|\(\s|\s\)|undefined|null|NaN/;
let fallos = 0;
for (const model of ['male', 'female']) {
  const files = fs.readdirSync(MODELS).filter((f) => f.endsWith('.glb') && (f === `${model}.glb` || f.startsWith(`${model}-`)));
  const c = { piezas: 0, musculos: 0 };
  const malos = { titulo: [], latin: [], ficha: [], inervacion: [], fuentes: [], raro: [] };
  for (const file of files) {
    for (const n of nodes(file)) {
      const x = n.extras ?? {};
      if (!x.system || !classify(x)) continue;
      const name = (n.name ?? '').replace(/\s/g, '_').replace(/[[\].:/]/g, '');
      const info = resolvePart(name, x);
      c.piezas++;
      if (!info.title || /_/.test(info.title)) malos.titulo.push(name);
      if (!info.latin) malos.latin.push(name);
      if (RARO.test(`${info.title} ${info.latin ?? ''} ${info.entry?.descripcion ?? ''}`)) malos.raro.push(name);
      if (x.system !== 'muscular') continue;
      c.musculos++;
      if (!info.entry?.descripcion) malos.ficha.push(name);
      if (!info.fields.some((f) => f.label === 'Inervación')) malos.inervacion.push(name);
      if (!info.fuentes) malos.fuentes.push(name);
    }
  }
  console.log(`${model}: ${c.piezas} piezas (${c.musculos} musculares)`);
  for (const [k, v] of Object.entries(malos)) {
    if (!v.length) continue;
    fallos += v.length;
    console.log(`  ${k}: ${v.length} — ${[...new Set(v.map((s) => s.replace(/_[LR]$/, '')))].slice(0, 12).join(', ')}`);
  }
}
console.log(fallos ? `${fallos} problemas` : 'todo correcto');
process.exit(fallos ? 1 : 0);
