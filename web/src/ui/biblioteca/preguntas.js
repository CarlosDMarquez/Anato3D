// Evaluación, repaso y práctica: una pregunta cada vez, sin que nada revele la respuesta (ni etiqueta, ni ficha, ni
// nombre al pasar el ratón, ni buscador) hasta responder. Después, la explicación, la cita de la fuente y el paso de la
// lección al que volver. Las preguntas que no se pueden mostrar en este modelo se saltan y no cuentan.
import * as P from '../../biblioteca/progreso.js';
import { mallas } from '../../biblioteca/formato.js';
import { corregir, porObjetivo, NO_LO_SE } from '../../biblioteca/evaluar.js';
import { t, tn } from '../../i18n/idioma.js';
import { tr } from '../../i18n/contenido.js';
import { esc, icono } from './comun.js';
import { htmlFuentes, nombreE } from './leccion.js';
import { abrirLeccion, empezarPractica, siguienteDeSesion, avanzarSesion } from './explorar.js';

const leccionDe = (ctx, q) => ctx.lecciones.get(q.leccion);

// Vista 3D de una pregunta: la del paso de la lección al que pertenece, con solo lo que hace falta resaltado.
function vistaDe(L, q) {
  const base = L.pasos.find((p) => p.id === q.paso)?.vista ?? L.pasos.find((p) => p.vista?.ver?.includes(q.estructura))?.vista ?? {};
  const todas = [...(base.ver ?? []), ...(base.contexto ?? [])];
  if (q.tipo === 'localizar') {
    return { ...base, ver: [], contexto: [...new Set([...q.candidatas, ...todas.filter((id) => L.estructuras[id]?.tipo === 'hueso')])], fantasma: [] };
  }
  return { ...base, ver: [q.estructura], contexto: todas.filter((id) => id !== q.estructura), fantasma: [] };
}

export async function renderPreguntas(ctx) {
  const v = ctx.vista;
  const q = v.preguntas[v.i];
  const L = leccionDe(ctx, q);
  if (!v.respuesta && !v.preparada) {
    v.preparada = true;
    v.cargando = q.tipo === 'identificar' || q.tipo === 'localizar';
    ctx.api.modoEvaluacion(true);
    pintar(ctx);
    if (v.cargando) {
      // Lado al azar en las estructuras pares: así no se aprende «la de la derecha».
      const lado = L.estructuras[q.estructura]?.lado === 'bilateral' && Math.random() < 0.5 ? 'L' : 'R';
      v.lado = lado;
      const r = await ctx.api.mostrar(L, { ...vistaDe(L, q), lado }, { evaluar: true });
      if (ctx.vista !== v) return;
      v.cargando = false;
      if (!r.ok) v.saltada = true;
      else if (q.tipo === 'localizar') {
        ctx.api.alTocar((pieza) => {
          if (!pieza || v.respuesta) return true;
          const base = pieza.id;
          const hit = q.candidatas.find((id) => mallas(L.estructuras[id], 'L').includes(base) || mallas(L.estructuras[id], 'R').includes(base));
          if (!hit) { ctx.toast(t('bib.tocaCandidata')); return true; }
          responder(ctx, hit);
          return true;
        });
      }
    } else {
      ctx.api.mostrar(L, null);
    }
  }
  pintar(ctx);
}

