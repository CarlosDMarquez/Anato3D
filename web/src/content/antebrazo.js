// Módulo «El antebrazo: compartimento anterior». Esquema en schema.js; fuentes en fuentes.js.
//
// Redactado el 2026-11-08 por Claude (IA) a partir de las fuentes citadas, que se leyeron ese día: cada campo resume lo
// que dice su fuente, sin añadir datos de memoria, y cada afirmación se comprobó con un fragmento literal de la página
// (docs/fuentes/antebrazo-2026-11-08.md). Paquete para el especialista: docs/revision/antebrazo-2026-11-08.md.
// NO lo ha revisado ningún especialista (estado «borrador»).
// Como en el módulo del brazo, las correlaciones clínicas se dejan fuera hasta que las revise un especialista.

const REVISION = {
  estado: 'borrador',
  revisor: null,
  fecha: null,
  notas: 'Redactado por IA (Claude) a partir de las fuentes citadas, el 2026-11-08. Pendiente de revisión por un especialista.',
};
const TERM = (...terminos) => terminos.map((termino) => ({ fuente: 'ta2', termino }));
const MODELOS = ['male', 'female'];
// Los nervios y vasos del modelo femenino son los de Z-Anatomy (un cuerpo masculino) ajustados al cuerpo femenino.
const FEMENINO_HEREDADO = 'Modelo femenino: el trayecto procede del modelo masculino de Z-Anatomy ajustado al cuerpo femenino; no se ha revisado por separado.';
const HUESO_AJUSTADO = 'Hueso de Z-Anatomy (BodyParts3D) ajustado al cuerpo de MakeHuman; la longitud de los segmentos del brazo se redistribuyó con las proporciones de Z-Anatomy.';
// La página da el riego del compartimento entero, no el de cada músculo.
const RIEGO = 'Arterias ulnar y radial (las del compartimento anterior del antebrazo).';
const REGION = 'Miembro superior › Antebrazo';

