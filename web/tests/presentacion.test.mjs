// Página de presentación (index.html, src/presentacion/): que todo lo que dice salga de la app de verdad.
// - Cada texto con data-t* tiene su inglés, y el inglés no tiene claves de más.
// - Las cifras (piezas de cada sistema y de cada modelo, sistemas, lecciones, recorridos) son las de los modelos y la
//   biblioteca: si se reconstruye un modelo o se añade una lección, esta prueba avisa.
// - Las etiquetas de la app que cita (Iniciar, Configuración, Mostrar genitales externos, Reportar un problema) y los
//   títulos de los recorridos son los de la app, en los dos idiomas.
// - Las imágenes existen (también las capturas en inglés), los enlaces a la app van a /app/ y los de donar y el correo
//   son los de la app.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { EN } from '../src/presentacion/textos.js';
import { SYSTEMS, classify } from '../src/systems.js';
import { RECORRIDOS } from '../src/biblioteca/recorridos.js';
import { TEXTOS } from '../src/i18n/textos.js';
import { TEXTOS_BIBLIOTECA } from '../src/i18n/textos-biblioteca.js';
import { DONAR_URL, enlaceDonar } from '../src/donar.js';
import { traducirAIngles } from '../src/presentacion/traducir.mjs';
import { PROPIOS } from '../src/presentacion/iconos.js';
import { SYSTEM_ICONS, UI_ICONS } from '../src/ui/icon-data.js';

const web = (r) => fileURLToPath(new URL(`../${r}`, import.meta.url));
const html = fs.readFileSync(web('index.html'), 'utf8');
const limpio = (s) => s.replace(/\s+/g, ' ').trim();
const entidades = (s) => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

// Texto español de cada clave (el del HTML).
const textos = [...html.matchAll(/<([a-z0-9]+)\b[^>]*\sdata-t="([^"]+)"[^>]*>([^<]*)<\/\1>/g)].map((m) => ({ clave: m[2], es: limpio(entidades(m[3])) }));
const conHtml = [...html.matchAll(/<([a-z0-9]+)\b[^>]*\sdata-t-html="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/g)].map((m) => ({ clave: m[2], es: limpio(m[3]) }));
const atributos = [...html.matchAll(/<[a-z0-9]+\b([^>]*)\sdata-t-attr="([^"]+)"([^>]*)>/g)].flatMap((m) => m[2].split(';').map((p) => {
  const [attr, clave] = p.split(':').map((x) => x.trim());
  const valor = new RegExp(`\\s${attr}="([^"]*)"`).exec(`${m[1]} ${m[3]}`)?.[1];
  return { clave, attr, es: valor };
}));
const ES = new Map();
for (const { clave, es } of [...textos, ...conHtml, ...atributos]) {
  if (!ES.has(clave)) ES.set(clave, new Set());
  ES.get(clave).add(es);
}

test('cada texto de la página tiene su inglés, y el inglés no tiene claves de más', () => {
  assert.ok(textos.length > 150, `pocos textos con data-t (${textos.length}): ¿cambió el marcado?`);
  // Todo elemento con data-t es de solo texto (sin etiquetas dentro), para que se pueda cambiar con textContent.
  const todos = [...html.matchAll(/\sdata-t="([^"]+)"/g)].length;
  assert.equal(textos.length, todos, 'algún elemento con data-t tiene etiquetas dentro: usa data-t-html');
  for (const [clave, valores] of ES) {
    assert.ok(EN[clave]?.trim(), `${clave}: falta el inglés en src/presentacion/textos.js`);
    for (const v of valores) assert.ok(v?.trim(), `${clave}: el español está vacío`);
    // Una clave repetida (el botón «Abrir Anato3D» sale cuatro veces) dice lo mismo en todas partes.
    assert.equal(valores.size, 1, `${clave}: el español cambia entre sus apariciones (${[...valores].join(' | ')})`);
  }
  for (const clave of Object.keys(EN)) assert.ok(ES.has(clave), `textos.js: «${clave}» no se usa en index.html`);
});

test('los textos con enlaces tienen los mismos enlaces en los dos idiomas', () => {
  for (const { clave, es } of conHtml) {
    const enlaces = (s) => [...s.matchAll(/href="([^"]+)"/g)].map((m) => m[1].replace(/deed\.es$/, ''));
    assert.deepEqual(enlaces(EN[clave]), enlaces(es), clave);
    assert.ok([...EN[clave].matchAll(/<a /g)].every((m, i, t) => t.length === [...EN[clave].matchAll(/rel="noopener noreferrer"/g)].length), `${clave}: enlace sin rel`);
  }
});

