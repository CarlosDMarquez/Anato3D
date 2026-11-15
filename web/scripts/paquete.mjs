// Arma el paquete de producción, reproducible y sin claves: la web estática (publico/), el servidor en un solo archivo
// con el SDK dentro (servidor.mjs, de server/produccion.mjs), los recursos de Neuri (catálogo, inventario, lecciones y
// páginas citables) con su manifiesto SHA-256, el LEEME de arranque y las plantillas de despliegue (despliegue/: Fly.io
// y el Worker de Cloudflare, sin secretos). Sin red y sin gastar nada.
//
// Uso (desde web/):  npm run paquete                                   → ../build/paquete
//                    npm run paquete -- --destino /otra/carpeta        (otra carpeta, vacía o que se pueda rehacer)
//                    npm run paquete -- --sin-web                      (sin compilar la web: para las pruebas)
//                    npm run paquete -- --fuentes wp,wpes,tma          (qué páginas van; por defecto, solo Wikipedia)
//
// Las páginas de TeachMeAnatomy (tma, © TeachMeSeries Ltd) no van por defecto: no tienen licencia libre, y llevarlas a
// un servidor es decisión de Carlos tras revisar sus condiciones (docs/estudio/despliegue.md). Las de Wikipedia (wp,
// wpes) son CC BY-SA 4.0. Ninguna se sirve como descarga: están en recursos/, fuera de publico/.
//
// Arrancarlo:  cd ../build/paquete && node servidor.mjs   (variables: docs/estudio/activacion.md)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { cargarLecciones } from './biblioteca/fuentes.mjs';

const web = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const opcion = (n) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : null; };
const destino = path.resolve(opcion('--destino') ?? path.join(web, '../build/paquete'));
const sinWeb = process.argv.includes('--sin-web');
const tipos = (opcion('--fuentes') ?? 'wp,wpes').split(',').map((x) => x.trim()).filter((x) => ['wp', 'wpes', 'tma'].includes(x));
const MB = (n) => `${(n / 1024 / 1024).toFixed(1)} MB`;

// No se rehace una carpeta que no parezca un paquete (para no borrar nada por error).
if (fs.existsSync(destino) && fs.readdirSync(destino).length && !fs.existsSync(path.join(destino, 'MANIFIESTO.json'))) {
  console.error(`✖ ${destino} no está vacía y no es un paquete: elige otra con --destino.`);
  process.exit(1);
}
fs.rmSync(destino, { recursive: true, force: true });
fs.mkdirSync(destino, { recursive: true });
const t0 = Date.now();

// 1. La web estática.
if (sinWeb) {
  fs.mkdirSync(path.join(destino, 'publico'), { recursive: true });
  fs.writeFileSync(path.join(destino, 'publico/index.html'), '<!doctype html><meta charset="utf-8"><title>Anato3D</title><p>Paquete de prueba sin la web.</p>\n');
  fs.mkdirSync(path.join(destino, 'publico/app'), { recursive: true });
  fs.writeFileSync(path.join(destino, 'publico/app/index.html'), '<!doctype html><meta charset="utf-8"><title>Anato3D · app</title><p>Paquete de prueba sin la app.</p>\n');
  fs.mkdirSync(path.join(destino, 'publico/en'), { recursive: true });
  fs.writeFileSync(path.join(destino, 'publico/en/index.html'), '<!doctype html><meta charset="utf-8"><title>Anato3D · en</title><p>Test package without the web.</p>\n');
} else {
  await build({ root: web, configFile: path.join(web, 'vite.config.js'), logLevel: 'warn', build: { outDir: path.join(destino, 'publico'), emptyOutDir: true } });
}

// 2. El servidor, en un solo archivo (con el SDK de Anthropic dentro; Node 22 o más).
await build({
  root: web, configFile: false, logLevel: 'warn',
  ssr: { noExternal: true, target: 'node' },
  build: { ssr: path.join(web, 'server/produccion.mjs'), outDir: destino, emptyOutDir: false, target: 'node22', minify: false, copyPublicDir: false, rollupOptions: { output: { entryFileNames: 'servidor.mjs', codeSplitting: false } } },
});

// 3. Los recursos de Neuri.
const rec = path.join(destino, 'recursos');
fs.mkdirSync(rec, { recursive: true });
fs.copyFileSync(path.join(web, 'src/biblioteca/generado/catalogo.json'), path.join(rec, 'catalogo.json'));
fs.copyFileSync(path.join(web, 'server/generado/inventario.json'), path.join(rec, 'inventario.json'));
const lecciones = [...(await cargarLecciones()).values()];
fs.writeFileSync(path.join(rec, 'lecciones.json'), JSON.stringify(lecciones));
const origen = path.join(web, '../build/biblioteca/fuentes');
const paginas = {};
for (const tipo of tipos) {
  const dir = path.join(origen, tipo);
  if (!fs.existsSync(dir)) continue;
  fs.mkdirSync(path.join(rec, 'fuentes', tipo), { recursive: true });
  const archivos = fs.readdirSync(dir).filter((x) => x.endsWith('.json'));
  for (const a of archivos) fs.copyFileSync(path.join(dir, a), path.join(rec, 'fuentes', tipo, a));
  paginas[tipo] = archivos.length;
}
if (!Object.keys(paginas).length) console.warn(`⚠ Sin páginas citables (${origen} no existe: npm run fuentes -- comprobar). Neuri no explicará con citas ni creará lecciones.`);

