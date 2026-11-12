// Textos que recibe Claude en cada petición de Neuri (los usa server/pet.mjs). Las reglas están en
// server/neuri/instrucciones.mjs; aquí, los datos: el catálogo (fijo, en caché), el estado de la conversación, el
// progreso, las lecciones y los recorridos propios, la solicitud, el plan, la lección base, el recorrido que se cambia,
// lo que hay en el modelo por zona y las evidencias numeradas (cambian).
import { REGION_POR_ID, SUBREGION_POR_ID, SISTEMA_POR_ID, NIVEL_POR_ID, FORMATO_POR_ID } from '../src/biblioteca/taxonomia.js';
import { RECORRIDOS, leccionesDeRecorrido } from '../src/biblioteca/recorridos.js';
import { frases } from '../src/biblioteca/formato.js';

const NOMBRES_IDIOMA = { es: 'español', en: 'inglés', de: 'alemán', fr: 'francés', it: 'italiano' };
const nomLugar = ([r, s]) => [REGION_POR_ID.get(r)?.nombre ?? r, s && (SUBREGION_POR_ID.get(s)?.nombre ?? s)].filter(Boolean).join(' › ');
const NOMBRE_FUENTE = (f) => (f.startsWith('wpes:') ? 'Wikipedia en español' : f.startsWith('tma:') ? 'TeachMeAnatomy' : 'Wikipedia en inglés');

/** El catálogo en texto: siempre igual para el mismo catálogo (orden de las lecciones y de sus campos). */
export function textoCatalogo(catalogo) {
  const lecciones = [...catalogo.lecciones].sort((a, b) => a.id.localeCompare(b.id));
  const disponibles = new Set(lecciones.map((L) => L.id));
  const bloques = lecciones.map((L) => {
    const requisitos = (L.requisitos ?? []).filter((id) => disponibles.has(id));
    const lugar = L.lugares?.length ? L.lugares.map(nomLugar).join('; ') : 'Todo el cuerpo';
    const sistemas = L.sistemas.map((s) => SISTEMA_POR_ID.get(s)?.nombre ?? s).join(', ');
    const nucleo = (L.estructuras ?? []).filter((e) => e.papel === 'nucleo').map((e) => e.nombre);
    return [
      `### ${L.id} — ${L.titulo}`,
      `Lugar: ${lugar}. Sistemas: ${sistemas}. Nivel: ${NIVEL_POR_ID.get(L.nivel)?.nombre ?? L.nivel}. ${L.minutos} min. Formato: ${FORMATO_POR_ID.get(L.formato)?.nombre ?? L.formato}.`,
      `Requisitos: ${requisitos.length ? requisitos.join(', ') : 'ninguno'}.`,
      `Resumen: ${L.resumen}`,
      `Objetivos: ${(L.objetivos ?? []).join(' ')}`,
      nucleo.length ? `Estructuras que enseña: ${[...new Set(nucleo)].join(', ')}.` : '',
    ].filter(Boolean).join('\n');
  });
  const recorridos = RECORRIDOS.map((R) => {
    const ids = leccionesDeRecorrido(R).filter((id) => disponibles.has(id));
    return `### ${R.id} — ${R.titulo}\n${R.descripcion} Requisitos: ${R.requisitos} Lecciones, en orden: ${ids.join(', ')}.`;
  });
  return `CATÁLOGO DE LA BIBLIOTECA (${lecciones.length} lecciones). Cada una: identificador — título, y debajo sus datos.\n\n${bloques.join('\n\n')}\n\nRECORRIDOS (${recorridos.length}): planes de varias lecciones en orden.\n\n${recorridos.join('\n\n')}`;
}

/** Estado de una unidad de un recorrido personal, en palabras (src/pet/protocolo.js, ESTADOS_UNIDAD). */
const ESTADO_UNIDAD = { lista: 'lista para estudiar', preparando: 'en preparación', pendiente: 'pendiente: sin crear', error: 'no se pudo crear', interrumpida: 'interrumpida', 'sin-guardar': 'lista pero sin guardar' };

