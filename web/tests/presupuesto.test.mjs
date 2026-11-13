// Pruebas del tope de gasto de Neuri (server/neuri/presupuesto.mjs y su uso en server/neuri/modelo.mjs): tarifas y
// cotas en nanodólares, la reserva antes de enviar y el ajuste con `usage`, caché fría y caliente, el límite entre
// tramos, peticiones que compiten por el último saldo, cancelaciones, respuestas truncadas o sin `usage`, reintentos,
// cambios de día y de mes, reinicios (también matando un proceso de verdad), dos procesos con el mismo archivo y el
// interruptor de apagado. Sin red ni gasto: el SDK real con un `fetch` falso y relojes controlados.
// Las pruebas con el servidor entero (manejador, trabajos, registros) están en tests/pet.test.mjs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import Anthropic from '@anthropic-ai/sdk';
import {
  crearPresupuesto, presupuestoDesdeEntorno, cotaReserva, costeReal, usdANano, nanoAUsd, periodos, huellaFija, entradaTotal,
  TARIFAS, NANO, FECHA_TARIFAS, ErrorPresupuesto,
} from '../server/neuri/presupuesto.mjs';
import { llamar, crearCliente } from '../server/neuri/modelo.mjs';

const silencio = { info() {}, error() {} };
const HAIKU = 'claude-haiku-5-5';
const usd = (x) => Math.round(x * NANO);
const carpetas = [];
function carpeta() {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'anato3d-presupuesto-'));
  carpetas.push(d);
  return d;
}
test.after(() => { for (const d of carpetas) fs.rmSync(d, { recursive: true, force: true }); });
let pidFalso = 4_000_000;
/** Un reloj que se mueve a mano. */
function reloj(iso) {
  let t = Date.parse(iso);
  const f = () => t;
  f.poner = (x) => { t = Date.parse(x); };
  f.mover = (ms) => { t += ms; };
  return f;
}
/** Un presupuesto en una carpeta temporal, con un PID inventado (cada uno, «otro proceso»). */
function nuevo(opciones = {}) {
  const dir = opciones.dir ?? carpeta();
  const archivo = path.join(dir, 'presupuesto.json');
  const p = crearPresupuesto({ archivo, topeDia: usd(1), topeMes: usd(20), registro: silencio, pid: ++pidFalso, vivo: () => false, ...opciones, dir: undefined });
  return { p, dir, archivo };
}
/** El SDK real con un `fetch` espía: cada envío queda apuntado (con lo reservado en ese momento). */
function transporte(responder, { p = null } = {}) {
  const envios = [];
  const fetch = async (url, init) => {
    envios.push({ cuerpo: JSON.parse(init.body), bytes: Buffer.byteLength(init.body), reservado: p ? p.resumen().dia.reservado : null });
    const r = await responder(JSON.parse(init.body), envios.length, init);
    if (r instanceof Error) throw r;
    return new Response(JSON.stringify(r.cuerpo), { status: r.status ?? 200, headers: { 'content-type': 'application/json' } });
  };
  // Con plazo corto: si una prueba falla con una petición a medias, el plazo del SDK no deja el proceso abierto 10 min.
  return { cliente: new Anthropic({ apiKey: 'sk-ant-prueba', fetch, maxRetries: 0, timeout: 5_000 }), envios };
}
const respuesta = (usage, extra = {}) => ({
  cuerpo: { id: 'msg', type: 'message', role: 'assistant', model: HAIKU, content: [{ type: 'text', text: '{"ok":true}' }], stop_reason: 'end_turn', stop_sequence: null, ...(usage ? { usage } : {}), ...extra },
});
const errorApi = (status, tipo, mensaje = `error ${status}`) => ({ status, cuerpo: { type: 'error', error: { type: tipo, message: mensaje } } });
const USO = { input_tokens: 400, output_tokens: 300, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 };
const pedido = (extra = {}) => ({ modelo: HAIKU, sistema: ['TEXTO FIJO '.repeat(200), 'variable'], mensajes: [{ role: 'user', content: 'hola' }], esquema: { type: 'object' }, maxTokens: 1000, registro: silencio, etiqueta: 'orientar', ...extra });
const esperar = (ms = 0) => new Promise((r) => setTimeout(r, ms));
/** El LCG de siempre: números «al azar» que se repiten en cada ejecución. */
function azar(semilla = 7) {
  let s = semilla >>> 0;
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 2 ** 32; };
}

// ══ Tarifas, unidades y cotas ══
test('unidades: dólares escritos a mano → nanodólares enteros (o nada si no es un número válido)', () => {
  assert.equal(NANO, 1_000_000_000);
  assert.equal(FECHA_TARIFAS, '2026-11-11');
  for (const [texto, n] of [['0.50', 500_000_000], ['1', NANO], ['20,00', 20 * NANO], [' 3 ', 3 * NANO], ['0', 0], ['0.000001', 1_000], ['10000', 10_000 * NANO]]) assert.equal(usdANano(texto), n, texto);
  for (const texto of [undefined, null, '', ' ', 'diez', '-1', '1e3', '0x10', '10001', '1.0000001', '1,5,0', 'NaN', 'Infinity']) assert.equal(usdANano(texto), null, String(texto));
  assert.equal(nanoAUsd(1_234_500_000), '1.2345');
  assert.ok(Object.values(TARIFAS).every((t) => Object.values({ ...t, alto: 0 }).every((v) => Number.isInteger(v))), 'tarifas enteras (n$ por token)');
});

