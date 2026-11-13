// Estimación del gasto mensual de Neuri en Claude (sin llamar a nada). Editable: cambia las cifras de abajo o pásalas
// por la línea de órdenes. Con --observado, usa lo que costó de verdad cada tipo de llamada (el historial del tope de
// gasto, build/servidor/presupuesto.json) en vez de los perfiles de tokens.
//
// Uso (desde web/):  npm run coste
//                    npm run coste -- --mensajes 20000 --local 0.5 --lecciones 2000
//                    npm run coste -- --observado
//
// Tres clases de uso, como pidió Carlos:
//  - orientación: una pregunta que contesta la IA (una llamada «orientar»);
//  - explicación verificada: «orientar» + «verificar explicación» (comprueba las citas);
//  - lección completa: planificar + redactar + verificar (+ a veces una ronda de corrección).
// Lo que resuelve la app sola (el buscador y las rutas locales de src/pet/ruta.js) no cuesta nada: --local es esa parte.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';
import { TARIFAS, FECHA_TARIFAS, NANO } from '../server/neuri/presupuesto.mjs';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = (n, def) => { const i = process.argv.indexOf(`--${n}`); return i > 0 ? Number(String(process.argv[i + 1]).replace(',', '.')) : def; };

// ── Lo que se supone (cámbialo con lo que se observe después del lanzamiento) ──
const USO = {
  mensajes: arg('mensajes', 20_000),       // mensajes de estudiantes a Neuri al mes
  local: arg('local', 0.4),                // parte que resuelve la app sin IA (rutas locales y buscador)
  explicaciones: arg('explicaciones', 0.25), // de los que van a la IA, cuántos acaban en explicación verificada
  lecciones: arg('lecciones', 2_000),      // lecciones creadas o adaptadas al mes
  correccion: arg('correccion', 0.3),      // parte de las lecciones que necesita una ronda de corrección
  caliente: arg('caliente', 0.7),          // llamadas con la caché caliente (otra en los 5 min anteriores)
};
// Tokens de la parte fija (en caché) de cada modo, medidos el 2026-11-12 (≈ 3,7 caracteres por token): Orientar lleva
// las instrucciones de Carlos y de la app, su modo y el catálogo compacto (24 347 caracteres); los demás, solo las
// instrucciones (7 125). Antes, todas las llamadas llevaban el catálogo entero: unos 31 800 tokens (117 721 caracteres).
const PREFIJO = { orientar: arg('prefijo-orientar', 6_600), base: arg('prefijo', 1_930) };
// Tokens de cada llamada aparte de la parte fija: entrada (contexto, detalle de las lecciones candidatas, evidencias,
// historial, esquema) y salida (con el razonamiento). Orientativos: el registro del servidor y --observado dan los de verdad.
const PERFILES = {
  orientar: { entrada: 9_000, salida: 700, fijo: 'orientar' },
  'verificar explicación': { entrada: 2_000, salida: 300 },
  sesion: { entrada: 3_500, salida: 600 },
  planificar: { entrada: 11_000, salida: 2_500 },
  redactar: { entrada: 27_000, salida: 9_000 },
  verificar: { entrada: 14_000, salida: 2_500 },
};
const modelo = 'claude-haiku-5-5';

/** n$ de una llamada con su perfil, fría (escribe la parte fija en la caché) o caliente (la lee). */
function coste({ entrada, salida, fijo = 'base' }, caliente) {
  const t = TARIFAS[modelo];
  const prefijo = PREFIJO[fijo];
  const p = t.umbral && prefijo + entrada > t.umbral ? t.alto : t;
  return prefijo * (caliente ? p.leer : p.escribir) + entrada * p.entrada + salida * p.salida;
}
const medio = (perfil) => USO.caliente * coste(perfil, true) + (1 - USO.caliente) * coste(perfil, false);
let porLlamada = Object.fromEntries(Object.entries(PERFILES).map(([k, v]) => [k, medio(v)]));
let origen = `perfiles de tokens (parte fija: ${PREFIJO.orientar} en orientar, ${PREFIJO.base} en los demás; caché caliente ${Math.round(USO.caliente * 100)} %)`;

