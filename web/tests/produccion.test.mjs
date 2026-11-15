// Aceptación del paquete de producción (scripts/paquete.mjs + server/produccion.mjs): se arma en una carpeta temporal,
// se copia a otra (una «máquina» limpia, sin el árbol de desarrollo ni build/) y se arranca con `node servidor.mjs` como
// proceso aparte. La IA es el proveedor simulado (scripts/proveedor-simulado.mjs): el SDK real, HTTP de verdad y flujo
// SSE, sin red ni gasto. Una clave centinela comprueba que no sale en registros, respuestas, archivos públicos ni datos.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { crearProveedorSimulado as arrancarProveedor } from '../scripts/proveedor-simulado.mjs';
import { ipDe, configuracion } from '../server/produccion.mjs';
import { crearReporte } from '../src/biblioteca/reportes.js';

const WEB = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLAVE = 'sk-ant-CENTINELA-9d1f3b7c-no-es-real';
const temporales = [];
const tmp = () => { const d = fs.mkdtempSync(path.join(os.tmpdir(), 'anato3d-paquete-')); temporales.push(d); return d; };
let PAQUETE;
const vivos = new Set();
// Los proveedores simulados abiertos: si una prueba falla antes de cerrarlo, se cierra al final (un servidor HTTP abierto
// deja colgado el proceso de las pruebas para siempre).
const proveedores = new Set();
async function crearProveedorSimulado(opciones) {
  const p = await arrancarProveedor(opciones);
  const cerrar = p.cerrar;
  p.cerrar = () => { proveedores.delete(p); return cerrar(); };
  proveedores.add(p);
  return p;
}
// El día de hoy para la fecha de una lección (el servidor solo acepta un día que pueda ser «hoy» en algún sitio).
const HOY = new Date().toISOString().slice(0, 10);

before(() => {
  PAQUETE = path.join(tmp(), 'paquete');
  const r = spawnSync(process.execPath, ['scripts/paquete.mjs', '--destino', PAQUETE, '--sin-web'], { cwd: WEB, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr + r.stdout);
});
after(async () => {
  for (const p of vivos) p.kill('SIGKILL');
  for (const p of [...proveedores]) { p.soltar(); await p.cerrar(); }
  for (const d of temporales) fs.rmSync(d, { recursive: true, force: true });
});

/** Una copia del paquete en una carpeta nueva, lejos del repositorio. */
function copia() {
  const d = path.join(tmp(), 'srv');
  fs.cpSync(PAQUETE, d, { recursive: true });
  return d;
}
function entorno(extra) {
  const env = { ...process.env };
  for (const k of Object.keys(env)) if (k.startsWith('ANATO3D_') || k.startsWith('ANTHROPIC_')) delete env[k];
  return { ...env, PORT: '0', ...extra };
}
/** `node servidor.mjs` en `dir`: { url, proc, salida(), parar(señal) }. */
function arrancar(dir, env = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn(process.execPath, ['servidor.mjs'], { cwd: dir, env: entorno(env) });
    vivos.add(proc);
    let salida = '';
    const parar = (s = 'SIGTERM') => new Promise((r) => { if (proc.exitCode !== null) return r(); proc.once('exit', () => r()); proc.kill(s); });
    const leer = (d) => {
      salida += d;
      const m = salida.match(/Escuchando en el puerto (\d+)/);
      if (m) resolve({ url: `http://127.0.0.1:${m[1]}`, proc, salida: () => salida, parar });
    };
    proc.stdout.on('data', leer);
    proc.stderr.on('data', leer);
    proc.once('exit', (code) => { vivos.delete(proc); reject(new Error(`salió (${code}): ${salida}`)); });
  });
}
const conversacion = (texto) => ({ v: 2, modo: 'orientar', idioma: 'es', mensajes: [{ rol: 'usuario', texto }], progreso: { terminadas: [], enCurso: [], repasos: [], guardadas: [] } });
const SOL = { accion: 'crear', tema: 'huesos de la nariz', objetivo: 'Localizar los huesos de la nariz', nivel: 1, minutos: 12, leccion_base: null, enfoque: '', supuestos: [], terminos: ['nasal bone', 'vomer'] };
const respuestas = [];
async function post(s, cuerpo, { ruta = '/api/pet', signal } = {}) {
  const r = await fetch(`${s.url}${ruta}`, { method: 'POST', headers: { 'content-type': 'application/json', origin: s.url }, body: JSON.stringify(cuerpo), signal });
  return r;
}
const json = async (r) => { const t = await r.text(); respuestas.push(t); return JSON.parse(t); };
/** Lee un flujo NDJSON línea a línea: [{ e, t }] (t: cuándo llegó). `parar(e, n)`: si devuelve true, deja de leer. */
async function leerFlujo(r, parar = () => false) {
  const lector = r.body.getReader();
  const dec = new TextDecoder();
  let buf = '';
  const lineas = [];
  for (;;) {
    const { value, done } = await lector.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let i;
    while ((i = buf.indexOf('\n')) >= 0) {
      const l = buf.slice(0, i).trim();
      buf = buf.slice(i + 1);
      if (!l) continue;
      respuestas.push(l);
      const e = JSON.parse(l);
      lineas.push({ e, t: Date.now() });
      if (parar(e, lineas.length)) { await lector.cancel().catch(() => {}); return lineas; }
    }
  }
  return lineas;
}
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
async function hasta(cond, ms = 5000) {
  const fin = Date.now() + ms;
  while (!(await cond())) { if (Date.now() > fin) throw new Error('No se cumplió a tiempo'); await esperar(20); }
}
const conIA = (prov, datos, extra = {}) => ({ ANTHROPIC_API_KEY: CLAVE, ANTHROPIC_BASE_URL: prov.url, ANATO3D_TOPE_DIARIO_USD: '1', ANATO3D_TOPE_MENSUAL_USD: '20', ANATO3D_DATOS: datos, ...extra });
const idT = (n) => `00000000-0000-4000-a000-${String(n).padStart(12, '0')}`;

