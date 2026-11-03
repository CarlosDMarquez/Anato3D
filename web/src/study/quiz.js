// Preguntas de un módulo de estudio. Sin DOM: lo prueba `npm test`.
//   identificar: la estructura se resalta en 3D, sin nombre a la vista, y se elige su nombre entre cuatro.
//   texto: preguntas del banco del módulo (relaciones, inserciones, inervación…), con su explicación y su fuente.
// Siempre hay una opción «No lo sé», que cuenta como fallo: lo que no se sabe vuelve antes al repaso.

export const NO_LO_SE = 'no-lo-se';

const GRUPO = { musculo: 'musculo', nervio: 'nervio', arteria: 'vaso', vena: 'vaso', hueso: 'hueso' };

function barajar(lista, rng) {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Generador pseudoaleatorio con semilla (para pruebas reproducibles). */
export function rngConSemilla(semilla = 1) {
  let s = semilla >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

/** Pregunta de identificación de una ficha: distractores del mismo grupo (músculos, nervios, vasos…) del módulo. */
export function preguntaIdentificar(mod, fichaId, rng = Math.random) {
  const fichas = new Map(mod.estructuras.map((f) => [f.id, f]));
  const f = fichas.get(fichaId);
  const mismos = mod.estructuras.filter((g) => g.id !== f.id && GRUPO[g.tipo] === GRUPO[f.tipo]).map((g) => g.nombre);
  const extra = mod.distractoresExtra?.[f.id] ?? [];
  const distractores = barajar([...new Set([...mismos, ...extra])], rng).slice(0, 3);
  return {
    id: `identificar:${f.id}`,
    tipo: 'identificar',
    ficha: f.id,
    fichas: [f.id],
    enunciado: '¿Qué estructura está resaltada en el modelo?',
    opciones: barajar([f.nombre, ...distractores], rng).map((texto) => ({ texto, correcta: texto === f.nombre })),
    explicacion: f.descripcion,
  };
}

export function preguntaTexto(p, rng = Math.random) {
  return {
    id: `texto:${p.id}`,
    tipo: 'texto',
    ficha: p.fichas[0],
    fichas: p.fichas,
    enunciado: p.enunciado,
    opciones: barajar([p.correcta, ...p.distractores], rng).map((texto) => ({ texto, correcta: texto === p.correcta })),
    explicacion: p.explicacion,
    fuente: p.fuente,
  };
}

/** Evaluación del módulo: una identificación por estructura del núcleo y `nTexto` preguntas de texto, mezcladas. */
export function evaluacion(mod, { nTexto = 4, rng = Math.random } = {}) {
  const ident = mod.nucleo.map((id) => preguntaIdentificar(mod, id, rng));
  const texto = barajar(mod.preguntas, rng).slice(0, nTexto).map((p) => preguntaTexto(p, rng));
  return barajar([...ident, ...texto], rng);
}

/** Repaso: para cada estructura de la cola, su identificación y, si la hay, una pregunta de texto sobre ella. */
export function repaso(mod, cola, { max = 12, rng = Math.random } = {}) {
  const out = [];
  for (const id of cola) {
    out.push(preguntaIdentificar(mod, id, rng));
    const p = barajar(mod.preguntas.filter((q) => q.fichas.includes(id)), rng)[0];
    if (p) out.push(preguntaTexto(p, rng));
    if (out.length >= max) break;
  }
  return out.slice(0, max);
}

/** Resultado de una respuesta: 'acierto' | 'duda' | 'fallo'. `opcion`: índice elegido o NO_LO_SE. */
export function corregir(pregunta, opcion, { dude = false } = {}) {
  if (opcion === NO_LO_SE || !pregunta.opciones[opcion]?.correcta) return 'fallo';
  return dude ? 'duda' : 'acierto';
}
