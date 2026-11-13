// Planificador de sesiones de estudio sin IA: con lo que ya existe (lecciones, partes de lecciones, el banco de
// preguntas y lo vencido del repaso) arma un PlanSesion (protocolo.js, limpiarPlanSesion) para un objetivo y unos
// minutos. Una sesión completa se puede crear y terminar así, sin llamar a Claude; Neuri (modo «sesion») solo entra
// cuando el objetivo es ambiguo, largo o mezcla temas. Sin DOM: lo prueba `npm test`.
//
// Reglas (planificarLocal):
//  1. repaso de lo vencido del tema: como mucho el 40 % del tiempo si hay algo nuevo por estudiar;
//  2. la lección del tema que se está estudiando, donde se dejó ('continuar');
//  3. las que mejor encajan según el buscador, con los requisitos antes (si son del tema), cerca del nivel pedido y sin
//     las ya terminadas; si la primera no cabe entera, su inicio;
//  4. una práctica final de 3 a 5 minutos con preguntas de lo estudiado, si cabe;
//  5. si todo el tema está terminado: práctica de esas lecciones.
// Los textos (título, mensaje, motivos) van en el idioma de la interfaz con `t` y, además, como clave de texto
// ({ clave, datos }) para que la interfaz los traduzca de nuevo; sin `t` (o si falta la clave), en español.
import * as P from '../biblioteca/progreso.js';
import { proponer, MIN_POR_PREGUNTA } from '../biblioteca/sesion.js';
import { consultaDe } from './local.js';
import { LIMITES } from './protocolo.js';

/** Los textos de la app que usa el planificador, en español (la interfaz tiene los cinco idiomas). */
export const TEXTOS_SESION = {
  'pet.ses.titulo': '{x} · {m} min',
  'pet.ses.tituloGeneral': 'Sesión de {m} minutos',
  'pet.ses.mensaje': 'Te propongo una sesión de {m} minutos en {n} bloques. Puedes pausarla cuando quieras y seguir después donde la dejes.',
  'pet.ses.mensajeGeneral': 'Con lo que tienes pendiente, te propongo una sesión de {m} minutos en {n} bloques.',
  'pet.ses.objetivo': 'Al terminar: {x}',
  'pet.ses.motivo.repaso': 'Preguntas que ya tocaba repasar.',
  'pet.ses.motivo.seguir': 'Sigues donde lo dejaste.',
  'pet.ses.motivo.nueva': 'Encaja con lo que pediste.',
  'pet.ses.motivo.inicio': 'La primera parte; el resto, en otra sesión.',
  'pet.ses.motivo.requisito': 'Conviene antes de «{x}».',
  'pet.ses.motivo.practica': 'Comprueba lo que acabas de estudiar.',
  'pet.ses.motivo.repasoTema': 'Ya la terminaste: comprueba lo que recuerdas.',
  'pet.ses.motivo.siguiente': 'La siguiente en tu plan de estudio.',
  'pet.ses.aclarar': '¿Sobre qué tema quieres la sesión? Por ejemplo: el corazón, la rodilla o los huesos del cráneo.',
};
const TERMINADA = ['completada', 'demostrada', 'dominada'];
// Palabras de pedir una sesión que no dicen el tema (además del relleno de local.js).
const DE_SESION = new Set(('sesion sesiones session sessions sessione sessioni seance seances sitzung lernsitzung lerneinheit einheit '
  + 'clase class classe cours unterrichtsstunde prepara preparame preparar hazme haz organizame organiza planifica planificame armame montame '
  + 'prepare make plan build set up give gib mach mache erstelle plane bereite vor fais faites donne donnez planifie organise '
  + 'preparami fammi fai dammi organizza pianifica tengo minutos estudio estudiar quiero repasar zum zur um am im vom beim per pour to for').split(' '));

