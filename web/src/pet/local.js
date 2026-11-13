// Neuri sin IA: responde con el buscador de la biblioteca (src/biblioteca/buscar.js) cuando no hay servidor, clave o
// conexión. Devuelve lo mismo que el servidor ({ mensaje, lecciones: [{ id, motivo }], recorrido, sugerencias }), así
// que la interfaz no distingue más que el origen. Sin DOM: lo prueba `npm test`.
//
// Antes de buscar quita lo que es conversación («tengo examen de…», «algo de 10 minutos», «¿me recomiendas…?») y
// reconoce: un tiempo, empezar desde cero, repasar, un examen, un saludo y las dudas de salud (que no responde: remite a
// un profesional). El resto lo entiende el buscador, en modo flexible: regiones, sistemas, temas, estructuras y erratas,
// sin exigir las palabras que no dicen el tema («anatomía», «órgano») ni las que no salen en ninguna lección.
//
// Solo recomienda lo que tiene un motivo: si la mejor opción encaja de verdad (el título lo nombra), no rellena con las
// que encajan mucho menos. Sin tema («quiero aprender anatomía»), pregunta cuál; sin nada que encaje, no repite la frase
// entera y ofrece por dónde seguir. `coincidencia` resume cómo encajó, para que la conversación decida si basta.
import { normalizar } from '../biblioteca/buscar.js';
import { RECORRIDO_POR_ID, leccionesDeRecorrido } from '../biblioteca/recorridos.js';
import { REGION_POR_ID, SUBREGION_POR_ID } from '../biblioteca/taxonomia.js';

const MAX = 3;
const EMPEZAR = /\b(empezar|empiezo|empezando|comenzar|principiante|novato|desde cero|no se por donde|por donde (empiezo|empezar)|start|beginner|from scratch|where to begin|anfangen|anfang|anfanger|commencer|debutant|iniziare|da zero)\b/;
const SALUD = /\b(me duele|duele|dolor|dolores|lesion|lesione|esguince|fractura|me rompi|sintoma|sintomas|hurts?|pain|injur\w*|sprain|schmerz\w*|verletz\w*|douleur|mal au|blessure|dolore|fa male|infortunio)\b/;
const SALUDO = /^(hola|buenas|buenos dias|buenas tardes|hello|hi|hey|hallo|guten tag|bonjour|salut|ciao|buongiorno)\b/;
// Alguien que habla de hacerse daño: no se busca nada; se le pide que pida ayuda ya.
const CRISIS = /\b(suicid\w*|matarme|quitarme la vida|hacerme dano|autolesion\w*|no quiero vivir|kill myself|end my life|self harm|hurt myself|umbringen|selbstmord|mich verletzen|me tuer|me suicider|me faire du mal|uccidermi|togliermi la vita|farmi del male)\b/;
// Pedir que se cree o adapte una lección: sin IA no se puede; se dice y se busca lo que hay del tema.
const CREAR = /\b(crea|crear|creame|hazme|haz|genera|generar|prepara|preparame|adapta|adaptar|create|make|generate|adapt|erstelle|erstellen|mach|passe|cree|creer|adapte|creare|adatta|adattare|prepara)\b/;
// Un curso o un recorrido entero (con IA, un recorrido personal por unidades): también es pedir que se cree.
const CURSO = /\b(curso|cursos|course|courses|kurs|kurse|lehrgang|cours|corso|corsi)\b/;
const LECCION = /\b(leccion|lecciones|lesson|lektion|lecon|lezione|tema|clase|recorrido|path|lernpfad|parcours|percorso)\b/;
/** Si un texto (normalizado) pide crear o adaptar una lección o un curso: «créame una lección…», no «quiero aprender…». */
export const pideCrear = (n) => CREAR.test(n) && (CURSO.test(n) || LECCION.test(n));
// Preguntas que piden una explicación (qué es, para qué sirve, por qué, cómo funciona, la diferencia…), en cinco idiomas.
// Sin IA no se explica: se dice y se ofrecen las lecciones que lo tratan.
export const EXPLICAR = /(^|\s)(que es|que son|que hace|que hacen|para que sirve|para que sirven|por que|como funciona|como funcionan|cual es la funcion|cuales son las funciones|funcion de|funciones de|diferencia|diferencias|explica|explicame|explicar|what is|what are|what does|what do|why|how does|how do|difference|differences|explain|was ist|was sind|was macht|warum|wieso|wie funktioniert|unterschied|erklar|erklare|qu est ce|que fait|a quoi sert|pourquoi|comment fonctionne|difference|explique|expliquez|che cos|cosa fa|a cosa serve|perche|come funziona|differenza|spiega|spiegami)(?=\s|$)/;
// El buscador reconoce «repasar» en español e inglés; aquí, también en los otros idiomas de la app.
const REPASAR = /\b(repasar|repaso|repasemos|review|revise|wiederholen|wiederholung|reviser|revision|ripassare|ripasso)\b/;
const NUMEROS = { cinco: 5, diez: 10, quince: 15, veinte: 20, treinta: 30, five: 5, ten: 10, fifteen: 15, twenty: 20, thirty: 30, zehn: 10, dix: 10, quinze: 15, vingt: 20, dieci: 10, quindici: 15, venti: 20 };
const MINUTOS = /\b(\d{1,3}|cinco|diez|quince|veinte|treinta|five|ten|fifteen|twenty|thirty|zehn|dix|quinze|vingt|dieci|quindici|venti)\s*(min|mins|minuto|minutos|minute|minutes|minuten|minuti)\b/g;
const MEDIA_HORA = /\b(media hora|half an hour|halbe stunde|demi heure|mezz ora|mezzora)\b/g;
// «Algo corto», «una lección rápida»: unos 15 minutos. Solo detrás de esas palabras, para no tocar «peroneo corto».
const CORTO = /\b(algo|something|etwas|chose|qualcosa|leccion|lesson|lektion|lecon|lezione|rato|un poco)\s+(corto|corta|breve|short|quick|kurzes|kurz|court|courte|rapido|rapida|veloce)\b/g;
const MIN_CORTO = 15;
// Preparar un examen: el tema es lo demás («Tengo examen de neuroanatomía»).
const EXAMEN = /\b(examen|examenes|parcial|exam|exams|prufung|prufungen|klausur|esame|esami)\b/;
// Las zonas que se ofrecen cuando falta el tema o no encaja nada (además de «no sé por dónde empezar»).
const ZONAS = ['cabeza', 'torax', 'abdomen', 'miembro-superior', 'miembro-inferior'];

