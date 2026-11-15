// Hoja de revisión de las fichas del sistema linfático (src/data/linfatico/) para un anatomista externo, generada de las
// propias fichas, para que lo que se revisa sea exactamente lo que la app muestra. Es el equivalente, para las fichas
// linfáticas, de scripts/biblioteca/hoja-revision.mjs (lecciones) y usa sus mismos veredictos y columnas.
//
// Uso (desde web/):
//   npm run hoja-linfatico                     escribe ../docs/revision/linfatico-fichas-2026-11-13.md
//   node scripts/biblioteca/hoja-linfatico.mjs [--fecha AAAA-MM-DD] [--salida <archivo.md>]
//
// Una sección por región (cabeza, cuello, miembro superior, tórax, abdomen, pelvis, miembro inferior, vía central y
// colectores, órganos) y una tabla por ficha (primero la del grupo). Cada fila es una afirmación: una frase de la ficha
// (descripción, Localización, Reparo, Recibe, Drena en, En este modelo, Puntos clave), su nombre y latín, o un campo
// «pendiente» (sin dato, para que el anatomista lo aporte si quiere). Código estable L-<REGIÓN>-<n.º>: se numera en el
// orden de los archivos de fichas, así que el mismo contenido da siempre los mismos códigos. Una frase que ya salió antes
// (mismo texto y mismas fuentes) remite al código de la primera vez. Las frases que el propio modelo declara esquemáticas
// o variante van marcadas. Veredicto «Sin revisar» en cada fila; no marca nada como revisado.
//
// Determinista: no usa la hora ni la red. Lee las fichas, las fuentes registradas (comprobadas.js) y los nombres de las
// piezas de los modelos publicados (public/models/*.glb). Termina con código 1 si alguna ficha o grupo queda sin región o
// si alguna pieza linfática de un modelo no tiene ficha en la hoja.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ARCHIVOS_LINF, GRUPOS_LINF, CONTRATO_LINF, frasesDe, evidenciasFrase, claveLinf, latinLinf } from '../../src/data/linfatico/index.js';
import { FUENTES_LINF } from '../../src/data/linfatico/comprobadas.js';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const opcion = (nombre) => { const i = args.indexOf(nombre); return i < 0 ? null : args[i + 1] ?? null; };
const FECHA = opcion('--fecha') ?? '2026-11-13';
const SALIDA = path.resolve(RAIZ, opcion('--salida') ?? `../docs/revision/linfatico-fichas-${FECHA}.md`);
const MODELOS = path.join(RAIZ, 'public/models');
const SIN = 'Sin revisar';
const TA2_URL = 'https://ta2viewer.openanatomy.org/';
const MAX_CITA = 160;

