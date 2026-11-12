// Progreso de la biblioteca de estudio, guardado solo en este navegador (localStorage). Sin DOM: lo prueba `npm test`.
//
// Formato (versión 2), en la clave `anato3d.biblioteca`:
//   { version: 2,
//     lecciones: { [id]: { version, paso, vistos: [ids de paso], completada: fecha | null, actividad: fecha,
//                          evaluaciones: [{ fecha, aciertos, total, porObjetivo: [[aciertos, total]…], demostrada }] (20 últimas) } },
//     items: { [leccion/pregunta]: { caja, aciertos, fallos, dudas, ultimo, proximo } },
//     favoritos: [ids de lección o de recorrido],
//     sesiones: [{ fecha, tipo, aciertos, total }] (30 últimas),
//     intentos: [{ f, l, v, q, t, h, o, e, r, x, d, m }] (los MAX_INTENTOS últimos; ver registrarIntento),
//     preferencias: { nivel, minutos, intereses: [ids de región o sistema] } (todo opcional),
//     examen: { temario, fecha, minutosDia, dias, temas: [{ texto, lecciones, elegidas, laguna }], creado, actualizado } | null,
//     migracion: { desde: 1, fecha, lecciones } | null }
//   y en cada ítem, además, `aplazado` (fecha hasta la que no se propone) cuando la persona aplaza un repaso.
// Los campos nuevos (intentos, preferencias, aplazado) se añadieron sin cambiar de versión: una versión anterior de la
// app los ignora y, al guardar, los conserva (guarda el objeto entero que leyó).
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
/** Progreso guardado que no se pudo leer (dañado o de una versión más nueva): se aparta aquí antes de escribir. */
export const CLAVE_APARTADO = 'anato3d.biblioteca.apartado';
export const INTERVALOS_DIAS = [0, 1, 3, 7, 21];
export const CAJA_DOMINIO = 3;
export const UMBRAL_DEMOSTRADA = 0.8;
export const MAX_INTENTOS = 600;
/** Una pregunta fallada hace menos de esto no se repite tal cual (se practica otra del mismo objetivo o se espera). */
export const RECIENTE_MS = 10 * 60 * 1000;
const DIA = 24 * 3600 * 1000;
/** Habilidad observable que comprueba cada tipo de pregunta (especificación, sección 10). */
export const HABILIDAD = { identificar: 'reconocer', localizar: 'localizar', relacion: 'relacionar', secuencia: 'relacionar', funcion: 'explicar', comparacion: 'comparar' };
export const HABILIDADES = ['reconocer', 'localizar', 'relacionar', 'explicar', 'comparar'];

export function vacio() {
  return { version: VERSION, lecciones: {}, items: {}, favoritos: [], sesiones: [], intentos: [], preferencias: null, migracion: null };
}

function valido(d) {
  return d && d.version === VERSION && typeof d.lecciones === 'object' && typeof d.items === 'object';
}

/**
 * Lee el progreso. Sin progreso nuevo y con uno de la versión 1, lo migra (`lecciones`: Map id → lección, para saber
 * los pasos de cada módulo). Datos dañados o de otra versión: empieza de cero, y lo guardado se copia antes, tal cual,
 * a CLAVE_APARTADO (así al guardar después no se pierde); `apartado` lo dice para avisar.
 */
export function cargar(storage, { lecciones = new Map(), ahora = Date.now() } = {}) {
  let raw = null;
  try {
    raw = storage?.getItem(CLAVE);
    if (raw) {
      let d = null;
      try { d = JSON.parse(raw); } catch { d = null; }
      if (!valido(d)) return apartarYEmpezar(storage, raw, ahora);
      d.favoritos ??= [];
      d.sesiones ??= [];
      if (!Array.isArray(d.intentos)) d.intentos = [];
      d.preferencias = limpiarPreferencias(d.preferencias);
      // El plan de examen (src/biblioteca/examen.js): si no tiene la forma esperada, no se usa.
      if (d.examen && !(typeof d.examen === 'object' && Array.isArray(d.examen.temas) && Array.isArray(d.examen.dias))) d.examen = null;
      return d;
    }
    const v1 = storage?.getItem(CLAVE_V1);
    if (v1) {
      const d = migrarV1(JSON.parse(v1), lecciones, ahora);
      if (d) return d;
    }
  } catch { /* almacenamiento bloqueado */ }
  return vacio();
}

