// Fichas de los nodos del cuello (cadena yugular, cervicales superficiales, pretraqueales, retrofaríngeos, supraclaviculares…): grupo «Lymph_nodes_of_neck».
// Formato y reglas: ./formato.js (cada frase con su fuente; MODELO solo en «En este modelo»). Clave = nombre de la pieza
// sin _L/_R. Comprobar: node scripts/linfatico-citas.mjs comprobar && node scripts/check-cards.mjs
// BORRADOR redactado con IA, sin revisión médica. Tabla de fuentes: docs/fuentes/linfatico-cuello.md.
// Submandibulares y submentonianos: el modelo los pasó al grupo del cuello (como la TA2), pero sus fichas siguen en
// cabeza.js (una clave solo puede estar en un archivo); si se mueven aquí, hay que borrarlas allí en el mismo cambio.
import { W, ES, TA, MODELO } from './formato.js';

// Frase común del campo «En este modelo» de un grupo de nodos.
const REPRESENTATIVO = ['En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.', MODELO];

// Cadena cervical profunda (común a yugulodigástrico, yugular superolateral, cervicales laterales inferiores profundos y yugulares anteroinferiores).
const PROF_CADENA = ['Los nodos cervicales profundos forman una cadena a lo largo de la vena yugular interna, dentro de la vaina carotídea.', W('Deep_cervical_lymph_nodes', 'form a chain along the internal jugular vein within the carotid sheath')];
const PROF_GRUPOS = ['La cadena profunda se divide en un grupo superior y otro inferior.', W('Deep_cervical_lymph_nodes', 'The deep cervical lymph nodes are subdivided into a superior group and an inferior group.')];
const PROF_TODO = ['Todos los vasos linfáticos de la cabeza y el cuello acaban llegando a los cervicales profundos, a través de otros nodos o directamente desde los tejidos.', W('Deep_cervical_lymph_nodes', 'All lymphatic vessels of the head and neck ultimately drain to the deep cervical lymph nodes - either by way of other lymph nodes or directly from tissues.')];
const PROF_MENINGES = ['También reciben la linfa y el líquido cefalorraquídeo que llevan los vasos linfáticos meníngeos.', W('Deep_cervical_lymph_nodes', 'serve as the principal drainage site for both lymphatic fluid and cerebrospinal fluid carried by the meningeal lymphatic vessels')];
const PROF_EFERENTES = ['Los eferentes de la cadena profunda forman el tronco yugular de su lado.', W('Deep_cervical_lymph_nodes', 'Efferents of the deep cervical lymph nodes form the ipsilateral jugular trunk.')];
const PROF_VAINA = ['La vena yugular interna, que baja por la vaina carotídea junto a la arteria carótida común y el nervio vago.', W('Deep_cervical_lymph_nodes', 'are contained in the carotid sheath in the neck, close to the internal jugular vein'), W('Internal_jugular_vein', 'This vein runs in the carotid sheath with the common carotid artery and vagus nerve.')];

// Grupo superior (yugulodigástrico y yugular superolateral).
const SUP_SITIO = ['Los cervicales profundos superiores están junto a la parte superior de la vena yugular interna.', W('Superior_deep_cervical_lymph_nodes', 'are situated adjacent to the superior portion of the internal jugular vein')];
const SUP_ECM = ['La mayoría quedan por debajo del esternocleidomastoideo; unos están por delante de la vena y otros por detrás, y también junto al nervio accesorio.', W('Superior_deep_cervical_lymph_nodes', 'Most of these lymph nodes are situated deep to the sternocleidomastoid muscle'), W('Superior_deep_cervical_lymph_nodes', 'Some are situated anterior and some posterior to the internal jugular vein.'), W('Superior_deep_cervical_lymph_nodes', 'They are also situated adjacent to the accessory nerve (CN XI).')];
const SUP_DRENA = ['Los cervicales profundos superiores drenan en los inferiores o en el tronco yugular.', W('Superior_deep_cervical_lymph_nodes', 'They drain either to the inferior deep cervical lymph nodes or into the jugular trunk.')];
const SUP_RECIBE_CABEZA = ['Les llega la linfa de los nodos occipitales y mastoideos y de los retrofaríngeos.', W('Occipital_lymph_nodes', 'Their efferents in turn drain into the superior deep cervical glands.'), W('Mastoid_lymph_nodes', 'The lymph then passes to the superior deep cervical glands.'), W('Retropharyngeal_lymph_nodes', 'Their efferents pass to the superior deep cervical lymph nodes.')];
const SUP_RECIBE_SUBMAND = ['También les llega la de los nodos submandibulares y, directamente o a través de estos, la de los submentonianos.', W('Submandibular_lymph_nodes', 'They drain to the superior deep cervical lymph nodes.'), W('Submental_lymph_nodes', 'They drain either to submandibular lymph nodes (which then drain to deep cervical lymph nodes), or to the deep cervical lymph nodes directly.')];
const NIVEL_II = ['En la clasificación clínica por niveles corresponden al nivel II, nodos yugulares altos: el tercio superior de la vena yugular interna, entre la base del cráneo y el hioides.', W('Cervical_lymph_nodes', 'Level II: Upper jugular nodes (Subdigastric nodes) - upper third of the internal jugular vein and adjacent accessory nerve.'), W('Cervical_lymph_nodes', 'The upper boundary is the base of the skull and the lower boundary is the hyoid.')];

