// Pruebas de las limitaciones conocidas del modelo 3D (src/data/limitaciones.js): el registro, la ficha de la pieza, la
// evaluación, el repaso y el progreso de «Estudiar», y Neuri (con un cliente con guion: sin red ni gasto). En `main` ninguna
// lección usa estas piezas, así que las pruebas usan una lección de prueba con piezas reales del modelo.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import { LIMITACIONES, limitacionesDe, restringida, revisarLimitaciones, textoLimitacion, partirLado, piezasRestringidas, urlFuente } from '../src/data/limitaciones.js';
import { leccion, W, GUIA, revisarLeccion, estructuraUtil, sinPiezasLimitadas, piezasLimitadas, avisosDePasos } from '../src/biblioteca/formato.js';
import { RETIRADAS } from '../src/biblioteca/retiradas.js';
import { calcularMapa } from '../src/biblioteca/mapa.js';
import { motivoNoDisponible, disponibleEn, instanciar, planEvaluacion, evaluacionDe, preguntaDeItem, noEvaluables, huella, rngConSemilla } from '../src/biblioteca/evaluar.js';
import * as P from '../src/biblioteca/progreso.js';
import { sinRepetirRecientes, itemsDePractica } from '../src/biblioteca/sesion.js';
import { inventario } from '../scripts/biblioteca/inventario.mjs';
import { avisoLimitacion } from '../src/ui/info.js';
import { fijarIdioma, t } from '../src/i18n/idioma.js';
import { IDIOMAS } from '../src/i18n/idioma.js';
import { notaLimite, textoLimites, clavesDeLeccion, limitadasEn } from '../server/neuri/limites.mjs';
import { crearManejador } from '../server/pet.mjs';
import { cargarInventario } from '../server/neuri/inventario.mjs';
import { crearCorpus } from '../server/neuri/evidencias.mjs';
import { validarLeccion } from '../server/neuri/ensamblar.mjs';
import { esPropiaValida, importarPropias, cargarPropias } from '../src/biblioteca/propias.js';

const INVENTARIO = inventario();
const memoria = (inicial = {}) => { const s = { ...inicial }; return { getItem: (k) => s[k] ?? null, setItem: (k, v) => { s[k] = String(v); }, datos: s }; };

// ── Lección de prueba: surcos y arterias, con piezas reales (y las tres limitadas) ──
const fr = (texto) => [texto, GUIA];
const LIM = leccion({
  id: 'prueba-limites', version: 1, titulo: 'Surcos y arterias de prueba', resumen: 'Una lección de prueba.',
  lugares: [['cabeza', 'encefalo']], sistemas: ['nervioso'], formato: 'estructuras', temas: [], nivel: 1, minutos: 10,
  objetivos: ['Localizar el surco central.', 'Localizar el surco paracentral.', 'Explicar dónde está el surco paracentral.'],
  estructuras: {
    central: { nombre: 'Surco central', piezas: ['Central_sulcus'], lado: 'bilateral', papel: 'nucleo', tipo: 'snc' },
    paracentral: { nombre: 'Surco paracentral', piezas: ['Paracentral_sulcus'], lado: 'bilateral', papel: 'nucleo', tipo: 'snc' },
    'frontal-superior': { nombre: 'Surco frontal superior', piezas: ['Superior_frontal_sulcus'], lado: 'bilateral', papel: 'nucleo', tipo: 'snc' },
    occipitotemporal: { nombre: 'Surco occipitotemporal', piezas: ['Occipitotemporal_sulcus_Lateral_part', 'Inferior_temporal_sulcus'], lado: 'bilateral', papel: 'nucleo', tipo: 'snc' },
    meningea: { nombre: 'Arteria meníngea media', piezas: ['Middle_meningeal_artery'], lado: 'bilateral', papel: 'nucleo', tipo: 'arteria' },
    'temporal-superficial': { nombre: 'Arteria temporal superficial', piezas: ['Superficial_temporal_artery'], lado: 'bilateral', papel: 'contexto', tipo: 'arteria' },
    maxilar: { nombre: 'Arteria maxilar', piezas: ['Maxillary_artery'], lado: 'bilateral', papel: 'contexto', tipo: 'arteria' },
  },
  pasos: [
    { id: 'p1', tipo: 'orientacion', titulo: 'Dónde', texto: [fr('Gira el modelo.')], vista: { ver: ['central'], contexto: [], fantasma: [] } },
    { id: 'p2', tipo: 'exploracion', titulo: 'Surcos', texto: [fr('Mira los surcos.')], vista: { ver: ['central', 'paracentral', 'frontal-superior', 'occipitotemporal'], contexto: [], fantasma: [] }, actividad: { tipo: 'localizar', estructura: 'paracentral', texto: 'Toca el surco paracentral.' } },
    { id: 'p3', tipo: 'explicacion', titulo: 'Arterias', texto: [fr('Mira las arterias.')], vista: { ver: ['meningea'], contexto: ['temporal-superficial', 'maxilar'], fantasma: [] } },
    { id: 'p4', tipo: 'sintesis', titulo: 'Repaso', texto: [fr('Repasa.')] },
  ],
  preguntas: [
    { id: 'id-central', tipo: 'identificar', objetivo: 0, paso: 'p2', estructura: 'central' },
    { id: 'loc-central', tipo: 'localizar', objetivo: 0, paso: 'p2', estructura: 'central', candidatas: ['paracentral', 'frontal-superior'] },
    { id: 'id-paracentral', tipo: 'identificar', objetivo: 1, paso: 'p2', estructura: 'paracentral' },
    { id: 'loc-paracentral', tipo: 'localizar', objetivo: 1, paso: 'p2', estructura: 'paracentral', candidatas: ['central', 'frontal-superior'] },
    { id: 'rel-paracentral', tipo: 'relacion', objetivo: 2, paso: 'p2', estructuras: ['paracentral'], enunciado: '¿En qué cara del hemisferio está el surco paracentral?', correcta: 'En la cara medial',
      distractores: ['En la cara lateral', 'En la cara inferior', 'En el polo frontal'], explicacion: 'Está junto al lóbulo paracentral, en la cara medial.', evidencia: [W('Paracentral_lobule', 'the paracentral lobule is on the medial surface of the cerebral hemisphere')] },
    { id: 'id-occipitotemporal', tipo: 'identificar', objetivo: 0, paso: 'p2', estructura: 'occipitotemporal' },
    { id: 'id-meningea', tipo: 'identificar', objetivo: 0, paso: 'p3', estructura: 'meningea' },
  ],
});
const PID = (q) => P.itemId(LIM.id, q);
const fueraPorLimite = (L, modelo = 'male') => (id, q) => !!q && motivoNoDisponible(L, q, modelo) === 'limitacion';

