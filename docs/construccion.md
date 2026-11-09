# Construir los modelos desde una copia nueva

Cómo regenerar los modelos de la web desde una copia recién clonada del repositorio, qué hace falta que no está en git y cómo se comprueba que el resultado es correcto antes de publicarlo. Estado al 2026-11-02.

## 1. Herramientas

| Herramienta | Versión usada | Para qué |
|---|---|---|
| macOS | Darwin 25.5, Apple Silicon | Es la única plataforma probada. `build_all.sh` usa zsh y `cp -c` (clonación de APFS, con alternativa a `cp`). |
| Blender | **5.4.0 Alpha, build hash `c31386f6fc84`** (2026-10-12) | Todos los scripts de `tools/` salvo los de Python puro. Es una versión alfa: con otra, el resultado puede cambiar. La copia de seguridad guarda el instalador (`~/Copias de seguridad/Anato3D/blender/`). Otra ruta: `A3D_BLENDER=/ruta/al/Blender`. Desde el 2026-11-08, `build_all.sh` y `check_all.sh` se niegan a usar otra compilación que la de `tools/blender_esperado.txt` (`A3D_BLENDER_DISTINTO=1` para probar otra a propósito). |
| Python 3 | 3.14.2 (del sistema; sin paquetes extra) | `search_index.py`, `validate_models.py`, `manifest.py`. |
| Node.js | 26.12.1 | `check-cards`, pruebas de la web, Vite. |
| npm | — | `npm --prefix web install` (three 0.186.1, Vite 8.3.5). |

## 2. Lo que no está en git

| Ruta | Tamaño | Qué es | Cómo se obtiene |
|---|---|---|---|
| `sources/z-anatomy/` | 391 MB | Z-Anatomy (`Z-Anatomy.zip` y `extracted/Z-Anatomy/Startup.blend`), su traducción (`translations.csv`), TA2 (`TA2.csv`) y definiciones (`definitions_en.json`) | Proyecto Z-Anatomy, <https://github.com/Z-Anatomy/Models-of-human-anatomy> (CC BY-SA 4.0, basado en BodyParts3D). **No quedó registrada la URL exacta de cada descarga ni su fecha**: la referencia fiable son las sumas de abajo. Hay copia en `sources.tar` de cada copia de seguridad local. |
| `sources/originals/` | 78 MB | Modelos de la fase 1 y 2 antes de corregir el cuello | Solo en las copias de seguridad (`sources.tar`). |
| `build/` | — | Intermedios (`male_muscular.blend`…), registros, preparación | Se regenera. |
| `web/node_modules/` | — | Dependencias de la web | `npm --prefix web install`. |

**SHA-256 de las fuentes** (2026-11-02). El manifiesto de cada construcción vuelve a calcular las de Z-Anatomy y las de la Fase 2.

```text
e029688545627bd0214b269e1063143abb580aad72b2c2445d6d8a9a0d9da736  sources/z-anatomy/Z-Anatomy.zip
9f08a17ea0115fed80b2a73ecdf0a1bc2ab2f6956f37c593ce23d513ea35afcd  sources/z-anatomy/extracted/Z-Anatomy/Startup.blend
a9216ae28e4abd2c7896e1a72caff7c9f361e7e9646ea9917b098cb5caf6aa24  sources/z-anatomy/translations.csv
0f9092a328b27dcd15d696d9f9a4087deb229a1aad21b75876657622de835974  sources/z-anatomy/TA2.csv
6ae4927d488b410e6d7e785eaa32e06678f8845a01cb996a1f5af630ca45b7e0  sources/z-anatomy/definitions_en.json
001f4e3e8734dec495e37c654bcbc0c23c405f1e5f81e4cc065a3e76b63e4225  sources/originals/Anato3D_Female_30_Fase1.blend
6167d1ea260c05e0289e614c48e2003af4c8be0bb88c7a3c35303c2ae396312a  sources/originals/Anato3D_Female_30_Fase1.glb
e196066c9b42df8374c2dd3c07fbc4094313b1994228ca490a22b22c317371fe  sources/originals/Anato3D_Male_30_Fase2.blend
4de1f066973b4d42c4abe62e4e2940d262a9af410763a3e064092a8045ff0335  sources/originals/Anato3D_Male_30_Fase2_draco.glb
```

Comprobar una copia: `shasum -a 256 -c` con estas líneas.

