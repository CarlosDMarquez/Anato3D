// Eventos de uso (especificación, secciones 21 y 22), solo si la persona activa las estadísticas (desactivadas por
// defecto). Sin DOM: lo prueba `npm test`.
//
//  - Cada evento: { v, id, tipo, fecha, sesion, actor, props }. `actor` es un identificador aleatorio de este navegador
//    (seudónimo: no identifica a nadie por sí solo, pero no es anonimato absoluto); `sesion`, uno por pestaña.
//  - Solo tipos y propiedades de una lista cerrada, con valores de forma controlada (identificadores, códigos, números):
//    nunca texto libre, ni lo que se escribe a Neuri, ni el temario, ni títulos de lecciones propias, ni nombres.
//  - Se guardan en este navegador (los últimos MAX_EVENTOS). Anato3D aún no tiene servidor de estadísticas: no se
//    envían a ningún sitio. `lote()` prepara el envío para cuando lo haya (con su URL configurada y el consentimiento).
//  - Un fallo al registrar nunca rompe nada, y rechazar las estadísticas no cambia nada del estudio.
import { nuevoId } from '../pet/red.js';

export const CLAVE_EVENTOS = 'anato3d.eventos';
export const CLAVE_PRIVACIDAD = 'anato3d.privacidad';
export const CLAVE_INVITADO = 'anato3d.invitado';
export const VERSION_EVENTOS = 1;
export const MAX_EVENTOS = 300;
const VENTANA_DUPLICADO = 10 * 60 * 1000;

const ID = /^[a-z0-9][a-z0-9:_./-]{0,80}$/i;
const CODIGO = /^[a-z][a-z0-9-]{0,40}$/;
const esId = (x) => typeof x === 'string' && ID.test(x);
const esCodigo = (x) => typeof x === 'string' && CODIGO.test(x);
const esNum = (x) => Number.isFinite(x) && x >= 0 && x < 1e9;
const esBool = (x) => typeof x === 'boolean';
const esVersion = (x) => (typeof x === 'string' && /^[\w.:-]{1,40}$/.test(x)) || esNum(x);
const lista = (f) => (x) => Array.isArray(x) && x.length <= 20 && x.every(f);

/** Tipos permitidos y la forma de cada propiedad. */
export const TIPOS = {
  leccion_iniciada: { leccion: esId, version: esVersion, propia: esBool },
  leccion_retomada: { leccion: esId, version: esVersion, paso: esNum, propia: esBool },
  leccion_completada: { leccion: esId, version: esVersion, segundosActivos: esNum, propia: esBool },
  actividad_respondida: { leccion: esId, version: esVersion, tipo: esCodigo, resultado: esCodigo, modo: esCodigo, escrita: esBool },
  evaluacion_terminada: { leccion: esId, version: esVersion, aciertos: esNum, total: esNum, demostrada: esBool },
  repaso_realizado: { modo: esCodigo, aciertos: esNum, total: esNum },
  busqueda_sin_resultados: { filtros: lista(esCodigo), conTexto: esBool },
  generacion_solicitada: { accion: esCodigo },
  generacion_cancelada: { etapa: esCodigo },
  generacion_fallida: { codigo: esCodigo, etapa: esCodigo },
  generacion_completada: { segundos: esNum, guardada: esBool },
  leccion_personal_abierta: {},
  problema_reportado: { categoria: esCodigo, vista: esCodigo },
  error_tecnico: { codigo: esCodigo, donde: esCodigo },
};

/** Solo las propiedades permitidas de ese tipo y con la forma esperada (lo demás se descarta). */
export function limpiarProps(tipo, props = {}) {
  const forma = TIPOS[tipo];
  if (!forma) return null;
  const out = {};
  for (const [k, ok] of Object.entries(forma)) if (props[k] !== undefined && ok(props[k])) out[k] = props[k];
  return out;
}

const leer = (almacen, clave, defecto) => { try { const v = almacen?.getItem(clave); return v == null ? defecto : JSON.parse(v); } catch { return defecto; } };
const escribir = (almacen, clave, valor) => { try { almacen?.setItem(clave, JSON.stringify(valor)); return true; } catch { return false; } };

