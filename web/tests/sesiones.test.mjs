// Sesiones de estudio con Neuri en la app (sin DOM): el identificador del dispositivo (src/pet/dispositivo.js), el
// almacén de sesiones (src/pet/sesiones.js), el planificador sin IA (src/pet/planificador.js), el perfil
// (src/pet/perfil.js), «Mis datos» y la conversación con el cupo diario, la memoria y las sesiones
// (src/pet/conversacion.js). Ninguna prueba llama a Anthropic: los servidores son falsos (gasto cero).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import { crearBuscador } from '../src/biblioteca/buscar.js';
import { RECORRIDOS } from '../src/biblioteca/recorridos.js';
import { REGION_POR_ID, SUBREGION_POR_ID, SISTEMA_POR_ID, TEMA_POR_ID } from '../src/biblioteca/taxonomia.js';
import { t, tn, fijarIdioma, idioma } from '../src/i18n/idioma.js';
import { ETIQUETAS } from '../src/i18n/textos.js';
import * as P from '../src/biblioteca/progreso.js';
import { limpiarPlanSesion, limpiarPerfil, ID_DISPOSITIVO } from '../src/pet/protocolo.js';
import { idDispositivo, conDispositivo, CLAVE_DISPOSITIVO, CABECERA_DISPOSITIVO } from '../src/pet/dispositivo.js';
import { crearSesiones, CLAVE_SESIONES, CLAVE_SESIONES_APARTADAS, MAX_SESIONES, importarSesiones } from '../src/pet/sesiones.js';
import { planificarLocal, planificarSinTema, valorarObjetivo, puenteSesiones } from '../src/pet/planificador.js';
import { construirPerfil } from '../src/pet/perfil.js';
import { crearConversacion, CLAVE_MEMORIA, VIDA_MEMORIA } from '../src/pet/conversacion.js';
import { responderLocal } from '../src/pet/local.js';
import { decidirRuta } from '../src/pet/ruta.js';
import { crearTrabajos, PAUSAS } from '../src/pet/trabajos.js';
import { exportarDatos, importarDatos, borrarDatos, inventarioDatos, CLAVES_ESTUDIO, CLAVES_DISPOSITIVO } from '../src/biblioteca/datos.js';

const CATALOGO = JSON.parse(fs.readFileSync(new URL('../src/biblioteca/generado/catalogo.json', import.meta.url), 'utf8'));
const POR_ID = new Map(CATALOGO.lecciones.map((L) => [L.id, L]));
const IDS = new Set(POR_ID.keys());
const BUSCADOR = crearBuscador({ lecciones: CATALOGO.lecciones, recorridos: RECORRIDOS, etiquetas: ETIQUETAS, idioma });
const LECCIONES = new Map();
async function cargar(id) {
  if (!LECCIONES.has(id)) {
    try { LECCIONES.set(id, (await import(`../src/biblioteca/lecciones/${id}.js`)).default); } catch { LECCIONES.set(id, null); }
  }
  return LECCIONES.get(id);
}
const memoria = (inicial = {}) => {
  const s = { ...inicial };
  return { getItem: (k) => s[k] ?? null, setItem: (k, v) => { s[k] = String(v); }, removeItem: (k) => { delete s[k]; }, datos: s };
};
const DIA = 24 * 3600 * 1000;
const T0 = Date.UTC(2026, 10, 11, 10);
const RENUEVA = '2026-11-12T00:00:00+01:00';
const cupoDe = (quedan, limite = 30) => ({ preguntas: { limite, usadas: limite - quedan, quedan }, creaciones: { limite: 3, usadas: 0, quedan: 3 }, renueva: RENUEVA });

function entorno(progreso = {}) {
  fijarIdioma('es');
  return {
    buscador: BUSCADOR, porId: POR_ID, piezas: CATALOGO.piezas,
    progreso: { terminadas: new Set(progreso.terminadas ?? []), enCurso: new Set(), repasos: new Set() }, t, tn,
    nombreLugar: ([r, s]) => [REGION_POR_ID.get(r)?.nombre, s && SUBREGION_POR_ID.get(s)?.nombre].filter(Boolean).join(' › '),
    nombreMateria: (m) => (m.sistema ? SISTEMA_POR_ID.get(m.sistema)?.corto : TEMA_POR_ID.get(m.tema)?.nombre),
    sugerencias: t('pet.ejemplos').split('|'),
  };
}

/** Progreso con preguntas vencidas de una lección (para los repasos). */
function conVencidas(id, preguntas, ahora = T0) {
  const data = P.vacio();
  for (const q of preguntas) data.items[`${id}/${q}`] = { caja: 1, aciertos: 1, fallos: 1, dudas: 0, ultimo: ahora - 3 * DIA, proximo: ahora - DIA };
  return data;
}

/**
 * La app entera sin DOM: sesiones, puente, conversación (con la ruta) y un servidor falso. `responder(cuerpo, init)`:
 * lo que dice el servidor a cada POST; `get`: la respuesta al GET. `prohibido`: el fetch falla si se le llama.
 */
function montar({ responder = () => ({ ok: true, tipo: 'recomendacion', mensaje: 'Hola.', lecciones: [] }), get = { ok: true, ia: true, crear: true, version: 2 }, prohibido = false, data = P.vacio(), reloj = { t: T0 }, almacen = memoria(), sesionAlmacen = memoria(), recuerdo = almacen } = {}) {
  const llamadas = [];
  const fetchCrudo = async (url, init = {}) => {
    if (prohibido) throw new Error(`no se debía llamar al servidor (${init.method})`);
    llamadas.push({ metodo: init.method, cuerpo: init.body ? JSON.parse(init.body) : null, cabeceras: init.headers });
    if (init.method === 'GET') return new Response(JSON.stringify(get), { status: 200 });
    const d = await responder(JSON.parse(init.body), init);
    return new Response(JSON.stringify(d), { status: d.status ?? (d.ok === false ? 502 : 200) });
  };
  const fetch = conDispositivo(fetchCrudo, almacen);
  const ahora = () => reloj.t;
  const e = entorno();
  const sesiones = crearSesiones({ almacen, ahora });
  const puente = puenteSesiones({
    sesiones, catalogo: () => CATALOGO.lecciones, data: () => data, buscar: BUSCADOR, cargar, modelo: () => 'male', idioma: () => 'es',
    idsLecciones: () => IDS, t, ahora, zonas: () => ['Tórax'],
  });
  const c = crearConversacion({
    ids: { lecciones: IDS, recorridos: new Set(RECORRIDOS.map((R) => R.id)) }, fetch, almacen: sesionAlmacen, memoria: recuerdo, idioma: () => 'es', ahora,
    local: (x) => responderLocal(x, e),
    decidir: (x, estado) => decidirRuta(x, { ...estado, e, local: (y) => responderLocal(y, e) }),
    progreso: () => ({ terminadas: [], enCurso: [], repasos: [], guardadas: [] }),
    perfil: () => construirPerfil({ data, catalogo: CATALOGO.lecciones, sesiones: sesiones.lista, ahora }),
    sesiones: puente,
  });
  return { c, sesiones, puente, llamadas, posts: () => llamadas.filter((x) => x.metodo === 'POST'), almacen, data, reloj };
}

