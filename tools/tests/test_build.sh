#!/bin/zsh
# Pruebas de que la construcción falla de verdad y no publica nada roto.
# Uso (desde la raíz del proyecto): zsh tools/tests/test_build.sh [--real]
#   --real: además, una construcción real del sistema vascular masculino (1–2 min) publicando en una copia.
# Nunca toca web/public/models: publica en una copia (A3D_PUBLISHED) y al final comprueba que el real no cambió.
set -uo pipefail
cd "$(dirname "$0")/../.."
REAL=${1:-}
pass=0 fails=0
ok() { print "  ✓ $1"; (( pass += 1 )); }
ko() { print "  ✗ $1"; (( fails += 1 )); }
expect_fail() { if (( $1 )); then ok "$2"; else ko "$2 (terminó bien y debía fallar)"; fi; }
expect_ok() { if (( $1 == 0 )); then ok "$2"; else ko "$2 (código $1)"; fi; }
sums() { (cd $1 && shasum -a 256 *(.)) }

T=build/tests/$(date +%Y%m%d-%H%M%S)
PUB=$T/published
mkdir -p $PUB
cp -c -p web/public/models/*(.) $PUB/ 2>/dev/null || cp -p web/public/models/*(.) $PUB/
REAL_BEFORE=$(sums web/public/models)
PUB_BEFORE=$(sums $PUB)

print '1. Blender real: código de salida de los scripts'
M=male ALL=prueba
source tools/build_lib.sh
print 'raise RuntimeError("fallo intencionado")' > $T/falla.py
print 'print("bien")' > $T/bien.py
"$BLENDER" -b --disable-autoexec --python $T/falla.py > $T/sin_exit_code.log 2>&1; old=$?
if (( old == 0 )); then ok "sin --python-exit-code, Blender termina con 0 aunque el script falle (el fallo de antes)"; else ok "sin --python-exit-code, Blender terminó con $old"; fi
run_blender prueba_falla --python $T/falla.py 2>/dev/null; expect_fail $? 'con --python-exit-code, una excepción da error'
run_blender prueba_bien --python $T/bien.py > /dev/null; expect_ok $? 'un script correcto termina bien'

print '2. validate_models.py'
V=$T/validar; mkdir -p $V; cp -p $PUB/*(.) $V/
check() { python3 tools/validate_models.py $V $PUB $1 > $T/validar.log 2>&1; }
check male-endocrine.glb; expect_ok $? 'acepta un GLB publicado'
print '<!doctype html>' > $V/male-endocrine.glb; check male-endocrine.glb; expect_fail $? 'rechaza HTML en lugar de GLB'
head -c 20000 $PUB/male-endocrine.glb > $V/male-endocrine.glb; check male-endocrine.glb; expect_fail $? 'rechaza un GLB cortado'
python3 - $PUB/male-arterial.glb $V/male-arterial.glb 0.1 <<'PY'
# Copia de un GLB quitando extras.system a una fracción de las piezas (simula piezas perdidas).
import json, struct, sys
src, dst, frac = sys.argv[1], sys.argv[2], float(sys.argv[3])
d = open(src, 'rb').read()
jlen = struct.unpack('<I', d[12:16])[0]
doc = json.loads(d[20:20 + jlen]); rest = d[20 + jlen:]
parts = [n for n in doc['nodes'] if (n.get('extras') or {}).get('system')]
for n in parts[:int(len(parts) * frac) or len(parts)]:
    n['extras'].pop('system')
j = json.dumps(doc).encode(); j += b' ' * (-len(j) % 4)
open(dst, 'wb').write(struct.pack('<III', 0x46546C67, 2, 20 + len(j) + len(rest)) + struct.pack('<II', len(j), 0x4E4F534A) + j + rest)
PY
check male-arterial.glb; expect_fail $? 'rechaza un GLB que pierde el 10 % de sus piezas'
A3D_ALLOW_SHRINK=1 check male-arterial.glb; expect_ok $? 'lo acepta con A3D_ALLOW_SHRINK=1 (cambio intencionado)'
print '{"groups":' > $V/male-endocrine.json; check male-endocrine.json; expect_fail $? 'rechaza un JSON roto'
print '{}' > $V/male-endocrine.json; check male-endocrine.json; expect_fail $? 'rechaza metadatos sin «groups»'

print '3. build_all.sh con un Blender falso, publicando en una copia'
run_build() {
  A3D_BLENDER=$PWD/tools/tests/fake_blender.zsh FAKE_BLENDER_MODE=$1 A3D_PUBLISHED=$PUB zsh tools/build_all.sh vascular > $T/build_$1.log 2>&1
}
for mode desc in crash 'Blender falla (excepción)' silent 'Blender «termina bien» sin escribir nada' corrupt 'la exportación deja un GLB roto'; do
  run_build $mode; code=$?
  expect_fail $code "$desc: build_all termina con error"
  [[ $(sums $PUB) == $PUB_BEFORE ]] && ok "$desc: no se publicó nada" || ko "$desc: ¡cambió la carpeta publicada!"
done
grep -q 'no ha cambiado' $T/build_corrupt.log && ok 'el mensaje dice que no se publicó nada' || ko 'falta el mensaje de fallo'
run_build copy; expect_ok $? 'con salidas válidas e idénticas, build_all termina bien'
changed=$(diff <(print -- "$PUB_BEFORE" | grep -v manifest.json) <(sums $PUB | grep -v manifest.json))
[[ -z $changed ]] && ok 'solo cambia el manifiesto (los modelos eran idénticos)' || ko "cambiaron modelos: $changed"
[[ -f $PUB/manifest.json ]] && python3 -c "import json,sys; m=json.load(open(sys.argv[1])); assert m['files'] and m['builds']['male']['systems']==['vascular']" $PUB/manifest.json \
  && ok 'manifiesto con hashes de los archivos y la construcción' || ko 'manifiesto incompleto'

if [[ $REAL == --real ]]; then
  print '4. Construcción real (vascular masculino), publicando en una copia'
  PUB2=$T/published_real; mkdir -p $PUB2; cp -p $PUB/*(.) $PUB2/; rm -f $PUB2/manifest.json
  BEFORE2=$(sums $PUB2)
  A3D_PUBLISHED=$PUB2 zsh tools/build_all.sh vascular > $T/build_real.log 2>&1; expect_ok $? 'build_all vascular con Blender real'
  print -- "$(diff <(print -- "$BEFORE2") <(sums $PUB2) | grep '^>' | sed 's/^> [0-9a-f]* */      cambia: /')"
fi

[[ $(sums web/public/models) == $REAL_BEFORE ]] && ok 'web/public/models no cambió en ninguna prueba' || ko '¡web/public/models cambió!'
print "\n$pass correctas, $fails fallidas (registros en $T)"
(( fails == 0 ))
