// Portada de la biblioteca: buscador, continuar, repasos pendientes, sesión según el tiempo (una sesión guardada con
// Neuri, planificada en la app: sesion-neuri.js), prácticas, recorridos recomendados, explorar por región, sistema u
// objetivo y lo guardado.
import * as P from '../../biblioteca/progreso.js';
import * as F from '../../biblioteca/filtros.js';
import { REGIONES, SISTEMAS, TEMAS, NIVELES } from '../../biblioteca/taxonomia.js';
import { RECORRIDOS, RECORRIDO_POR_ID, leccionesDeRecorrido } from '../../biblioteca/recorridos.js';
import { itemsDePractica } from '../../biblioteca/sesion.js';
import { t, tn } from '../../i18n/idioma.js';
import { esc, icono, fecha, fechaDia, tarjetaLeccion, tarjetaRecorrido, nomRegion, nomSistema, nomTema, nomNivel } from './comun.js';
import { enlazarTarjetas, empezarPractica, abrirLeccion } from './explorar.js';
import { tr } from '../../i18n/contenido.js';
import { svgNeuri } from './neuri-svg.js';
import { htmlPreparacion, enlazarPreparacion } from './preparacion.js';
import { proponerSesion, seguirSesion, tituloSesion } from './sesion-neuri.js';

const MINUTOS = [10, 15, 20, 30, 45];

