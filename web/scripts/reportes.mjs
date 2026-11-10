#!/usr/bin/env node
// Revisión de los reportes de problemas (especificación, sección 23). Lee la cola (server/datos/reportes.jsonl, que la
// app llena con «Reportar un problema») y registra cada decisión con quién, qué, cuándo y el resultado
// (server/datos/decisiones.jsonl). Revisar un reporte no valida la lección entera ni sus traducciones: cada decisión es
// sobre lo que se reportó (su paso, pregunta o estructura).
//
//   npm run reportes                                  los pendientes (sin decisión), por categoría
//   npm run reportes -- todos                         también los decididos
//   npm run reportes -- ver <id>                      un reporte y sus decisiones
//   npm run reportes -- decidir <id> --resultado aceptado|rechazado|corregido|duplicado --revisor "Nombre" [--nota "…"] [--version "…"]
//   npm run reportes -- retirar <leccion | leccion/pregunta> --reporte <id> --revisor "Nombre" [--nota "…"]
//   npm run reportes -- reponer <leccion | leccion/pregunta> --revisor "Nombre" [--nota "…"]
//
// «retirar» quita temporalmente una lección o una pregunta de la app (src/biblioteca/retiradas.js) mientras se corrige:
// no se ofrece, no se pregunta y sus fallos dejan de contar. «reponer» la devuelve. Los dos cambios hay que publicarlos.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPORTES = path.join(RAIZ, 'server/datos/reportes.jsonl');
const DECISIONES = path.join(RAIZ, 'server/datos/decisiones.jsonl');
const RETIRADAS = path.join(RAIZ, 'src/biblioteca/retiradas.js');
export const RESULTADOS = ['aceptado', 'rechazado', 'corregido', 'duplicado', 'retirado', 'repuesto'];
const CATEGORIA = { anatomia: 'Error anatómico', referencia: 'Referencia incorrecta', pregunta: 'Pregunta ambigua', modelo: 'Problema del modelo 3D', traduccion: 'Traducción', tecnico: 'Fallo técnico', otro: 'Otro' };

/** Las líneas válidas de un JSONL (las rotas se ignoran y se cuentan). */
export function leerJsonl(archivo) {
  if (!fs.existsSync(archivo)) return { filas: [], rotas: 0 };
  let rotas = 0;
  const filas = fs.readFileSync(archivo, 'utf8').split('\n').filter((l) => l.trim()).map((l) => { try { return JSON.parse(l); } catch { rotas++; return null; } }).filter(Boolean);
  return { filas, rotas };
}

/** Reportes sin repetir (un reintento de la app puede llegar dos veces) con sus decisiones. */
export function cola({ reportes, decisiones }) {
  const porId = new Map();
  for (const r of reportes) if (!porId.has(r.id)) porId.set(r.id, { ...r, decisiones: [] });
  for (const d of decisiones) porId.get(d.reporte)?.decisiones.push(d);
  return [...porId.values()].sort((a, b) => String(a.recibido).localeCompare(String(b.recibido)));
}

function args(lista) {
  const pos = [];
  const op = {};
  for (let i = 0; i < lista.length; i++) {
    if (lista[i].startsWith('--')) op[lista[i].slice(2)] = lista[i + 1]?.startsWith('--') || lista[i + 1] == null ? true : lista[++i];
    else pos.push(lista[i]);
  }
  return { pos, op };
}

function donde(r) {
  return [r.leccion, r.paso && `paso ${r.paso}`, r.pregunta && `pregunta ${r.pregunta}`, r.estructura && `estructura ${r.estructura}`].filter(Boolean).join(' · ');
}

function decidir(registro) {
  fs.mkdirSync(path.dirname(DECISIONES), { recursive: true });
  fs.appendFileSync(DECISIONES, `${JSON.stringify({ ...registro, fecha: new Date().toISOString() })}\n`, 'utf8');
}

/** Lee y escribe la lista de retiradas (el archivo es JS para que la app lo importe). */
export function leerRetiradas(texto = fs.readFileSync(RETIRADAS, 'utf8')) {
  const lista = (clave) => JSON.parse(texto.match(new RegExp(`${clave}: (\\[[^\\]]*\\])`))?.[1].replace(/'/g, '"').replace(/,\s*\]/, ']') ?? '[]');
  return { lecciones: lista('lecciones'), preguntas: lista('preguntas') };
}
export function escribirRetiradas(r, texto = fs.readFileSync(RETIRADAS, 'utf8')) {
  const fmt = (xs) => `[${xs.map((x) => `'${x}'`).join(', ')}]`;
  return texto.replace(/lecciones: \[[^\]]*\]/, `lecciones: ${fmt(r.lecciones)}`).replace(/preguntas: \[[^\]]*\]/, `preguntas: ${fmt(r.preguntas)}`);
}

