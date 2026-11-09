// Portada de la biblioteca: buscador, continuar, repasos pendientes, sesión según el tiempo, prácticas, recorridos
// recomendados, explorar por región, sistema u objetivo y lo guardado.
import * as P from '../../biblioteca/progreso.js';
import * as F from '../../biblioteca/filtros.js';
import { REGIONES, SISTEMAS, TEMAS } from '../../biblioteca/taxonomia.js';
import { RECORRIDOS } from '../../biblioteca/recorridos.js';
import { itemsDePractica } from '../../biblioteca/sesion.js';
import { t, tn } from '../../i18n/idioma.js';
import { esc, icono, fecha, tarjetaLeccion, tarjetaRecorrido, nomRegion, nomSistema, nomTema } from './comun.js';
import { enlazarTarjetas, empezarPractica } from './explorar.js';
import { svgNeuri } from './neuri-svg.js';

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
  const recs = [...RECORRIDOS].sort((a, b) => {
    const ra = ctx.resumenRecorrido(a), rb = ctx.resumenRecorrido(b);
    const prog = (r) => (r.hechas > 0 && r.hechas < r.disponibles ? 0 : 1);
    return prog(ra) - prog(rb) || (b.id === 'primeros-pasos') - (a.id === 'primeros-pasos') || rb.disponibles - ra.disponibles;
  }).slice(0, 3);
  const favL = lecciones.filter((L) => data.favoritos.includes(L.id));
  const favR = RECORRIDOS.filter((R) => data.favoritos.includes(R.id));
  const cuenta = (pred) => lecciones.filter(pred).length;
  const minutosSesion = ctx.busqueda.minutos ?? 15;

  body.innerHTML = `
    <form class="bib-buscar" role="search">
      <label class="bib-buscar-titulo" for="bib-q">${esc(t('bib.queAprender'))}</label>
      <div class="bib-buscar-caja">${icono('search')}<input id="bib-q" type="search" autocomplete="off" spellcheck="false"
        placeholder="${esc(t('bib.buscarEjemplo'))}" value="${esc(ctx.busqueda.texto)}" aria-describedby="bib-sug" /></div>
      <p class="bib-sugerencias" id="bib-sug"><span>${esc(t('bib.prueba'))}</span>${t('bib.sugerencias').split('|').map((s) => `<button type="button" class="bib-chip" data-sug="${esc(s)}">${esc(s)}</button>`).join('')}</p>
      <button type="button" class="neuri-entrada" data-neuri>${svgNeuri()}<span>${esc(t('pet.portada'))}</span>${icono('chevron')}</button>
    </form>

    ${enCurso.length ? `
    <section class="bib-sec" aria-labelledby="bib-h-seguir">
      <h3 id="bib-h-seguir" class="bib-h">${esc(t('bib.continuar'))}</h3>
      <div class="bib-grid">${enCurso.slice(0, 2).map((L) => tarjetaLeccion(L, estado(L), data.favoritos.includes(L.id), { compacta: true })).join('')}</div>
    </section>` : ''}

    ${ctx.propias.length ? `
    <section class="bib-sec" aria-labelledby="bib-h-propias">
      <div class="bib-h-fila"><h3 id="bib-h-propias" class="bib-h">${esc(t('pet.misLecciones'))}</h3>
        <button class="link" data-neuri>${esc(t('pet.crearOtra'))}</button></div>
      <p class="bib-nota-propias">${esc(t('pet.misLeccionesNota'))}</p>
      <div class="bib-grid">${lecciones.filter((L) => L.propia).slice(0, 4).map((L) => tarjetaLeccion(L, estado(L), data.favoritos.includes(L.id), { compacta: true })).join('')}</div>
      ${ctx.propias.length > 4 ? `<p class="bib-todas"><button class="link" data-todos="propias">${esc(t('pet.verMisLecciones', { n: ctx.propias.length }))}</button></p>` : ''}
    </section>` : ''}

    <section class="bib-sec bib-hoy" aria-labelledby="bib-h-hoy">
      <h3 id="bib-h-hoy" class="bib-h">${esc(t('bib.hoy'))}</h3>
      <div class="bib-hoy-grid">
        <div class="bib-bloque">
          <p class="bib-bloque-t">${icono('repeat')}${esc(t('bib.repasos'))}</p>
          <p class="bib-bloque-d">${vencidas.length ? esc(tn('bib.repasosHoy', vencidas.length)) : esc(estudiadas ? (proximo ? t('bib.proximoRepaso', { fecha: fecha(proximo) }) : t('bib.alDia')) : t('bib.sinRepasos'))}</p>
          <button class="btn ${vencidas.length ? 'primary' : ''}" data-practica="vencidas" ${vencidas.length ? '' : 'disabled'}>${esc(t('bib.repasarAhora'))}${vencidas.length ? ` (${vencidas.length})` : ''}</button>
        </div>
        <div class="bib-bloque">
          <p class="bib-bloque-t">${icono('timer')}${esc(t('bib.sesionTiempo'))}</p>
          <div class="bib-minutos" role="radiogroup" aria-label="${esc(t('bib.cuantoTiempo'))}">
            ${MINUTOS.map((m) => `<button type="button" role="radio" aria-checked="${m === minutosSesion}" class="bib-chip ${m === minutosSesion ? 'on' : ''}" data-min="${m}">${esc(t('bib.minutos', { n: m }))}</button>`).join('')}
          </div>
          <button class="btn" data-sesion>${esc(t('bib.proponer'))}</button>
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

    <p class="bib-pie">${esc(t('bib.pie'))}</p>`;

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
  body.querySelectorAll('[data-neuri]').forEach((b) => b.addEventListener('click', () => ctx.neuri.abrir()));
  body.querySelectorAll('[data-filtro]').forEach((b) => b.addEventListener('click', () => {
    if (b.getAttribute('aria-disabled') === 'true') return ctx.toast(t('bib.sinLeccionesAun'));
    ctx.busqueda = { texto: '', filtros: { ...F.vacios(), [b.dataset.filtro]: b.dataset.valor }, orden: 'recomendado' };
    ctx.ir({ tipo: 'resultados' });
  }));
  body.querySelectorAll('[data-todos]').forEach((b) => b.addEventListener('click', () => {
    ctx.busqueda = { texto: '', filtros: F.vacios(), orden: 'recomendado', solo: b.dataset.todos };
    ctx.ir({ tipo: 'resultados' });
  }));
  body.querySelectorAll('[data-min]').forEach((b) => b.addEventListener('click', () => {
    ctx.busqueda.minutos = Number(b.dataset.min);
    body.querySelectorAll('[data-min]').forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-checked', String(x === b)); });
  }));
  body.querySelector('[data-sesion]').addEventListener('click', () => ctx.ir({ tipo: 'sesion', minutos: ctx.busqueda.minutos ?? 15 }));
  body.querySelectorAll('[data-practica]').forEach((b) => b.addEventListener('click', () => empezarPractica(ctx, b.dataset.practica)));
  enlazarTarjetas(ctx, body);
  requestAnimationFrame(() => (ctx.busqueda.foco ? q : body.closest('.panel')?.querySelector('h2'))?.focus({ preventScroll: true }));
  ctx.busqueda.foco = false;
}
