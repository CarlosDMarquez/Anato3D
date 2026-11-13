# Hito 9 — Sistema linfático: ganglios con forma, tamaño y sitio

Fecha: 2026-11-12. Base: commit `aec19a9` (cambios sin commit). Encargo de Carlos (2026-11-11): «creo que se te olvidó
poner bien a los nodos/ganglios linfáticos en el programa … perfecciona lo del sistema linfático». Referencia visual:
ganglios ovalados en cadena junto a la vena yugular interna. Todo es **borrador sin revisión médica**.

La primera parte trata los **ganglios**; la segunda (2026-11-12, tarde), los **conductos, troncos y colectores**, que no
existen en Z-Anatomy y se generan sobre el propio modelo: secciones «Conductos», «Colectores», «Simplificaciones
declaradas» y «Comprobaciones».

## Método

- Código: `tools/lymphatics.py` (nuevo), llamado desde `tools/build_visceral.py` al final, cuando los demás órganos
  viscerales ya están separados entre sí. Los nodos siguen pasando por `Extractor.fit` como antes (así el reparto del
  presupuesto de caras no cambia y los otros cuatro sistemas viscerales salen idénticos: comprobado con `cmp`, solo
  cambian `<modelo>-lymphatic.glb` y el índice).
- Se reconstruye con el paso normal: `zsh tools/build_all.sh visceral` y `A3D_MODEL=female zsh tools/build_all.sh visceral`
  (unos 35 min por modelo; casi todo es la colocación de los 657 ganglios contra 452 músculos).
- Por cada ganglio (cada esfera de Z-Anatomy) se toma su centro, ajustado con el mismo `Fitter.deform` que el resto, y:
  1. **Forma**: elipsoide algo arriñonado con un hilio discreto (92 vértices, normales suaves). Proporción largo : medio :
     corto ≈ 1 : 0,62 : 0,45; variación de ±12 % sembrada con el nombre (crc32: igual en cada construcción).
  2. **Tamaño**: eje largo por grupo (`SIZES`), dimensiones del **modelo** dentro del intervalo normal publicado, no
     medidas de un cuerpo (p. ej. yugulodigástrico 14 mm, cervicales profundos 9–10, axilares 9–11, lumbares 10, inguinales
     superficiales 12, faciales 4–5, paraesternales 4).
  3. **Orientación**: el eje largo sigue el vaso vecino (a menos de 1 cm) o el eje principal del grupo; el hilio mira al
     vaso; en los superficiales el eje corto apunta a la piel.
  4. **Colocación**: cada ganglio se mueve entero, lo mínimo, hasta quedar fuera del hueso, ≥ 1 mm bajo la piel, fuera de
     los órganos cerrados (salvo intraglandulares, mesos e intrapulmonares), fuera de la luz de arterias y venas (curvas de
     «5: Cardiovascular system» ajustadas exactamente como en `build_vascular.py`) y fuera de los músculos
     (`build/<modelo>_muscular.blend`). Si dos se solapan, se encogen (nunca por debajo del 60 %) o se separan ≤ 2 mm.
     Los grupos pares se mueven en espejo.
  5. **Recolocaciones de grupo** (esquemáticas, de manual, declaradas): lumbares a su lado de la aorta o de la cava;
     supratrocleares por encima del epicóndilo medial; lacunares en la laguna vascular (medial, intermedio y lateral a los
     vasos ilíacos externos al final de estos); inguinales profundos por dentro de la vena femoral; submentonianos entre los
     vientres anteriores del digástrico y bajo el milohioideo; inguinales superficiales hundidos más de 12 mm, al tejido
     subcutáneo.
- Informes en `build/linfatico/`: `inventario.json`, `nodos-<modelo>.json` (centro, ejes, semiejes, lo que se movió y lo
  que queda fuera de regla) y `relaciones-<modelo>.json` (relaciones de la tabla de territorios medidas en el modelo).
- Capturas, con Blender en segundo plano: `tools/checks/linfatico_capturas.py` → `build/linfatico/capturas/`.

## Inventario

