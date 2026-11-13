// Qué resuelve Neuri en la app, sin llamar a Claude (y sin gastar), y qué manda a la IA. Se decide con reglas sobre el
// texto, las tarjetas que ya se mostraron y la coincidencia del buscador: ninguna llamada más para decidir.
//
// En la app, sin IA: los saludos, «el segundo» o «ábrela» (las tarjetas que se acaban de mostrar), «eso ya lo hice» (con
// el progreso), lo que pide tiempo o repaso, las urgencias y la salud (que la app responde igual que siempre) y las
// búsquedas que encajan bien.
// A la IA: explicar algo con fuentes, crear o adaptar una lección o un curso, las correcciones y los matices («más
// avanzado», «no, me refería…», «¿y los nervios?») y lo que el buscador no entiende bien. Si no hay IA, la conversación
// responde con el buscador y lo dice (src/pet/conversacion.js). Sin DOM: lo prueba `npm test`.
//
// Sesiones de estudio y el visor, también sin IA cuando se puede:
//  - «prepárame una sesión de 10 minutos sobre el corazón», «tengo 15 minutos para estudiar la rodilla»: ruta 'sesion'
//    con el pedido; la conversación la planifica en la app si el tema está claro (o con Neuri si es ambiguo);
//  - «sigamos con la sesión», «quiero seguir con la sesión que dejé a medias…»: ruta 'sesion' con `seguir` (la sesión
//    en curso), o la app dice que no hay ninguna;
//  - «pausa la sesión», «para la sesión», «termina la sesión»: la app dice dónde están sus botones (ruta 'local');
//  - «muéstrame el bíceps», «¿dónde está el hígado?», «enséñame el fémur en 3D»: si el nombre es claramente una pieza
//    del modelo de ahora (`piezas()`), la app responde con `mostrar` («Ver en 3D») y las lecciones que la enseñan.
import { normalizar } from '../biblioteca/buscar.js';
import { sinLado } from '../biblioteca/formato.js';
import { pideCrear, EXPLICAR, minutosPedidos, consultaDe } from './local.js';

