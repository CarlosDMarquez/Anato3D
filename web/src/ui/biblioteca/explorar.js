// Explorar la biblioteca: resultados de búsqueda con filtros y orden, recorridos, ficha de una lección y la sesión
// según el tiempo disponible. También las acciones comunes de las tarjetas y el arranque de las prácticas.
import * as P from '../../biblioteca/progreso.js';
import * as F from '../../biblioteca/filtros.js';
import { REGIONES, SISTEMAS, FORMATOS, TEMAS, NIVELES, DURACIONES, SUBREGION_POR_ID } from '../../biblioteca/taxonomia.js';
import { RECORRIDOS, RECORRIDO_POR_ID, MODULO_BIB_POR_ID } from '../../biblioteca/recorridos.js';
import { proponer, itemsDePractica, sinRepetirRecientes } from '../../biblioteca/sesion.js';
import { preguntaDeItem, evaluacionDe, instanciar, disponibleEn, barajar } from '../../biblioteca/evaluar.js';
import { t, tn, idioma } from '../../i18n/idioma.js';
import { botonReportar, enlazarReportar } from './reportar.js';
import { tr } from '../../i18n/contenido.js';
import { SYSTEM_BY_ID } from '../../systems.js';
import { etiqueta } from '../../i18n/idioma.js';
import {
  esc, icono, fecha, fechaDia, tarjetaLeccion, tarjetaRecorrido, barra, etiquetaEstado, chipsMeta, vacio, enEsteIdioma,
  nomRegion, nomSub, nomSistema, nomFormato, nomTema, nomNivel, nomLugar, nombreIdioma,
} from './comun.js';
import { svgNeuri } from './neuri-svg.js';

const atras = (texto) => `<button class="link back" data-atras>${icono('chevron')}<span>${esc(texto)}</span></button>`;

// ── Acciones comunes ──
export async function abrirLeccion(ctx, id, { paso = null } = {}) {
  const L = await ctx.cargarLeccion(id);
  if (!L) return ctx.toast(t('bib.noCarga'));
  const p = ctx.data.lecciones[id];
  const inicio = paso ?? (p && !p.completada ? Math.min(p.paso ?? 0, L.pasos.length - 1) : 0);
  ctx.ir({ tipo: 'leccion', id, paso: inicio });
}

export function enlazarTarjetas(ctx, root) {
  root.querySelectorAll('[data-leccion]').forEach((card) => {
    const id = card.dataset.leccion;
    card.querySelector('[data-ir="info"]')?.addEventListener('click', () => ctx.ir({ tipo: 'info', id }));
    card.querySelector('[data-ir="leccion"]')?.addEventListener('click', () => abrirLeccion(ctx, id));
    card.querySelector('[data-fav]')?.addEventListener('click', (e) => alternarFav(ctx, id, e.currentTarget));
  });
  root.querySelectorAll('[data-recorrido]').forEach((card) => {
    const id = card.dataset.recorrido;
    card.querySelectorAll('[data-ir="recorrido"]').forEach((b) => b.addEventListener('click', () => ctx.ir({ tipo: 'recorrido', id })));
    card.querySelector('[data-fav]')?.addEventListener('click', (e) => alternarFav(ctx, id, e.currentTarget));
  });
  root.querySelectorAll('[data-atras]').forEach((b) => b.addEventListener('click', () => ctx.volver()));
}

function alternarFav(ctx, id, boton) {
  const on = P.alternarFavorito(ctx.data, id);
  ctx.guardar();
  boton.classList.toggle('on', on);
  boton.setAttribute('aria-pressed', String(on));
  boton.setAttribute('aria-label', t(on ? 'bib.quitarGuardada' : 'bib.guardar'));
  ctx.toast(t(on ? 'bib.guardada' : 'bib.noGuardada'));
}

/**
 * Prácticas: 'vencidas' (lo que toca repasar), 'errores', 'identificar' (identificación 3D sin etiquetas de lo
 * estudiado), 'lecciones' (repaso de unas lecciones concretas: una región, un sistema o una búsqueda) e 'items' (unas
 * preguntas concretas: las dificultades del mapa de aprendizaje).
 */
