// Qué resuelve Neuri en la app y qué manda a la IA (src/pet/ruta.js), con la conversación de la app
// (src/pet/conversacion.js) y un servidor falso que cuenta las peticiones: las rutas locales no llaman a nadie aunque la
// IA esté configurada. La IA es simulada (gasto cero, decisión de Carlos del 11 nov 2026).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import { crearBuscador } from '../src/biblioteca/buscar.js';
import { responderLocal } from '../src/pet/local.js';
import { decidirRuta } from '../src/pet/ruta.js';
import { crearConversacion } from '../src/pet/conversacion.js';
import { RECORRIDOS } from '../src/biblioteca/recorridos.js';
import { REGION_POR_ID, SUBREGION_POR_ID, SISTEMA_POR_ID, TEMA_POR_ID } from '../src/biblioteca/taxonomia.js';
import { t, tn, fijarIdioma, idioma } from '../src/i18n/idioma.js';
import { ETIQUETAS } from '../src/i18n/textos.js';

const CATALOGO = JSON.parse(fs.readFileSync(new URL('../src/biblioteca/generado/catalogo.json', import.meta.url), 'utf8'));
const POR_ID = new Map(CATALOGO.lecciones.map((L) => [L.id, L]));
const IDS = { lecciones: new Set(POR_ID.keys()), recorridos: new Set(RECORRIDOS.map((R) => R.id)) };
const BUSCADOR = crearBuscador({ lecciones: CATALOGO.lecciones, recorridos: RECORRIDOS, etiquetas: ETIQUETAS, idioma });
const memoria = () => { const s = {}; return { getItem: (k) => s[k] ?? null, setItem: (k, v) => { s[k] = String(v); } }; };
const esperar = (ms = 0) => new Promise((r) => setTimeout(r, ms));
const IA_BIEN = { ok: true, tipo: 'recomendacion', mensaje: 'Para los vasos del corazón, estas.', lecciones: [{ id: 'cue-vasos', motivo: 'Vasos del cuello.' }, { id: 'sis-cardiovascular', motivo: 'Visión general.' }], sesion: null, recorrido: null, evidencias: [], solicitud: null, contexto: { tema: 'corazón', objetivo: null, nivel: null, minutos: null }, sugerencias: [] };

function entorno(progreso = {}) {
  fijarIdioma('es');
  return {
    buscador: BUSCADOR, porId: POR_ID, piezas: CATALOGO.piezas,
    progreso: { terminadas: new Set(progreso.terminadas ?? []), enCurso: new Set(), repasos: new Set(progreso.repasos ?? []) }, t, tn,
    nombreLugar: ([r, s]) => [REGION_POR_ID.get(r)?.nombre, s && SUBREGION_POR_ID.get(s)?.nombre].filter(Boolean).join(' › '),
    nombreMateria: (m) => (m.sistema ? SISTEMA_POR_ID.get(m.sistema)?.corto : TEMA_POR_ID.get(m.tema)?.nombre),
    sugerencias: t('pet.ejemplos').split('|'),
  };
}

/** La conversación como en la app (con la ruta) y un servidor falso que cuenta las peticiones de cada modo. */
function montar({ ia = true, responder = () => IA_BIEN, progreso = {} } = {}) {
  const posts = [];
  const fetch = async (url, init = {}) => {
    if (init.method === 'GET') return new Response(JSON.stringify({ ok: true, ia, crear: ia, version: 2 }), { status: 200 });
    const cuerpo = JSON.parse(init.body);
    posts.push(cuerpo);
    if (!ia) return new Response(JSON.stringify({ ok: false, error: 'sin-ia' }), { status: 503 });
    const d = await responder(cuerpo, init);
    return new Response(JSON.stringify(d), { status: d.ok === false ? (d.status ?? 502) : 200 });
  };
  const e = entorno(progreso);
  const c = crearConversacion({
    ids: IDS, fetch, almacen: memoria(), idioma: () => 'es',
    local: (texto) => responderLocal(texto, e),
    decidir: (texto, estado) => decidirRuta(texto, { ...estado, e, local: (x) => responderLocal(x, e) }),
    progreso: () => ({ terminadas: [...(progreso.terminadas ?? [])], enCurso: [], repasos: [...(progreso.repasos ?? [])], guardadas: [] }),
  });
  return { c, posts };
}

