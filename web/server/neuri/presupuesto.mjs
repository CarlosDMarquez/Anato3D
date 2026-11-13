// Tope de gasto de Neuri. Antes de cada llamada a Claude se reserva lo más que podría costar; al responder, se ajusta a
// lo que costó de verdad. Sin presupuesto (cero, sin configurar o mal escrito) no sale ninguna llamada, aunque haya clave.
//
// - Unidades: nanodólares enteros (1 US$ = 1 000 000 000 n$), sin errores de redondeo.
// - Tarifas: lista de Anthropic consultada el 2026-11-11 (precios por millón de tokens):
//   · Claude Haiku 5.5: 0,10 de entrada y 0,50 de salida con peticiones de hasta 100 000 tokens; por encima, 0,50 y 2,50;
//   · Claude Sonnet 5.5: 2 y 10;
//   · leer de la caché cuesta 0,1 veces la entrada y escribir en ella (5 min), 1,25 veces.
// - Reserva conservadora:
//   · cada token es al menos un byte, así que los de entrada no pueden ser más que los bytes UTF-8 de lo que se envía (más
//     un margen fijo);
//   · calibrada: la parte fija (instrucciones y catálogo, unos 112 000 caracteres) es igual en todas las llamadas de un
//     modelo. Cualquier respuesta dice cuántos tokens de entrada tuvo su petición en total (lo nuevo, lo leído y lo
//     escrito en la caché), y ese total nunca es menor que los de la parte fija. Así que, cuando ya hay una, la cota es
//     «el menor total visto con esa misma parte fija + los bytes de lo demás + el margen» (la menor de las dos cotas). La
//     parte fija se reconoce por su huella (SHA-256 del modelo y el texto): si cambia, se vuelve a la cota de bytes;
//   · se cobran todos al precio de entrada más caro (escribir en la caché de 5 minutos, la única que pide Neuri), y del
//     tramo alto si pudieran pasar de 100 000;
//   · la salida, `max_tokens` entero (el razonamiento va dentro) al precio de salida de ese tramo.
// - Ajuste: con `usage`, el coste real (sin contar dos veces el desglose del SDK). Sin `usage` (un corte, un error a
//   mitad), no se sabe: la reserva queda «incierta» y cuenta entera. Solo se libera lo que seguro no llegó a Anthropic
//   (una petición que la API rechazó con un 4xx).
// - Periodos: el día y el mes en la zona horaria del presupuesto (America/Tijuana por defecto, la de Mexicali).
// - Durable: un archivo JSON con escritura atómica (temporal + rename) y un cerrojo con el PID, para que no haya dos
//   procesos con su propio saldo. Si el archivo no se puede leer o escribir, o hay otro proceso vivo, la IA no gasta y
//   «Estudiar» sigue con el buscador. Dentro de un proceso, todos los presupuestos del mismo archivo comparten un solo
//   estado (el servidor de desarrollo rehace su configuración sin reiniciar el proceso).
// - Al arrancar, las reservas que quedaron a medias (el proceso murió con una llamada en curso) pasan a «inciertas»:
//   cuentan enteras hasta que alguien las resuelva con la cifra de la consola de Anthropic (scripts/presupuesto.mjs).
// - El registro y el archivo llevan cifras, periodos, modelo, etiqueta del modo y estado técnico: nunca texto de nadie.
import fs from 'node:fs';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';

export const NANO = 1_000_000_000;
export const FECHA_TARIFAS = '2026-11-11';
const MARGEN_TOKENS = 2_000;          // formato de la API, herramientas internas, el esquema compilado…
/**
 * n$ por token. `alto`: el tramo de más de `umbral` tokens de entrada. `escribir`: la caché de 5 minutos (1,25 veces la
 * entrada); `escribir1h`: la de 1 hora (2 veces), que Neuri no pide, por si `usage` la trae en su desglose.
 */
export const TARIFAS = {
  'claude-haiku-5-5': { entrada: 100, salida: 500, leer: 10, escribir: 125, escribir1h: 200, umbral: 100_000, alto: { entrada: 500, salida: 2_500, leer: 50, escribir: 625, escribir1h: 1_000 } },
  'claude-sonnet-5-5': { entrada: 2_000, salida: 10_000, leer: 100, escribir: 2_500, escribir1h: 4_000 },
};
const MAX_USD = 10_000;               // un tope mayor es casi seguro un error al escribirlo
const MAX_HISTORIAL = 300;
const MAX_CALIBRACION = 50;
const VERSION = 1;