// ── Regiones, en el orden de revisión del encargo. archivo: el de src/data/linfatico/; filtro: qué fichas de ese archivo;
// grupos: fichas de grupo (GRUPOS_LINF) que van al principio (o al final, en `gruposFinal`). capturas: relativas a
// build/linfatico/capturas/ (las hay también de la mujer, con «female_»).
const REGIONES = [
  { id: 'CAB', nombre: 'Cabeza', archivo: 'cabeza', fuentes: 'linfatico-cabeza.md', grupos: ['Lymph_nodes_of_head'],
    capturas: ['male_cuello_izq.png', 'male_cuello_der.png', 'vasos/male_cuello_izq_3q.png'],
    nota: 'Los nodos submandibulares y submentonianos están en el grupo del cuello en el modelo (como en la TA2), pero sus fichas se escribieron con las de la cabeza y se revisan aquí.' },
  { id: 'CUE', nombre: 'Cuello', archivo: 'cuello', fuentes: 'linfatico-cuello.md', grupos: ['Lymph_nodes_of_neck'],
    capturas: ['male_cuello_izq.png', 'male_cuello_der.png', 'male_submenton.png', 'female_cuello_izq.png', 'vasos/male_cuello_izq.png', 'vasos/male_cuello_der.png', 'vasos/male_cuello_izq_3q.png'] },
  { id: 'MS', nombre: 'Miembro superior', archivo: 'miembro-superior', fuentes: 'linfatico-miembro-superior.md', grupos: ['Lymph_nodes_of_upper_limb'],
    capturas: ['male_axila_izq.png', 'vasos/male_axila_izq.png', 'vasos/male_codo_izq.png'] },
  { id: 'TOR', nombre: 'Tórax', archivo: 'torax', fuentes: 'linfatico-torax.md', grupos: ['Thoracic_lymph_nodes'],
    capturas: ['male_torax_posterior.png', 'vasos/male_mediastino_post.png', 'vasos/male_mediastino_der.png'] },
  { id: 'ABD', nombre: 'Abdomen', archivo: 'abdomen', fuentes: 'linfatico-abdomen.md', grupos: ['Abdominal_lymph_nodes'],
    capturas: ['male_abdomen.png', 'vasos/male_abdomen.png', 'vasos/male_cisterna_der.png'] },
  { id: 'PEL', nombre: 'Pelvis', archivo: 'pelvis', fuentes: 'linfatico-pelvis.md', grupos: ['Pelvic_lymph_nodes'],
    capturas: ['vasos/male_pelvis.png', 'vasos/female_pelvis.png'] },
  { id: 'MI', nombre: 'Miembro inferior', archivo: 'miembro-inferior', fuentes: 'linfatico-miembro-inferior.md', grupos: ['Lymph_nodes_of_lower_limb'],
    capturas: ['male_ingle_izq.png', 'female_ingle_izq.png', 'vasos/male_ingle_frente_izq.png', 'vasos/male_popliteo_izq.png'] },
  { id: 'VC', nombre: 'Vía central y colectores', archivo: 'centrales', fuentes: 'linfatico-centrales-2026-11-11.md',
    filtro: (f) => f.tipo !== 'organo', grupos: ['Lymphatic_trunks_and_ducts', 'Lymphatic_vessels'], gruposFinal: ['Lymph_nodes'],
    capturas: ['vasos/resaltado/male_via_central_frente.png', 'vasos/resaltado/male_via_central_der.png', 'vasos/resaltado/male_cisterna_der.png', 'vasos/resaltado/male_mediastino_post.png', 'vasos/resaltado/male_angulo_venoso_izq.png', 'vasos/resaltado/male_angulo_venoso_der.png', 'vasos/male_cuerpo_frente_linf.png'],
    nota: 'Al final van la ficha del grupo «Nodos linfáticos» y la ficha general del nodo, que solo vería un grupo de nodos sin ficha propia (hoy ninguno: las 193 piezas de cada modelo tienen la suya).' },
  { id: 'ORG', nombre: 'Órganos', archivo: 'centrales', fuentes: 'linfatico-centrales-2026-11-11.md',
    filtro: (f) => f.tipo === 'organo', grupos: ['Pharyngeal_lymphoid_ring', 'Thymus'],
    capturas: ['male_cuerpo_frente.png', 'vasos/male_cuerpo_frente.png'],
    nota: 'Bazo, timo y amígdalas. Las amígdalas faríngea, lingual y tubárica tienen ficha, pero aún no están construidas en el modelo 3D.' },
];
const PRIORIDAD = { VC: 1, CUE: 1 };

const CAMPOS = [['descripcion', 'Descripción'], ['localizacion', 'Localización'], ['reparo', 'Reparo'], ['recibe', 'Recibe'], ['drena', 'Drena en'], ['modelo', 'En este modelo'], ['notas', 'Puntos clave']];
const TIPO = { nodo: 'nodo', conducto: 'conducto', tronco: 'tronco', cisterna: 'cisterna', colector: 'colector (vasos)', organo: 'órgano' };

