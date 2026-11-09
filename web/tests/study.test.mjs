// Pruebas del progreso (src/study/progress.js) y de las preguntas (src/study/quiz.js): `npm test`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as P from '../src/study/progress.js';
import { evaluacion, repaso, preguntaIdentificar, corregir, rngConSemilla, NO_LO_SE } from '../src/study/quiz.js';
import { MODULO_BRAZO as M } from '../src/content/brazo.js';
import { MODULO_ANTEBRAZO } from '../src/content/antebrazo.js';
import { MODULOS } from '../src/content/index.js';

const DIA = 24 * 3600 * 1000;
const memoria = (inicial = {}) => {
  const s = { ...inicial };
  return { getItem: (k) => s[k] ?? null, setItem: (k, v) => { s[k] = String(v); }, datos: s };
};

test('guardar y cargar (versión 1); sin datos, dañados u otra versión: vacío sin tocar lo guardado', () => {
  const st = memoria();
  const d = P.cargar(st);
  P.anotar(P.modulo(d, M), 'humero', 'acierto', 0);
  assert.equal(P.guardar(st, d), true);
  assert.equal(P.cargar(st).modulos.brazo.estructuras.humero.aciertos, 1);
  assert.deepEqual(P.cargar(memoria({ [P.STORAGE_KEY]: '{roto' })), P.vacio());
  const otra = memoria({ [P.STORAGE_KEY]: JSON.stringify({ version: 99, modulos: { brazo: {} } }) });
  assert.deepEqual(P.cargar(otra), P.vacio());
  assert.match(otra.datos[P.STORAGE_KEY], /"version":99/);         // no se sobrescribe al leer
});

test('almacenamiento bloqueado: guardar devuelve false y la app sigue', () => {
  const bloqueado = { getItem: () => { throw new Error('bloqueado'); }, setItem: () => { throw new Error('lleno'); } };
  assert.deepEqual(P.cargar(bloqueado), P.vacio());
  assert.equal(P.guardar(bloqueado, P.vacio()), false);
});

test('cajas: acierto sube, duda se queda, fallo vuelve a 0; el próximo repaso según la caja', () => {
  const m = P.modulo(P.vacio(), M);
  P.anotar(m, 'humero', 'acierto', 0);
  P.anotar(m, 'humero', 'acierto', 0);
  assert.equal(m.estructuras.humero.caja, 2);
  assert.equal(m.estructuras.humero.proximo, P.INTERVALOS_DIAS[2] * DIA);
  P.anotar(m, 'humero', 'duda', 0);
  assert.equal(m.estructuras.humero.caja, 2);
  assert.equal(m.estructuras.humero.dudas, 1);
  P.anotar(m, 'humero', 'fallo', 5);
  assert.equal(m.estructuras.humero.caja, 0);
  assert.equal(m.estructuras.humero.proximo, 5);
});

test('cola de repaso: solo lo vencido, primero lo fallado, e ignora fichas que ya no existen', () => {
  const m = P.modulo(P.vacio(), M);
  P.anotar(m, 'humero', 'acierto', 0);                 // caja 1: vence en 1 día
  P.anotar(m, 'nervio-radial', 'fallo', 0);            // caja 0: vence ya
  P.anotar(m, 'braquial', 'fallo', 0); P.anotar(m, 'braquial', 'fallo', 0);
  m.estructuras['ficha-retirada'] = { caja: 0, aciertos: 0, fallos: 3, dudas: 0, ultimo: 0, proximo: 0 };
  assert.deepEqual(P.colaRepaso(m, M.nucleo, 1), ['braquial', 'nervio-radial']);
  assert.deepEqual(P.colaRepaso(m, M.nucleo, 2 * DIA), ['braquial', 'nervio-radial', 'humero']);
});

test('resumen: rendimiento reciente y dominio a largo plazo, por separado', () => {
  const m = P.modulo(P.vacio(), M);
  for (let i = 0; i < 3; i++) P.anotar(m, 'humero', 'acierto', i * 30 * DIA);
  P.registrarIntento(m, { fecha: 1, tipo: 'evaluacion', aciertos: 9, total: 14, fallos: [] });
  P.registrarIntento(m, { fecha: 2, tipo: 'repaso', aciertos: 2, total: 2, fallos: [] });
  const r = P.resumen(m, M, 0);
  assert.equal(r.ultimo.aciertos, 9);                  // el último intento de evaluación, no el repaso
  assert.equal(r.dominadas, 1);
  assert.equal(r.total, M.nucleo.length);
});

