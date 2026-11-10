---
title: Rendimiento, presupuestos y coste de «Estudiar» y Neuri
fecha: 2026-11-09
estado: medido-en-local
---

# Rendimiento, presupuestos y coste de «Estudiar» y Neuri

Mediciones del 9 de noviembre de 2026 (especificación, sección 25). Son cifras de un equipo y unas condiciones concretas, no promesas para cualquier dispositivo. Lo que no se pudo medir se dice.

## Equipo y condiciones

| | |
| --- | --- |
| Equipo | Apple M5, 24 GB de memoria, 10 núcleos lógicos, macOS 26.5 |
| Navegador | Chrome 152 (el panel del navegador de Claude Code), ventana de unos 720 × 860 px a 2× |
| Servidor | El de desarrollo de Vite (`npm run dev`), en la misma máquina: código sin minificar y en módulos sueltos |
| Datos | 71 lecciones de la biblioteca, 11 recorridos, 71 lecciones con progreso y 3 lecciones propias en el navegador |
| Neuri | Sin clave de API: responde el buscador de la app (la IA real no se pudo medir; ver «Pendiente») |

**Método.** Cada operación se cronometra con `performance.now()` desde la acción (pulsar, enviar) hasta que el panel tiene el contenido nuevo; ese final se detecta con un `MutationObserver`. No se usan temporizadores: con el panel oculto, Chrome los frena a un segundo y las primeras mediciones (unos 1000 ms) eran ese freno, no la app. La resolución del reloj es de 0,1 ms. Las cifras de las vistas miden la interfaz del panel: el visor 3D se actualiza después, por su cuenta.

## Objetivos

Fijados al medir, para vigilar que no empeore: no hizo falta optimizar nada, porque todas las cifras quedan muy por debajo.

| Operación | Objetivo (p95) | Medido (p95) |
| --- | --- | --- |
| Buscar, solo el motor | 16 ms (un fotograma) | 1,0 ms |
| Buscar y pintar los resultados | 50 ms | 3,8 ms |
| Abrir una vista del panel | 50 ms | 1,6–3,8 ms |
| Abrir una lección ya descargada | 50 ms | 3,2 ms |
| Abrir una lección por primera vez | 500 ms | 124 ms (una medición, servidor local) |
| Respuesta de Neuri sin IA | 100 ms | 11,3 ms |

## Mediciones

### Búsqueda

| Qué | Repeticiones | Mediana | p95 | Máximo |
| --- | ---: | ---: | ---: | ---: |
| Crear el índice (71 lecciones y 11 recorridos) | 10 | 3,5 ms | 4,4 ms | 6,3 ms |
| Una búsqueda, solo el motor (20 consultas × 10) | 200 | 0,1 ms | 1,0 ms | 1,4 ms |
| Una búsqueda con los resultados pintados (20 consultas × 2) | 40 | 2,1 ms | 3,8 ms | 4,2 ms |

- **La primera búsqueda** desde la entrada tardó 5,7 ms en pintar los resultados. Esa vez la app pide también la lista de estructuras del modelo para buscarlas por nombre.
- **Al escribir**, la búsqueda espera 180 ms desde la última tecla, a propósito, para no rehacer los resultados con cada letra. Con Intro se busca enseguida.
- **Consultas usadas:** «musculos del brazo», «huesos de la mano», «nervio radial», «corazon», «manguito rotador», «arteria femoral», «pierna compartimento posterior», «craneo», «musculos de la masticacion», «vena porta», «biceps», «plexo braquial», «rodilla», «pelvis», «riñon», «pulmon», «tiroides», «ojo», «oido» y «columna vertebral».

### Vistas, lección y Neuri (hasta tener el panel listo)