// ── Utilidades de texto ──
const celda = (s) => String(s ?? '').replace(/\s+/g, ' ').replace(/\|/g, '\\|').trim();
const fila = (...c) => `| ${c.map(celda).join(' | ')} |`;
const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
/** Cita abreviada a ≤ MAX_CITA caracteres (cortada en un espacio, con «…»). */
function abreviar(c) {
  const t = String(c).replace(/\s+/g, ' ').trim();
  if (t.length <= MAX_CITA) return t;
  const corte = t.slice(0, MAX_CITA - 1);
  const i = corte.lastIndexOf(' ');
  return `${(i > 80 ? corte.slice(0, i) : corte).replace(/[\s,;:.]+$/, '')}…`;
}
/** Fuente de una evidencia: texto de la celda (cita abreviada y enlace a la versión leída). */
function fuenteTexto(e) {
  if (e.modelo) return 'Declaración del propio modelo de Anato3D (sin fuente externa)';
  if (e.ta2) return `Terminologia Anatomica 2, [término n.º ${e.ta2}](${TA2_URL})`;
  const i = e.f.indexOf(':');
  const tipo = e.f.slice(0, i);
  const pagina = e.f.slice(i + 1);
  const reg = FUENTES_LINF[e.f];
  const titulo = (reg?.titulo ?? pagina.replace(/_/g, ' ')) + (tipo === 'wpes' ? ' (Wikipedia en español)' : '');
  const url = reg?.url ?? `https://${tipo === 'wpes' ? 'es' : 'en'}.wikipedia.org/wiki/${encodeURIComponent(pagina)}`;
  return `«${abreviar(e.c)}» ([${titulo}](${url}))`;
}
/** Marcas de una frase del modelo: esquemático, variante, interpretación de las fuentes, diferencia con la fuente, no
 * representado o, si no es nada de eso, declaración del modelo. */
function marcas(texto, ev) {
  if (!ev.some((e) => e.modelo)) return [];
  const m = [];
  if (/esquem|representativ|orientativ|no son medidas|no es el real|generad|no se ha[n]? medido|no reproduce/i.test(texto)) m.push('ESQUEMÁTICO');
  if (/variante/i.test(texto)) m.push('VARIANTE');
  if (/identifica|se interpreta|asigna al|les? aplica|usa lo que se dice/i.test(texto)) m.push('INTERPRETACIÓN');
  if (/como (dice|describe) la fuente|que describe la fuente|aunque la fuente describe|la fuente no describe ese paso|frente a los/i.test(texto)) m.push('DIFIERE DE LA FUENTE');
  if (/no (se representan?|está representad[oa]|hay pieza|hay nodos)|no los trae/i.test(texto)) m.push('NO REPRESENTADO');
  if (!m.length) m.push('MODELO');
  return m;
}
const etiqueta = (m) => m.map((x) => `**[${x}]**`).join(' ');

// ── Piezas de los modelos publicados (nombre en español y latín, lados, modelos en los que están) ──
function nodosGlb(archivo) {
  const b = fs.readFileSync(path.join(MODELOS, archivo));
  return JSON.parse(b.subarray(20, 20 + b.readUInt32LE(12)).toString('utf8')).nodes ?? [];
}
const FICHAS = {};
for (const fichas of Object.values(ARCHIVOS_LINF)) for (const [k, f] of Object.entries(fichas)) FICHAS[k] ??= f;
const piezas = {};                                       // clave de ficha → { modelos, nombres, es, la }
const cobertura = {};                                    // modelo → { total, conFicha, sin: [] }
for (const modelo of ['male', 'female']) {
  cobertura[modelo] = { total: 0, conFicha: 0, sin: [] };
  const archivos = fs.existsSync(MODELOS) ? fs.readdirSync(MODELOS).filter((f) => f.endsWith('.glb') && f.startsWith(`${modelo}-`)).sort() : [];
  for (const archivo of archivos) {
    for (const n of nodosGlb(archivo)) {
      const x = n.extras ?? {};
      if (x.system !== 'lymphatic') continue;
      const nombre = (n.name ?? '').replace(/\s/g, '_').replace(/[[\].:/]/g, '');
      const k1 = claveLinf(String(x.name_en ?? '').replace(/[^A-Za-z0-9]+/g, '_'));
      const clave = FICHAS[k1] && !FICHAS[k1].generica ? k1 : claveLinf(nombre);
      cobertura[modelo].total++;
      if (!FICHAS[clave] || FICHAS[clave].generica) { cobertura[modelo].sin.push(nombre); continue; }
      cobertura[modelo].conFicha++;
      const p = (piezas[clave] ??= { modelos: new Set(), nombres: new Set(), es: x.name_es, la: x.name_la });
      p.modelos.add(modelo);
      p.nombres.add(nombre);
    }
  }
}

