# Matriz de requisitos de «Estudiar» y Neuri

Especificación: «Prompt maestro — Anato3D: aprendizaje, Neuri y lecciones personalizadas» (Carlos, 9 nov 2026; `/Users/marquez/Documents/AI/Anato3D-Prompt-maestro-aprendizaje-Neuri.md`), con sus 30 secciones y tres anexos.

Esta matriz se actualiza al terminar cada bloque.

**Leyenda de estados**

| Estado | Significado |
| --- | --- |
| ✅ Hecho y comprobado | Con pruebas automáticas o recorrido en el navegador. |
| 🟡 Parcial | Lo que falta se dice. |
| ⬜ Pendiente | |
| ⛔ Bloqueado | Depende de una decisión o credencial externa; se dice cuál. |

**Leyenda de evidencias**

- **«simulado»:** la IA se sustituye por un guion o un `fetch` falso.
- **«real»:** con el servicio de verdad.

## Inventario inicial (9 nov 2026, antes de empezar)

Comprobado en el código del commit `0086e31`:

- **Biblioteca:**
  - **Contenido:** 70 lecciones (68 nuevas en español, más brazo y antebrazo en cinco idiomas), 11 recorridos y 18 módulos, con 487 pasos, 1082 preguntas y 3019 citas comprobadas en 276 páginas.
  - **Cobertura:** el mapa (`docs/estudio/cobertura.md`, generado) cuenta 790 de 1718 estructuras en el núcleo de alguna lección (46 %).
  - **Búsqueda y filtros:**
    - búsqueda con erratas, facetas y sinónimos;
    - filtros combinables: región, subregión, sistema, formato, tema u objetivo, nivel, duración, progreso, repaso pendiente y favoritas;
    - filtros activos, ampliar sin resultados y orden por relevancia, secuencia recomendada, duración y reciente.
  - **Lecciones:** ficha; lección guiada con el visor (vista por paso, «recuperar la vista», actividades de localizar, comparar y vistas, comprobación en el paso, fuentes por paso).
  - **Evaluación:** identificar, localizar, relación, función, comparación y secuencia, sin pistas que revelen la respuesta. Las preguntas que el modelo no puede mostrar se saltan sin contar.
  - **Progreso:** repaso Leitner, prácticas (vencidas, errores, identificar sin etiquetas) y sesión según el tiempo. Distingue avance, finalización, aprendizaje demostrado y dominio a largo plazo, y se guarda en localStorage (`anato3d.biblioteca`, versión 2).
- **Neuri:**
  - recomienda, explica con citas comprobadas, crea y adapta lecciones (propuesta → plan → generación) con Haiku 5.5 en el servidor de desarrollo;
  - «Mis lecciones» guarda las lecciones en localStorage (`anato3d.propias`);
  - sin IA, responde el buscador.
- **Alojamiento:** ninguno. La web no está publicada; el servidor de Neuri solo existe dentro de `npm run dev` y `npm run preview`.
- **Almacenamiento:** el del navegador (localStorage y sessionStorage). No hay base de datos ni copia en la nube.
- **Autenticación:** no hay cuentas ni proveedor elegido.
- **Funciona sin conexión:** la biblioteca, una vez cargada la página y los modelos. No hay *service worker*.

**Fallos y huecos detectados en la revisión:**

1. **Neuri, plazos:** el plazo del navegador se apaga al llegar las cabeceras; si el cuerpo se detiene, la petición queda colgada.
2. **Neuri, recuperación:** un fallo «sin-ia» desactiva la IA para toda la sesión, y la comprobación inicial puede llegar tarde y pisar una respuesta buena.
3. **Neuri, conversación:**
   - no se puede cancelar una pregunta en curso;
   - una respuesta antigua podría entrar en una conversación nueva;
   - si el buscador local falla, el envío termina sin respuesta.
