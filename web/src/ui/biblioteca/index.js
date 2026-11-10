// Biblioteca de estudio: el panel «Estudiar». Portada, buscador, filtros, recorridos, ficha de cada lección, la lección
// guiada con el visor 3D, las evaluaciones y los repasos. Se carga la primera vez que se abre el panel (main.js), y cada
// lección, la primera vez que se abre.
//
// El visor lo controla main.js a través de `api` (ver main.js, «Biblioteca de estudio»):
//   api.modelo()                         'male' | 'female'
//   api.mostrar(L, vista, opciones)      muestra en 3D lo que pide un paso o una pregunta → { ok, faltan }
//   api.resaltar(L, ids, { lado })       resalta y encuadra unas estructuras de la lección (con su ficha)
//   api.camara(nombre, lado)             gira la cámara a una vista (anterior, posterior, lateral…)
//   api.modoEvaluacion(on)               sin etiqueta, ficha, nombre al pasar el ratón ni buscador
//   api.alTocar(fn | null)               lo que se toca en el modelo va a `fn(pieza)` en lugar de seleccionarse
//   api.piezas()                         estructuras del modelo actual (para buscarlas) → [{ clave, nombre, latin, en, … }]
//   api.verEstructura(clave)             muestra una estructura del modelo (desde el buscador)
//   api.ajustar()                        el panel cambió de tamaño (en el móvil, el visor deja sitio)
//   api.abrirPanel()                     abre el panel «Estudiar» (un aviso lleva a una vista con el panel cerrado)
import * as P from '../../biblioteca/progreso.js';
import * as F from '../../biblioteca/filtros.js';
import { deModulo } from '../../biblioteca/modulos.js';
import { crearBuscador } from '../../biblioteca/buscar.js';
import { huella, retirada } from '../../biblioteca/evaluar.js';
import { RECORRIDOS, leccionesDeRecorrido } from '../../biblioteca/recorridos.js';
import { MODULOS } from '../../content/index.js';
import { sinonimosDePieza } from '../../content/index.js';
import { t } from '../../i18n/idioma.js';
import { renderPortada } from './portada.js';
import { renderResultados, renderRecorrido, renderInfo, renderSesion } from './explorar.js';
import { renderLeccion } from './leccion.js';
import { renderPreguntas, renderResultado, teclaPreguntas } from './preguntas.js';
import { crearNeuri } from './pet.js';
import * as PR from '../../biblioteca/propias.js';
import { renderMisLecciones } from './mis-lecciones.js';
import { renderMapa } from './mapa.js';
import { renderExamen } from './examen.js';
import { renderDatos } from './privacidad.js';
import { crearRegistroEventos } from '../../biblioteca/eventos.js';
import { enviarPendientes } from '../../biblioteca/reportes.js';

const ARCHIVOS = import.meta.glob('../../biblioteca/lecciones/*.js');
// Vistas que necesitan sitio (catálogo) y vistas que dejan el modelo a la vista (lección y preguntas).
const ANCHAS = new Set(['portada', 'resultados', 'recorrido', 'info', 'sesion', 'neuri', 'propias', 'mapa', 'examen', 'datos']);