test('repaso pendiente: cuenta también la estructura de contexto fallada (si no, el botón quedaría desactivado)', () => {
  const m = P.modulo(P.vacio(), M);
  P.anotar(m, 'arteria-braquial-profunda', 'fallo', 0);    // contexto: entra al fallar una pregunta de texto sobre ella
  const r = P.resumen(m, M, 0);
  assert.equal(r.pendientes, 1);
  assert.equal(r.vistas, 0);                                 // lo visto y el dominio siguen contando solo lo evaluable
  assert.deepEqual(P.colaRepaso(m, P.repasables(M), 0), ['arteria-braquial-profunda']);
});

test('reiniciar la lección no borra evaluaciones; borrar el módulo no toca otros módulos', () => {
  const d = P.vacio();
  const m = P.modulo(d, M);
  m.leccion = { paso: 3, completada: true, fecha: 1 };
  P.anotar(m, 'humero', 'acierto', 0);
  P.reiniciarLeccion(m);
  assert.equal(m.leccion.paso, 0);
  assert.equal(m.estructuras.humero.aciertos, 1);
  d.modulos.otro = { contenido: 'x' };
  P.borrarModulo(d, 'brazo');
  assert.deepEqual(Object.keys(d.modulos), ['otro']);
});

test('contenido cambiado: se detecta por la versión del módulo', () => {
  const d = P.vacio();
  P.modulo(d, M);
  assert.equal(P.contenidoCambiado(d, M), false);
  d.modulos.brazo.contenido = 'antigua';
  assert.equal(P.contenidoCambiado(d, M), true);
});

test('identificar: cuatro opciones distintas, una correcta, del mismo grupo (o huesos para el húmero)', () => {
  const rng = rngConSemilla(7);
  for (const id of M.nucleo) {
    const q = preguntaIdentificar(M, id, rng);
    assert.equal(q.opciones.length, 4, id);
    assert.equal(new Set(q.opciones.map((o) => o.texto)).size, 4, id);
    assert.equal(q.opciones.filter((o) => o.correcta).length, 1, id);
  }
  const nervio = preguntaIdentificar(M, 'nervio-radial', rng);
  assert.ok(nervio.opciones.every((o) => o.texto.startsWith('Nervio')));
  const hueso = preguntaIdentificar(M, 'humero', rng);
  assert.ok(hueso.opciones.every((o) => ['Húmero', 'Radio', 'Ulna', 'Escápula', 'Clavícula'].includes(o.texto)));
});

test('identificar en todos los módulos: cuatro opciones distintas para cada estructura que puede salir (núcleo y contexto)', () => {
  const rng = rngConSemilla(11);
  for (const mod of MODULOS) {
    for (const id of [...mod.nucleo, ...mod.contexto]) {
      for (let vez = 0; vez < 5; vez++) {
        const q = preguntaIdentificar(mod, id, rng);
        assert.equal(new Set(q.opciones.map((o) => o.texto)).size, 4, `${mod.id}: ${id}`);
        assert.equal(q.opciones.filter((o) => o.correcta).length, 1, `${mod.id}: ${id}`);
      }
    }
  }
  // La arteria radial entra al repaso si se falla la pregunta del pulso radial: su identificación también tiene 4.
  const rp = repaso(MODULO_ANTEBRAZO, ['arteria-radial'], { rng: rngConSemilla(5) });
  assert.equal(rp[0].tipo, 'identificar');
  assert.equal(rp[0].opciones.length, 4);
});

test('evaluación: una identificación por estructura evaluable y 4 de texto; repaso solo de la cola', () => {
  const ev = evaluacion(M, { rng: rngConSemilla(3) });
  assert.equal(ev.filter((q) => q.tipo === 'identificar').length, M.nucleo.length);
  assert.equal(ev.filter((q) => q.tipo === 'texto').length, 4);
  const rp = repaso(M, ['nervio-ulnar'], { rng: rngConSemilla(3) });
  assert.ok(rp.length >= 1 && rp.every((q) => q.fichas.includes('nervio-ulnar')));
});

test('corregir: acierto, duda, fallo y «No lo sé»', () => {
  const q = preguntaIdentificar(M, 'braquial', rngConSemilla(1));
  const buena = q.opciones.findIndex((o) => o.correcta);
  const mala = q.opciones.findIndex((o) => !o.correcta);
  assert.equal(corregir(q, buena), 'acierto');
  assert.equal(corregir(q, buena, { dude: true }), 'duda');
  assert.equal(corregir(q, mala), 'fallo');
  assert.equal(corregir(q, NO_LO_SE), 'fallo');
});