// Una sesión de estudio: la palabra (en cinco idiomas) y, para «clase», un verbo de pedir o un tiempo.
const SESION = /(^|\s)(sesion|sesiones|session|sessions|sessione|seance|sitzung|lernsitzung|lerneinheit)(?=\s|$)/;
// (Sin «cours» ni «corso»: también son «curso», que es pedir un recorrido personal.)
const CLASE = /(^|\s)(clase|class|unterrichtsstunde)(?=\s|$)/;
const PEDIR = /(^|\s)(prepara|preparame|preparar|hazme|haz|dame|organiza|organizame|planifica|planificame|armame|montame|quiero|quisiera|necesito|prepare|make|give|plan|want|need|build|mach|mache|gib|bereite|plane|erstelle|mochte|fais|faites|donne|donnez|prepare|preparez|planifie|veux|voudrais|preparami|fammi|dammi|organizza|pianifica|voglio|vorrei)(?=\s|$)/;
// «Tengo 10 minutos para estudiar…»: tener tiempo y querer estudiar (con un tiempo que se entienda).
const TENGO = /(^|\s)(tengo|tenemos|have|ive|got|habe|hab|ai|avons|ho|abbiamo)(?=\s|$)/;
const ESTUDIAR = /(^|\s)(estudiar|repasar|aprender|practicar|study|learn|review|revise|practice|lernen|wiederholen|uben|etudier|reviser|apprendre|studiare|ripassare|imparare)(?=\s|$)/;
// Lo que se hace con una sesión que ya existe: seguirla (aquí) o pararla, terminarla… (la interfaz tiene sus botones).
const SEGUIR = /(^|\s)(seguir|sigue|sigamos|seguimos|continuar|continua|continuemos|retomar|retoma|retomemos|reanudar|reanuda|resume|continue|weiter|weitermachen|fortsetzen|fortfahren|reprendre|reprends|reprenons|reprenez|continuer|continuons|continuez|riprendere|riprendi|riprendiamo|continuare|continuiamo)(?=\s|$)/;
const CONTROL = /(^|\s)(pausa|pausar|parar|detener|deten|termina|terminar|acaba|acabar|cancela|cancelar|borra|borrar|quita|quitar|stop|pause|end|finish|cancel|delete|remove|beenden|pausieren|abbrechen|loschen|arrete|arreter|termine|terminer|annule|annuler|supprime|ferma|fermare|termina|annulla|elimina)(?=\s|$)/;
// «Para la sesión»: «para» es casi siempre una preposición; como orden, solo al principio y justo antes de la sesión.
const PARA_SESION = /^((oye|neuri|vale|ok|bueno|por favor|porfa)\s)*para\s((ya|la|esta|mi|tu|el|este)\s)*(sesion|clase)(\s|$)/;
// Pedir una sesión nueva (no seguir la que hay): «prepárame…», «hazme…», «una nueva», «make me…», «new».
const NUEVA = /(^|\s)(prepara|preparame|preparar|hazme|haz|dame|organiza|organizame|planifica|planificame|armame|montame|nueva|nuevo|make|give|build|prepare|new)(?=\s|$)/;
// Ver una estructura en el modelo: «muéstrame…», «¿dónde está…?»; «enséñame…» solo con «en 3D» (si no, es aprender).
const MOSTRAR = /(^|\s)(muestrame|mostrame|donde esta|donde estan|donde queda|donde se encuentra|localiza|localizame|senalame|show me|where is|where are|where s|locate|point to|zeig mir|zeige mir|wo ist|wo sind|wo liegt|wo liegen|montre moi|montrez moi|ou est|ou sont|ou se trouve|ou se trouvent|mostrami|fammi vedere|dove e|dov e|dove sono|dove si trova)(\s|$)/;
const EN_3D = /\s(en|in|im|dans|nel|on)\s(el\s|the\s|dem\s|le\s|il\s)?(3d|modelo|model|modell|modele|modello|visor|viewer)$/;
const ENSENA_3D = /(^|\s)(ensename|ensenar|teach|show|zeig|montre|insegnami|mostra)\s(.+)\s(en|in|im|dans|nel)\s(3d|el modelo|the model|dem modell|le modele|il modello)$/;
// Palabras que no son el nombre de la estructura (artículos, lado, «anatomía»…).
const NO_NOMBRE = new Set(('el la los las lo un una del de al the a an of der die das den dem des ein eine le les l du des un une il lo gli i dell della '
  + 'izquierdo izquierda derecho derecha left right links rechts linke rechte gauche droit droite sinistro sinistra destro destra '
  + 'por favor please bitte s il te plait vous per favore porfa ahora now').split(' '));
// Lo que queda de pedir tiempo sin decir tema («zum Lernen», «per studiare»).
const SIN_TEMA = new Set('zum zur um am im vom beim per pour to for para'.split(' '));
const GENERICA = /(^|\s)(anatomia|anatomy|anatomie|sistema|system|aparato|todo|todos|all|alles|tout|tutto|cuerpo|body)(\s|$)/;

// Seguir hablando de lo anterior o matizarlo: lo entiende mejor la IA, con el historial.
const SEGUIMIENTO = /^(y|and|und|et|e|pero|but|aber|mais|ma|no|entonces|so|also|alors|allora)\s/;
const MATICES = /(^|\s)(otra|otro|otras|otros|mas|menos|avanzad\w*|basic\w*|intermedi\w*|nivel|facil|dificil|compar\w*|versus|vs|en vez|en lugar|cambia\w*|mejor|plan|sesion|horario|calendario|another|other|more|less|advanced|basic|beginners?|level|easier|harder|compare|instead|change|schedule|session|anders|andere\w*|mehr|weniger|fortgeschritten\w*|leichter|schwerer|vergleich\w*|zeitplan|autre|plus|moins|avance\w*|facile|difficile|comparer|altro|altra|piu|meno|avanzat\w*|confront\w*)(?=\s|$)/;
const MAX_PALABRAS = 18;            // un mensaje más largo tiene matices que el buscador no ve

