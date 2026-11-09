// Formato de las lecciones de la biblioteca de estudio y su revisor. Sin DOM: lo usan la app, las pruebas y los
// scripts. Una lección es un archivo de lecciones/ que exporta `leccion({...})`; la app la carga solo al abrirla.
//
// Jerarquía: recorrido → módulo → lección → actividad (recorridos.js). Una lección tiene un solo identificador, un solo
// contenido y un solo progreso, aunque aparezca en varias regiones, sistemas o recorridos.
//
// Una lección:
//   id, version          identificador estable y versión del contenido (el progreso guarda con cuál se estudió)
//   titulo, resumen      título y una o dos frases de alcance (qué incluye y qué no)
//   lugares              [[región, subregión | null]] de taxonomia.js; [] si es de todo el cuerpo
//   sistemas             sistemas educativos que trata
//   formato, temas       clase de lección y objetivos de estudio (filtros)
//   nivel, minutos       1 básico · 2 intermedio · 3 avanzado; duración estimada
//   requisitos           lecciones que conviene haber hecho antes; siguiente: lecciones que siguen naturalmente
//   modelos              en qué modelos se puede estudiar (por defecto, los dos)
//   objetivos            lo que se sabrá hacer al terminar, observable (empieza por un verbo: Localizar, Explicar…)
//   estructuras          { id: { nombre, piezas, lado, papel, tipo, modelos?, confusiones? } }:
//                          piezas: nombres de las mallas sin el lado («Supraspinatus_muscle»); lado: 'bilateral' (se
//                          muestra un lado, el del paso), 'ambos' (los dos lados a la vez), 'impar' (sin lado) o
//                          'exacto' (las piezas son nombres completos, con su lado si lo tienen: para conjuntos mixtos)
//                          papel: 'nucleo' (se evalúa) o 'contexto' (se muestra para orientarse)
//                          tipo: hueso, musculo, nervio, arteria, vena, ligamento, organo… (los distractores de la
//                          identificación son del mismo tipo); confusiones: nombres de estructuras con las que se suele
//                          confundir (distractores y lección de comparación)
//   pasos                [{ id, tipo, titulo, texto, detalle?, vista?, actividad?, comprobar? }]
//                          tipo: orientacion | explicacion | exploracion | relaciones | funcion | sintesis
//                          texto y detalle: frases [texto, ...evidencias] (abajo); detalle se muestra al pedir «Saber más»
//                          vista: { ver, contexto, fantasma, esqueleto, camara, lado, capas } (qué se muestra en 3D):
//                            ver resaltadas, contexto visibles, fantasma translúcidas, esqueleto: el esqueleto entero;
//                            capas: { sistema del visor: capa } muestra sistemas enteros (p. ej. { muscular:
//                            'superficial' }) sin aislar nada, para las visiones generales
//                          actividad: { tipo: 'localizar', estructura, texto } | { tipo: 'comparar', estructuras, texto }
//                            | { tipo: 'vistas', vistas: [{ nombre, camara }], texto }
//                          comprobar: id de una pregunta de texto del banco (relacion, funcion o comparacion) que se
//                            hace al final del paso (práctica, no cuenta)
//   preguntas            banco de la evaluación: [{ id, tipo, objetivo (índice), paso, ... }]
//                          identificar: { estructura } (se resalta sin nombre y se elige entre cuatro)
//                          localizar:   { estructura, candidatas } (se señala en el modelo entre varias)
//                          relacion | funcion | comparacion: { enunciado, correcta, distractores (3), explicacion, evidencia }
//                          secuencia:   { enunciado, orden (≥ 3, en el orden correcto), explicacion, evidencia }
//   fuentesTerminologia  [evidencias] de los nombres que no salen de los metadatos del modelo (sinónimos…)
//   revision             { estado, revisor, fecha, notas } (schema.js: nadie figura como revisor sin haberlo hecho)
//
// Evidencias: cada frase de una lección es [texto, ...evidencias]. Una evidencia es la cita literal (en el idioma de la
// fuente) que respalda la frase: W(titulo, cita) para Wikipedia en inglés, ES(titulo, cita) para Wikipedia en español y
// T(ruta, cita) para TeachMeAnatomy. scripts/biblioteca/fuentes.mjs comprueba que cada cita está, palabra por palabra, en
// la versión guardada de su página. Las frases que no afirman nada de anatomía llevan GUIA (instrucciones: «Gira el
// modelo…») y las que hablan del propio modelo 3D llevan MODELO («En el modelo, el nervio es un solo cordón»).
import { REGION_POR_ID, SUBREGION_POR_ID, SISTEMA_POR_ID, FORMATO_POR_ID, TEMA_POR_ID, NIVEL_POR_ID } from './taxonomia.js';
import { ESTADOS } from '../content/schema.js';
import { SYSTEMS } from '../systems.js';

