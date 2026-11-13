---
title: Contratos de datos de «Estudiar» y Neuri
fecha: 2026-11-09
estado: vigente
---

# Contratos de datos de «Estudiar» y Neuri

Qué datos hay, dónde viven, quién puede cambiarlos, con qué versión y qué pasa con ellos al cancelar, adaptar, borrar, importar o retirar contenido (especificación, sección 26). Todo está en el código citado; si algo cambia, este documento debe cambiar con él.

## Principios

1. **Cada cosa tiene su identificador y no se mezclan.** Hay diez identificadores distintos *[Histórico: ocho hasta las sesiones de estudio, el 12 nov; seis hasta los recorridos personales, el 9 nov por la noche]*:
   - el de la lección (estable), por ejemplo `ms-codo` o `neuri-huesos-de-la-nariz-a1b2`;
   - su versión de contenido;
   - el trabajo de creación (un UUID);
   - el recorrido personal (otro UUID, que nunca es el de un trabajo) y cada una de sus unidades (`u…`, estable aunque el recorrido cambie);
   - el intento de respuesta (fecha, lección y pregunta);
   - el reporte (un UUID);
   - el evento (un UUID);
   - la sesión de estudio con Neuri (`ses-…`), que no es una de las sesiones de práctica de `progreso.sesiones`;
   - el dispositivo (un UUID aleatorio, `anato3d.dispositivo`), que solo sirve para el cupo diario y no identifica a la persona.
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
| Recorridos personales | Navegador | `anato3d.recorridos` | 1 | La persona, con Neuri |
| Recorridos apartados | Navegador | `anato3d.recorridos.apartados` | — | La app (solo para no perderlos) |
| Sesiones de estudio con Neuri | Navegador | `anato3d.sesiones` | 1 | La persona, con Neuri o el planificador de la app |
| Sesiones apartadas | Navegador | `anato3d.sesiones.apartadas` | — | La app (solo para no perderlas) |
| Conversación con Neuri | Pestaña | `anato3d.neuri` (sessionStorage) | — | La persona |
| Memoria de Neuri entre visitas (tema, objetivo, nivel y minutos) | Navegador | `anato3d.neuri.memoria` | 1 | La app; caduca a los 30 días |
| Identificador del dispositivo | Navegador | `anato3d.dispositivo` | — | La app, una vez; viaja en la cabecera `x-anato3d-dispositivo` |
| Cupo diario de Neuri | Servidor | `<ANATO3D_DATOS>/cupo.json` (en desarrollo, `build/servidor/cupo.json`) | 2 | El servidor (`server/neuri/cupo.mjs`) |
| Reportes de problemas | Navegador y servidor | `anato3d.reportes`; `web/server/datos/reportes.jsonl` | 1 | La persona (envía); quien revisa (decide) |
| Decisiones sobre reportes | Servidor | `web/server/datos/decisiones.jsonl` | — | Quien revisa (`npm run reportes`) |
| Estadísticas de uso | Navegador | `anato3d.eventos`, `anato3d.privacidad`, `anato3d.invitado` | 1 | La app, solo con consentimiento |
| Cuentas | — | No existen | — | Bloqueado (ver abajo) |

Las claves de estudio del navegador están en `CLAVES_ESTUDIO` (`web/src/biblioteca/datos.js`). «Borrar mis datos» quita exactamente esas y la conversación, y deja los ajustes de la app (idioma, calidad). Desde el 12 nov incluyen las sesiones, la memoria de Neuri y el identificador del dispositivo. Esos dos últimos (`CLAVES_DISPOSITIVO`) se ven y se borran, pero **no se exportan**: son de este dispositivo, no del estudio.

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
| `borrador` | El de todas las lecciones hoy (87 de 87 el 12 nov) *[Histórico: 71 de 71]* |
| `revisado` | Exige `revisor` y `fecha`; el revisor de formato lo comprueba |
| `retirado` | — |

