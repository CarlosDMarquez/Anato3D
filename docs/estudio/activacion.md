---
title: Activar, comprobar, apagar y revertir Neuri en producción
fecha: 2026-11-11
estado: preparado, sin ejecutar (no hay cuentas, ni clave, ni despliegue, ni gasto)
---

# Activación y reversión de Neuri

Esta guía es para Carlos (o para quien mantenga Anato3D). Explica cómo pasar del paquete ensayado a un servicio público con IA. Explica también cómo:
- comprobar que funciona;
- vigilar el gasto;
- apagar la IA al momento sin cortar «Estudiar»;
- volver atrás.

**Todavía no se ha hecho nada de esto.** Cada paso que gasta dinero o publica algo lo decide Carlos.
- Para elegir alojamiento: `docs/estudio/despliegue.md`. Este documento sigue su recomendación: todo en Fly.io para el piloto.
- Para los resultados del ensayo: `docs/estudio/aceptacion.md`.

## 0. Lo que decide y hace Carlos (y nadie más)

1. **La cuenta de Anthropic.**
   - Medio de pago, **límite de gasto mensual** de la cuenta y alertas, en la consola de Anthropic.
   - Ese límite es el tope real si todo lo demás falla.
   - Después, una clave solo para Anato3D.
2. **Los topes de Anato3D.**
   - Para el piloto: 1 US$ al día y 20 US$ al mes.
   - `npm run coste` calcula otros para más uso.
3. **El alojamiento.**
   - Una cuenta de Fly.io: prueba de 1 US$ durante 7 días; después, tarjeta.
   - Cloudflare, solo si más adelante se separa la web.
4. **El dominio (opcional).** Para el piloto vale `<nombre>.fly.dev`.
5. **Las páginas de TeachMeAnatomy.** Decidir si se incluyen en el paquete, después de revisar sus condiciones (`despliegue.md`, sección 6).
6. **La revisión legal y de privacidad**, antes de abrirlo a estudiantes.

**La clave y los datos bancarios nunca pasan por el chat, Git ni Obsidian.** Se escriben directamente en los secretos del alojamiento (sección 4) o en `web/.env.local` (sección 8).

## 1. Construir el paquete

Desde `web/`:

```bash
npm ci
```

```bash
npm run fuentes -- comprobar
```

```bash
npm test
```

```bash
npm run check
```

```bash
npm run paquete
```

- **Qué hace cada orden:**
  - `npm ci` instala las dependencias tal como están fijadas.
  - `fuentes -- comprobar` descarga, en su versión registrada, las páginas que citan las lecciones y que falten en `build/biblioteca/fuentes`. Necesita red; si ya están, no descarga nada.
  - `npm test` y `npm run check` comprueban que todo sigue bien.
  - `npm run paquete` crea el paquete.
- **Con el dominio ya decidido:** `ANATO3D_ORIGEN=https://dominio npm run paquete` (con Fly sin dominio propio, `https://anato3d.fly.dev`). Así las páginas llevan las URL absolutas que piden las redes sociales y los buscadores: la imagen al compartir el enlace, `canonical` y, en la presentación, los `hreflang` de `/` (español) y `/en/` (inglés). Sin la variable todo funciona igual, pero al compartir un enlace puede salir sin imagen. Es otro uso de la misma variable del servidor (sección 2): allí, con `*.fly.dev`, se deja vacía.
- **Resultado:** `build/paquete/` (unos 88 MB), con:
  - `publico/` (la web);
  - `servidor.mjs`;
  - `recursos/`, que no se sirve: está fuera de `publico/`;
  - `MANIFIESTO.json`, `LEEME.md` y `package.json`;
  - las plantillas `fly.toml`, `Dockerfile` y `.dockerignore`;
  - `worker/`.
- **Qué páginas lleva:** las que haya en `build/biblioteca/fuentes`, de Wikipedia por defecto. La lista y la huella de cada archivo quedan en `MANIFIESTO.json`.
- **Comprobación al arrancar:** el servidor compara los recursos con el manifiesto. Si falta alguno o está alterado, Neuri no cita ni crea lecciones, y lo dice.

