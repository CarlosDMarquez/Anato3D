// «Preparar un examen» (vista `examen`): escribir o pegar el temario con la fecha y el tiempo disponible, revisar lo que
// la app ha entendido (y las lagunas), y el plan por días, que se rehace solo con el progreso. La lógica está en
// src/biblioteca/examen.js. Sin notificaciones: el plan está aquí.
import { t, tn, idioma } from '../../i18n/idioma.js';
import { tr } from '../../i18n/contenido.js';
import { esc, icono } from './comun.js';
import { abrirLeccion, empezarPractica } from './explorar.js';
import { interpretar, planificar, isoDe, instanteDe, diasEntre, MINUTOS_DIA, hoyEnPlan } from '../../biblioteca/examen.js';

const DIAS_SEMANA = [1, 2, 3, 4, 5, 6, 0];
const MAX_TEMARIO = 4000;
// «martes, 10 de noviembre»: con mayúscula solo al principio cuando va sola (no «10 De Noviembre»).
const fechaLarga = (iso) => new Date(instanteDe(iso)).toLocaleDateString(idioma(), { weekday: 'long', day: 'numeric', month: 'long' });
const conMayuscula = (s) => s.charAt(0).toLocaleUpperCase(idioma()) + s.slice(1);
const nombreDia = (d) => new Date(2026, 10, 8 + d).toLocaleDateString(idioma(), { weekday: 'short' });

export function renderExamen(ctx) {
  const v = ctx.vista;
  const ex = ctx.data.examen;
  v.paso ??= ex ? 'plan' : 'temario';
  if (v.paso === 'temario') return pasoTemario(ctx);
  if (v.paso === 'revisar') return pasoRevisar(ctx);
  return pasoPlan(ctx);
}

const cabecera = (titulo) => `<button class="link back" type="button" data-atras>${icono('chevron')}<span>${esc(t('bib.biblioteca'))}</span></button>
  <h3 id="ex-h" class="mis-h" tabindex="-1">${esc(titulo)}</h3>`;
const enfocar = (body, sel = '#ex-h') => requestAnimationFrame(() => { if (body.querySelector('#ex-h')) body.querySelector(sel)?.focus({ preventScroll: sel === '#ex-h' }); });

// ── 1. El temario, la fecha y el tiempo ──
function pasoTemario(ctx) {
  const { body } = ctx;
  const b = ctx.vista.borrador ?? ctx.data.examen ?? {};
  const hoy = isoDe(Date.now());
  const dias = b.dias ?? [1, 2, 3, 4, 5];
  body.innerHTML = `<section class="examen" aria-labelledby="ex-h">
    ${cabecera(t('ex.titulo'))}
    <p class="bib-nota-propias">${esc(t('ex.intro'))}</p>
    <form class="ex-form" novalidate>
      <label for="ex-temario">${esc(t('ex.temario'))}</label>
      <textarea id="ex-temario" rows="8" maxlength="${MAX_TEMARIO}" placeholder="${esc(t('ex.temarioEjemplo'))}" aria-describedby="ex-temario-n">${esc(b.temario ?? '')}</textarea>
      <p class="mis-origen" id="ex-temario-n">${esc(t('ex.temarioNota'))}</p>
      <div class="ex-fila">
        <label class="ex-campo"><span>${esc(t('ex.fecha'))}</span><input id="ex-fecha" type="date" min="${hoy}" value="${esc(b.fecha ?? '')}" aria-describedby="ex-fecha-n" /></label>
        <label class="ex-campo"><span>${esc(t('ex.minutos'))}</span><select id="ex-min">${MINUTOS_DIA.map((m) => `<option value="${m}" ${m === (b.minutosDia ?? 30) ? 'selected' : ''}>${esc(t('bib.minutos', { n: m }))}</option>`).join('')}</select></label>
      </div>
      <p class="mis-origen" id="ex-fecha-n">${esc(t('ex.fechaNota'))}</p>
      <fieldset class="ex-dias"><legend>${esc(t('ex.dias'))}</legend><div class="bib-chips">
        ${DIAS_SEMANA.map((d) => `<label class="bib-chip ${dias.includes(d) ? 'on' : ''}"><input type="checkbox" value="${d}" ${dias.includes(d) ? 'checked' : ''}/>${esc(nombreDia(d))}</label>`).join('')}
      </div></fieldset>
      <p class="mis-error" role="alert" hidden></p>
      <div class="bib-acciones"><button class="btn primary" type="submit">${esc(t('ex.interpretar'))}</button>
        ${ctx.data.examen ? `<button class="btn" type="button" data-volver-plan>${esc(t('estudio.cancelar'))}</button>` : ''}</div>
    </form>
  </section>`;
  body.querySelector('[data-atras]').addEventListener('click', () => ctx.volver());
  body.querySelector('[data-volver-plan]')?.addEventListener('click', () => { ctx.vista.paso = 'plan'; renderExamen(ctx); });
  body.querySelectorAll('.ex-dias input').forEach((c) => c.addEventListener('change', () => c.closest('label').classList.toggle('on', c.checked)));
  body.querySelector('.ex-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const temario = body.querySelector('#ex-temario').value.slice(0, MAX_TEMARIO);
    const err = body.querySelector('.mis-error');
    const temas = interpretar(temario, { buscador: ctx.buscador });
    const fecha = body.querySelector('#ex-fecha').value || null;
    const diasSel = [...body.querySelectorAll('.ex-dias input:checked')].map((c) => Number(c.value));
    const fallo = !temas.length ? 'ex.faltaTemario' : !diasSel.length ? 'ex.faltanDias' : fecha && diasEntre(hoy, fecha) < 0 ? 'ex.fechaPasada' : null;
    if (fallo) { err.textContent = t(fallo); err.hidden = false; body.querySelector(fallo === 'ex.faltanDias' ? '.ex-dias input' : fallo === 'ex.fechaPasada' ? '#ex-fecha' : '#ex-temario').focus(); return; }
    ctx.vista.borrador = { temario, fecha, minutosDia: Number(body.querySelector('#ex-min').value), dias: diasSel, temas: temas.map((x) => ({ ...x, elegidas: x.lecciones.slice(0, 1) })) };
    ctx.vista.paso = 'revisar';
    renderExamen(ctx);
  });
  enfocar(body, ctx.data.examen ? '#ex-h' : '#ex-temario');
}

