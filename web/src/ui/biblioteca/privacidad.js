// «Mis datos y privacidad» (vista `datos`): qué se guarda en este navegador y qué sale de él, las estadísticas de uso
// (opcionales, desactivadas por defecto), y exportar, importar o borrar los datos de estudio. La lógica está en
// src/biblioteca/datos.js y src/biblioteca/eventos.js.
import { t, tn } from '../../i18n/idioma.js';
import { esc, icono, descargarArchivo, hoyISO } from './comun.js';
import { exportarDatos, importarDatos, inventarioDatos, borrarDatos } from '../../biblioteca/datos.js';

const sesion = () => { try { return sessionStorage; } catch { return null; } };

export function renderDatos(ctx, { foco = null, aviso = null } = {}) {
  const { body } = ctx;
  const inv = inventarioDatos({ almacen: ctx.storage, data: ctx.data, sesion: sesion() });
  const ev = ctx.eventos;
  const activado = ev.activado();
  const lista = ev.eventos().slice(-20).reverse();
  const fila = (k, v) => `<li><span>${esc(t(k))}</span><b>${esc(String(v))}</b></li>`;
  body.innerHTML = `<section class="datos" aria-labelledby="datos-h">
    <button class="link back" type="button" data-atras>${icono('chevron')}<span>${esc(t('bib.biblioteca'))}</span></button>
    <h3 id="datos-h" class="mis-h" tabindex="-1">${esc(t('dat.titulo'))}</h3>
    <p class="mis-resultado" role="status" aria-live="polite">${aviso ? esc(aviso) : ''}</p>

    <h4 class="bib-h">${esc(t('dat.aqui'))}</h4>
    <ul class="dat-lista">
      ${fila('dat.lecciones', inv.lecciones)}${fila('dat.respuestas', inv.respuestas)}${fila('dat.propias', inv.propias)}
      ${fila('dat.trabajos', inv.trabajos)}${fila('dat.recorridos', inv.recorridos)}${fila('dat.examen', t(inv.examen ? 'dat.si' : 'dat.no'))}${fila('dat.preferencias', t(inv.preferencias ? 'dat.si' : 'dat.no'))}
      ${fila('dat.reportes', inv.reportes)}${fila('dat.conversacion', inv.conversacion)}${fila('dat.eventos', inv.eventos)}
    </ul>
    <p class="dat-nota">${esc(t('dat.aquiNota'))}</p>

    <h4 class="bib-h">${esc(t('dat.sale'))}</h4>
    <ul class="dat-texto">
      <li>${esc(t('dat.saleNeuri'))}</li>
      <li>${esc(t('dat.saleReportes'))}</li>
      <li>${esc(t('dat.saleNada'))}</li>
    </ul>
    <p class="dat-nota">${esc(t('dat.saleNota'))}</p>

    <h4 class="bib-h">${esc(t('dat.estadisticas'))}</h4>
    <label class="dat-interruptor"><input type="checkbox" data-analitica ${activado ? 'checked' : ''}/> <span>${esc(t('dat.estadisticasActivar'))}</span></label>
    <p class="dat-nota">${esc(t('dat.estadisticasNota'))}</p>
    ${activado ? `<details class="dat-eventos"><summary>${esc(tn('dat.verEventos', inv.eventos))}</summary>
      ${lista.length ? `<ol>${lista.map((e) => `<li><code>${esc(e.tipo)}</code> <small>${esc(new Date(e.fecha).toLocaleString())}</small> <small>${esc(JSON.stringify(e.props))}</small></li>`).join('')}</ol>` : `<p class="dat-nota">${esc(t('dat.sinEventos'))}</p>`}
      <p class="mapa-acc"><button class="link" type="button" data-bajar-eventos>${esc(t('dat.descargarEventos'))}</button> <button class="link" type="button" data-borrar-eventos>${esc(t('dat.borrarEventos'))}</button></p>
    </details>` : ''}

    <h4 class="bib-h">${esc(t('dat.copia'))}</h4>
    <p class="dat-nota">${esc(t('dat.copiaNota'))}</p>
    <div class="mis-acciones">
      <button class="btn" type="button" data-exportar>${icono('download')}<span>${esc(t('dat.exportar'))}</span></button>
      <button class="btn" type="button" data-importar>${icono('upload')}<span>${esc(t('dat.importar'))}</span></button>
      <input type="file" accept="application/json,.json" hidden data-archivo />
    </div>

    <h4 class="bib-h">${esc(t('dat.borrarTitulo'))}</h4>
    <p class="dat-nota">${esc(t('dat.borrarNota'))}</p>
    <p><button class="btn danger" type="button" data-borrar>${icono('trash')}<span>${esc(t('dat.borrar'))}</span></button></p>
    <div class="mod-confirm dat-confirmar" hidden>
      <p>${esc(t('dat.borrarPregunta'))}</p>
      <button class="btn danger" type="button" data-borrar-si>${esc(t('dat.borrarSi'))}</button> <button class="btn" type="button" data-borrar-no>${esc(t('estudio.cancelar'))}</button>
    </div>
  </section>`;

  const repintar = (opciones) => renderDatos(ctx, opciones);
  body.querySelector('[data-atras]').addEventListener('click', () => ctx.volver());
  body.querySelector('[data-analitica]').addEventListener('change', (e) => {
    ev.fijar(e.target.checked);
    repintar({ foco: '[data-analitica]', aviso: t(e.target.checked ? 'dat.estadisticasSi' : 'dat.estadisticasNo') });
  });
  body.querySelector('[data-bajar-eventos]')?.addEventListener('click', () => descargarArchivo(`estadisticas-anato3d-${hoyISO()}.json`, JSON.stringify(ev.lote(), null, 2)));
  body.querySelector('[data-borrar-eventos]')?.addEventListener('click', () => { ev.borrar(); repintar({ foco: '#datos-h', aviso: t('dat.eventosBorrados') }); });
  body.querySelector('[data-exportar]').addEventListener('click', () => {
    const ok = descargarArchivo(`mis-datos-anato3d-${hoyISO()}.json`, exportarDatos({ almacen: ctx.storage, data: ctx.data }));
    repintar({ foco: '[data-exportar]', aviso: t(ok ? 'dat.exportado' : 'pet.error.generico') });
  });
  const archivo = body.querySelector('[data-archivo]');
  body.querySelector('[data-importar]').addEventListener('click', () => archivo.click());
  archivo.addEventListener('change', async () => {
    const f = archivo.files?.[0];
    if (!f) return;
    let texto = null;
    try { texto = f.size <= 20 * 1024 * 1024 ? await f.text() : null; } catch { texto = null; }
    const r = texto == null ? { ok: false, error: 'formato' } : importarDatos(texto, { almacen: ctx.storage, data: ctx.data });
    if (!r.ok) return repintar({ foco: '#datos-h', aviso: t('dat.importarMal') });
    ctx.data = r.data;
    ctx.guardar();
    ctx.actualizarPropias?.();
    ctx.neuri.recorridos?.recargar();                     // los recorridos importados (sus unidades ya ven sus lecciones)
    repintar({ foco: '#datos-h', aviso: t('dat.importado', { lecciones: r.cambios.lecciones, respuestas: r.cambios.intentos, propias: r.propias.añadidas + r.propias.copias }) });
  });
  const conf = body.querySelector('.dat-confirmar');
  body.querySelector('[data-borrar]').addEventListener('click', () => { conf.hidden = false; conf.querySelector('.danger').focus(); });
  body.querySelector('[data-borrar-no]').addEventListener('click', () => { conf.hidden = true; body.querySelector('[data-borrar]').focus(); });
  body.querySelector('[data-borrar-si]').addEventListener('click', async () => {
    // Primero se paran las creaciones en curso (no deben volver a guardarse) y se olvida la conversación.
    await ctx.neuri.olvidarTodo?.();
    const ok = borrarDatos({ almacen: ctx.storage, sesion: sesion() });
    ctx.olvidarDatos();
    repintar({ foco: '#datos-h', aviso: t(ok ? 'dat.borrado' : 'dat.borradoParcial') });
  });
  requestAnimationFrame(() => { if (body.querySelector('#datos-h')) (foco && body.querySelector(foco) || body.querySelector('#datos-h'))?.focus({ preventScroll: !foco }); });
}
