// Panel «Estudiar»: módulos, lección guiada, evaluación sin etiquetas, resultado y repaso.
// El visor lo controla main.js a través de `api`:
//   api.mostrar(ids, { quiz, contexto }) → muestra esas fichas (un lado) con el esqueleto; en modo evaluación, sin nombre
//   api.abrirFicha(id)                   → selecciona la estructura y abre su ficha
//   api.modoEvaluacion(on)               → oculta (o vuelve a mostrar) etiqueta, ficha, texto al pasar el ratón y buscador
//   api.modelo()                         → 'male' | 'female'
import { uiIcon } from './icons.js';
import { FUENTES } from '../content/fuentes.js';
import * as P from '../study/progress.js';
import { evaluacion, repaso, corregir, NO_LO_SE } from '../study/quiz.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const fecha = (t) => new Date(t).toLocaleDateString('es', { day: 'numeric', month: 'short' });
const fuenteTexto = (ids) => [].concat(ids).map((k) => FUENTES[k]).filter(Boolean)
  .map((f) => `<a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.texto)}</a>`).join('; ');

export function createStudy({ body, modulos, storage, api, toast }) {
  let data = P.cargar(storage);
  let vista = { tipo: 'inicio' };       // inicio | leccion | quiz | resultado
  const mod = (id) => modulos.find((m) => m.id === id);
  const guardar = () => { if (!P.guardar(storage, data)) toast('No se pudo guardar el progreso en este navegador'); };
  const fichaNombre = (m, id) => m.estructuras.find((f) => f.id === id)?.nombre ?? id;

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
      const paso = r.leccion.completada ? 'completada' : r.leccion.paso ? `paso ${r.leccion.paso + 1} de ${m.leccion.length}` : 'sin empezar';
      return `
      <article class="mod" data-mod="${m.id}">
        <h3>${esc(m.titulo)}</h3>
        <p class="mod-meta">${m.nucleo.length} estructuras evaluables · ${m.leccion.length} pasos · <span class="review-badge ${m.revision.estado}">Borrador · sin revisar por un especialista</span></p>
        <details class="mod-goals"><summary>Objetivos</summary><ul>${m.objetivos.map((o) => `<li>${esc(o)}</li>`).join('')}</ul>
          <p class="muted small">Público supuesto: ${esc(m.publico)}.</p></details>
        ${cambiado ? '<p class="mod-note">El contenido del módulo cambió desde tu último intento: se conserva el progreso de las estructuras que siguen en él.</p>' : ''}
        <dl class="mod-stats">
          <dt>Lección</dt><dd>${esc(paso)}</dd>
          <dt>Última evaluación</dt><dd>${r.ultimo ? `${r.ultimo.aciertos} de ${r.ultimo.total} <small>(${fecha(r.ultimo.fecha)}; rendimiento reciente)</small>` : 'ninguna'}</dd>
          <dt>Dominio</dt><dd>${r.dominadas} de ${r.total} estructuras <small>(acertadas varias veces, en días distintos)</small></dd>
          <dt>Repaso</dt><dd>${r.pendientes ? `${r.pendientes} pendiente${r.pendientes === 1 ? '' : 's'}` : r.vistas ? 'al día' : 'tras la primera evaluación'}</dd>
        </dl>
        <div class="mod-actions">
          <button class="btn primary" data-go="leccion">${r.leccion.completada ? 'Repetir lección' : r.leccion.paso ? 'Seguir lección' : 'Empezar lección'}</button>
          <button class="btn" data-go="evaluacion">Evaluación</button>
          <button class="btn" data-go="repaso" ${r.pendientes ? '' : 'disabled'}>Repasar${r.pendientes ? ` (${r.pendientes})` : ''}</button>
        </div>
        <p class="mod-foot">El progreso se guarda solo en este navegador; si borras sus datos, se pierde.
          <button class="link" data-go="reiniciar">Reiniciar la lección</button> ·
          <button class="link" data-go="borrar">Borrar el progreso del módulo</button></p>
        <div class="mod-confirm" hidden>
          <p>¿Borrar evaluaciones, repasos y lección de este módulo? No se puede deshacer.</p>
          <button class="btn danger" data-go="borrar-si">Borrar</button> <button class="btn" data-go="borrar-no">Cancelar</button>
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
      if (go === 'reiniciar') { P.reiniciarLeccion(pm); guardar(); toast('Lección reiniciada (evaluaciones y repasos intactos)'); render(); }
      if (go === 'borrar') { b.closest('[data-mod]').querySelector('.mod-confirm').hidden = false; focus('.mod-confirm .danger'); }
      if (go === 'borrar-no') { b.closest('.mod-confirm').hidden = true; }
      if (go === 'borrar-si') { P.borrarModulo(data, m.id); guardar(); toast('Progreso del módulo borrado'); render(); }
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
      <button class="link back" data-go="inicio">${uiIcon('chevron')}<span>${esc(m.titulo.split(':')[0])}</span></button>
      <p class="step-count">Paso ${paso + 1} de ${m.leccion.length}</p>
      <h3 class="step-title" tabindex="-1">${esc(s.titulo)}</h3>
      <p class="step-text">${esc(s.texto)}</p>
      <ul class="step-structs">${s.fichas.map((id) => `<li><button data-ficha="${id}">${esc(fichaNombre(m, id))}${uiIcon('chevron')}</button></li>`).join('')}</ul>
      <p class="step-src">Fuente: ${fuenteTexto(s.fuentes)}</p>
      <div class="step-nav">
        <button class="btn" data-go="prev" ${paso ? '' : 'disabled'}>Anterior</button>
        <button class="btn primary" data-go="${ultimo ? 'fin' : 'next'}">${ultimo ? 'Terminar la lección' : 'Siguiente'}</button>
      </div>`;
    body.querySelectorAll('[data-ficha]').forEach((b) => b.addEventListener('click', () => api.abrirFicha(b.dataset.ficha)));
    body.querySelector('[data-go="inicio"]').addEventListener('click', () => { vista = { tipo: 'inicio' }; render(); });
    body.querySelector('[data-go="prev"]').addEventListener('click', () => { vista.paso--; mostrarPaso(); });
    body.querySelector('[data-go="next"]')?.addEventListener('click', () => { vista.paso++; mostrarPaso(); });
    body.querySelector('[data-go="fin"]')?.addEventListener('click', () => {
      const pm = P.modulo(data, m);
      pm.leccion = { paso: 0, completada: true, fecha: Date.now() };
      guardar();
      toast('Lección terminada');
      vista = { tipo: 'inicio' };
      render();
    });
    focus('.step-title');
  }

  // ── Evaluación y repaso ──
  function empezar(m, tipo, preguntas) {
    if (!preguntas.length) return toast('No hay preguntas pendientes');
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
      if (!ok && vista.tipo === 'quiz') toast('No se pudo mostrar la estructura; puedes responder «No lo sé» o salir');
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
      <button class="link back" data-go="salir">${uiIcon('chevron')}<span>Salir (${vista.modo === 'repaso' ? 'repaso' : 'evaluación'})</span></button>
      <p class="q-count">Pregunta ${i + 1} de ${preguntas.length} · ${vista.aciertos} acierto${vista.aciertos === 1 ? '' : 's'}</p>
      <p class="q-text" tabindex="-1">${esc(q.enunciado)}</p>
      ${q.tipo === 'identificar' && !hecho ? `<p class="q-hint">${vista.cargando ? 'Preparando la vista…' : 'Puedes girar y acercar el modelo. El nombre no aparece hasta que respondas.'}</p>` : ''}
      <div class="q-opts" role="group" aria-label="Respuestas">
        ${q.opciones.map((o, k) => {
          const cls = hecho ? (o.correcta ? 'ok' : respuesta.opcion === k ? 'bad' : '') : '';
          return `<button class="opt ${cls}" data-opt="${k}" ${hecho ? 'disabled' : ''}><kbd>${k + 1}</kbd><span>${esc(o.texto)}</span>${hecho && o.correcta ? uiIcon('check') : hecho && respuesta.opcion === k ? uiIcon('wrong') : ''}</button>`;
        }).join('')}
        <button class="opt idk ${hecho && respuesta.opcion === NO_LO_SE ? 'bad' : ''}" data-opt="${NO_LO_SE}" ${hecho ? 'disabled' : ''}><kbd>5</kbd><span>No lo sé</span></button>
      </div>
      ${hecho ? '' : '<label class="q-doubt"><input type="checkbox" id="q-dude" /> No estoy seguro de mi respuesta</label>'}
      <div class="q-feedback" aria-live="polite">${hecho ? `
        <p class="q-result ${respuesta.resultado}" tabindex="-1">${respuesta.resultado === 'fallo' ? `No. La respuesta es: <b>${esc(q.opciones.find((o) => o.correcta).texto)}</b>.` : respuesta.resultado === 'duda' ? 'Correcto (marcado con duda: volverá antes al repaso).' : 'Correcto.'}</p>
        <p class="q-expl">${esc(q.explicacion)}</p>
        <p class="step-src">Fuente: ${fuenteTexto(q.fuente ?? m.estructuras.find((f) => f.id === q.ficha).fuentes.contenido.map((c) => c.fuente))}</p>
        <div class="step-nav">
          <button class="btn" data-go="ver">Ver en 3D</button>
          <button class="btn primary" data-go="next">${i === preguntas.length - 1 ? 'Ver resultado' : 'Siguiente'}</button>
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
      <button class="link back" data-go="inicio">${uiIcon('chevron')}<span>${esc(m.titulo.split(':')[0])}</span></button>
      <h3 class="step-title" tabindex="-1">${modo === 'repaso' ? 'Repaso terminado' : 'Resultado'}</h3>
      <p class="score"><b>${aciertos}</b> de ${preguntas.length}</p>
      <dl class="mod-stats">
        <dt>Este intento</dt><dd>${Math.round((aciertos / preguntas.length) * 100)} % <small>(rendimiento reciente)</small></dd>
        <dt>Dominio</dt><dd>${r.dominadas} de ${r.total} estructuras <small>(se consolida al acertar en días distintos)</small></dd>
      </dl>
      ${repasar.length ? `<h4>Para repasar</h4><ul class="step-structs">${repasar.map((id) => `<li><button data-ficha="${id}">${esc(fichaNombre(m, id))}${uiIcon('chevron')}</button></li>`).join('')}</ul>
        <p class="muted small">Volverán antes al repaso. Las acertadas con duda no avanzan.</p>` : '<p class="muted">Sin fallos en este intento.</p>'}
      <div class="step-nav"><button class="btn primary" data-go="inicio">Volver al módulo</button></div>`;
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
    cerrar() { if (vista.tipo === 'quiz') salir(); },
    enEvaluacion: () => vista.tipo === 'quiz' && !vista.respuesta,
    onKey,
  };
}