// ── A. Dispositivo ──

test('dispositivo: un identificador por navegador, en la cabecera de toda petición (nunca en el cuerpo); dañado o borrado, otro', async () => {
  const a = memoria();
  const id = idDispositivo(a);
  assert.match(id, ID_DISPOSITIVO);
  assert.equal(idDispositivo(a), id, 'se crea una vez');
  assert.equal(a.datos[CLAVE_DISPOSITIVO], id);
  const vistas = [];
  const f = conDispositivo(async (url, init) => { vistas.push(init); return new Response('{}'); }, a);
  const original = { 'content-type': 'application/json' };
  await f('/api/pet', { method: 'POST', headers: original, body: '{"v":2}' });
  await f('/api/pet', { method: 'GET' });
  await f('/api/pet', { method: 'GET', headers: new Headers({ accept: 'application/json' }) });
  assert.equal(vistas[0].headers[CABECERA_DISPOSITIVO], id);
  assert.equal(vistas[0].body, '{"v":2}', 'el cuerpo no cambia');
  assert.equal(original[CABECERA_DISPOSITIVO], undefined, 'las cabeceras de quien llama no se tocan');
  assert.equal(vistas[1].headers[CABECERA_DISPOSITIVO], id, 'también en el GET');
  assert.equal(vistas[2].headers.get(CABECERA_DISPOSITIVO), id);
  // Dañado: se cambia; borrado («Borrar mis datos»): otro distinto, no el de antes.
  a.datos[CLAVE_DISPOSITIVO] = '<script>';
  const otro = idDispositivo(a);
  assert.match(otro, ID_DISPOSITIVO);
  a.removeItem(CLAVE_DISPOSITIVO);
  assert.notEqual(idDispositivo(a), otro);
  // Sin almacenamiento: el mismo mientras dure la página.
  const roto = { getItem() { throw new Error('x'); }, setItem() { throw new Error('x'); } };
  assert.equal(idDispositivo(roto), idDispositivo(roto));
});

// ── B. Almacén de sesiones ──

test('sesiones: un plan del servidor se materializa con preguntas y pasos reales; lo que no existe o no está en el modelo se quita y se cuenta', async () => {
  const data = conVencidas('tor-corazon', ['id-atrio-derecho', 'id-atrio-izquierdo', 'id-ventriculo-derecho']);
  data.lecciones['mi-rodilla'] = { version: 1, paso: 1, vistos: [], completada: null, actividad: T0 - DIA, evaluaciones: [] };
  const rodilla = await cargar('mi-rodilla');
  data.lecciones['mi-rodilla'].vistos = rodilla.pasos.slice(0, 2).map((p) => p.id);
  const s = crearSesiones({ almacen: memoria(), ahora: () => T0 });
  const plan = {
    titulo: 'Corazón y rodilla', mensaje: 'Vamos por partes.', objetivo: 'Localizar las cavidades del corazón.',
    bloques: [
      { tipo: 'repaso', minutos: 3, motivo: 'Lo vencido.' },
      { tipo: 'leccion', leccion: 'tor-corazon', parte: 'inicio', minutos: 6, motivo: 'Empieza.' },
      { tipo: 'practica', leccion: 'tor-corazon', minutos: 4, motivo: 'Comprueba.' },
      { tipo: 'leccion', leccion: 'no-existe-esta', parte: 'entera', minutos: 5, motivo: 'x' },
      { tipo: 'leccion', leccion: 'mi-rodilla', parte: 'continuar', minutos: 5, motivo: 'Sigue.' },
      { tipo: 'practica', leccion: 'sis-reproductor-femenino', minutos: 4, motivo: 'Solo en el modelo femenino.' },
    ],
  };
  const r = await s.crear(plan, { origen: 'neuri', modelo: 'male', minutos: 25, nivel: 2, data, cargar, idsLecciones: new Set([...IDS]) });
  assert.equal(r.ok, true);
  const S = r.sesion;
  assert.match(S.id, /^ses-/);
  assert.deepEqual([S.origen, S.estado, S.i, S.minutos, S.nivel, S.modelo], ['neuri', 'planificada', 0, 25, 2, 'male']);
  assert.deepEqual(r.quitados, [{ tipo: 'leccion', leccion: 'no-existe-esta', motivo: 'no-existe' }, { tipo: 'practica', leccion: 'sis-reproductor-femenino', motivo: 'modelo' }]);
  assert.equal(S.quitados, 2);
  assert.deepEqual(S.bloques.map((b) => b.tipo), ['repaso', 'leccion', 'practica', 'leccion']);
  const [repaso, leccion, practica, sigue] = S.bloques;
  // Repaso: lo vencido (y nada que no esté vencido).
  assert.ok(repaso.items.length >= 1 && repaso.items.length <= 3);
  assert.ok(repaso.items.every((x) => Object.keys(data.items).includes(x)));
  // Lección: las primeras de sus pasos que caben en 6 de sus 18 minutos (8 pasos → 3).
  const corazon = await cargar('tor-corazon');
  assert.deepEqual(leccion.pasos, corazon.pasos.slice(0, 3).map((p) => p.id));
  // Práctica: preguntas reales, sin repetir las del repaso y solo de lo que la sesión enseña antes.
  assert.ok(practica.items.length >= 2);
  assert.ok(practica.items.every((x) => !repaso.items.includes(x)), 'sin repetir');
  for (const x of practica.items) {
    const q = corazon.preguntas.find((y) => `tor-corazon/${y.id}` === x);
    assert.ok(q, x);
    assert.ok(leccion.pasos.includes(q.paso), `${x}: de un paso que se enseñó`);
  }
  assert.ok(new Set(practica.items.map((x) => corazon.preguntas.find((y) => `tor-corazon/${y.id}` === x).tipo)).size >= 2, 'mezcla tipos de tarea');
  // Continuar: desde el primer paso sin ver.
  assert.equal(sigue.pasos[0], rodilla.pasos[2].id);
  // Todo vacío: no se crea nada.
  const vacia = await s.crear({ titulo: 'x', bloques: [{ tipo: 'repaso', minutos: 3 }] }, { data: P.vacio(), cargar, idsLecciones: IDS });
  assert.deepEqual([vacia.ok, vacia.error, vacia.quitados[0].motivo], [false, 'vacia', 'sin-preguntas']);
  assert.equal((await s.crear({ titulo: '', bloques: [] }, { cargar })).error, 'plan');
  assert.equal(s.lista.length, 1);
});

