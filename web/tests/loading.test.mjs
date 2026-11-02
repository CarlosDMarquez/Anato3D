// Pruebas de la propiedad de las peticiones de carga (src/loading.js), sin navegador: `npm test` (node --test).
// Las esperas se controlan a mano (deferred), así que cada carrera se reproduce siempre igual.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  Sessions, Stale, LoadError, createSystemLoader, onceByKey, fetchJSON, fetchBuffer, assertGLB, describeError,
} from '../src/loading.js';

const deferred = () => {
  let resolve, reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
};
const tick = () => new Promise((r) => setTimeout(r, 0));

const SYSTEMS = {
  male: { muscular: { url: '/models/male-muscular.glb', meta: '/models/male-muscular.json' } },
  female: { muscular: { url: '/models/female-muscular.glb', meta: '/models/female-muscular.json' } },
};

// Visor falso: registra qué GLB se añade y con qué generación; cada metadato y cada GLB esperan a que la prueba los
// suelte (o los haga fallar).
function harness() {
  const sessions = new Sessions();
  const viewer = { generation: 0, added: [] };
  const metaWaits = [], glbWaits = [], groups = [];
  const load = createSystemLoader({
    sessions,
    systemsOf: (m) => SYSTEMS[m],
    fetchMeta: (url, { signal }) => {
      const d = deferred();
      metaWaits.push({ url, signal, ...d });
      signal.addEventListener('abort', () => d.reject(Object.assign(new Error('abortado'), { name: 'AbortError' })));
      return d.promise;
    },
    addSystem: async (url, { generation, signal }) => {
      if (generation !== viewer.generation) return null;
      const d = deferred();
      glbWaits.push({ url, signal, ...d });
      signal.addEventListener('abort', () => d.reject(Object.assign(new Error('abortado'), { name: 'AbortError' })));
      await d.promise;
      if (generation !== viewer.generation) return null;
      viewer.added.push({ url, generation });
      return [{ id: 'pieza' }];
    },
    onMeta: (s, meta) => groups.push({ model: s.model, meta }),
  });
  const install = (model) => sessions.open(model, ++viewer.generation);
  return { sessions, viewer, load, metaWaits, glbWaits, groups, install };
}

test('metadatos retrasados: un cambio de modelo descarta la petición y no añade el GLB al modelo nuevo', async () => {
  const h = harness();
  h.install('male');
  const p = h.load('muscular');
  h.install('female');                                   // el usuario cambia de modelo mientras esperan los metadatos
  h.metaWaits[0].resolve({ groups: { g: { nombre: 'x' } } });
  await assert.rejects(p, Stale);
  assert.deepEqual(h.viewer.added, []);
  assert.deepEqual(h.groups, []);                        // ni sus grupos
  assert.equal(h.metaWaits[0].signal.aborted, true);     // y su sesión quedó abortada
});

test('GLB retrasado: un cambio de modelo durante la descarga la aborta y no la añade', async () => {
  const h = harness();
  h.install('male');
  const p = h.load('muscular');
  h.metaWaits[0].resolve({});
  await tick();
  assert.equal(h.glbWaits.length, 1);
  h.install('female');
  await assert.rejects(p, Stale);
  assert.equal(h.glbWaits[0].signal.aborted, true);
  assert.deepEqual(h.viewer.added, []);
});

test('el modelo nuevo carga su propio sistema después de un cambio', async () => {
  const h = harness();
  h.install('male');
  const old = assert.rejects(h.load('muscular'), Stale);   // la sesión vieja se aborta al cambiar
  h.install('female');
  const p = h.load('muscular');
  h.metaWaits[1].resolve({});
  await tick();
  h.glbWaits[0].resolve();
  assert.deepEqual(await p, { session: h.sessions.current, loaded: true });
  await old;
  assert.deepEqual(h.viewer.added, [{ url: '/models/female-muscular.glb', generation: 2 }]);
});

test('cambios rápidos ida y vuelta: la petición vieja no se mezcla con la nueva del mismo modelo', async () => {
  const h = harness();
  h.install('male');
  const first = h.load('muscular');
  h.install('female');
  h.install('male');                                     // vuelve al masculino: sesión nueva, generación 3
  const second = h.load('muscular');
  h.metaWaits[0].resolve({});                            // llega tarde la respuesta de la primera sesión
  await assert.rejects(first, Stale);
  h.metaWaits[1].resolve({});
  await tick();
  h.glbWaits[0].resolve();
  await second;
  assert.deepEqual(h.viewer.added, [{ url: '/models/male-muscular.glb', generation: 3 }]);
});