// [mensaje, ruta esperada ('local' o 'ia'), motivo, comprobación de lo que ve la persona]
const TABLA = [
  ['hola', 'local', 'sin-tema', (m) => m.texto === t('pet.local.saludo') && !m.lecciones.length],
  ['Quiero aprender la anatomia del órgano reproductor femenino', 'local', 'busqueda', (m) => m.lecciones[0].id === 'sis-reproductor-femenino'],
  ['Algo de 10 minutos', 'local', 'tiempo', (m) => m.lecciones.length > 0 && m.lecciones.every((x) => POR_ID.get(x.id).minutos <= 10)],
  ['Quiero repasar', 'local', 'repaso', (m) => m.texto === t('pet.local.repasarVacio')],
  ['quiero aprender anatomía', 'local', 'sin-tema', (m) => m.texto === t('pet.local.queTema') && m.sugerencias.length === 6],
  ['me duele la rodilla', 'local', 'busqueda', (m) => m.texto.startsWith(t('pet.local.salud')) && m.lecciones[0].id === 'mi-rodilla'],
  ['a veces pienso en hacerme daño', 'local', 'urgencia', (m) => m.texto === t('pet.local.urgencia') && !m.lecciones.length],
  ['¿Qué hace el manguito rotador?', 'ia', 'explicar', (m) => m.origen === 'ia'],
  ['Créame una lección sobre la nariz', 'ia', 'crear', (m) => m.origen === 'ia'],
  ['Quiero aprender los pulmones y cómo respiramos', 'ia', 'interpretar', (m) => m.origen === 'ia'],
  ['quiero aprender sobre dinosaurios', 'ia', 'interpretar', (m) => m.origen === 'ia'],
  ['Algo más avanzado sobre el corazón', 'ia', 'interpretar', (m) => m.origen === 'ia'],
];

test('ruta: cada mensaje va a la app o a la IA, con las llamadas justas (las locales, ninguna aunque haya IA)', async () => {
  const filas = [];
  for (const [mensaje, ruta, motivo, ve] of TABLA) {
    const { c, posts } = montar();
    assert.equal(await c.comprobar(), true, 'la IA está configurada');
    const m = await c.preguntar(mensaje);
    const llamadas = posts.length;
    filas.push([mensaje, m.ruta ?? 'ia', llamadas]);
    assert.equal(llamadas, ruta === 'local' ? 0 : 1, `${mensaje}: ${llamadas} llamadas`);
    assert.equal(m.origen, ruta === 'local' ? 'buscador' : 'ia', mensaje);
    if (ruta === 'local') assert.equal(m.ruta, motivo, mensaje);
    else assert.equal(decidirRuta(mensaje, { e: entorno(), local: (x) => responderLocal(x, entorno()) }).motivo, motivo, mensaje);
    assert.ok(ve(m), `${mensaje}: lo que ve la persona`);
  }
  assert.equal(filas.filter(([, r]) => r !== 'ia').length, 7, 'siete de doce se resuelven sin gastar');
});

test('ruta: «el segundo», «la cuarta» y «esa ya la hice» usan las tarjetas que se mostraron y el progreso, sin IA', async () => {
  const { c, posts } = montar({ progreso: { terminadas: ['tor-corazon'] } });
  await c.comprobar();
  const primera = await c.preguntar('Enséñame la anatomía del corazón');
  assert.deepEqual(primera.lecciones.map((x) => x.id), ['sis-cardiovascular', 'tor-corazon'], 'lo terminado, al final');
  const segunda = await c.preguntar('el segundo');
  assert.deepEqual([segunda.ruta, segunda.texto, segunda.lecciones.map((x) => x.id)], ['referencia', t('pet.ruta.esta'), ['tor-corazon']]);
  // Ahora la última respuesta tiene una tarjeta: «la cuarta» no existe; se vuelve a enseñar la que hay, sin inventar.
  const cuarta = await c.preguntar('la cuarta');
  assert.deepEqual([cuarta.ruta, cuarta.texto, cuarta.lecciones.map((x) => x.id)], ['referencia', t('pet.ruta.cual', { n: 1 }), ['tor-corazon']]);
  const otra = montar({ progreso: { terminadas: ['tor-corazon'] } });
  await otra.c.comprobar();
  await otra.c.preguntar('Enséñame la anatomía del corazón');
  const tercera = await otra.c.preguntar('ábreme la tercera');
  assert.equal(tercera.ruta, 'referencia');
  assert.equal(tercera.texto, t('pet.ruta.cual', { n: 2 }), 'solo había dos');
  assert.deepEqual(tercera.lecciones.map((x) => x.id), ['sis-cardiovascular', 'tor-corazon']);
  const hecha = await otra.c.preguntar('el segundo ya lo hice');
  assert.equal(hecha.ruta, 'hecha');
  assert.equal(hecha.texto, t('pet.ruta.hechaSi'), 'el progreso dice que la terminó');
  assert.deepEqual(hecha.lecciones.map((x) => x.id), ['tor-mediastino', 'tor-pulmones'], 'lo que va después del corazón');
  assert.equal(posts.length + otra.posts.length, 0, 'nada de esto llamó a la IA');
});

