import { uiIcon } from './icons.js';
import { GRUPOS } from '../data/grupos.js';
import { fichaDePieza } from '../content/index.js';
import { CAMPOS, ESTADOS } from '../content/schema.js';
import { FUENTES } from '../content/fuentes.js';
import { t, tn, etiqueta, idioma } from '../i18n/idioma.js';
import { tr, trCita, trEtimologia } from '../i18n/contenido.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Ruta jerárquica de una parte: grupos conocidos desde la raíz hasta la parte.
export function crumbsOf(groups) {
  return [...groups].reverse().filter((g) => GRUPOS[g]);
}

const ACTIONS = [
  ['hide', 'hide', 'accion.ocultar'],
  ['isolate', 'isolate', 'accion.aislar'],
  ['fadeOthers', 'fadeOthers', 'accion.atenuarResto'],
  ['fade', 'fade', 'accion.transparentar'],
  ['focus', 'focus', 'accion.centrar'],
];

// El contenido de las fichas se escribe en español; en otro idioma se muestra su traducción (i18n/contenido.js), hecha
// con IA y sin revisar: la ficha lo dice al final.
const notaTraduccion = () => (idioma() === 'es' ? '' : `<p class="info-traduccion">${esc(t('ficha.traduccion'))}</p>`);
// Fecha «2026-11-02» con el formato del idioma.
const fechaLocal = (f) => (/^\d{4}-\d{2}-\d{2}$/.test(f ?? '') ? new Date(`${f}T12:00:00`).toLocaleDateString(idioma(), { day: 'numeric', month: 'long', year: 'numeric' }) : f ?? '');

const FIELD_LABELS_MODULO = new Set(['Origen', 'Inserción', 'Acción', 'Inervación', 'Irrigación', 'Función']);

