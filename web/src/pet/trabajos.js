// Trabajos de creación en la app: cada lección que Neuri crea o adapta es un trabajo con su identificador (un UUID que
// pone la app), guardado en localStorage. Así se puede seguir usando la app mientras se prepara, volver al resultado, y
// si se recarga la página, el trabajo se retoma en el servidor (que lo guarda media hora) sin repetirlo ni pagarlo dos
// veces. Sin DOM: lo prueba `npm test`.
//
// Etapas (las de verdad, nunca porcentajes ni tiempos inventados):
//   planificando → fuentes → redactando → comprobando (→ corrigiendo → comprobando) → guardando → guardada
// y los finales: guardada («Lista para estudiar»: validada y guardada en «Mis lecciones»), no-guardada (validada pero el
// navegador no la pudo guardar: el resultado se conserva para reintentar o descargar), aclaracion (Neuri necesita
// saber algo), limitacion (no hay estructuras o fuentes para ese alcance), error (con su código; «cancelada» incluida)
// e interrumpida (el servidor ya no lo tiene: se puede volver a empezar con el mismo plan).
//
// Reintentar: tras un corte de red (`reanudable`), con el mismo identificador (el servidor sigue el trabajo o devuelve
// lo que ya tenía, sin repetirlo); tras cualquier otro final, un trabajo nuevo con el mismo plan que sustituye al viejo.
//
// Una unidad de un recorrido personal (src/pet/recorridos.js) es un trabajo más, con `unidad: { recorrido, id }`: se
// planifica con su propia solicitud (que ya lleva lo que hace falta del recorrido), sin la conversación, y un reintento
// sigue siendo de la misma unidad.
import { VERSION, LIMITES, ID_TRABAJO, limpiarPlan } from './protocolo.js';
import { pedirJSON, leerFlujo, leerJSON, cortar, motivo, nuevoId } from './red.js';

export const CLAVE_TRABAJOS = 'anato3d.trabajos';
export const MAX_TRABAJOS = 20;
/**
 * Paradas que no son fallos: la cuota de creaciones (`limite`, por dirección; `ocupado`, la de todos) y el tope de gasto
 * (`sin-presupuesto`). El servidor no gastó nada en esa petición y dice cuánto falta (`espera`, en segundos), que aquí
 * se guarda como `hasta` (ms). El mismo trabajo se puede seguir después: `reanudable`.
 */
// También el cupo diario de creaciones de este dispositivo (`cupo`: 429 con `cupo.renueva`, la hora a la que se renueva,
// y `espera` en milisegundos): se sigue a esa hora.
export const PAUSAS = ['limite', 'ocupado', 'sin-presupuesto', 'cupo'];
const pausa = (r, d, ahora) => {
  if (d?.error === 'cupo') {
    const renueva = Date.parse(d.cupo?.renueva ?? '');
    if (Number.isFinite(renueva) && renueva > ahora()) return renueva;
    const ms = Number(d.espera);
    return Number.isFinite(ms) && ms > 0 ? ahora() + Math.min(ms, 48 * 3600 * 1000) : null;
  }
  const s = Number(d?.espera ?? r?.headers?.get?.('retry-after'));
  return Number.isFinite(s) && s > 0 ? ahora() + Math.min(s, 40 * 24 * 3600) * 1000 : null;
};
export const EN_CURSO = ['planificando', 'fuentes', 'redactando', 'comprobando', 'corrigiendo', 'guardando'];
export const FINALES = ['guardada', 'no-guardada', 'aclaracion', 'limitacion', 'error', 'interrumpida'];
export const PLAZOS_TRABAJO = { planificar: 150_000, conectar: 30_000, inactividad: 60_000 };
const ESTADOS = new Set([...EN_CURSO, ...FINALES]);
const SEMANA = 7 * 24 * 3600 * 1000;
const JSON_H = { 'content-type': 'application/json', accept: 'application/json' };
/** Por qué se cortó una conexión: la persona, el plazo o la red. */
const porque = (control, err) => (motivo(control) === 'cancelada' ? 'cancelada' : motivo(control) === 'tiempo' || err?.motivo === 'tiempo' ? 'tiempo' : 'conexion');

