// Lección «Tubo digestivo y glándulas anexas». Formato y evidencias: ../formato.js.
import { leccion, W, MODELO } from '../formato.js';

const DIG = 'Human_digestive_system';
const O = (nombre, piezas, papel = 'nucleo', lado = 'impar') => ({ nombre, piezas, lado, papel, tipo: 'organo' });

export default leccion({
  id: 'sis-digestivo',
  version: 1,
  titulo: 'Tubo digestivo y glándulas anexas',
  resumen: 'El recorrido del alimento desde la boca por el esófago, el estómago y los intestinos, qué hace cada tramo y las glándulas anexas: las salivales, el hígado con la vesícula biliar y el páncreas.',
  lugares: [['abdomen', 'organos-abdominales'], ['cabeza', 'cavidad-oral']],
  sistemas: ['digestivo'],
  formato: 'vision-general',
  temas: ['organos'],
  nivel: 1,
  minutos: 12,
  requisitos: ['fund-orientacion'],
  siguiente: ['abd-tubo-digestivo', 'abd-higado-pancreas', 'cab-boca'],
  objetivos: [
    'Ordenar los tramos del tubo digestivo desde la boca.',
    'Explicar qué ocurre en la boca, el estómago, el intestino delgado y el intestino grueso.',
    'Localizar en el modelo el estómago, el duodeno, el colon, el hígado, la vesícula biliar y el páncreas.',
    'Distinguir el tubo digestivo de las glándulas anexas y decir qué aporta cada glándula.',
  ],
  estructuras: {
    lengua: O('Lengua', ['Tongue'], 'contexto'),
    salivales: O('Glándulas salivales mayores', ['Parotid_gland', 'Submandibular_gland', 'Sublingual_gland'], 'contexto', 'bilateral'),
    esofago: O('Esófago', ['Oesophagus']),
    estomago: O('Estómago', ['Stomach']),
    duodeno: O('Duodeno', ['Duodenum']),
    yeyuno: O('Yeyuno', ['Jejunum']),
    colon: O('Colon', ['Ascending_colon', 'Transverse_colon', 'Descending_colon', 'Sigmoid_colon']),
    apendice: O('Apéndice vermiforme', ['Vermiform_appendix'], 'contexto'),
    higado: O('Hígado', ['Liver']),
    vesicula: O('Vesícula biliar', ['Gallbladder']),
    pancreas: O('Páncreas', ['Pancreas']),
  },
  pasos: [
    {
      id: 'partes', tipo: 'orientacion', titulo: 'Un tubo y sus glándulas',
      texto: [
        ['El sistema digestivo lo forman el tubo digestivo y los órganos anexos de la digestión: la lengua, las glándulas salivales, el páncreas, el hígado y la vesícula biliar.', W(DIG, 'The human digestive system consists of the gastrointestinal tract plus the accessory organs of digestion (the tongue, salivary glands, pancreas, liver, and gallbladder).')],
        ['El tubo empieza en la boca y termina en el ano, tras unos nueve metros.', W(DIG, 'This starts at the mouth and ends at the anus, covering a distance of about nine metres (30 ft).')],
      ],
      vista: { capas: { skeletal: 'all', digestive: 'all' }, ver: [], contexto: [], camara: 'anterior', lado: 'R' },
    },
    {
      id: 'boca-estomago', tipo: 'explicacion', titulo: 'De la boca al estómago',
      texto: [
        ['En la boca, la masticación rompe el alimento y las enzimas de la saliva empiezan a digerirlo.', W(DIG, 'continues in the mouth with the mechanical breakdown of food by chewing, and the chemical breakdown by digestive enzymes in the saliva')],
        ['Al masticar se forma un bolo que se traga y baja por el esófago hasta el estómago.', W(DIG, 'Chewing mixes the food with saliva to produce a food bolus to be swallowed down the esophagus to enter the stomach.')],
        ['El peristaltismo, una contracción rítmica de los músculos, empieza en el esófago y sigue por la pared del estómago y el resto del tubo.', W(DIG, 'Peristalsis is the rhythmic contraction of muscles that begins in the esophagus and continues along the wall of the stomach and the rest of the gastrointestinal tract.')],
      ],
      vista: { ver: ['esofago', 'estomago'], contexto: ['lengua', 'salivales'], esqueleto: true, camara: 'anterolateral', lado: 'R' },
    },
    {
      id: 'intestino-delgado', tipo: 'explicacion', titulo: 'Estómago e intestino delgado',
      texto: [
        ['El estómago tiene forma de J: se une arriba al esófago y abajo al duodeno.', W(DIG, 'It is a consistently J-shaped organ joined to the esophagus at its upper end and to the duodenum at its lower end.')],
        ['Allí el alimento se mezcla con el jugo gástrico hasta pasar al duodeno, la primera parte del intestino delgado.', W(DIG, 'where the food is further broken down by mixing with gastric juice until it passes into the duodenum, the first part of the small intestine')],
        ['La mayor parte de la digestión ocurre en el intestino delgado, el tramo más largo del tubo, aunque más estrecho que el grueso.', W(DIG, 'Most of the digestion of food takes place in the small intestine.'), W(DIG, 'The small intestine is the longest part of the GI tract but has a smaller diameter than the large intestine.')],
        ['Del intestino delgado, el modelo tiene el duodeno y el yeyuno; el íleon no está.', MODELO],
      ],
      vista: { ver: ['estomago', 'duodeno', 'yeyuno'], contexto: ['esofago'], esqueleto: true, camara: 'anterior', lado: 'R' },
      comprobar: 'digestion-delgado',
    },
    {
      id: 'intestino-grueso', tipo: 'explicacion', titulo: 'El intestino grueso',
      texto: [
        ['El intestino grueso absorbe agua y electrolitos y almacena los desechos, las heces, hasta la defecación.', W(DIG, 'It is followed by the large intestine, which further absorbs water and electrolytes from digestive contents, and stores the remaining waste matter (faeces) until it is expelled through defecation.')],
        ['Las heces salen del recto por el ano.', W(DIG, 'The waste products of digestion (feces) are excreted from the rectum via the anus.')],
        ['En el modelo ves el colon ascendente, transverso, descendente y sigmoideo y el apéndice; el ciego, el recto y el conducto anal no están.', MODELO],
      ],
      vista: { ver: ['colon'], contexto: ['apendice', 'yeyuno'], esqueleto: true, camara: 'anterior', lado: 'R' },
    },
    {
      id: 'glandulas', tipo: 'exploracion', titulo: 'Hígado, vesícula y páncreas',
      texto: [
        ['El hígado es el segundo órgano más grande, después de la piel, y una glándula anexa del aparato digestivo.', W(DIG, 'The liver is the second largest organ (after the skin) and is an accessory digestive gland which plays a role in the body\'s metabolism.')],
        ['Está en el cuadrante superior derecho del abdomen, debajo del diafragma.', W(DIG, 'The liver is located in the upper right quadrant of the abdomen and below the diaphragm')],
        ['La bilis que produce sale por el conducto hepático común, que se une al conducto cístico de la vesícula biliar para formar el colédoco.', W(DIG, 'Bile is collected and delivered through the common hepatic duct.'), W(DIG, 'This duct joins with the cystic duct to connect in a common bile duct with the gallbladder.')],
        ['En la fase intestinal, el alimento se mezcla con las enzimas digestivas del páncreas.', W(DIG, 'The intestinal phase where the partially digested food is mixed with pancreatic digestive enzymes completes the process of digestion.')],
      ],
      vista: { ver: ['higado', 'vesicula', 'pancreas'], contexto: ['duodeno', 'estomago'], esqueleto: true, camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'vesicula', texto: 'Toca la vesícula biliar, debajo del hígado.' },
      comprobar: 'higado-lugar',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['Boca → esófago → estómago → intestino delgado (duodeno primero) → intestino grueso → recto y ano.', W(DIG, 'to be swallowed down the esophagus to enter the stomach'), W(DIG, 'the duodenum, the first part of the small intestine'), W(DIG, 'excreted from the rectum via the anus')],
        ['La mayor parte de la digestión ocurre en el intestino delgado; el grueso absorbe agua y electrolitos.', W(DIG, 'Most of the digestion of food takes place in the small intestine.'), W(DIG, 'which further absorbs water and electrolytes from digestive contents')],
        ['Glándulas anexas: salivales, hígado (bilis, que guarda la vesícula) y páncreas (enzimas digestivas).', W(DIG, 'the accessory organs of digestion (the tongue, salivary glands, pancreas, liver, and gallbladder)')],
      ],
    },
  ],
  preguntas: [
    { id: 'id-estomago', tipo: 'identificar', estructura: 'estomago', objetivo: 2, paso: 'intestino-delgado' },
    { id: 'id-pancreas', tipo: 'identificar', estructura: 'pancreas', objetivo: 2, paso: 'glandulas' },
    { id: 'id-duodeno', tipo: 'identificar', estructura: 'duodeno', objetivo: 2, paso: 'intestino-delgado' },
    { id: 'loc-higado', tipo: 'localizar', estructura: 'higado', candidatas: ['estomago', 'colon'], objetivo: 2, paso: 'glandulas' },
    {
      id: 'orden', tipo: 'secuencia', objetivo: 0, paso: 'intestino-delgado',
      enunciado: 'Ordena el recorrido del alimento.',
      orden: ['Esófago', 'Estómago', 'Duodeno', 'Intestino grueso'],
      explicacion: 'El bolo baja por el esófago al estómago, pasa al duodeno (primera parte del intestino delgado) y, al final, al intestino grueso.',
      evidencia: [W(DIG, 'to be swallowed down the esophagus to enter the stomach'), W(DIG, 'until it passes into the duodenum, the first part of the small intestine'), W(DIG, 'It is followed by the large intestine')],
    },
    {
      id: 'digestion-delgado', tipo: 'funcion', objetivo: 1, paso: 'intestino-delgado',
      enunciado: '¿Dónde ocurre la mayor parte de la digestión?',
      correcta: 'En el intestino delgado', distractores: ['En el estómago', 'En la boca', 'En el intestino grueso'],
      explicacion: 'El estómago la continúa, pero la mayor parte ocurre en el intestino delgado.',
      evidencia: [W(DIG, 'Most of the digestion of food takes place in the small intestine.')],
    },
    {
      id: 'grueso', tipo: 'funcion', objetivo: 1, paso: 'intestino-grueso', estructuras: ['colon'],
      enunciado: '¿Qué hace el intestino grueso?',
      correcta: 'Absorbe agua y electrolitos y almacena las heces', distractores: ['Produce la bilis', 'Mezcla el alimento con el jugo gástrico', 'Digiere la mayor parte del alimento'],
      explicacion: 'La bilis la produce el hígado y el jugo gástrico es del estómago.',
      evidencia: [W(DIG, 'which further absorbs water and electrolytes from digestive contents, and stores the remaining waste matter (faeces)')],
    },
    {
      id: 'peristaltismo', tipo: 'funcion', objetivo: 1, paso: 'boca-estomago',
      enunciado: '¿Qué es el peristaltismo?',
      correcta: 'La contracción rítmica de los músculos de la pared del tubo digestivo', distractores: ['La rotura del alimento con los dientes', 'La secreción de bilis', 'La absorción de agua en el colon'],
      explicacion: 'Empieza en el esófago y continúa por el estómago y el resto del tubo.',
      evidencia: [W(DIG, 'Peristalsis is the rhythmic contraction of muscles that begins in the esophagus and continues along the wall of the stomach and the rest of the gastrointestinal tract.')],
    },
    {
      id: 'higado-lugar', tipo: 'relacion', objetivo: 2, paso: 'glandulas', estructuras: ['higado'],
      enunciado: '¿Dónde está el hígado?',
      correcta: 'En el cuadrante superior derecho del abdomen, bajo el diafragma', distractores: ['En el cuadrante superior izquierdo, junto al bazo', 'Detrás del estómago, en el centro', 'En la pelvis, junto a la vejiga'],
      explicacion: 'Está arriba y a la derecha, unido al diafragma en una zona (el área desnuda).',
      evidencia: [W(DIG, 'The liver is located in the upper right quadrant of the abdomen and below the diaphragm')],
    },
    {
      id: 'anexas', tipo: 'relacion', objetivo: 3, paso: 'partes',
      enunciado: '¿Cuál de estos órganos es una glándula anexa y no un tramo del tubo digestivo?',
      correcta: 'El páncreas', distractores: ['El duodeno', 'El esófago', 'El colon'],
      explicacion: 'Las anexas (salivales, hígado, vesícula y páncreas) están fuera del tubo y vierten en él.',
      evidencia: [W(DIG, 'the accessory organs of digestion (the tongue, salivary glands, pancreas, liver, and gallbladder)')],
    },
    {
      id: 'bilis', tipo: 'relacion', objetivo: 3, paso: 'glandulas', estructuras: ['vesicula'],
      enunciado: '¿Con qué conducto se une el conducto hepático común para formar el colédoco?',
      correcta: 'Con el conducto cístico, de la vesícula biliar', distractores: ['Con el conducto pancreático', 'Con el esófago', 'Con el conducto torácico'],
      explicacion: 'La bilis del hígado baja por el hepático común, que se une al cístico de la vesícula.',
      evidencia: [W(DIG, 'This duct joins with the cystic duct to connect in a common bile duct with the gallbladder.')],
    },
  ],
});
