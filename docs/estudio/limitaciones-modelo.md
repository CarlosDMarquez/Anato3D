# Limitaciones conocidas del modelo 3D

Algunas piezas del modelo están mal situadas, tienen un nombre dudoso o están incompletas. Corregirlas es trabajo de
Blender, que no se hace aquí. Mientras tanto, la app no puede presentarlas como fiables ni puntuar al estudiante con
ellas. Esta página explica el registro de esas piezas (`web/src/data/limitaciones.js`), dónde actúa, cómo se añade o se
retira una entrada y qué queda pendiente.

Bloque hecho el 9 de noviembre de 2026 en la rama `claude/limitaciones-modelo` (desde `main` en `454a3cb`), sin commit.
La comprobación de cada pieza está en `docs/revision/limitaciones-modelo/hallazgos.md`.

## Cuatro cosas distintas

| Qué | Quién lo hace | Dónde |
| --- | --- | --- |
| **Aviso al estudiante** | La app | Ficha de la pieza y pasos de las lecciones. |
| **Restricción de una actividad** | La app | Preguntas que puntúan (identificar y localizar), actividad «localizar» de un paso, repaso y Neuri. |
| **Corrección de la geometría** | El pipeline de Blender | Fuera de este trabajo. Un aviso o una restricción no corrigen nada. |
| **Revisión docente** | Un profesional | Pendiente. Las entradas están comprobadas por inspección, no aprobadas. |

Lo que se puede enseñar con fuentes no cambia. Las preguntas de texto y las explicaciones de Neuri con citas siguen
funcionando: lo que se evita es pedir que se mire o se toque en el modelo lo que el modelo muestra mal.

## Las tres de hoy

| Pieza | Tipo | Estado | Qué se ve en el modelo | Qué se restringe |
| --- | --- | --- | --- | --- |
| `Paracentral_sulcus` | fuera de sitio | confirmada | En la cara lateral del lóbulo frontal, dentro del giro frontal medio. El surco paracentral está en la cara medial. | Identificar, localizar y usarla como opción falsa. |
| `Inferior_temporal_sulcus` | nombre dudoso | sospechosa | En la cara inferior, entre el giro temporal inferior y el fusiforme, donde se describe el surco occipitotemporal. Hoy ese nombre es el de un surco de la cara lateral. | Igual que la anterior. |
| `Middle_meningeal_artery` | incompleta | confirmada | Solo un tramo de 25 a 27 mm junto al esfenoides, sin sus ramas. | Nada: se puede preguntar señalando el tramo que se ve. Solo hay aviso. |

Valen para los dos modelos y los dos lados. Cada entrada lleva además:
- el archivo examinado de cada modelo;
- el registro de la comprobación;
- el aviso y la explicación en los cinco idiomas: el contenido en español y la traducción, hecha con IA y sin revisar;
- sus fuentes, que son citas literales de Wikipedia en la revisión citada.

## Dónde actúa: antes y después

| Dónde | Antes | Ahora |
| --- | --- | --- |
| Ficha de la pieza (desde el buscador o tocándola en el visor) | Ningún aviso | El aviso va en la cabecera, debajo del nombre, y se ve también con la ficha plegada del móvil. En el cuerpo está la explicación, con el estado, la fecha y las fuentes. Los cinco idiomas cambian al momento. |
| Pasos de una lección | La pieza se resaltaba sin aviso. La actividad «localizar» corregía el toque sobre ella. | El aviso sale una vez por lección, nombrando la estructura de la lección («Limitación del modelo 3D · Surco occipitotemporal»), en el paso donde es el foco: el de su actividad o, si no, el que la resalta junto a menos estructuras. «Localizar» sobre una pieza limitada no se corrige ni se enseña como solución; su paso lleva siempre el aviso y la nota nombra la estructura. Si la estructura tiene varias piezas, se hace sin la limitada. |
| Evaluación | Podía preguntarla, ofrecerla como candidata para tocar o dar su nombre como opción falsa. | No se pregunta ni se ofrece: ver el detalle debajo de esta tabla. |
| Repaso y prácticas | Habría vuelto al repaso. | Su ítem queda «huérfano»: se conserva con su historial, no cuenta y no vuelve. En una sesión se cambia por otra pregunta de lo mismo y, si no la hay, se quita y se dice. Los contadores de repaso no la cuentan. Lo que no se puede hacer por otro motivo (una estructura del otro modelo, una pregunta retirada) sigue como antes y no se achaca a las limitaciones. |
| Progreso y mapa de aprendizaje | — | Las preguntas limitadas no cuentan para el dominio; las retiradas o del otro modelo, como siempre. Si un objetivo no tiene ninguna pregunta posible, no hay dominio. Las tarjetas, el mapa y la propuesta de sesión usan el mismo cálculo. En el mapa, los intentos sobre preguntas limitadas se conservan, pero no cuentan como evidencia. |
| Neuri | Podía planificar, redactar y entregar actividades en 3D sobre esas piezas. | Recibe solo las limitaciones de las estructuras que trata. El ensamblado quita esas actividades de forma determinista, y el informe las cuenta aparte (no como afirmaciones sin respaldo). Si algo se escapa, la validación lo para (ver «Neuri»). |
| Lecciones propias guardadas o importadas | Igual que las de la biblioteca | Se guardan igual y no se apartan, pero lo limitado no se evalúa ni se repasa. |

