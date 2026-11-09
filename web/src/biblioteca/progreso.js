// Progreso de la biblioteca de estudio, guardado solo en este navegador (localStorage). Sin DOM: lo prueba `npm test`.
//
// Formato (versión 2), en la clave `anato3d.biblioteca`:
//   { version: 2,
//     lecciones: { [id]: { version, paso, vistos: [ids de paso], completada: fecha | null, actividad: fecha,
//                          evaluaciones: [{ fecha, aciertos, total, porObjetivo: [[aciertos, total]…], demostrada }] (20 últimas) } },
//     items: { [leccion/pregunta]: { caja, aciertos, fallos, dudas, ultimo, proximo } },
//     favoritos: [ids de lección o de recorrido],
//     sesiones: [{ fecha, tipo, aciertos, total }] (30 últimas),
//     migracion: { desde: 1, fecha, lecciones } | null }
//
// Cada lección tiene un solo progreso, aunque esté en varios recorridos. Se distinguen cuatro cosas:
//  - avance: los pasos vistos;
//  - finalización: haber llegado al final de la lección;
//  - aprendizaje demostrado: una evaluación con al menos el 80 % de aciertos y algún acierto en cada objetivo;
//  - dominio a largo plazo: todas las preguntas de la lección en la caja 3 o más del repaso espaciado.
// Repaso espaciado con cajas (Leitner): un acierto seguro sube una caja, pero solo si la pregunta ya tocaba (así no se
// llega al dominio acertando tres veces seguidas el mismo día); un fallo o «no lo sé» la devuelve a la caja 0; un
// acierto con duda la deja donde estaba.
//
// Migración: el progreso de la versión 1 (clave `anato3d.progreso`, módulos brazo y antebrazo) se copia al formato
// nuevo la primera vez; la clave antigua no se toca, así que volver a una versión anterior de la app no pierde nada.

export const VERSION = 2;
export const CLAVE = 'anato3d.biblioteca';
export const CLAVE_V1 = 'anato3d.progreso';
export const INTERVALOS_DIAS = [0, 1, 3, 7, 21];
export const CAJA_DOMINIO = 3;
export const UMBRAL_DEMOSTRADA = 0.8;
const DIA = 24 * 3600 * 1000;

export function vacio() {
  return { version: VERSION, lecciones: {}, items: {}, favoritos: [], sesiones: [], migracion: null };
}

function valido(d) {
  return d && d.version === VERSION && typeof d.lecciones === 'object' && typeof d.items === 'object';
}

/**
 * Lee el progreso. Sin progreso nuevo y con uno de la versión 1, lo migra (`lecciones`: Map id → lección, para saber
 * los pasos de cada módulo). Datos dañados o de otra versión: empieza de cero sin tocar lo guardado.
 */
export function cargar(storage, { lecciones = new Map(), ahora = Date.now() } = {}) {
  try {
    const raw = storage?.getItem(CLAVE);
    if (raw) {
      const d = JSON.parse(raw);
      if (!valido(d)) return vacio();
      d.favoritos ??= [];
      d.sesiones ??= [];
      return d;
    }
    const v1 = storage?.getItem(CLAVE_V1);
    if (v1) {
      const d = migrarV1(JSON.parse(v1), lecciones, ahora);
      if (d) return d;
    }
  } catch { /* dañado o almacenamiento bloqueado */ }
  return vacio();
}

