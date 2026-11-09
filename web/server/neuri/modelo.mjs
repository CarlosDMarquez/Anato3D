// Llamadas a Claude para Neuri: qué modelo (nunca Opus), cómo se pide (salida estructurada, caché, esfuerzo; en
// streaming las largas) y qué hacer con los errores (un código para la app, sin el texto de nadie).
import Anthropic from '@anthropic-ai/sdk';

// Decisión de Carlos (2026-11-09): nada de Opus en la app, que es caro (Opus solo para desarrollar). Por defecto,
// Claude Haiku 5.5; la otra opción, Claude Sonnet 5.5. Opus, Fable y Mythos no se aceptan aunque se configuren.
export const MODELO_POR_DEFECTO = 'claude-haiku-5-5';
const DEMASIADO_CAROS = /opus|fable|mythos/i;

/** El modelo que se usa de verdad: el pedido, salvo que esté vacío o sea de los caros. */
export function elegirModelo(pedido, registro = console) {
  const m = String(pedido ?? '').trim();
  if (!m) return MODELO_POR_DEFECTO;
  if (DEMASIADO_CAROS.test(m)) {
    registro.error?.(`[pet] «${m}» no se usa en Neuri (demasiado caro): se usa ${MODELO_POR_DEFECTO}.`);
    return MODELO_POR_DEFECTO;
  }
  return m;
}

// Respaldo del servidor si los filtros de seguridad rechazan una petición: Sonnet 5.5 lo admite; Haiku 5.5, no.
const CON_RESPALDO = new Set(['claude-sonnet-5-5']);

// Precios orientativos en dólares por millón de tokens (lista de Anthropic de oct. 2026), solo para el registro:
// [entrada, salida, caché leída, caché escrita (5 min)]. Haiku 5.5: en peticiones de hasta 100 000 tokens.
const PRECIOS = {
  'claude-haiku-5-5': [0.1, 0.5, 0.01, 0.125],
  'claude-sonnet-5-5': [2, 10, 0.2, 2.5],
};

/** Error de Neuri con un código para la app (sin-ia, ocupado, conexion, ia, rechazo, incompleta, formato, cancelada). */
export class ErrorNeuri extends Error {
  constructor(codigo, status = 502, detalle = '') {
    super(detalle || codigo);
    this.codigo = codigo;
    this.status = status;
  }
}

export function coste(modelo, u = {}) {
  const p = PRECIOS[modelo];
  if (!p) return null;
  return ((u.input_tokens ?? 0) * p[0] + (u.output_tokens ?? 0) * p[1] + (u.cache_read_input_tokens ?? 0) * p[2] + (u.cache_creation_input_tokens ?? 0) * p[3]) / 1e6;
}

/** Cliente de la API (o el que se pase, en las pruebas). */
export const crearCliente = (clave) => (clave ? new Anthropic({ apiKey: clave, maxRetries: 1, timeout: 120_000 }) : null);

/**
 * Pide a Claude una salida con el esquema dado y la devuelve ya leída: { datos, uso, modelo }.
 * `sistema`: [texto fijo (en caché), texto que cambia]. `flujo`: en streaming (respuestas largas).
 */
export async function llamar(api, { modelo, sistema, mensajes, esquema, esfuerzo = 'low', maxTokens = 2048, flujo = false, registro = console, etiqueta = '', signal = null }) {
  const params = {
    model: modelo,
    max_tokens: maxTokens,
    system: [
      { type: 'text', text: sistema[0], cache_control: { type: 'ephemeral' } },
      ...(sistema[1] ? [{ type: 'text', text: sistema[1] }] : []),
    ],
    messages: mensajes,
    output_config: { effort: esfuerzo, format: { type: 'json_schema', schema: esquema } },
  };
  // `signal`: si la persona cancela (cierra la conexión), la llamada se corta y no se sigue gastando.
  const opciones = signal ? { signal } : undefined;
  let resp;
  try {
    if (signal?.aborted) throw new ErrorNeuri('cancelada', 499);
    if (CON_RESPALDO.has(modelo)) {
      const p = { ...params, betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' };
      resp = flujo ? await api.beta.messages.stream(p, opciones).finalMessage() : await api.beta.messages.create(p, opciones);
    } else {
      resp = flujo ? await api.messages.stream(params, opciones).finalMessage() : await api.messages.create(params, opciones);
    }
  } catch (err) {
    throw clasificar(err, registro);
  }
  const u = resp.usage ?? {};
  const c = coste(modelo, u);
  registro.info?.(`[pet] ${etiqueta ? `${etiqueta} · ` : ''}${resp.model ?? modelo}: entrada ${u.input_tokens ?? 0}, caché leída ${u.cache_read_input_tokens ?? 0}, caché escrita ${u.cache_creation_input_tokens ?? 0}, salida ${u.output_tokens ?? 0}${c !== null ? ` (≈ ${c.toFixed(4)} US$)` : ''}`);
  if (resp.stop_reason === 'refusal') throw new ErrorNeuri('rechazo');
  if (resp.stop_reason === 'max_tokens') throw new ErrorNeuri('incompleta');
  const bloque = resp.content?.find((b) => b.type === 'text');
  let datos;
  try { datos = JSON.parse(bloque?.text ?? ''); } catch { throw new ErrorNeuri('formato'); }
  return { datos, uso: u, coste: c, modelo: resp.model ?? modelo };
}

/** Error del SDK → ErrorNeuri. Lo que no es de la API se relanza tal cual. */
function clasificar(err, registro) {
  if (err instanceof ErrorNeuri) return err;
  if (err instanceof Anthropic.APIUserAbortError || err?.name === 'AbortError') return new ErrorNeuri('cancelada', 499);
  if (err instanceof Anthropic.AuthenticationError || err instanceof Anthropic.PermissionDeniedError) {
    registro.error?.(`[pet] La API rechaza la clave (${err.status}): revisa ANTHROPIC_API_KEY en web/.env.local.`);
    return new ErrorNeuri('sin-ia', 503);
  }
  if (err instanceof Anthropic.RateLimitError) return new ErrorNeuri('ocupado', 429);
  if (err instanceof Anthropic.BadRequestError) {
    registro.error?.(`[pet] La API no acepta la petición (400): ${err.message}`);
    return new ErrorNeuri('ia', 502);
  }
  if (err instanceof Anthropic.APIConnectionError) {
    registro.error?.('[pet] Sin conexión con la API de Anthropic.');
    return new ErrorNeuri('conexion', 502);
  }
  if (err instanceof Anthropic.APIError) {
    registro.error?.(`[pet] Error de la API (${err.status ?? 'sin estado'}).`);
    return new ErrorNeuri('ia', 502);
  }
  return err;
}
