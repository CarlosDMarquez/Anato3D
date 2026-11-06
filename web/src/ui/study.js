// Panel «Estudiar»: módulos, lección guiada, evaluación sin etiquetas, resultado y repaso.
// El visor lo controla main.js a través de `api`:
//   api.mostrar(ids, { quiz, contexto }) → muestra esas fichas (un lado) con el esqueleto; en modo evaluación, sin nombre
//   api.abrirFicha(id)                   → selecciona la estructura y abre su ficha
//   api.modoEvaluacion(on)               → oculta (o vuelve a mostrar) etiqueta, ficha, texto al pasar el ratón y buscador
//   api.modelo()                         → 'male' | 'female'
import { uiIcon } from './icons.js';
import { FUENTES } from '../content/fuentes.js';
import { ESTADOS } from '../content/schema.js';
import * as P from '../study/progress.js';
import { evaluacion, repaso, corregir, NO_LO_SE } from '../study/quiz.js';
import { t, tn, idioma, etiqueta } from '../i18n/idioma.js';
import { tr, trCita } from '../i18n/contenido.js';

// Los textos del módulo (content/) están en español y se muestran traducidos con tr(); los de la interfaz, con t().
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const fecha = (ms) => new Date(ms).toLocaleDateString(idioma(), { day: 'numeric', month: 'short' });
const etiquetaEstado = (estado) => etiqueta(ESTADOS[estado] ?? estado);
const fuenteTexto = (ids) => [].concat(ids).map((k) => FUENTES[k]).filter(Boolean)
  .map((f) => `<a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(trCita(f.texto))}</a>`).join('; ');