export class ErrorPresupuesto extends Error {
  constructor(codigo, detalle = '') {
    super(detalle || codigo);
    this.codigo = codigo;             // sin-presupuesto (cero o sin configurar), tope-dia, tope-mes, apagado, almacen, otro-proceso
  }
}

/** «0.50», «1», «20,00» → n$ enteros; null si no es un número válido entre 0 y 10 000. */
export function usdANano(texto) {
  if (texto === undefined || texto === null) return null;
  const s = String(texto).trim().replace(',', '.');
  if (!/^\d+(\.\d{1,6})?$/.test(s)) return null;
  const v = Number(s);
  if (!Number.isFinite(v) || v < 0 || v > MAX_USD) return null;
  return Math.round(v * NANO);
}
export const nanoAUsd = (n) => (n / NANO).toFixed(4);

/**
 * Lo más que puede costar una llamada. `bytes`: los de todo lo que se envía; `maxTokens`: la salida máxima. Con `base`
 * (el menor total de tokens de entrada visto con la misma parte fija) y `bytesResto` (los bytes de todo lo demás), la
 * cota calibrada, si es menor.
 */
export function cotaReserva(modelo, { bytes, maxTokens, base = null, bytesResto = null }) {
  const t = TARIFAS[modelo];
  if (!t) throw new ErrorPresupuesto('modelo', `sin tarifa para ${modelo}`);
  let entrada = Math.max(0, Math.ceil(bytes)) + MARGEN_TOKENS;
  if (Number.isInteger(base) && base > 0 && Number.isFinite(bytesResto)) entrada = Math.min(entrada, base + Math.max(0, Math.ceil(bytesResto)) + MARGEN_TOKENS);
  const p = t.umbral && entrada > t.umbral ? t.alto : t;
  return entrada * Math.max(p.entrada, p.escribir, p.leer) + Math.max(0, Math.ceil(maxTokens)) * p.salida;
}

const n0 = (x) => (Number.isFinite(x) && x > 0 ? Math.ceil(x) : 0);
/** Los tokens de entrada de una petición, en total: lo nuevo, lo leído de la caché y lo escrito en ella. */
export const entradaTotal = (u) => n0(u?.input_tokens) + n0(u?.cache_read_input_tokens) + n0(u?.cache_creation_input_tokens);

/**
 * Lo que costó de verdad según `usage`, o null sin él. input_tokens no incluye lo leído ni lo escrito en la caché; el
 * desglose de lo escrito (cache_creation: 5 minutos y 1 hora) es parte de cache_creation_input_tokens y no se suma aparte.
 */
export function costeReal(modelo, u) {
  const t = TARIFAS[modelo];
  if (!t || !u || typeof u !== 'object') return null;
  if (u.input_tokens === undefined && u.output_tokens === undefined) return null;
  const entrada = n0(u.input_tokens);
  const leer = n0(u.cache_read_input_tokens);
  const escribir = n0(u.cache_creation_input_tokens);
  const de1h = Math.min(escribir, n0(u.cache_creation?.ephemeral_1h_input_tokens));
  const salida = n0(u.output_tokens);
  const p = t.umbral && entrada + leer + escribir > t.umbral ? t.alto : t;
  return entrada * p.entrada + leer * p.leer + (escribir - de1h) * p.escribir + de1h * p.escribir1h + salida * p.salida;
}

// Las últimas huellas calculadas: hay una parte fija por modo (orientar lleva el catálogo compacto; los demás, solo las
// instrucciones), así que se recuerdan unas pocas para no rehacer el SHA-256 en cada llamada.
const HUELLAS = new Map();
const MAX_HUELLAS = 8;
/** La huella de la parte fija de una petición: el modelo y el texto fijo (el de la caché). */
export function huellaFija(modelo, texto) {
  const clave = `${modelo}\n${texto}`;
  const vista = HUELLAS.get(clave);
  if (vista) return vista;
  const h = createHash('sha256').update(clave).digest('hex').slice(0, 24);
  if (HUELLAS.size >= MAX_HUELLAS) HUELLAS.delete(HUELLAS.keys().next().value);
  HUELLAS.set(clave, h);
  return h;
}

