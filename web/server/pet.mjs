// Servidor de Neuri, el asistente de «Estudiar»: recibe la petición de la app, pregunta a Claude en el modo que toca
// (orientar, planificar, redactar o adaptar) y devuelve lo que la app puede mostrar o guardar. La clave de la API solo
// vive aquí, en el servidor; nunca llega al navegador.
//
// Es una función estándar (Request → Response) para poder usarla en cualquier sitio: en desarrollo la monta
// server/vite-pet.mjs dentro de `npm run dev` y `npm run preview`; al publicar, una función del alojamiento.
//
// Lo que la IA propone se comprueba aquí antes de que llegue a nadie:
//  - Orientar: solo lecciones y recorridos que existen; una explicación solo con evidencias citadas.
//  - Planificar: solo estructuras del inventario de los modelos; objetivos, pasos y duración según el formato.
//  - Redactar y adaptar: la lección se ensambla en el formato de la biblioteca, pasa su revisor, cada cita es una frase
//    literal de su fuente y otra llamada comprueba que cada cita respalda lo que se afirma (lo que no, se quita). Si
//    queda algún error, una ronda de corrección; si sigue, no se entrega.
// Protecciones: solo la propia web, tamaños y turnos limitados (src/pet/protocolo.js), límites de uso por dirección y
// por hora, y nada de lo que escribe nadie se guarda ni se registra.
import { VERSION, LIMITES, validarPeticion, limpiarRespuesta, limpiarPlan, ID_PROPIA } from '../src/pet/protocolo.js';
import { RECORRIDOS } from '../src/biblioteca/recorridos.js';
import { RETIRADAS } from '../src/biblioteca/retiradas.js';
import { REGIONES, SISTEMAS, TEMAS, FORMATOS, SUBREGION_POR_ID, REGION_POR_ID } from '../src/biblioteca/taxonomia.js';
import { frases, evidencias as evidenciasDe, objetivoObservable, TIPOS_PASO } from '../src/biblioteca/formato.js';
import { crearBuscador } from '../src/biblioteca/buscar.js';
import { ESPECIFICACION, APP, textoModo, esquemaOrientar, esquemaPlan, esquemaLeccion, esquemaVerificar, VERSION_INSTRUCCIONES } from './neuri/instrucciones.mjs';
import { crearRegistro } from './neuri/trabajos.mjs';
import { textoCatalogo, textoContexto, textoEvidencias, textoSolicitud, textoPlan, textoBase, mensajesApi } from './pet-prompt.mjs';
import { llamar, crearCliente, elegirModelo, ErrorNeuri, MODELO_POR_DEFECTO } from './neuri/modelo.mjs';
import { ensamblarLeccion, validarLeccion, afirmaciones, quitarNoRespaldadas, idLeccion } from './neuri/ensamblar.mjs';

export { elegirModelo, MODELO_POR_DEFECTO };

const LIMITE_POR_DEFECTO = { porIp: 20, ventanaIp: 10 * 60_000, porHora: 200 };
const LIMITE_LECCIONES = { porIp: 4, ventanaIp: 60 * 60_000, porHora: 20 };
const MIN_EVIDENCIAS = 8;
// Plazos de cada llamada a Claude (con un reintento del SDK si falla la red o la API está saturada). La app espera algo
// más que la suma de lo que puede tardar cada modo (src/pet/conversacion.js).
const PLAZO = { orientar: 30_000, verificarExplicacion: 30_000, planificar: 60_000, redactar: 240_000, verificar: 120_000 };

/**
 * Prepara el manejador. `catalogo`: el de src/biblioteca/generado/catalogo.json. `clave`: la de la API (sin clave,
 * «sin-ia» y la app usa su buscador). `recursos`: función que carga inventario, evidencias y lecciones
 * (server/neuri/recursos.mjs); sin ella, solo Orientar y sin explicaciones. `cliente`: otro cliente (pruebas).
 */