test('paquete: arranca en una carpeta limpia, sirve la web y no expone los recursos, el manifiesto ni nada fuera de publico/', async () => {
  const dir = copia();
  const s = await arrancar(dir, { ANATO3D_DATOS: path.join(dir, 'datos') });
  try {
    assert.deepEqual(await (await fetch(`${s.url}/salud`)).json(), { ok: true, version: '2026-11-11.1' });
    const g = await (await fetch(`${s.url}/api/pet`)).json();
    assert.deepEqual([g.ia, g.crear, g.estado], [false, false, 'sin-clave']);
    const index = await fetch(s.url);
    assert.deepEqual([index.status, index.headers.get('content-type'), index.headers.get('cache-control'), index.headers.get('x-content-type-options')], [200, 'text/html; charset=utf-8', 'no-cache', 'nosniff']);
    // Sin cambios, 304 (no se vuelve a bajar: lo que más cuesta son los modelos 3D).
    assert.equal((await fetch(s.url, { headers: { 'if-none-match': index.headers.get('etag') } })).status, 304);
    for (const ruta of ['/recursos/catalogo.json', '/MANIFIESTO.json', '/servidor.mjs', '/datos/reportes.jsonl', '/%2e%2e/recursos/catalogo.json', '/..%2fMANIFIESTO.json', '/publico/../MANIFIESTO.json', '/recursos/fuentes/wp/', '/api/otra', '/fly.toml', '/worker/worker.mjs']) {
      assert.equal((await fetch(`${s.url}${ruta}`)).status, 404, ruta);
    }
    assert.equal((await fetch(s.url, { method: 'POST' })).status, 405);
    // La app está en /app/ (la presentación, en /): sin la barra final, se redirige a la carpeta, también con «//app»
    // (el destino sale de la ruta resuelta, no de lo que manda el navegador: nunca otro dominio).
    for (const [ruta, destino] of [['/app', '/app/'], ['/app?x=1', '/app/?x=1'], ['//app', '/app/'], ['/en', '/en/']]) {
      const r = await fetch(`${s.url}${ruta}`, { redirect: 'manual' });
      assert.deepEqual([r.status, r.headers.get('location')], [301, destino], ruta);
    }
    const app = await fetch(`${s.url}/app/`);
    assert.deepEqual([app.status, app.headers.get('content-type')], [200, 'text/html; charset=utf-8']);
    assert.match(await app.text(), /Anato3D · app/);
    // Sin clave: el buscador de la app (la API lo dice, sin llamar a nada).
    const r = await post(s, conversacion('hombro'));
    assert.deepEqual([r.status, (await json(r)).error], [503, 'sin-ia']);
    assert.match(s.salida(), /Neuri sin clave: responde con el buscador; recursos comprobados/);
  } finally { await s.parar(); }
  // Las plantillas de despliegue van en el paquete, sin secretos; la imagen de Fly no se lleva la carpeta de datos local.
  const fly = fs.readFileSync(path.join(dir, 'fly.toml'), 'utf8');
  assert.match(fly, /auto_stop_machines = "off"/);
  assert.match(fly, /destination = "\/datos"/);
  assert.match(fly, /ANATO3D_IP_DE = "fly-client-ip"/);
  assert.match(fs.readFileSync(path.join(dir, 'Dockerfile'), 'utf8'), /CMD \["node", "servidor\.mjs"\]/);
  assert.match(fs.readFileSync(path.join(dir, '.dockerignore'), 'utf8'), /^datos$/m);
  for (const a of ['fly.toml', 'Dockerfile', '.dockerignore', 'worker/worker.mjs', 'worker/wrangler.toml']) {
    assert.ok(!/sk-ant-|ANTHROPIC_API_KEY *=|ANATO3D_PROXY_SECRETO *=/.test(fs.readFileSync(path.join(dir, a), 'utf8')), `${a} sin secretos`);
  }
});

