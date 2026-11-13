// Protocolo v2 de Neuri, lo añadido para las sesiones de estudio y el cupo diario (src/pet/protocolo.js): los
// limpiadores nuevos, el modo «sesion» en validarPeticion y los campos nuevos de limpiarRespuesta. Sin red ni IA.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import {
  VERSION, MODOS, LIMITES, ID_DISPOSITIVO, ID_TRABAJO, ESTADOS_HABILIDAD, MOTIVOS_DIFICULTAD, TIPOS_BLOQUE, PARTES_LECCION,
  validarPeticion, limpiarRespuesta, limpiarCupo, limpiarPerfil, limpiarEnfoque, limpiarPedidoSesion, limpiarPlanSesion,
} from '../src/pet/protocolo.js';
import { RECORRIDOS } from '../src/biblioteca/recorridos.js';

const CATALOGO = JSON.parse(fs.readFileSync(new URL('../src/biblioteca/generado/catalogo.json', import.meta.url), 'utf8'));
const IDS = { lecciones: new Set(CATALOGO.lecciones.map((L) => L.id)), recorridos: new Set(RECORRIDOS.map((R) => R.id)) };
const [A, B, C] = CATALOGO.lecciones.map((L) => L.id);
const UUID = '3f2a9c1e-7b4d-4e8a-9f10-2c3d4e5f6a7b';
const largo = (n) => 'x'.repeat(n);

test('constantes nuevas: modo sesion, dispositivo, límites', () => {
  assert.equal(VERSION, 2, 'la versión no sube');
  assert.ok(MODOS.includes('sesion'));
  for (const m of ['orientar', 'planificar', 'redactar', 'adaptar', 'trabajo', 'cancelar']) assert.ok(MODOS.includes(m), m);
  assert.equal(ID_DISPOSITIVO.source, ID_TRABAJO.source);
  assert.ok(ID_DISPOSITIVO.test(UUID));
  for (const malo of ['', 'corto', 'ABC' + UUID, UUID + 'x'.repeat(60), '-' + UUID.slice(1), 'a/b' + UUID]) assert.equal(ID_DISPOSITIVO.test(malo), false, malo);
  assert.equal(LIMITES.bloquesSesion, 6);
  assert.equal(LIMITES.mostrar, 3);
  assert.equal(LIMITES.dificultades, 6);
  assert.equal(LIMITES.mensajesSesion, 6);
  assert.deepEqual(ESTADOS_HABILIDAD, ['sin-datos', 'practicando', 'demostrada', 'consolidada']);
  assert.deepEqual(MOTIVOS_DIFICULTAD, ['confusion', 'nolose', 'fallo']);
  assert.deepEqual(TIPOS_BLOQUE, ['repaso', 'leccion', 'practica']);
  assert.deepEqual(PARTES_LECCION, ['entera', 'inicio', 'continuar']);
});

