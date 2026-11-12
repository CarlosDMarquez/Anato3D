// Neuri, el asistente de «Estudiar»: lo que se envían la app y el servidor (server/pet.mjs), con sus límites.
// Sin DOM: lo usan la app (src/pet/conversacion.js, src/ui/biblioteca/pet.js), el servidor y las pruebas.
//
// Modos (los pone la app según lo que se pulsa, nunca el texto de la conversación):
//   orientar    conversación: recomendar, explicar con evidencias, aclarar y preparar solicitudes
//   planificar  el alcance de una lección nueva o de una adaptación (tras pulsar «Planificar»), o las unidades de un
//               recorrido personal (una solicitud con accion 'recorrido': lo que no cabe en una lección)
//   redactar    la lección a partir del plan y las evidencias (tras pulsar «Crear la lección»)
//   adaptar     una lección existente según la petición (tras pulsar «Crear la adaptación»)
//   trabajo     volver a conectarse a una creación en curso o terminada (tras recargar la página)
//   cancelar    detener una creación en curso
// Todo lo que llega de fuera (de la app o del modelo) se recorta y se comprueba aquí.

export const VERSION = 2;
export const IDIOMAS = ['es', 'en', 'de', 'fr', 'it'];
export const MODOS = ['orientar', 'planificar', 'redactar', 'adaptar', 'trabajo', 'cancelar'];

export const LIMITES = {
  mensajes: 12,        // turnos de la conversación que se envían (los más recientes)
  usuario: 500,        // caracteres de cada mensaje de la persona
  pet: 1200,           // caracteres de cada respuesta de Neuri
  motivo: 240,         // caracteres del motivo de cada recomendación
  lecciones: 3,        // lecciones recomendadas por respuesta
  sesion: 8,           // lecciones de una sesión acumulativa
  sugerencias: 4,      // respuestas rápidas que se ofrecen
  sugerencia: 60,      // caracteres de cada respuesta rápida
  evidencias: 6,       // evidencias que se citan en una explicación
  progreso: 120,       // identificadores por lista del progreso
  propias: 40,         // lecciones propias que se cuentan a Neuri
  unidades: 8,         // unidades de un recorrido personal
  recorridos: 12,      // recorridos personales que se cuentan a Neuri
  campo: 160,          // caracteres de un campo corto (tema, título…)
  largo: 600,          // caracteres de un campo largo (objetivo, enfoque, resumen…)
  cuerpo: 64 * 1024,   // bytes de la petición (con el plan o la lección base)
  leccionBase: 200 * 1024, // bytes de una lección propia que se adapta
};

export const ID_PROPIA = /^neuri-[a-z0-9-]{3,80}$/;
/** Identificador de un trabajo de creación: lo genera la app (UUID aleatorio). */
export const ID_TRABAJO = /^[a-z0-9][a-z0-9-]{15,63}$/;
/** Identificador de un recorrido personal: también lo genera la app (otro UUID; no es el de ningún trabajo). */
export const ID_RECORRIDO = ID_TRABAJO;
/**
 * Estado de una unidad de un recorrido personal (src/pet/recorridos.js lo deduce de su lección y de su trabajo):
 * lista (validada y guardada en «Mis lecciones»), preparando, pendiente, error, interrumpida y sin-guardar (validada,
 * pero el navegador no la pudo guardar).
 */
export const ESTADOS_UNIDAD = ['lista', 'preparando', 'pendiente', 'error', 'interrumpida', 'sin-guardar'];
const ACCIONES = ['crear', 'adaptar', 'recorrido'];
const texto = (s, max) => (typeof s === 'string' ? s.replace(/\s+/g, ' ').trim().slice(0, max) : '');
const textoONulo = (s, max) => texto(s, max) || null;
const entero = (n, min, max) => (Number.isInteger(n) && n >= min && n <= max ? n : null);
const lista = (l, max, fn) => (Array.isArray(l) ? l.map(fn).filter((x) => x != null && x !== '').slice(0, max) : []);

