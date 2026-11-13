// Limitaciones conocidas del modelo 3D (src/data/limitaciones.js) para Neuri: lo que Claude necesita saber de las
// estructuras con las que va a trabajar, y nada más (solo las que tienen alguna limitación, y solo de esas). Van en el
// bloque variable de cada llamada, nunca en el fijo (que es el mismo para todas y se guarda en caché).
// Las instrucciones no bastan: ensamblar.mjs quita además, de forma determinista, las preguntas y actividades en 3D que
// pidan ver o tocar una pieza que el modelo muestra mal.
import { LIMITACIONES, limitacionesDe, textoLimitacion } from '../../src/data/limitaciones.js';
import { normalizar } from '../../src/biblioteca/buscar.js';

const QUE_NO = {
  identificar: 'preguntas de identificar',
  localizar: 'preguntas o actividades de localizar (ni como candidata)',
  distractor: 'opciones falsas',
};

/**
 * La nota de una estructura del inventario (su clave, sin el lado), en español, o '' si no tiene limitaciones: qué le
 * pasa en el modelo y qué no se puede pedir con ella.
 */
export function notaLimite(clave) {
  return limitacionesDe(clave).map((l) => {
    const no = l.restringe.map((u) => QUE_NO[u]).filter(Boolean);
    return `LIMITACIÓN DEL MODELO 3D: ${textoLimitacion(l, 'aviso', 'es')} ${no.length ? `No la uses en ${no.join(', ')}; puedes explicarla con fuentes, sin pedir que se mire en el modelo.` : 'Puede señalarse lo que se ve, pero no describas lo que falta como si se viera en el modelo.'}`;
  }).join(' ');
}

/** El bloque para el prompt con las limitaciones de unas estructuras (claves del inventario), o '' si ninguna tiene. */
export function textoLimites(claves) {
  const lineas = [...new Set(claves)].map((k) => [k, notaLimite(k)]).filter(([, n]) => n).map(([k, n]) => `- ${k}: ${n}`);
  return lineas.length ? `LIMITACIONES DEL MODELO 3D de estas estructuras (la app no hará con ellas lo que aquí se prohíbe):\n${lineas.join('\n')}` : '';
}

/**
 * Las piezas del registro (claves sin el lado) que nombran unos textos con su nombre completo en cualquiera de los
 * idiomas del inventario: español, inglés, latín, francés o italiano (el alemán usa el latín). `inventario.mencionadas`
 * solo mira es/en/la y sirve además para puntuar candidatas, así que no se toca: esto es solo para las notas.
 */
export function limitadasEn(textos, inventario) {
  const conBordes = (s) => ` ${normalizar(s)} `;
  const ts = textos.filter(Boolean).map(conBordes);
  if (!ts.length) return [];
  return [...new Set(LIMITACIONES.flatMap((l) => l.piezas))].filter((k) => {
    const e = inventario?.estructuras?.[k];
    const nombres = [k.replace(/_/g, ' '), e?.es, e?.en, e?.la, e?.fr, e?.it].filter(Boolean).map(conBordes);
    return nombres.some((n) => ts.some((t) => t.includes(n)));
  });
}

/**
 * Las piezas del registro que el inventario sitúa en unas regiones (ids de primer nivel de la taxonomía) o en unos
 * sistemas. Sirve para repartir un recorrido: así no se planifica una unidad centrada en una pieza que el modelo muestra
 * mal. Las unidades se crean después por el camino de siempre, que además las quita de forma determinista.
 */
export function limitadasEnZona(inventario, { regiones = [], sistemas = [] } = {}) {
  return [...new Set(LIMITACIONES.flatMap((l) => l.piezas))].filter((k) => {
    const e = inventario?.estructuras?.[k];
    return !!e && ((e.lugares ?? []).some(([r]) => regiones.includes(r)) || sistemas.includes(e.sistema));
  });
}

