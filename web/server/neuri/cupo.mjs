// Cupo diario de Neuri por dispositivo: cuántas preguntas con IA y cuántas creaciones de lección puede pedir cada
// dispositivo al día (lo demás de «Estudiar», el buscador, las sesiones locales y el repaso, no cuenta nunca).
//
// - Qué cuenta (server/pet.mjs): «preguntas», toda petición que acaba llamando a Claude en orientar, sesion o al
//   planificar un recorrido (una por petición aunque haga una comprobación interna); «creaciones», planificar una lección
//   o una unidad de un recorrido (la creación se cobra ahí, ligada a su trabajo y a su plan) o redactar o adaptar un plan
//   que no se cobró al planificar (una por trabajo, nunca al reanudarlo, y nunca dos veces el mismo trabajo o plan).
// - Cuándo se devuelve: solo lo que no se cobró en el tope de gasto (server/neuri/modelo.mjs): si la llamada no llegó a
//   salir, o si la API la rechazó sin procesarla (un 4xx). Un corte, un 5xx, un plazo o una cancelación a mitad cuentan
//   enteros en el tope, y aquí también.
// - Quién: el identificador aleatorio que la app guarda en su navegador y manda en la cabecera «x-anato3d-dispositivo»
//   (src/pet/protocolo.js, ID_DISPOSITIVO). Sin cabecera válida, la dirección IP. Además hay un tope por IP muy superior
//   (un aula detrás de un router comparte IP; un dispositivo que se inventa identificadores no pasa de él). La IP se
//   cuenta normalizada (server/neuri/ip.mjs): una IPv6, por su /64; una IPv4 dentro de IPv6, como IPv4.
// - Privacidad, exactamente: el archivo solo guarda números y claves HMAC-SHA256 (recortadas a 128 bits) del
//   identificador o de la IP, una por día. La clave del HMAC no está en el archivo: sale de ANATO3D_CUPO_SAL (un secreto
//   del alojamiento, 16 caracteres o más) y del día; sin ella, de una sal aleatoria de cada día que solo vive en memoria
//   (entonces, al reiniciar el proceso, los contadores de ese día vuelven a empezar, y lo dice el registro). Con el
//   archivo solo no se puede recuperar ninguna IP ni ningún identificador probando; con el archivo y el secreto, sí se
//   podrían probar las IPv4 (son pocas): por eso el secreto va como secreto. Mientras atiende una petición, el proceso sí
//   tiene en memoria la IP y el identificador (los necesita para contar); el identificador no va al modelo ni al registro.
// - Días: el de la zona del tope de gasto (America/Tijuana por defecto); a medianoche empieza otro y los viejos se podan.
// - Durable: el mismo directorio de datos, la misma escritura atómica y el mismo cerrojo con el PID que el tope de gasto
//   (server/neuri/presupuesto.mjs). Dentro de un proceso, todos los cupos del mismo archivo comparten un solo estado (el
//   servidor de desarrollo rehace su configuración sin reiniciarse). Sin directorio escribible, funciona en memoria y lo
//   dice el registro; con otro proceso vivo con el mismo archivo, no deja gastar (dos procesos no cuentan cada uno).
import fs from 'node:fs';
import path from 'node:path';
import { createHmac, randomBytes } from 'node:crypto';
import { escribirEstado, tomarCerrojo, soltarCerrojo, procesoVivo, periodos, siguientePeriodo, ErrorPresupuesto } from './presupuesto.mjs';
import { ID_DISPOSITIVO } from '../../src/pet/protocolo.js';
import { normalizarIp } from './ip.mjs';

export const CABECERA_DISPOSITIVO = 'x-anato3d-dispositivo';
/** Lo que se permite al día, por dispositivo y por IP (configurable: cupoDesdeEntorno). */
export const CUPO_POR_DEFECTO = { preguntas: 30, creaciones: 3, ipPreguntas: 300, ipCreaciones: 30 };
export const TIPOS_CUPO = ['preguntas', 'creaciones'];
const CAMPO = { preguntas: 'p', creaciones: 'c' };
// Versión 2: sin la sal en el archivo (la 1 la guardaba dentro; al abrir una de esas, se empieza de cero sin ella).
const VERSION = 2;
/** El secreto de ANATO3D_CUPO_SAL: al menos 16 caracteres. */
export const MIN_SAL = 16;
const MAX_CLAVES = 100_000;            // claves de un día (cada una, un dispositivo o una IP con algo gastado)

