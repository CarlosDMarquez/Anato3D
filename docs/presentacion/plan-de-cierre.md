# NeuroFuture · Cierre de la primera versión de Anato3D
11 de noviembre de 2026. Versión examinada `454a3cb`. Plan de trabajo para Carlos.

**Ya puedes solicitar la reunión.** Presenta Anato3D como una herramienta educativa en desarrollo. La decisión que buscas es que un docente de anatomía del miembro superior acepte revisar una actividad concreta y te diga si vale la pena probarla con su grupo.

## Qué tienes entre manos

| Evidencia | Qué puedes afirmar ante la facultad |
| --- | --- |
| Dos modelos corporales, controles por sistema, fichas y lecciones con visor | Puedes abrir una lección, cambiar de vista y examinar la pieza que menciona el texto. |
| 71 lecciones, 18 módulos y 11 recorridos | Las 71 lecciones previstas existen. De 1,718 estructuras distintas de los modelos, 795 se enseñan y evalúan en alguna lección. Algunas fichas del visor solo tienen una descripción genérica. |
| 1,104 preguntas y 3,068 citas comprobadas en 286 páginas | El proyecto comprueba la presencia de las citas. Las 71 lecciones proceden de borradores redactados con IA. Falta que un especialista juzgue si cada explicación interpreta bien la fuente y si la pieza 3D coincide. |
| Prueba local del 11 de noviembre | Pasaron las 148 pruebas, el control de fichas, textos y catálogo, y la compilación de producción. Vite advierte del tamaño del paquete principal. La fluidez con el proyector y los equipos de la facultad sigue por comprobar. |
| Estudio como invitado, mapa y repaso | El progreso se guarda en ese navegador. «Mis datos» permite exportarlo e importarlo. Neuri puede orientar con el buscador local. El servidor local indicó que la generación con IA está desactivada por falta de clave. |

Fuentes del proyecto: [cobertura](../estudio/cobertura.md), [aceptación](../estudio/aceptacion.md), [guía operativa](../estudio/guia-operativa.md) y [manual del estudiante](../estudio/manual-estudiante.md).

## Antes de la primera reunión

1. **Hoy, Carlos.** Pide 20 minutos a un docente que imparta miembro superior. Puedes hacerlo mientras preparas el equipo. Envía una sola actividad como muestra. Las hojas completas tienen 201 decisiones para brazo y 168 para antebrazo.
2. **En tu computadora, reserva 30–45 minutos de ensayo.** Con las dependencias que ya están instaladas, desde la carpeta del proyecto ejecuta lo siguiente. Deja la terminal abierta y abre la dirección local que muestre Vite.

   ```sh
   npm --prefix web run build
   npm --prefix web run preview -- --host 127.0.0.1
   ```

   En un navegador nuevo la interfaz arranca en inglés. En **Settings**, elige **Español**. Prueba con el tamaño y el proyector que usarás. Si usas un perfil limpio para el ensayo, no tienes que borrar el progreso personal. Conserva en la computadora el PowerPoint, que incluye capturas por si el visor se interrumpe.
3. **Durante la reunión, unos 6–8 minutos de exposición.** Presenta la pregunta «¿Qué referencias usaría su grupo para distinguir el bíceps del braquial?». Pulsa **Iniciar**, el birrete **Estudiar**, busca **brazo** y abre **El brazo: compartimentos anterior y posterior**. En el tercer paso, muestra el compartimento anterior. Gira la vista, pide al docente que señale la inserción que distingue y abre las fuentes. Termina con una pregunta de identificación o con la captura de evaluación del PowerPoint. En una reunión corta, prepara el tercer paso en una pestaña antes de empezar.
4. **Al cerrar, Carlos y docente.** Anota la vista, el modelo corporal, la versión y las palabras del docente. Acuerda quién revisará la muestra y en qué fecha. Si el docente prefiere otro tema, pídele que señale una lección concreta de su programa.

### Mensaje listo para adaptar

**Asunto** — Solicitud de revisión docente de una lección de anatomía en 3D

> Buen día. Soy Carlos, del proyecto NeuroFuture en Mexicali. Desarrollé Anato3D, un sitio en el que el estudiante explora un modelo anatómico y contesta preguntas sobre lo que observa. Me gustaría mostrarle una actividad de los compartimentos del brazo. El contenido incluye fuentes y está pendiente de revisión por anatomistas.
>
> ¿Tendría 20 minutos para ver una demostración y decirme si la vista y la pregunta son adecuadas para su curso? Yo llevaría el equipo y la hoja de revisión. Si otra persona imparte este tema, agradecería que me indicara con quién comunicarme.
>
> Carlos · NeuroFuture

