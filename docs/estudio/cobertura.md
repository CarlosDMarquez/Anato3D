---
title: Cobertura de la biblioteca de estudio
---

# Cobertura de la biblioteca de estudio

Generado por `node scripts/biblioteca.mjs` (no editar a mano). Cuenta las lecciones disponibles (`web/src/biblioteca/lecciones/` y los dos módulos antiguos) frente al plan (`web/scripts/biblioteca/plan.mjs`) y frente a las piezas de los dos modelos 3D. Cada lección cuenta una sola vez en cada fila aunque esté en varias subregiones; los totales cuentan lecciones únicas.

- **Estado**: *disponible* (existen todas las lecciones que el plan prevé para esa fila), *parcial* (algunas) o *pendiente* (ninguna); *sin lección propia* = el plan no prevé una lección dedicada (sus estructuras pueden estudiarse en otras). Se comparan identificadores: una lección general que toca la fila no cuenta como la prevista.
- **Lecciones disponibles**: todas las que tocan esa fila, previstas para ella o no. **Previstas**: cuántas de las previstas para la fila existen ya.
- **Estructuras**: piezas del modelo (sin contar el lado) clasificadas en esa región o sistema; *en el núcleo* = se estudian y se evalúan en alguna lección; *con contexto* = además las que solo se muestran para orientarse.
- Todas las lecciones están en estado *borrador*: redactadas con IA a partir de fuentes citadas y comprobadas, sin revisar por un especialista.

## Resumen

- Lecciones disponibles: **87** de 87 previstas (100 %).
- Módulos: **19** · Recorridos: **11**.
- Estructuras de los modelos: **1747** (hombre 1717, mujer 1730); en el núcleo de alguna lección: **1112** (64 %); con contexto: 1253 (72 %).
- Pasos: 631 · preguntas de evaluación: 1613 · citas comprobadas: 4130 en 511 páginas.

## Por región