export async function empezarPractica(ctx, tipo, { lecciones = null, titulo = null, items: elegidos = null } = {}) {
  const modelo = ctx.api.modelo();
  let preguntas = [];
  let esperan = 0;
  if (tipo === 'identificar') {
    const ids = (lecciones ?? Object.keys(ctx.data.lecciones)).filter((id) => ctx.porId.has(id));
    const Ls = (await Promise.all(ids.map((id) => ctx.cargarLeccion(id)))).filter(Boolean);
    preguntas = barajar(Ls.flatMap((L) => L.preguntas.filter((q) => (q.tipo === 'identificar' || q.tipo === 'localizar') && disponibleEn(L, q, modelo)).map((q) => instanciar(L, q))), Math.random).slice(0, 10);
  } else {
    // 'items': unas preguntas concretas (las dificultades del mapa de aprendizaje).
    const items = tipo === 'items' ? (elegidos ?? []).slice(0, 12) : itemsDePractica(ctx.data, tipo === 'lecciones' ? 'region' : tipo, { lecciones, max: 12 });
    const ids = [...new Set(items.map((id) => id.slice(0, id.indexOf('/'))))];
    await Promise.all(ids.map((id) => ctx.cargarLeccion(id)));
    // Lo que se acaba de fallar no se repite tal cual: otra pregunta de lo mismo o, si no hay, más tarde.
    const r = sinRepetirRecientes(items, { data: ctx.data, lecciones: ctx.lecciones, modelo });
    esperan = r.esperan;
    preguntas = r.items.map((id) => preguntaDeItem(ctx.lecciones, id, { modelo })).filter(Boolean);
  }
  if (!preguntas.length) return ctx.toast(t(tipo === 'identificar' ? 'bib.nadaQueIdentificar' : esperan ? 'bib.esperanRecientes' : 'bib.nadaQueRepasar'), esperan ? 6000 : undefined);
  ctx.ir({ tipo: 'preguntas', modo: ['vencidas', 'errores', 'lecciones', 'items'].includes(tipo) ? 'repaso' : 'practica', titulo: titulo ?? t(`bib.practica.${tipo}`), preguntas, i: 0, respuestas: [], vuelta: ctx.vista });
}

/** Evaluación de una lección (cubre todos sus objetivos). */
export async function evaluarLeccion(ctx, id) {
  const L = await ctx.cargarLeccion(id);
  const preguntas = evaluacionDe(L, { modelo: ctx.api.modelo() });
  if (!preguntas.length) return ctx.toast(t('bib.nadaQueRepasar'));
  ctx.ir({ tipo: 'preguntas', modo: 'evaluacion', leccion: id, titulo: tr(L.titulo), preguntas, i: 0, respuestas: [], vuelta: ctx.vista });
}

