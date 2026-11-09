// La conversación con Neuri en la app: guarda los mensajes y el estado (tema, objetivo, nivel y minutos), pregunta al
// servidor (server/pet.mjs, en /api/pet) en el modo que toca y, si no hay servidor, clave o conexión, responde con el
// buscador (src/pet/local.js). Sin DOM: lo prueba `npm test`.
//
// Mensajes: { rol: 'usuario' | 'pet', tipo, texto, … }. Tipos de Neuri:
//   recomendacion | explicacion | aclaracion | propuesta (con «solicitud») | limitacion | salud | fuera_de_alcance
//   plan        (con «plan»: la propuesta de lección que la persona puede crear)
//   generacion  (con «generacion»: { estado, … }: fuentes → redactando → comprobando → corrigiendo → lista → guardada,
//               o limitacion / error); «guardada» solo la pone la app cuando la lección está en «Mis lecciones».
// La conversación se guarda en sessionStorage (se pierde al cerrar la pestaña).
import { VERSION, LIMITES, limpiarRespuesta, limpiarContexto, limpiarPlan } from './protocolo.js';

export const URL_API = '/api/pet';
export const CLAVE_SESION = 'anato3d.neuri';
const ESPERA_MS = 45_000;
const ESPERA_LECCION_MS = 300_000;

/**
 * `ids`: { lecciones: Set, recorridos: Set } (con las propias). `local(texto)`: respuesta del buscador. `progreso()`:
 * resumen del progreso. `propias()`: resúmenes de «Mis lecciones». `idioma()`: el de la interfaz. `fetch`: el del navegador.
 */
