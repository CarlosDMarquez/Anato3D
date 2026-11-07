# Hito 7 — Volver al inicio, sombras, solapes y modelo femenino

Fecha: 2026-11-06. Base: commit `6ce07d4`. Encargo de Carlos (2026-11-06, noche), en este orden:
1. poder volver a la pantalla de inicio desde la app;
2. que al quitar las sombras en Configuración se quite también la sombra del modelo y el fondo sea solo negro;
3. revisar a mano los solapes entre órganos que vienen de Z-Anatomy;
4. perfeccionar el modelo femenino: forma de la pelvis, vulva y genitales externos profundos, mama (grasa y ligamentos),
   labios entreabiertos y músculos del periné.

## 1. Interpretaciones (a confirmar)

- **«Quitar las sombras»** es la casilla «Alta calidad»: es la única de Configuración que tiene que ver con sombras.
- **«Labios entreabiertos»** son los de la boca: la piel femenina de MakeHuman tiene la boca entreabierta y se ven los
  dientes. Estaba anotado así entre los pendientes del modelo femenino.

## 2. Volver a la pantalla de inicio y calidad baja (commit `6f2c142`)

- Botón **«Volver a la pantalla de inicio»** al final de Ajustes; en el ordenador, también el nombre «Anato3D» de la barra
  superior. En el móvil el nombre no se ve y en la barra de herramientas no cabe otro botón.
- La app se funde a negro y la pantalla vuelve con el esqueleto, como al abrirla; la primera opción pasa a ser
  **Continuar**, que devuelve la exploración tal cual (sistemas y capas, piezas ocultas, atenuadas o aisladas, cámara).
- El botón de la casa de la barra se llama ahora «Vista inicial» en español (antes «Inicio»), como en los otros idiomas.
- **Calidad baja:** sin oclusión ambiental (ya era así), **sin la sombra bajo los pies** y **fondo negro liso**. La casilla
  se llama «Alta calidad (resolución, sombras y fondo degradado)».

## 3. Solapes entre órganos

### Cómo se revisaron

- Auditoría de los dos modelos (`tools/audit_models.py`): 30 choques en el hombre y 34 en la mujer.
- Cada par se midió también en **Z-Anatomy original**, antes del ajuste al cuerpo, y en el modelo construido con su
  **profundidad** (cuánto entra una pieza en la otra).
- Se miraron **uno a uno** con imágenes de Blender (A en rojo, B en azul translúcido, de frente y de lado).
- La auditoría solo miraba un sentido de cada par; al mirar los dos aparecieron 12 pares más, revisados igual.

### Resultado

