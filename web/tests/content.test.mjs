// Pruebas del esquema de contenido (src/content/schema.js) y del módulo del brazo: `npm test`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { revisarFicha, revisarModulo } from '../src/content/schema.js';
import { FUENTES } from '../src/content/fuentes.js';
import { MODULO_BRAZO } from '../src/content/brazo.js';
import { MODULO_ANTEBRAZO } from '../src/content/antebrazo.js';
import { fichaDePieza, MODULOS } from '../src/content/index.js';

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

test('módulos: núcleo y contexto tienen ficha, y ninguna figura como revisada', () => {
  assert.ok(MODULOS.includes(MODULO_BRAZO));
  for (const mod of MODULOS) {
    const ids = new Set(mod.estructuras.map((f) => f.id));
    for (const id of [...mod.nucleo, ...mod.contexto]) assert.ok(ids.has(id), `${mod.id}: ${id}`);
    assert.ok(mod.estructuras.every((f) => f.revision.estado === 'borrador' && !f.revision.revisor), mod.id);
  }
});
test('módulos: cada id de ficha y cada pieza pertenecen a un solo módulo', () => {
  const ids = new Map(), piezas = new Map();
  for (const mod of MODULOS) {
    for (const f of mod.estructuras) {
      assert.ok(!ids.has(f.id), `ficha ${f.id} en ${ids.get(f.id)} y en ${mod.id}`);
      ids.set(f.id, mod.id);
      for (const p of f.piezas) {
        assert.ok(!piezas.has(p), `pieza ${p} en ${piezas.get(p)} y en ${mod.id}/${f.id}`);
        piezas.set(p, `${mod.id}/${f.id}`);
      }
    }
  }
});
test('revisarModulo: los módulos no tienen errores; una estructura de contexto sin distractores suficientes es un error', () => {
  for (const mod of MODULOS) assert.deepEqual(revisarModulo(mod, { fuentes: FUENTES }), [], mod.id);
  const sinExtra = { ...MODULO_ANTEBRAZO, distractoresExtra: { radio: ['Húmero', 'Escafoides', 'Semilunar'], ulna: ['Húmero', 'Escafoides', 'Semilunar'] } };
  const errores = revisarModulo(sinExtra, { fuentes: FUENTES }).map((x) => x.texto).join('\n');
  for (const id of ['arteria-radial', 'arteria-ulnar', 'nervio-interoseo-anterior']) assert.match(errores, new RegExp(`${id}: menos de 3 distractores`));
});
test('fichaDePieza: por nombre de malla, con lado y por modelo', () => {
  assert.equal(fichaDePieza('Long_head_of_biceps_brachii_L').ficha.id, 'biceps-braquial');
  assert.equal(fichaDePieza('Radial_nerve_R', 'female').ficha.id, 'nervio-radial');
  assert.equal(fichaDePieza('Femur_L'), null);
  assert.equal(fichaDePieza('Radial_artery_L').modulo.id, 'antebrazo');
  assert.equal(fichaDePieza('Humero_ulnar_head_of_flexor_digitorum_superficialis_R', 'female').ficha.id, 'flexor-superficial-dedos');
});
