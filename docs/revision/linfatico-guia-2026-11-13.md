---
title: Guía para la revisión del sistema linfático
fecha: 2026-11-13
estado: preparado-sin-revisiones
---

# Guía para la revisión del sistema linfático de Anato3D

## 1. Qué es Anato3D

Anato3D es una aplicación web gratuita de anatomía humana en 3D para estudiantes. Tiene un modelo de hombre y otro de mujer, divididos por sistemas, con una ficha para cada pieza y una biblioteca de lecciones.

**Todo el contenido que va a revisar es un borrador.** Lo redactó una IA (Claude) a partir de fuentes libres citadas: sobre todo Wikipedia en inglés y en español, en una versión concreta de cada página, y la Terminologia Anatomica 2 (TA2) para los nombres. Un programa comprobó que cada cita está palabra por palabra en su página. **Nadie ha comprobado todavía que lo que se afirma sea correcto**: eso es lo que se le pide.

## 2. Qué se le pide

Que diga, afirmación por afirmación, si lo que enseña la app sobre el sistema linfático es correcto.

**Alcance de esta primera revisión (4–6 h):** las fichas del sistema linfático, en la hoja [linfatico-fichas-2026-11-13.md](linfatico-fichas-2026-11-13.md). Son 131 fichas y 12 fichas de grupo, con unas 1500 filas. Unas 380 repiten una frase que ya salió antes y unas 70 son campos sin dato. Cada fila es una afirmación que la app muestra: el nombre y el latín, la descripción y los campos «Localización», «Reparo», «Recibe», «Drena en», «En este modelo» y «Puntos clave».

**Prioridades, en este orden:**

1. **Vía central y colectores** (L-VC): conducto torácico, cisterna del quilo, conducto linfático derecho, troncos y colectores regionales.
2. **Cuello** (L-CUE): la cadena cervical profunda, los supraclaviculares y el resto de grupos del cuello.
3. **El resto de regiones**: cabeza, miembro superior, tórax, abdomen, pelvis, miembro inferior y órganos (bazo, timo y amígdalas). Revise primero las filas de nombre y latín, «Localización», «Recibe» y «Drena en», y las marcadas **[INTERPRETACIÓN]** o **[DIFIERE DE LA FUENTE]**.
4. Si sobra tiempo: «Descripción», «Reparo», «En este modelo» y, al final, «Puntos clave».

**Fuera de esta primera revisión:** las seis lecciones del linfático ya tienen su hoja, con el mismo sistema de veredictos. Son unas 590 filas más, ≈ 3–4 h, para una segunda revisión si usted y Carlos lo acuerdan:

| Lección | Hoja |
| --- | --- |
| El sistema linfático (básico) | [lecciones/sis-linfatico-v2.md](lecciones/sis-linfatico-v2.md) |
| Nodos linfáticos de la cabeza y el cuello | [lecciones/cue-ganglios-v1.md](lecciones/cue-ganglios-v1.md) |
| Nodos linfáticos del tórax | [lecciones/tor-linfaticos-v2.md](lecciones/tor-linfaticos-v2.md) |
| El mediastino | [lecciones/tor-mediastino-v2.md](lecciones/tor-mediastino-v2.md) |
| Nodos lumbares y viscerales del abdomen, cisterna del quilo | [lecciones/abd-linfaticos-v1.md](lecciones/abd-linfaticos-v1.md) |
| Nodos inguinales y poplíteos | [lecciones/mi-ganglios-v1.md](lecciones/mi-ganglios-v1.md) |

## 3. Qué NO se le pide

- No tiene que revisar el código ni los archivos técnicos.
- No tiene que medir la geometría al milímetro. Basta con que, si mira el modelo, diga si algo está claramente en un sitio equivocado o puede confundir a un estudiante.
- **Las simplificaciones ya declaradas** (filas marcadas **[ESQUEMÁTICO]**, **[VARIANTE]**, **[NO REPRESENTADO]** y la lista del apartado 6) **no son errores**, salvo que enseñen algo falso. Si una le parece engañosa, márquela «Corregir» y diga por qué.
- No tiene que aportar los datos de los campos **[PENDIENTE]**. Es opcional: si conoce el dato, escríbalo en «Comentario» con su referencia.
- No revisa las traducciones a otros idiomas ni el uso clínico: Anato3D es una herramienta de estudio.

