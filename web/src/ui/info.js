import { uiIcon } from './icons.js';
import { GRUPOS } from '../data/grupos.js';

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

// Ficha de la selección: una estructura o un grupo completo.
// sel = { kind: 'part', part } | { kind: 'group', id, parts, members }
export function renderInfo(el, sel, { system, faded, collapsed, onAction, onCrumb, onMember }) {
  if (!sel) {
    el.classList.remove('open');
    return;
  }
  const isGroup = sel.kind === 'group';
  const info = isGroup ? null : sel.part.info;
  const group = isGroup ? GRUPOS[sel.id] : null;
  const entry = info?.entry;
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
      ` : entry ? `
        ${entry.descripcion ? `<section><p class="lead">${esc(entry.descripcion)}</p></section>` : ''}
        ${info.fields?.length ? `<section><dl class="fields">${info.fields.map((f) => `<dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd>`).join('')}</dl></section>` : ''}
        ${entry.etimologia ? `<section class="etym"><h3>Etimología</h3><p>${esc(entry.etimologia)}</p></section>` : ''}
        ${info.datos.length ? `<section><h3>Puntos clave</h3><ul class="facts">${info.datos.map((d) => `<li>${esc(d)}</li>`).join('')}</ul></section>` : ''}
      ` : '<section><p class="muted">Ficha en preparación.</p></section>'}
      ${!isGroup && info.source ? `<p class="info-source">Modelo 3D: ${esc(info.source)}</p>` : ''}
      ${!isGroup && info.fuentes ? `
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
  el.classList.add('open');
  el.querySelector('.info-body').scrollTop = 0;
}