const ESTRUCTURAS = [
  // ── Huesos ──
  {
    id: 'radio', tipo: 'hueso', nombre: 'Radio', latin: 'Radius', ta2: '1210',
    region: REGION, lado: 'bilateral', modelos: MODELOS, piezas: ['Radius'],
    descripcion: 'Hueso largo del antebrazo, lateral y paralelo a la ulna. Gira alrededor de la ulna y así produce el movimiento de las articulaciones radioulnares proximal y distal.',
    funcion: 'Al girar alrededor de la ulna mueve el antebrazo en las articulaciones radioulnares, y da inserción al bíceps braquial y al pronador redondo.',
    campos: {
      partes: 'Proximal: cabeza (un disco de superficie articular cóncava, más gruesa por dentro), cuello y tuberosidad del radio. Diáfisis triangular, con tres bordes y tres caras, que se ensancha hacia abajo. Distal: proceso estiloides en el lado lateral y escotadura ulnar en el medial.',
      articulaciones: 'Codo: la cabeza del radio con el capítulo del húmero. Radioulnar proximal: la cabeza del radio con la escotadura radial de la ulna. Muñeca: el extremo distal con los huesos del carpo (escafoides y semilunar). Radioulnar distal: la escotadura ulnar con la cabeza de la ulna.',
      inserciones: 'Tuberosidad del radio: bíceps braquial. Mitad de la cara lateral de la diáfisis: pronador redondo. Cara anterior: flexor largo del pulgar y pronador cuadrado. Diáfisis: cabeza radial del flexor superficial de los dedos.',
    },
    relaciones: [
      { texto: 'El radio y la ulna están unidos por la membrana interósea.', con: 'ulna', fuente: 'tma_radio' },
      { texto: 'La inserción del pronador redondo forma una pequeña rugosidad en la mitad de la cara lateral.', con: 'pronador-redondo', fuente: 'tma_radio' },
    ],
    simplificaciones: [HUESO_AJUSTADO],
    fuentes: {
      terminologia: TERM('1210'),
      contenido: [{ fuente: 'tma_radio', apoya: ['descripcion', 'funcion', 'partes', 'articulaciones', 'inserciones'] }, { fuente: 'tma_antebrazo_ant', apoya: ['inserciones'] }],
    },
    revision: REVISION,
  },
  {
    id: 'ulna', tipo: 'hueso', nombre: 'Ulna', latin: 'Ulna', ta2: '1230',
    region: REGION, lado: 'bilateral', modelos: MODELOS, piezas: ['Ulna'],
    descripcion: 'Hueso largo del antebrazo, medial y paralelo al radio. Es el hueso estable: el radio gira a su alrededor para producir el movimiento.',
    funcion: 'Forma con el húmero la articulación del codo y da inserción a músculos como el tríceps braquial, el braquial y el pronador cuadrado.',
    campos: {
      partes: 'Proximal: olécranon (se palpa como la «punta» del codo), proceso coronoides, escotadura troclear (formada por los dos anteriores), escotadura radial y tuberosidad de la ulna. Diáfisis triangular, con tres bordes y tres caras, que se estrecha hacia abajo; su borde posterior se palpa a lo largo de todo el antebrazo. Distal: cabeza redondeada y proceso estiloides de la ulna.',
      articulaciones: 'Codo: la escotadura troclear con la tróclea del húmero. Radioulnar proximal: la escotadura radial con la cabeza del radio. Radioulnar distal: la cabeza de la ulna con la escotadura ulnar del radio.',
      inserciones: 'Olécranon: tríceps braquial y cabeza ulnar del flexor ulnar del carpo. Tuberosidad de la ulna: braquial. Proceso coronoides: una de las dos cabezas del pronador redondo. Ulna y membrana interósea: flexor profundo de los dedos. Parte distal de la cara anterior: pronador cuadrado.',
    },
    relaciones: [
      { texto: 'Por su escotadura radial se articula con la cabeza del radio.', con: 'radio', fuente: 'tma_ulna' },
      { texto: 'El borde interóseo da inserción a la membrana interósea, que une los dos huesos del antebrazo.', con: 'radio', fuente: 'tma_ulna' },
    ],
    simplificaciones: [HUESO_AJUSTADO],
    fuentes: {
      terminologia: TERM('1230'),
      contenido: [{ fuente: 'tma_ulna', apoya: ['descripcion', 'funcion', 'partes', 'articulaciones', 'inserciones'] }, { fuente: 'tma_antebrazo_ant', apoya: ['inserciones'] }],
    },
    revision: REVISION,
  },

  // ── Capa superficial ──
  {
    id: 'pronador-redondo', tipo: 'musculo', nombre: 'Músculo pronador redondo', latin: 'Musculus pronator teres', ta2: '2478',
    region: REGION, compartimento: 'anterior, capa superficial', lado: 'bilateral', modelos: MODELOS,
    piezas: ['Superficial_head_of_pronator_teres', 'Deep_head_of_pronator_teres'],
    descripcion: 'Músculo de la capa superficial del compartimento anterior del antebrazo, con dos orígenes. Su borde lateral forma el borde medial de la fosa cubital.',
    campos: {
      origen: 'Epicóndilo medial del húmero (por el tendón común de los flexores superficiales) y proceso coronoides de la ulna.',
      insercion: 'Mitad de la diáfisis del radio, por su cara lateral.',
      accion: 'Prona el antebrazo.',
      inervacion: 'Nervio mediano.',
      irrigacion: RIEGO,
    },
    relaciones: [
      { texto: 'El nervio mediano pasa entre sus dos cabezas.', fuente: 'tma_mediano' },
      { texto: 'Se inserta en la rugosidad de la mitad de la cara lateral del radio.', con: 'radio', fuente: 'tma_radio' },
    ],
    simplificaciones: [],
    fuentes: {
      terminologia: TERM('2478', '2479', '2480'),
      contenido: [{ fuente: 'tma_antebrazo_ant', apoya: ['descripcion', 'origen', 'insercion', 'accion', 'inervacion', 'irrigacion'] }],
    },
    revision: REVISION,
  },
  {
    id: 'flexor-radial-carpo', tipo: 'musculo', nombre: 'Músculo flexor radial del carpo', latin: 'Musculus flexor radialis carpi', ta2: '2481',
    region: REGION, compartimento: 'anterior, capa superficial', lado: 'bilateral', modelos: MODELOS, piezas: ['Flexor_carpi_radialis'],
    descripcion: 'Músculo de la capa superficial del compartimento anterior del antebrazo. Como los otros flexores superficiales, nace del tendón común del epicóndilo medial del húmero.',
    campos: {
      origen: 'Epicóndilo medial del húmero.',
      insercion: 'Base de los metacarpianos II y III.',
      accion: 'Flexiona la muñeca y la lleva hacia el lado del radio (abducción).',
      inervacion: 'Nervio mediano.',
      irrigacion: RIEGO,
    },
    relaciones: [
      { texto: 'El pulso radial se palpa en la parte distal del antebrazo, justo por fuera de su tendón.', con: 'arteria-radial', fuente: 'tma_arterias' },
    ],
    simplificaciones: [],
    fuentes: {
      terminologia: TERM('2481'),
      contenido: [{ fuente: 'tma_antebrazo_ant', apoya: ['descripcion', 'origen', 'insercion', 'accion', 'inervacion', 'irrigacion'] }],
    },
    revision: REVISION,
  },
  {
    id: 'palmar-largo', tipo: 'musculo', nombre: 'Músculo palmar largo', latin: 'Musculus palmaris longus', ta2: '2482',
    region: REGION, compartimento: 'anterior, capa superficial', lado: 'bilateral', modelos: MODELOS, piezas: ['Palmaris_longus_muscle'],
    descripcion: 'Músculo de la capa superficial del compartimento anterior del antebrazo. Falta en alrededor del 15 % de las personas.',
    campos: {
      origen: 'Epicóndilo medial del húmero.',
      insercion: 'Retináculo de los flexores y aponeurosis palmar de la mano.',
      accion: 'Flexiona la muñeca.',
      inervacion: 'Nervio mediano.',
      irrigacion: RIEGO,
    },
    relaciones: [],
    simplificaciones: ['El modelo lo muestra en los dos lados, aunque falta en alrededor del 15 % de las personas.'],
    fuentes: {
      terminologia: TERM('2482'),
      contenido: [{ fuente: 'tma_antebrazo_ant', apoya: ['descripcion', 'origen', 'insercion', 'accion', 'inervacion', 'irrigacion'] }],
    },
    revision: REVISION,
  },
  {
    id: 'flexor-ulnar-carpo', tipo: 'musculo', nombre: 'Músculo flexor ulnar del carpo', latin: 'Musculus flexor ulnaris carpi', ta2: '2483',
    region: REGION, compartimento: 'anterior, capa superficial', lado: 'bilateral', modelos: MODELOS,
    piezas: ['Humeral_head_of_flexor_carpi_ulnaris', 'Ulnar_head_of_flexor_carpi_ulnaris'],
    descripcion: 'Músculo de la capa superficial del compartimento anterior del antebrazo, con dos cabezas: humeral y ulnar. En este compartimento, solo él y la mitad medial del flexor profundo de los dedos no los inerva el nervio mediano.',
    campos: {
      origen: 'Cabeza humeral: epicóndilo medial del húmero, con los otros flexores superficiales. Cabeza ulnar: olécranon de la ulna.',
      insercion: 'Hueso pisiforme, gancho del ganchoso y base del quinto metacarpiano.',
      accion: 'Flexiona la muñeca y la lleva hacia el lado de la ulna (aducción).',
      inervacion: 'Nervio ulnar.',
      irrigacion: RIEGO,
    },
    relaciones: [
      { texto: 'Su cabeza ulnar nace del olécranon de la ulna.', con: 'ulna', fuente: 'tma_antebrazo_ant' },
    ],
    simplificaciones: [],
    fuentes: {
      terminologia: TERM('2483', '2484', '2485'),
      contenido: [{ fuente: 'tma_antebrazo_ant', apoya: ['descripcion', 'origen', 'insercion', 'accion', 'inervacion', 'irrigacion'] }],
    },
    revision: REVISION,
  },

  // ── Capa intermedia ──
  {
    id: 'flexor-superficial-dedos', tipo: 'musculo', nombre: 'Músculo flexor superficial de los dedos', latin: 'Musculus flexor superficialis digitorum', ta2: '2486',
    region: REGION, compartimento: 'anterior, capa intermedia', lado: 'bilateral', modelos: MODELOS,
    piezas: ['Humero_ulnar_head_of_flexor_digitorum_superficialis', 'Radial_head_of_flexor_digitorum_superficialis'],
    descripcion: 'Único músculo de la capa intermedia del compartimento anterior del antebrazo: en la mayoría de las personas está entre las capas superficial y profunda. Es una buena referencia anatómica: el nervio mediano y la arteria ulnar pasan entre sus dos cabezas.',
    campos: {
      origen: 'Una cabeza, del epicóndilo medial del húmero; la otra, del radio.',
      insercion: 'Se divide en cuatro tendones que pasan por el túnel carpiano y se insertan en la base de la falange media de los cuatro dedos.',
      accion: 'Flexiona las articulaciones metacarpofalángicas e interfalángicas proximales de los cuatro dedos, y la muñeca.',
      inervacion: 'Nervio mediano.',
      irrigacion: RIEGO,
    },
    relaciones: [
      { texto: 'La arteria ulnar y el nervio mediano pasan entre sus dos cabezas.', con: 'arteria-ulnar', fuente: 'tma_antebrazo_ant' },
      { texto: 'El nervio mediano baja entre él y el flexor profundo de los dedos.', con: 'flexor-profundo-dedos', fuente: 'tma_mediano' },
    ],
    simplificaciones: [],
    fuentes: {
      terminologia: TERM('2486', '2487', '2488'),
      contenido: [{ fuente: 'tma_antebrazo_ant', apoya: ['descripcion', 'origen', 'insercion', 'accion', 'inervacion', 'irrigacion'] }],
    },
    revision: REVISION,
  },

  // ── Capa profunda ──
  {
    id: 'flexor-profundo-dedos', tipo: 'musculo', nombre: 'Músculo flexor profundo de los dedos', latin: 'Musculus flexor profundus digitorum', ta2: '2491',
    region: REGION, compartimento: 'anterior, capa profunda', lado: 'bilateral', modelos: MODELOS, piezas: ['Flexor_digitorum_profundus'],
    descripcion: 'Músculo de la capa profunda del compartimento anterior del antebrazo. Es el único músculo que puede flexionar las articulaciones interfalángicas distales de los dedos.',
    campos: {
      origen: 'Ulna y membrana interósea.',
      insercion: 'Se divide en cuatro tendones que pasan por el túnel carpiano y se insertan en las falanges distales de los cuatro dedos.',
      accion: 'Flexiona las articulaciones interfalángicas distales de los dedos y también las metacarpofalángicas y la muñeca.',
      inervacion: 'Mitad medial (dedos anular y meñique): nervio ulnar. Mitad lateral (dedos medio e índice): nervio interóseo anterior, rama del mediano.',
      irrigacion: RIEGO,
    },
    relaciones: [
      { texto: 'Su mitad lateral la inerva el nervio interóseo anterior.', con: 'nervio-interoseo-anterior', fuente: 'tma_antebrazo_ant' },
      { texto: 'El flexor largo del pulgar está por fuera de él.', con: 'flexor-largo-pulgar', fuente: 'tma_antebrazo_ant' },
    ],
    simplificaciones: [],
    fuentes: {
      terminologia: TERM('2491'),
      contenido: [{ fuente: 'tma_antebrazo_ant', apoya: ['descripcion', 'origen', 'insercion', 'accion', 'inervacion', 'irrigacion'] }],
    },
    revision: REVISION,
  },
  {
    id: 'flexor-largo-pulgar', tipo: 'musculo', nombre: 'Músculo flexor largo del pulgar', latin: 'Musculus flexor longus pollicis', ta2: '2492',
    region: REGION, compartimento: 'anterior, capa profunda', lado: 'bilateral', modelos: MODELOS, piezas: ['Flexor_pollicis_longus'],
    descripcion: 'Músculo de la capa profunda del compartimento anterior del antebrazo, lateral al flexor profundo de los dedos.',
    campos: {
      origen: 'Cara anterior del radio y membrana interósea vecina.',
      insercion: 'Base de la falange distal del pulgar.',
      accion: 'Flexiona las articulaciones interfalángica y metacarpofalángica del pulgar.',
      inervacion: 'Nervio interóseo anterior, rama del nervio mediano.',
      irrigacion: RIEGO,
    },
    relaciones: [
      { texto: 'Nace de la cara anterior del radio.', con: 'radio', fuente: 'tma_antebrazo_ant' },
    ],
    simplificaciones: [],
    fuentes: {
      terminologia: TERM('2492'),
      contenido: [{ fuente: 'tma_antebrazo_ant', apoya: ['descripcion', 'origen', 'insercion', 'accion', 'inervacion', 'irrigacion'] }],
    },
    revision: REVISION,
  },
  {
    id: 'pronador-cuadrado', tipo: 'musculo', nombre: 'Músculo pronador cuadrado', latin: 'Musculus pronator quadratus', ta2: '2493',
    region: REGION, compartimento: 'anterior, capa profunda', lado: 'bilateral', modelos: MODELOS, piezas: ['Pronator_quadratus'],
    descripcion: 'Músculo de forma cuadrada de la capa profunda del compartimento anterior del antebrazo, por debajo de los tendones del flexor profundo de los dedos y del flexor largo del pulgar.',
    campos: {
      origen: 'Cara anterior de la ulna.',
      insercion: 'Cara anterior del radio.',
      accion: 'Prona el antebrazo.',
      inervacion: 'Nervio interóseo anterior, rama del nervio mediano.',
      irrigacion: RIEGO,
    },
    relaciones: [
      { texto: 'Nace de la parte distal de la cara anterior de la ulna.', con: 'ulna', fuente: 'tma_ulna' },
    ],
    simplificaciones: [],
    fuentes: {
      terminologia: TERM('2493'),
      contenido: [{ fuente: 'tma_antebrazo_ant', apoya: ['descripcion', 'origen', 'insercion', 'accion', 'inervacion', 'irrigacion'] }],
    },
    revision: REVISION,
  },

  // ── Arterias y nervio ──
  {
    id: 'arteria-radial', tipo: 'arteria', nombre: 'Arteria radial', latin: 'Arteria radialis', ta2: '4641',
    region: REGION, lado: 'bilateral', modelos: MODELOS, piezas: ['Radial_artery'],
    descripcion: 'Una de las dos arterias en que se divide la braquial dentro de la fosa cubital. Irriga la parte posterolateral del antebrazo.',
    funcion: 'Lleva sangre al antebrazo y, con la arteria ulnar, a la mano.',
    campos: {
      origen: 'Bifurcación de la arteria braquial en la fosa cubital.',
      trayecto: 'Entra en la mano por el dorso, cruzando el suelo de la tabaquera anatómica; después gira hacia dentro, pasa entre las cabezas del aductor del pulgar y continúa como arco palmar profundo.',
      ramas: 'Una rama para el pulgar, otra para el índice y otra para el arco palmar superficial; contribuye a las redes anastomóticas que rodean el codo y los huesos del carpo.',
      territorio: 'Parte posterolateral del antebrazo y, en la mano, el pulgar, el índice y los arcos palmares.',
    },
    relaciones: [
      { texto: 'Su pulso se palpa en la parte distal del antebrazo, justo por fuera del tendón del flexor radial del carpo.', con: 'flexor-radial-carpo', fuente: 'tma_arterias' },
      { texto: 'Con la arteria ulnar forma en la mano dos arcos: el palmar superficial y el palmar profundo.', con: 'arteria-ulnar', fuente: 'tma_arterias' },
    ],
    simplificaciones: [FEMENINO_HEREDADO],
    fuentes: {
      terminologia: TERM('4641'),
      contenido: [{ fuente: 'tma_arterias', apoya: ['descripcion', 'funcion', 'origen', 'trayecto', 'ramas', 'territorio'] }],
    },
    revision: REVISION,
  },
  {
    id: 'arteria-ulnar', tipo: 'arteria', nombre: 'Arteria ulnar', latin: 'Arteria ulnaris', ta2: '4655',
    region: REGION, lado: 'bilateral', modelos: MODELOS, piezas: ['Ulnar_artery'],
    descripcion: 'La otra arteria en que se divide la braquial dentro de la fosa cubital. Irriga la parte anteromedial del antebrazo.',
    funcion: 'Lleva sangre al antebrazo y, con la arteria radial, a la mano.',
    campos: {
      origen: 'Bifurcación de la arteria braquial en la fosa cubital.',
      trayecto: 'Pasa entre las dos cabezas del flexor superficial de los dedos y entra en la mano por delante del retináculo de los flexores y por fuera del nervio ulnar; allí da la rama palmar profunda y cruza la palma como arco palmar superficial.',
      ramas: 'Arterias interóseas anterior y posterior, que irrigan las estructuras profundas del antebrazo, y rama palmar profunda; contribuye a la red anastomótica que rodea el codo.',
      territorio: 'Parte anteromedial del antebrazo, sus estructuras profundas (por las interóseas) y la mano.',
    },
    relaciones: [
      { texto: 'Pasa entre las dos cabezas del flexor superficial de los dedos, con el nervio mediano.', con: 'flexor-superficial-dedos', fuente: 'tma_antebrazo_ant' },
    ],
    simplificaciones: [FEMENINO_HEREDADO],
    fuentes: {
      terminologia: TERM('4655'),
      contenido: [{ fuente: 'tma_arterias', apoya: ['descripcion', 'funcion', 'origen', 'trayecto', 'ramas', 'territorio'] }, { fuente: 'tma_antebrazo_ant', apoya: ['trayecto'] }],
    },
    revision: REVISION,
  },
  {
    id: 'nervio-interoseo-anterior', tipo: 'nervio', nombre: 'Nervio interóseo anterior del antebrazo', latin: 'Nervus interosseus anterior antebrachii', ta2: '6460',
    region: REGION, lado: 'bilateral', modelos: MODELOS, piezas: ['Anterior_interosseous_nerve_of_forearm'],
    descripcion: 'Una de las dos ramas principales que da el nervio mediano en el antebrazo. Inerva los músculos profundos del compartimento anterior.',
    funcion: 'Mueve los flexores profundos: flexiona el pulgar y los dedos índice y medio, y prona el antebrazo con el pronador cuadrado.',
    campos: {
      origen: 'Nervio mediano, en el antebrazo.',
      trayecto: 'Acompaña a la arteria interósea anterior por delante de la membrana interósea, entre el flexor largo del pulgar y el flexor profundo de los dedos, y termina en el pronador cuadrado y la articulación de la muñeca.',
      inerva: 'Flexor largo del pulgar, pronador cuadrado y mitad lateral del flexor profundo de los dedos (la medial la inerva el nervio ulnar).',
    },
    relaciones: [
      { texto: 'Va entre el flexor largo del pulgar y el flexor profundo de los dedos.', con: 'flexor-largo-pulgar', fuente: 'wp_interoseo_anterior' },
      { texto: 'Termina en el pronador cuadrado.', con: 'pronador-cuadrado', fuente: 'wp_interoseo_anterior' },
    ],
    simplificaciones: [FEMENINO_HEREDADO],
    fuentes: {
      terminologia: TERM('6460'),
      contenido: [{ fuente: 'tma_mediano', apoya: ['descripcion', 'origen', 'inerva'] }, { fuente: 'tma_antebrazo_ant', apoya: ['funcion'] },
        { fuente: 'wp_interoseo_anterior', apoya: ['trayecto'] }],
    },
    revision: REVISION,
  },
];

