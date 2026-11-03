# Hito 3 — Lección, evaluación sin etiquetas, progreso y repaso (módulo del brazo)

Fecha: 2026-11-03. Base: commit `c4cbe90`. Encargo: apartados 2 («experiencia educativa») y 9 («progreso y repaso»).

## 1. Resultado para el estudiante

El botón **Estudiar** (birrete) de la barra de herramientas abre el módulo «El brazo» con el ciclo completo:

1. **Elegir**: título, objetivos y público supuesto. El progreso aparece en cuatro datos:
   - lección;
   - última evaluación (rendimiento reciente);
   - dominio (largo plazo);
   - repasos pendientes.
2. **Explorar (lección guiada)**: 5 pasos.
   - Los pasos son el húmero, el compartimento anterior, el compartimento posterior, los nervios, y las arterias y venas.
   - Cada paso aísla sus estructuras de un lado, con el esqueleto como contexto, las resalta y centra la cámara.
   - Trae un texto breve con su fuente, y las estructuras abren su ficha.
3. **Identificar sin ver la respuesta**: 14 preguntas.
   - **10 identificaciones**: la estructura se resalta en 3D, sin nombre, y se elige entre 4 nombres o «No lo sé».
   - **4 preguntas de texto** sobre relaciones, inserciones e inervación, de un banco de 12.
   - Mientras se responde **no hay** etiqueta, ficha, texto al pasar el ratón ni buscador.
   - La barra de sistemas es la misma en todas las preguntas, para no delatar si es un nervio o un vaso.
4. **Explicación**:
   - correcta o no, y cuál era;
   - la explicación, con su fuente;
   - **Ver en 3D**, que abre la ficha de esa estructura.
   - Se puede marcar «No estoy seguro».
5. **Guardar**: en el navegador, con un formato con versión.
6. **Volver y repasar**: «Repasar (n)» empieza por lo fallado o dudoso, en cajas con intervalos crecientes (0, 1, 3, 7 y 21 días).

## 2. Criterios de aceptación

| Criterio | Resultado |
|---|---|
| Un estudiante completa lección → evaluación → explicación → progreso guardado → repaso, y lo retoma tras recargar | Cumple (navegador: lección terminada, evaluación de 14, recarga, «Repasar (6)») |
| Las respuestas no se filtran por etiqueta, ficha, texto al pasar el ratón, buscador ni otra parte de la interfaz | Cumple en las 14 preguntas: ficha vacía (también en el DOM), etiqueta y texto ocultos, buscador desactivado, barra de sistemas idéntica en las 10 identificaciones, y ningún nombre ni latín de la estructura en el texto de la página fuera de las opciones |
| El rendimiento reciente se distingue del dominio a largo plazo | Cumple: «Última evaluación: 4 de 14 (rendimiento reciente)» frente a «Dominio: 0 de 10 (acertadas varias veces, en días distintos)» |
| Reiniciar la lección no borra lo demás | Cumple: «Reiniciar la lección» toca solo la lección; «Borrar el progreso del módulo» pide confirmar en la propia página |
| Se explica qué pasa si cambia el contenido o se borran los datos del navegador | Cumple: aviso en la portada y comportamiento documentado (sección 6) |
| Se puede usar con el teclado | Cumple: 1–4 responden, 5 = «No lo sé», Intro pasa a la siguiente; el foco va a la pregunta, a la explicación y al título, y vuelve al botón al cerrar |

## 3. Cambios

- **`web/src/study/progress.js` (nuevo):**
  - progreso con versión de formato (1);
  - cajas de repaso, cola de repaso y resumen (reciente frente a dominio);
  - reiniciar la lección y borrar un módulo;
  - si el almacenamiento falla, la app sigue funcionando.
- **`web/src/study/quiz.js` (nuevo):**
  - preguntas de identificación, con distractores del mismo grupo (o nombres de huesos para el húmero);
  - preguntas de texto del banco;
  - evaluación (10 + 4), repaso y corrección (acierto, duda o fallo).
- **`web/src/content/brazo.js`:**
  - `version` del contenido;
  - `leccion` (5 pasos con fuentes);
  - `preguntas` (12, con respuesta, 3 distractores, explicación y fuente);
  - `distractoresExtra` para el húmero.
- **`web/src/content/schema.js`:** `revisarModulo()` comprueba lección, preguntas y distractores; `check-cards` la usa.
- **`web/src/ui/study.js` (nuevo):** el panel completo (portada, lección, pregunta, explicación y resultado) y sus teclas.
- **`web/src/main.js`:**
  - **modo evaluación**: sin ficha (ni en el DOM), etiqueta, texto al pasar el ratón, buscador, atajos ni selección por clic;
  - `mostrarFichas` (aísla con el esqueleto y elige capas iguales para todo el módulo);
  - `abrirFicha`.
  - **Los paneles cerrados son `inert`** (antes seguían recibiendo el foco del teclado). Tienen `aria-expanded` y `aria-controls`, y el foco vuelve al botón que los abrió. Era un P1 de la revisión.
- **`web/index.html`:** botón «Estudiar», panel de estudio y **etiqueta real del buscador** (antes solo tenía texto de ejemplo; también de la revisión).
- **`web/src/styles.css`:** estilos del panel. En el móvil el panel va abajo, para que el modelo se vea mientras se responde.
- **Iconos nuevos** (Lucide): birrete, check, x y reiniciar.
- **`web/tests/study.test.mjs` (nuevo):** 10 pruebas.