En la evaluación, en detalle:
- La ficha de la lección avisa antes de empezar de cuántas preguntas en 3D no se harán.
- El resultado dice cuántas no se hicieron y qué objetivos quedaron sin evaluar.
- Un objetivo sin evaluar no se da por cumplido, así que esa evaluación no demuestra la lección; lo demás cuenta como siempre.
  Si además no se llega al 80 % o falla un objetivo evaluado, el veredicto es el de siempre y la nota de la limitación va
  aparte.
- Si no queda ninguna pregunta posible, la app lo explica y no registra nada.

Una pieza limitada que solo aparece como contexto o translúcida no lleva aviso en el paso. Si se toca, su ficha sí lo
lleva.

## Decisiones y por qué

- **Pieza a pieza, no por estructura.** Una estructura de varias piezas sigue sirviendo con las que están bien. En la
  pregunta no se ve ni se puede tocar la limitada. Así lo pide el encargo («no bloquees toda una estructura…»). Hace
  falta para la lección `cab-surcos-medial` de la otra rama, cuyo «surco occipitotemporal» une
  `Occipitotemporal_sulcus_Lateral_part` e `Inferior_temporal_sulcus`.
- **La incompleta solo avisa.** Lo que se ve de la meníngea media está bien identificado, y la tarea de señalar ese
  tramo no es ambigua. Lo engañoso sería describir su recorrido como si se viera, y eso lo dice el aviso.
- **En el revisor de lecciones, aviso y nunca error.** Un error apartaría las lecciones propias que la gente ya tiene
  guardadas (`propias.js` las vuelve a validar al leerlas), rechazaría importaciones y haría fallar a Neuri. La app las
  neutraliza al evaluar.
- **Se reutiliza lo que ya había:**
  - la puerta única `disponibleEn`, que ahora es `motivoNoDisponible` con el motivo `'limitacion'`;
  - los ítems huérfanos de `depurar`;
  - `alternativaDe` para ofrecer otra pregunta;
  - el salto «técnico» de una pregunta que no se puede mostrar, con el evento `limite-modelo`;
  - el gancho `invalida` del mapa de aprendizaje.
- **Sin tocar archivos generados.** `catalogo.json`, `fuentes.json` y `cobertura.md` no cambian. Así las fusiones con
  las otras ramas siguen limpias. Las citas del registro se comprueban aparte (`node scripts/limitaciones.mjs --citas`).
- **Nada en el bloque fijo de Neuri.** Las notas van en el bloque variable de cada llamada y solo para lo pertinente: el
  bloque fijo es igual para todos y se guarda en caché.

## Neuri

- **Orientar:** se añade la nota de las piezas limitadas que nombra la persona:
  - en su último mensaje, en lo que escribió antes o en el tema que se conserva («¿y dónde lo veo en el modelo?» sigue
    hablando de lo mismo);
  - con su nombre completo en español, inglés, latín, francés o italiano (`limitadasEn`, en `server/neuri/limites.mjs`).
- **Planificar:** la nota va solo en las candidatas que la tienen.
- **Redactar y adaptar:** las notas de las estructuras del plan y de todas las piezas de la lección base.
- **Ensamblado** (`server/neuri/ensamblar.mjs`):
  - quita las preguntas de identificar o localizar sobre una pieza limitada;
  - quita la actividad «localizar» de un paso si su estructura principal, la primera del núcleo que pide la IA, está
    limitada. Nunca la cambia por otra estructura, porque el texto de la IA seguiría pidiendo tocar la limitada;
  - lo cuenta en `informe.limitesModelo`, que la tarjeta de la creación muestra en su propio párrafo y que no se suma a
    `informe.quitadas` (las afirmaciones sin respaldo);
  - nunca la ofrece como candidata ni como opción falsa.
