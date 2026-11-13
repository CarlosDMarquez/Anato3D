// Llamadas a Claude para Neuri: qué modelo (nunca Opus), cómo se pide (salida estructurada, caché, esfuerzo; en
// streaming las largas), el tope de gasto (server/neuri/presupuesto.mjs: se reserva antes y se ajusta después) y qué
// hacer con los errores (un código para la app, sin el texto de nadie ni el mensaje crudo de la API).
import Anthropic from '@anthropic-ai/sdk';
import { ErrorPresupuesto, huellaFija } from './presupuesto.mjs';

// Decisión de Carlos (2026-11-09): nada de Opus en la app, que es caro (Opus solo para desarrollar). Por defecto,
// Claude Haiku 5.5. Claude Sonnet 5.5 solo si Carlos lo permite expresamente (ANATO3D_PERMITIR_SONNET=1). Cualquier otro
// nombre (Opus, Fable, Mythos o uno desconocido) se ignora y se usa Haiku 5.5: una lista exacta, no una lista de prohibidos.
export const MODELO_POR_DEFECTO = 'claude-haiku-5-5';
export const MODELOS_PERMITIDOS = ['claude-haiku-5-5', 'claude-sonnet-5-5'];

/** El modelo que se usa de verdad: Haiku 5.5, o Sonnet 5.5 si se pide y está permitido. */
export function elegirModelo(pedido, registro = console, { permitirSonnet = false } = {}) {
  const m = String(pedido ?? '').trim();
  if (!m || m === MODELO_POR_DEFECTO) return MODELO_POR_DEFECTO;
  if (m === 'claude-sonnet-5-5' && permitirSonnet) return m;
  registro.error?.(`[pet] «${m.slice(0, 40)}» no está permitido en Neuri${m === 'claude-sonnet-5-5' ? ' sin ANATO3D_PERMITIR_SONNET=1' : ''}: se usa ${MODELO_POR_DEFECTO}.`);
  return MODELO_POR_DEFECTO;
}

// Precios orientativos en dólares por millón de tokens (lista de Anthropic de nov. 2026), solo para el registro:
// [entrada, salida, caché leída, caché escrita (5 min)]. Haiku 5.5: en peticiones de hasta 100 000 tokens. El tope de
// gasto usa sus propias tarifas, en nanodólares y con el tramo alto (server/neuri/presupuesto.mjs).
const PRECIOS = {
  'claude-haiku-5-5': [0.1, 0.5, 0.01, 0.125],
  'claude-sonnet-5-5': [2, 10, 0.1, 2.5],
};

/**
 * Error de Neuri con un código para la app: sin-ia (sin clave o rechazada), sin-saldo, sin-presupuesto (el tope de gasto
 * de Anato3D: cero, agotado, apagado o sin almacén), ocupado, tiempo, conexion, ia, rechazo, incompleta, formato o
 * cancelada.
 */
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

/**
 * Cliente de la API (o el que se pase, en las pruebas). Sin reintentos del SDK: cada intento se reserva y se cuenta en el
 * tope de gasto, y un reintento invisible podría cobrarse dos veces sin pasar por él.
 */
export const crearCliente = (clave) => (clave ? new Anthropic({ apiKey: clave, maxRetries: 0, timeout: 120_000 }) : null);

/**
 * Pide a Claude una salida con el esquema dado y la devuelve ya leída: { datos, uso, modelo }.
 * `sistema`: [texto fijo (en caché), texto que cambia]. `flujo`: en streaming (respuestas largas).
 */