test('ruta: se alternan respuestas locales y de la IA, y la IA recibe las tarjetas que enseñó la app', async () => {
  const { c, posts } = montar();
  await c.comprobar();
  const local = await c.preguntar('Enséñame la anatomía del corazón');
  assert.equal(local.origen, 'buscador');
  const ia = await c.preguntar('¿y los vasos?');
  assert.equal(ia.origen, 'ia');
  assert.equal(posts.length, 1);
  // El turno local viaja en el historial con sus tarjetas, para que «el segundo» o «de esos» se entiendan allí también.
  const turnoLocal = posts[0].mensajes.find((x) => x.rol === 'pet');
  assert.deepEqual(turnoLocal.lecciones.map((x) => x.id), local.lecciones.map((x) => x.id));
  // Y «el segundo» después de la respuesta de la IA es su segunda tarjeta, otra vez sin llamarla.
  const seg = await c.preguntar('el segundo');
  assert.deepEqual([seg.ruta, seg.lecciones[0].id, posts.length], ['referencia', 'sis-cardiovascular', 1]);
  // Una respuesta a lo que preguntó la IA va a la IA, aunque el buscador sabría responder algo.
  const pregunta = montar({ responder: (cuerpo) => (cuerpo.mensajes.length === 1 ? { ...IA_BIEN, tipo: 'aclaracion', mensaje: '¿Para qué nivel?', lecciones: [] } : IA_BIEN) });
  await pregunta.c.comprobar();
  await pregunta.c.preguntar('quiero estudiar el corazón para un parcial difícil');
  const nivel = await pregunta.c.preguntar('básico');
  assert.deepEqual([nivel.origen, pregunta.posts.length], ['ia', 2]);
  // Con un tema ya hablado con la IA, «algo de 10 minutos» es de ese tema: también va a la IA.
  const diez = await pregunta.c.preguntar('Algo de 10 minutos');
  assert.deepEqual([diez.origen, pregunta.posts.length], ['ia', 3]);
});

test('ruta: una respuesta de la IA que llega tarde, después de cancelar y cambiar de tema, se descarta', async () => {
  let soltar;
  const { c, posts } = montar({ responder: () => new Promise((r) => { soltar = () => r(IA_BIEN); }) });
  await c.comprobar();
  const lenta = c.preguntar('¿Qué hace el manguito rotador?');
  await esperar(5);
  assert.equal(posts.length, 1);
  assert.equal(c.cancelar(), true);
  const nueva = await c.preguntar('Quiero estudiar los riñones');
  assert.equal(nueva.ruta, 'busqueda');
  soltar();
  assert.equal(await lenta, null, 'la respuesta vieja no se añade');
  assert.deepEqual(c.mensajes.filter((m) => m.rol === 'pet').map((m) => m.origen), ['buscador']);
  assert.equal(c.mensajes.at(-1).lecciones[0].id, 'abd-rinones');
});

test('ruta: sin IA, lo que la necesita responde el buscador y dice qué puede hacer la persona', async () => {
  const { c, posts } = montar({ ia: false });
  assert.equal(await c.comprobar(), false);
  const exp = await c.preguntar('¿Qué hace el manguito rotador?');
  assert.equal(exp.origen, 'buscador');
  assert.ok(exp.texto.startsWith(t('pet.local.explicar')), exp.texto);
  assert.equal(exp.lecciones[0].id, 'ms-hombro-musculos');
  const crea = await c.preguntar('Créame una lección sobre la nariz');
  assert.ok(crea.texto.startsWith(t('pet.local.crear')));
  assert.equal(posts.length, 0, 'ya sabe que no hay IA: no lo intenta');
  // «el segundo» funciona igual sin IA.
  await c.preguntar('Enséñame la anatomía del corazón');
  assert.equal((await c.preguntar('el segundo')).ruta, 'referencia');
});

// ── Sesiones de estudio y «Ver en 3D» (11 nov 2026): rutas nuevas, sin cambiar las de arriba ──
const ruta = (texto, extra = {}) => { const e = entorno(); return decidirRuta(texto, { e, local: (x) => responderLocal(x, e), ...extra }); };