- **Validación:** si algo de eso llega a `validarLeccion`, es un error. La lección pasa por la ronda de corrección o no
  se entrega.

## Cómo añadir una limitación

1. **Reproducirla** en los dos modelos y los dos lados con `docs/revision/limitaciones-modelo/medir-limitaciones.js`. Hay
   que separar lo que se ve en la geometría de su interpretación anatómica. Anótala en `hallazgos.md`, con capturas y la
   versión de los archivos (blob de git).
2. **Buscar fuentes reales.** Por ahora, Wikipedia en una revisión concreta (`oldid`), con citas literales de 20
   caracteres o más.
3. **Añadir la entrada** en `web/src/data/limitaciones.js`:
   - tipo (`ubicacion`, `identidad` o `incompleta`) y estado (`confirmada` o `sospechosa`);
   - fecha, recurso y evidencia;
   - qué restringe;
   - aviso y detalle en los cinco idiomas;
   - fuentes.

   Una pieza fuera de sitio o de nombre dudoso tiene que restringir al menos identificar y localizar.
4. **Comprobar:**
   - `npm run check`: las piezas existen en los modelos y los textos están completos; falla si un modelo reconstruido
     cambia el nombre de una pieza registrada;
   - `node scripts/limitaciones.mjs --citas` (necesita red);
   - `npm test`;
   - y, en el navegador, la ficha y una lección que la use.
5. **Publicar.** El registro es código, como `retiradas.js`: llega a la gente al publicar la web.

## Cómo retirarla cuando se corrija la geometría

1. Volver a medir con el script en la versión nueva del modelo y anotar en `hallazgos.md` «no reproducido en la versión
   …».
2. Quitar la entrada, o reducir lo que restringe si queda una parte.
3. No hace falta tocar el progreso: los ítems huérfanos se recuperan solos la próxima vez que se abra la lección
   (`depurar`).

## Lo que se comprobó

- **Automático:**
  - `npm test` con 164 pruebas, las 148 de `main` más 16 de `tests/limitaciones.test.mjs`;
  - `npm run check`;
  - `vite build`.
- **Citas:** `node scripts/limitaciones.mjs --citas`. Las 7 citas están en la revisión citada.
- **Inspección:** los tres hallazgos en los dos modelos y los dos lados, con 10 capturas (`hallazgos.md`).
- **Navegador** (servidor de desarrollo con Neuri simulado, sin la IA real), con una lección propia generada por Neuri
  simulado más una pregunta antigua sobre la pieza:
  - ficha desde el buscador, en el escritorio y en el móvil plegado, en los cinco idiomas;
  - ficha por selección directa: el mismo evento `pick` que lanza un clic en el visor, en los dos modelos y los dos lados.
    El aviso sale en las 6 piezas afectadas de cada modelo y no sale en las de control (surco frontal superior, surco
    central);
  - aviso del paso una sola vez, y la actividad de control intacta;
  - ficha de la lección con «1 pregunta en 3D… no se hace»;
  - evaluación de 4 preguntas sin la pieza y sin su nombre entre las opciones; el resultado con la nota;
  - un fallo antiguo que queda huérfano y deja de contar en «Repasar ahora»;
  - una estructura de varias piezas que se resalta y se toca sin la limitada;
  - la tarjeta de una creación de Neuri (simulado) con 3 actividades quitadas: la nota va en su propio párrafo, encima del
    informe, en los cinco idiomas, también al recargar la página.
- **Accesibilidad del aviso** (medida en el navegador):
  - **Contraste** sobre su fondo real: texto 9,1:1, negrita 14,3:1, icono 10,3:1 y detalle 15,7:1. Cumple AA y AAA.
  - **Zoom al 200 %**, emulado con una vista de 640 × 400 (una pantalla de 1280 × 800 al doble): en la ficha plegada el
    aviso se ve entero, sin cortes ni desplazamiento horizontal.
- **Fallos encontrados y corregidos:**
  - **En el navegador:** las lecciones propias no se depuraban la primera vez que se abría el panel, porque se añaden al
    cargar el catálogo. Ahora se depuran al añadirse.
  - **Al revisar el código:** si Neuri no había quitado ninguna afirmación, la frase de las actividades quitadas se
    pegaba al informe sin punto («…9 citas comprobadas Se quitaron…»). Ahora va en su propio párrafo.
  - **En la tarjeta de Neuri:** en inglés y en alemán la frase empezaba con «3 3D…». Se reformuló.
