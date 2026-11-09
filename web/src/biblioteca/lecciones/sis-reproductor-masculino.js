// Lección «Sistema reproductor masculino» (solo en el modelo masculino). Formato y evidencias: ../formato.js.
import { leccion, W, GUIA } from '../formato.js';

const MAS = 'Male_reproductive_system';
const O = (nombre, piezas, lado = 'impar', papel = 'nucleo') => ({ nombre, piezas, lado, papel, tipo: 'organo' });

export default leccion({
  id: 'sis-reproductor-masculino',
  version: 1,
  titulo: 'Sistema reproductor masculino',
  resumen: 'Los órganos genitales masculinos externos (pene y escroto) e internos (testículos, epidídimo, conducto deferente, glándulas seminales y próstata) y el camino de los espermatozoides. Se estudia en el modelo masculino.',
  lugares: [['pelvis', 'organos-pelvicos'], ['pelvis', 'perine']],
  sistemas: ['reproductor-masculino'],
  formato: 'vision-general',
  temas: ['organos'],
  nivel: 1,
  minutos: 9,
  modelos: ['male'],
  requisitos: ['sis-urinario'],
  siguiente: ['pel-suelo', 'sis-endocrino'],
  objetivos: [
    'Distinguir los órganos genitales masculinos externos de los internos.',
    'Localizar en el modelo el testículo, el epidídimo, el conducto deferente, las glándulas seminales y la próstata.',
    'Ordenar el camino de los espermatozoides desde el testículo hasta el conducto eyaculador.',
    'Explicar qué aportan las glándulas seminales y la próstata.',
  ],
  estructuras: {
    testiculo: O('Testículo', ['Testis'], 'bilateral'),
    epididimo: O('Epidídimo', ['Epididymis'], 'bilateral'),
    deferente: O('Conducto deferente', ['Ductus_deferens'], 'bilateral'),
    seminal: O('Glándula seminal', ['Seminal_gland'], 'bilateral'),
    eyaculador: O('Conducto eyaculador', ['Ejaculatory_duct'], 'bilateral', 'contexto'),
    prostata: O('Próstata', ['Prostate']),
    pene: O('Cuerpos eréctiles del pene', ['Corpus_cavernosum_of_penis', 'Corpus_spongiosum_of_penis', 'Glans_penis']),
    vejiga: O('Vejiga urinaria', ['Urinary_bladder'], 'impar', 'contexto'),
    uretra: O('Uretra', ['Urethra'], 'impar', 'contexto'),
  },
  pasos: [
    {
      id: 'organos', tipo: 'orientacion', titulo: 'Externos e internos',
      texto: [
        ['Los principales órganos sexuales masculinos son el pene y el escroto, que contiene los testículos, donde se producen el semen y los espermatozoides.', W(MAS, 'The main male sex organs are the penis and the scrotum, which contains the testicles that produce semen and sperm')],
        ['Si tienes desactivada la opción «Mostrar genitales externos», el pene y el escroto no se ven.', GUIA],
      ],
      vista: { capas: { skeletal: 'all', urogenital: 'reproductive' }, ver: [], contexto: [], camara: 'anterolateral', lado: 'R' },
    },
    {
      id: 'externos', tipo: 'explicacion', titulo: 'Pene y escroto',
      texto: [
        ['El pene tiene un cuerpo largo y una punta abultada, el glande; por dentro lo recorre la uretra, que sirve para eyacular el semen y para orinar.', W(MAS, 'The penis is an intromittent organ with a long shaft, an enlarged bulbous-shaped tip called the glans'), W(MAS, 'Inside the penis is the urethra, which is used to ejaculate semen and to excrete urine.')],
        ['La erección se produce cuando los tejidos eréctiles del pene, los cuerpos cavernosos y el cuerpo esponjoso, se llenan de sangre.', W(MAS, 'erection occurs because sinuses within the erectile tissues of the penis (corpora cavernosa and corpus spongiosum) become filled with blood')],
        ['El escroto es una bolsa de piel, detrás del pene, que sostiene y protege los testículos.', W(MAS, 'The scrotum is a sac of skin that hangs behind the penis.'), W(MAS, 'It holds and protects the testicles.')],
      ],
      vista: { ver: ['pene', 'testiculo'], contexto: ['uretra'], esqueleto: true, camara: 'lateral', lado: 'R' },
    },
    {
      id: 'conductos', tipo: 'exploracion', titulo: 'Del testículo al conducto eyaculador',
      texto: [
        ['El epidídimo es una masa alargada de un tubo muy enrollado, junto al testículo.', W(MAS, 'The epididymis is a long whitish mass of tightly coiled tube.')],
        ['El conducto deferente, de unos 30 cm, sale del epidídimo hacia la cavidad pélvica y lleva los espermatozoides hasta el conducto eyaculador.', W(MAS, 'The vas deferens, which is also known as the sperm duct, is a thin tube approximately 30 centimetres (0.98 ft) long that starts from the epididymis to the pelvic cavity.'), W(MAS, 'It carries the sperm (formally known as spermatozoa) from the epididymis to the ejaculatory duct.')],
        ['Sigue el conducto deferente en el modelo: sube desde el escroto, entra en la pelvis y llega detrás de la vejiga.', GUIA],
      ],
      vista: { ver: ['epididimo', 'deferente'], contexto: ['testiculo', 'vejiga', 'eyaculador'], esqueleto: true, camara: 'anterolateral', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'deferente', texto: 'Toca el conducto deferente.' },
    },
    {
      id: 'glandulas', tipo: 'funcion', titulo: 'Glándulas seminales y próstata',
      texto: [
        ['Las glándulas seminales son dos glándulas, detrás de la vejiga, que segregan muchos de los componentes del semen.', W(MAS, 'Seminal vesicles: two glands behind the bladder that secrete many of the semen\'s components.')],
        ['La próstata, debajo de la vejiga, produce líquido seminal y ayuda a regular la salida de la orina.', W(MAS, 'Prostate gland: a gland located below the bladder that produces seminal fluid and helps regulate urine flow.')],
      ],
      vista: { ver: ['seminal', 'prostata'], contexto: ['vejiga', 'uretra', 'deferente'], esqueleto: true, camara: 'posterior', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'Las glándulas seminales se ven mejor desde atrás; la próstata, de lado.', vistas: [{ nombre: 'Desde atrás', camara: 'posterior' }, { nombre: 'De lado', camara: 'lateral' }] },
      comprobar: 'prostata',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['Externos: pene y escroto. Internos: testículos, epidídimos, conductos deferentes, glándulas seminales y próstata.', W(MAS, 'The main male sex organs are the penis and the scrotum, which contains the testicles')],
        ['Camino de los espermatozoides: testículo → epidídimo → conducto deferente → conducto eyaculador.', W(MAS, 'It carries the sperm (formally known as spermatozoa) from the epididymis to the ejaculatory duct.')],
        ['Las glándulas seminales y la próstata aportan el líquido del semen.', W(MAS, 'secrete many of the semen\'s components'), W(MAS, 'produces seminal fluid')],
      ],
    },
  ],
  preguntas: [
    { id: 'id-prostata', tipo: 'identificar', estructura: 'prostata', objetivo: 1, paso: 'glandulas' },
    { id: 'id-seminal', tipo: 'identificar', estructura: 'seminal', objetivo: 1, paso: 'glandulas' },
    { id: 'id-epididimo', tipo: 'identificar', estructura: 'epididimo', objetivo: 1, paso: 'conductos' },
    {
      id: 'externos', tipo: 'relacion', objetivo: 0, paso: 'organos',
      enunciado: '¿Cuáles son los órganos genitales masculinos externos?',
      correcta: 'El pene y el escroto', distractores: ['El pene y la próstata', 'Los testículos y los conductos deferentes', 'El escroto y las glándulas seminales'],
      explicacion: 'Los testículos están dentro del escroto; la próstata y las glándulas seminales, en la pelvis.',
      evidencia: [W(MAS, 'The main male sex organs are the penis and the scrotum')],
    },
    {
      id: 'orden', tipo: 'secuencia', objetivo: 2, paso: 'conductos',
      enunciado: 'Ordena el camino de los espermatozoides.',
      orden: ['Testículo', 'Epidídimo', 'Conducto deferente', 'Conducto eyaculador'],
      explicacion: 'Se producen en el testículo, pasan al epidídimo y el conducto deferente los lleva al eyaculador.',
      evidencia: [W(MAS, 'the scrotum, which contains the testicles that produce semen and sperm'), W(MAS, 'It carries the sperm (formally known as spermatozoa) from the epididymis to the ejaculatory duct.')],
    },
    {
      id: 'deferente', tipo: 'relacion', objetivo: 2, paso: 'conductos', estructuras: ['deferente'],
      enunciado: '¿Qué hace el conducto deferente?',
      correcta: 'Lleva los espermatozoides del epidídimo al conducto eyaculador', distractores: ['Lleva la orina de la vejiga al exterior', 'Produce el líquido seminal', 'Lleva la sangre al testículo'],
      explicacion: 'Mide unos 30 cm y va del epidídimo a la cavidad pélvica.',
      evidencia: [W(MAS, 'It carries the sperm (formally known as spermatozoa) from the epididymis to the ejaculatory duct.')],
    },
    {
      id: 'prostata', tipo: 'funcion', objetivo: 3, paso: 'glandulas', estructuras: ['prostata'],
      enunciado: '¿Dónde está la próstata y qué hace?',
      correcta: 'Debajo de la vejiga; produce líquido seminal y ayuda a regular la salida de la orina', distractores: ['Detrás de la vejiga; produce los espermatozoides', 'Dentro del escroto; guarda los espermatozoides', 'Delante del pubis; produce testosterona'],
      explicacion: 'Las glándulas seminales están detrás de la vejiga; los espermatozoides se producen en los testículos.',
      evidencia: [W(MAS, 'Prostate gland: a gland located below the bladder that produces seminal fluid and helps regulate urine flow.')],
    },
    {
      id: 'ereccion', tipo: 'funcion', objetivo: 0, paso: 'externos', estructuras: ['pene'],
      enunciado: '¿Qué ocurre en la erección?',
      correcta: 'Los cuerpos cavernosos y el cuerpo esponjoso se llenan de sangre', distractores: ['Se contraen los músculos de la vejiga', 'El testículo sube hacia el abdomen', 'La próstata se vacía en la uretra'],
      explicacion: 'Los tejidos eréctiles del pene se llenan de sangre.',
      evidencia: [W(MAS, 'erection occurs because sinuses within the erectile tissues of the penis (corpora cavernosa and corpus spongiosum) become filled with blood')],
    },
  ],
});
