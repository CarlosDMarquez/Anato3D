// Progreso de estudio, guardado solo en este navegador (localStorage). Sin DOM: lo prueba `npm test`.
//
// Formato (versión 1):
//   { version: 1, modulos: { [moduloId]: {
//       contenido: versión del contenido del módulo con la que se guardó,
//       leccion: { paso, completada, fecha },
//       intentos: [{ fecha, tipo: 'evaluacion' | 'repaso', aciertos, total, fallos: [preguntaId] }]   (los 30 últimos)
//       estructuras: { [fichaId]: { caja, aciertos, fallos, dudas, ultimo, proximo } } } } }
//
// Repaso espaciado con cajas (Leitner): un acierto seguro sube una caja; un fallo o «no lo sé» vuelve a la 0; un
// acierto con duda se queda en su caja. Cada caja tiene su intervalo hasta el próximo repaso.
// - Rendimiento reciente: el último intento (aciertos / total).
// - Dominio a largo plazo: estructuras en la caja 3 o más (acertadas varias veces, con días de separación).
// Si el contenido del módulo cambia, el progreso de las estructuras que siguen existiendo se conserva; el de las que
// desaparecen se ignora (no se borra). Si se borran los datos del navegador, el progreso se pierde.

export const VERSION = 1;
export const STORAGE_KEY = 'anato3d.progreso';
export const INTERVALOS_DIAS = [0, 1, 3, 7, 21];      // caja → días hasta el próximo repaso
export const CAJA_DOMINIO = 3;
const DIA = 24 * 3600 * 1000;

export function vacio() {
  return { version: VERSION, modulos: {} };
}

/** Lee el progreso; si no hay, está dañado o es de otra versión de formato, empieza de cero (sin tocar lo guardado). */
export function cargar(storage) {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (!raw) return vacio();
    const data = JSON.parse(raw);
    if (data?.version !== VERSION || typeof data.modulos !== 'object') return vacio();
    return data;
  } catch {
    return vacio();
  }
}

/** Guarda; devuelve false si el navegador no lo permite (modo privado, almacenamiento lleno o bloqueado). */
export function guardar(storage, data) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function modulo(data, modulo) {
  const m = (data.modulos[modulo.id] ??= { contenido: modulo.version, leccion: { paso: 0, completada: false, fecha: null }, intentos: [], estructuras: {} });
  m.leccion ??= { paso: 0, completada: false, fecha: null };
  m.intentos ??= [];
  m.estructuras ??= {};
  return m;
}

/** ¿Cambió el contenido desde que se guardó este progreso? */
export function contenidoCambiado(data, mod) {
  const m = data.modulos[mod.id];
  return !!m && m.contenido !== mod.version;
}

/**
 * Anota la respuesta a una pregunta sobre `fichaId`. resultado: 'acierto' | 'duda' (acierto inseguro) | 'fallo'
 * (incluye «no lo sé»).
 */
export function anotar(m, fichaId, resultado, ahora = Date.now()) {
  const e = (m.estructuras[fichaId] ??= { caja: 0, aciertos: 0, fallos: 0, dudas: 0, ultimo: null, proximo: null });
  if (resultado === 'acierto') { e.aciertos++; e.caja = Math.min(e.caja + 1, INTERVALOS_DIAS.length - 1); }
  else if (resultado === 'duda') { e.aciertos++; e.dudas++; }
  else { e.fallos++; e.caja = 0; }
  e.ultimo = ahora;
  e.proximo = ahora + INTERVALOS_DIAS[e.caja] * DIA;
  return e;
}

export function registrarIntento(m, intento) {
  m.intentos.push(intento);
  if (m.intentos.length > 30) m.intentos.splice(0, m.intentos.length - 30);
}

/**
 * Cola de repaso: estructuras del módulo vistas alguna vez y con el repaso vencido. Primero las de caja más baja (lo
 * fallado), luego las de más fallos, luego las que llevan más tiempo esperando. Ignora fichas que ya no existen.
 */
export function colaRepaso(m, ids, ahora = Date.now()) {
  return ids
    .filter((id) => m.estructuras[id] && m.estructuras[id].proximo <= ahora)
    .sort((a, b) => {
      const x = m.estructuras[a], y = m.estructuras[b];
      return x.caja - y.caja || y.fallos - x.fallos || x.proximo - y.proximo;
    });
}

/**
 * Estructuras que pueden volver al repaso: las evaluables y las de contexto (estas entran si se falla una pregunta de
 * texto que las tiene como ficha principal). El botón «Repasar (n)» y el repaso usan esta misma lista.
 */
export const repasables = (mod) => [...mod.nucleo, ...(mod.contexto ?? [])];

/** Resumen para la portada del módulo: rendimiento reciente y dominio a largo plazo, por separado. */
export function resumen(m, mod, ahora = Date.now()) {
  const ids = mod.nucleo;                                    // el dominio y lo visto se cuentan sobre lo evaluable
  const ultimo = [...m.intentos].reverse().find((i) => i.tipo === 'evaluacion') ?? null;
  return {
    leccion: m.leccion,
    ultimo,                                                   // rendimiento reciente
    dominadas: ids.filter((id) => (m.estructuras[id]?.caja ?? 0) >= CAJA_DOMINIO).length,  // dominio a largo plazo
    vistas: ids.filter((id) => m.estructuras[id]).length,
    total: ids.length,
    pendientes: colaRepaso(m, repasables(mod), ahora).length,
  };
}

/** Reinicia solo la lección (no toca evaluaciones ni repasos). */
export function reiniciarLeccion(m) {
  m.leccion = { paso: 0, completada: false, fecha: null };
}

/** Borra todo el progreso de un módulo (y solo de ese módulo). */
export function borrarModulo(data, moduloId) {
  delete data.modulos[moduloId];
}