export async function llamar(api, { modelo, sistema, mensajes, esquema, esfuerzo = 'low', maxTokens = 2048, flujo = false, registro = console, etiqueta = '', signal = null, plazoMs = null, trabajo = null, presupuesto = null }) {
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
  // `signal`: si la persona cancela (o cierra la conexión) antes de enviar, no sale nada. Después:
  //  - en flujo (las largas: redactar), se corta: deja de generar y de gastar; el coste queda incierto (cuenta entero);
  //  - sin flujo (las cortas), la llamada termina: cortarla no ahorraría (la API ya la está procesando) y así se sabe lo
  //    que costó; la respuesta se descarta.
  // `plazoMs`: lo más que puede tardar la llamada (sin reintentos del SDK).
  const opciones = (flujo && signal) || plazoMs ? { ...(flujo && signal ? { signal } : {}), ...(plazoMs ? { timeout: plazoMs } : {}) } : undefined;
  if (signal?.aborted) throw new ErrorNeuri('cancelada', 499);
  // El tope de gasto: se reserva lo más que podría costar (lo que se envía, contado en bytes o con la cota calibrada de
  // la parte fija, y la salida máxima) antes de enviar nada. Si no cabe, no sale.
  let reserva = null;
  if (presupuesto) {
    try {
      const bytes = Buffer.byteLength(JSON.stringify(params));
      const bytesResto = bytes - Buffer.byteLength(JSON.stringify(sistema[0]));
      reserva = presupuesto.reservar({ modelo, bytes, bytesResto, huella: huellaFija(modelo, sistema[0]), maxTokens, etiqueta, trabajo });
    } catch (err) {
      if (err instanceof ErrorPresupuesto) {
        registro.info?.(`[pet] ${etiqueta ? `${etiqueta} · ` : ''}no se llama a la IA: ${err.codigo}.`);
        throw new ErrorNeuri('sin-presupuesto', 503, err.codigo);
      }
      throw err;
    }
  }
  let resp;
  const inicio = Date.now();
  try {
    // Sin respaldo del proveedor (`fallbacks`): otro modelo saltaría la lista permitida y el tope.
    resp = flujo ? await api.messages.stream(params, opciones).finalMessage() : await api.messages.create(params, opciones);
  } catch (err) {
    // Solo una petición que la API rechazó sin procesarla (un 4xx) seguro que no costó; lo demás (un corte, un 5xx, un
    // plazo, una cancelación a mitad) queda incierto y cuenta entero.
    const sinCoste = err instanceof Anthropic.APIError && err.status >= 400 && err.status < 500 && err.status !== 408;
    if (reserva) {
      if (sinCoste) presupuesto.liberar(reserva);
      else presupuesto.incierta(reserva);
    }
    const e = clasificar(err, registro);
    // `cobrada`: salió y pudo costar (el tope la cuenta entera): el cupo diario tampoco la devuelve (server/pet.mjs).
    if (!sinCoste && e && typeof e === 'object') e.cobrada = true;
    throw e;
  }
  const u = resp.usage ?? {};
  // El ajuste, con el `usage` de la respuesta (también si luego no sirve: rechazo, truncada o formato malo).
  if (reserva) presupuesto.conciliar(reserva, resp.usage);
  // Los errores a partir de aquí llegan con una respuesta ya hecha (y pagada): `respondio` (el cupo diario la cuenta).
  // Antes, con `cobrada` (arriba): la que salió sin respuesta pero el tope cuenta entera. Ninguna de las dos: no se cobró.
  const tras = (codigo, status) => Object.assign(new ErrorNeuri(codigo, status), { respondio: true });
  if (signal?.aborted) throw tras('cancelada', 499);
  const c = coste(modelo, u);
  // El registro técnico: modo, modelo, tokens, coste aproximado, duración y el trabajo al que pertenece; nunca lo que se
  // escribe ni lo que responde.
  registro.info?.(`[pet] ${etiqueta ? `${etiqueta} · ` : ''}${resp.model ?? modelo}: entrada ${u.input_tokens ?? 0}, caché leída ${u.cache_read_input_tokens ?? 0}, caché escrita ${u.cache_creation_input_tokens ?? 0}, salida ${u.output_tokens ?? 0}${c !== null ? ` (≈ ${c.toFixed(4)} US$)` : ''} · ${((Date.now() - inicio) / 1000).toFixed(1)} s${trabajo ? ` · trabajo ${trabajo}` : ''}`);
  if (resp.stop_reason === 'refusal') throw tras('rechazo');
  if (resp.stop_reason === 'max_tokens') throw tras('incompleta');
  const bloque = resp.content?.find((b) => b.type === 'text');
  let datos;
  try { datos = JSON.parse(bloque?.text ?? ''); } catch { throw tras('formato'); }
  // Siempre un objeto (el esquema lo pide): un texto o una lista sueltos tampoco sirven.
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) throw tras('formato');
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
  // Sin saldo en la cuenta: no se reintenta (la app lo dice y usa el buscador).
  if (err instanceof Anthropic.APIError && /credit balance|billing|insufficient.*(credit|funds)/i.test(err.message ?? '')) {
    registro.error?.('[pet] La cuenta de Anthropic no tiene saldo: Neuri responde con el buscador.');
    return new ErrorNeuri('sin-saldo', 503);
  }
  if (err instanceof Anthropic.BadRequestError) {
    registro.error?.('[pet] La API no acepta la petición (400).');   // sin el mensaje de la API: podría repetir lo enviado
    return new ErrorNeuri('ia', 502);
  }
  if (err instanceof Anthropic.APIConnectionTimeoutError) {
    registro.error?.('[pet] La API de Anthropic tardó demasiado.');
    return new ErrorNeuri('tiempo', 504);
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
