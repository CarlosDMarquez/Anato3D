# Hito 2 — Esquema de contenido y fichas del módulo del brazo

Fecha: 2026-11-02. Base: commit `2c19cdd`. Encargo: apartado 5 («contenido más allá de definiciones genéricas») y primer paso del módulo regional. La lección, la evaluación y el progreso son el hito 3.

## 1. Resultado para el estudiante

Al seleccionar una estructura del brazo (los dos lados, en los dos modelos), la ficha muestra:

- **contenido propio de la estructura**, no genérico: descripción, función y los campos de su tipo;
  - músculos: origen, inserción, acción, inervación e irrigación;
  - nervios: origen, trayecto, qué inervan y su territorio sensitivo;
  - vasos: origen, trayecto, ramas y territorio o desembocadura;
  - hueso: partes, articulaciones e inserciones;
- **relaciones** con otras estructuras, cada una con un botón **Ver** que lleva a la otra estructura (del mismo lado) aunque su sistema no esté descargado;
- **simplificaciones del modelo**, por ejemplo: «La aponeurosis bicipital no es una pieza propia del modelo»;
- **estado de revisión** visible: «Borrador · sin revisar por un especialista»;
- **fuentes separadas**: terminología (TA2, número de término) por un lado y, por otro, el contenido, diciendo qué campos respalda cada fuente.

## 2. Criterios de aceptación

| Criterio | Resultado |
|---|---|
| Esquema con identificador estable, nombre, sinónimos, latín, región, lado, modelos, descripción, función, relaciones, campos por tipo, fuentes, estado y fecha de revisión, y simplificaciones | Cumple (`web/src/content/schema.js`) |
| Fuentes de terminología separadas de las de contenido | Cumple: `fuentes.terminologia` y `fuentes.contenido` (con `apoya`) |
| No se inventan fuentes ni revisores | Cumple: las 9 páginas citadas se leyeron el 2026-11-02 y cada campo se contrastó con su texto. Ninguna ficha figura como revisada, y el esquema rechaza «revisado» sin revisor y fecha. |
| El revisor detecta textos genéricos, identificadores sin resolver, campos obligatorios ausentes, afirmaciones sin fuente y aplicabilidad incorrecta | Cumple (`revisarFicha` + `check-cards`). Lo probé con 11 pruebas y, además, encontró un error real de la redacción. |
| Contenido del primer módulo antes de ampliar | Cumple: 15 fichas, 10 de ellas evaluables |

## 3. Cambios

- **`web/src/content/schema.js`:** campos por tipo, campos obligatorios, estados de revisión, patrones de texto genérico y `revisarFicha()`, que valida una ficha contra el esquema y contra las piezas de cada modelo.
- **`web/src/content/fuentes.js`:** catálogo de fuentes con URL, autor, organización, fecha de actualización y fecha de consulta.
- **`web/src/content/brazo.js`:** el módulo.
  - Título, público supuesto y objetivos (borrador).
  - **Núcleo evaluable (10):** húmero, bíceps braquial, coracobraquial, braquial, tríceps braquial, nervios musculocutáneo, radial, mediano y ulnar, y arteria braquial.
  - **Contexto (5):** ancóneo, arteria braquial profunda y venas cefálica, basílica y braquiales.
- **`web/src/content/index.js`:** `MODULOS`, `FICHA_POR_ID` y `fichaDePieza(malla, modelo)`.
- **`web/src/ui/info.js`:** cuerpo de ficha de módulo (`studyBody`). Sustituye la descripción y los «puntos clave» antiguos, que no tienen fuentes e incluyen correlaciones clínicas sin revisar. Conserva la etimología y los datos que el módulo no trae.
- **`web/src/main.js`:** `openFicha(id)` para los enlaces de relación (descarga el sistema si hace falta).
- **`web/scripts/check-cards.mjs`:** revisa el contenido de los módulos e informa de las descripciones genéricas por sistema.
- **`web/tests/content.test.mjs`:** 11 pruebas.
- **`web/src/styles.css`:** etiqueta del módulo, estado de revisión, relaciones y grupos de fuentes.

## 4. Archivos

`web/src/content/{schema,fuentes,brazo,index}.js` · `web/src/ui/info.js` · `web/src/main.js` · `web/src/styles.css` · `web/scripts/check-cards.mjs` · `web/tests/content.test.mjs`

## 5. Pruebas y medidas realizadas

