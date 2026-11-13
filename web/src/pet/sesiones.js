// Sesiones de estudio con Neuri: un plan guardado y reanudable en este navegador (objetivo, minutos, nivel y bloques en
// orden: repaso de lo vencido, una lección entera o una parte, práctica con preguntas del banco). Se reproduce con el
// reproductor y las preguntas que ya existen y alimenta el mismo progreso (src/biblioteca/progreso.js). El plan lo arma
// la app sin IA (src/pet/planificador.js) o Neuri en el modo «sesion» (server/pet.mjs): aquí se «materializa» (se eligen
// las preguntas reales y los pasos de cada parte, y se quita lo que no existe en el modelo o este muestra mal) y se
// guarda. El servidor nunca guarda sesiones. Sin DOM: lo prueba `npm test`.
//
// Una sesión: { id: 'ses-…', creada, actualizada, origen: 'neuri' | 'local', idioma, modelo, titulo, objetivo, nivel,
//   minutos, mensaje, estado, bloques, i (el bloque en curso), resultados, posicion, quitados, textos? }
// Estados: planificada (creada, sin empezar) → activa ⇄ pausada → finalizada (también al terminarla antes de tiempo:
// lo hecho se conserva). Solo una activa a la vez: empezar otra pausa la anterior.
// Bloques (lo que de verdad se reproduce):
//   { tipo: 'repaso', items: [ids de ítem «leccion/pregunta»], minutos, motivo }
//   { tipo: 'leccion', leccion, pasos: null (entera) | [ids de paso en orden], minutos, motivo }
//   { tipo: 'practica', leccion, items: [ids de ítem], minutos, motivo }
//   (+ `motivoClave: { clave, datos }` si el motivo lo puso la app: la interfaz lo traduce; `perdido: true` si su
//   lección ya no existe.)
// Resultados (uno por bloque terminado o saltado; avanzar dos veces el mismo bloque no duplica):
//   { bloque, cuando, aciertos, total, conAyuda, revelados, saltado, motivo?, fallos? }
//
// Se guarda en localStorage (CLAVE_SESIONES) con formato versionado: { formato, version, sesiones }. Lo que no se puede
// leer (dañado o de una versión más nueva) se aparta tal cual (CLAVE_SESIONES_APARTADAS) antes de escribir; si no se
// puede apartar, no se escribe. Si el navegador no deja guardar (lleno, bloqueado), se avisa (`alNoGuardar`) en vez de
// perderlo en silencio. Como mucho MAX_SESIONES: al pasarse se quitan primero las planificadas sin empezar, después las
// finalizadas más antiguas y, solo si aún sobran, las pausadas más antiguas; nunca la activa ni la que se acaba de crear,
// y se avisa de lo quitado (`alPodar`).
import { LIMITES, TIPOS_BLOQUE, limpiarPlanSesion } from './protocolo.js';
import { nuevoId } from './red.js';
import * as P from '../biblioteca/progreso.js';
import { MIN_POR_PREGUNTA, sinRepetirRecientes } from '../biblioteca/sesion.js';
import { disponibleEn } from '../biblioteca/evaluar.js';

export const CLAVE_SESIONES = 'anato3d.sesiones';
export const CLAVE_SESIONES_APARTADAS = 'anato3d.sesiones.apartadas';
export const FORMATO_SESIONES = 'anato3d-sesiones';
export const VERSION_SESIONES = 1;
export const MAX_SESIONES = 20;
export const ESTADOS_SESION = ['planificada', 'activa', 'pausada', 'finalizada'];
export const ORIGENES_SESION = ['neuri', 'local'];
/** Preguntas de un bloque de repaso o de práctica (como una práctica de la biblioteca). */
export const MAX_ITEMS_BLOQUE = 12;
export const MAX_ITEMS_PRACTICA = 8;
export const ID_SESION = /^ses-[a-z0-9-]{8,64}$/;
const MAX_APARTADAS = 30;
const ID_LECCION = /^[a-z0-9-]{2,100}$/;
const ID_ITEM = /^[a-z0-9-]{2,100}\/[^\s/]{1,120}$/;
const CLAVE_TEXTO = /^[a-zA-Z0-9.-]{1,80}$/;
const texto = (s, max) => (typeof s === 'string' ? s.replace(/\s+/g, ' ').trim().slice(0, max) : '');
const leccionDeItem = (id) => id.slice(0, id.indexOf('/'));
const contar = (x) => (Number.isInteger(x) && x >= 0 ? Math.min(x, 999) : 0);
const acotar = (n, min, max) => Math.min(max, Math.max(min, n));

/**
 * El almacén de sesiones. `almacen`: localStorage; `ahora`: el reloj (las pruebas lo cambian). `alNoGuardar()`: se llama
 * cuando el navegador no deja guardar (una vez hasta que vuelva a poder: la interfaz avisa con un aviso breve).
 * `alPodar(quitadas)`: las sesiones que se quitaron para no pasar de MAX_SESIONES ([{ id, titulo, estado, textos? }]).
 * Devuelve las funciones de abajo; todas son síncronas salvo `crear`, que carga las lecciones que necesita.
 */