/** Lo que cambia en cada petición de Orientar: idioma, estado de la conversación, progreso, lecciones y recorridos propios. */
export function textoContexto({ idioma, progreso, contexto = null, propias = [], recorridos = [] }) {
  const lista = (ids) => (ids.length ? ids.join(', ') : 'ninguna');
  const c = contexto ?? {};
  return [
    `Idioma de la interfaz: ${NOMBRES_IDIOMA[idioma] ?? 'español'}.`,
    `Estado de la conversación (consérvalo mientras siga siendo pertinente): tema: ${c.tema ?? '—'}; objetivo: ${c.objetivo ?? '—'}; nivel: ${c.nivel ?? '—'}; minutos: ${c.minutos ?? '—'}.`,
    'Progreso de la persona en la biblioteca:',
    `- Terminadas: ${lista(progreso.terminadas)}.`,
    `- Empezadas sin terminar: ${lista(progreso.enCurso)}.`,
    `- Con repasos pendientes hoy: ${lista(progreso.repasos)}.`,
    `- Guardadas en favoritos: ${lista(progreso.guardadas)}.`,
    propias.length
      ? `MIS LECCIONES (creadas o adaptadas con Neuri; solo en el navegador de esta persona; borradores generados por IA):\n${propias.map((p) => `- ${p.id} — ${p.titulo} (${p.minutos} min, nivel ${p.nivel}): ${p.resumen}`).join('\n')}`
      : 'MIS LECCIONES: ninguna todavía.',
    recorridos.length
      ? `MIS RECORRIDOS (recorridos personales por unidades; cada unidad lista es una lección de MIS LECCIONES):\n${recorridos.map((r) => `- ${r.id} — ${r.titulo}: ${r.unidades.map((u, i) => `${i + 1}. ${u.titulo} (${ESTADO_UNIDAD[u.estado] ?? u.estado}${u.leccion ? `: ${u.leccion}` : ''})`).join('; ')}.`).join('\n')}`
      : 'MIS RECORRIDOS: ninguno todavía.',
  ].join('\n');
}

/** Evidencias numeradas (E1, E2…) tal como las ve el modelo. `mapa`: Map id → entrada del corpus. */
export function textoEvidencias(mapa, corpus) {
  if (!mapa.size) return 'EVIDENCIAS: ninguna para esta consulta.';
  const lineas = [...mapa].map(([id, e]) => {
    const fuente = e.citas[0].f ? corpus.fuente(e.citas[0].f) : null;
    const de = e.citas[0].f ? `${NOMBRE_FUENTE(e.citas[0].f)}, «${fuente?.titulo ?? e.citas[0].f.slice(e.citas[0].f.indexOf(':') + 1)}»` : 'fuente de la lección';
    const citas = e.citas.filter((x) => x.c).map((x) => `“${x.c}”`).join(' ');
    return e.texto
      ? `${id} — Lección «${e.titulo}»: «${e.texto}»${citas ? ` · Cita (${de}): ${citas}` : ''}`
      : `${id} — ${de}: ${citas}`;
  });
  return `EVIDENCIAS (cítalas solo por su identificador; son lo único con lo que puedes afirmar algo de anatomía):\n${lineas.join('\n')}`;
}

/** La solicitud que se va a planificar: una lección, una adaptación, un recorrido o una unidad de un recorrido. */
export function textoSolicitud(s) {
  const que = s.accion === 'adaptar' ? `adaptar la lección ${s.leccion_base}`
    : s.accion === 'recorrido' ? (s.recorrido_base ? `cambiar el recorrido personal ${s.recorrido_base}` : 'un recorrido personal por unidades')
      : 'crear una lección nueva';
  const minutos = s.accion === 'recorrido' ? `unidades pedidas: ${s.unidades ?? '—'}; minutos de cada unidad: ${s.minutos ?? '—'}` : `minutos: ${s.minutos ?? '—'}`;
  const r = s.recorrido;
  const unidad = r ? `\nES LA UNIDAD ${r.n} DE ${r.total} DEL RECORRIDO PERSONAL «${r.titulo}». Las otras unidades: ${r.otras.map((x) => `«${x}»`).join(', ') || '—'}. Planifica solo esta unidad.` : '';
  return `SOLICITUD (${que}): tema: ${s.tema}; objetivo: ${s.objetivo || '—'}; nivel: ${s.nivel ?? '—'}; ${minutos}; enfoque: ${s.enfoque || '—'}; supuestos: ${s.supuestos.join('; ') || '—'}; términos de búsqueda: ${(s.terminos ?? []).join(', ') || '—'}.${unidad}`;
}

/** El recorrido personal que se cambia, con el estado real de cada unidad (lo que ya existe no se reescribe). */
export function textoRecorridoBase(b) {
  const unidades = b.unidades.map((u, i) => `${i + 1}. «${u.titulo}» (${ESTADO_UNIDAD[u.estado] ?? u.estado}; ${u.minutos ?? '—'} min): ${u.objetivo || '—'}${u.enfoque ? ` Enfoque: ${u.enfoque}` : ''}`);
  return [
    `RECORRIDO QUE SE CAMBIA (${b.id}): «${b.titulo}». ${b.objetivo || ''}`.trim(),
    `Unidades de ahora:\n${unidades.join('\n')}`,
    'Devuelve el recorrido entero, ya cambiado según la SOLICITUD. Para cada unidad que sigue igual, «conserva» con su número de ahora (sus textos no se tocan). Las unidades listas, sin guardar o en preparación ya existen y no se pueden reescribir: consérvalas, o déjalas fuera solo si la persona pide quitarlas (su lección sigue en Mis lecciones). Las pendientes, con error o interrumpidas se pueden cambiar, quitar o reordenar; si cambias una, va sin «conserva».',
  ].join('\n');
}

