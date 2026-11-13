// Recorridos personales (especificación, sección 14): «Para peticiones extensas, crea un recorrido dividido en unidades
// y desarrolla bloques manejables. Cada unidad disponible debe estar completa; el resto debe figurar con su estado
// real.» Cuando lo que se pide no cabe en una lección («Créame un curso del miembro superior»), Neuri planifica un
// recorrido de unidades (server/pet.mjs, planificarRecorrido) y cada unidad se crea aparte, como cualquier lección de
// Neuri (src/pet/trabajos.js): plan → fuentes → redacción → comprobación → guardado en «Mis lecciones». Sin DOM: lo
// prueba `npm test`.
//
// Gasto bajo control: las unidades se crean de una en una y cuando la persona lo decide (una concreta, la siguiente o
// «todas», que van en cola, una detrás de otra y nunca en paralelo). La cola solo crea las unidades que nunca se
// intentaron, se para ante cualquier final que no sea «guardada» (un error, una cancelación, «Mis lecciones» llena…) y
// no reintenta sola lo que falló: eso lo decide la persona.
//
// El estado de cada unidad no se guarda: se deduce de su lección y de su trabajo, así que siempre es el real
// (ESTADOS_UNIDAD en protocolo.js):
//   lista        su lección está en «Mis lecciones» (validada y guardada)
//   preparando   su trabajo está en curso, con su etapa real
//   sin-guardar  validada, pero el navegador no la pudo guardar (se puede volver a guardar o descargar)
//   error        no se pudo crear (con su código)
//   interrumpida el servidor ya no tiene su trabajo (tras recargar la página más de media hora después…); volver a
//                crearla puede costar otra vez, así que la persona lo confirma (crearUnidad(…, { confirmado: true }))
//   detenida     en pausa, sin fallo: la cuota de creaciones por hora (`motivo: 'cuota'`, con la hora a la que se puede
//                seguir), el cupo diario de creaciones de este dispositivo (`motivo: 'cupo'`, hasta su renovación) o
//                el tope de gasto (`motivo: 'presupuesto'`); el servidor no gastó nada en ella
//   pendiente    nada creado ni en marcha (también tras cancelarla o quitar su lección de «Mis lecciones»)
//
// La cola no se para por una pausa: espera (`pausa: { motivo, hasta }`) y sigue sola a la hora que dijo el servidor
// (mientras la página esté abierta; si no, al volver), empezando por la unidad detenida. Las unidades listas se pueden
// estudiar mientras tanto. Al servidor y a Neuri, una unidad detenida se cuenta como pendiente.
//
// Se guarda en localStorage (CLAVE_RECORRIDOS) con formato versionado: { formato, version, recorridos }. Lo que no se
// puede leer (dañado o de una versión más nueva) se aparta tal cual antes de escribir (CLAVE_RECORRIDOS_APARTADOS); si
// no se puede apartar, no se escribe. Quitar un recorrido no borra sus lecciones: siguen en «Mis lecciones» (borrarlas
// es otra decisión de la persona, aparte y con confirmación).
import { LIMITES, ID_RECORRIDO, ID_TRABAJO, ID_PROPIA, limpiarRecorrido } from './protocolo.js';
import { pedirJSON, cortar, motivo, nuevoId } from './red.js';
import { FINALES, PAUSAS } from './trabajos.js';

export const CLAVE_RECORRIDOS = 'anato3d.recorridos';
export const CLAVE_RECORRIDOS_APARTADOS = 'anato3d.recorridos.apartados';
export const FORMATO_RECORRIDOS = 'anato3d.recorridos';
export const VERSION_RECORRIDOS = 1;
export const MAX_RECORRIDOS = 12;
/** Estado de la última planificación de un recorrido (sus unidades, si las tiene, se pueden crear en cualquiera salvo «planificando»). */
export const ESTADOS_RECORRIDO = ['planificando', 'listo', 'aclaracion', 'limitacion', 'error', 'interrumpido'];
export const PLAZOS_RECORRIDO = { planificar: 150_000 };
const MAX_APARTADOS = 30;
const ID_UNIDAD = /^u[a-z0-9]{6,20}$/;
const JSON_H = { 'content-type': 'application/json', accept: 'application/json' };
const texto = (s, max) => (typeof s === 'string' ? s.replace(/\s+/g, ' ').trim().slice(0, max) : '');
const idUnidad = () => `u${nuevoId().replace(/[^a-z0-9]/g, '').slice(0, 12)}`;
/** Al servidor (y a Neuri), una unidad en pausa es una pendiente: su protocolo no tiene más estados. */
const paraServidor = (e) => (e === 'detenida' ? 'pendiente' : e);

