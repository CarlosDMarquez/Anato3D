# Hito 4 — Pantalla de inicio

Fecha: 2026-11-05. Base: commit `0df5df8`. Encargo de Carlos (2026-11-05): una pantalla de inicio original.

## 1. Lo que se pidió

- Fondo negro.
- El nombre del programa a la izquierda y, debajo, las opciones: **Iniciar** (la de arriba), **Configuración** y **Créditos**.
- **NeuroFuture** como crédito del proyecto en la esquina inferior izquierda, «algo así» como la imagen que adjuntó (logo de NeuroFuture, «Conciencia Cerebral Mexicali»).
- Todo el lado derecho para el modelo 3D: del tórax hacia arriba y en su forma esquelética.
- «Nada más»: Carlos revisará el resultado y pedirá los cambios.

## 2. Interpretaciones (a confirmar)

- **«las opciones manejo, desde configuración, créditos e Iniciar»:** se leyó como tres opciones (Iniciar, Configuración, Créditos). Si «Manejo» era una cuarta opción (por ejemplo, los controles), falta añadirla.
- **Forma esquelética:** el esqueleto con sus cartílagos (los costales completan la caja torácica), que es como la app abre.
- **Crédito de NeuroFuture:** el logo con «Conciencia Cerebral Mexicali», sin una frase que diga qué relación tiene con el proyecto (no se inventa). La ciudad y el correo de contacto de la imagen están en **Créditos**, no en la esquina.
- **Movimiento:** el esqueleto gira despacio de un lado a otro (±11° cada 18 s), de tres cuartos y mirando hacia el menú. Si el sistema pide menos movimiento, queda quieto.
- **Móvil:** no cabe «izquierda y derecha»; el esqueleto va arriba y el nombre, el menú y el crédito, debajo.

## 3. Cómo funciona

- **`web/index.html`:**
  - `<body class="inicio">`: la pantalla de inicio se ve desde la primera pintura, sin que asome la interfaz de la app.
  - `#start`: nombre (`h1`), menú y las vistas de Configuración y Créditos, el logo y el degradado inferior.
  - Los créditos del panel «Ayuda» quedan en `#creditos` y empiezan por NeuroFuture.
- **`web/src/ui/start.js` (nuevo):**
  - Configuración muestra copias de las casillas de «Ajustes»: un cambio aquí cambia la casilla original y le manda su evento, así que sus manejadores hacen el trabajo (calidad, resaltado, genitales externos).
  - Créditos copia los de «Ayuda»: un solo texto para los dos sitios.
  - Teclado: flechas arriba y abajo, Intro, Escape para volver. Pasar el ratón por una opción la elige (solo una lleva la marca).
  - «Iniciar» funde a negro (250 ms), quita `inicio` del `body` y llama a `onIniciar`.
- **`web/src/viewer.js`:** `setShowcase(on)`.
  - Con `on`: fondo negro, sin controles de cámara, y la cámara en el 36 % superior de lo visible (la caja torácica entera, los hombros y la cabeza), con la cabeza cerca del borde superior.
  - El ancho se calcula con las piezas de esa altura (los brazos hasta el codo, no las manos). Se recalcula al cambiar el tamaño.
  - Con `off`: vuelve el fondo de siempre y los controles; `home()` lleva la cámara a la vista inicial.
- **`web/src/main.js`:**
  - Al cargar el modelo con la pantalla de inicio abierta, encuadra el esqueleto con `setShowcase(true)` en vez de `home()`.
  - Los avisos de progreso de los cartílagos no salen en la pantalla de inicio (los errores sí).
  - Los atajos de la app no actúan mientras está abierta.
  - Si el navegador no tiene WebGL, se quita la pantalla de inicio y el aviso se ve a pantalla completa, como antes.
- **`web/src/styles.css`:** sección «Pantalla de inicio».
  - Mientras está abierta, `#stage` ocupa solo la derecha (el `ResizeObserver` del visor ajusta el lienzo).
  - La primera carga (barra de progreso, error y «Reintentar») se muestra en esa parte, sin repetir el nombre.
  - La opción elegida lleva la marca de las etiquetas del visor: línea guía y punto con brillo azul.
- **Logo (`tools/logo_neurofuture.py`):**
  - Parte del original (`docs/marca/neurofuture-original.webp`), recorta el cerebro, el nombre y el subtítulo.
  - El blanco pasa a transparente y el azul de la marca se conserva; el azul marino del subtítulo, que no se leería sobre negro, pasa a gris claro. La «M» blanca del cerebro sigue blanca.
  - Resultado: `web/public/neurofuture.png`, 800 × 127, 12 KB.

## 4. Pruebas realizadas

**Automáticas:** `npm --prefix web test` 32 de 32; `check-cards` «todo correcto»; `npm run build` correcto.

**En el navegador** (Chromium del panel de la app, servidor de desarrollo, modelo masculino):
- **Escritorio** (1024 × 768 y 1440 × 900): nombre, menú y logo a la izquierda; esqueleto del tórax hacia arriba a la derecha, sin la pelvis; corte inferior fundido.
- **Configuración:** las tres casillas y la nota. Desmarcar «Resaltar al pasar el cursor» aquí desmarcó la casilla original y desactivó el resaltado en el visor.
- **Créditos:** NeuroFuture, los créditos de los modelos y el aviso educativo.
- **Teclado:** Escape volvió de Configuración al menú, con el foco en «Configuración»; la flecha abajo pasó a «Créditos» y luego, dando la vuelta, a «Iniciar»; Intro abrió Créditos e inició la app.
- **Iniciar:** la app quedó como antes (cuerpo entero, barras y sistemas; controles de cámara activos; fondo de siempre).
- **Atajos:** «/» no abrió el buscador en la pantalla de inicio y sí después de «Iniciar».
- **Movimiento:** la cámara cambió entre dos capturas; con la preferencia de menos movimiento **simulada** (sustituyendo la consulta en la consola, no con el ajuste del sistema), quedó quieta.
- **Error de carga:** forzado desde la consola, el mensaje y «Reintentar» salen en la parte derecha.
- **Móvil (375 × 812):** esqueleto arriba y menú debajo; Configuración a pantalla completa; «Iniciar» llevó a la app móvil de siempre. Se corrigió una fila de píxeles del lienzo que asomaba bajo el degradado.
- Sin errores de consola.

**No probado:** lectores de pantalla, teléfonos reales, otros navegadores, el ajuste real de «reducir movimiento» del sistema, un navegador sin WebGL.

## 5. Pendiente de Carlos

- Confirmar las interpretaciones del apartado 2 (sobre todo «manejo» y el movimiento).
- Decir si el correo de contacto debe aparecer en Créditos.