test('limpiarCupo: forma completa, quedan coherente, basura fuera', () => {
  const bueno = { preguntas: { limite: 30, usadas: 4, quedan: 26 }, creaciones: { limite: 3, usadas: 0, quedan: 3 }, renueva: '2026-11-12T00:00:00+01:00' };
  assert.deepEqual(limpiarCupo(bueno), bueno);
  assert.deepEqual(limpiarCupo({ ...bueno, renueva: '2026-11-12T00:00:00.000Z' }).renueva, '2026-11-12T00:00:00.000Z');
  // quedan se calcula si falta y nunca pasa de limite − usadas (sí puede ser menor: el tope por IP).
  assert.equal(limpiarCupo({ ...bueno, preguntas: { limite: 30, usadas: 4 } }).preguntas.quedan, 26);
  assert.equal(limpiarCupo({ ...bueno, preguntas: { limite: 30, usadas: 4, quedan: 99 } }).preguntas.quedan, 26);
  assert.equal(limpiarCupo({ ...bueno, preguntas: { limite: 30, usadas: 4, quedan: 2 } }).preguntas.quedan, 2);
  assert.equal(limpiarCupo({ ...bueno, preguntas: { limite: 30, usadas: 31 } }).preguntas.quedan, 0, 'agotado: 0, nunca negativo');
  assert.deepEqual(limpiarCupo({ ...bueno, extra: 'x', preguntas: { ...bueno.preguntas, otro: 1 } }), bueno, 'campos de más fuera');
  for (const malo of [null, undefined, 'cupo', 3, [], {}, { ...bueno, preguntas: null }, { ...bueno, creaciones: { limite: '3', usadas: 0 } },
    { ...bueno, preguntas: { limite: -1, usadas: 0 } }, { ...bueno, preguntas: { limite: 30, usadas: 1.5 } },
    { ...bueno, renueva: 'mañana' }, { ...bueno, renueva: '2026-11-12' }, { ...bueno, renueva: '2026-13-45T99:00:00Z' }, { ...bueno, renueva: 1731369600000 }]) {
    assert.equal(limpiarCupo(malo), null, JSON.stringify(malo));
  }
});

test('limpiarPerfil: lo válido pasa, lo demás se recorta o sale', () => {
  const p = {
    nivel: 2, minutos: 20, intereses: ['cuello', 'linfatico', 'no-existe', 'cuello', 'oseo', 'muscular', 'cabeza'],
    habilidades: { reconocer: 'demostrada', localizar: 'practicando', relacionar: 'genial', inventada: 'consolidada', explicar: 'sin-datos' },
    dificultades: [
      { leccion: A, estructura: 'Internal_jugular_vein', motivo: 'confusion', fallos: 3, pregunta: 'secreta', respuesta: 'b' },
      { leccion: A, estructura: 'Internal_jugular_vein', motivo: 'fallo', fallos: 1 },
      { leccion: 'no-existe', estructura: null, motivo: 'fallo', fallos: 1 },
      { leccion: B, estructura: 'con espacios', motivo: 'nolose', fallos: 40 },
      { leccion: C, motivo: 'olvido', fallos: 1 },
      'basura',
    ],
    vencidas: 5000,
    ultima: { titulo: largo(200), hechos: 9, bloques: 4, terminada: 'si', fecha: '2026-11-10' },
    fecha: '2026-11-11', respuestas: ['a'],
  };
  const r = limpiarPerfil(p, IDS.lecciones);
  assert.equal(r.nivel, 2);
  assert.equal(r.minutos, 20);
  assert.ok(r.intereses.length <= LIMITES.intereses);
  assert.ok(r.intereses.every((x) => x !== 'no-existe'));
  assert.equal(new Set(r.intereses).size, r.intereses.length, 'sin repetir');
  assert.ok(r.intereses.includes('linfatico'));
  assert.deepEqual(r.habilidades, { reconocer: 'demostrada', localizar: 'practicando', explicar: 'sin-datos' });
  assert.deepEqual(r.dificultades, [
    { leccion: A, estructura: 'Internal_jugular_vein', motivo: 'confusion', fallos: 3 },
    { leccion: B, estructura: null, motivo: 'nolose', fallos: 9 },
  ]);
  assert.equal(r.vencidas, 999);
  assert.deepEqual(r.ultima, { titulo: largo(80), hechos: 4, bloques: 4, terminada: false });
  assert.deepEqual(Object.keys(r).sort(), ['dificultades', 'habilidades', 'intereses', 'minutos', 'nivel', 'ultima', 'vencidas']);
  assert.ok(!JSON.stringify(r).includes('2026'), 'sin fechas');
  assert.ok(!JSON.stringify(r).includes('secreta'), 'sin respuestas');
});

