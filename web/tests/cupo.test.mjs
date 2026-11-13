// Cupo diario de Neuri por dispositivo (server/neuri/cupo.mjs y su enganche en server/pet.mjs): cuenta y agota, el 429
// del contrato, la medianoche de la zona, el archivo (reiniciar, cerrojo entre procesos, sin identificadores en claro),
// la devolución cuando Claude no responde, la IP sin cabecera (o con una inválida), el tope por IP, el GET y los trabajos
// reanudados. Sin red ni gasto: el SDK real con un `fetch` falso o un cliente con guion.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import Anthropic from '@anthropic-ai/sdk';
import { crearCupo, cupoDesdeEntorno, dispositivoDe, CABECERA_DISPOSITIVO } from '../server/neuri/cupo.mjs';
import { randomUUID } from 'node:crypto';
import { crearManejador, crearLimitador, huellaPlan } from '../server/pet.mjs';
import { crearPresupuesto } from '../server/neuri/presupuesto.mjs';
import { normalizarIp } from '../server/neuri/ip.mjs';
import { cargarInventario } from '../server/neuri/inventario.mjs';
import { crearCorpus } from '../server/neuri/evidencias.mjs';
import { limpiarCupo, limpiarPlan } from '../src/pet/protocolo.js';

const CATALOGO = JSON.parse(fs.readFileSync(new URL('../src/biblioteca/generado/catalogo.json', import.meta.url), 'utf8'));
const silencio = { info() {}, error() {} };
const carpetas = [];
const abiertos = [];
const tmp = () => { const d = fs.mkdtempSync(path.join(os.tmpdir(), 'anato3d-cupo-')); carpetas.push(d); return d; };
/** Un cupo que se cierra solo al final (si una prueba falla, el cerrojo no queda tomado). */
const cupo = (opciones) => { const c = crearCupo({ registro: silencio, ...opciones }); abiertos.push(c); return c; };
after(() => {
  for (const c of abiertos) c.cerrar();
  for (const d of carpetas) fs.rmSync(d, { recursive: true, force: true });
});

const ID1 = '0f1e2d3c-4b5a-4968-8778-695a4b3c2d1e';
const ID2 = 'aaaabbbb-cccc-4ddd-8eee-ffff00001111';
const ID3 = '7c1d2e3f-4a5b-4c6d-8e7f-8091a2b3c4d5';

/** El SDK real con un `fetch` falso: `responder()` devuelve { status, cuerpo }. */
function apiFalsa(responder) {
  const llamadas = [];
  const fetch = async (url, init) => {
    llamadas.push(JSON.parse(init.body));
    const r = await responder();
    return new Response(JSON.stringify(r.cuerpo), { status: r.status ?? 200, headers: { 'content-type': 'application/json' } });
  };
  return { cliente: new Anthropic({ apiKey: 'sk-ant-prueba', fetch, maxRetries: 0 }), llamadas };
}
const BIEN = { tipo: 'recomendacion', mensaje: 'Esta.', lecciones: [{ id: 'ms-hombro-musculos', motivo: 'Músculos del hombro.' }], sesion: null, recorrido: null, evidencias: [], solicitud: null, contexto: { tema: 'hombro', objetivo: null, nivel: null, minutos: null }, sugerencias: [], sesion_pedida: null };
const respuesta = (datos) => ({ cuerpo: { id: 'm', type: 'message', role: 'assistant', model: 'claude-haiku-5-5', content: [{ type: 'text', text: JSON.stringify(datos) }], stop_reason: 'end_turn', stop_sequence: null, usage: { input_tokens: 100, output_tokens: 50 } } });
const error500 = { status: 500, cuerpo: { type: 'error', error: { type: 'api_error', message: 'error 500' } } };

const pregunta = (texto = '¿Qué músculos mueven el hombro?') => ({ v: 2, modo: 'orientar', idioma: 'es', mensajes: [{ rol: 'usuario', texto }], progreso: { terminadas: [], enCurso: [], repasos: [], guardadas: [] } });
function peticion(cuerpo, { dispositivo = null, metodo = 'POST' } = {}) {
  const headers = { 'content-type': 'application/json', origin: 'http://localhost:5180', ...(dispositivo ? { [CABECERA_DISPOSITIVO]: dispositivo } : {}) };
  return new Request('http://localhost:5180/api/pet', { method: metodo, headers, body: metodo === 'POST' ? JSON.stringify(cuerpo) : undefined });
}
const manejador = (c, cliente, extra = {}) => crearManejador({ catalogo: CATALOGO, cliente, registro: silencio, cupo: c, limites: { porIp: 1000, porHora: 1000 }, ...extra });

