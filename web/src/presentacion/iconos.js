// Los cuatro iconos de Lucide que usa la presentación y la app no (los demás vienen de src/ui/icon-data.js).
const linea = (d) => `<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${d}"/>`;
export const PROPIOS = {
  arrowRight: { size: 24, body: linea('M5 12h14m-7-7l7 7l-7 7') },
  keyboard: { size: 24, body: linea('M10 8h.01M12 12h.01M14 8h.01M16 12h.01M18 8h.01M6 8h.01M7 16h10M8 12h.01M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2') },
  mouse: { size: 24, body: linea('M12 2a7 7 0 0 1 7 7v6a7 7 0 0 1-14 0V9a7 7 0 0 1 7-7m0 4v4') },
  smartphone: { size: 24, body: linea('M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2m5 16h.01') },
};