test('Worker de Cloudflare (plantilla): la web va a los archivos estáticos; /api/* al servidor, en flujo, con el secreto y la dirección que ve Cloudflare, nunca las del navegador', async () => {
  const { default: worker } = await import('../despliegue/worker/worker.mjs');
  const estaticos = [];
  const env = { ANATO3D_API: 'https://anato3d.fly.dev', ANATO3D_PROXY_SECRETO: 'secreto-del-worker-0123', ASSETS: { fetch: async (r) => { estaticos.push(new URL(r.url).pathname); return new Response('web'); } } };
  const original = globalThis.fetch;
  const enviados = [];
  globalThis.fetch = async (url, init) => {
    enviados.push({ url: String(url), init, cuerpo: init.body ? await new Response(init.body).text() : null });
    return new Response('{"estado":"fuentes"}\n{"estado":"lista"}\n', { headers: { 'content-type': 'application/x-ndjson' } });
  };
  try {
    assert.equal(await (await worker.fetch(new Request('https://anato3d.ejemplo.workers.dev/models/male.glb'), env)).text(), 'web');
    assert.deepEqual(estaticos, ['/models/male.glb']);
    const r = await worker.fetch(new Request('https://anato3d.ejemplo.workers.dev/api/pet?x=1', {
      method: 'POST', body: '{"v":2}',
      headers: { origin: 'https://anato3d.ejemplo.workers.dev', 'content-type': 'application/json', 'cf-connecting-ip': '7.7.7.7', 'x-anato3d-proxy': 'inventado', 'x-anato3d-ip': '1.1.1.1', 'x-anato3d-dispositivo': '0f1e2d3c-4b5a-4968-8778-695a4b3c2d1e' },
    }), env);
    assert.equal(await r.text(), '{"estado":"fuentes"}\n{"estado":"lista"}\n');
    const [e] = enviados;
    assert.equal(e.url, 'https://anato3d.fly.dev/api/pet?x=1');
    assert.deepEqual([e.init.method, e.cuerpo, e.init.redirect], ['POST', '{"v":2}', 'manual']);
    const h = new Headers(e.init.headers);
    assert.deepEqual([h.get('x-anato3d-proxy'), h.get('x-anato3d-ip'), h.get('origin'), h.get('host')], ['secreto-del-worker-0123', '7.7.7.7', 'https://anato3d.ejemplo.workers.dev', null]);
    // La cabecera del cupo diario por dispositivo llega al servidor tal cual (sin ella, contaría por la IP).
    assert.equal(h.get('x-anato3d-dispositivo'), '0f1e2d3c-4b5a-4968-8778-695a4b3c2d1e');
    // Sin configurar, no reenvía nada.
    const sin = await worker.fetch(new Request('https://anato3d.ejemplo.workers.dev/api/pet'), { ...env, ANATO3D_PROXY_SECRETO: '' });
    assert.equal(sin.status, 503);
    assert.equal(enviados.length, 1);
  } finally { globalThis.fetch = original; }
  // El servidor, detrás del Worker: la cabecera propia exige el secreto (y uno largo).
  const cfg = (extra) => configuracion({ ...extra }, { paquete: WEB });
  assert.throws(() => cfg({ ANATO3D_IP_DE: 'x-anato3d-ip' }), /necesita ANATO3D_PROXY_SECRETO/);
  assert.throws(() => cfg({ ANATO3D_IP_DE: 'x-anato3d-ip', ANATO3D_PROXY_SECRETO: 'corto' }), /al menos 16/);
  const detras = cfg({ ANATO3D_IP_DE: 'x-anato3d-ip', ANATO3D_PROXY_SECRETO: 'secreto-del-worker-0123' });
  const req = (headers) => ({ headers, socket: { remoteAddress: '10.0.0.1' } });
  assert.equal(ipDe(req({ 'x-anato3d-ip': '7.7.7.7', 'x-anato3d-proxy': 'secreto-del-worker-0123' }), detras), '7.7.7.7');
  assert.equal(ipDe(req({ 'x-anato3d-ip': '7.7.7.7', 'x-anato3d-proxy': 'secreto-del-worker-9999' }), detras), '10.0.0.1', 'con otro secreto, no');
  assert.equal(ipDe(req({ 'x-anato3d-ip': '7.7.7.7' }), detras), '10.0.0.1', 'sin secreto, no');
});