## 3. Pasos

```bash
git clone <repositorio> Anato3D && cd Anato3D        # o: git clone anato3d.bundle Anato3D (copia de seguridad)
tar -xf <copia>/sources.tar                          # sources/ (comprobar las sumas de arriba)
npm --prefix web install
zsh tools/build_all.sh                               # modelo masculino: los 11 sistemas y la piel genital
A3D_MODEL=female zsh tools/build_all.sh              # modelo femenino
zsh tools/check_all.sh male && zsh tools/check_all.sh female  # nada empeora respecto a la referencia guardada
zsh tools/tests/test_build.sh                        # pruebas de fallos de la construcción (no toca web/public/models)
python3 tools/tests/test_comparar.py                 # pruebas de la comparación con la referencia
npm --prefix web test && npm --prefix web run check  # pruebas de la carga y revisión de las fichas
npm --prefix web run build                           # web de producción en web/dist
```

- **`base`** (`zsh tools/build_all.sh base`) vuelve a ejecutar `tools/fix_neck.py`: regenera `male.glb` y `female.glb` y también reescribe las Fase 2 (`Anato3D_*_30_Fase2.blend`) y los campos `.npz` que están en git. No va por defecto. Después hay que reconstruir los sistemas de los dos modelos.
  - Desde el 2026-11-07 incluye `tools/huesos_invertidos.py` (las 111 piezas del esqueleto que estaban del revés, con su AO copiado de la pareja derecha o rehorneado). Tarda unos 4 minutos en lugar de 1, por los horneados de Cycles, y es determinista: dos ejecuciones dan las mismas cifras.
  - Desde el 2026-11-08 incluye `tools/piel_musculos.py` (paso 3c4): la piel masculina del cuello, el tronco y el miembro superior se ajusta a los músculos de Z-Anatomy, colocados como en `build_muscular.py`, con un grosor realista por zona y nunca a menos de 3 mm, salvo en los pliegues donde el brazo toca el tronco. Ningún músculo ni hueso de esas zonas queda a la vista. Añade aproximadamente minuto y medio. La piel cambia, así que **después hay que reconstruir todos los sistemas masculinos**: los músculos ya no se aplastan contra ella.
    - La cabeza, las manos, el periné, el miembro inferior y el bajo vientre junto al periné quedan exactamente donde estaban. De esa piel sale la piel genital, que así no cambia.
    - La piel femenina sale idéntica, también en el color: su tono toma los pliegues y relieves de la piel masculina de antes de este paso.
  - Al reconstruir un sistema con la Fase 2 nueva, algunas piezas junto a aristas de hueso pueden moverse hasta ~1,4 mm. El ajuste las aparta del hueso con la cara más cercana, y en las aristas la que gana depende del orden de las caras. Probado con el vascular femenino: 21 de 672 piezas, sin cambios en la auditoría (ninguna dentro del hueso, lo mismo fuera de la piel). Los sistemas publicados se hicieron con la Fase 2 anterior y no se reconstruyeron.
- **Tiempos** en este Mac: vascular unos 40 s; nervioso unos 2,5 min; visceral unos 7 min. Los dos modelos completos, unos 26 min (medido el 2026-11-01).
- **`ligera`** (`zsh tools/build_all.sh ligera`): los modelos base de las pantallas táctiles, `male.ligero.glb` y `female.ligero.glb` (`tools/base_ligera.py`: las mismas mallas con las texturas grandes a la mitad). Salen de los publicados; con `base` se hacen también, de los nuevos. Unos 10 s.
- **Orden** (desde el 2026-11-07): muscular, conectivo, visceral, vascular y nervioso. El vascular femenino traza los vasos ováricos y uterinos sobre los órganos que deja el visceral (`build/female_pelvic_organs.npz` y `build/female_urogenital.blend`, ver `tools/female_vessels.py`). Por eso `A3D_MODEL=female zsh tools/build_all.sh vascular` necesita el visceral femenino construido antes al menos una vez; si falta, el paso falla con un mensaje que lo dice.

## 4. Qué garantiza `build_all.sh`

1. **Falla si falla un paso.**
   - Blender se ejecuta con `--python-exit-code 1`: una excepción del script da código 1. Sin esa opción, Blender termina con 0. Lo comprueba la prueba 1 de `test_build.sh`.
   - Se usa `set -euo pipefail`.
   - Cada paso tiene que dejar sus archivos, escritos en esta ejecución (`require_outputs`).
