import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-serif/400-italic.css';
import './styles.css';
import { Viewer } from './viewer.js';
import { SYSTEMS, SYSTEM_BY_ID, DEFAULT_STAGES, classify } from './systems.js';
import { systemIcon, uiIcon } from './ui/icons.js';
import { renderInfo } from './ui/info.js';
import { GRUPOS } from './data/grupos.js';
import { resolvePart, sideOf } from './data/resolve.js';
import { Sessions, Stale, createSystemLoader, fetchJSON, describeError, onceByKey } from './loading.js';
import { FICHA_POR_ID, MODULOS, sinonimosDePieza } from './content/index.js';
import { createStudy } from './ui/study.js';
import { createStart } from './ui/start.js';
import { t, tn, etiqueta, idioma, leerIdioma, fijarIdioma, alCambiar, traducirDom } from './i18n/idioma.js';
import { cargarNombres, nombrePieza, nombreGrupo } from './i18n/nombres.js';
import { cargarContenido } from './i18n/contenido.js';

const MODELS = {
  male: {
    url: '/models/male.glb', label: 'Masculino', detail: 'Hombre adulto · 12 sistemas', icon: 'male',
    // En pantallas táctiles: las mismas mallas con las texturas a la mitad (tools/base_ligera.py).
    ligero: '/models/male.ligero.glb',
    // Nombres de las piezas de los sistemas que se descargan aparte, para buscarlas antes (tools/search_index.py).
    index: '/models/male-index.json',
    // Región externa de los genitales, para la opción «Mostrar genitales externos» (build_genital_skin.py).
    genitalRegion: '/models/male-genital-region.json',
    // Sistemas en archivos aparte: se descargan la primera vez que se activan.
    systems: {
      muscular: { url: '/models/male-muscular.glb', meta: '/models/male-muscular.json' },
      connective: { url: '/models/male-connective.glb', meta: '/models/male-connective.json' },
      arterial: { url: '/models/male-arterial.glb', meta: '/models/male-arterial.json' },
      venous: { url: '/models/male-venous.glb', meta: '/models/male-venous.json' },
      nervous: { url: '/models/male-nervous.glb', meta: '/models/male-nervous.json' },
      respiratory: { url: '/models/male-respiratory.glb', meta: '/models/male-respiratory.json' },
      digestive: { url: '/models/male-digestive.glb', meta: '/models/male-digestive.json' },
      urogenital: { url: '/models/male-urogenital.glb', meta: '/models/male-urogenital.json' },
      endocrine: { url: '/models/male-endocrine.glb', meta: '/models/male-endocrine.json' },
      lymphatic: { url: '/models/male-lymphatic.glb', meta: '/models/male-lymphatic.json' },
      // La piel de MakeHuman no tiene genitales: la del pene y el escroto se genera aparte (build_genital_skin.py).
      integumentary: { url: '/models/male-integumentary.glb', meta: '/models/male-integumentary.json' },
    },
  },
  female: {
    url: '/models/female.glb', label: 'Femenino', detail: 'Mujer adulta · 12 sistemas', icon: 'female',
    ligero: '/models/female.ligero.glb',
    index: '/models/female-index.json',
    // Los mismos sistemas que el masculino (A3D_MODEL=female zsh tools/build_all.sh); los órganos femeninos que
    // Z-Anatomy no tiene son formas paramétricas (tools/female_organs.py).
    systems: Object.fromEntries(['muscular', 'connective', 'arterial', 'venous', 'nervous', 'respiratory', 'digestive',
      'urogenital', 'endocrine', 'lymphatic', 'integumentary'].map((s) => [s, { url: `/models/female-${s}.glb`, meta: `/models/female-${s}.json` }])),
  },
};
// Pantallas táctiles (móviles, tabletas): modelo base ligero, con las texturas del esqueleto a la mitad (en la GPU, unos
// 77 MB en lugar de 305: revisión de rendimiento del 2026-11-07), y calidad baja de partida.
const TACTIL = matchMedia('(pointer: coarse)').matches;
const urlBase = (id) => (TACTIL && MODELS[id].ligero) || MODELS[id].url;

const $ = (sel) => document.querySelector(sel);
const isMobile = () => window.innerWidth < 760;
const almacen = (() => { try { return window.localStorage; } catch { return null; } })();

// Idioma (inglés si no se eligió otro): los textos del HTML se ponen antes de mostrarlos (clase sin-traducir).
fijarIdioma(leerIdioma(almacen));
document.documentElement.lang = idioma();
document.title = t('doc.titulo');
traducirDom(document);
document.documentElement.classList.remove('sin-traducir');
// Tabla de nombres (francés e italiano) y traducción del contenido del idioma; si no llegan, el latín y el español.
const cargarIdioma = (id) => Promise.all([cargarNombres(id), cargarContenido(id)]).catch((err) => console.error(err));
let nombresListos = cargarIdioma(idioma());

let viewer;
try {
  viewer = new Viewer($('#stage'));
} catch (err) {
  // Sin WebGL (navegador antiguo, aceleración gráfica desactivada…) no hay visor: se explica en vez de quedar en blanco.
  console.error(err);
  document.body.classList.remove('inicio');              // el aviso, a pantalla completa (la de inicio no serviría)
  $('#loader-label').textContent = t('carga.webgl');
  $('.loader-track').hidden = true;
  throw err;
}
// La GPU se perdió (viewer.js): se avisa, con la opción de recargar; si el navegador la devuelve, el visor sigue solo.
viewer.addEventListener('contextlost', () => toast(t('carga.contextoPerdido'), 0, { label: t('comun.recargar'), run: () => location.reload() }));
viewer.addEventListener('contextrestored', () => toast(t('carga.contextoRecuperado')));
const state = { model: 'male', stages: {}, hidden: new Set(), isolated: null, faded: new Set() };
const history = [];
let available = {};
let current = null; // { kind: 'part', part } | { kind: 'group', id, parts, members }
let collapsed = false;

// ── Estado, historial y aplicación al visor ─────────────────────
function snapshot() {
  return {
    stages: { ...state.stages },
    hidden: new Set(state.hidden),
    isolated: state.isolated && new Set(state.isolated),
    faded: new Set(state.faded),
  };
}

function change(fn) {
  history.push(snapshot());
  if (history.length > 60) history.shift();
  fn();
  apply();
}

function undo() {
  const prev = history.pop();
  if (!prev) return toast(t('aviso.nadaDeshacer'));
  Object.assign(state, prev);
  apply();
}

function stageOf(part) {
  return SYSTEM_BY_ID[part.system].stages.find((s) => s.id === state.stages[part.system]) ?? null;
}

