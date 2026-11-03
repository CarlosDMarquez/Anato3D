// Catálogo de fuentes del contenido de estudio. Cada página se leyó el 2026-11-02 y su contenido se comprobó frente a lo
// que dice cada ficha (las fichas no copian texto: lo resumen en español). Fecha «actualizada»: la que muestra la página.
//
// No se usa OpenStax «Anatomy and Physiology 2e» aunque se consultó: su página indica que el libro no puede usarse con
// IA generativa sin permiso escrito de OpenStax, y su licencia (CC BY-NC-SA) no permite el uso comercial.

const TMA = (titulo, ruta, actualizada) => ({
  tipo: 'contenido',
  texto: `TeachMeAnatomy: «${titulo}» (Dr Oliver Jones, TeachMeSeries Ltd)`,
  url: `https://teachmeanatomy.info/${ruta}`,
  actualizada,
  consultada: '2026-11-02',
});

export const FUENTES = {
  ta2: {
    tipo: 'terminologia',
    texto: 'Terminologia Anatomica, 2.ª ed. (FIPAT, 2019)',
    url: 'https://ta2viewer.openanatomy.org/',
    consultada: '2026-11-02',
    nota: 'Comprobado en la tabla TA2 del proyecto (sources/z-anatomy/TA2.csv): término, latín y español.',
  },
  tma_brazo: TMA('Muscles of the Upper Arm', 'upper-limb/muscles/upper-arm/', '2026-04-10'),
  tma_antebrazo_post: TMA('Muscles in the Posterior Compartment of the Forearm', 'upper-limb/muscles/posterior-forearm/', '2025-12-12'),
  tma_musculocutaneo: TMA('The Musculocutaneous Nerve', 'upper-limb/nerves/musculocutaneous-nerve/', '2025-08-11'),
  tma_radial: TMA('The Radial Nerve', 'upper-limb/nerves/radial-nerve/', '2025-11-10'),
  tma_mediano: TMA('The Median Nerve', 'upper-limb/nerves/median-nerve/', '2026-06-03'),
  tma_ulnar: TMA('The Ulnar Nerve', 'upper-limb/nerves/ulnar-nerve/', '2026-10-11'),
  tma_arterias: TMA('Arterial Supply to the Upper Limb', 'upper-limb/vessels/arteries/', '2025-11-06'),
  tma_venas: TMA('Venous Drainage of the Upper Limb', 'upper-limb/vessels/veins/', '2025-11-06'),
  tma_humero: TMA('The Humerus', 'upper-limb/bones/humerus/', '2026-05-22'),
  anato3d: {
    tipo: 'modelo',
    texto: 'Documentación del propio proyecto (README de Anato3D): cómo se construyó el modelo',
    url: null,
    consultada: '2026-11-02',
  },
};
