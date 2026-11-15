// Servidor de producción de Anato3D: la web estática (publico/), la API de Neuri (/api/pet) y la de los reportes
// (/api/reportes), fuera de Vite, en un solo proceso de Node. Se ejecuta desde el paquete que arma scripts/paquete.mjs
// (`node servidor.mjs` en su carpeta): no necesita el árbol de desarrollo ni la carpeta build/.
//
// Configuración (variables de entorno; la clave, solo como secreto del alojamiento, nunca en archivos):
//   PORT                      puerto (por defecto 8080)
//   ANATO3D_ORIGEN            el origen público («https://anato3d.ejemplo»): la API solo acepta peticiones de la web de
//                             ese origen. Sin él, el host de cada petición (vale con un solo dominio, sin proxy delante).
//   ANATO3D_IP_DE             de dónde sale la dirección del cliente para los límites de uso: socket (por defecto),
//                             fly-client-ip (todo en Fly), cf-connecting-ip, x-forwarded-for (la última dirección, la
//                             que puso el proxy) o x-anato3d-ip (la que pone el Worker de despliegue/worker.mjs; exige
//                             el secreto). Solo cuando hay ese proxy delante: si no, cualquiera podría inventársela.
//   ANATO3D_PROXY_SECRETO     si se pone (16 caracteres o más), la cabecera de la dirección solo se cree cuando la
//                             petición trae «x-anato3d-proxy: <secreto>» (lo añade el proxy de confianza, el Worker).
//   ANATO3D_DATOS             carpeta persistente (un volumen): tope de gasto, interruptor IA-APAGADA, reportes y las
//                             páginas que baja Neuri. Por defecto, ./datos. Una sola instancia: el cerrojo del tope lo
//                             exige (dos procesos con el mismo volumen no tienen saldo cada uno).
//   ANATO3D_PAQUETE           la carpeta del paquete (publico/, recursos/, MANIFIESTO.json); por defecto, la del servidor.
//   ANTHROPIC_API_KEY, ANATO3D_TOPE_DIARIO_USD, ANATO3D_TOPE_MENSUAL_USD, ANATO3D_PRESUPUESTO_ZONA, ANATO3D_PET_MODELO,
//   ANATO3D_PET_MODELO_LECCIONES, ANATO3D_PERMITIR_SONNET: como en desarrollo (web/.env.example).
//   ANATO3D_CUPO, ANATO3D_CUPO_PREGUNTAS, ANATO3D_CUPO_CREACIONES, ANATO3D_CUPO_IP: el cupo diario por dispositivo
//                             (server/neuri/cupo.mjs; por defecto 30 preguntas y 3 creaciones, 300/30 por IP; 0 lo apaga).
//                             Sus contadores van en la carpeta de datos (cupo.json: números y claves HMAC, sin la sal).
//   ANATO3D_CUPO_SAL          el secreto de la clave HMAC del cupo (16 caracteres o más; con `fly secrets set`). Sin
//                             él, una sal aleatoria de cada día en memoria: al reiniciar, el cupo del día empieza de nuevo.
//   ANTHROPIC_BASE_URL        solo para el ensayo con el proveedor simulado (scripts/proveedor-simulado.mjs): se acepta
//                             únicamente en localhost, y entonces el servicio dice «simulado», nunca «comprobada».
//
// Registro: una línea por petición con método, ruta (sin parámetros), estado y milisegundos; nunca direcciones, cuerpos,
// cabeceras ni la clave.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { crearManejador, elegirModelo } from './pet.mjs';
import { crearManejadorReportes } from './reportes.mjs';
import { presupuestoDesdeEntorno, nanoAUsd } from './neuri/presupuesto.mjs';
import { cupoDesdeEntorno } from './neuri/cupo.mjs';
import { cargarRecursos } from './neuri/recursos.mjs';
import { peticionDeNode, enviarRespuesta, leerCuerpoNode } from './nodo.mjs';

