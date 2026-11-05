// Nombres de las estructuras y de los grupos en el idioma actual.
// - es: el título de la ficha (data/resolve*.js) y el nombre del grupo;
// - en: el inglés de Z-Anatomy (`name_en`) y, para los grupos, su clave («Muscles_of_head»);
// - fr, it: tablas de tools/nombres_idiomas.py (public/i18n/nombres-<id>.json), de la traducción de Z-Anatomy y la TA2;
// - de: el latín, como en los atlas alemanes (no hay tabla alemana entre las fuentes).
// Si falta el nombre, el latín y, sin latín, el inglés.
import { idioma } from './idioma.js';
import { fetchJSON } from '../loading.js';

const CON_TABLA = new Set(['fr', 'it']);
const tablas = {};

/** Descarga la tabla de un idioma (una vez). Sin ella, ese idioma muestra el latín. */
export async function cargarNombres(id) {
  if (!CON_TABLA.has(id) || tablas[id]) return;
  ponerTabla(id, await fetchJSON(`/i18n/nombres-${id}.json`));
}

/** Tabla de nombres de un idioma ({ name_en sin lado: nombre }); la usan cargarNombres y las pruebas. */
export function ponerTabla(id, tabla) {
  tablas[id] = tabla;
}

// La clave de las tablas es el `name_en` sin el lado: «Seventh rib (left)» → «Seventh rib».
const claveEn = (en) => String(en ?? '').replace(/\s*\((left|right)\)$/i, '').trim();
// Para mostrarlo, además sin restos del nombre del objeto en Z-Anatomy («Central canal'», «Lat_Fis-post»).
const inglesVisible = (en) => claveEn(en).replace(/['.]+$/, '').replace(/_/g, ' ');

/** Nombre de una pieza: `tituloEs` (el de la ficha), `latin` y `en` (el `name_en` del modelo). */
export function nombrePieza({ tituloEs, latin, en }) {
  const id = idioma();
  if (id === 'es') return tituloEs;
  const ingles = en ? inglesVisible(en) : '';
  if (id === 'en') return ingles || latin || tituloEs;
  if (id === 'de') return latin || ingles || tituloEs;
  return tablas[id]?.[claveEn(en)] ?? (latin || ingles || tituloEs);
}

/** Nombre de un grupo de la ruta jerárquica (GRUPOS[id], con `nombreEs` y `latin`). */
export function nombreGrupo(id, g) {
  const lang = idioma();
  if (lang === 'es') return g.nombreEs ?? g.nombre;
  const ingles = id.replace(/_/g, ' ');
  if (lang === 'en') return ingles;
  if (lang === 'de') return g.latin || ingles;
  return tablas[lang]?.[id] ?? (g.latin || ingles);
}
