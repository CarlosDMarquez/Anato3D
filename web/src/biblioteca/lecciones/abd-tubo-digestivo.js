// Lección «El tubo digestivo en el abdomen». Formato y evidencias: ../formato.js.
import { leccion, T, GUIA, MODELO } from '../formato.js';

const EST = 'abdomen/gi-tract/stomach';
const DEL = 'abdomen/gi-tract/small-intestine';
const COL = 'abdomen/gi-tract/colon';
const APE = 'abdomen/gi-tract/appendix';
const org = (nombre, piezas, extra = {}) => ({ nombre, piezas, lado: 'impar', papel: 'nucleo', tipo: 'organo', ...extra });
const contexto = (nombre, piezas, tipo) => ({ nombre, piezas, lado: 'impar', papel: 'contexto', tipo });

const COLON = ['colon-ascendente', 'colon-transverso', 'colon-descendente', 'colon-sigmoide'];
const TENIAS = ['tenias'];

export default leccion({
  id: 'abd-tubo-digestivo',
  version: 1,
  titulo: 'El tubo digestivo en el abdomen',
  resumen: 'Del esófago al colon sigmoide: las partes y curvaturas del estómago, las cuatro porciones del duodeno con la papila mayor, el yeyuno y el íleon colgados del mesenterio, y el colon con sus tenias, haustras y flexuras, el apéndice y dónde duele la apendicitis.',
  lugares: [['abdomen', 'organos-abdominales'], ['abdomen', 'peritoneo']],
  sistemas: ['digestivo'],
  formato: 'topografia',
  temas: ['organos'],
  nivel: 2,
  minutos: 18,
  requisitos: ['sis-digestivo', 'abd-pared'],
  siguiente: ['abd-higado-pancreas', 'abd-vasos', 'abd-rinones'],
  objetivos: [
    'Describir las partes y curvaturas del estómago.',
    'Distinguir las cuatro porciones del duodeno y situar la papila duodenal mayor.',
    'Relacionar el yeyuno y el íleon con el mesenterio y con el intestino grueso.',
    'Reconocer las partes del colon y lo que lo diferencia del intestino delgado.',
    'Localizar el apéndice y el punto de McBurney.',
  ],
  estructuras: {
    esofago: org('Esófago', ['Oesophagus']),
    estomago: org('Estómago', ['Stomach']),
    duodeno: org('Duodeno', ['Duodenum']),
    yeyuno: org('Yeyuno', ['Jejunum']),
    'colon-ascendente': org('Colon ascendente', ['Ascending_colon']),
    'colon-transverso': org('Colon transverso', ['Transverse_colon']),
    'colon-descendente': org('Colon descendente', ['Descending_colon']),
    'colon-sigmoide': org('Colon sigmoide', ['Sigmoid_colon']),
    apendice: org('Apéndice vermiforme', ['Vermiform_appendix']),
    tenias: org('Tenias del colon', ['Free_taenia', 'Mesocolic_taenia', 'Omental_taenia']),
    'mucosa-estomago': contexto('Mucosa del estómago', ['Mucosa_of_stomach'], 'organo'),
    higado: contexto('Hígado', ['Liver'], 'organo'),
    pancreas: contexto('Páncreas', ['Pancreas'], 'organo'),
    bazo: contexto('Bazo', ['Spleen'], 'organo'),
    diafragma: contexto('Diafragma', ['Diaphragm'], 'musculo'),
    aorta: contexto('Aorta abdominal', ['Abdominal_aorta'], 'arteria'),
    cava: contexto('Vena cava inferior', ['Inferior_vena_cava_abdominal_part'], 'vena'),
    'mesenterica-superior': contexto('Arteria mesentérica superior', ['Superior_mesenteric_artery'], 'arteria'),
    'coxales': { nombre: 'Huesos coxales', piezas: ['Hip_Bone'], lado: 'ambos', papel: 'contexto', tipo: 'hueso' },
  },
  pasos: [
    {
      id: 'orientacion', tipo: 'orientacion', titulo: 'El tubo en el abdomen',
      texto: [
        ['En el abdomen, el tubo digestivo sigue al esófago con el estómago, el intestino delgado (duodeno, yeyuno e íleon) y el grueso, que va del ciego al recto.', T(DEL, 'Anatomically, the small bowel can be divided into three parts: the duodenum, jejunum, and ileum.'), T(COL, 'The large intestine extends from the cecum to the rectum.')],
        ['Míralo de frente, con el hígado translúcido.', GUIA],
      ],
      detalle: [
        ['Del intestino delgado, el modelo tiene el duodeno y el yeyuno, pero no el íleon; del grueso faltan el ciego y el recto.', MODELO],
      ],
      vista: { ver: ['estomago', 'duodeno', 'yeyuno', ...COLON], contexto: ['esofago', 'apendice', 'pancreas', 'bazo'], fantasma: ['higado'], camara: 'anterior' },
      actividad: { tipo: 'vistas', texto: 'Recorre el tubo.', vistas: [{ nombre: 'De frente', camara: 'anterior' }, { nombre: 'De lado', camara: 'lateral' }] },
      comprobar: 'rel-delgado',
    },
    {
      id: 'estomago', tipo: 'exploracion', titulo: 'El estómago',
      texto: [
        ['El estómago tiene forma de J, con una curvatura menor y otra mayor.', T(EST, 'It has a ‘J’ shape, and features a lesser and greater curvature.')],
        ['Se divide en cardias (en T11), fondo (redondeado y a menudo con aire), cuerpo y píloro, que lo une al duodeno.', T(EST, 'The stomach has four main anatomical divisions; the cardia, fundus, body and pylorus:'), T(EST, 'Cardia – surrounds the superior opening of the stomach at the T11 level.'), T(EST, 'Fundus – the rounded, often gas filled portion superior to and left of the cardia.'), T(EST, 'Pylorus – connects the stomach to the duodenum.')],
        ['Su tamaño, forma y posición varían entre personas y con la respiración.', T(EST, 'Its size, shape and position can vary between individuals and change with respiration and body position.')],
      ],
      vista: { ver: ['estomago'], contexto: ['esofago', 'duodeno', 'mucosa-estomago', 'bazo', 'diafragma'], fantasma: ['higado'], camara: 'anterior' },
      actividad: { tipo: 'vistas', texto: 'Mira las dos curvaturas.', vistas: [{ nombre: 'De frente', camara: 'anterior' }, { nombre: 'Por detrás', camara: 'posterior' }] },
      comprobar: 'rel-partes-estomago',
    },
    {
      id: 'duodeno', tipo: 'exploracion', titulo: 'El duodeno',
      texto: [
        ['El duodeno es la primera parte del intestino delgado; tiene cuatro porciones: superior, descendente, inferior y ascendente.', T(DEL, 'The most proximal portion of the small intestine is the duodenum.'), T(DEL, 'The duodenum can be divided into four parts: superior, descending, inferior and ascending.')],
        ['En la descendente está la papila duodenal mayor, por donde entran la bilis y el jugo pancreático.', T(DEL, 'Internally, the descending duodenum is marked by the major duodenal papilla – the opening at which bile and pancreatic secretions to enter')],
        ['La inferior cruza por delante de la cava inferior y la aorta; la ascendente se une al yeyuno en la flexura duodenoyeyunal.', T(DEL, 'The inferior duodenum travels laterally to the left, crossing over the inferior vena cava and aorta.'), T(DEL, 'to join the jejunum at a sharp turn known as the duodenojejunal flexure.')],
      ],
      vista: { ver: ['duodeno'], contexto: ['pancreas', 'estomago', 'yeyuno', 'aorta', 'cava'], fantasma: ['higado'], camara: 'anterior' },
      actividad: { tipo: 'localizar', estructura: 'duodeno', texto: 'Toca la C de intestino que rodea la cabeza del páncreas.' },
      comprobar: 'rel-papila',
    },
    {
      id: 'yeyuno-ileon', tipo: 'relaciones', titulo: 'Yeyuno e íleon',
      texto: [
        ['El yeyuno y el íleon cuelgan de la pared posterior por el mesenterio, una doble capa de peritoneo.', T(DEL, 'They are attached to the posterior abdominal wall by mesentery (a double layer of peritoneum).')],
        ['El yeyuno empieza en la flexura duodenoyeyunal; no hay un límite visible con el íleon, aunque son distintos.', T(DEL, 'The jejunum begins at the duodenojejunal flexure.'), T(DEL, 'There is no clear external demarcation between the jejunum and ileum – although the two parts are macroscopically different.')],
        ['El íleon acaba en la unión ileocecal, donde se mete en el ciego y forma la válvula ileocecal.', T(DEL, 'The ileum ends at the ileocaecal junction.'), T(DEL, 'At this junction, the ileum invaginates into the cecum to form the ileocecal valve.')],
      ],
      vista: { ver: ['yeyuno'], contexto: ['duodeno', 'mesenterica-superior', 'colon-ascendente', 'colon-transverso'], camara: 'anterior' },
      comprobar: 'rel-mesenterio',
    },
    {
      id: 'colon', tipo: 'exploracion', titulo: 'El colon',
      texto: [
        ['El colon mide unos 150 cm y tiene cuatro partes: ascendente, transverso, descendente y sigmoide.', T(COL, 'The colon averages 150cm in length, and can be divided into four parts (proximal to distal): ascending, transverse, descending and sigmoid.')],
        ['El ascendente y el descendente son retroperitoneales; el transverso, entre las flexuras hepática y esplénica, cuelga de su mesocolon y es la parte menos fija.', T(COL, 'The colon begins as the ascending colon, a retroperitoneal structure which ascends superiorly from the cecum.'), T(COL, 'The transverse colon is the least fixed part of the colon'), T(COL, 'Unlike the ascending and descending colon, the transverse colon is intraperitoneal and is enclosed by the transverse mesocolon.')],
        ['Lo distinguen del delgado tres tenias longitudinales, que forman las haustras, y su diámetro mucho mayor.', T(COL, 'Running longitudinally along the surface of the large bowel are three strips of muscle, known as the teniae coli.'), T(COL, 'The teniae coli contract to shorten the wall of the bowel, producing sacculations known as haustra.'), T(COL, 'The large intestine has a much wider diameter compared to the small intestine.')],
      ],
      vista: { ver: COLON, contexto: [...TENIAS, 'apendice', 'yeyuno', 'coxales'], camara: 'anterior' },
      actividad: { tipo: 'comparar', estructuras: COLON, texto: 'Alterna las cuatro partes del colon, siguiendo el marco alrededor del intestino delgado.' },
      comprobar: 'comp-grueso',
    },
    {
      id: 'apendice', tipo: 'relaciones', titulo: 'El apéndice',
      texto: [
        ['La posición del extremo libre del apéndice varía mucho; la más frecuente es detrás del ciego.', T(APE, 'The position of the free-end of the appendix is highly variable'), T(APE, 'The most common position is retrocecal.')],
        ['Su inflamación, la apendicitis, es una causa frecuente de dolor abdominal agudo: empieza alrededor del ombligo y acaba en el punto de McBurney, a un tercio del camino entre la espina ilíaca anterosuperior derecha y el ombligo.', T(APE, 'Inflammation of the appendix is known as appendicitis, and is a common cause for acute severe abdominal pain.'), T(APE, 'In established appendicitis, the abdomen is most tender at McBurney’s point – situated one third of the distance from the right anterior superior iliac spine to the umbilicus.'), T(APE, 'it often begins as referred pain around the umbilical region.')],
      ],
      vista: { ver: ['apendice'], contexto: ['colon-ascendente', 'tenias', 'coxales'], camara: 'anterior' },
      actividad: { tipo: 'localizar', estructura: 'apendice', texto: 'Toca el pequeño tubo ciego al principio del colon ascendente.' },
      comprobar: 'rel-mcburney',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['Estómago en J (cardias, fondo, cuerpo, píloro) → duodeno en C (cuatro porciones, papila en la descendente) → yeyuno e íleon en el mesenterio.', T(EST, 'The stomach has four main anatomical divisions'), T(DEL, 'The duodenum can be divided into four parts')],
        ['Colon: ascendente, transverso, descendente y sigmoide, con tenias y haustras; el apéndice, junto al ciego.', T(COL, 'can be divided into four parts (proximal to distal): ascending, transverse, descending and sigmoid.')],
      ],
    },
  ],
  preguntas: [
    {
      id: 'rel-delgado', tipo: 'relacion', objetivo: 2, paso: 'orientacion', estructuras: ['duodeno', 'yeyuno'],
      enunciado: '¿Qué tres partes tiene el intestino delgado?',
      correcta: 'Duodeno, yeyuno e íleon',
      distractores: ['Ciego, colon y recto', 'Cardias, cuerpo y píloro', 'Ascendente, transverso y descendente'],
      explicacion: 'Las otras listas son partes del grueso, del estómago y del colon.',
      evidencia: [T(DEL, 'Anatomically, the small bowel can be divided into three parts: the duodenum, jejunum, and ileum.')],
    },
    { id: 'id-estomago', tipo: 'identificar', estructura: 'estomago', objetivo: 0, paso: 'estomago' },
    {
      id: 'rel-partes-estomago', tipo: 'relacion', objetivo: 0, paso: 'estomago', estructuras: ['estomago'],
      enunciado: '¿Qué parte del estómago lo une al duodeno?',
      correcta: 'El píloro',
      distractores: ['El cardias', 'El fondo', 'La curvatura menor'],
      explicacion: 'El cardias rodea la entrada, arriba; el fondo es la parte redondeada por encima del cardias.',
      evidencia: [T(EST, 'Pylorus – connects the stomach to the duodenum.')],
    },
    { id: 'id-duodeno', tipo: 'identificar', estructura: 'duodeno', objetivo: 1, paso: 'duodeno' },
    {
      id: 'rel-papila', tipo: 'relacion', objetivo: 1, paso: 'duodeno', estructuras: ['duodeno'],
      enunciado: '¿En qué porción del duodeno está la papila duodenal mayor?',
      correcta: 'En la descendente',
      distractores: ['En la superior', 'En la inferior', 'En la ascendente'],
      explicacion: 'Por ella entran la bilis y el jugo pancreático.',
      evidencia: [T(DEL, 'Internally, the descending duodenum is marked by the major duodenal papilla')],
    },
    {
      id: 'sec-duodeno', tipo: 'secuencia', objetivo: 1, paso: 'duodeno',
      enunciado: 'Ordena las porciones del duodeno desde el píloro.',
      orden: ['Superior', 'Descendente', 'Inferior', 'Ascendente'],
      explicacion: 'Después de la ascendente viene la flexura duodenoyeyunal.',
      evidencia: [T(DEL, 'The duodenum can be divided into four parts: superior, descending, inferior and ascending.')],
    },
    {
      id: 'rel-mesenterio', tipo: 'relacion', objetivo: 2, paso: 'yeyuno-ileon', estructuras: ['yeyuno'],
      enunciado: '¿Qué sujeta el yeyuno y el íleon a la pared posterior del abdomen?',
      correcta: 'El mesenterio, una doble capa de peritoneo',
      distractores: ['El ligamento redondo', 'El diafragma', 'Las tenias del colon'],
      explicacion: 'Por el mesenterio llegan también las ramas de la mesentérica superior.',
      evidencia: [T(DEL, 'They are attached to the posterior abdominal wall by mesentery (a double layer of peritoneum).')],
    },
    { id: 'id-yeyuno', tipo: 'identificar', estructura: 'yeyuno', objetivo: 2, paso: 'yeyuno-ileon' },
    { id: 'id-colon-transverso', tipo: 'identificar', estructura: 'colon-transverso', objetivo: 3, paso: 'colon' },
    {
      id: 'comp-grueso', tipo: 'comparacion', objetivo: 3, paso: 'colon', estructuras: ['tenias', ...COLON],
      enunciado: '¿Qué distingue el intestino grueso del delgado?',
      correcta: 'Las tenias, las haustras y un diámetro mucho mayor',
      distractores: ['Que no tiene peritoneo', 'Que es más estrecho', 'Que está todo en la pelvis'],
      explicacion: 'Las tres tenias se contraen y forman las haustras.',
      evidencia: [T(COL, 'Running longitudinally along the surface of the large bowel are three strips of muscle, known as the teniae coli.'), T(COL, 'The large intestine has a much wider diameter compared to the small intestine.')],
    },
    {
      id: 'rel-transverso', tipo: 'relacion', objetivo: 3, paso: 'colon', estructuras: ['colon-transverso'],
      enunciado: '¿Qué parte del colon es intraperitoneal y la menos fija?',
      correcta: 'El colon transverso',
      distractores: ['El colon ascendente', 'El colon descendente', 'El ciego'],
      explicacion: 'Cuelga del mesocolon transverso; el ascendente y el descendente son retroperitoneales.',
      evidencia: [T(COL, 'The transverse colon is the least fixed part of the colon'), T(COL, 'the transverse colon is intraperitoneal')],
    },
    { id: 'id-apendice', tipo: 'identificar', estructura: 'apendice', objetivo: 4, paso: 'apendice' },
    {
      id: 'rel-mcburney', tipo: 'relacion', objetivo: 4, paso: 'apendice', estructuras: ['apendice'],
      enunciado: '¿Dónde está el punto de McBurney?',
      correcta: 'A un tercio del camino entre la espina ilíaca anterosuperior derecha y el ombligo',
      distractores: ['En el ombligo', 'Bajo las costillas derechas', 'En la línea media, sobre el pubis'],
      explicacion: 'El dolor de la apendicitis empieza alrededor del ombligo y acaba localizándose ahí.',
      evidencia: [T(APE, 'situated one third of the distance from the right anterior superior iliac spine to the umbilicus.')],
    },
  ],
});