test('cupo: cuenta y agota por dispositivo (cada uno el suyo); la forma es la del contrato', () => {
  const c = cupo({ limites: { preguntas: 3, creaciones: 1 } });
  const yo = { dispositivo: ID1, ip: '10.0.0.1' };
  for (const n of [1, 2, 3]) {
    const g = c.gastar(yo, 'preguntas');
    assert.equal(g.ok, true);
    assert.deepEqual(g.cupo.preguntas, { limite: 3, usadas: n, quedan: 3 - n });
  }
  const no = c.gastar(yo, 'preguntas');
  assert.deepEqual([no.ok, no.de, no.cupo.preguntas.quedan], [false, 'preguntas', 0]);
  assert.ok(no.espera >= 1000);
  // Las creaciones van aparte; otro dispositivo (aunque comparta IP) tiene su cupo.
  assert.equal(c.gastar(yo, 'creaciones').ok, true);
  assert.equal(c.gastar(yo, 'creaciones').ok, false);
  assert.equal(c.consultar({ dispositivo: ID2, ip: '10.0.0.1' }).preguntas.quedan, 3);
  // Lo que devuelve consultar pasa el limpiador de la app tal cual.
  const f = c.consultar(yo);
  assert.deepEqual(limpiarCupo(f), f);
  assert.throws(() => c.gastar(yo, 'otra-cosa'), /cupo desconocido/);
});

test('cupo: se renueva a medianoche en la zona del servidor (America/Tijuana), no en UTC', () => {
  let t = Date.parse('2026-11-12T07:59:00Z');          // 23:59 del 11 de noviembre en Tijuana
  const c = cupo({ limites: { preguntas: 1 }, ahora: () => t });
  const yo = { dispositivo: ID1, ip: '1.1.1.1' };
  assert.equal(c.gastar(yo, 'preguntas').ok, true);
  const no = c.gastar(yo, 'preguntas');
  assert.equal(no.ok, false);
  assert.equal(no.cupo.renueva, '2026-11-12T08:00:00.000Z');
  assert.equal(no.espera, 60_000);
  t = Date.parse('2026-11-12T08:00:01Z');               // 00:00:01 del 12 en Tijuana
  const r = c.consultar(yo);
  assert.deepEqual(r.preguntas, { limite: 1, usadas: 0, quedan: 1 });
  assert.equal(r.renueva, '2026-11-13T08:00:00.000Z');
  assert.equal(c.resumen().dia, '2026-11-12', 'los días viejos se podan');
});

const SAL = 'secreto-de-prueba-0123456789';

test('cupo: persiste tras reiniciar (con ANATO3D_CUPO_SAL); el archivo solo guarda claves HMAC (ni el identificador ni la IP); lo dañado se aparta', () => {
  const dir = tmp();
  const archivo = path.join(dir, 'cupo.json');
  const vivo = () => false;
  const a = cupo({ archivo, limites: { preguntas: 2 }, pid: 101, vivo, sal: SAL });
  assert.equal(a.persistente, true);
  a.gastar({ dispositivo: ID1, ip: '203.0.113.7' }, 'preguntas');
  a.gastar({ dispositivo: null, ip: '198.51.100.9' }, 'preguntas');
  a.cerrar();
  const crudo = fs.readFileSync(archivo, 'utf8');
  for (const x of [ID1, '203.0.113.7', '198.51.100.9']) assert.ok(!crudo.includes(x), x);
  assert.ok(!fs.existsSync(`${archivo}.lock`), 'al cerrar se suelta el cerrojo');
  // «Reiniciar»: otro proceso sobre el mismo archivo ve lo gastado.
  const b = cupo({ archivo, limites: { preguntas: 2 }, pid: 102, vivo, sal: SAL });
  assert.deepEqual(b.consultar({ dispositivo: ID1, ip: '203.0.113.7' }).preguntas, { limite: 2, usadas: 1, quedan: 1 });
  assert.equal(b.consultar({ dispositivo: null, ip: '198.51.100.9' }).preguntas.usadas, 1);
  b.cerrar();
  // Dañado: se aparta (no se pisa) y se empieza de cero.
  fs.writeFileSync(archivo, '{ roto');
  const errores = [];
  const c = cupo({ archivo, pid: 103, vivo, registro: { info() {}, error: (s) => errores.push(s) } });
  assert.equal(c.consultar({ dispositivo: ID1, ip: 'x' }).preguntas.usadas, 0);
  assert.ok(fs.readdirSync(dir).some((f) => f.startsWith('cupo.json.danado-')));
  assert.match(errores.join(' '), /dañado: se apartó/);
});

test('cupo: dos procesos con el mismo archivo no cuentan cada uno (cerrojo); en el mismo proceso comparten estado', () => {
  const archivo = path.join(tmp(), 'cupo.json');
  const errores = [];
  const reg = { info() {}, error: (s) => errores.push(s) };
  const a = cupo({ archivo, limites: { preguntas: 3 }, pid: 201, vivo: () => false, registro: reg });
  // Otro proceso vivo con el cerrojo: este no deja gastar nada.
  const b = cupo({ archivo, limites: { preguntas: 3 }, pid: 202, vivo: (p) => p === 201, registro: reg });
  assert.equal(b.bloqueado, true);
  assert.equal(b.gastar({ dispositivo: ID1, ip: 'i' }, 'preguntas').ok, false);
  assert.equal(b.consultar({ dispositivo: ID1, ip: 'i' }).preguntas.quedan, 0);
  assert.match(errores.join(' '), /Otro proceso tiene abierto el cupo diario/);
  // El mismo proceso (el servidor de desarrollo rehace su configuración): un solo estado.
  const a2 = cupo({ archivo, limites: { preguntas: 3 }, pid: 201, vivo: () => false, registro: reg });
  const yo = { dispositivo: ID1, ip: 'i' };
  assert.equal(a.gastar(yo, 'preguntas').ok, true);
  assert.equal(a2.gastar(yo, 'preguntas').ok, true);
  assert.equal(a.gastar(yo, 'preguntas').ok, true);
  assert.equal(a2.gastar(yo, 'preguntas').ok, false, 'entre los dos, no más del límite');
  // Cerrar uno no suelta el cerrojo mientras el otro siga.
  a.cerrar();
  assert.ok(fs.existsSync(`${archivo}.lock`));
  a2.cerrar();
  assert.ok(!fs.existsSync(`${archivo}.lock`));
});