## 2. Variables

| Variable | Dónde va | Valor para el piloto | Para qué |
| --- | --- | --- | --- |
| `ANTHROPIC_API_KEY` | **Secreto** | La clave (la escribe Carlos) | Sin ella, Neuri responde con el buscador |
| `ANATO3D_TOPE_DIARIO_USD`, `ANATO3D_TOPE_MENSUAL_USD` | Secreto | `1` y `20` | Sin los dos topes no se llama a la IA, aunque haya clave |
| `ANATO3D_DATOS` | `fly.toml` | `/datos` | El volumen: tope, `IA-APAGADA`, cupo diario (`cupo.json`) y reportes |
| `ANATO3D_IP_DE` | `fly.toml` | `fly-client-ip` | De dónde sale la dirección del cliente para los límites de uso |
| `ANATO3D_PRESUPUESTO_ZONA` | `fly.toml` | `America/Tijuana` | El día y el mes de los topes |
| `PORT` | `fly.toml` | `8080` | El puerto interno |
| `ANATO3D_ORIGEN` | `fly.toml` | Vacío con `*.fly.dev`; si no, el origen público (`https://dominio`, sin ruta) | La API solo acepta peticiones de la web de ese origen |
| `ANATO3D_CUPO_SAL` | **Secreto** | 64 caracteres al azar (`openssl rand -hex 32`); como mínimo 16 (con menos, se ignora y lo dice el registro) | La clave HMAC del cupo diario. No está en el archivo del cupo: con el archivo solo no se puede recuperar ninguna IP. Si falta, se usa una sal aleatoria de cada día que solo vive en memoria y **el cupo del día empieza de nuevo en cada reinicio** (lo dice el registro) |
| `ANATO3D_CUPO_PREGUNTAS`, `ANATO3D_CUPO_CREACIONES` | `fly.toml` (opcional) | Vacío: 30 y 3 | Preguntas con IA y creaciones por dispositivo y día. Se renueva a medianoche de la zona del tope |
| `ANATO3D_CUPO_IP` | `fly.toml` (opcional) | Vacío: `300/30` | Tope por IP y día, «preguntas/creaciones». Con un solo número, son las preguntas, y las creaciones, una décima parte. Nunca baja del de un dispositivo |
| `ANATO3D_CUPO` | — | Vacío (encendido) | `0` apaga el cupo diario (solo para probar sin contar) |
| `ANATO3D_PROXY_SECRETO` | Secreto | Vacío (solo con el Worker de Cloudflare: el mismo en los dos, de 16 caracteres o más) | Para que solo se crea la dirección que pasa el Worker |
| `ANATO3D_PET_MODELO`, `ANATO3D_PET_MODELO_LECCIONES` | — | Vacío: Haiku 5.5 | Otro modelo solo con la variable siguiente; Opus, Fable, Mythos o un nombre desconocido se ignoran |
| `ANATO3D_PERMITIR_SONNET` | — | Vacío | `1` solo si Carlos decide probar Sonnet 5.5 |
| `ANTHROPIC_BASE_URL` | **Nunca en producción** | — | Solo para el ensayo con el proveedor simulado; fuera de `localhost` (o de `api.anthropic.com`) el servidor no arranca |

**Por qué los topes van como secretos:** no son secretos, pero así se cambian con `fly secrets set` sin tocar `fly.toml`. En los dos casos la Machine se reinicia.

## 3. Ensayo en este Mac (sin gastar)

Sin IA (Neuri responde con el buscador). Desde la carpeta del paquete:

```bash
node servidor.mjs
```

Abre http://localhost:8080: la presentación está en `/` (en inglés, en `/en/`) y la app en `/app/` (`/app` y `/en`, sin barra, redirigen a su carpeta).

Con el proveedor simulado, en dos terminales. Primero el simulador, desde `web/`:

```bash
node scripts/proveedor-simulado.mjs --puerto 5199
```

Después el servidor, desde la carpeta del paquete:

```bash
ANTHROPIC_API_KEY=sk-ant-simulada ANTHROPIC_BASE_URL=http://127.0.0.1:5199 ANATO3D_TOPE_DIARIO_USD=1 ANATO3D_TOPE_MENSUAL_USD=20 node servidor.mjs
```

- **Lo que verás:**
  - el servicio dice «simulado», nunca «comprobada»;
  - las respuestas son fijas.
- **Al terminar:**
  - se puede borrar `build/paquete/datos`;
  - aunque no se borre, `.dockerignore` la deja fuera de la imagen.

## 4. Publicar en Fly.io (cuando Carlos lo decida)

Hay que instalar `flyctl`, la herramienta de Fly, y entrar en la cuenta:

```bash
fly auth login
```

Desde la carpeta del paquete (`build/paquete`). Si el nombre `anato3d` está cogido, usa otro en todas las órdenes y en `app` de `fly.toml`.

1. **Crear la app:**

   ```bash
   fly apps create anato3d
   ```

2. **Crear el volumen** (uno solo, en la región de `fly.toml`):

   ```bash
   fly volumes create anato3d_datos --size 1 --region iad --app anato3d
   ```

3. **Guardar la clave sin que quede en el historial.** Carlos la pega en su terminal; no se ve al escribir:

   ```bash
   read -rs CLAVE && fly secrets set ANTHROPIC_API_KEY="$CLAVE" --stage --app anato3d; unset CLAVE
   ```

4. **Guardar los topes:**

   ```bash
   fly secrets set ANATO3D_TOPE_DIARIO_USD=1 ANATO3D_TOPE_MENSUAL_USD=20 --stage --app anato3d
   ```

   Y el secreto del cupo diario (no hace falta apuntarlo: solo lo usa el servidor):

   ```bash
   fly secrets set ANATO3D_CUPO_SAL="$(openssl rand -hex 32)" --stage --app anato3d
   ```

5. **Desplegar con una sola Machine:**

   ```bash
   fly deploy --ha=false --app anato3d
   ```

**Por qué `--ha=false`:** sin esa opción, Fly puede crear dos Machines (alta disponibilidad), y con dos volúmenes cada una tendría su propio tope. Para comprobar que solo hay una:

```bash
fly status --app anato3d
```

**Sin IA al principio:** se pueden saltar los pasos 3 y 4. La web y «Estudiar» funcionan, y Neuri responde con el buscador.

## 5. Comprobar el despliegue (con la IA, gasta unos céntimos)

| # | Qué | Cómo | Resultado esperado |
| --- | --- | --- | --- |
| 1 | El servidor responde | `curl https://anato3d.fly.dev/salud` | `{"ok":true,"version":"2026-11-11.1"}` |
| 2 | El estado de Neuri | `curl https://anato3d.fly.dev/api/pet` | `"estado":"configurada"` con clave y topes. `sin-presupuesto` si faltan los topes; `sin-clave` si falta la clave |
| 3 | La IA de verdad | En la web: «Estudiar» → Neuri → «¿Qué forman los huesos nasales? Explícamelo» | Una explicación con citas. `/api/pet` pasa a `"comprobada"` (solo tras una llamada real que sale bien) |
| 4 | El flujo llega sin acumularse | En la web, crear una lección corta | Los pasos (fuentes → redactando → comprobando) avanzan, con al menos una línea cada 15 s, sin llegar todo de golpe al final |
| 5 | Reportes | En la app, enviar un reporte de prueba; después `fly ssh console --app anato3d -C "tail -n 1 /datos/reportes.jsonl"` | La línea del reporte, sin la dirección IP |
| 6 | Registro sin datos privados | `fly logs --app anato3d` | Una línea por petición (`[http] …`) y una por llamada (`[pet] …` con tokens y coste); ni textos de nadie ni la clave |
| 7 | El tope cuenta | `fly ssh console --app anato3d -C "cat /datos/presupuesto.json"` | Lo gastado hoy y este mes, con cifras pequeñas |
| 8 | El cupo diario cuenta y sobrevive a un reinicio | `curl https://anato3d.fly.dev/api/pet` (lleva el saldo del cupo); `fly ssh console --app anato3d -C "cat /datos/cupo.json"`; después reiniciar la Machine (`fly machine restart <id> --app anato3d`, con el id de `fly status`) y repetir | `"v":2` con números y claves HMAC, sin IP ni identificador. Tras el reinicio, lo gastado hoy sigue; el registro no dice «Sin ANATO3D_CUPO_SAL» |

