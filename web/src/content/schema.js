// Esquema del contenido de estudio (módulos y fichas de estructura). Sin DOM: lo usan la app (ui/info.js) y el revisor
// (scripts/check-cards.mjs).
//
// Una ficha de estructura:
//   id            identificador estable, independiente del nombre de las mallas («nervio-radial»)
//   tipo          musculo | nervio | arteria | vena | hueso | ligamento | organo
//   nombre        nombre en español (término de la TA2 cuando lo hay)
//   sinonimos     otros nombres en uso en español: [{ nombre, fuente }], cada uno con la fuente que lo da por nombre de la
//                 misma estructura (la ficha los muestra en español y el buscador los encuentra)
//   latin         término latino; `ta2`: número del término en la Terminologia Anatomica 2
//   region        ruta de región («Miembro superior › Brazo»); `compartimento` si aplica
//   lado          bilateral | impar
//   modelos       ['male', 'female']: en qué modelos existe (el revisor lo comprueba en los GLB)
//   piezas        nombres base de las mallas (sin _L/_R) que forman la estructura
//   descripcion   qué es, en dos o tres frases
//   funcion       para qué sirve (en los músculos, `campos.accion` hace este papel)
//   campos        los propios de su tipo (CAMPOS); cada uno con su fuente
//   relaciones    [{ texto, con?: id de otra ficha, fuente }]
//   simplificaciones  diferencias conocidas entre el modelo 3D y la anatomía, por modelo si hace falta
//   fuentes       { terminologia: [{ fuente, termino }], contenido: [{ fuente, apoya: [campos] }] }
//                 Las de terminología respaldan el nombre y el latín; las de contenido, las afirmaciones.
//   revision      { estado, revisor, fecha, notas }: nadie puede figurar como revisor sin haberlo hecho.

export const CAMPOS = {
  musculo: { origen: 'Origen', insercion: 'Inserción', accion: 'Acción', inervacion: 'Inervación', irrigacion: 'Irrigación' },
  nervio: { origen: 'Origen', trayecto: 'Trayecto', inerva: 'Inerva', sensitivo: 'Sensibilidad' },
  arteria: { origen: 'Origen', trayecto: 'Trayecto', ramas: 'Ramas', territorio: 'Territorio' },
  vena: { origen: 'Origen', trayecto: 'Trayecto', drenaje: 'Desemboca en' },
  hueso: { partes: 'Partes', articulaciones: 'Articulaciones', inserciones: 'Inserciones musculares' },
  ligamento: { inserciones: 'Inserciones', papel: 'Papel mecánico' },
  organo: { localizacion: 'Localización', funcion: 'Función' },
};

// Campos sin los que la ficha no está completa.
export const OBLIGATORIOS = {
  musculo: ['origen', 'insercion', 'accion', 'inervacion'],
  nervio: ['origen', 'trayecto', 'inerva'],
  arteria: ['origen', 'trayecto', 'territorio'],
  vena: ['trayecto', 'drenaje'],
  hueso: ['partes', 'articulaciones'],
  ligamento: ['inserciones', 'papel'],
  organo: ['localizacion', 'funcion'],
};

export const ESTADOS = {
  borrador: 'Borrador · sin revisar por un especialista',
  revisado: 'Revisado por un especialista',
  retirado: 'Retirado',
};

// Textos genéricos de las fichas antiguas (data/*.js): una ficha de módulo no puede usarlos.
export const GENERICOS = [
  /^Vaso que lleva la sangre desde el corazón/, /^Vaso que devuelve la sangre/, /^Haz de fibras nerviosas (\(axones\) )?que conecta/,
  /^Banda de tejido conectivo fibroso denso que une hueso con hueso/, /^Grupo de nodos linfáticos/,
];

/**
 * Problemas de una ficha. `fuentes`: catálogo de fuentes. `piezasDe(modelo)`: Set con los nombres de las mallas de ese
 * modelo (con _L/_R). Devuelve [{ nivel: 'error' | 'aviso', texto }].
 */