2. **No escribe en `web/public/models` hasta el final.**
   - Los scripts escriben en `build/staging/<modelo>-<fecha>/out` (variable `A3D_WEB_MODELS`).
   - Se arma un candidato: lo publicado más lo nuevo.
   - Se validan los archivos nuevos (`tools/validate_models.py`).
   - Se regenera y valida el índice de búsqueda.
   - Se revisan las fichas del modelo construido (`check-cards --models … --model …`; con `base`, las de los dos), incluidas las erratas conocidas del pipeline.
   - Se escribe el manifiesto.
3. **Publica solo lo que cambia.** Primero copia todo a temporales en la misma carpeta y después los renombra. Lo que había queda en `build/staging/…/previous`.
4. **Deja constancia.** El registro completo de cada paso queda en `build/logs/<modelo>_<paso>.log` y el resumen filtrado, en `build/build_<paso>.log`.

5. **Comprueba la versión de Blender** (desde el 2026-11-08): con otra compilación que la de `tools/blender_esperado.txt`, no construye.

Después de construir, `zsh tools/check_all.sh <modelo>` dice si algo empeoró respecto a la referencia guardada (auditoría, simetría, picos y fichas; ver el README, «Comprobación de los modelos»).

**Volver atrás:** `cp -p build/staging/<carpeta>/previous/* web/public/models/`, o `git checkout -- web/public/models`.

**Cambios intencionados que quitan piezas:** `validate_models.py` rechaza que desaparezca más del 5 % de las piezas de un archivo. Si es a propósito: `A3D_ALLOW_SHRINK=1 zsh tools/build_all.sh …`.

**Limpieza:** `build/staging/` y `build/tests/` se pueden borrar sin riesgo.

## 5. Manifiesto (`web/public/models/manifest.json`)

- **Versión** (`release`): fecha y commit.
- **Archivos:** bytes y SHA-256 de cada archivo publicado. Un archivo es de esta versión solo si su suma coincide.
- **Por modelo, la última construcción:**
  - sistemas;
  - commit y cambios sin guardar en `tools/`, `web/src` y `web/scripts`;
  - versiones de Blender, Python y Node;
  - sumas de las fuentes y de las Fase 2;
  - resultado de las comprobaciones.
- **Auditoría:** la más reciente de `build/`, con la advertencia de que no se ejecuta en cada construcción.

Aún no lo lee la app. Para publicar habrá que comprobar que el manifiesto coincide con lo que se despliega (hito de publicación).

## 6. Límites conocidos

- **`validate_models.py`:**
  - no decodifica la geometría Draco, que la decodifica la app al cargar;
  - comprueba estructura, piezas y cambios frente a lo publicado, no la anatomía.
- **Auditoría geométrica:** `tools/audit_models.py` no forma parte de la construcción, y sus resultados no llevan el hash de los modelos que miden. Desde el 2026-11-08 solo mide los vértices de alguna cara: los sueltos no se dibujan ni se exportan. En el hombre hay 460, repartidos en 62 piezas heredadas de Z-Anatomy.
- **Piel masculina donde el brazo toca el tronco:** el brazo cuelga pegado al costado y allí la piel del brazo y la del tronco se cortan. Ya pasaba en la piel de MakeHuman. No se ve desde fuera y no confunde las pruebas de dentro y fuera (detalle en `tools/piel_musculos.py`).
- **Plataforma y CI:** solo probado en este Mac y no hay integración continua.
- **Reproducibilidad (2026-11-02):**
  - el sistema vascular masculino se reconstruyó y salió **idéntico byte a byte** al publicado;
  - al republicar vascular y nervioso de los dos modelos para corregir tres nombres, solo cambiaron esos nombres, **salvo la cámara anterior del ojo** del nervioso masculino: 1.751 → 1.753 y 1.754 vértices. Ese paso no es del todo determinista en esas dos mallas; el femenino salió idéntico;
  - comprobado de nuevo el 2026-11-08, tras reconstruir los 12 sistemas: dos construcciones seguidas del nervioso masculino salieron **idénticas** (580 mallas, ninguna con vértices distintos). La variación de la cámara anterior no se repitió;
  - no se ha comprobado con todos los sistemas ni en otro equipo.
