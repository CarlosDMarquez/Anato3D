// Traducción del contenido (fichas y módulos de estudio) a en, de, fr, it: qué hay que traducir y qué falta.
// Uso (desde web/):
//   node scripts/contenido-i18n.mjs              estado: textos y traducciones que faltan por idioma
//   node scripts/contenido-i18n.mjs --lote N     los N siguientes textos sin traducir, en JSON { huella: español }
//                                     (con --donde, cada texto lleva detrás las piezas en las que sale)
//   node scripts/contenido-i18n.mjs --unir F     añade un lote traducido (F: { huella: [en] } o { huella: [en, de, fr, it] })
//   node scripts/contenido-i18n.mjs --limpiar    quita las traducciones de textos que ya no existen (también al unir)
//   node scripts/contenido-i18n.mjs --comprobar  termina con código 1 si falta alguna traducción al inglés
//
// Desde el 12 nov 2026 solo se exige el inglés: alemán, francés e italiano están «próximamente» y conservan lo que ya
// tenían (lo que les falte se muestra en español si algún día se activan).
//
// Los textos son los que muestra la app en español: los de las fichas de todas las piezas de los dos modelos (como las
// construye resolvePart, con los grupos de los metadatos), las descripciones de los grupos, el glosario latino de las
// etimologías generadas, y los del módulo de estudio. Cada traducción se guarda con la huella de su texto español
// (i18n/contenido.js) en public/i18n/contenido-<idioma>.json. Los nombres de los grupos no se traducen aquí: salen de
// las tablas oficiales (i18n/nombres.js), igual que en la ruta de la ficha.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { resolvePart } from '../src/data/resolve.js';
import { latinEtymology } from '../src/data/musculos.js';
import { LATIN } from '../src/data/latin.js';
import { GRUPOS } from '../src/data/grupos.js';
import { classify } from '../src/systems.js';
import { MODULOS } from '../src/content/index.js';
import { esCitaConFormato, huella } from '../src/i18n/contenido.js';
import { FUENTES } from '../src/content/fuentes.js';
import { fijarIdioma } from '../src/i18n/idioma.js';
import { nombreGrupo, ponerTabla } from '../src/i18n/nombres.js';

const WEB = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const MODELS = path.join(WEB, 'public/models');
const I18N = path.join(WEB, 'public/i18n');
export const DESTINOS = ['en', 'de', 'fr', 'it'];
export const REQUERIDOS = ['en'];

function nodes(file) {
  const b = fs.readFileSync(path.join(MODELS, file));
  return JSON.parse(b.subarray(20, 20 + b.readUInt32LE(12)).toString('utf8')).nodes ?? [];
}

/** Textos que hay que traducir ({ huella → { es, tipo } }, en orden de lectura) y nombres de grupo en español. */
export function textosDelContenido() {
  // Los grupos de los metadatos (male-muscular.json…) entran en GRUPOS como en la app, antes de construir las fichas.
  for (const f of fs.readdirSync(MODELS).filter((f) => f.endsWith('.json'))) {
    try {
      for (const [id, g] of Object.entries(JSON.parse(fs.readFileSync(path.join(MODELS, f), 'utf8')).groups ?? {})) GRUPOS[id] ??= g;
    } catch { /* manifest y otros JSON sin grupos */ }
  }
  const grupos = new Set(Object.values(GRUPOS).map((g) => g.nombre).filter(Boolean));
  const textos = new Map();
  const add = (tipo, s, donde) => {
    if (typeof s !== 'string' || !s.trim() || grupos.has(s)) return;
    const h = huella(s);
    const ya = textos.get(h);
    if (ya && ya.es !== s) throw new Error(`dos textos con la misma huella ${h}: «${ya.es}» y «${s}»`);
    if (!ya) textos.set(h, { es: s, tipo, donde: donde ? [donde] : [] });
    else if (donde && ya.donde.length < 3 && !ya.donde.includes(donde)) ya.donde.push(donde);
  };

  // 1. Módulos de estudio (lo más visible al estudiar).
  for (const m of MODULOS) {
    add('modulo', m.titulo);
    add('modulo', m.publico);
    m.objetivos.forEach((o) => add('modulo', o));
    add('modulo', m.revision?.notas);
    for (const f of m.estructuras) {
      add('modulo.ficha', f.nombre);
      add('modulo.ficha', f.descripcion);
      add('modulo.ficha', f.funcion);
      Object.values(f.campos ?? {}).forEach((v) => add('modulo.ficha', v));
      (f.relaciones ?? []).forEach((r) => add('modulo.ficha', r.texto));
      [].concat(f.simplificaciones ?? []).forEach((s) => add('modulo.ficha', s));
      add('modulo.ficha', f.revision?.notas);
    }
    for (const s of m.leccion) { add('modulo.leccion', s.titulo); add('modulo.leccion', s.texto); }
    for (const p of m.preguntas) {
      add('modulo.pregunta', p.enunciado);
      add('modulo.pregunta', p.correcta);
      p.distractores.forEach((d) => add('modulo.pregunta', d));
      add('modulo.pregunta', p.explicacion);
    }
    Object.values(m.distractoresExtra ?? {}).flat().forEach((d) => add('modulo.pregunta', d));
  }
  // Citas de las fuentes que son frases (las de formato bibliográfico se adaptan con trCita, sin memoria).
  for (const f of Object.values(FUENTES)) if (!esCitaConFormato(f.texto)) add('fuentes', f.texto);
  // 2. Glosario latino de las etimologías generadas.
  for (const v of Object.values(LATIN)) add('glosario', v);
  // 3. Descripciones de los grupos.
  for (const g of Object.values(GRUPOS)) add('grupo', g.descripcion);
  // 4. Fichas de las piezas de todos los modelos.
  const porTipo = { descripcion: [], datos: [], campos: [], etimologia: [], fuentes: [], modelo: [] };
  for (const file of fs.readdirSync(MODELS).filter((f) => f.endsWith('.glb')).sort()) {
    for (const n of nodes(file)) {
      const x = n.extras ?? {};
      if (!x.system || !classify(x)) continue;
      const info = resolvePart((n.name ?? '').replace(/\s/g, '_').replace(/[[\].:/]/g, ''), x);
      const t = info.title;
      porTipo.descripcion.push([info.entry?.descripcion, t]);
      porTipo.datos.push(...(info.datos ?? []).map((s) => [s, t]));
      porTipo.campos.push(...(info.fields ?? []).map((f) => [f.value, `${t} · ${f.label}`]));
      const e = info.entry?.etimologia;
      if (e && ![info.latin, x.name_la].some((l) => l && latinEtymology(l) === e)) porTipo.etimologia.push([e, t]);
      porTipo.fuentes.push([info.fuentes?.nota, t], ...(info.fuentes?.lista ?? []).flatMap((l) => [[l.papel, t], ...(esCitaConFormato(l.texto) ? [] : [[l.texto, t]])]));
      // Línea «Modelo 3D»: se traducen las de las piezas hechas para Anato3D; las de Z-Anatomy son atribuciones literales.
      if (/^Anato3D\b/.test(info.source ?? '')) porTipo.modelo.push([info.source, t]);
    }
  }
  for (const [tipo, lista] of Object.entries(porTipo)) lista.forEach(([s, donde]) => add(tipo, s, donde));
  return { textos, grupos: [...grupos] };
}