/** Claves del inventario de todas las piezas de una lección (de cada estructura, todas sus piezas, sin el lado). */
export const clavesDeLeccion = (L) => Object.values(L?.estructuras ?? {}).flatMap((e) => (e.piezas ?? []).map((p) => String(p).replace(/_[LR]$/, '')));

// ── Recorridos: lo que una unidad no puede pedir con una pieza limitada ──
// Verbos de localizar o reconocer y palabras de trayecto, en los cinco idiomas (sobre el texto normalizado: minúsculas,
// sin acentos, palabras separadas por un espacio). Solo se miran en las unidades que nombran una pieza limitada.
const LOCALIZAR = / (localiz|ubic|situ|senal|encuentr|encontr|identific|reconoc|toca|toque|tocar|marca|locat|identif|find|point|recogni|spot|pinpoint|tap|lokalis|finde|zeig|erkenn|bestimm|trouv|reconna|montr|indique|individu|trov|ricono|indica)\w* /;
const TRAYECTO = / (recorrido|trayect|rama|ramas|ramific|sigue|seguir|traza|course|path|branch|branches|trace|follow|verlauf|verfolg|aste|trajet|parcours|branche|branches|suivre|decorso|percorso|ramo|rami|segui)\w* /;
// Cómo lo muestra mal el modelo, para la ronda de corrección (en español).
const COMO = { ubicacion: 'fuera de sitio', identidad: 'con un nombre dudoso' };
// La frase con la que se acota una unidad, en el idioma de la persona («esta pieza»: vale para cualquier estructura).
const ACOTADO = {
  ubicacion: {
    es: (n) => `Explicar con fuentes «${n}»: en el modelo 3D esta pieza está fuera de sitio, así que no se pide localizarla.`,
    en: (n) => `Explain “${n}” with sources: in the 3D model this piece is misplaced, so locating it is not asked.`,
    de: (n) => `„${n}“ mit Quellen erklären: Im 3D-Modell ist dieses Teil falsch platziert, deshalb wird nicht verlangt, es zu lokalisieren.`,
    fr: (n) => `Expliquer « ${n} » avec des sources : dans le modèle 3D, cette pièce est mal placée, on ne demande donc pas de la localiser.`,
    it: (n) => `Spiegare «${n}» con le fonti: nel modello 3D questo pezzo è fuori posto, quindi non si chiede di localizzarlo.`,
  },
  identidad: {
    es: (n) => `Explicar con fuentes «${n}»: en el modelo 3D esta pieza tiene un nombre dudoso, así que no se pide reconocerla.`,
    en: (n) => `Explain “${n}” with sources: in the 3D model this piece has a doubtful name, so recognizing it is not asked.`,
    de: (n) => `„${n}“ mit Quellen erklären: Im 3D-Modell hat dieses Teil einen fraglichen Namen, deshalb wird nicht verlangt, es zu erkennen.`,
    fr: (n) => `Expliquer « ${n} » avec des sources : dans le modèle 3D, cette pièce porte un nom douteux, on ne demande donc pas de la reconnaître.`,
    it: (n) => `Spiegare «${n}» con le fonti: nel modello 3D questo pezzo ha un nome dubbio, quindi non si chiede di riconoscerlo.`,
  },
  trayecto: {
    es: (n) => `Señalar el tramo visible de «${n}» y explicar su recorrido con fuentes: el modelo 3D solo muestra una parte.`,
    en: (n) => `Point out the visible segment of “${n}” and explain its course with sources: the 3D model shows only part of it.`,
    de: (n) => `Den sichtbaren Abschnitt von „${n}“ zeigen und den Verlauf mit Quellen erklären: Das 3D-Modell zeigt nur einen Teil.`,
    fr: (n) => `Montrer le segment visible de « ${n} » et expliquer son trajet avec des sources : le modèle 3D n’en montre qu’une partie.`,
    it: (n) => `Indicare il tratto visibile di «${n}» e spiegarne il decorso con le fonti: il modello 3D ne mostra solo una parte.`,
  },
};

