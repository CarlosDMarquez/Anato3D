"""Modelo base ligero para pantallas táctiles: el mismo GLB (piel, esqueleto y ojos) con las texturas grandes a la mitad
de resolución (las de 2048 a 1024 y las de 1024 a 512; las menores, como la del ojo, igual).

Por qué (revisión de rendimiento del 2026-11-07, docs/rendimiento-moviles-2026-11-07.md): las 21 texturas del esqueleto
pesan unos 7 MB en la descarga (WebP), pero en la GPU se descomprimen: unos 305 MB con sus mipmaps, el mayor riesgo de
que un teléfono cierre la página. A la mitad ocupan la cuarta parte. Las mallas no cambian (los mismos bytes de Draco):
las piezas, sus nombres y sus datos son los mismos. Cada imagen conserva su modo (con o sin pérdida).

Se llama <modelo>.ligero.glb y no <modelo>-ligero.glb: los <modelo>-*.glb son los sistemas que leen el índice de búsqueda
(search_index.py) y check-cards, y este repetiría todas las piezas del modelo base.

Uso: python3 tools/base_ligera.py <entrada.glb> <salida.glb>   (lo llama build_all.sh, en los pasos «base» y «ligera»)
"""
import io, json, struct, sys
from PIL import Image

MIN_SIZE = 1024        # solo se reducen las imágenes con un lado de este tamaño o más


def read_glb(path):
    data = open(path, 'rb').read()
    magic, version, _ = struct.unpack_from('<4sII', data, 0)
    if magic != b'glTF' or version != 2: raise ValueError(f'{path}: no es un GLB 2.0')
    jlen, jtype = struct.unpack_from('<I4s', data, 12)
    gltf = json.loads(data[20:20 + jlen])
    blen, btype = struct.unpack_from('<I4s', data, 20 + jlen)
    if jtype != b'JSON' or btype != b'BIN\0': raise ValueError(f'{path}: trozos inesperados')
    return gltf, data[28 + jlen:28 + jlen + blen]


def write_glb(path, gltf, binary):
    j = json.dumps(gltf, separators=(',', ':'), ensure_ascii=False).encode('utf-8')
    j += b' ' * (-len(j) % 4)
    binary += b'\0' * (-len(binary) % 4)
    total = 12 + 8 + len(j) + 8 + len(binary)
    with open(path, 'wb') as f:
        f.write(struct.pack('<4sII', b'glTF', 2, total))
        f.write(struct.pack('<I4s', len(j), b'JSON') + j)
        f.write(struct.pack('<I4s', len(binary), b'BIN\0') + binary)


def webp_chunks(data):
    """Nombres de los trozos de un WebP (RIFF): «VP8 » con pérdida, «VP8L» sin pérdida, «ICCP» perfil de color…"""
    out, i = [], 12
    while i + 8 <= len(data):
        tag, size = data[i:i + 4], struct.unpack_from('<I', data, i + 4)[0]
        out.append(tag)
        i += 8 + size + (size & 1)
    return out


def half(data):
    """WebP a la mitad de resolución, en el mismo modo y con el mismo perfil de color, o None si es pequeña."""
    im = Image.open(io.BytesIO(data))
    w, h = im.size
    if max(w, h) < MIN_SIZE: return None
    lossless = b'VP8L' in webp_chunks(data)
    extra = {'icc_profile': im.info['icc_profile']} if im.info.get('icc_profile') else {}
    out = io.BytesIO()
    im.resize((w // 2, h // 2), Image.LANCZOS).save(out, 'WEBP', lossless=lossless, quality=90 if lossless else 85, method=6,
                                                    **extra)
    return out.getvalue()


def main(src, dst):
    gltf, binary = read_glb(src)
    views = gltf['bufferViews']
    replace = {}
    for im in gltf.get('images', []):
        if im.get('mimeType') != 'image/webp' or 'bufferView' not in im: continue
        v = views[im['bufferView']]
        small = half(binary[v.get('byteOffset', 0):v.get('byteOffset', 0) + v['byteLength']])
        if small is not None: replace[im['bufferView']] = small
    # Binario nuevo: cada vista en su orden, alineada a 4 bytes; las que no son imágenes reducidas, con los mismos bytes.
    out = bytearray()
    for i, v in enumerate(views):
        chunk = replace.get(i) or binary[v.get('byteOffset', 0):v.get('byteOffset', 0) + v['byteLength']]
        out += b'\0' * (-len(out) % 4)
        v['byteOffset'], v['byteLength'] = len(out), len(chunk)
        out += chunk
    gltf['buffers'][0]['byteLength'] = len(out) + (-len(out) % 4)
    write_glb(dst, gltf, bytes(out))
    print(f'{dst}: {len(replace)} imágenes a la mitad; {len(open(src, "rb").read()) / 1048576:.1f} → '
          f'{len(open(dst, "rb").read()) / 1048576:.1f} MB')


if __name__ == '__main__':
    if len(sys.argv) != 3: sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
