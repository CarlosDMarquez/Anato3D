// Prueba real MÍNIMA de Neuri (optativa; GASTA DINERO, unos 0,01 US$): las menos llamadas que demuestran que la clave
// llega a Claude Haiku 5.5, que el flujo (streaming) funciona y que las explicaciones salen con fuentes comprobadas.
// Separada de `npm run pet:prueba` (17 conversaciones y, con --crear, una lección entera: mucho más gasto).
//
//   1. Una pregunta con explicación («¿Qué forman los huesos nasales?»): Neuri responde con citas de las páginas
//      guardadas y el servidor las comprueba con otra llamada (2 llamadas, sin flujo).
//   2. Una llamada en flujo, corta, con instrucciones de una línea (1 llamada; unos pocos tokens).
//
// Pasa por el mismo tope de gasto que el servidor (con su archivo y su cerrojo: cierra antes el servidor). Antes de
// empezar dice lo máximo que podría costar (la suma de las reservas) y solo sigue con --si-gastar. Se para en el primer
// fallo. Al final, lo que costó cada llamada según `usage`, para compararlo con la consola de Anthropic (Usage).
//
// Uso (desde web/):  node scripts/prueba-minima.mjs              (dice lo que haría y lo máximo que costaría; no envía nada)
//                    node scripts/prueba-minima.mjs --si-gastar  (la hace)
// Ensayo sin gastar: con ANTHROPIC_BASE_URL apuntando al proveedor simulado (scripts/proveedor-simulado.mjs).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';
import { crearManejador } from '../server/pet.mjs';
import { llamar, crearCliente } from '../server/neuri/modelo.mjs';
import { cargarRecursos } from '../server/neuri/recursos.mjs';
import { presupuestoDesdeEntorno, cotaReserva, nanoAUsd, FECHA_TARIFAS } from '../server/neuri/presupuesto.mjs';
import { configuracion } from '../server/produccion.mjs';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const env = { ...loadEnv('development', raiz, ''), ...process.env };
const gastar = process.argv.includes('--si-gastar');
const MODELO = 'claude-haiku-5-5';
const fin = (codigo, texto) => { (codigo ? console.error : console.log)(texto); presupuesto?.cerrar(); process.exit(codigo); };
let presupuesto = null;

// El proveedor: Anthropic o, para ensayar, el simulado de esta máquina (la misma regla que el servidor de producción).
let simulado = false;
try { simulado = configuracion(env, { paquete: raiz }).simulado; } catch (err) { fin(1, `✖ ${err.message}`); }
const clave = env.ANTHROPIC_API_KEY?.trim();
if (!clave) fin(1, '✖ Falta la clave: ANTHROPIC_API_KEY en web/.env.local (o en el entorno).');
presupuesto = presupuestoDesdeEntorno(env, { raiz });
if (!presupuesto.disponible) fin(1, `✖ Sin presupuesto para la IA (${presupuesto.motivo}): pon ANATO3D_TOPE_DIARIO_USD y ANATO3D_TOPE_MENSUAL_USD${presupuesto.motivo === 'otro-proceso' ? ', y cierra el servidor (comparten el tope)' : ''}.`);

const catalogo = JSON.parse(fs.readFileSync(path.join(raiz, 'src/biblioteca/generado/catalogo.json'), 'utf8'));
const registro = { info: () => {}, error: (s) => console.error(`   ${s}`) };
const recursos = await cargarRecursos({ raiz, registro });
if (!recursos.disponible) fin(1, '✖ Sin páginas citables (npm run fuentes -- comprobar): no se podrían comprobar las fuentes.');