test('sesiones: reanudar tras recargar deja en el bloque exacto (y en la pregunta); avanzar es idempotente; terminar antes conserva lo hecho', async () => {
  const almacen = memoria();
  let ahora = T0;
  const s = crearSesiones({ almacen, ahora: () => ahora });
  const plan = planificarLocal({ objetivo: 'la mano', minutos: 20, catalogo: CATALOGO.lecciones, buscar: BUSCADOR, ahora: T0 });
  assert.ok(plan.bloques.length >= 2);
  const { sesion: S } = await s.crear(plan, { data: P.vacio(), cargar, idsLecciones: IDS });
  assert.equal(s.empezar(S.id).i, 0);
  const a = s.avanzar(S.id, { bloque: 0, aciertos: 2, total: 4, conAyuda: 1, revelados: 1, fallos: ['ms-mano-huesos/id-escafoides', 'nada bueno'] });
  assert.deepEqual([a.ok, a.i, a.fin], [true, 1, false]);
  const otra = s.avanzar(S.id, { bloque: 0, aciertos: 9, total: 9 });
  assert.deepEqual([otra.ok, otra.repetido], [true, true], 'repetir el mismo avance no duplica');
  assert.equal(S.resultados.length, 1);
  assert.equal(s.avanzar(S.id, { bloque: 3 }).error, 'fuera-de-orden');
  assert.equal(s.anotarPosicion(S.id, 2), true);
  ahora += 60_000;
  // «Recargar»: otra instancia sobre el mismo almacén.
  const s2 = crearSesiones({ almacen, ahora: () => ahora });
  assert.equal(s2.activa().id, S.id);
  const r = s2.reanudar(S.id);
  assert.deepEqual([r.i, r.posicion, r.bloque.tipo], [1, 2, S.bloques[1].tipo]);
  assert.deepEqual(s2.actual(S.id).posicion, 2);
  // Terminar antes de tiempo: lo hecho se conserva.
  assert.equal(s2.terminar(S.id), true);
  const res = s2.resumen(S.id);
  assert.deepEqual([res.estado, res.hechos, res.aciertos, res.preguntas, res.conAyuda, res.revelados, res.terminada], ['finalizada', 1, 2, 4, 1, 1, true]);
  assert.deepEqual(res.repasar, ['ms-mano-huesos/id-escafoides'], 'lo fallado (válido), para repasar');
  assert.equal(s2.empezar(S.id).error, 'finalizada');
  // Empezar otra pausa la activa: solo una a la vez.
  const { sesion: A } = await s2.crear(plan, { data: P.vacio(), cargar, idsLecciones: IDS });
  const { sesion: B } = await s2.crear(plan, { data: P.vacio(), cargar, idsLecciones: IDS });
  s2.empezar(A.id);
  s2.empezar(B.id);
  assert.deepEqual([s2.buscar(A.id).estado, s2.buscar(B.id).estado], ['pausada', 'activa']);
});

test('sesiones: como mucho 20 (primero se van las planificadas sin empezar, luego las finalizadas más antiguas; nunca la activa); lo dañado se aparta', async () => {
  const almacen = memoria();
  let ahora = T0;
  const s = crearSesiones({ almacen, ahora: () => ++ahora });
  const plan = { titulo: 'Mano', bloques: [{ tipo: 'leccion', leccion: 'ms-mano-huesos', parte: 'entera', minutos: 10 }] };
  const { sesion: activa } = await s.crear(plan, { cargar, idsLecciones: IDS });
  s.empezar(activa.id);
  const finalizada = (await s.crear(plan, { cargar, idsLecciones: IDS })).sesion;
  s.terminar(finalizada.id);
  for (let i = 0; i < MAX_SESIONES; i++) await s.crear(plan, { cargar, idsLecciones: IDS });
  assert.equal(s.lista.length, MAX_SESIONES);
  assert.ok(s.buscar(activa.id), 'la activa sigue');
  // (Desde el 12 nov 2026: antes que la finalizada se van las planificadas sin empezar, que no tienen nada hecho.)
  assert.ok(s.buscar(finalizada.id), 'la finalizada sigue: antes se van las planificadas sin empezar');
  // Dañado: una sesión rota entre otras buenas se aparta sola; un archivo ilegible o más nuevo, entero.
  const guardado = JSON.parse(almacen.datos[CLAVE_SESIONES]);
  guardado.sesiones.push({ id: 'ses-roto', estado: 'activa', bloques: 'x' });
  almacen.datos[CLAVE_SESIONES] = JSON.stringify(guardado);
  const s2 = crearSesiones({ almacen });
  assert.equal(s2.lista.length, MAX_SESIONES);
  s2.pausar(s2.lista[0].id);
  assert.equal(JSON.parse(almacen.datos[CLAVE_SESIONES_APARTADAS]).length, 1);
  for (const crudo of ['{no es json', JSON.stringify({ formato: 'anato3d-sesiones', version: 9, sesiones: [] })]) {
    const m = memoria({ [CLAVE_SESIONES]: crudo });
    const s3 = crearSesiones({ almacen: m });
    assert.equal(s3.lista.length, 0);
    await s3.crear(plan, { cargar, idsLecciones: IDS });
    assert.equal(JSON.parse(m.datos[CLAVE_SESIONES_APARTADAS])[0].texto, crudo, 'lo ilegible, a salvo tal cual');
    assert.equal(s3.apartados().length, 1);
  }
});

