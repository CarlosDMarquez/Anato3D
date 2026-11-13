// Perfil de aprendizaje para Neuri (protocolo.js, limpiarPerfil): lo mínimo que hace falta para orientar o planificar
// una sesión, calculado en el dispositivo con el mapa de aprendizaje (src/biblioteca/mapa.js), las preferencias, lo
// vencido y la última sesión (src/pet/sesiones.js). Sin fechas, sin respuestas y sin texto libre salvo el título de esa
// sesión; como mucho 350 tokens (el más lleno que admite el protocolo mide unos 250; lo comprueban las pruebas). Sin DOM: lo prueba `npm test`.
import * as P from '../biblioteca/progreso.js';
import { calcularMapa } from '../biblioteca/mapa.js';
import { REGION_POR_ID, SISTEMA_POR_ID } from '../biblioteca/taxonomia.js';
import { LIMITES } from './protocolo.js';

const CLAVE_ESTRUCTURA = /^[A-Za-z0-9_()'.,-]{2,120}$/;
const esInteres = (x) => typeof x === 'string' && (REGION_POR_ID.has(x) || SISTEMA_POR_ID.has(x));

/**
 * El perfil: { nivel, minutos, intereses, habilidades, dificultades, vencidas, ultima } (CONTRATO §2), o null si aún no
 * dice nada. `data`: el progreso; `catalogo`: las lecciones (del catálogo y propias); `modelo`: lo vencido se cuenta
 * solo de lo que existe en él; `sesiones`: la lista de sesiones (o el almacén, con `lista`); `invalida(intento)` y
 * `estado(L)`: como en calcularMapa (la app tiene en cuenta las preguntas retiradas y las limitaciones del modelo).
 */
export function construirPerfil({ data, catalogo = [], modelo = 'male', sesiones = [], ahora = Date.now, invalida, estado } = {}) {
  if (!data || typeof data !== 'object') return null;
  const ms = typeof ahora === 'function' ? ahora() : ahora;
  const lecciones = Array.isArray(catalogo) ? catalogo : [...(catalogo?.values?.() ?? [])];
  const mapa = calcularMapa(data, { catalogo: lecciones, ahora: ms, ...(invalida ? { invalida } : {}), ...(estado ? { estado } : {}) });
  const pref = P.limpiarPreferencias(data.preferencias);

  const habilidades = {};
  // (Lo que aún no tiene datos no dice nada: no se envía.)
  for (const h of mapa.habilidades) if (h.estado !== 'sin-datos') habilidades[h.id] = h.estado;

  // Dificultades: la más reciente primero, una por estructura de cada lección.
  const vistas = new Set();
  const dificultades = [];
  for (const d of mapa.dificultades) {
    const estructura = typeof d.estructura === 'string' && CLAVE_ESTRUCTURA.test(d.estructura) ? d.estructura : null;
    const k = `${d.leccion}|${estructura}`;
    if (vistas.has(k)) continue;
    vistas.add(k);
    dificultades.push({ leccion: d.leccion, estructura, motivo: d.motivo, fallos: Math.min(9, Math.max(1, d.fallos ?? 1)) });
    if (dificultades.length === LIMITES.dificultades) break;
  }

  const enModelo = new Set(lecciones.filter((L) => (L.modelos ?? ['male', 'female']).includes(modelo)).map((L) => L.id));
  const vencidas = P.vencidas(data, { ahora: ms, filtro: (id) => enModelo.has(id.slice(0, id.indexOf('/'))) }).length;

  const perfil = {
    nivel: pref?.nivel ?? null,
    minutos: pref?.minutos ?? null,
    intereses: interesesDe(pref, data, lecciones),
    habilidades,
    dificultades,
    vencidas: Math.min(vencidas, LIMITES.vencidas),
    ultima: ultimaSesion(sesiones),
  };
  const vacio = perfil.nivel == null && perfil.minutos == null && !perfil.intereses.length && !Object.keys(habilidades).length
    && !dificultades.length && !perfil.vencidas && !perfil.ultima;
  return vacio ? null : perfil;
}

/** Los intereses que eligió la persona (regiones o sistemas); si no eligió, las zonas de lo que estudió últimamente. */
function interesesDe(pref, data, lecciones) {
  const elegidos = (pref?.intereses ?? []).filter(esInteres);
  if (elegidos.length) return [...new Set(elegidos)].slice(0, LIMITES.intereses);
  const porId = new Map(lecciones.map((L) => [L.id, L]));
  const recientes = Object.entries(data.lecciones ?? {}).filter(([id, p]) => porId.has(id) && p?.actividad)
    .sort(([, a], [, b]) => b.actividad - a.actividad).slice(0, 8);
  const cuenta = new Map();
  for (const [id] of recientes) {
    for (const [region] of porId.get(id).lugares ?? []) if (esInteres(region)) cuenta.set(region, (cuenta.get(region) ?? 0) + 1);
  }
  return [...cuenta].sort((a, b) => b[1] - a[1]).map(([id]) => id).slice(0, LIMITES.intereses);
}

/** La última sesión de estudio (la más reciente): título, bloques hechos y totales, y si se terminó. */
function ultimaSesion(sesiones) {
  const lista = Array.isArray(sesiones) ? sesiones : Array.isArray(sesiones?.lista) ? sesiones.lista : [];
  const S = [...lista].filter((x) => x && Array.isArray(x.bloques) && x.bloques.length).sort((a, b) => (b.actualizada ?? 0) - (a.actualizada ?? 0))[0];
  if (!S) return null;
  const bloques = Math.min(12, S.bloques.length);
  const titulo = String(S.titulo ?? '').replace(/\s+/g, ' ').trim().slice(0, LIMITES.tituloSesion);
  if (!titulo) return null;
  return {
    titulo,
    hechos: Math.min(bloques, (S.resultados ?? []).filter((r) => !r.saltado).length),
    bloques,
    terminada: S.estado === 'finalizada',
  };
}
