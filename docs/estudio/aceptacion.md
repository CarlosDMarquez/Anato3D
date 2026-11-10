---
title: Pruebas de aceptación de «Estudiar» y Neuri
fecha: 2026-11-09
estado: comprobado-en-local
---

# Pruebas de aceptación de «Estudiar» y Neuri

Los 26 escenarios obligatorios de la especificación (prompt maestro, sección 27) y las pruebas adicionales que pide, con la evidencia de cada uno. Fecha: 9 de noviembre de 2026, en el servidor de desarrollo (`npm run dev`).

**Tipos de evidencia (no se presentan unas como otras)**

| Marca | Qué es |
| --- | --- |
| **Automática** | Prueba de `npm test` (`web/tests/`). Si dice «simulada», la IA o el servidor se sustituyen por un guion o un `fetch` falso. |
| **Navegador** | Recorrido en la app de verdad (panel del navegador de Claude Code), con datos reales del navegador. Si dice «IA simulada», el servidor de Neuri se sustituyó en la página por uno simulado; no sale nada a Anthropic. |
| **Real** | Con el servicio de verdad (Claude Haiku 5.5 a través de la API). |
| **Humana** | Necesita una persona: un móvil físico, un lector de pantalla o la revisión de un especialista. |
| **Bloqueado** | Depende de una decisión o credencial externa (se dice cuál). |

**Resultado de las comprobaciones:** `npm test` da **148 pruebas, 148 correctas** *[Histórico: 145 antes de la documentación del paso 11, que añadió tres]*; `npm run check` («todo correcto»: fichas, textos en cinco idiomas, biblioteca de 71 lecciones sin errores ni avisos, inventario de Neuri al día); `vite build` sin errores. Citas de la biblioteca: **3068 comprobadas en 286 páginas, 0 sin encontrar** (`node scripts/biblioteca/fuentes.mjs comprobar`).

**Prueba real con Haiku: no hecha.** No hay clave de API en `web/.env.local` y la prueba gasta dinero: necesita el permiso de Carlos (`npm run pet:prueba` y `npm run pet:prueba -- --crear`).

## Los 26 escenarios