export function crearManejador({
  catalogo: catalogoEntero, clave = null, modelo: pedido = MODELO_POR_DEFECTO, modeloLecciones: pedidoLecciones = null,
  cliente = null, recursos = null, ahora = Date.now, limites = {}, limitesLecciones = {}, registro = console, azar = Math.random,
  trabajos = crearRegistro({ ahora }),
}) {
  const modelo = elegirModelo(pedido, registro);
  const modeloLecciones = elegirModelo(pedidoLecciones ?? modelo, registro);
  // Lo retirado mientras se revisa un reporte (src/biblioteca/retiradas.js) tampoco existe para Neuri: Claude no lo ve
  // en el catálogo, no lo recomienda ni lo adapta (la app ya lo quita del suyo).
  const catalogo = { ...catalogoEntero, lecciones: catalogoEntero.lecciones.filter((L) => !RETIRADAS.lecciones.includes(L.id)) };
  const ids = { lecciones: new Set(catalogo.lecciones.map((L) => L.id)), recorridos: new Set(RECORRIDOS.map((R) => R.id)) };
  const fijo = `${ESPECIFICACION}\n\n${APP}\n\n${textoCatalogo(catalogo)}`;
  const api = cliente ?? crearCliente(clave);
  const limitar = crearLimitador({ ...LIMITE_POR_DEFECTO, ...limites, ahora });
  const limitarLecciones = crearLimitador({ ...LIMITE_LECCIONES, ...limitesLecciones, ahora });
  const buscadorTemas = crearBuscador({ lecciones: catalogo.lecciones, recorridos: RECORRIDOS });
  let cargando = null;
  const recursosListos = () => (recursos ? (cargando ??= Promise.resolve().then(() => recursos()).catch((err) => { cargando = null; registro.error?.('[pet] No se pudieron cargar los recursos de Neuri:', err); return null; })) : Promise.resolve(null));

  // Salud del servicio: si la última llamada de verdad a Claude salió bien o falló. Distingue «configurado» (hay clave),
  // «comprobado» (una llamada salió bien) y «fallando» (la última falló: red, saldo, clave rechazada…).
  const salud = { ok: null, fallo: null };
  async function llamarClaude(opciones) {
    try {
      const r = await llamar(api, { registro, ...opciones });
      salud.ok = ahora();
      return r;
    } catch (err) {
      if (err instanceof ErrorNeuri && !['cancelada', 'rechazo', 'formato', 'incompleta'].includes(err.codigo)) salud.fallo = { codigo: err.codigo, fecha: ahora() };
      throw err;
    }
  }
  const estadoServicio = () => (!api ? 'sin-clave' : salud.fallo && (!salud.ok || salud.fallo.fecha >= salud.ok) ? 'fallando' : salud.ok ? 'comprobada' : 'configurada');

  return async function manejar(request, { ip = '' } = {}) {
    if (request.method === 'GET') {
      const R = api ? await recursosListos() : null;
      return json(200, { ok: true, ia: !!api, crear: !!api && !!R?.disponible, version: VERSION, estado: estadoServicio(), instrucciones: VERSION_INSTRUCCIONES });
    }
    if (request.method !== 'POST') return json(405, { ok: false, error: 'metodo' }, { allow: 'GET, POST' });
    if (!mismoOrigen(request)) return json(403, { ok: false, error: 'origen' });
    const crudo = await leerCuerpo(request);
    if (crudo === null) return json(413, { ok: false, error: 'largo' });
    let cuerpo;
    try { cuerpo = JSON.parse(crudo); } catch { return json(400, { ok: false, error: 'formato' }); }
    const v = validarPeticion(cuerpo, ids);
    if (!v.ok) return json(400, { ok: false, error: v.error });
    const peticion = v.peticion;
    // Un trabajo de creación: cancelarlo, o volver a conectarse a él (tras recargar la página, sin repetirlo).
    if (peticion.modo === 'cancelar') return json(200, { ok: true, cancelado: trabajos.cancelar(peticion.trabajo) });
    if (peticion.modo === 'trabajo') return trabajos.tiene(peticion.trabajo) ? flujoTrabajo(trabajos, peticion.trabajo) : json(404, { ok: false, error: 'trabajo-desconocido' });
    // Lo demás necesita la IA (cancelar o retomar un trabajo, no: sin clave, el servidor no tiene ninguno y lo dice).
    if (!api) return json(503, { ok: false, error: 'sin-ia' });
    const largo = peticion.modo === 'redactar' || peticion.modo === 'adaptar';
    // Pedir otra vez un trabajo que ya existe lo reanuda: no cuenta para el límite ni se repite (ni se paga dos veces).
    if (largo && peticion.trabajo && trabajos.tiene(peticion.trabajo)) return flujoTrabajo(trabajos, peticion.trabajo);
    const limite = (largo ? limitarLecciones : limitar)(ip);
    if (limite) return json(429, { ok: false, error: limite }, { 'retry-after': '60' });

    if (largo && peticion.trabajo) {
      const r = trabajos.empezar(peticion.trabajo, ip, (emitir, signal) => redactar(peticion, emitir, signal));
      if (r.motivo) return json(429, { ok: false, error: r.motivo }, { 'retry-after': '60' });
      return flujoTrabajo(trabajos, peticion.trabajo);
    }
    if (largo) return flujo((emitir, signal) => redactar(peticion, emitir, signal));
    // Las peticiones cortas se cortan si la app se va (la petición trae su señal): no se sigue gastando.
    const signal = request.signal ?? null;
    try {
      const r = peticion.modo === 'planificar' ? await planificar(peticion, signal) : await orientar(peticion, signal);
      return json(200, { ok: true, ...r });
    } catch (err) {
      if (err instanceof ErrorNeuri) return json(err.status, { ok: false, error: err.codigo });
      throw err;
    }
  };

  // ── Orientar ──
  async function orientar(p, signal = null) {
    const idsL = new Set([...ids.lecciones, ...p.propias.map((x) => x.id)]);
    const R = await recursosListos();
    const consulta = `${p.mensajes.at(-1).texto} ${p.contexto.tema ?? ''}`;
    const mapa = new Map();
    if (R) {
      const deLecciones = R.corpus.buscar(consulta, { max: 6, soloLecciones: true, porFuente: 3 });
      const dePaginas = R.corpus.buscar(consulta, { max: 4, soloPaginas: true, porFuente: 2 });
      // Solo las que de verdad tratan la consulta: con al menos la mitad de su información y no muy por debajo de la mejor.
      const mejor = Math.max(0, ...[...deLecciones, ...dePaginas].map((x) => x.puntos));
      for (const x of [...deLecciones, ...dePaginas].filter((x) => x.cobertura >= 0.5 && x.puntos >= mejor * 0.35)) mapa.set(`E${mapa.size + 1}`, x.entrada);
    }
    const variable = [textoModo('orientar', { idioma: p.idioma }), textoContexto(p), R ? textoEvidencias(mapa, R.corpus) : 'EVIDENCIAS: no disponibles en este servidor.'].join('\n\n');
    const { datos, modelo: usado } = await llamarClaude({
      modelo, sistema: [fijo, variable], mensajes: mensajesApi(p.mensajes), esquema: esquemaOrientar({ lecciones: idsL, recorridos: ids.recorridos }),
      esfuerzo: 'low', maxTokens: 3000, etiqueta: 'orientar', signal, plazoMs: PLAZO.orientar,
    });
    // Las evidencias citadas, con su fuente, para que la app las enseñe y enlace.
    datos.evidencias = (datos.evidencias ?? []).map((id) => mapa.get(id)).filter(Boolean).map((e) => {
      const c = e.citas.find((x) => x.f) ?? e.citas[0];
      const meta = c.f ? R.corpus.fuente(c.f) : null;
      return { cita: c.c ?? e.texto, texto: e.texto ?? null, f: c.f ?? '', titulo: meta?.titulo ?? '', url: meta?.url ?? null, licencia: meta?.licencia ?? '', leccion: e.leccion ?? null, paso: e.paso ?? null };
    });
    const r = limpiarRespuesta(datos, { lecciones: idsL, recorridos: ids.recorridos });
    if (!r) throw new ErrorNeuri('ia');
    // Una explicación sin evidencias no se presenta como tal: la app avisa de que no cita fuentes.
    if (r.tipo === 'explicacion' && !r.evidencias.length) r.aviso = 'sin-evidencia';
    // Con evidencias, otra llamada comprueba que las citas respaldan lo que dice (como en las lecciones). Si no (o si no
    // se puede comprobar), la explicación se retira: la app enseña solo las citas, que son frases literales de las fuentes.
    if (r.tipo === 'explicacion' && r.evidencias.length && !(await explicacionRespaldada(r, signal))) {
      r.aviso = 'sin-respaldo';
      r.mensaje = '[Explicación retirada: sus citas no la respaldaban del todo; la app mostró solo las citas.]';
    }
    return { ...r, modelo: usado };
  }

  async function explicacionRespaldada(r, signal = null) {
    const citas = r.evidencias.map((e) => `“${e.cita}”${e.texto ? ` (frase de la lección: «${e.texto}»)` : ''}`).join(' | ');
    try {
      const v = await llamarClaude({
        modelo, sistema: [fijo, textoModo('verificar')], esquema: esquemaVerificar(), esfuerzo: 'low', maxTokens: 2000, etiqueta: 'verificar explicación',
        mensajes: [{ role: 'user', content: `1. Afirmación: «${r.mensaje}»\n   Citas: ${citas}` }], signal, plazoMs: PLAZO.verificarExplicacion,
      });
      return v.datos.veredictos?.find((x) => x.n === 1)?.respalda === 'si';
    } catch (err) {
      registro.error?.(`[pet] No se pudo comprobar una explicación (${err.codigo ?? err.message}): se retira.`);
      return false;
    }
  }

  // ── Planificar ──
  async function planificar(p, signal = null) {
    const R = await recursosListos();
    if (!R?.disponible) throw new ErrorNeuri('sin-recursos', 503);
    const s = p.solicitud;
    const base = s.accion === 'adaptar' ? leccionBase(R, s.leccion_base, p.basePropia) : null;
    if (s.accion === 'adaptar' && !base) throw new ErrorNeuri('base', 400);
    const temaTexto = `${s.tema} ${s.objetivo} ${s.enfoque} ${(s.terminos ?? []).join(' ')}`;
    const candidatas = candidatasDe(R, s, temaTexto, base);
    if (!candidatas.length) return { tipo: 'limitacion', codigo: 'sin-estructuras', mensaje: '', plan: null, sugerencias: [] };
    const cuentas = Object.fromEntries(candidatas.map((k) => [k, R.corpus.cuantas(nombresDe(R, k))]));
    const lista = candidatas.map((k) => {
      const e = R.inventario.estructuras[k];
      return `${k} — ${R.inventario.nombre(k, p.idioma)} (${e.tipo}; ${e.lugares.map(([r, x]) => [REGION_POR_ID.get(r)?.nombre, x && SUBREGION_POR_ID.get(x)?.nombre].filter(Boolean).join(' › ')).join(', ') || 'sin región'}; ${e.lado}; ${e.modelos.join(' y ')}; evidencias: ${cuentas[k]})`;
    });
    const variable = [
      textoModo('planificar', { idioma: p.idioma }), textoSolicitud(s), base ? textoBase(base) : '',
      `ESTRUCTURAS DISPONIBLES, de más a menos relacionadas con la solicitud (clave — nombre (tipo; lugar; lado; modelos; evidencias)):\n${lista.join('\n')}`,
    ].filter(Boolean).join('\n\n');
    const esquema = esquemaPlan({
      claves: candidatas, formatos: FORMATOS.map((x) => x.id), sistemas: SISTEMAS.map((x) => x.id), temas: TEMAS.map((x) => x.id),
      regiones: REGIONES.map((r) => ({ id: r.id, sub: r.sub.map((x) => x.id) })),
    });
    const mensajes = [...mensajesApi(p.mensajes), { role: 'user', content: '[La persona pulsó «Planificar» en la propuesta.]' }];
    const opcionesPlan = { modelo: modeloLecciones, sistema: [fijo, variable], esquema, esfuerzo: 'medium', maxTokens: 8000, signal, plazoMs: PLAZO.planificar, trabajo: p.trabajo };
    let { datos, modelo: usado } = await llamarClaude({ ...opcionesPlan, mensajes, etiqueta: 'planificar' });
    if (datos.tipo !== 'plan' || !datos.plan) return { tipo: datos.tipo === 'aclaracion' ? 'aclaracion' : 'limitacion', mensaje: String(datos.mensaje ?? '').slice(0, LIMITES.pet), plan: null, sugerencias: (datos.sugerencias ?? []).slice(0, LIMITES.sugerencias), modelo: usado };
    let rev = revisarPlan(datos.plan, { candidatas: new Set(candidatas), idioma: p.idioma });
    if (rev.errores.length) {
      // Una ronda de corrección con los problemas concretos.
      const correccion = [...mensajes, { role: 'assistant', content: JSON.stringify(datos) }, { role: 'user', content: `[La app encontró estos problemas en el plan: ${rev.errores.join(' · ')}. Devuelve el plan corregido completo.]` }];
      ({ datos, modelo: usado } = await llamarClaude({ ...opcionesPlan, mensajes: correccion, etiqueta: 'planificar (corrección)' }));
      if (datos.tipo !== 'plan' || !datos.plan) return { tipo: 'limitacion', mensaje: String(datos.mensaje ?? '').slice(0, LIMITES.pet), plan: null, sugerencias: [], modelo: usado };
      rev = revisarPlan(datos.plan, { candidatas: new Set(candidatas), idioma: p.idioma });
      if (rev.errores.length) return { tipo: 'limitacion', codigo: 'plan-invalido', errores: rev.errores.slice(0, 6), mensaje: '', plan: null, sugerencias: [], modelo: usado };
    }
    const plan = rev.plan;
    plan.accion = s.accion;
    plan.base = base?.id ?? null;
    // Si al núcleo le faltan evidencias, las páginas de Wikipedia que propuso (como mucho 4) se bajan ya.
    const pocas = plan.estructuras.filter((e) => e.papel === 'nucleo' && (cuentas[e.clave] ?? 0) < 3);
    const nuevas = [];
    if (pocas.length && plan.paginas.length) {
      for (const titulo of plan.paginas.slice(0, 4)) {
        const pag = await R.traerPagina(titulo, 'en');
        if (pag) nuevas.push({ titulo: pag.meta.titulo, url: pag.meta.url });
      }
    }
    const evidencia = Object.fromEntries(plan.estructuras.map((e) => [e.clave, R.corpus.cuantas(nombresDe(R, e.clave))]));
    return {
      tipo: 'plan', mensaje: String(datos.mensaje ?? '').slice(0, LIMITES.pet), plan, sugerencias: (datos.sugerencias ?? []).slice(0, LIMITES.sugerencias),
      estructuras: Object.fromEntries(plan.estructuras.map((e) => [e.clave, { nombre: R.inventario.nombre(e.clave, p.idioma), evidencias: evidencia[e.clave] }])),
      paginas: nuevas, modelo: usado,
    };
  }

  // ── Redactar y adaptar (en flujo: la app va enseñando cada estado) ──
  async function redactar(p, emitir, signal = null) {
    const R = await recursosListos();
    if (!R?.disponible) return emitir({ estado: 'error', error: 'sin-recursos' });
    emitir({ estado: 'fuentes' });
    const modo = p.modo;
    const base = modo === 'adaptar' ? leccionBase(R, p.plan.base, p.basePropia) : null;
    if (modo === 'adaptar' && !base) return emitir({ estado: 'error', error: 'base' });
    const rev = revisarPlan(p.plan, { candidatas: new Set(R.inventario.claves), idioma: p.idioma });
    if (rev.errores.length) return emitir({ estado: 'error', error: 'plan', errores: rev.errores.slice(0, 6) });
    const plan = { ...rev.plan, accion: p.plan.accion, base: p.plan.base };
    for (const titulo of plan.paginas.slice(0, 4)) if (!signal?.aborted && !R.corpus.tieneFuente(`wp:${titulo.replace(/ /g, '_')}`)) await R.traerPagina(titulo, 'en');
    if (signal?.aborted) return;
    const mapa = elegirEvidencias(R, plan, base, p.idioma);
    if (mapa.size < MIN_EVIDENCIAS) return emitir({ estado: 'limitacion', codigo: 'pocas-evidencias', evidencias: mapa.size });
    emitir({ estado: 'redactando', evidencias: mapa.size });

    const nombre = (k) => R.inventario.nombre(k, p.idioma);
    const variable = [textoModo(modo, { idioma: p.idioma }), textoPlan(plan, nombre), base ? textoBase(base) : '', textoEvidencias(mapa, R.corpus)].filter(Boolean).join('\n\n');
    const esquema = esquemaLeccion({ claves: plan.estructuras.map((e) => e.clave), evidencias: [...mapa.keys()] });
    const pedir = [{ role: 'user', content: `[La persona pulsó «${modo === 'adaptar' ? 'Crear la adaptación' : 'Crear la lección'}» en el plan.]` }];
    const opciones = { modelo: modeloLecciones, sistema: [fijo, variable], esquema, esfuerzo: 'medium', maxTokens: 32000, flujo: true, signal, plazoMs: PLAZO.redactar, trabajo: p.trabajo };
    let gasto = 0;
    let r;
    try { r = await llamarClaude({ ...opciones, mensajes: pedir, etiqueta: modo }); } catch (err) { return emitir(errorEvento(err)); }
    gasto += r.coste ?? 0;
    if (r.datos.tipo !== 'leccion' || !r.datos.leccion) return emitir({ estado: 'limitacion', mensaje: String(r.datos.mensaje ?? '').slice(0, LIMITES.pet) });

    const id = idLeccion(plan.titulo, azar);
    const fuentes = fuentesDe(R, mapa);
    const montar = async (datos) => {
      const { L, quitado } = ensamblarLeccion({ plan, borrador: datos.leccion, evidencias: mapa, inventario: R.inventario, idioma: p.idioma, id, modo, base: base?.id ?? null, modeloIA: r.modelo, fuentes, instrucciones: VERSION_INSTRUCCIONES });
      emitir({ estado: 'comprobando' });
      const lista = afirmaciones(L);
      let quitadas = [];
      let problemas = [];
      if (lista.length) {
        const v = await llamarClaude({
          modelo: modeloLecciones, sistema: [fijo, textoModo('verificar')], esquema: esquemaVerificar(), esfuerzo: 'low', maxTokens: 12000, etiqueta: 'verificar', signal, plazoMs: PLAZO.verificar, trabajo: p.trabajo,
          mensajes: [{ role: 'user', content: lista.map((a) => `${a.n}. ${a.pregunta ? 'Pregunta' : 'Afirmación'}: «${a.texto}»\n   Citas: ${a.citas.map((c) => `“${c}”`).join(' | ')}`).join('\n') }],
        });
        gasto += v.coste ?? 0;
        const veredictos = (v.datos.veredictos ?? []).filter((x) => Number.isInteger(x.n));
        // Lo que no tiene veredicto cuenta como no respaldado.
        const conVeredicto = new Set(veredictos.map((x) => x.n));
        for (const a of lista) if (!conVeredicto.has(a.n)) veredictos.push({ n: a.n, respalda: 'no', categoria: 'sin-respaldo', gravedad: null, evidencia: null, reparacion: null, duda: true });
        // Los problemas, con su categoría y la reparación que sugiere la comprobación (para la ronda de corrección).
        problemas = veredictos.filter((x) => x.respalda !== 'si').map((x) => ({ ...x, texto: lista.find((a) => a.n === x.n)?.texto ?? '' }));
        quitadas = quitarNoRespaldadas(L, lista, veredictos);
      }
      const val = validarLeccion(L, { inventario: R.inventario, citaEnFuente: R.corpus.citaEnFuente, fuentes });
      return { L, quitado, quitadas, problemas, val, afirmadas: lista.length };
    };
    let res;
    try { res = await montar(r.datos); } catch (err) { return emitir(errorEvento(err)); }
    if (res.val.errores.length || res.quitadas.length > Math.max(3, res.afirmadas * 0.25)) {
      emitir({ estado: 'corrigiendo', errores: res.val.errores.length + res.quitadas.length });
      const problemas = [
        ...res.val.errores,
        ...res.problemas.map((x) => `${x.categoria ?? 'sin-respaldo'}${x.gravedad ? ` (${x.gravedad})` : ''}: «${x.texto.slice(0, 160)}»${x.evidencia ? ` — la cita dice: ${x.evidencia.slice(0, 160)}` : ''}${x.reparacion ? ` — reparación: ${x.reparacion.slice(0, 160)}` : ' — reformúlala con lo que dicen sus citas o quítala'}`),
        ...res.quitado.slice(0, 10),
      ].slice(0, 30);
      const correccion = [...pedir, { role: 'assistant', content: JSON.stringify(r.datos) }, { role: 'user', content: `[La app encontró estos problemas: ${problemas.join(' · ')}. Corrige solo lo necesario, conserva las evidencias válidas y devuelve la lección completa en el mismo formato.]` }];
      try {
        r = await llamarClaude({ ...opciones, mensajes: correccion, etiqueta: `${modo} (corrección)` });
        gasto += r.coste ?? 0;
        if (r.datos.tipo !== 'leccion' || !r.datos.leccion) return emitir({ estado: 'limitacion', mensaje: String(r.datos.mensaje ?? '').slice(0, LIMITES.pet) });
        res = await montar(r.datos);
      } catch (err) { return emitir(errorEvento(err)); }
    }
    if (res.val.errores.length) return emitir({ estado: 'error', error: 'validacion', errores: res.val.errores.slice(0, 8) });
    const L = res.L;
    const citas = L.pasos.reduce((n, x) => n + [...x.texto, ...(x.detalle ?? [])].reduce((m, f) => m + f.slice(1).filter((e) => e?.f || e?.m).length, 0), 0);
    // (Sin el título: puede decir algo de la persona; el registro técnico solo lleva identificadores y cifras.)
    registro.info?.(`[pet] ${modo}${p.trabajo ? ` · trabajo ${p.trabajo}` : ''}: lección ${L.id} lista (${L.pasos.length} pasos, ${L.preguntas.length} preguntas, ${citas} citas; ≈ ${gasto.toFixed(4)} US$ en total).`);
    // Lo que la comprobación quitó, por categoría (anexo C), y cuántas dudas necesitarían una revisión humana.
    const porCategoria = {};
    for (const x of res.problemas) porCategoria[x.categoria ?? 'sin-respaldo'] = (porCategoria[x.categoria ?? 'sin-respaldo'] ?? 0) + 1;
    return emitir({
      estado: 'lista', leccion: L, mensaje: String(r.datos.mensaje ?? '').slice(0, LIMITES.pet),
      informe: {
        pasos: L.pasos.length, preguntas: L.preguntas.length, citas, quitadas: res.quitadas.length + res.quitado.length, avisos: res.val.avisos.slice(0, 5),
        problemas: porCategoria, dudas: res.problemas.filter((x) => x.duda).length, instrucciones: VERSION_INSTRUCCIONES,
      },
    });
  }

  /** Nombres de una estructura en todos los idiomas (para contar y buscar sus evidencias). */
  function nombresDe(R, clave) {
    const e = R.inventario.estructuras[clave];
    return [e?.en, e?.la, e?.es].filter(Boolean);
  }

  /**
   * Las estructuras entre las que se planifica, de más a menos relacionadas con la solicitud: por sus nombres, su tipo,
   * su lugar y su sistema (lo que entiende el buscador de la biblioteca en el tema), las de las lecciones de ese tema y
   * las que nombran sus mejores evidencias («músculos de la masticación» → masetero, temporal, pterigoideos…).
   */
  function candidatasDe(R, s, temaTexto, base) {
    // El buscador de la biblioteca entiende el tema y los términos en inglés (lugares, sistemas, temas y lecciones).
    const busquedas = [s.tema, temaTexto, ...(s.terminos ?? []).slice(0, 6)].map((q) => buscadorTemas.buscar(q));
    const lugares = busquedas.flatMap((f) => f.lugares).map((l) => [l.region, l.sub ?? null])
      .filter(([r, x], i, a) => a.findIndex(([r2, x2]) => r2 === r && x2 === x) === i);
    const materias = busquedas.flatMap((f) => f.materias);
    const relacionadas = new Map();
    const subir = (k, p) => { if (R.inventario.estructuras[k]) relacionadas.set(k, Math.max(relacionadas.get(k) ?? 0, p)); };
    // Las estructuras de las lecciones del tema, más cuanto mejor encaja la lección.
    const lecciones = busquedas.flatMap((f) => f.lecciones.slice(0, 2));
    const mejorLeccion = Math.max(1, ...lecciones.map((L) => L.puntuacion ?? 0));
    for (const L of lecciones) {
      const rel = (L.puntuacion ?? 0) / mejorLeccion;
      for (const e of Object.values(R.lecciones.get(L.id)?.estructuras ?? {})) subir(e.piezas?.[0], e.papel === 'nucleo' ? 4 + 6 * rel : 1 + 2 * rel);
    }
    // Las que nombran las mejores evidencias del tema (solo las que de verdad tratan de él).
    const res = R.corpus.buscar(temaTexto, { max: 40, porFuente: 6 });
    const mejor = res[0]?.puntos ?? 0;
    const pesos = new Map();
    for (const x of res.filter((y) => y.puntos >= mejor * 0.45)) {
      for (const [k] of R.inventario.mencionadas([`${x.entrada.texto ?? ''} ${x.entrada.citas.map((c) => c.c).join(' ')}`])) pesos.set(k, (pesos.get(k) ?? 0) + x.puntos / mejor);
    }
    for (const [k, w] of pesos) subir(k, Math.min(8, 4 * w));
    const clavesBase = base ? Object.values(base.estructuras).map((e) => e.piezas?.[0]).filter((k) => R.inventario.estructuras[k]) : [];
    return R.inventario.candidatas({
      texto: temaTexto, lugares, sistemas: materias.filter((m) => m.sistema).map((m) => m.sistema), temas: materias.filter((m) => m.tema).map((m) => m.tema),
      relacionadas, extra: clavesBase,
    });
  }

  /** Evidencias numeradas para redactar: las de la lección base (si se adapta) y las mejores de cada estructura y paso. */
  function elegirEvidencias(R, plan, base, idioma) {
    const elegidas = [];
    const vistas = new Set();
    const meter = (e) => { if (!vistas.has(e.id) && elegidas.length < 150) { vistas.add(e.id); elegidas.push(e); } };
    if (base) {
      base.pasos.forEach((paso) => {
        [...frases(paso.texto), ...frases(paso.detalle)].forEach((fr, k) => {
          const evs = evidenciasDe(fr);
          if (!evs.length) return;
          const citas = evs.map((e) => (e.m ? { m: e.m, c: fr[0] } : { f: e.f, c: e.c })).filter((c) => c.m || R.corpus.citaEnFuente(c.f, c.c) !== false);
          if (citas.length) meter({ id: `B:${base.id}#${paso.id}#${k}`, citas, texto: fr[0], leccion: base.id, paso: paso.id, titulo: base.titulo });
        });
      });
    }
    // Las de cada estructura del plan (menos si la lección base ya habla de ella: al adaptar puede hacer falta algo más)
    // y las de cada paso.
    const enBase = new Set(base ? Object.values(base.estructuras).map((e) => e.piezas?.[0]) : []);
    for (const e of plan.estructuras) {
      const nombres = nombresDe(R, e.clave);
      const max = (e.papel === 'nucleo' ? 8 : 3) / (enBase.has(e.clave) ? 2 : 1);
      for (const x of R.corpus.buscar(`${nombres.join(' ')} ${plan.titulo}`, { nombres, max: Math.ceil(max), porFuente: 4 })) meter(x.entrada);
    }
    for (const paso of plan.pasos) for (const x of R.corpus.buscar(`${paso.titulo} ${paso.idea}`, { max: base ? 2 : 4, porFuente: 2 })) meter(x.entrada);
    void idioma;
    return new Map(elegidas.map((e, i) => [`E${i + 1}`, e]));
  }

  /** Metadatos de las fuentes de unas evidencias (para que la lección las enlace aunque no estén en el registro de la app). */
  function fuentesDe(R, mapa) {
    const out = {};
    for (const e of mapa.values()) for (const c of e.citas) if (c.f && R.corpus.fuente(c.f)) out[c.f] = R.corpus.fuente(c.f);
    return out;
  }

  /** La lección que se adapta: de la biblioteca (en el servidor) o propia (viene de la app). */
  function leccionBase(R, id, propia) {
    if (!id) return null;
    if (ID_PROPIA.test(id)) return propia && Array.isArray(propia.pasos) && propia.estructuras ? propia : null;
    return R.lecciones.get(id) ?? null;
  }
}