test('cupo: sin carpeta escribible, en memoria y lo dice el registro; configuración por entorno y ANATO3D_CUPO=0', () => {
  const errores = [];
  const reg = { info() {}, error: (s) => errores.push(s) };
  const archivo = path.join(tmp(), 'un-archivo');
  fs.writeFileSync(archivo, '');
  const c = cupo({ archivo: path.join(archivo, 'cupo.json'), registro: reg });
  assert.equal(c.persistente, false);
  assert.equal(c.gastar({ dispositivo: ID1, ip: 'i' }, 'preguntas').ok, true);
  assert.match(errores.join(' '), /funciona en memoria/);
  assert.equal(cupoDesdeEntorno({ ANATO3D_CUPO: '0' }, { dir: null, registro: reg }), null);
  const e = cupoDesdeEntorno({ ANATO3D_CUPO_PREGUNTAS: '5', ANATO3D_CUPO_CREACIONES: '2', ANATO3D_CUPO_IP: '40/4' }, { dir: null, registro: reg });
  abiertos.push(e);
  assert.deepEqual(e.limites, { preguntas: 5, creaciones: 2, ipPreguntas: 40, ipCreaciones: 4 });
  const d = cupoDesdeEntorno({ ANATO3D_CUPO_PREGUNTAS: 'muchas', ANATO3D_CUPO_IP: '1' }, { dir: null, registro: reg });
  abiertos.push(d);
  assert.deepEqual(d.limites, { preguntas: 30, creaciones: 3, ipPreguntas: 30, ipCreaciones: 3 }, 'el de IP nunca por debajo del de un dispositivo');
  assert.match(errores.join(' '), /ANATO3D_CUPO_PREGUNTAS no es un número válido/);
});

test('servidor: cada pregunta cuenta una; agotado, 429 «cupo» con la forma del contrato y sin llamar a Claude; el GET también lo lleva', async () => {
  const c = cupo({ limites: { preguntas: 2, creaciones: 1 } });
  const { cliente, llamadas } = apiFalsa(() => respuesta(BIEN));
  const manejar = manejador(c, cliente);
  for (const n of [1, 2]) {
    const d = await (await manejar(peticion(pregunta(), { dispositivo: ID1 }), { ip: '10.0.0.1' })).json();
    assert.equal(d.ok, true);
    assert.deepEqual(d.cupo.preguntas, { limite: 2, usadas: n, quedan: 2 - n });
    assert.deepEqual(d.cupo.creaciones, { limite: 1, usadas: 0, quedan: 1 });
  }
  const r = await manejar(peticion(pregunta(), { dispositivo: ID1 }), { ip: '10.0.0.1' });
  const d = await r.json();
  assert.equal(r.status, 429);
  assert.deepEqual(Object.keys(d).sort(), ['cupo', 'de', 'error', 'espera', 'ok']);
  assert.deepEqual([d.ok, d.error, d.de, d.cupo.preguntas.quedan], [false, 'cupo', 'preguntas', 0]);
  assert.ok(d.espera > 0 && d.espera <= 25 * 3600_000);
  assert.ok(Math.abs(Date.parse(d.cupo.renueva) - Date.now() - d.espera) < 5000, 'espera hasta renueva');
  assert.equal(Number(r.headers.get('retry-after')), Math.ceil(d.espera / 1000));
  assert.equal(llamadas.length, 2, 'la tercera no llegó a Claude');
  // El GET (sin cuerpo) lo lleva por la cabecera; los errores de la petición, también.
  const g = await (await manejar(peticion(null, { dispositivo: ID1, metodo: 'GET' }), { ip: '10.0.0.1' })).json();
  assert.deepEqual(g.cupo.preguntas, { limite: 2, usadas: 2, quedan: 0 });
  const mal = await manejar(peticion({ v: 2, modo: 'nada' }, { dispositivo: ID1 }), { ip: '10.0.0.1' });
  assert.equal(mal.status, 400);
  assert.equal((await mal.json()).cupo.preguntas.usadas, 2);
  // Sin cupo configurado (pruebas, scripts), las respuestas no lo llevan.
  const sin = await (await manejador(null, cliente)(peticion(pregunta(), { dispositivo: ID1 }), { ip: '10.0.0.1' })).json();
  assert.equal('cupo' in sin, false);
});