| Veredicto | Pieza A dentro de B | Z-Anatomy | Hombre (antes) | Mujer (antes) | Por qué |
|---|---|---|---|---|---|
| choque | Kidney L en Spleen | 4 %, 3.3 mm | — | 2 %, 1.4 mm | corregido: el bazo cede |
| choque | Kidney L en Suprarenal gland L | 11 %, 5.9 mm | 7 %, 2.4 mm | 8 %, 3.0 mm | corregido: el riñón cede |
| choque | Kidney R en Suprarenal gland R | 8 %, 4.0 mm | 3 %, 0.8 mm | 4 %, 1.1 mm | corregido: el riñón cede |
| choque | Spleen en Suprarenal gland L | 2 %, 6.2 mm | 2 %, 4.8 mm | 3 %, 3.2 mm | corregido: el bazo cede |
| choque | Urinary bladder en Sigmoid colon | 0 %, 0.2 mm | 3 %, 1.1 mm | — | corregido: el sigma cede (lo creaba el ajuste) |
| aceptado | Oropharynx en Gingiva | 9 %, 1.3 mm | 6 %, 1.6 mm | — | mucosa continua al fondo de la boca |
| aceptado | Sublingual gland L en Gingiva | 52 %, 2.5 mm | 52 %, 2.4 mm | — | la «encía» de Z-Anatomy llega al suelo de la boca |
| aceptado | Submandibular gland L en Gingiva | 30 %, 2.2 mm | 30 %, 2.0 mm | — | su parte profunda llega al suelo de la boca |
| natural | Accessory pancreatic duct en Pancreas | — | 78 %, 6.7 mm | 78 %, 5.9 mm | el conducto va dentro del páncreas |
| natural | Anterior lateral segment of liver VI en Posterior lateral segment of liver VII | 0 %, 0.0 mm | — | 4 %, 0.1 mm | segmentos vecinos del hígado |
| natural | Appendicular nodes en Meso appendix | 42 %, 0.5 mm | 42 %, 0.4 mm | 45 %, 0.4 mm | los nodos del apéndice están en su meso |
| natural | Inferior parathyroid gland L en Thyroid gland | 44 %, 0.7 mm | 8 %, 0.2 mm | 8 %, 0.1 mm | en la cara posterior de la tiroides |
| natural | Inferior parathyroid gland R en Thyroid gland | 44 %, 0.6 mm | 8 %, 0.1 mm | 8 %, 0.1 mm | ídem |
| natural | Intraglandular parotid nodes L en Parotid gland L | 33 %, 2.5 mm | 33 %, 2.3 mm | 33 %, 2.2 mm | dentro de la glándula, por definición |
| natural | Intraglandular parotid nodes R en Parotid gland R | 33 %, 2.5 mm | 33 %, 2.3 mm | 33 %, 2.2 mm | ídem |
| natural | Left anterior lateral segment of liver III en Left posterior lateral segment of liver II | 0 %, 0.0 mm | 3 %, 0.1 mm | 4 %, 0.1 mm | segmentos vecinos del hígado |
| natural | Left lobe of thymus en Right lobe of thymus | 3 %, 3.3 mm | 3 %, 2.5 mm | 2 %, 2.1 mm | unidos en la línea media |
| natural | Lesser omentum en Left anterior lateral segment of liver III | 6 %, 0.8 mm | 5 %, 1.1 mm | — | el omento menor se inserta en el hígado |
| natural | Major alar cartilage R en Nasal septal cartilage | 2 %, 0.6 mm | — | 2 %, 0.4 mm | la rama medial se apoya en el tabique |
| natural | Meso appendix en Vermiform appendix | 15 %, 3.5 mm | 15 %, 3.1 mm | 16 %, 3.1 mm | el meso se une al apéndice |
| natural | Mesocolic taenia en Transverse colon | 0 %, 0.0 mm | 3 %, 0.4 mm | 3 %, 0.3 mm | la tenia es parte de la pared del colon |
| natural | Mesocolon en Transverse colon | 7 %, 0.5 mm | 4 %, 0.5 mm | 4 %, 0.5 mm | el mesocolon se une al colon |
| natural | Oropharynx en Soft palate | 3 %, 0.2 mm | — | 2 %, 0.2 mm | mucosa continua |
| natural | Pancreatic duct en Pancreas | — | 99 %, 6.9 mm | — | el conducto va dentro del páncreas |
| natural | Posterior lateral segment of liver VII en Posterior medial segment of liver VIII | 0 %, 0.0 mm | 2 %, 0.0 mm | 7 %, 0.2 mm | segmentos vecinos del hígado |
| natural | Posterior medial segment of liver VIII en Posterior segment of liver I | 0 %, 0.2 mm | — | 4 %, 0.0 mm | segmentos vecinos del hígado |
| natural | Prostate en Urinary bladder | 4 %, 2.1 mm | 3 %, 2.1 mm | — | el cuello de la vejiga descansa en la base de la próstata |
| natural | Seminal gland L en Urinary bladder | 8 %, 2.5 mm | 4 %, 1.1 mm | — | apoyada en la cara posterior de la vejiga |
| natural | Seminal gland L en Prostate | 13 %, 2.3 mm | 13 %, 2.2 mm | — | su extremo y su conducto entran en la próstata |
| natural | Seminal gland R en Urinary bladder | 7 %, 1.9 mm | 3 %, 1.6 mm | — | ídem |
| natural | Superior parathyroid gland L en Thyroid gland | 39 %, 0.5 mm | 6 %, 0.1 mm | 6 %, 0.1 mm | en la cara posterior de la tiroides |
| natural | Superior parathyroid gland R en Thyroid gland | 39 %, 0.6 mm | 6 %, 0.2 mm | 6 %, 0.1 mm | ídem |
| natural | Testis L en Epididymis L | 13 %, 3.4 mm | 4 %, 1.1 mm | — | el epidídimo va pegado al testículo |
| natural | Uvula of palate en Soft palate | 2 %, 0.2 mm | 6 %, 0.3 mm | — | la úvula cuelga del paladar blando |
| roce | Accessory pancreatic duct en Transverse colon | — | 4 %, 0.4 mm | 4 %, 0.4 mm | su extremo toca el colon transverso |
| roce | Brachiocephalic nodes en Pleura | 8 %, 0.2 mm | — | 9 %, 0.2 mm | apoyados en la pleura mediastínica |
| roce | Central superior mesenteric nodes en Transverse colon | 11 %, 0.6 mm | — | 18 %, 0.4 mm | tocan la pared del colon |
| roce | Corniculate cartilage L en Laryngopharynx | 20 %, 0.2 mm | 47 %, 0.2 mm | 49 %, 0.2 mm | dentro del pliegue ariepiglótico, junto a la faringe |
| roce | Corniculate cartilage R en Laryngopharynx | 20 %, 0.2 mm | 34 %, 0.2 mm | 36 %, 0.2 mm | ídem |
| roce | Corpus spongiosum of penis en Corpus cavernosum of penis | 4 %, 0.9 mm | 4 %, 0.8 mm | — | el cuerpo esponjoso va entre los cavernosos |
| roce | Intermediate external iliac nodes R en Meso appendix | 6 %, 0.5 mm | 5 %, 0.4 mm | 5 %, 0.4 mm | el extremo del meso llega a la cadena ilíaca |
| roce | Juxta oesophageal nodes en Prevertebral nodes | 10 %, 1.0 mm | 9 %, 0.8 mm | 14 %, 0.6 mm | dos cadenas de nodos que se tocan |
| roce | Juxta oesophageal nodes en Oesophagus | — | 8 %, 0.4 mm | — | junto al esófago |
| roce | Lateral caval nodes en Pre aortic nodes | 2 %, 0.5 mm | 3 %, 0.7 mm | 4 %, 0.7 mm | dos cadenas de nodos que se tocan |
| roce | Lateral pericardial nodes en Pleura | 22 %, 0.2 mm | 14 %, 0.2 mm | 21 %, 0.2 mm | entre el pericardio y la pleura |
| roce | Node of ligamentum arteriosum en Pleura | 45 %, 0.5 mm | — | 27 %, 0.2 mm | apoyado en la pleura |
| roce | Parasternal nodes R en Pleura | 10 %, 0.2 mm | 3 %, 0.2 mm | 12 %, 0.2 mm | delante de la pleura, junto a los vasos torácicos internos |
| roce | Postvesical nodes en Sigmoid colon | 13 %, 1.0 mm | — | 4 %, 0.3 mm | tocan el sigma |
| roce | Pre aortic nodes en Precaval nodes | 0 %, 0.0 mm | 4 %, 0.7 mm | — | dos cadenas de nodos que se tocan |
| roce | Retropharyngeal nodes R en Oropharynx | 20 %, 0.2 mm | 6 %, 0.3 mm | — | detrás de la faringe |