/** El día (AAAA-MM-DD) y el mes (AAAA-MM) de un instante en una zona horaria. */
const FORMATOS = new Map();
export function periodos(ms, zona) {
  let f = FORMATOS.get(zona);
  if (!f) FORMATOS.set(zona, (f = new Intl.DateTimeFormat('en-CA', { timeZone: zona, year: 'numeric', month: '2-digit', day: '2-digit' })));
  const partes = Object.fromEntries(f.formatToParts(new Date(ms)).map((x) => [x.type, x.value]));
  return { dia: `${partes.year}-${partes.month}-${partes.day}`, mes: `${partes.year}-${partes.month}` };
}

/** El primer instante (ms) del día o del mes siguiente al de `ms` en esa zona (con su horario de verano). */
export function siguientePeriodo(ms, zona, campo = 'dia') {
  const actual = periodos(ms, zona)[campo];
  let lo = ms;
  let hi = ms + (campo === 'dia' ? 27 : 32 * 24) * 3600_000;
  while (hi - lo > 1) {
    const m = Math.floor((lo + hi) / 2);
    if (periodos(m, zona)[campo] === actual) lo = m; else hi = m;
  }
  return hi;
}

const vacio = (zona) => ({ v: VERSION, zona, dias: {}, meses: {}, reservas: {}, historial: [], calibracion: {} });

// Los almacenes abiertos en este proceso (archivo y PID → estado compartido). En globalThis: Vite vuelve a cargar los
// módulos de su configuración al rehacerla, y el estado tiene que ser uno. Al salir del proceso se sueltan los cerrojos.
const ABIERTOS = (globalThis[Symbol.for('anato3d.presupuestos')] ??= (() => {
  const m = new Map();
  process.once('exit', () => { for (const a of m.values()) soltarCerrojo(a.cerrojo, a.pid); });
  return m;
})());

function abrirAlmacen(archivo, { zona, pid, vivo, registro }) {
  const clave = `${path.resolve(archivo)}|${pid}`;
  const abierto = ABIERTOS.get(clave);
  if (abierto) { abierto.refs++; return abierto; }
  const a = { clave, archivo, cerrojo: `${archivo}.lock`, pid, estado: null, fallo: null, refs: 1 };
  let tomado = false;
  try {
    fs.mkdirSync(path.dirname(archivo), { recursive: true });
    tomarCerrojo(a.cerrojo, pid, vivo);
    tomado = true;
    a.estado = leerEstado(archivo, zona);
    // Lo que quedó a medias al morir el proceso anterior: incierto, y cuenta entero.
    let quedaron = 0;
    for (const r of Object.values(a.estado.reservas)) if (r.estado === 'en-curso') { pasarAIncierta(a.estado, r); quedaron++; }
    escribirEstado(archivo, a.estado);
    if (quedaron) registro.error?.(`[presupuesto] ${quedaron} reserva(s) quedaron a medias al reiniciar: cuentan enteras hasta resolverlas (npm run presupuesto).`);
  } catch (err) {
    a.fallo = err instanceof ErrorPresupuesto ? err.codigo : 'almacen';
    a.estado = null;
    // Con el almacén dañado, el cerrojo se suelta: así se puede revisar con npm run presupuesto.
    if (tomado) soltarCerrojo(a.cerrojo, pid);
    registro.error?.(`[presupuesto] Sin presupuesto utilizable (${a.fallo}): Neuri no llamará a la IA.`);
    return a;
  }
  ABIERTOS.set(clave, a);
  return a;
}

/**
 * El presupuesto de un proceso. `archivo`: dónde se guarda (su carpeta se crea). `topeDia` y `topeMes`: en n$ (null o 0:
 * sin presupuesto). `zona`: la de los periodos. `apagado()`: si existe el interruptor de apagado inmediato. `vivo(pid)`:
 * si un proceso sigue vivo (las pruebas lo cambian, como `pid`). Las operaciones son síncronas: dentro de un proceso,
 * nadie se cuela entre comprobar el saldo y reservarlo.
 */