// ── El registro ──
test('limitaciones: el registro es válido y sus piezas existen, con su lado, en los dos modelos', () => {
  assert.equal(LIMITACIONES.length, 3);
  const problemas = revisarLimitaciones(LIMITACIONES, { piezasDe: (m) => INVENTARIO.piezas[m] });
  assert.deepEqual(problemas, []);
  // Un registro roto se detecta: pieza con lado, que no existe, sin textos o una pieza fuera de sitio que se deja localizar.
  const roto = [{ ...LIMITACIONES[0], id: 'rota', piezas: ['Paracentral_sulcus_L', 'Surco_inventado'], aviso: { es: 'x' }, restringe: ['distractor'] }];
  const textos = revisarLimitaciones(roto, { piezasDe: (m) => INVENTARIO.piezas[m] }).map((p) => p.texto).join(' | ');
  for (const trozo of ['va sin el lado', 'Surco_inventado_L no existe', 'falta «aviso» en en', 'no puede identificarse ni localizarse']) assert.ok(textos.includes(trozo), trozo);
});

test('limitaciones: se buscan por el nombre exacto de la malla, con o sin lado, y nunca por parecido', () => {
  assert.deepEqual(partirLado('Paracentral_sulcus_L'), { base: 'Paracentral_sulcus', lado: 'L' });
  assert.deepEqual(partirLado('Left_Paracentral_sulcus'), { base: 'Paracentral_sulcus', lado: 'L' });
  assert.equal(limitacionesDe('Paracentral_sulcus_R', 'female')[0].id, 'surco-paracentral-fuera-de-sitio');
  assert.equal(limitacionesDe('Paracentral_sulcus').length, 1);
  // El lóbulo paracentral (bien situado) y la rama accesoria de la meníngea media no son estas piezas.
  for (const n of ['Paracentral_gyrus_and_sulcus_R', 'Accessory_branch_of_middle_meningeal_artery_L', 'Inferior_temporal_gyrus_L', 'Central_sulcus_L']) assert.deepEqual(limitacionesDe(n, 'male'), [], n);
  // Fuera de sitio o de nombre dudoso: ni identificar, ni localizar, ni como opción falsa. Incompleta: se puede preguntar.
  for (const n of ['Paracentral_sulcus_L', 'Inferior_temporal_sulcus_R']) for (const uso of ['identificar', 'localizar', 'distractor']) assert.equal(restringida(n, 'male', uso), true, `${n} ${uso}`);
  for (const uso of ['identificar', 'localizar', 'distractor']) assert.equal(restringida('Middle_meningeal_artery_L', 'female', uso), false);
  assert.deepEqual(piezasRestringidas('distractor').sort(), ['Inferior_temporal_sulcus', 'Paracentral_sulcus']);
  assert.match(urlFuente(LIMITACIONES[0].fuentes[0]), /^https:\/\/en\.wikipedia\.org\/w\/index\.php\?title=Paracentral_lobule&oldid=1296279219$/);
});

test('limitaciones: la ficha de la pieza lo avisa en los cinco idiomas, arriba y con la explicación, y solo en las piezas afectadas', () => {
  try {
    for (const { id } of IDIOMAS) {
      fijarIdioma(id);
      const { cabeza, cuerpo } = avisoLimitacion('Paracentral_sulcus_L', 'male');
      const lim = LIMITACIONES[0];
      assert.ok(cabeza.includes('role="note"'), id);
      assert.ok(cabeza.includes(textoLimitacion(lim, 'aviso', id).replace(/&/g, '&amp;')), `${id}: aviso`);
      assert.ok(cuerpo.includes(textoLimitacion(lim, 'detalle', id).replace(/&/g, '&amp;')), `${id}: detalle`);
      assert.ok(cuerpo.includes('oldid=1296279219'), `${id}: fuente`);
      assert.ok(!/lim\.(titulo|estado)/.test(cabeza + cuerpo), `${id}: clave sin traducir`);
      assert.notEqual(t('lim.titulo'), 'lim.titulo');
      assert.deepEqual(avisoLimitacion('Paracentral_gyrus_and_sulcus_L', 'male'), { cabeza: '', cuerpo: '' }, id);
    }
  } finally { fijarIdioma('en'); }
});