export function crearSesiones({ almacen = null, ahora = Date.now, alNoGuardar = null, alPodar = null } = {}) {
  let { lista, apartar: porApartar } = leer(almacen);
  const oyentes = new Set();
  const avisar = (S) => { for (const fn of oyentes) { try { fn(S); } catch { /* un oyente roto no para nada */ } } };
  const buscar = (id) => lista.find((S) => S.id === id) ?? null;
  let sinGuardar = false;   // el último intento de guardar falló (se avisa una vez, hasta que vuelva a poder)

  /** Escribe la lista; antes, aparta lo que no se pudo leer. Si no se puede apartar, no escribe (no se pierde nada). */
  function guardar() {
    if (!almacen) return false;
    const ok = escribir();
    if (!ok && !sinGuardar) { try { alNoGuardar?.(); } catch { /* el aviso no para nada */ } }
    sinGuardar = !ok;
    return ok;
  }
  function escribir() {
    if (porApartar.length) {
      if (!apartarTextos(almacen, porApartar, ahora)) return false;
      porApartar = [];
    }
    try { almacen.setItem(CLAVE_SESIONES, JSON.stringify({ formato: FORMATO_SESIONES, version: VERSION_SESIONES, sesiones: lista })); return true; } catch { return false; }
  }
  /** Solo una activa: las demás que lo estén pasan a pausadas (como al empezar otra). */
  function pausarOtras(S) {
    for (const x of lista) if (x !== S && x.estado === 'activa') tocar(x, { estado: 'pausada' });
  }
  function tocar(S, cambios = {}) {
    Object.assign(S, cambios, { actualizada: ahora() });
    guardar();
    avisar(S);
  }

  /**
   * Crea una sesión con un plan (PlanSesion: del servidor o de src/pet/planificador.js). La materializa: cada bloque
   * con sus preguntas reales y sus pasos; lo que no existe, no está en `modelo` o el modelo muestra mal se quita (y se
   * cuenta en `quitados`); un bloque que se queda vacío, también. Opciones:
   *   origen 'neuri' | 'local', idioma, modelo, nivel, minutos (los pedidos; si no, la suma de los bloques)
   *   data          el progreso (para lo vencido, lo ya visto y lo recién fallado)
   *   cargar(id)    la lección entera (o una promesa de ella; null si no existe)
   *   idsLecciones  Set de las lecciones que existen (catálogo y propias); sin él, basta con la forma del id
   *   ambito        ids de las lecciones del tema (el repaso va primero con lo vencido de esas)
   * Devuelve (promesa) { ok, sesion?, quitados: [{ tipo, leccion, motivo }], guardada?, podadas? (las sesiones que se
   * quitaron para hacerle sitio), error? ('plan' | 'vacia') }.
   * Motivos de lo quitado: 'no-existe', 'modelo', 'vista' (ya se vio entera), 'sin-preguntas'.
   */
  async function crear(plan, { origen = 'local', idioma = 'es', modelo = 'male', nivel = null, minutos = null, data = P.vacio(), cargar = () => null, idsLecciones = null, ambito = null } = {}) {
    const limpio = limpiarPlanSesion(plan, idsLecciones);
    if (!limpio) return { ok: false, error: 'plan', quitados: [] };
    const { bloques, quitados } = await materializar(plan, { modelo, data, cargar, idsLecciones, ambito, ahora });
    if (!bloques.length) return { ok: false, error: 'vacia', quitados };
    const textos = textosValidos(plan.textos);
    const S = {
      id: `ses-${nuevoId().toLowerCase()}`, creada: ahora(), actualizada: ahora(),
      origen: ORIGENES_SESION.includes(origen) ? origen : 'local', idioma: texto(idioma, 5) || 'es', modelo: modelo === 'female' ? 'female' : 'male',
      titulo: limpio.titulo, objetivo: limpio.objetivo, nivel: Number.isInteger(nivel) && nivel >= 1 && nivel <= 3 ? nivel : null,
      minutos: Number.isInteger(minutos) && minutos > 0 ? Math.min(minutos, 240) : bloques.reduce((n, b) => n + b.minutos, 0),
      mensaje: limpio.mensaje, estado: 'planificada', bloques, i: 0, resultados: [], posicion: null, quitados: quitados.length,
      ...(textos ? { textos } : {}),
    };
    const { lista: nueva, fuera } = podar([S, ...lista], S);
    lista = nueva;
    const guardada = guardar();
    const podadas = fuera.map((x) => ({ id: x.id, titulo: x.titulo, estado: x.estado, ...(x.textos ? { textos: x.textos } : {}) }));
    if (podadas.length) { try { alPodar?.(podadas); } catch { /* el aviso no para nada */ } }
    avisar(S);
    return { ok: true, sesion: S, quitados, guardada, podadas };
  }

  /** Empieza o reanuda: queda activa (la que estuviera activa pasa a pausada) en el bloque en el que se dejó. */
  function empezar(id) {
    const S = buscar(id);
    if (!S) return { ok: false, error: 'no-existe' };
    if (S.estado === 'finalizada') return { ok: false, error: 'finalizada' };
    pausarOtras(S);
    if (S.i >= S.bloques.length) { tocar(S, { estado: 'finalizada' }); return { ok: true, sesion: S, fin: true }; }
    tocar(S, { estado: 'activa' });
    const aqui = S.posicion?.bloque === S.i;
    return { ok: true, sesion: S, bloque: S.bloques[S.i], i: S.i, posicion: aqui ? S.posicion.n : 0, parcial: aqui ? S.posicion.parcial ?? null : null };
  }

  /**
   * Termina el bloque en curso con su resultado: { bloque (su índice; si falta, el de ahora), aciertos, total,
   * conAyuda, revelados, saltado, motivo, fallos (ids de ítem) }. Idempotente: si ese bloque ya tiene resultado, no
   * se añade otro (`repetido`). Al terminar el último, la sesión queda finalizada (`fin`). Un bloque que no es el de
   * ahora (y no está hecho) da 'fuera-de-orden'.
   */
  function avanzar(id, resultado = {}) {
    const S = buscar(id);
    if (!S) return { ok: false, error: 'no-existe' };
    const k = Number.isInteger(resultado?.bloque) ? resultado.bloque : S.i;
    if (S.resultados.some((r) => r.bloque === k)) return { ok: true, repetido: true, sesion: S, fin: S.estado === 'finalizada' };
    if (S.estado === 'finalizada') return { ok: false, error: 'finalizada' };
    if (k !== S.i || k >= S.bloques.length) return { ok: false, error: 'fuera-de-orden' };
    S.resultados.push(limpiarResultado(resultado, k, ahora()));
    const i = k + 1;
    const fin = i >= S.bloques.length;
    // Avanzar (o saltar) una planificada la pone en marcha, y la que estuviera activa pasa a pausada (solo una activa).
    // Saltar sola un bloque perdido (depurar, al ver la sesión) no cambia su estado: no es ponerse a estudiarla.
    const perdido = resultado?.saltado === true && resultado?.motivo === 'perdido';
    const estado = fin ? 'finalizada' : S.estado === 'pausada' || (perdido && S.estado === 'planificada') ? S.estado : 'activa';
    if (estado === 'activa') pausarOtras(S);
    tocar(S, { i, posicion: null, estado });
    return { ok: true, sesion: S, fin, bloque: fin ? null : S.bloques[i], i };
  }

  /** Salta el bloque en curso (sin preguntas ni lección: cuenta como saltado). `motivo`: 'persona' o 'perdido'. */
  const saltar = (id, { motivo = 'persona' } = {}) => {
    const S = buscar(id);
    return S ? avanzar(id, { bloque: S.i, saltado: true, motivo }) : { ok: false, error: 'no-existe' };
  };

  /** Lo que es «la sesión»: la activa o, si no hay, la pausada o planificada más reciente (para seguirla). Null si no. */
  function activa() {
    const abiertas = lista.filter((S) => S.estado !== 'finalizada');
    return abiertas.find((S) => S.estado === 'activa')
      ?? abiertas.sort((a, b) => (b.actualizada ?? 0) - (a.actualizada ?? 0))[0] ?? null;
  }

  /**
   * Marca los bloques pendientes cuya lección (o todas sus preguntas) ya no existe: `existe(idLeccion)`. Sus
   * resultados anteriores se conservan; si el bloque en curso es uno de esos, se salta (motivo 'perdido') para seguir
   * con el resto. Devuelve { perdidos, saltados }.
   */
  function depurar(id, existe) {
    const S = buscar(id);
    if (!S || typeof existe !== 'function') return { perdidos: 0, saltados: 0 };
    let perdidos = 0;
    let cambia = false;
    S.bloques.forEach((b, k) => {
      if (k < S.i || b.perdido) { if (b.perdido) perdidos++; return; }
      const items = b.items ? b.items.filter((x) => existe(leccionDeItem(x))) : null;
      if (items && items.length !== b.items.length) { b.items = items; cambia = true; }
      if ((b.leccion && !existe(b.leccion)) || (items && !items.length)) { b.perdido = true; perdidos++; cambia = true; }
    });
    if (cambia) tocar(S);
    let saltados = 0;
    while (S.estado !== 'finalizada' && S.bloques[S.i]?.perdido) { saltar(id, { motivo: 'perdido' }); saltados++; }
    return { perdidos, saltados };
  }

  /**
   * Lo que se ha hecho: bloques hechos y saltados, aciertos (sin ayuda), con ayuda, revelados, minutos hechos y lo que
   * conviene repasar (lo fallado en la sesión que no se ha consolidado después; con `data`, solo lo que sigue sin
   * consolidar). Null si la sesión no existe.
   */
  function resumen(id, { data = null } = {}) {
    const S = buscar(id);
    if (!S) return null;
    const hechos = S.resultados.filter((r) => !r.saltado);
    const suma = (k) => hechos.reduce((n, r) => n + (r[k] ?? 0), 0);
    const fallos = [...new Set(S.resultados.flatMap((r) => r.fallos ?? []))];
    const repasar = data ? fallos.filter((x) => (data.items?.[x]?.caja ?? 0) < P.CAJA_DOMINIO) : fallos;
    return {
      id: S.id, titulo: S.titulo, estado: S.estado, origen: S.origen, total: S.bloques.length, i: S.i,
      hechos: hechos.length, saltados: S.resultados.length - hechos.length, perdidos: S.bloques.filter((b) => b.perdido).length,
      minutos: S.minutos, minutosHechos: hechos.reduce((n, r) => n + (S.bloques[r.bloque]?.minutos ?? 0), 0),
      aciertos: suma('aciertos'), preguntas: suma('total'), conAyuda: suma('conAyuda'), revelados: suma('revelados'),
      repasar: repasar.slice(0, MAX_ITEMS_BLOQUE),
      lecciones: [...new Set(S.bloques.filter((b) => b.leccion).map((b) => b.leccion))],
      terminada: S.estado === 'finalizada',
    };
  }

  return {
    get lista() { return lista; },
    buscar,
    crear,
    empezar,
    /** Reanudar es empezar: deja a la persona en el bloque (y la posición dentro de él) en que lo dejó. */
    reanudar: empezar,
    avanzar,
    saltar,
    /** Pausa la sesión (activa o planificada). */
    pausar(id) {
      const S = buscar(id);
      if (!S || !['activa', 'planificada'].includes(S.estado)) return false;
      tocar(S, { estado: 'pausada' });
      return true;
    },
    /** Termina la sesión ya (lo hecho se conserva; lo que falta queda sin hacer). */
    terminar(id) {
      const S = buscar(id);
      if (!S || S.estado === 'finalizada') return false;
      tocar(S, { estado: 'finalizada' });
      return true;
    },
    /** Quita la sesión (el progreso de lo estudiado en ella sigue en la biblioteca). */
    quitar(id) {
      if (!buscar(id)) return false;
      lista = lista.filter((S) => S.id !== id);
      guardar();
      avisar(null);
      return true;
    },
    activa,
    /**
     * El bloque en curso: { i, total, bloque, posicion, parcial } (posicion: el paso o la pregunta dentro del bloque;
     * parcial: lo respondido ya en ese bloque, si se anotó, para que al reanudar no se pierda su resultado).
     */
    actual(id) {
      const S = buscar(id);
      if (!S || S.i >= S.bloques.length) return null;
      const aqui = S.posicion?.bloque === S.i;
      return { i: S.i, total: S.bloques.length, bloque: S.bloques[S.i], posicion: aqui ? S.posicion.n : 0, parcial: aqui ? S.posicion.parcial ?? null : null };
    },
    /**
     * Anota por dónde va dentro del bloque en curso (paso o pregunta), para volver ahí al reanudar. `parcial` (opcional,
     * de la interfaz): lo respondido ya en el bloque { aciertos, total, conAyuda, revelados, fallos, intento? }; `intento`
     * ({ n, quitada }): la pregunta `n` ya tuvo su primer fallo (y `quitada`, la opción retirada), para seguir en su
     * segundo intento al reanudar. Devuelve si se pudo guardar.
     */
    anotarPosicion(id, n, parcial = null) {
      const S = buscar(id);
      if (!S || S.i >= S.bloques.length || !Number.isInteger(n) || n < 0) return false;
      const p = parcial ? limpiarResultado(parcial, S.i, ahora()) : null;
      const intento = parcial ? limpiarIntento(parcial.intento, n) : null;
      S.posicion = { bloque: S.i, n: Math.min(n, 999), ...(p ? { parcial: { aciertos: p.aciertos, total: p.total, conAyuda: p.conAyuda, revelados: p.revelados, ...(p.fallos ? { fallos: p.fallos } : {}), ...(intento ? { intento } : {}) } } : {}) };
      S.actualizada = ahora();
      return guardar();
    },
    depurar,
    resumen,
    /** Lo que se recuerda de una sesión en la conversación (para la tarjeta y para que Neuri sepa qué hay). */
    instantanea(S) {
      return {
        titulo: S.titulo, estado: S.estado, origen: S.origen, minutos: S.minutos, i: S.i, total: S.bloques.length,
        hechos: S.resultados.filter((r) => !r.saltado).length,
        bloques: S.bloques.map((b) => ({ tipo: b.tipo, leccion: b.leccion ?? null, minutos: b.minutos, parte: b.tipo === 'leccion' ? (b.pasos ? b.pasos.length : 'entera') : null, preguntas: b.items?.length ?? null })),
      };
    },
    /** Otra pestaña cambió las sesiones: se leen otra vez. */
    recargar() {
      const leido = leer(almacen);
      lista = leido.lista;
      porApartar = [...porApartar, ...leido.apartar.filter((x) => !porApartar.includes(x))];
      avisar(null);
    },
    /** «Borrar mis datos»: olvida las sesiones (el progreso lo borra la biblioteca). */
    olvidar() {
      lista = [];
      porApartar = [];
      guardar();
      avisar(null);
    },
    /** Lo apartado (sesiones guardadas que no se pudieron leer), para descargarlo. */
    apartados() { return [...leerApartados(almacen), ...porApartar.map((t) => ({ texto: t, apartado: null }))]; },
    /** Descarta lo apartado (solo cuando la persona lo pide, después de poder descargarlo). */
    descartarApartados() {
      porApartar = [];
      try { almacen?.setItem(CLAVE_SESIONES_APARTADAS, '[]'); } catch { return false; }
      guardar();
      return true;
    },
    suscribir(fn) { oyentes.add(fn); return () => oyentes.delete(fn); },
  };
}

