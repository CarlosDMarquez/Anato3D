"""Compara el estado de un modelo con la referencia guardada y dice si algo empeoró. Lo llama tools/check_all.sh.

Uso (desde la raíz del proyecto):
  python3 tools/checks/comparar.py male|female            # compara y escribe el informe
  python3 tools/checks/comparar.py male|female --referencia   # además, guarda el estado actual como la referencia

Lee la auditoría (build/audit.json o build/<modelo>_audit.json, de tools/audit_models.py) y la simetría y los picos
(build/checks/<modelo>_{simetria,picos}.json, de tools/checks/simetria_picos.py). Hace un resumen pequeño, con solo lo que
hay que vigilar (unos KB, no el MB de la auditoría), y lo compara con tools/checks/referencia/<modelo>.json:

  Empeora (termina con código 1):
    - una pieza sale más de la piel (+0,5 mm) o pasa a verse desde fuera;
    - una pieza entra más en el hueso (+2 % de sus vértices, o +1 mm de profundidad si ya entraba);
    - caras de área nula nuevas, mallas invertidas o vacías nuevas, piezas sin nombre en español;
    - un choque entre órganos de 1 mm o más que no estaba, o uno que se hace más hondo (+0,5 mm);
    - una pareja izquierda/derecha menos simétrica (+2 mm y +25 % en la distancia máxima, o una nueva de 8 mm o más);
    - picos nuevos, o más largos (+5 mm);
    - menos piezas en un sistema (se perdieron piezas).
  Solo se informa: roces nuevos (menos de 1 mm), uniones reales, niveles vertebrales que cambian, lo que mejora y las
  piezas nuevas.

El informe completo va a build/checks/<modelo>_informe.md. Tras un cambio intencionado y revisado a mano, --referencia
guarda el estado nuevo (y hay que hacer commit de la referencia).
"""
import json, os, subprocess, sys, datetime

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
UMBRAL = {'piel_mm': 0.5, 'hueso': 0.02, 'hueso_mm': 1.0, 'choque_mm': 0.5, 'sim_mm': 2.0, 'sim_rel': 0.25,
          'sim_nueva_mm': 8.0, 'sim_guardar_mm': 3.0, 'pico_mm': 5.0}


def leer(path):
    with open(path, encoding='utf-8') as f:
        return json.load(f)


def resumen(modelo):
    """Resumen del estado actual a partir de los archivos de build/."""
    audit = os.path.join(ROOT, 'build', 'audit.json' if modelo == 'male' else f'{modelo}_audit.json')
    sim = os.path.join(ROOT, 'build', 'checks', f'{modelo}_simetria.json')
    picos = os.path.join(ROOT, 'build', 'checks', f'{modelo}_picos.json')
    for p in (audit, sim, picos):
        if not os.path.exists(p):
            sys.exit(f'✗ falta {os.path.relpath(p, ROOT)}: ejecuta antes zsh tools/check_all.sh {modelo}')
    a = leer(audit)
    try:
        commit = subprocess.run(['git', 'rev-parse', '--short', 'HEAD'], cwd=ROOT, capture_output=True, text=True).stdout.strip()
    except OSError:
        commit = ''
    r = {'modelo': modelo, 'fecha': datetime.datetime.now().isoformat(timespec='seconds'), 'commit': commit,
         'objetos': len(a['objects']), 'por_sistema': {}, 'piezas': {}, 'choques': {}, 'simetria': {}, 'picos': {},
         'niveles': {}}
    for o in a['objects']:
        s = o.get('system') or '?'
        r['por_sistema'][s] = r['por_sistema'].get(s, 0) + 1
        p = {}
        if o.get('out_skin'):
            p['piel_mm'] = o.get('out_skin_mm', 0.0)
        if o.get('visible_out'):
            p['visible'] = o['visible_out']
        if o.get('in_bone', 0) > 0.005:
            p['hueso'] = o['in_bone']
            p['hueso_mm'] = o.get('in_bone_mm', 0.0)
        for k, nk in (('zero_area', 'area_nula'), ('inverted', 'invertida'), ('empty', 'vacia'), ('no_es', 'sin_es')):
            if o.get(k):
                p[nk] = o[k]
        if p:
            p['sistema'] = s
            r['piezas'][o['name']] = p
    for c in a.get('clashes', []):
        r['choques'][f"{c['a']} | {c['b']}"] = {'tipo': c['kind'], 'mm': c['depth_mm'], 'frac': c['frac_a_in_b']}
    for k, v in a.get('levels', {}).items():
        r['niveles'][k] = f"{v['top']}–{v['bottom']}"
    for s in leer(sim):
        if s['max_mm'] >= UMBRAL['sim_guardar_mm']:
            r['simetria'][f"{s['system']}:{s['name']}"] = {'max_mm': s['max_mm'], 'mediana_mm': s['median_mm']}
    for p in leer(picos):
        r['picos'][p['name']] = {'n': p['n'], 'max_mm': p['max_mm'], 'en_cm': p['at_cm']}
    return r


