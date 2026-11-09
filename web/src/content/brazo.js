// Módulo «El brazo: compartimentos anterior y posterior». Esquema en schema.js; fuentes en fuentes.js.
//
// Redactado el 2026-11-02 por Claude (IA) a partir de las fuentes citadas, que se leyeron ese día: cada campo resume lo
// que dice su fuente, sin añadir datos de memoria. NO lo ha revisado ningún especialista (estado «borrador»).
// Las correlaciones clínicas se dejan fuera a propósito hasta que las revise un especialista.

const REVISION = {
  estado: 'borrador',
  revisor: null,
  fecha: null,
  notas: 'Redactado por IA (Claude) a partir de las fuentes citadas, el 2026-11-02. Pendiente de revisión por un especialista.',
};
const TERM = (termino) => [{ fuente: 'ta2', termino }];
const MODELOS = ['male', 'female'];
// Los nervios y vasos del modelo femenino son los de Z-Anatomy (un cuerpo masculino) ajustados al cuerpo femenino.
const FEMENINO_HEREDADO = 'Modelo femenino: el trayecto procede del modelo masculino de Z-Anatomy ajustado al cuerpo femenino; no se ha revisado por separado.';

const ESTRUCTURAS = [
  // ── Hueso ──
  {
    id: 'humero', tipo: 'hueso', nombre: 'Húmero', latin: 'Humerus', ta2: '1180',
    region: 'Miembro superior › Brazo', lado: 'bilateral', modelos: MODELOS, piezas: ['Humerus'],
    descripcion: 'Hueso largo y único del brazo, entre el hombro y el codo. Arriba se articula con la escápula y abajo con el radio y la ulna.',
    funcion: 'Sostiene el brazo y da inserción a músculos del hombro, del brazo y del antebrazo.',
    campos: {
      partes: 'Proximal: cabeza, cuello anatómico, tubérculos mayor y menor separados por el surco intertubercular, y cuello quirúrgico. Diáfisis: tuberosidad deltoidea en la cara lateral y surco del nervio radial, oblicuo, en la cara posterior. Distal: crestas supraepicondíleas, epicóndilos medial y lateral, tróclea (medial), capítulo (lateral) y las fosas coronoidea, radial y del olécranon.',
      articulaciones: 'Hombro: la cabeza del húmero con la cavidad glenoidea de la escápula. Codo: el capítulo con la cabeza del radio y la tróclea con la escotadura troclear de la ulna.',
      inserciones: 'Por delante, el coracobraquial, el deltoides y el braquial; por detrás, las cabezas medial y lateral del tríceps, separadas por el surco del nervio radial. En el tubérculo mayor, el supraespinoso, el infraespinoso y el redondo menor; en el menor, el subescapular.',
    },
    relaciones: [
      { texto: 'El tendón de la cabeza larga del bíceps sale de la articulación del hombro por el surco intertubercular.', con: 'biceps-braquial', fuente: 'tma_humero' },
      { texto: 'El nervio radial y la arteria braquial profunda discurren por el surco del nervio radial.', con: 'nervio-radial', fuente: 'tma_humero' },
      { texto: 'El nervio ulnar pasa por un surco de la cara posterior del epicóndilo medial.', con: 'nervio-ulnar', fuente: 'tma_humero' },
      { texto: 'El nervio axilar y los vasos circunflejos humerales están en contacto con el hueso en el cuello quirúrgico.', fuente: 'tma_humero' },
    ],
    simplificaciones: ['Hueso de Z-Anatomy (BodyParts3D) ajustado al cuerpo de MakeHuman; la longitud de los segmentos del brazo se redistribuyó con las proporciones de Z-Anatomy.'],
    fuentes: { terminologia: TERM('1180'), contenido: [{ fuente: 'tma_humero', apoya: ['descripcion', 'funcion', 'partes', 'articulaciones', 'inserciones'] }] },
    revision: REVISION,
  },

  // ── Compartimento anterior ──
  {
    id: 'biceps-braquial', tipo: 'musculo', nombre: 'Músculo bíceps braquial', latin: 'Musculus biceps brachii', ta2: '2464',
    region: 'Miembro superior › Brazo', compartimento: 'anterior', lado: 'bilateral', modelos: MODELOS,
    piezas: ['Long_head_of_biceps_brachii', 'Short_head_of_biceps_brachii'],
    descripcion: 'Músculo de dos cabezas, larga y corta, del compartimento anterior del brazo. Casi todo su vientre está delante del húmero, pero no se inserta en él.',
    campos: {
      origen: 'Cabeza larga: tubérculo supraglenoideo de la escápula. Cabeza corta: proceso coracoides de la escápula.',
      insercion: 'Tuberosidad del radio y, a través de la aponeurosis bicipital, fascia del antebrazo.',
      accion: 'Supina el antebrazo y flexiona el codo; también flexiona el brazo en el hombro.',
      inervacion: 'Nervio musculocutáneo.',
      irrigacion: 'Ramas musculares de la arteria braquial (las del compartimento anterior).',
    },
    relaciones: [
      { texto: 'La aponeurosis bicipital forma el techo de la fosa cubital y se une a la fascia profunda del antebrazo.', fuente: 'tma_brazo' },
      { texto: 'El nervio musculocutáneo baja entre el bíceps, por delante, y el braquial, por detrás.', con: 'nervio-musculocutaneo', fuente: 'tma_musculocutaneo' },
      { texto: 'La arteria braquial pasa por la fosa cubital por debajo de la aponeurosis bicipital.', con: 'arteria-braquial', fuente: 'tma_arterias' },
      { texto: 'El tendón de la cabeza larga recorre el surco intertubercular del húmero.', con: 'humero', fuente: 'tma_humero' },
    ],
    simplificaciones: ['La aponeurosis bicipital no es una pieza propia del modelo.'],
    fuentes: {
      terminologia: [{ fuente: 'ta2', termino: '2464' }, { fuente: 'ta2', termino: '2465' }, { fuente: 'ta2', termino: '2466' }],
      contenido: [{ fuente: 'tma_brazo', apoya: ['descripcion', 'origen', 'insercion', 'accion', 'inervacion', 'irrigacion'] }],
    },
    revision: REVISION,
  },
  {
    id: 'coracobraquial', tipo: 'musculo', nombre: 'Músculo coracobraquial', latin: 'Musculus coracobrachialis', ta2: '2468',
    region: 'Miembro superior › Brazo', compartimento: 'anterior', lado: 'bilateral', modelos: MODELOS, piezas: ['Coracobrachialis_muscle'],
    descripcion: 'Músculo del compartimento anterior del brazo, profundo al bíceps, que pasa por la axila desde la escápula hasta el húmero.',
    campos: {
      origen: 'Proceso coracoides de la escápula.',
      insercion: 'Cara medial de la diáfisis del húmero, a la altura de la tuberosidad deltoidea.',
      accion: 'Flexiona el brazo en el hombro y lo aduce débilmente.',
      inervacion: 'Nervio musculocutáneo.',
      irrigacion: 'Ramas musculares de la arteria braquial (las del compartimento anterior).',
    },
    relaciones: [
      { texto: 'El nervio musculocutáneo lo atraviesa cerca de su inserción en el húmero (como variante, puede pasar por debajo de él).', con: 'nervio-musculocutaneo', fuente: 'tma_musculocutaneo' },
    ],
    simplificaciones: [],
    fuentes: { terminologia: TERM('2468'), contenido: [{ fuente: 'tma_brazo', apoya: ['descripcion', 'origen', 'insercion', 'accion', 'inervacion', 'irrigacion'] }] },
    revision: REVISION,
  },
  {
    id: 'braquial', tipo: 'musculo', nombre: 'Músculo braquial', latin: 'Musculus brachialis', ta2: '2469',
    sinonimos: [{ nombre: 'Músculo braquial anterior', fuente: 'cun_braquial' }],
    region: 'Miembro superior › Brazo', compartimento: 'anterior', lado: 'bilateral', modelos: MODELOS, piezas: ['Brachialis_muscle'],
    descripcion: 'Músculo del compartimento anterior del brazo, profundo al bíceps y más distal que los demás músculos del brazo. Forma el suelo de la fosa cubital.',
    campos: {
      origen: 'Caras medial y lateral de la diáfisis del húmero.',
      insercion: 'Tuberosidad de la ulna, justo por debajo de la articulación del codo.',
      accion: 'Flexiona el codo.',
      inervacion: 'Nervio musculocutáneo, con contribuciones del nervio radial.',
      irrigacion: 'Ramas musculares de la arteria braquial (las del compartimento anterior).',
    },
    relaciones: [
      { texto: 'El nervio musculocutáneo baja entre el bíceps, por delante, y el braquial, por detrás.', con: 'nervio-musculocutaneo', fuente: 'tma_musculocutaneo' },
    ],
    simplificaciones: [],
    fuentes: { terminologia: TERM('2469'), contenido: [{ fuente: 'tma_brazo', apoya: ['descripcion', 'origen', 'insercion', 'accion', 'inervacion', 'irrigacion'] }] },
    revision: REVISION,
  },

  // ── Compartimento posterior ──
  {
    id: 'triceps-braquial', tipo: 'musculo', nombre: 'Músculo tríceps braquial', latin: 'Musculus triceps brachii', ta2: '2471',
    region: 'Miembro superior › Brazo', compartimento: 'posterior', lado: 'bilateral', modelos: MODELOS,
    piezas: ['Long_head_of_triceps_brachii', 'Lateral_head_of_triceps_brachii', 'Medial_head_of_triceps_brachii'],
    descripcion: 'Único músculo del compartimento posterior del brazo. Tiene tres cabezas, larga, lateral y medial; la medial es profunda y queda cubierta por las otras dos.',
    campos: {
      origen: 'Cabeza larga: tubérculo infraglenoideo de la escápula. Cabeza lateral: húmero, por encima del surco del nervio radial. Cabeza medial: húmero, por debajo de ese surco.',
      insercion: 'Olécranon de la ulna, por un tendón común.',
      accion: 'Extiende el codo.',
      inervacion: 'Nervio radial. En algunas personas, la cabeza larga la inerva el nervio axilar.',
      irrigacion: 'Arteria braquial profunda.',
    },
    relaciones: [
      { texto: 'El surco del nervio radial separa los orígenes de las cabezas lateral y medial.', con: 'humero', fuente: 'tma_humero' },
      { texto: 'Las ramas del nervio radial para las cabezas larga y lateral salen en la axila; la de la cabeza medial, ya en el brazo.', con: 'nervio-radial', fuente: 'tma_radial' },
      { texto: 'Las fibras del ancóneo se confunden con las del tríceps.', con: 'anconeo', fuente: 'tma_antebrazo_post' },
    ],
    simplificaciones: [],
    fuentes: {
      terminologia: [{ fuente: 'ta2', termino: '2471' }, { fuente: 'ta2', termino: '2472' }, { fuente: 'ta2', termino: '2473' }, { fuente: 'ta2', termino: '2474' }],
      contenido: [{ fuente: 'tma_brazo', apoya: ['descripcion', 'origen', 'insercion', 'accion', 'inervacion', 'irrigacion'] }],
    },
    revision: REVISION,
  },
  {
    id: 'anconeo', tipo: 'musculo', nombre: 'Músculo ancóneo', latin: 'Musculus anconeus', ta2: '2510',
    region: 'Miembro superior › Codo', compartimento: 'posterior del antebrazo', lado: 'bilateral', modelos: MODELOS, piezas: ['Anconeus_muscle'],
    descripcion: 'Músculo pequeño de la cara posterior del codo. La fuente lo sitúa en la capa superficial del compartimento posterior del antebrazo; aquí se muestra como contexto del tríceps.',
    campos: {
      origen: 'Epicóndilo lateral del húmero.',
      insercion: 'Parte posterior y lateral del olécranon.',
      accion: 'Extiende y estabiliza el codo; durante la pronación, abduce la ulna.',
      inervacion: 'Nervio radial.',
    },
    relaciones: [{ texto: 'Sus fibras se confunden con las del tríceps braquial, a veces hasta no distinguirse.', con: 'triceps-braquial', fuente: 'tma_antebrazo_post' }],
    simplificaciones: [],
    fuentes: { terminologia: TERM('2510'), contenido: [{ fuente: 'tma_antebrazo_post', apoya: ['descripcion', 'origen', 'insercion', 'accion', 'inervacion'] }] },
    revision: { ...REVISION, notas: `${REVISION.notas} Decidir con el revisor si entra en el módulo del brazo o en el del antebrazo.` },
  },

  // ── Nervios ──
  {
    id: 'nervio-musculocutaneo', tipo: 'nervio', nombre: 'Nervio musculocutáneo', latin: 'Nervus musculocutaneus', ta2: '6421',
    region: 'Miembro superior › Brazo', lado: 'bilateral', modelos: MODELOS, piezas: ['Musculocutaneous_nerve'],
    descripcion: 'Nervio del compartimento anterior del brazo: inerva sus tres músculos y termina como nervio cutáneo lateral del antebrazo.',
    funcion: 'Motor para la flexión del hombro y del codo y para la supinación (a través de sus músculos), y sensitivo para la piel lateral del antebrazo.',
    campos: {
      origen: 'Rama terminal del fascículo lateral del plexo braquial (raíces C5–C7). Aparece en el borde inferior del pectoral menor.',
      trayecto: 'Sale de la axila atravesando el coracobraquial cerca de su inserción, baja por el compartimento anterior entre el bíceps (delante) y el braquial (detrás), y perfora la fascia profunda por fuera del tendón del bíceps.',
      inerva: 'Bíceps braquial, braquial y coracobraquial; además, ramas articulares para el húmero y el codo.',
      sensitivo: 'Piel de la cara anterolateral del antebrazo, por el nervio cutáneo lateral del antebrazo.',
    },
    relaciones: [
      { texto: 'Atraviesa el coracobraquial.', con: 'coracobraquial', fuente: 'tma_musculocutaneo' },
      { texto: 'Baja entre el bíceps y el braquial, a los que inerva.', con: 'biceps-braquial', fuente: 'tma_musculocutaneo' },
    ],
    simplificaciones: ['Variantes según la fuente: puede intercambiar fibras con el nervio mediano y pasar por debajo del coracobraquial o a través del bíceps.', FEMENINO_HEREDADO],
    fuentes: { terminologia: TERM('6421'), contenido: [{ fuente: 'tma_musculocutaneo', apoya: ['descripcion', 'funcion', 'origen', 'trayecto', 'inerva', 'sensitivo'] }] },
    revision: REVISION,
  },
  {
    id: 'nervio-radial', tipo: 'nervio', nombre: 'Nervio radial', latin: 'Nervus radialis', ta2: '6431',
    region: 'Miembro superior › Brazo', lado: 'bilateral', modelos: MODELOS, piezas: ['Radial_nerve'],
    descripcion: 'Nervio del compartimento posterior: en el brazo rodea el húmero por el surco del nervio radial e inerva el tríceps; en el antebrazo, los músculos posteriores.',
    funcion: 'Motor para la extensión del codo, de la muñeca y de los dedos, y sensitivo para la piel posterior del miembro y el dorso lateral de la mano.',
    campos: {
      origen: 'Continuación del fascículo posterior del plexo braquial (raíces C5–T1), en la axila, por detrás de la arteria axilar.',
      trayecto: 'Sale de la axila por el intervalo triangular y desciende por el surco del nervio radial, en la cara posterior del húmero, acompañado durante gran parte del recorrido por la arteria braquial profunda. Rodea el húmero por fuera, pasa por delante del epicóndilo lateral y entra en el antebrazo por la fosa cubital, donde se divide en una rama profunda (motora) y otra superficial (sensitiva).',
      inerva: 'En el brazo, las tres cabezas del tríceps. Más abajo, el braquiorradial y el extensor radial largo del carpo y, por su rama profunda, el resto de músculos del compartimento posterior del antebrazo.',
      sensitivo: 'Piel lateral del brazo por debajo del deltoides, cara posterior del brazo, una franja de la cara posterior del antebrazo y dorso de los tres dedos y medio laterales con la parte correspondiente de la mano.',
    },
    relaciones: [
      { texto: 'Discurre por el surco del nervio radial junto a la arteria braquial profunda.', con: 'arteria-braquial-profunda', fuente: 'tma_humero' },
      { texto: 'Inerva las tres cabezas del tríceps braquial.', con: 'triceps-braquial', fuente: 'tma_radial' },
    ],
    simplificaciones: [FEMENINO_HEREDADO],
    fuentes: { terminologia: TERM('6431'), contenido: [{ fuente: 'tma_radial', apoya: ['descripcion', 'funcion', 'origen', 'trayecto', 'inerva', 'sensitivo'] }] },
    revision: REVISION,
  },
  {
    id: 'nervio-mediano', tipo: 'nervio', nombre: 'Nervio mediano', latin: 'Nervus medianus', ta2: '6459',
    region: 'Miembro superior › Brazo', lado: 'bilateral', modelos: MODELOS, piezas: ['Median_nerve'],
    descripcion: 'Nervio que atraviesa el brazo junto a la arteria braquial; sus ramas motoras son para el antebrazo y la mano.',
    funcion: 'Motor para la mayoría de los flexores y pronadores del antebrazo y para los músculos de la eminencia tenar, y sensitivo para la palma lateral y los tres dedos y medio laterales.',
    campos: {
      origen: 'Fascículos lateral y medial del plexo braquial (raíces C6–T1; en algunas personas, también C5).',
      trayecto: 'Baja desde la axila por fuera de la arteria braquial; hacia la mitad del brazo la cruza y queda por dentro de ella. Entra en el compartimento anterior del antebrazo por la fosa cubital.',
      inerva: 'Flexores y pronadores del compartimento anterior del antebrazo, salvo el flexor ulnar del carpo y parte del flexor profundo de los dedos; músculos tenares y los dos lumbricales laterales.',
      sensitivo: 'Palma lateral (rama cutánea palmar) y cara palmar y pulpejos de los tres dedos y medio laterales.',
    },
    relaciones: [{ texto: 'Por fuera de la arteria braquial en la parte alta del brazo; la cruza a mitad del brazo y queda por dentro.', con: 'arteria-braquial', fuente: 'tma_mediano' }],
    simplificaciones: [FEMENINO_HEREDADO],
    fuentes: { terminologia: TERM('6459'), contenido: [{ fuente: 'tma_mediano', apoya: ['descripcion', 'funcion', 'origen', 'trayecto', 'inerva', 'sensitivo'] }] },
    revision: REVISION,
  },
  {
    id: 'nervio-ulnar', tipo: 'nervio', nombre: 'Nervio ulnar', latin: 'Nervus ulnaris', ta2: '6449',
    sinonimos: [{ nombre: 'Nervio cubital', fuente: 'decs_nervio_cubital' }],
    region: 'Miembro superior › Brazo', lado: 'bilateral', modelos: MODELOS, piezas: ['Ulnar_nerve'],
    descripcion: 'Nervio que baja por la cara medial del brazo y pasa por detrás del codo, junto al epicóndilo medial; sus ramas motoras son para el antebrazo y la mano.',
    funcion: 'Motor para el flexor ulnar del carpo, parte del flexor profundo de los dedos y la mayoría de los músculos pequeños de la mano, y sensitivo para el dedo y medio mediales.',
    campos: {
      origen: 'Continuación del fascículo medial del plexo braquial (raíces C8–T1), en la axila.',
      trayecto: 'Baja por la cara medial del brazo con la arteria braquial por fuera; a mitad del brazo atraviesa el tabique intermuscular medial y pasa al compartimento posterior. Cruza el codo por detrás, por el túnel ulnar, entre el epicóndilo medial y el olécranon.',
      inerva: 'En el antebrazo, el flexor ulnar del carpo y la mitad medial del flexor profundo de los dedos. En la mano, los músculos hipotenares, los dos lumbricales mediales, el aductor del pulgar y los interóseos.',
      sensitivo: 'El dedo y medio mediales y la zona correspondiente de la palma y del dorso de la mano.',
    },
    relaciones: [
      { texto: 'La arteria braquial queda por fuera de él en la cara medial del brazo.', con: 'arteria-braquial', fuente: 'tma_ulnar' },
      { texto: 'Pasa por un surco de la cara posterior del epicóndilo medial del húmero.', con: 'humero', fuente: 'tma_humero' },
    ],
    simplificaciones: [FEMENINO_HEREDADO],
    fuentes: { terminologia: TERM('6449'), contenido: [{ fuente: 'tma_ulnar', apoya: ['descripcion', 'funcion', 'origen', 'trayecto', 'inerva', 'sensitivo'] }] },
    revision: REVISION,
  },

  // ── Vasos ──
  {
    id: 'arteria-braquial', tipo: 'arteria', nombre: 'Arteria braquial', latin: 'Arteria brachialis', ta2: '4632',
    sinonimos: [{ nombre: 'Arteria humeral', fuente: 'cun_arteria_braquial' }],
    region: 'Miembro superior › Brazo', lado: 'bilateral', modelos: MODELOS, piezas: ['Brachial_artery'],
    descripcion: 'Arteria principal del brazo: continúa a la axilar y termina en el codo dividiéndose en las arterias radial y ulnar.',
    funcion: 'Lleva la sangre al brazo y, a través de sus ramas terminales, al antebrazo y la mano.',
    campos: {
      origen: 'Continuación de la arteria axilar a partir del borde inferior del músculo redondo mayor.',
      trayecto: 'Desciende por el brazo y pasa por la fosa cubital por debajo de la aponeurosis bicipital, donde se divide en las arterias radial y ulnar.',
      ramas: 'Arteria braquial profunda y ramas musculares para el compartimento anterior.',
      territorio: 'Principal aporte de sangre del brazo.',
    },
    relaciones: [
      { texto: 'El nervio mediano va por fuera de ella arriba, la cruza a mitad del brazo y queda por dentro.', con: 'nervio-mediano', fuente: 'tma_mediano' },
      { texto: 'El nervio ulnar va por dentro de ella en la cara medial del brazo.', con: 'nervio-ulnar', fuente: 'tma_ulnar' },
      { texto: 'Las venas braquiales la acompañan, una a cada lado.', con: 'venas-braquiales', fuente: 'tma_venas' },
    ],
    simplificaciones: [FEMENINO_HEREDADO],
    fuentes: {
      terminologia: TERM('4632'),
      contenido: [{ fuente: 'tma_arterias', apoya: ['descripcion', 'funcion', 'origen', 'trayecto', 'ramas', 'territorio'] }, { fuente: 'tma_brazo', apoya: ['ramas'] }],
    },
    revision: REVISION,
  },
  {
    id: 'arteria-braquial-profunda', tipo: 'arteria', nombre: 'Arteria braquial profunda', latin: 'Arteria profunda brachii', ta2: '4634',
    sinonimos: [{ nombre: 'Arteria profunda del brazo', fuente: 'ta98_profunda_brazo' }, { nombre: 'Arteria humeral profunda', fuente: 'kenhub_arteria_braquial' }],
    region: 'Miembro superior › Brazo', lado: 'bilateral', modelos: MODELOS, piezas: ['Deep_brachial_artery'],
    descripcion: 'Rama de la arteria braquial que acompaña al nervio radial por el surco del nervio radial del húmero.',
    funcion: 'Irriga la parte posterior del brazo.',
    campos: {
      origen: 'Arteria braquial, justo por debajo del redondo mayor.',
      trayecto: 'Con el nervio radial, por el surco del nervio radial del húmero.',
      territorio: 'Estructuras de la cara posterior del brazo, como el tríceps; contribuye a la red anastomótica alrededor del codo.',
    },
    relaciones: [{ texto: 'Acompaña al nervio radial por el surco del nervio radial.', con: 'nervio-radial', fuente: 'tma_arterias' }],
    simplificaciones: [FEMENINO_HEREDADO],
    fuentes: { terminologia: TERM('4634'), contenido: [{ fuente: 'tma_arterias', apoya: ['descripcion', 'funcion', 'origen', 'trayecto', 'territorio'] }] },
    revision: REVISION,
  },
  {
    id: 'vena-cefalica', tipo: 'vena', nombre: 'Vena cefálica', latin: 'Vena cephalica', ta2: '4964',
    region: 'Miembro superior › Brazo', lado: 'bilateral', modelos: MODELOS, piezas: ['Cephalic_vein'],
    descripcion: 'Vena superficial de la cara anterolateral del miembro superior.',
    funcion: 'Drena la sangre superficial del miembro superior hacia la vena axilar.',
    campos: {
      origen: 'Red venosa dorsal de la mano.',
      trayecto: 'Asciende por la cara anterolateral del miembro y pasa por delante del codo; en el hombro va entre el deltoides y el pectoral mayor (surco deltopectoral) y entra en la axila por el triángulo clavipectoral.',
      drenaje: 'Vena axilar.',
    },
    relaciones: [{ texto: 'En el codo se une a la vena basílica por la vena mediana del codo.', con: 'vena-basilica', fuente: 'tma_venas' }],
    simplificaciones: [FEMENINO_HEREDADO],
    fuentes: { terminologia: TERM('4964'), contenido: [{ fuente: 'tma_venas', apoya: ['descripcion', 'funcion', 'origen', 'trayecto', 'drenaje'] }] },
    revision: REVISION,
  },
  {
    id: 'vena-basilica', tipo: 'vena', nombre: 'Vena basílica', latin: 'Vena basilica', ta2: '4979',
    region: 'Miembro superior › Brazo', lado: 'bilateral', modelos: MODELOS, piezas: ['Basilic_vein'],
    descripcion: 'Vena superficial de la cara medial del miembro superior, que en el brazo se hace profunda.',
    funcion: 'Drena la sangre superficial de la cara medial del miembro superior hacia el sistema profundo.',
    campos: {
      origen: 'Red venosa dorsal de la mano.',
      trayecto: 'Asciende por la cara medial del miembro; a la altura del borde del redondo mayor se hace profunda.',
      drenaje: 'Se une a las venas braquiales y forma con ellas la vena axilar.',
    },
    relaciones: [{ texto: 'Con las venas braquiales forma la vena axilar.', con: 'venas-braquiales', fuente: 'tma_venas' }],
    simplificaciones: [FEMENINO_HEREDADO],
    fuentes: { terminologia: TERM('4979'), contenido: [{ fuente: 'tma_venas', apoya: ['descripcion', 'funcion', 'origen', 'trayecto', 'drenaje'] }] },
    revision: REVISION,
  },
  {
    id: 'venas-braquiales', tipo: 'vena', nombre: 'Venas braquiales', latin: 'Venae brachiales', ta2: '4982',
    region: 'Miembro superior › Brazo', lado: 'bilateral', modelos: MODELOS, piezas: ['Brachial_veins'],
    descripcion: 'Venas profundas del brazo, una a cada lado de la arteria braquial (venas acompañantes). Son las mayores venas profundas del brazo.',
    funcion: 'Devuelven la sangre profunda del brazo; el latido de la arteria que acompañan ayuda al retorno venoso.',
    campos: {
      trayecto: 'Bajo la fascia profunda, a ambos lados de la arteria braquial.',
      drenaje: 'Se unen a la vena basílica y forman la vena axilar.',
    },
    relaciones: [{ texto: 'Acompañan a la arteria braquial, una a cada lado.', con: 'arteria-braquial', fuente: 'tma_venas' }],
    simplificaciones: [FEMENINO_HEREDADO],
    fuentes: { terminologia: TERM('4982'), contenido: [{ fuente: 'tma_venas', apoya: ['descripcion', 'funcion', 'trayecto', 'drenaje'] }] },
    revision: REVISION,
  },
];