if (process.argv.includes('--observado')) {
  const env = { ...loadEnv('development', raiz, ''), ...process.env };
  const archivo = path.join(env.ANATO3D_DATOS?.trim() || path.join(raiz, '../build/servidor'), 'presupuesto.json');
  let historial = [];
  try { historial = JSON.parse(fs.readFileSync(archivo, 'utf8')).historial ?? []; } catch { /* sin archivo */ }
  const reales = historial.filter((h) => Number.isInteger(h.real) && h.estado !== 'liberada');
  if (!reales.length) {
    console.log(`No hay llamadas reales en ${archivo}: se usan los perfiles.\n`);
  } else {
    const base = (e) => e.replace(/ \(corrección\)$/, '').replace(/^adaptar$/, 'redactar');
    const grupos = {};
    for (const h of reales) (grupos[base(h.etiqueta)] ??= []).push(h.real);
    for (const [k, v] of Object.entries(grupos)) if (k in porLlamada) porLlamada[k] = v.reduce((a, b) => a + b, 0) / v.length;
    origen = `lo observado (${reales.length} llamadas del historial; lo que falta, de los perfiles)`;
  }
}

const iaMensajes = USO.mensajes * (1 - USO.local);
const orientacion = porLlamada.orientar;
const explicacion = porLlamada.orientar + porLlamada['verificar explicación'];
const leccion = porLlamada.planificar + porLlamada.redactar + porLlamada.verificar + USO.correccion * (porLlamada.redactar + porLlamada.verificar);
const mesMensajes = iaMensajes * ((1 - USO.explicaciones) * orientacion + USO.explicaciones * explicacion);
const mesLecciones = USO.lecciones * leccion;
const total = mesMensajes + mesLecciones;
const $ = (n, d = 4) => `${(n / NANO).toFixed(d)} US$`;

console.log(`Estimación del gasto de Neuri con ${modelo} (tarifas del ${FECHA_TARIFAS}; ${origen})\n`);
console.log('Por unidad:');
console.log(`  Orientación (una pregunta a la IA) .............. ${$(orientacion)}`);
console.log(`  Explicación verificada (orientar + verificar) ... ${$(explicacion)}`);
console.log(`  Sesión de estudio con IA (modo «sesion»; ${Math.round(USO.correccion * 100)} % con corrección) ... ${$(porLlamada.sesion * (1 + USO.correccion))}`);
console.log(`  Lección completa (planificar, redactar, verificar; ${Math.round(USO.correccion * 100)} % con corrección) ... ${$(leccion)}`);
console.log(`\nAl mes (${USO.mensajes} mensajes, ${Math.round(USO.local * 100)} % en local → ${Math.round(iaMensajes)} a la IA, ${Math.round(USO.explicaciones * 100)} % explicaciones; ${USO.lecciones} lecciones):`);
console.log(`  Mensajes ........ ${$(mesMensajes, 2)}`);
console.log(`  Lecciones ....... ${$(mesLecciones, 2)}`);
console.log(`  Total ........... ${$(total, 2)}  (sin alojamiento ni impuestos)`);
console.log(`\nLas cifras orientativas de Carlos: ${USO.mensajes} × 0,002 + ${USO.lecciones} × 0,01–0,04 = ${(USO.mensajes * 0.002 + USO.lecciones * 0.01).toFixed(0)}–${(USO.mensajes * 0.002 + USO.lecciones * 0.04).toFixed(0)} US$ al mes (sin restar lo local).`);
const dia = Math.ceil((total / NANO / 30) * 1.5 * 100) / 100;
const mes = Math.ceil((total / NANO) * 1.2);
console.log(`\nTopes sugeridos (con margen para picos): ANATO3D_TOPE_DIARIO_USD=${dia.toFixed(2)} y ANATO3D_TOPE_MENSUAL_USD=${mes}.`);
console.log('Para el piloto, mejor empezar bajo (p. ej. 1 al día y 20 al mes) y subirlo con lo observado: npm run coste -- --observado.');