// Pasos de la lección. `tipo` (biblioteca de estudio, src/biblioteca/formato.js): orientación, explicación, relaciones o
// síntesis. La orientación y la síntesis se añadieron el 2026-11-09 al pasar el módulo a la biblioteca.
const LECCION = [
  { id: 'orientacion', tipo: 'orientacion', titulo: 'Tres capas de flexores y pronadores',
    fichas: ['pronador-redondo', 'flexor-radial-carpo', 'palmar-largo', 'flexor-ulnar-carpo', 'flexor-superficial-dedos', 'flexor-profundo-dedos', 'flexor-largo-pulgar', 'pronador-cuadrado'],
    fuentes: ['tma_antebrazo_ant'],
    texto: 'El compartimento anterior del antebrazo reúne músculos que sobre todo flexionan y pronan. Se ordenan en tres capas según su profundidad: cuatro superficiales, uno intermedio y tres profundos. La mayoría los inerva el nervio mediano.' },
  { id: 'huesos', tipo: 'explicacion', titulo: 'Radio y ulna', fichas: ['radio', 'ulna'], fuentes: ['tma_radio', 'tma_ulna'],
    texto: 'Los dos huesos del antebrazo. La ulna, medial, es el hueso estable; el radio, lateral, gira a su alrededor en las articulaciones radioulnares proximal y distal.' },
  { id: 'superficial', tipo: 'explicacion', titulo: 'Capa superficial', fichas: ['pronador-redondo', 'flexor-radial-carpo', 'palmar-largo', 'flexor-ulnar-carpo'], fuentes: ['tma_antebrazo_ant'],
    texto: 'Cuatro músculos que nacen de un tendón común en el epicóndilo medial del húmero: flexor ulnar del carpo, palmar largo, flexor radial del carpo y pronador redondo. Los inerva el nervio mediano, salvo el flexor ulnar del carpo, que inerva el ulnar.' },
  { id: 'intermedia', tipo: 'explicacion', titulo: 'Capa intermedia', fichas: ['flexor-superficial-dedos'], fuentes: ['tma_antebrazo_ant'],
    texto: 'Un solo músculo, el flexor superficial de los dedos. Sus cuatro tendones llegan a la falange media de los dedos, y entre sus dos cabezas pasan el nervio mediano y la arteria ulnar.' },
  { id: 'profunda', tipo: 'explicacion', titulo: 'Capa profunda', fichas: ['flexor-profundo-dedos', 'flexor-largo-pulgar', 'pronador-cuadrado', 'nervio-interoseo-anterior'],
    fuentes: ['tma_antebrazo_ant', 'tma_mediano'],
    texto: 'Flexor profundo de los dedos, flexor largo del pulgar y pronador cuadrado. Los inerva el nervio interóseo anterior, rama del mediano, salvo la mitad medial del flexor profundo, que inerva el ulnar.' },
  { id: 'arterias', tipo: 'relaciones', titulo: 'Arterias radial y ulnar', fichas: ['arteria-radial', 'arteria-ulnar'], fuentes: ['tma_arterias'],
    texto: 'La braquial se divide en la fosa cubital en radial y ulnar. La radial irriga la parte posterolateral del antebrazo y la ulnar, la anteromedial; en la mano se unen en los arcos palmares superficial y profundo.' },
  { id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
    fichas: ['pronador-redondo', 'flexor-radial-carpo', 'palmar-largo', 'flexor-ulnar-carpo', 'flexor-superficial-dedos', 'flexor-profundo-dedos', 'flexor-largo-pulgar', 'pronador-cuadrado'],
    fuentes: ['tma_antebrazo_ant'],
    texto: 'Capa superficial: flexor ulnar del carpo, palmar largo, flexor radial del carpo y pronador redondo, que nacen de un tendón común en el epicóndilo medial. Capa intermedia: flexor superficial de los dedos. Capa profunda: flexor largo del pulgar, flexor profundo de los dedos y pronador cuadrado. Los inerva el nervio mediano, salvo el flexor ulnar del carpo y la mitad medial del flexor profundo de los dedos, que inerva el nervio ulnar.' },
];

