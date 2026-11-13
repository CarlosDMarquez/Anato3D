---
title: Guía operativa de «Estudiar» y Neuri
fecha: 2026-11-09
estado: vigente
---

# Guía operativa de «Estudiar» y Neuri

Cómo poner en marcha, comprobar, mantener y (cuando se decida) publicar la biblioteca de estudio y Neuri. Es para quien mantiene Anato3D, no para estudiantes: el manual del estudiante está en `docs/estudio/manual-estudiante.md`.

Todos los comandos se ejecutan desde `web/`. Probado con Node.js 26.12 en macOS.

## 1. Arrancar en local

```bash
npm install
```

```bash
npm run dev
```

- **`npm run dev`** sirve la web y, dentro del mismo proceso, el servidor de Neuri (`/api/pet`) y la cola de reportes (`/api/reportes`).
- **`npm run build` y `npm run preview`** hacen y sirven la versión de producción, también con esos dos servicios.
- **Para publicar** está el servidor de producción, fuera de Vite. `npm run paquete` crea `build/paquete`, y allí se arranca con `node servidor.mjs`. Sirve la web, Neuri y los reportes en un solo proceso. Cómo activarlo y apagarlo: `docs/estudio/activacion.md`.

Sin clave de API todo funciona salvo la IA: Neuri responde con el buscador de la app y lo dice («Con el buscador de la app»).

## 2. Configurar la IA

1. **Crear una clave** en platform.claude.com, con una cuenta de API de Anthropic (distinta de una suscripción de Claude). Ponerle saldo y un **límite de gasto mensual**.
2. **Copiar `web/.env.example` como `web/.env.local`** y poner la clave en `ANTHROPIC_API_KEY`. Git no guarda `.env.local`; la clave nunca llega al navegador.
3. **Poner el tope de gasto** en el mismo archivo: `ANATO3D_TOPE_DIARIO_USD` y `ANATO3D_TOPE_MENSUAL_USD`, en dólares. Sin los dos, Neuri no llama a la IA aunque haya clave. Para el piloto, por ejemplo, 1 al día y 20 al mes; `npm run coste` sugiere cifras según el uso esperado.
4. **El modelo** es Claude Haiku 5.5 (`claude-haiku-5-5`) por defecto.
   - Sonnet 5.5 (unas 20 veces más caro) solo con `ANATO3D_PERMITIR_SONNET=1` además de `ANATO3D_PET_MODELO` o `ANATO3D_PET_MODELO_LECCIONES`.
   - Cualquier otro nombre (Opus, Fable, Mythos o uno desconocido) se ignora con un aviso. Es decisión de Carlos del 9 de noviembre de 2026.
5. **Bajar las páginas de las fuentes:** `npm run fuentes -- comprobar` las deja en `build/biblioteca/fuentes`, unos 4,6 MB fuera de git. Sin ellas, Neuri conversa y recomienda, pero no explica con citas ni crea lecciones (`crear: false`).
6. **El cupo diario por dispositivo** (desde el 12 nov) funciona solo: 30 preguntas con IA y 3 creaciones por dispositivo y día, renovadas a medianoche de America/Tijuana. Se cambia con `ANATO3D_CUPO_PREGUNTAS`, `ANATO3D_CUPO_CREACIONES` y `ANATO3D_CUPO_IP`, y se apaga con `ANATO3D_CUPO=0` (para probar sin contar). En desarrollo, sus contadores van en `build/servidor/cupo.json`. Sin `ANATO3D_CUPO_SAL`, vuelven a cero en cada reinicio y la consola lo avisa. En producción conviene ponerlo siempre, como secreto (`activacion.md`, sección 2).
7. **Reiniciar `npm run dev`.** La consola dice el modelo y los topes, o por qué no llama a la IA.

### Estados del servicio

`GET /api/pet` los dice; la app los muestra bajo el nombre de Neuri.