// Lo máximo que podría costar: las reservas de las tres llamadas, sin calibrar (la parte fija contada en bytes).
// La parte fija de cada modo (medida el 2026-11-12, en bytes de JSON): orientar, unos 25 200 (instrucciones, su modo y
// el catálogo compacto); verificar, unos 7 300 (solo instrucciones). Antes, las dos llevaban el catálogo entero (121 000).
const fijo = { orientar: 26_000, verificar: 8_000 };
const maximo = cotaReserva(MODELO, { bytes: fijo.orientar + 32_000, maxTokens: 3000 }) + cotaReserva(MODELO, { bytes: fijo.verificar + 4_000, maxTokens: 2000 }) + cotaReserva(MODELO, { bytes: 1_000, maxTokens: 300 });
console.log(`Prueba mínima con ${MODELO}${simulado ? ' (PROVEEDOR SIMULADO: no gasta)' : ''}: 3 llamadas (explicación con fuentes y su comprobación; una en flujo).`);
console.log(`  Coste máximo admitido: ${nanoAUsd(maximo)} US$ (reservas de las tres; lo normal, unos 0,005–0,01 US$). Tarifas del ${FECHA_TARIFAS}.`);
console.log(`  Queda en el tope: ${nanoAUsd(presupuesto.restante())} US$.`);
if (presupuesto.restante() < maximo) fin(1, '✖ El tope que queda no cubre el máximo: no se envía nada.');
if (!gastar && !simulado) fin(0, '\nNo se ha enviado nada. Para hacerla: node scripts/prueba-minima.mjs --si-gastar');

const antes = presupuesto.resumen().historial.length;
const manejar = crearManejador({ catalogo, clave, recursos: () => recursos, registro, presupuesto, limites: { porIp: 100, porHora: 100 } });
const peticion = (cuerpo) => new Request('http://localhost/api/pet', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(cuerpo) });

// 1. Explicación con fuentes (Haiku + las citas comprobadas por el servidor).
console.log('\n1. «¿Qué forman los huesos nasales?»');
const r1 = await manejar(peticion({ v: 2, modo: 'orientar', idioma: 'es', mensajes: [{ rol: 'usuario', texto: '¿Qué forman los huesos nasales? Explícamelo.' }], progreso: { terminadas: [], enCurso: [], repasos: [], guardadas: [] } }));
const d1 = await r1.json();
if (r1.status !== 200) fin(1, `✖ La API no respondió bien (${r1.status}: ${d1.error}). Parada.`);
console.log(`   ${d1.tipo} con ${d1.evidencias?.length ?? 0} cita(s)${d1.aviso ? ` · aviso: ${d1.aviso}` : ''} · modelo ${d1.modelo}`);
if (d1.modelo && !String(d1.modelo).startsWith('claude-haiku-5-5')) fin(1, `✖ Respondió otro modelo (${d1.modelo}). Parada.`);
const fuentes = d1.tipo === 'explicacion' && d1.evidencias?.length && !d1.aviso;
console.log(`   ${fuentes ? '✔ explicación con fuentes comprobadas' : '· sin explicación con fuentes (Haiku eligió otra respuesta): el acceso a Haiku sí queda probado'}`);

// 2. Una llamada en flujo, corta.
console.log('\n2. Flujo (streaming)');
const api = crearCliente(clave);
try {
  const r2 = await llamar(api, { modelo: MODELO, sistema: ['Eres una prueba de conexión de Anato3D. Responde solo con el JSON pedido.'], mensajes: [{ role: 'user', content: 'Responde {"ok": true}.' }], esquema: { type: 'object', properties: { ok: { type: 'boolean' } }, required: ['ok'], additionalProperties: false }, maxTokens: 300, flujo: true, presupuesto, registro, etiqueta: 'prueba mínima (flujo)' });
  console.log(`   ✔ flujo correcto: ${JSON.stringify(r2.datos)} · ${r2.modelo}`);
} catch (err) { fin(1, `✖ El flujo falló (${err.codigo ?? err.name}). Parada.`); }

// Conciliación: lo que costó cada llamada según `usage` (el tope ya lo ajustó).
const h = presupuesto.resumen().historial.slice(antes);
console.log('\nConciliación (usage → coste; compárala con console.anthropic.com → Usage, a esta hora y con este modelo):');
for (const x of h) console.log(`   ${x.fecha.slice(11, 19)} UTC  ${x.etiqueta.padEnd(24)} ${x.real === null ? 'incierta' : `${nanoAUsd(x.real)} US$`}  (reservado ${nanoAUsd(x.reservado)})`);
const total = h.reduce((n, x) => n + (x.real ?? x.reservado), 0);
fin(0, `\n${h.length === 3 ? '✔' : '·'} ${h.length} llamadas; total ${nanoAUsd(total)} US$ (máximo admitido ${nanoAUsd(maximo)} US$)${simulado ? ' — simulado: no es un gasto real' : ''}.`);