test('peticiones repetidas comparten una sola descarga', async () => {
  const h = harness();
  h.install('male');
  const a = h.load('muscular'), b = h.load('muscular'), c = h.load('muscular');
  assert.equal(a, b);
  assert.equal(b, c);
  assert.equal(h.metaWaits.length, 1);
  h.metaWaits[0].resolve({});
  await tick();
  h.glbWaits[0].resolve();
  await a;
  assert.equal(h.sessions.current.loaded('muscular'), true);
  await h.load('muscular');                              // ya cargado: no vuelve a descargar
  assert.equal(h.metaWaits.length, 1);
});

test('una descarga fallida no bloquea el reintento', async () => {
  const h = harness();
  h.install('male');
  const p = h.load('muscular');
  h.metaWaits[0].reject(new LoadError('network', '/models/male-muscular.json'));
  await assert.rejects(p, LoadError);
  assert.equal(h.sessions.current.loaded('muscular'), false);
  const retry = h.load('muscular');                      // botón «Reintentar»
  assert.equal(h.metaWaits.length, 2);
  h.metaWaits[1].resolve({});
  await tick();
  h.glbWaits[0].resolve();
  await retry;
  assert.equal(h.sessions.current.loaded('muscular'), true);
});

test('un fallo de la sesión vieja no se presenta como error del modelo nuevo', async () => {
  const h = harness();
  h.install('male');
  const p = h.load('muscular');
  h.install('female');
  h.metaWaits[0].reject(new LoadError('network', '/models/male-muscular.json'));
  await assert.rejects(p, Stale);
});

test('onceByKey: guarda el resultado por clave y olvida los fallos', async () => {
  let calls = 0, fail = true;
  const get = onceByKey(async (k) => {
    calls++;
    if (fail) throw new Error('caído');
    return `índice ${k}`;
  });
  await assert.rejects(get('male'));
  fail = false;
  assert.equal(await get('male'), 'índice male');        // se vuelve a pedir tras el fallo
  assert.equal(await get('male'), 'índice male');        // y luego se reutiliza
  assert.equal(calls, 2);
  assert.equal(await get('female'), 'índice female');    // cada modelo, el suyo
});

// ── Descargas: estado HTTP, formato, red y aborto ──
const response = (body, { status = 200, type = 'application/json', length } = {}) => {
  const bytes = typeof body === 'string' ? new TextEncoder().encode(body) : body;
  const headers = { 'content-type': type };
  if (length !== undefined) headers['content-length'] = String(length);
  return new Response(bytes, { status, headers });
};

test('fetchJSON: 404, HTML en lugar de JSON y red caída dan errores explicables', async () => {
  await assert.rejects(fetchJSON('/x.json', { fetchImpl: async () => response('no', { status: 404 }) }),
    (e) => e instanceof LoadError && e.kind === 'http');
  // Archivo que falta en un servidor que devuelve el index.html con 200 (el de desarrollo): no disponible.
  await assert.rejects(fetchJSON('/x.json', { fetchImpl: async () => response('<!doctype html>', { type: 'text/html' }) }),
    (e) => e instanceof LoadError && e.kind === 'http');
  await assert.rejects(fetchJSON('/x.json', { fetchImpl: async () => response('{roto') }),
    (e) => e instanceof LoadError && e.kind === 'format');
  await assert.rejects(fetchJSON('/x.json', { fetchImpl: async () => { throw new TypeError('Failed to fetch'); } }),
    (e) => e instanceof LoadError && e.kind === 'network');
  assert.equal(describeError(new LoadError('network', '/x')), 'sin conexión o el servidor no responde');
  assert.deepEqual(await fetchJSON('/x.json', { fetchImpl: async () => response('{"a":1}') }), { a: 1 });
});

test('fetchJSON: un aborto se propaga como AbortError, no como fallo de red', async () => {
  const ctl = new AbortController();
  ctl.abort();
  await assert.rejects(fetchJSON('/x.json', { signal: ctl.signal, fetchImpl: (url, { signal }) => fetch('data:,{}', { signal }) }),
    (e) => e.name === 'AbortError');
});

test('fetchBuffer: progreso hasta 1 y GLB comprobado por su cabecera', async () => {
  const glb = new Uint8Array([0x67, 0x6c, 0x54, 0x46, 2, 0, 0, 0, 1, 2, 3, 4]);
  const seen = [];
  const buf = await fetchBuffer('/m.glb', { onProgress: (k) => seen.push(k), fetchImpl: async () => response(glb, { type: 'model/gltf-binary', length: glb.length }) });
  assert.equal(buf.byteLength, glb.length);
  assert.equal(seen.at(-1), 1);
  assertGLB(buf, '/m.glb');
  await assert.rejects(fetchBuffer('/m.glb', { fetchImpl: async () => response('<!doctype html>', { type: 'text/html' }) }),
    (e) => e instanceof LoadError && e.kind === 'http');
  const junk = await fetchBuffer('/m.glb', { fetchImpl: async () => response('no soy un glb', { type: 'application/octet-stream' }) });
  assert.throws(() => assertGLB(junk, '/m.glb'), (e) => e instanceof LoadError && e.kind === 'format');
});