// Piezas que otro sistema activo muestra como contexto (los huesos y ligamentos bajo los músculos…), también si su
// sistema está encendido en una capa que no las incluye: con el tejido conjuntivo en «Cartílagos» (el estado inicial),
// la vista muscular perdía la línea alba y los retináculos, y entre los rectos se veía la columna.
function contextShown(part) {
  return SYSTEMS.some((s) => state.stages[s.id] && s.context?.[part.system]?.(part));
}

function apply() {
  for (const part of viewer.parts) {
    const stage = stageOf(part);
    const shown = (!!stage && stage.filter(part)) || contextShown(part);
    part.visible = shown && !state.hidden.has(part.id) && (!state.isolated || state.isolated.has(part.id))
      && !(viewer.modesty && part.modestEmpty);
    part.ghost = !!stage?.ghost || state.faded.has(part.id);
  }
  // La piel lisa del pubis femenino (female.glb) y la vulva (female-integumentary.glb) tienen el mismo borde: la lisa
  // solo se ve cuando no se ve la vulva (genitales ocultos, o aún sin descargar).
  const vulva = viewer.parts.find((p) => p.id === 'Skin_Genitals' && p.extras.name_en === 'Vulva');
  for (const part of viewer.parts) if (part.id === 'Skin_Vulva_Smooth' && vulva?.visible) part.visible = false;
  viewer.updateParts();
  if (current && !viewer.selection.size) current = null;
  if (current?.kind === 'group') current.parts = current.parts.filter((p) => viewer.selection.has(p));
  renderDock();
  renderStatus();
  renderSelection();
}

function computeAvailability() {
  available = {};
  const lazy = MODELS[state.model].systems ?? {};
  for (const sys of SYSTEMS) {
    const parts = viewer.parts.filter((p) => p.system === sys.id);
    const pending = lazy[sys.id] && !sessions.current?.loaded(sys.id);
    available[sys.id] = new Set(sys.stages.filter((st) => pending || parts.some((p) => st.filter(p))).map((st) => st.id));
  }
}

// ── Carga de sistemas, a nombre del modelo que los pidió ─────────
// Cada modelo instalado abre una sesión (loading.js). Una petición queda a nombre de la sesión activa al pedirse; si el
// modelo cambia mientras espera, se descarta sin avisos ni cambios en la escena. Las descargas de la sesión anterior
// se abortan al instalar otro modelo.
const sessions = new Sessions();
// Grupos de los metadatos de cada modelo (male-muscular.json…), además de los de grupos.js: solo los del modelo activo
// están en GRUPOS.
const BASE_GROUPS = new Set(Object.keys(GRUPOS));
const metaGroups = { male: {}, female: {} };
function useGroupsOf(model) {
  for (const id of Object.keys(GRUPOS)) if (!BASE_GROUPS.has(id)) delete GRUPOS[id];
  for (const [id, g] of Object.entries(metaGroups[model])) GRUPOS[id] ??= g;
  localizarGrupos();
}

// ── Nombres en el idioma elegido (i18n/nombres.js) ──────────────
// El título de cada pieza y el nombre de cada grupo se guardan en español (tituloEs, nombreEs) y `title`/`nombre`
// pasan a estar en el idioma actual: así lo usan igual la ficha, la etiqueta, el texto al pasar el ratón y el buscador.
function localizarPieza(info, en) {
  info.tituloEs ??= info.title;
  info.en ??= en;
  info.title = nombrePieza({ tituloEs: info.tituloEs, latin: info.latin, en: info.en });
  return info;
}
function localizarGrupos() {
  for (const [id, g] of Object.entries(GRUPOS)) {
    g.nombreEs ??= g.nombre;
    g.nombre = nombreGrupo(id, g);
  }
}
localizarGrupos();
const loadSystem = createSystemLoader({
  sessions,
  systemsOf: (model) => MODELS[model].systems,
  fetchMeta: (url, opts) => fetchJSON(url, opts),
  addSystem: (url, opts) => viewer.addSystem(url, opts).then((parts) => {
    for (const part of parts ?? []) localizarPieza(part.info, part.extras.name_en);
    return parts;
  }),
  onMeta: (s, meta) => {
    for (const [gid, g] of Object.entries(meta.groups ?? {})) {
      metaGroups[s.model][gid] ??= g;
      GRUPOS[gid] ??= g;
    }
    localizarGrupos();
  },
});

// Descarga el GLB de un sistema la primera vez que se activa. Devuelve true si está cargado para el modelo activo.
// `retry`: qué repetir con el botón «Reintentar» (por defecto, volver a cargarlo y aplicar la vista).
async function ensureSystem(id, { quiet = false, retry = null } = {}) {
  const s = sessions.current;
  if (!s) return false;
  if (!MODELS[s.model].systems?.[id] || s.loaded(id)) return true;
  const que = t(`sistema.${id}.frase`);
  const mine = () => sessions.isCurrent(s);
  const say = (msg, ms) => !quiet && mine() && toast(msg, ms);  // el contexto de otro sistema se carga sin avisos
  say(t('carga.cargando', { que }), 0);
  try {
    await loadSystem(id, { onProgress: (k) => say(`${t('carga.cargando', { que })} ${Math.round(k * 100)} %`, 0) });
  } catch (err) {
    if (err instanceof Stale || !mine()) return false;           // se cambió de modelo: nada que avisar
    console.error(err);
    // También las cargas silenciosas avisan si fallan: sin ellas faltan los huesos o ligamentos de contexto.
    toast(t('carga.error', { que, causa: describeError(err) }), 0, {
      label: t('comun.reintentar'),
      run: retry ?? (() => ensureSystem(id).then((ok) => ok && apply())),
    });
    return false;
  }
  if (!mine()) return false;
  computeAvailability();
  say(t('carga.listo', { que }));
  return true;
}

// ── Dock de sistemas ────────────────────────────────────────────
const dock = $('#dock');

function buildDock() {
  dock.innerHTML = SYSTEMS.map((s) => `
    <button class="dock-item" data-sys="${s.id}" style="--sys:${s.color}">
      <span class="dock-icon">${systemIcon(s.id)}</span>
      <span class="dock-name">${etiqueta(s.label)}</span>
      <span class="dock-stage"></span>
    </button>`).join('');
  dock.querySelectorAll('.dock-item').forEach((btn) => {
    const id = btn.dataset.sys;
    let timer = null;
    let longPressed = false;
    btn.addEventListener('pointerdown', () => {
      longPressed = false;
      timer = setTimeout(() => { longPressed = true; openStageMenu(id, btn); }, 480);
    });
    const cancel = () => clearTimeout(timer);
    btn.addEventListener('pointerup', cancel);
    btn.addEventListener('pointerleave', cancel);
    btn.addEventListener('contextmenu', (e) => { e.preventDefault(); cancel(); openStageMenu(id, btn); });
    btn.addEventListener('click', () => {
      if (longPressed) return;
      btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      if (!available[id].size) return openStageMenu(id, btn);
      cycleStage(id);
    });
  });
}