/** Identificadores que existen, sin repetir y como mucho `max`. */
function soloValidos(l, validos, max) {
  if (!Array.isArray(l)) return [];
  const out = [];
  for (const x of l) if (typeof x === 'string' && validos.has(x) && !out.includes(x) && out.length < max) out.push(x);
  return out;
}

/** Lecciones recomendadas: [{ id, motivo }] con ids que existen, sin repetir. */
function recomendaciones(l, idsLecciones) {
  if (!Array.isArray(l)) return [];
  const out = [];
  for (const x of l) {
    const id = typeof x === 'string' ? x : x?.id;
    if (typeof id !== 'string' || !idsLecciones.has(id) || out.some((r) => r.id === id)) continue;
    out.push({ id, motivo: texto(x?.motivo, LIMITES.motivo) });
    if (out.length === LIMITES.lecciones) break;
  }
  return out;
}

/** Estado de la conversación que Neuri conserva: tema, objetivo, nivel y minutos. */
export function limpiarContexto(c) {
  if (!c || typeof c !== 'object') return { tema: null, objetivo: null, nivel: null, minutos: null };
  return { tema: textoONulo(c.tema, LIMITES.campo), objetivo: textoONulo(c.objetivo, LIMITES.largo), nivel: entero(c.nivel, 1, 3), minutos: entero(c.minutos, 3, 240) };
}

/**
 * Solicitud de crear o adaptar una lección, o de un recorrido personal por unidades (la prepara Orientar; la persona
 * la confirma). `idsRecorridos`: los recorridos personales de la persona (para cambiar uno: `recorrido_base`).
 */
export function limpiarSolicitud(s, idsLecciones = null, idsRecorridos = null) {
  if (!s || typeof s !== 'object' || !ACCIONES.includes(s.accion)) return null;
  const tema = texto(s.tema, LIMITES.campo);
  if (!tema) return null;
  const base = typeof s.leccion_base === 'string' && (!idsLecciones || idsLecciones.has(s.leccion_base)) ? s.leccion_base : null;
  if (s.accion === 'adaptar' && !base) return null;
  const sol = {
    accion: s.accion, tema, objetivo: texto(s.objetivo, LIMITES.largo), nivel: entero(s.nivel, 1, 3), minutos: entero(s.minutos, 3, 45),
    leccion_base: s.accion === 'adaptar' ? base : null, enfoque: texto(s.enfoque, LIMITES.largo),
    supuestos: lista(s.supuestos, 6, (x) => texto(x, LIMITES.campo)),
    // Términos anatómicos en inglés para buscar estructuras y fuentes (no se enseñan): sirven en cualquier idioma.
    terminos: lista(s.terminos, 12, (x) => texto(x, 60)),
    // La persona lo pidió expresamente («créame una lección…») y el alcance basta para planificar sin preguntar más:
    // la app empieza sin pedir otra confirmación.
    explicita: s.explicita === true,
    suficiente: s.suficiente === true,
  };
  if (s.accion === 'recorrido') {
    // En un recorrido, `minutos` es lo que dura cada unidad; `unidades`, cuántas pidió la persona (null si no lo dijo).
    sol.unidades = entero(s.unidades, 2, LIMITES.unidades);
    // El recorrido personal que se cambia, si es un cambio: solo uno de los de la persona (si no, es uno nuevo).
    sol.recorrido_base = typeof s.recorrido_base === 'string' && ID_RECORRIDO.test(s.recorrido_base) && (!idsRecorridos || idsRecorridos.has(s.recorrido_base)) ? s.recorrido_base : null;
  }
  // Una unidad de un recorrido personal: lo que la app cuenta del recorrido para planificarla sin repetir las demás.
  if (s.accion === 'crear' && s.recorrido && typeof s.recorrido === 'object') {
    const r = {
      titulo: texto(s.recorrido.titulo, LIMITES.campo), n: entero(s.recorrido.n, 1, LIMITES.unidades), total: entero(s.recorrido.total, 1, LIMITES.unidades),
      otras: lista(s.recorrido.otras, LIMITES.unidades - 1, (x) => texto(x, LIMITES.campo)),
    };
    if (r.titulo && r.n && r.total && r.n <= r.total) sol.recorrido = r;
  }
  return sol;
}