/**
 * `comun()`: lo que va en toda petición ({ v, idioma, progreso, propias, contexto }); `historial()`: los turnos de la
 * conversación (para planificar con su contexto); `guardarLeccion(L)` → { ok, error? } (la guarda en «Mis lecciones»);
 * `basePropia(id)`: la lección propia entera que se adapta (las de la biblioteca las tiene el servidor). `ahora` y
 * `plazos`: el reloj y los plazos (las pruebas los cambian). `alCupo(cupo)`: el cupo diario que trae cada respuesta del
 * servidor (para enseñar el saldo; en la app, la conversación: conversacion.anotarCupo).
 */
export function crearTrabajos({ fetch = globalThis.fetch?.bind(globalThis), url = '/api/pet', almacen = null, comun, historial = () => [], guardarLeccion, basePropia = () => null, ahora = Date.now, plazos = PLAZOS_TRABAJO, alCupo = null }) {
  const cupoDe = (d) => { if (d?.cupo) { try { alCupo?.(d.cupo); } catch { /* el saldo nunca para una creación */ } } };
  let lista = leer(almacen, ahora);
  const oyentes = new Set();
  const conexiones = new Map();        // id → AbortController de la conexión abierta en esta pestaña
  const resultados = new Map();        // id → lección lista que no se pudo guardar (para reintentar o descargar)

  const guardar = () => {
    try { almacen?.setItem(CLAVE_TRABAJOS, JSON.stringify(lista)); } catch { /* sin almacenamiento: siguen en memoria */ }
  };
  const avisar = (t) => { for (const fn of oyentes) { try { fn(t); } catch { /* un oyente roto no para nada */ } } };
  const buscar = (id) => lista.find((t) => t.id === id) ?? null;
  function poner(t, cambios) {
    Object.assign(t, cambios, { actualizado: ahora() });
    guardar();
    avisar(t);
  }

  function nuevo({ solicitud = null, plan = null, titulo = null, unidad = null }) {
    return {
      id: nuevoId(), estado: plan ? 'fuentes' : 'planificando', titulo: plan?.titulo ?? titulo ?? solicitud?.tema ?? '',
      accion: plan?.accion ?? solicitud?.accion ?? 'crear', solicitud, plan, base: plan?.base ?? solicitud?.leccion_base ?? null,
      estructuras: null, evidencias: null, informe: null, leccionId: null, error: null, codigo: null, errores: null, mensaje: null,
      reanudable: false, creado: ahora(), actualizado: ahora(), ...(unidad ? { unidad: { recorrido: unidad.recorrido, id: unidad.id } } : {}),
    };
  }

  /**
   * Empieza a crear: con una solicitud (planifica y redacta seguido) o con un plan ya hecho (redacta). Devuelve el
   * trabajo. `titulo`: lo que se enseña mientras no hay plan; `unidad`: { recorrido, id } si es una unidad de un
   * recorrido personal.
   */
  function iniciar(datos) {
    const t = nuevo(datos);
    lista = podar([t, ...lista]);
    guardar();
    avisar(t);
    ejecutar(t);
    return t;
  }

  /** Planifica si hace falta y redacta. `retomar`: volver a conectarse a lo que el servidor ya tiene (no empezarlo). */
  async function ejecutar(t, { retomar = false } = {}) {
    if (conexiones.has(t.id)) return;
    const control = new AbortController();
    conexiones.set(t.id, control);
    // Sin plan, el servidor aún no tiene nada de este trabajo: se planifica y se empieza (no hay a qué conectarse).
    const teniaPlan = !!t.plan;
    try {
      if (!teniaPlan) {
        const ok = await planificar(t, control);
        if (!ok) return;
      }
      await redactar(t, control, retomar && teniaPlan);
    } finally {
      if (conexiones.get(t.id) === control) conexiones.delete(t.id);
    }
  }

  async function planificar(t, control) {
    const base = t.base ? basePropia(t.base) : null;
    // Una unidad de un recorrido se planifica con su solicitud, sin la conversación (que pedía el recorrido entero).
    const mensajes = t.unidad ? [] : historial();
    try {
      const { r, d } = await pedirJSON(fetch, url, { method: 'POST', headers: JSON_H, body: JSON.stringify({ ...comun(), modo: 'planificar', mensajes, solicitud: t.solicitud, trabajo: t.id, ...(base ? { base } : {}) }) }, plazos.planificar, control);
      cupoDe(d);
      if (motivo(control) === 'cancelada') return false;
      if (r.ok && d?.ok && d.tipo === 'plan' && limpiarPlan(d.plan)) {
        const plan = { ...limpiarPlan(d.plan), accion: d.plan.accion, base: d.plan.base ?? null };
        poner(t, { plan, titulo: plan.titulo, estructuras: d.estructuras ?? {}, estado: 'fuentes', mensaje: String(d.mensaje ?? '').slice(0, LIMITES.pet) || null });
        return true;
      }
      if (r.ok && d?.ok) {
        poner(t, { estado: d.tipo === 'aclaracion' ? 'aclaracion' : 'limitacion', codigo: d.codigo ?? null, errores: d.errores ?? null, mensaje: String(d.mensaje ?? '').slice(0, LIMITES.pet) || null });
        return false;
      }
      const error = codigoError(r, d);
      // Cuota o tope de gasto: no se planificó nada (no costó); el mismo trabajo sigue cuando se pueda.
      if (PAUSAS.includes(error)) poner(t, { estado: 'error', error, hasta: pausa(r, d, ahora), reanudable: true });
      else poner(t, { estado: 'error', error });
    } catch (err) {
      const por = porque(control, err);
      if (por !== 'cancelada') poner(t, { estado: 'error', error: por, reanudable: true });
    }
    return false;
  }

  /**
   * Redacta (o se vuelve a conectar, `retomar`) en flujo. Los eventos traen el estado; el último es lista,
   * limitacion o error. La lección lista se guarda aquí, y solo entonces el trabajo pasa a «guardada».
   */
  async function redactar(t, control, retomar) {
    const base = t.accion === 'adaptar' && t.base ? basePropia(t.base) : null;
    const cuerpo = retomar
      ? { v: VERSION, modo: 'trabajo', trabajo: t.id }
      : { ...comun(), modo: t.accion === 'adaptar' ? 'adaptar' : 'redactar', mensajes: [], plan: t.plan, trabajo: t.id, ...(base ? { base } : {}) };
    let ultimo = null;
    try {
      const reloj = setTimeout(() => cortar(control, 'tiempo'), plazos.conectar);
      let r;
      try { r = await fetch(url, { method: 'POST', headers: { ...JSON_H, accept: 'application/x-ndjson' }, body: JSON.stringify(cuerpo), signal: control.signal }); } finally { clearTimeout(reloj); }
      if (!r.ok) {
        const d = await leerJSON(r);
        cupoDe(d);
        if (retomar && d?.error === 'trabajo-desconocido') return poner(t, { estado: 'interrumpida', reanudable: false });
        const error = codigoError(r, d);
        // Cuota o tope de gasto antes de empezar a redactar: el servidor no lo empezó; el mismo trabajo sigue después.
        if (PAUSAS.includes(error)) return poner(t, { estado: 'error', error, hasta: pausa(r, d, ahora), reanudable: true });
        return poner(t, { estado: 'error', error, reanudable: false });
      }
      await leerFlujo(r, (e) => {
        if (e.estado === 'latido' || motivo(control)) return;
        cupoDe(e);                                       // (el primer evento lleva el cupo)
        ultimo = e;
        if (e.estado === 'lista') return;             // se guarda abajo
        if (!ESTADOS.has(e.estado)) return;
        const cambios = { estado: e.estado };
        if (e.evidencias) cambios.evidencias = e.evidencias;
        if (e.estado === 'corrigiendo') cambios.problemas = Number.isInteger(e.errores) && e.errores > 0 ? e.errores : null;
        if (e.estado === 'error') { cambios.error = e.error ?? 'servidor'; cambios.errores = e.errores ?? null; cambios.reanudable = false; }
        if (e.estado === 'limitacion' || e.estado === 'aclaracion') { cambios.codigo = e.codigo ?? null; cambios.mensaje = e.mensaje ?? null; }
        poner(t, cambios);
      }, { control, inactividadMs: plazos.inactividad });
    } catch (err) {
      const por = porque(control, err);
      if (por === 'cancelada') return;                // cancelar() ya lo dejó en su estado
      return poner(t, { estado: 'error', error: por, reanudable: true });
    }
    if (ultimo?.estado === 'lista' && ultimo.leccion) return guardarResultado(t, ultimo.leccion, ultimo);
    if (!ultimo || !['limitacion', 'aclaracion', 'error'].includes(ultimo.estado)) poner(t, { estado: 'error', error: 'incompleta', reanudable: true });
  }

  function guardarResultado(t, L, evento = {}) {
    poner(t, { estado: 'guardando', informe: evento.informe ?? t.informe, mensaje: String(evento.mensaje ?? t.mensaje ?? '').slice(0, LIMITES.pet) || null });
    let r;
    try { r = guardarLeccion(L); } catch { r = { ok: false, error: 'almacenamiento' }; }
    if (r?.ok) {
      resultados.delete(t.id);
      // (Si ya había otra lección con su identificador, se guardó como copia: `r.id`.)
      poner(t, { estado: 'guardada', leccionId: r.id ?? L.id, error: null, titulo: L.titulo, reanudable: false });
    } else if (r?.error === 'invalida') {
      // No pasa la comprobación de la app: guardarla otra vez daría lo mismo.
      resultados.delete(t.id);
      poner(t, { estado: 'error', error: 'validacion', reanudable: false });
    } else {
      // El navegador no la pudo guardar (lleno, bloqueado…): el resultado se conserva en esta pestaña y en el servidor.
      resultados.set(t.id, L);
      poner(t, { estado: 'no-guardada', leccionId: L.id, error: r?.error ?? 'almacenamiento', titulo: L.titulo, reanudable: false });
    }
  }

  /** Vuelve a conectarse a un trabajo en curso (tras recargar la página) o recupera su resultado. */
  function retomar(id) {
    const t = buscar(id);
    if (!t || conexiones.has(id)) return Promise.resolve();
    return ejecutar(t, { retomar: true });
  }

  return {
    get lista() { return lista; },
    buscar,
    iniciar,
    retomar,
    /** Al abrir la app: retoma lo que quedó a medias. */
    retomarPendientes() { return Promise.all(lista.filter((t) => !FINALES.includes(t.estado)).map((t) => retomar(t.id))); },
    /** Lo que se está preparando. */
    get enCurso() { return lista.filter((t) => !FINALES.includes(t.estado)); },
    /** Cancela: corta la conexión y pide al servidor que lo detenga (deja de llamar a Claude). */
    async cancelar(id) {
      const t = buscar(id);
      if (!t || FINALES.includes(t.estado)) return false;
      const c = conexiones.get(id);
      if (c) cortar(c, 'cancelada');
      poner(t, { estado: 'error', error: 'cancelada', reanudable: false });
      try { await pedirJSON(fetch, url, { method: 'POST', headers: JSON_H, body: JSON.stringify({ v: VERSION, modo: 'cancelar', trabajo: id }) }, 10_000); } catch { /* si no llega, el servidor lo terminará solo */ }
      return true;
    },
    /**
     * Vuelve a intentar. Devuelve el trabajo que sigue: el mismo (guardar otra vez, o seguir tras un corte de red) o uno
     * nuevo con el mismo plan, que sustituye al viejo en la lista (`reemplaza`: el identificador del viejo).
     */
    reintentar(id) {
      const t = buscar(id);
      if (!t || !FINALES.includes(t.estado) || conexiones.has(id)) return null;
      if (t.estado === 'no-guardada') {
        const L = resultados.get(id);
        if (L) { guardarResultado(t, L); return t; }
        // Tras recargar, la lección ya no está en la pestaña: se vuelve a pedir al servidor (sin repetirla).
        poner(t, { estado: 'guardando', error: null });
        ejecutar(t, { retomar: true });
        return t;
      }
      if (t.reanudable) {
        poner(t, { estado: t.plan ? 'fuentes' : 'planificando', error: null, hasta: null, reanudable: false });
        ejecutar(t);
        return t;
      }
      const n = { ...nuevo({ solicitud: t.solicitud, plan: t.plan, titulo: t.titulo, unidad: t.unidad }), estructuras: t.estructuras, reemplaza: t.id };
      lista = podar([n, ...lista.filter((x) => x.id !== t.id)]);
      resultados.delete(t.id);
      guardar();
      avisar(n);
      ejecutar(n);
      return n;
    },
    /** La lección lista que no se pudo guardar (para descargarla), si sigue en esta pestaña. */
    resultado: (id) => resultados.get(id) ?? null,
    /** Quita un trabajo terminado de la lista. */
    quitar(id) {
      const t = buscar(id);
      if (!t || !FINALES.includes(t.estado)) return false;
      lista = lista.filter((x) => x.id !== id);
      resultados.delete(id);
      guardar();
      avisar(null);
      return true;
    },
    /**
     * Otra pestaña cambió la lista (evento «storage»): se lee otra vez, sin perder lo que esta pestaña está siguiendo.
     */
    recargar() {
      const propios = lista.filter((t) => conexiones.has(t.id));
      const fuera = leer(almacen, ahora).filter((t) => !conexiones.has(t.id));
      lista = podar([...propios, ...fuera].sort((a, b) => (b.creado ?? 0) - (a.creado ?? 0)));
      avisar(null);
    },
    /** Olvida todas las creaciones (al borrar los datos): corta las conexiones y pide al servidor que pare. */
    olvidar() {
      for (const t of lista) {
        if (FINALES.includes(t.estado)) continue;
        const c = conexiones.get(t.id);
        if (c) cortar(c, 'cancelada');
        pedirJSON(fetch, url, { method: 'POST', headers: JSON_H, body: JSON.stringify({ v: VERSION, modo: 'cancelar', trabajo: t.id }) }, 10_000).catch(() => {});
      }
      conexiones.clear();
      resultados.clear();
      lista = [];
      guardar();
      avisar(null);
    },
    suscribir(fn) { oyentes.add(fn); return () => oyentes.delete(fn); },
  };
}