// «El segundo», «la última», «ábrela»: ordinales y lo que los acompaña sin añadir tema, en cinco idiomas.
const ORDINALES = [
  [0, new Set(['primer', 'primero', 'primera', '1', 'uno', 'una', 'first', 'erste', 'ersten', 'erster', 'erstes', 'premier', 'premiere', 'primo', 'prima'])],
  [1, new Set(['segundo', 'segunda', '2', 'dos', 'second', 'zweite', 'zweiten', 'zweiter', 'zweites', 'deuxieme', 'seconde', 'secondo', 'seconda'])],
  [2, new Set(['tercer', 'tercero', 'tercera', '3', 'tres', 'third', 'dritte', 'dritten', 'dritter', 'drittes', 'troisieme', 'terzo', 'terza'])],
  [3, new Set(['cuarto', 'cuarta', '4', 'cuatro', 'fourth', 'vierte', 'vierten', 'vierter', 'viertes', 'quatrieme', 'quarto', 'quarta'])],
  [4, new Set(['quinto', 'quinta', '5', 'cinco', 'fifth', 'funfte', 'funften', 'funfter', 'funftes', 'cinquieme'])],
  [-1, new Set(['ultimo', 'ultima', 'last', 'letzte', 'letzten', 'letzter', 'letztes', 'dernier', 'derniere'])],
];
const DEMOSTRATIVOS = new Set(['esa', 'ese', 'eso', 'esta', 'este', 'esto', 'abrela', 'abrelo', 'that', 'this', 'it', 'diese', 'dieses', 'diesen', 'die', 'celle', 'celui', 'la', 'quella', 'quello', 'questa', 'questo']);
const ACOMPANA = new Set((
  'abre abreme abrir empieza empiezo empezar empecemos vamos voy con quiero quisiera dame ponme me la el lo las los un una de del por favor porfa ok vale si bueno opcion leccion misma mismo '
  + 'open start show give me want the one that this it please ok yes lesson option same go with lets let s '
  + 'offne oeffne nimm zeig mir die der das den bitte ja lektion gleiche mit '
  + 'ouvre ouvrez ouvrir commence commencer donne donnez moi la le celle celui ci oui s il te vous plait lecon meme avec '
  + 'apri aprire inizia iniziare dammi voglio la il quella quello questa questo si per favore lezione stessa stesso con'
).split(' '));
// «Eso ya lo hice», «ya la terminé», «I already did that one», «schon gemacht», «déjà fait», «già fatta».
const HECHA = /(^|\s)(ya (lo |la |las |los )?(hice|termine|vi|estudie|complete|acabe)|already (did|done|finished|studied|took)|(did|done|finished) (it|that|this)( one)? already|done that|ich habe (die|das|sie|es) schon|schon (gemacht|erledigt|fertig|gelernt)|deja (fait|fini|termine|etudie)|l ai deja|gia (fatt[oa]|finit[oa]|studiat[oa])|l ho gia)(?=\s|$)/;
const PALABRAS_HECHA = new Set('ya lo la las los hice termine vi estudie complete acabe eso esa ese esto already did done finished studied took it that this one ich habe die das sie es schon gemacht erledigt fertig gelernt deja fait fini termine etudie l ai j je gia fatto fatta finito finita studiato studiata ho'.split(' '));

/** Índice de la tarjeta a la que se refiere un texto (0, 1, 2 o -1 la última), o null; `soloRef`: si no dice nada más. */
function ordinal(ws) {
  for (const [i, set] of ORDINALES) if (ws.some((w) => set.has(w))) return i;
  return null;
}
const esOrdinal = (w) => ORDINALES.some(([, set]) => set.has(w));

// Lo que la IA deja pendiente de una respuesta: una pregunta, una propuesta o un plan («¿para qué nivel?» → «básico»).
const ESPERA_RESPUESTA = new Set(['aclaracion', 'propuesta', 'plan', 'limitacion']);

/**
 * Decide por dónde va un mensaje. `anteriores`: los identificadores de las tarjetas de la última respuesta de Neuri, en
 * su orden. `ultimo`: esa respuesta ({ tipo, origen, texto }). `contexto`: el estado de la conversación (tema, objetivo,
 * nivel, minutos) que fue dejando la IA. `e`: el entorno de src/pet/local.js (buscador, porId, progreso, t…).
 * `local(texto)`: la respuesta del buscador. `sesion`: la sesión de estudio en curso ({ id, titulo, … } o null).
 * `piezas()`: las piezas del modelo de ahora ([{ clave, nombre, latin, en }]; sin ella no se resuelve «muéstrame X»).
 * Devuelve { ruta: 'local', motivo, respuesta } o { ruta: 'ia', motivo }, o, para las sesiones de estudio,
 * { ruta: 'sesion', motivo: 'sesion', pedido: { objetivo, minutos, nivel } } y
 * { ruta: 'sesion', motivo: 'seguir-sesion', seguir: true, mensaje }.
 */
