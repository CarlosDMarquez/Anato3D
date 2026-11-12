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

Actualizada el 9 nov por la noche con los recorridos personales por unidades (filas 14, 17 y 26).

**Evidencia:**
- **automática:** `npm test` (165 pruebas *[Histórico: 148 antes de los recorridos por unidades]*) y `npm run check`;
- **navegador:** recorridos en la app, en `docs/estudio/aceptacion.md`;
- **«simulado»:** con la IA o el servidor sustituidos;
- **real:** con Claude Haiku 5.5. No hay ninguna: falta la clave.

| § | Requisito | Estado | Evidencia | Pendiente |
| ---: | --- | --- | --- | --- |
| 1 | Encargo: experiencia completa, honesta sobre lo comprobado | 🟡 | Recorridos de extremo a extremo con la IA simulada; lo real, lo simulado y lo humano, separados en todos los documentos | La IA real, las cuentas y la revisión humana (abajo) |
| 2 | Revisión inicial e inventario | ✅ | «Inventario inicial» de este documento (código del commit `0086e31`), con diez huecos detectados; todos resueltos salvo los bloqueados | — |
| 3 | Entrada con seis acciones; preferencias opcionales; recorrido, módulo, lección y actividad | ✅ | **Navegador:** captura 02 y 03 del manual. Objetivos, fuentes, recorrido y «volver» desde cada lección. Jerarquía en `recorridos.js` y `formato.js` | — |
| 4 | Biblioteca extensa y cobertura verificable | 🟡 | 71 lecciones (69 nuevas y 2 módulos), 18 módulos y 11 recorridos. Mapa de cobertura generado (`cobertura.md`): 795 de 1718 estructuras en el núcleo de alguna lección (46 %). Lección nueva en este trabajo: `cab-nariz`. Los recorridos que prometen «todos» se comprueban con su inventario | **Lecciones para los huecos:** vasos y nervios de la pelvis; cavidad abdominal (0 % en el núcleo); mediastino (25 %); encéfalo (34 %) |
| 5 | Regiones, sistemas, recorridos por objetivos | ✅ | 8 regiones con subregiones y 14 sistemas en `taxonomia.js` (los 13 de la especificación más los órganos de los sentidos). 11 recorridos por objetivo (reconocer huesos, compartimentos, vasos y nervios, preparar un examen…). Todos los accesos usan el mismo catálogo | Profundidad desigual entre regiones (ver § 4) |
| 6 | Búsqueda, filtros y navegación | ✅ | **Automática:** acentos, erratas, sinónimos, frases. **Navegador:** escenarios 2 y 3. Filtros de región, subregión, sistema, tipo de estructura, objetivo, nivel, duración, progreso, repaso, guardadas, idioma y procedencia; filtros activos, ampliar si no hay resultados, cuatro órdenes. Sin resultados: reformular, ampliar o «Preguntar a Neuri» | — |
| 7 | Diseño pedagógico de las lecciones | ✅ | Formato con objetivos observables (de 2 a 6), estructuras de núcleo y contexto, pasos de orientación a síntesis, «Saber más», comprobaciones y fuentes por paso. El revisor de formato lo comprueba en las 71 lecciones (0 errores) | Revisión profesional (§ 23) |
| 8 | Visor 3D integrado | 🟡 | Vista por paso, «Restaurar», vista aislada, contexto, transparencia y capas. Piezas comprobadas por modelo y lado. Si falta una pieza, se avisa y se adapta la actividad (escenario 14) | Tacto: emulado, no en un dispositivo real |
| 9 | Evaluación y retroalimentación | ✅ | Identificar, localizar, relación, función, comparación, secuencia y respuesta breve, con sinónimos, «cercana» (compararse con la referencia) y «ambigua». Sin pistas en evaluación. Los fallos técnicos no cuentan. No se repite enseguida lo recién fallado. Explicaciones con cita y enlace al paso (**automática** y **navegador**) | — |
| 10 | Mapa de aprendizaje y repaso | ✅ | Cinco habilidades con cuatro estados. Visitado, terminado, demostrado y consolidado van aparte. Cada intento guarda fecha, versión, ayudas, error y tipo. Repaso Leitner, aplazar y retomar, y motivos explicados («la confundiste con…») (**automática** y **navegador**, captura 07) | Medir su efectividad: piloto (§ 28) |
| 11 | Neuri: orientar, enseñar, adaptar y crear | 🟡 | Recomendar (de 1 a 3 lecciones, con motivo), sesión, explicar con citas comprobadas, adaptar y crear. Estado de la conversación conservado; cambio de tema; personaje y gestos. Sin IA: el buscador (**automática**, IA simulada) | Prueba real con Haiku: interpretación de «el segundo», «eso ya lo hice», correcciones |
| 12 | Claude Haiku y arquitectura | 🟡 | `claude-haiku-5-5` desde el servidor con el SDK oficial; Opus, Fable y Mythos bloqueados. Salida con esquema JSON, validación del servidor y protocolo versionado. Estados: sin clave, configurada, comprobada y fallando. Clave solo en el servidor. Catálogo compacto en caché y candidatas para las estructuras | Prueba real; comparar con la IA real la pertinencia, latencia y consumo del catálogo en caché frente a las candidatas; comprobar el endpoint publicado |
| 13 | Robustez de conversación y generación | ✅ | Plazos que cubren el cuerpo; cancelar; descartar respuestas antiguas (por orden, no por hora); recuperar la IA tras una caída; error recuperable si falla el buscador local; reintentos limitados según el error (**automática**: robustez 1 a 5) | — |
| 14 | Generación y adaptación personales | 🟡 | «Créame…» sin confirmaciones redundantes. Trabajos con identificador, persistencia, límites, recarga y cancelación. Etapas reales; «Lista para estudiar» solo tras validar y guardar; «Lista pero sin guardar» recuperable. **Recorridos por unidades** para peticiones extensas («Créame un curso del miembro superior»): Neuri reparte el tema en 2–8 unidades revisadas por el servidor y crea la primera; las demás, de una en una cuando la persona lo decide («todas» en cola, sin paralelo, parada ante cualquier fallo y comprobando el espacio). Cada unidad lista es una lección validada y guardada; el resto, con su estado real (pendiente, en preparación con su etapa, en cola, sin guardar, error, interrumpida). Cambiar un recorrido conserva lo creado; quitarlo no borra sus lecciones (**automática**: 17 pruebas; **navegador**: capturas 18 y 19; IA simulada) | Prueba real con Haiku, también de los recorridos *[Histórico: «Recorridos por unidades: no implementado» hasta el 9 nov por la noche]* |
| 15 | Fuentes y comprobación anatómica | 🟡 | Biblioteca: 3068 citas comprobadas palabra por palabra en 286 páginas, en su versión registrada. Neuri: evidencias autorizadas, descarga controlada de Wikipedia (hasta 4 páginas), comprobación semántica de cada afirmación con otra llamada y retirada de lo no respaldado. Licencias en cada fuente | Revisión profesional (la comprobación automática no la sustituye) |
| 16 | Formato, validación y publicación | ✅ | Lecciones como datos (nunca código). El mismo revisor para la biblioteca y las de Neuri. Identificadores que pone la app. Una ronda de reparación. Estado técnico y editorial separados. Las lecciones propias nunca entran en el catálogo general | Flujo editorial con permisos para publicar (depende de las cuentas) |
| 17 | Mis lecciones, versiones y almacenamiento | 🟡 | En búsqueda, filtros, guardadas, evaluación y repaso. Renombrar, quitar (con confirmación), adaptar como lección nueva, exportar e importar. «Lleno» sin borrar nada, datos dañados apartados, copias en lugar de sobrescribir, huella por pregunta. **Recorridos personales** en «Mis lecciones» («Mis recorridos»), con formato versionado, datos dañados apartados y en «Mis datos» (**automática** y **navegador**) | Sincronizar (§ 19) *[Histórico: también «Recorridos personales» hasta el 9 nov por la noche]* |
| 18 | Invitado y registro opcional | 🟡 | Todo funciona sin registro. Seudónimo solo con las estadísticas. El progreso local se explica en la app. Límites de creación por dirección | Registro y migración de invitado a cuenta (§ 19) |
| 19 | Cuentas, sincronización y acceso | ⛔ | Hay exportar, importar (combinando sin duplicar) y borrar datos (**automática**) | **Decisión de Carlos:** alojamiento y proveedor de autenticación. Después: sesiones, autorización en el servidor, sincronización y conflictos |
| 20 | Temario y plan de examen | ✅ | Interpretar (con revisión), lagunas, plan por requisitos y repasos, «no cabe» con cifras, sin fecha inventada, rehacer desde hoy con el progreso, fechas locales (corregido un desfase en la entrada), sin notificaciones (**automática** y **navegador**, captura 12) | Documentos adjuntos: no se admiten (se pega el texto) |
| 21 | Analítica y privacidad | 🟡 | «Mis datos y privacidad»: qué se guarda, qué sale (corregido para ser exacto), estadísticas desactivadas por defecto, exportar y borrar (**navegador**, capturas 13 y 14) | Servidor de estadísticas (si se quiere). Revisión legal antes de publicar |
| 22 | Eventos e indicadores | 🟡 | Eventos versionados con lista cerrada, seudónimo, sin duplicados, tiempo activo con visibilidad e inactividad. Un fallo nunca rompe el estudio (**automática**) | Envío y panel de indicadores (sin servidor); `migracion_invitado_completada` (sin cuentas) |
| 23 | Revisión docente y reportes | 🟡 | «Reportar un problema» en pasos, preguntas y fichas, con siete categorías. Cola sin IP; decisiones con revisor y fecha; retirar y reponer, también para Neuri. Penalizaciones anuladas al corregir. Paquete de revisión (`revision-docente.md`, hojas de brazo y antebrazo v2026-11-09 y generador para cualquier lección) | **Revisión profesional** (humana). Cola con permisos al publicar |
| 24 | Diseño visual y accesibilidad | 🟡 | Estilo propio oscuro (grafito y azul). Neuri con gestos y reducción de movimiento. Vistas de bienvenida, conversación, creación, resultado, errores, Mis lecciones, mapa y plan. Teclado, foco que no se pierde, `aria-live`, móvil con teclado (emulado) | Lector de pantalla y móvil real (humano); auditoría de contraste y zoom; diseño de «cuenta» (no hay cuentas) |
| 25 | Rendimiento, seguridad y coste | 🟡 | Mediciones con equipo y condiciones (`rendimiento.md`). Carga bajo demanda. Presupuestos de tokens, tamaño, frecuencia, concurrencia y reparaciones. Idempotencia. Registro técnico sin textos (con duración y trabajo). Precios comprobados | Latencia y coste reales con Haiku; límites globales en el despliegue |
| 26 | Contratos de datos | ✅ | `contratos-datos.md`: formatos versionados, estados, propietarios, transiciones y migraciones (también el del recorrido personal, versión 1). Fuente única del catálogo, también para Neuri (retiradas). Identificadores distintos. Idioma del contenido aparte del de la interfaz | Contratos de cuenta y sincronización (§ 19) |
| 27 | Pruebas de aceptación | 🟡 | `aceptacion.md`: 26 escenarios y pruebas adicionales; recorrido completo | Escenarios 19 a 22 (cuentas); prueba real con Haiku; humanas (lector de pantalla, móvil real) |
| 28 | Piloto educativo | 🟡 | `piloto.md`: objetivos, tareas, medidas, pruebas equivalentes A y B (borrador para el docente), consentimiento, hoja de observación, cuestionario y análisis descriptivo | **Realizarlo** (personas, docente, permisos): decisión de Carlos |
| 29 | Manual del estudiante | ✅ | `manual-estudiante.md`: los 10 recorridos con 19 capturas comprobadas *[Histórico: 17 antes de los recorridos por unidades]* (escritorio y móvil; las de la IA, marcadas como simuladas), sin conexión, dónde se guarda cada cosa y limitaciones. El 9 (cuenta) explica que no existe y su alternativa | — |
| 30 | Entregables | 🟡 | Ver la tabla siguiente | Lo bloqueado |

### Entregables (sección 30)

| Entregable | Dónde | Estado |
| --- | --- | --- |
| Implementación integrada y migraciones | `web/src`, `web/server`; migración del progreso v1 → v2 y campos nuevos sin cambiar de versión | ✅ |
| Prompts, formatos y validadores versionados | `server/neuri/instrucciones.mjs` (`VERSION_INSTRUCCIONES`), `src/pet/protocolo.js` (v2), `src/biblioteca/formato.js`, `reportes.js` (v1), `eventos.js` (v1), `datos.js` (v1) | ✅ |
| Cobertura real de contenido y funciones | `cobertura.md` (generado) y esta matriz | ✅ (con vacíos declarados) |
| Pruebas y resultados, simulación frente a uso real | `aceptacion.md`; `npm test` 165 de 165 *[Histórico: 148 de 148]* | ✅ simulado · ⛔ real |
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
