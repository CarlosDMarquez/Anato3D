// Filtros y orden de la biblioteca (región/subregión, sistema, tipo de lección, tipo de estructura, objetivo, nivel,
// duración, idioma, procedencia, progreso, repaso pendiente y favoritas). Sin DOM: lo prueba `npm test`. Se combinan
// todos a la vez (y); cada uno admite un valor.
import { REGION_POR_ID, SUBREGION_POR_ID, SISTEMA_POR_ID, FORMATO_POR_ID, TEMA_POR_ID, NIVEL_POR_ID, DURACIONES } from './taxonomia.js';

export const CLAVES = ['region', 'subregion', 'sistema', 'formato', 'estructura', 'tema', 'nivel', 'duracion', 'idioma', 'procedencia', 'progreso', 'repaso', 'favoritas'];
/**
 * Tipos de estructura para filtrar (los del formato agrupados como los busca un estudiante). Una lección entra si alguna
 * estructura de su núcleo es de ese grupo (las de contexto no cuentan: no son lo que enseña).
 */
export const GRUPOS_ESTRUCTURA = [
  { id: 'huesos', tipos: ['hueso', 'diente', 'cartilago'] },
  { id: 'articulaciones', tipos: ['ligamento', 'capsula', 'bolsa'] },
  { id: 'musculos', tipos: ['musculo', 'tendon', 'vaina', 'fascia'] },
  { id: 'arterias', tipos: ['arteria'] },
  { id: 'venas', tipos: ['vena'] },
  { id: 'linfatico', tipos: ['nodo', 'linfatico'] },
  { id: 'nervios', tipos: ['nervio', 'ganglio', 'snc'] },
  { id: 'organos', tipos: ['organo', 'glandula', 'corazon', 'piel'] },
];
const GRUPO_POR_ID = new Map(GRUPOS_ESTRUCTURA.map((g) => [g.id, g]));
/** De dónde viene una lección: la biblioteca de Anato3D o «Mis lecciones» (creada o adaptada con Neuri, con IA). */
export const PROCEDENCIAS = ['biblioteca', 'propias'];
export const procedencia = (L) => (L.propia ? 'propias' : 'biblioteca');
/** ¿Tiene la lección estructuras del núcleo de ese grupo? */
export const tieneGrupo = (L, grupo) => (L.estructuras ?? []).some((e) => e.papel === 'nucleo' && GRUPO_POR_ID.get(grupo)?.tipos.includes(e.tipo));
/** Los valores que tiene sentido ofrecer para un filtro en estas lecciones (para no enseñar filtros vacíos). */
export function valoresPresentes(lecciones, clave) {
  if (clave === 'estructura') return GRUPOS_ESTRUCTURA.map((g) => g.id).filter((g) => lecciones.some((L) => tieneGrupo(L, g)));
  if (clave === 'idioma') return [...new Set(lecciones.flatMap((L) => L.idiomas ?? ['es']))];
  if (clave === 'procedencia') return PROCEDENCIAS.filter((p) => lecciones.some((L) => procedencia(L) === p));
  return [];
}
export const PROGRESOS = ['sin-empezar', 'en-curso', 'completada', 'demostrada', 'dominada'];
export const ORDENES = ['relevancia', 'recomendado', 'duracion', 'reciente'];

export const vacios = () => Object.fromEntries(CLAVES.map((k) => [k, null]));
export const hayFiltros = (f) => CLAVES.some((k) => f[k] != null && f[k] !== false);

const enDuracion = (min, id) => {
  const d = DURACIONES.find((x) => x.id === id);
  return !d || ((d.min == null || min >= d.min) && (d.max == null || min <= d.max));
};

/**
 * ¿Pasa la lección `L` (del catálogo) los filtros `f`? ctx: { estado(L) → { estado, pendientes }, favorita(id) }.
 * Una lección de toda una región (subregión null) entra al filtrar por cualquiera de sus subregiones.
 */
