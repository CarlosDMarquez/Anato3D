// «Mis sesiones» (vista `sesiones`): las sesiones de estudio con Neuri guardadas en este navegador (src/pet/sesiones.js).
// Primero las que están en curso (para seguirlas donde se dejaron), después las terminadas con su resultado. Cada una se
// puede abrir, repetir (otra sesión con el mismo plan) o quitar, con confirmación; quitarla no borra el progreso de lo
// estudiado en ella, que sigue en la biblioteca.
import { t, tn } from '../../i18n/idioma.js';
import { esc, icono, fecha } from './comun.js';
import { tituloSesion, minutosSesion, textoOrigen, vistaSesion, seguirSesion, repetirSesion } from './sesion-neuri.js';

const ABIERTAS = ['activa', 'pausada', 'planificada'];

export function renderMisSesiones(ctx, { foco = null, aviso = null } = {}) {
  const { body } = ctx;
  const lista = ctx.sesiones.lista;
  const reciente = (a, b) => (b.actualizada ?? 0) - (a.actualizada ?? 0);
  const abiertas = lista.filter((S) => ABIERTAS.includes(S.estado)).sort((a, b) => (b.estado === 'activa') - (a.estado === 'activa') || reciente(a, b));
  const terminadas = lista.filter((S) => S.estado === 'finalizada').sort(reciente);
  const apartadas = ctx.sesiones.apartados().length;

  const item = (S) => {
    const r = ctx.sesiones.resumen(S.id);
    const fin = S.estado === 'finalizada';
    const titulo = tituloSesion(S);
    const estado = fin
      ? [t('ses.estado.finalizada'), r.preguntas ? t('ses.res.aciertos', { a: r.aciertos, n: r.preguntas }) : '', r.conAyuda ? tn('ses.res.conAyuda', r.conAyuda) : '', t('ses.bloquesHechos', { a: r.hechos, b: r.total })]
      : [t(`ses.estado.${S.estado}`), t('ses.bloqueDe', { a: Math.min(S.i + 1, S.bloques.length), b: S.bloques.length })];
    return `<li class="mis-ses ${esc(S.estado)}" data-ses="${esc(S.id)}">
      <div class="mis-ses-cab">
        <p class="mis-ses-t">${icono('timer')}<b>${esc(titulo)}</b></p>
        <p class="mis-ses-meta">${esc([...estado.filter(Boolean), t('bib.minutos', { n: minutosSesion(S) }), textoOrigen(S), fecha(S.actualizada ?? S.creada)].join(' · '))}</p>
      </div>
      <div class="mis-item-acc" role="group" aria-label="${esc(t('pet.misAccionesDe', { titulo }))}">
        ${fin ? '' : `<button class="btn primary" type="button" data-ses-seguir>${icono('play')}<span>${esc(t(S.estado === 'planificada' && !S.resultados.length ? 'ses.empezar' : 'ses.continuar'))}</span></button>`}
        <button class="link" type="button" data-ses-ver>${icono('show')}<span>${esc(t(fin ? 'ses.verResumen' : 'ses.verPlan'))}</span></button>
        ${fin ? `<button class="link" type="button" data-ses-repetir>${icono('restart')}<span>${esc(t('ses.repetir'))}</span></button>` : ''}
        <button class="link mis-quitar" type="button" data-ses-quitar>${icono('trash')}<span>${esc(t('ses.quitar'))}</span></button>
      </div>
      <div class="mod-confirm mis-confirmar" hidden>
        <p>${esc(t('ses.quitarPregunta', { titulo }))}</p>
        <button class="btn danger" type="button" data-ses-quitar-si>${esc(t('ses.quitarSi'))}</button>
        <button class="btn" type="button" data-ses-quitar-no>${esc(t('estudio.cancelar'))}</button>
      </div>
    </li>`;
  };

  body.innerHTML = `
    <section class="mis mis-sesiones-v" aria-labelledby="ses-mis-h">
      <button class="link back" type="button" data-atras>${icono('chevron')}<span>${esc(t('bib.volver'))}</span></button>
      <div class="mis-cab">
        <h3 id="ses-mis-h" class="bib-h mis-h" tabindex="-1">${esc(t('ses.mis'))}</h3>
        <p class="mis-uso">${esc(t('ses.misUso', { n: lista.length, max: 20 }))}</p>
      </div>
      <p class="bib-nota-propias">${esc(t('ses.misNota'))}</p>
      <div class="mis-acciones">
        <button class="btn" type="button" data-neuri>${icono('sparkles')}<span>${esc(t('ses.pedirNeuri'))}</span></button>
      </div>
      <p class="mis-resultado" role="status" aria-live="polite">${aviso ? esc(aviso) : ''}</p>
      ${apartadas ? `<p class="mis-aviso" role="note">${icono('archive')}<span>${esc(tn('ses.apartadas', apartadas))}</span></p>` : ''}
      ${abiertas.length ? `<h4 class="bib-h">${esc(t('ses.enCurso'))}</h4><ul class="mis-lista mis-sesiones">${abiertas.map(item).join('')}</ul>` : ''}
      ${terminadas.length ? `<h4 class="bib-h">${esc(t('ses.terminadas'))}</h4><ul class="mis-lista mis-sesiones">${terminadas.map(item).join('')}</ul>` : ''}
      ${lista.length ? '' : `<p class="bib-vacio">${esc(t('ses.misVacio'))}</p>`}
    </section>`;

  const repintar = (opciones) => renderMisSesiones(ctx, opciones);
  body.querySelector('[data-atras]').addEventListener('click', () => ctx.volver());
  body.querySelector('[data-neuri]').addEventListener('click', () => ctx.neuri.abrir(null, { borrador: t('ses.borradorPedir') }));
  body.querySelectorAll('.mis-ses').forEach((li) => {
    const id = li.dataset.ses;
    const conf = li.querySelector('.mis-confirmar');
    li.querySelector('[data-ses-seguir]')?.addEventListener('click', () => seguirSesion(ctx, id));
    li.querySelector('[data-ses-ver]').addEventListener('click', () => ctx.ir(vistaSesion(id)));
    li.querySelector('[data-ses-repetir]')?.addEventListener('click', () => repetirSesion(ctx, id));
    li.querySelector('[data-ses-quitar]').addEventListener('click', () => { conf.hidden = false; conf.querySelector('.danger').focus(); });
    conf.querySelector('[data-ses-quitar-no]').addEventListener('click', () => { conf.hidden = true; li.querySelector('[data-ses-quitar]').focus(); });
    conf.querySelector('[data-ses-quitar-si]').addEventListener('click', () => {
      const ok = ctx.sesiones.quitar(id);
      repintar({ foco: '#ses-mis-h', aviso: t(ok ? 'ses.quitada' : 'pet.error.generico') });
    });
  });
  requestAnimationFrame(() => { if (body.querySelector('#ses-mis-h')) (foco && body.querySelector(foco) || body.querySelector('#ses-mis-h'))?.focus({ preventScroll: !foco }); });
}