**Idioma del contenido e idioma de la interfaz van aparte.** `idiomas` dice en qué idiomas está el **contenido**. La interfaz solo se puede usar en español e inglés desde el 12 nov (alemán, francés e italiano, «próximamente»; `DISPONIBLES` en `src/i18n/idioma.js`) *[Histórico: completa y elegible en cinco]*, y eso no hace que una lección cuente como traducida. Hoy:
- brazo y antebrazo tienen contenido en cinco idiomas, traducido con IA y sin revisar;
- las otras 85 lecciones, solo en español *[Histórico: 82 el 11 nov; 69 antes de las 13 lecciones del 9 nov]*;
- en las fichas y los módulos, `npm run check` solo exige el inglés (`REQUERIDOS` en `scripts/contenido-i18n.mjs`).

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
| Quitar (tras confirmar) | Se borra la lección, su progreso, sus preguntas del repaso y su favorito. Si era una unidad de un recorrido, la unidad vuelve a «pendiente» | Lo demás. No se puede deshacer (se avisa) |
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
| `a` | Ayudas: `opciones`, `autoevaluada` o `escrita`; desde el 12 nov, en una sesión con Neuri, también `pista` y `segundo-intento`. Un intento con esas dos se anota como `duda`: no sube de caja y no cuenta como acierto en el mapa (`conAyuda` en `mapa.js`) ni en el perfil |

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
  reemplaza?, unidad?, hasta? }
```

`reemplaza` es el id del trabajo al que sustituye un reintento.

`hasta` (ms, desde el 11 nov 2026): en una pausa, cuándo se puede seguir. Una pausa es un `error` con `limite` u `ocupado` (cuota de creaciones) o con `sin-presupuesto` (tope de gasto) en el que el servidor no gastó nada: queda `reanudable` y se sigue con el mismo trabajo.

`unidad: { recorrido, id }` (opcional) dice que el trabajo crea una unidad de un recorrido personal:
- se planifica con su propia solicitud, que lleva `recorrido: { titulo, n, total, otras }` (lo que hace falta saber del recorrido para no repetir las otras unidades), y sin la conversación;
- un reintento conserva `unidad`, así que sigue siendo de la misma unidad;
- si la unidad o el recorrido ya no están, el trabajo sigue como una creación más y su lección se guarda igual.

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
| Pausa por cuota o tope de gasto (`reanudable`, `hasta`) | El servidor no empezó (ni planificó: lo mira antes); seguir con el **mismo** id cuando se pueda | Todo; no se pagó nada |
| Otro final y «Reintentar» | Trabajo **nuevo** con el mismo plan, que sustituye al viejo en la conversación | El plan |
| Cancelar | La app pide `modo: 'cancelar'`; el servidor corta la llamada a Claude; queda `error: 'cancelada'` | La conversación; no se guarda ninguna lección |
| Recargar la página | La app se reconecta con `modo: 'trabajo'` (sin coste); si el servidor ya no lo tiene, queda `interrumpida` y volver a empezar es decisión de la persona (cuesta dinero) | El plan |
| Lista pero sin guardar | `no-guardada`: el resultado se conserva para reintentar o descargar | La lección generada (en memoria de la pestaña) |

## Recorrido personal (versión 1)

Lo que no cabe en una lección, repartido en unidades que se crean de una en una (especificación, sección 14).

**Código:** `web/src/pet/recorridos.js` en la app, y `planificarRecorrido` y `revisarRecorrido` en `web/server/pet.mjs`.

**Clave:** `anato3d.recorridos`. Como mucho 12 recorridos de 8 unidades.

```
{ formato: 'anato3d.recorridos', version: 1, recorridos: [
  { id (UUID), estado, titulo, resumen, objetivo, nivel, solicitud, cambio, unidades, supuestos, limitaciones,
    mensaje, codigo, error, errores, reanudable, cola, auto, aviso, salen, instrucciones, creado, actualizado, pausa? } ] }