4. **«Mis lecciones», límite:** al llegar a 40 se borraba la más antigua sin avisar.
5. **«Mis lecciones», datos dañados:** las lecciones guardadas dañadas se perdían al guardar otra.
6. **«Mis lecciones», guardado fallido:** si fallaba el guardado, el borrador se perdía.
7. **Creación, confirmaciones:** pide dos confirmaciones (planificar y crear) aunque la persona pida «créame una lección».
8. **Creación, recarga:** al recargar la página se pierde la creación en curso.
9. **Progreso:** no se registra cada intento (versión del contenido, opción elegida, ayudas, tipo de tarea), así que no se pueden explicar las dificultades ni combinar el progreso de dos dispositivos.
10. **Funciones que faltan:**
    - la entrada con las seis acciones;
    - las preferencias opcionales;
    - el plan de examen;
    - el mapa de aprendizaje;
    - «Reportar un problema»;
    - los datos personales: exportar, importar y borrar;
    - las preferencias de analítica;
    - los eventos;
    - los filtros de idioma, procedencia y tipo de estructura;
    - renombrar las lecciones propias.

## Matriz (estado al cierre de este trabajo, 9 nov 2026)

Actualizada el 9 nov por la noche con los recorridos personales por unidades (filas 14, 17 y 26), el 11 nov con la fusión de las tres ramas en `main` (cifras de pruebas, lecciones y citas) y el 12 nov con las sesiones de estudio, el cupo diario, el texto fijo por modo, los idiomas y el sistema linfático (filas 1, 4, 7, 11, 12, 14, 15, 17, 18, 21, 22, 25, 26, 27 y 29; detalle en el bloque del final).

**Evidencia:**
- **automática:** `npm test` (314 pruebas el 12 nov *[Histórico: 239 con los cinco prompts de ChatGPT del 11 nov; 181 con las tres ramas en `main`; 165 con los recorridos por unidades; 148 antes de ellos]*) y `npm run check`;
- **navegador:** recorridos en la app, en `docs/estudio/aceptacion.md`;
- **«simulado»:** con la IA o el servidor sustituidos;
- **real:** con Claude Haiku 5.5. No hay ninguna: falta la clave.

