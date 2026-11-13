// Trabajos de Neuri en el servidor: crear o adaptar una lección tarda uno o dos minutos, así que cada creación es un
// trabajo con su identificador (lo pone la app: un UUID aleatorio). Así:
//  - si la conexión se corta (se recarga la página, se cae la red), el trabajo sigue y la app se vuelve a conectar con
//    el mismo identificador: recibe lo que ya pasó y lo que falta;
//  - pedir otra vez el mismo trabajo no lo empieza de nuevo (no se duplica ni se paga dos veces);
//  - solo «cancelar» (una petición explícita) lo detiene: entonces se corta la llamada en curso a Claude.
// Los trabajos terminados se guardan un rato (para recuperar el resultado) y luego se olvidan.
//
// En memoria: sirve para un servidor (el de desarrollo o uno solo en producción). Con varias instancias hace falta un
// almacén compartido (ver docs/estudio/guia-operativa.md).

export const ID_TRABAJO = /^[a-z0-9][a-z0-9-]{15,63}$/;
const CONSERVAR_MS = 30 * 60_000;      // un trabajo terminado se guarda media hora
const LATIDO_MS = 15_000;              // mientras trabaja, una señal de vida cada 15 s (la app vigila los silencios)

/**
 * `maximo`: trabajos en curso a la vez (en total); `porIp`: en curso a la vez por dirección.
 * `ahora` y `programar` (setTimeout/setInterval) se pueden cambiar en las pruebas.
 */
export function crearRegistro({ maximo = 8, porIp = 2, ahora = Date.now, latidoMs = LATIDO_MS } = {}) {
  const trabajos = new Map();

  function limpiar() {
    const t = ahora();
    for (const [id, j] of trabajos) if (j.final && t - j.terminado > CONSERVAR_MS) trabajos.delete(id);
  }

  function emitir(j, evento) {
    if (j.final) return;
    if (evento.estado !== 'latido') j.eventos.push(evento);
    for (const fn of j.suscriptores) { try { fn(evento); } catch { /* un oyente roto no para el trabajo */ } }
    if (['lista', 'limitacion', 'error'].includes(evento.estado)) {
      j.final = evento;
      j.terminado = ahora();
      clearInterval(j.latido);
      for (const fn of j.suscriptores) { try { fn(null); } catch { /* nada */ } }
      j.suscriptores.clear();
    }
  }

  return {
    /** ¿Existe? */
    tiene: (id) => (limpiar(), trabajos.has(id)),
    /** Lo que se sabe de un trabajo (sin la lección): para las pruebas y el registro. */
    estado(id) {
      const j = trabajos.get(id);
      return j ? { id, final: j.final?.estado ?? null, eventos: j.eventos.length, ip: j.ip } : null;
    },
    /**
     * Empieza un trabajo nuevo, o devuelve null si no se puede (`motivo`: 'limite' u 'ocupado'). `trabajo(emitir,
     * signal)` hace la creación; sus estados se guardan y se reparten a quien esté conectado.
     */
    empezar(id, ip, trabajo) {
      limpiar();
      const enCurso = [...trabajos.values()].filter((j) => !j.final);
      if (enCurso.length >= maximo) return { motivo: 'ocupado' };
      if (enCurso.filter((j) => j.ip === ip).length >= porIp) return { motivo: 'limite' };
      const j = { id, ip, creado: ahora(), eventos: [], suscriptores: new Set(), final: null, terminado: null, control: new AbortController(), latido: null };
      trabajos.set(id, j);
      j.latido = setInterval(() => emitir(j, { estado: 'latido' }), latidoMs);
      j.latido.unref?.();
      Promise.resolve()
        .then(() => trabajo((e) => emitir(j, e), j.control.signal))
        .catch((err) => { if (!j.control.signal.aborted) console.error(`[pet] Error en un trabajo (${err?.codigo ?? err?.name ?? 'error'}).`); emitir(j, { estado: 'error', error: j.control.signal.aborted ? 'cancelada' : 'servidor' }); })
        .finally(() => { if (!j.final) emitir(j, { estado: 'error', error: j.control.signal.aborted ? 'cancelada' : 'incompleta' }); });
      return { trabajo: j };
    },
    /**
     * Se conecta a un trabajo: `alEvento(evento)` recibe primero lo ya pasado y luego lo nuevo; `null` al terminar.
     * Devuelve la función para desconectarse (desconectarse no cancela el trabajo).
     */
    conectar(id, alEvento) {
      const j = trabajos.get(id);
      if (!j) return null;
      for (const e of j.eventos) alEvento(e);
      if (j.final) { alEvento(null); return () => {}; }
      j.suscriptores.add(alEvento);
      return () => j.suscriptores.delete(alEvento);
    },
    /** Cancela un trabajo en curso (corta la llamada a Claude). Devuelve si había algo que cancelar. */
    cancelar(id) {
      const j = trabajos.get(id);
      if (!j || j.final) return false;
      j.control.abort();
      emitir(j, { estado: 'error', error: 'cancelada' });
      return true;
    },
    get enCurso() { return [...trabajos.values()].filter((j) => !j.final).length; },
  };
}