// ── Estudiar: preguntas, evaluación y repaso ──
test('limitaciones: lo que el modelo muestra mal no se pregunta en 3D, pero las preguntas de texto sí', () => {
  const q = (id) => LIM.preguntas.find((x) => x.id === id);
  for (const modelo of ['male', 'female']) {
    assert.equal(motivoNoDisponible(LIM, q('id-paracentral'), modelo), 'limitacion');
    assert.equal(motivoNoDisponible(LIM, q('loc-paracentral'), modelo), 'limitacion');
    assert.equal(disponibleEn(LIM, q('rel-paracentral'), modelo), true);          // de texto, con su fuente
    assert.equal(disponibleEn(LIM, q('id-meningea'), modelo), true);              // incompleta: se señala lo que se ve
    assert.equal(disponibleEn(LIM, q('id-occipitotemporal'), modelo), true);      // le queda una pieza bien
    assert.equal(disponibleEn(LIM, q('id-central'), modelo), true);
    assert.equal(disponibleEn(LIM, q('loc-central'), modelo), true);
  }
  // Una localización cuyas candidatas están todas mal no se hace (no habría con qué comparar).
  const sola = { ...q('loc-central'), id: 'loc-central-2', candidatas: ['paracentral'] };
  assert.equal(motivoNoDisponible(LIM, sola, 'male'), 'limitacion');
});

test('limitaciones: la pieza mal situada no es candidata ni opción falsa, y la de una estructura de varias piezas no se resalta', () => {
  const q = (id) => LIM.preguntas.find((x) => x.id === id);
  for (let s = 1; s <= 20; s++) {
    const loc = instanciar(LIM, q('loc-central'), rngConSemilla(s), { modelo: 'male' });
    assert.ok(!loc.candidatas.includes('paracentral'));
    assert.deepEqual([...loc.candidatas].sort(), ['central', 'frontal-superior']);
    const ide = instanciar(LIM, q('id-central'), rngConSemilla(s), { modelo: 'male' });
    assert.ok(!ide.opciones.some((o) => o.texto === 'Surco paracentral'));
    assert.ok(ide.opciones.length >= 3);
    // La huella es la de la pregunta del banco: quitar candidatas no borra el historial de nadie.
    assert.equal(loc.huella, huella(q('loc-central')));
  }
  const L3 = sinPiezasLimitadas(LIM, 'male', 'identificar');
  assert.deepEqual(L3.estructuras.occipitotemporal.piezas, ['Occipitotemporal_sulcus_Lateral_part']);
  assert.deepEqual(L3.estructuras.paracentral.piezas, []);
  assert.deepEqual(L3.estructuras.meningea.piezas, ['Middle_meningeal_artery']);
  assert.equal(L3.estructuras.central, LIM.estructuras.central);                // lo demás, sin tocar
  assert.equal(sinPiezasLimitadas({ ...LIM, estructuras: { central: LIM.estructuras.central } }, 'male', 'localizar').estructuras.central, LIM.estructuras.central);
  assert.deepEqual(piezasLimitadas(LIM.estructuras.occipitotemporal, 'female', 'localizar'), ['Inferior_temporal_sulcus']);
  assert.equal(estructuraUtil(LIM.estructuras.occipitotemporal, 'female', 'localizar'), true);
  assert.equal(estructuraUtil(LIM.estructuras.paracentral, 'female', 'localizar'), false);
});

test('limitaciones: la evaluación dice qué deja fuera y qué objetivo no se puede evaluar; nunca pregunta lo limitado', () => {
  const plan = planEvaluacion(LIM, { modelo: 'male', rng: rngConSemilla(3) });
  assert.deepEqual(plan.excluidas.map((x) => `${x.id}:${x.motivo}`).sort(), ['id-paracentral:limitacion', 'loc-paracentral:limitacion']);
  assert.deepEqual(plan.sinEvaluar, [{ objetivo: 1, motivo: 'limitacion' }]);
  for (let s = 1; s <= 30; s++) {
    const ids = evaluacionDe(LIM, { modelo: 'female', rng: rngConSemilla(s) }).map((x) => x.id);
    assert.ok(!ids.includes('id-paracentral') && !ids.includes('loc-paracentral'), `semilla ${s}`);
    assert.ok(ids.includes('rel-paracentral'), 'el objetivo de texto sigue evaluándose');
  }
  assert.equal(preguntaDeItem(new Map([[LIM.id, LIM]]), PID('id-paracentral'), { modelo: 'male' }), null);
  assert.ok(preguntaDeItem(new Map([[LIM.id, LIM]]), PID('rel-paracentral'), { modelo: 'male' }));
  const no = noEvaluables(LIM, 'male');
  assert.deepEqual([...no.excluidas].sort(), ['id-paracentral', 'loc-paracentral']);
  assert.deepEqual(no.sinEvaluar, [1]);
  // Una lección cuyas preguntas en 3D son todas de piezas limitadas se queda sin evaluación (la app lo explica).
  const soloLimitadas = { ...LIM, objetivos: [LIM.objetivos[1]], preguntas: LIM.preguntas.filter((x) => x.objetivo === 1).map((x) => ({ ...x, objetivo: 0 })) };
  const vacia = planEvaluacion(soloLimitadas, { modelo: 'male' });
  assert.equal(vacia.preguntas.length, 0);
  assert.deepEqual(vacia.sinEvaluar, [{ objetivo: 0, motivo: 'limitacion' }]);
});

