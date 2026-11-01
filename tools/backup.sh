#!/bin/zsh
# Copia de seguridad del proyecto en este Mac, fuera de la carpeta del proyecto.
# Uso (desde cualquier carpeta): zsh tools/backup.sh
# Destino: ~/Copias de seguridad/Anato3D/AAAA-MM-DD_HHMM/ (otro destino: A3D_BACKUP_DIR=/ruta zsh tools/backup.sh).
#
# Guarda lo que no se puede regenerar:
#   - anato3d.bundle: todo el historial de git (todas las ramas y commits) en un solo archivo;
#   - sources.tar: sources/, que no está en git (los modelos originales de los que parte fix_neck.py y Z-Anatomy);
#   - una sola vez por versión, Blender.app comprimido en ../blender/: los modelos se calibraron con esa compilación.
# No guarda build/, web/dist/ ni web/node_modules/: se regeneran (build_all.sh, npm run build, npm install).
# Cómo restaurar: RESTAURAR.md, dentro de cada copia. No borra copias anteriores: eso se decide a mano.
set -euo pipefail
ROOT=${0:A:h:h}
DEST=${A3D_BACKUP_DIR:-$HOME/Copias de seguridad/Anato3D}
OUT="$DEST/$(date +%Y-%m-%d_%H%M)"
B=/Applications/Blender.app
mkdir -p "$OUT"
cd "$ROOT"

if [[ -n $(git status --porcelain) ]]; then
  echo "Aviso: hay cambios sin commit. La copia de git solo incluye lo guardado en commits."
fi
echo "historial de git…"
git bundle create "$OUT/anato3d.bundle" --all
git bundle verify -q "$OUT/anato3d.bundle"
echo "sources/…"
tar -cf "$OUT/sources.tar" sources

# Blender: un archivo por compilación (nombre con versión y hash), compartido por todas las copias.
if [[ -d $B ]]; then
  ver=$($B/Contents/MacOS/Blender --version 2>/dev/null | awk '/^Blender /{v=$2"-"$3} /build hash:/{h=$3} END{print v"_"h}')
  zip="$DEST/blender/Blender_$ver.zip"
  if [[ ! -e $zip ]]; then
    echo "Blender ($ver), solo la primera vez…"
    mkdir -p "$DEST/blender"
    ditto -c -k --keepParent "$B" "$zip"
  fi
else
  ver="no instalado"
fi

head=$(git rev-parse --short HEAD)
(cd "$OUT" && shasum -a 256 anato3d.bundle sources.tar > SHA256SUMS)
cat > "$OUT/RESTAURAR.md" <<EOF
# Copia de seguridad de Anato3D

- Fecha: $(date '+%Y-%m-%d %H:%M')
- Último commit: $head ($(git log -1 --format=%s))
- Blender usado: $ver (instalador en ../blender/)

## Restaurar

\`\`\`bash
shasum -a 256 -c SHA256SUMS
git clone anato3d.bundle Anato3D
tar -xf sources.tar -C Anato3D
cd Anato3D/web && npm install
\`\`\`

Después, los sistemas se regeneran con \`zsh tools/build_all.sh\` (y \`A3D_MODEL=female\` para el modelo femenino).
EOF
du -sh "$OUT" "$DEST"
echo "copia lista: $OUT"