// ── 2. Lo que la app ha entendido: cada tema con sus lecciones (o la laguna) ──
function pasoRevisar(ctx) {
  const { body } = ctx;
  const b = ctx.vista.borrador;
  const lagunas = b.temas.filter((x) => x.laguna);
  body.innerHTML = `<section class="examen" aria-labelledby="ex-h">
    ${cabecera(t('ex.revisarTitulo'))}
    <p class="bib-nota-propias">${esc(t('ex.revisarNota'))}</p>
    <p class="ex-resumen">${esc(b.fecha ? t('ex.examenEl', { fecha: fechaLarga(b.fecha) }) : t('ex.sinFecha'))} · ${esc(t('ex.resumenTiempo', { m: b.minutosDia, dias: b.dias.map(nombreDia).join(', ') }))}</p>
    <ol class="ex-temas">${b.temas.map((x, i) => `<li class="${x.laguna ? 'laguna' : ''}">
      <p class="ex-tema-t">${esc(x.texto)}</p>
      ${x.laguna ? `<p class="ex-tema-l">${esc(t('ex.laguna'))} <button class="link" type="button" data-pedir="${i}">${esc(t('ex.pedirNeuri'))}</button></p>`
        : `<ul class="ex-lecs">${x.lecciones.map((id) => { const L = ctx.porId.get(id); return L ? `<li><label><input type="checkbox" data-tema="${i}" value="${esc(id)}" ${x.elegidas.includes(id) ? 'checked' : ''}/> ${esc(tr(L.titulo))} <small>${esc(t('bib.minutos', { n: L.minutos }))}</small></label></li>` : ''; }).join('')}</ul>`}
    </li>`).join('')}</ol>
    ${lagunas.length ? `<p class="mis-origen">${esc(tn('ex.lagunasNota', lagunas.length))}</p>` : ''}
    <div class="bib-acciones"><button class="btn primary" type="button" data-crear>${esc(t('ex.crearPlan'))}</button>
      <button class="btn" type="button" data-corregir>${esc(t('ex.corregir'))}</button></div>
  </section>`;
  body.querySelector('[data-atras]').addEventListener('click', () => ctx.volver());
  body.querySelector('[data-corregir]').addEventListener('click', () => { ctx.vista.paso = 'temario'; renderExamen(ctx); });
  body.querySelectorAll('[data-tema]').forEach((c) => c.addEventListener('change', () => {
    const tema = b.temas[Number(c.dataset.tema)];
    tema.elegidas = c.checked ? [...new Set([...tema.elegidas, c.value])] : tema.elegidas.filter((x) => x !== c.value);
  }));
  body.querySelectorAll('[data-pedir]').forEach((x) => x.addEventListener('click', () => ctx.neuri.abrir(null, { borrador: t('ex.borradorNeuri', { tema: b.temas[Number(x.dataset.pedir)].texto }) })));
  body.querySelector('[data-crear]').addEventListener('click', () => {
    const ahora = Date.now();
    ctx.data.examen = { temario: b.temario, fecha: b.fecha, minutosDia: b.minutosDia, dias: b.dias, temas: b.temas.map(({ texto, lecciones, elegidas, laguna }) => ({ texto, lecciones, elegidas, laguna })), creado: ctx.data.examen?.creado ?? ahora, actualizado: ahora };
    ctx.guardar();
    ctx.vista.borrador = null;
    ctx.vista.paso = 'plan';
    renderExamen(ctx);
  });
  enfocar(body);
}

