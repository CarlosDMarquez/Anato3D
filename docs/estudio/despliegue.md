---
title: Despliegue de Anato3D con Neuri (alojamiento y paquete)
fecha: 2026-11-11
estado: propuesta, pendiente de decisión de Carlos (sin cuentas, sin contratar y sin desplegar)
---

# Despliegue de Anato3D con Neuri

Este documento explica qué hay que alojar y cuánto pesa, qué alojamientos cumplen lo que necesita Neuri y cuánto costaría cada uno, en un piloto y con 1000 estudiantes. Termina con una recomendación.

**No se ha abierto ninguna cuenta, no se ha contratado nada y no se ha desplegado nada.**
- Los pasos para activarlo, comprobarlo, apagar la IA y volver atrás están en `docs/estudio/activacion.md`.
- Los resultados del ensayo están en `docs/estudio/aceptacion.md`, en la sección «Lanzamiento ensayado con el paquete».

## Resumen

- **Listo y probado en este Mac:**
  - **Paquete reproducible:** `npm run paquete` deja en `build/paquete` 88 MB con la web, el servidor en un solo archivo y los recursos de Neuri.
    - El servidor es `servidor.mjs`: necesita Node 22 o más y no hace falta `npm install`.
    - Los recursos llevan su manifiesto SHA-256.
  - **Probado:** en una carpeta limpia y con un proveedor de IA simulado (9 pruebas automáticas y un ensayo en el navegador, en escritorio y móvil, en 5 idiomas, el 11 nov). Desde el 12 nov la interfaz solo se elige en español e inglés, y `tests/produccion.test.mjs` tiene 10 pruebas.
- **Recomendación para el piloto: todo en Fly.io.**
  - Una Machine `shared-cpu-1x` de 512 MB con un volumen de 1 GB, en la región `iad`.
  - **Unos 3,9 US$ al mes** de alojamiento.
  - El paquete ya trae `fly.toml` y `Dockerfile`, pero son plantillas sin probar en Fly.
- **Con 1000 estudiantes: la web estática en Cloudflare (gratis) y solo la API en Fly.**
  - **Unos 3,9 US$ al mes**, frente a 4,2–6,3 US$ con todo en Fly.
  - El paquete trae el Worker de Cloudflare: su lógica tiene una prueba, pero no está probado en Cloudflare.
- **IA, aparte del alojamiento** (Haiku 5.5; estimación de `npm run coste` del 12 nov, con el texto fijo por modo; los topes y el cupo diario cortan antes):
  - **piloto:** unos 1,0 US$ en el mes *[Histórico: 1,4]*;
  - **1000 estudiantes:** unos 51 US$ al mes *[Histórico: 71]*.
- **Lo que decide Carlos:**
  - cuentas, medio de pago, clave y topes;
  - dominio (opcional);
  - revisión legal y de privacidad;
  - si se incluyen las páginas de TeachMeAnatomy (sección 6).

## 1. Qué se aloja (medido el 11-11-2026)

Medidas sobre `build/paquete`, con el servidor en la versión 2026-11-11.1 (MB decimales, 1 MB = 10⁶ bytes):

| Parte | Tamaño | Detalle |
| --- | --- | --- |
| Web estática (`publico/`) | 79,0 MB en 208 archivos | Modelos 3D: 70,2 MB, de ellos 69,1 MB en 26 `.glb`. JS y CSS: 6,2 MB (1,2 MB con gzip). Traducciones: 1,5 MB. Decodificador Draco: 0,8 MB |
| Servidor (`servidor.mjs`) | 1,5 MB | Un solo archivo con el SDK de Anthropic dentro |
| Recursos de Neuri (`recursos/`) | 7,3 MB | Catálogo, inventario, 82 lecciones y 500 páginas citables: 493 de Wikipedia en inglés y 7 en español (4,2 MB) |
| Manifiesto, LEEME y plantillas | 0,1 MB | `MANIFIESTO.json` (SHA-256 de cada archivo), `LEEME.md`, `package.json`, `fly.toml`, `Dockerfile`, `.dockerignore` y `worker/` |
| **Total** | **88,0 MB** | |