unidad: { id ('u…'), titulo, objetivo, enfoque, nivel, minutos, terminos, relacionadas, trabajo (UUID | null), leccion (id | null) }
```

| Campo | Qué lleva |
| --- | --- |
| `estado` | El de la última planificación: `planificando`, `listo`, `aclaracion`, `limitacion`, `error` o `interrumpido` |
| `solicitud`, `cambio` | Lo que se pidió al crearlo y, mientras se cambia, el cambio (para volver a intentarlo) |
| `cola` | La persona pidió crear todas: van en cola, una tras otra |
| `pausa` | Desde el 11 nov: la cola espera por la cuota (`motivo: 'cuota'`, con `hasta`) o por el tope de gasto (`motivo: 'presupuesto'`, con `hasta` o sin él), con la unidad en pausa |
| `auto` | La persona pidió el recorrido expresamente: al tener las unidades se crea la primera |
| `aviso` | Lo último que hay que contar: la cola se paró, no cabe, el cambio se canceló… |
| `salen` | Las unidades ya creadas que salieron en el último cambio (su lección sigue en «Mis lecciones») |
| `instrucciones` | `VERSION_INSTRUCCIONES` con que se planificó |
| `unidad.trabajo`, `unidad.leccion` | La creación de la unidad y la lección que guardó |
| `unidad.relacionadas` | Hasta 2 lecciones de la biblioteca que tratan algo parecido |

**Estado de cada unidad:** no se guarda; se deduce de su lección y de su trabajo (`ESTADOS_UNIDAD` en `protocolo.js`).

| Estado | Condición |
| --- | --- |
| `lista` | Su lección está en «Mis lecciones» |
| `preparando` | Su trabajo está en curso |
| `sin-guardar` | Su trabajo terminó `no-guardada` |
| `error` | Su trabajo terminó en error (no cancelado), limitación o aclaración |
| `interrumpida` | Su trabajo terminó `interrumpida`; volver a crearla necesita confirmarlo (`crearUnidad(…, { confirmado: true })`) |
| `detenida` | En pausa, sin fallo: su trabajo terminó en `error` con `limite` u `ocupado` (`motivo: 'cuota'`, con `hasta`) o con `sin-presupuesto` (`motivo: 'presupuesto'`). Al servidor y a Neuri se les cuenta como `pendiente` |
| `pendiente` | Sin trabajo ni lección, con el trabajo cancelado, o con la lección quitada de «Mis lecciones» |

Así, una unidad solo cuenta como lista si su lección se validó y se guardó, y el resto figura con su estado real.

**El estado del recorrido:** `planificando` solo mientras la pestaña que lo planifica espera la respuesta. Si la página se cerró a medias, se lee como `interrumpido` y volver a planificar es decisión de la persona.

| Transición | Qué pasa | Qué se conserva |
| --- | --- | --- |
| Planificar (propuesta con `accion: 'recorrido'`) | Una petición `planificar`; el servidor devuelve de 2 a 8 unidades revisadas. Si fue explícito («créame un curso…»), se crea la primera | — |
| Crear una unidad | Un trabajo de creación (ver «Trabajo de creación»). Si ya tenía plan, el mismo; tras un corte de red, el mismo trabajo. No empieza si otra del recorrido se está preparando, si se está planificando o si no cabe en «Mis lecciones» | — |
| Crear todas | `cola`: primero la unidad en pausa (si ya es la hora) y luego la siguiente que nunca se intentó, cuando no hay ninguna en preparación. Una pausa no la para: espera (`pausa`) y sigue sola a su hora. Se para ante cualquier otro final que no sea `guardada` (con `aviso`) y no reintenta lo que falló | Lo creado |
| Seguir ahora | Con una unidad en pausa: lo intenta ya (si sigue sin poderse, el servidor lo dice sin gastar y vuelve la pausa) | Todo |
| Recargar la página | El trabajo en marcha se retoma (`trabajos.js`); la cola sigue | Todo |
| Cambiar (propuesta con `recorrido_base`) | Petición `planificar` con `baseRecorrido`; la cola se para. Una unidad que se conserva (`conserva`) es la misma, con sus textos, su trabajo y su lección; las nuevas, pendientes | Las lecciones de las unidades que salen (`salen`) |
| Cancelar la planificación | Uno nuevo se quita (no tenía nada); un cambio deja el recorrido como estaba | El recorrido de antes |
| Quitar (tras confirmar) | Se quita el recorrido; lo que se está preparando sigue y se guarda | **Sus lecciones**: solo se borran si la persona elige aparte «Quitar también sus N lecciones» |
| Datos dañados o de una versión más nueva | Se apartan en `anato3d.recorridos.apartados` antes de escribir; si no se puede apartar (más de 30), no se escribe | Todo hasta que la persona decide |
| Otra pestaña los cambia | Se leen otra vez (evento `storage`), sin perder lo que esta pestaña está planificando | — |

**Lo que no decide el modelo:**
- los identificadores (del recorrido, de las unidades y de las lecciones);
- el estado de cada unidad;
- qué recorridos son de la persona: un cambio solo puede apuntar a uno de los que manda la app;
- los textos de lo que ya existe: al cambiar, la app pone los de antes;
- las lecciones relacionadas, que tienen que existir en la biblioteca.

## Sesión de estudio con Neuri (versión 1, desde el 11–12 nov 2026)

Un plan de estudio con lo que ya existe, guardado y reanudable en el navegador. No es lo mismo que las sesiones de práctica de `progreso.sesiones` (fecha, tipo, aciertos y total).

**Código:** `web/src/pet/sesiones.js` (almacén), `web/src/pet/planificador.js` (plan sin IA) y `planificarSesion` y `revisarSesion` en `web/server/pet.mjs` (modo `sesion`). El servidor nunca guarda sesiones.

**Clave:** `anato3d.sesiones`. Como mucho 20 (`MAX_SESIONES`).

```
{ formato: 'anato3d-sesiones', version: 1, sesiones: [
  { id ('ses-…'), creada, actualizada, origen: 'neuri' | 'local', idioma, modelo, titulo, objetivo, nivel, minutos,
    mensaje, estado, bloques, i, resultados, posicion: { bloque, n }, quitados, textos? } ] }