export function decidirRuta(texto, { anteriores = [], ultimo = null, contexto = null, e, local, sesion = null, piezas = null }) {
  const n = normalizar(texto);
  const ws = n.split(' ').filter(Boolean);
  if (!ws.length) return { ruta: 'local', motivo: 'vacio', respuesta: local(texto) };
  const validas = anteriores.filter((id) => e.porId.has(id));

  // 1. Las tarjetas que se acaban de enseñar: «el segundo», «ábrela», «la última, por favor».
  if (validas.length && ws.length <= 6) {
    const i = ordinal(ws);
    const resto = ws.filter((w) => !esOrdinal(w) && !ACOMPANA.has(w) && !DEMOSTRATIVOS.has(w));
    const demostrativo = ws.some((w) => DEMOSTRATIVOS.has(w));
    if (!resto.length && !HECHA.test(n) && (i !== null || demostrativo)) {
      const k = i === null ? (validas.length === 1 ? 0 : null) : i === -1 ? validas.length - 1 : i;
      if (k !== null && k < validas.length) return { ruta: 'local', motivo: 'referencia', respuesta: elegida(validas[k], e) };
      return { ruta: 'local', motivo: 'referencia', respuesta: cual(validas, e) };
    }
  }

  // 2. «Eso ya lo hice»: lo que va después de esa lección (o las otras que se enseñaron), con el progreso.
  if (validas.length && HECHA.test(n)) {
    const resto = ws.filter((w) => !PALABRAS_HECHA.has(w) && !esOrdinal(w) && !ACOMPANA.has(w) && !DEMOSTRATIVOS.has(w));
    if (!resto.length) {
      const i = ordinal(ws);
      const hecha = validas[i === null ? 0 : i === -1 ? validas.length - 1 : Math.min(i, validas.length - 1)];
      return { ruta: 'local', motivo: 'hecha', respuesta: despuesDe(hecha, validas, e) };
    }
  }

  // 3. Las sesiones de estudio: seguir la que hay, pararla o terminarla (eso lo hacen sus botones) o pedir una (antes
  // que «crear»: «hazme una clase de 10 minutos…» se arma con lo que ya existe, sin crear lecciones).
  const deSesion = SESION.test(n) || CLASE.test(n);
  const minutos = minutosPedidos(texto);
  const control = CONTROL.test(n) || PARA_SESION.test(n);
  // Seguir la sesión que hay, por largo que sea el mensaje («quiero seguir con la sesión que dejé a medias ayer…»), si no
  // pide una nueva («prepárame una sesión para seguir con…» es otra sesión).
  if (deSesion && SEGUIR.test(n) && !control && !NUEVA.test(n)) {
    if (sesion?.id) return { ruta: 'sesion', motivo: 'seguir-sesion', seguir: true, mensaje: e.t('pet.ses.seguir', { x: sesion.titulo ?? '' }), sinSesion: e.t('pet.ses.ninguna') };
    return { ruta: 'local', motivo: 'seguir-sesion', respuesta: { mensaje: e.t('pet.ses.ninguna'), lecciones: [], recorrido: null, sugerencias: e.sugerencias ?? [], coincidencia: sinCoincidencia({ tema: false, fuerza: 'ninguna' }) } };
  }
  // Pausar, parar o terminar la sesión: la app dice dónde están sus botones (no lo hace sola ni gasta IA).
  if (deSesion && control && !NUEVA.test(n)) {
    const mensaje = sesion?.id ? e.t('pet.ses.control', { x: sesion.titulo ?? '' }) : e.t('pet.ses.ninguna');
    return { ruta: 'local', motivo: 'control-sesion', respuesta: { mensaje, lecciones: [], recorrido: null, sugerencias: [], coincidencia: sinCoincidencia({ tema: false, fuerza: 'ninguna' }) } };
  }
  const pideSesion = !control && (SESION.test(n) || (CLASE.test(n) && (PEDIR.test(n) || minutos)) || (TENGO.test(n) && minutos && ESTUDIAR.test(n)));
  if (pideSesion) {
    // Sin tema («una sesión de 20 minutos»): el de la conversación, si lo hay; si no, la app propone lo pendiente.
    const tema = consultaDe(texto).split(' ').filter((w) => w && !SIN_TEMA.has(w) && !SESION.test(w) && !CLASE.test(w) && !PEDIR.test(w) && !ESTUDIAR.test(w) && !TENGO.test(w));
    const objetivo = tema.length ? String(texto).replace(/\s+/g, ' ').trim().slice(0, 600) : contexto?.tema ?? '';
    return { ruta: 'sesion', motivo: 'sesion', pedido: { objetivo, minutos: minutos ?? null, nivel: contexto?.nivel ?? null } };
  }

  // 4. «Muéstrame el bíceps», «¿dónde está el hígado?»: si es claramente una pieza del modelo de ahora, el visor.
  if (typeof piezas === 'function') {
    const v = verEn3D(n, piezas, e);
    if (v) return { ruta: 'local', motivo: 'mostrar', respuesta: v };
  }

  // 5. Contestar a lo que preguntó o propuso la IA, crear, explicar, matizar o seguir lo anterior: la IA.
  if (ultimo?.origen === 'ia' && (ESPERA_RESPUESTA.has(ultimo.tipo) || /[?¿]\s*$/.test(ultimo.texto ?? ''))) return { ruta: 'ia', motivo: 'respuesta' };
  if (pideCrear(n)) return { ruta: 'ia', motivo: 'crear' };
  if (EXPLICAR.test(n)) return { ruta: 'ia', motivo: 'explicar' };
  if (SEGUIMIENTO.test(n) || MATICES.test(n) || HECHA.test(n) || ws.length > MAX_PALABRAS) return { ruta: 'ia', motivo: 'interpretar' };

  // 6. Lo demás, el buscador: basta si no hay tema (saludo, tiempo, repaso, empezar, «quiero aprender anatomía»: pregunta
  // cuál), si es una urgencia o salud, o si encaja bien. Si no, la IA lo entiende mejor.
  const r = local(texto);
  const c = r.coincidencia ?? {};
  if (c.objetivo === 'urgencia') return { ruta: 'local', motivo: 'urgencia', respuesta: r };
  // «15 minutos» o «quiero repasar» después de hablar de un tema: la IA lo aplica a ese tema.
  if (!c.tema && contexto?.tema && (c.minutos || c.objetivo === 'repasar')) return { ruta: 'ia', motivo: 'interpretar' };
  if (!c.tema) return { ruta: 'local', motivo: c.minutos ? 'tiempo' : c.objetivo === 'repasar' ? 'repaso' : 'sin-tema', respuesta: r };
  if (c.fuerza === 'alta') return { ruta: 'local', motivo: 'busqueda', respuesta: r };
  return { ruta: 'ia', motivo: 'interpretar' };
}