export function pasa(L, f, ctx) {
  if (f.region && !L.lugares.some(([r]) => r === f.region)) return false;
  if (f.subregion && !L.lugares.some(([r, s]) => s === f.subregion || (!s && r === SUBREGION_POR_ID.get(f.subregion)?.region))) return false;
  if (f.sistema && !L.sistemas.includes(f.sistema)) return false;
  if (f.formato && L.formato !== f.formato) return false;
  if (f.estructura && !tieneGrupo(L, f.estructura)) return false;
  if (f.idioma && !(L.idiomas ?? ['es']).includes(f.idioma)) return false;
  if (f.procedencia && procedencia(L) !== f.procedencia) return false;
  if (f.tema && !L.temas.includes(f.tema)) return false;
  if (f.nivel && L.nivel !== Number(f.nivel)) return false;
  if (f.duracion && !enDuracion(L.minutos, f.duracion)) return false;
  if (f.progreso || f.repaso) {
    const e = ctx.estado(L);
    if (f.progreso && e.estado !== f.progreso) return false;
    if (f.repaso && !e.pendientes) return false;
  }
  if (f.favoritas && !ctx.favorita(L.id)) return false;
  return true;
}

export const filtrar = (lecciones, f, ctx) => lecciones.filter((L) => pasa(L, f, ctx));

/**
 * Filtros activos con su nombre (para las fichas que se quitan una a una). `t`: traducción de la interfaz;
 * `nombreIdioma(id)`: el nombre de un idioma en el de la interfaz.
 */
export function activos(f, t = (k) => k, nombreIdioma = (id) => id) {
  const nombre = {
    estructura: (v) => t(`filtro.grupo.${v}`), idioma: (v) => nombreIdioma(v), procedencia: (v) => t(`filtro.proc.${v}`),
    region: (v) => REGION_POR_ID.get(v)?.nombre, subregion: (v) => SUBREGION_POR_ID.get(v)?.nombre,
    sistema: (v) => SISTEMA_POR_ID.get(v)?.nombre, formato: (v) => FORMATO_POR_ID.get(v)?.nombre,
    tema: (v) => TEMA_POR_ID.get(v)?.nombre, nivel: (v) => NIVEL_POR_ID.get(Number(v))?.nombre,
    duracion: (v) => DURACIONES.find((d) => d.id === v)?.nombre, progreso: (v) => t(`progreso.${v}`),
    repaso: () => t('filtro.conRepaso'), favoritas: () => t('filtro.favoritas'),
  };
  return CLAVES.filter((k) => f[k] != null && f[k] !== false).map((k) => ({ clave: k, valor: f[k], nombre: nombre[k](f[k]) ?? String(f[k]) }));
}

/** Quitar un filtro (al quitar la región se quita también su subregión). */
export function quitar(f, clave) {
  const g = { ...f, [clave]: null };
  if (clave === 'region') g.subregion = null;
  return g;
}

/**
 * Sin resultados: qué filtro quitar para ampliar sin borrarlos todos. Devuelve [{ clave, nombre, n }] con cuántas
 * lecciones habría quitando cada uno, de más a menos (solo los que dan alguna).
 */
export function ampliar(lecciones, f, ctx, t, nombreIdioma) {
  return activos(f, t, nombreIdioma).map((a) => ({ ...a, n: filtrar(lecciones, quitar(f, a.clave), ctx).length }))
    .filter((x) => x.n > 0).sort((a, b) => b.n - a.n);
}

/**
 * Ordena. relevancia: la puntuación de la búsqueda (sin búsqueda, como recomendado); recomendado: lo que se puede
 * empezar ya (requisitos hechos) y sin terminar primero, por nivel y por el orden del plan; duracion: de corta a larga;
 * reciente: lo estudiado más recientemente primero.
 */
export function ordenar(lecciones, orden, ctx) {
  const rec = (L) => {
    const e = ctx.estado(L);
    const hecha = ['completada', 'demostrada', 'dominada'].includes(e.estado) ? 1 : 0;
    const enCurso = e.estado === 'en-curso' ? -1 : 0;
    const faltan = (L.requisitos ?? []).filter((r) => !ctx.terminada?.(r)).length ? 1 : 0;
    return [enCurso, hecha, faltan, L.nivel, L.orden ?? 999];
  };
  const cmpArr = (a, b) => { for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] - b[i]; return 0; };
  const lista = [...lecciones];
  if (orden === 'duracion') return lista.sort((a, b) => a.minutos - b.minutos || (a.orden ?? 0) - (b.orden ?? 0));
  if (orden === 'reciente') return lista.sort((a, b) => (ctx.estado(b).actividad ?? 0) - (ctx.estado(a).actividad ?? 0) || cmpArr(rec(a), rec(b)));
  if (orden === 'relevancia' && lista.some((L) => L.puntuacion != null)) return lista.sort((a, b) => (b.puntuacion ?? 0) - (a.puntuacion ?? 0) || cmpArr(rec(a), rec(b)));
  return lista.sort((a, b) => cmpArr(rec(a), rec(b)));
}
