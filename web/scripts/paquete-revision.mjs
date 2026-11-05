// Paquete de revisión de un módulo para un especialista, generado del propio contenido de la app (src/content), para
// que lo que se revisa sea exactamente lo que la app muestra. Uso (desde web/):
//   node scripts/paquete-revision.mjs [brazo] [--json]
// Sin --json: Markdown en docs/revision/<módulo>-<versión>.md (con «Sin revisar» en cada veredicto).
// Con --json: las secciones (título, Markdown con una marca {{V}} por celda de veredicto) para escribir el documento.
// Cada fila lleva un código estable (F02.3 = ficha 2, fila 3; L = lección; P = preguntas; I = identificación; V =
// inspección en 3D; D = decisiones), para que el revisor y quien aplique las correcciones hablen de lo mismo.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MODULOS } from '../src/content/index.js';
import { FUENTES } from '../src/content/fuentes.js';
import { CAMPOS } from '../src/content/schema.js';

const args = process.argv.slice(2);
const mod = MODULOS.find((m) => m.id === (args.find((a) => !a.startsWith('--')) ?? 'brazo'));
const V = '{{V}}';                                     // celda de veredicto (desplegable en el documento)
const cell = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n+/g, ' ');
const fuente = (k) => {
  const f = FUENTES[k];
  if (!f) return cell(k);
  const corto = f.texto.replace(/^TeachMeAnatomy: «(.*?)».*$/, 'TMA: $1').replace(/^Terminologia Anatomica, 2\.ª ed\..*$/, 'TA2');
  return f.url ? `[${cell(corto)}](${f.url})` : cell(corto);
};
const tabla = (cab, filas) => [`| ${cab.join(' | ')} |`, `| ${cab.map(() => '---').join(' | ')} |`, ...filas.map((f) => `| ${f.map(cell).join(' | ')} |`)].join('\n');
const fichas = mod.estructuras;
const num = (id) => String(fichas.findIndex((f) => f.id === id) + 1).padStart(2, '0');
const nombre = (id) => fichas.find((f) => f.id === id)?.nombre ?? id;

function tablaFicha(f) {
  const n = num(f.id);
  const filas = [];
  const fila = (campo, texto, src) => filas.push([`F${n}.${filas.length + 1}`, campo, texto, src, V, '']);
  const cont = (k) => f.fuentes.contenido.filter((c) => c.apoya.includes(k)).map((c) => fuente(c.fuente)).join('; ');
  const terminos = f.fuentes.terminologia.map((t) => t.termino).join(', ');
  fila('Nombre y latín', `${f.nombre} · ${f.latin} · TA2 n.º ${terminos}`, fuente('ta2'));
  if (f.sinonimos?.length) fila('Sinónimos', f.sinonimos.join('; '), f.sinonimosFuente ? fuente(f.sinonimosFuente) : 'Sin fuente comprobada');
  fila('Descripción', f.descripcion, cont('descripcion'));
  if (f.funcion) fila('Función', f.funcion, cont('funcion'));
  for (const [k, v] of Object.entries(f.campos)) fila(CAMPOS[f.tipo][k], v, cont(k));
  for (const r of f.relaciones) fila(`Relación${r.con ? ` → ${nombre(r.con)}` : ''}`, r.texto, fuente(r.fuente));
  for (const s of f.simplificaciones) fila('Simplificación del modelo', s, 'Proyecto Anato3D');
  return `### ${f.nombre}\n\n${tabla(['Código', 'Campo', 'Texto en la app', 'Fuente', 'Veredicto', 'Comentario'], filas)}`;
}

const grupo = (titulo, ids, intro) => ({ titulo, md: `## ${titulo}\n\n${intro}\n\n${ids.map((id) => tablaFicha(fichas.find((f) => f.id === id))).join('\n\n')}` });
const GRUPO = { musculo: 'Músculos', nervio: 'Nervios', arteria: 'Vasos', vena: 'Vasos', hueso: 'Huesos' };

