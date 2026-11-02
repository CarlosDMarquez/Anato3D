#!/bin/zsh
# Regenera los sistemas a partir de Z-Anatomy y de la Fase 2 actual y, si todo pasa las comprobaciones, los publica en
# web/public/models.
# Uso (desde la raíz del proyecto): zsh tools/build_all.sh [sistemas...]   (por defecto: muscular connective vascular
#   nervous visceral; visceral incluye la piel genital)
#   genital: solo la piel genital (necesita urogenital, vascular y nervioso ya construidos en build/).
#   base: tools/fix_neck.py (male.glb y female.glb). No va por defecto: reescribe también las Fase 2 y los campos .npz.
# Modelo femenino: A3D_MODEL=female zsh tools/build_all.sh. Otro Blender: A3D_BLENDER=/ruta/al/Blender.
#
# Garantías (2026-11-02; antes, un error de Blender podía pasar por éxito: `set -e` sin pipefail, salida filtrada con
# grep y Blender terminando con 0 aunque el script fallara):
#   - Termina con error si falla cualquier paso: Blender con --python-exit-code 1, pipefail, y cada paso tiene que
#     dejar sus archivos escritos en esta ejecución.
#   - Nada se escribe en web/public/models hasta el final: los scripts escriben en build/staging/… (A3D_WEB_MODELS); se
#     arma un candidato (lo publicado más lo nuevo), se regenera el índice de búsqueda, se valida
#     (tools/validate_models.py y check-cards) y se escribe el manifiesto. Solo entonces se copian los archivos que
#     cambian; los anteriores quedan en build/staging/…/previous.
#   - Registros completos en build/logs/; el resumen filtrado sigue en build/build_<paso>.log.
# Pruebas de fallos: zsh tools/tests/test_build.sh.
set -euo pipefail
cd "$(dirname "$0")/.."
M=${A3D_MODEL:-male}
export A3D_MODEL=$M
ALL="${*:-muscular connective vascular nervous visceral}"
KNOWN=" muscular connective vascular nervous visceral genital base "
source tools/build_lib.sh

for s in ${=ALL}; do [[ $KNOWN == *" $s "* ]] || { print -u2 "✗ sistema desconocido: $s (válidos:$KNOWN)"; exit 2; }; done
[[ -x $BLENDER ]] || { print -u2 "✗ no se encuentra Blender en $BLENDER (A3D_BLENDER=/ruta/al/Blender)"; exit 2; }
Z=sources/z-anatomy/extracted/Z-Anatomy/Startup.blend
[[ -f $Z ]] || { print -u2 "✗ falta $Z: ver docs/construccion.md"; exit 2; }
F2=Anato3D_Male_30_Fase2.blend
[[ $M == female ]] && F2=Anato3D_Female_30_Fase2.blend
mkdir -p build
want() { [[ " $ALL " == *" $1 "* ]]; }

PUBLISHING=0 REPORTED=0
stage_init
# Aviso final si algo falla. ZERR y no EXIT: zsh no ejecuta la trampa EXIT cuando sale por `set -e`.
on_fail() {
  (( REPORTED )) && return 0
  REPORTED=1
  if (( PUBLISHING )); then
    print -u2 "✗ build_all ($M): la publicación quedó a medias. Para volver atrás: cp -p $STAGE/previous/* ${A3D_PUBLISHED:-web/public/models}/"
  else
    print -u2 "✗ build_all ($M) falló: ${A3D_PUBLISHED:-web/public/models} no ha cambiado. Registros en build/logs/; preparación en $STAGE"
  fi
}
trap on_fail ZERR
print "Anato3D · $M · $ALL · $(blender_version)"

FILTER='^\[|Error|Traceback|File "|line '
summary() { [[ $M == male ]] && print build/build_$1.log || print build/build_${M}_$1.log; }
# build <paso> <blend> <script>: construye con Blender y deja el resumen filtrado de siempre.
build() {
  run_blender $1 $2 --python $3
  grep -E "$FILTER" build/logs/${M}_$1.log > $(summary $1) || true
}
# export_glb <sistema> <colección>: build/<modelo>_<sistema>.blend → GLB en la preparación.
export_glb() {
  run_blender export_$1 --python tools/export_glb.py -- build/${M}_$1.blend $2 $OUT/${M}-$1.glb
  require_outputs "exportar $1" $OUT/${M}-$1.glb
}

if want base; then
  run_blender base --python tools/fix_neck.py
  require_outputs base $OUT/male.glb $OUT/female.glb
fi
if want muscular; then
  build muscular $Z tools/build_muscular.py
  require_outputs muscular build/${M}_muscular.blend $OUT/${M}-muscular.json
  export_glb muscular Muscular_System
fi
if want connective; then
  build connective $Z tools/build_connective.py
  require_outputs connective build/${M}_connective.blend $OUT/${M}-connective.json
  export_glb connective Connective_System
fi
if want vascular; then
  build vascular $Z tools/build_vascular.py
  require_outputs vascular build/${M}_{arterial,venous}.blend $OUT/${M}-{arterial,venous}.json
  export_glb arterial Arterial_System; export_glb venous Venous_System
fi
if want nervous; then
  build nervous $Z tools/build_nervous.py
  require_outputs nervous build/${M}_nervous.blend $OUT/${M}-nervous.json
  export_glb nervous Nervous_System
fi
if want visceral; then
  build visceral $Z tools/build_visceral.py
  require_outputs visceral build/${M}_{respiratory,digestive,urogenital,endocrine,lymphatic}.blend \
    $OUT/${M}-{respiratory,digestive,urogenital,endocrine,lymphatic}.json
  export_glb respiratory Respiratory_System; export_glb digestive Digestive_System
  export_glb urogenital Urogenital_System; export_glb endocrine Endocrine_System; export_glb lymphatic Lymphatic_System
fi
# Piel de los genitales externos (y, en la mujer, las mamas): necesita urogenital, vascular y nervioso.
if want visceral || want genital; then
  if [[ $M == male ]]; then
    run_blender genital_skin $F2 --python tools/build_genital_skin.py
    grep -E '^\[genital\]|Error|Traceback' build/logs/${M}_genital_skin.log > build/build_genital_skin.log || true
    require_outputs genital_skin build/male_integumentary.blend $OUT/male-genital-region.json $OUT/male-integumentary.json
  else
    build female_skin $F2 tools/build_female_skin.py
    require_outputs female_skin build/female_integumentary.blend $OUT/female-integumentary.json
  fi
  export_glb integumentary Genital_Skin
fi

publish
print "listo ($M): $ALL"
