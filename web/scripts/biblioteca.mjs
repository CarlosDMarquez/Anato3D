// Biblioteca de estudio: revisa las lecciones, genera el catálogo que usa la app y el mapa de cobertura.
// Uso (desde web/):
//   node scripts/biblioteca.mjs              revisa, escribe src/biblioteca/generado/catalogo.json y docs/estudio/cobertura.md
//   node scripts/biblioteca.mjs --comprobar  revisa y comprueba que lo generado está al día (sin escribir); código 1 si no
//
// Qué revisa: cada lección con formato.js (estructura, objetivos, pasos, preguntas, piezas que existen en los modelos),
// que cada cita esté comprobada en su fuente (scripts/biblioteca/citas-comprobadas.json, que escribe
// `node scripts/biblioteca/fuentes.mjs comprobar`), que las fuentes estén registradas y que los recorridos citen
// lecciones del plan. Las cifras de cobertura cuentan cada lección y cada estructura una sola vez.
import fs from 'fs';
import path from 'path';
import { inventario, WEB } from './biblioteca/inventario.mjs';
import { cargarLecciones, leerRegistro, COMPROBADAS, huellaCita } from './biblioteca/fuentes.mjs';
import { PLAN } from './biblioteca/plan.mjs';
import { revisarLeccion, todasLasEvidencias, sinLado } from '../src/biblioteca/formato.js';
import { deModulo } from '../src/biblioteca/modulos.js';
import { MODULOS } from '../src/content/index.js';
import { RECORRIDOS, MODULOS_BIBLIOTECA, leccionesDeRecorrido, revisarRecorridos } from '../src/biblioteca/recorridos.js';
import { REGIONES, SISTEMAS, revisarTaxonomia, nombreLugar } from '../src/biblioteca/taxonomia.js';

const CATALOGO = path.join(WEB, 'src/biblioteca/generado/catalogo.json');
const COBERTURA = path.join(WEB, '../docs/estudio/cobertura.md');
const comprobar = process.argv.includes('--comprobar');

const { estructuras: INV, piezas: PIEZAS } = inventario();
const nuevas = await cargarLecciones();
const antiguas = new Map(MODULOS.map(deModulo).filter(Boolean).map((L) => [L.id, L]));
const LECCIONES = new Map([...antiguas, ...nuevas]);
const registro = leerRegistro();
const verificadas = (() => { try { return JSON.parse(fs.readFileSync(COMPROBADAS, 'utf8')); } catch { return {}; } })();
const idsPlan = new Set(PLAN.map((p) => p.id));

// ── Revisión ──
const errores = [];
const avisos = [];
for (const t of revisarTaxonomia()) errores.push(`taxonomía: ${t}`);
for (const t of revisarRecorridos(idsPlan)) errores.push(`recorridos: ${t}`);
for (const [id, L] of LECCIONES) {
  if (!idsPlan.has(id)) errores.push(`${id}: no está en el plan (scripts/biblioteca/plan.mjs)`);
  const ctx = { piezasDe: (m) => PIEZAS[m], lecciones: idsPlan, fuentes: registro };
  for (const p of revisarLeccion(L, ctx)) {
    // Los módulos antiguos no siguen todavía las reglas de orientación y síntesis (bloque 3 del plan).
    (p.nivel === 'error' ? errores : avisos).push(p.texto);
  }
  for (const e of todasLasEvidencias(L)) {
    if (!(verificadas[e.f] ?? []).includes(huellaCita(e.f, e.c))) errores.push(`${id}: cita sin comprobar en ${e.f}: «${e.c.slice(0, 70)}…» (node scripts/biblioteca/fuentes.mjs comprobar)`);
  }
  // Los requisitos y la siguiente lección tienen que existir de verdad para poder enlazarlos.
  for (const r of [...L.requisitos, ...L.siguiente]) if (!LECCIONES.has(r)) avisos.push(`${id}: enlaza a una lección que todavía no existe: ${r}`);
}