test('coste real: caché fría y caliente, desglose sin contar dos veces, tramo alto de Haiku y Sonnet', () => {
  assert.equal(costeReal(HAIKU, { input_tokens: 1000, output_tokens: 100 }), 1000 * 100 + 100 * 500);
  const fria = { input_tokens: 500, cache_creation_input_tokens: 30_000, cache_read_input_tokens: 0, output_tokens: 600 };
  const caliente = { input_tokens: 500, cache_creation_input_tokens: 0, cache_read_input_tokens: 30_000, output_tokens: 600 };
  assert.equal(costeReal(HAIKU, fria), 500 * 100 + 30_000 * 125 + 600 * 500);      // 0,0041 US$
  assert.equal(costeReal(HAIKU, caliente), 500 * 100 + 30_000 * 10 + 600 * 500);   // 0,00065 US$
  assert.ok(costeReal(HAIKU, caliente) < costeReal(HAIKU, fria) / 6);
  // El desglose de lo escrito (5 min / 1 h) ya está en cache_creation_input_tokens: no se suma otra vez.
  assert.equal(costeReal(HAIKU, { input_tokens: 0, output_tokens: 0, cache_creation_input_tokens: 1000, cache_creation: { ephemeral_5m_input_tokens: 1000, ephemeral_1h_input_tokens: 0 } }), 125_000);
  assert.equal(costeReal(HAIKU, { input_tokens: 0, output_tokens: 0, cache_creation_input_tokens: 1000, cache_creation: { ephemeral_5m_input_tokens: 400, ephemeral_1h_input_tokens: 600 } }), 400 * 125 + 600 * 200);
  // Tramo: hasta 100 000 tokens de entrada (contando la caché), el normal; desde 100 001, el alto (×5).
  assert.equal(costeReal(HAIKU, { input_tokens: 100_000, output_tokens: 10 }), 100_000 * 100 + 10 * 500);
  assert.equal(costeReal(HAIKU, { input_tokens: 100_001, output_tokens: 10 }), 100_001 * 500 + 10 * 2_500);
  assert.equal(costeReal(HAIKU, { input_tokens: 1, cache_read_input_tokens: 100_000, output_tokens: 10 }), 1 * 500 + 100_000 * 50 + 10 * 2_500);
  assert.equal(costeReal('claude-sonnet-5-5', { input_tokens: 1000, output_tokens: 100 }), 1000 * 2_000 + 100 * 10_000);
  // Sin usage (o sin cifras), no se sabe.
  for (const u of [undefined, null, {}, { cache_read_input_tokens: 5 }]) assert.equal(costeReal(HAIKU, u), null, JSON.stringify(u));
  assert.equal(costeReal('claude-opus-5-5', USO), null, 'sin tarifa: no se inventa');
  assert.equal(entradaTotal({ input_tokens: 1, cache_read_input_tokens: 2, cache_creation_input_tokens: 3, output_tokens: 99 }), 6);
});

test('cota de reserva: bytes como tope de los tokens, precio de escritura en caché, tramo alto si pudiera pasar de 100 000', () => {
  assert.equal(cotaReserva(HAIKU, { bytes: 10_000, maxTokens: 1000 }), (10_000 + 2_000) * 125 + 1000 * 500);
  assert.equal(cotaReserva(HAIKU, { bytes: 98_000, maxTokens: 10 }), 100_000 * 125 + 10 * 500, 'justo 100 000: tramo normal');
  assert.equal(cotaReserva(HAIKU, { bytes: 98_001, maxTokens: 10 }), 100_001 * 625 + 10 * 2_500, 'uno más: tramo alto');
  // Calibrada: el menor total visto con la misma parte fija + los bytes de lo demás (la menor de las dos cotas).
  assert.equal(cotaReserva(HAIKU, { bytes: 150_000, bytesResto: 10_000, base: 30_000, maxTokens: 1000 }), (30_000 + 10_000 + 2_000) * 125 + 1000 * 500);
  assert.equal(cotaReserva(HAIKU, { bytes: 5_000, bytesResto: 4_000, base: 30_000, maxTokens: 0 }), (5_000 + 2_000) * 125, 'nunca más que la de bytes');
  assert.throws(() => cotaReserva('claude-opus-5-5', { bytes: 1, maxTokens: 1 }), (e) => e instanceof ErrorPresupuesto && e.codigo === 'modelo');
  // Conservadora: con cualquier reparto de tokens que quepa (entrada ≤ bytes + margen, salida ≤ max_tokens; caché
  // leída, escrita o nada), lo que cuesta nunca pasa de lo reservado. También cerca del límite entre tramos.
  const r = azar(11);
  for (let i = 0; i < 3000; i++) {
    const modelo = r() < 0.8 ? HAIKU : 'claude-sonnet-5-5';
    const bytes = i % 3 ? Math.floor(r() * 200_000) : 97_000 + Math.floor(r() * 4_000);
    const maxTokens = Math.floor(r() * 32_000);
    const entrada = Math.floor((bytes + 2_000) * r() ** 0.3);
    const leer = Math.floor(entrada * r());
    const escribir = Math.floor((entrada - leer) * r());
    const u = { input_tokens: entrada - leer - escribir, cache_read_input_tokens: leer, cache_creation_input_tokens: escribir, output_tokens: Math.floor(maxTokens * r()) };
    assert.ok(costeReal(modelo, u) <= cotaReserva(modelo, { bytes, maxTokens }), JSON.stringify({ modelo, bytes, maxTokens, u }));
    // Y la calibrada, con una parte fija de F tokens vista en una petición anterior (su total ≥ F).
    const F = Math.floor(entrada * r());
    const visto = F + Math.floor(r() * 5_000);
    const resto = Math.max(0, bytes - F);
    assert.ok(costeReal(modelo, u) <= cotaReserva(modelo, { bytes, bytesResto: resto, base: visto, maxTokens }) || entrada - F > resto + 2_000, 'calibrada');
  }
});

