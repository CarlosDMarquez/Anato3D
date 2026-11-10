// Lección guiada: cada paso muestra en 3D lo que explica (selección, contexto, transparencia y cámara), con sus
// actividades (localizar, comparar, otras vistas), una pregunta de comprobación cuando la hay, «Saber más» y las fuentes
// de cada frase. Al terminar: evaluarse, la lección siguiente o seguir con la sesión.
import * as P from '../../biblioteca/progreso.js';
import { mallas } from '../../biblioteca/formato.js';
import { frases, evidencias } from '../../biblioteca/formato.js';
import { instanciar, corregir, NO_LO_SE } from '../../biblioteca/evaluar.js';
import { FUENTES } from '../../content/fuentes.js';
import { t, idioma } from '../../i18n/idioma.js';
import { tr, trCita } from '../../i18n/contenido.js';
import { botonReportar, enlazarReportar } from './reportar.js';
import { crearCronometro } from '../../biblioteca/eventos.js';
import { esc, icono, fechaDia } from './comun.js';
import { abrirLeccion, evaluarLeccion, siguienteDeSesion, avanzarSesion } from './explorar.js';

const CAMARA = (nombre) => t(`camara.${nombre}`);

/** Nombre de una estructura de la lección (traducido si la lección es de un módulo antiguo). */
export const nombreE = (L, id) => tr(L.estructuras[id]?.nombre ?? id);

/** Texto de un paso: las frases, con las instrucciones y las notas sobre el modelo aparte. */
function htmlFrases(lista) {
  const normales = [];
  const out = [];
  const vaciar = () => { if (normales.length) out.push(`<p class="step-text">${normales.splice(0).map((f) => esc(tr(f[0]))).join(' ')}</p>`); };
  for (const f of lista) {
    if (f.slice(1).some((e) => e?.guia)) { vaciar(); out.push(`<p class="bib-guia">${icono('pointer')}<span>${esc(tr(f[0]))}</span></p>`); }
    else if (f.slice(1).some((e) => e?.modelo)) { vaciar(); out.push(`<p class="bib-modelo">${icono('info')}<span>${esc(tr(f[0]))}</span></p>`); }
    else normales.push(f);
  }
  vaciar();
  return out.join('');
}

/**
 * Fuentes de un paso: cada página, con las frases citadas (en el idioma de la fuente). `L`: la lección, cuyas fuentes
 * propias (las que bajó Neuri para una lección creada con IA) no están en el registro de la biblioteca.
 */
export function htmlFuentes(ctx, lista, L = null) {
  const porFuente = new Map();
  for (const e of lista) {
    if (e.m) { porFuente.set(`m:${e.m}`, { m: e.m, citas: [] }); continue; }
    const x = porFuente.get(e.f) ?? { f: e.f, citas: [] };
    if (!x.citas.includes(e.c)) x.citas.push(e.c);
    porFuente.set(e.f, x);
  }
  if (!porFuente.size) return '';
  const items = [...porFuente.values()].map((x) => {
    if (x.m) {
      const f = FUENTES[x.m];
      return f ? `<li><a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(trCita(f.texto))}</a></li>` : '';
    }
    const reg = ctx.fuentes?.[x.f] ?? L?.fuentesUsadas?.[x.f];
    const nombre = reg ? `${x.f.startsWith('tma:') ? 'TeachMeAnatomy' : x.f.startsWith('wpes:') ? t('bib.wikipediaEs') : t('bib.wikipediaEn')}: «${reg.titulo}»` : x.f;
    const version = reg?.revid ? t('bib.revisionDel', { fecha: fechaDia(reg.fecha) }) : reg?.actualizada ? t('bib.actualizada', { fecha: fechaDia(reg.actualizada) }) : '';
    return `<li><a href="${esc(reg?.url ?? '#')}" target="_blank" rel="noopener">${esc(nombre)}</a> <small>${esc(version)}${reg?.licencia ? ` · ${esc(reg.licencia)}` : ''}</small>
      <ul class="bib-citas">${x.citas.map((c) => `<li lang="${x.f.startsWith('wpes:') ? 'es' : 'en'}">“${esc(c)}”</li>`).join('')}</ul></li>`;
  }).join('');
  return `<details class="bib-fuentes"><summary>${icono('quote')}${esc(t('bib.fuentesPaso', { n: porFuente.size }))}</summary>
    <p class="muted small">${esc(t('bib.fuentesExplica'))}</p><ul>${items}</ul></details>`;
}