test('limitaciones: sin fallo registrado, sin dominio ficticio y sin volver al repaso; el historial se conserva', () => {
  const ahora = Date.parse('2026-11-09T12:00:00Z');
  const data = P.vacio();
  P.anotar(data, PID('id-paracentral'), 'fallo', ahora - 1000);
  P.anotar(data, PID('id-central'), 'fallo', ahora - 1000);
  assert.equal(P.estadoLeccion(data, LIM, { ahora }).pendientes, 2);
  // Al cargar la lección: lo limitado queda huérfano (se conserva con sus fallos, pero no se repasa ni cuenta).
  assert.equal(P.depurar(data, LIM, huella, fueraPorLimite(LIM)), 1);
  assert.equal(data.items[PID('id-paracentral')].huerfana, true);
  assert.equal(data.items[PID('id-paracentral')].fallos, 1);
  assert.deepEqual(P.vencidas(data, { ahora }), [PID('id-central')]);
  assert.deepEqual(P.falladas(data, { ahora }), [PID('id-central')]);
  assert.equal(P.estadoLeccion(data, LIM, { ahora }).pendientes, 1);
  assert.ok(!itemsDePractica(data, 'region', { lecciones: [LIM.id], ahora }).includes(PID('id-paracentral')));
  // Si la limitación se corrige (la pregunta vuelve a poder hacerse), el ítem se recupera.
  assert.equal(P.depurar(data, LIM, huella, () => false), 1);
  assert.equal(data.items[PID('id-paracentral')].huerfana, undefined);

  // Una evaluación con un objetivo que no se pudo evaluar no demuestra la lección, aunque lo demás esté perfecto.
  assert.equal(P.registrarEvaluacion(data, LIM, { aciertos: 5, total: 5, porObjetivo: [[4, 4], [0, 0], [1, 1]], sinEvaluar: [1] }, ahora), false);
  assert.deepEqual(data.lecciones[LIM.id].evaluaciones.at(-1).sinEvaluar, [1]);
  assert.equal(P.registrarEvaluacion(data, LIM, { aciertos: 5, total: 5, porObjetivo: [[4, 4], [0, 0], [1, 1]] }, ahora), true);
  assert.equal(data.lecciones[LIM.id].evaluaciones.at(-1).sinEvaluar, undefined);

  // Dominio: las preguntas excluidas no cuentan, pero un objetivo sin ninguna pregunta posible lo impide.
  const dom = P.vacio();
  for (const q of LIM.preguntas) if (!['id-paracentral', 'loc-paracentral'].includes(q.id)) dom.items[PID(q.id)] = { caja: P.CAJA_DOMINIO, aciertos: 3, fallos: 0, dudas: 0, ultimo: ahora, proximo: ahora + 1e9 };
  const no = noEvaluables(LIM, 'male');
  assert.equal(P.estadoLeccion(dom, LIM, { ahora }).estado === 'dominada', false);                      // sin saberlo: 5 de 7
  assert.equal(P.estadoLeccion(dom, LIM, { ahora, excluidas: no.excluidas, sinEvaluar: no.sinEvaluar.length }).estado === 'dominada', false);
  assert.equal(P.estadoLeccion(dom, LIM, { ahora, excluidas: no.excluidas, sinEvaluar: 0 }).estado, 'dominada');
  assert.deepEqual(P.estadoLeccion(dom, LIM, { ahora, excluidas: no.excluidas }).dominio, { en: 5, de: 5 });
});

test('limitaciones: en el repaso, lo limitado se cambia por otra pregunta de lo mismo, o se quita si no la hay', () => {
  const ahora = Date.parse('2026-11-09T12:00:00Z');
  const data = P.vacio();
  const lecciones = new Map([[LIM.id, LIM]]);
  const r = sinRepetirRecientes([PID('id-paracentral'), PID('id-central')], { data, lecciones, modelo: 'male', ahora });
  assert.deepEqual(r, { items: [PID('rel-paracentral'), PID('id-central')], esperan: 0 });
  const sinTexto = { ...LIM, preguntas: LIM.preguntas.filter((x) => x.id !== 'rel-paracentral') };
  const r2 = sinRepetirRecientes([PID('loc-paracentral')], { data, lecciones: new Map([[LIM.id, sinTexto]]), modelo: 'male', ahora });
  assert.deepEqual(r2, { items: [], esperan: 0, quitadas: 1 });
  // Lo que no se puede hacer por otro motivo (una estructura que solo está en el otro modelo, una pregunta retirada) no
  // se achaca a las limitaciones: sigue como antes, y preguntaDeItem lo descarta sin decir nada.
  const soloMujer = { ...LIM, estructuras: { ...LIM.estructuras, central: { ...LIM.estructuras.central, modelos: ['female'] } } };
  assert.equal(motivoNoDisponible(soloMujer, LIM.preguntas.find((x) => x.id === 'id-central'), 'male'), 'modelo');
  assert.deepEqual(sinRepetirRecientes([PID('id-central')], { data, lecciones: new Map([[LIM.id, soloMujer]]), modelo: 'male', ahora }), { items: [PID('id-central')], esperan: 0 });
  RETIRADAS.preguntas.push(PID('id-central'));
  try {
    assert.deepEqual(sinRepetirRecientes([PID('id-central')], { data, lecciones, modelo: 'male', ahora }), { items: [PID('id-central')], esperan: 0 });
  } finally { RETIRADAS.preguntas.pop(); }
});