/** El identificador del dispositivo de una petición (cabecera), o null si falta o no tiene la forma: entonces cuenta la IP. */
export function dispositivoDe(request) {
  const v = request?.headers?.get?.(CABECERA_DISPOSITIVO);
  return typeof v === 'string' && ID_DISPOSITIVO.test(v) ? v : null;
}

const vacio = (zona) => ({ v: VERSION, zona, dias: {} });

// Los cupos abiertos en este proceso (archivo y PID → estado compartido), como los presupuestos.
const ABIERTOS = (globalThis[Symbol.for('anato3d.cupos')] ??= (() => {
  const m = new Map();
  process.once('exit', () => { for (const a of m.values()) if (a.cerrojo) soltarCerrojo(a.cerrojo, a.pid); });
  return m;
})());

function leerEstado(archivo, zona, registro) {
  let crudo;
  try { crudo = fs.readFileSync(archivo, 'utf8'); } catch (err) {
    if (err.code === 'ENOENT') return vacio(zona);
    throw err;
  }
  let d = null;
  try { d = JSON.parse(crudo); } catch { /* dañado */ }
  if (d?.v === VERSION && d.dias && typeof d.dias === 'object' && !Array.isArray(d.dias)) { delete d.sal; return d; }
  // De la versión 1 (con la sal dentro): sus claves no se pueden volver a calcular sin aquella sal, que no se conserva.
  // Se empieza de cero (se escribe encima al abrir: la sal vieja desaparece del disco).
  if (d?.v === 1 && d.dias && typeof d.dias === 'object') {
    registro.info?.('[cupo] El archivo del cupo era de la versión anterior (con la sal dentro): se empieza de cero, sin ella.');
    return vacio(zona);
  }
  // Dañado o de otra versión: se aparta (no se pisa) y se empieza de cero. Son contadores del día, no datos de nadie.
  const apartado = `${archivo}.danado-${Date.now()}`;
  try { fs.renameSync(archivo, apartado); } catch { /* si no se puede apartar, se escribirá encima */ }
  registro.error?.(`[cupo] El archivo del cupo estaba dañado: se apartó (${path.basename(apartado)}) y se empieza de cero.`);
  return vacio(zona);
}

function abrir(archivo, { zona, pid, vivo, registro }) {
  const clave = archivo ? `${path.resolve(archivo)}|${pid}` : null;
  const abierto = clave && ABIERTOS.get(clave);
  if (abierto) { abierto.refs++; return abierto; }
  const a = { clave, archivo, cerrojo: null, pid, estado: null, persistente: false, bloqueado: false, refs: 1, sales: new Map() };
  if (archivo) {
    try {
      fs.mkdirSync(path.dirname(archivo), { recursive: true });
      tomarCerrojo(`${archivo}.lock`, pid, vivo);
      a.cerrojo = `${archivo}.lock`;
      a.estado = leerEstado(archivo, zona, registro);
      escribirEstado(archivo, a.estado);
      a.persistente = true;
    } catch (err) {
      if (a.cerrojo) { soltarCerrojo(a.cerrojo, pid); a.cerrojo = null; }
      a.estado = null;
      if (err instanceof ErrorPresupuesto && err.codigo === 'otro-proceso') {
        a.bloqueado = true;
        registro.error?.('[cupo] Otro proceso tiene abierto el cupo diario: este no deja gastar preguntas ni creaciones (una sola instancia).');
      } else {
        registro.error?.(`[cupo] Sin directorio de datos escribible (${err?.code ?? err?.codigo ?? 'error'}): el cupo diario funciona en memoria y se pierde al reiniciar.`);
      }
    }
  }
  a.estado ??= vacio(zona);
  if (clave && !a.bloqueado) ABIERTOS.set(clave, a);
  return a;
}

/**
 * El cupo de un proceso. `archivo`: dónde se guarda (null: en memoria). `limites`: { preguntas, creaciones, ipPreguntas,
 * ipCreaciones } al día. `zona`: la del día. `sal`: el secreto del HMAC (ANATO3D_CUPO_SAL, 16 caracteres o más; sin él,
 * una sal aleatoria por día, solo en memoria). `pid` y `vivo(pid)`: como el tope de gasto (las pruebas los cambian).
 * Las operaciones son síncronas: dentro de un proceso, nadie se cuela entre mirar y gastar.
 */
