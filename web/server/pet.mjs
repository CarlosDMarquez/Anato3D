// Servidor de Neuri, el asistente de «Estudiar»: recibe la petición de la app, pregunta a Claude en el modo que toca
// (orientar, planificar, redactar o adaptar) y devuelve lo que la app puede mostrar o guardar. La clave de la API solo
// vive aquí, en el servidor; nunca llega al navegador.
//
// Es una función estándar (Request → Response) para poder usarla en cualquier sitio: en desarrollo la monta
// server/vite-pet.mjs dentro de `npm run dev` y `npm run preview`; al publicar, una función del alojamiento.
//
// Lo que la IA propone se comprueba aquí antes de que llegue a nadie:
//  - Orientar: solo lecciones y recorridos que existen; una explicación solo con evidencias citadas.
//  - Planificar: solo estructuras del inventario de los modelos; objetivos, pasos y duración según el formato. Un
//    recorrido personal (lo que no cabe en una lección): de 2 a 8 unidades distintas, cada una el alcance de una
//    lección que la app crea aparte; al cambiarlo, lo que ya existe se conserva tal cual.
//  - Redactar y adaptar: la lección se ensambla en el formato de la biblioteca, pasa su revisor, cada cita es una frase
//    literal de su fuente y otra llamada comprueba que cada cita respalda lo que se afirma (lo que no, se quita). Si
//    queda algún error, una ronda de corrección; si sigue, no se entrega.
//  - Sesión de estudio: solo lecciones candidatas que existen en el modelo de la persona, bloques revisados (minutos,
//    repaso, práctica, requisitos) y una ronda de corrección; si sigue mal, la app la planifica sola.
// Protecciones: solo la propia web, tamaños y turnos limitados (src/pet/protocolo.js), cupo diario por dispositivo
// (server/neuri/cupo.mjs), límites de uso por dirección y por hora, y nada de lo que escribe nadie se guarda ni se registra.
import { VERSION, LIMITES, validarPeticion, limpiarRespuesta, limpiarPlan, limpiarRecorrido, limpiarPlanSesion, ID_PROPIA } from '../src/pet/protocolo.js';
import { RECORRIDOS } from '../src/biblioteca/recorridos.js';
import { RETIRADAS } from '../src/biblioteca/retiradas.js';
import { REGIONES, SISTEMAS, TEMAS, FORMATOS, SUBREGION_POR_ID, REGION_POR_ID, SISTEMA_POR_ID } from '../src/biblioteca/taxonomia.js';
import { consultaDe } from '../src/pet/local.js';
import { frases, evidencias as evidenciasDe, objetivoObservable, TIPOS_PASO } from '../src/biblioteca/formato.js';
import { crearBuscador, normalizar } from '../src/biblioteca/buscar.js';
import { ETIQUETAS } from '../src/i18n/textos.js';
import { limitacionesDe } from '../src/data/limitaciones.js';
import { ESPECIFICACION, APP, textoModo, esquemaOrientar, esquemaPlan, esquemaRecorrido, esquemaLeccion, esquemaVerificar, esquemaSesion, VERSION_INSTRUCCIONES } from './neuri/instrucciones.mjs';
import { crearRegistro } from './neuri/trabajos.mjs';
import { textoCatalogoCompacto, textoLeccionesDetalle, textoPerfil, textoEnfoque, textoSesion, textoContexto, textoDatosPersona, textoEvidencias, textoSolicitud, textoPlan, textoBase, textoRecorridoBase, textoZona, mensajesApi } from './pet-prompt.mjs';
import { llamar, crearCliente, elegirModelo, ErrorNeuri, MODELO_POR_DEFECTO } from './neuri/modelo.mjs';
import { cotaReserva, ErrorPresupuesto, huellaFija, periodos } from './neuri/presupuesto.mjs';
import { dispositivoDe } from './neuri/cupo.mjs';
import { normalizarIp } from './neuri/ip.mjs';
import { createHash } from 'node:crypto';
import { ensamblarLeccion, validarLeccion, afirmaciones, quitarNoRespaldadas, idLeccion } from './neuri/ensamblar.mjs';
import { notaLimite, textoLimites, clavesDeLeccion, limitadasEn, limitadasEnZona, limitesDeUnidades, erroresDeUnidades, acotarUnidades, notasDeLimites } from './neuri/limites.mjs';

export { elegirModelo, MODELO_POR_DEFECTO };

const LIMITE_POR_DEFECTO = { porIp: 20, ventanaIp: 10 * 60_000, porHora: 200 };
const LIMITE_LECCIONES = { porIp: 4, ventanaIp: 60 * 60_000, porHora: 20 };
const MIN_EVIDENCIAS = 8;
// Plazos de cada llamada a Claude (sin reintentos del SDK: cada intento pasa por el tope de gasto). La app espera algo
// más que la suma de lo que puede tardar cada modo (src/pet/conversacion.js).
const PLAZO = { orientar: 30_000, verificarExplicacion: 30_000, planificar: 60_000, sesion: 30_000, redactar: 240_000, verificar: 120_000 };
// Orientar: lecciones con todo su detalle en el bloque variable (las del buscador, como mucho K) y las que se añaden
// por la conversación (ya mostradas, empezadas, donde está); evidencias como mucho; estructuras para «Ver en 3D».
const CANDIDATAS_ORIENTAR = 12;
const EXTRA_ORIENTAR = 6;
const MAX_EVIDENCIAS_ORIENTAR = 10;
const MAX_MOSTRAR = 40;
// Sesión: lecciones candidatas como mucho (con su estado para la persona).
const CANDIDATAS_SESION = 8;
// Una explicación retirada (sus citas no la respaldaban): lo que queda en su lugar, en el idioma de la conversación (la
// app enseña su propio aviso; esto es lo que vuelve a Claude en el historial). Neuri habla español e inglés (los demás
// idiomas de la app están «próximamente»): otro idioma recibe el inglés.
const RETIRADA = {
  es: '[Explicación retirada: sus citas no la respaldaban del todo; la app mostró solo las citas.]',
  en: '[Explanation withdrawn: its citations did not fully support it; the app showed only the citations.]',
};
// Una sesión sin ninguna lección que encaje: no se llama a Claude; se pide el tema (la app puede planificar sola el repaso).
// En español o inglés, como lo anterior.
const SIN_CANDIDATAS = {
  es: 'No encuentro lecciones de la biblioteca para ese objetivo. ¿Qué región o sistema quieres estudiar?',
  en: 'I can’t find library lessons for that goal. Which region or system would you like to study?',
};
// Lo que encaja solo existe en el otro modelo 3D (Neuri, en español e inglés; los demás idiomas reciben el inglés).
const SOLO_OTRO_MODELO = {
  es: 'Las lecciones de ese tema son del otro modelo 3D. Cambia de modelo para estudiarlas o dime otro tema.',
  en: 'The lessons on that topic belong to the other 3D model. Switch models to study them or tell me another topic.',
};
// Palabras de pedir una sesión o una clase que no dicen el tema (además del relleno de conversación de src/pet/local.js).
const DE_SESION = new Set(('sesion sesiones session sessions clase clases class classes prepara preparame preparar hazme haz '
  + 'organizame organiza planifica planificame armame montame prepare make plan build give minutos').split(' '));
/** Lo que dice el tema en un texto de la persona: sin tiempo, sin palabras de conversación ni de pedir una sesión. */
const consultaDeTema = (texto) => consultaDe(String(texto ?? '')).split(' ').filter((w) => w && !DE_SESION.has(w)).join(' ');

// Sin presupuesto: no se reserva nada, así que no sale ninguna llamada.
const SIN_PRESUPUESTO = { disponible: false, motivo: 'sin-presupuesto', restante: () => 0, reservar() { throw new ErrorPresupuesto('sin-presupuesto'); } };

/**
 * Prepara el manejador. `catalogo`: el de src/biblioteca/generado/catalogo.json. `clave`: la de la API (sin clave,
 * «sin-ia» y la app usa su buscador). `recursos`: función que carga inventario, evidencias y lecciones
 * (server/neuri/recursos.mjs); sin ella, solo Orientar y sin explicaciones. `cliente`: otro cliente (pruebas).
 * `presupuesto`: el tope de gasto (server/neuri/presupuesto.mjs); con una clave de verdad es obligatorio: sin él, no sale
 * ninguna llamada. `permitirSonnet`: si Carlos permite Sonnet 5.5 (si no, aunque se pida, Haiku 5.5). `cupo`: el cupo
 * diario por dispositivo (server/neuri/cupo.mjs); sin él, no hay cupo (pruebas y scripts) y las respuestas no lo llevan.
 */
