// Pruebas del paso 7 de la especificación (secciones 9 y 23): respuesta breve, preguntas corregidas o retiradas sin
// penalización, y «Reportar un problema» (validación, cola local, envío, servidor y la herramienta de revisión).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { corregirBreve, huella, instanciar, rngConSemilla } from '../src/biblioteca/evaluar.js';
import * as P from '../src/biblioteca/progreso.js';
import { calcularMapa } from '../src/biblioteca/mapa.js';
import { validarReporte, crearReporte, reportar, enviarPendientes, reportesLocales, CLAVE_REPORTES, CATEGORIAS } from '../src/biblioteca/reportes.js';
import { crearManejadorReportes } from '../server/reportes.mjs';
import { cola, leerRetiradas, escribirRetiradas } from '../scripts/reportes.mjs';
import fs from 'fs';

const memoria = (inicial = {}) => { const s = { ...inicial }; return { getItem: (k) => s[k] ?? null, setItem: (k, v) => { s[k] = String(v); }, datos: s }; };

test('respuesta breve: nombre o sinónimo, sin acentos ni artículos; lo parecido lo decide la persona; otra estructura es una confusión', () => {
  const op = { aceptadas: ['Músculo deltoides', 'Deltoides', 'Deltoid'], otras: ['Músculo supraespinoso', 'Músculo redondo mayor'] };
  for (const x of ['deltoides', 'el DELTOIDES', 'musculo deltoides', 'Deltoid', '  deltoides. ']) assert.equal(corregirBreve(x, op).resultado, 'acierto', x);
  assert.equal(corregirBreve('deltoide', op).resultado, 'cercana', 'una letra de menos: compara');
  assert.equal(corregirBreve('m. deltoides', op).resultado, 'cercana', 'con la abreviatura: compara');
  assert.deepEqual(corregirBreve('supraespinoso', op), { resultado: 'fallo', confundida: 'Músculo supraespinoso' });
  assert.equal(corregirBreve('trapecio', op).resultado, 'fallo');
  assert.equal(corregirBreve('', op).resultado, 'fallo');
  // Nombres cortos: sin tolerancia (una letra cambia la estructura).
  assert.equal(corregirBreve('ulna', { aceptadas: ['Cúbito', 'Ulna'] }).resultado, 'acierto');
  assert.equal(corregirBreve('una', { aceptadas: ['Ulna'] }).resultado, 'fallo');
  // «Nervio radial» y «arteria radial»: escribir solo «radial» no se da por bueno si hay otra estructura con ese nombre.
  const radial = corregirBreve('radial', { aceptadas: ['Nervio radial'], otras: ['Arteria radial'] });
  assert.deepEqual(radial, { resultado: 'ambigua', opciones: ['Nervio radial', 'Arteria radial'] }, 'no se corrige: se pide el nombre completo');
  assert.deepEqual(corregirBreve('arteria radial', { aceptadas: ['Nervio radial'], otras: ['Arteria radial'] }), { resultado: 'fallo', confundida: 'Arteria radial' });
  assert.equal(corregirBreve('radial', { aceptadas: ['Nervio radial'], otras: ['Nervio mediano'] }).resultado, 'cercana');
});

test('huella: cambia si cambia la pregunta (no por el orden de los distractores); anotar con otra huella empieza de cero', () => {
  const q = { id: 'q1', tipo: 'funcion', enunciado: '¿Qué hace?', correcta: 'A', distractores: ['B', 'C'], objetivo: 0 };
  assert.equal(huella(q), huella({ ...q, distractores: ['C', 'B'] }));
  assert.notEqual(huella(q), huella({ ...q, correcta: 'B', distractores: ['A', 'C'] }));
  assert.equal(instanciar({ id: 'L', estructuras: {}, objetivos: ['x'], pasos: [] }, q, rngConSemilla(1)).huella, huella(q));
  const d = P.vacio();
  P.anotar(d, 'L/q1', 'fallo', 10, { huella: 'vieja' });
  P.anotar(d, 'L/q1', 'fallo', 20, { huella: 'vieja' });
  assert.equal(d.items['L/q1'].fallos, 2);
  P.anotar(d, 'L/q1', 'acierto', 30, { huella: 'nueva' });
  assert.deepEqual([d.items['L/q1'].fallos, d.items['L/q1'].aciertos, d.items['L/q1'].qh], [0, 1, 'nueva'], 'los fallos de la pregunta anterior no cuentan');
});

