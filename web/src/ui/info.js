import { uiIcon } from './icons.js';
import { GRUPOS } from '../data/grupos.js';
import { fichaDePieza } from '../content/index.js';
import { CAMPOS, ESTADOS } from '../content/schema.js';
import { FUENTES } from '../content/fuentes.js';
import { t, tn, etiqueta, idioma } from '../i18n/idioma.js';
import { tr, trCita, trEtimologia } from '../i18n/contenido.js';
import { limitacionesDe, textoLimitacion, urlFuente } from '../data/limitaciones.js';
import { FUENTES_LINF } from '../data/linfatico/comprobadas.js';

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

/**
 * Limitaciones conocidas del modelo para una pieza (src/data/limitaciones.js), en el idioma de la interfaz: una línea
 * para la cabecera de la ficha (se ve también con la ficha plegada en el móvil) y la explicación, con su estado y sus
 * fuentes, para el cuerpo. { cabeza: '', cuerpo: '' } si la pieza no tiene ninguna en ese modelo.
 */
export function avisoLimitacion(id, modelo) {
  const lims = limitacionesDe(id, modelo);
  if (!lims.length) return { cabeza: '', cuerpo: '' };
  const lang = idioma();
  const titulo = esc(t('lim.titulo'));
  const fuentes = (l) => [...new Map(l.fuentes.map((f) => [f.f, f])).values()]
    .map((f) => `<a href="${esc(urlFuente(f))}" target="_blank" rel="noopener">Wikipedia · ${esc(f.f.slice(f.f.indexOf(':') + 1).replace(/_/g, ' '))}</a>`).join(', ');
  return {
    cabeza: lims.map((l) => `<p class="aviso-limite" role="note">${uiIcon('info')}<span><b>${titulo}.</b> ${esc(textoLimitacion(l, 'aviso', lang))}</span></p>`).join(''),
    cuerpo: lims.map((l) => `
      <section class="limite-detalle"><h3>${titulo}</h3>
        <p>${esc(textoLimitacion(l, 'detalle', lang))}</p>
        <p class="limite-estado">${esc(t(`lim.estado.${l.estado}`, { fecha: fechaLocal(l.comprobada) }))}${l.fuentes.length ? ` ${esc(t('ficha.fuentes'))}${lang === 'fr' ? ' :' : ':'} ${fuentes(l)}.` : ''}</p>
      </section>`).join(''),
  };
}

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
  // Sinónimos: son nombres en español (cubital, humeral…), así que solo se muestran en español, con su fuente.
  const sinonimos = idioma() === 'es' ? (ficha.sinonimos ?? []) : [];
  for (const sn of sinonimos) if (FUENTES[sn.fuente]) term.push(FUENTES[sn.fuente]);
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
    ${sinonimos.length ? `<p class="study-syn">${esc(t('ficha.sinonimos'))}: ${sinonimos.map((sn) => `<b>${esc(sn.nombre)}</b>`).join(', ')}</p>` : ''}
    <section><p class="lead">${esc(tr(ficha.descripcion))}</p></section>
    <section><dl class="fields">${campos.map(([l, v]) => `<dt>${esc(etiqueta(l))}</dt><dd>${esc(tr(v))}</dd>`).join('')}</dl></section>
    ${ficha.relaciones.length ? `<section><h3>${esc(t('ficha.relaciones'))}</h3><ul class="relations">${ficha.relaciones.map((r) => `
      <li>${esc(tr(r.texto))}${r.con ? ` <button class="rel-link" data-ficha="${esc(r.con)}">${esc(t('ficha.ver'))}</button>` : ''}</li>`).join('')}</ul></section>` : ''}
    ${ficha.simplificaciones.length ? `<section><h3>${esc(t('ficha.simplificaciones'))}</h3><ul class="facts">${ficha.simplificaciones.map((x) => `<li>${esc(tr(x))}</li>`).join('')}</ul></section>` : ''}
    ${entry?.etimologia ? `<section class="etym"><h3>${esc(t('ficha.etimologia'))}</h3><p>${esc(trEtimologia(entry.etimologia, latines))}</p></section>` : ''}
    ${info.source ? `<p class="info-source">${esc(t('ficha.modelo3d'))} ${esc(tr(info.source))}</p>` : ''}
    <details class="info-refs"><summary>${esc(t('ficha.fuentes'))}</summary>
      <p class="refs-group">${esc(t('ficha.terminologia'))}</p>
      <ul>${term.map((f) => `<li>${link(f)}</li>`).join('')}</ul>
      <p class="refs-group">${esc(t('ficha.contenido'))}</p>
      <ul>${cont.map((f) => `<li>${link(f)}${f.actualizada ? ` ${esc(t('ficha.actualizada', { fecha: fechaLocal(f.actualizada) }))}` : ''}. ${esc(t('ficha.respalda', { campos: f.apoya.map(campoDe).join(', ') }))}</li>`).join('')}</ul>
      <p>${esc(tr(ficha.revision.notas ?? ''))} ${esc(t('ficha.consultadas', { fecha: fechaLocal(term[0]?.consultada ?? cont[0]?.consultada) }))}</p>
    </details>
    ${notaTraduccion()}`;
}

// Fichas del sistema linfático (data/linfatico/): cada frase lleva el número de las fuentes que la respaldan y, al pasar
// el puntero, la cita literal. En español el número va tras cada frase; en otro idioma el campo se traduce entero
// (i18n/contenido.js) y los números van al final del campo. Las frases sobre el modelo 3D no llevan número: están en
// «En este modelo».
const supRefs = (refs, citas) => (refs.length ? `<sup class="ref" title="${esc(citas.map((c) => `“${c}”`).join('\n'))}">${refs.join(', ')}</sup>` : '');
function frasesLinf(frases) {
  if (idioma() === 'es') return frases.map((f) => `${esc(f.texto)}${supRefs(f.refs, f.citas)}`).join(' ');
  const refs = [...new Set(frases.flatMap((f) => f.refs))];
  return `${esc(tr(frases.map((f) => f.texto).join(' ')))}${supRefs(refs, frases.flatMap((f) => f.citas))}`;
}
function fuenteLinfTexto(r) {
  if (r.tipo === 'ta2') return `${t('fuente.ta2')}, ${t('ficha.termino', { n: r.termino })}`;
  return `${t(r.tipo === 'wpes' ? 'fuente.wikipediaEs' : 'fuente.wikipediaEn')}${idioma() === 'fr' ? ' :' : ':'} ${t('fuente.titulo', { titulo: r.titulo })}`;
}
function linfaBody(info, entry, latines) {
  const L = info.linfatico;
  const region = (info.fields ?? []).find((f) => f.label === 'Región');
  const nombre = L.nombre.map((n) => `${t('fuente.ta2')}, ${t('ficha.termino', { n })}`).join('; ');
  return `
    ${L.descripcion.length ? `<section><p class="lead">${frasesLinf(L.descripcion)}</p></section>` : ''}
    <section><dl class="fields">
      ${region ? `<dt>${esc(etiqueta(region.label))}</dt><dd>${esc(tr(region.value))}</dd>` : ''}
      ${L.campos.map((c) => `<dt>${esc(etiqueta(c.label))}</dt><dd>${frasesLinf(c.frases)}</dd>`).join('')}
    </dl></section>
    ${entry?.etimologia ? `<section class="etym"><h3>${esc(t('ficha.etimologia'))}</h3><p>${esc(trEtimologia(entry.etimologia, latines))}</p></section>` : ''}
    ${L.notas.length ? `<section><h3>${esc(t('ficha.puntosClave'))}</h3><ul class="facts">${L.notas.map((f) => `<li>${idioma() === 'es' ? esc(f.texto) : esc(tr(f.texto))}${supRefs(f.refs, f.citas)}</li>`).join('')}</ul></section>` : ''}
    <details class="info-refs"><summary>${esc(t('ficha.fuentes'))}</summary>
      <ol>${L.refs.map((r) => `
        <li><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(fuenteLinfTexto(r))}</a>${r.citas.length ? `<br><small>${r.citas.map((c) => `“${esc(c)}”`).join(' · ')}</small>` : ''}</li>`).join('')}
      </ol>
      ${nombre ? `<p class="refs-group">${esc(t('ficha.linf.nombre'))}: ${esc(nombre)}</p>` : ''}
      <p>${esc(t('ficha.linf.nota'))}</p>
    </details>
    ${info.source ? `<p class="info-source">${esc(t('ficha.modelo3d'))} ${esc(tr(info.source))}</p>` : ''}
    ${notaTraduccion()}`;
}

// Fuentes de la descripción de un grupo del linfático (páginas de Wikipedia, en la versión leída).
function fuentesGrupo(group) {
  if (!group.fuentesLinf?.length) return '';
  return `<details class="info-refs"><summary>${esc(t('ficha.fuentes'))}</summary><ul>${group.fuentesLinf.map((id) => {
    const r = fuenteGrupo(id);
    return `<li><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(fuenteLinfTexto(r))}</a></li>`;
  }).join('')}</ul></details>`;
}
const fuenteGrupo = (id) => {
  const i = id.indexOf(':');
  const tipo = id.slice(0, i);
  const reg = FUENTES_LINF[id];
  const pagina = id.slice(i + 1);
  return { tipo, titulo: reg?.titulo ?? pagina.replace(/_/g, ' '), url: reg?.url ?? `https://${tipo === 'wpes' ? 'es' : 'en'}.wikipedia.org/wiki/${encodeURIComponent(pagina)}` };
};

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
  // Lo que el modelo muestra mal de esta pieza: arriba, visible aunque la ficha esté plegada; la explicación, en el cuerpo.
  const limite = isGroup ? { cabeza: '', cuerpo: '' } : avisoLimitacion(sel.part.id, modelo);

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
    ${limite.cabeza}
    <div class="info-actions">
      ${ACTIONS.map(([act, icon, clave]) => {
        const on = act === 'fade' && faded;
        const label = t(clave);
        return `<button data-act="${act}" class="${on ? 'on' : ''}" title="${esc(label)}">${uiIcon(icon)}<span>${esc(on ? t('accion.opaco') : label)}</span></button>`;
      }).join('')}
    </div>
    <div class="info-body">
      ${limite.cuerpo}
      ${isGroup ? `
        ${group.descripcion ? `<section><p class="lead">${esc(tr(group.descripcion))}</p></section>` : ''}
        <section><h3>${esc(t('ficha.contiene'))}</h3><ul class="members">${sel.members.map((m) => `
          <li><button data-member="${esc(m.id)}" data-kind="${m.kind}">${esc(m.label)}${m.count > 1 ? `<small>${m.count}</small>` : ''}${uiIcon('chevron')}</button></li>`).join('')}
        </ul></section>
        ${fuentesGrupo(group)}
        ${group.descripcion ? notaTraduccion() : ''}
      ` : study ? studyBody(study, info, entry, latines) : info.linfatico ? linfaBody(info, entry, latines) : `
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
        ${info.source ? `<p class="info-source">${esc(t('ficha.modelo3d'))} ${esc(tr(info.source))}</p>` : ''}
        ${entry ? notaTraduccion() : ''}`}
    </div>`;
  el.querySelectorAll('[data-act]').forEach((b) => b.addEventListener('click', () => onAction(b.dataset.act)));
  el.querySelectorAll('[data-crumb]').forEach((b) => b.addEventListener('click', () => onCrumb(b.dataset.crumb)));
  el.querySelectorAll('[data-member]').forEach((b) => b.addEventListener('click', () => onMember(b.dataset.kind, b.dataset.member)));
  el.querySelectorAll('[data-ficha]').forEach((b) => b.addEventListener('click', () => onFicha?.(b.dataset.ficha)));
  el.classList.add('open');
  el.querySelector('.info-body').scrollTop = 0;
}
