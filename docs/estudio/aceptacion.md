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

**Resultado de las comprobaciones (12 nov 2026):** `npm test` (`node --test tests/`) da **314 pruebas, 314 correctas**, con las sesiones de estudio, el cupo diario, el texto fijo por modo y el sistema linfático nuevo. `npm run check` da «todo correcto»: biblioteca de **87 lecciones** (0 errores y los 3 avisos previstos de `cab-surcos-medial`), textos sin traducir 0 (en el contenido solo exige el inglés desde el 12 nov), inventario de Neuri al día y 66 avisos de campos «pendiente» en las fichas linfáticas (sin fuente libre, no se afirma nada). Citas de la biblioteca: **4130 comprobadas en 511 páginas**.

*Resultado del 11 nov:* `npm test` daba **239 pruebas, 239 correctas**, con los cinco prompts de ChatGPT del 11 nov *[Histórico: 181 con las tres ramas fusionadas en `main` el 11 nov; 165 con los recorridos por unidades; 148 antes de ellos, que añadieron 17; 145 antes de la documentación del paso 11, que añadió tres]*; `npm run check` («todo correcto»: fichas, textos en cinco idiomas, biblioteca de 84 lecciones sin errores y con los 3 avisos previstos de `cab-surcos-medial` *[Histórico: 71 lecciones sin errores ni avisos]*, inventario de Neuri al día); `vite build` sin errores. Citas de la biblioteca: **3969 comprobadas en 478 páginas, 0 sin encontrar** *[Histórico: 3068 en 286]* (`node scripts/biblioteca/fuentes.mjs comprobar`).

**Prueba real con Haiku: no hecha.** No hay clave de API en `web/.env.local` y la prueba gasta dinero, así que necesita el permiso de Carlos.
- **Preparada y ensayada con el proveedor simulado:** la prueba mínima, `node scripts/prueba-minima.mjs --si-gastar`. Son tres llamadas, unos 0,01 US$ y 0,0123 US$ como máximo desde el texto fijo por modo *[Histórico: 0,1705 US$]* (`activacion.md`, sección 8).
- **Las largas:** `npm run pet:prueba` y `npm run pet:prueba -- --crear`.

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

### Limitaciones conocidas del modelo (9 nov 2026, noche)

Estos casos no son de la especificación: los pidió la ronda 1 del bucle con ChatGPT. Se probaron en la rama
`claude/limitaciones-modelo`, y el detalle está en `limitaciones-modelo.md`.