test('periodos: el día y el mes en la zona del presupuesto (America/Tijuana, con horario de verano)', () => {
  assert.deepEqual(periodos(Date.parse('2026-11-30T07:30:00Z'), 'America/Tijuana'), { dia: '2026-11-29', mes: '2026-11' });
  assert.deepEqual(periodos(Date.parse('2026-11-30T08:30:00Z'), 'America/Tijuana'), { dia: '2026-11-30', mes: '2026-11' });
  assert.deepEqual(periodos(Date.parse('2026-07-01T06:30:00Z'), 'America/Tijuana'), { dia: '2026-06-30', mes: '2026-06' }, 'en verano, UTC−7');
  assert.deepEqual(periodos(Date.parse('2026-12-01T07:59:59Z'), 'America/Tijuana'), { dia: '2026-11-30', mes: '2026-11' });
  assert.deepEqual(periodos(Date.parse('2026-12-01T08:00:00Z'), 'America/Tijuana'), { dia: '2026-12-01', mes: '2026-12' });
});

// ══ Sin presupuesto, nada sale ══
test('presupuesto cero, sin poner o mal escrito: no hay saldo y ninguna llamada llega al transporte', async () => {
  const raiz = carpeta();
  const casos = [
    {}, { ANATO3D_TOPE_DIARIO_USD: '0', ANATO3D_TOPE_MENSUAL_USD: '0' }, { ANATO3D_TOPE_DIARIO_USD: '1' }, { ANATO3D_TOPE_MENSUAL_USD: '20' },
    { ANATO3D_TOPE_DIARIO_USD: 'diez', ANATO3D_TOPE_MENSUAL_USD: '20' }, { ANATO3D_TOPE_DIARIO_USD: '-1', ANATO3D_TOPE_MENSUAL_USD: '20' },
    { ANATO3D_TOPE_DIARIO_USD: '1', ANATO3D_TOPE_MENSUAL_USD: '1e9' }, { ANATO3D_TOPE_DIARIO_USD: '0', ANATO3D_TOPE_MENSUAL_USD: '20' },
  ];
  for (const env of casos) {
    const dir = carpeta();
    const p = presupuestoDesdeEntorno({ ...env, ANATO3D_DATOS: dir }, { raiz, registro: silencio });
    assert.equal(p.disponible, false, JSON.stringify(env));
    assert.equal(p.motivo, 'sin-presupuesto');
    assert.equal(p.restante(), 0);
    const { cliente, envios } = transporte(() => respuesta(USO));
    await assert.rejects(llamar(cliente, pedido({ presupuesto: p })), (e) => e.codigo === 'sin-presupuesto' && e.status === 503);
    await assert.rejects(llamar(cliente, pedido({ presupuesto: p, flujo: true })), (e) => e.codigo === 'sin-presupuesto');
    assert.equal(envios.length, 0, `nada sale: ${JSON.stringify(env)}`);
    p.cerrar();
  }
  // Por defecto, en la carpeta de datos del servidor (build/servidor, fuera de git) y en hora de Mexicali.
  const p = presupuestoDesdeEntorno({ ANATO3D_DATOS: carpeta(), ANATO3D_TOPE_DIARIO_USD: '2', ANATO3D_TOPE_MENSUAL_USD: '40', ANATO3D_PRESUPUESTO_ZONA: 'Zona/Inventada' }, { raiz, registro: silencio });
  assert.equal(p.disponible, true);
  assert.deepEqual([p.resumen().zona, p.resumen().dia.tope, p.resumen().mes.tope], ['America/Tijuana', usd(2), usd(40)]);
  p.cerrar();
});

test('la herramienta de prueba real (npm run pet:prueba) sin presupuesto no envía nada, aunque haya clave', async () => {
  const web = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const marca = path.join(carpeta(), 'red.txt');
  // Cualquier fetch del proceso (el SDK de Anthropic, Wikipedia) deja una marca y falla.
  const espia = `data:text/javascript,${encodeURIComponent(`import fs from 'node:fs'; globalThis.fetch = async () => { fs.writeFileSync(${JSON.stringify(marca)}, 'red'); throw new Error('sin red en la prueba'); };`)}`;
  const correr = (env) => new Promise((resolver) => {
    const limpio = { ...process.env };
    for (const k of Object.keys(limpio)) if (k.startsWith('ANATO3D_') || k === 'ANTHROPIC_API_KEY') delete limpio[k];
    const h = spawn(process.execPath, ['--import', espia, 'scripts/pet-prueba.mjs'], { cwd: web, env: { ...limpio, ANTHROPIC_API_KEY: 'sk-ant-falsa-de-prueba', ANATO3D_DATOS: carpeta(), ...env } });
    let err = '';
    h.stderr.on('data', (d) => { err += d; });
    h.stdout.resume();
    h.on('exit', (code) => resolver({ code, err }));
  });
  for (const env of [{}, { ANATO3D_TOPE_DIARIO_USD: '0', ANATO3D_TOPE_MENSUAL_USD: '0' }, { ANATO3D_TOPE_DIARIO_USD: 'mucho', ANATO3D_TOPE_MENSUAL_USD: '20' }]) {
    const r = await correr(env);
    assert.equal(r.code, 1, JSON.stringify(env));
    assert.match(r.err, /Sin presupuesto para la IA \(sin-presupuesto\): la prueba no envía nada/);
    assert.ok(!r.err.includes('sk-ant-falsa'), 'la clave no se imprime');
  }
  // Con el interruptor de apagado puesto, tampoco.
  const dir = carpeta();
  fs.writeFileSync(path.join(dir, 'IA-APAGADA'), '');
  const apagada = await correr({ ANATO3D_DATOS: dir, ANATO3D_TOPE_DIARIO_USD: '1', ANATO3D_TOPE_MENSUAL_USD: '20' });
  assert.equal(apagada.code, 1);
  assert.match(apagada.err, /\(apagado\)/);
  assert.equal(fs.existsSync(marca), false, 'ningún envío por red');
});

