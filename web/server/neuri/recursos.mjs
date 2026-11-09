// Recursos de Neuri en el servidor: el inventario de las estructuras, las evidencias (frases de las lecciones y de las
// páginas de Wikipedia guardadas) y las lecciones de la biblioteca enteras (para adaptarlas). Se cargan una vez, la
// primera vez que hacen falta (unos 0,3 s), y Neuri puede bajar más páginas de Wikipedia para un tema nuevo.
import path from 'node:path';
import { cargarInventario } from './inventario.mjs';
import { crearCorpus, paginasGuardadas, traerWikipedia } from './evidencias.mjs';
import { cargarLecciones } from '../../scripts/biblioteca/fuentes.mjs';
import { MODULOS } from '../../src/content/index.js';
import { deModulo } from '../../src/biblioteca/modulos.js';

/** `raiz`: la carpeta web/. Las páginas están en build/biblioteca (fuera de git; se rehacen con los scripts). */
export async function cargarRecursos({ raiz, fetch = globalThis.fetch, registro = console } = {}) {
  const build = path.join(raiz, '../build/biblioteca');
  const dirNeuri = path.join(build, 'fuentes-neuri');
  const inventario = cargarInventario();
  const corpus = crearCorpus();
  const paginas = paginasGuardadas([path.join(build, 'fuentes'), dirNeuri]);
  for (const p of paginas) corpus.añadirFuente(p.f, p.meta, p.texto);
  const nuevas = await cargarLecciones();
  for (const L of nuevas.values()) corpus.añadirLeccion(L);
  const antiguas = new Map(MODULOS.map(deModulo).filter(Boolean).map((L) => [L.id, L]));
  const lecciones = new Map([...antiguas, ...nuevas]);
  registro.info?.(`[pet] Recursos de Neuri: ${Object.keys(inventario.estructuras).length} estructuras, ${corpus.tamaño} frases citables de ${paginas.length} páginas y ${nuevas.size} lecciones.`);
  let ultima = 0;
  return {
    inventario, corpus, lecciones,
    disponible: paginas.length > 0,
    /** Baja una página de Wikipedia (una por segundo como mucho) y la añade a las evidencias. */
    async traerPagina(titulo, idioma = 'en') {
      const espera = Math.max(0, ultima + 1000 - Date.now());
      if (espera) await new Promise((r) => setTimeout(r, espera));
      ultima = Date.now();
      try {
        const p = await traerWikipedia(titulo, { idioma, dir: dirNeuri, fetch });
        if (p) corpus.añadirFuente(p.f, p.meta, p.texto);
        return p;
      } catch (err) {
        registro.error?.(`[pet] No se pudo bajar «${titulo}» de Wikipedia: ${err.message}`);
        return null;
      }
    },
  };
}
