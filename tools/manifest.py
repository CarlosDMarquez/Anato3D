"""Manifiesto de la versión de los modelos de la web (web/public/models/manifest.json). Lo escribe tools/build_all.sh
en el candidato, antes de publicarlo, para que modelos, metadatos, índices y manifiesto se publiquen juntos.

Registra:
  - de cada archivo de la carpeta: bytes y SHA-256;
  - de la última construcción de cada modelo: fecha, sistemas, commit de git (y si había cambios sin guardar en tools/),
    versión de Blender, Python y Node, SHA-256 de las fuentes que no están en git (Z-Anatomy, traducciones, TA2) y de
    las Fase 2, y el resultado de las comprobaciones;
  - la auditoría geométrica más reciente que haya en build/, con su fecha: no está ligada a esta versión (la auditoría
    no se ejecuta en cada construcción), y el manifiesto lo dice.

Uso (desde la raíz del proyecto):
  python3 tools/manifest.py <carpeta> --model male --systems "vascular nervous" --blender "Blender 5.4.0 …" \
    --checks "validate_models: ok; check-cards: todo correcto"
"""
import argparse, datetime, glob, hashlib, json, os, platform, subprocess

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SOURCES = ['sources/z-anatomy/Z-Anatomy.zip', 'sources/z-anatomy/translations.csv', 'sources/z-anatomy/TA2.csv',
           'sources/z-anatomy/definitions_en.json']
FASE2 = {'male': ['Anato3D_Male_30_Fase2.blend', 'Anato3D_Male_30_Fase2_musculature.npz'],
         'female': ['Anato3D_Female_30_Fase2.blend', 'Anato3D_Female_30_Fase2_pelvis.npz']}


def sha256(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for block in iter(lambda: f.read(1 << 20), b''):
            h.update(block)
    return h.hexdigest()


def run(*cmd):
    try:
        return subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, check=True).stdout.strip()
    except (OSError, subprocess.CalledProcessError):
        return None


def hashes(paths):
    out = {}
    for p in paths:
        full = os.path.join(ROOT, p)
        out[p] = {'bytes': os.path.getsize(full), 'sha256': sha256(full)} if os.path.isfile(full) else None
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('folder')
    ap.add_argument('--model', required=True)
    ap.add_argument('--systems', default='')
    ap.add_argument('--blender', default='')
    ap.add_argument('--checks', default='')
    a = ap.parse_args()
    path = os.path.join(a.folder, 'manifest.json')
    try:
        manifest = json.load(open(path))
    except (OSError, ValueError):
        manifest = {}
    now = datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0).isoformat()
    commit = run('git', 'rev-parse', '--short', 'HEAD')
    dirty = run('git', 'status', '--porcelain', '--', 'tools', 'web/src', 'web/scripts')
    audits = sorted(glob.glob(os.path.join(ROOT, 'build', 'audit*.json')), key=os.path.getmtime)
    audit = None
    if audits:
        latest = audits[-1]
        audit = {'file': os.path.relpath(latest, ROOT), 'sha256': sha256(latest),
                 'modified': datetime.datetime.fromtimestamp(os.path.getmtime(latest), datetime.timezone.utc).replace(microsecond=0).isoformat(),
                 'note': 'Auditoría más reciente de build/; no se ejecuta en cada construcción, así que puede no corresponder a estos archivos.'}
    builds = manifest.get('builds', {})
    builds[a.model] = {
        'date': now,
        'systems': a.systems.split(),
        'git': {'commit': commit, 'uncommitted_changes': dirty.splitlines() if dirty else []},
        'tools': {'blender': a.blender, 'python': platform.python_version(), 'node': run('node', '--version')},
        'sources': hashes(SOURCES + FASE2.get(a.model, [])),
        'checks': a.checks,
        'audit': audit,
    }
    files = {}
    for name in sorted(os.listdir(a.folder)):
        full = os.path.join(a.folder, name)
        if name == 'manifest.json' or name.startswith('.') or not os.path.isfile(full):
            continue
        files[name] = {'bytes': os.path.getsize(full), 'sha256': sha256(full)}
    manifest = {
        'release': f'{now.replace(":", "").replace("-", "")[:15]}-{commit or "sin-git"}',
        'generated': now,
        'note': 'Versión de los modelos de la web: un archivo solo es de esta versión si su SHA-256 coincide.',
        'builds': builds,
        'files': files,
    }
    with open(path + '.tmp', 'w') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=1)
    os.replace(path + '.tmp', path)
    print(f'manifiesto: {len(files)} archivos, versión {manifest["release"]}')


if __name__ == '__main__':
    main()