/**
 * Las unidades de un recorrido personal (las devuelve Planificar con una solicitud de recorrido; la app las guarda).
 * Forma, no contenido: el servidor comprueba el resto (server/pet.mjs, revisarRecorrido). Null si no sirve.
 */
export function limpiarRecorrido(r) {
  if (!r || typeof r !== 'object') return null;
  const titulo = texto(r.titulo, LIMITES.campo);
  if (!titulo) return null;
  return {
    titulo, resumen: texto(r.resumen, LIMITES.largo), objetivo: texto(r.objetivo, LIMITES.largo), nivel: entero(r.nivel, 1, 3) ?? 1,
    unidades: lista(r.unidades, LIMITES.unidades, (u) => {
      const t = u && typeof u === 'object' ? texto(u.titulo, LIMITES.campo) : '';
      if (!t) return null;
      return {
        // (Los minutos se acotan: una unidad de «90 minutos» es una lección larga, no una que no dice cuánto dura.)
        titulo: t, objetivo: texto(u.objetivo, LIMITES.largo), enfoque: texto(u.enfoque, LIMITES.largo), nivel: entero(u.nivel, 1, 3),
        minutos: Number.isInteger(u.minutos) && u.minutos > 0 ? Math.min(45, Math.max(3, u.minutos)) : null,
        terminos: lista(u.terminos, 12, (x) => texto(x, 60)),
        // Hasta 2 lecciones de la biblioteca que tratan algo parecido (el servidor solo deja las que existen).
        relacionadas: lista(u.relacionadas, 2, (x) => (typeof x === 'string' && /^[a-z0-9-]{2,100}$/.test(x) ? x : null)),
        // Al cambiar un recorrido: el número de la unidad que se conserva tal cual (con su lección), o null.
        conserva: entero(u.conserva, 1, LIMITES.unidades),
      };
    }),
    supuestos: lista(r.supuestos, 6, (x) => texto(x, LIMITES.campo)),
    limitaciones: lista(r.limitaciones, 6, (x) => texto(x, LIMITES.largo)),
  };
}

/** Lo que se cuenta a Neuri de un recorrido personal: su título y el estado real de cada unidad (nunca su progreso). */
function limpiarRecorridoPersonal(r, idsLecciones) {
  if (!r || typeof r !== 'object' || typeof r.id !== 'string' || !ID_RECORRIDO.test(r.id)) return null;
  const titulo = texto(r.titulo, LIMITES.campo);
  if (!titulo) return null;
  return {
    id: r.id, titulo,
    unidades: lista(r.unidades, LIMITES.unidades, (u) => (u && texto(u.titulo, LIMITES.campo) ? {
      titulo: texto(u.titulo, LIMITES.campo), estado: ESTADOS_UNIDAD.includes(u.estado) ? u.estado : 'pendiente',
      leccion: typeof u.leccion === 'string' && idsLecciones.has(u.leccion) ? u.leccion : null,
    } : null)),
  };
}

/**
 * El recorrido personal que se cambia, tal como lo tiene la app (viaja al planificar el cambio: los recorridos solo
 * están en el navegador). Las unidades con lección o en preparación no se pueden reescribir: se conservan o salen.
 */