«Z-Anatomy»: el mismo par antes del ajuste («—»: no está o no se midió). «Antes»: construcción del 1 de noviembre.

### Corrección

- `tools/build_visceral.py`, lista `CEDE` (en ese orden y dos vueltas): la suprarrenal conserva su forma de media luna y
  ceden el riñón y el bazo, que en el cuerpo tienen esas impresiones; entre riñón y bazo cede el bazo; el sigma cede ante
  la vejiga y las vesículas seminales ante el sigma.
- El que cede se subdivide junto al otro y sus vértices salen de él en la dirección que va del centro del otro al suyo;
  las puntas que siguen dentro empujan la cara que atraviesan. Con «cede el más pequeño» la suprarrenal se deformaba
  sobre el riñón y el polo de este seguía dentro de ella.
- **Hombre:** 0 vértices de cada par dentro del otro; la auditoría da **0 choques de 1 mm o más**, 20 roces, 28 uniones
  reales y 5 heredados aceptados. Cambian el digestivo (sigma), el endocrino (las suprarrenales recuperan su forma), el
  linfático (bazo, +1,5 KB) y el urogenital (riñones y vesículas, +10 KB); el respiratorio sale idéntico byte a byte.

### Auditoría

- Mira los dos sentidos y la profundidad, y separa cuatro grupos: **choques** (1 mm o más), **roces** (menos de 1 mm),
  **uniones y contenidos reales** (`NATURAL`, con su motivo) y **heredados aceptados** (`ACCEPTED`: las glándulas
  salivales en la «encía» de Z-Anatomy, que llega al suelo de la boca; separarlas deformaba la boca).

