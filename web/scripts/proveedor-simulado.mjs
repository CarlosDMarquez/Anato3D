// Proveedor simulado de la API de Anthropic, para ensayar el servidor de producción sin gastar ni salir a la red: un
// servidor HTTP local que contesta a POST /v1/messages como la API (en JSON o en flujo SSE, con `usage`), con respuestas
// fijas que encajan con los esquemas de Neuri (orientar, explicar, planificar, redactar, comprobar, recorridos y sesiones
// de estudio; en orientar, también «mostrar» y «sesion_pedida»).
// Solo vale en esta máquina: el servidor de producción admite ANTHROPIC_BASE_URL únicamente en localhost y entonces dice
// «simulado», nunca «comprobada». No se puede activar desde el navegador.
//
// Uso:  node scripts/proveedor-simulado.mjs [--puerto 5199] [--retraso 120]
//       y el servidor con ANTHROPIC_BASE_URL=http://127.0.0.1:5199 y una clave cualquiera (p. ej. sk-ant-simulada).
// En las pruebas: import { crearProveedorSimulado } (tests/produccion.test.mjs).
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { REGIONES } from '../src/biblioteca/taxonomia.js';
import { normalizar } from '../src/biblioteca/buscar.js';

const MODELO = 'claude-haiku-5-5';
const enumDe = (s, ...camino) => camino.reduce((x, k) => x?.[k], s) ?? [];
/** El esquema de planificar un recorrido (con sus unidades); el de orientar también tiene `recorrido`, pero es un id. */
const esRecorrido = (props) => !!props.recorrido?.anyOf?.[0]?.properties?.unidades;
/** El esquema de una sesión de estudio (su plan tiene bloques; el de planificar una lección, pasos). */
export const esSesion = (props) => !!props.plan?.anyOf?.[0]?.properties?.bloques;
const escapar = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Una sesión que cumple las reglas del servidor (server/pet.mjs, revisarSesion) con lo que dice su bloque variable: el
 * repaso si hay vencidos (un 25 %), las candidatas en su orden mientras quepan enteras (o el inicio de la primera), los
 * requisitos antes y una práctica de la última al final si sobra tiempo.
 */
function sesionSimulada(variable) {
  const minutos = Number(variable.match(/PEDIDO DE SESIÓN: (\d+) minutos/)?.[1] ?? 20);
  const vencidas = Number(variable.match(/REPASOS VENCIDOS: (\d+)/)?.[1] ?? 0);
  const candidatas = [...variable.matchAll(/^- ([a-z0-9-]+) — .*?(\d+) min entera.*?requisitos: ([^;]*);/gm)].map((m) => ({ id: m[1], minutos: Number(m[2]), requisitos: m[3] === 'ninguno' ? [] : m[3].split(', ') }));
  const bloques = [];
  let queda = minutos;
  if (vencidas > 0 && minutos >= 10) { const m = Math.floor(minutos * 0.25); bloques.push({ tipo: 'repaso', leccion: null, parte: null, minutos: m, motivo: 'Lo que toca repasar hoy.' }); queda -= m; }
  const elegidas = [];
  for (const c of candidatas) {
    if (elegidas.length >= 3 || queda < 3) break;
    if (c.minutos <= queda) { elegidas.push({ ...c, parte: 'entera', m: c.minutos }); queda -= c.minutos; } else if (!elegidas.length) { elegidas.push({ ...c, parte: 'inicio', m: queda }); queda = 0; }
  }
  // Los requisitos, antes.
  elegidas.sort((a, b) => (b.requisitos.includes(a.id) ? -1 : a.requisitos.includes(b.id) ? 1 : 0));
  for (const c of elegidas) bloques.push({ tipo: 'leccion', leccion: c.id, parte: c.parte, minutos: c.m, motivo: 'Encaja con tu objetivo.' });
  const ultima = elegidas.at(-1);
  if (ultima && queda >= 4) bloques.push({ tipo: 'practica', leccion: ultima.id, parte: null, minutos: Math.min(10, queda), motivo: 'Para afianzar lo recién visto.' });
  return {
    tipo: 'sesion', mensaje: 'Te propongo esta sesión.', sugerencias: [],
    plan: { titulo: 'Sesión de estudio', objetivo: 'Localizar las estructuras principales del tema.', mensaje: 'Empezamos por lo que más te sirve para tu objetivo y terminamos practicando.', bloques },
  };
}

