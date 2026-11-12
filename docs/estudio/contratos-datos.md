---
title: Contratos de datos de «Estudiar» y Neuri
fecha: 2026-11-09
estado: vigente
---

# Contratos de datos de «Estudiar» y Neuri

Qué datos hay, dónde viven, quién puede cambiarlos, con qué versión y qué pasa con ellos al cancelar, adaptar, borrar, importar o retirar contenido (especificación, sección 26). Todo está en el código citado; si algo cambia, este documento debe cambiar con él.

## Principios

1. **Cada cosa tiene su identificador y no se mezclan.** Hay seis identificadores distintos:
   - el de la lección (estable), por ejemplo `ms-codo` o `neuri-huesos-de-la-nariz-a1b2`;
   - su versión de contenido;
   - el trabajo de creación (un UUID);
   - el intento de respuesta (fecha, lección y pregunta);
   - el reporte (un UUID);
   - el evento (un UUID).
2. **Ni el navegador ni el modelo se dan permisos o estados editoriales.** Una lección de Neuri es siempre «borrador», también si se importa de un archivo. El modo de cada petición a Neuri lo pone la app según el botón, nunca el texto. Lo que devuelve Claude se recorta y se comprueba contra lo que existe.
3. **Una sola fuente para el catálogo**, que comparten:
   - la búsqueda;
   - Neuri;
   - el reproductor de lecciones;
   - la evaluación.

   Lo retirado se quita en todos a la vez, y una tarjeta solo enlaza lecciones que se pueden abrir.
4. **Nada se pierde en silencio.** Lo guardado que no se puede leer (dañado o de una versión más nueva) se aparta antes de escribir. Si no se puede apartar, no se escribe.
5. **Los campos nuevos se añaden sin romper lo anterior.** Una versión anterior de la app los ignora y, al guardar, los conserva.

## Dónde vive cada dato

| Dato | Dónde | Clave o archivo | Versión | Quién lo cambia |
| --- | --- | --- | --- | --- |
| Lecciones de la biblioteca | Código | `web/src/biblioteca/lecciones/*.js`, `modulos.js` | `version` de cada lección | Quien edita el contenido, con revisión (`npm run check`) |
| Catálogo | Generado | `web/src/biblioteca/generado/catalogo.json` | — | `node scripts/biblioteca.mjs` |
| Fuentes | Generado | `web/src/biblioteca/generado/fuentes.json` | `huella` de cada página | `node scripts/biblioteca/fuentes.mjs` |
| Recorridos y módulos | Código | `web/src/biblioteca/recorridos.js` | — | Quien edita el contenido |
| Contenido retirado | Código | `web/src/biblioteca/retiradas.js` | — | Quien revisa, con `npm run reportes -- retirar` (y publicar) |
| Limitaciones conocidas del modelo 3D | Código | `web/src/data/limitaciones.js` | `comprobada` (fecha) y `recurso` (archivo de cada modelo) de cada entrada | Quien comprueba el modelo, con `npm run check` (y publicar); ver `limitaciones-modelo.md` |
| Progreso, intentos, repasos, sesiones, preferencias y plan de examen | Navegador | `anato3d.biblioteca` (localStorage) | 2 | La persona, al estudiar |
| Progreso de la versión 1 | Navegador | `anato3d.progreso` | 1 | Nadie (solo se lee para migrar) |
| Mis lecciones | Navegador | `anato3d.propias` | — (cada lección valida su forma) | La persona, con Neuri |
| Lecciones propias apartadas | Navegador | `anato3d.propias.apartadas` | — | La app (solo para no perderlas) |
| Trabajos de creación | Navegador y servidor | `anato3d.trabajos`; memoria del servidor | — | La app y el servidor |
| Conversación con Neuri | Pestaña | `anato3d.neuri` (sessionStorage) | — | La persona |
| Reportes de problemas | Navegador y servidor | `anato3d.reportes`; `web/server/datos/reportes.jsonl` | 1 | La persona (envía); quien revisa (decide) |
| Decisiones sobre reportes | Servidor | `web/server/datos/decisiones.jsonl` | — | Quien revisa (`npm run reportes`) |
| Estadísticas de uso | Navegador | `anato3d.eventos`, `anato3d.privacidad`, `anato3d.invitado` | 1 | La app, solo con consentimiento |
| Cuentas | — | No existen | — | Bloqueado (ver abajo) |