export const VERSION_SERVIDOR = '2026-11-11.1';
const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.ico': 'image/x-icon', '.glb': 'model/gltf-binary', '.gltf': 'model/gltf+json', '.bin': 'application/octet-stream',
  '.wasm': 'application/wasm', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.txt': 'text/plain; charset=utf-8',
};
const COMPRIMIR = /^(text\/|application\/(json|manifest\+json|wasm)|image\/svg|model\/gltf\+json)/;
const SEGURIDAD = { 'x-content-type-options': 'nosniff', 'referrer-policy': 'same-origin', 'x-frame-options': 'DENY' };
const CUERPO_PET = 300 * 1024;
const CUERPO_REPORTES = 16 * 1024;

/** La configuración del entorno, comprobada. Lanza un Error con un mensaje claro si algo no vale (no arranca). */
export function configuracion(env = process.env, { paquete } = {}) {
  const raiz = path.resolve(env.ANATO3D_PAQUETE?.trim() || paquete);
  const origen = env.ANATO3D_ORIGEN?.trim() || null;
  if (origen && !/^https?:\/\/[^/\s]+$/.test(origen)) throw new Error('ANATO3D_ORIGEN tiene que ser un origen («https://dominio», sin ruta).');
  const ipDe = env.ANATO3D_IP_DE?.trim() || 'socket';
  if (!['socket', 'fly-client-ip', 'cf-connecting-ip', 'x-forwarded-for', 'x-anato3d-ip'].includes(ipDe)) throw new Error('ANATO3D_IP_DE: socket, fly-client-ip, cf-connecting-ip, x-forwarded-for o x-anato3d-ip.');
  const secretoProxy = env.ANATO3D_PROXY_SECRETO?.trim() || null;
  if (secretoProxy && secretoProxy.length < 16) throw new Error('ANATO3D_PROXY_SECRETO: al menos 16 caracteres (uno largo y al azar).');
  // La cabecera propia solo la pone el Worker: sin el secreto, cualquiera podría inventársela.
  if (ipDe === 'x-anato3d-ip' && !secretoProxy) throw new Error('ANATO3D_IP_DE=x-anato3d-ip necesita ANATO3D_PROXY_SECRETO (el mismo que el del Worker).');
  const base = env.ANTHROPIC_BASE_URL?.trim() || null;
  let simulado = false;
  if (base) {
    let h;
    try { h = new URL(base).hostname; } catch { throw new Error('ANTHROPIC_BASE_URL no es una URL.'); }
    // La clave viaja a esa dirección: fuera de la de Anthropic, solo el proveedor simulado de esta máquina.
    if (!['127.0.0.1', 'localhost', '::1', '[::1]'].includes(h) && h !== 'api.anthropic.com') throw new Error('ANTHROPIC_BASE_URL solo se admite en localhost (proveedor simulado) o en api.anthropic.com.');
    simulado = h !== 'api.anthropic.com';
  }
  return {
    raiz, origen, ipDe, simulado,
    puerto: Number(env.PORT ?? 8080),
    publico: path.join(raiz, 'publico'),
    recursos: path.join(raiz, 'recursos'),
    datos: path.resolve(env.ANATO3D_DATOS?.trim() || path.join(raiz, 'datos')),
    secretoProxy,
  };
}

/** Comprueba los recursos del paquete con su manifiesto (SHA-256): { ok, faltan, distintos }. */
export function comprobarManifiesto(raiz) {
  let m;
  try { m = JSON.parse(fs.readFileSync(path.join(raiz, 'MANIFIESTO.json'), 'utf8')); } catch { return { ok: false, faltan: ['MANIFIESTO.json'], distintos: [] }; }
  const faltan = [];
  const distintos = [];
  for (const [rel, h] of Object.entries(m.archivos ?? {})) {
    if (!rel.startsWith('recursos/')) continue;
    let datos;
    try { datos = fs.readFileSync(path.join(raiz, rel)); } catch { faltan.push(rel); continue; }
    if (crypto.createHash('sha256').update(datos).digest('hex') !== h) distintos.push(rel);
  }
  return { ok: !faltan.length && !distintos.length && Object.keys(m.archivos ?? {}).some((k) => k.startsWith('recursos/')), faltan, distintos, version: m.version ?? null };
}