/** Comprueba un plan contra el formato de las lecciones y el inventario. Devuelve { plan (recortado), errores }. */
export function revisarPlan(bruto, { candidatas, idioma = 'es' }) {
  const plan = limpiarPlan(bruto);
  const errores = [];
  if (!plan) return { plan: null, errores: ['plan vacío o sin título'] };
  const vistas = new Set();
  plan.estructuras = plan.estructuras.filter((e) => {
    if (!candidatas.has(e.clave)) { errores.push(`estructura que no está entre las disponibles: ${e.clave}`); return false; }
    if (vistas.has(e.clave)) return false;
    vistas.add(e.clave);
    return true;
  });
  const nucleo = plan.estructuras.filter((e) => e.papel === 'nucleo');
  if (nucleo.length < 1) errores.push('el núcleo necesita al menos una estructura');
  if (nucleo.length > 12) errores.push('demasiadas estructuras en el núcleo (máximo 12)');
  if (!FORMATOS.some((x) => x.id === plan.formato)) errores.push(`formato desconocido: ${plan.formato}`);
  plan.sistemas = plan.sistemas.filter((s) => SISTEMAS.some((x) => x.id === s));
  if (!plan.sistemas.length && plan.formato !== 'fundamentos') errores.push('sin sistemas');
  plan.temas = plan.temas.filter((t) => TEMAS.some((x) => x.id === t));
  plan.lugares = plan.lugares.filter((l) => REGION_POR_ID.has(l.region) && (!l.subregion || SUBREGION_POR_ID.get(l.subregion)?.region === l.region));
  if (plan.objetivos.length < 2 || plan.objetivos.length > 6) errores.push('necesita entre 2 y 6 objetivos');
  for (const o of plan.objetivos) if (!objetivoObservable(o, idioma)) errores.push(`objetivo que no empieza por un verbo observable: «${o}»`);
  if (plan.pasos.length < 4) errores.push('menos de 4 pasos');
  if (plan.pasos[0]?.tipo !== 'orientacion') errores.push('el primer paso tiene que ser de orientación');
  if (plan.pasos.at(-1)?.tipo !== 'sintesis') errores.push('el último paso tiene que ser la síntesis');
  for (const p of plan.pasos) {
    if (!TIPOS_PASO.includes(p.tipo)) errores.push(`tipo de paso desconocido: ${p.tipo}`);
    p.estructuras = p.estructuras.filter((k) => vistas.has(k));
  }
  if (!(plan.minutos >= 3 && plan.minutos <= 45)) errores.push('duración fuera de 3–45 minutos');
  return { plan, errores };
}