// ── Resultados de búsqueda y filtros ──
export async function renderResultados(ctx) {
  const { body, busqueda: b, catalogo } = ctx;
  if (b.texto.trim()) await ctx.cargarEstructuras().catch(() => {});
  const r = b.texto.trim() ? ctx.buscador.buscar(b.texto) : null;
  const ctxF = { estado: (L) => ctx.estado(L), favorita: (id) => ctx.data.favoritos.includes(id), terminada: ctx.terminada };
  const base = r ? r.lecciones : b.solo === 'propias' ? catalogo.lecciones.filter((L) => L.propia) : catalogo.lecciones;
  const lecciones = F.ordenar(F.filtrar(base, b.filtros, ctxF), b.orden === 'relevancia' && !r ? 'recomendado' : b.orden, ctxF);
  const recorridos = b.solo === 'lecciones' || b.solo === 'propias' ? [] : r ? r.recorridos : b.solo === 'recorridos' ? RECORRIDOS : [];
  const estructuras = r ? r.estructuras.slice(0, 8) : [];
  const verLecciones = b.solo !== 'recorridos';
  const activos = F.activos(b.filtros, t, nombreIdioma);
  const ampliar = !lecciones.length && activos.length ? F.ampliar(base, b.filtros, ctxF, t, nombreIdioma) : [];
  const entendido = r ? [
    ...r.lugares.map((l) => nomLugar([l.region, l.sub])),
    ...r.materias.map((m) => (m.sistema ? nomSistema(m.sistema) : nomTema(m.tema))),
  ] : [];
  const nombreLecciones = (ids) => ids.filter((id) => ctx.porId.has(id)).map((id) => `<button class="link" data-info="${esc(id)}">${esc(tr(ctx.porId.get(id).titulo))}</button>`).join(', ');

  body.innerHTML = `
    ${atras(t('bib.biblioteca'))}
    <form class="bib-buscar bib-buscar-res" role="search">
      <div class="bib-buscar-caja">${icono('search')}<input id="bib-q" type="search" autocomplete="off" spellcheck="false" aria-label="${esc(t('bib.queAprender'))}"
        placeholder="${esc(t('bib.buscarEjemplo'))}" value="${esc(b.texto)}" /></div>
    </form>
    <div class="bib-barra-filtros">
      <button class="btn" data-abrir-filtros aria-expanded="${!!b.filtrosAbiertos}" aria-controls="bib-filtros">${icono('filter')}${esc(t('bib.filtros'))}${activos.length ? ` (${activos.length})` : ''}</button>
      <label class="bib-orden">${icono('sort')}<span class="sr-only">${esc(t('bib.ordenar'))}</span>
        <select id="bib-orden" aria-label="${esc(t('bib.ordenar'))}">${F.ORDENES.map((o) => `<option value="${o}" ${o === b.orden ? 'selected' : ''}>${esc(t(`orden.${o}`))}</option>`).join('')}</select>
      </label>
    </div>
    ${b.filtrosAbiertos ? panelFiltros(b.filtros, base) : ''}
    ${activos.length ? `<p class="bib-activos" aria-label="${esc(t('bib.filtrosActivos'))}">${activos.map((a) => `<button class="bib-chip on" data-quitar="${a.clave}" aria-label="${esc(t('bib.quitarFiltro', { f: a.nombre }))}">${esc(etiqueta(a.nombre))} ${icono('close')}</button>`).join('')}
      <button class="link" data-quitar-todos>${esc(t('bib.quitarTodos'))}</button></p>` : ''}
    ${r?.correcciones.length ? `<p class="bib-nota">${esc(t('bib.corregido', { de: r.correcciones.map(([a]) => a).join(', '), a: r.correcciones.map(([, x]) => x).join(', ') }))}</p>` : ''}
    ${entendido.length ? `<p class="bib-nota">${esc(t('bib.entendido'))} <b>${esc(entendido.join(' · '))}</b>${r.relajado ? ` — ${esc(t('bib.relajado'))}` : ''}</p>` : ''}
    ${(r?.avisos ?? []).map((a) => `<p class="bib-nota bib-aviso">${esc(t(a.clave))} <button class="link" data-region-entera="${a.region}">${esc(t('bib.verRegion', { r: nomRegion(a.region) }))}</button></p>`).join('')}
    ${r?.intencion && lecciones.length ? `<p class="bib-intencion"><button class="btn primary" data-intencion="${r.intencion}">${icono(r.intencion === 'repasar' ? 'repeat' : 'target')}${esc(t(r.intencion === 'repasar' ? 'bib.repasarEsto' : 'bib.practicarEsto', { n: lecciones.length }))}</button></p>` : ''}
    <p class="bib-cuenta" aria-live="polite">${esc([verLecciones && tn('bib.nLecciones', lecciones.length), recorridos.length && tn('bib.nRecorridos', recorridos.length), estructuras.length && tn('bib.nEstructuras', estructuras.length)].filter(Boolean).join(' · ') || t('bib.sinResultados'))}</p>
    ${recorridos.length ? `<h3 class="bib-h">${esc(t('bib.recorridos'))}</h3><div class="bib-grid">${recorridos.map((R) => tarjetaRecorrido(R, ctx.resumenRecorrido(R), ctx.data.favoritos.includes(R.id))).join('')}</div>` : ''}
    ${verLecciones && lecciones.length ? `<h3 class="bib-h">${esc(t('bib.lecciones'))}</h3><div class="bib-grid">${lecciones.map((L) => tarjetaLeccion(L, ctx.estado(L), ctx.data.favoritos.includes(L.id))).join('')}</div>` : ''}
    ${verLecciones && !lecciones.length ? `<div class="bib-sin">
      <p>${esc(t(r ? 'bib.sinLeccionesBusqueda' : 'bib.sinLeccionesFiltros'))}</p>
      ${ampliar.length ? `<p>${esc(t('bib.ampliar'))}</p><p class="bib-chips">${ampliar.map((a) => `<button class="bib-chip" data-quitar="${a.clave}">${esc(t('bib.sinFiltro', { f: etiqueta(a.nombre), n: a.n }))}</button>`).join('')}</p>` : ''}
      ${r ? `<div class="neuri-sin">${svgNeuri()}<p>${esc(t('pet.sinResultados'))}</p><button class="btn primary" type="button" data-neuri-q>${icono('sparkles')}<span>${esc(t('pet.preguntar'))}</span></button></div>` : ''}
      ${r ? `<p class="bib-sugerencias"><span>${esc(t('bib.prueba'))}</span>${t('bib.sugerencias').split('|').map((s) => `<button type="button" class="bib-chip" data-sug="${esc(s)}">${esc(s)}</button>`).join('')}</p>` : ''}
    </div>` : ''}
    ${estructuras.length ? `<h3 class="bib-h">${esc(t('bib.estructuras'))}</h3><ul class="bib-estructuras">${estructuras.map((e) => {
      const donde = catalogo.piezas[e.clave];
      return `<li><div><b>${esc(e.nombre)}</b> <small>${esc(etiqueta(SYSTEM_BY_ID[e.sistema]?.label ?? ''))}</small>
        <p>${donde ? `${esc(t('bib.seEstudiaEn'))} ${nombreLecciones([...(donde.n ?? []), ...(donde.c ?? [])])}` : esc(t('bib.noSeEstudia'))}</p></div>
        <button class="btn" data-ver="${esc(e.clave)}">${icono('show')}${esc(t('bib.verModelo'))}</button></li>`;
    }).join('')}</ul>` : ''}`;

  const q = body.querySelector('#bib-q');
  let espera;
  const nueva = (texto) => { ctx.busqueda = { ...ctx.busqueda, texto, foco: true }; ctx.ir({ tipo: 'resultados' }, { reemplazar: true }); };
  q.addEventListener('input', () => { clearTimeout(espera); espera = setTimeout(() => nueva(q.value), 180); });
  body.querySelector('.bib-buscar').addEventListener('submit', (e) => { e.preventDefault(); clearTimeout(espera); nueva(q.value); });
  if (b.foco) { q.focus(); q.setSelectionRange(q.value.length, q.value.length); b.foco = false; }
  else requestAnimationFrame(() => body.closest('.panel')?.querySelector('h2')?.focus({ preventScroll: true }));
  body.querySelector('[data-abrir-filtros]').addEventListener('click', () => { b.filtrosAbiertos = !b.filtrosAbiertos; renderResultados(ctx); });
  body.querySelector('#bib-orden').addEventListener('change', (e) => { b.orden = e.target.value; renderResultados(ctx); });
  body.querySelectorAll('[data-quitar]').forEach((x) => x.addEventListener('click', () => { b.filtros = F.quitar(b.filtros, x.dataset.quitar); renderResultados(ctx); }));
  body.querySelector('[data-quitar-todos]')?.addEventListener('click', () => { b.filtros = F.vacios(); renderResultados(ctx); });
  body.querySelectorAll('[data-sug]').forEach((x) => x.addEventListener('click', () => nueva(x.dataset.sug)));
  body.querySelector('[data-neuri-q]')?.addEventListener('click', () => ctx.neuri.abrir(b.texto));
  if (r && verLecciones && !lecciones.length) ctx.neuri.sinResultados();
  // Estadísticas (si se activaron): una búsqueda sin resultados, sin su texto (solo qué filtros había). Se anota si la
  // búsqueda se queda así un momento (no cada letra mientras se escribe).
  clearTimeout(ctx.esperaSinResultados);
  if (verLecciones && !lecciones.length && (r || activos.length)) {
    let h = 5381;
    for (const c of `${b.texto}|${activos.map((a) => a.clave).join()}`) h = ((h * 33) ^ c.charCodeAt(0)) >>> 0;
    ctx.esperaSinResultados = setTimeout(() => {
      if (ctx.vista.tipo === 'resultados') ctx.evento?.('busqueda_sin_resultados', { filtros: activos.map((a) => a.clave), conTexto: !!r }, { clave: h.toString(36) });
    }, 2000);
  }
  body.querySelectorAll('[data-region-entera]').forEach((x) => x.addEventListener('click', () => {
    ctx.busqueda = { texto: '', filtros: { ...F.vacios(), region: x.dataset.regionEntera, sistema: r?.materias.find((m) => m.sistema)?.sistema ?? null }, orden: 'recomendado' };
    ctx.ir({ tipo: 'resultados' }, { reemplazar: true });
  }));
  body.querySelector('[data-intencion]')?.addEventListener('click', (e) => {
    const ids = lecciones.map((L) => L.id);
    empezarPractica(ctx, e.currentTarget.dataset.intencion === 'repasar' ? 'lecciones' : 'identificar', { lecciones: ids, titulo: b.texto });
  });
  body.querySelectorAll('[data-info]').forEach((x) => x.addEventListener('click', () => ctx.ir({ tipo: 'info', id: x.dataset.info })));
  body.querySelectorAll('[data-ver]').forEach((x) => x.addEventListener('click', () => ctx.api.verEstructura(x.dataset.ver)));
  enlazarFiltros(ctx, body);
  enlazarTarjetas(ctx, body);
}

