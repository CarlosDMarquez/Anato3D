// Monta el servidor de Neuri (server/pet.mjs) en /api/pet dentro de `npm run dev` y `npm run preview`.
// La clave se lee de web/.env.local (ANTHROPIC_API_KEY), que git no guarda; sin clave, Neuri responde con el buscador.
// Opcional: ANATO3D_PET_MODELO (conversación) y ANATO3D_PET_MODELO_LECCIONES (planificar, redactar y adaptar); por
// defecto, claude-haiku-5-5 para todo. Opus no se usa: es caro (ver server/neuri/modelo.mjs).
import fs from 'node:fs';
import path from 'node:path';
import { loadEnv } from 'vite';
import { crearManejador, elegirModelo } from './pet.mjs';
import { cargarRecursos } from './neuri/recursos.mjs';
import { crearManejadorReportes } from './reportes.mjs';

export function petApi() {
  let raiz = process.cwd();
  let modo = 'development';
  let manejar = null;
  let firma = '';
  let recursos = null;

  // Se prepara la primera vez que se usa y se rehace si cambian el catálogo, la clave o el modelo (sin reiniciar).
  function preparar() {
    const archivo = path.join(raiz, 'src/biblioteca/generado/catalogo.json');
    const env = { ...loadEnv(modo, raiz, ''), ...process.env };
    const clave = env.ANTHROPIC_API_KEY?.trim() || null;
    const modelo = elegirModelo(env.ANATO3D_PET_MODELO);
    const modeloLecciones = elegirModelo(env.ANATO3D_PET_MODELO_LECCIONES || modelo);
    const mtime = fs.statSync(archivo).mtimeMs;
    const nueva = `${mtime}|${clave ? clave.length : 0}|${clave?.slice(-4) ?? ''}|${modelo}|${modeloLecciones}`;
    if (manejar && nueva === firma) return manejar;
    const catalogo = JSON.parse(fs.readFileSync(archivo, 'utf8'));
    // Los recursos (inventario, evidencias, lecciones) se cargan una vez y se rehacen si cambia el catálogo.
    if (!recursos || !firma.startsWith(`${mtime}|`)) {
      let promesa = null;
      recursos = () => (promesa ??= cargarRecursos({ raiz }));
    }
    manejar = crearManejador({ catalogo, clave, modelo, modeloLecciones, recursos });
    firma = nueva;
    console.info(`[pet] Neuri ${clave ? `con IA (${modelo}${modeloLecciones !== modelo ? `; lecciones: ${modeloLecciones}` : ''})` : 'sin clave de API: responde con el buscador'}.`);
    return manejar;
  }

  // Reportes de problemas: se añaden a server/datos/reportes.jsonl (se revisan con `npm run reportes`).
  let reportes = null;
  async function middlewareReportes(req, res) {
    try {
      reportes ??= crearManejadorReportes({ archivo: path.join(raiz, 'server/datos/reportes.jsonl') });
      const body = req.method === 'POST' ? await leer(req, 16 * 1024) : undefined;
      await enviarRespuesta(await reportes(peticionDeNode(req, res, body), { ip: req.socket?.remoteAddress ?? '' }), res);
    } catch (err) {
      console.error('[reportes] Error del servidor:', err);
      if (!res.headersSent) { res.statusCode = 500; res.setHeader('content-type', 'application/json; charset=utf-8'); res.end('{"ok":false,"error":"servidor"}'); }
    }
  }

  async function middleware(req, res) {
    try {
      const body = req.method === 'POST' ? await leer(req, 300 * 1024) : undefined;
      const respuesta = await preparar()(peticionDeNode(req, res, body), { ip: req.socket?.remoteAddress ?? '' });
      await enviarRespuesta(respuesta, res);
    } catch (err) {
      console.error('[pet] Error del servidor:', err);
      if (res.headersSent) { if (!res.writableEnded) res.end(); return; }   // a mitad de un flujo: se corta sin añadir nada
      res.statusCode = 500;
      res.setHeader('content-type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ ok: false, error: 'servidor' }));
    }
  }

  return {
    name: 'anato3d-pet',
    configResolved(config) { raiz = config.root; modo = config.mode; },
    configureServer(server) { server.middlewares.use('/api/pet', middleware); server.middlewares.use('/api/reportes', middlewareReportes); },
    configurePreviewServer(server) { server.middlewares.use('/api/pet', middleware); server.middlewares.use('/api/reportes', middlewareReportes); },
  };
}

/**
 * La petición estándar (Request) de una de Node. Lleva una señal que se activa si la app se va antes de recibir la
 * respuesta (cancelar, «nueva conversación», cerrar la página): así el servidor deja de llamar a Claude en las
 * peticiones cortas. Las creaciones con identificador no la usan: siguen hasta que se cancelan (server/pet.mjs).
 */
export function peticionDeNode(req, res, body) {
  const url = new URL(req.originalUrl ?? req.url, `http://${req.headers.host ?? 'localhost'}`);
  const cabeceras = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (Array.isArray(v)) v.forEach((x) => cabeceras.append(k, x));
    else if (v != null) cabeceras.set(k, String(v));
  }
  const control = new AbortController();
  res.on('close', () => { if (!res.writableEnded) control.abort(); });
  return new Request(url, { method: req.method, headers: cabeceras, body, signal: control.signal });
}

/**
 * Pasa una respuesta estándar (Response) a la de Node. En flujo (redactar), cada línea sale en cuanto está, para que la
 * app enseñe el estado; si la app corta la conexión (cancelar, cerrar la página), se cancela el flujo y el servidor deja
 * de llamar a Claude (server/pet.mjs, `flujo`).
 */
export async function enviarRespuesta(respuesta, res) {
  res.statusCode = respuesta.status;
  respuesta.headers.forEach((v, k) => res.setHeader(k, v));
  if (respuesta.body) {
    res.flushHeaders?.();
    const lector = respuesta.body.getReader();
    let cortado = false;
    const cortar = () => { if (!cortado) { cortado = true; lector.cancel().catch(() => {}); } };
    res.on('close', () => { if (!res.writableEnded) cortar(); });
    for (;;) {
      let trozo;
      try { trozo = await lector.read(); } catch { break; }
      if (trozo.done) break;
      if (res.destroyed) { cortar(); break; }
      res.write(Buffer.from(trozo.value));
    }
  }
  if (!res.destroyed && !res.writableEnded) res.end();
}

/** Cuerpo de la petición, como mucho `max` + 1 bytes (si llega más, el manejador responde «demasiado largo»). */
function leer(req, max) {
  return new Promise((resolve, reject) => {
    const trozos = [];
    let total = 0;
    req.on('data', (c) => { if (total <= max) { trozos.push(c); total += c.length; } });
    req.on('end', () => resolve(Buffer.concat(trozos).subarray(0, max + 1)));
    req.on('error', reject);
  });
}