function errorEvento(err) {
  if (err instanceof ErrorNeuri) return { estado: 'error', error: err.codigo };
  if (err?.name === 'AbortError') return { estado: 'error', error: 'cancelada' };
  return { estado: 'error', error: 'servidor' };
}

const json = (status, datos, extra = {}) => new Response(JSON.stringify(datos), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extra },
});

/**
 * Respuesta en flujo NDJSON: una línea JSON por estado; la última es «lista», «limitacion» o «error». Si quien la lee la
 * cancela (la persona pulsa «Cancelar» o cierra la página), se aborta el trabajo: no se hace ninguna llamada más a Claude
 * y la que esté en curso se corta.
 */
function flujo(trabajo) {
  const cod = new TextEncoder();
  const control = new AbortController();
  let cerrado = false;
  const cuerpo = new ReadableStream({
    async start(controller) {
      const emitir = (evento) => {
        if (cerrado) return;
        try { controller.enqueue(cod.encode(`${JSON.stringify(evento)}\n`)); } catch { cerrado = true; }
      };
      try { await trabajo(emitir, control.signal); } catch (err) { if (!control.signal.aborted) { console.error('[pet] Error al redactar:', err); emitir({ estado: 'error', error: 'servidor' }); } }
      if (!cerrado) { cerrado = true; try { controller.close(); } catch { /* ya cerrado */ } }
    },
    cancel() { cerrado = true; control.abort(); },
  });
  return new Response(cuerpo, { status: 200, headers: { 'content-type': 'application/x-ndjson; charset=utf-8', 'cache-control': 'no-store', 'x-accel-buffering': 'no' } });
}