| # | Escenario | Resultado esperado | Estado | Evidencia |
| ---: | --- | --- | --- | --- |
| 1 | Invitado inicia una lección y recarga | Recupera contenido y progreso local | ✅ | **Navegador**: «La nariz y la cavidad nasal» en el paso 3, recarga, «Continuar donde lo dejé» abre el paso 3. **Automática**: «progreso v2: guardar y cargar…». |
| 2 | Busca con errata o sin acentos | Resultados pertinentes o aclaración | ✅ | **Automática**: «normaliza acentos y mayúsculas…», «erratas razonables sí; términos parecidos que existen, no». **Navegador**: «musculos» sin tilde da resultados. |
| 3 | Combina filtros y vuelve de una lección | Conserva consulta y selección | ✅ | **Navegador**: «musculos» + región Miembro superior + tipo Músculos y tendones → ficha → volver: la misma consulta, los mismos filtros y las mismas 6 lecciones. |
| 4 | Neuri recibe una palabra desconocida | Responde o aclara y permite continuar | ✅ (sin IA) · ⬜ real | **Automática**: «aceptación: una palabra desconocida no bloquea…». Con Haiku: pendiente de la prueba real. |
| 5 | «músculos», región, «más corto» | Conserva restricciones pertinentes | 🟡 | **Automática (simulada)**: el estado (tema, objetivo, nivel, minutos) se guarda y viaja en cada petición («conversación: orientar (estado que se conserva)…»). Que el modelo lo aplique depende de Claude (anexo A): pendiente de la prueba real. |
| 6 | Cambia de tema | Descarta restricciones incompatibles | 🟡 | Instrucción explícita en el modo orientar (anexo A y «cambio de tema» en `server/neuri/instrucciones.mjs`). Comportamiento con Haiku: pendiente de la prueba real. |
| 7 | Falla una comprobación y el servicio se recupera | Puede volver a usar la IA | ✅ | **Automática (simulada)**: «robustez 2…» (vuelve a probar a los 30 s, 60 s sin clave, 5 min sin servidor). |
| 8 | Llegan cabeceras pero el cuerpo se detiene | Termina por plazo y libera controles | ✅ | **Automática (simulada)**: «robustez 1…» y «crear: … un silencio largo es “tiempo”». |
| 9 | Falla también el respaldo local | Error recuperable | ✅ | **Automática (simulada)**: «robustez 4…» (botón «Volver a preguntar»). |
| 10 | Cancela y llega una respuesta antigua | No modifica la conversación nueva | ✅ | **Automática (simulada)**: «robustez 5…» y «conversación: cancelar una pregunta…». |
| 11 | Solicita una lección nueva | Genera, valida, guarda y abre contenido real | ✅ simulada · ⛔ real | **Automática (simulada)**: el servidor con un Claude guionizado («redactar: el flujo va diciendo cada estado…», «crear: de una vez…»). **Navegador (IA simulada)**: «Créame una lección…» empieza sin confirmar, etapas reales, «Lista para estudiar» solo tras guardar, abrir la ficha desde el aviso (también con el panel cerrado). Real: falta la clave. |
| 12 | Faltan fuentes suficientes | No presenta contenido como aprobado | ✅ | **Automática (simulada)**: «planificar: si al núcleo le faltan evidencias…», «redactar: lo no respaldado se quita… si sigue mal, no se entrega». |
| 13 | El modelo inventa una estructura | La validación la rechaza | ✅ | **Automática**: «validar: una cita retocada o una pieza que no existe son errores…». |
| 14 | Falta una pieza en un modelo corporal | Adapta la actividad o explica el límite | ✅ | **Automática**: «nunca se pregunta lo imposible…». **Navegador**: aviso «faltan en el modelo»; la pregunta que no se puede mostrar se salta y queda como técnica (no cuenta). |
| 15 | Reintenta una generación | No duplica trabajo ni contenido | ✅ | **Automática (simulada)**: «trabajos: con identificador… sin repetirla», «crear: un corte de red se reintenta con el mismo identificador…»; guardar dos veces la misma lección no la duplica. |
| 16 | Almacenamiento lleno | No elimina trabajo previo en silencio | ✅ | **Automática**: «Mis lecciones: al llegar al máximo no se borra ninguna…», «crear: si “Mis lecciones” está llena…». **Navegador**: 40 de 40 → «lista pero sin guardar» → descargar → liberar espacio → volver a guardar. |
| 17 | Adapta una lección estudiada | Conserva versión e historial anteriores | ✅ | **Automática (simulada)**: «adaptar: … crea una lección nueva» (otro identificador; la original y su progreso no cambian); guardar nunca sobrescribe (copia). |
| 18 | Evalúa una lección nueva | Preguntas enseñadas y repaso funcionan | ✅ | **Automática**: «aceptación: una lección creada por Neuri se evalúa como las demás…» (cubre todos los objetivos y entra en el repaso). |
| 19 | Crea cuenta después de estudiar | Conserva y migra sin duplicados | ⛔ | **Bloqueado**: no hay cuentas (falta decidir el alojamiento y el proveedor de autenticación). Mientras tanto: exportar e importar «Mis datos», que combina sin duplicar (**Automática**: «mis datos: exportar, importar combinando…»). |
| 20 | Usa otro dispositivo | Recupera lo sincronizado | ⛔ | **Bloqueado** (sin cuentas ni sincronización). Alternativa: el archivo de «Mis datos». |
| 21 | Cambios sin conexión | Se sincronizan con reglas de conflicto | ⛔ | **Bloqueado** (sin sincronización). Las reglas de combinación ya existen y están probadas para importar (respuesta más reciente, sin duplicados, sin «el porcentaje más alto»). Los reportes sin conexión se reenvían después (**Automática**). |
| 22 | Cambia de cuenta | No ve ni adopta datos de otra persona | ⛔ | **Bloqueado** (sin cuentas). En un dispositivo compartido: «Borrar mis datos» (**Automática**: borra todo lo de estudio y respeta los ajustes). |
| 23 | Rechaza la analítica opcional | Puede seguir estudiando | ✅ | **Automática**: «eventos: solo con consentimiento…». **Navegador**: desactivadas por defecto; con ellas activadas, los eventos no llevan textos (la búsqueda sin resultados solo dice qué filtros había). |
| 24 | Reporta una pregunta incorrecta | Se registra la versión exacta y puede corregirse | ✅ | **Navegador**: reporte desde un paso (lección, versión, paso, estructura, idioma y modelo) que llega a la cola y se revisa con `npm run reportes` (decisión con revisor y fecha). **Automática**: validación, cola sin IP, reenvío; una pregunta corregida (otra huella) o retirada deja de penalizar. |
| 25 | Móvil con el teclado abierto | Puede escribir y usar las acciones | ✅ emulado · ⬜ humana | **Navegador (375×430, como con el teclado abierto)**: se encontró que la conversación quedaba en 18 px y se corrigió (barra de sistemas oculta y cabecera compacta: 182 px de conversación; enviar visible y activo). Con un móvil físico: pendiente. |
| 26 | Teclado y lector de pantalla | Comprende estados y completa acciones | 🟡 | **Navegador**: Enter en las acciones, foco visible, el foco no se pierde cuando una creación cambia de etapa (se corrigió), anuncios en una región `aria-live`, todos los controles nuevos con nombre accesible. Con un lector de pantalla real: pendiente (humana). |

## Recorrido completo (sección 30)

Invitado → estudio → generación → evaluación → repaso → cuenta → continuidad.

