// El puente entre el servidor HTTP de Node y los manejadores estándar (Request → Response) de Neuri y de los reportes.
// Lo usan el servidor de desarrollo (server/vite-pet.mjs, dentro de Vite) y el de producción (server/produccion.mjs).

/**
 * La petición estándar (Request) de una de Node. `base`: el origen público con el que se construye la URL (detrás de un
 * proxy, el host que llega puede ser el interno); sin él, el `host` de la petición. Lleva una señal que se activa si la
 * app se va antes de recibir la respuesta (cancelar, «nueva conversación», cerrar la página): así el servidor no empieza
 * más llamadas a Claude en las peticiones cortas. Las creaciones con identificador no la usan: siguen hasta que se
 * cancelan (server/pet.mjs). Pasan todas las cabeceras, también «x-anato3d-dispositivo» (el cupo diario; el manejador la
 * comprueba y nunca la registra).
 */
export function peticionDeNode(req, res, body, { base = null } = {}) {
  const url = new URL(req.originalUrl ?? req.url, base ?? `http://${req.headers.host ?? 'localhost'}`);
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
export function leerCuerpoNode(req, max) {
  return new Promise((resolve, reject) => {
    const trozos = [];
    let total = 0;
    req.on('data', (c) => { if (total <= max) { trozos.push(c); total += c.length; } });
    req.on('end', () => resolve(Buffer.concat(trozos).subarray(0, max + 1)));
    req.on('error', reject);
  });
}