Las claves de estudio del navegador están en `CLAVES_ESTUDIO` (`web/src/biblioteca/datos.js`). «Borrar mis datos» quita exactamente esas y la conversación, y deja los ajustes de la app (idioma, calidad).

## Lección

**Formato:** `web/src/biblioteca/formato.js`, que también hace de revisor (comprueba que la lección está bien formada).

**Campos obligatorios:**
- `id` y `version`;
- `titulo` y `resumen`;
- `lugares`, `sistemas`, `formato`, `temas`, `nivel` (1–3) y `minutos`;
- `objetivos` (entre 2 y 6, observables: empiezan por un verbo);
- `estructuras`: `{ nombre, piezas, lado, papel, tipo }`;
- `pasos`: `{ id, tipo, titulo, texto, vista?, actividad?, comprobar? }`;
- `preguntas`;
- `revision`: `{ estado, revisor, fecha, notas }`.

**Opcionales:** `requisitos`, `siguiente`, `modelos` (por defecto, los dos) e `idiomas` (por defecto, `['es']`).

**Citas:** cada frase del texto lleva su evidencia (`W('Página', 'cita literal')` y otras), comprobada palabra por palabra contra una revisión fija de la fuente.

**Estados editoriales** (`web/src/content/schema.js`):

| Estado | Condición |
| --- | --- |
| `borrador` | El de todas las lecciones hoy (71 de 71) |
| `revisado` | Exige `revisor` y `fecha`; el revisor de formato lo comprueba |
| `retirado` | — |

**Idioma del contenido e idioma de la interfaz van aparte.** `idiomas` dice en qué idiomas está el **contenido**. La interfaz está completa en cinco, pero eso no hace que una lección cuente como traducida. Hoy:
- brazo y antebrazo tienen contenido en cinco idiomas, traducido con IA y sin revisar;
- las otras 69 lecciones, solo en español.

El filtro de idioma y la etiqueta de la tarjeta usan `idiomas`.

**Versión:**
- el progreso guarda con qué versión se estudió cada lección;
- cada intento lleva la versión;
- cada pregunta tiene una **huella** (`huella()` en `evaluar.js`): si su texto o sus opciones cambian, la huella cambia y los fallos anteriores dejan de contar.

## Lección propia (Mis lecciones)

**Formato:** el mismo que el de la biblioteca, con tres diferencias:
- el `id` es `neuri-…` (`ID_PROPIA`);
- lleva `origen: { neuri: true, modo: 'crear' | 'adaptar', base, fecha, modelo, instrucciones, tituloOriginal? }`;
- `revision.estado` siempre es `borrador` y `revisor` siempre `null`. `esPropiaValida` rechaza cualquier otra cosa, también al importar.

**Límites:** 40 lecciones, 3 MB y títulos de 120 caracteres.

**Transiciones:**

| Acción | Qué pasa | Qué se conserva |
| --- | --- | --- |
| Crear | Se guarda tras validarla | — |
| Guardar con el máximo lleno | Falla con «lleno» y no se borra ninguna. La creación queda «Lista pero sin guardar» para descargarla o guardarla tras liberar espacio | Todo |
| Guardar un id que ya existe con otro contenido | Se guarda como copia (`-copia2`…) | La original |
| Renombrar | Cambia `titulo` y anota `origen.tituloOriginal` | El contenido, la versión, el progreso y las respuestas |
| Adaptar | Crea **otra** lección (otro `id`, `origen.modo: 'adaptar'`, `origen.base` = la original) | La original y todo su progreso |
| Quitar (tras confirmar) | Se borra la lección, su progreso, sus preguntas del repaso y su favorito | Lo demás. No se puede deshacer (se avisa) |
| Exportar | Archivo `{ formato: 'anato3d.mis-lecciones', version: 1, fecha, lecciones }` | — |
| Importar | Combina sin duplicar: las iguales se omiten, las distintas con el mismo id entran como copia, las no válidas se rechazan y las que no caben se cuentan | Lo que ya había |
| Datos dañados o de otra versión | Se apartan en `anato3d.propias.apartadas` antes de escribir; la persona puede descargarlos o descartarlos | Todo hasta que la persona decide |

## Progreso (versión 2)

**Código:** `web/src/biblioteca/progreso.js`. Clave `anato3d.biblioteca`.

