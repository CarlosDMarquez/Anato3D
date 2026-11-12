// Neuri en la interfaz de «Estudiar»: el lanzador (abajo a la derecha del panel, con su globo), la conversación (vista
// «neuri» de la biblioteca) y las entradas desde la portada, la ficha de una lección y una búsqueda sin resultados.
// La lógica está en src/pet/: la conversación (conversacion.js), las creaciones (trabajos.js), las respuestas sin IA
// (local.js) y lo que se acepta (protocolo.js).
//
// Lo que se ve sigue los estados de la especificación: una propuesta (lo que la persona pidió crear o adaptar), la
// creación con sus etapas reales (alcance → fuentes → redacción → comprobación → guardado) y la lección «Lista para
// estudiar», que solo se anuncia cuando la app la ha validado y guardado en «Mis lecciones». Si la persona pidió crear
// expresamente y el alcance basta, la creación empieza sin pedir otra confirmación; si no, un botón la empieza.
//
// Lo que no cabe en una lección es un recorrido personal (src/pet/recorridos.js): Neuri lo planifica por unidades y la
// tarjeta del recorrido enseña el estado real de cada una (lista, en preparación, pendiente, error, interrumpida…).
// Cada unidad se crea aparte, cuando la persona lo decide; si pidió «créame un curso…», también la primera.
import * as P from '../../biblioteca/progreso.js';
import { RECORRIDOS, RECORRIDO_POR_ID } from '../../biblioteca/recorridos.js';
import { resumenPropia, contarGuardadas } from '../../biblioteca/propias.js';
import { crearConversacion } from '../../pet/conversacion.js';
import { crearTrabajos, FINALES, CLAVE_TRABAJOS } from '../../pet/trabajos.js';
import { crearRecorridos, CLAVE_RECORRIDOS } from '../../pet/recorridos.js';
import { MAX_PROPIAS } from '../../biblioteca/propias.js';
import { responderLocal } from '../../pet/local.js';
import { LIMITES, ID_PROPIA } from '../../pet/protocolo.js';
import { t, tn, idioma } from '../../i18n/idioma.js';
import { tr } from '../../i18n/contenido.js';
import { esc, icono, tarjetaLeccion, tarjetaRecorrido, nomLugar, nomSistema, nomTema, nomNivel, descargarArchivo } from './comun.js';
import { enlazarTarjetas, abrirLeccion } from './explorar.js';
import { svgNeuri, gesto } from './neuri-svg.js';

// Vistas del catálogo, donde está el lanzador (en las lecciones y las preguntas, el modelo necesita el sitio).
const CON_LANZADOR = new Set(['portada', 'resultados', 'recorrido', 'info', 'sesion', 'propias', 'mapa', 'examen', 'datos']);
const CLAVE_VISTO = 'anato3d.neuri.visto';
// Etapas de una creación tal como se enseñan (las reales del servidor; «corrigiendo» se enseña como comprobación).
const ETAPAS = ['planificando', 'fuentes', 'redactando', 'comprobando', 'guardando'];
const leer = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const anotar = (k, v) => { try { localStorage.setItem(k, v); } catch { /* sin almacenamiento */ } };
const almacenSesion = () => { try { return sessionStorage; } catch { return null; } };
const almacenLocal = () => { try { return localStorage; } catch { return null; } };
const parrafos = (s) => String(s).split(/\n+/).map((p) => p.trim()).filter(Boolean).map((p) => `<p>${esc(p)}</p>`).join('');
// Códigos de error y de límite con texto propio; los demás, el genérico.
const CODIGOS = new Set(['sin-ia', 'limite', 'ocupado', 'cancelada', 'interrumpida', 'sin-recursos', 'sin-estructuras', 'pocas-evidencias', 'plan-invalido', 'validacion', 'limitacion', 'local', 'tiempo', 'conexion', 'sin-servidor', 'sin-saldo', 'servidor', 'aclaracion', 'recorrido-invalido', 'lleno-recorridos']);
const textoError = (c) => t(`pet.error.${CODIGOS.has(c) ? c : c === 'trabajo-desconocido' ? 'interrumpida' : 'generico'}`);
// Límites del plan en sí (no del momento): reintentar daría lo mismo; lo que sirve es cambiar el plan.
const SIN_REINTENTO = new Set(['pocas-evidencias', 'limitacion', 'plan', 'base', 'sin-estructuras', 'plan-invalido', 'sin-servidor']);
const nombreFuente = (f) => (f.startsWith('wpes:') ? t('bib.wikipediaEs') : f.startsWith('tma:') ? 'TeachMeAnatomy' : t('bib.wikipediaEn'));