/**
 * El registro de eventos de este navegador. `almacen`: localStorage; `ahora`; `sesion`: id de la pestaña.
 */
export function crearRegistroEventos({ almacen = null, ahora = Date.now, sesion = nuevoId(), id = nuevoId } = {}) {
  const privacidad = () => leer(almacen, CLAVE_PRIVACIDAD, null);
  const activado = () => privacidad()?.analitica === true;
  /** El seudónimo de este navegador (se crea la primera vez que hace falta: al activar las estadísticas). */
  function actor() {
    let a = null;
    try { a = almacen?.getItem(CLAVE_INVITADO); } catch { a = null; }
    if (a && /^[a-z0-9-]{16,64}$/.test(a)) return a;
    a = id();
    try { almacen?.setItem(CLAVE_INVITADO, a); } catch { /* sin almacenamiento */ }
    return a;
  }
  const eventos = () => { const d = leer(almacen, CLAVE_EVENTOS, []); return Array.isArray(d) ? d.filter((e) => e && TIPOS[e.tipo]) : []; };

  return {
    activado,
    /** Activa o desactiva las estadísticas. Al desactivarlas se borran las guardadas. */
    fijar(analitica) {
      escribir(almacen, CLAVE_PRIVACIDAD, { analitica: !!analitica, fecha: new Date(ahora()).toISOString(), version: VERSION_EVENTOS });
      if (analitica) actor();
      // Al desactivarlas se borran los eventos y el seudónimo: si se vuelven a activar, no se enlaza con lo anterior.
      else { try { almacen?.removeItem?.(CLAVE_EVENTOS); almacen?.removeItem?.(CLAVE_INVITADO); } catch { /* nada */ } }
    },
    /** ¿Ya decidió la persona? (para no preguntar más). */
    decidido: () => privacidad() != null,
    /**
     * Registra un evento si las estadísticas están activadas. `clave`: para no duplicar un reintento (el mismo tipo y
     * clave en VENTANA_DUPLICADO cuenta una vez). Devuelve el evento o null. Nunca lanza.
     */
    registrar(tipo, props = {}, { clave = null } = {}) {
      try {
        if (!activado() || !TIPOS[tipo]) return null;
        const lista = eventos();
        const t = ahora();
        if (clave && lista.some((e) => e.tipo === tipo && e.clave === clave && t - Date.parse(e.fecha) < VENTANA_DUPLICADO)) return null;
        const e = { v: VERSION_EVENTOS, id: id(), tipo, fecha: new Date(t).toISOString(), sesion, actor: actor(), props: limpiarProps(tipo, props), ...(clave ? { clave: String(clave).slice(0, 100) } : {}) };
        escribir(almacen, CLAVE_EVENTOS, [...lista, e].slice(-MAX_EVENTOS));
        return e;
      } catch { return null; }
    },
    eventos,
    borrar() { try { almacen?.removeItem?.(CLAVE_EVENTOS); return true; } catch { return false; } },
    /** El lote que se enviaría (sin la clave de duplicados, que es interna). */
    lote: () => eventos().map(({ clave, ...e }) => e),
  };
}

/**
 * Tiempo activo: cuenta solo mientras la página se ve y hubo actividad (teclado, ratón, toque) en el último minuto.
 * Una pestaña abierta no es estudio. `ahora`: el reloj. Sin DOM: la vista llama a `actividad()` y `visible(v)`.
 */
export function crearCronometro({ ahora = Date.now, inactividadMs = 60_000 } = {}) {
  let total = 0;
  let desde = ahora();
  let ultima = desde;
  let veo = true;
  const acumular = () => {
    const t = ahora();
    if (veo) total += Math.max(0, Math.min(t, ultima + inactividadMs) - desde);
    desde = t;
  };
  return {
    actividad() { acumular(); ultima = ahora(); },
    visible(v) { acumular(); veo = !!v; if (veo) ultima = ahora(); },
    segundos() { acumular(); return Math.round(total / 1000); },
  };
}
