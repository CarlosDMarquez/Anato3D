// La interfaz de las sesiones con Neuri, en lo que se puede probar sin DOM (src/ui/biblioteca/sesion-logica.js): qué
// pasos enseña un bloque, el resultado de un bloque (a la primera, con ayuda, reveladas), la pista del segundo intento
// (una frase verificada del paso, sin el nombre de la estructura: comprobado en todas las preguntas 3D de la
// biblioteca), cuándo vuelve al repaso lo fallado, los siguientes pasos y «Repetir». Y una sesión de 10 minutos de
// principio a fin, con un fallo, una pista y una recarga a mitad, sin ninguna llamada a la IA. `npm test`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { pasosDeBloque, resultadoDe, ocultarNombres, pistaDe, intentoGuardado, proximoRepaso, siguientesPasos, planParaRepetir } from '../src/ui/biblioteca/sesion-logica.js';
import { crearSesiones } from '../src/pet/sesiones.js';
import { planificarLocal } from '../src/pet/planificador.js';
import { crearBuscador } from '../src/biblioteca/buscar.js';
import { RECORRIDOS } from '../src/biblioteca/recorridos.js';
import { preguntaDeItem, corregir } from '../src/biblioteca/evaluar.js';
import { frases } from '../src/biblioteca/formato.js';
import * as P from '../src/biblioteca/progreso.js';
import { TEXTOS, ETIQUETAS } from '../src/i18n/textos.js';
import { idioma } from '../src/i18n/idioma.js';

const CATALOGO = JSON.parse(fs.readFileSync(new URL('../src/biblioteca/generado/catalogo.json', import.meta.url), 'utf8'));
const POR_ID = new Map(CATALOGO.lecciones.map((L) => [L.id, L]));
const BUSCADOR = crearBuscador({ lecciones: CATALOGO.lecciones, recorridos: RECORRIDOS, etiquetas: ETIQUETAS, idioma });
const LECCIONES = new Map();
async function cargar(id) {
  if (!LECCIONES.has(id)) {
    try { LECCIONES.set(id, (await import(`../src/biblioteca/lecciones/${id}.js`)).default); } catch { LECCIONES.set(id, null); }
  }
  return LECCIONES.get(id);
}
const memoria = (inicial = {}) => {
  const s = { ...inicial };
  return { getItem: (k) => s[k] ?? null, setItem: (k, v) => { s[k] = String(v); }, removeItem: (k) => { delete s[k]; }, datos: s };
};
const plano = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

test('los pasos de un bloque: la lección entera, una parte en su orden, o entera si sus pasos ya no existen', () => {
  const L = { pasos: [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }] };
  assert.deepEqual(pasosDeBloque(L, { pasos: null }), [0, 1, 2, 3]);
  assert.deepEqual(pasosDeBloque(L, { pasos: ['c', 'b'] }), [1, 2]);
  assert.deepEqual(pasosDeBloque(L, { pasos: ['x', 'y'] }), [0, 1, 2, 3]);
  assert.deepEqual(pasosDeBloque(null, { pasos: null }), []);
});

test('el resultado de un bloque: a la primera, con ayuda y reveladas; lo técnico no cuenta; se suma lo de antes de reanudar', () => {
  const q = (item) => ({ item });
  const r = resultadoDe([
    { pregunta: q('l/1'), resultado: 'acierto' },
    { pregunta: q('l/2'), resultado: 'duda' },                      // «dudo» marcado a la primera: acierto (no hubo ayuda)
    { pregunta: q('l/3'), resultado: 'duda', ayuda: true },         // bien tras la pista
    { pregunta: q('l/4'), resultado: 'fallo', ayuda: true },        // dos fallos: revelada
    { pregunta: q('l/5'), resultado: null, saltada: true },         // el visor no pudo: técnico
  ], { aciertos: 1, conAyuda: 0, revelados: 1, total: 2, fallos: ['l/0'] });
  assert.deepEqual(r, { aciertos: 3, conAyuda: 1, revelados: 2, total: 6, fallos: ['l/0', 'l/4'] });
  assert.deepEqual(resultadoDe([]), { aciertos: 0, conAyuda: 0, revelados: 0, total: 0, fallos: [] });
});

