// Del borrador de Neuri a una lección de la biblioteca: mismo formato (src/biblioteca/formato.js), mismo revisor y
// mismas citas literales, para que se estudie en el mismo reproductor con el visor 3D, la evaluación y el repaso.
//
// Lo que no se deja al modelo:
//  - los identificadores (de la lección, de sus pasos, preguntas y estructuras) los pone la app;
//  - las estructuras salen del inventario (nombre en el idioma, piezas, lado, tipo, modelos);
//  - las citas son frases literales de las evidencias que eligió (nunca texto suyo);
//  - las opciones de identificar (estructuras parecidas del inventario) y las candidatas de localizar.
// Lo que no cumple el formato se quita y se apunta; lo que el revisor rechaza vuelve como problema (para corregir).
import { leccion, GUIA, MODELO, revisarLeccion, distractoresIdentificar, TIPOS_COMPROBAR } from '../../src/biblioteca/formato.js';
import { normalizar as normalizarBusqueda } from '../../src/biblioteca/buscar.js';
import { SUBREGION_POR_ID, REGION_POR_ID } from '../../src/biblioteca/taxonomia.js';

/** Identificador de una estructura en la lección a partir de su clave del inventario: «Nasal_Bone» → «nasal-bone». */
export const idEstructura = (clave) => String(clave).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
/** Identificador de una lección de Neuri: lo pone la app, nunca el modelo. */
export function idLeccion(titulo, azar = Math.random) {
  const base = normalizarBusqueda(titulo).split(' ').filter(Boolean).slice(0, 6).join('-').slice(0, 48) || 'leccion';
  return `neuri-${base}-${Math.floor(azar() * 36 ** 4).toString(36).padStart(4, '0')}`;
}

const GRUPO = { arteria: 'vaso', vena: 'vaso', cartilago: 'hueso', diente: 'hueso', capsula: 'ligamento', glandula: 'organo' };
const grupo = (t) => GRUPO[t] ?? t;

/**
 * Lección a partir de un plan (planificar) y un borrador (redactar/adaptar). Devuelve { L, quitado: [textos], problemas }.
 * evidencias: Map «E3» → entrada del corpus ({ citas: [{ f, c }], … }); inventario: cargarInventario(); fuentes: meta de
 * cada fuente citada (f → { titulo, url, licencia, revid, fecha }).
 */