/**
 * Las piezas limitadas que nombra cada unidad de un recorrido y lo que pide con ellas que el modelo no deja: localizarla
 * o reconocerla (si su limitación lo restringe) o seguir un trayecto que no se ve (pieza incompleta). Devuelve, por
 * unidad, { n, piezas, problemas: [{ clave, tipo: 'localizar'|'trayecto', limitacion }] }.
 */
export function limitesDeUnidades(unidades, inventario) {
  return (unidades ?? []).map((u, i) => {
    const piezas = limitadasEn([u.titulo, u.objetivo, u.enfoque, ...(u.terminos ?? [])], inventario);
    const pide = ` ${normalizar(`${u.titulo ?? ''} ${u.objetivo ?? ''} ${u.enfoque ?? ''}`)} `;
    const problemas = [];
    for (const clave of piezas) {
      for (const l of limitacionesDe(clave)) {
        if (l.restringe.some((x) => x === 'localizar' || x === 'identificar') && LOCALIZAR.test(pide)) problemas.push({ clave, tipo: 'localizar', limitacion: l });
        else if (l.tipo === 'incompleta' && TRAYECTO.test(pide)) problemas.push({ clave, tipo: 'trayecto', limitacion: l });
      }
    }
    return { n: i + 1, piezas, problemas };
  });
}

/** Los problemas de las unidades, para la ronda de corrección de Claude (en español, como el resto de instrucciones). */
export function erroresDeUnidades(lim, inventario) {
  return lim.flatMap(({ n, problemas }) => problemas.map(({ clave, tipo, limitacion: l }) => {
    const nombre = inventario?.nombre?.(clave, 'es') ?? clave;
    return tipo === 'localizar'
      ? `unidad ${n}: pide localizar o reconocer «${nombre}» (${clave}), que el modelo 3D muestra ${COMO[l.tipo] ?? 'mal'}: replantéala para explicarla con fuentes, sin pedir que se busque, se toque ni se reconozca en el modelo`
      : `unidad ${n}: pide seguir el recorrido o las ramas de «${nombre}» (${clave}), pero el modelo 3D solo muestra un tramo: que la actividad se limite al tramo visible y el recorrido se explique con fuentes`;
  }));
}

/**
 * Lo que, aun después de la corrección, pide evaluar en el modelo lo que este muestra mal se acota aquí, sin la IA: el
 * objetivo de la unidad pasa a una frase fija en el idioma de la persona y el enfoque, que lo repetía, se vacía.
 * Devuelve cuántas unidades se acotaron.
 */
export function acotarUnidades(recorrido, lim, inventario, idioma = 'es') {
  let n = 0;
  for (const { n: k, problemas } of lim) {
    if (!problemas.length) continue;
    const u = recorrido.unidades[k - 1];
    const { clave, tipo, limitacion: l } = problemas[0];
    const nombre = inventario?.nombre?.(clave, idioma) ?? clave;
    const frases = ACOTADO[tipo === 'trayecto' ? 'trayecto' : l.tipo === 'identidad' ? 'identidad' : 'ubicacion'];
    const f = frases[idioma] ?? frases.es;
    u.objetivo = f(nombre);
    u.enfoque = '';
    n++;
  }
  return n;
}

/**
 * Las notas de un recorrido sobre las piezas limitadas que nombran sus unidades (el aviso del registro, en el idioma de
 * la persona), delante de las que ya traiga; como mucho `max`.
 */
export function notasDeLimites(lim, idioma = 'es', otras = [], max = 6) {
  const vistas = new Set();
  const notas = [];
  for (const { piezas } of lim) for (const k of piezas) for (const l of limitacionesDe(k)) {
    if (vistas.has(l.id)) continue;
    vistas.add(l.id);
    notas.push(textoLimitacion(l, 'aviso', idioma));
  }
  return [...notas, ...(otras ?? []).filter((x) => !notas.includes(x))].slice(0, max);
}