| Estado | Qué significa | Qué hace la app |
| --- | --- | --- |
| `sin-clave` | No hay clave | Buscador de la app; vuelve a preguntar cada minuto |
| `configurada` | Hay clave, aún sin ninguna llamada | Usa la IA |
| `comprobada` | La última llamada fue bien | Usa la IA |
| `fallando` | La última llamada falló (red, tiempo, saldo…) | Sigue intentando la IA; si una llamada falla, responde con el buscador y vuelve a probar (a los 30 s tras una caída, a los 10 min sin saldo) |
| `sin-presupuesto` | Tope a cero o sin poner, agotado hoy o este mes, interruptor `IA-APAGADA`, o el archivo del tope dañado o abierto por otro proceso | Buscador de la app con el aviso «límite de gasto»; vuelve a preguntar a los 10 min |
| `sin-cupo` (en la app, desde el 12 nov) | Este dispositivo agotó hoy su cupo diario (el servidor responde `429 cupo`) | Buscador y todo lo local, con el aviso «Hoy ya no quedan preguntas con IA»; las creaciones quedan en pausa hasta la renovación |
| `simulado` | El servidor habla con el proveedor simulado de este equipo (`ANTHROPIC_BASE_URL` en `localhost`; solo para ensayar) | Respuestas fijas, sin gasto. La cabecera dice «IA simulada (ensayo local)», nunca «comprobada» |

### Tope de gasto: apagar, revisar y ajustar

Todo desde `web/`, sin gastar nada:

```bash
npm run presupuesto
```

Dice los topes, lo gastado y lo reservado hoy y este mes, si la IA está apagada, qué proceso tiene el tope abierto, las reservas abiertas y las últimas llamadas.

- **Apagar la IA al momento** (sin reiniciar; los estudiantes siguen con el buscador):

  ```bash
  npm run presupuesto -- apagar
  ```

  Para volver a encenderla: `npm run presupuesto -- encender`.
- **Ajustar los topes:** cambiar `ANATO3D_TOPE_DIARIO_USD` y `ANATO3D_TOPE_MENSUAL_USD` en `web/.env.local` (en el servidor, sus variables). El servidor de desarrollo los vuelve a leer en la siguiente petición. Bajar un tope por debajo de lo ya gastado para la IA hasta el día o el mes siguiente.
- **Revisar una reserva «incierta».** Es una llamada que se cortó después de enviarse (red, plazo, un 5xx, un reinicio a mitad, una redacción cancelada): no se sabe lo que costó, así que cuenta entera, sin liberarse a ciegas. Se resuelve así:
  1. Cerrar el servidor (resolver necesita el tope para sí).
  2. Buscar el coste en la consola de Anthropic: Usage, a la hora de la reserva.
  3. Resolverla con esa cifra:

     ```bash
     npm run presupuesto -- resolver 3f2a9c1b 0.0042
     ```

     Si no se encuentra la cifra, `npm run presupuesto -- confirmar 3f2a9c1b` (o `todas`) la deja como gastada entera.
- **Estimar el gasto:** `npm run coste` (con `--observado`, a partir de lo que costó de verdad).

El archivo del tope y el interruptor están en `build/servidor/` (o en `ANATO3D_DATOS`). Si el archivo se daña, la IA no gasta hasta restaurarlo: no se pisa, porque se perdería lo gastado.

Que la clave esté configurada no demuestra que el servicio funcione: solo una llamada real lo comprueba. Y el servidor de desarrollo no demuestra que funcione en producción.

### Prueba real (gasta dinero)

Pedir permiso a Carlos antes. Lo primero es la **prueba mínima**, que gasta unos 0,01 US$ y como máximo 0,0123 US$ desde el texto fijo por modo *[Histórico: 0,1705 US$]*. Hace tres llamadas: una explicación con fuentes, su comprobación y una llamada en flujo. Sin `--si-gastar`, solo dice lo que haría:

```bash
node scripts/prueba-minima.mjs --si-gastar
```

Pasos, criterio de parada y conciliación: `docs/estudio/activacion.md`, sección 8.

Las pruebas largas, con muchas más llamadas:

```bash
npm run pet:prueba
```