// Lección guiada: un paso por grupo de estructuras. El texto resume lo que dicen las fichas y sus fuentes.
// Pasos de la lección. `tipo` (biblioteca de estudio, src/biblioteca/formato.js): orientación, explicación, relaciones o
// síntesis. La orientación y la síntesis se añadieron el 2026-11-09 al pasar el módulo a la biblioteca.
const LECCION = [
  { id: 'orientacion', tipo: 'orientacion', titulo: 'El brazo y sus dos compartimentos', fichas: ['humero', 'biceps-braquial', 'braquial', 'coracobraquial', 'triceps-braquial'],
    fuentes: ['tma_brazo'],
    texto: 'El brazo va de la articulación del hombro a la del codo. Tiene cuatro músculos: tres en el compartimento anterior (bíceps braquial, braquial y coracobraquial) y uno en el posterior (tríceps braquial). Gira el modelo para ver los tres anteriores delante del húmero y el tríceps detrás.' },
  { id: 'humero', tipo: 'explicacion', titulo: 'El húmero', fichas: ['humero'], fuentes: ['tma_humero'],
    texto: 'El único hueso del brazo. Fíjate en el surco del nervio radial, en su cara posterior, y en los epicóndilos medial y lateral, junto al codo.' },
  { id: 'anterior', tipo: 'explicacion', titulo: 'Compartimento anterior', fichas: ['biceps-braquial', 'coracobraquial', 'braquial'], fuentes: ['tma_brazo'],
    texto: 'Tres músculos: bíceps braquial, coracobraquial y braquial. Los tres los inerva el nervio musculocutáneo, y los irrigan ramas musculares de la arteria braquial.' },
  { id: 'posterior', tipo: 'explicacion', titulo: 'Compartimento posterior', fichas: ['triceps-braquial', 'anconeo'], fuentes: ['tma_brazo', 'tma_antebrazo_post'],
    texto: 'Un solo músculo, el tríceps braquial, con tres cabezas. Lo inerva el nervio radial y lo irriga la arteria braquial profunda. En el codo, el ancóneo se confunde con sus fibras.' },
  { id: 'nervios', tipo: 'relaciones', titulo: 'Los nervios del brazo', fichas: ['nervio-musculocutaneo', 'nervio-radial', 'nervio-mediano', 'nervio-ulnar'],
    fuentes: ['tma_musculocutaneo', 'tma_radial', 'tma_mediano', 'tma_ulnar'],
    texto: 'El musculocutáneo inerva el compartimento anterior y el radial, el posterior. El mediano y el ulnar atraviesan el brazo camino del antebrazo y la mano.' },
  { id: 'vasos', tipo: 'relaciones', titulo: 'Arterias y venas', fichas: ['arteria-braquial', 'arteria-braquial-profunda', 'venas-braquiales', 'vena-cefalica', 'vena-basilica'],
    fuentes: ['tma_arterias', 'tma_venas'],
    texto: 'La arteria braquial continúa a la axilar e irriga el brazo; su rama, la braquial profunda, acompaña al nervio radial. Las venas braquiales acompañan a la arteria; la cefálica y la basílica son superficiales.' },
  { id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen', fichas: ['biceps-braquial', 'braquial', 'coracobraquial', 'triceps-braquial', 'nervio-musculocutaneo', 'nervio-radial'],
    fuentes: ['tma_brazo'],
    texto: 'Delante, tres músculos que flexionan: el bíceps y el braquial, el codo; el coracobraquial, el hombro. Los inerva el nervio musculocutáneo. Detrás, el tríceps braquial, el gran extensor del codo, inervado por el nervio radial. El mediano y el ulnar solo cruzan el brazo, camino del antebrazo y la mano.' },
];