- **El archivo más grande** es `models/female.glb`, de 11,6 MB (11,1 MiB). Cabe en el límite de Cloudflare de 25 MiB por archivo [20][25].
- **Memoria del servidor:** 175 MB (RSS) al terminar todo el ensayo del navegador, con una sola persona y varias creaciones simuladas.
  - Con 512 MB hay margen.
  - Bajar a la Machine de 256 MB (2,19 US$ [8]) solo si en producción se queda por debajo de unos 200 MB con varias personas a la vez.

### Lo que descarga cada persona

Los modelos ya van comprimidos con Draco y el resto con gzip.

| Visita | Descarga |
| --- | --- |
| Primera, en escritorio | ≈ 12,2 MB: `male.glb` (11,6 MB) más ≈ 0,6 MB de JS, CSS, índice y decodificador |
| Primera, en móvil o tableta | ≈ 8,2 MB: `male.ligero.glb` (7,5 MB) más lo mismo |
| Cada sistema que se abre | 0,05–3,4 MB. Los 11 sistemas: 15,3 MB en el modelo masculino y 15,5 MB en el femenino |
| «Estudiar» (biblioteca, catálogo y fuentes) | ≈ 0,2 MB |
| Peor caso: los dos cuerpos con todos sus sistemas | ≈ 55 MB |
| Visitas siguientes | Casi nada |

En las visitas siguientes:
- el JS y el CSS llevan huella en el nombre y caché de un año;
- los modelos se revalidan con su etiqueta: si no cambiaron, el servidor responde `304` y no se vuelven a bajar.

## 2. Lo que Neuri necesita del alojamiento

1. **Un proceso de larga duración.**
   - Una creación de lección llega en flujo (NDJSON) durante 5–7 minutos, con una señal de vida cada 15 s.
   - No sirven funciones que corten a los 60 o a los 300 s.
2. **Que el flujo no se acumule.** Cada línea tiene que llegar en cuanto sale.
   - El servidor envía `X-Accel-Buffering: no`.
   - No comprime el NDJSON.
3. **Que el trabajo siga si el navegador se va.**
   - Las creaciones se guardan en memoria media hora.
   - Al volver, la app se reconecta al mismo trabajo sin pagarlo otra vez.
4. **Almacenamiento durable.** En un volumen van:
   - el tope de gasto: `presupuesto.json` y su cerrojo;
   - el interruptor `IA-APAGADA`;
   - desde el 12 nov, el cupo diario por dispositivo: `cupo.json` (números y claves HMAC, sin IP ni identificador), con el mismo cerrojo. Para que sobreviva a los reinicios hace falta el secreto `ANATO3D_CUPO_SAL` (`activacion.md`);
   - la cola de reportes.
5. **Una sola instancia.**
   - Con el mismo volumen, el cerrojo no deja gastar a un segundo proceso: este avisa con `otro-proceso` y no llama a la IA.
   - Con dos volúmenes, cada instancia tendría su propio tope, y el gasto total podría ser el doble.
   - No hay que escalar a dos.
6. **Salidas a internet:** `api.anthropic.com` y `*.wikipedia.org` (las páginas que Neuri descarga para citar).
7. **Transferencia de los modelos 3D:** es lo que más pesa (sección 1).

## 3. Comparación (precios oficiales consultados el 11-11-2026)

**Notas:**
- Los precios no incluyen impuestos.
- «Pendiente» significa que no se pudo verificar en una fuente oficial y que no se usó para decidir.
- Los números entre corchetes remiten a las fuentes del final.

### Coste y almacenamiento

