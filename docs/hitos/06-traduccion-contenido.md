# Hito 6 — Traducción del contenido

Fecha: 2026-11-05. Base: commit `2ab553b` (hito 5, idiomas de la interfaz). Encargo de Carlos: «Yes, translate it» (traducir también el contenido: las descripciones de las fichas y el módulo de estudio) y, tras una pausa por el límite de uso, «Yes, continue».

## 1. Resultado

Todo el contenido que la app muestra en español tiene traducción al **inglés, alemán, francés e italiano**: 2658 textos, 195 162 caracteres en español.

| Contenido | Textos | Caracteres |
|---|---:|---:|
| Módulo del brazo (título, objetivos, fichas, lección, preguntas) | 200 | 16 620 |
| Descripciones de las piezas | 585 | 67 122 |
| Valores de los campos (origen, inserción, acción, inervación, región, sangre…) | 822 | 51 016 |
| Puntos clave | 556 | 42 755 |
| Glosario latino de las etimologías generadas | 382 | 7 657 |
| Etimologías escritas a mano | 66 | 4 376 |
| Descripciones de los grupos | 40 | 5 276 |
| Fuentes: papeles, notas y citas que son frases | 7 | 340 |

- Los **nombres de los grupos** no se tradujeron a mano: salen de las tablas oficiales de nombres del hito 5.
- **Quién tradujo:** Claude (IA), en 28 lotes. **Nadie ha revisado** las traducciones: ni especialistas ni hablantes nativos. En otro idioma, cada ficha termina con «Text translated from Spanish with AI; not yet reviewed by a specialist.» (en su idioma) y el panel Estudiar muestra un aviso.
- **El español no cambia:** sin aviso y con los mismos textos.

## 2. Cómo funciona

- **`web/src/i18n/contenido.js`:** `huella(texto)` (FNV-1a de 32 bits en base 36) es la clave de cada traducción. `tr(es)` devuelve la traducción del idioma actual o el español si falta; `traducido(es)` dice si la hay; `trEtimologia(es, latines)` rehace las etimologías generadas palabra por palabra con el glosario traducido (las escritas a mano se traducen enteras); `trCita(es)` adapta las citas de fuentes; `cargarContenido(id)` descarga la memoria del idioma cuando se elige.
- **`web/public/i18n/contenido-{en,de,fr,it}.json`:** las memorias de traducción (240–259 KB; 86–95 KB comprimidas). Solo se descargan al elegir ese idioma.
- **`web/scripts/contenido-i18n.mjs`:** reúne los textos como los construye la app (`resolvePart` sobre todos los nodos de los modelos, grupos de los metadatos, glosario, módulos y fuentes) y falla si dos textos tienen la misma huella. Uso:
  - sin argumentos: estado (cuántos textos faltan, por tipo);
  - `--lote N [--donde]`: los N siguientes textos sin traducir; con `--donde`, la pieza (y el campo) en que sale cada uno;
  - `--unir F`: añade un lote traducido (`{ huella: [en, de, fr, it] }`);
  - `--comprobar`: termina con error si falta alguna traducción. Forma parte de `npm run check`.
- **Lotes de trabajo:** `build/i18n/lotes/001.json` a `028.json` (no se versionan; lo publicado son las memorias).

## 3. Criterios de traducción

- **Terminología de cada idioma:** inglés con ortografía estadounidense y términos de uso en inglés; alemán con los términos latinos y sus abreviaturas, como en los atlas alemanes (M., N., A., V., Lig., R.); francés con la terminología francesa («terminaison», «loge», «rameau», «Rapports») y su tipografía (espacio antes de «:», «;», «?»; comillas « »); italiano con la suya («compartimento», «ramo», «Rapporti»).
- **Comillas y apóstrofos:** inglés ‘ ’ en el texto y “ ” en las etimologías; alemán ‚ ‘ y „ “; francés « » y “ ”; italiano « » y “ ”; apóstrofo tipográfico (’).
- **Campo «Acción»:** sin sujeto, como en las tablas de anatomía y en el módulo del brazo («Flexes the elbow.», «Beugt den Ellenbogen.», «Fléchit le coude.», «Flette il gomito.»).
- **Género de los pronombres** (alemán, francés, italiano): comprobado con la pieza en que sale cada texto (`--donde`).
- **Datos que dependen del idioma, adaptados en vez de traducidos al pie de la letra:** p. ej. la etimología de «Rótula» o de «Piel» (en inglés y alemán se explica el término latino, sin decir que *skin* o *Haut* vengan del latín), los nombres tradicionales españoles («peroné», «cúbito», «omóplato», «astrágalo») y expresiones como el «hueso de la risa».

