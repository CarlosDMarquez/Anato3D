"""Índice de búsqueda de los sistemas que la app descarga aparte (web/public/models/male-<sistema>.glb).

La app solo conocía las piezas de los sistemas ya descargados: buscar «bíceps» antes de abrir el sistema muscular daba
dos bolsas sinoviales del bíceps femoral. Este índice lleva, por archivo, el nombre de cada pieza y los datos con los que
la app compone su ficha (sistema, nombres en español, inglés y latín, tejido); al elegir un resultado, la app descarga
ese sistema y lo muestra.

Uso (desde la raíz del proyecto; lo llama tools/build_all.sh al final):
  python3 tools/search_index.py [male|female]
"""
import glob, json, os, struct, sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
# build_all.sh lo genera sobre el candidato (lo publicado más lo nuevo) antes de validarlo y publicarlo.
MODELS = os.environ.get('A3D_WEB_MODELS') or os.path.join(ROOT, 'web/public/models')
KEEP = ('system', 'subsystem', 'tissue', 'name_es', 'name_en', 'name_la')


def gltf_json(path):
    with open(path, 'rb') as f:
        head = f.read(20)
        n = struct.unpack('<I', head[12:16])[0]
        return json.loads(f.read(n))


def parts(path):
    """[nombre, datos] de cada nodo con sistema, en el orden del archivo."""
    j = gltf_json(path)
    out = []
    for node in j.get('nodes', []):
        x = node.get('extras') or {}
        if x.get('system'):
            out.append([node['name'], {k: x[k] for k in KEEP if k in x}])
    return out


if __name__ == '__main__':
    model = sys.argv[1] if len(sys.argv) > 1 else 'male'
    index = {}
    for path in sorted(glob.glob(os.path.join(MODELS, f'{model}-*.glb'))):
        key = os.path.basename(path)[len(model) + 1:-len('.glb')]
        index[key] = parts(path)
    out = os.path.join(MODELS, f'{model}-index.json')
    with open(out, 'w') as f:
        json.dump(index, f, ensure_ascii=False, separators=(',', ':'))
    print(f'índice de búsqueda: {sum(len(v) for v in index.values())} piezas en {len(index)} archivos → {out} '
          f'({os.path.getsize(out) // 1024} KB)')
