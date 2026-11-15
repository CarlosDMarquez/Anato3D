// Pruebas de los idiomas (src/i18n/): textos completos en los cinco idiomas, claves del HTML, plurales, etiquetas,
// nombres de piezas y grupos, y traducción del contenido. `npm test`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { TEXTOS, ETIQUETAS } from '../src/i18n/textos.js';
import { IDIOMAS, DISPONIBLES, PREDETERMINADO, CLAVE, t, tn, etiqueta, idioma, leerIdioma, fijarIdioma } from '../src/i18n/idioma.js';
import { nombrePieza, nombreGrupo, ponerTabla } from '../src/i18n/nombres.js';
import { huella, ponerMemoria, tr, traducido, trCita } from '../src/i18n/contenido.js';

const IDS = IDIOMAS.map((i) => i.id);
const marcas = (s) => [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1].toLowerCase()).sort().join(',');
const memoria = (inicial = {}) => {
  const s = { ...inicial };
  return { getItem: (k) => s[k] ?? null, setItem: (k, v) => { s[k] = String(v); }, datos: s };
};

test('los cinco idiomas, con el inglés por defecto; solo español e inglés se pueden elegir', () => {
  assert.deepEqual(IDS, ['es', 'en', 'de', 'fr', 'it']);
  assert.deepEqual(DISPONIBLES, ['es', 'en']);
  assert.equal(PREDETERMINADO, 'en');
  assert.equal(idioma(), 'en');
});

test('cada texto está en español e inglés (alemán, francés e italiano, si los tiene), con las mismas marcas {x} y la misma forma', () => {
  const vaciosEs = new Set(['ficha.traduccion', 'estudio.traduccion']);   // avisos de traducción: en español no se muestran
  for (const [clave, e] of Object.entries(TEXTOS)) {
    for (const id of IDS) {
      // Desde el 12 nov 2026 lo nuevo solo se escribe en español e inglés (de/fr/it, «próximamente»).
      if (!DISPONIBLES.includes(id) && !(id in e)) continue;
      assert.ok(id in e, `${clave}: falta ${id}`);
      if (id === 'es' && vaciosEs.has(clave)) continue;
      const v = e[id];
      assert.equal(Array.isArray(v), Array.isArray(e.es), `${clave} (${id}): forma distinta`);
      for (const s of [].concat(v)) assert.ok(s.trim(), `${clave} (${id}): vacío`);
      if (Array.isArray(v)) assert.equal(v.length, 2, `${clave} (${id}): singular y plural`);
      if (!vaciosEs.has(clave)) assert.equal(marcas([].concat(v).join(' ')), marcas([].concat(e.es).join(' ')), `${clave} (${id}): marcas`);
    }
  }
});

