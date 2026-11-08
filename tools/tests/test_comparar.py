"""Pruebas de tools/checks/comparar.py (qué cuenta como «empeora» y qué solo se informa).

Uso (desde la raíz del proyecto): python3 tools/tests/test_comparar.py
"""
import copy, os, sys, unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'checks'))
from comparar import comparar  # noqa: E402

BASE = {
    'modelo': 'male', 'fecha': '2026-11-08T13:00:00', 'commit': 'abc1234', 'objetos': 4,
    'por_sistema': {'skeletal': 2, 'arterial': 2},
    'piezas': {'Vena_X': {'sistema': 'venous', 'hueso': 0.04, 'hueso_mm': 2.0},
               'Nodo_Y': {'sistema': 'lymphatic', 'piel_mm': 1.0}},
    'choques': {'Riñón | Bazo': {'tipo': 'contacto', 'mm': 0.4, 'frac': 0.03},
                'Conducto | Páncreas': {'tipo': 'natural', 'mm': 6.7, 'frac': 0.78}},
    'simetria': {'nervous:Vagus_nerve': {'max_mm': 30.0, 'mediana_mm': 4.0}},
    'picos': {'Piel': {'n': 1, 'max_mm': 25.0, 'en_cm': [0, 0, 100]}},
    'niveles': {'Riñón': 'T12–L3'},
}


def con(fn):
    cur = copy.deepcopy(BASE)
    fn(cur)
    return comparar(BASE, cur)


class Comparar(unittest.TestCase):
    def test_igual(self):
        peor, info = comparar(BASE, copy.deepcopy(BASE))
        self.assertEqual(peor, [])
        self.assertEqual(info, [])

    def test_piel_y_visible(self):
        peor, _ = con(lambda c: c['piezas']['Nodo_Y'].update(piel_mm=1.4))
        self.assertEqual(peor, [], 'menos de 0,5 mm más no cuenta')
        peor, _ = con(lambda c: c['piezas']['Nodo_Y'].update(piel_mm=2.0))
        self.assertEqual(len(peor), 1)
        peor, _ = con(lambda c: c['piezas']['Nodo_Y'].update(visible=3))
        self.assertIn('se ve desde fuera', peor[0])

    def test_hueso(self):
        peor, _ = con(lambda c: c['piezas']['Vena_X'].update(hueso=0.07))
        self.assertIn('dentro del hueso', peor[0])
        peor, _ = con(lambda c: c['piezas']['Vena_X'].update(hueso_mm=3.5))
        self.assertIn('más hondo', peor[0])
        peor, _ = con(lambda c: c['piezas'].update(Nueva={'sistema': 'muscular', 'hueso': 0.03, 'hueso_mm': 1.5}))
        self.assertEqual(len(peor), 1, 'una pieza que antes no entraba en el hueso y ahora entra un 3 %')

    def test_mallas_y_nombres(self):
        for k in ('invertida', 'vacia', 'sin_es'):
            peor, _ = con(lambda c: c['piezas']['Nodo_Y'].update({k: True}))
            self.assertEqual(len(peor), 1, k)
        peor, _ = con(lambda c: c['piezas']['Nodo_Y'].update(area_nula=2))
        self.assertEqual(len(peor), 1)

    def test_choques(self):
        peor, info = con(lambda c: c['choques'].update({'Vejiga | Sigma': {'tipo': 'contacto', 'mm': 0.6, 'frac': 0.05}}))
        self.assertEqual(peor, [], 'un roce nuevo solo se informa')
        self.assertEqual(len(info), 1)
        peor, _ = con(lambda c: c['choques'].update({'Vejiga | Sigma': {'tipo': 'choque', 'mm': 2.1, 'frac': 0.05}}))
        self.assertIn('choque nuevo', peor[0])
        peor, _ = con(lambda c: c['choques']['Riñón | Bazo'].update(tipo='choque', mm=1.2))
        self.assertIn('choque nuevo', peor[0], 'un roce que pasa a choque')

    def test_simetria(self):
        peor, _ = con(lambda c: c['simetria']['nervous:Vagus_nerve'].update(max_mm=31.5))
        self.assertEqual(peor, [], 'variación pequeña de una asimetría real')
        peor, _ = con(lambda c: c['simetria']['nervous:Vagus_nerve'].update(max_mm=45.0))
        self.assertIn('menos simétrica', peor[0])
        peor, _ = con(lambda c: c['simetria'].update({'muscular:Deltoid': {'max_mm': 80.0, 'mediana_mm': 0.2}}))
        self.assertIn('asimetría nueva', peor[0])
        peor, _ = con(lambda c: c['simetria'].update({'muscular:Deltoid': {'max_mm': 5.0, 'mediana_mm': 0.2}}))
        self.assertEqual(peor, [], 'por debajo de 8 mm una pareja nueva no cuenta')

    def test_picos_y_piezas(self):
        peor, _ = con(lambda c: c['picos'].update({'Hígado': {'n': 2, 'max_mm': 40.0, 'en_cm': [1, 2, 3]}}))
        self.assertIn('pico nuevo', peor[0])
        peor, _ = con(lambda c: c['picos']['Piel'].update(max_mm=31.0))
        self.assertIn('pico más largo', peor[0])
        peor, _ = con(lambda c: c['por_sistema'].update(arterial=1))
        self.assertIn('se perdieron', peor[0])
        peor, info = con(lambda c: c['por_sistema'].update(arterial=3))
        self.assertEqual(peor, [])
        self.assertEqual(len(info), 1)

    def test_mejoras_son_informativas(self):
        peor, info = con(lambda c: c['piezas'].pop('Nodo_Y'))
        self.assertEqual(peor, [])
        self.assertTrue(any('mejora' in x for x in info))


if __name__ == '__main__':
    unittest.main(verbosity=1)
