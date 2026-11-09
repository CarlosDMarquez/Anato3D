// Inventario de las estructuras de los modelos 3D para Neuri (server/generado/inventario.json, de
// scripts/neuri-datos.mjs): qué piezas existen, cómo se llaman en cada idioma y de qué tipo, sistema y región son.
// Neuri solo planifica y redacta con estructuras de aquí, así que todo lo que propone se puede ver en el visor.
import fs from 'node:fs';
import { normalizar as normalizarBusqueda } from '../../src/biblioteca/buscar.js';
import { REGION_POR_ID, SUBREGION_POR_ID } from '../../src/biblioteca/taxonomia.js';

const ARCHIVO = new URL('../generado/inventario.json', import.meta.url);

/** Carga el inventario: { estructuras: { clave → datos }, nombre(clave, idioma), piezasDe(modelo), candidatas(…) }. */
export function cargarInventario(datos = JSON.parse(fs.readFileSync(ARCHIVO, 'utf8'))) {
  const E = datos.estructuras;
  const claves = Object.keys(E);
  const piezas = { male: new Set(), female: new Set() };
  for (const [k, e] of Object.entries(E)) {
    for (const m of e.modelos) {
      if (e.lado === 'bilateral') { piezas[m].add(`${k}_L`); piezas[m].add(`${k}_R`); } else piezas[m].add(k);
    }
  }
  // Palabras de cada estructura en todos sus nombres, para encontrarla por lo que se escribe.
  const palabras = new Map(claves.map((k) => [k, new Set(normalizarBusqueda([E[k].es, E[k].en, E[k].la, E[k].fr, E[k].it].filter(Boolean).join(' ')).split(' ').filter((w) => w.length > 2))]));
  /** Estructuras cuyo nombre tiene una palabra de la consulta (igual o, desde 5 letras, como prefijo: «nasales» → «nasal»). */
  const conPalabra = (q) => claves.filter((k) => [...palabras.get(k)].some((w) => w === q || (q.length >= 5 && w.startsWith(q.slice(0, -1)))));
  // Una palabra cuenta según lo rara que es entre los nombres: «nasal» distingue; «mayor» o «lateral», casi nada.
  const N = claves.length;
  const peso = (n) => Math.min(1, Math.log((N + 1) / (n + 1)) / Math.log((N + 1) / 11));

  // Los nombres tal como aparecen en un texto («nasal bone», «hueso nasal», y sin la palabra genérica: «masseter»),
  // indexados por su primera palabra, para saber qué estructuras nombran unas frases.
  const nombresEnTexto = new Map();
  for (const k of claves) {
    const vs = new Set();
    for (const n of [E[k].es, E[k].en, E[k].la]) {
      if (!n) continue;
      const ws = normalizarBusqueda(n).split(' ').filter(Boolean);
      if (ws.join(' ').length >= 5) vs.add(ws.join(' '));
      // Sin la palabra genérica solo los músculos y los huesos («el masetero», «el temporal»), y nunca si lo que queda
      // es una palabra corriente («tibial», «mayor»): las arterias y los nervios se nombran con su palabra.
      const sin = ws.filter((w) => !GENERICAS.has(w));
      const generica = ws.find((w) => GENERICAS.has(w));
      if (sin.length && sin.length < ws.length && SIN_GENERICA.has(generica) && sin.join(' ').length >= 6 && !(sin.length === 1 && CORRIENTES.has(sin[0]))) vs.add(sin.join(' '));
      // Las partes también se nombran por su todo: «el masetero» habla de sus porciones superficial y profunda.
      const parte = ws.join(' ').match(PARTE_DE);
      const todo = (parte?.[1] ?? parte?.[2])?.split(' ').filter((w) => !GENERICAS.has(w));
      if (todo?.length && todo.join(' ').length >= 6 && !(todo.length === 1 && CORRIENTES.has(todo[0]))) vs.add(todo.join(' '));
    }
    for (const v of vs) {
      const ws = v.split(' ');
      if (!nombresEnTexto.has(ws[0])) nombresEnTexto.set(ws[0], []);
      nombresEnTexto.get(ws[0]).push([k, ws]);
    }
  }

  /** Cuántas veces nombran unos textos a cada estructura: Map clave → textos que la nombran. */
  function mencionadas(textos) {
    const n = new Map();
    for (const t of textos) {
      const ws = normalizarBusqueda(t).split(' ');
      const vistas = new Set();
      for (let i = 0; i < ws.length; i++) {
        for (const [k, v] of nombresEnTexto.get(ws[i]) ?? []) {
          if (vistas.has(k)) continue;
          // La última palabra puede ir en plural («nasal bones», «nasales»).
          if (v.every((w, j) => ws[i + j] === w || (j === v.length - 1 && (ws[i + j] === `${w}s` || ws[i + j] === `${w}es`)))) { vistas.add(k); n.set(k, (n.get(k) ?? 0) + 1); }
        }
      }
    }
    return n;
  }

  /** Nombre en un idioma: alemán con el latín, como el visor; si falta, el inglés o el español. */
  function nombre(clave, idioma = 'es') {
    const e = E[clave];
    if (!e) return null;
    if (idioma === 'de') return e.la || e.en || e.es;
    return e[idioma] || (idioma === 'es' ? e.es : e.en) || e.la || e.es;
  }

  /**
   * Estructuras candidatas para un tema, de más a menos relacionadas; como mucho `max`. Cuentan:
   *  - las palabras del texto que están en sus nombres, cada una según lo rara que es;
   *  - el tipo que pide el texto («huesos», «muscles», «Nerven»…) o los temas de la biblioteca, mucho más dentro del lugar;
   *  - el lugar (región y subregión de la taxonomía) y, si ya cuentan por otra cosa, el sistema;
   *  - `relacionadas`: Map clave → puntos (las de las lecciones del tema y las que nombran sus mejores evidencias);
   *  - `extra`: claves que tienen que estar (las de una lección base).
   */
  function candidatas({ texto = '', lugares = [], sistemas = [], temas = [], relacionadas = new Map(), extra = [], max = 80 } = {}) {
    const todas = normalizarBusqueda(texto).split(' ').filter((w) => w.length > 3);
    const tipos = new Set([...todas.map((w) => TIPO_DE_PALABRA.get(w)).filter(Boolean).flat(), ...temas.flatMap((t) => TIPOS_DE_TEMA[t] ?? [])]);
    const qs = [...new Set(todas.filter((w) => !TIPO_DE_PALABRA.has(w) && !NO_DISTINGUEN.has(w)))];
    const puntos = new Map();
    const sumar = (k, p) => { if (p) puntos.set(k, (puntos.get(k) ?? 0) + p); };
    for (const q of qs) {
      const con = conPalabra(q);
      for (const k of con) sumar(k, 10 * peso(con.length));
    }
    for (const k of claves) {
      const e = E[k];
      const enRegion = !lugares.length || lugares.some(([r]) => e.lugares.some(([er]) => er === r));
      for (const [r, s] of lugares) {
        if (e.lugares.some(([er, es]) => er === r && s && es === s)) sumar(k, 6);
        else if (e.lugares.some(([er]) => er === r)) sumar(k, s ? 2 : 4);
      }
      // El tipo pedido cuenta mucho dentro del lugar; sin lugar, poco (son cientos: lo que decide es lo demás).
      if (tipos.size && tipos.has(grupoTipo(e.tipo))) sumar(k, !lugares.length ? 3 : enRegion ? 8 : 1);
    }
    for (const [k, p] of relacionadas) if (E[k]) sumar(k, p);
    for (const k of claves) if (puntos.has(k) && sistemas.includes(E[k].sistema)) sumar(k, 3);
    for (const k of extra) if (E[k]) sumar(k, 100);
    return [...puntos].filter(([, p]) => p > 0).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, max).map(([k]) => k);
  }

  /** Estructuras del mismo tipo (o grupo) y región que otra: para los distractores de una identificación. */
  function parecidas(clave, { idioma = 'es', excluir = [], max = 6 } = {}) {
    const e = E[clave];
    if (!e) return [];
    // Primero las de la misma subregión (las que de verdad se confunden con ella), luego las de la misma región.
    const misma = (x) => x.lugares.some(([r]) => e.lugares.some(([r2]) => r === r2));
    const cerca = (x) => x.lugares.some(([r, s]) => s && e.lugares.some(([r2, s2]) => r === r2 && s === s2));
    return claves.filter((k) => k !== clave && !excluir.includes(k) && grupoTipo(E[k].tipo) === grupoTipo(e.tipo) && misma(E[k]))
      .sort((a, b) => Number(cerca(E[b])) - Number(cerca(E[a])))
      .map((k) => nombre(k, idioma)).filter((n, i, a) => n && n !== nombre(clave, idioma) && a.indexOf(n) === i).slice(0, max);
  }

  return { estructuras: E, claves, nombre, piezasDe: (m) => piezas[m], candidatas, parecidas, mencionadas };
}

