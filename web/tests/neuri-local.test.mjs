// Neuri sin IA con frases naturales (src/pet/local.js con el buscador flexible de src/biblioteca/buscar.js).
// La tabla son casos sintéticos repetibles: frase, idioma de la interfaz, lo que debe salir primero (o un conjunto de
// respuestas válidas) y lo que no debe salir. Empezó con la frase de la captura de Carlos (11 nov 2026), que respondía
// «No encontré lecciones…» aunque la lección existe, y con el lote de 20 frases con el que se midió el fallo (9 sin
// resultado). docs/estudio/neuri.md («Sin IA») tiene la tabla de antes y después.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import { crearBuscador, normalizar, esGenerica } from '../src/biblioteca/buscar.js';
import { responderLocal } from '../src/pet/local.js';
import { RECORRIDOS } from '../src/biblioteca/recorridos.js';
import { REGION_POR_ID, SUBREGION_POR_ID, SISTEMA_POR_ID, TEMA_POR_ID } from '../src/biblioteca/taxonomia.js';
import { t, tn, fijarIdioma, idioma } from '../src/i18n/idioma.js';
import { ETIQUETAS } from '../src/i18n/textos.js';

const CATALOGO = JSON.parse(fs.readFileSync(new URL('../src/biblioteca/generado/catalogo.json', import.meta.url), 'utf8'));
const POR_ID = new Map(CATALOGO.lecciones.map((L) => [L.id, L]));
// Como en la app (src/ui/biblioteca/index.js): con las etiquetas traducidas y el idioma que esté puesto.
const BUSCADOR = crearBuscador({ lecciones: CATALOGO.lecciones, recorridos: RECORRIDOS, etiquetas: ETIQUETAS, idioma });
function entorno(lengua = 'es', progreso = {}) {
  fijarIdioma(lengua);
  return {
    buscador: BUSCADOR, porId: POR_ID, piezas: CATALOGO.piezas,
    progreso: { terminadas: new Set(progreso.terminadas ?? []), enCurso: new Set(), repasos: new Set(progreso.repasos ?? []) }, t, tn,
    nombreLugar: ([r, s]) => [REGION_POR_ID.get(r)?.nombre, s && SUBREGION_POR_ID.get(s)?.nombre].filter(Boolean).join(' › '),
    nombreMateria: (m) => (m.sistema ? SISTEMA_POR_ID.get(m.sistema)?.corto : TEMA_POR_ID.get(m.tema)?.nombre),
    sugerencias: t('pet.ejemplos').split('|'),
  };
}
const responder = (frase, lengua = 'es') => responderLocal(frase, entorno(lengua));