| Región › subregión | Lecciones disponibles | Previstas (hechas de total) | Estado | Estructuras | En el núcleo | Con contexto |
| --- | ---: | ---: | --- | ---: | ---: | ---: |
| **Cabeza** | **21** | 20 de 20 | disponible | 401 | 303 (76 %) | 330 |
| Cabeza › Cráneo | 1 | 1 de 1 | disponible | 15 | 8 (53 %) | 9 |
| Cabeza › Encéfalo y meninges | 9 | 9 de 9 | disponible | 199 | 189 (95 %) | 198 |
| Cabeza › Cara | 4 | 4 de 4 | disponible | 109 | 51 (47 %) | 59 |
| Cabeza › Órbita y ojo | 2 | 2 de 2 | disponible | 32 | 19 (59 %) | 24 |
| Cabeza › Oído | 2 | 2 de 2 | disponible | 11 | 9 (82 %) | 11 |
| Cabeza › Nariz y cavidad nasal | 1 | 1 de 1 | disponible | 6 | 5 (83 %) | 6 |
| Cabeza › Boca y cavidad oral | 2 | 1 de 1 | disponible | 29 | 24 (83 %) | 26 |
| **Cuello** | **5** | 5 de 5 | disponible | 99 | 56 (57 %) | 68 |
| Cuello › Músculos del cuello | 1 | 1 de 1 | disponible | 25 | 16 (64 %) | 16 |
| Cuello › Laringe, faringe y tiroides | 2 | 2 de 2 | disponible | 31 | 17 (55 %) | 23 |
| Cuello › Vasos y nervios del cuello | 2 | 2 de 2 | disponible | 42 | 23 (55 %) | 29 |
| **Espalda y columna** | **3** | 3 de 3 | disponible | 156 | 91 (58 %) | 122 |
| Espalda y columna › Columna vertebral | 1 | 1 de 1 | disponible | 81 | 54 (67 %) | 78 |
| Espalda y columna › Músculos de la espalda | 1 | 1 de 1 | disponible | 38 | 25 (66 %) | 31 |
| Espalda y columna › Médula espinal | 1 | 1 de 1 | disponible | 35 | 12 (34 %) | 13 |
| **Tórax** | **10** | 10 de 10 | disponible | 211 | 197 (93 %) | 199 |
| Tórax › Pared torácica | 3 | 3 de 3 | disponible | 43 | 35 (81 %) | 37 |
| Tórax › Mama | 1 | 1 de 1 | disponible | 5 | 1 (20 %) | 1 |
| Tórax › Diafragma | 1 | 1 de 1 | disponible | 2 | 1 (50 %) | 1 |
| Tórax › Mediastino | 4 | 4 de 4 | disponible | 100 | 99 (99 %) | 99 |
| Tórax › Corazón | 1 | 1 de 1 | disponible | 27 | 27 (100 %) | 27 |
| Tórax › Pulmones y pleura | 3 | 3 de 3 | disponible | 81 | 81 (100 %) | 81 |
| **Abdomen** | **9** | 9 de 9 | disponible | 174 | 119 (68 %) | 134 |
| Abdomen › Pared abdominal | 1 | 1 de 1 | disponible | 19 | 12 (63 %) | 15 |
| Abdomen › Cavidad abdominal y peritoneo | 2 | 2 de 2 | disponible | 4 | 4 (100 %) | 4 |
| Abdomen › Órganos abdominales | 3 | 3 de 3 | disponible | 28 | 27 (96 %) | 28 |
| Abdomen › Riñones y retroperitoneo | 3 | 3 de 3 | disponible | 4 | 4 (100 %) | 4 |
| Abdomen › Vasos y nervios del abdomen | 2 | 2 de 2 | disponible | 119 | 72 (61 %) | 83 |
| **Pelvis y periné** | **7** | 7 de 7 | disponible | 128 | 94 (73 %) | 104 |
| Pelvis y periné › Pelvis ósea | 1 | 1 de 1 | disponible | 15 | 10 (67 %) | 13 |
| Pelvis y periné › Suelo pélvico | 1 | 1 de 1 | disponible | 5 | 3 (60 %) | 4 |
| Pelvis y periné › Órganos pélvicos | 3 | 3 de 3 | disponible | 15 | 12 (80 %) | 15 |
| Pelvis y periné › Periné y genitales externos | 3 | 3 de 3 | disponible | 38 | 16 (42 %) | 19 |
| Pelvis y periné › Vasos y nervios de la pelvis | 2 | 2 de 2 | disponible | 57 | 55 (96 %) | 55 |
| **Miembro superior** | **13** | 13 de 13 | disponible | 312 | 149 (48 %) | 167 |
| Miembro superior › Cintura escapular | 2 | 2 de 2 | disponible | 24 | 15 (63 %) | 16 |
| Miembro superior › Hombro | 2 | 2 de 2 | disponible | 38 | 22 (58 %) | 24 |
| Miembro superior › Axila | 2 | 1 de 1 | disponible | 42 | 21 (50 %) | 24 |
| Miembro superior › Brazo | 2 | 1 de 1 | disponible | 50 | 19 (38 %) | 26 |
| Miembro superior › Codo | 1 | 1 de 1 | disponible | 15 | 5 (33 %) | 7 |
| Miembro superior › Antebrazo | 3 | 2 de 2 | disponible | 72 | 36 (50 %) | 42 |
| Miembro superior › Muñeca | 1 | 1 de 1 | disponible | 47 | 8 (17 %) | 10 |
| Miembro superior › Mano | 3 | 2 de 2 | disponible | 93 | 37 (40 %) | 43 |
| **Miembro inferior** | **15** | 15 de 15 | disponible | 341 | 163 (48 %) | 190 |
| Miembro inferior › Cintura pélvica | 1 | 1 de 1 | disponible | 13 | 8 (62 %) | 11 |
| Miembro inferior › Región glútea | 2 | 1 de 1 | disponible | 30 | 17 (57 %) | 17 |
| Miembro inferior › Cadera | 1 | 1 de 1 | disponible | 20 | 17 (85 %) | 17 |
| Miembro inferior › Muslo | 5 | 4 de 4 | disponible | 68 | 37 (54 %) | 42 |
| Miembro inferior › Rodilla | 4 | 3 de 3 | disponible | 43 | 16 (37 %) | 23 |
| Miembro inferior › Pierna | 4 | 3 de 3 | disponible | 50 | 27 (54 %) | 30 |
| Miembro inferior › Tobillo | 1 | 1 de 1 | disponible | 27 | 7 (26 %) | 13 |
| Miembro inferior › Pie | 3 | 2 de 2 | disponible | 118 | 49 (42 %) | 55 |
| Todo el cuerpo (sin región) | 10 | 10 de 10 | disponible | — | — | — |
| **Total (lecciones únicas)** | **87** | 87 de 87 | disponible | 1747 | 1112 | 1253 |

