// Fuentes de las fichas del sistema linfático (src/data/linfatico/): descarga cada página citada y comprueba que cada
// cita está, palabra por palabra, en la versión guardada de su página. Es el mismo método que la biblioteca de estudio
// (scripts/biblioteca/fuentes.mjs, cuyas funciones usa), con un registro propio para no tocar el de la biblioteca.
//
// Uso (desde web/):
//   node scripts/linfatico-citas.mjs bajar wp:Thoracic_duct wpes:Conducto_torácico …
//        descarga las páginas (si no están ya) y las registra con su versión (número de revisión de Wikipedia)
//   node scripts/linfatico-citas.mjs frases wp:Thoracic_duct 'venous angle|terminat' [--max 40]
//        frases de una página guardada que contienen esas palabras (para redactar con citas literales)
//   node scripts/linfatico-citas.mjs texto wp:Thoracic_duct [desde] [hasta]   el texto guardado, por caracteres
//   node scripts/linfatico-citas.mjs comprobar
//        comprueba todas las citas de las fichas y de los grupos linfáticos (descarga lo que falte, en la versión
//        registrada) y escribe src/data/linfatico/comprobadas.js; termina con código 1 si alguna cita no está
//
// Fuentes válidas: «wp:Título» (Wikipedia en inglés) y «wpes:Título» (Wikipedia en español), las dos CC BY-SA 4.0; la
// Terminologia Anatomica se cita por su número (TA(5137)) y se comprueba contra sources/z-anatomy/TA2.csv en
// check-cards. TeachMeAnatomy solo sirve para comprobar, nunca como cita de una ficha.
//
// Las páginas se guardan en build/biblioteca/fuentes/ (la misma caché que la biblioteca, fuera de git). Si la biblioteca
// ya registró una página, se usa la misma versión, para que las dos lean el mismo texto.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fuente, leerRegistro, normalizar, huellaCita, partirFrases } from './biblioteca/fuentes.mjs';
import { FICHAS_LINF, GRUPOS_LINF, evidenciasDe } from '../src/data/linfatico/index.js';
import { FUENTES_LINF } from '../src/data/linfatico/comprobadas.js';

const WEB = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SALIDA = path.join(WEB, 'src/data/linfatico/comprobadas.js');
const VALIDAS = /^(wp|wpes):/;

const ordenar = (o) => Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b)));

/** Registro para descargar: el propio y, para las páginas que no tiene, el de la biblioteca (misma versión). */
function registro() {
  const lib = leerRegistro();
  return { ...lib, ...structuredClone(FUENTES_LINF) };
}

/** Datos de una página que guarda el registro propio (sin el texto). */
const meta = (d, reg) => {
  const r = reg[d.id] ?? {};
  return { titulo: d.titulo, url: r.url ?? d.url, revid: r.revid ?? d.revid ?? null, actualizada: r.actualizada ?? d.actualizada ?? null, consultada: FUENTES_LINF[d.id]?.consultada ?? d.fecha, licencia: d.licencia };
};

function escribir(fuentes, citas) {
  const js = `// Generado por scripts/linfatico-citas.mjs (bajar y comprobar): no editar a mano.
// FUENTES_LINF: cada página citada en las fichas linfáticas, con la versión que se leyó (la ficha enlaza esa versión).
// CITAS_LINF: huellas de las citas comprobadas palabra por palabra en esa versión (check-cards exige que estén aquí).
export const FUENTES_LINF = ${JSON.stringify(ordenar(fuentes), null, 1)};
export const CITAS_LINF = ${JSON.stringify(ordenar(citas), null, 1)};
`;
  fs.writeFileSync(SALIDA, js);
}

async function pagina(id, reg) {
  if (!VALIDAS.test(id)) throw new Error(`${id}: solo se citan páginas de Wikipedia (wp: o wpes:)`);
  return fuente(id, { registro: reg, guardarRegistro: false });
}