export function ensamblarLeccion({ plan, borrador, evidencias, inventario, idioma = 'es', id, modo = 'redactar', base = null, modeloIA = null, fecha = new Date().toISOString().slice(0, 10), fuentes = {}, terminologia = [] }) {
  const quitado = [];
  // ── Estructuras (del plan, con los datos del inventario) ──
  const porClave = new Map();
  const nucleoPlan = plan.estructuras.filter((e) => e.papel === 'nucleo' && inventario.estructuras[e.clave]);
  // La lección se estudia en los modelos donde están todas sus estructuras del núcleo.
  const modelos = ['male', 'female'].filter((m) => nucleoPlan.every((e) => inventario.estructuras[e.clave].modelos.includes(m)));
  const estructuras = {};
  for (const e of plan.estructuras) {
    const inv = inventario.estructuras[e.clave];
    if (!inv || porClave.has(e.clave)) continue;
    const enModelos = inv.modelos.filter((m) => modelos.includes(m));
    if (!enModelos.length) { quitado.push(`estructura ${e.clave}: no está en los modelos de la lección`); continue; }
    const eid = idEstructura(e.clave);
    estructuras[eid] = {
      nombre: inventario.nombre(e.clave, idioma), piezas: [e.clave], lado: inv.lado === 'bilateral' ? 'bilateral' : 'impar',
      papel: e.papel === 'nucleo' ? 'nucleo' : 'contexto', tipo: inv.tipo, ...(enModelos.length < modelos.length ? { modelos: enModelos } : {}),
    };
    porClave.set(e.clave, eid);
  }
  const ids = (claves = []) => [...new Set(claves.map((k) => porClave.get(k)).filter(Boolean))];
  const nucleo = Object.keys(estructuras).filter((k) => estructuras[k].papel === 'nucleo');

  // ── Citas: solo las de las evidencias elegidas, tal cual ──
  const fuentesUsadas = {};
  // Una frase de lección puede llevar muchas citas (una lista de huesos, p. ej.): se quedan las 3 que más comparten
  // palabras con lo que se afirma, para que cada frase lleve solo las citas que la respaldan.
  // Se comparan las raíces (5 letras), para que coincidan los nombres en español y en inglés de las citas: «nasales» y
  // «nasal», «maxilar» y «maxilla», «vómer» y «vomer».
  const raices = (s) => new Set(normalizarBusqueda(s).split(' ').filter((w) => w.length > 3).map((w) => w.slice(0, 5)));
  function mejores(ent, afirma) {
    if (ent.citas.length <= 3 || !afirma) return ent.citas;
    const ws = raices(afirma);
    const puntuadas = [...ent.citas].map((c, i) => ({ c, i, n: [...raices(c.c ?? '')].filter((w) => ws.has(w)).length }));
    // Solo las que comparten algo con lo que se afirma; si ninguna, las primeras (el orden de la lección).
    const utiles = puntuadas.filter((x) => x.n > 0);
    return (utiles.length ? utiles : puntuadas).sort((a, b) => b.n - a.n || a.i - b.i).slice(0, 3).sort((a, b) => a.i - b.i).map((x) => x.c);
  }
  function citas(idsEv, donde, afirma = '') {
    const out = [];
    for (const eid of idsEv ?? []) {
      const ent = evidencias.get(eid);
      if (!ent) { quitado.push(`${donde}: evidencia inexistente ${eid}`); continue; }
      for (const c of mejores(ent, afirma)) {
        if (!out.some((x) => x.f === c.f && x.c === c.c)) out.push({ f: c.f, c: c.c, ...(c.m ? { m: c.m } : {}) });
        if (c.f && fuentes[c.f]) fuentesUsadas[c.f] = fuentes[c.f];
      }
    }
    return out;
  }
  function frase(fr, donde) {
    const t = String(fr?.texto ?? '').replace(/\s+/g, ' ').trim();
    if (!t) return null;
    if (fr.marca === 'guia') return [t, GUIA];
    if (fr.marca === 'modelo') return [t, MODELO];
    const cs = citas(fr.evidencias, donde, t);
    if (!cs.length) { quitado.push(`${donde}: frase sin evidencia («${t.slice(0, 60)}…»)`); return null; }
    return [t, ...cs];
  }

  // ── Pasos ── (los identificadores siguen el orden del borrador; un paso sin ninguna frase válida se quita)
  const todos = (borrador.pasos ?? []).map((p, i) => {
    const pid = `p${i + 1}`;
    const texto = (p.frases ?? []).map((f) => frase(f, `paso ${i + 1}`)).filter(Boolean);
    const detalle = (p.detalle ?? []).map((f) => frase(f, `paso ${i + 1} (detalle)`)).filter(Boolean);
    const ver = ids(p.ver);
    const contexto = ids(p.contexto).filter((k) => !ver.includes(k));
    const fantasma = ids(p.fantasma).filter((k) => !ver.includes(k) && !contexto.includes(k));
    const paso = { id: pid, tipo: p.tipo, titulo: String(p.titulo ?? '').trim(), texto };
    if (detalle.length) paso.detalle = detalle;
    if (ver.length || contexto.length || fantasma.length || p.esqueleto) {
      paso.vista = { ver, contexto, fantasma, camara: p.camara || 'anterior', lado: 'R', ...(p.esqueleto ? { esqueleto: true } : {}) };
    }
    const a = p.actividad;
    if (a) {
      const es = ids(a.estructuras);
      const txt = String(a.texto ?? '').trim();
      if (a.tipo === 'localizar' && es.find((k) => nucleo.includes(k)) && txt) paso.actividad = { tipo: 'localizar', estructura: es.find((k) => nucleo.includes(k)), texto: txt };
      else if (a.tipo === 'comparar' && es.length >= 2 && txt) paso.actividad = { tipo: 'comparar', estructuras: es, texto: txt };
      else if (a.tipo === 'vistas' && a.vistas?.length && txt) paso.actividad = { tipo: 'vistas', vistas: a.vistas.map((v) => ({ nombre: String(v.nombre).trim(), camara: v.camara })), texto: txt };
      else quitado.push(`paso ${i + 1}: actividad incompleta`);
    }
    return paso;
  });
  const pasos = todos.filter((p) => {
    if (p.texto.length) return true;
    quitado.push(`paso ${p.id}: sin frases con evidencia`);
    return false;
  });
  /** Paso (de los que quedan) para el índice del borrador: el mismo o, si se quitó, el anterior que siga. */
  const pasoDe = (i) => {
    for (let k = Math.min(Math.max(0, i), todos.length - 1); k >= 0; k--) if (pasos.includes(todos[k])) return todos[k].id;
    return pasos[0]?.id;
  };

  // Cada estructura del núcleo se ve en algún paso: si no la puso, en el paso que la nombra (o en el primero).
  for (const k of nucleo) {
    const usada = pasos.some((p) => p.vista && [...p.vista.ver, ...p.vista.contexto, ...p.vista.fantasma].includes(k));
    if (usada) continue;
    const nombre = normalizarBusqueda(estructuras[k].nombre);
    const p = pasos.find((x) => x.tipo !== 'sintesis' && normalizarBusqueda(x.texto.map((f) => f[0]).join(' ')).includes(nombre))
      ?? pasos.find((x) => x.tipo !== 'sintesis' && x.tipo !== 'orientacion') ?? pasos[0];
    if (!p) continue;
    p.vista ??= { ver: [], contexto: [], fantasma: [], camara: 'anterior', lado: 'R' };
    p.vista.ver.push(k);
  }

  // ── Preguntas ──
  const objetivos = (plan.objetivos ?? []).map((o) => String(o).trim()).filter(Boolean);
  const preguntas = [];
  (borrador.preguntas ?? []).forEach((q, k) => {
    const donde = `pregunta ${k + 1}`;
    const comun = { id: `q${preguntas.length + 1}`, tipo: q.tipo, objetivo: q.objetivo, paso: pasoDe(Number.isInteger(q.paso) ? q.paso : 0) };
    if (!(q.objetivo >= 0 && q.objetivo < objetivos.length)) { quitado.push(`${donde}: objetivo inexistente`); return; }
    if (q.tipo === 'identificar' || q.tipo === 'localizar') {
      const e = porClave.get(q.estructura);
      if (!e || !nucleo.includes(e)) { quitado.push(`${donde}: estructura que no es del núcleo`); return; }
      if (preguntas.some((x) => x.tipo === q.tipo && x.estructura === e)) return;                // repetida
      if (q.tipo === 'localizar') {
        const otras = Object.keys(estructuras).filter((x) => x !== e);
        const candidatas = [...otras.filter((x) => grupo(estructuras[x].tipo) === grupo(estructuras[e].tipo)), ...otras].filter((x, i, a) => a.indexOf(x) === i).slice(0, 3);
        if (candidatas.length < 2) { quitado.push(`${donde}: sin estructuras con las que confundirla`); return; }
        preguntas.push({ ...comun, estructura: e, candidatas });
      } else preguntas.push({ ...comun, estructura: e });
      return;
    }
    const ev = citas(q.evidencias, donde, `${q.enunciado ?? ''} ${q.correcta ?? ''} ${(q.orden ?? []).join(' ')}`);
    const enunciado = String(q.enunciado ?? '').trim();
    const explicacion = String(q.explicacion ?? '').trim();
    if (!enunciado || !explicacion || !ev.length) { quitado.push(`${donde}: sin enunciado, explicación o evidencia`); return; }
    if (q.tipo === 'secuencia') {
      const orden = (q.orden ?? []).map((x) => String(x).trim()).filter(Boolean);
      if (orden.length < 3 || new Set(orden).size !== orden.length) { quitado.push(`${donde}: secuencia de menos de 3 elementos`); return; }
      preguntas.push({ ...comun, enunciado, orden, explicacion, evidencia: ev });
      return;
    }
    const correcta = String(q.correcta ?? '').trim();
    const distractores = (q.distractores ?? []).map((x) => String(x).trim()).filter((x) => x && x !== correcta);
    if (!correcta || new Set(distractores).size < 3) { quitado.push(`${donde}: sin respuesta o sin 3 distractores distintos`); return; }
    preguntas.push({ ...comun, enunciado, correcta, distractores: [...new Set(distractores)].slice(0, 3), explicacion, evidencia: ev });
  });

  // Identificar necesita 3 nombres con los que confundirla: si la lección no tiene tantos del mismo tipo, del inventario.
  const provisional = { estructuras };
  for (const q of preguntas.filter((x) => x.tipo === 'identificar')) {
    const e = estructuras[q.estructura];
    if (distractoresIdentificar(provisional, q.estructura).length >= 3) continue;
    const extra = inventario.parecidas(e.piezas[0], { idioma, excluir: Object.values(estructuras).map((x) => x.piezas[0]) });
    if (extra.length) e.confusiones = extra;
  }
  // Práctica de los pasos: la primera pregunta de texto que se enseña en cada paso (cada una, una vez).
  const usadas = new Set();
  for (const p of pasos) {
    if (!['explicacion', 'relaciones', 'funcion', 'exploracion'].includes(p.tipo)) continue;
    const q = preguntas.find((x) => x.paso === p.id && TIPOS_COMPROBAR.includes(x.tipo) && !usadas.has(x.id));
    if (q) { p.comprobar = q.id; usadas.add(q.id); }
  }

  // ── Clasificación (del plan, comprobada contra la taxonomía) ──
  const lugares = (plan.lugares ?? []).map((l) => [l.region, l.subregion ?? null])
    .filter(([r, s]) => REGION_POR_ID.has(r) && (!s || SUBREGION_POR_ID.get(s)?.region === r));

  const L = leccion({
    id, version: 1,
    titulo: String(plan.titulo ?? '').trim(),
    resumen: String(borrador.resumen || plan.resumen || '').trim(),
    lugares, sistemas: plan.sistemas ?? [], formato: plan.formato, temas: plan.temas ?? [],
    nivel: plan.nivel, minutos: plan.minutos,
    modelos, idiomas: [idioma],
    objetivos, estructuras, pasos, preguntas,
    fuentesTerminologia: terminologia,
    revision: {
      estado: 'borrador', revisor: null, fecha: null,
      notas: `Generada por Neuri con IA (Claude${modeloIA ? `, ${modeloIA}` : ''}) el ${fecha}, en la app, a partir de las fuentes citadas: cada afirmación lleva su cita, comprobada palabra por palabra. Sin revisión de un especialista.`,
    },
  });
  L.fuentesUsadas = fuentesUsadas;
  L.origen = { neuri: true, modo, base, fecha, modelo: modeloIA };
  return { L, quitado };
}