export async function renderLeccion(ctx) {
  const { body, vista, api } = ctx;
  const L = await ctx.cargarLeccion(vista.id);
  if (!L) return ctx.volver();
  if (vista.fin) return renderFin(ctx, L);
  const i = Math.max(0, Math.min(vista.paso ?? 0, L.pasos.length - 1));
  const s = L.pasos[i];
  // Estadísticas (si se activaron): empezar o retomar la lección, una vez por apertura, y su tiempo activo.
  if (!vista.registrada) {
    vista.registrada = true;
    const antes = ctx.data.lecciones[L.id]?.vistos?.length ?? 0;
    const propia = !!L.origen?.neuri;
    if (antes) ctx.evento?.('leccion_retomada', { leccion: L.id, version: L.version, paso: i, propia });
    else ctx.evento?.('leccion_iniciada', { leccion: L.id, version: L.version, propia }, { clave: `${L.id}:${L.version}` });
    if (propia) ctx.evento?.('leccion_personal_abierta', {});
    vista.crono = crearCronometro();
  }
  ctx.crono = vista.crono;
  P.verPaso(ctx.data, L, i);
  ctx.guardar();
  const prog = ctx.data.lecciones[L.id];
  const ultimo = i === L.pasos.length - 1;
  const modelo = api.modelo();
  const fueraDeModelo = !L.modelos.includes(modelo);
  const v = s.vista;
  const verIds = v ? [...(v.ver ?? [])] : [];
  // Chips del contexto: sin los huesos de referencia ni lo que la lección restringe al otro modelo.
  const deEsteModelo = (id) => !L.estructuras[id]?.modelos || L.estructuras[id].modelos.includes(modelo);
  const ctxIds = v ? (v.contexto ?? []).filter((id) => (L.estructuras[id]?.papel === 'nucleo' || L.estructuras[id]?.tipo !== 'hueso') && deEsteModelo(id)) : [];
  const comp = s.comprobar && L.preguntas.find((q) => q.id === s.comprobar);
  vista.comp ??= {};
  if (comp && !vista.comp[s.id]) vista.comp[s.id] = { q: instanciar(L, comp), r: null };
  const cq = comp && vista.comp[s.id];
  const todasEv = [...frases(s.texto), ...frases(s.detalle)].flatMap(evidencias);
  if (cq) todasEv.push(...(cq.q.evidencia ?? []));

  body.innerHTML = `
    <button class="link back" data-salir>${icono('chevron')}<span>${esc(t('bib.biblioteca'))}</span></button>
    <p class="bib-leccion-t">${esc(tr(L.titulo))}</p>
    <nav class="bib-pasos" aria-label="${esc(t('bib.pasosLeccion'))}">${L.pasos.map((p, k) => {
      const visto = prog.vistos.includes(p.id);
      return `<button class="bib-punto ${k === i ? 'actual' : visto ? 'visto' : ''}" data-ir-paso="${k}" ${visto || k === i ? '' : 'disabled'}
        aria-label="${esc(t('bib.irPaso', { n: k + 1, titulo: tr(p.titulo) }))}" ${k === i ? 'aria-current="step"' : ''}></button>`;
    }).join('')}</nav>
    <p class="step-count">${esc(t('estudio.paso', { n: i + 1, total: L.pasos.length }))} · ${esc(t(`paso.${s.tipo}`))}</p>
    <h3 class="step-title" tabindex="-1">${esc(tr(s.titulo))}</h3>
    ${fueraDeModelo ? `<p class="mod-note">${esc(t(`bib.soloModelo.${L.modelos[0]}`))}</p>` : ''}
    <div class="bib-aviso-vista" aria-live="polite"></div>
    ${htmlFrases(frases(s.texto))}
    ${s.detalle ? `<details class="bib-mas"><summary>${esc(t('bib.saberMas'))}</summary>${htmlFrases(frases(s.detalle))}</details>` : ''}
    ${verIds.length || ctxIds.length ? `<div class="bib-en3d"><p class="bib-en3d-t">${esc(t('bib.enElModelo'))}</p>
      <ul class="bib-chips">${verIds.map((id) => `<li><button class="bib-chip resaltada" data-resaltar="${esc(id)}">${esc(nombreE(L, id))}</button></li>`).join('')}${ctxIds.map((id) => `<li><button class="bib-chip" data-resaltar="${esc(id)}">${esc(nombreE(L, id))}</button></li>`).join('')}</ul></div>` : ''}
    ${s.actividad ? htmlActividad(L, s.actividad) : ''}
    ${cq ? htmlComprobar(L, cq) : ''}
    ${v ? `<p class="bib-vista-acc"><button class="link" data-recuperar>${icono('restart')}${esc(t('bib.recuperarVista'))}</button></p>` : ''}
    ${htmlFuentes(ctx, todasEv, L)}
    <p class="bib-rep-fila">${botonReportar()}</p>
    <div class="step-nav">
      <button class="btn" data-paso="anterior" ${i ? '' : 'disabled'}>${esc(t('estudio.anterior'))}</button>
      <button class="btn primary" data-paso="siguiente">${esc(t(ultimo ? 'estudio.terminar' : 'estudio.siguiente'))}</button>
    </div>`;

  // ── 3D ──
  const avisar = (texto) => { const el = body.querySelector('.bib-aviso-vista'); if (el) el.innerHTML = texto ? `<p class="mod-note">${esc(texto)}</p>` : ''; };
  const mostrar = async (opciones = {}) => {
    if (!v || fueraDeModelo) return;
    const r = await api.mostrar(L, v, opciones);
    if (ctx.vista !== vista) return;
    if (!r.ok && r.faltan.length) {
      avisar(t('bib.faltanEnModelo', { lista: r.faltan.map((id) => nombreE(L, id)).join(', ') }));
      ctx.evento?.('error_tecnico', { codigo: 'faltan-estructuras', donde: 'leccion' }, { clave: `${L.id}:${s.id}` });
    }
  };
  mostrar();

  // ── Eventos ──
  body.querySelector('[data-salir]').addEventListener('click', () => { api.alTocar(null); ctx.volver(); });
  body.querySelectorAll('[data-ir-paso]').forEach((b) => b.addEventListener('click', () => irPaso(Number(b.dataset.irPaso))));
  body.querySelector('[data-paso="anterior"]').addEventListener('click', () => irPaso(i - 1));
  body.querySelector('[data-paso="siguiente"]').addEventListener('click', () => {
    if (!ultimo) return irPaso(i + 1);
    P.completar(ctx.data, L);
    ctx.guardar();
    ctx.evento?.('leccion_completada', { leccion: L.id, version: L.version, segundosActivos: vista.crono?.segundos() ?? 0, propia: !!L.origen?.neuri }, { clave: `${L.id}:${L.version}` });
    ctx.crono = null;
    api.alTocar(null);
    ctx.ir({ ...vista, fin: true }, { reemplazar: true });
  });
  body.querySelectorAll('[data-resaltar]').forEach((b) => b.addEventListener('click', () => api.resaltar(L, [b.dataset.resaltar], { lado: v?.lado ?? 'R' })));
  body.querySelector('[data-recuperar]')?.addEventListener('click', () => { avisar(''); mostrar(); });
  enlazarActividad(ctx, L, s, body, mostrar);
  if (cq) enlazarComprobar(ctx, L, s, cq, body);
  enlazarReportar(body, () => ({ vista: 'leccion', leccion: L.id, version: L.version, paso: s.id, estructura: v?.ver?.[0] ?? null, idioma: idioma(), modelo: api.modelo() }), { alEnviar: ctx.alReportar });
  requestAnimationFrame(() => body.querySelector('.step-title')?.focus({ preventScroll: false }));

  function irPaso(k) {
    api.alTocar(null);
    ctx.ir({ ...vista, paso: k }, { reemplazar: true });
  }
}