| § | Requisito | Estado | Evidencia | Pendiente |
| ---: | --- | --- | --- | --- |
| 1 | Encargo: experiencia completa, honesta sobre lo comprobado | 🟡 | Recorridos de extremo a extremo con la IA simulada; lo real, lo simulado y lo humano, separados en todos los documentos. Desde el 12 nov, continuidad entre visitas: sesiones de estudio reanudables y memoria del tema | La IA real, las cuentas y la revisión humana (abajo); recorrido de las sesiones en el navegador |
| 2 | Revisión inicial e inventario | ✅ | «Inventario inicial» de este documento (código del commit `0086e31`), con diez huecos detectados; todos resueltos salvo los bloqueados | — |
| 3 | Entrada con seis acciones; preferencias opcionales; recorrido, módulo, lección y actividad | ✅ | **Navegador:** captura 02 y 03 del manual. Objetivos, fuentes, recorrido y «volver» desde cada lección. Jerarquía en `recorridos.js` y `formato.js` | — |
| 4 | Biblioteca extensa y cobertura verificable | 🟡 | **87 lecciones** (85 nuevas y 2 módulos), 19 módulos y 11 recorridos *[Histórico: 84 lecciones el 11 nov]*. Mapa de cobertura generado (`cobertura.md`, 12 nov): **1112 de 1747 estructuras** en el núcleo de alguna lección (64 %) *[Histórico: 1059 de 1718, 62 %; antes, 46 %]*. **Sistema linfático nuevo (12 nov,** `docs/hitos/09-sistema-linfatico.md`**):** 193 piezas por modelo, todas con ficha propia; lecciones nuevas `cue-ganglios`, `mi-ganglios` y `abd-linfaticos`, y corregidas `sis-linfatico`, `tor-linfaticos` y `tor-mediastino`; el linfático pasa al 74 % en el núcleo, los vasos y nervios del cuello al 55 % y los del abdomen al 61 %. Lecciones nuevas: `cab-nariz` y, para los huecos de cobertura, 13 en borrador: `pel-vasos`, `pel-nervios-linfaticos`, `abd-peritoneo`, `tor-pared-vasos`, `tor-segmentos`, `tor-linfaticos`, `cab-senos-venosos`, `cab-nucleos-basales`, `cab-limbico`, `cab-tronco-encefalo`, `cab-surcos-lateral`, `cab-surcos-medial` y `cab-arterias-corticales` (revisor sin errores ni avisos, citas comprobadas, cada paso visto en el navegador, hojas en `docs/revision/lecciones/`). En el núcleo: vasos y nervios de la pelvis 98 %, cavidad abdominal y peritoneo 100 %, mediastino 99 %, encéfalo y meninges 95 %. Módulo nuevo `encefalo` en el recorrido «Nervios y territorios». Los recorridos que prometen «todos» se comprueban con su inventario | **Revisión docente** de las 13 lecciones de los huecos y de las 6 del linfático (hojas en `docs/revision/lecciones/`). **Huecos que quedan** (en el núcleo, 12 nov): muñeca 17 %, tobillo 26 %, médula espinal 34 %, pie 42 %; por sistemas, articulaciones y ligamentos 32 % *[Histórico, 11 nov: también vasos y nervios del cuello 38 %, del abdomen 41 % y linfático 42 %]*. Fichas linfáticas con campos «pendiente» donde no hay fuente libre. Defectos de geometría del linfático anotados en el hito (no prioritarios, decisión de Carlos). **Modelo:** la pieza «Paracentral_sulcus» está dentro del giro frontal medio y la pieza «Inferior_temporal_sulcus», en la cara inferior; las lecciones lo explican |
| 5 | Regiones, sistemas, recorridos por objetivos | ✅ | 8 regiones con subregiones y 14 sistemas en `taxonomia.js` (los 13 de la especificación más los órganos de los sentidos). 11 recorridos por objetivo (reconocer huesos, compartimentos, vasos y nervios, preparar un examen…). Todos los accesos usan el mismo catálogo | Profundidad desigual entre regiones (ver § 4) |
| 6 | Búsqueda, filtros y navegación | ✅ | **Automática:** acentos, erratas, sinónimos, frases. **Navegador:** escenarios 2 y 3. Filtros de región, subregión, sistema, tipo de estructura, objetivo, nivel, duración, progreso, repaso, guardadas, idioma y procedencia; filtros activos, ampliar si no hay resultados, cuatro órdenes. Sin resultados: reformular, ampliar o «Preguntar a Neuri» | — |
| 7 | Diseño pedagógico de las lecciones | ✅ | Formato con objetivos observables (de 2 a 6), estructuras de núcleo y contexto, pasos de orientación a síntesis, «Saber más», comprobaciones y fuentes por paso. El revisor de formato lo comprueba en las 87 lecciones (0 errores) *[Histórico: 84; 71]* | Revisión profesional (§ 23) |
| 8 | Visor 3D integrado | 🟡 | Vista por paso, «Restaurar», vista aislada, contexto, transparencia y capas. Piezas comprobadas por modelo y lado. Si falta una pieza, se avisa y se adapta la actividad (escenario 14) | Tacto: emulado, no en un dispositivo real |
| 9 | Evaluación y retroalimentación | ✅ | Identificar, localizar, relación, función, comparación, secuencia y respuesta breve, con sinónimos, «cercana» (compararse con la referencia) y «ambigua». Sin pistas en evaluación. Los fallos técnicos no cuentan. No se repite enseguida lo recién fallado. Explicaciones con cita y enlace al paso (**automática** y **navegador**) | — |
| 10 | Mapa de aprendizaje y repaso | ✅ | Cinco habilidades con cuatro estados. Visitado, terminado, demostrado y consolidado van aparte. Cada intento guarda fecha, versión, ayudas, error y tipo. Repaso Leitner, aplazar y retomar, y motivos explicados («la confundiste con…») (**automática** y **navegador**, captura 07) | Medir su efectividad: piloto (§ 28) |
| 11 | Neuri: orientar, enseñar, adaptar y crear | 🟡 | Recomendar (de 1 a 3 lecciones, con motivo), sesión, explicar con citas comprobadas, adaptar y crear. Estado de la conversación conservado; cambio de tema; personaje y gestos. Sin IA: el buscador (**automática**, IA simulada). **Desde el 12 nov, tutor:** sesiones de estudio guardadas y reanudables (sin IA si el tema está claro; Haiku solo si es ambiguo); pista y segundo intento (lo acertado con ayuda no sube de caja ni demuestra la habilidad); «Preguntar a Neuri» desde un paso; «Ver en 3D»; perfil de aprendizaje sin fechas ni respuestas; memoria del tema entre visitas (**automática**; escenarios S1–S8 de `aceptacion.md`) | Prueba real con Haiku: interpretación de «el segundo», «eso ya lo hice», correcciones, y la calidad de las sesiones y de las pistas en contexto. Recorrido de las sesiones en el navegador |
| 12 | Claude Haiku y arquitectura | 🟡 | `claude-haiku-5-5` desde el servidor con el SDK oficial; Opus, Fable y Mythos bloqueados. Salida con esquema JSON, validación del servidor y protocolo versionado. Estados: sin clave, configurada, comprobada y fallando. Clave solo en el servidor. Catálogo compacto en caché y candidatas para las estructuras. **Texto fijo por modo (12 nov):** el catálogo compacto solo en Orientar (≈ 6 600 tokens); el resto, ≈ 1 930 *[Histórico: ≈ 31 800 tokens en todas las llamadas]*. El texto de la persona va en su mensaje como dato (instrucciones `2026-11-12.1`) | Prueba real; comparar con la IA real la pertinencia, latencia y consumo del catálogo en caché frente a las candidatas; comprobar el endpoint publicado |
| 13 | Robustez de conversación y generación | ✅ | Plazos que cubren el cuerpo; cancelar; descartar respuestas antiguas (por orden, no por hora); recuperar la IA tras una caída; error recuperable si falla el buscador local; reintentos limitados según el error (**automática**: robustez 1 a 5) | — |
| 14 | Generación y adaptación personales | 🟡 | «Créame…» sin confirmaciones redundantes. Trabajos con identificador, persistencia, límites, recarga y cancelación. Etapas reales; «Lista para estudiar» solo tras validar y guardar; «Lista pero sin guardar» recuperable. **Recorridos por unidades** para peticiones extensas («Créame un curso del miembro superior»): Neuri reparte el tema en 2–8 unidades revisadas por el servidor y crea la primera; las demás, de una en una cuando la persona lo decide («todas» en cola, sin paralelo, parada ante cualquier fallo y comprobando el espacio). Cada unidad lista es una lección validada y guardada; el resto, con su estado real (pendiente, en preparación con su etapa, en cola, sin guardar, error, interrumpida). Cambiar un recorrido conserva lo creado; quitarlo no borra sus lecciones (**automática**: 17 pruebas; **navegador**: capturas 18 y 19; IA simulada). **Componer una sesión con contenido existente** (12 nov), distinto de recomendar, adaptar y crear: el plan solo usa lecciones y preguntas que existen y la app lo materializa (**automática**) | Prueba real con Haiku, también de los recorridos *[Histórico: «Recorridos por unidades: no implementado» hasta el 9 nov por la noche]* |
| 15 | Fuentes y comprobación anatómica | 🟡 | Biblioteca: 4130 citas comprobadas palabra por palabra en 511 páginas *[Histórico: 3969 en 478 el 11 nov; 3068 en 286]*, en su versión registrada. Neuri: evidencias autorizadas, descarga controlada de Wikipedia (hasta 4 páginas), comprobación semántica de cada afirmación con otra llamada y retirada de lo no respaldado. Licencias en cada fuente | Revisión profesional (la comprobación automática no la sustituye) |
| 16 | Formato, validación y publicación | ✅ | Lecciones como datos (nunca código). El mismo revisor para la biblioteca y las de Neuri. Identificadores que pone la app. Una ronda de reparación. Estado técnico y editorial separados. Las lecciones propias nunca entran en el catálogo general | Flujo editorial con permisos para publicar (depende de las cuentas) |
| 17 | Mis lecciones, versiones y almacenamiento | 🟡 | En búsqueda, filtros, guardadas, evaluación y repaso. Renombrar, quitar (con confirmación), adaptar como lección nueva, exportar e importar. «Lleno» sin borrar nada, datos dañados apartados, copias en lugar de sobrescribir, huella por pregunta. **Recorridos personales** en «Mis lecciones» («Mis recorridos»), con formato versionado, datos dañados apartados y en «Mis datos» (**automática** y **navegador**). **Sesiones de estudio** (12 nov) en `anato3d.sesiones` (versión 1, como mucho 20, poda con aviso, dañadas apartadas, en «Mis datos») (**automática**) | Sincronizar (§ 19) *[Histórico: también «Recorridos personales» hasta el 9 nov por la noche]* |
| 18 | Invitado y registro opcional | 🟡 | Todo funciona sin registro. Seudónimo solo con las estadísticas. El progreso local se explica en la app. Límites de creación por dirección. **Cupo diario visible** (12 nov): 30 preguntas con IA y 3 creaciones por dispositivo, con el saldo arriba de la conversación; al agotarse sigue todo lo local, sin muro (**automática**, escenarios C1–C7) | Registro y migración de invitado a cuenta (§ 19) |
| 19 | Cuentas, sincronización y acceso | ⛔ | Hay exportar, importar (combinando sin duplicar) y borrar datos (**automática**) | **Decisión de Carlos:** alojamiento y proveedor de autenticación. Después: sesiones, autorización en el servidor, sincronización y conflictos |
| 20 | Temario y plan de examen | ✅ | Interpretar (con revisión), lagunas, plan por requisitos y repasos, «no cabe» con cifras, sin fecha inventada, rehacer desde hoy con el progreso, fechas locales (corregido un desfase en la entrada), sin notificaciones (**automática** y **navegador**, captura 12) | Documentos adjuntos: no se admiten (se pega el texto) |
| 21 | Analítica y privacidad | 🟡 | «Mis datos y privacidad»: qué se guarda, qué sale (corregido para ser exacto), estadísticas desactivadas por defecto, exportar y borrar (**navegador**, capturas 13 y 14). Desde el 12 nov explica también el perfil de aprendizaje, el identificador del dispositivo (solo para el cupo, no se exporta) y la memoria del tema, en español e inglés (**automática**) | Servidor de estadísticas (si se quiere). Revisión legal antes de publicar |
| 22 | Eventos e indicadores | 🟡 | Eventos versionados con lista cerrada, seudónimo, sin duplicados, tiempo activo con visibilidad e inactividad. Un fallo nunca rompe el estudio (**automática**). Nuevos `sesion_creada` y `sesion_terminada`, sin el tema | Envío y panel de indicadores (sin servidor); `migracion_invitado_completada` (sin cuentas) |
| 23 | Revisión docente y reportes | 🟡 | «Reportar un problema» en pasos, preguntas y fichas, con siete categorías. Cola sin IP; decisiones con revisor y fecha; retirar y reponer, también para Neuri. Penalizaciones anuladas al corregir. Paquete de revisión (`revision-docente.md`, hojas de brazo y antebrazo v2026-11-09 y generador para cualquier lección) | **Revisión profesional** (humana). Cola con permisos al publicar |
| 24 | Diseño visual y accesibilidad | 🟡 | Estilo propio oscuro (grafito y azul). Neuri con gestos y reducción de movimiento. Vistas de bienvenida, conversación, creación, resultado, errores, Mis lecciones, mapa y plan. Teclado, foco que no se pierde, `aria-live`, móvil con teclado (emulado) | Lector de pantalla y móvil real (humano); auditoría de contraste y zoom; diseño de «cuenta» (no hay cuentas) |
| 25 | Rendimiento, seguridad y coste | 🟡 | Mediciones con equipo y condiciones (`rendimiento.md`). Carga bajo demanda. Presupuestos de tokens, tamaño, frecuencia, concurrencia y reparaciones. Idempotencia. Registro técnico sin textos (con duración y trabajo). Precios comprobados. **12 nov:** cupo diario durable por dispositivo (archivo en el volumen, claves HMAC, cerrojo) y texto fijo por modo; estimación ≈ 51 US$ al mes con las cifras de Carlos *[Histórico: ≈ 71]*; prueba mínima ≤ 0,0123 US$ | Latencia y coste reales con Haiku; límites globales en el despliegue (el cupo, en el volumen de Fly, sin probar) |
| 26 | Contratos de datos | ✅ | `contratos-datos.md`: formatos versionados, estados, propietarios, transiciones y migraciones (también el del recorrido personal, versión 1, y desde el 12 nov la sesión de estudio, versión 1, y el cupo del servidor, versión 2). Fuente única del catálogo, también para Neuri (retiradas). Identificadores distintos. Idioma del contenido aparte del de la interfaz | Contratos de cuenta y sincronización (§ 19) |
| 27 | Pruebas de aceptación | 🟡 | `aceptacion.md`: 26 escenarios y pruebas adicionales; recorrido completo. Desde el 12 nov, las sesiones, el cupo y los datos (S1–S8, C1–C7, D1–D2), automáticos o con la IA simulada | Escenarios 19 a 22 (cuentas); prueba real con Haiku; humanas (lector de pantalla, móvil real) |
| 28 | Piloto educativo | 🟡 | `piloto.md`: objetivos, tareas, medidas, pruebas equivalentes A y B (borrador para el docente), consentimiento, hoja de observación, cuestionario y análisis descriptivo | **Realizarlo** (personas, docente, permisos): decisión de Carlos |
| 29 | Manual del estudiante | 🟡 | `manual-estudiante.md`: los 10 recorridos con 19 capturas comprobadas *[Histórico: 17 antes de los recorridos por unidades]* (escritorio y móvil; las de la IA, marcadas como simuladas), sin conexión, dónde se guarda cada cosa y limitaciones. El 9 (cuenta) explica que no existe y su alternativa. Desde el 12 nov, las sesiones, el cupo y los idiomas, sin capturas | Capturas de las sesiones, el cupo y «Preguntar a Neuri» (lista en el manual) *[Histórico: ✅ hasta el 12 nov]* |
| 30 | Entregables | 🟡 | Ver la tabla siguiente | Lo bloqueado |