| Caso | Resultado esperado | Estado | Evidencia |
| --- | --- | --- | --- |
| Abrir desde el buscador la ficha de una pieza limitada | Aviso visible en la cabecera; explicación con estado, fecha y fuentes | ✅ | **Navegador:** `Paracentral_sulcus`, en escritorio y en el móvil con la ficha plegada, en los cinco idiomas. **Automática:** `npm run check` valida que el registro tenga los cinco idiomas y fuentes. |
| Evaluar una lección con la pieza en el núcleo | No se pregunta ni se ofrece como opción; la ficha y el resultado lo explican | ✅ | **Navegador (Neuri simulado):** la ficha de la lección dice «1 pregunta en 3D… no se hace»; 4 preguntas sin la pieza ni su nombre; nota en el resultado. **Automática:** `limitaciones.test.mjs`. |
| Un fallo antiguo sobre la pieza | Se conserva sin contar y no vuelve al repaso | ✅ | **Navegador:** el ítem queda huérfano y «Repasar ahora» baja de 4 a 3. **Automática.** |
| Una estructura de varias piezas con una limitada | Sigue valiendo con las demás | ✅ | **Navegador:** se resalta y se toca sin la limitada, con el aviso de nombre dudoso en el paso. **Automática.** |
| Neuri crea una lección con la pieza en el núcleo | Recibe la nota; quita las actividades en 3D sobre ella y el informe lo dice | ✅ simulada · ⛔ real | **Automática (simulada):** el informe da `limitesModelo: 3` y `quitadas: 0`; una actividad que pone primero la pieza limitada se quita, no se cambia de pieza; la validación rechaza lo que se escape. Real: falta la clave. |
| Se nombra la pieza a Neuri en francés o en italiano, o en la pregunta siguiente | Recibe la nota igual | ✅ simulada | **Automática (simulada):** «sillon paracentral», «solco temporale inferiore», «artère méningée moyenne» y «¿Y dónde lo veo en el modelo 3D?» tras nombrarla. |
| Se repasa en un modelo una lección que solo existe en el otro | El mensaje de siempre, sin culpar a las limitaciones | ✅ | **Automática:** los ítems siguen como antes y no se cuentan como limitaciones. Era una regresión; la encontró la revisión adversarial y está corregida. |
| Una evaluación con un objetivo que no se puede evaluar | Con 4 de 4, el veredicto de la limitación; con 0 de 4, el de siempre y la nota aparte | ✅ | **Navegador:** las dos, con una lección propia simulada. |

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
| Idiomas | ✅ | Objetivos observables en cinco idiomas. Desde el 12 nov, la interfaz se usa en español e inglés (alemán, francés e italiano, «próximamente»): las pruebas exigen cada texto en español e inglés y los de los otros tres solo si existen; en el contenido, `npm run check` exige solo el inglés *[Histórico: textos de la interfaz completos en los cinco, comprobado por script]*. |
| Requisitos circulares | ✅ | «requisitos circulares: el orden termina, incluye todas y no repite ninguna». |
| Permisos | 🟡 | Mismo origen en el servidor; la cola de reportes no se puede leer desde la web; revisar exige `--revisor`; una lección de Neuri nunca puede figurar como revisada (ni importada). Permisos por cuenta: bloqueado (sin cuentas). |

## Petición extensa: un recorrido por unidades (sección 14)

«Para peticiones extensas, crea un recorrido dividido en unidades y desarrolla bloques manejables. Cada unidad disponible debe estar completa; el resto debe figurar con su estado real.» No es uno de los 26 escenarios, pero se comprobó igual. En el navegador, con la IA simulada y el servidor de una copia aparte (puerto 5181).

| Caso | Estado | Evidencia |
| --- | --- | --- |
| Pide un curso entero | ✅ simulada · ⬜ real | **Automática (simulada)**: «orientar: «créame un curso…» llega como propuesta de recorrido…», «planificar un recorrido: unidades revisadas (de 2 a 8, sin repetir y con objetivo)…», «recorrido: «créame un curso…» planifica las unidades y crea solo la primera…». **Navegador (IA simulada)**: «Créame un curso del miembro superior» → cuatro unidades → la primera se crea sola hasta «Lista para estudiar»; las demás esperan. **Real**: pendiente de la prueba con Haiku. |
| Cada unidad, completa y de una en una | ✅ simulada | **Automática (simulada)**: «una unidad se planifica sola…», «recorrido: de una en una; «todas» van en cola, nunca en paralelo…». Cada unidad es una creación como las demás: plan, redacción, comprobación de citas y guardado en Mis lecciones. **Navegador (IA simulada)**: «Crear las 3 que faltan, una tras otra» → una en marcha, con su etapa real, y las demás «En cola» (captura 18 del manual). |
| El resto, con su estado real | ✅ simulada | **Automática (simulada)**: «recorrido: cada unidad dice su estado real (sin guardar, interrumpida, error, cancelada, lección quitada)…», «recorrido: al recargar, la unidad en preparación se retoma sin repetirla…». **Navegador (IA simulada)**: cancelada; con error e «Intentarlo de nuevo»; «En preparación» dice «Unidad 3 de 3 de «Miembro superior»». |
| Sin sitio en Mis lecciones | ✅ | **Automática (simulada)**: «recorrido: si no cabe en «Mis lecciones», la unidad no empieza (ni gasta) y lo dice…». |
| Cambiar el recorrido | ✅ simulada | **Automática (simulada)**: «cambiar un recorrido: lo creado se conserva con sus textos…», «recorrido: cambiarlo conserva lo creado…». **Navegador (IA simulada)**: «quita los músculos del brazo y los nervios y añade la mano» → se conservan las unidades creadas, entra «La mano» y un aviso dice qué salió; sus lecciones siguen en Mis lecciones (4 de 4). |
| Quitar el recorrido | ✅ | **Automática (simulada)**: «recorrido: quitarlo no borra sus lecciones…». **Navegador**: la confirmación pone el foco en «Quitar solo el recorrido»; las lecciones se quedan (5 de 5). Quitarlas también es un botón aparte que avisa de que no se puede deshacer. Mis recorridos: captura 19 del manual. |
| Sin IA | ✅ | **Automática**: «sin IA: «créame un curso…» dice que crear necesita la IA y busca lo que hay de ese tema». **Navegador**: sin botones para crear ni para cambiar, y con el aviso. |
| Guardado, Mis datos e idiomas | ✅ | **Automática**: «recorrido: guardado versionado…», «Mis datos: los recorridos se exportan, se importan sin duplicar…», «textos de los recorridos: en los cinco idiomas y, en francés, siempre de «vous»». **Navegador**: francés, móvil a 375 px sin desbordes y «Mis datos» con los recorridos. |