def comparar(ref, cur):
    """Devuelve (empeora, informa): listas de líneas."""
    peor, info = [], []
    for s, n in ref['por_sistema'].items():
        m = cur['por_sistema'].get(s, 0)
        if m < n:
            peor.append(f'{s}: {n} → {m} piezas (se perdieron {n - m})')
        elif m > n:
            info.append(f'{s}: {n} → {m} piezas')
    for s, m in cur['por_sistema'].items():
        if s not in ref['por_sistema']:
            info.append(f'{s}: sistema nuevo con {m} piezas')
    vacio = {}
    for name in sorted(set(ref['piezas']) | set(cur['piezas'])):
        a, b = ref['piezas'].get(name, vacio), cur['piezas'].get(name, vacio)
        if b.get('piel_mm', 0) > a.get('piel_mm', 0) + UMBRAL['piel_mm']:
            peor.append(f"{name}: sale de la piel {a.get('piel_mm', 0)} → {b['piel_mm']} mm")
        if b.get('visible') and not a.get('visible'):
            peor.append(f"{name}: ahora se ve desde fuera de la piel ({b['visible']} puntos)")
        if b.get('hueso', 0) > a.get('hueso', 0) + UMBRAL['hueso']:
            peor.append(f"{name}: dentro del hueso {a.get('hueso', 0) * 100:.0f} % → {b['hueso'] * 100:.0f} %")
        elif a.get('hueso') and b.get('hueso_mm', 0) > a.get('hueso_mm', 0) + UMBRAL['hueso_mm']:
            peor.append(f"{name}: más hondo en el hueso {a.get('hueso_mm')} → {b['hueso_mm']} mm")
        if b.get('area_nula', 0) > a.get('area_nula', 0):
            peor.append(f"{name}: caras de área nula {a.get('area_nula', 0)} → {b['area_nula']}")
        for k, txt in (('invertida', 'malla invertida'), ('vacia', 'malla vacía'), ('sin_es', 'sin nombre en español')):
            if b.get(k) and not a.get(k):
                peor.append(f'{name}: {txt}')
        mejor = [k for k in ('piel_mm', 'hueso', 'area_nula', 'invertida', 'visible') if a.get(k) and not b.get(k)]
        if mejor:
            info.append(f"{name}: mejora ({', '.join(mejor)})")
    for k in sorted(set(ref['choques']) | set(cur['choques'])):
        a, b = ref['choques'].get(k), cur['choques'].get(k)
        if b and b['tipo'] == 'choque' and (not a or a['tipo'] != 'choque'):
            peor.append(f"choque nuevo: {k}, {b['mm']} mm ({b['frac'] * 100:.0f} %)")
        elif b and a and b['tipo'] == 'choque' and b['mm'] > a['mm'] + UMBRAL['choque_mm']:
            peor.append(f"choque más hondo: {k}, {a['mm']} → {b['mm']} mm")
        elif b and not a:
            info.append(f"nuevo ({b['tipo']}): {k}, {b['mm']} mm")
        elif a and not b:
            info.append(f"ya no hay ({a['tipo']}): {k}")
    for k in sorted(set(ref['simetria']) | set(cur['simetria'])):
        a, b = ref['simetria'].get(k), cur['simetria'].get(k)
        if b and a and b['max_mm'] > a['max_mm'] + UMBRAL['sim_mm'] and b['max_mm'] > a['max_mm'] * (1 + UMBRAL['sim_rel']):
            peor.append(f"menos simétrica: {k}, máxima {a['max_mm']} → {b['max_mm']} mm (mediana {b['mediana_mm']} mm)")
        elif b and not a and b['max_mm'] >= UMBRAL['sim_nueva_mm']:
            peor.append(f"asimetría nueva: {k}, máxima {b['max_mm']} mm (mediana {b['mediana_mm']} mm)")
        elif a and (not b or b['max_mm'] < a['max_mm'] - UMBRAL['sim_mm']):
            info.append(f"más simétrica: {k}, máxima {a['max_mm']} → {b['max_mm'] if b else '< ' + str(UMBRAL['sim_guardar_mm'])} mm")
    for k in sorted(set(ref['picos']) | set(cur['picos'])):
        a, b = ref['picos'].get(k), cur['picos'].get(k)
        if b and not a:
            peor.append(f"pico nuevo: {k}, {b['n']} aristas, hasta {b['max_mm']} mm (en {b['en_cm']} cm)")
        elif b and b['max_mm'] > a['max_mm'] + UMBRAL['pico_mm']:
            peor.append(f"pico más largo: {k}, {a['max_mm']} → {b['max_mm']} mm")
        elif a and not b:
            info.append(f'sin pico: {k}')
    for k in sorted(set(ref['niveles']) & set(cur['niveles'])):
        if ref['niveles'][k] != cur['niveles'][k]:
            info.append(f"nivel vertebral de {k}: {ref['niveles'][k]} → {cur['niveles'][k]}")
    return peor, info