Tabla completa (objeto de Z-Anatomy → pieza → región → lado → n.º de ganglios → nombre es/la), para los dos modelos, en
`build/linfatico/inventario.json`. Resumen (igual en hombre y mujer):

| Región (TA2, por la jerarquía de Z-Anatomy) | Piezas | Ganglios |
|---|---|---|
| Cabeza | 18 | 50 |
| Cuello | 24 | 92 |
| Miembro superior | 20 | 88 |
| Tórax | 16 | 127 |
| Abdomen | 32 | 140 |
| Pelvis | 28 | 122 |
| Miembro inferior | 20 | 38 |
| **Total** | **158** (antes 139) | **657** (antes 637) |

- **Nodos nuevos** (11 objetos que Z-Anatomy esconde entre paréntesis, inconstantes en la TA2; 19 piezas, 20 ganglios):
  `Proximal_deep_inguinal_node_L/_R`, `Intermediate_deep_inguinal_node_L/_R`, `Medial/Intermediate/Lateral_lacunar_node_L/_R`,
  `Anterior_tibial_node_L/_R`, `Posterior_tibial_node_L/_R`, `Fibular_node_L/_R`, `Suprapyloric_node`, `Subpyloric_nodes` (2),
  `Retropyloric_nodes`. Todos tenían malla válida; nombres es/la de la TA2 (`lymphatics.HIDDEN`).
- **Clasificación**: la región sale ahora de la jerarquía de Z-Anatomy (que sigue la TA2) y no de palabras del nombre.
  Cambian `Subaortic_nodes` (abdomen → pelvis, ilíacos comunes) y `Submandibular_nodes_L/_R` y `Submental_nodes_L/_R`
  (cabeza → cuello, como en la TA2).
- Las 139 piezas anteriores conservan su nombre (las lecciones usan 49).

## Ganglios

Medido en el modelo construido (`build/linfatico/nodos-<modelo>.json`, `relaciones-<modelo>.json`) y en el **GLB
publicado** (`tools/checks/linfatico_glb.py` → `build/linfatico/glb-<modelo>.json`):

- 657 ganglios, 92 vértices cada uno; eje largo / objetivo del grupo: mínimo 0,53, mediana 0,94, máximo 1,12 (ninguno fuera
  del intervalo permitido: 60 % × (1 − 12 %) a 112 %). GLB: 0,82 → 0,58 MB (hombre), 0,83 → 0,59 MB (mujer).
- Relaciones de la tabla de territorios (cumplen/total, hombre · mujer): cadena cervical profunda 17/24 · 16/24 (antes
  22/24 con esferas: las que fallan son anteroinferiores, a ≤ 2,2 mm de la yugular pero por detrás del borde del
  esternocleidomastoideo); submentonianos 4/8 · 4/8 (antes 0/8); cubitales 20/22 · 22/22; paraesternales 16/16; celíacos
  4/4; inguinales superficiales 20/20 (antes 12/20); inguinales profundos 2/4 · 2/4 (el intermedio queda por delante de la
  vena, a 0,5 mm, no por dentro); poplíteos 6/8; retrofaríngeos 4/4 (antes 0/4); lumbares 34/34 (antes 25/34); ilíacos y
  lacunares 65/65 (antes 59/65); axilares 36/36 (antes 16/36).
- Quedan fuera de regla tras colocar (hombre · mujer): luz de un vaso 23 · 27 ganglios (casi todos < 0,8 mm), músculo
  21 · 31, órgano 14 · 9, hueso 1 · 0. Los mayores: `Anterior_tibial_node` 25 mm (hombre) y 22 mm (mujer) dentro de los
  músculos de la pierna (la arteria tibial anterior del modelo va por dentro del músculo); `Supratrochlear_nodes` k2 en la
  mujer, 8,6 mm; `Anterior_inferior_jugular_nodes_R` k0 en la mujer, 7,7 mm; el resto ≤ 4 mm.
- Simetría (GLB): 49 de 53 parejas a ≤ 2 mm; `Anterior_inferior_jugular_nodes` 14,9 / 13,0 mm y, en la mujer,
  `Lateral_superior_jugular_node` 9,0 mm: no cabían en espejo junto a las yugulares del modelo (marcados «asimétrico»).
