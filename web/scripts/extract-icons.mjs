// Genera src/ui/icon-data.js con solo los iconos que usa la app.
// Sistemas: Health Icons (healthicons.org, MIT). Interfaz: Lucide (lucide.dev, ISC).
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
const health = require('@iconify-json/healthicons/icons.json');
const lucide = require('@iconify-json/lucide/icons.json');

const SYSTEM = {
  skeletal: 'skeleton-outline', connective: 'joints-outline', muscular: 'arm-outline',
  arterial: 'heart-organ-outline', venous: 'blood-vessel-outline', lymphatic: 'lymph-nodes-outline',
  nervous: 'neurology-outline', respiratory: 'lungs-outline', digestive: 'stomach-outline',
  endocrine: 'thyroid-outline', urogenital: 'kidneys-outline', integumentary: 'body-outline',
  male: 'man-outline', female: 'woman-outline',
};
const UI = {
  home: 'house', undo: 'undo-2', search: 'search', tools: 'sliders-horizontal', settings: 'settings-2',
  help: 'circle-question-mark', close: 'x', hide: 'eye-off', show: 'eye', isolate: 'scan', fade: 'blend',
  fadeOthers: 'layers-2', focus: 'crosshair', chevron: 'chevron-right', expand: 'chevron-up',
  rotate: 'rotate-3d', info: 'info', study: 'graduation-cap', check: 'check', wrong: 'x', restart: 'rotate-ccw',
  heart: 'heart',
};

function pick(set, map) {
  const out = {};
  for (const [key, name] of Object.entries(map)) {
    const icon = set.icons[name];
    if (!icon) throw new Error(`Icono no encontrado: ${name}`);
    out[key] = { body: icon.body, size: icon.width ?? set.width ?? 24 };
  }
  return out;
}

writeFileSync(new URL('../src/ui/icon-data.js', import.meta.url),
  '// Generado por scripts/extract-icons.mjs; no editar a mano.\n' +
  `export const SYSTEM_ICONS = ${JSON.stringify(pick(health, SYSTEM), null, 1)};\n` +
  `export const UI_ICONS = ${JSON.stringify(pick(lucide, UI), null, 1)};\n`);
console.log('icon-data.js generado');