const PREGUNTAS = [
  { id: 'capas', fichas: ['flexor-superficial-dedos'], fuente: 'tma_antebrazo_ant',
    enunciado: '¿En qué capa del compartimento anterior del antebrazo está el flexor superficial de los dedos?',
    correcta: 'En la capa intermedia, de la que es el único músculo', distractores: ['En la capa superficial', 'En la capa profunda', 'En el compartimento posterior'],
    explicacion: 'La capa intermedia la forma solo el flexor superficial de los dedos: por encima están los cuatro músculos superficiales y por debajo, los tres profundos.' },
  { id: 'origen-comun', fichas: ['pronador-redondo', 'flexor-radial-carpo', 'palmar-largo', 'flexor-ulnar-carpo'], fuente: 'tma_antebrazo_ant',
    enunciado: '¿De dónde nacen, por un tendón común, los cuatro músculos de la capa superficial del compartimento anterior del antebrazo?',
    correcta: 'Del epicóndilo medial del húmero', distractores: ['Del epicóndilo lateral del húmero', 'Del proceso coronoides de la ulna', 'De la tuberosidad del radio'],
    explicacion: 'Flexor ulnar del carpo, palmar largo, flexor radial del carpo y pronador redondo nacen de un tendón común en el epicóndilo medial; el pronador redondo y el flexor ulnar del carpo tienen además un segundo origen en la ulna.' },
  { id: 'inervacion-fuc', fichas: ['flexor-ulnar-carpo'], fuente: 'tma_antebrazo_ant',
    enunciado: '¿Qué nervio inerva el flexor ulnar del carpo?',
    correcta: 'Nervio ulnar', distractores: ['Nervio mediano', 'Nervio radial', 'Nervio musculocutáneo'],
    explicacion: 'Con la mitad medial del flexor profundo de los dedos, es la excepción: el resto del compartimento anterior lo inerva el nervio mediano.' },
  { id: 'inervacion-fpd', fichas: ['flexor-profundo-dedos', 'nervio-interoseo-anterior'], fuente: 'tma_antebrazo_ant',
    enunciado: '¿Cómo se inerva el flexor profundo de los dedos?',
    correcta: 'Mitad medial, nervio ulnar; mitad lateral, nervio interóseo anterior (rama del mediano)',
    distractores: ['Todo él por el nervio mediano', 'Todo él por el nervio ulnar', 'Mitad medial, nervio mediano; mitad lateral, nervio ulnar'],
    explicacion: 'La mitad medial, que actúa sobre el anular y el meñique, la inerva el nervio ulnar; la lateral, que actúa sobre el medio y el índice, el nervio interóseo anterior.' },
  { id: 'interfalangicas-distales', fichas: ['flexor-profundo-dedos'], fuente: 'tma_antebrazo_ant',
    enunciado: '¿Qué músculo es el único que puede flexionar las articulaciones interfalángicas distales de los dedos?',
    correcta: 'Flexor profundo de los dedos', distractores: ['Flexor superficial de los dedos', 'Flexor largo del pulgar', 'Palmar largo'],
    explicacion: 'Sus tendones llegan a las falanges distales; los del flexor superficial se quedan en la base de las falanges medias.' },
  { id: 'insercion-fsd', fichas: ['flexor-superficial-dedos'], fuente: 'tma_antebrazo_ant',
    enunciado: '¿Dónde se insertan los tendones del flexor superficial de los dedos?',
    correcta: 'En la base de la falange media de los cuatro dedos',
    distractores: ['En las falanges distales de los cuatro dedos', 'En la base de los metacarpianos II y III', 'En el retináculo de los flexores y la aponeurosis palmar'],
    explicacion: 'Sus cuatro tendones pasan por el túnel carpiano y se insertan en la base de la falange media.' },
  { id: 'insercion-frc', fichas: ['flexor-radial-carpo'], fuente: 'tma_antebrazo_ant',
    enunciado: '¿Dónde se inserta el flexor radial del carpo?',
    correcta: 'En la base de los metacarpianos II y III',
    distractores: ['En el pisiforme, el gancho del ganchoso y la base del quinto metacarpiano', 'En la mitad de la diáfisis del radio', 'En el retináculo de los flexores y la aponeurosis palmar'],
    explicacion: 'Nace del epicóndilo medial y se inserta en la base de los metacarpianos II y III; flexiona la muñeca y la lleva hacia el lado del radio.' },
  { id: 'pronadores', fichas: ['pronador-redondo', 'pronador-cuadrado'], fuente: 'tma_antebrazo_ant',
    enunciado: '¿Qué dos músculos del compartimento anterior pronan el antebrazo?',
    correcta: 'Pronador redondo y pronador cuadrado',
    distractores: ['Flexor radial del carpo y palmar largo', 'Flexor ulnar del carpo y flexor profundo de los dedos', 'Flexor superficial de los dedos y flexor largo del pulgar'],
    explicacion: 'Los dos pronadores; los dos los inerva el nervio mediano (el cuadrado, por su rama interósea anterior).' },
  { id: 'palmar-largo-ausente', fichas: ['palmar-largo'], fuente: 'tma_antebrazo_ant',
    enunciado: '¿Qué músculo del compartimento anterior falta en alrededor del 15 % de las personas?',
    correcta: 'Palmar largo', distractores: ['Flexor radial del carpo', 'Pronador cuadrado', 'Flexor largo del pulgar'],
    explicacion: 'El palmar largo falta en alrededor del 15 % de la población.' },
  { id: 'inervacion-flp', fichas: ['flexor-largo-pulgar', 'nervio-interoseo-anterior'], fuente: 'tma_antebrazo_ant',
    enunciado: '¿Qué nervio inerva el flexor largo del pulgar?',
    correcta: 'Nervio interóseo anterior (rama del mediano)', distractores: ['Nervio ulnar', 'Nervio radial', 'Nervio musculocutáneo'],
    explicacion: 'La rama interósea anterior del mediano inerva los tres músculos profundos, salvo la mitad medial del flexor profundo de los dedos.' },
  { id: 'pulso-radial', fichas: ['arteria-radial', 'flexor-radial-carpo'], fuente: 'tma_arterias',
    enunciado: '¿Dónde se palpa el pulso radial?',
    correcta: 'En la parte distal del antebrazo, justo por fuera del tendón del flexor radial del carpo',
    distractores: ['Justo por dentro del tendón del flexor ulnar del carpo', 'En la fosa cubital, por debajo de la aponeurosis bicipital', 'Detrás del epicóndilo medial del húmero'],
    explicacion: 'La arteria radial se palpa en la parte distal del antebrazo, inmediatamente lateral al tendón del flexor radial del carpo.' },
  { id: 'ulna-codo', fichas: ['ulna'], fuente: 'tma_ulna',
    enunciado: '¿Con qué parte del húmero se articula la ulna en el codo?',
    correcta: 'Con la tróclea, por la escotadura troclear',
    distractores: ['Con el capítulo, por la cabeza de la ulna', 'Con la cabeza del húmero, por el olécranon', 'Con el epicóndilo lateral, por el proceso coronoides'],
    explicacion: 'La escotadura troclear, formada por el olécranon y el proceso coronoides, se articula con la tróclea del húmero; el capítulo se articula con la cabeza del radio.' },
];