test('sesiones: si una lección desaparece, sus resultados se conservan y se sigue con el resto', async () => {
  const s = crearSesiones({ almacen: memoria(), ahora: () => T0 });
  const plan = { titulo: 'Dos', bloques: [
    { tipo: 'leccion', leccion: 'ms-mano-huesos', parte: 'entera', minutos: 10 },
    { tipo: 'leccion', leccion: 'tor-corazon', parte: 'entera', minutos: 18 },
    { tipo: 'practica', leccion: 'ms-mano-huesos', minutos: 4 },
  ] };
  const { sesion: S } = await s.crear(plan, { cargar, idsLecciones: IDS });
  s.empezar(S.id);
  s.avanzar(S.id, { bloque: 0 });
  const r = s.depurar(S.id, (id) => id !== 'tor-corazon');
  assert.deepEqual(r, { perdidos: 1, saltados: 1 });
  assert.equal(S.i, 2, 'el bloque perdido se saltó');
  assert.deepEqual(S.resultados.map((x) => [x.bloque, x.saltado, x.motivo ?? null]), [[0, false, null], [1, true, 'perdido']]);
  assert.equal(s.resumen(S.id).perdidos, 1);
});

// ── C. Planificador ──

test('planificador: un tema claro da un plan válido sin IA (repaso ≤ 40 %, lo empezado primero, práctica final, motivos con clave)', async () => {
  const plan = planificarLocal({ objetivo: 'Quiero estudiar la mano', minutos: 20, catalogo: CATALOGO.lecciones, buscar: BUSCADOR, ahora: T0, t });
  assert.ok(limpiarPlanSesion(plan, IDS), 'pasa el contrato');
  assert.ok(plan.bloques.every((b) => b.motivo && b.motivoClave?.clave?.startsWith('pet.ses.motivo.')));
  assert.deepEqual(plan.bloques.map((b) => [b.tipo, b.leccion, b.parte ?? null]), [['leccion', 'ms-mano-huesos', 'entera'], ['practica', 'ms-mano-huesos', null]]);
  assert.ok(plan.bloques.reduce((n, b) => n + b.minutos, 0) <= 20);
  // Si la práctica no cabe junto a la lección entera, la lección entera (que ya trae sus comprobaciones).
  const justo = planificarLocal({ objetivo: 'la mano', minutos: 15, catalogo: CATALOGO.lecciones, buscar: BUSCADOR, ahora: T0 });
  assert.deepEqual(justo.bloques.map((b) => [b.tipo, b.parte ?? null]), [['leccion', 'entera']]);
  // Poco tiempo para una lección larga: su inicio.
  const corto = planificarLocal({ objetivo: 'la mano', minutos: 5, catalogo: CATALOGO.lecciones, buscar: BUSCADOR, ahora: T0 });
  assert.deepEqual(corto.bloques.map((b) => [b.tipo, b.parte ?? null, b.minutos]), [['leccion', 'inicio', 5]]);
  assert.ok(plan.textos.titulo.clave && plan.titulo);
  // Con lo vencido del tema y una lección empezada.
  const data = conVencidas('ms-mano-huesos', ['id-escafoides', 'id-semilunar', 'id-piramidal', 'id-pisiforme']);
  const musculos = POR_ID.get('ms-mano-musculos');
  data.lecciones[musculos.id] = { version: musculos.version, paso: 1, vistos: ['orientacion'], completada: null, actividad: T0 - DIA, evaluaciones: [] };
  const otro = planificarLocal({ objetivo: 'la mano', minutos: 20, catalogo: CATALOGO.lecciones, data, buscar: BUSCADOR, ahora: T0 });
  assert.deepEqual(otro.bloques.slice(0, 2).map((b) => [b.tipo, b.parte ?? null, b.leccion ?? null]), [['repaso', null, null], ['leccion', 'continuar', musculos.id]]);
  assert.ok(otro.bloques[0].minutos <= 20 * 0.4 + 1, 'el repaso no pasa del 40 %');
  assert.ok(otro.ambito.includes('ms-mano-huesos'));
  // Sin tema reconocible: null; sin tema: lo pendiente (proponer, como en la portada).
  assert.equal(planificarLocal({ objetivo: 'dinosaurios', minutos: 10, catalogo: CATALOGO.lecciones, buscar: BUSCADOR }), null);
  const general = planificarSinTema({ minutos: 20, catalogo: CATALOGO.lecciones, data: P.vacio(), ahora: T0 });
  assert.ok(limpiarPlanSesion(general, IDS));
  assert.equal(valorarObjetivo('el corazón y la rodilla', BUSCADOR).mezcla, true, 'mezclar temas va a Neuri');
});

// ── D. Perfil ──

test('perfil: cumple el contrato sin perder nada, sin fechas ni respuestas, y cabe en ~350 tokens', async () => {
  assert.equal(construirPerfil({ data: P.vacio(), catalogo: CATALOGO.lecciones }), null, 'sin nada que decir, nada');
  const data = conVencidas('tor-corazon', ['id-atrio-derecho', 'id-atrio-izquierdo']);
  data.preferencias = { nivel: 2, minutos: 15, intereses: ['torax', 'cardiovascular', 'no-existe'] };
  const corazon = await cargar('tor-corazon');
  let f = T0 - 5 * DIA;
  for (const q of corazon.preguntas.slice(0, 12)) {
    const i = P.registrarIntento(data, { leccion: 'tor-corazon', pregunta: q.id, tipo: q.tipo, estructura: q.estructura ?? null, resultado: f % 3 ? 'acierto' : 'fallo', elegida: 'Atrio izquierdo', modo: 'practica' }, f += 1000);
    P.anotar(data, `tor-corazon/${q.id}`, i.r, f);
  }
  const sesiones = [{ titulo: 'Una sesión con un título muy largo '.repeat(5), estado: 'pausada', actualizada: T0, bloques: [{}, {}, {}], resultados: [{ bloque: 0 }, { bloque: 1, saltado: true }] }];
  const p = construirPerfil({ data, catalogo: CATALOGO.lecciones, sesiones, ahora: () => T0 });
  assert.deepEqual(limpiarPerfil(p, IDS), p, 'pasa limpiarPerfil sin perder nada');
  assert.deepEqual(p.intereses, ['torax', 'cardiovascular']);
  assert.deepEqual([p.nivel, p.minutos, p.vencidas >= 2], [2, 15, true]);
  assert.deepEqual(p.ultima, { titulo: sesiones[0].titulo.replace(/\s+/g, ' ').trim().slice(0, 80), hechos: 1, bloques: 3, terminada: false });
  assert.ok(p.dificultades.length >= 1 && p.dificultades.every((d) => d.leccion === 'tor-corazon'));
  const json = JSON.stringify(p);
  assert.doesNotMatch(json, /\d{10,}/, 'sin fechas');
  assert.doesNotMatch(json, /Atrio izquierdo/, 'sin lo que respondió');
  assert.ok(json.length <= 1300, `${json.length} caracteres`);
});