// ── Construcción de la hoja ──
const vistas = new Map();                                // frase (texto + fuentes) → código de la primera vez
const contar = () => ({ fichas: 0, afirmaciones: 0, repetidas: 0, esquema: 0, interpretacion: 0, pendientes: 0, segundos: 0, segundosPuntos: 0, porCampo: {} });
const totales = contar();
const asignadas = new Set();
const gruposAsignados = new Set();
const secciones = {};                                    // id de región → texto
const resumen = {};                                      // id de región → { R, c, min }

/** Segundos estimados: ≈ 20 s una afirmación sencilla; 40 s si es larga o tiene varias citas; 10 s el nombre; 5 s una repetida. */
function segundosDe(texto, ev) {
  const externas = ev.filter((e) => !e.modelo).length;
  return texto.length > 180 || externas > 2 ? 40 : 20;
}

// Se procesa en orden de prioridad (vía central y cuello primero), para que una frase repetida remita siempre a una fila
// que se revisa antes; la hoja sale después en el orden anatómico.
const ORDEN = [...REGIONES].sort((a, b) => (PRIORIDAD[a.id] ?? 2) - (PRIORIDAD[b.id] ?? 2));
for (const R of ORDEN) {
  const c = contar();
  let n = 0;
  const codigo = () => `L-${R.id}-${String(++n).padStart(3, '0')}`;
  const out = [];
  const filas = [];
  const cabeceraTabla = () => {
    filas.push('| Código | Campo | Afirmación (texto que muestra la app) | Fuente: cita literal abreviada y enlace | Veredicto | Comentario |');
    filas.push('| --- | --- | --- | --- | --- | --- |');
  };
  /** Una frase → una fila (o una remisión a la fila en la que ya salió). */
  const frase = (campo, fr) => {
    const texto = fr[0].trim();
    const ev = evidenciasFrase(fr);
    const m = marcas(texto, ev);
    const huella = JSON.stringify([texto, ev]);
    const cod = codigo();
    c.afirmaciones++;
    if (m.includes('ESQUEMÁTICO') || m.includes('VARIANTE')) c.esquema++;
    if (m.includes('INTERPRETACIÓN') || m.includes('DIFIERE DE LA FUENTE')) c.interpretacion++;
    const previa = vistas.get(huella);
    if (previa) {
      c.repetidas++;
      c.segundos += 5;
      c.porCampo[campo] = (c.porCampo[campo] ?? 0) + 5;
      filas.push(fila(cod, campo, `${etiqueta(m)} ${texto}`, `Misma frase y mismas fuentes que **${previa}**: su veredicto vale aquí.`, `= ${previa}`, ''));
      return;
    }
    vistas.set(huella, cod);
    c.segundos += segundosDe(texto, ev);
    if (campo === 'Puntos clave') c.segundosPuntos += segundosDe(texto, ev);
    c.porCampo[campo] = (c.porCampo[campo] ?? 0) + segundosDe(texto, ev);
    filas.push(fila(cod, campo, `${etiqueta(m)} ${texto}`, ev.map(fuenteTexto).join(' · '), SIN, ''));
  };
  const pendiente = (campo, motivo) => {
    c.afirmaciones++;
    c.pendientes++;
    filas.push(fila(codigo(), campo, `**[PENDIENTE]** La app no da este dato. Motivo: ${motivo}`, 'Sin fuente. Si conoce el dato, escríbalo en «Comentario» con su referencia (opcional).', SIN, ''));
  };
  const grupo = (g) => {
    const G = GRUPOS_LINF[g];
    if (!G) throw new Error(`Grupo ${g} de la región ${R.nombre} no existe en GRUPOS_LINF`);
    if (gruposAsignados.has(g)) throw new Error(`Grupo ${g} en dos regiones`);
    gruposAsignados.add(g);
    filas.length = 0;
    out.push(`### Grupo: ${G.nombre} (\`${g}\`)`, '', `- **Latín:** *${G.latin}* · ficha de grupo (la que se ve al elegir el grupo entero)`, '');
    cabeceraTabla();
    for (const fr of frasesDe(G.descripcion)) frase('Descripción del grupo', fr);
    out.push(...filas, '');
  };
  const ficha = (k, f) => {
    if (asignadas.has(k)) throw new Error(`Ficha ${k} en dos regiones`);
    asignadas.add(k);
    c.fichas++;
    const p = piezas[k];
    const contrato = CONTRATO_LINF[k];
    const titulo = f.generica ? 'Nodo linfático (ficha general)' : cap(p?.es || contrato?.es || k.replace(/_/g, ' '));
    const latin = f.latin ?? latinLinf(p?.la) ?? contrato?.la ?? (f.generica ? 'Nodus lymphoideus' : null);
    const ta2 = [].concat(f.ta2 ?? []);
    const lados = p ? ([...p.nombres].some((x) => /_[LR]$/.test(x)) ? 'par (una pieza por lado)' : 'impar') : '—';
    const modelos = p ? [...p.modelos].map((m) => (m === 'male' ? 'hombre' : 'mujer')).join(' y ') : (f.generica ? 'ninguna pieza la usa hoy' : 'aún no construida en el modelo');
    const chips = (f.chips ?? []).filter((x) => /esquem|variante/i.test(x));
    out.push(`### ${titulo} (\`${k}\`)`, '');
    out.push(`- **Tipo:** ${TIPO[f.tipo] ?? f.tipo} · **lado:** ${lados} · **en el modelo:** ${modelos}${chips.length ? ` · **la ficha lo declara:** ${chips.map((x) => `**[${x.toUpperCase()}]**`).join(' ')}` : ''}`, '');
    filas.length = 0;
    cabeceraTabla();
    // Nombre: lo que muestra la cabecera de la ficha.
    const cod = codigo();
    c.afirmaciones++;
    c.segundos += 10;
    c.porCampo.Nombre = (c.porCampo.Nombre ?? 0) + 10;
    const nombreTexto = `${titulo} · latín: *${latin ?? '(sin latín)'}*`;
    const nombreFuente = f.latinFormado
      ? `${ta2.length ? `${ta2.map((t) => `[TA2 n.º ${t}](${TA2_URL})`).join(', ')}; ` : ''}latín descriptivo formado para Anato3D: la TA2 no tiene término propio`
      : ta2.length ? `Terminologia Anatomica 2, ${ta2.map((t) => `[término n.º ${t}](${TA2_URL})`).join(', ')}${f.generica ? ' (el de «nodo linfático»)' : ''}` : 'Nombre de la pieza en el modelo (Z-Anatomy)';
    filas.push(fila(cod, 'Nombre', `${f.latinFormado ? '**[LATÍN FORMADO]** ' : ''}${nombreTexto}`, nombreFuente, SIN, ''));
    for (const [campo, etiquetaCampo] of CAMPOS) {
      const frases = frasesDe(f[campo]);
      for (const fr of frases) frase(etiquetaCampo, fr);
      if (!frases.length && f.pendientes?.[campo]) pendiente(etiquetaCampo, f.pendientes[campo]);
    }
    out.push(...filas, '');
  };

  const fichas = Object.entries(ARCHIVOS_LINF[R.archivo] ?? {}).filter(([, f]) => !R.filtro || R.filtro(f));
  for (const g of R.grupos ?? []) grupo(g);
  for (const [k, f] of fichas.filter(([, f]) => !f.generica)) ficha(k, f);
  for (const g of R.gruposFinal ?? []) grupo(g);
  for (const [k, f] of fichas.filter(([, f]) => f.generica)) ficha(k, f);

  const min = Math.round(c.segundos / 60);
  for (const x of Object.keys(totales)) if (typeof c[x] === 'number') totales[x] += c[x];
  resumen[R.id] = { R, c, min, minSinPuntos: Math.round((c.segundos - c.segundosPuntos) / 60) };
  const cabecera = [
    `## ${R.nombre} (L-${R.id})`, '',
    `- **Prioridad:** ${PRIORIDAD[R.id] ? '1 (revisar primero)' : '2'} · **fichas:** ${c.fichas} · **afirmaciones:** ${c.afirmaciones} (${c.repetidas} repetidas, ${c.esquema} marcadas esquemático o variante, ${c.interpretacion} de interpretación o que difieren de la fuente, ${c.pendientes} pendientes) · **tiempo estimado:** ≈ ${min} min (≈ ${Math.round((c.segundos - c.segundosPuntos) / 60)} min sin «Puntos clave»)`,
    `- **Fuentes de esta región, frase por frase:** [docs/fuentes/${R.fuentes}](../fuentes/${R.fuentes}) · **archivo de fichas:** \`web/src/data/linfatico/${R.archivo}.js\``,
    `- **Capturas:** ${R.capturas.map((x) => `[${x}](../../build/linfatico/capturas/${x})`).join(', ')}`,
  ];
  if (R.nota) cabecera.push(`- **Nota:** ${R.nota}`);
  secciones[R.id] = [...cabecera, '', ...out].join('\n');
}