| Vista | Repeticiones | Mediana | p95 | Máximo |
| --- | ---: | ---: | ---: | ---: |
| Tu mapa de aprendizaje | 10 | 2,6 ms | 3,8 ms | 6,9 ms |
| Tu plan de estudio (examen) | 10 | 2,0 ms | 2,2 ms | 2,3 ms |
| Mis lecciones (3 lecciones) | 10 | 1,6 ms | 2,5 ms | 2,7 ms |
| Mis datos y privacidad | 10 | 1,6 ms | 1,6 ms | 1,8 ms |
| Neuri (abrir la conversación) | 10 | 2,6 ms | 3,6 ms | 3,8 ms |
| Lección («Continuar donde lo dejé») | 10 | 2,4 ms | 3,2 ms | 124,3 ms |
| Respuesta de Neuri sin IA (10 preguntas distintas) | 10 | 7,0 ms | 11,3 ms | 19,2 ms |

- **La lección:** el máximo, 124,3 ms, es la primera apertura, que descarga el módulo de la lección. Las otras nueve, ya descargado, tardan entre 2,2 y 3,2 ms.
- **«Mis lecciones»** depende de cuántas haya: en una medición anterior del mismo día, con 40 lecciones (el máximo), tardaba entre 7,2 y 11,4 ms.
- **Preguntas a Neuri:** «algo sobre el corazón», «nervios del brazo», «tengo examen de la rodilla», «músculos de la pierna, 20 minutos», «repasar el antebrazo», «huesos del cráneo», «la mano», «pulmones», «columna vertebral» y «el ojo».

### Lo que se descarga (versión de producción)

`vite build` del 9 de noviembre, sin errores. Tamaños de Vite (sin comprimir y con gzip):

| Archivo | Cuándo se descarga | Tamaño | gzip |
| --- | --- | ---: | ---: |
| `index` (visor, interfaz y textos en cinco idiomas) | Al entrar | 1504,1 kB | 421,2 kB |
| Estilos | Al entrar | 80,7 kB | 15,1 kB |
| `biblioteca` (vistas de «Estudiar» y Neuri) | Al abrir «Estudiar» | 225,9 kB | 67,1 kB |
| `catalogo` (fichas de las 71 lecciones, sin los pasos) | Al abrir «Estudiar» | 296,2 kB | 53,8 kB |
| Una lección (69 archivos, uno por lección) | Al abrirla | 7,8–40,3 kB; mediana 19,3 kB | ≈ 5 kB de mediana |

- **Las lecciones de la biblioteca** suman 1308,7 kB (unos 380 kB con gzip), pero solo se descarga la que se abre.
- **Los dos módulos anteriores** (brazo y antebrazo) no tienen archivo propio: su contenido está en `index`, porque también lo usan las fichas de la app.
- **Los modelos 3D** se cargan por sistemas, como antes de este trabajo: no forman parte de estas cifras.

## Presupuestos de Neuri (en el código)

### Salida máxima de cada llamada a Claude Haiku 5.5

| Llamada | Esfuerzo | Salida máxima (tokens) | Plazo en el servidor |
| --- | --- | ---: | ---: |
| Orientar (cada mensaje) | `low` | 3000 | 30 s |
| Comprobar una explicación con citas | `low` | 2000 | 30 s |
| Planificar una lección | `medium` | 8000 | 60 s |
| Redactar o adaptar (en flujo) | `medium` | 32 000 | 240 s |
| Comprobar las citas de la lección | `low` | 12 000 | 120 s |

- **Reparaciones:** como mucho una ronda de corrección al planificar y otra al redactar. Si sigue habiendo errores, la lección no se entrega.
- **Si la respuesta llega cortada** (`max_tokens`), es un error «incompleta», nunca una lección.

### Entradas

- **Conversación:** como mucho 12 turnos por petición y 500 caracteres por mensaje.
- **Tamaño:** 64 kB por petición; 200 kB más si viaja una lección propia que se adapta.
- **Lo que se recorta** al llegar al servidor: el motivo de cada recomendación (240 caracteres), las respuestas de Neuri (1200), los campos cortos (160) y los largos (600).

### Frecuencia (por instancia del servidor)

| Qué | Por dirección | En total |
| --- | --- | --- |
| Conversación | 20 peticiones cada 10 minutos | 200 por hora |
| Crear o adaptar | 4 por hora | 20 por hora |
| Reportes de problemas | 20 por hora (8 kB cada uno) | 500 por hora |

