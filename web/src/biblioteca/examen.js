// Estudiar según el temario y preparar un examen (especificación, sección 20). Sin DOM: lo prueba `npm test`.
//
//  1. interpretar: el temario escrito o pegado (un tema por línea, o separados por «;» o viñetas) se relaciona con las
//     lecciones de la biblioteca (el buscador). Lo que no tiene lección queda como laguna, sin inventar nada. La persona
//     revisa lo interpretado antes de crear el plan.
//  2. planificar: reparte las lecciones elegidas, por sus requisitos, en los días de estudio hasta el día antes del
//     examen (o en dos semanas si no hay fecha: no se inventa una), con repasos espaciados y un repaso final. Si el
//     tiempo no alcanza, lo dice y explica qué entra primero; lo que no cabe se lista para ajustar el plan.
//  3. replanificar: con el progreso de ahora (lo hecho se conserva y no se vuelve a planificar).
// El temario define el alcance académico: no es una fuente anatómica (las lecciones citan las suyas).
// Las fechas son días del calendario local («AAAA-MM-DD»): no se ven afectadas por la zona horaria del servidor.

export const MAX_TEMAS = 40;
export const MAX_TEMA = 120;
export const MINUTOS_DIA = [15, 20, 30, 45, 60, 90];
export const SIN_FECHA_DIAS = 14;
const DIA = 24 * 3600 * 1000;
const FECHA = /^\d{4}-\d{2}-\d{2}$/;

/** Fecha local AAAA-MM-DD de un instante, y al revés (mediodía, para no cambiar de día con el horario de verano). */
export const isoDe = (t) => { const d = new Date(t); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
export const instanteDe = (iso) => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d, 12).getTime(); };
export const sumarDias = (iso, n) => isoDe(instanteDe(iso) + n * DIA);
export const diasEntre = (a, b) => Math.round((instanteDe(b) - instanteDe(a)) / DIA);

/** Los temas de un texto: líneas, «;» o viñetas; sin numeración ni repetidos; como mucho MAX_TEMAS. */
export function temasDe(texto) {
  const vistos = new Set();
  return String(texto ?? '').split(/\r?\n|;|•|·/)
    .map((x) => x.replace(/^\s*(?:[-*–—]|\d+[.)-]|[a-z][.)])\s*/i, '').replace(/\s+/g, ' ').trim().slice(0, MAX_TEMA))
    .filter((x) => x.length >= 2 && !vistos.has(x.toLowerCase()) && vistos.add(x.toLowerCase()))
    .slice(0, MAX_TEMAS);
}

/**
 * Relaciona cada tema con lecciones del catálogo (las tres más pertinentes según el buscador). `buscador`: el de la
 * biblioteca. Devuelve [{ texto, lecciones: [ids], laguna }].
 */
export function interpretar(texto, { buscador }) {
  return temasDe(texto).map((tema) => {
    let lecciones = [];
    try { lecciones = buscador.buscar(tema).lecciones.slice(0, 3).map((L) => L.id); } catch { lecciones = []; }
    return { texto: tema, lecciones, laguna: !lecciones.length };
  });
}

/** ¿Es válida la fecha del examen? (AAAA-MM-DD, hoy o después; si no, no hay fecha). */
export const fechaValida = (f, hoy) => typeof f === 'string' && FECHA.test(f) && !Number.isNaN(instanteDe(f)) && diasEntre(hoy, f) >= 0 && diasEntre(hoy, f) <= 730;

/**
 * El plan. `temas`: [{ texto, lecciones }] (las elegidas); `fecha`: la del examen o null; `minutosDia`; `dias`: días de
 * la semana en que se estudia (0 domingo … 6 sábado); `hoy`: AAAA-MM-DD; `catalogo`: Map id → lección del catálogo;
 * `estado(L)` → { estado, vistos, total } (progreso.js). Devuelve
 *   { dias: [{ fecha, bloques: [{ tipo: 'leccion', id, minutos, parte? } | { tipo: 'repaso', minutos, de: [ids] }
 *           | { tipo: 'final', minutos, de: [ids] }] }],
 *     hechas: [ids], noCaben: [ids], necesarios, disponibles, sinFecha, avisos: [códigos] }
 */
