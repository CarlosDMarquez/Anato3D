import { GRUPOS } from './grupos.js';
import { latinEtymology } from './musculos.js';
import { REGIONES_VASOS } from './regiones-vasos.js';

// Fichas de los sistemas arterial y venoso y del corazón. Cada tipo de vaso tiene una descripción
// general; los vasos y cavidades principales tienen ficha propia (clave: nombre inglés con «_»).

const TIPO = {
  artery: {
    tipo: 'Arteria', sangre: 'Rica en oxígeno',
    descripcion: 'Vaso que lleva la sangre desde el corazón hacia los tejidos. Sus paredes son gruesas y elásticas para soportar la presión de cada latido.',
    datos: ['Las arterias se representan en rojo porque, salvo las pulmonares, llevan sangre rica en oxígeno.'],
  },
  pulmonary_artery: {
    tipo: 'Arteria pulmonar', sangre: 'Pobre en oxígeno',
    descripcion: 'Lleva sangre pobre en oxígeno desde el ventrículo derecho hacia los pulmones, donde se oxigena.',
    datos: ['Se representa en azul porque, aunque es una arteria, transporta sangre pobre en oxígeno.'],
  },
  vein: {
    tipo: 'Vena', sangre: 'Pobre en oxígeno',
    descripcion: 'Vaso que devuelve la sangre de los tejidos al corazón. Sus paredes son más finas que las de las arterias, y muchas tienen válvulas que impiden que la sangre retroceda.',
    datos: ['Las venas se representan en azul porque, salvo las pulmonares, llevan sangre pobre en oxígeno.'],
  },
  pulmonary_vein: {
    tipo: 'Vena pulmonar', sangre: 'Rica en oxígeno',
    descripcion: 'Devuelve la sangre recién oxigenada desde los pulmones hasta el atrio (aurícula) izquierdo.',
    datos: ['Se representa en rojo porque, aunque es una vena, transporta sangre rica en oxígeno.'],
  },
  heart: {
    tipo: 'Corazón',
    descripcion: 'Parte del corazón, el órgano muscular que bombea la sangre a todo el cuerpo: late unas 100 000 veces al día.',
    datos: [],
  },
  valve: {
    tipo: 'Válvula cardíaca',
    descripcion: 'Velo de tejido fibroso que se abre y se cierra con cada latido para que la sangre circule en un solo sentido.',
    datos: ['El cierre de las válvulas produce los ruidos del corazón que se oyen con el estetoscopio.'],
  },
};