```bash
npm run pet:prueba -- --crear
```

- **La primera** prueba 17 conversaciones con frases en cinco idiomas (la interfaz, en español): explicaciones, propuestas, salud, fuera de tema y un intento de saltarse las reglas.
- **La segunda** crea además una lección de punta a punta y la guarda en `build/neuri-prueba.json` para revisarla.

La consola dice el coste de cada llamada y, al final, cómo queda el tope. La prueba pasa por el mismo tope que el servidor: sin topes no envía nada, y con el servidor de desarrollo abierto tampoco, porque comparten el saldo. Hay que cerrarlo antes.

## 3. Comprobar antes de entregar o publicar

| Comando | Qué comprueba | Resultado el 12 nov 2026 |
| --- | --- | --- |
| `npm test` | 314 pruebas sin red ni gasto: biblioteca, evaluación, progreso, datos, Neuri (con la IA simulada: recorridos por unidades, rutas locales, tope de gasto, sesiones de estudio, cupo diario, texto fijo por modo), limitaciones del modelo, sistema linfático, el paquete de producción y robustez | 314 de 314 *[Histórico: 239 de 239 con los cinco prompts de ChatGPT del 11 nov; 181 de 181 con las tres ramas fusionadas en `main`; 165 de 165 con los recorridos por unidades; 148 de 148 antes de ellos]* |
| `npm run paquete` | Que el paquete de producción se arma: web, `servidor.mjs`, recursos con manifiesto y plantillas de despliegue | 88 MB en `build/paquete` (medido el 11 nov) |
| `npm run check` | Fichas (también las linfáticas), textos (en el contenido solo exige el inglés desde el 12 nov; antes, los cinco idiomas), biblioteca (formato, citas comprobadas, catálogo y cobertura al día) e inventario de Neuri | «todo correcto»: 87 lecciones, 0 errores y 3 avisos previstos; 66 avisos de campos «pendiente» en fichas linfáticas sin fuente libre |
| `npm run fuentes -- comprobar` | Cada cita de cada lección, palabra por palabra, en su página guardada | 4130 citas en 511 páginas *[Histórico: 3969 en 478 el 11 nov; 3068 en 286 antes de las 13 lecciones nuevas]* |
| `npm run build` | Que la versión de producción se construye | Sin errores |
| `node scripts/limitaciones.mjs --citas` | Las citas del registro de limitaciones del modelo, en la revisión de Wikipedia que indican (necesita red) | 7 de 7 (comprobado en la rama `claude/limitaciones-modelo`, ya fusionada en `main`) |

Las pruebas manuales de los recorridos y su evidencia están en `docs/estudio/aceptacion.md`.

## 4. Mantener el contenido

### Añadir o cambiar una lección

1. **Editar o crear** el archivo en `src/biblioteca/lecciones/` (formato en `src/biblioteca/formato.js`). Cada frase lleva su cita literal; si cambia el contenido, sube `version`.
2. **Si es nueva,** añadirla al plan (`scripts/biblioteca/plan.mjs`) y a su recorrido (`src/biblioteca/recorridos.js`).
3. **Las citas:**
   - `npm run fuentes -- bajar wp:Página` registra la página nueva;
   - `npm run fuentes -- frases wp:Página 'palabras'` busca frases para citar;
   - `npm run fuentes -- comprobar` comprueba todas.
4. **Regenerar** el catálogo y la cobertura con `node scripts/biblioteca.mjs`.
5. **Si cambiaron estructuras o modelos,** regenerar el inventario de Neuri con `node scripts/neuri-datos.mjs` (1734 estructuras desde el linfático nuevo del 12 nov; ver `docs/hitos/09-sistema-linfatico.md`).
6. **Comprobar** con `npm run check` y `npm test`.

Lo que depende de la versión:
- **El progreso** guarda con qué versión se estudió cada lección.
- **Si cambia el texto o las opciones de una pregunta,** cambia su huella y sus fallos anteriores dejan de contar contra el estudiante.

### Estados editoriales

