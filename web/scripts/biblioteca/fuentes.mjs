// Fuentes de la biblioteca de estudio: descarga y guarda cada página citada y comprueba que cada cita de las lecciones
// está, palabra por palabra, en la versión guardada de su página.
//
// Uso (desde web/):
//   node scripts/biblioteca/fuentes.mjs bajar wp:Rotator_cuff tma:upper-limb/muscles/shoulder/intrinsic …
//        descarga las páginas (si no están ya) y las registra con su versión (Wikipedia: número de revisión)
//   node scripts/biblioteca/fuentes.mjs frases wp:Rotator_cuff 'origin|insert|innervat' [--max 40]
//        frases de una página guardada que contienen esas palabras (para redactar con citas literales)
//   node scripts/biblioteca/fuentes.mjs texto wp:Rotator_cuff [desde] [hasta]   el texto guardado, por caracteres
//   node scripts/biblioteca/fuentes.mjs comprobar
//        comprueba todas las citas de todas las lecciones (descarga lo que falte, en la versión registrada) y apunta
//        las comprobadas en citas-comprobadas.json; termina con código 1 si alguna cita no está en su página
//
// Fuentes: «wp:Título» (Wikipedia en inglés, CC BY-SA 4.0), «wpes:Título» (Wikipedia en español, CC BY-SA 4.0) y
// «tma:ruta» (TeachMeAnatomy, © TeachMeSeries Ltd: solo se cita una frase corta y se enlaza). OpenStax no se usa: su
// licencia actual (CC BY-NC-SA) no permite el uso comercial y el libro no puede usarse con IA generativa sin permiso.
//
// Las páginas se guardan en build/biblioteca/fuentes/ (fuera de git: se pueden volver a bajar). El registro de
// versiones (src/biblioteca/generado/fuentes.json) sí va en git: lo usa la app para enlazar cada fuente en la versión
// que se leyó, y sirve para volver a bajar exactamente esa versión.
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { WEB } from './inventario.mjs';
import { todasLasEvidencias } from '../../src/biblioteca/formato.js';

const CACHE = path.join(WEB, '../build/biblioteca/fuentes');
export const REGISTRO = path.join(WEB, 'src/biblioteca/generado/fuentes.json');
export const COMPROBADAS = path.join(WEB, 'scripts/biblioteca/citas-comprobadas.json');
const LECCIONES = path.join(WEB, 'src/biblioteca/lecciones');
const UA = 'Anato3D-fuentes/1.0 (herramienta educativa; sin datos personales)';
const hoy = () => new Date().toISOString().slice(0, 10);

const leerJSON = (f, def) => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return def; } };
const escribirJSON = (f, d) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, `${JSON.stringify(d, null, 1)}\n`); };
export const leerRegistro = () => leerJSON(REGISTRO, {});

/** Texto normalizado para comparar citas: comillas, guiones y espacios de un solo tipo. */
export function normalizar(s) {
  return String(s).normalize('NFC')
    .replace(/[‘’ʼ′]/g, "'").replace(/[“”″]/g, '"')
    .replace(/[‐-―−]/g, '-').replace(/­/g, '')
    .replace(/\s+/g, ' ').trim();
}
export const huellaCita = (fuente, cita) => crypto.createHash('sha1').update(`${fuente}\n${normalizar(cita)}`).digest('hex').slice(0, 16);

const archivo = (id) => {
  const [tipo, resto] = [id.slice(0, id.indexOf(':')), id.slice(id.indexOf(':') + 1)];
  return path.join(CACHE, tipo, `${resto.replace(/[^A-Za-z0-9_.,()'-]+/g, '_')}.json`);
};

// Con calma: si el servidor pide esperar (429 o 503), se espera lo que diga (o 5, 15, 45 s) y se reintenta.
async function pedir(url, intentos = 4) {
  for (let i = 0; ; i++) {
    const r = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json,text/html' } });
    if (r.ok) return r;
    if ((r.status === 429 || r.status === 503) && i < intentos) {
      const espera = Number(r.headers.get('retry-after')) * 1000 || 5000 * 3 ** i;
      await new Promise((ok) => setTimeout(ok, espera));
      continue;
    }
    throw new Error(`${r.status} ${url}`);
  }
}

