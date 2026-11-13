// Clasificación educativa de las piezas de los modelos (biblioteca de estudio): a qué sistema, región y subregión de
// src/biblioteca/taxonomia.js pertenece cada una, y qué tipo de estructura es. Solo la usan los scripts (inventario y
// mapa de cobertura); la app no la necesita.
//
// De dónde sale cada dato:
//  - el sistema y el tipo, del sistema del modelo (extras.system), su subsistema y su tejido;
//  - la región, de la ruta de grupos de Z-Anatomy (extras.region: «Muscles_of_upper_limb › Anterior_compartment_of_arm»)
//    y, donde no basta, del nombre de la pieza;
//  - en los vasos, de REGIONES_VASOS (región de cada vaso, generada por tools/vessel_regions.py);
//  - los huesos del modelo base no traen grupos: van por su nombre.
// Lo que ninguna regla clasifica queda «sin región» y el inventario lo cuenta aparte (no se inventa un sitio).
import { REGIONES_VASOS } from '../../src/data/regiones-vasos.js';

const MS = 'miembro-superior';
const MI = 'miembro-inferior';

// Reglas por nombre: [expresión, lugares]. La primera que encaja gana. `L(r, s…)`: región r con esas subregiones.
const L = (r, ...subs) => (subs.length ? subs.map((s) => [r, s]) : [[r, null]]);

const HUESOS = [
  [/^(Frontal|Parietal|Occipital|Temporal|Sphenoid|Ethmoid)_Bone$/, L('cabeza', 'craneo')],
  [/^(Maxilla|Mandible|Zygomatic_Bone|Nasal_Bone|Lacrimal_Bone|Palatine_Bone|Vomer|Inferior_Nasal_Concha)$/, L('cabeza', 'cara')],
  [/^(Malleus|Incus|Stapes)$/, L('cabeza', 'oido')],
  [/^Tooth_/, L('cabeza', 'cavidad-oral')],
  [/^Hyoid_Bone$/, L('cuello', 'musculos-cuello')],
  [/^Vertebra_/, L('espalda', 'columna')],
  [/^(Sacrum|Coccyx)$/, [...L('espalda', 'columna'), ...L('pelvis', 'pelvis-osea')]],
  [/^(Rib_\d+|Costal_Cartilage_\d+|Sternum_\w+)$/, L('torax', 'pared-toracica')],
  [/^(Clavicle|Scapula)$/, L(MS, 'cintura-escapular')],
  [/^Humerus$/, L(MS, 'brazo')],
  [/^(Radius|Ulna)$/, L(MS, 'antebrazo')],
  [/^(Scaphoid|Lunate|Triquetrum|Pisiform|Trapezium|Trapezoid|Capitate|Hamate)$/, L(MS, 'muneca')],
  [/^(Metacarpal_\d|\w+_Phalanx_Hand_\d)$/, L(MS, 'mano')],
  [/^Hip_Bone$/, [...L(MI, 'cintura-pelvica'), ...L('pelvis', 'pelvis-osea')]],
  [/^Femur$/, L(MI, 'muslo')],
  [/^Patella$/, L(MI, 'rodilla')],
  [/^(Tibia|Fibula)$/, L(MI, 'pierna')],
  [/^Talus$/, L(MI, 'tobillo', 'pie')],
  [/^(Calcaneus|Navicular|Cuboid|\w+_Cuneiform|Metatarsal_\d|\w+_Phalanx_Foot_\d|Sesamoid_Bones_Foot)$/, L(MI, 'pie')],
];

