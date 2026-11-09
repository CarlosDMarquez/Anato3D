// Lección «El codo y la fosa cubital». Formato y evidencias: ../formato.js.
import { leccion, W, T, GUIA, MODELO } from '../formato.js';

const COD = 'upper-limb/joints/elbow-joint';
const RU = 'upper-limb/joints/radioulnar-joints';
const FOS = 'upper-limb/areas/cubital-fossa';
const nucleo = (nombre, piezas, tipo, extra = {}) => ({ nombre, piezas, lado: 'bilateral', papel: 'nucleo', tipo, ...extra });
const contexto = (nombre, piezas, tipo) => ({ nombre, piezas, lado: 'bilateral', papel: 'contexto', tipo });

const COLATERALES = ['colateral-radial', 'colateral-ulnar'];
const HUESOS = ['humero', 'radio', 'ulna'];
const CONTENIDO = ['nervio-radial', 'arteria-braquial', 'nervio-mediano'];

export default leccion({
  id: 'ms-codo',
  version: 1,
  titulo: 'El codo y la fosa cubital',
  resumen: 'El codo como bisagra (húmero con ulna y con radio en una sola cápsula), la articulación radioulnar proximal que gira dentro del ligamento anular, los ligamentos colaterales, los músculos de cada movimiento y la fosa cubital: sus límites, lo que pasa por ella de lateral a medial y por qué importa en una fractura supracondílea.',
  lugares: [['miembro-superior', 'codo']],
  sistemas: ['articular'],
  formato: 'articulacion',
  temas: ['articulaciones', 'movimientos'],
  nivel: 2,
  minutos: 18,
  requisitos: ['brazo', 'antebrazo'],
  siguiente: ['ms-antebrazo-posterior', 'ms-nervios', 'ms-vasos'],
  objetivos: [
    'Describir las articulaciones del codo y la radioulnar proximal, y qué movimientos permite cada una.',
    'Localizar la cápsula, los ligamentos colaterales y el ligamento anular.',
    'Relacionar los músculos con la flexión, la extensión, la pronación y la supinación.',
    'Describir los límites y el contenido de la fosa cubital, de lateral a medial.',
    'Explicar qué estructuras pone en riesgo una fractura supracondílea.',
  ],
  estructuras: {
    capsula: nucleo('Cápsula articular del codo', ['Articular_capsule_of_elbow_joint'], 'capsula'),
    'colateral-radial': nucleo('Ligamento colateral radial', ['Radial_collateral_ligament'], 'ligamento'),
    'colateral-ulnar': nucleo('Ligamento colateral ulnar', ['Ulnar_collateral_ligament'], 'ligamento'),
    anular: nucleo('Ligamento anular del radio', ['Annular_ligament_of_radius'], 'ligamento'),
    'arteria-braquial': nucleo('Arteria braquial', ['Brachial_artery'], 'arteria', { confusiones: ['Vena basílica'] }),
    'nervio-mediano': nucleo('Nervio mediano', ['Median_nerve'], 'nervio', { confusiones: ['Nervio ulnar', 'Nervio musculocutáneo'] }),
    'nervio-radial': nucleo('Nervio radial', ['Radial_nerve'], 'nervio', { confusiones: ['Nervio ulnar', 'Nervio musculocutáneo'] }),
    'vena-mediana': nucleo('Vena mediana del codo', ['Median_cubital_vein'], 'vena'),
    'pronador-redondo': nucleo('Músculo pronador redondo', ['Superficial_head_of_pronator_teres', 'Deep_head_of_pronator_teres'], 'musculo'),
    braquiorradial: nucleo('Músculo braquiorradial', ['Brachioradialis_muscle'], 'musculo'),
    'arteria-radial': contexto('Arteria radial', ['Radial_artery'], 'arteria'),
    'arteria-ulnar': contexto('Arteria ulnar', ['Ulnar_artery'], 'arteria'),
    cefalica: contexto('Vena cefálica', ['Cephalic_vein'], 'vena'),
    basilica: contexto('Vena basílica', ['Basilic_vein'], 'vena'),
    biceps: contexto('Músculo bíceps braquial', ['Long_head_of_biceps_brachii', 'Short_head_of_biceps_brachii'], 'musculo'),
    braquial: contexto('Músculo braquial', ['Brachialis_muscle'], 'musculo'),
    triceps: contexto('Músculo tríceps braquial', ['Long_head_of_triceps_brachii', 'Lateral_head_of_triceps_brachii', 'Medial_head_of_triceps_brachii'], 'musculo'),
    'anconeo': contexto('Músculo ancóneo', ['Anconeus_muscle'], 'musculo'),
    supinador: contexto('Músculo supinador', ['Supinator'], 'musculo'),
    'pronador-cuadrado': contexto('Músculo pronador cuadrado', ['Pronator_quadratus'], 'musculo'),
    'bolsa-triceps': contexto('Bolsa subtendinosa del tríceps', ['Subtendinous_bursa_of_triceps_brachii_muscle'], 'bolsa'),
    humero: contexto('Húmero', ['Humerus'], 'hueso'),
    radio: contexto('Radio', ['Radius'], 'hueso'),
    ulna: contexto('Ulna', ['Ulna'], 'hueso'),
  },
  pasos: [
    {
      id: 'orientacion', tipo: 'orientacion', titulo: 'El codo',
      texto: [
        ['El codo une el brazo con el antebrazo: es una articulación sinovial en bisagra que permite flexionar y extender el antebrazo.', T(COD, 'The elbow joint connects the upper arm to the forearm. It is a hinge-type synovial joint, permitting flexion and extension of the forearm.')],
        ['Míralo por delante, por detrás y por los lados.', GUIA],
      ],
      vista: { ver: ['capsula', ...COLATERALES], contexto: HUESOS, camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'Recorre el codo.', vistas: [{ nombre: 'De frente', camara: 'anterior' }, { nombre: 'Por dentro', camara: 'medial' }, { nombre: 'Por fuera', camara: 'lateral' }, { nombre: 'Por detrás', camara: 'posterior' }] },
      comprobar: 'rel-tipo',
    },
    {
      id: 'articulaciones', tipo: 'explicacion', titulo: 'Tres articulaciones, una cápsula',
      texto: [
        ['El codo tiene dos articulaciones en una cápsula: la escotadura troclear de la ulna con la tróclea del húmero, y la cabeza del radio con el capítulo.', T(COD, 'The elbow joint comprises two articulations within a single joint capsule:'), T(COD, 'Between the trochlear notch of the ulna and the trochlea of the humerus'), T(COD, 'Between the head of the radius and the capitulum of the humerus')],
        ['La radioulnar proximal comparte la cápsula, pero se describe aparte porque permite pronación y supinación.', T(COD, 'The proximal radioulnar joint shares the same capsule as the elbow but is usually described as a distinct articulation, as it permits pronation and supination rather than flexion and extension.')],
        ['En ella la cabeza del radio gira dentro del ligamento anular, que la rodea como un collar.', T(RU, 'The radial head is held in place by the annular radial ligament'), T(RU, 'Movement is produced by the head of the radius rotating within the annular ligament.')],
      ],
      vista: { ver: ['anular'], contexto: HUESOS, fantasma: ['capsula'], camara: 'anterolateral', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'anular', texto: 'Toca el anillo que rodea la cabeza del radio.' },
      comprobar: 'rel-radioulnar',
    },
    {
      id: 'ligamentos', tipo: 'relaciones', titulo: 'Cápsula y ligamentos',
      texto: [
        ['La cápsula se engrosa por dentro y por fuera en los ligamentos colaterales, que estabilizan la flexión y la extensión.', T(COD, 'It is thickened medially and laterally to form the collateral ligaments – which stabilise the joint during flexion and extension.')],
        ['El colateral radial sale del epicóndilo lateral y se une al ligamento anular; el ulnar, del epicóndilo medial a la apófisis coronoides y al olécranon.', T(COD, 'Radial collateral ligament – extends from the lateral epicondyle of the humerus and blends with the annular ligament of the radius, which encircles the radial head.'), T(COD, 'Ulnar collateral ligament – arises from the medial epicondyle and attaches to both the coronoid process and olecranon of the ulna.')],
      ],
      detalle: [
        ['Por detrás, una bolsa entre el olécranon y la piel puede inflamarse si uno se apoya mucho en los codos (bursitis olecraniana).', T(COD, 'Subcutaneous olecranon bursa – lies between the olecranon and overlying skin. Inflammation here results in olecranon bursitis.'), T(COD, 'This occurs due to repeated friction or pressure over the posterior aspect of the elbow (for example, leaning on hard surfaces).')],
        ['El modelo tiene la bolsa subtendinosa del tríceps, pero no la subcutánea del olécranon.', MODELO],
      ],
      vista: { ver: [...COLATERALES, 'anular'], contexto: ['bolsa-triceps', ...HUESOS], camara: 'medial', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: COLATERALES, texto: 'Alterna los colaterales y gira el codo: el ulnar por dentro, el radial por fuera.' },
      comprobar: 'rel-colateral-ulnar',
    },
    {
      id: 'movimientos', tipo: 'funcion', titulo: 'Los músculos de cada movimiento',
      texto: [
        ['Flexionan el codo el braquial, el bíceps y el braquiorradial; lo extienden el tríceps y el ancóneo.', T(COD, 'Flexion – produced by the brachialis, biceps brachii, and brachioradialis'), T(COD, 'Extension – produced by the triceps brachii and anconeus')],
        ['La pronación la hacen el pronador cuadrado y el redondo; la supinación, el supinador y el bíceps.', T(RU, 'Pronation – produced by the pronator quadratus and pronator teres.'), T(RU, 'Supination – produced by the supinator and biceps brachii.')],
      ],
      vista: { ver: ['braquiorradial', 'pronador-redondo'], contexto: ['biceps', 'braquial', 'triceps', 'anconeo', 'supinador', 'pronador-cuadrado', ...HUESOS], camara: 'anterolateral', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'Mira los flexores por delante y los extensores por detrás.', vistas: [{ nombre: 'Flexores, por delante', camara: 'anterior' }, { nombre: 'Extensores, por detrás', camara: 'posterior' }] },
      comprobar: 'fun-supinacion',
    },
    {
      id: 'fosa', tipo: 'relaciones', titulo: 'La fosa cubital',
      texto: [
        ['La fosa cubital es una depresión triangular delante del codo, por donde pasan estructuras del brazo al antebrazo.', T(FOS, 'The cubital (antecubital) fossa is a triangular-shaped depression over the anterior aspect of the elbow joint.'), T(FOS, 'The cubital fossa is a passageway for structures to pass between the upper arm and forearm.')],
        ['La limitan por fuera el braquiorradial, por dentro el pronador redondo y por arriba la línea entre los epicóndilos; su suelo es el braquial arriba y el supinador abajo.', T(FOS, 'Lateral border – medial border of the brachioradialis muscle.'), T(FOS, 'Medial border – lateral border of the pronator teres muscle.'), T(FOS, 'Superior border – horizontal line drawn between the epicondyles of the humerus.'), T(FOS, 'Floor – brachialis (proximally) and supinator (distally).')],
      ],
      vista: { ver: ['braquiorradial', 'pronador-redondo'], contexto: ['braquial', 'supinador', ...HUESOS], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['braquiorradial', 'pronador-redondo'], texto: 'Alterna los dos lados del triángulo: el braquiorradial por fuera y el pronador redondo por dentro.' },
      comprobar: 'rel-limite-lateral',
    },
    {
      id: 'contenido', tipo: 'exploracion', titulo: 'Lo que pasa por la fosa',
      texto: [
        ['De lateral a medial: el nervio radial, el tendón del bíceps, la arteria braquial y el nervio mediano.', T(FOS, 'Its contents are (lateral to medial):'), T(FOS, 'Mnemonic for contents of the cubital fossa – Really Need (radial nerve) Beer To (biceps tendon) Be At (brachial artery) My Nicest (median nerve).')],
        ['La arteria braquial se divide en radial y ulnar en el vértice de la fosa; su pulso se nota por dentro del tendón del bíceps.', T(FOS, 'Brachial artery – bifurcates into the radial and ulnar arteries at the apex of the cubital fossa.'), T(FOS, 'The brachial pulse can be felt in the cubital fossa by palpating medial to the biceps tendon')],
        ['Por encima, la vena mediana del codo une la cefálica con la basílica y es un sitio habitual para sacar sangre.', T(FOS, 'Notably, the median cubital vein, which connects the basilic and cephalic veins and can be accessed easily –  a common site for venepuncture.')],
      ],
      vista: { ver: [...CONTENIDO, 'vena-mediana'], contexto: ['arteria-radial', 'arteria-ulnar', 'cefalica', 'basilica', 'biceps', 'braquiorradial', 'pronador-redondo', ...HUESOS], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'vena-mediana', texto: 'Toca la vena que une la cefálica con la basílica por delante del codo.' },
      comprobar: 'rel-pulso',
    },
    {
      id: 'supracondilea', tipo: 'relaciones', titulo: 'La fractura supracondílea',
      texto: [
        ['La fractura supracondílea, la del extremo inferior del húmero, es más frecuente en niños y suele producirse al caer sobre la mano extendida.', T(FOS, 'A supracondylar fracture is a fracture of the distal humerus.'), T(FOS, 'the most common mechanism of injury is falling on an outstretched hand. It is more common in children than adults.')],
        ['Puede dañar el contenido de la fosa: si la arteria braquial no se repara, los flexores del antebrazo se vuelven fibrosos y cortos (contractura isquémica de Volkmann).', T(FOS, 'In this type of injury, the contents of the cubital fossa can be damaged'), T(FOS, 'Damage to the brachial artery, if not repaired, can cause Volkmann’s ischaemic contracture (uncontrolled flexion of the hand) as the forearm flexor muscles become fibrotic and short.')],
        ['También pueden lesionarse el mediano, el ulnar o el radial.', T(COD, 'The median, ulnar, or radial nerves may also be injured.')],
      ],
      detalle: [
        ['La mayoría de las luxaciones del codo son posteriores; se nombran por la posición de la ulna y el radio, no del húmero.', T(COD, 'Most elbow dislocations are posterior, and it is important to note that elbow dislocations are named by the position of the ulna and radius, not the humerus.')],
      ],
      vista: { ver: ['arteria-braquial', 'nervio-mediano', 'nervio-radial'], contexto: HUESOS, camara: 'anterior', lado: 'R' },
      comprobar: 'rel-volkmann',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['El codo es una bisagra (húmero con ulna y con radio); la radioulnar proximal, en la misma cápsula, gira para pronar y supinar.', T(COD, 'It is a hinge-type synovial joint'), T(RU, 'Both of these joints are classified as pivot joints, responsible for pronation and supination of the forearm.')],
        ['Colateral ulnar por dentro, radial por fuera, y el anular sujetando la cabeza del radio.', T(COD, 'Ulnar collateral ligament – arises from the medial epicondyle'), T(COD, 'Radial collateral ligament – extends from the lateral epicondyle of the humerus')],
        ['En la fosa cubital, de lateral a medial: nervio radial, tendón del bíceps, arteria braquial y nervio mediano.', T(FOS, 'Its contents are (lateral to medial):')],
      ],
    },
  ],
  preguntas: [
    {
      id: 'rel-tipo', tipo: 'relacion', objetivo: 0, paso: 'orientacion', estructuras: ['capsula'],
      enunciado: '¿Qué tipo de articulación es el codo?',
      correcta: 'Sinovial en bisagra: flexión y extensión',
      distractores: ['Esferoidea, como el hombro', 'En pivote: solo gira', 'Fibrosa, sin movimiento'],
      explicacion: 'El codo flexiona y extiende; el giro del antebrazo es de las radioulnares, que son en pivote.',
      evidencia: [T(COD, 'It is a hinge-type synovial joint, permitting flexion and extension of the forearm.')],
    },
    {
      id: 'rel-radioulnar', tipo: 'relacion', objetivo: 0, paso: 'articulaciones', estructuras: ['anular', 'radio'],
      enunciado: '¿Qué movimiento permite la articulación radioulnar proximal?',
      correcta: 'Pronación y supinación',
      distractores: ['Flexión y extensión', 'Abducción y aducción', 'Ninguno: es fija'],
      explicacion: 'La cabeza del radio gira dentro del ligamento anular; el codo, en cambio, flexiona y extiende.',
      evidencia: [T(RU, 'There are two movements possible at this joint; pronation and supination.')],
    },
    { id: 'id-anular', tipo: 'identificar', estructura: 'anular', objetivo: 1, paso: 'articulaciones' },
    { id: 'id-colateral-ulnar', tipo: 'identificar', estructura: 'colateral-ulnar', objetivo: 1, paso: 'ligamentos' },
    { id: 'id-colateral-radial', tipo: 'identificar', estructura: 'colateral-radial', objetivo: 1, paso: 'ligamentos' },
    {
      id: 'rel-colateral-ulnar', tipo: 'relacion', objetivo: 1, paso: 'ligamentos', estructuras: ['colateral-ulnar'],
      enunciado: '¿De dónde a dónde va el ligamento colateral ulnar?',
      correcta: 'Del epicóndilo medial a la apófisis coronoides y al olécranon',
      distractores: ['Del epicóndilo lateral al ligamento anular', 'De la cabeza del radio a la ulna', 'Del olécranon a la piel'],
      explicacion: 'El ulnar está por dentro; el radial, por fuera, se une al anular.',
      evidencia: [T(COD, 'Ulnar collateral ligament – arises from the medial epicondyle and attaches to both the coronoid process and olecranon of the ulna.')],
    },
    {
      id: 'fun-flexores', tipo: 'funcion', objetivo: 2, paso: 'movimientos', estructuras: ['braquiorradial', 'biceps', 'braquial'],
      enunciado: '¿Qué músculos flexionan el codo?',
      correcta: 'El braquial, el bíceps y el braquiorradial',
      distractores: ['El tríceps y el ancóneo', 'El supinador y el pronador cuadrado', 'El deltoides y el redondo mayor'],
      explicacion: 'El tríceps y el ancóneo lo extienden.',
      evidencia: [T(COD, 'Flexion – produced by the brachialis, biceps brachii, and brachioradialis')],
    },
    {
      id: 'fun-supinacion', tipo: 'funcion', objetivo: 2, paso: 'movimientos', estructuras: ['supinador', 'biceps'],
      enunciado: '¿Qué músculos hacen la supinación del antebrazo?',
      correcta: 'El supinador y el bíceps',
      distractores: ['El pronador redondo y el cuadrado', 'El tríceps y el ancóneo', 'El braquial y el braquiorradial'],
      explicacion: 'Los pronadores redondo y cuadrado hacen lo contrario.',
      evidencia: [T(RU, 'Supination – produced by the supinator and biceps brachii.')],
    },
    {
      id: 'rel-limite-lateral', tipo: 'relacion', objetivo: 3, paso: 'fosa', estructuras: ['braquiorradial', 'pronador-redondo'],
      enunciado: '¿Qué músculo forma el borde lateral de la fosa cubital?',
      correcta: 'El braquiorradial',
      distractores: ['El pronador redondo', 'El braquial', 'El supinador'],
      explicacion: 'El pronador redondo forma el borde medial; el braquial y el supinador, el suelo.',
      evidencia: [T(FOS, 'Lateral border – medial border of the brachioradialis muscle.')],
    },
    { id: 'id-arteria-braquial', tipo: 'identificar', estructura: 'arteria-braquial', objetivo: 3, paso: 'contenido' },
    { id: 'id-nervio-mediano', tipo: 'identificar', estructura: 'nervio-mediano', objetivo: 3, paso: 'contenido' },
    {
      id: 'sec-fosa', tipo: 'secuencia', objetivo: 3, paso: 'contenido',
      enunciado: 'Ordena el contenido de la fosa cubital de lateral a medial.',
      orden: ['Nervio radial', 'Tendón del bíceps', 'Arteria braquial', 'Nervio mediano'],
      explicacion: 'Radial, tendón del bíceps, arteria braquial y mediano.',
      evidencia: [T(FOS, 'Mnemonic for contents of the cubital fossa – Really Need (radial nerve) Beer To (biceps tendon) Be At (brachial artery) My Nicest (median nerve).')],
    },
    {
      id: 'rel-pulso', tipo: 'relacion', objetivo: 3, paso: 'contenido', estructuras: ['arteria-braquial'],
      enunciado: '¿Dónde se toma el pulso braquial en la fosa cubital?',
      correcta: 'Por dentro (medial) del tendón del bíceps',
      distractores: ['Por fuera del tendón del bíceps', 'Detrás del epicóndilo medial', 'Sobre el olécranon'],
      explicacion: 'La arteria braquial pasa por dentro del tendón del bíceps, antes de dividirse en radial y ulnar.',
      evidencia: [T(FOS, 'The brachial pulse can be felt in the cubital fossa by palpating medial to the biceps tendon')],
    },
    {
      id: 'rel-volkmann', tipo: 'relacion', objetivo: 4, paso: 'supracondilea', estructuras: ['arteria-braquial'],
      enunciado: 'Tras una fractura supracondílea, ¿qué lesión puede acabar en una contractura de los flexores del antebrazo?',
      correcta: 'La de la arteria braquial',
      distractores: ['La del nervio musculocutáneo', 'La del ligamento anular', 'La de la vena cefálica'],
      explicacion: 'Sin sangre, los flexores se vuelven fibrosos y cortos: es la contractura isquémica de Volkmann.',
      evidencia: [T(FOS, 'Damage to the brachial artery, if not repaired, can cause Volkmann’s ischaemic contracture (uncontrolled flexion of the hand) as the forearm flexor muscles become fibrotic and short.')],
    },
  ],
});
