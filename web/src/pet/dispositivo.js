// Identificador de este dispositivo para el cupo diario de Neuri (protocolo.js, ID_DISPOSITIVO): un UUID aleatorio que la
// app crea una vez y guarda en localStorage. Viaja solo en la cabecera «x-anato3d-dispositivo» de las peticiones a
// /api/pet: nunca en el cuerpo, nunca al modelo ni a los registros. No identifica a la persona (no hay cuentas): si se
// borran los datos del navegador, se crea otro. Está en «Mis datos» (se ve y se borra), pero no se exporta ni se importa:
// es de este dispositivo, no del estudio. Sin DOM: lo prueba `npm test`.
import { ID_DISPOSITIVO } from './protocolo.js';
import { nuevoId } from './red.js';

export const CLAVE_DISPOSITIVO = 'anato3d.dispositivo';
export const CABECERA_DISPOSITIVO = 'x-anato3d-dispositivo';

// Si el navegador no deja guardar (modo privado estricto, almacenamiento bloqueado), el mismo identificador mientras
// dure la página: uno por almacén (y uno sin almacén).
const enMemoria = new WeakMap();
let sinAlmacen = null;

/** ¿Es un identificador de dispositivo válido? */
export const dispositivoValido = (id) => typeof id === 'string' && ID_DISPOSITIVO.test(id);

/** El identificador guardado, o null si no hay uno válido (sin crearlo). */
export function leerDispositivo(almacen) {
  try { const id = almacen?.getItem(CLAVE_DISPOSITIVO) ?? null; return dispositivoValido(id) ? id : null; } catch { return null; }
}

/** El identificador de este dispositivo: el guardado o, la primera vez (o si estaba dañado), uno nuevo que se guarda. */
export function idDispositivo(almacen) {
  const guardado = leerDispositivo(almacen);
  if (guardado) return guardado;
  // Se pudo guardar: uno nuevo (también tras «Borrar mis datos», que no debe recuperar el anterior).
  const nuevo = nuevoId().toLowerCase();
  try {
    if (almacen) {
      almacen.setItem(CLAVE_DISPOSITIVO, nuevo);
      if (leerDispositivo(almacen) === nuevo) return nuevo;
    }
  } catch { /* sin almacenamiento: el de esta página */ }
  const objeto = almacen && typeof almacen === 'object';
  const previo = objeto ? enMemoria.get(almacen) : sinAlmacen;
  if (previo) return previo;
  if (objeto) enMemoria.set(almacen, nuevo); else sinAlmacen = nuevo;
  return nuevo;
}

/** Las cabeceras de una petición con la del dispositivo (acepta un objeto o un Headers; no cambia el original). */
function conCabecera(headers, id) {
  if (typeof Headers !== 'undefined' && headers instanceof Headers) {
    const h = new Headers(headers);
    h.set(CABECERA_DISPOSITIVO, id);
    return h;
  }
  return { ...(headers ?? {}), [CABECERA_DISPOSITIVO]: id };
}

/**
 * Un `fetch` que añade la cabecera del dispositivo a toda petición (GET y POST). Para las fábricas de Neuri
 * (conversacion.js, trabajos.js, recorridos.js), que aceptan un `fetch`. El identificador se lee en cada petición: tras
 * «Borrar mis datos» se usa uno nuevo.
 */
export function conDispositivo(fetch, almacen) {
  return (url, init = {}) => fetch(url, { ...init, headers: conCabecera(init.headers, idDispositivo(almacen)) });
}