/** Guarda; false si el navegador no lo permite (modo privado, almacenamiento lleno o bloqueado). */
export function guardar(storage, data) {
  try {
    storage.setItem(CLAVE, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

/**
 * Progreso de la versión 1 → versión 2. Cada módulo pasa a la lección del mismo identificador: el paso, si estaba
 * terminada, sus evaluaciones y las cajas de cada estructura (que pasan a la pregunta de identificación de esa
 * estructura). Devuelve null si los datos no son de la versión 1.
 */
export function migrarV1(v1, lecciones = new Map(), ahora = Date.now()) {
  if (v1?.version !== 1 || typeof v1.modulos !== 'object') return null;
  const d = vacio();
  const migradas = [];
  for (const [id, m] of Object.entries(v1.modulos)) {
    if (!m || typeof m !== 'object') continue;
    const L = lecciones.get(id);
    const pasos = L?.pasos?.map((p) => p.id) ?? [];
    const paso = Math.max(0, Math.min(Number(m.leccion?.paso) || 0, Math.max(pasos.length - 1, 0)));
    const completada = m.leccion?.completada ? (m.leccion.fecha ?? ahora) : null;
    const evaluaciones = (m.intentos ?? []).filter((i) => i?.tipo === 'evaluacion' && i.total > 0)
      .map((i) => ({ fecha: i.fecha, aciertos: i.aciertos, total: i.total, porObjetivo: null, demostrada: false }));
    const fechas = [m.leccion?.fecha, ...(m.intentos ?? []).map((i) => i?.fecha)].filter(Number.isFinite);
    d.lecciones[id] = {
      version: m.contenido ?? null, paso,
      vistos: completada ? pasos : pasos.slice(0, paso + 1),
      completada, actividad: fechas.length ? Math.max(...fechas) : null,
      evaluaciones: evaluaciones.slice(-20),
    };
    for (const [ficha, e] of Object.entries(m.estructuras ?? {})) {
      if (!e || typeof e !== 'object') continue;
      d.items[`${id}/identificar:${ficha}`] = {
        caja: Math.max(0, Math.min(Number(e.caja) || 0, INTERVALOS_DIAS.length - 1)),
        aciertos: e.aciertos ?? 0, fallos: e.fallos ?? 0, dudas: e.dudas ?? 0, ultimo: e.ultimo ?? null, proximo: e.proximo ?? ahora,
      };
    }
    migradas.push(id);
  }
  d.migracion = { desde: 1, fecha: ahora, lecciones: migradas };
  return d;
}

// ── Lecciones ──
export function leccion(data, L) {
  const p = (data.lecciones[L.id] ??= { version: L.version, paso: 0, vistos: [], completada: null, actividad: null, evaluaciones: [] });
  p.vistos ??= [];
  p.evaluaciones ??= [];
  return p;
}

/** Anota que se vio un paso (y que la lección se está estudiando ahora). */
export function verPaso(data, L, i, ahora = Date.now()) {
  const p = leccion(data, L);
  p.paso = i;
  p.version = L.version;
  const id = L.pasos[i]?.id;
  if (id && !p.vistos.includes(id)) p.vistos.push(id);
  p.actividad = ahora;
  return p;
}

export function completar(data, L, ahora = Date.now()) {
  const p = leccion(data, L);
  for (const s of L.pasos) if (!p.vistos.includes(s.id)) p.vistos.push(s.id);
  p.completada ??= ahora;
  p.paso = 0;
  p.actividad = ahora;
  return p;
}

/** Vuelve a empezar la lección (no toca evaluaciones ni repasos). */
export function reiniciar(data, L) {
  const p = leccion(data, L);
  p.paso = 0;
  p.vistos = [];
  p.completada = null;
}

/** Borra todo lo de una lección: su avance, sus evaluaciones y sus preguntas del repaso. */
export function borrarLeccion(data, id) {
  delete data.lecciones[id];
  for (const k of Object.keys(data.items)) if (k.startsWith(`${id}/`)) delete data.items[k];
}

// ── Preguntas y repaso espaciado ──
export const itemId = (leccionId, preguntaId) => `${leccionId}/${preguntaId}`;

/** Anota una respuesta. resultado: 'acierto' | 'duda' | 'fallo'. */
export function anotar(data, id, resultado, ahora = Date.now()) {
  const e = (data.items[id] ??= { caja: 0, aciertos: 0, fallos: 0, dudas: 0, ultimo: null, proximo: null });
  const tocaba = e.proximo == null || e.proximo <= ahora;
  if (resultado === 'acierto') {
    e.aciertos++;
    if (tocaba) e.caja = Math.min(e.caja + 1, INTERVALOS_DIAS.length - 1);
  } else if (resultado === 'duda') {
    e.aciertos++;
    e.dudas++;
  } else {
    e.fallos++;
    e.caja = 0;
  }
  e.ultimo = ahora;
  // Un acierto antes de tiempo no adelanta ni retrasa el repaso que ya tocaba.
  if (tocaba || resultado === 'fallo') e.proximo = ahora + INTERVALOS_DIAS[e.caja] * DIA;
  return e;
}

/** Registra una evaluación de una lección: { aciertos, total, porObjetivo }; devuelve si demuestra aprendizaje. */
export function registrarEvaluacion(data, L, { aciertos, total, porObjetivo }, ahora = Date.now()) {
  const p = leccion(data, L);
  const demostrada = total > 0 && aciertos / total >= UMBRAL_DEMOSTRADA && (porObjetivo ?? []).every(([a, t]) => !t || a > 0);
  p.evaluaciones.push({ fecha: ahora, aciertos, total, porObjetivo, demostrada });
  if (p.evaluaciones.length > 20) p.evaluaciones.splice(0, p.evaluaciones.length - 20);
  p.actividad = ahora;
  return demostrada;
}

export function registrarSesion(data, sesion) {
  data.sesiones.push(sesion);
  if (data.sesiones.length > 30) data.sesiones.splice(0, data.sesiones.length - 30);
}

/** Preguntas vencidas, primero las de caja más baja, luego las de más fallos y las que más esperan. `filtro(id)`. */
export function vencidas(data, { ahora = Date.now(), filtro = () => true } = {}) {
  return Object.entries(data.items)
    .filter(([id, e]) => e.proximo != null && e.proximo <= ahora && filtro(id))
    .sort(([, x], [, y]) => x.caja - y.caja || y.fallos - x.fallos || x.proximo - y.proximo)
    .map(([id]) => id);
}

/** Preguntas falladas alguna vez (para «repasar mis errores»), primero las que siguen en la caja 0. */
export function falladas(data, { filtro = () => true } = {}) {
  return Object.entries(data.items).filter(([id, e]) => e.fallos > 0 && filtro(id))
    .sort(([, x], [, y]) => x.caja - y.caja || y.fallos - x.fallos).map(([id]) => id);
}

// ── Estado de una lección ──
/**
 * Estado de una lección del catálogo: { estado, vistos, total, completada, ultima, demostrada, dominio, pendientes,
 * actividad, cambiada }. estado: 'sin-empezar' | 'en-curso' | 'completada' | 'demostrada' | 'dominada'.
 * `L`: { id, version, pasos (número o lista), preguntas (número) }; `idsPreguntas`: ids de su banco si se conocen.
 */
export function estadoLeccion(data, L, { ahora = Date.now(), idsPreguntas = null } = {}) {
  const p = data.lecciones[L.id];
  if (!idsPreguntas && Array.isArray(L.preguntas)) idsPreguntas = L.preguntas.map((q) => q.id);
  const nPasos = Array.isArray(L.pasos) ? L.pasos.length : L.pasos;
  const items = Object.entries(data.items).filter(([k]) => k.startsWith(`${L.id}/`) && (!idsPreguntas || idsPreguntas.includes(k.slice(L.id.length + 1))));
  const pendientes = items.filter(([, e]) => e.proximo != null && e.proximo <= ahora).length;
  const nPreg = idsPreguntas?.length ?? L.preguntas ?? 0;
  const enDominio = items.filter(([, e]) => e.caja >= CAJA_DOMINIO).length;
  const ultima = p?.evaluaciones?.at(-1) ?? null;
  const demostrada = !!p?.evaluaciones?.some((e) => e.demostrada);
  const dominada = nPreg > 0 && enDominio >= nPreg;
  const vistos = Math.min(p?.vistos?.length ?? 0, nPasos);
  const estado = dominada ? 'dominada' : demostrada ? 'demostrada' : p?.completada ? 'completada' : vistos ? 'en-curso' : 'sin-empezar';
  return {
    estado, vistos, total: nPasos, completada: p?.completada ?? null, ultima, demostrada, pendientes,
    dominio: { en: enDominio, de: nPreg }, actividad: p?.actividad ?? null, paso: p?.paso ?? 0,
    cambiada: !!p && p.version != null && p.version !== L.version,
  };
}

export function esFavorito(data, id) {
  return data.favoritos.includes(id);
}

export function alternarFavorito(data, id) {
  const i = data.favoritos.indexOf(id);
  if (i >= 0) data.favoritos.splice(i, 1);
  else data.favoritos.push(id);
  return i < 0;
}