**Todas las lecciones son hoy «borrador».** Una lección solo pasa a «revisado» cuando una persona con la formación adecuada la revisa, y entonces:
- se ponen `revisor` y `fecha` en `revision` (el revisor de formato lo exige);
- revisar una parte no valida el resto ni las traducciones.

**Las lecciones de Neuri no pueden marcarse como revisadas:** la app lo impide, también al importarlas.

El paquete para la revisión docente está en `docs/estudio/revision-docente.md`.

### Limitaciones conocidas del modelo 3D

El registro está en `src/data/limitaciones.js`. Qué es, dónde actúa y por qué se explica en
`docs/estudio/limitaciones-modelo.md`.

**Añadir una:**
1. **Reproducirla** en los dos modelos y los dos lados con `docs/revision/limitaciones-modelo/medir-limitaciones.js`, que
   se pega en la consola del navegador con la app abierta. Anotarla en `hallazgos.md` con capturas y el blob de git de
   los archivos.
2. **Añadir la entrada**, con:
   - tipo, estado, fecha, recurso y evidencia;
   - lo que restringe;
   - el aviso y el detalle en cinco idiomas;
   - fuentes reales: Wikipedia en una revisión fija, con citas literales.
3. **Comprobar** con `npm run check` (que las piezas existan en los modelos y que los textos estén completos),
   `node scripts/limitaciones.mjs --citas` y `npm test`.
4. **Publicar.** Es código, como `retiradas.js`.

**Retirarla** cuando se corrija la geometría:
- volver a medir y anotar «no reproducido en la versión…»;
- quitar la entrada, o reducir lo que restringe.

El progreso no se toca: lo que se había apartado se recupera solo.

**Si se reconstruye un modelo,** hay que volver a medir las piezas registradas y actualizar `recurso`. `npm run check`
solo detecta que una pieza haya cambiado de nombre o desaparecido.

## 5. Reportes de problemas y retirada de contenido

**Dónde llegan:** a `web/server/datos/reportes.jsonl`, sin IP. Git no guarda esa carpeta, y desde la web no se pueden leer: solo con la herramienta local.

```bash
npm run reportes
```

```bash
npm run reportes -- ver <id>
```

```bash
npm run reportes -- decidir <id> --resultado corregido --revisor "Nombre" --nota "…" --version "…"
```

```bash
npm run reportes -- retirar ms-codo/q3 --reporte <id> --revisor "Nombre" --nota "…"
```

```bash
npm run reportes -- reponer ms-codo/q3 --revisor "Nombre"
```

- **Registro de decisiones:** cada una queda en `web/server/datos/decisiones.jsonl` con quién, qué, cuándo y el resultado: `aceptado`, `rechazado`, `corregido` o `duplicado`.
- **Retirar:**
  - quita una lección o una pregunta mientras se corrige: no se ofrece ni se pregunta, y sus fallos dejan de contar;
  - Neuri tampoco la ve, porque el servidor usa la misma lista;
  - cambia `src/biblioteca/retiradas.js`, **que hay que publicar**.
- **Reponer** la devuelve.

## 6. Registros y privacidad del servidor

En cada llamada a Claude, la consola escribe:
- el modo y el modelo;
- los tokens (entrada, caché y salida);
- el coste aproximado;
- la duración;
- el identificador de la creación.

**Nunca** escribe lo que escribe la persona, lo que responde Neuri, títulos ni la clave. Los errores de la API se registran por tipo y estado (clave rechazada, sin saldo, tiempo, conexión, 400), sin el mensaje de la API, que podría repetir lo enviado. Lo mismo en los errores de los trabajos de creación. Una prueba lo comprueba con un texto centinela.

El archivo del tope de gasto (`build/servidor/presupuesto.json`; en producción, `/datos/presupuesto.json`) guarda solo cifras, días y meses, modelo, etiqueta del modo, identificador del trabajo, estado y una huella de las instrucciones fijas; nunca texto de nadie.