/** Un texto de la app: con `t` en el idioma de la interfaz (si existe la clave) y, si no, en español. */
function decir(t, clave, datos = {}) {
  if (t) {
    try { const s = t(clave, datos); if (s && s !== clave) return s; } catch { /* sin traducción: en español */ }
  }
  return (TEXTOS_SESION[clave] ?? clave).replace(/\{(\w+)\}/g, (m, k) => (k in datos ? String(datos[k]) : m));
}

const lista = (catalogo) => (Array.isArray(catalogo) ? catalogo : Array.isArray(catalogo?.lecciones) ? catalogo.lecciones : catalogo instanceof Map ? [...catalogo.values()] : []);
const reloj = (ahora) => (typeof ahora === 'function' ? ahora() : Number.isFinite(ahora) ? ahora : Date.now());

/**
 * Cómo encaja un objetivo con la biblioteca: { tema (si hay uno reconocible), fuerza ('alta' | 'media' | 'baja' |
 * 'ninguna'), mezcla (varias zonas o sistemas), largo (muchas palabras de tema), lecciones (las del tema, por
 * relevancia), consulta }. `buscar(consulta, opciones)`: el buscador de la biblioteca (o un objeto con `buscar`).
 */
export function valorarObjetivo(objetivo, buscar) {
  const consulta = consultaDe(objetivo ?? '').split(' ').filter((w) => w && !DE_SESION.has(w)).join(' ');
  const nada = { tema: false, fuerza: 'ninguna', mezcla: false, largo: false, lecciones: [], consulta };
  if (!consulta) return nada;
  const fn = typeof buscar === 'function' ? buscar : buscar?.buscar?.bind(buscar);
  let r = null;
  try { r = fn?.(consulta, { flexible: true }) ?? null; } catch { r = null; }
  if (!r || r.sinTema || !r.lecciones?.length) return nada;
  const mejor = r.lecciones[0].puntuacion ?? 0;
  // Lo que encaja de verdad: como en Neuri sin IA (local.js), no se rellena con lo que encaja mucho menos.
  const lecciones = r.lecciones.filter((L) => (L.puntuacion ?? 0) >= Math.max(1, mejor / 2));
  const materias = (r.materias ?? []).filter((m) => !m.generico);
  const zonas = new Set((r.lugares ?? []).map((l) => l.region));
  return {
    tema: true,
    fuerza: r.parcial ? 'baja' : r.relajado || (r.ignoradas ?? []).length || mejor < 4 ? 'media' : 'alta',
    mezcla: zonas.size > 1 || materias.length > 1,
    largo: consulta.split(' ').length > 8,
    lecciones,
    consulta,
  };
}

/**
 * Plan de una sesión sobre un tema, sin IA. `objetivo`: lo que pidió la persona; `minutos` (5-120); `nivel` (1-3 o
 * null); `modelo`; `catalogo`: las lecciones del catálogo (y las propias); `data`: el progreso; `buscar`: el buscador;
 * `estado(L)`: el estado de una lección como lo enseñan las tarjetas (si no, el del progreso); `t`: los textos.
 * Devuelve un PlanSesion válido para limpiarPlanSesion (con `ambito`: las lecciones del tema, y `textos`), o null si no
 * hay un tema reconocible o nada que hacer de él en este modelo.
 */
