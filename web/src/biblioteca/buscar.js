// Buscador de la biblioteca («¿Qué quieres aprender hoy?»). Sin DOM y sin servicios externos: lo prueba `npm test`.
//
// Entiende frases sencillas («quiero aprender los huesos», «músculos de la pierna», «repasar antebrazo»):
//  1. normaliza (sin acentos ni mayúsculas) y quita las palabras vacías («quiero», «de», «los»…);
//  2. reconoce la intención (repasar, practicar) y los términos de la taxonomía: lugares (regiones y subregiones) y
//     materias (sistemas y temas), en español, inglés o latín, con plurales y con una errata razonable;
//  3. con el resto de palabras busca en el texto de las lecciones (título, estructuras, objetivos, resumen), de los
//     recorridos y en los nombres de las estructuras (español, latín, inglés y sinónimos documentados).
// Lugares y materias se combinan como filtros: (lugar1 o lugar2) y (materia1 o materia2). Si así no sale nada, se
// relaja y se dice. Las erratas solo se corrigen en palabras de 5 letras o más que no existen tal cual en el
// vocabulario, y hacia la palabra más parecida: «radio» no se convierte en «radial» porque «radio» existe.
import { REGIONES, SISTEMAS, TEMAS } from './taxonomia.js';

export const normalizar = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ').trim();
const palabras = (s) => normalizar(s).split(' ').filter(Boolean);

const VACIAS = new Set(('a al algo algun alguna como con cual cuales de del el en entre es esta estan este esto hoy la las le lo los me mi mis '
  + 'muy necesito o para por puedo que quiero quisiera se ser sobre su sus te tu un una uno unos unas y ya ver aprender aprenda estudiar '
  + 'estudio conocer saber entender dame muestrame ensename explicame mas cosas parte partes '
  + 'i want to the of and in on how for my about learn study show me what is are').split(' '));
const REPASAR = new Set(['repasar', 'repaso', 'repasa', 'repasemos', 'revisar', 'review', 'revise']);
const PRACTICAR = new Set(['practicar', 'practica', 'practice', 'examen', 'evaluar', 'evaluarme', 'test', 'quiz']);
const TODOS = new Set(['todos', 'todas', 'todo', 'toda', 'all', 'every', 'entero', 'entera', 'completo']);

// Palabras que en anatomía significan algo más preciso que en el habla corriente: se avisa y se ofrece la otra lectura.
export const AMBIGUOS = {
  pierna: { region: 'miembro-inferior', aviso: 'buscar.avisoPierna' },
  brazo: { region: 'miembro-superior', aviso: 'buscar.avisoBrazo' },
};

/** Variantes de una palabra para comparar plurales: «huesos» → hueso, «nervios» → nervio, «pies» → pie. */
function variantes(w) {
  const v = [w];
  if (w.length > 4 && w.endsWith('es')) v.push(w.slice(0, -2));
  if (w.length > 3 && w.endsWith('s')) v.push(w.slice(0, -1));
  return v;
}

/** Distancia de edición (con transposiciones) acotada: devuelve max + 1 si la supera. */
export function distancia(a, b, max = 2) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    let fila = Infinity;
    for (let j = 1; j <= b.length; j++) {
      const c = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + c);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      fila = Math.min(fila, d[i][j]);
    }
    if (fila > max) return max + 1;
  }
  return d[a.length][b.length];
}
const tolerancia = (w) => (w.length >= 8 ? 2 : w.length >= 5 ? 1 : 0);

// Vocabulario de la taxonomía: frase normalizada → faceta. Las frases de varias palabras se buscan primero.
function vocabulario() {
  const out = [];
  const add = (texto, faceta) => { const n = normalizar(texto); if (n) out.push({ frase: n.split(' '), faceta }); };
  for (const r of REGIONES) {
    for (const t of [r.nombre, r.en, r.la, ...(r.buscar ?? [])].filter(Boolean)) add(t, { tipo: 'lugar', region: r.id, sub: null });
    for (const s of r.sub) for (const t of [s.nombre, s.en, s.la, ...(s.buscar ?? [])].filter(Boolean)) add(t, { tipo: 'lugar', region: r.id, sub: s.id });
  }
  for (const s of SISTEMAS) for (const t of [s.nombre, s.corto, s.en, s.la, ...(s.buscar ?? [])].filter(Boolean)) add(t, { tipo: 'materia', sistema: s.id });
  for (const t of TEMAS) for (const x of [t.nombre, ...(t.buscar ?? [])]) add(x, { tipo: 'materia', tema: t.id });
  return out.sort((a, b) => b.frase.length - a.frase.length);
}
const VOCAB = vocabulario();