test('paquete con el proveedor simulado: la creación llega línea a línea, con su lección y sus citas; el estado dice «simulado», nunca «comprobada»; la clave no sale en ningún sitio', async () => {
  const prov = await crearProveedorSimulado({ retrasoMs: 60 });
  const dir = copia();
  const datos = path.join(dir, 'datos');
  const s = await arrancar(dir, conIA(prov, datos));
  try {
    const g = await json(await fetch(`${s.url}/api/pet`));
    assert.deepEqual([g.ia, g.crear, g.estado], [true, true, 'simulado']);
    const o = await json(await post(s, conversacion('¿Qué músculos mueven el hombro?')));
    assert.equal(o.ok, true);
    const p = await json(await post(s, { ...conversacion('crea una lección de la nariz'), modo: 'planificar', solicitud: SOL }));
    assert.equal(p.tipo, 'plan', JSON.stringify(p).slice(0, 300));
    const r = await post(s, { v: 2, modo: 'redactar', idioma: 'es', mensajes: [], plan: p.plan, trabajo: idT(1), hoy: HOY });
    assert.match(r.headers.get('content-type'), /application\/x-ndjson/);
    const lineas = await leerFlujo(r);
    const estados = lineas.map((x) => x.e.estado);
    assert.deepEqual(estados.filter((x) => x !== 'latido'), ['fuentes', 'redactando', 'comprobando', 'lista']);
    const fin = lineas.at(-1);
    assert.ok(lineas.find((x) => x.e.estado === 'redactando').t < fin.t - 150, 'el estado llega antes del final (sin buffering)');
    const L = fin.e.leccion;
    assert.ok(Object.keys(L.fuentesUsadas).length >= 1 && Object.keys(L.fuentesUsadas).every((f) => f.startsWith('wp:')), 'citas de las páginas empaquetadas');
    assert.ok(L.pasos.some((x) => x.texto.some((f) => f[1]?.f && f[1]?.c)), 'frases con su cita');
    assert.equal(L.revision.estado, 'borrador');
    assert.equal(L.origen.fecha, HOY);
    // Lo que gastó, en el tope (en la carpeta de datos), y el registro sin textos.
    const tope = JSON.parse(fs.readFileSync(path.join(datos, 'presupuesto.json'), 'utf8'));
    assert.ok(tope.historial.length >= 4 && tope.historial.every((h) => h.estado === 'ajustada'));
    assert.deepEqual(prov.llamadas.map((x) => x.modelo).filter((m) => m !== 'claude-haiku-5-5'), [], 'siempre Haiku 5.5');
    assert.ok(prov.llamadas.some((x) => x.flujo), 'la redacción va en flujo');
  } finally { await s.parar(); }
  // La clave centinela: ni en el registro, ni en las respuestas, ni en lo público, ni en los datos.
  assert.ok(!s.salida().includes(CLAVE) && !s.salida().includes('CENTINELA'), 'registro');
  assert.ok(!respuestas.some((t) => t.includes('CENTINELA')), 'respuestas');
  for (const carpeta of ['publico', 'datos', 'recursos']) {
    for (const f of fs.readdirSync(path.join(dir, carpeta), { recursive: true })) {
      const ruta = path.join(dir, carpeta, String(f));
      if (fs.statSync(ruta).isFile()) assert.ok(!fs.readFileSync(ruta, 'utf8').includes('CENTINELA'), ruta);
    }
  }
  assert.ok(!fs.readFileSync(path.join(dir, 'servidor.mjs'), 'utf8').includes('CENTINELA'));
  await prov.cerrar();
});

