// Pruebas de la biblioteca de estudio (src/biblioteca/): taxonomía, buscador, filtros, progreso (con la migración desde
// la versión 1), preguntas, sesiones y las propias lecciones (formato, piezas en los modelos y citas comprobadas).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import { revisarTaxonomia, REGIONES, SUBREGION_POR_ID } from '../src/biblioteca/taxonomia.js';
import { crearBuscador, normalizar, distancia } from '../src/biblioteca/buscar.js';
import * as F from '../src/biblioteca/filtros.js';
import * as P from '../src/biblioteca/progreso.js';
import { instanciar, corregir, evaluacionDe, disponibleEn, porObjetivo, preguntaDeItem, rngConSemilla, NO_LO_SE } from '../src/biblioteca/evaluar.js';
import { proponer, itemsDePractica } from '../src/biblioteca/sesion.js';
import { revisarLeccion, todasLasEvidencias, frases } from '../src/biblioteca/formato.js';
import { deModulo } from '../src/biblioteca/modulos.js';
import { RECORRIDOS, leccionesDeRecorrido } from '../src/biblioteca/recorridos.js';
import { MODULOS } from '../src/content/index.js';
import { inventario } from '../scripts/biblioteca/inventario.mjs';
import { cargarLecciones, huellaCita, COMPROBADAS, leerRegistro } from '../scripts/biblioteca/fuentes.mjs';
import { PLAN } from '../scripts/biblioteca/plan.mjs';

const DIA = 24 * 3600 * 1000;
const memoria = (inicial = {}) => {
  const s = { ...inicial };
  return { getItem: (k) => s[k] ?? null, setItem: (k, v) => { s[k] = String(v); }, datos: s };
};
const CATALOGO = JSON.parse(fs.readFileSync(new URL('../src/biblioteca/generado/catalogo.json', import.meta.url), 'utf8'));
const NUEVAS = await cargarLecciones();
const ANTIGUAS = new Map(MODULOS.map(deModulo).filter(Boolean).map((L) => [L.id, L]));
const LECCIONES = new Map([...ANTIGUAS, ...NUEVAS]);
const { piezas: PIEZAS } = inventario();
const HOMBRO = LECCIONES.get('ms-hombro-musculos');

// ── Taxonomía y plan ──
test('taxonomía sin identificadores repetidos; cada subregión pertenece a una región', () => {
  assert.deepEqual(revisarTaxonomia(), []);
  for (const r of REGIONES) for (const s of r.sub) assert.equal(SUBREGION_POR_ID.get(s.id).region, r.id);
});

test('plan: identificadores únicos; los recorridos citan lecciones del plan', () => {
  const ids = PLAN.map((p) => p.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const r of RECORRIDOS) for (const id of leccionesDeRecorrido(r)) assert.ok(ids.includes(id), `${r.id}: ${id}`);
});

// ── Lecciones ──
test('cada lección nueva pasa el revisor (piezas que existen en los modelos, objetivos con preguntas…)', () => {
  const ids = new Set(PLAN.map((p) => p.id));
  for (const L of NUEVAS.values()) {
    const errores = revisarLeccion(L, { piezasDe: (m) => PIEZAS[m], lecciones: ids, fuentes: leerRegistro() }).filter((p) => p.nivel === 'error');
    assert.deepEqual(errores, [], L.id);
  }
});

test('cada cita de cada lección está comprobada en su fuente (fuentes.mjs comprobar)', () => {
  const ok = JSON.parse(fs.readFileSync(COMPROBADAS, 'utf8'));
  for (const L of NUEVAS.values()) {
    for (const e of todasLasEvidencias(L)) assert.ok((ok[e.f] ?? []).includes(huellaCita(e.f, e.c)), `${L.id}: «${e.c}» (${e.f})`);
  }
});