- Esquemático (declararlo en las fichas): tamaños del modelo; recolocaciones de grupo del Método (lumbares, lacunares,
  inguinales profundos y superficiales, supratrocleares, submentonianos).
- Web: capas del linfático «Completo» (primera), «Nodos y vasos», «Conductos y troncos», «Órganos»; venas principales como
  contexto (`systems.js`); perfil `lymph` para `MAT_Lymph_Vessel`/`MAT_Lymph_Duct` (`realism.js`).
- Capturas: `build/linfatico/capturas/` (cuello izquierdo y derecho, submentón, axila, tórax posterior, abdomen, ingle,
  cuerpo; mujer: cuello, ingle, espalda).


## Conductos

Código: `tools/lymphatics.py`, `build_vessels(ctx)` (clase `Lymph`), llamado al final de la parte linfática de
`build_visceral.py`. Nada usa coordenadas fijas: cada punto de paso se mide en el modelo (centro y cara anterior del
cuerpo de cada vértebra L3–C6 de la Fase 2; ejes y radios de aorta, ácigos, cava, yugulares internas, subclavias y
carótida común izquierda tal como se publican, `Vessels`; corte del esófago). Los puntos de paso de la cisterna y del
conducto torácico se eligen **a la vez** por programación dinámica (`Lymph.column`): en cada nivel, una rejilla de ±7–9 mm
con coste = lo que se mete en hueso, luz de vasos u órganos (hueso y vasos grandes ×4) + distancia al sitio preferido, y
penalización por el desvío lateral entre niveles (sin zigzag). Después cada eje se aparta de los obstáculos
(`Router.relax`) y se comprueba anillo a anillo.

Piezas (grupo «Lymphatic_trunks_and_ducts», `subsystem` `vessels`, `major` true, material `MAT_Lymph_Duct`):

- `Cisterna_chyli`: saco fusiforme de 50 mm, de L2 − 12 mm a L1 + 10 mm, a la derecha y por detrás de la aorta, apoyado
  en los cuerpos vertebrales (retrocrural); 6 mm de ancho y 4,8 de delante atrás en el centro, 3,8 en los polos.
- `Thoracic_duct`: nace dentro de la cisterna, sale por su polo superior, pasa entre la aorta y la ácigos (T12–T7, a la
  derecha de la línea media), detrás del esófago, cruza a la izquierda detrás de él (T6–T5), sube por su borde izquierdo,
  hace el arco cervical a la altura de C7 por detrás de la vaina carotídea y baja hasta tocar el ángulo venoso izquierdo
  por detrás. 3,4 mm de calibre, 4,2 en los extremos, con un abombado del 10 % cada 18 mm (válvulas).
- `Right_lymphatic_duct`: 15 mm, del punto de unión de los tres troncos derechos al ángulo venoso derecho; 3 mm.
- `Jugular_trunk_L/_R`: del ganglio más bajo de la cadena cervical profunda inferior, junto a la yugular interna.
- `Subclavian_trunk_L/_R`: del ganglio apical axilar más medial, junto a la vena axilar y la subclavia.
- `Bronchomediastinal_trunk_L/_R`: del ganglio paratraqueal o braquiocefálico más alto de su lado.
- Los tres izquierdos terminan en el final del conducto torácico; los tres derechos forman el conducto linfático derecho.
- `Lumbar_trunk_L/_R`: del ganglio lateroaórtico (o laterocavo) más alto al polo inferior de la cisterna; el izquierdo
  pasa por detrás y a la izquierda de la aorta.
- `Intestinal_trunks`: dos ramas (celíacos y mesentéricos superiores centrales) que se unen y llegan a la parte alta de la
  cisterna entre la aorta y la cava.
- Calibres: troncos 2,2 mm; tubos de 8 lados (la cisterna, 12).

## Colectores