const html2texto = (h) => h
  .replace(/<(script|style|noscript|figure|table)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
  .replace(/<sup[^>]*class="[^"]*reference[^"]*"[^>]*>[\s\S]*?<\/sup>/gi, '')
  .replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|li|h\d|div|dd|dt|tr)>/gi, '\n')
  .replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/&#0?39;|&#8217;|&rsquo;/g, '’').replace(/&#8216;|&lsquo;/g, '‘').replace(/&#8220;|&ldquo;/g, '“').replace(/&#8221;|&rdquo;/g, '”')
  .replace(/&#8211;|&ndash;/g, '–').replace(/&#8212;|&mdash;/g, '—').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n').trim();

/** Descarga una fuente (en la versión `revid` si se pide) y devuelve { id, titulo, url, revid?, actualizada?, fecha, texto }. */
async function descargar(id, revid = null) {
  const tipo = id.slice(0, id.indexOf(':'));
  const resto = id.slice(id.indexOf(':') + 1);
  if (tipo === 'wp' || tipo === 'wpes') {
    const host = tipo === 'wp' ? 'en.wikipedia.org' : 'es.wikipedia.org';
    const licencia = 'CC BY-SA 4.0';
    if (revid) {
      // Una versión concreta: el HTML de esa revisión, sin notas ni tablas (el texto plano solo existe para la actual).
      const r = await (await pedir(`https://${host}/w/api.php?action=parse&format=json&formatversion=2&prop=text&oldid=${revid}`)).json();
      if (!r.parse) throw new Error(`${id}: la revisión ${revid} no existe`);
      return { id, titulo: r.parse.title, url: `https://${host}/w/index.php?title=${encodeURIComponent(r.parse.title.replace(/ /g, '_'))}&oldid=${revid}`, revid, licencia, fecha: hoy(), texto: html2texto(r.parse.text) };
    }
    const q = `https://${host}/w/api.php?action=query&format=json&formatversion=2&redirects=1&prop=extracts|revisions&explaintext=1&exsectionformat=plain&rvprop=ids|timestamp&titles=${encodeURIComponent(resto.replace(/_/g, ' '))}`;
    const r = await (await pedir(q)).json();
    const p = r.query?.pages?.[0];
    if (!p || p.missing || !p.extract) throw new Error(`${id}: la página no existe`);
    const rev = p.revisions[0].revid;
    return { id, titulo: p.title, url: `https://${host}/w/index.php?title=${encodeURIComponent(p.title.replace(/ /g, '_'))}&oldid=${rev}`, revid: rev, actualizada: p.revisions[0].timestamp.slice(0, 10), licencia, fecha: hoy(), texto: p.extract };
  }
  if (tipo === 'tma') {
    const url = `https://teachmeanatomy.info/${resto.replace(/^\/|\/$/g, '')}/`;
    const h = await (await pedir(url)).text();
    const art = h.match(/<article[\s\S]*?<\/article>/i)?.[0];
    if (!art) throw new Error(`${id}: no se encontró el artículo en la página`);
    const titulo = (h.match(/<title>([^<]*)/i)?.[1] ?? resto).replace(/\s*-\s*TeachMeAnatomy\s*$/, '').trim();
    const actualizada = h.match(/"dateModified":"(\d{4}-\d\d-\d\d)/)?.[1] ?? null;
    return { id, titulo, url, actualizada, licencia: '© TeachMeSeries Ltd', fecha: hoy(), texto: html2texto(art) };
  }
  throw new Error(`fuente desconocida: ${id}`);
}

/** La página guardada (y registrada). Si no está, se baja: en la versión del registro, o la actual (y se registra). */
export async function fuente(id, { registro = leerRegistro(), guardarRegistro = true } = {}) {
  const f = archivo(id);
  const guardada = leerJSON(f, null);
  const reg = registro[id];
  if (guardada && (!reg?.revid || guardada.revid === reg.revid)) return guardada;
  const d = await descargar(id, reg?.revid ?? null);
  escribirJSON(f, d);
  if (!reg) {
    const { texto, ...meta } = d;
    registro[id] = { ...meta, huella: crypto.createHash('sha1').update(normalizar(texto)).digest('hex').slice(0, 12) };
    if (guardarRegistro) escribirJSON(REGISTRO, ordenar(registro));
  }
  await new Promise((r) => setTimeout(r, 1000));         // sin prisas: una petición por segundo
  return d;
}

const ordenar = (o) => Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b)));