/**
 * Problemas de una lección de Neuri: los del revisor de la biblioteca más las citas que no están en su fuente.
 * Devuelve { errores: [texto], avisos: [texto] }.
 */
export function validarLeccion(L, { inventario, citaEnFuente, fuentes = {} }) {
  const errores = [];
  const avisos = [];
  if (!L.modelos?.length) errores.push('las estructuras del núcleo no están juntas en ningún modelo');
  const ctx = { piezasDe: (m) => inventario.piezasDe(m), lecciones: null, fuentes: { ...fuentes, ...(L.fuentesUsadas ?? {}) } };
  for (const p of revisarLeccion(L, ctx)) (p.nivel === 'error' ? errores : avisos).push(p.texto.replace(`${L.id}: `, ''));
  for (const p of L.pasos) {
    for (const f of [...p.texto, ...(p.detalle ?? [])]) {
      for (const e of f.slice(1)) {
        if (!e?.f) continue;
        const ok = citaEnFuente(e.f, e.c);
        if (ok === false) errores.push(`paso ${p.id}: la cita no está en su fuente (${e.f})`);
        else if (ok === null && !(e.f in ctx.fuentes)) errores.push(`paso ${p.id}: fuente no disponible para comprobar (${e.f})`);
      }
    }
  }
  return { errores: [...new Set(errores)], avisos: [...new Set(avisos)] };
}