## Por sistema

| Sistema | Lecciones disponibles | Previstas (hechas de total) | Estado | Estructuras | En el núcleo | Con contexto |
| --- | ---: | ---: | --- | ---: | ---: | ---: |
| Sistema óseo | 17 | 17 de 17 | disponible | 133 | 133 (100 %) | 133 |
| Articulaciones y ligamentos | 14 | 13 de 13 | disponible | 291 | 93 (32 %) | 137 |
| Sistema muscular | 23 | 23 de 23 | disponible | 292 | 204 (70 %) | 226 |
| Sistema nervioso | 24 | 22 de 22 | disponible | 296 | 201 (68 %) | 221 |
| Sistema cardiovascular | 18 | 18 de 18 | disponible | 422 | 248 (59 %) | 284 |
| Sistema linfático | 9 | 9 de 9 | disponible | 127 | 94 (74 %) | 102 |
| Sistema respiratorio | 7 | 7 de 7 | disponible | 44 | 44 (100 %) | 44 |
| Sistema digestivo | 7 | 7 de 7 | disponible | 56 | 51 (91 %) | 54 |
| Sistema urinario | 2 | 2 de 2 | disponible | 5 | 5 (100 %) | 5 |
| Sistema reproductor masculino | 1 | 1 de 1 | disponible | 9 | 8 (89 %) | 9 |
| Sistema reproductor femenino | 1 | 1 de 1 | disponible | 17 | 8 (47 %) | 10 |
| Sistema endocrino | 3 | 3 de 3 | disponible | 7 | 7 (100 %) | 7 |
| Sistema tegumentario | 1 | 1 de 1 | disponible | 26 | 4 (15 %) | 6 |
| Órganos de los sentidos | 4 | 4 de 4 | disponible | 22 | 12 (55 %) | 15 |

## Por recorrido

| Recorrido | Módulos | Lecciones disponibles | Previstas | Minutos disponibles | Estado | Alcance comprobado |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| Primeros pasos: el cuerpo por sistemas | 2 | 16 | 16 | 171 | disponible | — |
| Todos los huesos del cuerpo | 4 | 13 | 13 | 208 | disponible | 123 de 123 estructuras de tipo hueso (100 %) |
| Accidentes óseos | 1 | 7 | 7 | 116 | disponible | — |
| Músculos por región | 4 | 19 | 19 | 324 | disponible | — |
| Movimientos | 1 | 7 | 7 | 105 | disponible | — |
| Articulaciones | 1 | 7 | 7 | 115 | disponible | — |
| Arterias y venas | 1 | 11 | 11 | 196 | disponible | — |
| Nervios y territorios | 2 | 13 | 13 | 241 | disponible | — |
| Órganos y relaciones | 1 | 13 | 13 | 225 | disponible | — |
| Compartimentos de los miembros | 1 | 7 | 7 | 118 | disponible | — |
| Estructuras que se confunden | 1 | 2 | 2 | 32 | disponible | — |

## Lecciones

