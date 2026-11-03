# Anato3D

App educativa de anatomía humana en 3D, para todo público. Interfaz inspirada en Complete Anatomy:
una barra inferior con todos los sistemas, cada uno con capas (etapas) que se recorren con un toque.

## Ejecutar

```bash
npm --prefix web install
npm --prefix web run dev
```

Abre http://localhost:5173 (o el puerto que indique Vite). Para producción: `npm --prefix web run build` (salida en `web/dist`).

Pruebas: `npm --prefix web test` (lógica de carga, sin navegador) y `npm --prefix web run check` (fichas de todas las piezas).

Modelos: `zsh tools/build_all.sh` (masculino) y `A3D_MODEL=female zsh tools/build_all.sh`. Solo publica en `web/public/models` lo que pasa las comprobaciones. Herramientas, fuentes que no están en git y sus sumas, y pasos desde una copia nueva: `docs/construccion.md`. Pruebas de fallos: `zsh tools/tests/test_build.sh`. Los comandos de Blender sueltos de las secciones de cada fase son históricos: escriben directamente en `web/public/models` si no se define `A3D_WEB_MODELS`.

## Estructura

| Ruta | Qué es |
|---|---|
| `*.blend`, `*.glb` (raíz) | Modelos fuente. Fase 1 = piel + ojos; Fase 2 = piel + esqueleto completo (`Anato3D_Male_30_Fase2`, `Anato3D_Female_30_Fase2`). |
| `tools/` | Scripts de Blender: `fix_neck.py`, `anato3d_fit.py` (ajuste compartido), `proportions.py` (extremidades y hombros), `musculature.py` (complexión musculosa), `build_muscular.py`, `build_connective.py`, `build_vascular.py`, `build_nervous.py`, `build_visceral.py`, `build_genital_skin.py`, `female.py` (esqueleto femenino), `female_pelvis.py` (forma de la pelvis femenina), `female_perineum.py` (referencias del periné, genitales externos profundos y músculos del periné femenino), `male_perineum.py` (músculos del periné masculino), `female_organs.py` (órganos femeninos), `build_female_skin.py` (vulva), `export_glb.py`, `build_all.sh` (regenera todos los sistemas), `search_index.py` (índice de búsqueda de la app), `audit_models.py` (busca errores medibles en los modelos), `vessel_regions.py` (región del cuerpo de cada vaso), `skin_regions.py` (divide la piel en zonas al exportar), `backup.sh` (copia de seguridad en este Mac), `build_lib.sh` (funciones de `build_all.sh`: Blender con código de salida, preparación, validación y publicación), `validate_models.py` (valida los archivos nuevos antes de publicarlos), `manifest.py` (manifiesto de versiones y sumas) y `tests/` (pruebas de fallos de la construcción, con un Blender falso). |
| `Anato3D_Male_30_Fase2_musculature.npz` | Campo de desplazamiento de la complexión musculosa (lo escribe `fix_neck.py` y lo aplica `anato3d_fit.py` a todos los sistemas). |
| `Anato3D_Female_30_Fase2_pelvis.npz` | Campo de desplazamiento de la pelvis femenina y los huesos de la pelvis antes de deformarla (lo escribe `fix_neck.py` y lo aplica `anato3d_fit.py` a todos los sistemas femeninos). |
| `sources/originals/` | Copia de los modelos tal como estaban antes de corregir el cuello. |
| `sources/z-anatomy/` | Z-Anatomy descargado, con su traducción oficial (`translations.csv`) y TA2. No se publica. |
| `build/` | Resultados intermedios (`male_muscular.blend`, estadísticas). |
| `web/public/models/` | GLB que sirve la app: `male.glb`, `female.glb`, y uno por sistema (`male-muscular`, `male-connective`, `male-arterial`, `male-venous`, `male-nervous`, `male-respiratory`, `male-digestive`, `male-urogenital`, `male-endocrine`, `male-lymphatic` y `male-integumentary`, la piel de los genitales; los mismos con `female-`), que se descargan al activarlos. |
| `web/src/systems.js` | Los 12 sistemas de la barra, sus capas y cómo se clasifica cada pieza. |
| `web/src/data/anatomia.js` | Fichas en español: nombre, latín (TA), etimología, descripción y puntos clave. |
| `web/src/data/resolve.js` | Convierte el nombre de un objeto (`Rib_7_L`) en su ficha (`Séptima costilla`, lado, FDI…). |
| `web/src/data/musculos*.js`, `conectivo.js`, `vasos.js`, `nervios.js`, `visceras.js`, `latin.js` | Fichas de músculos y de tejido conjuntivo, y glosario latino para generar etimologías. Todos los músculos tienen ficha propia (`musculos-fichas.js` y `musculos-fichas-resto.js`). |
| `web/src/data/fuentes.js` | Fuentes de cada ficha de músculo y del latín añadido (la ficha las muestra plegadas al final), y latín que no trae Z-Anatomy. |
| `web/scripts/check-cards.mjs` | Revisa las fichas de todas las piezas: `node scripts/check-cards.mjs` (desde `web/`). |
| `web/src/data/grupos.js` | Regiones de la ruta jerárquica (los grupos musculares llegan en `male-muscular.json`). |
| `web/src/viewer.js` | Escena three.js: carga Draco, materiales, brillo de selección, cámara. |
| `web/src/study/`, `web/src/ui/study.js` | Progreso (local, con versión), preguntas y panel «Estudiar» (lección, evaluación, repaso). |
| `web/src/content/` | Contenido de estudio: esquema (`schema.js`), fuentes (`fuentes.js`), módulos (`brazo.js`) e índice por pieza (`index.js`). |
| `web/src/loading.js` | Propiedad de las peticiones de carga (una sesión por modelo instalado), descargas con estado HTTP y aborto, y errores explicables. Pruebas en `web/tests/loading.test.mjs`. |
| `web/src/main.js` | Estado de la app (capas, ocultar/aislar/transparentar, deshacer), barra y paneles. |

## Carga fiable de modelos (2026-11-02)

**Qué fallaba (reproducido en el navegador).** Con los metadatos del sistema muscular masculino retrasados 5 s, se activó el sistema muscular y se cambió al modelo femenino mientras esperaba: los **481 músculos masculinos** acabaron en el cuerpo femenino y el muscular femenino nunca se descargó. La comprobación de generación del visor se hacía después de esperar los metadatos, cuando ya era la del modelo nuevo.

**Arreglo (`web/src/loading.js`, `main.js`, `viewer.js`):**
- **Sesión por modelo instalado.** Cada petición (metadatos, GLB de un sistema, índice de búsqueda) queda a nombre de la sesión activa *antes* de la primera espera y se comprueba después de cada una. Si el modelo cambió, se descarta sin tocar la escena ni la interfaz. Al instalar otro modelo, las descargas de la sesión anterior se abortan.
- **El visor recibe la generación del que pide** (`addSystem(url, { generation, signal })`) y solo añade la raíz a `roots` después de compilar y comprobar. Antes la limpieza de una carga obsoleta hacía `splice(indexOf(...) = −1, 1)` y quitaba la última raíz del modelo nuevo.
- **La generación del visor cambia solo al instalar un modelo**: si la descarga del otro modelo falla, el que se ve y sus sistemas en curso siguen siendo válidos.
- **Gana el último clic** en el selector de modelo: volver al que se ve cancela la descarga del otro (antes se ignoraba ese clic y el otro modelo lo sustituía).
- **Índice de búsqueda y grupos por modelo**: una respuesta tardía no llena el buscador del otro modelo; un índice que falla no se guarda vacío para siempre y el buscador ofrece «Reintentar».
- **Descargas con `fetch`**: estado HTTP comprobado, aborto real y progreso. Un archivo que falta en un servidor que responde con el `index.html` (el de desarrollo, muchos alojamientos estáticos) se trata como no disponible.
- **Errores recuperables**: «No se pudo cargar el sistema arterial: sin conexión o el servidor no responde.» con **Reintentar**, que repite la acción pedida (p. ej. activar esa capa). Si falla el primer modelo, la pantalla de carga lo explica y ofrece Reintentar; si falla un cambio de modelo, se sigue usando el actual. Sin WebGL, un mensaje en lugar de una página en blanco.
- **Región genital obligatoria** para el modelo masculino: si no se puede descargar, falla la carga del modelo (y se puede reintentar). Sin ella, con «Mostrar genitales externos» desactivado se verían los testículos.

**Comprobado:** 11 pruebas automáticas (`npm --prefix web test`) y, en el navegador, metadatos lentos, GLB lento, cambios rápidos con y sin caché, peticiones repetidas (una sola descarga), red caída y recuperación con Reintentar, 404, archivo base que falta en la primera carga y recuperación, fallo al cambiar de modelo e índice de búsqueda lento o caído. Detalle en `docs/hitos/01-carga-fiable.md`.

## Construcción que falla de verdad (2026-11-02)

**Qué fallaba (leído en el código y comprobado):**
- `build_all.sh` tenía `set -e`, pero pasaba la salida de Blender por `grep` sin `pipefail`.
- Además, Blender termina con 0 aunque su script lance una excepción. Comprobado: sin `--python-exit-code`, un `raise RuntimeError` da 0.
- `export_glb` filtraba con `grep -E "exportado|Error|Traceback"`, que acaba con éxito precisamente cuando encuentra un error.
- Los scripts escribían directamente en `web/public/models`.

**Ahora** (`tools/build_all.sh`, `tools/build_lib.sh`):
- Blender se ejecuta con `--python-exit-code 1` y `set -euo pipefail`.
- Cada paso tiene que dejar sus archivos, escritos en esa ejecución.
- **Preparación:** los scripts escriben en `build/staging/…` (`A3D_WEB_MODELS`, que leen `anato3d_fit`, `build_genital_skin`, `build_female_skin`, `fix_neck` y `search_index`).
- **Comprobaciones antes de publicar:**
  - se arma un candidato (lo publicado más lo nuevo);
  - se validan los archivos nuevos (`tools/validate_models.py`): cabecera y bloques del GLB, vistas de búfer, piezas con sistema, y que no desaparezca más del 5 % de las piezas;
  - se regenera y valida el índice de búsqueda;
  - se revisan las fichas del modelo construido (`check-cards --models … --model …`; con `base`, las de los dos), incluidas las erratas conocidas;
  - se escribe el manifiesto (`web/public/models/manifest.json`: versión, sumas de cada archivo, herramientas y fuentes).
- **Solo entonces** se publican los archivos que cambian (temporales y luego renombrado). Los anteriores quedan en `build/staging/…/previous`.
- **Nuevo objetivo `base`** (`fix_neck.py`): pasa por la misma preparación.

**Comprobado** (`zsh tools/tests/test_build.sh --real`), 22 de 22 pruebas correctas, con un Blender falso que simula fallos y publicando en una copia:
- excepción de Blender, paso que «termina bien» sin escribir nada y GLB roto: `build_all` falla y no publica nada;
- `validate_models` rechaza HTML en lugar de GLB, GLB cortado, pérdida del 10 % de las piezas, JSON roto y metadatos sin `groups`;
- **construcción real** del sistema vascular masculino: termina bien y los GLB salen **idénticos byte a byte** a los publicados;
- `web/public/models` no cambió durante las pruebas.

Detalle en `docs/hitos/01b-construccion-fiable.md`.

