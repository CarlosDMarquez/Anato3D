// Fichas de los nodos de la cabeza (occipitales, mastoideos, parotídeos, faciales, submandibulares…): grupo «Lymph_nodes_of_head».
// Formato y reglas: ./formato.js (cada frase con su fuente; MODELO solo en «En este modelo»). Clave = nombre de la pieza
// sin _L/_R. Comprobar: node scripts/linfatico-citas.mjs comprobar && node scripts/check-cards.mjs
// BORRADOR redactado con IA, sin revisión médica. Tabla de fuentes: docs/fuentes/linfatico-cabeza.md.
// Submandibular_nodes y Submental_nodes siguen aquí aunque el modelo publicado (12 nov 2026) los pone, como la TA2, en el
// grupo del cuello: una clave solo puede estar en un archivo (si se pasan a cuello.js, hay que quitarlas de aquí).
import { W, ES, TA, MODELO } from './formato.js';

// Frase común del campo «En este modelo» de un grupo de nodos.
const REPRESENTATIVO = ['En este modelo el grupo se representa con varios nodos de forma y tamaño esquemáticos; su número no es el real.', MODELO];

// Nodos faciales (bucinador, nasolabial y mandibular): misma página, mismas aferencias y la misma regla de drenaje en cadena.
const FACIAL_GRUPO = ['Pertenece a los nodos faciales: hasta 12 nodos superficiales, pequeños y de número variable, a lo largo de la vena facial.', W('Facial_lymph_nodes', 'The facial lymph nodes are a group of up to 12 superficial lymph nodes of the head situated along the length of the facial vein'), W('Facial_lymph_nodes', 'Facial lymph nodes are variable in number, usually small.')];
const FACIAL_RECIBE = [
  ['Cada subgrupo facial drena la piel y la mucosa vecinas.', W('Facial_lymph_nodes', 'Each subgroup is responsible for drainage of adjacent skin and mucosae.')],
  ['Los aferentes de los nodos faciales vienen de los párpados, la conjuntiva y la piel y la mucosa de la nariz y la mejilla.', W('Facial_lymph_nodes', 'Their afferent vessels drain the eyelids, the conjunctiva, and the skin and mucous membrane of the nose and cheek.')],
];
const FACIAL_CADENA = ['De arriba abajo, cada nodo facial drena en el que está justo por debajo, y el último drena en los nodos submandibulares.', W('Facial_lymph_nodes', 'Superoinferiorly, each node drains into the one immediately inferior to it, with the last draining into submandibular lymph nodes')];
const FACIAL_ORDEN = ['En este modelo los tres nodos faciales quedan, de arriba abajo, en este orden: nasolabial, bucinador y mandibular; el nodo malar de la Terminologia Anatomica no está representado.', TA(5209), MODELO];
const FACIAL_NOTA = ['Cuando aumentan de tamaño se palpan como un «guisante firme»; la causa puede ser una infección dental.', W('Facial_lymph_nodes', 'these nodes are described as feeling like a "firm pea"'), W('Facial_lymph_nodes', 'Lymphadenopathy of these nodes may be result from dental infections.')];

