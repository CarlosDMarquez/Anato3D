// La conversación con Neuri en la app: guarda los mensajes y el estado (tema, objetivo, nivel y minutos), pregunta al
// servidor (server/pet.mjs, en /api/pet) en el modo que toca y, si no hay servidor, clave o conexión, responde con el
// buscador (src/pet/local.js). Sin DOM: lo prueba `npm test`.
//
// Mensajes: { rol: 'usuario' | 'pet', tipo, texto, … }. Tipos de Neuri:
//   recomendacion | explicacion | aclaracion | propuesta (con «solicitud») | limitacion | salud | fuera_de_alcance
//   plan        (con «plan»: el alcance de una lección; de la versión anterior, cuando se planificaba aparte)
//   trabajo     (con «trabajo»: el identificador de una creación de src/pet/trabajos.js y su último resumen)
//   recorrido   (con «recorrido»: el identificador de un recorrido personal de src/pet/recorridos.js y su último resumen)
//   sesion      (con «sesionId» y «resumen»: una sesión de estudio de src/pet/sesiones.js; «seguir» si se pidió seguirla)
//   error       (con «codigo»: lo que falló, para reintentar)
// Cualquier respuesta puede traer «mostrar» ([{ clave, nombre }]: estructuras para «Ver en 3D»).
// La conversación se guarda en sessionStorage (se pierde al cerrar la pestaña); las lecciones creadas, no: viven en
// «Mis lecciones» (src/biblioteca/propias.js) y los trabajos en curso, en src/pet/trabajos.js. Entre visitas Neuri
// recuerda solo el estado (tema, objetivo, nivel y minutos), en localStorage (CLAVE_MEMORIA), nunca los mensajes.
//
// Cupo diario (protocolo.js, limpiarCupo): cada respuesta del servidor lo trae; se guarda y se expone (`cupo`). Con las
// preguntas con IA agotadas, el estado del servicio es 'sin-cupo' hasta la renovación: mientras, todo va al buscador de
// la app (con el aviso 'sin-cupo') y las sesiones se planifican en la app.
//
// Robustez (especificación de Neuri, sección 13):
//  - cada envío termina en una respuesta (de la IA o del buscador), una aclaración, una cancelación o un error que se
//    puede reintentar; los plazos cubren también la lectura de la respuesta (src/pet/red.js);
//  - una petición cada vez; «cancelar» y «nueva conversación» la cortan, y lo que llegue de antes se descarta (épocas);
//  - un fallo pasajero no apaga la IA para siempre: se vuelve a probar al cabo de un rato; una información antigua (la
//    comprobación inicial) no pisa una más nueva (una respuesta buena).
import { VERSION, LIMITES, limpiarRespuesta, limpiarContexto, limpiarPlan, limpiarCupo, limpiarEnfoque, limpiarPlanSesion, limpiarPedidoSesion } from './protocolo.js';
import { pedirJSON, cortar, motivo, nuevoId } from './red.js';

export const URL_API = '/api/pet';
export const CLAVE_SESION = 'anato3d.neuri';
/** Lo que Neuri recuerda entre visitas (localStorage): { v: 1, contexto, actualizada }. Nunca los mensajes. */
export const CLAVE_MEMORIA = 'anato3d.neuri.memoria';
/** Cuánto vale esa memoria: pasado este tiempo sin hablar con Neuri, se empieza sin tema. */
export const VIDA_MEMORIA = 30 * 24 * 3600 * 1000;
/** Plazos de la app (algo más que lo que puede tardar el servidor en cada modo, server/pet.mjs). */
export const PLAZOS = { comprobar: 12_000, orientar: 75_000, planificar: 150_000, sesion: 75_000 };
/** Tras un fallo, cuánto se espera antes de volver a probar la IA. */
export const ESPERAS = { caida: 30_000, sinClave: 60_000, sinServidor: 5 * 60_000, sinSaldo: 10 * 60_000, sinCupo: 60 * 60_000 };
/** Minutos de una sesión pedida sin decir cuántos (si tampoco los dicen el estado ni las preferencias). */
export const MINUTOS_SESION = 15;
const JSON_H = { 'content-type': 'application/json', accept: 'application/json' };
/** Avisos que se enseñan junto a una respuesta del buscador (los demás fallos se avisan como «error»). */
const AVISOS = new Set(['limite', 'ocupado', 'tiempo', 'conexion', 'no-disponible', 'sin-saldo', 'sin-presupuesto', 'sin-cupo', 'error']);
/** El aviso de una respuesta del buscador cuando la IA está en espera por su estado. */
const AVISO_DE_ESTADO = { 'sin-cupo': 'sin-cupo', limite: 'limite', ocupado: 'ocupado' };