## 4. Otros cambios

- **`web/index.html`:** el cuerpo del panel Estudiar ya no lleva `lang="es"` (su contenido está traducido).
- **Separador de las etimologías** según el idioma (`etimologia.separador`: « ; » en francés).
- **Citas de fuentes:** `trCita` adapta «título», «2.ª ed.», «término n.º», «código» y «Wikipedia (en inglés)» a cada idioma (p. ej. «Terminologia Anatomica, 2nd ed. (FIPAT, 2019), term no. 2464»); las tres citas que son frases van en la memoria.
- **`web/package.json`:** `npm run check` incluye `contenido-i18n.mjs --comprobar`.
- **`web/tests/i18n.test.mjs`:** 2 pruebas nuevas (traducción por huella, español si falta, citas en francés, alemán y español; las cuatro memorias publicadas tienen las mismas huellas y ningún texto vacío).

## 5. Pruebas realizadas

**Automáticas:** `npm test` 42 de 42. `npm run check`: «todo correcto» y «sin traducir: 0». `npm run build` correcto (el aviso de tamaño de los trozos ya existía).

**Revisión automática de las traducciones** (script de trabajo, no versionado): que cada traducción termine con la misma puntuación que el español, sin comillas « » en inglés o alemán, sin apóstrofos rectos, con los espacios del francés y sin espacios dobles. Ningún aviso real.

**En el navegador** (Chromium del panel de la app, servidor de desarrollo, modelo masculino):
- **Inglés:** ficha de la bolsa subtendinosa inferior del bíceps femoral (descripción, región, etimología rehecha palabra por palabra, punto clave y aviso de IA) y de la rótula (etimología escrita a mano, adaptada).
- **Alemán:** rótula; panel Estudiar con el aviso, el resumen del módulo y el paso 1 de la lección; sin `lang="es"`.
- **Francés:** cabeza larga del bíceps femoral (acción, inervación, origen, terminación; etimología con « ; ») y cabeza larga del bíceps braquial (ficha del módulo: relaciones, simplificaciones y fuentes con «2e éd.», «terme n°» y « … »).
- **Italiano:** arteria poplítea (región «Coscia e ginocchio», sangre «Ricco di ossigeno», puntos clave).
- **Español:** la rótula, igual que antes y sin aviso.
- Sin errores de consola.

**No probado:** el modelo femenino en cada idioma, cada ficha una por una, lectores de pantalla y teléfonos. Ningún hablante nativo ni especialista ha revisado las traducciones.

## 6. Observaciones sobre el contenido español

> **Actualización (2026-11-06):** Carlos pidió corregirlos («Sí, corrígelos»). Están corregidos; ver el apartado 9. Lo que sigue es lo que se anotó al traducir.

Al traducir aparecieron estos puntos del texto español. **No se cambiaron**; quedan para la revisión:

- **Cuerpo perineal:** «la episiotomía es un corte quirúrgico que evita un desgarro mayor». La episiotomía rutinaria no ha demostrado evitar los desgarros graves; las traducciones dicen «pensado para evitar». Convendría el mismo matiz en español.
- **Labios:** «La piel del labio no tiene pelo ni glándulas sudoríparas». Vale para la parte roja (bermellón), no para toda la piel del labio.
- **Mama:** «La areola tiene glándulas sudoríparas modificadas, las glándulas de Montgomery». Suelen describirse como glándulas sebáceas (areolares).
- **Erratas en nombres españoles:** «Parte palpebral del múculo orbicular del ojo», «Músculo longísmo del cuello» y el valor «Nervio músculocutáneo» (inervación del músculo braquial).

## 7. Limitaciones

- **Traducción automática sin revisar:** puede tener errores de terminología o de estilo. Antes de publicar en otro idioma haría falta una revisión (decisión de Carlos).
- La línea del modelo 3D de las piezas de Z-Anatomy («Z-Anatomy object … refitted to the Anato3D skin») sigue en inglés en todos los idiomas: es la atribución literal que viene de los metadatos del modelo. **[Corregido el 2026-11-06]** Las de las piezas hechas para Anato3D (cinco textos, cuatro en español) sí se traducen; ver el apartado 9.
- Las fechas dentro de las notas de revisión del módulo van en formato ISO («2026-11-02»).
- Si cambia un texto español, su traducción deja de valer (huella distinta) y se muestra en español hasta unir un lote nuevo; `npm run check` lo avisa.
- Elegir un idioma distinto del español descarga unos 90 KB comprimidos más.