test('preguntas corregidas o retiradas: al cargar la lección dejan de contar; si vuelven, se recuperan', () => {
  const L = { id: 'L', preguntas: [{ id: 'a', tipo: 'funcion', enunciado: 'A', correcta: 'x', distractores: ['y'] }, { id: 'b', tipo: 'funcion', enunciado: 'B', correcta: 'x', distractores: ['y'] }] };
  const d = P.vacio();
  P.anotar(d, 'L/a', 'fallo', 0, { huella: huella(L.preguntas[0]) });
  P.anotar(d, 'L/b', 'fallo', 0, { huella: 'otra-version' });
  P.anotar(d, 'L/c', 'fallo', 0, { huella: 'x' });
  P.registrarIntento(d, { leccion: 'L', pregunta: 'b', tipo: 'funcion', resultado: 'fallo', modo: 'repaso', huella: 'otra-version' }, 0);
  assert.equal(P.depurar(d, L, huella), 2);
  assert.equal(d.items['L/a'].fallos, 1, 'sin cambios: se queda');
  assert.equal(d.items['L/b'].fallos, 0, 'corregida: empieza de nuevo');
  assert.equal(d.items['L/c'].huerfana, true, 'ya no existe: no se repasa');
  assert.deepEqual(P.vencidas(d, { ahora: 1 }), ['L/a']);
  // Retirada mientras se revisa: tampoco cuenta; repuesta, vuelve.
  assert.equal(P.depurar(d, L, huella, (id) => id === 'a'), 1);
  assert.deepEqual(P.vencidas(d, { ahora: 1 }), []);
  P.depurar(d, L, huella, () => false);
  assert.deepEqual(P.vencidas(d, { ahora: 1 }), ['L/a']);
  // En el mapa, los intentos de una pregunta corregida no cuentan.
  const m = calcularMapa(d, { catalogo: [{ id: 'L', pasos: 1, preguntas: 2, version: 1 }], ahora: 1, invalida: (i) => i.qh && i.qh !== huella(L.preguntas.find((q) => q.id === i.q) ?? {}) });
  assert.equal(m.intentos, 0);
});

test('reportes: categoría y vista válidas, identificadores limpios, comentario recortado; «otro» necesita comentario', () => {
  const base = { v: 1, id: 'abcdef0123456789abcd', categoria: 'anatomia', vista: 'leccion', leccion: 'cab-craneo', version: '2026-11-09', paso: 'p3', idioma: 'es', modelo: 'female' };
  const ok = validarReporte({ ...base, comentario: `  El   foramen ${'x'.repeat(2000)}`, extra: 'no entra', fecha: '2026-11-09T10:00:00Z' });
  assert.equal(ok.ok, true);
  assert.equal(ok.reporte.comentario.length, 1000);
  assert.ok(ok.reporte.comentario.startsWith('El foramen'));
  assert.ok(!('extra' in ok.reporte));
  assert.equal(ok.reporte.pregunta, null);
  assert.equal(validarReporte({ ...base, categoria: 'spam' }).error, 'categoria');
  assert.equal(validarReporte({ ...base, vista: 'x' }).error, 'vista');
  assert.equal(validarReporte({ ...base, id: 'corto' }).error, 'id');
  assert.equal(validarReporte({ ...base, leccion: '<script>' }).error, 'leccion');
  assert.equal(validarReporte({ ...base, categoria: 'otro', comentario: '   ' }).error, 'comentario');
  assert.equal(validarReporte({ ...base, idioma: 'xx', modelo: 'x' }).reporte.idioma, null);
  assert.deepEqual(CATEGORIAS, ['anatomia', 'referencia', 'pregunta', 'modelo', 'traduccion', 'tecnico', 'otro']);
  const c = crearReporte({ categoria: 'pregunta', contexto: { vista: 'pregunta', leccion: 'brazo', pregunta: 'q1' }, ahora: () => Date.UTC(2026, 10, 9) });
  assert.equal(c.ok, true);
  assert.equal(c.reporte.fecha, '2026-11-09T00:00:00.000Z');
});

