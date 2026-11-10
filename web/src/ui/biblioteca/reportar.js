// «Reportar un problema» en un paso, una pregunta o la ficha de una lección: un formulario en línea (no una ventana)
// con la categoría y un comentario opcional. Lo que se envía está dicho en el propio formulario. La lógica está en
// src/biblioteca/reportes.js; la cola, en el servidor (server/reportes.mjs), y se revisa con scripts/reportes.mjs.
import { t } from '../../i18n/idioma.js';
import { esc, icono } from './comun.js';
import { CATEGORIAS, MAX_COMENTARIO, crearReporte, reportar } from '../../biblioteca/reportes.js';

let n = 0;
const almacen = () => { try { return localStorage; } catch { return null; } };

/** El enlace que abre el formulario. */
export const botonReportar = () => `<button class="link bib-reportar" type="button" data-reportar aria-expanded="false">${icono('flag')}<span>${esc(t('rep.boton'))}</span></button>`;

/**
 * Enlaza los botones [data-reportar] de `cont`. `contexto()`: { vista, leccion, version, paso, pregunta, estructura,
 * idioma, modelo } en el momento de reportar. `alEnviar(reporte, estado)`: para el registro de eventos.
 */
export function enlazarReportar(cont, contexto, { alEnviar = null } = {}) {
  cont.querySelectorAll('[data-reportar]').forEach((b) => b.addEventListener('click', () => {
    const abierto = b.nextElementSibling?.classList.contains('bib-rep');
    if (abierto) { cerrar(b); return; }
    abrir(b, contexto, alEnviar);
  }));
}

function cerrar(boton) {
  if (boton.nextElementSibling?.classList.contains('bib-rep')) boton.nextElementSibling.remove();
  boton.setAttribute('aria-expanded', 'false');
  boton.focus();
}

function abrir(boton, contexto, alEnviar) {
  const id = `rep-${++n}`;
  const form = document.createElement('form');
  form.className = 'bib-rep';
  form.noValidate = true;
  form.setAttribute('aria-labelledby', `${id}-t`);
  form.innerHTML = `
    <p class="bib-rep-t" id="${id}-t">${esc(t('rep.titulo'))}</p>
    <fieldset><legend class="sr-only">${esc(t('rep.categoria'))}</legend>
      ${CATEGORIAS.map((c, i) => `<label class="bib-rep-op"><input type="radio" name="${id}-cat" value="${c}" ${i === 0 ? 'required' : ''}/> <span>${esc(t(`rep.cat.${c}`))}</span></label>`).join('')}
    </fieldset>
    <label class="bib-rep-l" for="${id}-c">${esc(t('rep.comentario'))}</label>
    <textarea id="${id}-c" rows="3" maxlength="${MAX_COMENTARIO}" aria-describedby="${id}-n"></textarea>
    <p class="bib-rep-n" id="${id}-n">${esc(t('rep.nota'))}</p>
    <p class="bib-rep-err" role="alert" hidden></p>
    <div class="bib-acciones"><button class="btn primary" type="submit">${esc(t('rep.enviar'))}</button>
      <button class="btn" type="button" data-rep-cancelar>${esc(t('estudio.cancelar'))}</button></div>`;
  boton.after(form);
  boton.setAttribute('aria-expanded', 'true');
  form.querySelector('input').focus();
  form.querySelector('[data-rep-cancelar]').addEventListener('click', () => cerrar(boton));
  form.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.preventDefault(); cerrar(boton); } });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const err = form.querySelector('.bib-rep-err');
    const categoria = form.querySelector('input[type="radio"]:checked')?.value;
    const comentario = form.querySelector('textarea').value;
    const r = crearReporte({ categoria, comentario, contexto: contexto() });
    if (!r.ok) {
      err.textContent = t(r.error === 'categoria' ? 'rep.faltaCategoria' : r.error === 'comentario' ? 'rep.faltaComentario' : 'rep.error');
      err.hidden = false;
      (r.error === 'comentario' ? form.querySelector('textarea') : form.querySelector('input')).focus();
      return;
    }
    form.querySelectorAll('button, input, textarea').forEach((x) => { x.disabled = true; });
    const estado = await reportar(r.reporte, { almacen: almacen() });
    try { alEnviar?.(r.reporte, estado); } catch { /* el registro de eventos nunca rompe nada */ }
    const fin = document.createElement('p');
    fin.className = `bib-rep-fin ${estado}`;
    fin.setAttribute('role', 'status');
    fin.tabIndex = -1;
    fin.textContent = t(`rep.estado.${estado}`);
    form.replaceWith(fin);
    boton.setAttribute('aria-expanded', 'false');
    fin.focus();
  });
}
