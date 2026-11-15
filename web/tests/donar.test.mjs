// Pruebas de la opción «Donar» (src/donar.js): qué enlaces se aceptan y cuándo se muestra. `npm test`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DONAR_URL, enlaceDonar, estadoDonar } from '../src/donar.js';

test('solo enlaces de PayPal por https; sin protocolo se entiende https', () => {
  assert.equal(enlaceDonar('https://paypal.me/Anato3D'), 'https://paypal.me/Anato3D');
  assert.equal(enlaceDonar('https://www.paypal.com/paypalme/Anato3D/50'), 'https://www.paypal.com/paypalme/Anato3D/50');
  assert.equal(enlaceDonar('paypal.me/Anato3D'), 'https://paypal.me/Anato3D');
  assert.equal(enlaceDonar('  https://paypal.me/Anato3D  '), 'https://paypal.me/Anato3D');
  for (const malo of ['', null, 'http://paypal.me/Anato3D', 'https://paypal.me.otro.com/x', 'https://mipaypal.com/x',
    'https://ejemplo.com/?a=paypal.me', 'javascript:alert(1)', 'https://']) {
    assert.equal(enlaceDonar(malo), null, String(malo));
  }
  assert.equal(enlaceDonar(), enlaceDonar(DONAR_URL));    // sin argumento, el enlace configurado
});

test('con enlace se activa; sin él, aviso en desarrollo y oculta en la web publicada', () => {
  assert.equal(estadoDonar('https://paypal.me/Anato3D', false), 'activa');
  assert.equal(estadoDonar('https://paypal.me/Anato3D', true), 'activa');
  assert.equal(estadoDonar('', true), 'aviso');
  assert.equal(estadoDonar('', false), 'oculta');
  assert.equal(estadoDonar('https://otro.com/x', false), 'oculta');
  // El enlace configurado, si lo hay, tiene que ser válido: si no, la opción desaparecería sin avisar.
  if (DONAR_URL) assert.ok(enlaceDonar(DONAR_URL), `DONAR_URL no es un enlace de PayPal por https: ${DONAR_URL}`);
});

test('el menú de inicio tiene «Donar» debajo de «Créditos», con su vista', () => {
  const html = readFileSync(new URL('../app/index.html', import.meta.url), 'utf8');
  const orden = [...html.matchAll(/data-start="(\w+)"/g)].map((m) => m[1]);
  assert.deepEqual(orden, ['iniciar', 'configuracion', 'creditos', 'donar']);
  assert.match(html, /id="start-donar"[^>]*hidden/);
  assert.match(html, /class="donar-boton"[^>]*rel="noopener noreferrer"/);
});