const secciones = [
  {
    titulo: 'Cómo revisar',
    md: `## Cómo revisar

Cada fila tiene un **código**, el **texto exacto que muestra la app**, la **fuente** que lo respalda, un **veredicto** y un **comentario**.

1. Lea el texto y compárelo con su fuente o con su propio conocimiento.
2. Elija el veredicto: **Correcto**, **Corregir** (escriba la corrección en «Comentario») o **Dudoso** (explique la duda).
3. Si falta algo importante para el nivel del público, añádalo en «Comentario» de la fila más cercana o comente sobre el texto.

- **Público supuesto:** ${mod.publico}.
- **Alcance:** ${fichas.length} fichas (${mod.nucleo.length} evaluables), ${mod.leccion.length} pasos de lección, ${mod.preguntas.length} preguntas de texto y ${mod.nucleo.length} preguntas de identificación en 3D.
- **Origen del texto:** lo redactó una IA (Claude) el 2026-11-02 resumiendo las fuentes citadas, que se leyeron ese día. Nadie lo ha revisado todavía.
- **Lo que no se incluyó a propósito:** correlaciones clínicas (signo de Popeye, mano caída, fracturas…). Si alguna debe estar, indíquelo en «Decisiones pendientes».
- **Cuando termine:** complete «Firma de la revisión». Solo entonces las fichas aprobadas podrán mostrarse en la app como «Revisado por un especialista».`,
  },
  {
    titulo: 'Objetivos y público',
    md: `## Objetivos y público

Lo que el estudiante debería saber al terminar el módulo (borrador).

${tabla(['Código', 'Objetivo', 'Veredicto', 'Comentario'], mod.objetivos.map((o, i) => [`O${i + 1}`, o, V, '']))}`,
  },
  grupo('Húmero', fichas.filter((f) => f.tipo === 'hueso').map((f) => f.id), 'El único hueso del módulo.'),
  grupo('Compartimento anterior', fichas.filter((f) => f.compartimento === 'anterior').map((f) => f.id), 'Bíceps braquial, coracobraquial y braquial.'),
  grupo('Compartimento posterior y codo', fichas.filter((f) => f.tipo === 'musculo' && f.compartimento !== 'anterior').map((f) => f.id), 'Tríceps braquial y, como contexto, el ancóneo (ver la decisión D1).'),
  grupo('Nervios', fichas.filter((f) => f.tipo === 'nervio').map((f) => f.id), 'Los cuatro nervios que recorren el brazo.'),
  grupo('Vasos', fichas.filter((f) => f.tipo === 'arteria' || f.tipo === 'vena').map((f) => f.id), 'La arteria braquial (evaluable) y, como contexto, la braquial profunda y las venas.'),
  {
    titulo: 'Lección guiada',
    md: `## Lección guiada

Cinco pasos. En cada uno la app aísla y resalta las estructuras indicadas, de un lado, con el esqueleto de contexto, y muestra este texto.

${tabla(['Código', 'Paso', 'Texto en la app', 'Estructuras', 'Fuente', 'Veredicto', 'Comentario'],
    mod.leccion.map((s, i) => [`L${i + 1}`, s.titulo, s.texto, s.fichas.map(nombre).join('; '), s.fuentes.map(fuente).join('; '), V, '']))}`,
  },
  {
    titulo: 'Preguntas de texto',
    md: `## Preguntas de texto

En cada evaluación salen 4 de estas 12, con las opciones barajadas y «No lo sé». Compruebe sobre todo que **ningún distractor sea también correcto**.

${tabla(['Código', 'Pregunta', 'Respuesta correcta', 'Distractores', 'Explicación tras responder', 'Fuente', 'Veredicto', 'Comentario'],
    mod.preguntas.map((p, i) => [`P${String(i + 1).padStart(2, '0')}`, p.enunciado, p.correcta, p.distractores.join(' · '), p.explicacion, fuente(p.fuente), V, '']))}`,
  },
  {
    titulo: 'Identificación en 3D',
    md: `## Identificación en 3D

La estructura se resalta sola, con el esqueleto, sin su nombre. El estudiante elige entre su nombre y 3 de los «posibles distractores» (al azar). Diga si el distractor es razonable para el nivel y si la estructura se reconoce aislada.

${tabla(['Código', 'Estructura resaltada', 'Posibles distractores', 'Veredicto', 'Comentario'],
    mod.nucleo.map((id, i) => {
      const f = fichas.find((g) => g.id === id);
      const mismos = fichas.filter((g) => g.id !== id && GRUPO[g.tipo] === GRUPO[f.tipo]).map((g) => g.nombre);
      return [`I${String(i + 1).padStart(2, '0')}`, f.nombre, [...mismos, ...(mod.distractoresExtra?.[id] ?? [])].join(' · '), V, ''];
    }))}`,
  },
  {
    titulo: 'Inspección en el modelo 3D',
    md: `## Inspección en el modelo 3D

Que las piezas encajen dentro de la piel no demuestra que la anatomía sea correcta: hay que mirarlas de cerca. Cada punto, en los dos modelos.

${tabla(['Código', 'Qué mirar', 'Dónde verlo en la app', 'Hombre', 'Mujer', 'Comentario'], [
    ['V1', 'Inserción del bíceps en la tuberosidad del radio', 'Estudiar → Lección, paso 2', V, V, ''],
    ['V2', 'Inserción del braquial en la tuberosidad de la ulna', 'Estudiar → Lección, paso 2', V, V, ''],
    ['V3', 'Coracobraquial: del proceso coracoides a la cara medial del húmero', 'Estudiar → Lección, paso 2', V, V, ''],
    ['V4', 'Tres cabezas del tríceps y su inserción en el olécranon', 'Estudiar → Lección, paso 3', V, V, ''],
    ['V5', 'Nervio radial en el surco del nervio radial, con la arteria braquial profunda', 'Lección, pasos 4 y 5', V, V, ''],
    ['V6', 'Nervio ulnar por detrás del epicóndilo medial', 'Lección, paso 4', V, V, ''],
    ['V7', 'Nervio mediano cruzando la arteria braquial a mitad del brazo', 'Lección, pasos 4 y 5', V, V, ''],
    ['V8', 'Nervio musculocutáneo atravesando el coracobraquial', 'Lección, paso 4', V, V, ''],
    ['V9', 'Venas cefálica (surco deltopectoral) y basílica (cara medial)', 'Lección, paso 5', V, V, ''],
  ])}

Los nervios y vasos del modelo femenino proceden del modelo masculino de Z-Anatomy ajustado al cuerpo femenino. **Pregunta abierta:** la app aún no está publicada; la inspección necesita una sesión en el ordenador del proyecto o una publicación limitada.`,
  },
  {
    titulo: 'Decisiones pendientes',
    md: `## Decisiones pendientes

${tabla(['Código', 'Decisión', 'Propuesta actual', 'Veredicto', 'Comentario'], [
    ['D1', '¿El ancóneo entra en el módulo del brazo o en el del antebrazo?', 'Contexto del tríceps; no se evalúa. TeachMeAnatomy lo pone en el compartimento posterior del antebrazo.', V, ''],
    ...fichas.filter((f) => f.sinonimos?.length).map((f, i) => [`D${i + 2}`, `Sinónimos de «${f.nombre}»`, `${f.sinonimos.join('; ')} (sin fuente comprobada; la app todavía no los usa: servirían para el buscador)`, V, '']),
    [`D${2 + fichas.filter((f) => f.sinonimos?.length).length}`, '¿Incluir alguna correlación clínica?', 'Ninguna por ahora.', V, ''],
    [`D${3 + fichas.filter((f) => f.sinonimos?.length).length}`, '¿Identificar la estructura aislada o con sus vecinas?', 'Aislada con el esqueleto (más fácil que en un atlas).', V, ''],
  ])}`,
  },
  {
    titulo: 'Firma de la revisión',
    md: `## Firma de la revisión

- **Revisor:** (nombre)
- **Formación y cargo:** (por ejemplo, docente de anatomía en …)
- **Fecha:** (fecha)
- **Alcance:** (todo el documento, o qué secciones)
- **Conclusión:** (apto para un piloto con estudiantes / apto con las correcciones anotadas / no apto)

Solo las fichas aprobadas aquí pasarán al estado «Revisado por un especialista», con su nombre y la fecha guardados en cada ficha.`,
  },
  {
    titulo: 'Fuentes',
    md: `## Fuentes

Páginas leídas el 2026-11-02 para redactar el contenido; la terminología, de la TA2.

${tabla(['Fuente', 'Autor y organización', 'Actualizada', 'Consultada'],
    Object.entries(FUENTES).filter(([, f]) => f.tipo !== 'modelo').map(([k, f]) => [fuente(k), f.texto.match(/\((.*)\)\s*$/)?.[1] ?? 'FIPAT', f.actualizada ?? '—', f.consultada]))}

No se usó OpenStax *Anatomy and Physiology 2e*: prohíbe usarlo con IA generativa sin permiso y no permite el uso comercial.`,
  },
];

const meta = { modulo: mod.id, version: mod.version, titulo: mod.titulo, codigos: secciones.reduce((n, s) => n + (s.md.match(/\{\{V\}\}/g) ?? []).length, 0) };
if (args.includes('--json')) {
  console.log(JSON.stringify({ meta, secciones }, null, 1));
} else {
  const md = `# Revisión del módulo «${mod.titulo}» (versión ${mod.version})\n\n${secciones.map((s) => s.md.replaceAll(V, 'Sin revisar')).join('\n\n')}\n`;
  const out = path.join(path.dirname(fileURLToPath(import.meta.url)), `../../docs/revision/${mod.id}-${mod.version}.md`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, md);
  console.log(`${out}: ${secciones.length} secciones, ${meta.codigos} veredictos`);
}