/** Todas las evidencias con página de las fichas y de los grupos: [{ donde, f, c }]. */
export function todasLasCitas() {
  const out = [];
  for (const [k, ficha] of Object.entries(FICHAS_LINF)) for (const e of evidenciasDe(ficha)) if (e.f) out.push({ donde: k, ...e });
  for (const [k, g] of Object.entries(GRUPOS_LINF)) for (const e of evidenciasDe(g)) if (e.f) out.push({ donde: `grupo ${k}`, ...e });
  return out;
}

function pista(texto, cita) {
  for (let n = Math.min(cita.length, 60); n >= 12; n -= 4) {
    const i = texto.indexOf(cita.slice(0, n));
    if (i >= 0) return `empieza igual que: «${texto.slice(i, i + cita.length + 20)}»`;
  }
  return 'no se encuentra el comienzo en la página';
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [orden, ...args] = process.argv.slice(2);
  const reg = registro();
  if (orden === 'bajar') {
    const fuentes = structuredClone(FUENTES_LINF);
    for (const id of args) {
      try {
        const d = await pagina(id, reg);
        fuentes[id] = meta(d, reg);
        console.log(`${id}: ${d.titulo} · revisión ${d.revid ?? '?'} · ${d.texto.length} caracteres`);
      } catch (e) { console.log(`${id}: ERROR ${e.message}`); process.exitCode = 1; }
    }
    const { CITAS_LINF } = await import('../src/data/linfatico/comprobadas.js');
    escribir(fuentes, CITAS_LINF);
  } else if (orden === 'frases') {
    const [id, patron = '.', ...resto] = args;
    const max = resto.includes('--max') ? +resto[resto.indexOf('--max') + 1] : 60;
    const d = await pagina(id, reg);
    const re = new RegExp(patron, 'i');
    let n = 0;
    partirFrases(d.texto).forEach((s, i) => { if (re.test(s) && n++ < max) console.log(`[${i}] ${s}`); });
    if (n > max) console.log(`… y ${n - max} más`);
  } else if (orden === 'texto') {
    const [id, desde = 0, hasta = 4000] = args;
    console.log((await pagina(id, reg)).texto.slice(+desde, +hasta));
  } else if (orden === 'comprobar') {
    const fuentes = structuredClone(FUENTES_LINF);
    const citas = {};
    const fallos = [];
    const textos = new Map();
    for (const e of todasLasCitas()) {
      if (!textos.has(e.f)) {
        try {
          const d = await pagina(e.f, reg);
          fuentes[e.f] = meta(d, reg);
          textos.set(e.f, normalizar(d.texto));
        } catch (err) { textos.set(e.f, null); fallos.push({ ...e, pista: err.message }); continue; }
      }
      const t = textos.get(e.f);
      if (t == null) continue;
      if (t.includes(normalizar(e.c))) (citas[e.f] ??= new Set()).add(huellaCita(e.f, e.c));
      else fallos.push({ ...e, pista: pista(t, normalizar(e.c)) });
    }
    // Solo las páginas que se citan (una página bajada y ya no usada sale del registro).
    const usadas = new Set(Object.keys(citas));
    for (const f of fallos) usadas.add(f.f);
    escribir(Object.fromEntries(Object.entries(fuentes).filter(([k]) => usadas.has(k))), Object.fromEntries(Object.entries(citas).map(([k, v]) => [k, [...v].sort()])));
    for (const f of fallos) console.log(`✗ ${f.donde} · ${f.f}\n    cita: «${f.c}»\n    ${f.pista}`);
    const total = Object.values(citas).reduce((n, v) => n + v.size, 0);
    console.log(`${total} citas comprobadas en ${Object.keys(citas).length} páginas; ${fallos.length} sin encontrar`);
    if (fallos.length) process.exitCode = 1;
  } else {
    console.log('órdenes: bajar <fuentes…> | frases <fuente> [patrón] [--max N] | texto <fuente> [desde] [hasta] | comprobar');
  }
}
