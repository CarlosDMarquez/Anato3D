// Módulos de estudio y búsqueda de la ficha de módulo de una pieza del modelo.
import { MODULO_BRAZO } from './brazo.js';
import { MODULO_ANTEBRAZO } from './antebrazo.js';

export const MODULOS = [MODULO_BRAZO, MODULO_ANTEBRAZO];

const PORPIEZA = new Map();       // nombre base de la malla → { modulo, ficha }
export const FICHA_POR_ID = new Map();
for (const modulo of MODULOS) {
  for (const ficha of modulo.estructuras) {
    FICHA_POR_ID.set(ficha.id, ficha);
    for (const p of ficha.piezas) PORPIEZA.set(p, { modulo, ficha });
  }
}

/** Ficha de módulo de una pieza («Long_head_of_biceps_brachii_L» → bíceps braquial del módulo del brazo), o null. */
export function fichaDePieza(nombre, modelo = null) {
  const hit = PORPIEZA.get(nombre.replace(/_[LR]$/, ''));
  if (!hit || (modelo && !hit.ficha.modelos.includes(modelo))) return null;
  return hit;
}

/** Sinónimos en español de la ficha de módulo de una pieza (para el buscador): [] si no tiene. */
export function sinonimosDePieza(nombre, modelo = null) {
  return (fichaDePieza(nombre, modelo)?.ficha.sinonimos ?? []).map((sn) => sn.nombre);
}