// Músculos: por grupo (el último que aparece en la ruta) y, sin grupo, por nombre.
const GRUPOS_MUSCULO = [
  [/Facial_muscles|Superficial_muscles_of_head/, L('cabeza', 'cara')],
  [/Laryngeal_muscles|Pharyngeal_muscles/, L('cuello', 'visceras-cuello')],
  [/Suboccipital_muscles/, [...L('espalda', 'musculos-espalda'), ...L('cuello', 'musculos-cuello')]],
  [/Dorsal_part_of_muscular_system/, L('espalda', 'musculos-espalda')],
  [/Muscles_of_neck/, L('cuello', 'musculos-cuello')],
  [/Muscles_of_abdomen/, L('abdomen', 'pared-abdominal')],
  [/Pelvic_diaphragm/, L('pelvis', 'suelo-pelvico')],
  [/Perineal_muscles/, L('pelvis', 'perine')],
  [/Pectoralis_major_muscle/, [...L(MS, 'cintura-escapular'), ...L('torax', 'pared-toracica')]],
  [/Anterior_compartment_of_arm|Posterior_compartment_of_arm/, L(MS, 'brazo')],
  [/compartment_of_forearm/, L(MS, 'antebrazo')],
  [/Muscles_of_hand/, L(MS, 'mano')],
  [/Deltoid_muscle|Rotator_cuff_muscles|Scapulohumeral_muscles/, L(MS, 'hombro')],
  [/compartment_of_thigh/, L(MI, 'muslo')],
  [/compartment_of_leg/, L(MI, 'pierna')],
  [/Deep_gluteal_muscles/, L(MI, 'glutea', 'cadera')],
  [/Superficial_gluteal_muscles/, L(MI, 'glutea')],
  [/Muscles_of_foot/, L(MI, 'pie')],
];
const MUSCULOS_NOMBRE = [
  [/^(External|Internal)_abdominal_oblique_muscle$/, L('abdomen', 'pared-abdominal')],
  [/^(Superior|Inferior|Medial|Lateral)_rectus_muscle$|^(Superior|Inferior)_oblique_muscle$|^Levator_palpebrae|^Common_tendinous_ring|^Trochlea_of_superior_oblique/, L('cabeza', 'orbita-ojo')],
  [/masseter|pterygoid|^Temporalis_muscle$/, L('cabeza', 'cara')],
  [/glossus_muscle$/, L('cabeza', 'cavidad-oral')],
  [/^(Frontalis|Occipitalis|Temporoparietalis)_muscle$|^Epicranial_aponeurosis$/, L('cabeza', 'craneo')],
  [/^Diaphragm$/, L('torax', 'diafragma')],
  [/intercostal|^Transversus_thoracis|^Levatores_(breves|longi)_costarum/, L('torax', 'pared-toracica')],
  [/^(Pectoralis_minor|Serratus_anterior|Subclavius)_muscle$/, [...L(MS, 'cintura-escapular'), ...L('torax', 'pared-toracica')]],
  [/^Teres_major_muscle$/, L(MS, 'hombro')],
  [/^Splenius_|^Interspinales_/, L('espalda', 'musculos-espalda')],
  [/^(Iliacus_muscle|Psoas_major)$/, [...L(MI, 'cadera'), ...L('abdomen', 'pared-abdominal')]],
  [/^Iliotibial_tract$/, L(MI, 'muslo')],
];

