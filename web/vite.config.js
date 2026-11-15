// Configuración de Vite: la de siempre, más el servidor de Neuri (el pet de «Estudiar») en /api/pet durante
// `npm run dev` y `npm run preview` (server/vite-pet.mjs). La web publicada sigue siendo estática.
//
// Dos páginas (desde el 13 nov 2026): la presentación en / (index.html, src/presentacion/) y la app en /app/
// (app/index.html, src/main.js). Las dos usan rutas absolutas (/models, /i18n, /api…), así que la app funciona igual en
// su carpeta. La presentación en inglés, /en/, no es un archivo: se genera de index.html con sus textos
// (src/presentacion/traducir.mjs), en el servidor de desarrollo y al empaquetar.
//
// Con ANATO3D_ORIGEN (el origen público, p. ej. https://anato3d.example: el mismo del servidor, activacion.md) al
// empaquetar, las páginas llevan las URL absolutas que piden quienes las comparten y los buscadores: og:image, og:url,
// canonical y los hreflang de la presentación. Sin él, el HTML queda como está.
import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { defineConfig } from 'vite';
import { petApi } from './server/vite-pet.mjs';
import { traducirAIngles } from './src/presentacion/traducir.mjs';

const aqui = (ruta) => fileURLToPath(new URL(ruta, import.meta.url));
const ORIGEN = (process.env.ANATO3D_ORIGEN ?? '').trim().replace(/\/+$/, '');

async function textosIngles() {
  // Cada vez de nuevo: en desarrollo, un cambio en textos.js se ve al recargar. Ruta absoluta: Vite ejecuta esta
  // configuración desde una copia en node_modules/.vite-temp (import.meta.url sí apunta al archivo original).
  const { EN } = await import(`${pathToFileURL(aqui('./src/presentacion/textos.js')).href}?v=${Date.now()}`);
  return EN;
}

/** Las URL absolutas de una página (ruta: '/', '/en/' o '/app/'). */
function absolutas(html, ruta) {
  if (!ORIGEN) return html;
  let out = html.replace(/(<meta property="og:image" content=")\//g, `$1${ORIGEN}/`);
  const extra = [`<link rel="canonical" href="${ORIGEN}${ruta}" />`, `<meta property="og:url" content="${ORIGEN}${ruta}" />`];
  if (ruta !== '/app/') {
    extra.push(`<link rel="alternate" hreflang="es" href="${ORIGEN}/" />`, `<link rel="alternate" hreflang="en" href="${ORIGEN}/en/" />`,
      `<link rel="alternate" hreflang="x-default" href="${ORIGEN}/" />`);
  }
  return out.replace('</head>', `    ${extra.join('\n    ')}\n  </head>`);
}

function presentacion() {
  // /app y /en sin la barra final: a la carpeta (en producción lo hace server/produccion.mjs).
  const barras = (req, res, next) => {
    const url = req.url ?? '';
    const i = url.indexOf('?');
    const ruta = i < 0 ? url : url.slice(0, i);
    if (ruta !== '/app' && ruta !== '/en') return next();
    res.statusCode = 301;
    res.setHeader('location', `${ruta}/${i < 0 ? '' : url.slice(i)}`);
    res.end();
  };
  return {
    name: 'anato3d-presentacion',
    enforce: 'post',              // generateBundle, después de que Vite emita las páginas compiladas
    configureServer(server) {
      server.middlewares.use(barras);
      // /en/ en desarrollo: la presentación traducida, con los mismos scripts que la española (recarga en caliente).
      server.middlewares.use(async (req, res, next) => {
        const ruta = (req.url ?? '').split('?')[0];
        if (ruta !== '/en/' && ruta !== '/en/index.html') return next();
        try {
          const html = traducirAIngles(fs.readFileSync(aqui('./index.html'), 'utf8'), await textosIngles());
          res.setHeader('content-type', 'text/html; charset=utf-8');
          res.end(await server.transformIndexHtml('/en/', html));
        } catch (err) { next(err); }
      });
    },
    configurePreviewServer(server) { server.middlewares.use(barras); },
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (ctx.server) return html;
        return absolutas(html, ctx.path.endsWith('app/index.html') ? '/app/' : '/');
      },
    },
    // Al empaquetar: en/index.html a partir de la presentación ya compilada (con sus scripts y estilos con huella).
    async generateBundle(_opciones, bundle) {
      const pagina = bundle['index.html'];
      if (!pagina || pagina.type !== 'asset') return;
      let html = traducirAIngles(String(pagina.source), await textosIngles());
      if (ORIGEN) html = html.replace(`href="${ORIGEN}/" />\n    <meta property="og:url" content="${ORIGEN}/" />`, `href="${ORIGEN}/en/" />\n    <meta property="og:url" content="${ORIGEN}/en/" />`);
      this.emitFile({ type: 'asset', fileName: 'en/index.html', source: html });
    },
  };
}

export default defineConfig({
  plugins: [petApi(), presentacion()],
  build: {
    rollupOptions: {
      input: { presentacion: aqui('./index.html'), app: aqui('./app/index.html') },
    },
  },
});