export function crearCupo({
  archivo = null, limites = {}, zona = 'America/Tijuana', ahora = Date.now, registro = console, pid = process.pid, vivo = procesoVivo,
  sal = null,
} = {}) {
  const L = { ...CUPO_POR_DEFECTO, ...limites };
  const a = abrir(archivo, { zona, pid, vivo, registro });
  let cerrado = false;
  let avisado = false;
  const secreto = typeof sal === 'string' && sal.trim().length >= MIN_SAL ? sal.trim() : null;
  if (sal != null && String(sal).trim() && !secreto) registro.error?.(`[cupo] ANATO3D_CUPO_SAL tiene menos de ${MIN_SAL} caracteres: se ignora.`);
  if (!secreto && archivo && !a.bloqueado) {
    registro.error?.('[cupo] Sin ANATO3D_CUPO_SAL: las claves del cupo usan una sal aleatoria de cada día que solo vive en memoria; al reiniciar el servidor, los contadores del día vuelven a empezar.');
  }

  /** La clave del HMAC de un día: del secreto y el día, o (sin secreto) la sal aleatoria de ese día en este proceso. */
  function salDe(dia) {
    if (secreto) return createHmac('sha256', secreto).update(`anato3d-cupo|${dia}`).digest();
    for (const k of a.sales.keys()) if (k < dia) a.sales.delete(k);
    if (!a.sales.has(dia)) a.sales.set(dia, randomBytes(32));
    return a.sales.get(dia);
  }
  /**
   * Las dos claves de quien pide en un día: la del dispositivo (o la de su IP, si no manda uno válido) y la de su IP
   * (normalizada: la /64 de una IPv6).
   */
  function claves({ dispositivo = null, ip = '' } = {}, dia) {
    const k = salDe(dia);
    const hmac = (s) => createHmac('sha256', k).update(s).digest('hex').slice(0, 32);
    const d = typeof dispositivo === 'string' && ID_DISPOSITIVO.test(dispositivo) ? dispositivo : null;
    const dir = normalizarIp(ip);
    return { quien: hmac(d ? `d:${d}` : `n:${dir}`), ip: hmac(`i:${dir}`) };
  }
  /** Las cuentas de hoy (y fuera las de días anteriores). */
  function hoy() {
    const t = ahora();
    const { dia } = periodos(t, zona);
    for (const k of Object.keys(a.estado.dias)) if (k < dia) delete a.estado.dias[k];
    a.estado.dias[dia] ??= {};
    return { dia, cuentas: a.estado.dias[dia], renueva: siguientePeriodo(t, zona, 'dia'), t };
  }
  function guardar() {
    if (!a.persistente) return;
    try { escribirEstado(a.archivo, a.estado); } catch (err) {
      // Sin poder escribir, sigue en memoria (y lo dice una vez): el tope de gasto es el que manda en el dinero.
      if (!avisado) { avisado = true; registro.error?.(`[cupo] No se pudo guardar el cupo diario (${err?.code ?? 'error'}): sigue en memoria.`); }
    }
  }
  const usadas = (cuentas, k, de) => cuentas[k]?.[CAMPO[de]] ?? 0;
  function contador(cuentas, c, de) {
    const limite = L[de];
    const n = usadas(cuentas, c.quien, de);
    const ipLibres = L[de === 'preguntas' ? 'ipPreguntas' : 'ipCreaciones'] - usadas(cuentas, c.ip, de);
    const quedan = a.bloqueado ? 0 : Math.max(0, Math.min(limite - n, ipLibres));
    return { limite, usadas: Math.min(n, limite), quedan };
  }
  function foto(cuentas, c, renueva) {
    return { preguntas: contador(cuentas, c, 'preguntas'), creaciones: contador(cuentas, c, 'creaciones'), renueva: new Date(renueva).toISOString() };
  }

  const api = {
    activo: true,
    get persistente() { return a.persistente; },
    get bloqueado() { return a.bloqueado; },
    limites: { ...L },
    /** El cupo de quien pide ({ dispositivo, ip }), sin gastar nada: { preguntas, creaciones, renueva } (protocolo). */
    consultar(quien) {
      const { dia, cuentas, renueva } = hoy();
      return foto(cuentas, claves(quien, dia), renueva);
    },
    /**
     * Gasta una unidad de `de` ('preguntas' o 'creaciones'). Devuelve { ok: true, cupo, ficha } (la ficha sirve para
     * devolverla) o { ok: false, de, cupo, espera } (ms hasta que se renueva).
     */
    gastar(quien, de) {
      if (!TIPOS_CUPO.includes(de)) throw new Error(`cupo desconocido: ${de}`);
      const { dia, cuentas, renueva, t } = hoy();
      const c = claves(quien, dia);
      const actual = foto(cuentas, c, renueva);
      const nuevas = [c.quien, c.ip].filter((k) => !cuentas[k]).length;
      if (cerrado || actual[de].quedan < 1 || Object.keys(cuentas).length + nuevas > MAX_CLAVES) return { ok: false, de, cupo: actual, espera: Math.max(1000, renueva - t) };
      for (const k of [c.quien, c.ip]) {
        cuentas[k] ??= {};
        cuentas[k][CAMPO[de]] = (cuentas[k][CAMPO[de]] ?? 0) + 1;
      }
      guardar();
      return { ok: true, cupo: foto(cuentas, c, renueva), ficha: { dia, de, claves: [c.quien, c.ip], devuelta: false } };
    },
    /** Devuelve lo gastado con una ficha (una vez; si ya cambió el día, no hay nada que devolver). */
    devolver(ficha) {
      if (!ficha || ficha.devuelta) return false;
      ficha.devuelta = true;
      const { dia, cuentas } = hoy();
      if (ficha.dia !== dia) return false;
      for (const k of ficha.claves) {
        const x = cuentas[k];
        if (!x?.[CAMPO[ficha.de]]) continue;
        x[CAMPO[ficha.de]]--;
        if (!x.p && !x.c) delete cuentas[k];
      }
      guardar();
      return true;
    },
    /** Lo que hay hoy, sin claves: { dia, claves, persistente, bloqueado, limites }. */
    resumen() {
      const { dia, cuentas } = hoy();
      return { dia, claves: Object.keys(cuentas).length, persistente: a.persistente, bloqueado: a.bloqueado, limites: { ...L } };
    },
    /** Lo deja (al cerrar el proceso o rehacer la configuración): el último en dejarlo suelta el cerrojo. */
    cerrar() {
      if (cerrado) return;
      cerrado = true;
      if (--a.refs > 0 || !a.clave || ABIERTOS.get(a.clave) !== a) return;
      ABIERTOS.delete(a.clave);
      if (a.cerrojo) soltarCerrojo(a.cerrojo, a.pid);
    },
  };
  return api;
}