function limpiarBaseRecorrido(b) {
  if (!b || typeof b !== 'object' || typeof b.id !== 'string' || !ID_RECORRIDO.test(b.id)) return null;
  const titulo = texto(b.titulo, LIMITES.campo);
  const unidades = lista(b.unidades, LIMITES.unidades, (u) => (u && texto(u.titulo, LIMITES.campo) ? {
    titulo: texto(u.titulo, LIMITES.campo), objetivo: texto(u.objetivo, LIMITES.largo), enfoque: texto(u.enfoque, LIMITES.largo),
    nivel: entero(u.nivel, 1, 3), minutos: entero(u.minutos, 3, 45), terminos: lista(u.terminos, 12, (x) => texto(x, 60)),
    estado: ESTADOS_UNIDAD.includes(u.estado) ? u.estado : 'pendiente',
  } : null));
  if (!titulo || !unidades.length) return null;
  return { id: b.id, titulo, objetivo: texto(b.objetivo, LIMITES.largo), unidades };
}

/** Resumen de una lección propia que se cuenta a Neuri (para recomendarla o adaptarla). */
function limpiarPropia(p) {
  if (!p || typeof p !== 'object' || typeof p.id !== 'string' || !ID_PROPIA.test(p.id)) return null;
  const titulo = texto(p.titulo, LIMITES.campo);
  if (!titulo) return null;
  return { id: p.id, titulo, resumen: texto(p.resumen, LIMITES.largo), minutos: entero(p.minutos, 3, 45) ?? 15, nivel: entero(p.nivel, 1, 3) ?? 1 };
}

