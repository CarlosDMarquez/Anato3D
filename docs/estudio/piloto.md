---
title: Protocolo del piloto educativo de «Estudiar» y Neuri
fecha: 2026-11-09
estado: preparado-sin-realizar
---

# Protocolo del piloto educativo de «Estudiar» y Neuri

Protocolo y materiales para un piloto pequeño con estudiantes y un docente de anatomía (especificación, sección 28). Usa los módulos de **brazo** y **antebrazo** y **una lección personalizada** creada por Neuri.

**Estado:** preparado, sin realizar. No hay participantes, docente, resultados ni aprobaciones; no se ha contactado a nadie. Este documento no lo sustituye: organizarlo y contactar a las personas depende de Carlos.

**Qué es y qué no es:**
- **Sirve para** detectar problemas (de orientación, comprensión, contenido, carga y navegación) y obtener señales de aprendizaje y satisfacción.
- **No demuestra eficacia:** con pocos participantes y sin grupo de comparación no permite conclusiones causales ni estadísticas. Una evaluación comparativa necesitaría otro diseño y otra muestra.

## 1. Objetivos

1. **Orientación:** ¿encuentra el estudiante cómo empezar y qué hacer después sin ayuda? (primer inicio útil: tiempo hasta empezar una lección).
2. **Comprensión del contenido:** ¿se entienden las explicaciones, las preguntas y los estados del progreso?
3. **Aprendizaje inmediato y recuerdo:** desempeño antes, justo después y una semana después en preguntas equivalentes a las de la app, y en vistas 3D nuevas.
4. **Lección personalizada:**
   - ¿se entiende que es un borrador generado con IA?
   - ¿se estudia igual que las demás?
   - ¿qué errores detecta el docente?
5. **Problemas:** lista priorizada de problemas de contenido, carga, navegación y técnicos.
6. **Satisfacción**, junto con los resultados de aprendizaje, nunca en su lugar.

## 2. Participantes y funciones

| Quién | Cuántos | Qué hace |
| --- | --- | --- |
| Estudiantes | 5 a 8 | Estudian con la app y hacen las pruebas. **Perfil:** estudiantes de anatomía que aún no hayan estudiado a fondo el brazo y el antebrazo. Participación voluntaria y sin efecto en sus notas |
| Docente de anatomía | 1 | **Antes:** revisa el contenido que se usará (sección 4) y valida las preguntas de las pruebas. **Durante:** observa o atiende dudas de contenido. **Después:** interpreta los resultados |
| Observador (Carlos u otra persona) | 1 | Prepara los equipos, da las instrucciones, cronometra y anota en la hoja de observación. No ayuda salvo bloqueo (y lo anota) |

Cada estudiante recibe un código (P01, P02…). Los nombres no se anotan en ninguna hoja de datos.

## 3. Calendario

| Momento | Duración | Qué |
| --- | --- | --- |
| Antes | 1–2 semanas | Revisión docente del contenido, validación de las pruebas, lección personalizada preparada y revisada, equipos preparados (sección 4) |
| Día 1, sesión 1 | ~90 min | Consentimiento (5 min) · prueba inicial (15 min) · estudio con la app y tareas (50 min) · prueba final (15 min) · cuestionario de satisfacción (5 min) |
| Día 8, sesión 2 | ~25 min | Prueba de recuerdo (15 min) · entrevista breve (10 min) |

Entre las dos sesiones los estudiantes no deberían estudiar estos temas con la app ni con otros materiales: se les pide, no se controla, y se pregunta en la entrevista.

## 4. Preparación (lista de comprobación)

- [ ] **El docente ha revisado** al menos las partes de `docs/revision/brazo-2026-11-09.md` y `antebrazo-2026-11-09.md` que se usarán. Los errores materiales están corregidos o retirados.
- [ ] **El docente ha validado** las preguntas de la sección 7: son correctas, de dificultad equivalente entre formas y no reproducen las de la app.
- [ ] **La lección personalizada está preparada.** Neuri necesita la IA real: con la clave configurada (guía operativa, apartado 2), crear una lección sobre un tema cercano. Por ejemplo: «Créame una lección corta sobre los nervios del codo». Después:
  1. exportarla con «Mis lecciones → Descargar»;
  2. generar su hoja (`npm run hoja-revision -- --archivo <archivo>`) para que la revise el docente;
  3. importarla en cada equipo del piloto.

  **Sin clave, esta parte del piloto no se puede hacer.**
- [ ] **Los equipos están preparados.** Mientras no haya web publicada, el piloto se hace en ordenadores con la app en marcha:
  - `npm run preview`, tras `npm run build`;
  - navegador sin datos previos de Anato3D (o «Borrar mis datos de estudio»);
  - modelos cargados, y comprobado que la lección personalizada se abre.
