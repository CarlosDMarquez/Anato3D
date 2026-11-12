// La conversación con Neuri en la app: guarda los mensajes y el estado (tema, objetivo, nivel y minutos), pregunta al
// servidor (server/pet.mjs, en /api/pet) en el modo que toca y, si no hay servidor, clave o conexión, responde con el
// buscador (src/pet/local.js). Sin DOM: lo prueba `npm test`.
//
// Mensajes: { rol: 'usuario' | 'pet', tipo, texto, … }. Tipos de Neuri:
//   recomendacion | explicacion | aclaracion | propuesta (con «solicitud») | limitacion | salud | fuera_de_alcance
//   plan        (con «plan»: el alcance de una lección; de la versión anterior, cuando se planificaba aparte)
//   trabajo     (con «trabajo»: el identificador de una creación de src/pet/trabajos.js y su último resumen)
//   recorrido   (con «recorrido»: el identificador de un recorrido personal de src/pet/recorridos.js y su último resumen)
//   error       (con «codigo»: lo que falló, para reintentar)
// La conversación se guarda en sessionStorage (se pierde al cerrar la pestaña); las lecciones creadas, no: viven en
// «Mis lecciones» (src/biblioteca/propias.js) y los trabajos en curso, en src/pet/trabajos.js.
//
// Robustez (especificación de Neuri, sección 13):
//  - cada envío termina en una respuesta (de la IA o del buscador), una aclaración, una cancelación o un error que se
//    puede reintentar; los plazos cubren también la lectura de la respuesta (src/pet/red.js);
//  - una petición cada vez; «cancelar» y «nueva conversación» la cortan, y lo que llegue de antes se descarta (épocas);
//  - un fallo pasajero no apaga la IA para siempre: se vuelve a probar al cabo de un rato; una información antigua (la
//    comprobación inicial) no pisa una más nueva (una respuesta buena).
import { VERSION, LIMITES, limpiarRespuesta, limpiarContexto, limpiarPlan } from './protocolo.js';
import { pedirJSON, cortar, motivo, nuevoId } from './red.js';

export const URL_API = '/api/pet';
export const CLAVE_SESION = 'anato3d.neuri';
/** Plazos de la app (algo más que lo que puede tardar el servidor en cada modo, server/pet.mjs). */
export const PLAZOS = { comprobar: 12_000, orientar: 75_000, planificar: 150_000 };
/** Tras un fallo, cuánto se espera antes de volver a probar la IA. */
export const ESPERAS = { caida: 30_000, sinClave: 60_000, sinServidor: 5 * 60_000, sinSaldo: 10 * 60_000 };
const JSON_H = { 'content-type': 'application/json', accept: 'application/json' };
/** Avisos que se enseñan junto a una respuesta del buscador (los demás fallos se avisan como «error»). */
const AVISOS = new Set(['limite', 'ocupado', 'tiempo', 'conexion', 'no-disponible', 'sin-saldo', 'error']);

/**
 * `ids`: { lecciones: Set, recorridos: Set, personales?: Set } (con las propias y los recorridos personales).
 * `local(texto)`: respuesta del buscador. `progreso()`: resumen del progreso. `propias()`: resúmenes de «Mis lecciones».
 * `recorridos()`: resúmenes de los recorridos personales. `idioma()`: el de la interfaz. `fetch`: el del navegador.
 * `ahora` y `plazos`: el reloj y los plazos (las pruebas los cambian).
 */