// Grupo inferior (cervicales laterales inferiores profundos y yugulares anteroinferiores).
const INF_SITIO = ['Los cervicales profundos inferiores están en parte por debajo del esternocleidomastoideo, muy cerca de la porción inferior de la vena yugular interna.', W('Inferior_deep_cervical_lymph_nodes', 'They are situated partial deep to the sternocleidomastoid muscle.'), W('Inferior_deep_cervical_lymph_nodes', 'They are closely related to the inferior portion of internal jugular vein')];
const INF_TRIANGULO = ['Algunos, los del triángulo supraclavicular, por detrás del borde posterior del esternocleidomastoideo, están junto al plexo braquial y la arteria y la vena subclavias.', W('Inferior_deep_cervical_lymph_nodes', 'some are also closely related to the brachial plexus, and the subclavian artery and subclavian vein (those situated in the supraclavicular triangle - beyond the posterior margin of the sternocleidomastoid muscle)')];
const INF_RECIBE = ['Reciben la linfa de parte de los cervicales profundos superiores.', W('Inferior_deep_cervical_lymph_nodes', 'Some superior deep cervical lymph nodes drain to the inferior deep cervical lymph nodes.')];
const INF_OCCIPITAL = ['Les llega directamente un vaso linfático de la región occipital que baja por el borde posterior del esternocleidomastoideo.', W('Occipital_lymph_nodes', 'this region is also drained by a lymphatic vessel which passes along the posterior border of the sternocleidomastoid muscle to drain directly into the inferior deep cervical lymph nodes')];
const INF_DRENA = ['Los cervicales profundos inferiores drenan en el tronco yugular.', W('Inferior_deep_cervical_lymph_nodes', 'The inferior deep cervical lymph nodes drain to the jugular lymph trunk.')];
const TRONCO_FIN = ['El tronco yugular acaba, a la derecha, en la unión de las venas yugular interna y subclavia (ángulo venoso) y, a la izquierda, en el conducto torácico.', W('Jugular_trunk', 'On the right side, this trunk ends in the junction of the internal jugular and subclavian veins, called the venous angle.'), W('Jugular_trunk', 'On the left side it joins the thoracic duct.')];
const NIVEL_III_IV = ['En la clasificación clínica, el tercio medio de la vena yugular interna es el nivel III y el tercio inferior, entre el cricoides y la clavícula, el nivel IV.', W('Cervical_lymph_nodes', 'Level III: Middle jugular nodes - middle third of the internal jugular vein'), W('Cervical_lymph_nodes', 'Level IV: Lower jugular nodes - lower third of the internal jugular vein between the cricoid and clavicle')];
const TRONCO_MODELO = ['En este modelo el tronco yugular nace en el último nodo cervical lateral inferior profundo; a la izquierda acaba en el final del conducto torácico (variante elegida: puede abrirse directamente en la vena) y a la derecha en el conducto linfático derecho.', MODELO];
const OMOHIOIDEO = ['El nodo yugulo-omohioideo de la Terminologia Anatomica 2 no se representa por separado en este modelo.', TA(5230), MODELO];