- **Revisión adversarial** (9 nov, de 22:48 a 23:23; 14 agentes de solo lectura):
  - **Cómo se hizo:** cuatro revisores (lógica, interfaz, Neuri y regresiones frente a `main`) buscaron fallos con
    escenarios reproducibles. Cada hallazgo de gravedad media lo intentó refutar otro agente; todos se confirmaron.
  - **Hallazgos de gravedad media, corregidos y con prueba:**
    1. Si la IA ponía primero la pieza limitada en una actividad «localizar», el ensamblado la cambiaba por otra
       estructura y conservaba el texto que pedía tocar la limitada. Ahora la actividad se quita.
    2. El informe de Neuri contaba dos veces lo quitado por una limitación, y una de ellas como «afirmaciones que sus
       citas no respaldaban». Ahora va solo en `limitesModelo`.
    3. Al orientar, la nota no llegaba si la persona nombraba la pieza en francés o en italiano, ni en la pregunta
       siguiente («¿y dónde lo veo?»).
    4. El repaso atribuía a «limitaciones conocidas del modelo» cualquier pregunta que no se podía hacer, también las de
       una lección del otro modelo (por ejemplo, el aparato reproductor femenino estudiado en el modelo masculino). Era
       una regresión frente a `main`.
    5. Las preguntas retiradas salían del cálculo del dominio. Un objetivo con todas sus preguntas retiradas podía dar
       la lección por «dominada».
  - **Hallazgos de gravedad baja, corregidos:**
    - el dominio de la tarjeta y el del mapa podían no coincidir;
    - el veredicto de la evaluación ocultaba que no se había llegado al 80 %;
    - el aviso de un paso podía salir en un paso de orientación con muchas estructuras, sin decir a cuál se refería,
      y no salir en el de la actividad desactivada;
    - la ficha de una lección no cargada se repintaba entera al cargarla, cerrando lo abierto y moviendo el foco;
    - los avisos emergentes largos se cortaban en el móvil;
    - la configuración temporal de `.claude/launch.json` se revierte antes de entregar.
  - **Comprobado tras los arreglos:**
    - `npm test` 164 de 164, `npm run check` y `vite build`;
    - en el navegador:
      - el aviso del paso con el nombre de la estructura;
      - la nota de la actividad desactivada;
      - los dos veredictos de una evaluación con un objetivo sin evaluar: con 0 de 4, el de siempre más la nota; con 4
        de 4, el de la limitación;
      - el aviso emergente más largo, entero en 375 px.
  - **No se cambió:**
    - Una lección que ya explica su limitación (la meníngea media en `cab-senos-venosos`) recibe además el aviso de la
      app. Es redundante, pero no erróneo. Evitarlo pediría un campo nuevo en el formato de las lecciones.
    - Abrir la ficha de una lección no cargada la descarga, unos 110 a 170 kB la primera vez, para contar sus preguntas
      limitadas. Para evitarlo habría que guardar esa cuenta en el catálogo generado, mejor después de fusionar.
- **No comprobado:**
  - la IA real (no se llamó a la API);
  - un lector de pantalla y un móvil real;
  - la revisión docente.

## Integración con las otras dos ramas

Las dos ramas terminadas no tocan el núcleo que cambia aquí: `evaluar.js`, `progreso.js`, `sesion.js`, `formato.js`,
`preguntas.js`, `leccion.js`, `ensamblar.mjs`, `info.js` y `src/data/`.

**`claude/bold-liskov-29585b`** (las 13 lecciones):
- `cab-surcos-medial`: su «surco occipitotemporal» conserva sus preguntas, sin `Inferior_temporal_sulcus` en el 3D. El
  revisor dará avisos, no errores.
- `cab-senos-venosos`: la meníngea media no restringe nada, pero conviene arreglar en esa rama su actividad «vistas»,
  «Sigue la arteria por dentro del cráneo», que contradice su propia nota sobre el modelo.
- `catalogo.json` y `cobertura.md` de esa rama siguen al día con esta: esta rama no cambia nada de lo que los genera. Si
  hubiera conflicto en ellos, se regeneran con `node scripts/biblioteca.mjs` en vez de fusionarlos a mano.