// ── Materializar un plan ──

/** Los bloques reales de un plan (en su orden) y lo que se quitó. */
async function materializar(plan, { modelo, data, cargar, idsLecciones, ambito, ahora }) {
  const quitados = [];
  const crudos = (Array.isArray(plan.bloques) ? plan.bloques : []).slice(0, LIMITES.bloquesSesion);
  const pedidos = [];
  for (const crudo of crudos) {
    const b = limpiarPlanSesion({ titulo: 'x', bloques: [crudo] }, idsLecciones)?.bloques[0] ?? null;
    if (!b) { quitados.push({ tipo: TIPOS_BLOQUE.includes(crudo?.tipo) ? crudo.tipo : null, leccion: typeof crudo?.leccion === 'string' ? crudo.leccion.slice(0, 100) : null, motivo: 'no-existe' }); continue; }
    const clave = claveValida(crudo.motivoClave);
    pedidos.push(clave ? { ...b, motivoClave: clave } : b);
  }
  // Las lecciones que hacen falta, una vez cada una.
  const lecciones = new Map();
  const traer = async (id) => {
    if (!lecciones.has(id)) {
      let L = null;
      try { L = await cargar(id); } catch { L = null; }
      lecciones.set(id, L && typeof L === 'object' && Array.isArray(L.pasos) ? L : null);
    }
    return lecciones.get(id);
  };
  for (const b of pedidos) if (b.leccion) await traer(b.leccion);

  const usados = new Set();                 // ítems ya puestos en otro bloque (no se repiten en la sesión)
  const cubiertos = new Map();              // lección → Set de pasos que la sesión enseña antes (o 'todos')
  const delPlan = new Set(pedidos.filter((b) => b.leccion).map((b) => b.leccion));
  const bloques = [];
  const quitar = (b, motivo) => quitados.push({ tipo: b.tipo, leccion: b.leccion ?? null, motivo });
  const comun = (b) => ({ minutos: b.minutos, motivo: b.motivo, ...(b.motivoClave ? { motivoClave: b.motivoClave } : {}) });
  const enModelo = (L) => (L.modelos ?? ['male', 'female']).includes(modelo);

  for (const b of pedidos) {
    if (b.tipo === 'repaso') {
      const items = await itemsDeRepaso(b, { data, modelo, ahora, idsLecciones, prioridad: new Set([...(ambito ?? []), ...delPlan]), usados, traer, lecciones });
      if (!items.length) { quitar(b, 'sin-preguntas'); continue; }
      items.forEach((x) => usados.add(x));
      bloques.push({ tipo: 'repaso', items, ...comun(b), minutos: Math.min(b.minutos, Math.max(1, Math.ceil(items.length * MIN_POR_PREGUNTA))) });
      continue;
    }
    const L = lecciones.get(b.leccion);
    if (!L) { quitar(b, 'no-existe'); continue; }
    if (!enModelo(L)) { quitar(b, 'modelo'); continue; }
    if (b.tipo === 'leccion') {
      const pasos = pasosDe(L, b, data);
      if (pasos === false) { quitar(b, 'vista'); continue; }
      const previos = cubiertos.get(L.id);
      if (previos !== 'todos') cubiertos.set(L.id, pasos ? new Set([...(previos ?? []), ...pasos]) : 'todos');
      bloques.push({ tipo: 'leccion', leccion: L.id, pasos, ...comun(b) });
      continue;
    }
    const items = itemsDePractica(L, b, { data, modelo, ahora, usados, cubiertos, lecciones });
    if (!items.length) { quitar(b, 'sin-preguntas'); continue; }
    items.forEach((x) => usados.add(x));
    bloques.push({ tipo: 'practica', leccion: L.id, items, ...comun(b), minutos: Math.min(b.minutos, Math.max(1, Math.ceil(items.length * MIN_POR_PREGUNTA))) });
  }
  return { bloques, quitados };
}

