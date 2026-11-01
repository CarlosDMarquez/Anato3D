import { GRUPOS } from './grupos.js';
import { latinEtymology } from './musculos.js';

// Fichas del sistema nervioso y de los órganos de los sentidos. Cada tejido tiene una descripción general;
// las estructuras principales tienen ficha propia (clave: nombre inglés de Z-Anatomy con «_»).

const TEJIDO = {
  cortex: { tipo: 'Corteza cerebral', descripcion: 'Parte de la corteza cerebral, la capa de sustancia gris de 2 a 4 mm que cubre los hemisferios. Sus pliegues (giros), separados por surcos, multiplican su superficie; aquí se procesan el pensamiento, el lenguaje, la percepción y el movimiento voluntario.' },
  cerebellum: { tipo: 'Cerebelo', descripcion: 'Parte del cerebelo, que coordina los movimientos, el equilibrio y el tono muscular. Aunque pesa un 10 % del encéfalo, contiene más de la mitad de sus neuronas.' },
  brainstem: { tipo: 'Tronco del encéfalo', descripcion: 'Parte del tronco del encéfalo, que une el cerebro con la médula espinal. Controla funciones vitales como la respiración y el ritmo cardíaco, y de él salen la mayoría de los nervios craneales.' },
  white_matter: { tipo: 'Sustancia blanca', descripcion: 'Haces de fibras nerviosas recubiertas de mielina que conectan unas regiones con otras y transmiten las señales a gran velocidad. La mielina, rica en grasa, le da su color blanquecino.' },
  nucleus: { tipo: 'Núcleo de sustancia gris', descripcion: 'Agrupación de cuerpos de neuronas en el interior del encéfalo o de la médula espinal, con una función concreta.' },
  csf: { tipo: 'Sistema ventricular', descripcion: 'Parte de las cavidades llenas de líquido cefalorraquídeo, que amortigua, protege y nutre el encéfalo y la médula espinal.' },
  meninges: { tipo: 'Meninges', descripcion: 'Parte de las meninges, las membranas que envuelven y protegen el encéfalo y la médula: duramadre (externa y resistente), aracnoides y piamadre (pegada al tejido nervioso).' },
  nerve: { tipo: 'Nervio', descripcion: 'Haz de fibras nerviosas que conecta el sistema nervioso central con el resto del cuerpo: lleva órdenes a los músculos y glándulas, y sensaciones desde la piel y los órganos.', datos: ['En los atlas anatómicos los nervios se representan en amarillo.'] },
  ganglion: { tipo: 'Ganglio', descripcion: 'Agrupación de cuerpos de neuronas situada fuera del sistema nervioso central, a lo largo de un nervio.' },
  sense: { tipo: 'Órgano de los sentidos', descripcion: 'Parte de un órgano de los sentidos.' },
};
const SUBSISTEMA = { cns: 'Sistema nervioso central', pns: 'Sistema nervioso periférico', special_senses: 'Órganos de los sentidos' };

const par = (n, tipo, funcion, descripcion, datos = []) => ({ par: n, tipo, funcion, descripcion, datos });
const BROCA = { descripcion: 'Junto con la porción opercular forma el área de Broca, en el hemisferio dominante (normalmente el izquierdo).', funcion: 'Producción del lenguaje hablado y escrito.', datos: ['Su lesión produce la afasia de Broca: se entiende el lenguaje, pero cuesta mucho hablar.'] };