// Conjuntivo: articulaciones por grupo; fascias, bolsas, vainas y ligamentos de músculos por nombre.
const GRUPOS_CONJUNTIVO = [
  [/Temporomandibular_joint/, L('cabeza', 'cara')],
  [/Joints_of_skull/, L('cabeza', 'craneo')],
  [/Joints_of_vertebral_column/, L('espalda', 'columna')],
  [/Thoracic_joints/, L('torax', 'pared-toracica')],
  [/Laryngeal_joints/, L('cuello', 'visceras-cuello')],
  [/Acromioclavicular_joint/, L(MS, 'cintura-escapular', 'hombro')],
  [/Joints_of_pectoral_girdle/, L(MS, 'cintura-escapular')],
  [/Glenohumeral_joint/, L(MS, 'hombro')],
  [/Elbow_joint/, L(MS, 'codo')],
  [/Radio_ulnar_syndesmoses/, L(MS, 'antebrazo')],
  [/Distal_radio_ulnar_joint/, L(MS, 'antebrazo', 'muneca')],
  [/Radiocarpal_joint|Intercarpal_joints|Pisiform_joint/, L(MS, 'muneca')],
  [/Joints_of_hand/, L(MS, 'mano')],
  [/Joints_of_pelvic_girdle/, [...L('pelvis', 'pelvis-osea'), ...L(MI, 'cintura-pelvica')]],
  [/Hip_joint/, L(MI, 'cadera')],
  [/Knee_joint/, L(MI, 'rodilla')],
  [/[Tt]ibiofibular|Interosseous_membrane_of_leg|fibular_head/, L(MI, 'pierna')],
  [/Ankle_joint/, L(MI, 'tobillo')],
  [/Subtalar_joint|Talocalcaneonavicular_joint/, L(MI, 'tobillo', 'pie')],
  [/Joints_of_foot/, L(MI, 'pie')],
];
const CONJUNTIVO_NOMBRE = [
  [/Interosseous_membrane_of_leg|fibular_head|tibiofibular/, L(MI, 'pierna')],
  [/temporal_fascia|Masseteric/, L('cabeza', 'cara')],
  [/cervical_fascia|digastric/, L('cuello', 'musculos-cuello')],
  [/thoracolumbar/, L('espalda', 'musculos-espalda')],
  [/Diaphragmatic_fascia/, L('torax', 'diafragma')],
  [/Pectoral_fascia|Clavipectoral/, L(MS, 'cintura-escapular')],
  [/Transversalis|abdominal_fascia|Linea_alba|Inguinal_ligament|Iliopectineal|Iliopsoas_fascia/, L('abdomen', 'pared-abdominal')],
  [/Deltoid_fascia|Subacromial|Subdeltoid|acromial_bursa|Coracobrachial_bursa|Intertubercular|infraspinatus|teres_major|trapezius/, L(MS, 'hombro')],
  [/Brachial_fascia|intermuscular_septum_of_arm/, L(MS, 'brazo')],
  [/Bicipitoradial|triceps_brachii/, L(MS, 'codo')],
  [/Antebrachial_fascia|Interosseous_membrane_of_forearm/, L(MS, 'antebrazo')],
  [/retinaculum_of_wrist|carpi|Tendon_sheath_abd_pollicis/, L(MS, 'muneca')],
  [/hand|Palmar_aponeurosis|metacarpal|digit|pollicis|Common_flexor_tendon_sheath|extensor_digitorum_and|digiti_minimi_manus/, L(MS, 'mano')],
  [/piriformis|gluteus|gluteal|Sciatic_bursa|obturator_internus|trochanteric/i, L(MI, 'glutea')],
  [/iliacus/, L(MI, 'cadera')],
  [/Fascia_lata|femoral_intermuscular|sartorius|Anserine/, L(MI, 'muslo')],
  [/patella|Popliteal|biceps_femoris|Semimembranosus|gastrocnemius|tuberosity_of_tibia/i, L(MI, 'rodilla')],
  [/Crural_fascia|septum_of_leg|tibialis_anterior|extensor_digitorum_longus|extensor_hallucis_longus/, L(MI, 'pierna')],
  [/malleolus|retinaculum_of_ankle|fibular_retinaculum|calcaneal|fibularis|tibialis_posterior|flexor_digitorum_longus|flexor_hallucis_longus/i, L(MI, 'tobillo')],
  [/Plantar|metatarsal/, L(MI, 'pie')],
];