- **Fuentes leídas el 2026-11-02**, con la fecha de actualización que muestra cada página:
  - TeachMeAnatomy, músculos del brazo (2026-04-10) y compartimento posterior del antebrazo (2025-12-12);
  - TeachMeAnatomy, nervios musculocutáneo (2025-08-11), radial (2025-11-10), mediano (2026-06-03) y ulnar (2026-10-11);
  - TeachMeAnatomy, arterias (2025-11-06), venas (2025-11-06) y húmero (2026-05-22);
  - TA2, comprobada en la tabla local (`TA2.csv`): números de término, latín y español.
  - Dos direcciones daban 404 y se usaron las que enlaza la propia web: `/upper-limb/muscles/upper-arm/` y `/upper-limb/vessels/veins/`.
  - En algunas páginas, la herramienta de lectura devolvió el final como resumen automático. Ese resumen contradecía el texto literal en varios puntos, así que solo se usó el texto literal.
- **Piezas:** las 18 mallas de las 15 fichas existen en los dos modelos y en los dos lados (comprobado en los GLB). La aponeurosis bicipital no existe como pieza y está anotada como simplificación.
- **`npm --prefix web test`:** 22 de 22 (11 de carga y 11 de contenido).
- **`npm --prefix web run check`:** «todo correcto».
  - Avisos: 4 fichas con sinónimos sin fuente comprobada: «Músculo braquial anterior», «Nervio cubital», «Arteria humeral» y «Arteria profunda del brazo / humeral profunda».
  - Informa también de las descripciones genéricas que quedan en el resto de la app: 369 arterias, 331 ligamentos, 196 nervios, 188 venas y 139 grupos de nodos en el hombre.
- **El revisor encontró un error real** en la primera pasada: una relación apuntaba a «ancóneo» (con tilde) en lugar del identificador `anconeo`. Corregido.
- **`zsh tools/tests/test_build.sh`:** 21 de 21; la construcción sigue publicando con el revisor ampliado.
- **En el navegador** (Chromium del panel de la app, servidor de desarrollo):
  - nervio radial izquierdo (hombre): etiqueta del módulo, estado «Borrador…», campos y relaciones;
  - **Ver** en «arteria braquial profunda»: descargó el sistema arterial (apagado) y seleccionó la arteria izquierda;
  - cabeza larga del bíceps derecho (mujer): «Ficha del conjunto: Músculo bíceps braquial», simplificación y fuentes divididas en «Terminología» y «Contenido»;
  - el deltoides (fuera del módulo) conserva su ficha de siempre;
  - sin errores de consola.

## 6. Limitaciones y revisión de un especialista

- **Ninguna ficha está revisada.** Un especialista tiene que revisar:
  - cada campo de las 15 fichas;
  - los objetivos;
  - los sinónimos;
  - si el ancóneo entra en el módulo del brazo o en el del antebrazo (la fuente lo pone en el antebrazo);
  - la inspección cercana, en los dos modelos, de las inserciones (bíceps en la tuberosidad del radio, tríceps en el olécranon) y de los trayectos (radial en el surco, ulnar detrás del epicóndilo, mediano cruzando la arteria braquial).
- **Una sola fuente de contenido por estructura** (TeachMeAnatomy). Lo deseable es contrastar con un segundo texto de referencia que se pueda citar y usar legalmente.
  - Se consultó OpenStax *Anatomy and Physiology 2e*, pero no se usa: su página prohíbe usarlo con IA generativa sin permiso escrito y su licencia (CC BY-NC-SA) no permite el uso comercial.
- **Correlaciones clínicas fuera a propósito** (signo de Popeye, mano caída, fracturas…) hasta que un especialista las revise. Las fichas antiguas sí las tenían, sin fuente.
- **Modelo femenino:** nervios y vasos heredados del modelo masculino de Z-Anatomy ajustado. Cada ficha lo dice.
- **Estado de revisión fijo en el código.** Por ahora se cambia editando `brazo.js`; un flujo de revisión con registro queda para más adelante.

## 7. Siguiente mejora más pequeña y útil

Hito 3 con este módulo:
- **lección guiada:** objetivos y vistas de cámara por compartimento;
- **evaluación de identificación sin etiquetas:** sin pin, ni ficha, ni texto al pasar el ratón, ni buscador mientras se responde;
- **explicación y vuelta a la vista;**
- **progreso local versionado y cola de repaso.**