// Todo asignado: ninguna ficha ni grupo fuera de la hoja.
const faltan = Object.keys(FICHAS).filter((k) => !asignadas.has(k));
const gruposFaltan = Object.keys(GRUPOS_LINF).filter((g) => !gruposAsignados.has(g));
const horas = (s) => { const m = Math.round(s / 60); return `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')} min`; };
const filasResumen = REGIONES.map((R) => resumen[R.id]);
const prioridad1 = filasResumen.filter((r) => PRIORIDAD[r.R.id]).reduce((s, r) => s + r.c.segundos, 0);
const resto = filasResumen.filter((r) => !PRIORIDAD[r.R.id]);
const restoSinPuntos = resto.reduce((s, r) => s + r.c.segundos - r.c.segundosPuntos, 0);
const puntosResto = resto.reduce((s, r) => s + r.c.segundosPuntos, 0);
const campoResto = (campo) => resto.reduce((s, r) => s + (r.c.porCampo[campo] ?? 0), 0);
const minutos = (s) => `≈ ${Math.round(s / 60)} min`;

const doc = [
  '---',
  'title: Revisión de las fichas del sistema linfático',
  `fecha: ${FECHA}`,
  'estado: sin-revisar',
  '---',
  '',
  `# Revisión de las fichas del sistema linfático (${FECHA})`,
  '',
  'Generada con `npm run hoja-linfatico` (desde `web/`) a partir de las fichas de la app (`web/src/data/linfatico/`): lo que se revisa es exactamente lo que muestra la ficha de cada pieza. Guía para quien revisa: [linfatico-guia-2026-11-13.md](linfatico-guia-2026-11-13.md).',
  '',
  '## Cómo revisar',
  '',
  'Cada fila tiene un **código** estable (L-CUE-012 = cuello, afirmación 12), el **campo** de la ficha, el **texto exacto que muestra la app**, la **cita** de la fuente que lo respalda (abreviada a 160 caracteres, con enlace a la versión de la página que se leyó), un **veredicto** y un **comentario**.',
  '',
  '1. Lea el texto y compárelo con su cita, con la fuente enlazada o con su propio conocimiento.',
  '2. Elija el veredicto: **Correcto**, **Corregir** (escriba la corrección en «Comentario») o **Dudoso** (explique la duda).',
  '3. Las filas que dicen «= L-…» repiten una frase que ya salió antes con las mismas fuentes: vale el veredicto de esa fila; cámbielo solo si en esta ficha la frase no encaja.',
  '',
  'La app comprobó que cada cita está, palabra por palabra, en la versión registrada de su página. No comprobó que la frase en español sea una buena interpretación de la cita ni que sea correcta: eso es lo que se revisa.',
  '',
  '**Marcas:**',
  '',
  '- **[ESQUEMÁTICO]**, **[VARIANTE]**: el propio modelo declara que esa forma, tamaño, número o trayecto es esquemático, o que representa una variante elegida para enseñar. No son errores salvo que enseñen algo falso.',
  '- **[INTERPRETACIÓN]**: la ficha equipara un término de la TA2 con lo que describe una fuente que usa otro nombre, o aplica a un subgrupo lo que la fuente dice del grupo. Conviene mirarlas con atención.',
  '- **[DIFIERE DE LA FUENTE]**: el modelo 3D (casi siempre un colector esquemático) no sigue exactamente la vía o el número que da la fuente, y la ficha lo dice.',
  '- **[NO REPRESENTADO]**: la ficha avisa de un grupo o nodo de la TA2 que no tiene pieza en el modelo.',
  '- **[MODELO]**: otra declaración sobre el modelo 3D de Anato3D (sin fuente externa).',
  '- **[LATÍN FORMADO]**: latín descriptivo hecho para Anato3D porque la Terminologia Anatomica 2 no tiene término para esa estructura.',
  '- **[PENDIENTE]**: la ficha no da ese dato porque ninguna fuente libre consultada lo describe. Si conoce el dato, puede aportarlo en «Comentario» con su referencia (opcional).',
  '',
  '- **Origen:** redactadas por IA (Claude) a partir de las fuentes citadas (Wikipedia en inglés y en español, CC BY-SA 4.0, y la Terminologia Anatomica 2). Pendientes de revisión por un especialista.',
  '- **Estado en la app:** borrador, sin revisar por un especialista.',
  '- **Idioma del contenido:** es. Revisar el español no valida las traducciones.',
  `- **Piezas del modelo con ficha propia:** hombre ${cobertura.male.conFicha}/${cobertura.male.total}, mujer ${cobertura.female.conFicha}/${cobertura.female.total}.`,
  '',
  '## Índice',
  '',
  'Tiempo estimado: ≈ 20 s por afirmación sencilla, 40 s por una larga o con más de dos citas, 10 s por el nombre y 5 s por una repetida; los campos pendientes no cuentan (son opcionales).',
  '',
  '| Prioridad | Región | Fichas | Afirmaciones | Repetidas | Esquemático o variante | Interpretación o difiere | Pendientes | Tiempo estimado | Sin «Puntos clave» |',
  '| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',
  ...filasResumen.map(({ R, c, min, minSinPuntos }) => `| ${PRIORIDAD[R.id] ?? 2} | [${R.nombre} (L-${R.id})](#${ancla(`${R.nombre} (L-${R.id})`)}) | ${c.fichas} | ${c.afirmaciones} | ${c.repetidas} | ${c.esquema} | ${c.interpretacion} | ${c.pendientes} | ≈ ${min} min | ≈ ${minSinPuntos} min |`),
  `| | **Total** | **${totales.fichas}** | **${totales.afirmaciones}** | **${totales.repetidas}** | **${totales.esquema}** | **${totales.interpretacion}** | **${totales.pendientes}** | **≈ ${horas(totales.segundos)}** | **≈ ${horas(totales.segundos - totales.segundosPuntos)}** |`,
  '',
  `- **Prioridad 1** (vía central y colectores, cuello), todo: ≈ ${horas(prioridad1)}.`,
  `- **Prioridad 2** (el resto) sin «Puntos clave»: ≈ ${horas(restoSinPuntos)}; sus «Puntos clave» (datos complementarios): ≈ ${horas(puntosResto)} más.`,
  `- **Prioridad 2 por campo:** ${['Nombre', 'Descripción del grupo', 'Descripción', 'Localización', 'Reparo', 'Recibe', 'Drena en', 'En este modelo', 'Puntos clave'].map((k) => `${k} ${minutos(campoResto(k))}`).join(' · ')}.`,
  '',
  'El orden de las secciones es el anatómico; la guía explica qué revisar primero si el tiempo no da para todo. Las frases repetidas remiten siempre a una fila de una región de igual o mayor prioridad.',
  '',
  ...REGIONES.flatMap((R) => [secciones[R.id], '']),
  '## Decisiones pendientes',
  '',
  '| Código | Pregunta para quien revisa | Respuesta |',
  '| --- | --- | --- |',
  '| L-D1 | La app dice «nodo (ganglio) linfático», como la Terminologia Anatomica 2 (*nodus lymphoideus*). ¿Le parece adecuado para estudiantes de habla hispana o prefiere «ganglio»? |  |',
  '| L-D2 | ¿El nivel y la cantidad de detalle de las fichas son adecuados para estudiantes de grado? |  |',
  '| L-D3 | La vía central representa la variante clásica (un conducto torácico, troncos izquierdos al conducto, conducto linfático derecho formado por los tres troncos derechos). ¿Es la variante adecuada para enseñar? |  |',
  '| L-D4 | ¿Falta algún grupo o dato esencial, o sobra algo? (Los grupos sin pieza en el modelo están marcados [NO REPRESENTADO].) |  |',
  '| L-D5 | ¿Alguna simplificación declarada del modelo enseña algo falso o puede confundir a un estudiante? |  |',
  '',
  '## Firma de la revisión',
  '',
  '- **Revisor:** (nombre)',
  '- **Formación y cargo:** (por ejemplo, docente de anatomía en …)',
  '- **Fecha:** (fecha)',
  '- **Alcance:** (qué regiones o qué códigos se revisaron)',
  '- **Conclusión:** (apto / apto con las correcciones anotadas / no apto)',
  '',
  'Revisar una región no valida el resto ni las traducciones. Solo lo revisado y firmado se acreditará como revisado.',
  '',
].join('\n');