def main():
    if len(sys.argv) < 2 or sys.argv[1] not in ('male', 'female'):
        sys.exit(__doc__)
    modelo = sys.argv[1]
    cur = resumen(modelo)
    os.makedirs(os.path.join(ROOT, 'build', 'checks'), exist_ok=True)
    with open(os.path.join(ROOT, 'build', 'checks', f'{modelo}_resumen.json'), 'w', encoding='utf-8') as f:
        json.dump(cur, f, ensure_ascii=False, indent=1)
    refpath = os.path.join(ROOT, 'tools', 'checks', 'referencia', f'{modelo}.json')
    if not os.path.exists(refpath):
        if '--referencia' not in sys.argv:
            sys.exit(f'✗ no hay referencia ({os.path.relpath(refpath, ROOT)}): guárdala con --referencia')
        ref = cur
    else:
        ref = leer(refpath)
    peor, info = comparar(ref, cur)
    lineas = [f'# Comprobación del modelo {modelo}', '',
              f"- Ahora: {cur['fecha']} (commit {cur['commit']}), {cur['objetos']} piezas.",
              f"- Referencia: {ref['fecha']} (commit {ref['commit']}), {ref['objetos']} piezas.", '',
              f'## Empeora ({len(peor)})', ''] + [f'- {x}' for x in peor] + ['', f'## Solo informativo ({len(info)})', ''] \
        + [f'- {x}' for x in info] + ['']
    informe = os.path.join(ROOT, 'build', 'checks', f'{modelo}_informe.md')
    with open(informe, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lineas))
    for x in peor[:40]:
        print(f'  ✗ {x}')
    if len(peor) > 40:
        print(f'  … y {len(peor) - 40} más')
    print(f'  ({len(info)} cambios solo informativos; detalle en {os.path.relpath(informe, ROOT)})')
    if '--referencia' in sys.argv:
        os.makedirs(os.path.dirname(refpath), exist_ok=True)
        with open(refpath, 'w', encoding='utf-8') as f:
            json.dump(cur, f, ensure_ascii=False, indent=1)
        print(f'referencia guardada: {os.path.relpath(refpath, ROOT)} (haz commit de ella)')
        return 0
    if peor:
        print(f'✗ {modelo}: empeoran {len(peor)} cosas respecto a la referencia del {ref["fecha"][:10]} ({ref["commit"]})')
        return 1
    print(f'✓ {modelo}: nada empeora respecto a la referencia del {ref["fecha"][:10]} ({ref["commit"]})')
    return 0


if __name__ == '__main__':
    sys.exit(main())