**Primera publicación real con el sistema nuevo (2026-11-02): errata de terminología.**
- **Errata:** «Nervio músculocutáneo», «Arteria músculofrénica» y «Venas músculofrénicas», en los dos modelos. Las escribía la regla `\b([Mm])usculo` de `ES_FIXES` (sin final de palabra).
- **Arreglo:** regla corregida; `check-cards` la detecta (`errata`) y revisa solo el modelo construido.
- **Publicación:** `build_all.sh vascular nervous` en los dos modelos, unos 3 min cada uno. Solo cambiaron esos nombres, salvo 2–3 vértices de la cámara anterior del ojo en el nervioso masculino (ver `docs/construccion.md`).

## Estudiar: lección, evaluación y repaso (2026-11-03)

El botón **Estudiar** (birrete) abre el módulo «El brazo».
- **Lección guiada** de 5 pasos: aísla y resalta las estructuras de cada paso con el esqueleto, con un texto breve y su fuente.
- **Evaluación** de 14 preguntas: 10 identificaciones de la estructura resaltada (4 nombres o «No lo sé») y 4 de texto de un banco de 12.
  - Mientras se responde no hay etiqueta, ficha (tampoco en el DOM), texto al pasar el ratón ni buscador.
  - La barra de sistemas es la misma en todas las preguntas.
- **Explicación con fuente** y **Ver en 3D**.
- **Progreso** en `localStorage` (`anato3d.progreso`, formato versión 1).
  - **Repaso** espaciado por cajas (0, 1, 3, 7 y 21 días), empezando por lo fallado o dudoso.
  - **Portada:** rendimiento reciente (última evaluación) separado del dominio a largo plazo.
- **Teclado:** 1–4 responden, 5 = «No lo sé», Intro pasa a la siguiente.
- **Accesibilidad:** los paneles cerrados son ahora `inert` y el foco vuelve al botón que los abrió.
- **Código:** `web/src/study/` (`progress.js` y `quiz.js`, sin DOM, con pruebas) y `web/src/ui/study.js`.
- **Detalle:** `docs/hitos/03-leccion-evaluacion-progreso.md`.

## Contenido de estudio: módulo del brazo (2026-11-02)

**Esquema** (`web/src/content/schema.js`). Cada ficha lleva:
- un identificador estable y los campos generales (nombre, sinónimos, latín y número de TA2, región, lado, modelos, mallas, descripción, función);
- los campos propios de su tipo: músculo, nervio, arteria, vena, hueso, ligamento u órgano;
- relaciones y simplificaciones del modelo;
- **fuentes de terminología separadas de las de contenido**, y en estas, qué campos respalda cada una;
- el estado de revisión. Nadie figura como revisor sin haberlo hecho.

**Módulo «El brazo»** (`web/src/content/brazo.js`):
- 15 fichas: 10 evaluables (húmero, bíceps, coracobraquial, braquial, tríceps, nervios musculocutáneo, radial, mediano y ulnar, arteria braquial) y 5 de contexto;
- redactadas a partir de 9 páginas de TeachMeAnatomy leídas el 2026-11-02, más la TA2 para los nombres;
- estado «Borrador · sin revisar por un especialista»;
- sin correlaciones clínicas hasta que se revisen.

**En la app:** las piezas del módulo muestran esa ficha (contenido, relaciones con botón **Ver**, simplificaciones, estado y fuentes divididas). El resto de las piezas, la de siempre.

**Revisión:** `npm --prefix web run check` valida las fichas. Detecta campos obligatorios, textos genéricos, afirmaciones sin fuente, relaciones rotas y piezas que no existen en un modelo declarado (o existen en uno no declarado). También informa de las descripciones genéricas que quedan por sistema. Pruebas: `web/tests/content.test.mjs`.

Detalle: `docs/hitos/02-contenido-brazo.md`.

## Contrato de datos para nuevas fases

Cada objeto exportado desde Blender lleva *custom properties* (llegan como `extras` en glTF):

| Propiedad | Valores |
|---|---|
| `system` | `skeletal`, `muscular`, `arterial`, `venous`, `lymphatic`, `nervous`, `respiratory`, `digestive`, `endocrine`, `urogenital`, `integumentary`, `special_senses` |
| `tissue` | `bone`, `tooth`, `cartilage`, `ligament`, `muscle`, `tendon`, `vessel`, `nerve`, `organ`… |
| `layer` | Músculos: `1` superficial, `2` intermedio, `3` profundo |
| `major` | `true` en vasos y nervios principales (capa «Principales») |
| `subsystem` | `cns`, `airways`, `gi_tract`, `urinary`, `reproductive`… |
| `name_la`, `name_en`, `source` | Término latino, inglés y procedencia/licencia del modelo |

Las colecciones de Blender se exportan como nodos, y la app las usa como grupos (por ejemplo,
`Axial_Skeleton` o `Skull`). Al añadir un sistema solo hay que exportarlo con estas propiedades
y escribir sus fichas en `anatomia.js`: la barra activa sus capas sola.

## Corrección del cuello

Al ajustarse a la piel de MakeHuman, el cuello quedó un 23 % más largo que la referencia de Z-Anatomy,
y las vértebras C3–C6 quedaron deformadas (estiradas un 40 % en un eje). `tools/fix_neck.py` lo corrige
partiendo siempre de `sources/originals/`:

- Rehace C1–C7 con la forma de Z-Anatomy y la separación vertical real, conservando la curvatura.
- Baja la cabeza 2 cm en vertical.
- Acorta la piel del cuello con una transición suave, sin tocar los hombros.
- Infla la piel bajo el mentón solo donde la mandíbula o el hioides quedaban a menos de 5 mm de ella.
  - La mandíbula ya asomaba hasta 12 mm en la Fase 2 original.
  - El inflado llega hasta 16 mm, con caída suave en 1,5 cm, y solo en la superficie exterior, no en la boca.
- Aplica lo mismo a la piel femenina (misma malla base), escalado a su estatura (sin el inflado, porque no tiene esqueleto).
- Mueve también las *shape keys* de la piel (`Basis`, `Obesity`).
  - El exportador glTF usa la `Basis`.
  - Hasta el 2026-10-26 no se movían: el cuello corregido no llegaba a `male.glb` ni a `female.glb`. La mandíbula asomaba bajo el mentón y los ojos de la mujer quedaban 1,9 cm por debajo de sus párpados.

Resultado: columna cervical de 12,0 cm (referencia 11,4) y distancia mentón–esternón de 9,9 cm
(referencia 9,2). Después hay que regenerar los sistemas con los scripts `build_*.py`.

```bash
/Applications/Blender.app/Contents/MacOS/Blender -b --disable-autoexec --python tools/fix_neck.py
```

## Fase 3: músculos, tejido conjuntivo, vasos, sistema nervioso y vísceras

```bash
# Todo de una vez (unos 12 minutos), o solo algunos: zsh tools/build_all.sh visceral nervous
zsh tools/build_all.sh

# O paso a paso:
/Applications/Blender.app/Contents/MacOS/Blender -b --disable-autoexec sources/z-anatomy/extracted/Z-Anatomy/Startup.blend --python tools/build_muscular.py -- --budget 450000
/Applications/Blender.app/Contents/MacOS/Blender -b --disable-autoexec --python tools/export_glb.py -- build/male_muscular.blend Muscular_System web/public/models/male-muscular.glb
/Applications/Blender.app/Contents/MacOS/Blender -b --disable-autoexec sources/z-anatomy/extracted/Z-Anatomy/Startup.blend --python tools/build_connective.py -- --budget 200000
/Applications/Blender.app/Contents/MacOS/Blender -b --disable-autoexec --python tools/export_glb.py -- build/male_connective.blend Connective_System web/public/models/male-connective.glb
/Applications/Blender.app/Contents/MacOS/Blender -b --disable-autoexec sources/z-anatomy/extracted/Z-Anatomy/Startup.blend --python tools/build_vascular.py
/Applications/Blender.app/Contents/MacOS/Blender -b --disable-autoexec --python tools/export_glb.py -- build/male_arterial.blend Arterial_System web/public/models/male-arterial.glb
/Applications/Blender.app/Contents/MacOS/Blender -b --disable-autoexec --python tools/export_glb.py -- build/male_venous.blend Venous_System web/public/models/male-venous.glb
/Applications/Blender.app/Contents/MacOS/Blender -b --disable-autoexec sources/z-anatomy/extracted/Z-Anatomy/Startup.blend --python tools/build_nervous.py
/Applications/Blender.app/Contents/MacOS/Blender -b --disable-autoexec --python tools/export_glb.py -- build/male_nervous.blend Nervous_System web/public/models/male-nervous.glb
```

Ambos scripts usan el mismo ajuste (`tools/anato3d_fit.py`):

- **Mismo ajuste que el esqueleto:** cada hueso de la Fase 2 es una transformación afín exacta del
  hueso de Z-Anatomy. Cada vértice de músculo se mueve con la mezcla de las transformaciones de los
  huesos cercanos, ponderada por la inversa de la distancia a la cuarta potencia.
- **Piel:** los vértices que quedan fuera de la piel se meten 1,5 mm por debajo. Antes se confirma por
  paridad de rayos, por las cavidades de la boca y los ojos. Los músculos internos (faringe, lengua,
  pterigoideos, suelo pélvico…) no se corrigen.
- **Capas:** superficial (colección «Superficial muscles» de Z-Anatomy o no cubierto), intermedia y
  profunda, según qué músculos tapan su cara externa camino de la piel.
- **Nombres:** español y latín de la traducción oficial de Z-Anatomy. La región y la inervación salen
  de sus colecciones, y la acción de su material.
- **Tejido conjuntivo (614 estructuras):** 349 ligamentos y retináculos, 30 cápsulas articulares,
  65 discos, meniscos y cartílagos articulares, 54 fascias, 76 bursas, 38 vainas tendinosas y
  2 almohadillas de grasa. Las fascias quedan a 1 mm bajo la piel, justo por fuera de los músculos.
  Las articulaciones del cráneo, la columna y el tórax no se corrigen por la piel. Las regiones salen
  de la colección «Arthrology» de Z-Anatomy.
- **Vasos:** 436 estructuras arteriales (392 arterias, 27 arterias pulmonares y el corazón con sus
  cavidades, válvulas y músculos papilares) y 230 venas. En Z-Anatomy son curvas con grosor: su
  resolución se ajusta al calibre. Los colores siguen la oxigenación, como en los atlas: las arterias
  pulmonares van en azul y las venas pulmonares en rojo.
- **Sistema nervioso (580 estructuras):**
  - SNC: 126 piezas de corteza, cerebelo, tronco del encéfalo, núcleos, sustancia blanca, ventrículos
    y meninges.
  - SNP: pares craneales, plexos, nervios espinales y cadena simpática.
  - Sentidos: ojo detallado y oído.
  - Capas: Central, Encéfalo profundo (sin corteza ni sustancia blanca hemisférica), Periférico,
    Sentidos y Completo.
  - Los ojos de MakeHuman pasaron al sistema tegumentario, con la piel.
  - Solo los nervios cutáneos y de los miembros se corrigen por la piel.
- **Respiratorio (48 estructuras):** nariz, mucosa nasal, nasofaringe, cartílagos de la laringe,
  epiglotis, tráquea, árbol bronquial hasta los bronquios segmentarios, 5 lóbulos pulmonares y
  pleura. Capas: Vías aéreas, Pulmones y Completo.