// En pantallas estrechas el dock se desplaza de lado y los últimos sistemas quedaban cortados sin aviso: los bordes se
// difuminan mientras haya más sistemas a ese lado.
function updateDockFade() {
  dock.classList.toggle('fade-l', dock.scrollLeft > 4);
  dock.classList.toggle('fade-r', dock.scrollLeft + dock.clientWidth < dock.scrollWidth - 4);
}
dock.addEventListener('scroll', updateDockFade, { passive: true });
window.addEventListener('resize', updateDockFade);

function renderDock() {
  updateDockFade();
  for (const btn of dock.querySelectorAll('.dock-item')) {
    const sys = SYSTEM_BY_ID[btn.dataset.sys];
    const stageId = state.stages[sys.id];
    const empty = !available[sys.id]?.size;
    const stage = stageId && sys.stages.find((s) => s.id === stageId);
    btn.classList.toggle('on', !!stageId);
    btn.classList.toggle('empty', empty);
    btn.querySelector('.dock-name').textContent = etiqueta(sys.label);
    btn.querySelector('.dock-stage').textContent = empty ? t('dock.pronto') : stage ? etiqueta(stage.label) : t('dock.apagado');
    btn.title = `${etiqueta(sys.label)}${stage ? ` · ${etiqueta(stage.label)}` : ''} — ${t('dock.ayuda')}`;
  }
  document.querySelectorAll('#model-switch [data-model]').forEach((b) => {
    b.classList.toggle('on', b.dataset.model === state.model);
    b.setAttribute('aria-pressed', String(b.dataset.model === state.model));
    b.setAttribute('aria-busy', String(b.dataset.model === requested));     // pedido, todavía descargándose
  });
}

// Descarga (sin avisos) los sistemas de los que un sistema activo muestra piezas como contexto.
function loadContext(id) {
  for (const src of Object.keys(SYSTEM_BY_ID[id].context ?? {})) ensureSystem(src, { quiet: true }).then((ok) => ok && apply());
}

function cycleStage(id) {
  const sys = SYSTEM_BY_ID[id];
  const order = [null, ...sys.stages.filter((s) => available[id].has(s.id)).map((s) => s.id)];
  setStage(id, order[(order.indexOf(state.stages[id] ?? null) + 1) % order.length]);
}

async function setStage(id, stageId) {
  if (stageId && !(await ensureSystem(id, { retry: () => setStage(id, stageId) }))) return;
  change(() => {
    state.stages[id] = stageId;
    state.isolated = null;
  });
  if (stageId) loadContext(id);
  const sys = SYSTEM_BY_ID[id];
  toast(`${etiqueta(sys.label)} · ${stageId ? etiqueta(sys.stages.find((s) => s.id === stageId).label) : t('dock.apagado').toLocaleLowerCase(idioma())}`);
}

function openStageMenu(id, anchor) {
  const sys = SYSTEM_BY_ID[id];
  const active = state.stages[id] ?? null;
  const empty = !available[id].size;
  openPopover(anchor, `
    <header class="pop-head" style="--sys:${sys.color}">${systemIcon(id)}<div><b>${etiqueta(sys.label)}</b><small>${t('capas.titulo')}</small></div></header>
    ${empty ? `<p class="pop-note">${t('capas.sinModelo')}</p>` : ''}
    <div class="pop-list">
      <button data-stage="" class="${active === null ? 'current' : ''}" ${empty ? 'disabled' : ''}>${t('dock.apagado')}</button>
      ${sys.stages.map((s, i) => {
        const ok = available[id].has(s.id);
        return `<button data-stage="${s.id}" class="${active === s.id ? 'current' : ''}" ${ok ? '' : 'disabled'}>
          <span class="step">${i + 1}</span>${etiqueta(s.label)}${ok ? '' : `<small>${t('dock.pronto')}</small>`}</button>`;
      }).join('')}
    </div>`, (el) => {
    el.querySelectorAll('[data-stage]').forEach((b) => b.addEventListener('click', () => {
      closePopover();
      setStage(id, b.dataset.stage || null);
    }));
  });
}

// ── Popover, toast, tooltip ─────────────────────────────────────
const popover = $('#popover');
function openPopover(anchor, html, bind) {
  popover.innerHTML = html;
  popover.hidden = false;
  bind(popover);
  const r = anchor.getBoundingClientRect();
  const w = popover.offsetWidth;
  popover.style.left = `${Math.max(8, Math.min(window.innerWidth - w - 8, r.left + r.width / 2 - w / 2))}px`;
  popover.style.bottom = `${window.innerHeight - r.top + 10}px`;
}
function closePopover() { popover.hidden = true; }
document.addEventListener('pointerdown', (e) => {
  if (!popover.hidden && !popover.contains(e.target) && !e.target.closest('.dock-item')) closePopover();
});

let toastTimer;
// `action`: { label, run } — un botón en el aviso (p. ej. «Reintentar»). Un aviso con botón no caduca solo.
function toast(msg, ms = 1800, action = null) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.toggle('actionable', !!action);
  if (action) {
    const b = document.createElement('button');
    b.textContent = action.label;
    b.addEventListener('click', () => { hideToast(); action.run(); });
    const close = document.createElement('button');
    close.className = 'toast-close';
    close.setAttribute('aria-label', t('aviso.cerrar'));
    close.textContent = '×';
    close.addEventListener('click', hideToast);
    el.append(b, close);
  }
  el.hidden = false;
  el.classList.add('show');
  clearTimeout(toastTimer);
  if (ms && !action) toastTimer = setTimeout(hideToast, ms);
}
function hideToast() {
  const el = $('#toast');
  el.classList.remove('show', 'actionable');
}

const tooltip = $('#tooltip');
viewer.addEventListener('hover', ({ detail }) => {
  if (evaluando || !detail.part || viewer.selection.has(detail.part)) return (tooltip.hidden = true);
  tooltip.textContent = detail.part.info.title;
  tooltip.hidden = false;
  tooltip.style.transform = `translate(${detail.x + 16}px, ${detail.y + 14}px)`;
});

// ── Selección: estructura o grupo ───────────────────────────────
const infoEl = $('#info');

function selectPart(part, point = null, { focus = false } = {}) {
  current = part ? { kind: 'part', part } : null;
  collapsed = isMobile();
  viewer.select(part ? [part] : [], point);
  if (part && focus) viewer.focus(part);
  tooltip.hidden = true;
  renderSelection();
}

