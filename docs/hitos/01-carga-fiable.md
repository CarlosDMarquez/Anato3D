# Hito 1 — Carga fiable y recuperación de errores

Fecha: 2026-11-02. Base: commit `034429e`. Punto de partida: `docs/review-2026-11-01/REVIEW.md` (P1 «asynchronous loading can still mix models» y P2 «failed loads offer poor recovery»).

## 1. Resultado para el estudiante

- Cambiar de modelo, aunque sea rápido o con una conexión lenta, **nunca mezcla piezas de los dos cuerpos**. El último clic decide qué modelo se ve.
- Si algo no se descarga, el estudiante lee **qué pasó** y tiene un botón **Reintentar** que repite lo que pidió (activar esa capa, abrir esa estructura, cambiar de modelo). Ya no se le dice que mire la consola.
- Si falla el cambio a otro modelo, **sigue usando el actual** sin perder nada.

## 2. Criterios de aceptación

| Criterio | Cómo se comprueba | Resultado |
|---|---|---|
| Una petición iniciada para un modelo no añade nada al otro | Metadatos retrasados 5 s + cambio de modelo (navegador y prueba automática) | Cumple |
| Una descarga obsoleta se aborta | GLB retrasado 6 s + cambio de modelo | Cumple: no queda en caché ni en la escena |
| Cambios rápidos: el estado final es el del último clic, sin piezas sueltas | 5 clics en 0,6 s, con y sin caché; ida y vuelta | Cumple |
| Pedir lo mismo varias veces descarga una sola vez | 3 clics seguidos en «Muscular» | Cumple: 1 metadato, 1 GLB, 486 piezas, 1 raíz |
| Un fallo no bloquea el reintento | Red caída → Reintentar; 404 → Reintentar | Cumple |
| Mensaje claro y Reintentar en la primera carga | `male.glb` ausente → recarga → restaurar → Reintentar | Cumple |
| El buscador no mezcla modelos ni se queda sin índice para siempre | Índice lento + ida y vuelta; índice caído → Reintentar | Cumple |
| La limpieza de una carga obsoleta no quita una raíz ajena | Revisión de código: la raíz solo entra en `roots` tras comprobar | Cumple por construcción (no reproducido en vivo) |
| Sin errores de consola en un uso normal | Pestaña limpia: carga, muscular, cambio y vuelta | Cumple |

## 3. Cambios

- **`web/src/loading.js` (nuevo).** Sesión por modelo instalado (`Sessions`, `Session`): la petición queda a nombre de la sesión antes de la primera espera y se comprueba después de cada una (`Stale` si cambió). Cargador de sistemas con una sola descarga por sistema y sesión, que olvida los fallos. `fetchJSON` y `fetchBuffer` con estado HTTP, aborto, progreso y detección del `index.html` devuelto en lugar de un archivo. `describeError` para el mensaje.
- **`web/src/viewer.js`.** Descarga del GLB con `fetch` y `parseAsync`. `addSystem(url, { generation, signal, onProgress })`: la generación la fija quien pide; la raíz entra en `roots` solo tras compilar y comprobar; una carga por sistema y generación. `loadModel(url, { signal, onProgress, wanted })`: la generación cambia solo al instalar.
- **`web/src/main.js`.** `ensureSystem` a nombre de la sesión; grupos de los metadatos por modelo; índice de búsqueda por modelo, con aviso y Reintentar si falla; aviso (`toast`) con botón; carga de modelo con Reintentar, cancelación y «gana el último clic»; región genital obligatoria en el hombre; mensaje si no hay WebGL; `aria-pressed` y `aria-busy` en el selector de modelo.
- **`web/index.html`, `web/src/styles.css`.** Botón Reintentar en la pantalla de carga; avisos con acción (`role="status"`); parpadeo del modelo pedido, desactivado con `prefers-reduced-motion`.
- **`web/tests/loading.test.mjs` (nuevo)**, `npm test` y `npm run check` en `web/package.json`.

## 4. Archivos

- `web/src/loading.js`
- `web/src/viewer.js` (`#gltf`, `loadModel`, `addSystem`, `#addSystem`)
- `web/src/main.js` (sesiones y `ensureSystem`; `toast`; buscador; carga de modelos)
- `web/index.html`, `web/src/styles.css`
- `web/tests/loading.test.mjs`, `web/package.json`
- `README.md` (sección «Carga fiable de modelos»)