// Panel de filtros: un desplegable por filtro (los cambios se aplican al momento).
function panelFiltros(f, base) {
  // Solo los filtros que dan algo en estas lecciones (o el que ya está puesto, para poder quitarlo).
  const presentes = (clave) => F.valoresPresentes(base, clave);
  const ofrecer = (clave, minimo = 2) => f[clave] != null || presentes(clave).length >= minimo;
  const sel = (clave, opciones, valor) => `
    <label class="bib-filtro"><span>${esc(t(`filtro.${clave}`))}</span>
      <select data-filtro="${clave}"><option value="">${esc(t('filtro.todos'))}</option>
        ${opciones.map(([v, n]) => `<option value="${esc(v)}" ${String(v) === String(valor ?? '') ? 'selected' : ''}>${esc(n)}</option>`).join('')}
      </select></label>`;
  const subs = f.region ? REGIONES.find((r) => r.id === f.region).sub : REGIONES.flatMap((r) => r.sub);
  return `<div class="bib-filtros" id="bib-filtros" role="group" aria-label="${esc(t('bib.filtros'))}">
    ${sel('region', REGIONES.map((r) => [r.id, nomRegion(r.id)]), f.region)}
    ${sel('subregion', subs.map((s) => [s.id, f.region ? nomSub(s.id) : `${nomRegion(SUBREGION_POR_ID.get(s.id).region)} › ${nomSub(s.id)}`]), f.subregion)}
    ${sel('sistema', SISTEMAS.map((s) => [s.id, nomSistema(s.id)]), f.sistema)}
    ${sel('formato', FORMATOS.map((x) => [x.id, nomFormato(x.id)]), f.formato)}
    ${ofrecer('estructura') ? sel('estructura', F.GRUPOS_ESTRUCTURA.filter((g) => presentes('estructura').includes(g.id) || f.estructura === g.id).map((g) => [g.id, t(`filtro.grupo.${g.id}`)]), f.estructura) : ''}
    ${sel('tema', TEMAS.map((x) => [x.id, nomTema(x.id)]), f.tema)}
    ${sel('nivel', NIVELES.map((n) => [n.id, nomNivel(n.id)]), f.nivel)}
    ${sel('duracion', DURACIONES.map((d) => [d.id, etiqueta(d.nombre)]), f.duracion)}
    ${ofrecer('idioma') ? sel('idioma', [...new Set([...presentes('idioma'), ...(f.idioma ? [f.idioma] : [])])].map((i) => [i, nombreIdioma(i)]), f.idioma) : ''}
    ${ofrecer('procedencia') ? sel('procedencia', F.PROCEDENCIAS.map((p) => [p, t(`filtro.proc.${p}`)]), f.procedencia) : ''}
    ${sel('progreso', F.PROGRESOS.map((p) => [p, t(`progreso.${p}`)]), f.progreso)}
    <label class="bib-check"><input type="checkbox" data-filtro="repaso" ${f.repaso ? 'checked' : ''}/> ${esc(t('filtro.conRepaso'))}</label>
    <label class="bib-check"><input type="checkbox" data-filtro="favoritas" ${f.favoritas ? 'checked' : ''}/> ${esc(t('filtro.favoritas'))}</label>
    <button class="btn primary bib-filtros-listo" data-cerrar-filtros>${esc(t('bib.verResultados'))}</button>
  </div>`;
}

