// Hoja de revisión de una lección de la biblioteca (o de una lección creada por Neuri) para un docente de anatomía,
// generada de la propia lección, para que lo que se revisa sea exactamente lo que la app muestra. Es el equivalente de
// scripts/paquete-revision.mjs (módulos brazo y antebrazo) para el formato de la biblioteca (src/biblioteca/formato.js).
//
// Uso (desde web/):
//   node scripts/biblioteca/hoja-revision.mjs <id> [<id>…]              lecciones de src/biblioteca/lecciones/
//   node scripts/biblioteca/hoja-revision.mjs --archivo <ruta.json>      lecciones de un archivo: «Exportar todas» de Mis
//                                                                        lecciones, una lección suelta o
//                                                                        build/neuri-prueba.json (npm run pet:prueba -- --crear)
//   Opciones: --salida <carpeta> (por defecto, docs/revision/lecciones)
//
// Escribe <carpeta>/<id>-v<versión>.md con «Sin revisar» en cada veredicto. Cada fila lleva un código estable (O =
// objetivo, E = estructura, P3.2 = paso 3, frase 2, P3.D1 = «Saber más», Q = pregunta, V = inspección en 3D, D =
// decisiones) para que quien revisa y quien corrige hablen de lo mismo. No marca nada como revisado: eso lo hace una
// persona, en la lección, con su nombre y la fecha (docs/estudio/revision-docente.md).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const opcion = (nombre) => { const i = args.indexOf(nombre); if (i < 0) return null; const v = args[i + 1]; args.splice(i, 2); return v ?? null; };
const archivo = opcion('--archivo');
const salida = path.resolve(RAIZ, opcion('--salida') ?? '../docs/revision/lecciones');
const FUENTES = JSON.parse(fs.readFileSync(path.join(RAIZ, 'src/biblioteca/generado/fuentes.json'), 'utf8'));

const NIVEL = { 1: 'básico', 2: 'intermedio', 3: 'avanzado' };
const TIPO_PREGUNTA = { identificar: 'Identificar en 3D', localizar: 'Localizar en 3D', relacion: 'Relación', funcion: 'Función', comparacion: 'Comparación', secuencia: 'Ordenar' };
const TILDES = { nucleo: 'núcleo', musculo: 'músculo', cartilago: 'cartílago', organo: 'órgano', capsula: 'cápsula', tendon: 'tendón', glandula: 'glándula', orientacion: 'orientación', explicacion: 'explicación', exploracion: 'exploración', funcion: 'función', sintesis: 'síntesis' };
const conTilde = (x) => TILDES[x] ?? x;
const celda = (s) => String(s ?? '').replace(/\s+/g, ' ').replace(/\|/g, '\\|').trim();
const fila = (...c) => `| ${c.map(celda).join(' | ')} |`;
const SIN = 'Sin revisar';

/** Las lecciones a revisar: por id (archivos de la biblioteca) o de un archivo JSON. */
async function lecciones() {
  if (archivo) {
    const d = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), archivo), 'utf8'));
    const lista = Array.isArray(d) ? d : Array.isArray(d?.lecciones) ? d.lecciones : d?.leccion ? [d.leccion] : d?.pasos ? [d] : [];
    if (!lista.length) throw new Error(`${archivo}: no hay lecciones (se esperaba «Exportar todas», una lección o build/neuri-prueba.json)`);
    return lista;
  }
  if (!args.length) throw new Error('Indica el identificador de una lección (p. ej. cab-nariz) o --archivo <ruta.json>.');
  const out = [];
  for (const id of args) {
    const ruta = path.join(RAIZ, 'src/biblioteca/lecciones', `${id}.js`);
    if (!fs.existsSync(ruta)) throw new Error(`No existe la lección «${id}» (src/biblioteca/lecciones/${id}.js).`);
    out.push((await import(ruta)).default);
  }
  return out;
}

/** Fuente de una cita: título y enlace (de fuentes.json o, en una lección de Neuri, de las páginas que consultó). */
function fuente(L, f) {
  const usadas = Array.isArray(L.fuentesUsadas) ? L.fuentesUsadas : Object.values(L.fuentesUsadas ?? {});
  const m = FUENTES[f] ?? usadas.find((u) => u?.id === f) ?? null;
  return { id: f, titulo: m?.titulo ? m.titulo.replace(/&amp;/g, '&') : f, url: m?.url ?? null, licencia: m?.licencia ?? '', fecha: m?.fecha ?? '' };
}
const enlace = (x) => (x.url ? `[${x.titulo}](${x.url})` : x.titulo);

/** Una frase de la lección: [texto, ...evidencias]; las evidencias son { f, c } o { guia: true }. */
function frase(L, f) {
  const [texto, ...ev] = Array.isArray(f) ? f : [f];
  if (ev.some((e) => e?.guia)) return { texto, cita: '(indicación de uso: no lleva cita)', fuentes: [] };
  const citas = ev.filter((e) => e?.f && e?.c);
  return { texto, cita: citas.map((e) => `«${e.c}» (${enlace(fuente(L, e.f))})`).join(' · ') || '(sin cita)', fuentes: citas.map((e) => e.f) };
}

