// Pruebas del paso 8 de la especificación (secciones 18 a 22): plan de examen, eventos con consentimiento, tiempo
// activo, y exportar, importar (combinando) y borrar los datos de estudio.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import { temasDe, interpretar, planificar, ordenarPorRequisitos, fechaValida, sumarDias, diasEntre, isoDe } from '../src/biblioteca/examen.js';
import { crearBuscador } from '../src/biblioteca/buscar.js';
import { RECORRIDOS } from '../src/biblioteca/recorridos.js';
import { crearRegistroEventos, crearCronometro, limpiarProps, CLAVE_EVENTOS, CLAVE_INVITADO, MAX_EVENTOS } from '../src/biblioteca/eventos.js';
import { fusionarProgreso, exportarDatos, importarDatos, borrarDatos, inventarioDatos, CLAVES_ESTUDIO } from '../src/biblioteca/datos.js';
import * as P from '../src/biblioteca/progreso.js';
import { guardarPropia, cargarPropias } from '../src/biblioteca/propias.js';
import { fechaDia } from '../src/ui/biblioteca/comun.js';

const CATALOGO = JSON.parse(fs.readFileSync(new URL('../src/biblioteca/generado/catalogo.json', import.meta.url), 'utf8'));
const POR_ID = new Map(CATALOGO.lecciones.map((L) => [L.id, L]));
const memoria = (inicial = {}) => { const s = { ...inicial }; return { getItem: (k) => s[k] ?? null, setItem: (k, v) => { s[k] = String(v); }, removeItem: (k) => { delete s[k]; }, datos: s }; };
const sinEmpezar = () => ({ estado: 'sin-empezar', vistos: 0, total: 1 });

test('temario: líneas, «;» y viñetas, sin numeración ni repetidos; cada tema con sus lecciones o como laguna', () => {
  assert.deepEqual(temasDe('1. Huesos del cráneo\n2) Músculos de la masticación; • Nervios craneales\n- huesos del cráneo\n\n a) Órbita'), ['Huesos del cráneo', 'Músculos de la masticación', 'Nervios craneales', 'Órbita']);
  assert.equal(temasDe('x\n'.repeat(5) + Array.from({ length: 60 }, (_, i) => `tema ${i}`).join('\n')).length, 40);
  const buscador = crearBuscador({ lecciones: CATALOGO.lecciones, recorridos: RECORRIDOS, estructuras: [] });
  const r = interpretar('Huesos del cráneo\nCorazón\nZzzqx nada', { buscador });
  assert.ok(r[0].lecciones.includes('cab-craneo'));
  assert.ok(r[1].lecciones.includes('tor-corazon'));
  assert.deepEqual([r[2].laguna, r[2].lecciones], [true, []], 'lo que no tiene lección queda como laguna, sin inventar');
  assert.ok(r.every((x) => x.lecciones.length <= 3));
});

test('plan de examen: días de estudio hasta la víspera, requisitos primero, repasos espaciados y repaso final', () => {
  const p = planificar({ temas: [{ texto: 'x', lecciones: ['cab-craneo', 'cab-masticacion', 'cab-nervios-craneales'] }], fecha: '2026-11-20', minutosDia: 30, dias: [1, 2, 3, 4, 5], hoy: '2026-11-10', catalogo: POR_ID, estado: sinEmpezar });
  assert.deepEqual(p.avisos, []);
  assert.ok(p.dias.every((d) => d.fecha >= '2026-11-10' && d.fecha < '2026-11-20'), 'el día del examen no se estudia');
  assert.ok(p.dias.every((d) => ![0, 6].includes(new Date(`${d.fecha}T12:00`).getDay())), 'solo los días elegidos');
  const lecciones = p.dias.flatMap((d) => d.bloques.filter((b) => b.tipo === 'leccion').map((b) => b.id));
  assert.deepEqual([...new Set(lecciones)], ['cab-craneo', 'cab-masticacion', 'cab-nervios-craneales']);
  assert.ok(p.dias.some((d) => d.bloques.some((b) => b.tipo === 'repaso')), 'hay repasos espaciados');
  assert.equal(p.dias.at(-1).bloques[0].tipo, 'final');
  assert.ok(p.dias.every((d) => d.bloques.filter((b) => b.tipo === 'leccion').every((b) => b.minutos >= 5)), 'sin trozos sueltos');
  // Requisitos: una lección va después de sus requisitos aunque el temario los ponga al revés.
  const conReq = CATALOGO.lecciones.find((L) => L.requisitos?.length && POR_ID.has(L.requisitos[0]));
  assert.deepEqual(ordenarPorRequisitos([conReq.id, conReq.requisitos[0]], POR_ID), [conReq.requisitos[0], conReq.id]);
  // Lo ya terminado no se vuelve a planificar (va a los repasos).
  const hecha = planificar({ temas: [{ texto: 'x', lecciones: ['cab-craneo', 'cab-ojo'] }], fecha: '2026-11-20', minutosDia: 30, dias: [1, 2, 3, 4, 5], hoy: '2026-11-10', catalogo: POR_ID, estado: (L) => (L.id === 'cab-craneo' ? { estado: 'completada', vistos: 5, total: 5 } : sinEmpezar()) });
  assert.deepEqual(hecha.hechas, ['cab-craneo']);
  assert.ok(!hecha.dias.some((d) => d.bloques.some((b) => b.tipo === 'leccion' && b.id === 'cab-craneo')));
  assert.ok(hecha.dias.at(-1).bloques[0].de.includes('cab-craneo'), 'pero sí en el repaso final');
});