/**
 * `comun()`: lo que va en toda petición ({ v, idioma, progreso, propias, recorridos, contexto }); `historial()`: los
 * turnos de la conversación (para planificar el recorrido con su contexto); `trabajos`: las creaciones
 * (src/pet/trabajos.js); `existeLeccion(id)`: si una lección está en «Mis lecciones»; `espacio()`: cuántas lecciones
 * caben aún en «Mis lecciones» (contando las que se están preparando); `alIniciar(trabajo, recorrido, unidad)`: cada
 * unidad que empieza (para las estadísticas). `ahora` y `plazos`: el reloj y los plazos (las pruebas los cambian).
 */
export function crearRecorridos({
  fetch = globalThis.fetch?.bind(globalThis), url = '/api/pet', almacen = null, comun, historial = () => [], trabajos,
  existeLeccion = () => false, espacio = () => Infinity, alIniciar = null, ahora = Date.now, plazos = PLAZOS_RECORRIDO,
  programar = (fn, ms) => setTimeout(fn, ms), alCupo = null,
}) {
  let { lista, apartar: porApartar } = leer(almacen);
  const oyentes = new Set();
  const planificando = new Map();     // id → AbortController de la planificación en curso en esta pestaña
  const relojes = new Map();          // id → hora (ms) a la que está programado seguir una cola en pausa

  const avisar = (R) => { for (const fn of oyentes) { try { fn(R); } catch { /* un oyente roto no para nada */ } } };
  const buscar = (id) => lista.find((R) => R.id === id) ?? null;

  /** Escribe la lista; antes, aparta lo que no se pudo leer. Si no se puede apartar, no escribe (no se pierde nada). */
  function guardar() {
    if (!almacen) return false;
    if (porApartar.length) {
      if (!apartarTextos(almacen, porApartar, ahora)) return false;
      porApartar = [];
    }
    try { almacen.setItem(CLAVE_RECORRIDOS, JSON.stringify({ formato: FORMATO_RECORRIDOS, version: VERSION_RECORRIDOS, recorridos: lista })); return true; } catch { return false; }
  }
  function tocar(R, cambios = {}) {
    Object.assign(R, cambios, { actualizado: ahora() });
    guardar();
    avisar(R);
  }

  /** El estado de la planificación: «planificando» solo si esta pestaña la está haciendo (si se cortó, interrumpido). */
  const estadoRecorrido = (R) => (planificando.has(R.id) ? 'planificando' : R.estado === 'planificando' ? 'interrumpido' : R.estado);

  /** El estado real de una unidad, deducido de su lección y de su trabajo: { estado, leccion?, trabajo?, codigo?, motivo? }. */
  function estadoUnidad(u) {
    if (u.leccion && existeLeccion(u.leccion)) return { estado: 'lista', leccion: u.leccion, trabajo: u.trabajo ? trabajos.buscar(u.trabajo) : null };
    const t = u.trabajo ? trabajos.buscar(u.trabajo) : null;
    if (t) {
      if (!FINALES.includes(t.estado)) return { estado: 'preparando', trabajo: t };
      if (t.estado === 'guardada') {
        // Guardada, pero su lección ya no está en «Mis lecciones» (la persona la quitó): pendiente otra vez.
        return t.leccionId && existeLeccion(t.leccionId) ? { estado: 'lista', leccion: t.leccionId, trabajo: t } : { estado: 'pendiente', motivo: 'quitada', trabajo: t };
      }
      if (t.estado === 'no-guardada') return { estado: 'sin-guardar', trabajo: t, codigo: t.error ?? 'almacenamiento' };
      if (t.estado === 'interrumpida') return { estado: 'interrumpida', trabajo: t, codigo: 'interrumpida' };
      if (t.estado === 'error' && t.error === 'cancelada') return { estado: 'pendiente', motivo: 'cancelada', trabajo: t };
      // Cuota de creaciones o tope de gasto: en pausa, no es un fallo.
      // (Motivos: 'cuota' por hora, 'cupo' diario de este dispositivo —sigue al renovarse— o 'presupuesto'.)
      if (t.estado === 'error' && PAUSAS.includes(t.error)) return { estado: 'detenida', motivo: t.error === 'sin-presupuesto' ? 'presupuesto' : t.error === 'cupo' ? 'cupo' : 'cuota', hasta: t.hasta ?? null, trabajo: t };
      return { estado: 'error', trabajo: t, codigo: t.estado === 'error' ? (t.error ?? 'servidor') : t.estado === 'limitacion' ? (t.codigo ?? 'limitacion') : t.estado };
    }
    return u.leccion ? { estado: 'pendiente', motivo: 'quitada' } : { estado: 'pendiente' };
  }

  /** Cuántas unidades hay en cada estado, los minutos y cuál es la siguiente por crear. */
  function resumen(R) {
    const estados = R.unidades.map(estadoUnidad);
    const cuenta = (e) => estados.filter((x) => x.estado === e).length;
    // La siguiente: la que está en pausa (se sigue por ella) o la primera pendiente.
    const d = estados.findIndex((x) => x.estado === 'detenida');
    const i = d >= 0 ? d : estados.findIndex((x) => x.estado === 'pendiente');
    return {
      total: R.unidades.length, listas: cuenta('lista'), preparando: cuenta('preparando'), pendientes: cuenta('pendiente') + cuenta('detenida'),
      detenidas: cuenta('detenida'),
      problemas: cuenta('error') + cuenta('interrumpida') + cuenta('sin-guardar'),
      minutos: R.unidades.reduce((n, u) => n + (u.minutos ?? 0), 0),
      siguiente: i >= 0 ? R.unidades[i] : null, nSiguiente: i + 1,
      // Las que la cola («todas») crearía: las que nunca se intentaron.
      nuevas: R.unidades.filter((u) => !u.trabajo && !u.leccion).length,
      estados,
    };
  }

  /** La solicitud de una unidad: su alcance y lo que hace falta saber del recorrido para no repetir las otras. */
  const solicitudDe = (R, u, n) => ({
    accion: 'crear', tema: u.titulo, objetivo: u.objetivo ?? '', nivel: u.nivel ?? R.nivel ?? null, minutos: u.minutos ?? null, leccion_base: null,
    enfoque: u.enfoque ?? '', supuestos: [], terminos: u.terminos ?? [], explicita: true, suficiente: true,
    recorrido: { titulo: R.titulo, n, total: R.unidades.length, otras: R.unidades.filter((x) => x !== u).map((x) => x.titulo) },
  });

  /**
   * Crea una unidad (pendiente, en pausa, con error o interrumpida): un trabajo de creación como cualquier otro. Si ya
   * tenía un plan, el mismo (no se vuelve a planificar); tras un corte de red o una pausa, el mismo trabajo. Una unidad
   * interrumpida (el servidor la olvidó) puede volver a costar: solo con `confirmado`. Devuelve { ok, trabajo?, error? }:
   * 'ya' (lista, en preparación o sin guardar), 'confirmar', 'ocupado' (otra unidad del recorrido se está preparando: de
   * una en una), 'planificando', 'lleno' (no cabe en «Mis lecciones») o 'no-existe'.
   */
  function crearUnidad(id, uid, { confirmado = false } = {}) {
    const R = buscar(id);
    const u = R?.unidades.find((x) => x.id === uid);
    if (!R || !u) return { ok: false, error: 'no-existe' };
    if (estadoRecorrido(R) === 'planificando') return { ok: false, error: 'planificando' };
    const e = estadoUnidad(u);
    if (!['pendiente', 'detenida', 'error', 'interrumpida'].includes(e.estado)) return { ok: false, error: 'ya' };
    if (e.estado === 'interrumpida' && !confirmado) return { ok: false, error: 'confirmar' };
    if (R.unidades.some((x) => x !== u && estadoUnidad(x).estado === 'preparando')) return { ok: false, error: 'ocupado' };
    if (!(espacio() >= 1)) { tocar(R, { aviso: { codigo: 'lleno' } }); return { ok: false, error: 'lleno' }; }
    const prev = e.trabajo;
    let t = prev && FINALES.includes(prev.estado) && (prev.plan || prev.reanudable) ? trabajos.reintentar(prev.id) : null;
    if (!t) t = trabajos.iniciar({ solicitud: solicitudDe(R, u, R.unidades.indexOf(u) + 1), titulo: u.titulo, unidad: { recorrido: R.id, id: u.id } });
    u.trabajo = t.id;
    tocar(R, { aviso: null });
    try { alIniciar?.(t, R, u); } catch { /* las estadísticas nunca paran una creación */ }
    return { ok: true, trabajo: t };
  }

  /** La siguiente unidad pendiente, en orden. */
  function crearSiguiente(id) {
    const R = buscar(id);
    if (!R) return { ok: false, error: 'no-existe' };
    const u = resumen(R).siguiente;
    return u ? crearUnidad(id, u.id) : { ok: false, error: 'nada' };
  }

  /**
   * La cola de «todas»: cuando no hay ninguna en preparación, primero la unidad en pausa (si ya es la hora) y si no, la
   * siguiente que nunca se intentó; si no queda ninguna, se apaga. En pausa, espera a la hora que dijo el servidor (con
   * un reloj mientras la página está abierta; si no, al volver). `ya`: la persona pulsó «Seguir» (no espera a la hora).
   */
  function seguirCola(R, { ya = false } = {}) {
    if (!R?.cola || estadoRecorrido(R) === 'planificando') return;
    const estados = R.unidades.map(estadoUnidad);
    if (estados.some((x) => x.estado === 'preparando')) return;
    const k = estados.findIndex((x) => x.estado === 'detenida');
    if (k >= 0) {
      const hasta = estados[k].hasta;
      // Sin hora (tope de gasto sin fecha de renovación): solo cuando la persona lo pide.
      if (!ya && (!hasta || hasta > ahora())) {
        if (!R.pausa || R.pausa.hasta !== hasta || R.pausa.motivo !== estados[k].motivo) tocar(R, { pausa: { motivo: estados[k].motivo, hasta: hasta ?? null, unidad: R.unidades[k].id } });
        if (hasta) despertar(R, hasta);
        return;
      }
      tocar(R, { pausa: null });
      const r = crearUnidad(R.id, R.unidades[k].id);
      if (!r.ok) tocar(R, { cola: false, aviso: { codigo: r.error } });
      return;
    }
    if (R.pausa) tocar(R, { pausa: null });
    const u = R.unidades.find((x) => !x.trabajo && !x.leccion);
    if (!u) { tocar(R, { cola: false }); return; }
    const r = crearUnidad(R.id, u.id);
    if (!r.ok) tocar(R, { cola: false, aviso: { codigo: r.error } });
  }
  /** Un reloj para seguir la cola a la hora de la pausa (uno por recorrido; un segundo de margen). */
  function despertar(R, hasta) {
    if (relojes.get(R.id) === hasta) return;
    relojes.set(R.id, hasta);
    try {
      programar(() => {
        if (relojes.get(R.id) !== hasta) return;
        relojes.delete(R.id);
        seguirCola(buscar(R.id));
      }, Math.max(0, hasta - ahora()) + 1000);
    } catch { /* sin relojes: sigue al volver a abrir la app */ }
  }

  // Lo que pasa con las creaciones de las unidades: el trabajo nuevo de un reintento sustituye al anterior en su unidad;
  // al guardarse, la unidad apunta a su lección; y la cola sigue (si se guardó) o se para (si no).
  trabajos.suscribir((x) => {
    const v = x?.unidad;
    if (!v || typeof v !== 'object') return;
    const R = buscar(v.recorrido);
    const u = R?.unidades.find((y) => y.id === v.id);
    if (!u) return;      // el recorrido o la unidad ya no están: el trabajo sigue como una creación más
    let cambia = false;
    if (u.trabajo !== x.id) {
      if (u.trabajo && x.reemplaza !== u.trabajo && trabajos.buscar(u.trabajo)) return;
      u.trabajo = x.id;
      cambia = true;
    }
    if (x.estado === 'guardada' && x.leccionId && u.leccion !== x.leccionId) { u.leccion = x.leccionId; cambia = true; }
    // Una pausa (cuota o tope de gasto) no para la cola: espera y sigue a su hora.
    if (x.estado === 'error' && PAUSAS.includes(x.error) && R.cola) {
      if (cambia) tocar(R);
      queueMicrotask(() => seguirCola(buscar(R.id)));
      return;
    }
    if (FINALES.includes(x.estado) && R.cola && x.estado !== 'guardada') {
      tocar(R, { cola: false, pausa: null, aviso: { codigo: x.estado === 'error' && x.error === 'cancelada' ? 'cancelada' : 'parada', unidad: u.id } });
      return;
    }
    if (cambia) tocar(R); else avisar(R);
    if (x.estado === 'guardada' && R.cola) queueMicrotask(() => seguirCola(buscar(R.id)));
  });

  /** Lo que la app manda al servidor para cambiar un recorrido: cómo es ahora, con el estado real de cada unidad. */
  const baseDe = (R) => ({
    id: R.id, titulo: R.titulo, objetivo: R.objetivo ?? '',
    unidades: R.unidades.map((u) => ({ titulo: u.titulo, objetivo: u.objetivo ?? '', enfoque: u.enfoque ?? '', nivel: u.nivel ?? null, minutos: u.minutos ?? null, terminos: u.terminos ?? [], estado: paraServidor(estadoUnidad(u).estado) })),
  });

  /** Pone los cambios y empieza a planificar; avisa después, para que ya se vea «planificando». */
  function lanzar(R, solicitud, cambios) {
    Object.assign(R, cambios, { actualizado: ahora() });
    ejecutar(R, solicitud);
    guardar();
    avisar(R);
  }

  async function ejecutar(R, solicitud) {
    const control = new AbortController();
    planificando.set(R.id, control);
    const base = solicitud.recorrido_base ? baseDe(R) : null;
    try {
      const cuerpo = { ...comun(), modo: 'planificar', mensajes: historial(), solicitud, ...(base ? { baseRecorrido: base } : {}) };
      const { r, d } = await pedirJSON(fetch, url, { method: 'POST', headers: JSON_H, body: JSON.stringify(cuerpo) }, plazos.planificar, control);
      // El cupo diario que trae la respuesta (`alCupo`: para enseñar el saldo; nunca para nada).
      if (d?.cupo) { try { alCupo?.(d.cupo); } catch { /* nada */ } }
      if (motivo(control) === 'cancelada' || buscar(R.id) !== R) return;
      planificando.delete(R.id);
      const plan = r.ok && d?.ok && d.tipo === 'recorrido' ? limpiarRecorrido(d.recorrido) : null;
      if (plan && plan.unidades.length >= 2) return aplicar(R, plan, d, !!base);
      if (r.ok && d?.ok && (d.tipo === 'aclaracion' || d.tipo === 'limitacion')) {
        return tocar(R, { estado: d.tipo, codigo: texto(d.codigo, 40) || null, errores: Array.isArray(d.errores) ? d.errores.slice(0, 6).map((e) => texto(e, 300)) : null, mensaje: texto(d.mensaje, LIMITES.pet) || null, auto: false });
      }
      tocar(R, { estado: 'error', error: codigoError(r, d), auto: false });
    } catch (err) {
      if (motivo(control) === 'cancelada' || buscar(R.id) !== R) return;
      planificando.delete(R.id);
      tocar(R, { estado: 'error', error: motivo(control) === 'tiempo' || err?.motivo === 'tiempo' ? 'tiempo' : 'conexion', reanudable: true, auto: false });
    } finally {
      if (planificando.get(R.id) === control) planificando.delete(R.id);
    }
  }

  /**
   * Las unidades nuevas del recorrido. Al cambiarlo, una unidad que se conserva es la misma (con su trabajo y su
   * lección); las que ya existían y salen del recorrido no se borran: su lección sigue en «Mis lecciones» (`salen`).
   */
  function aplicar(R, plan, d, esCambio) {
    const antes = R.unidades;
    const conservadas = new Set();
    const unidades = plan.unidades.map((p) => {
      const v = esCambio && p.conserva ? antes[p.conserva - 1] : null;
      if (v && !conservadas.has(v.id)) { conservadas.add(v.id); return v; }
      return {
        id: idUnidad(), titulo: p.titulo, objetivo: p.objetivo, enfoque: p.enfoque, nivel: p.nivel ?? plan.nivel, minutos: p.minutos,
        terminos: p.terminos, relacionadas: p.relacionadas, trabajo: null, leccion: null,
      };
    });
    const salen = antes.filter((v) => !conservadas.has(v.id)).map((v) => ({ v, e: estadoUnidad(v) }))
      .filter(({ e }) => ['lista', 'sin-guardar', 'preparando'].includes(e.estado)).map(({ v, e }) => ({ titulo: v.titulo, estado: e.estado, leccion: e.leccion ?? null }));
    const auto = R.auto && !esCambio;
    tocar(R, {
      estado: 'listo', titulo: plan.titulo, resumen: plan.resumen, objetivo: plan.objetivo || R.objetivo, nivel: plan.nivel, unidades,
      supuestos: plan.supuestos, limitaciones: plan.limitaciones, mensaje: texto(d.mensaje, LIMITES.pet) || null, codigo: null, error: null,
      errores: null, reanudable: false, auto: false, cambio: null, salen, aviso: null, instrucciones: texto(d.instrucciones, 40) || null,
    });
    // «Créame un curso…»: además del recorrido, su primera unidad (un primer paso útil). Las demás, cuando la persona diga.
    if (auto) {
      const r = crearSiguiente(R.id);
      if (!r.ok && r.error !== 'lleno') tocar(R, { aviso: { codigo: r.error } });
    }
  }

  return {
    get lista() { return lista; },
    buscar,
    estadoRecorrido,
    estadoUnidad,
    resumen,
    /**
     * Planifica un recorrido nuevo (lo que pidió la persona en una propuesta). `auto`: lo pidió expresamente («créame un
     * curso…»): al tener las unidades, se crea también la primera. Devuelve { ok, recorrido?, error? ('lleno-recorridos') }.
     */
    planificar(solicitud, { auto = false } = {}) {
      if (lista.length >= MAX_RECORRIDOS) return { ok: false, error: 'lleno-recorridos' };
      const R = {
        id: nuevoId(), estado: 'planificando', titulo: texto(solicitud.tema, LIMITES.campo), resumen: '', objetivo: texto(solicitud.objetivo, LIMITES.largo), nivel: solicitud.nivel ?? null,
        solicitud: { ...solicitud, recorrido_base: null }, cambio: null, unidades: [], supuestos: [], limitaciones: [], mensaje: null, codigo: null, error: null,
        errores: null, reanudable: false, cola: false, auto: !!auto, aviso: null, salen: [], instrucciones: null, creado: ahora(), actualizado: ahora(),
      };
      lista = [R, ...lista];
      lanzar(R, R.solicitud, {});
      return { ok: true, recorrido: R };
    },
    /**
     * Cambia un recorrido (otra propuesta de Neuri sobre él): lo creado se conserva o sale, nunca se borra. La cola se
     * para (lo que está en marcha sigue): con unidades nuevas, qué crear después lo vuelve a decidir la persona.
     */
    replanificar(id, solicitud) {
      const R = buscar(id);
      if (!R) return { ok: false, error: 'no-existe' };
      if (estadoRecorrido(R) === 'planificando') return { ok: false, error: 'planificando' };
      const cambio = { ...solicitud, recorrido_base: R.id };
      lanzar(R, cambio, { estado: 'planificando', cambio, cola: false, mensaje: null, codigo: null, error: null, errores: null, reanudable: false, aviso: null, salen: [] });
      return { ok: true, recorrido: R };
    },
    /** Vuelve a planificar lo último que se pidió (tras un error, un corte de red o una planificación interrumpida). */
    reintentar(id) {
      const R = buscar(id);
      if (!R || ['planificando', 'listo'].includes(estadoRecorrido(R))) return { ok: false, error: 'no' };
      lanzar(R, R.cambio ?? R.solicitud, { estado: 'planificando', mensaje: null, codigo: null, error: null, errores: null, reanudable: false, aviso: null });
      return { ok: true, recorrido: R };
    },
    /** Cancela la planificación: un recorrido nuevo no deja nada; un cambio deja el recorrido como estaba. */
    cancelar(id) {
      const R = buscar(id);
      const c = planificando.get(id);
      if (!R || !c) return false;
      cortar(c, 'cancelada');
      planificando.delete(id);
      if (!R.unidades.length) {
        lista = lista.filter((x) => x !== R);
        guardar();
        avisar(null);
      } else tocar(R, { estado: 'listo', cambio: null, auto: false, aviso: { codigo: 'cambio-cancelado' } });
      return true;
    },
    crearUnidad,
    crearSiguiente,
    /** «Todas»: en cola, una detrás de otra (solo las que nunca se intentaron). Devuelve { ok, error? }. */
    crearTodas(id) {
      const R = buscar(id);
      if (!R || !R.unidades.length) return { ok: false, error: 'no-existe' };
      if (estadoRecorrido(R) === 'planificando') return { ok: false, error: 'planificando' };
      if (!resumen(R).nuevas && !resumen(R).detenidas) return { ok: false, error: 'nada' };
      tocar(R, { cola: true, aviso: null });
      seguirCola(R);
      return R.cola || R.unidades.some((u) => estadoUnidad(u).estado === 'preparando') ? { ok: true } : { ok: false, error: R.aviso?.codigo ?? 'nada' };
    },
    /** Para la cola: la unidad en preparación sigue hasta terminar; las demás esperan. */
    parar(id) {
      const R = buscar(id);
      if (!R?.cola) return false;
      tocar(R, { cola: false, pausa: null });
      return true;
    },
    /**
     * «Seguir ahora» con una unidad en pausa: lo intenta ya (si la cuota o el tope siguen sin dejar, el servidor lo dice
     * sin gastar nada y vuelve a quedar en pausa). Con la cola parada, la pone en marcha.
     */
    seguir(id) {
      const R = buscar(id);
      if (!R || !resumen(R).detenidas) return { ok: false, error: 'nada' };
      tocar(R, { cola: true, pausa: null, aviso: null });
      seguirCola(R, { ya: true });
      return { ok: true };
    },
    /** Quita un aviso del recorrido (lo cerró la persona). */
    olvidarAviso(id) { const R = buscar(id); if (R && (R.aviso || R.salen?.length)) tocar(R, { aviso: null, salen: [] }); },
    /**
     * Quita el recorrido. Sus lecciones no se borran (siguen en «Mis lecciones») y lo que se está preparando sigue hasta
     * terminar. Devuelve { ok, lecciones: las que tenía listas (por si la persona decide, aparte, quitarlas también) }.
     */
    quitar(id) {
      const R = buscar(id);
      if (!R) return { ok: false, lecciones: [] };
      const c = planificando.get(id);
      if (c) { cortar(c, 'cancelada'); planificando.delete(id); }
      const lecciones = R.unidades.map(estadoUnidad).filter((e) => e.estado === 'lista').map((e) => e.leccion);
      lista = lista.filter((x) => x !== R);
      guardar();
      avisar(null);
      return { ok: true, lecciones };
    },
    /** El recorrido y la unidad de un trabajo de creación (si es de una unidad que sigue en un recorrido). */
    deTrabajo(trabajoId) {
      const t = trabajos.buscar(trabajoId);
      for (const R of lista) {
        const u = R.unidades.find((x) => x.trabajo === trabajoId || (t?.unidad?.recorrido === R.id && t.unidad.id === x.id));
        if (u) return { recorrido: R, unidad: u, n: R.unidades.indexOf(u) + 1, total: R.unidades.length };
      }
      return null;
    },
    /** El recorrido y la unidad de una lección de «Mis lecciones» (si es una unidad lista de un recorrido). */
    deLeccion(leccionId) {
      for (const R of lista) {
        const u = R.unidades.find((x) => estadoUnidad(x).leccion === leccionId);
        if (u) return { recorrido: R, unidad: u, n: R.unidades.indexOf(u) + 1, total: R.unidades.length };
      }
      return null;
    },
    /** Lo que se cuenta a Neuri de cada recorrido: su título y el estado real de cada unidad (nunca el progreso). */
    resumenes() {
      return lista.filter((R) => R.unidades.length).slice(0, LIMITES.recorridos).map((R) => ({
        id: R.id, titulo: R.titulo,
        unidades: R.unidades.map((u) => { const e = estadoUnidad(u); return { titulo: u.titulo, estado: paraServidor(e.estado), leccion: e.estado === 'lista' ? e.leccion : null }; }),
      }));
    },
    /** Lo que se recuerda de un recorrido en la conversación (para que Neuri sepa qué hay aunque se quite). */
    instantanea(R) {
      return {
        estado: estadoRecorrido(R), titulo: R.titulo, error: R.error ?? null, codigo: R.codigo ?? null, mensaje: R.mensaje ?? null,
        unidades: R.unidades.map((u) => { const e = estadoUnidad(u); return { titulo: u.titulo, estado: paraServidor(e.estado), leccion: e.leccion ?? null }; }),
      };
    },
    /** Al abrir la app: una cola que quedó a medias sigue (la creación en curso la retoma src/pet/trabajos.js). */
    retomar() { for (const R of lista) if (R.cola) seguirCola(R); },
    /** Otra pestaña cambió los recorridos: se leen otra vez, sin perder lo que esta pestaña está planificando. */
    recargar() {
      const leido = leer(almacen);
      const propios = lista.filter((R) => planificando.has(R.id));
      lista = [...propios, ...leido.lista.filter((R) => !propios.some((p) => p.id === R.id))].sort((a, b) => (b.creado ?? 0) - (a.creado ?? 0));
      porApartar = [...porApartar, ...leido.apartar.filter((x) => !porApartar.includes(x))];
      avisar(null);
    },
    /** «Borrar mis datos»: corta lo que se planifica y olvida los recorridos (las creaciones las olvida trabajos.js). */
    olvidar() {
      for (const c of planificando.values()) cortar(c, 'cancelada');
      planificando.clear();
      lista = [];
      porApartar = [];
      guardar();
      avisar(null);
    },
    /** Lo apartado (recorridos guardados que no se pudieron leer), para descargarlo. */
    apartados() { return [...leerApartados(almacen), ...porApartar.map((t) => ({ texto: t, apartado: null }))]; },
    /** Descarta lo apartado (solo cuando la persona lo pide, después de poder descargarlo). */
    descartarApartados() {
      porApartar = [];
      try { almacen?.setItem(CLAVE_RECORRIDOS_APARTADOS, '[]'); } catch { return false; }
      guardar();
      return true;
    },
    suscribir(fn) { oyentes.add(fn); return () => oyentes.delete(fn); },
  };
}