## 8. Decisiones de Carlos

- Si las traducciones se revisan (hablantes nativos, especialistas) y por quién.
- Si se corrigen en español los puntos del apartado 6.
- La publicación sigue siendo decisión suya.

## 9. Correcciones del español (2026-11-06)

Encargo de Carlos: «Sí, corrígelos» (los puntos del apartado 6).

**Datos corregidos** (con su traducción a los cuatro idiomas):

| Ficha | Antes | Ahora | Respaldo |
|---|---|---|---|
| Cuerpo perineal | «…la episiotomía es un corte quirúrgico que evita un desgarro mayor.» | «…La episiotomía es un corte quirúrgico en esta zona; la OMS desaconseja hacerla de rutina en los partos vaginales espontáneos.» | OMS, *WHO recommendations: intrapartum care for a positive childbirth experience* (2018): «Routine or liberal use of episiotomy is not recommended for women undergoing spontaneous vaginal birth» (no recomendada; certeza baja; mantenida en las guías de 2023 y 2025). Comprobado el 2026-11-06 en el registro BIGG de la OPS, que es el enlace de la ficha: el PDF de la OMS en IRIS rechaza el acceso automático. Añadida a las fuentes de la ficha (papel «Punto clave»). |
| Labios | «La piel del labio no tiene pelo ni glándulas sudoríparas.» | «La parte roja del labio (bermellón) no tiene pelo ni glándulas sudoríparas.» | Búsqueda web del 2026-11-06 (Wikipedia en inglés, «Vermilion border», y StatPearls). La ficha ya citaba «Lip». |
| Mama | «La areola tiene glándulas sudoríparas modificadas, las glándulas de Montgomery.» | «La areola tiene glándulas sebáceas, las glándulas de Montgomery, que lubrican el pezón y la areola.» | Búsqueda web del 2026-11-06 (glosario de la Universidad de Lancaster y Cleveland Clinic: glándulas areolares, sebáceas). |

**Erratas de la traducción de Z-Anatomy**, corregidas en el pipeline como la de «musculocutáneo» del 2026-11-02:
- `tools/anato3d_fit.py` (`ES_FIXES`): «múculo» → «músculo» y «longísmo» → «longísimo».
- Sistema muscular reconstruido en los dos modelos (`zsh tools/build_all.sh muscular`, primero publicando en una copia con `A3D_PUBLISHED`):
  - la geometría salió **idéntica byte a byte**;
  - cambian 4 nombres por modelo: «Parte palpebral del músculo orbicular del ojo» y «Músculo longísimo del cuello», izquierda y derecha;
  - cambia la inervación de 8 músculos: «Nervio musculocutáneo» (seguía con la errata porque el sistema muscular no se había reconstruido desde el 2026-11-01);
  - también se regeneraron los índices de búsqueda y el manifiesto.
- `web/scripts/check-cards.mjs`: la categoría `errata` detecta también «múculo» y «longísmo», y ahora revisa los valores de los campos además del título y la descripción. Con eso habría detectado la «músculocutáneo» que quedaba.

**Otros cambios:**
- `contenido-i18n.mjs` quita, al unir un lote o con `--limpiar`, las traducciones de textos que ya no existen. Esta vez fueron 4: los tres datos antiguos y la inervación con errata.
- La línea «Modelo 3D» de las piezas hechas para Anato3D se traduce (`tr` en `info.js`; tipo `modelo` en el script).
- Textos: 2664, sin ninguno pendiente.

**Pruebas:**
- `npm test` 42 de 42; `npm run check` «todo correcto» y «sin traducir: 0»; `npm run build` correcto.
- En el navegador, con el modelo femenino:
  - cuerpo perineal en español y en inglés (dato nuevo, fuente de la OMS y nota de consulta);
  - labios y mama en español; labios y cuerpo perineal en italiano;
  - nombres corregidos en español;
  - línea del modelo en francés e italiano;
  - sin errores de consola.
- **No probado:** el modelo masculino en el navegador después de reconstruirlo. Su geometría es idéntica byte a byte y `check-cards` lo revisa entero.