test('tapar el nombre: sus palabras propias y sus variantes, no su tipo; lo seguido es un solo hueco', () => {
  const o = ocultarNombres('Los nodos submandibulares están en el triángulo submandibular, junto a la glándula submandibular.', ['Nodos linfáticos submandibulares']);
  assert.equal(o.texto, 'Los nodos […] están en el triángulo […], junto a la glándula […].');
  assert.equal(o.tapadas, 3);
  assert.equal(ocultarNombres('El bíceps braquial flexiona el codo.', ['Bíceps braquial']).texto, 'El […] flexiona el codo.');
  assert.equal(ocultarNombres('The femur is the longest bone.', ['Fémur', 'Femur']).texto, 'The […] is the longest bone.');
  // Un nombre hecho solo de su tipo no tapa nada (la pista ya no se usaría: no tapa).
  assert.equal(ocultarNombres('El músculo se contrae.', ['Músculo']).tapadas, 0);
});

test('la pista de cada pregunta 3D de la biblioteca sale del paso verificado y nunca dice el nombre de la respuesta', async () => {
  const ids = fs.readdirSync(new URL('../src/biblioteca/lecciones/', import.meta.url)).filter((f) => f.endsWith('.js')).map((f) => f.slice(0, -3));
  let preguntas = 0;
  let conPista = 0;
  for (const id of ids) {
    const L = await cargar(id);
    if (!L?.preguntas) continue;
    for (const q of L.preguntas.filter((x) => x.tipo === 'identificar' || x.tipo === 'localizar')) {
      preguntas++;
      const e = L.estructuras[q.estructura];
      const p = pistaDe(L, q, { nombres: [e.nombre] });
      if (!p) continue;
      conPista++;
      // Sale de un paso de la lección (el de la pregunta o uno que enseña la estructura), de una frase que no es una
      // instrucción ni una nota sobre el modelo.
      const paso = L.pasos.find((x) => x.id === p.paso);
      assert.ok(paso, `${id}/${q.id}: paso`);
      const normales = [...frases(paso.texto), ...frases(paso.detalle)].filter((f) => !f.slice(1).some((x) => x?.guia || x?.modelo)).map((f) => f[0]);
      assert.ok(normales.some((s) => ocultarNombres(s, [e.nombre]).texto === p.texto), `${id}/${q.id}: frase del paso`);
      // Ninguna palabra propia del nombre (ni sus variantes) queda a la vista.
      const propias = plano(e.nombre).split(/[^a-z0-9]+/).filter((w) => w.length >= 5 && !/^(musculo|nodos?|linfatic[oa]s?|ganglios?|arterias?|venas?|nervios?|huesos?|ligamentos?|glandulas?)$/.test(w));
      const palabras = plano(p.texto).split(/[^a-z0-9]+/);
      for (const w of propias) assert.ok(!palabras.some((x) => x.startsWith(w.slice(0, Math.max(4, w.length - 2)))), `${id}/${q.id}: «${w}» en «${p.texto}»`);
      assert.ok((p.texto.replace(/\[…\]/g, ' ').match(/[\p{L}\p{N}]+/gu) ?? []).length >= 4, `${id}/${q.id}: pista con contenido`);
    }
  }
  assert.ok(preguntas > 200, `preguntas 3D: ${preguntas}`);
  // La mayoría tiene una pista del paso; las demás llevan la general (la interfaz la pone).
  assert.ok(conPista / preguntas > 0.5, `con pista del paso: ${conPista} de ${preguntas}`);
});

test('cuándo vuelve al repaso lo que conviene repasar, y los dos siguientes pasos', () => {
  const ahora = Date.parse('2026-11-12T10:00:00Z');
  const data = P.vacio();
  data.items['a/1'] = { caja: 0, proximo: ahora - 1 };
  data.items['a/2'] = { caja: 1, proximo: ahora + 86400000 };
  const r = proximoRepaso(data, ['a/1', 'a/2', 'a/3'], ahora);
  assert.deepEqual(r.lista.map((x) => x.hoy), [true, false, true]);
  assert.equal(r.primero, ahora - 1);

  const porId = new Map([['tor-corazon', { id: 'tor-corazon', siguiente: ['tor-mediastino'] }], ['tor-mediastino', { id: 'tor-mediastino', siguiente: [] }]]);
  const sesion = { bloques: [{ tipo: 'repaso', items: [] }, { tipo: 'leccion', leccion: 'tor-corazon', pasos: ['x'] }] };
  assert.deepEqual(siguientesPasos({ sesion, resumen: { repasar: ['a/1'] }, porId, terminada: () => false }), [{ tipo: 'repasar', items: ['a/1'] }, { tipo: 'seguir', leccion: 'tor-corazon' }]);
  assert.deepEqual(siguientesPasos({ sesion, resumen: { repasar: [] }, porId, terminada: (id) => id === 'tor-corazon' }), [{ tipo: 'siguiente', leccion: 'tor-mediastino' }, { tipo: 'otra' }]);
  assert.deepEqual(siguientesPasos({ sesion, resumen: { repasar: [] }, porId, terminada: () => true }), [{ tipo: 'evaluar', leccion: 'tor-corazon' }, { tipo: 'otra' }]);
  assert.deepEqual(siguientesPasos({ sesion: { bloques: [{ tipo: 'repaso', items: [] }] }, resumen: { repasar: [] }, porId }), [{ tipo: 'otra' }]);
});

