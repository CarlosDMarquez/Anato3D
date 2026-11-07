# Rendimiento en celulares — revisión del 2026-11-07

Encargo de Carlos (2026-11-06): «quiero que revises el rendimiento de Anato3D en celulares». Primero fue una
**revisión**, sin cambiar código; las mejoras 1 a 4 se aplicaron el 2026-11-07 (al final).

## Cómo se midió

- App en el servidor de desarrollo (`npm --prefix web run dev`), en el navegador integrado del escritorio (Chromium) con
  pantalla de 375 × 812 y entrada táctil emulada: la app detecta un dispositivo táctil y arranca en calidad baja.
- Descargas: Resource Timing. Llamadas de dibujo, triángulos y programas: contando las llamadas al contexto WebGL en cada
  fotograma. Memoria: `performance.memory`. Tareas largas: `PerformanceObserver` («longtask»).
- Tamaños de la web de producción: `vite build`. Contenido de los GLB: leyendo su JSON.
- **Límite:** el Mac tiene CPU y GPU mucho más rápidas que un teléfono. Los tiempos de abajo son de este Mac; las cifras
  para teléfonos son **estimaciones**, no medidas. Falta probarlo en teléfonos reales (ver el final).

## Lo que ya está bien

- Dibuja solo cuando algo cambia (`needsRender`): en reposo no gasta batería, salvo en la pantalla de inicio (abajo).
- En pantallas táctiles arranca en calidad baja: resolución 1:1, sin oclusión ambiental (que dibuja la escena dos veces),
  sin sombra bajo los pies y con fondo negro.
- Los sombreadores de cada sistema se compilan con `compileAsync` antes de mostrarlo.
- Mallas con Draco y texturas en WebP; cada sistema se descarga solo al encenderlo.
- El resaltado al pasar el cursor está desactivado en pantallas táctiles.

## Medidas

| | Pantalla de inicio | Vista inicial (esqueleto + cartílagos) | Muchos sistemas encendidos |
|---|---|---|---|
| Llamadas de dibujo por fotograma | 192 | 323 | 1 785–1 940 |
| Triángulos por fotograma | 654 000 | 736 000 | 2,4–2,6 millones |
| Programas de sombreado | 7 | 7 | 30–34 |
| CPU por fotograma (este Mac) | 0,4 ms | 0,9 ms | 10–12 ms |
| Memoria de JavaScript | 90 MB | 93 MB | 200–220 MB |

- **Todo el modelo masculino** (12 archivos): unas 3 140 piezas y 3,9 millones de triángulos. Solo el esqueleto tiene
  678 000 triángulos en 258 mallas.
- **Descarga hasta ver la vista inicial:** `male.glb` 10,9 MB (ya en la pantalla de inicio) + tejido conjuntivo 2,0 MB,
  más el JavaScript: 1,2 MB minificado (325 KB comprimido). Con 4G a ~10 Mbit/s, unos 11 s solo de modelos.
- **Texturas del esqueleto:** 21 texturas (12 de 2048 × 2048 y 9 de 1024 × 1024). En la descarga ocupan unos 7 MB
  (WebP), pero en la GPU se descomprimen: **unos 305 MB** con sus mipmaps.
- **Tareas largas** (hilo principal bloqueado, en este Mac): 419 ms al montar el modelo y 50–80 ms al encender cada
  sistema.
- **Tocar una pieza** (selección por rayos y apertura de la ficha): 1–36 ms en este Mac.

## Problemas, por prioridad

### 1. Memoria de la GPU (riesgo de que el teléfono cierre la página)

- **Texturas del esqueleto, unos 305 MB.** Es lo que más pesa en un teléfono, sobre todo en iPhone, donde Safari cierra la
  página o pierde el contexto WebGL si se pasa de memoria.
- **Los dos modelos se quedan en memoria.** `viewer.cache` guarda cada GLB descargado y nunca se libera nada en la GPU:
  al pasar de hombre a mujer, el modelo anterior sigue ocupando su memoria. Con los dos modelos vistos, solo las texturas
  del esqueleto suman unos 610 MB.
- **No se trata la pérdida del contexto WebGL** (`webglcontextlost`): si el sistema lo quita (por memoria, o al volver de
  otra app), el lienzo se queda en blanco y la app no dice nada.

### 2. Fluidez y batería

- **Llamadas de dibujo:** cada pieza es una malla y una llamada. Con muchos sistemas, unas 1 900 llamadas y 10–12 ms de CPU
  por fotograma en este Mac; en un teléfono de gama media (CPU 3–5 veces más lenta en JavaScript) serían unos 35–60 ms:
  **15–25 fotogramas por segundo al girar** (estimado). Con la vista inicial va sobrado.
- **La pantalla de inicio dibuja sin parar** (el vaivén del esqueleto): 192 llamadas y 654 000 triángulos en cada
  fotograma, a la frecuencia de la pantalla. En un teléfono gasta batería y calienta mientras se está en el menú.