// Banco de preguntas de texto. La respuesta correcta sale de la ficha y de su fuente; los distractores son datos de
// otras estructuras del módulo (útiles para aprender a distinguirlas) o errores habituales. Borrador, sin revisar.
const PREGUNTAS = [
  { id: 'inervacion-anterior', fichas: ['nervio-musculocutaneo', 'biceps-braquial', 'braquial', 'coracobraquial'], fuente: 'tma_brazo',
    enunciado: '¿Qué nervio inerva los tres músculos del compartimento anterior del brazo (bíceps, braquial y coracobraquial)?',
    correcta: 'Nervio musculocutáneo', distractores: ['Nervio radial', 'Nervio mediano', 'Nervio ulnar'],
    explicacion: 'Los tres los inerva el nervio musculocutáneo; el braquial recibe además contribuciones del nervio radial.' },
  { id: 'inervacion-triceps', fichas: ['triceps-braquial', 'nervio-radial'], fuente: 'tma_brazo',
    enunciado: '¿Qué nervio inerva el tríceps braquial?',
    correcta: 'Nervio radial', distractores: ['Nervio musculocutáneo', 'Nervio mediano', 'Nervio ulnar'],
    explicacion: 'El nervio radial inerva sus tres cabezas; en algunas personas, la cabeza larga la inerva el nervio axilar.' },
  { id: 'insercion-biceps', fichas: ['biceps-braquial'], fuente: 'tma_brazo',
    enunciado: '¿Dónde se inserta el bíceps braquial?',
    correcta: 'En la tuberosidad del radio (y en la fascia del antebrazo, por la aponeurosis bicipital)',
    distractores: ['En la tuberosidad de la ulna', 'En el olécranon', 'En la cara medial de la diáfisis del húmero'],
    explicacion: 'Se inserta en la tuberosidad del radio y, por la aponeurosis bicipital, en la fascia del antebrazo. No se inserta en el húmero.' },
  { id: 'insercion-braquial', fichas: ['braquial'], fuente: 'tma_brazo',
    enunciado: '¿Dónde se inserta el músculo braquial?',
    correcta: 'En la tuberosidad de la ulna', distractores: ['En la tuberosidad del radio', 'En el olécranon', 'En el epicóndilo lateral del húmero'],
    explicacion: 'En la tuberosidad de la ulna, justo por debajo de la articulación del codo, que flexiona.' },
  { id: 'suelo-fosa-cubital', fichas: ['braquial'], fuente: 'tma_brazo',
    enunciado: '¿Qué músculo, profundo al bíceps, forma el suelo de la fosa cubital?',
    correcta: 'Músculo braquial', distractores: ['Músculo coracobraquial', 'Músculo tríceps braquial', 'Músculo ancóneo'],
    explicacion: 'El braquial está por debajo del bíceps, más distal que los demás músculos del brazo, y forma el suelo de la fosa cubital.' },
  { id: 'cabeza-larga-triceps', fichas: ['triceps-braquial'], fuente: 'tma_brazo',
    enunciado: '¿Qué cabeza del tríceps braquial se origina en el tubérculo infraglenoideo de la escápula?',
    correcta: 'La cabeza larga', distractores: ['La cabeza lateral', 'La cabeza medial', 'Ninguna: el tríceps solo se origina en el húmero'],
    explicacion: 'La cabeza larga nace en el tubérculo infraglenoideo; la lateral y la medial, en el húmero, por encima y por debajo del surco del nervio radial.' },
  { id: 'surco-radial', fichas: ['nervio-radial', 'arteria-braquial-profunda', 'humero'], fuente: 'tma_humero',
    enunciado: '¿Qué vaso acompaña al nervio radial por el surco del nervio radial del húmero?',
    correcta: 'La arteria braquial profunda', distractores: ['La arteria braquial', 'La vena basílica', 'La vena cefálica'],
    explicacion: 'La arteria braquial profunda, rama de la braquial, discurre con el nervio radial por el surco del nervio radial.' },
  { id: 'ulnar-codo', fichas: ['nervio-ulnar', 'humero'], fuente: 'tma_ulnar',
    enunciado: '¿Por dónde cruza el codo el nervio ulnar?',
    correcta: 'Por detrás, entre el epicóndilo medial y el olécranon (túnel ulnar)',
    distractores: ['Por delante, a través de la fosa cubital', 'Por delante del epicóndilo lateral', 'Atravesando el músculo coracobraquial'],
    explicacion: 'Pasa por detrás del codo, por el túnel ulnar. Por la fosa cubital pasa el mediano; por delante del epicóndilo lateral, el radial; el coracobraquial lo atraviesa el musculocutáneo.' },
  { id: 'mediano-arteria', fichas: ['nervio-mediano', 'arteria-braquial'], fuente: 'tma_mediano',
    enunciado: '¿Qué relación tiene el nervio mediano con la arteria braquial en el brazo?',
    correcta: 'Va por fuera de ella arriba, la cruza a mitad del brazo y queda por dentro',
    distractores: ['Va siempre por dentro de ella', 'Va por detrás del húmero, en el surco del nervio radial', 'No tiene relación con ella: va por el compartimento posterior'],
    explicacion: 'Baja por fuera de la arteria braquial, la cruza hacia la mitad del brazo y queda por dentro; luego entra en el antebrazo por la fosa cubital.' },
  { id: 'origen-arteria-braquial', fichas: ['arteria-braquial'], fuente: 'tma_arterias',
    enunciado: '¿Dónde empieza la arteria braquial?',
    correcta: 'Continúa a la arteria axilar a partir del borde inferior del redondo mayor',
    distractores: ['Nace de la arteria braquial profunda en el surco del nervio radial', 'Nace directamente del arco aórtico', 'Empieza en la fosa cubital'],
    explicacion: 'Es la continuación de la arteria axilar desde el borde inferior del redondo mayor; en la fosa cubital se divide en las arterias radial y ulnar.' },
  { id: 'musculocutaneo-coracobraquial', fichas: ['nervio-musculocutaneo', 'coracobraquial'], fuente: 'tma_musculocutaneo',
    enunciado: '¿Qué músculo atraviesa el nervio musculocutáneo al salir de la axila?',
    correcta: 'El coracobraquial', distractores: ['El braquial', 'El tríceps braquial', 'El deltoides'],
    explicacion: 'Atraviesa el coracobraquial cerca de su inserción en el húmero y luego baja entre el bíceps y el braquial.' },
  { id: 'irrigacion-posterior', fichas: ['arteria-braquial-profunda', 'triceps-braquial'], fuente: 'tma_brazo',
    enunciado: '¿Qué arteria irriga el compartimento posterior del brazo?',
    correcta: 'La arteria braquial profunda', distractores: ['Ramas musculares de la arteria braquial', 'La arteria radial', 'La arteria ulnar'],
    explicacion: 'El compartimento posterior lo irriga la arteria braquial profunda; el anterior, ramas musculares de la arteria braquial.' },
];

