// Índice de las fichas del sistema linfático: une las fichas centrales (troncos, conductos, colectores, órganos y la
// ficha general del nodo) con las de cada región, que se escriben en archivos separados para que cada redactor tenga el
// suyo. Una clave solo puede estar en un archivo (si se repite, gana la primera y check-cards lo marca).
import CENTRALES, { GRUPOS_LINF } from './centrales.js';
import CABEZA from './cabeza.js';
import CUELLO from './cuello.js';
import MIEMBRO_SUPERIOR from './miembro-superior.js';
import TORAX from './torax.js';
import ABDOMEN from './abdomen.js';
import PELVIS from './pelvis.js';
import MIEMBRO_INFERIOR from './miembro-inferior.js';

export { GRUPOS_LINF };
export * from './formato.js';

export const ARCHIVOS_LINF = { centrales: CENTRALES, cabeza: CABEZA, cuello: CUELLO, 'miembro-superior': MIEMBRO_SUPERIOR, torax: TORAX, abdomen: ABDOMEN, pelvis: PELVIS, 'miembro-inferior': MIEMBRO_INFERIOR };

/** Claves que están en más de un archivo: [[clave, [archivos]]]. */
export const REPETIDAS_LINF = (() => {
  const donde = new Map();
  for (const [a, fichas] of Object.entries(ARCHIVOS_LINF)) for (const k of Object.keys(fichas)) donde.set(k, [...(donde.get(k) ?? []), a]);
  return [...donde].filter(([, v]) => v.length > 1);
})();

export const FICHAS_LINF = {};
for (const fichas of Object.values(ARCHIVOS_LINF)) for (const [k, f] of Object.entries(fichas)) FICHAS_LINF[k] ??= f;
