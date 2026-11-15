// Página de presentación: iconos, idioma (español en /, inglés en /en/; el mismo ajuste que la app), menú del móvil, el
// tutorial con sus marcas y la fila de sistemas del móvil. Sin dependencias de la app: la página tiene que ser ligera
// (la app se abre en /app/). Los textos en inglés no se cambian aquí: /en/ es otra página (vite.config.js la genera con
// src/presentacion/traducir.mjs), así cada idioma tiene su URL para los buscadores.
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-sans/600.css';
import '@fontsource/ibm-plex-serif/400-italic.css';
import './presentacion.css';
import { SYSTEM_ICONS, UI_ICONS } from '../ui/icon-data.js';
import { PROPIOS } from './iconos.js';

export const CLAVE = 'anato3d.idioma';           // la misma que i18n/idioma.js
const IDIOMAS = ['es', 'en'];
const actual = document.documentElement.lang === 'en' ? 'en' : 'es';

// ── Iconos: los de la app (Health Icons y Lucide) y cuatro de Lucide que la app no usa (iconos.js) ──
const svg = (icono, clase) => (icono ? `<svg viewBox="0 0 ${icono.size} ${icono.size}" class="${clase}" aria-hidden="true" focusable="false">${icono.body}</svg>` : '');
for (const el of document.querySelectorAll('[data-icon]')) el.innerHTML = svg(PROPIOS[el.dataset.icon] ?? UI_ICONS[el.dataset.icon], 'icono');
for (const el of document.querySelectorAll('[data-sysicon]')) el.innerHTML = svg(SYSTEM_ICONS[el.dataset.sysicon], 'icono-sis');

// ── Idioma ──
const leer = () => { try { return localStorage.getItem(CLAVE); } catch { return null; } };
const guardar = (id) => { try { localStorage.setItem(CLAVE, id); } catch { /* sin almacenamiento: solo esta visita */ } };
// Elegir el otro idioma lo guarda (la app y la próxima visita lo usan) y lleva a la misma sección en la otra página.
for (const a of document.querySelectorAll('a[data-idioma]')) {
  a.addEventListener('click', (e) => {
    const id = a.dataset.idioma;
    if (!IDIOMAS.includes(id)) return;
    guardar(id);
    if (id === actual) return;
    e.preventDefault();
    location.href = a.getAttribute('href') + location.hash;
  });
}
// Al abrir la app: si aún no hay idioma guardado, el de esta página, para que la app salga igual. También al abrirla en
// otra pestaña (el clic central, el menú contextual y la pulsación larga no lanzan «click»). Si ya hay uno, no se toca:
// puede ser una elección hecha en la app después de cargar esta página.
const guardarSiFalta = () => { if (!IDIOMAS.includes(leer())) guardar(actual); };
for (const a of document.querySelectorAll('[data-abrir]')) for (const ev of ['pointerdown', 'click', 'auxclick']) a.addEventListener(ev, guardarSiFalta);

// ── Menú del móvil ──
const cabecera = document.querySelector('.cabecera');
const menu = document.querySelector('.menu-boton');
const nav = document.getElementById('nav');
const abierto = () => menu.getAttribute('aria-expanded') === 'true';
const abrirMenu = (si) => {
  cabecera.classList.toggle('menu-abierto', si);
  menu.setAttribute('aria-expanded', String(si));
};
menu.addEventListener('click', () => {
  const abrir = !abierto();
  abrirMenu(abrir);
  if (abrir) nav.querySelector('a')?.focus();    // el foco entra en el menú (los enlaces van antes del botón)
});
for (const a of nav.querySelectorAll('a')) a.addEventListener('click', () => abrirMenu(false));
// Se cierra al salir el foco de la cabecera, al tocar fuera o con Escape (el foco vuelve al botón).
cabecera.addEventListener('focusout', (e) => {
  if (abierto() && e.relatedTarget && !cabecera.contains(e.relatedTarget)) abrirMenu(false);
});
document.addEventListener('pointerdown', (e) => { if (abierto() && !cabecera.contains(e.target)) abrirMenu(false); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && abierto()) { abrirMenu(false); menu.focus(); }
});
matchMedia('(min-width: 900px)').addEventListener('change', (e) => e.matches && abrirMenu(false));

// ── Sistemas en el móvil: la fila se desliza; si se desliza, también con el teclado ──
const fila = document.querySelector('.sistemas');
if (fila) {
  const comprobar = () => {
    if (fila.scrollWidth > fila.clientWidth + 4) fila.tabIndex = 0; else fila.removeAttribute('tabindex');
  };
  comprobar();                                   // ya, sin esperar al primer fotograma (el observador va después)
  new ResizeObserver(comprobar).observe(fila);
}

// ── Tutorial: al pasar el puntero, cada paso enciende su marca en la captura, y al revés (decorativo: los números
// ya relacionan cada paso con su marca) ──
const marcas = new Map([...document.querySelectorAll('.marca-paso')].map((m) => [m.dataset.paso, m]));
const pasos = new Map([...document.querySelectorAll('.pasos li[data-paso]')].map((p) => [p.dataset.paso, p]));
const resaltar = (n, si) => {
  marcas.get(n)?.classList.toggle('activo', si);
  pasos.get(n)?.classList.toggle('activo', si);
};
for (const [n, el] of [...pasos, ...marcas]) {
  el.addEventListener('pointerenter', () => resaltar(n, true));
  el.addEventListener('pointerleave', () => resaltar(n, false));
}