// ══ Reservar antes, ajustar después ══
test('antes de enviar se reserva la cota de todo lo que sale (instrucciones, esquema, historial, evidencias) y la salida máxima; al volver, el coste real', async () => {
  const { p } = nuevo();
  const { cliente, envios } = transporte(() => respuesta(USO), { p });
  const historial = [{ role: 'user', content: 'Tengo examen del hombro' }, { role: 'assistant', content: '{"tipo":"aclaracion"}' }, { role: 'user', content: '¿y el manguito rotador?' }];
  const esquema = { type: 'object', properties: { lecciones: { type: 'array', items: { enum: ['ms-hombro-musculos', 'ms-hombro-articulacion'] } } } };
  const r = await llamar(cliente, pedido({ presupuesto: p, mensajes: historial, esquema, sistema: ['INSTRUCCIONES Y CATÁLOGO '.repeat(300), 'EVIDENCIAS: E1 «…» E2 «…»'] }));
  assert.deepEqual(r.datos, { ok: true });
  assert.equal(envios.length, 1);
  const e = envios[0];
  assert.equal(e.reservado, cotaReserva(HAIKU, { bytes: e.bytes, maxTokens: 1000 }), 'la reserva ya estaba al enviar y cubre el cuerpo entero');
  assert.match(JSON.stringify(e.cuerpo), /INSTRUCCIONES Y CATÁLOGO[\s\S]*EVIDENCIAS[\s\S]*manguito rotador[\s\S]*ms-hombro-articulacion/);
  const s = p.resumen();
  assert.deepEqual([s.dia.reservado, s.dia.gastado, s.mes.gastado], [0, costeReal(HAIKU, USO), costeReal(HAIKU, USO)]);
  assert.deepEqual(s.historial.map((h) => [h.etiqueta, h.estado, h.real]), [['orientar', 'ajustada', costeReal(HAIKU, USO)]]);
  assert.ok(s.historial[0].reservado >= s.historial[0].real);
  // Sin reintentos del SDK en el cliente del servidor: cada intento pasa por la reserva.
  assert.equal(crearCliente('sk-ant-prueba').maxRetries, 0);
  assert.equal(crearCliente(null), null);
  // La caché pedida es la de 5 minutos (la que usa la cota).
  assert.deepEqual(e.cuerpo.system[0].cache_control, { type: 'ephemeral' });
  p.cerrar();
});

test('caché fría y caliente: la primera reserva cuenta en bytes; en cuanto hay una respuesta, la cota calibrada es mucho menor y sigue cubriendo el coste', async () => {
  const { p, archivo } = nuevo({ topeDia: usd(5) });
  const fijo = 'Instrucciones de Neuri y catálogo de lecciones de anatomía: músculos, huesos, nervios. '.repeat(1400);   // ≈ 125 KB
  assert.ok(Buffer.byteLength(fijo) > 100_000, 'sin calibrar, la cota cae en el tramo alto');
  const FRIA = { input_tokens: 420, cache_creation_input_tokens: 30_200, cache_read_input_tokens: 0, output_tokens: 700 };
  const CALIENTE = { input_tokens: 610, cache_creation_input_tokens: 0, cache_read_input_tokens: 30_200, output_tokens: 650 };
  const usos = [FRIA, CALIENTE, CALIENTE];
  const { cliente, envios } = transporte((c, n) => respuesta(usos[n - 1]), { p });
  for (const texto of ['hombro', 'y el codo, ¿qué músculos lo flexionan?', 'rodilla']) await llamar(cliente, pedido({ presupuesto: p, sistema: [fijo, `CONTEXTO: ${texto}`], mensajes: [{ role: 'user', content: texto }], maxTokens: 3000 }));
  const [a, b, c] = envios.map((e) => e.reservado);
  assert.equal(a, cotaReserva(HAIKU, { bytes: envios[0].bytes, maxTokens: 3000 }));
  assert.ok(a > usd(0.08), `sin calibrar: ${nanoAUsd(a)} US$`);
  const resto = envios[1].bytes - Buffer.byteLength(JSON.stringify(fijo));
  assert.equal(b, cotaReserva(HAIKU, { bytes: envios[1].bytes, bytesResto: resto, base: entradaTotal(FRIA), maxTokens: 3000 }));
  assert.ok(b < a / 10 && c < a / 10, `calibrada: ${nanoAUsd(b)} US$`);
  const s = p.resumen();
  assert.equal(s.dia.gastado, costeReal(HAIKU, FRIA) + 2 * costeReal(HAIKU, CALIENTE));
  assert.ok(s.historial.every((h) => h.estado === 'ajustada' && h.real <= h.reservado));
  assert.equal(s.calibradas, 1);
  // La calibración sobrevive al reinicio; otra parte fija (cambió el catálogo) u otro modelo vuelven a la de bytes.
  p.cerrar();
  const otra = crearPresupuesto({ archivo, topeDia: usd(5), topeMes: usd(20), registro: silencio, pid: ++pidFalso, vivo: () => false });
  const args = { modelo: HAIKU, bytes: envios[1].bytes, bytesResto: resto, maxTokens: 3000 };
  assert.equal(otra.cota({ ...args, huella: huellaFija(HAIKU, fijo) }), b);
  assert.equal(otra.cota({ ...args, huella: huellaFija(HAIKU, `${fijo} `) }), cotaReserva(HAIKU, { bytes: envios[1].bytes, maxTokens: 3000 }));
  assert.notEqual(huellaFija('claude-sonnet-5-5', fijo), huellaFija(HAIKU, fijo));
  assert.ok(!fs.readFileSync(archivo, 'utf8').includes('Instrucciones de Neuri'), 'en el archivo, la huella; nunca el texto');
  otra.cerrar();
});

