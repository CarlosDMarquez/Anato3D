// Sesiones de estudio de la biblioteca: la propuesta según el tiempo disponible y las sesiones de práctica (repaso de lo
// vencido, de los errores, de una región o un sistema, e identificación 3D sin etiquetas). Sin DOM: lo prueba `npm test`.
import * as P from './progreso.js';

export const MIN_POR_PREGUNTA = 0.75;        // lo que se tarda, de media, en una pregunta de repaso

/**
 * Propuesta para `minutos`: primero lo que toca repasar (sin pasar del 40 % del tiempo si hay lecciones por hacer),
 * luego la lección empezada y después las siguientes recomendadas que caben. Devuelve [{ tipo, … , minutos }]:
 *   { tipo: 'repaso', preguntas, minutos }   { tipo: 'leccion', id, motivo: 'seguir' | 'siguiente', minutos }
 * `catalogo`: lecciones del catálogo (con `orden`); `terminada(id)`; `modelo` para no proponer lo que no está en él.
 */
export function proponer({ minutos, catalogo, data, modelo = 'male', ahora = Date.now() }) {
  const bloques = [];
  let queda = minutos;
  const estado = (L) => P.estadoLeccion(data, L, { ahora });
  const disponibles = catalogo.filter((L) => L.modelos.includes(modelo));
  const vencidas = P.vencidas(data, { ahora, filtro: (id) => disponibles.some((L) => id.startsWith(`${L.id}/`)) });
  const porHacer = disponibles.filter((L) => !['completada', 'demostrada', 'dominada'].includes(estado(L).estado));
  if (vencidas.length) {
    const tope = porHacer.length ? Math.max(MIN_POR_PREGUNTA * 4, queda * 0.4) : queda;
    const n = Math.max(1, Math.min(vencidas.length, Math.floor(tope / MIN_POR_PREGUNTA)));
    bloques.push({ tipo: 'repaso', preguntas: n, minutos: Math.ceil(n * MIN_POR_PREGUNTA) });
    queda -= Math.ceil(n * MIN_POR_PREGUNTA);
  }
  const terminada = (id) => ['completada', 'demostrada', 'dominada'].includes(estado({ id, pasos: 1, preguntas: 0 }).estado)
    || !!data.lecciones[id]?.completada;
  const restante = (L) => {
    const e = estado(L);
    return Math.max(2, Math.round(L.minutos * (1 - e.vistos / Math.max(e.total, 1))));
  };
  // La empezada más reciente, aunque no quepa entera (se sigue donde se dejó).
  const enCurso = porHacer.filter((L) => estado(L).estado === 'en-curso').sort((a, b) => (estado(b).actividad ?? 0) - (estado(a).actividad ?? 0));
  if (enCurso[0] && queda > 0) {
    const m = Math.min(restante(enCurso[0]), Math.max(queda, 2));
    bloques.push({ tipo: 'leccion', id: enCurso[0].id, motivo: 'seguir', minutos: m });
    queda -= m;
  }
  // Las siguientes: requisitos hechos, por el orden del plan, que quepan.
  const siguientes = porHacer.filter((L) => !bloques.some((b) => b.id === L.id) && estado(L).estado === 'sin-empezar')
    .sort((a, b) => ((a.requisitos ?? []).every(terminada) ? 0 : 1) - ((b.requisitos ?? []).every(terminada) ? 0 : 1) || (a.orden ?? 999) - (b.orden ?? 999));
  for (const L of siguientes) {
    if (queda < 3) break;
    if (L.minutos <= queda + 2) {
      bloques.push({ tipo: 'leccion', id: L.id, motivo: 'siguiente', minutos: L.minutos });
      queda -= L.minutos;
    }
  }
  return bloques;
}

/**
 * Ítems para una sesión de práctica:
 *   'vencidas'   lo que toca repasar (acumulativo: de todas las lecciones estudiadas)
 *   'errores'    lo que se ha fallado alguna vez, primero lo que sigue sin consolidar
 *   'region' / 'sistema'   lo estudiado de esas lecciones: primero lo vencido y lo fallado, luego lo menos consolidado
 * `lecciones`: ids que entran (para región o sistema). Devuelve ids de ítem, hasta `max`.
 */
export function itemsDePractica(data, tipo, { lecciones = null, max = 12, ahora = Date.now() } = {}) {
  const dentro = (id) => !lecciones || lecciones.includes(id.slice(0, id.indexOf('/')));
  if (tipo === 'vencidas') return P.vencidas(data, { ahora, filtro: dentro }).slice(0, max);
  if (tipo === 'errores') return P.falladas(data, { filtro: dentro }).slice(0, max);
  const todos = Object.entries(data.items).filter(([id]) => dentro(id));
  const vencidas = new Set(P.vencidas(data, { ahora, filtro: dentro }));
  return todos.sort(([a, x], [b, y]) => (vencidas.has(b) - vencidas.has(a)) || (y.fallos > 0) - (x.fallos > 0) || x.caja - y.caja || (x.ultimo ?? 0) - (y.ultimo ?? 0))
    .slice(0, max).map(([id]) => id);
}
