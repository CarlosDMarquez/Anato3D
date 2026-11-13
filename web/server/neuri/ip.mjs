// La dirección de quien pide, tal como la cuentan los límites de Neuri (el cupo diario, server/neuri/cupo.mjs, y los
// limitadores por dirección de server/pet.mjs y server/reportes.mjs). Una sola función para todos, antes del HMAC y del
// limitador:
//  - IPv4: tal cual (sin espacios).
//  - IPv4 dentro de IPv6 (::ffff:a.b.c.d, como la da Node en un socket de doble pila): la IPv4.
//  - IPv6: su /64 («2001:db8:1:2::/64»). Un proveedor da a cada conexión (cada casa, cada móvil) al menos una /64, y
//    dentro de ella se pueden usar tantas direcciones como se quiera: contar la dirección entera daría direcciones
//    ilimitadas a cualquiera. Se quitan los corchetes y la zona («%eth0»).
//  - Lo demás (vacío, un texto que no es una dirección): tal cual, recortado. Nunca lanza.
import { isIP } from 'node:net';

/** Los 8 grupos (números de 16 bits) de una IPv6 válida (puede acabar en una IPv4: «::ffff:1.2.3.4»). */
function grupos6(s) {
  const lado = (t) => {
    if (!t) return [];
    const partes = t.split(':');
    const ultima = partes.at(-1);
    if (ultima.includes('.')) {
      const [a, b, c, d] = ultima.split('.').map(Number);
      partes.splice(-1, 1, ((a << 8) | b).toString(16), ((c << 8) | d).toString(16));
    }
    return partes.map((x) => parseInt(x, 16));
  };
  const i = s.indexOf('::');
  if (i < 0) return lado(s);
  const izq = lado(s.slice(0, i));
  const der = lado(s.slice(i + 2));
  return [...izq, ...Array(8 - izq.length - der.length).fill(0), ...der];
}

/** La dirección con la que se cuenta: IPv4, o la /64 de una IPv6 (ver arriba). */
export function normalizarIp(ip) {
  let s = String(ip ?? '').trim().toLowerCase();
  if (s.startsWith('[')) { const j = s.indexOf(']'); if (j > 0) s = s.slice(1, j); }
  const zona = s.indexOf('%');
  if (zona >= 0) s = s.slice(0, zona);
  const tipo = isIP(s);
  if (tipo === 4) return s;
  if (tipo !== 6) return s.endsWith('::/64') && isIP(s.slice(0, -3)) === 6 ? s : s.slice(0, 64);
  const g = grupos6(s);
  // ::ffff:0:0/96 (IPv4 mapeada): la IPv4.
  if (g.slice(0, 5).every((x) => x === 0) && g[5] === 0xffff) return `${g[6] >> 8}.${g[6] & 255}.${g[7] >> 8}.${g[7] & 255}`;
  return `${g.slice(0, 4).map((x) => x.toString(16)).join(':')}::/64`;
}