const AORTA = 'La aorta es la arteria más grande del cuerpo: sale del ventrículo izquierdo y reparte la sangre oxigenada a todo el organismo.';
const CAVA_INF = {
  descripcion: 'La vena más grande del cuerpo. Recoge la sangre de las piernas, la pelvis y el abdomen y la lleva al atrio derecho.',
  datos: ['Atraviesa el diafragma a la altura de T8.', 'Al final del embarazo el útero puede comprimirla si la mujer se acuesta boca arriba.'],
};
export const VASOS = {
  Ascending_aorta: { descripcion: `Primer tramo de la aorta, desde el ventrículo izquierdo hasta el arco. ${AORTA}`, datos: ['De su raíz salen las arterias coronarias, que irrigan el propio corazón.'] },
  Aortic_arch: { descripcion: `Curva de la aorta sobre el corazón. ${AORTA}`, datos: ['De él salen el tronco braquiocefálico, la carótida común izquierda y la subclavia izquierda.'] },
  Thoracic_aorta: { descripcion: `Tramo de la aorta que desciende por el tórax, junto a la columna. ${AORTA}`, datos: ['Atraviesa el diafragma a la altura de T12.'] },
  Abdominal_aorta: { descripcion: `Tramo de la aorta en el abdomen, hasta su división en las ilíacas comunes a la altura de L4. ${AORTA}`, datos: ['Su dilatación (aneurisma de aorta abdominal) puede palparse como una masa que late.'] },
  Pulmonary_trunk: { descripcion: 'Arteria gruesa que sale del ventrículo derecho y se divide en las arterias pulmonares derecha e izquierda.', datos: ['Lleva sangre pobre en oxígeno, por eso se representa en azul.'] },
  Brachiocephalic_trunk: { descripcion: 'Primera rama del arco aórtico. Se divide en la carótida común y la subclavia derechas.', datos: ['Solo existe en el lado derecho.'] },
  Right_common_carotid_artery: { descripcion: 'Arteria principal del cuello que irriga la cabeza. Se divide en carótida interna (encéfalo) y externa (cara y cuello).', datos: ['Su pulso se palpa a un lado de la laringe.'] },
  Left_common_carotid_artery: { descripcion: 'Arteria principal del cuello que irriga la cabeza. Sale directamente del arco aórtico y se divide en carótida interna y externa.', datos: ['Su pulso se palpa a un lado de la laringe.'] },
  Internal_carotid_artery: { descripcion: 'Rama de la carótida común que entra en el cráneo e irriga la mayor parte del encéfalo y el ojo.', datos: ['Su estrechamiento por placas de ateroma es una causa importante de ictus.'] },
  Basilar_artery: { descripcion: 'Arteria formada por la unión de las dos vertebrales en la base del encéfalo. Irriga el tronco del encéfalo y el cerebelo.', datos: ['Forma parte del círculo arterial del cerebro (polígono de Willis).'] },
  Subclavian_artery: { descripcion: 'Arteria que pasa bajo la clavícula hacia el brazo; al cruzar la primera costilla pasa a llamarse axilar.', datos: [] },
  Brachial_artery: { descripcion: 'Arteria principal del brazo. Continúa a la axilar y en el codo se divide en radial y ulnar.', datos: ['Sobre ella se coloca el estetoscopio al medir la presión arterial.'] },
  Radial_artery: { descripcion: 'Arteria del lado del pulgar del antebrazo, que llega a la mano.', datos: ['En la muñeca es donde se toma habitualmente el pulso.'] },
  Femoral_artery: { descripcion: 'Arteria principal del muslo. Continúa a la ilíaca externa bajo el ligamento inguinal.', datos: ['Su pulso se palpa en la ingle.', 'Es una vía habitual para los cateterismos.'] },
  Popliteal_artery: { descripcion: 'Continuación de la femoral detrás de la rodilla. Se divide en las tibiales anterior y posterior.', datos: ['Su pulso se palpa en la corva con la rodilla algo flexionada.'] },
  Dorsalis_pedis_artery: { descripcion: 'Continuación de la tibial anterior en el dorso del pie.', datos: ['Su pulso se explora para valorar la circulación del pie, por ejemplo en personas con diabetes.'] },
  Right_coronary_artery: { descripcion: 'Arteria que nace de la aorta y rodea el corazón por el lado derecho. Irriga el atrio y el ventrículo derechos y, en la mayoría de las personas, el nódulo sinusal.', datos: ['Su obstrucción produce infartos de la cara inferior del corazón.'] },
  Left_coronary_artery: { descripcion: 'Arteria que nace de la aorta y se divide enseguida en la interventricular anterior y la circunfleja. Irriga la mayor parte del ventrículo izquierdo.', datos: [] },
  Anterior_interventricular_artery: { descripcion: 'Rama de la coronaria izquierda que baja por el surco entre los dos ventrículos.', datos: ['Su obstrucción causa infartos extensos: por eso se le llama «la arteria de la viuda».'] },
  Superior_vena_cava: { descripcion: 'Vena gruesa que recoge la sangre de la cabeza, el cuello, los brazos y el tórax y la lleva al atrio derecho.', datos: ['Se forma por la unión de las dos venas braquiocefálicas.'] },
  Inferior_vena_cava_abdominal_part: CAVA_INF,
  Inferior_vena_cava_thoracic_part: CAVA_INF,
  Internal_jugular_vein: { descripcion: 'Vena principal del cuello: recoge la sangre del encéfalo, la cara y el cuello.', datos: ['Corre junto a la carótida común dentro de la vaina carotídea.', 'Es una vía habitual para colocar catéteres venosos centrales.'] },
  External_jugular_vein: { descripcion: 'Vena superficial del cuello que cruza el músculo esternocleidomastoideo.', datos: ['Se hace visible al hacer fuerza o en la insuficiencia cardíaca.'] },
  Median_cubital_vein: { descripcion: 'Vena superficial de la flexura del codo que une la cefálica con la basílica.', datos: ['Es la vena que se usa con más frecuencia para sacar sangre.'] },
  Cephalic_vein: { descripcion: 'Vena superficial que sube por el lado del pulgar del brazo hasta la axilar.', datos: [] },
  Basilic_vein: { descripcion: 'Vena superficial que sube por el lado medial del brazo y se une a las venas braquiales.', datos: [] },
  Great_saphenous_vein: { descripcion: 'La vena más larga del cuerpo: sube por la cara medial de la pierna y el muslo desde el pie hasta la vena femoral.', datos: ['Se usa como injerto en la cirugía de bypass coronario.', 'Su dilatación forma varices.'] },
  Small_saphenous_vein: { descripcion: 'Vena superficial de la parte posterior de la pierna, que desemboca en la poplítea.', datos: [] },
  Femoral_vein: { descripcion: 'Vena profunda principal del muslo, junto a la arteria femoral.', datos: ['Es un sitio frecuente de trombosis venosa profunda.'] },
  Hepatic_portal_vein: { descripcion: 'Vena que lleva al hígado la sangre del intestino, el bazo y el estómago, cargada de nutrientes, para que la procese antes de volver al corazón.', datos: ['Se forma detrás del páncreas por la unión de la vena esplénica y la mesentérica superior.'] },
  Coronary_sinus: { descripcion: 'Vena del surco posterior del corazón que recoge la sangre del propio músculo cardíaco y la vierte en el atrio derecho.', datos: [] },
  Superior_sagittal_sinus: { descripcion: 'Conducto venoso de la duramadre en la línea media del cráneo, que recoge la sangre del cerebro y el líquido cefalorraquídeo.', datos: [] },
  Right_atrium: { descripcion: 'Cavidad que recibe la sangre pobre en oxígeno de todo el cuerpo por las venas cavas y la pasa al ventrículo derecho.', datos: ['En su pared está el nódulo sinusal, el marcapasos natural del corazón.'] },
  Left_atrium: { descripcion: 'Cavidad que recibe la sangre oxigenada de los pulmones por las cuatro venas pulmonares y la pasa al ventrículo izquierdo.', datos: ['La fibrilación auricular favorece que se formen coágulos en ella.'] },
  Right_ventricle: { descripcion: 'Cavidad que bombea la sangre pobre en oxígeno hacia los pulmones por el tronco pulmonar.', datos: ['Su pared es mucho más fina que la del ventrículo izquierdo: la circulación pulmonar tiene baja presión.'] },
  Left_ventricle: { descripcion: 'La cavidad más potente del corazón: bombea la sangre oxigenada a todo el cuerpo a través de la aorta.', datos: ['Su pared mide alrededor de 1 cm de grosor, unas tres veces más que la del ventrículo derecho.'] },
};