const archivo = (id) => path.join(I18N, `contenido-${id}.json`);
const leer = (id) => (fs.existsSync(archivo(id)) ? JSON.parse(fs.readFileSync(archivo(id), 'utf8')) : {});
const escribir = (id, m) => fs.writeFileSync(archivo(id), `${JSON.stringify(Object.fromEntries(Object.entries(m).sort()), null, 0)}\n`);

/** Nombres oficiales de los grupos en cada idioma (los de la ruta de la ficha), con la huella de su nombre español. */
function nombresDeGrupos() {
  for (const id of ['fr', 'it']) ponerTabla(id, JSON.parse(fs.readFileSync(path.join(I18N, `nombres-${id}.json`), 'utf8')));
  const out = Object.fromEntries(DESTINOS.map((id) => [id, {}]));
  for (const id of DESTINOS) {
    fijarIdioma(id);
    for (const [gid, g] of Object.entries(GRUPOS)) if (g.nombre) out[id][huella(g.nombre)] = nombreGrupo(gid, { ...g, nombreEs: g.nombre });
  }
  fijarIdioma('en');
  return out;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { textos } = textosDelContenido();
  const memorias = Object.fromEntries(DESTINOS.map((id) => [id, leer(id)]));
  const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };

  if (arg('--unir')) {
    const lote = JSON.parse(fs.readFileSync(arg('--unir'), 'utf8'));
    let n = 0;
    for (const [h, tr] of Object.entries(lote)) {
      if (!textos.has(h)) throw new Error(`huella desconocida en el lote: ${h}`);
      if (!Array.isArray(tr) || ![1, 4].includes(tr.length) || tr.some((s) => typeof s !== 'string' || !s.trim())) throw new Error(`${h}: se esperan [en] o [en, de, fr, it]`);
      tr.forEach((t, i) => (memorias[DESTINOS[i]][h] = t.trim()));
      n++;
    }
    console.log(`lote unido: ${n} textos`);
  }
  // Los nombres de grupo se rehacen siempre desde las tablas oficiales.
  const grupos = nombresDeGrupos();
  for (const id of DESTINOS) Object.assign(memorias[id], grupos[id]);
  // Traducciones sin uso: su texto español cambió o ya no existe. Se quitan al escribir.
  const vigentes = new Set([...textos.keys(), ...DESTINOS.flatMap((id) => Object.keys(grupos[id]))]);
  const sobran = [...new Set(DESTINOS.flatMap((id) => Object.keys(memorias[id])))].filter((h) => !vigentes.has(h));
  if (arg('--unir') || process.argv.includes('--limpiar') || !fs.existsSync(archivo('en'))) {
    for (const id of DESTINOS) {
      for (const h of sobran) delete memorias[id][h];
      escribir(id, memorias[id]);
    }
    if (sobran.length) console.log(`traducciones sin uso quitadas: ${sobran.length}`);
  } else if (sobran.length) console.log(`traducciones sin uso: ${sobran.length} (se quitan con --limpiar o al unir un lote)`);

  const falta = [...textos.entries()].filter(([h]) => REQUERIDOS.some((id) => !memorias[id][h]));
  if (arg('--lote')) {
    const donde = process.argv.includes('--donde');
    const ver = (v) => (donde && v.donde.length ? `${v.es}  ⟨${v.donde.join('; ')}⟩` : v.es);
    console.log(JSON.stringify(Object.fromEntries(falta.slice(0, Number(arg('--lote'))).map(([h, v]) => [h, ver(v)])), null, 1));
  } else {
    const chars = (l) => l.reduce((a, [, v]) => a + v.es.length, 0);
    const tipos = {};
    for (const [h, v] of falta) (tipos[v.tipo] ??= []).push([h, v]);
    console.log(`textos: ${textos.size} (${chars([...textos.entries()])} caracteres); sin traducir: ${falta.length} (${chars(falta)} caracteres)`);
    for (const [tipo, l] of Object.entries(tipos)) console.log(`  ${tipo}: ${l.length} (${chars(l)} caracteres)`);
    if (process.argv.includes('--comprobar') && falta.length) process.exit(1);
  }
}