// [frase, idioma, primera esperada (o lista de válidas), lecciones que no deben salir]
const CASOS = [
  // Las nueve de Carlos (la de la captura, la primera)
  ['Quiero aprender la anatomia del órgano reproductor femenino', 'es', 'sis-reproductor-femenino', ['sis-sentidos', 'sis-linfatico']],
  ['Enséñame la anatomía del corazón', 'es', 'tor-corazon'],
  ['Quiero aprender anatomía del ojo', 'es', 'cab-ojo'],
  ['Me interesa el útero y los ovarios', 'es', 'sis-reproductor-femenino'],
  ['anatomía del pie', 'es', ['mi-pie-huesos-tobillo', 'mi-pie-musculos']],
  ['Quiero aprender la anatomía del aparato digestivo', 'es', 'sis-digestivo'],
  ['I want to learn the anatomy of the female reproductive system', 'en', 'sis-reproductor-femenino'],
  ['Tengo examen de neuroanatomía', 'es', 'sis-nervioso'],
  ['Quiero aprender los pulmones y cómo respiramos', 'es', ['tor-pulmones', 'tor-respiracion', 'sis-respiratorio']],
  // El resto del lote de 20 frases
  ['el organo de la vista', 'es', ['sis-sentidos', 'cab-ojo'], ['sis-linfatico', 'sis-respiratorio']],
  ['órganos genitales masculinos', 'es', 'sis-reproductor-masculino', ['sis-sentidos', 'sis-linfatico']],
  ['Explícame el sistema nervioso', 'es', 'sis-nervioso', ['cab-musculos-cara']],
  ['Quiero estudiar los riñones', 'es', 'abd-rinones'],
  ['cómo funciona el corazón', 'es', 'tor-corazon'],
  ['necesito repasar la anatomía de la mano', 'es', ['ms-mano-huesos', 'ms-mano-musculos']],
  ['Qué músculos mueven el hombro', 'es', 'ms-hombro-musculos'],
  ['dónde están las glándulas suprarrenales', 'es', ['abd-rinones', 'sis-endocrino']],
  ['partes del encéfalo', 'es', 'cab-encefalo'],
  ['quiero aprender sobre la próstata', 'es', 'sis-reproductor-masculino', ['sis-reproductor-femenino', 'pel-suelo']],
  ['me gustaría saber de los huesos de la cadera', 'es', 'pel-pelvis-osea'],
  // Casos nuevos: dos temas parecidos a la vez, otros idiomas y formas de preguntar
  ['Teach me the anatomy of the heart', 'en', 'tor-corazon'],
  ['Where is the liver', 'en', 'abd-higado-pancreas'],
  ['What muscles move the shoulder', 'en', 'ms-hombro-musculos'],
  ['Ich möchte die Anatomie des Herzens lernen', 'de', 'tor-corazon'],
  ['Zeig mir die Knochen der Hand', 'de', 'ms-mano-huesos'],
  ['Je veux apprendre l’anatomie du cœur', 'fr', 'tor-corazon'],
  ['Montre-moi les os de la main', 'fr', 'ms-mano-huesos'],
  ['Voglio imparare l’anatomia del cuore', 'it', 'tor-corazon'],
  ['Mostrami le ossa della mano', 'it', 'ms-mano-huesos'],
];

test('Neuri sin IA: frases naturales → la lección que encaja, primero y sin relleno sin relación', () => {
  for (const [frase, lengua, esperada, prohibidas = []] of CASOS) {
    const r = responder(frase, lengua);
    const ids = r.lecciones.map((x) => x.id);
    const validas = Array.isArray(esperada) ? esperada : [esperada];
    assert.ok(ids.length >= 1 && ids.length <= 3, `${frase}: ${ids.length} lecciones`);
    assert.ok(validas.includes(ids[0]), `${frase} → ${ids.join(', ')} (esperada ${validas.join(' o ')})`);
    for (const id of prohibidas) assert.ok(!ids.includes(id), `${frase}: no debe salir ${id}`);
    assert.ok(r.lecciones.every((x) => POR_ID.has(x.id) && x.motivo), `${frase}: cada una con su motivo`);
    assert.notEqual(r.coincidencia.fuerza, 'ninguna', frase);
  }
});

test('Neuri sin IA: la frase de Carlos y su equivalente en inglés, con coincidencia alta y el tema dicho', () => {
  for (const [frase, lengua] of [['Quiero aprender la anatomia del órgano reproductor femenino', 'es'], ['I want to learn the anatomy of the female reproductive system', 'en']]) {
    const r = responder(frase, lengua);
    assert.deepEqual(r.lecciones.map((x) => x.id), ['sis-reproductor-femenino'], frase);
    assert.equal(r.coincidencia.fuerza, 'alta', frase);
    assert.equal(r.coincidencia.tema, true);
    assert.match(r.lecciones[0].motivo, /Reproductor femenino|Female reproductive/);
    assert.doesNotMatch(r.lecciones[0].motivo, /Órganos y relaciones|Organs and relations/, '«órgano» no se nombra como tema');
  }
});

test('Neuri sin IA: dos temas parecidos a la vez dan lecciones de los dos', () => {
  const ids = responder('huesos de la mano y del pie').lecciones.map((x) => x.id);
  assert.ok(ids.includes('ms-mano-huesos') && ids.includes('mi-pie-huesos-tobillo'), ids.join(', '));
});