test('limitaciones: el dominio solo descuenta lo limitado; lo retirado o del otro modelo cuenta como siempre, y el mapa dice lo mismo que las tarjetas', () => {
  const ahora = Date.parse('2026-11-09T12:00:00Z');
  // Un objetivo con todas sus preguntas retiradas no se da por dominado (como antes del cambio).
  RETIRADAS.preguntas.push(PID('rel-paracentral'));
  try {
    const no = noEvaluables(LIM, 'male');
    assert.ok(!no.excluidas.has('rel-paracentral'), 'lo retirado no sale del dominio');
    assert.deepEqual([...no.excluidas].sort(), ['id-paracentral', 'loc-paracentral']);
  } finally { RETIRADAS.preguntas.pop(); }
  const soloMujer = { ...LIM, estructuras: { ...LIM.estructuras, central: { ...LIM.estructuras.central, modelos: ['female'] } } };
  assert.ok(!noEvaluables(soloMujer, 'male').excluidas.has('id-central'), 'lo del otro modelo tampoco');
  // El mapa usa el estado que se le da (en la app, ctx.estado, el mismo de las tarjetas).
  const data = P.vacio();
  const entrada = { id: LIM.id, version: 1, pasos: 4, preguntas: LIM.preguntas.length };
  assert.equal(calcularMapa(data, { catalogo: [entrada], ahora }).lecciones.dominadas, 0);
  assert.equal(calcularMapa(data, { catalogo: [entrada], ahora, estado: () => ({ estado: 'dominada' }) }).lecciones.dominadas, 1);
});

test('limitaciones: el aviso de un paso sale donde la estructura es el foco, la nombra, y el paso de una actividad desactivada lo tiene siempre', () => {
  const ids = (m, paso) => (m.get(paso) ?? []).map((x) => `${x.limitacion.id}:${x.estructuras.join('+')}`);
  // En la lección de prueba: el surco paracentral, en el paso de su actividad; el occipitotemporal (que tiene la pieza
  // de nombre dudoso), en el único paso que lo resalta; la meníngea media, en el suyo. Nada en p1 ni p4.
  const m = avisosDePasos(LIM, 'male');
  assert.deepEqual(ids(m, 'p1'), []);
  assert.deepEqual(ids(m, 'p2'), ['surco-paracentral-fuera-de-sitio:paracentral', 'surco-temporal-inferior-nombre-dudoso:occipitotemporal']);
  assert.deepEqual(ids(m, 'p3'), ['arteria-meningea-media-incompleta:meningea']);
  assert.deepEqual(ids(m, 'p4'), []);
  // Un paso de orientación que resalta muchas estructuras no se lleva el aviso si otro paso se centra en ella.
  const pasos = structuredClone(LIM.pasos);
  pasos[0].vista.ver = ['central', 'frontal-superior', 'occipitotemporal'];
  pasos[1].vista.ver = ['occipitotemporal'];
  pasos[1].actividad = { tipo: 'comparar', estructuras: ['paracentral', 'central'], texto: 'Compara los dos surcos.' };
  pasos[2].actividad = { tipo: 'localizar', estructura: 'paracentral', texto: 'Toca el surco paracentral.' };
  const m2 = avisosDePasos({ ...LIM, pasos }, 'male');
  assert.deepEqual(ids(m2, 'p1'), []);
  assert.deepEqual(ids(m2, 'p2'), ['surco-paracentral-fuera-de-sitio:paracentral', 'surco-temporal-inferior-nombre-dudoso:occipitotemporal']);
  // p3 vuelve a avisar del surco paracentral: su actividad «localizar» se desactiva, y la persona tiene que saber por qué.
  assert.deepEqual(ids(m2, 'p3'), ['arteria-meningea-media-incompleta:meningea', 'surco-paracentral-fuera-de-sitio:paracentral']);
});

test('limitaciones: el revisor de lecciones solo avisa (no rechaza), para no apartar lecciones propias guardadas', () => {
  const problemas = revisarLeccion(LIM, {}).filter((p) => p.texto.includes('limitaciones conocidas'));
  assert.ok(problemas.length >= 4);
  assert.ok(problemas.every((p) => p.nivel === 'aviso'));
  const textos = problemas.map((p) => p.texto).join(' | ');
  for (const trozo of ['pregunta id-paracentral: paracentral', 'paso p2: paracentral', 'pregunta loc-central (candidata): paracentral', 'occipitotemporal tiene piezas con limitaciones conocidas del modelo (Inferior_temporal_sulcus); se pregunta sin ellas']) assert.ok(textos.includes(trozo), trozo);
  assert.ok(!textos.includes('meningea'), 'la incompleta no restringe nada');
});

// ── Neuri: lo que se le dice y lo que se le quita (cliente con guion, sin red) ──
test('limitaciones: Neuri solo recibe las limitaciones de las estructuras con las que trabaja', () => {
  assert.match(notaLimite('Paracentral_sulcus'), /LIMITACIÓN DEL MODELO 3D: .*No la uses en preguntas de identificar, preguntas o actividades de localizar/);
  assert.match(notaLimite('Middle_meningeal_artery'), /no describas lo que falta como si se viera/);
  assert.equal(notaLimite('Central_sulcus'), '');
  assert.equal(textoLimites(['Central_sulcus', 'Nasal_Bone']), '');
  const bloque = textoLimites(['Paracentral_sulcus', 'Central_sulcus', 'Middle_meningeal_artery']);
  assert.ok(bloque.includes('- Paracentral_sulcus:') && bloque.includes('- Middle_meningeal_artery:'));
  assert.ok(!bloque.includes('Inferior_temporal_sulcus') && !bloque.includes('Central_sulcus:'));
  assert.deepEqual(clavesDeLeccion(LIM).filter((k) => notaLimite(k)), ['Paracentral_sulcus', 'Inferior_temporal_sulcus', 'Middle_meningeal_artery']);
});