export function crearPresupuesto({
  archivo, topeDia = null, topeMes = null, zona = 'America/Tijuana', ahora = Date.now, registro = console,
  apagado = () => false, pid = process.pid, vivo = procesoVivo,
}) {
  const a = abrirAlmacen(archivo, { zona, pid, vivo, registro });
  let cerrado = false;

  const libre = (tope, gastado, reservado) => (tope ?? 0) - gastado - reservado;
  function enCursoDe(campo, clave) {
    let n = 0;
    for (const r of Object.values(a.estado.reservas)) if (r.estado === 'en-curso' && r[campo] === clave) n += r.n;
    return n;
  }
  function motivoNoDisponible() {
    if (a.fallo) return a.fallo;
    if (cerrado) return 'almacen';
    if (apagado()) return 'apagado';
    if (!(topeDia > 0) || !(topeMes > 0)) return 'sin-presupuesto';
    return null;
  }
  function guardar() {
    try { escribirEstado(a.archivo, a.estado); } catch {
      a.fallo = 'almacen';
      registro.error?.('[presupuesto] No se pudo guardar el presupuesto: Neuri deja de llamar a la IA.');
      throw new ErrorPresupuesto('almacen');
    }
  }
  function anotar(r, real, final) {
    a.estado.historial.push({ id: r.id, fecha: new Date(ahora()).toISOString(), etiqueta: r.etiqueta, modelo: r.modelo, reservado: r.n, real, estado: final, trabajo: r.trabajo ?? null });
    if (a.estado.historial.length > MAX_HISTORIAL) a.estado.historial.splice(0, a.estado.historial.length - MAX_HISTORIAL);
  }
  function sumar(r, n) {
    a.estado.dias[r.dia] = (a.estado.dias[r.dia] ?? 0) + n;
    a.estado.meses[r.mes] = (a.estado.meses[r.mes] ?? 0) + n;
  }
  // El menor total de tokens de entrada visto con cada parte fija (ver «calibrada» arriba).
  function calibrar(huella, tokens) {
    if (!huella || !(tokens > 0)) return;
    const c = (a.estado.calibracion ??= {});
    if (c[huella] !== undefined && c[huella] <= tokens) return;
    delete c[huella];
    c[huella] = tokens;
    const claves = Object.keys(c);
    for (const k of claves.slice(0, Math.max(0, claves.length - MAX_CALIBRACION))) delete c[k];
  }

  const api = {
    get disponible() { return !motivoNoDisponible(); },
    get motivo() { return motivoNoDisponible(); },
    /** Lo que queda hoy y este mes (n$), descontando lo reservado. */
    restante() {
      if (motivoNoDisponible()) return 0;
      const { dia, mes } = periodos(ahora(), zona);
      return Math.min(libre(topeDia, a.estado.dias[dia] ?? 0, enCursoDe('dia', dia)), libre(topeMes, a.estado.meses[mes] ?? 0, enCursoDe('mes', mes)));
    },
    /**
     * Si el tope del día o del mes no deja `necesario` n$: cuándo (ms) empieza el periodo que lo renueva. null si no es
     * por los topes (sin configurar, apagado, almacén), si ya cabe o si ni con el tope entero cabría.
     */
    renovacion(necesario = 1) {
      if (motivoNoDisponible() || !(necesario <= topeDia && necesario <= topeMes)) return null;
      const t = ahora();
      const { dia, mes } = periodos(t, zona);
      if (libre(topeMes, a.estado.meses[mes] ?? 0, enCursoDe('mes', mes)) < necesario) return siguientePeriodo(t, zona, 'mes');
      if (libre(topeDia, a.estado.dias[dia] ?? 0, enCursoDe('dia', dia)) < necesario) return siguientePeriodo(t, zona, 'dia');
      return null;
    },
    /** Lo que se reservaría para una llamada (n$), sin reservarlo. */
    cota({ modelo, bytes, bytesResto = null, huella = null, maxTokens }) {
      return cotaReserva(modelo, { bytes, maxTokens, bytesResto, base: huella ? a.estado?.calibracion?.[huella] ?? null : null });
    },
    /**
     * Reserva lo más que puede costar una llamada: `bytes` (todo lo que se envía), `bytesResto` y `huella` (lo que no es
     * la parte fija, y la huella de esta), `maxTokens`. Devuelve la reserva o lanza ErrorPresupuesto.
     */
    reservar({ modelo, bytes, bytesResto = null, huella = null, maxTokens, etiqueta = '', trabajo = null }) {
      const m = motivoNoDisponible();
      if (m) throw new ErrorPresupuesto(m);
      const n = api.cota({ modelo, bytes, bytesResto, huella, maxTokens });
      const { dia, mes } = periodos(ahora(), zona);
      if (n > libre(topeDia, a.estado.dias[dia] ?? 0, enCursoDe('dia', dia))) throw new ErrorPresupuesto('tope-dia');
      if (n > libre(topeMes, a.estado.meses[mes] ?? 0, enCursoDe('mes', mes))) throw new ErrorPresupuesto('tope-mes');
      const r = { id: randomUUID(), n, dia, mes, modelo, huella, etiqueta: String(etiqueta).slice(0, 60), trabajo, desde: ahora(), estado: 'en-curso' };
      a.estado.reservas[r.id] = r;
      try { guardar(); } catch (err) { delete a.estado.reservas[r.id]; throw err; }
      return { id: r.id, n };
    },
    /** Ajusta una reserva a lo que costó (`usage` de la respuesta). Sin usage, queda incierta. Devuelve el coste o null. */
    conciliar(reserva, usage) {
      const r = a.estado?.reservas[reserva?.id];
      if (!r || r.estado !== 'en-curso') return null;
      const real = costeReal(r.modelo, usage);
      if (real === null) { api.incierta(reserva); return null; }
      delete a.estado.reservas[r.id];
      sumar(r, real);
      anotar(r, real, real > r.n ? 'excedida' : 'ajustada');
      calibrar(r.huella, entradaTotal(usage));
      if (real > r.n) registro.error?.(`[presupuesto] ${r.etiqueta}: costó más de lo reservado (${nanoAUsd(real)} > ${nanoAUsd(r.n)} US$). Revisa las tarifas.`);
      guardar();
      return real;
    },
    /** La petición seguro que no llegó a Anthropic (o la rechazó sin procesarla): se devuelve la reserva. */
    liberar(reserva) {
      const r = a.estado?.reservas[reserva?.id];
      if (!r || r.estado !== 'en-curso') return;
      delete a.estado.reservas[r.id];
      anotar(r, 0, 'liberada');
      guardar();
    },
    /** No se sabe si costó (un corte después de enviar): cuenta entera hasta que se resuelva a mano. */
    incierta(reserva) {
      const r = a.estado?.reservas[reserva?.id];
      if (!r || r.estado !== 'en-curso') return;
      pasarAIncierta(a.estado, r);
      anotar(r, null, 'incierta');
      guardar();
    },
    /**
     * Resuelve una reserva incierta con lo que dice la consola de Anthropic (n$). Ya contaba entera: se ajusta la
     * diferencia. Nunca se libera sin una cifra.
     */
    resolver(id, real) {
      const r = a.estado?.reservas[id];
      if (!r || r.estado !== 'incierta' || !Number.isInteger(real) || real < 0) return false;
      sumar(r, real - r.n);
      delete a.estado.reservas[id];
      anotar(r, real, 'resuelta');
      guardar();
      return true;
    },
    /** Lo que hay: topes, gastado y reservado hoy y este mes, y las reservas abiertas (sin texto de nadie). */
    resumen() {
      const { dia, mes } = periodos(ahora(), zona);
      const e = a.estado;
      return {
        motivo: motivoNoDisponible(), zona, tarifas: FECHA_TARIFAS,
        dia: { periodo: dia, tope: topeDia ?? 0, gastado: e?.dias[dia] ?? 0, reservado: e ? enCursoDe('dia', dia) : 0 },
        mes: { periodo: mes, tope: topeMes ?? 0, gastado: e?.meses[mes] ?? 0, reservado: e ? enCursoDe('mes', mes) : 0 },
        abiertas: e ? Object.values(e.reservas).map(({ id, n, estado: x, etiqueta, modelo, desde, dia: d, trabajo }) => ({ id, n, estado: x, etiqueta, modelo, desde, dia: d, trabajo: trabajo ?? null })) : [],
        historial: e ? e.historial.slice(-20) : [],
        calibradas: e ? Object.keys(e.calibracion ?? {}).length : 0,
      };
    },
    /** Lo deja (al cerrar el proceso o rehacer la configuración): el último en dejarlo suelta el cerrojo. */
    cerrar() {
      if (cerrado) return;
      cerrado = true;
      if (--a.refs > 0 || ABIERTOS.get(a.clave) !== a) return;
      ABIERTOS.delete(a.clave);
      soltarCerrojo(a.cerrojo, a.pid);
    },
  };
  return api;
}

