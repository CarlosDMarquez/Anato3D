// Lección «El esqueleto: axial y apendicular». Formato y evidencias: ../formato.js.
import { leccion, W, MODELO } from '../formato.js';

const ESQ = 'Human_skeleton';
const hueso = (nombre, piezas, lado = 'bilateral', papel = 'nucleo') => ({ nombre, piezas, lado, papel, tipo: 'hueso' });
const CARPO = ['Scaphoid', 'Lunate', 'Triquetrum', 'Pisiform', 'Trapezium', 'Trapezoid', 'Capitate', 'Hamate'];

export default leccion({
  id: 'sis-oseo',
  version: 1,
  titulo: 'El esqueleto: axial y apendicular',
  resumen: 'Cuántos huesos tiene el adulto, cómo se divide el esqueleto en axial y apendicular, los cinco tipos de hueso según su forma y para qué sirve el esqueleto.',
  lugares: [],
  sistemas: ['oseo'],
  formato: 'vision-general',
  temas: ['huesos'],
  nivel: 1,
  minutos: 10,
  requisitos: ['fund-orientacion'],
  siguiente: ['sis-articular', 'esp-columna', 'ms-cintura-escapular'],
  objetivos: [
    'Distinguir en el modelo el esqueleto axial del apendicular y decir qué huesos forman cada uno.',
    'Clasificar un hueso como largo, corto, plano, irregular o sesamoideo y dar un ejemplo de cada tipo.',
    'Enumerar las funciones principales del esqueleto.',
  ],
  estructuras: {
    femur: hueso('Fémur', ['Femur']),
    humero: hueso('Húmero', ['Humerus']),
    carpo: hueso('Huesos del carpo', CARPO, 'bilateral', 'contexto'),
    parietal: hueso('Hueso parietal', ['Parietal_Bone']),
    esternon: hueso('Esternón', ['Sternum_Manubrium', 'Sternum_Body', 'Sternum_Xiphoid_Process'], 'impar'),
    vertebra: hueso('Vértebra lumbar (L3)', ['Vertebra_L3'], 'impar', 'contexto'),
    coxal: hueso('Hueso coxal', ['Hip_Bone']),
    rotula: hueso('Rótula', ['Patella']),
    pisiforme: hueso('Pisiforme', ['Pisiform'], 'bilateral', 'contexto'),
  },
  pasos: [
    {
      id: 'cuantos', tipo: 'orientacion', titulo: 'Unos 206 huesos',
      texto: [
        ['Al nacer hay unos 270 huesos; algunos se fusionan y en el adulto quedan unos 206, sin contar los huesos accesorios.', W(ESQ, 'It is composed of around 270 bones at birth – this total decreases to around 206 bones by adulthood after some bones fuse together, not counting accessory bones.')],
        ['El esqueleto se divide en dos partes: el esqueleto axial y el apendicular.', W(ESQ, 'The human skeleton can be divided into the axial skeleton and the appendicular skeleton.')],
        ['El modelo muestra los huesos del adulto; los dientes y los cartílagos costales también están, como piezas aparte.', MODELO],
      ],
      vista: { capas: { skeletal: 'all' }, ver: [], contexto: [], camara: 'anterior', lado: 'R' },
    },
    {
      id: 'axial', tipo: 'explicacion', titulo: 'El esqueleto axial',
      texto: [
        ['El esqueleto axial lo forman la columna vertebral, la caja torácica, el cráneo y los huesos asociados.', W(ESQ, 'The axial skeleton is formed by the spinal column, the rib cage, the skull, and associated bones.')],
        ['Son unos 80 huesos: el cráneo (con la mandíbula y los huesecillos del oído), la columna (vértebras, sacro y cóccix), la caja torácica (costillas y esternón) y el hueso hioides.', W('Axial_skeleton', 'it consists of 80 bones and is composed of the skull (28 bones, including the cranium, mandible and the middle ear ossicles), the vertebral column (26 bones, including vertebrae, sacrum and coccyx), the rib cage (25 bones, including ribs and sternum), and the hyoid bone')],
        ['Mantiene la postura erguida y transmite el peso de la cabeza, el tronco y los miembros superiores hasta los miembros inferiores, en las caderas.', W(ESQ, 'The upright posture of humans is maintained by the axial skeleton, which transmits the weight from the head, the trunk, and the upper extremities down to the lower extremities at the hip joints.')],
      ],
      vista: { capas: { skeletal: 'axial' }, ver: [], contexto: [], camara: 'anterolateral', lado: 'R' },
    },
    {
      id: 'apendicular', tipo: 'explicacion', titulo: 'El esqueleto apendicular',
      texto: [
        ['El esqueleto apendicular, unido al axial, lo forman la cintura escapular, la cintura pélvica y los huesos de los miembros superiores e inferiores: 126 huesos.', W(ESQ, 'The appendicular skeleton, which is attached to the axial skeleton, is formed by the shoulder girdle, the pelvic girdle and the bones of the upper and lower limbs.'), W('Appendicular_skeleton', 'Of the 206 bones in the human skeleton, the appendicular skeleton comprises 126.')],
        ['La cintura escapular son las dos clavículas y las dos escápulas.', W('Appendicular_skeleton', 'Shoulder girdle (4 bones) – Left and right clavicle (×2) and scapula (×2).')],
        ['Los miembros inferiores sirven para desplazarse y cargar el peso; los superiores, para agarrar y manipular objetos.', W('Appendicular_skeleton', 'Functionally, it is involved in terrestrial locomotion and weight-bearing (lower limbs), and grasping and object manipulation (upper limbs).')],
      ],
      vista: { capas: { skeletal: 'appendicular' }, ver: [], contexto: [], camara: 'anterior', lado: 'R' },
      comprobar: 'cintura-escapular',
    },
    {
      id: 'largos-cortos', tipo: 'exploracion', titulo: 'Huesos largos y cortos',
      texto: [
        ['Hay cinco tipos de hueso según su forma: largos, cortos, planos, irregulares y sesamoideos.', W('Bone', 'Five types of bones are found in the human body: long, short, flat, irregular, and sesamoid.')],
        ['Los largos tienen una diáfisis mucho más larga que ancha y una epífisis redondeada en cada extremo; la mayoría de los huesos de los miembros lo son.', W('Bone', 'Long bones are characterized by a shaft, the diaphysis, that is much longer than its width; and by an epiphysis, a rounded head at each end of the shaft.'), W('Bone', 'Most bones of the limbs, including those of the fingers and toes, are long bones.')],
        ['Los cortos tienen forma más o menos de cubo: son los de la muñeca y el tobillo.', W('Bone', 'Short bones are roughly cube-shaped'), W('Bone', 'The bones of the wrist and ankle are short bones.')],
      ],
      vista: { ver: ['femur', 'humero'], contexto: ['carpo'], esqueleto: true, camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['humero', 'carpo'], texto: 'Compara un hueso largo, el húmero, con los huesos cortos del carpo.' },
    },
    {
      id: 'planos-irregulares', tipo: 'exploracion', titulo: 'Planos, irregulares y sesamoideos',
      texto: [
        ['Los planos son finos y suelen estar curvados; lo son la mayoría de los huesos del cráneo y el esternón.', W('Bone', 'Flat bones are thin and generally curved'), W('Bone', 'Most of the bones of the skull are flat bones, as is the sternum.')],
        ['Los irregulares no encajan en las otras categorías: los de la columna, la pelvis y algunos del cráneo.', W('Bone', 'Irregular bones do not fit into the above categories.'), W('Bone', 'The bones of the spine, pelvis, and some bones of the skull are irregular bones.')],
        ['Los sesamoideos están dentro de tendones, como la rótula y el pisiforme.', W('Bone', 'Sesamoid bones are bones embedded in tendons.'), W('Bone', 'Examples of sesamoid bones are the patella and the pisiform.')],
      ],
      vista: { ver: ['parietal', 'esternon', 'vertebra', 'coxal', 'rotula'], contexto: ['pisiforme'], esqueleto: true, camara: 'anterolateral', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'rotula', texto: 'Toca un hueso sesamoideo: el que está delante de la rodilla.' },
    },
    {
      id: 'funciones', tipo: 'funcion', titulo: 'Para qué sirve el esqueleto',
      texto: [
        ['El esqueleto tiene seis funciones principales: sostén, movimiento, protección, producción de células sanguíneas, almacén de minerales y regulación endocrina.', W(ESQ, 'The human skeleton performs six major functions: support, movement, protection, production of blood cells, storage of minerals, and endocrine regulation.')],
        ['Protege órganos internos: el cráneo protege el encéfalo y las costillas, el corazón y los pulmones.', W('Bone', 'Bones protect internal organs, such as the skull protecting the brain or the ribs protecting the heart and lungs.')],
      ],
      vista: { capas: { skeletal: 'all' }, ver: ['esternon'], contexto: [], camara: 'anterior', lado: 'R' },
      comprobar: 'protege',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['Unos 206 huesos en el adulto: 80 en el esqueleto axial (cráneo, columna, caja torácica e hioides) y 126 en el apendicular (cinturas y miembros).', W('Axial_skeleton', 'it consists of 80 bones'), W('Appendicular_skeleton', 'Of the 206 bones in the human skeleton, the appendicular skeleton comprises 126.')],
        ['Por su forma, son largos, cortos, planos, irregulares o sesamoideos.', W('Bone', 'Five types of bones are found in the human body: long, short, flat, irregular, and sesamoid.')],
        ['Sostienen, permiten el movimiento, protegen, producen células sanguíneas, almacenan minerales y participan en la regulación endocrina.', W(ESQ, 'support, movement, protection, production of blood cells, storage of minerals, and endocrine regulation')],
      ],
    },
  ],
  preguntas: [
    { id: 'id-femur', tipo: 'identificar', estructura: 'femur', objetivo: 0, paso: 'largos-cortos' },
    { id: 'id-coxal', tipo: 'identificar', estructura: 'coxal', objetivo: 0, paso: 'planos-irregulares' },
    {
      id: 'axial-forma', tipo: 'relacion', objetivo: 0, paso: 'axial',
      enunciado: '¿Qué forma el esqueleto axial?',
      correcta: 'El cráneo, la columna vertebral, la caja torácica y el hioides',
      distractores: ['El cráneo y los huesos de los miembros', 'La columna y las cinturas escapular y pélvica', 'Las costillas, las clavículas y las escápulas'],
      explicacion: 'Las cinturas y los miembros forman el esqueleto apendicular.',
      evidencia: [W('Axial_skeleton', 'is composed of the skull (28 bones, including the cranium, mandible and the middle ear ossicles), the vertebral column (26 bones, including vertebrae, sacrum and coccyx), the rib cage (25 bones, including ribs and sternum), and the hyoid bone')],
    },
    {
      id: 'cintura-escapular', tipo: 'relacion', objetivo: 0, paso: 'apendicular',
      enunciado: '¿Qué huesos forman la cintura escapular?',
      correcta: 'Las clavículas y las escápulas', distractores: ['Las clavículas y el esternón', 'Las escápulas y los húmeros', 'Las primeras costillas y las clavículas'],
      explicacion: 'Cuatro huesos: clavícula y escápula de cada lado. Pertenecen al esqueleto apendicular.',
      evidencia: [W('Appendicular_skeleton', 'Shoulder girdle (4 bones) – Left and right clavicle (×2) and scapula (×2).')],
    },
    {
      id: 'cuantos', tipo: 'relacion', objetivo: 0, paso: 'cuantos',
      enunciado: '¿Cuántos huesos tiene, aproximadamente, el esqueleto adulto?',
      correcta: 'Unos 206', distractores: ['Unos 270', 'Unos 126', 'Unos 80'],
      explicacion: 'Al nacer son unos 270; al fusionarse algunos quedan unos 206. De ellos, 80 son axiales y 126, apendiculares.',
      evidencia: [W(ESQ, 'this total decreases to around 206 bones by adulthood after some bones fuse together')],
    },
    {
      id: 'tipo-rotula', tipo: 'relacion', objetivo: 1, paso: 'planos-irregulares', estructuras: ['rotula'],
      enunciado: '¿Qué tipo de hueso es la rótula?',
      correcta: 'Sesamoideo', distractores: ['Corto', 'Plano', 'Irregular'],
      explicacion: 'Está dentro de un tendón, como el pisiforme: es un hueso sesamoideo.',
      evidencia: [W('Bone', 'Examples of sesamoid bones are the patella and the pisiform.')],
    },
    {
      id: 'tipo-carpo', tipo: 'relacion', objetivo: 1, paso: 'largos-cortos', estructuras: ['carpo'],
      enunciado: 'Los huesos de la muñeca y del tobillo son…',
      correcta: 'cortos', distractores: ['largos', 'planos', 'sesamoideos'],
      explicacion: 'Tienen forma más o menos de cubo: son huesos cortos.',
      evidencia: [W('Bone', 'The bones of the wrist and ankle are short bones.')],
    },
    {
      id: 'tipo-vertebra', tipo: 'relacion', objetivo: 1, paso: 'planos-irregulares', estructuras: ['vertebra'],
      enunciado: 'Las vértebras son huesos…',
      correcta: 'irregulares', distractores: ['planos', 'largos', 'cortos'],
      explicacion: 'Los huesos de la columna, la pelvis y algunos del cráneo no encajan en otro tipo: son irregulares.',
      evidencia: [W('Bone', 'The bones of the spine, pelvis, and some bones of the skull are irregular bones.')],
    },
    {
      id: 'protege', tipo: 'funcion', objetivo: 2, paso: 'funciones',
      enunciado: '¿Qué órganos protegen las costillas?',
      correcta: 'El corazón y los pulmones', distractores: ['El encéfalo', 'Los riñones y la vejiga', 'El estómago y el intestino delgado'],
      explicacion: 'El cráneo protege el encéfalo; las costillas, el corazón y los pulmones.',
      evidencia: [W('Bone', 'the ribs protecting the heart and lungs')],
    },
    {
      id: 'funciones', tipo: 'funcion', objetivo: 2, paso: 'funciones',
      enunciado: '¿Cuál de estas es una de las funciones principales del esqueleto?',
      correcta: 'Producir células sanguíneas', distractores: ['Producir bilis', 'Filtrar la sangre para formar orina', 'Producir la linfa'],
      explicacion: 'Sus seis funciones: sostén, movimiento, protección, producción de células sanguíneas, almacén de minerales y regulación endocrina.',
      evidencia: [W(ESQ, 'The human skeleton performs six major functions: support, movement, protection, production of blood cells, storage of minerals, and endocrine regulation.')],
    },
  ],
});