function htmlActividad(L, a) {
  if (a.tipo === 'vistas') {
    return `<div class="bib-actividad"><p class="bib-act-t">${icono('rotate')}${esc(tr(a.texto))}</p>
      <div class="bib-acciones">${a.vistas.map((x) => `<button class="btn" data-camara="${x.camara}">${esc(tr(x.nombre))}</button>`).join('')}</div></div>`;
  }
  if (a.tipo === 'comparar') {
    return `<div class="bib-actividad"><p class="bib-act-t">${icono('compare')}${esc(tr(a.texto))}</p>
      <div class="bib-acciones">${a.estructuras.map((id) => `<button class="btn" data-comparar="${esc(id)}">${esc(nombreE(L, id))}</button>`).join('')}</div></div>`;
  }
  return `<div class="bib-actividad"><p class="bib-act-t">${icono('pointer')}${esc(tr(a.texto))}</p>
    <div class="bib-acciones"><button class="btn primary" data-localizar>${esc(t('bib.localizarEmpezar'))}</button>
    <button class="link" data-solucion hidden>${esc(t('bib.mostrarSolucion'))}</button></div>
    <p class="bib-act-r" aria-live="polite"></p></div>`;
}

function enlazarActividad(ctx, L, s, body, mostrar) {
  const a = s.actividad;
  if (!a) return;
  const lado = s.vista?.lado ?? 'R';
  body.querySelectorAll('[data-camara]').forEach((b) => b.addEventListener('click', () => ctx.api.camara(b.dataset.camara, lado)));
  body.querySelectorAll('[data-comparar]').forEach((b) => b.addEventListener('click', () => {
    body.querySelectorAll('[data-comparar]').forEach((x) => x.classList.toggle('primary', x === b));
    ctx.api.resaltar(L, [b.dataset.comparar], { lado, ficha: false });
  }));
  const loc = body.querySelector('[data-localizar]');
  if (!loc) return;
  const res = body.querySelector('.bib-act-r');
  const objetivo = L.estructuras[a.estructura];
  loc.addEventListener('click', async () => {
    await mostrar({ sinResaltar: true });
    res.textContent = t('bib.tocaModelo');
    body.querySelector('[data-solucion]').hidden = false;
    ctx.api.alTocar((pieza) => {
      if (!pieza) return true;
      const base = pieza.id;
      if (mallas(objetivo, 'L').includes(base) || mallas(objetivo, 'R').includes(base)) {
        res.innerHTML = `${icono('check')} ${esc(t('bib.localizarBien', { nombre: nombreE(L, a.estructura) }))}`;
        res.className = 'bib-act-r ok';
        ctx.api.alTocar(null);
        ctx.api.resaltar(L, [a.estructura], { lado, ficha: false });
      } else {
        const otra = Object.entries(L.estructuras).find(([, e]) => mallas(e, 'L').includes(base) || mallas(e, 'R').includes(base));
        res.textContent = otra ? t('bib.localizarOtra', { nombre: nombreE(L, otra[0]) }) : t('bib.localizarFuera', { nombre: pieza.info?.title ?? '' });
        res.className = 'bib-act-r mal';
      }
      return true;
    });
  });
  body.querySelector('[data-solucion]').addEventListener('click', () => {
    ctx.api.alTocar(null);
    ctx.api.resaltar(L, [a.estructura], { lado, ficha: false });
    res.textContent = t('bib.esta', { nombre: nombreE(L, a.estructura) });
    res.className = 'bib-act-r';
  });
}