/** Ancla de un encabezado de Markdown (como la genera GitHub/Obsidian: minúsculas, sin signos, espacios → guiones). */
function ancla(s) {
  return s.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s/g, '-');
}

const problemas = [
  ...faltan.map((k) => `ficha sin región en la hoja: ${k}`),
  ...gruposFaltan.map((g) => `grupo sin región en la hoja: ${g}`),
  ...Object.entries(cobertura).flatMap(([m, c]) => c.sin.map((x) => `pieza del modelo ${m} sin ficha propia: ${x}`)),
];
fs.mkdirSync(path.dirname(SALIDA), { recursive: true });
fs.writeFileSync(SALIDA, doc);
const capturasFaltan = [...new Set(REGIONES.flatMap((R) => R.capturas))].filter((x) => !fs.existsSync(path.join(RAIZ, '../build/linfatico/capturas', x)));
console.log(`${path.relative(process.cwd(), SALIDA)}: ${totales.fichas} fichas y ${Object.keys(GRUPOS_LINF).length} grupos, ${totales.afirmaciones} afirmaciones (${totales.repetidas} repetidas, ${totales.esquema} esquemático o variante, ${totales.pendientes} pendientes), ≈ ${horas(totales.segundos)}`);
for (const { R, c, min } of filasResumen) console.log(`  ${R.id.padEnd(3)} ${R.nombre.padEnd(26)} ${String(c.fichas).padStart(3)} fichas ${String(c.afirmaciones).padStart(4)} afirmaciones ≈ ${min} min`);
console.log(`  piezas con ficha propia: hombre ${cobertura.male.conFicha}/${cobertura.male.total}, mujer ${cobertura.female.conFicha}/${cobertura.female.total}`);
if (capturasFaltan.length) console.log(`  aviso: capturas que no están en build/linfatico/capturas/: ${capturasFaltan.join(', ')}`);
for (const p of problemas) console.log(`  error: ${p}`);
if (problemas.length) process.exit(1);
