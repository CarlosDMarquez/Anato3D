"""Valida los archivos nuevos de la web antes de publicarlos (lo llama tools/build_all.sh).

Uso (desde la raíz del proyecto):
  python3 tools/validate_models.py <candidato> <publicado> archivo [archivo…]
    candidato: carpeta con lo publicado más lo nuevo; publicado: web/public/models; archivos: los que cambian.

Por cada archivo:
  - GLB: cabecera «glTF» versión 2, longitud igual al tamaño, bloque JSON legible y bloque binario; nodos y mallas;
    vistas de búfer dentro del binario (también las de Draco); piezas con sistema (extras.system). Frente al publicado:
    número de piezas y nombres que desaparecen. Falla si no hay piezas o si desaparece más del 5 % de los nombres
    (A3D_ALLOW_SHRINK=1 lo permite, para cambios intencionados).
  - JSON: se puede leer y tiene la forma esperada (metadatos con «groups», índice de búsqueda, región genital).
No decodifica la geometría Draco: eso lo comprueba la app al cargarla (o check-cards, que solo lee los nodos).
Termina con código 1 si algo falla.
"""
import json, os, struct, sys

SHRINK = 0.05
KNOWN_SYSTEMS = {'skeletal', 'connective', 'muscular', 'arterial', 'venous', 'nervous', 'respiratory', 'digestive',
                 'urogenital', 'endocrine', 'lymphatic', 'integumentary', 'special_senses'}   # web/src/systems.js (classify)


class Invalid(Exception):
    pass


def read_glb(path):
    data = open(path, 'rb').read()
    if len(data) < 20:
        raise Invalid('demasiado corto para un GLB')
    magic, version, length = struct.unpack('<III', data[:12])
    if magic != 0x46546C67:
        raise Invalid('no empieza por «glTF» (¿HTML o archivo dañado?)')
    if version != 2:
        raise Invalid(f'versión {version}, se esperaba 2')
    if length != len(data):
        raise Invalid(f'la cabecera dice {length} bytes y el archivo tiene {len(data)} (¿cortado?)')
    jlen, jtype = struct.unpack('<II', data[12:20])
    if jtype != 0x4E4F534A:
        raise Invalid('el primer bloque no es JSON')
    try:
        doc = json.loads(data[20:20 + jlen])
    except ValueError as e:
        raise Invalid(f'JSON ilegible: {e}')
    at = 20 + jlen
    bin_len = 0
    if at + 8 <= len(data):
        bin_len, btype = struct.unpack('<II', data[at:at + 8])
        if btype != 0x004E4942:
            raise Invalid('el segundo bloque no es binario')
        if at + 8 + bin_len > len(data):
            raise Invalid('el bloque binario se sale del archivo')
    return doc, bin_len


def check_glb(path):
    doc, bin_len = read_glb(path)
    if doc.get('asset', {}).get('version') != '2.0':
        raise Invalid('asset.version no es 2.0')
    nodes, meshes = doc.get('nodes', []), doc.get('meshes', [])
    if not nodes or not meshes:
        raise Invalid(f'{len(nodes)} nodos y {len(meshes)} mallas')
    views = doc.get('bufferViews', [])
    for i, v in enumerate(views):
        if v.get('buffer', 0) == 0 and v.get('byteOffset', 0) + v['byteLength'] > bin_len:
            raise Invalid(f'la vista de búfer {i} se sale del binario')
    for m in meshes:
        for p in m.get('primitives', []):
            draco = p.get('extensions', {}).get('KHR_draco_mesh_compression')
            if draco and not 0 <= draco['bufferView'] < len(views):
                raise Invalid(f'malla «{m.get("name")}»: vista de Draco inexistente')
    parts = {}
    for n in nodes:
        x = n.get('extras') or {}
        if x.get('system'):
            if x['system'] not in KNOWN_SYSTEMS:
                raise Invalid(f'«{n.get("name")}» tiene un sistema desconocido: {x["system"]}')
            parts[n.get('name')] = x['system']
    if not parts:
        raise Invalid('ninguna pieza con sistema (extras.system)')
    return parts


def check_json(path):
    try:
        data = json.load(open(path))
    except ValueError as e:
        raise Invalid(f'JSON ilegible: {e}')
    name = os.path.basename(path)
    if name.endswith('-index.json'):
        if not isinstance(data, dict) or not data or not all(isinstance(v, list) for v in data.values()):
            raise Invalid('el índice de búsqueda no tiene la forma {sistema: [[nombre, datos]…]}')
        return {f'{k}/{n}': k for k, lst in data.items() for n, _ in lst}
    if name.endswith('-genital-region.json'):
        if not all(k in data for k in ('voxel', 'origin', 'dims', 'bits')):
            raise Invalid('a la región genital le faltan voxel, origin, dims o bits')
        return None
    if name == 'manifest.json':
        return None
    if not isinstance(data.get('groups'), dict):
        raise Invalid('los metadatos no tienen «groups»')
    return None


def compare(new, old, name):
    """Piezas nuevas frente a las publicadas; devuelve (texto, ¿encoge demasiado?)."""
    if old is None:
        return f'{len(new)} piezas (nuevo)', False
    lost = set(old) - set(new)
    gained = set(new) - set(old)
    text = f'{len(old)} → {len(new)} piezas'
    if lost or gained:
        text += f' ({len(lost)} desaparecen, {len(gained)} nuevas'
        if lost:
            text += ': ' + ', '.join(sorted(lost)[:5]) + ('…' if len(lost) > 5 else '')
        text += ')'
    return text, len(lost) > SHRINK * max(len(old), 1)


def main(cand, published, files):
    allow_shrink = os.environ.get('A3D_ALLOW_SHRINK') == '1'
    bad = 0
    for f in files:
        new_path, old_path = os.path.join(cand, f), os.path.join(published, f)
        try:
            if not os.path.isfile(new_path) or os.path.getsize(new_path) == 0:
                raise Invalid('no existe o está vacío')
            checker = check_glb if f.endswith('.glb') else check_json if f.endswith('.json') else None
            if checker is None:
                raise Invalid('tipo de archivo inesperado')
            new = checker(new_path)
            old = None
            if new is not None and os.path.isfile(old_path):
                try:
                    old = checker(old_path)
                except Invalid:
                    old = None                                    # el publicado ya estaba mal: nada que comparar
            size = os.path.getsize(new_path)
            prev = os.path.getsize(old_path) if os.path.isfile(old_path) else 0
            detail = ''
            if new is not None:
                detail, shrinks = compare(new, old, f)
                if shrinks and not allow_shrink:
                    raise Invalid(f'{detail}: desaparece más del {SHRINK:.0%} de las piezas (A3D_ALLOW_SHRINK=1 si es intencionado)')
            print(f'  ✓ {f}: {prev / 1e6:.2f} → {size / 1e6:.2f} MB{"; " + detail if detail else ""}')
        except Invalid as e:
            bad += 1
            print(f'  ✗ {f}: {e}')
    return 1 if bad else 0


if __name__ == '__main__':
    if len(sys.argv) < 4:
        sys.exit(__doc__)
    sys.exit(main(sys.argv[1], sys.argv[2], sys.argv[3:]))
