// «Mis lecciones»: las lecciones que crea o adapta Neuri, guardadas solo en este navegador (localStorage). Tienen el
// mismo formato que las de la biblioteca (formato.js) y se estudian igual, con el visor, la evaluación y el repaso,
// pero son borradores generados por IA: la app lo dice siempre. Sin DOM: lo prueba `npm test`.
//
// Lo que nunca pasa en silencio (especificación, sección 17):
//  - al llegar al máximo no se borra ninguna: guardar falla con «lleno» y la app ofrece liberar espacio o descargarla;
//  - lo guardado dañado o de otra versión no se pierde: antes de escribir, se aparta tal cual (CLAVE_APARTADAS) para
//    descargarlo o descartarlo a propósito;
//  - una lección con el mismo identificador y otro contenido no se sobrescribe: se guarda como copia;
//  - renombrar no cambia el contenido (ni la versión ni los resultados); adaptar crea otra lección.
import { revisarLeccion } from './formato.js';
import { ID_PROPIA } from '../pet/protocolo.js';

export const CLAVE_PROPIAS = 'anato3d.propias';
export const CLAVE_APARTADAS = 'anato3d.propias.apartadas';
export const MAX_PROPIAS = 40;
export const MAX_TITULO = 120;
const MAX_BYTES = 3 * 1024 * 1024;
const MAX_APARTADAS = 50;
/** Formato del archivo que exporta «Mis lecciones» (y que se puede volver a importar). */
export const FORMATO_EXPORTACION = 'anato3d.mis-lecciones';

/** ¿Es una lección propia con la forma mínima para abrirla? (lo guardado puede venir de otra versión o estar dañado). */
export function esPropiaValida(L) {
  if (!L || typeof L !== 'object' || !ID_PROPIA.test(L.id ?? '') || !L.origen?.neuri) return false;
  if (typeof L.titulo !== 'string' || !L.titulo.trim()) return false;
  // Una lección de Neuri es siempre un borrador: ni la app ni un archivo importado pueden darla por revisada
  // (la revisión profesional necesita un flujo editorial con permisos que aún no existe).
  if (L.revision?.estado !== 'borrador' || L.revision?.revisor != null) return false;
  if (!Array.isArray(L.pasos) || !L.pasos.length || !L.estructuras || typeof L.estructuras !== 'object' || !Array.isArray(L.preguntas)) return false;
  // El revisor sin modelos ni registro de fuentes: forma, pasos, preguntas, objetivos y citas.
  try { return !revisarLeccion(L, {}).some((p) => p.nivel === 'error'); } catch { return false; }
}

/**
 * Lo guardado, separado: las lecciones que se pueden abrir, las que no (dañadas o de otra versión) y, si la clave
 * entera no se puede leer, su texto tal cual.
 */
function leerTodo(storage) {
  let texto = null;
  try { texto = storage?.getItem(CLAVE_PROPIAS) ?? null; } catch { return { validas: [], danadas: [], ilegible: null, bloqueado: true }; }
  if (texto == null) return { validas: [], danadas: [], ilegible: null };
  let d;
  try { d = JSON.parse(texto); } catch { return { validas: [], danadas: [], ilegible: texto }; }
  if (!Array.isArray(d)) return { validas: [], danadas: [], ilegible: texto };
  const validas = [];
  const danadas = [];
  const vistos = new Set();
  for (const L of d) {
    if (esPropiaValida(L) && !vistos.has(L.id)) { validas.push(L); vistos.add(L.id); } else danadas.push(L);
  }
  return { validas, danadas, ilegible: null };
}

/** Las lecciones propias guardadas (las válidas), de la más reciente a la más antigua. */
export function cargarPropias(storage) {
  return leerTodo(storage).validas;
}

/**
 * Cuántas lecciones hay guardadas, sin comprobarlas una a una (rápido): para saber si cabe otra antes de empezar a
 * crearla (los recorridos personales, src/pet/recorridos.js). Lo dañado también cuenta: ocupa sitio hasta que se aparta.
 */
export function contarGuardadas(storage) {
  try {
    const d = JSON.parse(storage?.getItem(CLAVE_PROPIAS) ?? '[]');
    return Array.isArray(d) ? d.length : 0;
  } catch { return 0; }
}

/** Lo apartado (lecciones dañadas o de otra versión que no se pudieron abrir), con cuándo se apartó. */
export function apartadas(storage) {
  try {
    const d = JSON.parse(storage?.getItem(CLAVE_APARTADAS) ?? '[]');
    return Array.isArray(d) ? d : [];
  } catch { return []; }
}

/**
 * Cuántas lecciones hay, cuántas caben y cuántas se apartaron (para la vista de «Mis lecciones»). Lo que no se puede
 * abrir se copia antes a lo apartado, para poder descargarlo ya.
 */
