// Lo que la interfaz de las sesiones con Neuri calcula sin tocar el DOM (y se prueba con `npm test`): qué pasos de una
// lección enseña un bloque, el resultado de un bloque de preguntas (a la primera, con ayuda, reveladas), la pista de un
// segundo intento (una frase ya verificada del paso donde se enseña la estructura, sin su nombre), cuándo vuelve al
// repaso lo que conviene repasar y los dos siguientes pasos que se sugieren al terminar.
// Sin DOM ni textos de la interfaz: quien llama pasa `tr` (el contenido en el idioma de la interfaz).
import { frases } from '../../biblioteca/formato.js';

/**
 * Los índices (en L.pasos) que enseña un bloque de lección, en su orden. Sin `pasos` (la lección entera) o si ninguno de
 * los suyos existe ya (la lección cambió), todos.
 */
export function pasosDeBloque(L, bloque) {
  const todos = (L?.pasos ?? []).map((_, k) => k);
  if (!Array.isArray(bloque?.pasos) || !bloque.pasos.length) return todos;
  const pedidos = new Set(bloque.pasos);
  const k = todos.filter((i) => pedidos.has(L.pasos[i].id));
  return k.length ? k : todos;
}

/**
 * El resultado de un bloque de preguntas a partir de sus respuestas [{ pregunta: { item }, resultado, saltada, ayuda }]
 * (y de lo respondido antes de reanudarlo, `previo`): { aciertos (a la primera), conAyuda (bien tras la pista o el
 * segundo intento), revelados (falladas: se enseñó la respuesta), total (sin las saltadas por un fallo técnico), fallos
 * (ids de ítem) }.
 */
export function resultadoDe(respuestas, previo = null) {
  const r = {
    aciertos: previo?.aciertos ?? 0, conAyuda: previo?.conAyuda ?? 0, revelados: previo?.revelados ?? 0, total: previo?.total ?? 0,
    fallos: [...(previo?.fallos ?? [])],
  };
  for (const x of respuestas ?? []) {
    if (!x || x.saltada) continue;
    r.total++;
    if (x.resultado === 'fallo') {
      r.revelados++;
      if (x.pregunta?.item && !r.fallos.includes(x.pregunta.item)) r.fallos.push(x.pregunta.item);
    } else if (x.ayuda) r.conAyuda++;
    else r.aciertos++;
  }
  return r;
}

// Palabras que no identifican una estructura (su tipo, artículos): no se tapan en la pista.
const GENERICAS = new Set(('musculo musculos muscle muscles muskel muskeln muscolo muscoli nodo nodos node nodes noeud noeuds '
  + 'ganglio ganglios ganglion ganglions linfatico linfaticos linfatica linfaticas lymph lymphatic lymphatique lymphatiques linfonodo linfonodi '
  + 'lymphknoten arteria arterias artery arteries arterie artere arteres vena venas vein veins vene veine veines nervio nervios nerve nerves '
  + 'nerv nerven nerf nerfs nervo nervi hueso huesos bone bones knochen osso ossa ligamento ligamentos ligament ligaments band baender '
  + 'glandula glandulas gland glands druese ghiandola parte porcion part portion region regione').split(' '));
const plano = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const TAPADO = '\u0000';

/**
 * Tapa en `texto` los nombres de una estructura (`nombres`: en los idiomas que haga falta): cada palabra propia del
 * nombre (no su tipo: «músculo», «nodos»…) y sus variantes (plural, adjetivo: «submandibulares», «submandibular») se
 * cambian por «[…]», y las seguidas se juntan en uno. Devuelve { texto, tapadas }.
 */
export function ocultarNombres(texto, nombres) {
  const raices = new Set();
  for (const n of nombres ?? []) {
    for (const w of plano(n).split(/[^a-z0-9]+/)) {
      if (w.length >= 4 && !GENERICAS.has(w)) raices.add(w.slice(0, Math.max(4, w.length - 2)));
    }
  }
  let tapadas = 0;
  if (!raices.size) return { texto: String(texto ?? ''), tapadas };
  const conMarcas = String(texto ?? '').replace(/[\p{L}\p{N}]+/gu, (w) => {
    const p = plano(w);
    if ([...raices].some((r) => p.startsWith(r))) { tapadas++; return TAPADO; }
    return w;
  });
  // Lo tapado seguido («[…] […]», «[…] de […]») es un solo hueco.
  const out = conMarcas.replace(/\u0000(?:[\s-]+(?:(?:de|del|di|du|des|of|the|la|le|el|y|e|und|et|and)\s+)?\u0000)*/g, '[…]');
  return { texto: out, tapadas };
}

/**
 * La pista para el segundo intento de una pregunta 3D (identificar o localizar) dentro de una sesión: una frase del
 * texto ya verificado del paso donde se enseña la estructura (pregunta.paso), con su nombre tapado. Prefiere una frase
 * que la nombra (y dice algo más que el nombre); si no, la primera del paso, si ese paso la enseña. Nunca una instrucción
 * («toca…») ni una nota sobre el modelo. Null si no hay ninguna que sirva (la interfaz da entonces una pista general).
 * `nombres`: los de la estructura (el de la lección y su traducción); `tr`: el contenido en el idioma de la interfaz.
 * Devuelve { texto, paso, titulo } (paso: el id del paso de donde sale; titulo: su título en el idioma de la interfaz
 * para decir de dónde sale, o null si el título nombra la estructura: en «El páncreas» o «Preaórticos: celíacos y
 * mesentéricos» el título revelaría la respuesta, y la interfaz dice entonces «De un paso de la lección»).
 */