function pintar(ctx) {
  const { body } = ctx;
  const v = ctx.vista;
  const q = v.preguntas[v.i];
  const L = leccionDe(ctx, q);
  const hecho = !!v.respuesta;
  const aciertos = v.respuestas.filter((r) => r.resultado !== 'fallo' && !r.saltada).length;
  const enunciado = q.tipo === 'identificar' ? t('estudio.queEstructura') : q.tipo === 'localizar' ? t('bib.localizarPregunta', { nombre: nombreE(L, q.estructura) }) : tr(q.enunciado);
  const pista = q.tipo === 'identificar' ? t(v.cargando ? 'estudio.preparando' : 'estudio.pista') : q.tipo === 'localizar' ? t(v.cargando ? 'estudio.preparando' : 'bib.localizarPista') : q.tipo === 'secuencia' ? t('bib.secuenciaPista') : '';
  body.innerHTML = `
    <button class="link back" data-salir>${icono('chevron')}<span>${esc(t(v.modo === 'evaluacion' ? 'estudio.salirEvaluacion' : 'estudio.salirRepaso'))}</span></button>
    <p class="bib-leccion-t">${esc(v.titulo)}</p>
    <p class="q-count">${esc(t('estudio.pregunta', { i: v.i + 1, n: v.preguntas.length }))} · ${esc(tn('estudio.aciertos', aciertos))}${v.modo !== 'evaluacion' ? ` · ${esc(tr(L.titulo))}` : ''}</p>
    <p class="q-text" tabindex="-1">${esc(enunciado)}</p>
    ${v.saltada ? `<p class="mod-note">${esc(t('bib.saltada'))}</p>` : !hecho && pista ? `<p class="q-hint">${esc(pista)}</p>` : ''}
    ${v.saltada ? '' : cuerpo(L, q, v)}
    ${hecho || v.saltada ? '' : `<label class="q-doubt"><input type="checkbox" id="q-dude" /> ${esc(t('estudio.dudo'))}</label>`}
    <div class="q-feedback" aria-live="polite">${hecho ? feedback(ctx, L, q, v) : ''}</div>
    ${v.saltada ? `<div class="step-nav"><button class="btn primary" data-siguiente>${esc(t(v.i === v.preguntas.length - 1 ? 'estudio.verResultado' : 'estudio.siguiente'))}</button></div>` : ''}`;
  body.querySelector('[data-salir]').addEventListener('click', () => salir(ctx));
  body.querySelectorAll('[data-opt]').forEach((b) => b.addEventListener('click', () => responder(ctx, b.dataset.opt === NO_LO_SE ? NO_LO_SE : Number(b.dataset.opt))));
  body.querySelectorAll('[data-sec]').forEach((b) => b.addEventListener('click', () => { v.orden = [...(v.orden ?? []), b.dataset.sec]; pintar(ctx); }));
  body.querySelector('[data-sec-deshacer]')?.addEventListener('click', () => { v.orden.pop(); pintar(ctx); });
  body.querySelector('[data-sec-ok]')?.addEventListener('click', () => responder(ctx, v.orden));
  body.querySelector('[data-siguiente]')?.addEventListener('click', () => siguiente(ctx));
  body.querySelector('[data-volver-paso]')?.addEventListener('click', () => volverAlPaso(ctx, q));
  body.querySelector('[data-ver3d]')?.addEventListener('click', () => ctx.api.resaltar(L, q.estructuras.length ? q.estructuras : [], { lado: v.lado ?? 'R' }));
  requestAnimationFrame(() => body.querySelector(hecho ? '.q-result' : '.q-text')?.focus({ preventScroll: false }));
}

function cuerpo(L, q, v) {
  const hecho = !!v.respuesta;
  if (q.tipo === 'localizar') {
    return hecho ? '' : `<div class="q-opts"><button class="opt idk" data-opt="${NO_LO_SE}" ${v.cargando ? 'disabled' : ''}><kbd>5</kbd><span>${esc(t('estudio.noLoSe'))}</span></button></div>`;
  }
  if (q.tipo === 'secuencia') {
    const orden = v.orden ?? [];
    const quedan = q.elementos.filter((x) => !orden.includes(x));
    if (hecho) return `<ol class="bib-orden-r">${q.correcto.map((x, k) => `<li class="${v.respuesta.valor?.[k] === x ? 'ok' : 'bad'}">${esc(tr(x))}</li>`).join('')}</ol>`;
    return `<ol class="bib-orden-r">${orden.map((x) => `<li>${esc(tr(x))}</li>`).join('')}</ol>
      <div class="q-opts">${quedan.map((x) => `<button class="opt" data-sec="${esc(x)}"><span>${esc(tr(x))}</span></button>`).join('')}</div>
      <div class="bib-acciones">${orden.length ? `<button class="btn" data-sec-deshacer>${esc(t('bib.deshacer'))}</button>` : ''}
        <button class="btn primary" data-sec-ok ${quedan.length ? 'disabled' : ''}>${esc(t('bib.comprobar'))}</button>
        <button class="btn" data-opt="${NO_LO_SE}">${esc(t('estudio.noLoSe'))}</button></div>`;
  }
  return `<div class="q-opts" role="group" aria-label="${esc(t('estudio.respuestas'))}">
    ${q.opciones.map((o, k) => {
      const cls = hecho ? (o.correcta ? 'ok' : v.respuesta.valor === k ? 'bad' : '') : '';
      return `<button class="opt ${cls}" data-opt="${k}" ${hecho || v.cargando ? 'disabled' : ''}><kbd>${k + 1}</kbd><span>${esc(tr(o.texto))}</span>${hecho && o.correcta ? icono('check') : hecho && v.respuesta.valor === k ? icono('wrong') : ''}</button>`;
    }).join('')}
    <button class="opt idk ${hecho && v.respuesta.valor === NO_LO_SE ? 'bad' : ''}" data-opt="${NO_LO_SE}" ${hecho || v.cargando ? 'disabled' : ''}><kbd>5</kbd><span>${esc(t('estudio.noLoSe'))}</span></button>
  </div>`;
}