function groupMembers(id, parts) {
  const members = new Map();
  for (const p of parts) {
    const i = p.groups.indexOf(id);
    const child = i > 0 ? p.groups[i - 1] : null;
    if (child && GRUPOS[child]) {
      const m = members.get(child) ?? { kind: 'group', id: child, label: GRUPOS[child].nombre, count: 0 };
      m.count++;
      members.set(child, m);
    } else {
      const key = p.info.title;
      const m = members.get(key) ?? { kind: 'part', id: p.id, label: p.info.title, count: 0 };
      m.count++;
      members.set(key, m);
    }
  }
  return [...members.values()];
}

function selectGroup(id, { focus = true } = {}) {
  const parts = viewer.parts.filter((p) => p.visible && !p.ghost && p.groups.includes(id));
  if (!parts.length) return toast(t('aviso.grupoNoVisible'));
  current = { kind: 'group', id, parts, members: groupMembers(id, parts) };
  collapsed = isMobile();
  viewer.select(parts);
  if (focus) viewer.focus(parts);
  renderSelection();
}

function selectionParts() {
  return current ? (current.kind === 'part' ? [current.part] : current.parts) : [];
}

function renderSelection() {
  // En la evaluación no hay ficha: ni a la vista ni en el DOM (un lector de pantalla la leería).
  if (evaluando) {
    infoEl.classList.remove('open');
    infoEl.innerHTML = '';
    updateInsets();
    updatePin();
    return;
  }
  const parts = selectionParts();
  const sys = parts[0] && SYSTEM_BY_ID[parts[0].system];
  renderInfo(infoEl, current, {
    system: sys,
    faded: parts.length > 0 && parts.every((p) => state.faded.has(p.id)),
    collapsed,
    onAction: selectionAction,
    onCrumb: (g) => selectGroup(g),
    onMember: (kind, id) => (kind === 'group' ? selectGroup(id) : selectPart(viewer.parts.find((p) => p.id === id), null, { focus: true })),
    modelo: state.model,
    onFicha: openFicha,
  });
  updateInsets();
  updatePin();
}

function selectionAction(act) {
  const parts = selectionParts();
  const ids = parts.map((p) => p.id);
  const name = current?.kind === 'group' ? GRUPOS[current.id].nombre : parts[0]?.info.title;
  if (act === 'close') return selectPart(null);
  if (act === 'toggle') { collapsed = !collapsed; return renderSelection(); }
  if (act === 'focus') return viewer.focus(parts);
  if (act === 'hide') {
    change(() => ids.forEach((id) => state.hidden.add(id)));
    toast(t('aviso.oculto', { nombre: name }));
  }
  if (act === 'isolate') {
    change(() => (state.isolated = new Set(ids)));
    viewer.focus(parts);
  }
  if (act === 'fadeOthers') {
    change(() => viewer.parts.forEach((p) => p.visible && !ids.includes(p.id) && state.faded.add(p.id)));
  }
  if (act === 'fade') {
    const allFaded = ids.every((id) => state.faded.has(id));
    change(() => ids.forEach((id) => (allFaded ? state.faded.delete(id) : state.faded.add(id))));
    if (!allFaded) selectPart(null);
  }
}

viewer.addEventListener('pick', ({ detail }) => {
  if (evaluando) return;                                 // la estructura resaltada no cambia mientras se responde
  closePanels({ keep: 'study' });                        // el panel de estudio sigue abierto mientras se explora
  selectPart(detail.part, detail.point);
});

// Etiqueta clavada en la estructura con línea guía, como en los atlas.
const pin = $('#pin');
function updatePin() {
  if (evaluando) return (pin.hidden = true);
  const s = viewer.anchorScreen();
  const parts = selectionParts();
  if (!s || !s.visible || !parts.length) return (pin.hidden = true);
  pin.hidden = false;
  const label = pin.querySelector('.pin-label');
  const titulo = current.kind === 'group' ? GRUPOS[current.id].nombre : parts[0].info.title;
  const latin = (current.kind === 'group' ? GRUPOS[current.id].latin : parts[0].info.latin) ?? '';
  label.querySelector('b').textContent = titulo;
  label.querySelector('i').textContent = latin === titulo ? '' : latin;     // en alemán el nombre ya es el latino
  const W = window.innerWidth;
  const lw = label.offsetWidth;
  const lh = label.offsetHeight;
  const leftLimit = !isMobile() && infoEl.classList.contains('open') ? infoEl.getBoundingClientRect().right + 12 : 12;
  const rightLimit = W - (isMobile() ? 12 : 76);
  let dir = s.x > W / 2 ? 1 : -1;
  const gap = isMobile() ? 34 : 64;
  if (dir < 0 && s.x - gap - lw < leftLimit) dir = 1;
  if (dir > 0 && s.x + gap + lw > rightLimit) dir = -1;
  const lx = Math.max(leftLimit, Math.min(rightLimit - lw, dir > 0 ? s.x + gap : s.x - gap - lw));
  const ly = Math.max(64, s.y - 64 - lh / 2);
  label.style.transform = `translate(${lx}px, ${ly}px)`;
  const ex = dir > 0 ? lx : lx + lw;
  const ey = ly + lh / 2;
  pin.querySelector('.pin-dot').style.transform = `translate(${s.x}px, ${s.y}px)`;
  const line = pin.querySelector('polyline');
  const elbow = dir > 0 ? ex - 14 : ex + 14;
  line.setAttribute('points', `${s.x},${s.y} ${elbow},${ey} ${ex},${ey}`);
}
viewer.addEventListener('render', updatePin);

function renderStatus() {
  const pill = $('#status-pill');
  pill.hidden = !state.isolated && !state.hidden.size && !state.faded.size;
  pill.querySelector('span').textContent = state.isolated
    ? t('estado.aislada')
    : [state.hidden.size && tn('estado.ocultas', state.hidden.size), state.faded.size && tn('estado.atenuadas', state.faded.size)].filter(Boolean).join(' · ');
}

function showAll() {
  change(() => {
    state.hidden.clear();
    state.faded.clear();
    state.isolated = null;
  });
}

// ── Estudio (panel «Estudiar», ui/study.js) ─────────────────────
// Modo evaluación: mientras se responde no se ve el nombre de la estructura resaltada por ninguna vía (etiqueta, ficha,
// texto al pasar el ratón, buscador ni atajos que la seleccionen).
let evaluando = false;
function modoEvaluacion(on) {
  if (evaluando === on) return;
  evaluando = on;
  document.body.classList.toggle('evaluando', on);
  const searchBtn = $('.toolbar [data-panel="search"]');
  searchBtn.disabled = on;
  searchBtn.title = on ? t('evaluacion.sinBuscar') : '';
  if (on) {
    if ($('#panel-search').classList.contains('open')) closePanels({ keep: 'study' });
    tooltip.hidden = true;
    current = null;
  }
  renderSelection();
}