### Entregables (sección 30)

| Entregable | Dónde | Estado |
| --- | --- | --- |
| Implementación integrada y migraciones | `web/src`, `web/server`; migración del progreso v1 → v2 y campos nuevos sin cambiar de versión | ✅ |
| Prompts, formatos y validadores versionados | `server/neuri/instrucciones.mjs` (`VERSION_INSTRUCCIONES`), `src/pet/protocolo.js` (v2, con el modo `sesion`), `src/pet/sesiones.js` (v1), `server/neuri/cupo.mjs` (v2), `src/biblioteca/formato.js`, `reportes.js` (v1), `eventos.js` (v1), `datos.js` (v1) | ✅ |
| Cobertura real de contenido y funciones | `cobertura.md` (generado) y esta matriz | ✅ (con vacíos declarados) |
| Pruebas y resultados, simulación frente a uso real | `aceptacion.md`; `npm test` 314 de 314 el 12 nov *[Histórico: 239; 165 de 165; 148 de 148]* | ✅ simulado · ⛔ real |
| Capturas de escritorio y móvil | `docs/estudio/capturas/` (19) *[Histórico: 17 antes de los recorridos]* | ✅ |
| Mediciones de rendimiento y consumo | `rendimiento.md` | ✅ local · ⛔ IA real |
| Manual del estudiante y guía operativa | `manual-estudiante.md`, `guia-operativa.md` | ✅ |
| Protocolo del piloto y paquete de revisión docente | `piloto.md`, `revision-docente.md`, `docs/revision/` | ✅ preparado · ⬜ sin realizar |
| Configuración externa pendiente y limitaciones | `guia-operativa.md` (apartado 9), manual («Limitaciones») | ✅ |
| Recorrido completo invitado → … → continuidad | `aceptacion.md` («Recorrido completo») | 🟡 cuenta bloqueada |

