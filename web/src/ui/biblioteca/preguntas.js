// Evaluación, repaso y práctica: una pregunta cada vez, sin que nada revele la respuesta (ni etiqueta, ni ficha, ni
// nombre al pasar el ratón, ni buscador) hasta responder. Después, la explicación, la cita de la fuente y el paso de la
// lección al que volver. Las preguntas que no se pueden mostrar en este modelo se saltan y no cuentan.
// Dentro de una sesión con Neuri (`vista.sesion`), un fallo no revela la respuesta a la primera: en identificar y
// localizar se dice qué se señaló y se da una pista (una frase ya verificada del paso donde se enseña, sin el nombre:
// sesion-logica.js) sin mover la cámara; en las de opciones se retira la fallada. Bien al segundo intento cuenta como
// «duda» (con ayuda: no sube de caja); dos fallos, fallo, con la explicación. El bloque vuelve a la sesión con su
// resultado (a la primera, con ayuda, reveladas).
import * as P from '../../biblioteca/progreso.js';
import { mallas, sinPiezasLimitadas } from '../../biblioteca/formato.js';
import { corregir, corregirBreve, porObjetivo, motivoNoDisponible, NO_LO_SE } from '../../biblioteca/evaluar.js';
import { sinonimosDePieza } from '../../content/index.js';
import { t, tn, idioma } from '../../i18n/idioma.js';
import { botonReportar, enlazarReportar } from './reportar.js';
import { tr } from '../../i18n/contenido.js';
import { esc, icono } from './comun.js';
import { htmlFuentes, nombreE } from './leccion.js';
import { abrirLeccion, empezarPractica } from './explorar.js';
import { pistaDe, intentoGuardado } from './sesion-logica.js';
import { anotarPregunta, anotarIntento, terminarBloquePreguntas } from './sesion-neuri.js';