export function renderPortada(ctx) {
  const { body, data, catalogo } = ctx;
  const lecciones = catalogo.lecciones;
  const ahora = Date.now();
  const estado = (L) => ctx.estado(L, { ahora });
  const enCurso = lecciones.filter((L) => estado(L).estado === 'en-curso').sort((a, b) => (estado(b).actividad ?? 0) - (estado(a).actividad ?? 0));
  const vencidas = P.vencidas(data, { ahora, filtro: (id) => ctx.porId.has(id.slice(0, id.indexOf('/'))) });
  const proximo = Object.values(data.items).map((e) => e.proximo).filter((x) => x > ahora).sort((a, b) => a - b)[0];
  const errores = itemsDePractica(data, 'errores').length;
  const estudiadas = Object.keys(data.items).length;
  const empezado = Object.keys(data.lecciones).length > 0;
  const pref = data.preferencias;
  // Con intereses (preferencias opcionales), primero los recorridos que tienen lecciones de esas regiones o sistemas.
  const interesa = (R) => (pref?.intereses?.length ? leccionesDeRecorrido(R).some((id) => {
    const L = ctx.porId.get(id);
    return L && (L.lugares.some(([r]) => pref.intereses.includes(r)) || L.sistemas.some((x) => pref.intereses.includes(x)));
  }) : false);
  const recs = [...RECORRIDOS].sort((a, b) => {
    const ra = ctx.resumenRecorrido(a), rb = ctx.resumenRecorrido(b);
    const prog = (r) => (r.hechas > 0 && r.hechas < r.disponibles ? 0 : 1);
    return prog(ra) - prog(rb) || interesa(b) - interesa(a) || (b.id === 'primeros-pasos') - (a.id === 'primeros-pasos') || rb.disponibles - ra.disponibles;
  }).slice(0, 3);
  const aplazados = P.aplazados(data, ahora).filter((a) => ctx.porId.has(a.id.slice(0, a.id.indexOf('/'))));
  const seguir = enCurso[0];
  const favL = lecciones.filter((L) => data.favoritos.includes(L.id));
  const favR = RECORRIDOS.filter((R) => data.favoritos.includes(R.id));
  const cuenta = (pred) => lecciones.filter(pred).length;
  const minutosSesion = ctx.busqueda.minutos ?? pref?.minutos ?? 15;
  // La sesión con Neuri sin terminar (la activa o la última pausada o sin empezar), para seguirla desde aquí.
  const sesion = ctx.sesiones.activa();
  const nSesiones = ctx.sesiones.lista.length;
  // Las seis acciones de la entrada (especificación, sección 3).
  const acciones = [
    { id: 'seguir', icono: 'play', titulo: t('bib.acc.seguir'), sub: seguir ? tr(seguir.titulo) : t('bib.acc.seguirNada') },
    { id: 'explorar', icono: 'book', titulo: t('bib.acc.explorar'), sub: tn('bib.acc.explorarSub', lecciones.length) },
    { id: 'dificultades', icono: 'target', titulo: t('bib.acc.dificultades'), sub: vencidas.length ? tn('bib.repasosHoy', vencidas.length) : t('bib.verMapa') },
    { id: 'examen', icono: 'clock', titulo: t('bib.acc.examen'), sub: data.examen?.fecha ? t('bib.acc.examenPlan', { fecha: fechaDia(data.examen.fecha) }) : t('bib.acc.examenSub') },
    { id: 'neuri', neuri: true, titulo: t('bib.acc.neuri'), sub: t('bib.acc.neuriSub') },
    { id: 'propias', icono: 'sparkles', titulo: t('pet.misLecciones'), sub: ctx.propias.length ? tn('bib.acc.propiasSub', ctx.propias.length) : t('bib.acc.propiasNada') },
  ];

  body.innerHTML = `
    <form class="bib-buscar" role="search">
      <label class="bib-buscar-titulo" for="bib-q">${esc(t('bib.queAprender'))}</label>
      <div class="bib-buscar-caja">${icono('search')}<input id="bib-q" type="search" autocomplete="off" spellcheck="false"
        placeholder="${esc(t('bib.buscarEjemplo'))}" value="${esc(ctx.busqueda.texto)}" aria-describedby="bib-sug" /></div>
      <p class="bib-sugerencias" id="bib-sug"><span>${esc(t('bib.prueba'))}</span>${t('bib.sugerencias').split('|').map((s) => `<button type="button" class="bib-chip" data-sug="${esc(s)}">${esc(s)}</button>`).join('')}</p>
    </form>

    <nav class="bib-entrada" aria-label="${esc(t('bib.acc.titulo'))}">
      ${acciones.map((a) => `<button type="button" class="bib-acc${a.neuri ? ' bib-acc-neuri' : ''}" data-acc="${a.id}">${a.neuri ? svgNeuri() : icono(a.icono)}<span><b>${esc(a.titulo)}</b><small>${esc(a.sub)}</small></span></button>`).join('')}
    </nav>
    ${htmlPreferencias(ctx)}

    ${enCurso.length ? `
    <section class="bib-sec" aria-labelledby="bib-h-seguir">
      <h3 id="bib-h-seguir" class="bib-h">${esc(t('bib.continuar'))}</h3>
      <div class="bib-grid">${enCurso.slice(0, 2).map((L) => tarjetaLeccion(L, estado(L), data.favoritos.includes(L.id), { compacta: true })).join('')}</div>
    </section>` : ''}

    <div id="bib-propias">${htmlPropias(ctx)}</div>

    <section class="bib-sec bib-hoy" aria-labelledby="bib-h-hoy">
      <h3 id="bib-h-hoy" class="bib-h">${esc(t('bib.hoy'))}</h3>
      <div class="bib-hoy-grid">
        <div class="bib-bloque">
          <p class="bib-bloque-t">${icono('repeat')}${esc(t('bib.repasos'))}</p>
          <p class="bib-bloque-d">${vencidas.length ? esc(tn('bib.repasosHoy', vencidas.length)) : esc(estudiadas ? (proximo ? t('bib.proximoRepaso', { fecha: fecha(proximo) }) : t('bib.alDia')) : t('bib.sinRepasos'))}</p>
          <button class="btn ${vencidas.length ? 'primary' : ''}" data-practica="vencidas" ${vencidas.length ? '' : 'disabled'}>${esc(t('bib.repasarAhora'))}${vencidas.length ? ` (${vencidas.length})` : ''}</button>
          ${vencidas.length ? `<button class="link bib-aplazar" type="button" data-aplazar>${esc(t('bib.mapa.aplazarTodos'))}</button>` : ''}
          ${aplazados.length ? `<p class="bib-bloque-d">${esc(tn('bib.mapa.aplazados', aplazados.length, { fecha: fecha(aplazados[0].hasta) }))} <button class="link" type="button" data-retomar>${esc(t('bib.mapa.retomar'))}</button></p>` : ''}
          <p class="bib-bloque-d"><button class="link" type="button" data-mapa>${esc(t('bib.verMapa'))}</button></p>
        </div>
        <div class="bib-bloque">
          <p class="bib-bloque-t">${icono('timer')}${esc(t('bib.sesionTiempo'))}</p>
          ${sesion ? `<button class="btn primary bib-seguir-sesion" type="button" data-seguir-sesion>${icono('play')}<span>${esc(t(sesion.estado === 'planificada' && !sesion.resultados.length && !sesion.posicion ? 'ses.empezarLa' : 'ses.continuarLa', { x: tituloSesion(sesion) }))}</span></button>
          <p class="bib-bloque-d">${esc(t('ses.bloqueDe', { a: Math.min(sesion.i + 1, sesion.bloques.length), b: sesion.bloques.length }))} · ${esc(t(`ses.estado.${sesion.estado}`))}</p>` : ''}
          <div class="bib-minutos" role="radiogroup" aria-label="${esc(t('bib.cuantoTiempo'))}">
            ${MINUTOS.map((m) => `<button type="button" role="radio" aria-checked="${m === minutosSesion}" class="bib-chip ${m === minutosSesion ? 'on' : ''}" data-min="${m}">${esc(t('bib.minutos', { n: m }))}</button>`).join('')}
          </div>
          <button class="btn${sesion ? '' : ' primary'}" type="button" data-sesion>${esc(t('bib.proponer'))}</button>
          ${nSesiones ? `<p class="bib-bloque-d"><button class="link" type="button" data-mis-sesiones>${esc(tn('ses.misN', nSesiones))}</button></p>` : ''}
        </div>
        <div class="bib-bloque">
          <p class="bib-bloque-t">${icono('target')}${esc(t('bib.practicar'))}</p>
          <p class="bib-bloque-d">${esc(estudiadas ? t('bib.practicarTexto') : t('bib.practicarVacio'))}</p>
          <div class="bib-acciones">
            <button class="btn" data-practica="identificar" ${estudiadas ? '' : 'disabled'}>${esc(t('bib.identificar3d'))}</button>
            <button class="btn" data-practica="errores" ${errores ? '' : 'disabled'}>${esc(t('bib.misErrores'))}${errores ? ` (${errores})` : ''}</button>
          </div>
        </div>
      </div>
    </section>

    <section class="bib-sec" aria-labelledby="bib-h-rec">
      <div class="bib-h-fila"><h3 id="bib-h-rec" class="bib-h">${esc(t(empezado ? 'bib.recorridos' : 'bib.empiezaPor'))}</h3>
        <button class="link" data-todos="recorridos">${esc(t('bib.verTodos', { n: RECORRIDOS.length }))}</button></div>
      <div class="bib-grid">${recs.map((R) => tarjetaRecorrido(R, ctx.resumenRecorrido(R), data.favoritos.includes(R.id))).join('')}</div>
    </section>

    <section class="bib-sec" aria-labelledby="bib-h-reg">
      <h3 id="bib-h-reg" class="bib-h">${esc(t('bib.porRegion'))}</h3>
      <div class="bib-tiles">${REGIONES.map((r) => { const n = cuenta((L) => L.lugares.some(([x]) => x === r.id)); return `
        <button class="bib-tile" data-filtro="region" data-valor="${r.id}"><span>${esc(nomRegion(r.id))}</span><small>${esc(tn('bib.nLecciones', n))}</small></button>`; }).join('')}
      </div>
      <h3 class="bib-h">${esc(t('bib.porSistema'))}</h3>
      <div class="bib-chips">${SISTEMAS.map((s) => { const n = cuenta((L) => L.sistemas.includes(s.id)); return `
        <button class="bib-chip" data-filtro="sistema" data-valor="${s.id}" ${n ? '' : 'aria-disabled="true"'}>${esc(nomSistema(s.id))} <small>${n}</small></button>`; }).join('')}
      </div>
      <h3 class="bib-h">${esc(t('bib.porObjetivo'))}</h3>
      <div class="bib-chips">${TEMAS.map((x) => { const n = cuenta((L) => L.temas.includes(x.id)); return `
        <button class="bib-chip" data-filtro="tema" data-valor="${x.id}" ${n ? '' : 'aria-disabled="true"'}>${esc(nomTema(x.id))} <small>${n}</small></button>`; }).join('')}
      </div>
      <p class="bib-todas"><button class="link" data-todos="lecciones">${esc(t('bib.todasLecciones', { n: lecciones.length }))}</button></p>
    </section>

    ${favL.length || favR.length ? `
    <section class="bib-sec" aria-labelledby="bib-h-fav">
      <h3 id="bib-h-fav" class="bib-h">${esc(t('bib.guardadas'))}</h3>
      <div class="bib-grid">${favR.map((R) => tarjetaRecorrido(R, ctx.resumenRecorrido(R), true)).join('')}${favL.map((L) => tarjetaLeccion(L, estado(L), true, { compacta: true })).join('')}</div>
    </section>` : ''}

    <p class="bib-pie">${esc(t('bib.pie'))} <button class="link" type="button" data-datos>${esc(t('dat.enlace'))}</button></p>`;

  // ── Eventos ──
  const q = body.querySelector('#bib-q');
  const buscar = (texto) => {
    ctx.busqueda = { ...ctx.busqueda, texto, filtros: F.vacios(), orden: 'relevancia' };
    ctx.ir({ tipo: 'resultados' });
  };
  body.querySelector('.bib-buscar').addEventListener('submit', (e) => { e.preventDefault(); if (q.value.trim()) buscar(q.value.trim()); });
  // Al escribir se pasa a los resultados (que conservan el foco y la consulta).
  q.addEventListener('input', () => { if (q.value.trim().length >= 2) { ctx.busqueda.foco = true; buscar(q.value); } });
  body.querySelectorAll('[data-sug]').forEach((b) => b.addEventListener('click', () => buscar(b.dataset.sug)));
  // Los botones de «Mis lecciones» los enlaza enlazarPropias (esa sección se rehace sola).
  const fuera = (sel) => [...body.querySelectorAll(sel)].filter((b) => !b.closest('#bib-propias'));
  fuera('[data-neuri]').forEach((b) => b.addEventListener('click', () => ctx.neuri.abrir()));
  // Las seis acciones
  const ACCIONES = {
    seguir: () => (seguir ? abrirLeccion(ctx, seguir.id) : ctx.ir(RECORRIDO_POR_ID.has('primeros-pasos') ? { tipo: 'recorrido', id: 'primeros-pasos' } : { tipo: 'resultados' })),
    explorar: () => { ctx.busqueda = { texto: '', filtros: F.vacios(), orden: 'recomendado', solo: 'lecciones', filtrosAbiertos: true }; ctx.ir({ tipo: 'resultados' }); },
    dificultades: () => ctx.ir({ tipo: 'mapa' }),
    examen: () => ctx.ir({ tipo: 'examen' }),
    neuri: () => ctx.neuri.abrir(),
    propias: () => ctx.ir({ tipo: 'propias' }),
  };
  body.querySelectorAll('[data-acc]').forEach((b) => b.addEventListener('click', () => ACCIONES[b.dataset.acc]?.()));
  body.querySelector('[data-mapa]')?.addEventListener('click', () => ctx.ir({ tipo: 'mapa' }));
  body.querySelector('[data-datos]')?.addEventListener('click', () => ctx.ir({ tipo: 'datos' }));
  body.querySelector('[data-aplazar]')?.addEventListener('click', () => {
    const r = P.aplazar(data, P.vencidas(data, { ahora: Date.now() }), 1);
    ctx.guardar();
    ctx.toast(tn('bib.mapa.aplazadosN', r.n, { fecha: fecha(r.hasta) }));
    renderPortada(ctx);
  });
  body.querySelector('[data-retomar]')?.addEventListener('click', () => {
    const n = P.retomar(data);
    ctx.guardar();
    ctx.toast(tn('bib.mapa.retomados', n));
    renderPortada(ctx);
  });
  enlazarPreferencias(ctx, body.querySelector('.bib-prefs'));
  body.querySelectorAll('[data-filtro]').forEach((b) => b.addEventListener('click', () => {
    if (b.getAttribute('aria-disabled') === 'true') return ctx.toast(t('bib.sinLeccionesAun'));
    ctx.busqueda = { texto: '', filtros: { ...F.vacios(), [b.dataset.filtro]: b.dataset.valor }, orden: 'recomendado' };
    ctx.ir({ tipo: 'resultados' });
  }));
  fuera('[data-todos]').forEach((b) => b.addEventListener('click', () => {
    ctx.busqueda = { texto: '', filtros: F.vacios(), orden: 'recomendado', solo: b.dataset.todos };
    ctx.ir({ tipo: 'resultados' });
  }));
  body.querySelectorAll('[data-min]').forEach((b) => b.addEventListener('click', () => {
    ctx.busqueda.minutos = Number(b.dataset.min);
    body.querySelectorAll('[data-min]').forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-checked', String(x === b)); });
  }));
  // «Proponer una sesión»: una sesión guardada con el planificador de la app (sin IA), que se abre para empezarla.
  body.querySelector('[data-sesion]').addEventListener('click', () => proponerSesion(ctx, ctx.busqueda.minutos ?? minutosSesion));
  body.querySelector('[data-seguir-sesion]')?.addEventListener('click', () => seguirSesion(ctx, sesion.id));
  body.querySelector('[data-mis-sesiones]')?.addEventListener('click', () => ctx.ir({ tipo: 'sesiones' }));
  enlazarPropias(ctx, body.querySelector('#bib-propias'));
  // Cuando una creación avanza o termina (o cambia en otra pestaña), solo se rehace esta sección, sin mover el foco.
  ctx.repintarPropias = () => {
    const cont = ctx.vista.tipo === 'portada' && body.querySelector('#bib-propias');
    if (!cont) return;
    const activo = cont.contains(document.activeElement) ? document.activeElement : null;
    const clave = activo && [...activo.attributes].find((a) => a.name.startsWith('data-'));
    cont.innerHTML = htmlPropias(ctx);
    enlazarPropias(ctx, cont);
    enlazarTarjetas(ctx, cont);
    // Si el foco estaba en un botón de la sección, vuelve al mismo botón (o al título, si ese ya no está).
    if (activo) ((clave && cont.querySelector(`[${clave.name}="${CSS.escape(clave.value)}"]`)) || cont.querySelector('h3'))?.focus({ preventScroll: true });
  };
  body.querySelectorAll('[data-practica]').forEach((b) => b.addEventListener('click', () => empezarPractica(ctx, b.dataset.practica)));
  enlazarTarjetas(ctx, body);
  // (Solo si la portada sigue a la vista: si ya se fue a otra, no se le quita el foco.)
  requestAnimationFrame(() => { if (q.isConnected) (ctx.busqueda.foco ? q : body.closest('.panel')?.querySelector('h2'))?.focus({ preventScroll: true }); });
  ctx.busqueda.foco = false;
}