export function createBiblioteca({ panel, body, storage, api, toast }) {
  const antiguas = new Map(MODULOS.map(deModulo).filter(Boolean).map((L) => [L.id, L]));
  const ctx = {
    body, api, toast,
    catalogo: null, catalogoBase: null, porId: new Map(), lecciones: new Map(antiguas), fuentes: null, buscador: null, estructuras: null,
    propias: [], storage,
    data: P.cargar(storage, { lecciones: antiguas }),
    vista: { tipo: 'portada' }, pila: [],
    busqueda: { texto: '', filtros: F.vacios(), orden: 'relevancia' },
    guardar() { if (!P.guardar(storage, ctx.data)) toast(t('estudio.noGuardado')); },
    estado(L, extra) { return P.estadoLeccion(ctx.data, L, extra); },
    terminada(id) { return ['completada', 'demostrada', 'dominada'].includes(ctx.estado(ctx.porId.get(id) ?? { id, pasos: 1, preguntas: 0 }).estado); },
    ir, volver, render, cargarLeccion, resumenRecorrido, recorridosDe,
    esPropia: (id) => ctx.propias.some((L) => L.id === id),
    /** Guarda una lección de Neuri en «Mis lecciones» y la añade al catálogo. Devuelve { ok, error? }. */
    guardarPropia(L) {
      const r = PR.guardarPropia(storage, L);
      if (r.ok) actualizarPropias();
      return r;
    },
    renombrarPropia(id, titulo) {
      const r = PR.renombrarPropia(storage, id, titulo);
      if (r.ok) actualizarPropias();
      return r;
    },
    importarPropias(texto) {
      const r = PR.importarPropias(storage, texto);
      if (r.ok) actualizarPropias();
      return r;
    },
    exportarPropias: () => PR.exportarPropias(storage),
    estadoPropias: () => PR.estadoPropias(storage),
    apartadasPropias: () => PR.apartadas(storage),
    descartarApartadas: () => PR.descartarApartadas(storage),
    /** Va a una vista aunque el panel esté cerrado (desde un aviso): lo abre en ella. */
    mostrar(vista) {
      if (panel.classList.contains('open')) return ir(vista);
      if (ctx.vista.tipo !== vista.tipo || ctx.vista.id !== vista.id) { ctx.pila.push(ctx.vista); ctx.vista = vista; }
      api.abrirPanel?.();
    },
    /** La lista de «Mis lecciones» (para liberar espacio o elegir una). */
    verMisLecciones() { ctx.mostrar({ tipo: 'propias' }); },
    borrarPropia(id) {
      const ok = PR.borrarPropia(storage, id);
      P.borrarLeccion(ctx.data, id);
      ctx.data.favoritos = ctx.data.favoritos.filter((x) => x !== id);
      ctx.guardar();
      actualizarPropias();
      return ok;
    },
  };
  /** Tras leer el progreso: lo de preguntas corregidas o retiradas de las lecciones ya cargadas deja de contar. */
  function depurarCargadas() {
    let n = 0;
    for (const L of ctx.lecciones.values()) n += P.depurar(ctx.data, L, huella, (q) => retirada(L.id, q));
    if (n) ctx.guardar();
  }
  depurarCargadas();
  // Estadísticas de uso (opcionales, desactivadas por defecto): eventos con forma controlada, solo en este navegador.
  ctx.eventos = crearRegistroEventos({ almacen: storage });
  ctx.evento = (tipo, props, opciones) => ctx.eventos.registrar(tipo, props, opciones);
  ctx.alReportar = (r) => ctx.evento('problema_reportado', { categoria: r.categoria, vista: r.vista }, { clave: r.id });
  /** Tras «Borrar mis datos»: el progreso y las lecciones propias en memoria también se olvidan. */
  ctx.olvidarDatos = () => {
    ctx.data = P.vacio();
    actualizarPropias();
    ctx.busqueda = { texto: '', filtros: F.vacios(), orden: 'relevancia' };
  };
  // Tiempo activo de una lección (solo con la página a la vista y con actividad en el último minuto).
  try {
    const actividad = () => ctx.crono?.actividad();
    // (también en el modelo 3D: girarlo o tocarlo durante una lección es estudiar)
    document.addEventListener('pointerdown', actividad, { passive: true });
    document.addEventListener('keydown', actividad, { passive: true });
    document.addEventListener('visibilitychange', () => ctx.crono?.visible(document.visibilityState === 'visible'));
  } catch { /* sin documento */ }
  // Neuri, el pet que recomienda lecciones (pet.js): su lanzador vive en el panel y su conversación es la vista «neuri».
  ctx.neuri = crearNeuri(ctx, panel);
  // Otra pestaña guardó o quitó lecciones propias: el catálogo y, si está a la vista, la sección de la portada.
  try {
    addEventListener('storage', (e) => {
      if (e.key !== PR.CLAVE_PROPIAS) return;
      actualizarPropias();
      if (ctx.vista.tipo === 'portada' || ctx.vista.tipo === 'propias') ctx.repintarPropias?.();
    });
  } catch { /* sin ventana */ }
  // Si el progreso se migró desde la versión anterior, se guarda ya en el formato nuevo (la clave antigua no se toca).
  if (ctx.data.migracion && !storage?.getItem?.(P.CLAVE)) ctx.guardar();

  async function cargarCatalogo() {
    if (ctx.catalogo) return;
    ctx.catalogoBase = (await import('../../biblioteca/generado/catalogo.json')).default;
    actualizarPropias();
  }

  /** «Mis lecciones» (las de Neuri, en este navegador) se suman al catálogo, al buscador y a las lecciones cargadas. */
  function actualizarPropias() {
    if (!ctx.catalogoBase) return;
    for (const L of ctx.propias) ctx.lecciones.delete(L.id);
    ctx.propias = PR.cargarPropias(storage);
    for (const L of ctx.propias) ctx.lecciones.set(L.id, L);
    const base = ctx.catalogoBase;
    // Requisitos y «siguiente» de las propias se conservan si apuntan a lecciones que existen.
    const ids = new Set([...base.lecciones.map((L) => L.id), ...ctx.propias.map((L) => L.id)]);
    // Las lecciones retiradas mientras se revisa un reporte no se ofrecen (src/biblioteca/retiradas.js).
    ctx.catalogo = { ...base, lecciones: [...base.lecciones.filter((L) => !retirada(L.id)), ...ctx.propias.map((L, i) => PR.entradaCatalogo(L, 1000 + i, (id) => ids.has(id)))] };
    ctx.porId = new Map(ctx.catalogo.lecciones.map((L) => [L.id, L]));
    ctx.buscador = crearBuscador({ lecciones: ctx.catalogo.lecciones, recorridos: RECORRIDOS, estructuras: ctx.estructuras?.lista ?? [] });
  }
  ctx.actualizarPropias = actualizarPropias;

  /** Estructuras del modelo para el buscador (se piden la primera vez que se busca y al cambiar de modelo). */
  async function cargarEstructuras() {
    const modelo = api.modelo();
    if (ctx.estructuras?.modelo === modelo) return;
    const lista = await api.piezas();
    const conSinonimos = lista.map((e) => ({ ...e, sinonimos: sinonimosDePieza(e.clave, modelo) }));
    ctx.estructuras = { modelo, lista: conSinonimos };
    ctx.buscador = crearBuscador({ lecciones: ctx.catalogo.lecciones, recorridos: RECORRIDOS, estructuras: conSinonimos });   // con las propias
  }
  ctx.cargarEstructuras = cargarEstructuras;

  async function cargarLeccion(id) {
    if (ctx.lecciones.has(id)) return ctx.lecciones.get(id);
    const f = ARCHIVOS[`../../biblioteca/lecciones/${id}.js`];
    if (!f) return null;
    const L = (await f()).default;
    ctx.lecciones.set(id, L);
    // Preguntas corregidas o retiradas desde la última vez: sus fallos anteriores dejan de contar.
    if (P.depurar(ctx.data, L, huella, (q) => retirada(L.id, q))) ctx.guardar();
    ctx.fuentes ??= (await import('../../biblioteca/generado/fuentes.json')).default;
    return L;
  }

  /** Avance de un recorrido: lecciones disponibles, hechas y minutos (las que aún no existen no cuentan). */
  function resumenRecorrido(R) {
    const ids = leccionesDeRecorrido(R);
    const disp = ids.filter((id) => ctx.porId.has(id));
    return {
      total: ids.length, disponibles: disp.length,
      hechas: disp.filter((id) => ctx.terminada(id)).length,
      minutos: disp.reduce((n, id) => n + ctx.porId.get(id).minutos, 0),
    };
  }
  function recorridosDe(id) {
    return RECORRIDOS.filter((R) => leccionesDeRecorrido(R).includes(id));
  }

  function ir(vista, { reemplazar = false } = {}) {
    if (!reemplazar) ctx.pila.push(ctx.vista);
    if (ctx.pila.length > 30) ctx.pila.shift();
    ctx.vista = vista;
    render();
  }
  function volver() {
    ctx.vista = ctx.pila.pop() ?? { tipo: 'portada' };
    render();
  }

  async function render() {
    await cargarCatalogo();
    const v = ctx.vista;
    panel.classList.toggle('ancho', ANCHAS.has(v.tipo));
    ctx.neuri.actualizar(v);
    api.ajustar();
    if (!['preguntas'].includes(v.tipo)) { api.modoEvaluacion(false); api.alTocar(null); }
    if (v.tipo === 'resultados') return renderResultados(ctx);
    if (v.tipo === 'recorrido') return renderRecorrido(ctx);
    if (v.tipo === 'info') return renderInfo(ctx);
    if (v.tipo === 'sesion') return renderSesion(ctx);
    if (v.tipo === 'leccion') return renderLeccion(ctx);
    if (v.tipo === 'preguntas') return renderPreguntas(ctx);
    if (v.tipo === 'resultado') return renderResultado(ctx);
    if (v.tipo === 'neuri') return ctx.neuri.renderVista();
    if (v.tipo === 'propias') return renderMisLecciones(ctx);
    if (v.tipo === 'mapa') return renderMapa(ctx);
    if (v.tipo === 'examen') return renderExamen(ctx);
    if (v.tipo === 'datos') return renderDatos(ctx);
    return renderPortada(ctx);
  }

  return {
    abrir() {
      ctx.data = P.cargar(storage, { lecciones: antiguas });
      actualizarPropias();                                  // otra pestaña pudo crear o borrar lecciones propias
      depurarCargadas();
      enviarPendientes({ almacen: storage }).catch(() => {});   // reportes que no se pudieron enviar
      return render();
    },
    // Cambio de idioma o de modelo: rehace la vista actual (sin mover la cámara ni cambiar la pregunta).
    refrescar({ modelo = false } = {}) {
      if (modelo) ctx.estructuras = null;
      if (panel.classList.contains('open')) render();
    },
    cerrar() {
      if (ctx.vista.tipo === 'preguntas') { api.modoEvaluacion(false); api.alTocar(null); ctx.vista = ctx.vista.vuelta ?? { tipo: 'portada' }; }
      panel.classList.remove('ancho');
    },
    enEvaluacion: () => ctx.vista.tipo === 'preguntas' && !ctx.vista.respuesta,
    onKey(e) {
      if (ctx.vista.tipo === 'preguntas') return teclaPreguntas(ctx, e);
      if (ctx.vista.tipo === 'leccion' && !e.target.matches?.('input, textarea, select') && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
        const b = body.querySelector(e.key === 'ArrowRight' ? '[data-paso="siguiente"]' : '[data-paso="anterior"]');
        if (b && !b.disabled) { b.click(); return true; }
      }
      return false;
    },
  };
}