- **Tirones al encender sistemas:** las tareas de 50–80 ms de este Mac serían de 0,2–0,4 s en un teléfono, y la de 419 ms
  al cargar el modelo, de 1,5–2 s (estimado). Además, `compileAsync` solo compila sin bloquear si el navegador tiene la
  extensión `KHR_parallel_shader_compile`; está por comprobar en Safari.

### 3. Tiempo de carga

- Los 13 MB de modelos antes de la vista inicial; 7 MB de ellos son las texturas del esqueleto.
- El JavaScript lleva todas las fichas (fichas de músculos, de vasos, de vísceras, fuentes): unos 1,2 MB que el teléfono
  tiene que leer al abrir la app, aunque no se abra ninguna ficha.

## Recomendaciones

| # | Cambio | Efecto esperado | Esfuerzo |
|---|---|---|---|
| 1 | Texturas del esqueleto a 1024 × 1024 en pantallas táctiles (una versión ligera del modelo base o reducirlas al cargar) | GPU: ~305 → ~76 MB; descarga: ~11 → ~5 MB | Bajo-medio |
| 2 | Liberar la GPU del modelo que no se ve al cambiar de hombre a mujer (o no guardar el otro modelo en teléfonos) | Evita duplicar la memoria | Bajo |
| 3 | Tratar `webglcontextlost`: aviso y botón para recargar | La app no se queda en blanco sin explicación | Bajo |
| 4 | Pantalla de inicio a 30 fotogramas por segundo (o quieta) en calidad baja | Menos batería y calor en el menú | Bajo |
| 5 | Agrupar las piezas de cada sistema en pocas llamadas (`BatchedMesh` de three.js, con selección por pieza) | De ~1 900 a decenas de llamadas con todo encendido | Alto |
| 6 | Cargar los datos de las fichas cuando se abre la primera | Menos JavaScript al arrancar | Medio |

Lo más rentable son los cambios 1 a 4: son pequeños y quitan el riesgo de que la app se cierre sola en un teléfono.

## Aplicado el 2026-11-07 (mejoras 1 a 4)

Carlos pidió aplicar las cuatro primeras («Sí, aplícalas»).

1. **Modelo base ligero en pantallas táctiles.** `tools/base_ligera.py` hace `male.ligero.glb` y `female.ligero.glb`:
   - las mismas mallas, nodos y materiales (los bytes de Draco, idénticos);
   - las 21 texturas grandes a la mitad, cada una en su modo y con su perfil de color (la del ojo, de 512, igual).
   - **GPU: de ~305 a ~77 MB. Descarga: de 10,9 a 7,1 MB** (las mallas, ~4 MB, no cambian).
   - Paso nuevo de `build_all.sh`: `ligera` (de los publicados; tras `base`, de los nuevos).
   - Se llaman `<modelo>.ligero.glb` y no `<modelo>-ligero.glb`: el índice de búsqueda y `check-cards` leen los `<modelo>-*.glb` como sistemas y repetirían las piezas.
   - `main.js` (`TACTIL`, `urlBase`) lo pide en pantallas táctiles; en el escritorio, el completo.
2. **Liberar el modelo que no se ve** (`Viewer.#release`). Al cambiar de hombre a mujer, o al revés, se liberan en la GPU las mallas, los materiales y las texturas del modelo anterior, y se quitan de la caché de descargas. Las variantes de material llevan la generación del modelo para el que se crearon, así que solo se liberan las de modelos anteriores. Lo mismo con un sistema que llega cuando ya se muestra otro modelo.
3. **Pérdida del contexto WebGL.** Aviso con «Recargar» (`carga.contextoPerdido`, en los cinco idiomas). Si el navegador devuelve la GPU, se rehace el entorno de luz y se avisa «Imagen 3D recuperada».
4. **Pantalla de inicio a 30 fotogramas por segundo en calidad baja.** En calidad alta y con «menos movimiento», igual que antes.

**Comprobado** (navegador integrado, pantalla de teléfono emulada):
- En pantalla táctil se descarga `male.ligero.glb` (7,1 MB) y ninguna vez el modelo completo.
- Al pasar a mujer y volver a hombre, el modelo masculino se pide otra vez: salió de la caché.
- Al perder el contexto (`WEBGL_lose_context`), sale el aviso con «Recargar»; al recuperarlo, «Imagen 3D recuperada»; sin errores en la consola.
- `npm test` 42 de 42; `npm run check` correcto; compilación correcta; `test_build.sh` 21 de 21.

## Pendiente: probar en teléfonos reales

- Un iPhone (Safari) y un Android de gama media (Chrome), con `npm --prefix web run dev -- --host` en la misma red WiFi y
  la depuración remota (Safari: Web Inspector; Chrome: `chrome://inspect`).
- Medir: tiempo hasta ver el esqueleto, fotogramas por segundo al girar con varios sistemas, memoria, si la página se
  recarga sola al cambiar de modelo, y el calor y la batería en la pantalla de inicio.