/** La respuesta (los datos JSON que «escribe» el modelo) para una petición de Neuri, según su esquema. */
export function responder(cuerpo) {
  const props = cuerpo.output_config?.format?.schema?.properties ?? {};
  const variable = (cuerpo.system ?? []).map((b) => b.text ?? '').slice(1).join('\n');
  const ultimo = String(cuerpo.messages?.at(-1)?.content ?? '');
  // Una llamada de prueba de conexión (scripts/prueba-minima.mjs): solo { ok }.
  if (props.ok && Object.keys(props).length === 1) return { ok: true };
  // Comprobar (verificar): todas las afirmaciones respaldadas.
  if (props.veredictos) {
    const n = (String(cuerpo.messages?.[0]?.content ?? '').match(/^\d+\./gm) ?? []).length;
    return { veredictos: Array.from({ length: n }, (_, i) => ({ n: i + 1, respalda: 'si', nota: '' })) };
  }
  // Una sesión de estudio con las lecciones candidatas.
  if (esSesion(props)) return sesionSimulada(variable);
  // Un recorrido: seis unidades de lo que se pidió (con su tema).
  if (esRecorrido(props)) {
    const tema = variable.match(/tema: ([^;\n]+)/)?.[1]?.trim() || 'Miembro superior';
    const u = (titulo, objetivo, terminos) => ({ titulo, objetivo, enfoque: '', nivel: 1, minutos: 12, terminos, relacionadas: [], conserva: null });
    return {
      tipo: 'recorrido', mensaje: `He repartido «${tema}» en seis unidades.`, sugerencias: [],
      recorrido: {
        titulo: tema, resumen: 'Seis unidades cortas, de los huesos a los nervios.', objetivo: `Conocer ${tema.toLowerCase()}`, nivel: 1, supuestos: ['Nivel inicial'], limitaciones: [],
        unidades: [
          u('Huesos del hombro y del brazo', 'Localizar la clavícula, la escápula y el húmero.', ['clavicle', 'scapula', 'humerus']),
          u('Músculos del hombro', 'Identificar el deltoides y el manguito rotador.', ['deltoid', 'rotator cuff']),
          u('Músculos del brazo', 'Distinguir los compartimentos anterior y posterior.', ['biceps brachii', 'triceps brachii']),
          u('Huesos del antebrazo', 'Localizar el radio y el cúbito.', ['radius', 'ulna']),
          u('Músculos del antebrazo', 'Distinguir los grupos flexor y extensor.', ['forearm muscles']),
          u('Huesos de la mano', 'Localizar el carpo, el metacarpo y las falanges.', ['carpal bones', 'phalanges']),
        ],
      },
    };
  }
  // Planificar una lección: las primeras estructuras candidatas (las más relacionadas) y el lugar de la primera.
  if (props.plan) {
    const claves = enumDe(props, 'plan', 'anyOf', 0, 'properties', 'estructuras', 'items', 'properties', 'clave', 'enum');
    const tema = variable.match(/tema: ([^;\n]+)/)?.[1]?.trim() || 'Lección de prueba';
    const k = claves.slice(0, 4);
    const lugarTxt = variable.match(new RegExp(`^${(k[0] ?? '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} — [^(]*\\([^;]*; ([^;]+);`, 'm'))?.[1] ?? '';
    const [rn, sn] = lugarTxt.split(' › ').map((x) => normalizar(x));
    const region = REGIONES.find((r) => normalizar(r.nombre) === rn) ?? REGIONES[0];
    const sub = region.sub.find((s) => normalizar(s.nombre) === sn) ?? region.sub[0];
    const sistemas = enumDe(props, 'plan', 'anyOf', 0, 'properties', 'sistemas', 'items', 'enum');
    const temas = enumDe(props, 'plan', 'anyOf', 0, 'properties', 'temas', 'items', 'enum');
    const titulo = tema[0].toUpperCase() + tema.slice(1);
    return {
      tipo: 'plan', mensaje: 'Este es el plan.', sugerencias: [],
      plan: {
        titulo, resumen: `Las estructuras principales de ${tema}.`, nivel: 1, minutos: 12, formato: 'estructuras',
        sistemas: sistemas.slice(0, 1), temas: temas.slice(0, 1), lugares: [{ region: region.id, subregion: sub?.id ?? null }],
        objetivos: [`Localizar ${k.length > 1 ? 'las estructuras principales' : 'la estructura principal'} en el modelo.`, 'Describir qué forma cada una.'],
        estructuras: k.map((clave, i) => ({ clave, papel: i < 3 ? 'nucleo' : 'contexto' })),
        pasos: [
          { tipo: 'orientacion', titulo: 'Dónde está', idea: 'Situar la zona', estructuras: k.slice(-1) },
          { tipo: 'explicacion', titulo: 'La primera', idea: 'La estructura principal', estructuras: k.slice(0, 1) },
          { tipo: 'exploracion', titulo: 'Las demás', idea: 'Compararlas', estructuras: k.slice(1, 3) },
          { tipo: 'sintesis', titulo: 'Repaso', idea: 'Resumen', estructuras: [] },
        ],
        paginas: [], limitaciones: [], supuestos: [],
      },
    };
  }
  // Redactar o adaptar: un borrador con las estructuras y las evidencias que ofrece el esquema.
  if (props.leccion) {
    const p = enumDe(props, 'leccion', 'anyOf', 0, 'properties', 'pasos', 'items', 'properties');
    const claves = enumDe(p, 'ver', 'items', 'enum');
    const ev = enumDe(p, 'frases', 'items', 'properties', 'evidencias', 'items', 'enum');
    const e = (i) => (ev.length ? [ev[i % ev.length]] : []);
    const f = (texto, i) => ({ texto, marca: ev.length ? 'evidencia' : 'guia', evidencias: e(i) });
    const nada = { enunciado: null, correcta: null, distractores: [], orden: [], explicacion: null, evidencias: [] };
    const [a, b, c, d] = [claves[0], claves[1] ?? claves[0], claves[2] ?? claves[0], claves.at(-1)];
    return {
      tipo: 'leccion', mensaje: 'He redactado un borrador con citas.',
      leccion: {
        resumen: 'Las estructuras principales, en el modelo y con sus fuentes.',
        pasos: [
          { tipo: 'orientacion', titulo: 'Dónde está', frases: [f('Esta zona agrupa varias estructuras relacionadas.', 0), { texto: 'Gira el modelo para verla de frente.', marca: 'guia', evidencias: [] }], detalle: [], ver: [d], contexto: [], fantasma: [], camara: 'anterior', esqueleto: true, actividad: null },
          { tipo: 'explicacion', titulo: 'La primera', frases: [f('La primera estructura es la principal de la zona.', 1)], detalle: [], ver: [a], contexto: [], fantasma: [], camara: 'anterolateral', esqueleto: false, actividad: { tipo: 'localizar', estructuras: [a], vistas: [], texto: 'Tócala en el modelo.' } },
          { tipo: 'exploracion', titulo: 'Las demás', frases: [f('Las otras estructuras la rodean.', 2)], detalle: [], ver: [...new Set([b, c])], contexto: [], fantasma: [], camara: 'lateral', esqueleto: false, actividad: null },
          { tipo: 'sintesis', titulo: 'Repaso', frases: [f('Juntas forman la zona que has estudiado.', 3)], detalle: [], ver: [], contexto: [], fantasma: [], camara: 'anterior', esqueleto: false, actividad: null },
        ],
        preguntas: [
          { tipo: 'identificar', objetivo: 0, paso: 1, estructura: a, ...nada },
          { tipo: 'identificar', objetivo: 0, paso: 2, estructura: b, ...nada },
          { tipo: 'localizar', objetivo: 0, paso: 2, estructura: c, ...nada },
          { tipo: 'funcion', objetivo: 1, paso: 1, estructura: null, enunciado: '¿Cuál es la estructura principal de la zona?', correcta: 'La primera que se ve', distractores: ['Ninguna', 'La piel', 'El esqueleto entero'], orden: [], explicacion: 'Es la que se estudia primero.', evidencias: e(0) },
        ],
      },
    };
  }
  // Orientar: explicar (con las evidencias que se le dan), proponer un recorrido o una lección, o recomendar.
  const texto = normalizar(ultimo);
  const lecciones = enumDe(props, 'lecciones', 'items', 'properties', 'id', 'enum');
  // «Ver en 3D»: la primera estructura que ofrece el esquema (si ofrece alguna).
  const mostrar = enumDe(props, 'mostrar', 'items', 'enum').slice(0, 1);
  const base = { lecciones: [], sesion: null, recorrido: null, evidencias: [], solicitud: null, contexto: { tema: null, objetivo: null, nivel: null, minutos: null }, sugerencias: [], sesion_pedida: null, ...(props.mostrar ? { mostrar } : {}) };
  // Pide una sesión de estudio: la app la prepara aparte (modo «sesion»).
  if (/\b(sesion|session|sitzung|seance|sessione)\b/.test(texto)) {
    const min = Number(texto.match(/\b(\d{1,3})\s*(min|minutos|minutes|minuten|minuti)\b/)?.[1] ?? 0);
    return { ...base, tipo: 'recomendacion', mensaje: 'Te preparo una sesión de estudio con lo que hay en la biblioteca.', sesion_pedida: { objetivo: ultimo.slice(0, 300), minutos: min >= 5 ? min : null, nivel: null } };
  }
  if (/\b(curso|recorrido|course|parcours|kurs|corso|percorso)\b/.test(texto)) {
    return { ...base, tipo: 'propuesta', mensaje: 'Un curso entero no cabe en una lección: te lo preparo como un recorrido por unidades.', solicitud: { accion: 'recorrido', tema: 'Miembro superior', objetivo: 'Conocer el miembro superior', nivel: 1, minutos: 12, leccion_base: null, enfoque: '', supuestos: ['Nivel inicial'], terminos: ['upper limb'], explicita: true, suficiente: true, unidades: 6, recorrido_base: null } };
  }
  if (/\badapta\w*\b/.test(texto)) {
    const bases = enumDe(props, 'solicitud', 'anyOf', 0, 'properties', 'leccion_base', 'anyOf', 0, 'enum');
    const leccion = bases.find((x) => /nariz/.test(x)) ?? bases[0] ?? lecciones.find((x) => /nariz/.test(x)) ?? lecciones[0];
    return { ...base, tipo: 'propuesta', mensaje: 'Te adapto esa lección para repasar antes del examen.', solicitud: { accion: 'adaptar', tema: 'Repaso de la nariz para el examen', objetivo: 'Repasar los huesos de la nariz', nivel: 1, minutos: 10, leccion_base: leccion, enfoque: 'Más preguntas y menos texto', supuestos: [], terminos: ['nasal bones'], explicita: true, suficiente: true } };
  }
  if (/\b(crea|creame|create|crear)\b/.test(texto)) {
    return { ...base, tipo: 'propuesta', mensaje: 'Te preparo una lección nueva a partir de fuentes citadas.', solicitud: { accion: 'crear', tema: 'huesos de la nariz', objetivo: 'Localizar los huesos de la nariz', nivel: 1, minutos: 12, leccion_base: null, enfoque: '', supuestos: ['Nivel inicial'], terminos: ['nasal bones', 'vomer'], explicita: true, suficiente: true } };
  }
  const ids = [...variable.matchAll(/^(E\d+) — /gm)].map((x) => x[1]);
  if (ids.length && /\b(explica\w*|que es|que forman?|para que|como funciona|explain|what is)\b/.test(texto)) {
    return { ...base, tipo: 'explicacion', mensaje: 'Según las fuentes de la biblioteca, esto es lo que dicen las citas.', evidencias: ids.slice(0, 2) };
  }
  const palabra = texto.split(' ').filter((w) => w.length > 4);
  const id = lecciones.find((x) => palabra.some((w) => x.includes(w.slice(0, 5)))) ?? lecciones[0];
  return { ...base, tipo: 'recomendacion', mensaje: 'Esta lección encaja con lo que buscas.', lecciones: id ? [{ id, motivo: 'Trata lo que pides.' }] : [] };
}