Grupo «Lymphatic_vessels» (`major` false, `MAT_Lymph_Vessel`), una malla por región y lado del contrato (18 piezas). Son
**colectores esquemáticos**: (1) árbol de expansión mínimo entre los ganglios de cada grupo; (2) una conexión por cada
línea de la tabla de drenaje del encargo (`Lymph.collectors`), del ganglio más cercano de un grupo al del siguiente,
saliendo por el hilio; (3) junto a su vaso guía cuando lo hay (yugular interna y externa, yugular anterior, facial,
basílica, cefálica, radiales, cubitales, braquiales, axilar, torácica interna, ilíacas, epigástrica inferior, femoral,
safenas, tibiales, peroneas, mesentéricas, esplénica, hepática común) a 1 mm de pared a pared, con una ondulación de
0,4 mm; 2 colectores paralelos junto a la basílica y 3 junto a la safena magna; (4) en los miembros nacen en el extremo
distal de la vena guía (muñeca, tobillo): **origen distal esquemático**. Calibre 1,2 mm, 6 lados, anillos cada 3–5 mm.
Si un eje roza un obstáculo se prueban otros (otro carril u otra holgura junto al vaso guía, nunca un atajo; arcos de
otra curvatura sin vaso guía) y se queda el que menos falla; el lado derecho repite la elección del izquierdo y los arcos
son espejo (piezas pares simétricas). Cada conexión queda registrada con su tipo en `build/linfatico/rutas-<modelo>.json`
y en `web/src/data/linfatico-rutas.js` (generado; 361 conexiones, 358 en los dos modelos: 268 esquemáticas, 88 de manual,
4 variantes elegidas).

## Simplificaciones declaradas

- **Variante clásica** de la vía central: un solo conducto torácico con una sola desembocadura; troncos izquierdos al
  final del conducto torácico (a menudo se abren aparte en la vena); conducto linfático derecho formado por los tres
  troncos derechos (variante «tipo libro»; con frecuencia no existe y los troncos se abren por separado).
- **Colectores**: trayectos esquemáticos que unen grupos según la tabla de drenaje (`tipo` en `linfatico-rutas.js`); no
  son vasos medidos ni cuentan cuántos hay. Orígenes distales de los miembros (24 cabos, muñeca y tobillo): esquemáticos.
- **Cisterna**: 6 mm de ancho, el valor bajo de lo publicado: entre la aorta, la cava y el cuerpo vertebral del modelo no
  cabe más. La arteria renal derecha, las arterias y venas lumbares, la lumbar ascendente derecha y las subcostales
  derechas del modelo van pegadas al cuerpo vertebral justo donde está la cisterna (en el cuerpo real la cisterna es
  retrocrural y la renal pasa por delante del pilar derecho): en esa franja de alturas sus roces se aceptan y no se
  cuentan (`cisterna_vasos_aceptados` en las comprobaciones).
- **Conducto torácico y pleura**: la pleura derecha del modelo llega a la línea media detrás del esófago (receso
  ácigo-esofágico); el conducto la roza (≤ 2,2 mm) en T9–T7. En la mujer queda casi en la línea media (+0,5 a +1,4 mm)
  desde T7, empujado por esa pleura, y pasa claramente a la izquierda en T5–T4.
- **Troncos subclavios largos** (140–159 mm): los ganglios apicales axilares de Z-Anatomy están lejos, cerca de la
  apófisis coracoides; el tronco recorre la axilar y la subclavia.
- **Tronco lumbar izquierdo**: pasa por detrás y a la izquierda de la aorta (8–9 mm detrás de su centro), no justo detrás:
  la aorta del modelo está apoyada en el cuerpo vertebral.
- Los colectores de los retrofaríngeos no se comprueban contra la piel (la «piel» del modelo recubre por dentro la
  faringe, junto a la que están esos ganglios).
- Asimetría de las piezas pares (p95): ≤ 6 mm en la mayoría; mayor en `Lumbar_trunk` (13–25 mm, la anatomía es
  asimétrica), `Bronchomediastinal_trunk` (6–8; el izquierdo acaba en el conducto torácico), pelvis (8–11; grupos impares
  repartidos por lados) y cabeza en el hombre (17; un colector occipital elige otro ganglio de llegada).