/**
 * «Mis lecciones» en la portada: lo que Neuri está preparando o no pudo terminar (preparacion.js) y las cuatro lecciones
 * propias más recientes, con el enlace a la vista para gestionarlas.
 */
function htmlPropias(ctx) {
  const prep = htmlPreparacion(ctx);
  const propias = ctx.catalogo.lecciones.filter((L) => L.propia);
  if (!propias.length && !prep) return '';
  const ahora = Date.now();
  return `
    <section class="bib-sec" aria-labelledby="bib-h-propias">
      <div class="bib-h-fila"><h3 id="bib-h-propias" class="bib-h" tabindex="-1">${esc(t('pet.misLecciones'))}</h3>
        <span class="bib-h-acc">${propias.length ? `<button class="link" data-mis-lecciones>${esc(t('pet.gestionar'))}</button>` : ''}<button class="link" data-neuri>${esc(t('pet.crearOtra'))}</button></span></div>
      ${prep}
      ${propias.length ? `<p class="bib-nota-propias">${esc(t('pet.misLeccionesNota'))}</p>
      <div class="bib-grid">${propias.slice(0, 4).map((L) => tarjetaLeccion(L, ctx.estado(L, { ahora }), ctx.data.favoritos.includes(L.id), { compacta: true })).join('')}</div>` : ''}
      ${propias.length > 4 ? `<p class="bib-todas"><button class="link" data-mis-lecciones>${esc(t('pet.verMisLecciones', { n: propias.length }))}</button></p>` : ''}
    </section>`;
}

