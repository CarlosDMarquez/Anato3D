// «Mis lecciones» (vista `propias`): las lecciones que Neuri creó o adaptó, guardadas solo en este navegador. Se pueden
// abrir, renombrar, pedir una adaptación (otra lección: la original no cambia), descargar y quitar (con confirmación);
// exportar todas e importar un archivo (se combinan, sin borrar ninguna); y ver lo que se está preparando. Si había
// lecciones guardadas que ya no se pueden abrir, están apartadas (sin borrar) para descargarlas o descartarlas.
// Arriba, «Mis recorridos» (mis-recorridos.js): los recorridos por unidades, con el estado real de cada unidad.
import { t, tn } from '../../i18n/idioma.js';
import { tr } from '../../i18n/contenido.js';
import { esc, icono, tarjetaLeccion, fechaDia, descargarArchivo, hoyISO } from './comun.js';
import { enlazarTarjetas } from './explorar.js';
import { htmlPreparacion, enlazarPreparacion } from './preparacion.js';
import { htmlMisRecorridos, enlazarMisRecorridos } from './mis-recorridos.js';
import { MAX_PROPIAS, MAX_TITULO } from '../../biblioteca/propias.js';

export function renderMisLecciones(ctx, { foco = null, aviso = null } = {}) {
  const { body } = ctx;
  const entradas = ctx.catalogo.lecciones.filter((L) => L.propia);
  const est = ctx.estadoPropias();
  const ahora = Date.now();
  const lleno = entradas.length >= MAX_PROPIAS;

  const item = (L, i) => {
    const completa = ctx.propias.find((x) => x.id === L.id);
    const base = completa?.origen?.base && ctx.porId.get(completa.origen.base);
    const de = completa?.origen?.modo === 'adaptar' && base ? t('pet.misAdaptadaDe', { base: tr(base.titulo), fecha: fechaDia(completa.origen.fecha) }) : t('pet.misCreada', { fecha: fechaDia(completa?.origen?.fecha) });
    const titulo = tr(L.titulo);
    // Si es una unidad de un recorrido personal, de cuál.
    const unidad = ctx.neuri.recorridos.deLeccion(L.id);
    return `<li class="mis-item" data-id="${esc(L.id)}">
      ${tarjetaLeccion(L, ctx.estado(L, { ahora }), ctx.data.favoritos.includes(L.id), { compacta: true })}
      <p class="mis-origen">${esc(de)}${unidad ? ` · ${esc(t('pet.rec.unidadDe', { n: unidad.n, total: unidad.total, titulo: unidad.recorrido.titulo }))}` : ''}${completa?.origen?.tituloOriginal && completa.origen.tituloOriginal !== completa.titulo ? ` · ${esc(t('pet.misTituloOriginal', { titulo: completa.origen.tituloOriginal }))}` : ''}</p>
      <div class="mis-item-acc" role="group" aria-label="${esc(t('pet.misAccionesDe', { titulo }))}">
        <button class="link" type="button" data-renombrar>${icono('pencil')}<span>${esc(t('pet.renombrar'))}</span></button>
        <button class="link" type="button" data-adaptar>${icono('sparkles')}<span>${esc(t('pet.pedirAdaptacion'))}</span></button>
        <button class="link" type="button" data-descargar-l>${icono('download')}<span>${esc(t('pet.descargarLeccion'))}</span></button>
        <button class="link mis-quitar" type="button" data-quitar-l>${icono('trash')}<span>${esc(t('pet.quitarPropia'))}</span></button>
      </div>
      <form class="mis-renombrar" hidden novalidate>
        <label for="mis-ren-${i}">${esc(t('pet.nuevoTitulo'))}</label>
        <div class="mis-renombrar-fila">
          <input id="mis-ren-${i}" type="text" maxlength="${MAX_TITULO}" required autocomplete="off" value="${esc(L.titulo)}" aria-describedby="mis-ren-err-${i}" />
          <button class="btn primary" type="submit">${esc(t('pet.guardarTitulo'))}</button>
          <button class="btn" type="button" data-cancelar-ren>${esc(t('estudio.cancelar'))}</button>
        </div>
        <p class="mis-error" id="mis-ren-err-${i}" role="alert" hidden></p>
      </form>
      <div class="mod-confirm mis-confirmar" hidden>
        <p>${esc(t('pet.quitarPreguntaDe', { titulo }))}</p>
        <button class="btn danger" type="button" data-quitar-si>${esc(t('pet.quitarSi'))}</button>
        <button class="btn" type="button" data-quitar-no>${esc(t('estudio.cancelar'))}</button>
      </div>
    </li>`;
  };

  body.innerHTML = `
    <section class="mis" aria-labelledby="mis-h">
      <button class="link back" type="button" data-atras>${icono('chevron')}<span>${esc(t('bib.biblioteca'))}</span></button>
      <div class="mis-cab">
        <h3 id="mis-h" class="bib-h mis-h" tabindex="-1">${esc(t('pet.misLecciones'))}</h3>
        <p class="mis-uso${lleno ? ' lleno' : ''}">${esc(t('pet.misUso', { n: entradas.length, max: MAX_PROPIAS }))}</p>
      </div>
      <p class="bib-nota-propias">${esc(t('pet.misLeccionesNota'))} ${esc(t('pet.misLocal'))}</p>
      <div class="mis-acciones">
        <button class="btn primary" type="button" data-neuri>${icono('sparkles')}<span>${esc(t('pet.crearConNeuri'))}</span></button>
        <button class="btn" type="button" data-exportar ${entradas.length ? '' : 'disabled'}>${icono('download')}<span>${esc(t('pet.exportarTodas'))}</span></button>
        <button class="btn" type="button" data-importar>${icono('upload')}<span>${esc(t('pet.importar'))}</span></button>
        <input type="file" accept="application/json,.json" hidden data-archivo />
        <button class="btn" type="button" data-mis-sesiones>${icono('timer')}<span>${esc(ctx.sesiones.lista.length ? tn('ses.misN', ctx.sesiones.lista.length) : t('ses.mis'))}</span></button>
      </div>
      <p class="mis-resultado" role="status" aria-live="polite">${aviso ? esc(aviso) : ''}</p>
      ${lleno ? `<p class="mis-aviso" role="note">${icono('info')}<span>${esc(t('pet.misLleno', { n: MAX_PROPIAS }))}</span></p>` : ''}
      ${est.danadas || est.apartadas ? `<div class="mis-aviso mis-apartadas" role="note">${icono('archive')}
        <div><p>${esc(tn('pet.apartadasAviso', Math.max(est.apartadas, est.danadas)))}</p>
        <p class="mis-apartadas-acc"><button class="link" type="button" data-bajar-apartadas>${esc(t('pet.descargarApartadas'))}</button>
          ${est.apartadas ? `<button class="link" type="button" data-descartar-apartadas>${esc(t('pet.descartarApartadas'))}</button>` : ''}</p>
        <div class="mod-confirm mis-confirmar-apartadas" hidden><p>${esc(t('pet.descartarPregunta'))}</p>
          <button class="btn danger" type="button" data-descartar-si>${esc(t('pet.descartarSi'))}</button>
          <button class="btn" type="button" data-descartar-no>${esc(t('estudio.cancelar'))}</button></div></div>
      </div>` : ''}
      <div id="mis-rec">${htmlMisRecorridos(ctx)}</div>
      <div id="mis-prep">${htmlPreparacion(ctx)}</div>
      ${entradas.length ? `<ul class="mis-lista">${entradas.map(item).join('')}</ul>` : `<p class="bib-vacio">${esc(t('pet.misVacio'))}</p>`}
    </section>`;

  // ── Eventos ──
  const resultado = body.querySelector('.mis-resultado');
  const decir = (texto) => { resultado.textContent = ''; requestAnimationFrame(() => { resultado.textContent = texto; }); };
  const repintar = (opciones) => renderMisLecciones(ctx, opciones);
  enlazarTarjetas(ctx, body);
  body.querySelector('[data-neuri]').addEventListener('click', () => ctx.neuri.abrir());
  body.querySelector('[data-mis-sesiones]').addEventListener('click', () => ctx.ir({ tipo: 'sesiones' }));
  enlazarPreparacion(ctx, body.querySelector('#mis-prep'), () => repintar({ foco: '#mis-h' }));
  enlazarMisRecorridos(ctx, body.querySelector('#mis-rec'), { repintar, decir });
  // Lo que se prepara avanza solo: se repintan esas partes (sin mover el foco).
  ctx.repintarPropias = () => {
    const cont = ctx.vista.tipo === 'propias' && body.querySelector('#mis-prep');
    if (!cont) return;
    // Si terminó una creación, hay una lección más: la vista entera (con el foco donde estaba, si se puede).
    if (ctx.catalogo.lecciones.filter((L) => L.propia).length !== entradas.length) return repintar({ foco: document.activeElement?.closest?.('.mis') ? '#mis-h' : null });
    const dentro = cont.contains(document.activeElement) ? document.activeElement.dataset.verTrabajo ?? document.activeElement.dataset.quitarTrabajo : null;
    cont.innerHTML = htmlPreparacion(ctx);
    enlazarPreparacion(ctx, cont, () => repintar({ foco: '#mis-h' }));
    if (dentro) (cont.querySelector(`[data-ver-trabajo="${CSS.escape(dentro)}"]`) ?? body.querySelector('#mis-h'))?.focus({ preventScroll: true });
    // Los recorridos: el foco vuelve al mismo botón (por sus atributos) si sigue, o al título de la sección.
    const rec = body.querySelector('#mis-rec');
    const activo = rec.contains(document.activeElement) ? document.activeElement : null;
    // (Con una confirmación abierta no se repinta: se perdería lo que la persona está decidiendo.)
    if (rec.querySelector('.mis-confirmar-rec:not([hidden]), .mis-confirmar-rec-apartados:not([hidden])')) return;
    const clave = activo && [...activo.attributes].find((a) => a.name.startsWith('data-'));
    rec.innerHTML = htmlMisRecorridos(ctx);
    enlazarMisRecorridos(ctx, rec, { repintar, decir });
    if (activo) ((clave && rec.querySelector(`[${clave.name}="${CSS.escape(clave.value)}"]`)) || rec.querySelector('#mis-rec-h') || body.querySelector('#mis-h'))?.focus({ preventScroll: true });
  };

  // Exportar e importar
  body.querySelector('[data-exportar]')?.addEventListener('click', () => {
    const ok = descargarArchivo(`mis-lecciones-anato3d-${hoyISO()}.json`, ctx.exportarPropias());
    decir(ok ? tn('pet.exportadas', entradas.length) : t('pet.error.generico'));
  });
  const archivo = body.querySelector('[data-archivo]');
  body.querySelector('[data-importar]').addEventListener('click', () => archivo.click());
  archivo.addEventListener('change', async () => {
    const f = archivo.files?.[0];
    if (!f) return;
    let texto = null;
    try { texto = f.size <= 8 * 1024 * 1024 ? await f.text() : null; } catch { texto = null; }
    const r = texto == null ? { ok: false, error: 'formato' } : ctx.importarPropias(texto);
    repintar({ foco: '#mis-h', aviso: resumenImportacion(r) });
  });

  // Lo apartado
  body.querySelector('[data-bajar-apartadas]')?.addEventListener('click', () => {
    const ok = descargarArchivo(`lecciones-apartadas-anato3d-${hoyISO()}.json`, JSON.stringify(ctx.apartadasPropias(), null, 2));
    if (!ok) decir(t('pet.error.generico'));
  });
  const confAp = body.querySelector('.mis-confirmar-apartadas');
  body.querySelector('[data-descartar-apartadas]')?.addEventListener('click', () => { confAp.hidden = false; confAp.querySelector('.danger').focus(); });
  body.querySelector('[data-descartar-no]')?.addEventListener('click', () => { confAp.hidden = true; body.querySelector('[data-descartar-apartadas]')?.focus(); });
  body.querySelector('[data-descartar-si]')?.addEventListener('click', () => {
    const ok = ctx.descartarApartadas();
    repintar({ foco: '#mis-h', aviso: t(ok ? 'pet.apartadasDescartadas' : 'pet.error.generico') });
  });

  // Cada lección
  body.querySelectorAll('.mis-item').forEach((li) => {
    const id = li.dataset.id;
    const form = li.querySelector('.mis-renombrar');
    const input = form.querySelector('input');
    const error = form.querySelector('.mis-error');
    const conf = li.querySelector('.mis-confirmar');
    li.querySelector('[data-renombrar]').addEventListener('click', () => {
      conf.hidden = true;
      form.hidden = false;
      input.focus();
      input.select();
    });
    form.querySelector('[data-cancelar-ren]').addEventListener('click', () => { form.hidden = true; error.hidden = true; li.querySelector('[data-renombrar]').focus(); });
    input.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.preventDefault(); form.querySelector('[data-cancelar-ren]').click(); } });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const r = ctx.renombrarPropia(id, input.value);
      if (r.ok) return repintar({ foco: `.mis-item[data-id="${CSS.escape(id)}"] [data-renombrar]`, aviso: t('pet.renombrada') });
      error.textContent = r.error === 'titulo' ? t('pet.tituloInvalido', { max: MAX_TITULO }) : t('pet.error.generico');
      error.hidden = false;
      input.setAttribute('aria-invalid', 'true');
      input.focus();
    });
    li.querySelector('[data-adaptar]').addEventListener('click', () => {
      const L = ctx.porId.get(id);
      ctx.neuri.abrir(null, { borrador: t('pet.adaptarMiBorrador', { titulo: L ? tr(L.titulo) : '' }) });
    });
    li.querySelector('[data-descargar-l]').addEventListener('click', () => {
      const L = ctx.propias.find((x) => x.id === id);
      if (!L || !descargarArchivo(`${id}.json`, JSON.stringify(L, null, 2))) decir(t('pet.error.generico'));
    });
    li.querySelector('[data-quitar-l]').addEventListener('click', () => { form.hidden = true; conf.hidden = false; conf.querySelector('.danger').focus(); });
    conf.querySelector('[data-quitar-no]').addEventListener('click', () => { conf.hidden = true; li.querySelector('[data-quitar-l]').focus(); });
    conf.querySelector('[data-quitar-si]').addEventListener('click', () => {
      const ok = ctx.borrarPropia(id);
      repintar({ foco: '#mis-h', aviso: t(ok ? 'pet.quitada' : 'pet.error.generico') });
    });
  });

  requestAnimationFrame(() => { if (body.contains(resultado)) (foco && body.querySelector(foco) || body.querySelector('#mis-h'))?.focus({ preventScroll: !foco }); });
}

/** Lo que pasó al importar, en una frase. */
function resumenImportacion(r) {
  if (r.error === 'formato') return t('pet.imp.formato');
  if (!r.ok) return t('pet.imp.noGuardado');
  const partes = [
    r.añadidas && tn('pet.imp.añadidas', r.añadidas), r.copias && tn('pet.imp.copias', r.copias), r.iguales && tn('pet.imp.iguales', r.iguales),
    r.invalidas && tn('pet.imp.invalidas', r.invalidas), r.sinSitio && tn('pet.imp.sinSitio', r.sinSitio, { max: MAX_PROPIAS }),
  ].filter(Boolean);
  return partes.length ? `${partes.join('; ')}.` : t('pet.imp.nada');
}
