// Mapa personal de aprendizaje (especificación, sección 10): qué habilidades se han demostrado, qué cuesta y por qué se
// propone repasar algo. Se calcula con los intentos registrados y el repaso espaciado (progreso.js). Sin DOM: lo
// prueba `npm test`.
//
// Lo que cuenta como evidencia: las respuestas en evaluaciones, repasos y prácticas. No cuentan las comprobaciones
// dentro de una lección (se responden con el contenido a la vista), ni lo que no se pudo mostrar o seleccionar en el
// modelo (técnico), ni abrir o tener abierta una lección.
//
// Estados de una habilidad (reconocer, localizar, relacionar, explicar, comparar):
//   sin-datos     aún no hay respuestas de ese tipo;
//   practicando   hay respuestas, pero no bastan o no salen bien;
//   demostrada    en las últimas respuestas (al menos MIN_RECIENTES), el 80 % o más bien;
//   consolidada   demostrada y, además, al menos MIN_CONSOLIDADAS preguntas de esa habilidad aguantaron el repaso
//                 espaciado (caja 3 o más: acertadas en días distintos). Un acierto aislado nunca basta.
import * as P from './progreso.js';

export const MIN_RECIENTES = 3;
export const VENTANA = 10;
export const MIN_CONSOLIDADAS = 3;
const CUENTAN = new Set(['evaluacion', 'repaso', 'practica']);
const DIA = 24 * 3600 * 1000;

/** ¿Es este intento evidencia de lo que se sabe? */
export const cuenta = (i) => CUENTAN.has(i.m) && ['acierto', 'duda', 'fallo'].includes(i.r);

/**
 * El mapa. `catalogo`: lecciones del catálogo (para contar lecciones y no hablar de lo que ya no existe);
 * `invalida(intento)`: si un intento ya no vale (su pregunta se corrigió o se retiró); `estado(L)`: el estado de una
 * lección como lo enseñan las tarjetas (en la app, ctx.estado, que tiene en cuenta las limitaciones del modelo).
 * Devuelve { habilidades, lecciones, dificultades, repasos, tecnicos }.
 */
export function calcularMapa(data, { catalogo = [], ahora = Date.now(), invalida = () => false, estado = null } = {}) {
  const existe = new Set(catalogo.map((L) => L.id));
  // `invalida(i)`: intentos de preguntas que se corrigieron o retiraron (no cuentan contra el estudiante).
  const intentos = (data.intentos ?? []).filter((i) => existe.has(i.l) && !invalida(i));
  const validos = intentos.filter(cuenta);

  // Habilidades
  const habilidades = P.HABILIDADES.map((h) => {
    const de = validos.filter((i) => i.h === h);
    const recientes = de.slice(-VENTANA);
    const bien = (xs) => xs.filter((i) => i.r !== 'fallo').length;
    const items = Object.entries(data.items).filter(([id]) => existe.has(id.slice(0, id.indexOf('/'))))
      .filter(([id]) => de.some((i) => `${i.l}/${i.q}` === id));
    const consolidadas = items.filter(([, e]) => e.caja >= P.CAJA_DOMINIO).length;
    const ratio = recientes.length ? bien(recientes) / recientes.length : 0;
    const demostrada = recientes.length >= MIN_RECIENTES && ratio >= P.UMBRAL_DEMOSTRADA;
    const estado = !de.length ? 'sin-datos' : demostrada && consolidadas >= MIN_CONSOLIDADAS ? 'consolidada' : demostrada ? 'demostrada' : 'practicando';
    return { id: h, estado, intentos: de.length, aciertos: bien(de), recientes: { n: recientes.length, aciertos: bien(recientes) }, preguntas: items.length, consolidadas };
  });

  // Lecciones: visitadas, terminadas, con aprendizaje demostrado y consolidadas (cada cosa por separado).
  const lecciones = { visitadas: 0, completadas: 0, demostradas: 0, dominadas: 0 };
  for (const L of catalogo) {
    const e = (estado ? estado(L) : P.estadoLeccion(data, L, { ahora })).estado;
    if (e !== 'sin-empezar') lecciones.visitadas++;
    if (['completada', 'demostrada', 'dominada'].includes(e)) lecciones.completadas++;
    if (['demostrada', 'dominada'].includes(e)) lecciones.demostradas++;
    if (e === 'dominada') lecciones.dominadas++;
  }

  // Dificultades: preguntas falladas que aún no se han consolidado, la más reciente primero, con el último error.
  const ultimoFallo = new Map();
  for (const i of validos) if (i.r === 'fallo') ultimoFallo.set(`${i.l}/${i.q}`, i);
  const dificultades = [...ultimoFallo.entries()]
    .map(([id, i]) => ({ id, e: data.items[id], i }))
    .filter(({ e }) => e && !e.huerfana && e.caja < P.CAJA_DOMINIO)
    .sort((a, b) => b.i.f - a.i.f)
    .map(({ id, e, i }) => ({
      item: id, leccion: i.l, pregunta: i.q, tipo: i.t, habilidad: i.h, estructura: i.e, objetivo: i.o,
      fallos: e.fallos, fecha: i.f, elegida: i.x, aplazado: P.aplazado(e, ahora) ? e.aplazado : null,
      motivo: i.x === 'no-lo-se' ? 'nolose' : i.x ? 'confusion' : 'fallo',
    }));

  const vencidas = P.vencidas(data, { ahora, filtro: (id) => existe.has(id.slice(0, id.indexOf('/'))) });
  return {
    habilidades, lecciones, dificultades,
    repasos: { vencidas: vencidas.length, aplazados: P.aplazados(data, ahora).filter((a) => existe.has(a.id.slice(0, a.id.indexOf('/')))) },
    tecnicos: intentos.filter((i) => i.r === 'tecnico').length,
    intentos: validos.length,
  };
}

/** Cuándo fue algo, para explicarlo: 'hoy', 'ayer' o 'dia' (con la fecha). Por días del calendario local. */
export function cuando(fecha, ahora = Date.now()) {
  const dia = (t) => { const d = new Date(t); return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); };
  const n = Math.round((dia(ahora) - dia(fecha)) / DIA);
  return n <= 0 ? 'hoy' : n === 1 ? 'ayer' : 'dia';
}
