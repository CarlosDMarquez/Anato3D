---
title: Fuentes de las fichas linfáticas del cuello
date: 2026-11-12
---

# Fuentes de las fichas linfáticas del cuello (2026-11-12)

Qué fuente respalda cada frase de las fichas de los nodos (ganglios) del cuello (`web/src/data/linfatico/cuello.js`): cadena cervical profunda (yugulodigástrico, yugular superolateral, cervicales laterales inferiores profundos, yugulares anteroinferiores), supraclaviculares, cervicales superficiales laterales y anteriores, pretraqueales, paratraqueales cervicales, tiroideos y retrofaríngeos. La app muestra el número de la fuente tras cada frase y la cita literal al pasar el puntero.

Todo es **borrador** redactado con IA (Claude) a partir de las fuentes citadas, **sin revisión de un especialista**.

## Cómo se comprobó

1. Páginas bajadas con `node scripts/linfatico-citas.mjs bajar …` (Wikipedia en inglés y en español, CC BY-SA 4.0; texto plano de la API, sin recuadros ni pies de imagen), registradas con su revisión en `web/src/data/linfatico/comprobadas.js`.
2. `node scripts/linfatico-citas.mjs comprobar`: las 132 citas de este archivo están en su página, palabra por palabra (0 sin encontrar en todo el sistema linfático).
3. `node scripts/check-cards.mjs`: «todo correcto»; 1 aviso de campo pendiente (`Thyroid_nodes` · drena).
4. TeachMeAnatomy no se cita. «Retropharyngeal lymph nodes», «Superficial cervical lymph nodes» y «Supraclavicular lymph nodes» incorporan texto de dominio público del Gray de 1918.

## Decisiones y límites declarados

- **Submandibulares y submentonianos**: el modelo los pasó al grupo `Lymph_nodes_of_neck`, como la TA2 (n.º 5212–5214). Sus fichas (completas y con fuente) siguen en `cabeza.js`, porque una clave solo puede estar en un archivo; allí «En este modelo» ya dice que están en el grupo del cuello.
- **Nodo yugular superolateral y nodos yugulares anteroinferiores**: ninguna fuente libre los describe por separado. Su pertenencia al grupo superior o inferior se toma de la TA2 (5225/5227 y 5229/5232) y el resto de la ficha usa lo que se dice de los cervicales profundos superiores o inferiores; las dos fichas lo declaran.
- **No representados**: el nodo yugular superoanterior (5228), el yugulo-omohioideo (5230), el yugular lateroinferior (5231), los infrahioideos (5218) y los prelaríngeos (5219) no están en Z-Anatomy. Se dice en «En este modelo» de la ficha más cercana.
- **Paratraqueales cervicales**: una sola pieza impar, aunque la fuente describe una cadena derecha y otra izquierda. No confundir con los paratraqueales torácicos (5260).
- **Cervicales superficiales anteriores**: una pieza impar con nodos a los dos lados. Ninguna fuente da sus eferentes concretos; solo se afirma, con fuente, que toda la linfa de la cabeza y el cuello acaba en los cervicales profundos.
- **Niveles clínicos (I–VI)**: van en `notas`, como equivalencia; el modelo sigue los grupos de la TA.
- **Nodo de Virchow y signo de Troisier**: nota breve con fuente, sin consejo clínico.

## Contraste con la tabla de drenaje del encargo

- Confirmadas: Retropharyngeal → cervicales profundos superiores; Submandibular → cervicales profundos superiores (yugulodigástrico incluido); Submental → Submandibular y cadena yugular; cadena profunda → Jugular_trunk; Jugular_trunk_R → ángulo venoso derecho y Jugular_trunk_L → conducto torácico; Paratracheal_cervical → cervicales profundos.
- Matizadas: Pretracheal → «cervicales profundos a la derecha y conducto torácico a la izquierda» (`wp:Pretracheal_lymph_nodes`); superiores → «inferiores **o** directamente el tronco yugular» (`wp:Superior_deep_cervical_lymph_nodes`).
- Contradicha: Superficial_lateral_cervical → la fuente dice que drenan en los **supraclaviculares** y de ahí al tronco yugular (`wp:Superficial_lateral_cervical_lymph_nodes`); el modelo los lleva a los cervicales laterales inferiores profundos.
- Sin fuente: Jugulodigastric → Lateral_superior_jugular (dentro del grupo superior); Thyroid_nodes → cervicales profundos inferiores; Superficial_anterior_cervical → cervicales profundos inferiores (solo el principio general).