- **Digestivo (47 estructuras):**
  - Tubo digestivo: lengua, encía, glándulas salivales, faringe, esófago, estómago y su mucosa,
    duodeno, yeyuno, colon y apéndice.
  - Glándulas anexas: hígado con sus 8 segmentos de Couinaud, vesícula y vías biliares, y páncreas.
  - Peritoneo: omentos y mesocolon.
  - Capas: Tubo digestivo, Glándulas anexas, Órganos y Completo.
  - Z-Anatomy no trae íleon, ciego ni recto.
- **Colores:** los de las vísceras se definen en sRGB (tonos de atlas) y se convierten a lineal.
- **Nombres:** si un objeto nuevo se llama igual que uno de Z-Anatomy («Stomach»), se aparta el de
  Z-Anatomy para que no quede como «Stomach.001».
- **Fascias:** se acercan 1,2 mm a la piel para que no las atraviesen los músculos.
- **Pendiente:** la versión femenina.

## Fase 4: urogenital, endocrino y linfático

Los tres salen de `build_visceral.py` (`classify_new`) con el mismo ajuste:

- **Urogenital (22 estructuras):**
  - Urinario: riñones con su pelvis renal, uréteres, vejiga y uretra.
  - Genital masculino: testículos, epidídimos, conductos deferentes y eyaculadores, glándulas seminales,
    próstata, cuerpos cavernosos, cuerpo esponjoso y glande.
  - Capas: Urinario, Reproductor y Completo.
- **Endocrino (10 estructuras):** adenohipófisis, neurohipófisis, glándula pineal, tiroides, 4 paratiroides y 2 suprarrenales.
- **Linfático (144 estructuras):**
  - Órganos: bazo, los dos lóbulos del timo y las amígdalas palatinas.
  - 139 grupos de nodos, agrupados por región según TA2: cabeza, cuello, miembro superior, tórax, abdomen, pelvis y miembro inferior.
  - Capas: Órganos, Nodos y Completo.
  - Cada nodo se mueve entero, sin deformarlo (`place_nodes`): primero fuera de los huesos y, si es superficial, hasta 3 mm bajo la piel, o menos si el hueco entre hueso y piel no da (cuero cabelludo).
- **Subdivisión:** las piezas viscerales de menos de 2 000 caras conservan un nivel de Subsurf (`keep_subsurf_below`).
  Sin él, la faringe, el paladar blando, la tiroides o las paratiroides de Z-Anatomy (60–70 caras) salían facetadas.
- **Opción «Mostrar genitales externos»** (Ajustes; se recuerda en cada navegador), para usar la app con público general:
  - Al desactivarla se ocultan la piel genital, el glande, los testículos y los epidídimos.
  - Las piezas que cruzan la piel (cuerpos del pene, uretra, conductos deferentes, vasos y nervios) pierden solo su tramo externo; la raíz del pene, la próstata y la vejiga siguen visibles.
  - La región externa es una rejilla de 2 mm (`male-genital-region.json`, la escribe `build_genital_skin.py`). Una celda es externa si sale más de 1,5 mm de la piel del cuerpo, o si la tapa la piel genital y queda fuera de la superficie del cuerpo.
  - El visor (`viewer.js`, `setModesty`) quita los triángulos con algún vértice en ella.
  - Solo recorta piezas de los sistemas urogenital, arterial, venoso, nervioso y linfático: los músculos y las fascias de la ingle no se tocan.
- **Vasos pudendos externos:** no se corrigen por la piel. Sus ramas van al escroto, y al meterlos bajo la piel el tubo se estiraba de un lado a otro del pliegue de la ingle; los cubre la piel genital.
- **Piel de los genitales** (`build_genital_skin.py` → `male-integumentary.glb`, se carga con el tegumentario):
  - La piel de MakeHuman tiene la ingle lisa, y el pene y los testículos salían hasta 5,5 cm de ella.
  - Se genera una piel de 3 mm sobre el pene y, con metabolas, un escroto alrededor de los testículos y el
    cordón espermático.
  - Usa el material de la piel.
- **Lo que no trae Z-Anatomy:**
  - conducto torácico, cisterna del quilo y troncos linfáticos;
  - amígdalas faríngea y lingual;
  - órganos femeninos.
- **Datos de origen:** los testículos de Z-Anatomy miden 3 cm de largo (referencia: 4–5 cm). Algunos órganos se
  solapan ya en el original: el epidídimo dentro del testículo (47 %) y algunos nodos dentro del páncreas o del colon.

## Fase 5: realismo (que no se vea «de plástico»)

**Por qué se veía de plástico:**
- Casi todos los materiales generados llevaban un barniz (*clearcoat*) con rugosidad 0, que reflejaba las luces del estudio como un caramelo.
- Colores planos, sin oclusión ambiental y con la luz cortada en seco en la sombra.
- Piel facetada y de un solo color.

**Materiales (`web/src/realism.js`).** Cada material recibe un perfil según el tejido:
- **Brillo:** barniz húmedo pero difuso, satinado (*sheen*) e intensidad especular.
- **Variación procedural** en coordenadas del objeto:
  - fibras en músculo, tendón y nervio;
  - lobulillos en pulmón, hígado, glándulas y grasa;
  - poros en hueso y piel;
  - vasos finos en serosas y corteza.
- **Relieve fino:** por derivadas en pantalla. Se desvanece por debajo de un píxel.
- **Dispersión subsuperficial aproximada:** luz envolvente teñida en la zona de sombra.
- **Ruido precalculado:** una textura 3D periódica de 64³ con mipmaps. Calcularlo en el shader bajaba la app de 51 a 2 fps; con la textura cuesta un 8 %.
- **Comparar:** `?plain` en la URL desactiva todo esto.

**Fibras musculares.** Las direcciones se estiman por pieza (vientre y tendón juntos). En los músculos en abanico (pectoral, deltoides, trapecio) convergen hacia el extremo estrecho.

**Imagen:**
- Mapeo de tonos *Khronos PBR Neutral*: ACES aclaraba y desaturaba los rojos.
- Oclusión ambiental GTAO:
  - se calcula en una textura y cada material la aplica a su luz indirecta (y en parte a la directa);
  - no incluye el suelo ni las piezas translúcidas;
  - se desactiva con «Alta calidad» en los ajustes, y en pantallas táctiles empieza desactivada.

**Rendimiento** (Mac, 1280 × 860, DPR 2, todos los sistemas, 3,3 M triángulos):

| Configuración | fps |
|---|---|
| Sin materiales realistas (`?plain`) | 51 |
| Con materiales realistas | 47 |
| Con materiales realistas y oclusión | 36 |

**Errores de los modelos corregidos en esta fase:**
- **Tendones:** los músculos de Z-Anatomy tienen dos materiales por cara (vientre y partes tendinosas). El build tomaba el material «activo», que es arbitrario:
  - el esternocleidomastoideo izquierdo salía entero blanco y el derecho, rojo;
  - 41 pares no coincidían entre lados;
  - la acción del músculo quedaba vacía en varios.
  - Ahora se conservan los dos materiales por cara (`keep_slots`) en 227 músculos, y solo es tendón lo que tiene más del 90 % de caras tendinosas.
- **Hígado duplicado:** el hígado entero y sus 8 segmentos se dibujaban a la vez. Ahora los segmentos tienen su capa, «Segmentos hepáticos».
- **Cara anterior del hígado como una cortina rasgada:**
  - La causaba la apófisis xifoides de la Fase 2, que no es transformación afín de la de Z-Anatomy (15 mm de error). Los huesos con más de 5 mm de error ya no guían el ajuste (`MAX_AFFINE_ERROR`).
  - En las vísceras y el corazón, además, el desplazamiento (no la forma) se suaviza sobre la malla (`fit(..., smooth=)`):
    - solo donde el ajuste estira o encoge aristas mucho más que la mediana;
    - nunca a menos de 2 mm de un hueso (6 mm en el corazón).
  - En músculos, ligamentos, vasos y nervios no se suaviza. Probado: metía el romboides en las costillas (13 mm) y el cerebelo en el occipital, y un suavizado uniforme movía el bazo en bloque hasta las costillas.
- **Encéfalo:** se saca de los huesos de la Fase 2 cualquier vértice de corteza, cerebelo, sustancia blanca, tronco o meninges que el ajuste haya metido en ellos (`out_of_bone`).
  - En huesos abiertos (el occipital) solo se corrige cerca de su superficie; lejos de ella, su normal no es fiable.
  - La auditoría aplica el mismo criterio: un lóbulo del cerebelo salía «17 mm dentro» del occipital estando a 22 mm de él.
  - **Resultado:** 62 piezas entran menos en hueso que antes de la fase y 11 algo más (2–5 mm).
- **Grasa epicárdica:** el visor la calcula al cargar el corazón, en el surco coronario (aurículas con ventrículos) y en los interventriculares (ventrículo con ventrículo), con borde lobulado. Con la cercanía a las coronarias salía una red amarilla por todo el corazón.
- **Piel:**
  - Subdividida (Catmull-Clark, 53 514 vértices), sin hueso a menos de 3 mm.
  - Con un mapa de tono por vértice (`tools/skin_tone.py`):
    - pliegues más oscuros;
    - labios, nariz, mejillas y orejas más rojizos;
    - pezones y una sombra de barba leve;
    - yemas, codos y rodillas más rojizos;
    - cara y manos más tostadas.
  - La piel genital es más pigmentada.
- **Cartílago costal:** salía gris oliva (la textura del hueso multiplicada por azul). Ahora es blanco azulado nacarado.
- **Presupuesto de caras:** la corteza cerebral se veía facetada (31 % de sus caras); ahora tiene casi todas, y los músculos superficiales tienen más detalle que los profundos.

## Fase 6: morfología (proporciones y genitales)

**Por qué el cuerpo tenía una «morfología rara».** Se midió la Fase 2 contra los huesos originales de Z-Anatomy:
- **Rodillas:** la piel de MakeHuman tiene la pierna larga y el muslo corto. Al ajustarle los huesos, la tibia quedó un 24 % más larga que la real, igual de larga que el fémur, y la rodilla a media pierna.
- **Codos:** el húmero quedó un 13 % más corto y el antebrazo un 10 % más largo; el codo, 3,6 cm alto.
- **Pene:** el de Z-Anatomy ya cuelga (unos 20° de la vertical), pero solo asomaban 6 cm de la piel, porque la grasa del pubis de MakeHuman es gruesa, y su tronco medía 2,2 cm.
- **Testículos:** pequeños para un adulto (3,8 cm, unos 9 ml) y altos, a los lados del glande. Con la piel de metabolas se veían como dos lóbulos sueltos con un muñón de cordón.

**Proporciones (`tools/proportions.py`, desde `fix_neck.py`).** Se reparte de nuevo la longitud de cada extremidad con la proporción de Z-Anatomy: pierna/muslo 0,836 y antebrazo/brazo 0,861. La longitud total no cambia, y la cadera, el tobillo, el hombro y la muñeca no se mueven.
- **Cuánto se mueve:** la rodilla baja 4,7 cm y el codo 3,3 cm.
- **Huesos:** se mueven por tramos.
  - Las diáfisis se estiran o se encogen.
  - La rodilla y el codo bajan en bloque, así que las articulaciones no cambian.
  - Cada tramo es una transformación afín de Z-Anatomy. El hueso guarda sus límites en la propiedad `segments`, y `anato3d_fit.Fitter` calcula una transformación por tramo. Así los 12 sistemas siguen al hueso sin más cambios.
