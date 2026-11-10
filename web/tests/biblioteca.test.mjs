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
import { proponer, itemsDePractica, alternativaDe, sinRepetirRecientes } from '../src/biblioteca/sesion.js';
import { calcularMapa, cuando } from '../src/biblioteca/mapa.js';
import { revisarLeccion, todasLasEvidencias, frases, estructurasDePregunta } from '../src/biblioteca/formato.js';
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
test('progreso v2: guardar y cargar; dañado u otra versión: vacío, y lo guardado se aparta antes de escribir encima', () => {
  const st = memoria();
  const d = P.cargar(st);
  P.verPaso(d, HOMBRO, 1, 5);
  assert.equal(P.guardar(st, d), true);
  assert.deepEqual(P.cargar(st).lecciones['ms-hombro-musculos'].vistos, ['deltoides']);
  const roto = memoria({ [P.CLAVE]: '{roto' });
  const dr = P.cargar(roto, { ahora: 77 });
  assert.deepEqual({ ...dr, apartado: undefined }, { ...P.vacio(), apartado: undefined });
  assert.equal(dr.apartado, 77);
  assert.deepEqual(JSON.parse(roto.datos[P.CLAVE_APARTADO]), { texto: '{roto', fecha: 77 });
  assert.equal(P.guardar(roto, dr), true, 'ya está a salvo: se puede escribir');
  const otra = memoria({ [P.CLAVE]: JSON.stringify({ version: 99 }) });
  const d99 = P.cargar(otra);
  assert.deepEqual(d99.lecciones, {});
  assert.match(otra.datos[P.CLAVE], /"version":99/, 'cargar no toca lo guardado');
  assert.match(JSON.parse(otra.datos[P.CLAVE_APARTADO]).texto, /"version":99/);
  // Si no se puede apartar, no se escribe encima.
  const sinApartar = memoria({ [P.CLAVE]: '{roto' });
  sinApartar.setItem = () => { throw new Error('lleno'); };
  const ds = P.cargar(sinApartar);
  assert.equal(ds.sinApartar, true);
  assert.equal(P.guardar(sinApartar, ds), false);
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

test('filtros nuevos: tipo de estructura (del núcleo), idioma y procedencia; solo se ofrecen los que dan algo', () => {
  const L = CATALOGO.lecciones;
  const ctx = { estado: () => ({ estado: 'sin-empezar', pendientes: 0 }), favorita: () => false };
  const huesos = F.filtrar(L, { ...F.vacios(), estructura: 'huesos' }, ctx);
  assert.ok(huesos.length > 5 && huesos.every((x) => x.estructuras.some((e) => e.papel === 'nucleo' && ['hueso', 'diente', 'cartilago'].includes(e.tipo))));
  assert.ok(!huesos.some((x) => x.id === 'ms-hombro-musculos'), 'el hombro (músculos) no tiene huesos en su núcleo');
  const ingles = F.filtrar(L, { ...F.vacios(), idioma: 'en' }, ctx);
  assert.deepEqual(ingles.map((x) => x.id).sort(), ['antebrazo', 'brazo']);
  const propia = { ...L[0], id: 'neuri-x-0000', propia: true };
  assert.deepEqual(F.filtrar([...L, propia], { ...F.vacios(), procedencia: 'propias' }, ctx).map((x) => x.id), ['neuri-x-0000']);
  assert.equal(F.filtrar([...L, propia], { ...F.vacios(), procedencia: 'biblioteca' }, ctx).length, L.length);
  assert.deepEqual(F.valoresPresentes(L, 'procedencia'), ['biblioteca'], 'sin lecciones propias, el filtro no se ofrece');
  assert.deepEqual(F.valoresPresentes(L, 'idioma').sort(), ['de', 'en', 'es', 'fr', 'it']);
  assert.ok(F.valoresPresentes(L, 'estructura').includes('nervios'));
  const act = F.activos({ ...F.vacios(), estructura: 'huesos', idioma: 'en', procedencia: 'propias' }, (k) => `T:${k}`, (id) => `I:${id}`);
  assert.deepEqual(act.map((a) => [a.clave, a.nombre]), [['estructura', 'T:filtro.grupo.huesos'], ['idioma', 'I:en'], ['procedencia', 'T:filtro.proc.propias']]);
});

test('intentos: fecha, versión, tarea, habilidad, objetivo, estructura y lo elegido al fallar; los técnicos no cuentan', () => {
  const d = P.vacio();
  const i = P.registrarIntento(d, { leccion: 'brazo', version: 'v3', pregunta: 'identificar:humero', tipo: 'identificar', objetivo: 0, estructura: 'humero', resultado: 'fallo', elegida: 'Radio', modo: 'evaluacion' }, 100);
  assert.deepEqual(i, { f: 100, l: 'brazo', v: 'v3', q: 'identificar:humero', t: 'identificar', h: 'reconocer', o: 0, e: 'humero', r: 'fallo', x: 'Radio', d: false, m: 'evaluacion' });
  assert.equal(P.registrarIntento(d, { leccion: 'brazo', pregunta: 'f1', tipo: 'funcion', resultado: 'acierto', elegida: 'X' }, 101).x, null, 'lo elegido solo se guarda al fallar');
  for (let k = 0; k < P.MAX_INTENTOS + 5; k++) P.registrarIntento(d, { leccion: 'brazo', pregunta: 'f', tipo: 'funcion', resultado: 'acierto' }, 200 + k);
  assert.equal(d.intentos.length, P.MAX_INTENTOS);
  // Guardar y cargar conserva intentos y preferencias (campos nuevos de la versión 2).
  const st = memoria();
  d.preferencias = P.limpiarPreferencias({ nivel: 2, minutos: 20, intereses: ['cabeza', 'nervioso', 'MAL id'] });
  P.guardar(st, d);
  const c = P.cargar(st);
  assert.equal(c.intentos.length, P.MAX_INTENTOS);
  assert.deepEqual(c.preferencias, { nivel: 2, minutos: 20, intereses: ['cabeza', 'nervioso'] });
  assert.equal(P.limpiarPreferencias({ nivel: 9, minutos: 7, intereses: [] }), null);
});

test('aplazar y retomar repasos sin perder cuándo tocaban; lo recién fallado no se repite tal cual', () => {
  const d = P.vacio();
  P.anotar(d, 'brazo/a', 'fallo', 0);
  P.anotar(d, 'brazo/b', 'fallo', 0);
  assert.deepEqual(P.vencidas(d, { ahora: 10 }), ['brazo/a', 'brazo/b']);
  const r = P.aplazar(d, ['brazo/a'], 1, 10);
  assert.deepEqual(r, { n: 1, hasta: 10 + DIA });
  assert.deepEqual(P.vencidas(d, { ahora: 20 }), ['brazo/b'], 'lo aplazado no se propone');
  assert.deepEqual(P.falladas(d, { ahora: 20 }), ['brazo/b']);
  assert.deepEqual(P.vencidas(d, { ahora: 20 + DIA }), ['brazo/a', 'brazo/b'], 'pasado el plazo, vuelve');
  assert.deepEqual(P.aplazados(d, 20).map((x) => x.id), ['brazo/a']);
  assert.equal(P.retomar(d, null, 20), 1);
  assert.deepEqual(P.vencidas(d, { ahora: 20 }), ['brazo/a', 'brazo/b']);
  assert.equal(d.items['brazo/a'].proximo, 0, 'cuándo tocaba no cambia');
  // Recién fallada: otra pregunta sobre lo mismo (de otro tipo si la hay), o se deja para luego.
  const B = LECCIONES.get('brazo');
  const q = B.preguntas.find((x) => x.tipo === 'identificar' && B.preguntas.some((y) => y !== x && (y.estructura === x.estructura || estructurasDePregunta(y).includes(x.estructura))));
  const id = P.itemId(B.id, q.id);
  const e = P.vacio();
  P.anotar(e, id, 'fallo', 1000);
  P.registrarIntento(e, { leccion: B.id, pregunta: q.id, tipo: q.tipo, estructura: q.estructura, resultado: 'fallo' }, 1000);
  assert.equal(P.recienFallada(e, id, 1000 + 60_000), true);
  assert.equal(P.recienFallada(e, id, 1000 + P.RECIENTE_MS + 1), false);
  const alt = alternativaDe(B, q.id, { data: e, ahora: 2000 });
  const qa = B.preguntas.find((x) => P.itemId(B.id, x.id) === alt);
  assert.ok(qa && qa.id !== q.id && (qa.estructura === q.estructura || estructurasDePregunta(qa).includes(q.estructura)));
  assert.notEqual(qa.tipo, 'identificar', 'mejor otro tipo de tarea');
  const r2 = sinRepetirRecientes([id], { data: e, lecciones: LECCIONES, ahora: 2000 });
  assert.deepEqual(r2, { items: [alt], esperan: 0 });
  const sinOtra = { ...B, preguntas: [q] };
  const r3 = sinRepetirRecientes([id], { data: e, lecciones: new Map([[B.id, sinOtra]]), ahora: 2000 });
  assert.deepEqual(r3, { items: [], esperan: 1 });
  assert.deepEqual(sinRepetirRecientes([id], { data: e, lecciones: LECCIONES, ahora: 1000 + P.RECIENTE_MS + 1 }).items, [id], 'pasado un rato, ya se puede repetir');
});

test('mapa de aprendizaje: habilidades (sin datos, practicando, demostrada, consolidada), lecciones y dificultades con su motivo', () => {
  const d = P.vacio();
  const ahora = 50 * DIA;
  const cat = CATALOGO.lecciones;
  let m = calcularMapa(d, { catalogo: cat, ahora });
  assert.ok(m.habilidades.every((h) => h.estado === 'sin-datos'));
  assert.deepEqual(m.lecciones, { visitadas: 0, completadas: 0, demostradas: 0, dominadas: 0 });
  // Reconocer: 4 bien de 5 en los últimos → demostrada; con 3 preguntas consolidadas por el repaso → consolidada.
  const reg = (q, r, f, extra = {}) => P.registrarIntento(d, { leccion: 'brazo', pregunta: q, tipo: 'identificar', estructura: q, resultado: r, modo: 'repaso', elegida: r === 'fallo' ? 'Radio' : null, ...extra }, f);
  ['a', 'b', 'c', 'd'].forEach((q, k) => reg(q, 'acierto', ahora - 5 * DIA + k));
  reg('e', 'fallo', ahora - DIA);
  m = calcularMapa(d, { catalogo: cat, ahora });
  assert.equal(m.habilidades.find((h) => h.id === 'reconocer').estado, 'demostrada');
  for (const q of ['a', 'b', 'c']) d.items[`brazo/${q}`] = { caja: 3, aciertos: 3, fallos: 0, dudas: 0, ultimo: 1, proximo: ahora + DIA };
  d.items['brazo/e'] = { caja: 0, aciertos: 0, fallos: 1, dudas: 0, ultimo: ahora - DIA, proximo: ahora - DIA };
  m = calcularMapa(d, { catalogo: cat, ahora });
  assert.equal(m.habilidades.find((h) => h.id === 'reconocer').estado, 'consolidada');
  assert.equal(m.habilidades.find((h) => h.id === 'explicar').estado, 'sin-datos', 'lo no comprobado no se da por sabido');
  // Una sola respuesta bien no basta.
  const otra = P.vacio();
  P.registrarIntento(otra, { leccion: 'brazo', pregunta: 'x', tipo: 'funcion', resultado: 'acierto', modo: 'evaluacion' }, ahora);
  assert.equal(calcularMapa(otra, { catalogo: cat, ahora }).habilidades.find((h) => h.id === 'explicar').estado, 'practicando');
  // Las comprobaciones dentro de la lección y lo técnico no cuentan; lo de lecciones que ya no existen, tampoco.
  P.registrarIntento(d, { leccion: 'brazo', pregunta: 'z', tipo: 'comparacion', resultado: 'fallo', modo: 'leccion' }, ahora);
  P.registrarIntento(d, { leccion: 'brazo', pregunta: 'y', tipo: 'localizar', resultado: 'tecnico', modo: 'evaluacion' }, ahora);
  P.registrarIntento(d, { leccion: 'no-existe', pregunta: 'w', tipo: 'localizar', resultado: 'fallo', modo: 'evaluacion' }, ahora);
  m = calcularMapa(d, { catalogo: cat, ahora });
  assert.equal(m.habilidades.find((h) => h.id === 'comparar').estado, 'sin-datos');
  assert.equal(m.habilidades.find((h) => h.id === 'localizar').estado, 'sin-datos');
  assert.equal(m.tecnicos, 1);
  // Dificultades: lo fallado sin consolidar, con lo que se eligió (el motivo) y si está aplazado.
  assert.deepEqual(m.dificultades.map((x) => [x.item, x.motivo, x.elegida]), [['brazo/e', 'confusion', 'Radio']]);
  P.aplazar(d, ['brazo/e'], 2, ahora);
  assert.equal(calcularMapa(d, { catalogo: cat, ahora }).dificultades[0].aplazado, ahora + 2 * DIA);
  assert.equal(calcularMapa(d, { catalogo: cat, ahora }).repasos.aplazados.length, 1);
  // Cuándo: hoy, ayer o un día (por el calendario local).
  const hoy = new Date(2026, 10, 9, 10).getTime();
  assert.deepEqual([cuando(hoy - 3600e3, hoy), cuando(new Date(2026, 10, 8, 23).getTime(), hoy), cuando(new Date(2026, 10, 5).getTime(), hoy)], ['hoy', 'ayer', 'dia']);
});

test('sesión con preferencias: primero lo de sus intereses y lo más cercano a su nivel', () => {
  const d = P.vacio();
  const sin = proponer({ minutos: 45, catalogo: CATALOGO.lecciones, data: d, ahora: 1 });
  d.preferencias = P.limpiarPreferencias({ intereses: ['miembro-inferior'], nivel: 1 });
  const con = proponer({ minutos: 45, catalogo: CATALOGO.lecciones, data: d, ahora: 1 });
  const lugar = (id) => CATALOGO.lecciones.find((L) => L.id === id).lugares.map(([r]) => r);
  assert.ok(lugar(con.find((b) => b.tipo === 'leccion').id).includes('miembro-inferior') || !CATALOGO.lecciones.some((L) => L.lugares.some(([r]) => r === 'miembro-inferior') && !(L.requisitos ?? []).length));
  assert.notDeepEqual(sin, con);
});

test('las frases de los módulos antiguos se leen como una sola frase con sus fuentes', () => {
  const L = LECCIONES.get('brazo');
  assert.equal(frases(L.pasos[0].texto).length, 1);
  assert.ok(L.pasos[0].texto[0].slice(1).every((e) => e.m));
});
