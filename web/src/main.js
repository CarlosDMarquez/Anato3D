import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-serif/400-italic.css';
import './styles.css';
import { Viewer } from './viewer.js';
import { SYSTEMS, SYSTEM_BY_ID, DEFAULT_STAGES } from './systems.js';
import { systemIcon, uiIcon } from './ui/icons.js';
import { renderInfo } from './ui/info.js';
import { GRUPOS } from './data/grupos.js';

const MODELS = {
  male: {
    url: '/models/male.glb', label: 'Masculino', detail: 'Fase 4 · 12 sistemas', icon: 'male',
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
  female: { url: '/models/female.glb', label: 'Femenino', detail: 'Fase 1 · piel y ojos', icon: 'female' },
};

const $ = (sel) => document.querySelector(sel);
const isMobile = () => window.innerWidth < 760;
const viewer = new Viewer($('#stage'));
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
  if (!prev) return toast('No hay nada que deshacer');
  Object.assign(state, prev);
  apply();
}

function stageOf(part) {
  return SYSTEM_BY_ID[part.system].stages.find((s) => s.id === state.stages[part.system]) ?? null;
}

function apply() {
  for (const part of viewer.parts) {
    const stage = stageOf(part);
    part.visible = !!stage && stage.filter(part) && !state.hidden.has(part.id) && (!state.isolated || state.isolated.has(part.id))
      && !(viewer.modesty && part.modestEmpty);
    part.ghost = !!stage?.ghost || state.faded.has(part.id);
  }
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
    const pending = lazy[sys.id] && !lazy[sys.id].loaded;
    available[sys.id] = new Set(sys.stages.filter((st) => pending || parts.some((p) => st.filter(p))).map((st) => st.id));
  }
}

// Descarga el GLB de un sistema la primera vez que se activa.
async function ensureSystem(id) {
  const def = MODELS[state.model].systems?.[id];
  if (!def || def.loaded) return true;
  const label = SYSTEM_BY_ID[id].noun ?? `sistema ${SYSTEM_BY_ID[id].label.toLowerCase()}`;
  def.loading ??= (async () => {
    toast(`Cargando ${label}…`, 0);
    const meta = await fetch(def.meta).then((r) => r.json());
    for (const [gid, g] of Object.entries(meta.groups ?? {})) GRUPOS[gid] ??= g;
    await viewer.addSystem(def.url, (k) => toast(`Cargando ${label}… ${Math.round(k * 100)} %`, 0));
    def.loaded = true;
    computeAvailability();
    toast(`${label[0].toUpperCase()}${label.slice(1)} listo`);
  })().catch((err) => {
    console.error(err);
    toast(`No se pudo cargar: ${label}`);
    def.loading = null;
  });
  await def.loading;
  return !!def.loaded;
}

// ── Dock de sistemas ────────────────────────────────────────────
const dock = $('#dock');