/**
 * Importa recorridos (del archivo «Mis datos» de otro navegador): se añaden los que no hay, sin tocar los que ya
 * están (el mismo identificador no se sobrescribe) y sin pasar de MAX_RECORRIDOS. Las creaciones de otro navegador no
 * existen aquí: cada unidad conserva su lección (si se importó con «Mis lecciones») y pierde su trabajo. Lo que se está
 * planificando en otro sitio llega como interrumpido. Devuelve { ok, añadidos, iguales, invalidos, sinSitio, error? }.
 */
export function importarRecorridos(almacen, datos) {
  const r = { ok: false, añadidos: 0, iguales: 0, invalidos: 0, sinSitio: 0 };
  const entrada = Array.isArray(datos?.recorridos) && datos.formato === FORMATO_RECORRIDOS ? datos.recorridos : Array.isArray(datos) ? datos : null;
  if (!entrada) return { ...r, error: 'formato' };
  const leido = leer(almacen);
  const lista = [...leido.lista];
  for (const R of entrada) {
    if (!recorridoValido(R)) { r.invalidos++; continue; }
    if (lista.some((x) => x.id === R.id)) { r.iguales++; continue; }
    if (lista.length >= MAX_RECORRIDOS) { r.sinSitio++; continue; }
    lista.push({ ...R, estado: R.estado === 'planificando' || !ESTADOS_RECORRIDO.includes(R.estado) ? 'interrumpido' : R.estado, cola: false, auto: false, unidades: R.unidades.map((u) => ({ ...u, trabajo: null })) });
    r.añadidos++;
  }
  if (!r.añadidos) return { ...r, ok: true };
  try {
    if (leido.apartar.length && !apartarTextos(almacen, leido.apartar, Date.now)) return { ...r, añadidos: 0, error: 'apartar' };
    almacen.setItem(CLAVE_RECORRIDOS, JSON.stringify({ formato: FORMATO_RECORRIDOS, version: VERSION_RECORRIDOS, recorridos: lista.sort((a, b) => (b.creado ?? 0) - (a.creado ?? 0)) }));
    return { ...r, ok: true };
  } catch { return { ...r, añadidos: 0, error: 'almacenamiento' }; }
}