// ── Catálogo para la app ──
const clavesDe = (L, papel) => [...new Set(Object.values(L.estructuras).filter((e) => !papel || e.papel === papel).flatMap((e) => e.piezas.map(sinLado)))];
const catalogo = {
  lecciones: [...LECCIONES.values()].sort((a, b) => a.id.localeCompare(b.id)).map((L) => ({
    id: L.id, version: L.version, titulo: L.titulo, resumen: L.resumen, lugares: L.lugares, sistemas: L.sistemas,
    formato: L.formato, temas: L.temas, nivel: L.nivel, minutos: L.minutos, requisitos: L.requisitos.filter((r) => LECCIONES.has(r)),
    siguiente: L.siguiente.filter((r) => LECCIONES.has(r)), modelos: L.modelos, idiomas: L.idiomas, objetivos: L.objetivos,
    estructuras: Object.entries(L.estructuras).map(([id, e]) => ({ id, nombre: e.nombre, tipo: e.tipo, papel: e.papel, en: INV.get(sinLado(e.piezas[0]))?.en ?? null, la: INV.get(sinLado(e.piezas[0]))?.la ?? null })),
    orden: PLAN.findIndex((p) => p.id === L.id),
    pasos: L.pasos.length, preguntas: L.preguntas.length, estado: L.revision.estado, ...(L.modulo ? { modulo: true } : {}),
  })),
  // Pieza del modelo (sin lado) → lecciones donde se estudia (n: núcleo, c: contexto). Para «dónde se estudia» en el buscador.
  piezas: {},
};
for (const L of LECCIONES.values()) {
  for (const [papel, k] of [['nucleo', 'n'], ['contexto', 'c']]) {
    for (const clave of clavesDe(L, papel)) {
      const x = (catalogo.piezas[clave] ??= {});
      (x[k] ??= []).push(L.id);
    }
  }
}
catalogo.piezas = Object.fromEntries(Object.entries(catalogo.piezas).sort(([a], [b]) => a.localeCompare(b)));
// Alcance comprobado de los recorridos que prometen «todos» (lo muestra la vista del recorrido): cuántas estructuras de
// esos tipos están en el núcleo de alguna de sus lecciones disponibles, frente a las que tienen los modelos.
function alcanceDe(r) {
  if (!r.alcance?.tipos) return null;
  const disp = leccionesDeRecorrido(r).filter((id) => LECCIONES.has(id));
  const nuc = new Set(disp.flatMap((id) => clavesDe(LECCIONES.get(id), 'nucleo')));
  const todas = [...INV.values()].filter((e) => r.alcance.tipos.includes(e.tipo));
  return { cubiertas: todas.filter((e) => nuc.has(e.clave)).length, total: todas.length };
}
catalogo.recorridos = Object.fromEntries(RECORRIDOS.filter((r) => r.alcance).map((r) => [r.id, { alcance: alcanceDe(r) }]));

// ── Cobertura ──
const disponibles = [...LECCIONES.values()];
const cubiertas = { nucleo: new Set(disponibles.flatMap((L) => clavesDe(L, 'nucleo'))), todas: new Set(disponibles.flatMap((L) => clavesDe(L))) };
const enLugar = (lugares, r, s) => lugares.some(([a, b]) => a === r && (s === undefined || b === s));
const lecDisp = (r, s) => disponibles.filter((L) => enLugar(L.lugares, r, s));
const lecPlan = (r, s) => PLAN.filter((p) => enLugar(p.lugares, r, s));
const estructurasEn = (r, s) => [...INV.values()].filter((e) => enLugar(e.lugares, r, s));
const pct = (a, b) => (b ? `${Math.round((100 * a) / b)} %` : '—');
// El estado compara identificadores, no cantidades: una lección general que también toca la fila no cuenta como la
// lección prevista para ella. Sin lección prevista, la fila dice «sin lección propia» (sus estructuras pueden salir en otras).
const hechas = (plan) => plan.filter((p) => LECCIONES.has(p.id)).length;
const estado = (plan) => { const h = hechas(plan); return !plan.length ? 'sin lección propia' : h === plan.length ? 'disponible' : h ? 'parcial' : 'pendiente'; };
const previstas = (plan) => (plan.length ? `${hechas(plan)} de ${plan.length}` : '0');
const fila = (cols) => `| ${cols.join(' | ')} |`;