// ── Cifras ───────────────────────────────────────────
function piezasPorSistema(modelo) {
  const b = fs.readFileSync(web(`public/models/${modelo}.glb`));
  const gltf = JSON.parse(b.subarray(20, 20 + b.readUInt32LE(12)).toString('utf8'));
  const piezas = new Map();
  for (const n of gltf.nodes) if (n.mesh !== undefined && n.extras) piezas.set(n.name, n.extras);
  const idx = JSON.parse(fs.readFileSync(web(`public/models/${modelo}-index.json`), 'utf8'));
  for (const lista of Object.values(idx)) for (const [id, ex] of lista) piezas.set(id, ex);
  const por = {};
  for (const ex of piezas.values()) {
    const c = classify(ex);
    if (c) por[c.system] = (por[c.system] ?? 0) + 1;
  }
  return por;
}

test('las piezas de cada sistema y los totales son los de los modelos', () => {
  const male = piezasPorSistema('male');
  const female = piezasPorSistema('female');
  const tarjetas = [...html.matchAll(/<li class="sistema"[\s\S]*?<\/li>/g)].map((m) => m[0]);
  assert.deepEqual(tarjetas.map((t) => /data-sysicon="(\w+)"/.exec(t)[1]), SYSTEMS.map((s) => s.id), 'una tarjeta por sistema, en el orden de la barra');
  for (const t of tarjetas) {
    const id = /data-sysicon="(\w+)"/.exec(t)[1];
    const nums = [...t.matchAll(/data-num="(\d+)">(\d+)</g)].map((m) => { assert.equal(m[1], m[2]); return Number(m[1]); });
    const esperado = male[id] === female[id] ? [male[id]] : [male[id], female[id]];
    assert.deepEqual(nums, esperado, `${id}: piezas (hombre${esperado.length > 1 ? ', mujer' : ''})`);
    assert.match(t, new RegExp(`style="--sis: ${SYSTEMS.find((s) => s.id === id).color}"`), `${id}: el color es el de la app`);
  }
  const total = (por) => Object.values(por).reduce((a, b) => a + b, 0);
  const hero = /<dl class="cifras">([\s\S]*?)<\/dl>/.exec(html)[1];
  const cifras = [...hero.matchAll(/data-num="(\d+)"/g)].map((m) => Number(m[1]));
  assert.deepEqual(cifras.slice(0, 2), [SYSTEMS.length, 2]);
  // «+2900 piezas 3D»: cierto para los dos modelos, y sin quedarse corto por más de 100.
  assert.ok(cifras[2] <= Math.min(total(male), total(female)) && cifras[2] > Math.min(total(male), total(female)) - 100, `piezas: +${cifras[2]} frente a ${total(male)} y ${total(female)}`);
  // La app, al compartirla (/app/), da la misma cifra.
  assert.equal(Number(/más de (\d+) piezas/.exec(fs.readFileSync(web('app/index.html'), 'utf8'))?.[1]), cifras[2], 'app/index.html: og:description');
  const catalogo = JSON.parse(fs.readFileSync(web('src/biblioteca/generado/catalogo.json'), 'utf8'));
  assert.equal(cifras[3], catalogo.lecciones.length, 'lecciones');
  // Las mismas cifras dentro de los textos, en los dos idiomas.
  for (const [clave, n] of [['que.estudiar.texto', catalogo.lecciones.length], ['que.estudiar.texto', RECORRIDOS.length], ['sis.titulo', SYSTEMS.length], ['edu.recorridos', RECORRIDOS.length]]) {
    for (const s of [[...ES.get(clave)][0], EN[clave]]) assert.match(s, new RegExp(`\\b${n}\\b`), `${clave}: ${n}`);
  }
});

test('los recorridos y las etiquetas que cita la página son los de la app', () => {
  const recs = [...html.matchAll(/data-t="rec\.([a-z-]+)">([^<]+)</g)].map((m) => [m[1], m[2]]);
  assert.deepEqual(recs.map(([id]) => id), RECORRIDOS.map((r) => r.id), 'los 11 recorridos, en orden');
  for (const [id, es] of recs) {
    assert.equal(es, RECORRIDOS.find((r) => r.id === id).titulo, `rec.${id} (es)`);
    assert.equal(EN[`rec.${id}`], TEXTOS_BIBLIOTECA[`rec.${id}.titulo`].en, `rec.${id} (en)`);
  }
  const citas = [
    ['tut.entrada', TEXTOS['inicio.iniciar']],
    ['edu.d3', TEXTOS['ajustes.genitales']],
    ['edu.d3', TEXTOS['inicio.configuracion']],
    ['edu.d4', TEXTOS_BIBLIOTECA['rep.boton']],
    ['con.reportar.texto', TEXTOS_BIBLIOTECA['rep.boton']],
  ];
  for (const [clave, t] of citas) {
    assert.ok([...ES.get(clave)][0].includes(t.es), `${clave}: no cita «${t.es}»`);
    assert.ok(EN[clave].includes(t.en), `${clave} (en): no cita «${t.en}»`);
  }
  // El aviso legal, palabra por palabra el de la app.
  assert.equal([...ES.get('edu.aviso.legal')][0], TEXTOS['creditos.aviso'].es);
  assert.equal(EN['edu.aviso.legal'], TEXTOS['creditos.aviso'].en);
});