/** Frases de un texto (para buscar citas). */
export function partirFrases(texto) {
  return texto.split(/\n+/).flatMap((linea) => linea.split(/(?<=[.!?])\s+(?=[A-Z0-9“"(‘'])/)).map((s) => s.trim()).filter(Boolean);
}

/** Lecciones (en Node): { id → lección } leyendo src/biblioteca/lecciones/*.js. */
export async function cargarLecciones() {
  const out = new Map();
  if (!fs.existsSync(LECCIONES)) return out;
  for (const f of fs.readdirSync(LECCIONES).filter((x) => x.endsWith('.js')).sort()) {
    const mod = await import(path.join(LECCIONES, f));
    const L = mod.default;
    if (L?.id) out.set(L.id, { ...L, archivo: f });
  }
  return out;
}

/** Comprueba las citas de todas las lecciones: { ok, fallos: [{ leccion, fuente, cita, pista }] }. */
export async function comprobarCitas({ lecciones, bajar = true } = {}) {
  lecciones ??= await cargarLecciones();
  const registro = leerRegistro();
  const comprobadas = {};
  const fallos = [];
  const textos = new Map();
  for (const [lid, L] of lecciones) {
    for (const e of todasLasEvidencias(L)) {
      if (!textos.has(e.f)) {
        let d = leerJSON(archivo(e.f), null);
        if ((!d || (registro[e.f]?.revid && d.revid !== registro[e.f].revid)) && bajar) d = await fuente(e.f, { registro });
        textos.set(e.f, d ? normalizar(d.texto) : null);
      }
      const t = textos.get(e.f);
      if (t == null) { fallos.push({ leccion: lid, fuente: e.f, cita: e.c, pista: 'página sin bajar' }); continue; }
      if (t.includes(normalizar(e.c))) (comprobadas[e.f] ??= new Set()).add(huellaCita(e.f, e.c));
      else fallos.push({ leccion: lid, fuente: e.f, cita: e.c, pista: pista(t, normalizar(e.c)) });
    }
  }
  escribirJSON(REGISTRO, ordenar(registro));
  return { comprobadas: ordenar(Object.fromEntries(Object.entries(comprobadas).map(([k, v]) => [k, [...v].sort()]))), fallos };
}

// Dónde se parece más (para corregir una cita mal copiada): el tramo del texto que comparte el comienzo más largo.
function pista(texto, cita) {
  for (let n = Math.min(cita.length, 60); n >= 12; n -= 4) {
    const i = texto.indexOf(cita.slice(0, n));
    if (i >= 0) return `empieza igual que: «${texto.slice(i, i + cita.length + 20)}»`;
  }
  return 'no se encuentra el comienzo en la página';
}

// ── Línea de órdenes ──
// (También el nombre: dentro del paquete del servidor, este módulo va en servidor.mjs y no es la orden.)
if (process.argv[1] && path.basename(process.argv[1]) === 'fuentes.mjs' && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  const [orden, ...args] = process.argv.slice(2);
  if (orden === 'bajar') {
    const registro = leerRegistro();
    for (const id of args) {
      try {
        const d = await fuente(id, { registro });
        console.log(`${id}: ${d.titulo} · ${d.revid ? `revisión ${d.revid}` : `actualizada ${d.actualizada ?? '?'}`} · ${d.texto.length} caracteres`);
      } catch (e) { console.log(`${id}: ERROR ${e.message}`); process.exitCode = 1; }
    }
  } else if (orden === 'frases') {
    const [id, patron = '.', ...resto] = args;
    const max = resto.includes('--max') ? +resto[resto.indexOf('--max') + 1] : 60;
    const d = await fuente(id);
    const re = new RegExp(patron, 'i');
    const fr = partirFrases(d.texto);
    let n = 0;
    fr.forEach((s, i) => { if (re.test(s) && n++ < max) console.log(`[${i}] ${s}`); });
    if (n > max) console.log(`… y ${n - max} más`);
  } else if (orden === 'texto') {
    const [id, desde = 0, hasta = 4000] = args;
    console.log((await fuente(id)).texto.slice(+desde, +hasta));
  } else if (orden === 'comprobar') {
    const { comprobadas, fallos } = await comprobarCitas();
    const total = Object.values(comprobadas).reduce((n, v) => n + v.length, 0);
    escribirJSON(COMPROBADAS, comprobadas);
    for (const f of fallos) console.log(`✗ ${f.leccion} · ${f.fuente}\n    cita: «${f.cita}»\n    ${f.pista}`);
    console.log(`${total} citas comprobadas en ${Object.keys(comprobadas).length} páginas; ${fallos.length} sin encontrar`);
    if (fallos.length) process.exitCode = 1;
  } else {
    console.log('órdenes: bajar <fuentes…> | frases <fuente> [patrón] [--max N] | texto <fuente> [desde] [hasta] | comprobar');
  }
}
