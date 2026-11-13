// Fichas del sistema linfático (src/data/linfatico/), su paso por resolvePart y el lado de las piezas (sideOf).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { resolvePart, sideOf } from '../src/data/resolve.js';
import { FICHAS_LINF, GRUPOS_LINF, REPETIDAS_LINF, CONTRATO_LINF, W, MODELO, TA, revisarFichasLinf, latinLinf, claveLinf, textoDe } from '../src/data/linfatico/index.js';
import { CITAS_LINF } from '../src/data/linfatico/comprobadas.js';
import { huellaCita } from '../scripts/biblioteca/fuentes.mjs';
import { TIPOS_ESTRUCTURA } from '../src/biblioteca/formato.js';
import { GRUPOS_ESTRUCTURA } from '../src/biblioteca/filtros.js';
import { GRUPOS } from '../src/data/grupos.js';
import { ETIQUETAS } from '../src/i18n/textos.js';

const MODELS = path.join(path.dirname(fileURLToPath(import.meta.url)), '../public/models');
function piezasDe(modelo) {
  const out = [];
  for (const f of fs.readdirSync(MODELS).filter((f) => f.endsWith('.glb') && f.startsWith(`${modelo}`))) {
    const b = fs.readFileSync(path.join(MODELS, f));
    const j = JSON.parse(b.subarray(20, 20 + b.readUInt32LE(12)).toString('utf8'));
    for (const n of j.nodes ?? []) if (n.extras?.system) out.push({ name: (n.name ?? '').replace(/\s/g, '_').replace(/[[\].:/]/g, ''), x: n.extras });
  }
  return out;
}
const todas = [...piezasDe('male'), ...piezasDe('female')];
const ctx = () => ({ piezas: new Set(todas.map((p) => p.name.replace(/_[LR]$/, ''))), citas: CITAS_LINF, huella: huellaCita, ta2: null });

test('sideOf: «_L/_R» al final es el lado; «Left_/Right_» solo cuando las dos piezas comparten ficha', () => {
  assert.equal(sideOf('Submandibular_nodes_L'), 'L');
  assert.equal(sideOf('Rib_7_R'), 'R');
  assert.equal(sideOf('Right_testicular_artery_R'), 'R');
  assert.equal(sideOf('Left_Eyeball'), 'L');
  assert.equal(sideOf('Right_Eyeball'), 'R');
  for (const n of ['Left_colic_nodes', 'Right_colic_nodes', 'Right_gastric_nodes', 'Right_gastro_omental_nodes', 'Right_lymphatic_duct', 'Left_subclavian_vein', 'Left_atrium', 'Spleen', 'Thoracic_duct']) assert.equal(sideOf(n), null, n);
});

test('sideOf no cambia ninguna pieza con «_L/_R» de los modelos publicados, y de las «Left_/Right_» solo conserva el globo ocular', () => {
  const antes = (n) => (/_(L|R)$/.test(n) ? n.slice(-1) : /^(Left|Right)_/.test(n) ? (n.startsWith('Left_') ? 'L' : 'R') : null);
  const conservadas = new Set();
  for (const { name } of todas) {
    if (/_(L|R)$/.test(name)) assert.equal(sideOf(name), antes(name), name);
    else if (sideOf(name)) conservadas.add(name);
  }
  assert.deepEqual([...conservadas].sort(), ['Left_Eyeball', 'Right_Eyeball']);
});

test('todas las fichas linfáticas pasan la revisión: frases con fuente y citas comprobadas', () => {
  const errores = revisarFichasLinf(FICHAS_LINF, GRUPOS_LINF, ctx()).filter((p) => p.nivel === 'error');
  assert.deepEqual(errores, []);
  assert.deepEqual(REPETIDAS_LINF, []);
});

test('la revisión detecta frases sin fuente, citas sin comprobar, MODELO fuera de su campo, claves y vías inexistentes', () => {
  const base = FICHAS_LINF.Cisterna_chyli;
  const malas = {
    Cisterna_chyli: { ...base, localizacion: [['Está detrás de la aorta.']] },
    Thoracic_duct: { ...FICHAS_LINF.Thoracic_duct, reparo: [['Va junto a la aorta.', W('Thoracic_duct', 'esta cita no está en la página')]] },
    Right_lymphatic_duct: { ...FICHAS_LINF.Right_lymphatic_duct, recibe: [['Recibe tres troncos.', MODELO]] },
    Nodo_inventado: { ...base },
    Lumbar_trunk: { ...FICHAS_LINF.Lumbar_trunk, vias: { drena: ['Cisterna_inventada'] } },
    Spleen: { ...FICHAS_LINF.Spleen, ta2: undefined },
    Jugular_trunk: { ...FICHAS_LINF.Jugular_trunk, reparo: undefined },
  };
  const t = revisarFichasLinf(malas, {}, ctx()).filter((p) => p.nivel === 'error').map((p) => p.texto).join('\n');
  assert.match(t, /Cisterna_chyli · localizacion: frase sin fuente/);
  assert.match(t, /Thoracic_duct · reparo: cita sin comprobar/);
  assert.match(t, /Right_lymphatic_duct · recibe: MODELO solo vale/);
  assert.match(t, /Nodo_inventado: no existe en los modelos ni en el contrato/);
  assert.match(t, /vía «drena» a una clave que no existe: Cisterna_inventada/);
  assert.match(t, /Spleen: sin término TA2/);
  assert.match(t, /Jugular_trunk: falta «reparo»/);
});