test('limpiarPerfil: límites, tipos equivocados y perfil vacío', () => {
  assert.equal(limpiarPerfil(null), null);
  assert.equal(limpiarPerfil('perfil'), null);
  assert.equal(limpiarPerfil([]), null);
  assert.equal(limpiarPerfil({}), null, 'sin nada que decir: null');
  assert.equal(limpiarPerfil({ nivel: 7, minutos: 1, intereses: 'cuello', habilidades: ['demostrada'], dificultades: {}, vencidas: -3, ultima: 'ayer' }), null);
  assert.equal(limpiarPerfil({ nivel: 3 }).nivel, 3);
  assert.equal(limpiarPerfil({ minutos: 240 }).minutos, 240);
  assert.equal(limpiarPerfil({ minutos: 241, nivel: 1 }).minutos, null);
  assert.equal(limpiarPerfil({ nivel: '2', minutos: 10 }).nivel, null);
  assert.equal(limpiarPerfil({ vencidas: 12 }).vencidas, 12);
  assert.equal(limpiarPerfil({ vencidas: 2.5, nivel: 1 }).vencidas, 0);
  const muchas = Array.from({ length: 10 }, (_, i) => ({ leccion: A, estructura: `Estructura_${i}`, motivo: 'fallo', fallos: 2 }));
  assert.equal(limpiarPerfil({ dificultades: muchas }, IDS.lecciones).dificultades.length, LIMITES.dificultades);
  assert.equal(limpiarPerfil({ dificultades: [{ leccion: A, motivo: 'fallo', fallos: 0 }] }, IDS.lecciones).dificultades[0].fallos, 1);
  assert.equal(limpiarPerfil({ dificultades: [{ leccion: A, motivo: 'fallo' }] }, IDS.lecciones).dificultades[0].fallos, 1);
  // La última sesión: título obligatorio, bloques 1-12, hechos ≤ bloques.
  assert.equal(limpiarPerfil({ ultima: { titulo: '', bloques: 3 }, nivel: 1 }).ultima, null);
  assert.equal(limpiarPerfil({ ultima: { titulo: 'Cuello', bloques: 0 }, nivel: 1 }).ultima, null);
  assert.deepEqual(limpiarPerfil({ ultima: { titulo: '  Ganglios   del cuello ', bloques: 30, hechos: -2, terminada: true } }).ultima, { titulo: 'Ganglios del cuello', hechos: 0, bloques: 12, terminada: true });
  // Sin la lista de lecciones basta la forma del identificador.
  assert.equal(limpiarPerfil({ dificultades: [{ leccion: 'cualquier-id', motivo: 'fallo', fallos: 1 }] }).dificultades.length, 1);
  assert.equal(limpiarPerfil({ dificultades: [{ leccion: 'Mal Id', motivo: 'fallo', fallos: 1 }] }), null);
});

test('limpiarEnfoque: lección que existe, paso con forma, sesion booleano', () => {
  assert.deepEqual(limpiarEnfoque({ leccion: A, paso: 'paso-2', sesion: true, otro: 1 }, IDS.lecciones), { leccion: A, paso: 'paso-2', sesion: true });
  assert.deepEqual(limpiarEnfoque({ leccion: A }, IDS.lecciones), { leccion: A, paso: null, sesion: false });
  assert.equal(limpiarEnfoque({ leccion: A, paso: 'Paso 2' }, IDS.lecciones).paso, null);
  assert.equal(limpiarEnfoque({ leccion: A, paso: largo(61) }, IDS.lecciones).paso, null);
  assert.equal(limpiarEnfoque({ leccion: A, sesion: 'true' }, IDS.lecciones).sesion, false);
  assert.equal(limpiarEnfoque({ leccion: 'no-existe' }, IDS.lecciones), null);
  for (const malo of [null, 'x', 4, [], {}, { leccion: 7 }]) assert.equal(limpiarEnfoque(malo, IDS.lecciones), null);
});