// Palabras de conversación, no de anatomía (sin acentos). Ojo: nada que forme parte de un nombre anatómico corriente.
const RELLENO = new Set((
  'tengo tienes tiene tenemos examen examenes parcial final prueba pruebas manana hoy semana proxima quiero quisiera queria necesito '
  + 'sobre estudiar estudio estudiando aprender aprenda algo rato rapido rapida poco un una unos unas del de la el los las lo para me '
  + 'te le gustaria podrias puedes puedo ayudame ayuda ayudar favor por gracias dime recomiendame recomiendas recomienda recomendar '
  + 'leccion lecciones clase clases tema temas repasar repaso repasemos practicar hora solo nada mas que como cual donde ver saber '
  + 'entender conocer y o en con mi mis hacer empezar empiezo comenzar desde cero no se principiante novato hola buenas buenos dias tardes '
  + 'i im have has had an a exam exams test quiz something short quick about need would like please thanks thank you recommend '
  + 'lesson lessons study studying learn learning review practice practise the of and in on for my me want minutes minute min hour '
  + 'only some to what which how do dont know where start begin beginner scratch hello hi hey '
  + 'ich habe hab eine einen ein prufung etwas kurzes kurz uber den die das der lernen wiederholen mochte will brauche bitte danke '
  + 'lektion lektionen minuten stunde fur mit zu weiss nicht wo anfangen soll hallo '
  + 'je j ai un une sur le la les l des du quelque chose court courte veux voudrais besoin apprendre etudier reviser lecon lecons '
  + 'heure pour avec sais pas par ou commencer bonjour salut '
  + 'ho esame sul sulla sui di del della qualcosa voglio vorrei bisogno imparare studiare ripassare lezione lezioni minuti ora per '
  + 'so non da dove iniziare ciao '
  // Lo que se dice al contar una molestia («me duele la rodilla»): se responde aparte y no se busca.
  + 'duele duelen dolor dolores lesion lesione esguince fractura rompi sintoma sintomas hurt hurts pain injury injured sprain '
  + 'schmerz schmerzen verletzt douleur mal blessure dolore fa male infortunio '
  // Pedir que se enseñe o se explique, interesarse por algo, preguntar cómo funciona (en los cinco idiomas).
  + 'interesa interesan interesaria encanta gusta gustan cuentame cuenteme explica explicame explicar ensena ensename ensenar ensenarme '
  + 'muestra muestrame mostrar mostrarme dame darme acerca funciona funcionan funcionamiento podria podrias quieres '
  + 'hace hacen sirve sirven servir significa significan ubica ubican encuentra encuentran esta estan son '
  + 'teach tell show explain give let lets get understand interested interest works work does can could is are '
  + 'zeig zeige zeigen erklar erklare erklaren mir mich mochten wurde gern gerne dem des ist sind wie was funktioniert interessiert '
  + 'montre montrez montrer moi explique expliquez expliquer aimerais comment fonctionne quoi est sont d qu ce cette ces au aux '
  + 'mostrami mostra mostrare spiegami spiega spiegare insegnami insegna come funziona cos cosa e sono dell delle degli dei lo gli '
  // Lo que queda de una contracción al normalizar («don’t» → «don t», «n’ai», «c’est»).
  + 'don doesn didn isn aren can won wouldn couldn shouldn t s ll ve re m n c'
).split(' '));

