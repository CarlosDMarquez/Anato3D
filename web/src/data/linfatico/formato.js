// Formato de las fichas del sistema linfático. Una ficha por estructura, con la clave sin lado (el nombre de la pieza
// sin «_L»/«_R»; para los nodos de Z-Anatomy, su nombre inglés con «_»: «Submandibular_nodes»). Cada campo es una lista
// de frases y cada frase lleva detrás las fuentes que la respaldan:
//
//   localizacion: [
//     ['Está en el triángulo submandibular, junto a la glándula submandibular.', W('Submandibular_lymph_nodes', 'cita literal')],
//   ],
//
// W(título, cita): Wikipedia en inglés; ES(título, cita): Wikipedia en español. La cita es un fragmento corto copiado tal
// cual de la página (lo comprueba scripts/linfatico-citas.mjs comprobar). TA(n): el término n.º n de la Terminologia
// Anatomica 2 (para afirmaciones de nomenclatura). MODELO: lo que se dice del modelo 3D de Anato3D (solo en el campo
// «modelo»: medidas, trazado esquemático, variante elegida, latín formado).
//
// La guía para redactar está en el documento del hito del sistema linfático y en scripts/linfatico-citas.mjs.

export const W = (titulo, cita) => ({ f: `wp:${titulo}`, c: cita });
export const ES = (titulo, cita) => ({ f: `wpes:${titulo}`, c: cita });
export const TA = (n) => ({ ta2: Number(n) });
export const MODELO = Object.freeze({ modelo: true });

/** Campos de una ficha linfática, en el orden en que se ven, con su etiqueta (la traduce i18n/textos.js). */
export const CAMPOS_LINF = [
  ['localizacion', 'Localización'],
  ['reparo', 'Reparo'],
  ['recibe', 'Recibe'],
  ['drena', 'Drena en'],
  ['modelo', 'En este modelo'],
];
/** Campos que toda ficha debe tener (o declarar en `pendientes` con el motivo). */
export const OBLIGATORIOS = ['descripcion', 'localizacion', 'reparo', 'recibe', 'drena', 'modelo'];
/** Tipos de ficha. `organo`: bazo, timo y amígdalas (no reciben ni drenan linfa como un nodo: pueden dejarlo en pendientes). */
export const TIPOS_LINF = ['nodo', 'conducto', 'tronco', 'cisterna', 'colector', 'organo'];
/** Etiquetas cortas (chips) que puede poner una ficha además de la del tejido. */
export const CHIPS_LINF = ['Conducto linfático', 'Tronco linfático', 'Trazado esquemático', 'Variante elegida'];

/** Frases de un campo: [[texto, ...evidencias]]. */
export const frasesDe = (campo) => (Array.isArray(campo) ? campo.filter((f) => Array.isArray(f) && typeof f[0] === 'string') : []);
/** Texto seguido de un campo (lo que se traduce y lo que lee Neuri). */
export const textoDe = (campo) => frasesDe(campo).map((f) => f[0].trim()).join(' ');
/** Evidencias de una frase. */
export const evidenciasFrase = (frase) => frase.slice(1).filter((e) => e && (e.f || e.ta2 || e.modelo));
/** Todas las evidencias de una ficha o de un grupo (con el campo en el que están). */
export function evidenciasDe(ficha) {
  const out = [];
  for (const campo of ['descripcion', ...CAMPOS_LINF.map(([k]) => k), 'notas']) {
    for (const fr of frasesDe(ficha?.[campo])) for (const e of evidenciasFrase(fr)) out.push({ campo, frase: fr[0], ...e });
  }
  return out;
}

/** Clave de ficha de un nombre de pieza o de su nombre inglés: sin lado y con «_». */
export const claveLinf = (s) => String(s ?? '').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '').replace(/_[LR]$/, '');