test('paquete: desconectar a mitad y volver a conectar al mismo trabajo no arranca otra generación', async () => {
  const prov = await crearProveedorSimulado({ retrasoMs: 20 });
  const dir = copia();
  const s = await arrancar(dir, conIA(prov, path.join(dir, 'datos')));
  try {
    const p = await json(await post(s, { ...conversacion('crea una lección de la nariz'), modo: 'planificar', solicitud: SOL }));
    prov.retener((c) => !!c.stream);
    const id = idT(2);
    const corte = new AbortController();
    const r = await post(s, { v: 2, modo: 'redactar', idioma: 'es', mensajes: [], plan: p.plan, trabajo: id }, { signal: corte.signal });
    await leerFlujo(r, (e) => e.estado === 'fuentes');
    corte.abort();
    await hasta(() => prov.llamadas.some((x) => x.modo === 'redactar'));
    // Vuelve a conectarse (como tras recargar la página) y la redacción sigue: la misma.
    const r2 = await post(s, { v: 2, modo: 'trabajo', trabajo: id });
    setTimeout(() => prov.soltar(), 100);
    const lineas = await leerFlujo(r2);
    assert.equal(lineas.at(-1).e.estado, 'lista');
    assert.equal(prov.llamadas.filter((x) => x.modo === 'redactar').length, 1, 'una sola redacción');
    // Pedir otra vez el mismo trabajo tampoco la repite.
    const r3 = await post(s, { v: 2, modo: 'redactar', idioma: 'es', mensajes: [], plan: p.plan, trabajo: id });
    assert.equal((await leerFlujo(r3)).at(-1).e.estado, 'lista');
    assert.equal(prov.llamadas.filter((x) => x.modo === 'redactar').length, 1);
  } finally { prov.soltar(); await s.parar(); await prov.cerrar(); }
});

test('paquete: un reinicio con una reserva activa no devuelve el saldo ni vuelve a cobrar nada solo; con la IA apagada o el almacén roto, la web sigue', async () => {
  const prov = await crearProveedorSimulado({ retrasoMs: 20 });
  const dir = copia();
  const datos = path.join(dir, 'datos');
  let s = await arrancar(dir, conIA(prov, datos));
  const p = await json(await post(s, { ...conversacion('crea una lección de la nariz'), modo: 'planificar', solicitud: SOL }));
  prov.retener((c) => !!c.stream);
  const id = idT(3);
  const r = await post(s, { v: 2, modo: 'redactar', idioma: 'es', mensajes: [], plan: p.plan, trabajo: id });
  await leerFlujo(r, (e) => e.estado === 'redactando');
  await hasta(() => prov.llamadas.some((x) => x.modo === 'redactar'));
  const antes = prov.llamadas.length;
  // Se cae en plena redacción (sin cerrar nada).
  await s.parar('SIGKILL');
  s = await arrancar(dir, conIA(prov, datos));
  try {
    const tope = JSON.parse(fs.readFileSync(path.join(datos, 'presupuesto.json'), 'utf8'));
    const abiertas = Object.values(tope.reservas);
    assert.deepEqual(abiertas.map((x) => [x.estado, x.etiqueta, x.trabajo]), [['incierta', 'redactar', id]], 'la reserva en curso pasa a incierta');
    assert.ok(Object.values(tope.dias)[0] >= abiertas[0].n, 'y cuenta entera: el saldo no vuelve');
    assert.match(s.salida(), /1 reserva\(s\) quedaron a medias al reiniciar/);
    // Nada se vuelve a generar solo; volver a conectarse dice que el servidor ya no lo tiene (la app pide confirmación).
    await esperar(200);
    assert.equal(prov.llamadas.length, antes);
    const r2 = await post(s, { v: 2, modo: 'trabajo', trabajo: id });
    assert.deepEqual([r2.status, (await json(r2)).error], [404, 'trabajo-desconocido']);
    // El interruptor: la IA deja de gastar al momento; la web sigue.
    fs.writeFileSync(path.join(datos, 'IA-APAGADA'), '');
    const g = await json(await fetch(`${s.url}/api/pet`));
    assert.deepEqual([g.ia, g.estado], [false, 'sin-presupuesto']);
    assert.equal((await post(s, conversacion('hombro'))).status, 503);
    assert.equal((await fetch(s.url)).status, 200);
    fs.unlinkSync(path.join(datos, 'IA-APAGADA'));
  } finally { await s.parar(); }
  // El almacén del tope, dañado: no se pisa, la IA no gasta y la web sigue.
  fs.writeFileSync(path.join(datos, 'presupuesto.json'), '{ roto');
  s = await arrancar(dir, conIA(prov, datos));
  try {
    assert.match(s.salida(), /Sin presupuesto utilizable \(almacen\)/);
    const g = await json(await fetch(`${s.url}/api/pet`));
    assert.deepEqual([g.ia, g.estado], [false, 'sin-presupuesto']);
    assert.equal((await fetch(s.url)).status, 200);
    assert.equal(fs.readFileSync(path.join(datos, 'presupuesto.json'), 'utf8'), '{ roto');
  } finally { prov.soltar(); await s.parar(); await prov.cerrar(); }
});