/** Minutos que pide la persona («tengo 10 minutos», «media hora»), o null. */
export function minutosPedidos(texto) {
  const n = normalizar(texto);
  if (new RegExp(MEDIA_HORA.source).test(n)) return 30;
  const m = n.match(new RegExp(MINUTOS.source));
  if (!m) return new RegExp(CORTO.source).test(n) ? MIN_CORTO : null;
  const v = NUMEROS[m[1]] ?? Number(m[1]);
  return v > 0 && v <= 240 ? v : null;
}

/** Lo que queda para buscar al quitar el tiempo y las palabras de conversación. */
export function consultaDe(texto) {
  return normalizar(texto).replace(MINUTOS, ' ').replace(MEDIA_HORA, ' ').replace(CORTO, ' ')
    .split(' ').filter((w) => w && !RELLENO.has(w)).join(' ');
}

/**
 * Responde a `texto`. `e`: { buscador, porId: Map id → lección del catálogo, piezas: catalogo.piezas, progreso:
 * { terminadas, enCurso, repasos } (Sets de ids), t, tn, nombreLugar([r, s]), nombreMateria({ sistema | tema }),
 * sugerencias: respuestas rápidas para empezar }.
 * Devuelve { mensaje, lecciones: [{ id, motivo }], recorrido, sugerencias, coincidencia: { tema, fuerza ('alta', 'media',
 * 'baja' o 'ninguna'), lecciones, relajada, ignoradas, objetivo ('empezar', 'repasar', 'examen', 'urgencia' o null),
 * minutos } }.
 */