// ── «Mis datos» ──

test('mis datos: las sesiones se exportan e importan (la activa llega pausada); el dispositivo y la memoria se ven y se borran, pero no se exportan', async () => {
  const origen = memoria();
  idDispositivo(origen);
  origen.setItem(CLAVE_MEMORIA, JSON.stringify({ v: 1, contexto: { tema: 'corazón', objetivo: null, nivel: null, minutos: null }, actualizada: T0 }));
  const s = crearSesiones({ almacen: origen, ahora: () => T0 });
  const { sesion: S } = await s.crear({ titulo: 'Mano', bloques: [{ tipo: 'leccion', leccion: 'ms-mano-huesos', parte: 'entera', minutos: 10 }] }, { cargar, idsLecciones: IDS });
  s.empezar(S.id);
  const archivo = exportarDatos({ almacen: origen, data: P.vacio(), ahora: () => T0 });
  const d = JSON.parse(archivo);
  assert.equal(d.sesiones.formato, 'anato3d-sesiones');
  assert.ok(!archivo.includes(origen.datos[CLAVE_DISPOSITIVO]), 'el identificador del dispositivo no sale');
  assert.ok(!archivo.includes('anato3d.neuri.memoria') && !archivo.includes('"contexto"'), 'la memoria de Neuri tampoco');
  assert.deepEqual(CLAVES_DISPOSITIVO.every((k) => CLAVES_ESTUDIO.includes(k)), true);
  const destino = memoria();
  const r = importarDatos(archivo, { almacen: destino, data: P.vacio() });
  assert.deepEqual([r.sesiones.ok, r.sesiones.añadidas], [true, 1]);
  assert.equal(crearSesiones({ almacen: destino }).buscar(S.id).estado, 'pausada');
  assert.equal(importarDatos(archivo, { almacen: destino, data: P.vacio() }).sesiones.iguales, 1, 'sin duplicar');
  assert.equal(importarSesiones(destino, { formato: 'otro' }).error, 'formato');
  assert.equal(destino.datos[CLAVE_DISPOSITIVO], undefined, 'importar no trae el dispositivo de otro');
  const inv = inventarioDatos({ almacen: origen, data: P.vacio() });
  assert.deepEqual([inv.sesiones, inv.dispositivo, inv.memoria], [1, true, true]);
  assert.equal(borrarDatos({ almacen: origen }), true);
  assert.deepEqual([origen.datos[CLAVE_SESIONES], origen.datos[CLAVE_DISPOSITIVO], origen.datos[CLAVE_MEMORIA]], [undefined, undefined, undefined]);
});

// ── E y F. Conversación ──