// Capas de cada sistema del visor (systems.js), para comprobar las `capas` de las vistas.
const SYSTEMS_VISOR = Object.fromEntries(SYSTEMS.map((s) => [s.id, s.stages.map((st) => st.id)]));

export const GUIA = Object.freeze({ guia: true });
export const MODELO = Object.freeze({ modelo: true });
export const W = (titulo, cita) => ({ f: `wp:${titulo}`, c: cita });
export const ES = (titulo, cita) => ({ f: `wpes:${titulo}`, c: cita });
export const T = (ruta, cita) => ({ f: `tma:${ruta}`, c: cita });

export const REVISION_BORRADOR = Object.freeze({
  estado: 'borrador', revisor: null, fecha: null,
  notas: 'Redactada por IA (Claude) a partir de las fuentes citadas; cada afirmación lleva la cita de la fuente que la respalda, comprobada palabra por palabra. Pendiente de revisión por un especialista.',
});

export const TIPOS_PASO = ['orientacion', 'explicacion', 'exploracion', 'relaciones', 'funcion', 'sintesis'];
export const TIPOS_PREGUNTA = ['identificar', 'localizar', 'relacion', 'funcion', 'comparacion', 'secuencia'];
export const CAMARAS = ['anterior', 'posterior', 'lateral', 'medial', 'superior', 'inferior', 'anterolateral', 'posterolateral'];
export const TIPOS_ESTRUCTURA = ['hueso', 'diente', 'cartilago', 'ligamento', 'capsula', 'bolsa', 'vaina', 'fascia', 'musculo',
  'tendon', 'arteria', 'vena', 'corazon', 'nervio', 'ganglio', 'snc', 'nodo', 'organo', 'glandula', 'piel'];
// Verbos con los que empieza un objetivo observable (se puede comprobar si se cumple).
const VERBOS = /^(Decir|Localizar|Identificar|Nombrar|Reconocer|Señalar|Situar|Describir|Explicar|Relacionar|Distinguir|Diferenciar|Comparar|Ordenar|Seguir|Enumerar|Asociar|Indicar|Predecir|Usar|Orientar|Clasificar)\b/;

/** Una lección con los valores por defecto. */
export function leccion(def) {
  return { idiomas: ['es'], modelos: ['male', 'female'], requisitos: [], siguiente: [], fuentesTerminologia: [], revision: REVISION_BORRADOR, ...def };
}

/** Frases de un texto: el formato de las lecciones nuevas (lista de frases) o un texto suelto (módulos antiguos). */
export const frases = (texto) => (Array.isArray(texto) ? texto : texto ? [[texto]] : []);
export const textoPlano = (texto) => frases(texto).map((f) => f[0]).join(' ');
export const evidencias = (frase) => frase.slice(1).filter((e) => e && (e.f || e.m));

/** Estructuras de una pregunta (para el repaso y para saber qué mostrar). */
export const estructurasDePregunta = (p) => (p.estructura ? [p.estructura] : p.estructuras ?? []);

/**
 * Problemas de una lección: [{ nivel: 'error' | 'aviso', texto }].
 * ctx: { piezasDe(modelo) → Set de nombres de malla con lado, o null; nombreDe(clave) → nombre del modelo, o null;
 *        lecciones: Set de ids (para requisitos y siguiente), o null; fuentes: { id → datos } o null }
 */