function enlazarPropias(ctx, cont) {
  if (!cont) return;
  cont.querySelectorAll('[data-neuri]').forEach((b) => b.addEventListener('click', () => ctx.neuri.abrir()));
  cont.querySelectorAll('[data-mis-lecciones]').forEach((b) => b.addEventListener('click', () => ctx.ir({ tipo: 'propias' })));
  enlazarPreparacion(ctx, cont, () => { ctx.repintarPropias?.(); cont.querySelector('h3')?.focus({ preventScroll: true }); });
}

// ── Preferencias (opcionales): nivel, tiempo por sesión e intereses. Solo ordenan lo que se propone. ──
function htmlPreferencias(ctx) {
  const p = ctx.data.preferencias ?? { nivel: null, minutos: null, intereses: [] };
  const resumen = [p.nivel && nomNivel(p.nivel), p.minutos && t('bib.minutos', { n: p.minutos }), p.intereses.length && tn('bib.prefs.nIntereses', p.intereses.length)].filter(Boolean).join(' · ');
  const radio = (nombre, valor, actual, texto) => `<label class="bib-chip ${actual === valor ? 'on' : ''}"><input type="radio" name="${nombre}" value="${valor ?? ''}" ${actual === valor ? 'checked' : ''}/>${esc(texto)}</label>`;
  const casilla = (id, texto) => `<label class="bib-chip ${p.intereses.includes(id) ? 'on' : ''}"><input type="checkbox" name="interes" value="${id}" ${p.intereses.includes(id) ? 'checked' : ''}/>${esc(texto)}</label>`;
  return `<details class="bib-prefs" ${ctx.prefsAbiertas ? 'open' : ''}>
    <summary><span>${esc(t('bib.prefs.titulo'))}</span> <small>${esc(resumen || t('bib.prefs.opcional'))}</small></summary>
    <form class="bib-prefs-form">
      <fieldset><legend>${esc(t('bib.prefs.nivel'))}</legend><div class="bib-chips">
        ${radio('nivel', null, p.nivel, t('bib.prefs.sinPref'))}${NIVELES.map((n) => radio('nivel', n.id, p.nivel, nomNivel(n.id))).join('')}</div></fieldset>
      <fieldset><legend>${esc(t('bib.prefs.minutos'))}</legend><div class="bib-chips">
        ${radio('minutos', null, p.minutos, t('bib.prefs.sinPref'))}${P.MINUTOS_PREF.map((m) => radio('minutos', m, p.minutos, t('bib.minutos', { n: m }))).join('')}</div></fieldset>
      <fieldset><legend>${esc(t('bib.prefs.intereses'))}</legend><div class="bib-chips">
        ${REGIONES.map((r) => casilla(r.id, nomRegion(r.id))).join('')}${SISTEMAS.map((x) => casilla(x.id, nomSistema(x.id))).join('')}</div></fieldset>
      <p class="bib-prefs-nota">${esc(t('bib.prefs.nota'))} ${ctx.data.preferencias ? `<button class="link" type="button" data-prefs-borrar>${esc(t('bib.prefs.borrar'))}</button>` : ''}</p>
      <p class="sr-only" role="status" aria-live="polite" data-prefs-estado></p>
    </form>
  </details>`;
}