export const MODULO_BRAZO = {
  id: 'brazo',
  version: '2026-11-09',        // cambiarla cuando cambie el contenido evaluable (el progreso guarda con cuál se hizo)
  titulo: 'El brazo: compartimentos anterior y posterior',
  region: 'Miembro superior › Brazo',
  publico: 'Estudiantes universitarios de anatomía básica (supuesto inicial, por validar)',
  objetivos: [
    'Identificar en 3D, sin etiquetas, los músculos de los compartimentos anterior y posterior del brazo y el húmero.',
    'Decir el origen, la inserción, la acción principal y la inervación de cada músculo del brazo.',
    'Relacionar cada compartimento con su nervio (musculocutáneo o radial) y su arteria principal (braquial o braquial profunda).',
    'Situar el nervio radial en el surco del nervio radial del húmero y el ulnar detrás del epicóndilo medial.',
  ],
  // Lo que se evalúa; el resto se explora como contexto.
  nucleo: ['humero', 'biceps-braquial', 'coracobraquial', 'braquial', 'triceps-braquial', 'nervio-musculocutaneo', 'nervio-radial',
    'nervio-mediano', 'nervio-ulnar', 'arteria-braquial'],
  contexto: ['anconeo', 'arteria-braquial-profunda', 'vena-cefalica', 'vena-basilica', 'venas-braquiales'],
  estructuras: ESTRUCTURAS,
  leccion: LECCION,
  preguntas: PREGUNTAS,
  // Nombres de otros huesos para preguntar por el húmero (la única ficha de hueso del módulo).
  distractoresExtra: { humero: ['Radio', 'Ulna', 'Escápula', 'Clavícula'] },
  revision: REVISION,
};