// ── Contrato de las piezas nuevas (las construyen tools/; los nombres los usan a la vez la geometría, las fichas y las
// lecciones). lado: 'par' (una pieza _L y otra _R) o 'impar'. latinFormado: latín descriptivo (no hay término en la TA2).
const P = (grupo, tipo, lado, es, la, extra = {}) => ({ grupo, tipo, lado, es, la, ...extra });
const TRONCOS = 'Lymphatic_trunks_and_ducts';
const VASOS = 'Lymphatic_vessels';
const ANILLO = 'Pharyngeal_lymphoid_ring';
export const CONTRATO_LINF = {
  Thoracic_duct: P(TRONCOS, 'conducto', 'impar', 'Conducto torácico', 'Ductus thoracicus'),
  Cisterna_chyli: P(TRONCOS, 'cisterna', 'impar', 'Cisterna del quilo', 'Cisterna chyli'),
  Right_lymphatic_duct: P(TRONCOS, 'conducto', 'impar', 'Conducto linfático derecho', 'Ductus lymphaticus dexter'),
  Jugular_trunk: P(TRONCOS, 'tronco', 'par', 'Tronco yugular', 'Truncus jugularis'),
  Subclavian_trunk: P(TRONCOS, 'tronco', 'par', 'Tronco subclavio', 'Truncus subclavius'),
  Bronchomediastinal_trunk: P(TRONCOS, 'tronco', 'par', 'Tronco broncomediastínico', 'Truncus bronchomediastinalis'),
  Lumbar_trunk: P(TRONCOS, 'tronco', 'par', 'Tronco lumbar', 'Truncus lumbalis'),
  Intestinal_trunks: P(TRONCOS, 'tronco', 'impar', 'Troncos intestinales', 'Trunci intestinales'),
  Lymphatic_vessels_of_head: P(VASOS, 'colector', 'par', 'Vasos linfáticos de la cabeza', 'Vasa lymphatica capitis', { latinFormado: true }),
  Lymphatic_vessels_of_neck: P(VASOS, 'colector', 'par', 'Vasos linfáticos del cuello', 'Vasa lymphatica colli', { latinFormado: true }),
  Superficial_lymphatic_vessels_of_upper_limb: P(VASOS, 'colector', 'par', 'Vasos linfáticos superficiales del miembro superior', 'Vasa lymphatica superficialia membri superioris', { latinFormado: true }),
  Deep_lymphatic_vessels_of_upper_limb: P(VASOS, 'colector', 'par', 'Vasos linfáticos profundos del miembro superior', 'Vasa lymphatica profunda membri superioris', { latinFormado: true }),
  Lymphatic_vessels_of_thoracic_wall: P(VASOS, 'colector', 'par', 'Vasos linfáticos de la pared torácica', 'Vasa lymphatica parietis thoracis', { latinFormado: true }),
  Lymphatic_vessels_of_mediastinum: P(VASOS, 'colector', 'impar', 'Vasos linfáticos del mediastino', 'Vasa lymphatica mediastini', { latinFormado: true }),
  Lymphatic_vessels_of_abdomen: P(VASOS, 'colector', 'impar', 'Vasos linfáticos del abdomen', 'Vasa lymphatica abdominis', { latinFormado: true }),
  Lymphatic_vessels_of_pelvis: P(VASOS, 'colector', 'par', 'Vasos linfáticos de la pelvis', 'Vasa lymphatica pelvis', { latinFormado: true }),
  Superficial_lymphatic_vessels_of_lower_limb: P(VASOS, 'colector', 'par', 'Vasos linfáticos superficiales del miembro inferior', 'Vasa lymphatica superficialia membri inferioris', { latinFormado: true }),
  Deep_lymphatic_vessels_of_lower_limb: P(VASOS, 'colector', 'par', 'Vasos linfáticos profundos del miembro inferior', 'Vasa lymphatica profunda membri inferioris', { latinFormado: true }),
  Pharyngeal_tonsil: P(ANILLO, 'organo', 'impar', 'Amígdala faríngea', 'Tonsilla pharyngea', { opcional: true }),
  Lingual_tonsil: P(ANILLO, 'organo', 'impar', 'Amígdala lingual', 'Tonsilla lingualis', { opcional: true }),
  Tubal_tonsil: P(ANILLO, 'organo', 'par', 'Amígdala tubárica', 'Tonsilla tubaria', { opcional: true }),
  // Nodos de Z-Anatomy que la construcción descartaba (nombre entre paréntesis en Z-Anatomy).
  Proximal_deep_inguinal_node: P('Lymph_nodes_of_lower_limb', 'nodo', 'par', 'Nodo inguinal profundo proximal', 'Nodus inguinalis profundus proximalis'),
  Intermediate_deep_inguinal_node: P('Lymph_nodes_of_lower_limb', 'nodo', 'par', 'Nodo inguinal profundo intermedio', 'Nodus inguinalis profundus intermedius'),
  Medial_lacunar_node: P('Pelvic_lymph_nodes', 'nodo', 'par', 'Nodo lacunar medial', 'Nodus lacunaris medialis'),
  Intermediate_lacunar_node: P('Pelvic_lymph_nodes', 'nodo', 'par', 'Nodo lacunar intermedio', 'Nodus lacunaris intermedius'),
  Lateral_lacunar_node: P('Pelvic_lymph_nodes', 'nodo', 'par', 'Nodo lacunar lateral', 'Nodus lacunaris lateralis'),
  Anterior_tibial_node: P('Lymph_nodes_of_lower_limb', 'nodo', 'par', 'Nodo tibial anterior', 'Nodus tibialis anterior'),
  Posterior_tibial_node: P('Lymph_nodes_of_lower_limb', 'nodo', 'par', 'Nodo tibial posterior', 'Nodus tibialis posterior'),
  Fibular_node: P('Lymph_nodes_of_lower_limb', 'nodo', 'par', 'Nodo fibular', 'Nodus fibularis'),
  Suprapyloric_node: P('Abdominal_lymph_nodes', 'nodo', 'impar', 'Nodo suprapilórico', 'Nodus suprapyloricus'),
  Subpyloric_nodes: P('Abdominal_lymph_nodes', 'nodo', 'impar', 'Nodos subpilóricos', 'Nodi subpylorici'),
  Retropyloric_nodes: P('Abdominal_lymph_nodes', 'nodo', 'impar', 'Nodos retropilóricos', 'Nodi retropylorici'),
};