## Páginas

| Fuente | Página | Revisión | Citas |
|---|---|---|---|
| wp:Cervical_lymph_nodes | Cervical lymph nodes | 1360586838 | 18 |
| wp:Inferior_deep_cervical_lymph_nodes | Inferior deep cervical lymph nodes | 1301078565 | 12 |
| wp:Superior_deep_cervical_lymph_nodes | Superior deep cervical lymph nodes | 1331269900 | 11 |
| wp:Deep_cervical_lymph_nodes | Deep cervical lymph nodes | 1322812686 | 10 |
| wp:Retropharyngeal_lymph_nodes | Retropharyngeal lymph nodes | 1224152509 | 8 |
| wp:Jugulodigastric_lymph_node | Jugulodigastric lymph node | 1292012926 | 7 |
| wp:Superficial_lateral_cervical_lymph_nodes | Superficial lateral cervical lymph nodes | 1252113790 | 7 |
| wp:Supraclavicular_lymph_nodes | Supraclavicular lymph nodes | 1246099323 | 6 |
| wp:Paratracheal_lymph_nodes | Paratracheal lymph nodes | 1301166640 | 5 |
| wp:Pretracheal_lymph_nodes | Pretracheal lymph nodes | 1360729985 | 5 |
| wp:Anterior_cervical_lymph_nodes | Anterior cervical lymph nodes | 1312740783 | 4 |
| wp:Jugular_trunk | Jugular lymph trunk | 1223570811 | 4 |
| wp:Thyroid_lymph_nodes | Thyroid lymph nodes | 1326048541 | 4 |
| wp:Jugulo-omohyoid_lymph_node | Jugulo-omohyoid lymph node | 1325479718 | 3 |
| wpes:Glándula_tiroides | Tiroides | 175061725 | 3 |
| wp:Anterior_jugular_vein | Anterior jugular vein | 1361390296 | 2 |
| wp:Deep_anterior_cervical_lymph_nodes | Deep anterior cervical lymph nodes | 1335500313 | 2 |
| wp:Internal_jugular_vein | Internal jugular vein | 1351838711 | 2 |
| wp:Occipital_lymph_nodes | Occipital lymph nodes | 1315085330 | 2 |
| wp:Submandibular_lymph_nodes | Submandibular lymph nodes | 1285412030 | 2 |
| wp:Submental_lymph_nodes | Submental lymph nodes | 1370068512 | 2 |
| wp:Superficial_anterior_cervical_lymph_nodes | Superficial anterior cervical lymph nodes | 1326048524 | 2 |
| wp:Thoracic_duct | Thoracic duct | 1360742155 | 2 |
| wp:Thyroid | Thyroid | 1385028466 | 2 |
| wpes:Nódulo_de_Virchow | Nódulo de Virchow | 152132846 | 2 |
| wp:External_jugular_vein | External jugular vein | 1338445854 | 1 |
| wp:Mastoid_lymph_nodes | Mastoid lymph nodes | 1319318381 | 1 |
| wp:Rouvière_node | Henri Rouvière | 1319740911 | 1 |
| wp:Superficial_cervical_lymph_nodes | Superficial cervical lymph nodes | 1252113728 | 1 |
| wp:Supraclavicular_fossa | Supraclavicular fossa | 1225486521 | 1 |

Además, `TA(n)` cita la Terminologia Anatomica 2 (`sources/z-anatomy/TA2.csv`) para nombres y grupos: 5212, 5216, 5219–5222, 5224–5234, 5260.
