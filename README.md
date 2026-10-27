# Anato3D

App educativa de anatomía humana en 3D, para todo público. Interfaz inspirada en Complete Anatomy:
una barra inferior con todos los sistemas, cada uno con capas (etapas) que se recorren con un toque.

## Ejecutar

```bash
npm --prefix web install
npm --prefix web run dev
```

Abre http://localhost:5173 (o el puerto que indique Vite). Para producción: `npm --prefix web run build` (salida en `web/dist`).

## Estructura

| Ruta | Qué es |
|---|---|
| `*.blend`, `*.glb` (raíz) | Modelos fuente. Fase 1 = piel + ojos; Fase 2 (masculino) = esqueleto completo. |
| `tools/` | Scripts de Blender: `fix_neck.py`, `anato3d_fit.py` (ajuste compartido), `build_muscular.py`, `build_connective.py`, `build_vascular.py`, `build_nervous.py`, `build_visceral.py`, `build_genital_skin.py`, `export_glb.py`, `build_all.sh` (regenera todos los sistemas) y `audit_models.py` (busca errores medibles en los modelos). |
| `sources/originals/` | Copia de los modelos tal como estaban antes de corregir el cuello. |
| `sources/z-anatomy/` | Z-Anatomy descargado, con su traducción oficial (`translations.csv`) y TA2. No se publica. |
| `build/` | Resultados intermedios (`male_muscular.blend`, estadísticas). |
| `web/public/models/` | GLB que sirve la app: `male.glb`, `female.glb`, y uno por sistema (`male-muscular`, `male-connective`, `male-arterial`, `male-venous`, `male-nervous`, `male-respiratory`, `male-digestive`, `male-urogenital`, `male-endocrine`, `male-lymphatic` y `male-integumentary`, la piel de los genitales), que se descargan al activarlos. |
| `web/src/systems.js` | Los 12 sistemas de la barra, sus capas y cómo se clasifica cada pieza. |
| `web/src/data/anatomia.js` | Fichas en español: nombre, latín (TA), etimología, descripción y puntos clave. |
| `web/src/data/resolve.js` | Convierte el nombre de un objeto (`Rib_7_L`) en su ficha (`Séptima costilla`, lado, FDI…). |
| `web/src/data/musculos*.js`, `conectivo.js`, `vasos.js`, `nervios.js`, `visceras.js`, `latin.js` | Fichas de músculos y de tejido conjuntivo, y glosario latino para generar etimologías. |
| `web/src/data/grupos.js` | Regiones de la ruta jerárquica (los grupos musculares llegan en `male-muscular.json`). |
| `web/src/viewer.js` | Escena three.js: carga Draco, materiales, brillo de selección, cámara. |
| `web/src/main.js` | Estado de la app (capas, ocultar/aislar/transparentar, deshacer), barra y paneles. |

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
- **Testículos:** tamaño adulto (4,5 × 2,7 × 2,5 cm, unos 16 ml). Bajan 8 mm el derecho y 16 mm el izquierdo, que cuelga más bajo. El polo superior queda inclinado hacia delante y afuera.
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
- **Unión con el cuerpo:** unión suave con la piel de MakeHuman donde nacen el pene y el escroto. La franja que la toca se hunde 1,2 mm, así que no queda borde, rendija ni parpadeo.
- **Tono:** más pigmentado que el tronco y más oscuro en el escroto, en los surcos y en el rafe. Junto a la unión, el mismo tono de la piel del cuerpo.

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