| Opción | Lo mínimo que cumple, al mes | Transferencia | Almacenamiento durable |
| --- | --- | --- | --- |
| **Fly.io** | 3,69 US$ (`shared-cpu-1x`, 512 MB, iad) + volumen a 0,15 US$/GB [8] | No incluye; 0,02 US$/GB en Norteamérica y Europa [8] | Volumen de una sola Machine; copia diaria que dura 5 días [9] |
| **Cloudflare Workers** | Free: 0 US$, con 10 ms de CPU por petición. Paid: 5 US$ [19][20] | Archivos estáticos gratis y sin límite [19][24] | Durable Objects o D1 (5 GB incluidos) [19]; habría que reescribir el servidor |
| Railway | 5 US$ en Hobby, con 5 US$ de uso incluidos [14] | 0,05 US$/GB [14] | Volumen a 0,15 US$/GB al mes; sin réplicas [14][17] |
| DigitalOcean (VPS) | 4 US$ (512 MiB) o 6 US$ (1 GiB) [42] | 500 o 1000 GiB incluidos; después, 0,01 US$/GiB [42][43] | Disco local; las copias cuestan un 20 % más [42] |
| Render | 7 US$ (0,5 CPU, 512 MB) + disco a 0,25 US$/GB [1] | 5 GB incluidos en Hobby; después, 0,15 US$/GB [1][2] | Disco con una sola instancia; cada despliegue corta el servicio [4] |
| Vercel | Hobby: 0 US$. Pro: 20 US$ [27] | Hobby: 100 GB [27] | Almacenes de terceros, con precio pendiente [31] |
| Netlify | 0, 9 o 20 US$ [33] | Por créditos; en Free, el sitio se pausa al agotarlos [34] | Pendiente |
| Google Cloud Run | 0 US$ dentro de la cuota gratuita [48]; una instancia siempre encendida, pendiente | 1 GB al mes desde Norteamérica [48] | Sin disco [48] |
| GitHub Pages (solo la web) | 0 US$ | Límite blando de 100 GB al mes; sitio de 1 GB como máximo [50] | No aplica |

### Si encaja con Neuri

| Opción | Duración y flujo | Reposo | Si el navegador se va | ¿Cumple? |
| --- | --- | --- | --- | --- |
| **Fly.io** | Sin tope por petición [11] | El autostop se puede quitar (`auto_stop_machines = "off"`) [10] | Sigue (proceso persistente) | **Sí** |
| **Cloudflare (solo la web y el reenvío)** | Sin límite de tiempo mientras el cliente siga conectado; pasa cada trozo según llega [20][23] | No aplica | El Worker se cancela, pero el trabajo sigue en Fly | **Sí**, como parte delantera de Fly |
| Cloudflare (todo allí) | Igual que arriba | Un Durable Object sale de memoria tras 70–140 s inactivo [21] | Un Durable Object sigue hasta 15 min con un fetch pendiente [21] | Solo reescribiendo el servidor: `fs` solo lee [22] |
| Railway | 15 min si siguen llegando datos; corta tras 5 min sin datos [16] | El modo serverless es opcional [18] | Sigue | Sí |
| DigitalOcean (VPS) | Sin límite; nginx respeta `X-Accel-Buffering: no` [45] | Siempre encendido | Sigue | Sí, pero el mantenimiento del sistema es tuyo |
| Render | 100 min [5]; el balanceador comprime, lo que puede agrupar líneas [6] | Free: se duerme a los 15 min y no admite disco [3] | Sigue | Solo en un plan de pago |
| Vercel | Hobby: 300 s. Pro: 800 s [28] | Serverless [29] | Sigue hasta el máximo de duración [29] | Hobby, no; Pro, sí |
| Netlify | Funciones de 60 s; las de segundo plano, sin flujo [35][36] | — | — | No |
| Cloud Run | 60 min [46] | Se apaga en ≤ 15 min sin una instancia mínima [47] | Sin CPU fuera de las peticiones [47] | No sin una instancia mínima (precio pendiente) |
| Hetzner (VPS) | Sin límite | Siempre encendido | Sigue | Altas limitadas desde el 26-06-2026 [40] |

### Planes gratuitos frente a planes de pago