export function planificarLocal({ objetivo, minutos, nivel = null, modelo = 'male', catalogo, data = P.vacio(), buscar, ahora = Date.now, t = null, estado = null } = {}) {
  const total = Math.min(120, Math.max(5, Math.round(Number(minutos) || 15)));
  const porId = new Map(lista(catalogo).map((L) => [L.id, L]));
  const v = valorarObjetivo(objetivo, buscar);
  if (!v.tema) return null;
  const enModelo = (L) => (L.modelos ?? ['male', 'female']).includes(modelo);
  const tema = v.lecciones.map((x) => porId.get(x.id) ?? x).filter(enModelo);
  if (!tema.length) return null;
  const ms = reloj(ahora);
  const est = (L) => (estado ? estado(L) : P.estadoLeccion(data, L, { ahora: ms }));
  const hecha = (L) => TERMINADA.includes(est(L).estado);
  const ambito = new Set(tema.map((L) => L.id));
  const bloques = [];
  const usadas = new Set();
  const motivo = (clave, datos = {}) => ({ motivo: decir(t, clave, datos).slice(0, LIMITES.motivo), motivoClave: { clave, datos } });
  let queda = total;
  const practica = total >= 10 ? Math.min(5, Math.max(3, Math.round(total * 0.2))) : 0;
  const porHacer = tema.filter((L) => !hecha(L));

  // 1. Repaso de lo vencido del tema.
  const vencidas = P.vencidas(data, { ahora: ms, filtro: (id) => ambito.has(id.slice(0, id.indexOf('/'))) });
  if (vencidas.length) {
    const tope = porHacer.length ? queda * 0.4 : queda - practica;
    const n = Math.max(1, Math.min(vencidas.length, Math.floor(tope / MIN_POR_PREGUNTA)));
    const m = Math.min(queda, Math.max(1, Math.ceil(n * MIN_POR_PREGUNTA)));
    bloques.push({ tipo: 'repaso', minutos: m, ...motivo('pet.ses.motivo.repaso', { n }) });
    queda -= m;
  }
  // 2. Lo que se está estudiando del tema, donde se dejó.
  const enCurso = porHacer.filter((L) => est(L).estado === 'en-curso').sort((a, b) => (est(b).actividad ?? 0) - (est(a).actividad ?? 0));
  if (enCurso[0] && queda - practica >= 2) {
    const L = enCurso[0];
    const e = est(L);
    const restante = Math.max(2, Math.round(L.minutos * (1 - e.vistos / Math.max(e.total, 1))));
    const m = Math.min(restante, queda - practica, LIMITES.minutosBloque);
    bloques.push({ tipo: 'leccion', leccion: L.id, parte: 'continuar', minutos: m, ...motivo('pet.ses.motivo.seguir') });
    usadas.add(L.id);
    queda -= m;
  }
  // 3. Las que mejor encajan: requisitos hechos antes, cerca del nivel, en el orden del buscador.
  const requisitosHechos = (L) => (L.requisitos ?? []).every((id) => !porId.has(id) || hecha(porId.get(id)));
  const orden = new Map(tema.map((L, i) => [L.id, i]));
  const nuevas = porHacer.filter((L) => !usadas.has(L.id) && est(L).estado === 'sin-empezar')
    .sort((a, b) => (requisitosHechos(a) ? 0 : 1) - (requisitosHechos(b) ? 0 : 1)
      || (nivel ? Math.abs(a.nivel - nivel) - Math.abs(b.nivel - nivel) : 0) || orden.get(a.id) - orden.get(b.id));
  const poner = (L, clave, datos) => {
    const libre = queda - practica;
    if (L.minutos <= libre + 2) {
      const m = Math.min(L.minutos, LIMITES.minutosBloque, queda);
      bloques.push({ tipo: 'leccion', leccion: L.id, parte: 'entera', minutos: m, ...motivo(clave, datos) });
      queda -= m;
    } else {
      bloques.push({ tipo: 'leccion', leccion: L.id, parte: 'inicio', minutos: Math.min(libre, LIMITES.minutosBloque), ...motivo('pet.ses.motivo.inicio') });
      queda -= Math.min(libre, LIMITES.minutosBloque);
    }
    usadas.add(L.id);
  };
  for (const L of nuevas) {
    if (queda - practica < 4 || bloques.length >= LIMITES.bloquesSesion - (practica ? 1 : 0)) break;
    if (usadas.has(L.id)) continue;
    // Un requisito del mismo tema sin hacer va antes (si cabe entero); uno de fuera del tema no se mete en la sesión.
    const falta = (L.requisitos ?? []).map((id) => porId.get(id)).find((R) => R && ambito.has(R.id) && !hecha(R) && !usadas.has(R.id) && enModelo(R));
    if (falta && falta.minutos <= queda - practica) poner(falta, 'pet.ses.motivo.requisito', { x: L.titulo });
    if (queda - practica < 4 || bloques.length >= LIMITES.bloquesSesion - (practica ? 1 : 0)) break;
    // Una lección que no cabe entera solo se empieza si es la primera de la sesión (no se dejan varias a medias).
    if (L.minutos > queda - practica + 2 && bloques.some((b) => b.tipo === 'leccion')) continue;
    poner(L, 'pet.ses.motivo.nueva');
  }
  // 4. Práctica final con lo estudiado (la primera lección de la sesión: la principal).
  const estudiadas = bloques.filter((b) => b.tipo === 'leccion').map((b) => b.leccion);
  if (estudiadas.length && practica && queda >= 3) {
    bloques.push({ tipo: 'practica', leccion: estudiadas[0], minutos: Math.min(queda, 5), ...motivo('pet.ses.motivo.practica') });
    queda -= Math.min(queda, 5);
  }
  // 5. Todo el tema terminado: práctica de lo que ya se estudió (lo vencido ya va en el repaso).
  if (!estudiadas.length) {
    const hechas = tema.filter(hecha).slice(0, 2);
    for (const L of hechas) {
      if (queda < 3 || bloques.length >= LIMITES.bloquesSesion) break;
      const m = Math.min(queda, Math.max(3, Math.round(queda / (hechas.length - hechas.indexOf(L)))), LIMITES.minutosBloque);
      bloques.push({ tipo: 'practica', leccion: L.id, minutos: m, ...motivo('pet.ses.motivo.repasoTema') });
      queda -= m;
    }
  }
  if (!bloques.length) return null;
  const principal = porId.get(estudiadas[0] ?? bloques.find((b) => b.leccion)?.leccion) ?? tema[0];
  return armar({ bloques, principal, total, t, ambito: [...ambito], general: false });
}