export function crearConversacion({ ids, local, progreso, propias = () => [], recorridos = () => [], idioma, fetch = globalThis.fetch?.bind(globalThis), almacen = null, url = URL_API, ahora = Date.now, plazos = PLAZOS }) {
  let { mensajes, contexto } = leer(almacen);
  // El servicio de IA: desconocido, disponible, sin-clave, sin-servidor, sin-saldo o no-disponible (pasajero). `marca`:
  // el orden en que empezó la petición que lo dijo (lo más nuevo manda; un contador, porque dos peticiones pueden
  // empezar en el mismo milisegundo); `hasta`: cuándo se vuelve a probar.
  const servicio = { estado: 'desconocido', hasta: 0, marca: 0, crear: null };
  let marcas = 0;
  const marcar = () => ++marcas;
  let epoca = 0;
  let enCurso = null;          // { id, tipo, control }

  const guardar = () => {
    try { almacen?.setItem(CLAVE_SESION, JSON.stringify({ mensajes: mensajes.slice(-40), contexto })); } catch { /* sin almacenamiento */ }
  };

  function anotarServicio(estado, marca, { espera = 0, crear } = {}) {
    if (marca < servicio.marca) return;           // una noticia más antigua no pisa una más nueva
    servicio.estado = estado;
    servicio.marca = marca;
    servicio.hasta = espera ? ahora() + espera : 0;
    if (crear !== undefined) servicio.crear = crear;
  }
  const iaUsable = () => ['desconocido', 'disponible'].includes(servicio.estado) || ahora() >= servicio.hasta;
  /** Lo que dice una respuesta mala del servidor sobre el servicio. */
  function anotarFallo(codigo, r, marca) {
    if (codigo === 'sin-ia') anotarServicio('sin-clave', marca, { espera: ESPERAS.sinClave, crear: false });
    else if (codigo === 'sin-servidor') anotarServicio('sin-servidor', marca, { espera: ESPERAS.sinServidor, crear: false });
    else if (codigo === 'sin-saldo') anotarServicio('sin-saldo', marca, { espera: ESPERAS.sinSaldo });
    else if (codigo === 'tiempo' || codigo === 'conexion') anotarServicio('no-disponible', marca, { espera: ESPERAS.caida });
    void r;
  }

  /** ¿Hay IA? Pregunta al servidor si aún no se sabe o si ya toca volver a probar. */
  async function comprobar() {
    if (servicio.estado === 'disponible' || (servicio.estado !== 'desconocido' && !iaUsable())) return servicio.estado === 'disponible';
    const marca = marcar();
    try {
      const { r, d } = await pedirJSON(fetch, url, { method: 'GET', headers: { accept: 'application/json' } }, plazos.comprobar);
      if (r.ok && d?.ok === true && d.ia === true) anotarServicio('disponible', marca, { crear: d.crear === true });
      else if (r.ok && d?.ok === true) anotarServicio('sin-clave', marca, { espera: ESPERAS.sinClave, crear: false });
      else anotarServicio('sin-servidor', marca, { espera: ESPERAS.sinServidor, crear: false });
    } catch {
      anotarServicio('sin-servidor', marca, { espera: ESPERAS.sinServidor, crear: false });
    }
    return servicio.estado === 'disponible';
  }

  const comun = () => ({ v: VERSION, idioma: idioma(), progreso: progreso(), propias: propias(), recorridos: recorridos(), contexto });

  /**
   * Lo que se envía al servidor: los últimos turnos, empezando por la persona. Los de Neuri seguidos (una propuesta, su
   * plan y la creación) se juntan en uno, con un resumen de cada cosa, para que Neuri sepa sobre qué se le pide un cambio
   * («quita el maxilar», «hazla más corta»). Los mensajes cancelados no cuentan; de dos de la persona seguidos (uno se
   * quedó sin respuesta), el último.
   */
  function historial() {
    const turnos = [];
    for (const m of mensajes) {
      if (m.rol === 'usuario') {
        if (m.cancelada) continue;
        if (turnos.at(-1)?.rol === 'usuario') turnos.pop();
        turnos.push({ rol: 'usuario', texto: m.texto });
        continue;
      }
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

  /** Empieza una petición (una cada vez): devuelve su control, o null si ya hay otra. */
  function empezar(tipo) {
    if (enCurso) return null;
    enCurso = { id: nuevoId(), tipo, control: new AbortController(), epoca };
    return enCurso;
  }
  const terminar = (p) => { if (enCurso?.id === p.id) enCurso = null; };
  const vigente = (p) => p.epoca === epoca;

  /** Orientar: envía `texto` y devuelve la respuesta de Neuri (ya añadida), o null si se canceló o no se pudo enviar. */
  function preguntar(texto) {
    const limpio = String(texto ?? '').replace(/\s+/g, ' ').trim().slice(0, LIMITES.usuario);
    if (!limpio) return Promise.resolve(null);
    const p = empezar('orientar');
    if (!p) return Promise.resolve(null);
    mensajes.push({ rol: 'usuario', texto: limpio, id: p.id });
    guardar();
    return (async () => {
      try {
        let respuesta = null;
        let aviso = null;
        if (iaUsable()) {
          const marca = marcar();
          try {
            const { r, d } = await pedirJSON(fetch, url, { method: 'POST', headers: JSON_H, body: JSON.stringify({ ...comun(), modo: 'orientar', mensajes: historial() }) }, plazos.orientar, p.control);
            if (r.ok && d?.ok) {
              respuesta = limpiarRespuesta(d, ids);
              if (respuesta) {
                respuesta.origen = 'ia';
                respuesta.aviso = ['sin-evidencia', 'sin-respaldo'].includes(d.aviso) ? d.aviso : null;
                anotarServicio('disponible', marca);
              } else aviso = 'error';
            } else {
              aviso = codigoAviso(r, d);
              anotarFallo(aviso, r, marca);
            }
          } catch (err) {
            if (motivo(p.control) === 'cancelada' || !vigente(p)) return null;
            aviso = motivo(p.control) === 'tiempo' || err.motivo === 'tiempo' ? 'tiempo' : 'conexion';
            anotarFallo(aviso, null, marca);
          }
        } else aviso = ['sin-clave', 'sin-servidor'].includes(servicio.estado) ? null : 'no-disponible';
        if (!vigente(p)) return null;                // se reinició o se canceló mientras tanto
        if (!respuesta) {
          // Respaldo: el buscador de la app. Si también falla, un error que se puede reintentar (nunca un silencio).
          try {
            respuesta = { tipo: 'recomendacion', ...local(limpio), origen: 'buscador' };
            // Sin clave o sin servidor, la nota de abajo ya lo explica; un fallo de este momento se avisa en la respuesta.
            respuesta.aviso = !aviso || ['sin-ia', 'sin-servidor'].includes(aviso) ? null : AVISOS.has(aviso) ? aviso : 'error';
          } catch {
            respuesta = { tipo: 'error', mensaje: '', codigo: 'local', origen: 'app' };
          }
        }
        if (respuesta.contexto) contexto = limpiarContexto(respuesta.contexto);
        const m = respuesta.tipo === 'error'
          ? { rol: 'pet', tipo: 'error', texto: '', codigo: respuesta.codigo, reintentar: limpio, origen: 'app' }
          : {
            rol: 'pet', tipo: respuesta.tipo ?? 'recomendacion', texto: respuesta.mensaje, lecciones: respuesta.lecciones ?? [], sesion: respuesta.sesion ?? null,
            recorrido: respuesta.recorrido ?? null, evidencias: respuesta.evidencias ?? [], solicitud: respuesta.solicitud ?? null,
            sugerencias: respuesta.sugerencias ?? [], origen: respuesta.origen, aviso: respuesta.aviso ?? null,
          };
        mensajes.push(m);
        guardar();
        return m;
      } finally { terminar(p); }
    })();
  }

  /**
   * Planificar una solicitud (de la versión anterior de la interfaz, y para las pruebas: la app crea ahora con
   * src/pet/trabajos.js, que planifica y redacta seguido). `base`: la lección propia que se adapta, entera.
   */
  function planificar(solicitud, { base = null } = {}) {
    const p = empezar('planificar');
    if (!p) return Promise.resolve(null);
    return (async () => {
      try {
        let m;
        try {
          const { r, d } = await pedirJSON(fetch, url, { method: 'POST', headers: JSON_H, body: JSON.stringify({ ...comun(), modo: 'planificar', mensajes: historial(), solicitud, ...(base ? { base } : {}) }) }, plazos.planificar, p.control);
          if (r.ok && d?.ok && d.tipo === 'plan' && limpiarPlan(d.plan)) {
            m = { rol: 'pet', tipo: 'plan', texto: String(d.mensaje ?? '').slice(0, LIMITES.pet), plan: { ...limpiarPlan(d.plan), accion: d.plan.accion, base: d.plan.base ?? null }, estructuras: d.estructuras ?? {}, paginas: d.paginas ?? [], sugerencias: [], origen: 'ia' };
          } else if (r.ok && d?.ok) {
            m = { rol: 'pet', tipo: d.tipo === 'aclaracion' ? 'aclaracion' : 'limitacion', texto: String(d.mensaje ?? '').slice(0, LIMITES.pet), codigo: d.codigo ?? null, sugerencias: (d.sugerencias ?? []).slice(0, LIMITES.sugerencias), origen: 'ia' };
          } else m = { rol: 'pet', tipo: 'error', texto: '', codigo: codigoAviso(r, d), origen: 'app' };
        } catch (err) {
          if (motivo(p.control) === 'cancelada' || !vigente(p)) return null;
          m = { rol: 'pet', tipo: 'error', texto: '', codigo: motivo(p.control) === 'tiempo' || err.motivo === 'tiempo' ? 'tiempo' : 'conexion', origen: 'app' };
        }
        if (!vigente(p)) return null;
        mensajes.push(m);
        guardar();
        return m;
      } finally { terminar(p); }
    })();
  }

  /** Corta la petición en curso (orientar o planificar). Lo que llegue después se descarta. Devuelve si había algo. */
  function cancelar() {
    if (!enCurso) return false;
    const p = enCurso;
    cortar(p.control, 'cancelada');
    epoca++;
    const m = mensajes.find((x) => x.id === p.id);
    if (m) m.cancelada = true;
    enCurso = null;
    guardar();
    return true;
  }

  return {
    get mensajes() { return mensajes; },
    get contexto() { return contexto; },
    get ocupada() { return !!enCurso; },
    /** true, false (sin IA ahora) o null (aún no se sabe). */
    get ia() { return servicio.estado === 'disponible' ? true : servicio.estado === 'desconocido' ? null : false; },
    get crear() { return servicio.crear; },
    /** Estado del servicio para la interfaz: { estado, hasta }. */
    get servicio() { return { estado: servicio.estado, hasta: servicio.hasta }; },
    comprobar, preguntar, planificar, cancelar, historial,
    /** Lo que va en toda petición: versión, idioma, progreso, lecciones propias y el estado de la conversación. */
    comun,
    /** Anota en la conversación una creación (src/pet/trabajos.js) para enseñar su estado ahí. */
    anotarTrabajo(id, resumen) {
      const m = { rol: 'pet', tipo: 'trabajo', texto: '', trabajo: id, resumen: { ...resumen }, origen: 'app' };
      mensajes.push(m);
      guardar();
      return m;
    },
    /** Una creación que se volvió a empezar con otro identificador (src/pet/trabajos.js, reintentar): el mismo mensaje. */
    cambiarTrabajo(viejo, nuevo, resumen) {
      const m = mensajes.find((x) => x.tipo === 'trabajo' && x.trabajo === viejo);
      if (!m) return null;
      m.trabajo = nuevo;
      m.resumen = { ...resumen };
      guardar();
      return m;
    },
    /** ¿Hay un mensaje de esta creación en la conversación? */
    tieneTrabajo: (id) => mensajes.some((x) => x.tipo === 'trabajo' && x.trabajo === id),
    /** Actualiza el resumen de una creación (estado, título, lección) en su mensaje. */
    resumirTrabajo(id, resumen) {
      const m = mensajes.find((x) => x.tipo === 'trabajo' && x.trabajo === id);
      if (!m) return;
      m.resumen = { ...m.resumen, ...resumen };
      guardar();
    },
    /** Anota en la conversación un recorrido personal (src/pet/recorridos.js) para enseñar ahí sus unidades. */
    anotarRecorrido(id, resumen) {
      const m = { rol: 'pet', tipo: 'recorrido', texto: '', recorrido: id, resumen: { ...resumen }, origen: 'app' };
      mensajes.push(m);
      guardar();
      return m;
    },
    /** ¿Hay un mensaje de este recorrido en la conversación? */
    tieneRecorrido: (id) => mensajes.some((x) => x.tipo === 'recorrido' && x.recorrido === id),
    /** Actualiza lo que se recuerda de un recorrido (su estado y el de sus unidades) en sus mensajes. */
    resumirRecorrido(id, resumen) {
      let hay = false;
      for (const m of mensajes) if (m.tipo === 'recorrido' && m.recorrido === id) { m.resumen = { ...m.resumen, ...resumen }; hay = true; }
      if (hay) guardar();
    },
    /** Nueva conversación: corta lo que esté en curso (las creaciones siguen: son trabajos aparte). */
    reiniciar() {
      if (enCurso) { cortar(enCurso.control, 'cancelada'); enCurso = null; }
      epoca++;
      mensajes = [];
      contexto = limpiarContexto(null);
      guardar();
    },
  };
}

const ESTADO_UNIDAD = { lista: 'lista para estudiar', preparando: 'en preparación', pendiente: 'pendiente', error: 'no se pudo crear', interrumpida: 'interrumpida', 'sin-guardar': 'lista pero sin guardar' };

/** Un turno de Neuri tal como se le recuerda: su texto y, entre corchetes, lo que la app mostró (propuesta, plan, creación, recorrido). */
function resumenTurno(m) {
  const s = m.solicitud;
  if (m.tipo === 'propuesta' && s) {
    const de = s.leccion_base ? ` de ${s.leccion_base}` : s.recorrido_base ? ` de ${s.recorrido_base}` : '';
    const cuantas = s.accion === 'recorrido' ? `; unidades: ${s.unidades ?? '—'}; minutos de cada unidad: ${s.minutos ?? '—'}` : `; minutos: ${s.minutos ?? '—'}`;
    return `${m.texto}\n[Propuesta mostrada (${s.accion}${de}): tema: ${s.tema}; objetivo: ${s.objetivo || '—'}; nivel: ${s.nivel ?? '—'}${cuantas}; enfoque: ${s.enfoque || '—'}.]`;
  }
  if (m.tipo === 'recorrido') {
    const r = m.resumen ?? {};
    if (!r.titulo) return '';
    const unidades = (r.unidades ?? []).map((u, i) => `${i + 1}. ${u.titulo} (${ESTADO_UNIDAD[u.estado] ?? u.estado}${u.leccion ? `: ${u.leccion}` : ''})`).join('; ');
    if (r.quitado) return `[La persona quitó el recorrido personal «${r.titulo}»; sus lecciones siguen en Mis lecciones.]`;
    if (unidades) return `[Recorrido personal «${r.titulo}» (${m.recorrido})${r.estado === 'planificando' ? ', cambiándose' : ''}: ${unidades}.]`;
    if (r.estado === 'planificando') return `[Planificando las unidades del recorrido personal «${r.titulo}».]`;
    return `[No se planificó el recorrido «${r.titulo}»: ${r.error ?? r.codigo ?? r.estado}.${r.mensaje ? ` ${r.mensaje}` : ''}]`;
  }
  if (m.tipo === 'plan' && m.plan) {
    const p = m.plan;
    const nombre = (k) => m.estructuras?.[k]?.nombre ?? k;
    return `${m.texto}\n[Plan mostrado: «${p.titulo}», ${p.minutos} min, nivel ${p.nivel}${p.base ? `, adaptación de ${p.base}` : ''}. Objetivos: ${p.objetivos.join(' / ')}. Estructuras: ${p.estructuras.map((e) => `${nombre(e.clave)}${e.papel === 'nucleo' ? '' : ' (contexto)'}`).join(', ')}. Pasos: ${p.pasos.map((x) => x.titulo).join(' / ')}.]`;
  }
  if (m.tipo === 'trabajo' || m.tipo === 'generacion') {
    const g = m.resumen ?? m.generacion ?? {};
    const plan = g.plan ? ` Plan: «${g.plan.titulo}», ${g.plan.minutos} min; objetivos: ${g.plan.objetivos.join(' / ')}.` : '';
    if (g.estado === 'guardada') return `[La app guardó la lección «${g.titulo}» (${g.leccionId}) en Mis lecciones.${plan}]`;
    if (['error', 'limitacion', 'no-guardada', 'interrumpida', 'aclaracion'].includes(g.estado)) return `[No se creó «${g.titulo}»: ${g.error ?? g.codigo ?? g.estado}.${plan}${g.mensaje ? ` ${g.mensaje}` : ''}]`;
    return g.titulo ? `[Creación en curso de «${g.titulo}».${plan}]` : '';
  }
  if (m.tipo === 'error') return '';
  return m.texto;
}

/** Código para avisar en la app según la respuesta del servidor. */
function codigoAviso(r, d) {
  const e = d?.error;
  if (['limite', 'ocupado', 'sin-recursos', 'base', 'plan', 'sin-saldo', 'tiempo', 'conexion'].includes(e)) return e;
  if (e === 'sin-ia') return 'sin-ia';
  if (r.status === 404 || (!d && r.status >= 400)) return 'sin-servidor';
  if (r.status === 503) return 'sin-ia';
  return 'error';
}

function leer(almacen) {
  try {
    const d = JSON.parse(almacen?.getItem(CLAVE_SESION) ?? 'null');
    // La versión anterior guardaba solo la lista de mensajes.
    const lista = Array.isArray(d) ? d : Array.isArray(d?.mensajes) ? d.mensajes : [];
    const mensajes = lista.filter((m) => (m?.rol === 'usuario' || m?.rol === 'pet') && typeof m.texto === 'string')
      // Una creación de la versión anterior que quedó a medias al cerrar no puede seguir: se marca como interrumpida.
      .map((m) => (m.tipo === 'generacion' && !['lista', 'guardada', 'no-guardada', 'limitacion', 'error'].includes(m.generacion?.estado) ? { ...m, generacion: { ...m.generacion, estado: 'error', error: 'interrumpida' } } : m));
    return { mensajes, contexto: limpiarContexto(d?.contexto) };
  } catch { return { mensajes: [], contexto: limpiarContexto(null) }; }
}
