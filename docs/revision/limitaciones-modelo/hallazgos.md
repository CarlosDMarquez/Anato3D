# Limitaciones conocidas del modelo: registro de los tres hallazgos

Comprobado el 9 de noviembre de 2026 por Claude (Opus 5.5), por inspección del modelo y contraste con fuentes. **Falta la
revisión de un docente**: lo que aquí se clasifica como «confirmado» es lo que se ve en la geometría, no una corrección
anatómica aprobada.

## Base examinada

- Rama `claude/limitaciones-modelo`, creada desde `main` en `454a3cb`.
- Archivos del modelo (los que pide la app; se vio en sus peticiones de red):

| Archivo | Blob de git | SHA-256 (inicio) | Bytes | Último commit |
| --- | --- | --- | ---: | --- |
| `web/public/models/male-nervous.glb` | `b060d6820ea3` | `eea6232a59b89e74` | 3 399 112 | `c6a69c1` |
| `web/public/models/male-arterial.glb` | `48f0eefe56cc` | `216112e0a65a4ed9` | 2 797 740 | `c6a69c1` |
| `web/public/models/female-nervous.glb` | `d2a961b844e1` | `b2e8b4ecb3960a87` | 3 418 356 | `09d004d` |
| `web/public/models/female-arterial.glb` | `010357346d09` | `3709995a6f149bab` | 2 820 940 | `09d004d` |

Los huesos de referencia (esfenoides, temporal, parietal y frontal) vienen de `male.glb` y `female.glb`.

## Cómo repetir la comprobación

1. `npm --prefix web run dev`, abrir la app y pulsar «Empezar».
2. Pegar [`medir-limitaciones.js`](medir-limitaciones.js) en la consola del navegador. El script solo lee y hace esto:
   - carga los sistemas nervioso, arterial y esquelético en los dos modelos;
   - en los surcos, toma hasta 500 vértices de la pieza y busca, para cada uno, el giro más cercano;
   - en la arteria, mide su extensión máxima y el hueso más cercano a su extremo superior.
3. Para las capturas se usó la API de depuración del visor (`window.anato3d.viewer`: `parts`, `updateParts`, `select` y
   `focus`). La pieza estudiada sale resaltada en azul, las piezas de referencia opacas y el resto translúcido. Son
   del lado izquierdo; el derecho da las mismas cifras en espejo.

Coordenadas del modelo, en metros: +Y arriba, +Z delante, +X lado izquierdo del cuerpo. El resultado del script es el
mismo en dos ejecuciones seguidas.

## 1. `Paracentral_sulcus_L` y `Paracentral_sulcus_R`

**Lo que se ve en la geometría**

| Modelo | Lado | Centro (x, y, z) | Giros más cercanos a sus vértices |
| --- | --- | --- | --- |
| Femenino | L | 0,0222 · 1,5260 · 0,0969 | frontal medio 81 %, frontomarginal 11 %, frontopolar transverso 8 % |
| Femenino | R | −0,0220 · 1,5260 · 0,0967 | frontal medio 81 %, frontomarginal 12 %, frontopolar transverso 7 % |
| Masculino | L | 0,0233 · 1,6634 · 0,1088 | frontal medio 81 %, frontomarginal 12 %, frontopolar transverso 7 % |
| Masculino | R | −0,0232 · 1,6634 · 0,1087 | frontal medio 81 %, frontomarginal 12 %, frontopolar transverso 7 % |

Como referencia, `Paracentral_gyrus_and_sulcus_L` (el lóbulo paracentral del modelo) tiene su centro en 0,0108 · 1,5475 ·
0,0163 (femenino) y 0,0112 · 1,6902 · 0,0203 (masculino). La pieza llamada surco paracentral está unos 8 o 9 cm por
delante de él, en la cara lateral del lóbulo frontal, cerca del polo frontal.