### Lo que necesita a Carlos

1. **Clave de API** con límite de gasto en `web/.env.local`, y permiso para `npm run pet:prueba` (unos céntimos).
2. **Elegir alojamiento y proveedor de cuentas.** Desbloquea las secciones 18, 19, 21, 22, 25 y 27.
3. **Contactar** con un docente y estudiantes para la revisión y el piloto, y comprobar los permisos institucionales.
4. **Revisión legal y de privacidad** antes de publicar.

## Bloque «limitaciones conocidas del modelo» (9 nov 2026, noche)

Rama `claude/limitaciones-modelo`, desde `main` en `454a3cb`, sin commit. Es la ronda 1 del bucle con ChatGPT, con sus
partes P0 a P3. El detalle está en `limitaciones-modelo.md`.

| Parte | Requisito | Estado | Evidencia | Pendiente |
| --- | --- | --- | --- | --- |
| P0 | Reproducir y clasificar los tres hallazgos | ✅ | `docs/revision/limitaciones-modelo/hallazgos.md`: medición en los dos modelos y los dos lados, 10 capturas, los archivos con su blob de git y 7 citas comprobadas | Revisión docente de la clasificación |
| P1 | Registro común y aviso en la ficha | ✅ | `src/data/limitaciones.js` (3 entradas), validado por `npm run check`. **Navegador:** ficha desde el buscador, en escritorio y en el móvil plegado, en los cinco idiomas. Contraste del aviso de 9,1:1 o más (AA y AAA) y aviso entero con el zoom al 200 % emulado | Lector de pantalla y móvil real (humana) |
| P1 | Restricciones en la evaluación, el repaso, el progreso y los pasos | ✅ | **Automática:** `tests/limitaciones.test.mjs`. **Navegador (Neuri simulado):** lección propia con la pieza en el núcleo: evaluación sin ella, nota en el resultado, el fallo antiguo huérfano y fuera de «Repasar ahora» | — |
| P2 | Neuri recibe solo lo pertinente y no puede entregar lo restringido | ✅ simulada · ⛔ real | **Automática (simulada):** notas en orientar, planificar, redactar y adaptar; el ensamblado quita y cuenta; la validación lo para | Prueba real con Haiku |
| P2 | Pruebas y comprobaciones | ✅ | En esta rama, `npm test` da 164 de 164 (148 + 16). Además: `npm run check`, `vite build` y `node scripts/limitaciones.mjs --citas` (7 de 7). Revisión adversarial con 14 agentes: 5 fallos de gravedad media y 6 de gravedad baja, corregidos; 2 detalles menores quedan explicados sin cambiar (en `limitaciones-modelo.md`). Copia con las tres ramas juntas: 181 de 181 | La cifra global de la matriz (148) se actualiza al fusionar |
| P3 | Documentación | ✅ | `limitaciones-modelo.md`; notas en la aceptación, los contratos de datos, Neuri, el manual y la guía operativa | — |