/**
 * `ids`: { lecciones: Set, recorridos: Set, personales?: Set } (con las propias y los recorridos personales).
 * `local(texto)`: respuesta del buscador. `progreso()`: resumen del progreso. `propias()`: resúmenes de «Mis lecciones».
 * `recorridos()`: resúmenes de los recorridos personales. `idioma()`: el de la interfaz. `fetch`: el del navegador.
 * `decidir(texto, { anteriores, ultimo, contexto })`: si se resuelve en la app sin llamar a la IA (src/pet/ruta.js);
 * sin él, todo va a la IA si está. `ahora` y `plazos`: el reloj y los plazos (las pruebas los cambian).
 * `fetch`: en la app, el que añade la cabecera del dispositivo (src/pet/dispositivo.js, conDispositivo).
 * `perfil()`: el perfil de aprendizaje (src/pet/perfil.js) que va al orientar y al planificar una sesión.
 * `sesiones`: el puente con las sesiones de estudio (src/pet/planificador.js, puenteSesiones); sin él, no se crean.
 * `memoria`: localStorage, para recordar el estado entre visitas (CLAVE_MEMORIA).
 */
export function crearConversacion({ ids, local, progreso, propias = () => [], recorridos = () => [], idioma, fetch = globalThis.fetch?.bind(globalThis), almacen = null, url = URL_API, ahora = Date.now, plazos = PLAZOS, decidir = null, perfil = () => null, sesiones = null, memoria = null }) {
  let { mensajes, contexto } = leer(almacen);
  // Una conversación nueva (otra visita, otra pestaña) empieza con lo que Neuri recuerda de la anterior.
  if (!mensajes.length && sinEstado(contexto)) contexto = leerMemoria(memoria, ahora) ?? contexto;
  // El servicio de IA: desconocido, disponible, sin-clave, sin-servidor, sin-saldo, sin-presupuesto (el tope de gasto de
  // Anato3D: cero, agotado o apagado), sin-cupo (las preguntas con IA de hoy de este dispositivo), limite u ocupado (el
  // límite por dirección o el de todos: hasta la espera que dice el servidor) o no-disponible (pasajero). `marca`:
  // el orden en que empezó la petición que lo dijo (lo más nuevo manda; un contador, porque dos peticiones pueden
  // empezar en el mismo milisegundo); `hasta`: cuándo se vuelve a probar.
  const servicio = { estado: 'desconocido', hasta: 0, marca: 0, crear: null, simulado: false };
  let marcas = 0;
  const marcar = () => ++marcas;
  let epoca = 0;
  let enCurso = null;          // { id, tipo, control }
  let cupo = null;             // el último cupo que dijo el servidor (limpiarCupo)
  let marcaCupo = 0;
  let enfoque = null;          // dónde está la persona (limpiarEnfoque): lección, paso y si es una sesión

  const guardar = () => {
    try { almacen?.setItem(CLAVE_SESION, JSON.stringify({ mensajes: mensajes.slice(-40), contexto })); } catch { /* sin almacenamiento */ }
    if (!sinEstado(contexto)) {
      try { memoria?.setItem(CLAVE_MEMORIA, JSON.stringify({ v: 1, contexto, actualizada: ahora() })); } catch { /* sin almacenamiento */ }
    }
  };

  /** El cupo que trae una respuesta (si lo trae). Sin preguntas con IA, el servicio queda 'sin-cupo' hasta la renovación. */
  function anotarCupo(c, marca = marcar()) {
    const limpio = limpiarCupo(c);
    if (!limpio || marca < marcaCupo) return;
    cupo = limpio;
    marcaCupo = marca;
    if (limpio.preguntas.quedan === 0) anotarServicio('sin-cupo', marca, { espera: esperaCupo(limpio, null) });
  }
  /** Hasta cuándo dura un cupo agotado: su renovación; si no se sabe, la espera del servidor (ms) o una hora. */
  const esperaCupo = (c, d) => {
    const hasta = Date.parse(c?.renueva ?? '');
    if (Number.isFinite(hasta) && hasta > ahora()) return hasta - ahora();
    return Number.isFinite(d?.espera) && d.espera > 0 ? Math.min(d.espera, 48 * 3600_000) : ESPERAS.sinCupo;
  };
  /** ¿Quedan preguntas con IA hoy? (si no se sabe, sí: lo dirá el servidor). */
  const quedanPreguntas = () => !cupo || cupo.preguntas.quedan > 0 || ahora() >= Date.parse(cupo.renueva);
  /** Lo que va solo al orientar y al planificar una sesión: el perfil y el enfoque (si los hay). */
  function extras() {
    const out = {};
    let p = null;
    try { p = perfil?.() ?? null; } catch { p = null; }
    if (p) out.perfil = p;
    if (enfoque) out.enfoque = enfoque;
    return out;
  }

  function anotarServicio(estado, marca, { espera = 0, crear, simulado = false } = {}) {
    if (marca < servicio.marca) return;           // una noticia más antigua no pisa una más nueva
    servicio.estado = estado;
    servicio.marca = marca;
    servicio.hasta = espera ? ahora() + espera : 0;
    if (crear !== undefined) servicio.crear = crear;
    servicio.simulado = estado === 'disponible' && simulado;
  }
  const iaUsable = () => ['desconocido', 'disponible'].includes(servicio.estado) || ahora() >= servicio.hasta;
  /** Lo que dice una respuesta mala del servidor sobre el servicio (`d`: su cuerpo, con la espera y el cupo). */
  function anotarFallo(codigo, r, marca, d = null) {
    if (codigo === 'sin-ia') anotarServicio('sin-clave', marca, { espera: ESPERAS.sinClave, crear: false });
    else if (codigo === 'sin-servidor') anotarServicio('sin-servidor', marca, { espera: ESPERAS.sinServidor, crear: false });
    else if (codigo === 'sin-saldo') anotarServicio('sin-saldo', marca, { espera: ESPERAS.sinSaldo });
    else if (codigo === 'sin-presupuesto') anotarServicio('sin-presupuesto', marca, { espera: ESPERAS.sinSaldo, crear: false });
    else if (codigo === 'tiempo' || codigo === 'conexion') anotarServicio('no-disponible', marca, { espera: ESPERAS.caida });
    // Las preguntas con IA de hoy, agotadas: hasta la renovación (las creaciones tienen su propio cupo: trabajos.js).
    else if (codigo === 'sin-cupo') anotarServicio('sin-cupo', marca, { espera: esperaCupo(limpiarCupo(d?.cupo), d) });
    else if (codigo === 'limite' || codigo === 'ocupado') {
      // Con la espera que dice el servidor (en segundos), no se reintenta en cada mensaje; sin ella, sí.
      const s = Number(d?.espera ?? r?.headers?.get?.('retry-after'));
      if (Number.isFinite(s) && s > 0) anotarServicio(codigo, marca, { espera: Math.min(s, 3600) * 1000 });
    }
  }

  /**
   * ¿Hay IA? Pregunta al servidor si aún no se sabe o si ya toca volver a probar. `forzar`: pregunta siempre (para
   * saber el cupo de ahora al abrir Neuri; un GET no gasta nada).
   */
  async function comprobar({ forzar = false } = {}) {
    if (!forzar && (servicio.estado === 'disponible' || (servicio.estado !== 'desconocido' && !iaUsable()))) return servicio.estado === 'disponible';
    const marca = marcar();
    try {
      const { r, d } = await pedirJSON(fetch, url, { method: 'GET', headers: { accept: 'application/json' } }, plazos.comprobar);
      if (r.ok && d?.ok === true && d.ia === true) anotarServicio('disponible', marca, { crear: d.crear === true, simulado: d.estado === 'simulado' });
      else if (r.ok && d?.ok === true && d.estado === 'sin-presupuesto') anotarServicio('sin-presupuesto', marca, { espera: ESPERAS.sinSaldo, crear: false });
      else if (r.ok && d?.ok === true) anotarServicio('sin-clave', marca, { espera: ESPERAS.sinClave, crear: false });
      else anotarServicio('sin-servidor', marca, { espera: ESPERAS.sinServidor, crear: false });
      anotarCupo(d?.cupo, marca);
    } catch {
      anotarServicio('sin-servidor', marca, { espera: ESPERAS.sinServidor, crear: false });
    }
    return servicio.estado === 'disponible';
  }

  /**
   * ¿Puede salir lo que escribió la persona? Solo si el servidor dijo que hay IA. Mientras no se sepa (al empezar) o sin
   * clave o sin servidor (pasada la espera), antes se pregunta con un GET, sin cuerpo: sin IA, lo que se escribe no sale
   * del dispositivo, como promete la interfaz («lo que escribes no sale de él»). En los demás estados la IA existe (falló,
   * está ocupada o sin cupo): pasada la espera, se vuelve a probar con la pregunta misma, como siempre.
   */
  async function puedeEnviar() {
    if (servicio.estado === 'disponible') return true;
    if (servicio.estado === 'desconocido') return comprobar({ forzar: true });
    if (['sin-clave', 'sin-servidor'].includes(servicio.estado)) return ahora() >= servicio.hasta ? comprobar({ forzar: true }) : false;
    return iaUsable();
  }

  // `hoy`: el día de la persona en su calendario (la fecha de las lecciones que cree; el servidor lo comprueba).
  const comun = () => ({ v: VERSION, idioma: idioma(), progreso: progreso(), propias: propias(), recorridos: recorridos(), contexto, hoy: diaLocal(ahora()) });

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
    // Lo que se resuelve en la app (saludos, «el segundo», búsquedas que encajan, tiempo, repaso…) no llama a la IA.
    const ultimo = [...mensajes].reverse().find((m) => m.rol === 'pet' && m.tipo !== 'error') ?? null;
    let decision = null;
    try {
      const activa = sesiones?.activa?.() ?? null;
      decision = decidir?.(limpio, { anteriores: (ultimo?.lecciones ?? []).map((x) => x.id), ultimo: ultimo && { tipo: ultimo.tipo, origen: ultimo.origen, texto: ultimo.texto }, contexto, sesion: activa }) ?? null;
    } catch { decision = null; }                    // si la decisión falla, como siempre: la IA si está
    mensajes.push({ rol: 'usuario', texto: limpio, id: p.id });
    guardar();
    return (async () => {
      try {
        // Pedir una sesión de estudio o seguir la que hay (src/pet/ruta.js): sin IA si se puede.
        if (decision?.ruta === 'sesion' && sesiones) {
          const m = decision.seguir ? mensajeSeguir(decision) : await sesionPedida(pedidoDe(decision.pedido), p);
          if (!m || !vigente(p)) return null;
          mensajes.push(m);
          guardar();
          return m;
        }
        let respuesta = null;
        let aviso = null;
        if (decision?.ruta === 'local' && decision.respuesta) {
          respuesta = { tipo: 'recomendacion', ...decision.respuesta, origen: 'buscador', ruta: decision.motivo };
        } else if (quedanPreguntas() && (await puedeEnviar()) && vigente(p)) {
          const marca = marcar();
          try {
            const { r, d } = await pedirJSON(fetch, url, { method: 'POST', headers: JSON_H, body: JSON.stringify({ ...comun(), ...extras(), modo: 'orientar', mensajes: historial() }) }, plazos.orientar, p.control);
            if (r.ok && d?.ok) {
              respuesta = limpiarRespuesta(d, ids);
              if (respuesta) {
                respuesta.origen = 'ia';
                respuesta.aviso = ['sin-evidencia', 'sin-respaldo'].includes(d.aviso) ? d.aviso : null;
                anotarServicio('disponible', marca);
              } else aviso = 'error';
            } else {
              aviso = codigoAviso(r, d);
              anotarFallo(aviso, r, marca, d);
            }
            anotarCupo(d?.cupo, marca);
          } catch (err) {
            if (motivo(p.control) === 'cancelada' || !vigente(p)) return null;
            aviso = motivo(p.control) === 'tiempo' || err.motivo === 'tiempo' ? 'tiempo' : 'conexion';
            anotarFallo(aviso, null, marca);
          }
        } else aviso = avisoEnEspera();
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
            mostrar: Array.isArray(respuesta.mostrar) ? respuesta.mostrar : [],
            ...(respuesta.ruta ? { ruta: respuesta.ruta } : {}),
          };
        mensajes.push(m);
        guardar();
        // Neuri entendió que la persona pide una sesión de estudio: se crea (en la app si el tema está claro).
        if (respuesta.sesion_pedida && sesiones && m.tipo !== 'error') {
          const s = await sesionPedida(pedidoDe(respuesta.sesion_pedida), p);
          if (s && vigente(p)) { mensajes.push(s); guardar(); return s; }
        }
        return m;
      } finally { terminar(p); }
    })();
  }

  /** El aviso de una respuesta del buscador cuando la IA no se intenta ahora (la nota de abajo ya explica lo permanente). */
  const avisoEnEspera = () => (['sin-clave', 'sin-servidor', 'sin-presupuesto'].includes(servicio.estado) ? null
    : !quedanPreguntas() ? 'sin-cupo' : AVISO_DE_ESTADO[servicio.estado] ?? 'no-disponible');

  /** Un pedido de sesión completo: objetivo, minutos (5-120) y nivel, con lo que se sabe de la conversación. */
  function pedidoDe(s) {
    let pref = null;
    try { pref = perfil?.() ?? null; } catch { pref = null; }
    const m = Number.isInteger(s?.minutos) ? s.minutos : contexto.minutos ?? pref?.minutos ?? MINUTOS_SESION;
    const n = Number.isInteger(s?.nivel) && s.nivel >= 1 && s.nivel <= 3 ? s.nivel : contexto.nivel ?? pref?.nivel ?? null;
    return { objetivo: String(s?.objetivo ?? '').replace(/\s+/g, ' ').trim().slice(0, LIMITES.largo), minutos: Math.min(120, Math.max(5, m)), nivel: n };
  }

  /** «Seguir con la sesión»: la sesión en curso (la interfaz la abre en su bloque). */
  function mensajeSeguir(decision) {
    const S = sesiones.activa?.() ?? null;
    if (!S) return { rol: 'pet', tipo: 'recomendacion', texto: decision.sinSesion ?? '', lecciones: [], sugerencias: [], origen: 'buscador', ruta: 'seguir-sesion' };
    const { id, ...resumen } = S;
    return { rol: 'pet', tipo: 'sesion', texto: decision.mensaje ?? '', sesionId: id, resumen, seguir: true, origen: 'buscador', ruta: 'seguir-sesion' };
  }

  /**
   * Una sesión de estudio pedida (por la ruta de la app o porque Neuri lo entendió): se planifica en la app si el tema
   * está claro (sin llamar a nadie); si es ambiguo, largo o mezcla temas, con Neuri (modo «sesion»), si hay IA y queda
   * cupo; si Neuri no puede, con lo mejor que haya en la app, y si no hay nada, se pregunta el tema. Devuelve el
   * mensaje (tipo 'sesion', 'aclaracion' o 'error'), o null si se canceló.
   */
  async function sesionPedida(pedido, p) {
    let plan = null;
    let origen = 'local';
    let aviso = null;
    let local = null;
    try { local = sesiones.planificar(pedido); } catch { local = null; }
    const valido = limpiarPedidoSesion({ ...pedido, modelo: sesiones.modelo?.() ?? 'male' });
    if (local?.preferir === 'ia' && valido) {
      if (quedanPreguntas() && (await puedeEnviar()) && vigente(p)) {
        const marca = marcar();
        try {
          const cuerpo = { ...comun(), ...extras(), modo: 'sesion', pedido: valido, mensajes: historial().slice(-LIMITES.mensajesSesion) };
          const { r, d } = await pedirJSON(fetch, url, { method: 'POST', headers: JSON_H, body: JSON.stringify(cuerpo) }, plazos.sesion ?? PLAZOS.sesion, p.control);
          anotarCupo(d?.cupo, marca);
          if (r.ok && d?.ok && d.tipo === 'sesion' && limpiarPlanSesion(d.plan, ids.lecciones)) {
            plan = d.plan;
            origen = 'neuri';
            anotarServicio('disponible', marca);
          } else if (r.ok && d?.ok && d.tipo === 'aclaracion' && typeof d.mensaje === 'string' && d.mensaje.trim()) {
            anotarServicio('disponible', marca);
            return { rol: 'pet', tipo: 'aclaracion', texto: d.mensaje.trim().slice(0, LIMITES.pet), lecciones: [], sugerencias: Array.isArray(d.sugerencias) ? d.sugerencias.filter((x) => typeof x === 'string').map((x) => x.slice(0, LIMITES.sugerencia)).slice(0, LIMITES.sugerencias) : [], origen: 'ia', aviso: null, ruta: 'sesion' };
          } else {
            const c = r.ok && d?.ok ? 'error' : codigoAviso(r, d);
            anotarFallo(c, r, marca, d);
            aviso = AVISOS.has(c) ? c : ['sin-ia', 'sin-servidor'].includes(c) ? null : 'error';
          }
        } catch (err) {
          if (motivo(p.control) === 'cancelada' || !vigente(p)) return null;
          aviso = motivo(p.control) === 'tiempo' || err.motivo === 'tiempo' ? 'tiempo' : 'conexion';
          anotarFallo(aviso, null, marca);
        }
      } else aviso = avisoEnEspera();
    }
    if (!vigente(p)) return null;
    plan ??= local?.plan ?? null;
    if (!plan) return { rol: 'pet', tipo: 'aclaracion', texto: local?.texto ?? '', lecciones: [], sugerencias: local?.sugerencias ?? [], origen: 'buscador', aviso, ruta: 'sesion' };
    let r;
    try { r = await sesiones.crear(plan, { origen, pedido }); } catch { r = { ok: false, error: 'almacenamiento' }; }
    // El plan de Neuri se quedó sin nada que hacer en este modelo: el de la app, si lo hay.
    if (!r?.ok && r?.error === 'vacia' && origen === 'neuri' && local?.plan) {
      origen = 'local';
      try { r = await sesiones.crear(local.plan, { origen, pedido }); } catch { r = { ok: false, error: 'almacenamiento' }; }
    }
    if (!vigente(p)) return null;
    if (!r?.ok) return { rol: 'pet', tipo: 'error', texto: '', codigo: r?.error === 'vacia' ? 'sesion-vacia' : 'sesion', origen: 'app' };
    // Lo que se sabe ahora: el tema, los minutos y el nivel de la sesión (y lo recordará la próxima visita).
    contexto = limpiarContexto({ ...contexto, tema: pedido.objetivo || contexto.tema, minutos: pedido.minutos, nivel: pedido.nivel ?? contexto.nivel });
    return {
      rol: 'pet', tipo: 'sesion', texto: r.sesion.mensaje || '', sesionId: r.sesion.id, resumen: r.resumen ?? { titulo: r.sesion.titulo, estado: r.sesion.estado },
      quitados: r.quitados?.length ?? 0, origen: origen === 'neuri' ? 'ia' : 'buscador', aviso, ruta: 'sesion',
    };
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
        // Sin IA confirmada, la solicitud no sale (como en preguntar).
        if (!(await puedeEnviar())) m = { rol: 'pet', tipo: 'error', texto: '', codigo: 'sin-ia', origen: 'app' };
        else try {
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
    get servicio() { return { estado: servicio.estado, hasta: servicio.hasta, simulado: servicio.simulado }; },
    /**
     * El cupo diario de este dispositivo, tal como lo dijo el servidor por última vez: { preguntas: { limite, usadas,
     * quedan }, creaciones: { … }, renueva (ISO) }, o null si aún no lo ha dicho (o el cupo no está activo).
     */
    get cupo() { return cupo; },
    /** Dónde está la persona (lo que se envía a Neuri): { leccion, paso, sesion } o null. */
    get enfoque() { return enfoque; },
    /** Fija dónde está la persona (una lección, un paso, si es dentro de una sesión). Devuelve si sirvió. */
    establecerEnfoque(e) { enfoque = limpiarEnfoque(e, null); return !!enfoque; },
    quitarEnfoque() { enfoque = null; },
    /** El cupo que trae otra respuesta del servidor (las creaciones de trabajos.js, los recorridos). */
    anotarCupo: (c) => anotarCupo(c),
    comprobar, puedeEnviar, preguntar, planificar, cancelar, historial,
    /**
     * Pide una sesión de estudio (un botón de la interfaz, sin escribir): { objetivo, minutos, nivel }. Como si la
     * persona la hubiera pedido: en la app si el tema está claro; si no, con Neuri. Devuelve el mensaje, o null.
     */
    pedirSesion(pedido) {
      if (!sesiones) return Promise.resolve(null);
      const p = empezar('sesion');
      if (!p) return Promise.resolve(null);
      return (async () => {
        try {
          const m = await sesionPedida(pedidoDe(pedido), p);
          if (!m || !vigente(p)) return null;
          mensajes.push(m);
          guardar();
          return m;
        } finally { terminar(p); }
      })();
    },
    /** Anota en la conversación una sesión de estudio (src/pet/sesiones.js) para enseñarla ahí. */
    anotarSesion(id, resumen) {
      const m = { rol: 'pet', tipo: 'sesion', texto: '', sesionId: id, resumen: { ...resumen }, origen: 'app' };
      mensajes.push(m);
      guardar();
      return m;
    },
    /** ¿Hay un mensaje de esta sesión en la conversación? */
    tieneSesion: (id) => mensajes.some((x) => x.tipo === 'sesion' && x.sesionId === id),
    /** Actualiza lo que se recuerda de una sesión (estado, bloque, resultados) en sus mensajes. */
    resumirSesion(id, resumen) {
      let hay = false;
      for (const m of mensajes) if (m.tipo === 'sesion' && m.sesionId === id) { m.resumen = { ...m.resumen, ...resumen }; hay = true; }
      if (hay) guardar();
    },
    /**
     * Olvida lo que Neuri recuerda entre visitas, y también el estado de esta conversación (tema, objetivo, nivel,
     * minutos): si quedara aquí, el próximo guardado lo volvería a escribir y la próxima petición lo enviaría.
     */
    olvidarMemoria() {
      try { memoria?.removeItem?.(CLAVE_MEMORIA); } catch { /* nada */ }
      contexto = limpiarContexto(null);
      guardar();
    },
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
    /**
     * Nueva conversación: corta lo que esté en curso (las creaciones siguen: son trabajos aparte). `sinMemoria` («Borrar
     * mis datos»): además olvida lo que Neuri recuerda entre visitas y empieza sin tema.
     */
    reiniciar({ sinMemoria = false } = {}) {
      if (enCurso) { cortar(enCurso.control, 'cancelada'); enCurso = null; }
      epoca++;
      mensajes = [];
      if (sinMemoria) { try { memoria?.removeItem?.(CLAVE_MEMORIA); } catch { /* nada */ } }
      // Una conversación nueva empieza con lo que Neuri recuerda (el tema de la última vez); el cupo y el enfoque siguen.
      contexto = (sinMemoria ? null : leerMemoria(memoria, ahora)) ?? limpiarContexto(null);
      guardar();
    },
  };
}