export function revisarFicha(f, { fuentes, piezasDe, ids }) {
  const out = [];
  const err = (texto) => out.push({ nivel: 'error', texto: `${f.id ?? '?'}: ${texto}` });
  const aviso = (texto) => out.push({ nivel: 'aviso', texto: `${f.id ?? '?'}: ${texto}` });
  if (!/^[a-z0-9-]+$/.test(f.id ?? '')) err('identificador vacío o con caracteres no válidos');
  if (!CAMPOS[f.tipo]) return err(`tipo desconocido: ${f.tipo}`), out;
  for (const k of ['nombre', 'latin', 'region', 'descripcion']) if (!f[k]) err(`falta «${k}»`);
  if (f.tipo !== 'musculo' && !f.funcion) err('falta «funcion»');
  for (const k of OBLIGATORIOS[f.tipo]) if (!f.campos?.[k]) err(`falta el campo obligatorio «${k}»`);
  for (const k of Object.keys(f.campos ?? {})) if (!(k in CAMPOS[f.tipo])) err(`campo «${k}» no es de un ${f.tipo}`);
  for (const t of [f.descripcion, f.funcion, ...Object.values(f.campos ?? {})]) {
    if (t && GENERICOS.some((g) => g.test(t))) err(`texto genérico: «${t.slice(0, 50)}…»`);
  }
  // Fuentes: terminología y contenido por separado; toda afirmación respaldada por una fuente de contenido.
  const term = f.fuentes?.terminologia ?? [];
  const cont = f.fuentes?.contenido ?? [];
  if (!term.length) err('sin fuente de terminología');
  if (!cont.length) err('sin fuente de contenido');
  for (const s of [...term, ...cont]) if (!fuentes[s.fuente]) err(`fuente desconocida: ${s.fuente}`);
  const apoyado = new Set(cont.flatMap((s) => s.apoya ?? []));
  const afirmaciones = ['descripcion', ...(f.funcion ? ['funcion'] : []), ...Object.keys(f.campos ?? {})];
  for (const k of afirmaciones) if (!apoyado.has(k)) err(`«${k}» sin fuente de contenido`);
  for (const r of f.relaciones ?? []) {
    if (!fuentes[r.fuente]) err(`relación sin fuente válida: «${r.texto.slice(0, 40)}…»`);
    if (r.con && !ids.has(r.con)) err(`relación con una ficha que no existe: ${r.con}`);
  }
  for (const sn of f.sinonimos ?? []) {
    if (typeof sn !== 'object' || !sn.nombre) err('sinónimo sin nombre (formato: { nombre, fuente })');
    else if (!sn.fuente) aviso(`sinónimo «${sn.nombre}» sin fuente comprobada`);
    else if (!fuentes[sn.fuente]) err(`sinónimo «${sn.nombre}»: fuente desconocida ${sn.fuente}`);
  }
  // Aplicabilidad: cada pieza tiene que existir en los modelos declarados, y en los demás no.
  const lados = f.lado === 'bilateral' ? ['_L', '_R'] : [''];
  for (const modelo of ['male', 'female']) {
    const nombres = piezasDe(modelo);
    if (!nombres) continue;
    const esta = (p) => lados.every((l) => nombres.has(p + l));
    if ((f.modelos ?? []).includes(modelo)) {
      for (const p of f.piezas ?? []) if (!esta(p)) err(`la pieza ${p}${lados.join('/')} no existe en el modelo ${modelo}`);
    } else if ((f.piezas ?? []).some(esta)) err(`existe en el modelo ${modelo}, pero la ficha no lo declara`);
  }
  if (!(f.revision?.estado in ESTADOS)) err('estado de revisión no válido');
  if (f.revision?.estado === 'revisado' && !(f.revision.revisor && f.revision.fecha)) err('«revisado» sin revisor ni fecha');
  return out;
}

/** Problemas del módulo fuera de las fichas: versión, lección y banco de preguntas. */
export function revisarModulo(mod, { fuentes }) {
  const out = [];
  const err = (texto) => out.push({ nivel: 'error', texto });
  const ids = new Set(mod.estructuras.map((f) => f.id));
  if (!mod.version) err(`${mod.id}: sin «version» (el progreso guardado la necesita para saber si el contenido cambió)`);
  for (const paso of mod.leccion ?? []) {
    if (!paso.titulo || !paso.texto) err(`lección «${paso.id}»: sin título o sin texto`);
    for (const id of paso.fichas ?? []) if (!ids.has(id)) err(`lección «${paso.id}»: ficha inexistente ${id}`);
    if (!paso.fuentes?.length || paso.fuentes.some((f) => !fuentes[f])) err(`lección «${paso.id}»: sin fuente válida`);
  }
  const vistos = new Set();
  for (const p of mod.preguntas ?? []) {
    if (vistos.has(p.id)) err(`pregunta repetida: ${p.id}`);
    vistos.add(p.id);
    if (!p.enunciado || !p.correcta || !p.explicacion) err(`pregunta «${p.id}»: falta enunciado, respuesta o explicación`);
    if (p.distractores?.length !== 3) err(`pregunta «${p.id}»: necesita 3 distractores`);
    if (new Set([p.correcta, ...(p.distractores ?? [])]).size !== 1 + (p.distractores?.length ?? 0)) err(`pregunta «${p.id}»: opciones repetidas`);
    if (!p.fichas?.length || p.fichas.some((id) => !ids.has(id))) err(`pregunta «${p.id}»: fichas inexistentes`);
    if (!fuentes[p.fuente]) err(`pregunta «${p.id}»: sin fuente válida`);
  }
  // Cada estructura que se puede preguntar por identificación necesita al menos tres nombres distintos con los que
  // confundirla: las evaluables y también las de contexto, porque el repaso pregunta por ellas cuando se falla una
  // pregunta de texto que las tiene como ficha principal.
  const grupo = (t) => ({ arteria: 'vaso', vena: 'vaso' })[t] ?? t;
  for (const id of [...mod.nucleo, ...(mod.contexto ?? [])]) {
    const f = mod.estructuras.find((g) => g.id === id);
    if (!f) continue;                     // check-cards ya avisa de las que no tienen ficha
    const mismos = mod.estructuras.filter((g) => g.id !== id && grupo(g.tipo) === grupo(f.tipo)).map((g) => g.nombre);
    const otros = new Set([...mismos, ...(mod.distractoresExtra?.[id] ?? [])]);
    otros.delete(f.nombre);
    if (otros.size < 3) err(`${id}: menos de 3 distractores para la pregunta de identificación`);
  }
  return out;
}