export function crearConversacion({ ids, local, progreso, propias = () => [], idioma, fetch = globalThis.fetch?.bind(globalThis), almacen = null, url = URL_API }) {
  let { mensajes, contexto } = leer(almacen);
  let ia = null;            // ¿hay IA? null: aún no se sabe
  let crear = null;         // ¿se pueden crear lecciones? (IA y fuentes en el servidor)
  let ocupada = false;
  let control = null;       // para cancelar una creación

  const guardar = () => {
    try { almacen?.setItem(CLAVE_SESION, JSON.stringify({ mensajes: mensajes.slice(-40), contexto })); } catch { /* sin almacenamiento */ }
  };

  async function comprobar() {
    if (ia !== null) return ia;
    try {
      const r = await conTiempo(fetch, url, { method: 'GET', headers: { accept: 'application/json' } }, 12_000);
      const d = r.ok ? await r.json() : null;
      ia = d?.ok === true && d.ia === true;
      crear = ia && d.crear === true;
    } catch { ia = false; crear = false; }
    return ia;
  }

  const comun = () => ({ v: VERSION, idioma: idioma(), progreso: progreso(), propias: propias(), contexto });
  /**
   * Lo que se envía al servidor: los últimos turnos, empezando por la persona. Los de Neuri seguidos (una propuesta, su
   * plan y la creación) se juntan en uno, con un resumen de cada cosa, para que Neuri sepa sobre qué se le pide un cambio
   * («quita el maxilar», «hazla más corta»).
   */
  function historial() {
    const turnos = [];
    for (const m of mensajes) {
      if (m.rol === 'usuario') { turnos.push({ rol: 'usuario', texto: m.texto }); continue; }
      const texto = resumenTurno(m);
      if (!texto) continue;
      const previo = turnos.at(-1);
      if (previo?.rol === 'pet') {
        previo.texto = `${previo.texto}\n${texto}`.slice(-LIMITES.pet);
        if (m.lecciones?.length) previo.lecciones = m.lecciones;
        previo.recorrido = m.recorrido ?? previo.recorrido;
      } else turnos.push({ rol: 'pet', texto: texto.slice(-LIMITES.pet), lecciones: m.lecciones ?? [], recorrido: m.recorrido ?? null });
    }
    const ultimos = turnos.slice(-LIMITES.mensajes);
    while (ultimos.length && ultimos[0].rol !== 'usuario') ultimos.shift();
    return ultimos;
  }

  async function una(fn) {
    if (ocupada) return null;
    ocupada = true;
    try { return await fn(); } finally { ocupada = false; control = null; }
  }

  /** Orientar: envía `texto` y devuelve la respuesta de Neuri (ya añadida). */
  function preguntar(texto) {
    const limpio = String(texto ?? '').replace(/\s+/g, ' ').trim().slice(0, LIMITES.usuario);
    if (!limpio || ocupada) return Promise.resolve(null);
    return una(async () => {
      mensajes.push({ rol: 'usuario', texto: limpio });
      guardar();
      let respuesta = null;
      let aviso = null;
      if (ia !== false) {
        try {
          const r = await conTiempo(fetch, url, { method: 'POST', headers: JSON_H, body: JSON.stringify({ ...comun(), modo: 'orientar', mensajes: historial() }) }, ESPERA_MS);
          const d = await r.json().catch(() => null);
          if (r.ok && d?.ok) {
            respuesta = limpiarRespuesta(d, ids);
            if (respuesta) { respuesta.origen = 'ia'; respuesta.aviso = ['sin-evidencia', 'sin-respaldo'].includes(d.aviso) ? d.aviso : null; ia = true; } else aviso = 'error';
          } else aviso = codigoAviso(r, d);
          if (aviso === 'sin-ia') ia = false;
        } catch { aviso = 'error'; }
      } else aviso = 'sin-ia';
      if (!respuesta) {
        respuesta = { tipo: 'recomendacion', ...local(limpio), origen: 'buscador' };
        respuesta.aviso = aviso === 'sin-ia' ? null : aviso;
      }
      if (respuesta.contexto) contexto = limpiarContexto(respuesta.contexto);
      const m = {
        rol: 'pet', tipo: respuesta.tipo ?? 'recomendacion', texto: respuesta.mensaje, lecciones: respuesta.lecciones ?? [], sesion: respuesta.sesion ?? null,
        recorrido: respuesta.recorrido ?? null, evidencias: respuesta.evidencias ?? [], solicitud: respuesta.solicitud ?? null,
        sugerencias: respuesta.sugerencias ?? [], origen: respuesta.origen, aviso: respuesta.aviso ?? null,
      };
      mensajes.push(m);
      guardar();
      return m;
    });
  }

  /** Planificar una solicitud (la persona pulsó «Planificar»). `base`: la lección propia que se adapta, entera. */
  function planificar(solicitud, { base = null } = {}) {
    return una(async () => {
      let m;
      try {
        const r = await conTiempo(fetch, url, { method: 'POST', headers: JSON_H, body: JSON.stringify({ ...comun(), modo: 'planificar', mensajes: historial(), solicitud, ...(base ? { base } : {}) }) }, ESPERA_MS * 2);
        const d = await r.json().catch(() => null);
        if (r.ok && d?.ok && d.tipo === 'plan' && limpiarPlan(d.plan)) {
          m = { rol: 'pet', tipo: 'plan', texto: String(d.mensaje ?? '').slice(0, LIMITES.pet), plan: { ...limpiarPlan(d.plan), accion: d.plan.accion, base: d.plan.base ?? null }, estructuras: d.estructuras ?? {}, paginas: d.paginas ?? [], sugerencias: [], origen: 'ia' };
        } else if (r.ok && d?.ok) {
          m = { rol: 'pet', tipo: d.tipo === 'aclaracion' ? 'aclaracion' : 'limitacion', texto: String(d.mensaje ?? '').slice(0, LIMITES.pet), codigo: d.codigo ?? null, sugerencias: (d.sugerencias ?? []).slice(0, LIMITES.sugerencias), origen: 'ia' };
        } else m = { rol: 'pet', tipo: 'error', texto: '', codigo: codigoAviso(r, d), origen: 'app' };
      } catch { m = { rol: 'pet', tipo: 'error', texto: '', codigo: 'error', origen: 'app' }; }
      mensajes.push(m);
      guardar();
      return m;
    });
  }

  /**
   * Crear (o adaptar) la lección de un plan. Lee el flujo del servidor y va llamando a `alEstado(evento)`. Devuelve el
   * último evento ({ estado: 'lista', leccion, informe, mensaje } o limitacion / error). La app guarda la lección y
   * marca el mensaje como «guardada» con `confirmarGuardada`.
   */
  function crearLeccion(plan, { base = null, alEstado = () => {} } = {}) {
    return una(async () => {
      const m = { rol: 'pet', tipo: 'generacion', texto: '', generacion: { estado: 'solicitada', titulo: plan.titulo, accion: plan.accion }, origen: 'app' };
      mensajes.push(m);
      guardar();
      const poner = (e) => {
        const { leccion, ...resto } = e;
        m.generacion = { ...m.generacion, ...resto, ...(leccion ? { leccionId: leccion.id } : {}) };
        if (e.mensaje) m.texto = String(e.mensaje).slice(0, LIMITES.pet);
        guardar();
        alEstado(e);
      };
      control = new AbortController();
      let ultimo = null;
      try {
        const r = await conTiempo(fetch, url, {
          method: 'POST', headers: { ...JSON_H, accept: 'application/x-ndjson' },
          body: JSON.stringify({ ...comun(), modo: plan.accion === 'adaptar' ? 'adaptar' : 'redactar', mensajes: [], plan, ...(base ? { base } : {}) }),
        }, ESPERA_LECCION_MS, control);
        if (!r.ok) {
          const d = await r.json().catch(() => null);
          ultimo = { estado: 'error', error: codigoAviso(r, d) };
          poner(ultimo);
          return ultimo;
        }
        for await (const e of lineas(r)) { ultimo = e; poner(e); }
      } catch (err) {
        ultimo = { estado: 'error', error: err?.name === 'AbortError' ? 'cancelada' : 'error' };
        poner(ultimo);
        return ultimo;
      }
      if (!ultimo || !['lista', 'limitacion', 'error'].includes(ultimo.estado)) { ultimo = { estado: 'error', error: 'incompleta' }; poner(ultimo); }
      return ultimo;
    });
  }

  return {
    get mensajes() { return mensajes; },
    get contexto() { return contexto; },
    get ocupada() { return ocupada; },
    get ia() { return ia; },
    get crear() { return crear; },
    comprobar, preguntar, planificar, crearLeccion,
    cancelar() { control?.abort(); },
    /** La app confirma que guardó la lección del mensaje `m` (solo entonces se dice que está disponible). */
    confirmarGuardada(m, ok, detalle = null) {
      m.generacion = { ...m.generacion, estado: ok ? 'guardada' : 'no-guardada', detalle };
      guardar();
    },
    reiniciar() { mensajes = []; contexto = limpiarContexto(null); guardar(); },
  };
}

