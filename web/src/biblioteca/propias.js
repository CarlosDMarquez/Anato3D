// «Mis lecciones»: las lecciones que crea o adapta Neuri, guardadas solo en este navegador (localStorage). Tienen el
// mismo formato que las de la biblioteca (formato.js) y se estudian igual, con el visor, la evaluación y el repaso,
// pero son borradores generados por IA: la app lo dice siempre. Sin DOM: lo prueba `npm test`.
import { revisarLeccion } from './formato.js';
import { ID_PROPIA } from '../pet/protocolo.js';

export const CLAVE_PROPIAS = 'anato3d.propias';
export const MAX_PROPIAS = 40;
const MAX_BYTES = 3 * 1024 * 1024;

/** ¿Es una lección propia con la forma mínima para abrirla? (lo guardado puede venir de otra versión o estar dañado). */
export function esPropiaValida(L) {
  if (!L || typeof L !== 'object' || !ID_PROPIA.test(L.id ?? '') || !L.origen?.neuri) return false;
  if (!Array.isArray(L.pasos) || !L.pasos.length || !L.estructuras || typeof L.estructuras !== 'object' || !Array.isArray(L.preguntas)) return false;
  // El revisor sin modelos ni registro de fuentes: forma, pasos, preguntas, objetivos y citas.
  return !revisarLeccion(L, {}).some((p) => p.nivel === 'error');
}

/** Las lecciones propias guardadas (las válidas), de la más reciente a la más antigua. */
export function cargarPropias(storage) {
  try {
    const d = JSON.parse(storage?.getItem(CLAVE_PROPIAS) ?? '[]');
    return Array.isArray(d) ? d.filter(esPropiaValida) : [];
  } catch { return []; }
}

/** Guarda (o sustituye) una lección propia. Devuelve { ok, error?: 'invalida' | 'lleno' | 'almacenamiento' }. */
export function guardarPropia(storage, L) {
  if (!esPropiaValida(L)) return { ok: false, error: 'invalida' };
  const lista = [L, ...cargarPropias(storage).filter((x) => x.id !== L.id)].slice(0, MAX_PROPIAS);
  const datos = JSON.stringify(lista);
  if (datos.length > MAX_BYTES) return { ok: false, error: 'lleno' };
  try { storage.setItem(CLAVE_PROPIAS, datos); return { ok: true }; } catch { return { ok: false, error: 'almacenamiento' }; }
}

/** Borra una lección propia. */
export function borrarPropia(storage, id) {
  try { storage.setItem(CLAVE_PROPIAS, JSON.stringify(cargarPropias(storage).filter((x) => x.id !== id))); return true; } catch { return false; }
}

/** La entrada del catálogo de una lección propia (los mismos campos que genera scripts/biblioteca.mjs). */
export function entradaCatalogo(L, orden = 1000) {
  return {
    id: L.id, version: L.version, titulo: L.titulo, resumen: L.resumen, lugares: L.lugares ?? [], sistemas: L.sistemas ?? [],
    formato: L.formato, temas: L.temas ?? [], nivel: L.nivel, minutos: L.minutos, requisitos: [], siguiente: [],
    modelos: L.modelos, idiomas: L.idiomas, objetivos: L.objetivos,
    estructuras: Object.entries(L.estructuras).map(([id, e]) => ({ id, nombre: e.nombre, tipo: e.tipo, papel: e.papel, en: null, la: null })),
    orden, pasos: L.pasos.length, preguntas: L.preguntas.length, estado: L.revision?.estado ?? 'borrador',
    propia: true, origen: L.origen,
  };
}

/** Lo que se cuenta a Neuri de una lección propia (para recomendarla o adaptarla). */
export const resumenPropia = (L) => ({ id: L.id, titulo: L.titulo, resumen: L.resumen, minutos: L.minutos, nivel: L.nivel });