// Vasos: grupo de Z-Anatomy y, para afinar, la región de REGIONES_VASOS.
const REGION_VASO = {
  Abdomen: L('abdomen', 'vasos-nervios-abdomen'),
  'Abdomen y pelvis': [...L('abdomen', 'vasos-nervios-abdomen'), ...L('pelvis', 'vasos-nervios-pelvis')],
  'Abdomen y genitales externos': [...L('abdomen', 'vasos-nervios-abdomen'), ...L('pelvis', 'perine')],
  'Tórax': L('torax', 'mediastino'),
  'Tórax y abdomen': [...L('torax', 'mediastino'), ...L('abdomen', 'vasos-nervios-abdomen')],
  'Tórax y cuello': [...L('torax', 'mediastino'), ...L('cuello', 'vasos-nervios-cuello')],
  'Cuello y tórax': [...L('cuello', 'vasos-nervios-cuello'), ...L('torax', 'mediastino')],
  'Corazón': L('torax', 'corazon'),
  Cabeza: L('cabeza', 'cara'),
  'Cabeza y cuello': [...L('cabeza', 'cara'), ...L('cuello', 'vasos-nervios-cuello')],
  'Encéfalo': L('cabeza', 'encefalo'),
  'Encéfalo y cavidad craneal': L('cabeza', 'encefalo'),
  'Encéfalo y cuello': [...L('cabeza', 'encefalo'), ...L('cuello', 'vasos-nervios-cuello')],
  'Cavidad craneal': L('cabeza', 'encefalo'),
  'Cavidad craneal y cabeza': L('cabeza', 'encefalo', 'cara'),
  'Cavidad craneal, cabeza y cuello': [...L('cabeza', 'encefalo', 'cara'), ...L('cuello', 'vasos-nervios-cuello')],
  Cuello: L('cuello', 'vasos-nervios-cuello'),
  'Cuello y hombro': [...L('cuello', 'vasos-nervios-cuello'), ...L(MS, 'hombro')],
  Pelvis: L('pelvis', 'vasos-nervios-pelvis'),
  'Pelvis y región glútea': [...L('pelvis', 'vasos-nervios-pelvis'), ...L(MI, 'glutea')],
  'Pelvis, región glútea y periné': [...L('pelvis', 'vasos-nervios-pelvis', 'perine'), ...L(MI, 'glutea')],
  'Genitales externos': L('pelvis', 'perine'),
  Axila: L(MS, 'axila'),
  'Axila y hombro': L(MS, 'axila', 'hombro'),
  Brazo: L(MS, 'brazo'),
  'Brazo y antebrazo': L(MS, 'brazo', 'antebrazo'),
  'Brazo y codo': L(MS, 'brazo', 'codo'),
  'Codo y antebrazo': L(MS, 'codo', 'antebrazo'),
  Antebrazo: L(MS, 'antebrazo'),
  Mano: L(MS, 'mano'),
  Muslo: L(MI, 'muslo'),
  'Muslo y rodilla': L(MI, 'muslo', 'rodilla'),
  'Muslo y genitales externos': [...L(MI, 'muslo'), ...L('pelvis', 'perine')],
  Rodilla: L(MI, 'rodilla'),
  Pierna: L(MI, 'pierna'),
  'Pierna y pie': L(MI, 'pierna', 'pie'),
  'Pie, pierna y muslo': L(MI, 'pie', 'pierna', 'muslo'),
  Pie: L(MI, 'pie'),
};