test('paquete sin el corpus completo o alterado: Neuri no explica con citas ni crea, y lo dice; sin clave, el buscador', async () => {
  const prov = await crearProveedorSimulado();
  for (const estropear of [
    (dir) => fs.rmSync(path.join(dir, 'recursos/fuentes'), { recursive: true }),
    (dir) => { const wp = path.join(dir, 'recursos/fuentes/wp'); const f = path.join(wp, fs.readdirSync(wp)[0]); fs.appendFileSync(f, ' '); },
  ]) {
    const dir = copia();
    estropear(dir);
    const s = await arrancar(dir, conIA(prov, path.join(dir, 'datos')));
    try {
      assert.match(s.salida(), /Recursos de Neuri (incompletos|alterados).*no explica con citas ni crea lecciones/);
      const g = await json(await fetch(`${s.url}/api/pet`));
      assert.deepEqual([g.ia, g.crear], [true, false]);
      const r = await post(s, { v: 2, modo: 'redactar', idioma: 'es', mensajes: [], plan: { titulo: 'X', resumen: 'x', nivel: 1, minutos: 10, formato: 'estructuras', sistemas: ['oseo'], temas: ['huesos'], lugares: [{ region: 'cabeza', subregion: 'cara' }], objetivos: ['Localizar el vómer.', 'Describirlo.'], estructuras: [{ clave: 'Vomer', papel: 'nucleo' }], pasos: [{ tipo: 'orientacion', titulo: 'a', idea: 'a', estructuras: [] }, { tipo: 'explicacion', titulo: 'b', idea: 'b', estructuras: ['Vomer'] }, { tipo: 'exploracion', titulo: 'c', idea: 'c', estructuras: ['Vomer'] }, { tipo: 'sintesis', titulo: 'd', idea: 'd', estructuras: [] }], paginas: [], limitaciones: [], supuestos: [], accion: 'crear', base: null } });
      // (El primer evento de un flujo lleva además el cupo diario; aquí es también el último.)
      const { cupo, ...fin } = (await leerFlujo(r)).at(-1).e;
      assert.deepEqual(fin, { estado: 'error', error: 'sin-recursos' });
      assert.equal(cupo.creaciones.limite, 3);
    } finally { await s.parar(); }
  }
  await prov.cerrar();
});

test('paquete: los reportes van por su camino (carpeta de datos, sin la IP) y su cola no se puede leer desde la web', async () => {
  const dir = copia();
  const datos = path.join(dir, 'datos');
  const s = await arrancar(dir, { ANATO3D_DATOS: datos });
  try {
    const { reporte } = crearReporte({ categoria: 'tecnico', comentario: 'Prueba del paquete', contexto: { vista: 'ficha', leccion: 'brazo', idioma: 'es' } });
    const r = await post(s, reporte, { ruta: '/api/reportes' });
    assert.equal(r.status, 201);
    const linea = fs.readFileSync(path.join(datos, 'reportes.jsonl'), 'utf8');
    assert.match(linea, /Prueba del paquete/);
    assert.ok(!linea.includes('127.0.0.1'), 'sin la IP');
    assert.equal((await fetch(`${s.url}/api/reportes`)).status, 405);
    assert.equal((await fetch(`${s.url}/datos/reportes.jsonl`)).status, 404);
  } finally { await s.parar(); }
});

