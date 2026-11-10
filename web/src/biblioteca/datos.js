// «Mis datos y privacidad» (especificación, secciones 18, 19 y 21): qué guarda la app en este navegador, exportarlo todo
// en un archivo, importarlo combinándolo con lo que hay (sin duplicar ni quedarse solo con «el porcentaje más alto»)
// y borrarlo. Sin DOM: lo prueba `npm test`.
import * as P from './progreso.js';
import { CLAVE_PROPIAS, CLAVE_APARTADAS, cargarPropias, importarPropias } from './propias.js';
import { CLAVE_EVENTOS, CLAVE_PRIVACIDAD, CLAVE_INVITADO } from './eventos.js';
import { CLAVE_REPORTES } from './reportes.js';
import { CLAVE_TRABAJOS } from '../pet/trabajos.js';

export const FORMATO_DATOS = 'anato3d.mis-datos';
export const VERSION_DATOS = 1;
/** Todo lo de estudio que la app guarda en el navegador (los ajustes de la app, como el idioma, no son datos de estudio). */
export const CLAVES_ESTUDIO = [P.CLAVE, P.CLAVE_V1, P.CLAVE_APARTADO, CLAVE_PROPIAS, CLAVE_APARTADAS, CLAVE_TRABAJOS, CLAVE_REPORTES, CLAVE_EVENTOS, CLAVE_PRIVACIDAD, CLAVE_INVITADO, 'anato3d.neuri.visto'];
export const CLAVES_SESION = ['anato3d.neuri'];

const leer = (almacen, clave) => { try { return JSON.parse(almacen?.getItem(clave) ?? 'null'); } catch { return null; } };

/** El archivo con todos los datos de estudio de este navegador. */
export function exportarDatos({ almacen, data, ahora = Date.now }) {
  return JSON.stringify({
    formato: FORMATO_DATOS, version: VERSION_DATOS, fecha: new Date(ahora()).toISOString(),
    progreso: data, propias: cargarPropias(almacen), trabajos: leer(almacen, CLAVE_TRABAJOS) ?? [],
    reportes: leer(almacen, CLAVE_REPORTES) ?? [], eventos: leer(almacen, CLAVE_EVENTOS) ?? [], privacidad: leer(almacen, CLAVE_PRIVACIDAD),
  }, null, 2);
}

/**
 * Combina dos progresos (el de aquí y uno importado) con reglas coherentes:
 *  - lecciones: pasos vistos de los dos; terminada en la primera fecha; evaluaciones de las dos (sin repetir); el paso
 *    y la versión de la que se estudió más recientemente;
 *  - preguntas del repaso: el estado de la respuesta más reciente (el repaso espaciado es una secuencia: no se suman
 *    aciertos de dos copias ni se elige la caja más alta);
 *  - intentos y sesiones: los de las dos, sin repetir; favoritos: los de las dos;
 *  - preferencias y plan de examen: los de aquí, si los hay.
 * Devuelve { data, cambios: { lecciones, items, intentos } }.
 */