```
{ version: 2,
  lecciones: { [id]: { version, paso, vistos, completada, actividad, evaluaciones: [{ fecha, aciertos, total, porObjetivo, demostrada, sinEvaluar? }] } },
  items:     { [leccion/pregunta]: { caja, aciertos, fallos, dudas, ultimo, proximo, qh?, aplazado?, huerfana? } },
  favoritos: [ids], sesiones: [{ fecha, tipo, aciertos, total }],
  intentos:  [{ f, l, v, q, t, h, o, e, r, x, d, m, qh?, a? }],
  preferencias: { nivel, minutos, intereses } | null,
  examen: { temario, fecha, minutosDia, dias, temas, creado, actualizado } | null,
  migracion: { desde: 1, fecha, lecciones } | null }
```

### Estados de una lección

Cuatro cosas distintas:
- **avance:** los pasos vistos;
- **finalización:** haber llegado al final;
- **aprendizaje demostrado:** una evaluación con el 80 % o más y algún acierto en cada objetivo;
- **dominio a largo plazo:** todas sus preguntas en la caja 3 o más del repaso.

**Limitaciones del modelo:** las preguntas que el modelo 3D no permite hacer (ver `limitaciones-modelo.md`) no entran en la
evaluación ni cuentan para el dominio.
- Si a un objetivo no le queda ninguna, su índice se guarda en `sinEvaluar`. Esa evaluación no demuestra la lección y,
  mientras dure la limitación, tampoco hay dominio.
- Si una pregunta no se puede mostrar a mitad de la evaluación, queda como intento `tecnico`. El evento `error_tecnico`
  lleva entonces el código `limite-modelo`, y no `pregunta-no-mostrable`.

Abrir o leer no cuenta como comprensión.

### Repaso espaciado (Leitner)

- **Cajas:** de 0 a 4, con intervalos de 0, 1, 3, 7 y 21 días.
- **Acierto seguro:** sube una caja, pero solo si la pregunta ya tocaba.
- **Acierto con duda:** se queda donde estaba.
- **Fallo o «no lo sé»:** vuelve a la 0.
- **`aplazado`:** la persona pidió no verla hasta una fecha (de 1 a 30 días).
- **`huerfana`:** su pregunta ya no existe, está retirada o pide en el modelo 3D una pieza con una limitación conocida
  (`motivoNoDisponible` da `'limitacion'` con el modelo en uso). No cuenta, pero se conserva por si vuelve: al retirar la
  limitación, se recupera sola la próxima vez que se abra la lección.

### Intento

`registrarIntento`; se guardan los 600 últimos.

| Campo | Contenido |
| --- | --- |
| `f` | Fecha |
| `l`, `v` | Lección y su versión |
| `q`, `t` | Pregunta y su tipo |
| `h` | Habilidad (ver tabla) |
| `o` | Objetivo |
| `e` | Estructura |
| `r` | Resultado: `acierto`, `duda`, `fallo` o `tecnico` (no cuenta) |
| `x` | La opción elegida si falló |
| `d` | Si dudó |
| `m` | Modo: `evaluacion`, `repaso`, `practica` o `leccion` |
| `qh` | La huella de la pregunta |
| `a` | Ayudas: `opciones`, `autoevaluada` o `escrita` |

**Habilidad de cada tipo de pregunta:**

| Habilidad | Tipos de pregunta |
| --- | --- |
| Reconocer | Identificar |
| Localizar | Localizar |
| Relacionar | Relación y secuencia |
| Explicar | Función |
| Comparar | Comparación |

Estados de cada habilidad: sin datos, practicando, demostrada y consolidada.

### Migración

- **Desde la versión 1** (`anato3d.progreso`, solo brazo y antebrazo): se copia al formato 2 la primera vez y la clave antigua no se toca, así que volver a una versión anterior no pierde nada.
- **Si lo guardado no se puede leer:** se aparta en `anato3d.biblioteca.apartado` antes de empezar de cero. Si no se puede apartar, `guardar` se niega a escribir.

### Corrección o retirada de una pregunta

Al cargar la lección, `depurar()`:
- pone a cero el ítem si cambió la huella;
- marca como `huerfana` lo que ya no existe o está retirado.

Los fallos anteriores dejan de contar contra la persona (especificación, sección 23).

## Plan de examen

**Código:** `web/src/biblioteca/examen.js`. Guardado dentro del progreso (`examen`).

- **Fechas:** días del calendario local `AAAA-MM-DD`. No se convierten a hora UTC, que cambiaría el día al oeste de Greenwich: el 9 de noviembre se corrigió un caso en la entrada.
- **Sin fecha de examen:** el plan cubre dos semanas y lo dice; no se inventa una fecha.
- **Temas sin lección:** quedan como laguna (`laguna: true`), con la opción de pedírsela a Neuri.
- **El temario** define el alcance académico: no es una fuente anatómica.