**Lo que dice la anatomía.** La página «Paracentral lobule» de Wikipedia
([revisión 1296279219](https://en.wikipedia.org/w/index.php?title=Paracentral_lobule&oldid=1296279219)) sitúa el
lóbulo «on the medial surface of the cerebral hemisphere» y describe el surco paracentral como una rama del surco
cingulado («branch of the cingulate sulcus»).

**Interpretación.** La posición no corresponde al surco paracentral, que está en la cara medial. No se sabe qué surco
representa la malla; podría ser un surco del giro frontal medio, pero eso no se ha comprobado y no se le da otro nombre.

**Estado: confirmado mediante inspección** en los dos modelos y los dos lados (la ubicación no es la de su nombre). La
identidad real de la malla queda pendiente de revisión.

Capturas: [lateral, femenino](paracentral-femenino-lateral.jpg), [superior, femenino](paracentral-femenino-superior.jpg),
[lateral, masculino](paracentral-masculino-lateral.jpg) y [superior, masculino](paracentral-masculino-superior.jpg). En
azul la pieza; opaco, el lóbulo paracentral.

## 2. `Inferior_temporal_sulcus_L` e `Inferior_temporal_sulcus_R`

**Lo que se ve en la geometría**

| Modelo | Lado | Centro (x, y, z) | Giros más cercanos a sus vértices |
| --- | --- | --- | --- |
| Femenino | L | 0,0381 · 1,4643 · 0,0441 | temporal inferior 47 %, fusiforme 35 %, parahipocampal 12 %, polo temporal 6 % |
| Femenino | R | −0,0379 · 1,4643 · 0,0439 | temporal inferior 47 %, fusiforme 35 %, parahipocampal 13 %, polo temporal 5 % |
| Masculino | L | 0,0403 · 1,6006 · 0,0462 | temporal inferior 48 %, fusiforme 32 %, parahipocampal 15 %, polo temporal 5 % |
| Masculino | R | −0,0401 · 1,6007 · 0,0461 | temporal inferior 47 %, fusiforme 33 %, parahipocampal 15 %, polo temporal 5 % |

(«fusiforme» es `Lateral_occipitotemporal_gyrus`.) La pieza está en la cara inferior del lóbulo temporal, en su parte
anterior, entre el giro temporal inferior y el fusiforme. No toca el giro temporal medio.

**Lo que dice la anatomía.** El nombre no significa lo mismo en todas las fuentes:
- La página «Inferior temporal gyrus» de Wikipedia
  ([revisión 1369116272](https://en.wikipedia.org/w/index.php?title=Inferior_temporal_gyrus&oldid=1369116272)), vista de
  lado, separa el giro temporal inferior del medio «by the inferior temporal sulcus». Es la nomenclatura actual: un
  surco de la cara lateral.
- La misma página, en la cara inferior, separa el giro temporal inferior del fusiforme «by the occipital-temporal
  sulcus».
- El título «Inferior temporal sulcus» de Wikipedia redirige a «Occipitotemporal sulcus»
  ([revisión 1366171173](https://en.wikipedia.org/w/index.php?title=Occipitotemporal_sulcus&oldid=1366171173)).

**Interpretación.** Por su posición, la malla coincide con la parte anterior del surco occipitotemporal. No coincide con
el surco temporal inferior de la nomenclatura actual. Es un problema de identidad que depende de la nomenclatura, no
una pieza fuera de su sitio.

**Estado:**
- **posición confirmada** en los dos modelos y los dos lados;
- **identidad sospechosa, pendiente de revisión.**

Capturas: [vista inferior, femenino](temporal-inferior-femenino-inferior.jpg) y
[vista inferior, masculino](temporal-inferior-masculino-inferior.jpg). En azul la pieza; el resto de la corteza del lado
izquierdo, translúcida.

## 3. `Middle_meningeal_artery_L` y `Middle_meningeal_artery_R`

**Lo que se ve en la geometría**

| Modelo | Lado | Vértices | Extensión máxima | Extremo superior |
| --- | --- | ---: | ---: | --- |
| Femenino | L | 147 | 24,6 mm | a 7,4 mm del esfenoides |
| Femenino | R | 147 | 24,6 mm | a 7,0 mm del esfenoides |
| Masculino | L | 147 | 27,3 mm | a 8,3 mm del esfenoides |
| Masculino | R | 147 | 27,4 mm | a 8,1 mm del esfenoides |

Las únicas piezas de esta arteria son `Middle_meningeal_artery_*` y `Accessory_branch_of_middle_meningeal_artery_*`.
Ninguna representa sus ramas anterior y posterior.

**Lo que dice la anatomía.** La página «Middle meningeal artery» de Wikipedia
([revisión 1296440562](https://en.wikipedia.org/w/index.php?title=Middle_meningeal_artery&oldid=1296440562)) dice que
la arteria entra en el cráneo por el agujero espinoso y que después «divides into two branches, anterior and
posterior». Esas ramas recorren la cara interna de la bóveda del cráneo.

**Interpretación.** La pieza está bien identificada pero es incompleta: es solo el tronco corto junto al esfenoides,
sin las ramas de la bóveda.

**Estado: confirmado mediante inspección** (representación incompleta) en los dos modelos y los dos lados.

Capturas: [cráneo, femenino](meningea-media-femenino-craneo.jpg), [de cerca, femenino](meningea-media-femenino-cerca.jpg),
[cráneo, masculino](meningea-media-masculino-craneo.jpg) y [de cerca, masculino](meningea-media-masculino-cerca.jpg). En
azul la arteria. En las vistas de cerca:
- el esfenoides está opaco y el resto del cráneo, translúcido;
- en rojo se ve también la rama accesoria.

## Lo que no se comprobó

- Solo se examinaron estas tres piezas. Puede haber otras con problemas parecidos.
- No se miraron otras versiones de los archivos del modelo: la clasificación vale para los blobs de la tabla. Si cambian,
  hay que volver a pasar el script.
- No hay revisión docente. Ninguna pieza se ha movido, renombrado ni corregido: la corrección de la geometría queda
  fuera de este trabajo.