/**
 * Los pasos de una lección en un bloque: null (entera), los primeros que caben en sus minutos ('inicio') o, desde el
 * primero sin ver, los que caben ('continuar'). false si ya se vio entera y se pidió continuar.
 */
function pasosDe(L, b, data) {
  const ids = L.pasos.map((p) => p.id);
  if (b.parte === 'entera' || !ids.length) return null;
  const porPaso = (L.minutos > 0 ? L.minutos : ids.length * 2) / ids.length;
  const k = acotar(Math.round(b.minutos / porPaso), 1, ids.length);
  let desde = 0;
  if (b.parte === 'continuar') {
    const vistos = new Set(data?.lecciones?.[L.id]?.vistos ?? []);
    desde = ids.findIndex((id) => !vistos.has(id));
    if (desde < 0) return false;
  }
  const pasos = ids.slice(desde, desde + k);
  return pasos.length === ids.length ? null : pasos;
}

/** Lo vencido para un bloque de repaso: primero lo del tema y de las lecciones del plan; sin repetir lo recién fallado. */
async function itemsDeRepaso(b, { data, modelo, ahora, idsLecciones, prioridad, usados, traer, lecciones }) {
  const n = acotar(Math.floor(b.minutos / MIN_POR_PREGUNTA), 1, MAX_ITEMS_BLOQUE);
  const existe = (id) => (idsLecciones ? idsLecciones.has(id) : ID_LECCION.test(id));
  const vencidas = P.vencidas(data, { ahora: ahora(), filtro: (id) => existe(leccionDeItem(id)) && !usados.has(id) });
  // (Orden estable: lo del tema primero, luego lo demás, cada grupo en el orden del repaso.)
  const candidatos = [...vencidas.filter((id) => prioridad.has(leccionDeItem(id))), ...vencidas.filter((id) => !prioridad.has(leccionDeItem(id)))].slice(0, n * 2);
  for (const id of candidatos) await traer(leccionDeItem(id));
  const posibles = candidatos.filter((id) => {
    const L = lecciones.get(leccionDeItem(id));
    const q = L?.preguntas?.find((x) => x.id === id.slice(id.indexOf('/') + 1));
    return !!q && disponibleEn(L, q, modelo);
  });
  const { items } = sinRepetirRecientes(posibles, { data, lecciones, modelo, ahora: ahora() });
  return items.filter((x) => !usados.has(x)).slice(0, n);
}