function enlazarFiltros(ctx, body) {
  const b = ctx.busqueda;
  body.querySelectorAll('.bib-filtros [data-filtro]').forEach((el) => el.addEventListener('change', () => {
    const k = el.dataset.filtro;
    const v = el.type === 'checkbox' ? (el.checked || null) : (el.value || null);
    b.filtros = { ...b.filtros, [k]: k === 'nivel' && v ? Number(v) : v };
    if (k === 'region' && b.filtros.subregion && SUBREGION_POR_ID.get(b.filtros.subregion)?.region !== v) b.filtros.subregion = null;
    if (k === 'subregion' && v) b.filtros.region = SUBREGION_POR_ID.get(v).region;
    renderResultados(ctx).then(() => body.querySelector(`.bib-filtros [data-filtro="${k}"]`)?.focus());
  }));
  body.querySelector('[data-cerrar-filtros]')?.addEventListener('click', () => { b.filtrosAbiertos = false; renderResultados(ctx).then(() => body.querySelector('.bib-cuenta')?.focus?.()); });
}

// ── Recorrido ──
export function renderRecorrido(ctx) {
  const { body, vista } = ctx;
  const R = RECORRIDO_POR_ID.get(vista.id);
  const r = ctx.resumenRecorrido(R);
  const alcance = ctx.catalogo.recorridos?.[R.id]?.alcance;
  const vistos = new Set();
  const siguiente = R.modulos.flatMap((m) => MODULO_BIB_POR_ID.get(m).lecciones).find((id) => ctx.porId.has(id) && !ctx.terminada(id));
  const fav = ctx.data.favoritos.includes(R.id);
  body.innerHTML = `
    ${atras(t('bib.volver'))}
    <p class="bib-sobre">${icono('route')}${esc(t('bib.recorrido'))}</p>
    <h3 class="bib-tit" tabindex="-1">${esc(t(`rec.${R.id}.titulo`))}</h3>
    <p class="bib-resumen">${esc(t(`rec.${R.id}.descripcion`))}</p>
    <dl class="mod-stats">
      <dt>${esc(t('bib.requisitos'))}</dt><dd>${esc(t(`rec.${R.id}.requisitos`))}</dd>
      <dt>${esc(t('bib.nivel'))}</dt><dd>${esc(nomNivel(R.nivel))}</dd>
      <dt>${esc(t('bib.duracion'))}</dt><dd>${esc(t('bib.minutosDisp', { n: r.minutos }))}</dd>
      <dt>${esc(t('bib.avanceRec'))}</dt><dd>${barra(r.hechas, r.disponibles, t('bib.recAvance', { a: r.hechas, b: r.disponibles }))} ${esc(t('bib.recAvance', { a: r.hechas, b: r.disponibles }))}</dd>
      ${r.disponibles < r.total ? `<dt>${esc(t('bib.disponibles'))}</dt><dd>${esc(t('bib.leccionesDe', { a: r.disponibles, b: r.total }))} <small>${esc(t('bib.faltanRec'))}</small></dd>` : ''}
      ${alcance ? `<dt>${esc(t('bib.alcance'))}</dt><dd>${esc(t('bib.alcanceValor', { a: alcance.cubiertas, b: alcance.total }))}${alcance.cubiertas < alcance.total ? ` <small>${esc(t('bib.alcanceParcial'))}</small>` : ''}</dd>` : ''}
    </dl>
    <div class="bib-acciones">
      ${siguiente ? `<button class="btn primary" data-seguir="${siguiente}">${esc(t(r.hechas ? 'bib.seguirRec' : 'bib.empezarRec'))}</button>` : ''}
      <button class="btn" data-fav aria-pressed="${fav}">${icono('star')}${esc(t(fav ? 'bib.quitarGuardada' : 'bib.guardar'))}</button>
    </div>
    ${R.modulos.map((mid, k) => {
      const M = MODULO_BIB_POR_ID.get(mid);
      return `<section class="bib-modulo"><h4>${esc(t('bib.modulo', { n: k + 1 }))} · ${esc(t(`modb.${mid}`))}</h4><ol class="bib-lista">${M.lecciones.map((id) => {
        const L = ctx.porId.get(id);
        const repe = vistos.has(id);
        vistos.add(id);
        if (!L) return `<li class="bib-no"><span>${esc(t('bib.pendienteRedactar'))}</span></li>`;
        const e = ctx.estado(L);
        return `<li><button class="bib-fila" data-info="${esc(id)}"><span class="bib-fila-t">${esc(tr(L.titulo))}${repe ? ` <small>${esc(t('bib.yaEnRec'))}</small>` : ''}</span>
          <span class="bib-fila-m">${esc(t('bib.minutos', { n: L.minutos }))}${enEsteIdioma(L) ? '' : ` · ${esc(t('bib.soloEspanol'))}`}</span>${etiquetaEstado(e)}</button></li>`;
      }).join('')}</ol></section>`;
    }).join('')}`;
  body.querySelector('[data-atras]').addEventListener('click', () => ctx.volver());
  body.querySelector('[data-seguir]')?.addEventListener('click', (e) => abrirLeccion(ctx, e.currentTarget.dataset.seguir));
  body.querySelector('[data-fav]').addEventListener('click', (e) => { alternarFav(ctx, R.id, e.currentTarget); renderRecorrido(ctx); });
  body.querySelectorAll('[data-info]').forEach((x) => x.addEventListener('click', () => ctx.ir({ tipo: 'info', id: x.dataset.info })));
  requestAnimationFrame(() => body.querySelector('.bib-tit')?.focus());
}