test('reportes en la app: se guardan aquí y se envían; sin conexión quedan pendientes y se reenvían sin duplicar', async () => {
  const { reporte } = crearReporte({ categoria: 'modelo', contexto: { vista: 'leccion', leccion: 'brazo', paso: 'p1' } });
  const almacen = memoria();
  let llega = false;
  const recibidos = [];
  const fetch = async (url, init) => { if (!llega) throw new TypeError('sin red'); recibidos.push(JSON.parse(init.body)); return new Response('{}', { status: 201 }); };
  assert.equal(await reportar(reporte, { almacen, fetch }), 'pendiente');
  assert.deepEqual(reportesLocales(almacen).map((x) => x.estado), ['pendiente']);
  llega = true;
  assert.equal(await enviarPendientes({ almacen, fetch }), 1);
  assert.equal(await enviarPendientes({ almacen, fetch }), 0, 'lo enviado no se vuelve a enviar');
  assert.deepEqual(recibidos.map((r) => r.id), [reporte.id]);
  assert.equal(await reportar(reporte, { almacen, fetch: async () => new Response('{}', { status: 409 }) }), 'enviado', 'si ya lo tenía, vale');
  assert.equal(reportesLocales(almacen).length, 1);
  const roto = memoria({ [CLAVE_REPORTES]: '{x' });
  assert.deepEqual(reportesLocales(roto), []);
  assert.equal(await reportar(reporte, { almacen: { getItem: () => null, setItem() { throw new Error('lleno'); } }, fetch: async () => { throw new Error('x'); } }), 'error');
});

test('servidor de reportes: mismo origen, tamaño, forma; añade una línea sin la IP; repetido 409; límite por dirección', async () => {
  const lineas = [];
  const manejar = crearManejadorReportes({ archivo: 'x.jsonl', escribir: (f, l) => lineas.push(l), ahora: () => Date.UTC(2026, 10, 9, 12) });
  const pedir = (cuerpo, { origen = 'http://localhost:5180', metodo = 'POST', crudo = null } = {}) => manejar(new Request('http://localhost:5180/api/reportes', {
    method: metodo, headers: { 'content-type': 'application/json', ...(origen ? { origin: origen } : {}) }, body: metodo === 'POST' ? crudo ?? JSON.stringify(cuerpo) : undefined,
  }), { ip: '10.0.0.7' });
  const { reporte } = crearReporte({ categoria: 'traduccion', comentario: 'El nombre en italiano no es ese', contexto: { vista: 'ficha', leccion: 'brazo', idioma: 'it' } });
  assert.equal((await pedir(reporte)).status, 201);
  assert.equal(lineas.length, 1);
  const guardado = JSON.parse(lineas[0]);
  assert.equal(guardado.recibido, '2026-11-09T12:00:00.000Z');
  assert.ok(!JSON.stringify(guardado).includes('10.0.0.7'), 'la IP no se guarda');
  assert.equal((await pedir(reporte)).status, 409);
  assert.equal(lineas.length, 1);
  assert.equal((await pedir(reporte, { metodo: 'GET' })).status, 405, 'no hay forma de leer la cola desde la web');
  assert.equal((await pedir(reporte, { origen: 'https://otra.web' })).status, 403);
  assert.equal((await pedir(null, { crudo: 'x'.repeat(9000) })).status, 413);
  assert.equal((await pedir(null, { crudo: '{roto' })).status, 400);
  assert.equal((await pedir({ ...reporte, categoria: 'nada' })).status, 400);
  const limitado = crearManejadorReportes({ archivo: 'x', escribir: () => {}, limitar: () => 'limite' });
  const r = await limitado(new Request('http://localhost:5180/api/reportes', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(crearReporte({ categoria: 'tecnico', contexto: { vista: 'ficha', leccion: 'brazo' } }).reporte) }));
  assert.equal(r.status, 429);
});

