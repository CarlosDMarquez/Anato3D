// Neuri en la interfaz de «Estudiar»: el lanzador (abajo a la derecha del panel, con su globo), la conversación (vista
// «neuri» de la biblioteca) y las entradas desde la portada, la ficha de una lección y una búsqueda sin resultados.
// La lógica está en src/pet/: la conversación y el servidor (conversacion.js), las respuestas sin IA (local.js) y lo
// que se acepta (protocolo.js).
//
// Lo que se ve en la conversación sigue los estados de la especificación de Neuri: una propuesta (lo que la persona
// pidió crear o adaptar), un plan (el alcance), la generación (fuentes → redacción → comprobación → corrección) y la
// lección disponible, que solo se anuncia cuando la app la ha guardado en «Mis lecciones».
import * as P from '../../biblioteca/progreso.js';
import { RECORRIDOS, RECORRIDO_POR_ID } from '../../biblioteca/recorridos.js';
import { resumenPropia } from '../../biblioteca/propias.js';
import { crearConversacion } from '../../pet/conversacion.js';
import { responderLocal } from '../../pet/local.js';
import { LIMITES, ID_PROPIA } from '../../pet/protocolo.js';
import { t, tn, idioma } from '../../i18n/idioma.js';
import { tr } from '../../i18n/contenido.js';
import { esc, icono, tarjetaLeccion, tarjetaRecorrido, nomLugar, nomSistema, nomTema, nomNivel } from './comun.js';
import { enlazarTarjetas, abrirLeccion } from './explorar.js';
import { svgNeuri, gesto } from './neuri-svg.js';

// Vistas del catálogo, donde está el lanzador (en las lecciones y las preguntas, el modelo necesita el sitio).
const CON_LANZADOR = new Set(['portada', 'resultados', 'recorrido', 'info', 'sesion']);
const CLAVE_VISTO = 'anato3d.neuri.visto';
const ESTADOS_GENERACION = ['fuentes', 'redactando', 'comprobando', 'guardada'];
const leer = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const anotar = (k, v) => { try { localStorage.setItem(k, v); } catch { /* sin almacenamiento */ } };
const almacenSesion = () => { try { return sessionStorage; } catch { return null; } };
const parrafos = (s) => String(s).split(/\n+/).map((p) => p.trim()).filter(Boolean).map((p) => `<p>${esc(p)}</p>`).join('');
// Códigos de error y de límite con texto propio; los demás, el genérico.
const CODIGOS = new Set(['sin-ia', 'limite', 'ocupado', 'cancelada', 'interrumpida', 'sin-recursos', 'sin-estructuras', 'pocas-evidencias', 'plan-invalido', 'validacion', 'limitacion']);
const textoError = (c) => t(`pet.error.${CODIGOS.has(c) ? c : 'generico'}`);
// Límites del plan en sí (no del momento): reintentar daría lo mismo.
const SIN_REINTENTO = new Set(['pocas-evidencias', 'limitacion', 'plan', 'base']);
const nombreFuente = (f) => (f.startsWith('wpes:') ? t('bib.wikipediaEs') : f.startsWith('tma:') ? 'TeachMeAnatomy' : t('bib.wikipediaEn'));