/** Como mucho MAX_TRABAJOS: se olvidan antes los terminados más antiguos; nunca uno en curso. */
function podar(lista) {
  const enCurso = lista.filter((t) => !FINALES.includes(t.estado));
  const finales = lista.filter((t) => FINALES.includes(t.estado)).slice(0, Math.max(0, MAX_TRABAJOS - enCurso.length));
  const quedan = new Set([...enCurso, ...finales]);
  return lista.filter((t) => quedan.has(t));
}

function codigoError(r, d) {
  const e = d?.error;
  if (typeof e === 'string' && /^[a-z-]{2,30}$/.test(e)) return e;
  if (r.status === 404) return 'sin-servidor';
  if (r.status === 429) return 'limite';
  return 'servidor';
}

/** Los trabajos guardados (los válidos; los terminados hace más de una semana se olvidan). */
function leer(almacen, ahora) {
  try {
    const d = JSON.parse(almacen?.getItem(CLAVE_TRABAJOS) ?? '[]');
    if (!Array.isArray(d)) return [];
    return podar(d.filter((t) => t && typeof t === 'object' && typeof t.id === 'string' && ID_TRABAJO.test(t.id) && typeof t.estado === 'string')
      // Un estado que esta versión no conoce (otra versión, datos dañados): no se puede seguir.
      .map((t) => (ESTADOS.has(t.estado) ? t : { ...t, estado: 'interrumpida' }))
      .filter((t) => !FINALES.includes(t.estado) || ahora() - (t.actualizado ?? 0) < SEMANA));
  } catch { return []; }
}