const lineas = [];
const w = (s = '') => lineas.push(s);
w('---');
w('title: Cobertura de la biblioteca de estudio');
w('---');
w();
w('# Cobertura de la biblioteca de estudio');
w();
w('Generado por `node scripts/biblioteca.mjs` (no editar a mano). Cuenta las lecciones disponibles (`web/src/biblioteca/lecciones/` y los dos módulos antiguos) frente al plan (`web/scripts/biblioteca/plan.mjs`) y frente a las piezas de los dos modelos 3D. Cada lección cuenta una sola vez en cada fila aunque esté en varias subregiones; los totales cuentan lecciones únicas.');
w();
w('- **Estado**: *disponible* (existen todas las lecciones que el plan prevé para esa fila), *parcial* (algunas) o *pendiente* (ninguna); *sin lección propia* = el plan no prevé una lección dedicada (sus estructuras pueden estudiarse en otras). Se comparan identificadores: una lección general que toca la fila no cuenta como la prevista.');
w('- **Lecciones disponibles**: todas las que tocan esa fila, previstas para ella o no. **Previstas**: cuántas de las previstas para la fila existen ya.');
w('- **Estructuras**: piezas del modelo (sin contar el lado) clasificadas en esa región o sistema; *en el núcleo* = se estudian y se evalúan en alguna lección; *con contexto* = además las que solo se muestran para orientarse.');
w('- Todas las lecciones están en estado *borrador*: redactadas con IA a partir de fuentes citadas y comprobadas, sin revisar por un especialista.');
w();
const totalPlan = PLAN.length;
const enPlanDisp = PLAN.filter((p) => LECCIONES.has(p.id)).length;
w('## Resumen');
w();
w(`- Lecciones disponibles: **${disponibles.length}** de ${totalPlan} previstas (${pct(enPlanDisp, totalPlan)}).`);
w(`- Módulos: **${MODULOS_BIBLIOTECA.length}** · Recorridos: **${RECORRIDOS.length}**.`);
w(`- Estructuras de los modelos: **${INV.size}** (hombre ${[...INV.values()].filter((e) => e.modelos.has('male')).length}, mujer ${[...INV.values()].filter((e) => e.modelos.has('female')).length}); en el núcleo de alguna lección: **${cubiertas.nucleo.size}** (${pct(cubiertas.nucleo.size, INV.size)}); con contexto: ${cubiertas.todas.size} (${pct(cubiertas.todas.size, INV.size)}).`);
w(`- Pasos: ${disponibles.reduce((n, L) => n + L.pasos.length, 0)} · preguntas de evaluación: ${disponibles.reduce((n, L) => n + L.preguntas.length, 0)} · citas comprobadas: ${Object.values(verificadas).reduce((n, v) => n + v.length, 0)} en ${Object.keys(verificadas).length} páginas.`);
w();
w('## Por región');
w();
w(fila(['Región › subregión', 'Lecciones disponibles', 'Previstas (hechas de total)', 'Estado', 'Estructuras', 'En el núcleo', 'Con contexto']));
w(fila(['---', '---:', '---:', '---', '---:', '---:', '---:']));
for (const r of REGIONES) {
  const e = estructurasEn(r.id);
  const d = lecDisp(r.id).length, p = lecPlan(r.id);
  w(fila([`**${r.nombre}**`, `**${d}**`, previstas(p), estado(p), e.length, `${e.filter((x) => cubiertas.nucleo.has(x.clave)).length} (${pct(e.filter((x) => cubiertas.nucleo.has(x.clave)).length, e.length)})`, e.filter((x) => cubiertas.todas.has(x.clave)).length]));
  for (const s of r.sub) {
    const es = estructurasEn(r.id, s.id);
    const ds = lecDisp(r.id, s.id).length, ps = lecPlan(r.id, s.id);
    w(fila([`${r.nombre} › ${s.nombre}`, ds, previstas(ps), estado(ps), es.length, `${es.filter((x) => cubiertas.nucleo.has(x.clave)).length} (${pct(es.filter((x) => cubiertas.nucleo.has(x.clave)).length, es.length)})`, es.filter((x) => cubiertas.todas.has(x.clave)).length]));
  }
}
const generales = disponibles.filter((L) => !L.lugares.length);
const planGeneral = PLAN.filter((p) => !p.lugares.length);
w(fila(['Todo el cuerpo (sin región)', generales.length, previstas(planGeneral), estado(planGeneral), '—', '—', '—']));
w(fila(['**Total (lecciones únicas)**', `**${disponibles.length}**`, previstas(PLAN), estado(PLAN), INV.size, cubiertas.nucleo.size, cubiertas.todas.size]));
w();
w('## Por sistema');
w();
w(fila(['Sistema', 'Lecciones disponibles', 'Previstas (hechas de total)', 'Estado', 'Estructuras', 'En el núcleo', 'Con contexto']));
w(fila(['---', '---:', '---:', '---', '---:', '---:', '---:']));
for (const s of SISTEMAS) {
  const d = disponibles.filter((L) => L.sistemas.includes(s.id)).length;
  const p = PLAN.filter((x) => x.sistemas.includes(s.id));
  const e = [...INV.values()].filter((x) => x.sistema === s.id);
  w(fila([s.nombre, d, previstas(p), estado(p), e.length, `${e.filter((x) => cubiertas.nucleo.has(x.clave)).length} (${pct(e.filter((x) => cubiertas.nucleo.has(x.clave)).length, e.length)})`, e.filter((x) => cubiertas.todas.has(x.clave)).length]));
}
w();
w('## Por recorrido');
w();
w(fila(['Recorrido', 'Módulos', 'Lecciones disponibles', 'Previstas', 'Minutos disponibles', 'Estado', 'Alcance comprobado']));
w(fila(['---', '---:', '---:', '---:', '---:', '---', '---']));
for (const r of RECORRIDOS) {
  const ids = leccionesDeRecorrido(r);
  const disp = ids.filter((id) => LECCIONES.has(id));
  const min = disp.reduce((n, id) => n + LECCIONES.get(id).minutos, 0);
  const a = alcanceDe(r);
  const alcance = a ? `${a.cubiertas} de ${a.total} estructuras de tipo ${r.alcance.tipos.join(', ')} (${pct(a.cubiertas, a.total)})` : '—';
  const est = disp.length === ids.length ? 'disponible' : disp.length ? 'parcial' : 'pendiente';
  w(fila([r.titulo, r.modulos.length, disp.length, ids.length, min, est, alcance]));
}
w();
w('## Lecciones');
w();
w(fila(['Lección', 'Lugar', 'Sistemas', 'Nivel', 'Min', 'Pasos', 'Preguntas', 'Estado']));
w(fila(['---', '---', '---', '---:', '---:', '---:', '---:', '---']));
for (const p of PLAN) {
  const L = LECCIONES.get(p.id);
  const lugar = (L?.lugares ?? p.lugares).map(nombreLugar).join('; ') || 'Todo el cuerpo';
  const sis = (L?.sistemas ?? p.sistemas).join(', ') || '—';
  w(fila([L ? `\`${p.id}\` ${L.titulo}` : `\`${p.id}\` ${p.titulo}`, lugar, sis, L?.nivel ?? '', L?.minutos ?? '', L?.pasos.length ?? '', L?.preguntas.length ?? '', L ? 'disponible' : 'pendiente']));
}
w();
w('## Límites conocidos');
w();
w('- Las lecciones nuevas están solo en español; las de los módulos antiguos (brazo y antebrazo), en los cinco idiomas, traducidas con IA y sin revisar.');
w('- El modelo no tiene piezas para los accidentes óseos (tubérculos, fosas, surcos): se explican en el texto y se muestran con el hueso entero y la cámara orientada.');
w('- Las estructuras que solo existen en un modelo (órganos genitales, vasos ováricos y uterinos, mama) solo se estudian y se evalúan en ese modelo.');
const md = `${lineas.join('\n')}\n`;
const json = `${JSON.stringify(catalogo)}\n`;

// ── Salida ──
for (const a of avisos) console.log(`aviso: ${a}`);
for (const e of errores) console.log(`ERROR: ${e}`);
const iguales = (f, s) => { try { return fs.readFileSync(f, 'utf8') === s; } catch { return false; } };
if (comprobar) {
  if (!iguales(CATALOGO, json)) errores.push('src/biblioteca/generado/catalogo.json no está al día (node scripts/biblioteca.mjs)');
  if (!iguales(COBERTURA, md)) errores.push('docs/estudio/cobertura.md no está al día (node scripts/biblioteca.mjs)');
} else {
  for (const [f, s] of [[CATALOGO, json], [COBERTURA, md]]) {
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, s);
  }
}
console.log(`biblioteca: ${LECCIONES.size} lecciones (${nuevas.size} nuevas, ${antiguas.size} módulos), ${errores.length} errores, ${avisos.length} avisos; catálogo ${(json.length / 1024).toFixed(1)} kB`);
if (errores.length) process.exitCode = 1;