test('requisitos circulares: el orden termina, incluye todas y no repite ninguna', () => {
  const cat = new Map([['a', { requisitos: ['b'] }], ['b', { requisitos: ['c'] }], ['c', { requisitos: ['a'] }], ['d', { requisitos: ['a'] }]]);
  const r = ordenarPorRequisitos(['d', 'a', 'b', 'c'], cat);
  assert.deepEqual([...r].sort(), ['a', 'b', 'c', 'd']);
  assert.equal(new Set(r).size, 4);
  assert.ok(r.indexOf('a') < r.indexOf('d'), 'lo que no está en el ciclo respeta su requisito');
});

test('plan de examen: si no da el tiempo, lo dice con las cifras y lo que no cabe; sin fecha no se inventa una', () => {
  const ids = ['cab-craneo', 'cab-masticacion', 'cab-nervios-craneales', 'cab-ojo', 'tor-corazon', 'tor-pulmones'];
  const corto = planificar({ temas: [{ texto: 'x', lecciones: ids }], fecha: '2026-11-12', minutosDia: 20, dias: [0, 1, 2, 3, 4, 5, 6], hoy: '2026-11-10', catalogo: POR_ID, estado: sinEmpezar });
  assert.ok(corto.avisos.includes('no-cabe'));
  assert.ok(corto.noCaben.length > 0 && corto.necesarios > corto.disponibles);
  assert.equal(corto.disponibles, 40);
  const sinFecha = planificar({ temas: [{ texto: 'x', lecciones: ['cab-craneo'] }], fecha: null, minutosDia: 30, dias: [1, 2, 3, 4, 5], hoy: '2026-11-10', catalogo: POR_ID, estado: sinEmpezar });
  assert.deepEqual([sinFecha.sinFecha, sinFecha.fin], [true, '2026-11-24']);
  assert.ok(planificar({ temas: [], fecha: '2026-11-01', minutosDia: 30, dias: [1], hoy: '2026-11-10', catalogo: POR_ID, estado: sinEmpezar }).avisos.includes('fecha-invalida'));
  assert.ok(planificar({ temas: [{ texto: 'x', lecciones: ['cab-craneo'] }], fecha: '2026-11-20', minutosDia: 30, dias: [], hoy: '2026-11-10', catalogo: POR_ID, estado: sinEmpezar }).avisos.includes('sin-dias'));
  assert.equal(fechaValida('2026-02-30x', '2026-01-01'), false);
  // Fechas del calendario local, también al cambiar la hora (finales de octubre en Europa).
  assert.equal(sumarDias('2026-10-24', 2), '2026-10-26');
  assert.equal(diasEntre('2026-10-24', '2026-10-26'), 2);
  assert.match(isoDe(Date.now()), /^\d{4}-\d{2}-\d{2}$/);
});