## 4. Cómo usar las hojas

Cada fila tiene:

- un **código estable**: L-CUE-012 es la afirmación 12 del cuello. Con él, usted y quien corrija hablan de lo mismo;
- el **campo** de la ficha;
- la **afirmación**: el texto exacto que muestra la app;
- la **fuente**: la cita literal (abreviada a 160 caracteres) y el enlace a la versión de la página que se leyó. Los términos de la TA2 enlazan al visor de la TA2; busque allí el número;
- **Veredicto** y **Comentario**.

En «Veredicto», cambie «Sin revisar» por una de estas opciones:

| Veredicto | Cuándo | Qué escribir en «Comentario» |
| --- | --- | --- |
| **Correcto** | La afirmación es correcta para un estudiante de grado | Nada (o una nota si quiere) |
| **Corregir** | Es falsa, imprecisa o engañosa | La corrección, y si puede, una referencia (libro y página o artículo) |
| **Dudoso** | No está seguro o depende de la escuela o de la fuente | La duda |

**Marcas:**

- **[ESQUEMÁTICO]**: lo dice el propio modelo.
- **[VARIANTE]**: variante elegida para enseñar.
- **[INTERPRETACIÓN]**: la ficha equipara un término de la TA2 con lo que una fuente describe con otro nombre. Conviene mirarlas con atención.
- **[DIFIERE DE LA FUENTE]**: el modelo 3D no sigue del todo la fuente y la ficha lo avisa.
- **[NO REPRESENTADO]**: un grupo de la TA2 que no tiene pieza en el modelo.
- **[LATÍN FORMADO]**: latín descriptivo hecho para Anato3D, porque la TA2 no tiene término.
- **[PENDIENTE]**: dato que la ficha no da por falta de fuente.

Las filas cuyo veredicto ya dice **«= L-…»** repiten una frase revisada antes, con las mismas fuentes, en una región de igual o mayor prioridad. Vale el veredicto de esa fila; cámbielo solo si en esta ficha no encaja.

Al principio de la hoja hay un **índice**: número de afirmaciones por región y tiempo estimado.

Al principio de cada región están los enlaces a su tabla de fuentes:

- [linfatico-centrales-2026-11-11.md](../fuentes/linfatico-centrales-2026-11-11.md)
- [linfatico-cabeza.md](../fuentes/linfatico-cabeza.md)
- [linfatico-cuello.md](../fuentes/linfatico-cuello.md)
- [linfatico-miembro-superior.md](../fuentes/linfatico-miembro-superior.md)
- [linfatico-torax.md](../fuentes/linfatico-torax.md)
- [linfatico-abdomen.md](../fuentes/linfatico-abdomen.md)
- [linfatico-pelvis.md](../fuentes/linfatico-pelvis.md)
- [linfatico-miembro-inferior.md](../fuentes/linfatico-miembro-inferior.md)

Esas tablas explican cada decisión de redacción, por si quiere saber por qué una ficha dice algo.

Las dudas generales (el uso de «nodo» en lugar de «ganglio», la variante elegida para la vía central, el nivel, lo que falta o sobra) tienen su sitio en «Decisiones pendientes» (L-D1 a L-D5), al final de la hoja, antes de la firma.

## 5. Cómo ver el modelo

**En la app (navegador de escritorio):**

1. En la pantalla de inicio, pulse **Iniciar**.
2. En la barra de sistemas, encienda **Linfático**.
3. En **Capas del sistema**, elija:
   - **Completo**: todo;
   - **Nodos y vasos**;
   - **Conductos y troncos**: la vía central;
   - **Órganos**: bazo, timo y amígdalas.
