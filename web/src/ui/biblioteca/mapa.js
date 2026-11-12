// «Tu mapa de aprendizaje» (vista `mapa`): lecciones empezadas, terminadas, con aprendizaje demostrado y consolidadas;
// las cinco habilidades con su estado; lo que está costando, con el motivo («lo confundiste con…») y cómo practicarlo;
// y los repasos, que se pueden aplazar y retomar. La lógica está en src/biblioteca/mapa.js.
import * as P from '../../biblioteca/progreso.js';
import { calcularMapa, cuando } from '../../biblioteca/mapa.js';
import { motivoNoDisponible } from '../../biblioteca/evaluar.js';
import { t, tn } from '../../i18n/idioma.js';
import { tr } from '../../i18n/contenido.js';
import { esc, icono, fecha, barra } from './comun.js';
import { abrirLeccion, empezarPractica } from './explorar.js';
import { nombreE } from './leccion.js';

const MAX_DIFICULTADES = 6;
const ESTUDIO = 'https://pubmed.ncbi.nlm.nih.gov/27860396/';

export async function renderMapa(ctx, { foco = null, aviso = null } = {}) {
  const { body } = ctx;
  const ahora = Date.now();
  // Los intentos de preguntas que el modelo muestra mal (limitaciones conocidas, src/data/limitaciones.js) se conservan
  // pero no son evidencia de lo que se sabe. Hace falta su lección cargada: las de las dificultades se cargan y se recalcula.
  const invalida = (i) => {
    const L = ctx.lecciones.get(i.l);
    const q = L?.preguntas?.find((x) => x.id === i.q);
    return !!q && motivoNoDisponible(L, q, ctx.api.modelo()) === 'limitacion';
  };
  const calcular = () => calcularMapa(ctx.data, { catalogo: ctx.catalogo.lecciones, ahora, invalida, estado: (L) => ctx.estado(L, { ahora }) });
  const cargar = (difs) => Promise.all([...new Set(difs.map((d) => d.leccion))].map((id) => ctx.cargarLeccion(id).catch(() => null)));
  let m = calcular();
  // Para explicar las dificultades hacen falta sus lecciones (nombres, enunciados y pasos).
  const antes = ctx.lecciones.size;
  await cargar(m.dificultades.slice(0, MAX_DIFICULTADES));
  if (ctx.lecciones.size !== antes) { m = calcular(); await cargar(m.dificultades.slice(0, MAX_DIFICULTADES)); }
  const difs = m.dificultades.slice(0, MAX_DIFICULTADES);
  if (ctx.vista.tipo !== 'mapa') return;

  const vacio = !m.intentos && !m.lecciones.visitadas;
  body.innerHTML = `
    <section class="mapa" aria-labelledby="mapa-h">
      <button class="link back" type="button" data-atras>${icono('chevron')}<span>${esc(t('bib.biblioteca'))}</span></button>
      <h3 id="mapa-h" class="mis-h" tabindex="-1">${esc(t('bib.mapa.titulo'))}</h3>
      <p class="bib-nota-propias">${esc(t('bib.mapa.nota'))}</p>
      <p class="mis-resultado" role="status" aria-live="polite">${aviso ? esc(aviso) : ''}</p>
      ${vacio ? `<p class="bib-vacio">${esc(t('bib.mapa.vacio'))}</p>` : ''}

      <h4 class="bib-h">${esc(t('bib.mapa.lecciones'))}</h4>
      <dl class="mapa-cuentas">
        ${['visitadas', 'completadas', 'demostradas', 'dominadas'].map((k) => `<div><dt>${esc(t(`bib.mapa.${k}`))}</dt><dd>${m.lecciones[k]}</dd></div>`).join('')}
      </dl>

      <h4 class="bib-h">${esc(t('bib.mapa.habilidades'))}</h4>
      <ul class="mapa-hab">${m.habilidades.map((h) => `
        <li class="mapa-hab-${h.estado}">
          <div class="mapa-hab-cab"><b>${esc(t(`hab.${h.id}`))}</b><span class="mapa-chip">${esc(t(`hab.estado.${h.estado}`))}</span></div>
          ${h.intentos ? `${barra(h.recientes.aciertos, h.recientes.n, t('bib.mapa.recientes', { a: h.recientes.aciertos, n: h.recientes.n }))}
            <p class="mapa-hab-d">${esc(t('bib.mapa.recientes', { a: h.recientes.aciertos, n: h.recientes.n }))}${h.consolidadas ? ` · ${esc(tn('bib.mapa.consolidadas', h.consolidadas))}` : ''}</p>` : `<p class="mapa-hab-d">${esc(t(`hab.${h.id}.como`))}</p>`}
        </li>`).join('')}
      </ul>

      <h4 class="bib-h">${esc(t('bib.mapa.dificultades'))}</h4>
      ${difs.length ? `<ul class="mapa-difs">${difs.map((d) => htmlDificultad(ctx, d, ahora)).join('')}</ul>
        ${m.dificultades.length > 1 ? `<p><button class="btn" type="button" data-practicar-todas>${icono('target')}<span>${esc(tn('bib.mapa.practicarTodas', Math.min(m.dificultades.length, 12)))}</span></button></p>` : ''}`
        : `<p class="bib-vacio">${esc(t('bib.mapa.sinDificultades'))}</p>`}

      <h4 class="bib-h">${esc(t('bib.mapa.repasos'))}</h4>
      <div class="mapa-repasos">
        <p>${esc(m.repasos.vencidas ? tn('bib.mapa.vencidas', m.repasos.vencidas) : t('bib.mapa.alDia'))}</p>
        ${m.repasos.vencidas ? `<p class="mapa-acc"><button class="btn primary" type="button" data-repasar>${esc(t('bib.repasarAhora'))}</button>
          <button class="btn" type="button" data-aplazar-todo>${esc(t('bib.mapa.aplazarTodos'))}</button></p>` : ''}
        ${m.repasos.aplazados.length ? `<p>${esc(tn('bib.mapa.aplazados', m.repasos.aplazados.length, { fecha: fecha(m.repasos.aplazados[0].hasta) }))}
          <button class="link" type="button" data-retomar>${esc(t('bib.mapa.retomar'))}</button></p>` : ''}
      </div>
      ${m.tecnicos ? `<p class="mis-origen">${esc(tn('bib.mapa.tecnicos', m.tecnicos))}</p>` : ''}
      <p class="mod-foot">${esc(t('bib.mapa.investigacion'))} <a href="${ESTUDIO}" target="_blank" rel="noopener">${esc(t('bib.mapa.estudio'))}</a></p>
    </section>`;

  // ── Eventos ──
  const repintar = (opciones) => renderMapa(ctx, opciones);
  body.querySelector('[data-atras]').addEventListener('click', () => ctx.volver());
  body.querySelector('[data-repasar]')?.addEventListener('click', () => empezarPractica(ctx, 'vencidas'));
  body.querySelector('[data-practicar-todas]')?.addEventListener('click', () => empezarPractica(ctx, 'items', { items: m.dificultades.slice(0, 12).map((d) => d.item), titulo: t('bib.mapa.dificultades') }));
  body.querySelector('[data-aplazar-todo]')?.addEventListener('click', () => {
    const ids = P.vencidas(ctx.data, { ahora: Date.now() });
    const r = P.aplazar(ctx.data, ids, 1);
    ctx.guardar();
    repintar({ foco: '#mapa-h', aviso: tn('bib.mapa.aplazadosN', r.n, { fecha: fecha(r.hasta) }) });
  });
  body.querySelector('[data-retomar]')?.addEventListener('click', () => {
    const n = P.retomar(ctx.data);
    ctx.guardar();
    repintar({ foco: '#mapa-h', aviso: tn('bib.mapa.retomados', n) });
  });
  body.querySelectorAll('[data-dif]').forEach((li) => {
    const d = difs.find((x) => x.item === li.dataset.dif);
    li.querySelector('[data-practicar]')?.addEventListener('click', () => empezarPractica(ctx, 'items', { items: [d.item], titulo: t('bib.mapa.dificultades') }));
    li.querySelector('[data-ver-paso]')?.addEventListener('click', () => {
      const L = ctx.lecciones.get(d.leccion);
      const paso = L?.preguntas.find((q) => q.id === d.pregunta)?.paso;
      abrirLeccion(ctx, d.leccion, { paso: Math.max(0, L?.pasos.findIndex((p) => p.id === paso) ?? 0) });
    });
    li.querySelector('[data-aplazar]')?.addEventListener('click', () => {
      const r = P.aplazar(ctx.data, [d.item], 1);
      ctx.guardar();
      repintar({ foco: '#mapa-h', aviso: tn('bib.mapa.aplazadosN', r.n, { fecha: fecha(r.hasta) }) });
    });
    li.querySelector('[data-retomar-uno]')?.addEventListener('click', () => {
      const n = P.retomar(ctx.data, [d.item]);
      ctx.guardar();
      repintar({ foco: '#mapa-h', aviso: tn('bib.mapa.retomados', n) });
    });
  });
  requestAnimationFrame(() => { if (body.querySelector('#mapa-h')) (foco && body.querySelector(foco) || body.querySelector('#mapa-h'))?.focus({ preventScroll: !foco }); });
}

