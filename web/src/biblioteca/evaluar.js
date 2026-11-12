// Preguntas de la biblioteca: de una pregunta del banco de una lección (formato.js) a la pregunta que se muestra, y su
// corrección. Sin DOM: lo prueba `npm test`.
//   identificar  la estructura se resalta en 3D sin nombre y se elige su nombre entre cuatro (distractores del mismo tipo)
//   localizar    se pide tocar la estructura en el modelo, entre varias candidatas que se muestran a la vez
//   relacion, funcion, comparacion  opción múltiple con su explicación y la cita que la respalda
//   secuencia    ordenar elementos (un recorrido arterial, las capas de un compartimento…)
// Siempre hay «No lo sé», que cuenta como fallo: lo que no se sabe vuelve antes al repaso.
// Nunca se pregunta lo que no se puede mostrar: una pregunta sobre una estructura que no existe en el modelo actual se
// salta (y la app lo explica), no se cuenta como fallo. Tampoco lo que el modelo muestra mal (src/data/limitaciones.js):
// una pieza fuera de sitio o de nombre dudoso no se resalta para identificarla, no se pide tocar ni se ofrece para tocar,
// y su nombre no sale como opción errónea. Se decide pieza a pieza (formato.js, estructuraUtil).
import { distractoresIdentificar, estructurasDePregunta, estructuraUtil } from './formato.js';
import { itemId } from './progreso.js';
import { normalizar, distancia } from './buscar.js';
import { RETIRADAS } from './retiradas.js';

export const NO_LO_SE = 'no-lo-se';

/**
 * Huella de una pregunta: cambia si cambia lo que pregunta o su respuesta (enunciado, opciones, estructura, orden). Si
 * una pregunta se corrige, sus fallos anteriores dejan de contar contra el estudiante (progreso.js, anotar).
 */