function pasarAIncierta(estado, r) {
  r.estado = 'incierta';
  estado.dias[r.dia] = (estado.dias[r.dia] ?? 0) + r.n;
  estado.meses[r.mes] = (estado.meses[r.mes] ?? 0) + r.n;
}

function leerEstado(archivo, zona) {
  let crudo;
  try { crudo = fs.readFileSync(archivo, 'utf8'); } catch (err) {
    if (err.code === 'ENOENT') return vacio(zona);
    throw new ErrorPresupuesto('almacen');
  }
  let d;
  try { d = JSON.parse(crudo); } catch { throw new ErrorPresupuesto('almacen'); }
  // Un archivo dañado o de otra versión no se pisa (se perdería lo gastado): la IA no gasta hasta revisarlo.
  if (d?.v !== VERSION || typeof d.dias !== 'object' || typeof d.meses !== 'object' || typeof d.reservas !== 'object') throw new ErrorPresupuesto('almacen');
  d.historial = Array.isArray(d.historial) ? d.historial : [];
  d.calibracion = d.calibracion && typeof d.calibracion === 'object' ? d.calibracion : {};
  return d;
}

/** Escritura atómica de un estado JSON (temporal + fsync + rename). También la usa el cupo diario (server/neuri/cupo.mjs). */
export function escribirEstado(archivo, estado) {
  const tmp = `${archivo}.${process.pid}.tmp`;
  const fd = fs.openSync(tmp, 'w');
  try {
    fs.writeFileSync(fd, JSON.stringify(estado));
    fs.fsyncSync(fd);
  } finally { fs.closeSync(fd); }
  fs.renameSync(tmp, archivo);
}