/**
 * Preguntas para practicar una lección: las que se pueden hacer en este modelo y tratan lo que ya se vio (o lo que la
 * sesión enseña antes); primero lo vencido, luego lo fallado y lo nuevo, mezclando tipos de tarea; sin repetir lo
 * recién fallado.
 */
function itemsDePractica(L, b, { data, modelo, ahora, usados, cubiertos, lecciones }) {
  const n = acotar(Math.floor(b.minutos / MIN_POR_PREGUNTA), 2, MAX_ITEMS_PRACTICA);
  const enSesion = cubiertos.get(L.id);
  const vistos = data?.lecciones?.[L.id]?.completada ? 'todos' : new Set(data?.lecciones?.[L.id]?.vistos ?? []);
  // Qué pasos se pueden preguntar: lo visto y lo que se enseña en la sesión; sin nada de eso, toda la lección.
  const todos = enSesion === 'todos' || vistos === 'todos' || (!enSesion && !vistos.size);
  const permitidos = todos ? null : new Set([...(enSesion ?? []), ...vistos]);
  const preguntas = (L.preguntas ?? []).filter((q) => disponibleEn(L, q, modelo) && (!permitidos || !q.paso || permitidos.has(q.paso)));
  const ahoraMs = ahora();
  const grupo = (q) => {
    const e = data?.items?.[P.itemId(L.id, q.id)];
    if (!e) return 2;                                          // nueva
    if (e.proximo != null && e.proximo <= ahoraMs) return 0;    // vencida
    return e.fallos > 0 && e.caja < P.CAJA_DOMINIO ? 1 : 3;    // fallada sin consolidar, o ya sabida
  };
  const ordenadas = [0, 1, 2, 3].flatMap((g) => intercalar(preguntas.filter((q) => grupo(q) === g)));
  const ids = ordenadas.map((q) => P.itemId(L.id, q.id)).filter((x) => !usados.has(x));
  const { items } = sinRepetirRecientes(ids, { data, lecciones, modelo, ahora: ahoraMs });
  return items.filter((x) => !usados.has(x)).slice(0, n);
}

