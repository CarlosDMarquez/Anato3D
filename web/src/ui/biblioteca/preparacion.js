// Lo que Neuri está preparando (con su etapa real) o no pudo terminar: en la portada y en «Mis lecciones». Lo que se
// prepara sigue aunque se cierre la conversación; desde aquí se ve cómo va.
import { t } from '../../i18n/idioma.js';
import { esc, icono } from './comun.js';
import { FINALES } from '../../pet/trabajos.js';

/** Las creaciones que enseñar: en curso o sin terminar (lo cancelado no: fue decisión de la persona). */
export const enPreparacion = (ctx) => ctx.neuri.trabajos.lista.filter((x) => x.estado !== 'guardada' && x.error !== 'cancelada');

export function htmlPreparacion(ctx) {
  const prep = enPreparacion(ctx);
  if (!prep.length) return '';
  return `<p class="bib-prep-t">${esc(t('pet.enPreparacion'))}</p><ul class="bib-prep">${prep.map((x) => item(ctx, x)).join('')}</ul>`;
}

function item(ctx, x) {
  const final = FINALES.includes(x.estado);
  const codigo = x.estado === 'error' ? x.error : x.estado === 'no-guardada' ? 'no-guardada' : x.estado === 'interrumpida' ? 'interrumpida' : x.estado === 'aclaracion' ? 'aclaracion' : x.codigo ?? 'limitacion';
  const texto = !final ? ctx.neuri.etiquetaEtapa(x) : codigo === 'no-guardada' ? t('pet.noGuardadaCorto') : ctx.neuri.textoError(codigo);
  const titulo = x.titulo || t('pet.leccionNueva');
  // Una unidad de un recorrido personal dice de cuál.
  const de = ctx.neuri.recorridos?.deTrabajo(x.id);
  return `<li class="bib-prep-item${final ? ' mal' : ''}">
    ${final ? icono('info') : '<i class="neuri-giro" aria-hidden="true"></i>'}
    <span class="bib-prep-txt"><b>${esc(titulo)}</b>${de ? `<small class="bib-prep-de">${esc(t('pet.rec.unidadDe', { n: de.n, total: de.total, titulo: de.recorrido.titulo }))}</small>` : ''}<small>${esc(texto)}</small></span>
    <span class="bib-prep-acc">
      <button class="link" type="button" data-ver-trabajo="${esc(x.id)}">${esc(t(final ? 'pet.verQuePaso' : 'pet.verComoVa'))}</button>
      ${final ? `<button class="link" type="button" data-quitar-trabajo="${esc(x.id)}" aria-label="${esc(t('pet.quitarAvisoDe', { titulo }))}">${esc(t('pet.quitarAviso'))}</button>` : ''}
    </span>
  </li>`;
}

/** Enlaza los botones de la lista. `alQuitar()`: después de quitar un aviso (para repintar). */
export function enlazarPreparacion(ctx, cont, alQuitar) {
  cont.querySelectorAll('[data-ver-trabajo]').forEach((b) => b.addEventListener('click', () => ctx.neuri.verTrabajo(b.dataset.verTrabajo)));
  cont.querySelectorAll('[data-quitar-trabajo]').forEach((b) => b.addEventListener('click', () => {
    ctx.neuri.trabajos.quitar(b.dataset.quitarTrabajo);
    alQuitar?.();
  }));
}