test('el revisor detecta una frase sin evidencia, una pieza inexistente y un objetivo sin preguntas', () => {
  const malo = structuredClone(HOMBRO);
  malo.pasos[1].texto.push(['Una afirmación sin fuente.']);
  malo.estructuras.deltoides.piezas = ['Pieza_que_no_existe'];
  malo.preguntas = malo.preguntas.filter((q) => q.objetivo !== 4);
  const t = revisarLeccion(malo, { piezasDe: (m) => PIEZAS[m] }).map((p) => p.texto).join('\n');
  assert.match(t, /frase sin evidencia/);
  assert.match(t, /Pieza_que_no_existe/);
  assert.match(t, /objetivo 5 no tiene ninguna pregunta/);
});

test('el catálogo generado está al día con las lecciones (npm run check lo comprueba entero)', () => {
  assert.deepEqual(CATALOGO.lecciones.map((L) => L.id).sort(), [...LECCIONES.keys()].sort());
  for (const L of CATALOGO.lecciones) assert.equal(L.version, LECCIONES.get(L.id).version, L.id);
  assert.deepEqual(CATALOGO.piezas.Supraspinatus_muscle.n, ['ms-hombro-musculos']);
});

// ── Buscador ──
const B = crearBuscador({
  lecciones: CATALOGO.lecciones, recorridos: RECORRIDOS,
  estructuras: [
    { clave: 'Supraspinatus_muscle', nombre: 'Músculo supraespinoso', latin: 'Musculus supraspinatus', en: 'Supraspinatus muscle' },
    { clave: 'Ulna', nombre: 'Ulna', latin: 'Ulna', en: 'Ulna', sinonimos: ['cúbito'] },
    { clave: 'Radius', nombre: 'Radio', latin: 'Radius', en: 'Radius' },
    { clave: 'Radial_artery', nombre: 'Arteria radial', latin: 'Arteria radialis', en: 'Radial artery' },
  ],
});

test('normaliza acentos y mayúsculas; distancia con transposiciones', () => {
  assert.equal(normalizar('  Músculos DEL Hombro '), 'musculos del hombro');
  assert.equal(distancia('hombor', 'hombro'), 1);
  assert.equal(distancia('pierna', 'piernas'), 1);
  assert.ok(distancia('radio', 'radial', 1) > 1);
});

test('frases sencillas: «quiero aprender los huesos», «músculos de la pierna», «repasar antebrazo»', () => {
  const huesos = B.buscar('quiero aprender los huesos');
  assert.deepEqual(huesos.materias, [{ sistema: 'oseo' }]);
  assert.ok(huesos.recorridos.some((r) => r.id === 'todos-los-huesos'));
  const pierna = B.buscar('Músculos de la PIERNA');
  assert.deepEqual(pierna.lugares, [{ region: 'miembro-inferior', sub: 'pierna' }]);
  assert.equal(pierna.avisos[0].region, 'miembro-inferior');          // «pierna» en anatomía no es todo el miembro
  const rep = B.buscar('repasar antebrazo');
  assert.equal(rep.intencion, 'repasar');
  assert.equal(rep.lecciones[0].id, 'antebrazo');                    // el módulo del antebrazo, primero
  // y solo lecciones que lo tocan: las de esa subregión o las de todo el miembro superior
  assert.ok(rep.lecciones.every((L) => L.lugares.some(([r, s]) => s === 'antebrazo' || (r === 'miembro-superior' && !s))));
});

test('erratas razonables sí; términos parecidos que existen, no («radio» no pasa a «radial»)', () => {
  const r = B.buscar('musculos del hombor');
  assert.deepEqual(r.correcciones, [['hombor', 'hombro']]);
  assert.equal(r.lecciones[0].id, 'ms-hombro-musculos');
  const radio = B.buscar('radio');
  assert.deepEqual(radio.correcciones, []);
  assert.deepEqual(radio.estructuras.map((e) => e.nombre), ['Radio']);
});

test('estructuras por sinónimo documentado y por nombre en inglés; lecciones por nombre de estructura', () => {
  assert.deepEqual(B.buscar('cúbito').estructuras.map((e) => e.clave), ['Ulna']);
  assert.equal(B.buscar('supraspinatus').lecciones[0].id, 'ms-hombro-musculos');
  assert.equal(B.buscar('manguito rotador').lecciones[0].id, 'ms-hombro-musculos');
  assert.equal(B.buscar('leg muscles').lugares[0].sub, 'pierna');
});