- **Piel:** se mueve con el mismo campo, suavizado. Una extremidad es lo que está bajo la ingle (sin las manos) o lo que tiene como hueso más cercano uno del brazo, con transición suave en la axila.
- **Mujer:** recibe el mismo desplazamiento por índice de vértice, escalado a su estatura.

**Inflado de la piel sobre el hueso (`fix_neck.py`):**
- **Nuca:** cada apófisis espinosa (C6, C7) dejaba su propio bulto, con un surco en medio. Ahora el abultamiento es más ancho cuanto más asoma el hueso (hasta 2,5 cm), los cercanos se unen y la nuca se alisa.
- **Boca:** el atlas y el axis «asomaban» por la pared del fondo de la boca de MakeHuman, que pasaba por exterior porque los labios no cierran del todo, y la empujaban hasta 33 mm. Ya no se tienen en cuenta.
- **Fuera o dentro de la piel:** un punto de hueso solo cuenta como fuera si lo dicen a la vez la paridad de rayos y la cara más cercana. En los dedos, que se tocan entre sí, la paridad sola se equivocaba.

**Genitales (`anato3d_fit.GenitalPose`, en el ajuste de todos los sistemas):**
- **Pene:** la parte péndula se alarga sin el glande hasta unos 8,5 cm fuera de la piel, en el rango de un pene flácido adulto, y engrosa un 12 %. Lo siguen la uretra, los cuerpos cavernosos y el esponjoso, y las arterias y venas del pene.
- **Testículos:** tamaño adulto (4,5 × 2,7 × 2,5 cm, unos 16 ml), justo detrás y debajo de la base del pene: 1,4 cm por delante de donde los deja Z-Anatomy, el derecho 4 mm más alto y el izquierdo 4 mm más bajo, que cuelga más. El polo superior queda inclinado hacia delante y afuera.
  - Quedan a 9 mm del pene, sin tocarlo.
  - Antes (hasta el 2026-11-01) bajaban 8 y 16 mm sin adelantarse: el escroto quedaba entre los muslos, sin verse de perfil, y el pene parecía salir solo del bajo vientre.
  - El epidídimo los sigue entero.
  - El cordón espermático y las ramas escrotales de los vasos pudendos externos se mueven cada vez menos hasta el anillo inguinal superficial.
- **Qué piezas se mueven:** solo las que coinciden por nombre de Z-Anatomy. Los aductores y los vasos femorales, a pocos centímetros, no se tocan.

**Piel genital (`tools/build_genital_skin.py`).** Es una función de distancia con signo muestreada en una rejilla de 0,8 mm y extraída con *surface nets*.
- **Pene:** un tubo con la sección real de los cuerpos y los vasos dorsales, más 3 mm de piel, con pliegues muy leves y un rodete de prepucio retraído tras la corona.
- **Glande:** el de Z-Anatomy es un cilindro romo de 2,3–2,9 cm, sin corona marcada. La piel lleva uno esculpido que lo contiene, descubierto y con color de mucosa:
  - forma de bellota que se estrecha hacia la punta;
  - corona oblicua (más distal por la cara ventral) con su reborde, más débil junto al frenillo;
  - el meato, una hendidura en la punta.
- **Escroto:** un solo saco formado por dos lóbulos orientados con cada testículo, un tabique, un cuello que entra en el periné y los cordones.
  - Arrugas transversales irregulares y rafe en la línea media.
  - Donde roza los muslos se aplana contra ellos (1,5 mm de holgura) en vez de atravesarlos.
- **Pene y escroto, una sola pieza:** en los primeros 1,2 cm del pene, el escroto se une a su cara ventral (unión penoescrotal), solo por esa cara: unido también por los lados, la base quedaba como un bloque de techo plano. Más abajo, el pene cuelga libre por delante y el escroto cede donde se apoya, con 1,5 mm de holgura; sin ella se fundían a lo largo del tronco.
- **Unión con el cuerpo:** unión suave con la piel de MakeHuman donde nacen el pene y el escroto. La franja que la toca se hunde 1,2 mm, así que no queda borde, rendija ni parpadeo.
- **Tono:** más pigmentado que el tronco y más oscuro en el escroto, en los surcos y en el rafe. Junto a la unión, el mismo tono de la piel del cuerpo.

## Fase 7: sistema muscular

**Qué fallaba (medido):**
- **Esqueleto asimétrico en la Fase 2:** la piel de MakeHuman es simétrica (0,1 mm de media), pero:
  - el tórax (vértebras C7–L1, esternón, costillas, clavículas, escápulas) estaba 3–3,5 mm a la izquierda;
  - el húmero izquierdo era un 7–9 % más grueso que el derecho.
  - Los músculos del brazo izquierdo salían de la piel y se aplastaban contra ella (cabeza lateral del tríceps: 28 % de sus vértices corregidos, frente al 4 % del derecho).
- **Capa «Profundo» incompleta:** era «bajo dos capas de músculo», y la pierna o el hombro, con dos planos, nunca llegaban. Faltaban el tibial posterior, el poplíteo, los flexores largos, el manguito de los rotadores, el braquial y el vasto intermedio.
- **Dentro del hueso:** 58 músculos entraban más de un 3 % (cabeza cubital del extensor cubital del carpo, 31 %; aductor mayor, 6 mm; plantar, 9,6 mm).
- **Unos dentro de otros:** 73 parejas con más del 5 % de vértices dentro de otro músculo, hasta 8 mm (aductor largo en el vasto medial, subclavio en el pectoral mayor).
- **Platisma:** Z-Anatomy lo marca como tendón junto a la mandíbula, y salía una banda blanca a lo largo de ella.

**Arreglos:**
- **Esqueleto simétrico (`fix_neck.py`, paso 0):**
  - Cada pareja izquierda/derecha se sustituye por la media de una y el espejo de la otra. Z-Anatomy las tiene en espejo vértice a vértice, así que siguen siendo transformaciones afines de Z-Anatomy, con el mismo error de ajuste.
  - La línea media se centra. Lo heredan los 12 sistemas.
- **Capas anatómicas (`build_muscular.py`):**
  - Superficial: lo que se ve al quitar la piel.
  - Profunda: lo que está cubierto y descansa sobre el hueso o las vísceras, sin otro músculo debajo.
  - Intermedia: lo que tiene músculos encima y debajo.
  - «Debajo» exige que el otro músculo esté al menos 4 mm más lejos de la piel, para que el vecino de al lado no cuente.
  - El umbral (18 % de la cara interna) está calibrado con los de libro. Sobre el hueso, de 0 a 0,17: poplíteo, supraespinoso, braquial, vasto intermedio, supinador. Con un plano debajo, de 0,18 a 0,44: sóleo, intercostales internos, romboides, glúteo medio, oblicuo interno.
  - Resultado: 190 superficiales, 70 intermedios y 210 profundos.
- **Fuera del hueso:** `fit(..., out_of_bone=True)` lleva a la superficie del hueso (+0,5 mm) lo que el ajuste metía en él.
- **Separación entre músculos:**
  - Cede el más profundo (por capa y, a igual capa, el más alejado de la piel): sus vértices dentro del otro pasan a su superficie.
  - El desplazamiento se extiende con suavidad a los vecinos y nada vuelve a entrar en el hueso.
  - Dos rondas.
- **Platisma:** muscular hasta su inserción (`ALL_FLESH`).
- **Hombro (`fix_neck.py`, paso 3c2):** el deltoides de Z-Anatomy no cabía en el hombro de MakeHuman, más delgado por detrás. Su porción posterior asomaba hasta 21 mm y el ajuste la aplastaba contra la piel, con forma de escudo.
  - Se ajusta el deltoides a este esqueleto (con `Fitter(objects)`, sobre el esqueleto en memoria).
  - La piel se infla sobre él con 3 mm de tejido subcutáneo (hasta 23 mm), con caída suave y en la dirección de las normales suavizadas. Con la normal de cada vértice, el pliegue axilar posterior se doblaba.
  - Solo cuenta la piel cuyo hueso más cercano es el húmero, la escápula o la clavícula, que mira hacia atrás o hacia fuera. Así no se toca la pared del tórax frente al brazo ni la bóveda de la axila.
- **Región genital:** también marca las celdas con algún vértice de una pieza genital fuera de la piel. Con la rejilla de 2 mm, los conductos deferentes podían quedar a la vista con la opción desactivada.

## Fase 8: vista muscular como en los atlas (2026-10-29)

Comparada con una imagen de referencia de un atlas 3D (vista anterior, capa superficial).

**Diferencias (medidas en el visor):**
- Los músculos flotaban en el vacío: la referencia los muestra sobre el esqueleto, con ligamentos y retináculos, los ojos, los cartílagos de la nariz y los genitales.
- **Rojo de los músculos:** más oscuro y pardo que el de la referencia (mediana sRGB 140, 58, 45 frente a 165, 63, 52).
- **Abdomen:** Z-Anatomy modela el oblicuo externo, el interno y el transverso enteros con el material del vientre, también sus aponeurosis.
  - Delante del recto y en la ingle salían rojos, en lugar de la aponeurosis blanca y la vaina del recto.
  - El oblicuo interno asomaba a parches por delante del recto (1.840 caras de un lado, a menos de 1 mm).
- **Pico en el borde del recto:** `push_out_of_bone` llevaba 5 vértices hasta una costilla, a 53 mm. La normal de la cara más cercana de un hueso fino apunta al revés lejos de él.
- **Bordes de tendón en dientes de sierra:** Z-Anatomy marca el tendón cara a cara.

**Arreglos:**
- **Contexto por sistema (`systems.js`, `main.js`):** un sistema puede mostrar piezas de otros que estén apagados (`context`). Se cargan sin avisos y respetan la opción de los genitales externos.
  - El muscular muestra los huesos (sin dientes), los ligamentos, los ojos, los cartílagos respiratorios y los genitales externos.
- **Rojo de músculo:** multiplicado por (0,88, 0,6, 0,6) en el visor.
- **Vaina del recto (`build_muscular.py`):**
  - Se mide sobre la huella del recto vista de frente (rejilla de 2 mm): distancia con signo a su borde, y profundidad de sus caras anterior y posterior.
  - **Oblicuo externo:** aponeurosis hasta 16 mm por fuera del recto y en la ingle, por debajo de la espina ilíaca anterosuperior.
    - Delante del recto es un velo (28 % de opacidad) que se vuelve blanco hacia su borde.
    - Hacia el vientre se funde en 6 mm.
  - **Oblicuo interno y transverso:** aponeurosis desde 5 y 12 mm por fuera del recto. La lámina anterior es invisible delante del recto; la posterior se ve al quitarlo.
  - Las mallas se cortan por la isolínea (borde limpio). La opacidad va por vértice, en el alfa del color (`COLOR_0`), y el visor la usa con `vertexColors`.
  - Lo que el oblicuo externo cubre pasa por debajo de él (`tuck_under`), y el oblicuo externo y el recto, por debajo del pectoral mayor.
  - La pared del abdomen (recto, oblicuos, transverso) se ajusta con el desplazamiento suavizado donde se pliega (`smooth=4`).