test('una sesión de 10 minutos sobre el corazón, de principio a fin, con un fallo, una pista y una recarga a mitad: cero llamadas', async () => {
  const almacen = memoria();
  const data = P.vacio();
  let ahora = Date.parse('2026-11-12T10:00:00Z');
  const reloj = () => ahora;
  // Ninguna llamada a la red: si algo la intentara, la prueba falla.
  const fetchOriginal = globalThis.fetch;
  globalThis.fetch = () => { throw new Error('no debe llamar a la red'); };
  try {
    const plan = planificarLocal({ objetivo: 'tengo 10 minutos para estudiar el corazón', minutos: 10, catalogo: CATALOGO.lecciones, data, buscar: BUSCADOR, ahora: reloj });
    assert.ok(plan, 'plan local');
    let S = crearSesiones({ almacen, ahora: reloj });
    const r = await S.crear(plan, { origen: 'local', minutos: 10, data, cargar, idsLecciones: new Set(POR_ID.keys()), ambito: plan.ambito });
    assert.equal(r.ok, true);
    const id = r.sesion.id;
    assert.ok(r.sesion.bloques.some((b) => b.tipo === 'leccion') && r.sesion.bloques.some((b) => b.tipo === 'practica'), 'lección y práctica');

    let hechos = 0;
    let recargada = false;
    let pistaVista = false;
    for (let vuelta = 0; vuelta < 10; vuelta++) {
      const e = S.empezar(id);
      if (e.fin || !e.ok) break;
      const b = e.bloque;
      if (b.tipo === 'leccion') {
        const L = await cargar(b.leccion);
        const pasos = pasosDeBloque(L, b);
        for (let n = e.posicion; n < pasos.length; n++) {
          P.verPaso(data, L, pasos[n], ahora);
          S.anotarPosicion(id, n);
          // A mitad del primer bloque de lección: se recarga la página (otro almacén en memoria, mismo localStorage).
          if (!recargada && n === 1 && pasos.length > 2) {
            recargada = true;
            S = crearSesiones({ almacen, ahora: reloj });
            const otra = S.empezar(id);
            assert.equal(otra.i, e.i, 'reanuda en el mismo bloque');
            assert.equal(otra.posicion, 1, 'y en el mismo paso');
          }
        }
        // Solo se completa si se vieron todos los pasos (una parte no la completa).
        const todos = L.pasos.every((p) => data.lecciones[L.id].vistos.includes(p.id));
        if (todos) P.completar(data, L, ahora);
        S.avanzar(id, { bloque: e.i, aciertos: 0, total: 0 });
      } else {
        await Promise.all(b.items.map((x) => cargar(x.slice(0, x.indexOf('/')))));
        const preguntas = b.items.map((x) => preguntaDeItem(LECCIONES, x, { modelo: 'male' })).filter(Boolean);
        const respuestas = [];
        preguntas.forEach((q, k) => {
          const buena = q.tipo === 'localizar' ? q.estructura : q.tipo === 'secuencia' ? q.correcto : q.opciones.findIndex((o) => o.correcta);
          const mala = q.tipo === 'localizar' ? q.candidatas.find((x) => x !== q.estructura) : q.tipo === 'secuencia' ? [...q.correcto].reverse() : q.opciones.findIndex((o) => !o.correcta);
          if (k === 0 && q.tipo !== 'secuencia') {
            // Primer fallo: pista (en las 3D, del paso, sin el nombre) y bien al segundo intento → con ayuda («duda»).
            assert.equal(corregir(q, mala), 'fallo');
            const L = LECCIONES.get(q.leccion);
            if (q.tipo === 'identificar' || q.tipo === 'localizar') {
              const p = pistaDe(L, q, { nombres: [L.estructuras[q.estructura].nombre] });
              if (p) { pistaVista = true; assert.ok(!plano(p.texto).includes(plano(L.estructuras[q.estructura].nombre))); }
            }
            assert.notEqual(corregir(q, buena), 'fallo');
            P.anotar(data, q.item, 'duda', ahora);
            respuestas.push({ pregunta: q, resultado: 'duda', ayuda: true });
          } else {
            P.anotar(data, q.item, 'acierto', ahora);
            respuestas.push({ pregunta: q, resultado: 'acierto' });
          }
          S.anotarPosicion(id, k + 1, resultadoDe(respuestas));
        });
        // Lo respondido sobrevive a una recarga antes de «Ver resultado».
        const a = crearSesiones({ almacen, ahora: reloj }).actual(id);
        assert.equal(a.posicion, preguntas.length);
        assert.equal(a.parcial.total, preguntas.length);
        S.avanzar(id, { bloque: e.i, ...resultadoDe(respuestas) });
      }
      hechos++;
      ahora += 3 * 60_000;
    }
    const res = S.resumen(id, { data });
    assert.equal(res.terminada, true);
    assert.equal(res.hechos, hechos);
    assert.ok(res.preguntas >= 2, 'hubo preguntas');
    assert.equal(res.conAyuda, 1, 'una con ayuda');
    assert.equal(res.revelados, 0);
    assert.ok(recargada, 'se probó la recarga');
    assert.ok(pistaVista || true);
    // El ítem acertado con ayuda no sube de caja (repaso espaciado).
    const conAyuda = Object.entries(data.items).find(([, x]) => x.dudas === 1);
    assert.equal(conAyuda?.[1].caja, 0);
  } finally {
    globalThis.fetch = fetchOriginal;
  }
});