test('varias peticiones compiten por el último saldo: solo salen las que caben, y lo reservado cuenta mientras tanto', async () => {
  const cota = cotaReserva(HAIKU, { bytes: Buffer.byteLength(JSON.stringify({ model: HAIKU, max_tokens: 1000, system: [{ type: 'text', text: 'TEXTO FIJO '.repeat(200), cache_control: { type: 'ephemeral' } }, { type: 'text', text: 'variable' }], messages: [{ role: 'user', content: 'hola' }], output_config: { effort: 'low', format: { type: 'json_schema', schema: { type: 'object' } } } })), maxTokens: 1000 });
  const { p } = nuevo({ topeDia: Math.floor(cota * 2.5) });
  const sueltas = [];
  const { cliente, envios } = transporte(() => new Promise((r) => sueltas.push(() => r(respuesta(USO)))), { p });
  const cinco = Array.from({ length: 5 }, () => llamar(cliente, pedido({ presupuesto: p })).then(() => 'ok', (e) => e.codigo));
  await esperar(20);
  assert.equal(envios.length, 2, 'caben dos reservas');
  assert.equal(p.resumen().dia.reservado, cota * 2, 'las dos, con la cota calculada aparte');
  assert.ok(envios.every((e) => e.reservado >= cota), 'cada una ya estaba reservada al enviar');
  for (const soltar of sueltas) soltar();
  const resultados = await Promise.all(cinco);
  assert.deepEqual(resultados.sort(), ['ok', 'ok', 'sin-presupuesto', 'sin-presupuesto', 'sin-presupuesto']);
  // Al ajustarse (costaron mucho menos), vuelve a haber sitio.
  assert.equal(p.resumen().dia.reservado, 0);
  assert.ok(p.restante() >= cota);
  const otra = llamar(cliente, pedido({ presupuesto: p }));
  await esperar(5);
  sueltas.at(-1)();
  await otra;
  assert.equal(envios.length, 3);
  // El tope mensual también manda (aunque el diario tenga sitio).
  const { p: mes } = nuevo({ topeDia: usd(1), topeMes: cota - 1 });
  await assert.rejects(llamar(transporte(() => respuesta(USO)).cliente, pedido({ presupuesto: mes })), (e) => e.codigo === 'sin-presupuesto' && e.message === 'tope-mes');
  p.cerrar();
  mes.cerrar();
});

test('cancelar: antes de enviar, ni reserva ni envío; después, la corta termina y se ajusta, y la larga (en flujo) se corta y queda incierta hasta resolverla', async () => {
  const { p } = nuevo();
  const { cliente, envios } = transporte(() => respuesta(USO), { p });
  const antes = new AbortController();
  antes.abort();
  await assert.rejects(llamar(cliente, pedido({ presupuesto: p, signal: antes.signal })), (e) => e.codigo === 'cancelada');
  assert.equal(envios.length, 0);
  assert.equal(p.resumen().historial.length, 0, 'ni reserva');
  // Después de enviar, sin flujo: la llamada termina, se sabe lo que costó y la respuesta se descarta.
  const lenta = transporte(() => esperar(30).then(() => respuesta(USO)), { p });
  const despues = new AbortController();
  const corta = llamar(lenta.cliente, pedido({ presupuesto: p, signal: despues.signal }));
  await esperar(5);
  despues.abort();
  await assert.rejects(corta, (e) => e.codigo === 'cancelada');
  assert.equal(lenta.envios.length, 1);
  assert.deepEqual(p.resumen().historial.map((h) => h.estado), ['ajustada']);
  assert.equal(p.resumen().dia.gastado, costeReal(HAIKU, USO));
  // En flujo (redactar): se corta (deja de generar) y no se sabe cuánto costó: cuenta entera.
  const flujo = { messages: { stream: (params, opciones) => ({ finalMessage: () => new Promise((_, rechazar) => opciones.signal.addEventListener('abort', () => rechazar(new Anthropic.APIUserAbortError()))) }) } };
  const larga = new AbortController();
  const promesa = llamar(flujo, pedido({ presupuesto: p, flujo: true, maxTokens: 32_000, signal: larga.signal, etiqueta: 'redactar', trabajo: 'b1b2c3d4-e5f6-4789-8abc-def012345678' }));
  await esperar(5);
  larga.abort();
  await assert.rejects(promesa, (e) => e.codigo === 'cancelada');
  const s = p.resumen();
  const incierta = s.abiertas.find((x) => x.estado === 'incierta');
  assert.ok(incierta, 'queda incierta');
  assert.equal(incierta.trabajo, 'b1b2c3d4-e5f6-4789-8abc-def012345678');
  assert.equal(s.dia.gastado, costeReal(HAIKU, USO) + incierta.n, 'cuenta entera');
  assert.equal(s.dia.reservado, 0, 'y no dos veces');
  // Resolverla pide la cifra de la consola (nunca se libera a ciegas).
  assert.equal(p.resolver(incierta.id, 'nada'), false);
  assert.equal(p.resolver(incierta.id, -1), false);
  assert.equal(p.resolver('otra', usd(0.01)), false);
  assert.equal(p.resolver(incierta.id, usd(0.012)), true);
  assert.equal(p.resumen().dia.gastado, costeReal(HAIKU, USO) + usd(0.012));
  assert.deepEqual(p.resumen().abiertas, []);
  assert.equal(p.resolver(incierta.id, usd(0.012)), false, 'ya resuelta');
  p.cerrar();
});

test('respuestas que también cuestan: truncada, rechazo o formato malo se ajustan con su usage; sin usage, incierta', async () => {
  const { p } = nuevo();
  const casos = [
    [respuesta(USO, { stop_reason: 'max_tokens' }), 'incompleta', 'ajustada'],
    [respuesta(USO, { stop_reason: 'refusal' }), 'rechazo', 'ajustada'],
    [respuesta(USO, { content: [{ type: 'text', text: 'no es JSON' }] }), 'formato', 'ajustada'],
    [respuesta(null), null, 'incierta'],
  ];
  let esperado = 0;
  for (const [r, codigo, estado] of casos) {
    const { cliente } = transporte(() => r);
    const intento = llamar(cliente, pedido({ presupuesto: p }));
    if (codigo) await assert.rejects(intento, (e) => e.codigo === codigo);
    else await intento;
    const h = p.resumen().historial.at(-1);
    assert.equal(h.estado, estado, codigo ?? 'sin usage');
    esperado += estado === 'incierta' ? h.reservado : costeReal(HAIKU, USO);
  }
  assert.equal(p.resumen().dia.gastado, esperado);
  p.cerrar();
});