// Latín del modelo con erratas heredadas de la traducción de Z-Anatomy (acentos franceses, letras que faltan). La
// Terminologia Anatomica escribe el latín sin tildes: «Nodi aortici laterales».
const ERRATAS_LATIN = [[/latérales/g, 'laterales'], [/paratrachéales/g, 'paratracheales'], [/prepericadiaci/g, 'prepericardiaci']];
/** Latín corregido de una pieza linfática; en los axilares e infraclaviculares el sinónimo de la TA va tras «;». */
export function latinLinf(la) {
  if (!la) return la;
  let s = la;
  for (const [re, x] of ERRATAS_LATIN) s = s.replace(re, x);
  return s.replace(/^(Nodi axillares \w+|Nodi infraclaviculares) (nodi \w+)$/, '$1; $2');
}

/**
 * Problemas de las fichas linfáticas: [{ nivel: 'error' | 'aviso', texto }].
 * ctx: { piezas: Set de claves (sin lado) que existen en algún modelo, citas: { fuente: [huellas] }, huella(f, c),
 *        ta2: Map n.º → latín (o null si no hay tabla) }.
 */
export function revisarFichasLinf(fichas, grupos, ctx) {
  const out = [];
  const err = (texto) => out.push({ nivel: 'error', texto });
  const aviso = (texto) => out.push({ nivel: 'aviso', texto });
  const RARO = /\s{2,}|undefined|null|NaN|\s[.,;:]|\.\./;
  const revisarFrases = (donde, campo, frases, permiteModelo) => {
    for (const fr of frasesDe(frases)) {
      const t = fr[0];
      if (!t.trim()) err(`${donde} · ${campo}: frase vacía`);
      if (RARO.test(t)) err(`${donde} · ${campo}: texto raro: «${t.slice(0, 60)}»`);
      if (!/[.!?»)]$/.test(t.trim())) err(`${donde} · ${campo}: la frase no termina en punto: «${t.slice(-40)}»`);
      const ev = evidenciasFrase(fr);
      if (!ev.length) err(`${donde} · ${campo}: frase sin fuente: «${t.slice(0, 60)}»`);
      for (const e of ev) {
        if (e.modelo && !permiteModelo) err(`${donde} · ${campo}: MODELO solo vale en «En este modelo»: «${t.slice(0, 50)}»`);
        if (e.f) {
          if (!/^(wp|wpes):/.test(e.f)) err(`${donde}: fuente no válida ${e.f} (solo Wikipedia: W o ES)`);
          else if (!e.c || e.c.length < 12) err(`${donde}: cita demasiado corta en ${e.f}`);
          else if (!(ctx.citas?.[e.f] ?? []).includes(ctx.huella(e.f, e.c))) err(`${donde} · ${campo}: cita sin comprobar en ${e.f}: «${e.c.slice(0, 60)}» (node scripts/linfatico-citas.mjs comprobar)`);
        }
        if (e.ta2 && ctx.ta2 && !ctx.ta2.has(e.ta2)) err(`${donde}: TA(${e.ta2}) no existe en la TA2`);
      }
      if (!permiteModelo && ev.length && ev.every((e) => e.modelo)) err(`${donde} · ${campo}: frase solo con MODELO fuera de «En este modelo»`);
    }
  };
  for (const [k, f] of Object.entries(fichas)) {
    const donde = `ficha ${k}`;
    if (/_[LR]$/.test(k)) err(`${donde}: la clave lleva lado (se escribe sin _L/_R)`);
    if (!ctx.piezas.has(k) && !CONTRATO_LINF[k] && !f.generica) err(`${donde}: no existe en los modelos ni en el contrato de piezas nuevas`);
    if (!TIPOS_LINF.includes(f.tipo)) err(`${donde}: tipo no válido (${f.tipo})`);
    for (const c of f.chips ?? []) if (!CHIPS_LINF.includes(c)) err(`${donde}: chip desconocido «${c}»`);
    const pend = f.pendientes ?? {};
    for (const campo of OBLIGATORIOS) {
      const tiene = frasesDe(f[campo]).length > 0;
      if (!tiene && !pend[campo]) err(`${donde}: falta «${campo}» (rellénalo con fuente o decláralo en pendientes con el motivo)`);
      if (tiene && pend[campo]) err(`${donde}: «${campo}» está relleno y a la vez en pendientes`);
      if (!tiene && pend[campo]) aviso(`${donde}: «${campo}» pendiente: ${pend[campo]}`);
    }
    for (const campo of ['descripcion', ...CAMPOS_LINF.map(([c]) => c), 'notas']) revisarFrases(donde, campo, f[campo], campo === 'modelo');
    if (frasesDe(f.modelo).length && !frasesDe(f.modelo).some((fr) => evidenciasFrase(fr).some((e) => e.modelo))) err(`${donde}: «En este modelo» sin ninguna frase marcada MODELO`);
    for (const n of [].concat(f.ta2 ?? [])) if (ctx.ta2 && !ctx.ta2.has(Number(n))) err(`${donde}: ta2 ${n} no existe en la TA2`);
    if (f.ta2 == null && !f.latinFormado && !f.generica) err(`${donde}: sin término TA2 (ta2) y sin declarar latinFormado`);
    if (f.latinFormado && !frasesDe(f.modelo).some((fr) => /lat[ií]n/i.test(fr[0]))) err(`${donde}: latín formado sin decirlo en «En este modelo»`);
    for (const lado of ['recibe', 'drena']) {
      for (const v of f.vias?.[lado] ?? []) if (!ctx.piezas.has(v) && !CONTRATO_LINF[v]) err(`${donde}: vía «${lado}» a una clave que no existe: ${v}`);
    }
  }
  for (const [k, g] of Object.entries(grupos)) {
    const donde = `grupo ${k}`;
    if (!g.nombre || !g.latin) err(`${donde}: sin nombre o sin latín`);
    if (!frasesDe(g.descripcion).length) err(`${donde}: sin descripción`);
    revisarFrases(donde, 'descripcion', g.descripcion, true);
    if (frasesDe(g.descripcion).length && frasesDe(g.descripcion).every((fr) => evidenciasFrase(fr).every((e) => e.modelo))) err(`${donde}: la descripción solo habla del modelo`);
  }
  return out;
}