export function huella(q) {
  const base = JSON.stringify([q.tipo, q.enunciado ?? null, q.correcta ?? null, [...(q.distractores ?? [])].sort(), q.estructura ?? null, q.orden ?? null, [...(q.candidatas ?? [])].sort()]);
  let h = 5381;
  for (let i = 0; i < base.length; i++) h = ((h * 33) ^ base.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

/** ¿Está retirada esta pregunta (o su lección) mientras se revisa? (src/biblioteca/retiradas.js). */
export const retirada = (leccionId, preguntaId = null) => RETIRADAS.lecciones.includes(leccionId) || (preguntaId != null && RETIRADAS.preguntas.includes(`${leccionId}/${preguntaId}`));

export function rngConSemilla(semilla = 1) {
  let s = semilla >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

export function barajar(lista, rng = Math.random) {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Candidatas de una localización que se pueden ofrecer para tocar en este modelo (sin las que el modelo muestra mal). */
export const candidatasUtiles = (L, q, modelo) => (q.candidatas ?? []).filter((id) => estructuraUtil(L.estructuras[id], modelo, 'localizar'));

/** Nombres para elegir en una identificación, sin los de estructuras que en este modelo están mal (src/data/limitaciones.js). */
export function distractoresUtiles(L, eid, modelo) {
  const fuera = new Set(Object.values(L.estructuras).filter((x) => !estructuraUtil(x, modelo, 'distractor')).map((x) => x.nombre));
  return distractoresIdentificar(L, eid).filter((n) => !fuera.has(n));
}

/**
 * Por qué no se puede hacer esta pregunta en este modelo, o null si se puede:
 *   'retirada'    está retirada mientras se revisa un reporte (retiradas.js);
 *   'modelo'      alguna de sus estructuras no existe en este modelo;
 *   'limitacion'  pide ver o tocar lo que el modelo muestra mal (src/data/limitaciones.js): todas las piezas de lo que
 *                 se identifica o se localiza, todas las candidatas de una localización, o los nombres que habría que
 *                 ofrecer en una identificación (quedarían menos de dos). Las preguntas de texto nunca.
 * Sin modelo (null), las limitaciones de cualquiera.
 */
export function motivoNoDisponible(L, q, modelo) {
  if (retirada(L.id, q.id)) return 'retirada';
  const modelos = (e) => L.estructuras[e]?.modelos ?? L.modelos;
  const ids = q.tipo === 'localizar' ? [q.estructura, ...(q.candidatas ?? [])] : estructurasDePregunta(q);
  if (q.tipo === 'identificar' || q.tipo === 'localizar') {
    if (!ids.every((e) => modelos(e).includes(modelo))) return 'modelo';
    if (!estructuraUtil(L.estructuras[q.estructura], modelo, q.tipo)) return 'limitacion';
    if (q.tipo === 'localizar' && q.candidatas?.length && !candidatasUtiles(L, q, modelo).length) return 'limitacion';
    if (q.tipo === 'identificar') {
      const utiles = distractoresUtiles(L, q.estructura, modelo).length;
      if (utiles < 2 && utiles < distractoresIdentificar(L, q.estructura).length) return 'limitacion';
    }
    return null;
  }
  return ids.length === 0 || ids.some((e) => modelos(e).includes(modelo)) || L.modelos.includes(modelo) ? null : 'modelo';
}

/** ¿Se puede hacer esta pregunta en este modelo? (no está retirada, sus estructuras existen y el modelo no las muestra mal). */
export const disponibleEn = (L, q, modelo) => motivoNoDisponible(L, q, modelo) === null;

/**
 * Lo que de una lección no se puede evaluar en este modelo por las limitaciones conocidas del modelo:
 * { excluidas: Set de ids de pregunta, sinEvaluar: [índices de objetivo] }. Un objetivo queda sin evaluar si no le queda
 * ninguna pregunta y alguna de las suyas se quitó por una limitación del modelo. Solo las limitaciones: lo retirado o lo
 * que falta en un modelo cuenta para el dominio como siempre (sin esas preguntas no se llega al dominio).
 */
export function noEvaluables(L, modelo) {
  const motivos = new Map((L.preguntas ?? []).map((q) => [q.id, motivoNoDisponible(L, q, modelo)]));
  const excluidas = new Set([...motivos].filter(([, m]) => m === 'limitacion').map(([id]) => id));
  const sinEvaluar = (L.objetivos ?? []).map((_, i) => i).filter((i) => {
    const suyas = (L.preguntas ?? []).filter((q) => q.objetivo === i);
    return suyas.some((q) => motivos.get(q.id) === 'limitacion') && suyas.every((q) => motivos.get(q.id) !== null);
  });
  return { excluidas, sinEvaluar };
}

/**
 * La pregunta lista para mostrar. Con `modelo`, sin lo que en él se muestra mal: las candidatas de una localización y los
 * nombres de una identificación (la huella es la de la pregunta del banco, que no cambia).
 */
export function instanciar(L, q, rng = Math.random, { modelo = null } = {}) {
  const base = { id: q.id, item: itemId(L.id, q.id), leccion: L.id, tipo: q.tipo, objetivo: q.objetivo, paso: q.paso, evidencia: q.evidencia ?? [], huella: huella(q) };
  if (q.tipo === 'identificar') {
    const e = L.estructuras[q.estructura];
    const distractores = barajar(distractoresUtiles(L, q.estructura, modelo), rng).slice(0, 3);
    return {
      ...base, estructura: q.estructura, estructuras: [q.estructura],
      opciones: barajar([e.nombre, ...distractores], rng).map((texto) => ({ texto, correcta: texto === e.nombre })),
      explicacion: q.explicacion ?? null, respuesta: e.nombre,
    };
  }
  if (q.tipo === 'localizar') {
    return { ...base, estructura: q.estructura, estructuras: [q.estructura], candidatas: barajar([q.estructura, ...candidatasUtiles(L, q, modelo)], rng), respuesta: L.estructuras[q.estructura].nombre, explicacion: q.explicacion ?? null };
  }
  if (q.tipo === 'secuencia') {
    let orden = barajar(q.orden, rng);
    for (let i = 0; i < 5 && orden.every((x, k) => x === q.orden[k]); i++) orden = barajar(q.orden, rng);   // que no salga ya ordenada
    return { ...base, enunciado: q.enunciado, estructuras: q.estructuras ?? [], elementos: orden, correcto: q.orden, explicacion: q.explicacion };
  }
  return {
    ...base, enunciado: q.enunciado, estructuras: q.estructuras ?? [], explicacion: q.explicacion, respuesta: q.correcta,
    opciones: barajar([q.correcta, ...q.distractores], rng).map((texto) => ({ texto, correcta: texto === q.correcta })),
  };
}

/**
 * Corrige. respuesta: índice de la opción, NO_LO_SE, el id de la estructura tocada (localizar) o la lista ordenada
 * (secuencia). Devuelve 'acierto' | 'duda' | 'fallo'.
 */
export function corregir(p, respuesta, { dude = false } = {}) {
  if (respuesta === NO_LO_SE || respuesta == null) return 'fallo';
  let ok;
  if (p.tipo === 'localizar') ok = respuesta === p.estructura;
  else if (p.tipo === 'secuencia') ok = Array.isArray(respuesta) && respuesta.length === p.correcto.length && respuesta.every((x, i) => x === p.correcto[i]);
  else ok = !!p.opciones[respuesta]?.correcta;
  if (!ok) return 'fallo';
  return dude ? 'duda' : 'acierto';
}

/**
 * Evaluación de una lección: cubre todos los objetivos (al menos una pregunta de cada uno) y hasta `max` preguntas, sin
 * repetir y solo con lo que se puede hacer en este modelo. Las identificaciones se reparten (no más de la mitad).
 */
export function evaluacionDe(L, opciones = {}) {
  return planEvaluacion(L, opciones).preguntas;
}

/**
 * La evaluación y lo que queda fuera: { preguntas, excluidas: [{ id, motivo }], sinEvaluar: [{ objetivo, motivo }] }.
 * Un objetivo sin ninguna pregunta posible queda sin evaluar, con el motivo de las suyas ('limitacion' si alguna se quitó
 * por una limitación del modelo; si no, 'modelo', 'retirada' o 'sin-preguntas'): la app lo dice y no lo da por cumplido.
 */
export function planEvaluacion(L, { modelo = 'male', max = 10, rng = Math.random } = {}) {
  const motivos = new Map((L.preguntas ?? []).map((q) => [q, motivoNoDisponible(L, q, modelo)]));
  const posibles = (L.preguntas ?? []).filter((q) => motivos.get(q) === null);
  const elegidas = [];
  const usar = (q) => { if (q && !elegidas.includes(q)) elegidas.push(q); };
  // Una por objetivo (prefiriendo las que no son de identificación, que ya abundan).
  L.objetivos.forEach((_, i) => {
    const del = barajar(posibles.filter((q) => q.objetivo === i), rng);
    usar(del.find((q) => q.tipo !== 'identificar') ?? del[0]);
  });
  const resto = barajar(posibles.filter((q) => !elegidas.includes(q)), rng);
  const maxIdent = Math.ceil(max / 2);
  for (const q of resto) {
    if (elegidas.length >= max) break;
    if (q.tipo === 'identificar' && elegidas.filter((x) => x.tipo === 'identificar').length >= maxIdent) continue;
    usar(q);
  }
  for (const q of resto) { if (elegidas.length >= max) break; usar(q); }
  const excluidas = [...motivos].filter(([, m]) => m).map(([q, motivo]) => ({ id: q.id, motivo }));
  const sinEvaluar = L.objetivos.map((_, i) => i).filter((i) => !posibles.some((q) => q.objetivo === i)).map((objetivo) => {
    const suyos = (L.preguntas ?? []).filter((q) => q.objetivo === objetivo).map((q) => motivos.get(q));
    const motivo = ['limitacion', 'modelo', 'retirada'].find((m) => suyos.includes(m)) ?? 'sin-preguntas';
    return { objetivo, motivo };
  });
  return { preguntas: barajar(elegidas, rng).map((q) => instanciar(L, q, rng, { modelo })), excluidas, sinEvaluar };
}

/** Aciertos por objetivo de una lista de respuestas [{ pregunta, resultado }]: [[aciertos, total]…]. */
export function porObjetivo(L, respuestas) {
  const out = L.objetivos.map(() => [0, 0]);
  for (const { pregunta, resultado } of respuestas) {
    const o = out[pregunta.objetivo];
    if (!o) continue;
    o[1]++;
    if (resultado !== 'fallo') o[0]++;
  }
  return out;
}

/** Pregunta de repaso de un ítem («leccion/pregunta»), si la lección y la pregunta siguen existiendo. */
export function preguntaDeItem(lecciones, id, { modelo = 'male', rng = Math.random } = {}) {
  const i = id.indexOf('/');
  const L = lecciones.get(id.slice(0, i));
  const q = L?.preguntas.find((x) => x.id === id.slice(i + 1));
  if (!q || !disponibleEn(L, q, modelo)) return null;
  return instanciar(L, q, rng, { modelo });
}

// ── Respuesta breve: escribir el nombre de la estructura en lugar de elegirlo (recordar, no reconocer) ──
// Solo para «identificar», donde la respuesta es un nombre que se puede comprobar con fiabilidad: el nombre de la
// lección y sus sinónimos. Lo que se parece pero no coincide no se da por bueno ni por malo: se compara con la
// respuesta de referencia y decide la persona (cuenta como «duda»: no sube en el repaso).
const ARTICULOS = new Set(['el', 'la', 'los', 'las', 'lo', 'un', 'una', 'the', 'a', 'an', 'der', 'die', 'das', 'le', 'les', 'il', 'gli', 'l']);
const GENERICAS = new Set(['musculo', 'muscle', 'muskel', 'muscolo', 'hueso', 'bone', 'knochen', 'os', 'osso', 'nervio', 'nerve', 'nerv', 'nerf', 'nervo',
  'arteria', 'artery', 'arterie', 'artere', 'vena', 'vein', 'vene', 'veine', 'ligamento', 'ligament', 'band', 'ligamento', 'm', 'n', 'a', 'v', 'lig']);
const palabrasDe = (s) => normalizar(s).replace(/[^a-z0-9 ]+/g, ' ').split(' ').filter((w) => w && !ARTICULOS.has(w));
const forma = (s) => palabrasDe(s).join(' ');
const sinGenerica = (s) => palabrasDe(s).filter((w) => !GENERICAS.has(w)).join(' ');

/**
 * Corrige una respuesta escrita. `aceptadas`: el nombre y sus sinónimos; `otras`: nombres de otras estructuras (para
 * reconocer una confusión). Devuelve { resultado: 'acierto' | 'cercana' | 'ambigua' | 'fallo', confundida?, opciones? }:
 * 'ambigua' cuando lo escrito vale igual para la respuesta y para otra estructura («radial»: ¿nervio o arteria?); no
 * se corrige, se pide el nombre completo.
 */
export function corregirBreve(texto, { aceptadas = [], otras = [] } = {}) {
  const r = forma(texto);
  if (!r) return { resultado: 'fallo' };
  const buenas = aceptadas.map(forma).filter(Boolean);
  if (buenas.includes(r)) return { resultado: 'acierto' };
  const sg = sinGenerica(texto);
  // Otra estructura de la lección, escrita bien: una confusión (aunque se parezca).
  const otra = otras.find((o) => forma(o) === r);
  if (otra) return { resultado: 'fallo', confundida: otra };
  const coinciden = (lista) => lista.filter((x) => sg && sinGenerica(x) === sg);
  const otrasIguales = coinciden(otras);
  if (otrasIguales.length) {
    const buena = coinciden(aceptadas)[0];
    return buena ? { resultado: 'ambigua', opciones: [buena, ...otrasIguales] } : { resultado: 'fallo', confundida: otrasIguales[0] };
  }
  // Erratas pequeñas o sin la palabra genérica («deltoides» por «músculo deltoides»): la persona compara y decide.
  const tol = (n) => (n >= 12 ? 2 : n >= 5 ? 1 : 0);
  const cerca = buenas.some((b) => distancia(r, b, 2) <= tol(b.length)) || aceptadas.some((a) => sinGenerica(a) && (sinGenerica(a) === sg || distancia(sinGenerica(a), sg, 2) <= tol(sinGenerica(a).length)));
  return { resultado: cerca ? 'cercana' : 'fallo' };
}