function apartarYEmpezar(storage, raw, ahora) {
  const d = vacio();
  try {
    const previo = storage.getItem(CLAVE_APARTADO);
    if (!previo || JSON.parse(previo)?.texto !== raw) storage.setItem(CLAVE_APARTADO, JSON.stringify({ texto: raw, fecha: ahora }));
    d.apartado = ahora;
  } catch { d.apartado = null; d.sinApartar = true; }
  return d;
}

/**
 * Guarda; false si el navegador no lo permite (modo privado, almacenamiento lleno o bloqueado) o si el progreso que
 * había no se pudo poner a salvo antes (`sinApartar`): entonces no se escribe encima.
 */
export function guardar(storage, data) {
  if (data.sinApartar) return false;
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

/**
 * Registra un intento (lo que pasó al responder una pregunta), además de anotarlo en su ítem con `anotar`:
 *   f fecha · l lección · v versión del contenido · q pregunta · t tipo de tarea · h habilidad · o objetivo (índice)
 *   e estructura de la pregunta (si es de una) · r resultado: acierto | duda | fallo | tecnico (no se pudo mostrar o
 *     seleccionar: no cuenta como desconocimiento) · x lo elegido si falló (la estructura tocada, el texto de la opción
 *     o «no-lo-se») · d dudó · m modo: evaluacion | repaso | practica | leccion
 */
export function registrarIntento(data, { leccion, version = null, pregunta, tipo, objetivo = null, estructura = null, resultado, elegida = null, dudo = false, modo = 'practica', huella = null, ayuda = null }, ahora = Date.now()) {
  if (!Array.isArray(data.intentos)) data.intentos = [];
  const i = { f: ahora, l: leccion, v: version, q: pregunta, t: tipo, h: HABILIDAD[tipo] ?? null, o: objetivo, e: estructura, r: resultado, x: resultado === 'fallo' ? elegida : null, d: !!dudo, m: modo };
  if (huella) i.qh = huella;
  if (ayuda) i.a = ayuda;
  data.intentos.push(i);
  if (data.intentos.length > MAX_INTENTOS) data.intentos.splice(0, data.intentos.length - MAX_INTENTOS);
  return i;
}

const itemNuevo = () => ({ caja: 0, aciertos: 0, fallos: 0, dudas: 0, ultimo: null, proximo: null });

/**
 * Anota una respuesta. resultado: 'acierto' | 'duda' | 'fallo'. `huella`: la de la pregunta (evaluar.js); si la
 * pregunta cambió desde la última vez (se corrigió), lo anterior no cuenta: el ítem empieza de nuevo.
 */
export function anotar(data, id, resultado, ahora = Date.now(), { huella = null } = {}) {
  if (huella && data.items[id]?.qh && data.items[id].qh !== huella) data.items[id] = itemNuevo();
  const e = (data.items[id] ??= itemNuevo());
  if (huella) e.qh = huella;
  delete e.huerfana;
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

/**
 * Registra una evaluación de una lección: { aciertos, total, porObjetivo, sinEvaluar }; devuelve si demuestra
 * aprendizaje. `sinEvaluar`: índices de los objetivos que no se pudieron evaluar por una limitación conocida del modelo
 * (evaluar.js, planEvaluacion): no se dan por cumplidos, así que con alguno la evaluación no demuestra la lección.
 */
export function registrarEvaluacion(data, L, { aciertos, total, porObjetivo, sinEvaluar = [] }, ahora = Date.now()) {
  const p = leccion(data, L);
  const demostrada = total > 0 && aciertos / total >= UMBRAL_DEMOSTRADA && (porObjetivo ?? []).every(([a, t]) => !t || a > 0) && !sinEvaluar.length;
  p.evaluaciones.push({ fecha: ahora, aciertos, total, porObjetivo, demostrada, ...(sinEvaluar.length ? { sinEvaluar: [...sinEvaluar] } : {}) });
  if (p.evaluaciones.length > 20) p.evaluaciones.splice(0, p.evaluaciones.length - 20);
  p.actividad = ahora;
  return demostrada;
}

export function registrarSesion(data, sesion) {
  data.sesiones.push(sesion);
  if (data.sesiones.length > 30) data.sesiones.splice(0, data.sesiones.length - 30);
}

/** ¿Está aplazado este ítem? (la persona pidió no repasarlo hasta una fecha). */
export const aplazado = (e, ahora = Date.now()) => e?.aplazado != null && e.aplazado > ahora;

/**
 * Preguntas vencidas, primero las de caja más baja, luego las de más fallos y las que más esperan. `filtro(id)`. Lo
 * aplazado no entra hasta su fecha (salvo `conAplazadas`).
 */
export function vencidas(data, { ahora = Date.now(), filtro = () => true, conAplazadas = false } = {}) {
  return Object.entries(data.items)
    .filter(([id, e]) => e.proximo != null && e.proximo <= ahora && !e.huerfana && (conAplazadas || !aplazado(e, ahora)) && filtro(id))
    .sort(([, x], [, y]) => x.caja - y.caja || y.fallos - x.fallos || x.proximo - y.proximo)
    .map(([id]) => id);
}

/** Preguntas falladas alguna vez (para «repasar mis errores»), primero las que siguen en la caja 0. */
export function falladas(data, { filtro = () => true, ahora = Date.now() } = {}) {
  return Object.entries(data.items).filter(([id, e]) => e.fallos > 0 && !e.huerfana && !aplazado(e, ahora) && filtro(id))
    .sort(([, x], [, y]) => x.caja - y.caja || y.fallos - x.fallos).map(([id]) => id);
}

// ── Estado de una lección ──
/**
 * Estado de una lección del catálogo: { estado, vistos, total, completada, ultima, demostrada, dominio, pendientes,
 * actividad, cambiada }. estado: 'sin-empezar' | 'en-curso' | 'completada' | 'demostrada' | 'dominada'.
 * `L`: { id, version, pasos (número o lista), preguntas (número) }; `idsPreguntas`: ids de su banco si se conocen.
 * Si se conoce la lección entera (evaluar.js, noEvaluables): `excluidas`, las preguntas que en este modelo no se hacen
 * (no cuentan para el dominio), y `sinEvaluar`, cuántos objetivos se quedan sin ninguna (sin ellos no hay dominio).
 * Lo huérfano (preguntas retiradas, quitadas o que el modelo muestra mal) no está pendiente de repaso.
 */
export function estadoLeccion(data, L, { ahora = Date.now(), idsPreguntas = null, excluidas = null, sinEvaluar = 0 } = {}) {
  const p = data.lecciones[L.id];
  if (!idsPreguntas && Array.isArray(L.preguntas)) idsPreguntas = L.preguntas.map((q) => q.id);
  if (idsPreguntas && excluidas?.size) idsPreguntas = idsPreguntas.filter((id) => !excluidas.has(id));
  const nPasos = Array.isArray(L.pasos) ? L.pasos.length : L.pasos;
  const items = Object.entries(data.items).filter(([k]) => k.startsWith(`${L.id}/`) && (!idsPreguntas || idsPreguntas.includes(k.slice(L.id.length + 1))));
  const pendientes = items.filter(([, e]) => e.proximo != null && e.proximo <= ahora && !e.huerfana).length;
  const nPreg = idsPreguntas?.length ?? L.preguntas ?? 0;
  const enDominio = items.filter(([, e]) => e.caja >= CAJA_DOMINIO).length;
  const ultima = p?.evaluaciones?.at(-1) ?? null;
  const demostrada = !!p?.evaluaciones?.some((e) => e.demostrada);
  const dominada = nPreg > 0 && enDominio >= nPreg && !sinEvaluar;
  const vistos = Math.min(p?.vistos?.length ?? 0, nPasos);
  const estado = dominada ? 'dominada' : demostrada ? 'demostrada' : p?.completada ? 'completada' : vistos ? 'en-curso' : 'sin-empezar';
  return {
    estado, vistos, total: nPasos, completada: p?.completada ?? null, ultima, demostrada, pendientes,
    dominio: { en: enDominio, de: nPreg }, actividad: p?.actividad ?? null, paso: p?.paso ?? 0,
    cambiada: !!p && p.version != null && p.version !== L.version,
  };
}

/**
 * Al cargar una lección: las preguntas que se corrigieron (otra huella) empiezan de nuevo, sin sus fallos; las que ya
 * no existen, están retiradas o no se pueden hacer por una limitación conocida del modelo quedan «huérfanas» (no se
 * repasan ni cuentan, pero se conservan; si vuelven, se recuperan). `huellaDe(q)` y `retirada(id, q)`: de evaluar.js
 * (la interfaz incluye ahí las limitaciones). Devuelve cuántos ítems cambió.
 */
export function depurar(data, L, huellaDe, retirada = () => false) {
  const preguntas = new Map((L.preguntas ?? []).map((q) => [q.id, q]));
  let n = 0;
  for (const [id, e] of Object.entries(data.items)) {
    if (!id.startsWith(`${L.id}/`)) continue;
    const q = preguntas.get(id.slice(L.id.length + 1));
    if (!q || retirada(q.id, q)) { if (!e.huerfana) { e.huerfana = true; n++; } continue; }
    if (e.huerfana) { delete e.huerfana; n++; }
    const h = huellaDe(q);
    if (e.qh && e.qh !== h) { data.items[id] = { ...itemNuevo(), qh: h }; n++; }
  }
  return n;
}

// ── Aplazar y retomar ──
/** Aplaza unos ítems `dias` días (sin tocar su caja ni cuándo tocaban): no se proponen hasta entonces. */
export function aplazar(data, ids, dias = 1, ahora = Date.now()) {
  const hasta = ahora + Math.max(1, Math.min(30, Math.round(dias))) * DIA;
  let n = 0;
  for (const id of ids) { const e = data.items[id]; if (e) { e.aplazado = hasta; n++; } }
  return { n, hasta };
}

/** Retoma lo aplazado (todo, o esos ítems): vuelve a proponerse según tocaba. */
export function retomar(data, ids = null, ahora = Date.now()) {
  let n = 0;
  for (const [id, e] of Object.entries(data.items)) {
    if ((!ids || ids.includes(id)) && aplazado(e, ahora)) { delete e.aplazado; n++; }
  }
  return n;
}

/** Lo aplazado ahora: [{ id, hasta }], lo que antes vuelve, primero. */
export function aplazados(data, ahora = Date.now()) {
  return Object.entries(data.items).filter(([, e]) => aplazado(e, ahora)).map(([id, e]) => ({ id, hasta: e.aplazado })).sort((a, b) => a.hasta - b.hasta);
}

/** ¿Se falló esta pregunta hace muy poco? (entonces no se repite tal cual). */
export function recienFallada(data, id, ahora = Date.now()) {
  const pregunta = id.slice(id.indexOf('/') + 1);
  const leccion = id.slice(0, id.indexOf('/'));
  for (let k = (data.intentos?.length ?? 0) - 1; k >= 0; k--) {
    const i = data.intentos[k];
    if (ahora - i.f > RECIENTE_MS) break;
    if (i.l === leccion && i.q === pregunta) return i.r === 'fallo';
  }
  return false;
}

// ── Preferencias (opcionales) ──
export const NIVELES_PREF = [1, 2, 3];
export const MINUTOS_PREF = [10, 15, 20, 30, 45];
/** Preferencias válidas (o null): nivel 1–3, minutos de una sesión y hasta 8 intereses (regiones o sistemas). */
export function limpiarPreferencias(p) {
  if (!p || typeof p !== 'object') return null;
  const nivel = NIVELES_PREF.includes(p.nivel) ? p.nivel : null;
  const minutos = MINUTOS_PREF.includes(p.minutos) ? p.minutos : null;
  const intereses = Array.isArray(p.intereses) ? [...new Set(p.intereses.filter((x) => typeof x === 'string' && /^[a-z0-9-]{2,40}$/.test(x)))].slice(0, 8) : [];
  return nivel || minutos || intereses.length ? { nivel, minutos, intereses } : null;
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