/** Plan de una lección (lo devuelve Planificar; vuelve al servidor para redactar). Forma, no contenido: eso lo comprueba el servidor. */
export function limpiarPlan(p) {
  if (!p || typeof p !== 'object') return null;
  const titulo = texto(p.titulo, LIMITES.campo);
  if (!titulo) return null;
  return {
    titulo, resumen: texto(p.resumen, LIMITES.largo), nivel: entero(p.nivel, 1, 3) ?? 1, minutos: entero(p.minutos, 3, 45) ?? 15,
    formato: texto(p.formato, 40), sistemas: lista(p.sistemas, 6, (x) => texto(x, 40)), temas: lista(p.temas, 6, (x) => texto(x, 40)),
    lugares: lista(p.lugares, 6, (l) => (l && typeof l === 'object' && texto(l.region, 40) ? { region: texto(l.region, 40), subregion: textoONulo(l.subregion, 40) } : null)),
    objetivos: lista(p.objetivos, 6, (x) => texto(x, LIMITES.largo)),
    estructuras: lista(p.estructuras, 40, (e) => (e && typeof e.clave === 'string' && /^[A-Za-z0-9_()'.,-]{2,120}$/.test(e.clave) ? { clave: e.clave, papel: e.papel === 'nucleo' ? 'nucleo' : 'contexto' } : null)),
    pasos: lista(p.pasos, 9, (s) => (s && typeof s === 'object' ? { tipo: texto(s.tipo, 20), titulo: texto(s.titulo, LIMITES.campo), idea: texto(s.idea, LIMITES.largo), estructuras: lista(s.estructuras, 20, (k) => (typeof k === 'string' ? k.slice(0, 120) : null)) } : null)),
    paginas: lista(p.paginas, 4, (x) => texto(x, 120)),
    limitaciones: lista(p.limitaciones, 6, (x) => texto(x, LIMITES.largo)),
    supuestos: lista(p.supuestos, 6, (x) => texto(x, LIMITES.campo)),
    accion: p.accion === 'adaptar' ? 'adaptar' : 'crear',
    base: typeof p.base === 'string' ? p.base.slice(0, 100) : null,
  };
}

/**
 * Comprueba y recorta una petición de la app. Devuelve { ok: true, peticion } o { ok: false, error }.
 * `ids`: { lecciones: Set, recorridos: Set } (los de la biblioteca; las propias se añaden desde la petición).
 */
export function validarPeticion(cuerpo, ids) {
  if (!cuerpo || typeof cuerpo !== 'object' || Array.isArray(cuerpo)) return { ok: false, error: 'formato' };
  if (cuerpo.v !== VERSION) return { ok: false, error: 'version' };
  const modo = cuerpo.modo ?? 'orientar';
  if (!MODOS.includes(modo)) return { ok: false, error: 'modo' };
  const trabajo = typeof cuerpo.trabajo === 'string' && ID_TRABAJO.test(cuerpo.trabajo) ? cuerpo.trabajo : null;
  if (cuerpo.trabajo != null && !trabajo) return { ok: false, error: 'trabajo' };
  // Volver a un trabajo o cancelarlo: solo hace falta su identificador.
  if (modo === 'trabajo' || modo === 'cancelar') return trabajo ? { ok: true, peticion: { modo, trabajo } } : { ok: false, error: 'trabajo' };
  const idioma = IDIOMAS.includes(cuerpo.idioma) ? cuerpo.idioma : 'es';
  const propias = lista(cuerpo.propias, LIMITES.propias, limpiarPropia);
  const idsLecciones = new Set([...ids.lecciones, ...propias.map((p) => p.id)]);

  const mensajes = [];
  for (const m of Array.isArray(cuerpo.mensajes) ? cuerpo.mensajes.slice(-LIMITES.mensajes) : []) {
    if (m?.rol === 'usuario') {
      if (typeof m.texto !== 'string' || m.texto.length > LIMITES.usuario * 2) return { ok: false, error: 'largo' };
      const t = texto(m.texto, LIMITES.usuario);
      if (t) mensajes.push({ rol: 'usuario', texto: t });
    } else if (m?.rol === 'pet') {
      mensajes.push({ rol: 'pet', texto: texto(m.texto, LIMITES.pet), lecciones: recomendaciones(m.lecciones, idsLecciones), recorrido: ids.recorridos.has(m.recorrido) ? m.recorrido : null });
    } else return { ok: false, error: 'rol' };
  }
  // La conversación empieza con la persona y se alternan los turnos; en orientar, además, termina con ella.
  while (mensajes.length && mensajes[0].rol !== 'usuario') mensajes.shift();
  for (let i = 1; i < mensajes.length; i++) if (mensajes[i].rol === mensajes[i - 1].rol) return { ok: false, error: 'turnos' };
  if (modo === 'orientar' && (!mensajes.length || mensajes.at(-1).rol !== 'usuario')) return { ok: false, error: 'mensajes' };

  const p = cuerpo.progreso && typeof cuerpo.progreso === 'object' ? cuerpo.progreso : {};
  const progreso = {
    terminadas: soloValidos(p.terminadas, idsLecciones, LIMITES.progreso),
    enCurso: soloValidos(p.enCurso, idsLecciones, LIMITES.progreso),
    repasos: soloValidos(p.repasos, idsLecciones, LIMITES.progreso),
    guardadas: soloValidos(p.guardadas, new Set([...idsLecciones, ...ids.recorridos]), LIMITES.progreso),
  };
  // Los recorridos personales (solo en el navegador): su título y el estado de sus unidades, sin repetir.
  const recorridos = lista(cuerpo.recorridos, LIMITES.recorridos, (r) => limpiarRecorridoPersonal(r, idsLecciones))
    .filter((r, i, a) => a.findIndex((x) => x.id === r.id) === i);
  const idsRecorridos = new Set(recorridos.map((r) => r.id));
  const peticion = { modo, idioma, mensajes, progreso, propias, recorridos, contexto: limpiarContexto(cuerpo.contexto), trabajo };

  if (modo === 'planificar') {
    peticion.solicitud = limpiarSolicitud(cuerpo.solicitud, idsLecciones, idsRecorridos);
    if (!peticion.solicitud) return { ok: false, error: 'solicitud' };
    // Cambiar un recorrido: la app manda cómo es ahora (con el estado de cada unidad).
    if (peticion.solicitud.recorrido_base) {
      const b = limpiarBaseRecorrido(cuerpo.baseRecorrido);
      if (!b || b.id !== peticion.solicitud.recorrido_base) return { ok: false, error: 'base' };
      peticion.baseRecorrido = b;
    }
  }
  if (modo === 'redactar' || modo === 'adaptar') {
    peticion.plan = limpiarPlan(cuerpo.plan);
    if (!peticion.plan || peticion.plan.estructuras.length < 1 || peticion.plan.pasos.length < 4) return { ok: false, error: 'plan' };
    if ((modo === 'adaptar') !== (peticion.plan.accion === 'adaptar')) return { ok: false, error: 'plan' };
  }
  // La lección propia que se adapta viaja entera (la biblioteca la tiene el servidor; las propias, solo el navegador).
  const base = modo === 'adaptar' ? peticion.plan.base : modo === 'planificar' ? peticion.solicitud.leccion_base : null;
  if (base) {
    if (!idsLecciones.has(base)) return { ok: false, error: 'base' };
    if (ID_PROPIA.test(base)) {
      const L = cuerpo.base;
      if (!L || typeof L !== 'object' || L.id !== base || JSON.stringify(L).length > LIMITES.leccionBase) return { ok: false, error: 'base' };
      peticion.basePropia = L;
    }
  }
  return { ok: true, peticion };
}

/** Recorta y comprueba una respuesta de Orientar antes de mostrarla. Null si no sirve. */
export function limpiarRespuesta(r, ids) {
  if (!r || typeof r !== 'object') return null;
  const mensaje = typeof r.mensaje === 'string' ? r.mensaje.trim().slice(0, LIMITES.pet) : '';
  if (!mensaje) return null;
  const sugerencias = Array.isArray(r.sugerencias)
    ? [...new Set(r.sugerencias.map((s) => texto(s, LIMITES.sugerencia)).filter(Boolean))].slice(0, LIMITES.sugerencias)
    : [];
  const tipos = ['recomendacion', 'explicacion', 'aclaracion', 'propuesta', 'limitacion', 'salud', 'fuera_de_alcance'];
  const tipo = tipos.includes(r.tipo) ? r.tipo : 'recomendacion';
  const sesionIds = soloValidos(r.sesion?.lecciones, ids.lecciones, LIMITES.sesion);
  // (`ids.personales`: los recorridos personales de la persona, para que un cambio solo apunte a uno de ellos.)
  const solicitud = tipo === 'propuesta' ? limpiarSolicitud(r.solicitud, ids.lecciones, ids.personales ?? new Set()) : null;
  return {
    tipo: tipo === 'propuesta' && !solicitud ? 'aclaracion' : tipo,
    mensaje,
    lecciones: recomendaciones(r.lecciones, ids.lecciones),
    sesion: sesionIds.length >= 2 ? { lecciones: sesionIds, minutos: entero(r.sesion?.minutos, 1, 600) } : null,
    recorrido: typeof r.recorrido === 'string' && ids.recorridos.has(r.recorrido) ? r.recorrido : null,
    evidencias: Array.isArray(r.evidencias) ? r.evidencias.filter((e) => e && typeof e === 'object' && typeof e.cita === 'string').slice(0, LIMITES.evidencias).map((e) => ({
      cita: texto(e.cita, 600), texto: textoONulo(e.texto, 600), f: texto(e.f, 200), titulo: texto(e.titulo, 200), url: /^https:\/\//.test(e.url ?? '') ? String(e.url).slice(0, 400) : null,
      licencia: texto(e.licencia, 60), leccion: typeof e.leccion === 'string' && ids.lecciones.has(e.leccion) ? e.leccion : null, paso: textoONulo(e.paso, 40),
    })) : [],
    solicitud,
    contexto: limpiarContexto(r.contexto),
    sugerencias,
  };
}