| Lección | Lugar | Sistemas | Nivel | Min | Pasos | Preguntas | Estado |
| --- | --- | --- | ---: | ---: | ---: | ---: | --- |
| `fund-orientacion` Posición anatómica, planos y términos de dirección | Todo el cuerpo | — | 1 | 10 | 7 | 11 | disponible |
| `fund-movimientos` Términos de movimiento | Todo el cuerpo | articular, muscular | 1 | 12 | 8 | 10 | disponible |
| `sis-oseo` El esqueleto: axial y apendicular | Todo el cuerpo | oseo | 1 | 10 | 7 | 10 | disponible |
| `sis-articular` Tipos de articulaciones | Todo el cuerpo | articular | 1 | 11 | 6 | 11 | disponible |
| `sis-muscular` El músculo esquelético: origen, inserción, acción e inervación | Todo el cuerpo | muscular | 1 | 11 | 6 | 10 | disponible |
| `sis-nervioso` Organización del sistema nervioso | Todo el cuerpo | nervioso | 1 | 11 | 6 | 10 | disponible |
| `sis-cardiovascular` Corazón y circulación | Todo el cuerpo | cardiovascular | 1 | 12 | 6 | 11 | disponible |
| `sis-linfatico` El sistema linfático | Todo el cuerpo | linfatico | 1 | 15 | 7 | 16 | disponible |
| `sis-respiratorio` Vías respiratorias y pulmones | Cuello › Laringe, faringe y tiroides; Tórax › Pulmones y pleura | respiratorio | 1 | 11 | 6 | 9 | disponible |
| `sis-digestivo` Tubo digestivo y glándulas anexas | Abdomen › Órganos abdominales; Cabeza › Boca y cavidad oral | digestivo | 1 | 12 | 6 | 11 | disponible |
| `sis-urinario` Riñones, uréteres, vejiga y uretra | Abdomen › Riñones y retroperitoneo; Pelvis y periné › Órganos pélvicos | urinario | 1 | 9 | 5 | 8 | disponible |
| `sis-reproductor-masculino` Sistema reproductor masculino | Pelvis y periné › Órganos pélvicos; Pelvis y periné › Periné y genitales externos | reproductor-masculino | 1 | 9 | 5 | 8 | disponible |
| `sis-reproductor-femenino` Sistema reproductor femenino | Pelvis y periné › Órganos pélvicos; Pelvis y periné › Periné y genitales externos; Tórax › Mama | reproductor-femenino | 1 | 10 | 5 | 8 | disponible |
| `sis-endocrino` Glándulas endocrinas | Todo el cuerpo | endocrino | 1 | 9 | 5 | 9 | disponible |
| `sis-tegumentario` La piel | Todo el cuerpo | tegumentario | 1 | 8 | 5 | 7 | disponible |
| `sis-sentidos` Órganos de los sentidos | Cabeza › Órbita y ojo; Cabeza › Oído | sentidos | 1 | 11 | 6 | 11 | disponible |
| `cab-craneo` Huesos del cráneo y suturas | Cabeza › Cráneo | oseo, articular | 1 | 15 | 8 | 16 | disponible |
| `cab-cara-huesos` Huesos de la cara y mandíbula | Cabeza › Cara | oseo | 1 | 15 | 7 | 19 | disponible |
| `cab-musculos-cara` Músculos de la expresión facial | Cabeza › Cara | muscular, nervioso | 2 | 16 | 6 | 17 | disponible |
| `cab-masticacion` Músculos de la masticación y articulación temporomandibular | Cabeza › Cara | muscular, articular | 2 | 16 | 7 | 13 | disponible |
| `cab-ojo` Órbita, globo ocular y músculos extraoculares | Cabeza › Órbita y ojo | sentidos, muscular, nervioso | 2 | 22 | 8 | 20 | disponible |
| `cab-oido` Oído externo, medio e interno | Cabeza › Oído | sentidos, oseo | 2 | 15 | 8 | 17 | disponible |
| `cab-nariz` La nariz y la cavidad nasal | Cabeza › Nariz y cavidad nasal | respiratorio, oseo, sentidos | 2 | 16 | 8 | 22 | disponible |
| `cab-encefalo` Partes del encéfalo | Cabeza › Encéfalo y meninges | nervioso | 2 | 18 | 8 | 26 | disponible |
| `cab-surcos-lateral` Surcos y giros de la cara lateral | Cabeza › Encéfalo y meninges | nervioso | 3 | 18 | 9 | 42 | disponible |
| `cab-surcos-medial` Surcos y giros de las caras medial e inferior | Cabeza › Encéfalo y meninges | nervioso | 3 | 16 | 8 | 38 | disponible |
| `cab-nervios-craneales` Los doce nervios craneales | Cabeza | nervioso | 2 | 22 | 9 | 18 | disponible |
| `cab-arterias-encefalo` Arterias del encéfalo | Cabeza › Encéfalo y meninges | cardiovascular | 3 | 16 | 7 | 13 | disponible |
| `cab-arterias-corticales` Las ramas de las arterias del encéfalo | Cabeza › Encéfalo y meninges | cardiovascular | 3 | 22 | 11 | 49 | disponible |
| `cab-senos-venosos` La duramadre y los senos venosos | Cabeza › Encéfalo y meninges | cardiovascular, nervioso | 3 | 20 | 8 | 29 | disponible |
| `cab-nucleos-basales` Núcleos basales y diencéfalo | Cabeza › Encéfalo y meninges | nervioso | 3 | 18 | 8 | 25 | disponible |
| `cab-limbico` El sistema límbico | Cabeza › Encéfalo y meninges | nervioso | 3 | 18 | 7 | 29 | disponible |
| `cab-tronco-encefalo` El tronco del encéfalo: relieves y núcleos de los nervios craneales | Cabeza › Encéfalo y meninges | nervioso | 3 | 22 | 9 | 38 | disponible |
| `cab-boca` Boca: dientes, lengua y glándulas salivales | Cabeza › Boca y cavidad oral | digestivo | 2 | 20 | 6 | 17 | disponible |
| `cue-musculos` Músculos del cuello y hueso hioides | Cuello › Músculos del cuello | muscular, oseo | 2 | 17 | 8 | 21 | disponible |
| `cue-visceras` Vísceras del cuello: laringe, faringe, tráquea y tiroides | Cuello › Laringe, faringe y tiroides | respiratorio, digestivo, endocrino | 2 | 20 | 7 | 20 | disponible |
| `cue-vasos` Carótidas y yugulares | Cuello › Vasos y nervios del cuello | cardiovascular | 2 | 16 | 6 | 12 | disponible |
| `cue-ganglios` Nodos linfáticos de la cabeza y el cuello | Cuello › Vasos y nervios del cuello; Cabeza › Cara | linfatico | 2 | 18 | 8 | 19 | disponible |
| `esp-columna` Columna vertebral | Espalda y columna › Columna vertebral | oseo, articular | 1 | 18 | 9 | 22 | disponible |
| `esp-musculos` Músculos de la espalda | Espalda y columna › Músculos de la espalda | muscular | 2 | 18 | 7 | 23 | disponible |
| `esp-medula` Médula espinal, meninges y nervios espinales | Espalda y columna › Médula espinal | nervioso | 2 | 20 | 8 | 15 | disponible |
| `tor-caja` Caja torácica: esternón, costillas y cartílagos | Tórax › Pared torácica | oseo, articular | 1 | 15 | 8 | 16 | disponible |
| `tor-respiracion` Músculos de la respiración: diafragma e intercostales | Tórax › Diafragma; Tórax › Pared torácica | muscular, respiratorio | 2 | 17 | 6 | 15 | disponible |
| `tor-corazon` El corazón: cavidades, válvulas y vasos coronarios | Tórax › Corazón | cardiovascular | 2 | 18 | 8 | 24 | disponible |
| `tor-pulmones` Pulmones, bronquios y pleura | Tórax › Pulmones y pleura | respiratorio | 2 | 18 | 6 | 12 | disponible |
| `tor-mediastino` El mediastino | Tórax › Mediastino | cardiovascular, respiratorio, digestivo, nervioso, linfatico | 3 | 18 | 6 | 14 | disponible |
| `tor-pared-vasos` Vasos y nervios de la pared del tórax | Tórax › Pared torácica; Tórax › Mediastino | cardiovascular, nervioso | 3 | 20 | 9 | 38 | disponible |
| `tor-segmentos` Segmentos broncopulmonares: bronquios, arterias y venas | Tórax › Pulmones y pleura; Tórax › Mediastino | respiratorio, cardiovascular | 3 | 20 | 8 | 32 | disponible |
| `tor-linfaticos` Nodos linfáticos del tórax | Tórax › Mediastino | linfatico | 3 | 18 | 8 | 30 | disponible |
| `abd-pared` Pared abdominal anterolateral | Abdomen › Pared abdominal | muscular | 2 | 16 | 7 | 18 | disponible |
| `abd-tubo-digestivo` El tubo digestivo en el abdomen | Abdomen › Órganos abdominales; Abdomen › Cavidad abdominal y peritoneo | digestivo | 2 | 18 | 7 | 13 | disponible |
| `abd-higado-pancreas` Hígado, vesícula biliar, páncreas y bazo | Abdomen › Órganos abdominales | digestivo, linfatico | 2 | 22 | 9 | 26 | disponible |
| `abd-rinones` Riñones y glándulas suprarrenales | Abdomen › Riñones y retroperitoneo | urinario, endocrino | 2 | 18 | 7 | 16 | disponible |
| `abd-vasos` Aorta abdominal, vena cava inferior y vena porta | Abdomen › Vasos y nervios del abdomen | cardiovascular | 3 | 18 | 6 | 14 | disponible |
| `abd-peritoneo` La cavidad abdominal y el peritoneo | Abdomen › Cavidad abdominal y peritoneo | digestivo | 2 | 20 | 9 | 24 | disponible |
| `abd-linfaticos` Nodos lumbares y viscerales del abdomen, cisterna del quilo | Abdomen › Vasos y nervios del abdomen; Abdomen › Riñones y retroperitoneo | linfatico | 3 | 18 | 7 | 18 | disponible |
| `pel-pelvis-osea` Pelvis ósea | Pelvis y periné › Pelvis ósea; Miembro inferior › Cintura pélvica | oseo, articular | 1 | 16 | 8 | 17 | disponible |
| `pel-suelo` Suelo pélvico y periné | Pelvis y periné › Suelo pélvico; Pelvis y periné › Periné y genitales externos | muscular | 2 | 18 | 6 | 16 | disponible |
| `pel-vasos` Arterias y venas de la pelvis | Pelvis y periné › Vasos y nervios de la pelvis | cardiovascular | 3 | 20 | 9 | 42 | disponible |
| `pel-nervios-linfaticos` Nervios y nodos linfáticos de la pelvis | Pelvis y periné › Vasos y nervios de la pelvis | nervioso, linfatico | 3 | 18 | 8 | 32 | disponible |
| `ms-cintura-escapular` Clavícula y escápula | Miembro superior › Cintura escapular | oseo, articular | 1 | 14 | 9 | 16 | disponible |
| `ms-hombro-musculos` Músculos del hombro: deltoides y manguito rotador | Miembro superior › Hombro; Miembro superior › Cintura escapular | muscular | 1 | 14 | 9 | 14 | disponible |
| `ms-hombro-articulacion` Articulación del hombro | Miembro superior › Hombro | articular | 2 | 18 | 8 | 14 | disponible |
| `ms-axila` La axila | Miembro superior › Axila | cardiovascular, nervioso, linfatico | 2 | 20 | 7 | 15 | disponible |
| `brazo` El brazo: compartimentos anterior y posterior | Miembro superior › Brazo | muscular, oseo, nervioso, cardiovascular | 1 | 18 | 7 | 22 | disponible |
| `ms-codo` El codo y la fosa cubital | Miembro superior › Codo | articular | 2 | 18 | 8 | 14 | disponible |
| `antebrazo` El antebrazo: compartimento anterior | Miembro superior › Antebrazo | muscular, oseo, nervioso, cardiovascular | 2 | 20 | 7 | 22 | disponible |
| `ms-antebrazo-posterior` El antebrazo: compartimento posterior | Miembro superior › Antebrazo | muscular | 2 | 16 | 7 | 13 | disponible |
| `ms-mano-huesos` Huesos de la muñeca y la mano | Miembro superior › Muñeca; Miembro superior › Mano | oseo | 1 | 14 | 7 | 22 | disponible |
| `ms-mano-musculos` Músculos de la mano | Miembro superior › Mano | muscular | 2 | 18 | 6 | 14 | disponible |
| `ms-nervios` Plexo braquial y nervios del miembro superior | Miembro superior › Axila; Miembro superior › Brazo; Miembro superior › Antebrazo; Miembro superior › Mano | nervioso | 2 | 20 | 9 | 23 | disponible |
| `ms-vasos` Arterias y venas del miembro superior | Miembro superior | cardiovascular | 2 | 16 | 6 | 12 | disponible |
| `mi-glutea` Región glútea | Miembro inferior › Región glútea | muscular, nervioso | 2 | 16 | 7 | 16 | disponible |
| `mi-cadera` Articulación de la cadera | Miembro inferior › Cadera | articular | 2 | 18 | 9 | 19 | disponible |
| `mi-huesos` Fémur, rótula, tibia y fíbula | Miembro inferior › Muslo; Miembro inferior › Rodilla; Miembro inferior › Pierna | oseo | 1 | 15 | 7 | 14 | disponible |
| `mi-muslo-anterior-medial` Muslo: compartimentos anterior y medial | Miembro inferior › Muslo | muscular, nervioso | 2 | 18 | 7 | 20 | disponible |
| `mi-muslo-posterior` Muslo: compartimento posterior y fosa poplítea | Miembro inferior › Muslo; Miembro inferior › Rodilla | muscular | 2 | 16 | 7 | 15 | disponible |
| `mi-rodilla` Articulación de la rodilla | Miembro inferior › Rodilla | articular | 2 | 18 | 8 | 18 | disponible |
| `mi-pierna-anterior-lateral` Pierna: compartimentos anterior y lateral | Miembro inferior › Pierna | muscular | 2 | 14 | 6 | 14 | disponible |
| `mi-pierna-posterior` Pierna: compartimento posterior | Miembro inferior › Pierna | muscular | 2 | 16 | 7 | 15 | disponible |
| `mi-pie-huesos-tobillo` Huesos del pie y articulación del tobillo | Miembro inferior › Tobillo; Miembro inferior › Pie | oseo, articular | 1 | 16 | 7 | 22 | disponible |
| `mi-pie-musculos` Músculos del pie | Miembro inferior › Pie | muscular | 2 | 18 | 6 | 14 | disponible |
| `mi-nervios` Nervios del miembro inferior | Miembro inferior › Región glútea; Miembro inferior › Muslo; Miembro inferior › Pierna; Miembro inferior › Pie | nervioso | 2 | 20 | 8 | 19 | disponible |
| `mi-vasos` Arterias y venas del miembro inferior | Miembro inferior | cardiovascular | 2 | 18 | 7 | 14 | disponible |
| `mi-ganglios` Nodos inguinales y poplíteos: el drenaje del miembro inferior | Miembro inferior › Muslo; Miembro inferior › Rodilla | linfatico | 2 | 16 | 8 | 15 | disponible |
| `comp-miembro-superior` Confusiones frecuentes del miembro superior | Miembro superior | muscular, oseo, nervioso, cardiovascular | 2 | 16 | 7 | 21 | disponible |
| `comp-miembro-inferior` Confusiones frecuentes del miembro inferior | Miembro inferior | muscular, oseo, nervioso, cardiovascular, articular | 2 | 16 | 7 | 19 | disponible |

## Límites conocidos

- Las lecciones nuevas están solo en español; las de los módulos antiguos (brazo y antebrazo), en los cinco idiomas, traducidas con IA y sin revisar.
- El modelo no tiene piezas para los accidentes óseos (tubérculos, fosas, surcos): se explican en el texto y se muestran con el hueso entero y la cámara orientada.
- Las estructuras que solo existen en un modelo (órganos genitales, vasos ováricos y uterinos, mama) solo se estudian y se evalúan en ese modelo.