/** Una dificultad: qué es, por qué se propone («lo confundiste con…») y qué hacer. */
function htmlDificultad(ctx, d, ahora) {
  const L = ctx.lecciones.get(d.leccion);
  const q = L?.preguntas.find((x) => x.id === d.pregunta);
  const estructural = d.tipo === 'identificar' || d.tipo === 'localizar';
  const que = estructural && d.estructura && L ? nombreE(L, d.estructura) : q?.enunciado ? tr(q.enunciado) : tr(L?.titulo ?? '');
  // Lo elegido: en localizar es la estructura tocada (su nombre); en las de opciones, el texto de la opción.
  const elegida = d.elegida && d.elegida !== 'no-lo-se' ? (d.tipo === 'localizar' && L?.estructuras[d.elegida] ? nombreE(L, d.elegida) : tr(d.elegida)) : '';
  const tipoMotivo = d.motivo === 'confusion' ? (estructural ? 'confusion' : 'eleccion') : d.motivo;
  const c = cuando(d.fecha, ahora);
  const motivo = t(`bib.motivo.${tipoMotivo}.${c}`, { x: elegida, fecha: fecha(d.fecha) });
  return `<li class="mapa-dif" data-dif="${esc(d.item)}">
    <p class="mapa-dif-t"><b>${esc(que)}</b> <small>${esc(t(`hab.${d.habilidad ?? 'reconocer'}`))} · ${esc(tr(L?.titulo ?? ''))}</small></p>
    <p class="mapa-dif-m">${esc(motivo)}</p>
    <p class="mapa-acc">
      ${d.aplazado ? `<span class="mis-origen">${esc(t('bib.mapa.aplazadoHasta', { fecha: fecha(d.aplazado) }))}</span> <button class="link" type="button" data-retomar-uno>${esc(t('bib.mapa.retomar'))}</button>`
        : `<button class="btn" type="button" data-practicar>${esc(t('bib.mapa.practicar'))}</button>
           <button class="link" type="button" data-ver-paso>${esc(t('bib.mapa.verPaso'))}</button>
           <button class="link" type="button" data-aplazar>${esc(t('bib.mapa.aplazar'))}</button>`}
    </p>
  </li>`;
}
