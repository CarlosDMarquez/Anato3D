import { SYSTEM_ICONS, UI_ICONS } from './icon-data.js';

// Sistemas: Health Icons (healthicons.org). Interfaz: Lucide (lucide.dev). Se regeneran con `npm run icons`.
const svg = ({ body, size }, cls) => `<svg viewBox="0 0 ${size} ${size}" class="${cls}" aria-hidden="true">${body}</svg>`;

export const systemIcon = (id) => svg(SYSTEM_ICONS[id], 'sys-icon');
export const uiIcon = (name) => svg(UI_ICONS[name], 'ui-icon');