export function revisarLeccion(L, ctx = {}) {
  const out = [];
  const id = L.id ?? '?';
  const err = (t) => out.push({ nivel: 'error', texto: `${id}: ${t}` });
  const aviso = (t) => out.push({ nivel: 'aviso', texto: `${id}: ${t}` });
  if (!/^[a-z0-9-]+$/.test(L.id ?? '')) err('identificador vacío o con caracteres no válidos');
  if (!L.version) err('sin «version»');
  for (const k of ['titulo', 'resumen']) if (!L[k]) err(`falta «${k}»`);
  // Clasificación
  for (const [r, s] of L.lugares ?? []) {
    if (!REGION_POR_ID.has(r)) err(`región desconocida: ${r}`);
    if (s && SUBREGION_POR_ID.get(s)?.region !== r) err(`subregión ${s} no es de ${r}`);
  }
  if (!L.sistemas?.length && L.formato !== 'fundamentos') err('sin sistemas');
  for (const s of L.sistemas ?? []) if (!SISTEMA_POR_ID.has(s)) err(`sistema desconocido: ${s}`);
  if (!FORMATO_POR_ID.has(L.formato)) err(`formato desconocido: ${L.formato}`);
  for (const t of L.temas ?? []) if (!TEMA_POR_ID.has(t)) err(`tema desconocido: ${t}`);
  if (!NIVEL_POR_ID.has(L.nivel)) err(`nivel no válido: ${L.nivel}`);
  if (!(L.minutos >= 3 && L.minutos <= 45)) err(`duración no válida: ${L.minutos}`);
  for (const m of L.modelos ?? []) if (!['male', 'female'].includes(m)) err(`modelo desconocido: ${m}`);
  if (ctx.lecciones) {
    for (const r of [...(L.requisitos ?? []), ...(L.siguiente ?? [])]) if (!ctx.lecciones.has(r)) err(`lección inexistente en requisitos o siguiente: ${r}`);
    if ((L.requisitos ?? []).includes(L.id) || (L.siguiente ?? []).includes(L.id)) err('se cita a sí misma en requisitos o siguiente');
  }
  // Objetivos
  if (!(L.objetivos?.length >= 2 && L.objetivos.length <= 6)) err('necesita entre 2 y 6 objetivos');
  for (const o of L.objetivos ?? []) if (!VERBOS.test(o)) err(`objetivo no observable (debe empezar por un verbo como Localizar o Explicar): «${o}»`);

  // Estructuras: piezas que existen en los modelos declarados.
  const E = L.estructuras ?? {};
  for (const [eid, e] of Object.entries(E)) {
    if (!/^[a-z0-9-]+$/.test(eid)) err(`estructura con identificador no válido: ${eid}`);
    if (!e.nombre) err(`${eid}: sin nombre`);
    if (!e.piezas?.length) err(`${eid}: sin piezas`);
    if (!['bilateral', 'ambos', 'impar', 'exacto'].includes(e.lado)) err(`${eid}: lado no válido (${e.lado})`);
    if (!['nucleo', 'contexto'].includes(e.papel)) err(`${eid}: papel no válido (${e.papel})`);
    if (!TIPOS_ESTRUCTURA.includes(e.tipo)) err(`${eid}: tipo no válido (${e.tipo})`);
    const modelos = e.modelos ?? L.modelos;
    for (const m of modelos) if (!L.modelos.includes(m)) err(`${eid}: modelo ${m} que la lección no declara`);
    for (const modelo of ['male', 'female']) {
      const nombres = ctx.piezasDe?.(modelo);
      if (!nombres) continue;
      const lados = e.lado === 'bilateral' || e.lado === 'ambos' ? ['_L', '_R'] : [''];
      for (const p of e.piezas ?? []) {
        const esta = lados.every((l) => nombres.has(p + l));
        if (modelos.includes(modelo) && !esta) err(`${eid}: la pieza ${p}${lados.join('/')} no existe en el modelo ${modelo}`);
      }
    }
  }
  const nucleo = Object.keys(E).filter((k) => E[k].papel === 'nucleo');
  const existe = (k) => k in E;

  // Pasos
  const P = L.pasos ?? [];
  if (P.length < 4) err('menos de 4 pasos');
  if (P[0]?.tipo !== 'orientacion') err('el primer paso debe ser de orientación');
  if (P.at(-1)?.tipo !== 'sintesis') err('el último paso debe ser la síntesis');
  const idsPaso = new Set();
  const usadas = new Set();
  for (const p of P) {
    if (idsPaso.has(p.id)) err(`paso repetido: ${p.id}`);
    idsPaso.add(p.id);
    if (!TIPOS_PASO.includes(p.tipo)) err(`paso ${p.id}: tipo no válido (${p.tipo})`);
    if (!p.titulo) err(`paso ${p.id}: sin título`);
    if (!frases(p.texto).length) err(`paso ${p.id}: sin texto`);
    for (const f of [...frases(p.texto), ...frases(p.detalle)]) revisarFrase(f, `paso ${p.id}`, err);
    if (textoPlano(p.texto).length > 700) aviso(`paso ${p.id}: texto largo (${textoPlano(p.texto).length} caracteres); lo que sobre, a «detalle»`);
    const v = p.vista;
    if (v) {
      for (const k of [...(v.ver ?? []), ...(v.contexto ?? []), ...(v.fantasma ?? [])]) {
        if (!existe(k)) err(`paso ${p.id}: la vista usa una estructura que no está en la lección: ${k}`);
        usadas.add(k);
      }
      if (v.camara && !CAMARAS.includes(v.camara)) err(`paso ${p.id}: cámara no válida (${v.camara})`);
      for (const [sis, capa] of Object.entries(v.capas ?? {})) {
        const st = SYSTEMS_VISOR[sis];
        if (!st) err(`paso ${p.id}: sistema del visor desconocido (${sis})`);
        else if (!st.includes(capa)) err(`paso ${p.id}: capa desconocida ${sis}/${capa}`);
      }
      if (v.lado && !['L', 'R'].includes(v.lado)) err(`paso ${p.id}: lado no válido (${v.lado})`);
    } else if (p.tipo !== 'sintesis') aviso(`paso ${p.id}: sin vista 3D`);
    const a = p.actividad;
    if (a) {
      if (a.tipo === 'localizar' && !nucleo.includes(a.estructura)) err(`paso ${p.id}: «localizar» necesita una estructura del núcleo (${a.estructura})`);
      if (a.tipo === 'comparar' && !(a.estructuras?.length >= 2 && a.estructuras.every(existe))) err(`paso ${p.id}: «comparar» necesita dos estructuras de la lección`);
      if (a.tipo === 'vistas' && !(a.vistas?.length && a.vistas.every((x) => x.nombre && CAMARAS.includes(x.camara)))) err(`paso ${p.id}: «vistas» mal definidas`);
      if (!['localizar', 'comparar', 'vistas'].includes(a.tipo)) err(`paso ${p.id}: actividad desconocida (${a.tipo})`);
      if (!a.texto) err(`paso ${p.id}: actividad sin texto`);
    }
    if (p.comprobar) {
      // La práctica del paso es una pregunta de opciones con enunciado: identificar, localizar y ordenar necesitan su
      // propia interfaz (el 3D aislado, tocar, arrastrar) y solo se hacen en la evaluación.
      const cq = (L.preguntas ?? []).find((q) => q.id === p.comprobar);
      if (!cq) err(`paso ${p.id}: «comprobar» con una pregunta que no existe (${p.comprobar})`);
      else if (!TIPOS_COMPROBAR.includes(cq.tipo)) err(`paso ${p.id}: «comprobar» solo admite preguntas de texto (${TIPOS_COMPROBAR.join(', ')}), no ${cq.tipo} (${p.comprobar})`);
    }
  }
  for (const k of nucleo) if (!usadas.has(k)) err(`la estructura del núcleo ${k} no se muestra en ningún paso`);

  // Banco de preguntas: cada objetivo con al menos una pregunta; identificación con 3 distractores posibles.
  const Q = L.preguntas ?? [];
  const idsQ = new Set();
  const porObjetivo = new Set();
  for (const q of Q) {
    if (idsQ.has(q.id)) err(`pregunta repetida: ${q.id}`);
    idsQ.add(q.id);
    if (!TIPOS_PREGUNTA.includes(q.tipo)) err(`pregunta ${q.id}: tipo no válido (${q.tipo})`);
    if (!(q.objetivo >= 0 && q.objetivo < (L.objetivos?.length ?? 0))) err(`pregunta ${q.id}: objetivo no válido`);
    else porObjetivo.add(q.objetivo);
    if (!idsPaso.has(q.paso)) err(`pregunta ${q.id}: paso al que volver inexistente (${q.paso})`);
    if (q.tipo === 'identificar' || q.tipo === 'localizar') {
      if (!nucleo.includes(q.estructura)) err(`pregunta ${q.id}: la estructura ${q.estructura} no es del núcleo`);
      else if (q.tipo === 'identificar' && distractoresIdentificar(L, q.estructura).length < 3) err(`pregunta ${q.id}: menos de 3 distractores del mismo tipo para ${q.estructura}`);
      if (q.tipo === 'localizar' && !(q.candidatas?.length >= 2 && q.candidatas.every(existe) && !q.candidatas.includes(q.estructura))) err(`pregunta ${q.id}: «localizar» necesita al menos 2 candidatas distintas de la respuesta`);
    } else {
      if (!q.enunciado || !q.explicacion) err(`pregunta ${q.id}: falta enunciado o explicación`);
      if (q.tipo === 'secuencia') {
        if (!(q.orden?.length >= 3) || new Set(q.orden).size !== q.orden.length) err(`pregunta ${q.id}: la secuencia necesita 3 o más elementos distintos`);
      } else {
        if (!q.correcta || q.distractores?.length !== 3) err(`pregunta ${q.id}: necesita una respuesta y 3 distractores`);
        if (new Set([q.correcta, ...(q.distractores ?? [])]).size !== 4) err(`pregunta ${q.id}: opciones repetidas`);
      }
      if (!q.evidencia?.length) err(`pregunta ${q.id}: sin evidencia (cita de la fuente)`);
      for (const e of q.evidencia ?? []) revisarEvidencia(e, `pregunta ${q.id}`, err);
      for (const k of q.estructuras ?? []) if (!existe(k)) err(`pregunta ${q.id}: estructura inexistente ${k}`);
    }
  }
  (L.objetivos ?? []).forEach((o, i) => { if (!porObjetivo.has(i)) err(`el objetivo ${i + 1} no tiene ninguna pregunta en la evaluación`); });
  if (Q.length < 4) err('el banco de preguntas tiene menos de 4');
  for (const e of L.fuentesTerminologia ?? []) revisarEvidencia(e, 'terminología', err);
  if (!(L.revision?.estado in ESTADOS)) err('estado de revisión no válido');
  if (L.revision?.estado === 'revisado' && !(L.revision.revisor && L.revision.fecha)) err('«revisado» sin revisor ni fecha');
  if (ctx.fuentes) {
    for (const e of todasLasEvidencias(L)) if (e.f && !ctx.fuentes[e.f]) err(`fuente sin registrar (scripts/biblioteca/fuentes.mjs bajar ${e.f})`);
  }
  return out;
}