test('cada lección sale la primera al buscar su título; un lugar del título no la excluye («Corazón y circulación»)', () => {
  for (const L of CATALOGO.lecciones) assert.equal(B.buscar(L.titulo).lecciones[0]?.id, L.id, `«${L.titulo}»`);
  assert.deepEqual(B.buscar('corazón').lecciones.map((L) => L.id).sort(), ['sis-cardiovascular', 'tor-corazon']);
  // con un lugar de varias palabras han de estar todas: «miembro inferior» no trae lo del superior por «miembro»
  assert.ok(B.buscar('miembro inferior').lecciones.every((L) => !/superior/.test(L.titulo)));
});

test('sinónimos con fuente en las lecciones: omóplato, gemelos, nuez, muelas, cuerdas vocales', () => {
  for (const [q, id] of [['omóplato', 'ms-cintura-escapular'], ['gemelos', 'mi-pierna-posterior'], ['nuez', 'cue-visceras'], ['muelas', 'cab-boca'], ['cuerdas vocales', 'cue-visceras']]) {
    assert.ok(B.buscar(q).lecciones.some((L) => L.id === id), `${q} → ${id}`);
  }
});

test('sin coincidencias: listas vacías, no se inventa nada', () => {
  const r = B.buscar('xyzzy plumbus');
  assert.equal(r.lecciones.length + r.recorridos.length + r.estructuras.length, 0);
});

// ── Filtros ──
const ctxF = (data = P.vacio()) => ({ estado: (L) => P.estadoLeccion(data, L), favorita: (id) => P.esFavorito(data, id), terminada: () => false });

test('filtros combinables, activos con nombre, quitar uno y ampliar sin borrar', () => {
  const L = CATALOGO.lecciones;
  const f = { ...F.vacios(), region: 'miembro-superior', sistema: 'muscular', nivel: 3 };
  assert.equal(F.filtrar(L, f, ctxF()).length, 0);
  const amp = F.ampliar(L, f, ctxF());
  assert.equal(amp[0].clave, 'nivel');                                // quitar el nivel es lo que más amplía
  assert.ok(amp[0].n >= 2);
  assert.deepEqual(F.activos(f).map((a) => a.clave), ['region', 'sistema', 'nivel']);
  assert.equal(F.quitar({ ...f, subregion: 'hombro' }, 'region').subregion, null);
  const sub = F.filtrar(L, { ...F.vacios(), subregion: 'hombro' }, ctxF());
  assert.ok(sub.some((x) => x.id === 'ms-hombro-musculos'));
  assert.ok(sub.every((x) => x.lugares.some(([r, s]) => s === 'hombro' || (r === 'miembro-superior' && !s))));  // de esa subregión o de todo el miembro
});

test('filtros de progreso, repaso pendiente y favoritas', () => {
  const data = P.vacio();
  P.verPaso(data, HOMBRO, 2, 1000);
  P.alternarFavorito(data, 'brazo');
  P.anotar(data, 'antebrazo/pronadores', 'fallo', 0);
  const L = CATALOGO.lecciones;
  assert.deepEqual(F.filtrar(L, { ...F.vacios(), progreso: 'en-curso' }, ctxF(data)).map((x) => x.id), ['ms-hombro-musculos']);
  assert.deepEqual(F.filtrar(L, { ...F.vacios(), favoritas: true }, ctxF(data)).map((x) => x.id), ['brazo']);
  assert.deepEqual(F.filtrar(L, { ...F.vacios(), repaso: true }, ctxF(data)).map((x) => x.id), ['antebrazo']);
});

// ── Progreso ──
test('progreso v2: guardar y cargar; dañado u otra versión: vacío sin tocar lo guardado', () => {
  const st = memoria();
  const d = P.cargar(st);
  P.verPaso(d, HOMBRO, 1, 5);
  assert.equal(P.guardar(st, d), true);
  assert.deepEqual(P.cargar(st).lecciones['ms-hombro-musculos'].vistos, ['deltoides']);
  assert.deepEqual(P.cargar(memoria({ [P.CLAVE]: '{roto' })), P.vacio());
  const otra = memoria({ [P.CLAVE]: JSON.stringify({ version: 99 }) });
  assert.deepEqual(P.cargar(otra), P.vacio());
  assert.match(otra.datos[P.CLAVE], /"version":99/);
  const bloqueado = { getItem: () => { throw new Error('x'); }, setItem: () => { throw new Error('x'); } };
  assert.deepEqual(P.cargar(bloqueado), P.vacio());
  assert.equal(P.guardar(bloqueado, P.vacio()), false);
});