El archivo del cupo diario (`build/servidor/cupo.json`; en producción, `/datos/cupo.json`, desde el 12 nov) guarda solo números y claves HMAC del identificador del dispositivo o de la IP, una por día. La clave del HMAC sale de `ANATO3D_CUPO_SAL`, que no está en el archivo: con el archivo solo no se puede recuperar ninguna IP ni ningún identificador. Con el archivo y el secreto sí se podrían probar las IPv4, por eso el secreto va como secreto. El identificador del dispositivo no llega al modelo ni al registro.

| Qué guarda el servidor | Cuánto tiempo |
| --- | --- |
| Las creaciones en curso o terminadas, en memoria | Media hora |
| Los contadores del cupo diario (claves HMAC y números), en archivo | El día en curso; los días viejos se podan |
| La cola de reportes, en archivo | Hasta que se borre a mano |
| Las conversaciones | No se guardan |
| Lo que se envía a Anthropic | Se trata según sus condiciones de la API |

Antes de publicar, comprobar qué conservación aplica a la cuenta usada.

Lo que sale del navegador está explicado a la persona en «Mis datos y privacidad». Si cambia lo que se envía, hay que cambiar esos textos (`dat.saleNeuri` y, desde el 12 nov, `dat.salePerfil` y `dat.saleDispositivo` en `src/i18n/textos-biblioteca.js`). Desde el 12 nov se exigen en español e inglés; los textos antiguos en alemán, francés e italiano se conservan, pero esos idiomas no se pueden elegir *[Histórico: en los cinco idiomas]*.

## 7. Si algo va mal

| Situación | Qué pasa sola | Qué hacer |
| --- | --- | --- |
| La API de Anthropic cae o tarda | Neuri responde con el buscador y vuelve a probar a los 30 s | Nada; si dura, mirar el estado de Anthropic |
| Sin saldo | El buscador; vuelve a probar a los 10 min | Recargar saldo o subir el límite de gasto |
| Clave rechazada (401) | El buscador; no reintenta | Cambiar la clave en `.env.local` y reiniciar |
| Gasto inesperado | El tope diario y el mensual cortan antes de llamar; los límites por dirección y por hora frenan; por encima, el límite de la cuenta | `npm run presupuesto -- apagar` apaga la IA al instante (todo lo demás sigue) |
| Tope agotado | El buscador con el aviso «límite de gasto»; vuelve al día siguiente (o al mes siguiente) | Nada, o subir el tope si hace falta |
| Reservas «inciertas» acumuladas | Cuentan enteras (nunca se liberan solas) | Resolverlas con la cifra de la consola (sección 2) |
| `otro-proceso` en la consola | Este servidor no gasta: otro proceso tiene el tope | Cerrar el otro servidor (o `npm run presupuesto` para ver cuál es) |
| Un estudiante agotó su cupo diario | El buscador y todo lo local; las creaciones, en pausa hasta la medianoche de America/Tijuana | Nada. Si el cupo se queda corto para todos, subir `ANATO3D_CUPO_PREGUNTAS` o `ANATO3D_CUPO_CREACIONES` y reiniciar |
| Un aula entera se queda sin cupo a la vez | Comparten IP: el tope por IP (300 preguntas y 30 creaciones al día) se agotó | Subir `ANATO3D_CUPO_IP` («preguntas/creaciones») y reiniciar |
| La consola dice «Sin ANATO3D_CUPO_SAL» | Los contadores del día viven en memoria y vuelven a cero en cada reinicio | Poner el secreto (`activacion.md`, sección 4) |
| La consola dice que el archivo del cupo estaba dañado | Se apartó (`cupo.json.danado-…`) y se empezó de cero | Nada: son contadores del día, no datos de nadie |
| Contenido con un error grave | — | `npm run reportes -- retirar …` y publicar |
| Una creación colgada | La app corta la conexión tras 60 s de silencio (el servidor da señal de vida cada 15 s) y ofrece reintentar con el mismo trabajo, que no se repite ni se paga dos veces | Nada |

## 8. Publicar la web (preparado; falta que Carlos lo decida)

