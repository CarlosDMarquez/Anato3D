// Sesiones de estudio con Neuri (vista `sesion-neuri`): un plan guardado en este navegador (src/pet/sesiones.js) con su
// objetivo, sus minutos y sus bloques en orden (repaso de lo vencido, una lección o parte de ella, práctica con preguntas
// del banco). Se reproduce con el reproductor de lecciones (leccion.js) y las preguntas (preguntas.js), que alimentan el
// mismo progreso; cada bloque vuelve aquí al terminar con su resultado, y se puede salir y seguir después en el bloque
// (y el paso o la pregunta) exactos. Al final, el resumen: aciertos a la primera, con ayuda y revelados, lo que conviene
// repasar y cuándo vuelve en el repaso espaciado, y dos siguientes pasos.
// La lógica sin DOM (resumen, pasos de un bloque, plan para repetir) está en sesion-logica.js.
import * as P from '../../biblioteca/progreso.js';
import { preguntaDeItem } from '../../biblioteca/evaluar.js';
import { planificarSinTema } from '../../pet/planificador.js';
import { t, tn, idioma } from '../../i18n/idioma.js';
import { tr } from '../../i18n/contenido.js';
import { esc, icono, fecha } from './comun.js';
import { abrirLeccion, empezarPractica, evaluarLeccion } from './explorar.js';
import { svgNeuri } from './neuri-svg.js';
import { pasosDeBloque, resultadoDe, proximoRepaso, siguientesPasos, planParaRepetir } from './sesion-logica.js';

