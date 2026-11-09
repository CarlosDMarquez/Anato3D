// Los módulos de estudio anteriores (content/brazo.js y content/antebrazo.js) como lecciones de la biblioteca. Su
// contenido no se copia ni se reescribe: se lee de los módulos (que también usan las fichas de la app y la traducción del
// contenido) y aquí solo se añade lo que la biblioteca necesita para catalogarlos: lugar, sistemas, temas, nivel,
// duración, el objetivo y el paso de cada pregunta, la cámara de cada paso y las lecciones relacionadas.
// Conservan su identificador («brazo», «antebrazo»): el progreso guardado con la versión anterior sigue siendo suyo.
import { leccion } from './formato.js';

const EXTRA = {
  brazo: {
    resumen: 'El húmero y los músculos de los compartimentos anterior (bíceps, coracobraquial, braquial) y posterior (tríceps) del brazo, con sus nervios y vasos.',
    lugares: [['miembro-superior', 'brazo']],
    sistemas: ['muscular', 'oseo', 'nervioso', 'cardiovascular'],
    formato: 'estructuras', temas: ['musculos', 'compartimentos', 'nervios', 'arterias-venas'], nivel: 1, minutos: 18,
    requisitos: ['ms-hombro-musculos'], siguiente: ['antebrazo'],
    // Pregunta → [objetivo, paso al que volver].
    preguntas: {
      'inervacion-anterior': [2, 'nervios'], 'inervacion-triceps': [1, 'posterior'], 'insercion-biceps': [1, 'anterior'],
      'insercion-braquial': [1, 'anterior'], 'suelo-fosa-cubital': [1, 'anterior'], 'cabeza-larga-triceps': [1, 'posterior'],
      'surco-radial': [3, 'nervios'], 'ulnar-codo': [3, 'nervios'], 'mediano-arteria': [2, 'vasos'],
      'origen-arteria-braquial': [2, 'vasos'], 'musculocutaneo-coracobraquial': [2, 'nervios'], 'irrigacion-posterior': [2, 'vasos'],
    },
    camaras: { orientacion: 'anterolateral', sintesis: 'anterior', humero: 'anterior', anterior: 'anterior', posterior: 'posterior', nervios: 'anterior', vasos: 'anterior' },
  },
  antebrazo: {
    resumen: 'El radio, la ulna y los ocho músculos del compartimento anterior del antebrazo en sus tres capas, con su inervación y las arterias radial y ulnar.',
    lugares: [['miembro-superior', 'antebrazo']],
    sistemas: ['muscular', 'oseo', 'nervioso', 'cardiovascular'],
    formato: 'estructuras', temas: ['musculos', 'compartimentos', 'nervios', 'arterias-venas'], nivel: 2, minutos: 20,
    requisitos: ['brazo'], siguiente: [],
    preguntas: {
      'origen-comun': [2, 'superficial'], 'inervacion-fuc': [3, 'superficial'], 'inervacion-fpd': [3, 'profunda'],
      'interfalangicas-distales': [2, 'profunda'], 'insercion-fsd': [2, 'intermedia'], 'insercion-frc': [2, 'superficial'],
      pronadores: [2, 'superficial'], 'palmar-largo-ausente': [2, 'superficial'], 'inervacion-flp': [3, 'profunda'],
      'pulso-radial': [4, 'arterias'], 'ulna-codo': [0, 'huesos'], capas: [1, 'intermedia'],
    },
    camaras: { orientacion: 'anterior', sintesis: 'anterior', huesos: 'anterior', superficial: 'anterior', intermedia: 'anterior', profunda: 'anterior', arterias: 'anterior' },
  },
};

const TIPO = { musculo: 'musculo', nervio: 'nervio', arteria: 'arteria', vena: 'vena', hueso: 'hueso', ligamento: 'ligamento', organo: 'organo' };

/** Un módulo antiguo como lección de la biblioteca (o null si no tiene datos de catálogo). */
export function deModulo(mod) {
  const x = EXTRA[mod.id];
  if (!x) return null;
  const nucleo = new Set(mod.nucleo);
  const estructuras = Object.fromEntries(mod.estructuras.map((f) => [f.id, {
    nombre: f.nombre, piezas: f.piezas, lado: f.lado, tipo: TIPO[f.tipo] ?? 'organo', modelos: f.modelos,
    papel: nucleo.has(f.id) ? 'nucleo' : 'contexto', confusiones: mod.distractoresExtra?.[f.id] ?? [],
  }]));
  const pasos = mod.leccion.map((s, i) => ({
    id: s.id,
    tipo: s.tipo ?? 'explicacion',
    titulo: s.titulo,
    texto: [[s.texto, ...s.fuentes.map((m) => ({ m }))]],
    vista: s.fichas.length ? { ver: s.fichas, contexto: [], esqueleto: true, camara: x.camaras[s.id] ?? 'anterior', lado: 'R' } : null,
  }));
  const preguntas = [
    ...mod.nucleo.map((id) => ({ id: `identificar:${id}`, tipo: 'identificar', estructura: id, objetivo: 0, paso: pasos.find((p) => p.vista?.ver.includes(id))?.id ?? pasos[0].id })),
    ...mod.preguntas.map((p) => ({
      id: p.id, tipo: p.tipo ?? 'relacion', objetivo: x.preguntas[p.id]?.[0] ?? 1, paso: x.preguntas[p.id]?.[1] ?? pasos[0].id,
      estructuras: p.fichas, enunciado: p.enunciado, correcta: p.correcta, distractores: p.distractores, orden: p.orden,
      explicacion: p.explicacion, evidencia: [{ m: p.fuente }],
    })),
  ];
  return leccion({
    id: mod.id, version: mod.version, titulo: mod.titulo, ...x, preguntas, pasos, estructuras,
    objetivos: mod.objetivos, publico: mod.publico, revision: mod.revision,
    idiomas: ['es', 'en', 'de', 'fr', 'it'],                       // traducidos (con IA, sin revisar: i18n/contenido.js)
    modulo: true,                                                   // fichas propias en content/ y textos traducidos con tr()
  });
}
