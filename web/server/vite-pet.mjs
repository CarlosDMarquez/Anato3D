// Monta el servidor de Neuri (server/pet.mjs) en /api/pet dentro de `npm run dev` y `npm run preview`.
// La clave se lee de web/.env.local (ANTHROPIC_API_KEY), que git no guarda; sin clave, Neuri responde con el buscador.
// El tope de gasto (ANATO3D_TOPE_DIARIO_USD y ANATO3D_TOPE_MENSUAL_USD): sin él, tampoco llama a la IA aunque haya clave
// (server/neuri/presupuesto.mjs). Opcional: ANATO3D_PET_MODELO (conversación) y ANATO3D_PET_MODELO_LECCIONES (planificar,
// redactar y adaptar); por defecto, claude-haiku-5-5 para todo; Sonnet 5.5 solo con ANATO3D_PERMITIR_SONNET=1. Opus no se
// usa: es caro (ver server/neuri/modelo.mjs). El cupo diario por dispositivo (ANATO3D_CUPO…, server/neuri/cupo.mjs) va en
// la misma carpeta que el tope; ANATO3D_CUPO=0 lo apaga (para probar sin contar).
import fs from 'node:fs';
import path from 'node:path';
import { loadEnv } from 'vite';
import { crearManejador, elegirModelo } from './pet.mjs';
import { presupuestoDesdeEntorno, nanoAUsd } from './neuri/presupuesto.mjs';
import { cupoDesdeEntorno } from './neuri/cupo.mjs';
import { cargarRecursos } from './neuri/recursos.mjs';
import { crearManejadorReportes } from './reportes.mjs';
import { peticionDeNode, enviarRespuesta, leerCuerpoNode as leer } from './nodo.mjs';

// (El puente con Node está en server/nodo.mjs, compartido con el servidor de producción; se reexporta para las pruebas.)
export { peticionDeNode, enviarRespuesta };

export function petApi() {
  let raiz = process.cwd();
  let modo = 'development';
  let manejar = null;
  let firma = '';
  let recursos = null;
  // El tope de gasto: uno por proceso (tiene un cerrojo).
  let presupuesto = null;
  let firmaPresupuesto = null;
  let presupuestoDesde = 0;
  // El cupo diario: se rehace con el presupuesto (misma carpeta, mismo cerrojo por proceso).
  let cupo = null;

  // Se prepara la primera vez que se usa y se rehace si cambian el catálogo, la clave o el modelo (sin reiniciar).
  function preparar() {
    const archivo = path.join(raiz, 'src/biblioteca/generado/catalogo.json');
    const env = { ...loadEnv(modo, raiz, ''), ...process.env };
    const clave = env.ANTHROPIC_API_KEY?.trim() || null;
    const permitirSonnet = env.ANATO3D_PERMITIR_SONNET?.trim() === '1';
    const modelo = elegirModelo(env.ANATO3D_PET_MODELO, console, { permitirSonnet });
    const modeloLecciones = elegirModelo(env.ANATO3D_PET_MODELO_LECCIONES || modelo, console, { permitirSonnet });
    // El presupuesto, solo con clave (sin ella no hay nada que limitar). Se rehace si cambia su configuración, o cada
    // 30 s mientras otro proceso tenga el suyo (por si ese termina).
    const fp = clave ? ['ANATO3D_TOPE_DIARIO_USD', 'ANATO3D_TOPE_MENSUAL_USD', 'ANATO3D_PRESUPUESTO_ZONA', 'ANATO3D_DATOS', 'ANATO3D_CUPO', 'ANATO3D_CUPO_PREGUNTAS', 'ANATO3D_CUPO_CREACIONES', 'ANATO3D_CUPO_IP'].map((k) => env[k] ?? '').join('|') : null;
    let otroTope = false;
    if (fp !== firmaPresupuesto || (presupuesto?.motivo === 'otro-proceso' && Date.now() - presupuestoDesde > 30_000)) {
      // El nuevo antes de soltar el viejo: si es el mismo archivo, comparten estado (y las llamadas en curso, su reserva).
      const viejo = presupuesto;
      const cupoViejo = cupo;
      presupuesto = fp === null ? null : presupuestoDesdeEntorno(env, { raiz });
      cupo = fp === null ? null : cupoDesdeEntorno(env, { dir: env.ANATO3D_DATOS?.trim() || path.join(raiz, '../build/servidor'), zona: presupuesto.resumen().zona });
      viejo?.cerrar();
      cupoViejo?.cerrar();
      firmaPresupuesto = fp;
      presupuestoDesde = Date.now();
      otroTope = true;
    }
    const mtime = fs.statSync(archivo).mtimeMs;
    const nueva = `${mtime}|${clave ? clave.length : 0}|${clave?.slice(-4) ?? ''}|${modelo}|${modeloLecciones}|${permitirSonnet}`;
    if (manejar && nueva === firma && !otroTope) return manejar;
    const catalogo = JSON.parse(fs.readFileSync(archivo, 'utf8'));
    // Los recursos (inventario, evidencias, lecciones) se cargan una vez y se rehacen si cambia el catálogo.
    if (!recursos || !firma.startsWith(`${mtime}|`)) {
      let promesa = null;
      recursos = () => (promesa ??= cargarRecursos({ raiz }));
    }
    manejar = crearManejador({ catalogo, clave, modelo, modeloLecciones, recursos, presupuesto, permitirSonnet, zona: presupuesto?.resumen().zona ?? 'America/Tijuana', cupo });
    firma = nueva;
    const r = presupuesto?.resumen();
    const tope = presupuesto?.disponible ? `tope ${nanoAUsd(r.dia.tope)} US$/día y ${nanoAUsd(r.mes.tope)} US$/mes` : `sin presupuesto (${presupuesto?.motivo ?? 'sin-presupuesto'}): no llama a la IA`;
    const textoCupo = cupo ? `; cupo diario ${cupo.limites.preguntas} preguntas y ${cupo.limites.creaciones} creaciones por dispositivo` : '; sin cupo diario';
    console.info(`[pet] Neuri ${clave ? `con IA (${modelo}${modeloLecciones !== modelo ? `; lecciones: ${modeloLecciones}` : ''}; ${tope}${textoCupo})` : 'sin clave de API: responde con el buscador'}.`);
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
      console.error(`[reportes] Error del servidor (${err?.code ?? err?.name ?? 'error'}).`);
      if (!res.headersSent) { res.statusCode = 500; res.setHeader('content-type', 'application/json; charset=utf-8'); res.end('{"ok":false,"error":"servidor"}'); }
    }
  }

  async function middleware(req, res) {
    try {
      const body = req.method === 'POST' ? await leer(req, 300 * 1024) : undefined;
      const respuesta = await preparar()(peticionDeNode(req, res, body), { ip: req.socket?.remoteAddress ?? '' });
      await enviarRespuesta(respuesta, res);
    } catch (err) {
      console.error(`[pet] Error del servidor (${err?.codigo ?? err?.code ?? err?.name ?? 'error'}).`);
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