## 4. Archivos

`web/src/study/{progress,quiz}.js` · `web/src/ui/study.js` · `web/src/content/{brazo,schema}.js` · `web/src/main.js` · `web/index.html` · `web/src/styles.css` · `web/scripts/{check-cards,extract-icons}.mjs` · `web/src/ui/icon-data.js` · `web/tests/study.test.mjs`

## 5. Pruebas y medidas realizadas

**Automáticas:**
- `npm --prefix web test`: **32 de 32** (11 de carga, 11 de contenido y 10 de estudio). Las de estudio cubren:
  - guardar y cargar (incluidos datos dañados y otra versión, que no se sobrescribe);
  - almacenamiento bloqueado;
  - cajas y cola de repaso, incluido que ignora fichas retiradas;
  - resumen reciente frente a dominio;
  - reiniciar sin borrar;
  - contenido cambiado;
  - opciones distintas con una sola correcta;
  - composición de la evaluación;
  - corrección.
- `check-cards`: «todo correcto»; valida la lección (5 pasos) y las 12 preguntas.
- `test_build.sh`: 21 de 21. `npm run build` correcto.

**En el navegador** (Chromium del panel de la app, servidor de desarrollo, modelo masculino):
- **Lección:**
  - paso 1, húmero derecho aislado y resaltado;
  - paso 2, los 4 músculos del compartimento anterior aislados;
  - «Músculo braquial» abrió su ficha sin cerrar el panel;
  - al terminar, quedó guardada como completada.
- **Evaluación completa de 14 preguntas** (respuestas automáticas, con aciertos, fallos y un «No lo sé»):
  - **sin ninguna fuga**: ni en la ficha, ni en la etiqueta, ni en el texto al pasar el ratón, ni en el texto de la página;
  - buscador desactivado;
  - una sola configuración de la barra de sistemas;
  - tras responder, la ficha de la estructura aparece.
  - Resultado: 4 de 14, con 7 estructuras para repasar.
- **Recarga:** el progreso sigue ahí («Última evaluación: 4 de 14», «Repasar (6)»). El repaso empieza con la estructura resaltada.
- **Teclado:** la tecla 4 respondió y mostró «Correcto» con la explicación y su fuente. Escape sale de la evaluación, deja el panel `inert` y devuelve el foco a «Estudiar».
- **Móvil (375 × 812):** el panel va abajo y la estructura queda a la vista encima. La explicación tras responder se lee.
- Sin errores de consola.

**No probado:**
- lectores de pantalla;
- teléfonos reales;
- navegadores distintos de Chromium;
- el modelo femenino en la evaluación (las fichas sí existen en él: lo comprueba `check-cards`);
- estudiantes reales.

## 6. Progreso: qué se guarda y qué pasa si…

- **Dónde:** `localStorage`, clave `anato3d.progreso`, solo en este navegador. Sin cuenta y sin enviar nada a ningún servidor.
- **Qué se guarda:**
  - versión del formato;
  - por módulo: la versión del contenido, la lección (paso, completada, fecha), los 30 últimos intentos (fecha, tipo, aciertos, total y preguntas falladas) y, por estructura, la caja, los aciertos, los fallos, las dudas, la última vez y el próximo repaso.
- **Si cambia el contenido:**
  - el módulo lleva `version`; al cambiarla, la portada lo avisa;
  - se conserva el progreso de las estructuras que siguen y se ignora el de las retiradas (no se borra).
- **Si cambia el formato** (versión distinta de 1): se empieza de cero sin sobrescribir lo guardado hasta el siguiente guardado.
  - **Pendiente:** una migración cuando haya versión 2.
- **Si se borran los datos del navegador** o se usa una ventana privada: el progreso se pierde. La portada lo dice. Si el navegador no deja guardar, se avisa y la app sigue.
- **Cuentas, sincronización y uso sin conexión** son funciones aparte, que necesitan requisitos explícitos; no se han hecho.

## 7. Limitaciones y revisión de un especialista

- **Ninguna pregunta está revisada.** Un especialista debe revisar:
  - las 12 preguntas, en especial los distractores (que ninguno sea también correcto);
  - las explicaciones y los 5 pasos de la lección.
- **Identificación de la estructura aislada:** se identifica la estructura sola con el esqueleto, sin los músculos vecinos. Es más fácil que en un atlas completo. Una versión más difícil mostraría también los vecinos.
- **Preguntas de 3D:** solo de elegir el nombre. Señalar la estructura en el modelo («toca el nervio radial») queda para más adelante. Las preguntas de texto se pueden responder sin el lienzo.
- **Distractores del mismo grupo:** pueden ser muy fáciles en algún caso (cuatro nervios muy distintos). Hará falta medirlo con estudiantes.
- **Escritorio estrecho (unos 800 px):** el panel puede tapar parte de la estructura. El encuadre aún no tiene en cuenta el panel lateral.
- **Móvil:** «Ver en 3D» abre la ficha detrás del panel de estudio. Para leerla hay que cerrar el panel.

## 8. Siguiente mejora más pequeña y útil

1. **Revisión por un especialista** del módulo: fichas, lección y preguntas.
2. **Piloto pequeño** con estudiantes, para medir si terminan la lección, cuánto tardan en encontrar una estructura, el recuerdo una semana después y si vuelven.

En paralelo, medir el rendimiento con perfiles de dispositivo, que es el hito de rendimiento.