test('ruta: pedir una sesión de estudio (cinco idiomas) es la ruta «sesion» con los minutos; «créame una lección» sigue siendo crear', () => {
  const casos = [
    ['Prepárame una sesión de 10 minutos sobre el corazón', 10],
    ['Tengo 15 minutos para estudiar la rodilla', 15],
    ['Hazme una clase de 20 minutos sobre el hombro', 20],
    ['quiero una sesión sobre los riñones', null],
    ['Make me a 10 minute study session on the heart', 10],
    ['I have 15 minutes to study the knee', 15],
    ['Bereite mir eine Lernsitzung von 10 Minuten über das Herz vor', 10],
    ['Prépare-moi une séance de 15 minutes sur le cœur', 15],
    ['Preparami una sessione di 10 minuti sul cuore', 10],
  ];
  for (const [texto, minutos] of casos) {
    const d = ruta(texto);
    assert.deepEqual([d.ruta, d.motivo, d.pedido?.minutos], ['sesion', 'sesion', minutos], texto);
    assert.equal(d.pedido.objetivo, texto, 'el objetivo son sus palabras');
  }
  // Sin tema: el de la conversación (o ninguno: la app propone lo pendiente).
  assert.equal(ruta('Ich habe 20 Minuten zum Lernen').pedido.objetivo, '');
  assert.equal(ruta('una sesión de 20 minutos', { contexto: { tema: 'hombro', nivel: 2 } }).pedido.objetivo, 'hombro');
  assert.equal(ruta('una sesión de 20 minutos', { contexto: { tema: 'hombro', nivel: 2 } }).pedido.nivel, 2);
  // Lo que no es pedir una sesión no cambia.
  assert.equal(ruta('Créame una lección sobre la nariz').motivo, 'crear');
  assert.equal(ruta('Algo de 10 minutos').motivo, 'tiempo');
  assert.notEqual(ruta('pausa la sesión').ruta, 'sesion', 'pararla es de la interfaz');
});

test('ruta: «sigamos con la sesión» apunta a la sesión en curso, sin IA; si no hay ninguna, la app lo dice', () => {
  const sesion = { id: 'ses-0123456789abcdef', titulo: 'La mano · 15 min' };
  for (const texto of ['sigamos con la sesión', 'continue the session', 'weiter mit der Sitzung', 'reprenons la séance', 'riprendiamo la sessione']) {
    const d = ruta(texto, { sesion });
    assert.deepEqual([d.ruta, d.motivo, d.seguir], ['sesion', 'seguir-sesion', true], texto);
  }
  const sin = ruta('continuar la sesión');
  assert.deepEqual([sin.ruta, sin.motivo, sin.respuesta.mensaje], ['local', 'seguir-sesion', t('pet.ses.ninguna')]);
});

test('ruta: «muéstrame X» con una pieza clara del modelo responde en la app con «Ver en 3D» y sus lecciones; si no está clara, como siempre', () => {
  const piezas = () => [
    { clave: 'Liver', nombre: 'Hígado', latin: 'Hepar', en: 'Liver' },
    { clave: 'Femur_L', nombre: 'Fémur izquierdo', latin: 'Femur', en: 'Femur' },
    { clave: 'Femur_R', nombre: 'Fémur derecho', latin: 'Femur', en: 'Femur' },
    { clave: 'Brachialis_muscle_L', nombre: 'Músculo braquial', latin: 'Musculus brachialis', en: 'Brachialis muscle' },
    { clave: 'Long_head_of_biceps_brachii_L', nombre: 'Cabeza larga del bíceps braquial', latin: 'Caput longum musculi bicipitis brachii', en: 'Long head of biceps brachii' },
    { clave: 'Short_head_of_biceps_brachii_L', nombre: 'Cabeza corta del bíceps braquial', latin: 'Caput breve musculi bicipitis brachii', en: 'Short head of biceps brachii' },
  ];
  const casos = [
    ['¿Dónde está el hígado?', 'Liver', 'abd-higado-pancreas'],
    ['Enséñame el fémur en 3D', 'Femur', 'mi-huesos'],
    ['Where is the liver?', 'Liver', 'abd-higado-pancreas'],
    ['Zeig mir den Femur', 'Femur', 'mi-huesos'],
    ['muéstrame la cabeza larga del bíceps braquial', 'Long_head_of_biceps_brachii', null],
  ];
  for (const [texto, clave, primera] of casos) {
    const d = ruta(texto, { piezas });
    assert.deepEqual([d.ruta, d.motivo, d.respuesta.mostrar[0].clave], ['local', 'mostrar', clave], texto);
    if (primera) assert.equal(d.respuesta.lecciones[0].id, primera, texto);
  }
  assert.equal(ruta('Enséñame el fémur en 3D', { piezas }).respuesta.mostrar[0].nombre, 'Fémur', 'sin el lado');
  // Un latín compartido (la piel del muslo también es «Femur» en el modelo): manda el nombre, después el inglés.
  const conPiel = () => [...piezas(), { clave: 'Skin_of_thigh_L', nombre: 'Piel del muslo', latin: 'Femur', en: 'Skin of thigh' }];
  for (const texto of ['muéstrame el fémur', 'Show me the femur']) assert.equal(ruta(texto, { piezas: conPiel }).respuesta?.mostrar?.[0]?.clave, 'Femur', texto);
  // Ambiguo (dos cabezas del bíceps), «enséñame» sin «en 3D» (es aprender) o sin piezas: la ruta de siempre.
  assert.notEqual(ruta('muéstrame el bíceps', { piezas }).motivo, 'mostrar');
  assert.equal(ruta('Enséñame la anatomía del corazón', { piezas }).motivo, 'busqueda');
  assert.notEqual(ruta('¿Dónde está el hígado?').motivo, 'mostrar');
});

