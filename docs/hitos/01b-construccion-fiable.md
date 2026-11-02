# Hito 1b — Construcción de modelos que falla de verdad

Fecha: 2026-11-02. Base: commit `90990ce`. Punto de partida: `docs/review-2026-11-01/REVIEW.md`, P1 «model builds can hide failures», y apartado 6 del encargo.

## 1. Resultado

No es un cambio que vea el estudiante, sino una protección: **un modelo roto o incompleto ya no puede llegar a la web sin que nadie lo note.** Si falla Blender, un script o una exportación, la construcción se para con un mensaje claro y la web sigue sirviendo los modelos anteriores, que funcionaban.

## 2. Criterios de aceptación

| Criterio | Resultado |
|---|---|
| Una excepción en un script de Blender hace fallar la construcción | Cumple: con `--python-exit-code 1` da código 1. Sin él, Blender daba 0 (comprobado). |
| Un paso que termina «bien» sin escribir sus archivos hace fallar la construcción | Cumple (`require_outputs`) |
| Un GLB roto o un JSON roto no se publican | Cumple (`validate_models.py`) |
| Una pérdida grande de piezas no pasa sin querer | Cumple: más del 5 % rechaza, salvo `A3D_ALLOW_SHRINK=1` |
| Nada se escribe en `web/public/models` hasta que todo pasa | Cumple: preparación, candidato, validación y publicación al final |
| Se puede volver atrás | Cumple: los anteriores quedan en `build/staging/…/previous` (y en git) |
| Constan las versiones de fuentes, herramientas y modelos | Cumple: `manifest.json` con SHA-256 de cada archivo, de las fuentes y de las Fase 2; versión de Blender, Python y Node; commit |
| Se puede reconstruir desde una copia nueva, con lo que falta documentado | Documentado en `docs/construccion.md`; **no probado** en un clon limpio ni en otro equipo |

## 3. Cambios

- **`tools/build_all.sh`, reescrito:**
  - `set -euo pipefail`;
  - Blender con `--python-exit-code 1` (`run_blender`);
  - salidas obligatorias por paso;
  - preparación en `build/staging/<modelo>-<fecha>/`;
  - aviso final si algo falla. Es una trampa `ZERR`, porque zsh no ejecuta la trampa `EXIT` al salir por `set -e` (comprobado);
  - nuevo objetivo `base` (`fix_neck.py`);
  - sistemas desconocidos rechazados;
  - Blender configurable (`A3D_BLENDER`);
  - registros completos en `build/logs/`.
- **`tools/build_lib.sh` (nuevo):** `run_blender`, `require_outputs`, `stage_init` y `publish` (candidato, validación, índice, `check-cards`, manifiesto y publicación en dos fases).
- **`tools/validate_models.py` (nuevo):**
  - GLB: cabecera, versión, longitud, bloques JSON y binario, vistas de búfer (también las de Draco), piezas con sistema conocido y comparación con lo publicado;
  - JSON: metadatos, índice y región.
- **`tools/manifest.py` (nuevo):** escribe `web/public/models/manifest.json`.
- **`A3D_WEB_MODELS`** en `anato3d_fit.py`, `build_genital_skin.py`, `build_female_skin.py`, `fix_neck.py` y `search_index.py`. Sin la variable, escriben donde siempre.
- **`web/scripts/check-cards.mjs`:** opción `--models <carpeta>`.
- **`tools/tests/test_build.sh` y `tools/tests/fake_blender.zsh` (nuevos).**
- **Documentación:** `docs/construccion.md` (herramientas, fuentes fuera de git con sus SHA-256, pasos, garantías, vuelta atrás y límites) y README.

## 4. Archivos

`tools/build_all.sh` · `tools/build_lib.sh` · `tools/validate_models.py` · `tools/manifest.py` · `tools/tests/test_build.sh` · `tools/tests/fake_blender.zsh` · `tools/anato3d_fit.py` · `tools/build_genital_skin.py` · `tools/build_female_skin.py` · `tools/fix_neck.py` · `tools/search_index.py` · `web/scripts/check-cards.mjs` · `docs/construccion.md` · `README.md`

## 5. Pruebas y medidas realizadas

`zsh tools/tests/test_build.sh --real`: **22 de 22 correctas** (2026-11-02, 1 min).

1. **Blender real:**
   - sin `--python-exit-code`, un script con `raise RuntimeError` termina con **0** (el fallo de antes);
   - con la opción, termina con error;
   - un script correcto termina con 0.
2. **`validate_models.py`:**
   - acepta los 49 archivos publicados;
   - rechaza: HTML en lugar de GLB, GLB cortado a 20 KB, GLB al que le faltan el 10 % de las piezas, JSON roto y metadatos sin `groups`;
   - acepta la pérdida de piezas con `A3D_ALLOW_SHRINK=1`.
3. **`build_all.sh vascular` con el Blender falso**, publicando en una copia (`A3D_PUBLISHED`):
   - **excepción:** error, nada publicado;
   - **termina «bien» sin escribir nada:** error, nada publicado;
   - **exportación con GLB roto:** error («no empieza por glTF»), nada publicado y mensaje claro;
   - **salidas válidas e idénticas:** termina bien y solo cambia el manifiesto.
4. **Construcción real** del sistema vascular masculino (Blender 5.4.0 alfa), publicando en una copia:
   - termina bien;
   - `male-arterial.glb`, `male-venous.glb`, sus metadatos y el índice salen **idénticos byte a byte** a los publicados;
   - solo cambia el manifiesto.
5. **`web/public/models` no cambió durante ninguna prueba** (sumas antes y después).

**No probado:**
- la construcción completa de todos los sistemas con la nueva versión del script (solo vascular);
- el objetivo `base`;
- el modelo femenino con el script nuevo;
- un clon limpio;
- otro equipo.

## 6. Limitaciones

- `validate_models.py` no decodifica Draco ni valida la anatomía: comprueba la estructura y los cambios en las piezas.
- La auditoría geométrica sigue fuera de la construcción. El manifiesto anota la más reciente y avisa de que puede no corresponder.
- **Fuentes de Z-Anatomy:** no quedó registrada la URL exacta ni la fecha de su descarga. Quedan sus SHA-256 y la copia en las copias de seguridad locales.
- Blender es una versión **alfa** y la ruta de macOS sigue siendo la predeterminada.
- No hay integración continua.
- Este hito no toca contenido anatómico: no requiere revisión de un especialista.

## 7. Siguiente mejora más pequeña y útil

1. Corregir la errata del pipeline («músculocutáneo», «músculofrénica/as»): regla de `ES_FIXES` con final de palabra y `zsh tools/build_all.sh vascular nervous`. Es la primera construcción real que publicará con el sistema nuevo. Luego, `check-cards` con una lista de erratas conocidas.
2. Después, el hito 2: esquema de contenido y fichas del módulo del brazo.