// Piezas de unas fichas en un lado («Long_head_of_biceps_brachii» → «…_R»).
const piezasDe = (ids, lado) => ids.map((id) => FICHA_POR_ID.get(id)).filter(Boolean)
  .flatMap((f) => f.piezas.map((p) => (f.lado === 'bilateral' ? `${p}_${lado}` : p)));

// Muestra las estructuras de unas fichas (un lado) con el esqueleto de contexto, aisladas y resaltadas. Las capas se
// eligen para todas las fichas de `contexto` (en la evaluación, las del módulo entero), así la barra de sistemas es la
// misma en cada pregunta y no delata si lo resaltado es un nervio o un vaso. Devuelve si se pudo mostrar todo.
async function mostrarFichas(ids, { quiz = false, contexto = ids, lado = 'R' } = {}) {
  if (!ids.length) {                                     // pregunta de texto: sin resaltar nada
    viewer.select([]);
    current = null;
    renderSelection();
    return true;
  }
  const s = sessions.current;
  const nombres = piezasDe(ids, lado);
  const todos = [...new Set([...nombres, ...piezasDe(contexto, lado)])];
  const find = (n) => viewer.parts.find((p) => p.id === n);
  if (todos.some((n) => !find(n))) {
    await loadPendingIndex();
    const keys = new Set(unloaded.model === state.model ? unloaded.parts.filter((p) => todos.includes(p.id)).map((p) => p.key) : []);
    for (const k of keys) if (!(await ensureSystem(k, { quiet: true }))) return false;
  }
  if (s !== sessions.current) return false;              // se cambió de modelo mientras se descargaba
  const parts = nombres.map(find).filter(Boolean);
  const ctx = todos.map(find).filter(Boolean);
  change(() => {
    // Por sistema, una capa que muestre todas sus piezas del contexto.
    for (const sysId of new Set(ctx.map((p) => p.system))) {
      const mine = ctx.filter((p) => p.system === sysId);
      const sys = SYSTEM_BY_ID[sysId];
      const ok = (st) => available[sysId].has(st.id) && !st.ghost && mine.every((p) => st.filter(p));
      if (!(stageOf(mine[0]) && mine.every((p) => stageOf(p)?.filter(p) && !stageOf(p).ghost))) {
        state.stages[sysId] = sys.stages.find(ok)?.id ?? sys.stages.find((st) => available[sysId].has(st.id) && !st.ghost && parts.every((p) => p.system !== sysId || st.filter(p)))?.id ?? state.stages[sysId];
      }
    }
    state.stages.skeletal = 'all';
    for (const part of parts) { state.hidden.delete(part.id); state.faded.delete(part.id); }
    state.isolated = new Set([...parts, ...viewer.parts.filter((p) => p.system === 'skeletal')].map((p) => p.id));
  });
  current = null;
  viewer.select(parts);
  renderSelection();
  if (parts.length) viewer.focus(parts);
  return parts.length === nombres.length;
}

// Abre la ficha de una estructura del módulo: la pieza del lado que está resaltado, si la hay.
function abrirFicha(id, { sinCamara = false } = {}) {
  const f = FICHA_POR_ID.get(id);
  if (!f) return;
  const lado = [...viewer.selection].find((p) => p.side)?.side ?? 'R';
  const part = [...piezasDe([id], lado), ...piezasDe([id], lado === 'R' ? 'L' : 'R')].map((n) => viewer.parts.find((p) => p.id === n)).find(Boolean);
  if (!part) return openFicha(id);
  if (part.visible) selectPart(part, null, { focus: !sinCamara });
  else reveal(part);
}

const study = createStudy({
  body: $('#study-body'),
  modulos: MODULOS,
  storage: almacen,
  toast,
  api: { mostrar: mostrarFichas, abrirFicha, modoEvaluacion, modelo: () => state.model },
});

// Abre la estructura de una relación de una ficha de módulo (del mismo lado si existe), aunque su sistema esté apagado o
// sin descargar.
async function openFicha(id) {
  const ficha = FICHA_POR_ID.get(id);
  if (!ficha) return;
  const side = current?.kind === 'part' ? current.part.side : null;
  const lados = side === 'R' ? ['_R', '_L'] : ['_L', '_R'];
  const nombres = ficha.piezas.flatMap((p) => (ficha.lado === 'bilateral' ? lados.map((l) => p + l) : [p]));
  const find = () => nombres.map((n) => viewer.parts.find((p) => p.id === n)).find(Boolean);
  let part = find();
  if (!part) {
    await loadPendingIndex();
    const hit = unloaded.model === state.model && unloaded.parts.find((p) => nombres.includes(p.id));
    if (!hit) return toast(t('aviso.noEnModelo'));
    if (!(await ensureSystem(hit.key, { retry: () => openFicha(id) }))) return;
    part = find();
  }
  if (part) reveal(part);
}

// Muestra una estructura desde el buscador aunque su sistema esté apagado.
function reveal(part) {
  const sys = SYSTEM_BY_ID[part.system];
  const visibleNow = stageOf(part)?.filter(part);
  change(() => {
    if (!visibleNow) state.stages[part.system] = sys.stages.find((s) => available[part.system].has(s.id) && s.filter(part) && !s.ghost)?.id ?? null;
    state.hidden.delete(part.id);
    state.faded.delete(part.id);
    if (state.isolated && !state.isolated.has(part.id)) state.isolated = null;
  });
  selectPart(part, null, { focus: true });
}

// Zona libre del visor: en móvil la ficha ocupa la parte inferior de la pantalla.
function updateInsets() {
  const dockH = $('.dock-wrap').offsetHeight;
  document.documentElement.style.setProperty('--dock-h', `${dockH}px`);
  const studyOpen = $('#panel-study').classList.contains('open');
  const sheet = isMobile() ? Math.max(current ? infoEl.offsetHeight : 0, studyOpen ? $('#panel-study').offsetHeight + 8 : 0) : 0;
  viewer.insets = { top: isMobile() ? 56 : 64, bottom: dockH + sheet + 8 };
}
window.addEventListener('resize', () => { updateInsets(); updatePin(); });

// ── Paneles (buscar, herramientas, ajustes, ayuda) ──────────────
// Un panel cerrado queda `inert`: antes solo se hacía transparente y sus botones seguían recibiendo el foco del teclado.
// Al cerrarlo, el foco vuelve al botón que lo abrió. `keep`: panel que no se cierra (el de estudio, al explorar).
function closePanels({ keep = null } = {}) {
  document.querySelectorAll('.panel.open').forEach((p) => {
    const name = p.id.replace('panel-', '');
    if (name === keep) return;
    const hadFocus = p.contains(document.activeElement);
    p.classList.remove('open');
    p.inert = true;
    const opener = $(`.toolbar [data-panel="${name}"]`);
    opener?.classList.remove('on');
    opener?.setAttribute('aria-expanded', 'false');
    if (name === 'study') { study.cerrar(); updateInsets(); }
    if (hadFocus) opener?.focus();
  });
}

