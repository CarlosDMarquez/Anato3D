// Lección «El sistema linfático». Formato y evidencias: ../formato.js.
import { leccion, W, GUIA, MODELO } from '../formato.js';

const LIN = 'Lymphatic_system';
const O = (nombre, piezas, tipo, lado = 'impar', papel = 'nucleo') => ({ nombre, piezas, lado, papel, tipo });

export default leccion({
  id: 'sis-linfatico',
  version: 1,
  titulo: 'El sistema linfático',
  resumen: 'La linfa, los vasos y los nodos linfáticos y los órganos linfoides (timo, bazo y amígdalas): qué hace cada uno, dónde están en el modelo y cómo vuelve la linfa a la sangre.',
  lugares: [],
  sistemas: ['linfatico'],
  formato: 'vision-general',
  temas: ['organos'],
  nivel: 1,
  minutos: 9,
  requisitos: ['sis-cardiovascular'],
  siguiente: ['ms-axila', 'tor-mediastino', 'abd-higado-pancreas'],
  objetivos: [
    'Enumerar las partes del sistema linfático y explicar sus dos funciones principales.',
    'Describir el camino de la linfa por los vasos y los nodos hasta las venas subclavias.',
    'Localizar en el modelo los nodos axilares e inguinales, el timo, el bazo y las amígdalas palatinas.',
  ],
  estructuras: {
    axilares: O('Nodos linfáticos axilares', ['Anterior_axillary_nodes', 'Apical_axillary_nodes', 'Central_axillary_nodes', 'Lateral_axillary_nodes', 'Posterior_axillary_nodes'], 'nodo', 'bilateral'),
    inguinales: O('Nodos linfáticos inguinales superficiales', ['Inferior_superficial_inguinal_nodes', 'Superolateral_superficial_inguinal_nodes', 'Superomedial_superficial_inguinal_nodes'], 'nodo', 'bilateral'),
    timo: { ...O('Timo', ['Left_lobe_of_thymus', 'Right_lobe_of_thymus'], 'organo'), confusiones: ['Glándula tiroides', 'Pericardio'] },
    bazo: { ...O('Bazo', ['Spleen'], 'organo'), confusiones: ['Riñón izquierdo', 'Páncreas'] },
    amigdala: O('Amígdala palatina', ['Palatine_tonsil'], 'organo', 'bilateral'),
  },
  pasos: [
    {
      id: 'que-es', tipo: 'orientacion', titulo: 'Un sistema de drenaje y defensa',
      texto: [
        ['El sistema linfático forma parte del sistema inmunitario y complementa al circulatorio.', W(LIN, 'is part of the immune system and complementary to the circulatory system')],
        ['Lo forman una gran red de vasos linfáticos, los nodos linfáticos, los órganos y tejidos linfoides y la linfa.', W(LIN, 'It consists of a large network of lymphatic vessels, lymph nodes, lymphoid organs, lymphatic tissue and lymph.')],
        ['En el modelo están los nodos y los órganos linfoides; los vasos linfáticos no.', MODELO],
      ],
      vista: { capas: { skeletal: 'all', lymphatic: 'all' }, ver: [], contexto: [], camara: 'anterior', lado: 'R' },
    },
    {
      id: 'linfa', tipo: 'explicacion', titulo: 'El camino de la linfa',
      texto: [
        ['El líquido que baña las células recoge desechos, bacterias y células dañadas y drena a los vasos linfáticos como linfa.', W(LIN, 'This fluid carries nutrients to the cells and collects waste products, bacteria, and damaged cells, before draining into the lymphatic vessels as lymph.')],
        ['Los vasos llevan la linfa por numerosos nodos linfáticos, que filtran lo que sobra, como bacterias y células dañadas.', W(LIN, 'These vessels carry lymph throughout the body, passing through numerous lymph nodes, which filter out unwanted materials such as bacteria and damaged cells.')],
        ['El conducto linfático derecho drena el lado derecho y el conducto torácico, mucho más grande, el izquierdo; los dos desembocan en las venas subclavias y la linfa vuelve a la sangre.', W(LIN, 'The right lymphatic duct drains the right side of the region, and the much larger left lymphatic duct, known as the thoracic duct, drains the left side of the body.'), W(LIN, 'The ducts empty into the subclavian veins to return to the bloodstream.')],
      ],
      vista: { capas: { skeletal: 'all', lymphatic: 'nodes' }, ver: [], contexto: [], camara: 'anterior', lado: 'R' },
      comprobar: 'conductos',
    },
    {
      id: 'nodos', tipo: 'exploracion', titulo: 'Los nodos linfáticos',
      texto: [
        ['En los nodos linfáticos es donde hay más concentración de linfocitos.', W(LIN, 'These include the lymph nodes (where the highest lymphocyte concentration is found), the spleen, the thymus, and the tonsils.')],
        ['Busca dos grupos que se palpan con facilidad: los de la axila y los de la ingle.', GUIA],
      ],
      vista: { ver: ['axilares', 'inguinales'], contexto: [], esqueleto: true, camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'axilares', texto: 'Toca los nodos linfáticos de la axila.' },
    },
    {
      id: 'organos', tipo: 'exploracion', titulo: 'Timo, bazo y amígdalas',
      texto: [
        ['El timo y la médula ósea son los órganos linfoides primarios: allí se producen y seleccionan los linfocitos.', W(LIN, 'The thymus and the bone marrow constitute the primary lymphoid organs involved in the production and early clonal selection of lymphocyte tissues.')],
        ['En el timo maduran los linfocitos T; está en la parte alta y anterior del tórax, detrás del esternón y delante del corazón.', W('Thymus', 'Within the thymus, T cells mature.'), W('Thymus', 'The thymus is located in the upper front part of the chest, in the anterior superior mediastinum, behind the sternum, and in front of the heart.')],
        ['El bazo, parecido a un gran nodo linfático, filtra sobre todo la sangre: retira los glóbulos rojos viejos y guarda una reserva de sangre.', W('Spleen', 'Similar in structure to a large lymph node, it acts primarily as a blood filter.'), W('Spleen', 'It removes old red blood cells and holds a reserve of blood')],
      ],
      vista: { ver: ['timo', 'bazo', 'amigdala'], contexto: [], esqueleto: true, camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['timo', 'bazo', 'amigdala'], texto: 'Alterna entre los tres órganos linfoides del modelo.' },
      comprobar: 'timo-funcion',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['Vasos, nodos, órganos y tejidos linfoides y la linfa: un sistema que drena líquido y defiende al cuerpo.', W(LIN, 'It consists of a large network of lymphatic vessels, lymph nodes, lymphoid organs, lymphatic tissue and lymph.'), W(LIN, 'The other main function is that of immune defense.')],
        ['La linfa pasa por los nodos, que la filtran, y vuelve a la sangre por los conductos torácico y linfático derecho, en las venas subclavias.', W(LIN, 'passing through numerous lymph nodes, which filter out unwanted materials'), W(LIN, 'The ducts empty into the subclavian veins to return to the bloodstream.')],
        ['Timo: maduran los linfocitos T. Bazo: filtra la sangre.', W('Thymus', 'Within the thymus, T cells mature.'), W('Spleen', 'it acts primarily as a blood filter')],
      ],
    },
  ],
  preguntas: [
    { id: 'id-bazo', tipo: 'identificar', estructura: 'bazo', objetivo: 2, paso: 'organos' },
    { id: 'id-timo', tipo: 'identificar', estructura: 'timo', objetivo: 2, paso: 'organos' },
    { id: 'loc-inguinales', tipo: 'localizar', estructura: 'inguinales', candidatas: ['axilares', 'bazo'], objetivo: 2, paso: 'nodos' },
    {
      id: 'funciones', tipo: 'funcion', objetivo: 0, paso: 'que-es',
      enunciado: '¿De qué sistema forma parte el sistema linfático, además de complementar al circulatorio?',
      correcta: 'Del sistema inmunitario', distractores: ['Del sistema endocrino', 'Del sistema digestivo', 'Del sistema nervioso autónomo'],
      explicacion: 'Drena líquido y defiende al cuerpo: es parte del sistema inmunitario.',
      evidencia: [W(LIN, 'is part of the immune system and complementary to the circulatory system')],
    },
    {
      id: 'nodos-filtran', tipo: 'funcion', objetivo: 1, paso: 'linfa', estructuras: ['axilares'],
      enunciado: '¿Qué hacen los nodos linfáticos con la linfa que pasa por ellos?',
      correcta: 'La filtran: retienen bacterias y células dañadas', distractores: ['La convierten en sangre', 'La bombean hacia el corazón', 'La producen a partir de la sangre'],
      explicacion: 'Los vasos llevan la linfa por los nodos, que filtran lo que sobra.',
      evidencia: [W(LIN, 'passing through numerous lymph nodes, which filter out unwanted materials such as bacteria and damaged cells')],
    },
    {
      id: 'conductos', tipo: 'relacion', objetivo: 1, paso: 'linfa',
      enunciado: '¿Dónde desembocan los conductos linfáticos para devolver la linfa a la sangre?',
      correcta: 'En las venas subclavias', distractores: ['En la vena cava inferior', 'En el atrio derecho', 'En la vena porta'],
      explicacion: 'El conducto torácico y el linfático derecho vierten en las venas subclavias.',
      evidencia: [W(LIN, 'The ducts empty into the subclavian veins to return to the bloodstream.')],
    },
    {
      id: 'conducto-toracico', tipo: 'relacion', objetivo: 1, paso: 'linfa',
      enunciado: '¿Qué drena el conducto torácico?',
      correcta: 'El lado izquierdo del cuerpo', distractores: ['Solo el tórax', 'El lado derecho del cuerpo', 'Solo los miembros inferiores'],
      explicacion: 'Es el más grande: drena el lado izquierdo; el conducto linfático derecho, el derecho.',
      evidencia: [W(LIN, 'the much larger left lymphatic duct, known as the thoracic duct, drains the left side of the body')],
    },
    {
      id: 'timo-funcion', tipo: 'funcion', objetivo: 0, paso: 'organos', estructuras: ['timo'],
      enunciado: '¿Qué ocurre en el timo?',
      correcta: 'Maduran los linfocitos T', distractores: ['Se filtran los glóbulos rojos viejos', 'Se produce la bilis', 'Se almacena el calcio'],
      explicacion: 'El timo es un órgano linfoide primario: allí maduran los linfocitos T. Filtrar glóbulos rojos viejos es cosa del bazo.',
      evidencia: [W('Thymus', 'Within the thymus, T cells mature.')],
    },
    {
      id: 'bazo-funcion', tipo: 'funcion', objetivo: 0, paso: 'organos', estructuras: ['bazo'],
      enunciado: '¿Qué hace principalmente el bazo?',
      correcta: 'Filtra la sangre y retira los glóbulos rojos viejos', distractores: ['Filtra la linfa del miembro inferior', 'Produce los linfocitos T', 'Devuelve la linfa a la sangre'],
      explicacion: 'Su estructura recuerda a la de un nodo linfático, pero filtra sangre, no linfa.',
      evidencia: [W('Spleen', 'it acts primarily as a blood filter'), W('Spleen', 'It removes old red blood cells')],
    },
  ],
});