export function createStudy({ body, modulos, storage, api, toast }) {
  let data = P.cargar(storage);
  let vista = { tipo: 'inicio' };       // inicio | leccion | quiz | resultado
  const mod = (id) => modulos.find((m) => m.id === id);
  const guardar = () => { if (!P.guardar(storage, data)) toast(t('estudio.noGuardado')); };
  const fichaNombre = (m, id) => tr(m.estructuras.find((f) => f.id === id)?.nombre ?? id);
  const titulo = (m) => tr(m.titulo).split(':')[0];

  function render() {
    if (vista.tipo === 'leccion') return renderLeccion();
    if (vista.tipo === 'quiz') return renderPregunta();
    if (vista.tipo === 'resultado') return renderResultado();
    return renderInicio();
  }

  function focus(sel) {
    requestAnimationFrame(() => body.querySelector(sel)?.focus({ preventScroll: false }));
  }

  // ── Portada: módulos con su progreso ──
  function renderInicio() {
    api.modoEvaluacion(false);
    body.innerHTML = modulos.map((m) => {
      const pm = P.modulo(data, m);
      const r = P.resumen(pm, m);
      const cambiado = P.contenidoCambiado(data, m);
      const paso = r.leccion.completada ? t('estudio.completada') : r.leccion.paso ? t('estudio.pasoDe', { n: r.leccion.paso + 1, total: m.leccion.length }) : t('estudio.sinEmpezar');
      return `
      <article class="mod" data-mod="${m.id}">
        <h3>${esc(tr(m.titulo))}</h3>
        <p class="mod-meta">${esc(t('estudio.meta', { n: m.nucleo.length, k: m.leccion.length }))} · <span class="review-badge ${m.revision.estado}">${esc(etiquetaEstado(m.revision.estado))}</span></p>
        <details class="mod-goals"><summary>${esc(t('estudio.objetivos'))}</summary><ul>${m.objetivos.map((o) => `<li>${esc(tr(o))}</li>`).join('')}</ul>
          <p class="muted small">${esc(t('estudio.publico', { publico: tr(m.publico) }))}</p></details>
        ${cambiado ? `<p class="mod-note">${esc(t('estudio.cambiado'))}</p>` : ''}
        <dl class="mod-stats">
          <dt>${esc(t('estudio.leccion'))}</dt><dd>${esc(paso)}</dd>
          <dt>${esc(t('estudio.ultima'))}</dt><dd>${r.ultimo ? `${esc(t('estudio.aDeB', { a: r.ultimo.aciertos, b: r.ultimo.total }))} <small>${esc(t('estudio.reciente', { fecha: fecha(r.ultimo.fecha) }))}</small>` : esc(t('estudio.ninguna'))}</dd>
          <dt>${esc(t('estudio.dominio'))}</dt><dd>${esc(t('estudio.dominioValor', { a: r.dominadas, b: r.total }))} <small>${esc(t('estudio.dominioNota'))}</small></dd>
          <dt>${esc(t('estudio.repaso'))}</dt><dd>${esc(r.pendientes ? tn('estudio.pendientes', r.pendientes) : r.vistas ? t('estudio.alDia') : t('estudio.trasPrimera'))}</dd>
        </dl>
        <div class="mod-actions">
          <button class="btn primary" data-go="leccion">${esc(t(r.leccion.completada ? 'estudio.repetir' : r.leccion.paso ? 'estudio.seguir' : 'estudio.empezar'))}</button>
          <button class="btn" data-go="evaluacion">${esc(t('estudio.evaluacion'))}</button>
          <button class="btn" data-go="repaso" ${r.pendientes ? '' : 'disabled'}>${esc(t('estudio.repasar'))}${r.pendientes ? ` (${r.pendientes})` : ''}</button>
        </div>
        <p class="mod-foot">${esc(t('estudio.progresoLocal'))}
          <button class="link" data-go="reiniciar">${esc(t('estudio.reiniciar'))}</button> ·
          <button class="link" data-go="borrar">${esc(t('estudio.borrar'))}</button></p>
        <div class="mod-confirm" hidden>
          <p>${esc(t('estudio.borrarPregunta'))}</p>
          <button class="btn danger" data-go="borrar-si">${esc(t('estudio.borrarSi'))}</button> <button class="btn" data-go="borrar-no">${esc(t('estudio.cancelar'))}</button>
        </div>
      </article>`;
    }).join('');
    body.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => {
      const m = mod(b.closest('[data-mod]').dataset.mod);
      const pm = P.modulo(data, m);
      const go = b.dataset.go;
      if (go === 'leccion') { vista = { tipo: 'leccion', m, paso: pm.leccion.completada ? 0 : pm.leccion.paso }; mostrarPaso(); }
      if (go === 'evaluacion') empezar(m, 'evaluacion', evaluacion(m));
      if (go === 'repaso') empezar(m, 'repaso', repaso(m, P.colaRepaso(pm, [...m.nucleo, ...m.contexto])));
      if (go === 'reiniciar') { P.reiniciarLeccion(pm); guardar(); toast(t('estudio.reiniciada')); render(); }
      if (go === 'borrar') { b.closest('[data-mod]').querySelector('.mod-confirm').hidden = false; focus('.mod-confirm .danger'); }
      if (go === 'borrar-no') { b.closest('.mod-confirm').hidden = true; }
      if (go === 'borrar-si') { P.borrarModulo(data, m.id); guardar(); toast(t('estudio.borrado')); render(); }
    }));
  }

  // ── Lección guiada ──
  function mostrarPaso() {
    const { m, paso } = vista;
    const pm = P.modulo(data, m);
    pm.leccion.paso = paso;
    guardar();
    render();
    api.mostrar(m.leccion[paso].fichas, { quiz: false });
  }

  function renderLeccion() {
    api.modoEvaluacion(false);
    const { m, paso } = vista;
    const s = m.leccion[paso];
    const ultimo = paso === m.leccion.length - 1;
    body.innerHTML = `
      <button class="link back" data-go="inicio">${uiIcon('chevron')}<span>${esc(titulo(m))}</span></button>
      <p class="step-count">${esc(t('estudio.paso', { n: paso + 1, total: m.leccion.length }))}</p>
      <h3 class="step-title" tabindex="-1">${esc(tr(s.titulo))}</h3>
      <p class="step-text">${esc(tr(s.texto))}</p>
      <ul class="step-structs">${s.fichas.map((id) => `<li><button data-ficha="${id}">${esc(fichaNombre(m, id))}${uiIcon('chevron')}</button></li>`).join('')}</ul>
      <p class="step-src">${esc(t('estudio.fuente'))} ${fuenteTexto(s.fuentes)}</p>
      <div class="step-nav">
        <button class="btn" data-go="prev" ${paso ? '' : 'disabled'}>${esc(t('estudio.anterior'))}</button>
        <button class="btn primary" data-go="${ultimo ? 'fin' : 'next'}">${esc(t(ultimo ? 'estudio.terminar' : 'estudio.siguiente'))}</button>
      </div>`;
    body.querySelectorAll('[data-ficha]').forEach((b) => b.addEventListener('click', () => api.abrirFicha(b.dataset.ficha)));
    body.querySelector('[data-go="inicio"]').addEventListener('click', () => { vista = { tipo: 'inicio' }; render(); });
    body.querySelector('[data-go="prev"]').addEventListener('click', () => { vista.paso--; mostrarPaso(); });
    body.querySelector('[data-go="next"]')?.addEventListener('click', () => { vista.paso++; mostrarPaso(); });
    body.querySelector('[data-go="fin"]')?.addEventListener('click', () => {
      const pm = P.modulo(data, m);
      pm.leccion = { paso: 0, completada: true, fecha: Date.now() };
      guardar();
      toast(t('estudio.terminada'));
      vista = { tipo: 'inicio' };
      render();
    });
    focus('.step-title');
  }

  // ── Evaluación y repaso ──
  function empezar(m, tipo, preguntas) {
    if (!preguntas.length) return toast(t('estudio.sinPreguntas'));
    vista = { tipo: 'quiz', m, modo: tipo, preguntas, i: 0, respuesta: null, aciertos: 0, fallos: [] };
    prepararPregunta();
  }

  async function prepararPregunta() {
    const q = vista.preguntas[vista.i];
    vista.respuesta = null;
    api.modoEvaluacion(true);
    render();
    if (q.tipo === 'identificar') {
      vista.cargando = true;
      renderPregunta();
      const ok = await api.mostrar([q.ficha], { quiz: true, contexto: [...vista.m.nucleo, ...vista.m.contexto], lado: Math.random() < 0.5 ? 'L' : 'R' });
      vista.cargando = false;
      if (!ok && vista.tipo === 'quiz') toast(t('estudio.noMostrar'));
    } else {
      api.mostrar([], { quiz: true });
    }
    if (vista.tipo === 'quiz') renderPregunta();
  }

  function renderPregunta() {
    const { m, preguntas, i, respuesta } = vista;
    const q = preguntas[i];
    const hecho = respuesta !== null;
    body.innerHTML = `
      <button class="link back" data-go="salir">${uiIcon('chevron')}<span>${esc(t(vista.modo === 'repaso' ? 'estudio.salirRepaso' : 'estudio.salirEvaluacion'))}</span></button>
      <p class="q-count">${esc(t('estudio.pregunta', { i: i + 1, n: preguntas.length }))} · ${esc(tn('estudio.aciertos', vista.aciertos))}</p>
      <p class="q-text" tabindex="-1">${esc(q.tipo === 'identificar' ? t('estudio.queEstructura') : tr(q.enunciado))}</p>
      ${q.tipo === 'identificar' && !hecho ? `<p class="q-hint">${esc(t(vista.cargando ? 'estudio.preparando' : 'estudio.pista'))}</p>` : ''}
      <div class="q-opts" role="group" aria-label="${esc(t('estudio.respuestas'))}">
        ${q.opciones.map((o, k) => {
          const cls = hecho ? (o.correcta ? 'ok' : respuesta.opcion === k ? 'bad' : '') : '';
          return `<button class="opt ${cls}" data-opt="${k}" ${hecho ? 'disabled' : ''}><kbd>${k + 1}</kbd><span>${esc(tr(o.texto))}</span>${hecho && o.correcta ? uiIcon('check') : hecho && respuesta.opcion === k ? uiIcon('wrong') : ''}</button>`;
        }).join('')}
        <button class="opt idk ${hecho && respuesta.opcion === NO_LO_SE ? 'bad' : ''}" data-opt="${NO_LO_SE}" ${hecho ? 'disabled' : ''}><kbd>5</kbd><span>${esc(t('estudio.noLoSe'))}</span></button>
      </div>
      ${hecho ? '' : `<label class="q-doubt"><input type="checkbox" id="q-dude" /> ${esc(t('estudio.dudo'))}</label>`}
      <div class="q-feedback" aria-live="polite">${hecho ? `
        <p class="q-result ${respuesta.resultado}" tabindex="-1">${respuesta.resultado === 'fallo' ? t('estudio.fallo', { respuesta: `<b>${esc(tr(q.opciones.find((o) => o.correcta).texto))}</b>` }) : esc(t(respuesta.resultado === 'duda' ? 'estudio.duda' : 'estudio.correcto'))}</p>
        <p class="q-expl">${esc(tr(q.explicacion))}</p>
        <p class="step-src">${esc(t('estudio.fuente'))} ${fuenteTexto(q.fuente ?? m.estructuras.find((f) => f.id === q.ficha).fuentes.contenido.map((c) => c.fuente))}</p>
        <div class="step-nav">
          <button class="btn" data-go="ver">${esc(t('estudio.ver3d'))}</button>
          <button class="btn primary" data-go="next">${esc(t(i === preguntas.length - 1 ? 'estudio.verResultado' : 'estudio.siguiente'))}</button>
        </div>` : ''}</div>`;
    body.querySelector('[data-go="salir"]').addEventListener('click', salir);
    body.querySelectorAll('[data-opt]').forEach((b) => b.addEventListener('click', () => responder(b.dataset.opt === NO_LO_SE ? NO_LO_SE : Number(b.dataset.opt))));
    body.querySelector('[data-go="ver"]')?.addEventListener('click', () => api.abrirFicha(q.ficha));
    body.querySelector('[data-go="next"]')?.addEventListener('click', siguiente);
    focus(hecho ? '.q-result' : '.q-text');
  }

  function responder(opcion) {
    if (vista.tipo !== 'quiz' || vista.respuesta) return;
    const q = vista.preguntas[vista.i];
    const dude = !!body.querySelector('#q-dude')?.checked;
    const resultado = corregir(q, opcion, { dude });
    vista.respuesta = { opcion, resultado };
    if (resultado !== 'fallo') vista.aciertos++;
    else vista.fallos.push(q);
    P.anotar(P.modulo(data, vista.m), q.ficha, resultado);
    guardar();
    // Ya respondida: el nombre puede verse (etiqueta y ficha).
    api.modoEvaluacion(false);
    if (q.tipo === 'identificar') api.abrirFicha(q.ficha, { sinCamara: true });
    renderPregunta();
  }

  function siguiente() {
    if (vista.i < vista.preguntas.length - 1) { vista.i++; prepararPregunta(); return; }
    const pm = P.modulo(data, vista.m);
    pm.contenido = vista.m.version;
    P.registrarIntento(pm, { fecha: Date.now(), tipo: vista.modo, aciertos: vista.aciertos, total: vista.preguntas.length, fallos: vista.fallos.map((q) => q.id) });
    guardar();
    vista = { ...vista, tipo: 'resultado' };
    render();
  }

  function salir() {
    api.modoEvaluacion(false);
    vista = { tipo: 'inicio' };
    render();
  }

  function renderResultado() {
    api.modoEvaluacion(false);
    const { m, aciertos, preguntas, fallos, modo } = vista;
    const pm = P.modulo(data, m);
    const r = P.resumen(pm, m);
    const repasar = [...new Set(fallos.map((q) => q.ficha))];
    body.innerHTML = `
      <button class="link back" data-go="inicio">${uiIcon('chevron')}<span>${esc(titulo(m))}</span></button>
      <h3 class="step-title" tabindex="-1">${esc(t(modo === 'repaso' ? 'estudio.repasoTerminado' : 'estudio.resultado'))}</h3>
      <p class="score">${t('estudio.puntuacion', { a: `<b>${aciertos}</b>`, b: preguntas.length })}</p>
      <dl class="mod-stats">
        <dt>${esc(t('estudio.esteIntento'))}</dt><dd>${Math.round((aciertos / preguntas.length) * 100)} % <small>${esc(t('estudio.rendimiento'))}</small></dd>
        <dt>${esc(t('estudio.dominio'))}</dt><dd>${esc(t('estudio.dominioValor', { a: r.dominadas, b: r.total }))} <small>${esc(t('estudio.consolida'))}</small></dd>
      </dl>
      ${repasar.length ? `<h4>${esc(t('estudio.paraRepasar'))}</h4><ul class="step-structs">${repasar.map((id) => `<li><button data-ficha="${id}">${esc(fichaNombre(m, id))}${uiIcon('chevron')}</button></li>`).join('')}</ul>
        <p class="muted small">${esc(t('estudio.volveran'))}</p>` : `<p class="muted">${esc(t('estudio.sinFallos'))}</p>`}
      <div class="step-nav"><button class="btn primary" data-go="inicio">${esc(t('estudio.volverModulo'))}</button></div>`;
    body.querySelectorAll('[data-ficha]').forEach((b) => b.addEventListener('click', () => api.abrirFicha(b.dataset.ficha)));
    body.querySelectorAll('[data-go="inicio"]').forEach((b) => b.addEventListener('click', () => { vista = { tipo: 'inicio' }; render(); }));
    focus('.step-title');
  }

  // Teclas en la evaluación: 1–4 responden, 5 = «No lo sé», Intro = siguiente.
  function onKey(e) {
    if (vista.tipo !== 'quiz' || e.target.matches?.('input, textarea')) return false;
    if (!vista.respuesta && /^[1-5]$/.test(e.key)) {
      const k = Number(e.key);
      if (k === 5) responder(NO_LO_SE);
      else if (k <= vista.preguntas[vista.i].opciones.length) responder(k - 1);
      return true;
    }
    if (vista.respuesta && e.key === 'Enter' && !e.target.closest?.('button')) { siguiente(); return true; }
    return false;
  }

  return {
    abrir() { data = P.cargar(storage); if (vista.tipo === 'quiz' && !vista.respuesta) api.modoEvaluacion(true); render(); },
    // Cambio de idioma: rehace la vista actual (sin mover la cámara ni cambiar la pregunta).
    refrescar() { if (body.isConnected && body.closest('.panel.open')) render(); },
    cerrar() { if (vista.tipo === 'quiz') salir(); },
    enEvaluacion: () => vista.tipo === 'quiz' && !vista.respuesta,
    onKey,
  };
}
