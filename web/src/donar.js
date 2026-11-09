// Donaciones: la opción «Donar» de la pantalla de inicio (ui/start.js) abre la página de PayPal.Me de Anato3D en otra
// pestaña. La app no cobra nada ni ve datos de pago: solo enlaza a PayPal.
//
// Para activarla, pon aquí el enlace de PayPal.Me, p. ej. 'https://paypal.me/TuNombre'. Se crea en
// https://www.paypal.com/paypalme con cualquier tipo de cuenta de PayPal y, una vez creado, no se puede cambiar ni borrar
// (lo dice la ayuda de PayPal México). Sin enlace, la opción solo aparece en desarrollo, con un aviso; en la web
// publicada no se muestra: así no puede salir un botón que no lleva a ninguna parte.
// El de Carlos, de su cuenta personal (2026-11-08); si pasa a una cuenta de empresa, se cambia esta línea.
export const DONAR_URL = 'https://paypal.me/krlos419';

// Solo PayPal y por https: un enlace mal copiado (otro sitio, http) se trata como si no hubiera enlace.
const HOSTS = new Set(['paypal.me', 'www.paypal.me', 'paypal.com', 'www.paypal.com']);

/** El enlace normalizado si es de PayPal y va por https; si no (vacío, mal escrito u otro sitio), null. Sin protocolo
 *  («paypal.me/TuNombre», como lo muestra PayPal), se entiende https. */
export function enlaceDonar(url = DONAR_URL) {
  url = String(url ?? '').trim();
  if (!url) return null;
  try {
    const u = new URL(/^[a-z]+:\/\//i.test(url) ? url : `https://${url}`);
    return u.protocol === 'https:' && HOSTS.has(u.hostname) ? u.href : null;
  } catch {
    return null;
  }
}

/** Cómo se muestra «Donar»: 'activa' con un enlace válido; sin él, 'aviso' en desarrollo y 'oculta' en la web publicada. */
export function estadoDonar(url = DONAR_URL, dev = Boolean(import.meta.env?.DEV)) {
  if (enlaceDonar(url)) return 'activa';
  return dev ? 'aviso' : 'oculta';
}