test('Neuri sin IA: sin tema útil, pregunta cuál (en los cinco idiomas) en vez de recomendar algo al azar', () => {
  const sinTema = { es: 'quiero aprender anatomía', en: 'I want to learn anatomy', de: 'Ich möchte Anatomie lernen', fr: 'Je veux apprendre l’anatomie', it: 'Voglio imparare l’anatomia' };
  for (const [lengua, frase] of Object.entries(sinTema)) {
    const r = responder(frase, lengua);
    assert.equal(r.lecciones.length, 0, frase);
    assert.equal(r.mensaje, t('pet.local.queTema'), frase);
    assert.equal(r.sugerencias[0], t('pet.local.chipEmpezar'));
    assert.equal(r.sugerencias.length, 6, 'empezar de cero y cinco zonas');
    assert.equal(r.coincidencia.fuerza, 'ninguna');
    // La sugerencia de empezar, al pulsarla, lleva al recorrido de primeros pasos en ese idioma.
    assert.equal(responder(r.sugerencias[0], lengua).recorrido, 'primeros-pasos', lengua);
  }
  // Una zona muy amplia sin lugar: recomienda lo que encaja y ofrece afinar por región.
  const amplia = responder('músculos');
  assert.ok(amplia.lecciones.length >= 1);
  assert.ok(amplia.mensaje.endsWith(t('pet.local.afinar')));
  assert.ok(amplia.sugerencias.length >= 2);
});

test('Neuri sin IA: un tema que no existe no devuelve la frase entera ni lecciones; ofrece por dónde seguir', () => {
  for (const frase of ['Quiero aprender sobre dinosaurios y volcanes', 'Explícame la astrofísica de los agujeros negros']) {
    const r = responder(frase);
    assert.equal(r.lecciones.length, 0, frase);
    // «Explícame…» dice además que explicar necesita la IA (sin prometer lecciones que no hay).
    assert.equal(r.mensaje, t(/^Explícame/.test(frase) ? 'pet.local.explicarNada' : 'pet.local.nada'), frase);
    assert.ok(!r.mensaje.includes(frase) && !/dinosaurio|astrofisica|astrofísica/i.test(r.mensaje));
    assert.equal(r.sugerencias.length, 6);
    assert.equal(r.coincidencia.fuerza, 'ninguna');
    assert.ok(r.coincidencia.ignoradas.length >= 1);
  }
});

test('Neuri sin IA: el objetivo (examen, repasar, empezar), el tiempo y lo que no se encontró van en la coincidencia', () => {
  const ex = responder('Tengo examen de neuroanatomía');
  assert.equal(ex.coincidencia.objetivo, 'examen');
  assert.ok(ex.mensaje.startsWith(t('pet.local.examen')), ex.mensaje);   // y, como es amplio, pregunta qué zona
  assert.equal(responder('necesito repasar la anatomía de la mano').coincidencia.objetivo, 'repasar');
  const res = responder('Quiero aprender los pulmones y cómo respiramos');
  assert.deepEqual(res.coincidencia.ignoradas, ['respiramos']);
  assert.equal(res.coincidencia.fuerza, 'media', 'una palabra no encajó: no es una coincidencia alta');
  const corto = responder('Algo de 10 minutos sobre el corazón');
  assert.equal(corto.coincidencia.minutos, 10);
  assert.ok(corto.lecciones.every((x) => POR_ID.get(x.id).minutos <= 10) || corto.mensaje === t('pet.local.cortoNada', { m: 10 }));
  // Salud y urgencia siguen igual.
  assert.ok(responder('me duele la rodilla').mensaje.startsWith(t('pet.local.salud')));
  assert.equal(responder('I want to kill myself', 'en').coincidencia.objetivo, 'urgencia');
});

