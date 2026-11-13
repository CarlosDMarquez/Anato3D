// Regiones y agrupaciones (colecciones de Blender) que aparecen en la ruta jerárquica de la ficha.
// Al tocar una, se selecciona el grupo completo.
import { GRUPOS_LINF } from './linfatico/centrales.js';
import { textoDe, frasesDe, evidenciasFrase } from './linfatico/formato.js';

export const GRUPOS = {
  Skeletal_System: {
    nombre: 'Sistema esquelético', latin: 'Systema skeletale',
    descripcion: 'Conjunto de huesos, cartílagos y articulaciones que sostiene el cuerpo, protege los órganos, permite el movimiento junto con los músculos, almacena calcio y fabrica células de la sangre en la médula ósea. Un adulto tiene unos 206 huesos.',
  },
  Axial_Skeleton: {
    nombre: 'Esqueleto axial', latin: 'Skeleton axiale',
    descripcion: 'Forma el eje central del cuerpo: cráneo, columna vertebral, costillas y esternón. Protege el encéfalo, la médula espinal y los órganos del tórax.',
  },
  Appendicular_Skeleton: {
    nombre: 'Esqueleto apendicular', latin: 'Skeleton appendiculare',
    descripcion: 'Huesos de los miembros superiores e inferiores y de las cinturas escapular y pélvica, que los unen al esqueleto axial. Está especializado en el movimiento.',
  },
  Skull: {
    nombre: 'Cráneo', latin: 'Cranium',
    descripcion: 'Esqueleto de la cabeza. Se divide en neurocráneo, que envuelve el encéfalo, y viscerocráneo, que forma la cara. Salvo la mandíbula, sus huesos están unidos por suturas inmóviles.',
  },
  Neurocranium: {
    nombre: 'Neurocráneo', latin: 'Neurocranium',
    descripcion: 'Caja ósea que aloja y protege el encéfalo. La forman el frontal, los parietales, el occipital, los temporales, el esfenoides y el etmoides.',
  },
  Viscerocranium: {
    nombre: 'Viscerocráneo', latin: 'Viscerocranium',
    descripcion: 'Esqueleto de la cara. Sostiene los ojos, la nariz y la boca, y sirve de inserción a los músculos de la mímica y de la masticación.',
  },
  Auditory_Ossicles: {
    nombre: 'Huesecillos del oído', latin: 'Ossicula auditus',
    descripcion: 'Martillo, yunque y estribo: cadena de tres diminutos huesos del oído medio que transmite y amplifica las vibraciones del tímpano hacia el oído interno.',
  },
  Teeth: {
    nombre: 'Dientes', latin: 'Dentes',
    descripcion: 'La dentición permanente del adulto tiene 32 dientes: 8 incisivos, 4 caninos, 8 premolares y 12 molares. Este modelo muestra 28, sin los terceros molares.',
  },
  Vertebral_Column: {
    nombre: 'Columna vertebral', latin: 'Columna vertebralis',
    descripcion: 'Eje del tronco formado por 7 vértebras cervicales, 12 torácicas, 5 lumbares, el sacro y el cóccix. Sostiene el peso del cuerpo, protege la médula espinal y presenta curvaturas que amortiguan los impactos.',
  },
  Cervical_Vertebrae: {
    nombre: 'Vértebras cervicales', latin: 'Vertebrae cervicales',
    descripcion: 'Siete vértebras (C1–C7) que forman el cuello. Son las más pequeñas y móviles; las dos primeras, atlas y axis, están especializadas en mover la cabeza.',
  },
  Thoracic_Vertebrae: {
    nombre: 'Vértebras torácicas', latin: 'Vertebrae thoracicae',
    descripcion: 'Doce vértebras (T1–T12) que se articulan con las costillas y forman la parte posterior de la caja torácica.',
  },
  Lumbar_Vertebrae: {
    nombre: 'Vértebras lumbares', latin: 'Vertebrae lumbales',
    descripcion: 'Cinco vértebras (L1–L5) grandes y robustas que soportan el peso de la parte superior del cuerpo.',
  },
  Rib_Cage: {
    nombre: 'Caja torácica', latin: 'Cavea thoracis',
    descripcion: 'Estructura formada por las costillas, los cartílagos costales, el esternón y las vértebras torácicas. Protege el corazón y los pulmones y cambia de volumen al respirar.',
  },
  Sternum: {
    nombre: 'Esternón', latin: 'Sternum',
    descripcion: 'Hueso plano en el centro del pecho, formado por manubrio, cuerpo y apófisis xifoides. Une por delante las costillas mediante sus cartílagos.',
  },
  Costal_Cartilages: {
    nombre: 'Cartílagos costales', latin: 'Cartilagines costales',
    descripcion: 'Barras de cartílago hialino que unen las costillas con el esternón y dan elasticidad a la pared del tórax.',
  },
  Ribs: {
    nombre: 'Costillas', latin: 'Costae',
    descripcion: 'Doce pares de huesos curvos: siete verdaderos, tres falsos y dos flotantes.',
  },
  Pectoral_Girdle: {
    nombre: 'Cintura escapular', latin: 'Cingulum pectorale',
    descripcion: 'Clavículas y escápulas. Unen los miembros superiores al tronco y les dan una gran movilidad.',
  },
  Upper_Limb: {
    nombre: 'Miembro superior', latin: 'Membrum superius',
    descripcion: 'Brazo (húmero), antebrazo (radio y ulna) y mano (carpo, metacarpo y falanges). Está adaptado a la manipulación fina.',
  },
  Carpus: {
    nombre: 'Carpo', latin: 'Carpus',
    descripcion: 'Ocho huesos cortos de la muñeca, ordenados en dos filas: escafoides, semilunar, piramidal y pisiforme; trapecio, trapezoide, grande y ganchoso.',
  },
  Metacarpus: {
    nombre: 'Metacarpo', latin: 'Metacarpus',
    descripcion: 'Cinco huesos largos que forman la palma de la mano, numerados del I (pulgar) al V (meñique).',
  },
  Phalanges_Hand: {
    nombre: 'Falanges de la mano', latin: 'Ossa digitorum manus',
    descripcion: 'Catorce huesos de los dedos: tres en cada dedo y dos en el pulgar.',
  },
  Pelvic_Girdle: {
    nombre: 'Cintura pélvica', latin: 'Cingulum pelvicum',
    descripcion: 'Los dos coxales, que con el sacro forman la pelvis. Transmiten el peso del tronco a las piernas y protegen los órganos pélvicos.',
  },
  Lower_Limb: {
    nombre: 'Miembro inferior', latin: 'Membrum inferius',
    descripcion: 'Muslo (fémur), rodilla (rótula), pierna (tibia y fíbula) y pie (tarso, metatarso y falanges). Está adaptado a soportar peso y caminar.',
  },
  Tarsus: {
    nombre: 'Tarso', latin: 'Tarsus',
    descripcion: 'Siete huesos del tobillo y de la parte posterior del pie: talus, calcáneo, navicular, cuboides y los tres cuneiformes.',
  },
  Metatarsus: {
    nombre: 'Metatarso', latin: 'Metatarsus',
    descripcion: 'Cinco huesos largos de la parte media del pie, numerados del I (dedo gordo) al V.',
  },
  Phalanges_Foot: {
    nombre: 'Falanges del pie', latin: 'Ossa digitorum pedis',
    descripcion: 'Catorce huesos de los dedos del pie: tres en cada dedo y dos en el dedo gordo.',
  },
  Muscular_System: {
    nombre: 'Sistema muscular', latin: 'Systema musculare',
    descripcion: 'Más de 600 músculos esqueléticos que, al contraerse sobre los huesos, producen el movimiento, mantienen la postura y generan calor. Este modelo muestra los músculos y tendones derivados de Z-Anatomy, ajustados al cuerpo de Anato3D.',
  },
  Connective_System: {
    nombre: 'Tejido conjuntivo', latin: 'Textus connectivus',
    descripcion: 'Tejidos que unen, sostienen y protegen las demás estructuras: ligamentos y cápsulas que estabilizan las articulaciones, cartílagos y discos que amortiguan, fascias que envuelven los músculos, y bursas y vainas que reducen la fricción.',
  },
  Arterial_System: {
    nombre: 'Sistema arterial', latin: 'Systema arteriosum',
    descripcion: 'El corazón y las arterias que llevan la sangre desde él hasta todos los tejidos. Desde la aorta, las arterias se ramifican en vasos cada vez más finos hasta los capilares.',
  },
  Venous_System: {
    nombre: 'Sistema venoso', latin: 'Systema venosum',
    descripcion: 'Las venas que devuelven la sangre de los tejidos al corazón. Hay venas profundas, que acompañan a las arterias, y venas superficiales, bajo la piel.',
  },
  Nervous_System: {
    nombre: 'Sistema nervioso', latin: 'Systema nervosum',
    descripcion: 'Red que recibe la información del cuerpo y del exterior, la procesa y envía órdenes. Se divide en el sistema nervioso central (encéfalo y médula espinal) y el periférico (nervios y ganglios).',
  },
  Respiratory_System: {
    nombre: 'Sistema respiratorio', latin: 'Systema respiratorium',
    descripcion: 'Vías aéreas (nariz, faringe, laringe, tráquea y bronquios) y pulmones. Lleva el aire hasta los alvéolos, donde la sangre capta oxígeno y libera dióxido de carbono. En reposo respiramos unas 12–20 veces por minuto.',
  },
  Digestive_System: {
    nombre: 'Sistema digestivo', latin: 'Systema digestorium',
    descripcion: 'Tubo digestivo (boca, faringe, esófago, estómago e intestinos) y glándulas anexas (salivales, hígado, vesícula y páncreas). Descompone los alimentos, absorbe los nutrientes y elimina los restos.',
  },
  Integumentary_System: {
    nombre: 'Sistema tegumentario', latin: 'Integumentum commune',
    descripcion: 'La piel y sus anexos (pelo, uñas y glándulas). Es la barrera que separa y protege el cuerpo del exterior.',
  },
  Skin_of_head: { nombre: 'Piel de la cabeza', latin: 'Caput', descripcion: 'Cuero cabelludo, cara, párpados, nariz, labios y orejas.' },
  Skin_of_neck: { nombre: 'Piel del cuello', latin: 'Collum', descripcion: 'Piel que cubre el cuello, de la mandíbula y la nuca a las clavículas.' },
  Skin_of_trunk: { nombre: 'Piel del tronco', latin: 'Truncus', descripcion: 'Piel del tórax, el abdomen, la espalda, la región lumbar, los glúteos y el periné.' },
  Skin_of_upper_limb: { nombre: 'Piel del miembro superior', latin: 'Membrum superius', descripcion: 'Piel del hombro, la axila, el brazo, el codo, el antebrazo y la mano.' },
  Skin_of_lower_limb: { nombre: 'Piel del miembro inferior', latin: 'Membrum inferius', descripcion: 'Piel del muslo, la rodilla, la pierna y el pie.' },
  Special_Senses: {
    nombre: 'Órganos de los sentidos', latin: 'Organa sensuum',
    descripcion: 'Órganos especializados en captar estímulos: vista, oído, equilibrio, olfato y gusto.',
  },
};

// Grupos del sistema linfático (data/linfatico/centrales.js): la descripción se escribe frase a frase con sus fuentes;
// aquí entra como texto seguido, con la lista de páginas que la respaldan (la ficha de grupo las enseña).
for (const [id, g] of Object.entries(GRUPOS_LINF)) {
  const paginas = [...new Set(frasesDe(g.descripcion).flatMap((fr) => evidenciasFrase(fr).filter((e) => e.f).map((e) => e.f)))];
  GRUPOS[id] = { nombre: g.nombre, latin: g.latin, descripcion: textoDe(g.descripcion), fuentesLinf: paginas };
}
