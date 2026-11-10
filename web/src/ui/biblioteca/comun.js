// Piezas comunes de la interfaz de la biblioteca: escape de HTML, tarjetas, etiquetas y barras de progreso.
import { uiIcon } from '../icons.js';
import { t, tn, idioma } from '../../i18n/idioma.js';
import { tr } from '../../i18n/contenido.js';
import { REGION_POR_ID, SUBREGION_POR_ID, SISTEMA_POR_ID, NIVEL_POR_ID, FORMATO_POR_ID, TEMA_POR_ID } from '../../biblioteca/taxonomia.js';
import { etiqueta } from '../../i18n/idioma.js';

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
export const icono = uiIcon;
export const fecha = (ms) => new Date(ms).toLocaleDateString(idioma(), { day: 'numeric', month: 'short' });
/** Un día escrito «2026-11-09» (sin hora), sin que la zona horaria lo cambie: `Date.parse` lo lee en UTC y en América
 * sería el día anterior. */
export function fechaDia(s) {
  const [y, m, d] = String(s ?? '').split('-').map(Number);
  return y && m && d ? fecha(new Date(y, m - 1, d).getTime()) : '';
}

// La taxonomía está en español; sus nombres pasan por las etiquetas traducidas de la interfaz (textos.js, ETIQUETAS).
export const nomRegion = (id) => etiqueta(REGION_POR_ID.get(id)?.nombre ?? id);
export const nomSub = (id) => etiqueta(SUBREGION_POR_ID.get(id)?.nombre ?? id);
export const nomLugar = ([r, s]) => [nomRegion(r), s && nomSub(s)].filter(Boolean).join(' › ');
/** Varios lugares agrupados por región: «Miembro superior › Hombro, Cintura escapular · Tórax › Mama». */
export function nomLugares(lugares) {
  const porRegion = new Map();
  for (const [r, s] of lugares) {
    const subs = porRegion.get(r) ?? [];
    if (s) subs.push(nomSub(s));
    porRegion.set(r, subs);
  }
  return [...porRegion].map(([r, subs]) => [nomRegion(r), subs.join(', ')].filter(Boolean).join(' › ')).join(' · ');
}
export const nomTema = (id) => etiqueta(TEMA_POR_ID.get(id)?.nombre ?? id);
export const nomSistema = (id) => etiqueta(SISTEMA_POR_ID.get(id)?.corto ?? id);
export const nomNivel = (n) => etiqueta(NIVEL_POR_ID.get(n)?.nombre ?? '');
export const nomFormato = (id) => etiqueta(FORMATO_POR_ID.get(id)?.nombre ?? id);

/** Nombre de un idioma en el de la interfaz («inglés», «English»…). */
export function nombreIdioma(id) {
  try { return new Intl.DisplayNames([idioma()], { type: 'language' }).of(id) ?? id; } catch { return id; }
}

/** ¿La lección se puede leer en el idioma de la interfaz? Si no, se avisa: «Solo en español». */
export const enEsteIdioma = (L) => (L.idiomas ?? ['es']).includes(idioma());

export function chipsMeta(L) {
  const lugar = L.lugares?.length ? nomLugares(L.lugares) : t('bib.todoElCuerpo');
  const partes = [
    `<span>${esc(lugar)}</span>`,
    `<span>${esc(L.sistemas.slice(0, 2).map(nomSistema).join(', '))}</span>`,
    `<span>${esc(nomNivel(L.nivel))}</span>`,
    `<span>${icono('clock')}${esc(t('bib.minutos', { n: L.minutos }))}</span>`,
  ];
  if (!enEsteIdioma(L)) partes.push(`<span class="bib-idioma">${esc(L.idiomas?.[0] && L.idiomas[0] !== 'es' ? t('pet.soloIdioma', { idioma: nombreIdioma(L.idiomas[0]) }) : t('bib.soloEspanol'))}</span>`);
  if (L.propia) partes.push(`<span class="bib-propia">${icono('sparkles')}${esc(t('pet.propia'))}</span>`);
  return `<p class="bib-meta">${partes.join('')}</p>`;
}

/** Barra de avance (pasos vistos) con su texto para el lector de pantalla. */
export function barra(valor, total, texto) {
  const p = total ? Math.round((100 * valor) / total) : 0;
  return `<div class="bib-barra" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${valor}" aria-label="${esc(texto)}"><i style="width:${p}%"></i></div>`;
}