/** La dirección del cliente para los límites de uso: solo de la cabecera del proxy configurado (y con su secreto). */
export function ipDe(req, cfg) {
  const socket = req.socket?.remoteAddress ?? '';
  if (cfg.ipDe === 'socket') return socket;
  if (cfg.secretoProxy) {
    const dado = String(req.headers['x-anato3d-proxy'] ?? '');
    const ok = dado.length === cfg.secretoProxy.length && crypto.timingSafeEqual(Buffer.from(dado), Buffer.from(cfg.secretoProxy));
    if (!ok) return socket;
  }
  const v = req.headers[cfg.ipDe];
  if (!v) return socket;
  if (cfg.ipDe === 'x-forwarded-for') return String(v).split(',').map((x) => x.trim()).filter(Boolean).at(-1) ?? socket;
  return String(v).trim() || socket;
}

/**
 * Prepara el servidor (sin escuchar todavía): { servidor, presupuesto, estado, cerrar }. `paquete`: la carpeta del
 * paquete; `env`: las variables; `registro`: dónde escribe (las pruebas lo cambian).
 */
export async function crearServidor({ paquete = path.dirname(fileURLToPath(import.meta.url)), env = process.env, registro = console } = {}) {
  const cfg = configuracion(env, { paquete });
  fs.mkdirSync(cfg.datos, { recursive: true });
  const publico = fs.realpathSync(cfg.publico);
  const catalogo = JSON.parse(fs.readFileSync(path.join(cfg.recursos, 'catalogo.json'), 'utf8'));

  // Los recursos de Neuri (inventario, lecciones y páginas citables): solo si coinciden con el manifiesto. Si faltan o
  // están alterados, Neuri no explica con citas ni crea (crear: false) y lo dice; nunca inventa fuentes.
  const man = comprobarManifiesto(cfg.raiz);
  let recursos = null;
  if (man.ok) {
    let promesa = null;
    recursos = () => (promesa ??= (async () => cargarRecursos({
      registro,
      fuentes: [path.join(cfg.recursos, 'fuentes')],
      dirNeuri: path.join(cfg.datos, 'fuentes-neuri'),
      inventario: JSON.parse(fs.readFileSync(path.join(cfg.recursos, 'inventario.json'), 'utf8')),
      lecciones: new Map(JSON.parse(fs.readFileSync(path.join(cfg.recursos, 'lecciones.json'), 'utf8')).map((L) => [L.id, L])),
    }))());
  } else {
    registro.error?.(`[servidor] Recursos de Neuri ${man.faltan.length ? `incompletos (faltan ${man.faltan.length})` : `alterados (${man.distintos.length} distintos del manifiesto)`}: Neuri no explica con citas ni crea lecciones.`);
  }

  const clave = env.ANTHROPIC_API_KEY?.trim() || null;
  const permitirSonnet = env.ANATO3D_PERMITIR_SONNET?.trim() === '1';
  const modelo = elegirModelo(env.ANATO3D_PET_MODELO, registro, { permitirSonnet });
  const modeloLecciones = elegirModelo(env.ANATO3D_PET_MODELO_LECCIONES || modelo, registro, { permitirSonnet });
  // El tope de gasto, en la carpeta de datos (con su cerrojo: una sola instancia). Sin clave no hace falta.
  const presupuesto = clave ? presupuestoDesdeEntorno({ ...env, ANATO3D_DATOS: cfg.datos }, { registro }) : null;
  const zona = presupuesto?.resumen().zona ?? 'America/Tijuana';
  // El cupo diario por dispositivo, en la misma carpeta (y con su cerrojo). Sin clave no hay nada que contar.
  const cupo = clave ? cupoDesdeEntorno(env, { dir: cfg.datos, registro, zona }) : null;
  const manejarPet = crearManejador({
    catalogo, clave, modelo, modeloLecciones, recursos, presupuesto, permitirSonnet, registro, simulado: cfg.simulado, zona, cupo,
  });
  const manejarReportes = crearManejadorReportes({ archivo: path.join(cfg.datos, 'reportes.jsonl') });

  const r = presupuesto?.resumen();
  const textoCupo = !clave ? '' : cupo ? `; cupo diario ${cupo.limites.preguntas} preguntas y ${cupo.limites.creaciones} creaciones por dispositivo${cupo.persistente ? '' : ' (en memoria)'}` : '; sin cupo diario';
  registro.info?.(`[servidor] Anato3D ${VERSION_SERVIDOR}: web en ${path.relative(process.cwd(), publico) || '.'}; Neuri ${clave
    ? `con IA (${modelo}${modeloLecciones !== modelo ? `; lecciones: ${modeloLecciones}` : ''}; ${presupuesto.disponible ? `tope ${nanoAUsd(r.dia.tope)} US$/día y ${nanoAUsd(r.mes.tope)} US$/mes` : `sin presupuesto (${presupuesto.motivo}): no llama a la IA`}${textoCupo}${cfg.simulado ? '; PROVEEDOR SIMULADO' : ''})`
    : 'sin clave: responde con el buscador'}; recursos ${man.ok ? 'comprobados' : 'no disponibles'}.`);

  const base = cfg.origen ?? null;
  async function api(req, res, manejar, max) {
    const body = req.method === 'POST' ? await leerCuerpoNode(req, max) : undefined;
    const respuesta = await manejar(peticionDeNode(req, res, body, { base: base ?? undefined }), { ip: ipDe(req, cfg) });
    await enviarRespuesta(respuesta, res);
  }

  const servidor = http.createServer(async (req, res) => {
    const inicio = Date.now();
    const ruta = (req.url ?? '/').split('?')[0];
    res.on('finish', () => registro.info?.(`[http] ${req.method} ${ruta.slice(0, 120)} ${res.statusCode} ${Date.now() - inicio} ms`));
    try {
      for (const [k, v] of Object.entries(SEGURIDAD)) res.setHeader(k, v);
      if (ruta === '/api/pet') return await api(req, res, manejarPet, CUERPO_PET);
      if (ruta === '/api/reportes') return await api(req, res, manejarReportes, CUERPO_REPORTES);
      if (ruta === '/salud') return responder(res, 200, { ok: true, version: VERSION_SERVIDOR });
      if (ruta.startsWith('/api/')) return responder(res, 404, { ok: false, error: 'no-existe' });
      return servirEstatico(req, res, publico, ruta);
    } catch (err) {
      registro.error?.(`[servidor] Error (${err?.codigo ?? err?.code ?? err?.name ?? 'error'}).`);
      if (res.headersSent) { if (!res.writableEnded) res.end(); return; }   // a mitad de un flujo: se corta sin añadir nada
      responder(res, 500, { ok: false, error: 'servidor' });
    }
  });
  // Las creaciones van en flujo varios minutos: sin plazo de petición (cada llamada a Claude tiene el suyo).
  servidor.requestTimeout = 0;
  servidor.headersTimeout = 30_000;
  servidor.keepAliveTimeout = 65_000;

  return {
    servidor, presupuesto, cupo, config: cfg, recursos: man,
    cerrar: () => new Promise((resolve) => {
      servidor.close(() => { presupuesto?.cerrar(); cupo?.cerrar(); resolve(); });
      servidor.closeIdleConnections?.();
      setTimeout(() => { servidor.closeAllConnections?.(); }, 10_000).unref();
    }),
  };
}