const CATALOGO = JSON.parse(fs.readFileSync(new URL('../src/biblioteca/generado/catalogo.json', import.meta.url), 'utf8'));
const INV = cargarInventario();
const silencio = { info() {}, error() {} };
const PAGINAS = [
  ['wp:Nasal_bone', 'Nasal bone', 'The nasal bones are two small oblong bones, varying in size and form in different individuals. They are placed side by side at the middle and upper part of the face. By their junction, they form the bridge of the upper one third of the nose. Each nasal bone has two surfaces and four borders.'],
  ['wp:Vomer', 'Vomer', 'The vomer is one of the unpaired facial bones of the skull. It is located in the midsagittal line, and articulates with the sphenoid, the ethmoid and the maxillary bones. The vomer forms the inferior part of the nasal septum in humans.'],
  ['wp:Inferior_nasal_concha', 'Inferior nasal concha', 'The inferior nasal concha is one of the three paired nasal conchae in the nose. It extends horizontally along the lateral wall of the nasal cavity. It consists of a lamina of spongy bone, curled upon itself like a scroll.'],
  ['wp:Maxilla', 'Maxilla', 'The maxilla is a bone that fuses with its pair to form the upper jaw. Each maxilla helps to form the boundaries of the orbit, the nasal cavity and the oral cavity. The maxilla holds the upper teeth.'],
];
function recursosFalsos() {
  const corpus = crearCorpus();
  for (const [f, titulo, texto] of PAGINAS) corpus.añadirFuente(f, { titulo, url: `https://en.wikipedia.org/w/index.php?title=${titulo.replace(/ /g, '_')}&oldid=1`, licencia: 'CC BY-SA 4.0', revid: 1, fecha: '2026-11-09' }, texto);
  return { inventario: INV, corpus, lecciones: new Map(), disponible: true, traerPagina: async () => null };
}
function apiGuion(responder) {
  const llamadas = [];
  const r = async (params) => {
    llamadas.push(params);
    return { id: 'm', type: 'message', role: 'assistant', model: params.model, content: [{ type: 'text', text: JSON.stringify(await responder(params, llamadas.length)) }], stop_reason: 'end_turn', usage: { input_tokens: 100, output_tokens: 50 } };
  };
  const messages = { create: r, stream: (p) => ({ finalMessage: () => r(p) }) };
  return { api: { messages, beta: { messages } }, llamadas };
}
const tipoDe = (params) => { const p = params.output_config.format.schema.properties; return p.veredictos ? 'verificar' : p.leccion ? 'redactar' : p.plan ? 'planificar' : 'orientar'; };
const nAfirmaciones = (params) => (params.messages[0].content.match(/^\d+\./gm) ?? []).length;
const veredictos = (params) => ({ veredictos: Array.from({ length: nAfirmaciones(params) }, (_, i) => ({ n: i + 1, respalda: 'si', nota: '' })) });
const enumEvidencias = (params) => params.output_config.format.schema.properties.leccion.anyOf[0].properties.pasos.items.properties.frases.items.properties.evidencias.items.enum;
const peticion = (cuerpo) => new Request('http://localhost:5180/api/pet', { method: 'POST', headers: { 'content-type': 'application/json', origin: 'http://localhost:5180' }, body: JSON.stringify(cuerpo) });
const eventos = async (res) => (await res.text()).trim().split('\n').map((l) => JSON.parse(l));
const textoSistema = (params) => (Array.isArray(params.system) ? params.system.map((b) => b.text ?? '') : [String(params.system ?? '')]);

