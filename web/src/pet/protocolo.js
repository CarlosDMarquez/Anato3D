// Neuri, el asistente de «Estudiar»: lo que se envían la app y el servidor (server/pet.mjs), con sus límites.
// Sin DOM: lo usan la app (src/pet/conversacion.js, src/ui/biblioteca/pet.js), el servidor y las pruebas.
//
// Modos (los pone la app según lo que se pulsa, nunca el texto de la conversación):
//   orientar    conversación: recomendar, explicar con evidencias, aclarar y preparar solicitudes
//   planificar  el alcance de una lección nueva o de una adaptación (tras pulsar «Planificar»)
//   redactar    la lección a partir del plan y las evidencias (tras pulsar «Crear la lección»)
//   adaptar     una lección existente según la petición (tras pulsar «Crear la adaptación»)
// Todo lo que llega de fuera (de la app o del modelo) se recorta y se comprueba aquí.

export const VERSION = 2;
export const IDIOMAS = ['es', 'en', 'de', 'fr', 'it'];
export const MODOS = ['orientar', 'planificar', 'redactar', 'adaptar'];

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
  campo: 160,          // caracteres de un campo corto (tema, título…)
  largo: 600,          // caracteres de un campo largo (objetivo, enfoque, resumen…)
  cuerpo: 64 * 1024,   // bytes de la petición (con el plan o la lección base)
  leccionBase: 200 * 1024, // bytes de una lección propia que se adapta
};

export const ID_PROPIA = /^neuri-[a-z0-9-]{3,80}$/;
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

/** Solicitud de crear o adaptar una lección (la prepara Orientar; la persona la confirma). */
export function limpiarSolicitud(s, idsLecciones = null) {
  if (!s || typeof s !== 'object' || !['crear', 'adaptar'].includes(s.accion)) return null;
  const tema = texto(s.tema, LIMITES.campo);
  if (!tema) return null;
  const base = typeof s.leccion_base === 'string' && (!idsLecciones || idsLecciones.has(s.leccion_base)) ? s.leccion_base : null;
  if (s.accion === 'adaptar' && !base) return null;
  return {
    accion: s.accion, tema, objetivo: texto(s.objetivo, LIMITES.largo), nivel: entero(s.nivel, 1, 3), minutos: entero(s.minutos, 3, 45),
    leccion_base: s.accion === 'adaptar' ? base : null, enfoque: texto(s.enfoque, LIMITES.largo),
    supuestos: lista(s.supuestos, 6, (x) => texto(x, LIMITES.campo)),
    // Términos anatómicos en inglés para buscar estructuras y fuentes (no se enseñan): sirven en cualquier idioma.
    terminos: lista(s.terminos, 12, (x) => texto(x, 60)),
  };
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
  const peticion = { modo, idioma, mensajes, progreso, propias, contexto: limpiarContexto(cuerpo.contexto) };

  if (modo === 'planificar') {
    peticion.solicitud = limpiarSolicitud(cuerpo.solicitud, idsLecciones);
    if (!peticion.solicitud) return { ok: false, error: 'solicitud' };
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
  const solicitud = tipo === 'propuesta' ? limpiarSolicitud(r.solicitud, ids.lecciones) : null;
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
