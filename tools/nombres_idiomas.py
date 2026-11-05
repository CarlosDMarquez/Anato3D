"""Nombres de las estructuras en francés e italiano para la app: web/public/i18n/nombres-fr.json y nombres-it.json.

Fuentes (en sources/z-anatomy/, descargadas con Z-Anatomy; sumas en docs/construccion.md):
- translations.csv: la traducción oficial de Z-Anatomy (inglés, latín, francés, español, portugués);
- TA2.csv: la lista de la Terminologia Anatomica 2 con traducciones (inglés, latín, francés, español, portugués,
  italiano, persa).

Cada tabla va del nombre inglés de la pieza (el `name_en` de Z-Anatomy, sin «(left)» ni «(right)») o de la clave de un
grupo («Muscles_of_head») al nombre en ese idioma. El francés sale de la traducción de Z-Anatomy y, si no está, de la
TA2; el italiano solo de la TA2, buscado por el nombre inglés y, si no, por el latino. Lo que no se encuentra no entra
en la tabla: la app muestra entonces el latín (y si no hay latín, el inglés). En inglés, la app usa el `name_en`; en
alemán, el latín (como los atlas alemanes): no hay una tabla alemana entre las fuentes.

    python3 tools/nombres_idiomas.py
"""
import csv
import json
import re
import struct
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'sources/z-anatomy'
MODELS = ROOT / 'web/public/models'
OUT = ROOT / 'web/public/i18n'
LADO = re.compile(r'\s*\((left|right)\)$', re.I)


def clave(s):
    """Forma de comparar nombres: sin lado, sin guiones bajos, en minúsculas y con un solo espacio."""
    s = LADO.sub('', str(s or '')).replace('_', ' ')
    s = re.sub(r'\.(l|r)$', '', s.strip(), flags=re.I)
    return re.sub(r'\s+', ' ', s).strip().lower()


def base(s):
    return LADO.sub('', str(s or '')).strip()


def nodos_glb(path):
    data = path.read_bytes()
    largo, = struct.unpack_from('<I', data, 12)
    return json.loads(data[20:20 + largo]).get('nodes', [])


def filas(path, sep=';'):
    texto = path.read_text(encoding='utf-8-sig')
    if path.name == 'TA2.csv':                       # cada fila va entre comillas, con «;» dentro
        texto = '\n'.join(l.strip().strip('"') for l in texto.splitlines())
    return list(csv.reader(texto.splitlines(), delimiter=sep))


def main():
    # Nombres que usa la app: piezas de todos los GLB (inglés y latín) y grupos de la ruta jerárquica.
    piezas = {}
    for glb in sorted(MODELS.glob('*.glb')):
        for n in nodos_glb(glb):
            ex = n.get('extras') or {}
            if ex.get('name_en'):
                piezas.setdefault(base(ex['name_en']), ex.get('name_la') or '')
    grupos = set(re.findall(r'^  (\w+): \{', (ROOT / 'web/src/data/grupos.js').read_text(), re.M))
    for meta in MODELS.glob('*.json'):
        try:
            grupos.update((json.loads(meta.read_text()).get('groups') or {}).keys())
        except (json.JSONDecodeError, AttributeError):
            pass
    nombres = {**piezas, **{g: '' for g in grupos}}

    zfr, ta_fr_en, ta_fr_la, ta_it_en, ta_it_la = {}, {}, {}, {}, {}
    for f in filas(SRC / 'translations.csv')[1:]:
        if len(f) >= 3 and f[0] and f[2]:
            zfr.setdefault(clave(f[0]), f[2].strip())
    for f in filas(SRC / 'TA2.csv')[1:]:
        if len(f) < 7:
            continue
        en, la, fr, it = clave(f[1]), clave(f[2]), f[3].strip(), f[6].strip()
        if fr:
            ta_fr_en.setdefault(en, fr)
            ta_fr_la.setdefault(la, fr)
        if it:
            ta_it_en.setdefault(en, it)
            ta_it_la.setdefault(la, it)

    tablas = {'fr': {}, 'it': {}}
    for nombre, latin in nombres.items():
        k, kl = clave(nombre), clave(latin)
        fr = zfr.get(k) or ta_fr_en.get(k) or (ta_fr_la.get(kl) if kl else None)
        it = ta_it_en.get(k) or (ta_it_la.get(kl) if kl else None)
        if fr:
            fr = re.sub(r'([Nn])oeud', r'\1œud', fr)
            fr = re.sub(r'\b([Cc])oeur', r'\1œur', re.sub(r'\bOe(il|soph)', r'Œ\1', re.sub(r'\boe(il|soph)', r'œ\1', fr)))
            tablas['fr'][nombre] = fr[0].upper() + fr[1:]
        if it:
            tablas['it'][nombre] = it[0].upper() + it[1:]

    OUT.mkdir(parents=True, exist_ok=True)
    for idioma, tabla in tablas.items():
        destino = OUT / f'nombres-{idioma}.json'
        destino.write_text(json.dumps(dict(sorted(tabla.items())), ensure_ascii=False, separators=(',', ':')))
        n_p = sum(1 for p in piezas if p in tabla)
        n_g = sum(1 for g in grupos if g in tabla)
        print(f'{destino.relative_to(ROOT)}: piezas {n_p}/{len(piezas)}, grupos {n_g}/{len(grupos)}, '
              f'{destino.stat().st_size // 1024} KB')


if __name__ == '__main__':
    main()