// Grupos de tipos que se confunden entre sí (los mismos que la evaluación, src/biblioteca/formato.js).
const GRUPO_TIPO = { arteria: 'vaso', vena: 'vaso', cartilago: 'hueso', diente: 'hueso', capsula: 'ligamento', glandula: 'organo' };
const grupoTipo = (t) => GRUPO_TIPO[t] ?? t;

// Palabras que piden un tipo de estructura, en los cinco idiomas (sin acentos), con el grupo que piden.
const TIPO_DE_PALABRA = new Map(Object.entries({
  hueso: 'hueso huesos osea oseo oseos oseas bone bones skeleton esqueleto knochen skelett osseux squelette osso ossa ossi scheletro',
  musculo: 'musculo musculos musculatura muscle muscles musculature muskel muskeln muskulatur muscolo muscoli muscolatura',
  tendon: 'tendon tendones tendons sehne sehnen tendine tendini',
  ligamento: 'ligamento ligamentos ligament ligaments bander legamento legamenti',
  vaso: 'arteria arterias artery arteries arterie arterien artere arteres vena venas vein veins vene venen veine veines vaso vasos vessel vessels gefass gefasse vaisseau vaisseaux vasi',
  nervio: 'nervio nervios nerve nerves nerv nerven nerf nerfs nervo nervi inervacion innervation',
  organo: 'organo organos organ organs organe organes viscera visceras eingeweide glandula glandulas gland glands druse drusen glande glandes ghiandola ghiandole',
  nodo: 'linfatico linfaticos lymph lymphatic lymphknoten linfonodo linfonodi',
  snc: 'encefalo cerebro brain gehirn cerveau encephale cervello',
  corazon: 'corazon heart herz coeur cuore',
  piel: 'piel skin haut peau pelle',
  fascia: 'fascia fascias faszie faszien',
  bolsa: 'bursa bursas bursae',
  vaina: 'vaina vainas sheath sheaths',
}).flatMap(([tipo, ws]) => ws.split(' ').map((w) => [w, tipo])));
// Temas de la biblioteca (taxonomía) → grupos de tipos.
const TIPOS_DE_TEMA = {
  huesos: ['hueso'], 'accidentes-oseos': ['hueso'], musculos: ['musculo', 'tendon'], movimientos: ['musculo'], articulaciones: ['ligamento', 'hueso', 'bolsa'],
  'arterias-venas': ['vaso'], nervios: ['nervio'], organos: ['organo'], compartimentos: ['musculo', 'fascia'],
};
// Palabras de un tema que no distinguen estructuras (están en cientos de nombres o no son anatomía).
const NO_DISTINGUEN = new Set('conocer identificar localizar describir explicar estudiar aprender principales principal basico basica basicos avanzado avanzada nivel minutos leccion repaso relaciones relacion funcion funciones partes parte estructura estructuras anatomia derecho derecha izquierdo izquierda lateral medial superior inferior anterior posterior mayor menor profundo profunda superficial'.split(' '));
// Palabras genéricas de los nombres (para encontrar «masseter» en un texto aunque el nombre sea «Masseter muscle»).
const GENERICAS = new Set('muscle muscles musculo musculus bone bones hueso os artery arteria vein vena nerve nervio nervus ligament ligamento of the de del la el los las'.split(' '));
const SIN_GENERICA = new Set('muscle muscles musculo musculus bone bones hueso os'.split(' '));
// «Superficial part of masseter», «Cabeza lateral del músculo gastrocnemio» → el todo («masseter», «gastrocnemio»).
const PARTE_DE = /^(?:\S+ )*?(?:parts?|heads?|belly|bellies|portions?|fibers|fibres)(?: \S+)*? of (?:the )?(.+)$|^(?:porcion|parte|cabeza|vientre|fibras)(?: \S+)*? (?:del|de la|de los|de las) (.+)$/;
const CORRIENTES = new Set('grande mayor menor largo corto ancho comun lateral medial anterior posterior superior inferior interno externo profundo superficial tibial fibular radial ulnar facial temporal frontal nasal oral dorsal palmar plantar accesorio transverso oblicuo recto redondo cuadrado'.split(' '));

/** Lugar legible para las instrucciones: «Cabeza › Cara». */
export const nombreLugar = ([r, s]) => [REGION_POR_ID.get(r)?.nombre ?? r, s && (SUBREGION_POR_ID.get(s)?.nombre ?? s)].filter(Boolean).join(' › ');