const sinCoincidencia = (extra = {}) => ({ tema: true, fuerza: 'alta', lecciones: 0, relajada: false, ignoradas: [], objetivo: null, minutos: null, ...extra });

/** La tarjeta elegida, otra vez y sola. */
function elegida(id, e) {
  return { mensaje: e.t('pet.ruta.esta'), lecciones: [{ id, motivo: e.t('pet.motivo.elegida') }], recorrido: null, sugerencias: [], coincidencia: sinCoincidencia({ lecciones: 1 }) };
}

/** Una referencia que no se puede resolver («la cuarta» de tres, «esa» entre varias): se vuelven a enseñar y se pregunta. */
function cual(ids, e) {
  return {
    mensaje: e.t('pet.ruta.cual', { n: ids.length }),
    lecciones: ids.slice(0, 3).map((id, i) => ({ id, motivo: e.t('pet.motivo.opcion', { n: i + 1 }) })),
    recorrido: null, sugerencias: [], coincidencia: sinCoincidencia({ fuerza: 'media', lecciones: Math.min(ids.length, 3) }),
  };
}

/** Lo que va después de una lección hecha: su «siguiente» y las otras que se enseñaron, sin las terminadas. */
function despuesDe(id, anteriores, e) {
  const terminada = e.progreso.terminadas.has(id);
  const L = e.porId.get(id);
  const ids = [...new Set([...(L?.siguiente ?? []), ...anteriores.filter((x) => x !== id)])]
    .filter((x) => x !== id && e.porId.has(x) && !e.progreso.terminadas.has(x)).slice(0, 2);
  if (!ids.length) {
    return { mensaje: e.t('pet.ruta.hechaNada'), lecciones: [], recorrido: null, sugerencias: e.sugerencias ?? [], coincidencia: sinCoincidencia({ tema: false, fuerza: 'ninguna' }) };
  }
  const deSiguiente = new Set(L?.siguiente ?? []);
  return {
    mensaje: e.t(terminada ? 'pet.ruta.hechaSi' : 'pet.ruta.hecha'),
    lecciones: ids.map((x) => ({ id: x, motivo: e.t(deSiguiente.has(x) ? 'pet.motivo.despues' : 'pet.motivo.otraOpcion') })),
    recorrido: null, sugerencias: [], coincidencia: sinCoincidencia({ lecciones: ids.length }),
  };
}

