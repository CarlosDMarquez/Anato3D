// Recorridos y módulos de la biblioteca de estudio (jerarquía: recorrido → módulo → lección → actividad).
// Un módulo agrupa lecciones de un mismo tema; un recorrido ordena módulos para un objetivo. Las lecciones se citan por
// su identificador: una lección que está en varios módulos o recorridos es la misma (un contenido, un progreso).
// Los recorridos pueden citar lecciones que aún no existen (están en el plan, scripts/biblioteca/plan.mjs): la app solo
// muestra las disponibles y dice cuántas faltan; el mapa de cobertura (docs/estudio/cobertura.md) las cuenta aparte.
//
// `alcance`: lo que promete el recorrido, en piezas del modelo, para comprobarlo (scripts/biblioteca.mjs):
//   { tipos: ['hueso'] } → todas las estructuras de ese tipo de los modelos tienen que estar en alguna de sus lecciones.
// Un recorrido que promete «todos» y no los cubre se marca como parcial con la cifra real.

export const MODULOS_BIBLIOTECA = [
  { id: 'fundamentos', titulo: 'Fundamentos', lecciones: ['fund-orientacion', 'fund-movimientos'] },
  {
    id: 'sistemas-panorama', titulo: 'Los sistemas del cuerpo',
    lecciones: ['sis-oseo', 'sis-articular', 'sis-muscular', 'sis-nervioso', 'sis-cardiovascular', 'sis-linfatico', 'sis-respiratorio',
      'sis-digestivo', 'sis-urinario', 'sis-reproductor-masculino', 'sis-reproductor-femenino', 'sis-endocrino', 'sis-tegumentario', 'sis-sentidos'],
  },
  { id: 'huesos-cabeza-cuello', titulo: 'Huesos de la cabeza y el cuello', lecciones: ['cab-craneo', 'cab-cara-huesos', 'cab-oido', 'cue-musculos'] },
  { id: 'huesos-tronco', titulo: 'Huesos del tronco', lecciones: ['esp-columna', 'tor-caja', 'pel-pelvis-osea'] },
  { id: 'huesos-miembro-superior', titulo: 'Huesos del miembro superior', lecciones: ['ms-cintura-escapular', 'brazo', 'antebrazo', 'ms-mano-huesos'] },
  { id: 'huesos-miembro-inferior', titulo: 'Huesos del miembro inferior', lecciones: ['pel-pelvis-osea', 'mi-huesos', 'mi-pie-huesos-tobillo'] },
  { id: 'accidentes-oseos', titulo: 'Accidentes óseos', lecciones: ['ms-cintura-escapular', 'brazo', 'antebrazo', 'pel-pelvis-osea', 'mi-huesos', 'esp-columna', 'cab-craneo'] },
  { id: 'musculos-cabeza-cuello', titulo: 'Músculos de la cabeza y el cuello', lecciones: ['cab-musculos-cara', 'cab-masticacion', 'cab-ojo', 'cue-musculos'] },
  { id: 'musculos-tronco', titulo: 'Músculos del tronco', lecciones: ['esp-musculos', 'tor-respiracion', 'abd-pared', 'pel-suelo'] },
  { id: 'musculos-miembro-superior', titulo: 'Músculos del miembro superior', lecciones: ['ms-hombro-musculos', 'brazo', 'antebrazo', 'ms-antebrazo-posterior', 'ms-mano-musculos'] },
  {
    id: 'musculos-miembro-inferior', titulo: 'Músculos del miembro inferior',
    lecciones: ['mi-glutea', 'mi-muslo-anterior-medial', 'mi-muslo-posterior', 'mi-pierna-anterior-lateral', 'mi-pierna-posterior', 'mi-pie-musculos'],
  },
  { id: 'movimientos', titulo: 'Movimientos y músculos que los producen', lecciones: ['fund-movimientos', 'sis-muscular', 'ms-hombro-musculos', 'brazo', 'mi-glutea', 'mi-muslo-anterior-medial', 'mi-pierna-posterior'] },
  { id: 'articulaciones-principales', titulo: 'Articulaciones principales', lecciones: ['sis-articular', 'cab-masticacion', 'ms-hombro-articulacion', 'ms-codo', 'mi-cadera', 'mi-rodilla', 'mi-pie-huesos-tobillo'] },
  { id: 'vasos', titulo: 'Corazón, arterias y venas', lecciones: ['sis-cardiovascular', 'tor-corazon', 'cue-vasos', 'cab-arterias-encefalo', 'abd-vasos', 'ms-vasos', 'mi-vasos'] },
  { id: 'nervios', titulo: 'Nervios y sus territorios', lecciones: ['sis-nervioso', 'cab-nervios-craneales', 'esp-medula', 'ms-nervios', 'mi-nervios'] },
  {
    id: 'organos', titulo: 'Órganos y sus relaciones',
    lecciones: ['cab-nariz', 'cue-visceras', 'tor-corazon', 'tor-pulmones', 'tor-mediastino', 'abd-tubo-digestivo', 'abd-higado-pancreas', 'abd-rinones', 'sis-reproductor-masculino', 'sis-reproductor-femenino'],
  },
  {
    id: 'compartimentos', titulo: 'Compartimentos de los miembros',
    lecciones: ['brazo', 'antebrazo', 'ms-antebrazo-posterior', 'mi-muslo-anterior-medial', 'mi-muslo-posterior', 'mi-pierna-anterior-lateral', 'mi-pierna-posterior'],
  },
  { id: 'confusiones', titulo: 'Estructuras que se confunden', lecciones: ['comp-miembro-superior', 'comp-miembro-inferior'] },
];