| Transición | Qué pasa |
| --- | --- |
| Crear | La persona revisa lo interpretado (temas, lecciones elegidas, fecha) antes de guardarlo |
| Rehacer | Al abrirlo, desde hoy y con el progreso de ahora: lo hecho se conserva y no se vuelve a planificar |
| Si no cabe | Lo dice con cifras y lista lo que no entra para ajustar el plan |
| Borrar | Se quita `examen`; el progreso no cambia |

## Trabajo de creación

**En la app:** `web/src/pet/trabajos.js`, clave `anato3d.trabajos`. Hasta 20; los terminados se olvidan a la semana.

```
{ id (UUID), estado, titulo, accion: 'crear' | 'adaptar', solicitud, plan, base,
  estructuras, evidencias, informe, leccionId, error, codigo, errores, mensaje, reanudable, creado, actualizado,
  reemplaza? }
```

`reemplaza` es el id del trabajo al que sustituye un reintento.

**Estados:**
- **en curso:** `planificando → fuentes → redactando → comprobando (→ corrigiendo → comprobando) → guardando`;
- **finales:** `guardada`, `no-guardada`, `aclaracion`, `limitacion`, `error` (con su código; `cancelada` incluida) e `interrumpida`.

Un estado que esta versión no conoce se lee como `interrumpida`.

**En el servidor:** `web/server/neuri/trabajos.mjs`.
- Registro en memoria por `id`, con sus eventos en orden.
- Señal de vida cada 15 s.
- Los terminados se guardan 30 minutos.

| Transición | Qué pasa | Qué se conserva |
| --- | --- | --- |
| Pedir el mismo id otra vez | El servidor no lo repite: devuelve lo que ya pasó y sigue | El trabajo (no se paga dos veces) |
| Corte de red (`reanudable`) | Reintentar con el **mismo** id | El trabajo del servidor |
| Otro final y «Reintentar» | Trabajo **nuevo** con el mismo plan, que sustituye al viejo en la conversación | El plan |
| Cancelar | La app pide `modo: 'cancelar'`; el servidor corta la llamada a Claude; queda `error: 'cancelada'` | La conversación; no se guarda ninguna lección |
| Recargar la página | La app se reconecta con `modo: 'trabajo'` (sin coste); si el servidor ya no lo tiene, queda `interrumpida` y volver a empezar es decisión de la persona (cuesta dinero) | El plan |
| Lista pero sin guardar | `no-guardada`: el resultado se conserva para reintentar o descargar | La lección generada (en memoria de la pestaña) |

## Protocolo de Neuri (versión 2)

**Código:** `web/src/pet/protocolo.js`, que comparten la app y el servidor.

**Modos:** `orientar`, `planificar`, `redactar`, `adaptar`, `trabajo` y `cancelar`. Los pone la app según el botón.

**Petición:** `{ v, idioma, modo, mensajes, progreso, propias, contexto, solicitud?, plan?, base?, trabajo? }`.

| Campo | Qué lleva |
| --- | --- |
| `progreso` | Solo identificadores de lecciones: empezadas, terminadas, con repasos pendientes y guardadas |
| `propias` | Título y resumen de cada lección propia, nunca su progreso |
| `base` | La lección propia entera, solo al adaptarla |

**Respuesta de orientar:** `{ tipo, mensaje, lecciones, sesion, recorrido, evidencias, solicitud, contexto, sugerencias }`.
- `limpiarRespuesta` quita lo que no existe (lecciones, recorridos, evidencias) y recorta los textos.
- Una propuesta sin solicitud válida pasa a aclaración.
- La app vuelve a filtrar con **su** catálogo: así no se recomienda nada retirado ni inexistente.

**Formato de Claude:** salida con esquema JSON (`output_config.format`), con enumeraciones de lo que existe. Recibir JSON no garantiza que el contenido sea correcto, así que el servidor además:
- comprueba que las citas están en la fuente;
- quita lo que sus citas no respaldan;
- deja una ronda de corrección. Si sigue mal, no se entrega.

**Versiones de las instrucciones:** `VERSION_INSTRUCCIONES` en `web/server/neuri/instrucciones.mjs`. Cada lección creada guarda en `origen.instrucciones` con qué versión se hizo.