// Revisión adversarial del 12 nov 2026: seguir la sesión aunque el mensaje sea largo o diga «quiero»; pararla o
// terminarla lo hacen sus botones (la app lo dice, sin IA); «para la sesión» es una orden, no «para» de preposición.
test('ruta: seguir una sesión con un mensaje largo; pausarla, pararla o terminarla, respuesta de la app que señala sus botones', () => {
  const sesion = { id: 'ses-0123456789abcdef', titulo: 'Sesión: corazón' };
  for (const texto of [
    'continuemos con la sesión de ayer sobre el corazón',
    'quiero seguir con la sesión que dejé a medias ayer por la tarde',
    'I want to continue the session I left half done yesterday afternoon',
    'can we please resume my study session from yesterday about the heart',
  ]) {
    const d = ruta(texto, { sesion });
    assert.deepEqual([d.ruta, d.motivo, d.seguir], ['sesion', 'seguir-sesion', true], texto);
  }
  for (const texto of ['pausa la sesión', 'termina la sesión', 'para la sesión, por favor', 'Para la clase', 'stop the session', 'pause my session please', 'end the session']) {
    const d = ruta(texto, { sesion });
    assert.deepEqual([d.ruta, d.motivo, d.respuesta.mensaje], ['local', 'control-sesion', t('pet.ses.control', { x: sesion.titulo })], texto);
    assert.equal(ruta(texto).respuesta.mensaje, t('pet.ses.ninguna'), `${texto} (sin sesión)`);
  }
  assert.match(t('pet.ses.control', { x: 'X' }), /Terminar sesión/);
  // «para» de preposición y pedir una sesión nueva no cambian.
  for (const [texto, minutos] of [['Prepárame una sesión de 10 minutos para la rodilla', 10], ['quiero una sesión para repasar el corazón', null], ['Make me a new session to continue with the heart', null]]) {
    const d = ruta(texto, { sesion });
    assert.deepEqual([d.ruta, d.motivo, d.pedido?.minutos], ['sesion', 'sesion', minutos], texto);
  }
  // Inglés: el texto nuevo existe.
  fijarIdioma('en');
  assert.match(t('pet.ses.control', { x: 'X' }), /End session/);
  fijarIdioma('es');
});

test('sin IA en la web: las sugerencias del saludo no llaman al servidor y dan algo útil; los avisos no dicen «ahora no está disponible»', async () => {
  for (const lengua of ['es', 'en']) {
    fijarIdioma(lengua);
    for (const s of t('pet.ejemplosSinIa').split('|')) {
      const { c, posts } = montar({ ia: false });
      await c.comprobar();
      fijarIdioma(lengua);
      const m = await c.preguntar(s);
      assert.equal(posts.length, 0, `${lengua}: «${s}» llamó al servidor`);
      assert.ok(m.lecciones?.length || m.sesion || m.mostrar?.length || m.sugerencias?.length, `${lengua}: «${s}» no dio nada útil`);
    }
    const e = { ...entorno(), sinIa: true };
    fijarIdioma(lengua);
    const explicar = responderLocal(lengua === 'es' ? '¿Qué hace el manguito rotador?' : 'What does the rotator cuff do?', e);
    assert.ok(explicar.mensaje.startsWith(t('pet.local.explicarSinIa')), `${lengua}: ${explicar.mensaje}`);
    const crear = responderLocal(lengua === 'es' ? 'Crea una lección sobre la nariz' : 'Create a lesson about the nose', e);
    assert.ok(crear.mensaje.startsWith(t('pet.local.crearSinIa')), `${lengua}: ${crear.mensaje}`);
  }
  fijarIdioma('es');
});