test('imágenes, enlaces a la app, donar y correo', () => {
  const rutas = new Set();
  for (const m of html.matchAll(/\s(?:src|href)="(\/[^"?#]+)[^"]*"/g)) rutas.add(m[1]);
  for (const m of html.matchAll(/\s(?:srcset|imagesrcset)="([^"]+)"/g)) for (const p of m[1].split(',')) rutas.add(p.trim().split(/\s+/)[0]);
  for (const m of html.matchAll(/content="(\/presentacion\/[^"]+)"/g)) rutas.add(m[1]);
  const locales = [...html.matchAll(/<(?:img|meta)\b[^>]*\sdata-loc[^>]*>/g)].map((m) => m[0]);
  assert.ok(locales.length >= 5);
  for (const el of locales) {
    const es = [...el.matchAll(/(\/presentacion\/(?:ui-[a-z]+|og)-)es(-[\dx]+\.(?:webp|jpg))/g)];
    assert.ok(es.length, `data-loc sin imagen en español: ${el.slice(0, 90)}`);
    for (const m of es) rutas.add(`${m[1]}en${m[2]}`);
  }
  for (const r of rutas) {
    // /app/ y /en/ son páginas (app/index.html y la que genera vite.config.js), no archivos de public/.
    if (r === '/app/' || r === '/en/' || r.startsWith('/src/')) continue;
    assert.ok(fs.existsSync(web(`public${r}`)), `no existe public${r}`);
  }
  assert.ok(fs.existsSync(web('src/presentacion/inicio.js')));
  assert.ok(fs.existsSync(web('app/index.html')), 'la app está en web/app/index.html');
  const abrir = [...html.matchAll(/<a\b[^>]*\sdata-abrir\b[^>]*>/g)].map((m) => /href="([^"]+)"/.exec(m[0])[1]);
  assert.ok(abrir.length >= 3);
  for (const h of abrir) assert.equal(h, '/app/');
  // Donar: el enlace de la app (src/donar.js); el correo: el de los créditos de la app.
  const paypal = /href="(https:\/\/paypal\.me\/[^"]+)"/.exec(html)[1];
  assert.equal(paypal, enlaceDonar(DONAR_URL));
  // El correo, en sus tres apariciones (dos mailto y el texto visible), es el de los créditos de la app.
  const correos = [...html.matchAll(/mailto:([^"?]+)/g)].map((m) => m[1]);
  correos.push(/class="contacto-correo"><a [^>]*>([^<]+)</.exec(html)[1]);
  assert.equal(correos.length, 3);
  for (const c of correos) assert.ok(TEXTOS['creditos.neurofuture'].es.includes(c), `correo distinto: ${c}`);
  // Cada icono existe (uno desconocido saldría vacío sin avisar).
  for (const [, k] of html.matchAll(/data-icon="(\w+)"/g)) assert.ok(PROPIOS[k] ?? UI_ICONS[k], `icono desconocido: ${k}`);
  for (const [, k] of html.matchAll(/data-sysicon="(\w+)"/g)) assert.ok(SYSTEM_ICONS[k], `icono de sistema desconocido: ${k}`);
  // Enlaces externos en pestaña nueva, siempre con rel.
  for (const m of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) assert.match(m[0], /rel="noopener noreferrer"/);
});

test('el manifiesto abre la app y la página comparte el idioma con ella', async () => {
  const man = JSON.parse(fs.readFileSync(web('public/manifest.webmanifest'), 'utf8'));
  assert.equal(man.start_url, '/app/');
  assert.equal(man.theme_color, '#070708');
  const { CLAVE } = await import('../src/i18n/idioma.js');
  assert.match(html, new RegExp(`localStorage\\.getItem\\('${CLAVE.replace('.', '\\.')}'\\)`), 'el script del <head> lee la clave de la app');
  assert.match(fs.readFileSync(web('src/presentacion/inicio.js'), 'utf8'), new RegExp(`CLAVE = '${CLAVE.replace('.', '\\.')}'`));
});

test('la página en inglés (/en/) sale entera de index.html y textos.js: sin nada en español y con sus capturas y cifras', () => {
  const en = traducirAIngles(html, EN);
  assert.match(en, /<html lang="en"/);
  for (const m of en.matchAll(/<([a-z0-9]+)\b[^>]*\sdata-t="([^"]+)"[^>]*>([^<]*)<\/\1>/g)) {
    assert.equal(entidades(m[3]), EN[m[2]], `data-t="${m[2]}"`);
  }
  for (const m of en.matchAll(/<[a-z0-9]+\b([^>]*)\sdata-t-attr="([^"]+)"([^>]*)>/g)) {
    for (const par of m[2].split(';')) {
      const [attr, clave] = par.split(':').map((x) => x.trim());
      const valor = new RegExp(`\\s${attr}="([^"]*)"`).exec(`${m[1]} ${m[3]}`)[1];
      assert.equal(entidades(valor), EN[clave], `${attr} de ${clave}`);
    }
  }
  // Ninguna captura en español; las cifras con su formato; el inglés marcado como el idioma actual.
  assert.ok(!/\/presentacion\/(?:ui-[a-z]+|og)-es-/.test(en), 'queda una imagen en español');
  assert.match(en, /<meta property="og:image" content="\/presentacion\/og-en-1200x630\.jpg"/);
  assert.match(en, /<meta property="og:locale" content="en_US"/);
  assert.match(en, /data-num="2900">2,900</);
  assert.match(en, /data-idioma="en"[^>]*aria-current="true"/);
  assert.doesNotMatch(en, /data-idioma="es"[^>]*aria-current/);
  // El script del <head> sigue igual (lleva a / si se eligió el español).
  assert.match(en, /location\.replace/);
  // Una clave sin inglés no pasa en silencio.
  assert.throws(() => traducirAIngles(html, { ...EN, 'hero.titulo': undefined }), /hero\.titulo/);
  assert.throws(() => traducirAIngles(html, { ...EN, 'hero.titulo': ' ' }), /hero\.titulo/);
  const { 'pie.modelos': _sin, ...incompleto } = EN;
  assert.throws(() => traducirAIngles(html, incompleto), /pie\.modelos/);
});

// Texto visible fuera de los elementos que se traducen: en /en/ se quedaría en español sin que nada avise. Solo se
// permite lo que es igual en los dos idiomas (marca, ES/EN, cifras, teclas, el correo y los nombres en latín, lang="la").
test('no queda texto visible sin traducir: lo que no lleva data-t es igual en los dos idiomas', () => {
  const VACIOS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
  const correo = /mailto:([^"?]+)/.exec(html)[1];
  const NEUTROS = [/^[\d.,+·/]+$/, /^[A-Z]$/, /^(?:Anato|3D|ES|EN|Ctrl|&nbsp;)$/, /^Anato3D · NeuroFuture · Mexicali, B\.C\.$/];
  const pila = [];
  const sueltos = [];
  let saltar = null;
  for (const m of html.matchAll(/<!--[\s\S]*?-->|<!doctype[^>]*>|<(\/?)([a-zA-Z0-9]+)\b([^>]*)>|([^<]+)/gi)) {
    if (m[0].startsWith('<!')) continue;
    if (m[2]) {
      const tag = m[2].toLowerCase();
      if (saltar) { if (m[1] && tag === saltar) saltar = null; continue; }
      if (m[1]) { const i = pila.map((p) => p.tag).lastIndexOf(tag); if (i >= 0) pila.length = i; continue; }
      if (tag === 'script' || tag === 'style') { saltar = tag; continue; }
      if (VACIOS.has(tag)) continue;
      pila.push({ tag, exento: /\sdata-t(?:-html)?="|\slang="la"/.test(` ${m[3]}`) });
      continue;
    }
    const t = m[4].replace(/\s+/g, ' ').trim();
    if (saltar || !t || pila.some((p) => p.exento)) continue;
    if (t === correo || NEUTROS.some((re) => re.test(t))) continue;
    sueltos.push(t);
  }
  assert.deepEqual(sueltos, [], 'texto sin data-t (en /en/ saldría en español)');
  // Y los nombres en latín van marcados como tal (lectores de pantalla), uno por sistema.
  assert.equal([...html.matchAll(/<p class="latin" lang="la">[^<]+<\/p>/g)].length, SYSTEMS.length);
});