export function etiquetaEstado(e) {
  return `<span class="bib-estado ${e.estado}">${esc(t(`progreso.${e.estado}`))}</span>`;
}

/**
 * Tarjeta de una lección del catálogo. `e`: su estado (progreso.estadoLeccion); `fav`: si está guardada; `nota`: por
 * qué la recomienda Neuri.
 */
export function tarjetaLeccion(L, e, fav, { compacta = false, nota = '' } = {}) {
  const accion = e.estado === 'en-curso' ? 'bib.seguir' : e.estado === 'sin-empezar' ? 'bib.empezar' : 'bib.repetir';
  return `
  <article class="bib-card" data-leccion="${esc(L.id)}">
    <div class="bib-card-head">
      <h3><button class="bib-titulo" data-ir="info">${esc(tr(L.titulo))}</button></h3>
      <button class="bib-fav ${fav ? 'on' : ''}" data-fav aria-pressed="${fav}" aria-label="${esc(t(fav ? 'bib.quitarGuardada' : 'bib.guardar'))}">${icono('star')}</button>
    </div>
    ${nota ? `<p class="bib-nota-pet">${icono('sparkles')}<span>${esc(nota)}</span></p>` : ''}
    ${compacta ? '' : `<p class="bib-resumen">${esc(tr(L.resumen))}</p>`}
    ${chipsMeta(L)}
    <div class="bib-card-foot">
      ${e.estado === 'sin-empezar' ? `<span class="bib-nuevo">${esc(t('bib.pasos', { n: e.total }))}</span>` : `${barra(e.vistos, e.total, t('bib.avance', { a: e.vistos, b: e.total }))}${etiquetaEstado(e)}`}
      ${e.pendientes ? `<span class="bib-repaso">${icono('repeat')}${esc(tn('bib.pendientes', e.pendientes))}</span>` : ''}
      <button class="btn ${e.estado === 'en-curso' ? 'primary' : ''}" data-ir="leccion">${esc(t(accion))}</button>
    </div>
  </article>`;
}

/** Tarjeta de un recorrido: alcance, duración y avance (lecciones terminadas de las disponibles). */
export function tarjetaRecorrido(R, r, fav) {
  return `
  <article class="bib-card bib-rec" data-recorrido="${esc(R.id)}">
    <div class="bib-card-head">
      <h3><button class="bib-titulo" data-ir="recorrido">${icono('route')}<span>${esc(t(`rec.${R.id}.titulo`))}</span></button></h3>
      <button class="bib-fav ${fav ? 'on' : ''}" data-fav aria-pressed="${fav}" aria-label="${esc(t(fav ? 'bib.quitarGuardada' : 'bib.guardar'))}">${icono('star')}</button>
    </div>
    <p class="bib-resumen">${esc(t(`rec.${R.id}.descripcion`))}</p>
    <p class="bib-meta"><span>${esc(tn('bib.nModulos', R.modulos.length))}</span><span>${esc(t('bib.leccionesDe', { a: r.disponibles, b: r.total }))}</span><span>${icono('clock')}${esc(t('bib.minutos', { n: r.minutos }))}</span></p>
    <div class="bib-card-foot">
      ${barra(r.hechas, r.disponibles, t('bib.recAvance', { a: r.hechas, b: r.disponibles }))}
      <span class="bib-nuevo">${esc(t('bib.recAvance', { a: r.hechas, b: r.disponibles }))}</span>
      <button class="btn" data-ir="recorrido">${esc(t('bib.ver'))}</button>
    </div>
  </article>`;
}

export const vacio = (texto) => `<p class="bib-vacio">${esc(texto)}</p>`;

/** Descarga un texto como archivo (JSON de «Mis lecciones», una lección, lo apartado…). Devuelve si se pudo. */
export function descargarArchivo(nombre, texto, tipo = 'application/json') {
  try {
    const url = URL.createObjectURL(new Blob([texto], { type: tipo }));
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
    return true;
  } catch { return false; }
}

/** La fecha de hoy como AAAA-MM-DD (en la hora local), para nombres de archivo. */
export function hoyISO(ahora = new Date()) {
  const d = new Date(ahora);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