test('limpiarPedidoSesion: obligatorio, rangos y modelo', () => {
  const bueno = { objetivo: 'Localizar la cadena cervical profunda junto a la yugular interna', minutos: 10, nivel: 2, modelo: 'female' };
  assert.deepEqual(limpiarPedidoSesion({ ...bueno, otro: 'x' }), bueno);
  assert.deepEqual(limpiarPedidoSesion({ ...bueno, nivel: null }), { ...bueno, nivel: null });
  assert.equal(limpiarPedidoSesion({ ...bueno, nivel: undefined }).nivel, null);
  assert.equal(limpiarPedidoSesion({ ...bueno, minutos: 5 }).minutos, 5);
  assert.equal(limpiarPedidoSesion({ ...bueno, minutos: 120 }).minutos, 120);
  assert.equal(limpiarPedidoSesion({ ...bueno, objetivo: '  a  ' }).objetivo, 'a');
  assert.equal(limpiarPedidoSesion({ ...bueno, objetivo: largo(900) }).objetivo.length, LIMITES.largo);
  for (const malo of [null, 'x', [], {}, { ...bueno, objetivo: '' }, { ...bueno, objetivo: '   ' }, { ...bueno, objetivo: 3 }, { ...bueno, objetivo: largo(1201) },
    { ...bueno, minutos: 4 }, { ...bueno, minutos: 121 }, { ...bueno, minutos: '10' }, { ...bueno, minutos: 7.5 }, { ...bueno, minutos: undefined },
    { ...bueno, nivel: 4 }, { ...bueno, nivel: '2' }, { ...bueno, modelo: 'otro' }, { ...bueno, modelo: undefined }]) {
    assert.equal(limpiarPedidoSesion(malo), null, JSON.stringify(malo)?.slice(0, 120));
  }
});

test('limpiarPlanSesion: bloques válidos, ids que existen, recortes', () => {
  const plan = {
    titulo: 'Ganglios del cuello en 10 minutos', mensaje: 'Empezamos repasando y luego vamos al cuello.', objetivo: 'Localizar la cadena cervical profunda.',
    bloques: [
      { tipo: 'repaso', minutos: 3, motivo: 'Tienes repasos vencidos', leccion: A },
      { tipo: 'leccion', leccion: A, parte: 'inicio', minutos: 5, motivo: 'La base' },
      { tipo: 'practica', leccion: B, minutos: 2, motivo: 'Comprobarlo' },
    ],
    extra: 'fuera',
  };
  assert.deepEqual(limpiarPlanSesion(plan, IDS.lecciones), {
    titulo: plan.titulo, mensaje: plan.mensaje, objetivo: plan.objetivo,
    bloques: [
      { tipo: 'repaso', minutos: 3, motivo: 'Tienes repasos vencidos' },
      { tipo: 'leccion', leccion: A, parte: 'inicio', minutos: 5, motivo: 'La base' },
      { tipo: 'practica', leccion: B, minutos: 2, motivo: 'Comprobarlo' },
    ],
  });
  const r = limpiarPlanSesion({
    titulo: largo(300), mensaje: largo(900), objetivo: largo(900),
    bloques: [
      { tipo: 'leccion', leccion: A, parte: 'mitad', minutos: 90, motivo: largo(500) },
      { tipo: 'leccion', leccion: 'no-existe', minutos: 5 },
      { tipo: 'practica', minutos: 5 },
      { tipo: 'vista3d', leccion: A, minutos: 5 },
      { tipo: 'repaso', minutos: 0 },
      { tipo: 'repaso', minutos: '5' },
      null, 'repaso',
      ...Array.from({ length: 8 }, () => ({ tipo: 'repaso', minutos: 2 })),
    ],
  }, IDS.lecciones);
  assert.equal(r.titulo.length, LIMITES.campo);
  assert.equal(r.mensaje.length, LIMITES.largo);
  assert.equal(r.objetivo.length, LIMITES.largo);
  assert.equal(r.bloques.length, LIMITES.bloquesSesion);
  assert.deepEqual(r.bloques[0], { tipo: 'leccion', leccion: A, parte: 'entera', minutos: 60, motivo: largo(LIMITES.motivo) });
  assert.ok(r.bloques.slice(1).every((b) => b.tipo === 'repaso' && b.minutos === 2));
  for (const malo of [null, 'plan', [], {}, { titulo: 'x', bloques: [] }, { titulo: '', bloques: plan.bloques }, { titulo: 'x', bloques: 'repaso' },
    { titulo: 'x', bloques: [{ tipo: 'leccion', leccion: 'no-existe', minutos: 5 }] }]) {
    assert.equal(limpiarPlanSesion(malo, IDS.lecciones), null, JSON.stringify(malo));
  }
  // Sin la lista: basta la forma (la app la vuelve a revisar al guardar).
  assert.equal(limpiarPlanSesion({ titulo: 'x', bloques: [{ tipo: 'practica', leccion: 'neuri-mia-abcd', minutos: 5 }] }).bloques.length, 1);
  assert.equal(limpiarPlanSesion({ titulo: 'x', bloques: [{ tipo: 'practica', leccion: 'Mal Id', minutos: 5 }] }), null);
});