function feedback(ctx, L, q, v) {
  const r = v.respuesta.resultado;
  const correcta = q.tipo === 'secuencia' ? q.correcto.map(tr).join(' → ') : tr(q.respuesta ?? '');
  const expl = q.explicacion ? tr(q.explicacion) : q.tipo === 'identificar' || q.tipo === 'localizar' ? t('bib.explIdentificar', { nombre: nombreE(L, q.estructura) }) : '';
  const paso = L.pasos.find((p) => p.id === q.paso);
  return `
    <p class="q-result ${r}" tabindex="-1">${r === 'fallo' ? t('estudio.fallo', { respuesta: `<b>${esc(correcta)}</b>` }) : esc(t(r === 'duda' ? 'estudio.duda' : 'estudio.correcto'))}</p>
    ${expl ? `<p class="q-expl">${esc(expl)}</p>` : ''}
    ${htmlFuentes(ctx, q.evidencia ?? [], L)}
    <div class="step-nav">
      ${paso ? `<button class="btn" data-volver-paso>${esc(t('bib.volverPaso', { paso: tr(paso.titulo) }))}</button>` : ''}
      ${q.estructuras?.length ? `<button class="btn" data-ver3d>${esc(t('estudio.ver3d'))}</button>` : ''}
      <button class="btn primary" data-siguiente>${esc(t(v.i === v.preguntas.length - 1 ? 'estudio.verResultado' : 'estudio.siguiente'))}</button>
    </div>`;
}

function responder(ctx, valor) {
  const v = ctx.vista;
  if (v.tipo !== 'preguntas' || v.respuesta || v.cargando || v.saltada) return;
  const q = v.preguntas[v.i];
  const dude = !!ctx.body.querySelector('#q-dude')?.checked;
  const resultado = corregir(q, valor, { dude });
  v.respuesta = { valor, resultado };
  v.respuestas.push({ pregunta: q, resultado });
  P.anotar(ctx.data, q.item, resultado);
  ctx.guardar();
  ctx.api.alTocar(null);
  ctx.api.modoEvaluacion(false);                       // ya respondida: el nombre puede verse
  const L = leccionDe(ctx, q);
  if (q.tipo === 'identificar' || q.tipo === 'localizar') ctx.api.resaltar(L, [q.estructura], { lado: v.lado ?? 'R', sinCamara: true });
  pintar(ctx);
}

function siguiente(ctx) {
  const v = ctx.vista;
  if (v.saltada) v.respuestas.push({ pregunta: v.preguntas[v.i], resultado: null, saltada: true });
  if (v.i < v.preguntas.length - 1) {
    ctx.vista = { ...v, i: v.i + 1, respuesta: null, preparada: false, saltada: false, orden: null, lado: null };
    return renderPreguntas(ctx);
  }
  ctx.api.alTocar(null);
  ctx.api.modoEvaluacion(false);
  const contadas = v.respuestas.filter((r) => !r.saltada);
  const aciertos = contadas.filter((r) => r.resultado !== 'fallo').length;
  let demostrada = null;
  let objetivos = null;
  if (v.modo === 'evaluacion') {
    const L = ctx.lecciones.get(v.leccion);
    objetivos = porObjetivo(L, contadas);
    demostrada = P.registrarEvaluacion(ctx.data, L, { aciertos, total: contadas.length, porObjetivo: objetivos });
  }
  P.registrarSesion(ctx.data, { fecha: Date.now(), tipo: v.modo, aciertos, total: contadas.length });
  ctx.guardar();
  ctx.ir({ tipo: 'resultado', modo: v.modo, leccion: v.leccion, titulo: v.titulo, aciertos, total: contadas.length, saltadas: v.respuestas.length - contadas.length, objetivos, demostrada, fallos: contadas.filter((r) => r.resultado === 'fallo').map((r) => r.pregunta), vuelta: v.vuelta }, { reemplazar: true });
}

function volverAlPaso(ctx, q) {
  ctx.api.alTocar(null);
  ctx.api.modoEvaluacion(false);
  const L = leccionDe(ctx, q);
  const k = L.pasos.findIndex((p) => p.id === q.paso);
  // Desde una evaluación a medias se vuelve a la pregunta siguiente con «Volver» (la evaluación queda en la pila).
  ctx.ir({ tipo: 'leccion', id: L.id, paso: Math.max(0, k) });
}

function salir(ctx) {
  ctx.api.alTocar(null);
  ctx.api.modoEvaluacion(false);
  ctx.vista = ctx.vista.vuelta ?? { tipo: 'portada' };
  ctx.render();
}