test('migración desde la versión 1: paso, lección terminada, evaluaciones y cajas; la clave antigua no se toca', () => {
  const v1 = {
    version: 1,
    modulos: {
      brazo: {
        contenido: '2026-11-03', leccion: { paso: 0, completada: true, fecha: 500 },
        intentos: [{ fecha: 600, tipo: 'evaluacion', aciertos: 9, total: 14, fallos: ['surco-radial'] }, { fecha: 700, tipo: 'repaso', aciertos: 2, total: 2, fallos: [] }],
        estructuras: { humero: { caja: 3, aciertos: 3, fallos: 0, dudas: 0, ultimo: 600, proximo: 600 + 7 * DIA }, 'nervio-radial': { caja: 0, aciertos: 0, fallos: 2, dudas: 0, ultimo: 600, proximo: 600 } },
      },
      antebrazo: { contenido: '2026-11-08', leccion: { paso: 2, completada: false, fecha: null }, intentos: [], estructuras: {} },
    },
  };
  const raw = JSON.stringify(v1);
  const st = memoria({ [P.CLAVE_V1]: raw });
  const d = P.cargar(st, { lecciones: LECCIONES, ahora: 1000 });
  assert.equal(d.migracion.desde, 1);
  assert.deepEqual(d.migracion.lecciones, ['brazo', 'antebrazo']);
  const brazo = d.lecciones.brazo;
  assert.equal(brazo.completada, 500);
  assert.equal(brazo.vistos.length, LECCIONES.get('brazo').pasos.length);
  assert.deepEqual(brazo.evaluaciones.map((e) => [e.aciertos, e.total]), [[9, 14]]);
  assert.equal(d.items['brazo/identificar:humero'].caja, 3);
  assert.equal(d.items['brazo/identificar:nervio-radial'].fallos, 2);
  assert.equal(d.lecciones.antebrazo.paso, 2);
  assert.deepEqual(d.lecciones.antebrazo.vistos, LECCIONES.get('antebrazo').pasos.slice(0, 3).map((p) => p.id));
  assert.equal(st.datos[P.CLAVE_V1], raw);                            // la clave antigua sigue igual
  // Los ítems migrados son preguntas que existen en la lección de la biblioteca.
  assert.ok(preguntaDeItem(LECCIONES, 'brazo/identificar:humero', { rng: rngConSemilla(2) }));
  // Una vez guardado el formato nuevo, ya no se vuelve a migrar.
  P.guardar(st, d);
  P.verPaso(d, HOMBRO, 0, 2000);
  P.guardar(st, d);
  assert.ok(P.cargar(st, { lecciones: LECCIONES }).lecciones['ms-hombro-musculos']);
});

test('repaso espaciado: un acierto sube de caja solo si tocaba; un fallo vuelve a 0; la duda se queda', () => {
  const d = P.vacio();
  const id = 'x/p';
  P.anotar(d, id, 'acierto', 0);                 // caja 1, vence en 1 día
  P.anotar(d, id, 'acierto', 10);                // no tocaba: sigue en 1
  assert.equal(d.items[id].caja, 1);
  assert.equal(d.items[id].proximo, DIA);
  P.anotar(d, id, 'acierto', DIA);               // ya tocaba: caja 2
  assert.equal(d.items[id].caja, 2);
  P.anotar(d, id, 'duda', 5 * DIA);
  assert.equal(d.items[id].caja, 2);
  P.anotar(d, id, 'fallo', 6 * DIA);
  assert.equal(d.items[id].caja, 0);
  assert.equal(d.items[id].proximo, 6 * DIA);
});