const PEDIDO = { objetivo: 'Tengo diez minutos para los ganglios del cuello', minutos: 10, nivel: null, modelo: 'male' };
const sesion = (extra = {}) => ({ v: 2, modo: 'sesion', idioma: 'fr', pedido: PEDIDO, progreso: { terminadas: [A] }, propias: [], contexto: {}, ...extra });

test('validarPeticion en modo sesion', () => {
  const v = validarPeticion(sesion({ hoy: '2026-11-11' }), IDS);
  assert.equal(v.ok, true);
  assert.equal(v.peticion.modo, 'sesion');
  assert.equal(v.peticion.idioma, 'fr');
  assert.deepEqual(v.peticion.pedido, PEDIDO);
  assert.deepEqual(v.peticion.mensajes, [], 'sin mensajes vale');
  assert.deepEqual(v.peticion.progreso.terminadas, [A]);
  assert.equal(v.peticion.hoy, '2026-11-11');
  assert.equal(v.peticion.perfil, undefined, 'sin perfil no viaja');
  // Pedido obligatorio y bien formado.
  assert.deepEqual(validarPeticion(sesion({ pedido: undefined }), IDS), { ok: false, error: 'pedido' });
  assert.equal(validarPeticion(sesion({ pedido: { ...PEDIDO, minutos: 3 } }), IDS).error, 'pedido');
  assert.equal(validarPeticion(sesion({ pedido: { ...PEDIDO, minutos: 200 } }), IDS).error, 'pedido');
  assert.equal(validarPeticion(sesion({ pedido: { ...PEDIDO, modelo: 'robot' } }), IDS).error, 'pedido');
  assert.equal(validarPeticion(sesion({ pedido: { ...PEDIDO, objetivo: '' } }), IDS).error, 'pedido');
  // Mensajes: opcionales, los 6 últimos, alternos; no hace falta que terminen en la persona.
  const turnos = Array.from({ length: 9 }, (_, i) => (i % 2 ? { rol: 'pet', texto: `n${i}` } : { rol: 'usuario', texto: `u${i}` }));
  const m = validarPeticion(sesion({ mensajes: turnos.slice(0, 8) }), IDS);
  assert.equal(m.ok, true);
  assert.ok(m.peticion.mensajes.length <= LIMITES.mensajesSesion);
  assert.equal(m.peticion.mensajes[0].rol, 'usuario');
  assert.equal(m.peticion.mensajes.at(-1).rol, 'pet', 'puede terminar en Neuri');
  assert.equal(validarPeticion(sesion({ mensajes: [{ rol: 'usuario', texto: 'a' }, { rol: 'usuario', texto: 'b' }] }), IDS).error, 'turnos');
  assert.equal(validarPeticion(sesion({ mensajes: [{ rol: 'sistema', texto: 'a' }] }), IDS).error, 'rol');
  assert.equal(validarPeticion(sesion({ mensajes: [] }), IDS).ok, true);
  // Perfil y enfoque también en sesion.
  const conPerfil = validarPeticion(sesion({ perfil: { nivel: 1, vencidas: 2 }, enfoque: { leccion: A, paso: 'p1' } }), IDS);
  assert.equal(conPerfil.peticion.perfil.vencidas, 2);
  assert.deepEqual(conPerfil.peticion.enfoque, { leccion: A, paso: 'p1', sesion: false });
  // El modo sesion no se cuela en los demás: planificar sigue exigiendo su solicitud.
  assert.equal(validarPeticion({ v: 2, modo: 'planificar', pedido: PEDIDO }, IDS).error, 'solicitud');
});