function togglePanel(name) {
  const panel = $(`#panel-${name}`);
  const open = !panel.classList.contains('open');
  if (open && name === 'search' && evaluando) return;
  closePanels();
  if (!open) return;
  panel.classList.add('open');
  panel.inert = false;
  $(`.toolbar [data-panel="${name}"]`).classList.add('on');
  $(`.toolbar [data-panel="${name}"]`).setAttribute('aria-expanded', 'true');
  if (name === 'study') {
    study.abrir();
    updateInsets();
    panel.querySelector('h2').focus();
    return;
  }
  if (name !== 'search') panel.querySelector('h2')?.focus();
  if (name === 'search') {
    loadPendingIndex();
    const input = $('#search-input');
    input.focus();
    input.select();
    renderSearch(input.value);
  }
}

const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// Piezas de los sistemas aún sin descargar: buscar «bíceps» antes de abrir el sistema muscular solo encontraba dos bolsas
// del bíceps femoral. Al elegir una, se descarga su sistema y se muestra.
const GENITAL_NAME = /penis|Glans|Testis|Epididym|Scrot|Spermatic|Cremaster|Dartos|clitoris|vestibul|Labi|Vulva/i;
// Índice de cada modelo (una promesa por modelo; si falla, se olvida y se vuelve a pedir la próxima vez).
const indexOf = onceByKey((model) => fetchJSON(MODELS[model].index).then((data) => Object.entries(data).flatMap(([key, list]) =>
  list.flatMap(([name, extras]) => {
    const cls = classify(extras);
    return cls ? [{ id: name, key, system: cls.system, side: sideOf(name), info: localizarPieza(resolvePart(name, extras), extras.name_en) }] : [];
  }))));
let unloaded = { model: null, parts: [], failed: false };      // índice que usa el buscador, siempre de un modelo
function loadPendingIndex() {
  const model = state.model;
  if (!MODELS[model].index) return Promise.resolve();
  return indexOf(model).then(
    (parts) => {
      for (const part of parts) localizarPieza(part.info, part.info.en);    // el idioma pudo cambiar desde que llegó
      return { parts, failed: false };
    },
    (err) => { console.error(err); return { parts: [], failed: true }; },
  ).then((r) => {
    // Una respuesta que llega después de cambiar de modelo no toca el buscador (ni el índice) del modelo nuevo.
    if (model !== state.model) return;
    unloaded = { model, ...r };
    if ($('#panel-search').classList.contains('open')) renderSearch($('#search-input').value);
  });
}

// Texto en el que se busca una pieza: nombre, latín, inglés y, en español, los sinónimos de su ficha de módulo
// («cubital» encuentra el nervio ulnar; «humeral», la arteria braquial).
const textoBuscable = (p) => norm(`${p.info.title} ${p.info.latin ?? ''} ${p.info.entry?.nombre ?? ''} ${p.info.en ?? ''}`
  + (idioma() === 'es' ? ` ${sinonimosDePieza(p.id, state.model).join(' ')}` : ''));

function renderSearch(q) {
  const list = $('#search-results');
  const term = norm(q.trim());
  const seen = new Set();
  const shown = (p) => !(viewer.modesty && p.modestEmpty);
  const groups = Object.entries(GRUPOS)
    .filter(([id, g]) => term && viewer.parts.some((p) => p.groups.includes(id) && shown(p)) && norm(`${g.nombre} ${g.latin}`).includes(term))
    .map(([id, g]) => ({ group: id, label: g.nombre }))
    .sort((a, b) => a.label.localeCompare(b.label, idioma()));
  const parts = viewer.parts
    .filter((p) => shown(p) && (!term || textoBuscable(p).includes(term)))
    .sort((a, b) => a.info.title.localeCompare(b.info.title, idioma()))
    .filter((p) => {
      const k = `${p.info.title}|${p.side}`;
      return !seen.has(k) && seen.add(k);
    })
    .slice(0, 80);
  // Lo que todavía no está descargado (nunca con «Mostrar genitales externos» desactivado: no se sabe qué quedaría oculto).
  const systems = MODELS[state.model].systems ?? {};
  const own = unloaded.model === state.model;
  const later = !term || !own ? [] : unloaded.parts
    .filter((p) => systems[p.key] && !sessions.current?.loaded(p.key) && !(viewer.modesty && GENITAL_NAME.test(p.id)))
    .filter((p) => textoBuscable(p).includes(term))
    .sort((a, b) => a.info.title.localeCompare(b.info.title, idioma()))
    .filter((p) => {
      const k = `${p.info.title}|${p.side}`;
      return !seen.has(k) && seen.add(k);
    })
    .slice(0, Math.max(0, 80 - parts.length));
  // Sin índice, el buscador solo ve lo ya descargado: se dice y se ofrece reintentar.
  const note = own && unloaded.failed && term
    ? `<li class="muted search-note">${t('buscar.sinIndice')} <button data-retry-index>${t('comun.reintentar')}</button></li>`
    : '';
  list.innerHTML = note + groups.map((g) => `
      <li><button data-group="${g.group}"><span class="res-kind">${t('buscar.region')}</span><span class="res-name">${g.label}</span></button></li>`).join('') +
    (parts.length || groups.length || later.length
      ? [...parts, ...later].map((p) => `
      <li><button ${p.key ? `data-pending="${p.key}" ` : ''}data-id="${p.id}" style="--sys:${SYSTEM_BY_ID[p.system].color}">
        <i></i><span class="res-name">${p.info.title}${p.side ? ` <em>${t(p.side === 'L' ? 'buscar.izq' : 'buscar.der')}</em>` : ''}</span>
        <small>${etiqueta(SYSTEM_BY_ID[p.system].label)}</small>
      </button></li>`).join('')
      : `<li class="muted empty">${t('buscar.sinResultados')}</li>`);
  list.querySelector('[data-retry-index]')?.addEventListener('click', () => loadPendingIndex());
  list.querySelectorAll('[data-id]').forEach((b) => b.addEventListener('click', async function open() {
    if (isMobile()) closePanels();
    if (b.dataset.pending && !(await ensureSystem(b.dataset.pending, { retry: open }))) return;
    const part = viewer.parts.find((p) => p.id === b.dataset.id);
    if (part) reveal(part);
  }));
  list.querySelectorAll('[data-group]').forEach((b) => b.addEventListener('click', () => {
    selectGroup(b.dataset.group);
    if (isMobile()) closePanels();
  }));
}

