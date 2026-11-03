import { uiIcon } from './icons.js';
import { GRUPOS } from '../data/grupos.js';
import { fichaDePieza } from '../content/index.js';
import { CAMPOS, ESTADOS } from '../content/schema.js';
import { FUENTES } from '../content/fuentes.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Ruta jerárquica de una parte: grupos conocidos desde la raíz hasta la parte.
export function crumbsOf(groups) {
  return [...groups].reverse().filter((g) => GRUPOS[g]);
}

const ACTIONS = [
  ['hide', 'hide', 'Ocultar'],
  ['isolate', 'isolate', 'Aislar'],
  ['fadeOthers', 'fadeOthers', 'Atenuar resto'],
  ['fade', 'fade', 'Transparentar'],
  ['focus', 'focus', 'Centrar'],
];

const FIELD_LABELS_MODULO = new Set(['Origen', 'Inserción', 'Acción', 'Inervación', 'Irrigación', 'Función']);

// Cuerpo de la ficha cuando la pieza pertenece a un módulo de estudio (src/content): su contenido con fuentes sustituye
// a la descripción y los puntos clave antiguos (sin fuentes, y con correlaciones clínicas que no se han revisado); se
// conservan la etimología y los datos que el módulo no trae (región, parte…).
function studyBody(hit, info, entry) {
  const { modulo, ficha } = hit;
  const labels = CAMPOS[ficha.tipo];
  const campos = [
    ...(ficha.funcion ? [['Función', ficha.funcion]] : []),
    ...Object.entries(ficha.campos).map(([k, v]) => [labels[k], v]),
    ...(info.fields ?? []).filter((f) => !FIELD_LABELS_MODULO.has(f.label) && !Object.values(labels).includes(f.label)).map((f) => [f.label, f.value]),
  ];
  const estado = ficha.revision.estado;
  const conjunto = ficha.nombre.toLowerCase() !== info.title.toLowerCase() && ficha.piezas.length > 1;
  const term = ficha.fuentes.terminologia.map((t) => ({ ...FUENTES[t.fuente], texto: `${FUENTES[t.fuente].texto}, término n.º ${t.termino}` }));
  const cont = ficha.fuentes.contenido.map((c) => ({ ...FUENTES[c.fuente], apoya: c.apoya }));
  const etiqueta = (k) => (k === 'descripcion' ? 'descripción' : k === 'funcion' ? 'función' : (labels[k] ?? k).toLowerCase());
  const link = (f) => (f.url ? `<a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.texto)}</a>` : esc(f.texto));
  return `
    <section class="study-head">
      <span class="study-tag">Módulo · ${esc(modulo.titulo.split(':')[0])}</span>
      <span class="review-badge ${estado}" title="${esc(ficha.revision.notas ?? '')}">${esc(ESTADOS[estado])}</span>
    </section>
    ${conjunto ? `<p class="study-whole">Ficha del conjunto: <b>${esc(ficha.nombre)}</b></p>` : ''}
    <section><p class="lead">${esc(ficha.descripcion)}</p></section>
    <section><dl class="fields">${campos.map(([l, v]) => `<dt>${esc(l)}</dt><dd>${esc(v)}</dd>`).join('')}</dl></section>
    ${ficha.relaciones.length ? `<section><h3>Relaciones</h3><ul class="relations">${ficha.relaciones.map((r) => `
      <li>${esc(r.texto)}${r.con ? ` <button class="rel-link" data-ficha="${esc(r.con)}">Ver</button>` : ''}</li>`).join('')}</ul></section>` : ''}
    ${ficha.simplificaciones.length ? `<section><h3>Simplificaciones del modelo</h3><ul class="facts">${ficha.simplificaciones.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></section>` : ''}
    ${entry?.etimologia ? `<section class="etym"><h3>Etimología</h3><p>${esc(entry.etimologia)}</p></section>` : ''}
    ${info.source ? `<p class="info-source">Modelo 3D: ${esc(info.source)}</p>` : ''}
    <details class="info-refs"><summary>Fuentes</summary>
      <p class="refs-group">Terminología (nombre y latín)</p>
      <ul>${term.map((f) => `<li>${link(f)}</li>`).join('')}</ul>
      <p class="refs-group">Contenido</p>
      <ul>${cont.map((f) => `<li>${link(f)}${f.actualizada ? ` (actualizada el ${esc(f.actualizada)})` : ''}. Respalda: ${esc(f.apoya.map(etiqueta).join(', '))}.</li>`).join('')}</ul>
      <p>${esc(ficha.revision.notas ?? '')} Consultadas el ${esc(term[0]?.consultada ?? cont[0]?.consultada ?? '')}.</p>
    </details>`;
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
  const study = isGroup ? null : fichaDePieza(sel.part.id, modelo);
  const crumbs = isGroup ? crumbsOf(sel.parts[0].groups).slice(0, crumbsOf(sel.parts[0].groups).indexOf(sel.id)) : crumbsOf(sel.part.groups);
  const meta = isGroup
    ? [`${sel.parts.length} estructura${sel.parts.length === 1 ? '' : 's'}`]
    : [...info.chips, info.tissue].filter(Boolean);

  el.style.setProperty('--sys', system.color);
  el.classList.toggle('collapsed', collapsed);
  el.innerHTML = `
    <button class="info-grip" data-act="toggle" aria-label="${collapsed ? 'Ver ficha completa' : 'Contraer ficha'}"><span></span></button>
    <div class="info-head">
      <nav class="crumbs" aria-label="Ubicación">
        ${crumbs.map((g) => `<button data-crumb="${g}">${esc(GRUPOS[g].nombre)}</button>`).join(uiIcon('chevron'))}
      </nav>
      <button class="icon-btn" data-act="close" aria-label="Cerrar">${uiIcon('close')}</button>
    </div>
    <h2 class="info-title">${esc(isGroup ? group.nombre : info.title)}</h2>
    ${(isGroup ? group.latin : info.latin) ? `<p class="info-latin">${esc(isGroup ? group.latin : info.latin)}</p>` : ''}
    <p class="info-meta"><i></i>${meta.map(esc).join('<span>·</span>')}</p>
    <div class="info-actions">
      ${ACTIONS.map(([act, icon, label]) => {
        const on = act === 'fade' && faded;
        return `<button data-act="${act}" class="${on ? 'on' : ''}" title="${label}">${uiIcon(icon)}<span>${on ? 'Opaco' : label}</span></button>`;
      }).join('')}
    </div>
    <div class="info-body">
      ${isGroup ? `
        ${group.descripcion ? `<section><p class="lead">${esc(group.descripcion)}</p></section>` : ''}
        <section><h3>Contiene</h3><ul class="members">${sel.members.map((m) => `
          <li><button data-member="${esc(m.id)}" data-kind="${m.kind}">${esc(m.label)}${m.count > 1 ? `<small>${m.count}</small>` : ''}${uiIcon('chevron')}</button></li>`).join('')}
        </ul></section>
      ` : study ? studyBody(study, info, entry) : entry ? `
        ${entry.descripcion ? `<section><p class="lead">${esc(entry.descripcion)}</p></section>` : ''}
        ${info.fields?.length ? `<section><dl class="fields">${info.fields.map((f) => `<dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd>`).join('')}</dl></section>` : ''}
        ${entry.etimologia ? `<section class="etym"><h3>Etimología</h3><p>${esc(entry.etimologia)}</p></section>` : ''}
        ${info.datos.length ? `<section><h3>Puntos clave</h3><ul class="facts">${info.datos.map((d) => `<li>${esc(d)}</li>`).join('')}</ul></section>` : ''}
      ` : '<section><p class="muted">Ficha en preparación.</p></section>'}
      ${!isGroup && !study && info.source ? `<p class="info-source">Modelo 3D: ${esc(info.source)}</p>` : ''}
      ${!isGroup && !study && info.fuentes ? `
        <details class="info-refs"><summary>Fuentes</summary>
          <ul>${info.fuentes.lista.map((f) => `
            <li><b>${esc(f.papel)}:</b> <a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.texto)}</a></li>`).join('')}
          </ul>
          <p>${esc(info.fuentes.nota)}</p>
        </details>` : ''}
    </div>`;
  el.querySelectorAll('[data-act]').forEach((b) => b.addEventListener('click', () => onAction(b.dataset.act)));
  el.querySelectorAll('[data-crumb]').forEach((b) => b.addEventListener('click', () => onCrumb(b.dataset.crumb)));
  el.querySelectorAll('[data-member]').forEach((b) => b.addEventListener('click', () => onMember(b.dataset.kind, b.dataset.member)));
  el.querySelectorAll('[data-ficha]').forEach((b) => b.addEventListener('click', () => onFicha?.(b.dataset.ficha)));
  el.classList.add('open');
  el.querySelector('.info-body').scrollTop = 0;
}