// Nervioso: por grupo (sistema nervioso central, nervios craneales, plexos) y, sin grupo, por nombre.
const GRUPOS_NERVIO = [
  [/Spinal_dura|Spinal_cord/, L('espalda', 'medula')],
  [/Central_nervous_system/, L('cabeza', 'encefalo')],
  [/Optic_nerve|Oculomotor|Trochlear|Abducens/, L('cabeza', 'orbita-ojo')],
  [/Olfactory_nerve/, L('cabeza', 'cavidad-nasal')],
  [/Vestibulocochlear/, L('cabeza', 'oido')],
  [/Trigeminal|Facial_nerve/, L('cabeza', 'cara')],
  [/Hypoglossal|Glossopharyngeal/, [...L('cabeza', 'cavidad-oral'), ...L('cuello', 'vasos-nervios-cuello')]],
  [/Vagus_nerve|Accessory_nerve/, L('cuello', 'vasos-nervios-cuello')],
  [/Supraclavicular|Infraclavicular|Dorsal_scapular|Long_thoracic|Subclavian_nerve|Suprascapular/, L(MS, 'axila')],
  [/Lateral_pectoral_nerve/, L(MS, 'cintura-escapular')],
  [/Axillary_nerve/, L(MS, 'hombro', 'axila')],
  [/Musculocutaneous_nerve/, L(MS, 'brazo')],
  [/Medial_antebrachial_cutaneous/, L(MS, 'antebrazo')],
  [/Ulnar_nerve|Median_nerve|Radial_nerve/, L(MS, 'brazo', 'antebrazo', 'mano')],
  [/Branches_of_medial_cord/, L(MS, 'axila')],
  [/Intercostal_nerves/, L('torax', 'pared-toracica')],
  [/Ilio_inguinal|Iliohypogastric/, L('abdomen', 'pared-abdominal')],
  [/Obturator_nerve|Saphenous_nerve|Femoral_nerve/, L(MI, 'muslo')],
  [/plantar_nerve/, L(MI, 'pie')],
  [/fibular_nerve|Tibial_nerve/, L(MI, 'pierna')],
  [/Sciatic_nerve/, L(MI, 'glutea', 'muslo')],
  [/Lumbosacral_plexus|Lumbar_plexus/, [...L('pelvis', 'vasos-nervios-pelvis'), ...L('abdomen', 'vasos-nervios-abdomen')]],
  [/Sympathetic_trunk/, [...L('torax', 'mediastino'), ...L('abdomen', 'vasos-nervios-abdomen')]],
  [/Sense_organs > Eye/, L('cabeza', 'orbita-ojo')],
  [/Sense_organs > Ear/, L('cabeza', 'oido')],
];
const NERVIOS_NOMBRE = [
  // Núcleos de nervios craneales del tronco del encéfalo que Z-Anatomy agrupa con la médula espinal (el del accesorio,
  // en la médula cervical, sí se queda allí).
  [/^(Nucleus_ambiguus|Nucleus_of_(hypoglossal_nerve|solitary_tract|trochlear_nerve)|Posterior_nucleus_of_vagus_nerve|Inferior_salivatory_nucleus|Posterior_cochlear_nucleus)$/, L('cabeza', 'encefalo')],
  [/^Nerve_to_quadratus_femoris_muscle$/, L(MI, 'glutea', 'cadera')],
  [/^Auditory_tube$/, L('cabeza', 'oido')],
  [/^(Abducens|Trochlear)_nerve/, L('cabeza', 'orbita-ojo')],
  [/^Pudendal_nerve$/, L('pelvis', 'perine')],
  [/posterior_femoral_cutaneous/, L(MI, 'muslo')],
  [/^Spinal_ganglion$/, L('espalda', 'medula')],
];

