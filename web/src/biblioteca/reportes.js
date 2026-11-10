// «Reportar un problema» (especificación, sección 23): en un paso, una pregunta o la ficha de una lección. El reporte
// lleva lo necesario para encontrar el problema (lección, versión, paso o pregunta, estructura, idioma, modelo y
// categoría); el comentario es opcional. Se guarda en este navegador y se envía a la cola de revisión del servidor
// (server/reportes.mjs), que solo se revisa con scripts/reportes.mjs. Si no se puede enviar, se reintenta más tarde.
// Sin DOM: lo prueba `npm test`.
import { nuevoId } from '../pet/red.js';

export const CLAVE_REPORTES = 'anato3d.reportes';
export const VERSION_REPORTE = 1;
export const URL_REPORTES = '/api/reportes';
export const CATEGORIAS = ['anatomia', 'referencia', 'pregunta', 'modelo', 'traduccion', 'tecnico', 'otro'];
export const VISTAS = ['leccion', 'pregunta', 'ficha', 'neuri'];
export const MAX_COMENTARIO = 1000;
const MAX_LOCALES = 100;
const ID = /^[a-z0-9][a-z0-9:_./-]{0,120}$/i;
const IDIOMAS = ['es', 'en', 'de', 'fr', 'it'];

const texto = (s, max) => (typeof s === 'string' ? s.replace(/\s+/g, ' ').trim().slice(0, max) : '');
const ident = (s) => (typeof s === 'string' && ID.test(s) ? s : null);

/**
 * Valida un reporte (lo usan la app y el servidor). Devuelve { ok, reporte } o { ok: false, error }. Lo que no es de la
 * forma esperada se descarta: un reporte nunca lleva más que estos campos.
 */
export function validarReporte(d) {
  if (!d || typeof d !== 'object') return { ok: false, error: 'formato' };
  if (d.v !== VERSION_REPORTE) return { ok: false, error: 'version' };
  if (!CATEGORIAS.includes(d.categoria)) return { ok: false, error: 'categoria' };
  if (!VISTAS.includes(d.vista)) return { ok: false, error: 'vista' };
  const id = typeof d.id === 'string' && /^[a-z0-9-]{16,64}$/.test(d.id) ? d.id : null;
  if (!id) return { ok: false, error: 'id' };
  const leccion = ident(d.leccion);
  if (!leccion && d.vista !== 'neuri') return { ok: false, error: 'leccion' };
  const comentario = texto(d.comentario, MAX_COMENTARIO);
  if (d.categoria === 'otro' && !comentario) return { ok: false, error: 'comentario' };
  return {
    ok: true,
    reporte: {
      v: VERSION_REPORTE, id, categoria: d.categoria, vista: d.vista, leccion, version: texto(String(d.version ?? ''), 40) || null,
      paso: ident(d.paso), pregunta: ident(d.pregunta), estructura: ident(d.estructura),
      idioma: IDIOMAS.includes(d.idioma) ? d.idioma : null, modelo: ['male', 'female'].includes(d.modelo) ? d.modelo : null,
      comentario: comentario || null, fecha: typeof d.fecha === 'string' && !Number.isNaN(Date.parse(d.fecha)) ? new Date(d.fecha).toISOString() : null,
    },
  };
}

/** Un reporte nuevo con su contexto. */
export function crearReporte({ categoria, comentario = '', contexto = {}, ahora = Date.now, id = nuevoId() }) {
  return validarReporte({ v: VERSION_REPORTE, id, categoria, comentario, fecha: new Date(ahora()).toISOString(), ...contexto });
}

/** Los reportes de este navegador: [{ reporte, estado: 'pendiente' | 'enviado', intentos }]. */
export function reportesLocales(almacen) {
  try {
    const d = JSON.parse(almacen?.getItem(CLAVE_REPORTES) ?? '[]');
    return Array.isArray(d) ? d.filter((x) => x && validarReporte(x.reporte).ok && ['pendiente', 'enviado'].includes(x.estado)) : [];
  } catch { return []; }
}

function guardarLocales(almacen, lista) {
  try { almacen?.setItem(CLAVE_REPORTES, JSON.stringify(lista.slice(-MAX_LOCALES))); return true; } catch { return false; }
}

/**
 * Guarda el reporte en este navegador y lo envía. Devuelve 'enviado' (está en la cola de revisión), 'pendiente' (se
 * guardó aquí y se enviará más tarde) o 'error' (ni se pudo enviar ni guardar).
 */
export async function reportar(reporte, { almacen = null, fetch = globalThis.fetch?.bind(globalThis), url = URL_REPORTES } = {}) {
  const lista = reportesLocales(almacen).filter((x) => x.reporte.id !== reporte.id);
  const entrada = { reporte, estado: 'pendiente', intentos: 0 };
  const guardado = guardarLocales(almacen, [...lista, entrada]);
  const ok = await enviar(reporte, { fetch, url });
  if (ok) { entrada.estado = 'enviado'; guardarLocales(almacen, [...lista, entrada]); return 'enviado'; }
  entrada.intentos = 1;
  guardarLocales(almacen, [...lista, entrada]);
  return guardado ? 'pendiente' : 'error';
}

/** Vuelve a enviar lo pendiente (al abrir «Estudiar»). Devuelve cuántos se enviaron. */
export async function enviarPendientes({ almacen = null, fetch = globalThis.fetch?.bind(globalThis), url = URL_REPORTES } = {}) {
  const lista = reportesLocales(almacen);
  let n = 0;
  for (const x of lista) {
    if (x.estado !== 'pendiente' || x.intentos >= 10) continue;
    // eslint-disable-next-line no-await-in-loop
    if (await enviar(x.reporte, { fetch, url })) { x.estado = 'enviado'; n++; } else x.intentos++;
  }
  guardarLocales(almacen, lista);
  return n;
}

async function enviar(reporte, { fetch, url }) {
  if (!fetch) return false;
  const control = new AbortController();
  const reloj = setTimeout(() => control.abort(), 10_000);
  try {
    const r = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(reporte), signal: control.signal });
    // 409: ya lo tenía (un reintento); también vale.
    return r.ok || r.status === 409;
  } catch { return false; } finally { clearTimeout(reloj); }
}