test('paquete con el cupo diario: cuenta por dispositivo, agota con 429, persiste en el volumen tras reiniciar y no guarda el identificador ni la IP', async () => {
  const prov = await crearProveedorSimulado({ retrasoMs: 5 });
  const dir = copia();
  const datos = path.join(dir, 'datos');
  const ID = '7c1d2e3f-4a5b-4c6d-8e7f-8091a2b3c4d5';
  // Con el secreto de la sal (como en Fly, con `fly secrets set`): sin él, reiniciar empezaría los contadores del día.
  const env = conIA(prov, datos, { ANATO3D_CUPO_PREGUNTAS: '2', ANATO3D_CUPO_CREACIONES: '1', ANATO3D_CUPO_SAL: 'secreto-de-prueba-0123456789' });
  const pedir = (s, cuerpo) => fetch(`${s.url}/api/pet`, { method: 'POST', headers: { 'content-type': 'application/json', origin: s.url, 'x-anato3d-dispositivo': ID }, body: JSON.stringify(cuerpo) });
  let s = await arrancar(dir, env);
  try {
    assert.match(s.salida(), /cupo diario 2 preguntas y 1 creaciones por dispositivo/);
    const g = await json(await fetch(`${s.url}/api/pet`, { headers: { 'x-anato3d-dispositivo': ID } }));
    assert.deepEqual([g.cupo.preguntas, g.cupo.creaciones], [{ limite: 2, usadas: 0, quedan: 2 }, { limite: 1, usadas: 0, quedan: 1 }]);
    assert.ok(Date.parse(g.cupo.renueva) > Date.now());
    for (const n of [1, 2]) {
      const d = await json(await pedir(s, conversacion('¿Qué músculos mueven el hombro?')));
      assert.equal(d.ok, true);
      assert.deepEqual(d.cupo.preguntas, { limite: 2, usadas: n, quedan: 2 - n });
    }
    const r = await pedir(s, conversacion('¿Y el codo?'));
    const d = await json(r);
    assert.deepEqual([r.status, d.error, d.de, d.cupo.preguntas.quedan], [429, 'cupo', 'preguntas', 0]);
    assert.ok(d.espera > 0 && Number(r.headers.get('retry-after')) > 0);
    assert.equal(prov.llamadas.filter((x) => x.modo === 'orientar').length, 2, 'la tercera no llegó a la IA');
  } finally { await s.parar(); }
  // Los contadores, en el volumen: sin el identificador ni la IP en claro.
  const crudo = fs.readFileSync(path.join(datos, 'cupo.json'), 'utf8');
  assert.ok(!crudo.includes(ID) && !crudo.includes('127.0.0.1'), 'solo claves HMAC');
  assert.ok(!crudo.includes('secreto-de-prueba') && !('sal' in JSON.parse(crudo)), 'ni la sal');
  // Reiniciar no devuelve el cupo.
  s = await arrancar(dir, env);
  try {
    const g = await json(await fetch(`${s.url}/api/pet`, { headers: { 'x-anato3d-dispositivo': ID } }));
    assert.deepEqual(g.cupo.preguntas, { limite: 2, usadas: 2, quedan: 0 });
    // Otro dispositivo (otro navegador del mismo aula) tiene el suyo.
    const otro = await json(await fetch(`${s.url}/api/pet`, { headers: { 'x-anato3d-dispositivo': 'aaaabbbb-cccc-4ddd-8eee-ffff00001111' } }));
    assert.equal(otro.cupo.preguntas.quedan, 2);
  } finally { await s.parar(); await prov.cerrar(); }
});