// Pregunta de comprobación dentro de un paso: práctica, no cuenta para el dominio.
function htmlComprobar(L, cq) {
  const { q, r } = cq;
  const hecho = r !== null;
  return `<div class="bib-comprobar" role="group" aria-label="${esc(t('bib.compruebalo'))}">
    <p class="bib-act-t">${icono('target')}${esc(t('bib.compruebalo'))}</p>
    <p class="q-text">${esc(tr(q.enunciado))}</p>
    <div class="q-opts">${q.opciones.map((o, k) => {
      const cls = hecho ? (o.correcta ? 'ok' : r.opcion === k ? 'bad' : '') : '';
      return `<button class="opt ${cls}" data-cq="${k}" ${hecho ? 'disabled' : ''}><span>${esc(tr(o.texto))}</span>${hecho && o.correcta ? icono('check') : hecho && r.opcion === k ? icono('wrong') : ''}</button>`;
    }).join('')}</div>
    ${hecho ? `<p class="q-result ${r.resultado}">${esc(t(r.resultado === 'fallo' ? 'bib.compruebaMal' : 'estudio.correcto'))}</p><p class="q-expl">${esc(tr(q.explicacion))}</p>` : ''}
  </div>`;
}

function enlazarComprobar(ctx, L, s, cq, body) {
  body.querySelectorAll('[data-cq]').forEach((b) => b.addEventListener('click', () => {
    const opcion = Number(b.dataset.cq);
    cq.r = { opcion, resultado: corregir(cq.q, opcion) };
    // Práctica dentro de la lección (con el contenido a la vista): se anota, pero no cuenta para el repaso ni el dominio.
    P.registrarIntento(ctx.data, { leccion: L.id, version: L.version, pregunta: cq.q.id, tipo: cq.q.tipo, objetivo: cq.q.objetivo, resultado: cq.r.resultado, elegida: cq.q.opciones[opcion]?.texto ?? null, modo: 'leccion' });
    ctx.guardar();
    const caja = body.querySelector('.bib-comprobar');
    caja.outerHTML = htmlComprobar(L, cq);
    body.querySelector('.bib-comprobar .q-result')?.focus?.();
  }));
}