export function fusionarProgreso(aqui, otro) {
  const data = JSON.parse(JSON.stringify(aqui));
  const cambios = { lecciones: 0, items: 0, intentos: 0 };
  for (const [id, p] of Object.entries(otro.lecciones ?? {})) {
    const q = data.lecciones[id];
    if (!q) { data.lecciones[id] = p; cambios.lecciones++; continue; }
    const masNueva = (p.actividad ?? 0) > (q.actividad ?? 0) ? p : q;
    const evs = [...(q.evaluaciones ?? []), ...(p.evaluaciones ?? [])];
    const unicas = [...new Map(evs.map((e) => [`${e.fecha}|${e.aciertos}|${e.total}`, e])).values()].sort((a, b) => a.fecha - b.fecha).slice(-20);
    const vistos = [...new Set([...(q.vistos ?? []), ...(p.vistos ?? [])])];
    const completada = [q.completada, p.completada].filter((x) => x != null).sort((a, b) => a - b)[0] ?? null;
    const nueva = { ...masNueva, vistos, completada, evaluaciones: unicas, actividad: Math.max(q.actividad ?? 0, p.actividad ?? 0) || null };
    if (JSON.stringify(nueva) !== JSON.stringify(q)) cambios.lecciones++;
    data.lecciones[id] = nueva;
  }
  for (const [id, e] of Object.entries(otro.items ?? {})) {
    const q = data.items[id];
    if (!q || (e.ultimo ?? 0) > (q.ultimo ?? 0)) { data.items[id] = e; cambios.items++; }
  }
  const clave = (i) => `${i.f}|${i.l}|${i.q}|${i.r}`;
  const vistos = new Set((data.intentos ?? []).map(clave));
  const nuevos = (otro.intentos ?? []).filter((i) => i && !vistos.has(clave(i)));
  cambios.intentos = nuevos.length;
  data.intentos = [...(data.intentos ?? []), ...nuevos].sort((a, b) => a.f - b.f).slice(-P.MAX_INTENTOS);
  data.favoritos = [...new Set([...(data.favoritos ?? []), ...(otro.favoritos ?? [])])];
  data.sesiones = [...new Map([...(data.sesiones ?? []), ...(otro.sesiones ?? [])].map((s) => [`${s.fecha}|${s.tipo}`, s])).values()].sort((a, b) => a.fecha - b.fecha).slice(-30);
  data.preferencias = data.preferencias ?? P.limpiarPreferencias(otro.preferencias);
  data.examen = data.examen ?? otro.examen ?? null;
  return { data, cambios };
}

/**
 * Importa un archivo de «Mis datos»: el progreso se combina (fusionarProgreso) y las lecciones propias también
 * (importarPropias: sin duplicar ni sobrescribir). Devuelve { ok, data?, cambios?, propias?, error? }; `data` es el
 * progreso combinado, que la app guarda.
 */
export function importarDatos(texto, { almacen, data }) {
  let d;
  try { d = JSON.parse(texto); } catch { return { ok: false, error: 'formato' }; }
  if (d?.formato !== FORMATO_DATOS || d.version !== VERSION_DATOS) return { ok: false, error: 'formato' };
  const prog = d.progreso;
  const progresoValido = prog && prog.version === P.VERSION && typeof prog.lecciones === 'object' && typeof prog.items === 'object';
  const fusion = progresoValido ? fusionarProgreso(data, prog) : { data, cambios: { lecciones: 0, items: 0, intentos: 0 } };
  const propias = Array.isArray(d.propias) && d.propias.length ? importarPropias(almacen, JSON.stringify(d.propias)) : { ok: true, añadidas: 0, copias: 0, iguales: 0, invalidas: 0, sinSitio: 0 };
  return { ok: true, data: fusion.data, cambios: fusion.cambios, propias, progresoValido };
}

/** Cuánto hay guardado de cada cosa (para explicarlo en la vista). */
export function inventarioDatos({ almacen, data, sesion = null }) {
  const n = (clave) => { const v = leer(almacen, clave); return Array.isArray(v) ? v.length : 0; };
  let conversacion = 0;
  try { conversacion = (JSON.parse(sesion?.getItem('anato3d.neuri') ?? 'null')?.mensajes ?? []).length; } catch { conversacion = 0; }
  return {
    lecciones: Object.keys(data.lecciones ?? {}).length, respuestas: (data.intentos ?? []).length, preguntas: Object.keys(data.items ?? {}).length,
    propias: cargarPropias(almacen).length, trabajos: n(CLAVE_TRABAJOS), reportes: n(CLAVE_REPORTES), eventos: n(CLAVE_EVENTOS),
    examen: !!data.examen, preferencias: !!data.preferencias, conversacion,
    apartado: !!(leer(almacen, P.CLAVE_APARTADO) || n(CLAVE_APARTADAS)),
  };
}

/** Borra todos los datos de estudio de este navegador (y la conversación de esta pestaña). Devuelve si se pudo todo. */
export function borrarDatos({ almacen, sesion = null }) {
  let ok = true;
  for (const k of CLAVES_ESTUDIO) { try { almacen?.removeItem(k); } catch { ok = false; } }
  for (const k of CLAVES_SESION) { try { sesion?.removeItem(k); } catch { ok = false; } }
  return ok;
}
