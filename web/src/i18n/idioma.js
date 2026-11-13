// Idioma de la interfaz: español, inglés (el predeterminado), alemán, francés e italiano. Se guarda en este navegador.
// Sin DOM al importarse: las pruebas de Node lo usan tal cual.
import { TEXTOS, ETIQUETAS, ETIQUETAS_PATRON } from './textos.js';

export const IDIOMAS = [
  { id: 'es', nombre: 'Español' },
  { id: 'en', nombre: 'English' },
  { id: 'de', nombre: 'Deutsch' },
  { id: 'fr', nombre: 'Français' },
  { id: 'it', nombre: 'Italiano' },
];
/**
 * Idiomas que se pueden elegir. Alemán, francés e italiano salen en la lista como «próximamente» (decisión de Carlos,
 * 2026-11-12): sus textos se conservan, pero lo nuevo solo se escribe en español e inglés. Quien los tuviera guardados
 * vuelve al predeterminado.
 */
export const DISPONIBLES = ['es', 'en'];
export const PREDETERMINADO = 'en';
export const CLAVE = 'anato3d.idioma';

let actual = PREDETERMINADO;
const oyentes = new Set();
const valido = (id) => IDIOMAS.some((i) => i.id === id);

export const idioma = () => actual;

/** El idioma guardado en este navegador, o el predeterminado (también si el almacenamiento no está disponible). */
export function leerIdioma(storage) {
  try {
    const v = storage?.getItem(CLAVE);
    if (DISPONIBLES.includes(v)) return v;
  } catch { /* sin almacenamiento */ }
  return PREDETERMINADO;
}

/** Cambia el idioma, lo guarda y avisa a quien escucha (alCambiar). */
export function fijarIdioma(id, storage = null) {
  if (!valido(id)) return;
  actual = id;
  try { storage?.setItem(CLAVE, id); } catch { /* sin almacenamiento */ }
  for (const fn of oyentes) fn(id);
}

export function alCambiar(fn) {
  oyentes.add(fn);
  return () => oyentes.delete(fn);
}

const mayuscula = (s) => (s ? s[0].toLocaleUpperCase(actual) + s.slice(1) : s);

// {x}: el valor de x; {X}: el mismo con la primera letra en mayúscula.
function rellenar(s, vars) {
  return s.replace(/\{(\w+)\}/g, (m, k) => {
    if (k in vars) return vars[k];
    const min = k[0].toLowerCase() + k.slice(1);
    return min in vars ? mayuscula(String(vars[min])) : m;
  });
}

/** Texto de la interfaz en el idioma actual (si falta, en español; si no existe la clave, la clave). */
export function t(clave, vars = {}) {
  const e = TEXTOS[clave];
  if (!e) return clave;
  const v = e[actual] || e.es;
  return rellenar(Array.isArray(v) ? v[1] : v, vars);
}

/** Texto con singular y plural: tn('estado.ocultas', 3) → «3 ocultas». */
export function tn(clave, n, vars = {}) {
  const e = TEXTOS[clave];
  if (!e) return clave;
  const v = e[actual] || e.es;
  return rellenar(Array.isArray(v) ? v[n === 1 ? 0 : 1] : v, { n, ...vars });
}

/** Etiqueta corta que el código da en español (sistema, capa, tipo de pieza, lado…) en el idioma actual. */
export function etiqueta(es) {
  if (!es || actual === 'es') return es;
  const directa = ETIQUETAS[es]?.[actual];
  if (directa) return directa;
  for (const [re, tr] of ETIQUETAS_PATRON) if (re.test(es)) return es.replace(re, tr[actual]);
  // Compuesta: cada parte por separado; las que iban en minúscula siguen así (salvo en alemán: sustantivos).
  if (es.includes(' · ')) {
    return es.split(' · ').map((p) => {
      const tr = etiqueta(mayuscula(p));
      return p[0] === p[0].toLowerCase() && actual !== 'de' ? tr[0].toLocaleLowerCase(actual) + tr.slice(1) : tr;
    }).join(' · ');
  }
  return es;
}

/**
 * Traduce lo marcado en el HTML: data-t (texto), data-t-html (con etiquetas), data-t-aria (aria-label),
 * data-t-tip (data-tip, la ayuda de la barra) y data-t-ph (placeholder).
 */
export function traducirDom(root) {
  for (const el of root.querySelectorAll('[data-t]')) el.textContent = t(el.dataset.t);
  for (const el of root.querySelectorAll('[data-t-html]')) el.innerHTML = t(el.dataset.tHtml);
  for (const el of root.querySelectorAll('[data-t-aria]')) el.setAttribute('aria-label', t(el.dataset.tAria));
  for (const el of root.querySelectorAll('[data-t-tip]')) el.dataset.tip = t(el.dataset.tTip);
  for (const el of root.querySelectorAll('[data-t-ph]')) el.placeholder = t(el.dataset.tPh);
  // Idiomas aún no disponibles: «Deutsch (próximamente)» en el idioma de la interfaz.
  for (const el of root.querySelectorAll('option[data-pronto]')) el.textContent = t('ajustes.proximamente', { lengua: el.dataset.pronto });
}