export function crearNeuri(ctx, panel) {
  let pendiente = null;        // { texto } a enviar o { borrador } a dejar escrito al abrir la conversación
  let relojGesto = null;
  let relojBurbuja = null;
  let idiomaPintado = null;
  let repintar = 0;
  // Lo que la persona abrió o cerró (el plan de una creación, las fuentes de una respuesta): se conserva al repintar.
  const desplegados = new Map();
  const abierto = (clave, porDefecto = false) => ((desplegados.get(clave) ?? porDefecto) ? ' open' : '');

  // ── Conversación, creaciones y recorridos personales ──
  // Las lecciones válidas cambian al crear o quitar lecciones propias: se leen cada vez. `personales`: los recorridos
  // personales (un cambio que propone Neuri solo puede ser de uno de ellos).
  let recorridos = null;
  const ids = {
    get lecciones() { return new Set(ctx.porId.keys()); }, recorridos: new Set(RECORRIDOS.map((R) => R.id)),
    get personales() { return new Set(recorridos?.lista.map((R) => R.id) ?? []); },
  };
  const conv = crearConversacion({
    ids, idioma, almacen: almacenSesion(),
    local: (texto) => responderLocal(texto, entornoLocal()),
    progreso: resumenProgreso,
    propias: () => ctx.propias.map(resumenPropia),
    recorridos: () => recorridos?.resumenes() ?? [],
  });
  const basePropia = (id) => (id && ID_PROPIA.test(id) ? ctx.propias.find((L) => L.id === id) ?? null : null);
  const trabajos = crearTrabajos({
    almacen: almacenLocal(), comun: conv.comun, historial: conv.historial, basePropia,
    guardarLeccion: (L) => ctx.guardarPropia(L),
  });
  recorridos = crearRecorridos({
    almacen: almacenLocal(), comun: conv.comun, historial: conv.historial, trabajos,
    existeLeccion: (id) => ctx.propias.some((L) => L.id === id),
    // Lo que cabe aún en «Mis lecciones», contando las creaciones en curso (cada una ocupará un sitio).
    espacio: () => MAX_PROPIAS - contarGuardadas(almacenLocal()) - trabajos.enCurso.length,
    alIniciar: (x) => ctx.evento?.('generacion_solicitada', { accion: 'crear' }, { clave: x.id }),
  });
  const enMarcha = new Map();  // creaciones que se siguen en esta pestaña → su último estado (para avisar de los cambios)
  trabajos.suscribir((tr) => {
    if (tr) {
      conv.resumirTrabajo(tr.id, resumenTrabajo(tr));
      const antes = enMarcha.get(tr.id);
      if (FINALES.includes(tr.estado)) {
        if (antes) { avisarFin(tr); eventoFin(tr, antes); }
        enMarcha.delete(tr.id);
      } else {
        enMarcha.set(tr.id, tr.estado);
        if (antes !== tr.estado && enConversacion()) anunciar(etiquetaEtapa(tr));
      }
    }
    programarRepintado();
  });
  // Un recorrido cambia (se planifica, una unidad avanza o termina): lo que se recuerda en la conversación y lo que se ve.
  const planesVistos = new Map();   // recorrido → estado de su planificación la última vez (para avisar al terminar)
  recorridos.suscribir((R) => {
    if (R) {
      conv.resumirRecorrido(R.id, recorridos.instantanea(R));
      const antes = planesVistos.get(R.id);
      const ahora = recorridos.estadoRecorrido(R);
      planesVistos.set(R.id, ahora);
      if (antes === 'planificando' && ahora !== 'planificando') avisarPlan(R, ahora);
    }
    programarRepintado();
  });
  /** Repintar lo que se vea (una vez por fotograma), sin mover el foco: la conversación, la portada o «Mis lecciones». */
  function programarRepintado() {
    if (repintar) return;
    repintar = requestAnimationFrame(() => {
      repintar = 0;
      if (enConversacion()) pintarMensajes();
      else if (ctx.vista.tipo === 'portada' || ctx.vista.tipo === 'propias') ctx.repintarPropias?.();
    });
  }
  // Otra pestaña creó, terminó o quitó una creación o un recorrido.
  try {
    addEventListener('storage', (e) => {
      if (e.key === CLAVE_TRABAJOS) trabajos.recargar();
      if (e.key === CLAVE_RECORRIDOS) recorridos.recargar();
    });
  } catch { /* sin ventana */ }
  // Lo que quedó a medias al recargar la página se retoma (el servidor guarda el trabajo media hora), y la cola de un
  // recorrido («crear todas») sigue donde estaba.
  trabajos.retomarPendientes();
  recorridos.retomar();

  /** Estadísticas (si la persona las activó): cómo terminó una creación, sin títulos ni textos. */
  function eventoFin(tr, etapa) {
    if (tr.estado === 'guardada' || tr.estado === 'no-guardada') ctx.evento?.('generacion_completada', { segundos: Math.round(((tr.actualizado ?? 0) - (tr.creado ?? 0)) / 1000), guardada: tr.estado === 'guardada' }, { clave: tr.id });
    else if (tr.error === 'cancelada') ctx.evento?.('generacion_cancelada', { etapa }, { clave: tr.id });
    else ctx.evento?.('generacion_fallida', { codigo: tr.error ?? tr.codigo ?? tr.estado, etapa }, { clave: tr.id });
  }

  /** Al terminar una creación: si no se está mirando la conversación, un aviso; siempre, el anuncio accesible. */
  function avisarFin(tr) {
    const texto = tr.estado === 'guardada' ? t('pet.listaToast', { titulo: tr.titulo }) : t('pet.noCreada', { titulo: tr.titulo });
    if (enConversacion()) { anunciar(texto); return; }
    if (tr.estado === 'guardada' && tr.leccionId) ctx.toast(texto, 0, { label: t('pet.abrirLeccion'), run: () => ctx.mostrar({ tipo: 'info', id: tr.leccionId }) });
    else if (tr.error !== 'cancelada') ctx.toast(texto, 0, { label: t('pet.verComoVa'), run: () => verTrabajo(tr.id) });
  }

  /** Al terminar de planificar un recorrido: el anuncio accesible y, si no se está mirando la conversación, un aviso. */
  function avisarPlan(R, estado) {
    const listo = estado === 'listo';
    const texto = listo ? t('pet.rec.listoAnuncio', { titulo: R.titulo, n: R.unidades.length }) : t('pet.rec.noPlanificado', { titulo: R.titulo });
    if (enConversacion()) { anunciar(texto); return; }
    ctx.toast(texto, 0, { label: t(listo ? 'pet.rec.ver' : 'pet.verQuePaso'), run: () => verRecorrido(R.id) });
  }

  /** Una línea para lectores de pantalla (la conversación entera no se vuelve a leer en cada cambio). */
  function anunciar(texto) {
    const el = ctx.body.querySelector('.neuri-anuncio');
    if (!el || !texto) return;
    el.textContent = '';
    requestAnimationFrame(() => { el.textContent = String(texto).slice(0, 400); });
  }
  const etiquetaEtapa = (x) => {
    const e = x.estado === 'corrigiendo' ? 'comprobando' : x.estado;
    return e === 'redactando' && x.evidencias ? t('pet.estado.redactandoN', { n: x.evidencias }) : e === 'planificando' || e === 'guardando' ? t(`pet.etapa.${e}`) : t(`pet.estado.${e}`);
  };

  /** Lo que se recuerda de una creación en la conversación (para que Neuri sepa qué se creó). */
  const resumenTrabajo = (x) => ({
    estado: x.estado, titulo: x.titulo, leccionId: x.leccionId, error: x.error, codigo: x.codigo, mensaje: x.mensaje,
    plan: x.plan ? { titulo: x.plan.titulo, minutos: x.plan.minutos, objetivos: x.plan.objetivos } : null,
  });

  // ── Lanzador ──
  const lanzador = document.createElement('div');
  lanzador.className = 'neuri-lanzador';
  lanzador.hidden = true;
  panel.append(lanzador);

  function pintarLanzador() {
    idiomaPintado = idioma();
    lanzador.innerHTML = `
      <div class="neuri-burbuja" hidden><button type="button" class="neuri-burbuja-texto" data-abrir></button>
        <button type="button" class="neuri-burbuja-x" aria-label="${esc(t('pet.ocultarBurbuja'))}">${icono('close')}</button></div>
      <button type="button" class="neuri-fab" data-abrir aria-label="${esc(t('pet.abrir'))}">${svgNeuri()}</button>`;
    lanzador.querySelectorAll('[data-abrir]').forEach((b) => b.addEventListener('click', () => abrir()));
    lanzador.querySelector('.neuri-burbuja-x').addEventListener('click', () => { ocultarBurbuja(); anotar(CLAVE_VISTO, '1'); lanzador.classList.remove('llamada'); });
    const fab = lanzador.querySelector('.neuri-fab');
    fab.addEventListener('mouseenter', () => burbuja('pet.burbuja', 4000));
    fab.addEventListener('focus', () => burbuja('pet.burbuja', 4000));
  }
  function burbuja(clave, ms = 9000) {
    const b = lanzador.querySelector('.neuri-burbuja');
    if (!b || lanzador.hidden) return;
    b.querySelector('.neuri-burbuja-texto').textContent = t(clave);
    b.hidden = false;
    clearTimeout(relojBurbuja);
    relojBurbuja = setTimeout(ocultarBurbuja, ms);
  }
  function ocultarBurbuja() {
    clearTimeout(relojBurbuja);
    const b = lanzador.querySelector('.neuri-burbuja');
    if (b) b.hidden = true;
  }

  /** Antes de pintar cada vista: el lanzador solo en el catálogo; la primera vez, se presenta. */
  function actualizar(vista) {
    const visible = CON_LANZADOR.has(vista.tipo);
    if (visible && idiomaPintado !== idioma()) pintarLanzador();
    lanzador.hidden = !visible;
    panel.classList.toggle('con-neuri', visible);
    panel.classList.toggle('chat', vista.tipo === 'neuri');
    if (!visible) { ocultarBurbuja(); return; }
    if (vista.tipo === 'portada' && !leer(CLAVE_VISTO)) {
      lanzador.classList.add('llamada');
      setTimeout(() => { if (ctx.vista === vista) burbuja('pet.burbuja', 10000); }, 900);
    }
  }

  /** Lo que se cuenta a Neuri del progreso: solo identificadores de lecciones (nunca respuestas ni fechas). */
  function resumenProgreso() {
    const ahora = Date.now();
    const terminadas = [];
    const enCurso = [];
    for (const L of ctx.catalogo?.lecciones ?? []) {
      const e = ctx.estado(L, { ahora }).estado;
      if (e === 'en-curso') enCurso.push(L.id);
      else if (e !== 'sin-empezar') terminadas.push(L.id);
    }
    const repasos = [...new Set(P.vencidas(ctx.data, { ahora }).map((id) => id.slice(0, id.indexOf('/'))))].filter((id) => ctx.porId.has(id));
    const guardadas = ctx.data.favoritos.filter((id) => ctx.porId.has(id) || RECORRIDO_POR_ID.has(id));
    return { terminadas, enCurso, repasos, guardadas };
  }

  function entornoLocal() {
    const p = resumenProgreso();
    return {
      buscador: ctx.buscador, porId: ctx.porId, piezas: ctx.catalogo.piezas,
      progreso: { terminadas: new Set(p.terminadas), enCurso: new Set(p.enCurso), repasos: new Set(p.repasos) },
      t, tn, nombreLugar: nomLugar, nombreMateria: (m) => (m.sistema ? nomSistema(m.sistema) : nomTema(m.tema)),
      sugerencias: t('pet.ejemplos').split('|'),
    };
  }

  /** Abre la conversación. `texto`: se envía (viene de una búsqueda sin resultados); `borrador`: se deja escrito. */
  function abrir(texto = null, { borrador = null } = {}) {
    anotar(CLAVE_VISTO, '1');
    lanzador.classList.remove('llamada');
    ocultarBurbuja();
    pendiente = texto ? { texto } : borrador ? { borrador } : null;
    if (ctx.vista.tipo === 'neuri') { aplicarPendiente(); return; }
    ctx.ir({ tipo: 'neuri' });
  }
  function aplicarPendiente() {
    const p = pendiente;
    pendiente = null;
    const ta = ctx.body.querySelector('#neuri-q');
    if (p?.trabajo) {
      // Desde la portada o un aviso: la tarjeta de esa creación, a la vista y con el foco en su primer botón.
      const tarjeta = ctx.body.querySelector(`[data-trabajo="${CSS.escape(p.trabajo)}"]`);
      tarjeta?.scrollIntoView({ block: 'nearest' });
      (tarjeta?.querySelector('.neuri-acciones button') ?? tarjeta?.querySelector('button, summary') ?? ta)?.focus({ preventScroll: true });
      return;
    }
    if (p?.recorrido) {
      // Desde «Mis lecciones» o un aviso: la tarjeta del recorrido (o la fila de la unidad), a la vista y con el foco.
      const tarjeta = ctx.body.querySelector(`[data-recorrido="${CSS.escape(p.recorrido)}"]`);
      const fila = p.unidad ? tarjeta?.querySelector(`[data-unidad-fila="${CSS.escape(p.unidad)}"]`) : null;
      const el = fila ?? tarjeta;
      el?.scrollIntoView({ block: 'nearest' });
      (el?.querySelector('.neuri-unidad-acc button, .neuri-acciones button, summary, button') ?? ta)?.focus({ preventScroll: true });
      return;
    }
    if (p?.texto) enviar(p.texto);
    else if (p?.borrador && ta) { ta.value = p.borrador; ta.dispatchEvent(new Event('input')); ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); }
    else requestAnimationFrame(() => ta?.focus({ preventScroll: true }));
  }

  const avatar = () => ctx.body.querySelector('.neuri-presenta svg.neuri');
  function ponerGesto(estado, volverEn = 0) {
    clearTimeout(relojGesto);
    gesto(avatar(), estado);
    if (volverEn) relojGesto = setTimeout(() => { if (!conv.ocupada) gesto(avatar(), 'reposo'); }, volverEn);
  }
  const enConversacion = () => ctx.vista.tipo === 'neuri' && ctx.body.querySelector('.neuri-vista');

  function renderVista() {
    ctx.cargarEstructuras?.().catch(() => {});   // las respuestas sin IA también buscan en las estructuras del modelo
    ctx.body.innerHTML = `
      <section class="neuri-vista" aria-labelledby="neuri-h">
        <div class="neuri-cab">
          <button class="link back" type="button" data-atras>${icono('chevron')}<span>${esc(t('bib.biblioteca'))}</span></button>
          <button class="btn" type="button" data-nueva>${icono('newChat')}<span>${esc(t('pet.nueva'))}</span></button>
        </div>
        <div class="neuri-presenta">
          ${svgNeuri()}
          <div>
            <h3 id="neuri-h" tabindex="-1">Neuri</h3>
            <p class="neuri-lema">${esc(t('pet.lema'))}</p>
            <p class="neuri-modo" hidden></p>
          </div>
        </div>
        <div class="neuri-log" role="log" aria-live="off" aria-label="${esc(t('pet.conversacion'))}" tabindex="0"></div>
        <p class="neuri-anuncio sr-only" aria-live="polite" aria-atomic="true"></p>
        <form class="neuri-form">
          <label class="sr-only" for="neuri-q">${esc(t('pet.escribe'))}</label>
          <textarea id="neuri-q" rows="1" maxlength="${LIMITES.usuario}" placeholder="${esc(t('pet.placeholder'))}" enterkeyhint="send" autocomplete="off"></textarea>
          <button class="neuri-enviar" type="submit" aria-label="${esc(t('pet.enviar'))}" title="${esc(t('pet.enviar'))}" disabled>${icono('send')}</button>
        </form>
        <p class="neuri-nota" hidden></p>
      </section>`;

    const ta = ctx.body.querySelector('#neuri-q');
    const boton = ctx.body.querySelector('.neuri-enviar');
    // El borrador se conserva al salir de la conversación y volver.
    if (ctx.borradorNeuri) { ta.value = ctx.borradorNeuri; boton.disabled = conv.ocupada; }
    const ajustarAlto = () => { ta.style.height = 'auto'; ta.style.height = `${Math.min(ta.scrollHeight + 2, 120)}px`; };
    let relojEscucha = null;
    ta.addEventListener('input', () => {
      ctx.borradorNeuri = ta.value;
      ajustarAlto();
      boton.disabled = !ta.value.trim() || conv.ocupada;
      if (conv.ocupada) return;
      ponerGesto(ta.value.trim() ? 'escuchando' : 'reposo');
      clearTimeout(relojEscucha);
      relojEscucha = setTimeout(() => { if (!conv.ocupada) ponerGesto('reposo'); }, 1600);
    });
    ta.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); enviar(ta.value); }
    });
    ctx.body.querySelector('.neuri-form').addEventListener('submit', (e) => { e.preventDefault(); enviar(ta.value); });
    ctx.body.querySelector('[data-atras]').addEventListener('click', () => ctx.volver());
    ctx.body.querySelector('[data-nueva]').addEventListener('click', () => {
      // También con una pregunta en curso: se corta y se descarta (las creaciones siguen; están en «Mis lecciones»).
      conv.reiniciar();
      desplegados.clear();
      pintarMensajes();
      ponerGesto('reposo');
      ta.focus();
    });

    pintarModo();
    conv.comprobar().then(() => { if (enConversacion()) { pintarModo(); pintarMensajes(); } });
    pintarMensajes();
    if (conv.ocupada) ponerGesto('pensando');
    aplicarPendiente();
  }

  /** El estado de la IA arriba, y la nota de abajo explica qué se envía (o que no se envía nada). */
  function pintarModo() {
    const modo = ctx.body.querySelector('.neuri-modo');
    const nota = ctx.body.querySelector('.neuri-nota');
    if (!modo) return;
    const e = conv.servicio.estado;
    const [clase, ic, texto, notaT] = e === 'disponible' ? [' ia', 'sparkles', 'pet.conIa', 'pet.nota']
      : e === 'desconocido' ? [' comprobando', 'sparkles', 'pet.servicio.comprobando', null]
        : ['no-disponible', 'sin-saldo'].includes(e) ? [' caida', 'info', 'pet.servicio.noDisponible', 'pet.notaNoDisponible']
          : ['', 'search', 'pet.sinIa', 'pet.notaLocal'];
    modo.className = `neuri-modo${clase}`;
    modo.innerHTML = `${icono(ic)}<span>${esc(t(texto))}</span>`;
    modo.hidden = false;
    nota.textContent = notaT ? t(notaT) : '';
    nota.hidden = !notaT;
  }

  // ── Mensajes ──
  const sugerencias = (lista) => (lista?.length ? `<p class="neuri-sugs">${lista.map((s) => `<button type="button" class="bib-chip" data-sug="${esc(s)}">${esc(s)}</button>`).join('')}</p>` : '');
  const fav = (id) => ctx.data.favoritos.includes(id);
  const tarjetas = (lista) => lista.map(({ id, motivo }) => ctx.porId.get(id) && tarjetaLeccion(ctx.porId.get(id), ctx.estado(ctx.porId.get(id)), fav(id), { compacta: true, nota: motivo })).filter(Boolean).join('');

  function htmlEvidencias(evs, i) {
    if (!evs?.length) return '';
    return `<details class="neuri-fuentes" data-abre="fuentes-${i}"${abierto(`fuentes-${i}`, true)}><summary>${icono('quote')}${esc(t('pet.fuentesRespuesta', { n: evs.length }))}</summary><ul>${evs.map((e) => {
      const L = e.leccion && ctx.porId.get(e.leccion);
      return `<li>${e.texto ? `<p class="neuri-ev-texto">${esc(e.texto)}</p>` : ''}
        <p class="neuri-ev-cita" lang="${e.f.startsWith('wpes:') ? 'es' : 'en'}">“${esc(e.cita)}”</p>
        <p class="neuri-ev-de">${e.url ? `<a href="${esc(e.url)}" target="_blank" rel="noopener">${esc(nombreFuente(e.f))}: «${esc(e.titulo)}»</a>` : esc(e.titulo)}${e.licencia ? ` <small>· ${esc(e.licencia)}</small>` : ''}
        ${L ? ` · <button class="link" data-ir-paso="${esc(L.id)}" data-paso-id="${esc(e.paso ?? '')}">${esc(t('pet.verEnLeccion', { titulo: tr(L.titulo) }))}</button>` : ''}</p></li>`;
    }).join('')}</ul></details>`;
  }

  /** La propuesta de un recorrido personal (o de un cambio en uno): lo que entendió Neuri y el botón para planificarlo. */
  function htmlSolicitudRecorrido(m, i) {
    const s = m.solicitud;
    const base = s.recorrido_base ? recorridos.buscar(s.recorrido_base) : null;
    const fila = (k, v) => (v ? `<dt>${esc(t(`pet.campo.${k}`))}</dt><dd>${esc(v)}</dd>` : '');
    const puede = conv.crear !== false;
    return `<div class="neuri-tarjeta neuri-propuesta">
      <p class="neuri-tarjeta-t">${icono('route')}<span>${esc(t(base ? 'pet.rec.propuestaCambio' : 'pet.rec.propuesta'))}</span></p>
      <dl class="neuri-campos">
        ${base ? fila('recorrido', base.titulo) : ''}${fila('tema', s.tema)}${fila('objetivo', s.objetivo)}
        ${fila('nivel', s.nivel ? nomNivel(s.nivel) : '')}${fila('unidades', s.unidades ? String(s.unidades) : '')}
        ${fila('minutosUnidad', s.minutos ? t('bib.minutos', { n: s.minutos }) : '')}
        ${fila(base ? 'cambio' : 'enfoque', s.enfoque)}${fila('supuestos', s.supuestos.join(' · '))}
      </dl>
      ${m.errorRec ? `<p class="neuri-aviso-t" role="alert">${esc(textoError(m.errorRec))}</p>` : ''}
      ${!puede ? `<p class="neuri-aviso-t">${esc(t('pet.necesitaIa'))}</p>` : m.iniciado ? '' : `<p class="neuri-plan-nota">${esc(t(base ? 'pet.rec.propuestaCambioNota' : 'pet.rec.propuestaNota'))}</p>
      <div class="neuri-acciones">
        <button class="btn primary" type="button" data-crear-sol="${i}">${icono('route')}<span>${esc(t(base ? 'pet.rec.cambiarRecorrido' : 'pet.rec.planificar'))}</span></button>
        <button class="btn" type="button" data-cambiar>${esc(t('pet.cambiar'))}</button>
      </div>`}
    </div>`;
  }

  function htmlSolicitud(m, i) {
    const s = m.solicitud;
    if (s.accion === 'recorrido') return htmlSolicitudRecorrido(m, i);
    const adaptar = s.accion === 'adaptar';
    const base = s.leccion_base && ctx.porId.get(s.leccion_base);
    const fila = (k, v) => (v ? `<dt>${esc(t(`pet.campo.${k}`))}</dt><dd>${esc(v)}</dd>` : '');
    const puede = conv.crear !== false;
    const iniciada = m.iniciado && trabajos.buscar(m.iniciado);
    return `<div class="neuri-tarjeta neuri-propuesta">
      <p class="neuri-tarjeta-t">${icono('sparkles')}<span>${esc(t(adaptar ? 'pet.propuestaAdaptar' : 'pet.propuestaCrear'))}</span></p>
      <dl class="neuri-campos">
        ${adaptar && base ? fila('base', tr(base.titulo)) : ''}${fila('tema', s.tema)}${fila('objetivo', s.objetivo)}
        ${fila('nivel', s.nivel ? nomNivel(s.nivel) : '')}${fila('minutos', s.minutos ? t('bib.minutos', { n: s.minutos }) : '')}
        ${fila('enfoque', s.enfoque)}${fila('supuestos', s.supuestos.join(' · '))}
      </dl>
      ${!puede ? `<p class="neuri-aviso-t">${esc(t('pet.necesitaIa'))}</p>` : iniciada ? '' : `<div class="neuri-acciones">
        <button class="btn primary" type="button" data-crear-sol="${i}">${icono('sparkles')}<span>${esc(t(adaptar ? 'pet.crearAdaptacion' : 'pet.crearLeccion'))}</span></button>
        <button class="btn" type="button" data-cambiar>${esc(t('pet.cambiar'))}</button>
      </div>`}
    </div>`;
  }

  /** El plan, para verlo dentro de una creación o en un mensaje de la versión anterior. */
  function htmlDetallePlan(p, estructuras = {}) {
    const base = p.base && ctx.porId.get(p.base);
    const est = (papel) => p.estructuras.filter((e) => e.papel === papel).map((e) => `<li class="bib-chip ${papel === 'nucleo' ? 'on' : ''}" title="${esc(t(papel === 'nucleo' ? 'pet.nucleo' : 'pet.contexto'))}">${esc(estructuras?.[e.clave]?.nombre ?? e.clave.replace(/_/g, ' '))}</li>`).join('');
    return `<h4 class="neuri-plan-t">${esc(p.titulo)}</h4>
      ${p.accion === 'adaptar' && base ? `<p class="neuri-plan-base">${esc(t('pet.campo.base'))}: ${esc(tr(base.titulo))}</p>` : ''}
      <p class="neuri-plan-r">${esc(p.resumen)}</p>
      <p class="bib-meta"><span>${esc(nomNivel(p.nivel))}</span><span>${icono('clock')}${esc(t('bib.minutos', { n: p.minutos }))}</span><span>${esc(tn('bib.pasos', p.pasos.length))}</span></p>
      <h5>${esc(t('pet.planObjetivos'))}</h5><ul class="neuri-lista">${p.objetivos.map((o) => `<li>${esc(o)}</li>`).join('')}</ul>
      <h5>${esc(t('pet.planPasos'))}</h5><ol class="neuri-lista">${p.pasos.map((s) => `<li><b>${esc(s.titulo)}</b> <small>${esc(t(`paso.${s.tipo}`))}</small><br><span>${esc(s.idea)}</span></li>`).join('')}</ol>
      <h5>${esc(t('pet.planEstructuras'))}</h5><ul class="bib-chips">${est('nucleo')}${est('contexto')}</ul>
      ${p.limitaciones?.length ? `<h5>${esc(t('pet.planLimitaciones'))}</h5><ul class="neuri-lista">${p.limitaciones.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
      ${p.supuestos?.length ? `<h5>${esc(t('pet.planSupuestos'))}</h5><ul class="neuri-lista">${p.supuestos.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}`;
  }

  /** Mensaje «plan» de la versión anterior (cuando se planificaba aparte): se puede crear desde él. */
  function htmlPlan(m, i) {
    const usado = conv.mensajes.slice(i + 1).some((x) => x.tipo === 'trabajo' && x.resumen?.estado !== 'error') || m.iniciado;
    return `<div class="neuri-tarjeta neuri-plan">
      <p class="neuri-tarjeta-t">${icono('route')}<span>${esc(t(m.plan.accion === 'adaptar' ? 'pet.planAdaptacion' : 'pet.planTitulo'))}</span></p>
      ${htmlDetallePlan(m.plan, m.estructuras)}
      <p class="neuri-plan-nota">${esc(t('pet.planNota'))}</p>
      ${usado ? '' : `<div class="neuri-acciones"><button class="btn primary" type="button" data-crear-plan="${i}">${icono('sparkles')}<span>${esc(t(m.plan.accion === 'adaptar' ? 'pet.crearAdaptacion' : 'pet.crearLeccion'))}</span></button>
        <button class="btn" type="button" data-cambiar="plan">${esc(t('pet.cambiarPlan'))}</button></div>`}
    </div>`;
  }

  /**
   * Una creación: sus etapas reales mientras se hace; al terminar, la lección lista para estudiar o lo que pasó.
   * `unidad`: { recorrido, unidad } si es una unidad de un recorrido (va dentro de su fila, que ya tiene sus botones).
   */
  function htmlTrabajo(id, { unidad = null } = {}) {
    const x = trabajos.buscar(id);
    if (!x) return '';
    const plan = x.plan ? `<details class="neuri-detalles neuri-plan-en" data-abre="plan-${esc(x.id)}"${abierto(`plan-${x.id}`)}><summary>${esc(t('pet.verPlan'))}</summary>${htmlDetallePlan(x.plan, x.estructuras)}</details>` : '';
    if (x.estado === 'guardada' || x.estado === 'no-guardada') {
      const L = x.leccionId && ctx.porId.get(x.leccionId);
      const inf = x.informe;
      const ok = x.estado === 'guardada';
      return `<div class="neuri-tarjeta neuri-gen ${ok ? 'ok' : 'mal'}" data-trabajo="${esc(x.id)}">
        <p class="neuri-tarjeta-t">${icono(ok ? 'check' : 'info')}<span>${esc(ok ? t('pet.estado.guardada') : t('pet.noGuardadaTitulo', { titulo: x.titulo }))}</span></p>
        ${x.mensaje && ok ? `<div class="neuri-globo neuri-globo-in">${parrafos(x.mensaje)}</div>` : ''}
        ${inf?.limitesModelo ? `<p class="neuri-informe">${esc(tn('pet.limite.quitadas', inf.limitesModelo))}</p>` : ''}
        ${inf ? `<p class="neuri-informe">${esc(t('pet.informe', { pasos: inf.pasos, preguntas: inf.preguntas, citas: inf.citas }))}${inf.quitadas ? `. ${esc(tn('pet.informeQuitadas', inf.quitadas))}` : ''}</p>` : ''}
        ${ok && L && !unidad ? `<div class="neuri-recs">${tarjetaLeccion(L, ctx.estado(L), fav(L.id), { compacta: true })}</div>
          <div class="neuri-acciones"><button class="btn primary" type="button" data-abrir-leccion="${esc(L.id)}">${esc(t('pet.abrirLeccion'))}</button>
          <button class="btn" type="button" data-ficha="${esc(L.id)}">${esc(t('pet.verFicha'))}</button></div>
          <p class="neuri-plan-nota">${esc(t('pet.guardadaEn'))} ${esc(t('pet.borradorIa'))}</p>` : ''}
        ${ok ? '' : `<p>${esc(x.error === 'lleno' ? t('pet.noGuardadaLleno', { n: MAX_PROPIAS }) : x.error === 'espacio' ? t('pet.noGuardadaEspacio') : x.error === 'apartar' ? t('pet.noGuardadaApartar') : t('pet.noGuardada'))}</p>
          <div class="neuri-acciones"><button class="btn primary" type="button" data-reintentar-t="${esc(x.id)}">${esc(t('pet.reintentarGuardar'))}</button>
          ${trabajos.resultado(x.id) ? `<button class="btn" type="button" data-descargar="${esc(x.id)}">${icono('download')}<span>${esc(t('pet.descargar'))}</span></button>` : ''}
          <button class="btn" type="button" data-mis-lecciones>${esc(t('pet.liberarEspacio'))}</button></div>`}
        ${plan}
      </div>`;
    }
    if (FINALES.includes(x.estado)) {
      const codigo = x.estado === 'error' ? x.error : x.estado === 'interrumpida' ? 'interrumpida' : x.estado === 'aclaracion' ? 'aclaracion' : x.codigo ?? 'limitacion';
      const cambiar = SIN_REINTENTO.has(codigo) || x.estado === 'limitacion' || x.estado === 'aclaracion';
      // (En la fila de una unidad, sus botones ya están en la fila: aquí solo lo que pasó.)
      return `<div class="neuri-tarjeta neuri-gen mal" data-trabajo="${esc(x.id)}">
        <p class="neuri-tarjeta-t">${icono('info')}<span>${esc(t('pet.noCreada', { titulo: x.titulo }))}</span></p>
        ${x.mensaje && (x.estado === 'aclaracion' || x.estado === 'limitacion') ? `<div class="neuri-globo neuri-globo-in">${parrafos(x.mensaje)}</div>` : ''}
        <p>${esc(textoError(codigo))}</p>
        ${x.errores?.length ? `<details class="neuri-detalles" data-abre="errores-${esc(x.id)}"${abierto(`errores-${x.id}`)}><summary>${esc(t('pet.detalles'))}</summary><ul>${x.errores.map((e) => `<li>${esc(e)}</li>`).join('')}</ul></details>` : ''}
        ${plan}
        ${unidad ? '' : `<div class="neuri-acciones">${cambiar
          ? `<button class="btn" type="button" data-cambiar="plan">${esc(t('pet.cambiarPlan'))}</button>`
          : `<button class="btn primary" type="button" data-reintentar-t="${esc(x.id)}">${esc(t(x.reanudable ? 'pet.reintentar' : 'pet.volverCrear'))}</button>`}</div>`}
      </div>`;
    }
    // En curso: las etapas, con la actual animada. «Corrigiendo» es parte de la comprobación.
    const actual = x.estado === 'corrigiendo' ? 'comprobando' : x.estado;
    const k = ETAPAS.indexOf(actual);
    const etiqueta = (e) => etiquetaEtapa({ ...x, estado: e });
    return `<div class="neuri-tarjeta neuri-gen" aria-busy="true" data-trabajo="${esc(x.id)}">
      <p class="neuri-tarjeta-t">${icono('sparkles')}<span>${esc(t('pet.generando', { titulo: x.titulo }))}</span></p>
      <ol class="neuri-pasos-gen">${ETAPAS.map((e, j) => `<li class="${j < k ? 'hecho' : j === k ? 'actual' : ''}">${j < k ? icono('check') : '<i></i>'}<span>${esc(etiqueta(e))}</span></li>`).join('')}</ol>
      ${x.estado === 'corrigiendo' && x.problemas ? `<p class="neuri-informe">${esc(tn('pet.estado.corrigiendo', x.problemas))}</p>` : ''}
      ${plan}
      <div class="neuri-acciones"><button class="btn" type="button" data-cancelar-t="${esc(x.id)}">${esc(t('pet.cancelar'))}</button></div>
    </div>`;
  }

  /** Mensaje «generacion» de la versión anterior: solo su resultado. */
  function htmlGeneracionAntigua(m) {
    const g = m.generacion ?? {};
    const L = g.leccionId && ctx.porId.get(g.leccionId);
    const ok = g.estado === 'guardada' && L;
    return `<div class="neuri-tarjeta neuri-gen ${ok ? 'ok' : 'mal'}"><p class="neuri-tarjeta-t">${icono(ok ? 'check' : 'info')}<span>${esc(ok ? t('pet.estado.guardada') : t('pet.noCreada', { titulo: g.titulo ?? '' }))}</span></p>
      ${ok ? `<div class="neuri-recs">${tarjetaLeccion(L, ctx.estado(L), fav(L.id), { compacta: true })}</div>` : `<p>${esc(textoError(g.error ?? g.codigo ?? 'generico'))}</p>`}</div>`;
  }

  // ── Recorridos personales ──
  /** Lo que se dice de la planificación de un recorrido que no terminó bien (error, limitación, aclaración, interrumpida). */
  function textoPlanRecorrido(R, est) {
    if (est === 'interrumpido') return t('pet.rec.interrumpido');
    if (est === 'aclaracion') return t('pet.rec.aclaracion');
    if (est === 'limitacion') return R.codigo === 'recorrido-invalido' ? textoError('recorrido-invalido') : t('pet.rec.limitacion');
    return textoError(R.error);
  }
  /** Los botones para seguir tras una planificación que no terminó bien: volver a planificar o cambiar la petición. */
  function botonesPlanRecorrido(R, est) {
    const cambiar = `<button class="btn" type="button" data-cambiar="recorrido:${esc(R.id)}">${esc(t('pet.cambiar'))}</button>`;
    const quitar = R.unidades.length ? '' : `<button class="btn" type="button" data-rec-quitar-vacio="${esc(R.id)}">${esc(t('pet.quitarAviso'))}</button>`;
    // Sin IA, ni volver a planificar ni cambiar sirven: solo quitar el aviso (si no tiene unidades).
    if (conv.crear === false) return quitar;
    if (est === 'limitacion' || est === 'aclaracion' || R.error === 'sin-servidor') return `${cambiar}${quitar}`;
    return `<button class="btn primary" type="button" data-rec-reintentar="${esc(R.id)}">${esc(t('pet.rec.replanificar'))}</button>${cambiar}${quitar}`;
  }
  /** Un aviso del recorrido (la cola se paró, no cabe, salió una unidad ya creada…), con el botón para cerrarlo. */
  function htmlAvisoRecorrido(R) {
    const partes = [];
    const c = R.aviso?.codigo;
    if (c === 'lleno') partes.push(`${esc(t('pet.rec.lleno', { max: MAX_PROPIAS }))} <button class="link" type="button" data-mis-lecciones>${esc(t('pet.liberarEspacio'))}</button>`);
    else if (c === 'parada') partes.push(esc(t('pet.rec.colaParada')));
    else if (c === 'cancelada') partes.push(esc(t('pet.rec.colaCancelada')));
    else if (c === 'cambio-cancelado') partes.push(esc(t('pet.rec.cambioCancelado')));
    else if (c === 'ocupado') partes.push(esc(t('pet.rec.ocupado')));
    else if (c) partes.push(esc(textoError(c)));
    for (const s of R.salen ?? []) partes.push(esc(t('pet.rec.sale', { titulo: s.titulo })));
    if (!partes.length) return '';
    return `<div class="neuri-rec-aviso" role="status">${icono('info')}<p>${partes.join('<br>')}</p>
      <button class="neuri-rec-x" type="button" data-rec-aviso-x="${esc(R.id)}" aria-label="${esc(t('pet.rec.cerrarAviso'))}">${icono('close')}</button></div>`;
  }

  /** El texto del estado real de una unidad. */
  function textoUnidad(R, u, e) {
    if (e.estado === 'lista') return t('pet.estado.guardada');
    if (e.estado === 'preparando') return etiquetaEtapa(e.trabajo);
    if (e.estado === 'sin-guardar') return t('pet.noGuardadaCorto');
    if (e.estado === 'interrumpida') return t('pet.rec.estado.interrumpida');
    if (e.estado === 'error') return t('pet.rec.estado.error');
    if (R.cola && !u.trabajo && !u.leccion) return t('pet.rec.enCola');
    return t(e.motivo === 'cancelada' ? 'pet.rec.estado.cancelada' : e.motivo === 'quitada' ? 'pet.rec.estado.quitada' : 'pet.rec.estado.pendiente');
  }

  /** Una unidad: su número, título, objetivo y estado real; sus botones y, si tiene creación, sus detalles. */
  function htmlUnidad(R, u, k, e, { planificando, ocupado, puede }) {
    const n = k + 1;
    const L = e.leccion && ctx.porId.get(e.leccion);
    const icono_ = e.estado === 'lista' ? icono('check') : e.estado === 'preparando' ? '<i class="neuri-giro" aria-hidden="true"></i>' : ['error', 'interrumpida', 'sin-guardar'].includes(e.estado) ? icono('info') : '<i class="neuri-unidad-vacio" aria-hidden="true"></i>';
    const libre = puede && !planificando && !ocupado;
    let acc = '';
    if (e.estado === 'lista' && L) acc = `<button class="btn" type="button" data-abrir-leccion="${esc(L.id)}" aria-label="${esc(t('pet.rec.abrirDe', { titulo: u.titulo }))}">${esc(t('pet.rec.abrir'))}</button>`;
    else if (e.estado === 'pendiente' && libre) acc = `<button class="btn" type="button" data-rec-crear="${esc(`${R.id}:${u.id}`)}" aria-label="${esc(t('pet.rec.crearDe', { n, titulo: u.titulo }))}">${esc(t('pet.rec.crear'))}</button>`;
    else if ((e.estado === 'error' || e.estado === 'interrumpida') && libre) {
      const cambiar = SIN_REINTENTO.has(e.codigo) || e.codigo === 'limitacion' || e.codigo === 'aclaracion';
      acc = cambiar
        ? `<button class="btn" type="button" data-cambiar="${esc(`unidad:${R.id}:${u.id}`)}" aria-label="${esc(t('pet.rec.cambiarDe', { n }))}">${esc(t('pet.cambiar'))}</button>`
        : `<button class="btn" type="button" data-rec-crear="${esc(`${R.id}:${u.id}`)}" aria-label="${esc(t('pet.rec.reintentarDe', { n, titulo: u.titulo }))}">${esc(t('pet.reintentar'))}</button>`;
    }
    const inf = e.estado === 'lista' ? e.trabajo?.informe : null;
    const rel = e.estado === 'pendiente' ? (u.relacionadas ?? []).map((id) => ctx.porId.get(id)).filter(Boolean) : [];
    const det = e.trabajo && e.estado !== 'lista'
      ? `<details class="neuri-detalles neuri-unidad-det" data-abre="unidad-${esc(u.id)}"${abierto(`unidad-${u.id}`)}><summary>${esc(t(e.estado === 'preparando' ? 'pet.verComoVa' : 'pet.verQuePaso'))}</summary>${htmlTrabajo(e.trabajo.id, { unidad: { recorrido: R.id, unidad: u.id } })}</details>`
      : '';
    return `<li class="neuri-unidad ${esc(e.estado)}" data-unidad-fila="${esc(u.id)}">
      <span class="neuri-unidad-n" aria-hidden="true">${n}</span>
      <div class="neuri-unidad-txt">
        <p class="neuri-unidad-t"><span class="sr-only">${esc(t('pet.rec.unidadN', { n }))}: </span><b>${esc(u.titulo)}</b>${u.minutos ? ` <small>${esc(t('bib.minutos', { n: u.minutos }))}</small>` : ''}</p>
        ${u.objetivo ? `<p class="neuri-unidad-o">${esc(u.objetivo)}</p>` : ''}
        <p class="neuri-unidad-e">${icono_}<span>${esc(textoUnidad(R, u, e))}</span>${inf ? ` <small>· ${esc(t('pet.informe', { pasos: inf.pasos, preguntas: inf.preguntas, citas: inf.citas }))}</small>` : ''}</p>
        ${rel.length ? `<p class="neuri-unidad-rel">${esc(t('pet.rec.relacionadas'))} ${rel.map((L2) => `<button class="link" type="button" data-ficha="${esc(L2.id)}">${esc(tr(L2.titulo))}</button>`).join(', ')}</p>` : ''}
        ${det}
      </div>
      ${acc ? `<div class="neuri-unidad-acc">${acc}</div>` : ''}
    </li>`;
  }

  /**
   * La tarjeta de un recorrido personal: sus unidades con su estado real y lo que se puede hacer. Solo la última vez que
   * sale en la conversación va entera (las anteriores remiten a ella), para que no haya dos tarjetas del mismo recorrido.
   */
  function htmlRecorrido(m, ultimo) {
    const R = recorridos.buscar(m.recorrido);
    const snap = m.resumen ?? {};
    const cab = (titulo) => `<p class="neuri-tarjeta-t">${icono('route')}<span>${esc(t('pet.rec.titulo'))}</span></p><h4 class="neuri-plan-t">${esc(titulo ?? '')}</h4>`;
    if (!ultimo) return `<div class="neuri-tarjeta neuri-rec neuri-rec-ref"><p class="neuri-tarjeta-t">${icono('route')}<span>${esc(t('pet.rec.titulo'))}</span></p><p>${esc(t('pet.rec.masAbajo', { titulo: R?.titulo ?? snap.titulo ?? '' }))}</p></div>`;
    if (!R) {
      const txt = snap.estado === 'cancelado' ? t('pet.rec.cancelado') : snap.quitado ? t('pet.rec.quitadoConv') : t('pet.rec.yaNo');
      return `<div class="neuri-tarjeta neuri-rec mal">${cab(snap.titulo)}<p>${esc(txt)}</p></div>`;
    }
    const est = recorridos.estadoRecorrido(R);
    const planificando = est === 'planificando';
    if (!R.unidades.length) {
      if (planificando) {
        return `<div class="neuri-tarjeta neuri-rec" aria-busy="true" data-recorrido="${esc(R.id)}">${cab(R.titulo)}
          <ol class="neuri-pasos-gen"><li class="actual"><i></i><span>${esc(t('pet.rec.planificando'))}</span></li></ol>
          <p class="neuri-plan-nota">${esc(t('pet.rec.planificandoNota'))}</p>
          <div class="neuri-acciones"><button class="btn" type="button" data-rec-cancelar="${esc(R.id)}">${esc(t('pet.cancelar'))}</button></div></div>`;
      }
      return `<div class="neuri-tarjeta neuri-rec mal" data-recorrido="${esc(R.id)}">${cab(R.titulo)}
        ${R.mensaje ? `<div class="neuri-globo neuri-globo-in">${parrafos(R.mensaje)}</div>` : ''}
        <p>${esc(textoPlanRecorrido(R, est))}</p>
        ${R.errores?.length ? `<details class="neuri-detalles" data-abre="rec-errores-${esc(R.id)}"${abierto(`rec-errores-${R.id}`)}><summary>${esc(t('pet.detalles'))}</summary><ul>${R.errores.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></details>` : ''}
        <div class="neuri-acciones">${botonesPlanRecorrido(R, est)}</div></div>`;
    }
    const res = recorridos.resumen(R);
    const puede = conv.crear !== false;
    const ocupado = res.preparando > 0;
    const libres = Math.max(0, MAX_PROPIAS - contarGuardadas(almacenLocal()) - trabajos.enCurso.length);
    const acciones = [];
    if (puede && !planificando) {
      if (res.siguiente && !ocupado && !R.cola) acciones.push(`<button class="btn primary" type="button" data-rec-siguiente="${esc(R.id)}">${icono('sparkles')}<span>${esc(t('pet.rec.crearSiguiente', { n: res.nSiguiente }))}</span></button>`);
      if (!R.cola && res.nuevas >= (ocupado ? 1 : 2)) acciones.push(`<button class="btn" type="button" data-rec-todas="${esc(R.id)}">${esc(ocupado ? tn('pet.rec.crearRestantes', res.nuevas) : t('pet.rec.crearTodas', { n: res.nuevas }))}</button>`);
      if (R.cola) acciones.push(`<button class="btn" type="button" data-rec-parar="${esc(R.id)}">${esc(t('pet.rec.parar'))}</button>`);
    }
    // (Cambiar el recorrido también necesita la IA: sin ella, no se ofrece.)
    if (!planificando && puede) acciones.push(`<button class="btn" type="button" data-cambiar="${esc(`recorrido:${R.id}`)}">${esc(t('pet.cambiar'))}</button>`);
    const mas = [...(R.limitaciones?.length ? [`<h5>${esc(t('pet.planLimitaciones'))}</h5><ul class="neuri-lista">${R.limitaciones.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`] : []),
      ...(R.supuestos?.length ? [`<h5>${esc(t('pet.planSupuestos'))}</h5><ul class="neuri-lista">${R.supuestos.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`] : [])].join('');
    return `<div class="neuri-tarjeta neuri-rec" data-recorrido="${esc(R.id)}"${planificando || ocupado ? ' aria-busy="true"' : ''}>${cab(R.titulo)}
      ${R.resumen ? `<p class="neuri-plan-r">${esc(R.resumen)}</p>` : ''}
      <p class="bib-meta"><span>${esc(nomNivel(R.nivel ?? 1))}</span><span>${icono('clock')}${esc(t('pet.rec.minTotal', { n: res.minutos }))}</span><span>${esc(t('pet.rec.avance', { listas: res.listas, total: res.total }))}</span></p>
      ${planificando ? `<p class="neuri-rec-cambiando"><i class="neuri-giro" aria-hidden="true"></i><span>${esc(t('pet.rec.cambiando'))}</span> <button class="link" type="button" data-rec-cancelar="${esc(R.id)}">${esc(t('pet.cancelar'))}</button></p>` : ''}
      ${!planificando && est !== 'listo' ? `<div class="neuri-rec-aviso mal" role="status">${icono('info')}<div><p>${esc(t('pet.rec.noCambiado'))} ${esc(textoPlanRecorrido(R, est))}</p><div class="neuri-acciones">${botonesPlanRecorrido(R, est)}</div></div></div>` : ''}
      ${htmlAvisoRecorrido(R)}
      <ol class="neuri-unidades" aria-label="${esc(t('pet.rec.unidades'))}">${R.unidades.map((u, k) => htmlUnidad(R, u, k, res.estados[k], { planificando, ocupado, puede })).join('')}</ol>
      ${R.cola && res.nuevas ? `<p class="neuri-informe">${esc(tn('pet.rec.colaActiva', res.nuevas))}</p>` : ''}
      ${!puede ? `<p class="neuri-aviso-t">${esc(t('pet.necesitaIa'))}</p>` : ''}
      ${acciones.length ? `<div class="neuri-acciones">${acciones.join('')}</div>` : ''}
      <p class="neuri-plan-nota">${esc(t('pet.rec.nota'))}${res.pendientes > libres ? ` ${esc(libres ? tn('pet.rec.caben', libres) : t('pet.rec.lleno', { max: MAX_PROPIAS }))}` : ''}</p>
      ${mas ? `<details class="neuri-detalles" data-abre="rec-mas-${esc(R.id)}"${abierto(`rec-mas-${R.id}`)}><summary>${esc(t('pet.rec.verMas'))}</summary>${mas}</details>` : ''}
    </div>`;
  }

  function htmlSesion(s) {
    const lecciones = s.lecciones.map((id) => ctx.porId.get(id)).filter(Boolean);
    const total = lecciones.reduce((n, L) => n + L.minutos, 0);
    return `<div class="neuri-tarjeta neuri-sesion">
      <p class="neuri-tarjeta-t">${icono('timer')}<span>${esc(t('pet.sesionTitulo', { n: total }))}</span></p>
      <ol class="neuri-lista">${lecciones.map((L) => `<li><button class="link" type="button" data-ficha="${esc(L.id)}">${esc(tr(L.titulo))}</button> <small>${esc(t('bib.minutos', { n: L.minutos }))}</small></li>`).join('')}</ol>
      ${lecciones[0] ? `<div class="neuri-acciones"><button class="btn primary" type="button" data-abrir-leccion="${esc(lecciones[0].id)}">${esc(t('pet.sesionEmpezar'))}</button></div>` : ''}
    </div>`;
  }

  function htmlMensaje(m, i, ultimo, ultimoRecorrido) {
    if (m.rol === 'usuario') {
      return `<div class="neuri-msg yo${m.cancelada ? ' cancelada' : ''}"><p><span class="sr-only">${esc(t('pet.tu'))}: </span>${esc(m.texto)}</p>${m.cancelada ? `<small class="neuri-cancelada">${esc(t('pet.cancelada'))}</small>` : ''}</div>`;
    }
    if (m.tipo === 'recorrido') return `<div class="neuri-msg pet">${htmlRecorrido(m, ultimoRecorrido.get(m.recorrido) === i)}</div>`;
    if (m.tipo === 'trabajo') return `<div class="neuri-msg pet">${htmlTrabajo(m.trabajo) || htmlGeneracionAntigua({ generacion: m.resumen?.estado && FINALES.includes(m.resumen.estado) ? m.resumen : { ...m.resumen, estado: 'error', error: 'interrumpida' } })}</div>`;
    if (m.tipo === 'plan') return `<div class="neuri-msg pet">${m.texto ? `<div class="neuri-globo">${parrafos(m.texto)}</div>` : ''}${htmlPlan(m, i)}</div>`;
    if (m.tipo === 'generacion') return `<div class="neuri-msg pet">${htmlGeneracionAntigua(m)}</div>`;
    if (m.tipo === 'error') {
      return `<div class="neuri-msg pet"><div class="neuri-globo"><p>${esc(textoError(m.codigo))}</p></div>
        ${m.reintentar && ultimo ? `<p class="neuri-sugs"><button type="button" class="bib-chip" data-repreguntar="${i}">${icono('restart')}<span>${esc(t('pet.volverPreguntar'))}</span></button></p>` : ''}</div>`;
    }
    const R = m.recorrido ? RECORRIDO_POR_ID.get(m.recorrido) : null;
    // Una explicación que sus citas no respaldaban no se enseña: solo las citas (frases literales de las fuentes).
    const texto = m.aviso === 'sin-respaldo' ? t('pet.explicacionRetirada') : m.texto || (m.codigo ? textoError(m.codigo) : '');
    return `<div class="neuri-msg pet">
      <div class="neuri-globo"><span class="sr-only">Neuri: </span>${parrafos(texto)}
        ${m.aviso === 'sin-evidencia' ? `<p class="neuri-aviso">${esc(t('pet.sinEvidencia'))}</p>` : m.aviso && m.aviso !== 'sin-respaldo' ? `<p class="neuri-aviso">${esc(t(`pet.aviso.${m.aviso}`))}</p>` : ''}
        ${m.origen === 'buscador' && conv.ia !== false ? `<p class="neuri-origen">${icono('search')}<span>${esc(t('pet.origenBuscador'))}</span></p>` : ''}
      </div>
      ${htmlEvidencias(m.evidencias, i)}
      ${m.solicitud ? htmlSolicitud(m, i) : ''}
      ${m.lecciones?.length ? `<div class="neuri-recs" role="group" aria-label="${esc(t('pet.leccionesSugeridas'))}">${tarjetas(m.lecciones)}</div>` : ''}
      ${m.sesion ? htmlSesion(m.sesion) : ''}
      ${R ? `<div class="neuri-recs" role="group" aria-label="${esc(t('pet.recorridoSugerido'))}">${tarjetaRecorrido(R, ctx.resumenRecorrido(R), fav(R.id))}</div>` : ''}
      ${ultimo ? sugerencias(m.sugerencias) : ''}
    </div>`;
  }

  /** Cómo encontrar otra vez el elemento con el foco tras repintar (por sus atributos data-, no por su posición). */
  function claveFoco(el) {
    if (el.tagName === 'SUMMARY' && el.parentElement?.dataset.abre) return `details[data-abre="${CSS.escape(el.parentElement.dataset.abre)}"] > summary`;
    const a = [...el.attributes].find((x) => x.name.startsWith('data-'));
    return a ? `[${a.name}="${CSS.escape(a.value)}"]` : null;
  }

  function pintarMensajes() {
    const log = ctx.body.querySelector('.neuri-log');
    if (!log) return;
    // Repintar no puede quitar el foco a quien navega con el teclado (p. ej. en «Cancelar» mientras avanza una creación).
    const activo = log.contains(document.activeElement) ? document.activeElement : null;
    const clave = activo && activo !== log ? claveFoco(activo) : null;
    // Si ese botón ya no está (la creación terminó o se canceló), el foco va a la primera acción de la misma tarjeta.
    const tarjeta = activo?.closest('[data-trabajo]')?.dataset.trabajo;
    const filaUnidad = activo?.closest('[data-unidad-fila]')?.dataset.unidadFila;
    const recorridoFoco = activo?.closest('[data-recorrido]')?.dataset.recorrido;
    // Si la persona está leyendo más arriba, no se la mueve; si está al final, se sigue al final.
    const alFinal = log.scrollHeight - log.scrollTop - log.clientHeight < 40;
    const antes = log.childElementCount;
    const ms = conv.mensajes;
    const hola = `<div class="neuri-msg pet"><div class="neuri-globo"><p>${esc(t('pet.hola'))}</p></div>${ms.length ? '' : sugerencias(t('pet.ejemplos').split('|'))}</div>`;
    const escribiendo = conv.ocupada
      ? `<div class="neuri-msg pet neuri-pensando"><div class="neuri-globo"><span class="neuri-puntos" aria-hidden="true"><i></i><i></i><i></i></span><span class="sr-only">${esc(t('pet.pensando'))}</span></div>
          <button class="link" type="button" data-cancelar-pregunta>${esc(t('pet.cancelar'))}</button></div>`
      : '';
    // De cada recorrido, el último mensaje que lo nombra (solo ese lleva la tarjeta entera).
    const ultimoRecorrido = new Map();
    ms.forEach((m, i) => { if (m.tipo === 'recorrido') ultimoRecorrido.set(m.recorrido, i); });
    log.innerHTML = hola + ms.map((m, i) => htmlMensaje(m, i, i === ms.length - 1, ultimoRecorrido)).join('') + escribiendo;
    if (activo) {
      const t2 = tarjeta && `[data-trabajo="${CSS.escape(tarjeta)}"]`;
      // En un recorrido: si el botón ya no está (se pulsó «Crear»), el foco se queda en la fila de esa unidad (su «Ver
      // cómo va») o, si no, en las acciones del recorrido.
      const f2 = filaUnidad && `[data-unidad-fila="${CSS.escape(filaUnidad)}"]`;
      const r2 = recorridoFoco && `[data-recorrido="${CSS.escape(recorridoFoco)}"]`;
      // (En orden de preferencia: el primero que exista de cada lista, no el primero de la página.)
      const primero = (...sel) => sel.reduce((el, s) => el ?? log.querySelector(s), null);
      ((clave && log.querySelector(clave)) || (t2 && primero(`${t2} .neuri-acciones button`, `${t2} button, ${t2} summary`))
        || (f2 && primero(`${f2} .neuri-unidad-acc button`, `${f2} summary`, `${f2} button`))
        || (r2 && primero(`${r2} > .neuri-acciones button`, `${r2} button`)) || log).focus({ preventScroll: true });
    }
    log.querySelectorAll('details[data-abre]').forEach((d) => d.addEventListener('toggle', () => desplegados.set(d.dataset.abre, d.open)));
    enlazarTarjetas(ctx, log);
    log.querySelectorAll('[data-sug]').forEach((b) => b.addEventListener('click', () => enviar(b.dataset.sug)));
    log.querySelectorAll('[data-crear-sol]').forEach((b) => b.addEventListener('click', () => crearDesde(conv.mensajes[+b.dataset.crearSol])));
    log.querySelectorAll('[data-crear-plan]').forEach((b) => b.addEventListener('click', () => {
      const m = conv.mensajes[+b.dataset.crearPlan];
      if (m?.plan && !m.iniciado) { const x = trabajos.iniciar({ plan: m.plan }); m.iniciado = x.id; conv.anotarTrabajo(x.id, resumenTrabajo(x)); pintarMensajes(); }
    }));
    log.querySelectorAll('[data-cancelar-t]').forEach((b) => b.addEventListener('click', () => trabajos.cancelar(b.dataset.cancelarT)));
    log.querySelectorAll('[data-reintentar-t]').forEach((b) => b.addEventListener('click', () => {
      const x = reintentar(b.dataset.reintentarT);
      if (x) ponerGesto('pensando', 3000);
      pintarMensajes();
    }));
    log.querySelectorAll('[data-descargar]').forEach((b) => b.addEventListener('click', () => descargar(trabajos.resultado(b.dataset.descargar))));
    log.querySelectorAll('[data-mis-lecciones]').forEach((b) => b.addEventListener('click', () => ctx.verMisLecciones?.()));
    log.querySelectorAll('[data-cancelar-pregunta]').forEach((b) => b.addEventListener('click', () => { conv.cancelar(); pintarMensajes(); ponerGesto('reposo'); }));
    log.querySelectorAll('[data-repreguntar]').forEach((b) => b.addEventListener('click', () => enviar(conv.mensajes[+b.dataset.repreguntar]?.reintentar)));
    log.querySelectorAll('[data-cambiar]').forEach((b) => b.addEventListener('click', () => {
      const ta = ctx.body.querySelector('#neuri-q');
      // Lo que se deja escrito para pedir el cambio: del plan, de un recorrido o de una de sus unidades.
      const [que, rid, uid] = (b.dataset.cambiar ?? '').split(':');
      const R = rid ? recorridos.buscar(rid) : null;
      const n = R && uid ? R.unidades.findIndex((u) => u.id === uid) + 1 : 0;
      const borrador = que === 'plan' ? t('pet.cambiarPlanBorrador')
        : que === 'recorrido' && R ? t('pet.rec.cambiarBorrador', { titulo: R.titulo })
          : que === 'unidad' && R && n ? t('pet.rec.cambiarUnidadBorrador', { n, titulo: R.titulo }) : '';
      if (borrador && !ta.value) { ta.value = borrador; ta.dispatchEvent(new Event('input')); }
      ta.focus();
      ta.setSelectionRange(ta.value.length, ta.value.length);
    }));
    // Recorridos personales: crear una unidad, la siguiente o todas (en cola), parar la cola, volver a planificar…
    const tras = (r) => { if (r?.ok) ponerGesto('pensando', 3000); pintarMensajes(); };
    log.querySelectorAll('[data-rec-crear]').forEach((b) => b.addEventListener('click', () => { const [rid, uid] = b.dataset.recCrear.split(':'); tras(recorridos.crearUnidad(rid, uid)); }));
    log.querySelectorAll('[data-rec-siguiente]').forEach((b) => b.addEventListener('click', () => tras(recorridos.crearSiguiente(b.dataset.recSiguiente))));
    log.querySelectorAll('[data-rec-todas]').forEach((b) => b.addEventListener('click', () => tras(recorridos.crearTodas(b.dataset.recTodas))));
    log.querySelectorAll('[data-rec-parar]').forEach((b) => b.addEventListener('click', () => { recorridos.parar(b.dataset.recParar); pintarMensajes(); }));
    log.querySelectorAll('[data-rec-reintentar]').forEach((b) => b.addEventListener('click', () => tras(recorridos.reintentar(b.dataset.recReintentar))));
    log.querySelectorAll('[data-rec-cancelar]').forEach((b) => b.addEventListener('click', () => cancelarRecorrido(b.dataset.recCancelar)));
    log.querySelectorAll('[data-rec-aviso-x]').forEach((b) => b.addEventListener('click', () => { recorridos.olvidarAviso(b.dataset.recAvisoX); pintarMensajes(); }));
    log.querySelectorAll('[data-rec-quitar-vacio]').forEach((b) => b.addEventListener('click', () => { quitarRecorrido(b.dataset.recQuitarVacio); pintarMensajes(); }));
    log.querySelectorAll('[data-abrir-leccion]').forEach((b) => b.addEventListener('click', () => abrirLeccion(ctx, b.dataset.abrirLeccion)));
    log.querySelectorAll('[data-ficha]').forEach((b) => b.addEventListener('click', () => ctx.ir({ tipo: 'info', id: b.dataset.ficha })));
    log.querySelectorAll('[data-ir-paso]').forEach((b) => b.addEventListener('click', async () => {
      const L = await ctx.cargarLeccion(b.dataset.irPaso);
      const k = L ? Math.max(0, L.pasos.findIndex((p) => p.id === b.dataset.pasoId)) : 0;
      abrirLeccion(ctx, b.dataset.irPaso, { paso: k });
    }));
    // Al final de la conversación, pero mostrando el principio de la última respuesta si es larga; si la persona
    // estaba leyendo más arriba y solo cambió el estado de una creación, no se la mueve.
    // (Solo un mensaje nuevo lleva a su principio: si solo cambió un estado, quien estaba al final sigue al final, aunque
    // la tarjeta sea más alta que la conversación, como la de un recorrido.)
    if (alFinal || log.childElementCount !== antes) {
      const ultimo = log.lastElementChild;
      const nuevo = log.childElementCount !== antes;
      log.scrollTop = nuevo && ultimo && ultimo.offsetHeight > log.clientHeight ? ultimo.offsetTop - 8 : log.scrollHeight;
    }
    const boton = ctx.body.querySelector('.neuri-enviar');
    const ta = ctx.body.querySelector('#neuri-q');
    if (boton && ta) boton.disabled = !ta.value.trim() || conv.ocupada;
  }

  // ── Acciones ──
  async function enviar(texto) {
    if (conv.ocupada || !String(texto ?? '').trim()) return;
    const ta = ctx.body.querySelector('#neuri-q');
    if (ta) { ta.value = ''; ta.style.height = ''; }
    ctx.borradorNeuri = '';
    const promesa = conv.preguntar(texto);
    pintarMensajes();
    ponerGesto('pensando');
    const m = await promesa;
    if (!enConversacion()) {
      // Se fue a otra vista: la respuesta estará al volver; una creación pedida expresamente empieza igual.
      if (m) arrancarSiPedida(m);
      return;
    }
    pintarModo();
    if (m) arrancarSiPedida(m);
    pintarMensajes();
    if (m) anunciar(`Neuri: ${m.tipo === 'error' ? textoError(m.codigo) : m.aviso === 'sin-respaldo' ? t('pet.explicacionRetirada') : m.texto}`);
    const bien = m && (m.lecciones?.length || m.recorrido || m.sesion || m.solicitud || m.evidencias?.length);
    ponerGesto(bien ? 'contento' : 'dudando', bien ? 2600 : 3400);
    ctx.body.querySelector('#neuri-q')?.focus({ preventScroll: true });
  }

  /** «Créame una lección…» con un alcance suficiente: empieza sin otra confirmación (especificación, sección 14). */
  function arrancarSiPedida(m) {
    if (m.tipo === 'propuesta' && m.solicitud?.explicita && m.solicitud?.suficiente && conv.crear !== false) crearDesde(m);
  }

  /** Empieza la creación de una propuesta (una sola vez): planifica y redacta seguido, con sus etapas a la vista. */
  function crearDesde(m) {
    if (!m?.solicitud || m.iniciado) return;
    if (m.solicitud.accion === 'recorrido') { planificarRecorrido(m); return; }
    const x = trabajos.iniciar({ solicitud: m.solicitud, titulo: m.solicitud.tema });
    ctx.evento?.('generacion_solicitada', { accion: m.solicitud.accion === 'adaptar' ? 'adaptar' : 'crear' }, { clave: x.id });
    m.iniciado = x.id;
    conv.anotarTrabajo(x.id, resumenTrabajo(x));
    if (enConversacion()) { pintarMensajes(); ponerGesto('pensando', 3000); }
  }

  /**
   * Planifica el recorrido de una propuesta (una sola vez), o el cambio de uno que ya existe. Si la persona lo pidió
   * expresamente («créame un curso…»), al tener las unidades se crea también la primera; las demás, cuando diga.
   */
  function planificarRecorrido(m) {
    const s = m.solicitud;
    const base = s.recorrido_base ? recorridos.buscar(s.recorrido_base) : null;
    const r = base ? recorridos.replanificar(base.id, s) : recorridos.planificar(s, { auto: s.explicita && s.suficiente });
    if (!r.ok) {
      m.errorRec = r.error === 'planificando' ? 'ocupado' : r.error;
      if (enConversacion()) pintarMensajes();
      return;
    }
    m.iniciado = r.recorrido.id;
    m.errorRec = null;
    conv.anotarRecorrido(r.recorrido.id, recorridos.instantanea(r.recorrido));
    if (enConversacion()) { pintarMensajes(); ponerGesto('pensando', 3000); }
  }

  /** Cancela la planificación de un recorrido: uno nuevo no deja nada; un cambio deja el recorrido como estaba. */
  function cancelarRecorrido(id) {
    const R = recorridos.buscar(id);
    const titulo = R?.titulo;
    if (!recorridos.cancelar(id)) return;
    if (!recorridos.buscar(id)) conv.resumirRecorrido(id, { estado: 'cancelado', titulo });
    pintarMensajes();
    ponerGesto('reposo');
  }

  /**
   * Quita un recorrido. Sus lecciones se quedan en «Mis lecciones» salvo que la persona pida, aparte y tras confirmarlo,
   * quitarlas también (`lecciones`). Devuelve { ok, borradas, lecciones }.
   */
  function quitarRecorrido(id, { lecciones = false } = {}) {
    const R = recorridos.buscar(id);
    if (!R) return { ok: false, borradas: 0, lecciones: 0 };
    const titulo = R.titulo;
    const r = recorridos.quitar(id);
    conv.resumirRecorrido(id, { quitado: true, titulo });
    let borradas = 0;
    if (lecciones) for (const lid of r.lecciones) if (ctx.borrarPropia(lid)) borradas++;
    return { ok: r.ok, borradas, lecciones: r.lecciones.length };
  }

  /** Vuelve a intentar una creación; si empieza otra (con el mismo plan), la conversación la sigue en el mismo mensaje. */
  function reintentar(id) {
    const x = trabajos.reintentar(id);
    // (La de una unidad se sigue en la tarjeta de su recorrido: no hace falta otro mensaje.)
    if (x?.reemplaza && !conv.cambiarTrabajo(x.reemplaza, x.id, resumenTrabajo(x)) && !x.unidad) conv.anotarTrabajo(x.id, resumenTrabajo(x));
    return x;
  }

  /** Abre la conversación en una creación (desde la portada o un aviso); si la conversación es otra, se añade. */
  function verTrabajo(id) {
    // Una unidad de un recorrido se ve en la tarjeta del recorrido, con sus detalles abiertos.
    const de = recorridos.deTrabajo(id);
    if (de) { verRecorrido(de.recorrido.id, { unidad: de.unidad.id }); return; }
    const x = trabajos.buscar(id);
    if (x && !conv.tieneTrabajo(id)) conv.anotarTrabajo(id, resumenTrabajo(x));
    pendiente = { trabajo: id };
    if (enConversacion()) { pintarMensajes(); aplicarPendiente(); return; }
    ctx.mostrar({ tipo: 'neuri' });
  }

  /** Abre la conversación en un recorrido (desde «Mis lecciones» o un aviso); si la conversación es otra, se añade. */
  function verRecorrido(id, { unidad = null } = {}) {
    const R = recorridos.buscar(id);
    if (R && !conv.tieneRecorrido(id)) conv.anotarRecorrido(id, recorridos.instantanea(R));
    if (unidad) desplegados.set(`unidad-${unidad}`, true);
    pendiente = { recorrido: id, unidad };
    if (enConversacion()) { pintarMensajes(); aplicarPendiente(); return; }
    ctx.mostrar({ tipo: 'neuri' });
  }

  /** Descarga una lección (la que no se pudo guardar) como archivo JSON, para no perderla. */
  function descargar(L) {
    if (!L || !descargarArchivo(`${L.id}.json`, JSON.stringify(L, null, 2))) ctx.toast(t('pet.error.generico'));
  }

  return {
    actualizar,
    renderVista,
    abrir,
    /** Las creaciones (para «Mis lecciones» en la portada). */
    trabajos,
    verTrabajo,
    reintentar,
    /** Los recorridos personales (para «Mis lecciones»). */
    recorridos,
    verRecorrido,
    quitarRecorrido,
    /** ¿Se pueden crear lecciones ahora? (false si se sabe que no hay IA; null si aún no se sabe). */
    puedeCrear: () => conv.crear !== false,
    /** «Borrar mis datos»: para las creaciones en curso y olvida los recorridos y la conversación. */
    olvidarTodo() { trabajos.olvidar(); recorridos.olvidar(); enMarcha.clear(); planesVistos.clear(); conv.reiniciar(); desplegados.clear(); },
    etiquetaEtapa,
    textoError,
    textoUnidad,
    /** Una búsqueda sin lecciones: Neuri se ofrece desde su lanzador. */
    sinResultados() { burbuja('pet.burbujaSin', 9000); },
  };
}