test('buscador: «œ», «æ» y «ß» se normalizan; las palabras genéricas no se exigen, ni en la biblioteca', () => {
  assert.equal(normalizar('Cœur'), 'coeur');
  assert.equal(normalizar('Fuß'), 'fuss');
  assert.ok(esGenerica('anatomia') && esGenerica('organo') && !esGenerica('corazon'));
  // La búsqueda de la biblioteca (sin modo flexible) también encuentra «anatomía del pie».
  const B = crearBuscador({ lecciones: CATALOGO.lecciones, recorridos: RECORRIDOS });
  assert.ok(B.buscar('anatomía del pie').lecciones.some((L) => L.id === 'mi-pie-huesos-tobillo'));
  // Pero sin el modo flexible no se dejan de exigir las palabras que no salen en ninguna lección.
  assert.equal(B.buscar('pulmones respiramos').lecciones.length, 0);
  assert.ok(B.buscar('pulmones respiramos', { flexible: true }).lecciones.some((L) => L.id === 'tor-pulmones'));
});

test('buscador: los nombres traducidos solo en el idioma de la interfaz («dos» es la espalda en francés, no en español)', () => {
  const B = crearBuscador({ lecciones: CATALOGO.lecciones, recorridos: RECORRIDOS, etiquetas: ETIQUETAS });
  assert.deepEqual(B.buscar('tengo dos exámenes del brazo', { idioma: 'es' }).lugares, [{ region: 'miembro-superior', sub: 'brazo' }]);
  assert.ok(B.buscar('les muscles du dos', { idioma: 'fr' }).lugares.some((l) => l.region === 'espalda'));
  assert.ok(!B.buscar('the main muscles of the leg', { idioma: 'en' }).lugares.some((l) => l.sub === 'mano'), '«main» no es la mano en inglés');
  assert.ok(B.buscar('la main', { idioma: 'fr' }).lugares.some((l) => l.sub === 'mano'));
  // Plurales y casos: «cuori», «des Herzens».
  assert.ok(B.buscar('i cuori', { idioma: 'it' }).lugares.some((l) => l.sub === 'corazon'));
  assert.ok(B.buscar('des Herzens', { idioma: 'de' }).lugares.some((l) => l.sub === 'corazon'));
  // Lo de antes sigue igual: el inglés y el latín de la taxonomía valen siempre.
  assert.equal(B.buscar('leg muscles', { idioma: 'es' }).lugares[0].sub, 'pierna');
});

// Sesiones de estudio sin IA (src/pet/planificador.js, 11 nov 2026): el mismo buscador entiende el tema de lo que se
// pide en los cinco idiomas, y la sesión se arma con lecciones del catálogo (sin llamar a nadie).
test('sin IA: «una sesión de 10 minutos sobre el corazón» en cinco idiomas se planifica con lecciones del corazón', async () => {
  const { planificarLocal, valorarObjetivo } = await import('../src/pet/planificador.js');
  const { limpiarPlanSesion } = await import('../src/pet/protocolo.js');
  const casos = [
    ['Prepárame una sesión de 10 minutos sobre el corazón', 'es'],
    ['Make me a 10 minute study session on the heart', 'en'],
    ['Bereite mir eine Lernsitzung von 10 Minuten über das Herz vor', 'de'],
    ['Prépare-moi une séance de 10 minutes sur le cœur', 'fr'],
    ['Preparami una sessione di 10 minuti sul cuore', 'it'],
  ];
  const delCorazon = ['sis-cardiovascular', 'tor-corazon'];
  for (const [frase, lengua] of casos) {
    entorno(lengua);
    const v = valorarObjetivo(frase, BUSCADOR);
    assert.equal(v.tema, true, frase);
    assert.ok(delCorazon.includes(v.lecciones[0].id), `${frase}: ${v.lecciones[0].id}`);
    const plan = planificarLocal({ objetivo: frase, minutos: 10, catalogo: CATALOGO.lecciones, buscar: BUSCADOR });
    assert.ok(limpiarPlanSesion(plan, new Set(POR_ID.keys())), frase);
    assert.ok(plan.bloques.filter((b) => b.leccion).every((b) => delCorazon.includes(b.leccion)), frase);
  }
  entorno('es');
});