## Sesiones de estudio con Neuri y cupo diario (12 nov 2026)

No son escenarios numerados de la especificación: los pidió el encargo de Neuri como tutor (11 nov, noche). Diseño en `neuri.md` («Sesiones de estudio con Neuri» y «Cupo diario por dispositivo»).

**Entornos:** «Automática» es `npm test`, sin red; «IA simulada», con Claude guionizado; «IA real pendiente» y «Alojamiento público pendiente», como en la tabla del lanzamiento (abajo). **En el navegador no hay todavía un recorrido documentado de las sesiones**: falta hacerlo y sacar sus capturas (`manual-estudiante.md`, sección 5).

| # | Caso | Resultado esperado | Estado | Entorno | Evidencia |
| ---: | --- | --- | --- | --- | --- |
| S1 | Sesión sin IA | Un tema claro da un plan válido y la sesión se hace entera sin llamar a nadie | ✅ | Automática | «conversación: una sesión de 10 minutos sobre un tema claro se crea y se termina con CERO llamadas»; «una sesión de 10 minutos sobre el corazón, de principio a fin, con un fallo, una pista y una recarga a mitad: cero llamadas»; «planificador: un tema claro da un plan válido sin IA…» |
| S2 | Objetivo ambiguo, con IA | Modo `sesion`; plan solo con lecciones que existen; si falla o no hay cupo, la planifica la app | ✅ simulada · ⛔ real | IA simulada · IA real pendiente | «conversación: un objetivo que mezcla temas va a Neuri…»; «sesión: un plan con lecciones candidatas que existen…»; «sesión: una ronda de corrección…»; «sesión: sin lecciones que encajen no se llama a Claude…» |
| S3 | Reanudar | Al recargar, el mismo bloque y la misma pregunta; avanzar dos veces no duplica; terminar antes conserva lo hecho | ✅ | Automática | «sesiones: reanudar tras recargar deja en el bloque exacto…»; «el segundo intento se guarda en la sesión…» |
| S4 | Varias sesiones y almacenamiento | Solo una activa; como mucho 20 sin quitar la activa ni la nueva, con aviso; lo dañado se aparta; sin espacio, aviso | ✅ | Automática | «sesiones: solo una activa también al avanzar o saltar…»; «sesiones: al pasar de 20…»; «sesiones: si el navegador no deja guardar, se avisa…» |
| S5 | Pista y segundo intento | La pista sale de un paso verificado y nunca dice el nombre; lo acertado con ayuda no sube de caja ni demuestra la habilidad | ✅ | Automática | «la pista de cada pregunta 3D de la biblioteca sale del paso verificado y nunca dice el nombre…»; «la pista nunca revela el nombre por el título del paso…»; «mapa: lo acertado con pista o en el segundo intento no demuestra la habilidad (ni en el perfil de Neuri)…» |
| S6 | Lección que desaparece o pieza que el modelo no muestra | Se quita del plan y se dice; lo hecho se conserva | ✅ | Automática | «sesiones: un plan del servidor se materializa con preguntas y pasos reales…»; «sesiones: si una lección desaparece…» |
| S7 | Preguntar a Neuri en una evaluación | No da la respuesta: una pista o en qué paso se explica; desde un paso, solo con la comprobación respondida | ✅ simulada · ⛔ real | IA simulada · IA real pendiente | «orientar: con enfoque, primero las evidencias de esa lección y ese paso…» (instrucción y enfoque). El botón oculto del paso está en `leccion.js`, sin prueba automática (es DOM). Que Haiku lo cumpla: prueba real |
| S8 | Perfil que viaja | Sin fechas, sin respuestas, ≤ 6 dificultades, ≈ 250 tokens el más lleno; el texto de la persona va como dato | ✅ | IA simulada | «sesión: el perfil llega recortado…»; «inyección: el título de la última sesión (perfil) y el tema de la conversación no van en las instrucciones…» |
| C1 | El cupo cuenta y se ve | Cada pregunta con IA cuenta una; el saldo llega en todas las respuestas, también en el `GET` | ✅ | IA simulada | «servidor: cada pregunta cuenta una…»; «conversación: lee el cupo de todas las respuestas…» |
| C2 | Cupo agotado | `429 cupo` sin llamar a Claude; responde la biblioteca, sin muro; una creación queda en pausa, no fallida | ✅ | IA simulada | «servidor: … agotado, 429 «cupo»…»; «trabajos: el cupo diario de creaciones agotado es una pausa…» |
| C3 | Creaciones | Planificar cobra la creación una vez; redactar ese plan o reanudar no cobra otra; cancelar a mitad no la devuelve | ✅ | IA simulada | «servidor: planificar una lección cobra la creación…»; «servidor: redactar un plan que no se cobró…»; «servidor: cancelar una creación a mitad (o un 5xx)…» |
| C4 | Renovación | A medianoche de America/Tijuana, no en UTC | ✅ | Automática | «cupo: se renueva a medianoche en la zona del servidor…» |
| C5 | Reinicio | Con `ANATO3D_CUPO_SAL`, los contadores siguen; sin ella, empiezan de nuevo y el registro lo dice; el archivo no guarda ni el identificador ni la IP | ✅ local · ⏳ volumen | Automática · Alojamiento público pendiente | «cupo: persiste tras reiniciar (con ANATO3D_CUPO_SAL)…»; «cupo: la sal del HMAC no está en el archivo…». En el volumen de Fly: sin probar |
| C6 | Otro identificador o sin cabecera | Sin cabecera cuenta la IP; borrar los datos crea otro identificador (su cupo empieza de cero), pero el tope por IP sigue; una IPv6 cuenta por su /64 | ✅ | Automática | «servidor: sin cabecera (o con una inválida) cuenta la IP; el tope por IP actúa aunque cambie el dispositivo»; «IP: una IPv6 cuenta por su /64…» |
| C7 | Dos procesos | No cuentan cada uno (cerrojo) | ✅ | Automática | «cupo: dos procesos con el mismo archivo no cuentan cada uno…» |
| D1 | Mis datos | Las sesiones se exportan e importan (la activa llega pausada); el dispositivo y la memoria se ven y se borran, pero no se exportan; «Borrar mis datos» olvida el tema | ✅ | Automática | «mis datos: las sesiones se exportan e importan…»; ««Borrar mis datos» olvida también el tema que recuerda Neuri…» |
| D2 | Textos nuevos | En español e inglés; alemán, francés e italiano, «próximamente» | ✅ | Automática | «textos nuevos de las sesiones, el cupo y el enfoque: en español e inglés…» |
| R | Calidad real de la sesión con Haiku | Plan útil, explicaciones correctas | ⏳ | IA real pendiente | Falta la clave y el permiso de Carlos |

