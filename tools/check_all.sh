#!/bin/zsh
# Comprueba un modelo entero después de reconstruirlo y dice si algo empeoró respecto a la referencia guardada.
# Uso (desde la raíz del proyecto): zsh tools/check_all.sh [male|female] [--referencia]
#   Sin modelo: male. Tarda unos 2 minutos por modelo.
#   --referencia: además guarda el estado actual como la nueva referencia (tools/checks/referencia/<modelo>.json), después de
#   revisar a mano un cambio intencionado. Hay que hacer commit de la referencia.
#
# Pasos (lo que se mide es lo último construido en build/, junto a la Fase 2):
#   1. tools/audit_models.py: piezas fuera de la piel, dentro del hueso, choques entre órganos, mallas y nombres
#      (escribe build/audit.json o build/female_audit.json);
#   2. tools/checks/simetria_picos.py: simetría izquierda/derecha y aristas disparadas (build/checks/);
#   3. check-cards: las fichas de todas las piezas publicadas del modelo;
#   4. tools/checks/comparar.py: resumen pequeño y comparación con la referencia; informe en build/checks/<modelo>_informe.md.
# Termina con error si algo empeora o si falla un paso. Registro completo: build/checks/<modelo>_<fecha>.log.
#
# Por qué: los arreglos de Anato3D se meten unos en otros (piezas de Z-Anatomy dentro de la piel de MakeHuman) y casi
# nada se ve abriendo la app; en la revisión de errores del 2026-11-01 un arreglo del cuello metió nodos linfáticos en
# el paladar. Estas herramientas estaban en una carpeta temporal; se recuperaron el 2026-11-08.
set -euo pipefail
cd "$(dirname "$0")/.."
M=${1:-male}
[[ $M == male || $M == female ]] || { print -u2 "uso: zsh tools/check_all.sh [male|female] [--referencia]"; exit 2; }
REF=${2:-}
source tools/build_lib.sh
[[ -x $BLENDER ]] || { print -u2 "✗ no se encuentra Blender en $BLENDER (A3D_BLENDER=/ruta/al/Blender)"; exit 2; }
check_blender || exit 2
F2=Anato3D_Male_30_Fase2.blend
[[ $M == female ]] && F2=Anato3D_Female_30_Fase2.blend
mkdir -p build/checks
LOG=build/checks/${M}_$(date +%Y%m%d-%H%M%S).log
print "Anato3D · comprobación de $M · $(blender_version) · commit $(git rev-parse --short HEAD)$([[ -n $(git status --porcelain) ]] && print ' (con cambios sin commit)')"

blender_step() {
  local name=$1 code=0
  shift
  print "· $name…"
  A3D_MODEL=$M "$BLENDER" -b --disable-autoexec --python-exit-code 1 $F2 --python "$@" >> $LOG 2>&1 || code=$?
  if (( code )); then
    print -u2 "✗ $name: Blender terminó con código $code. Final del registro ($LOG):"
    grep -n -E 'Traceback|Error|error:|File "' $LOG | tail -n 12 >&2 || tail -n 12 $LOG >&2
    exit 1
  fi
}
blender_step auditoría tools/audit_models.py
grep -E '^\[audit\] == (Choques|Roces|Salen de la piel y se ven)' $LOG | sed 's/^\[audit\] /  /' || true
blender_step 'simetría y picos' tools/checks/simetria_picos.py
grep -E '^\[simetria\] (picos|simetría):' $LOG | sed 's/^\[simetria\] /  /' || true

print "· fichas…"
cards=$(node web/scripts/check-cards.mjs --model $M 2>&1) || { print -u2 -- "$cards"; print -u2 "✗ check-cards"; exit 1; }
print -- "$cards" >> $LOG
print -- "  ${${(f)cards}[-1]}"

print "· comparación con la referencia…"
python3 tools/checks/comparar.py $M $REF