function buildDock() {
  dock.innerHTML = SYSTEMS.map((s) => `
    <button class="dock-item" data-sys="${s.id}" style="--sys:${s.color}">
      <span class="dock-icon">${systemIcon(s.id)}</span>
      <span class="dock-name">${s.label}</span>
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
      if (!available[id].size) return openStageMenu(id, btn);
      cycleStage(id);
    });
  });
}

function renderDock() {
  for (const btn of dock.querySelectorAll('.dock-item')) {
    const sys = SYSTEM_BY_ID[btn.dataset.sys];
    const stageId = state.stages[sys.id];
    const empty = !available[sys.id]?.size;
    const stage = stageId && sys.stages.find((s) => s.id === stageId);
    btn.classList.toggle('on', !!stageId);
    btn.classList.toggle('empty', empty);
    btn.querySelector('.dock-stage').textContent = empty ? 'Pronto' : stage ? stage.label : 'Apagado';
    btn.title = `${sys.label}${stage ? ` · ${stage.label}` : ''} — clic: siguiente capa · mantener: todas las capas`;
  }
  document.querySelectorAll('#model-switch [data-model]').forEach((b) => b.classList.toggle('on', b.dataset.model === state.model));
}

function cycleStage(id) {
  const sys = SYSTEM_BY_ID[id];
  const order = [null, ...sys.stages.filter((s) => available[id].has(s.id)).map((s) => s.id)];
  setStage(id, order[(order.indexOf(state.stages[id] ?? null) + 1) % order.length]);
}

async function setStage(id, stageId) {
  if (stageId && !(await ensureSystem(id))) return;
  change(() => {
    state.stages[id] = stageId;
    state.isolated = null;
  });
  const sys = SYSTEM_BY_ID[id];
  toast(stageId ? `${sys.label} · ${sys.stages.find((s) => s.id === stageId).label}` : `${sys.label} · apagado`);
}

function openStageMenu(id, anchor) {
  const sys = SYSTEM_BY_ID[id];
  const active = state.stages[id] ?? null;
  const empty = !available[id].size;
  openPopover(anchor, `
    <header class="pop-head" style="--sys:${sys.color}">${systemIcon(id)}<div><b>${sys.label}</b><small>Capas del sistema</small></div></header>
    ${empty ? '<p class="pop-note">Este sistema todavía no tiene modelo 3D; llegará en una próxima fase.</p>' : ''}
    <div class="pop-list">
      <button data-stage="" class="${active === null ? 'current' : ''}" ${empty ? 'disabled' : ''}>Apagado</button>
      ${sys.stages.map((s, i) => {
        const ok = available[id].has(s.id);
        return `<button data-stage="${s.id}" class="${active === s.id ? 'current' : ''}" ${ok ? '' : 'disabled'}>
          <span class="step">${i + 1}</span>${s.label}${ok ? '' : '<small>Pronto</small>'}</button>`;
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
function toast(msg, ms = 1800) {
  const el = $('#toast');
  el.textContent = msg;
  el.hidden = false;
  el.classList.add('show');
  clearTimeout(toastTimer);
  if (ms) toastTimer = setTimeout(() => el.classList.remove('show'), ms);
}

const tooltip = $('#tooltip');
viewer.addEventListener('hover', ({ detail }) => {
  if (!detail.part || viewer.selection.has(detail.part)) return (tooltip.hidden = true);
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
  if (!parts.length) return toast('Ese grupo no está visible con las capas actuales');
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
  const parts = selectionParts();
  const sys = parts[0] && SYSTEM_BY_ID[parts[0].system];
  renderInfo(infoEl, current, {
    system: sys,
    faded: parts.length > 0 && parts.every((p) => state.faded.has(p.id)),
    collapsed,
    onAction: selectionAction,
    onCrumb: (g) => selectGroup(g),
    onMember: (kind, id) => (kind === 'group' ? selectGroup(id) : selectPart(viewer.parts.find((p) => p.id === id), null, { focus: true })),
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
    toast(`${name} oculto · Deshacer para recuperarlo`);
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
  closePanels();
  selectPart(detail.part, detail.point);
});

// Etiqueta clavada en la estructura con línea guía, como en los atlas.
const pin = $('#pin');
function updatePin() {
  const s = viewer.anchorScreen();
  const parts = selectionParts();
  if (!s || !s.visible || !parts.length) return (pin.hidden = true);
  pin.hidden = false;
  const label = pin.querySelector('.pin-label');
  label.querySelector('b').textContent = current.kind === 'group' ? GRUPOS[current.id].nombre : parts[0].info.title;
  label.querySelector('i').textContent = current.kind === 'group' ? GRUPOS[current.id].latin : (parts[0].info.latin ?? '');
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
    ? 'Vista aislada'
    : [state.hidden.size && `${state.hidden.size} oculta${state.hidden.size === 1 ? '' : 's'}`, state.faded.size && `${state.faded.size} atenuada${state.faded.size === 1 ? '' : 's'}`].filter(Boolean).join(' · ');
}

function showAll() {
  change(() => {
    state.hidden.clear();
    state.faded.clear();
    state.isolated = null;
  });
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
  const sheet = isMobile() && current ? infoEl.offsetHeight : 0;
  viewer.insets = { top: isMobile() ? 56 : 64, bottom: dockH + sheet + 8 };
}
window.addEventListener('resize', () => { updateInsets(); updatePin(); });

// ── Paneles (buscar, herramientas, ajustes, ayuda) ──────────────
function closePanels() {
  document.querySelectorAll('.panel.open').forEach((p) => p.classList.remove('open'));
  document.querySelectorAll('.toolbar button.on').forEach((b) => b.classList.remove('on'));
}

function togglePanel(name) {
  const panel = $(`#panel-${name}`);
  const open = !panel.classList.contains('open');
  closePanels();
  if (!open) return;
  panel.classList.add('open');
  $(`.toolbar [data-panel="${name}"]`).classList.add('on');
  if (name === 'search') {
    const input = $('#search-input');
    input.focus();
    input.select();
    renderSearch(input.value);
  }
}

const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
function renderSearch(q) {
  const list = $('#search-results');
  const term = norm(q.trim());
  const seen = new Set();
  const shown = (p) => !(viewer.modesty && p.modestEmpty);
  const groups = Object.entries(GRUPOS)
    .filter(([id, g]) => term && viewer.parts.some((p) => p.groups.includes(id) && shown(p)) && norm(`${g.nombre} ${g.latin}`).includes(term))
    .map(([id, g]) => ({ group: id, label: g.nombre }));
  const parts = viewer.parts
    .filter((p) => shown(p) && (!term || norm(`${p.info.title} ${p.info.latin ?? ''} ${p.info.entry?.nombre ?? ''}`).includes(term)))
    .sort((a, b) => a.info.title.localeCompare(b.info.title, 'es'))
    .filter((p) => {
      const k = `${p.info.title}|${p.side}`;
      return !seen.has(k) && seen.add(k);
    })
    .slice(0, 80);
  list.innerHTML = groups.map((g) => `
      <li><button data-group="${g.group}"><span class="res-kind">Región</span><span class="res-name">${g.label}</span></button></li>`).join('') +
    (parts.length || groups.length
      ? parts.map((p) => `
      <li><button data-id="${p.id}" style="--sys:${SYSTEM_BY_ID[p.system].color}">
        <i></i><span class="res-name">${p.info.title}${p.side ? ` <em>${p.side === 'L' ? 'izq.' : 'der.'}</em>` : ''}</span>
        <small>${SYSTEM_BY_ID[p.system].label}</small>
      </button></li>`).join('')
      : '<li class="muted empty">Sin resultados en este modelo.</li>');
  list.querySelectorAll('[data-id]').forEach((b) => b.addEventListener('click', () => {
    reveal(viewer.parts.find((p) => p.id === b.dataset.id));
    if (isMobile()) closePanels();
  }));
  list.querySelectorAll('[data-group]').forEach((b) => b.addEventListener('click', () => {
    selectGroup(b.dataset.group);
    if (isMobile()) closePanels();
  }));
}

function buildChrome() {
  document.querySelectorAll('[data-icon]').forEach((b) => b.insertAdjacentHTML('afterbegin', uiIcon(b.dataset.icon)));
  document.querySelectorAll('[data-sysicon]').forEach((b) => b.insertAdjacentHTML('afterbegin', systemIcon(b.dataset.sysicon)));
  document.querySelectorAll('.toolbar [data-panel]').forEach((b) => b.addEventListener('click', () => togglePanel(b.dataset.panel)));
  document.querySelectorAll('.panel .icon-btn[data-close]').forEach((b) => {
    b.innerHTML = uiIcon('close');
    b.addEventListener('click', closePanels);
  });
  document.querySelectorAll('#model-switch [data-model]').forEach((b) => b.addEventListener('click', () => {
    if (b.dataset.model !== state.model) loadModel(b.dataset.model);
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
  // En pantallas táctiles (móviles, tabletas) se empieza en calidad baja: la oclusión ambiental dibuja la escena dos veces.
  if (matchMedia('(pointer: coarse)').matches) {
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
    toast(genitals.checked ? 'Genitales externos visibles' : 'Genitales externos ocultos');
  });
  $('#set-hover').addEventListener('change', (e) => {
    viewer.hoverEnabled = e.target.checked;
    viewer.setHover(null);
    tooltip.hidden = true;
  });

  window.addEventListener('keydown', (e) => {
    if (e.target.matches('input')) return;
    const has = selectionParts().length > 0;
    const k = e.key.toLowerCase();
    if ((e.metaKey || e.ctrlKey) && k === 'z') { e.preventDefault(); undo(); }
    else if (e.key === 'Escape') { closePopover(); closePanels(); selectPart(null); }
    else if (has && k === 'h') selectionAction('hide');
    else if (has && k === 'i') selectionAction('isolate');
    else if (has && k === 'f') selectionAction('focus');
    else if (has && k === 'v') selectionAction('fade');
    else if (e.key === '/') { e.preventDefault(); togglePanel('search'); }
  });
}

// ── Carga de modelos ────────────────────────────────────────────
const regions = new Map();
async function loadRegion(url) {
  if (!url) return null;
  if (!regions.has(url)) {
    regions.set(url, fetch(url).then((r) => (r.ok ? r.json() : null)).catch((err) => {
      console.warn('Sin región genital:', err);
      return null;
    }));
  }
  return regions.get(url);
}

async function loadModel(id) {
  const loader = $('#loader');
  const bar = $('#loader-bar');
  loader.hidden = false;
  loader.classList.remove('done');
  bar.style.width = '0%';
  $('#loader-label').textContent = `Cargando modelo ${MODELS[id].label.toLowerCase()}…`;
  try {
    await viewer.loadModel(MODELS[id].url, (k) => (bar.style.width = `${Math.round(k * 100)}%`));
    viewer.setGenitalRegion(await loadRegion(MODELS[id].genitalRegion));
  } catch (err) {
    $('#loader-label').textContent = 'No se pudo cargar el modelo. Revisa la consola.';
    throw err;
  }
  state.model = id;
  current = null;
  for (const def of Object.values(MODELS[id].systems ?? {})) Object.assign(def, { loaded: false, loading: null });
  computeAvailability();
  const previous = state.stages;
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
  $('#model-detail').textContent = MODELS[id].detail;
  apply();
  viewer.home();
  bar.style.width = '100%';
  loader.classList.add('done');
  setTimeout(() => (loader.hidden = true), 400);
  // Los sistemas en archivo aparte que ya empiezan activos (p. ej. los cartílagos) se completan al cargar.
  for (const sys of Object.keys(MODELS[id].systems ?? {})) {
    if (state.stages[sys]) ensureSystem(sys).then((ok) => ok && apply());
  }
}

buildChrome();
buildDock();
loadModel('male');
if (import.meta.env.DEV) window.anato3d = { viewer, state };