// La lección de la nariz de las pruebas de Neuri, con el surco paracentral en el núcleo y la IA pidiendo, mal, localizarlo
// e identificarlo (en una pregunta y en la actividad de un paso).
const PLAN = {
  titulo: 'Huesos de la nariz', resumen: 'Los huesos que forman la nariz y la cavidad nasal.', nivel: 1, minutos: 12, formato: 'estructuras',
  sistemas: ['oseo'], temas: ['huesos'], lugares: [{ region: 'cabeza', subregion: 'cara' }],
  objetivos: ['Localizar los huesos nasales, el vómer y los cornetes inferiores.', 'Describir qué forman los huesos nasales y el vómer.'],
  estructuras: [{ clave: 'Nasal_Bone', papel: 'nucleo' }, { clave: 'Inferior_Nasal_Concha', papel: 'nucleo' }, { clave: 'Vomer', papel: 'nucleo' }, { clave: 'Maxilla', papel: 'contexto' }, { clave: 'Paracentral_sulcus', papel: 'nucleo' }],
  pasos: [
    { tipo: 'orientacion', titulo: 'Dónde está', idea: 'Situar la nariz en la cara', estructuras: ['Maxilla'] },
    { tipo: 'explicacion', titulo: 'Huesos nasales', idea: 'El puente de la nariz', estructuras: ['Nasal_Bone'] },
    { tipo: 'exploracion', titulo: 'Cornetes y vómer', idea: 'Dentro de la cavidad nasal', estructuras: ['Inferior_Nasal_Concha', 'Vomer', 'Paracentral_sulcus'] },
    { tipo: 'sintesis', titulo: 'Repaso', idea: 'Resumen', estructuras: [] },
  ],
  paginas: [], limitaciones: [], supuestos: [], accion: 'crear', base: null,
};
function borrador(ids) {
  const fr2 = (t2, i) => ({ texto: t2, marca: 'evidencia', evidencias: [ids[i % ids.length]] });
  const nada = { enunciado: null, correcta: null, distractores: [], orden: [], explicacion: null, evidencias: [] };
  return {
    resumen: 'Huesos nasales, cornetes inferiores y vómer en el modelo.',
    pasos: [
      { tipo: 'orientacion', titulo: 'La nariz en la cara', frases: [fr2('El maxilar ayuda a formar la cavidad nasal.', 3), { texto: 'Gira el modelo para ver la cara de frente.', marca: 'guia', evidencias: [] }], detalle: [], ver: ['Maxilla'], contexto: [], fantasma: [], camara: 'anterior', esqueleto: true, actividad: null },
      { tipo: 'explicacion', titulo: 'Los huesos nasales', frases: [fr2('Los dos huesos nasales forman el puente de la nariz.', 0)], detalle: [], ver: ['Nasal_Bone'], contexto: ['Maxilla'], fantasma: [], camara: 'anterolateral', esqueleto: false, actividad: { tipo: 'localizar', estructuras: ['Nasal_Bone'], vistas: [], texto: 'Toca un hueso nasal.' } },
      { tipo: 'exploracion', titulo: 'Cornetes y vómer', frases: [fr2('El vómer forma la parte inferior del tabique nasal.', 1), fr2('El cornete inferior recorre la pared lateral de la cavidad nasal.', 2)], detalle: [], ver: ['Inferior_Nasal_Concha', 'Vomer', 'Paracentral_sulcus'], contexto: [], fantasma: ['Maxilla'], camara: 'lateral', esqueleto: false, actividad: { tipo: 'localizar', estructuras: ['Paracentral_sulcus'], vistas: [], texto: 'Toca el surco paracentral.' } },
      { tipo: 'sintesis', titulo: 'Repaso', frases: [fr2('Los huesos nasales forman el puente; el vómer, parte del tabique.', 0)], detalle: [], ver: [], contexto: [], fantasma: [], camara: 'anterior', esqueleto: false, actividad: null },
    ],
    preguntas: [
      { tipo: 'identificar', objetivo: 0, paso: 1, estructura: 'Nasal_Bone', ...nada },
      { tipo: 'localizar', objetivo: 0, paso: 2, estructura: 'Vomer', ...nada },
      { tipo: 'identificar', objetivo: 0, paso: 2, estructura: 'Inferior_Nasal_Concha', ...nada },
      { tipo: 'localizar', objetivo: 0, paso: 2, estructura: 'Paracentral_sulcus', ...nada },
      { tipo: 'identificar', objetivo: 0, paso: 2, estructura: 'Paracentral_sulcus', ...nada },
      { tipo: 'funcion', objetivo: 1, paso: 1, estructura: null, enunciado: '¿Qué forman los huesos nasales?', correcta: 'El puente de la nariz', distractores: ['El paladar duro', 'El suelo de la órbita', 'El tabique cartilaginoso'], orden: [], explicacion: 'Al unirse forman el puente de la nariz.', evidencias: [ids[0]] },
    ],
  };
}

async function crearConLimitada(cambiar = (b) => b) {
  const { api, llamadas } = apiGuion((params) => (tipoDe(params) === 'verificar' ? veredictos(params) : { tipo: 'leccion', mensaje: 'Borrador.', leccion: cambiar(borrador(enumEvidencias(params))) }));
  const manejar = crearManejador({ catalogo: CATALOGO, cliente: api, recursos: () => recursosFalsos(), registro: silencio });
  const ev = await eventos(await manejar(peticion({ v: 2, modo: 'redactar', idioma: 'es', mensajes: [], plan: PLAN })));
  return { ev, llamadas };
}

test('limitaciones: Neuri no entrega una actividad en 3D puntuable sobre una pieza limitada aunque la IA la pida', async () => {
  const { ev, llamadas } = await crearConLimitada();
  const fin = ev.at(-1);
  assert.equal(fin.estado, 'lista', JSON.stringify(fin).slice(0, 400));
  const L = fin.leccion;
  assert.ok(L.estructuras['paracentral-sulcus'], 'la estructura sigue (se enseña con fuentes)');
  assert.ok(!L.preguntas.some((q) => ['identificar', 'localizar'].includes(q.tipo) && q.estructura === 'paracentral-sulcus'));
  assert.ok(!L.preguntas.some((q) => (q.candidatas ?? []).includes('paracentral-sulcus')));
  assert.ok(!L.pasos.some((p) => p.actividad?.tipo === 'localizar' && p.actividad.estructura === 'paracentral-sulcus'));
  assert.ok(L.pasos.some((p) => p.actividad?.tipo === 'localizar' && p.actividad.estructura === 'nasal-bone'), 'lo válido se conserva');
  assert.equal(fin.informe.limitesModelo, 3);
  assert.equal(fin.informe.quitadas, 0, 'lo quitado por la limitación no se cuenta además como afirmaciones sin respaldo');
  assert.equal(L.revision.estado, 'borrador');
  // Lo que se le dijo a Claude: la nota del surco paracentral, en el bloque variable y solo esa.
  const redactar = llamadas.find((x) => tipoDe(x) === 'redactar');
  const [fijo, variable] = textoSistema(redactar);
  assert.ok(variable.includes('LIMITACIONES DEL MODELO 3D') && variable.includes('- Paracentral_sulcus:'));
  assert.ok(!variable.includes('Middle_meningeal_artery') && !variable.includes('Inferior_temporal_sulcus'));
  assert.ok(!fijo.includes('LIMITACIÓN DEL MODELO 3D'), 'nada en el bloque fijo (caché)');
  // La red de seguridad: si una pregunta así llegara a la validación, sería un error (no se entregaría).
  const mala = structuredClone(L);
  mala.preguntas.push({ id: 'qx', tipo: 'localizar', objetivo: 0, paso: L.pasos[1].id, estructura: 'paracentral-sulcus', candidatas: ['nasal-bone', 'vomer'] });
  const val = validarLeccion(mala, { inventario: INV, citaEnFuente: () => true, fuentes: {} });
  assert.ok(val.errores.some((e) => e.includes('pregunta qx') && e.includes('muestra mal')), val.errores.join(' | '));
});