test('validarPeticion: orientar acepta y limpia perfil y enfoque; lo antiguo sigue igual', () => {
  const base = { v: 2, modo: 'orientar', idioma: 'es', mensajes: [{ rol: 'usuario', texto: '¿Qué son los ganglios cervicales?' }] };
  const sin = validarPeticion(base, IDS);
  assert.equal(sin.ok, true);
  assert.equal('perfil' in sin.peticion, false);
  assert.equal('enfoque' in sin.peticion, false);
  assert.equal('pedido' in sin.peticion, false);
  const con = validarPeticion({
    ...base,
    perfil: { nivel: 2, intereses: ['cuello', 'inventado'], habilidades: { localizar: 'practicando', x: 'y' }, dificultades: [{ leccion: 'no-existe', motivo: 'fallo', fallos: 1 }], fecha: 'hoy' },
    enfoque: { leccion: A, paso: 'p-3', sesion: true },
  }, IDS);
  assert.equal(con.ok, true);
  assert.deepEqual(con.peticion.perfil, { nivel: 2, minutos: null, intereses: ['cuello'], habilidades: { localizar: 'practicando' }, dificultades: [], vencidas: 0, ultima: null });
  assert.deepEqual(con.peticion.enfoque, { leccion: A, paso: 'p-3', sesion: true });
  // Perfil o enfoque que no sirven: la petición sigue valiendo, sin ellos.
  const basura = validarPeticion({ ...base, perfil: 'mucho', enfoque: { leccion: 'no-existe' } }, IDS);
  assert.equal(basura.ok, true);
  assert.equal('perfil' in basura.peticion, false);
  assert.equal('enfoque' in basura.peticion, false);
  // Una lección propia que viaja en la petición vale para el enfoque y las dificultades.
  const propia = { id: 'neuri-mi-cuello-abcd', titulo: 'Mi cuello' };
  const p = validarPeticion({ ...base, propias: [propia], enfoque: { leccion: propia.id }, perfil: { dificultades: [{ leccion: propia.id, motivo: 'nolose', fallos: 2 }] } }, IDS);
  assert.equal(p.peticion.enfoque.leccion, propia.id);
  assert.equal(p.peticion.perfil.dificultades[0].leccion, propia.id);
  // Orientar sigue exigiendo terminar con la persona, y en planificar no viajan perfil ni enfoque.
  assert.equal(validarPeticion({ ...base, mensajes: [] }, IDS).error, 'mensajes');
  const pl = validarPeticion({ v: 2, modo: 'planificar', solicitud: { accion: 'crear', tema: 'Cuello' }, perfil: { nivel: 1 }, enfoque: { leccion: A } }, IDS);
  assert.equal(pl.ok, true);
  assert.equal('perfil' in pl.peticion, false);
  assert.equal('enfoque' in pl.peticion, false);
  // Orientar con 12 turnos sigue enviando 12 (el tope de 6 es solo de sesion).
  const doce = Array.from({ length: 13 }, (_, i) => (i % 2 ? { rol: 'pet', texto: `n${i}` } : { rol: 'usuario', texto: `u${i}` }));
  assert.equal(validarPeticion({ ...base, mensajes: doce }, IDS).peticion.mensajes.length, 11, 'los 12 últimos, empezando por la persona');
});