4. Para ver la vena yugular interna o el ángulo venoso, encienda también **Venoso**. El linfático no las muestra solo.
5. Para ir a una estructura, use **Buscar**: escriba el nombre o el término latino, por ejemplo «yugulodigástrico» o «cisterna».
6. Pulse una pieza para abrir su **ficha**; **Ver ficha completa** muestra todos los campos. Cada frase lleva el número de su fuente; al pasar el puntero por el número se ve la cita literal. La ficha que ve en la app es la misma que la de la hoja.
7. El modelo de hombre y el de mujer tienen el mismo sistema linfático, con pequeñas diferencias de colocación.

**Si aún no hay web pública**, Carlos le enviará las capturas, hechas con los dos modelos:

- **Ganglios por región:** `build/linfatico/capturas/`: cuello de los dos lados, submentón, axila, tórax por detrás, abdomen, ingle y cuerpo entero; del modelo de mujer, cuello, ingle y espalda.
- **Vasos:** `build/linfatico/capturas/vasos/`: vía central de frente y de lado, mediastino, cisterna, ángulos venosos, codo, pelvis y hueco poplíteo.
- **Vía central resaltada en amarillo:** `build/linfatico/capturas/vasos/resaltado/`.

Cada región de la hoja enlaza sus capturas.

## 6. Simplificaciones y defectos conocidos del modelo 3D

Resumen del documento técnico del hito 9 ([../hitos/09-sistema-linfatico.md](../hitos/09-sistema-linfatico.md)). Todo esto ya está declarado: no hace falta anotarlo, salvo que le parezca que enseña algo falso.

**Ganglios (657 en 193 piezas por modelo)**

- **Forma:** elipsoides algo arriñonados con un hilio.
- **Tamaño:** uno por grupo, dentro del intervalo normal publicado, pero no son medidas de una persona (p. ej., yugulodigástrico 14 mm, axilares 9–11 mm, paraesternales 4 mm).
- **Número:** el de cada grupo es representativo, no el real.
- **Recolocados a mano (posición esquemática de manual):** lumbares a su lado de la aorta o la cava, supratrocleares, lacunares, inguinales profundos, submentonianos e inguinales superficiales.
- **Tocan otras estructuras:** unas decenas tocan un vaso, un músculo o un órgano, casi todos en menos de 4 mm. El caso mayor es el **nodo tibial anterior**, metido 22–25 mm en los músculos de la pierna, porque la arteria tibial anterior del modelo va por dentro del músculo.
- **Sitio con respecto a sus reparos:**
  - Algunos **yugulares anteroinferiores** quedan por detrás del borde del esternocleidomastoideo.
  - El **inguinal profundo intermedio** queda delante de la vena femoral y no por dentro.
  - Los **submentonianos** solo cumplen la mitad de las relaciones medidas.
- **Asimetría:** los yugulares anteroinferiores no son un espejo exacto entre los dos lados (13–15 mm), ni el yugular superolateral en la mujer (9 mm). No cabían igual junto a las yugulares del modelo.
- **Sin pieza en el modelo** (no están en Z-Anatomy): broncopulmonares (hiliares), prelaríngeos, yugular superoanterior, yugulo-omohioideo, yugular lateroinferior, infrahioideos, malar, hepáticos, mesentéricos inferiores alrededor de la arteria y anorrectales superiores. Las amígdalas faríngea, lingual y tubárica tienen ficha, pero aún no están construidas.

**Vía central** (Z-Anatomy no la trae; son tubos generados para Anato3D con trazado esquemático)

- **Variante clásica:**
  - un solo conducto torácico con una sola desembocadura, en el ángulo venoso izquierdo;
  - los troncos izquierdos acaban en el final del conducto torácico (a menudo se abren aparte en la vena);
  - los tres troncos derechos forman un conducto linfático derecho corto (con frecuencia no existe y se abren por separado).