export default {
  Occipital_nodes: {
    tipo: 'nodo', ta2: 5199,
    descripcion: [
      ['Grupo de 1 a 3 nodos (ganglios) linfáticos superficiales de la región occipital, que drenan parte del cuero cabelludo de la nuca.', W('Occipital_lymph_nodes', 'a group of 1-3 superficial lymph nodes of the head situated in the occipital region that drain part of the scalp of the occiput')],
    ],
    localizacion: [
      ['Están en el borde del trapecio, apoyados sobre la inserción del semiespinoso de la cabeza.', W('Occipital_lymph_nodes', 'They are situated at the margin of the trapezius and resting on the insertion of the semispinalis capitis.')],
    ],
    reparo: [
      ['El borde del músculo trapecio en la nuca y, debajo de los nodos, la inserción del semiespinoso de la cabeza.', W('Occipital_lymph_nodes', 'situated at the margin of the trapezius and resting on the insertion of the semispinalis capitis')],
    ],
    recibe: [
      ['Sus aferentes drenan la región occipital del cuero cabelludo.', W('Occipital_lymph_nodes', 'Afferents of occipital lymph nodes contribute to the drainage of the occipital region of the scalp')],
    ],
    drena: [
      ['Sus eferentes van a los nodos cervicales profundos superiores.', W('Occipital_lymph_nodes', 'Their efferents in turn drain into the superior deep cervical glands.')],
    ],
    modelo: [REPRESENTATIVO],
    notas: [
      ['Parte de la linfa de la región occipital no pasa por ellos: un vaso linfático baja por el borde posterior del esternocleidomastoideo directamente a los nodos cervicales profundos inferiores.', W('Occipital_lymph_nodes', 'this region is also drained by a lymphatic vessel which passes along the posterior border of the sternocleidomastoid muscle to drain directly into the inferior deep cervical lymph nodes')],
      ['En la exploración se palpan con la cabeza inclinada hacia delante, a los dos lados de la base de la cabeza.', W('Occipital_lymph_nodes', 'these nodes are examined by having the patient bend their head forward and bilaterally palpating the base of the side of the head')],
    ],
    vias: { drena: ['Lateral_superior_jugular_node', 'Jugulodigastric_node'] },
  },

  Mastoid_nodes: {
    tipo: 'nodo', ta2: 5200,
    descripcion: [
      ['Pequeño grupo de nodos (ganglios) linfáticos, normalmente dos, también llamados retroauriculares o auriculares posteriores.', W('Mastoid_lymph_nodes', 'are a small group of lymph nodes, usually two in number'), W('Mastoid_lymph_nodes', 'retroauricular lymph nodes or posterior auricular glands')],
    ],
    localizacion: [
      ['Están sobre la inserción mastoidea del esternocleidomastoideo, por debajo del músculo auricular posterior.', W('Mastoid_lymph_nodes', 'on the mastoid insertion of the sternocleidomastoideus muscle, beneath the posterior auricular muscle')],
    ],
    reparo: [
      ['La inserción del esternocleidomastoideo en la mastoides, detrás de la oreja, cubierta por el músculo auricular posterior.', W('Mastoid_lymph_nodes', 'on the mastoid insertion of the sternocleidomastoideus muscle, beneath the posterior auricular muscle'), W('Mastoid_lymph_nodes', 'retroauricular lymph nodes')],
    ],
    recibe: [
      ['Recibe la linfa de la parte posterior de la región temporoparietal, de la parte alta de la cara craneal de la oreja y de la parte posterior del conducto auditivo.', W('Mastoid_lymph_nodes', 'receives lymph from the posterior part of the temporoparietal region, the upper part of the cranial surface of the visible ear and the back of the ear canal')],
    ],
    drena: [
      ['Su linfa pasa a los nodos cervicales profundos superiores.', W('Mastoid_lymph_nodes', 'The lymph then passes to the superior deep cervical glands.')],
    ],
    modelo: [REPRESENTATIVO],
    vias: { drena: ['Lateral_superior_jugular_node', 'Jugulodigastric_node'] },
  },

  Superficial_parotid_nodes: {
    tipo: 'nodo', ta2: 5201,
    descripcion: [
      ['Grupo de nodos (ganglios) linfáticos de la cabeza situados sobre la glándula parótida, por fuera o por dentro de la fascia parotídea; también se llaman paraparotídeos.', W('Superficial_parotid_lymph_nodes', 'are a group of lymph nodes of the head situated superficial to either parotid gland (either superficial to or deep to the parotid fascia)'), W('Superficial_parotid_lymph_nodes', 'paraparotid lymph nodes')],
    ],
    localizacion: [
      ['Están en la cara externa de la parótida, justo delante del trago de la oreja.', W('Superficial_parotid_lymph_nodes', 'situated superficial to either parotid gland'), W('Superficial_parotid_lymph_nodes', 'They are situated just anterior to the tragus of the ear.')],
    ],
    reparo: [
      ['El trago de la oreja, justo por detrás de ellos, y la vena temporal superficial, que baja delante del trago y entra en la parótida.', W('Superficial_parotid_lymph_nodes', 'just anterior to the tragus of the ear'), W('Scalp', 'The superficial temporal vein descends in front of the tragus, enters the parotid gland')],
    ],
    recibe: [
      ['Reciben linfa de las partes laterales de la frente, de las regiones temporal y cigomática, de la parte alta de la cara lateral de la oreja, de la pared anterior del conducto auditivo externo y de los párpados.', W('Superficial_parotid_lymph_nodes', 'receive lymph from more lateral parts of the forehead and from the temporal and zygomatic region, the superior portion of the lateral auricular aspect and anterior wall of the external auditory meatus, and eyelids')],
      ['A los nodos parotídeos, en conjunto, llega la linfa de la mitad anterior del cuero cabelludo.', W('Scalp', 'Lymphatic channels from the anterior half drain to the parotid nodes.')],
    ],
    drena: [
      ['Vacían en los nodos cervicales profundos superiores.', W('Superficial_parotid_lymph_nodes', 'Superficial parotid lymph nodes in turn empty into the superior deep cervical lymph nodes.')],
    ],
    modelo: [REPRESENTATIVO],
    notas: [
      ['A veces se agrupan con los nodos auriculares anteriores.', W('Superficial_parotid_lymph_nodes', 'They may sometimes be grouped together with the anterior auricular lymph glands.')],
    ],
    vias: { drena: ['Lateral_superior_jugular_node', 'Jugulodigastric_node'] },
  },

  Pre_auricular_nodes: {
    tipo: 'nodo', ta2: 5203,
    descripcion: [
      ['Nodos (ganglios) linfáticos de la parótida situados delante de la oreja; la Terminologia Anatomica los clasifica entre los nodos parotídeos profundos.', TA(5202), TA(5203)],
      ['Junto con los demás nodos parotídeos, son el destino principal de la linfa de la glándula parótida.', W('Parotid_gland', 'The gland is mainly drained into the preauricular or parotid lymph nodes')],
    ],
    recibe: [
      ['Reciben sobre todo la linfa de la glándula parótida.', W('Parotid_gland', 'The gland is mainly drained into the preauricular or parotid lymph nodes')],
      ['A los nodos parotídeos, en conjunto, llega la linfa de la mitad anterior del cuero cabelludo.', W('Scalp', 'Lymphatic channels from the anterior half drain to the parotid nodes.')],
    ],
    drena: [
      ['Como los demás nodos parotídeos, su linfa acaba en la cadena cervical profunda.', W('Parotid_gland', 'which ultimately drain to the deep cervical chain')],
      ['Los eferentes de los nodos parotídeos profundos van a los cervicales profundos superiores.', W('Deep_parotid_lymph_nodes', 'Their efferents pass to the superior deep cervical glands.')],
    ],
    modelo: [REPRESENTATIVO],
    pendientes: {
      localizacion: 'Ninguna fuente libre consultada describe su posición más allá del nombre («delante de la oreja»); no hay artículo propio en Wikipedia en inglés ni en español.',
      reparo: 'Ninguna fuente libre consultada da un reparo propio de este grupo.',
    },
    vias: { drena: ['Lateral_superior_jugular_node', 'Jugulodigastric_node'] },
  },

  Infra_auricular_nodes: {
    tipo: 'nodo', ta2: 5204,
    descripcion: [
      ['Nodos (ganglios) linfáticos de la parótida situados, según su nombre, por debajo de la oreja; la Terminologia Anatomica los clasifica entre los nodos parotídeos profundos.', TA(5202), TA(5204)],
    ],
    recibe: [
      ['A los nodos parotídeos, en conjunto, llegan la linfa de la glándula parótida y la de la mitad anterior del cuero cabelludo.', W('Parotid_gland', 'The gland is mainly drained into the preauricular or parotid lymph nodes'), W('Scalp', 'Lymphatic channels from the anterior half drain to the parotid nodes.')],
    ],
    drena: [
      ['Los eferentes de los nodos parotídeos profundos van a los cervicales profundos superiores.', W('Deep_parotid_lymph_nodes', 'Their efferents pass to the superior deep cervical glands.')],
      ['En el trayecto de los vasos que drenan los nodos parotídeos e infraauriculares se intercalan los nodos cervicales laterales superficiales, que siguen la vena yugular externa.', W('Superficial_lateral_cervical_lymph_nodes', 'The nodes are intercalated along the course of the vessels draining the parotid nodes and the infraauricular nodes.'), W('Superficial_lateral_cervical_lymph_nodes', 'are found along the course of the external jugular vein')],
    ],
    modelo: [REPRESENTATIVO],
    pendientes: {
      localizacion: 'Ninguna fuente libre consultada describe su posición más allá del nombre («debajo de la oreja»); no hay artículo propio en Wikipedia.',
      reparo: 'Ninguna fuente libre consultada da un reparo propio de este grupo.',
    },
    vias: { drena: ['Lateral_superior_jugular_node', 'Jugulodigastric_node', 'Superficial_lateral_cervical_nodes'] },
  },

  Intraglandular_parotid_nodes: {
    tipo: 'nodo', ta2: 5205,
    descripcion: [
      ['Nodos (ganglios) linfáticos dentro de la glándula parótida, como dice su nombre; la Terminologia Anatomica los clasifica entre los nodos parotídeos profundos.', TA(5202), TA(5205)],
    ],
    localizacion: [
      ['Están en el interior de la glándula parótida, entre los órganos intraparotídeos.', ES('Glándula_parótida', 'En el interior de la glándula se encuentran ganglios linfáticos parotídeos.'), ES('Glándula_parótida', 'se llaman órganos intraparotídeos')],
      ['La glándula tiene una cápsula propia de tejido conjuntivo denso y, por fuera, una falsa cápsula formada por la lámina de revestimiento de la fascia cervical profunda.', W('Parotid_gland', 'The gland has a capsule of its own of dense connective tissue but is also provided with a false capsule by the investing layer of the deep cervical fascia.')],
    ],
    reparo: [
      ['La glándula parótida y lo que la atraviesa: el nervio facial, la vena retromandibular y la arteria carótida externa.', ES('Glándula_parótida', 'La atraviesan 3 estructuras importantes: el nervio facial, la vena retromandibular y la arteria carótida externa')],
      ['Dentro de la glándula el nervio facial se divide en sus ramas, y la arteria carótida externa da sus ramas terminales.', W('Parotid_gland', 'The facial nerve (CN VII) splits into its branches within the parotid gland'), W('Parotid_gland', 'The external carotid artery and its terminal branches within the gland')],
    ],
    recibe: [
      ['A los nodos parotídeos, en conjunto, llegan la linfa de la glándula parótida y la de la mitad anterior del cuero cabelludo.', W('Parotid_gland', 'The gland is mainly drained into the preauricular or parotid lymph nodes'), W('Scalp', 'Lymphatic channels from the anterior half drain to the parotid nodes.')],
    ],
    drena: [
      ['Los eferentes de los nodos parotídeos profundos van a los cervicales profundos superiores.', W('Deep_parotid_lymph_nodes', 'Their efferents pass to the superior deep cervical glands.')],
    ],
    modelo: [REPRESENTATIVO],
    vias: { drena: ['Lateral_superior_jugular_node', 'Jugulodigastric_node'] },
  },

  Nasolabial_node: {
    tipo: 'nodo', ta2: 5208,
    descripcion: [
      ['Nodo (ganglio) linfático facial situado a lo largo del surco nasolabial, cerca de la nariz y del labio superior.', W('Facial_lymph_nodes', 'Nasolabial lymph nodes - situated along the nasolabial sulcus.'), W('Nasolabial_lymph_nodes', 'is a facial node found near the nose and upper lip')],
      FACIAL_GRUPO,
    ],
    localizacion: [
      ['Está en la cara, a lo largo del surco nasolabial.', W('Facial_lymph_nodes', 'situated along the nasolabial sulcus')],
    ],
    reparo: [
      ['El surco nasolabial y, a lo largo de él, la vena facial, que siguen todos los nodos faciales.', W('Facial_lymph_nodes', 'situated along the nasolabial sulcus'), W('Facial_lymph_nodes', 'situated along the length of the facial vein')],
    ],
    recibe: FACIAL_RECIBE,
    drena: [FACIAL_CADENA],
    modelo: [REPRESENTATIVO, FACIAL_ORDEN],
    notas: [FACIAL_NOTA],
    vias: { drena: ['Bucinator_node'] },
  },

  Bucinator_node: {
    tipo: 'nodo', ta2: 5207,
    descripcion: [
      ['Uno o más nodos (ganglios) linfáticos colocados sobre el músculo buccinador, frente al ángulo de la boca.', W('Buccal_lymph_nodes', 'are one or more lymph nodes placed on the buccinator opposite the angle of the mouth')],
      FACIAL_GRUPO,
    ],
    localizacion: [
      ['Está justo por fuera del músculo buccinador, a la altura del ángulo de la boca.', W('Facial_lymph_nodes', 'situated immediately superficial to the bucinator muscle, opposite the angle of the mouth')],
    ],
    reparo: [
      ['El músculo buccinador, por dentro, frente a la comisura de la boca; la vena facial pasa cerca, porque los nodos faciales la siguen.', W('Facial_lymph_nodes', 'situated immediately superficial to the bucinator muscle, opposite the angle of the mouth'), W('Facial_lymph_nodes', 'situated along the length of the facial vein')],
    ],
    recibe: [...FACIAL_RECIBE, ['También le llega la linfa del nodo facial que está justo por encima.', W('Facial_lymph_nodes', 'Superoinferiorly, each node drains into the one immediately inferior to it')]],
    drena: [FACIAL_CADENA],
    modelo: [REPRESENTATIVO, FACIAL_ORDEN],
    notas: [FACIAL_NOTA],
    vias: { recibe: ['Nasolabial_node'], drena: ['Mandibular_node'] },
  },

  Mandibular_node: {
    tipo: 'nodo', ta2: 5210,
    descripcion: [
      ['Nodo (ganglio) linfático facial situado sobre la mandíbula, delante del músculo masetero.', W('Facial_lymph_nodes', 'situated within tissues superior to the surface of the mandible and anterior to the masseter muscle')],
      FACIAL_GRUPO,
    ],
    localizacion: [
      ['Está en los tejidos que cubren la cara externa de la mandíbula, por delante del masetero.', W('Facial_lymph_nodes', 'situated within tissues superior to the surface of the mandible and anterior to the masseter muscle')],
    ],
    reparo: [
      ['El borde anterior del masetero sobre la mandíbula, donde el nodo toca la arteria facial (en textos antiguos, «maxilar externa») y la vena facial (antes, «facial anterior»).', W('Facial_lymph_nodes', 'placed alongside and in contact with external maxillary artery and anterior facial vein'), W('Facial_artery', 'The facial artery, formerly called the external maxillary artery'), W('Facial_vein', 'The facial vein (or anterior facial vein)')],
      ['La arteria facial cruza el cuerpo de la mandíbula en el ángulo anteroinferior del masetero (la escotadura antegonial).', W('Facial_artery', 'It then curves upward over the body of the mandible at the antero-inferior angle of the masseter (the antegonial notch)')],
    ],
    recibe: [...FACIAL_RECIBE, ['También le llega la linfa del nodo facial que está justo por encima.', W('Facial_lymph_nodes', 'Superoinferiorly, each node drains into the one immediately inferior to it')]],
    drena: [
      ['Es el último de la cadena facial: drena en los nodos submandibulares.', W('Facial_lymph_nodes', 'with the last draining into submandibular lymph nodes')],
    ],
    modelo: [REPRESENTATIVO, FACIAL_ORDEN],
    notas: [FACIAL_NOTA],
    vias: { recibe: ['Bucinator_node'], drena: ['Submandibular_nodes'] },
  },

  Submandibular_nodes: {
    tipo: 'nodo', ta2: 5214,
    descripcion: [
      ['Grupo de unos 3 a 6 nodos (ganglios) linfáticos bajo el cuerpo de la mandíbula; en textos antiguos, «glándulas submaxilares».', W('Submandibular_lymph_nodes', 'submaxillary glands in older texts'), W('Submandibular_lymph_nodes', 'are some 3-6 lymph nodes')],
    ],
    localizacion: [
      ['Están en el triángulo submandibular, entre el vientre anterior del digástrico, el estilohioideo y el cuerpo de la mandíbula.', W('Cervical_lymph_nodes', 'Submandibular triangle - posterolateral to the anterior belly of the digastric muscle between the area formed by its margin, the stylohyoid muscle and the body of the mandible')],
      ['Quedan justo por fuera de la glándula submandibular y por detrás y por fuera del vientre anterior del digástrico.', W('Submandibular_lymph_nodes', 'They are situated just superficial to the submandibular salivary gland, and posterolateral to the anterior belly of either digastric muscle.')],
    ],
    reparo: [
      ['La glándula submandibular, que queda más profunda que los nodos.', W('Submandibular_lymph_nodes', 'just superficial to the submandibular salivary gland')],
      ['La arteria facial donde rodea el borde de la mandíbula: sobre ella está el nodo más constante, el nodo medio de Stahr.', W('Submandibular_lymph_nodes', 'the middle gland of Stahr, which lies on the facial artery as it turns over the mandible, is the most constant of the series')],
    ],
    recibe: [
      ['Drenan el labio superior, el cuerpo de la lengua, las mejillas, la parte anterior del paladar duro y la mayoría de los dientes con su periodonto y su encía; no los incisivos inferiores ni los terceros molares.', W('Submandibular_lymph_nodes', 'They drain the upper lip, body of tongue, cheeks, anterior portion of the hard palate, and most teeth with their associated periodontium and gingiva (except for the mandibular incisor teeth and third molar teeth).')],
      ['También pueden recibir la linfa de los nodos faciales y de los submentonianos.', W('Submandibular_lymph_nodes', 'The facial and submental lymph nodes may also drain into the submandibular glands.')],
    ],
    drena: [
      ['Drenan en los nodos cervicales profundos superiores.', W('Submandibular_lymph_nodes', 'They drain to the superior deep cervical lymph nodes.')],
    ],
    modelo: [
      REPRESENTATIVO,
      ['En este modelo están en el grupo de los nodos del cuello, como en la Terminologia Anatomica 2.', TA(5212), TA(5214), MODELO],
    ],
    notas: [
      ['En la clasificación clínica por niveles, los submandibulares forman el nivel IB y los submentonianos el IA.', W('Cervical_lymph_nodes', 'Level I: Submental and submandibular nodes'), W('Cervical_lymph_nodes', 'Level Ib: Submandibular triangle')],
      ['Su aumento de tamaño se debe sobre todo a infecciones de la cabeza, el cuello, los oídos, los ojos, los senos paranasales, la faringe y el cuero cabelludo.', W('Submandibular_lymph_nodes', 'The most common causes of enlargement of the submandibular lymph nodes are infections of the head, neck, ears, eyes, nasal sinuses, pharynx, and scalp.')],
    ],
    vias: { recibe: ['Mandibular_node', 'Submental_nodes'], drena: ['Lateral_superior_jugular_node', 'Jugulodigastric_node'] },
  },

  Submental_nodes: {
    tipo: 'nodo', ta2: 5213,
    descripcion: [
      ['Grupo de nodos (ganglios) linfáticos del triángulo submentoniano: son 2 o 3 y también se llaman suprahioideos.', W('Submental_lymph_nodes', 'are 2-3 lymph nodes situated in the submental triangle'), W('Submental_lymph_nodes', 'or suprahyoid lymph nodes')],
    ],
    localizacion: [
      ['Están en el triángulo submentoniano, entre los vientres anteriores de los dos digástricos y el hueso hioides, cerca de la línea media.', W('Submental_lymph_nodes', 'situated in the submental triangle, between the anterior bellies of the digastric muscle and the hyoid bone'), W('Submental_lymph_nodes', 'They are situated close to the midline.')],
      ['Ocupan el espacio fascial submentoniano, justo por fuera del músculo milohioideo.', W('Submental_lymph_nodes', 'situated in the submental fascial space'), W('Submental_lymph_nodes', 'They are immediately superficial to the mylohyoid muscle.')],
    ],
    reparo: [
      ['Los vientres anteriores de los digástricos, a cada lado, y el cuerpo del hioides, como base del triángulo; el milohioideo queda por encima de ellos, más profundo.', W('Cervical_lymph_nodes', 'between a triangle formed by the anterior belly of the digastric muscles on each side, and with the hyoid as its base'), W('Submental_lymph_nodes', 'They are immediately superficial to the mylohyoid muscle.')],
    ],
    recibe: [
      ['Drenan el labio inferior, el suelo de la boca, la punta de la lengua, el mentón y los incisivos inferiores con su periodonto y su encía.', W('Submental_lymph_nodes', 'They drain the lower lip, floor of the mouth, apex of the tongue, chin, and inferior/mandibular incisor teeth and their associated periodontium and gingiva.')],
    ],
    drena: [
      ['Drenan en los nodos submandibulares, que a su vez van a los cervicales profundos, o directamente en los cervicales profundos.', W('Submental_lymph_nodes', 'They drain either to submandibular lymph nodes (which then drain to deep cervical lymph nodes), or to the deep cervical lymph nodes directly.')],
    ],
    modelo: [
      REPRESENTATIVO,
      ['En este modelo el grupo es una pieza por lado, aunque los nodos están cerca de la línea media.', MODELO],
      ['En este modelo están en el grupo de los nodos del cuello, como en la Terminologia Anatomica 2.', TA(5212), TA(5213), MODELO],
      ['En este modelo los nodos se recolocaron por debajo del milohioideo y, en parte, entre los vientres anteriores de los digástricos; es una colocación esquemática.', MODELO],
    ],
    notas: [
      ['En la clasificación clínica por niveles forman el nivel IA.', W('Cervical_lymph_nodes', 'Level Ia: Submental')],
      ['Su aumento de tamaño se debe sobre todo a infecciones, entre ellas las dentales.', W('Submental_lymph_nodes', 'The most common cause of enlargement of the submental lymph nodes are infections'), W('Submental_lymph_nodes', 'and dental infections')],
    ],
    vias: { drena: ['Submandibular_nodes', 'Lateral_superior_jugular_node', 'Jugulodigastric_node'] },
  },
};
