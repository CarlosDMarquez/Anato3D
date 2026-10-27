#!/bin/zsh
# Regenera todos los sistemas a partir de Z-Anatomy y de la Fase 2 actual, y los exporta a web/public/models.
# Uso (desde la raíz del proyecto): zsh tools/build_all.sh [sistemas...]   (por defecto, todos)
set -e
cd "$(dirname "$0")/.."
B=/Applications/Blender.app/Contents/MacOS/Blender
Z=sources/z-anatomy/extracted/Z-Anatomy/Startup.blend
FILTER='^\[|Error|Traceback|File "|line '
export_glb() { $B -b --disable-autoexec --python tools/export_glb.py -- build/male_$1.blend $2 web/public/models/male-$1.glb 2>&1 | grep -E "exportado|Error|Traceback"; }
want() { [[ " $ALL " == *" $1 "* ]]; }
ALL="${*:-muscular connective vascular nervous visceral}"

if want muscular; then
  $B -b --disable-autoexec $Z --python tools/build_muscular.py 2>&1 | grep --line-buffered -E "$FILTER" > build/build_muscular.log
  export_glb muscular Muscular_System
fi
if want connective; then
  $B -b --disable-autoexec $Z --python tools/build_connective.py 2>&1 | grep --line-buffered -E "$FILTER" > build/build_connective.log
  export_glb connective Connective_System
fi
if want vascular; then
  $B -b --disable-autoexec $Z --python tools/build_vascular.py 2>&1 | grep --line-buffered -E "$FILTER" > build/build_vascular.log
  export_glb arterial Arterial_System; export_glb venous Venous_System
fi
if want nervous; then
  $B -b --disable-autoexec $Z --python tools/build_nervous.py 2>&1 | grep --line-buffered -E "$FILTER" > build/build_nervous.log
  export_glb nervous Nervous_System
fi
if want visceral; then
  $B -b --disable-autoexec $Z --python tools/build_visceral.py 2>&1 | grep --line-buffered -E "$FILTER" > build/build_visceral.log
  export_glb respiratory Respiratory_System; export_glb digestive Digestive_System
  export_glb urogenital Urogenital_System; export_glb endocrine Endocrine_System; export_glb lymphatic Lymphatic_System
fi
# Piel de los genitales externos: envuelve el pene, el escroto y sus vasos (necesita urogenital, vascular y nervioso).
if want visceral || want genital; then
  $B -b --disable-autoexec Anato3D_Male_30_Fase2.blend --python tools/build_genital_skin.py 2>&1 | grep -E "^\[genital\]|Error|Traceback" > build/build_genital_skin.log
  export_glb integumentary Genital_Skin
fi
echo "listo: $ALL"