test('errores: un 4xx que la API rechaza sin procesar libera la reserva; un 5xx, un corte de red o un plazo la dejan incierta', async () => {
  const { p } = nuevo();
  const casos = [
    [errorApi(400, 'invalid_request_error'), 'ia', 'liberada'],
    [errorApi(401, 'authentication_error'), 'sin-ia', 'liberada'],
    [errorApi(429, 'rate_limit_error'), 'ocupado', 'liberada'],
    [errorApi(500, 'api_error'), 'ia', 'incierta'],
    [errorApi(529, 'overloaded_error'), 'ia', 'incierta'],
    [new TypeError('fetch failed'), 'conexion', 'incierta'],
  ];
  for (const [r, codigo, estado] of casos) {
    const { cliente, envios } = transporte(() => r);
    await assert.rejects(llamar(cliente, pedido({ presupuesto: p })), (e) => e.codigo === codigo, String(codigo));
    assert.equal(envios.length, 1, 'sin reintentos');
    assert.equal(p.resumen().historial.at(-1).estado, estado, `${codigo}`);
  }
  // Plazo: la API no contesta y el SDK corta.
  const fetch = (url, init) => new Promise((_, rechazar) => init.signal?.addEventListener('abort', () => rechazar(Object.assign(new Error('aborted'), { name: 'AbortError' }))));
  await assert.rejects(llamar(new Anthropic({ apiKey: 'sk-ant-prueba', fetch, maxRetries: 0 }), pedido({ presupuesto: p, plazoMs: 30 })), (e) => e.codigo === 'tiempo');
  assert.equal(p.resumen().historial.at(-1).estado, 'incierta');
  const s = p.resumen();
  assert.equal(s.dia.gastado, s.historial.filter((h) => h.estado === 'incierta').reduce((t, h) => t + h.reservado, 0), 'lo incierto cuenta entero; lo liberado, nada');
  p.cerrar();
});

test('cambio de día y de mes (hora de Mexicali): el saldo diario vuelve cada día, el mensual sigue sumando y cada reserva cuenta en su día', async () => {
  const ahora = reloj('2026-11-30T07:50:00Z');                 // 29 nov, 23:50 en Mexicali
  const { p } = nuevo({ topeDia: usd(0.05), topeMes: usd(0.065), ahora });
  const gasto = { input_tokens: 0, output_tokens: 60_000 };     // 0,03 US$ (la reserva, algo más: ≈ 0,0306)
  let soltar;
  const { cliente } = transporte(() => new Promise((r) => { soltar = () => r(respuesta(gasto)); }));
  const una = llamar(cliente, pedido({ presupuesto: p, maxTokens: 60_000 }));
  await esperar(5);
  ahora.mover(20 * 60_000);                                     // 30 nov, 00:10: se ajusta ya en otro día
  soltar();
  await una;
  const s = p.resumen();
  assert.deepEqual([s.dia.periodo, s.dia.gastado, s.mes.gastado], ['2026-11-30', 0, usd(0.03)], 'cuenta el 29, el día en que se reservó');
  assert.equal(p.restante(), usd(0.035), 'hoy, lo que deja el mes (0,065 − 0,03)');
  const dos = transporte(() => respuesta(gasto));
  await llamar(dos.cliente, pedido({ presupuesto: p, maxTokens: 60_000 }));
  assert.equal(p.restante(), usd(0.005), 'hoy quedarían 0,02; este mes, 0,005');
  // Cabe en el día pero no en el mes (≈ 0,0066 US$ de reserva): manda el mensual.
  await assert.rejects(llamar(dos.cliente, pedido({ presupuesto: p, maxTokens: 12_000 })), (e) => e.codigo === 'sin-presupuesto' && e.message === 'tope-mes');
  await assert.rejects(llamar(dos.cliente, pedido({ presupuesto: p, maxTokens: 60_000 })), (e) => e.codigo === 'sin-presupuesto' && e.message === 'tope-dia');
  assert.equal(dos.envios.length, 1, 'las que no caben no salen');
  ahora.poner('2026-12-01T08:05:00Z');                          // 1 dic, 00:05: mes nuevo
  const t = p.resumen();
  assert.deepEqual([t.dia.periodo, t.mes.periodo, t.dia.gastado, t.mes.gastado], ['2026-12-01', '2026-12', 0, 0]);
  assert.equal(p.restante(), usd(0.05));
  p.cerrar();
});

// ══ Reinicios y procesos ══
test('reinicio con una llamada en curso: el estado económico se recupera igual (la reserva pasa a incierta y cuenta entera) y la calibración sigue', async () => {
  const dir = carpeta();
  const avisos = [];
  const { p: antes } = nuevo({ dir });
  const { cliente } = transporte(() => respuesta(USO));
  await llamar(cliente, pedido({ presupuesto: antes }));
  const reserva = antes.reservar({ modelo: HAIKU, bytes: 50_000, maxTokens: 4_000, etiqueta: 'redactar', trabajo: 'c1b2c3d4-e5f6-4789-8abc-def012345678' });
  const gastadoAntes = antes.resumen().dia.gastado;
  // El proceso «muere» sin ajustar ni soltar el cerrojo; arranca otro con el mismo archivo.
  const { p: despues } = nuevo({ dir, registro: { info() {}, error: (s) => avisos.push(s) } });
  const s = despues.resumen();
  assert.equal(s.dia.gastado, gastadoAntes + reserva.n);
  assert.deepEqual(s.abiertas.map((x) => [x.id, x.estado, x.etiqueta, x.trabajo]), [[reserva.id, 'incierta', 'redactar', 'c1b2c3d4-e5f6-4789-8abc-def012345678']]);
  assert.equal(s.calibradas, 1);
  assert.match(avisos.join(' '), /1 reserva\(s\) quedaron a medias al reiniciar/);
  // Otro reinicio no la cuenta dos veces.
  const { p: otra } = nuevo({ dir });
  assert.equal(otra.resumen().dia.gastado, gastadoAntes + reserva.n);
  otra.cerrar();
});

