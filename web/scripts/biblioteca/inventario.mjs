// Inventario de las piezas de los dos modelos para la biblioteca de estudio: cada estructura (nombre de pieza sin el
// lado) con sus nombres (es/en/la de los metadatos de Z-Anatomy), su clasificación educativa (clasificar.mjs) y en qué
// modelos está. Lo usan scripts/biblioteca.mjs (mapa de cobertura) y las comprobaciones de las lecciones.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { clasificar } from './clasificar.mjs';

export const WEB = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..');
const MODELS = path.join(WEB, 'public/models');

// Nodos (nombre y datos) de un .glb: el JSON va en el primer bloque, tras la cabecera de 12 bytes.
function nodos(file) {
  const b = fs.readFileSync(path.join(MODELS, file));
  return JSON.parse(b.subarray(20, 20 + b.readUInt32LE(12)).toString('utf8')).nodes ?? [];
}

// Igual que main.js/check-cards: el nombre de la pieza en el visor.
export const nombrePieza = (n) => (n ?? '').replace(/\s/g, '_').replace(/[[\].:/]/g, '');
// Clave de la estructura: sin el lado final (_L/_R). «Left_atrium» y «Right_atrium» son estructuras distintas.
export const claveDe = (nombre) => nombrePieza(nombre).replace(/_[LR]$/, '');

/**
 * { estructuras: Map(clave → { clave, es, en, la, sistemaVisor, sistema, subsistema, tipo, lugares, modelos: Set,
 *   lados: Set('L'|'R'|''), piezas: { male: Set, female: Set } }), piezas: { male: Set, female: Set } }
 */
export function inventario() {
  const estructuras = new Map();
  const piezas = { male: new Set(), female: new Set() };
  for (const modelo of ['male', 'female']) {
    const files = fs.readdirSync(MODELS).filter((f) => f.endsWith('.glb') && !f.includes('.ligero.')
      && (f === `${modelo}.glb` || f.startsWith(`${modelo}-`)));
    for (const file of files) {
      for (const n of nodos(file)) {
        const x = n.extras ?? {};
        if (!x.system) continue;
        const nombre = nombrePieza(n.name);
        const clave = claveDe(nombre);
        piezas[modelo].add(nombre);
        let e = estructuras.get(clave);
        if (!e) {
          const c = clasificar(clave, x, modelo);
          e = { clave, es: x.name_es || null, en: x.name_en || null, la: x.name_la || null, sistemaVisor: x.system, ...c,
            modelos: new Set(), lados: new Set(), piezas: { male: new Set(), female: new Set() } };
          estructuras.set(clave, e);
        } else if (e.sistema !== clasificar(clave, x, modelo).sistema) {
          // Los órganos genitales tienen el mismo nombre de sistema en los dos modelos, pero no el mismo sistema educativo.
          e.otroSistema = clasificar(clave, x, modelo).sistema;
        }
        e.modelos.add(modelo);
        e.lados.add(nombre.match(/_([LR])$/)?.[1] ?? '');
        e.piezas[modelo].add(nombre);
      }
    }
  }
  return { estructuras, piezas };
}