function revisarFrase(f, donde, err) {
  if (!Array.isArray(f) || typeof f[0] !== 'string' || !f[0].trim()) return err(`${donde}: frase mal formada`);
  const marcas = f.slice(1);
  if (!marcas.length) return err(`${donde}: frase sin evidencia ni marca (GUIA o MODELO): «${f[0].slice(0, 60)}…»`);
  for (const e of marcas) {
    if (e === GUIA || e === MODELO || e?.guia || e?.modelo) continue;
    revisarEvidencia(e, donde, err);
  }
}

function revisarEvidencia(e, donde, err) {
  if (e?.m) return;                                       // fuente de un módulo antiguo (content/fuentes.js)
  if (!e?.f || !/^(wp|wpes|tma):\S+$/.test(e.f)) return err(`${donde}: evidencia sin fuente válida`);
  if (!e.c || e.c.length < 20) err(`${donde}: cita demasiado corta (${JSON.stringify(e.c)})`);
}

/** Todas las evidencias con cita de una lección (frases, preguntas y terminología). */
export function todasLasEvidencias(L) {
  const out = [];
  for (const p of L.pasos ?? []) for (const f of [...frases(p.texto), ...frases(p.detalle)]) out.push(...evidencias(f));
  for (const q of L.preguntas ?? []) out.push(...(q.evidencia ?? []));
  out.push(...(L.fuentesTerminologia ?? []));
  return out.filter((e) => e.f);
}