test('limitaciones: si la IA pone primero la pieza limitada en una actividad «localizar», la actividad se quita (no se cambia de pieza)', async () => {
  const { ev } = await crearConLimitada((b) => {
    b.pasos[2].actividad = { tipo: 'localizar', estructuras: ['Paracentral_sulcus', 'Vomer'], vistas: [], texto: 'Toca el surco paracentral, por encima del vómer.' };
    return b;
  });
  const fin = ev.at(-1);
  assert.equal(fin.estado, 'lista', JSON.stringify(fin).slice(0, 400));
  const actividades = fin.leccion.pasos.map((p) => p.actividad).filter(Boolean);
  assert.ok(!actividades.some((a) => a.texto.includes('surco paracentral')), JSON.stringify(actividades));
  assert.ok(!actividades.some((a) => a.tipo === 'localizar' && a.estructura === 'vomer'), 'no se cambia por otra estructura con el mismo texto');
  assert.equal(fin.informe.limitesModelo, 3);
  assert.equal(fin.informe.quitadas, 0);
});

test('limitaciones: una lección propia importada con esa pregunta se guarda (no se aparta), pero no se evalúa ni se repasa', async () => {
  const { ev } = await crearConLimitada();
  const L = structuredClone(ev.at(-1).leccion);
  L.preguntas.push({ id: 'qx', tipo: 'localizar', objetivo: 0, paso: L.pasos[1].id, estructura: 'paracentral-sulcus', candidatas: ['nasal-bone', 'vomer'] });
  assert.equal(esPropiaValida(L), true);
  const almacen = memoria();
  assert.equal(importarPropias(almacen, JSON.stringify([L])).añadidas, 1);
  const guardada = cargarPropias(almacen).find((x) => x.id === L.id);
  assert.ok(guardada);
  for (let s = 1; s <= 20; s++) assert.ok(!evaluacionDe(guardada, { modelo: 'male', rng: rngConSemilla(s) }).some((x) => x.id === 'qx'));
  assert.equal(preguntaDeItem(new Map([[guardada.id, guardada]]), `${guardada.id}/qx`, { modelo: 'male' }), null);
});

test('limitaciones: al orientar, Neuri recibe la nota solo si la persona nombra la pieza (en cualquier idioma, también antes)', async () => {
  const respuesta = { tipo: 'recomendacion', mensaje: 'Mira esta lección.', lecciones: [], sesion: null, recorrido: null, evidencias: [], solicitud: null, contexto: { tema: null, objetivo: null, nivel: null, minutos: null }, sugerencias: [] };
  const conversar = async (mensajes, { idioma = 'es', contexto = null } = {}) => {
    const { api, llamadas } = apiGuion(() => respuesta);
    const manejar = crearManejador({ catalogo: CATALOGO, cliente: api, recursos: () => recursosFalsos(), registro: silencio });
    const lista = typeof mensajes === 'string' ? [{ rol: 'usuario', texto: mensajes }] : mensajes;
    await manejar(peticion({ v: 2, modo: 'orientar', idioma, mensajes: lista, progreso: { terminadas: [], enCurso: [], repasos: [], guardadas: [] }, ...(contexto ? { contexto } : {}) }));
    return textoSistema(llamadas[0])[1];
  };
  const notas = (variable) => (variable.split('LIMITACIONES DEL MODELO 3D')[1] ?? '').match(/^- \w+/gm)?.map((x) => x.slice(2)) ?? [];
  assert.deepEqual(notas(await conversar('¿Dónde está el surco paracentral?')), ['Paracentral_sulcus']);
  assert.deepEqual(notas(await conversar('¿Dónde está el surco central?')), []);
  // En francés y en italiano también (el inventario tiene esos nombres), y sin confundir el surco central.
  assert.deepEqual(notas(await conversar('Où se trouve le sillon paracentral ?', { idioma: 'fr' })), ['Paracentral_sulcus']);
  assert.deepEqual(notas(await conversar('Où se trouve le sillon central ?', { idioma: 'fr' })), []);
  assert.deepEqual(notas(await conversar("Montre-moi l'artère méningée moyenne", { idioma: 'fr' })), ['Middle_meningeal_artery']);
  assert.deepEqual(notas(await conversar('Dove si trova il solco temporale inferiore?', { idioma: 'it' })), ['Inferior_temporal_sulcus']);
  // La pregunta siguiente sigue hablando de lo mismo: lo que nombró antes o el tema que se conserva.
  const antes = [{ rol: 'usuario', texto: 'Háblame del surco paracentral.' }, { rol: 'pet', texto: 'Está en la cara medial, delante del lóbulo paracentral.' }, { rol: 'usuario', texto: '¿Y dónde lo veo en el modelo 3D?' }];
  assert.deepEqual(notas(await conversar(antes)), ['Paracentral_sulcus']);
  assert.deepEqual(notas(await conversar('¿Y dónde lo veo en el modelo?', { contexto: { tema: 'surco paracentral', objetivo: null, nivel: null, minutos: null } })), ['Paracentral_sulcus']);
  // Directamente: solo nombres completos, como palabras enteras.
  assert.deepEqual(limitadasEn(['el lóbulo paracentral', 'solco centrale', ''], INV), []);
  assert.deepEqual(limitadasEn(['Sulcus temporalis inferior'], INV), ['Inferior_temporal_sulcus']);
});