export function crearNeuri(ctx, panel) {
  let conv = null;
  let pendiente = null;        // { texto } a enviar o { borrador } a dejar escrito al abrir la conversación
  let relojGesto = null;
  let relojBurbuja = null;
  let idiomaPintado = null;

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

  // ── Conversación ──
  function asegurarConversacion() {
    if (conv) return conv;
    // Las lecciones válidas cambian al crear o quitar lecciones propias: se leen cada vez.
    const ids = { get lecciones() { return new Set(ctx.porId.keys()); }, recorridos: new Set(RECORRIDOS.map((R) => R.id)) };
    conv = crearConversacion({
      ids, idioma, almacen: almacenSesion(),
      local: (texto) => responderLocal(texto, entornoLocal()),
      progreso: resumenProgreso,
      propias: () => ctx.propias.map(resumenPropia),
    });
    return conv;
  }

  /** Lo que se cuenta a Neuri del progreso: solo identificadores de lecciones (nunca respuestas ni fechas). */
  function resumenProgreso() {
    const ahora = Date.now();
    const terminadas = [];
    const enCurso = [];
    for (const L of ctx.catalogo.lecciones) {
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
    if (p?.texto) enviar(p.texto);
    else if (p?.borrador && ta) { ta.value = p.borrador; ta.dispatchEvent(new Event('input')); ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); }
    else requestAnimationFrame(() => ta?.focus({ preventScroll: true }));
  }

  const avatar = () => ctx.body.querySelector('.neuri-presenta svg.neuri');
  function ponerGesto(estado, volverEn = 0) {
    clearTimeout(relojGesto);
    gesto(avatar(), estado);
    if (volverEn) relojGesto = setTimeout(() => { if (!conv?.ocupada) gesto(avatar(), 'reposo'); }, volverEn);
  }
  const enConversacion = () => ctx.vista.tipo === 'neuri' && ctx.body.querySelector('.neuri-vista');

  function renderVista() {
    const c = asegurarConversacion();
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
        <div class="neuri-log" role="log" aria-live="polite" aria-label="${esc(t('pet.conversacion'))}" tabindex="0"></div>
        <form class="neuri-form">
          <label class="sr-only" for="neuri-q">${esc(t('pet.escribe'))}</label>
          <textarea id="neuri-q" rows="1" maxlength="${LIMITES.usuario}" placeholder="${esc(t('pet.placeholder'))}" enterkeyhint="send" autocomplete="off"></textarea>
          <button class="neuri-enviar" type="submit" aria-label="${esc(t('pet.enviar'))}" title="${esc(t('pet.enviar'))}" disabled>${icono('send')}</button>
        </form>
        <p class="neuri-nota" hidden></p>
      </section>`;

    const ta = ctx.body.querySelector('#neuri-q');
    const boton = ctx.body.querySelector('.neuri-enviar');
    const ajustarAlto = () => { ta.style.height = 'auto'; ta.style.height = `${Math.min(ta.scrollHeight + 2, 120)}px`; };
    let relojEscucha = null;
    ta.addEventListener('input', () => {
      ajustarAlto();
      boton.disabled = !ta.value.trim() || c.ocupada;
      if (c.ocupada) return;
      ponerGesto(ta.value.trim() ? 'escuchando' : 'reposo');
      clearTimeout(relojEscucha);
      relojEscucha = setTimeout(() => { if (!c.ocupada) ponerGesto('reposo'); }, 1600);
    });
    ta.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); enviar(ta.value); }
    });
    ctx.body.querySelector('.neuri-form').addEventListener('submit', (e) => { e.preventDefault(); enviar(ta.value); });
    ctx.body.querySelector('[data-atras]').addEventListener('click', () => ctx.volver());
    ctx.body.querySelector('[data-nueva]').addEventListener('click', () => {
      if (c.ocupada) return;
      c.reiniciar();
      pintarMensajes();
      ponerGesto('reposo');
      ta.focus();
    });

    pintarModo();
    if (c.ia === null) c.comprobar().then(() => { if (enConversacion()) { pintarModo(); pintarMensajes(); } });
    pintarMensajes();
    if (c.ocupada) ponerGesto('pensando');
    aplicarPendiente();
  }

  /** Con IA o con el buscador: lo dice arriba, y la nota de abajo explica qué se envía (o que no se envía nada). */
  function pintarModo() {
    const ia = conv?.ia;
    const modo = ctx.body.querySelector('.neuri-modo');
    const nota = ctx.body.querySelector('.neuri-nota');
    if (!modo || ia === null) return;
    modo.className = `neuri-modo${ia ? ' ia' : ''}`;
    modo.innerHTML = `${icono(ia ? 'sparkles' : 'search')}<span>${esc(t(ia ? 'pet.conIa' : 'pet.sinIa'))}</span>`;
    modo.hidden = false;
    nota.textContent = t(ia ? 'pet.nota' : 'pet.notaLocal');
    nota.hidden = false;
  }

  // ── Mensajes ──
  const sugerencias = (lista) => (lista?.length ? `<p class="neuri-sugs">${lista.map((s) => `<button type="button" class="bib-chip" data-sug="${esc(s)}">${esc(s)}</button>`).join('')}</p>` : '');
  const fav = (id) => ctx.data.favoritos.includes(id);
  const tarjetas = (lista) => lista.map(({ id, motivo }) => ctx.porId.get(id) && tarjetaLeccion(ctx.porId.get(id), ctx.estado(ctx.porId.get(id)), fav(id), { compacta: true, nota: motivo })).filter(Boolean).join('');

  function htmlEvidencias(evs) {
    if (!evs?.length) return '';
    return `<details class="neuri-fuentes" open><summary>${icono('quote')}${esc(t('pet.fuentesRespuesta', { n: evs.length }))}</summary><ul>${evs.map((e) => {
      const L = e.leccion && ctx.porId.get(e.leccion);
      return `<li>${e.texto ? `<p class="neuri-ev-texto">${esc(e.texto)}</p>` : ''}
        <p class="neuri-ev-cita" lang="${e.f.startsWith('wpes:') ? 'es' : 'en'}">“${esc(e.cita)}”</p>
        <p class="neuri-ev-de">${e.url ? `<a href="${esc(e.url)}" target="_blank" rel="noopener">${esc(nombreFuente(e.f))}: «${esc(e.titulo)}»</a>` : esc(e.titulo)}${e.licencia ? ` <small>· ${esc(e.licencia)}</small>` : ''}
        ${L ? ` · <button class="link" data-ir-paso="${esc(L.id)}" data-paso-id="${esc(e.paso ?? '')}">${esc(t('pet.verEnLeccion', { titulo: tr(L.titulo) }))}</button>` : ''}</p></li>`;
    }).join('')}</ul></details>`;
  }

  function htmlSolicitud(m, i) {
    const s = m.solicitud;
    const adaptar = s.accion === 'adaptar';
    const base = s.leccion_base && ctx.porId.get(s.leccion_base);
    const fila = (k, v) => (v ? `<dt>${esc(t(`pet.campo.${k}`))}</dt><dd>${esc(v)}</dd>` : '');
    const puede = conv?.crear !== false;
    const usada = conv.mensajes.slice(i + 1).some((x) => x.tipo === 'plan' || x.tipo === 'generacion');
    // Mientras se planifica esta propuesta (la última de la conversación), el botón lo dice.
    const planificando = conv.ocupada && !usada && i === conv.mensajes.length - 1;
    return `<div class="neuri-tarjeta neuri-propuesta">
      <p class="neuri-tarjeta-t">${icono('sparkles')}<span>${esc(t(adaptar ? 'pet.propuestaAdaptar' : 'pet.propuestaCrear'))}</span></p>
      <dl class="neuri-campos">
        ${adaptar && base ? fila('base', tr(base.titulo)) : ''}${fila('tema', s.tema)}${fila('objetivo', s.objetivo)}
        ${fila('nivel', s.nivel ? nomNivel(s.nivel) : '')}${fila('minutos', s.minutos ? t('bib.minutos', { n: s.minutos }) : '')}
        ${fila('enfoque', s.enfoque)}${fila('supuestos', s.supuestos.join(' · '))}
      </dl>
      ${puede ? `<div class="neuri-acciones">
        <button class="btn primary${planificando ? ' ocupado' : ''}" type="button" data-planificar="${i}" ${usada || conv.ocupada ? 'disabled' : ''} ${planificando ? 'aria-busy="true"' : ''}>${planificando ? '<i class="neuri-giro" aria-hidden="true"></i>' : icono('route')}<span>${esc(t(planificando ? 'pet.planificando' : adaptar ? 'pet.planificarAdaptacion' : 'pet.planificar'))}</span></button>
        <button class="btn" type="button" data-cambiar>${esc(t('pet.cambiar'))}</button>
      </div>` : `<p class="neuri-aviso-t">${esc(t('pet.necesitaIa'))}</p>`}
    </div>`;
  }

  function htmlPlan(m, i) {
    const p = m.plan;
    const adaptar = p.accion === 'adaptar';
    const base = p.base && ctx.porId.get(p.base);
    const est = (papel) => p.estructuras.filter((e) => e.papel === papel).map((e) => {
      const d = m.estructuras?.[e.clave];
      return `<li class="bib-chip ${papel === 'nucleo' ? 'on' : ''}" title="${esc(t(papel === 'nucleo' ? 'pet.nucleo' : 'pet.contexto'))}">${esc(d?.nombre ?? e.clave.replace(/_/g, ' '))}</li>`;
    }).join('');
    const usada = conv.mensajes.slice(i + 1).some((x) => x.tipo === 'generacion' && x.generacion?.estado !== 'error');
    return `<div class="neuri-tarjeta neuri-plan">
      <p class="neuri-tarjeta-t">${icono('route')}<span>${esc(t(adaptar ? 'pet.planAdaptacion' : 'pet.planTitulo'))}</span></p>
      <h4 class="neuri-plan-t">${esc(p.titulo)}</h4>
      ${adaptar && base ? `<p class="neuri-plan-base">${esc(t('pet.campo.base'))}: ${esc(tr(base.titulo))}</p>` : ''}
      <p class="neuri-plan-r">${esc(p.resumen)}</p>
      <p class="bib-meta"><span>${esc(nomNivel(p.nivel))}</span><span>${icono('clock')}${esc(t('bib.minutos', { n: p.minutos }))}</span><span>${esc(tn('bib.pasos', p.pasos.length))}</span></p>
      <h5>${esc(t('pet.planObjetivos'))}</h5><ul class="neuri-lista">${p.objetivos.map((o) => `<li>${esc(o)}</li>`).join('')}</ul>
      <h5>${esc(t('pet.planPasos'))}</h5><ol class="neuri-lista">${p.pasos.map((s) => `<li><b>${esc(s.titulo)}</b> <small>${esc(t(`paso.${s.tipo}`))}</small><br><span>${esc(s.idea)}</span></li>`).join('')}</ol>
      <h5>${esc(t('pet.planEstructuras'))}</h5><ul class="bib-chips">${est('nucleo')}${est('contexto')}</ul>
      ${p.limitaciones.length ? `<h5>${esc(t('pet.planLimitaciones'))}</h5><ul class="neuri-lista">${p.limitaciones.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
      ${p.supuestos.length ? `<h5>${esc(t('pet.planSupuestos'))}</h5><ul class="neuri-lista">${p.supuestos.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
      ${m.paginas?.length ? `<h5>${esc(t('pet.planFuentes'))}</h5><ul class="neuri-lista">${m.paginas.map((x) => `<li><a href="${esc(x.url)}" target="_blank" rel="noopener">Wikipedia: «${esc(x.titulo)}»</a></li>`).join('')}</ul>` : ''}
      <p class="neuri-plan-nota">${esc(t('pet.planNota'))}</p>
      <div class="neuri-acciones">
        <button class="btn primary" type="button" data-crear="${i}" ${usada || conv.ocupada ? 'disabled' : ''}>${icono('sparkles')}<span>${esc(t(adaptar ? 'pet.crearAdaptacion' : 'pet.crearLeccion'))}</span></button>
        <button class="btn" type="button" data-cambiar="plan">${esc(t('pet.cambiarPlan'))}</button>
      </div>
    </div>`;
  }

  function htmlGeneracion(m, i) {
    const g = m.generacion ?? {};
    const final = ['guardada', 'no-guardada', 'lista', 'limitacion', 'error'].includes(g.estado);
    const titulo = t('pet.generando', { titulo: g.titulo ?? '' });
    if (g.estado === 'guardada' || g.estado === 'no-guardada' || g.estado === 'lista') {
      const L = g.leccionId && ctx.porId.get(g.leccionId);
      const inf = g.informe;
      return `<div class="neuri-tarjeta neuri-gen ok">
        <p class="neuri-tarjeta-t">${icono('check')}<span>${esc(t(g.estado === 'guardada' ? 'pet.estado.guardada' : 'pet.estado.lista'))}</span></p>
        ${m.texto ? `<div class="neuri-globo neuri-globo-in">${parrafos(m.texto)}</div>` : ''}
        ${inf ? `<p class="neuri-informe">${esc(t('pet.informe', { pasos: inf.pasos, preguntas: inf.preguntas, citas: inf.citas }))}${inf.quitadas ? ` ${esc(tn('pet.informeQuitadas', inf.quitadas))}` : ''}</p>` : ''}
        ${g.estado === 'no-guardada' ? `<p class="neuri-aviso-t">${esc(t('pet.noGuardada'))}</p>` : ''}
        ${L ? `<div class="neuri-recs">${tarjetaLeccion(L, ctx.estado(L), fav(L.id), { compacta: true })}</div>
          <div class="neuri-acciones"><button class="btn primary" type="button" data-abrir-leccion="${esc(L.id)}">${esc(t('pet.abrirLeccion'))}</button>
          <button class="btn" type="button" data-ficha="${esc(L.id)}">${esc(t('pet.verFicha'))}</button></div>` : ''}
        <p class="neuri-plan-nota">${esc(t('pet.borradorIa'))}</p>
      </div>`;
    }
    if (g.estado === 'limitacion' || g.estado === 'error') {
      const codigo = g.codigo ?? g.error ?? (g.estado === 'limitacion' ? 'limitacion' : 'generico');
      return `<div class="neuri-tarjeta neuri-gen mal">
        <p class="neuri-tarjeta-t">${icono('info')}<span>${esc(t('pet.noCreada', { titulo: g.titulo ?? '' }))}</span></p>
        <p>${esc(m.texto || textoError(codigo))}</p>
        ${g.errores?.length ? `<details class="neuri-detalles"><summary>${esc(t('pet.detalles'))}</summary><ul>${g.errores.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></details>` : ''}
        <div class="neuri-acciones">${SIN_REINTENTO.has(codigo)
          // Con el mismo plan saldría lo mismo: lo que sirve es cambiarlo.
          ? `<button class="btn" type="button" data-cambiar="plan">${esc(t('pet.cambiarPlan'))}</button>`
          : `<button class="btn" type="button" data-reintentar="${i}" ${conv.ocupada ? 'disabled' : ''}>${esc(t('pet.reintentar'))}</button>`}</div>
      </div>`;
    }
    // En curso: los pasos, con el actual animado.
    const actual = g.estado === 'corrigiendo' ? 'comprobando' : g.estado === 'solicitada' ? 'fuentes' : g.estado;
    const k = ESTADOS_GENERACION.indexOf(actual);
    return `<div class="neuri-tarjeta neuri-gen" aria-busy="${!final}">
      <p class="neuri-tarjeta-t">${icono('sparkles')}<span>${esc(titulo)}</span></p>
      <ol class="neuri-pasos-gen">${ESTADOS_GENERACION.map((e, j) => `<li class="${j < k ? 'hecho' : j === k ? 'actual' : ''}">${j < k ? icono('check') : '<i></i>'}<span>${esc(e === 'redactando' && g.evidencias ? t('pet.estado.redactandoN', { n: g.evidencias }) : t(`pet.estado.${e}`))}</span></li>`).join('')}</ol>
      ${g.estado === 'corrigiendo' ? `<p class="neuri-informe">${esc(tn('pet.estado.corrigiendo', g.errores ?? 1))}</p>` : ''}
      <div class="neuri-acciones"><button class="btn" type="button" data-cancelar>${esc(t('pet.cancelar'))}</button></div>
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

  function htmlMensaje(m, i, ultimo) {
    if (m.rol === 'usuario') return `<div class="neuri-msg yo"><p><span class="sr-only">${esc(t('pet.tu'))}: </span>${esc(m.texto)}</p></div>`;
    if (m.tipo === 'plan') return `<div class="neuri-msg pet">${m.texto ? `<div class="neuri-globo">${parrafos(m.texto)}</div>` : ''}${htmlPlan(m, i)}</div>`;
    if (m.tipo === 'generacion') return `<div class="neuri-msg pet">${htmlGeneracion(m, i)}</div>`;
    if (m.tipo === 'error') return `<div class="neuri-msg pet"><div class="neuri-globo"><p>${esc(textoError(m.codigo))}</p></div></div>`;
    const R = m.recorrido ? RECORRIDO_POR_ID.get(m.recorrido) : null;
    // Una explicación que sus citas no respaldaban no se enseña: solo las citas (frases literales de las fuentes).
    const texto = m.aviso === 'sin-respaldo' ? t('pet.explicacionRetirada') : m.texto || (m.codigo ? textoError(m.codigo) : '');
    return `<div class="neuri-msg pet">
      <div class="neuri-globo"><span class="sr-only">Neuri: </span>${parrafos(texto)}
        ${m.aviso === 'sin-evidencia' ? `<p class="neuri-aviso">${esc(t('pet.sinEvidencia'))}</p>` : m.aviso && m.aviso !== 'sin-respaldo' ? `<p class="neuri-aviso">${esc(t(`pet.aviso.${m.aviso}`))}</p>` : ''}
        ${m.origen === 'buscador' && conv?.ia !== false ? `<p class="neuri-origen">${icono('search')}<span>${esc(t('pet.origenBuscador'))}</span></p>` : ''}
      </div>
      ${htmlEvidencias(m.evidencias)}
      ${m.solicitud ? htmlSolicitud(m, i) : ''}
      ${m.lecciones?.length ? `<div class="neuri-recs" role="group" aria-label="${esc(t('pet.leccionesSugeridas'))}">${tarjetas(m.lecciones)}</div>` : ''}
      ${m.sesion ? htmlSesion(m.sesion) : ''}
      ${R ? `<div class="neuri-recs" role="group" aria-label="${esc(t('pet.recorridoSugerido'))}">${tarjetaRecorrido(R, ctx.resumenRecorrido(R), fav(R.id))}</div>` : ''}
      ${ultimo ? sugerencias(m.sugerencias) : ''}
    </div>`;
  }

  function pintarMensajes() {
    const log = ctx.body.querySelector('.neuri-log');
    if (!log || !conv) return;
    const ms = conv.mensajes;
    const hola = `<div class="neuri-msg pet"><div class="neuri-globo"><p>${esc(t('pet.hola'))}</p></div>${ms.length ? '' : sugerencias(t('pet.ejemplos').split('|'))}</div>`;
    const ultimoEsGeneracion = ms.at(-1)?.tipo === 'generacion';
    const escribiendo = conv.ocupada && !ultimoEsGeneracion
      ? `<div class="neuri-msg pet"><div class="neuri-globo"><span class="neuri-puntos" aria-hidden="true"><i></i><i></i><i></i></span><span class="sr-only">${esc(t('pet.pensando'))}</span></div></div>`
      : '';
    log.innerHTML = hola + ms.map((m, i) => htmlMensaje(m, i, i === ms.length - 1)).join('') + escribiendo;
    enlazarTarjetas(ctx, log);
    log.querySelectorAll('[data-sug]').forEach((b) => b.addEventListener('click', () => enviar(b.dataset.sug)));
    log.querySelectorAll('[data-planificar]').forEach((b) => b.addEventListener('click', () => planificar(conv.mensajes[+b.dataset.planificar])));
    log.querySelectorAll('[data-crear]').forEach((b) => b.addEventListener('click', () => crear(conv.mensajes[+b.dataset.crear].plan)));
    log.querySelectorAll('[data-reintentar]').forEach((b) => b.addEventListener('click', () => {
      const plan = conv.mensajes.slice(0, +b.dataset.reintentar).reverse().find((x) => x.tipo === 'plan')?.plan;
      if (plan) crear(plan);
    }));
    log.querySelectorAll('[data-cancelar]').forEach((b) => b.addEventListener('click', () => conv.cancelar()));
    log.querySelectorAll('[data-cambiar]').forEach((b) => b.addEventListener('click', () => {
      const ta = ctx.body.querySelector('#neuri-q');
      if (b.dataset.cambiar === 'plan' && !ta.value) { ta.value = t('pet.cambiarPlanBorrador'); ta.dispatchEvent(new Event('input')); }
      ta.focus();
    }));
    log.querySelectorAll('[data-abrir-leccion]').forEach((b) => b.addEventListener('click', () => abrirLeccion(ctx, b.dataset.abrirLeccion)));
    log.querySelectorAll('[data-ficha]').forEach((b) => b.addEventListener('click', () => ctx.ir({ tipo: 'info', id: b.dataset.ficha })));
    log.querySelectorAll('[data-ir-paso]').forEach((b) => b.addEventListener('click', async () => {
      const L = await ctx.cargarLeccion(b.dataset.irPaso);
      const k = L ? Math.max(0, L.pasos.findIndex((p) => p.id === b.dataset.pasoId)) : 0;
      abrirLeccion(ctx, b.dataset.irPaso, { paso: k });
    }));
    // Al final de la conversación, pero mostrando el principio de la última respuesta si es larga.
    const ultimo = log.lastElementChild;
    log.scrollTop = ultimo && ultimo.offsetHeight > log.clientHeight ? ultimo.offsetTop - 8 : log.scrollHeight;
    const boton = ctx.body.querySelector('.neuri-enviar');
    const ta = ctx.body.querySelector('#neuri-q');
    if (boton && ta) boton.disabled = !ta.value.trim() || conv.ocupada;
  }

  // ── Acciones ──
  async function enviar(texto) {
    const c = asegurarConversacion();
    if (c.ocupada || !String(texto ?? '').trim()) return;
    const ta = ctx.body.querySelector('#neuri-q');
    if (ta) { ta.value = ''; ta.style.height = ''; }
    const promesa = c.preguntar(texto);
    pintarMensajes();
    ponerGesto('pensando');
    const m = await promesa;
    if (!enConversacion()) return;                   // se fue a otra vista: al volver, la respuesta estará ahí
    pintarModo();
    pintarMensajes();
    const bien = m && (m.lecciones?.length || m.recorrido || m.sesion || m.solicitud || m.evidencias?.length);
    ponerGesto(bien ? 'contento' : 'dudando', bien ? 2600 : 3400);
    ctx.body.querySelector('#neuri-q')?.focus({ preventScroll: true });
  }

  /** La lección propia entera que se adapta (las de la biblioteca las tiene el servidor). */
  const basePropia = (id) => (id && ID_PROPIA.test(id) ? ctx.propias.find((L) => L.id === id) ?? null : null);

  async function planificar(m) {
    const c = asegurarConversacion();
    if (c.ocupada || !m?.solicitud) return;
    const promesa = c.planificar(m.solicitud, { base: basePropia(m.solicitud.leccion_base) });
    pintarMensajes();
    ponerGesto('pensando');
    const r = await promesa;
    if (!enConversacion()) return;
    pintarMensajes();
    ponerGesto(r?.tipo === 'plan' ? 'contento' : 'dudando', 3000);
  }

  async function crear(plan) {
    const c = asegurarConversacion();
    if (c.ocupada || !plan) return;
    ponerGesto('pensando');
    const promesa = c.crearLeccion(plan, { base: basePropia(plan.base), alEstado: () => { if (enConversacion()) pintarMensajes(); } });
    pintarMensajes();
    const fin = await promesa;
    const m = c.mensajes.at(-1);
    // Solo cuando la app la ha guardado se dice que está disponible (especificación de Neuri).
    if (fin?.estado === 'lista' && fin.leccion && m?.tipo === 'generacion') {
      const r = ctx.guardarPropia(fin.leccion);
      c.confirmarGuardada(m, r.ok, r.error ?? null);
      ctx.toast(t(r.ok ? 'pet.estado.guardada' : 'pet.noGuardada'));
    }
    if (!enConversacion()) return;
    pintarMensajes();
    ponerGesto(fin?.estado === 'lista' ? 'contento' : 'dudando', 3200);
  }

  return {
    actualizar,
    renderVista,
    abrir,
    /** Una búsqueda sin lecciones: Neuri se ofrece desde su lanzador. */
    sinResultados() { burbuja('pet.burbujaSin', 9000); },
  };
}