/** Cuántos recorridos hay guardados (los que se pueden leer). */
export const contarRecorridos = (almacen) => leer(almacen).lista.length;

function codigoError(r, d) {
  const e = d?.error;
  if (typeof e === 'string' && /^[a-z-]{2,30}$/.test(e)) return e;
  if (r.status === 404) return 'sin-servidor';
  if (r.status === 429) return 'limite';
  return 'servidor';
}

/** ¿Tiene la forma de una unidad? (lo guardado puede venir de otra versión o estar dañado). */
function unidadValida(u) {
  return !!u && typeof u === 'object' && typeof u.id === 'string' && ID_UNIDAD.test(u.id) && typeof u.titulo === 'string' && !!u.titulo.trim()
    && (u.trabajo == null || (typeof u.trabajo === 'string' && ID_TRABAJO.test(u.trabajo)))
    && (u.leccion == null || (typeof u.leccion === 'string' && ID_PROPIA.test(u.leccion)));
}

/** ¿Tiene la forma de un recorrido? */
export function recorridoValido(R) {
  return !!R && typeof R === 'object' && typeof R.id === 'string' && ID_RECORRIDO.test(R.id) && typeof R.estado === 'string' && typeof R.titulo === 'string'
    && Array.isArray(R.unidades) && R.unidades.length <= LIMITES.unidades && R.unidades.every(unidadValida) && new Set(R.unidades.map((u) => u.id)).size === R.unidades.length;
}