// Vísceras, ganglios linfáticos, glándulas y piel: por grupo y por nombre.
const VISCERAS = [
  // Respiratorio
  [/^(Nasal_septal|Major_alar|Lateral_process_of_nasal)|Mucosa_of_nasal_cavity/, L('cabeza', 'cavidad-nasal')],
  [/^Nasopharynx$/, L('cuello', 'visceras-cuello')],
  [/cartilage$|^Epiglottis$/, L('cuello', 'visceras-cuello')],
  [/^Trachea$/, [...L('cuello', 'visceras-cuello'), ...L('torax', 'mediastino')]],
  [/bronch|lung|^Pleura$/i, L('torax', 'pulmones-pleura')],
  // Digestivo
  [/^(Tongue|Gingiva|Parotid|Sublingual|Submandibular|Uvula_of_palate|Soft_palate)/, L('cabeza', 'cavidad-oral')],
  [/^(Oropharynx|Laryngopharynx)$/, L('cuello', 'visceras-cuello')],
  [/^Oesophagus$/, [...L('cuello', 'visceras-cuello'), ...L('torax', 'mediastino'), ...L('abdomen', 'organos-abdominales')]],
  [/omentum|Mesocolon|Meso_appendix/, L('abdomen', 'peritoneo')],
  [/^Sigmoid_colon$/, [...L('abdomen', 'organos-abdominales'), ...L('pelvis', 'organos-pelvicos')]],
  [/Stomach|stomach|Duodenum|Jejunum|colon|taenia|appendix|Liver|liver|Gallbladder|Bile_duct|ancrea/, L('abdomen', 'organos-abdominales')],
  // Linfático
  [/^Spleen$/, L('abdomen', 'organos-abdominales')],
  [/thymus/i, L('torax', 'mediastino')],
  [/^Palatine_tonsil$/, L('cabeza', 'cavidad-oral')],
  // Urogenital
  [/^(Kidney|Renal_pelvis)$/, L('abdomen', 'retroperitoneo')],
  [/^Ureter$/, [...L('abdomen', 'retroperitoneo'), ...L('pelvis', 'organos-pelvicos')]],
  [/^(Urinary_bladder|Urethra|Prostate|Seminal_gland|Ejaculatory_duct|Uterus|Uterine_tube|Fimbriae_of_uterine_tube|Ovary|Ligament_of_ovary|Vagina)$/, L('pelvis', 'organos-pelvicos')],
  [/^(Ductus_deferens|Round_ligament_of_uterus)$/, [...L('pelvis', 'organos-pelvicos'), ...L('abdomen', 'pared-abdominal')]],
  [/^(Testis|Epididymis)$|penis|Glans|clitoris|vestibul/i, L('pelvis', 'perine')],
  [/breast|Mammary|Lactiferous/i, L('torax', 'mama')],
  // Endocrino
  [/thyroid|parathyroid/i, L('cuello', 'visceras-cuello')],
  [/^Suprarenal_gland$/, L('abdomen', 'retroperitoneo')],
  [/hypophysis|^Pineal_gland$/i, L('cabeza', 'encefalo')],
];
const NODOS = [
  [/Lymph_nodes_of_head/, L('cabeza', null)],
  [/Lymph_nodes_of_neck/, L('cuello', 'vasos-nervios-cuello')],
  [/Lymph_nodes_of_upper_limb/, L(MS, 'axila')],
  [/Thoracic_lymph_nodes/, L('torax', 'mediastino')],
  [/Abdominal_lymph_nodes/, L('abdomen', 'vasos-nervios-abdomen')],
  [/Pelvic_lymph_nodes/, L('pelvis', 'vasos-nervios-pelvis')],
  [/Lymph_nodes_of_lower_limb/, L(MI, 'muslo')],
];
const PIEL = {
  Abdomen: L('abdomen', 'pared-abdominal'), Arm: L(MS, 'brazo'), Axilla: L(MS, 'axila'), Back: L('espalda'),
  Breast: L('torax', 'mama'), Buttock: L(MI, 'glutea'), Chest: L('torax', 'pared-toracica'), Ear: L('cabeza', 'oido'),
  Elbow: L(MS, 'codo'), Eyelids: L('cabeza', 'orbita-ojo'), Face: L('cabeza', 'cara'), Foot: L(MI, 'pie'),
  Forearm: L(MS, 'antebrazo'), Genitals: L('pelvis', 'perine'), Hand: L(MS, 'mano'), Knee: L(MI, 'rodilla'),
  Leg: L(MI, 'pierna'), Lips: L('cabeza', 'cavidad-oral'), Lumbar: L('espalda'), Neck: L('cuello'),
  Nose: L('cabeza', 'cavidad-nasal'), Perineum: L('pelvis', 'perine'), Scalp: L('cabeza', 'craneo'),
  Shoulder: L(MS, 'hombro'), Thigh: L(MI, 'muslo'), Vulva_Smooth: L('pelvis', 'perine'),
};

const primera = (reglas, texto) => reglas.find(([re]) => re.test(texto))?.[1] ?? null;

// Tipo de estructura (para el inventario y las preguntas de identificación: los distractores son del mismo tipo).
function tipoDe(x) {
  const s = x.system, t = x.tissue, sub = x.subsystem;
  if (s === 'skeletal') return t === 'tooth' ? 'diente' : t === 'cartilage' ? 'cartilago' : 'hueso';
  if (s === 'connective') return { ligament: 'ligamento', capsule: 'capsula', cartilage: 'cartilago', fascia: 'fascia', bursa: 'bolsa', sheath: 'vaina', fat: 'grasa' }[t] ?? 'conjuntivo';
  if (s === 'muscular') return t === 'tendon' ? 'tendon' : 'musculo';
  if (s === 'arterial') return sub === 'heart' && t !== 'artery' ? 'corazon' : 'arteria';
  if (s === 'venous') return 'vena';
  if (s === 'nervous') return sub === 'cns' ? 'snc' : sub === 'special_senses' ? 'organo' : t === 'ganglion' ? 'ganglio' : 'nervio';
  if (s === 'lymphatic') return sub === 'nodes' ? 'nodo' : sub === 'vessels' || t === 'lymph_vessel' ? 'linfatico' : 'organo';
  if (s === 'endocrine') return 'glandula';
  if (s === 'integumentary') return 'piel';
  if (s === 'special_senses') return 'organo';
  return 'organo';
}