// ── Ficha de una lección ──
export function renderInfo(ctx) {
  const { body, vista } = ctx;
  const L = ctx.porId.get(vista.id);
  if (!L) return ctx.volver();
  const e = ctx.estado(L);
  const fav = ctx.data.favoritos.includes(L.id);
  const enlaces = (ids) => ids.filter((id) => ctx.porId.has(id)).map((id) => `<button class="link" data-info="${esc(id)}">${esc(tr(ctx.porId.get(id).titulo))}</button>`).join(', ');
  const nucleo = L.estructuras.filter((x) => x.papel === 'nucleo');
  const recs = ctx.recorridosDe(L.id);
  const accion = e.estado === 'en-curso' ? 'bib.seguir' : e.estado === 'sin-empezar' ? 'bib.empezar' : 'bib.repetir';
  const soloUno = L.modelos.length === 1 ? L.modelos[0] : null;
  body.innerHTML = `
    ${atras(t('bib.volver'))}
    <p class="bib-sobre">${icono('book')}${esc(nomFormato(L.formato))}</p>
    <h3 class="bib-tit" tabindex="-1">${esc(tr(L.titulo))}</h3>
    <p class="bib-resumen">${esc(tr(L.resumen))}</p>
    ${chipsMeta(L)}
    ${e.cambiada ? `<p class="mod-note">${esc(t('bib.cambiada'))}</p>` : ''}
    ${soloUno ? `<p class="bib-nota">${esc(t(`bib.soloModelo.${soloUno}`))}</p>` : ''}
    ${L.propia ? `<p class="bib-nota bib-nota-propia">${icono('sparkles')}<span>${esc(t(L.origen?.modo === 'adaptar' && L.origen?.base ? 'pet.propiaAdaptada' : 'pet.propiaCreada', { fecha: fechaDia(L.origen?.fecha), base: L.origen?.base && ctx.porId.get(L.origen.base) ? tr(ctx.porId.get(L.origen.base).titulo) : '' }))}</span></p>` : ''}
    <div class="bib-acciones">
      <button class="btn primary" data-accion="leccion">${esc(t(accion))}</button>
      <button class="btn" data-accion="evaluar">${esc(t('bib.evaluarme'))}</button>
      <button class="btn" data-accion="repasar" ${e.pendientes ? '' : 'disabled'}>${esc(t('bib.repasar'))}${e.pendientes ? ` (${e.pendientes})` : ''}</button>
      <button class="btn" data-fav aria-pressed="${fav}">${icono('star')}${esc(t(fav ? 'bib.quitarGuardada' : 'bib.guardar'))}</button>
      <button class="btn" data-accion="adaptar">${icono('sparkles')}${esc(t('pet.adaptarCon'))}</button>
    </div>
    <h4>${esc(t('bib.tuProgreso'))}</h4>
    <dl class="mod-stats">
      <dt>${esc(t('bib.avance'))}</dt><dd>${esc(t('bib.pasosDe', { a: e.vistos, b: e.total }))}</dd>
      <dt>${esc(t('bib.finalizacion'))}</dt><dd>${esc(e.completada ? t('bib.terminadaEl', { fecha: fecha(e.completada) }) : t('bib.sinTerminar'))}</dd>
      <dt>${esc(t('bib.ultimaEval'))}</dt><dd>${e.ultima ? `${esc(t('estudio.aDeB', { a: e.ultima.aciertos, b: e.ultima.total }))} <small>${esc(fecha(e.ultima.fecha))}</small>` : esc(t('estudio.ninguna'))}</dd>
      <dt>${esc(t('bib.demostrado'))}</dt><dd>${esc(t(e.demostrada ? 'bib.si' : 'bib.todaviaNo'))} <small>${esc(t('bib.demostradoNota'))}</small></dd>
      <dt>${esc(t('bib.dominio'))}</dt><dd>${esc(t('bib.dominioValor', { a: e.dominio.en, b: e.dominio.de }))} <small>${esc(t('bib.dominioNota'))}</small></dd>
      <dt>${esc(t('estudio.repaso'))}</dt><dd>${esc(e.pendientes ? tn('estudio.pendientes', e.pendientes) : t('bib.alDia'))}</dd>
    </dl>
    <details class="mod-goals" open><summary>${esc(t('estudio.objetivos'))}</summary><ul>${L.objetivos.map((o) => `<li>${esc(tr(o))}</li>`).join('')}</ul></details>
    <details class="mod-goals"><summary>${esc(t('bib.queEstudias', { n: nucleo.length }))}</summary><ul class="bib-cols">${nucleo.map((x) => `<li>${esc(tr(x.nombre))}</li>`).join('')}</ul></details>
    <dl class="mod-stats">
      ${L.requisitos.length ? `<dt>${esc(t('bib.antesDe'))}</dt><dd>${enlaces(L.requisitos)}</dd>` : ''}
      ${L.siguiente.length ? `<dt>${esc(t('bib.despues'))}</dt><dd>${enlaces(L.siguiente)}</dd>` : ''}
      ${recs.length ? `<dt>${esc(t('bib.enRecorridos'))}</dt><dd>${recs.map((R) => `<button class="link" data-rec="${R.id}">${esc(t(`rec.${R.id}.titulo`))}</button>`).join(', ')}</dd>` : ''}
      <dt>${esc(t('bib.revision'))}</dt><dd>${esc(t(`bib.estado.${L.estado}`))}</dd>
    </dl>
    <p class="mod-foot">${esc(t('estudio.progresoLocal'))}
      <button class="link" data-accion="reiniciar">${esc(t('bib.reiniciar'))}</button> ·
      <button class="link" data-accion="borrar">${esc(t('bib.borrar'))}</button>${L.propia ? ` · <button class="link" data-accion="quitar">${esc(t('pet.quitarPropia'))}</button>` : ''}</p>
    <p class="bib-rep-fila">${botonReportar()}</p>
    ${L.propia ? `<div class="mod-confirm mod-confirm-propia" hidden>
      <p>${esc(t('pet.quitarPregunta'))}</p>
      <button class="btn danger" data-accion="quitar-si">${esc(t('pet.quitarSi'))}</button> <button class="btn" data-accion="quitar-no">${esc(t('estudio.cancelar'))}</button>
    </div>` : ''}
    <div class="mod-confirm" hidden>
      <p>${esc(t('bib.borrarPregunta'))}</p>
      <button class="btn danger" data-accion="borrar-si">${esc(t('estudio.borrarSi'))}</button> <button class="btn" data-accion="borrar-no">${esc(t('estudio.cancelar'))}</button>
    </div>`;
  body.querySelector('[data-atras]').addEventListener('click', () => ctx.volver());
  body.querySelectorAll('[data-info]').forEach((x) => x.addEventListener('click', () => ctx.ir({ tipo: 'info', id: x.dataset.info })));
  body.querySelectorAll('[data-rec]').forEach((x) => x.addEventListener('click', () => ctx.ir({ tipo: 'recorrido', id: x.dataset.rec })));
  enlazarReportar(body, () => ({ vista: 'ficha', leccion: L.id, version: L.version, idioma: idioma(), modelo: ctx.api.modelo() }), { alEnviar: ctx.alReportar });
  body.querySelector('[data-fav]').addEventListener('click', (ev) => { alternarFav(ctx, L.id, ev.currentTarget); renderInfo(ctx); });
  body.querySelectorAll('[data-accion]').forEach((x) => x.addEventListener('click', async () => {
    const a = x.dataset.accion;
    if (a === 'leccion') return abrirLeccion(ctx, L.id);
    if (a === 'evaluar') return evaluarLeccion(ctx, L.id);
    if (a === 'repasar') return empezarPractica(ctx, 'lecciones', { lecciones: [L.id], titulo: tr(L.titulo) });
    if (a === 'reiniciar') {
      const Lc = await ctx.cargarLeccion(L.id);
      P.reiniciar(ctx.data, Lc);
      ctx.guardar();
      ctx.toast(t('estudio.reiniciada'));
      return renderInfo(ctx);
    }
    if (a === 'adaptar') return ctx.neuri.abrir(null, { borrador: t('pet.adaptarBorrador', { titulo: tr(L.titulo) }) });
    if (a === 'quitar') { body.querySelector('.mod-confirm-propia').hidden = false; body.querySelector('.mod-confirm-propia .danger').focus(); return; }
    if (a === 'quitar-no') { body.querySelector('.mod-confirm-propia').hidden = true; return; }
    if (a === 'quitar-si') { ctx.borrarPropia(L.id); ctx.toast(t('pet.quitada')); ctx.pila = ctx.pila.filter((v) => v.id !== L.id); return ctx.volver(); }
    if (a === 'borrar') { body.querySelector('.mod-confirm').hidden = false; body.querySelector('.mod-confirm .danger').focus(); }
    if (a === 'borrar-no') body.querySelector('.mod-confirm').hidden = true;
    if (a === 'borrar-si') { P.borrarLeccion(ctx.data, L.id); ctx.guardar(); ctx.toast(t('estudio.borrado')); renderInfo(ctx); }
  }));
  requestAnimationFrame(() => body.querySelector('.bib-tit')?.focus());
}

