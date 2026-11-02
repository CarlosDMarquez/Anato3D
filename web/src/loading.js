// Propiedad de las peticiones de carga.
//
// Cada modelo que el visor muestra abre una sesión. Todo lo que se pide para él (metadatos y GLB de los sistemas,
// índice de búsqueda) queda a nombre de esa sesión, fijada antes de la primera espera. Al volver de cada espera se
// comprueba que la sesión siga siendo la activa; si no, la petición se descarta (Stale) sin tocar el visor ni la
// interfaz. Al instalar otro modelo, la sesión anterior se cierra y sus descargas se abortan.
//
// Antes, una petición del sistema muscular masculino que esperaba sus metadatos seguía tras cambiar al modelo
// femenino y añadía los 481 músculos masculinos al cuerpo femenino (reproducido en el navegador el 2026-11-02).
// Sin DOM ni Three.js: lo prueba `node --test` (web/tests/loading.test.mjs).

/** Petición obsoleta: su sesión ya no es la activa. No es un error que haya que mostrar. */
export class Stale extends Error {
  constructor() {
    super('Petición obsoleta: el modelo cambió mientras se cargaba');
    this.name = 'Stale';
  }
}

/** Fallo de descarga con una causa que se puede explicar al estudiante. kind: 'network' | 'http' | 'format'. */
export class LoadError extends Error {
  constructor(kind, url, detail = '') {
    super(`${kind}: ${url}${detail ? ` (${detail})` : ''}`);
    this.name = 'LoadError';
    this.kind = kind;
    this.url = url;
  }
}

const isAbort = (err) => err?.name === 'AbortError';

/** Motivo breve, en español, para el mensaje de error. */
export function describeError(err) {
  if (err instanceof LoadError) {
    if (err.kind === 'network') return 'sin conexión o el servidor no responde';
    if (err.kind === 'http') return 'el archivo no está disponible en el servidor';
    return 'el archivo recibido no es válido';
  }
  return 'error inesperado';
}

async function request(url, signal, fetchImpl) {
  let r;
  try {
    r = await fetchImpl(url, { signal });
  } catch (err) {
    if (isAbort(err)) throw err;
    throw new LoadError('network', url, err?.message);
  }
  if (!r.ok) throw new LoadError('http', url, `HTTP ${r.status}`);
  // Un servidor con «fallback» de aplicación de una página (el de desarrollo de Vite, muchos alojamientos estáticos)
  // responde 200 con el index.html cuando falta el archivo: es un archivo no disponible, no uno dañado.
  if (r.headers?.get?.('content-type')?.includes('text/html')) throw new LoadError('http', url, 'HTML en lugar del archivo');
  return r;
}

/** JSON con comprobación de estado HTTP y de formato (el servidor de desarrollo responde 200 con HTML si falta). */
export async function fetchJSON(url, { signal, fetchImpl = globalThis.fetch } = {}) {
  const r = await request(url, signal, fetchImpl);
  try {
    return await r.json();
  } catch (err) {
    if (isAbort(err)) throw err;
    throw new LoadError('format', url, 'no es JSON');
  }
}

/** ArrayBuffer con progreso (0–1) si el servidor da la longitud. */
export async function fetchBuffer(url, { signal, onProgress, fetchImpl = globalThis.fetch } = {}) {
  const r = await request(url, signal, fetchImpl);
  try {
    const total = Number(r.headers?.get?.('content-length')) || 0;
    if (!onProgress || !total || !r.body?.getReader) return await r.arrayBuffer();
    const reader = r.body.getReader();
    const chunks = [];
    let got = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      got += value.length;
      onProgress(Math.min(got / total, 1));
    }
    const out = new Uint8Array(got);
    let at = 0;
    for (const c of chunks) { out.set(c, at); at += c.length; }
    return out.buffer;
  } catch (err) {
    if (isAbort(err)) throw err;
    throw new LoadError('network', url, err?.message);              // la conexión se cortó a mitad de descarga
  }
}