test('fecha del examen: un día «2026-11-21» se muestra como el 21 también al oeste de UTC (la entrada decía «20 nov»)', () => {
  const antes = process.env.TZ;
  try {
    process.env.TZ = 'America/Tijuana';
    assert.match(fechaDia('2026-11-21'), /21/);
    // `fecha()` es para instantes (milisegundos): con un día sin hora lo lee como medianoche UTC, el día anterior aquí.
    const portada = fs.readFileSync(new URL('../src/ui/biblioteca/portada.js', import.meta.url), 'utf8');
    assert.doesNotMatch(portada, /\bfecha\(data\.examen\.fecha\)/);
  } finally {
    if (antes === undefined) delete process.env.TZ; else process.env.TZ = antes;
  }
});

test('eventos: solo con consentimiento; tipos y propiedades de una lista cerrada (sin texto libre); seudónimo; sin duplicados', () => {
  const almacen = memoria();
  let t = Date.UTC(2026, 10, 9, 10);
  let n = 0;
  const ev = crearRegistroEventos({ almacen, ahora: () => t, sesion: 'sesion-de-prueba-0001', id: () => `00000000-0000-4000-a000-${String(++n).padStart(12, '0')}` });
  assert.equal(ev.registrar('leccion_iniciada', { leccion: 'cab-craneo', version: 1 }), null, 'sin consentimiento, nada');
  assert.equal(almacen.datos[CLAVE_INVITADO], undefined, 'ni siquiera el seudónimo');
  assert.equal(ev.decidido(), false);
  ev.fijar(true);
  assert.ok(/^[a-z0-9-]{16,64}$/.test(almacen.datos[CLAVE_INVITADO]));
  const e = ev.registrar('busqueda_sin_resultados', { filtros: ['region'], conTexto: true, texto: 'mi examen de mañana', nombre: 'Ana' });
  assert.deepEqual(e.props, { filtros: ['region'], conTexto: true }, 'lo que no está permitido se descarta');
  assert.equal(e.actor, almacen.datos[CLAVE_INVITADO]);
  assert.equal(e.sesion, 'sesion-de-prueba-0001');
  assert.deepEqual(limpiarProps('leccion_completada', { leccion: '<b>x</b>', version: 2, segundosActivos: -5 }), { version: 2 });
  assert.equal(ev.registrar('tipo_inventado', {}), null);
  assert.ok(ev.registrar('leccion_completada', { leccion: 'cab-craneo', version: 1, segundosActivos: 300 }, { clave: 'cab-craneo:1' }));
  assert.equal(ev.registrar('leccion_completada', { leccion: 'cab-craneo', version: 1, segundosActivos: 301 }, { clave: 'cab-craneo:1' }), null, 'un reintento no duplica');
  t += 11 * 60 * 1000;
  assert.ok(ev.registrar('leccion_completada', { leccion: 'cab-craneo', version: 1, segundosActivos: 20 }, { clave: 'cab-craneo:1' }), 'otra vez, más tarde, sí');
  assert.ok(ev.lote().every((x) => !('clave' in x)));
  for (let i = 0; i < MAX_EVENTOS + 10; i++) ev.registrar('repaso_realizado', { modo: 'repaso', aciertos: 1, total: 2 });
  assert.equal(ev.eventos().length, MAX_EVENTOS);
  const seudonimo = almacen.datos[CLAVE_INVITADO];
  ev.fijar(false);
  assert.equal(almacen.datos[CLAVE_EVENTOS], undefined, 'al desactivar, se borran');
  assert.equal(almacen.datos[CLAVE_INVITADO], undefined, 'y también el seudónimo');
  ev.fijar(true);
  assert.notEqual(almacen.datos[CLAVE_INVITADO], seudonimo, 'al reactivarlas, otro seudónimo: no se enlaza con lo anterior');
  ev.fijar(false);
  assert.equal(ev.registrar('repaso_realizado', { modo: 'repaso', aciertos: 1, total: 1 }), null);
  // Un almacenamiento roto nunca rompe nada.
  const roto = crearRegistroEventos({ almacen: { getItem() { throw new Error('x'); }, setItem() { throw new Error('x'); } } });
  assert.equal(roto.registrar('repaso_realizado', {}), null);
});

test('tiempo activo: solo con la página a la vista y con actividad en el último minuto', () => {
  let t = 0;
  const c = crearCronometro({ ahora: () => t, inactividadMs: 60_000 });
  t = 30_000; c.actividad();
  t = 50_000; c.actividad();
  assert.equal(c.segundos(), 50);
  t = 10 * 60_000;                       // diez minutos sin tocar nada: cuenta solo hasta un minuto después
  assert.equal(c.segundos(), 110);
  c.actividad();
  t += 20_000; c.visible(false);         // oculta: no cuenta
  t += 5 * 60_000; c.visible(true);
  t += 10_000;
  assert.equal(c.segundos(), 140);
});