/**
 * Prepara un índice de búsqueda sobre el catálogo (lecciones y recorridos) y, opcionalmente, una lista de estructuras
 * [{ clave, nombre, latin, en, sinonimos: [] }]. Devuelve { buscar(texto) }.
 */
export function crearBuscador({ lecciones = [], recorridos = [], estructuras = [] } = {}) {
  const docL = lecciones.map((L) => ({
    L,
    campos: [
      [palabras(L.titulo), 6],
      [palabras((L.estructuras ?? []).map((e) => e.nombre).join(' ')), 4],
      [palabras((L.objetivos ?? []).join(' ')), 2],
      [palabras(L.resumen), 2],
      [palabras((L.estructuras ?? []).map((e) => `${e.en ?? ''} ${e.la ?? ''}`).join(' ')), 3],   // nombres en inglés y latín de sus estructuras
    ],
  }));
  const docR = recorridos.map((R) => ({ R, campos: [[palabras(R.titulo), 6], [palabras(R.descripcion), 2]] }));
  const docE = estructuras.map((E) => ({ E, texto: palabras([E.nombre, E.latin, E.en, ...(E.sinonimos ?? [])].filter(Boolean).join(' ')) }));
  // Diccionario de palabras conocidas (para corregir erratas) y sus variantes.
  const dicc = new Set();
  for (const d of [...docL, ...docR]) for (const [ws] of d.campos) for (const w of ws) dicc.add(w);
  for (const d of docE) for (const w of d.texto) dicc.add(w);
  for (const v of VOCAB) for (const w of v.frase) dicc.add(w);
  const conocida = (w) => variantes(w).some((x) => dicc.has(x) || dicc.has(`${x}s`) || dicc.has(`${x}es`));

  function corregir(w) {
    if (conocida(w) || !tolerancia(w)) return null;
    let mejor = null;
    for (const x of dicc) {
      if (x.length < 4) continue;
      const d = distancia(w, x, tolerancia(w));
      if (d <= tolerancia(w) && (!mejor || d < mejor.d || (d === mejor.d && x.length === w.length))) mejor = { x, d };
    }
    return mejor?.x ?? null;
  }

  // Una palabra de la consulta coincide con una palabra del texto: igual, plural o, desde 4 letras, como prefijo.
  const coincide = (q, w) => variantes(q).some((v) => w === v || variantes(w).includes(v) || (v.length >= 4 && w.startsWith(v)));
  const puntuar = (campos, qs) => {
    let total = 0;
    for (const q of qs) {
      let mejor = 0;
      for (const [ws, peso] of campos) if (ws.some((w) => coincide(q, w))) mejor = Math.max(mejor, peso);
      if (!mejor) return 0;                                // todas las palabras libres tienen que aparecer
      total += mejor;
    }
    return total;
  };

  function buscar(texto) {
    const crudas = palabras(texto);
    const intencion = crudas.some((w) => REPASAR.has(w)) ? 'repasar' : crudas.some((w) => PRACTICAR.has(w)) ? 'practicar' : null;
    const todos = crudas.some((w) => TODOS.has(w));
    let ws = crudas.filter((w) => !VACIAS.has(w) && !REPASAR.has(w) && !PRACTICAR.has(w) && !TODOS.has(w));
    // Erratas: se corrige cada palabra desconocida hacia la conocida más parecida.
    const correcciones = [];
    ws = ws.map((w) => { const c = corregir(w); if (c) correcciones.push([w, c]); return c ?? w; });
    // Facetas de la taxonomía (frases más largas primero) y lo que queda como texto libre.
    const facetas = [];
    const libres = [];
    for (let i = 0; i < ws.length;) {
      const v = VOCAB.find(({ frase }) => frase.every((p, k) => ws[i + k] && variantes(ws[i + k]).some((x) => variantes(p).includes(x))));
      if (v) { facetas.push({ ...v.faceta, palabras: ws.slice(i, i + v.frase.length) }); i += v.frase.length; }
      else libres.push(ws[i++]);
    }
    const lugares = dedup(facetas.filter((f) => f.tipo === 'lugar').map(({ region, sub }) => ({ region, sub })));
    const materias = dedup(facetas.filter((f) => f.tipo === 'materia').map(({ sistema, tema }) => (sistema ? { sistema } : { tema })));
    const avisos = facetas.filter((f) => f.tipo === 'lugar' && f.sub && AMBIGUOS[f.sub]).map((f) => ({ clave: AMBIGUOS[f.sub].aviso, region: AMBIGUOS[f.sub].region, sub: f.sub }));

    // Un lugar también vale si su palabra está en el título: «Corazón y circulación» es de todo el cuerpo, pero
    // buscar «corazón» (lugar: tórax › corazón) tiene que encontrarla, y más aún si se busca su título exacto.
    // Tienen que estar todas sus palabras: con «miembro inferior», «… del miembro superior» no vale.
    const tituloNombra = (L) => facetas.some((f) => f.tipo === 'lugar' && f.palabras.every((q) => palabras(L.titulo).some((w) => coincide(q, w))));
    const enLugar = (L) => !lugares.length || lugares.some((g) => (L.lugares ?? []).some(([r, s]) => r === g.region && (!g.sub || !s || s === g.sub))) || tituloNombra(L);
    const enMateria = (L) => !materias.length || materias.some((m) => (m.sistema && (L.sistemas ?? []).includes(m.sistema)) || (m.tema && (L.temas ?? []).includes(m.tema)));
    const puntuarL = (d) => {
      const base = libres.length ? puntuar(d.campos, libres) : 1;
      if (!base) return 0;
      // Las facetas también cuentan como texto: «hombro» puntúa más si está en el título.
      const extra = facetas.reduce((n, f) => n + (f.palabras.some((q) => d.campos[0][0].some((w) => coincide(q, w))) ? 3 : 0), 0);
      return base + extra;
    };
    let relajado = false;
    let lec = docL.filter((d) => enLugar(d.L) && enMateria(d.L)).map((d) => ({ L: d.L, p: puntuarL(d) })).filter((x) => x.p > 0);
    if (!lec.length && lugares.length && materias.length) {
      // Sin nada que cumpla las dos cosas: lo que cumple al menos el lugar (y se dice).
      lec = docL.filter((d) => enLugar(d.L)).map((d) => ({ L: d.L, p: puntuarL(d) })).filter((x) => x.p > 0);
      relajado = lec.length > 0;
    }
    lec.sort((a, b) => b.p - a.p || (a.L.orden ?? 0) - (b.L.orden ?? 0));

    // Recorridos: por su tema o por sus palabras («todos los huesos» → el recorrido de todos los huesos).
    const rec = docR.map((d) => {
      let p = libres.length ? puntuar(d.campos, libres) : 0;
      if (materias.some((m) => m.tema && m.tema === d.R.tema) || materias.some((m) => m.sistema && TEMA_DE_SISTEMA[m.sistema] === d.R.tema)) p += 5 + (todos ? 5 : 0);
      if (!libres.length && !materias.length) p = 0;
      return { R: d.R, p };
    }).filter((x) => x.p > 0).sort((a, b) => b.p - a.p);

    // Estructuras: todas las palabras (también las de las facetas) tienen que estar en sus nombres.
    const qE = ws;
    const est = !qE.length ? [] : docE.map((d) => ({ E: d.E, p: qE.every((q) => d.texto.some((w) => coincide(q, w))) ? qE.length + (normalizar(d.E.nombre) === qE.join(' ') ? 10 : 0) : 0 }))
      .filter((x) => x.p > 0).sort((a, b) => b.p - a.p || a.E.nombre.length - b.E.nombre.length);

    return {
      consulta: texto, intencion, todos, lugares, materias, libres, correcciones, avisos, relajado,
      lecciones: lec.map((x) => ({ ...x.L, puntuacion: x.p })),
      recorridos: rec.map((x) => x.R),
      estructuras: est.map((x) => x.E),
      vacia: !crudas.length,
    };
  }
  return { buscar };
}

// Un sistema que coincide con el tema de un recorrido («huesos» → óseo → recorrido de todos los huesos).
const TEMA_DE_SISTEMA = { oseo: 'huesos', muscular: 'musculos', articular: 'articulaciones', nervioso: 'nervios', cardiovascular: 'arterias-venas' };

function dedup(lista) {
  const vistos = new Set();
  return lista.filter((x) => { const k = JSON.stringify(x); return !vistos.has(k) && vistos.add(k); });
}

/** Ejemplos para la portada del buscador (se muestran como sugerencias). */
export const SUGERENCIAS = ['huesos de la mano', 'músculos de la pierna', 'repasar antebrazo', 'nervios del brazo', 'corazón', 'manguito rotador'];