/** Comprueba la cabecera «glTF» de un GLB (si falta el archivo, el servidor de desarrollo devuelve el index.html). */
export function assertGLB(buffer, url) {
  const magic = buffer.byteLength >= 4 ? new DataView(buffer).getUint32(0, true) : 0;
  if (magic !== 0x46546c67) throw new LoadError('format', url, 'no es un GLB');
}

export class Session {
  constructor(model, generation) {
    this.model = model;                // 'male' | 'female'
    this.generation = generation;      // generación del visor con la que se instaló este modelo
    this.controller = new AbortController();
    this.systems = new Map();          // id → { loaded, promise }
  }

  get signal() {
    return this.controller.signal;
  }

  loaded(id) {
    return !!this.systems.get(id)?.loaded;
  }
}

export class Sessions {
  current = null;

  /** Abre la sesión del modelo recién instalado y cierra (aborta) la anterior. */
  open(model, generation) {
    this.current?.controller.abort();
    this.current = new Session(model, generation);
    return this.current;
  }

  isCurrent(s) {
    return !!s && s === this.current && !s.signal.aborted;
  }

  /** Lanza Stale si `s` ya no es la sesión activa. Se llama después de cada espera. */
  check(s) {
    if (!this.isCurrent(s)) throw new Stale();
  }
}

/**
 * Carga de sistemas a nombre de la sesión activa en el momento de pedirla.
 *   systemsOf(model) → { [id]: { url, meta } }
 *   fetchMeta(url, { signal }) → metadatos del sistema ({ groups })
 *   addSystem(url, { generation, signal, onProgress }) → piezas añadidas, o null si el visor ya no muestra esa generación
 *   onMeta(session, meta) → registra los metadatos (solo si la sesión sigue activa)
 * Devuelve load(id, { onProgress }) → Promise<{ session, loaded: true }>; rechaza con Stale si la sesión cambió y con
 * el error de descarga si falló. Pedir el mismo sistema varias veces comparte una sola descarga; una carga fallida u
 * obsoleta no se guarda, así que el siguiente intento empieza de nuevo.
 */
export function createSystemLoader({ sessions, systemsOf, fetchMeta, addSystem, onMeta }) {
  return function load(id, { onProgress } = {}) {
    const s = sessions.current;                                      // dueño, fijado antes de cualquier espera
    const def = s && systemsOf(s.model)?.[id];
    if (!def) return Promise.resolve({ session: s, loaded: true });  // sistema sin archivo aparte
    const entry = s.systems.get(id);
    if (entry?.loaded) return Promise.resolve({ session: s, loaded: true });
    if (entry?.promise) return entry.promise;
    const e = { loaded: false, promise: null };
    s.systems.set(id, e);
    e.promise = (async () => {
      sessions.check(s);
      const meta = await fetchMeta(def.meta, { signal: s.signal });
      sessions.check(s);
      onMeta(s, meta);
      const parts = await addSystem(def.url, { generation: s.generation, signal: s.signal, onProgress });
      sessions.check(s);
      if (!parts) throw new Stale();
      e.loaded = true;
      e.promise = null;
      return { session: s, loaded: true };
    })().catch((err) => {
      if (s.systems.get(id) === e) s.systems.delete(id);              // no bloquea el siguiente intento
      throw isAbort(err) || !sessions.isCurrent(s) ? new Stale() : err;
    });
    return e.promise;
  };
}

/**
 * Caché de promesas por clave que olvida los fallos: un índice de búsqueda que no se pudo descargar se vuelve a pedir
 * la próxima vez, en vez de quedarse vacío para siempre.
 */
export function onceByKey(fn) {
  const cache = new Map();
  const get = (key, ...args) => {
    if (!cache.has(key)) {
      const p = Promise.resolve().then(() => fn(key, ...args));
      cache.set(key, p);
      p.catch(() => cache.get(key) === p && cache.delete(key));
    }
    return cache.get(key);
  };
  get.forget = (key) => cache.delete(key);
  return get;
}