export const NERVIOSO = {
  // ── Pares craneales ──
  Olfactory_nerve_I: par('I', 'Sensitivo', 'Olfato.', 'Fibras que van desde la mucosa del techo de la nariz, atravesando la lámina cribosa del etmoides, hasta el bulbo olfatorio.', ['Un golpe en la frente puede romper sus fibras y causar pérdida del olfato (anosmia).']),
  Optic_nerve_II: par('II', 'Sensitivo', 'Visión.', 'Lleva la información visual desde la retina hasta el quiasma óptico. En realidad es una prolongación del encéfalo, envuelta por meninges.', ['En el fondo de ojo se ve su origen, la papila óptica, que se hincha si aumenta la presión intracraneal.']),
  Oculomotor_nerve_III: par('III', 'Motor', 'Mueve el ojo (la mayoría de sus músculos), eleva el párpado y contrae la pupila.', 'Sale del mesencéfalo e inerva cuatro de los seis músculos que mueven el ojo.', ['Su lesión deja el ojo mirando hacia abajo y afuera, con el párpado caído y la pupila dilatada.']),
  Trochlear_nerve_IV: par('IV', 'Motor', 'Inerva el músculo oblicuo superior del ojo.', 'El par craneal más delgado y el único que sale por la cara posterior del tronco del encéfalo.', ['Su lesión produce visión doble al bajar escaleras.']),
  Trigeminal_nerve_V: par('V', 'Mixto', 'Sensibilidad de la cara y movimientos de la masticación.', 'El par craneal más grueso. Se divide en tres ramas: oftálmica, maxilar y mandibular.', ['Su irritación produce la neuralgia del trigémino, un dolor facial muy intenso.']),
  Abducens_nerve_VI: par('VI', 'Motor', 'Inerva el músculo recto lateral, que lleva el ojo hacia fuera.', 'Sale entre la protuberancia y el bulbo raquídeo y llega a la órbita.', ['Tiene un trayecto largo dentro del cráneo, por lo que se afecta a menudo cuando aumenta la presión intracraneal.']),
  Facial_nerve_VII: par('VII', 'Mixto', 'Músculos de la expresión facial, gusto de los dos tercios anteriores de la lengua, y glándulas lagrimales y salivales.', 'Sale del tronco del encéfalo, atraviesa el hueso temporal y se ramifica en la cara dentro de la glándula parótida.', ['Su parálisis (de Bell) deja inmóvil la mitad de la cara.']),
  Vestibulocochlear_nerve_VIII: par('VIII', 'Sensitivo', 'Audición (porción coclear) y equilibrio (porción vestibular).', 'Lleva al tronco del encéfalo la información del oído interno.', ['Un tumor benigno en su vaina (neurinoma del acústico) causa sordera de un lado y zumbidos.']),
  Glossopharyngeal_nerve_IX: par('IX', 'Mixto', 'Gusto del tercio posterior de la lengua, sensibilidad de la faringe y deglución.', 'Sale del bulbo raquídeo y llega a la lengua y la faringe.', ['Participa en el reflejo nauseoso.']),
  Vagus_nerve_X: par('X', 'Mixto', 'Inervación parasimpática del corazón, los pulmones y el tubo digestivo; músculos de la laringe y la faringe.', 'El par craneal más largo: desciende desde el bulbo raquídeo por el cuello y el tórax hasta el abdomen.', ['Su nombre viene del latín vagus, «errante», por su largo recorrido.', 'Frena el corazón: por eso algunas maniobras vagales detienen ciertas taquicardias.']),
  Accessory_nerve_XI: par('XI', 'Motor', 'Inerva los músculos esternocleidomastoideo y trapecio.', 'Nace de la médula cervical alta, sube al cráneo y vuelve a salir por el foramen yugular.', ['Su lesión impide encoger el hombro y girar la cabeza con fuerza.']),
  Hypoglossal_nerve_XII: par('XII', 'Motor', 'Movimientos de la lengua.', 'Sale del bulbo raquídeo y llega a los músculos de la lengua.', ['Si se lesiona, la lengua se desvía hacia el lado lesionado al sacarla.']),
  // ── Encéfalo y médula ──
  Medulla_oblongata: { descripcion: 'Parte inferior del tronco del encéfalo, que continúa con la médula espinal en el foramen magno. Contiene los centros que controlan la respiración, el ritmo cardíaco y la presión arterial.', datos: ['En sus pirámides se cruzan la mayoría de las fibras motoras: por eso cada hemisferio controla el lado opuesto del cuerpo.'] },
  Pons: { descripcion: 'Porción del tronco del encéfalo entre el mesencéfalo y el bulbo raquídeo. Su nombre significa «puente» porque conecta con el cerebelo.', datos: ['Participa en el control de la respiración y del sueño.'] },
  Midbrain: { descripcion: 'Parte superior del tronco del encéfalo. Contiene centros de los reflejos visuales y auditivos, y la sustancia negra, que interviene en el movimiento.', datos: ['La pérdida de neuronas de la sustancia negra causa la enfermedad de Parkinson.'] },
  Thalamus: { descripcion: 'Gran masa de sustancia gris en el centro del encéfalo. Es la estación de relevo de casi toda la información sensitiva antes de llegar a la corteza.', datos: [] },
  Hypothalamus: { descripcion: 'Pequeña región bajo el tálamo que controla la temperatura, el hambre, la sed, el sueño y, a través de la hipófisis, buena parte del sistema hormonal.', datos: [] },
  Hippocampus: { descripcion: 'Estructura curva en el lóbulo temporal, esencial para formar nuevos recuerdos y para orientarse en el espacio.', funcion: 'Memoria y orientación espacial.', datos: ['Es de las primeras regiones afectadas en la enfermedad de Alzheimer.', 'Su nombre significa «caballito de mar» por su forma.'] },
  Amygdaloid_body: { descripcion: 'Núcleo con forma de almendra en el lóbulo temporal. Procesa las emociones, sobre todo el miedo, y les da relevancia a los recuerdos.', datos: [] },
  Corpus_callosum: { descripcion: 'El mayor haz de sustancia blanca del encéfalo: unos 200 millones de fibras que conectan los dos hemisferios.', datos: ['Su sección quirúrgica se usó para tratar algunas epilepsias graves.'] },
  Caudate_nucleus: { descripcion: 'Núcleo de la base con forma de C junto al ventrículo lateral. Participa en el control del movimiento y en el aprendizaje.', datos: ['Se atrofia en la enfermedad de Huntington.'] },
  Putamen: { descripcion: 'Núcleo de la base que, con el globo pálido, forma el núcleo lentiforme. Regula el movimiento.', datos: [] },
  Globus_pallidus: { descripcion: 'Núcleo de la base, medial al putamen, que regula los movimientos voluntarios.', datos: [] },
  Lateral_ventricle: { descripcion: 'La mayor de las cavidades del encéfalo, una en cada hemisferio, llena de líquido cefalorraquídeo.', datos: ['Su plexo coroideo produce gran parte del líquido cefalorraquídeo, unos 500 ml al día.'] },
  Third_ventricle: { descripcion: 'Cavidad estrecha en la línea media, entre los dos tálamos, llena de líquido cefalorraquídeo.', datos: [] },
  Fourth_ventricle: { descripcion: 'Cavidad entre el tronco del encéfalo y el cerebelo. Comunica el sistema ventricular con el espacio que rodea el encéfalo.', datos: [] },
  Aqueduct_of_midbrain: { descripcion: 'Conducto estrecho que comunica el tercer y el cuarto ventrículos a través del mesencéfalo.', datos: ['Su obstrucción es una causa frecuente de hidrocefalia.'] },
  Precentral_gyrus: { descripcion: 'Giro situado delante del surco central: es la corteza motora primaria.', funcion: 'Movimiento voluntario del lado opuesto del cuerpo.', datos: ['Cada parte del cuerpo tiene aquí su zona, en un mapa llamado homúnculo motor.'] },
  Postcentral_gyrus: { descripcion: 'Giro situado detrás del surco central: es la corteza somatosensorial primaria.', funcion: 'Tacto, dolor, temperatura y posición del lado opuesto del cuerpo.', datos: [] },
  Central_sulcus: { descripcion: 'Surco profundo que separa el lóbulo frontal del parietal, y la corteza motora de la sensitiva.', datos: [] },
  Calcarine_sulcus: { descripcion: 'Surco en la cara medial del lóbulo occipital, rodeado por la corteza visual primaria.', funcion: 'Visión.', datos: [] },
  Triangular_part_of_inferior_frontal_gyrus: BROCA,
  Opercular_part_of_inferior_frontal_gyrus: BROCA,
  Transverse_temporal_gyri: { descripcion: 'Giros en el interior del surco lateral, en el lóbulo temporal: son la corteza auditiva primaria.', funcion: 'Audición.', datos: [] },
  Supramarginal_gyrus: { descripcion: 'Giro del lóbulo parietal inferior, que rodea el final del surco lateral. En el hemisferio dominante, con el giro angular, rodea el área de Wernicke (en la parte posterior del giro temporal superior) y participa en el lenguaje.', funcion: 'Lenguaje y sensibilidad.', datos: [] },
  Angular_gyrus: { descripcion: 'Giro del lóbulo parietal inferior que integra información visual, auditiva y del lenguaje.', funcion: 'Lectura y escritura.', datos: [] },
  Optic_chiasm: { descripcion: 'Punto donde se cruzan parcialmente los nervios ópticos: las fibras de la mitad nasal de cada retina pasan al lado opuesto.', datos: ['Un tumor de hipófisis que lo comprime causa la pérdida de la visión lateral de ambos ojos.'] },
  Red_nucleus: { descripcion: 'Núcleo del mesencéfalo, rojizo por su abundante hierro, que participa en la coordinación de los movimientos.', datos: [] },
  Superior_colliculus: { descripcion: 'Relieve del techo del mesencéfalo que coordina los reflejos visuales y los movimientos de los ojos y la cabeza.', datos: [] },
  Inferior_colliculus: { descripcion: 'Relieve del techo del mesencéfalo que forma parte de la vía auditiva.', datos: [] },
  Lateral_corticospinal_tract: { descripcion: 'La principal vía motora: lleva las órdenes de la corteza a las neuronas motoras de la médula.', datos: ['La mayoría de sus fibras se cruzan en el bulbo raquídeo.'] },
  Spinal_dura: { descripcion: 'Duramadre espinal: tubo fibroso resistente que envuelve la médula y las raíces nerviosas hasta el sacro.', datos: ['Por fuera de ella, en el espacio epidural, se pone la anestesia epidural.'] },
  Falx_cerebri: { descripcion: 'Pliegue de duramadre en forma de hoz que se introduce entre los dos hemisferios cerebrales.', datos: [] },
  Tentorium_cerebelli: { descripcion: 'Pliegue de duramadre que forma una tienda sobre el cerebelo y lo separa de los lóbulos occipitales.', datos: [] },
  Cauda_equina: { descripcion: 'Haz de raíces nerviosas lumbares y sacras que desciende por el conducto vertebral por debajo del final de la médula (L1–L2). Su nombre significa «cola de caballo».', datos: ['La punción lumbar se hace por debajo de L2 para no dañar la médula.'] },
  // ── Nervios periféricos ──
  Sciatic_nerve: { descripcion: 'El nervio más grueso y largo del cuerpo. Sale de la pelvis por debajo del piriforme, baja por la parte posterior del muslo y se divide en el tibial y el fibular común.', datos: ['Su irritación produce la ciática: dolor que baja por la parte posterior de la pierna.'] },
  Median_nerve: { descripcion: 'Nervio del brazo y del antebrazo que llega a la mano por el túnel carpiano. Inerva los flexores del antebrazo y los músculos del pulgar.', datos: ['Su compresión en la muñeca es el síndrome del túnel carpiano.'] },
  Ulnar_nerve: { descripcion: 'Nervio que pasa detrás del epicóndilo medial del húmero e inerva la mayoría de los músculos pequeños de la mano.', datos: ['Golpearlo en el codo produce el calambre del «hueso de la risa».'] },
  Radial_nerve: { descripcion: 'Nervio que rodea el húmero por detrás e inerva todos los extensores del brazo y del antebrazo.', datos: ['Su lesión en el brazo produce la «mano caída».'] },
  Axillary_nerve: { descripcion: 'Nervio que rodea el cuello quirúrgico del húmero e inerva el deltoides y el redondo menor.', datos: ['Puede lesionarse en luxaciones de hombro y fracturas del cuello del húmero.'] },
  Musculocutaneous_nerve: { descripcion: 'Nervio que atraviesa el coracobraquial e inerva los flexores del brazo (bíceps y braquial).', datos: [] },
  Femoral_nerve: { descripcion: 'Nervio que entra al muslo bajo el ligamento inguinal e inerva el cuádriceps y la piel de la cara anterior del muslo.', datos: ['Es responsable del reflejo rotuliano.'] },
  Common_fibular_nerve: { descripcion: 'Rama del ciático que rodea el cuello de la fíbula, justo bajo la piel.', datos: ['Su lesión produce «pie caído», por ejemplo al cruzar las piernas mucho tiempo.'] },
  Tibial_nerve: { descripcion: 'Rama del ciático que baja por la parte posterior de la pierna e inerva los flexores del pie y la planta.', datos: [] },
  Long_thoracic_nerve: { descripcion: 'Nervio que desciende por la pared lateral del tórax e inerva el serrato anterior.', datos: ['Su lesión produce la «escápula alada».'] },
  Intercostal_nerves: { descripcion: 'Ramos anteriores de los nervios torácicos que recorren los espacios intercostales, bajo cada costilla.', datos: ['El herpes zóster suele seguir el trayecto de uno de ellos.'] },
  Sympathetic_trunk: { descripcion: 'Cadena de ganglios a ambos lados de la columna, desde el cráneo hasta el cóccix. Es la base del sistema simpático, el de «lucha o huida».', datos: [] },
  Roots_of_brachial_plexus: { descripcion: 'Raíces de los nervios espinales C5 a T1, que se combinan para formar el plexo braquial, origen de todos los nervios del miembro superior.', datos: [] },
  Pudendal_nerve: { descripcion: 'Nervio principal del periné: inerva los esfínteres y da sensibilidad a los genitales.', datos: [] },
  Saphenous_nerve: { descripcion: 'Rama sensitiva del femoral que acompaña a la vena safena mayor por la cara medial de la pierna.', datos: [] },
  Sural_nerve: { descripcion: 'Nervio sensitivo de la parte posterior y lateral de la pierna y del borde externo del pie.', datos: ['Se usa a menudo para biopsias de nervio e injertos.'] },
  // ── Ojo y oído ──
  Cornea: { descripcion: 'Capa transparente y abombada en la parte frontal del ojo. Aporta unas dos terceras partes del poder de enfoque del ojo.', datos: ['No tiene vasos sanguíneos: se nutre de las lágrimas y del humor acuoso.', 'Es uno de los tejidos con más terminaciones nerviosas del cuerpo.'] },
  Lens: { descripcion: 'Lente biconvexa y transparente detrás del iris que cambia de forma para enfocar de cerca o de lejos.', datos: ['Su opacificación es la catarata.', 'Con la edad pierde elasticidad y aparece la presbicia (vista cansada).'] },
  Retina: { descripcion: 'Capa interna del ojo con las células sensibles a la luz (conos y bastones), que transforma la imagen en señales nerviosas.', datos: ['Su desprendimiento es una urgencia que puede causar ceguera.'] },
  Iris: { descripcion: 'Disco de color con un orificio central, la pupila, cuyo tamaño regula la cantidad de luz que entra al ojo.', datos: [] },
  Sclera: { descripcion: 'Capa externa del ojo, blanca y resistente: el «blanco del ojo».', datos: ['Se vuelve amarilla en la ictericia.'] },
  Vitreous_body: { descripcion: 'Gel transparente que rellena la parte posterior del ojo y mantiene su forma.', datos: ['Los pequeños grumos que se forman en él son las «moscas volantes».'] },
  Cochlea: { descripcion: 'Conducto en espiral del oído interno, con forma de caracol, que transforma las vibraciones del sonido en señales nerviosas.', datos: ['Los implantes cocleares estimulan directamente su nervio.'] },
  Tympanic_membrane: { descripcion: 'Membrana fina que separa el oído externo del medio y vibra con el sonido, transmitiendo la vibración al martillo.', datos: ['Se perfora con cambios bruscos de presión o en infecciones del oído medio.'] },
  Auditory_tube: { descripcion: 'Conducto que comunica el oído medio con la faringe e iguala la presión a ambos lados del tímpano.', datos: ['Tragar o bostezar la abre: por eso se «destapan» los oídos en los aviones.'] },
  Lacrimal_gland: { descripcion: 'Glándula situada en la parte superior y externa de la órbita que produce las lágrimas.', datos: [] },
  Vestibule: { descripcion: 'Cavidad central del oído interno que, junto con los conductos semicirculares, detecta la posición y el movimiento de la cabeza.', datos: [] },
};