test('estado de una lección: avance, terminada, aprendizaje demostrado y dominio, por separado', () => {
  const d = P.vacio();
  const L = HOMBRO;
  assert.equal(P.estadoLeccion(d, L).estado, 'sin-empezar');
  P.verPaso(d, L, 0);
  assert.equal(P.estadoLeccion(d, L).estado, 'en-curso');
  P.completar(d, L);
  assert.equal(P.estadoLeccion(d, L).estado, 'completada');
  const obj = L.objetivos.map(() => [1, 1]);
  assert.equal(P.registrarEvaluacion(d, L, { aciertos: 7, total: 10, porObjetivo: obj }), false);   // 70 %: no basta
  assert.equal(P.registrarEvaluacion(d, L, { aciertos: 9, total: 10, porObjetivo: [[0, 1], ...obj.slice(1)] }), false);  // un objetivo sin acierto
  assert.equal(P.registrarEvaluacion(d, L, { aciertos: 9, total: 10, porObjetivo: obj }), true);
  assert.equal(P.estadoLeccion(d, L).estado, 'demostrada');
  for (const q of L.preguntas) d.items[P.itemId(L.id, q.id)] = { caja: 3, aciertos: 3, fallos: 0, dudas: 0, ultimo: 0, proximo: 7 * DIA };
  assert.equal(P.estadoLeccion(d, L, { ahora: 0 }).estado, 'dominada');
});

// ── Preguntas ──
test('identificar: cuatro opciones distintas del mismo tipo y una correcta, en todas las lecciones', () => {
  const rng = rngConSemilla(4);
  for (const L of LECCIONES.values()) {
    for (const q of L.preguntas.filter((x) => x.tipo === 'identificar')) {
      const p = instanciar(L, q, rng);
      assert.equal(new Set(p.opciones.map((o) => o.texto)).size, 4, `${L.id}/${q.id}`);
      assert.equal(p.opciones.filter((o) => o.correcta).length, 1, `${L.id}/${q.id}`);
    }
  }
});

test('la comprobación de un paso es siempre una pregunta de opciones con enunciado (lo que sabe mostrar el paso)', () => {
  const rng = rngConSemilla(7);
  for (const L of LECCIONES.values()) {
    for (const s of L.pasos.filter((x) => x.comprobar)) {
      const q = L.preguntas.find((x) => x.id === s.comprobar);
      assert.ok(q, `${L.id}/${s.id}`);
      const p = instanciar(L, q, rng);
      assert.ok(p.enunciado && p.opciones?.length === 4, `${L.id}/${s.id}: ${q.tipo}`);
    }
  }
  // Y el validador rechaza las demás: identificar, localizar y ordenar necesitan su propia interfaz.
  const L = LECCIONES.get('ms-nervios');
  const mala = { ...L, pasos: L.pasos.map((s, i) => (i === 1 ? { ...s, comprobar: 'id-radial' } : s)) };
  assert.ok(revisarLeccion(mala).some((e) => e.nivel === 'error' && e.texto.includes('solo admite preguntas de texto')));
});

test('evaluación de una lección: cubre todos los objetivos, sin repetir, y la mitad como mucho de identificación', () => {
  for (const L of LECCIONES.values()) {
    const ev = evaluacionDe(L, { rng: rngConSemilla(9), max: 10, modelo: L.modelos[0] });   // en un modelo donde existe
    assert.equal(new Set(ev.map((q) => q.id)).size, ev.length, L.id);
    const objs = new Set(ev.map((q) => q.objetivo));
    L.objetivos.forEach((_, i) => { if (L.preguntas.some((q) => q.objetivo === i)) assert.ok(objs.has(i), `${L.id}: objetivo ${i}`); });
    assert.ok(ev.filter((q) => q.tipo === 'identificar').length <= Math.max(5, L.objetivos.length), L.id);
  }
});