test('servidor: si la API la rechaza sin procesarla (4xx), la pregunta se devuelve; si responde, cuenta aunque luego no sirva', async () => {
  const c = cupo({ limites: { preguntas: 2 } });
  let modo = 'ocupada';
  const error429 = { status: 429, cuerpo: { type: 'error', error: { type: 'rate_limit_error', message: 'despacio' } } };
  const { cliente } = apiFalsa(() => (modo === 'ocupada' ? error429 : respuesta('esto no es JSON')));
  const manejar = manejador(c, cliente);
  const r = await manejar(peticion(pregunta(), { dispositivo: ID1 }), { ip: 'i' });
  assert.equal(r.status, 429);
  assert.equal((await r.json()).cupo.preguntas.usadas, 0, 'devuelta');
  modo = 'roto';
  const r2 = await manejar(peticion(pregunta(), { dispositivo: ID1 }), { ip: 'i' });
  const d2 = await r2.json();
  assert.deepEqual([r2.status, d2.error, d2.cupo.preguntas.usadas], [502, 'formato', 1], 'respondió (y se pagó): cuenta');
});

test('servidor: sin cabecera (o con una inválida) cuenta la IP; el tope por IP actúa aunque cambie el dispositivo', async () => {
  const c = cupo({ limites: { preguntas: 2, ipPreguntas: 3 } });
  const { cliente } = apiFalsa(() => respuesta(BIEN));
  const manejar = manejador(c, cliente);
  const pedir = async (dispositivo, ip) => manejar(peticion(pregunta(), { dispositivo }), { ip });
  assert.equal(dispositivoDe(peticion(pregunta(), { dispositivo: 'CORTO' })), null);
  assert.equal(dispositivoDe(peticion(pregunta(), { dispositivo: ID1 })), ID1);
  // Sin cabecera y con una inválida: la misma cuenta (la de la IP).
  assert.equal((await pedir(null, '10.1.1.1')).status, 200);
  const d = await (await pedir('NO-VALE', '10.1.1.1')).json();
  assert.equal(d.cupo.preguntas.usadas, 2);
  assert.equal((await pedir(null, '10.1.1.1')).status, 429);
  assert.equal((await pedir(null, '10.2.2.2')).status, 200, 'otra IP, otra cuenta');
  // Tope por IP: inventarse dispositivos no da más de 3 al día desde la misma dirección.
  assert.equal((await pedir(ID1, '10.3.3.3')).status, 200);
  assert.equal((await pedir(ID1, '10.3.3.3')).status, 200);
  assert.equal((await pedir(ID2, '10.3.3.3')).status, 200);
  const r = await pedir(ID3, '10.3.3.3');
  const d3 = await r.json();
  assert.deepEqual([r.status, d3.error, d3.cupo.preguntas.usadas, d3.cupo.preguntas.quedan], [429, 'cupo', 0, 0], 'su dispositivo no gastó, pero la IP sí');
});

test('servidor: una sesión sin lecciones que encajen no llama a Claude ni gasta; con plan, cuenta una pregunta aunque haya corrección', async () => {
  const c = cupo({ limites: { preguntas: 5 } });
  let n = 0;
  const { cliente, llamadas } = apiFalsa(() => {
    n++;
    // La primera, demasiado corta (60 % de 30 = 18 min): corrección; la segunda, bien.
    const minutos = n === 1 ? 5 : 20;
    return respuesta({ tipo: 'sesion', mensaje: '', sugerencias: [], plan: { titulo: 'Corazón', objetivo: 'Localizar las cavidades del corazón.', mensaje: 'Empezamos por el corazón.', bloques: [{ tipo: 'leccion', leccion: 'tor-corazon', parte: 'inicio', minutos, motivo: 'Lo que pediste.' }] } });
  });
  const manejar = manejador(c, cliente);
  const sesion = (objetivo) => ({ v: 2, modo: 'sesion', idioma: 'es', pedido: { objetivo, minutos: 30, nivel: null, modelo: 'male' }, progreso: { terminadas: [], enCurso: [], repasos: [], guardadas: [] } });
  const d0 = await (await manejar(peticion(sesion('qwertyuiop asdfghjkl'), { dispositivo: ID1 }), { ip: 'i' })).json();
  assert.deepEqual([d0.tipo, d0.codigo, llamadas.length, d0.cupo.preguntas.usadas], ['aclaracion', 'sin-candidatas', 0, 0]);
  const d = await (await manejar(peticion(sesion('el corazón'), { dispositivo: ID1 }), { ip: 'i' })).json();
  assert.equal(d.tipo, 'sesion', JSON.stringify(d).slice(0, 300));
  assert.deepEqual([llamadas.length, d.cupo.preguntas.usadas], [2, 1]);
});

