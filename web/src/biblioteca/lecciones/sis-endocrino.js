// Lección «Glándulas endocrinas». Formato y evidencias: ../formato.js.
import { leccion, W, MODELO } from '../formato.js';

const END = 'Endocrine_system';
const G = (nombre, piezas, lado = 'impar', papel = 'nucleo', tipo = 'glandula') => ({ nombre, piezas, lado, papel, tipo });

export default leccion({
  id: 'sis-endocrino',
  version: 1,
  titulo: 'Glándulas endocrinas',
  resumen: 'Qué es una glándula endocrina y en qué se diferencia de una exocrina, cuáles son las principales, dónde están en el modelo y qué hormona da cada una como ejemplo.',
  lugares: [],
  sistemas: ['endocrino'],
  formato: 'vision-general',
  temas: ['organos'],
  nivel: 1,
  minutos: 9,
  requisitos: ['fund-orientacion'],
  siguiente: ['cue-visceras', 'abd-rinones', 'cab-encefalo'],
  objetivos: [
    'Explicar cómo llegan las hormonas a sus órganos diana y en qué se diferencian las glándulas endocrinas de las exocrinas.',
    'Localizar en el modelo la hipófisis, la glándula pineal, la tiroides, las paratiroides y las suprarrenales.',
    'Asociar cada glándula principal con una hormona que produce.',
  ],
  estructuras: {
    hipofisis: G('Hipófisis', ['Adenohypophysis', 'Neurohypophysis']),
    pineal: G('Glándula pineal', ['Pineal_gland']),
    tiroides: G('Glándula tiroides', ['Thyroid_gland']),
    paratiroides: G('Glándulas paratiroides', ['Superior_parathyroid_gland', 'Inferior_parathyroid_gland'], 'bilateral'),
    suprarrenal: G('Glándula suprarrenal', ['Suprarenal_gland'], 'bilateral'),
    pancreas: G('Páncreas', ['Pancreas'], 'impar', 'contexto', 'organo'),
    rinon: G('Riñón', ['Kidney'], 'bilateral', 'contexto', 'organo'),
  },
  pasos: [
    {
      id: 'mensajeros', tipo: 'orientacion', titulo: 'Mensajes por la sangre',
      texto: [
        ['El sistema endocrino es un sistema de mensajeros: glándulas internas liberan hormonas directamente a la circulación, que regulan órganos lejanos.', W(END, 'The endocrine system is a messenger system in an organism comprising feedback loops of hormones that are released by internal glands directly into the circulatory system and that target and regulate distant organs.')],
        ['Las glándulas endocrinas no tienen conductos: vierten sus hormonas al espacio entre las células, de donde pasan a la sangre.', W(END, 'Endocrine glands have no ducts'), W(END, 'secrete their products, hormones, directly into interstitial spaces where they are absorbed into blood rather than through a duct')],
        ['Las exocrinas, como las salivales o las mamarias, sí tienen conductos o una luz.', W(END, 'In contrast, exocrine glands, such as salivary glands, mammary glands, and submucosal glands within the gastrointestinal tract, tend to be much less vascular and have ducts or a hollow lumen.')],
      ],
      vista: { capas: { skeletal: 'all', endocrine: 'all' }, ver: [], contexto: [], camara: 'anterior', lado: 'R' },
      comprobar: 'conductos',
    },
    {
      id: 'principales', tipo: 'explicacion', titulo: 'Las glándulas principales',
      texto: [
        ['Las principales son la tiroides, las paratiroides, la hipófisis, la pineal y las suprarrenales, además de los testículos o los ovarios.', W(END, 'In humans, the major endocrine glands are the thyroid, parathyroid, pituitary, pineal, and adrenal glands, and the (male) testis and (female) ovaries.')],
        ['El hipotálamo, el páncreas y el timo también funcionan como glándulas endocrinas, entre otras funciones.', W(END, 'The hypothalamus, pancreas, and thymus also function as endocrine glands, among other functions.')],
        ['En el modelo, las gónadas y el páncreas están en sus propios sistemas; aquí ves las glándulas del sistema endocrino.', MODELO],
      ],
      vista: { ver: ['hipofisis', 'pineal', 'tiroides', 'paratiroides', 'suprarrenal'], contexto: [], esqueleto: true, camara: 'anterior', lado: 'R' },
    },
    {
      id: 'cabeza', tipo: 'exploracion', titulo: 'Hipófisis y pineal',
      texto: [
        ['La hipófisis segrega la hormona del crecimiento y la pineal, la melatonina.', W(END, 'the pituitary secretes growth hormone, the pineal secretes melatonin')],
        ['El hipotálamo, en el encéfalo, junto a la hipófisis, une el sistema endocrino con el nervioso a través de ella.', W(END, 'it is located in the brain adjacent to the pituitary gland—is to link the endocrine system to the nervous system via the pituitary gland')],
      ],
      vista: { ver: ['hipofisis', 'pineal'], contexto: [], esqueleto: true, camara: 'lateral', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'hipofisis', texto: 'Toca la hipófisis, en la base del cráneo.' },
    },
    {
      id: 'cuello-abdomen', tipo: 'exploracion', titulo: 'Tiroides, paratiroides y suprarrenales',
      texto: [
        ['La tiroides segrega tiroxina.', W(END, 'The thyroid secretes thyroxine')],
        ['Las paratiroides, normalmente cuatro, están en la cara posterior de la tiroides y regulan el calcio de la sangre y de los huesos con la hormona paratiroidea.', W('Parathyroid_gland', 'Humans usually have four parathyroid glands, located on the back of the thyroid gland in variable locations.'), W('Parathyroid_gland', 'The parathyroid gland produces and secretes parathyroid hormone in response to low blood calcium, which plays a key role in regulating the amount of calcium in the blood and within the bones.')],
        ['Las suprarrenales están en el retroperitoneo, encima de los riñones y algo mediales a ellos.', W('Adrenal_gland', 'The adrenal glands are located on both sides of the body in the retroperitoneum, above and slightly medial to the kidneys.')],
        ['Los testículos segregan testosterona y los ovarios, estrógenos y progesterona.', W(END, 'the testis secretes testosterone, and the ovaries secrete estrogen and progesterone')],
      ],
      vista: { ver: ['tiroides', 'paratiroides'], contexto: [], esqueleto: true, camara: 'posterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['tiroides', 'paratiroides', 'suprarrenal'], texto: 'Alterna entre la tiroides, las paratiroides y la suprarrenal.' },
      comprobar: 'calcio',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['Las glándulas endocrinas no tienen conductos: sus hormonas van por la sangre a órganos lejanos.', W(END, 'Endocrine glands have no ducts'), W(END, 'that target and regulate distant organs')],
        ['Principales: tiroides, paratiroides, hipófisis, pineal, suprarrenales y gónadas.', W(END, 'the major endocrine glands are the thyroid, parathyroid, pituitary, pineal, and adrenal glands')],
        ['Ejemplos: tiroxina (tiroides), hormona del crecimiento (hipófisis), melatonina (pineal).', W(END, 'The thyroid secretes thyroxine, the pituitary secretes growth hormone, the pineal secretes melatonin')],
      ],
    },
  ],
  preguntas: [
    { id: 'id-tiroides', tipo: 'identificar', estructura: 'tiroides', objetivo: 1, paso: 'cuello-abdomen' },
    { id: 'id-suprarrenal', tipo: 'identificar', estructura: 'suprarrenal', objetivo: 1, paso: 'cuello-abdomen' },
    { id: 'id-hipofisis', tipo: 'identificar', estructura: 'hipofisis', objetivo: 1, paso: 'cabeza' },
    {
      id: 'conductos', tipo: 'comparacion', objetivo: 0, paso: 'mensajeros',
      enunciado: '¿En qué se diferencia una glándula endocrina de una exocrina?',
      correcta: 'La endocrina no tiene conductos y vierte sus hormonas a la sangre', distractores: ['La endocrina vierte su producto por un conducto al tubo digestivo', 'La exocrina vierte sus hormonas directamente a la sangre', 'Solo las exocrinas producen hormonas'],
      explicacion: 'Las exocrinas, como las salivales, tienen conductos o una luz.',
      evidencia: [W(END, 'Endocrine glands have no ducts'), W(END, 'have ducts or a hollow lumen')],
    },
    {
      id: 'hormonas-viaje', tipo: 'funcion', objetivo: 0, paso: 'mensajeros',
      enunciado: '¿Cómo llegan las hormonas a los órganos que regulan?',
      correcta: 'Por la circulación sanguínea', distractores: ['Por los nervios', 'Por conductos propios de cada glándula', 'Por la linfa, sin pasar a la sangre'],
      explicacion: 'Se liberan directamente a la circulación y regulan órganos lejanos.',
      evidencia: [W(END, 'hormones that are released by internal glands directly into the circulatory system')],
    },
    {
      id: 'melatonina', tipo: 'relacion', objetivo: 2, paso: 'cabeza', estructuras: ['pineal'],
      enunciado: '¿Qué glándula segrega melatonina?',
      correcta: 'La glándula pineal', distractores: ['La hipófisis', 'La tiroides', 'La suprarrenal'],
      explicacion: 'La pineal segrega melatonina; la hipófisis, por ejemplo, la hormona del crecimiento.',
      evidencia: [W(END, 'the pineal secretes melatonin')],
    },
    {
      id: 'tiroxina', tipo: 'relacion', objetivo: 2, paso: 'cuello-abdomen', estructuras: ['tiroides'],
      enunciado: '¿Qué hormona segrega la tiroides?',
      correcta: 'Tiroxina', distractores: ['Melatonina', 'Hormona del crecimiento', 'Testosterona'],
      explicacion: 'Tiroxina: tiroides. Melatonina: pineal. Hormona del crecimiento: hipófisis. Testosterona: testículos.',
      evidencia: [W(END, 'The thyroid secretes thyroxine')],
    },
    {
      id: 'calcio', tipo: 'relacion', objetivo: 2, paso: 'cuello-abdomen', estructuras: ['paratiroides'],
      enunciado: '¿Qué regula la hormona de las glándulas paratiroides?',
      correcta: 'El calcio de la sangre y de los huesos', distractores: ['El azúcar de la sangre', 'El ritmo de sueño y vigilia', 'El crecimiento de los huesos largos'],
      explicacion: 'La hormona paratiroidea se segrega cuando baja el calcio de la sangre.',
      evidencia: [W('Parathyroid_gland', 'which plays a key role in regulating the amount of calcium in the blood and within the bones')],
    },
    {
      id: 'crecimiento', tipo: 'relacion', objetivo: 2, paso: 'cabeza', estructuras: ['hipofisis'],
      enunciado: '¿Qué glándula segrega la hormona del crecimiento?',
      correcta: 'La hipófisis', distractores: ['La pineal', 'Las paratiroides', 'El timo'],
      explicacion: 'La hipófisis, unida al hipotálamo, enlaza el sistema endocrino con el nervioso.',
      evidencia: [W(END, 'the pituitary secretes growth hormone')],
    },
  ],
});
