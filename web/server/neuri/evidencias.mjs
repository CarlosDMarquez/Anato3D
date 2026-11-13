// Evidencias de Neuri: las frases que pueden respaldar lo que explica o redacta. Neuri no cita nada que no esté aquí,
// y cada cita es una frase literal de su fuente (se comprueba igual que las de las lecciones, con fuentes.mjs).
//
// Dos orígenes:
//  1. las frases de las lecciones de la biblioteca: el texto en español y su cita, ya comprobados;
//  2. las páginas de Wikipedia (inglés y español, CC BY-SA 4.0) partidas en frases: las guardadas para la biblioteca
//     (build/biblioteca/fuentes) y las que Neuri baja para un tema nuevo (build/biblioteca/fuentes-neuri), en la
//     revisión de ese día. TeachMeAnatomy (© TeachMeSeries Ltd) no entra entero: solo sus citas cortas de las lecciones.
//
// Búsqueda: BM25 sobre las palabras (sin acentos ni palabras vacías, con plurales), más un extra si aparece el nombre
// completo de una estructura.
import fs from 'node:fs';
import path from 'node:path';
import { normalizar as normalizarCita, partirFrases } from '../../scripts/biblioteca/fuentes.mjs';
import { normalizar as normalizarBusqueda } from '../../src/biblioteca/buscar.js';
import { frases, evidencias } from '../../src/biblioteca/formato.js';

// Palabras que no distinguen nada: las vacías y las de conversación («¿qué hace…?», «what does…», «erkläre…»), en los
// cinco idiomas de la app. Sin ellas, «¿qué hace el deltoides?» no trae frases que solo comparten «hace».
const VACIAS = new Set(('the a an of and or in on at to for by with from as is are was were be been being it its this that these those '
  + 'which who whom whose what when where how why than then there their they them also into onto over under between within without '
  + 'can may might will would should could not no nor but if so such each other some any all most more many much very only '
  + 'does did doing done have has had tell explain show know want need please thanks hello help study learn exam lesson about '
  + 'el la los las un una unos unas de del al y o u en con por para sin sobre entre es son fue ser esta este estos estas ese esa '
  + 'que se su sus lo le les como mas muy tambien cada otro otra otros otras hay donde cuando quien cual cuales cuanto cuantos cuanta cuantas '
  + 'hace hacen hacer tiene tienen tener sirve sirven estan estar quiero quisiera puedes podrias explica explicame dime saber entender '
  + 'acerca porque eso esto algo menos mucho bien mejor gracias hola favor ayuda ayudame necesito estudiar aprender examen repasar leccion lecciones '
  + 'was wie wann warum welche welcher welches ist sind hat haben macht machen der die das den dem des ein eine einen und oder mit von '
  + 'ich mir mich bitte erklar erklare zeig auch '
  + 'quoi quel quelle quels quelles comment pourquoi est sont fait font les des une avec pour sur dans moi explique '
  + 'che cosa quale quali dove come perche fanno hanno gli della dei delle uno spiega').split(' '));
/** Raíz sencilla: sin plural («nerves» → «nerv», «nervios» → «nervio»). */
const raiz = (w) => (w.length > 5 && w.endsWith('es') ? w.slice(0, -2) : w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w);
export const palabras = (s) => normalizarBusqueda(s).split(' ').filter((w) => w.length > 2 && !VACIAS.has(w)).map(raiz);

// Una frase de una página sirve de cita si es una oración completa de un tamaño razonable (no títulos, listas ni notas).
const RUIDO = /(\bretrieved\b|\bdoi\b|\bisbn\b|\bpmid\b|\barchived\b|\bp{1,2}\.\s*\d|\bet al\.|\^|https?:|\bthis article\b|\bsee also\b|wikcionario|wiktionary|wikimedia|wikispecies|real academia|\bdiccionario\b|\bdictionary\b)/i;
// Anatomía comparada (otros animales): no sirve para explicar la anatomía humana.
const NO_HUMANO = /\b(animals?|animales?|species|especies|reptiles?|amphibians?|anfibios?|birds|aves|fish(es)?|peces|dogs?|perros?|cats|gatos?|horses?|caballos?|cattle|ganado|rodents?|roedores?|mice|ratones|rats|ratas|apes|simios?|whales?|ballenas?|alligators?|crocodiles?|cocodrilos?|frogs?|ranas?|insects?|insectos?|dinosaurs?|dinosaurios?|sharks?|tiburones?|lizards?|lagartos?|snakes?|serpientes?|chickens?|pigs?|cerdos?|sheep|ovejas?|cows|vacas?|monkeys?|monos|chimpanzees?|chimpancés?|gorillas?|gorilas?|marsupials?|marsupiales?|ungulates?|cetaceans?)\b/i;
// Y que empiece como una oración (mayúscula, número o comillas): un trozo partido a la mitad no sirve de cita.
const esCitable = (s) => s.length >= 40 && s.length <= 450 && /^["“'‘(]?[A-ZÁÉÍÓÚÑ0-9]/.test(s) && /[.!?]["”’)]?$/.test(s) && /[a-záéíóú]{3}/i.test(s) && !RUIDO.test(s) && !NO_HUMANO.test(s);