// Un trabajo de creación: lo justo para que redacte (evidencias de prueba con forma de Wikipedia y el inventario real).
const PAGINAS = [
  ['wp:Nasal_bone', 'Nasal bone', 'The nasal bones are two small oblong bones, varying in size and form in different individuals. They are placed side by side at the middle and upper part of the face. By their junction, they form the bridge of the upper one third of the nose. Each nasal bone has two surfaces and four borders.'],
  ['wp:Vomer', 'Vomer', 'The vomer is one of the unpaired facial bones of the skull. It is located in the midsagittal line, and articulates with the sphenoid, the ethmoid and the maxillary bones. The vomer forms the inferior part of the nasal septum in humans.'],
  ['wp:Inferior_nasal_concha', 'Inferior nasal concha', 'The inferior nasal concha is one of the three paired nasal conchae in the nose. It extends horizontally along the lateral wall of the nasal cavity. It consists of a lamina of spongy bone, curled upon itself like a scroll.'],
  ['wp:Maxilla', 'Maxilla', 'The maxilla is a bone that fuses with its pair to form the upper jaw. Each maxilla helps to form the boundaries of the orbit, the nasal cavity and the oral cavity. The maxilla holds the upper teeth.'],
];
function recursos() {
  const corpus = crearCorpus();
  for (const [f, titulo, texto] of PAGINAS) corpus.añadirFuente(f, { titulo, url: `https://en.wikipedia.org/wiki/${titulo.replace(/ /g, '_')}`, licencia: 'CC BY-SA 4.0', revid: 1, fecha: '2026-11-09' }, texto);
  return { inventario: cargarInventario(), corpus, lecciones: new Map(), disponible: true, traerPagina: async () => null };
}
const PLAN_NARIZ = {
  titulo: 'Huesos de la nariz', resumen: 'Los huesos de la nariz.', nivel: 1, minutos: 12, formato: 'estructuras', sistemas: ['oseo'], temas: ['huesos'], lugares: [{ region: 'cabeza', subregion: 'cara' }],
  objetivos: ['Localizar los huesos nasales y el vómer.', 'Describir qué forman los huesos nasales.'],
  estructuras: [{ clave: 'Nasal_Bone', papel: 'nucleo' }, { clave: 'Vomer', papel: 'nucleo' }, { clave: 'Maxilla', papel: 'contexto' }],
  pasos: [{ tipo: 'orientacion', titulo: 'a', idea: 'a', estructuras: ['Maxilla'] }, { tipo: 'explicacion', titulo: 'b', idea: 'b', estructuras: ['Nasal_Bone'] }, { tipo: 'exploracion', titulo: 'c', idea: 'c', estructuras: ['Vomer'] }, { tipo: 'sintesis', titulo: 'd', idea: 'd', estructuras: [] }],
  paginas: [], limitaciones: [], supuestos: [], accion: 'crear', base: null,
};
const primerEvento = async (r) => JSON.parse((await r.text()).trim().split('\n')[0]);

test('servidor: redactar un plan que no se cobró al planificar cuenta una creación (una por trabajo); reanudar el mismo trabajo no vuelve a contar; agotadas, planificar no se intenta', async () => {
  const c = cupo({ limites: { preguntas: 5, creaciones: 1 } });
  const llamadas = [];
  // Claude responde con una limitación: hubo respuesta (se pagó), así que la creación cuenta.
  const responder = async (params) => { llamadas.push(params); return { id: 'm', type: 'message', role: 'assistant', model: params.model, content: [{ type: 'text', text: JSON.stringify({ tipo: 'limitacion', mensaje: 'No llega.', leccion: null }) }], stop_reason: 'end_turn', usage: { input_tokens: 10, output_tokens: 5 } }; };
  const messages = { create: responder, stream: (p) => ({ finalMessage: () => responder(p) }) };
  const manejar = manejador(c, { messages, beta: { messages } }, { recursos });
  const ID_T = '00000000-0000-4000-a000-000000000777';
  const redactar = { v: 2, modo: 'redactar', idioma: 'es', mensajes: [], plan: PLAN_NARIZ, trabajo: ID_T };
  const e1 = await primerEvento(await manejar(peticion(redactar, { dispositivo: ID1 }), { ip: 'i' }));
  assert.equal(e1.cupo.creaciones.usadas, 1, 'el primer evento del flujo lleva el cupo');
  assert.equal(llamadas.length, 1);
  // Otra vez el mismo trabajo (tras recargar): se reanuda sin contar ni llamar.
  const e2 = await primerEvento(await manejar(peticion(redactar, { dispositivo: ID1 }), { ip: 'i' }));
  assert.deepEqual([e2.cupo.creaciones.usadas, llamadas.length], [1, 1]);
  // Agotadas, planificar una lección ni siquiera se intenta (no se paga un plan que no se podrá redactar).
  const SOL = { accion: 'crear', tema: 'huesos de la nariz', objetivo: 'Localizar los huesos de la nariz', nivel: 1, minutos: 12, leccion_base: null, enfoque: '', supuestos: [], terminos: ['nasal bone'] };
  const r = await manejar(peticion({ ...pregunta('crea una lección de la nariz'), modo: 'planificar', solicitud: SOL }, { dispositivo: ID1 }), { ip: 'i' });
  const d = await r.json();
  assert.deepEqual([r.status, d.error, d.de, llamadas.length], [429, 'cupo', 'creaciones', 1]);
  // Otro trabajo nuevo, tampoco.
  const r3 = await manejar(peticion({ ...redactar, trabajo: '00000000-0000-4000-a000-000000000778' }, { dispositivo: ID1 }), { ip: 'i' });
  assert.deepEqual([r3.status, (await r3.json()).de], [429, 'creaciones']);
});

// ══ Lo que encontró la revisión adversarial (2026-11-12): cada prueba fallaba antes del arreglo ══

/** Espera (como mucho 3 s) a que se cumpla `cond`. */
async function hasta(cond) {
  for (let i = 0; i < 300 && !cond(); i++) await new Promise((r) => setTimeout(r, 10));
  assert.ok(cond(), 'no llegó a pasar');
}
const pausa = (ms = 20) => new Promise((r) => setTimeout(r, ms));
const mensajeClaude = (params, datos) => ({ id: 'm', type: 'message', role: 'assistant', model: params.model, content: [{ type: 'text', text: JSON.stringify(datos) }], stop_reason: 'end_turn', usage: { input_tokens: 10, output_tokens: 5 } });