/** Mezcla los tipos de tarea (identificar, relacionar, localizar…) en vez de dejarlos agrupados como en el banco. */
function intercalar(preguntas) {
  const porTipo = new Map();
  for (const q of preguntas) { if (!porTipo.has(q.tipo)) porTipo.set(q.tipo, []); porTipo.get(q.tipo).push(q); }
  const colas = [...porTipo.values()];
  const out = [];
  while (colas.some((c) => c.length)) for (const c of colas) if (c.length) out.push(c.shift());
  return out;
}

// ── Formas ──

/** Una clave de texto de la app: { clave, datos } con datos sencillos. Null si no sirve. */
function claveValida(c) {
  if (!c || typeof c !== 'object' || typeof c.clave !== 'string' || !CLAVE_TEXTO.test(c.clave)) return null;
  const datos = {};
  for (const [k, v] of Object.entries(c.datos ?? {})) {
    if (/^[a-zA-Z]{1,20}$/.test(k) && (typeof v === 'number' || typeof v === 'string')) datos[k] = typeof v === 'string' ? v.slice(0, 160) : v;
  }
  return { clave: c.clave, datos };
}

/** Los textos de la sesión como claves (título, mensaje, objetivo), si los puso la app. */
function textosValidos(t) {
  if (!t || typeof t !== 'object') return null;
  const out = {};
  for (const k of ['titulo', 'mensaje', 'objetivo']) { const c = claveValida(t[k]); if (c) out[k] = c; }
  return Object.keys(out).length ? out : null;
}