/**
 * Respuesta en flujo de un trabajo del registro: lo que ya pasó y lo que falta. Si la app se desconecta, el trabajo
 * sigue (para volver a conectarse); solo «cancelar» lo detiene.
 */
function flujoTrabajo(trabajos, id) {
  const cod = new TextEncoder();
  let soltar = null;
  const cuerpo = new ReadableStream({
    start(controller) {
      let cerrado = false;
      soltar = trabajos.conectar(id, (evento) => {
        if (cerrado) return;
        if (evento === null) { cerrado = true; try { controller.close(); } catch { /* ya cerrado */ } return; }
        try { controller.enqueue(cod.encode(`${JSON.stringify({ ...evento, trabajo: id })}\n`)); } catch { cerrado = true; }
      });
    },
    cancel() { soltar?.(); },
  });
  return new Response(cuerpo, { status: 200, headers: { 'content-type': 'application/x-ndjson; charset=utf-8', 'cache-control': 'no-store', 'x-accel-buffering': 'no' } });
}

/** Solo la propia web: los navegadores dicen de dónde viene la petición. */
function mismoOrigen(request) {
  if (request.headers.get('sec-fetch-site') === 'cross-site') return false;
  const origen = request.headers.get('origin');
  if (!origen) return true;
  try { return new URL(origen).host === new URL(request.url).host; } catch { return false; }
}