// ── Sesión según el tiempo disponible ──
export function renderSesion(ctx) {
  const { body, vista } = ctx;
  vista.bloques ??= proponer({ minutos: vista.minutos, catalogo: ctx.catalogo.lecciones, data: ctx.data, modelo: ctx.api.modelo() });
  const total = vista.bloques.reduce((n, b) => n + b.minutos, 0);
  body.innerHTML = `
    ${atras(t('bib.biblioteca'))}
    <h3 class="bib-tit" tabindex="-1">${esc(t('bib.tuSesion', { n: vista.minutos }))}</h3>
    <p class="bib-resumen">${esc(t('bib.sesionExplica'))}</p>
    <div class="bib-minutos" role="radiogroup" aria-label="${esc(t('bib.cuantoTiempo'))}">
      ${[10, 15, 20, 30, 45].map((m) => `<button type="button" role="radio" aria-checked="${m === vista.minutos}" class="bib-chip ${m === vista.minutos ? 'on' : ''}" data-min="${m}">${esc(t('bib.minutos', { n: m }))}</button>`).join('')}
    </div>
    ${vista.bloques.length ? `<ol class="bib-lista bib-sesion">${vista.bloques.map((bq, i) => {
      const L = bq.id && ctx.porId.get(bq.id);
      const texto = bq.tipo === 'repaso' ? tn('bib.bloqueRepaso', bq.preguntas) : `${t(bq.motivo === 'seguir' ? 'bib.bloqueSeguir' : 'bib.bloqueNueva')}: ${tr(L.titulo)}`;
      return `<li><span class="bib-fila-t">${icono(bq.tipo === 'repaso' ? 'repeat' : 'book')}${esc(texto)}</span><span class="bib-fila-m">${esc(t('bib.minutos', { n: bq.minutos }))}</span>
        <button class="icon-btn" data-quitar-bloque="${i}" aria-label="${esc(t('bib.quitarBloque'))}">${icono('close')}</button></li>`;
    }).join('')}</ol>
    <p class="bib-cuenta">${esc(t('bib.totalSesion', { n: total, m: vista.minutos }))}</p>
    <div class="bib-acciones"><button class="btn primary" data-empezar-sesion>${esc(t('bib.empezarSesion'))}</button></div>`
    : vacio(t('bib.sesionVacia'))}`;
  body.querySelector('[data-atras]').addEventListener('click', () => ctx.volver());
  body.querySelectorAll('[data-min]').forEach((b) => b.addEventListener('click', () => {
    ctx.busqueda.minutos = Number(b.dataset.min);
    ctx.ir({ tipo: 'sesion', minutos: Number(b.dataset.min) }, { reemplazar: true });
  }));
  body.querySelectorAll('[data-quitar-bloque]').forEach((b) => b.addEventListener('click', () => { vista.bloques.splice(Number(b.dataset.quitarBloque), 1); renderSesion(ctx); }));
  body.querySelector('[data-empezar-sesion]')?.addEventListener('click', () => {
    ctx.sesionActiva = { bloques: [...vista.bloques], i: 0 };
    seguirSesion(ctx);
  });
  requestAnimationFrame(() => body.querySelector('.bib-tit')?.focus());
}

/** Abre el bloque actual de la sesión en curso (o la cierra si no quedan). */
export function seguirSesion(ctx) {
  const s = ctx.sesionActiva;
  const bq = s?.bloques[s.i];
  if (!bq) { ctx.sesionActiva = null; ctx.toast(t('bib.sesionTerminada')); return ctx.ir({ tipo: 'portada' }); }
  if (bq.tipo === 'repaso') return empezarPractica(ctx, 'vencidas');
  return abrirLeccion(ctx, bq.id);
}

/** Pasa al siguiente bloque de la sesión, si hay una en curso. Devuelve el texto del botón o null. */
export function siguienteDeSesion(ctx) {
  const s = ctx.sesionActiva;
  if (!s) return null;
  const bq = s.bloques[s.i + 1];
  return bq ? (bq.tipo === 'repaso' ? t('bib.sesionRepaso') : t('bib.sesionSiguiente', { titulo: tr(ctx.porId.get(bq.id)?.titulo ?? '') })) : t('bib.sesionFin');
}
export function avanzarSesion(ctx) {
  ctx.sesionActiva.i++;
  seguirSesion(ctx);
}