/** El segundo intento pendiente de la pregunta `n` ({ n, quitada: índice de opción o null }), o null. */
function limpiarIntento(i, n) {
  if (!i || typeof i !== 'object' || i.n !== n || !Number.isInteger(n)) return null;
  return { n: Math.min(n, 999), quitada: Number.isInteger(i.quitada) && i.quitada >= 0 && i.quitada < 20 ? i.quitada : null };
}

/** El resultado de un bloque, recortado. */
function limpiarResultado(r, bloque, cuando) {
  const total = contar(r?.total);
  const out = {
    bloque, cuando, aciertos: Math.min(contar(r?.aciertos), total || Infinity), total,
    conAyuda: contar(r?.conAyuda), revelados: contar(r?.revelados), saltado: r?.saltado === true,
  };
  if (out.saltado) out.motivo = r?.motivo === 'perdido' ? 'perdido' : 'persona';
  const fallos = Array.isArray(r?.fallos) ? [...new Set(r.fallos.filter((x) => typeof x === 'string' && ID_ITEM.test(x)))].slice(0, MAX_ITEMS_BLOQUE) : [];
  if (fallos.length) out.fallos = fallos;
  return out;
}

const listaDe = (l, ok) => Array.isArray(l) && l.length <= MAX_ITEMS_BLOQUE && l.every(ok);
/** ¿Tiene la forma de un bloque guardado? */
function bloqueValido(b) {
  if (!b || typeof b !== 'object' || !TIPOS_BLOQUE.includes(b.tipo) || !Number.isInteger(b.minutos) || b.minutos < 1 || b.minutos > LIMITES.minutosBloque) return false;
  const item = (x) => typeof x === 'string' && ID_ITEM.test(x);
  if (b.tipo === 'repaso') return listaDe(b.items, item);
  if (typeof b.leccion !== 'string' || !ID_LECCION.test(b.leccion)) return false;
  if (b.tipo === 'practica') return listaDe(b.items, item);
  return b.pasos === null || (Array.isArray(b.pasos) && b.pasos.length >= 1 && b.pasos.length <= 200 && b.pasos.every((x) => typeof x === 'string' && x.length <= 60));
}

/** ¿Tiene la forma de una sesión? (lo guardado puede venir de otra versión o estar dañado). */
export function sesionValida(S) {
  return !!S && typeof S === 'object' && typeof S.id === 'string' && ID_SESION.test(S.id) && ESTADOS_SESION.includes(S.estado)
    && typeof S.titulo === 'string' && Array.isArray(S.bloques) && S.bloques.length >= 1 && S.bloques.length <= LIMITES.bloquesSesion
    && S.bloques.every(bloqueValido) && Number.isInteger(S.i) && S.i >= 0 && S.i <= S.bloques.length
    && Array.isArray(S.resultados) && S.resultados.every((r) => r && Number.isInteger(r.bloque) && r.bloque >= 0 && r.bloque < S.bloques.length);
}

/** ¿Se ha hecho algo en ella? (algún bloque terminado o saltado, o una posición dentro del bloque). */
const conAvance = (S) => S.resultados.some((r) => !(r.saltado && r.motivo === 'perdido')) || !!S.posicion;

/**
 * Como mucho MAX_SESIONES. Se quitan, por este orden y de la más antigua a la más nueva: las planificadas sin empezar
 * (no se pierde nada hecho), las finalizadas (su progreso sigue en la biblioteca) y, solo si aún sobran, las que tienen
 * algo hecho y no están en curso (pausadas o planificadas con avance). Nunca la activa ni `proteger` (la recién creada).
 * Devuelve { lista, fuera } (fuera: las quitadas).
 */