export function estadoPropias(storage, { ahora = Date.now } = {}) {
  const leido = leerTodo(storage);
  apartar(storage, leido, ahora);
  return { lecciones: leido.validas.length, maximo: MAX_PROPIAS, danadas: leido.danadas.length + (leido.ilegible ? 1 : 0), apartadas: apartadas(storage).length };
}

/**
 * Antes de escribir la lista: lo que no se puede abrir se copia, tal cual, a lo apartado (sin repetir). Devuelve false
 * si no se pudo apartar (y entonces no se escribe nada, para no perderlo).
 */
function apartar(storage, { danadas, ilegible }, ahora) {
  if (!danadas.length && !ilegible) return true;
  const lista = apartadas(storage);
  const ya = new Set(lista.map((x) => x.texto));
  const nuevas = [...danadas.map((L) => JSON.stringify(L)), ...(ilegible ? [ilegible] : [])].filter((x) => !ya.has(x));
  if (!nuevas.length) return true;
  const todas = [...lista, ...nuevas.map((texto) => ({ texto, apartada: new Date(ahora()).toISOString() }))];
  // Si son demasiadas, se avisa (no se borran las antiguas): la app pide descargarlas o descartarlas.
  if (todas.length > MAX_APARTADAS) return false;
  try { storage.setItem(CLAVE_APARTADAS, JSON.stringify(todas)); return true; } catch { return false; }
}

/** Escribe la lista (y aparta antes lo que no se podía abrir). Devuelve { ok, error? }. */
function escribir(storage, lista, leido, ahora) {
  const datos = JSON.stringify(lista);
  if (datos.length > MAX_BYTES) return { ok: false, error: 'espacio' };
  if (!apartar(storage, leido, ahora)) return { ok: false, error: 'apartar' };
  try { storage.setItem(CLAVE_PROPIAS, datos); return { ok: true }; } catch (err) { return { ok: false, error: errorAlmacen(err) }; }
}
const errorAlmacen = (err) => (err?.name === 'QuotaExceededError' || err?.code === 22 || /quota/i.test(String(err?.message)) ? 'espacio' : 'almacenamiento');
const iguales = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/** Un identificador nuevo para una copia (otra lección con el mismo identificador y distinto contenido). */
function idCopia(id, ocupados) {
  const base = id.replace(/-copia\d+$/, '').slice(0, 72);
  for (let n = 2; n < 1000; n++) {
    const nuevo = `${base}-copia${n}`;
    if (!ocupados.has(nuevo) && ID_PROPIA.test(nuevo)) return nuevo;
  }
  return null;
}

/**
 * Guarda una lección propia (la más reciente, primero). Devuelve { ok, id?, error? }:
 *  - 'invalida': no tiene la forma de una lección;
 *  - 'lleno': ya hay MAX_PROPIAS (no se borra ninguna para hacer sitio);
 *  - 'espacio': el navegador no tiene sitio; 'almacenamiento': no deja guardar (bloqueado); 'apartar': no se pudo
 *    poner a salvo lo dañado antes de escribir.
 * Si ya hay una con su identificador: igual, no cambia nada; distinta, se guarda como copia (`id` dice cuál).
 */
export function guardarPropia(storage, L, { ahora = Date.now } = {}) {
  if (!esPropiaValida(L)) return { ok: false, error: 'invalida' };
  const leido = leerTodo(storage);
  if (leido.bloqueado) return { ok: false, error: 'almacenamiento' };
  const previa = leido.validas.find((x) => x.id === L.id);
  if (previa && iguales(previa, L)) return { ok: true, id: L.id };
  let nueva = L;
  if (previa) {
    const id = idCopia(L.id, new Set(leido.validas.map((x) => x.id)));
    if (!id) return { ok: false, error: 'invalida' };
    nueva = { ...L, id };
  }
  if (leido.validas.length >= MAX_PROPIAS) return { ok: false, error: 'lleno' };
  const r = escribir(storage, [nueva, ...leido.validas], leido, ahora);
  return r.ok ? { ok: true, id: nueva.id } : r;
}

/** Cambia el título de una lección propia (el contenido, su versión y los resultados no cambian). */
export function renombrarPropia(storage, id, titulo, { ahora = Date.now } = {}) {
  const limpio = String(titulo ?? '').replace(/\s+/g, ' ').trim();
  if (!limpio || limpio.length > MAX_TITULO) return { ok: false, error: 'titulo' };
  const leido = leerTodo(storage);
  const L = leido.validas.find((x) => x.id === id);
  if (!L) return { ok: false, error: 'no-existe' };
  if (L.titulo === limpio) return { ok: true };
  const cambiada = { ...L, titulo: limpio, origen: { ...L.origen, tituloOriginal: L.origen?.tituloOriginal ?? L.titulo } };
  return escribir(storage, leido.validas.map((x) => (x.id === id ? cambiada : x)), leido, ahora);
}