## Comprobaciones

En la construcción (`build/linfatico/comprobaciones-<modelo>.json`, hombre · mujer) y en el **GLB publicado**
(`tools/checks/linfatico_glb.py` → `build/linfatico/glb-<modelo>.json`):

- Piezas: 30 de vasos por modelo (12 de la vía central, 18 de colectores), 705 tubos; GLB del linfático 0,58 → 0,78 MB,
  163 → 193 mallas; 37 004 · 33 730 vértices de vasos. Faltan 0, mal marcadas 0 (grupo, `major`, `subsystem`, nombres).
- Conducto torácico: 369 · 336 mm, 3,4–4,6 mm. T12: x −5,4 · −6,1 mm, entre la aorta (+9,1 · +6,9) y la ácigos (−9,1 ·
  −7,4), 6 mm delante del cuerpo vertebral. T8: x −0,4 · −7,1, entre aorta y ácigos, 4–6 mm delante del cuerpo
  vertebral y 6 · 3,5 mm detrás del centro del esófago. Cruce de la línea media: hombre z 1333 mm (entre T6 y T5; cumple
  T6–T4; antes roza la línea media en T8, x −0,4 → +0,3), mujer z 1184 (T8–T7; no cumple, ver Simplificaciones). De T3 a T1, 10–26 mm a la izquierda del esófago. Arco:
  0,6–0,8 mm por debajo del centro de C7. Final al ángulo venoso izquierdo: 6,1 · 5,5 mm (límite radio + 1,5: 6,75 ·
  6,19); en el GLB, 4,9 · 4,3 mm.
- Cisterna: z 1108–1158 · 1008–1058 mm (L2 1120 · 1020, L1 1148 · 1047): de L2 a L1; centro a la derecha de la aorta.
- Conducto linfático derecho: 15,5 · 14,8 mm; nace donde llegan los tres troncos derechos; final al ángulo venoso
  derecho 5,7 · 5,1 mm (GLB 4,6 · 4,0; límite 6,75 · 6,18).
- Grafo por geometría: los 657 ganglios llegan a un ángulo venoso por tubos conectados; 361 rutas de la tabla, todas
  seguidas de origen a destino; cabos sueltos: solo los 24 orígenes distales declarados (también en el GLB, contando islas).
- Anillos (10 451 · 9 373) que fallan, con 0,1 mm de tolerancia: hombre vaso 29, hueso 9, órgano 14; mujer vaso 15, hueso
  14, órgano 34, piel 3. Todos ≤ 2,2 mm; los mayores: conducto torácico en la pleura (2,1 · 2,2 mm), colector entre dos
  preaórticos contra la aorta (1,5 mm, 6 anillos, hombre; los ganglios están pegados a la aorta y al páncreas), colector
  entre dos mandibulares en la mandíbula (1,7 mm, 1 anillo), tronco intestinal (1,6 mm, 1 anillo, aorta). Lista completa
  en `anillos.tubos_que_fallan`.
- Determinismo: una segunda construcción del hombre da un `male-lymphatic.glb` idéntico byte a byte (`cmp`).
- Los otros sistemas viscerales no cambian: publicados solo `<modelo>-lymphatic.glb/.json`, `<modelo>-index.json` y
  `manifest.json` (los demás, idénticos con `cmp`). Validación (`validate_models.py`) y `check-cards`: correctos.
- Capturas (`build/linfatico/capturas/vasos/`, y con la vía central en amarillo en `vasos/resaltado/`): cuerpo, vía central
  de frente y de lado, mediastino desde atrás y desde la derecha, cisterna, ángulos venosos, cuello izquierdo y derecho,
  axila, codo, ingle, pelvis, abdomen y hueco poplíteo, de los dos modelos.
- Reconstruir: `zsh tools/build_all.sh visceral` y `A3D_MODEL=female zsh tools/build_all.sh visceral` (≈ 6 min cada uno);
  a la vez solo contra copias distintas (`A3D_PUBLISHED`), y después copiar los archivos del linfático y ejecutar
  `tools/search_index.py` y `tools/manifest.py`.