test('todas las claves data-t* del HTML de la app existen', () => {
  const html = readFileSync(new URL('../app/index.html', import.meta.url), 'utf8');
  const claves = [...html.matchAll(/data-t(?:-html|-aria|-tip|-ph)?="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(claves.length > 50);
  for (const c of claves) assert.ok(TEXTOS[c], `app/index.html: ${c} no está en textos.js`);
});

test('cada etiqueta corta tiene inglés (y alemán, francés e italiano, si los tiene, no vacíos)', () => {
  for (const [es, e] of Object.entries(ETIQUETAS)) for (const id of ['en', 'de', 'fr', 'it']) if (id === 'en' || id in e) assert.ok(e[id]?.trim(), `${es}: falta ${id}`);
});

test('t, tn y etiqueta en el idioma actual; {X} pone mayúscula; un idioma desconocido no cambia nada', () => {
  assert.equal(t('inicio.iniciar'), 'Start');
  fijarIdioma('fr');
  assert.equal(t('inicio.iniciar'), 'Commencer');
  assert.equal(t('carga.listo', { que: t('sistema.muscular.frase') }), 'Système musculaire prêt');
  assert.equal(tn('estado.ocultas', 1), '1 masquée');
  assert.equal(tn('estado.ocultas', 3), '3 masquées');
  assert.equal(etiqueta('Par craneal XI'), 'Nerf crânien XI');
  assert.equal(etiqueta('Hueso largo · pie'), 'Os long · pied');
  fijarIdioma('de');
  assert.equal(etiqueta('Hueso largo · pie'), 'Röhrenknochen · Fuß');           // en alemán, sustantivo con mayúscula
  fijarIdioma('xx');
  assert.equal(idioma(), 'de');
  fijarIdioma('es');
  assert.equal(etiqueta('Lado izquierdo'), 'Lado izquierdo');
  assert.equal(t('no.existe'), 'no.existe');
  fijarIdioma('en');
});

test('el idioma se guarda y se lee de este navegador; sin almacenamiento o con un valor raro, inglés', () => {
  const st = memoria();
  assert.equal(leerIdioma(st), 'en');
  fijarIdioma('es', st);
  assert.equal(st.datos[CLAVE], 'es');
  assert.equal(leerIdioma(st), 'es');
  assert.equal(leerIdioma(memoria({ [CLAVE]: 'it' })), 'en');          // «próximamente»: vuelve al predeterminado
  assert.equal(leerIdioma(memoria({ [CLAVE]: 'klingon' })), 'en');
  assert.equal(leerIdioma({ getItem: () => { throw new Error('bloqueado'); } }), 'en');
  fijarIdioma('en');
});

test('nombres de piezas: tabla del idioma, latín si falta (y en alemán), inglés de Z-Anatomy sin el lado', () => {
  const costilla = { tituloEs: 'Séptima costilla', latin: 'Costa VII', en: 'Seventh rib (left)' };
  const raro = { tituloEs: 'Canal central', latin: 'Canalis centralis', en: "Central canal'" };
  ponerTabla('fr', { 'Seventh rib': 'Septième côte' });
  assert.equal(nombrePieza(costilla), 'Seventh rib');
  assert.equal(nombrePieza(raro), 'Central canal');
  fijarIdioma('fr');
  assert.equal(nombrePieza(costilla), 'Septième côte');
  assert.equal(nombrePieza(raro), 'Canalis centralis');
  fijarIdioma('de');
  assert.equal(nombrePieza(costilla), 'Costa VII');
  fijarIdioma('es');
  assert.equal(nombrePieza(costilla), 'Séptima costilla');
  assert.equal(nombreGrupo('Rib_Cage', { nombreEs: 'Caja torácica', latin: 'Cavea thoracis' }), 'Caja torácica');
  fijarIdioma('en');
  assert.equal(nombreGrupo('Rib_Cage', { nombreEs: 'Caja torácica', latin: 'Cavea thoracis' }), 'Rib Cage');
});

test('las tablas de nombres publicadas traen los nombres oficiales', () => {
  const fr = JSON.parse(readFileSync(new URL('../public/i18n/nombres-fr.json', import.meta.url), 'utf8'));
  const it = JSON.parse(readFileSync(new URL('../public/i18n/nombres-it.json', import.meta.url), 'utf8'));
  assert.equal(fr.Humerus, 'Humérus');
  assert.equal(it.Humerus, 'Omero');
  assert.equal(fr.Heart, 'Cœur');
  assert.ok(Object.keys(fr).length > 1500 && Object.keys(it).length > 1500);
});

test('contenido: traducción por la huella del texto español, español si falta, y citas con el formato del idioma', () => {
  ponerMemoria('fr', { [huella('Flexión del codo.')]: 'Flexion du coude.' });
  fijarIdioma('fr');
  assert.equal(tr('Flexión del codo.'), 'Flexion du coude.');
  assert.equal(tr('Texto sin traducir.'), 'Texto sin traducir.');
  assert.equal(traducido('Texto sin traducir.'), false);
  assert.equal(trCita('Terminologia Anatomica, 2.ª ed. (FIPAT, 2019), término n.º 1180'), 'Terminologia Anatomica, 2e éd. (FIPAT, 2019), terme n° 1180');
  assert.equal(trCita('TeachMeAnatomy: «The Humerus»'), 'TeachMeAnatomy : « The Humerus »');
  fijarIdioma('de');
  assert.equal(trCita('Wikipedia (en inglés): «Lip»'), 'Wikipedia (englisch): „Lip“');
  fijarIdioma('es');
  assert.equal(tr('Flexión del codo.'), 'Flexión del codo.');
  assert.equal(trCita('TeachMeAnatomy: «The Humerus»'), 'TeachMeAnatomy: «The Humerus»');
  fijarIdioma('en');
});

test('las memorias de contenido publicadas: el inglés lo tiene todo; alemán, francés e italiano («próximamente»), solo huellas del inglés; sin textos vacíos', () => {
  const leer = (id) => JSON.parse(readFileSync(new URL(`../public/i18n/contenido-${id}.json`, import.meta.url), 'utf8'));
  const [en, ...otros] = ['en', 'de', 'fr', 'it'].map(leer);
  const claves = Object.keys(en).sort();
  assert.ok(claves.length > 2600, `solo ${claves.length} textos`);
  // Desde el 12 nov 2026 solo se traduce al inglés: los demás conservan lo que tenían, sin huellas que el inglés no tenga.
  for (const m of otros) for (const k of Object.keys(m)) assert.ok(k in en, `huella ${k} sin inglés`);
  for (const m of [en, ...otros]) for (const v of Object.values(m)) assert.ok(v.trim());
});