**Si algo no sale como se espera,** se apaga la IA (sección 7) y se mira el registro.
- **Si el paso 4 llega todo de golpe:** el alojamiento acumula el flujo, y hay que revisarlo antes de abrirlo a estudiantes.

## 6. Vigilar el consumo

- **En el registro del servidor:**
  - **qué hay:** una línea por llamada, con el modo, el modelo, los tokens (entrada, caché leída, caché escrita, salida), el coste aproximado, los segundos y el trabajo. Nunca lo que escribe la persona.
  - **cómo verlo:**

    ```bash
    fly logs --app anato3d
    ```

  - **forma de cada línea:** `[pet] <modo> · claude-haiku-5-5: entrada …, caché leída …, caché escrita …, salida … (≈ … US$) · … s`.
- **En el tope:**
  - **cómo bajar una copia del archivo,** desde la raíz del repositorio (`build/` no va a git):

    ```bash
    mkdir -p build/presupuesto-fly && fly ssh sftp get /datos/presupuesto.json build/presupuesto-fly/presupuesto.json --app anato3d
    ```

  - **cómo leerla con el mismo informe que en desarrollo:** desde `web/`, con los topes de producción:

    ```bash
    ANATO3D_DATOS=../build/presupuesto-fly ANATO3D_TOPE_DIARIO_USD=1 ANATO3D_TOPE_MENSUAL_USD=20 npm run presupuesto
    ```

  - **qué enseña:** lo gastado hoy y este mes, las reservas abiertas y las últimas llamadas.
- **Las reservas «inciertas»:**
  - son llamadas cortadas después de enviar, sin la cifra de coste;
  - cuentan enteras, lo que es seguro, y cada una es de céntimos;
  - en producción no hace falta resolverlas.
- **El coste real:**
  - la factura de Anthropic es la que vale: comparar con console.anthropic.com → Usage;
  - para recalcular el coste mensual con lo observado, desde `web/`:

    ```bash
    ANATO3D_DATOS=../build/presupuesto-fly npm run coste -- --observado
    ```

## 7. Apagar y volver atrás (de lo más suave a lo más fuerte)

| Qué | Cómo | Efecto | Cuándo actúa |
| --- | --- | --- | --- |
| **Apagar solo la IA** | `fly ssh console --app anato3d -C "touch /datos/IA-APAGADA"` | Neuri responde con el buscador y avisa del límite de gasto. «Estudiar», la web, el progreso y los reportes siguen | Al momento, sin reiniciar |
| Volver a encenderla | `fly ssh console --app anato3d -C "rm /datos/IA-APAGADA"` | La IA vuelve, si queda tope | Al momento |
| Cambiar los topes | `fly secrets set ANATO3D_TOPE_DIARIO_USD=0.5 --app anato3d` | Reinicia la Machine y corta las creaciones en curso. El saldo gastado no se pierde | En segundos |
| Quitar la clave | `fly secrets unset ANTHROPIC_API_KEY --app anato3d` | Neuri sin IA (`sin-clave`) | Tras el reinicio |
| Anular la clave | Consola de Anthropic → borrar la clave | La IA falla con 401 y Neuri vuelve al buscador sin reintentar | Al momento |
| Volver a la versión anterior | `fly releases --image --app anato3d` y después `fly deploy --image <imagen de esa versión> --app anato3d` | Vuelve el servidor anterior. El volumen (tope, cupo y reportes) no cambia | Un despliegue |
| Quitar la web | `fly scale count 0 --app anato3d` | La web deja de estar disponible. El volumen se conserva; para volver, `fly deploy --ha=false` | Al momento |

