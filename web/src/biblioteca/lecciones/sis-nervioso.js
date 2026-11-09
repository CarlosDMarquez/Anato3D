// Lección «Organización del sistema nervioso». Formato y evidencias: ../formato.js.
import { leccion, W, GUIA, MODELO } from '../formato.js';

const SN = 'Nervous_system';
const SNC = 'Central_nervous_system';
const SNP = 'Peripheral_nervous_system';
const SNA = 'Autonomic_nervous_system';
const N = (nombre, piezas, tipo, lado = 'bilateral', papel = 'nucleo') => ({ nombre, piezas, lado, papel, tipo });

export default leccion({
  id: 'sis-nervioso',
  version: 1,
  titulo: 'Organización del sistema nervioso',
  resumen: 'Las dos grandes partes del sistema nervioso (central y periférico), qué las protege, cómo se llaman los nervios según de dónde salen y la división del sistema periférico en somático y autónomo, con el simpático y el parasimpático.',
  lugares: [],
  sistemas: ['nervioso'],
  formato: 'vision-general',
  temas: ['nervios'],
  nivel: 1,
  minutos: 11,
  requisitos: ['fund-orientacion'],
  siguiente: ['cab-encefalo', 'esp-medula', 'cab-nervios-craneales'],
  objetivos: [
    'Distinguir el sistema nervioso central del periférico y decir qué forma cada uno.',
    'Describir qué protege al encéfalo y a la médula espinal.',
    'Diferenciar los nervios craneales de los espinales y los motores de los sensitivos.',
    'Explicar qué controla el sistema autónomo y en qué se diferencian el simpático y el parasimpático.',
  ],
  estructuras: {
    'medula-blanca': N('Sustancia blanca de la médula espinal', ['White_matter_of_spinal_cord'], 'snc', 'impar'),
    'dura-espinal': N('Duramadre espinal', ['Spinal_dura'], 'snc', 'impar', 'contexto'),
    ciatico: { ...N('Nervio ciático', ['Sciatic_nerve'], 'nervio'), confusiones: ['Nervio femoral', 'Nervio tibial'] },
    vago: N('Nervio vago (X)', ['Vagus_nerve_X'], 'nervio'),
    simpatico: { ...N('Tronco simpático', ['Sympathetic_trunk'], 'nervio'), confusiones: ['Nervio frénico', 'Nervios intercostales'] },
    'ganglios-simpaticos': N('Ganglios del tronco simpático', ['Ganglia_of_sympathetic_trunk'], 'ganglio', 'bilateral', 'contexto'),
    'ganglio-espinal': N('Ganglio espinal', ['Spinal_ganglion'], 'ganglio', 'bilateral', 'contexto'),
  },
  pasos: [
    {
      id: 'dos-partes', tipo: 'orientacion', titulo: 'Central y periférico',
      texto: [
        ['El sistema nervioso tiene dos partes principales: el sistema nervioso central (SNC) y el periférico (SNP).', W(SN, 'it consists of two main parts, the central nervous system (CNS) and the peripheral nervous system (PNS)')],
        ['El central lo forman el encéfalo y la médula espinal.', W(SN, 'The CNS consists of the brain and spinal cord.')],
        ['El periférico lo forman sobre todo los nervios, haces de fibras largas (axones) que conectan el central con todas las demás partes del cuerpo.', W(SN, 'The PNS consists mainly of nerves, which are enclosed bundles of long fibers, or axons, that connect the CNS to every other part of the body.')],
        ['Primero ves el sistema central; después, todo el sistema nervioso del modelo.', GUIA],
      ],
      vista: { capas: { skeletal: 'all', nervous: 'cns' }, ver: [], contexto: [], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'Gira para ver el encéfalo y la médula desde atrás.', vistas: [{ nombre: 'De frente', camara: 'anterior' }, { nombre: 'Desde atrás', camara: 'posterior' }, { nombre: 'De lado', camara: 'lateral' }] },
    },
    {
      id: 'proteccion', tipo: 'explicacion', titulo: 'Lo que protege al sistema central',
      texto: [
        ['El encéfalo está en la cavidad craneal, dentro del cráneo, y la médula espinal, en el conducto vertebral, dentro de las vértebras.', W(SNC, 'the brain is housed in the cranial cavity within the skull'), W(SNC, 'The spinal cord is housed in the spinal canal within the vertebrae.')],
        ['Los dos están envueltos por las meninges y bañados en líquido cefalorraquídeo.', W(SNC, 'In vertebrates, the brain and spinal cord are both enclosed in the meninges.'), W(SNC, 'Within the meninges the brain and spinal cord are bathed in cerebral spinal fluid')],
        ['En el modelo, la duramadre espinal, la meninge más externa de la médula, se ve translúcida alrededor de la médula.', MODELO],
      ],
      vista: { ver: ['medula-blanca'], contexto: [], fantasma: ['dura-espinal'], esqueleto: true, camara: 'posterior', lado: 'R' },
    },
    {
      id: 'nervios', tipo: 'explicacion', titulo: 'Craneales y espinales; motores y sensitivos',
      texto: [
        ['Los nervios que salen del encéfalo son los nervios craneales y los que salen de la médula espinal, los nervios espinales.', W(SN, 'Nerves that exit from the brain are called cranial nerves while those exiting from the spinal cord are called spinal nerves.')],
        ['Los nervios motores (eferentes) llevan señales desde el encéfalo; los sensitivos (aferentes) llevan información del cuerpo al sistema central.', W(SN, 'Nerves that transmit signals from the brain are called motor nerves (efferent), while those nerves that transmit information from the body to the CNS are called sensory nerves (afferent).')],
        ['El sistema periférico también tiene ganglios, fuera del encéfalo y de la médula.', W(SNP, 'The PNS consists of nerves and ganglia, which lie outside the brain and the spinal cord.')],
        ['El nervio vago es un nervio craneal y el ciático, un nervio del miembro inferior que procede de la médula.', GUIA],
      ],
      vista: { capas: { skeletal: 'all', nervous: 'pns' }, ver: ['vago', 'ciatico'], contexto: [], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['vago', 'ciatico'], texto: 'Compara un nervio craneal (el vago) con un nervio que nace de la médula (el ciático).' },
      comprobar: 'craneales',
    },
    {
      id: 'somatico-autonomo', tipo: 'explicacion', titulo: 'Somático y autónomo',
      texto: [
        ['El sistema periférico se divide en una parte somática y otra autónoma.', W(SNP, 'The peripheral nervous system can be divided into a somatic division and an autonomic division.')],
        ['El sistema autónomo controla de forma involuntaria el músculo liso y las glándulas.', W(SNP, 'The autonomic nervous system exerts involuntary control over smooth muscle and glands.')],
        ['Se divide clásicamente en simpático, parasimpático y entérico.', W(SNA, 'The autonomic nervous system has been classically divided into the sympathetic, parasympathetic and enteric nervous systems.')],
      ],
      vista: { ver: ['simpatico'], contexto: ['ganglios-simpaticos'], esqueleto: true, camara: 'anterolateral', lado: 'R' },
    },
    {
      id: 'simpatico', tipo: 'funcion', titulo: 'Simpático y parasimpático',
      texto: [
        ['El simpático se asocia a la respuesta de lucha o huida y el parasimpático, a la de «descanso y digestión».', W(SNA, 'the parasympathetic nervous system and the sympathetic nervous system, which are responsible for, among other things, stimulation of the "rest and digest" and the fight-or-flight response (or "acute stress response"), respectively')],
        ['El simpático sale de la médula en las regiones torácica y lumbar; el parasimpático, de los nervios craneales y de la médula sacra.', W(SNA, 'The sympathetic division emerges from the spinal cord in the thoracic and lumbar areas, terminating around L2-3.'), W(SNA, 'The parasympathetic division has craniosacral "outflow", meaning that the neurons begin at the cranial nerves (specifically the oculomotor nerve, facial nerve, glossopharyngeal nerve and vagus nerve) and sacral (S2-S4) spinal cord.')],
        ['En muchos casos sus acciones se complementan: uno activa una respuesta y el otro la frena.', W(SNA, 'in many cases, the two of these systems have complementary actions where one system activates a physiological response and the other inhibits it')],
      ],
      vista: { ver: ['simpatico', 'vago'], contexto: ['ganglios-simpaticos'], esqueleto: true, camara: 'anterior', lado: 'R' },
      comprobar: 'parasimpatico',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['Central: encéfalo y médula espinal, en el cráneo y en el conducto vertebral, envueltos por las meninges.', W(SN, 'The CNS consists of the brain and spinal cord.'), W(SNC, 'In vertebrates, the brain and spinal cord are both enclosed in the meninges.')],
        ['Periférico: nervios craneales y espinales, motores y sensitivos, y ganglios.', W(SN, 'Nerves that exit from the brain are called cranial nerves while those exiting from the spinal cord are called spinal nerves.'), W(SNP, 'The PNS consists of nerves and ganglia')],
        ['Autónomo: control involuntario del músculo liso y las glándulas, con el simpático (lucha o huida) y el parasimpático (descanso y digestión).', W(SNP, 'The autonomic nervous system exerts involuntary control over smooth muscle and glands.'), W(SNA, 'stimulation of the "rest and digest" and the fight-or-flight response')],
      ],
    },
  ],
  preguntas: [
    { id: 'id-simpatico', tipo: 'identificar', estructura: 'simpatico', objetivo: 3, paso: 'somatico-autonomo' },
    { id: 'id-ciatico', tipo: 'identificar', estructura: 'ciatico', objetivo: 2, paso: 'nervios' },
    {
      id: 'snc', tipo: 'relacion', objetivo: 0, paso: 'dos-partes',
      enunciado: '¿Qué forma el sistema nervioso central?',
      correcta: 'El encéfalo y la médula espinal', distractores: ['El encéfalo y los nervios craneales', 'La médula espinal y los nervios espinales', 'Los nervios y los ganglios'],
      explicacion: 'Los nervios y los ganglios forman el sistema periférico.',
      evidencia: [W(SN, 'The CNS consists of the brain and spinal cord.')],
    },
    {
      id: 'snp', tipo: 'relacion', objetivo: 0, paso: 'dos-partes',
      enunciado: '¿Qué conecta el sistema nervioso periférico?',
      correcta: 'El sistema central con las demás partes del cuerpo', distractores: ['El encéfalo con la médula espinal', 'Los dos hemisferios del encéfalo', 'Los músculos entre sí'],
      explicacion: 'Sus nervios llevan las señales entre el encéfalo y la médula y el resto del cuerpo.',
      evidencia: [W(SN, 'connect the CNS to every other part of the body')],
    },
    {
      id: 'meninges', tipo: 'relacion', objetivo: 1, paso: 'proteccion',
      enunciado: '¿Qué envuelve al encéfalo y a la médula espinal?',
      correcta: 'Las meninges, con líquido cefalorraquídeo', distractores: ['El periostio', 'La pleura', 'Una cápsula articular'],
      explicacion: 'Las meninges envuelven el sistema central, que está bañado en líquido cefalorraquídeo.',
      evidencia: [W(SNC, 'In vertebrates, the brain and spinal cord are both enclosed in the meninges.')],
    },
    {
      id: 'conducto', tipo: 'relacion', objetivo: 1, paso: 'proteccion', estructuras: ['medula-blanca'],
      enunciado: '¿Dónde está alojada la médula espinal?',
      correcta: 'En el conducto vertebral, dentro de las vértebras', distractores: ['En la cavidad craneal', 'Delante de los cuerpos vertebrales', 'Entre las costillas'],
      explicacion: 'El encéfalo está en la cavidad craneal y la médula, en el conducto vertebral.',
      evidencia: [W(SNC, 'The spinal cord is housed in the spinal canal within the vertebrae.')],
    },
    {
      id: 'craneales', tipo: 'relacion', objetivo: 2, paso: 'nervios', estructuras: ['vago'],
      enunciado: 'Los nervios que salen directamente del encéfalo se llaman…',
      correcta: 'nervios craneales', distractores: ['nervios espinales', 'nervios autónomos', 'ganglios'],
      explicacion: 'Del encéfalo salen los craneales; de la médula espinal, los espinales.',
      evidencia: [W(SN, 'Nerves that exit from the brain are called cranial nerves')],
    },
    {
      id: 'aferentes', tipo: 'relacion', objetivo: 2, paso: 'nervios',
      enunciado: 'Los nervios que llevan información del cuerpo al sistema nervioso central son…',
      correcta: 'sensitivos (aferentes)', distractores: ['motores (eferentes)', 'autónomos', 'craneales'],
      explicacion: 'Aferentes, hacia el sistema central; eferentes, desde él.',
      evidencia: [W(SN, 'those nerves that transmit information from the body to the CNS are called sensory nerves (afferent)')],
    },
    {
      id: 'autonomo', tipo: 'funcion', objetivo: 3, paso: 'somatico-autonomo',
      enunciado: '¿Qué controla el sistema nervioso autónomo?',
      correcta: 'De forma involuntaria, el músculo liso y las glándulas', distractores: ['De forma voluntaria, los músculos esqueléticos', 'Solo los movimientos de los ojos', 'La sensibilidad de la piel'],
      explicacion: 'Su control es involuntario; el somático permite el control voluntario.',
      evidencia: [W(SNP, 'The autonomic nervous system exerts involuntary control over smooth muscle and glands.')],
    },
    {
      id: 'parasimpatico', tipo: 'funcion', objetivo: 3, paso: 'simpatico',
      enunciado: '¿Qué respuesta se asocia al sistema parasimpático?',
      correcta: 'La de «descanso y digestión»', distractores: ['La de lucha o huida', 'El movimiento voluntario', 'La respuesta al dolor agudo'],
      explicacion: 'Parasimpático: descanso y digestión. Simpático: lucha o huida.',
      evidencia: [W(SNA, 'stimulation of the "rest and digest" and the fight-or-flight response (or "acute stress response"), respectively')],
    },
  ],
});