function responder(res, status, datos) {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.end(JSON.stringify(datos));
}

/** Un archivo de publico/ (nunca fuera de esa carpeta, sin listar carpetas), con su tipo, su caché y, si es texto, gzip. */
function servirEstatico(req, res, publico, ruta) {
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.statusCode = 405; res.setHeader('allow', 'GET, HEAD'); return res.end(); }
  let rel;
  try { rel = decodeURIComponent(ruta); } catch { res.statusCode = 400; return res.end(); }
  if (rel.includes('\0')) { res.statusCode = 400; return res.end(); }
  if (rel.endsWith('/')) rel += 'index.html';
  const archivo = path.resolve(publico, `.${rel}`);
  if (archivo !== publico && !archivo.startsWith(`${publico}${path.sep}`)) { res.statusCode = 404; return res.end(); }
  let st;
  try { st = fs.statSync(archivo); } catch { st = null; }
  // Una carpeta sin la barra final (/app): a la misma con barra (/app/), donde está su index.html. El destino se arma con
  // la ruta ya resuelta dentro de publico/ (nunca con lo que mandó el navegador: «//sitio» sería otro dominio).
  if (st?.isDirectory() && archivo !== publico && fs.existsSync(path.join(archivo, 'index.html'))) {
    const destino = `/${path.relative(publico, archivo).split(path.sep).map(encodeURIComponent).join('/')}/`;
    const consulta = (req.url ?? '').includes('?') ? (req.url ?? '').slice((req.url ?? '').indexOf('?')) : '';
    res.statusCode = 301;
    res.setHeader('location', destino + consulta);
    res.setHeader('cache-control', 'public, max-age=3600');
    return res.end();
  }
  if (!st?.isFile()) { res.statusCode = 404; res.setHeader('content-type', 'text/plain; charset=utf-8'); return res.end('No existe.'); }
  const tipo = TIPOS[path.extname(archivo).toLowerCase()] ?? 'application/octet-stream';
  res.setHeader('content-type', tipo);
  // Los archivos con huella en el nombre (assets/…-[hash].js) no cambian; el resto se revisa (index.html, siempre).
  res.setHeader('cache-control', rel.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : rel.endsWith('.html') ? 'no-cache' : 'public, max-age=3600');
  // Con su etiqueta (tamaño y fecha): el navegador pregunta si cambió y, si no, 304 sin volver a bajarlo (los modelos 3D
  // pesan decenas de MB: es lo que más cuesta en transferencia).
  const etiqueta = `"${st.size.toString(36)}-${Math.floor(st.mtimeMs).toString(36)}"`;
  res.setHeader('etag', etiqueta);
  res.setHeader('last-modified', st.mtime.toUTCString());
  res.setHeader('vary', 'accept-encoding');
  const tiene = String(req.headers['if-none-match'] ?? '').split(',').map((x) => x.trim().replace(/^W\//, ''));
  if (tiene.includes(etiqueta)) { res.statusCode = 304; return res.end(); }
  const gzip = COMPRIMIR.test(tipo) && st.size > 1024 && /\bgzip\b/.test(String(req.headers['accept-encoding'] ?? ''));
  if (gzip) res.setHeader('content-encoding', 'gzip'); else res.setHeader('content-length', st.size);
  res.statusCode = 200;
  if (req.method === 'HEAD') return res.end();
  const flujo = fs.createReadStream(archivo);
  flujo.on('error', () => res.destroy());
  if (gzip) flujo.pipe(zlib.createGzip()).pipe(res); else flujo.pipe(res);
}

// `node servidor.mjs` (o `node server/produccion.mjs --paquete <carpeta>`): arranca y escucha.
const esPrincipal = process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url));
if (esPrincipal) {
  const i = process.argv.indexOf('--paquete');
  const paquete = i > 0 ? process.argv[i + 1] : path.dirname(fileURLToPath(import.meta.url));
  let s;
  try { s = await crearServidor({ paquete }); } catch (err) {
    console.error(`[servidor] No arranca: ${err.message}`);
    process.exit(1);
  }
  s.servidor.listen(s.config.puerto, () => console.info(`[servidor] Escuchando en el puerto ${s.servidor.address().port}.`));
  const parar = async (senal) => {
    console.info(`[servidor] ${senal}: termina lo que está en marcha y se cierra.`);
    await s.cerrar();
    process.exit(0);
  };
  process.once('SIGTERM', () => parar('SIGTERM'));
  process.once('SIGINT', () => parar('SIGINT'));
}
