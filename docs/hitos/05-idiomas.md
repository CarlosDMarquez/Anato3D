# Hito 5 — Idiomas

Fecha: 2026-11-05. Base: commit `cacca0b`. Encargo de Carlos: «que en configuración esté la opción de idiomas, predeterminadamente en inglés», con español, inglés, alemán, francés e italiano.

**Decisión de Carlos:** el idioma por defecto pasa a ser el inglés. El encargo general decía «mantener la interfaz en español»; este cambio lo sustituye.

## 1. Resultado

- **Selector de idioma** al principio de Configuración (pantalla de inicio) y de Ajustes (dentro de la app). Cada idioma aparece con su propio nombre: Español, English, Deutsch, Français, Italiano.
- **Inglés por defecto**; la elección se guarda en este navegador (`localStorage`, clave `anato3d.idioma`) y se aplica al momento, sin recargar.
- **Traducido en los cinco idiomas:**
  - pantalla de inicio, barra superior y de herramientas, paneles (Buscar, Herramientas, Ajustes, Ayuda), créditos;
  - barra de sistemas y capas, menú de capas;
  - ficha: acciones, ruta, etiquetas (tipo de pieza, lado, tejido), «Contiene»;
  - avisos, mensajes de carga y errores, título de la página.
- **Nombres de las estructuras:**

| Idioma | Fuente | Cobertura |
|---|---|---|
| Español | Los de siempre (traducción oficial de Z-Anatomy y correcciones) | Todas |
| Inglés | `name_en` de Z-Anatomy | Todas |
| Francés | Traducción de Z-Anatomy (`translations.csv`) y, si falta, la lista TA2 con traducciones (`TA2.csv`) | 1651 de 1707 piezas; 354 de 398 grupos |
| Italiano | Lista TA2 con traducciones (`TA2.csv`), por el nombre inglés o el latino | 1651 de 1707 piezas; 353 de 398 grupos |
| Alemán | El latín, como en los atlas alemanes: no hay una tabla alemana entre las fuentes | Todas (todas las piezas tienen latín desde el 2026-11-01) |

  Si falta un nombre, se muestra el latino. Las que faltan son sobre todo surcos y circunvoluciones del cerebro, ramas de la arteria cerebral media, bolsas y vainas, y piezas hechas para Anato3D.

## 2. Lo que sigue en español

- **Las descripciones de las fichas** (descripción, campos, etimología, puntos clave, fuentes). En otro idioma van plegadas bajo «Descripción (solo en español)», marcadas como español (`lang="es"`).
- **El módulo de estudio** (lección, preguntas, explicaciones), con un aviso en el idioma elegido. Está en revisión por un especialista: traducirlo antes multiplicaría la revisión.
- Traducir ese contenido es la siguiente decisión de Carlos (ver el apartado 6).

## 3. Cambios

- **`web/src/i18n/textos.js` (nuevo):** unos 150 textos de interfaz en los cinco idiomas y 120 etiquetas cortas; los plurales van como [singular, plural].
- **`web/src/i18n/idioma.js` (nuevo):** `t`, `tn` (plural), `etiqueta`, `leerIdioma`, `fijarIdioma`, `alCambiar` y `traducirDom` (atributos `data-t`, `data-t-html`, `data-t-aria`, `data-t-tip`, `data-t-ph`).
- **`web/src/i18n/nombres.js` (nuevo):** `nombrePieza` y `nombreGrupo` según el idioma; `cargarNombres` descarga la tabla del idioma solo si hace falta.
- **`tools/nombres_idiomas.py` (nuevo):** genera `web/public/i18n/nombres-fr.json` y `nombres-it.json` (unos 110 KB cada uno) desde `sources/z-anatomy/`.
- **`web/index.html`:** cada texto marcado con `data-t*`; selector de idioma en Ajustes; aviso del módulo de estudio; párrafo de créditos sobre el origen de los nombres. Hasta que se ponen los textos, no se ven (clase `sin-traducir`): no parpadea el español antes del inglés.
- **`web/src/main.js`:** idioma inicial; las piezas y grupos guardan su nombre en español (`tituloEs`, `nombreEs`) y `title`/`nombre` pasan al idioma actual, así los usan igual la ficha, la etiqueta, el texto al pasar el ratón y el buscador; al cambiar de idioma se rehace lo que está a la vista. El buscador busca también por el nombre inglés.
- **`web/src/ui/info.js`:** textos de la ficha traducidos; contenido en español plegado; en alemán no se repite el latín bajo el título.
- **`web/src/ui/start.js`:** Configuración copia también la lista de idiomas.
- **`web/src/loading.js`:** `describeError` en el idioma actual.
- **`web/scripts/check-cards.mjs`:** falla si una etiqueta corta de una pieza, un sistema o una capa no tiene traducción.
- **`web/tests/i18n.test.mjs` (nuevo):** 8 pruebas.

## 4. Pruebas realizadas

**Automáticas:** `npm --prefix web test` 40 de 40 (8 nuevas: textos completos en los cinco idiomas con las mismas marcas `{x}`, claves del HTML, etiquetas, plurales, guardado del idioma, nombres y tablas publicadas). `check-cards` «todo correcto», con la nueva comprobación de traducciones. `npm run build` correcto.

**En el navegador** (Chromium del panel de la app, servidor de desarrollo, modelo masculino):
- **Primera visita sin idioma guardado:** pantalla de inicio en inglés («Start», «Settings», «Credits»), título de la pestaña en inglés.
- **Cambio desde la pantalla de inicio** (Settings → Deutsch): todo pasó al alemán al momento, se guardó (`de`) y la lista original de Ajustes cambió también.
- **Francés:** barra de sistemas, capas, detalle del modelo, ayudas de la barra; ficha de la séptima costilla izquierda: «Septième côte», «Costa VII», etiquetas en francés y descripción en español plegada; etiqueta clavada en francés.
- **Italiano** (desde Ajustes): ficha «Settima costa»; el buscador encontró «omero» en el esqueleto y en sistemas aún sin descargar (arterias, músculos, venas) con nombres italianos.
- **Español:** igual que antes (título, latín, etiquetas y descripción sin plegar; sin aviso en Estudiar).
- **Alemán:** título «Costa VII» sin repetir el latín debajo; aviso en Estudiar; Ayuda y créditos en alemán.
- Sin errores de consola.

**No probado:** lectores de pantalla, teléfonos reales, otros navegadores, el modelo femenino en cada idioma, y la revisión de las traducciones por hablantes nativos (las escribió Claude; los nombres anatómicos vienen de las tablas citadas).

## 5. Limitaciones

- Algunos grupos sin nombre en francés o italiano salen en latín (p. ej. «Cavea thoracis»).
- Las etiquetas «izq./der.» del buscador usan formas que no concuerdan con el nombre (en italiano «sx»/«dx», en francés «côté gauche»/«côté droit»).
- Las traducciones de la interfaz no las ha revisado un hablante nativo de cada idioma.

## 6. Siguiente decisión de Carlos

¿Traducir también el contenido (las descripciones de unas 2800 piezas y el módulo del brazo)? Son cuatro veces el texto actual, sin revisar por especialistas en cada idioma. Lo razonable sería traducir primero el módulo del brazo cuando vuelva revisado, y las descripciones por sistemas, marcando cada traducción como «sin revisar».