test('mis datos: exportar, importar combinando sin duplicar (la respuesta más reciente manda) y borrar todo lo de estudio', () => {
  const aqui = P.vacio();
  aqui.lecciones.a = { version: 1, paso: 2, vistos: ['p1', 'p2'], completada: null, actividad: 100, evaluaciones: [{ fecha: 50, aciertos: 3, total: 5 }] };
  aqui.items['a/q1'] = { caja: 3, aciertos: 3, fallos: 0, ultimo: 100, proximo: 900 };
  aqui.items['a/q2'] = { caja: 0, aciertos: 0, fallos: 1, ultimo: 300, proximo: 300 };
  aqui.intentos = [{ f: 100, l: 'a', q: 'q1', r: 'acierto' }];
  aqui.favoritos = ['a'];
  const otro = P.vacio();
  otro.lecciones.a = { version: 1, paso: 4, vistos: ['p3', 'p4'], completada: 80, actividad: 200, evaluaciones: [{ fecha: 50, aciertos: 3, total: 5 }, { fecha: 150, aciertos: 5, total: 5 }] };
  otro.lecciones.b = { version: 1, paso: 0, vistos: ['x'], completada: null, actividad: 10, evaluaciones: [] };
  otro.items['a/q1'] = { caja: 0, aciertos: 3, fallos: 1, ultimo: 200, proximo: 200 };
  otro.items['a/q2'] = { caja: 4, aciertos: 9, fallos: 0, ultimo: 250, proximo: 9e9 };
  otro.intentos = [{ f: 100, l: 'a', q: 'q1', r: 'acierto' }, { f: 200, l: 'a', q: 'q1', r: 'fallo' }];
  otro.favoritos = ['b', 'a'];
  const { data, cambios } = fusionarProgreso(aqui, otro);
  assert.deepEqual(data.lecciones.a.vistos.sort(), ['p1', 'p2', 'p3', 'p4']);
  assert.deepEqual([data.lecciones.a.completada, data.lecciones.a.paso, data.lecciones.a.evaluaciones.length], [80, 4, 2]);
  assert.equal(data.items['a/q1'].caja, 0, 'la respuesta más reciente (un fallo) manda, no la caja más alta');
  assert.equal(data.items['a/q2'].caja, 0, 'aquí era más reciente');
  assert.deepEqual(data.intentos.map((i) => i.f), [100, 200], 'sin repetir');
  assert.deepEqual(data.favoritos, ['a', 'b']);
  assert.deepEqual(cambios, { lecciones: 2, items: 1, intentos: 1 });
  assert.deepEqual(aqui.lecciones.a.vistos, ['p1', 'p2'], 'el original no se toca');
  // Exportar e importar el archivo completo, con las lecciones propias.
  const origen = memoria();
  const destino = memoria();
  const archivo = exportarDatos({ almacen: origen, data: otro, ahora: () => 0 });
  const r = importarDatos(archivo, { almacen: destino, data: aqui });
  assert.equal(r.ok, true);
  assert.deepEqual(r.cambios, cambios);
  assert.equal(importarDatos('{"formato":"otro"}', { almacen: destino, data: aqui }).error, 'formato');
  assert.equal(importarDatos('no', { almacen: destino, data: aqui }).error, 'formato');
  // Borrar: todo lo de estudio, sin tocar los ajustes de la app.
  const todo = memoria(Object.fromEntries([...CLAVES_ESTUDIO.map((k) => [k, '[]']), ['anato3d.idioma', 'es'], ['anato3d.calidad', 'alta']]));
  const sesion = memoria({ 'anato3d.neuri': '{}' });
  assert.equal(borrarDatos({ almacen: todo, sesion }), true);
  assert.deepEqual(Object.keys(todo.datos).sort(), ['anato3d.calidad', 'anato3d.idioma']);
  assert.deepEqual(sesion.datos, {});
  const inv = inventarioDatos({ almacen: memoria(), data: P.vacio() });
  assert.deepEqual([inv.lecciones, inv.propias, inv.examen], [0, 0, false]);
});
