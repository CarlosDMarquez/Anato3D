// Lección «Riñones y glándulas suprarrenales». Formato y evidencias: ../formato.js.
import { leccion, W, T, GUIA, MODELO } from '../formato.js';

const RIN = 'abdomen/viscera/kidney';
const SUP = 'abdomen/viscera/adrenal-glands';
const org = (nombre, piezas, tipo = 'organo') => ({ nombre, piezas, lado: 'ambos', papel: 'nucleo', tipo });
const vaso = (nombre, pieza, tipo) => ({ nombre, piezas: [pieza], lado: 'impar', papel: 'nucleo', tipo });
const contexto = (nombre, piezas, tipo, lado = 'impar', extra = {}) => ({ nombre, piezas, lado, papel: 'contexto', tipo, ...extra });

const ARTERIAS = ['arteria-renal-derecha', 'arteria-renal-izquierda'];
const VENAS = ['vena-renal-derecha', 'vena-renal-izquierda'];
const GRANDES = ['aorta', 'cava'];

export default leccion({
  id: 'abd-rinones',
  version: 1,
  titulo: 'Riñones y glándulas suprarrenales',
  resumen: 'Dónde están los riñones y qué los rodea, cómo son por dentro, cómo llegan y salen las arterias y venas renales (y por qué la vena izquierda es más larga), el trayecto del uréter hasta la vejiga y las glándulas suprarrenales, con las hormonas de su corteza y su médula.',
  lugares: [['abdomen', 'retroperitoneo']],
  sistemas: ['urinario', 'endocrino'],
  formato: 'topografia',
  temas: ['organos', 'arterias-venas'],
  nivel: 2,
  minutos: 18,
  requisitos: ['sis-urinario', 'sis-endocrino'],
  siguiente: ['abd-vasos', 'pel-pelvis-osea', 'abd-pared'],
  objetivos: [
    'Situar los riñones respecto a la columna, las costillas y los órganos vecinos, y explicar por qué el derecho está más bajo.',
    'Describir las partes internas del riñón y lo que entra y sale por el hilio.',
    'Relacionar las arterias y venas renales con la aorta y la vena cava, y explicar por qué la vena renal izquierda es más larga.',
    'Seguir el trayecto del uréter hasta la vejiga.',
    'Localizar las glándulas suprarrenales y distinguir las hormonas de su corteza y su médula.',
  ],
  estructuras: {
    rinon: org('Riñones', ['Kidney']),
    'pelvis-renal': org('Pelvis renal', ['Renal_pelvis']),
    ureter: org('Uréteres', ['Ureter']),
    suprarrenal: org('Glándulas suprarrenales', ['Suprarenal_gland'], 'glandula'),
    'arteria-renal-derecha': vaso('Arteria renal derecha', 'Right_renal_artery', 'arteria'),
    'arteria-renal-izquierda': vaso('Arteria renal izquierda', 'Left_renal_artery', 'arteria'),
    'vena-renal-derecha': vaso('Vena renal derecha', 'Right_renal_vein', 'vena'),
    'vena-renal-izquierda': vaso('Vena renal izquierda', 'Left_renal_vein', 'vena'),
    aorta: contexto('Aorta abdominal', ['Abdominal_aorta'], 'arteria'),
    cava: contexto('Vena cava inferior', ['Inferior_vena_cava_abdominal_part'], 'vena'),
    'mesenterica-superior': contexto('Arteria mesentérica superior', ['Superior_mesenteric_artery'], 'arteria'),
    'ramas-renales': contexto('Ramas anterior y posterior de la arteria renal', ['Anterior_branch_of_renal_artery', 'Posterior_branch_of_renal_artery'], 'arteria', 'ambos'),
    'iliacas-comunes': contexto('Arterias ilíacas comunes', ['Common_iliac_artery'], 'arteria', 'ambos'),
    'vena-testicular': contexto('Vena testicular izquierda', ['Left_testicular_vein'], 'vena', 'impar', { modelos: ['male'] }),
    'vena-ovarica': contexto('Vena ovárica izquierda', ['Left_ovarian_vein'], 'vena', 'impar', { modelos: ['female'] }),
    vejiga: contexto('Vejiga urinaria', ['Urinary_bladder'], 'organo'),
    psoas: contexto('Músculos psoas mayores', ['Psoas_major'], 'musculo', 'ambos'),
    'cuadrado-lumbar': contexto('Músculos cuadrados lumbares', ['Quadratus_lumborum_muscle'], 'musculo', 'ambos'),
    diafragma: contexto('Diafragma', ['Diaphragm'], 'musculo'),
    higado: contexto('Hígado', ['Liver'], 'organo'),
    bazo: contexto('Bazo', ['Spleen'], 'organo'),
    costillas: contexto('Costillas 11.ª y 12.ª', ['Rib_11', 'Rib_12'], 'hueso', 'ambos'),
    lumbares: contexto('Vértebras T12 a L3', ['Vertebra_T12', 'Vertebra_L1', 'Vertebra_L2', 'Vertebra_L3'], 'hueso'),
  },
  pasos: [
    {
      id: 'orientacion', tipo: 'orientacion', titulo: 'Los riñones',
      texto: [
        ['Los riñones son dos órganos en forma de judía, de color pardo rojizo, en la parte posterior del abdomen.', T(RIN, 'The kidneys are bilateral bean-shaped organs, reddish-brown in colour and located in the posterior abdomen.')],
        ['Filtran y eliminan desechos de la sangre y mantienen el equilibrio de agua y electrolitos.', T(RIN, 'Their main function is to filter and excrete waste products from the blood. They are also responsible for water and electrolyte balance in the body.')],
        ['Míralos de frente y por detrás, con la aorta y la cava entre los dos.', GUIA],
      ],
      vista: { ver: ['rinon', 'suprarrenal', 'ureter'], contexto: [...GRANDES, 'lumbares'], camara: 'anterior' },
      actividad: { tipo: 'vistas', texto: 'Recorre los riñones.', vistas: [{ nombre: 'De frente', camara: 'anterior' }, { nombre: 'Por detrás', camara: 'posterior' }, { nombre: 'De lado', camara: 'lateral' }] },
      comprobar: 'fun-rinon',
    },
    {
      id: 'posicion', tipo: 'explicacion', titulo: 'Dónde están',
      texto: [
        ['Están detrás del peritoneo (retroperitoneales), uno a cada lado de la columna, de T12 a L3; cada uno mide unas tres vértebras.', T(RIN, 'The kidneys lie retroperitoneally (behind the peritoneum) in the abdomen, either side of the vertebral column.'), T(RIN, 'They typically extend from T12 to L3'), T(RIN, 'Each kidney is approximately three vertebrae in length.')],
        ['El derecho suele estar algo más bajo, por el hígado; el izquierdo queda detrás del bazo, y las costillas 11.ª y 12.ª protegen en parte sus polos superiores.', T(RIN, 'although the right kidney is often situated slightly lower due to the presence of the liver.'), W('Kidney', 'The left kidney sits below the diaphragm and posterior to the spleen.'), W('Kidney', 'The upper parts of the kidneys are partially protected by the 11th and 12th ribs.')],
      ],
      detalle: [
        ['Los envuelven, de dentro afuera, la cápsula renal, la grasa perirrenal, la fascia renal (que encierra también las suprarrenales) y la grasa pararrenal.', T(RIN, 'Renal capsule – tough fibrous capsule.'), T(RIN, 'Perirenal fat – collection of extraperitoneal fat.'), T(RIN, 'encloses the kidneys and the suprarenal glands.'), T(RIN, 'Pararenal fat – mainly located on the posterolateral aspect of the kidney.')],
        ['La grasa y la fascia renal no están en el modelo.', MODELO],
      ],
      vista: { ver: ['rinon'], contexto: ['higado', 'bazo', 'costillas', 'lumbares'], fantasma: ['psoas', 'cuadrado-lumbar', 'diafragma'], camara: 'posterior' },
      actividad: { tipo: 'vistas', texto: 'Compara la altura de los dos riñones.', vistas: [{ nombre: 'Por detrás', camara: 'posterior' }, { nombre: 'De frente', camara: 'anterior' }] },
      comprobar: 'rel-derecho-bajo',
    },
    {
      id: 'interior', tipo: 'explicacion', titulo: 'Por dentro',
      texto: [
        ['El tejido del riñón tiene una corteza externa y una médula interna; la corteza se mete en la médula y la divide en pirámides.', T(RIN, 'The renal parenchyma can be divided into two main areas – the outer cortex and inner medulla. The cortex extends into the medulla, dividing it into triangular shapes – these are known as renal pyramids.')],
        ['La punta de cada pirámide, la papila, vierte la orina en un cáliz menor; los cálices se reúnen en la pelvis renal, en forma de embudo, que sigue en el uréter.', T(RIN, 'The apex of a renal pyramid is called a renal papilla. Each renal papilla is associated with a structure known as the minor calyx, which collects urine from the pyramids.'), T(RIN, 'Urine passes through the major calices into the renal pelvis, a flattened and funnel-shaped structure. From the renal pelvis, urine drains into the ureter')],
        ['En el borde medial está el hilio, por donde entran y salen los vasos renales y el uréter.', T(RIN, 'The medial margin of each kidney is marked by a deep fissure, known as the renal hilum. This acts as a gateway to the kidney – normally the renal vessels and ureter enter/exit the kidney via this structure.')],
      ],
      detalle: [
        ['El modelo tiene la pelvis renal dentro de cada riñón, pero no la corteza, la médula, las pirámides ni los cálices por separado.', MODELO],
      ],
      vista: { ver: ['pelvis-renal'], contexto: ['ureter'], fantasma: ['rinon'], camara: 'anterior' },
      actividad: { tipo: 'localizar', estructura: 'pelvis-renal', texto: 'Toca el embudo que recoge la orina dentro del riñón.' },
      comprobar: 'rel-hilio',
    },
    {
      id: 'vasos', tipo: 'relaciones', titulo: 'Arterias y venas renales',
      texto: [
        ['Las arterias renales salen de la aorta justo por debajo de la mesentérica superior; la derecha es más larga y pasa por detrás de la vena cava.', T(RIN, 'The kidneys are supplied with blood via the renal arteries, which arise directly from the abdominal aorta, immediately distal to the origin of the superior mesenteric artery.'), T(RIN, 'the right renal artery is longer, and crosses the vena cava posteriorly.')],
        ['Las venas renales salen del hilio por delante de las arterias y desembocan en la vena cava inferior.', T(RIN, 'They leave the renal hilum anteriorly to the renal arteries, and empty directly into the inferior vena cava.')],
        ['Como la cava está a la derecha, la vena renal izquierda es más larga y cruza por delante de la aorta, bajo la mesentérica superior.', T(RIN, 'As the vena cava lies slightly to the right, the left renal vein is longer, and travels anteriorly to the abdominal aorta below the origin of the superior mesenteric artery.')],
      ],
      detalle: [
        ['La vena renal izquierda recibe además la vena suprarrenal y la gonadal (testicular u ovárica) de su lado.', W('Renal_vein', 'the left renal vein often receives the ipsilateral inferior phrenic vein, suprarenal vein, gonadal vein (left testicular vein in males, left ovarian vein in females), and 2nd lumbar vein.')],
        ['Las ramas de la arteria renal son terminales: no se comunican entre sí, así que si una se obstruye muere el tejido que irriga.', T(RIN, 'The renal artery branches are anatomical end arteries – there is no communication between vessels.'), T(RIN, 'trauma or obstruction in one arterial branch will eventually lead to ischaemia and necrosis of the renal parenchyma supplied by this vessel.')],
      ],
      vista: { ver: [...ARTERIAS, ...VENAS], contexto: [...GRANDES, 'mesenterica-superior', 'ramas-renales', 'vena-testicular', 'vena-ovarica'], fantasma: ['rinon'], camara: 'anterior' },
      actividad: { tipo: 'comparar', estructuras: VENAS, texto: 'Alterna las dos venas renales: la izquierda, larga, cruza por delante de la aorta; la derecha llega enseguida a la cava.' },
      comprobar: 'rel-vena-izquierda',
    },
    {
      id: 'ureter', tipo: 'exploracion', titulo: 'El uréter',
      texto: [
        ['Los uréteres son tubos de músculo liso, de unos 20 a 30 cm, que llevan la orina de la pelvis renal a la vejiga.', W('Ureter', 'The ureters are tubes composed of smooth muscle that transports urine from the kidneys to the urinary bladder.'), W('Ureter', 'approximately 20–30 cm (8–12 in) in adults, that pass from the pelvis of each kidney into the bladder.')],
        ['Bajan sobre el psoas mayor hasta el borde de la pelvis, donde cruzan por delante de las arterias ilíacas comunes.', W('Ureter', 'From the renal pelvis, they descend on top of the psoas major muscle to reach the brim of the pelvis.'), W('Ureter', 'Here, they cross in front of the common iliac arteries.')],
        ['Luego siguen por las paredes de la pelvis y entran en la vejiga por su cara posterior.', W('Ureter', 'They then pass down along the sides of the pelvis and finally curve forward and enter the bladder from its left and right sides at the back of the bladder.')],
      ],
      detalle: [
        ['Se describen tres sitios donde se suelen atascar los cálculos: la unión con la pelvis renal, el cruce con los vasos ilíacos y la entrada en la vejiga, aunque un estudio de imagen encontró pocos en el cruce ilíaco.', W('Ureter', 'It is classically described that there are three sites in the ureter where a kidney stone will commonly become stuck:'), W('Ureter', 'where the ureter meets the renal pelvis; where the iliac blood vessels cross the ureters; and where the ureters enter the urinary bladder, however a retrospective case study')],
      ],
      vista: { ver: ['ureter'], contexto: ['rinon', 'psoas', 'iliacas-comunes', 'vejiga', ...GRANDES], camara: 'anterior' },
      actividad: { tipo: 'localizar', estructura: 'ureter', texto: 'Toca uno de los tubos que bajan sobre el psoas hasta la vejiga.' },
      comprobar: 'rel-iliacas',
    },
    {
      id: 'suprarrenales', tipo: 'exploracion', titulo: 'Las glándulas suprarrenales',
      texto: [
        ['Las suprarrenales son glándulas endocrinas sobre la parte medial del polo superior de cada riñón, entre el riñón y el diafragma.', T(SUP, 'The adrenal (or suprarenal) glands are paired endocrine glands situated over the medial aspect of the upper poles of each kidney.'), T(SUP, 'The adrenal glands are located in the posterior abdomen, between the superomedial kidney and the diaphragm.')],
        ['La derecha es piramidal y la izquierda, semilunar; la fascia renal las envuelve con los riñones.', T(SUP, 'The right gland is pyramidal in shape, contrasting with the semi-lunar shape of the left gland.'), T(SUP, 'Perinephric (or renal) fascia encloses the adrenal glands and the kidneys.')],
        ['La corteza fabrica aldosterona, cortisol y andrógenos; la médula, adrenalina ante el estrés.', T(SUP, 'Zona glomerulosa – produces and secretes mineralocorticoids such as aldosterone.'), T(SUP, 'Zona fasciculata – produces and secretes corticosteroids such as cortisol.'), T(SUP, 'Zona reticularis – produces and secretes androgens'), T(SUP, 'It contains chromaffin cells, which secrete catecholamines (such as adrenaline) into the bloodstream in response to stress.')],
      ],
      detalle: [
        ['Corteza y médula son en realidad dos glándulas distintas, con orígenes embrionarios diferentes.', T(SUP, 'They are two separate endocrine glands, with different embryological origins:')],
        ['El modelo representa cada suprarrenal como una sola pieza, sin separar corteza y médula.', MODELO],
      ],
      vista: { ver: ['suprarrenal'], contexto: ['rinon', 'diafragma', ...GRANDES], camara: 'anterior' },
      actividad: { tipo: 'vistas', texto: 'Compara la forma de las dos suprarrenales.', vistas: [{ nombre: 'De frente', camara: 'anterior' }, { nombre: 'Por detrás', camara: 'posterior' }, { nombre: 'Desde arriba', camara: 'superior' }] },
      comprobar: 'comp-corteza-medula',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['Riñones retroperitoneales de T12 a L3; el derecho, algo más bajo por el hígado.', T(RIN, 'They typically extend from T12 to L3, although the right kidney is often situated slightly lower due to the presence of the liver.')],
        ['Por el hilio entran y salen los vasos y el uréter; la vena renal izquierda, más larga, cruza por delante de la aorta.', T(RIN, 'normally the renal vessels and ureter enter/exit the kidney via this structure.'), T(RIN, 'the left renal vein is longer, and travels anteriorly to the abdominal aorta')],
        ['El uréter baja sobre el psoas y cruza las ilíacas comunes; las suprarrenales coronan los riñones.', W('Ureter', 'they descend on top of the psoas major muscle'), W('Ureter', 'they cross in front of the common iliac arteries.'), T(SUP, 'situated over the medial aspect of the upper poles of each kidney.')],
      ],
    },
  ],
  preguntas: [
    {
      id: 'fun-rinon', tipo: 'funcion', objetivo: 0, paso: 'orientacion', estructuras: ['rinon'],
      enunciado: '¿Cuál es la función principal de los riñones?',
      correcta: 'Filtrar y eliminar desechos de la sangre',
      distractores: ['Fabricar la bilis', 'Almacenar la orina', 'Producir los glóbulos rojos de la médula ósea'],
      explicacion: 'Filtran la sangre y mantienen el equilibrio de agua y electrolitos; la orina se almacena en la vejiga.',
      evidencia: [T(RIN, 'Their main function is to filter and excrete waste products from the blood.')],
    },
    { id: 'id-rinon', tipo: 'identificar', estructura: 'rinon', objetivo: 0, paso: 'posicion' },
    {
      id: 'rel-derecho-bajo', tipo: 'relacion', objetivo: 0, paso: 'posicion', estructuras: ['rinon', 'higado'],
      enunciado: '¿Por qué el riñón derecho suele estar algo más bajo que el izquierdo?',
      correcta: 'Por el hígado, que está encima',
      distractores: ['Por el bazo, que está encima', 'Porque la aorta está a la derecha', 'Porque es más grande'],
      explicacion: 'El hígado ocupa la parte superior derecha del abdomen y empuja el riñón derecho hacia abajo; el bazo está encima del izquierdo.',
      evidencia: [T(RIN, 'the right kidney is often situated slightly lower due to the presence of the liver.')],
    },
    {
      id: 'rel-altura', tipo: 'relacion', objetivo: 0, paso: 'posicion', estructuras: ['rinon', 'lumbares'],
      enunciado: '¿Entre qué vértebras se extienden normalmente los riñones?',
      correcta: 'De T12 a L3',
      distractores: ['De T6 a T10', 'De L3 a S1', 'De T1 a T4'],
      explicacion: 'Cada riñón mide unas tres vértebras, de T12 a L3.',
      evidencia: [T(RIN, 'They typically extend from T12 to L3')],
    },
    { id: 'id-pelvis-renal', tipo: 'identificar', estructura: 'pelvis-renal', objetivo: 1, paso: 'interior' },
    {
      id: 'rel-hilio', tipo: 'relacion', objetivo: 1, paso: 'interior', estructuras: ['rinon', 'pelvis-renal'],
      enunciado: '¿Qué pasa por el hilio renal?',
      correcta: 'Los vasos renales y el uréter',
      distractores: ['La glándula suprarrenal', 'Solo los nervios', 'El conducto colédoco'],
      explicacion: 'El hilio es la puerta del riñón, en su borde medial, para los vasos y el uréter.',
      evidencia: [T(RIN, 'normally the renal vessels and ureter enter/exit the kidney via this structure.')],
    },
    {
      id: 'sec-orina', tipo: 'secuencia', objetivo: 1, paso: 'interior',
      enunciado: 'Ordena el camino de la orina dentro del riñón.',
      orden: ['Papila renal', 'Cáliz menor', 'Cáliz mayor', 'Pelvis renal', 'Uréter'],
      explicacion: 'La papila vierte en un cáliz menor; los menores se unen en mayores, que desembocan en la pelvis renal y esta en el uréter.',
      evidencia: [T(RIN, 'Several minor calices merge to form a major calyx. Urine passes through the major calices into the renal pelvis')],
    },
    {
      id: 'rel-vena-izquierda', tipo: 'relacion', objetivo: 2, paso: 'vasos', estructuras: VENAS,
      enunciado: '¿Por qué la vena renal izquierda es más larga que la derecha?',
      correcta: 'Porque la vena cava inferior está a la derecha y la izquierda tiene que cruzar la aorta',
      distractores: ['Porque el riñón izquierdo está más bajo', 'Porque desemboca en la vena porta', 'Porque pasa por detrás de la vena cava'],
      explicacion: 'La cava está algo a la derecha: la vena izquierda cruza por delante de la aorta, bajo la mesentérica superior, para llegar a ella.',
      evidencia: [T(RIN, 'As the vena cava lies slightly to the right, the left renal vein is longer, and travels anteriorly to the abdominal aorta below the origin of the superior mesenteric artery.')],
    },
    {
      id: 'rel-arteria-derecha', tipo: 'relacion', objetivo: 2, paso: 'vasos', estructuras: ['arteria-renal-derecha', 'cava'],
      enunciado: '¿Por dónde pasa la arteria renal derecha respecto a la vena cava inferior?',
      correcta: 'Por detrás',
      distractores: ['Por delante', 'Por dentro de ella', 'No se cruzan'],
      explicacion: 'La aorta está algo a la izquierda, así que la arteria renal derecha es más larga y cruza por detrás de la cava.',
      evidencia: [T(RIN, 'the right renal artery is longer, and crosses the vena cava posteriorly.')],
    },
    { id: 'id-vena-renal-izquierda', tipo: 'identificar', estructura: 'vena-renal-izquierda', objetivo: 2, paso: 'vasos' },
    { id: 'id-arteria-renal-derecha', tipo: 'identificar', estructura: 'arteria-renal-derecha', objetivo: 2, paso: 'vasos' },
    {
      id: 'rel-iliacas', tipo: 'relacion', objetivo: 3, paso: 'ureter', estructuras: ['ureter', 'iliacas-comunes'],
      enunciado: '¿Qué cruza el uréter al llegar al borde de la pelvis?',
      correcta: 'Pasa por delante de las arterias ilíacas comunes',
      distractores: ['Pasa por detrás de la aorta', 'Atraviesa el psoas mayor', 'Pasa por delante de la vena renal'],
      explicacion: 'Baja sobre el psoas y, en el borde de la pelvis, cruza por delante de las ilíacas comunes.',
      evidencia: [W('Ureter', 'Here, they cross in front of the common iliac arteries.')],
    },
    { id: 'loc-ureter', tipo: 'localizar', estructura: 'ureter', candidatas: ['pelvis-renal', 'suprarrenal'], objetivo: 3, paso: 'ureter' },
    { id: 'id-suprarrenal', tipo: 'identificar', estructura: 'suprarrenal', objetivo: 4, paso: 'suprarrenales' },
    {
      id: 'comp-corteza-medula', tipo: 'comparacion', objetivo: 4, paso: 'suprarrenales', estructuras: ['suprarrenal'],
      enunciado: '¿Qué hormona fabrica la médula suprarrenal?',
      correcta: 'Adrenalina',
      distractores: ['Aldosterona', 'Cortisol', 'Insulina'],
      explicacion: 'La aldosterona y el cortisol son de la corteza; la insulina, del páncreas.',
      evidencia: [T(SUP, 'It contains chromaffin cells, which secrete catecholamines (such as adrenaline) into the bloodstream in response to stress.')],
    },
    {
      id: 'rel-forma', tipo: 'relacion', objetivo: 4, paso: 'suprarrenales', estructuras: ['suprarrenal'],
      enunciado: '¿Qué forma tienen las glándulas suprarrenales?',
      correcta: 'La derecha, piramidal; la izquierda, semilunar',
      distractores: ['La derecha, semilunar; la izquierda, piramidal', 'Las dos son esféricas', 'Las dos son alargadas como el uréter'],
      explicacion: 'Se distinguen por la forma: piramidal a la derecha, de media luna a la izquierda.',
      evidencia: [T(SUP, 'The right gland is pyramidal in shape, contrasting with the semi-lunar shape of the left gland.')],
    },
  ],
});
