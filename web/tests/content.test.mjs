// Pruebas del esquema de contenido (src/content/schema.js) y del módulo del brazo: `npm test`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { revisarFicha } from '../src/content/schema.js';
import { FUENTES } from '../src/content/fuentes.js';
import { MODULO_BRAZO } from '../src/content/brazo.js';
import { fichaDePieza } from '../src/content/index.js';

const base = {
  id: 'prueba', tipo: 'nervio', nombre: 'Nervio de prueba', latin: 'Nervus probationis', region: 'Brazo', lado: 'bilateral',
  modelos: ['male'], piezas: ['Test_nerve'], descripcion: 'Nervio inventado para la prueba.', funcion: 'Ninguna.',
  campos: { origen: 'Plexo.', trayecto: 'Brazo.', inerva: 'Nada.' }, relaciones: [],
  fuentes: { terminologia: [{ fuente: 'ta2', termino: '1' }], contenido: [{ fuente: 'tma_radial', apoya: ['descripcion', 'funcion', 'origen', 'trayecto', 'inerva'] }] },
  revision: { estado: 'borrador', revisor: null, fecha: null },
};
const piezas = { male: new Set(['Test_nerve_L', 'Test_nerve_R']), female: new Set() };
const revisar = (cambios, p = piezas) => revisarFicha({ ...base, ...cambios }, { fuentes: FUENTES, piezasDe: (m) => p[m], ids: new Set(['prueba']) })
  .filter((x) => x.nivel === 'error').map((x) => x.texto);

test('una ficha completa no tiene errores', () => assert.deepEqual(revisar({}), []));
test('falta un campo obligatorio', () => assert.match(revisar({ campos: { origen: 'a', trayecto: 'b' } }).join(), /obligatorio «inerva»/));
test('texto genérico', () => assert.match(revisar({ descripcion: 'Haz de fibras nerviosas que conecta el sistema nervioso central con todo.' }).join(), /genérico/));
test('afirmación sin fuente de contenido', () => {
  const r = revisar({ fuentes: { ...base.fuentes, contenido: [{ fuente: 'tma_radial', apoya: ['descripcion', 'origen'] }] } });
  assert.match(r.join(), /«trayecto» sin fuente/);
});
test('sin fuente de terminología, o con una fuente desconocida', () => {
  assert.match(revisar({ fuentes: { ...base.fuentes, terminologia: [] } }).join(), /sin fuente de terminología/);
  assert.match(revisar({ relaciones: [{ texto: 'x', fuente: 'inventada' }] }).join(), /relación sin fuente válida/);
});
test('aplicabilidad: pieza que falta en un modelo declarado', () => assert.match(revisar({ modelos: ['male', 'female'] }).join(), /no existe en el modelo female/));
test('aplicabilidad: pieza en un modelo no declarado', () => {
  const r = revisar({}, { male: piezas.male, female: new Set(['Test_nerve_L', 'Test_nerve_R']) });
  assert.match(r.join(), /existe en el modelo female, pero la ficha no lo declara/);
});
test('«revisado» exige revisor y fecha', () => assert.match(revisar({ revision: { estado: 'revisado' } }).join(), /sin revisor ni fecha/));
test('relación con una ficha inexistente', () => assert.match(revisar({ relaciones: [{ texto: 'x', con: 'nada', fuente: 'ta2' }] }).join(), /no existe: nada/));

test('módulo del brazo: núcleo y contexto tienen ficha, y ninguna figura como revisada', () => {
  const ids = new Set(MODULO_BRAZO.estructuras.map((f) => f.id));
  for (const id of [...MODULO_BRAZO.nucleo, ...MODULO_BRAZO.contexto]) assert.ok(ids.has(id), id);
  assert.ok(MODULO_BRAZO.estructuras.every((f) => f.revision.estado === 'borrador' && !f.revision.revisor));
});
test('fichaDePieza: por nombre de malla, con lado y por modelo', () => {
  assert.equal(fichaDePieza('Long_head_of_biceps_brachii_L').ficha.id, 'biceps-braquial');
  assert.equal(fichaDePieza('Radial_nerve_R', 'female').ficha.id, 'nervio-radial');
  assert.equal(fichaDePieza('Femur_L'), null);
});