export function crearCorpus() {
  const entradas = [];          // { id, citas: [{ f, c }], texto (frase de una lección) | null, leccion, paso, titulo }
  const fuentes = {};           // f → { titulo, url, licencia, revid, fecha, actualizada }
  const textos = new Map();     // f → texto normalizado de la página (para comprobar citas)
  const indice = new Map();     // palabra → [[entrada, veces]]
  const largos = [];
  let total = 0;
  const vistas = new Set();     // citas ya añadidas (f + cita normalizada)

  function indexar(texto, i) {
    const ws = palabras(texto);
    const veces = new Map();
    for (const w of ws) veces.set(w, (veces.get(w) ?? 0) + 1);
    for (const [w, n] of veces) { if (!indice.has(w)) indice.set(w, []); indice.get(w).push([i, n]); }
    largos[i] = ws.length;
    total += ws.length;
  }
  function añadir(e, textoBusqueda) {
    const i = entradas.length;
    entradas.push({ ...e, id: e.id ?? `E${i}` });
    indexar(textoBusqueda, i);
    return i;
  }

  /** Una página entera: se registra y se parte en frases citables. */
  function añadirFuente(f, meta, texto) {
    if (textos.has(f) || !texto) return;
    fuentes[f] = { titulo: meta.titulo, url: meta.url, licencia: meta.licencia, revid: meta.revid ?? null, fecha: meta.fecha ?? null, actualizada: meta.actualizada ?? null };
    textos.set(f, normalizarCita(texto));
    if (f.startsWith('tma:')) return;                     // © TeachMeSeries: se comprueba, pero no se ofrece entera
    partirFrases(texto).forEach((s, k) => {
      const c = s.trim();
      const huella = `${f}\n${normalizarCita(c)}`;
      if (!esCitable(c) || vistas.has(huella)) return;
      vistas.add(huella);
      añadir({ id: `P:${f}#${k}`, citas: [{ f, c }], texto: null, titulo: meta.titulo }, `${meta.titulo} ${c}`);
    });
  }

  /**
   * Las frases de una lección con sus citas (ya comprobadas en la biblioteca). Cada frase se busca por su texto, sus
   * citas, el título de su paso y los nombres de lo que muestra ese paso (no los de toda la lección: así «nasales» no
   * encuentra todas las frases de la lección de la cara por igual). Solo con las citas que se pueden comprobar aquí (su
   * página está cargada: por eso las páginas se añaden antes que las lecciones); una frase sin ninguna no se ofrece.
   * Así, un despliegue sin las páginas de TeachMeAnatomy no ofrece frases que solo se apoyan en ellas (la lección que
   * las usara no pasaría la comprobación).
   */
  function añadirLeccion(L) {
    for (const p of L.pasos ?? []) {
      const vista = p.vista ?? {};
      const nombres = [...(vista.ver ?? []), ...(vista.contexto ?? [])].map((k) => L.estructuras?.[k]?.nombre).filter(Boolean).join(' ');
      [...frases(p.texto), ...frases(p.detalle)].forEach((fr, k) => {
        const citas = evidencias(fr).filter((e) => e.f && e.c && textos.has(e.f)).map((e) => ({ f: e.f, c: e.c }));
        if (!citas.length) return;
        añadir({ id: `L:${L.id}#${p.id}#${k}`, citas, texto: fr[0], leccion: L.id, paso: p.id, titulo: L.titulo },
          `${fr[0]} ${citas.map((x) => x.c).join(' ')} ${p.titulo} ${nombres}`);
      });
    }
  }

  /**
   * Las mejores entradas para una consulta: [{ entrada, puntos, cobertura }]. `cobertura`: la parte de la información
   * de la consulta (sus palabras, pesadas por lo raras que son) que está en la entrada, de 0 a 1; no depende del tamaño
   * del corpus. `nombres`: nombres completos de estructuras (un extra si aparecen tal cual); `soloLecciones`/
   * `soloPaginas`; `porFuente`: tope de frases de una misma fuente.
   */
  /**
   * Una palabra que no está en ninguna frase se cambia por la más parecida que sí está (una letra de diferencia; dos
   * desde 8 letras): erratas y nombres de otro idioma («Bizeps» → «biceps», «deltoide» → «deltoid»).
   */
  const corregidas = new Map();
  function corregir(q) {
    if (indice.has(q) || q.length < 5) return q;
    if (corregidas.has(q)) return corregidas.get(q);
    const tope = q.length >= 8 ? 2 : 1;
    let mejor = null;
    for (const [w, lista] of indice) {
      if (Math.abs(w.length - q.length) > tope || w[0] !== q[0] && w[1] !== q[1]) continue;
      const d = distancia(q, w, tope);
      if (d <= tope && (!mejor || d < mejor.d || (d === mejor.d && lista.length > mejor.n))) mejor = { w, d, n: lista.length };
    }
    if (corregidas.size > 5000) corregidas.clear();
    corregidas.set(q, mejor?.w ?? q);
    return mejor?.w ?? q;
  }

  // `leccion`: solo las frases de esa lección (la que tiene abierta la persona); `paso`: las de ese paso, primero.
  function buscar(consulta, { nombres = [], max = 10, soloLecciones = false, soloPaginas = false, porFuente = 6, excluir = new Set(), leccion = null, paso = null } = {}) {
    const qs = [...new Set(palabras(consulta).map(corregir))];
    const N = entradas.length || 1;
    const medio = total / N || 1;
    const puntos = new Map();
    const cubre = new Map();
    let informacion = 0;
    for (const q of qs) {
      const lista = indice.get(q);
      if (!lista) continue;
      const idf = Math.log(1 + (N - lista.length + 0.5) / (lista.length + 0.5));
      informacion += idf;
      for (const [i, tf] of lista) {
        const p = idf * ((tf * 2.2) / (tf + 1.2 * (0.25 + 0.75 * (largos[i] / medio))));
        puntos.set(i, (puntos.get(i) ?? 0) + p);
        cubre.set(i, (cubre.get(i) ?? 0) + idf);
      }
    }
    const frasesN = nombres.map((n) => normalizarBusqueda(n)).filter((n) => n.length > 3);
    const out = [];
    const cuenta = new Map();
    for (const [i, p] of [...puntos].sort((a, b) => b[1] - a[1])) {
      const e = entradas[i];
      if (excluir.has(e.id) || (soloLecciones && !e.leccion) || (soloPaginas && e.leccion) || (leccion && e.leccion !== leccion)) continue;
      const texto = normalizarBusqueda(`${e.texto ?? ''} ${e.citas.map((x) => x.c).join(' ')}`);
      const extra = frasesN.filter((n) => texto.includes(n)).length * 4 + (paso && e.paso === paso ? p * 0.5 : 0);
      out.push({ entrada: e, puntos: p + extra, cobertura: informacion ? cubre.get(i) / informacion : 0 });
    }
    out.sort((a, b) => b.puntos - a.puntos);
    const elegidas = [];
    for (const x of out) {
      const f = x.entrada.leccion ?? x.entrada.citas[0].f;
      if ((cuenta.get(f) ?? 0) >= porFuente) continue;
      cuenta.set(f, (cuenta.get(f) ?? 0) + 1);
      elegidas.push(x);
      if (elegidas.length >= max) break;
    }
    return elegidas;
  }

  /** ¿Está la cita, palabra por palabra, en su página? (null si la página no está cargada). */
  function citaEnFuente(f, c) {
    const t = textos.get(f);
    if (t == null) return null;
    return t.includes(normalizarCita(c));
  }

  /** Cuántas frases citables hablan de una estructura (por sus nombres completos o por sus palabras). */
  function cuantas(nombres) {
    const ns = nombres.map((n) => normalizarBusqueda(n)).filter((n) => n.length > 3);
    if (!ns.length) return 0;
    const ws = [...new Set(ns.flatMap((n) => palabras(n)))];
    const cand = new Set();
    for (const w of ws) for (const [i] of indice.get(w) ?? []) cand.add(i);
    let n = 0;
    for (const i of cand) {
      const e = entradas[i];
      const texto = normalizarBusqueda(`${e.texto ?? ''} ${e.citas.map((x) => x.c).join(' ')}`);
      if (ns.some((x) => texto.includes(x))) n++;
    }
    return n;
  }

  return {
    añadirFuente, añadirLeccion, buscar, citaEnFuente, cuantas,
    tieneFuente: (f) => textos.has(f),
    fuente: (f) => fuentes[f] ?? null,
    get tamaño() { return entradas.length; },
  };
}

