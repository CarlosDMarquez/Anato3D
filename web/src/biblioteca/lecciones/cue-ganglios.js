// Lección «Nodos linfáticos de la cabeza y el cuello». Formato y evidencias: ../formato.js.
// Escrita el 2026-11-12, cuando el modelo pasó a tener ganglios ovalados, colectores esquemáticos, troncos y conductos
// (docs/hitos/09-sistema-linfatico.md). Idea central: localizar la cadena cervical profunda usando la vena yugular
// interna como referencia. Las venas principales salen como contexto del sistema linfático; el esternocleidomastoideo
// va translúcido porque tapa la cadena. En el modelo los nodos cervicales profundos inferiores no son simétricos entre
// los dos lados, y la vía central es la variante clásica (troncos derechos → conducto linfático derecho).
import { leccion, W, GUIA, MODELO } from '../formato.js';

const DCN = 'Deep_cervical_lymph_nodes';
const SUP = 'Superior_deep_cervical_lymph_nodes';
const INF = 'Inferior_deep_cervical_lymph_nodes';
const JD = 'Jugulodigastric_lymph_node';
const CLN = 'Cervical_lymph_nodes';
const SUB = 'Submandibular_lymph_nodes';
const SM = 'Submental_lymph_nodes';
const SCL = 'Supraclavicular_lymph_nodes';
const JT = 'Jugular_trunk';
const TD = 'Thoracic_duct';
const VA = 'Venous_angle';
const nodos = (nombre, piezas, lado = 'bilateral', extra = {}) => ({ nombre, piezas, lado, papel: 'nucleo', tipo: 'nodo', ...extra });
const linfatico = (nombre, piezas, lado = 'impar', papel = 'nucleo') => ({ nombre, piezas, lado, papel, tipo: 'linfatico' });
const contexto = (nombre, piezas, tipo, lado = 'bilateral') => ({ nombre, piezas, lado, papel: 'contexto', tipo });

const CABEZA = ['occipitales', 'mastoideos', 'parotideos'];
const MANDIBULA = ['submandibulares', 'submentonianos'];
const PROFUNDOS = ['yugulodigastrico', 'cervicales-superiores', 'cervicales-inferiores'];
const FINAL = ['tronco-yugular', 'conducto-toracico', 'conducto-derecho'];