const leccionDe = (ctx, q) => ctx.lecciones.get(q.leccion);
// Las que admiten un segundo intento dentro de una sesión (las de ordenar, no: se corrigen enteras).
const CON_SEGUNDO = new Set(['identificar', 'localizar', 'relacion', 'funcion', 'comparacion']);
/** ¿Puede tener esta respuesta fallada un segundo intento? (en una sesión, la primera vez, y si quedan opciones). */
function admiteSegundo(v, q, valor) {
  if (!v.sesion || v.intento || !CON_SEGUNDO.has(q.tipo)) return false;
  if (q.tipo === 'localizar' || valor?.texto != null) return true;
  // Con opciones: que queden al menos dos después de quitar la fallada («No lo sé» no quita ninguna).
  const quedan = (q.opciones ?? []).length - (Number.isInteger(valor) ? 1 : 0);
  return quedan >= 2;
}
// La lección con la que se muestra y se corrige una pregunta en 3D: sin las piezas que el modelo muestra mal (las de una
// estructura de varias piezas se quitan y el resto sirve; src/data/limitaciones.js).
const leccion3d = (ctx, q) => sinPiezasLimitadas(leccionDe(ctx, q), ctx.api.modelo(), q.tipo);
// «Ver en 3D» al responder: las estructuras de la pregunta que el modelo muestra bien, sin sus piezas limitadas (no se
// enseña como respuesta lo que está fuera de sitio o tiene un nombre dudoso).
function ver3d(ctx, q) {
  const L = sinPiezasLimitadas(leccionDe(ctx, q), ctx.api.modelo(), 'identificar');
  return { L, ids: (q.estructuras ?? []).filter((id) => L.estructuras[id]?.piezas?.length) };
}

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
    // Una pregunta preparada antes (un repaso a medias, otra pestaña) que ahora pide lo que el modelo muestra mal: se
    // salta como las que no se pueden mostrar, con su motivo, y no cuenta.
    const delBanco = L?.preguntas?.find((x) => x.id === q.id);
    if (delBanco && motivoNoDisponible(L, delBanco, ctx.api.modelo()) === 'limitacion') {
      v.saltada = 'limite';
      ctx.api.mostrar(L, null);
      return pintar(ctx);
    }
    // Una sesión reanudada en una pregunta que ya tuvo su primer fallo: sigue en el segundo intento (opción retirada y
    // pista), sin volver a empezar «a la primera».
    if (v.sesion && !v.intento) {
      const g = intentoGuardado(v.sesion.previo, v.i);
      if (g) v.intento = intentoDe(ctx, q, g.quitada);
    }
    // Respuesta breve: en repasos y prácticas, una estructura que ya se reconoció alguna vez se pide escribiendo su
    // nombre (recordar es más exigente que elegir). En las evaluaciones, siempre con opciones (corrección segura).
    v.breve = q.tipo === 'identificar' && v.modo !== 'evaluacion' && (ctx.data.items[q.item]?.aciertos ?? 0) > 0;
    v.cercana = null;
    v.cargando = q.tipo === 'identificar' || q.tipo === 'localizar';
    ctx.api.modoEvaluacion(true);
    pintar(ctx);
    if (v.cargando) {
      // Lado al azar en las estructuras pares: así no se aprende «la de la derecha».
      const lado = L.estructuras[q.estructura]?.lado === 'bilateral' && Math.random() < 0.5 ? 'L' : 'R';
      v.lado = lado;
      const L3 = leccion3d(ctx, q);
      const r = await ctx.api.mostrar(L3, { ...vistaDe(L3, q), lado }, { evaluar: true });
      if (ctx.vista !== v) return;
      v.cargando = false;
      if (!r.ok) v.saltada = true;
      else if (q.tipo === 'localizar') {
        ctx.api.alTocar((pieza) => {
          if (!pieza || v.respuesta) return true;
          const base = pieza.id;
          const hit = q.candidatas.find((id) => mallas(L3.estructuras[id], 'L').includes(base) || mallas(L3.estructuras[id], 'R').includes(base));
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
  // (En un bloque de sesión reanudado, también lo acertado antes de salir.)
  const aciertos = v.respuestas.filter((r) => r.resultado !== 'fallo' && !r.saltada).length + (v.sesion?.previo ? v.sesion.previo.aciertos + v.sesion.previo.conAyuda : 0);
  const enunciado = q.tipo === 'identificar' ? t('estudio.queEstructura') : q.tipo === 'localizar' ? t('bib.localizarPregunta', { nombre: nombreE(L, q.estructura) }) : tr(q.enunciado);
  const pista = q.tipo === 'identificar' ? t(v.cargando ? 'estudio.preparando' : v.breve ? 'bib.breve.pista' : 'estudio.pista') : q.tipo === 'localizar' ? t(v.cargando ? 'estudio.preparando' : 'bib.localizarPista') : q.tipo === 'secuencia' ? t('bib.secuenciaPista') : '';
  const segundo = !!v.intento && !hecho;
  body.innerHTML = `
    <button class="link back" data-salir>${icono('chevron')}<span>${esc(t(v.modo === 'evaluacion' ? 'estudio.salirEvaluacion' : 'estudio.salirRepaso'))}</span></button>
    <p class="bib-leccion-t">${esc(v.titulo)}</p>
    <p class="q-count">${esc(t('estudio.pregunta', { i: v.i + 1, n: v.preguntas.length }))} · ${esc(tn('estudio.aciertos', aciertos))}${v.modo !== 'evaluacion' ? ` · ${esc(tr(L.titulo))}` : ''}</p>
    <p class="q-text" tabindex="-1">${esc(enunciado)}</p>
    ${v.saltada ? `<p class="mod-note">${esc(t(v.saltada === 'limite' ? 'bib.limite.saltada' : 'bib.saltada'))}</p>` : !hecho && !segundo && pista ? `<p class="q-hint">${esc(pista)}</p>` : ''}
    ${v.saltada ? '' : cuerpo(L, q, v)}
    ${hecho || v.saltada || segundo ? '' : `<label class="q-doubt"><input type="checkbox" id="q-dude" /> ${esc(t('estudio.dudo'))}</label>`}
    <div class="q-feedback" aria-live="polite">${hecho ? feedback(ctx, L, q, v) : segundo ? htmlPista(v) : ''}</div>
    ${v.saltada ? `<div class="step-nav"><button class="btn primary" data-siguiente>${esc(t(v.i === v.preguntas.length - 1 ? 'estudio.verResultado' : 'estudio.siguiente'))}</button></div>` : ''}
    <p class="bib-rep-fila">${botonReportar()}</p>`;
  body.querySelector('[data-salir]').addEventListener('click', () => salir(ctx));
  enlazarReportar(body, () => ({ vista: 'pregunta', leccion: q.leccion, version: L?.version ?? null, paso: q.paso ?? null, pregunta: q.id, estructura: q.estructura ?? null, idioma: idioma(), modelo: ctx.api.modelo() }), { alEnviar: ctx.alReportar });
  body.querySelectorAll('[data-opt]').forEach((b) => b.addEventListener('click', () => responder(ctx, b.dataset.opt === NO_LO_SE ? NO_LO_SE : Number(b.dataset.opt))));
  // Respuesta breve: comprobar lo escrito; si se parece pero no coincide, la persona lo compara con la referencia.
  body.querySelector('.q-breve')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = body.querySelector('#q-breve-in').value.trim();
    if (!texto || v.cargando) return;
    const nombre = nombreE(L, q.estructura);
    const piezas = L.estructuras[q.estructura]?.piezas ?? [];
    const aceptadas = [nombre, L.estructuras[q.estructura]?.nombre, ...piezas.flatMap((pz) => sinonimosDePieza(pz, ctx.api.modelo()))].filter(Boolean);
    const otras = Object.keys(L.estructuras).filter((id) => id !== q.estructura).map((id) => nombreE(L, id));
    const r = corregirBreve(texto, { aceptadas, otras });
    if (r.resultado === 'ambigua') {
      // Vale para dos estructuras: no se corrige; se pide el nombre completo.
      const aviso = body.querySelector('.q-breve-aviso');
      aviso.textContent = t('bib.breve.ambigua', { texto });   // sin decir cuáles: sería una pista
      aviso.hidden = false;
      body.querySelector('#q-breve-in').focus();
      return;
    }
    if (r.resultado === 'cercana') { v.cercana = { texto }; pintar(ctx); return; }
    responder(ctx, { texto }, { resultado: r.resultado, elegida: r.confundida ?? texto });
  });
  body.querySelector('[data-ver-opciones]')?.addEventListener('click', () => { v.breve = false; v.ayuda = 'opciones'; pintar(ctx); });
  body.querySelector('[data-cercana-si]')?.addEventListener('click', () => responder(ctx, { texto: v.cercana.texto }, { resultado: 'duda', elegida: v.cercana.texto, autoevaluada: true }));
  body.querySelector('[data-cercana-no]')?.addEventListener('click', () => responder(ctx, { texto: v.cercana.texto }, { resultado: 'fallo', elegida: v.cercana.texto, autoevaluada: true }));
  body.querySelectorAll('[data-sec]').forEach((b) => b.addEventListener('click', () => { v.orden = [...(v.orden ?? []), b.dataset.sec]; pintar(ctx); }));
  body.querySelector('[data-sec-deshacer]')?.addEventListener('click', () => { v.orden.pop(); pintar(ctx); });
  body.querySelector('[data-sec-ok]')?.addEventListener('click', () => responder(ctx, v.orden));
  body.querySelector('[data-siguiente]')?.addEventListener('click', () => siguiente(ctx));
  body.querySelector('[data-volver-paso]')?.addEventListener('click', () => volverAlPaso(ctx, q));
  body.querySelector('[data-ver3d]')?.addEventListener('click', () => { const x = ver3d(ctx, q); ctx.api.resaltar(x.L, x.ids, { lado: v.lado ?? 'R' }); });
  // Neuri, solo con la pregunta ya respondida (antes podría revelar la respuesta); «Volver» deja esta pregunta igual.
  body.querySelector('[data-preguntar-neuri]')?.addEventListener('click', () => {
    ctx.api.alTocar(null);
    ctx.neuri.abrirEn({ enfoque: { leccion: q.leccion, paso: q.paso ?? null, sesion: !!v.sesion }, volver: t('ses.volverPregunta') });
  });
  requestAnimationFrame(() => body.querySelector(hecho ? '.q-result' : v.cercana ? '.q-cercana' : segundo ? '.q-pista' : v.breve && !v.cargando ? '#q-breve-in' : '.q-text')?.focus({ preventScroll: false }));
}

function cuerpo(L, q, v) {
  const hecho = !!v.respuesta;
  if (q.tipo === 'identificar' && (v.breve || v.respuesta?.valor?.texto != null)) {
    if (hecho) return `<p class="q-escrita">${esc(t('bib.breve.escribiste', { texto: v.respuesta.valor.texto }))}</p>`;
    if (v.cercana) {
      return `<div class="q-cercana" tabindex="-1" role="group" aria-label="${esc(t('bib.breve.comparar'))}">
        <p>${esc(t('bib.breve.cercana', { texto: v.cercana.texto, referencia: nombreE(L, q.estructura) }))}</p>
        <div class="bib-acciones"><button class="btn primary" type="button" data-cercana-si>${esc(t('bib.breve.siEra'))}</button>
          <button class="btn" type="button" data-cercana-no>${esc(t('bib.breve.noEra'))}</button></div>
        <p class="muted small">${esc(t('bib.breve.cercanaNota'))}</p></div>`;
    }
    return `<form class="q-breve" novalidate>
      <label for="q-breve-in">${esc(t('bib.breve.escribe'))}</label>
      <div class="q-breve-fila"><input id="q-breve-in" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="80" ${v.cargando ? 'disabled' : ''} />
        <button class="btn primary" type="submit" ${v.cargando ? 'disabled' : ''}>${esc(t('bib.comprobar'))}</button></div>
      <p class="q-breve-aviso" role="alert" hidden></p>
      <p class="q-breve-acc"><button class="link" type="button" data-ver-opciones>${esc(t('bib.breve.verOpciones'))}</button>
        <button class="link" type="button" data-opt="${NO_LO_SE}" ${v.cargando ? 'disabled' : ''}>${esc(t('estudio.noLoSe'))}</button></p>
    </form>`;
  }
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
      // La fallada en el primer intento (en una sesión) queda retirada: no se puede volver a elegir.
      const quitada = v.intento?.quitada === k;
      const cls = hecho ? (o.correcta ? 'ok' : v.respuesta.valor === k ? 'bad' : quitada ? 'quitada' : '') : quitada ? 'quitada' : '';
      return `<button class="opt ${cls}" data-opt="${k}" ${hecho || v.cargando || quitada ? 'disabled' : ''}${quitada ? ` aria-label="${esc(t('ses.pista.opcionQuitada', { x: tr(o.texto) }))}"` : ''}><kbd>${k + 1}</kbd><span>${esc(tr(o.texto))}</span>${hecho && o.correcta ? icono('check') : (hecho && v.respuesta.valor === k) || quitada ? icono('wrong') : ''}</button>`;
    }).join('')}
    <button class="opt idk ${hecho && v.respuesta.valor === NO_LO_SE ? 'bad' : ''}" data-opt="${NO_LO_SE}" ${hecho || v.cargando ? 'disabled' : ''}><kbd>5</kbd><span>${esc(t('estudio.noLoSe'))}</span></button>
  </div>`;
}

/**
 * Primer fallo dentro de una sesión: se apunta qué se señaló (la estructura tocada, la opción elegida, lo escrito o «No
 * lo sé») y la pista, y se pinta el segundo intento. No se anota nada en el progreso hasta la respuesta final, ni se
 * mueve la cámara ni se resalta la respuesta. La opción fallada queda retirada.
 */
function primerFallo(ctx, q, valor, escrita) {
  const v = ctx.vista;
  const L = leccionDe(ctx, q);
  const senal = valor === NO_LO_SE ? { clave: 'ses.pista.nolose' }
    : q.tipo === 'localizar' ? { clave: 'ses.pista.senalaste', x: nombreE(L, valor) }
      : valor?.texto != null ? { clave: 'ses.pista.escribiste', x: escrita ?? valor.texto }
        : { clave: 'ses.pista.elegiste', x: tr(q.opciones?.[valor]?.texto ?? '') };
  v.intento = intentoDe(ctx, q, Number.isInteger(valor) ? valor : null, senal);
  v.cercana = null;
  // El segundo intento queda guardado en la sesión: si se sale o se recarga, se vuelve a él (y un acierto ahí no cuenta
  // «a la primera»).
  anotarIntento(ctx, v);
  pintar(ctx);
}

/**
 * El segundo intento de una pregunta: la opción retirada, lo que se señaló (si se sabe: al reanudar no) y la pista (una
 * frase del paso sin el nombre, y el título del paso solo si tampoco lo nombra) o, si no hay ninguna que sirva, la general.
 */
function intentoDe(ctx, q, quitada, senal = null) {
  const L = leccionDe(ctx, q);
  const en3d = q.tipo === 'identificar' || q.tipo === 'localizar';
  const p = en3d ? pistaDe(L, q, { nombres: [nombreE(L, q.estructura)], tr }) : null;
  return {
    quitada, senal,
    pista: p ? { texto: p.texto, paso: p.titulo ?? null } : null,
    general: !p && en3d ? q.tipo : null,
  };
}

/** La pista del segundo intento: qué se señaló y una frase del paso (o, si no hay ninguna que sirva, una general). */
function htmlPista(v) {
  const i = v.intento;
  const senal = i.senal ? t(i.senal.clave, { x: i.senal.x ?? '' }) : '';
  const cuerpo = i.pista
    ? `<p class="q-pista-de">${esc(i.pista.paso ? t('ses.pista.delPaso', { paso: i.pista.paso }) : t('ses.pista.deUnPaso'))}</p><blockquote class="q-pista-cita">${esc(i.pista.texto)}</blockquote>`
    : `<p>${esc(t(i.general ? `ses.pista.general.${i.general}` : 'ses.pista.opcion'))}</p>`;
  return `<div class="q-pista" tabindex="-1" role="group" aria-labelledby="q-pista-t">
    <p class="q-pista-t" id="q-pista-t">${icono('pista')}<b>${esc(t('ses.pista.titulo'))}</b></p>
    ${senal ? `<p class="q-pista-senal">${esc(senal)}</p>` : ''}${cuerpo}</div>`;
}

function feedback(ctx, L, q, v) {
  const r = v.respuesta.resultado;
  const correcta = q.tipo === 'secuencia' ? q.correcto.map(tr).join(' → ') : tr(q.respuesta ?? '');
  const expl = q.explicacion ? tr(q.explicacion) : q.tipo === 'identificar' || q.tipo === 'localizar' ? t('bib.explIdentificar', { nombre: nombreE(L, q.estructura) }) : '';
  const paso = L.pasos.find((p) => p.id === q.paso);
  return `
    <p class="q-result ${r}" tabindex="-1">${r === 'fallo' ? t('estudio.fallo', { respuesta: `<b>${esc(correcta)}</b>` }) : esc(t(v.intento ? 'ses.pista.bienSegundo' : r === 'duda' ? 'estudio.duda' : 'estudio.correcto'))}</p>
    ${expl ? `<p class="q-expl">${esc(expl)}</p>` : ''}
    ${htmlFuentes(ctx, q.evidencia ?? [], L)}
    <div class="step-nav">
      ${paso ? `<button class="btn" data-volver-paso>${esc(t('bib.volverPaso', { paso: tr(paso.titulo) }))}</button>` : ''}
      ${ver3d(ctx, q).ids.length ? `<button class="btn" data-ver3d>${esc(t('estudio.ver3d'))}</button>` : ''}
      <button class="btn" type="button" data-preguntar-neuri>${icono('pregunta')}<span>${esc(t('ses.preguntar'))}</span></button>
      <button class="btn primary" data-siguiente>${esc(t(v.i === v.preguntas.length - 1 ? 'estudio.verResultado' : 'estudio.siguiente'))}</button>
    </div>`;
}

/**
 * Responde. `valor`: la opción, NO_LO_SE, la estructura tocada, el orden o { texto } (respuesta breve, ya corregida:
 * su `resultado` llega en las opciones, con lo que se escribió en `elegida`).
 */
function responder(ctx, valor, { resultado: corregido = null, elegida: escrita = null, autoevaluada = false } = {}) {
  const v = ctx.vista;
  if (v.tipo !== 'preguntas' || v.respuesta || v.cargando || v.saltada) return;
  const q = v.preguntas[v.i];
  if (Number.isInteger(valor) && v.intento?.quitada === valor) return;     // la opción retirada no se puede volver a elegir
  const dude = !!ctx.body.querySelector('#q-dude')?.checked;
  let resultado = corregido ?? corregir(q, valor, { dude });
  if (corregido === 'acierto' && dude) resultado = 'duda';
  // En una sesión, el primer fallo no revela nada: se dice qué se señaló, una pista y otro intento (no se anota aún).
  if (resultado === 'fallo' && admiteSegundo(v, q, valor)) return primerFallo(ctx, q, valor, escrita);
  // Bien al segundo intento: con ayuda («duda»: cuenta como acierto, pero no sube de caja en el repaso).
  const ayudado = !!v.intento;
  if (ayudado && resultado !== 'fallo') resultado = 'duda';
  v.respuesta = { valor, resultado, autoevaluada };
  v.respuestas.push({ pregunta: q, resultado, ...(ayudado ? { ayuda: true } : {}) });
  P.anotar(ctx.data, q.item, resultado, Date.now(), { huella: q.huella });
  // El intento, con lo que se eligió si falló (para explicar después la dificultad: «lo confundiste con…») y las
  // ayudas (ver las opciones en lugar de escribir; compararse con la referencia).
  const Lq = leccionDe(ctx, q);
  const elegida = escrita ?? (valor === NO_LO_SE ? NO_LO_SE : q.tipo === 'localizar' ? valor : q.tipo === 'secuencia' ? (valor ?? []).join(' > ').slice(0, 300) : q.opciones?.[valor]?.texto ?? null);
  const ayuda = [v.ayuda, autoevaluada && 'autoevaluada', valor?.texto != null && 'escrita', ayudado && (v.intento.pista ? 'pista' : 'segundo-intento')].filter(Boolean);
  P.registrarIntento(ctx.data, { leccion: q.leccion, version: Lq?.version ?? null, pregunta: q.id, tipo: q.tipo, objetivo: q.objetivo, estructura: q.estructura ?? null, resultado, elegida, dudo: dude, modo: v.modo, huella: q.huella, ayuda: ayuda.length ? ayuda : null });
  ctx.evento?.('actividad_respondida', { leccion: q.leccion, version: Lq?.version ?? null, tipo: q.tipo, resultado, modo: v.modo, escrita: valor?.texto != null });
  ctx.guardar();
  if (v.sesion) anotarPregunta(ctx, v);                // al reanudar la sesión, la siguiente (y lo respondido cuenta)
  ctx.api.alTocar(null);
  ctx.api.modoEvaluacion(false);                       // ya respondida: el nombre puede verse
  if (q.tipo === 'identificar' || q.tipo === 'localizar') ctx.api.resaltar(leccion3d(ctx, q), [q.estructura], { lado: v.lado ?? 'R', sinCamara: true });
  pintar(ctx);
}

function siguiente(ctx) {
  const v = ctx.vista;
  if (v.saltada) {
    // No se pudo mostrar en el modelo (o pide lo que el modelo muestra mal): no cuenta, ni como fallo ni en el repaso,
    // pero queda anotado como técnico.
    const q = v.preguntas[v.i];
    const limite = v.saltada === 'limite';
    v.respuestas.push({ pregunta: q, resultado: null, saltada: true, ...(limite ? { limite } : {}) });
    P.registrarIntento(ctx.data, { leccion: q.leccion, version: leccionDe(ctx, q)?.version ?? null, pregunta: q.id, tipo: q.tipo, objetivo: q.objetivo, estructura: q.estructura ?? null, resultado: 'tecnico', modo: v.modo });
    ctx.evento?.('error_tecnico', { codigo: limite ? 'limite-modelo' : 'pregunta-no-mostrable', donde: v.modo }, { clave: q.item });
    if (v.sesion) anotarPregunta(ctx, v);
  }
  if (v.i < v.preguntas.length - 1) {
    ctx.vista = { ...v, i: v.i + 1, respuesta: null, preparada: false, saltada: false, orden: null, lado: null, breve: false, cercana: null, ayuda: null, intento: null };
    return renderPreguntas(ctx);
  }
  ctx.api.alTocar(null);
  ctx.api.modoEvaluacion(false);
  if (v.sesion) {
    // Un bloque de una sesión: el registro de la tanda, como siempre, y de vuelta a la sesión con su resultado.
    const contadas = v.respuestas.filter((r) => !r.saltada);
    const bien = contadas.filter((r) => r.resultado !== 'fallo').length;
    ctx.evento?.('repaso_realizado', { modo: v.modo, aciertos: bien, total: contadas.length });
    if (contadas.length) P.registrarSesion(ctx.data, { fecha: Date.now(), tipo: v.modo, aciertos: bien, total: contadas.length });
    ctx.guardar();
    return terminarBloquePreguntas(ctx, v);
  }
  const contadas = v.respuestas.filter((r) => !r.saltada);
  const aciertos = contadas.filter((r) => r.resultado !== 'fallo').length;
  let demostrada = null;
  let objetivos = null;
  let sinEvaluar = [];
  // Lo que no se hizo por las limitaciones del modelo: lo quitado antes de empezar y lo saltado al mostrarlo.
  const porLimite = (v.excluidasLimite ?? 0) + v.respuestas.filter((r) => r.limite).length;
  if (v.modo === 'evaluacion') {
    const L = ctx.lecciones.get(v.leccion);
    objetivos = porObjetivo(L, contadas);
    // Objetivos sin evaluar por una limitación: los que se sabían al empezar y los que se quedaron sin pregunta al saltar.
    sinEvaluar = [...new Set([...(v.sinEvaluar ?? []), ...v.respuestas.filter((r) => r.limite).map((r) => r.pregunta.objetivo)])]
      .filter((i) => !objetivos[i]?.[1]).sort((a, b) => a - b);
    demostrada = P.registrarEvaluacion(ctx.data, L, { aciertos, total: contadas.length, porObjetivo: objetivos, sinEvaluar });
    ctx.evento?.('evaluacion_terminada', { leccion: L.id, version: L.version, aciertos, total: contadas.length, demostrada });
  } else ctx.evento?.('repaso_realizado', { modo: v.modo, aciertos, total: contadas.length });
  P.registrarSesion(ctx.data, { fecha: Date.now(), tipo: v.modo, aciertos, total: contadas.length });
  ctx.guardar();
  ctx.ir({ tipo: 'resultado', modo: v.modo, leccion: v.leccion, titulo: v.titulo, aciertos, total: contadas.length, saltadas: v.respuestas.length - contadas.length - v.respuestas.filter((r) => r.limite).length, porLimite, sinEvaluar, objetivos, demostrada, fallos: contadas.filter((r) => r.resultado === 'fallo').map((r) => r.pregunta), vuelta: v.vuelta }, { reemplazar: true });
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
  const fallosPorLeccion = [...new Map(v.fallos.map((q) => [`${q.leccion}/${q.paso}`, q])).values()];
  // El veredicto de siempre (el 80 % y algún acierto en cada objetivo evaluado). Si solo lo impide un objetivo que no
  // se pudo evaluar por una limitación del modelo, se dice eso; si además no se llega, se dice lo de siempre y la nota.
  const llega = v.total > 0 && v.aciertos / v.total >= P.UMBRAL_DEMOSTRADA && (v.objetivos ?? []).every(([a, n]) => !n || a > 0);
  const veredicto = v.demostrada ? 'bib.demostradaSi' : llega && v.sinEvaluar?.length ? 'bib.limite.noDemostrada' : 'bib.demostradaNo';
  body.innerHTML = `
    <button class="link back" data-salir>${icono('chevron')}<span>${esc(t('bib.biblioteca'))}</span></button>
    <p class="bib-leccion-t">${esc(v.titulo)}</p>
    <h3 class="step-title" tabindex="-1">${esc(t(v.modo === 'evaluacion' ? 'estudio.resultado' : 'estudio.repasoTerminado'))}</h3>
    <p class="score">${t('estudio.puntuacion', { a: `<b>${v.aciertos}</b>`, b: v.total })} <small>(${pct} %)</small></p>
    ${v.saltadas ? `<p class="muted small">${esc(tn('bib.saltadas', v.saltadas))}</p>` : ''}
    ${v.porLimite ? `<p class="muted small">${esc(tn('bib.limite.repaso', v.porLimite))}</p>` : ''}
    ${v.modo === 'evaluacion' ? `
      <p class="bib-veredicto ${v.demostrada ? 'ok' : ''}">${icono(v.demostrada ? 'check' : 'info')}<span>${esc(t(veredicto))}</span></p>
      ${veredicto === 'bib.demostradaNo' && v.sinEvaluar?.length ? `<p class="muted small">${esc(t('bib.limite.noDemostrada'))}</p>` : ''}
      <h4>${esc(t('bib.porObjetivo2'))}</h4>
      <ul class="bib-objetivos">${L.objetivos.map((o, k) => {
        const [a, n] = v.objetivos[k] ?? [0, 0];
        // Lo que no se pudo evaluar por una limitación del modelo se dice, sin darlo por cumplido.
        if (!n && v.sinEvaluar?.includes(k)) return `<li class="sin-evaluar"><span>${esc(tr(o))} <small>· ${esc(t('bib.limite.sinEvaluar'))}</small></span><b>–</b></li>`;
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
      ${v.fallos.length ? `<button class="btn primary" data-rep-fallos>${esc(t('bib.repasarFallos', { n: v.fallos.length }))}</button>` : ''}
      ${L ? `<button class="btn" data-info>${esc(t('bib.volverLeccion'))}</button>` : ''}
    </div>`;
  body.querySelector('[data-salir]').addEventListener('click', () => { ctx.vista = { tipo: 'portada' }; ctx.pila = []; ctx.render(); });
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
  if (!v.respuesta && !v.cargando && !v.saltada && !v.breve && /^[1-5]$/.test(e.key)) {
    const k = Number(e.key);
    if (k === 5) responder(ctx, NO_LO_SE);
    else if (q.opciones && k <= q.opciones.length) responder(ctx, k - 1);
    return true;
  }
  if ((v.respuesta || v.saltada) && e.key === 'Enter' && !e.target.closest?.('button')) { siguiente(ctx); return true; }
  return false;
}