test('configuración: la dirección del cliente solo sale del proxy configurado (y con su secreto); el proveedor solo puede ser Anthropic o este equipo', async () => {
  const req = (headers, ip = '10.0.0.1') => ({ headers, socket: { remoteAddress: ip } });
  const cfg = (extra) => configuracion({ ...extra }, { paquete: WEB });
  assert.equal(ipDe(req({ 'x-forwarded-for': '1.2.3.4' }), cfg({})), '10.0.0.1', 'sin proxy configurado no se cree la cabecera');
  assert.equal(ipDe(req({ 'x-forwarded-for': '9.9.9.9, 1.2.3.4' }), cfg({ ANATO3D_IP_DE: 'x-forwarded-for' })), '1.2.3.4', 'la última, la que puso el proxy');
  assert.equal(ipDe(req({ 'fly-client-ip': '5.6.7.8' }), cfg({ ANATO3D_IP_DE: 'fly-client-ip' })), '5.6.7.8');
  const conSecreto = cfg({ ANATO3D_IP_DE: 'cf-connecting-ip', ANATO3D_PROXY_SECRETO: 'secreto-del-worker' });
  assert.equal(ipDe(req({ 'cf-connecting-ip': '7.7.7.7' }), conSecreto), '10.0.0.1', 'sin el secreto, no');
  assert.equal(ipDe(req({ 'cf-connecting-ip': '7.7.7.7', 'x-anato3d-proxy': 'otro-secreto-de-mas' }), conSecreto), '10.0.0.1');
  assert.equal(ipDe(req({ 'cf-connecting-ip': '7.7.7.7', 'x-anato3d-proxy': 'secreto-del-worker' }), conSecreto), '7.7.7.7');
  assert.throws(() => cfg({ ANTHROPIC_BASE_URL: 'https://proxy.ejemplo.com' }), /solo se admite en localhost/);
  assert.throws(() => cfg({ ANATO3D_ORIGEN: 'https://a.com/ruta' }), /origen/);
  assert.throws(() => cfg({ ANATO3D_IP_DE: 'cualquiera' }), /ANATO3D_IP_DE/);
  assert.equal(cfg({ ANTHROPIC_BASE_URL: 'http://127.0.0.1:5199' }).simulado, true);
  assert.equal(cfg({}).simulado, false);
  // Con otro proveedor, el paquete no arranca (la clave iría a otro sitio).
  const dir = copia();
  const r = spawnSync(process.execPath, ['servidor.mjs'], { cwd: dir, env: entorno({ ANTHROPIC_API_KEY: CLAVE, ANTHROPIC_BASE_URL: 'https://proxy.ejemplo.com', ANATO3D_DATOS: path.join(dir, 'datos') }), encoding: 'utf8' });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /No arranca: ANTHROPIC_BASE_URL solo se admite en localhost/);
  assert.ok(!`${r.stdout}${r.stderr}`.includes('CENTINELA'));
});

test('la prueba real mínima, ensayada con el proveedor simulado: tres llamadas (Haiku, fuentes comprobadas y flujo), su coste máximo y la conciliación; sin --si-gastar contra Anthropic no envía nada', async () => {
  const prov = await crearProveedorSimulado({ retrasoMs: 10 });
  const datos = tmp();
  const correr = (extra, args = []) => new Promise((resolve) => {
    const h = spawn(process.execPath, ['scripts/prueba-minima.mjs', ...args], { cwd: WEB, env: entorno({ ANTHROPIC_API_KEY: CLAVE, ANATO3D_TOPE_DIARIO_USD: '1', ANATO3D_TOPE_MENSUAL_USD: '20', ANATO3D_DATOS: datos, ...extra }) });
    let out = '';
    h.stdout.on('data', (d) => { out += d; });
    h.stderr.on('data', (d) => { out += d; });
    h.on('exit', (code) => resolve({ code, out }));
  });
  try {
    const r = await correr({ ANTHROPIC_BASE_URL: prov.url });
    assert.equal(r.code, 0, r.out);
    assert.match(r.out, /PROVEEDOR SIMULADO: no gasta/);
    assert.match(r.out, /Coste máximo admitido: 0\.\d{4} US\$/);
    assert.match(r.out, /✔ explicación con fuentes comprobadas/);
    assert.match(r.out, /✔ flujo correcto: \{"ok":true\}/);
    assert.match(r.out, /✔ 3 llamadas; total 0\.\d{4} US\$/);
    assert.deepEqual(prov.llamadas.map((x) => [x.modo, x.flujo]), [['orientar', false], ['verificar', false], ['orientar', true]]);
    assert.ok(!r.out.includes('CENTINELA'));
    // Contra Anthropic de verdad y sin --si-gastar: dice lo que haría y no envía nada (aquí, sin red: un fetch que lo
    // apuntaría se notaría en el proveedor simulado, que no recibe nada nuevo).
    const n = prov.llamadas.length;
    const r2 = await correr({});
    assert.equal(r2.code, 0, r2.out);
    assert.match(r2.out, /No se ha enviado nada\. Para hacerla: node scripts\/prueba-minima\.mjs --si-gastar/);
    assert.equal(prov.llamadas.length, n);
  } finally { await prov.cerrar(); }
});