async function leerCuerpo(request) {
  const declarado = Number(request.headers.get('content-length') ?? 0);
  if (declarado > LIMITES.cuerpo + LIMITES.leccionBase) return null;
  const datos = await request.arrayBuffer();
  if (datos.byteLength > LIMITES.cuerpo + LIMITES.leccionBase) return null;
  return new TextDecoder().decode(datos);
}

/**
 * Límite de uso: `porIp` peticiones por dirección cada `ventanaIp` ms y `porHora` en total (el gasto). En memoria: en
 * un servicio con varias instancias es aproximado; el límite de gasto mensual de la cuenta de Anthropic es el que manda.
 */
export function crearLimitador({ porIp, ventanaIp, porHora, ahora = Date.now }) {
  const porDireccion = new Map();
  let ultimaHora = [];
  return (ip) => {
    const t = ahora();
    ultimaHora = ultimaHora.filter((x) => t - x < 3600_000);
    if (ultimaHora.length >= porHora) return 'ocupado';
    const recientes = (porDireccion.get(ip) ?? []).filter((x) => t - x < ventanaIp);
    if (recientes.length >= porIp) { porDireccion.set(ip, recientes); return 'limite'; }
    recientes.push(t);
    porDireccion.set(ip, recientes);
    ultimaHora.push(t);
    if (porDireccion.size > 5000) for (const [k, v] of porDireccion) if (!v.some((x) => t - x < ventanaIp)) porDireccion.delete(k);
    return null;
  };
}