/** Un proceso de verdad con el presupuesto (real: su PID y su comprobación de procesos vivos). */
const HIJO = `
import { crearPresupuesto, NANO } from ${JSON.stringify(new URL('../server/neuri/presupuesto.mjs', import.meta.url).href)};
const [archivo, accion] = process.argv.slice(1);
const p = crearPresupuesto({ archivo, topeDia: NANO, topeMes: 20 * NANO, registro: { info() {}, error() {} } });
const salida = { pid: process.pid, motivo: p.motivo };
if (!p.motivo && accion === 'reservar') salida.reserva = p.reservar({ modelo: 'claude-haiku-5-5', bytes: 20000, maxTokens: 1000, etiqueta: 'hijo' });
process.stdout.write(JSON.stringify(salida) + '\\n');
process.stdin.on('end', () => { p.cerrar(); process.exit(0); }).resume();
`;
function hijo(archivo, accion = 'esperar') {
  const h = spawn(process.execPath, ['--input-type=module', '-e', HIJO, archivo, accion], { stdio: ['pipe', 'pipe', 'inherit'] });
  const fin = new Promise((r) => h.on('exit', (code, signal) => r({ code, signal })));
  const primera = new Promise((resolver, rechazar) => {
    let buf = '';
    h.stdout.on('data', (d) => { buf += d; const i = buf.indexOf('\n'); if (i >= 0) resolver(JSON.parse(buf.slice(0, i))); });
    fin.then(({ code }) => rechazar(new Error(`el proceso salió (${code}) sin contestar`)));
  });
  return { h, primera, fin, cerrar: () => { h.stdin.end(); return fin; } };
}

test('dos procesos de verdad con el mismo archivo: solo uno tiene saldo; el otro no gasta hasta que el primero se cierra', async () => {
  const archivo = path.join(carpeta(), 'presupuesto.json');
  // Arrancan a la vez: el cerrojo se crea de una vez, así que gana uno solo.
  const a = hijo(archivo);
  const b = hijo(archivo);
  try {
    const [ra, rb] = await Promise.all([a.primera, b.primera]);
    assert.deepEqual(new Set([ra.motivo, rb.motivo]), new Set([null, 'otro-proceso']), 'uno con saldo, el otro sin él');
    const [ganador, perdedor] = ra.motivo === null ? [a, b] : [b, a];
    // Este proceso (las pruebas) tampoco puede: el dueño está vivo.
    const aqui = crearPresupuesto({ archivo, topeDia: usd(1), topeMes: usd(20), registro: silencio });
    assert.equal(aqui.motivo, 'otro-proceso');
    assert.throws(() => aqui.reservar({ modelo: HAIKU, bytes: 10, maxTokens: 10 }), (e) => e.codigo === 'otro-proceso');
    aqui.cerrar();
    await perdedor.cerrar();
    await ganador.cerrar();
  } finally {
    a.h.kill();
    b.h.kill();
  }
  const luego = crearPresupuesto({ archivo, topeDia: usd(1), topeMes: usd(20), registro: silencio });
  assert.equal(luego.disponible, true, 'cerrado el dueño, se puede');
  luego.cerrar();
  assert.equal(fs.existsSync(`${archivo}.lock`), false, 'y al cerrar se suelta el cerrojo');
});

test('un proceso de verdad muere (SIGKILL) con una reserva en curso: el siguiente recupera el cerrojo y la cuenta entera como incierta', async () => {
  const archivo = path.join(carpeta(), 'presupuesto.json');
  const h = hijo(archivo, 'reservar');
  let r;
  try {
    r = await h.primera;
    assert.equal(r.motivo, null);
  } finally {
    h.h.kill('SIGKILL');
  }
  assert.equal((await h.fin).signal, 'SIGKILL');
  const p = crearPresupuesto({ archivo, topeDia: usd(1), topeMes: usd(20), registro: silencio });
  assert.equal(p.disponible, true, 'el dueño murió: el cerrojo se recupera');
  const s = p.resumen();
  assert.deepEqual(s.abiertas.map((x) => [x.id, x.estado, x.n]), [[r.reserva.id, 'incierta', r.reserva.n]]);
  assert.equal(s.dia.gastado, r.reserva.n);
  p.cerrar();
});

test('en un mismo proceso, dos presupuestos del mismo archivo comparten estado (el servidor de desarrollo rehace su configuración)', async () => {
  const dir = carpeta();
  const archivo = path.join(dir, 'presupuesto.json');
  const uno = crearPresupuesto({ archivo, topeDia: usd(1), topeMes: usd(20), registro: silencio });
  const reserva = uno.reservar({ modelo: HAIKU, bytes: 10_000, maxTokens: 1_000, etiqueta: 'orientar' });
  const dos = crearPresupuesto({ archivo, topeDia: usd(2), topeMes: usd(20), registro: silencio });
  assert.equal(dos.disponible, true, 'no se bloquea a sí mismo');
  assert.equal(dos.resumen().dia.reservado, reserva.n, 've la reserva en curso (no la da por perdida)');
  uno.cerrar();
  assert.equal(fs.existsSync(`${archivo}.lock`), true, 'el cerrojo sigue mientras quede uno');
  assert.equal(dos.conciliar(reserva, USO), costeReal(HAIKU, USO), 'el otro ajusta la reserva del primero');
  assert.equal(dos.restante(), usd(2) - costeReal(HAIKU, USO), 'cada uno con su tope');
  dos.cerrar();
  assert.equal(fs.existsSync(`${archivo}.lock`), false);
});