test('conversación: una sesión de 10 minutos sobre un tema claro se crea y se termina con CERO llamadas', async () => {
  const app = montar({ prohibido: true });
  const m = await app.c.preguntar('Prepárame una sesión de 10 minutos sobre la mano');
  assert.equal(m.tipo, 'sesion');
  assert.deepEqual([m.origen, m.ruta, m.aviso], ['buscador', 'sesion', null]);
  const S = app.sesiones.buscar(m.sesionId);
  assert.ok(S && S.origen === 'local');
  assert.ok(m.resumen.titulo && m.resumen.bloques.length === S.bloques.length);
  assert.deepEqual(app.c.contexto.minutos, 10, 'Neuri recuerda los minutos');
  // Seguir la sesión: también en la app.
  const seguir = await app.c.preguntar('sigamos con la sesión');
  assert.deepEqual([seguir.tipo, seguir.sesionId, seguir.seguir], ['sesion', S.id, true]);
  // Se hace entera (una equivocación incluida) y se resume, sin red.
  app.sesiones.empezar(S.id);
  for (let k = 0; k < S.bloques.length; k++) app.sesiones.avanzar(S.id, { bloque: k, aciertos: 1, total: S.bloques[k].items ? 2 : 0, fallos: S.bloques[k].items ? [S.bloques[k].items[0]] : [] });
  assert.equal(app.sesiones.resumen(S.id).terminada, true);
  assert.match(app.c.historial().at(-1).texto, /\[Sesión de estudio «/);
  assert.equal(app.llamadas.length, 0);
});

test('conversación: un objetivo que mezcla temas va a Neuri (modo «sesion», con perfil y cabecera); si falla o se agota el cupo, se planifica en la app', async () => {
  const planIA = { titulo: 'Corazón y rodilla', mensaje: 'Primero el corazón.', objetivo: 'Localizar…', bloques: [
    { tipo: 'leccion', leccion: 'tor-corazon', parte: 'inicio', minutos: 8, motivo: 'a' },
    { tipo: 'leccion', leccion: 'leccion-inventada', parte: 'entera', minutos: 5, motivo: 'b' },
    { tipo: 'leccion', leccion: 'mi-rodilla', parte: 'inicio', minutos: 8, motivo: 'c' },
  ] };
  const app = montar({ responder: (cuerpo) => ({ ok: true, tipo: 'sesion', plan: planIA, modelo: 'claude-haiku-5-5', cupo: cupoDe(29) }) });
  const m = await app.c.preguntar('Hazme una clase de 20 minutos sobre el corazón y la rodilla');
  assert.deepEqual([m.tipo, m.origen], ['sesion', 'ia']);
  const [post] = app.posts();
  assert.equal(post.cuerpo.modo, 'sesion');
  assert.deepEqual([post.cuerpo.pedido.minutos, post.cuerpo.pedido.modelo], [20, 'male']);
  assert.ok(post.cuerpo.mensajes.length <= 6);
  assert.match(post.cabeceras[CABECERA_DISPOSITIVO], ID_DISPOSITIVO);
  assert.ok(!JSON.stringify(post.cuerpo).includes(post.cabeceras[CABECERA_DISPOSITIVO]), 'el dispositivo nunca va en el cuerpo');
  assert.equal(m.quitados, 1, 'la lección inventada no entra');
  assert.equal(app.c.cupo.preguntas.quedan, 29);
  // Cupo agotado en el servidor: la misma petición, en la app (con el aviso).
  const sin = montar({ responder: () => ({ ok: false, status: 429, error: 'cupo', de: 'preguntas', cupo: cupoDe(0), espera: 3_600_000 }) });
  const r = await sin.c.preguntar('Hazme una clase de 20 minutos sobre el corazón y la rodilla');
  assert.deepEqual([r.tipo, r.origen, r.aviso], ['sesion', 'buscador', 'sin-cupo']);
  assert.equal(sin.c.servicio.estado, 'sin-cupo');
  // Y lo siguiente ya no llama: va al buscador con el aviso.
  const otra = await sin.c.preguntar('¿Qué hace el manguito rotador?');
  assert.deepEqual([otra.origen, otra.aviso, sin.posts().length], ['buscador', 'sin-cupo', 1]);
  const otraSesion = await sin.c.preguntar('quiero una sesión sobre la mano y el corazón');
  assert.deepEqual([otraSesion.tipo, otraSesion.aviso, sin.posts().length], ['sesion', 'sin-cupo', 1]);
});

test('conversación: lee el cupo de todas las respuestas (GET, POST y errores) y sale de «sin-cupo» al renovarse', async () => {
  let quedan = 1;
  const reloj = { t: Date.parse('2026-11-11T20:00:00+01:00') };
  const app = montar({ reloj, get: { ok: true, ia: true, crear: true, version: 2, cupo: cupoDe(5) }, responder: () => ({ ok: true, tipo: 'recomendacion', mensaje: 'Mira esto.', lecciones: [], cupo: cupoDe(--quedan) }) });
  assert.equal(app.c.cupo, null);
  await app.c.comprobar();
  assert.equal(app.c.cupo.preguntas.quedan, 5, 'del GET');
  await app.c.comprobar({ forzar: true });
  assert.equal(app.llamadas.filter((x) => x.metodo === 'GET').length, 2, 'forzar vuelve a preguntar');
  const m = await app.c.preguntar('¿Qué hace el manguito rotador?');
  assert.equal(m.origen, 'ia');
  assert.equal(app.c.cupo.preguntas.quedan, 0, 'del POST');
  assert.equal(app.c.servicio.estado, 'sin-cupo', 'sin preguntas: no se gasta otra en un 429');
  assert.equal(app.c.servicio.hasta, Date.parse(RENUEVA));
  const local = await app.c.preguntar('¿Por qué late el corazón?');
  assert.deepEqual([local.origen, local.aviso, app.posts().length], ['buscador', 'sin-cupo', 1]);
  // Al renovarse, otra vez la IA.
  quedan = 31;
  reloj.t = Date.parse(RENUEVA) + 1000;
  const nueva = await app.c.preguntar('¿Para qué sirve el diafragma?');
  assert.deepEqual([nueva.origen, app.c.servicio.estado, app.posts().length], ['ia', 'disponible', 2]);
  // «limite» con su espera: no se reintenta en cada mensaje (y sin espera, sí, como antes).
  const lim = montar({ responder: () => ({ ok: false, status: 429, error: 'limite', espera: 60 }) });
  assert.equal((await lim.c.preguntar('¿Qué hace el bíceps?')).aviso, 'limite');
  assert.equal((await lim.c.preguntar('¿Qué hace el tríceps?')).aviso, 'limite');
  assert.equal(lim.posts().length, 1);
  assert.equal(lim.c.servicio.estado, 'limite');
});

test('conversación: recuerda el tema entre visitas (localStorage) y lo restaura al empezar otra; lo viejo se olvida', async () => {
  const recuerdo = memoria();
  const a = montar({ recuerdo, responder: () => ({ ok: true, tipo: 'recomendacion', mensaje: 'Del hombro.', lecciones: [], contexto: { tema: 'hombro', objetivo: 'examen', nivel: 2, minutos: 20 } }) });
  await a.c.preguntar('tengo examen del hombro y quiero que me expliques los músculos');
  const guardado = JSON.parse(recuerdo.datos[CLAVE_MEMORIA]);
  assert.deepEqual([guardado.v, guardado.contexto.tema, Object.keys(guardado).sort()], [1, 'hombro', ['actualizada', 'contexto', 'v']]);
  assert.ok(!recuerdo.datos[CLAVE_MEMORIA].includes('expliques'), 'nunca los mensajes');
  // Otra visita: otra pestaña (sessionStorage vacío), el mismo navegador.
  const b = montar({ recuerdo, reloj: { t: T0 + DIA } });
  assert.deepEqual(b.c.contexto, { tema: 'hombro', objetivo: 'examen', nivel: 2, minutos: 20 });
  assert.equal(b.c.mensajes.length, 0, 'la conversación no');
  b.c.reiniciar();
  assert.equal(b.c.contexto.tema, 'hombro', '«Nueva conversación» también empieza con lo recordado');
  const vieja = montar({ recuerdo, reloj: { t: T0 + VIDA_MEMORIA + 2 * DIA } });
  assert.equal(vieja.c.contexto.tema, null);
  b.c.olvidarMemoria();
  assert.equal(recuerdo.datos[CLAVE_MEMORIA], undefined);
});

test('conversación: perfil y enfoque viajan al orientar; «mostrar» y «sesion_pedida» de Neuri llegan al mensaje', async () => {
  const data = conVencidas('tor-corazon', ['id-atrio-derecho']);
  data.preferencias = { nivel: 2, minutos: 15, intereses: ['torax'] };
  const app = montar({ data, responder: (cuerpo) => (cuerpo.modo === 'orientar'
    ? { ok: true, tipo: 'recomendacion', mensaje: 'Te preparo una sesión de la mano.', lecciones: [], mostrar: [{ clave: 'Scaphoid', nombre: 'Escafoides' }], sesion_pedida: { objetivo: 'la mano', minutos: 10, nivel: null } }
    : { ok: false, error: 'no-deberia' }) });
  assert.equal(app.c.establecerEnfoque({ leccion: 'tor-corazon', paso: 'cavidades', sesion: false }), true);
  assert.deepEqual(app.c.enfoque, { leccion: 'tor-corazon', paso: 'cavidades', sesion: false });
  const m = await app.c.preguntar('quiero practicar algo de la mano porque mañana tengo un examen práctico muy difícil y me cuesta');
  const [post] = app.posts();
  assert.deepEqual([post.cuerpo.modo, post.cuerpo.perfil.nivel, post.cuerpo.enfoque.paso], ['orientar', 2, 'cavidades']);
  // El mensaje de Neuri (con «Ver en 3D») y, después, la sesión que pidió (en la app: el tema está claro).
  const ia = app.c.mensajes.at(-2);
  assert.deepEqual(ia.mostrar, [{ clave: 'Scaphoid', nombre: 'Escafoides' }]);
  assert.deepEqual([m.tipo, m.origen, app.posts().length], ['sesion', 'buscador', 1]);
  app.c.quitarEnfoque();
  assert.equal(app.c.enfoque, null);
});

// ── G. Trabajos ──

test('trabajos: el cupo diario de creaciones agotado es una pausa hasta la renovación (no un fallo) y el saldo llega a la conversación', async () => {
  assert.ok(PAUSAS.includes('cupo'));
  const vistos = [];
  const fetch = async () => new Response(JSON.stringify({ ok: false, error: 'cupo', de: 'creaciones', cupo: { ...cupoDe(10), creaciones: { limite: 3, usadas: 3, quedan: 0 } }, espera: 1000 }), { status: 429 });
  const tr = crearTrabajos({ fetch, almacen: memoria(), comun: () => ({ v: 2, idioma: 'es' }), guardarLeccion: () => ({ ok: true }), ahora: () => T0, alCupo: (c) => vistos.push(c) });
  const tbj = tr.iniciar({ solicitud: { accion: 'crear', tema: 'nariz' }, titulo: 'Nariz' });
  for (let i = 0; i < 20 && tr.buscar(tbj.id).estado !== 'error'; i++) await new Promise((r) => setTimeout(r, 5));
  const x = tr.buscar(tbj.id);
  assert.deepEqual([x.estado, x.error, x.reanudable, x.hasta], ['error', 'cupo', true, Date.parse(RENUEVA)]);
  assert.equal(vistos[0].creaciones.quedan, 0);
});

// ── Revisión adversarial del 12 nov 2026 ──

test('«Borrar mis datos» olvida también el tema que recuerda Neuri: no se vuelve a guardar ni viaja al servidor', async () => {
  const recuerdo = memoria({ [CLAVE_MEMORIA]: JSON.stringify({ v: 1, contexto: { tema: 'cáncer de mama de mi madre', objetivo: null, nivel: 2, minutos: 20 }, actualizada: T0 }) });
  const sesionAlmacen = memoria();
  const a = montar({ recuerdo, sesionAlmacen });
  assert.equal(a.c.contexto.tema, 'cáncer de mama de mi madre');
  // Lo que hace «Borrar mis datos» (pet.js olvidarTodo y datos.js borrarDatos).
  a.c.reiniciar({ sinMemoria: true }); a.c.olvidarMemoria(); a.c.quitarEnfoque();
  borrarDatos({ almacen: recuerdo, sesion: sesionAlmacen });
  assert.equal(a.c.contexto.tema, null);
  await a.c.preguntar('explícame el plexo braquial');
  const cuerpo = a.posts().at(-1).cuerpo;
  assert.equal(cuerpo.contexto?.tema ?? null, null, 'no viaja al servidor');
  assert.ok(!JSON.stringify(cuerpo).includes('mama'));
  assert.equal(recuerdo.datos[CLAVE_MEMORIA], undefined, 'ni se vuelve a guardar');
  // El orden de antes (reiniciar y luego olvidar) también olvida: olvidarMemoria limpia el estado de la página.
  const r2 = memoria({ [CLAVE_MEMORIA]: JSON.stringify({ v: 1, contexto: { tema: 'rodilla', objetivo: null, nivel: null, minutos: null }, actualizada: T0 }) });
  const b = montar({ recuerdo: r2 });
  b.c.reiniciar(); b.c.olvidarMemoria();
  assert.equal(b.c.contexto.tema, null);
  assert.equal(r2.datos[CLAVE_MEMORIA], undefined);
  // «Nueva conversación» (sin borrar) sigue empezando con lo recordado.
  const r3 = memoria({ [CLAVE_MEMORIA]: JSON.stringify({ v: 1, contexto: { tema: 'hombro', objetivo: null, nivel: null, minutos: null }, actualizada: T0 }) });
  const c = montar({ recuerdo: r3 });
  c.c.reiniciar();
  assert.equal(c.c.contexto.tema, 'hombro');
});

test('sesiones: solo una activa también al avanzar o saltar una planificada (y depurar un bloque perdido no la pone en marcha)', async () => {
  let ahora = T0;
  const s = crearSesiones({ almacen: memoria(), ahora: () => ++ahora });
  const L = (id) => ({ id, pasos: [{ id: 'p1' }, { id: 'p2' }], minutos: 4, preguntas: [] });
  const opc = { cargar: async (id) => L(id), idsLecciones: new Set(['lec-a', 'lec-b', 'lec-c', 'lec-d']) };
  const plan = (a, b) => ({ titulo: 'x', bloques: [{ tipo: 'leccion', leccion: a, parte: 'entera', minutos: 4, motivo: '' }, { tipo: 'leccion', leccion: b, parte: 'entera', minutos: 4, motivo: '' }] });
  const A = (await s.crear(plan('lec-a', 'lec-b'), opc)).sesion;
  s.empezar(A.id);
  const B = (await s.crear(plan('lec-c', 'lec-b'), opc)).sesion;
  s.saltar(B.id);                                   // «Saltar bloque» en la vista de B
  assert.deepEqual([A.estado, B.estado, s.activa().id], ['pausada', 'activa', B.id]);
  const C = (await s.crear(plan('lec-d', 'lec-b'), opc)).sesion;
  s.avanzar(C.id, { bloque: 0, aciertos: 0, total: 0 });
  assert.deepEqual([B.estado, C.estado], ['pausada', 'activa']);
  assert.equal(s.lista.filter((x) => x.estado === 'activa').length, 1);
  // Ver una planificada cuyo primer bloque ya no existe: se salta, pero no se pone en marcha ni pausa la activa.
  const D = (await s.crear(plan('lec-a', 'lec-b'), opc)).sesion;
  assert.deepEqual(s.depurar(D.id, (id) => id !== 'lec-a'), { perdidos: 1, saltados: 1 });
  assert.deepEqual([D.estado, C.estado], ['planificada', 'activa']);
});

test('sesiones: si el navegador no deja guardar, se avisa (una vez hasta que vuelva a poder) en vez de perderla en silencio', async () => {
  const base = memoria();
  let lleno = false;
  const almacen = { ...base, setItem: (k, v) => { if (lleno) throw new Error('QuotaExceededError'); base.setItem(k, v); } };
  let avisos = 0;
  const s = crearSesiones({ almacen, alNoGuardar: () => { avisos++; } });
  const plan = { titulo: 'Mano', bloques: [{ tipo: 'leccion', leccion: 'ms-mano-huesos', parte: 'entera', minutos: 10 }] };
  lleno = true;
  const r = await s.crear(plan, { cargar, idsLecciones: IDS });
  assert.deepEqual([r.ok, r.guardada, avisos], [true, false, 1]);
  s.empezar(r.sesion.id);
  assert.equal(s.anotarPosicion(r.sesion.id, 1), false);
  assert.equal(avisos, 1, 'una vez, no en cada paso');
  lleno = false;
  assert.equal(s.anotarPosicion(r.sesion.id, 2), true);
  assert.equal(crearSesiones({ almacen: base }).buscar(r.sesion.id)?.posicion?.n, 2, 'al poder, se guarda todo');
  lleno = true;
  s.avanzar(r.sesion.id, { bloque: 0 });
  assert.equal(avisos, 2, 'vuelve a avisar si vuelve a fallar');
  // En la interfaz el aviso es un texto nuevo, en español e inglés.
  fijarIdioma('es'); assert.match(t('ses.noGuardada'), /no se pudo guardar/i);
  fijarIdioma('en'); assert.match(t('ses.noGuardada'), /could not be saved/i);
  fijarIdioma('es');
});

test('sesiones: al pasar de 20, primero las planificadas sin empezar, luego las finalizadas, luego las pausadas; nunca la activa ni la nueva; y se avisa', async () => {
  let ahora = T0;
  const quitadas = [];
  const s = crearSesiones({ almacen: memoria(), ahora: () => ++ahora, alPodar: (x) => quitadas.push(...x) });
  const plan = (titulo) => ({ titulo, bloques: [{ tipo: 'leccion', leccion: 'ms-mano-huesos', parte: 'entera', minutos: 10 }] });
  const crear = async (titulo) => (await s.crear(plan(titulo), { cargar, idsLecciones: IDS })).sesion;
  // La más antigua: pausada con avance (un paso visto). Después, una finalizada, la activa y planificadas sin empezar.
  const pausada = await crear('Pausada');
  s.empezar(pausada.id); s.anotarPosicion(pausada.id, 1); s.pausar(pausada.id);
  const finalizada = await crear('Finalizada');
  s.terminar(finalizada.id);
  const activa = await crear('Activa');
  s.empezar(activa.id);
  for (let i = 0; i < MAX_SESIONES - 3; i++) await crear(`Plan ${i}`);
  assert.equal(s.lista.length, MAX_SESIONES);
  const r = await s.crear(plan('Nueva'), { cargar, idsLecciones: IDS });
  assert.deepEqual(r.podadas.map((x) => [x.titulo, x.estado]), [['Plan 0', 'planificada']]);
  assert.deepEqual(quitadas.map((x) => x.titulo), ['Plan 0'], 'se avisa de lo quitado');
  for (const x of [pausada, finalizada, activa, r.sesion]) assert.ok(s.buscar(x.id), x.titulo);
  // Sin planificadas sin empezar: la finalizada antes que la pausada con avance.
  for (const x of s.lista.filter((y) => y.estado === 'planificada' && y !== r.sesion)) s.terminar(x.id);
  s.empezar(r.sesion.id); s.anotarPosicion(r.sesion.id, 1); s.pausar(r.sesion.id); s.empezar(activa.id);
  const r2 = await s.crear(plan('Otra'), { cargar, idsLecciones: IDS });
  assert.deepEqual(r2.podadas.map((x) => x.titulo), ['Finalizada']);
  assert.ok(s.buscar(pausada.id), 'la pausada con avance sigue');
  // Solo pausadas (y la activa): se va la pausada más antigua; nunca la activa ni la que se acaba de crear.
  for (const x of s.lista.filter((y) => y.estado === 'finalizada' || y.estado === 'planificada')) s.quitar(x.id);
  while (s.lista.length < MAX_SESIONES) { const x = await crear('Relleno'); s.empezar(x.id); s.anotarPosicion(x.id, 1); s.pausar(x.id); }
  s.empezar(activa.id);
  const r3 = await s.crear(plan('Última'), { cargar, idsLecciones: IDS });
  assert.deepEqual(r3.podadas.map((x) => x.titulo), ['Pausada']);
  assert.ok(s.buscar(activa.id) && s.buscar(r3.sesion.id));
  assert.equal(s.lista.length, MAX_SESIONES);
  fijarIdioma('es'); assert.match(tn('ses.podadas', 1, { x: 'Plan 0' }), /Plan 0/);
  fijarIdioma('en'); assert.match(tn('ses.podadas', 2, { x: '“a”, “b”' }), /2 sessions were removed/);
  fijarIdioma('es');
});
