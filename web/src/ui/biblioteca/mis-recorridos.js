// «Mis recorridos» (dentro de «Mis lecciones»): los recorridos personales que Neuri dividió en unidades
// (src/pet/recorridos.js), con el estado real de cada unidad. Desde aquí se abre una unidad lista, se crea la siguiente,
// se sigue en la conversación o se quita el recorrido. Quitarlo no borra sus lecciones: siguen en «Mis lecciones»,
// salvo que la persona elija, aparte y tras leer el aviso, quitarlas también.
import { t, tn } from '../../i18n/idioma.js';
import { esc, icono, descargarArchivo, hoyISO } from './comun.js';
import { abrirLeccion } from './explorar.js';
import { MAX_PROPIAS } from '../../biblioteca/propias.js';

/** La sección entera (vacía si no hay recorridos ni nada apartado). */
export function htmlMisRecorridos(ctx) {
  const rec = ctx.neuri.recorridos;
  const apartados = rec.apartados().length;
  if (!rec.lista.length && !apartados) return '';
  return `<section class="mis-recs-sec" aria-labelledby="mis-rec-h">
    <h4 id="mis-rec-h" class="bib-h mis-rec-h" tabindex="-1">${esc(t('pet.rec.mis'))}</h4>
    <p class="bib-nota-propias">${esc(t('pet.rec.misNota'))}</p>
    ${apartados ? `<div class="mis-aviso" role="note">${icono('archive')}<div><p>${esc(tn('pet.rec.apartados', apartados))}</p>
      <p class="mis-apartadas-acc"><button class="link" type="button" data-rec-bajar-apartados>${esc(t('pet.descargarApartadas'))}</button>
      <button class="link" type="button" data-rec-descartar-apartados>${esc(t('pet.descartarApartadas'))}</button></p>
      <div class="mod-confirm mis-confirmar-rec-apartados" hidden><p>${esc(t('pet.rec.descartarApartados'))}</p>
        <button class="btn danger" type="button" data-rec-descartar-si>${esc(t('pet.descartarSi'))}</button>
        <button class="btn" type="button" data-rec-descartar-no>${esc(t('estudio.cancelar'))}</button></div></div></div>` : ''}
    ${rec.lista.length ? `<ul class="mis-recs">${rec.lista.map((R) => item(ctx, R)).join('')}</ul>` : ''}
  </section>`;
}

function item(ctx, R) {
  const rec = ctx.neuri.recorridos;
  const est = rec.estadoRecorrido(R);
  const res = rec.resumen(R);
  const puede = ctx.neuri.puedeCrear();
  const meta = R.unidades.length
    ? [t('pet.rec.avance', { listas: res.listas, total: res.total }), t('pet.rec.minTotal', { n: res.minutos }), est === 'planificando' ? t('pet.rec.cambiando') : '']
    : [est === 'planificando' ? t('pet.rec.planificando') : est === 'interrumpido' ? t('pet.rec.interrumpido') : ctx.neuri.textoError(est === 'limitacion' || est === 'aclaracion' ? est : R.error)];
  const unidades = R.unidades.map((u, k) => {
    const e = res.estados[k];
    const L = e.leccion && ctx.porId.get(e.leccion);
    const ic = e.estado === 'lista' ? icono('check') : e.estado === 'preparando' ? '<i class="neuri-giro" aria-hidden="true"></i>' : ['error', 'interrumpida', 'sin-guardar'].includes(e.estado) ? icono('info') : '<i class="neuri-unidad-vacio" aria-hidden="true"></i>';
    return `<li class="mis-rec-u ${esc(e.estado)}">
      <span class="neuri-unidad-n" aria-hidden="true">${k + 1}</span>
      <span class="mis-rec-u-txt"><b><span class="sr-only">${esc(t('pet.rec.unidadN', { n: k + 1 }))}: </span>${esc(u.titulo)}</b>
        <small>${ic}<span>${esc(ctx.neuri.textoUnidad(R, u, e))}</span></small></span>
      ${L ? `<button class="link" type="button" data-rec-abrir="${esc(L.id)}" aria-label="${esc(t('pet.rec.abrirDe', { titulo: u.titulo }))}">${esc(t('pet.rec.abrir'))}</button>` : ''}
    </li>`;
  }).join('');
  const listas = res.listas;
  const crear = puede && est !== 'planificando' && res.siguiente && !res.preparando && !R.cola;
  return `<li class="mis-rec" data-rec="${esc(R.id)}">
    <div class="mis-rec-cab"><p class="mis-rec-t">${icono('route')}<b>${esc(R.titulo)}</b></p>
      <p class="mis-rec-meta">${esc(meta.filter(Boolean).join(' · '))}</p></div>
    ${R.aviso?.codigo === 'lleno' ? `<p class="mis-rec-aviso">${esc(t('pet.rec.lleno', { max: MAX_PROPIAS }))}</p>` : ''}
    ${unidades ? `<ol class="mis-rec-unidades" aria-label="${esc(t('pet.rec.unidades'))}">${unidades}</ol>` : ''}
    <div class="mis-item-acc" role="group" aria-label="${esc(t('pet.misAccionesDe', { titulo: R.titulo }))}">
      <button class="link" type="button" data-rec-ver="${esc(R.id)}">${icono('sparkles')}<span>${esc(t('pet.rec.seguir'))}</span></button>
      ${crear ? `<button class="link" type="button" data-rec-siguiente-m="${esc(R.id)}">${icono('sparkles')}<span>${esc(t('pet.rec.crearSiguiente', { n: res.nSiguiente }))}</span></button>` : ''}
      <button class="link mis-quitar" type="button" data-rec-quitar="${esc(R.id)}">${icono('trash')}<span>${esc(t('pet.rec.quitar'))}</span></button>
    </div>
    <div class="mod-confirm mis-confirmar mis-confirmar-rec" hidden>
      <p>${esc(t('pet.rec.quitarPregunta', { titulo: R.titulo }))}${res.preparando ? ` ${esc(t('pet.rec.quitarPreparando'))}` : ''}</p>
      ${listas ? `<p class="mis-confirmar-nota">${esc(t('pet.rec.quitarConAviso'))}</p>` : ''}
      <button class="btn" type="button" data-rec-quitar-solo>${esc(t('pet.rec.quitarSolo'))}</button>
      ${listas ? `<button class="btn danger" type="button" data-rec-quitar-todo>${esc(tn('pet.rec.quitarConLecciones', listas))}</button>` : ''}
      <button class="btn" type="button" data-rec-quitar-no>${esc(t('estudio.cancelar'))}</button>
    </div>
  </li>`;
}

