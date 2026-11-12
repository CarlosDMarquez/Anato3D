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
- **`npm run build` y `npm run preview`** hacen y sirven la versión de producción, también con esos dos servicios. Fuera de `dev` y `preview` no existen: la web publicada sería estática.

Sin clave de API todo funciona salvo la IA: Neuri responde con el buscador de la app y lo dice («Con el buscador de la app»).

## 2. Configurar la IA

1. **Crear una clave** en platform.claude.com, con una cuenta de API de Anthropic (distinta de una suscripción de Claude). Ponerle saldo y un **límite de gasto mensual**.
2. **Copiar `web/.env.example` como `web/.env.local`** y poner la clave en `ANTHROPIC_API_KEY`. Git no guarda `.env.local`; la clave nunca llega al navegador.
3. **El modelo** es Claude Haiku 5.5 (`claude-haiku-5-5`) por defecto.
   - `ANATO3D_PET_MODELO` y `ANATO3D_PET_MODELO_LECCIONES` permiten Sonnet 5.5 (unas 20 veces más caro).
   - Opus, Fable y Mythos están bloqueados en el código: si se configuran, se ignoran con un aviso. Es decisión de Carlos del 9 de noviembre de 2026.
4. **Bajar las páginas de las fuentes:** `npm run fuentes -- comprobar` las deja en `build/biblioteca/fuentes`, unos 4,6 MB fuera de git. Sin ellas, Neuri conversa y recomienda, pero no explica con citas ni crea lecciones (`crear: false`).
5. **Reiniciar `npm run dev`.**

### Estados del servicio

`GET /api/pet` los dice; la app los muestra bajo el nombre de Neuri.

| Estado | Qué significa | Qué hace la app |
| --- | --- | --- |
| `sin-clave` | No hay clave | Buscador de la app; vuelve a preguntar cada minuto |
| `configurada` | Hay clave, aún sin ninguna llamada | Usa la IA |
| `comprobada` | La última llamada fue bien | Usa la IA |
| `fallando` | La última llamada falló (red, tiempo, saldo…) | Sigue intentando la IA; si una llamada falla, responde con el buscador y vuelve a probar (a los 30 s tras una caída, a los 10 min sin saldo) |

Que la clave esté configurada no demuestra que el servicio funcione: solo una llamada real lo comprueba. Y el servidor de desarrollo no demuestra que funcione en producción.

### Prueba real (gasta dinero)

Pedir permiso a Carlos antes:

```bash
npm run pet:prueba
```

```bash
npm run pet:prueba -- --crear
```

- **La primera** prueba 17 conversaciones en cinco idiomas: explicaciones, propuestas, salud, fuera de tema y un intento de saltarse las reglas.
- **La segunda** crea además una lección de punta a punta y la guarda en `build/neuri-prueba.json` para revisarla.

La consola dice el coste de cada llamada.

## 3. Comprobar antes de entregar o publicar

| Comando | Qué comprueba | Resultado el 9 nov 2026 |
| --- | --- | --- |
| `npm test` | 148 pruebas sin red ni gasto: biblioteca, evaluación, progreso, datos, Neuri (con la IA simulada) y robustez | 148 de 148 |
| `npm run check` | Fichas, textos en cinco idiomas, biblioteca (formato, citas comprobadas, catálogo y cobertura al día) e inventario de Neuri | «todo correcto» |
| `npm run fuentes -- comprobar` | Cada cita de cada lección, palabra por palabra, en su página guardada | 3068 citas en 286 páginas, 0 sin encontrar |
| `npm run build` | Que la versión de producción se construye | Sin errores |
| `node scripts/limitaciones.mjs --citas` | Las citas del registro de limitaciones del modelo, en la revisión de Wikipedia que indican (necesita red) | 7 de 7 (rama `claude/limitaciones-modelo`) |

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
5. **Si cambiaron estructuras o modelos,** regenerar el inventario de Neuri con `node scripts/neuri-datos.mjs`.
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