// Cuerpo de la ficha cuando la pieza pertenece a un módulo de estudio (src/content): su contenido con fuentes sustituye
// a la descripción y los puntos clave antiguos (sin fuentes, y con correlaciones clínicas que no se han revisado); se
// conservan la etimología y los datos que el módulo no trae (región, parte…).
function studyBody(hit, info, entry, latines) {
  const { modulo, ficha } = hit;
  const labels = CAMPOS[ficha.tipo];
  const campos = [
    ...(ficha.funcion ? [['Función', ficha.funcion]] : []),
    ...Object.entries(ficha.campos).map(([k, v]) => [labels[k], v]),
    ...(info.fields ?? []).filter((f) => !FIELD_LABELS_MODULO.has(f.label) && !Object.values(labels).includes(f.label)).map((f) => [f.label, f.value]),
  ];
  const estado = ficha.revision.estado;
  const conjunto = ficha.nombre.toLowerCase() !== (info.tituloEs ?? info.title).toLowerCase() && ficha.piezas.length > 1;
  const term = ficha.fuentes.terminologia.map((x) => ({ ...FUENTES[x.fuente], texto: `${FUENTES[x.fuente].texto}, ${t('ficha.termino', { n: x.termino })}` }));
  const cont = ficha.fuentes.contenido.map((c) => ({ ...FUENTES[c.fuente], apoya: c.apoya }));
  // Campo que respalda una fuente, en minúscula (en alemán, con su mayúscula de sustantivo).
  const campoDe = (k) => {
    const e = etiqueta(k === 'descripcion' ? 'Descripción' : k === 'funcion' ? 'Función' : labels[k] ?? k);
    return idioma() === 'de' ? e : e.toLocaleLowerCase(idioma());
  };
  const link = (f) => (f.url ? `<a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(trCita(f.texto))}</a>` : esc(trCita(f.texto)));
  return `
    <section class="study-head">
      <span class="study-tag">${esc(t('ficha.modulo'))} · ${esc(tr(modulo.titulo).split(':')[0])}</span>
      <span class="review-badge ${estado}" title="${esc(tr(ficha.revision.notas ?? ''))}">${esc(etiqueta(ESTADOS[estado]))}</span>
    </section>
    ${conjunto ? `<p class="study-whole">${esc(t('ficha.conjunto'))} <b>${esc(tr(ficha.nombre))}</b></p>` : ''}
    <section><p class="lead">${esc(tr(ficha.descripcion))}</p></section>
    <section><dl class="fields">${campos.map(([l, v]) => `<dt>${esc(etiqueta(l))}</dt><dd>${esc(tr(v))}</dd>`).join('')}</dl></section>
    ${ficha.relaciones.length ? `<section><h3>${esc(t('ficha.relaciones'))}</h3><ul class="relations">${ficha.relaciones.map((r) => `
      <li>${esc(tr(r.texto))}${r.con ? ` <button class="rel-link" data-ficha="${esc(r.con)}">${esc(t('ficha.ver'))}</button>` : ''}</li>`).join('')}</ul></section>` : ''}
    ${ficha.simplificaciones.length ? `<section><h3>${esc(t('ficha.simplificaciones'))}</h3><ul class="facts">${ficha.simplificaciones.map((x) => `<li>${esc(tr(x))}</li>`).join('')}</ul></section>` : ''}
    ${entry?.etimologia ? `<section class="etym"><h3>${esc(t('ficha.etimologia'))}</h3><p>${esc(trEtimologia(entry.etimologia, latines))}</p></section>` : ''}
    ${info.source ? `<p class="info-source">${esc(t('ficha.modelo3d'))} ${esc(info.source)}</p>` : ''}
    <details class="info-refs"><summary>${esc(t('ficha.fuentes'))}</summary>
      <p class="refs-group">${esc(t('ficha.terminologia'))}</p>
      <ul>${term.map((f) => `<li>${link(f)}</li>`).join('')}</ul>
      <p class="refs-group">${esc(t('ficha.contenido'))}</p>
      <ul>${cont.map((f) => `<li>${link(f)}${f.actualizada ? ` ${esc(t('ficha.actualizada', { fecha: fechaLocal(f.actualizada) }))}` : ''}. ${esc(t('ficha.respalda', { campos: f.apoya.map(campoDe).join(', ') }))}</li>`).join('')}</ul>
      <p>${esc(tr(ficha.revision.notas ?? ''))} ${esc(t('ficha.consultadas', { fecha: fechaLocal(term[0]?.consultada ?? cont[0]?.consultada) }))}</p>
    </details>
    ${notaTraduccion()}`;
}