## 5. Pruebas y medidas realizadas

**Automáticas** (`npm --prefix web test`, Node 26): 11 de 11 correctas. Metadatos retrasados con cambio de modelo, GLB retrasado con cambio, sistema propio del modelo nuevo, ida y vuelta rápida, peticiones repetidas, reintento tras fallo, fallo de una sesión vieja, caché que olvida fallos, 404, HTML en lugar de JSON, red caída, aborto, progreso y cabecera GLB.

**En el navegador** (panel del navegador de la app de Claude, Chromium, servidor de desarrollo de Vite en local; red simulada envolviendo `window.fetch` con retrasos y fallos por URL):

| Caso | Antes del arreglo | Después (medido) |
|---|---|---|
| Metadatos del muscular masculino +5 s, cambio a femenino | **481 músculos masculinos en el cuerpo femenino**; muscular femenino nunca descargado | 0 piezas masculinas; el GLB masculino ni se pidió |
| GLB muscular femenino +6 s, cambio a masculino | — | Descarga abortada; nada en caché ni en escena |
| Femenino lento, clic y vuelta al masculino | Se ignoraba la vuelta y el femenino lo sustituía (visto con el primer arreglo: los clics al modelo visible no hacían nada) | Se queda el masculino; descarga cancelada |
| 5 clics alternos sin caché, último «Femenino» | — | Femenino, raíces solo femeninas, 0 piezas sueltas |
| 3 clics en «Muscular» durante la descarga | — | 1 metadato, 1 GLB |
| Red caída en el GLB arterial → Reintentar | «No se pudo cargar», sin acción (según el código) | Aviso con causa y Reintentar; tras volver la red, 430 piezas y capa activada |
| 404 en los metadatos del venoso | Error de JSON genérico (según el código) | «el archivo no está disponible en el servidor» + Reintentar |
| Red caída al cambiar a masculino | — | Aviso; se sigue viendo el femenino; Reintentar lo carga |
| `male.glb` ausente en la primera carga | «Revisa la consola» y excepción (según el código) | Mensaje claro y Reintentar; tras restaurar el archivo, carga |
| Índice de búsqueda caído | Se guardaba vacío para siempre (según el código) | Nota con Reintentar; tras reintentar aparecen «Nervio mediano»… |
| Índice femenino lento + ida y vuelta | Podía llenar el buscador del otro modelo (según el código, no reproducido) | Al cambiar, el buscador se redibuja al instante (sin resultados del modelo anterior); la respuesta femenina tardía no borra los del masculino |

**Otras comprobaciones:** `npm run build` correcto (sigue el aviso de un bloque de 1.076 kB, ya conocido); `npm run check`: todo correcto (2.909 y 2.919 piezas).

**No probado:** navegadores distintos de Chromium, teléfonos reales, lectores de pantalla, redes reales lentas o intermitentes (solo simuladas), WebGL ausente (el mensaje se añadió, pero no se probó sin WebGL).

Durante las pruebas aparecieron dos fallos del propio arreglo, ya corregidos y vueltos a probar:
- una respuesta tardía del índice de un modelo podía sustituir el índice ya cargado del otro;
- al cambiar de modelo con el buscador abierto, seguían a la vista los resultados del anterior hasta que llegaba el índice nuevo.

## 6. Limitaciones y revisión pendiente

- La caché de GLB del visor sigue sin límite: cambiar muchas veces de modelo acumula memoria. Es parte del hito de rendimiento (medir antes de fijar un límite).
- Si fallan a la vez varias cargas silenciosas (contexto de otro sistema), solo se ve el último aviso.
- La región genital se pide por separado; si falla, falla la carga del modelo masculino (decisión deliberada para no mostrar genitales con la opción desactivada).
- Este hito no toca contenido anatómico: no requiere revisión de un especialista.

## 7. Siguiente mejora más pequeña y útil

Hacer que la construcción de modelos falle de verdad (`tools/build_all.sh` usa `set -e` con tuberías a `grep` y sin `pipefail`, así que un error de Blender puede pasar por éxito) y escribir en una carpeta temporal antes de sustituir los GLB. Después, el esquema de contenido y el primer módulo regional (ver `docs/estado-2026-11-02.md`).