function buildChrome() {
  document.querySelectorAll('[data-icon]').forEach((b) => b.insertAdjacentHTML('afterbegin', uiIcon(b.dataset.icon)));
  document.querySelectorAll('[data-sysicon]').forEach((b) => b.insertAdjacentHTML('afterbegin', systemIcon(b.dataset.sysicon)));
  document.querySelectorAll('.toolbar [data-panel]').forEach((b) => {
    b.setAttribute('aria-expanded', 'false');
    b.setAttribute('aria-controls', `panel-${b.dataset.panel}`);
    b.addEventListener('click', () => togglePanel(b.dataset.panel));
  });
  document.querySelectorAll('.panel').forEach((p) => (p.inert = true));
  document.querySelectorAll('.panel h2').forEach((h) => h.setAttribute('tabindex', '-1'));
  document.querySelectorAll('.panel .icon-btn[data-close]').forEach((b) => {
    b.innerHTML = uiIcon('close');
    b.addEventListener('click', closePanels);
  });
  // Gana el último clic: volver al modelo que se ve mientras se descarga el otro cancela esa descarga (antes se ignoraba
  // el clic y el otro modelo acababa sustituyéndolo).
  document.querySelectorAll('#model-switch [data-model]').forEach((b) => b.addEventListener('click', () => {
    const m = b.dataset.model;
    if (m === (requested ?? state.model)) return;
    if (m === state.model) cancelModelLoad();
    else loadModel(m);
  }));

  $('#btn-home').addEventListener('click', () => { selectPart(null); viewer.home(); });
  $('#btn-undo').addEventListener('click', undo);
  $('#status-pill button').addEventListener('click', showAll);
  $('#search-input').addEventListener('input', (e) => renderSearch(e.target.value));

  $('#panel-tools').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-tool]');
    if (!b) return;
    const tool = b.dataset.tool;
    if (tool === 'show-all') showAll();
    else if (tool === 'rotate') {
      b.classList.toggle('on');
      viewer.setAutoRotate(b.classList.contains('on'));
    } else viewer.view(tool);
  });
  // Idioma: el guardado en este navegador (inglés si no hay); al cambiarlo, la interfaz se rehace en el nuevo.
  const selIdioma = $('#set-idioma');
  selIdioma.value = idioma();
  selIdioma.addEventListener('change', () => fijarIdioma(selIdioma.value, almacen));
  // En pantallas táctiles (móviles, tabletas) se empieza en calidad baja: la oclusión ambiental dibuja la escena dos veces.
  if (TACTIL) {
    $('#set-quality').checked = false;
    viewer.setQuality(false);
  }
  $('#set-quality').addEventListener('change', (e) => viewer.setQuality(e.target.checked));
  // Preferencia de cada navegador; si el almacenamiento no está disponible, se usa el valor por defecto (visibles).
  const genitals = $('#set-genitals');
  try { genitals.checked = localStorage.getItem('anato3d.genitals') !== '0'; } catch { /* sin almacenamiento */ }
  viewer.setModesty(!genitals.checked);
  genitals.addEventListener('change', () => {
    try { localStorage.setItem('anato3d.genitals', genitals.checked ? '1' : '0'); } catch { /* sin almacenamiento */ }
    viewer.setModesty(!genitals.checked);
    apply();
    toast(t(genitals.checked ? 'aviso.genitalesVisibles' : 'aviso.genitalesOcultos'));
  });
  $('#set-hover').addEventListener('change', (e) => {
    viewer.hoverEnabled = e.target.checked;
    viewer.setHover(null);
    tooltip.hidden = true;
  });

  window.addEventListener('keydown', (e) => {
    if (portada.abierta) return;                         // la pantalla de inicio tiene sus propias teclas
    if ($('#panel-study').classList.contains('open') && study.onKey(e)) { e.preventDefault(); return; }
    if (e.target instanceof Element && e.target.matches('input, textarea, select')) return;
    const has = !evaluando && selectionParts().length > 0;
    const k = e.key.toLowerCase();
    if ((e.metaKey || e.ctrlKey) && k === 'z') { e.preventDefault(); undo(); }
    else if (e.key === 'Escape') { closePopover(); closePanels(); selectPart(null); }
    else if (has && k === 'h') selectionAction('hide');
    else if (has && k === 'i') selectionAction('isolate');
    else if (has && k === 'f') selectionAction('focus');
    else if (has && k === 'v') selectionAction('fade');
    else if (e.key === '/' && !evaluando) { e.preventDefault(); togglePanel('search'); }
  });
}

// ── Carga de modelos ────────────────────────────────────────────
// Región genital: necesaria para «Mostrar genitales externos» en el hombre. Si falla, falla la carga del modelo (y se
// puede reintentar): sin ella, con la opción desactivada se verían los testículos.
const regionOf = onceByKey((url) => fetchJSON(url));