- **`push_out_of_bone` (`anato3d_fit.py`):** a más de 6 mm de profundidad, confirma por paridad en ese hueso. El sistema nervioso, que también lo usa, sale idéntico.
- **Bordes de tendón:** cada músculo se corta por la isolínea de la fracción de tendón de sus vértices, con 3 pasadas de suavizado, 1 o ninguna, la que deje el área de tendón con menos de un 25 % de cambio. Así quedaron 209, 6 y 2 músculos.
- **Auditoría:** músculos dentro del hueso, 0 % (sin cambios); choques, 63 (sin cambios).

**Diferencias que quedan:** la referencia es un modelo más ancho y musculoso (hombros, brazos, tórax): los músculos siguen la piel de MakeHuman. Los testículos se ven blancos (la túnica albugínea); en la referencia, cubiertos por la fascia espermática, son rosados.

## Fase 9: complexión musculosa y mejoras de la web (2026-10-29)

Encargo: «un cuerpo más ancho y musculoso como el de la referencia (hombros, brazos y tórax)».

**Medido contra la referencia** (ancho del contorno en la vista anterior de la capa muscular, en fracción de la estatura):
- **Brazo:** a la altura del deltoides, 0,038 frente a 0,047.
- **Antebrazo bajo el codo:** 0,045 frente a 0,051–0,052.
- **Pantorrilla:** 0,049 frente a 0,057.
- **Línea de los hombros:** al 17,5 % de la estatura medía 0,186 frente a 0,243. Los hombros de MakeHuman caen: el acromion quedaba ~2,5 cm más bajo respecto al mentón y el trapecio apenas subía por el cuello.
- **Lo que no apretaba la piel:** solo el trapecio (hasta 9 mm). Los demás músculos del brazo y del tórax eran así de delgados.

**Arreglos:**
- **Hombros (`proportions.py`, `raise_shoulders`; `fix_neck.py`, paso 3a2):**
  - la clavícula gira 3° sobre su extremo esternal y el acromion sube 8 mm (2 cm el 29 oct; ver «Cuello», abajo);
  - la escápula la sigue (lo que se mueve la articulación acromioclavicular);
  - el brazo entero sube con ella y se separa 3° del tronco.
  - Todo son movimientos rígidos: los huesos siguen siendo transformaciones afines de Z-Anatomy, y los tramos de los huesos largos (`segments`) se mueven con ellos.
  - La piel sigue a cada hueso con pesos suaves.
- **Complexión (`musculature.py`; `fix_neck.py`, paso 3c3):**
  - La piel sale un abultamiento por músculo, medido contra la referencia: deltoides (13 mm hacia fuera), bíceps y tríceps (8), antebrazo bajo el codo (6–8), pectoral (9), trapecio superior (14; 22 el 29 oct), esternocleidomastoideo (4), dorsal ancho y serrato (8), flancos (10) y pantorrilla (7–8). Después se suaviza y va según la normal suavizada.
  - Donde la piel tiene otra piel enfrente (el brazo frente al tórax), sale como mucho un tercio del hueco.
  - Un campo de desplazamiento en el volumen (rejilla de 6 mm) lleva con ella lo que hay dentro: cero en los huesos, el de la piel en la piel y armónico (Laplace, sobrerrelajación rojo-negro) entre medias.
    - Se guarda en `Anato3D_Male_30_Fase2_musculature.npz` (0,8 MB).
    - `Fitter.deform` lo aplica después del ajuste por huesos a todo lo que ajusta: músculos, vasos, nervios y vísceras se engrosan a la vez, sin cruzarse.
    - El músculo junto a la piel sale tanto como ella y el que está sobre el hueso casi no se mueve.
  - El paso es determinista: dos ejecuciones dan el mismo campo.
- **Resultado (mismas medidas):**

| | Antes | Ahora | Referencia |
|---|---|---|---|
| Línea de los hombros | 0,186 | 0,236 | 0,243 |
| Contorno a la altura del deltoides | 0,266 | 0,274 | 0,269–0,275 |
| Antebrazo | 0,045 | 0,049–0,051 | 0,051–0,052 |
| Pantorrilla | 0,049 | 0,053 | 0,057–0,058 |

  - La cintura sigue más estrecha que la de la referencia: el tronco queda en V.
- **Auditoría:** los mismos 63 choques, ninguno nuevo. 7 piezas empeoran, todas por menos de 3 mm: el nervio supraescapular roza la escápula 1,7 mm, y el conducto deferente derecho sale 2,7 mm de la piel, bajo la piel genital.

**Web:**
- **Búsqueda en todos los sistemas:** `tools/search_index.py` escribe `male-index.json` con el nombre y los datos de ficha de las 2.602 piezas de los sistemas que se descargan aparte (511 KB, 54 KB comprimido).
  - Buscar «bíceps» antes de abrir el sistema muscular solo daba dos bolsas sinoviales del bíceps femoral.
  - Al elegir un resultado, se descarga su sistema, se activa la capa que lo muestra y se selecciona.
  - Los resultados dicen el lado (izq./der.); antes los dos lados salían como uno.
- **Texturas de los huesos en WebP** (`EXT_texture_webp`): `male.glb` baja de 14,8 a 11,2 MB.
- **Barra de sistemas:** en pantallas estrechas, los bordes se difuminan mientras haya más sistemas a ese lado; al tocar uno, se centra.
- **Programas de sombreado:** se compilan antes de añadir un sistema a la escena, para que no aparezca un instante blanco.
- **Página:**
  - título y descripción;
  - icono (`favicon.svg`, iconos de 180, 192 y 512 px);
  - manifiesto para instalarla como app en el móvil.
- **Cabecera:** «Hombre adulto · 12 sistemas» en lugar de «Fase 4 · 12 sistemas».
- **Errata:** «Cabeza corta músculo del bíceps braquial» → «Cabeza corta del músculo bíceps braquial».

## Cuello (2026-10-30)

El usuario lo veía «todo deforme», frente a una imagen de referencia con los esternocleidomastoideos marcados en «V» y el trapecio bajando en diagonal hacia los hombros.

**Qué pasaba (medido):**
- **Cuello hinchado:** el abultamiento del trapecio de la complexión musculosa (22 mm) culminaba 8 cm por encima del hombro, en el propio cuello, y lo hinchaba por todos lados.
  - A la altura de C2–C3, el cuello medía 13,3–14 cm de ancho, frente a 11,1–11,2 cm de la piel de MakeHuman.
  - Era un tubo recto hasta la mandíbula, y el trapecio empezaba en C4 en vez de C5.
- **Hombros cuadrados:** al subir el acromion 2 cm, la pendiente del trapecio pasaba de ~19° a ~10°, y quedaba un escalón casi horizontal del cuello al hombro. El contorno alto de la referencia es un trapecio grueso, no un acromion alto.
- **Velo sobre el cuello:** el platisma, con un 30 % de opacidad, lo cubría y no dejaba distinguir los esternocleidomastoideos.

**Arreglos:**
- **Trapecio (`musculature.py`):** el abultamiento va solo en la pendiente de la base del cuello al acromion, en la piel que mira arriba o atrás (14 mm). El cuello vuelve a medir 11,2 / 11,1 / 12,8 cm en C2, C3 y C4.
- **Hombros (`proportions.py`):** el acromion sube 8 mm. El trapecio vuelve a bajar en diagonal.
- **Esternocleidomastoideo:** abultamiento de 4 mm a lo largo de la línea mastoides–articulación esternoclavicular, solo en la piel que mira hacia delante o afuera. Así se marca la «V».
- **Platisma:** 12 % de opacidad en el visor.

## Vulva, genitales externos profundos y músculos del periné (2026-10-31)

**Referencias comunes** (`tools/female_perineum.py`, nuevo). `frame()` calcula, solo con la pelvis y la piel, las referencias que usan la vulva, los genitales profundos y los músculos:
- orificio vaginal y uretral, glande y rodilla del clítoris;
- cuerpo perineal y uretra;
- cara inferomedial de las ramas isquiopubianas, con rayos sobre el coxal.

**Genitales externos profundos** (`deep_genitals`, desde `female_organs.py`), con medidas de O'Connell (2005) y Lloyd (2005):
- glande cónico de 6 mm;
- cuerpo acodado hasta la rodilla bajo la sínfisis;
- raíces aplanadas contra las ramas;
- bulbos en media luna;
- glándulas de Bartolino con su conducto (pieza nueva), que se abre en el vestíbulo a las 5 y a las 7.
- La vagina queda abierta en el orificio, que es una hendidura de 8 × 5 mm; la uretra se estrecha a 2,4 mm en el meato.

**Músculos del periné** (`perineal_muscles`, desde `build_muscular.py`, solo en la mujer). Z-Anatomy no tiene los del triángulo urogenital, ni en el hombre ni en la mujer.
- Piezas: isquiocavernoso, bulboesponjoso, transversos superficial y profundo, compresor de la uretra, esfínter uretrovaginal, esfínter externo de la uretra, membrana perineal y cuerpo perineal (16 en total).
- Llevan el nombre oficial de la traducción de Z-Anatomy y la ruta «Músculos perineales › Espacio perineal superficial / profundo».
- Entran en las capas y en la separación entre músculos.
- Fichas en `musculos-fichas.js`; la membrana y el cuerpo perineal llevan la etiqueta «Tejido fibroso».
- En los dos modelos, el suelo de la pelvis (elevador del ano, coccígeo) y el esfínter externo del ano tienen ahora región; antes no tenían ninguna.

**Vulva sin parche** (`build_female_skin.py`, reescrito):
- La región de la vulva (el techo entre los muslos) se guarda en la piel femenina (atributo de cara «vulva», `fix_neck.py`).
- Al exportar `female.glb`, esa región se recorta y queda aparte, lisa («Skin_Vulva_Smooth»).
- La vulva la sustituye con el mismo borde: 1.600 vértices idénticos, normales del cuerpo en el borde y tono del cuerpo × un matiz por zona. No hay costura de forma, de normales ni de color.
- `main.js` muestra la piel lisa solo cuando no se ve la vulva (genitales ocultos o aún sin descargar).
- Relieve: subdivisión de las caras de la región (~0,25 mm), curvada con la interpolación de Phong.
  - Labios mayores de contorno elíptico (5 mm) con la hendidura entre ellos.
  - Labios menores, capuchón y glande.
  - Vestíbulo con el meato uretral y el orificio vaginal (9 mm de hondo, con el borde del himen).
- Problemas resueltos:
  - la piel tiene vértices duplicados en algunas filas, que dentro de la región eran bordes;
  - la línea proyectada en la piel zigzagueaba y la posición a lo largo de ella saltaba (relieve escalonado);
  - el borde de la región va en dientes de sierra (8 mm): el relieve se desvanece con una envolvente suave por dentro de él.
- Ficha propia «Vulva». Antes, el modelo femenino mostraba la de la piel del pene y del escroto.

**Verificado:**
- **Auditoría femenina:** 39 choques entre órganos, los mismos que antes.
  - Ninguna de las 18 piezas nuevas sale de la piel; los músculos solo tocan el hueso en sus inserciones (≤ 0,3 mm).
  - Simetría izquierda/derecha de las piezas del periné: diferencia ≤ 1,3 mm.
- **Auditoría masculina:** igual (36 choques, las mismas medidas).
- **Web:** sin errores de consola, en las vistas de piel (y con los genitales ocultos), muscular y urogenital.

**Pendiente:** el músculo bulboesponjoso, el isquiocavernoso y los transversos son formas paramétricas, no disecadas. ~~Al hombre le faltan los mismos músculos del periné.~~ Hecho el 2026-10-31 (ver «Periné masculino»).

