// Peticiones de la app a Neuri (/api/pet) con plazos que cubren toda la respuesta, no solo su llegada: si llegan las
// cabeceras pero el cuerpo se detiene, la petición termina igual por plazo y los controles se liberan. Sin DOM: lo
// prueba `npm test`.

/** Por qué se cortó una petición: 'cancelada' (la persona), 'tiempo' (plazo) o null. */
export const motivo = (control) => control?.motivo ?? null;

/** Corta una petición por un motivo (la cancelación manda sobre el plazo). */
export function cortar(control, por) {
  if (!control || control.signal.aborted) return;
  control.motivo = por;
  control.abort();
}

/** Error que rechaza en cuanto se corta la petición, con el motivo en `err.motivo`. */
function alCortar(control) {
  const p = new Promise((_, rechazar) => {
    const fin = () => rechazar(Object.assign(new Error(motivo(control) ?? 'cortada'), { name: 'AbortError', motivo: motivo(control) ?? 'cancelada' }));
    if (control.signal.aborted) fin();
    else control.signal.addEventListener('abort', fin, { once: true });
  });
  p.catch(() => {});
  return p;
}

/**
 * Una petición que devuelve JSON. El plazo cubre la llegada y la lectura del cuerpo. Devuelve { r, d } (d: el JSON o
 * null si no lo era). Si se corta, rechaza con `err.motivo` ('tiempo' o 'cancelada').
 */
export async function pedirJSON(fetch, url, opciones, ms, control = new AbortController()) {
  const reloj = setTimeout(() => cortar(control, 'tiempo'), ms);
  const corte = alCortar(control);
  try {
    const r = await Promise.race([fetch(url, { ...opciones, signal: control.signal }), corte]);
    const texto = await Promise.race([r.text(), corte]);
    let d = null;
    try { d = JSON.parse(texto); } catch { /* no es JSON */ }
    return { r, d };
  } finally { clearTimeout(reloj); }
}

/**
 * Lee una respuesta en flujo (NDJSON) y llama a `alEvento(evento)` con cada línea. Si pasan `inactividadMs` sin nada
 * (ni los latidos del servidor), se corta con motivo 'tiempo'. Las líneas rotas se ignoran.
 */
export async function leerFlujo(respuesta, alEvento, { control, inactividadMs = 60_000 } = {}) {
  const corte = alCortar(control);
  let reloj = null;
  const vigilar = () => { clearTimeout(reloj); reloj = setTimeout(() => cortar(control, 'tiempo'), inactividadMs); };
  vigilar();
  try {
    const lector = respuesta.body?.getReader?.();
    if (!lector) {
      const texto = await Promise.race([respuesta.text(), corte]);
      for (const l of texto.split('\n')) if (l.trim()) { try { alEvento(JSON.parse(l)); } catch { /* línea rota */ } }
      return;
    }
    const dec = new TextDecoder();
    let resto = '';
    for (;;) {
      const { done, value } = await Promise.race([lector.read(), corte]);
      vigilar();
      if (value) resto += dec.decode(value, { stream: !done });
      let i;
      while ((i = resto.indexOf('\n')) >= 0) {
        const l = resto.slice(0, i).trim();
        resto = resto.slice(i + 1);
        if (l) { try { alEvento(JSON.parse(l)); } catch { /* línea rota */ } }
      }
      if (done) break;
    }
    if (resto.trim()) { try { alEvento(JSON.parse(resto)); } catch { /* nada */ } }
  } finally {
    clearTimeout(reloj);
  }
}

/** El JSON del cuerpo de una respuesta ya recibida, con plazo: null si no llega a tiempo o no es JSON. */
export async function leerJSON(respuesta, ms = 10_000) {
  let reloj = null;
  try {
    const plazo = new Promise((_, rechazar) => { reloj = setTimeout(() => rechazar(new Error('tiempo')), ms); });
    return JSON.parse(await Promise.race([respuesta.text(), plazo]));
  } catch { return null; } finally { clearTimeout(reloj); }
}

/** Identificador aleatorio (para peticiones y trabajos). */
export function nuevoId() {
  try { if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID(); } catch { /* sin crypto */ }
  const h = () => Math.floor(Math.random() * 0x10000).toString(16).padStart(4, '0');
  return `${h()}${h()}-${h()}-4${h().slice(1)}-a${h().slice(1)}-${h()}${h()}${h()}`;
}