// Tipos del inventario, en plural, para contar lo que hay en una zona del modelo.
const TIPOS_EN_PLURAL = {
  hueso: 'huesos', cartilago: 'cartílagos', diente: 'dientes', musculo: 'músculos', tendon: 'tendones', ligamento: 'ligamentos', capsula: 'cápsulas articulares',
  bolsa: 'bolsas sinoviales', fascia: 'fascias', vaina: 'vainas', arteria: 'arterias', vena: 'venas', nervio: 'nervios', ganglio: 'ganglios nerviosos',
  snc: 'partes del encéfalo y la médula', organo: 'órganos', glandula: 'glándulas', nodo: 'ganglios linfáticos', corazon: 'partes del corazón', piel: 'zonas de piel',
};

/**
 * Lo que hay en el modelo 3D en la zona de un recorrido: cuántas estructuras de cada tipo por subregión (las unidades
 * solo pueden enseñar lo que se puede ver). `regiones`: identificadores de la taxonomía; `sistemas`: si no hay región.
 */
export function textoZona(inventario, { regiones = [], sistemas = [] } = {}) {
  const cuentas = new Map();
  const sumar = (lugar, tipo) => {
    if (!cuentas.has(lugar)) cuentas.set(lugar, new Map());
    const m = cuentas.get(lugar);
    m.set(tipo, (m.get(tipo) ?? 0) + 1);
  };
  for (const k of inventario.claves) {
    const e = inventario.estructuras[k];
    if (regiones.length) {
      for (const [r, s] of e.lugares) if (regiones.includes(r)) sumar(nomLugar([r, s]), e.tipo);
    } else if (sistemas.includes(e.sistema)) {
      for (const [r] of e.lugares.length ? e.lugares : [['sin región']]) sumar(nomLugar([r, null]), e.tipo);
    }
  }
  if (!cuentas.size) return '';
  const lineas = [...cuentas].sort((a, b) => a[0].localeCompare(b[0], 'es')).map(([lugar, m]) => `- ${lugar}: ${[...m].sort((a, b) => b[1] - a[1]).map(([t, n]) => `${TIPOS_EN_PLURAL[t] ?? t} (${n})`).join(', ')}.`);
  return `EN EL MODELO 3D, POR ZONA (número de estructuras de cada tipo; las unidades solo pueden enseñar lo que hay):\n${lineas.join('\n')}`;
}

/** El plan que se va a redactar, con el nombre de cada estructura en el idioma de la lección. */
export function textoPlan(plan, nombre) {
  const est = plan.estructuras.map((e) => `${e.clave} (${nombre(e.clave)}; ${e.papel})`).join(', ');
  return [
    `PLAN AUTORIZADO: «${plan.titulo}». ${plan.resumen}`,
    `Nivel ${plan.nivel}; ${plan.minutos} minutos.`,
    `Objetivos (índices desde 0): ${plan.objetivos.map((o, i) => `[${i}] ${o}`).join(' ')}`,
    `Estructuras (clave, nombre en la lección, papel): ${est}.`,
    `Pasos: ${plan.pasos.map((p, i) => `[${i}] ${p.tipo} — ${p.titulo}: ${p.idea} (${p.estructuras.join(', ') || 'sin estructuras'})`).join(' ')}`,
    plan.limitaciones.length ? `Limitaciones: ${plan.limitaciones.join(' ')}` : '',
  ].filter(Boolean).join('\n');
}

/** Resumen de una lección base para planificar su adaptación. */
export function textoBase(L) {
  const est = Object.values(L.estructuras).map((e) => `${e.piezas[0]} (${e.nombre}; ${e.papel})`).join(', ');
  return [
    `LECCIÓN BASE ${L.id}: «${L.titulo}». ${L.resumen}`,
    `Nivel ${L.nivel}; ${L.minutos} minutos. Objetivos: ${L.objetivos.join(' ')}`,
    `Estructuras (clave del inventario, nombre, papel): ${est}.`,
    `Pasos: ${L.pasos.map((p, i) => `[${i}] ${p.tipo} — ${p.titulo}: ${frases(p.texto).map((f) => f[0]).join(' ').slice(0, 280)}`).join(' ')}`,
  ].join('\n');
}

/** La conversación para la API: los turnos de Neuri van como el JSON que él mismo produjo. */
export function mensajesApi(mensajes) {
  return mensajes.map((m) => (m.rol === 'usuario'
    ? { role: 'user', content: m.texto }
    : { role: 'assistant', content: JSON.stringify({ mensaje: m.texto, lecciones: m.lecciones, recorrido: m.recorrido }) }));
}