- **Cloudflare Free.**
  - La web estática es gratis y sin límite de transferencia [19][24].
  - Admite hasta 20 000 archivos (Anato3D tiene 208) [20][25].
  - El Worker tiene 10 ms de CPU por petición; si no bastaran, Workers Paid cuesta 5 US$ [20].
- **Fly.io no tiene plan gratuito.**
  - Da una prueba de 1 US$ durante 7 días; después pide tarjeta [8][12].
  - Hoy perdona las facturas de menos de 5 US$ de las organizaciones personales [8], pero no se cuenta con ello.
- **No sirven en su versión gratuita:**
  - Render Free: se duerme y no tiene disco [3];
  - Vercel Hobby: corta a los 300 s [28];
  - Netlify Free: funciones de 60 s [35];
  - Cloud Run sin una instancia mínima [47].

## 4. Coste por escenario

### Supuestos

Cámbialos con lo que se observe después del lanzamiento.

- **Piloto:**
  - unas 10 personas: 5–8 estudiantes, un docente (`piloto.md`) y Carlos;
  - 2–3 visitas con la caché vacía por persona;
  - unos 400 mensajes a Neuri y 40 lecciones creadas o adaptadas en el mes.
- **1000 estudiantes:**
  - 20 000 mensajes y 2000 lecciones al mes, las cifras orientativas de Carlos;
  - 1–4 visitas al mes con la caché vacía por persona.

### Transferencia (con los tamaños de la sección 1)

| | Piloto | 1000 estudiantes |
| --- | --- | --- |
| Web | 0,3–1,7 GB | 15–120 GB (peor caso, unos 250 GB) |
| API | < 0,1 GB | 1–2 GB |

### Coste al mes, en US$ y sin impuestos

| | Piloto | 1000 estudiantes |
| --- | --- | --- |
| **Todo en Fly** | 3,84 + ≤ 0,04 = **≈ 3,9** | 3,84 + 0,32–2,44 = **≈ 4,2–6,3** (peor caso, ≈ 8,9) |
| **Web en Cloudflare + API en Fly** | 3,84 + ≈ 0 = **≈ 3,85** | 3,84 + 0,02–0,04 = **≈ 3,9** (+5 si la CPU del Worker gratuito no bastara) |
| **IA (Haiku 5.5, `npm run coste`, 12 nov)** | ≈ 1,0 *[Histórico: 1,4]* | ≈ 51 *[Histórico: 71]* |

- **Fly:** 3,84 US$ = 3,69 de la Machine + 0,15 del volumen de 1 GB [8]. Las copias del volumen son gratis hasta 10 GB [8][9].
- **IA en el piloto:** `npm run coste -- --mensajes 400 --lecciones 40`.
- **IA con 1000 estudiantes:**
  - es lo que da `npm run coste` con sus valores por defecto;
  - el propio script sugiere un tope de 61 US$ al mes y 2,54 US$ al día *[Histórico: 86 y 3,55, con el texto fijo de ≈ 31 800 tokens en todas las llamadas]*;
  - para el piloto, mejor empezar con 1 US$ al día y 20 US$ al mes.

## 5. Recomendación

### Piloto: todo en Fly.io

- **Cumple todos los requisitos** de la sección 2 sin reescribir nada.
- **Es lo más sencillo:**
  - una sola cuenta;
  - un solo comando: `fly deploy` en la carpeta del paquete;
  - la dirección del cliente la pone el proxy de Fly (`fly-client-ip`), así que el navegador no puede inventarla.
- **Por qué no separar la web todavía:** con Cloudflare, en el piloto, se ahorrarían unos 0,04 US$ al mes. A cambio habría otra cuenta, un Worker y un secreto compartido que mantener. Es la opción más barata sobre el papel, pero hoy no compensa.

### Con cientos de estudiantes: web en Cloudflare y API en Fly

- **Cuándo:** cuando la web pase de unos 50 GB al mes (≈ 1 US$ en Fly).
- **Ahorro:** toda la transferencia de los modelos.
- **Ya preparado:**
  - el servidor admite `ANATO3D_ORIGEN`, `ANATO3D_IP_DE=x-anato3d-ip` y `ANATO3D_PROXY_SECRETO`;
  - el paquete trae el Worker en `worker/`.
