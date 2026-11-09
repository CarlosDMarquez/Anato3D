// Lección «Caja torácica: esternón, costillas y cartílagos». Formato y evidencias: ../formato.js.
import { leccion, W, T, GUIA, MODELO } from '../formato.js';

const STE = 'thorax/bones/sternum';
const COL = 'back/bones/vertebral-column';
const costillas = (desde, hasta) => Array.from({ length: hasta - desde + 1 }, (_, i) => `Rib_${desde + i}`);
const esternon = (nombre, piezas) => ({ nombre, piezas, lado: 'impar', papel: 'nucleo', tipo: 'hueso' });
const par = (nombre, piezas, tipo = 'hueso') => ({ nombre, piezas, lado: 'ambos', papel: 'nucleo', tipo });
const contexto = (nombre, piezas, tipo, lado = 'ambos') => ({ nombre, piezas, lado, papel: 'contexto', tipo });

const ESTERNON = ['manubrio', 'cuerpo', 'xifoides'];
const COSTILLAS = ['verdaderas', 'falsas', 'flotantes'];

export default leccion({
  id: 'tor-caja',
  version: 1,
  titulo: 'Caja torácica: esternón, costillas y cartílagos',
  resumen: 'Los huesos y cartílagos de la caja torácica: las tres partes del esternón y el ángulo esternal, las costillas verdaderas, falsas y flotantes, los cartílagos costales, cómo se articula cada costilla con las vértebras y cómo se mueve la caja al respirar. Los músculos de la respiración tienen su propia lección.',
  lugares: [['torax', 'pared-toracica']],
  sistemas: ['oseo', 'articular'],
  formato: 'estructuras',
  temas: ['huesos', 'accidentes-oseos', 'articulaciones'],
  nivel: 1,
  minutos: 15,
  requisitos: ['fund-orientacion', 'esp-columna'],
  siguiente: ['tor-respiracion', 'tor-pulmones'],
  objetivos: [
    'Localizar en el modelo las tres partes del esternón, las costillas y los cartílagos costales.',
    'Clasificar las costillas en verdaderas, falsas y flotantes según cómo llegan al esternón.',
    'Describir cómo se articulan las costillas con las vértebras y con el esternón.',
    'Explicar cómo se mueve la caja torácica al inspirar.',
  ],
  estructuras: {
    manubrio: esternon('Manubrio del esternón', ['Sternum_Manubrium']),
    cuerpo: esternon('Cuerpo del esternón', ['Sternum_Body']),
    xifoides: esternon('Apófisis xifoides', ['Sternum_Xiphoid_Process']),
    verdaderas: par('Costillas verdaderas (1.ª a 7.ª)', costillas(1, 7)),
    falsas: par('Costillas falsas unidas al cartílago de encima (8.ª a 10.ª)', costillas(8, 10)),
    flotantes: par('Costillas flotantes (11.ª y 12.ª)', costillas(11, 12)),
    cartilagos: par('Cartílagos costales', Array.from({ length: 10 }, (_, i) => `Costal_Cartilage_${i + 1}`), 'cartilago'),
    toracicas: contexto('Vértebras torácicas', Array.from({ length: 12 }, (_, i) => `Vertebra_T${i + 1}`), 'hueso', 'impar'),
    claviculas: contexto('Clavículas', ['Clavicle'], 'hueso'),
    'lig-radiados': contexto('Ligamentos radiados de la cabeza de las costillas', ['Radiate_ligament_of_head_of_rib'], 'ligamento'),
    'lig-costotransversos': contexto('Ligamentos costotransversos', ['Costotransverse_ligament'], 'ligamento'),
  },
  pasos: [
    {
      id: 'orientacion', tipo: 'orientacion', titulo: 'La caja torácica',
      texto: [
        ['La caja torácica la forman las costillas, la columna y el esternón; protege el corazón, los pulmones y los grandes vasos, y sostiene la cintura escapular.', W('Rib_cage', 'comprises the ribs, vertebral column and sternum, which protect the vital organs of the thoracic cavity, such as the heart, lungs and great vessels and support the shoulder girdle')],
        ['Tiene 12 pares de costillas con sus cartílagos costales, el esternón y las 12 vértebras torácicas, que se articulan con las costillas.', W('Rib_cage', 'A typical human thoracic cage consists of 12 pairs of ribs and the adjoining costal cartilages, the sternum (along with the manubrium and xiphoid process), and the 12 thoracic vertebrae articulating with the ribs.')],
        ['Gira alrededor del tórax: por delante verás el esternón y los cartílagos; por detrás, las vértebras.', GUIA],
      ],
      vista: { ver: [...ESTERNON, ...COSTILLAS, 'cartilagos'], contexto: ['toracicas', 'claviculas'], camara: 'anterolateral', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'Mira la caja desde tres lados.', vistas: [{ nombre: 'Desde delante', camara: 'anterior' }, { nombre: 'Desde el lado', camara: 'lateral' }, { nombre: 'Desde atrás', camara: 'posterior' }] },
    },
    {
      id: 'esternon', tipo: 'explicacion', titulo: 'El esternón',
      texto: [
        ['El esternón es un hueso plano, largo y estrecho, en el centro de la parte anterior del tórax.', W('Sternum', 'The sternum is a narrow, flat bone, forming the middle portion of the front of the chest.')],
        ['Tiene tres partes: el manubrio, el cuerpo y la apófisis xifoides.', W('Sternum', 'Its three regions are the manubrium, the body, and the xiphoid process.')],
        ['El manubrio, arriba, tiene la escotadura yugular, que se ve bajo la piel, y a sus lados se articula con las clavículas.', T(STE, 'The superior aspect of the manubrium is concave, producing a depression known as the jugular notch – this is visible underneath the skin.'), T(STE, 'These fossae articulate with the medial ends of the clavicles, forming the sternoclavicular joints.')],
        ['El cuerpo es la parte más grande, y la xifoides, la más baja y pequeña: su punta queda a la altura de la décima vértebra torácica.', T(STE, 'The body is flat and elongated – the largest part of the sternum.'), T(STE, 'The xiphoid process is the most inferior and smallest part of the sternum.'), T(STE, 'with its tip located at the level of the T10 vertebrae')],
      ],
      detalle: [
        ['En los niños, las tres partes están unidas por cartílago, que se osifica en la edad adulta; la xifoides es sobre todo cartilaginosa y no se osifica del todo hasta los 40 años, más o menos.', T(STE, 'In children, these elements are joined by cartilage. The cartilage ossifies to bone during adulthood.'), T(STE, 'The xiphoid process is largely cartilaginous in structure, and completely ossifies late in life – around the age of 40.')],
      ],
      vista: { ver: ESTERNON, contexto: ['claviculas', 'cartilagos', 'verdaderas'], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ESTERNON, texto: 'Resalta cada parte del esternón, de arriba abajo.' },
    },
    {
      id: 'angulo', tipo: 'exploracion', titulo: 'El ángulo esternal y las carillas costales',
      texto: [
        ['El manubrio se une al cuerpo formando el ángulo esternal, un relieve transversal que se palpa en la cara anterior del esternón.', T(STE, 'Inferiorly, the manubrium articulates with the body of the sternum, forming the sternal angle. This can be felt as a transverse ridge of bone on the anterior aspect of the sternum.')],
        ['Marca el nivel del segundo cartílago costal, y por eso sirve para contar las costillas.', T(STE, 'The sternal angle is commonly used as an aid to count ribs, as it marks the level of the 2nd costal cartilage.')],
        ['El manubrio se articula con el primer cartílago costal y con parte del segundo; los bordes del cuerpo, con los cartílagos de la 3.ª a la 6.ª costilla y con parte de los de la 2.ª y la 7.ª.', T(STE, 'there is a facet (cartilage lined depression in the bone), for articulation with the costal cartilage of the 1st rib, and a demifacet (half-facet) for articulation with part of the costal cartilage of the 2nd rib.'), T(STE, 'These articular facets articulate with the costal cartilages of ribs 3-6. There are smaller facets for articulation with parts of the second and seventh ribs – known as demifacets.')],
      ],
      vista: { ver: ['manubrio', 'cuerpo'], contexto: ['cartilagos', 'verdaderas', 'xifoides'], camara: 'anterolateral', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'manubrio', texto: 'Toca la parte del esternón que se articula con las clavículas.' },
      comprobar: 'rel-angulo',
    },
    {
      id: 'tipos', tipo: 'explicacion', titulo: 'Verdaderas, falsas y flotantes',
      texto: [
        ['Todas las costillas se unen por detrás a las vértebras torácicas y se numeran de la 1 a la 12, de arriba abajo.', W('Rib_cage', 'All ribs are attached posteriorly to the thoracic vertebrae and are numbered accordingly one to twelve.')],
        ['Las siete primeras son las verdaderas: cada una llega al esternón con su propio cartílago costal.', W('Rib_cage', 'The first seven rib pairs known as the fixed or vertebrosternal ribs are the true ribs (Latin: costae verae) as they connect directly to the sternum via their own individual costal cartilages.')],
        ['Las cinco siguientes son falsas, porque no llegan directamente al esternón; la 8.ª, la 9.ª y la 10.ª se unen a él a través del cartílago de la costilla de encima.', W('Rib_cage', 'The next five pairs (eighth to twelfth) are the false ribs (Latin: costae spuriae) or vertebrochondral ribs, which do not connect directly to the sternum.'), W('Rib_cage', 'The first three pairs of vertebrochondral ribs (eighth to tenth) connect indirectly to the sternum via the costal cartilages of the ribs above them')],
        ['La 11.ª y la 12.ª son las flotantes: solo se unen a las vértebras, no al esternón ni a otros cartílagos.', W('Rib_cage', 'The phrase floating rib (Latin: costae fluctuantes) or vertebral rib refers to the two lowermost (the eleventh and twelfth) rib pairs; so-called because they are attached only to the vertebrae and not to the sternum or any of the costal cartilages.')],
      ],
      vista: { ver: COSTILLAS, contexto: [...ESTERNON, 'cartilagos', 'toracicas'], camara: 'anterolateral', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: COSTILLAS, texto: 'Resalta cada grupo y sigue sus cartílagos hasta el esternón.' },
      comprobar: 'rel-flotantes',
    },
    {
      id: 'cartilagos', tipo: 'exploracion', titulo: 'Los cartílagos costales',
      texto: [
        ['Los cartílagos costales son barras de cartílago hialino que prolongan las costillas hacia delante y dan elasticidad a la pared del tórax.', W('Costal_cartilage', 'are bars of hyaline cartilage that serve to prolong the ribs forward and contribute to the elasticity of the walls of the thorax.')],
        ['Los siete primeros se unen al esternón; los tres siguientes, al borde inferior del cartílago de la costilla anterior, y los dos últimos acaban en punta en la pared del abdomen.', W('Costal_cartilage', 'The first seven pairs are connected with the sternum; the next three are each articulated with the lower border of the cartilage of the preceding rib; the last two have pointed extremities, which end in the wall of the abdomen.')],
        ['Se alargan de la primera a la séptima costilla y después se van acortando.', W('Costal_cartilage', 'They increase in length from the first to the seventh, then gradually decrease to the twelfth.')],
      ],
      detalle: [
        ['En el modelo, las puntas cartilaginosas de las costillas 11.ª y 12.ª no son piezas aparte.', MODELO],
      ],
      vista: { ver: ['cartilagos'], contexto: [...ESTERNON, 'verdaderas', 'falsas'], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'cartilagos', texto: 'Toca uno de los cartílagos que unen las costillas con el esternón.' },
    },
    {
      id: 'articulaciones', tipo: 'relaciones', titulo: 'Cómo se articula una costilla con las vértebras',
      texto: [
        ['Cada costilla tiene una cabeza, un cuello y un cuerpo.', W('Rib_cage', 'Each rib consists of a head, neck, and a shaft.')],
        ['La cabeza tiene dos carillas: la de arriba se articula con la vértebra de encima, y la de abajo, más grande, con la vértebra de su mismo número.', W('Rib_cage', 'The upper region articulates with the inferior costal facet on the vertebra above, and the larger region articulates with the superior costal facet on the vertebra with the same number.')],
        ['El tubérculo de la costilla se articula con la apófisis transversa de la vértebra de su mismo número.', W('Rib_cage', 'The transverse process of a thoracic vertebra also articulates at the transverse costal facet with the tubercle of the rib of the same number.')],
        ['Por ejemplo, la cabeza de la 2.ª costilla se articula con T1 y T2, y su tubérculo, con la apófisis transversa de T2.', T(COL, 'For example, the head of Rib 2 articulates with the inferior demi-facet of T1 and the superior demi-facet of T2, while the tubercle of Rib 2 articulates with the transverse costal facet of T2.')],
      ],
      detalle: [
        ['En el modelo puedes ver los ligamentos radiados de la cabeza de las costillas y los ligamentos costotransversos, que refuerzan estas uniones por detrás.', MODELO],
      ],
      vista: { ver: ['verdaderas'], contexto: ['toracicas', 'lig-radiados', 'lig-costotransversos'], camara: 'posterolateral', lado: 'R' },
      comprobar: 'rel-tuberculo',
    },
    {
      id: 'respiracion', tipo: 'funcion', titulo: 'La caja torácica al respirar',
      texto: [
        ['Al inspirar, el diafragma se contrae y se aplana, y los músculos intercostales levantan la caja torácica hacia arriba y hacia fuera.', W('Rib_cage', 'An inhalation is accomplished when the muscular diaphragm, at the floor of the thoracic cavity, contracts and flattens, while the contraction of intercostal muscles lift the rib cage up and out.')],
        ['Las costillas de arriba empujan el esternón hacia arriba y hacia delante (el movimiento en «brazo de bomba») y aumentan el diámetro anteroposterior del tórax.', W('Rib_cage', "The second plane is the anteroposterior and this is expanded by a movement known as the 'pump handle'."), W('Rib_cage', 'the upper ribs are able also to push the sternum up and out.'), W('Rib_cage', 'This movement increases the anteroposterior diameter of the thoracic cavity')],
        ['Las de abajo se abren hacia fuera (el movimiento en «asa de cubo») y aumentan el diámetro transversal.', W('Rib_cage', 'The third, transverse, plane is primarily expanded by the lower ribs'), W('Rib_cage', 'produce what is known as the bucket handle movement, facilitated by gliding at the costovertebral joints.'), W('Rib_cage', 'In this way, the transverse diameter is expanded and the lungs can fill.')],
        ['La elasticidad de las uniones de la 8.ª a la 10.ª costilla hace posible ese movimiento.', W('Rib_cage', 'the overall elasticity of their articulations allows the bucket handle movements of the rib cage essential for respiratory activity.')],
      ],
      detalle: [
        ['Entre las costillas quedan los espacios intercostales, con los músculos intercostales y los nervios, arterias y venas intercostales.', W('Rib_cage', 'The spaces between the ribs are known as intercostal spaces; they contain the instrinsic intercostal muscles and the neurovascular bundles containing intercostal nerves, arteries and veins.')],
      ],
      vista: { ver: [...COSTILLAS, ...ESTERNON, 'cartilagos'], contexto: ['toracicas'], camara: 'lateral', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'De lado se entiende el «brazo de bomba»; de frente, el «asa de cubo».', vistas: [{ nombre: 'Brazo de bomba (de lado)', camara: 'lateral' }, { nombre: 'Asa de cubo (de frente)', camara: 'anterior' }] },
      comprobar: 'fun-bomba',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['La caja torácica son 12 pares de costillas con sus cartílagos, el esternón y las 12 vértebras torácicas.', W('Rib_cage', 'A typical human thoracic cage consists of 12 pairs of ribs and the adjoining costal cartilages')],
        ['El esternón tiene manubrio, cuerpo y xifoides; el ángulo esternal marca el segundo cartílago costal.', W('Sternum', 'Its three regions are the manubrium, the body, and the xiphoid process.'), T(STE, 'as it marks the level of the 2nd costal cartilage')],
        ['Las costillas 1.ª a 7.ª son verdaderas; la 8.ª a la 10.ª, falsas, y la 11.ª y la 12.ª, flotantes.', W('Rib_cage', 'The first seven rib pairs known as the fixed or vertebrosternal ribs are the true ribs'), W('Rib_cage', 'The next five pairs (eighth to twelfth) are the false ribs'), W('Rib_cage', 'refers to the two lowermost (the eleventh and twelfth) rib pairs')],
        ['Cada costilla se articula con dos vértebras por la cabeza y con una apófisis transversa por el tubérculo; al inspirar, la caja se eleva y se abre.', W('Rib_cage', 'The upper region articulates with the inferior costal facet on the vertebra above'), W('Rib_cage', 'articulates at the transverse costal facet with the tubercle of the rib of the same number'), W('Rib_cage', 'the contraction of intercostal muscles lift the rib cage up and out')],
      ],
    },
  ],
  preguntas: [
    { id: 'id-manubrio', tipo: 'identificar', estructura: 'manubrio', objetivo: 0, paso: 'esternon' },
    { id: 'id-cuerpo', tipo: 'identificar', estructura: 'cuerpo', objetivo: 0, paso: 'esternon' },
    { id: 'id-xifoides', tipo: 'identificar', estructura: 'xifoides', objetivo: 0, paso: 'esternon' },
    { id: 'id-cartilagos', tipo: 'identificar', estructura: 'cartilagos', objetivo: 0, paso: 'cartilagos' },
    { id: 'loc-xifoides', tipo: 'localizar', estructura: 'xifoides', candidatas: ['cuerpo', 'manubrio'], objetivo: 0, paso: 'esternon' },
    { id: 'id-flotantes', tipo: 'identificar', estructura: 'flotantes', objetivo: 1, paso: 'tipos' },
    { id: 'id-verdaderas', tipo: 'identificar', estructura: 'verdaderas', objetivo: 1, paso: 'tipos' },
    {
      id: 'rel-flotantes', tipo: 'relacion', objetivo: 1, paso: 'tipos', estructuras: ['flotantes'],
      enunciado: '¿Qué costillas son flotantes?',
      correcta: 'La 11.ª y la 12.ª',
      distractores: ['La 8.ª, la 9.ª y la 10.ª', 'La 1.ª y la 2.ª', 'De la 1.ª a la 7.ª'],
      explicacion: 'Las dos últimas solo se unen a las vértebras. La 8.ª a la 10.ª son falsas, pero llegan al esternón por el cartílago de encima.',
      evidencia: [W('Rib_cage', 'refers to the two lowermost (the eleventh and twelfth) rib pairs; so-called because they are attached only to the vertebrae and not to the sternum or any of the costal cartilages.')],
    },
    {
      id: 'rel-verdaderas', tipo: 'relacion', objetivo: 1, paso: 'tipos', estructuras: ['verdaderas'],
      enunciado: '¿Por qué se llaman verdaderas las siete primeras costillas?',
      correcta: 'Porque cada una llega al esternón con su propio cartílago',
      distractores: ['Porque son las únicas que se articulan con las vértebras', 'Porque no tienen cartílago costal', 'Porque se unen al cartílago de la costilla de encima'],
      explicacion: 'Las verdaderas se unen directamente al esternón; todas las costillas, verdaderas o no, se articulan por detrás con las vértebras.',
      evidencia: [W('Rib_cage', 'as they connect directly to the sternum via their own individual costal cartilages.')],
    },
    {
      id: 'seq-tipos', tipo: 'secuencia', objetivo: 1, paso: 'tipos', estructuras: COSTILLAS,
      enunciado: 'Ordena los grupos de costillas de arriba abajo:',
      orden: ['Verdaderas, unidas al esternón por su propio cartílago', 'Falsas, unidas al cartílago de la costilla de encima', 'Flotantes, unidas solo a las vértebras'],
      explicacion: 'Primero las siete verdaderas, luego la 8.ª a la 10.ª y, abajo, las dos flotantes.',
      evidencia: [W('Rib_cage', 'The first seven rib pairs known as the fixed or vertebrosternal ribs are the true ribs'), W('Rib_cage', 'The first three pairs of vertebrochondral ribs (eighth to tenth) connect indirectly to the sternum via the costal cartilages of the ribs above them'), W('Rib_cage', 'refers to the two lowermost (the eleventh and twelfth) rib pairs')],
    },
    {
      id: 'rel-angulo', tipo: 'relacion', objetivo: 2, paso: 'angulo', estructuras: ['manubrio', 'cuerpo'],
      enunciado: '¿Qué cartílago costal llega a la altura del ángulo esternal?',
      correcta: 'El de la 2.ª costilla',
      distractores: ['El de la 1.ª costilla', 'El de la 7.ª costilla', 'El de la 10.ª costilla'],
      explicacion: 'El ángulo esternal, entre el manubrio y el cuerpo, marca el segundo cartílago costal: desde ahí se cuentan las costillas.',
      evidencia: [T(STE, 'The sternal angle is commonly used as an aid to count ribs, as it marks the level of the 2nd costal cartilage.')],
    },
    {
      id: 'rel-tuberculo', tipo: 'relacion', objetivo: 2, paso: 'articulaciones', estructuras: ['verdaderas', 'toracicas'],
      enunciado: '¿Con qué se articula el tubérculo de una costilla?',
      correcta: 'Con la apófisis transversa de la vértebra de su mismo número',
      distractores: ['Con el cuerpo de la vértebra de encima', 'Con el borde del esternón', 'Con el cartílago de la costilla de encima'],
      explicacion: 'La cabeza se articula con los cuerpos de dos vértebras; el tubérculo, con la apófisis transversa de la vértebra del mismo número.',
      evidencia: [W('Rib_cage', 'The transverse process of a thoracic vertebra also articulates at the transverse costal facet with the tubercle of the rib of the same number.')],
    },
    {
      id: 'rel-cabeza', tipo: 'relacion', objetivo: 2, paso: 'articulaciones', estructuras: ['verdaderas', 'toracicas'],
      enunciado: '¿Con qué vértebras se articula la cabeza de la 2.ª costilla?',
      correcta: 'Con T1 y T2',
      distractores: ['Solo con T2', 'Con T2 y T3', 'Con C7 y T1'],
      explicacion: 'La cabeza toca la vértebra de su número (T2) y la de encima (T1); el tubérculo, la apófisis transversa de T2.',
      evidencia: [T(COL, 'For example, the head of Rib 2 articulates with the inferior demi-facet of T1 and the superior demi-facet of T2')],
    },
    {
      id: 'fun-bomba', tipo: 'funcion', objetivo: 3, paso: 'respiracion', estructuras: ['verdaderas', 'cuerpo'],
      enunciado: '¿Cómo se llama el movimiento de las costillas de arriba que empuja el esternón hacia arriba y hacia delante al inspirar?',
      correcta: 'Brazo de bomba',
      distractores: ['Asa de cubo', 'Rotación de la escápula', 'Flexión de la columna torácica'],
      explicacion: 'El «brazo de bomba» de las costillas de arriba aumenta el diámetro anteroposterior; el «asa de cubo» de las de abajo, el transversal.',
      evidencia: [W('Rib_cage', "The second plane is the anteroposterior and this is expanded by a movement known as the 'pump handle'."), W('Rib_cage', 'the upper ribs are able also to push the sternum up and out.')],
    },
    {
      id: 'fun-asa', tipo: 'funcion', objetivo: 3, paso: 'respiracion', estructuras: ['falsas'],
      enunciado: '¿Qué diámetro del tórax aumenta el movimiento en «asa de cubo» de las costillas de abajo?',
      correcta: 'El transversal',
      distractores: ['El anteroposterior', 'El vertical', 'Ninguno: el tórax solo crece cuando baja el diafragma'],
      explicacion: 'Al abrirse hacia fuera, las costillas de abajo ensanchan el tórax de lado a lado.',
      evidencia: [W('Rib_cage', 'The third, transverse, plane is primarily expanded by the lower ribs'), W('Rib_cage', 'In this way, the transverse diameter is expanded and the lungs can fill.')],
    },
    {
      id: 'fun-diafragma', tipo: 'funcion', objetivo: 3, paso: 'respiracion', estructuras: ['verdaderas'],
      enunciado: '¿Qué hace el diafragma al inspirar?',
      correcta: 'Se contrae y se aplana',
      distractores: ['Se relaja y sube', 'Empuja el esternón hacia atrás', 'Junta las costillas entre sí'],
      explicacion: 'Al contraerse, el diafragma baja y se aplana; a la vez, los intercostales levantan la caja.',
      evidencia: [W('Rib_cage', 'An inhalation is accomplished when the muscular diaphragm, at the floor of the thoracic cavity, contracts and flattens')],
    },
  ],
});