// Grupos de tipos que se pueden confundir entre sí en una identificación (un vaso con otro vaso, aunque sea vena).
/** Tipos de pregunta que admite la comprobación de un paso (opciones con enunciado). */
export const TIPOS_COMPROBAR = ['relacion', 'funcion', 'comparacion'];

const GRUPO_TIPO = { arteria: 'vaso', vena: 'vaso', cartilago: 'hueso', diente: 'hueso', capsula: 'ligamento', glandula: 'organo' };
const grupoTipo = (t) => GRUPO_TIPO[t] ?? t;

/** Mallas de una estructura en un lado (las de los dos lados si es 'ambos'; tal cual si es 'impar' o 'exacto'). */
export function mallas(e, lado = 'R') {
  if (!e) return [];
  if (e.lado === 'bilateral') return e.piezas.map((p) => `${p}_${lado}`);
  if (e.lado === 'ambos') return e.piezas.flatMap((p) => [`${p}_L`, `${p}_R`]);
  return [...e.piezas];
}
/** Nombre de una malla sin el lado (como las claves del inventario y del catálogo). */
export const sinLado = (nombre) => nombre.replace(/_[LR]$/, '');

/** Nombres con los que se puede confundir una estructura en una identificación (sin repetir el suyo). */
export function distractoresIdentificar(L, eid) {
  const e = L.estructuras[eid];
  const mismos = Object.entries(L.estructuras)
    .filter(([k, x]) => k !== eid && grupoTipo(x.tipo) === grupoTipo(e.tipo))
    .map(([, x]) => x.nombre);
  return [...new Set([...mismos, ...(e.confusiones ?? [])])].filter((n) => n !== e.nombre);
}