bloque:    { tipo: 'repaso', items, minutos, motivo }
         | { tipo: 'leccion', leccion, pasos: null (entera) | [ids de paso], minutos, motivo }
         | { tipo: 'practica', leccion, items, minutos, motivo }
           (+ motivoClave: { clave, datos } si el motivo lo puso la app; perdido: true si su lección ya no existe)
resultado: { bloque, cuando, aciertos, total, conAyuda, revelados, saltado, motivo?, fallos? }
```

| Campo | Qué lleva |
| --- | --- |
| `origen` | `neuri` (modo `sesion`, con Haiku) o `local` (el planificador de la app) |
| `estado` | `planificada`, `activa`, `pausada` o `finalizada`. Solo una activa: empezar otra pausa la anterior |
| `i`, `posicion` | El bloque en curso y, dentro de él, el paso o la pregunta, para reanudar justo ahí |
| `resultados` | Uno por bloque terminado o saltado; avanzar dos veces el mismo bloque no duplica |
| `conAyuda`, `revelados` | Bien tras la pista o en el segundo intento; fallada y con la respuesta enseñada |
| `quitados` | Cuántos bloques se quitaron al materializar el plan (la lección no existe, no está en el modelo o no tiene preguntas) |
| `textos` | Título, mensaje y objetivo como clave de texto, para que la interfaz los diga en el idioma de ahora |

**Límites:** de 1 a 6 bloques, de 1 a 60 minutos cada uno; el pedido, de 5 a 120 minutos. Un bloque de repaso, hasta 12 preguntas; uno de práctica, hasta 8.

| Transición | Qué pasa | Qué se conserva |
| --- | --- | --- |
| Crear | El plan (de la app o de Neuri) se limpia con `limpiarPlanSesion` y se materializa: preguntas reales y pasos de cada parte; lo que no existe o el modelo no muestra se quita y se cuenta | — |
| Empezar o reanudar | Pasa a `activa` en `i` y `posicion`; la que estaba activa queda `pausada` | Todo |
| Avanzar o saltar un bloque | Anota su resultado (sin duplicar) y sigue | Lo hecho |
| Pausar | `pausada` | Todo |
| Terminar (también antes de tiempo) | `finalizada` | Lo hecho |
| Una lección que desaparece | Su bloque queda `perdido` y se sigue con el resto | Sus resultados |
| Más de 20 | Se quitan, de la más antigua a la más nueva: las planificadas sin empezar, luego las finalizadas y, si aún sobran, las pausadas; nunca la activa ni la nueva. Se avisa (`alPodar`) | El progreso de lo estudiado |
| Quitar (tras confirmar) | Se quita la sesión | El progreso de lo estudiado |
| Datos dañados o de una versión más nueva | Se apartan en `anato3d.sesiones.apartadas` antes de escribir; si no se puede apartar, no se escribe | Todo hasta que la persona decide |
| El navegador no deja guardar | Se avisa una vez (`alNoGuardar`), sin perderla en silencio | La sesión en memoria |

**Lo que no decide el modelo:** los identificadores, las preguntas y los pasos reales, el estado, qué se quita y los resultados. El plan de Neuri solo puede usar las lecciones candidatas que le da el servidor, y lo revisa una comprobación determinista.

## Cupo diario de Neuri (servidor, versión 2, desde el 12 nov 2026)

**Código:** `web/server/neuri/cupo.mjs` y `web/server/neuri/ip.mjs`. Diseño: `neuri.md`, «Cupo diario por dispositivo».

```
{ v: 2, zona, dias: { [día]: { [clave HMAC]: { p, c } } } }
```

- **Clave:** HMAC-SHA256 (recortada a 128 bits) del identificador del dispositivo o de la IP normalizada, con una clave que sale de `ANATO3D_CUPO_SAL` y del día. La sal no está en el archivo.
- **`p` y `c`:** las preguntas con IA y las creaciones gastadas ese día.
- **Por defecto:** 30 y 3 por dispositivo; 300 y 30 por IP.
- **Días:** los de la zona del tope de gasto (America/Tijuana); los viejos se podan.
- **Versión 1** (con la sal dentro): al abrirla se empieza de cero, sin ella. **Dañado:** se aparta y se empieza de cero (son contadores del día, no datos de nadie).
- **Escritura:** atómica, con el mismo cerrojo con el PID que el tope de gasto.

**Lo que ve la app:** `{ preguntas: { limite, usadas, quedan }, creaciones: { … }, renueva }` (`limpiarCupo` en `protocolo.js`), en toda respuesta. Agotado: `429 { ok: false, error: 'cupo', de, cupo, espera }` con `retry-after`.

## Protocolo de Neuri (versión 2)

**Código:** `web/src/pet/protocolo.js`, que comparten la app y el servidor.

**Modos:** `orientar`, `planificar`, `redactar`, `adaptar`, `trabajo`, `cancelar` y, desde el 11 nov, `sesion`. Los pone la app según el botón. La versión del protocolo sigue siendo la 2: los campos nuevos son opcionales.

**Petición:** `{ v, idioma, modo, mensajes, progreso, propias, recorridos, contexto, solicitud?, plan?, base?, baseRecorrido?, trabajo?, pedido?, perfil?, enfoque? }`.

**Cabecera:** `x-anato3d-dispositivo`, con el identificador del dispositivo (`/^[a-z0-9][a-z0-9-]{15,63}$/`), en todas las peticiones a `/api/pet`. Nunca en el cuerpo.

| Campo | Qué lleva |
| --- | --- |
| `progreso` | Solo identificadores de lecciones: empezadas, terminadas, con repasos pendientes y guardadas |
| `propias` | Título y resumen de cada lección propia, nunca su progreso |
| `recorridos` | De cada recorrido personal (hasta 12): identificador, título y, de cada unidad, título, estado y lección si está lista |
| `base` | La lección propia entera, solo al adaptarla |
| `baseRecorrido` | Al cambiar un recorrido: cómo es ahora (sus unidades, con su estado). Tiene que ser el de `solicitud.recorrido_base` |
| `solicitud` | `accion`: `crear`, `adaptar` o `recorrido`. En un recorrido, además, `unidades` (cuántas pidió, o null) y `recorrido_base` (el que se cambia: solo uno de `recorridos`). Al crear una unidad, `recorrido: { titulo, n, total, otras }` |
| `pedido` | Solo en `sesion`, obligatorio: `{ objetivo (hasta 1200 caracteres), minutos (entero de 5 a 120), nivel (1–3 o null), modelo ('male' o 'female') }`. Si no es válido, `{ ok: false, error: 'pedido' }` |
| `perfil` | En `orientar` y `sesion`, si dice algo: `{ nivel, minutos, intereses, habilidades, dificultades, vencidas, ultima }`. Intereses: hasta 4 regiones o sistemas. Habilidades: las 5, con un estado válido. Dificultades: hasta 6, `{ leccion, estructura, motivo: 'confusion' \| 'nolose' \| 'fallo', fallos (1–9) }`. Vencidas: 0–999. Última sesión: título (hasta 80), bloques (1–12), hechos y si terminó. Sin fechas ni respuestas. Al modelo solo le llegan las cifras de la última sesión, no su título |
| `enfoque` | En `orientar` y `sesion`: `{ leccion, paso \| null, sesion: sí/no }`, dónde está la persona al preguntar |
| `mensajes` | Como mucho 12 en `orientar` (el último, de la persona) y 6 en `sesion` |

**Texto de la persona como dato** (instrucciones `2026-11-12.1`): el tema, el objetivo y los títulos y resúmenes de sus lecciones y recorridos van en su último mensaje, marcados como dato, nunca en las instrucciones.

**Respuesta de orientar:** `{ tipo, mensaje, lecciones, sesion, recorrido, evidencias, solicitud, contexto, sugerencias, mostrar, sesion_pedida }`. (`recorrido` es uno de la biblioteca; un recorrido personal se pide con `solicitud.accion: 'recorrido'`.) Desde el 11 nov:
- `mostrar`: hasta 3 estructuras `{ clave, nombre }` para «Ver en 3D» ([] por defecto); el servidor solo deja las que existen en el inventario;
- `sesion_pedida`: `{ objetivo, minutos, nivel }` o null, si la persona pidió una sesión;
- `sesion` (la lista de 2 a 8 lecciones de antes) no cambia.

**Respuesta de `sesion`:** `{ tipo: 'sesion', plan: { titulo, mensaje, objetivo, bloques } }` o `{ tipo: 'aclaracion', mensaje, sugerencias }`. Sin lecciones que encajen, aclaración sin llamar a Claude (`codigo: 'sin-candidatas'` u `'otro-modelo'`). Si el plan sigue mal tras la corrección, `502 formato`, y la app lo planifica sola.

**Errores nuevos:** `429 { error: 'cupo', de: 'preguntas' | 'creaciones', cupo, espera }` (ver «Cupo diario de Neuri»).

**Respuesta de planificar un recorrido:** `{ tipo: 'recorrido' | 'aclaracion' | 'limitacion', mensaje, recorrido: { titulo, resumen, objetivo, nivel, unidades, supuestos, limitaciones } | null, salen, sugerencias, instrucciones, codigo?, errores? }`. `codigo: 'recorrido-invalido'` si sigue mal tras la ronda de corrección.
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
- de las sesiones de estudio (desde el 12 nov): `sesion_creada` (origen, bloques y minutos) y `sesion_terminada` (origen, bloques, hechos, aciertos, total y si se completó); nunca el tema;
- otros: `problema_reportado` y `error_tecnico`.

`migracion_invitado_completada` no existe todavía porque no hay cuentas.

**Tiempo activo:** solo cuenta con la página a la vista y con actividad en el último minuto.

## Archivo «Mis datos» (versión 1)

**Código:** `web/src/biblioteca/datos.js`.

```
{ formato: 'anato3d.mis-datos', version: 1, fecha, progreso, propias, trabajos, recorridos, sesiones, reportes, eventos, privacidad }
```

`sesiones` se añadió el 11 nov sin cambiar de versión (con su propio formato versionado). El identificador del dispositivo y la memoria de Neuri **no van en el archivo**.

**Reglas al importar (combinar dos progresos):**

| Qué | Cómo se combina |
| --- | --- |
| Lecciones | Pasos vistos de los dos; terminada en la primera fecha; evaluaciones de los dos, sin repetir; el paso y la versión de la que se estudió más recientemente |
| Preguntas del repaso | El estado de la **respuesta más reciente**. El repaso es una secuencia: no se suman aciertos de dos copias ni se elige la caja más alta |
| Intentos y sesiones | Los de los dos, sin repetir |
| Favoritos | La unión |
| Preferencias y plan de examen | Los de aquí, si los hay |
| Lecciones propias | Como en «Importar» de Mis lecciones |
| Recorridos personales | Se añaden los que no hay (el mismo identificador no se sobrescribe), hasta 12, después de las lecciones. Sus unidades conservan su lección y pierden su trabajo, que era de otro navegador. Uno que se estaba planificando llega como interrumpido. Un archivo anterior a los recorridos no los trae y no pasa nada |
| Sesiones de estudio | Se añaden las que no hay (el mismo identificador no se sobrescribe), hasta 20. Una activa en el archivo llega pausada. Un archivo anterior a las sesiones no las trae y no pasa nada |

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