/**
 * Enlaza los botones de la sección. `repintar({ foco, aviso })`: vuelve a pintar la vista de «Mis lecciones» (tras
 * quitar un recorrido cambian las lecciones); `decir(texto)`: anuncia un resultado.
 */
export function enlazarMisRecorridos(ctx, cont, { repintar, decir }) {
  if (!cont) return;
  const rec = ctx.neuri.recorridos;
  cont.querySelector('[data-rec-bajar-apartados]')?.addEventListener('click', () => {
    if (!descargarArchivo(`recorridos-apartados-anato3d-${hoyISO()}.json`, JSON.stringify(rec.apartados(), null, 2))) decir(t('pet.error.generico'));
  });
  const confAp = cont.querySelector('.mis-confirmar-rec-apartados');
  cont.querySelector('[data-rec-descartar-apartados]')?.addEventListener('click', () => { confAp.hidden = false; confAp.querySelector('.danger').focus(); });
  cont.querySelector('[data-rec-descartar-no]')?.addEventListener('click', () => { confAp.hidden = true; cont.querySelector('[data-rec-descartar-apartados]')?.focus(); });
  cont.querySelector('[data-rec-descartar-si]')?.addEventListener('click', () => {
    const ok = rec.descartarApartados();
    repintar({ foco: '#mis-h', aviso: t(ok ? 'pet.apartadasDescartadas' : 'pet.error.generico') });
  });
  cont.querySelectorAll('[data-rec-abrir]').forEach((b) => b.addEventListener('click', () => abrirLeccion(ctx, b.dataset.recAbrir)));
  cont.querySelectorAll('[data-rec-ver]').forEach((b) => b.addEventListener('click', () => ctx.neuri.verRecorrido(b.dataset.recVer)));
  cont.querySelectorAll('[data-rec-siguiente-m]').forEach((b) => b.addEventListener('click', () => {
    const r = rec.crearSiguiente(b.dataset.recSiguienteM);
    decir(r.ok ? t('pet.rec.creando', { titulo: r.trabajo.titulo }) : r.error === 'lleno' ? t('pet.rec.lleno', { max: MAX_PROPIAS }) : t('pet.error.generico'));
  }));
  cont.querySelectorAll('.mis-rec').forEach((li) => {
    const id = li.dataset.rec;
    const conf = li.querySelector('.mis-confirmar-rec');
    li.querySelector('[data-rec-quitar]').addEventListener('click', () => { conf.hidden = false; conf.querySelector('[data-rec-quitar-solo]').focus(); });
    conf.querySelector('[data-rec-quitar-no]').addEventListener('click', () => { conf.hidden = true; li.querySelector('[data-rec-quitar]').focus(); });
    conf.querySelector('[data-rec-quitar-solo]').addEventListener('click', () => {
      const r = ctx.neuri.quitarRecorrido(id);
      repintar({ foco: '#mis-h', aviso: r.ok ? (r.lecciones ? tn('pet.rec.quitadoQuedan', r.lecciones) : t('pet.rec.quitado')) : t('pet.error.generico') });
    });
    conf.querySelector('[data-rec-quitar-todo]')?.addEventListener('click', () => {
      const r = ctx.neuri.quitarRecorrido(id, { lecciones: true });
      repintar({ foco: '#mis-h', aviso: r.ok ? tn('pet.rec.quitadoConLecciones', r.borradas) : t('pet.error.generico') });
    });
  });
}