export function renderResultado(ctx) {
  const { body } = ctx;
  const v = ctx.vista;
  const L = v.leccion && ctx.lecciones.get(v.leccion);
  const pct = v.total ? Math.round((100 * v.aciertos) / v.total) : 0;
  const sesion = siguienteDeSesion(ctx);
  const fallosPorLeccion = [...new Map(v.fallos.map((q) => [`${q.leccion}/${q.paso}`, q])).values()];
  body.innerHTML = `
    <button class="link back" data-salir>${icono('chevron')}<span>${esc(t('bib.biblioteca'))}</span></button>
    <p class="bib-leccion-t">${esc(v.titulo)}</p>
    <h3 class="step-title" tabindex="-1">${esc(t(v.modo === 'evaluacion' ? 'estudio.resultado' : 'estudio.repasoTerminado'))}</h3>
    <p class="score">${t('estudio.puntuacion', { a: `<b>${v.aciertos}</b>`, b: v.total })} <small>(${pct} %)</small></p>
    ${v.saltadas ? `<p class="muted small">${esc(tn('bib.saltadas', v.saltadas))}</p>` : ''}
    ${v.modo === 'evaluacion' ? `
      <p class="bib-veredicto ${v.demostrada ? 'ok' : ''}">${icono(v.demostrada ? 'check' : 'info')}<span>${esc(t(v.demostrada ? 'bib.demostradaSi' : 'bib.demostradaNo'))}</span></p>
      <h4>${esc(t('bib.porObjetivo2'))}</h4>
      <ul class="bib-objetivos">${L.objetivos.map((o, k) => {
        const [a, n] = v.objetivos[k] ?? [0, 0];
        return n ? `<li class="${a === n ? 'ok' : a ? '' : 'bad'}"><span>${esc(tr(o))}</span><b>${a}/${n}</b></li>` : '';
      }).join('')}</ul>
      <p class="muted small">${esc(t('bib.dominioExplica'))}</p>` : `<p class="muted small">${esc(t('bib.repasoExplica'))}</p>`}
    ${fallosPorLeccion.length ? `<h4>${esc(t('bib.repasaEstos'))}</h4><ul class="step-structs">${fallosPorLeccion.map((q) => {
      const Lq = ctx.lecciones.get(q.leccion);
      const paso = Lq.pasos.find((p) => p.id === q.paso);
      const varias = new Set(v.fallos.map((x) => x.leccion)).size > 1;
      return `<li><button data-paso-de="${esc(q.leccion)}" data-paso-id="${esc(q.paso)}"><span>${esc(tr(paso?.titulo ?? Lq.titulo))}${varias ? ` <small>· ${esc(tr(Lq.titulo))}</small>` : ''}</span>${icono('chevron')}</button></li>`;
    }).join('')}</ul><p class="muted small">${esc(t('estudio.volveran'))}</p>` : `<p class="muted">${esc(t('estudio.sinFallos'))}</p>`}
    <div class="bib-acciones bib-col">
      ${sesion ? `<button class="btn primary" data-sesion>${esc(sesion)}</button>` : ''}
      ${v.fallos.length ? `<button class="btn ${sesion ? '' : 'primary'}" data-rep-fallos>${esc(t('bib.repasarFallos', { n: v.fallos.length }))}</button>` : ''}
      ${L ? `<button class="btn" data-info>${esc(t('bib.volverLeccion'))}</button>` : ''}
    </div>`;
  body.querySelector('[data-salir]').addEventListener('click', () => { ctx.vista = { tipo: 'portada' }; ctx.pila = []; ctx.render(); });
  body.querySelector('[data-sesion]')?.addEventListener('click', () => avanzarSesion(ctx));
  body.querySelector('[data-rep-fallos]')?.addEventListener('click', () => {
    const lecciones = [...new Set(v.fallos.map((q) => q.leccion))];
    empezarPractica(ctx, 'errores', { lecciones, titulo: v.titulo });
  });
  body.querySelector('[data-info]')?.addEventListener('click', () => ctx.ir({ tipo: 'info', id: L.id }));
  body.querySelectorAll('[data-paso-de]').forEach((b) => b.addEventListener('click', async () => {
    const Lq = ctx.lecciones.get(b.dataset.pasoDe);
    await abrirLeccion(ctx, Lq.id, { paso: Math.max(0, Lq.pasos.findIndex((p) => p.id === b.dataset.pasoId)) });
  }));
  requestAnimationFrame(() => body.querySelector('.step-title')?.focus());
}

// Teclas en las preguntas: 1–4 responden, 5 = «No lo sé», Intro = siguiente.
export function teclaPreguntas(ctx, e) {
  const v = ctx.vista;
  if (e.target.matches?.('input, textarea, select')) return false;
  const q = v.preguntas[v.i];
  if (!v.respuesta && !v.cargando && !v.saltada && /^[1-5]$/.test(e.key)) {
    const k = Number(e.key);
    if (k === 5) responder(ctx, NO_LO_SE);
    else if (q.opciones && k <= q.opciones.length) responder(ctx, k - 1);
    return true;
  }
  if ((v.respuesta || v.saltada) && e.key === 'Enter' && !e.target.closest?.('button')) { siguiente(ctx); return true; }
  return false;
}