test('servidor: cancelar una creación a mitad (o un 5xx) no devuelve la unidad: el tope de gasto la cobró entera', async () => {
  const dir = tmp();
  const pres = crearPresupuesto({ archivo: path.join(dir, 'presupuesto.json'), topeDia: 5_000_000_000, topeMes: 50_000_000_000, registro: silencio });
  try {
    const c = cupo({ limites: { preguntas: 5, creaciones: 1 } });
    let llamadas = 0;
    // Una redacción en flujo que genera hasta que la cortan (como el SDK al abortar).
    const stream = (params, o) => ({ finalMessage: () => new Promise((_, rej) => { llamadas++; o.signal.addEventListener('abort', () => rej(Object.assign(new Error('abort'), { name: 'AbortError' }))); }) });
    const manejar = manejador(c, { messages: { create: () => { throw new Error('no'); }, stream } }, { recursos, presupuesto: pres, limitesLecciones: { porIp: 1000, porHora: 1000 } });
    const T = '00000000-0000-4000-a000-000000000801';
    const r = await manejar(peticion({ v: 2, modo: 'redactar', idioma: 'es', mensajes: [], plan: PLAN_NARIZ, trabajo: T }, { dispositivo: ID1 }), { ip: 'i' });
    const lector = r.body.getReader();
    await lector.read();
    await hasta(() => llamadas === 1);
    const x = await (await manejar(peticion({ v: 2, modo: 'cancelar', trabajo: T }, { dispositivo: ID1 }), { ip: 'i' })).json();
    assert.equal(x.cancelado, true);
    await pausa();
    assert.ok(pres.resumen().dia.gastado > 0, 'el tope la cuenta entera (incierta)');
    assert.equal(c.consultar({ dispositivo: ID1, ip: 'i' }).creaciones.usadas, 1, 'y el cupo, también: no se devuelve');
    // Otra creación ya no cabe: ni sale hacia Claude.
    const r2 = await manejar(peticion({ v: 2, modo: 'redactar', idioma: 'es', mensajes: [], plan: PLAN_NARIZ, trabajo: '00000000-0000-4000-a000-000000000802' }, { dispositivo: ID1 }), { ip: 'i' });
    assert.deepEqual([r2.status, (await r2.json()).de, llamadas], [429, 'creaciones', 1]);
    // Un 5xx en una pregunta: incierto en el tope, así que el cupo tampoco lo devuelve.
    const c2 = cupo({ limites: { preguntas: 2 } });
    const { cliente } = apiFalsa(() => error500);
    const r3 = await manejador(c2, cliente)(peticion(pregunta(), { dispositivo: ID1 }), { ip: 'i' });
    assert.deepEqual([r3.status, (await r3.json()).cupo.preguntas.usadas], [502, 1]);
  } finally { pres.cerrar(); }
});