// 4. package.json y LEEME.
const { VERSION_SERVIDOR } = await import(path.join(web, 'server/produccion.mjs'));
fs.writeFileSync(path.join(destino, 'package.json'), `${JSON.stringify({ name: 'anato3d-servidor', private: true, version: VERSION_SERVIDOR, type: 'module', engines: { node: '>=22' }, scripts: { start: 'node servidor.mjs' } }, null, 2)}\n`);
fs.writeFileSync(path.join(destino, 'LEEME.md'), `# Anato3D · paquete de producción (${VERSION_SERVIDOR})

Arrancar (Node 22 o más), sin el árbol de desarrollo:

    node servidor.mjs

Variables: \`PORT\`, \`ANATO3D_ORIGEN\`, \`ANATO3D_IP_DE\`, \`ANATO3D_PROXY_SECRETO\`, \`ANATO3D_DATOS\` (un volumen), y para la IA
\`ANTHROPIC_API_KEY\` (solo como secreto), \`ANATO3D_TOPE_DIARIO_USD\` y \`ANATO3D_TOPE_MENSUAL_USD\`. Sin tope no se llama a
la IA. Guía completa: docs/estudio/activacion.md del repositorio.

Comprobar: \`curl http://localhost:8080/salud\` y \`curl http://localhost:8080/api/pet\`.
Apagar la IA al momento (sin parar la web): crear el archivo \`IA-APAGADA\` en la carpeta de datos.

Publicar en Fly.io (plantillas sin probar en Fly; pasos en docs/estudio/activacion.md): \`fly deploy\` en esta carpeta
(\`fly.toml\`, \`Dockerfile\`, \`.dockerignore\`). Para servir la web desde Cloudflare y solo la API desde Fly: \`worker/\`.

Páginas citables incluidas: ${Object.entries(paginas).map(([k, v]) => `${k} ${v}`).join(', ') || 'ninguna'}.
`);

// 4b. Las plantillas de despliegue (sin secretos): Fly.io en la raíz del paquete y el Worker de Cloudflare en worker/.
const plantillas = path.join(web, 'despliegue');
fs.copyFileSync(path.join(plantillas, 'fly.toml'), path.join(destino, 'fly.toml'));
fs.copyFileSync(path.join(plantillas, 'Dockerfile'), path.join(destino, 'Dockerfile'));
fs.copyFileSync(path.join(plantillas, 'dockerignore'), path.join(destino, '.dockerignore'));
fs.mkdirSync(path.join(destino, 'worker'), { recursive: true });
for (const a of ['worker.mjs', 'wrangler.toml']) fs.copyFileSync(path.join(plantillas, 'worker', a), path.join(destino, 'worker', a));

// 5. El manifiesto (SHA-256 de cada archivo): el servidor comprueba los recursos al arrancar.
function archivos(dir, base = dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? archivos(path.join(dir, e.name), base) : [path.relative(base, path.join(dir, e.name)).split(path.sep).join('/')]));
}
const lista = archivos(destino).filter((x) => x !== 'MANIFIESTO.json').sort();
const sha = (rel) => crypto.createHash('sha256').update(fs.readFileSync(path.join(destino, rel))).digest('hex');
fs.writeFileSync(path.join(destino, 'MANIFIESTO.json'), `${JSON.stringify({ version: VERSION_SERVIDOR, fecha: new Date().toISOString(), fuentes: paginas, archivos: Object.fromEntries(lista.map((r) => [r, sha(r)])) }, null, 1)}\n`);

// 6. Tamaños.
const tam = (rels) => rels.reduce((n, r) => n + fs.statSync(path.join(destino, r)).size, 0);
const publico = lista.filter((r) => r.startsWith('publico/'));
const modelos = publico.filter((r) => r.endsWith('.glb'));
console.log(`✔ Paquete en ${destino} (${((Date.now() - t0) / 1000).toFixed(1)} s)`);
console.log(`  web: ${MB(tam(publico))} en ${publico.length} archivos (modelos 3D: ${MB(tam(modelos))} en ${modelos.length})`);
console.log(`  servidor.mjs: ${MB(tam(['servidor.mjs']))}`);
console.log(`  recursos: ${MB(tam(lista.filter((r) => r.startsWith('recursos/'))))} (${lecciones.length} lecciones; páginas: ${Object.entries(paginas).map(([k, v]) => `${k} ${v}`).join(', ') || 'ninguna'})`);
console.log(`  total: ${MB(tam(lista))}`);