test('cada pieza linfática de los modelos tiene ficha con el formato linfático (propia o la general del nodo)', () => {
  const linf = todas.filter((p) => p.x.system === 'lymphatic');
  assert.ok(linf.length >= 288);
  for (const { name, x } of linf) {
    const info = resolvePart(name, x);
    assert.ok(info.linfatico, name);
    assert.ok(info.entry.descripcion.length > 20, name);
    assert.ok(info.linfatico.refs.length > 0, name);
    assert.ok(!/[éè]/.test(info.latin ?? ''), `${name}: ${info.latin}`);
    if (x.tissue === 'node' && !FICHAS_LINF[claveLinf(x.name_en)]) assert.equal(info.generica, true, name);
  }
  const nodo = resolvePart('Submental_nodes_L', todas.find((p) => p.name === 'Submental_nodes_L').x);
  assert.match(nodo.entry.descripcion, /^Grupo de nodos \(ganglios\) linfáticos/);
  assert.deepEqual(nodo.fields.map((f) => f.label), ['Región', 'Localización', 'Reparo', 'Recibe', 'Drena en', 'En este modelo']);
});

test('una pieza nueva del contrato toma su ficha, su latín y sus chips; un vaso linfático sin ficha no cae en «Mucosa»', () => {
  const duct = resolvePart('Thoracic_duct', { system: 'lymphatic', subsystem: 'vessels', tissue: 'lymph_vessel', name_en: 'Thoracic duct', name_es: 'conducto torácico' });
  assert.equal(duct.title, 'Conducto torácico');
  assert.equal(duct.latin, 'Ductus thoracicus');
  assert.deepEqual(duct.chips, ['Vaso linfático', 'Conducto linfático']);
  assert.equal(duct.side, null);
  assert.match(textoDe(FICHAS_LINF.Thoracic_duct.drena), /ángulo venoso izquierdo/);
  const col = resolvePart('Lymphatic_vessels_of_neck_R', { system: 'lymphatic', subsystem: 'vessels', tissue: 'lymph_vessel', name_en: 'Lymphatic vessels of neck' });
  assert.equal(col.title, 'Vasos linfáticos del cuello');
  assert.equal(col.latin, 'Vasa lymphatica colli');
  assert.ok(col.chips.includes('Trazado esquemático') && col.chips.includes('Lado derecho'));
  const otro = resolvePart('Vaso_sin_ficha_L', { system: 'lymphatic', subsystem: 'vessels', tissue: 'lymph_vessel', name_en: 'Vaso sin ficha', name_es: 'vaso' });
  assert.equal(otro.chips[0], 'Vaso linfático');
  for (const [k, c] of Object.entries(CONTRATO_LINF)) if (!c.opcional && c.tipo !== 'nodo') assert.ok(FICHAS_LINF[k], `${k}: pieza del contrato sin ficha`);
});

test('latín del modelo corregido (sin acentos franceses; sinónimo de la TA tras «;»)', () => {
  assert.equal(latinLinf('Nodi aortici latérales'), 'Nodi aortici laterales');
  assert.equal(latinLinf('Nodi paratrachéales colli'), 'Nodi paratracheales colli');
  assert.equal(latinLinf('Nodi prepericadiaci'), 'Nodi prepericardiaci');
  assert.equal(latinLinf('Nodi axillares latérales nodi humerales'), 'Nodi axillares laterales; nodi humerales');
  assert.equal(latinLinf('Nodi infraclaviculares nodi deltopectorales'), 'Nodi infraclaviculares; nodi deltopectorales');
  assert.equal(latinLinf('Nodi submentales'), 'Nodi submentales');
});

test('grupos linfáticos con descripción y fuentes; etiquetas nuevas traducidas; tipo de estructura «linfatico» en la biblioteca', () => {
  for (const id of ['Lymph_nodes_of_head', 'Lymph_nodes_of_neck', 'Lymph_nodes_of_upper_limb', 'Thoracic_lymph_nodes', 'Abdominal_lymph_nodes', 'Pelvic_lymph_nodes', 'Lymph_nodes_of_lower_limb', 'Lymphatic_trunks_and_ducts', 'Lymphatic_vessels', 'Pharyngeal_lymphoid_ring']) {
    assert.ok(GRUPOS[id]?.descripcion?.length > 40, id);
    assert.ok(GRUPOS[id].fuentesLinf.length > 0, id);
  }
  for (const e of ['Vaso linfático', 'Conducto linfático', 'Tronco linfático', 'Trazado esquemático', 'Variante elegida', 'Localización', 'Reparo', 'Recibe', 'Drena en', 'En este modelo']) {
    for (const l of ['en', 'de', 'fr', 'it']) assert.ok(ETIQUETAS[e]?.[l], `${e} (${l})`);
  }
  assert.ok(TIPOS_ESTRUCTURA.includes('linfatico'));
  assert.deepEqual(GRUPOS_ESTRUCTURA.find((g) => g.id === 'linfatico').tipos, ['nodo', 'linfatico']);
  assert.ok(TA(5137).ta2 === 5137);
});