Tomé Mexicali como punto de partida por la sede del proyecto. En Universidad Xochicalco, el directorio identifica la Coordinación de Primer Nivel de Medicina del campus. En UABC, pide a la Facultad de Medicina y Nutrición que te canalice con quien imparte anatomía del miembro superior. [Directorio de Xochicalco](https://contacto.xochicalco.edu.mx/) · [Directorio de la facultad de UABC](https://fmed.mxl.uabc.mx/directorio.php).

## Antes de usarlo con estudiantes

| Responsable | Pendiente y criterio de cierre |
| --- | --- |
| Anatomista y Carlos | Revisar la versión que se mostrará. Empezar con el paso 3 de brazo, las filas V1 y V2 y una pregunta asociada. Registrar «Correcto», «Corregir» o «Dudoso». Comprobar nombre, lado, inserción visible, vista, fuente y respuesta admisible. Escalar a las partes de brazo y antebrazo que sí se usarán. |
| Carlos | Corregir o retirar todo error que cambie lo que aprendería el alumno. Volver a abrir las vistas en los modelos que se usarán y pedir que se verifique la corrección. Publicar el alcance y fecha de la revisión. La aprobación de una vista cubre únicamente esa vista y esa versión. |
| Docente | Revisar simplificaciones que puedan producir respuestas injustas. Por ejemplo, la aponeurosis bicipital carece de pieza independiente y varios trayectos vasculonerviosos femeninos proceden del ajuste del modelo masculino. Preguntar si la nomenclatura y los sinónimos coinciden con los que acepta su curso. |
| Docente e institución | Elegir grupo, validar preguntas equivalentes y acordar las condiciones de participación, datos que se recogerán, acceso y fecha de borrado. Confirmar con la facultad qué autorización corresponde a su actividad. |
| Carlos | Ensayar en el equipo del aula y, si el grupo usará teléfonos, en iPhone/Safari y Android/Chrome físicos. Medir la primera carga, giro y cambio de modelo. Probar navegación con teclado, lectura de estados con lector de pantalla y una alternativa si seleccionar una pieza en 3D resulta inaccesible. |
| Docente y Carlos | El protocolo existente propone 5–8 alumnos voluntarios, una sesión de 90 minutos y otra de 25 minutos una semana después. Registrar errores de identificación, tareas bloqueadas, necesidad de ayuda y recuerdo desde otra vista. Entregar resultados descriptivos y las correcciones acordadas. |

El protocolo original incluye una lección generada por Neuri. Para acelerar el primer piloto, propongo acordar y **documentar una versión reducida** con las dos lecciones de biblioteca, quitando la tarea T6 y sus preguntas y medidas de IA. Si el docente quiere conservar el protocolo completo, hace falta activar la API, crear una lección real, exportarla y revisarla antes de cargarla en cada equipo. La duración se puede ajustar con el docente. Las cifras anteriores corresponden al protocolo que ya existe. [Protocolo](../estudio/piloto.md) · [hoja de brazo](../revision/brazo-2026-11-09.md) · [hoja de antebrazo](../revision/antebrazo-2026-11-09.md).

## Para compartir una URL pública

- **Versión inicial en español.** Elegir alojamiento y una dirección estable. Para un visor y estudio como invitado puede servirse la compilación estática. Comprobar desde un equipo externo y un navegador limpio que abren las lecciones, los archivos GLB, el decodificador Draco y las fuentes. Medir la primera visita con la red real. El paquete de modelos ocupa unos 67 MiB en disco y se carga por partes.
- **Correcciones desde la web.** Decidir cómo recibirá Carlos un reporte real. Si se conserva el botón, conectar la API de reportes a almacenamiento persistente, probar un envío completo e identificar quién revisa la cola. Para una edición estática, ofrecer un canal de contacto que funcione e indicar sus límites en el sitio.
- **Créditos, textos y privacidad.** Inventariar modelos, iconos, citas y material fuente incluidos en lo que se va a distribuir. El proyecto identifica modelos derivados de Z-Anatomy/BodyParts3D y distingue páginas CC BY-SA de fuentes como TeachMeAnatomy con copyright. Verificar con el titular o asesoría el uso previsto de los extractos y las copias de páginas antes de distribuirlas. Dejar visibles atribución, procedencia de los borradores, alcance de revisión, contacto y qué datos guarda o envía cada función.
- **IA si se ofrece al público.** Configurar clave solo en el servidor, límites de gasto y el servicio que transmite la generación. Si existen varias instancias, compartir el estado de trabajos y límites. Probar con la API real creación, recuperación y fallo de red. Si se elige la versión estática, ajustar las acciones y el texto visibles a las funciones disponibles.
- **Entrega y mantenimiento.** Conservar una copia recuperable fuera de esta computadora, marcar la versión exacta y comprobar que se puede restaurar. Incluir archivos de modelos y recursos necesarios para reconstruir. Acordar un responsable y una frecuencia razonable para leer reportes y retirar un error anatómico grave.

## Qué puede esperar

Cuentas, sincronización entre equipos, expansión del catálogo, revisión integral de las traducciones y pulido de regiones que el piloto no usa. Las fichas genéricas y la anatomía adaptada de otros modelos merecen revisión cuando entren al alcance docente. La generación en vivo y las estadísticas remotas son decisiones de producto posteriores si se elige el piloto reducido. [Matriz de requisitos](../estudio/matriz-requisitos.md).

**Criterio para dar por cerrada la primera versión.** Después de la reunión, publica o entrega el alcance que hayas acordado: una versión identificada que otro docente puede abrir, con sus actividades revisadas, errores materiales corregidos o retirados, limitaciones visibles, instrucciones de arranque y un contacto de mantenimiento. Si el acuerdo incluye alumnos, cierra también el informe breve del piloto. Si ninguna facultad acepta participar, archiva la demo reproducible como prototipo pendiente de validación y fija una fecha para retomar el contacto. Así tendrás un punto de salida incluso si la respuesta institucional tarda.