- **Antes de pasar:** medir la CPU del Worker.

### Supuestos y riesgos

- **Una sola Machine.**
  - `fly.toml` deja `auto_stop_machines = "off"` y `min_machines_running = 1`.
  - El primer despliegue va con `--ha=false` para que Fly no cree una segunda (`activacion.md`).
- **Despliegues y reinicios: lo que se pierde.**
  - Se pierden las creaciones en curso (están en memoria); la app ofrece reintentar.
  - Los límites por dirección y por hora vuelven a cero; los topes de gasto siguen. El cupo diario sigue si está `ANATO3D_CUPO_SAL`; sin él, vuelve a cero.
  - Hay que desplegar fuera de las sesiones de estudio.
- **Despliegues y reinicios: lo que no se pierde.**
  - El saldo del tope está en el volumen y no vuelve a cero.
  - Una reserva a medias queda «incierta» y cuenta entera hasta resolverla: no se cobra dos veces ni se libera sola. La prueba automática lo comprueba.
- **Volumen único.**
  - Si falla, se pierden el tope, el cupo del día y la cola de reportes. La copia diaria dura 5 días [9].
  - Conviene exportar los reportes a menudo.
  - El límite de gasto de la cuenta de Anthropic es el tope real si todo lo demás falla.
- **Flujo sin acumular.**
  - Fly no documenta si acumula el flujo.
  - Hay que comprobarlo en el primer despliegue: debe llegar una línea al menos cada 15 s (`activacion.md`, sección 5).
- **Región.**
  - `iad` (este de EE. UU.) es la más barata.
  - En Europa cuesta más; el precio de la Machine de 512 MB allí está pendiente [8].
- **Modelos `.glb`.** No hay que servirlos a través de la CDN de Cloudflare puesta delante de otro servidor, porque sus condiciones lo limitan [26]. Con Workers Static Assets sí se puede [24].
- **Otros proveedores.**
  - Netlify avisa de que los archivos de más de 10 MB «pueden fallar» [38].
  - Hetzner limita las altas nuevas [40].

## 6. Las fuentes de Neuri en el servidor

Cada página guardada lleva su licencia (campo `licencia`).

- **Wikipedia (`wp`, `wpes`): CC BY-SA 4.0.**
  - Van en el paquete, pero en `recursos/`, fuera de `publico/`. Nadie puede descargarlas: la prueba automática comprueba que esas rutas devuelven 404.
  - Neuri solo muestra fragmentos cortos, con el título, el enlace y la licencia de la página.
- **TeachMeAnatomy (`tma`, 144 páginas): © TeachMeSeries Ltd, sin licencia libre.**
  - **No van en el paquete por defecto.** Para incluirlas: `npm run paquete -- --fuentes wp,wpes,tma`. Es decisión de Carlos, después de revisar sus condiciones.
  - **Sin ellas:**
    - las explicaciones, creaciones y adaptaciones de Neuri citan solo páginas comprobables del paquete;
    - las citas de TeachMeAnatomy que ya están en las lecciones se ven igual en la app.
  - La revisión docente y legal decide sobre esas citas.
- **Si falta una fuente o está alterada** (no coincide con el manifiesto):
  - Neuri no explica con citas ni crea lecciones, y lo dice;
  - nunca inventa una fuente.

## 7. Plantillas de despliegue (en el paquete, sin probar en Fly ni en Cloudflare)

En este Mac no hay Docker, `flyctl` ni `wrangler`, así que no se han podido construir ni desplegar. La lógica del Worker sí tiene una prueba automática.