/**
 * Plan sin tema («prepárame una sesión de 20 minutos»): lo vencido, lo empezado y lo siguiente del plan de estudio,
 * con proponer() de la biblioteca (la misma propuesta de la portada). Null si no hay nada que proponer.
 */
export function planificarSinTema({ minutos, modelo = 'male', catalogo, data = P.vacio(), ahora = Date.now, t = null, estado = null } = {}) {
  const total = Math.min(120, Math.max(5, Math.round(Number(minutos) || 15)));
  const cat = lista(catalogo).filter((L) => Array.isArray(L.modelos) && Array.isArray(L.lugares) && Array.isArray(L.sistemas));
  const porId = new Map(cat.map((L) => [L.id, L]));
  const propuesta = proponer({ minutos: total, catalogo: cat, data, modelo, ahora: reloj(ahora), estadoDe: estado });
  const motivo = (clave, datos = {}) => ({ motivo: decir(t, clave, datos).slice(0, LIMITES.motivo), motivoClave: { clave, datos } });
  const bloques = propuesta.slice(0, LIMITES.bloquesSesion).map((b) => {
    const m = Math.min(LIMITES.minutosBloque, Math.max(1, Math.round(b.minutos)));
    if (b.tipo === 'repaso') return { tipo: 'repaso', minutos: m, ...motivo('pet.ses.motivo.repaso', { n: b.preguntas }) };
    const L = porId.get(b.id);
    const parte = b.motivo === 'seguir' ? 'continuar' : L && m < L.minutos ? 'inicio' : 'entera';
    return { tipo: 'leccion', leccion: b.id, parte, minutos: m, ...motivo(b.motivo === 'seguir' ? 'pet.ses.motivo.seguir' : 'pet.ses.motivo.siguiente') };
  });
  if (!bloques.length) return null;
  const principal = porId.get(bloques.find((b) => b.leccion)?.leccion) ?? null;
  return armar({ bloques, principal, total, t, ambito: [], general: true });
}

