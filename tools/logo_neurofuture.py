"""Logo de NeuroFuture para la pantalla de inicio (fondo negro): web/public/neurofuture.png.

Parte de la imagen original (docs/marca/neurofuture-original.webp, fondo blanco) y recorta el bloque del cerebro, el
nombre y «Conciencia Cerebral Mexicali». El blanco del fondo pasa a transparente; el azul de la marca se conserva; el
texto azul marino, que no se leería sobre negro, pasa a gris claro. La «M» blanca del cerebro sigue blanca (está
dentro de la silueta, no en el fondo).

    python3 tools/logo_neurofuture.py
"""
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'docs/marca/neurofuture-original.webp'
OUT = ROOT / 'web/public/neurofuture.png'

FONDO = 253                   # blanco del original (medido: 249–255)
AZUL = (42, 134, 198)         # cerebro y «NEUROFUTURE» (medido)
MARINO_R = 20                 # canal rojo del azul marino del subtítulo (medido: unos 20, 36, 60)
CLARO = (213, 221, 231)       # el subtítulo sobre negro
CAJA = (150, 425, 1850, 695)  # cerebro, nombre y subtítulo (medido: 164–1835 × 438–679), con margen
CEREBRO_X = 440 - CAJA[0]     # a la izquierda, el cerebro; a la derecha, el texto
SUBTITULO_Y = 598 - CAJA[1]   # debajo, el subtítulo


def opacidad(r, tinta_r):
    """Cuánta tinta hay en un píxel mezclado con el blanco, por el canal rojo (el que más cambia)."""
    a = (FONDO - r) / (FONDO - tinta_r)
    return 0.0 if a < 0.04 else min(a, 1.0)


def main():
    im = Image.open(SRC).convert('RGB').crop(CAJA)
    w, h = im.size
    px = im.load()

    # Silueta del cerebro con sus huecos rellenos: lo que no se alcanza desde el borde sin cruzar el azul.
    mascara = Image.new('L', (CEREBRO_X, h), 0)
    m = mascara.load()
    for y in range(h):
        for x in range(CEREBRO_X):
            m[x, y] = 255 if opacidad(px[x, y][0], AZUL[0]) > 0.5 else 0
    ImageDraw.floodfill(mascara, (0, 0), 128)
    fuera = mascara.load()

    out = Image.new('RGBA', (w, h))
    o = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            if x < CEREBRO_X and fuera[x, y] == 0:
                o[x, y] = (r, g, b, 255)                       # hueco del cerebro: la «M» y su marco, tal cual
            elif x >= CEREBRO_X and y >= SUBTITULO_Y:
                o[x, y] = (*CLARO, round(255 * opacidad(r, MARINO_R)))
            else:
                o[x, y] = (*AZUL, round(255 * opacidad(r, AZUL[0])))

    # Reducción con alfa premultiplicado (sin halos oscuros en los bordes): 800 px bastan para 400 px de pantalla a 2x.
    alto = round(h * 800 / w)
    out = out.convert('RGBa').resize((800, alto), Image.LANCZOS).convert('RGBA')
    # Paleta de 96 colores sin tramado: el logo solo tiene dos tintas, el blanco de la «M» y sus bordes (70 KB → 12 KB).
    out = out.quantize(colors=96, method=Image.FASTOCTREE, dither=Image.NONE)
    out.save(OUT, optimize=True)
    print(f'{OUT.relative_to(ROOT)}: {out.size[0]}×{out.size[1]}, {OUT.stat().st_size // 1024} KB')


if __name__ == '__main__':
    main()