| Etapa | Estado | Evidencia |
| --- | --- | --- |
| Invitado | ✅ | **Navegador:** pantalla de inicio → «Iniciar» → «Estudiar», sin registro (capturas 01 y 02 del manual). |
| Estudio | ✅ | **Navegador:** lección «La nariz y la cavidad nasal» con el visor, fuentes por paso y comprobaciones (captura 05). Recarga y «Continuar donde lo dejé» (escenario 1). |
| Generación | ✅ simulada · ⛔ real | **Navegador (IA simulada):** «Créame una lección corta sobre los huesos de la nariz» → etapas reales → «Lista para estudiar» → guardada en Mis lecciones (capturas 09 a 11). **Real:** falta la clave. |
| Evaluación de lo generado | ✅ | **Automática:** «aceptación: una lección creada por Neuri se evalúa como las demás…». En el navegador, la lección creada se abre desde el aviso y desde Mis lecciones, como las de la biblioteca. |
| Repaso | ✅ | **Navegador:** «Repasar ahora» desde el mapa; respuesta breve en una estructura ya reconocida (captura 06). **Automática:** las preguntas de una lección creada entran en el repaso. |
| Cuenta | ⛔ | **Bloqueado:** no hay cuentas (falta decidir el alojamiento y el proveedor de autenticación). |
| Continuidad | 🟡 | **Sin cuenta:** el archivo «Mis datos» se exporta en un navegador y se importa en otro, combinando sin duplicar (**automática**: «mis datos: exportar, importar combinando…»). En el navegador no se repitió el 9 de noviembre: la pestaña estaba en uso y la prueba habría borrado sus datos. |

## Pruebas adicionales que pide la especificación

| Caso | Estado | Evidencia (automática) |
| --- | --- | --- |
| Salidas truncadas | ✅ | «errores de la API y respuestas que no sirven…»; un flujo sin final es un error «incompleta», nunca una lección. |
| Formatos inválidos | ✅ | «peticiones que no se aceptan…»; importar «Mis lecciones» o «Mis datos» con otro formato; reportes mal formados (400). |
| Credenciales rechazadas | ✅ | 401 → «sin-ia», sin reintentos, la app responde con el buscador. |
| Límites del proveedor | ✅ | 429 → «limite»; sin saldo no se reintenta y se espera 10 min antes de volver a probar. |
| Entradas extensas | ✅ | Cuerpo demasiado largo → 413; textos recortados (mensajes, comentarios, temario). |
| Idiomas | ✅ | Objetivos observables en cinco idiomas; los textos de la interfaz completos en los cinco (comprobado por script). |
| Requisitos circulares | ✅ | «requisitos circulares: el orden termina, incluye todas y no repite ninguna». |
| Permisos | 🟡 | Mismo origen en el servidor; la cola de reportes no se puede leer desde la web; revisar exige `--revisor`; una lección de Neuri nunca puede figurar como revisada (ni importada). Permisos por cuenta: bloqueado (sin cuentas). |

## Fallos encontrados al hacer estas pruebas (y corregidos)

1. En el móvil con el teclado abierto, la conversación de Neuri quedaba en una franja de 18 px.
2. Al cambiar de etapa una creación, se repintaba la conversación y se perdía el foco del teclado (y el plan desplegado se cerraba).
3. Tras recargar a mitad de una creación, el servidor sin clave decía «sin IA» en vez de «ya no tengo ese trabajo».
4. Una comprobación inicial y una respuesta en el mismo milisegundo podían pisarse (ahora manda el orden de las peticiones, no la hora).
5. La tarjeta de una lección que no se pudo guardar decía «No se creó» (sí se creó; lo que faltaba era guardarla).
6. Escribir una búsqueda sin resultados anotaba un evento por cada letra (ahora, si se queda así dos segundos).
7. Las fechas del plan de examen salían como «10 De Noviembre».
8. La entrada de «Estudiar» decía «examen el 20 nov» cuando el examen era el 21. Las fechas sin hora se leían como medianoche UTC, que al oeste de Greenwich es el día anterior. Se corrigió, con una prueba en la zona horaria del Pacífico.
9. El informe de una lección creada juntaba dos frases sin punto: «9 citas comprobadas Se quitó…».
10. «Mis datos y privacidad» decía que a Neuri solo le llegan «qué lecciones has hecho». También le llegan las empezadas, las que tienen repasos pendientes y las guardadas (solo identificadores), y al adaptar una lección propia, la lección entera. Se corrigió en los cinco idiomas.
11. En el móvil, el texto de ejemplo del buscador se cortaba a media palabra («un sistem»); ahora termina en «…».
12. El servidor de Neuri no conocía la lista de contenido retirado. La app ya descartaba esas recomendaciones, pero Claude seguía viendo la lección como candidata. Ahora el servidor la quita de su catálogo, con prueba.
13. Al desactivar las estadísticas se borraban los eventos, pero se quedaba el seudónimo. Ahora se borra también, y al reactivarlas se crea otro, con prueba.
14. El registro técnico del servidor no anotaba la duración de cada llamada ni a qué creación pertenecía. Ahora sí, sin textos de la conversación, con prueba.

Los fallos 8 a 14 se encontraron al documentar y medir (paso 11), después de los recorridos de arriba.