## Lanzamiento ensayado con el paquete (11 nov 2026)

**Qué se ensayó:**
- el paquete de producción (`npm run paquete` → `build/paquete`), arrancado con `node servidor.mjs`, fuera de Vite y sin el árbol de desarrollo;
- en el navegador del panel, en escritorio y en vista móvil (375 × 812), en el puerto 5290;
- con el SDK real de Anthropic, pero apuntando al proveedor simulado de este Mac (`scripts/proveedor-simulado.mjs`): no salió nada a Anthropic ni se gastó nada.

Cómo activarlo de verdad: `activacion.md`. Alojamiento: `despliegue.md`.

**Entornos (no se presentan unos como otros):**

| Entorno | Qué quiere decir |
| --- | --- |
| **Paquete probado localmente** | El paquete en este Mac, en una carpeta limpia, sin `build/` ni el código de desarrollo |
| **Proveedor simulado** | El SDK real habla HTTP (y flujo SSE) con un servidor local de respuestas fijas. El servicio dice «simulado», nunca «comprobada» |
| **Alojamiento público pendiente** | Necesita la cuenta y el despliegue en Fly.io (o el que elija Carlos) |
| **IA real pendiente** | Necesita la clave y el permiso de Carlos para gastar |

Ni una clave configurada ni una respuesta simulada hacen que una instalación pase a «comprobada». Solo lo hace una llamada real a Claude que sale bien.