// ── Final de la lección ──
function renderFin(ctx, L) {
  const { body } = ctx;
  const sig = (L.siguiente ?? []).filter((id) => ctx.porId.has(id));
  const sesion = siguienteDeSesion(ctx);
  ctx.api.alTocar(null);
  body.innerHTML = `
    <button class="link back" data-salir>${icono('chevron')}<span>${esc(t('bib.biblioteca'))}</span></button>
    <p class="bib-leccion-t">${esc(tr(L.titulo))}</p>
    <h3 class="step-title" tabindex="-1">${icono('check')} ${esc(t('bib.leccionTerminada'))}</h3>
    <p class="step-text">${esc(t('bib.finExplica'))}</p>
    <div class="bib-acciones bib-col">
      ${sesion ? `<button class="btn primary" data-sesion>${esc(sesion)}</button>` : ''}
      <button class="btn ${sesion ? '' : 'primary'}" data-evaluar>${esc(t('bib.evaluarmeAhora'))}</button>
      ${sig.map((id) => `<button class="btn" data-sig="${esc(id)}">${esc(t('bib.siguienteLeccion', { titulo: tr(ctx.porId.get(id).titulo) }))}</button>`).join('')}
      <button class="btn" data-repetir>${esc(t('bib.repasarPasos'))}</button>
    </div>
    <p class="muted small">${esc(t('bib.finNota'))}</p>`;
  body.querySelector('[data-salir]').addEventListener('click', () => ctx.volver());
  body.querySelector('[data-sesion]')?.addEventListener('click', () => avanzarSesion(ctx));
  body.querySelector('[data-evaluar]').addEventListener('click', () => evaluarLeccion(ctx, L.id));
  body.querySelectorAll('[data-sig]').forEach((b) => b.addEventListener('click', () => abrirLeccion(ctx, b.dataset.sig, { paso: 0 })));
  body.querySelector('[data-repetir]').addEventListener('click', () => ctx.ir({ tipo: 'leccion', id: L.id, paso: 0 }, { reemplazar: true }));
  requestAnimationFrame(() => body.querySelector('.step-title')?.focus());
}

export { CAMARA, NO_LO_SE };