/** Título, mensaje y objetivo de un plan (con sus claves de texto). */
function armar({ bloques, principal, total, t, ambito, general }) {
  const minutos = Math.min(total, bloques.reduce((n, b) => n + b.minutos, 0)) || total;
  const clave = (k, datos) => ({ clave: k, datos });
  const textos = {
    titulo: general ? clave('pet.ses.tituloGeneral', { m: minutos }) : clave('pet.ses.titulo', { x: tituloCorto(principal?.titulo ?? ''), m: minutos }),
    mensaje: clave(general ? 'pet.ses.mensajeGeneral' : 'pet.ses.mensaje', { m: minutos, n: bloques.length }),
  };
  // El objetivo observable: el primero de la lección principal (empieza por un verbo observable; formato.js).
  const meta = principal?.objetivos?.[0];
  if (meta) textos.objetivo = clave('pet.ses.objetivo', { x: minuscula(meta) });
  const de = (c) => (c ? decir(t, c.clave, c.datos) : '');
  return {
    titulo: de(textos.titulo).slice(0, LIMITES.campo),
    mensaje: de(textos.mensaje).slice(0, LIMITES.largo),
    objetivo: de(textos.objetivo).slice(0, LIMITES.largo),
    bloques,
    ambito,
    textos,
  };
}

const minuscula = (s) => (s ? s[0].toLowerCase() + s.slice(1) : s);
/** El tema para el título: el título de la lección hasta los dos puntos («El corazón: cavidades…» → «El corazón»). */
const tituloCorto = (s) => String(s).split(/[:(—–]/)[0].trim().slice(0, 60);

/**
 * El puente entre la conversación (src/pet/conversacion.js, opción `sesiones`) y las sesiones: decide si un pedido se
 * planifica en la app o con Neuri, arma el plan local y crea la sesión. `sesiones`: el almacén (src/pet/sesiones.js);
 * `catalogo()`, `data()`, `modelo()`, `idioma()`: lo de ahora en la app; `buscar`: el buscador; `cargar(id)`: la lección
 * entera; `idsLecciones()`: Set de las que existen; `estado(L)`: el de las tarjetas; `t`: los textos.
 * Devuelve { planificar(pedido) → { plan, preferir: 'local' | 'ia', texto?, sugerencias? }, crear(plan, { origen,
 * pedido }) → promesa de { ok, sesion?, quitados, error? }, activa() → { id, … } | null, modelo() }.
 */
export function puenteSesiones({ sesiones, catalogo, data, buscar, cargar, modelo = () => 'male', idioma = () => 'es', idsLecciones = () => null, estado = null, t = null, ahora = Date.now, zonas = () => [] }) {
  return {
    modelo,
    planificar(pedido) {
      const objetivo = String(pedido?.objetivo ?? '').trim();
      const base = { minutos: pedido?.minutos ?? 15, nivel: pedido?.nivel ?? null, modelo: modelo(), catalogo: catalogo(), data: data(), ahora, t, estado };
      if (!objetivo || !valorarObjetivo(objetivo, buscar).consulta) {
        const plan = planificarSinTema(base);
        return plan ? { plan, preferir: 'local' } : { plan: null, preferir: 'local', texto: decir(t, 'pet.ses.aclarar'), sugerencias: zonas() };
      }
      const v = valorarObjetivo(objetivo, buscar);
      const plan = v.tema ? planificarLocal({ ...base, objetivo, buscar }) : null;
      const claro = v.tema && v.fuerza === 'alta' && !v.mezcla && !v.largo && !!plan;
      return { plan, preferir: claro ? 'local' : 'ia', ...(plan ? {} : { texto: decir(t, 'pet.ses.aclarar'), sugerencias: zonas() }) };
    },
    async crear(plan, { origen = 'local', pedido = null } = {}) {
      const r = await sesiones.crear(plan, {
        origen, idioma: idioma(), modelo: modelo(), nivel: pedido?.nivel ?? null, minutos: pedido?.minutos ?? null,
        data: data(), cargar, idsLecciones: idsLecciones(), ambito: plan?.ambito ?? null,
      });
      return r.ok ? { ...r, resumen: sesiones.instantanea(r.sesion) } : r;
    },
    activa() { const S = sesiones.activa(); return S ? { id: S.id, ...sesiones.instantanea(S) } : null; },
  };
}

