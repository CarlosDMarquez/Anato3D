// Datos de Neuri para el servidor: el inventario de las estructuras de los dos modelos 3D con sus nombres en los cinco
// idiomas, su tipo, su sistema, su región y su lado. Con él, Neuri solo planifica y redacta lecciones con piezas que
// existen de verdad en el visor, y la app las puede mostrar.
//
// Uso (desde web/):  node scripts/neuri-datos.mjs               escribe server/generado/inventario.json
//                    node scripts/neuri-datos.mjs --comprobar   falla si no está al día (lo usa `npm run check`)
//
// Nombres: español, el de la ficha del visor (src/data/resolve.js); inglés y latín, los de Z-Anatomy; francés e
// italiano, las tablas de public/i18n; alemán, el latín (como en los atlas alemanes y en el visor).
import fs from 'fs';
import path from 'path';
import { inventario, WEB } from './biblioteca/inventario.mjs';
import { resolvePart } from '../src/data/resolve.js';
import { TIPOS_ESTRUCTURA } from '../src/biblioteca/formato.js';

const SALIDA = path.join(WEB, 'server/generado/inventario.json');
const tabla = (id) => JSON.parse(fs.readFileSync(path.join(WEB, `public/i18n/nombres-${id}.json`), 'utf8'));
const TABLAS = { fr: tabla('fr'), it: tabla('it') };
const claveEn = (en) => String(en ?? '').replace(/\s*\((left|right)\)$/i, '').trim();
const inglesVisible = (en) => claveEn(en).replace(/['.]+$/, '').replace(/_/g, ' ');

const SISTEMA_VISOR = { oseo: 'skeletal' };
// Huesos del carpo: la ficha los llama como en la jerga («Grande», «Trapecio»), que en una lección se confunden con
// otras cosas (el músculo trapecio); en las lecciones de Neuri, con «hueso» delante, como en la terminología española.
const HUESO_DELANTE = new Set(['Escafoides', 'Semilunar', 'Piramidal', 'Pisiforme', 'Trapecio', 'Trapezoide', 'Grande', 'Ganchoso']);

export function construir() {
  const { estructuras } = inventario();
  const out = {};
  for (const [clave, e] of [...estructuras].sort(([a], [b]) => a.localeCompare(b))) {
    if (!TIPOS_ESTRUCTURA.includes(e.tipo)) continue;                       // «grasa»: no es una estructura que se estudie
    const lados = [...e.lados];
    // Bilateral si en cada modelo están los dos lados; impar si no tiene lado. Lo mixto (un lado en un modelo y una
    // sola pieza en el otro) se deja fuera: Neuri no lo puede mostrar igual en los dos.
    const porModelo = [...e.modelos].map((m) => [...e.piezas[m]].map((p) => p.match(/_([LR])$/)?.[1] ?? ''));
    const bilateral = porModelo.every((ls) => ls.includes('L') && ls.includes('R') && !ls.includes(''));
    const impar = porModelo.every((ls) => ls.length === 1 && ls[0] === '');
    if (!bilateral && !impar) continue;
    const nombreMalla = bilateral ? `${clave}_R` : clave;
    const info = resolvePart(nombreMalla, { system: e.sistemaVisor ?? SISTEMA_VISOR[e.sistema], name_en: e.en, name_es: e.es, name_la: e.la });
    const en = e.en ? inglesVisible(e.en) : null;
    const ficha = info?.title || e.es || null;
    const es = e.tipo === 'hueso' && HUESO_DELANTE.has(ficha) ? `Hueso ${ficha.toLowerCase()}` : ficha;
    if (!es && !en) continue;
    out[clave] = {
      es: es ?? en,
      en: en ?? e.la ?? es,
      la: info?.latin || e.la || null,
      fr: TABLAS.fr[claveEn(e.en)] ?? null,
      it: TABLAS.it[claveEn(e.en)] ?? null,
      tipo: e.tipo,
      sistema: e.sistema,
      ...(e.otroSistema ? { otroSistema: e.otroSistema } : {}),
      lugares: e.lugares ?? [],
      lado: bilateral ? 'bilateral' : 'impar',
      modelos: [...e.modelos].sort(),
    };
    void lados;
  }
  return { version: 1, estructuras: out };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  const datos = `${JSON.stringify(construir(), null, 0).replace(/\},"/g, '},\n"')}\n`;
  if (process.argv.includes('--comprobar')) {
    const actual = fs.existsSync(SALIDA) ? fs.readFileSync(SALIDA, 'utf8') : '';
    if (actual !== datos) { console.error('server/generado/inventario.json no está al día (node scripts/neuri-datos.mjs)'); process.exit(1); }
    console.log('neuri: inventario al día');
  } else {
    fs.mkdirSync(path.dirname(SALIDA), { recursive: true });
    fs.writeFileSync(SALIDA, datos);
    const n = Object.keys(JSON.parse(datos).estructuras).length;
    console.log(`server/generado/inventario.json: ${n} estructuras (${(datos.length / 1024).toFixed(0)} kB)`);
  }
}