- [ ] **El consentimiento** (sección 8) está impreso o listo para firmar.
- [ ] **La institución:** comprobado si el piloto necesita algún permiso o revisión ética de la institución del docente. Este protocolo no la sustituye.

## 5. Tareas de la sesión 1

Se leen al estudiante una a una. Se le pide que piense en voz alta, si acepta. El observador anota tiempos y problemas en la hoja de la sección 9.

| Tarea | Instrucción | Qué se observa |
| --- | --- | --- |
| T1 | «Entra en Anato3D y empieza a estudiar el brazo.» | Tiempo hasta la primera lección empezada; por dónde entra (buscador, Explorar, Neuri) |
| T2 | «Estudia la lección del brazo hasta el final y evalúate.» | Comprensión de los pasos y del visor; uso de fuentes y «Saber más»; resultado por objetivo |
| T3 | «Busca lo del antebrazo, quédate solo con lecciones de músculos, estudia el compartimento anterior y evalúate.» | Uso de filtros; volver al catálogo; resultado |
| T4 | «Abre tu mapa de aprendizaje y explícame qué te está costando.» | ¿Entiende «practicando», «demostrada» y los motivos de cada dificultad? |
| T5 | «Haz el repaso que te propone la app.» | Respuesta breve escrita; «Prefiero ver opciones»; carga |
| T6 | «En Mis lecciones hay una lección hecha con Neuri. Ábrela, estúdiala y dime qué tipo de lección es.» | ¿Ve que es un borrador generado con IA y sin revisar? ¿La estudia igual que las demás? |
| T7 | «Si has visto algo mal o raro, repórtalo; si no, reporta cualquier pregunta como prueba.» | ¿Encuentra «Reportar un problema»? ¿Entiende las categorías? |

Si una tarea se bloquea más de 3 minutos, el observador ayuda, lo anota como bloqueo y se pasa a la siguiente.

## 6. Medidas

| Qué | Cómo | Cuándo |
| --- | --- | --- |
| Conocimiento | Pruebas equivalentes (sección 7): forma A o B, contrabalanceadas | Antes, después y una semana después |
| Desempeño en la app | Resultados por objetivo de las evaluaciones del brazo y del antebrazo (en pantalla) y, si el estudiante acepta, su archivo «Mis datos» exportado al final de cada sesión | Sesiones 1 y 2 |
| Problemas | Hoja de observación (sección 9), con categoría y gravedad | Sesión 1 |
| Tiempos | Primer inicio útil (T1) y duración de cada tarea | Sesión 1 |
| Satisfacción | Cuestionario (sección 10) | Final de la sesión 1 |
| Contexto | Entrevista breve: ¿estudió estos temas entre sesiones? ¿qué recuerda haber usado? | Sesión 2 |

**Estadísticas de uso de la app:** están desactivadas por defecto. Solo se activan si el estudiante lo acepta expresamente. Se descargan desde «Mis datos y privacidad» y no salen de su equipo de otra forma. No se graba la pantalla salvo consentimiento expreso.

**Contrabalanceo:**
- estudiantes impares (P01, P03…): A antes, B después, A una semana después;
- estudiantes pares: B antes, A después, B una semana después.

**Limitación:** la prueba de recuerdo repite la forma inicial. Una tercera forma lo evitaría.

## 7. Pruebas de conocimiento

**Solo para el docente y el observador: no compartir con los estudiantes.**

**Reglas:**
- Las preguntas miden los mismos objetivos que la app, con otra formulación. Ninguna es una pregunta de la app copiada, y las respuestas de este instrumento no se enseñan durante el estudio.
- Las de 3D se hacen en el visor libre, fuera de las lecciones: sin etiquetas y desde vistas distintas de las de los pasos.
- Todo lo que se pregunta está en el contenido de los módulos: en las fichas o en los pasos, y por tanto en sus hojas de revisión.
- **Son un borrador que el docente debe validar** antes de usarlas, y puede cambiarlas.

**Puntuación:**
- 1 punto por respuesta correcta y 0 por incorrecta o en blanco;
- en las de nombrar, el docente decide antes qué sinónimos acepta (p. ej., «braquial anterior»);
- 18 puntos por forma: 6 de 3D y 12 de texto.

### Identificación en 3D

El observador:
1. muestra en el visor el sistema muscular superficial, el esquelético y, si hace falta, el nervioso o el arterial;
2. gira a la vista indicada;
3. deja la estructura a la vista y señalada **sin que se vea su nombre**. Puede seleccionarla y tapar su ficha, o usar las acciones de la ficha: ocultar lo que la tapa, volverlo transparente o aislarla. Antes de la sesión se ensaya cada vista;
4. pregunta «¿Cómo se llama esta estructura?». La respuesta es libre.