/** Lo que se pide ver en «muéstrame X», «¿dónde está X?» o «enséñame X en 3D» (normalizado), o null. */
function objetoMostrar(n) {
  let x = null;
  const e3 = n.match(ENSENA_3D);
  if (e3) x = e3[3];
  else {
    const m = n.match(MOSTRAR);
    if (m) x = n.slice(m.index + m[0].length);
  }
  if (!x) return null;
  x = x.replace(EN_3D, '').trim();
  const ws = x.split(' ').filter((w) => w && !NO_NOMBRE.has(w));
  if (!ws.length || ws.length > 6 || GENERICA.test(x)) return null;
  return ws.join(' ');
}

/** Un nombre en la forma de comparar: sin artículos ni lado. */
const formaNombre = (s) => normalizar(s).split(' ').filter((w) => w && !NO_NOMBRE.has(w)).join(' ');

/**
 * «Ver en 3D»: si lo que se pide es claramente una pieza del modelo de ahora (su nombre exacto en español, latín o
 * inglés, o el único nombre que contiene todas sus palabras), la respuesta de la app con `mostrar` y las lecciones que
 * la enseñan (catalogo.piezas: primero las que la tienen en el núcleo). Si no, null (sigue la ruta de siempre).
 */
function verEn3D(n, piezas, e) {
  const x = objetoMostrar(n);
  if (!x) return null;
  let lista = [];
  try { lista = piezas() ?? []; } catch { lista = []; }
  // Una entrada por pieza sin lado (el bíceps izquierdo y el derecho son la misma estructura que enseñar).
  const porClave = new Map();
  for (const p of Array.isArray(lista) ? lista : []) {
    if (!p || typeof p.clave !== 'string') continue;
    const clave = sinLado(p.clave);
    if (!/^[A-Za-z0-9_()'.,-]{2,120}$/.test(clave) || porClave.has(clave)) continue;
    // (Las formas en orden: nombre, inglés y latín; el latín se comparte a veces: «Piel del muslo» también es «Femur».)
    porClave.set(clave, { clave, nombre: String(p.nombre ?? clave), formas: [p.nombre, p.en, p.latin].map((f) => (f ? formaNombre(f) : '')) });
  }
  const todas = [...porClave.values()];
  const palabras = x.split(' ');
  // El nombre exacto manda; si hay varias con la misma forma, la que la tiene por nombre (o en inglés) antes que en latín.
  let exactas = [];
  for (let k = 0; k < 3 && exactas.length !== 1; k++) {
    const estas = todas.filter((p) => p.formas.slice(0, k + 1).includes(x));
    if (estas.length) exactas = estas;
  }
  const contienen = todas.filter((p) => p.formas.some((f) => { const fw = f.split(' '); return f && palabras.every((w) => fw.includes(w)); }));
  const elegida = exactas.length === 1 ? exactas[0] : !exactas.length && contienen.length === 1 ? contienen[0] : null;
  if (!elegida) return null;
  const nombre = elegida.nombre.replace(/\s+(izquierd[oa]|derech[oa]|left|right)$/i, '').slice(0, 160);
  const donde = e.piezas?.[elegida.clave];
  const ids = [...new Set([...(donde?.n ?? []), ...(donde?.c ?? [])])].filter((id) => e.porId.has(id)).slice(0, 3);
  return {
    mensaje: e.t(ids.length ? 'pet.ruta.mostrar' : 'pet.ruta.mostrarSola', { x: nombre }),
    lecciones: ids.map((id) => ({ id, motivo: e.t('pet.motivo.estructura', { x: nombre }) })),
    recorrido: null, sugerencias: [], mostrar: [{ clave: elegida.clave, nombre }],
    coincidencia: sinCoincidencia({ lecciones: ids.length }),
  };
}