## Fichas de todos los músculos, latín y fuentes (2026-11-01)

- **Fichas:** los 154 músculos que no tenían ficha propia la tienen ahora (`web/src/data/musculos-fichas-resto.js`): descripción, origen, inserción, acción, inervación y puntos clave.
  - Las cabezas, vientres y porciones de un músculo tienen ficha propia: las del bíceps, el tríceps, el gastrocnemio, el bíceps femoral, el masetero, el orbicular del ojo, el deltoides, el trapecio, el pectoral mayor y las nueve partes del erector de la columna, que antes compartían texto o la ficha del grupo.
  - Las fichas antiguas que no mostraban inervación (22, porque el modelo no la trae) u origen e inserción (8) los tienen ahora. La inervación y la acción de la ficha tienen prioridad sobre las del modelo, que en algunos músculos eran erróneas (el aductor del pulgar y el del dedo gordo venían con el nervio mediano y el ulnar).
  - Cada dato está contrastado con dos fuentes: el artículo de Wikipedia en inglés del músculo y la página de su región en TeachMeAnatomy. Los nombres, con la Terminologia Anatomica 2 (FIPAT, 2019). Las fichas antiguas se revisaron contra las mismas fuentes, sin errores.
- **Latín:** las 215 piezas (57 nombres) que no lo tenían lo tienen ahora (`LATIN_EXTRA` en `fuentes.js`; no hace falta reconstruir).
  - 45 nombres son términos oficiales: TA2 (16), TA98 (22, tablas de la IFAA) o la Terminologia Neuroanatomica (7, ten Donkelaar et al., 2018).
  - 1 usa el nombre latino de Z-Anatomy (*Frenula capsulae*, los retináculos de Weitbrecht de la cadera, sin término en TA).
  - 11 son subdivisiones del atlas cerebral de Destrieux u otras piezas sin término propio: su latín se forma con términos oficiales y la ficha lo dice.
  - El esfínter externo de la uretra usa el término de TA2 de cada sexo (*Sphincter externus urethrae masculinae/femininae*).
- **Fuentes en la ficha:** una sección «Fuentes», plegada al final, con enlaces (`.info-refs`).
- **Comprobación:** `node scripts/check-cards.mjs` (desde `web/`): 5.756 piezas, ninguna sin latín ni músculo sin ficha, inervación o fuentes.
- **Peso:** el código de la web pasa de 919 a 1.044 kB (280 kB comprimido) por los textos nuevos.

## Zonas de la piel (2026-11-01)

La piel era una sola pieza («Piel»): al tocarla se seleccionaba entera.

**Ahora `fix_neck.py` la divide al exportar** (`tools/skin_regions.py`), sin tocar las Fase 2, que guardan la piel entera para los sistemas.

**Zonas.** 36 en el hombre y 38 en la mujer (más la piel lisa de la vulva, que ya era aparte):
- **Cabeza:** cuero cabelludo, cara, párpados (izquierdo y derecho), nariz, labios y orejas.
- **Cuello.**
- **Tronco:** tórax, mamas (en la mujer), abdomen, espalda, región lumbar, glúteos y periné.
- **Miembro superior:** hombro, axila, brazo, codo, antebrazo y mano, de cada lado.
- **Miembro inferior:** muslo, rodilla, pierna y pie, de cada lado.

Los ojos ya eran piezas propias.

**Cómo se asigna cada cara de la piel.** Por referencias del esqueleto de la Fase 2:
- **Cabeza:** el plano de la mandíbula al occipital. Dentro de ella:
  - párpados alrededor de los globos oculares;
  - labios alrededor de los incisivos;
  - nariz donde la piel sobresale de la línea de las mejillas;
  - orejas donde la piel es una lámina fina y está lejos del hueso;
  - cara por delante de las orejas y bajo el nacimiento del pelo.
- **Miembros:** el hueso más cercano y planos perpendiculares a su eje en el hombro, el codo, la muñeca, la cadera, la rodilla y el tobillo.
- **Tronco:**
  - delante y detrás, separados por el centro de cada corte;
  - el reborde costal (curva ajustada a los cartílagos 7–10);
  - el ligamento inguinal, la 12.ª vértebra torácica, la cresta ilíaca y el pliegue glúteo;
  - la axila, donde la piel del hueco mira hacia abajo o de lado.
- **Limpieza:** un filtro de mayoría suaviza los bordes, y cada zona queda en un solo trozo. Así, la piel del muslo junto a los dedos no sale como «mano».

**Sin costuras:** cada pieza conserva las normales de la piel entera.

**En la web:**
- cada zona tiene su ficha en `anatomia.js`, con nombre latino de TA2 y fuentes (`fuentesPiel` en `fuentes.js`);
- la ruta de grupos va «Sistema tegumentario > Piel de la cabeza / del cuello / del tronco / del miembro superior / del miembro inferior» (`grupos.js`).

**Comprobado en el navegador:**
- un clic en el antebrazo selecciona «Piel del antebrazo»;
- la piel completa se ve continua;
- en la mujer, la nariz, las mamas y la vulva funcionan como antes;
- sin errores de consola.

## Región real de los vasos (2026-11-01)

La ficha de los vasos tomaba la región de las colecciones de Z-Anatomy, que no son regiones del cuerpo: todas las arterias de la cabeza, el cuello y el tronco están en «Aorta» (la arteria prefrontal decía «Región: Aorta»), y las de los miembros, en «Miembro superior/inferior».

`tools/vessel_regions.py` (Blender) calcula dónde está cada vaso:
- **Muestra:** hasta 400 vértices por vaso.
- **Encéfalo y corazón:**
  - encéfalo, si el punto está a menos de 2 mm de él, o a menos de 6 mm y dentro de la cavidad del cráneo (los rayos chocan con el cráneo en 11 de 14 direcciones);
  - «cavidad craneal», más lejos pero rodeado de cráneo;
  - corazón, a menos de 4 mm, solo en los vasos propios del corazón.
- **Hueso más cercano:** fuera de eso, cráneo → cabeza, vértebras cervicales → cuello, húmero → brazo, etc.
- **Correcciones con referencias del esqueleto:**
  - codo y rodilla;
  - cuello por debajo del hioides y por encima de la abertura superior del tórax;
  - axila;
  - abdomen por debajo del diafragma;
  - ligamento inguinal;
  - región glútea;
  - periné y genitales externos.
- **Resultado:** la región del vaso son las que reúnen al menos el 20 % de sus vértices.
- **Revisión:** la lista se revisó vaso a vaso. Lo que no encajaba se corrige en `OVERRIDES`, con el motivo; los senos de la duramadre se llevan a «cavidad craneal».

**Datos y resultado:**
- La tabla está en `web/src/data/regiones-vasos.js` (413 vasos, calculada en el hombre). En la mujer da lo mismo salvo 9 vasos en el límite del 20 %, igual de válidos.
- Ningún vaso de los dos modelos queda sin región ni con la de una colección (666 en el hombre, 656 en la mujer).
- Ejemplos:

| Vaso | Región |
|---|---|
| Arteria prefrontal | Encéfalo |
| Seno sagital superior | Cavidad craneal |
| Carótida interna | Cavidad craneal, cabeza y cuello |
| Gran vena safena | Pie, pierna y muslo |
| Arteria axilar | Axila |
| Arteria genicular media | Rodilla |

**Uso:**

```
Blender -b --factory-startup --python tools/vessel_regions.py -- male
```

Necesita `build/male_{arterial,venous,nervous,muscular}.blend`.

## Copia de seguridad (2026-11-01)

`zsh tools/backup.sh` guarda en `~/Copias de seguridad/Anato3D/AAAA-MM-DD_HHMM/` lo que no se puede regenerar:

- el historial de git en un archivo (`anato3d.bundle`, unos 300 MB);
- `sources/` (`sources.tar`), que no está en git;
- una sola vez, Blender comprimido (`../blender/`), porque los modelos se calibraron con esa compilación (5.4.0 alfa).

Cada copia lleva sus sumas de comprobación y un `RESTAURAR.md`. Probado: la copia se restauró en otra carpeta y el tejido conjuntivo reconstruido desde ella salió idéntico, byte a byte. La prueba encontró un fallo: `build_all.sh` no creaba `build/` en una copia recién clonada (corregido). La copia queda en el mismo disco, por decisión de Carlos: protege de borrados, no de que falle el disco.

## Revisión completa de errores (2026-10-31)

Encargo: «Busca todos los errores e intenta perfeccionarlos», tras llevar la uretra del hombre dentro del cuerpo esponjoso.

**Uretra masculina** (`GenitalPose.urethra_map`, en `anato3d_fit.py`; vale para todos los sistemas):
- Medida a lo largo de sus 121 anillos:
  - salía de la próstata por encima del bulbo;
  - cruzaba la unión de las raíces del pene (cuerpos cavernosos);
  - entraba en el cuerpo esponjoso 2,5 cm por delante del extremo posterior del bulbo, rozando su superficie.
- Ahora:
  - baja desde el vértice de la próstata (uretra membranosa, ~6 mm);
  - entra en el bulbo por su cara superior, a 1,2 cm de su extremo posterior;
  - sigue en su tercio superior, a 4–5 mm de profundidad, hasta unirse a su camino original;
  - 30 anillos recolocados (hasta 6,7 mm) y girados con la nueva tangente.

**Nombres** (`ES_FIXES`, `ES_OVERRIDES`):
- Las 5.756 piezas de los dos modelos se pasan en Node por las mismas funciones de fichas que la web.
- Sin títulos en inglés ni guiones bajos.
- Corregidas las erratas de la traducción de Z-Anatomy:
  - tildes: «angulo», «capsula», «fibula», «humero», «musculo», «oftalmica», «-faringeo», «multifido», «Linea alba», «Lingula», «Fornix», «interfalangeas»…;
  - tildes que sobraban: «calcáneocuboideo», «masétero»;
  - errata: «intertransvarios»;
  - 10 títulos con abreviaturas («art.», «m.», «lat.»…).

**Fuera del hueso:**
- Los vasos y nervios periféricos no se sacaban del hueso al construirse; tampoco el tejido conjuntivo ni las vísceras.
- Errores encontrados:
  - ramas calcáneas de la arteria fibular, enteras dentro del calcáneo (8,8 mm);
  - circunflejas humerales en el húmero (7,5 mm);
  - vasos testiculares en el pubis (7,7 mm);
  - bolsa del redondo mayor, entera dentro del húmero (7,8 mm).
- Arreglo (`anato3d_fit.py`), sin tocar los huesos del cráneo (`skull_bone`), por donde vasos y nervios van por conductos:
  - `push_tube_out_of_bone` saca vasos y nervios anillo a anillo, sin aplastarlos;
  - el conjuntivo (salvo los discos) y las vísceras, vértice a vértice.
- Resultado: vasos dentro del hueso fuera del cráneo, de 121 a 6.

**Cuello** (`fix_neck.py`):
- El disco C6–C7 quedaba dentro de C7: no había hueco entre los cuerpos vertebrales (0,2 mm; en Z-Anatomy, 4 mm).
- Causa: cada vértebra cervical tomaba el giro de su ajuste anterior, deformado (en zigzag, con diferencias de hasta 18°).
- Ahora hay un solo giro para todo el cuello: discos cervicales de 3,6–7,4 mm en los dos modelos.
- Solo cambian las 7 vértebras y la piel de la nuca.