export function planificar({ temas, fecha = null, minutosDia = 30, dias = [1, 2, 3, 4, 5], hoy, catalogo, estado }) {
  const avisos = [];
  const sinFecha = !fechaValida(fecha, hoy);
  if (fecha && sinFecha) avisos.push('fecha-invalida');
  const fin = sinFecha ? sumarDias(hoy, SIN_FECHA_DIAS) : fecha;
  const diasSemana = [...new Set((dias ?? []).filter((d) => Number.isInteger(d) && d >= 0 && d <= 6))];
  if (!diasSemana.length) avisos.push('sin-dias');
  const minutos = MINUTOS_DIA.includes(minutosDia) ? minutosDia : 30;

  // Días de estudio: de hoy al día antes del examen (el día del examen no se estudia en el plan).
  const fechas = [];
  for (let f = hoy; diasEntre(f, fin) > 0; f = sumarDias(f, 1)) if (diasSemana.includes(new Date(instanteDe(f)).getDay())) fechas.push(f);
  if (!fechas.length && !avisos.includes('sin-dias')) avisos.push('sin-tiempo');

  // Lecciones: las de los temas, sin repetir, en el orden de sus requisitos (y del temario).
  const ids = [];
  for (const t of temas) for (const id of t.lecciones ?? []) if (catalogo.has(id) && !ids.includes(id)) ids.push(id);
  const ordenadas = ordenarPorRequisitos(ids, catalogo);
  const hechas = ordenadas.filter((id) => ['completada', 'demostrada', 'dominada'].includes(estado(catalogo.get(id)).estado));
  const pendientes = ordenadas.filter((id) => !hechas.includes(id)).map((id) => {
    const L = catalogo.get(id);
    const e = estado(L);
    return { id, minutos: Math.max(5, Math.round(L.minutos * (1 - (e.vistos ?? 0) / Math.max(e.total ?? 1, 1)))) };
  });

  // Reparto: cada día, primero el repaso de lo que se estudió una y tres sesiones antes (espaciado) y después lecciones
  // nuevas. El último día de estudio se reserva para el repaso final de todo, salvo que así no quepan las lecciones.
  function repartir(conFinal) {
    const plan = fechas.map((f) => ({ fecha: f, bloques: [], libre: minutos }));
    const final = conFinal && plan.length >= 3 ? plan.at(-1) : null;
    const estudiadoEl = new Map();       // índice de día → ids estudiadas
    let k = 0;
    const cola = pendientes.map((x) => ({ ...x }));
    for (let d = 0; d < plan.length; d++) {
      const dia = plan[d];
      if (dia === final) break;
      const repasar = [...(estudiadoEl.get(d - 1) ?? []), ...(estudiadoEl.get(d - 3) ?? [])].filter((id, i, xs) => xs.indexOf(id) === i);
      if (repasar.length) {
        const m = Math.min(dia.libre, Math.max(5, Math.round(minutos * 0.25)));
        dia.bloques.push({ tipo: 'repaso', minutos: m, de: repasar });
        dia.libre -= m;
      }
      while (k < cola.length && dia.libre >= 5) {
        const x = cola[k];
        let m = Math.min(x.minutos, dia.libre);
        // Sin trozos sueltos: si quedarían menos de 5 minutos, se termina hoy; si hoy cabe muy poco, mejor mañana.
        if (x.minutos - m > 0 && x.minutos - m < 5) m = x.minutos;
        else if (m < x.minutos && m < 10) break;
        dia.bloques.push({ tipo: 'leccion', id: x.id, minutos: m, ...(m < x.minutos || x.empezada ? { parte: true } : {}) });
        dia.libre -= m;
        x.minutos -= m;
        x.empezada = true;
        estudiadoEl.set(d, [...(estudiadoEl.get(d) ?? []), x.id]);
        if (x.minutos <= 0) k++;
        else break;   // la lección sigue al día siguiente
      }
    }
    const noCaben = cola.slice(k).map((x) => x.id);
    if (final) final.bloques.push({ tipo: 'final', minutos, de: [...hechas, ...pendientes.map((x) => x.id).filter((id) => !noCaben.includes(id))] });
    return { plan, noCaben, conFinal: !!final };
  }
  let reparto = repartir(true);
  if (reparto.noCaben.length && reparto.conFinal) {
    const sin = repartir(false);
    if (sin.noCaben.length < reparto.noCaben.length) { reparto = sin; avisos.push('sin-repaso-final'); }
  }
  const { plan, noCaben } = reparto;
  // Minutos que hacen falta para las lecciones pendientes y los que hay en los días de estudio.
  const necesarios = pendientes.reduce((n, x) => n + x.minutos, 0);
  const disponibles = fechas.length * minutos;
  if (noCaben.length) avisos.push('no-cabe');
  if (!ids.length) avisos.push('sin-lecciones');
  return {
    dias: plan.filter((d) => d.bloques.length).map(({ fecha: f, bloques }) => ({ fecha: f, bloques })),
    hechas, noCaben, necesarios, disponibles, sinFecha, fin, avisos,
  };
}

/** Ordena unas lecciones para que cada una vaya después de sus requisitos que también estén en la lista. */
export function ordenarPorRequisitos(ids, catalogo) {
  const fuera = [];
  const visitando = new Set();
  const visitar = (id) => {
    if (fuera.includes(id) || visitando.has(id)) return;
    visitando.add(id);
    for (const r of catalogo.get(id)?.requisitos ?? []) if (ids.includes(r)) visitar(r);
    visitando.delete(id);
    fuera.push(id);
  };
  ids.forEach(visitar);
  return fuera;
}

/** Lo que toca hoy en un plan (o el próximo día con estudio), con las lecciones que ya están hechas marcadas. */
export function hoyEnPlan(plan, hoy) {
  return plan?.dias?.find((d) => d.fecha >= hoy) ?? null;
}