test('limpiarRespuesta: conserva lo antiguo y recorta mostrar y sesion_pedida', () => {
  const r = {
    tipo: 'explicacion', mensaje: 'Los ganglios cervicales profundos siguen la vena yugular interna.',
    lecciones: [{ id: A, motivo: 'Base' }], sesion: { lecciones: [A, B], minutos: 20 }, sugerencias: ['Ver en 3D', 'Ver en 3D', 'Otra'],
    contexto: { tema: 'Cuello', nivel: 2 },
    mostrar: [
      { clave: 'Deep_cervical_lymph_nodes', nombre: 'Nódulos linfáticos cervicales profundos' },
      { clave: 'Deep_cervical_lymph_nodes', nombre: 'repetido' },
      { clave: 'con espacios', nombre: 'mal' },
      { clave: 'Internal_jugular_vein' },
      { clave: 'X', nombre: 'corta' },
      'Thoracic_duct',
      { clave: 'Thoracic_duct', nombre: largo(300) },
      { clave: 'Cisterna_chyli', nombre: 'cuarta' },
    ],
    sesion_pedida: { objetivo: '  Repasar   los ganglios del cuello ', minutos: 3, nivel: 9, otro: 1 },
  };
  const l = limpiarRespuesta(r, IDS);
  assert.equal(l.tipo, 'explicacion');
  assert.deepEqual(l.lecciones, [{ id: A, motivo: 'Base' }]);
  assert.deepEqual(l.sesion, { lecciones: [A, B], minutos: 20 }, 'el campo antiguo sesion se conserva');
  assert.deepEqual(l.sugerencias, ['Ver en 3D', 'Otra']);
  assert.equal(l.contexto.tema, 'Cuello');
  assert.deepEqual(l.mostrar, [
    { clave: 'Deep_cervical_lymph_nodes', nombre: 'Nódulos linfáticos cervicales profundos' },
    { clave: 'Internal_jugular_vein', nombre: 'Internal_jugular_vein' },
    { clave: 'Thoracic_duct', nombre: largo(LIMITES.campo) },
  ]);
  assert.deepEqual(l.sesion_pedida, { objetivo: 'Repasar los ganglios del cuello', minutos: 5, nivel: null });
  assert.equal(limpiarRespuesta({ ...r, sesion_pedida: { objetivo: 'x', minutos: 500, nivel: 2 } }, IDS).sesion_pedida.minutos, 120);
  assert.equal(limpiarRespuesta({ ...r, sesion_pedida: { objetivo: 'x', minutos: '10' } }, IDS).sesion_pedida.minutos, null);
  assert.equal(limpiarRespuesta({ ...r, sesion_pedida: { objetivo: '' } }, IDS).sesion_pedida, null);
  assert.equal(limpiarRespuesta({ ...r, sesion_pedida: 'sí' }, IDS).sesion_pedida, null);
  // Sin los campos nuevos: vacíos, y todo lo demás como antes.
  const viejo = limpiarRespuesta({ tipo: 'recomendacion', mensaje: 'Hola', lecciones: [A] }, IDS);
  assert.deepEqual(viejo.mostrar, []);
  assert.equal(viejo.sesion_pedida, null);
  assert.deepEqual(viejo.lecciones, [{ id: A, motivo: '' }]);
  assert.equal(viejo.sesion, null);
  assert.equal(limpiarRespuesta({ ...r, mostrar: 'Thoracic_duct' }, IDS).mostrar.length, 0);
  assert.equal(limpiarRespuesta({ mensaje: '' }, IDS), null);
});