/** Frases y preguntas con cita que hay que verificar (que la cita respalde lo que se afirma): [{ n, donde, texto, citas }]. */
export function afirmaciones(L) {
  const out = [];
  L.pasos.forEach((p) => {
    for (const lista of [p.texto, p.detalle ?? []]) {
      lista.forEach((f, i) => {
        const cs = f.slice(1).filter((e) => (e?.f || e?.m) && e.c);
        if (cs.length) out.push({ n: out.length + 1, donde: { paso: p.id, lista: lista === p.texto ? 'texto' : 'detalle', i }, texto: f[0], citas: cs.map((e) => e.c) });
      });
    }
  });
  for (const q of L.preguntas) {
    if (!q.evidencia?.length) continue;
    const afirma = q.tipo === 'secuencia' ? `${q.enunciado} Orden correcto: ${q.orden.join(' → ')}.` : `${q.enunciado} Respuesta correcta: ${q.correcta}. ${q.explicacion}`;
    out.push({ n: out.length + 1, donde: { pregunta: q.id }, texto: afirma, citas: q.evidencia.filter((e) => e.c).map((e) => e.c) });
  }
  return out;
}

/** Quita de la lección las afirmaciones que la verificación no respalda. Devuelve los textos quitados. */
export function quitarNoRespaldadas(L, lista, veredictos) {
  const malos = new Set(veredictos.filter((v) => v.respalda !== 'si').map((v) => v.n));
  const quitadas = [];
  const porPaso = new Map();
  for (const a of lista.filter((x) => malos.has(x.n))) {
    if (a.donde.pregunta) {
      L.preguntas = L.preguntas.filter((q) => q.id !== a.donde.pregunta);
      for (const p of L.pasos) if (p.comprobar === a.donde.pregunta) delete p.comprobar;
      quitadas.push(`pregunta: ${a.texto.slice(0, 80)}`);
    } else {
      const k = `${a.donde.paso}|${a.donde.lista}`;
      porPaso.set(k, [...(porPaso.get(k) ?? []), a.donde.i]);
      quitadas.push(a.texto);
    }
  }
  for (const [k, idx] of porPaso) {
    const [pid, lista] = k.split('|');
    const p = L.pasos.find((x) => x.id === pid);
    if (!p) continue;
    const quitar = new Set(idx);
    p[lista] = (p[lista] ?? []).filter((_, i) => !quitar.has(i));
    if (lista === 'detalle' && !p.detalle.length) delete p.detalle;
  }
  return quitadas;
}