// El catálogo de ahora (index.js lo fija): para decir en el idioma de la interfaz el tema y el objetivo que el
// planificador guardó en español (src/pet/planificador.js: el título de la lección hasta los dos puntos y su primer
// objetivo, en minúscula).
let catalogo = () => null;
export function usarCatalogo(fn) { catalogo = fn; }
const corto = (s) => String(s ?? '').split(/[:(—–]/)[0].trim().slice(0, 60);
const minuscula = (s) => (s ? s[0].toLowerCase() + s.slice(1) : s);

/** Los datos de un texto con el tema y el objetivo de la lección principal en el idioma de ahora (si es la misma). */
function datosEnIdioma(c, S) {
  const datos = { ...(c.datos ?? {}) };
  const id = S?.bloques?.find((b) => b.leccion)?.leccion;
  const L = id ? catalogo()?.get(id) : null;
  if (!L || typeof datos.x !== 'string') return datos;
  if (c.clave === 'pet.ses.titulo' && corto(L.titulo) === datos.x) datos.x = corto(tr(L.titulo));
  const meta = L.objetivos?.[0];
  if (c.clave === 'pet.ses.objetivo' && meta && minuscula(meta) === datos.x) datos.x = minuscula(tr(meta));
  return datos;
}

/**
 * Un texto de la sesión: el de la app (por su clave, en el idioma de ahora; con singular y plural si lleva {n}) o el
 * guardado (el de Neuri).
 */
function texto(c, guardado, S = null) {
  if (c?.clave) {
    const datos = datosEnIdioma(c, S);
    const s = Number.isInteger(datos.n) ? tn(c.clave, datos.n, datos) : t(c.clave, datos);
    if (s && s !== c.clave) return s;
  }
  return guardado ?? '';
}
export const tituloSesion = (S) => texto(S?.textos?.titulo, S?.titulo, S);
export const mensajeSesion = (S) => texto(S?.textos?.mensaje, S?.mensaje, S);
export const objetivoSesion = (S) => texto(S?.textos?.objetivo, S?.objetivo, S);
export const motivoBloque = (b) => texto(b?.motivoClave, b?.motivo);
/** Los minutos del plan (lo que suman sus bloques; los pedidos, si no hay bloques). */
export const minutosSesion = (S) => (S?.bloques ?? []).reduce((n, b) => n + (b.minutos ?? 0), 0) || S?.minutos || 0;
export const textoOrigen = (S) => t(S?.origen === 'neuri' ? 'ses.origen.ia' : 'ses.origen.local');

/** La vista de una sesión. */
export const vistaSesion = (id) => ({ tipo: 'sesion-neuri', id });
/** ¿Existe esta lección (catálogo, propias o cargada)? Para apartar los bloques de lecciones que ya no están. */
const existeLeccion = (ctx) => (id) => ctx.porId.has(id) || ctx.lecciones.has(id);

/** El título de un bloque: «Repaso», el de la lección o «Práctica: …». */
export function tituloBloque(ctx, b) {
  const L = b.leccion ? ctx.porId.get(b.leccion) ?? ctx.lecciones.get(b.leccion) : null;
  const nombre = L ? tr(L.titulo) : b.leccion ?? '';
  if (b.tipo === 'repaso') return t('ses.bloque.repaso');
  if (b.tipo === 'practica') return t('ses.bloque.practica', { x: nombre });
  return nombre;
}

/** Lo que trae un bloque: cuántas preguntas o qué parte de la lección. */
export function detalleBloque(ctx, b) {
  if (b.tipo !== 'leccion') return tn('ses.nPreguntas', b.items?.length ?? 0);
  if (!b.pasos) return t('ses.leccionEntera');
  const total = ctx.lecciones.get(b.leccion)?.pasos?.length ?? ctx.porId.get(b.leccion)?.pasos ?? null;
  return total ? t('ses.partePasos', { n: b.pasos.length, total }) : tn('ses.nPasos', b.pasos.length);
}

/** El estado de cada bloque: hecho, saltado, perdido, actual, pendiente o sin-hacer (la sesión se terminó antes). */
export function estadoBloque(S, k) {
  const r = S.resultados.find((x) => x.bloque === k);
  if (r) return r.saltado ? (r.motivo === 'perdido' ? 'perdido' : 'saltado') : 'hecho';
  if (S.bloques[k].perdido) return 'perdido';
  if (S.estado === 'finalizada') return 'sin-hacer';
  return k === S.i ? 'actual' : 'pendiente';
}

/** El resultado de un bloque hecho, en una línea («4 de 5 a la primera · 1 con ayuda»). */
function textoResultado(S, k) {
  const r = S.resultados.find((x) => x.bloque === k);
  if (!r || r.saltado) return '';
  if (S.bloques[k].tipo === 'leccion') return t('ses.res.leccion');
  return [t('ses.res.aciertos', { a: r.aciertos, n: r.total }), r.conAyuda ? tn('ses.res.conAyuda', r.conAyuda) : '', r.revelados ? tn('ses.res.revelados', r.revelados) : ''].filter(Boolean).join(' · ');
}

const ICONO_BLOQUE = { repaso: 'repeat', leccion: 'book', practica: 'target' };
const MARCA = { hecho: 'circleCheck', actual: 'circleDot', saltado: 'skip', perdido: 'skip', pendiente: 'circle', 'sin-hacer': 'circle' };

// ── Vista de la sesión ──
export function renderSesionNeuri(ctx, { foco = null } = {}) {
  const { body, vista } = ctx;
  const S = ctx.sesiones.buscar(vista.id);
  if (!S) {
    body.innerHTML = `<section class="ses" aria-labelledby="ses-h">
      <button class="link back" type="button" data-atras>${icono('chevron')}<span>${esc(t('bib.volver'))}</span></button>
      <h3 id="ses-h" class="bib-tit" tabindex="-1">${esc(t('ses.noEsta'))}</h3>
      <div class="bib-acciones"><button class="btn" type="button" data-mis-sesiones>${esc(t('ses.mis'))}</button></div></section>`;
    body.querySelector('[data-atras]').addEventListener('click', () => ctx.volver());
    body.querySelector('[data-mis-sesiones]').addEventListener('click', () => ctx.ir({ tipo: 'sesiones' }, { reemplazar: true }));
    requestAnimationFrame(() => body.querySelector('#ses-h')?.focus());
    return;
  }
  // Lo que ya no existe (una lección quitada) se aparta sin borrar su resultado; si era el bloque en curso, se salta.
  ctx.sesiones.depurar(S.id, existeLeccion(ctx));
  const fin = S.estado === 'finalizada';
  // El resumen nombra lo que conviene repasar (la estructura o el paso): sus lecciones, cargadas antes de pintarlo.
  if (fin) {
    const faltan = [...new Set((ctx.sesiones.resumen(S.id)?.repasar ?? []).map((x) => x.slice(0, x.indexOf('/'))))].filter((id) => !ctx.lecciones.has(id));
    // (Una vez por sesión: si alguna no se puede cargar, el resumen dice el título de su lección.)
    if (faltan.length && ctx.resumenCargado !== S.id) {
      ctx.resumenCargado = S.id;
      Promise.all(faltan.map((id) => ctx.cargarLeccion(id).catch(() => null))).finally(() => {
        if (ctx.vista.tipo === 'sesion-neuri' && ctx.vista.id === S.id) renderSesionNeuri(ctx, { foco });
      });
      return;
    }
  }
  const objetivo = objetivoSesion(S);
  const mensaje = mensajeSesion(S);
  const hechos = S.resultados.filter((r) => !r.saltado).length;
  const anuncio = ctx.anuncioSesion ?? '';
  ctx.anuncioSesion = null;
  const empezada = S.estado !== 'planificada' || S.resultados.length > 0 || S.posicion;
  const meta = [
    `<span>${icono(S.origen === 'neuri' ? 'sparkles' : 'search')}${esc(textoOrigen(S))}</span>`,
    `<span>${icono('clock')}${esc(t('bib.minutos', { n: minutosSesion(S) }))}</span>`,
    `<span>${esc(fin ? t('ses.estado.finalizada') : t('ses.bloqueDe', { a: Math.min(S.i + 1, S.bloques.length), b: S.bloques.length }))}</span>`,
  ];
  body.innerHTML = `
    <section class="ses" aria-labelledby="ses-h">
      <button class="link back" type="button" data-atras>${icono('chevron')}<span>${esc(t('bib.volver'))}</span></button>
      <p class="bib-sobre">${icono('timer')}${esc(t('ses.sobre'))}</p>
      <h3 id="ses-h" class="bib-tit" tabindex="-1">${esc(tituloSesion(S))}</h3>
      ${objetivo ? `<p class="ses-objetivo">${icono('target')}<span>${esc(objetivo)}</span></p>` : ''}
      <p class="bib-meta ses-meta">${meta.join('')}</p>
      ${mensaje && !fin ? `<div class="ses-mensaje">${svgNeuri()}<p><span class="sr-only">Neuri: </span>${esc(mensaje)}</p></div>` : ''}
      <p class="sr-only ses-anuncio" role="status" aria-live="polite" aria-atomic="true"></p>
      ${fin ? htmlResumen(ctx, S) : ''}
      <h4 class="bib-h ses-h4" id="ses-bloques-h">${esc(t('ses.bloques'))}</h4>
      <ol class="ses-bloques" aria-labelledby="ses-bloques-h">${S.bloques.map((b, k) => htmlBloque(ctx, S, b, k)).join('')}</ol>
      ${S.quitados ? `<p class="muted small ses-nota">${esc(tn('ses.quitados', S.quitados))}</p>` : ''}
      ${fin ? '' : `<div class="bib-acciones ses-acciones">
        <button class="btn primary" type="button" data-seguir>${icono('play')}<span>${esc(t(empezada ? 'ses.continuar' : 'ses.empezar'))}</span></button>
        <button class="btn" type="button" data-saltar>${icono('skip')}<span>${esc(t('ses.saltar'))}</span></button>
        <button class="btn" type="button" data-preguntar-neuri>${icono('pregunta')}<span>${esc(t('ses.preguntar'))}</span></button>
        <button class="btn" type="button" data-terminar>${icono('flag')}<span>${esc(t('ses.terminar'))}</span></button>
      </div>
      <div class="mod-confirm ses-confirmar" hidden>
        <p>${esc(t('ses.terminarPregunta', { n: hechos, total: S.bloques.length }))}</p>
        <button class="btn danger" type="button" data-terminar-si>${esc(t('ses.terminarSi'))}</button>
        <button class="btn" type="button" data-terminar-no>${esc(t('ses.terminarNo'))}</button>
      </div>
      <p class="muted small ses-nota">${esc(t('ses.notaGuardado'))}</p>`}
      <p class="ses-pie"><button class="link" type="button" data-mis-sesiones>${esc(t('ses.verMis'))}</button></p>
    </section>`;

  // ── Eventos ──
  body.querySelector('[data-atras]').addEventListener('click', () => ctx.volver());
  body.querySelector('[data-mis-sesiones]').addEventListener('click', () => ctx.ir({ tipo: 'sesiones' }));
  body.querySelector('[data-seguir]')?.addEventListener('click', () => seguirSesion(ctx, S.id));
  body.querySelector('[data-saltar]')?.addEventListener('click', () => {
    const r = ctx.sesiones.saltar(S.id, { motivo: 'persona' });
    alAvanzar(ctx, S.id, r);
    ctx.anuncioSesion = r.fin ? t('ses.anuncio.fin') : t('ses.anuncio.saltado');
    renderSesionNeuri(ctx, { foco: r.fin ? '#ses-h' : '[data-seguir]' });
  });
  body.querySelector('[data-preguntar-neuri]')?.addEventListener('click', () => {
    const b = S.bloques[S.i];
    ctx.neuri.abrirEn({ enfoque: b?.leccion ? { leccion: b.leccion, paso: null, sesion: true } : null, volver: t('ses.volverSesion') });
  });
  const conf = body.querySelector('.ses-confirmar');
  body.querySelector('[data-terminar]')?.addEventListener('click', () => { conf.hidden = false; conf.querySelector('.danger').focus(); });
  body.querySelector('[data-terminar-no]')?.addEventListener('click', () => { conf.hidden = true; body.querySelector('[data-terminar]').focus(); });
  body.querySelector('[data-terminar-si]')?.addEventListener('click', () => {
    if (ctx.sesiones.terminar(S.id)) eventoFin(ctx, S.id);
    ctx.anuncioSesion = t('ses.anuncio.fin');
    renderSesionNeuri(ctx, { foco: '#ses-h' });
  });
  enlazarResumen(ctx, S, body);
  body.querySelectorAll('[data-abrir-bloque]').forEach((x) => x.addEventListener('click', () => ctx.ir({ tipo: 'info', id: x.dataset.abrirBloque })));
  const vivo = body.querySelector('.ses-anuncio');
  requestAnimationFrame(() => {
    if (anuncio && vivo) vivo.textContent = anuncio;
    (foco && body.querySelector(foco) || (anuncio && !fin && body.querySelector('[data-seguir]')) || body.querySelector('#ses-h'))?.focus({ preventScroll: !foco && !anuncio });
  });
}

function htmlBloque(ctx, S, b, k) {
  const estado = estadoBloque(S, k);
  const res = textoResultado(S, k);
  const motivo = motivoBloque(b);
  const L = b.leccion ? ctx.porId.get(b.leccion) : null;
  return `<li class="ses-bloque ${estado}"${estado === 'actual' ? ' aria-current="step"' : ''}>
    <span class="ses-marca" aria-hidden="true">${icono(MARCA[estado])}</span>
    <div class="ses-bloque-txt">
      <p class="ses-bloque-t"><span class="sr-only">${esc(t('ses.bloqueN', { n: k + 1 }))}, ${esc(t(`ses.estado.${estado}`))}: </span>${icono(ICONO_BLOQUE[b.tipo])}<b>${esc(tituloBloque(ctx, b))}</b></p>
      <p class="ses-bloque-m">${esc([detalleBloque(ctx, b), t('bib.minutos', { n: b.minutos })].join(' · '))}${estado !== 'pendiente' && estado !== 'actual' ? ` · <span class="ses-bloque-e">${esc(t(`ses.estado.${estado}`))}</span>` : ''}</p>
      ${motivo ? `<p class="ses-bloque-r">${esc(motivo)}</p>` : ''}
      ${res ? `<p class="ses-bloque-res">${esc(res)}</p>` : ''}
    </div>
    ${L && b.tipo === 'leccion' ? `<button class="link ses-bloque-ficha" type="button" data-abrir-bloque="${esc(L.id)}" aria-label="${esc(t('ses.verFichaDe', { x: tr(L.titulo) }))}">${esc(t('pet.verFicha'))}</button>` : ''}
  </li>`;
}

// ── Resumen al terminar ──
function htmlResumen(ctx, S) {
  const r = ctx.sesiones.resumen(S.id, { data: ctx.data });
  const ahora = Date.now();
  const rep = proximoRepaso(ctx.data, r.repasar, ahora);
  const sig = siguientesPasos({ sesion: S, resumen: r, porId: ctx.porId, terminada: ctx.terminada });
  const cifra = (n, clave, extra = '') => `<div class="ses-cifra${extra}"><b>${n}</b><span>${esc(clave)}</span></div>`;
  const item = ({ item, proximo, hoy }) => {
    const [lid, qid] = [item.slice(0, item.indexOf('/')), item.slice(item.indexOf('/') + 1)];
    const L = ctx.lecciones.get(lid);
    const q = L?.preguntas?.find((x) => x.id === qid);
    const paso = q && L.pasos.find((p) => p.id === q.paso);
    const nombre = q?.estructura ? tr(L.estructuras[q.estructura]?.nombre ?? '') : paso ? tr(paso.titulo) : tr(ctx.porId.get(lid)?.titulo ?? lid);
    const cuando = hoy ? t('ses.repasoHoy') : t('ses.repasoEl', { fecha: fecha(proximo) });
    return `<li><button class="ses-repasar" type="button" data-ir-item="${esc(item)}"><span>${esc(nombre)}${L ? ` <small>· ${esc(tr(L.titulo))}</small>` : ''}</span><small class="ses-cuando">${icono('clock')}${esc(cuando)}</small></button></li>`;
  };
  const boton = (s, k) => {
    const L = s.leccion ? ctx.porId.get(s.leccion) : null;
    const etiqueta = s.tipo === 'repasar' ? tn('ses.sig.repasar', s.items.length) : s.tipo === 'otra' ? t('ses.sig.otra') : t(`ses.sig.${s.tipo}`, { x: L ? tr(L.titulo) : '' });
    return `<button class="btn${k === 0 ? ' primary' : ''}" type="button" data-siguiente-paso="${k}">${icono(s.tipo === 'repasar' ? 'repeat' : s.tipo === 'otra' ? 'timer' : s.tipo === 'evaluar' ? 'target' : 'book')}<span>${esc(etiqueta)}</span></button>`;
  };
  return `<div class="ses-resumen" role="region" aria-labelledby="ses-res-h">
    <h4 id="ses-res-h" class="bib-h">${esc(t(r.hechos === r.total ? 'ses.res.titulo' : 'ses.res.tituloAntes'))}</h4>
    <div class="ses-cifras">
      ${cifra(r.aciertos, t('ses.res.primera'), ' ok')}${cifra(r.conAyuda, t('ses.res.ayuda'))}${cifra(r.revelados, t('ses.res.reveladas'), r.revelados ? ' mal' : '')}
      ${cifra(`${r.hechos}/${r.total}`, t('ses.res.bloques'))}
    </div>
    ${r.preguntas ? '' : `<p class="muted small">${esc(t('ses.res.sinPreguntas'))}</p>`}
    <h5 class="ses-h5">${esc(t('ses.res.repasar'))}</h5>
    ${rep.lista.length ? `<ul class="ses-repaso">${rep.lista.map(item).join('')}</ul>
      <p class="muted small">${esc(t('ses.res.repasarNota'))}</p>`
      : `<p class="muted small">${esc(t('ses.res.nadaQueRepasar'))}</p>`}
    <h5 class="ses-h5">${esc(t('ses.res.siguientes'))}</h5>
    <div class="bib-acciones ses-sig" data-pasos='${esc(JSON.stringify(sig))}'>${sig.map(boton).join('')}</div>
    <p class="ses-pie"><button class="link" type="button" data-repetir>${icono('restart')}<span>${esc(t('ses.repetir'))}</span></button></p>
  </div>`;
}

function enlazarResumen(ctx, S, body) {
  const caja = body.querySelector('.ses-sig');
  if (!caja) return;
  const sig = JSON.parse(caja.dataset.pasos);
  body.querySelectorAll('[data-siguiente-paso]').forEach((b) => b.addEventListener('click', () => {
    const s = sig[Number(b.dataset.siguientePaso)];
    if (s.tipo === 'repasar') return empezarPractica(ctx, 'items', { items: s.items, titulo: tituloSesion(S) });
    if (s.tipo === 'seguir' || s.tipo === 'siguiente') return abrirLeccion(ctx, s.leccion);
    if (s.tipo === 'evaluar') return evaluarLeccion(ctx, s.leccion);
    return repetirSesion(ctx, S.id, { otra: true });
  }));
  body.querySelectorAll('[data-ir-item]').forEach((b) => b.addEventListener('click', async () => {
    const item = b.dataset.irItem;
    const lid = item.slice(0, item.indexOf('/'));
    const L = await ctx.cargarLeccion(lid);
    const q = L?.preguntas?.find((x) => x.id === item.slice(item.indexOf('/') + 1));
    if (L) abrirLeccion(ctx, lid, { paso: Math.max(0, L.pasos.findIndex((p) => p.id === q?.paso)) });
  }));
  body.querySelector('[data-repetir]')?.addEventListener('click', () => repetirSesion(ctx, S.id));
}

// ── Seguir, reproducir y terminar bloques ──

/** Empieza o sigue la sesión en su bloque (y el paso o la pregunta) exactos. */
export async function seguirSesion(ctx, id) {
  if (!ctx.sesiones.buscar(id)) return;
  ctx.sesiones.depurar(id, existeLeccion(ctx));
  const r = ctx.sesiones.empezar(id);
  if (!r.ok || r.fin) {
    if (r.fin) eventoFin(ctx, id);
    return irASesion(ctx, id, r.fin ? t('ses.anuncio.fin') : null);
  }
  // La vista de la sesión queda debajo: «Atrás» desde el bloque vuelve a ella (aunque se empezara desde el chat).
  if (!(ctx.vista.tipo === 'sesion-neuri' && ctx.vista.id === id)) { ctx.pila.push(ctx.vista); ctx.vista = vistaSesion(id); }
  return lanzarBloque(ctx, r.sesion, r.i, r.posicion ?? 0, r.parcial ?? null);
}

async function lanzarBloque(ctx, S, k, posicion, parcial) {
  const b = S.bloques[k];
  const marca = { id: S.id, bloque: k };
  if (b.tipo === 'leccion') {
    const L = await ctx.cargarLeccion(b.leccion);
    if (!L) return saltarPerdido(ctx, S.id, k);
    const pasos = pasosDeBloque(L, b);
    return ctx.ir({ tipo: 'leccion', id: L.id, paso: pasos[Math.min(posicion, pasos.length - 1)], sesion: marca });
  }
  const ids = [...new Set(b.items.map((x) => x.slice(0, x.indexOf('/'))))];
  await Promise.all(ids.map((id) => ctx.cargarLeccion(id).catch(() => null)));
  const modelo = ctx.api.modelo();
  const preguntas = b.items.map((x) => preguntaDeItem(ctx.lecciones, x, { modelo })).filter(Boolean);
  // Sin preguntas que se puedan hacer (retiradas, otro modelo): el bloque se salta y la sesión sigue (no se atasca).
  if (!preguntas.length) return saltarPerdido(ctx, S.id, k);
  // Ya estaban todas respondidas (se cerró justo antes de ver el resultado): el bloque termina con lo anotado.
  if (posicion >= preguntas.length) {
    const r = ctx.sesiones.avanzar(S.id, { bloque: k, ...(parcial ?? {}) });
    alAvanzar(ctx, S.id, r);
    return irASesion(ctx, S.id, anuncioBloque(r, parcial));
  }
  const L = b.leccion ? ctx.lecciones.get(b.leccion) : null;
  const titulo = b.tipo === 'repaso' ? t('ses.bloque.repaso') : t('ses.bloque.practica', { x: L ? tr(L.titulo) : '' });
  ctx.ir({
    tipo: 'preguntas', modo: b.tipo === 'repaso' ? 'repaso' : 'practica', titulo, preguntas, i: posicion, respuestas: [],
    vuelta: vistaSesion(S.id), excluidasLimite: 0, sesion: { ...marca, previo: parcial },
  });
}

function saltarPerdido(ctx, id, k) {
  const r = ctx.sesiones.avanzar(id, { bloque: k, saltado: true, motivo: 'perdido' });
  alAvanzar(ctx, id, r);
  return irASesion(ctx, id, t('ses.anuncio.sinContenido'));
}

/** Vuelve a la vista de la sesión: la de debajo si es esa (sin dejar otra en la pila); si no, en lugar de la de ahora. */
export function irASesion(ctx, id, anuncio = null) {
  if (anuncio) ctx.anuncioSesion = anuncio;
  const abajo = ctx.pila.at(-1);
  if (abajo?.tipo === 'sesion-neuri' && abajo.id === id) return ctx.volver();
  if (ctx.vista.tipo === 'sesion-neuri' && ctx.vista.id === id) return ctx.render();
  return ctx.ir(vistaSesion(id), { reemplazar: true });
}

const anuncioBloque = (r, res) => (r?.fin ? t('ses.anuncio.fin')
  : res && res.total ? t('ses.anuncio.bloqueRes', { a: res.aciertos + res.conAyuda, n: res.total }) : t('ses.anuncio.bloque'));

/** ¿Es este el bloque en curso de la sesión? (otra pestaña pudo avanzarla). */
const esElBloque = (ctx, s) => ctx.sesiones.actual(s.id)?.i === s.bloque;

/** Anota en la sesión el paso (de los del bloque) en que se está, para reanudar justo ahí. */
export function anotarPaso(ctx, s, n) {
  if (s && esElBloque(ctx, s)) ctx.sesiones.anotarPosicion(s.id, n);
}

/** Anota la pregunta siguiente y lo respondido hasta ahora en el bloque (para reanudar sin perder el resultado). */
export function anotarPregunta(ctx, v) {
  const s = v.sesion;
  if (s && esElBloque(ctx, s)) ctx.sesiones.anotarPosicion(s.id, v.i + 1, resultadoDe(v.respuestas, s.previo));
}

/**
 * Tras el primer fallo de una pregunta: la sesión se queda en esa pregunta con su segundo intento ({ n, quitada }: la
 * opción retirada), para que salir o recargar no lo convierta en un intento nuevo «a la primera».
 */
export function anotarIntento(ctx, v) {
  const s = v.sesion;
  if (!s || !v.intento || !esElBloque(ctx, s)) return;
  ctx.sesiones.anotarPosicion(s.id, v.i, { ...resultadoDe(v.respuestas, s.previo), intento: { n: v.i, quitada: v.intento.quitada ?? null } });
}

/**
 * Termina un bloque de lección (desde su último paso): la lección queda completada solo si se han visto todos sus pasos;
 * la sesión avanza y se vuelve a su vista.
 */
export function terminarBloqueLeccion(ctx, vista, L, segundos = 0) {
  const s = vista.sesion;
  const p = ctx.data.lecciones[L.id];
  const vistos = new Set(p?.vistos ?? []);
  if (L.pasos.every((x) => vistos.has(x.id)) && !p?.completada) {
    P.completar(ctx.data, L);
    ctx.guardar();
    ctx.evento?.('leccion_completada', { leccion: L.id, version: L.version, segundosActivos: segundos, propia: !!L.origen?.neuri }, { clave: `${L.id}:${L.version}` });
  }
  const r = ctx.sesiones.buscar(s.id) ? ctx.sesiones.avanzar(s.id, { bloque: s.bloque, aciertos: 0, total: 0 }) : null;
  alAvanzar(ctx, s.id, r);
  ctx.crono = null;
  ctx.api.alTocar(null);
  ctx.api.mostrar(null, null);      // de vuelta al plan: sin la selección ni la ficha del último paso
  return irASesion(ctx, s.id, anuncioBloque(r, null));
}

/** Termina un bloque de preguntas con su resultado (a la primera, con ayuda, reveladas) y vuelve a la sesión. */
export function terminarBloquePreguntas(ctx, v) {
  const s = v.sesion;
  const res = resultadoDe(v.respuestas, s.previo);
  const r = ctx.sesiones.buscar(s.id) ? ctx.sesiones.avanzar(s.id, { bloque: s.bloque, ...res }) : null;
  alAvanzar(ctx, s.id, r);
  ctx.api.mostrar(null, null);      // de vuelta al plan: sin la selección ni la ficha de la última respuesta
  return irASesion(ctx, s.id, anuncioBloque(r, res));
}

/** Tras avanzar: si la sesión terminó ahí, se anota (estadísticas, si están activadas). */
function alAvanzar(ctx, id, r) {
  if (r?.ok && r.fin && !r.repetido) eventoFin(ctx, id);
}

function eventoFin(ctx, id) {
  const S = ctx.sesiones.buscar(id);
  const r = ctx.sesiones.resumen(id);
  if (!S || !r) return;
  ctx.evento?.('sesion_terminada', { origen: S.origen, bloques: r.total, hechos: r.hechos, aciertos: r.aciertos + r.conAyuda, total: r.preguntas, completa: r.hechos + r.saltados >= r.total }, { clave: id });
}

// ── Crear sesiones desde la interfaz ──

/** Crea una sesión con un plan (de la app o de Neuri) y devuelve el resultado de sesiones.crear. */
export async function crearSesion(ctx, plan, { origen = 'local', minutos = null, nivel = null } = {}) {
  const r = await ctx.sesiones.crear(plan, {
    origen, idioma: idioma(), modelo: ctx.api.modelo(), nivel, minutos, data: ctx.data,
    cargar: (id) => ctx.cargarLeccion(id), idsLecciones: new Set(ctx.porId.keys()), ambito: plan?.ambito ?? null,
  });
  if (r.ok) ctx.evento?.('sesion_creada', { origen: r.sesion.origen, bloques: r.sesion.bloques.length, minutos: r.sesion.minutos });
  return r;
}

/**
 * «Proponer una sesión» de la portada: una sesión guardada con el planificador de la app (sin IA) con lo vencido, lo
 * empezado y lo siguiente del plan de estudio; se abre su vista. Una propuesta igual sin empezar de hace poco se reutiliza
 * (no se acumulan copias por pulsar dos veces).
 */
export async function proponerSesion(ctx, minutos) {
  const reciente = ctx.sesiones.lista.find((S) => S.estado === 'planificada' && !S.resultados.length && !S.posicion
    && S.textos?.titulo?.clave === 'pet.ses.tituloGeneral' && S.minutos === minutos && S.modelo === ctx.api.modelo()
    && Date.now() - S.creada < 30 * 60_000);
  if (reciente) return ctx.ir(vistaSesion(reciente.id));
  const plan = planificarSinTema({ minutos, modelo: ctx.api.modelo(), catalogo: ctx.catalogo.lecciones, data: ctx.data, t, estado: (L) => ctx.estado(L) });
  if (!plan) return ctx.toast(t('bib.sesionVacia'), 6000);
  const r = await crearSesion(ctx, plan, { origen: 'local', minutos });
  if (!r.ok) return ctx.toast(t(r.error === 'vacia' ? 'bib.sesionVacia' : 'pet.error.sesion'), 6000);
  ctx.anuncioSesion = t('ses.anuncio.creada');
  ctx.ir(vistaSesion(r.sesion.id));
}

/** «Repetir»: otra sesión con el mismo plan (las preguntas y lo vencido se eligen de nuevo). */
export async function repetirSesion(ctx, id, { otra = false } = {}) {
  const S = ctx.sesiones.buscar(id);
  if (!S) return;
  // «Otra sesión» desde el resumen: el mismo plan de la app si no hay tema; si lo hay, el mismo plan otra vez.
  const plan = planParaRepetir(S, ctx.lecciones);
  if (!plan.bloques.length) return ctx.toast(t('pet.error.sesion-vacia'), 6000);
  const r = await crearSesion(ctx, plan, { origen: S.origen, minutos: S.minutos, nivel: S.nivel });
  if (!r.ok) return ctx.toast(t(r.error === 'vacia' ? 'pet.error.sesion-vacia' : 'pet.error.sesion'), 6000);
  ctx.anuncioSesion = t(otra ? 'ses.anuncio.otra' : 'ses.anuncio.repetida');
  ctx.ir(vistaSesion(r.sesion.id), { reemplazar: ctx.vista.tipo === 'sesion-neuri' });
}