| # | Escenario | Resultado | Entorno | Evidencia |
| ---: | --- | --- | --- | --- |
| 1 | Arranque en una carpeta limpia: sirve la web | ✅ | Paquete probado localmente | **Automática:** «paquete: arranca en una carpeta limpia…» |
| 2 | Lo que no se expone y lo que no se vuelve a bajar | ✅ | Paquete probado localmente | **Automática:** misma prueba. No sirve recursos, manifiesto, servidor, datos ni plantillas (404, también con `..` codificado). Revalida con ETag (`304`) |
| 3 | Creación en flujo: varias líneas NDJSON antes del final; llega la lección con sus citas | ✅ | Paquete + proveedor simulado | **Automática:** «paquete con el proveedor simulado: la creación llega línea a línea…» |
| 4 | Una clave centinela no aparece en los archivos públicos, las respuestas, los registros ni los datos | ✅ | Paquete + proveedor simulado | **Automática:** misma prueba |
| 5 | Desconectar a mitad y volver al mismo trabajo: no arranca otra generación | ✅ | Paquete + proveedor simulado | **Automática:** «paquete: desconectar a mitad y volver a conectar…» |
| 6 | Reinicio con una reserva activa: el saldo no vuelve y nada se cobra dos veces por sí solo | ✅ | Paquete + proveedor simulado | **Automática:** «paquete: un reinicio con una reserva activa…» |
| 7 | IA apagada o almacén del tope roto: la web sigue | ✅ | Paquete + proveedor simulado | **Automática:** misma prueba |
| 8 | Sin las páginas citables, o alteradas: Neuri no explica con citas ni crea, y lo dice | ✅ | Paquete probado localmente | **Automática:** «paquete sin el corpus completo o alterado…» |
| 9 | Sin clave: el buscador | ✅ | Paquete probado localmente | **Automática:** misma prueba |
| 10 | Los reportes van por su camino (carpeta de datos, sin la IP) y su cola no se puede leer desde la web | ✅ | Paquete probado localmente | **Automática:** «paquete: los reportes van por su camino…» |
| 11 | La dirección del cliente solo sale del proxy configurado, y con su secreto | ✅ | Paquete probado localmente | **Automática:** «configuración: la dirección del cliente…» |
| 12 | El Worker de Cloudflare reenvía `/api/*` con el secreto y sustituye las cabeceras que mande el navegador | ✅ | Paquete probado localmente | **Automática:** «Worker de Cloudflare (plantilla)…». Plantilla sin probar en Cloudflare |
| 13 | La simulación solo se activa en las pruebas o en el ensayo local | ✅ | Paquete probado localmente | Solo con `ANTHROPIC_BASE_URL` del servidor, y solo en `localhost`; con otra dirección, el servidor no arranca (**Automática:** «configuración…»). El navegador no tiene ninguna opción para activarla |
| 14 | Búsqueda local con la frase de Carlos: «Quiero aprender la anatomia del órgano reproductor femenino» | ✅ | Paquete probado localmente | **Navegador:** «Sistema reproductor femenino», «Resuelto en tu dispositivo, sin IA», 0 peticiones a la API |
| 15 | Seguimiento de una recomendación | ✅ | Paquete probado localmente | **Navegador:** «músculos del brazo» y después «el segundo», resuelto en local con las tarjetas recién mostradas |
| 16 | Explicación con fuentes | ✅ | Paquete + proveedor simulado | **Navegador:** «¿Qué forman los huesos nasales? Explícamelo.» → explicación con 2 citas comprobadas por el servidor |
| 17 | Creación | ✅ | Paquete + proveedor simulado | **Navegador:** «Créame una lección de los huesos de la nariz» → guardada en «Mis lecciones», con 4 pasos, 4 preguntas y 4 citas |
| 18 | Adaptación | ✅ | Paquete + proveedor simulado | **Navegador:** «Adapta la lección de la nariz para el examen» → lección adaptada a partir de `cab-nariz` |
| 19 | Curso de más de cuatro unidades | ✅ | Paquete + proveedor simulado | **Navegador:** «Créame un curso del miembro superior». La unidad 1 queda lista. Con la cuota llena (4 creaciones por hora), la quinta queda «En pausa… sigue a las 20:49» y la cola espera. Tras recargar, la pausa se conserva sin reintentar sola, y «Seguir ahora» la retoma |
| 20 | Cancelación | ✅ | Paquete + proveedor simulado | **Navegador:** la unidad 2, cancelada a mitad, sigue pendiente hasta que la persona decida. Su reserva quedó «incierta» y cuenta entera (`npm run presupuesto`) |
| 21 | Límite de gasto y continuación local | ✅ | Paquete probado localmente | **Navegador**, con el interruptor `IA-APAGADA`: «Explícame cómo funciona el manguito rotador» llega al servidor, que responde «límite» sin llamar a Claude. Neuri contesta con el buscador («Músculos del hombro: deltoides y manguito rotador») y la cabecera pasa a «Límite de gasto con IA alcanzado». Lo siguiente se resuelve en local, sin peticiones |
| 22 | Los estados visibles, en cinco idiomas | ✅ | Paquete + proveedor simulado | **Navegador (11 nov):** es, en, fr, de e it. Desde el 12 nov solo se eligen español e inglés |
| 23 | Vista móvil (375 × 812) | ✅ | Paquete probado localmente | **Navegador:** sin desbordamiento horizontal; carga el modelo ligero (`male.ligero.glb`) |
| 24 | Prueba real mínima, ensayada | ✅ | Proveedor simulado | **Automática:** «la prueba real mínima, ensayada con el proveedor simulado…». **A mano (11 nov):** 3 llamadas, 2 citas, flujo correcto, máximo admitido 0,1705 US$ (desde el 12 nov, 0,0123 US$ por el texto fijo por modo). Sin `--si-gastar` no envía nada |
| 25 | `npm test`, `npm run check` y `npm run build` | ✅ | Este Mac | Resultado al principio de este documento |
| 26 | Despliegue en Fly.io: una sola Machine con volumen, `/salud`, secretos | ⏳ | Alojamiento público pendiente | Plantillas en el paquete (`fly.toml`, `Dockerfile`), sin probar. Pasos: `activacion.md`, sección 4 |
| 27 | El flujo atraviesa el alojamiento sin acumularse (una línea cada 15 s como mínimo) | ⏳ | Alojamiento público pendiente | `activacion.md`, sección 5, paso 4 |
| 28 | IA real: Haiku 5.5 con la clave, explicación con fuentes, flujo y conciliación con `usage` | ⏳ | IA real pendiente | Preparada (`node scripts/prueba-minima.mjs --si-gastar`), sin ejecutar contra Anthropic |
| 29 | Estado «comprobada» | ⏳ | IA real pendiente | Solo tras una llamada real que salga bien. El proveedor simulado da «simulado» (escenario 3) |

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

