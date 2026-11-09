// Ayuda para escribir lecciones: las piezas de los modelos cuyo nombre (clave, español, inglés o latín) encaja con un
// patrón, con su tipo, lados, modelos y lugar. Uso: node scripts/biblioteca/piezas.mjs 'deltoid|supraspin' [--region cabeza]
import { inventario } from './inventario.mjs';

const [patron = '.', ...resto] = process.argv.slice(2);
const region = resto.includes('--region') ? resto[resto.indexOf('--region') + 1] : null;
const tipo = resto.includes('--tipo') ? resto[resto.indexOf('--tipo') + 1] : null;
const re = new RegExp(patron, 'i');
const { estructuras } = inventario();
for (const e of [...estructuras.values()].sort((a, b) => a.clave.localeCompare(b.clave))) {
  if (![e.clave, e.es, e.en, e.la].some((x) => x && re.test(x))) continue;
  if (region && !e.lugares.some(([r, s]) => r === region || s === region)) continue;
  if (tipo && e.tipo !== tipo) continue;
  const lados = [...e.lados].filter(Boolean).join('') || '-';
  const mod = e.modelos.size === 2 ? '' : ` [solo ${[...e.modelos][0]}]`;
  console.log(`${e.clave} · ${e.es ?? e.en} · ${e.tipo} · ${lados}${mod} · ${e.lugares.map(([r, s]) => `${r}/${s ?? '-'}`).join(' ')}`);
}