const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const parse = (s) => {
  try { return JSON.parse(s || '[]'); } catch { return []; }
};

export function resolveNervous(name, x) {
  const side = /_L$/.test(name) ? 'L' : /_R$/.test(name) ? 'R' : null;
  const region = parse(x.region);
  const key = String(x.name_en ?? '').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '');
  const own = NERVIOSO[key] ?? null;
  const tejido = TEJIDO[x.tissue] ?? TEJIDO.nerve;
  const group = [...region].reverse().map((g) => GRUPOS[g]).find(Boolean);
  return {
    key: x.name_en,
    side,
    title: cap(x.name_es || x.name_en),
    latin: x.name_la || null,
    tissue: null,
    chips: [own?.par ? `Par craneal ${own.par}` : tejido.tipo, side && (side === 'L' ? 'Lado izquierdo' : 'Lado derecho')].filter(Boolean),
    fields: [
      { label: 'Parte', value: SUBSISTEMA[x.subsystem] ?? 'Sistema nervioso' },
      group && { label: 'Región', value: group.nombre },
      own?.tipo && { label: 'Tipo', value: own.tipo },
      own?.funcion && { label: 'Función', value: own.funcion },
    ].filter(Boolean),
    entry: {
      descripcion: own?.descripcion ?? tejido.descripcion,
      etimologia: latinEtymology(x.name_la),
    },
    datos: [...(own?.datos ?? []), ...(own ? [] : tejido.datos ?? [])],
    source: x.source ?? null,
  };
}