**`claude/inspiring-brahmagupta-0bde3f`** (los recorridos por unidades):
- **Archivos que tocan las dos ramas:**
  - `server/pet.mjs`;
  - `styles.css`;
  - `ui/biblioteca/pet.js`: la nota de las actividades quitadas va en su propio párrafo, encima del informe, para no
    tocar la línea vecina que cambia esa rama;
  - seis documentos de `docs/estudio`.
- **Al fusionar (opcional):** conectar las limitaciones en `planificarRecorrido`, que solo existe en esa rama.
  - Las unidades ya se crean por el camino de siempre (planificar → redactar → ensamblar), que aplica las restricciones de
    forma determinista. Esto solo evita que el reparto planifique una unidad centrada en una pieza limitada.
  - El fragmento, en `web/server/pet.mjs`, tras calcular `sistemas`, con `import { LIMITACIONES } from
    '../src/data/limitaciones.js';`:

    ```js
    const deZona = (k) => { const e = R.inventario.estructuras[k]; return !!e && (e.lugares.some(([r]) => regiones.includes(r)) || sistemas.includes(e.sistema)); };
    const limites = textoLimites(LIMITACIONES.flatMap((l) => l.piezas).filter(deZona));
    // …y `limites` como último elemento de `variable`, después de textoZona(…).
    ```

  - Se probó en la copia combinada (abajo):
    - con el encéfalo, Claude recibe las tres notas;
    - con el miembro superior, ninguna;
    - las pruebas siguen pasando.

**La fusión, simulada:**
- Se hizo con `git merge-file` sobre copias, sin tocar ninguna rama, y no hubo conflictos ni con cada rama por separado
  ni con las tres juntas.
- Copia desechable con las tres ramas juntas (`main` en `454a3cb` más las tres ramas, en una carpeta temporal):
  - `npm test`: 181 de 181 (178 antes de las 3 pruebas añadidas por la revisión);
  - `npm run check`: correcto, con 84 lecciones, 0 errores y 3 avisos de `cab-surcos-medial` (los previstos);
  - `vite build`: correcto.
- **Después de fusionar,** hay que poner al día las cifras de pruebas de los documentos: 181.

**Archivos de este bloque:**
- **Nuevos:**
  - `web/src/data/limitaciones.js`, `web/src/i18n/textos-limitaciones.js`, `web/server/neuri/limites.mjs`;
  - `web/scripts/limitaciones.mjs`, `web/tests/limitaciones.test.mjs`;
  - `docs/revision/limitaciones-modelo/`;
  - esta página.
- **Cambiados:**
  - `web/src/biblioteca/{formato,evaluar,progreso,sesion}.js`;
  - `web/src/ui/info.js` y `web/src/ui/biblioteca/{preguntas,leccion,explorar,index,mapa,pet}.js`;
  - `web/src/i18n/textos.js` y `web/src/styles.css`;
  - `web/server/{pet.mjs,neuri/ensamblar.mjs}`;
  - `web/scripts/check-cards.mjs`;
  - las partes afectadas de los documentos de `docs/estudio/`.

## Pendiente para el siguiente ciclo (por prioridad)

1. **Revisión docente** de las tres clasificaciones y, sobre todo, de qué surco representa de verdad la malla llamada
   `Paracentral_sulcus`.
2. **Correcciones del modelo**, en Blender:
   - situar o renombrar `Paracentral_sulcus`;
   - decidir el nombre de `Inferior_temporal_sulcus`;
   - valorar las ramas de la meníngea media.

   Después hay que retirar o reducir las entradas.
3. **Auditar más piezas.** Solo se examinaron estas tres; las demás no tienen comprobación de este tipo.
4. **Accesibilidad:**
   - el contraste y el zoom al 200 % del aviso ya se midieron (ver «Lo que se comprobó»); falta el zoom real del
     navegador en el resto de «Estudiar»;
   - un lector de pantalla y un móvil reales.
5. **Cobertura pedagógica restante:** muñeca, mama, tobillo, codo, médula espinal… (`cobertura.md`).
6. **Mejoras menores tras fusionar:**
   - conectar las limitaciones con `planificarRecorrido` (el fragmento está arriba);
   - guardar en el catálogo generado cuántas preguntas limitadas tiene cada lección, para no descargarla al abrir su
     ficha;
   - un campo para que una lección diga qué limitación ya explica, para no repetir el aviso.
7. **Asuntos externos**, de Carlos:
   - clave de la API para la prueba real con Haiku;
   - cuentas y alojamiento;
   - piloto con estudiantes;
   - revisión legal.
