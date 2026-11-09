// Lección «Corazón y circulación». Formato y evidencias: ../formato.js.
import { leccion, W, GUIA, MODELO } from '../formato.js';

const CIR = 'Circulatory_system';
const V = (nombre, piezas, tipo, papel = 'nucleo', lado = 'impar') => ({ nombre, piezas, lado, papel, tipo });

export default leccion({
  id: 'sis-cardiovascular',
  version: 1,
  titulo: 'Corazón y circulación',
  resumen: 'El corazón y sus cuatro cavidades, las dos circulaciones (pulmonar y sistémica), el camino de la sangre por arterias, capilares y venas y los grandes vasos que entran y salen del corazón.',
  lugares: [],
  sistemas: ['cardiovascular'],
  formato: 'vision-general',
  temas: ['arterias-venas'],
  nivel: 1,
  minutos: 12,
  requisitos: ['fund-orientacion'],
  siguiente: ['tor-corazon', 'cue-vasos', 'ms-vasos'],
  objetivos: [
    'Nombrar las cuatro cavidades del corazón y localizarlas en el modelo.',
    'Seguir el recorrido de la sangre por la circulación pulmonar y por la sistémica.',
    'Ordenar los vasos por los que pasa la sangre: arterias, arteriolas, capilares, vénulas y venas.',
    'Localizar la aorta, el tronco pulmonar y las venas cavas superior e inferior.',
  ],
  estructuras: {
    'atrio-derecho': V('Atrio derecho', ['Right_atrium'], 'corazon'),
    'ventriculo-derecho': V('Ventrículo derecho', ['Right_ventricle'], 'corazon'),
    'atrio-izquierdo': V('Atrio izquierdo', ['Left_atrium'], 'corazon'),
    'ventriculo-izquierdo': V('Ventrículo izquierdo', ['Left_ventricle'], 'corazon'),
    aorta: { ...V('Aorta', ['Ascending_aorta', 'Aortic_arch', 'Thoracic_aorta', 'Abdominal_aorta'], 'arteria'), confusiones: ['Arteria carótida común', 'Vena ácigos'] },
    'tronco-pulmonar': V('Tronco pulmonar', ['Pulmonary_trunk', 'Bifurcation_of_pulmonary_trunk'], 'arteria'),
    'cava-superior': V('Vena cava superior', ['Superior_vena_cava'], 'vena'),
    'cava-inferior': V('Vena cava inferior', ['Inferior_vena_cava_thoracic_part', 'Inferior_vena_cava_abdominal_part'], 'vena'),
  },
  pasos: [
    {
      id: 'sistema', tipo: 'orientacion', titulo: 'Corazón y vasos sanguíneos',
      texto: [
        ['El sistema cardiovascular está formado por el corazón y los vasos sanguíneos.', W(CIR, 'The cardiovascular system in all vertebrates consists of the heart and blood vessels.')],
        ['El corazón bombea la sangre a todas las partes del cuerpo.', W(CIR, 'The heart pumps blood to all parts of the body.')],
        ['Los vasos son las arterias, las venas y los capilares.', W(CIR, 'The blood vessels of the circulatory system are the arteries, veins, and capillaries.')],
        ['En el modelo, las arterias son rojas y las venas, azules; ves los vasos principales.', MODELO],
      ],
      vista: { capas: { skeletal: 'all', arterial: 'major', venous: 'major' }, ver: [], contexto: [], camara: 'anterior', lado: 'R' },
    },
    {
      id: 'cavidades', tipo: 'exploracion', titulo: 'Cuatro cavidades',
      texto: [
        ['El corazón tiene un atrio y un ventrículo para cada circulación: cuatro cavidades en total, atrio y ventrículo izquierdos y atrio y ventrículo derechos.', W(CIR, 'In the human heart there is one atrium and one ventricle for each circulation, and with both a systemic and a pulmonary circulation there are four chambers in total: left atrium, left ventricle, right atrium and right ventricle.')],
        ['El lado derecho del corazón trabaja para la circulación pulmonar y el izquierdo, para la sistémica.', W(CIR, 'The pulmonary circulation is a circuit loop from the right heart'), W(CIR, 'delivers oxygenated blood from the left heart to the rest of the body')],
        ['Recuerda que el lado derecho del corazón queda a tu izquierda cuando miras el modelo de frente.', GUIA],
      ],
      vista: { ver: ['atrio-derecho', 'ventriculo-derecho', 'atrio-izquierdo', 'ventriculo-izquierdo'], contexto: [], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'ventriculo-izquierdo', texto: 'Toca el ventrículo izquierdo, la cavidad que bombea la sangre a todo el cuerpo.' },
    },
    {
      id: 'pulmonar', tipo: 'funcion', titulo: 'La circulación pulmonar',
      texto: [
        ['La sangre pobre en oxígeno llega por las venas cavas al atrio derecho, pasa al ventrículo derecho y sale por la arteria pulmonar hacia los pulmones.', W(CIR, 'Oxygen-deprived blood from the superior and inferior vena cava enters the right atrium of the heart and flows through the tricuspid valve (right atrioventricular valve) into the right ventricle, from which it is then pumped through the pulmonary semilunar valve into the pulmonary artery to the lungs.')],
        ['En los pulmones la sangre suelta el dióxido de carbono y toma oxígeno, y vuelve oxigenada al lado izquierdo del corazón.', W(CIR, 'Gas exchange occurs in the lungs, whereby CO2 is released from the blood, and oxygen is absorbed.'), W(CIR, 'taking deoxygenated blood to the lungs where it is oxygenated and returned to the left heart')],
      ],
      vista: { ver: ['tronco-pulmonar'], contexto: ['atrio-derecho', 'ventriculo-derecho', 'cava-superior', 'cava-inferior'], camara: 'anterior', lado: 'R' },
      comprobar: 'pulmonar',
    },
    {
      id: 'sistemica', tipo: 'funcion', titulo: 'La circulación sistémica',
      texto: [
        ['La circulación sistémica lleva la sangre oxigenada desde el lado izquierdo del corazón al resto del cuerpo por la aorta.', W(CIR, 'The systemic circulation is a circuit loop that delivers oxygenated blood from the left heart to the rest of the body through the aorta.')],
        ['La aorta, gruesa y elástica, se arquea, da ramas para la parte superior del cuerpo, atraviesa el diafragma a la altura de la décima vértebra torácica y baja por el abdomen.', W(CIR, 'The first part of the systemic circulation is the aorta, a massive and thick-walled artery.'), W(CIR, 'The aorta arches and gives branches supplying the upper part of the body after passing through the aortic opening of the diaphragm at the level of thoracic ten vertebra, it enters the abdomen.')],
        ['La sangre vuelve al atrio derecho por las dos venas cavas: la superior drena sobre todo lo que está por encima del corazón y la inferior, lo que está por debajo.', W(CIR, 'the superior vena cava – which mainly drains tissues above the heart – and the inferior vena cava – which mainly drains tissues below the heart'), W(CIR, 'These two large veins empty into the right atrium of the heart.')],
      ],
      vista: { ver: ['aorta', 'cava-superior', 'cava-inferior'], contexto: ['ventriculo-izquierdo', 'atrio-derecho'], esqueleto: true, camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['aorta', 'cava-inferior'], texto: 'Alterna entre la aorta, que sale del corazón, y la vena cava inferior, que vuelve a él.' },
    },
    {
      id: 'vasos', tipo: 'explicacion', titulo: 'De arteria a vena',
      texto: [
        ['Las arterias se ramifican en arteriolas y estas en capilares; los capilares se reúnen en vénulas y las vénulas, en venas.', W(CIR, 'Arteries branch into small passages called arterioles and then into the capillaries.'), W(CIR, 'Capillaries merge into venules, which merge into veins.')],
        ['La regla general es que las arterias salen del corazón, se ramifican en capilares y estos se reúnen en venas que vuelven al corazón.', W(CIR, 'The general rule is that arteries from the heart branch out into capillaries, which collect into veins leading back to the heart.')],
        ['Los capilares no están en el modelo: son demasiado pequeños para verse a esta escala.', MODELO],
      ],
      detalle: [
        ['La excepción importante es la vena porta hepática: recoge la sangre de los capilares del tubo digestivo y se ramifica en un segundo sistema de capilares en el hígado, en vez de ir directa al corazón.', W(CIR, 'In humans, the only significant example is the hepatic portal vein which combines from capillaries around the gastrointestinal tract'), W(CIR, 'the hepatic portal vein branches into a second capillary system in the liver')],
      ],
      vista: { capas: { skeletal: 'all', arterial: 'all', venous: 'all' }, ver: [], contexto: [], camara: 'anterior', lado: 'R' },
      comprobar: 'rel-porta',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['Cuatro cavidades: atrios y ventrículos derecho e izquierdo.', W(CIR, 'there are four chambers in total: left atrium, left ventricle, right atrium and right ventricle')],
        ['Corazón derecho → pulmones → corazón izquierdo (circulación pulmonar); corazón izquierdo → aorta → cuerpo → venas cavas → corazón derecho (sistémica).', W(CIR, 'The pulmonary circulation is a circuit loop from the right heart taking deoxygenated blood to the lungs where it is oxygenated and returned to the left heart.'), W(CIR, 'returns deoxygenated blood back to the right heart via large veins known as the venae cavae')],
        ['Arterias → arteriolas → capilares → vénulas → venas.', W(CIR, 'Arteries branch into small passages called arterioles and then into the capillaries.'), W(CIR, 'Capillaries merge into venules, which merge into veins.')],
      ],
    },
  ],
  preguntas: [
    { id: 'id-vi', tipo: 'identificar', estructura: 'ventriculo-izquierdo', objetivo: 0, paso: 'cavidades' },
    { id: 'id-ad', tipo: 'identificar', estructura: 'atrio-derecho', objetivo: 0, paso: 'cavidades' },
    { id: 'id-aorta', tipo: 'identificar', estructura: 'aorta', objetivo: 3, paso: 'sistemica' },
    { id: 'id-cava-sup', tipo: 'identificar', estructura: 'cava-superior', objetivo: 3, paso: 'sistemica' },
    { id: 'loc-pulmonar', tipo: 'localizar', estructura: 'tronco-pulmonar', candidatas: ['aorta', 'cava-superior'], objetivo: 3, paso: 'pulmonar' },
    {
      id: 'pulmonar', tipo: 'relacion', objetivo: 1, paso: 'pulmonar',
      enunciado: '¿Desde qué cavidad sale la sangre hacia los pulmones?',
      correcta: 'Desde el ventrículo derecho', distractores: ['Desde el ventrículo izquierdo', 'Desde el atrio izquierdo', 'Desde el atrio derecho'],
      explicacion: 'Atrio derecho → ventrículo derecho → arteria pulmonar → pulmones.',
      evidencia: [W(CIR, 'into the right ventricle, from which it is then pumped through the pulmonary semilunar valve into the pulmonary artery to the lungs')],
    },
    {
      id: 'sistemica', tipo: 'relacion', objetivo: 1, paso: 'sistemica',
      enunciado: '¿Por qué vasos vuelve la sangre de la circulación sistémica al corazón?',
      correcta: 'Por las venas cavas superior e inferior, al atrio derecho', distractores: ['Por las venas pulmonares, al atrio izquierdo', 'Por la aorta, al ventrículo izquierdo', 'Por la arteria pulmonar, al ventrículo derecho'],
      explicacion: 'Las venas pulmonares traen la sangre oxigenada de los pulmones al lado izquierdo; las cavas, la del cuerpo al atrio derecho.',
      evidencia: [W(CIR, 'Deoxygenated blood is returned in the systemic circulation to the right heart via two large veins, the inferior vena cava and superior vena cava')],
    },
    {
      id: 'cava-inferior', tipo: 'relacion', objetivo: 1, paso: 'sistemica', estructuras: ['cava-inferior'],
      enunciado: '¿Qué drena sobre todo la vena cava inferior?',
      correcta: 'Los tejidos que están por debajo del corazón', distractores: ['Los tejidos que están por encima del corazón', 'Los pulmones', 'El propio músculo del corazón'],
      explicacion: 'La cava superior drena lo de arriba y la inferior, lo de abajo; las dos desembocan en el atrio derecho.',
      evidencia: [W(CIR, 'the inferior vena cava – which mainly drains tissues below the heart')],
    },
    {
      id: 'orden-vasos', tipo: 'secuencia', objetivo: 2, paso: 'vasos',
      enunciado: 'Ordena los vasos por los que pasa la sangre al salir del corazón.',
      orden: ['Arterias', 'Arteriolas', 'Capilares', 'Vénulas', 'Venas'],
      explicacion: 'Las arterias se ramifican en arteriolas y capilares; los capilares se reúnen en vénulas y estas, en venas.',
      evidencia: [W(CIR, 'Arteries branch into small passages called arterioles and then into the capillaries.'), W(CIR, 'Capillaries merge into venules, which merge into veins.')],
    },
    {
      id: 'rel-porta', tipo: 'relacion', objetivo: 1, paso: 'vasos', estructuras: [],
      enunciado: '¿Qué tiene de excepcional la vena porta hepática?',
      correcta: 'Lleva la sangre de los capilares del tubo digestivo a otros capilares, en el hígado',
      distractores: ['Lleva sangre oxigenada de los pulmones al corazón', 'Devuelve la sangre del cuerpo a la aurícula derecha', 'Sale del ventrículo derecho hacia los pulmones'],
      explicacion: 'La regla es arteria, capilares, vena y corazón; la porta une dos redes de capilares, la del tubo digestivo y la del hígado.',
      evidencia: [W(CIR, 'In humans, the only significant example is the hepatic portal vein which combines from capillaries around the gastrointestinal tract'), W(CIR, 'the hepatic portal vein branches into a second capillary system in the liver')],
    },
    {
      id: 'aorta-diafragma', tipo: 'relacion', objetivo: 3, paso: 'sistemica', estructuras: ['aorta'],
      enunciado: '¿A qué altura atraviesa la aorta el diafragma para entrar en el abdomen?',
      correcta: 'A la altura de la décima vértebra torácica', distractores: ['A la altura de la primera vértebra lumbar', 'A la altura de la cuarta vértebra torácica', 'A la altura del esternón'],
      explicacion: 'Pasa por el hiato aórtico del diafragma a la altura de T10 y sigue por el abdomen.',
      evidencia: [W(CIR, 'after passing through the aortic opening of the diaphragm at the level of thoracic ten vertebra, it enters the abdomen')],
    },
  ],
});