const JSON_H = { 'content-type': 'application/json', accept: 'application/json' };

/** Un turno de Neuri tal como se le recuerda: su texto y, entre corchetes, lo que la app mostró (propuesta, plan, creación). */
function resumenTurno(m) {
  const s = m.solicitud;
  if (m.tipo === 'propuesta' && s) {
    return `${m.texto}\n[Propuesta mostrada (${s.accion}${s.leccion_base ? ` de ${s.leccion_base}` : ''}): tema: ${s.tema}; objetivo: ${s.objetivo || '—'}; nivel: ${s.nivel ?? '—'}; minutos: ${s.minutos ?? '—'}; enfoque: ${s.enfoque || '—'}.]`;
  }
  if (m.tipo === 'plan' && m.plan) {
    const p = m.plan;
    const nombre = (k) => m.estructuras?.[k]?.nombre ?? k;
    return `${m.texto}\n[Plan mostrado: «${p.titulo}», ${p.minutos} min, nivel ${p.nivel}${p.base ? `, adaptación de ${p.base}` : ''}. Objetivos: ${p.objetivos.join(' / ')}. Estructuras: ${p.estructuras.map((e) => `${nombre(e.clave)}${e.papel === 'nucleo' ? '' : ' (contexto)'}`).join(', ')}. Pasos: ${p.pasos.map((x) => x.titulo).join(' / ')}.]`;
  }
  if (m.tipo === 'generacion') {
    const g = m.generacion ?? {};
    if (g.estado === 'guardada') return `[La app guardó la lección «${g.titulo}» (${g.leccionId}) en Mis lecciones.]`;
    if (['error', 'limitacion', 'no-guardada'].includes(g.estado)) return `[No se creó «${g.titulo}»: ${g.error ?? g.codigo ?? g.estado}.]`;
    return '';
  }
  if (m.tipo === 'error') return '';
  return m.texto;
}

/** Código para avisar en la app según la respuesta del servidor. */
function codigoAviso(r, d) {
  const e = d?.error;
  if (e === 'limite' || e === 'ocupado' || e === 'sin-recursos' || e === 'base' || e === 'plan') return e;
  if (e === 'sin-ia' || r.status === 404 || r.status === 503) return 'sin-ia';
  return 'error';
}

/** Las líneas JSON de una respuesta en flujo (NDJSON), según llegan. */
async function* lineas(respuesta) {
  const lector = respuesta.body?.getReader?.();
  if (!lector) {
    for (const l of (await respuesta.text()).split('\n')) if (l.trim()) yield JSON.parse(l);
    return;
  }
  const dec = new TextDecoder();
  let resto = '';
  for (;;) {
    const { done, value } = await lector.read();
    if (value) resto += dec.decode(value, { stream: !done });
    let i;
    while ((i = resto.indexOf('\n')) >= 0) {
      const l = resto.slice(0, i).trim();
      resto = resto.slice(i + 1);
      if (l) { try { yield JSON.parse(l); } catch { /* línea rota: se ignora */ } }
    }
    if (done) break;
  }
  if (resto.trim()) { try { yield JSON.parse(resto); } catch { /* nada */ } }
}

function leer(almacen) {
  try {
    const d = JSON.parse(almacen?.getItem(CLAVE_SESION) ?? 'null');
    // La versión anterior guardaba solo la lista de mensajes.
    const lista = Array.isArray(d) ? d : Array.isArray(d?.mensajes) ? d.mensajes : [];
    const mensajes = lista.filter((m) => (m?.rol === 'usuario' || m?.rol === 'pet') && typeof m.texto === 'string')
      // Una creación que quedó a medias al cerrar no puede seguir: se marca como interrumpida.
      .map((m) => (m.tipo === 'generacion' && !['lista', 'guardada', 'no-guardada', 'limitacion', 'error'].includes(m.generacion?.estado) ? { ...m, generacion: { ...m.generacion, estado: 'error', error: 'interrumpida' } } : m));
    return { mensajes, contexto: limpiarContexto(d?.contexto) };
  } catch { return { mensajes: [], contexto: limpiarContexto(null) }; }
}

async function conTiempo(fetch, url, opciones, ms, control = new AbortController()) {
  const reloj = setTimeout(() => control.abort(), ms);
  try { return await fetch(url, { ...opciones, signal: control.signal }); }
  finally { clearTimeout(reloj); }
}