test('servidor: planificar una lección cobra la creación (ligada al trabajo y al plan); redactar ese trabajo o ese plan no cobra otra; dos planes a la vez con una libre, solo uno', async () => {
  const llamadas = [];
  let rechazar = false;
  const responder = async (params) => {
    llamadas.push(params);
    const props = params.output_config.format.schema.properties;
    if (props.plan) {
      if (rechazar) throw Anthropic.APIError.generate(400, { type: 'error', error: { type: 'invalid_request_error', message: 'no' } }, 'no', new Headers());
      return mensajeClaude(params, { tipo: 'plan', mensaje: 'Este es el plan.', plan: PLAN_NARIZ, sugerencias: [] });
    }
    // Redactar: una limitación (hubo respuesta: se pagó).
    return mensajeClaude(params, { tipo: 'limitacion', mensaje: 'No llega.', leccion: null });
  };
  const messages = { create: responder, stream: (p) => ({ finalMessage: () => responder(p) }) };
  const SOL = { accion: 'crear', tema: 'huesos de la nariz', objetivo: 'Localizar los huesos de la nariz', nivel: 1, minutos: 12, leccion_base: null, enfoque: '', supuestos: [], terminos: ['nasal bone', 'vomer'] };
  const planificar = (trabajo) => ({ ...pregunta('crea una lección de la nariz'), modo: 'planificar', solicitud: SOL, ...(trabajo ? { trabajo } : {}) });
  const redactar = (plan, trabajo) => ({ v: 2, modo: 'redactar', idioma: 'es', mensajes: [], plan, trabajo });
  // El plan como lo guarda la app (src/pet/trabajos.js) y lo manda al redactar.
  const comoApp = (d) => ({ ...limpiarPlan(d.plan), accion: d.plan.accion, base: d.plan.base ?? null });
  const terminar = async (r) => { const texto = await r.text(); await pausa(); return texto.trim().split('\n').map((l) => JSON.parse(l)); };
  const n = (tipo) => llamadas.filter((p) => (tipo === 'plan' ? p.output_config.format.schema.properties.plan : p.output_config.format.schema.properties.leccion)).length;

  const c = cupo({ limites: { preguntas: 5, creaciones: 3 } });
  const manejar = manejador(c, { messages }, { recursos, limitesLecciones: { porIp: 1000, porHora: 1000 } });
  const yo = { dispositivo: ID1 };
  const usadas = () => c.consultar({ dispositivo: ID1, ip: 'i' }).creaciones.usadas;
  // 1) Planificar el trabajo T1 cobra la creación (antes solo consultaba).
  const T1 = '00000000-0000-4000-a000-000000000901';
  const d1 = await (await manejar(peticion(planificar(T1), yo), { ip: 'i' })).json();
  assert.equal(d1.tipo, 'plan', JSON.stringify(d1).slice(0, 300));
  assert.deepEqual([d1.cupo.creaciones.usadas, d1.cupo.preguntas.usadas, n('plan')], [1, 0, 1]);
  assert.equal(huellaPlan(comoApp(d1)), huellaPlan(d1.plan), 'la app manda el mismo plan');
  // 2) Redactar ese trabajo no cobra otra.
  const e1 = await terminar(await manejar(peticion(redactar(comoApp(d1), T1), yo), { ip: 'i' }));
  assert.deepEqual([e1[0].cupo.creaciones.usadas, e1.at(-1).estado, n('leccion')], [1, 'limitacion', 1]);
  // 3) Ya redactado (y pagado): otra redacción del mismo plan con otro trabajo sí cobra.
  const e2 = await terminar(await manejar(peticion(redactar(comoApp(d1), '00000000-0000-4000-a000-000000000902'), yo), { ip: 'i' }));
  assert.equal(e2[0].cupo.creaciones.usadas, 2);
  // 4) Un plan sin trabajo (la conversación antigua) queda ligado al plan: redactarlo con un trabajo nuevo no cobra otra.
  const d3 = await (await manejar(peticion(planificar(null), yo), { ip: 'i' })).json();
  assert.equal(d3.cupo.creaciones.usadas, 3);
  const e3 = await terminar(await manejar(peticion(redactar(comoApp(d3), '00000000-0000-4000-a000-000000000903'), yo), { ip: 'i' }));
  assert.deepEqual([e3[0].cupo.creaciones.usadas, e3.at(-1).estado], [3, 'limitacion']);
  // Agotadas: ni planificar ni redactar otra salen hacia Claude.
  const antes = llamadas.length;
  const r4 = await manejar(peticion(planificar('00000000-0000-4000-a000-000000000904'), yo), { ip: 'i' });
  assert.deepEqual([r4.status, (await r4.json()).de, llamadas.length], [429, 'creaciones', antes]);

  // 5) Dos planes a la vez con una sola creación libre: se paga (y se pide a Claude) uno.
  const c2 = cupo({ limites: { preguntas: 5, creaciones: 1 } });
  const manejar2 = manejador(c2, { messages }, { recursos, limitesLecciones: { porIp: 1000, porHora: 1000 } });
  const planesAntes = n('plan');
  const [a, b] = await Promise.all(['00000000-0000-4000-a000-000000000911', '00000000-0000-4000-a000-000000000912'].map((t) => manejar2(peticion(planificar(t), { dispositivo: ID2 }), { ip: 'j' })));
  assert.deepEqual([a.status, b.status].sort(), [200, 429]);
  assert.equal(n('plan') - planesAntes, 1);
  assert.equal(c2.consultar({ dispositivo: ID2, ip: 'j' }).creaciones.usadas, 1);

  // 6) Si la API rechaza el plan sin procesarlo (un 4xx), la creación se devuelve.
  rechazar = true;
  const c3 = cupo({ limites: { preguntas: 5, creaciones: 1 } });
  const r6 = await manejador(c3, { messages }, { recursos, limitesLecciones: { porIp: 1000, porHora: 1000 } })(peticion(planificar('00000000-0000-4000-a000-000000000921'), { dispositivo: ID3 }), { ip: 'k' });
  const d6 = await r6.json();
  assert.deepEqual([r6.status, d6.error, d6.cupo.creaciones.usadas], [502, 'ia', 0]);
});