/** `usage` creíble: unos 4 bytes por token; la parte fija, escrita en la caché la primera vez y leída después. */
function uso(cuerpo, texto, enCache) {
  const fijo = Buffer.byteLength(cuerpo.system?.[0]?.text ?? '') / 4;
  const resto = (Buffer.byteLength(JSON.stringify(cuerpo)) / 4) - fijo;
  return { input_tokens: Math.ceil(resto), cache_creation_input_tokens: enCache ? 0 : Math.ceil(fijo), cache_read_input_tokens: enCache ? Math.ceil(fijo) : 0, output_tokens: Math.ceil(Buffer.byteLength(texto) / 3) };
}

/**
 * Arranca el proveedor simulado: { url, llamadas, cerrar(), retener(fn), soltar() }. `retrasoMs`: entre trozos del flujo.
 * `retener(cuerpo)`: si devuelve true, esa llamada espera a `soltar()` (para probar cortes a mitad).
 */
export function crearProveedorSimulado({ puerto = 0, retrasoMs = 40, registro = null } = {}) {
  const llamadas = [];
  const enCache = new Set();
  let retener = () => false;
  const esperando = [];
  const servidor = http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url === '/__llamadas') { res.setHeader('content-type', 'application/json'); return res.end(JSON.stringify(llamadas.map((x) => x.modo))); }
    if (req.method !== 'POST' || !req.url.startsWith('/v1/messages')) { res.statusCode = 404; return res.end(); }
    const trozos = [];
    for await (const c of req) trozos.push(c);
    let cuerpo;
    try { cuerpo = JSON.parse(Buffer.concat(trozos).toString('utf8')); } catch { res.statusCode = 400; return res.end(JSON.stringify({ type: 'error', error: { type: 'invalid_request_error', message: 'JSON' } })); }
    const props = cuerpo.output_config?.format?.schema?.properties ?? {};
    const modo = props.veredictos ? 'verificar' : esRecorrido(props) ? 'recorrido' : esSesion(props) ? 'sesion' : props.plan ? 'planificar' : props.leccion ? 'redactar' : 'orientar';
    llamadas.push({ modo, modelo: cuerpo.model, flujo: !!cuerpo.stream });
    registro?.(`[simulado] ${modo}${cuerpo.stream ? ' (flujo)' : ''}`);
    if (retener(cuerpo)) await new Promise((r) => esperando.push(r));
    if (res.destroyed) return;
    const texto = JSON.stringify(responder(cuerpo));
    const clave = `${cuerpo.model}|${(cuerpo.system?.[0]?.text ?? '').length}`;
    const u = uso(cuerpo, texto, enCache.has(clave));
    enCache.add(clave);
    const mensaje = { id: `msg_sim_${llamadas.length}`, type: 'message', role: 'assistant', model: cuerpo.model ?? MODELO, stop_sequence: null };
    if (!cuerpo.stream) {
      res.setHeader('content-type', 'application/json');
      return res.end(JSON.stringify({ ...mensaje, content: [{ type: 'text', text: texto }], stop_reason: 'end_turn', usage: u }));
    }
    res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-cache', connection: 'keep-alive' });
    const ev = (tipo, datos) => res.write(`event: ${tipo}\ndata: ${JSON.stringify({ type: tipo, ...datos })}\n\n`);
    ev('message_start', { message: { ...mensaje, content: [], stop_reason: null, usage: { ...u, output_tokens: 1 } } });
    ev('content_block_start', { index: 0, content_block: { type: 'text', text: '' } });
    const n = 6;
    const paso = Math.ceil(texto.length / n);
    for (let i = 0; i < texto.length; i += paso) {
      if (res.destroyed) return;
      ev('content_block_delta', { index: 0, delta: { type: 'text_delta', text: texto.slice(i, i + paso) } });
      await new Promise((r) => setTimeout(r, retrasoMs));
    }
    ev('content_block_stop', { index: 0 });
    ev('message_delta', { delta: { stop_reason: 'end_turn', stop_sequence: null }, usage: { output_tokens: u.output_tokens } });
    ev('message_stop', {});
    res.end();
  });
  return new Promise((resolve) => servidor.listen(puerto, '127.0.0.1', () => {
    const { port } = servidor.address();
    resolve({
      url: `http://127.0.0.1:${port}`, llamadas,
      retener: (fn) => { retener = fn; },
      soltar: () => { for (const r of esperando.splice(0)) r(); },
      cerrar: () => new Promise((r) => { servidor.closeAllConnections?.(); servidor.close(() => r()); }),
    });
  }));
}

// `node scripts/proveedor-simulado.mjs`: arranca y escucha hasta Ctrl-C.
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const opcion = (n, d) => { const i = process.argv.indexOf(n); return i > 0 ? Number(process.argv[i + 1]) : d; };
  const p = await crearProveedorSimulado({ puerto: opcion('--puerto', 5199), retrasoMs: opcion('--retraso', 120), registro: (s) => console.log(s) });
  console.log(`Proveedor simulado en ${p.url} (solo para ensayar: no es la IA de verdad). Ctrl-C para parar.`);
}
