// Lección «La piel». Formato y evidencias: ../formato.js.
import { leccion, W, GUIA, MODELO } from '../formato.js';

const TEG = 'Integumentary_system';
const PIEL = 'Human_skin';
const P = (nombre, piezas, lado = 'bilateral', papel = 'nucleo') => ({ nombre, piezas, lado, papel, tipo: 'piel' });

export default leccion({
  id: 'sis-tegumentario',
  version: 1,
  titulo: 'La piel',
  resumen: 'El sistema tegumentario: la piel como el órgano más grande, sus tres capas (epidermis, dermis e hipodermis), sus funciones y cómo está representada en el modelo.',
  lugares: [],
  sistemas: ['tegumentario'],
  formato: 'vision-general',
  temas: ['organos'],
  nivel: 1,
  minutos: 8,
  requisitos: ['fund-orientacion'],
  siguiente: ['sis-sentidos'],
  objetivos: [
    'Enumerar lo que forma el sistema tegumentario y explicar por qué la piel es un órgano.',
    'Ordenar las capas de la piel de fuera adentro y describir cada una.',
    'Enumerar las funciones de la piel.',
  ],
  estructuras: {
    'piel-mano': P('Piel de la mano', ['Skin_Hand']),
    'piel-antebrazo': P('Piel del antebrazo', ['Skin_Forearm']),
    'piel-brazo': P('Piel del brazo', ['Skin_Arm']),
    'piel-pie': P('Piel del pie', ['Skin_Foot'], 'bilateral', 'contexto'),
  },
  pasos: [
    {
      id: 'organo', tipo: 'orientacion', titulo: 'El órgano más grande',
      texto: [
        ['El sistema tegumentario es el conjunto de órganos de la capa más externa del cuerpo: la piel, el pelo y las uñas, entre otros.', W(TEG, 'The integumentary system is the set of organs forming the outermost layer of an animal\'s body, comprising the skin, hair, scales, feathers, hooves, claws, and nails.')],
        ['La piel es el órgano más grande del cuerpo humano: alrededor del 16 % de la masa corporal.', W(PIEL, 'The skin is the largest organ in the human body, comprising roughly 16% of body mass.')],
        ['Actúa como barrera física entre el medio externo y el interno.', W(TEG, 'It acts as a protective physical barrier between the external environment and the internal environment.')],
      ],
      vista: { capas: { integumentary: 'skin' }, ver: [], contexto: [], camara: 'anterior', lado: 'R' },
    },
    {
      id: 'capas', tipo: 'explicacion', titulo: 'Tres capas',
      texto: [
        ['La piel tiene tres capas principales: la epidermis, la dermis y la hipodermis, o capa subcutánea.', W(PIEL, 'Skin is composed of three primary layers: the epidermis, the dermis and the hypodermis (more commonly called the subcutaneous layer).')],
        ['La epidermis es la más externa: una envoltura impermeable y protectora que hace de barrera contra las infecciones y que no tiene vasos sanguíneos.', W(PIEL, 'is the outermost layer of the skin'), W(PIEL, 'It forms the waterproof, protective wrap over the body\'s surface, which also serves as a barrier to infection'), W(PIEL, 'The epidermis contains no blood vessels')],
        ['La dermis contiene tejido conjuntivo, vasos sanguíneos, glándulas, folículos, raíces del pelo y terminaciones nerviosas sensitivas.', W(TEG, 'contains connective tissues, blood vessels, glands, follicles, hair roots, sensory nerve endings, and muscular tissue')],
        ['El tejido subcutáneo, debajo de la dermis, contiene la mitad de la grasa del cuerpo, que almohadilla y aísla.', W(PIEL, 'lies below the dermis of the cutis'), W(PIEL, 'subcutaneous tissue contains 50% of body fat'), W(PIEL, 'Fat serves as padding and insulation for the body.')],
        ['El modelo representa la superficie de la piel, sin sus capas.', MODELO],
      ],
      detalle: [
        ['Donde la piel es más gruesa, como en las palmas y las plantas, la epidermis tiene una capa más, el estrato lúcido.', W(TEG, 'Where the skin is thicker, such as in the palms and soles, there is an extra layer of skin between the stratum corneum and the stratum granulosum known as the stratum lucidum.')],
      ],
      vista: { ver: ['piel-mano', 'piel-antebrazo'], contexto: [], esqueleto: true, camara: 'anterior', lado: 'R' },
      comprobar: 'sin-vasos',
    },
    {
      id: 'funciones', tipo: 'funcion', titulo: 'Para qué sirve',
      texto: [
        ['La piel protege al cuerpo de los patógenos y de la pérdida excesiva de agua.', W(PIEL, 'Skin plays an important immunity role in protecting the body against pathogens and excessive water loss.')],
        ['También aísla, regula la temperatura, aporta sensibilidad y sintetiza vitamina D.', W(PIEL, 'Its other functions are insulation, temperature regulation, sensation, synthesis of vitamin D')],
        ['Tiene receptores que detectan el dolor, la presión y la temperatura.', W(TEG, 'contains the sensory receptors that detect pain, sensation, pressure, and temperature')],
      ],
      vista: { capas: { integumentary: 'translucent', skeletal: 'all' }, ver: [], contexto: [], camara: 'anterior', lado: 'R' },
    },
    {
      id: 'zonas', tipo: 'exploracion', titulo: 'La piel en el modelo',
      texto: [
        ['En el modelo, la piel está dividida en zonas (la de la mano, el antebrazo, el brazo…), cada una con su ficha.', MODELO],
        ['Con la piel translúcida ves los huesos debajo: la piel es superficial y el esqueleto, profundo.', GUIA],
      ],
      vista: { ver: ['piel-antebrazo'], contexto: ['piel-brazo', 'piel-mano'], esqueleto: true, camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'piel-antebrazo', texto: 'Toca la zona de piel del antebrazo.' },
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['La piel es el órgano más grande: una barrera entre el medio externo y el interno.', W(PIEL, 'The skin is the largest organ in the human body'), W(TEG, 'It acts as a protective physical barrier')],
        ['Capas, de fuera adentro: epidermis (sin vasos), dermis (vasos, glándulas, nervios) e hipodermis (grasa).', W(PIEL, 'Skin is composed of three primary layers: the epidermis, the dermis and the hypodermis')],
        ['Protege, regula la temperatura, aporta sensibilidad y sintetiza vitamina D.', W(PIEL, 'Its other functions are insulation, temperature regulation, sensation, synthesis of vitamin D')],
      ],
    },
  ],
  preguntas: [
    { id: 'loc-antebrazo', tipo: 'localizar', estructura: 'piel-antebrazo', candidatas: ['piel-brazo', 'piel-mano'], objetivo: 0, paso: 'zonas' },
    {
      id: 'mayor', tipo: 'relacion', objetivo: 0, paso: 'organo',
      enunciado: '¿Cuál es el órgano más grande del cuerpo humano?',
      correcta: 'La piel', distractores: ['El hígado', 'El intestino delgado', 'El encéfalo'],
      explicacion: 'La piel supone alrededor del 16 % de la masa corporal; el hígado es el segundo.',
      evidencia: [W(PIEL, 'The skin is the largest organ in the human body, comprising roughly 16% of body mass.')],
    },
    {
      id: 'orden-capas', tipo: 'secuencia', objetivo: 1, paso: 'capas',
      enunciado: 'Ordena las capas de la piel de fuera adentro.',
      orden: ['Epidermis', 'Dermis', 'Hipodermis'],
      explicacion: 'La epidermis es la más externa; debajo está la dermis y, debajo de esta, el tejido subcutáneo.',
      evidencia: [W(PIEL, 'is the outermost layer of the skin'), W(PIEL, 'lies below the dermis of the cutis')],
    },
    {
      id: 'sin-vasos', tipo: 'relacion', objetivo: 1, paso: 'capas',
      enunciado: '¿Qué capa de la piel no tiene vasos sanguíneos?',
      correcta: 'La epidermis', distractores: ['La dermis', 'La hipodermis', 'Ninguna: las tres los tienen'],
      explicacion: 'Las células más profundas de la epidermis se nutren por difusión; los vasos están en la dermis.',
      evidencia: [W(PIEL, 'The epidermis contains no blood vessels')],
    },
    {
      id: 'grasa', tipo: 'relacion', objetivo: 1, paso: 'capas',
      enunciado: '¿Qué capa contiene la mitad de la grasa del cuerpo?',
      correcta: 'El tejido subcutáneo (hipodermis)', distractores: ['La epidermis', 'La dermis papilar', 'El estrato lúcido'],
      explicacion: 'La grasa subcutánea almohadilla y aísla el cuerpo.',
      evidencia: [W(PIEL, 'subcutaneous tissue contains 50% of body fat')],
    },
    {
      id: 'vitamina', tipo: 'funcion', objetivo: 2, paso: 'funciones',
      enunciado: '¿Qué vitamina sintetiza la piel?',
      correcta: 'La vitamina D', distractores: ['La vitamina C', 'La vitamina K', 'La vitamina B12'],
      explicacion: 'Además, aísla, regula la temperatura y aporta sensibilidad.',
      evidencia: [W(PIEL, 'synthesis of vitamin D')],
    },
    {
      id: 'barrera', tipo: 'funcion', objetivo: 2, paso: 'funciones',
      enunciado: '¿De qué protege la piel al cuerpo?',
      correcta: 'De los patógenos y de la pérdida excesiva de agua', distractores: ['Solo de los golpes', 'Solo de la luz del sol', 'De la entrada de oxígeno'],
      explicacion: 'Es una barrera física e inmunitaria.',
      evidencia: [W(PIEL, 'protecting the body against pathogens and excessive water loss')],
    },
  ],
});