export function responderLocal(texto, e) {
  const n = normalizar(texto);
  const coincidencia = (extra = {}) => ({ tema: false, fuerza: 'ninguna', lecciones: 0, relajada: false, ignoradas: [], objetivo: null, minutos: null, ...extra });
  if (CRISIS.test(n)) return { mensaje: e.t('pet.local.urgencia'), lecciones: [], recorrido: null, sugerencias: [], coincidencia: coincidencia({ objetivo: 'urgencia' }) };
  const salud = SALUD.test(n);
  const minutos = minutosPedidos(texto);
  const empezar = EMPEZAR.test(n);
  const repasar = REPASAR.test(n);
  const examen = EXAMEN.test(n);
  const objetivo = empezar ? 'empezar' : repasar ? 'repasar' : examen ? 'examen' : null;
  const crear = pideCrear(n);
  const explicar = !crear && EXPLICAR.test(n);
  const consulta = consultaDe(texto).split(' ').filter((w) => !CREAR.test(w) && !CURSO.test(w)).join(' ');
  const r = consulta ? e.buscador.buscar(consulta, { flexible: true }) : null;
  const avisoSalud = `${salud ? `${e.t('pet.local.salud')} ` : ''}${crear ? `${e.t('pet.local.crear')} ` : ''}`;
  // «Explícame…» sin IA: se dice antes de las lecciones que lo tratan (o, si no hay ninguna, en el mensaje de «nada»).
  const avisoExplicar = explicar ? `${e.t('pet.local.explicar')} ` : '';
  const lista = (ids, motivo) => ids.filter((id) => e.porId.has(id)).slice(0, MAX).map((id) => ({ id, motivo: typeof motivo === 'function' ? motivo(id) : motivo }));
  const sinHacer = (L) => !e.progreso.terminadas.has(L.id);
  const todas = [...e.porId.values()];
  const info = (extra = {}) => coincidencia({ tema: !!r && !r.sinTema, ignoradas: r?.ignoradas ?? [], objetivo, minutos, ...extra });
  // Por dónde seguir cuando falta el tema o no encaja nada: empezar de cero o una zona del cuerpo.
  const zonas = () => [e.t('pet.local.chipEmpezar'), ...ZONAS.map((id) => e.nombreLugar([id, null]))];

  // Sin tema: lo que pide es empezar, repasar, un tiempo, un saludo… o un tema sin decir cuál («quiero aprender anatomía»).
  if (!r || r.sinTema) {
    if (empezar) {
      const emp = empezarDesdeCero(e);
      return { ...emp, coincidencia: info({ fuerza: 'alta', lecciones: emp.lecciones.length }) };
    }
    if (repasar) {
      const ids = [...e.progreso.repasos, ...[...e.progreso.terminadas].filter((id) => !e.progreso.repasos.has(id))];
      if (!ids.length) return { mensaje: e.t('pet.local.repasarVacio'), lecciones: [], recorrido: null, sugerencias: e.sugerencias, coincidencia: info() };
      const lecciones = lista(ids, (id) => e.t(e.progreso.repasos.has(id) ? 'pet.motivo.repaso' : 'pet.motivo.terminada'));
      return { mensaje: e.t('pet.local.repasar'), lecciones, recorrido: null, sugerencias: [], coincidencia: info({ fuerza: 'alta', lecciones: lecciones.length }) };
    }
    if (minutos) {
      // Lo empezado primero; luego lo que no está hecho, en el orden de la biblioteca.
      const caben = todas.filter((L) => L.minutos <= minutos && sinHacer(L))
        .sort((a, b) => e.progreso.enCurso.has(b.id) - e.progreso.enCurso.has(a.id) || (a.orden ?? 0) - (b.orden ?? 0));
      const porMinutos = (id) => e.t('bib.minutos', { n: e.porId.get(id).minutos });
      if (caben.length) {
        const lecciones = lista(caben.map((L) => L.id), porMinutos);
        return { mensaje: e.t('pet.local.corto', { m: minutos }), lecciones, recorrido: null, sugerencias: [], coincidencia: info({ fuerza: 'alta', lecciones: lecciones.length }) };
      }
      const lecciones = lista([...todas].sort((a, b) => a.minutos - b.minutos).map((L) => L.id), porMinutos);
      return { mensaje: e.t('pet.local.cortoNada', { m: minutos }), lecciones, recorrido: null, sugerencias: [], coincidencia: info({ fuerza: 'media', lecciones: lecciones.length }) };
    }
    if (!r) return { mensaje: avisoSalud + e.t('pet.local.saludo'), lecciones: [], recorrido: null, sugerencias: e.sugerencias, coincidencia: info() };
    // Solo palabras como «anatomía» u «órganos del cuerpo»: no se recomienda nada al azar; se pregunta el tema.
    return { mensaje: avisoSalud + e.t('pet.local.queTema'), lecciones: [], recorrido: null, sugerencias: zonas(), coincidencia: info() };
  }

  // Con tema: el buscador. Si no encuentra lecciones, las que enseñan las estructuras que sí encuentra.
  const tema = [...r.lugares.map((l) => e.nombreLugar([l.region, l.sub])), ...r.materias.filter((m) => !m.generico).map((m) => e.nombreMateria(m))].join(' · ');
  // Con un lugar, primero la lección de ese lugar: la que lo nombra en el título o se centra en él (no una visión general).
  const relevancia = (L) => {
    let p = L.puntuacion ?? 0;
    for (const l of r.lugares) {
      const nombre = normalizar((l.sub ? SUBREGION_POR_ID.get(l.sub) : REGION_POR_ID.get(l.region))?.nombre);
      if (nombre && normalizar(L.titulo).includes(nombre)) p += 4;
      const propia = (L.lugares ?? []).some(([reg, sub]) => reg === l.region && (!l.sub || sub === l.sub));
      if (propia && (L.lugares ?? []).length <= 2) p += 2;
      if (L.formato === 'vision-general') p -= 1;
    }
    return p;
  };
  const ordenadas = r.lecciones.map((L, i) => ({ L, i, p: relevancia(L) })).sort((a, b) => b.p - a.p || a.i - b.i);
  // Solo lo que tiene un motivo: si la mejor encaja de verdad, no se rellena con las que encajan mucho menos (los
  // genitales masculinos no traen los sentidos ni el sistema linfático).
  const mejor = ordenadas[0]?.p ?? 0;
  const motivo = tema ? e.t('pet.motivo.trata', { x: tema }) : e.t('pet.motivo.texto');
  let candidatas = ordenadas.filter((x) => x.p >= Math.max(1, mejor / 2)).map(({ L }) => ({ L, motivo }));
  let porEstructura = false;
  if (!candidatas.length) {
    for (const E of r.estructuras.slice(0, 6)) {
      const donde = e.piezas?.[E.clave];
      for (const id of [...(donde?.n ?? []), ...(donde?.c ?? [])]) {
        if (e.porId.has(id) && !candidatas.some((c) => c.L.id === id)) { candidatas.push({ L: e.porId.get(id), motivo: e.t('pet.motivo.estructura', { x: E.nombre }) }); porEstructura = true; }
      }
    }
  }
  const recorrido = r.todos && r.recorridos[0] ? r.recorridos[0].id : null;
  if (!candidatas.length && !recorrido && empezar) {
    const emp = empezarDesdeCero(e);
    return { ...emp, coincidencia: info({ fuerza: 'alta', lecciones: emp.lecciones.length }) };
  }
  if (!candidatas.length && !recorrido) {
    // Nada encaja: no se repite la frase entera; se dice y se ofrece por dónde seguir.
    return { mensaje: avisoSalud + e.t(explicar ? 'pet.local.explicarNada' : 'pet.local.nada'), lecciones: [], recorrido: null, sugerencias: zonas(), coincidencia: info() };
  }

  // Repasar: primero lo que tiene repasos pendientes. Si no, lo terminado va al final. Para empezar, lo básico antes.
  let extra = '';
  if (repasar) {
    const pend = candidatas.filter((c) => e.progreso.repasos.has(c.L.id));
    if (pend.length) {
      candidatas = [...pend.map((c) => ({ ...c, motivo: e.t('pet.motivo.repaso') })), ...candidatas.filter((c) => !e.progreso.repasos.has(c.L.id))];
      extra = e.t('pet.local.repasar');
    } else extra = e.t('pet.local.repasarNada');
  } else {
    const nuevas = candidatas.filter((c) => sinHacer(c.L));
    if (nuevas.length) candidatas = [...nuevas, ...candidatas.filter((c) => !sinHacer(c.L))];
  }
  if (empezar) candidatas = [...candidatas].sort((a, b) => a.L.nivel - b.L.nivel);
  // Tiempo: las que caben; si ninguna cabe, las más cortas (y se dice).
  if (minutos && candidatas.length) {
    const caben = candidatas.filter((c) => c.L.minutos <= minutos);
    if (caben.length) { candidatas = caben; extra = e.t('pet.local.corto', { m: minutos }); }
    else { candidatas = [...candidatas].sort((a, b) => a.L.minutos - b.L.minutos); extra = e.t('pet.local.cortoNada', { m: minutos }); }
  }

  const elegidas = candidatas.slice(0, MAX);
  // Muchas opciones sin una zona concreta: se ofrece afinar por región (las más frecuentes entre los resultados).
  let sugerencias = [];
  let pregunta = '';
  if (ordenadas.length > 6 && !r.lugares.length && !recorrido) {
    const cuenta = new Map();
    for (const { L } of ordenadas) for (const [reg] of L.lugares ?? []) cuenta.set(reg, (cuenta.get(reg) ?? 0) + 1);
    sugerencias = [...cuenta].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([reg]) => e.nombreLugar([reg, null]));
    if (sugerencias.length > 1) pregunta = ` ${e.t('pet.local.afinar')}`;
    else sugerencias = [];
  }
  const encontre = examen && elegidas.length ? e.t('pet.local.examen') : e.tn('pet.local.encontre', elegidas.length);
  const base = extra || (recorrido || !elegidas.length ? e.t('pet.local.recorrido') : encontre);
  const relajada = r.relajado || r.parcial || r.ignoradas.length > 0 || porEstructura;
  const fuerza = r.parcial || porEstructura ? 'baja' : relajada || mejor < 4 ? 'media' : 'alta';
  return {
    mensaje: `${avisoSalud}${avisoExplicar}${base}${pregunta}`,
    lecciones: elegidas.map((c) => ({ id: c.L.id, motivo: c.motivo })),
    recorrido,
    sugerencias,
    coincidencia: info({ fuerza: elegidas.length || recorrido ? fuerza : 'ninguna', lecciones: elegidas.length, relajada }),
  };
}

/** Empezar desde cero: el recorrido de primeros pasos y sus primeras lecciones sin hacer. */
function empezarDesdeCero(e) {
  const R = RECORRIDO_POR_ID.get('primeros-pasos');
  const ids = leccionesDeRecorrido(R).filter((id) => e.porId.has(id) && !e.progreso.terminadas.has(id)).slice(0, 2);
  return {
    mensaje: e.t('pet.local.empezar'),
    lecciones: ids.map((id, i) => ({ id, motivo: e.t(i ? 'pet.motivo.siguiente' : 'pet.motivo.primera') })),
    recorrido: R.id,
    sugerencias: [],
  };
}
