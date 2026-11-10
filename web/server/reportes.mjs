// Cola de reportes de problemas (especificación, sección 23): recibe los que envía la app (src/biblioteca/reportes.js)
// y los añade a un archivo JSONL que solo se revisa con scripts/reportes.mjs (no hay ninguna ruta para leerlos desde la
// web: la cola está protegida por el acceso a la máquina). No se guarda la dirección IP ni nada más que el reporte.
//
// En el servidor de desarrollo (npm run dev) el archivo es web/server/datos/reportes.jsonl (git no lo guarda). Al
// publicar la web hará falta un almacenamiento con permisos (base de datos o similar): ver docs/estudio/matriz-requisitos.md.
import fs from 'fs';
import path from 'path';
import { validarReporte } from '../src/biblioteca/reportes.js';
import { crearLimitador } from './pet.mjs';

export const MAX_CUERPO_REPORTE = 8 * 1024;

const json = (status, datos, cabeceras = {}) => new Response(JSON.stringify(datos), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...cabeceras } });

function mismoOrigen(request) {
  if (request.headers.get('sec-fetch-site') === 'cross-site') return false;
  const origen = request.headers.get('origin');
  if (!origen) return true;
  try { return new URL(origen).host === new URL(request.url).host; } catch { return false; }
}

/**
 * Manejador de /api/reportes. `archivo`: dónde se añaden (JSONL); `limitar(ip)`: límite por dirección (la IP solo se usa
 * en memoria para limitar, nunca se guarda). `escribir(archivo, linea)`: para las pruebas.
 */
export function crearManejadorReportes({
  archivo, ahora = Date.now,
  limitar = crearLimitador({ porIp: 20, ventanaIp: 3600_000, porHora: 500, ahora }),
  escribir = (f, linea) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.appendFileSync(f, linea, 'utf8'); },
} = {}) {
  const vistos = new Set();
  return async function manejar(request, { ip = '' } = {}) {
    if (request.method !== 'POST') return json(405, { ok: false, error: 'metodo' }, { allow: 'POST' });
    if (!mismoOrigen(request)) return json(403, { ok: false, error: 'origen' });
    const declarado = Number(request.headers.get('content-length') ?? 0);
    if (declarado > MAX_CUERPO_REPORTE) return json(413, { ok: false, error: 'largo' });
    const datos = await request.arrayBuffer();
    if (datos.byteLength > MAX_CUERPO_REPORTE) return json(413, { ok: false, error: 'largo' });
    let cuerpo;
    try { cuerpo = JSON.parse(new TextDecoder().decode(datos)); } catch { return json(400, { ok: false, error: 'formato' }); }
    const v = validarReporte(cuerpo);
    if (!v.ok) return json(400, { ok: false, error: v.error });
    if (vistos.has(v.reporte.id)) return json(409, { ok: true, repetido: true });
    const limite = limitar(ip);
    if (limite) return json(429, { ok: false, error: limite }, { 'retry-after': '600' });
    try {
      escribir(archivo, `${JSON.stringify({ ...v.reporte, recibido: new Date(ahora()).toISOString() })}\n`);
    } catch (err) {
      console.error('[reportes] No se pudo guardar el reporte:', err);
      return json(500, { ok: false, error: 'servidor' });
    }
    vistos.add(v.reporte.id);
    return json(201, { ok: true });
  };
}
