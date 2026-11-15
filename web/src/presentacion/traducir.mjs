// La página de presentación en inglés (/en/) a partir de la española (index.html) y sus textos (textos.js), sin DOM:
// la usan el plugin de Vite (servidor de desarrollo y build) y las pruebas.
//
// Qué cambia:
// - cada elemento con data-t="clave" (solo texto: la prueba lo garantiza) recibe EN[clave], escapado;
// - cada data-t-html="clave", EN[clave] tal cual (lleva enlaces);
// - cada data-t-attr="atributo:clave; …", el atributo con EN[clave], escapado;
// - <html lang="es"> pasa a lang="en", y los enlaces de idioma marcan el inglés como el actual;
// - las imágenes con data-loc (capturas de la interfaz e imagen para compartir) pasan de …-es-… a …-en-…;
// - las cifras con data-num, con el formato inglés (2,900).
// Una clave sin inglés es un error (no se deja el español a medias).

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
const escapar = (s) => String(s).replace(/[&<>"]/g, (c) => ESCAPES[c]);

export function traducirAIngles(html, EN) {
  const falta = (clave) => { throw new Error(`presentación: falta el inglés de «${clave}» (src/presentacion/textos.js)`); };
  // Solo un texto de verdad: una clave que existe pero vale undefined o '' saldría como «undefined» o vacía.
  const en = (clave) => (Object.hasOwn(EN, clave) && typeof EN[clave] === 'string' && EN[clave].trim() ? EN[clave] : falta(clave));
  let out = html;
  // Texto: <etiqueta … data-t="clave" …>texto</etiqueta>
  out = out.replace(/(<([a-z0-9]+)\b[^>]*\sdata-t="([^"]+)"[^>]*>)([^<]*)(<\/\2>)/g, (m, abre, _tag, clave, _texto, cierra) => `${abre}${escapar(en(clave))}${cierra}`);
  // Con enlaces: <etiqueta … data-t-html="clave" …>…</etiqueta> (sin la misma etiqueta anidada dentro)
  out = out.replace(/(<([a-z0-9]+)\b[^>]*\sdata-t-html="([^"]+)"[^>]*>)([\s\S]*?)(<\/\2>)/g, (m, abre, _tag, clave, _html, cierra) => `${abre}${en(clave)}${cierra}`);
  // Atributos: data-t-attr="aria-label:clave; alt:otra"
  out = out.replace(/<[a-z0-9]+\b[^>]*\sdata-t-attr="([^"]+)"[^>]*>/g, (etiqueta, lista) => {
    let t = etiqueta;
    for (const par of lista.split(';')) {
      const [attr, clave] = par.split(':').map((x) => x.trim());
      if (!attr || !clave) continue;
      const re = new RegExp(`(\\s${attr}=")[^"]*(")`);
      if (!re.test(t)) throw new Error(`presentación: «${attr}» no está en ${etiqueta.slice(0, 80)}`);
      t = t.replace(re, (mm, a, b) => `${a}${escapar(en(clave))}${b}`);
    }
    return t;
  });
  // Idioma del documento y enlaces de idioma (el actual lleva aria-current).
  out = out.replace(/<html lang="es"/, '<html lang="en"');
  out = out.replace(/<a\b[^>]*\sdata-idioma="(es|en)"[^>]*>/g, (a, id) => {
    const sin = a.replace(/\saria-current="[^"]*"/, '');
    return id === 'en' ? sin.replace(/>$/, ' aria-current="true">') : sin;
  });
  // Imágenes en inglés (capturas e imagen para compartir) y cifras con su formato.
  out = out.replace(/<(?:img|meta)\b[^>]*\sdata-loc\b[^>]*>/g, (el) => el.replace(/(\/presentacion\/(?:ui-[a-z]+|og)-)es(-[\dx]+\.(?:webp|jpg))/g, '$1en$2'));
  out = out.replace(/(<[a-z]+\b[^>]*\sdata-num="(\d+)"[^>]*>)(\d+)(<)/g, (m, abre, n, _v, cierre) => `${abre}${new Intl.NumberFormat('en').format(Number(n))}${cierre}`);
  return out;
}