// Compartimento anterior (pretraqueales, paratraqueales y tiroideos).
const NIVEL_VI = ['En la clasificación clínica, los pretraqueales, paratraqueales, prelaríngeos y peritiroideos forman el nivel VI, el compartimento anterior, entre el hioides, la escotadura supraesternal y las dos carótidas comunes.', W('Cervical_lymph_nodes', 'Level VI: Anterior compartment nodes - Pretracheal, paratracheal, precricoid (Delphian) and perithyroid nodes'), W('Cervical_lymph_nodes', 'The upper border is the hyoid, the lower the suprasternal notch, and the lateral borders the common carotid arteries.')];
const TIROIDES_DRENA = ['La linfa del tiroides pasa a menudo por los nodos prelaríngeos, pretraqueales y paratraqueales.', W('Thyroid', 'Lymphatic drainage frequently passes the prelaryngeal lymph nodes (located just above the isthmus) and the pretracheal and paratracheal lymph nodes.'), ES('Glándula_tiroides', 'terminan en ganglios linfáticos prelaríngeos, pretraqueales y paratraqueales')];
const PRELARINGEOS = ['Los nodos prelaríngeos de la Terminologia Anatomica 2 no se representan en este modelo.', TA(5219), MODELO];

export default {
  Jugulodigastric_node: {
    tipo: 'nodo', ta2: 5226,
    descripcion: [
      ['Nodos (ganglios) linfáticos grandes del cuello; suelen ser de los mayores de la cadena cervical.', W('Jugulodigastric_lymph_node', 'are large lymph nodes of the neck'), W('Jugulodigastric_lymph_node', 'They tend to be some of the largest lymph nodes in the cervical chain')],
      ['Forman un subgrupo de los cervicales profundos superiores, con un nodo grande y varios más pequeños.', W('Superior_deep_cervical_lymph_nodes', 'form a subgroup - the jugulodigastric group'), W('Superior_deep_cervical_lymph_nodes', 'The group consists of a single large lymph node and multiple smaller lymph nodes.')],
    ],
    localizacion: [
      ['Están cerca del punto en el que el vientre posterior del digástrico cruza la vena yugular interna.', W('Jugulodigastric_lymph_node', 'are found in the proximity of where the posterior belly of the digastric muscle crosses the internal jugular vein')],
      ['Ocupan el triángulo que limitan el vientre posterior del digástrico, la vena facial y la vena yugular interna.', W('Superior_deep_cervical_lymph_nodes', 'situated in a triangular region bounded by the posterior belly of the digastric muscle, the facial vein, and the internal jugular vein')],
    ],
    reparo: [
      ['El cruce del vientre posterior del digástrico sobre la vena yugular interna; la vena facial cierra el triángulo por delante.', W('Jugulodigastric_lymph_node', 'where the posterior belly of the digastric muscle crosses the internal jugular vein'), W('Superior_deep_cervical_lymph_nodes', 'bounded by the posterior belly of the digastric muscle, the facial vein, and the internal jugular vein')],
    ],
    recibe: [
      ['Son los primeros en recibir la linfa de la cara, la boca, la faringe y las amígdalas.', W('Jugulodigastric_lymph_node', 'are the first to receive lymphatic drainage from face, mouth, pharynx, and tonsils')],
      ['Intervienen sobre todo en el drenaje de la lengua.', W('Superior_deep_cervical_lymph_nodes', 'It is particularly involved in the drainage of the tongue')],
      SUP_RECIBE_SUBMAND,
    ],
    drena: [SUP_DRENA],
    modelo: [REPRESENTATIVO],
    notas: [
      ['En el adulto miden unos 15 mm de largo y se hacen más pequeños con la edad.', W('Jugulodigastric_lymph_node', 'Nodes are typically around 15 mm in length in adults, and decrease in size during old age.')],
      ['Suelen aumentar de tamaño en la amigdalitis.', W('Jugulodigastric_lymph_node', 'Enlarged jugulodigastric lymph nodes are also commonly found in tonsillitis.')],
      NIVEL_II,
    ],
    vias: { recibe: ['Submandibular_nodes', 'Submental_nodes'], drena: ['Inferior_deep_lateral_cervical_nodes', 'Anterior_inferior_jugular_nodes', 'Jugular_trunk'] },
  },

  Lateral_superior_jugular_node: {
    tipo: 'nodo', ta2: 5227,
    descripcion: [
      ['Nodo (ganglio) de los cervicales laterales profundos superiores que la Terminologia Anatomica 2 llama nodo yugular superolateral; el mismo grupo de la TA2 incluye el nodo yugulodigástrico y el yugular superoanterior.', TA(5225), TA(5227), TA(5226), TA(5228)],
      PROF_CADENA,
    ],
    localizacion: [SUP_SITIO, SUP_ECM],
    reparo: [PROF_VAINA],
    recibe: [SUP_RECIBE_CABEZA, SUP_RECIBE_SUBMAND, PROF_TODO, PROF_MENINGES],
    drena: [SUP_DRENA],
    modelo: [
      REPRESENTATIVO,
      ['Ninguna fuente libre consultada describe por separado el nodo yugular superolateral: esta ficha usa lo que se dice de los cervicales profundos superiores.', MODELO],
      ['El nodo yugular superoanterior de la Terminologia Anatomica 2 no se representa en este modelo.', TA(5228), MODELO],
    ],
    notas: [NIVEL_II],
    vias: {
      recibe: ['Occipital_nodes', 'Mastoid_nodes', 'Retropharyngeal_nodes', 'Submandibular_nodes', 'Submental_nodes'],
      drena: ['Inferior_deep_lateral_cervical_nodes', 'Anterior_inferior_jugular_nodes', 'Jugular_trunk'],
    },
  },

  Inferior_deep_lateral_cervical_nodes: {
    tipo: 'nodo', ta2: 5229,
    descripcion: [
      ['Grupo inferior de los nodos (ganglios) cervicales profundos, el otro es el superior.', W('Inferior_deep_cervical_lymph_nodes', 'are one of the two groups of the deep cervical lymph nodes (the other being the superior deep cervical lymph nodes)')],
      PROF_CADENA,
    ],
    localizacion: [INF_SITIO, INF_TRIANGULO],
    reparo: [
      ['La porción inferior de la vena yugular interna, en parte cubierta por el esternocleidomastoideo; los nodos más laterales quedan junto a los vasos subclavios y al plexo braquial.', W('Inferior_deep_cervical_lymph_nodes', 'They are closely related to the inferior portion of internal jugular vein'), W('Inferior_deep_cervical_lymph_nodes', 'some are also closely related to the brachial plexus, and the subclavian artery and subclavian vein')],
    ],
    recibe: [INF_RECIBE, INF_OCCIPITAL, PROF_TODO],
    drena: [INF_DRENA, TRONCO_FIN],
    modelo: [REPRESENTATIVO, TRONCO_MODELO, OMOHIOIDEO],
    notas: [
      NIVEL_III_IV,
      ['El nodo yugulo-omohioideo, junto al tendón intermedio del omohioideo, es uno de los cervicales profundos y recibe linfa de la lengua.', W('Jugulo-omohyoid_lymph_node', 'is related to the intermediate tendon of the omohyoid muscle'), W('Jugulo-omohyoid_lymph_node', 'It is designated as one of the deep cervical lymph nodes.'), W('Jugulo-omohyoid_lymph_node', 'As it is associated with the lymph drainage of the tongue')],
    ],
    vias: {
      recibe: ['Lateral_superior_jugular_node', 'Jugulodigastric_node', 'Occipital_nodes'],
      drena: ['Jugular_trunk'],
    },
  },

  Anterior_inferior_jugular_nodes: {
    tipo: 'nodo', ta2: 5232,
    descripcion: [
      ['Nodos (ganglios) de la cadena cervical profunda inferior que la Terminologia Anatomica 2 llama yugulares anteroinferiores.', TA(5229), TA(5232)],
      PROF_CADENA,
    ],
    localizacion: [INF_SITIO],
    reparo: [PROF_VAINA],
    recibe: [INF_RECIBE, PROF_TODO],
    drena: [INF_DRENA, TRONCO_FIN],
    modelo: [
      REPRESENTATIVO,
      ['Ninguna fuente libre consultada describe por separado los nodos yugulares anteroinferiores: esta ficha usa lo que se dice de los cervicales profundos inferiores.', MODELO],
      ['El nodo yugular lateroinferior de la Terminologia Anatomica 2 no se representa en este modelo.', TA(5231), MODELO],
    ],
    notas: [NIVEL_III_IV],
    vias: { recibe: ['Lateral_superior_jugular_node', 'Jugulodigastric_node'], drena: ['Jugular_trunk'] },
  },

  Supraclavicular_nodes: {
    tipo: 'nodo', ta2: 5233,
    descripcion: [
      ['Nodos (ganglios) linfáticos situados por encima de la clavícula, que se pueden palpar en la fosa supraclavicular.', W('Supraclavicular_lymph_nodes', 'are lymph nodes found above the clavicle, that can be felt in the supraclavicular fossa')],
      ['Los del lado izquierdo se llaman nodos de Virchow.', W('Supraclavicular_lymph_nodes', "The supraclavicular lymph nodes on the left side are called Virchow's nodes.")],
    ],
    localizacion: [
      ['Están en la fosa supraclavicular, la depresión que hay justo encima de la clavícula.', W('Supraclavicular_lymph_nodes', 'can be felt in the supraclavicular fossa'), W('Supraclavicular_fossa', 'is an indentation (fossa) immediately above the clavicle')],
      ['En la clasificación clínica forman parte del nivel V: por detrás y por fuera del esternocleidomastoideo, por delante y por dentro del trapecio y alrededor de la arteria cervical transversa.', W('Cervical_lymph_nodes', 'nodes posterolateral to the sternocleidomastoid and anteromedial to the trapezius above the clavicle'), W('Cervical_lymph_nodes', 'The nodes are around the lower half of the spinal accessory nerve and the transverse cervical artery, and include the supraclavicular nodes.')],
    ],
    reparo: [
      ['La clavícula, por debajo, y la arteria cervical transversa, que pasa entre ellos.', W('Supraclavicular_lymph_nodes', 'are lymph nodes found above the clavicle'), W('Cervical_lymph_nodes', 'The nodes are around the lower half of the spinal accessory nerve and the transverse cervical artery, and include the supraclavicular nodes.')],
    ],
    recibe: [
      ['Les llega la linfa de los nodos cervicales laterales superficiales, situados a lo largo de la vena yugular externa.', W('Superficial_lateral_cervical_lymph_nodes', 'These nodes drain into the supraclavicular nodes')],
      ['Los izquierdos reciben linfa de vasos linfáticos de la cavidad abdominal.', W('Supraclavicular_lymph_nodes', "Virchow's nodes take their supply from lymph vessels in the abdominal cavity"), ES('Nódulo_de_Virchow', 'Recibe el drenaje de vasos linfáticos en la cavidad abdominal.')],
    ],
    drena: [
      ['Su linfa sigue hacia el tronco yugular, que a la izquierda acaba en el conducto torácico y a la derecha en el conducto linfático derecho.', W('Superficial_lateral_cervical_lymph_nodes', 'drain into the supraclavicular nodes, and on to the jugular trunk, followed by the thoracic duct on the left or the right lymphatic duct')],
    ],
    modelo: [
      REPRESENTATIVO,
      ['En este modelo un colector esquemático une los nodos supraclaviculares con el tronco yugular de su lado.', MODELO],
    ],
    notas: [
      ['En la clasificación clínica pertenecen al nivel V, salvo el nodo de Virchow, que se cuenta en el nivel IV.', W('Cervical_lymph_nodes', "including the transverse cervical nodes and supraclavicular nodes (except Virchow's node which is in IV)")],
      ['El nodo de Virchow está en la fosa supraclavicular izquierda, cerca del lugar en el que el conducto torácico desemboca en la confluencia de las venas subclavia y yugular interna izquierdas.', ES('Nódulo_de_Virchow', 'es un ganglio linfático situado en la fosa supraclavicular izquierda'), W('Thoracic_duct', 'in the vicinity where the thoracic duct empties into the left brachiocephalic vein, right between where the left subclavian vein and left internal jugular join')],
      ['Su aumento de tamaño puede ser el primer signo de un cáncer abdominal, sobre todo gástrico, que se ha extendido por los vasos linfáticos (signo de Troisier).', W('Thoracic_duct', "The first sign of a malignancy, especially an intra-abdominal one, may be an enlarged Virchow's node"), W('Supraclavicular_lymph_nodes', "Such spread typically results in Troisier's sign, which is the finding of an enlarged, hard Virchow's node.")],
    ],
    vias: { recibe: ['Superficial_lateral_cervical_nodes'], drena: ['Jugular_trunk'] },
  },

  Superficial_lateral_cervical_nodes: {
    tipo: 'nodo', ta2: 5224,
    descripcion: [
      ['Nodos (ganglios) cervicales superficiales del lado del cuello, a lo largo de la vena yugular externa.', W('Superficial_lateral_cervical_lymph_nodes', 'are found along the course of the external jugular vein')],
    ],
    localizacion: [
      ['Están a lo largo de la vena yugular externa, entre la parte inferior de la parótida y los nodos supraclaviculares.', W('Superficial_lateral_cervical_lymph_nodes', 'are found along the course of the external jugular vein, between the inferior aspect of the parotid gland and the supraclavicular nodes')],
    ],
    reparo: [
      ['La vena yugular externa, que baja desde el ángulo de la mandíbula hacia la mitad de la clavícula cruzando por fuera el esternocleidomastoideo.', W('Superficial_lateral_cervical_lymph_nodes', 'are found along the course of the external jugular vein'), W('External_jugular_vein', 'runs perpendicularly down the neck, in the direction of a line drawn from the angle of the mandible to the middle of the clavicle superficial to the sternocleidomastoid muscle')],
    ],
    recibe: [
      ['Están intercalados en los vasos que drenan los nodos parotídeos e infraauriculares.', W('Superficial_lateral_cervical_lymph_nodes', 'The nodes are intercalated along the course of the vessels draining the parotid nodes and the infraauricular nodes.')],
    ],
    drena: [
      ['Drenan en los nodos supraclaviculares y de ahí al tronco yugular, que a la izquierda acaba en el conducto torácico y a la derecha en el conducto linfático derecho.', W('Superficial_lateral_cervical_lymph_nodes', 'These nodes drain into the supraclavicular nodes, and on to the jugular trunk, followed by the thoracic duct on the left or the right lymphatic duct.')],
    ],
    modelo: [
      REPRESENTATIVO,
      ['En este modelo el colector esquemático de este grupo va a los nodos cervicales laterales inferiores profundos, no a los supraclaviculares como describe la fuente.', MODELO],
    ],
    notas: [
      ['Algunas fuentes los sitúan solo a lo largo de la vena yugular externa; otras dicen que esto vale para el triángulo posterior y que en el triángulo anterior acompañan a la vena yugular anterior.', W('Superficial_cervical_lymph_nodes', 'Some sources state simply that they lie along the external jugular vein, while other sources state that they are only adjacent to the external jugular vein in the posterior triangle, and they are adjacent to the anterior jugular vein in the anterior triangle.')],
    ],
    vias: { recibe: ['Superficial_parotid_nodes', 'Intraglandular_parotid_nodes', 'Infra_auricular_nodes'], drena: ['Supraclavicular_nodes'] },
  },

  Superficial_anterior_cervical_nodes: {
    tipo: 'nodo', ta2: 5216,
    descripcion: [
      ['Grupo superficial de los nodos (ganglios) cervicales anteriores, en la parte anterior del cuello.', W('Anterior_cervical_lymph_nodes', 'are a group of nodes found on the anterior part of the neck'), W('Anterior_cervical_lymph_nodes', 'These can be grouped into a deep and superficial group.')],
    ],
    localizacion: [
      ['Están en la parte anterior del cuello, por delante del esternocleidomastoideo, cerca de la vena yugular anterior.', W('Anterior_cervical_lymph_nodes', 'in front of the sternocleidomastoid muscle'), W('Superficial_anterior_cervical_lymph_nodes', 'are found in proximity to the anterior jugular vein')],
    ],
    reparo: [
      ['La vena yugular anterior, que baja entre la línea media y el borde anterior del esternocleidomastoideo.', W('Superficial_anterior_cervical_lymph_nodes', 'are found in proximity to the anterior jugular vein'), W('Anterior_jugular_vein', 'It descends between the median line and the anterior border of the sternocleidomastoid muscle')],
    ],
    recibe: [
      ['Drenan las capas superficiales de la parte anterior del cuello.', W('Anterior_cervical_lymph_nodes', 'The superficial group drain the superficial surfaces of the anterior neck.')],
    ],
    drena: [
      ['Como toda la linfa de la cabeza y el cuello, la suya acaba llegando a los nodos cervicales profundos, a través de otros nodos o directamente.', W('Deep_cervical_lymph_nodes', 'All lymphatic vessels of the head and neck ultimately drain to the deep cervical lymph nodes - either by way of other lymph nodes or directly from tissues.')],
    ],
    modelo: [
      REPRESENTATIVO,
      ['En este modelo el grupo es una sola pieza impar, con nodos a los dos lados de la línea media.', MODELO],
      ['Ninguna fuente libre consultada dice a qué nodos van sus eferentes; en este modelo un colector esquemático los lleva a los nodos yugulares anteroinferiores de cada lado.', MODELO],
    ],
    vias: { drena: ['Anterior_inferior_jugular_nodes'] },
  },

  Pretracheal_nodes: {
    tipo: 'nodo', ta2: 5221,
    descripcion: [
      ['Nodos (ganglios) linfáticos del cuello situados delante de la tráquea.', W('Pretracheal_lymph_nodes', 'are lymph nodes located anterior to the trachea in the neck')],
    ],
    localizacion: [
      ['Están delante de la tráquea y siguen a las venas yugulares anteriores a cada lado de la línea media.', W('Pretracheal_lymph_nodes', 'The pretracheal lymph nodes lie anterior to the trachea.'), W('Pretracheal_lymph_nodes', 'They follow the anterior jugular veins either side of the midline.')],
    ],
    reparo: [
      ['La cara anterior de la tráquea y, a cada lado de la línea media, la vena yugular anterior.', W('Pretracheal_lymph_nodes', 'They follow the anterior jugular veins either side of the midline.'), W('Anterior_jugular_vein', 'The pretracheal lymph nodes follow the anterior jugular vein on each side of the midline.')],
    ],
    recibe: [TIROIDES_DRENA],
    drena: [
      ['Drenan en los nodos cervicales profundos en el lado derecho y en el conducto torácico en el izquierdo.', W('Pretracheal_lymph_nodes', 'They drain into the deep cervical lymph nodes on the right and the thoracic duct on the left.')],
    ],
    modelo: [
      REPRESENTATIVO,
      ['En este modelo un colector esquemático lleva los dos lados a los nodos yugulares anteroinferiores; el paso directo del lado izquierdo al conducto torácico que describe la fuente no está trazado.', MODELO],
      PRELARINGEOS,
    ],
    notas: [NIVEL_VI],
    vias: { drena: ['Anterior_inferior_jugular_nodes', 'Thoracic_duct'] },
  },

  Paratracheal_cervical_nodes: {
    tipo: 'nodo', ta2: 5222,
    descripcion: [
      ['Nodos (ganglios) linfáticos del cuello que forman una cadena derecha y otra izquierda a los lados de la tráquea.', W('Paratracheal_lymph_nodes', 'The right and left paratracheal lymph nodes (or paratracheal chains) are lymph nodes in the neck')],
    ],
    localizacion: [
      ['Están a los lados de la tráquea y del esófago, a lo largo del nervio laríngeo recurrente.', W('Paratracheal_lymph_nodes', 'situated lateral to the trachea and esophagus alongside the recurrent laryngeal nerve')],
    ],
    reparo: [
      ['El surco entre la tráquea y el esófago, por donde sube el nervio laríngeo recurrente.', W('Paratracheal_lymph_nodes', 'situated lateral to the trachea and esophagus alongside the recurrent laryngeal nerve')],
    ],
    recibe: [TIROIDES_DRENA],
    drena: [
      ['Drenan en los nodos cervicales profundos.', W('Paratracheal_lymph_nodes', 'They drain to the deep cervical lymph nodes.')],
    ],
    modelo: [
      REPRESENTATIVO,
      ['En este modelo el grupo es una sola pieza impar, aunque las fuentes describen una cadena derecha y otra izquierda.', MODELO, W('Paratracheal_lymph_nodes', 'The right and left paratracheal lymph nodes (or paratracheal chains)')],
      ['No hay que confundirlos con los nodos paratraqueales torácicos, que son otro grupo de la Terminologia Anatomica 2.', TA(5222), TA(5260), MODELO],
    ],
    notas: [NIVEL_VI],
    vias: { drena: ['Anterior_inferior_jugular_nodes', 'Inferior_deep_lateral_cervical_nodes'] },
  },

  Thyroid_nodes: {
    tipo: 'nodo', ta2: 5220,
    descripcion: [
      ['Nodos (ganglios) cervicales anteriores profundos situados junto a la glándula tiroides.', W('Thyroid_lymph_nodes', 'are deep anterior cervical lymph nodes found near the thyroid gland on the neck')],
    ],
    localizacion: [
      ['Están junto a la glándula tiroides, en la región que limitan el hioides por arriba y la escotadura esternal por abajo, por debajo del platisma.', W('Thyroid_lymph_nodes', 'found near the thyroid gland on the neck'), W('Deep_anterior_cervical_lymph_nodes', 'are bounded superiorly by the hyoid bone, inferiorly by the sternal notch, and are found deep to the overlying platysma muscle')],
    ],
    reparo: [
      ['La glándula tiroides.', W('Thyroid_lymph_nodes', 'found near the thyroid gland on the neck')],
    ],
    recibe: [
      ['Como los demás cervicales anteriores profundos, drenan la región de la laringe, la tráquea y el tiroides.', W('Thyroid_lymph_nodes', 'are deep anterior cervical lymph nodes'), W('Deep_anterior_cervical_lymph_nodes', 'These nodes drain the laryngo-tracho-thyroidal region.')],
      ['Los vasos linfáticos del tiroides forman un plexo alrededor de la glándula.', ES('Glándula_tiroides', 'Los vasos linfáticos de la glándula tiroides forman un plexo peritiroideo.')],
    ],
    modelo: [
      REPRESENTATIVO,
      ['En este modelo un colector esquemático los lleva a los nodos yugulares anteroinferiores de su lado.', MODELO],
    ],
    notas: [NIVEL_VI],
    pendientes: { drena: 'Ninguna fuente libre consultada dice adónde van los eferentes de los nodos tiroideos; la tabla de partida («→ cervicales profundos inferiores») no se afirma.' },
    vias: { drena: ['Anterior_inferior_jugular_nodes'] },
  },

  Retropharyngeal_nodes: {
    tipo: 'nodo', ta2: 5234,
    descripcion: [
      ['Nodos (ganglios) linfáticos situados detrás de la parte alta de la faringe, de uno a tres.', W('Retropharyngeal_lymph_nodes', 'The retropharyngeal lymph nodes, from one to three in number')],
    ],
    localizacion: [
      ['Están en la fascia bucofaríngea, detrás de la parte alta de la faringe y delante del arco del atlas, del que los separa el largo de la cabeza.', W('Retropharyngeal_lymph_nodes', 'lie in the buccopharyngeal fascia, behind the upper part of the pharynx and in front of the arch of the atlas, being separated, however, from the latter by the longus capitis')],
      ['Ocupan el espacio retrofaríngeo.', W('Retropharyngeal_lymph_nodes', 'They are in the retropharyngeal space.')],
    ],
    reparo: [
      ['La pared posterior de la parte alta de la faringe, por delante, y el músculo largo de la cabeza sobre el arco del atlas, por detrás.', W('Retropharyngeal_lymph_nodes', 'behind the upper part of the pharynx and in front of the arch of the atlas, being separated, however, from the latter by the longus capitis')],
    ],
    recibe: [
      ['Sus aferentes drenan las fosas nasales, la nasofaringe y las trompas auditivas.', W('Retropharyngeal_lymph_nodes', 'Their afferents drain the nasal cavities, the nasal part of the pharynx, and the auditory tubes.')],
    ],
    drena: [
      ['Sus eferentes van a los nodos cervicales profundos superiores.', W('Retropharyngeal_lymph_nodes', 'Their efferents pass to the superior deep cervical lymph nodes.')],
    ],
    modelo: [REPRESENTATIVO],
    notas: [
      ['Con frecuencia desaparecen hacia los 4 o 5 años, por eso el absceso retrofaríngeo es raro en los niños mayores.', W('Retropharyngeal_lymph_nodes', 'They frequently disappear by age 4-5. (This is why retropharyngeal abscess is rare in older children.)')],
      ['El nodo de Rouvière es el más alto del grupo lateral de los retrofaríngeos, en la base del cráneo.', W("Rouvière_node", 'this node is the most superior of the lateral group of the retropharyngeal lymph nodes, and is found at the base of the skull')],
    ],
    vias: { drena: ['Lateral_superior_jugular_node'] },
  },
};