// ── 3. El plan por días ──
function pasoPlan(ctx) {
  const { body } = ctx;
  const ex = ctx.data.examen;
  const hoy = isoDe(Date.now());
  const plan = planificar({ temas: ex.temas.map((x) => ({ texto: x.texto, lecciones: x.elegidas })), fecha: ex.fecha, minutosDia: ex.minutosDia, dias: ex.dias, hoy, catalogo: ctx.porId, estado: (L) => ctx.estado(L) });
  const deHoy = hoyEnPlan(plan, hoy);
  const verTodo = !!ctx.vista.todo;
  const dias = verTodo ? plan.dias : plan.dias.slice(0, 7);
  const hecha = (id) => ['completada', 'demostrada', 'dominada'].includes(ctx.estado(ctx.porId.get(id)).estado);
  const titulo = (id) => tr(ctx.porId.get(id)?.titulo ?? id);
  const lagunas = ex.temas.filter((x) => x.laguna);
  const faltan = ex.fecha ? diasEntre(hoy, ex.fecha) : null;
  const bloque = (b) => {
    if (b.tipo === 'leccion') return `<li class="${hecha(b.id) ? 'hecho' : ''}">${hecha(b.id) ? icono('check') : icono('book')}<span>${esc(titulo(b.id))}${b.parte ? ` <small>(${esc(t('ex.parte'))})</small>` : ''}</span><small>${esc(t('bib.minutos', { n: b.minutos }))}</small></li>`;
    if (b.tipo === 'repaso') return `<li>${icono('repeat')}<span>${esc(t('ex.repasoDe', { lista: b.de.map(titulo).join(', ') }))}</span><small>${esc(t('bib.minutos', { n: b.minutos }))}</small></li>`;
    return `<li>${icono('target')}<span>${esc(t('ex.final'))}</span><small>${esc(t('bib.minutos', { n: b.minutos }))}</small></li>`;
  };
  body.innerHTML = `<section class="examen" aria-labelledby="ex-h">
    ${cabecera(t('ex.planTitulo'))}
    <p class="ex-resumen">${esc(ex.fecha ? (faltan > 0 ? tn('ex.faltan', faltan, { fecha: fechaLarga(ex.fecha) }) : faltan === 0 ? t('ex.esHoy') : t('ex.yaPaso')) : t('ex.sinFechaPlan', { fecha: fechaLarga(plan.fin) }))}</p>
    ${plan.avisos.includes('no-cabe') ? `<div class="mis-aviso" role="note">${icono('info')}<div><p>${esc(t('ex.noCabe', { necesarios: plan.necesarios, disponibles: plan.disponibles }))}</p>
      <p>${esc(t('ex.prioridad'))}</p><p><b>${esc(t('ex.quedanFuera'))}</b> ${esc(plan.noCaben.map(titulo).join(', '))}</p></div></div>` : ''}
    ${plan.avisos.includes('sin-repaso-final') ? `<p class="mis-origen">${esc(t('ex.sinRepasoFinal'))}</p>` : ''}
    ${plan.avisos.includes('sin-lecciones') ? `<p class="bib-vacio">${esc(t('ex.sinLecciones'))}</p>` : ''}
    ${ex.fecha && faltan < 0 ? `<p class="bib-vacio">${esc(t('ex.planPasado'))}</p>` : ''}
    ${deHoy ? `<div class="ex-hoy"><p class="ex-hoy-t">${esc(deHoy.fecha === hoy ? t('ex.hoy') : t('ex.proximo', { fecha: fechaLarga(deHoy.fecha) }))}</p>
      <ul class="ex-bloques">${deHoy.bloques.map(bloque).join('')}</ul>
      ${deHoy.fecha === hoy ? `<button class="btn primary" type="button" data-empezar>${esc(t('ex.empezarHoy'))}</button>` : ''}</div>` : ''}
    ${plan.hechas.length ? `<p class="mis-origen">${esc(tn('ex.yaHechas', plan.hechas.length))}</p>` : ''}
    <h4 class="bib-h">${esc(t('ex.dias2'))}</h4>
    <ol class="ex-dias-lista">${dias.filter((d) => d !== deHoy).map((d) => `<li><p class="ex-dia-t">${esc(conMayuscula(fechaLarga(d.fecha)))}</p><ul class="ex-bloques">${d.bloques.map(bloque).join('')}</ul></li>`).join('')}</ol>
    ${!verTodo && plan.dias.length > 7 ? `<p><button class="link" type="button" data-todo>${esc(tn('ex.verTodos', plan.dias.length))}</button></p>` : ''}
    ${lagunas.length ? `<h4 class="bib-h">${esc(t('ex.lagunas'))}</h4><ul class="ex-lagunas">${ex.temas.map((x, i) => (x.laguna ? `<li>${esc(x.texto)} <button class="link" type="button" data-pedir="${i}">${esc(t('ex.pedirNeuri'))}</button></li>` : '')).join('')}</ul>` : ''}
    <div class="bib-acciones"><button class="btn" type="button" data-ajustar>${esc(t('ex.ajustar'))}</button>
      <button class="link" type="button" data-borrar>${esc(t('ex.borrar'))}</button></div>
    <div class="mod-confirm ex-confirmar" hidden><p>${esc(t('ex.borrarPregunta'))}</p>
      <button class="btn danger" type="button" data-borrar-si>${esc(t('ex.borrarSi'))}</button> <button class="btn" type="button" data-borrar-no>${esc(t('estudio.cancelar'))}</button></div>
    <p class="mod-foot">${esc(t('ex.notaFinal'))}</p>
  </section>`;
  body.querySelector('[data-atras]').addEventListener('click', () => ctx.volver());
  body.querySelector('[data-todo]')?.addEventListener('click', () => { ctx.vista.todo = true; renderExamen(ctx); });
  body.querySelector('[data-ajustar]').addEventListener('click', () => { ctx.vista.borrador = null; ctx.vista.paso = 'temario'; renderExamen(ctx); });
  body.querySelectorAll('[data-pedir]').forEach((x) => x.addEventListener('click', () => ctx.neuri.abrir(null, { borrador: t('ex.borradorNeuri', { tema: ex.temas[Number(x.dataset.pedir)].texto }) })));
  const conf = body.querySelector('.ex-confirmar');
  body.querySelector('[data-borrar]').addEventListener('click', () => { conf.hidden = false; conf.querySelector('.danger').focus(); });
  body.querySelector('[data-borrar-no]').addEventListener('click', () => { conf.hidden = true; body.querySelector('[data-borrar]').focus(); });
  body.querySelector('[data-borrar-si]').addEventListener('click', () => { ctx.data.examen = null; ctx.guardar(); ctx.toast(t('ex.borrado')); ctx.vista.paso = 'temario'; renderExamen(ctx); });
  body.querySelector('[data-empezar]')?.addEventListener('click', () => {
    // Lo primero sin hacer de hoy: una lección, o el repaso de las lecciones que tocan.
    const b = deHoy.bloques.find((x) => (x.tipo === 'leccion' ? !hecha(x.id) : true));
    if (!b) return ctx.toast(t('ex.hoyHecho'));
    if (b.tipo === 'leccion') return abrirLeccion(ctx, b.id);
    return empezarPractica(ctx, 'lecciones', { lecciones: b.de, titulo: t(b.tipo === 'final' ? 'ex.final' : 'ex.repaso') });
  });
  enfocar(body);
}