test('revisión de reportes: la cola sin repetidos con sus decisiones; retirar y reponer escribe la lista de la app', () => {
  const reportes = [{ id: 'a1', recibido: '2' }, { id: 'b2', recibido: '1' }, { id: 'a1', recibido: '3' }];
  const decisiones = [{ reporte: 'a1', resultado: 'corregido', revisor: 'Ana' }];
  const c = cola({ reportes, decisiones });
  assert.deepEqual(c.map((r) => [r.id, r.decisiones.length]), [['b2', 0], ['a1', 1]]);
  const texto = fs.readFileSync(new URL('../src/biblioteca/retiradas.js', import.meta.url), 'utf8');
  const r = leerRetiradas(texto);
  r.lecciones.push('cab-craneo');
  r.preguntas.push('brazo/q2');
  const nuevo = escribirRetiradas(r, texto);
  assert.deepEqual(leerRetiradas(nuevo), { lecciones: ['cab-craneo'], preguntas: ['brazo/q2'] });
  assert.ok(nuevo.includes('// Contenido retirado temporalmente'), 'el comentario del archivo se conserva');
});

// Revisión adversarial del 12 nov 2026: lo acertado tras la pista o en el segundo intento de una sesión con Neuri
// (preguntas.js: ayuda 'pista' / 'segundo-intento') es práctica, no evidencia: no demuestra la habilidad ni va así a Neuri.
test('mapa: lo acertado con pista o en el segundo intento no demuestra la habilidad (ni en el perfil de Neuri); a la primera, sí', async () => {
  const { construirPerfil } = await import('../src/pet/perfil.js');
  const cat = [{ id: 'lec-x', pasos: 3, preguntas: 6, minutos: 5, modelos: ['male', 'female'], lugares: [], sistemas: [] }];
  const conAyuda = P.vacio();
  ['q1', 'q2', 'q3'].forEach((q, k) => {
    P.anotar(conAyuda, `lec-x/${q}`, 'duda');
    P.registrarIntento(conAyuda, { leccion: 'lec-x', pregunta: q, tipo: 'identificar', resultado: 'duda', modo: 'practica', ayuda: [k === 2 ? 'segundo-intento' : 'pista'] });
  });
  const h = calcularMapa(conAyuda, { catalogo: cat }).habilidades.find((x) => x.id === 'reconocer');
  assert.deepEqual([h.estado, h.intentos, h.aciertos, h.conAyuda, h.recientes.aciertos], ['practicando', 3, 0, 3, 0]);
  assert.equal(construirPerfil({ data: conAyuda, catalogo: cat }).habilidades.reconocer, 'practicando');
  // Las mismas tres, bien a la primera (también «dudo» sin ayuda, o tras escribir): demostrada.
  const primera = P.vacio();
  ['q1', 'q2', 'q3'].forEach((q, k) => {
    P.anotar(primera, `lec-x/${q}`, k ? 'acierto' : 'duda');
    P.registrarIntento(primera, { leccion: 'lec-x', pregunta: q, tipo: 'identificar', resultado: k ? 'acierto' : 'duda', dudo: !k, modo: 'practica', ayuda: k === 2 ? ['escrita'] : null });
  });
  assert.equal(calcularMapa(primera, { catalogo: cat }).habilidades.find((x) => x.id === 'reconocer').estado, 'demostrada');
  assert.equal(construirPerfil({ data: primera, catalogo: cat }).habilidades.reconocer, 'demostrada');
});
