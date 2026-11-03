// Revisa las fichas de todas las piezas de los modelos de la web, como las construye la app (resolvePart).
// Uso (desde web/): node scripts/check-cards.mjs [--models <carpeta>] [--model male|female]
// Cuenta, por modelo: piezas sin nombre en español o con guiones bajos, sin latín, músculos sin ficha propia (descripción),
// sin inervación o sin fuentes, y textos raros («undefined», dobles espacios…).
// Además, el contenido de estudio (src/content): cada ficha de módulo contra su esquema y los modelos (campos
// obligatorios, textos genéricos, fuentes de terminología y de contenido para cada afirmación, piezas que existen en los
// modelos declarados y en ningún otro, estado de revisión). Informa también de cuántas piezas muestran una descripción
// genérica en cada sistema (solo informa: es el contenido que falta escribir). Termina con código 1 si algo falla.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { resolvePart } from '../src/data/resolve.js';
import { classify } from '../src/systems.js';
import { MODULOS } from '../src/content/index.js';
import { revisarFicha, revisarModulo, GENERICOS } from '../src/content/schema.js';
import { FUENTES } from '../src/content/fuentes.js';

// --models <carpeta>: revisa otra carpeta (build_all.sh revisa así el candidato antes de publicarlo).
const flag = process.argv.indexOf('--models');
const MODELS = flag > 0 ? path.resolve(process.argv[flag + 1]) : path.join(path.dirname(fileURLToPath(import.meta.url)), '../public/models');

// Nodos (nombre y datos) de un .glb: el JSON va en el primer bloque, tras la cabecera de 12 bytes.
function nodes(file) {
  const b = fs.readFileSync(path.join(MODELS, file));
  const json = JSON.parse(b.subarray(20, 20 + b.readUInt32LE(12)).toString('utf8'));
  return json.nodes ?? [];
}

const RARO = /\s{2,}|\bdel el\b|\bde el\b|\ba el\b| ,|\(\s|\s\)|undefined|null|NaN/;
// Erratas conocidas del pipeline: tilde en el primer elemento de un compuesto («músculocutáneo», «músculofrénica»; en
// español van sin ella: musculocutáneo, musculofrénica). La introdujo una regla de ES_FIXES (tools/anato3d_fit.py).
const ERRATA = /\b[Mm]úsculo(?!s?\b)[a-záéíóúñ]/;
let fallos = 0;
const nombres = {};                                   // modelo → Set de nombres de pieza (para la aplicabilidad)
// --model: solo ese modelo (build_all.sh revisa el que construye; con «base» cambian los dos y revisa ambos).
const only = process.argv.indexOf('--model');
for (const model of only > 0 ? [process.argv[only + 1]] : ['male', 'female']) {
  const files = fs.readdirSync(MODELS).filter((f) => f.endsWith('.glb') && (f === `${model}.glb` || f.startsWith(`${model}-`)));
  const c = { piezas: 0, musculos: 0 };
  const malos = { titulo: [], latin: [], ficha: [], inervacion: [], fuentes: [], raro: [], errata: [] };
  const genericas = {};
  nombres[model] = new Set();
  for (const file of files) {
    for (const n of nodes(file)) {
      const x = n.extras ?? {};
      if (!x.system || !classify(x)) continue;
      const name = (n.name ?? '').replace(/\s/g, '_').replace(/[[\].:/]/g, '');
      const info = resolvePart(name, x);
      c.piezas++;
      nombres[model].add(name);
      const d = info.entry?.descripcion ?? '';
      if (GENERICOS.some((g) => g.test(d))) genericas[classify(x).system] = (genericas[classify(x).system] ?? 0) + 1;
      if (!info.title || /_/.test(info.title)) malos.titulo.push(name);
      if (!info.latin) malos.latin.push(name);
      if (RARO.test(`${info.title} ${info.latin ?? ''} ${info.entry?.descripcion ?? ''}`)) malos.raro.push(name);
      if (ERRATA.test(`${info.title} ${info.entry?.descripcion ?? ''}`)) malos.errata.push(name);
      if (x.system !== 'muscular') continue;
      c.musculos++;
      if (!info.entry?.descripcion) malos.ficha.push(name);
      if (!info.fields.some((f) => f.label === 'Inervación')) malos.inervacion.push(name);
      if (!info.fuentes) malos.fuentes.push(name);
    }
  }
  console.log(`${model}: ${c.piezas} piezas (${c.musculos} musculares)`);
  const g = Object.entries(genericas).sort((a, b) => b[1] - a[1]);
  if (g.length) console.log(`  (informativo) descripción genérica: ${g.map(([s, n]) => `${s} ${n}`).join(', ')}`);
  for (const [k, v] of Object.entries(malos)) {
    if (!v.length) continue;
    fallos += v.length;
    console.log(`  ${k}: ${v.length} — ${[...new Set(v.map((s) => s.replace(/_[LR]$/, '')))].slice(0, 12).join(', ')}`);
  }
}
// Contenido de estudio.
for (const modulo of MODULOS) {
  const ids = new Set(modulo.estructuras.map((f) => f.id));
  const problemas = [];
  if (ids.size !== modulo.estructuras.length) problemas.push({ nivel: 'error', texto: 'identificadores repetidos' });
  for (const id of [...modulo.nucleo, ...modulo.contexto]) if (!ids.has(id)) problemas.push({ nivel: 'error', texto: `${id}: en el núcleo o el contexto, pero sin ficha` });
  for (const f of modulo.estructuras) problemas.push(...revisarFicha(f, { fuentes: FUENTES, piezasDe: (m) => nombres[m], ids }));
  problemas.push(...revisarModulo(modulo, { fuentes: FUENTES }));
  const errores = problemas.filter((p) => p.nivel === 'error');
  const avisos = problemas.filter((p) => p.nivel === 'aviso');
  const estados = Object.entries(modulo.estructuras.reduce((a, f) => ({ ...a, [f.revision.estado]: (a[f.revision.estado] ?? 0) + 1 }), {}));
  console.log(`módulo «${modulo.id}» (versión ${modulo.version}): ${modulo.estructuras.length} fichas (${modulo.nucleo.length} evaluables), ${modulo.leccion.length} pasos de lección, ${modulo.preguntas.length} preguntas de texto; revisión: ${estados.map(([e, n]) => `${n} ${e}`).join(', ')}`);
  for (const p of errores) console.log(`  error: ${p.texto}`);
  for (const p of avisos) console.log(`  aviso: ${p.texto}`);
  fallos += errores.length;
}
console.log(fallos ? `${fallos} problemas` : 'todo correcto');
process.exit(fallos ? 1 : 0);