- **Otra forma de volver atrás:** rehacer el paquete desde el commit anterior (`git checkout <commit>`, `npm run paquete`) y desplegar.
- **No usar `fly apps destroy`:** borra también el volumen.

## 8. Prueba real mínima (optativa; gasta unos 0,01 US$)

Demuestra con las menos llamadas posibles que la clave llega a Claude Haiku 5.5, que el flujo funciona y que las explicaciones salen con fuentes comprobadas. Prueba la cuenta y la clave, no el alojamiento (eso lo hace la sección 5).

- **Dónde:** en el Mac de Carlos.
  - La clave y los topes van en `web/.env.local`.
  - Hay que cerrar antes el servidor de desarrollo, porque comparten el tope.
- **Pasos, desde `web/`:**
  1. Ensayo en seco: dice lo que haría y lo máximo que podría costar, y no envía nada.

     ```bash
     node scripts/prueba-minima.mjs
     ```

  2. La prueba de verdad.

     ```bash
     node scripts/prueba-minima.mjs --si-gastar
     ```

- **Las tres llamadas:**
  - una pregunta con explicación («¿Qué forman los huesos nasales?»);
  - la comprobación de sus citas;
  - una llamada corta en flujo.
- **Coste máximo admitido: 0,0123 US$** desde el 12 nov, con el texto fijo por modo *[Histórico: 0,1705 US$, cuando todas las llamadas llevaban el catálogo entero]*. Es la suma de las tres reservas. Lo normal son unos 0,005–0,01 US$. Hace falta que quede al menos ese máximo en el tope; si no, no envía nada.
- **Criterio de parada:** se para en el primer fallo, sin seguir gastando:
  - la API responde mal (clave rechazada, sin saldo…);
  - contesta otro modelo;
  - o falla el flujo.
- **Conciliación:**
  - al final escribe lo que costó cada llamada según `usage`, con su hora UTC;
  - se compara con console.anthropic.com → Usage, a esa hora y con ese modelo.
- **Ensayada sin gastar** con el proveedor simulado:
  - la prueba automática de `tests/produccion.test.mjs`;
  - una pasada a mano el 11-11-2026: 3 llamadas, 2 citas comprobadas, flujo `{"ok":true}`, máximo admitido 0,1705 US$.
  - **No se ha ejecutado contra Anthropic.**
- **No confundir con `npm run pet:prueba`:**
  - hace 17 conversaciones con frases en cinco idiomas (la interfaz, en español);
  - con `--crear`, además, una lección completa;
  - son muchas más llamadas;
  - solo con permiso expreso de Carlos.

## 9. Experimentos para después (no bloquean el lanzamiento)

Cada uno necesita uso real y, si gasta, el permiso de Carlos y un tope propio.

- **Duración de la caché.**
  - Hoy, las instrucciones fijas se guardan en caché 5 minutos.
  - Si los mensajes llegan muy separados, la caché se enfría y se paga la escritura cada vez.
  - Hay que medir con `npm run coste -- --observado` y el registro (caché escrita frente a caché leída).
  - Probar la caché de 1 h solo si ahorra: escribir cuesta 2× en vez de 1,25×, y el tope ya sabe contarla.
- **Haiku frente a Sonnet.**
  - Solo en casos en que Haiku falle de forma reproducible; por ejemplo, una lección que no pasa la comprobación ni con la corrección.
  - Con `ANATO3D_PERMITIR_SONNET=1` y `ANATO3D_PET_MODELO_LECCIONES=claude-sonnet-5-5`, en local y con un tope pequeño aparte.
  - Comparar la calidad y el coste: Sonnet sale unas 20 veces más caro.
  - No cambiar el modelo por defecto sin esa comparación.
- **Memoria de la Machine.** Si en producción se queda por debajo de unos 200 MB con varias personas, la de 256 MB ahorra unos 1,5 US$ al mes.
- **Transferencia real por estudiante.** Medirla en las métricas de Fly y recalcular los escenarios de `despliegue.md`.
- **CPU del Worker,** si se separa la web: comprobar que el reenvío cabe en los 10 ms del plan gratuito.
