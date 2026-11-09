// Lección «Sistema reproductor femenino» (solo en el modelo femenino). Formato y evidencias: ../formato.js.
import { leccion, W, GUIA, MODELO } from '../formato.js';

const FEM = 'Female_reproductive_system';
const O = (nombre, piezas, lado = 'impar', papel = 'nucleo') => ({ nombre, piezas, lado, papel, tipo: 'organo' });

export default leccion({
  id: 'sis-reproductor-femenino',
  version: 1,
  titulo: 'Sistema reproductor femenino',
  resumen: 'Los órganos genitales femeninos internos (ovarios, trompas uterinas, útero y vagina) y externos (la vulva), el camino del óvulo y las mamas. Se estudia en el modelo femenino.',
  lugares: [['pelvis', 'organos-pelvicos'], ['pelvis', 'perine'], ['torax', 'mama']],
  sistemas: ['reproductor-femenino'],
  formato: 'vision-general',
  temas: ['organos'],
  nivel: 1,
  minutos: 10,
  modelos: ['female'],
  requisitos: ['sis-urinario'],
  siguiente: ['pel-suelo', 'sis-endocrino'],
  objetivos: [
    'Distinguir los órganos genitales femeninos internos de los externos.',
    'Localizar en el modelo los ovarios, las trompas uterinas, el útero y la vagina.',
    'Seguir el camino del óvulo desde el ovario y decir dónde suele ocurrir la fecundación.',
    'Explicar la función del útero y de la vagina.',
  ],
  estructuras: {
    ovario: O('Ovario', ['Ovary'], 'bilateral'),
    trompa: O('Trompa uterina', ['Uterine_tube', 'Fimbriae_of_uterine_tube'], 'bilateral'),
    utero: O('Útero', ['Uterus']),
    vagina: O('Vagina', ['Vagina']),
    clitoris: O('Clítoris', ['Glans_of_clitoris', 'Body_of_clitoris']),
    mama: O('Glándula mamaria', ['Mammary_gland'], 'bilateral'),
    vejiga: O('Vejiga urinaria', ['Urinary_bladder'], 'impar', 'contexto'),
    'ligamento-ovario': O('Ligamento propio del ovario', ['Ligament_of_ovary'], 'bilateral', 'contexto'),
  },
  pasos: [
    {
      id: 'organos', tipo: 'orientacion', titulo: 'Internos y externos',
      texto: [
        ['El sistema reproductor femenino lo forman órganos sexuales internos y externos.', W(FEM, 'The human female reproductive system is made up of the internal and external sex organs that function in the reproduction of new offspring.')],
        ['El tracto reproductor son varios órganos internos conectados: la vagina, el útero y las trompas uterinas.', W(FEM, 'The female reproductive tract is made of several connected internal organs—the vagina, uterus, and fallopian tubes')],
        ['En el modelo femenino, el útero, los ovarios, las trompas, la vagina y las mamas son formas simplificadas generadas por Anato3D con medidas de referencia, no piezas de Z-Anatomy.', MODELO],
      ],
      vista: { capas: { skeletal: 'all', urogenital: 'reproductive' }, ver: [], contexto: [], camara: 'anterior', lado: 'R' },
    },
    {
      id: 'ovarios', tipo: 'exploracion', titulo: 'Ovarios y trompas uterinas',
      texto: [
        ['Los ovarios son dos gónadas pequeñas junto a las paredes laterales de la cavidad pélvica.', W(FEM, 'The ovaries are small, paired gonads located near the lateral walls of the pelvic cavity.')],
        ['En cada ciclo menstrual un ovario libera un óvulo, que recorre la trompa uterina hasta el útero.', W(FEM, 'During the menstrual cycle, an ovary releases an ovum, which transits through the fallopian tube and into the uterus.')],
        ['La fecundación suele ocurrir en una trompa uterina.', W(FEM, 'Fertilization usually occurs within a fallopian tube and marks the beginning of embryogenesis.')],
      ],
      vista: { ver: ['ovario', 'trompa'], contexto: ['utero', 'ligamento-ovario', 'vejiga'], esqueleto: true, camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'ovario', texto: 'Toca el ovario derecho.' },
      comprobar: 'fecundacion',
    },
    {
      id: 'utero', tipo: 'funcion', titulo: 'Útero y vagina',
      texto: [
        ['El útero acoge al embrión desarrollando su revestimiento interno.', W(FEM, 'The uterus (or womb) accommodates the embryo by developing the uterine lining.')],
        ['Si no hay fecundación, ese revestimiento se desprende como sangre, moco y tejido: la menstruación.', W(FEM, 'If no fertilization occurs, the uterine lining has to be shed as blood, mucus, and tissue, a process known as menstruation.')],
        ['La vagina permite las relaciones sexuales y el parto, y se une al útero en el cuello uterino.', W(FEM, 'The vagina allows for sexual intercourse and childbirth, and is connected to the uterus at the cervix.')],
      ],
      vista: { ver: ['utero', 'vagina'], contexto: ['vejiga', 'trompa'], esqueleto: true, camara: 'lateral', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'De lado se ve cómo el útero se apoya sobre la vejiga.', vistas: [{ nombre: 'De lado', camara: 'lateral' }, { nombre: 'De frente', camara: 'anterior' }] },
    },
    {
      id: 'externos', tipo: 'explicacion', titulo: 'La vulva y las mamas',
      texto: [
        ['Los órganos sexuales externos son los de la vulva: los labios, el clítoris y el vestíbulo.', W(FEM, 'these are the organs of the vulva, including the labia, clitoris, and vestibule')],
        ['Las mamas también forman parte del sistema reproductor.', W(FEM, 'The breasts are part of the reproductive system')],
        ['Si tienes desactivada la opción «Mostrar genitales externos», la vulva no se ve.', GUIA],
      ],
      vista: { ver: ['clitoris', 'mama'], contexto: [], esqueleto: true, camara: 'anterior', lado: 'R' },
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['Internos: ovarios, trompas uterinas, útero y vagina. Externos: la vulva (labios, clítoris y vestíbulo).', W(FEM, 'the vagina, uterus, and fallopian tubes'), W(FEM, 'the organs of the vulva, including the labia, clitoris, and vestibule')],
        ['El óvulo va del ovario por la trompa al útero; la fecundación suele ocurrir en la trompa.', W(FEM, 'an ovary releases an ovum, which transits through the fallopian tube and into the uterus'), W(FEM, 'Fertilization usually occurs within a fallopian tube')],
        ['El útero acoge al embrión; la vagina se une a él en el cuello uterino.', W(FEM, 'accommodates the embryo by developing the uterine lining'), W(FEM, 'is connected to the uterus at the cervix')],
      ],
    },
  ],
  preguntas: [
    { id: 'id-utero', tipo: 'identificar', estructura: 'utero', objetivo: 1, paso: 'utero' },
    { id: 'id-ovario', tipo: 'identificar', estructura: 'ovario', objetivo: 1, paso: 'ovarios' },
    { id: 'id-trompa', tipo: 'identificar', estructura: 'trompa', objetivo: 1, paso: 'ovarios' },
    {
      id: 'internos', tipo: 'relacion', objetivo: 0, paso: 'organos',
      enunciado: '¿Cuál de estos órganos pertenece a los genitales femeninos externos?',
      correcta: 'El clítoris', distractores: ['El útero', 'La trompa uterina', 'El ovario'],
      explicacion: 'Los externos son los de la vulva: labios, clítoris y vestíbulo.',
      evidencia: [W(FEM, 'these are the organs of the vulva, including the labia, clitoris, and vestibule')],
    },
    {
      id: 'orden', tipo: 'secuencia', objetivo: 2, paso: 'ovarios',
      enunciado: 'Ordena el camino del óvulo.',
      orden: ['Ovario', 'Trompa uterina', 'Útero'],
      explicacion: 'El ovario libera el óvulo, que recorre la trompa hasta el útero.',
      evidencia: [W(FEM, 'During the menstrual cycle, an ovary releases an ovum, which transits through the fallopian tube and into the uterus.')],
    },
    {
      id: 'fecundacion', tipo: 'relacion', objetivo: 2, paso: 'ovarios',
      enunciado: '¿Dónde suele ocurrir la fecundación?',
      correcta: 'En una trompa uterina', distractores: ['En el útero', 'En el ovario', 'En la vagina'],
      explicacion: 'El cigoto se forma en la trompa y luego se implanta en la pared del útero.',
      evidencia: [W(FEM, 'Fertilization usually occurs within a fallopian tube and marks the beginning of embryogenesis.')],
    },
    {
      id: 'menstruacion', tipo: 'funcion', objetivo: 3, paso: 'utero', estructuras: ['utero'],
      enunciado: '¿Qué es la menstruación?',
      correcta: 'El desprendimiento del revestimiento del útero cuando no hay fecundación', distractores: ['La liberación del óvulo por el ovario', 'La implantación del embrión en el útero', 'La contracción del útero en el parto'],
      explicacion: 'Si no hay fecundación, el revestimiento preparado para el embrión se desprende.',
      evidencia: [W(FEM, 'If no fertilization occurs, the uterine lining has to be shed as blood, mucus, and tissue, a process known as menstruation.')],
    },
    {
      id: 'cervix', tipo: 'relacion', objetivo: 3, paso: 'utero', estructuras: ['vagina', 'utero'],
      enunciado: '¿Dónde se une la vagina al útero?',
      correcta: 'En el cuello uterino', distractores: ['En el fondo del útero', 'En la trompa uterina', 'En el ovario'],
      explicacion: 'El cuello uterino (cérvix) es la parte del útero que conecta con la vagina.',
      evidencia: [W(FEM, 'is connected to the uterus at the cervix')],
    },
  ],
});