function enlazarPreferencias(ctx, det) {
  if (!det) return;
  det.addEventListener('toggle', () => { ctx.prefsAbiertas = det.open; });
  const form = det.querySelector('form');
  const estado = det.querySelector('[data-prefs-estado]');
  const leer = () => {
    const f = new FormData(form);
    const num = (v) => (v ? Number(v) : null);
    return P.limpiarPreferencias({ nivel: num(f.get('nivel')), minutos: num(f.get('minutos')), intereses: f.getAll('interes').map(String) });
  };
  form.addEventListener('change', (e) => {
    const p = leer();
    // Como mucho 8 intereses: el noveno no se marca.
    if (e.target.name === 'interes' && e.target.checked && (p?.intereses.length ?? 0) < form.querySelectorAll('input[name="interes"]:checked').length) e.target.checked = false;
    ctx.data.preferencias = leer();
    if (ctx.data.preferencias?.minutos) ctx.busqueda.minutos = ctx.data.preferencias.minutos;
    ctx.guardar();
    form.querySelectorAll('label.bib-chip').forEach((l) => l.classList.toggle('on', !!l.querySelector('input')?.checked));
    det.querySelector('summary small').textContent = resumenPrefs(ctx.data.preferencias) || t('bib.prefs.opcional');
    estado.textContent = t('bib.prefs.guardadas');
  });
  det.querySelector('[data-prefs-borrar]')?.addEventListener('click', () => {
    ctx.data.preferencias = null;
    ctx.guardar();
    ctx.prefsAbiertas = true;
    renderPortada(ctx);
    requestAnimationFrame(() => document.querySelector('.bib-prefs summary')?.focus());
  });
}

const resumenPrefs = (p) => (p ? [p.nivel && nomNivel(p.nivel), p.minutos && t('bib.minutos', { n: p.minutos }), p.intereses.length && tn('bib.prefs.nIntereses', p.intereses.length)].filter(Boolean).join(' · ') : '');