function hoja(L) {
  const estructuras = Array.isArray(L.estructuras) ? L.estructuras : Object.entries(L.estructuras ?? {}).map(([id, e]) => ({ id, ...e }));
  const nombre = (id) => estructuras.find((e) => e.id === id)?.nombre ?? id;
  const usadas = new Set();
  const neuri = !!L.origen?.neuri;
  const preguntas = L.preguntas ?? [];
  const md = [];
  md.push(`# Revisión de la lección «${L.titulo}» (${L.id}, versión ${L.version})`, '');
  md.push('## Cómo revisar', '');
  md.push('Cada fila tiene un **código**, el **texto exacto que muestra la app**, la **cita** de la fuente que lo respalda, un **veredicto** y un **comentario**.', '');
  md.push('1. Lea el texto y compárelo con su cita, con la fuente enlazada o con su propio conocimiento.');
  md.push('2. Elija el veredicto: **Correcto**, **Corregir** (escriba la corrección en «Comentario») o **Dudoso** (explique la duda).');
  md.push('3. Si falta algo importante para el nivel indicado, anótelo en «Decisiones pendientes».', '');
  md.push('La app comprobó que cada cita está, palabra por palabra, en la versión registrada de su página. No comprobó que la frase en español sea una buena interpretación de la cita ni que sea adecuada para el nivel: eso es lo que se revisa.', '');
  md.push(`- **Nivel:** ${NIVEL[L.nivel] ?? L.nivel} · **duración estimada:** ${L.minutos} min.`);
  md.push(`- **Alcance:** ${L.objetivos?.length ?? 0} objetivos, ${estructuras.length} estructuras, ${L.pasos?.length ?? 0} pasos y ${preguntas.length} preguntas (${Object.entries(preguntas.reduce((a, q) => ({ ...a, [q.tipo]: (a[q.tipo] ?? 0) + 1 }), {})).map(([t, n]) => `${n} de ${(TIPO_PREGUNTA[t] ?? t).replace(/^./, (c) => c.toLowerCase())}`).join(', ')}).`);
  md.push(`- **Origen:** ${L.revision?.notas ?? 'sin notas'}`);
  md.push(`- **Estado en la app:** ${L.revision?.estado === 'revisado' ? `revisada por ${L.revision.revisor} (${L.revision.fecha})` : 'borrador, sin revisar por un especialista'}.${neuri ? ' Es una lección creada por Neuri: la app no permite marcarla como revisada; esta hoja sirve para evaluar la calidad de las generaciones.' : ''}`);
  md.push('- **Idioma del contenido:** ' + (L.idiomas ?? ['es']).join(', ') + '. Revisar el español no valida las traducciones.', '');

  md.push('## Objetivos', '', fila('Código', 'Objetivo (lo que el estudiante sabrá hacer)', 'Veredicto', 'Comentario'), '| --- | --- | --- | --- |');
  (L.objetivos ?? []).forEach((o, i) => md.push(fila(`O${i + 1}`, o, SIN, '')));
  md.push('');

  md.push('## Estructuras en el modelo 3D', '', '«Núcleo»: se enseña y se evalúa; «contexto»: se muestra para orientarse.', '');
  md.push(fila('Código', 'Nombre en la app', 'Tipo', 'Papel', 'Piezas del modelo', 'Veredicto', 'Comentario'), '| --- | --- | --- | --- | --- | --- | --- |');
  estructuras.forEach((e, i) => md.push(fila(`E${i + 1}`, e.nombre, conTilde(e.tipo), conTilde(e.papel), (e.piezas ?? []).join(', '), SIN, '')));
  md.push('');

  md.push('## Pasos de la lección', '');
  (L.pasos ?? []).forEach((p, i) => {
    md.push(`### P${i + 1}. ${p.titulo} (${conTilde(p.tipo)})`, '');
    const vista = p.vista ? [p.vista.ver?.length ? `resalta ${p.vista.ver.map(nombre).join(', ')}` : '', p.vista.contexto?.length ? `muestra ${p.vista.contexto.map(nombre).join(', ')}` : '', p.vista.camara ? `vista ${p.vista.camara}` : ''].filter(Boolean).join('; ') : '';
    if (vista) md.push(`En el modelo: ${vista}.`, '');
    md.push(fila('Código', 'Texto en la app', 'Cita que lo respalda', 'Veredicto', 'Comentario'), '| --- | --- | --- | --- | --- |');
    (p.texto ?? []).forEach((f, k) => { const x = frase(L, f); x.fuentes.forEach((id) => usadas.add(id)); md.push(fila(`P${i + 1}.${k + 1}`, x.texto, x.cita, SIN, '')); });
    (p.detalle ?? []).forEach((f, k) => { const x = frase(L, f); x.fuentes.forEach((id) => usadas.add(id)); md.push(fila(`P${i + 1}.D${k + 1}`, `(Saber más) ${x.texto}`, x.cita, SIN, '')); });
    if (p.actividad) md.push(fila(`P${i + 1}.A`, `(Actividad: ${p.actividad.tipo}) ${p.actividad.texto ?? ''}`, p.actividad.estructura ? `Respuesta: ${nombre(p.actividad.estructura)}` : '', SIN, ''));
    md.push('');
  });

  md.push('## Preguntas', '', 'Las de identificar y localizar las arma la app con el modelo: «¿Qué estructura está resaltada?» (con opciones del mismo tipo) o «Toca …». Las demás tienen su texto, su respuesta correcta y sus distractores.', '');
  md.push(fila('Código', 'Tipo', 'Objetivo', 'Pregunta', 'Respuesta correcta', 'Distractores u orden', 'Explicación y cita', 'Veredicto', 'Comentario'), '| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
  preguntas.forEach((q, i) => {
    const obj = Number.isInteger(q.objetivo) ? `O${q.objetivo + 1}` : '';
    const citas = (q.evidencia ?? []).filter((e) => e?.f && e?.c);
    citas.forEach((e) => usadas.add(e.f));
    const expl = [q.explicacion, ...citas.map((e) => `«${e.c}» (${enlace(fuente(L, e.f))})`)].filter(Boolean).join(' · ');
    if (q.tipo === 'identificar') md.push(fila(`Q${i + 1}`, TIPO_PREGUNTA[q.tipo], obj, '¿Qué estructura está resaltada en el modelo?', nombre(q.estructura), '(otras del mismo tipo)', expl, SIN, ''));
    else if (q.tipo === 'localizar') md.push(fila(`Q${i + 1}`, TIPO_PREGUNTA[q.tipo], obj, `Señalar en el modelo: ${nombre(q.estructura)}`, nombre(q.estructura), '—', expl, SIN, ''));
    else if (q.tipo === 'secuencia') md.push(fila(`Q${i + 1}`, TIPO_PREGUNTA[q.tipo], obj, q.enunciado, (q.orden ?? []).join(' → '), '(se muestran desordenadas)', expl, SIN, ''));
    else md.push(fila(`Q${i + 1}`, TIPO_PREGUNTA[q.tipo] ?? q.tipo, obj, q.enunciado, q.correcta, (q.distractores ?? []).join(' · '), expl, SIN, ''));
  });
  md.push('');

  md.push('## Inspección en el modelo 3D', '', 'Abra la lección en la app y compruebe, para cada estructura del núcleo, que la pieza resaltada es la que dice el nombre y que se distingue bien desde las vistas de los pasos.', '');
  md.push(fila('Código', 'Estructura', 'Qué comprobar', 'Veredicto', 'Comentario'), '| --- | --- | --- | --- | --- |');
  estructuras.filter((e) => e.papel === 'nucleo').forEach((e, i) => md.push(fila(`V${i + 1}`, e.nombre, `La pieza «${(e.piezas ?? []).join(', ')}» es la ${e.nombre.toLowerCase()} y se ve bien`, SIN, '')));
  md.push('');

  md.push('## Decisiones pendientes', '', fila('Código', 'Pregunta para quien revisa', 'Respuesta'), '| --- | --- | --- |');
  md.push(fila('D1', '¿El nivel y la duración son adecuados para el público previsto?', ''));
  md.push(fila('D2', '¿Falta algo esencial o sobra algo para estos objetivos?', ''));
  md.push(fila('D3', '¿Alguna pregunta puede tener más de una respuesta correcta o depender de la vista?', ''));
  md.push('');

  md.push('## Firma de la revisión', '');
  md.push('- **Revisor:** (nombre)', '- **Formación y cargo:** (por ejemplo, docente de anatomía en …)', '- **Fecha:** (fecha)', '- **Alcance:** (toda la hoja, o qué secciones)', '- **Conclusión:** (apta / apta con las correcciones anotadas / no apta)', '');
  md.push(neuri
    ? 'Una lección creada por Neuri sigue siendo un borrador aunque esta hoja la apruebe: la revisión se usa para medir y mejorar la calidad de las generaciones.'
    : 'Solo con esta firma y las correcciones aplicadas se podrá poner en la lección `revision: { estado: \'revisado\', revisor, fecha }` (src/biblioteca/formato.js lo exige). Revisar una sección no valida el resto ni las traducciones.', '');

  md.push('## Fuentes', '', fila('Fuente', 'Licencia', 'Versión leída el'), '| --- | --- | --- |');
  [...usadas].sort().forEach((id) => { const x = fuente(L, id); md.push(fila(enlace(x), x.licencia, x.fecha)); });
  md.push('');
  return md.join('\n');
}

try {
  const lista = await lecciones();
  fs.mkdirSync(salida, { recursive: true });
  for (const L of lista) {
    if (!L?.id || !Array.isArray(L.pasos)) { console.error('Se omite algo que no es una lección.'); continue; }
    const ruta = path.join(salida, `${L.id}-v${L.version}.md`);
    const texto = hoja(L);
    fs.writeFileSync(ruta, texto);
    console.log(`${path.relative(process.cwd(), ruta)}: ${(texto.match(/Sin revisar/g) ?? []).length} veredictos`);
  }
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