function podar(lista, proteger = null) {
  if (lista.length <= MAX_SESIONES) return { lista, fuera: [] };
  const viejas = (ok) => lista.filter((S) => S !== proteger && S.estado !== 'activa' && ok(S)).sort((a, b) => (a.actualizada ?? 0) - (b.actualizada ?? 0));
  const fuera = new Set();
  const orden = [
    ...viejas((S) => S.estado === 'planificada' && !conAvance(S)),
    ...viejas((S) => S.estado === 'finalizada'),
    ...viejas((S) => S.estado === 'pausada' || (S.estado === 'planificada' && conAvance(S))),
  ];
  for (const S of orden) {
    if (lista.length - fuera.size <= MAX_SESIONES) break;
    fuera.add(S);
  }
  return { lista: lista.filter((S) => !fuera.has(S)), fuera: [...fuera] };
}

/**
 * Importa sesiones (del archivo «Mis datos» de otro navegador): se añaden las que no hay, sin tocar las que ya están
 * (el mismo identificador no se sobrescribe) y sin pasar de MAX_SESIONES. Una sesión activa allí llega pausada.
 * Devuelve { ok, añadidas, iguales, invalidas, sinSitio, error? }.
 */
export function importarSesiones(almacen, datos) {
  const r = { ok: false, añadidas: 0, iguales: 0, invalidas: 0, sinSitio: 0 };
  const entrada = Array.isArray(datos?.sesiones) && datos.formato === FORMATO_SESIONES ? datos.sesiones : Array.isArray(datos) ? datos : null;
  if (!entrada) return { ...r, error: 'formato' };
  const leido = leer(almacen);
  const lista = [...leido.lista];
  for (const S of entrada) {
    if (!sesionValida(S)) { r.invalidas++; continue; }
    if (lista.some((x) => x.id === S.id)) { r.iguales++; continue; }
    if (lista.length >= MAX_SESIONES) { r.sinSitio++; continue; }
    lista.push({ ...S, estado: S.estado === 'activa' ? 'pausada' : S.estado });
    r.añadidas++;
  }
  if (!r.añadidas) return { ...r, ok: true };
  try {
    if (leido.apartar.length && !apartarTextos(almacen, leido.apartar, Date.now)) return { ...r, añadidas: 0, error: 'apartar' };
    almacen.setItem(CLAVE_SESIONES, JSON.stringify({ formato: FORMATO_SESIONES, version: VERSION_SESIONES, sesiones: lista.sort((a, b) => (b.actualizada ?? 0) - (a.actualizada ?? 0)) }));
    return { ...r, ok: true };
  } catch { return { ...r, añadidas: 0, error: 'almacenamiento' }; }
}

/** Cuántas sesiones hay guardadas (las que se pueden leer). */
export const contarSesiones = (almacen) => leer(almacen).lista.length;

/** Las sesiones guardadas: { lista (las que se pueden usar), apartar (textos de lo que no se puede leer) }. */
function leer(almacen) {
  let crudo;
  try { crudo = almacen?.getItem(CLAVE_SESIONES) ?? null; } catch { return { lista: [], apartar: [] }; }
  if (crudo == null) return { lista: [], apartar: [] };
  let d;
  try { d = JSON.parse(crudo); } catch { return { lista: [], apartar: [crudo] }; }
  // Otro formato o una versión más nueva: esta versión no lo sabe leer; se aparta entero (sin perderlo).
  if (!d || typeof d !== 'object' || d.formato !== FORMATO_SESIONES || !Array.isArray(d.sesiones) || !(d.version >= 1 && d.version <= VERSION_SESIONES)) return { lista: [], apartar: [crudo] };
  const lista = [];
  const apartar = [];
  for (const S of d.sesiones) {
    if (!sesionValida(S) || lista.some((x) => x.id === S.id)) { apartar.push(JSON.stringify(S)); continue; }
    lista.push(S);
  }
  // Solo una activa (dos pestañas pudieron dejar dos): la más reciente.
  const activas = lista.filter((S) => S.estado === 'activa').sort((a, b) => (b.actualizada ?? 0) - (a.actualizada ?? 0));
  for (const S of activas.slice(1)) S.estado = 'pausada';
  return { lista, apartar };
}

function leerApartados(almacen) {
  let crudo = null;
  try { crudo = almacen?.getItem(CLAVE_SESIONES_APARTADAS) ?? null; } catch { return []; }
  if (crudo == null) return [];
  try { const d = JSON.parse(crudo); return Array.isArray(d) ? d : [{ texto: crudo, apartado: null }]; } catch { return [{ texto: crudo, apartado: null }]; }
}

/** Pone a salvo, tal cual, lo que no se pudo leer (sin repetir). False si no se pudo (o si ya hay demasiado apartado). */
function apartarTextos(almacen, textos, ahora) {
  try {
    const ya = leerApartados(almacen);
    const vistos = new Set(ya.map((x) => x?.texto));
    const nuevos = textos.filter((t) => !vistos.has(t)).map((t) => ({ texto: t, apartado: new Date(ahora()).toISOString() }));
    if (!nuevos.length) return true;
    const todos = [...ya, ...nuevos];
    if (todos.length > MAX_APARTADAS) return false;
    almacen.setItem(CLAVE_SESIONES_APARTADAS, JSON.stringify(todos));
    return true;
  } catch { return false; }
}