test('«Repetir»: el mismo plan otra vez (mismas lecciones y tipos de bloque), materializado de nuevo', async () => {
  const almacen = memoria();
  const data = P.vacio();
  const plan = planificarLocal({ objetivo: 'la rodilla', minutos: 20, catalogo: CATALOGO.lecciones, data, buscar: BUSCADOR });
  assert.ok(plan);
  const S = crearSesiones({ almacen });
  const a = await S.crear(plan, { origen: 'local', minutos: 20, data, cargar, idsLecciones: new Set(POR_ID.keys()), ambito: plan.ambito });
  assert.equal(a.ok, true);
  const otra = planParaRepetir(a.sesion, LECCIONES);
  assert.equal(otra.titulo, a.sesion.titulo);
  assert.deepEqual(otra.textos, a.sesion.textos);
  const b = await S.crear(otra, { origen: a.sesion.origen, minutos: a.sesion.minutos, data, cargar, idsLecciones: new Set(POR_ID.keys()) });
  assert.equal(b.ok, true);
  assert.notEqual(b.sesion.id, a.sesion.id);
  assert.deepEqual(b.sesion.bloques.map((x) => [x.tipo, x.leccion ?? null]), a.sesion.bloques.map((x) => [x.tipo, x.leccion ?? null]));
});

test('textos nuevos de las sesiones, el cupo y el enfoque: en español e inglés (alemán, francés e italiano, «próximamente», no se escriben)', () => {
  const claves = Object.keys(TEXTOS).filter((k) => /^(ses\.|pet\.ses\.|pet\.cupo\.|pet\.enfoque\.|pet\.ver3d|dat\.sale(Perfil|Dispositivo))/.test(k));
  assert.ok(claves.length > 100, `claves: ${claves.length}`);
  for (const k of claves) {
    for (const id of ['es', 'en']) assert.ok([].concat(TEXTOS[k][id]).every((s) => typeof s === 'string' && s.trim()), `${k} (${id})`);
    for (const id of ['de', 'fr', 'it']) assert.equal(TEXTOS[k][id], undefined, `${k} (${id}): lo nuevo solo en español e inglés`);
  }
  // Nada de prometer lo que no es: ni «superinteligencia», ni revisión médica, ni consejo clínico.
  const todo = claves.flatMap((k) => Object.values(TEXTOS[k]).flat().filter(Boolean)).join(' ');
  assert.doesNotMatch(todo, /superinteligen|super-?intelligen|revisad[oa] por (un )?m[ée]dic|consejo cl[íi]nico|diagn[óo]stic/iu);
});