/**
 * Los recorridos guardados: { lista (los que se pueden usar), apartar (textos de lo que no se puede leer) }. Un estado
 * que esta versión no conoce se lee como interrumpido.
 */
function leer(almacen) {
  let crudo;
  try { crudo = almacen?.getItem(CLAVE_RECORRIDOS) ?? null; } catch { return { lista: [], apartar: [] }; }
  if (crudo == null) return { lista: [], apartar: [] };
  let d;
  try { d = JSON.parse(crudo); } catch { return { lista: [], apartar: [crudo] }; }
  // Otro formato o una versión más nueva: esta versión no lo sabe leer; se aparta entero (sin perderlo).
  if (!d || typeof d !== 'object' || d.formato !== FORMATO_RECORRIDOS || !Array.isArray(d.recorridos) || !(d.version >= 1 && d.version <= VERSION_RECORRIDOS)) return { lista: [], apartar: [crudo] };
  const lista = [];
  const apartar = [];
  for (const R of d.recorridos) {
    if (!recorridoValido(R) || lista.some((x) => x.id === R.id)) { apartar.push(JSON.stringify(R)); continue; }
    lista.push({ ...R, estado: ESTADOS_RECORRIDO.includes(R.estado) ? R.estado : 'interrumpido', cola: R.cola === true, auto: R.auto === true });
  }
  return { lista, apartar };
}

function leerApartados(almacen) {
  let crudo = null;
  try { crudo = almacen?.getItem(CLAVE_RECORRIDOS_APARTADOS) ?? null; } catch { return []; }
  if (crudo == null) return [];
  try { const d = JSON.parse(crudo); return Array.isArray(d) ? d : [{ texto: crudo, apartado: null }]; } catch { return [{ texto: crudo, apartado: null }]; }
}

/** Pone a salvo, tal cual, lo que no se pudo leer (sin repetir). False si no se pudo (o si ya hay demasiado apartado). */
function apartarTextos(almacen, textos, ahora) {
  try {
    const ya = leerApartados(almacen);
    const vistos = new Set(ya.map((x) => x?.texto));
    const nuevos = textos.filter((t) => !vistos.has(t)).map((t) => ({ texto: t, apartado: new Date(ahora()).toISOString() }));
    if (!nuevos.length) return true;
    const todos = [...ya, ...nuevos];
    if (todos.length > MAX_APARTADOS) return false;
    almacen.setItem(CLAVE_RECORRIDOS_APARTADOS, JSON.stringify(todos));
    return true;
  } catch { return false; }
}
