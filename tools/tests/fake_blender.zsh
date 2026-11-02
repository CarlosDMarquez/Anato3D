#!/bin/zsh
# Blender falso para tools/tests/test_build.sh: no abre Blender, simula sus resultados según FAKE_BLENDER_MODE:
#   crash   → código 1, como una excepción del script con --python-exit-code 1
#   silent  → código 0 sin escribir nada
#   corrupt → los pasos de construcción «escriben» sus salidas (cambian la fecha de los .blend de build/ y copian los .json publicados
#             a la preparación); la exportación escribe un GLB que no lo es
#   copy    → como corrupt, pero la exportación copia el GLB publicado (salida válida e idéntica)
# Los publicados se leen de A3D_PUBLISHED (o web/public/models).
if [[ ${1:-} == --version ]]; then print 'Blender falso (pruebas)'; exit 0; fi
mode=${FAKE_BLENDER_MODE:-crash}
[[ $mode == crash ]] && { print 'Traceback (most recent call last):'; print 'RuntimeError: fallo simulado'; exit 1; }
[[ $mode == silent ]] && exit 0
pub=${A3D_PUBLISHED:-web/public/models}
M=${A3D_MODEL:-male}
script='' rest=()
while (( $# )); do
  case $1 in
    --python) script=$2; shift 2 ;;
    --) shift; rest=("$@"); break ;;
    *) shift ;;
  esac
done
# Solo cambia la fecha de los .blend intermedios de build/ (no su contenido); si faltan, deja uno de relleno.
produce() { for s in "$@"; do if [[ -s build/${M}_$s.blend ]]; then touch build/${M}_$s.blend; else print relleno > build/${M}_$s.blend; fi; cp $pub/${M}-$s.json $A3D_WEB_MODELS/ 2>/dev/null || print '{"groups":{}}' > $A3D_WEB_MODELS/${M}-$s.json; done }
case ${script:t} in
  build_muscular.py) produce muscular ;;
  build_connective.py) produce connective ;;
  build_vascular.py) produce arterial venous ;;
  build_nervous.py) produce nervous ;;
  build_visceral.py) produce respiratory digestive urogenital endocrine lymphatic ;;
  build_genital_skin.py) produce integumentary; cp $pub/male-genital-region.json $A3D_WEB_MODELS/ ;;
  build_female_skin.py) produce integumentary ;;
  export_glb.py)
    out=${rest[3]}
    if [[ $mode == corrupt ]]; then print '<!doctype html><title>no es un GLB</title>' > $out
    else cp $pub/${out:t} $out; fi
    print "exportado $out" ;;
  *) print "script desconocido: $script"; exit 1 ;;
esac
exit 0