## 4. Modelo femenino

### Pelvis (`tools/female_pelvis.py`)

- La conjugada obstétrica se quedaba en 10,1 cm. En esta pelvis el borde superior de la sínfisis está 8,7 cm por debajo
  del promontorio y solo 4,5 cm por delante: adelantarla alarga poco la conjugada (7 mm más adelante: +2 mm, y además
  cerraba el arco del pubis de 88° a 79°), y la deformación arrastraba el promontorio 4 mm hacia delante.
- Diseño nuevo, probado fuera del pipeline con cinco variantes: el promontorio queda fijo (sobre él va L5) y la sínfisis va
  10 mm hacia delante y 6–7 mm hacia abajo, con el tubérculo y el pecten; las ramas, más abiertas junto a la sínfisis.
  En la mujer el pubis es más largo que en el hombre (índice isquiopubiano).

| Medida | Antes del 30 oct | 30 oct | 6 nov | Habitual |
|---|---|---|---|---|
| Conjugada obstétrica | 9,8 cm | 10,1 cm | **10,9 cm** | 9,5–11,5 |
| Estrecho superior, ancho | 12,7 cm | 13,6 cm | 13,6 cm | — |
| Entre espinas ciáticas | 8,0 cm | 10,1 cm | 10,2 cm | 9,5–11,5 |
| Entre tuberosidades | 6,2 cm | 8,6 cm | 9,1 cm | 10–12 |
| Arco del pubis | 54° | 88° | 87° | 85–90° o más |

«Habitual»: tabla de Wikipedia «Pelvimetry», consultada por búsqueda web el 2026-11-06; las cifras varían entre fuentes.
La distancia entre tuberosidades queda algo corta. Delante de la sínfisis quedan 2,1 cm de partes blandas (antes 2,7).

### Labios de la boca (`tools/fix_neck.py`, `close_mouth`)

- La piel femenina de MakeHuman tiene la boca entreabierta: una rendija de hasta 2,6 mm (1,8 de media) entre −2,1 y
  +2,1 cm, por la que se veían los dientes. La masculina cierra casi del todo (0,5 mm) y no se toca.
- La rendija se mide con rayos desde delante (alto de cada lado, cada milímetro de ancho) y los vértices de los labios a
  menos de 5 mm de ella (solo la piel de los labios, no la cavidad de la boca) se mueven en vertical hacia su línea media,
  con 0,15 mm de solape y caída suave: 1238 vértices.
- **Además:** bajo el labio inferior había un corte horizontal que no está en la piel original de MakeHuman. Lo dejaba el
  paso que infla la piel sobre la mandíbula (hasta 14 mm). Se alisa con un suavizado laplaciano con máscara en la piel
  de delante (365 vértices, hasta 3,1 mm).
- Los dientes y la mandíbula no quedan más cerca de la piel que antes.

### Mama (`tools/female_organs.py`, `breast_fat_and_ligaments`)

- **Tejido adiposo de la mama** (pieza nueva): de la dermis (2 mm bajo la piel) a la cara anterior de la glándula
  (0,3 mm por delante), del borde de la areola (1,7 cm del pezón; bajo la areola no hay grasa) al contorno de la base.
  Rellena los surcos entre los lóbulos.