**Otros:**
- tiroides femenina 1,5 mm bajo la piel (asomaba 3,2 mm);
- 4 regiones de las articulaciones con «Art.» abreviado: ahora «Articulaciones…»;
- epidídimo fuera del testículo (en Z-Anatomy, 47 % dentro).

**Picos en los pliegues** (`Fitter.keep_inside_skin` y `skin_out` de `build_visceral.py`):
- Vértices a 5–8 cm de la piel, dentro del cuerpo, se llevaban a la piel del pliegue entre las nalgas o de la axila.
  - Formaban picos de hasta 8 cm en el piriforme, el glúteo mayor, el ciático, el cutáneo femoral posterior, las fascias, el bíceps, el serrato, el mediano, la torácica lateral y las venas de la axila, en los dos modelos.
- Causa: «a menos de 1,5 mm de la piel» se medía solo con la normal de la cara más cercana, que en un pliegue queda casi perpendicular. Ahora también se exige la distancia.
- Resultado: las parejas izquierda/derecha afectadas coinciden ahora a ≤ 2 mm (antes, hasta 68 mm).

**Nodos linfáticos entre órganos:**
- Los órganos cercanos se buscan en cada intento de sacar un nodo, hasta 8; antes, solo con su posición inicial y 3 intentos.
- Resueltos los nodos retrovesicales en la vejiga y el sigma, el del ligamento arterioso en la pleura, los cólicos derechos en el colon transverso y los retrofaríngeos en el paladar.

**Auditoría masculina** (antes → después):
- choques entre órganos 36 → 30, ninguno nuevo;
- más de un 3 % dentro del hueso: conjuntivo 185 → 3, arterias 89 → 42, venas 36 → 8, nervios 34 → 26. Lo que queda de vasos y nervios es casi todo del cráneo, donde van por conductos.

**Web:**
- Carrera al cambiar de modelo durante una descarga: las piezas del modelo anterior acababan en el nuevo. Ahora un número de carga lo impide (`viewer.generation`, `loadSeq`).
- Fichas corregidas:
  - cricotiroidotomía: se hace por encima del cricoides, no por debajo;
  - origen del psoas mayor;
  - osificación del grande (carpo);
  - giro supramarginal;
  - ficha propia del núcleo pulposo y dato del bulbo del pene.

## Periné masculino (2026-10-31)

Z-Anatomy tampoco tiene en el hombre los músculos del triángulo urogenital: solo el suelo de la pelvis y el esfínter externo del ano.

**Cómo** (`tools/male_perineum.py`, nuevo; usa los generadores de `female_perineum.py`):
- **Sobre los órganos de Z-Anatomy, no con medidas supuestas:**
  - raíces de los cuerpos cavernosos, bulbo del cuerpo esponjoso, uretra y próstata;
  - `build_muscular.py` los ajusta igual que `build_visceral.py` (misma pose genital y suavizado), sin reducir.
- **Cada músculo envuelve el órgano que cubre:**
  - el órgano se corta con planos a lo largo de su eje y cada corte se mide cada 5°;
  - la lámina sigue ese perfil a 0,4 mm;
  - con elipses salían bloques planos y separados del bulbo.
- **Los extremos se afilan** (arco y grosor). `shell()` admite ahora ángulos que varían a lo largo del músculo, marcos dados y perfil por ángulo; la mujer sale igual.
- **Lo que quede dentro de un órgano** se saca a su superficie (+0,4 mm) en dos rondas, con suavidad.

**Piezas (11):**
- **Isquiocavernoso:** cubre la cara libre de cada raíz, de la unión de las raíces hacia la tuberosidad.
- **Bulboesponjoso:** dos mitades unidas por el rafe bajo el bulbo, desde el cuerpo perineal; sigue 1 cm sobre el cuerpo esponjoso, adelgazándose.
- **Transversos superficial y profundo del periné.**
- **Membrana perineal:**
  - una sola lámina de rama a rama (en la mujer son dos);
  - va sobre las raíces y el bulbo y bajo la próstata y la uretra.
- **Esfínter externo de la uretra:**
  - funda en herradura abierta hacia atrás sobre el vértice de la próstata, por donde sale la uretra, hasta el 60 % de su altura;
  - en Z-Anatomy la próstata se apoya en el bulbo y falta la uretra membranosa (1–2 cm), así que no cabe un anillo propio alrededor de la uretra;
  - un primer intento salía arrugado entre el bulbo, la próstata y la unión de las raíces.
- **Cuerpo perineal:** entre el bulbo y el esfínter externo del ano.

**Web:**
- cada pieza lleva `sex`;
- `musculos.js` busca primero la ficha de su sexo («Bulbospongiosus_muscle@male»);
- las fichas masculinas están en `musculos-fichas.js`.

**Nombre del esfínter externo de la uretra:**
- no tenía nombre en español ni en latín en ninguno de los dos modelos; la ficha de la mujer salía en inglés desde el 2026-10-31;
- Z-Anatomy solo lo traduce como «Male/Female external urethral sphincter (part of muscular system)»;
- ahora va en `ES_OVERRIDES` y en `LA_OVERRIDES` (`anato3d_fit.py`).

**Verificado:**
- **Piezas:**
  - todas cerradas; ninguna sale de la piel; en el hueso, ≤ 0,1 mm;
  - dentro de un órgano, solo el 3 % del bulboesponjoso y del isquiocavernoso derechos, donde la raíz y el bulbo se tocan;
  - simetría ≤ 1,5 mm, salvo el isquiocavernoso (4,2 mm), porque las raíces de Z-Anatomy ya son asimétricas.
- **Separación entre músculos:** solo mueve puboanales y semimembranosos (≤ 1,2 mm).
- **Auditoría masculina:** los mismos 36 choques; 2.870 objetos.
- **Modelo femenino:** `female_perineum.py` da exactamente las mismas piezas que antes.
- **Web:**
  - fichas masculinas;
  - capas superficial, intermedia y profunda vistas desde abajo;
  - sin errores de consola; `npm run build` correcto.

**Pendiente** (de Z-Anatomy):
- ~~la uretra va pegada por encima del cuerpo esponjoso en la raíz del pene (2–3 mm), en vez de por dentro;~~ Corregido el 2026-10-31 (ver «Revisión completa de errores»);
- el esfínter externo del ano queda ~2 cm por encima de la piel y no hay conducto anal.

## Pelvis femenina (2026-10-30)

La pelvis del modelo femenino era la masculina con las proporciones de la piel de la mujer: una pelvis androide (estrecho superior acorazonado, arco del pubis de 54°, espinas ciáticas a 8,0 cm, coxal más alto que en el hombre). `tools/female_pelvis.py`, llamado desde `fix_neck.py`, le da forma ginecoide.

- **Deformación de los huesos:**
  - se detectan referencias en coxales, sacro y cóccix: acetábulo, sínfisis, tubérculo del pubis, pecten, línea arcuata, articulación sacroilíaca, alas y vértice del sacro, cóccix, espina y tuberosidad isquiáticas, rama isquiopubiana, cresta y espinas ilíacas;
  - cada referencia lleva un desplazamiento en mm (`DESIGN`), con su imagen especular;
  - un spline poliarmónico (r³ con parte lineal) lo extiende a los tres huesos;
  - al ser una sola función, las articulaciones sacroilíacas y la sínfisis siguen encajadas;
  - acetábulo y base del sacro quedan fijos (menos de 2 mm y 0,3 mm): fémures y columna lumbar no se mueven.
- **Lo demás la sigue:**
  - un campo armónico en el volumen (`musculature.Field.solve` con `box` y `bone_disp`) vale la deformación en la pelvis y cero en los demás huesos y en la piel;
  - se guarda con los huesos sin deformar en `Anato3D_Female_30_Fase2_pelvis.npz`;
  - `anato3d_fit.Fitter` ajusta con esos huesos (el coxal deformado ya no es afín al de Z-Anatomy) y después suma el campo;
  - en el hueso, el campo coincide con la deformación: 0,05 mm de mediana y 1,2 mm como máximo.
- **Órganos pélvicos:** `female_organs.py` los coloca sobre las referencias de la pelvis nueva.
  - El útero queda en anteversión 70° y anteflexión 15° (antes, 65° y 10°): es la más próxima a la habitual (90° y 20°) con el fondo detrás del pubis.
  - Ovarios 6 mm más afuera; raíces del clítoris abiertas con el arco del pubis; vestíbulo 5–7 mm más adelante.

| Medida (`pelvimetry`) | Antes | Después |
|---|---|---|
| Arco del pubis | 54° | 88° |
| Entre espinas ciáticas | 8,0 cm | 10,1 cm |
| Estrecho superior, ancho | 12,7 cm | 13,6 cm |
| Conjugada obstétrica | 9,8 cm | 10,1 cm |
| Sínfisis–cóccix | 8,1 cm | 9,3 cm |
| Sacro (ancho × largo) | 11,0 × 10,1 cm | 11,9 × 9,6 cm |
| Altura del coxal | 20,4 cm | 19,2 cm |

**Verificado:**
- **Modelo masculino:** sale idéntico (mismos GLB).
- **Auditoría femenina:**
  - 39 choques entre órganos (antes 38); el nuevo es un solape del 4 % entre los nodos posvesicales y la vejiga;
  - las trompas ya no entran en el hueso;
  - el glúteo mayor izquierdo aparece a 2,7 mm dentro del hueso, pero es un falso positivo de la normal del sacro (malla abierta): por paridad no entra más de 0,3 mm.
- **Web:** carga la pelvis nueva y la vulva sigue en su sitio.

**Fallo corregido:** al cargar la Fase 2 junto a Z-Anatomy, el sacro se llama `Sacrum.001` y el ajuste no encontraba su versión sin deformar. Quedaba fuera de la guía del ajuste (5,7 mm de error afín). Ahora se busca sin el sufijo.

**Pendiente:** la conjugada obstétrica sigue corta (10,1 cm; en la mujer, ~11–12). Alargarla movería la sínfisis hacia la piel del pubis (le quedan 2,7 cm) o la base del sacro, sobre la que va L5.

## Modelo femenino (2026-10-30)

Primera versión del modelo femenino con los 12 sistemas, para perfeccionar después. Se construye igual que el masculino:

```bash
# Fase 2 femenina (piel + esqueleto): la escribe fix_neck.py junto con la masculina.
/Applications/Blender.app/Contents/MacOS/Blender -b --disable-autoexec Anato3D_Male_30_Fase2.blend --python tools/fix_neck.py
# Sistemas, piel de la vulva e índice de búsqueda (build/female_*.blend → web/public/models/female-*.glb):
A3D_MODEL=female zsh tools/build_all.sh
```