export default leccion({
  id: 'cue-ganglios',
  version: 1,
  titulo: 'Nodos linfáticos de la cabeza y el cuello',
  resumen: 'Los nodos superficiales de la cabeza (occipitales, mastoideos, parotídeos), los submandibulares y submentonianos, la cadena cervical profunda a lo largo de la vena yugular interna con el nodo yugulodigástrico, los supraclaviculares, el tronco yugular y la terminación en el ángulo venoso de cada lado. No trata los nodos de la laringe, la tráquea y la tiroides ni los retrofaríngeos.',
  lugares: [['cuello', 'vasos-nervios-cuello'], ['cabeza', 'cara']],
  sistemas: ['linfatico'],
  formato: 'topografia',
  temas: ['organos'],
  nivel: 2,
  minutos: 18,
  requisitos: ['sis-linfatico', 'cue-vasos'],
  siguiente: ['ms-axila', 'tor-linfaticos'],
  objetivos: [
    'Localizar los nodos superficiales de la cabeza y bajo la mandíbula y decir qué territorio drena cada grupo.',
    'Usar la vena yugular interna como referencia para localizar la cadena cervical profunda y el nodo yugulodigástrico.',
    'Explicar que toda la linfa de la cabeza y el cuello acaba en los nodos cervicales profundos.',
    'Seguir la linfa desde los cervicales profundos hasta el tronco yugular y el ángulo venoso de cada lado.',
    'Relacionar el nodo supraclavicular izquierdo (de Virchow) con el conducto torácico.',
  ],
  estructuras: {
    occipitales: nodos('Nodos occipitales', ['Occipital_nodes']),
    mastoideos: nodos('Nodos mastoideos (retroauriculares)', ['Mastoid_nodes']),
    parotideos: nodos('Nodos parotídeos y preauriculares', ['Superficial_parotid_nodes', 'Pre_auricular_nodes', 'Intraglandular_parotid_nodes', 'Infra_auricular_nodes']),
    submandibulares: nodos('Nodos submandibulares', ['Submandibular_nodes']),
    submentonianos: nodos('Nodos submentonianos', ['Submental_nodes']),
    yugulodigastrico: nodos('Nodo yugulodigástrico', ['Jugulodigastric_node']),
    'cervicales-superiores': nodos('Nodos yugulares laterales (cervicales profundos superiores)', ['Lateral_superior_jugular_node']),
    'cervicales-inferiores': nodos('Nodos cervicales profundos inferiores', ['Anterior_inferior_jugular_nodes', 'Inferior_deep_lateral_cervical_nodes']),
    'cervicales-superficiales': nodos('Nodos cervicales laterales superficiales', ['Superficial_lateral_cervical_nodes']),
    supraclaviculares: nodos('Nodos supraclaviculares', ['Supraclavicular_nodes']),
    'tronco-yugular': linfatico('Troncos yugulares', ['Jugular_trunk'], 'ambos'),
    'conducto-toracico': linfatico('Conducto torácico', ['Thoracic_duct']),
    'conducto-derecho': linfatico('Conducto linfático derecho', ['Right_lymphatic_duct']),
    'colectores-cuello': linfatico('Colectores del cuello (esquemáticos)', ['Lymphatic_vessels_of_neck'], 'bilateral', 'contexto'),
    'colectores-cabeza': linfatico('Colectores de la cabeza (esquemáticos)', ['Lymphatic_vessels_of_head'], 'bilateral', 'contexto'),
    'yugular-interna': contexto('Vena yugular interna', ['Internal_jugular_vein'], 'vena'),
    'yugulares-internas': contexto('Venas yugulares internas', ['Internal_jugular_vein'], 'vena', 'ambos'),
    'yugular-externa': contexto('Vena yugular externa', ['External_jugular_vein'], 'vena'),
    'vena-facial': contexto('Vena facial común', ['Common_facial_vein'], 'vena'),
    subclavias: contexto('Venas subclavias', ['Left_subclavian_vein', 'Right_subclavian_vein'], 'vena', 'impar'),
    braquiocefalicas: contexto('Venas braquiocefálicas', ['Left_brachiocephalic_vein', 'Right_brachiocephalic_vein'], 'vena', 'impar'),
    'digastrico-posterior': contexto('Vientre posterior del digástrico', ['Posterior_belly_of_digastric_muscle'], 'musculo'),
    'digastrico-anterior': contexto('Vientre anterior del digástrico', ['Anterior_belly_of_digastric_muscle'], 'musculo'),
    esternocleidomastoideo: contexto('Músculo esternocleidomastoideo', ['Sternocleidomastoid_muscle'], 'musculo'),
    'glandula-submandibular': contexto('Glándula submandibular', ['Submandibular_gland'], 'glandula'),
    parotida: contexto('Glándula parótida', ['Parotid_gland'], 'glandula'),
    mandibula: contexto('Mandíbula', ['Mandible'], 'hueso', 'impar'),
    clavicula: contexto('Clavícula', ['Clavicle'], 'hueso'),
  },
  pasos: [
    {
      id: 'orientacion', tipo: 'orientacion', titulo: 'Un collar de nodos',
      texto: [
        ['De los casi 800 nodos linfáticos del cuerpo, unos 300 están en la cabeza y el cuello.', W('Lymphatic_system', 'Of the nearly 800 lymph nodes in the human body, about 300 are located in the head and neck.')],
        ['La descripción clásica los ve como un collar alrededor de la parte alta de las vías respiratoria y digestiva.', W(CLN, 'Rouviere described the cervical lymph nodes as a collar which surrounded the upper aerodigestive tract')],
        ['En el modelo, los nodos son ovalados y están unidos por colectores esquemáticos, y las venas principales salen como referencia aunque el sistema venoso esté apagado.', MODELO],
        ['El esternocleidomastoideo está translúcido: debajo de él está la cadena principal.', GUIA],
      ],
      vista: { ver: [...CABEZA, ...MANDIBULA, ...PROFUNDOS, 'cervicales-superficiales', 'supraclaviculares'], contexto: ['yugular-interna', 'colectores-cuello', 'colectores-cabeza'], fantasma: ['esternocleidomastoideo'], camara: 'anterolateral', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'Recorre el collar de nodos.', vistas: [{ nombre: 'De frente', camara: 'anterior' }, { nombre: 'De lado', camara: 'lateral' }, { nombre: 'Por detrás', camara: 'posterior' }] },
      comprobar: 'fun-todo-profundos',
    },
    {
      id: 'cabeza', tipo: 'explicacion', titulo: 'Nodos superficiales de la cabeza',
      texto: [
        ['Los occipitales, de uno a tres, están en el borde del trapecio y drenan parte del cuero cabelludo de la nuca.', W('Occipital_lymph_nodes', 'are a group of 1-3 superficial lymph nodes of the head situated in the occipital region that drain part of the scalp of the occiput.'), W('Occipital_lymph_nodes', 'They are situated at the margin of the trapezius')],
        ['Los mastoideos, en general dos, están justo debajo de la oreja, sobre la inserción del esternocleidomastoideo en la mastoides.', W('Mastoid_lymph_nodes', 'usually two in number, located just beneath the ear, on the mastoid insertion of the sternocleidomastoideus muscle')],
        ['Los parotídeos superficiales están justo delante del trago y reciben la linfa de la parte lateral de la frente, la sien, la región cigomática y los párpados.', W('Superficial_parotid_lymph_nodes', 'They are situated just anterior to the tragus of the ear.'), W('Superficial_parotid_lymph_nodes', 'These lymph nodes receive lymph from more lateral parts of the forehead and from the temporal and zygomatic region')],
        ['Los tres grupos vierten en los nodos cervicales profundos superiores.', W('Occipital_lymph_nodes', 'Their efferents in turn drain into the superior deep cervical glands.'), W('Mastoid_lymph_nodes', 'The lymph then passes to the superior deep cervical glands.'), W('Superficial_parotid_lymph_nodes', 'Superficial parotid lymph nodes in turn empty into the superior deep cervical lymph nodes.')],
      ],
      vista: { ver: CABEZA, contexto: ['parotida', 'colectores-cabeza'], fantasma: ['esternocleidomastoideo'], camara: 'lateral', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: CABEZA, texto: 'Alterna los tres grupos: detrás de la cabeza, detrás de la oreja y delante de ella.' },
      comprobar: 'rel-superficiales-cabeza',
    },
    {
      id: 'mandibula', tipo: 'exploracion', titulo: 'Bajo la mandíbula',
      texto: [
        ['Los submandibulares, de tres a seis, están sobre la glándula submandibular y por detrás y por fuera del vientre anterior del digástrico.', W(SUB, 'are some 3-6 lymph nodes'), W(SUB, 'They are situated just superficial to the submandibular salivary gland, and posterolateral to the anterior belly of either digastric muscle.')],
        ['Drenan el labio superior, el cuerpo de la lengua, las mejillas y la mayoría de los dientes, y vierten en los cervicales profundos superiores.', W(SUB, 'They drain the upper lip, body of tongue, cheeks, anterior portion of the hard palate, and most teeth'), W(SUB, 'They drain to the superior deep cervical lymph nodes.')],
        ['Los submentonianos, dos o tres, están cerca de la línea media, entre los vientres anteriores de los digástricos, y drenan el labio inferior, el suelo de la boca, la punta de la lengua y el mentón.', W(SM, 'are 2-3 lymph nodes situated in the submental triangle, between the anterior bellies of the digastric muscle and the hyoid bone.'), W(SM, 'They are situated close to the midline.'), W(SM, 'They drain the lower lip, floor of the mouth, apex of the tongue, chin')],
        ['Su linfa va a los submandibulares o directamente a los cervicales profundos.', W(SM, 'They drain either to submandibular lymph nodes (which then drain to deep cervical lymph nodes), or to the deep cervical lymph nodes directly.')],
      ],
      vista: { ver: MANDIBULA, contexto: ['glandula-submandibular', 'digastrico-anterior', 'colectores-cuello'], fantasma: ['mandibula'], camara: 'anterolateral', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'submentonianos', texto: 'Toca los nodos que están entre los dos vientres anteriores del digástrico.' },
      comprobar: 'rel-submentonianos',
    },
    {
      id: 'cadena', tipo: 'relaciones', titulo: 'La cadena profunda sigue a la yugular interna',
      texto: [
        ['Los nodos cervicales profundos forman una cadena a lo largo de la vena yugular interna, dentro de la vaina carotídea.', W(DCN, 'form a chain along the internal jugular vein within the carotid sheath.')],
        ['Los superiores acompañan a la parte alta de la yugular, la mayoría bajo el esternocleidomastoideo; los inferiores, a su parte baja.', W(SUP, 'are the deep cervical lymph nodes that are situated adjacent to the superior portion of the internal jugular vein.'), W(SUP, 'Most of these lymph nodes are situated deep to the sternocleidomastoid muscle'), W(INF, 'They are closely related to the inferior portion of internal jugular vein')],
        ['El yugulodigástrico, uno de los nodos más grandes de la cadena, está donde el vientre posterior del digástrico cruza la yugular interna.', W(JD, 'The jugulodigastric lymph nodes are found in the proximity of where the posterior belly of the digastric muscle crosses the internal jugular vein.'), W(JD, 'They tend to be some of the largest lymph nodes in the cervical chain')],
        ['Sigue la yugular interna de arriba abajo con el esternocleidomastoideo translúcido: los nodos van pegados a ella.', GUIA],
        ['En el modelo, los nodos cervicales profundos inferiores no son un espejo exacto entre los dos lados: no cabían igual junto a las yugulares del modelo.', MODELO],
      ],
      detalle: [
        ['En la clínica se cuentan por niveles a lo largo de la yugular: el II en su tercio superior, el III en el medio y el IV en el inferior.', W(CLN, 'Level II: Upper jugular nodes (Subdigastric nodes) - upper third of the internal jugular vein and adjacent accessory nerve.'), W(CLN, 'Level III: Middle jugular nodes - middle third of the internal jugular vein, between the hyoid and cricoid cartilage.'), W(CLN, 'Level IV: Lower jugular nodes - lower third of the internal jugular vein between the cricoid and clavicle')],
        ['El yugulodigástrico recibe antes que ningún otro la linfa de la cara, la boca, la faringe y las amígdalas.', W(JD, 'The jugulodigastric lymph nodes are the first to receive lymphatic drainage from face, mouth, pharynx, and tonsils.')],
      ],
      vista: { ver: PROFUNDOS, contexto: ['yugular-interna', 'digastrico-posterior', 'vena-facial'], fantasma: ['esternocleidomastoideo'], camara: 'lateral', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'yugulodigastrico', texto: 'Toca el nodo grande donde el vientre posterior del digástrico cruza la yugular interna.' },
      comprobar: 'rel-yugulodigastrico',
    },
    {
      id: 'todo-profundos', tipo: 'funcion', titulo: 'Todo acaba en los profundos',
      texto: [
        ['Todos los vasos linfáticos de la cabeza y el cuello acaban en los nodos cervicales profundos, a través de otros nodos o directamente.', W(DCN, 'All lymphatic vessels of the head and neck ultimately drain to the deep cervical lymph nodes - either by way of other lymph nodes or directly from tissues.')],
        ['Los cervicales laterales superficiales siguen la vena yugular externa, entre la parótida y los supraclaviculares, y vierten en los supraclaviculares y en el tronco yugular.', W('Superficial_lateral_cervical_lymph_nodes', 'are found along the course of the external jugular vein, between the inferior aspect of the parotid gland and the supraclavicular nodes.'), W('Superficial_lateral_cervical_lymph_nodes', 'These nodes drain into the supraclavicular nodes, and on to the jugular trunk')],
        ['Algunos superiores drenan en los inferiores, y los inferiores, en el tronco yugular.', W(INF, 'Some superior deep cervical lymph nodes drain to the inferior deep cervical lymph nodes.'), W(INF, 'The inferior deep cervical lymph nodes drain to the jugular lymph trunk.')],
      ],
      detalle: [
        ['Una parte de la linfa del cuero cabelludo de la nuca baja por un vaso junto al borde posterior del esternocleidomastoideo directamente a los cervicales profundos inferiores.', W('Occipital_lymph_nodes', 'this region is also drained by a lymphatic vessel which passes along the posterior border of the sternocleidomastoid muscle to drain directly into the inferior deep cervical lymph nodes')],
      ],
      vista: { ver: ['cervicales-superficiales', 'cervicales-superiores', 'cervicales-inferiores'], contexto: ['yugular-externa', 'yugular-interna', 'colectores-cuello'], fantasma: ['esternocleidomastoideo'], camara: 'lateral', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['cervicales-superficiales', 'cervicales-superiores', 'cervicales-inferiores'], texto: 'Compara la cadena superficial, junto a la yugular externa, con la profunda, junto a la interna.' },
      comprobar: 'rel-superficiales-cuello',
    },
    {
      id: 'final', tipo: 'relaciones', titulo: 'Tronco yugular y ángulo venoso',
      texto: [
        ['Los vasos que salen de los cervicales profundos forman el tronco yugular de su lado.', W(DCN, 'Efferents of the deep cervical lymph nodes form the ipsilateral jugular trunk.')],
        ['El derecho termina en el ángulo venoso, la unión de la yugular interna y la subclavia; el izquierdo se une al conducto torácico.', W(JT, 'On the right side, this trunk ends in the junction of the internal jugular and subclavian veins, called the venous angle.'), W(JT, 'On the left side it joins the thoracic duct.')],
        ['El conducto torácico llega al cuello por detrás de la carótida común izquierda, del vago y de la yugular interna, y termina en el ángulo venoso izquierdo.', W(TD, 'It passes posterior to the left common carotid artery, vagus nerve (CN X), and internal jugular vein.'), W(VA, 'The thoracic duct drains at the left venous angle, and the right lymphatic duct drains at the right venous angle.')],
        ['En el modelo, el tronco yugular derecho se une a los otros dos troncos derechos en un conducto linfático derecho corto, y el izquierdo acaba en el final del conducto torácico: es la variante clásica, elegida para enseñar.', MODELO],
      ],
      vista: { ver: [...FINAL, 'cervicales-inferiores'], contexto: ['yugulares-internas', 'subclavias', 'braquiocefalicas'], fantasma: ['clavicula'], camara: 'anterior', lado: 'L' },
      actividad: { tipo: 'comparar', estructuras: ['conducto-toracico', 'conducto-derecho'], texto: 'Alterna los dos lados: el conducto torácico a la izquierda y el linfático derecho a la derecha.' },
      comprobar: 'rel-tronco-izquierdo',
    },
    {
      id: 'virchow', tipo: 'funcion', titulo: 'El nodo de Virchow',
      texto: [
        ['Los nodos supraclaviculares están por encima de la clavícula y se pueden palpar en la fosa supraclavicular; los del lado izquierdo se llaman nodos de Virchow.', W(SCL, 'Supraclavicular lymph nodes are lymph nodes found above the clavicle, that can be felt in the supraclavicular fossa.'), W(SCL, "The supraclavicular lymph nodes on the left side are called Virchow's nodes.")],
        ['Están junto al final del conducto torácico, que trae la linfa de la mayor parte del cuerpo.', W(SCL, "The left supraclavicular nodes are the classical Virchow's node because they receive lymphatic drainage of most of the body (from the thoracic duct)")],
        ['Por eso un nodo de Virchow grande puede ser la primera señal de un cáncer del abdomen, sobre todo del estómago.', W(TD, "The first sign of a malignancy, especially an intra-abdominal one, may be an enlarged Virchow's node"), W(SCL, 'are therefore sentinel lymph nodes of cancer in the abdomen, particularly gastric cancer')],
      ],
      vista: { ver: ['supraclaviculares', 'conducto-toracico'], contexto: ['yugulares-internas', 'subclavias'], fantasma: ['clavicula', 'esternocleidomastoideo'], camara: 'anterior', lado: 'L' },
      actividad: { tipo: 'localizar', estructura: 'supraclaviculares', texto: 'Toca los nodos supraclaviculares del lado izquierdo, junto al final del conducto torácico.' },
      comprobar: 'fun-virchow',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'Repaso',
      texto: [
        ['Superficiales de la cabeza (occipitales, mastoideos, parotídeos) y bajo la mandíbula (submandibulares, submentonianos): todos vierten en los cervicales profundos.', W('Mastoid_lymph_nodes', 'The lymph then passes to the superior deep cervical glands.'), W(SUB, 'They drain to the superior deep cervical lymph nodes.'), W(DCN, 'All lymphatic vessels of the head and neck ultimately drain to the deep cervical lymph nodes')],
        ['La cadena profunda va a lo largo de la yugular interna; el yugulodigástrico, donde la cruza el vientre posterior del digástrico.', W(DCN, 'form a chain along the internal jugular vein within the carotid sheath.'), W(JD, 'where the posterior belly of the digastric muscle crosses the internal jugular vein')],
        ['Tronco yugular: el derecho al ángulo venoso derecho; el izquierdo, al conducto torácico, junto al nodo de Virchow.', W(JT, 'On the right side, this trunk ends in the junction of the internal jugular and subclavian veins, called the venous angle.'), W(JT, 'On the left side it joins the thoracic duct.'), W(SCL, "A Virchow's node is a left-sided supraclavicular lymph node.")],
      ],
    },
  ],
  preguntas: [
    { id: 'id-occipitales', tipo: 'identificar', estructura: 'occipitales', objetivo: 0, paso: 'cabeza' },
    { id: 'id-parotideos', tipo: 'identificar', estructura: 'parotideos', objetivo: 0, paso: 'cabeza' },
    { id: 'id-submandibulares', tipo: 'identificar', estructura: 'submandibulares', objetivo: 0, paso: 'mandibula' },
    { id: 'loc-submentonianos', tipo: 'localizar', estructura: 'submentonianos', candidatas: ['submandibulares', 'yugulodigastrico', 'parotideos'], objetivo: 0, paso: 'mandibula' },
    {
      id: 'rel-superficiales-cabeza', tipo: 'relacion', objetivo: 0, paso: 'cabeza', estructuras: CABEZA,
      enunciado: '¿Adónde vierten la linfa los nodos occipitales, mastoideos y parotídeos superficiales?',
      correcta: 'A los nodos cervicales profundos superiores',
      distractores: ['Directamente al conducto torácico', 'A los nodos submentonianos', 'A los nodos axilares'],
      explicacion: 'Los tres grupos superficiales de la cabeza vierten en los cervicales profundos superiores, a lo largo de la yugular interna.',
      evidencia: [W('Occipital_lymph_nodes', 'Their efferents in turn drain into the superior deep cervical glands.'), W('Mastoid_lymph_nodes', 'The lymph then passes to the superior deep cervical glands.'), W('Superficial_parotid_lymph_nodes', 'Superficial parotid lymph nodes in turn empty into the superior deep cervical lymph nodes.')],
    },
    {
      id: 'rel-submentonianos', tipo: 'relacion', objetivo: 0, paso: 'mandibula', estructuras: ['submentonianos'],
      enunciado: '¿Qué territorio drenan los nodos submentonianos?',
      correcta: 'El labio inferior, el suelo de la boca, la punta de la lengua y el mentón',
      distractores: ['El labio superior, las mejillas y el cuerpo de la lengua', 'El cuero cabelludo de la nuca', 'La frente y los párpados'],
      explicacion: 'El labio superior, las mejillas y el cuerpo de la lengua van a los submandibulares; la nuca, a los occipitales, y la frente y los párpados, a los parotídeos.',
      evidencia: [W(SM, 'They drain the lower lip, floor of the mouth, apex of the tongue, chin'), W(SUB, 'They drain the upper lip, body of tongue, cheeks')],
    },
    { id: 'id-yugulodigastrico', tipo: 'identificar', estructura: 'yugulodigastrico', objetivo: 1, paso: 'cadena' },
    { id: 'id-cervicales-inferiores', tipo: 'identificar', estructura: 'cervicales-inferiores', objetivo: 1, paso: 'cadena' },
    { id: 'loc-yugulodigastrico', tipo: 'localizar', estructura: 'yugulodigastrico', candidatas: ['cervicales-inferiores', 'submandibulares', 'supraclaviculares'], objetivo: 1, paso: 'cadena' },
    {
      id: 'rel-cadena', tipo: 'relacion', objetivo: 1, paso: 'cadena', estructuras: PROFUNDOS,
      enunciado: '¿Qué estructura sirve de guía para seguir la cadena cervical profunda?',
      correcta: 'La vena yugular interna, dentro de la vaina carotídea',
      distractores: ['La vena yugular externa, bajo la piel', 'La arteria subclavia', 'El nervio frénico, sobre el escaleno anterior'],
      explicacion: 'Los nodos cervicales profundos forman una cadena a lo largo de la yugular interna, en la vaina carotídea; los que siguen a la yugular externa son los superficiales.',
      evidencia: [W(DCN, 'form a chain along the internal jugular vein within the carotid sheath.'), W('Superficial_lateral_cervical_lymph_nodes', 'are found along the course of the external jugular vein')],
    },
    {
      id: 'rel-yugulodigastrico', tipo: 'relacion', objetivo: 1, paso: 'cadena', estructuras: ['yugulodigastrico'],
      enunciado: '¿Dónde está el nodo yugulodigástrico?',
      correcta: 'Donde el vientre posterior del digástrico cruza la vena yugular interna',
      distractores: ['Entre los vientres anteriores de los dos digástricos', 'Delante del trago de la oreja', 'Por encima de la clavícula, en la fosa supraclavicular'],
      explicacion: 'Es uno de los nodos más grandes de la cadena y recibe antes que ningún otro la linfa de la cara, la boca, la faringe y las amígdalas.',
      evidencia: [W(JD, 'The jugulodigastric lymph nodes are found in the proximity of where the posterior belly of the digastric muscle crosses the internal jugular vein.'), W(JD, 'The jugulodigastric lymph nodes are the first to receive lymphatic drainage from face, mouth, pharynx, and tonsils.')],
    },
    {
      id: 'fun-todo-profundos', tipo: 'funcion', objetivo: 2, paso: 'todo-profundos', estructuras: ['cervicales-superiores', 'cervicales-inferiores'],
      enunciado: '¿Qué nodos reciben, al final, la linfa de toda la cabeza y el cuello?',
      correcta: 'Los cervicales profundos',
      distractores: ['Los submentonianos', 'Los occipitales', 'Los parotídeos superficiales'],
      explicacion: 'Todos los vasos linfáticos de la cabeza y el cuello acaban en los cervicales profundos, a través de otros nodos o directamente.',
      evidencia: [W(DCN, 'All lymphatic vessels of the head and neck ultimately drain to the deep cervical lymph nodes - either by way of other lymph nodes or directly from tissues.')],
    },
    {
      id: 'rel-superficiales-cuello', tipo: 'relacion', objetivo: 2, paso: 'todo-profundos', estructuras: ['cervicales-superficiales'],
      enunciado: '¿A lo largo de qué vena están los nodos cervicales laterales superficiales?',
      correcta: 'La vena yugular externa',
      distractores: ['La vena yugular interna', 'La vena subclavia', 'La vena facial'],
      explicacion: 'Van a lo largo de la yugular externa, entre la parótida y los supraclaviculares; la cadena profunda es la que sigue a la yugular interna.',
      evidencia: [W('Superficial_lateral_cervical_lymph_nodes', 'are found along the course of the external jugular vein, between the inferior aspect of the parotid gland and the supraclavicular nodes.')],
    },
    {
      id: 'sec-boca-tronco', tipo: 'secuencia', objetivo: 3, paso: 'final',
      enunciado: 'Ordena el camino de la linfa de la punta de la lengua hasta el tronco yugular, por la vía de los submandibulares:',
      orden: ['Nodos submentonianos', 'Nodos submandibulares', 'Nodos cervicales profundos superiores', 'Tronco yugular'],
      explicacion: 'Los submentonianos vierten en los submandibulares (o directamente en los profundos); los submandibulares, en los cervicales profundos superiores, cuyos vasos forman el tronco yugular.',
      evidencia: [W(SM, 'They drain either to submandibular lymph nodes (which then drain to deep cervical lymph nodes)'), W(SUB, 'They drain to the superior deep cervical lymph nodes.'), W(JT, 'It is formed by vessels that emerge from the superior deep cervical lymph nodes and unite to efferents of the inferior deep cervical lymph nodes.')],
    },
    {
      id: 'rel-tronco-izquierdo', tipo: 'relacion', objetivo: 3, paso: 'final', estructuras: ['tronco-yugular', 'conducto-toracico'],
      enunciado: '¿Dónde termina el tronco yugular izquierdo?',
      correcta: 'Se une al conducto torácico',
      distractores: ['En el conducto linfático derecho', 'En la vena yugular externa', 'En la cisterna del quilo'],
      explicacion: 'El izquierdo se une al conducto torácico; el derecho termina en el ángulo venoso derecho (en el modelo, a través del conducto linfático derecho).',
      evidencia: [W(JT, 'On the left side it joins the thoracic duct.'), W(JT, 'On the right side, this trunk ends in the junction of the internal jugular and subclavian veins, called the venous angle.')],
    },
    { id: 'id-tronco-yugular', tipo: 'identificar', estructura: 'tronco-yugular', objetivo: 3, paso: 'final' },
    { id: 'id-conducto-toracico', tipo: 'identificar', estructura: 'conducto-toracico', objetivo: 3, paso: 'final' },
    {
      id: 'fun-virchow', tipo: 'funcion', objetivo: 4, paso: 'virchow', estructuras: ['supraclaviculares', 'conducto-toracico'],
      enunciado: '¿Por qué un nodo supraclavicular izquierdo grande puede indicar un cáncer del abdomen?',
      correcta: 'Porque está junto al final del conducto torácico, que trae la linfa de la mayor parte del cuerpo',
      distractores: ['Porque drena directamente el estómago a través del diafragma', 'Porque recibe la linfa del brazo izquierdo', 'Porque forma parte del conducto linfático derecho'],
      explicacion: 'El nodo de Virchow recibe linfa de la mayor parte del cuerpo por el conducto torácico; un cáncer del abdomen, sobre todo de estómago, puede dar como primera señal su aumento.',
      evidencia: [W(SCL, "The left supraclavicular nodes are the classical Virchow's node because they receive lymphatic drainage of most of the body (from the thoracic duct)"), W(TD, "The first sign of a malignancy, especially an intra-abdominal one, may be an enlarged Virchow's node")],
    },
    { id: 'id-supraclaviculares', tipo: 'identificar', estructura: 'supraclaviculares', objetivo: 4, paso: 'virchow' },
  ],
});