test('corregir: opción, «No lo sé», localizar y secuencia', () => {
  const q = instanciar(HOMBRO, HOMBRO.preguntas.find((x) => x.tipo === 'funcion'), rngConSemilla(1));
  assert.equal(corregir(q, q.opciones.findIndex((o) => o.correcta)), 'acierto');
  assert.equal(corregir(q, q.opciones.findIndex((o) => o.correcta), { dude: true }), 'duda');
  assert.equal(corregir(q, q.opciones.findIndex((o) => !o.correcta)), 'fallo');
  assert.equal(corregir(q, NO_LO_SE), 'fallo');
  const loc = instanciar(HOMBRO, HOMBRO.preguntas.find((x) => x.tipo === 'localizar'), rngConSemilla(1));
  assert.equal(corregir(loc, 'deltoides'), 'acierto');
  assert.equal(corregir(loc, 'supraespinoso'), 'fallo');
  const sec = instanciar({ id: 'l', estructuras: {}, modelos: ['male'] }, { id: 's', tipo: 'secuencia', objetivo: 0, paso: 'a', enunciado: 'x', orden: ['a', 'b', 'c', 'd'], explicacion: 'x' }, rngConSemilla(3));
  assert.notDeepEqual(sec.elementos, ['a', 'b', 'c', 'd']);
  assert.equal(corregir(sec, ['a', 'b', 'c', 'd']), 'acierto');
  assert.equal(corregir(sec, ['b', 'a', 'c', 'd']), 'fallo');
});

test('nunca se pregunta lo imposible: una estructura que solo existe en el otro modelo no entra', () => {
  const L = structuredClone(HOMBRO);
  L.estructuras.supraespinoso.modelos = ['female'];
  const q = L.preguntas.find((x) => x.id === 'id-supraespinoso');
  assert.equal(disponibleEn(L, q, 'male'), false);
  assert.equal(disponibleEn(L, q, 'female'), true);
  const ev = evaluacionDe(L, { modelo: 'male', rng: rngConSemilla(1), max: 20 });
  assert.ok(!ev.some((p) => p.id === 'id-supraespinoso'));
});

test('aciertos por objetivo', () => {
  const qs = HOMBRO.preguntas.slice(0, 3).map((q) => instanciar(HOMBRO, q, rngConSemilla(1)));
  const po = porObjetivo(HOMBRO, [{ pregunta: qs[0], resultado: 'acierto' }, { pregunta: qs[1], resultado: 'fallo' }, { pregunta: qs[2], resultado: 'duda' }]);
  assert.deepEqual(po[0], [2, 3]);
});

// ── Sesiones ──
test('sesión según el tiempo: primero el repaso vencido (sin comerse todo el tiempo), luego la lección empezada y las siguientes', () => {
  const d = P.vacio();
  for (let i = 0; i < 30; i++) P.anotar(d, `brazo/p${i}`, 'fallo', 0);
  P.verPaso(d, HOMBRO, 3, 0);
  const s = proponer({ minutos: 20, catalogo: CATALOGO.lecciones, data: d, ahora: 1 });
  assert.equal(s[0].tipo, 'repaso');
  assert.ok(s[0].minutos <= 8);
  assert.deepEqual(s[1], { tipo: 'leccion', id: 'ms-hombro-musculos', motivo: 'seguir', minutos: s[1].minutos });
  assert.ok(s.reduce((n, b) => n + b.minutos, 0) <= 22);
  const sinNada = proponer({ minutos: 10, catalogo: CATALOGO.lecciones, data: P.vacio() });
  assert.ok(sinNada.every((b) => b.tipo === 'leccion' && b.motivo === 'siguiente'));
});

test('prácticas: errores primero lo que sigue en caja 0; por lecciones solo esas', () => {
  const d = P.vacio();
  P.anotar(d, 'brazo/a', 'fallo', 0);
  P.anotar(d, 'brazo/b', 'acierto', 0);
  P.anotar(d, 'antebrazo/c', 'fallo', 0);
  P.anotar(d, 'antebrazo/c', 'acierto', 0);
  assert.deepEqual(itemsDePractica(d, 'errores'), ['brazo/a', 'antebrazo/c']);
  assert.deepEqual(itemsDePractica(d, 'region', { lecciones: ['antebrazo'] }), ['antebrazo/c']);
});

test('las frases de los módulos antiguos se leen como una sola frase con sus fuentes', () => {
  const L = LECCIONES.get('brazo');
  assert.equal(frases(L.pasos[0].texto).length, 1);
  assert.ok(L.pasos[0].texto[0].slice(1).every((e) => e.m));
});
