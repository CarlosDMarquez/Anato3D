// Lección «El mediastino». Formato y evidencias: ../formato.js.
import { leccion, T, GUIA, MODELO } from '../formato.js';

const SUP = 'thorax/areas/superior-mediastinum';
const ANT = 'thorax/areas/anterior-mediastinum';
const MED = 'thorax/areas/middle-mediastinum';
const POS = 'thorax/areas/posterior-mediastinum';
const impar = (nombre, piezas, tipo) => ({ nombre, piezas, lado: 'impar', papel: 'nucleo', tipo });
const contexto = (nombre, piezas, tipo, lado = 'impar') => ({ nombre, piezas, lado, papel: 'contexto', tipo });

const RAMAS_CAYADO = ['tronco-braquiocefalico', 'carotida-izquierda', 'subclavia-izquierda'];
const VENAS = ['cava-superior', 'braquiocefalicas'];
const CORAZON = ['atrio-derecho', 'ventriculo-derecho', 'ventriculo-izquierdo', 'atrio-izquierdo'];
const PULMONES = ['pulmon-derecho', 'pulmon-izquierdo'];

export default leccion({
  id: 'tor-mediastino',
  version: 1,
  titulo: 'El mediastino',
  resumen: 'El compartimento central del tórax, entre las dos pleuras: cómo se divide (superior e inferior, y este en anterior, medio y posterior), qué hay en cada parte —los grandes vasos, el timo, la tráquea, el corazón, el esófago, la aorta torácica, la ácigos y los nervios— y cómo pasan por él las estructuras que van del cuello al abdomen.',
  lugares: [['torax', 'mediastino']],
  sistemas: ['cardiovascular', 'respiratorio', 'digestivo', 'nervioso', 'linfatico'],
  formato: 'topografia',
  temas: ['organos', 'arterias-venas'],
  nivel: 3,
  minutos: 18,
  requisitos: ['tor-corazon', 'tor-pulmones'],
  siguiente: ['tor-respiracion', 'abd-tubo-digestivo', 'cue-visceras'],
  objetivos: [
    'Describir los límites del mediastino y cómo se divide.',
    'Enumerar el contenido del mediastino superior, empezando por los grandes vasos.',
    'Relacionar el corazón, el timo y los bronquios con su parte del mediastino.',
    'Localizar las estructuras del mediastino posterior.',
  ],
  estructuras: {
    cayado: impar('Arco aórtico (cayado de la aorta)', ['Aortic_arch'], 'arteria'),
    'aorta-ascendente': impar('Aorta ascendente', ['Ascending_aorta'], 'arteria'),
    'aorta-toracica': impar('Aorta torácica', ['Thoracic_aorta'], 'arteria'),
    'tronco-braquiocefalico': impar('Tronco braquiocefálico', ['Brachiocephalic_trunk'], 'arteria'),
    'carotida-izquierda': impar('Arteria carótida común izquierda', ['Left_common_carotid_artery'], 'arteria'),
    'subclavia-izquierda': impar('Arteria subclavia izquierda', ['Left_subclavian_artery'], 'arteria'),
    'cava-superior': impar('Vena cava superior', ['Superior_vena_cava'], 'vena'),
    braquiocefalicas: impar('Venas braquiocefálicas', ['Right_brachiocephalic_vein', 'Left_brachiocephalic_vein'], 'vena'),
    acigos: impar('Vena ácigos', ['Azygos_vein'], 'vena'),
    timo: impar('Timo', ['Left_lobe_of_thymus', 'Right_lobe_of_thymus'], 'organo'),
    traquea: impar('Tráquea', ['Trachea'], 'organo'),
    esofago: impar('Esófago', ['Oesophagus'], 'organo'),
    vago: { nombre: 'Nervios vagos', piezas: ['Vagus_nerve_X'], lado: 'ambos', papel: 'nucleo', tipo: 'nervio' },
    'tronco-simpatico': { nombre: 'Troncos simpáticos', piezas: ['Sympathetic_trunk'], lado: 'ambos', papel: 'nucleo', tipo: 'nervio' },
    'atrio-derecho': contexto('Atrio derecho', ['Right_atrium'], 'corazon'),
    'ventriculo-derecho': contexto('Ventrículo derecho', ['Right_ventricle'], 'corazon'),
    'ventriculo-izquierdo': contexto('Ventrículo izquierdo', ['Left_ventricle'], 'corazon'),
    'atrio-izquierdo': contexto('Atrio izquierdo', ['Left_atrium'], 'corazon'),
    bronquios: contexto('Bronquios principales', ['Right_main_bronchus', 'Left_main_bronchus'], 'organo'),
    'tronco-pulmonar': contexto('Tronco pulmonar', ['Pulmonary_trunk'], 'arteria'),
    'pulmon-derecho': contexto('Pulmón derecho', ['Superior_lobe_of_right_lung', 'Middle_lobe_of_right_lung', 'Inferior_lobe_of_right_lung'], 'organo'),
    'pulmon-izquierdo': contexto('Pulmón izquierdo', ['Superior_lobe_of_left_lung', 'Inferior_lobe_of_left_lung'], 'organo'),
    diafragma: contexto('Diafragma', ['Diaphragm'], 'musculo'),
    esternon: contexto('Esternón', ['Sternum_Manubrium', 'Sternum_Body'], 'hueso'),
    toracicas: contexto('Vértebras torácicas', ['Vertebra_T1', 'Vertebra_T2', 'Vertebra_T3', 'Vertebra_T4', 'Vertebra_T5', 'Vertebra_T6', 'Vertebra_T7', 'Vertebra_T8', 'Vertebra_T9', 'Vertebra_T10', 'Vertebra_T11', 'Vertebra_T12'], 'hueso'),
  },
  pasos: [
    {
      id: 'orientacion', tipo: 'orientacion', titulo: 'El centro del tórax',
      texto: [
        ['El mediastino es el compartimento central del tórax, entre los dos sacos pleurales: contiene casi todos sus órganos y es el paso hacia el abdomen.', T(SUP, 'The mediastinum is the central compartment of the thoracic cavity, located between the two pleural sacs. It contains most of the thoracic organs, and acts as a conduit for structures traversing the thorax on their way into the abdomen.')],
        ['Una línea imaginaria del ángulo esternal a T4 lo divide en superior e inferior; el inferior se subdivide en anterior, medio y posterior.', T(SUP, 'Anatomically, the mediastinum is divided into two parts by an imaginary line that runs from the sternal angle'), T(SUP, 'It is further subdivided into the anterior mediastinum, middle mediastinum and posterior mediastinum.')],
        ['Míralo de frente con los pulmones translúcidos.', GUIA],
      ],
      vista: { ver: ['cayado', 'cava-superior', 'traquea', 'esofago', 'timo'], contexto: [...CORAZON, 'aorta-toracica', 'esternon'], fantasma: PULMONES, camara: 'anterior' },
      actividad: { tipo: 'vistas', texto: 'Recorre el mediastino.', vistas: [{ nombre: 'De frente', camara: 'anterior' }, { nombre: 'Por la derecha', camara: 'lateral' }, { nombre: 'Por detrás', camara: 'posterior' }] },
      comprobar: 'rel-division',
    },
    {
      id: 'superior', tipo: 'exploracion', titulo: 'El mediastino superior',
      texto: [
        ['El mediastino superior queda detrás del manubrio y delante de las vértebras T1 a T4.', T(SUP, 'Anterior – Manubrium of the sternum.'), T(SUP, 'Posterior – Vertebral bodies of T1-4.')],
        ['Del cayado de la aorta salen tres ramas: el tronco braquiocefálico, la carótida común izquierda y la subclavia izquierda.', T(SUP, 'The three major branches of the aortic arch arise within the superior mediastinum:'), T(SUP, 'Left common carotid artery – to the left side of the head & neck.'), T(SUP, 'Left subclavian artery – to the left upper limb.')],
        ['Ahí están también la vena cava superior con las braquiocefálicas y, por delante de todo, el timo.', T(SUP, 'Brachiocephalic veins – draining blood from the upper body.'), T(SUP, 'The thymus gland is the most anterior structure within the superior mediastinum.')],
      ],
      vista: { ver: ['cayado', ...RAMAS_CAYADO, ...VENAS], contexto: ['traquea', 'timo', 'aorta-ascendente', 'esternon'], fantasma: PULMONES, camara: 'anterior' },
      actividad: { tipo: 'comparar', estructuras: RAMAS_CAYADO, texto: 'Alterna las tres ramas del cayado, de derecha a izquierda.' },
      comprobar: 'rel-ramas-cayado',
    },
    {
      id: 'nervios', tipo: 'relaciones', titulo: 'Nervios que cruzan',
      texto: [
        ['El vago derecho baja junto a la tráquea, por detrás de la cava superior y del bronquio derecho; el izquierdo entra entre la carótida común y la subclavia izquierdas.', T(SUP, 'Right vagus nerve – runs parallel to the trachea and passes posteriorly to the superior vena cava and the right primary bronchus.'), T(SUP, 'Left vagus nerve (Fig 3) – enters the superior mediastinum between the left common carotid and the left subclavian arteries.')],
        ['Del vago izquierdo sale el laríngeo recurrente, que pasa bajo el cayado y sube hacia la laringe.', T(SUP, 'The left recurrent laryngeal nerve arises from the left vagus nerve as it passes the aortic arch.'), T(SUP, 'It loops under the arch')],
        ['Los frénicos (C3 a C5) entran por fuera de los grandes vasos.', T(SUP, 'the phrenic nerves (roots C3, C4 and C5) enter the superior mediastinum lateral to the great vessels.')],
      ],
      detalle: [
        ['El modelo no tiene los nervios frénicos ni los laríngeos recurrentes como piezas propias, ni el conducto torácico.', MODELO],
      ],
      vista: { ver: ['vago'], contexto: ['cayado', 'carotida-izquierda', 'subclavia-izquierda', 'cava-superior', 'traquea'], camara: 'anterolateral', lado: 'L' },
      actividad: { tipo: 'vistas', texto: 'Sigue el vago a cada lado.', vistas: [{ nombre: 'Lado izquierdo', camara: 'lateral' }, { nombre: 'De frente', camara: 'anterior' }] },
      comprobar: 'rel-vago-izquierdo',
    },
    {
      id: 'inferior', tipo: 'explicacion', titulo: 'Anterior y medio',
      texto: [
        ['El mediastino anterior, entre el esternón y el pericardio, no tiene estructuras grandes; en niños el timo baja hasta él, pero en la pubertad se reduce y se llena de grasa.', T(ANT, 'The anterior mediastinum contains no major structures.'), T(ANT, 'In infants and children, the thymus extends inferiorly into the anterior mediastinum. However the thymus recedes during puberty and is mostly replaced by adipose tissue in the adult.')],
        ['El medio, el más grande, contiene el corazón y el pericardio, la bifurcación de la tráquea y los bronquios principales.', T(MED, 'The middle mediastinum is the largest subdivision of the inferior mediastinum.'), T(MED, 'The middle mediastinum contains the heart, and its protective sheath, the pericardium. It also contains the tracheal bifurcation and the left and right main bronchi.')],
      ],
      vista: { ver: ['timo', ...CORAZON], contexto: ['bronquios', 'traquea', 'tronco-pulmonar', 'esternon'], fantasma: PULMONES, camara: 'anterior' },
      actividad: { tipo: 'localizar', estructura: 'timo', texto: 'Toca el órgano más anterior del mediastino superior.' },
      comprobar: 'rel-medio',
    },
    {
      id: 'posterior', tipo: 'exploracion', titulo: 'El mediastino posterior',
      texto: [
        ['La aorta torácica continúa el cayado desde T4 y baja por la izquierda de las vértebras hasta el diafragma.', T(POS, 'The thoracic (descending) aorta is a continuation of the arch of the aorta, beginning at the lower edge of the T4 vertebra. It descends through the posterior mediastinum to the left of the vertebrae')],
        ['El esófago une la faringe con el estómago; empieza a la derecha y se desvía a la izquierda al bajar, rodeado por el plexo de los vagos.', T(POS, 'The oesophagus is a muscular tube that connects the pharynx to the stomach'), T(POS, 'Whilst initially positioned to the right, the oesophagus deviates to the left as it moves downwards.'), T(POS, 'The oesophageal plexus is a network of nerves surrounding the oesophagus as it descends, comprising of branches from the left and right vagus nerves.')],
        ['Ahí están también el conducto torácico, la vena ácigos y los troncos simpáticos, que van de la base del cráneo al cóccix.', T(POS, 'including the thoracic aorta, oesophagus, thoracic duct, azygos system of veins, and sympathetic trunks.'), T(POS, 'The sympathetic trunks are paired bundles of nerves that extend from the base of the skull to the coccyx.')],
      ],
      vista: { ver: ['aorta-toracica', 'esofago', 'acigos', 'tronco-simpatico'], contexto: ['toracicas', 'diafragma', 'vago'], camara: 'lateral', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['aorta-toracica', 'esofago', 'acigos'], texto: 'Alterna: la aorta a la izquierda de la columna, el esófago delante y la ácigos a la derecha.' },
      comprobar: 'rel-esofago',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['Superior (hasta el ángulo esternal y T4): cayado y sus ramas, cava superior, timo, tráquea y esófago.', T(SUP, 'The three major branches of the aortic arch arise within the superior mediastinum:')],
        ['Inferior: anterior (casi vacío), medio (corazón y bronquios) y posterior (aorta torácica, esófago, ácigos).', T(ANT, 'The anterior mediastinum contains no major structures.'), T(MED, 'The middle mediastinum contains the heart'), T(POS, 'The posterior mediastinum contains a number of major organs, blood vessels and nerves.')],
      ],
    },
  ],
  preguntas: [
    {
      id: 'rel-division', tipo: 'relacion', objetivo: 0, paso: 'orientacion', estructuras: ['cayado'],
      enunciado: '¿Qué línea separa el mediastino superior del inferior?',
      correcta: 'La que va del ángulo esternal a la vértebra T4',
      distractores: ['La que va de la clavícula a C7', 'El diafragma', 'La que va del xifoides a T12'],
      explicacion: 'El diafragma es el suelo del mediastino inferior.',
      evidencia: [T(SUP, 'Anatomically, the mediastinum is divided into two parts by an imaginary line that runs from the sternal angle')],
    },
    {
      id: 'sec-cayado', tipo: 'secuencia', objetivo: 1, paso: 'superior',
      enunciado: 'Ordena las ramas del cayado de la aorta de derecha a izquierda.',
      orden: ['Tronco braquiocefálico', 'Carótida común izquierda', 'Subclavia izquierda'],
      explicacion: 'El tronco braquiocefálico va al lado derecho; las otras dos, al izquierdo.',
      evidencia: [T(SUP, 'Brachiocephalic artery – supplying the right side of the head & neck and the right upper limb.'), T(SUP, 'Left common carotid artery – to the left side of the head & neck.'), T(SUP, 'Left subclavian artery – to the left upper limb.')],
    },
    {
      id: 'rel-ramas-cayado', tipo: 'relacion', objetivo: 1, paso: 'superior', estructuras: RAMAS_CAYADO,
      enunciado: '¿Qué irriga el tronco braquiocefálico?',
      correcta: 'El lado derecho de la cabeza y el cuello y el miembro superior derecho',
      distractores: ['El lado izquierdo de la cabeza y el cuello', 'El miembro superior izquierdo', 'El corazón'],
      explicacion: 'En el lado izquierdo, la carótida común y la subclavia salen directamente del cayado.',
      evidencia: [T(SUP, 'Brachiocephalic artery – supplying the right side of the head & neck and the right upper limb.')],
    },
    { id: 'id-cayado', tipo: 'identificar', estructura: 'cayado', objetivo: 1, paso: 'superior' },
    { id: 'id-cava-superior', tipo: 'identificar', estructura: 'cava-superior', objetivo: 1, paso: 'superior' },
    {
      id: 'rel-vago-izquierdo', tipo: 'relacion', objetivo: 1, paso: 'nervios', estructuras: ['vago', 'cayado'],
      enunciado: '¿Qué nervio sale del vago izquierdo y pasa por debajo del cayado de la aorta?',
      correcta: 'El laríngeo recurrente izquierdo',
      distractores: ['El frénico izquierdo', 'El tronco simpático', 'El nervio intercostal'],
      explicacion: 'Rodea el cayado y sube hacia la laringe por el surco entre la tráquea y el esófago.',
      evidencia: [T(SUP, 'The left recurrent laryngeal nerve arises from the left vagus nerve as it passes the aortic arch.')],
    },
    {
      id: 'rel-medio', tipo: 'relacion', objetivo: 2, paso: 'inferior', estructuras: CORAZON,
      enunciado: '¿En qué parte del mediastino está el corazón?',
      correcta: 'En el medio',
      distractores: ['En el superior', 'En el anterior', 'En el posterior'],
      explicacion: 'El medio es el más grande del mediastino inferior y contiene el corazón, el pericardio y los bronquios principales.',
      evidencia: [T(MED, 'The middle mediastinum contains the heart, and its protective sheath, the pericardium.')],
    },
    {
      id: 'rel-timo', tipo: 'relacion', objetivo: 2, paso: 'inferior', estructuras: ['timo'],
      enunciado: '¿Qué le pasa al timo después de la pubertad?',
      correcta: 'Se reduce y la grasa lo sustituye en gran parte',
      distractores: ['Crece hasta llenar el mediastino anterior', 'Se convierte en ganglio linfático', 'Baja al abdomen'],
      explicacion: 'En niños llega hasta el mediastino anterior; en el adulto queda sobre todo grasa.',
      evidencia: [T(ANT, 'However the thymus recedes during puberty and is mostly replaced by adipose tissue in the adult.')],
    },
    { id: 'id-timo', tipo: 'identificar', estructura: 'timo', objetivo: 2, paso: 'inferior' },
    {
      id: 'rel-esofago', tipo: 'relacion', objetivo: 3, paso: 'posterior', estructuras: ['esofago'],
      enunciado: '¿Hacia dónde se desvía el esófago al bajar por el mediastino posterior?',
      correcta: 'Hacia la izquierda',
      distractores: ['Hacia la derecha', 'Hacia delante, por delante del corazón', 'No se desvía'],
      explicacion: 'Empieza a la derecha y se va a la izquierda antes de cruzar el diafragma.',
      evidencia: [T(POS, 'Whilst initially positioned to the right, the oesophagus deviates to the left as it moves downwards.')],
    },
    { id: 'id-aorta-toracica', tipo: 'identificar', estructura: 'aorta-toracica', objetivo: 3, paso: 'posterior' },
    { id: 'id-acigos', tipo: 'identificar', estructura: 'acigos', objetivo: 3, paso: 'posterior' },
  ],
});