15. En «Mis lecciones», el apartado «En preparación» no se actualizaba mientras una creación avanzaba o terminaba: solo se repintaba la portada de «Estudiar».
16. El título del plan de una creación salía a 12 px, porque una regla general de los títulos del panel lo pisaba.

17. **El paquete imprimía la ayuda de `fuentes.mjs` al arrancar.** El servidor empaquetado incluía el bloque que ese script ejecuta cuando se llama solo. Ahora el script comprueba el nombre del archivo antes de ejecutarlo.
18. **En el paquete, una unidad del curso no pasaba la validación.** Neuri le añadía citas de TeachMeAnatomy, unas páginas que el paquete no lleva y que, por tanto, no se pueden comprobar. Ahora solo añade citas comprobables, con prueba.
19. **Los modelos 3D no llevaban etiqueta (ETag) en el servidor de producción.** Se habrían vuelto a descargar enteros cada hora. Ahora, si no cambiaron, la respuesta es `304`, con prueba.

**Revisión adversarial de las sesiones y el cupo (12 nov 2026).** 13 fallos reales, demostrados y arreglados, cada uno con su prueba.

En el servidor (5):

20. **El cupo se devolvía tras cancelar.** Una creación cancelada a mitad, que el tope de gasto cobra entera, devolvía la unidad del cupo. Ahora cuenta.
21. **Planificar no cobraba.** Ahora planificar una lección o una unidad cobra la creación, ligada a su trabajo y a su plan.
22. **IPv6.** Ahora una IPv6 cuenta por su /64, y una IPv4 dentro de IPv6, como la IPv4 (en el cupo, el limitador y el servidor).
23. **La sal del HMAC estaba en el archivo del cupo.** Ahora sale de la variable `ANATO3D_CUPO_SAL` (versión 2 del archivo).
24. **Inyección por el título.** El título de la última sesión llegaba a las instrucciones. Ahora al modelo solo le llegan sus cifras, y el texto de la persona va en su mensaje como dato.

En la app (8):

25. **La pista revelaba el nombre** de la respuesta (también por el título del paso).
26. **La ayuda se perdía al recargar:** el segundo intento empezaba otra vez «a la primera».
27. **«Borrar mis datos» no olvidaba el tema** que recuerda Neuri.
28. **La ayuda contaba como dominio:** lo acertado con pista o en el segundo intento demostraba la habilidad.
29. **Dos sesiones activas** al avanzar o saltar una planificada.
30. **Frases de control:** pausar, parar o terminar una sesión, o seguirla con un mensaje largo, no se resolvían bien en la app.
31. **Almacenamiento lleno:** una sesión que no se podía guardar se perdía en silencio.
32. **Poda:** al pasar de 20 sesiones, ahora se quitan por orden (planificadas sin empezar, finalizadas y, si hace falta, pausadas), nunca la activa ni la nueva, y se avisa de lo quitado.

Los fallos 8 a 14 se encontraron al documentar y medir (paso 11), después de los recorridos de arriba. Los fallos 15 y 16, al hacer los recorridos por unidades (sección 14); afectaban también a las creaciones de antes. Los fallos 17 a 19, al ensayar el lanzamiento con el paquete (11 nov). Los fallos 20 a 32, en la revisión adversarial del 12 nov.