**Nunca** escribe lo que escribe la persona, lo que responde Neuri, títulos ni la clave. Los errores de la API se registran por tipo: clave rechazada, sin saldo, tiempo, conexión.

| Qué guarda el servidor | Cuánto tiempo |
| --- | --- |
| Las creaciones en curso o terminadas, en memoria | Media hora |
| La cola de reportes, en archivo | Hasta que se borre a mano |
| Las conversaciones | No se guardan |
| Lo que se envía a Anthropic | Se trata según sus condiciones de la API |

Antes de publicar, comprobar qué conservación aplica a la cuenta usada.

Lo que sale del navegador está explicado a la persona en «Mis datos y privacidad». Si cambia lo que se envía, hay que cambiar ese texto en los cinco idiomas (`dat.saleNeuri` en `src/i18n/textos-biblioteca.js`).

## 7. Si algo va mal

| Situación | Qué pasa sola | Qué hacer |
| --- | --- | --- |
| La API de Anthropic cae o tarda | Neuri responde con el buscador y vuelve a probar a los 30 s | Nada; si dura, mirar el estado de Anthropic |
| Sin saldo | El buscador; vuelve a probar a los 10 min | Recargar saldo o subir el límite de gasto |
| Clave rechazada (401) | El buscador; no reintenta | Cambiar la clave en `.env.local` y reiniciar |
| Gasto inesperado | Los límites por dirección y por hora frenan; el tope real es el límite mensual de la cuenta | Quitar la clave para apagar la IA al instante (todo lo demás sigue) |
| Contenido con un error grave | — | `npm run reportes -- retirar …` y publicar |
| Una creación colgada | La app corta la conexión tras 60 s de silencio (el servidor da señal de vida cada 15 s) y ofrece reintentar con el mismo trabajo, que no se repite ni se paga dos veces | Nada |

## 8. Publicar la web (pendiente de decidir)

La web de producción es estática. Para que Neuri y los reportes funcionen publicados hace falta, en el alojamiento que se elija (Vercel, Netlify, Cloudflare u otro):

1. **Funciones de servidor** que llamen a `crearManejador` (`server/pet.mjs`) y a `crearManejadorReportes` (`server/reportes.mjs`). Son funciones estándar `Request → Response`; la redacción va en flujo (NDJSON) y puede durar unos minutos, así que el plan del alojamiento debe permitirlo.
2. **Empaquetar con la función** `build/biblioteca/fuentes` (las páginas de las citas) y `server/generado/inventario.json`.
3. **La clave** como secreto del alojamiento, nunca en el código ni en el navegador.
4. **Un almacén compartido** si hay más de una instancia:
   - para las creaciones (hoy en memoria: con varias instancias, una recarga podría ir a otra que no la tiene);
   - para los límites de uso (hoy por instancia, no globales);
   - para la cola de reportes (una base de datos con permisos, en lugar de un archivo).
5. **Comprobar el despliegue de verdad:**
   - que `GET /api/pet` responde `comprobada` después de una llamada;
   - que una creación termina;
   - que un reporte llega a la cola.
6. **Revisar los requisitos legales y de privacidad aplicables** antes de abrirlo al público. Este trabajo no los ha comprobado y no afirma cumplir ninguno.

## 9. Configuración externa pendiente

| Qué falta | Para qué | Quién decide |
| --- | --- | --- |
| Clave de API con límite de gasto en `web/.env.local` | Neuri con IA y la prueba real (`npm run pet:prueba`) | Carlos |
| Alojamiento con funciones de servidor | Publicar la web con Neuri y reportes | Carlos |
| Proveedor de cuentas (autenticación mantenida, compatible con el alojamiento) | Cuentas, sincronización y permisos por persona | Carlos |
| Base de datos con permisos | Cola de reportes, creaciones y límites globales; luego progreso sincronizado | Con el alojamiento |
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