// Ficha de la selección: una estructura o un grupo completo.
// sel = { kind: 'part', part } | { kind: 'group', id, parts, members }
// modelo: 'male' | 'female' (para las fichas de módulo); onFicha(id): abrir la estructura de una relación.
export function renderInfo(el, sel, { system, faded, collapsed, modelo, onAction, onCrumb, onMember, onFicha }) {
  if (!sel) {
    el.classList.remove('open');
    return;
  }
  const isGroup = sel.kind === 'group';
  const info = isGroup ? null : sel.part.info;
  const group = isGroup ? GRUPOS[sel.id] : null;
  const entry = info?.entry;
  const latines = isGroup ? [] : [info.latin, sel.part.extras?.name_la];
  const study = isGroup ? null : fichaDePieza(sel.part.id, modelo);
  const crumbs = isGroup ? crumbsOf(sel.parts[0].groups).slice(0, crumbsOf(sel.parts[0].groups).indexOf(sel.id)) : crumbsOf(sel.part.groups);
  const meta = isGroup
    ? [tn('ficha.estructuras', sel.parts.length)]
    : [...info.chips, info.tissue].filter(Boolean).map(etiqueta);
  const titulo = isGroup ? group.nombre : info.title;
  const latin = isGroup ? group.latin : info.latin;

  el.style.setProperty('--sys', system.color);
  el.classList.toggle('collapsed', collapsed);
  el.innerHTML = `
    <button class="info-grip" data-act="toggle" aria-label="${esc(t(collapsed ? 'ficha.verCompleta' : 'ficha.contraer'))}"><span></span></button>
    <div class="info-head">
      <nav class="crumbs" aria-label="${esc(t('ficha.ubicacion'))}">
        ${crumbs.map((g) => `<button data-crumb="${g}">${esc(GRUPOS[g].nombre)}</button>`).join(uiIcon('chevron'))}
      </nav>
      <button class="icon-btn" data-act="close" aria-label="${esc(t('comun.cerrar'))}">${uiIcon('close')}</button>
    </div>
    <h2 class="info-title">${esc(titulo)}</h2>
    ${latin && latin !== titulo ? `<p class="info-latin">${esc(latin)}</p>` : ''}
    <p class="info-meta"><i></i>${meta.map(esc).join('<span>·</span>')}</p>
    <div class="info-actions">
      ${ACTIONS.map(([act, icon, clave]) => {
        const on = act === 'fade' && faded;
        const label = t(clave);
        return `<button data-act="${act}" class="${on ? 'on' : ''}" title="${esc(label)}">${uiIcon(icon)}<span>${esc(on ? t('accion.opaco') : label)}</span></button>`;
      }).join('')}
    </div>
    <div class="info-body">
      ${isGroup ? `
        ${group.descripcion ? `<section><p class="lead">${esc(tr(group.descripcion))}</p></section>` : ''}
        <section><h3>${esc(t('ficha.contiene'))}</h3><ul class="members">${sel.members.map((m) => `
          <li><button data-member="${esc(m.id)}" data-kind="${m.kind}">${esc(m.label)}${m.count > 1 ? `<small>${m.count}</small>` : ''}${uiIcon('chevron')}</button></li>`).join('')}
        </ul></section>
        ${group.descripcion ? notaTraduccion() : ''}
      ` : study ? studyBody(study, info, entry, latines) : `
        ${entry ? '' : `<section><p class="muted">${esc(t('ficha.enPreparacion'))}</p></section>`}
        ${entry ? `
          ${entry.descripcion ? `<section><p class="lead">${esc(tr(entry.descripcion))}</p></section>` : ''}
          ${info.fields?.length ? `<section><dl class="fields">${info.fields.map((f) => `<dt>${esc(etiqueta(f.label))}</dt><dd>${esc(tr(f.value))}</dd>`).join('')}</dl></section>` : ''}
          ${entry.etimologia ? `<section class="etym"><h3>${esc(t('ficha.etimologia'))}</h3><p>${esc(trEtimologia(entry.etimologia, latines))}</p></section>` : ''}
          ${info.datos.length ? `<section><h3>${esc(t('ficha.puntosClave'))}</h3><ul class="facts">${info.datos.map((d) => `<li>${esc(tr(d))}</li>`).join('')}</ul></section>` : ''}` : ''}
        ${info.fuentes ? `
          <details class="info-refs"><summary>${esc(t('ficha.fuentes'))}</summary>
            <ul>${info.fuentes.lista.map((f) => `
              <li><b>${esc(tr(f.papel))}:</b> <a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(trCita(f.texto))}</a></li>`).join('')}
            </ul>
            <p>${esc(tr(info.fuentes.nota))}</p>
          </details>` : ''}
        ${info.source ? `<p class="info-source">${esc(t('ficha.modelo3d'))} ${esc(info.source)}</p>` : ''}
        ${entry ? notaTraduccion() : ''}`}
    </div>`;
  el.querySelectorAll('[data-act]').forEach((b) => b.addEventListener('click', () => onAction(b.dataset.act)));
  el.querySelectorAll('[data-crumb]').forEach((b) => b.addEventListener('click', () => onCrumb(b.dataset.crumb)));
  el.querySelectorAll('[data-member]').forEach((b) => b.addEventListener('click', () => onMember(b.dataset.kind, b.dataset.member)));
  el.querySelectorAll('[data-ficha]').forEach((b) => b.addEventListener('click', () => onFicha?.(b.dataset.ficha)));
  el.classList.add('open');
  el.querySelector('.info-body').scrollTop = 0;
}