function main() {
  const { pos, op } = args(process.argv.slice(2));
  const [orden = 'pendientes', objetivo] = pos;
  const { filas: reportes, rotas } = leerJsonl(REPORTES);
  const { filas: decisiones } = leerJsonl(DECISIONES);
  const todos = cola({ reportes, decisiones });
  if (rotas) console.warn(`(${rotas} línea(s) dañadas en ${path.relative(RAIZ, REPORTES)} se han ignorado)`);

  if (orden === 'pendientes' || orden === 'todos') {
    const lista = orden === 'todos' ? todos : todos.filter((r) => !r.decisiones.length);
    if (!lista.length) { console.log(orden === 'todos' ? 'No hay reportes.' : 'No hay reportes pendientes.'); return; }
    const porCat = Object.groupBy(lista, (r) => r.categoria);
    for (const [cat, rs] of Object.entries(porCat)) {
      console.log(`\n${CATEGORIA[cat] ?? cat} (${rs.length})`);
      for (const r of rs) {
        const dec = r.decisiones.at(-1);
        console.log(`  ${r.id.slice(0, 8)}  ${String(r.recibido).slice(0, 16).replace('T', ' ')}  ${donde(r)}  [${r.idioma ?? '?'}, ${r.modelo ?? '?'}]${dec ? `  → ${dec.resultado} (${dec.revisor})` : ''}`);
        if (r.comentario) console.log(`            «${r.comentario.slice(0, 140)}${r.comentario.length > 140 ? '…' : ''}»`);
      }
    }
    return;
  }
  const buscar = (prefijo) => {
    const xs = todos.filter((r) => r.id.startsWith(prefijo ?? '\0'));
    if (xs.length !== 1) { console.error(xs.length ? 'Ese prefijo coincide con varios reportes: escribe más caracteres.' : 'No hay ningún reporte con ese identificador.'); process.exit(1); }
    return xs[0];
  };
  const revisor = () => {
    if (typeof op.revisor !== 'string' || !op.revisor.trim()) { console.error('Falta --revisor "Nombre" (quién revisa queda registrado).'); process.exit(1); }
    return op.revisor.trim();
  };
  if (orden === 'ver') {
    const r = buscar(objetivo);
    console.log(JSON.stringify(r, null, 2));
    return;
  }
  if (orden === 'decidir') {
    const r = buscar(objetivo);
    if (!RESULTADOS.includes(op.resultado)) { console.error(`--resultado debe ser uno de: ${RESULTADOS.join(', ')}`); process.exit(1); }
    decidir({ reporte: r.id, resultado: op.resultado, revisor: revisor(), nota: typeof op.nota === 'string' ? op.nota : null, version: typeof op.version === 'string' ? op.version : null, sobre: donde(r) });
    console.log(`Decisión registrada: ${r.id.slice(0, 8)} → ${op.resultado}.`);
    return;
  }
  if (orden === 'retirar' || orden === 'reponer') {
    if (!objetivo || !/^[a-z0-9-]+(\/[a-z0-9:_.-]+)?$/i.test(objetivo)) { console.error('Indica la lección («cab-craneo») o la pregunta («cab-craneo/q3»).'); process.exit(1); }
    const quien = revisor();
    const r = leerRetiradas();
    const lista = objetivo.includes('/') ? r.preguntas : r.lecciones;
    if (orden === 'retirar') {
      const rep = op.reporte ? buscar(op.reporte) : null;
      if (!rep) { console.error('Falta --reporte <id>: retirar algo tiene que responder a un reporte.'); process.exit(1); }
      if (!lista.includes(objetivo)) lista.push(objetivo);
      fs.writeFileSync(RETIRADAS, escribirRetiradas(r), 'utf8');
      decidir({ reporte: rep.id, resultado: 'retirado', revisor: quien, nota: typeof op.nota === 'string' ? op.nota : null, sobre: objetivo });
      console.log(`Retirado: ${objetivo}. Publica el cambio de src/biblioteca/retiradas.js para que llegue a la app.`);
    } else {
      const i = lista.indexOf(objetivo);
      if (i < 0) { console.error('Eso no estaba retirado.'); process.exit(1); }
      lista.splice(i, 1);
      fs.writeFileSync(RETIRADAS, escribirRetiradas(r), 'utf8');
      decidir({ reporte: typeof op.reporte === 'string' ? buscar(op.reporte).id : null, resultado: 'repuesto', revisor: quien, nota: typeof op.nota === 'string' ? op.nota : null, sobre: objetivo });
      console.log(`Repuesto: ${objetivo}.`);
    }
    return;
  }
  console.error('Orden desconocida. Mira el principio de scripts/reportes.mjs.');
  process.exit(1);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