/** Borra una lección propia (lo apartado se conserva). */
export function borrarPropia(storage, id, { ahora = Date.now } = {}) {
  const leido = leerTodo(storage);
  if (!leido.validas.some((x) => x.id === id)) return false;
  return escribir(storage, leido.validas.filter((x) => x.id !== id), leido, ahora).ok;
}

/**
 * Descarta lo apartado (solo cuando la persona lo pide, después de poder descargarlo): también sale de la lista
 * principal, que se queda con las lecciones que se pueden abrir.
 */
export function descartarApartadas(storage) {
  const leido = leerTodo(storage);
  if (leido.bloqueado) return false;
  try {
    if (leido.danadas.length || leido.ilegible) storage.setItem(CLAVE_PROPIAS, JSON.stringify(leido.validas));
    storage.setItem(CLAVE_APARTADAS, '[]');
    return true;
  } catch { return false; }
}

/** El archivo de «Mis lecciones» (JSON) para guardarlo fuera del navegador o llevarlo a otro. */
export function exportarPropias(storage, { ahora = Date.now, ids = null } = {}) {
  const lecciones = cargarPropias(storage).filter((L) => !ids || ids.includes(L.id));
  return JSON.stringify({ formato: FORMATO_EXPORTACION, version: 1, fecha: new Date(ahora()).toISOString(), lecciones }, null, 2);
}

/**
 * Importa lecciones de un archivo: el de exportar, una lección sola (la que se descarga cuando no se pudo guardar) o
 * una lista. Se combinan con las que hay: las iguales no se repiten; las que tienen el mismo identificador y otro
 * contenido entran como copia; las que no caben no se meten (y se dice cuántas). Nunca se borra ninguna.
 * Devuelve { ok, añadidas, iguales, copias, invalidas, sinSitio, error? }.
 */
export function importarPropias(storage, texto, { ahora = Date.now } = {}) {
  const r = { ok: false, añadidas: 0, iguales: 0, copias: 0, invalidas: 0, sinSitio: 0 };
  let d;
  try { d = JSON.parse(texto); } catch { return { ...r, error: 'formato' }; }
  const entrada = Array.isArray(d) ? d : d?.formato === FORMATO_EXPORTACION && Array.isArray(d.lecciones) ? d.lecciones : d && typeof d === 'object' && d.id ? [d] : null;
  if (!entrada) return { ...r, error: 'formato' };
  const leido = leerTodo(storage);
  if (leido.bloqueado) return { ...r, error: 'almacenamiento' };
  const lista = [...leido.validas];
  const ocupados = new Set(lista.map((x) => x.id));
  const nuevas = [];
  for (const L of entrada) {
    if (!esPropiaValida(L)) { r.invalidas++; continue; }
    const previa = lista.find((x) => x.id === L.id) ?? nuevas.find((x) => x.id === L.id);
    if (previa && iguales(previa, L)) { r.iguales++; continue; }
    if (lista.length + nuevas.length >= MAX_PROPIAS) { r.sinSitio++; continue; }
    let nueva = L;
    if (previa || ocupados.has(L.id)) {
      const id = idCopia(L.id, ocupados);
      if (!id) { r.invalidas++; continue; }
      nueva = { ...L, id };
      r.copias++;
    } else r.añadidas++;
    ocupados.add(nueva.id);
    nuevas.push(nueva);
  }
  if (!nuevas.length) return { ...r, ok: true };
  const w = escribir(storage, [...nuevas, ...lista], leido, ahora);
  return w.ok ? { ...r, ok: true } : { ...r, añadidas: 0, copias: 0, ok: false, error: w.error };
}

/**
 * La entrada del catálogo de una lección propia (los mismos campos que genera scripts/biblioteca.mjs). `existe(id)`:
 * si una lección existe, para conservar sus requisitos y la siguiente sin dejar enlaces rotos.
 */
export function entradaCatalogo(L, orden = 1000, existe = () => true) {
  const validos = (lista) => (Array.isArray(lista) ? lista.filter((id) => typeof id === 'string' && existe(id)) : []);
  return {
    id: L.id, version: L.version, titulo: L.titulo, resumen: L.resumen, lugares: L.lugares ?? [], sistemas: L.sistemas ?? [],
    formato: L.formato, temas: L.temas ?? [], nivel: L.nivel, minutos: L.minutos, requisitos: validos(L.requisitos), siguiente: validos(L.siguiente),
    modelos: L.modelos, idiomas: L.idiomas, objetivos: L.objetivos,
    estructuras: Object.entries(L.estructuras).map(([id, e]) => ({ id, nombre: e.nombre, tipo: e.tipo, papel: e.papel, en: null, la: null })),
    orden, pasos: L.pasos.length, preguntas: L.preguntas.length, estado: 'borrador',
    propia: true, origen: L.origen,
  };
}

/** Lo que se cuenta a Neuri de una lección propia (para recomendarla o adaptarla). */
export const resumenPropia = (L) => ({ id: L.id, titulo: L.titulo, resumen: L.resumen, minutos: L.minutos, nivel: L.nivel });