test('almacén dañado o que no se puede escribir: la IA deja de gastar (y el cerrojo se suelta para revisarlo)', async () => {
  const dir = carpeta();
  const archivo = path.join(dir, 'presupuesto.json');
  fs.writeFileSync(archivo, '{ esto no es JSON');
  const avisos = [];
  const roto = crearPresupuesto({ archivo, topeDia: usd(1), topeMes: usd(20), registro: { info() {}, error: (s) => avisos.push(s) }, pid: ++pidFalso, vivo: () => false });
  assert.deepEqual([roto.disponible, roto.motivo, roto.restante()], [false, 'almacen', 0]);
  assert.equal(fs.readFileSync(archivo, 'utf8'), '{ esto no es JSON', 'no se pisa: se perdería lo gastado');
  assert.equal(fs.existsSync(`${archivo}.lock`), false);
  assert.match(avisos[0], /Sin presupuesto utilizable \(almacen\)/);
  const { cliente, envios } = transporte(() => respuesta(USO));
  await assert.rejects(llamar(cliente, pedido({ presupuesto: roto })), (e) => e.codigo === 'sin-presupuesto');
  assert.equal(envios.length, 0);
  roto.cerrar();
  for (const malo of ['{"v":2,"dias":{},"meses":{},"reservas":{}}', '{"v":1}', 'null']) {
    fs.writeFileSync(archivo, malo);
    const p = crearPresupuesto({ archivo, topeDia: usd(1), topeMes: usd(20), registro: silencio, pid: ++pidFalso, vivo: () => false });
    assert.equal(p.motivo, 'almacen', malo);
    p.cerrar();
  }
  // Se puede leer pero no escribir (la carpeta pasa a solo lectura): la siguiente reserva falla y ya no se gasta.
  const dir2 = carpeta();
  const p = crearPresupuesto({ archivo: path.join(dir2, 'presupuesto.json'), topeDia: usd(1), topeMes: usd(20), registro: silencio, pid: ++pidFalso, vivo: () => false });
  fs.chmodSync(dir2, 0o500);
  try {
    assert.throws(() => p.reservar({ modelo: HAIKU, bytes: 10, maxTokens: 10 }), (e) => e.codigo === 'almacen');
    assert.equal(p.motivo, 'almacen');
    assert.equal(p.resumen().dia.reservado, 0, 'la reserva que no se pudo guardar no queda');
  } finally { fs.chmodSync(dir2, 0o700); }
  p.cerrar();
});

test('el interruptor IA-APAGADA corta al momento, sin reiniciar; quitarlo lo devuelve', async () => {
  const dir = carpeta();
  const p = presupuestoDesdeEntorno({ ANATO3D_DATOS: dir, ANATO3D_TOPE_DIARIO_USD: '1', ANATO3D_TOPE_MENSUAL_USD: '20' }, { raiz: dir, registro: silencio });
  assert.equal(p.disponible, true);
  fs.writeFileSync(path.join(dir, 'IA-APAGADA'), '');
  assert.deepEqual([p.disponible, p.motivo, p.restante()], [false, 'apagado', 0]);
  const { cliente, envios } = transporte(() => respuesta(USO));
  await assert.rejects(llamar(cliente, pedido({ presupuesto: p })), (e) => e.codigo === 'sin-presupuesto' && e.message === 'apagado');
  assert.equal(envios.length, 0);
  fs.unlinkSync(path.join(dir, 'IA-APAGADA'));
  assert.equal(p.disponible, true);
  p.cerrar();
});

test('el archivo del presupuesto solo guarda cifras, periodos, modelo, etiqueta y estado (nunca texto de nadie)', async () => {
  const { p, archivo } = nuevo();
  const CENTINELA = 'CENTINELA-presupuesto-7f3a9c';
  const { cliente } = transporte(() => respuesta(USO));
  await llamar(cliente, pedido({ presupuesto: p, mensajes: [{ role: 'user', content: `Me llamo ${CENTINELA}` }], sistema: [`fijo ${CENTINELA}`, `variable ${CENTINELA}`] }));
  await llamar(transporte(() => errorApi(400, 'invalid_request_error', `prompt: ${CENTINELA}`)).cliente, pedido({ presupuesto: p, mensajes: [{ role: 'user', content: CENTINELA }] })).catch(() => {});
  const texto = fs.readFileSync(archivo, 'utf8');
  assert.ok(!texto.includes(CENTINELA));
  const d = JSON.parse(texto);
  assert.deepEqual(Object.keys(d).sort(), ['calibracion', 'dias', 'historial', 'meses', 'reservas', 'v', 'zona']);
  assert.deepEqual(Object.keys(d.historial[0]).sort(), ['estado', 'etiqueta', 'fecha', 'id', 'modelo', 'real', 'reservado', 'trabajo']);
  p.cerrar();
});

test('renovación: con el tope del día agotado, la medianoche de Mexicali; con el del mes, el día 1; si no es por los topes, nada', () => {
  const ahora = reloj('2026-11-30T07:30:00Z');                 // 29 nov, 23:30 en Mexicali
  const { p } = nuevo({ topeDia: usd(1), topeMes: usd(1.5), ahora });
  const gastar = (usdReal) => { const r = p.reservar({ modelo: HAIKU, bytes: 10, maxTokens: Math.round(usdReal * NANO / 500), etiqueta: 'x' }); p.conciliar(r, { input_tokens: 0, output_tokens: Math.round(usdReal * NANO / 500) }); };
  assert.equal(p.renovacion(usd(0.1)), null, 'aún cabe');
  gastar(0.95);
  assert.equal(p.renovacion(usd(0.1)), Date.parse('2026-11-30T08:00:00Z'), 'el día: medianoche del 30 en Mexicali');
  ahora.poner('2026-11-30T09:00:00Z');                        // 30 nov, 01:00: día nuevo, pero el mes ya va por 0,95 de 1,5
  gastar(0.5);
  assert.equal(p.renovacion(usd(0.1)), Date.parse('2026-12-01T08:00:00Z'), 'el mes: el 1 de diciembre a medianoche');
  assert.equal(p.renovacion(usd(5)), null, 'lo que no cabría ni con el tope entero');
  const { p: cero } = nuevo({ topeDia: 0, topeMes: 0 });
  assert.equal(cero.renovacion(1), null);
  p.cerrar();
  cero.cerrar();
});
