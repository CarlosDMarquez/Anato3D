// Cloudflare Worker: la web estática desde Cloudflare (transferencia gratis) y la API desde el servidor de Fly. Es para
// cuando haya muchos estudiantes (docs/estudio/despliegue.md); en el piloto no hace falta: todo va en Fly.
// Plantilla SIN PROBAR en Cloudflare (no se ha abierto ninguna cuenta); su lógica sí tiene prueba (tests/produccion.test.mjs).
//
// La web (publico/ del paquete) la sirve Workers Static Assets sin pasar por este código, que solo recibe /api/* y lo
// reenvía al servidor en flujo (las creaciones llegan línea a línea). Añade dos cabeceras que el servidor solo cree con
// el secreto compartido; si el navegador manda otras con esos nombres, se sustituyen:
//   x-anato3d-proxy  el secreto (ANATO3D_PROXY_SECRETO: secreto del Worker y del servidor, el mismo);
//   x-anato3d-ip     la dirección del cliente que ve Cloudflare, para los límites de uso por dirección.
// En el servidor: ANATO3D_IP_DE=x-anato3d-ip, el mismo ANATO3D_PROXY_SECRETO y ANATO3D_ORIGEN=<el origen del Worker>.
// Las demás cabeceras del navegador pasan tal cual; entre ellas «x-anato3d-dispositivo», la del cupo diario por
// dispositivo (server/neuri/cupo.mjs): sin ella, el servidor contaría por la IP.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
    if (!env.ANATO3D_API || !env.ANATO3D_PROXY_SECRETO) {
      return new Response('{"ok":false,"error":"configuracion"}', { status: 503, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
    }
    const cabeceras = new Headers(request.headers);
    cabeceras.delete('host');   // el del servidor sale de la URL de destino
    cabeceras.set('x-anato3d-proxy', env.ANATO3D_PROXY_SECRETO);
    cabeceras.set('x-anato3d-ip', request.headers.get('cf-connecting-ip') ?? '');
    const cuerpo = request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body;
    return fetch(new URL(url.pathname + url.search, env.ANATO3D_API), { method: request.method, headers: cabeceras, body: cuerpo, redirect: 'manual' });
  },
};