- **Cisterna del quilo:** saco de 50 mm de L2 a L1, con 6 mm de ancho, el valor bajo de lo publicado, porque no cabe más en el modelo. Roza vasos lumbares y la renal derecha del modelo.
- **Conducto torácico:**
  - roza la pleura derecha en T9–T7;
  - en la mujer cruza la línea media más abajo (T8–T7) que en el hombre (T6–T5);
  - mide 34–37 cm y 3,4 mm de calibre (con abombamientos que sugieren las válvulas).
- **Troncos subclavios:** largos (14–16 cm), porque los nodos apicales axilares de Z-Anatomy están lejos, cerca de la coracoides.
- **Tronco lumbar izquierdo:** pasa por detrás y a la izquierda de la aorta, no justo detrás.

**Colectores** («Vasos linfáticos de…», 18 piezas)

- **Mallas esquemáticas** por región y lado, que unen los grupos según una tabla de drenaje y siguen a su vena guía. No son vasos medidos ni dicen cuántos hay.
- **Origen en muñeca y tobillo:** esquemático.
- **Vías que no siguen la fuente:** las fichas avisan de los pocos colectores que no siguen la vía que da la fuente (filas **[DIFIERE DE LA FUENTE]**).

## 7. Tiempo estimado

La estimación es de ≈ 20 s por afirmación sencilla, 40 s por una larga o con varias citas, 10 s por el nombre y 5 s por una repetida. El índice de la hoja da las cifras exactas por región. Revisarlo todo serían ≈ 7 h, así que el plan es este:

| Bloque | Qué | Tiempo |
| --- | --- | ---: |
| 0 | Leer esta guía y abrir la app o las capturas | ≈ 15 min |
| 1 | **Vía central y colectores** (L-VC) completa | ≈ 1 h 20 min |
| 1 | **Cuello** (L-CUE) completo | ≈ 40 min |
| 2 | Resto de regiones: Nombre, «Localización», «Recibe», «Drena en» y filas **[INTERPRETACIÓN]** / **[DIFIERE DE LA FUENTE]** | ≈ 2 h 15 min |
| 3 | Si sobra tiempo, en este orden: «Reparo», «En este modelo», «Descripción» (también la de los grupos) y «Puntos clave» | ≈ 3 h en total; lo que quepa |

**Con 4 h:** bloques 0–2. **Con 6 h:** bloques 0–2 y parte del 3. Lo que no dé tiempo a revisar se queda «Sin revisar»: no pasa nada, se revisará en otra ronda.

## 8. Cómo devolverlo

Puede devolverlo de cualquiera de estas formas:

- **La hoja rellenada:** el archivo `.md` editado (cualquier editor de texto) o la hoja impresa o en PDF con anotaciones.
- **Una lista corta:** solo las filas «Corregir» o «Dudoso», con su código y su comentario, más el **alcance revisado** (qué regiones o qué códigos). Todo lo que esté dentro de ese alcance y no aparezca en la lista se tomará como «Correcto».

En los dos casos, rellene la **firma de la revisión**, al final de la hoja: nombre, formación y cargo, fecha, alcance y conclusión.

Carlos aplicará las correcciones. Si alguna no queda clara, le preguntará antes de cambiar nada.

## 9. Cómo se le acreditará

- Si usted lo acepta, su nombre aparecerá en los **Créditos** de la app como **revisor del sistema linfático**, con la fecha y **solo de lo que haya revisado**. Por ejemplo: «Fichas de la vía central y del cuello revisadas por…». Si lo prefiere, puede no figurar.
- Lo que haya revisado se marcará como revisado, con su nombre y la fecha, una vez aplicadas sus correcciones. Lo que no haya revisado seguirá marcado como borrador.
- **Acreditarle no le hace responsable del uso clínico** del contenido ni de cambios posteriores a su revisión. Anato3D es una herramienta de estudio; la propia app avisa de que no sustituye la consulta con profesionales de la salud. Si más adelante se cambia algo de lo revisado, ese cambio no llevará su nombre hasta que alguien lo revise.