## Bloque «Neuri tutor: sesiones, cupo y texto fijo» (11–12 nov 2026)

En `main`, sin commit. Pedido de Carlos el 11 nov por la noche (Neuri como tutor y sistema linfático completo); el detalle está en `neuri.md`, `contratos-datos.md` y `aceptacion.md`. `npm test`: 314 de 314; `npm run check`: correcto.

| Parte | Requisito | Estado | Evidencia | Pendiente |
| --- | --- | --- | --- | --- |
| T1 | Sesión de estudio guardada y reanudable | ✅ | `src/pet/sesiones.js` (`anato3d.sesiones`, versión 1, como mucho 20, poda con aviso); vista de sesión y «Mis sesiones». **Automática:** S1, S3, S4 y S6 | Recorrido en el navegador y capturas |
| T2 | Planificador sin IA; Haiku solo si el objetivo es ambiguo | ✅ simulada · ⛔ real | `src/pet/planificador.js`; modo `sesion` con revisión determinista y una ronda de corrección (S2) | Prueba real con Haiku |
| T3 | Tutor en contexto: pista y segundo intento, «Preguntar a Neuri» desde un paso, «Ver en 3D» | ✅ | Pista de un paso verificado sin el nombre; lo acertado con ayuda no sube de caja ni demuestra la habilidad; el botón del paso no sale con la comprobación sin responder (S5, S7) | Prueba real; recorrido en el navegador |
| T4 | Perfil de aprendizaje y memoria entre visitas | ✅ | ≈ 250 tokens el más lleno, sin fechas ni respuestas (S8); `anato3d.neuri.memoria`, 30 días, se borra con «Borrar mis datos» (D1) | — |
| T5 | Cupo diario por dispositivo | ✅ local · ⏳ volumen | 30 preguntas y 3 creaciones; `cupo.json` versión 2 con claves HMAC; `ANATO3D_CUPO_SAL`; IPv6 por /64; medianoche de America/Tijuana; `429 cupo` (C1–C7) | Probarlo en el volumen de Fly (`activacion.md`) |
| T6 | Texto fijo por modo y texto de la persona como dato | ✅ | ≈ 6 600 tokens en Orientar y ≈ 1 930 en el resto (antes ≈ 31 800); instrucciones `2026-11-12.1`; prueba con centinela | Medir los tokens reales con la clave |
| T7 | Idiomas: interfaz en español e inglés | ✅ | Decisión de Carlos del 12 nov: alemán, francés e italiano, «próximamente»; lo nuevo solo en es/en; `npm run check` exige solo el inglés en el contenido (D2) | Traducir y reactivar de/fr/it, si Carlos lo decide |
| T8 | Revisión adversarial | ✅ | 13 fallos reales arreglados con prueba (5 del servidor y 8 de la app): `aceptacion.md`, fallos 20 a 32 | — |
| T9 | Sistema linfático completo | ✅ local | `docs/hitos/09-sistema-linfatico.md`: 193 piezas por modelo con ficha propia; 3 lecciones nuevas y 3 corregidas (87 en total); al encender el linfático ya no se muestran las venas; el buscador encuentra «ganglio(s)» | Defectos de geometría anotados en el hito; revisión docente |
