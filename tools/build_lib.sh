# Funciones de tools/build_all.sh; también las usa tools/tests/test_build.sh.
# Se cargan con `source` desde la raíz del proyecto, con M (male | female) y ALL (sistemas pedidos) ya definidos.

# Blender: A3D_BLENDER o el de /Applications.
BLENDER=${A3D_BLENDER:-/Applications/Blender.app/Contents/MacOS/Blender}

blender_version() {
  "$BLENDER" --version 2>/dev/null | awk 'NR == 1 { v = $0 } /build hash/ { h = $3 } END { print v (h ? " (" h ")" : "") }'
}

# run_blender <paso> <argumentos de Blender…>: registro completo en build/logs/<modelo>_<paso>.log; devuelve el código de
# salida de Blender. Con --python-exit-code 1, una excepción en el script da 1: sin él, Blender terminaba con 0 y el
# fallo solo quedaba en el registro (y `grep … | …` sin pipefail lo daba por bueno).
run_blender() {
  local step=$1 code=0
  shift
  local full=build/logs/${M}_${step}.log
  mkdir -p build/logs
  print "· $step…"
  "$BLENDER" -b --disable-autoexec --python-exit-code 1 "$@" > "$full" 2>&1 || code=$?
  if (( code )); then
    print -u2 "✗ $step: Blender terminó con código $code. Final del registro ($full):"
    { grep -n -E 'Traceback|Error|error:|File "' "$full" | tail -n 12 } >&2 || tail -n 12 "$full" >&2
  fi
  return $code
}

# require_outputs <paso> <archivos…>: cada archivo existe, no está vacío y se escribió en esta ejecución (después de
# $STAMP). Así un paso que termina «bien» sin escribir nada, o que deja el archivo de una ejecución anterior, falla.
require_outputs() {
  local step=$1 f
  shift
  for f in "$@"; do
    [[ -s $f && $f -nt $STAMP ]] || { print -u2 "✗ $step: no escribió $f en esta ejecución"; return 1; }
  done
}

# Carpeta de preparación: los scripts escriben ahí los archivos de la web (A3D_WEB_MODELS) en lugar de en
# web/public/models. build/staging/<modelo>-<fecha>/{out, candidate, previous}.
stage_init() {
  STAGE=build/staging/${M}-$(date +%Y%m%d-%H%M%S)
  OUT=$STAGE/out
  mkdir -p $OUT
  STAMP=$STAGE/.inicio
  touch $STAMP
  sleep 1                                     # lo escrito después es más nuevo aunque el reloj vaya por segundos
  export A3D_WEB_MODELS=$PWD/$OUT
}

# publish: candidato = lo publicado + lo nuevo; índice de búsqueda sobre el candidato; validación de lo que cambia;
# check-cards de los dos modelos; manifiesto. Solo si todo pasa, copia los archivos que cambian: primero todos a
# temporales en web/public/models, luego los renombra (un renombrado no deja archivos a medias). Lo que había queda en
# $STAGE/previous para volver atrás.
publish() {
  local pub=${A3D_PUBLISHED:-web/public/models} cand=$STAGE/candidate f cards
  local -a changed moved
  changed=($OUT/*(N.:t))
  (( ${#changed} )) || { print -u2 "✗ ningún paso dejó archivos para la web"; return 1; }
  mkdir -p $cand $STAGE/previous
  cp -c -p $pub/*(.) $cand/ 2>/dev/null || cp -p $pub/*(.) $cand/
  cp -p $OUT/*(.) $cand/
  # Primero lo nuevo (un GLB roto daría un error confuso al generar el índice), luego el índice generado con ello.
  print "· validación de ${#changed} archivos nuevos"
  python3 tools/validate_models.py $cand $pub $changed || { print -u2 "✗ validación: no se publica nada"; return 1; }
  A3D_WEB_MODELS=$PWD/$cand python3 tools/search_index.py $M
  python3 tools/validate_models.py $cand $pub ${M}-index.json || { print -u2 "✗ índice de búsqueda: no se publica nada"; return 1; }
  changed+=(${M}-index.json)
  cards=$(node web/scripts/check-cards.mjs --models $cand 2>&1) || { print -u2 "$cards"; print -u2 "✗ check-cards: no se publica nada"; return 1; }
  print -- "$cards" | tail -n 3
  python3 tools/manifest.py $cand --model $M --systems "$ALL" --blender "$(blender_version)" \
    --checks "validate_models: ${#changed} archivos correctos; check-cards: ${${(f)cards}[-1]}"
  changed+=(manifest.json)
  for f in $changed; do
    [[ -f $pub/$f ]] && cmp -s $cand/$f $pub/$f && continue
    [[ -f $pub/$f ]] && cp -p $pub/$f $STAGE/previous/
    cp -p $cand/$f $pub/.$f.nuevo
    moved+=($f)
  done
  PUBLISHING=1
  for f in $moved; do mv -f $pub/.$f.nuevo $pub/$f; done
  PUBLISHING=0
  print "✓ publicados en $pub: ${moved[*]:-ninguno} (sin cambios: $(( ${#changed} - ${#moved} )))"
  rm -rf $cand
}
