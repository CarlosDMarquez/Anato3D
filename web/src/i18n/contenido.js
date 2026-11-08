// Contenido de las fichas y del módulo de estudio en el idioma actual.
// El contenido se escribe en español (data/, content/). Sus traducciones están en public/i18n/contenido-<id>.json:
// { huella del texto español: traducción }. Las genera scripts/contenido-i18n.mjs (lotes traducidos con IA, sin revisar
// por un especialista; los nombres de los grupos salen de las tablas oficiales de nombres.js). Lo que no tenga
// traducción se muestra en español.
import { idioma, t } from './idioma.js';
import { fetchJSON } from '../loading.js';
import { LATIN } from '../data/latin.js';
import { latinEtymology } from '../data/musculos.js';

const memorias = {};

/** Huella de un texto (FNV-1a de 32 bits, en base 36): la clave de su traducción. */
export function huella(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36);
}

/** Descarga las traducciones del contenido de un idioma (una vez). Sin ellas, el contenido sale en español. */
export async function cargarContenido(id) {
  if (id === 'es' || memorias[id]) return;
  ponerMemoria(id, await fetchJSON(`/i18n/contenido-${id}.json`));
}

/** Traducciones de un idioma ({ huella: texto }); la usan cargarContenido y las pruebas. */
export function ponerMemoria(id, memoria) {
  memorias[id] = memoria;
}

/** Un texto del contenido en el idioma actual (o en español si no tiene traducción). */
export function tr(es) {
  if (!es || idioma() === 'es') return es;
  return memorias[idioma()]?.[huella(es)] ?? es;
}

/** Si un texto del contenido tiene traducción en el idioma actual (en español, siempre). */
export function traducido(es) {
  return !es || idioma() === 'es' || huella(es) in (memorias[idioma()] ?? {});
}

/**
 * Etimología en el idioma actual. Las generadas palabra por palabra desde el glosario latino (latinEtymology, «Del latín
 * musculus, «…»; …») se rehacen con el glosario traducido; las escritas a mano se traducen enteras.
 * `latines`: los nombres latinos de los que pudo salir (el de la ficha y el del modelo).
 */
export function trEtimologia(es, latines = []) {
  if (!es || idioma() === 'es') return es;
  const latin = latines.find((l) => l && latinEtymology(l) === es);
  if (!latin) return tr(es);
  const vistas = new Set();
  const partes = [];
  for (const w of latin.replace(/[()[\],]/g, ' ').split(/\s+/).filter(Boolean)) {
    const k = w.toLowerCase();
    if (!LATIN[k] || vistas.has(k)) continue;
    vistas.add(k);
    partes.push(t('etimologia.parte', { palabra: k, significado: tr(LATIN[k]) }));
  }
  return t('etimologia.latin', { partes: partes.join(t('etimologia.separador')) });
}

/** Citas con formato bibliográfico español («título», 2.ª ed., n.º, código): se adaptan al idioma pieza a pieza. */
export const esCitaConFormato = (s) => /«|n\.º|código|^Terminologia Anatomica/.test(s);

/** Cita de una fuente en el idioma actual: las de formato bibliográfico se adaptan; las frases, con la memoria. */
export function trCita(es) {
  if (!es || idioma() === 'es') return es;
  if (!esCitaConFormato(es)) return tr(es);
  return es
    .replace('Terminologia Anatomica, 2.ª ed.', t('fuente.ta2'))
    .replace(/, término n\.º (\S+)/, (_, n) => `, ${t('ficha.termino', { n })}`)
    .replace(/, código (\S+)$/, (_, c) => `, ${t('fuente.codigo', { c })}`)
    .replace('Wikipedia (en inglés)', t('fuente.wikipediaEn'))
    .replace('Wiktionary (en inglés)', t('fuente.wiktionaryEn'))
    .replace(/: «/g, idioma() === 'fr' ? ' : «' : ': «')
    .replace(/«([^»]+)»/g, (_, titulo) => t('fuente.titulo', { titulo }));
}