test('IP: una IPv6 cuenta por su /64 y una IPv4 dentro de IPv6 como la IPv4 (cupo, limitador y servidor)', async () => {
  assert.equal(normalizarIp('2001:db8:1:2::1'), '2001:db8:1:2::/64');
  assert.equal(normalizarIp('[2001:DB8:1:2:aaaa:bbbb:cccc:dddd]'), '2001:db8:1:2::/64');
  assert.equal(normalizarIp('fe80::1%en0'), 'fe80:0:0:0::/64');
  assert.equal(normalizarIp('::ffff:10.20.77.201'), '10.20.77.201');
  assert.equal(normalizarIp('::ffff:0a14:4dc9'), '10.20.77.201');
  assert.equal(normalizarIp(' 203.0.113.7 '), '203.0.113.7');
  for (const x of ['2001:db8:1:2::1', '::ffff:1.2.3.4', '1.2.3.4', '', 'x']) assert.equal(normalizarIp(normalizarIp(x)), normalizarIp(x), x);
  // Cupo: identificadores nuevos desde direcciones de la misma /64 no pasan del tope por IP.
  const c = cupo({ limites: { preguntas: 30, ipPreguntas: 5 } });
  let ok = 0;
  for (let i = 1; i <= 50; i++) if (c.gastar({ dispositivo: randomUUID(), ip: `2001:db8:1:2::${i.toString(16)}` }, 'preguntas').ok) ok++;
  assert.equal(ok, 5);
  assert.equal(c.gastar({ dispositivo: randomUUID(), ip: '2001:db8:1:3::1' }, 'preguntas').ok, true, 'otra /64, otra cuenta');
  const v4 = cupo({ limites: { preguntas: 1 } });
  assert.equal(v4.gastar({ dispositivo: null, ip: '10.0.0.9' }, 'preguntas').ok, true);
  assert.equal(v4.gastar({ dispositivo: null, ip: '::ffff:10.0.0.9' }, 'preguntas').ok, false, 'la misma IPv4');
  // Limitador por dirección (el de Neuri y el de los reportes).
  const limitar = crearLimitador({ porIp: 2, ventanaIp: 60_000, porHora: 1000 });
  assert.deepEqual([limitar('2001:db8::1'), limitar('2001:db8::2'), limitar('2001:db8::3'), limitar('2001:db8:0:1::1')], [null, null, 'limite', null]);
  assert.equal(limitar.consultar('2001:db8::ffff').motivo, 'limite');
  // El servidor: sin cabecera, dos direcciones de la misma /64 son la misma cuenta.
  const c3 = cupo({ limites: { preguntas: 1 } });
  const { cliente } = apiFalsa(() => respuesta(BIEN));
  const manejar = manejador(c3, cliente);
  assert.equal((await manejar(peticion(pregunta()), { ip: '2001:db8:9:9::a' })).status, 200);
  assert.equal((await manejar(peticion(pregunta()), { ip: '2001:db8:9:9::b' })).status, 429);
});

test('cupo: la sal del HMAC no está en el archivo; sale de ANATO3D_CUPO_SAL o, sin ella, es aleatoria de cada día y solo en memoria (y lo avisa)', () => {
  const dir = tmp();
  const archivo = path.join(dir, 'cupo.json');
  const avisos = [];
  const reg = { info: (s) => avisos.push(s), error: (s) => avisos.push(s) };
  const vivo = () => false;
  const ip = { dispositivo: null, ip: '10.20.77.201' };
  // Sin la variable: lo avisa; en el mismo proceso los contadores siguen valiendo.
  const a = cupo({ archivo, limites: { preguntas: 3 }, pid: 301, vivo, registro: reg });
  assert.match(avisos.join(' '), /Sin ANATO3D_CUPO_SAL.*al reiniciar el servidor, los contadores del día vuelven a empezar/);
  a.gastar(ip, 'preguntas');
  const a2 = cupo({ archivo, limites: { preguntas: 3 }, pid: 301, vivo, registro: reg });
  assert.equal(a2.consultar(ip).preguntas.usadas, 1);
  a.cerrar(); a2.cerrar();
  const d = JSON.parse(fs.readFileSync(archivo, 'utf8'));
  assert.equal(d.v, 2);
  assert.ok(!('sal' in d), 'la sal no está en el archivo');
  assert.ok(!JSON.stringify(d).includes('10.20.77.201'));
  // Reiniciar sin la variable: los contadores del día empiezan de nuevo (la sal se fue con el proceso).
  const b = cupo({ archivo, limites: { preguntas: 3 }, pid: 302, vivo, registro: reg });
  assert.equal(b.consultar(ip).preguntas.usadas, 0);
  b.cerrar();
  // Con la variable: reiniciar conserva lo gastado; con otro secreto, las claves no casan.
  const s1 = cupo({ archivo, limites: { preguntas: 3 }, pid: 303, vivo, sal: SAL });
  s1.gastar(ip, 'preguntas');
  s1.cerrar();
  assert.ok(!fs.readFileSync(archivo, 'utf8').includes(SAL));
  const s2 = cupo({ archivo, limites: { preguntas: 3 }, pid: 304, vivo, sal: SAL });
  assert.equal(s2.consultar(ip).preguntas.usadas, 1);
  s2.cerrar();
  const s3 = cupo({ archivo, limites: { preguntas: 3 }, pid: 305, vivo, sal: 'otro-secreto-distinto-123' });
  assert.equal(s3.consultar(ip).preguntas.usadas, 0);
  s3.cerrar();
  // Una sal corta se ignora (y lo dice); el entorno la lee de ANATO3D_CUPO_SAL.
  avisos.length = 0;
  cupo({ sal: 'corta', registro: reg });
  assert.match(avisos.join(' '), /ANATO3D_CUPO_SAL tiene menos de 16 caracteres: se ignora/);
  const e = cupoDesdeEntorno({ ANATO3D_CUPO_SAL: SAL }, { dir, registro: reg });
  abiertos.push(e);
  assert.equal(e.consultar(ip).preguntas.usadas, 1, 'la del entorno es la misma sal');
  e.cerrar();
  // Un archivo de la versión 1 (con la sal dentro) se reescribe sin ella.
  fs.writeFileSync(archivo, JSON.stringify({ v: 1, zona: 'America/Tijuana', sal: 'ab'.repeat(32), dias: { '2026-11-12': { k: { p: 1 } } } }));
  const v1 = cupo({ archivo, pid: 306, vivo, sal: SAL, registro: reg });
  assert.ok(!fs.readFileSync(archivo, 'utf8').includes('abab'));
  assert.match(avisos.join(' '), /versión anterior \(con la sal dentro\)/);
  v1.cerrar();
});
