// Limitaciones conocidas del modelo 3D (src/data/limitaciones.js) para Neuri: lo que Claude necesita saber de las
// estructuras con las que va a trabajar, y nada más (solo las que tienen alguna limitación, y solo de esas). Van en el
// bloque variable de cada llamada, nunca en el fijo (que es el mismo para todas y se guarda en caché).
// Las instrucciones no bastan: ensamblar.mjs quita además, de forma determinista, las preguntas y actividades en 3D que
// pidan ver o tocar una pieza que el modelo muestra mal.
import { LIMITACIONES, limitacionesDe, textoLimitacion } from '../../src/data/limitaciones.js';
import { normalizar } from '../../src/biblioteca/buscar.js';

const QUE_NO = {
  identificar: 'preguntas de identificar',
  localizar: 'preguntas o actividades de localizar (ni como candidata)',
  distractor: 'opciones falsas',
};

/**
 * La nota de una estructura del inventario (su clave, sin el lado), en español, o '' si no tiene limitaciones: qué le
 * pasa en el modelo y qué no se puede pedir con ella.
 */
export function notaLimite(clave) {
  return limitacionesDe(clave).map((l) => {
    const no = l.restringe.map((u) => QUE_NO[u]).filter(Boolean);
    return `LIMITACIÓN DEL MODELO 3D: ${textoLimitacion(l, 'aviso', 'es')} ${no.length ? `No la uses en ${no.join(', ')}; puedes explicarla con fuentes, sin pedir que se mire en el modelo.` : 'Puede señalarse lo que se ve, pero no describas lo que falta como si se viera en el modelo.'}`;
  }).join(' ');
}

/** El bloque para el prompt con las limitaciones de unas estructuras (claves del inventario), o '' si ninguna tiene. */
export function textoLimites(claves) {
  const lineas = [...new Set(claves)].map((k) => [k, notaLimite(k)]).filter(([, n]) => n).map(([k, n]) => `- ${k}: ${n}`);
  return lineas.length ? `LIMITACIONES DEL MODELO 3D de estas estructuras (la app no hará con ellas lo que aquí se prohíbe):\n${lineas.join('\n')}` : '';
}

/**
 * Las piezas del registro (claves sin el lado) que nombran unos textos con su nombre completo en cualquiera de los
 * idiomas del inventario: español, inglés, latín, francés o italiano (el alemán usa el latín). `inventario.mencionadas`
 * solo mira es/en/la y sirve además para puntuar candidatas, así que no se toca: esto es solo para las notas.
 */
export function limitadasEn(textos, inventario) {
  const conBordes = (s) => ` ${normalizar(s)} `;
  const ts = textos.filter(Boolean).map(conBordes);
  if (!ts.length) return [];
  return [...new Set(LIMITACIONES.flatMap((l) => l.piezas))].filter((k) => {
    const e = inventario?.estructuras?.[k];
    const nombres = [k.replace(/_/g, ' '), e?.es, e?.en, e?.la, e?.fr, e?.it].filter(Boolean).map(conBordes);
    return nombres.some((n) => ts.some((t) => t.includes(n)));
  });
}

/** Claves del inventario de todas las piezas de una lección (de cada estructura, todas sus piezas, sin el lado). */
export const clavesDeLeccion = (L) => Object.values(L?.estructuras ?? {}).flatMap((e) => (e.piezas ?? []).map((p) => String(p).replace(/_[LR]$/, '')));