| Archivo del paquete | Qué hace |
| --- | --- |
| `fly.toml` | Una Machine `shared-cpu-1x` de 512 MB en `iad`. Lleva el volumen `anato3d_datos` montado en `/datos`, `auto_stop_machines = "off"`, la comprobación de `/salud`, `ANATO3D_IP_DE=fly-client-ip` y la zona del tope (`America/Tijuana`), que también es la del cupo diario. La clave, los topes y `ANATO3D_CUPO_SAL` van como secretos, no aquí |
| `Dockerfile` | `node:26-slim` (la versión con la que se probó), copia el paquete y arranca con `node servidor.mjs`. No instala nada |
| `.dockerignore` | No mete en la imagen la carpeta `datos` que crea el servidor si se prueba en local |
| `worker/worker.mjs`, `worker/wrangler.toml` | La web desde Workers Static Assets y el reenvío de `/api/*` a Fly en flujo. Añade el secreto compartido (`x-anato3d-proxy`) y la dirección que ve Cloudflare (`x-anato3d-ip`); si el navegador manda esas cabeceras, se sustituyen |

## 8. Fuentes (todas consultadas el 11-11-2026)

1. https://render.com/pricing.md
2. https://render.com/docs/outbound-bandwidth
3. https://render.com/docs/free
4. https://render.com/docs/disks
5. https://render.com/docs/render-vs-vercel-comparison
6. https://render.com/articles/sse-vs-websockets-llm-streaming
7. https://render.com/changelog/updated-plans-for-render-workspaces
8. https://docs.fly.io/about/pricing
9. https://docs.fly.io/volumes/overview
10. https://docs.fly.io/reference/configuration · https://docs.fly.io/launch/autostop-autostart
11. https://fly.io/learn/websockets-workers-cron/
12. https://docs.fly.io/about/billing
13. https://docs.fly.io/apps/secrets
14. https://railway.com/pricing
15. https://docs.railway.com/reference/pricing/plans
16. https://docs.railway.com/networking/public-networking/specs-and-limits
17. https://docs.railway.com/reference/volumes
18. https://docs.railway.com/reference/app-sleeping
19. https://developers.cloudflare.com/workers/platform/pricing/
20. https://developers.cloudflare.com/workers/platform/limits/
21. https://developers.cloudflare.com/durable-objects/concepts/durable-object-lifecycle/ · https://developers.cloudflare.com/durable-objects/platform/limits/
22. https://developers.cloudflare.com/workers/runtime-apis/nodejs/fs/
23. https://developers.cloudflare.com/workers/runtime-apis/streams/
24. https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/
25. https://developers.cloudflare.com/pages/platform/limits/
26. https://www.cloudflare.com/service-specific-terms-application-services/
27. https://vercel.com/pricing
28. https://vercel.com/docs/functions/limitations
29. https://vercel.com/docs/functions/functions-api-reference · https://vercel.com/docs/fluid-compute
30. https://vercel.com/docs/limits/fair-use-guidelines
31. https://vercel.com/docs/storage
32. https://vercel.com/docs/limits
33. https://www.netlify.com/pricing/
34. https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/
35. https://docs.netlify.com/build/functions/configuration
36. https://docs.netlify.com/build/functions/api/
37. https://docs.netlify.com/build/server · https://docs.netlify.com/build/server/limits/
38. https://docs.netlify.com/build/configure-builds/troubleshooting-tips/
39. https://www.hetzner.com/cloud/cost-optimized/
40. https://status.hetzner.com/
41. https://docs.hetzner.com/cloud/billing/faq/
42. https://www.digitalocean.com/pricing/droplets
43. https://docs.digitalocean.com/products/billing/bandwidth/
44. https://caddyserver.com/docs/caddyfile/directives/reverse_proxy
45. https://nginx.org/en/docs/http/ngx_http_proxy_module.html
46. https://docs.cloud.google.com/run/docs/configuring/request-timeout
47. https://docs.cloud.google.com/run/docs/configuring/billing-settings
48. https://docs.cloud.google.com/free/docs/free-cloud-features
49. https://docs.cloud.google.com/run/docs/triggering/https-request
50. https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
51. https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github

La página de precios de Cloud Run (https://cloud.google.com/run/pricing) no se pudo leer, así que el coste de una instancia siempre encendida queda pendiente.