- **Ligamentos suspensorios de la mama** (de Cooper; pieza nueva): 15 tabiques de 0,5 mm, uno en la cresta de cada
  lóbulo, de la glándula a la dermis, desde la areola hasta el 92 % del contorno. Atraviesan la grasa (la auditoría lo
  cuenta como unión real).
- La glándula baja: 9 mm bajo la piel en las crestas y 14 mm entre ellas (antes 8 con surcos de 3), y vuelve a 3 mm en el
  contorno, donde la mama se funde con la pared del tórax.
- **Nombres:** los ligamentos están en la TA2 (*Ligamenta suspensoria mammaria*, con francés e italiano). La grasa no
  tiene término propio: su latín, *Textus adiposus mammae*, es descriptivo (vocabulario de la TA), y la ficha lo dice;
  francés e italiano, de Anato3D.
- **Fichas** nuevas en `visceras.js`, traducidas (lote 031).

### Vulva y genitales externos profundos

- **Vulva** (`tools/build_female_skin.py`): labios mayores de 6,5 mm (antes 5; salían planos) y labios menores más
  gruesos y algo más altos (1,8 mm en la base, antes 1,2; eran aletas finas).
- **Raíces del clítoris** (`tools/female_perineum.py`): aplanadas contra las ramas isquiopubianas (sección de 4,8 × 2,6 mm,
  antes 4,2 × 3,4). Con la sección casi redonda parecían salchichas sueltas bajo el hueso. El isquiocavernoso, que las
  envuelve, las sigue.
- Todo el periné (vestíbulo, clítoris, bulbos, glándulas, músculos) usa las referencias de la pelvis, así que se
  recoloca con la sínfisis nueva.

### Músculos del periné

- **Esfínter anal externo** (`tools/build_muscular.py`, solo en la mujer): el de Z-Anatomy quedaba 2,2 cm por encima de
  la piel del periné. Su parte subcutánea va justo bajo la piel que rodea el ano: se estira hacia abajo hasta 4 mm bajo
  la piel, sin mover su parte profunda, que abraza al pubococcígeo (puborrectal). En el hombre pasa lo mismo y no se ha
  tocado.
- Los músculos generados para Anato3D (isquiocavernoso, bulboesponjoso, transversos, compresor de la uretra, esfínter
  uretrovaginal, esfínter externo de la uretra, membrana y cuerpo perineal) se recolocan con la pelvis nueva.

### Resultado en el modelo construido

- **Paso base** (`build_all.sh base`): `male.glb` sale idéntico byte a byte; cambia solo `female.glb`.
- **Auditoría femenina:** **0 choques de 1 mm o más** (antes, 34 «choques» sin separar), 24 roces, 29 uniones reales y
  5 heredados aceptados. Los ligamentos dentro de la grasa cuentan como unión real.
- **Fuera de la piel y visibles:** solo lo de siempre, los ojos por sus huecos (iris, córnea, cristalino…) y dos falanges
  del dedo gordo del pie (0,8 mm, defecto ya anotado). Ninguna pieza nueva, y cerrar la boca no deja asomar nada.
- **Esfínter anal externo:** estirado 17,4 mm (de 26 a 44 mm de alto); su punto más bajo queda a 4,0 mm de la piel
  (antes, 21,7). Horquilla–ano: 2,68 cm (antes 2,46).
- **Útero:** sigue en anteversión de 70° y anteflexión de 15°. El borde superior de la sínfisis solo avanzó 4 mm respecto
  al diseño anterior, y con 75° el fondo quedaría a menos de 1,2 cm del pubis.
- **Vísceras:** 31 piezas femeninas (antes 27: la grasa y los ligamentos de cada mama). Los cinco pares de `CEDE` que
  existen en la mujer quedan con 0 vértices de cada uno dentro del otro.
- **Mallas:** la suprarrenal izquierda ya no tiene las 34 caras de área nula que dejaba su deformación. La grasa nueva
  tenía 11 por lado en la prolongación axilar (los últimos anillos de la rejilla repetían el mismo punto); corregido.
