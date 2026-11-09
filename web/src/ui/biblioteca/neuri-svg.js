// Neuri, la mascota de «Estudiar»: una neurona dibujada a mano en SVG (cuerpo, dendritas, axón con mielina y botones
// terminales) con cara. Sus gestos son clases de CSS (styles.css, «Neuri»): data-estado = reposo | escuchando |
// pensando (le recorren impulsos nerviosos) | contento | dudando. Cada copia lleva sus propios id de degradados,
// porque varias pueden estar en la página a la vez y alguna oculta.
let copias = 0;

// Dendritas: tronco y dos ramas cada una (coordenadas en una caja de 120 × 120 con el cuerpo en el centro).
const DENDRITAS = [
  ['M49 48 C43 42 38 37 33 31', 'M33 31 C31 25 30 21 31 15', 'M33 31 C27 29 22 29 16 31'],
  ['M61 40 C62 33 63 28 65 22', 'M65 22 C62 17 59 15 55 13', 'M65 22 C69 18 72 16 76 15'],
  ['M71 48 C77 42 82 37 87 31', 'M87 31 C89 25 90 21 89 15', 'M87 31 C93 29 98 29 104 31'],
  ['M41 63 C35 64 30 67 25 72', 'M25 72 C20 71 17 73 13 76', 'M25 72 C23 77 22 81 22 86'],
  ['M79 63 C85 64 90 67 95 72', 'M95 72 C100 71 103 73 107 76', 'M95 72 C97 77 98 81 98 86'],
];
const AXON = 'M60 83 C60 92 62 99 68 105';
const TERMINALES = [['M68 105 C72 108 76 109 81 109', 81, 109], ['M68 105 C69 110 70 113 72 116.5', 72, 116.5], ['M68 105 C73 103 77 100 80 96', 80, 96]];
// Recorridos de los impulsos (de la punta de una dendrita al cuerpo, y del cuerpo por el axón).
const IMPULSOS = [
  'M31 15 C30 21 31 25 33 31 C38 37 43 42 49 48',
  'M76 15 C72 16 69 18 65 22 C63 28 62 33 61 40',
  'M104 31 C98 29 93 29 87 31 C82 37 77 42 71 48',
  'M13 76 C17 73 20 71 25 72 C30 67 35 64 41 63',
  'M60 83 C60 92 62 99 68 105 C72 108 76 109 81 109',
];

/** SVG de Neuri. `clase`: clases extra (tamaño, sitio). Decorativo: el texto de al lado dice quién es. */
export function svgNeuri(clase = '') {
  const n = ++copias;
  const id = (x) => `neuri-${x}-${n}`;
  return `<svg class="neuri ${clase}" viewBox="0 0 120 120" data-estado="reposo" aria-hidden="true" focusable="false">
  <defs>
    <radialGradient id="${id('soma')}" cx="0.4" cy="0.34" r="0.78">
      <stop offset="0" stop-color="#dff0ff"/><stop offset="0.3" stop-color="#8cc5ff"/><stop offset="0.72" stop-color="#3b88ea"/><stop offset="1" stop-color="#1f58b8"/>
    </radialGradient>
    <linearGradient id="${id('rama')}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#9fd0ff"/><stop offset="1" stop-color="#3a7fdc"/>
    </linearGradient>
    <radialGradient id="${id('halo')}">
      <stop offset="0" stop-color="#4da3ff" stop-opacity="0.5"/><stop offset="0.55" stop-color="#4da3ff" stop-opacity="0.16"/><stop offset="1" stop-color="#4da3ff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle class="neuri-halo" cx="60" cy="60" r="46" fill="url(#${id('halo')})"/>
  <g class="neuri-cuerpo">
    <g class="neuri-ramas" fill="none" stroke="url(#${id('rama')})" stroke-linecap="round" stroke-linejoin="round">
      ${DENDRITAS.map(([tronco, a, b]) => `<path d="${tronco}" stroke-width="5.4"/><path d="${a}" stroke-width="3.2"/><path d="${b}" stroke-width="3.2"/>`).join('')}
    </g>
    <g class="neuri-axon" fill="none" stroke-linecap="round">
      <path d="${AXON}" stroke="#3a7fdc" stroke-width="3.2"/>
      <path class="neuri-mielina" d="M60 86 C60 92 62 99 67 104" stroke="#d6ebff" stroke-width="6.4" stroke-dasharray="6.2 3"/>
      ${TERMINALES.map(([d]) => `<path d="${d}" stroke="#5a9ff0" stroke-width="2.2"/>`).join('')}
      ${TERMINALES.map(([, x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#cfe6ff" stroke="none"/>`).join('')}
    </g>
    <g class="neuri-impulsos" fill="none" stroke="#f2f9ff" stroke-linecap="round" stroke-width="2.6">
      ${IMPULSOS.map((d) => `<path d="${d}" pathLength="100"/>`).join('')}
    </g>
    <circle class="neuri-soma" cx="60" cy="61" r="23.5" fill="url(#${id('soma')})"/>
    <ellipse cx="50.5" cy="50" rx="8.2" ry="4.4" fill="#ffffff" opacity="0.42" transform="rotate(-26 50.5 50)"/>
    <g class="neuri-cara">
      <g class="neuri-mirada"><g class="neuri-ojos" fill="#061527">
        <ellipse cx="52" cy="61" rx="3.6" ry="4.7"/><ellipse cx="68" cy="61" rx="3.6" ry="4.7"/>
        <circle cx="53.3" cy="59.1" r="1.3" fill="#ffffff"/><circle cx="69.3" cy="59.1" r="1.3" fill="#ffffff"/>
      </g></g>
      <path class="neuri-ojos-felices" d="M48.3 62.4 q3.7 -4.8 7.4 0 M64.3 62.4 q3.7 -4.8 7.4 0" fill="none" stroke="#061527" stroke-width="2.3" stroke-linecap="round"/>
      <ellipse class="neuri-mejilla" cx="46.4" cy="68.2" rx="3.4" ry="2" fill="#ff9cbf"/>
      <ellipse class="neuri-mejilla" cx="73.6" cy="68.2" rx="3.4" ry="2" fill="#ff9cbf"/>
      <path class="neuri-boca" d="M55.8 68.6 q4.2 3.9 8.4 0" fill="none" stroke="#061527" stroke-width="2.2" stroke-linecap="round"/>
      <path class="neuri-boca-duda" d="M55.4 70.2 q2.3 -1.9 4.6 0 t4.6 0" fill="none" stroke="#061527" stroke-width="2.1" stroke-linecap="round"/>
    </g>
  </g>
</svg>`;
}

/** Cambia el gesto de un Neuri (o de todos los de `raiz`). */
export function gesto(raiz, estado) {
  const svgs = raiz?.matches?.('svg.neuri') ? [raiz] : [...(raiz?.querySelectorAll?.('svg.neuri') ?? [])];
  for (const s of svgs) s.dataset.estado = estado;
}