/** ¿El estado de la conversación no dice nada aún? */
const sinEstado = (c) => !c || (c.tema == null && c.objetivo == null && c.nivel == null && c.minutos == null);

/** Lo que Neuri recuerda de la última visita (si es reciente y se puede leer), o null. */
function leerMemoria(memoria, ahora) {
  try {
    const d = JSON.parse(memoria?.getItem(CLAVE_MEMORIA) ?? 'null');
    if (d?.v !== 1 || !Number.isFinite(d.actualizada) || ahora() - d.actualizada > VIDA_MEMORIA) return null;
    const c = limpiarContexto(d.contexto);
    return sinEstado(c) ? null : c;
  } catch { return null; }
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
  if (m.tipo === 'sesion') {
    const r = m.resumen ?? {};
    if (!r.titulo) return m.texto ?? '';
    const parte = (b) => (b.tipo === 'repaso' ? `repaso (${b.preguntas ?? '—'} preguntas)` : b.tipo === 'practica' ? `práctica de ${b.leccion} (${b.preguntas ?? '—'} preguntas)`
      : `${b.leccion} (${b.parte === 'entera' || b.parte == null ? 'entera' : `${b.parte} pasos`})`);
    const bloques = (r.bloques ?? []).map((b, i) => `${i + 1}. ${parte(b)}, ${b.minutos} min`).join('; ');
    const estado = { planificada: 'sin empezar', activa: 'en curso', pausada: 'en pausa', finalizada: 'terminada' }[r.estado] ?? r.estado;
    const donde = r.estado === 'finalizada' ? '' : Number.isInteger(r.i) && r.total ? `, bloque ${Math.min(r.i + 1, r.total)} de ${r.total}` : '';
    return `${m.texto ?? ''}\n[Sesión de estudio «${r.titulo}» (${r.minutos ?? '—'} min; ${estado}${donde}): ${bloques || '—'}.]`.trim();
  }
  if (m.tipo === 'error') return '';
  return m.texto;
}

/** Código para avisar en la app según la respuesta del servidor. */
function codigoAviso(r, d) {
  const e = d?.error;
  // Las preguntas con IA de hoy, agotadas (el cupo de las creaciones lo lleva trabajos.js).
  if (e === 'cupo') return 'sin-cupo';
  if (['limite', 'ocupado', 'sin-recursos', 'base', 'plan', 'sin-saldo', 'sin-presupuesto', 'tiempo', 'conexion'].includes(e)) return e;
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

/** El día (AAAA-MM-DD) de un instante en el calendario de este dispositivo. */
export function diaLocal(ms) {
  const d = new Date(ms);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