export function pistaDe(L, q, { nombres = [], tr = (s) => s } = {}) {
  if (!L || !q?.estructura || !['identificar', 'localizar'].includes(q.tipo)) return null;
  const paso = (L.pasos ?? []).find((p) => p.id === q.paso) ?? (L.pasos ?? []).find((p) => p.vista?.ver?.includes(q.estructura));
  if (!paso) return null;
  const lista = [...frases(paso.texto), ...frases(paso.detalle)]
    .filter((f) => Array.isArray(f) && typeof f[0] === 'string' && !f.slice(1).some((e) => e?.guia || e?.modelo))
    .map((f) => tr(f[0]));
  const todos = [...nombres, L.estructuras?.[q.estructura]?.nombre, tr(L.estructuras?.[q.estructura]?.nombre ?? '')].filter(Boolean);
  // El título del paso, solo si no nombra la estructura (con las mismas reglas que la frase: palabras propias y variantes).
  const t = paso.titulo ? ocultarNombres(tr(paso.titulo), todos) : null;
  const titulo = t && !t.tapadas && t.texto.trim() ? t.texto : null;
  // Que quede algo que leer: al menos cuatro palabras sin tapar.
  const util = (s) => (s.replace(/\[…\]/g, ' ').match(/[\p{L}\p{N}]+/gu) ?? []).length >= 4;
  for (const s of lista) {
    const o = ocultarNombres(s, todos);
    if (o.tapadas && util(o.texto)) return { texto: o.texto, paso: paso.id, titulo };
  }
  if (paso.vista?.ver?.includes(q.estructura) && lista.length) {
    const o = ocultarNombres(lista[0], todos);
    if (util(o.texto)) return { texto: o.texto, paso: paso.id, titulo };
  }
  return null;
}

/**
 * El segundo intento guardado en la sesión para la pregunta `n` del bloque (al salir o recargar tras un primer fallo):
 * { n, quitada } o null. Así, al reanudar, la pregunta sigue en su segundo intento (con la opción fallada retirada y la
 * pista) y un acierto ahí cuenta «con ayuda», no «a la primera».
 */
export function intentoGuardado(parcial, n) {
  const i = parcial?.intento;
  if (!i || !Number.isInteger(n) || i.n !== n) return null;
  return { n, quitada: Number.isInteger(i.quitada) ? i.quitada : null };
}

/**
 * Cuándo vuelve al repaso espaciado cada ítem de `items` (progreso.js: la caja y la fecha `proximo`): [{ item, proximo,
 * hoy }] en ese orden, y el primero (`primero`: ms, o null si ninguno tiene fecha).
 */
export function proximoRepaso(data, items, ahora = Date.now()) {
  const lista = (items ?? []).map((item) => {
    const proximo = data?.items?.[item]?.proximo ?? null;
    return { item, proximo, hoy: proximo == null || proximo <= ahora };
  });
  const fechas = lista.map((x) => x.proximo).filter((x) => x != null);
  return { lista, primero: fechas.length ? Math.min(...fechas) : null };
}

/**
 * Los dos siguientes pasos que se sugieren al terminar una sesión: repasar lo fallado (si hay), seguir con la lección
 * principal si se quedó a medias, la siguiente de su plan o evaluarse de ella, y otra sesión del mismo tema.
 * `sesion`: la sesión; `resumen`: el de sesiones.resumen (con `repasar`); `porId`: el catálogo (Map); `terminada(id)`.
 * Devuelve [{ tipo: 'repasar' | 'seguir' | 'siguiente' | 'evaluar' | 'otra', leccion?, items? }] (como mucho dos).
 */
export function siguientesPasos({ sesion, resumen, porId = new Map(), terminada = () => false }) {
  const out = [];
  if (resumen?.repasar?.length) out.push({ tipo: 'repasar', items: resumen.repasar });
  const bloques = sesion?.bloques ?? [];
  const principal = (bloques.find((b) => b.tipo === 'leccion' && !b.perdido) ?? bloques.find((b) => b.leccion && !b.perdido))?.leccion ?? null;
  if (principal && porId.has(principal)) {
    if (!terminada(principal)) out.push({ tipo: 'seguir', leccion: principal });
    else {
      const sig = (porId.get(principal).siguiente ?? []).find((id) => porId.has(id) && !terminada(id));
      out.push(sig ? { tipo: 'siguiente', leccion: sig } : { tipo: 'evaluar', leccion: principal });
    }
  }
  if (out.length < 2) out.push({ tipo: 'otra' });
  return out.slice(0, 2);
}

/**
 * El plan para repetir una sesión (las mismas lecciones y tipos de bloque; las preguntas y lo vencido se eligen de
 * nuevo). Un bloque con parte de una lección se repite desde su primer paso si empezaba en el primero; si no, sigue
 * donde se dejó.
 */
export function planParaRepetir(S, porId = new Map()) {
  const bloques = (S?.bloques ?? []).filter((b) => !b.perdido).map((b) => {
    const base = { tipo: b.tipo, minutos: b.minutos, motivo: b.motivo ?? '', ...(b.motivoClave ? { motivoClave: b.motivoClave } : {}) };
    if (b.tipo === 'repaso') return base;
    if (b.tipo === 'practica') return { ...base, leccion: b.leccion };
    const primero = porId.get(b.leccion)?.pasos ?? null;   // (en el catálogo, `pasos` es un número)
    const parte = !b.pasos ? 'entera' : primero === null || typeof primero === 'number' ? 'inicio' : primero[0]?.id === b.pasos[0] ? 'inicio' : 'continuar';
    return { ...base, leccion: b.leccion, parte };
  });
  return { titulo: S?.titulo ?? '', mensaje: S?.mensaje ?? '', objetivo: S?.objetivo ?? '', bloques, ...(S?.textos ? { textos: S.textos } : {}) };
}