Los límites viven en la memoria del servidor, así que con varias instancias no son globales: ver la guía operativa. Mientras tanto, el tope real del gasto es el **límite mensual de la cuenta de Anthropic**.

### Plazos y esperas de la app

**Plazos:**

| Qué | Plazo |
| --- | ---: |
| Comprobar si hay IA | 12 s |
| Una respuesta de la conversación | 75 s |
| Planificar | 150 s |
| Conectarse a una creación | 30 s |
| Silencio en una creación en curso | 60 s |

Mientras trabaja, el servidor manda una señal de vida cada 15 s.

**Esperas tras un fallo:** 30 s si se cayó, 60 s si no hay clave, 5 min si no hay servidor y 10 min si no hay saldo. Mientras tanto responde el buscador de la app.

### Concurrencia e idempotencia

- **Identificador:** cada creación tiene el suyo, un UUID que pone la app. Pedir otra vez el mismo trabajo no lo repite ni se paga dos veces.
- **Simultáneas:** como mucho 8 creaciones en curso a la vez en el servidor y 2 por dirección. Si no hay sitio, responde «ocupado» o «límite» y la app lo dice.
- **Servidor:** guarda los trabajos terminados media hora.
- **App:** recuerda hasta 20 trabajos y olvida los terminados a la semana.

### Almacenamiento local

| Qué | Límite |
| --- | --- |
| Mis lecciones | 40 lecciones y 3 MB |
| Respuestas registradas | Las 600 últimas |
| Estadísticas de uso | Los 300 últimos eventos |
| Reportes de problemas | Los 100 últimos |

## Coste estimado (no facturado)

**Precio comprobado el 9 de noviembre de 2026** en la referencia de modelos de Anthropic: Claude Haiku 5.5 cuesta **0,10 US$ por millón de tokens de entrada y 0,50 US$ por millón de salida**, con peticiones de hasta 100 000 tokens. Las de Neuri quedan por debajo: las instrucciones fijas y el catálogo pesan unos 24 000 tokens y van en caché.

### Una creación

| Supuesto | Tokens de salida | Coste de esa salida |
| --- | ---: | ---: |
| Sin corrección: planificar, redactar y comprobar | Hasta 52 000 | ≤ 0,026 US$ |
| Con las rondas de corrección | Hasta 104 000 | ≤ 0,052 US$ |

- **Techo de la salida:** sale de los presupuestos de arriba, porque el razonamiento cuenta dentro de la salida máxima.
- **La entrada:** se suma a la salida; con la caché, son céntimos de céntimo por llamada.
- **Lo habitual:** la estimación de `docs/estudio/neuri.md`, entre 0,01 y 0,02 US$, sigue siendo una estimación, no una factura.

### Un mensaje de conversación

Unos 0,002 US$ con la caché caliente, y unos 0,005 US$ si lleva más de cinco minutos sin uso (estimación).

### Cómo saber el coste real

La consola del servidor escribe en cada llamada:
- el modo y el modelo;
- los tokens de entrada, de caché y de salida;
- un coste aproximado;
- la duración;
- el identificador de la creación a la que pertenece.

Nunca escribe lo que se pregunta ni lo que responde Neuri. La cifra que vale es la **factura de la consola de Anthropic**.

## Pendiente

1. **Neuri con la IA real.** Falta medir:
   - la latencia de una respuesta;
   - la duración de una creación entera;
   - los tokens y el coste reales.

   Hace falta la clave en `web/.env.local` y el permiso de Carlos para gastar unos céntimos: `npm run pet:prueba` y `npm run pet:prueba -- --crear`.
2. **Un móvil físico.** Estas cifras son de un ordenador rápido; en un móvil de gama media serán mayores (el documento `docs/rendimiento-moviles-2026-11-07.md` mide el visor 3D en móviles).
3. **El entorno publicado:** latencia de red, caché del CDN y límites globales con varias instancias. Se mide cuando se elija el alojamiento.