// Sistema educativo (y subsistema, si lo tiene).
function sistemaDe(x, ruta, modelo) {
  const s = x.system;
  if (s === 'skeletal') return x.tissue === 'tooth' ? ['digestivo'] : ['oseo'];
  if (s === 'connective') return ['fascia', 'sheath'].includes(x.tissue) ? ['muscular'] : ['articular'];
  if (s === 'muscular') return ['muscular'];
  if (s === 'arterial' || s === 'venous') {
    if (x.subsystem === 'heart' || /Cardiac_vessels|Heart/.test(ruta)) return ['cardiovascular', 'corazon'];
    return ['cardiovascular', s === 'arterial' ? 'arterias' : 'venas'];
  }
  if (s === 'nervous') {
    if (x.subsystem === 'special_senses' || /Sense_organs/.test(ruta)) return ['sentidos'];
    if (/Automatic_division|Autonomic|Sympathetic/.test(ruta)) return ['nervioso', 'autonomo'];
    return ['nervioso', x.subsystem === 'cns' ? 'central' : 'periferico'];
  }
  if (s === 'special_senses') return ['sentidos'];
  if (s === 'lymphatic') return ['linfatico'];
  if (s === 'respiratory') return ['respiratorio'];
  if (s === 'digestive') return ['digestivo'];
  if (s === 'endocrine') return ['endocrino'];
  if (s === 'integumentary') return ['tegumentario'];
  if (s === 'urogenital') {
    if (x.subsystem === 'urinary') return ['urinario'];
    return [modelo === 'female' ? 'reproductor-femenino' : 'reproductor-masculino'];
  }
  return [null];
}

/**
 * Clasificación de una pieza. `clave`: nombre de la pieza sin el lado (_L/_R). `x`: sus extras. Devuelve
 * { sistema, subsistema, tipo, lugares: [[region, subregion | null]] } (lugares vacío si ninguna regla la sitúa).
 */
export function clasificar(clave, x, modelo) {
  let ruta = [];
  try { ruta = JSON.parse(x.region || '[]'); } catch { /* sin grupos */ }
  const r = ruta.join(' > ');
  const [sistema, subsistema = null] = sistemaDe(x, r, modelo);
  const tipo = tipoDe(x);
  let lugares = null;
  const s = x.system;
  if (s === 'skeletal') lugares = primera(HUESOS, clave);
  else if (s === 'muscular') lugares = primera(MUSCULOS_NOMBRE, clave) ?? primera(GRUPOS_MUSCULO, r);
  else if (s === 'connective') lugares = primera(GRUPOS_CONJUNTIVO, r) ?? primera(CONJUNTIVO_NOMBRE, clave);
  else if (s === 'arterial' || s === 'venous') {
    const nombre = String(x.name_en ?? '').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '');
    if (subsistema === 'corazon') lugares = L('torax', 'corazon');
    else if (/Pulmonary_vessels/.test(r)) lugares = [...L('torax', 'pulmones-pleura'), ...L('torax', 'mediastino')];
    else lugares = REGION_VASO[REGIONES_VASOS[nombre]] ?? (/Upper_limb/.test(r) ? L(MS) : /Lower_limb/.test(r) ? L(MI)
      : /Neck/.test(r) ? L('cuello', 'vasos-nervios-cuello') : /Head/.test(r) ? L('cabeza') : null);
  } else if (s === 'nervous') lugares = primera(NERVIOS_NOMBRE, clave) ?? primera(GRUPOS_NERVIO, r);
  else if (s === 'lymphatic') lugares = primera(NODOS, r) ?? primera(VISCERAS, clave);
  else if (s === 'integumentary') lugares = PIEL[clave.replace(/^Skin_/, '')] ?? null;
  else if (s === 'special_senses') lugares = L('cabeza', 'orbita-ojo');
  else lugares = primera(VISCERAS, clave);
  // La piel del cuerpo entero (Skin_Body) no es de una región: se cuenta solo en su sistema.
  if (clave === 'Skin_Body') lugares = [];
  return { sistema, subsistema, tipo, lugares: lugares ?? [] };
}