export const RECORRIDOS = [
  {
    id: 'primeros-pasos', titulo: 'Primeros pasos: el cuerpo por sistemas', tema: null, nivel: 1,
    descripcion: 'Cómo se describe el cuerpo (posición, planos, movimientos) y una visión general de cada sistema, con sus piezas en el modelo.',
    requisitos: 'Ninguno.', modulos: ['fundamentos', 'sistemas-panorama'],
  },
  {
    id: 'todos-los-huesos', titulo: 'Todos los huesos del cuerpo', tema: 'huesos', nivel: 1,
    descripcion: 'Cada hueso del modelo, región por región: cráneo y cara, columna, tórax, pelvis y los dos miembros.',
    requisitos: 'Orientación en el cuerpo (posición anatómica y planos).', modulos: ['huesos-cabeza-cuello', 'huesos-tronco', 'huesos-miembro-superior', 'huesos-miembro-inferior'],
    alcance: { tipos: ['hueso'] },
  },
  {
    id: 'accidentes-oseos', titulo: 'Accidentes óseos', tema: 'accidentes-oseos', nivel: 2,
    descripcion: 'Relieves, fosas y surcos de los huesos principales y qué se inserta o pasa por ellos.',
    requisitos: 'Haber visto los huesos de la región.', modulos: ['accidentes-oseos'],
  },
  {
    id: 'musculos-por-region', titulo: 'Músculos por región', tema: 'musculos', nivel: 1,
    descripcion: 'Los músculos de cada región con su origen, inserción, acción e inervación.',
    requisitos: 'Huesos de la región y términos de movimiento.', modulos: ['musculos-cabeza-cuello', 'musculos-tronco', 'musculos-miembro-superior', 'musculos-miembro-inferior'],
  },
  {
    id: 'movimientos', titulo: 'Movimientos', tema: 'movimientos', nivel: 1,
    descripcion: 'Los términos de movimiento y qué músculos producen los movimientos principales del hombro, el codo, la cadera y el tobillo.',
    requisitos: 'Ninguno.', modulos: ['movimientos'],
  },
  {
    id: 'articulaciones', titulo: 'Articulaciones', tema: 'articulaciones', nivel: 2,
    descripcion: 'Tipos de articulación y las articulaciones principales: temporomandibular, hombro, codo, cadera, rodilla y tobillo.',
    requisitos: 'Huesos de cada articulación.', modulos: ['articulaciones-principales'],
  },
  {
    id: 'arterias-venas', titulo: 'Arterias y venas', tema: 'arterias-venas', nivel: 2,
    descripcion: 'El corazón y el recorrido de las arterias y las venas principales de la cabeza, el cuello, el tronco y los miembros.',
    requisitos: 'Visión general del sistema cardiovascular.', modulos: ['vasos'],
  },
  {
    id: 'nervios-territorios', titulo: 'Nervios y territorios', tema: 'nervios', nivel: 2,
    descripcion: 'Organización del sistema nervioso, nervios craneales, médula espinal y los nervios de los miembros con lo que inervan.',
    requisitos: 'Visión general del sistema nervioso.', modulos: ['nervios'],
  },
  {
    id: 'organos-relaciones', titulo: 'Órganos y relaciones', tema: 'organos', nivel: 2,
    descripcion: 'Los órganos del cuello, el tórax, el abdomen y la pelvis: dónde están y con qué se relacionan.',
    requisitos: 'Visión general de los sistemas.', modulos: ['organos'],
  },
  {
    id: 'compartimentos', titulo: 'Compartimentos de los miembros', tema: 'compartimentos', nivel: 2,
    descripcion: 'Cada compartimento del brazo, el antebrazo, el muslo y la pierna con sus músculos, su nervio y su función común.',
    requisitos: 'Huesos de los miembros.', modulos: ['compartimentos'],
  },
  {
    id: 'confusiones', titulo: 'Estructuras que se confunden', tema: 'confusiones', nivel: 2,
    descripcion: 'Parejas que se confunden a menudo, cara a cara en el modelo, con lo que las distingue.',
    requisitos: 'Haber estudiado las estructuras de la región.', modulos: ['confusiones'],
  },
];

export const MODULO_BIB_POR_ID = new Map(MODULOS_BIBLIOTECA.map((m) => [m.id, m]));
export const RECORRIDO_POR_ID = new Map(RECORRIDOS.map((r) => [r.id, r]));

/** Lecciones de un recorrido, en orden y sin repetir (una lección en dos de sus módulos cuenta una vez). */
export function leccionesDeRecorrido(r) {
  return [...new Set(r.modulos.flatMap((m) => MODULO_BIB_POR_ID.get(m)?.lecciones ?? []))];
}

/** Errores de los recorridos: módulos inexistentes o repetidos. Las lecciones se comprueban contra el plan. */
export function revisarRecorridos(idsPlan) {
  const out = [];
  for (const r of RECORRIDOS) for (const m of r.modulos) if (!MODULO_BIB_POR_ID.has(m)) out.push(`${r.id}: módulo inexistente ${m}`);
  for (const m of MODULOS_BIBLIOTECA) for (const l of m.lecciones) if (!idsPlan.has(l)) out.push(`${m.id}: lección que no está en el plan ${l}`);
  const ids = [...RECORRIDOS.map((r) => r.id)];
  if (new Set(ids).size !== ids.length) out.push('recorridos repetidos');
  return out;
}