export function crearManejador({
  catalogo: catalogoEntero, clave = null, modelo: pedido = MODELO_POR_DEFECTO, modeloLecciones: pedidoLecciones = null,
  cliente = null, recursos = null, ahora = Date.now, limites = {}, limitesLecciones = {}, registro = console, azar = Math.random,
  trabajos = crearRegistro({ ahora }), presupuesto = null, permitirSonnet = false, zona = 'America/Tijuana', simulado = false,
  cupo = null,
}) {
  const modelo = elegirModelo(pedido, registro, { permitirSonnet });
  const modeloLecciones = elegirModelo(pedidoLecciones ?? modelo, registro, { permitirSonnet });
  // La zona del día de una lección cuando la app no manda el suyo (la del tope de gasto, por defecto la de Mexicali).
  const zonaFecha = zona;
  // Lo retirado mientras se revisa un reporte (src/biblioteca/retiradas.js) tampoco existe para Neuri: Claude no lo ve
  // en el catálogo, no lo recomienda ni lo adapta (la app ya lo quita del suyo).
  const catalogo = { ...catalogoEntero, lecciones: catalogoEntero.lecciones.filter((L) => !RETIRADAS.lecciones.includes(L.id)) };
  const ids = { lecciones: new Set(catalogo.lecciones.map((L) => L.id)), recorridos: new Set(RECORRIDOS.map((R) => R.id)) };
  const porId = new Map(catalogo.lecciones.map((L) => [L.id, L]));
  // La parte fija (en caché), por modo: las instrucciones de Carlos y de la app en todos; Orientar, además, su modo (no
  // cambia con el idioma) y el catálogo compacto. El detalle de las lecciones va en el bloque variable, solo el de las
  // candidatas de cada consulta (antes iba el catálogo entero en todas las llamadas: unos 112 000 caracteres).
  const fijoBase = `${ESPECIFICACION}\n\n${APP}`;
  const fijoOrientar = `${fijoBase}\n\n${textoModo('orientar')}\n\n${textoCatalogoCompacto(catalogo)}`;
  const api = cliente ?? crearCliente(clave);
  // Con una clave de verdad, siempre con tope (sin él, ninguno). Las pruebas pasan su cliente falso y, si quieren, su tope.
  const tope = presupuesto ?? (cliente ? null : SIN_PRESUPUESTO);
  // Lo mínimo para una pregunta (la reserva de una Orientar normal: 24 KB de contexto, lecciones candidatas, evidencias
  // y conversación): si no cabe, la app ni lo intenta (responde con su buscador y lo dice). Con la cota calibrada (la de
  // esa parte fija), en cuanto hay una respuesta. Una pregunta más larga que no quepa recibe «sin-presupuesto» al reservar.
  const RESTO = 24 * 1024;
  const bytesFijo = Buffer.byteLength(JSON.stringify(fijoOrientar));
  const minimo = () => (tope?.cota
    ? tope.cota({ modelo, bytes: bytesFijo + RESTO, bytesResto: RESTO, huella: huellaFija(modelo, fijoOrientar), maxTokens: 3000 })
    : cotaReserva(modelo, { bytes: bytesFijo + RESTO, maxTokens: 3000 }));
  const sinTope = () => !!tope && (!tope.disponible || tope.restante() < minimo());
  /** 503 «sin-presupuesto»; si se agotó el tope del día o del mes, cuándo se renueva (`espera`, en segundos). */
  function sinPresupuesto() {
    const hasta = tope?.renovacion?.(minimo()) ?? null;
    const s = hasta ? Math.max(1, Math.ceil((hasta - ahora()) / 1000)) : null;
    return json(503, { ok: false, error: 'sin-presupuesto', ...(s ? { espera: s } : {}) }, s ? { 'retry-after': String(s) } : {});
  }
  // Las creaciones cobradas al planificar que aún no se han redactado (por trabajo y por plan), en memoria.
  const pagadas = crearPagadas({ ahora });
  const limitar = crearLimitador({ ...LIMITE_POR_DEFECTO, ...limites, ahora });
  const limitarLecciones = crearLimitador({ ...LIMITE_LECCIONES, ...limitesLecciones, ahora });
  const buscadorTemas = crearBuscador({ lecciones: catalogo.lecciones, recorridos: RECORRIDOS });
  // El de la app (con las etiquetas traducidas: entiende «cœur», «Herz», «cuore»), para las candidatas de Orientar y de
  // las sesiones: el mismo que responde sin IA en el navegador (src/pet/local.js).
  const buscadorIdiomas = crearBuscador({ lecciones: catalogo.lecciones, recorridos: RECORRIDOS, etiquetas: ETIQUETAS });
  let cargando = null;
  const recursosListos = () => (recursos ? (cargando ??= Promise.resolve().then(() => recursos()).catch((err) => { cargando = null; registro.error?.(`[pet] No se pudieron cargar los recursos de Neuri (${err?.code ?? err?.name ?? 'error'}).`); return null; })) : Promise.resolve(null));

  // Salud del servicio: si la última llamada de verdad a Claude salió bien o falló. Distingue «configurado» (hay clave),
  // «comprobado» (una llamada salió bien) y «fallando» (la última falló: red, saldo, clave rechazada…).
  const salud = { ok: null, fallo: null };
  // `seguimiento`: el de la petición ({ respuestas, cobradas }): cuántas llamadas tuvieron respuesta de Claude (aunque
  // luego no sirviera) y cuántas salieron sin respuesta pero el tope de gasto las cuenta enteras (un corte, un 5xx, un
  // plazo, una cancelación a mitad: server/neuri/modelo.mjs, `cobrada`). Con ninguna de las dos, lo gastado del cupo
  // diario se devuelve: solo lo que no salió o la API rechazó sin procesar (un 4xx).
  async function llamarClaude({ seguimiento = null, ...opciones }) {
    try {
      const r = await llamar(api, { registro, presupuesto: tope, ...opciones });
      salud.ok = ahora();
      if (seguimiento) seguimiento.respuestas++;
      return r;
    } catch (err) {
      if (seguimiento && err?.respondio) seguimiento.respuestas++;
      else if (seguimiento && err?.cobrada) seguimiento.cobradas = (seguimiento.cobradas ?? 0) + 1;
      // Sin presupuesto no es un fallo del servicio (no salió nada): el estado lo dice aparte.
      if (err instanceof ErrorNeuri && !['cancelada', 'rechazo', 'formato', 'incompleta', 'sin-presupuesto'].includes(err.codigo)) salud.fallo = { codigo: err.codigo, fecha: ahora() };
      throw err;
    }
  }
  // `simulado`: el ensayo con el proveedor simulado (server/produccion.mjs): nunca dice «comprobada».
  const estadoServicio = () => (!api ? 'sin-clave' : salud.fallo && (!salud.ok || salud.fallo.fecha >= salud.ok) ? 'fallando' : simulado ? 'simulado' : salud.ok ? 'comprobada' : 'configurada');

  return async function manejar(request, { ip = '' } = {}) {
    // El cupo diario: quién pide (el identificador de la cabecera o, sin uno válido, la IP). Nunca se registra ni llega
    // al modelo; toda respuesta JSON (y el primer evento de un flujo) lleva cómo queda.
    // La dirección, normalizada (server/neuri/ip.mjs: una IPv6 cuenta por su /64) para el cupo, los límites y los trabajos.
    const dir = normalizarIp(ip);
    const quien = cupo ? { dispositivo: dispositivoDe(request), ip: dir } : null;
    const respuesta = await atender(request, dir, quien);
    return quien ? conCupo(respuesta, cupo.consultar(quien)) : respuesta;
  };

  /** 429 «cupo»: se acabó lo de hoy (`de`: preguntas o creaciones); `espera`, en ms, hasta que se renueva. */
  function respuestaCupo(de, c, espera = Date.parse(c.renueva) - ahora()) {
    const ms = Math.max(1000, Math.ceil(espera));
    return json(429, { ok: false, error: 'cupo', de, cupo: c, espera: ms }, { 'retry-after': String(Math.ceil(ms / 1000)) });
  }

  async function atender(request, ip, quien) {
    if (request.method === 'GET') {
      const R = api ? await recursosListos() : null;
      const conIa = !!api && !sinTope();
      return json(200, { ok: true, ia: conIa, crear: conIa && !!R?.disponible, version: VERSION, estado: api && sinTope() ? 'sin-presupuesto' : estadoServicio(), instrucciones: VERSION_INSTRUCCIONES });
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
    // Pedir otra vez un trabajo que ya existe lo reanuda: no cuenta para el límite ni se repite (ni se paga dos veces),
    // aunque ya no quede presupuesto para empezar otro.
    if (largo && peticion.trabajo && trabajos.tiene(peticion.trabajo)) return flujoTrabajo(trabajos, peticion.trabajo);
    // Sin presupuesto (cero, agotado, apagado o sin almacén): nada sale hacia Anthropic.
    if (sinTope()) return sinPresupuesto();
    // Planificar una lección (también una unidad de un recorrido) ya es crearla: son hasta dos llamadas largas. Se cobra
    // aquí la creación, ligada a su trabajo y a su plan (`pagadas`), y no se vuelve a cobrar al redactar ese trabajo o ese
    // plan. Solo si después se podrá redactar: la cuota de creaciones de la hora se consulta antes (la respuesta dice
    // cuánto falta; la app espera y sigue).
    const planLeccion = peticion.modo === 'planificar' && peticion.solicitud?.accion !== 'recorrido';
    // El cupo diario (tras validar, antes del limitador): una pregunta por cada petición que llama a Claude (orientar,
    // sesion, planificar un recorrido) y una creación por trabajo o plan (reanudarlo, arriba, no cuenta). Si la petición
    // acaba sin que nada se cobrara (no salió ninguna llamada, o la API la rechazó sin procesarla), se devuelve.
    const de = !quien ? null : largo || planLeccion ? 'creaciones' : 'preguntas';
    const identidad = quien ? (quien.dispositivo ?? `ip:${ip}`) : null;
    // Una creación ya cobrada al planificar este trabajo (o este plan, si se redacta con otro trabajo): no se cobra otra.
    const pagada = de === 'creaciones' ? pagadas.tomar(identidad, { trabajo: peticion.trabajo, huella: largo ? huellaPlan(peticion.plan) : null }) : null;
    if (planLeccion) {
      if (de && !pagada) {
        const c = cupo.consultar(quien);
        if (c.creaciones.quedan < 1) return respuestaCupo('creaciones', c);
      }
      const c = limitarLecciones.consultar(ip);
      if (c.motivo) { if (pagada) pagadas.soltar(pagada); return respuestaLimite(c.motivo, c.esperaMs); }
    }
    let ficha = null;
    if (de && !pagada) {
      const g = cupo.gastar(quien, de);
      if (!g.ok) return respuestaCupo(g.de, g.cupo, g.espera);
      ficha = g.ficha;
    }
    peticion.seguimiento = { respuestas: 0, cobradas: 0 };
    let cerrada = false;
    /**
     * Al terminar la petición: si nada se cobró, lo gastado se devuelve (y la creación pagada antes queda para la próxima
     * vez). Si se cobró: al planificar con un plan, la creación queda pagada para redactarlo; al redactar, se gasta.
     */
    const devolver = (plan = null) => {
      if (cerrada) return;
      cerrada = true;
      const cobro = peticion.seguimiento.respuestas > 0 || peticion.seguimiento.cobradas > 0;
      if (!cobro) {
        if (ficha) cupo.devolver(ficha);
        if (pagada) pagadas.soltar(pagada);
      } else if (planLeccion) {
        if (plan && (ficha || pagada)) pagadas.anotar(identidad, { trabajo: peticion.trabajo, huella: huellaPlan(plan) }, pagada);
        else if (pagada) pagadas.soltar(pagada);
      } else if (pagada) pagadas.gastar(pagada);
    };
    const conDevolucion = (trabajo) => async (emitir, signal) => { try { return await trabajo(emitir, signal); } finally { devolver(); } };

    const limitador = largo ? limitarLecciones : limitar;
    const limite = limitador(ip);
    if (limite) { devolver(); return respuestaLimite(limite, limitador.consultar(ip).esperaMs); }

    if (largo && peticion.trabajo) {
      const r = trabajos.empezar(peticion.trabajo, ip, conDevolucion((emitir, signal) => redactar(peticion, emitir, signal)));
      if (r.motivo) { devolver(); return respuestaLimite(r.motivo, 60_000); }
      return flujoTrabajo(trabajos, peticion.trabajo);
    }
    if (largo) return flujo(conDevolucion((emitir, signal) => redactar(peticion, emitir, signal)));
    // Si la app se va (la petición trae su señal): no se empieza ninguna llamada más; la que ya salió termina, para saber
    // lo que costó (cortarla no ahorraría), y su respuesta se descarta (server/neuri/modelo.mjs).
    const signal = request.signal ?? null;
    let r = null;
    try {
      const modo = { planificar, sesion: planificarSesion }[peticion.modo] ?? orientar;
      r = await modo(peticion, signal);
      return json(200, { ok: true, ...r });
    } catch (err) {
      if (err instanceof ErrorNeuri) return err.codigo === 'sin-presupuesto' ? sinPresupuesto() : json(err.status, { ok: false, error: err.codigo });
      throw err;
    } finally { devolver(planLeccion && r?.tipo === 'plan' ? r.plan : null); }
  }

  // ── Orientar ──
  async function orientar(p, signal = null) {
    const idsL = new Set([...ids.lecciones, ...p.propias.map((x) => x.id)]);
    const R = await recursosListos();
    const ultimo = p.mensajes.at(-1).texto;
    const consulta = `${ultimo} ${p.contexto.tema ?? ''}`;
    // Dónde está la persona (si la app lo dice): la lección de la biblioteca (o la propia) y su paso.
    const Lenfoque = p.enfoque ? (R?.lecciones.get(p.enfoque.leccion) ?? porId.get(p.enfoque.leccion) ?? p.propias.find((x) => x.id === p.enfoque.leccion) ?? null) : null;
    const mapa = evidenciasOrientar(R, consulta, p.enfoque, Lenfoque);
    // Las limitaciones del modelo de lo que nombra la persona (solo esas): en su último mensaje, en el tema que se
    // conserva y en lo que escribió antes («¿y dónde lo veo en el modelo?» sigue hablando de lo mismo), en cualquiera de
    // los cinco idiomas, para no mandarla a mirar en el 3D algo que está fuera de sitio o incompleto.
    const nombrado = [ultimo, p.contexto.tema, ...p.mensajes.filter((m) => m.rol === 'usuario').map((m) => m.texto)];
    const limites = R ? textoLimites([...R.inventario.mencionadas(nombrado).keys(), ...limitadasEn(nombrado, R.inventario)]) : '';
    const lecciones = leccionesParaOrientar(p, R, mapa);
    // Lo que se puede ofrecer «Ver en 3D» en este turno (el esquema solo admite esas claves).
    const mostrar = R ? clavesParaMostrar(p, R, Lenfoque, lecciones) : [];
    const variable = [
      textoContexto(p),
      p.perfil ? textoPerfil(p.perfil, { nombre: (k) => R?.inventario.nombre(k, 'es') ?? null }) : '',
      p.enfoque ? textoEnfoque(p.enfoque, Lenfoque) : '',
      textoLeccionesDetalle(lecciones, catalogo),
      R ? textoEvidencias(mapa, R.corpus) : 'EVIDENCIAS: no disponibles en este servidor.',
      mostrar.length ? `ESTRUCTURAS PARA VER EN 3D (clave — nombre; solo para «mostrar»):\n${mostrar.map((k) => `${k} — ${R.inventario.nombre(k, p.idioma)}`).join('\n')}` : '',
      limites,
    ].filter(Boolean).join('\n\n');
    const { datos, modelo: usado } = await llamarClaude({
      modelo, sistema: [fijoOrientar, variable], mensajes: conDatosPersona(mensajesApi(p.mensajes), textoDatosPersona(p)), esquema: esquemaOrientar({ lecciones: idsL, recorridos: ids.recorridos, mostrar }),
      esfuerzo: 'low', maxTokens: 3000, etiqueta: 'orientar', signal, plazoMs: PLAZO.orientar, seguimiento: p.seguimiento,
    });
    // «Ver en 3D»: solo claves de la lista de este turno, con su nombre en el idioma de la persona.
    const permitidas = new Set(mostrar);
    datos.mostrar = (Array.isArray(datos.mostrar) ? datos.mostrar : []).map((x) => (typeof x === 'string' ? x : x?.clave))
      .filter((k) => permitidas.has(k)).map((k) => ({ clave: k, nombre: R.inventario.nombre(k, p.idioma) ?? k }));
    // Las evidencias citadas, con su fuente, para que la app las enseñe y enlace.
    datos.evidencias = (datos.evidencias ?? []).map((id) => mapa.get(id)).filter(Boolean).map((e) => {
      const c = e.citas.find((x) => x.f) ?? e.citas[0];
      const meta = c.f ? R.corpus.fuente(c.f) : null;
      return { cita: c.c ?? e.texto, texto: e.texto ?? null, f: c.f ?? '', titulo: meta?.titulo ?? '', url: meta?.url ?? null, licencia: meta?.licencia ?? '', leccion: e.leccion ?? null, paso: e.paso ?? null };
    });
    const r = limpiarRespuesta(datos, { lecciones: idsL, recorridos: ids.recorridos, personales: new Set(p.recorridos.map((x) => x.id)) });
    if (!r) throw new ErrorNeuri('ia');
    // Una explicación sin evidencias no se presenta como tal: la app avisa de que no cita fuentes.
    if (r.tipo === 'explicacion' && !r.evidencias.length) r.aviso = 'sin-evidencia';
    // Con evidencias, otra llamada comprueba que las citas respaldan lo que dice (como en las lecciones). Si no (o si no
    // se puede comprobar), la explicación se retira: la app enseña solo las citas, que son frases literales de las fuentes.
    if (r.tipo === 'explicacion' && r.evidencias.length && !(await explicacionRespaldada(r, p, signal))) {
      r.aviso = 'sin-respaldo';
      r.mensaje = RETIRADA[p.idioma] ?? RETIRADA.en;
    }
    return { ...r, modelo: usado };
  }

  async function explicacionRespaldada(r, p, signal = null) {
    const citas = r.evidencias.map((e) => `“${e.cita}”${e.texto ? ` (frase de la lección: «${e.texto}»)` : ''}`).join(' | ');
    try {
      const v = await llamarClaude({
        modelo, sistema: [fijoBase, textoModo('verificar')], esquema: esquemaVerificar(), esfuerzo: 'low', maxTokens: 2000, etiqueta: 'verificar explicación',
        mensajes: [{ role: 'user', content: `1. Afirmación: «${r.mensaje}»\n   Citas: ${citas}` }], signal, plazoMs: PLAZO.verificarExplicacion, seguimiento: p.seguimiento,
      });
      return v.datos.veredictos?.find((x) => x.n === 1)?.respalda === 'si';
    } catch (err) {
      registro.error?.(`[pet] No se pudo comprobar una explicación (${err.codigo ?? err.name ?? 'error'}): se retira.`);
      return false;
    }
  }

  /**
   * Las evidencias de Orientar (E1…), como mucho 10. Con `enfoque`, primero las frases de la lección donde está la
   * persona (las de su paso, antes), aunque cubran menos de la consulta; después, las de toda la biblioteca y las páginas
   * que de verdad tratan la consulta (al menos la mitad de su información y no muy por debajo de la mejor).
   */
  function evidenciasOrientar(R, consulta, enfoque, Lenfoque) {
    const mapa = new Map();
    if (!R) return mapa;
    const vistas = new Set();
    const meter = (x) => { if (mapa.size < MAX_EVIDENCIAS_ORIENTAR && !vistas.has(x.entrada.id)) { vistas.add(x.entrada.id); mapa.set(`E${mapa.size + 1}`, x.entrada); } };
    if (enfoque) {
      const paso = enfoque.paso && Array.isArray(Lenfoque?.pasos) ? Lenfoque.pasos.find((x) => x.id === enfoque.paso) : null;
      const q = `${consulta} ${paso?.titulo ?? ''}`;
      for (const x of R.corpus.buscar(q, { leccion: enfoque.leccion, paso: enfoque.paso, max: 4, porFuente: 4 }).filter((y) => y.cobertura >= 0.3)) meter(x);
    }
    const deLecciones = R.corpus.buscar(consulta, { max: 6, soloLecciones: true, porFuente: 3 });
    const dePaginas = R.corpus.buscar(consulta, { max: 4, soloPaginas: true, porFuente: 2 });
    const mejor = Math.max(0, ...[...deLecciones, ...dePaginas].map((x) => x.puntos));
    for (const x of [...deLecciones, ...dePaginas].filter((y) => y.cobertura >= 0.5 && y.puntos >= mejor * 0.35)) meter(x);
    return mapa;
  }

  /**
   * Cuánto encaja cada lección del catálogo con unas consultas ([texto, peso]): Map id → puntos. De cada consulta, las
   * del buscador de la app que puntúan al menos la mitad que su mejor (peso × puntuación relativa; vale la mejor de las
   * consultas); y, sumadas, las que enseñan en su núcleo estructuras que nombran `textos` (inventario, en cualquier
   * idioma; 1 por estructura, 2 como mucho).
   */
  function puntosDeTemas(consultas, idioma, R, textos) {
    const puntos = new Map();
    let conTema = false;
    const anotar = (r, peso) => {
      const mejor = r.lecciones[0]?.puntuacion || 1;
      for (const L of r.lecciones.slice(0, 8)) {
        const rel = (L.puntuacion ?? 0) / mejor;
        if (rel >= 0.5 && porId.has(L.id)) puntos.set(L.id, Math.max(puntos.get(L.id) ?? 0, peso * rel));
      }
    };
    for (const [crudo, peso] of consultas) {
      const q = crudo && consultaDeTema(crudo);
      if (!q) continue;
      const r = buscadorIdiomas.buscar(q, { flexible: true, idioma });
      if (r.sinTema || r.vacia) continue;
      conTema = true;
      // Si nada cumple el lugar y el sistema a la vez («ganglios del cuello»), lo que solo está en el lugar vale poco; y
      // se buscan también las lecciones de ese sistema («Sistema linfático»).
      anotar(r, r.relajado ? peso * 0.3 : peso);
      if (r.relajado) for (const m of r.materias.filter((x) => x.sistema).slice(0, 2)) anotar(buscadorIdiomas.buscar(SISTEMA_POR_ID.get(m.sistema)?.nombre ?? m.sistema, { flexible: true }), peso * 0.8);
    }
    if (R) {
      const porLeccion = new Map();
      for (const [k] of R.inventario.mencionadas(textos.filter(Boolean))) for (const id of catalogo.piezas?.[k]?.n ?? []) porLeccion.set(id, (porLeccion.get(id) ?? 0) + 1);
      for (const [id, x] of porLeccion) if (porId.has(id)) { puntos.set(id, (puntos.get(id) ?? 0) + Math.min(2, x)); conTema = true; }
    }
    return { puntos, conTema };
  }

  /**
   * Las lecciones del catálogo cuyo detalle ve Claude en Orientar: [{ L, marca }]. Primero las candidatas de la
   * consulta (como mucho 12, las que de verdad encajan): el buscador de la app con el último mensaje y el tema que se
   * conserva (en el idioma de la persona), las que enseñan en su núcleo lo que nombra (inventario, en cualquier idioma)
   * y las que tienen frases entre las evidencias. Después, las que ya se mostraron en los últimos turnos, la lección
   * donde está y las empezadas (hasta 6 más): así «el segundo», «esa» o «sigo con la mía» se entienden con su detalle.
   */
  function leccionesParaOrientar(p, R, mapa) {
    const ultimo = p.mensajes.at(-1).texto;
    const anterior = p.mensajes.filter((m) => m.rol === 'usuario').map((m) => m.texto).at(-2);
    const { puntos } = puntosDeTemas([[ultimo, 3], [p.contexto.tema && `${ultimo} ${p.contexto.tema}`, 2.5], [p.contexto.tema, 2], [anterior, 1.5]], p.idioma, R, [ultimo, p.contexto.tema ?? '']);
    // La lección de la que salen las evidencias es la más cercana a la duda: también se puede recomendar.
    for (const id of new Set([...mapa.values()].map((e) => e.leccion).filter(Boolean))) if (porId.has(id)) puntos.set(id, (puntos.get(id) ?? 0) + 1);
    const elegidas = [...puntos].filter(([, x]) => x >= 1).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, CANDIDATAS_ORIENTAR).map(([id]) => id);
    const { terminadas, enCurso, repasos } = p.progreso;
    const marcaDe = (id) => [terminadas.includes(id) ? 'terminada' : enCurso.includes(id) ? 'empezada' : '', repasos.includes(id) ? 'con repasos' : ''].filter(Boolean).join(', ');
    const aqui = (id) => (p.enfoque?.leccion === id ? 'donde está' : '');
    const lista = elegidas.map((id) => ({ L: porId.get(id), marca: [aqui(id), marcaDe(id)].filter(Boolean).join(', ') }));
    const extra = [];
    const añadir = (id, marca) => {
      if (!porId.has(id) || extra.length >= EXTRA_ORIENTAR || lista.some((x) => x.L.id === id) || extra.some((x) => x.L.id === id)) return;
      extra.push({ L: porId.get(id), marca: [marca, marcaDe(id)].filter(Boolean).join(', ') });
    };
    if (p.enfoque) añadir(p.enfoque.leccion, 'donde está');
    for (const m of p.mensajes.filter((x) => x.rol === 'pet').slice(-2).reverse()) for (const x of m.lecciones ?? []) añadir(x.id, 'ya mostrada');
    for (const id of enCurso) añadir(id, '');
    return [...lista, ...extra];
  }

  /**
   * Las claves del inventario que se pueden ofrecer «Ver en 3D» en este turno (como mucho 40): las que nombra la persona
   * con su nombre completo (en cualquier idioma del inventario), las de la lección donde está y las del núcleo de las
   * dos lecciones que mejor encajan. Nunca una pieza que el modelo muestra fuera de sitio o con un nombre dudoso
   * (src/data/limitaciones.js: no se puede localizar ni identificar): enseñarla confundiría.
   */
  function clavesParaMostrar(p, R, Lenfoque, lecciones) {
    const textos = [p.mensajes.at(-1).texto, p.contexto.tema ?? ''];
    const claves = [];
    const restringida = (k) => limitacionesDe(k).some((l) => l.restringe.includes('localizar') || l.restringe.includes('identificar'));
    const meter = (k) => { if (claves.length < MAX_MOSTRAR && R.inventario.estructuras[k] && !claves.includes(k) && !restringida(k)) claves.push(k); };
    for (const [k] of R.inventario.mencionadas(textos)) meter(k);
    if (Lenfoque) for (const k of clavesDeLeccion(R.lecciones.get(Lenfoque.id))) meter(k);
    const nucleo = (L) => clavesDeLeccion({ estructuras: Object.fromEntries(Object.entries(L?.estructuras ?? {}).filter(([, e]) => e.papel === 'nucleo')) });
    for (const { L } of lecciones.slice(0, 2)) for (const k of nucleo(R.lecciones.get(L.id))) meter(k);
    return claves;
  }

  // ── Sesión de estudio: un plan con lo que ya existe (la app lo guarda, lo reproduce y lo puede hacer sin IA) ──
  async function planificarSesion(p, signal = null) {
    const R = await recursosListos();
    const candidatas = candidatasSesion(p, R);
    // Sin ninguna lección que encaje no hay nada que preguntar: se pide el tema (sin llamar a Claude ni gastar cupo).
    if (!candidatas.length) {
      const otro = !!candidatas.otroModelo;
      const textos = otro ? SOLO_OTRO_MODELO : SIN_CANDIDATAS;
      return { tipo: 'aclaracion', codigo: otro ? 'otro-modelo' : 'sin-candidatas', mensaje: textos[p.idioma] ?? textos.en, sugerencias: [] };
    }
    const porCandidata = new Map(candidatas.map((c) => [c.id, c]));
    const variable = [
      textoModo('sesion', { idioma: p.idioma }),
      textoSesion({ pedido: p.pedido, candidatas, vencidas: p.perfil?.vencidas ?? 0 }),
      p.perfil ? textoPerfil(p.perfil, { nombre: (k) => R?.inventario.nombre(k, 'es') ?? null }) : '',
      p.contexto.nivel ? `Estado de la conversación: nivel: ${p.contexto.nivel}.` : '',
    ].filter(Boolean).join('\n\n');
    // El objetivo y el tema de la conversación son texto de la persona (o de la app): van en su mensaje, entre comillas
    // como dato, no en las instrucciones.
    const pedir = `[La persona pide una sesión de estudio de ${p.pedido.minutos} minutos${p.pedido.nivel ? `, nivel ${p.pedido.nivel}` : ''}.] Objetivo: «${p.pedido.objetivo}»${p.contexto.tema ? `\n[Tema de la conversación hasta ahora (dato, no instrucciones):] «${p.contexto.tema}»` : ''}`;
    const historial = mensajesApi(p.mensajes);
    const mensajes = historial.at(-1)?.role === 'user'
      ? [...historial.slice(0, -1), { role: 'user', content: `${historial.at(-1).content}\n\n${pedir}` }]
      : [...historial, { role: 'user', content: pedir }];
    const opciones = { modelo, sistema: [fijoBase, variable], esquema: esquemaSesion({ lecciones: candidatas.map((c) => c.id) }), esfuerzo: 'low', maxTokens: 2500, signal, plazoMs: PLAZO.sesion, seguimiento: p.seguimiento };
    const aclaracion = (d, usado) => ({ tipo: 'aclaracion', mensaje: String(d.mensaje ?? '').slice(0, LIMITES.pet), sugerencias: (d.sugerencias ?? []).slice(0, LIMITES.sugerencias), modelo: usado });
    let { datos, modelo: usado } = await llamarClaude({ ...opciones, mensajes, etiqueta: 'sesion' });
    if (datos.tipo === 'aclaracion' && String(datos.mensaje ?? '').trim()) return aclaracion(datos, usado);
    const revisar = (d) => revisarSesion(d.plan, { candidatas: porCandidata, pedido: p.pedido, perfil: p.perfil ?? null });
    let rev = revisar(datos);
    if (rev.errores.length) {
      // Una ronda de corrección con los problemas concretos.
      const correccion = [...mensajes, { role: 'assistant', content: JSON.stringify(datos) }, { role: 'user', content: `[La app encontró estos problemas en la sesión: ${rev.errores.join(' · ')}. Devuelve la sesión corregida completa.]` }];
      ({ datos, modelo: usado } = await llamarClaude({ ...opciones, mensajes: correccion, etiqueta: 'sesion (corrección)' }));
      if (datos.tipo === 'aclaracion' && String(datos.mensaje ?? '').trim()) return aclaracion(datos, usado);
      rev = revisar(datos);
      // Si sigue mal, no se entrega: la app la planifica sola (src/biblioteca/sesion.js).
      if (rev.errores.length) {
        registro.info?.(`[pet] sesion: plan inválido tras la corrección (${rev.errores.length} problemas): la app planifica en local.`);
        throw new ErrorNeuri('formato', 502);
      }
    }
    const plan = rev.plan;
    if (!plan.mensaje) plan.mensaje = String(datos.mensaje ?? '').slice(0, LIMITES.largo);
    // (Sin el objetivo ni el título en el registro técnico: pueden decir algo de la persona.)
    registro.info?.(`[pet] sesion: ${plan.bloques.length} bloques, ${plan.bloques.reduce((n, b) => n + b.minutos, 0)} de ${p.pedido.minutos} min, ${candidatas.length} candidatas.`);
    return { tipo: 'sesion', plan, modelo: usado };
  }

  /**
   * Las lecciones entre las que se planifica una sesión (como mucho 8), con su estado para esta persona: las que
   * encuentra el buscador de la app con el objetivo y el tema de la conversación, y las que enseñan lo que nombra; solo
   * las que existen en su modelo (male/female) y no están retiradas. Lo empezado, lo que tiene repasos y lo que le cuesta
   * suben si encaja; sin un tema que se reconozca («repasar lo de esta semana»), son las candidatas. Si cabe, también los
   * requisitos sin terminar de las elegidas y hasta 2 lecciones propias que encajen.
   */
  function candidatasSesion(p, R) {
    const { objetivo, modelo: m } = p.pedido;
    const vale = (L) => !!L && (L.modelos ?? ['male', 'female']).includes(m);
    const { puntos, conTema } = puntosDeTemas([[objetivo, 3], [p.contexto.tema && `${objetivo} ${p.contexto.tema}`, 2]], p.idioma, R, [objetivo]);
    for (const [id, x] of [...puntos]) if (x < 1) puntos.delete(id);
    // Lo que encaja pero solo existe en el otro modelo 3D: no se planifica (la app lo dice).
    const otroModelo = [...puntos.keys()].filter((id) => !vale(porId.get(id)));
    for (const id of otroModelo) puntos.delete(id);
    if (conTema && !puntos.size) return Object.assign([], { otroModelo: otroModelo.length > 0 });
    const sumar = (id, x) => { if (vale(porId.get(id))) puntos.set(id, (puntos.get(id) ?? 0) + x); };
    const { terminadas, enCurso, repasos } = p.progreso;
    const dificiles = (p.perfil?.dificultades ?? []).map((d) => d.leccion);
    // Con un tema, lo empezado, con repasos o que le cuesta sube si encaja; sin tema («repasar lo pendiente»), son las candidatas.
    for (const [lista, x] of [[enCurso, 1], [repasos, 0.8], [dificiles, 0.4]]) for (const id of new Set(lista)) if (!conTema || puntos.has(id)) sumar(id, conTema ? x / 2 : x);
    const elegidas = [...puntos].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, CANDIDATAS_SESION).map(([id]) => id);
    // Los requisitos sin terminar de las elegidas, si caben (la sesión los pone antes).
    for (const id of [...elegidas]) for (const r of porId.get(id)?.requisitos ?? []) if (elegidas.length < CANDIDATAS_SESION && !elegidas.includes(r) && !terminadas.includes(r) && vale(porId.get(r))) elegidas.push(r);
    const estado = (id) => (terminadas.includes(id) ? 'terminada' : enCurso.includes(id) ? 'empezada' : 'nueva');
    const info = elegidas.map((id) => {
      const L = porId.get(id);
      return { id, titulo: L.titulo, nivel: L.nivel, minutos: L.minutos, pasos: L.pasos, preguntas: L.preguntas, requisitos: (L.requisitos ?? []).filter((r) => porId.has(r)), estado: estado(id), repasos: repasos.includes(id), resumen: L.resumen };
    });
    // Las propias (solo en su navegador) que comparten alguna palabra con el objetivo, como mucho 2.
    const palabras = normalizar(objetivo).split(' ').filter((w) => w.length > 4);
    for (const x of p.propias.filter((y) => palabras.some((w) => normalizar(`${y.titulo} ${y.resumen}`).includes(w))).slice(0, 2)) {
      if (info.length >= CANDIDATAS_SESION + 2) break;
      info.push({ id: x.id, titulo: `${x.titulo} (lección propia)`, nivel: x.nivel, minutos: x.minutos, pasos: null, preguntas: null, requisitos: [], estado: estado(x.id), repasos: repasos.includes(x.id), resumen: x.resumen });
    }
    return info;
  }

  // ── Planificar ──
  async function planificar(p, signal = null) {
    if (p.solicitud.accion === 'recorrido') return planificarRecorrido(p, signal);
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
      // Las limitaciones del modelo, solo en las candidatas que las tienen (src/data/limitaciones.js).
      const limite = notaLimite(k);
      return `${k} — ${R.inventario.nombre(k, p.idioma)} (${e.tipo}; ${e.lugares.map(([r, x]) => [REGION_POR_ID.get(r)?.nombre, x && SUBREGION_POR_ID.get(x)?.nombre].filter(Boolean).join(' › ')).join(', ') || 'sin región'}; ${e.lado}; ${e.modelos.join(' y ')}; evidencias: ${cuentas[k]})${limite ? ` — ${limite}` : ''}`;
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
    const opcionesPlan = { modelo: modeloLecciones, sistema: [fijoBase, variable], esquema, esfuerzo: 'medium', maxTokens: 8000, signal, plazoMs: PLAZO.planificar, trabajo: p.trabajo, seguimiento: p.seguimiento };
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

  // ── Planificar un recorrido personal: lo que no cabe en una lección, dividido en unidades ──
  // Cada unidad es el alcance de una lección (título, objetivo, enfoque, nivel, minutos y términos para buscar): la app
  // la crea después, cuando la persona lo decide, como cualquier lección (planificar → redactar → comprobar → guardar).
  // Aquí no se redacta nada ni se gasta en las unidades: solo se reparte el tema.
  async function planificarRecorrido(p, signal = null) {
    const R = await recursosListos();
    if (!R?.disponible) throw new ErrorNeuri('sin-recursos', 503);
    const s = p.solicitud;
    const base = s.recorrido_base ? p.baseRecorrido : null;
    // Dónde está lo que se pide: las regiones que entiende el buscador de la biblioteca (o, si no hay, los sistemas).
    const busquedas = [s.tema, `${s.tema} ${s.objetivo} ${s.enfoque}`, ...(s.terminos ?? []).slice(0, 6)].map((q) => buscadorTemas.buscar(q));
    const regiones = [...new Set(busquedas.flatMap((f) => f.lugares.map((l) => l.region)))].slice(0, 3);
    const sistemas = regiones.length ? [] : [...new Set(busquedas.flatMap((f) => f.materias.filter((m) => m.sistema).map((m) => m.sistema)))].slice(0, 2);
    const variable = [
      textoModo('recorrido', { idioma: p.idioma }), textoSolicitud(s), base ? textoRecorridoBase(base) : '',
      textoZona(R.inventario, { regiones, sistemas }) || 'EN EL MODELO 3D, POR ZONA: no se reconoció una región concreta; usa las del catálogo y del modelo que encajen con la solicitud.',
      // Solo las piezas limitadas de esa zona y las que nombran el tema, el enfoque, los términos o las unidades que ya
      // tiene el recorrido (en cualquiera de los idiomas): con el miembro superior no va ninguna nota.
      textoLimites([
        ...limitadasEnZona(R.inventario, { regiones, sistemas }),
        ...limitadasEn([s.tema, s.objetivo, s.enfoque, ...(s.terminos ?? []), ...(base?.unidades ?? []).flatMap((u) => [u.titulo, u.objetivo, u.enfoque, ...(u.terminos ?? [])])], R.inventario),
      ]),
    ].filter(Boolean).join('\n\n');
    const esquema = esquemaRecorrido({ lecciones: ids.lecciones });
    const mensajes = [...mensajesApi(p.mensajes), { role: 'user', content: `[La persona pulsó «${base ? 'Cambiar el recorrido' : 'Planificar el recorrido'}» en la propuesta.]` }];
    const opciones = { modelo: modeloLecciones, sistema: [fijoBase, variable], esquema, esfuerzo: 'medium', maxTokens: 6000, signal, plazoMs: PLAZO.planificar, seguimiento: p.seguimiento };
    let { datos, modelo: usado } = await llamarClaude({ ...opciones, mensajes, etiqueta: 'planificar recorrido' });
    const otro = (d) => ({ tipo: d.tipo === 'aclaracion' ? 'aclaracion' : 'limitacion', mensaje: String(d.mensaje ?? '').slice(0, LIMITES.pet), recorrido: null, sugerencias: (d.sugerencias ?? []).slice(0, LIMITES.sugerencias), modelo: usado });
    if (datos.tipo !== 'recorrido' || !datos.recorrido) return otro(datos);
    let rev = revisarRecorrido(datos.recorrido, { lecciones: ids.lecciones, base });
    // Lo que el modelo 3D no deja pedir: una unidad que pide localizar o reconocer una pieza mal situada o de nombre
    // dudoso, o seguir el trayecto de una incompleta. Comprobación determinista, sobre lo que devolvió Claude.
    let lim = limitesDeUnidades(rev.recorrido?.unidades, R.inventario);
    const problemas = [...rev.errores, ...(rev.recorrido ? erroresDeUnidades(lim, R.inventario) : [])];
    if (problemas.length) {
      // Una ronda de corrección con los problemas concretos.
      const correccion = [...mensajes, { role: 'assistant', content: JSON.stringify(datos) }, { role: 'user', content: `[La app encontró estos problemas en el recorrido: ${problemas.join(' · ')}. Devuelve el recorrido corregido completo.]` }];
      ({ datos, modelo: usado } = await llamarClaude({ ...opciones, mensajes: correccion, etiqueta: 'planificar recorrido (corrección)' }));
      if (datos.tipo !== 'recorrido' || !datos.recorrido) return otro(datos);
      rev = revisarRecorrido(datos.recorrido, { lecciones: ids.lecciones, base });
      if (rev.errores.length) return { tipo: 'limitacion', codigo: 'recorrido-invalido', errores: rev.errores.slice(0, 6), mensaje: '', recorrido: null, sugerencias: [], modelo: usado };
      lim = limitesDeUnidades(rev.recorrido.unidades, R.inventario);
    }
    // Si aun así una unidad lo pide, se acota aquí (sin la IA) antes de enseñarla; y el recorrido lleva el aviso de cada
    // pieza limitada que nombra, en el idioma de la persona.
    const acotadas = acotarUnidades(rev.recorrido, lim, R.inventario, p.idioma);
    rev.recorrido.limitaciones = notasDeLimites(lim, p.idioma, rev.recorrido.limitaciones);
    // (Sin títulos en el registro técnico: pueden decir algo de la persona.)
    registro.info?.(`[pet] planificar recorrido: ${rev.recorrido.unidades.length} unidades${base ? ` (cambio; ${rev.recorrido.unidades.filter((u) => u.conserva).length} conservadas)` : ''}${acotadas ? `; ${acotadas} acotadas por el modelo 3D` : ''}.`);
    return {
      tipo: 'recorrido', mensaje: String(datos.mensaje ?? '').slice(0, LIMITES.pet), recorrido: rev.recorrido, salen: rev.salen,
      sugerencias: (datos.sugerencias ?? []).slice(0, LIMITES.sugerencias), instrucciones: VERSION_INSTRUCCIONES, modelo: usado,
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
    // Las limitaciones del modelo de las estructuras del plan y de todas las piezas de la lección base (solo las que tienen).
    const limites = textoLimites([...plan.estructuras.map((e) => e.clave), ...clavesDeLeccion(base)]);
    const variable = [textoModo(modo, { idioma: p.idioma }), textoPlan(plan, nombre), base ? textoBase(base) : '', textoEvidencias(mapa, R.corpus), limites].filter(Boolean).join('\n\n');
    const esquema = esquemaLeccion({ claves: plan.estructuras.map((e) => e.clave), evidencias: [...mapa.keys()] });
    const pedir = [{ role: 'user', content: `[La persona pulsó «${modo === 'adaptar' ? 'Crear la adaptación' : 'Crear la lección'}» en el plan.]` }];
    const opciones = { modelo: modeloLecciones, sistema: [fijoBase, variable], esquema, esfuerzo: 'medium', maxTokens: 32000, flujo: true, signal, plazoMs: PLAZO.redactar, trabajo: p.trabajo, seguimiento: p.seguimiento };
    let gasto = 0;
    let r;
    try { r = await llamarClaude({ ...opciones, mensajes: pedir, etiqueta: modo }); } catch (err) { return emitir(errorEvento(err)); }
    gasto += r.coste ?? 0;
    if (r.datos.tipo !== 'leccion' || !r.datos.leccion) return emitir({ estado: 'limitacion', mensaje: String(r.datos.mensaje ?? '').slice(0, LIMITES.pet) });

    const id = idLeccion(plan.titulo, azar);
    const fuentes = fuentesDe(R, mapa);
    const montar = async (datos) => {
      const { L, quitado, limites: quitadasLimite } = ensamblarLeccion({ plan, borrador: datos.leccion, evidencias: mapa, inventario: R.inventario, idioma: p.idioma, id, modo, base: base?.id ?? null, modeloIA: r.modelo, fuentes, instrucciones: VERSION_INSTRUCCIONES, fecha: fechaPedagogica(p.hoy, ahora(), zonaFecha) });
      emitir({ estado: 'comprobando' });
      const lista = afirmaciones(L);
      let quitadas = [];
      let problemas = [];
      if (lista.length) {
        const v = await llamarClaude({
          modelo: modeloLecciones, sistema: [fijoBase, textoModo('verificar')], esquema: esquemaVerificar(), esfuerzo: 'low', maxTokens: 12000, etiqueta: 'verificar', signal, plazoMs: PLAZO.verificar, trabajo: p.trabajo, seguimiento: p.seguimiento,
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
      return { L, quitado, quitadasLimite, quitadas, problemas, val, afirmadas: lista.length };
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
    // Sin el identificador de la lección: repite su título.
    registro.info?.(`[pet] ${modo}${p.trabajo ? ` · trabajo ${p.trabajo}` : ''}: lección lista (${L.pasos.length} pasos, ${L.preguntas.length} preguntas, ${citas} citas; ≈ ${gasto.toFixed(4)} US$ en total).`);
    // Lo que la comprobación quitó, por categoría (anexo C), y cuántas dudas necesitarían una revisión humana.
    const porCategoria = {};
    for (const x of res.problemas) porCategoria[x.categoria ?? 'sin-respaldo'] = (porCategoria[x.categoria ?? 'sin-respaldo'] ?? 0) + 1;
    // Lo quitado por una limitación del modelo va aparte (`limitesModelo`), no entre lo que se quitó por sus citas o su
    // formato: sus textos siguen en `quitado` solo para que la ronda de corrección sepa por qué se quitaron.
    return emitir({
      estado: 'lista', leccion: L, mensaje: String(r.datos.mensaje ?? '').slice(0, LIMITES.pet),
      informe: {
        pasos: L.pasos.length, preguntas: L.preguntas.length, citas, quitadas: res.quitadas.length + res.quitado.length - (res.quitadasLimite ?? 0), avisos: res.val.avisos.slice(0, 5),
        problemas: porCategoria, dudas: res.problemas.filter((x) => x.duda).length, instrucciones: VERSION_INSTRUCCIONES,
        ...(res.quitadasLimite ? { limitesModelo: res.quitadasLimite } : {}),
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

/**
 * Comprueba un recorrido personal: de 2 a 8 unidades con título (sin repetir) y objetivo, minutos razonables y solo
 * lecciones relacionadas que existen. Al cambiar un recorrido (`base`, como lo manda la app), una unidad que se
 * «conserva» es la misma de antes, con sus textos (el modelo no la reescribe); las ya creadas que no se conservan salen
 * del recorrido, pero su lección sigue en «Mis lecciones» (`salen`: sus números de antes).
 * Devuelve { recorrido (recortado), errores, salen }.
 */
export function revisarRecorrido(bruto, { lecciones = new Set(), base = null } = {}) {
  const r = limpiarRecorrido(bruto);
  if (!r) return { recorrido: null, errores: ['recorrido vacío o sin título'], salen: [] };
  const errores = [];
  if (Array.isArray(bruto.unidades) && bruto.unidades.length > LIMITES.unidades) errores.push(`demasiadas unidades (máximo ${LIMITES.unidades})`);
  if (r.unidades.length < 2) errores.push('un recorrido necesita al menos 2 unidades (si cabe en una, es una lección)');
  const titulos = new Set();
  const conservadas = new Set();
  // «conserva» solo vale al cambiar un recorrido; en uno nuevo no significa nada.
  if (!base) for (const u of r.unidades) u.conserva = null;
  else {
    // Una unidad que ya existe (con lección o en preparación) y vuelve con el mismo título es la misma unidad, aunque el
    // modelo olvidara «conserva»: así no se crea dos veces.
    const existentes = new Map(base.unidades.map((b, i) => [normalizar(b.titulo), { b, n: i + 1 }]).filter(([, x]) => ['lista', 'sin-guardar', 'preparando'].includes(x.b.estado)));
    const pedidas = new Set(r.unidades.map((u) => u.conserva).filter(Boolean));
    for (const u of r.unidades) {
      const x = !u.conserva && existentes.get(normalizar(u.titulo));
      if (x && !pedidas.has(x.n)) { u.conserva = x.n; pedidas.add(x.n); }
    }
  }
  r.unidades.forEach((u, i) => {
    const n = i + 1;
    const b = u.conserva ? base.unidades[u.conserva - 1] : null;
    if (u.conserva && !b) { errores.push(`unidad ${n}: «conserva» ${u.conserva} no es ninguna unidad del recorrido que se cambia`); u.conserva = null; }
    else if (u.conserva && conservadas.has(u.conserva)) { errores.push(`unidad ${n}: la unidad ${u.conserva} se conserva dos veces`); u.conserva = null; }
    else if (b) {
      conservadas.add(u.conserva);
      // Lo que se conserva no lo reescribe el modelo: son los textos de la unidad de antes.
      Object.assign(u, { titulo: b.titulo, objetivo: b.objetivo, enfoque: b.enfoque, nivel: b.nivel, minutos: b.minutos, terminos: b.terminos });
    }
    const clave = normalizar(u.titulo);
    if (titulos.has(clave)) errores.push(`unidad ${n}: título repetido («${u.titulo}»)`);
    titulos.add(clave);
    if (!u.objetivo) errores.push(`unidad ${n}: sin objetivo`);
    u.nivel = u.nivel ?? r.nivel;
    // Cada unidad es una lección corta: entre 5 y 30 minutos (la duración final la decide el plan de la unidad).
    u.minutos = Math.min(30, Math.max(5, u.minutos ?? 15));
    u.relacionadas = u.relacionadas.filter((id) => lecciones.has(id));
  });
  // Las unidades que ya existían (lista, sin guardar o en preparación) y no siguen: salen del recorrido, no se borran.
  const salen = base ? base.unidades.map((b, i) => (!conservadas.has(i + 1) && ['lista', 'sin-guardar', 'preparando'].includes(b.estado) ? i + 1 : null)).filter(Boolean) : [];
  return { recorrido: r, errores, salen };
}

/**
 * Comprueba el plan de una sesión de estudio (lo que devolvió Claude) con reglas fijas. `candidatas`: Map id → { estado
 * ('nueva' | 'empezada' | 'terminada'), repasos, requisitos, minutos }; `pedido`: { minutos }; `perfil`: el de la
 * persona (o null). Reglas: solo lecciones candidatas; de 1 a 6 bloques; los minutos, entre el 60 % y el 115 % de los
 * pedidos; «repaso» solo con repasos vencidos, uno y como mucho el 40 % del tiempo; «practica» solo de una lección que va
 * antes en la sesión o que la persona ya empezó o terminó; sin lecciones repetidas (salvo lección y luego su práctica);
 * «continuar» solo si está empezada; una lección entera, con al menos la mitad de sus minutos; y un requisito, antes que
 * la lección que lo pide. Devuelve { plan (recortado por src/pet/protocolo.js), errores (en español, para corregir) }.
 */
/** Añade los datos de la persona (textoDatosPersona) a su último mensaje; sin datos, los mensajes tal cual. */
function conDatosPersona(mensajes, datos) {
  if (!datos) return mensajes;
  const ultimo = mensajes.at(-1);
  if (ultimo?.role !== 'user') return [...mensajes, { role: 'user', content: datos }];
  return [...mensajes.slice(0, -1), { ...ultimo, content: `${ultimo.content}\n\n${datos}` }];
}

export function revisarSesion(bruto, { candidatas, pedido, perfil = null }) {
  if (!bruto || typeof bruto !== 'object') return { plan: null, errores: ['falta el plan de la sesión («plan»)'] };
  const errores = [];
  const crudos = Array.isArray(bruto.bloques) ? bruto.bloques : [];
  if (crudos.length > LIMITES.bloquesSesion) errores.push(`demasiados bloques (máximo ${LIMITES.bloquesSesion})`);
  crudos.forEach((b, i) => {
    if (b?.tipo !== 'repaso' && typeof b?.leccion === 'string' && !candidatas.has(b.leccion)) errores.push(`bloque ${i + 1}: la lección ${b.leccion} no está entre las candidatas`);
    else if (b?.tipo !== 'repaso' && !b?.leccion) errores.push(`bloque ${i + 1}: falta la lección`);
    if (!(Number.isInteger(b?.minutos) && b.minutos > 0)) errores.push(`bloque ${i + 1}: sin minutos`);
  });
  const plan = limpiarPlanSesion(bruto, new Set(candidatas.keys()));
  if (!plan) return { plan: null, errores: [...errores, 'la sesión necesita un título y al menos un bloque válido'] };
  const vencidas = perfil?.vencidas ?? 0;
  const lecciones = new Map();          // lección → posición de su bloque «leccion»
  const practicas = new Set();
  let total = 0;
  let repaso = 0;
  let repasos = 0;
  plan.bloques.forEach((b, i) => {
    const n = i + 1;
    total += b.minutos;
    if (b.tipo === 'repaso') {
      repasos++;
      repaso += b.minutos;
      if (!(vencidas > 0)) errores.push(`bloque ${n}: no hay repasos vencidos, así que no puede haber bloque de repaso`);
      return;
    }
    const c = candidatas.get(b.leccion);
    if (b.tipo === 'leccion') {
      if (lecciones.has(b.leccion)) errores.push(`bloque ${n}: la lección ${b.leccion} ya está en la sesión`);
      if (practicas.has(b.leccion)) errores.push(`bloque ${n}: la práctica de ${b.leccion} va después de su lección, no antes`);
      if (b.parte === 'continuar' && c.estado !== 'empezada') errores.push(`bloque ${n}: «continuar» solo vale con una lección empezada sin terminar (${b.leccion} está ${c.estado})`);
      if (b.parte === 'entera' && Number.isInteger(c.minutos) && b.minutos < Math.ceil(c.minutos / 2)) errores.push(`bloque ${n}: ${b.leccion} entera dura unos ${c.minutos} min, no ${b.minutos}; dale más tiempo o usa «inicio»`);
      if (!lecciones.has(b.leccion)) lecciones.set(b.leccion, i);
    } else {
      if (practicas.has(b.leccion)) errores.push(`bloque ${n}: la práctica de ${b.leccion} ya está en la sesión`);
      if (!lecciones.has(b.leccion) && c.estado === 'nueva' && !c.repasos) errores.push(`bloque ${n}: práctica de ${b.leccion}, que la persona no ha empezado y no va antes en la sesión`);
      practicas.add(b.leccion);
    }
  });
  // Un requisito que también está en la sesión va antes que la lección que lo pide.
  for (const [id, i] of lecciones) {
    for (const r of candidatas.get(id)?.requisitos ?? []) if (lecciones.has(r) && lecciones.get(r) > i) errores.push(`la lección ${r} es requisito de ${id}: tiene que ir antes`);
  }
  const min = Math.ceil(pedido.minutos * 0.6);
  const max = Math.floor(pedido.minutos * 1.15);
  if (total < min || total > max) errores.push(`la sesión dura ${total} min y tiene que durar entre ${min} y ${max} (pidió ${pedido.minutos})`);
  if (repasos > 1) errores.push('como mucho un bloque de repaso');
  if (repaso > Math.floor(pedido.minutos * 0.4)) errores.push(`el repaso ocupa ${repaso} min: como mucho el 40 % del tiempo (${Math.floor(pedido.minutos * 0.4)} min)`);
  return { plan, errores: [...new Set(errores)] };
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
 * La misma respuesta con el cupo diario (`cupo`): en el JSON, un campo más; en un flujo NDJSON, en su primer evento
 * (cancelar el flujo nuevo cancela el de dentro: la creación se detiene igual).
 */
async function conCupo(respuesta, cupo) {
  const tipo = respuesta.headers.get('content-type') ?? '';
  if (tipo.startsWith('application/json')) {
    const texto = await respuesta.text();
    let datos;
    try { datos = JSON.parse(texto); } catch { return new Response(texto, { status: respuesta.status, headers: respuesta.headers }); }
    return new Response(JSON.stringify({ ...datos, cupo }), { status: respuesta.status, headers: respuesta.headers });
  }
  if (tipo.startsWith('application/x-ndjson') && respuesta.body) return new Response(conPrimerEvento(respuesta.body, { cupo }), { status: respuesta.status, headers: respuesta.headers });
  return respuesta;
}

/** Un flujo NDJSON con `extra` añadido a su primera línea; lo demás pasa tal cual. */
function conPrimerEvento(cuerpo, extra) {
  const lector = cuerpo.getReader();
  const cod = new TextEncoder();
  const dec = new TextDecoder();
  let primera = true;
  let resto = '';
  return new ReadableStream({
    async pull(controller) {
      for (;;) {
        const { value, done } = await lector.read();
        if (done) {
          if (resto) controller.enqueue(cod.encode(resto));
          controller.close();
          return;
        }
        if (!primera) { controller.enqueue(value); return; }
        resto += dec.decode(value, { stream: true });
        const i = resto.indexOf('\n');
        if (i < 0) continue;
        primera = false;
        let linea = resto.slice(0, i);
        try { linea = JSON.stringify({ ...JSON.parse(linea), ...extra }); } catch { /* no es JSON: tal cual */ }
        controller.enqueue(cod.encode(`${linea}\n${resto.slice(i + 1)}`));
        resto = '';
        return;
      }
    },
    cancel(motivo) { return lector.cancel(motivo); },
  });
}

/** 429 de un límite de uso (`limite`: esta dirección; `ocupado`: todas), con cuánto falta para que quepa (`espera`, s). */
function respuestaLimite(motivo, esperaMs) {
  const s = Math.max(1, Math.ceil(esperaMs / 1000));
  return json(429, { ok: false, error: motivo, espera: s }, { 'retry-after': String(s) });
}

/**
 * La fecha de una lección nueva: el día de la persona en su calendario (`hoy`, AAAA-MM-DD, lo manda la app), si es uno
 * de los días que puede ser ahora en la Tierra (de UTC−12 a UTC+14). Si no lo manda o no cuadra, el día en la zona del
 * servidor (America/Tijuana por defecto). Solo es la fecha que se enseña: el gasto va por sus propios días.
 */
export function fechaPedagogica(hoy, ms = Date.now(), zona = 'America/Tijuana') {
  const dia = (x) => new Date(x).toISOString().slice(0, 10);
  if (typeof hoy === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(hoy) && [ms - 12 * 3600_000, ms, ms + 14 * 3600_000].map(dia).includes(hoy)) return hoy;
  return periodos(ms, zona).dia;
}

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
      try { await trabajo(emitir, control.signal); } catch (err) { if (!control.signal.aborted) { console.error(`[pet] Error al redactar (${err?.codigo ?? err?.name ?? 'error'}).`); emitir({ estado: 'error', error: 'servidor' }); } }
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

/** La huella de un plan (SHA-256 de su forma limpia, src/pet/protocolo.js): el mismo plan, la misma huella. */
export function huellaPlan(plan) {
  const p = limpiarPlan(plan);
  return p ? createHash('sha256').update(JSON.stringify(p)).digest('hex') : null;
}

/**
 * Las creaciones ya cobradas al planificar una lección y aún sin redactar: cada una, de quien la pagó (`identidad`: su
 * dispositivo o su dirección) y ligada a su trabajo y a la huella de su plan. Redactar ese trabajo (o ese plan con otro
 * trabajo, como el reintento de la app) la usa en vez de cobrar otra; se gasta cuando esa redacción llega a cobrarse. En
 * memoria (un día como mucho, 5000 a la vez): si se pierde, la redacción cobra otra vez, nunca una de menos.
 * `tomar` la reserva (dos peticiones a la vez no usan la misma); `soltar` la deja como estaba; `gastar` la quita;
 * `anotar` la crea (o le añade otro plan) y la deja libre.
 */
export function crearPagadas({ ahora = Date.now, vidaMs = 24 * 3600_000, maximo = 5000 } = {}) {
  const porClave = new Map();          // `${identidad}|t:${trabajo}` o `${identidad}|p:${huella}` → entrada
  const clavesDe = (identidad, { trabajo = null, huella = null }) => [trabajo && `${identidad}|t:${trabajo}`, huella && `${identidad}|p:${huella}`].filter(Boolean);
  function podar() {
    const t = ahora();
    for (const [k, e] of porClave) if (t - e.creada > vidaMs) porClave.delete(k);
    for (const k of porClave.keys()) { if (porClave.size <= maximo) break; porClave.delete(k); }
  }
  return {
    tomar(identidad, ligada) {
      if (!identidad) return null;
      podar();
      for (const k of clavesDe(identidad, ligada)) {
        const e = porClave.get(k);
        if (e && !e.ocupada) { e.ocupada = true; return e; }
      }
      return null;
    },
    soltar(e) { e.ocupada = false; },
    gastar(e) { for (const k of e.claves) if (porClave.get(k) === e) porClave.delete(k); },
    anotar(identidad, ligada, previa = null) {
      const e = previa ?? { claves: new Set(), creada: ahora(), ocupada: false };
      for (const k of clavesDe(identidad, ligada)) { e.claves.add(k); porClave.set(k, e); }
      e.ocupada = false;
      podar();
      return e;
    },
    get tamaño() { return new Set(porClave.values()).size; },
  };
}

/**
 * Límite de uso: `porIp` peticiones por dirección cada `ventanaIp` ms y `porHora` en total. En memoria: en un servicio
 * con varias instancias es aproximado; el tope de gasto (server/neuri/presupuesto.mjs) es el que manda en el dinero.
 * `limitar(ip)` cuenta una petición y devuelve null o por qué no (`limite`: esta dirección; `ocupado`: todas);
 * `limitar.consultar(ip)`, sin contarla, si cabría y cuánto falta (ms) para que quepa. La dirección cuenta normalizada
 * (server/neuri/ip.mjs): una IPv6, por su /64.
 */
export function crearLimitador({ porIp, ventanaIp, porHora, ahora = Date.now }) {
  const porDireccion = new Map();
  let ultimaHora = [];
  function mirar(ip, t) {
    ultimaHora = ultimaHora.filter((x) => t - x < 3600_000);
    const recientes = (porDireccion.get(ip) ?? []).filter((x) => t - x < ventanaIp);
    if (ultimaHora.length >= porHora) return { motivo: 'ocupado', esperaMs: ultimaHora[0] + 3600_000 - t, recientes };
    if (recientes.length >= porIp) return { motivo: 'limite', esperaMs: recientes[0] + ventanaIp - t, recientes };
    return { motivo: null, esperaMs: 0, recientes };
  }
  function limitar(direccion) {
    const ip = normalizarIp(direccion);
    const t = ahora();
    const m = mirar(ip, t);
    if (m.motivo) { porDireccion.set(ip, m.recientes); return m.motivo; }
    m.recientes.push(t);
    porDireccion.set(ip, m.recientes);
    ultimaHora.push(t);
    if (porDireccion.size > 5000) for (const [k, v] of porDireccion) if (!v.some((x) => t - x < ventanaIp)) porDireccion.delete(k);
    return null;
  }
  limitar.consultar = (direccion) => {
    const m = mirar(normalizarIp(direccion), ahora());
    return { motivo: m.motivo, esperaMs: Math.max(0, Math.ceil(m.esperaMs)) };
  };
  return limitar;
}