## Reporte de un problema (versión 1)

**Código:** `web/src/biblioteca/reportes.js` (validación compartida) y `web/server/reportes.mjs` (cola).

```
{ v: 1, id (UUID), categoria, vista, leccion, version, paso, pregunta, estructura, idioma, modelo, comentario, fecha }
```

| Campo | Valores |
| --- | --- |
| `categoria` | `anatomia`, `referencia`, `pregunta`, `modelo`, `traduccion`, `tecnico` u `otro` (pide comentario) |
| `vista` | `leccion`, `pregunta`, `ficha` o `neuri` |
| `comentario` | Opcional, hasta 1000 caracteres |

**En la cola:**
- El reporte se guarda sin IP. Lo que no tiene la forma esperada se rechaza (400) y un id repetido devuelve 409.
- En el navegador se guardan los 100 últimos. Los no enviados se reenvían después.

**Decisión** (`npm run reportes -- decidir`): `{ reporte, resultado: aceptado | rechazado | corregido | duplicado, revisor, fecha, nota?, version? }`.
- Decidir sobre un reporte no valida la lección entera ni sus traducciones.
- `retirar` y `reponer` exigen el reporte y quien revisa, y cambian `retiradas.js`, que hay que publicar.

## Evento de uso (versión 1)

**Código:** `web/src/biblioteca/eventos.js`. Solo con las estadísticas activadas, que están desactivadas por defecto.

```
{ v: 1, id (UUID), tipo, fecha, sesion (una por pestaña), actor (seudónimo de este navegador), props }
```

- **Tipos:** lista cerrada (`TIPOS`). Cada propiedad tiene una forma controlada: identificador, código, número o sí/no. Nunca texto libre, temario, títulos propios ni nombres.
- **Sin duplicados:** el mismo tipo con la misma clave dentro de 10 minutos no se repite.
- **Límite:** se guardan los 300 últimos.
- **Sin envío:** no se envían a ningún sitio (no hay servidor de estadísticas). `lote()` prepara el envío para cuando lo haya.
- **Al desactivar:** se borran los eventos y el seudónimo.

**Tipos:**
- de lecciones: `leccion_iniciada`, `leccion_retomada` y `leccion_completada` (con segundos activos);
- de estudio: `actividad_respondida`, `evaluacion_terminada` y `repaso_realizado`;
- de búsqueda: `busqueda_sin_resultados` (solo qué filtros había);
- de Neuri: `generacion_solicitada`, `generacion_cancelada`, `generacion_fallida`, `generacion_completada` y `leccion_personal_abierta`;
- otros: `problema_reportado` y `error_tecnico`.

`migracion_invitado_completada` no existe todavía porque no hay cuentas.

**Tiempo activo:** solo cuenta con la página a la vista y con actividad en el último minuto.

## Archivo «Mis datos» (versión 1)

**Código:** `web/src/biblioteca/datos.js`.

```
{ formato: 'anato3d.mis-datos', version: 1, fecha, progreso, propias, trabajos, reportes, eventos, privacidad }
```

**Reglas al importar (combinar dos progresos):**

| Qué | Cómo se combina |
| --- | --- |
| Lecciones | Pasos vistos de los dos; terminada en la primera fecha; evaluaciones de los dos, sin repetir; el paso y la versión de la que se estudió más recientemente |
| Preguntas del repaso | El estado de la **respuesta más reciente**. El repaso es una secuencia: no se suman aciertos de dos copias ni se elige la caja más alta |
| Intentos y sesiones | Los de los dos, sin repetir |
| Favoritos | La unión |
| Preferencias y plan de examen | Los de aquí, si los hay |
| Lecciones propias | Como en «Importar» de Mis lecciones |

Es la base para la sincronización entre dispositivos cuando haya cuentas.

## Cuentas (bloqueado)

No hay cuentas, sincronización ni permisos por persona.

**Falta decidir** el alojamiento y el proveedor de autenticación (ver la guía operativa). Cuando se haga:
- el servidor tiene que autorizar cada acceso a lecciones, trabajos y progreso (un identificador enviado por el navegador no demuestra propiedad);
- la migración de invitado a cuenta debe usar estas mismas reglas de combinación, sin duplicados;
- al cambiar de cuenta no se debe adoptar el historial de otra persona.

Mientras tanto:
- **dispositivo compartido:** «Borrar mis datos de estudio»;
- **otro dispositivo:** el archivo «Mis datos».