const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const parse = (s) => {
  try { return JSON.parse(s || '[]'); } catch { return []; }
};

export function resolveVessel(name, x) {
  const side = /_L$/.test(name) ? 'L' : /_R$/.test(name) ? 'R' : null;
  const region = parse(x.region);
  const key = String(x.name_en ?? '').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '');
  const own = VASOS[key] ?? VASOS[key.replace(/^(Right|Left)_/, '')] ?? null;
  const tipo = TIPO[x.tissue] ?? TIPO.artery;
  const group = [...region].reverse().map((g) => GRUPOS[g]).find(Boolean);
  return {
    key: x.name_en,
    side,
    title: cap(x.name_es || x.name_en),
    latin: x.name_la || null,
    tissue: null,
    chips: [tipo.tipo, x.major && x.tissue !== 'heart' && x.tissue !== 'valve' && 'Vaso principal', side && (side === 'L' ? 'Lado izquierdo' : 'Lado derecho')].filter(Boolean),
    fields: [
      // Región real del cuerpo (tools/vessel_regions.py); las colecciones de Z-Anatomy («Aorta»…) solo como reserva.
      (REGIONES_VASOS[key] ?? group) && { label: 'Región', value: REGIONES_VASOS[key] ?? group.nombreEs ?? group.nombre },
      tipo.sangre && { label: 'Sangre', value: tipo.sangre },
    ].filter(Boolean),
    entry: {
      descripcion: own?.descripcion ?? tipo.descripcion,
      etimologia: latinEtymology(x.name_la),
    },
    datos: [...(own?.datos ?? []), ...tipo.datos],
    source: x.source ?? null,
  };
}
