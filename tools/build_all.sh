#!/bin/zsh
# Regenera todos los sistemas a partir de Z-Anatomy y de la Fase 2 actual, y los exporta a web/public/models.
# Uso (desde la raíz del proyecto): zsh tools/build_all.sh [sistemas...]   (por defecto, todos)
# Modelo femenino: A3D_MODEL=female zsh tools/build_all.sh   (por defecto, el masculino)
set -e
cd "$(dirname "$0")/.."
mkdir -p build                     # no está en git: en una copia recién clonada o restaurada no existe
B=/Applications/Blender.app/Contents/MacOS/Blender
Z=sources/z-anatomy/extracted/Z-Anatomy/Startup.blend
M=${A3D_MODEL:-male}
export A3D_MODEL=$M
FILTER='^\[|Error|Traceback|File "|line '
# Registros: build/build_<sistema>.log (masculino) o build/build_female_<sistema>.log.
log() { [[ $M == male ]] && echo build/build_$1.log || echo build/build_${M}_$1.log; }
export_glb() { $B -b --disable-autoexec --python tools/export_glb.py -- build/${M}_$1.blend $2 web/public/models/${M}-$1.glb 2>&1 | grep -E "exportado|Error|Traceback"; }
want() { [[ " $ALL " == *" $1 "* ]]; }
ALL="${*:-muscular connective vascular nervous visceral}"

if want muscular; then
  $B -b --disable-autoexec $Z --python tools/build_muscular.py 2>&1 | grep --line-buffered -E "$FILTER" > $(log muscular)
  export_glb muscular Muscular_System
fi
if want connective; then
  $B -b --disable-autoexec $Z --python tools/build_connective.py 2>&1 | grep --line-buffered -E "$FILTER" > $(log connective)
  export_glb connective Connective_System
fi
if want vascular; then
  $B -b --disable-autoexec $Z --python tools/build_vascular.py 2>&1 | grep --line-buffered -E "$FILTER" > $(log vascular)
  export_glb arterial Arterial_System; export_glb venous Venous_System
fi
if want nervous; then
  $B -b --disable-autoexec $Z --python tools/build_nervous.py 2>&1 | grep --line-buffered -E "$FILTER" > $(log nervous)
  export_glb nervous Nervous_System
fi
if want visceral; then
  $B -b --disable-autoexec $Z --python tools/build_visceral.py 2>&1 | grep --line-buffered -E "$FILTER" > $(log visceral)
  export_glb respiratory Respiratory_System; export_glb digestive Digestive_System
  export_glb urogenital Urogenital_System; export_glb endocrine Endocrine_System; export_glb lymphatic Lymphatic_System
fi
# Piel de los genitales externos (y, en la mujer, las mamas): necesita urogenital, vascular y nervioso.
if want visceral || want genital; then
  if [[ $M == male ]]; then
    $B -b --disable-autoexec Anato3D_Male_30_Fase2.blend --python tools/build_genital_skin.py 2>&1 | grep -E "^\[genital\]|Error|Traceback" > build/build_genital_skin.log
  else
    $B -b --disable-autoexec Anato3D_Female_30_Fase2.blend --python tools/build_female_skin.py 2>&1 | grep -E "^\[|Error|Traceback" > $(log female_skin)
  fi
  export_glb integumentary Genital_Skin
fi
# Índice de búsqueda de los sistemas que la app descarga aparte.
python3 tools/search_index.py $M
echo "listo ($M): $ALL"