/** Distancia de edición entre dos palabras, cortando en cuanto pasa de `tope` (devuelve tope + 1). */
function distancia(a, b, tope) {
  let previa = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const fila = [i];
    let minimo = i;
    for (let j = 1; j <= b.length; j++) {
      fila[j] = Math.min(previa[j] + 1, fila[j - 1] + 1, previa[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (fila[j] < minimo) minimo = fila[j];
    }
    if (minimo > tope) return tope + 1;
    previa = fila;
  }
  return previa[b.length];
}

/** Páginas guardadas en disco (las de la biblioteca y las de Neuri): [{ f, meta, texto }]. */
export function paginasGuardadas(raices) {
  const out = [];
  for (const raiz of raices) {
    for (const tipo of ['wp', 'wpes', 'tma']) {
      const dir = path.join(raiz, tipo);
      if (!fs.existsSync(dir)) continue;
      for (const archivo of fs.readdirSync(dir).filter((x) => x.endsWith('.json')).sort()) {
        try {
          const d = JSON.parse(fs.readFileSync(path.join(dir, archivo), 'utf8'));
          if (d?.id && d.texto) out.push({ f: d.id, meta: d, texto: d.texto });
        } catch { /* página dañada: se ignora */ }
      }
    }
  }
  return out;
}

// ── Wikipedia en el momento (temas sin páginas guardadas) ──
const UA = 'Anato3D-Neuri/1.0 (herramienta educativa; sin datos personales)';
const archivoPagina = (dir, f) => path.join(dir, f.slice(0, f.indexOf(':')), `${f.slice(f.indexOf(':') + 1).replace(/[^A-Za-z0-9_.,()'-]+/g, '_')}.json`);

/**
 * Baja de Wikipedia (inglés o español) la versión actual de una página, como fuentes.mjs, y la guarda en `dir`.
 * Devuelve { f, meta, texto } o null si no existe. Solo Wikipedia: su licencia (CC BY-SA 4.0) permite citarla y guardarla.
 */
export async function traerWikipedia(titulo, { idioma = 'en', dir = null, fetch = globalThis.fetch, esperaMs = 10_000 } = {}) {
  const tipo = idioma === 'es' ? 'wpes' : 'wp';
  const host = idioma === 'es' ? 'es.wikipedia.org' : 'en.wikipedia.org';
  const limpio = String(titulo ?? '').replace(/\s+/g, ' ').trim().slice(0, 120);
  if (!limpio || /[#<>[\]{}|]/.test(limpio)) return null;
  const f = `${tipo}:${limpio.replace(/ /g, '_')}`;
  if (dir) {
    try { const d = JSON.parse(fs.readFileSync(archivoPagina(dir, f), 'utf8')); if (d?.texto) return { f: d.id, meta: d, texto: d.texto }; } catch { /* no guardada */ }
  }
  const q = `https://${host}/w/api.php?action=query&format=json&formatversion=2&redirects=1&prop=extracts|revisions&explaintext=1&exsectionformat=plain&rvprop=ids|timestamp&titles=${encodeURIComponent(limpio)}`;
  const control = new AbortController();
  const reloj = setTimeout(() => control.abort(), esperaMs);
  let r;
  try { r = await fetch(q, { headers: { 'User-Agent': UA, 'Api-User-Agent': UA, Accept: 'application/json' }, signal: control.signal }); }
  finally { clearTimeout(reloj); }
  if (!r.ok) throw new Error(`Wikipedia respondió ${r.status}`);
  const p = (await r.json()).query?.pages?.[0];
  if (!p || p.missing || !p.extract || p.extract.length < 500) return null;
  const rev = p.revisions?.[0]?.revid ?? null;
  const id = `${tipo}:${p.title.replace(/ /g, '_')}`;
  const meta = {
    id, titulo: p.title, url: `https://${host}/w/index.php?title=${encodeURIComponent(p.title.replace(/ /g, '_'))}${rev ? `&oldid=${rev}` : ''}`,
    revid: rev, actualizada: p.revisions?.[0]?.timestamp?.slice(0, 10) ?? null, licencia: 'CC BY-SA 4.0', fecha: new Date().toISOString().slice(0, 10),
  };
  if (dir) {
    try { fs.mkdirSync(path.dirname(archivoPagina(dir, id)), { recursive: true }); fs.writeFileSync(archivoPagina(dir, id), JSON.stringify({ ...meta, texto: p.extract })); } catch { /* sin disco: solo en memoria */ }
  }
  return { f: id, meta, texto: p.extract };
}