**Lo que está listo:**
- **El servidor de producción:** `server/produccion.mjs`.
  - En un solo proceso de Node sirve la web, Neuri (`/api/pet`) y los reportes (`/api/reportes`).
  - Usa los mismos manejadores `Request → Response` que en desarrollo.
- **El paquete reproducible:** `npm run paquete` → `build/paquete`, unos 88 MB. Lleva:
  - la web;
  - `servidor.mjs`, con el SDK dentro;
  - los recursos de Neuri, con su manifiesto SHA-256;
  - las plantillas de Fly.io y de Cloudflare.

**El servidor conserva todo lo de desarrollo:**
- los límites de cuerpo, de métodos y de frecuencia;
- solo acepta peticiones del origen configurado;
- solo cree la dirección del cliente si viene del proxy de confianza;
- la clave va solo como secreto;
- el registro no guarda textos ni direcciones.

**Dónde publicarlo** (`docs/estudio/despliegue.md`):
- **piloto:** todo en Fly.io, con una Machine de 512 MB y un volumen de 1 GB, por unos 3,9 US$ al mes;
- **con cientos de estudiantes:** la web en Cloudflare y la API en Fly.

**Una sola instancia:**
- el tope de gasto, el interruptor, el cupo diario (`cupo.json`, desde el 12 nov) y la cola de reportes van en el volumen;
- las creaciones, en memoria, durante media hora;
- con varias instancias haría falta un almacén compartido para todo eso.

**Cómo activarlo, comprobarlo, apagar la IA y volver atrás:** `docs/estudio/activacion.md`.

**Antes de abrirlo al público, revisar los requisitos legales y de privacidad aplicables.** Este trabajo no los ha comprobado y no afirma cumplir ninguno.

## 9. Configuración externa pendiente

| Qué falta | Para qué | Quién decide |
| --- | --- | --- |
| Clave de API con límite de gasto en `web/.env.local` | Neuri con IA y la prueba real (`npm run pet:prueba`) | Carlos |
| Secreto `ANATO3D_CUPO_SAL` en el alojamiento | Que el cupo diario sobreviva a los reinicios sin guardar ninguna IP recuperable | Carlos, al desplegar (`activacion.md`) |
| Traducir y reactivar alemán, francés e italiano | Hoy salen como «próximamente»; lo nuevo solo está en español e inglés | Carlos (decisión del 12 nov 2026) |
| Cuenta de Fly.io (y de Cloudflare, si se separa la web) | Publicar la web con Neuri y reportes (`despliegue.md`, `activacion.md`) | Carlos |
| Proveedor de cuentas (autenticación mantenida, compatible con el alojamiento) | Cuentas, sincronización y permisos por persona | Carlos |
| Base de datos con permisos | Solo si se pasa a varias instancias o a cuentas: cola de reportes, creaciones, límites globales y progreso sincronizado (con una sola instancia, el volumen basta) | Con el alojamiento |
| Servidor de estadísticas (opcional) | Enviar los eventos que hoy solo se guardan en el navegador, con consentimiento | Carlos |
| Revisión legal y de privacidad | Antes de publicar | Carlos, con asesoría |
| Revisión profesional del contenido | Pasar lecciones de «borrador» a «revisado» | Docentes de anatomía (`revision-docente.md`) |
| Personas para el piloto | Probar con estudiantes y un docente | Carlos (`piloto.md`) |

## 10. Mantenimiento periódico

- **Cada vez que se cambie de modelo o pasen unos meses:**
  - comprobar en la documentación oficial de Anthropic que `claude-haiku-5-5` sigue disponible, con qué parámetros y a qué precio;
  - actualizar `PRECIOS` en `server/neuri/modelo.mjs` si cambian.
- **Revisar el gasto** en la consola de Anthropic: la cifra que vale es la factura.
- **Leer la cola de reportes** con regularidad (`npm run reportes`).
- **Volver a pasar** `npm run fuentes -- comprobar` si se tocan lecciones. Las páginas se guardan en una versión fija: una Wikipedia cambiada no rompe las citas, pero las páginas nuevas se citan en su versión del día.