/** Un número entero ≥ 0 de una variable de entorno, o null si no es válido. */
const enteroDe = (s) => (s != null && /^\s*\d{1,6}\s*$/.test(String(s)) ? Number(String(s).trim()) : null);

/**
 * El cupo con la configuración del entorno, o null si está apagado (ANATO3D_CUPO=0). `dir`: el directorio de datos (el
 * del tope de gasto). ANATO3D_CUPO_PREGUNTAS y ANATO3D_CUPO_CREACIONES: por dispositivo y día (30 y 3). ANATO3D_CUPO_IP:
 * por IP y día, «preguntas/creaciones» (300/30); un solo número son las preguntas y una décima parte, las creaciones.
 * ANATO3D_CUPO_SAL: el secreto del HMAC (16 caracteres o más; en Fly, con `fly secrets set`).
 */
export function cupoDesdeEntorno(env, { dir, registro = console, ahora = Date.now, zona = 'America/Tijuana' } = {}) {
  if (String(env.ANATO3D_CUPO ?? '').trim() === '0') return null;
  const L = { ...CUPO_POR_DEFECTO };
  const avisar = (k) => registro.error?.(`[cupo] ${k} no es un número válido: se usa el valor por defecto.`);
  for (const [k, campo] of [['ANATO3D_CUPO_PREGUNTAS', 'preguntas'], ['ANATO3D_CUPO_CREACIONES', 'creaciones']]) {
    if (!String(env[k] ?? '').trim()) continue;
    const n = enteroDe(env[k]);
    if (n == null) avisar(k); else L[campo] = n;
  }
  const ip = String(env.ANATO3D_CUPO_IP ?? '').trim();
  if (ip) {
    const m = ip.match(/^(\d{1,6})(?:\s*\/\s*(\d{1,6}))?$/);
    if (!m) avisar('ANATO3D_CUPO_IP');
    else { L.ipPreguntas = Number(m[1]); L.ipCreaciones = m[2] != null ? Number(m[2]) : Math.ceil(Number(m[1]) / 10); }
  }
  // El tope por IP nunca por debajo del de un dispositivo (si no, el de un dispositivo no se alcanzaría nunca).
  L.ipPreguntas = Math.max(L.ipPreguntas, L.preguntas);
  L.ipCreaciones = Math.max(L.ipCreaciones, L.creaciones);
  return crearCupo({ archivo: dir ? path.join(dir, 'cupo.json') : null, limites: L, zona, registro, ahora, sal: env.ANATO3D_CUPO_SAL ?? null });
}