| N.º | Objetivo | Forma A: estructura y vista | Forma B: estructura y vista |
| ---: | --- | --- | --- |
| 1 | Brazo O1 | Músculo braquial, vista lateral, con el bíceps oculto | Músculo coracobraquial, vista medial del brazo |
| 2 | Brazo O4 | Nervio radial, vista posterior del húmero | Nervio ulnar, vista posteromedial del codo |
| 3 | Brazo O3 | Arteria braquial, vista medial | Nervio musculocutáneo, vista anterior con el bíceps translúcido |
| 4 | Antebrazo O1 | Músculo flexor radial del carpo, vista anterior oblicua | Músculo palmar largo, vista anterior oblicua |
| 5 | Antebrazo O1 | Músculo pronador cuadrado, vista anterior distal con los flexores superficiales ocultos | Músculo flexor largo del pulgar, vista anterolateral con los flexores superficiales ocultos |
| 6 | Antebrazo O1 | Ulna, vista posterior | Radio, vista posterior |

### Preguntas de texto

Respuesta breve escrita (o elección entre 4, si el docente lo prefiere: los distractores, del mismo tipo).

| N.º | Objetivo | Forma A | Respuesta A | Forma B | Respuesta B |
| ---: | --- | --- | --- | --- | --- |
| 7 | Brazo O3 | ¿Qué nervio inerva los músculos del compartimento posterior del brazo? | Nervio radial | ¿Qué nervio inerva los músculos del compartimento anterior del brazo? | Nervio musculocutáneo |
| 8 | Brazo O2 | ¿Qué movimiento produce el músculo braquial? | Flexión del codo | ¿Qué movimiento produce el tríceps braquial? | Extensión del codo |
| 9 | Brazo O3 | ¿Cuál es la arteria principal del compartimento anterior del brazo? | Arteria braquial | ¿De qué arteria es rama la arteria braquial profunda? | De la arteria braquial |
| 10 | Brazo O4 | ¿Por qué cara del húmero baja el nervio radial, en su surco? | Por la cara posterior | ¿Detrás de qué relieve del húmero pasa el nervio ulnar en el codo? | El epicóndilo medial |
| 11 | Brazo O2 | De bíceps braquial, braquial, coracobraquial y tríceps braquial: ¿cuál se inserta en el radio? | Bíceps braquial (tuberosidad del radio) | De bíceps braquial, braquial, coracobraquial y tríceps braquial: ¿cuál se inserta en el olécranon? | Tríceps braquial |
| 12 | Antebrazo O2 | ¿En qué capa del compartimento anterior está el pronador cuadrado? | Profunda | ¿En qué capa del compartimento anterior está el palmar largo? | Superficial |
| 13 | Antebrazo O3 | ¿Qué nervio inerva el pronador redondo? | Nervio mediano | ¿Qué nervio inerva el flexor radial del carpo? | Nervio mediano |
| 14 | Antebrazo O4 | ¿Qué músculos del compartimento anterior del antebrazo inerva el nervio ulnar? | Flexor ulnar del carpo y mitad medial del flexor profundo de los dedos | ¿Qué músculos inerva el nervio interóseo anterior? | Flexor largo del pulgar, mitad lateral del flexor profundo de los dedos y pronador cuadrado |
| 15 | Antebrazo O3 | ¿Qué hace el flexor ulnar del carpo en la muñeca? | La flexiona y la lleva hacia el lado de la ulna (aducción) | ¿Qué hace el flexor radial del carpo en la muñeca? | La flexiona y la lleva hacia el lado del radio (abducción) |
| 16 | Antebrazo O5 | ¿En qué dos arterias se divide la arteria braquial, en la fosa cubital? | Radial y ulnar | ¿Qué arteria irriga la parte posterolateral del antebrazo? | Arteria radial |
| 17 | Antebrazo O1 | De los dos huesos del antebrazo, ¿cuál es el lateral? | Radio | De los dos huesos del antebrazo, ¿cuál es el medial? | Ulna |
| 18 | Antebrazo O3 | ¿Dónde se insertan los tendones del flexor profundo de los dedos? | En las falanges distales de los cuatro dedos | ¿Dónde se inserta el flexor largo del pulgar? | En la base de la falange distal del pulgar |

**Lección personalizada:** su contenido depende de lo que cree Neuri, así que no entra en estas pruebas. Se evalúa con la evaluación de la propia lección en la app (T6) y con la hoja de revisión del docente.

## 8. Consentimiento informado (modelo)

Para adaptar con el docente y la institución:

> **Prueba de la aplicación de estudio Anato3D**
>
> Te invitamos a probar una aplicación para estudiar anatomía del brazo y del antebrazo. Queremos saber qué se entiende, dónde hay problemas y cuánto se recuerda. No evaluamos a las personas: evaluamos la aplicación.
>
> - **Qué harás:** una prueba corta, estudiar con la aplicación unos 50 minutos, otra prueba y un cuestionario; una semana después, otra prueba corta y unas preguntas (unos 25 minutos).
> - **Es voluntario.** Puedes dejarlo en cualquier momento sin dar explicaciones, y no afecta a tus notas.
> - **Qué se anota:**
>   - tus respuestas a las pruebas y al cuestionario;
>   - lo que observemos mientras usas la aplicación (tiempos, dudas, problemas);
>   - solo si aceptas, el archivo de datos de estudio que exporta la aplicación y sus estadísticas de uso.
>
>   No se graba la pantalla ni la voz salvo que lo aceptes aparte.
> - **Cómo se guarda:**
>   - con un código (P01, P02…), no con tu nombre;
>   - solo lo ven [nombres de quienes acceden];
>   - se borra el [fecha] o antes si lo pides.
> - **Lo que no hace la aplicación:** la aplicación guarda tu progreso en el navegador del equipo; al terminar se borra. La lección creada con IA es un borrador sin revisar por un especialista.
> - **Contacto:** [nombre y correo de quien organiza].
>
> Acepto participar: ☐ Sí · Acepto que se use mi archivo de datos de estudio: ☐ Sí ☐ No · Acepto activar las estadísticas de uso: ☐ Sí ☐ No
>
> Código: ____ · Fecha: ____ · Firma: ____

## 9. Hoja de observación

Una por estudiante. **Gravedad:** 1 = estético · 2 = menor (lo resuelve solo) · 3 = importante (le cuesta, pide ayuda) · 4 = bloqueo.

| Código | Tarea | Inicio | Fin | Problema observado (literal) | Categoría | Gravedad | ¿Ayuda? |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P__ | T1 |  |  |  | Orientación / Comprensión / Contenido / Carga / Navegación / Técnico |  |  |

**Al final de la sesión:**
- resultado de la evaluación del brazo y del antebrazo por objetivo (lo muestra la app);
- en T4, ¿explicó bien qué le costaba?
- en T6, ¿identificó la lección como borrador con IA?

## 10. Cuestionario de satisfacción

Escala de 1 (nada de acuerdo) a 5 (totalmente de acuerdo). Es un cuestionario propio, sin validar. Si se quiere una medida estandarizada de usabilidad, se puede añadir la System Usability Scale (SUS; Brooke, 1996) en una versión validada en español.

1. Al empezar sabía qué tenía que hacer.
2. Las explicaciones de las lecciones eran claras.
3. El modelo 3D me ayudó a entender dónde está cada estructura.
4. Las preguntas evaluaban lo que había estudiado.
5. En algún momento había demasiada información a la vez.
6. Entendí qué significa lo que muestra mi mapa de aprendizaje.
7. Entendí que la lección de Neuri es un borrador hecho con IA.
8. Usaría la aplicación para estudiar otros temas.

**Preguntas abiertas:**
- ¿Qué te resultó más útil?
- ¿Dónde te perdiste o qué no entendiste?
- ¿Qué cambiarías primero?

## 11. Análisis previsto

Solo descriptivo; nada de inferencias.

1. **Conocimiento:**
   - puntuación por estudiante y por objetivo en cada momento;
   - cambio inmediato (después − antes);
   - recuerdo (una semana − después).

   Se presentan los valores individuales y el rango. Con 5 a 8 personas no se calculan significaciones ni se habla de efecto.
2. **3D frente a texto:** ¿se reconocen las estructuras en vistas nuevas tan bien como se responden las preguntas de texto?
3. **Problemas:**
   - lista única con frecuencia (cuántos estudiantes) y gravedad máxima;
   - primero los de gravedad 3–4 y los de contenido.

   Cada problema de contenido se cruza con la hoja de revisión del docente y, si procede, se reporta y se corrige (`npm run reportes`).
4. **Satisfacción:** mediana por pregunta y comentarios literales, al lado de los resultados de aprendizaje.
5. **Lección personalizada:**
   - errores encontrados por el docente;
   - si los estudiantes la identificaron como borrador;
   - su resultado en la evaluación de la lección.

**Informe:** se escribe con lo observado, sin generalizar a otros estudiantes ni presentarlo como prueba de eficacia. Incluye las limitaciones:
- muestra pequeña y voluntaria;
- sin grupo de comparación;
- formas repetidas;
- efecto de la observación;
- equipos preparados, no los propios del estudiante.