export function procesoVivo(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try { process.kill(pid, 0); return true; } catch (err) { return err.code === 'EPERM'; }
}

/**
 * El cerrojo se crea de una vez, ya con el PID dentro (un enlace a un archivo temporal: `link` falla si ya existe), para
 * que dos procesos que arrancan a la vez no lo vean vacío y se lo queden los dos. Si el dueño murió, se quita y se vuelve
 * a intentar (gana uno). Queda un caso raro: dos procesos que encuentran a la vez el cerrojo de uno muerto; por eso el
 * despliegue es de una sola instancia (docs/estudio/guia-operativa.md). También lo usa el cupo diario (server/neuri/cupo.mjs).
 */
export function tomarCerrojo(cerrojo, pid, vivo) {
  const tmp = `${cerrojo}.${pid}.${randomUUID().slice(0, 8)}.tmp`;
  try { fs.writeFileSync(tmp, String(pid), { flag: 'wx' }); } catch { throw new ErrorPresupuesto('almacen'); }
  try {
    for (let intento = 0; intento < 3; intento++) {
      try { fs.linkSync(tmp, cerrojo); return; } catch (err) { if (err.code !== 'EEXIST') throw new ErrorPresupuesto('almacen'); }
      let otro;
      try { otro = Number(fs.readFileSync(cerrojo, 'utf8').trim()); } catch (err) {
        if (err.code === 'ENOENT') continue;       // lo acaban de soltar: otra vez
        throw new ErrorPresupuesto('almacen');
      }
      if (otro === pid) return;                     // ya era de este proceso
      if (Number.isInteger(otro) && otro > 0 && vivo(otro)) throw new ErrorPresupuesto('otro-proceso');
      // El dueño murió (o el cerrojo está dañado): se quita y se vuelve a intentar.
      try { fs.unlinkSync(cerrojo); } catch (err) { if (err.code !== 'ENOENT') throw new ErrorPresupuesto('almacen'); }
    }
    throw new ErrorPresupuesto('otro-proceso');
  } finally {
    try { fs.unlinkSync(tmp); } catch { /* ya no está */ }
  }
}

export function soltarCerrojo(cerrojo, pid) {
  try { if (Number(fs.readFileSync(cerrojo, 'utf8').trim()) === pid) fs.unlinkSync(cerrojo); } catch { /* ya no está */ }
}

/** El presupuesto con la configuración del entorno (web/.env.local o variables del servidor). */
export function presupuestoDesdeEntorno(env, { raiz, registro = console, ahora = Date.now } = {}) {
  const dir = env.ANATO3D_DATOS?.trim() || path.join(raiz, '../build/servidor');
  const topeDia = usdANano(env.ANATO3D_TOPE_DIARIO_USD);
  const topeMes = usdANano(env.ANATO3D_TOPE_MENSUAL_USD);
  const zona = validarZona(env.ANATO3D_PRESUPUESTO_ZONA?.trim()) ?? 'America/Tijuana';
  const interruptor = path.join(dir, 'IA-APAGADA');
  return crearPresupuesto({ archivo: path.join(dir, 'presupuesto.json'), topeDia, topeMes, zona, registro, ahora, apagado: () => fs.existsSync(interruptor) });
}

function validarZona(z) {
  if (!z) return null;
  try { new Intl.DateTimeFormat('en', { timeZone: z }); return z; } catch { return null; }
}