export const MODULO_ANTEBRAZO = {
  id: 'antebrazo',
  version: '2026-11-09',        // cambiarla cuando cambie el contenido evaluable (el progreso guarda con cuál se hizo)
  titulo: 'El antebrazo: compartimento anterior',
  region: REGION,
  publico: 'Estudiantes universitarios de anatomía básica (supuesto inicial, por validar)',
  objetivos: [
    'Identificar en 3D, sin etiquetas, el radio, la ulna y los ocho músculos del compartimento anterior del antebrazo.',
    'Ordenar esos músculos en sus capas superficial, intermedia y profunda.',
    'Decir el origen, la inserción, la acción principal y la inervación de cada músculo del compartimento anterior.',
    'Distinguir lo que inervan el nervio mediano, su rama interósea anterior y el nervio ulnar en el compartimento anterior.',
    'Situar las arterias radial y ulnar y el lugar donde se palpa el pulso radial.',
  ],
  // Lo que se evalúa; el resto se explora como contexto.
  nucleo: ['radio', 'ulna', 'pronador-redondo', 'flexor-radial-carpo', 'palmar-largo', 'flexor-ulnar-carpo', 'flexor-superficial-dedos',
    'flexor-profundo-dedos', 'flexor-largo-pulgar', 'pronador-cuadrado'],
  contexto: ['arteria-radial', 'arteria-ulnar', 'nervio-interoseo-anterior'],
  estructuras: ESTRUCTURAS,
  leccion: LECCION,
  preguntas: PREGUNTAS,
  // Nombres con los que confundir las estructuras que tienen pocas compañeras de su grupo en el módulo: los huesos (solo
  // radio y ulna) y, para el repaso, las de contexto (dos arterias y un nervio). El repaso pregunta también por ellas.
  distractoresExtra: {
    radio: ['Húmero', 'Escafoides', 'Semilunar'],
    ulna: ['Húmero', 'Escafoides', 'Semilunar'],
    'arteria-radial': ['Arteria braquial', 'Arteria braquial profunda'],
    'arteria-ulnar': ['Arteria braquial', 'Arteria braquial profunda'],
    'nervio-interoseo-anterior': ['Nervio mediano', 'Nervio ulnar', 'Nervio radial'],
  },
  revision: REVISION,
};