let loadSeq = 0;
let modelAbort = null;
let requested = null;                                    // modelo pedido que aún no se ve
function cancelModelLoad() {
  loadSeq++;
  modelAbort?.abort();
  requested = null;
  toast(t(`modelo.${state.model}.aria`));
  renderDock();
}
async function loadModel(id) {
  const seq = ++loadSeq;
  modelAbort?.abort();                                   // la descarga del modelo pedido antes ya no hace falta
  const abort = (modelAbort = new AbortController());
  const wanted = () => seq === loadSeq;
  requested = id;
  renderDock();
  const first = !sessions.current;
  const loader = $('#loader');
  const bar = $('#loader-bar');
  const que = t(`modelo.${id}.frase`);
  // La primera carga cubre la pantalla; un cambio de modelo deja usar el actual mientras tanto.
  if (first) {
    loader.hidden = false;
    loader.classList.remove('done', 'failed');
    bar.style.width = '0%';
    $('#loader-label').textContent = t('carga.cargando', { que });
  } else toast(t('carga.cargando', { que }), 0);
  const progress = (k) => {
    if (!wanted()) return;
    if (first) bar.style.width = `${Math.round(k * 100)}%`;
    else toast(`${t('carga.cargando', { que })} ${Math.round(k * 100)} %`, 0);
  };
  let region = null;
  try {
    // La tabla de nombres del idioma (francés, italiano) llega antes de instalar el modelo; nunca falla (sin ella, latín).
    [region] = await Promise.all([MODELS[id].genitalRegion ? regionOf(MODELS[id].genitalRegion) : null, nombresListos]);
    if (!wanted()) return;
    if (!(await viewer.loadModel(urlBase(id), { signal: abort.signal, onProgress: progress, wanted }))) return;
  } catch (err) {
    if (!wanted() || err?.name === 'AbortError') return;  // se pidió otro modelo mientras tanto
    requested = null;
    renderDock();
    console.error(err);
    const msg = t('carga.error', { que, causa: describeError(err) });
    if (first) {
      loader.classList.add('failed');
      $('#loader-label').textContent = msg;
    } else toast(`${msg} ${t('carga.sigues')}`, 0, { label: t('comun.reintentar'), run: () => loadModel(id) });
    return;
  }
  // Instalado: nueva sesión (cierra la anterior y aborta sus descargas) y estado del modelo nuevo.
  requested = null;
  sessions.open(id, viewer.generation);
  viewer.setGenitalRegion(region);
  state.model = id;
  useGroupsOf(id);
  current = null;
  computeAvailability();
  const previous = pausa?.estado.stages ?? state.stages;  // de vuelta en la pantalla de inicio: los de la exploración
  state.stages = {};
  for (const sys of SYSTEMS) {
    const want = Object.keys(previous).length ? previous[sys.id] : DEFAULT_STAGES[sys.id];
    state.stages[sys.id] = want && available[sys.id].has(want) ? want : null;
  }
  if (!state.stages.skeletal && !state.stages.integumentary) state.stages.integumentary = 'skin';
  state.hidden.clear();
  state.faded.clear();
  state.isolated = null;
  history.length = 0;
  $('#model-detail').textContent = t(`modelo.${id}.detalle`);
  for (const part of viewer.parts) localizarPieza(part.info, part.extras.name_en);
  // Buscador abierto: se redibuja ya con el modelo nuevo (si no, seguían a la vista los resultados del anterior hasta
  // que llegaba su índice) y luego se completa con lo no descargado.
  if ($('#panel-search').classList.contains('open')) {
    renderSearch($('#search-input').value);
    loadPendingIndex();
  }
  // Un cambio de modelo pedido antes de volver a la pantalla de inicio: «Continuar» sigue con el modelo nuevo, y mientras
  // tanto la pantalla muestra su esqueleto.
  if (pausa) {
    pausa = { generation: viewer.generation, estado: snapshot(), camara: null };
    state.stages = vitrina();
  }
  apply();
  if (portada.abierta) viewer.setShowcase(true);         // encuadra el esqueleto del tórax hacia arriba
  else viewer.home();
  if (first) {
    bar.style.width = '100%';
    loader.classList.add('done');
    setTimeout(() => (loader.hidden = true), 400);
  } else toast(t(`modelo.${id}.aria`));
  // Los sistemas en archivo aparte que ya empiezan activos (p. ej. los cartílagos) se completan al cargar; en la
  // pantalla de inicio, sin avisos de progreso (los errores sí se avisan).
  for (const sys of Object.keys(MODELS[id].systems ?? {})) {
    if (state.stages[sys]) ensureSystem(sys, { quiet: portada.abierta }).then((ok) => ok && apply());
  }
  for (const sys of SYSTEMS) if (state.stages[sys.id]) loadContext(sys.id);
}
$('#loader-retry').addEventListener('click', () => loadModel(state.model));

// Cambio de idioma: textos del HTML, nombres de piezas y grupos, y lo que está a la vista.
function localizarTodo() {
  localizarGrupos();
  for (const part of viewer.parts) localizarPieza(part.info, part.extras.name_en);
  for (const part of unloaded.parts) localizarPieza(part.info, part.info.en);
}
alCambiar(async (id) => {
  nombresListos = cargarIdioma(id);
  await nombresListos;
  if (id !== idioma()) return;                           // se eligió otro mientras llegaba la tabla de nombres
  document.documentElement.lang = id;
  document.title = t('doc.titulo');
  traducirDom(document);
  $('#set-idioma').value = id;
  $('#study-aviso').hidden = id === 'es';
  localizarTodo();
  if (sessions.current) $('#model-detail').textContent = t(`modelo.${state.model}.detalle`);
  closePopover();
  renderDock();
  renderStatus();
  renderSelection();
  study.refrescar();
  if ($('#panel-search').classList.contains('open')) renderSearch($('#search-input').value);
});
// La tabla del idioma inicial puede llegar después de nombrar los grupos (con el latín mientras tanto).
nombresListos.then(() => localizarGrupos());
$('#study-aviso').hidden = idioma() === 'es';

// ── Volver a la pantalla de inicio ──────────────────────────────
// Desde Ajustes o desde el nombre de la barra. La pantalla muestra el esqueleto, como al abrir la app; la exploración
// (sistemas, piezas ocultas, atenuadas o aisladas y la cámara) queda en `pausa` y vuelve tal cual con «Continuar».
let pausa = null;

// Lo que se ve en la pantalla de inicio: los sistemas con los que empieza la app (el esqueleto y los cartílagos).
function vitrina() {
  return Object.fromEntries(SYSTEMS.map(({ id }) => [id, available[id]?.has(DEFAULT_STAGES[id]) ? DEFAULT_STAGES[id] : null]));
}

function volverAlInicio() {
  if (portada.abierta || !sessions.current) return;
  closePopover();
  closePanels();
  selectPart(null);
  pausa = { generation: viewer.generation, estado: snapshot(), camara: viewer.camara() };
  portada.abrir(() => {
    Object.assign(state, { stages: vitrina(), hidden: new Set(), faded: new Set(), isolated: null });
    apply();
    viewer.setShowcase(true);
    for (const sys of Object.keys(MODELS[state.model].systems ?? {})) {
      if (state.stages[sys]) ensureSystem(sys, { quiet: true }).then((ok) => ok && portada.abierta && apply());
    }
  });
}

// «Continuar»: la exploración como quedó (o, si mientras tanto llegó otro modelo, sus sistemas en la vista inicial).
function reanudar() {
  const { generation, estado, camara } = pausa;
  pausa = null;
  Object.assign(state, estado);
  apply();
  for (const sys of Object.keys(MODELS[state.model].systems ?? {})) {
    if (state.stages[sys]) ensureSystem(sys).then((ok) => ok && apply());   // solo avisa si tiene que descargarlo
  }
  for (const sys of SYSTEMS) if (state.stages[sys.id]) loadContext(sys.id);
  if (camara && generation === viewer.generation) viewer.irA(camara);
  else viewer.home();
}

buildChrome();
buildDock();
const portada = createStart({
  root: $('#start'),
  ajustes: $('#panel-settings'),
  creditos: $('#creditos'),
  onIniciar() {
    viewer.setShowcase(false);
    updateInsets();
    if (pausa) reanudar();
    else if (sessions.current) viewer.home();            // si el modelo aún se descarga, lo encuadra loadModel
  },
});
$('#btn-inicio').addEventListener('click', volverAlInicio);
$('#btn-brand').addEventListener('click', volverAlInicio);
if (portada.abierta) viewer.setShowcase(true);
loadModel('male');
if (import.meta.env.DEV) window.anato3d = { viewer, state };