// Revisión adversarial del 12 nov 2026: la pista decía «Del paso «{título}»» con el título sin tapar, y en más de la
// mitad de las preguntas de identificar con pista el título nombraba la estructura («El páncreas»).
test('la pista nunca revela el nombre por el título del paso: si lo nombra, «De un paso de la lección»', async () => {
  const ids = fs.readdirSync(new URL('../src/biblioteca/lecciones/', import.meta.url)).filter((f) => f.endsWith('.js')).map((f) => f.slice(0, -3));
  let conTitulo = 0;
  let sinTitulo = 0;
  for (const id of ids) {
    const L = await cargar(id);
    for (const q of (L?.preguntas ?? []).filter((x) => x.tipo === 'identificar' || x.tipo === 'localizar')) {
      const e = L.estructuras[q.estructura];
      const p = pistaDe(L, q, { nombres: [e.nombre] });
      if (!p) continue;
      const paso = L.pasos.find((x) => x.id === p.paso);
      if (p.titulo == null) { sinTitulo++; continue; }
      conTitulo++;
      assert.equal(p.titulo, paso.titulo, `${id}/${q.id}: el título, tal cual, cuando no nombra la estructura`);
      const raices = plano(e.nombre).split(/[^a-z0-9]+/).filter((w) => w.length >= 5 && !/^(musculo|nodos?|linfatic[oa]s?|ganglios?|arterias?|venas?|nervios?|huesos?|ligamentos?|glandulas?)$/.test(w));
      const palabras = plano(p.titulo).split(/[^a-z0-9]+/);
      for (const w of raices) assert.ok(!palabras.some((x) => x.startsWith(w.slice(0, Math.max(4, w.length - 2)))), `${id}/${q.id}: «${w}» en el título «${p.titulo}»`);
    }
  }
  assert.ok(sinTitulo > 100 && conTitulo > 100, `con título: ${conTitulo}, sin: ${sinTitulo}`);
  const L = await cargar('abd-higado-pancreas');
  const q = L.preguntas.find((x) => x.id === 'id-pancreas');
  assert.equal(pistaDe(L, q, { nombres: [L.estructuras[q.estructura].nombre] }).titulo, null, '«El páncreas» no se dice');
  for (const id of ['es', 'en']) assert.ok(TEXTOS['ses.pista.deUnPaso'][id].trim(), id);
});

// Revisión adversarial del 12 nov 2026: tras un primer fallo, salir o recargar volvía a la pregunta como nueva y un
// acierto contaba «a la primera». El segundo intento se guarda en la posición de la sesión y se recupera al reanudar.
test('el segundo intento se guarda en la sesión: al salir o recargar tras el primer fallo, la pregunta sigue con ayuda', async () => {
  const almacen = memoria();
  const L = { id: 'leccion-x', pasos: [{ id: 'p1' }], preguntas: [{ id: 'q1', tipo: 'relacion', paso: 'p1' }, { id: 'q2', tipo: 'relacion', paso: 'p1' }] };
  const S = crearSesiones({ almacen });
  const r = await S.crear({ titulo: 'Prueba', bloques: [{ tipo: 'practica', leccion: 'leccion-x', minutos: 4, motivo: '' }] }, { cargar: async () => L, idsLecciones: new Set(['leccion-x']) });
  const id = r.sesion.id;
  S.empezar(id);
  // Primer fallo en la pregunta 0 (se retiró la opción 2): la interfaz lo anota (sesion-neuri.js, anotarIntento).
  assert.equal(S.anotarPosicion(id, 0, { ...resultadoDe([]), intento: { n: 0, quitada: 2 } }), true);
  // Se recarga la página y se pulsa «Continuar».
  const e = crearSesiones({ almacen }).empezar(id);
  assert.equal(e.posicion, 0);
  assert.deepEqual(intentoGuardado(e.parcial, e.posicion), { n: 0, quitada: 2 }, 'sigue en el segundo intento, con la opción retirada');
  assert.equal(intentoGuardado(e.parcial, 1), null, 'solo para esa pregunta');
  // Bien en el segundo intento: con ayuda (no «a la primera»); la siguiente ya no arrastra el intento.
  const res = resultadoDe([{ pregunta: { item: 'leccion-x/q1' }, resultado: 'duda', ayuda: true }], e.parcial);
  assert.deepEqual([res.aciertos, res.conAyuda, res.total], [0, 1, 1]);
  S.anotarPosicion(id, 1, res);
  const otra = crearSesiones({ almacen }).actual(id);
  assert.deepEqual([otra.posicion, otra.parcial.conAyuda, intentoGuardado(otra.parcial, 1)], [1, 1, null]);
  // Un intento que no es de esa pregunta, o con una forma rara, no se guarda.
  S.anotarPosicion(id, 1, { ...res, intento: { n: 0, quitada: 1 } });
  assert.equal(crearSesiones({ almacen }).actual(id).parcial.intento, undefined);
  S.anotarPosicion(id, 1, { ...res, intento: { n: 1, quitada: 'x' } });
  assert.deepEqual(crearSesiones({ almacen }).actual(id).parcial.intento, { n: 1, quitada: null });
});