**Esqueleto** (`tools/female.py`, llamado desde `fix_neck.py`). Z-Anatomy es un cuerpo masculino y no hay en datos abiertos un esqueleto femenino con su estructura. Pero las pieles masculina y femenina de MakeHuman tienen la misma malla, vértice a vértice.
- Un campo armónico en el volumen (`musculature.Field`, rejilla de 8 mm) lleva la piel masculina a la femenina. Se usa la piel masculina tras corregir cuello y extremidades, antes de la complexión musculosa (solo del hombre).
- El desplazamiento que mueve los huesos no lleva las mamas (se rellena con Laplace) y está suavizado (40 pasadas, ~9 cm). Sin ello, las mamas doblaban las costillas 5–8 y la tibia se cizallaba hasta 2 cm.
- Cada hueso es la transformación afín que mejor sigue al campo; los huesos largos, una por trozo de ~6 cm, unidas en ±5 mm. Mayor separación del campo: 7,2 mm (tibias).
- Así cada hueso sigue siendo una transformación afín de Z-Anatomy y `anato3d_fit.py` ajusta músculos, vasos, nervios y vísceras al esqueleto femenino igual que al masculino.
- Resultado: 258 huesos dentro de la piel femenina (1,574 m), con las mismas comprobaciones de distancia a la piel que el hombre. La pelvis toma las proporciones de la piel (más ancha); su forma propia, después (ver «Pelvis femenina»).

**Sistemas** (`A3D_MODEL=female`, `anato3d_fit.MODEL`): mismos scripts, sin la complexión musculosa ni las piezas que solo tiene el hombre (`male_only`: pene, testículos, epidídimo, escroto, cordón espermático, próstata, vesículas seminales, conducto deferente, glándulas bulbouretrales y la uretra masculina).

**Órganos femeninos** (`tools/female_organs.py`, desde `build_visceral.py`). Z-Anatomy no los tiene: son formas paramétricas con medidas de adulta nulípara, colocadas sobre referencias de la pelvis (sínfisis, promontorio, espinas ilíacas, tuberosidades, línea arcuata), de la vejiga y de la piel.
- Útero en anteversión y anteflexión sobre la vejiga; vagina de 8 cm, hacia arriba y atrás; ovarios en la fosa ovárica; trompas con sus fimbrias; ligamentos redondos y propios del ovario; uretra femenina.
- Clítoris (glande, cuerpo y raíces), bulbos del vestíbulo y glándulas vestibulares mayores. El vestíbulo queda a la altura de la piel del periné.
- Glándulas mamarias: una lente bajo el relieve de la mama de la piel (8 mm bajo ella, 3 mm tras el pezón), sobre el pectoral, del borde del esternón a la línea axilar media y de la 2.ª a la 6.ª costilla, con prolongación axilar y 15 lóbulos. Además, 14 conductos galactóforos por lado.

**Piel de la vulva** (`tools/build_female_skin.py`). La piel de MakeHuman tiene el pubis liso. Es una copia subdividida de la piel del cuerpo alrededor de la línea de la vulva, con relieve a lo largo de la normal. Asoma solo donde hay relieve y en el borde se hunde bajo la piel. Una función de distancia, como la de la piel genital masculina, sacaba los labios por los muslos.
- Labios mayores y menores a lo largo de la línea de la vulva, sobre la piel, y capuchón del clítoris.
- Color propio («Tono»).
- Con «Mostrar genitales externos» desactivado se ocultan enteros, como en el hombre, la piel de la vulva y los genitales externos profundos.

**Web:** el selector Masculino/Femenino carga `female-*.glb` y el índice de búsqueda `female-index.json`; fichas en español de los órganos femeninos (`visceras.js`).

**Verificado:**
- **Web:** carga los 12 sistemas sin errores de consola. El buscador incluye útero, ovarios, mamas y vulva, sin piezas masculinas. Con «Mostrar genitales externos» desactivado, la piel queda lisa.
- **Auditoría (`A3D_MODEL=female`):**
  - 38 choques entre órganos (36 en el hombre). Los que no tiene el hombre son solapes pequeños (2–10 %) entre órganos de Z-Anatomy; ninguno con los órganos femeninos.
  - Las venas pudendas externas y la rama genital del genitofemoral iban al escroto, fuera de la piel. En la mujer se corrigen por la piel (`build_vascular.py`, `build_nervous.py`).
  - Los órganos internos femeninos que asomaban (el extremo de la vagina) se meten 1,5 mm bajo la piel.

**Pendiente (para perfeccionar):**
- ~~**Pelvis:** tiene las proporciones de la piel femenina, no la forma de una pelvis femenina.~~ Hecho (ver «Pelvis femenina»). Sigue algo corta de delante atrás, así que el útero queda más vertical de lo habitual.
- ~~**Vulva:** primera versión, con relieves bajos; el borde del parche se notaba; genitales profundos simples.~~ Rehecha el 2026-10-31 (ver «Vulva, genitales externos profundos y músculos del periné»).
- **Mamas:** las forma la piel de MakeHuman. La glándula es una lente bajo ella, sin la grasa ni los ligamentos de Cooper.
- **Cabeza:**
  - Los labios de la piel femenina quedan entreabiertos: se ven los dientes.
  - La auditoría marca algunos músculos del ojo y nodos retrofaríngeos junto a las cavidades.
- ~~**Músculos:** los del periné son los de Z-Anatomy (masculinos), ajustados a la pelvis femenina.~~ Era impreciso: Z-Anatomy no tiene los del triángulo urogenital. Hecho el 2026-10-31 (ver «Vulva, genitales externos profundos y músculos del periné»).

**Arreglos que afectan también al hombre:**
- **Tramos de la tibia** (`anato3d_fit._segments`): al unir un primer tramo pequeño con el siguiente, se duplicaba el segundo y se perdía el último (el distal, junto al tobillo). Le pasaba a las dos tibias masculinas. Con dos tramos fallaba (así apareció en la mujer).
  - Se reconstruyeron los sistemas masculinos. Cambian solo estructuras de la pierna y el pie: tendones y músculos hasta 6,8 mm, arterias tibial posterior y tarsiana lateral hasta 8,6 mm. La auditoría masculina sigue con los mismos 36 choques.
- **Auditoría:** `A3D_MODEL=female` audita el modelo femenino (`build/female_audit.json`).

## Revisión en cinco pasadas (2026-10-29)

Cinco recorridos del modelo, cada uno con vistas anterior, posterior y lateral y detalles:
1. **Sistema muscular**, en sus tres capas.
2. **Esqueleto y tejido conjuntivo**, con medidas de las articulaciones del hombro tras subirlo:
   - clavícula–esternón 0,1 mm;
   - clavícula–acromion 0,3 mm;
   - húmero–glena 1,6 mm;
   - escápula–costillas 14 mm (antes 15).
3. **Vasos y nervios.**
4. **Vísceras, piel y genitales.**
5. **Uso de la web** en escritorio y móvil.

**Errores encontrados y corregidos:**
- **Vista muscular sin ligamentos:** en el estado inicial (tejido conjuntivo en «Cartílagos»), al encender el sistema muscular se perdían la línea alba y los retináculos, y entre los rectos se veía la columna.
  - El contexto solo se aplicaba con su sistema apagado. Ahora se suma a la capa que tenga.
- **Opción «Mostrar genitales externos» desactivada:** el recorte por la región dejaba a la vista, en el pubis, la sección hueca de la raíz del pene. Los cuerpos cavernoso y esponjoso y el glande se ocultan enteros.
- **Solapes entre órganos** (`build_visceral.py`): 75 grupos de nodos linfáticos salen, enteros, de los órganos en que estaban hundidos.
  - Entre órganos de grupos distintos cede el más pequeño. Así se separan:
    - la suprarrenal, del riñón, el bazo y el hígado;
    - el colon y sus tenias, del riñón y el páncreas;
    - las vesículas seminales, del sigma;
    - los aritenoides, del esófago;
    - el timo, de la pleura.
  - Dentro de un grupo hay continuidades y uniones reales y no se tocan. Con todos los pares, la úvula salía del paladar blando y las glándulas salivales de la encía.
  - Auditoría: choques de 63 a 36. Los que quedan son, casi todos, naturales: nodos intraglandulares de la parótida, nodos de los mesos, epidídimo, paratiroides, conductos.
- **Teclado:** el atajo fallaba si el destino del evento no era un elemento.
- **Selector de modelo:** sin nombre accesible en pantallas estrechas.

**Revisado y correcto:**
- El ligamento rotuliano está en el tendón del cuádriceps (Z-Anatomy no lo separa).
- La «escalera» del muslo es la arteria femoral profunda con sus perforantes.
- El pene, con la piel, cuelga con normalidad (sin piel parecía un gancho).
- Los músculos occipitales son láminas rectangulares en Z-Anatomy (se ven así).

## Auditoría (`tools/audit_models.py`)

```bash
/Applications/Blender.app/Contents/MacOS/Blender -b --disable-autoexec Anato3D_Male_30_Fase2.blend --python tools/audit_models.py
```

Mide en cada pieza de cada sistema:
- qué sale de la piel, y si se ve desde fuera o solo hacia la boca, la nariz o los ojos;
- cuánto se mete en los huesos;
- choques entre órganos;
- caras de área nula y mallas invertidas;
- nombres sin traducir o con erratas;
- niveles vertebrales de los órganos.

Escribe `build/audit.json`.

- **Dentro de hueso:** se mide con la cara más cercana y su normal, no con paridad de rayos, porque algunos huesos son mallas abiertas (el sacro).
  - 419 de las 451 piezas que entran más de 1 mm ya lo hacen en el Z-Anatomy original.
  - Varias son correctas: la cóclea en el temporal, el nervio alveolar inferior en el conducto mandibular.
- **Piel genital:** es una malla abierta.
  - Cuenta como «dentro» solo a menos de 2 cm de ella. Lejos, la normal de su cara más cercana contesta al azar, y hasta el 2026-10-27 eso daba por cubiertos los dientes y los ojos.
  - Para «visible desde fuera», el rayo tiene que escapar también de ella.
- **Más de 6 mm dentro de un hueso cerrado:** se confirma por paridad en ese hueso. La normal de la cara más cercana de un hueso fino (una costilla, el ala ilíaca) puede apuntar al revés lejos de él. Salían venas y fascias «a 32–44 mm» dentro del hueso sin estarlo.
- **Fase 6 frente a antes:** la proporción dentro de hueso por sistema no cambió al bajar la rodilla y el codo (músculo 1,35 → 1,34 %; ligamentos y fascias 4,96 → 5,17 %, con menos piezas por encima del 3 %).

## Problemas conocidos del modelo masculino Fase 2

- Las piezas izquierdas (`_L`), el vómer y el ojo derecho tienen las caras invertidas, porque se
  crearon en espejo. El visor las corrige al cargarlas: detecta el volumen con signo negativo e
  invierte esas mallas.
- Su textura de oclusión ambiental (canal R de la ORM) se horneó con esas caras invertidas y sale
  oscura, así que el visor la omite en esas piezas. **Arreglo definitivo:** en Blender, invertir las
  normales de esas mallas (*Recalculate Outside*), re-hornear sus texturas y volver a exportar.

## Créditos y licencias

- Huesos y cartílagos: [Z-Anatomy](https://github.com/Z-Anatomy/Models-of-human-anatomy)
  (CC BY-SA 4.0), derivado de [BodyParts3D](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html)
  © DBCLS. Los modelos derivados deben mantener la licencia CC BY-SA y la atribución.
- Piel: MakeHuman.
- Iconos: [Health Icons](https://healthicons.org) (sistemas) y [Lucide](https://lucide.dev) (interfaz).
  Tipografía: IBM Plex Sans y Serif (SIL Open Font License).
- No se usa ningún recurso de Complete Anatomy (modelos, iconos ni textos); solo se toma la idea
  general de la interfaz.

Anato3D es una herramienta educativa y no sustituye la consulta con profesionales de la salud.
