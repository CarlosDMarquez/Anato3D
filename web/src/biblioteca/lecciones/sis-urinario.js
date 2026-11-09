// Lección «Riñones, uréteres, vejiga y uretra». Formato y evidencias: ../formato.js.
import { leccion, W, GUIA, MODELO } from '../formato.js';

const URI = 'Urinary_system';
const O = (nombre, piezas, lado = 'impar', papel = 'nucleo', tipo = 'organo') => ({ nombre, piezas, lado, papel, tipo });

export default leccion({
  id: 'sis-urinario',
  version: 1,
  titulo: 'Riñones, uréteres, vejiga y uretra',
  resumen: 'Los cuatro órganos del sistema urinario, para qué sirve, cómo se forma la orina en las nefronas y el camino que sigue hasta salir, con los vasos renales y lo que cambia entre hombres y mujeres.',
  lugares: [['abdomen', 'retroperitoneo'], ['pelvis', 'organos-pelvicos']],
  sistemas: ['urinario'],
  formato: 'vision-general',
  temas: ['organos'],
  nivel: 1,
  minutos: 9,
  requisitos: ['fund-orientacion'],
  siguiente: ['abd-rinones', 'sis-reproductor-masculino', 'sis-reproductor-femenino'],
  objetivos: [
    'Nombrar los órganos del sistema urinario y localizarlos en el modelo.',
    'Explicar las funciones del sistema urinario.',
    'Seguir el camino de la orina desde la nefrona hasta la vejiga.',
    'Indicar en qué se diferencia el sistema urinario masculino del femenino.',
  ],
  estructuras: {
    rinon: O('Riñón', ['Kidney'], 'bilateral'),
    'pelvis-renal': O('Pelvis renal', ['Renal_pelvis'], 'bilateral'),
    ureter: O('Uréter', ['Ureter'], 'bilateral'),
    vejiga: O('Vejiga urinaria', ['Urinary_bladder']),
    uretra: O('Uretra', ['Urethra']),
    'arteria-renal': O('Arteria renal derecha', ['Right_renal_artery'], 'impar', 'contexto', 'arteria'),
    'vena-renal': O('Vena renal derecha', ['Right_renal_vein'], 'impar', 'contexto', 'vena'),
  },
  pasos: [
    {
      id: 'organos', tipo: 'orientacion', titulo: 'Cuatro órganos',
      texto: [
        ['El sistema urinario lo forman los riñones, los uréteres, la vejiga y la uretra.', W(URI, 'it consists of the kidneys, ureters, bladder, and the urethra')],
        ['Los dos riñones están entre la pared posterior del cuerpo y el peritoneo parietal, uno a cada lado.', W(URI, 'there are two kidneys that are located between the dorsal body wall and parietal peritoneum on both the left and right sides')],
      ],
      vista: { capas: { skeletal: 'all', urogenital: 'urinary' }, ver: [], contexto: [], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'Mira los riñones desde atrás: están pegados a la pared posterior del abdomen.', vistas: [{ nombre: 'De frente', camara: 'anterior' }, { nombre: 'Desde atrás', camara: 'posterior' }] },
    },
    {
      id: 'funciones', tipo: 'funcion', titulo: 'Para qué sirve',
      texto: [
        ['Elimina la orina y regula el volumen y la presión de la sangre, los electrolitos y los metabolitos y el pH de la sangre.', W(URI, 'The purpose of the urinary system is to eliminate urine from the body, regulate blood volume and blood pressure, control levels of electrolytes and metabolites, and regulate blood pH.')],
        ['Los riñones reciben mucha sangre por las arterias renales, que sale por las venas renales.', W(URI, 'The kidneys have an extensive blood supply via the renal arteries which leave the kidneys via the renal vein.')],
        ['Una persona sana produce entre 800 y 2000 mililitros de orina al día.', W(URI, 'Healthy humans normally produce 800–2,000 milliliters (mL) of urine every day.')],
      ],
      vista: { ver: ['rinon'], contexto: ['arteria-renal', 'vena-renal'], esqueleto: true, camara: 'anterior', lado: 'R' },
    },
    {
      id: 'camino', tipo: 'explicacion', titulo: 'El camino de la orina',
      texto: [
        ['Cada riñón está formado por unidades funcionales, las nefronas, donde empieza a formarse la orina.', W(URI, 'Each kidney consists of functional units called nephrons.'), W(URI, 'The formation of urine begins within the functional unit of the kidney, the nephrons.')],
        ['La orina pasa por los túbulos colectores a los cálices menores y mayores, que se unen en la pelvis renal; de ahí, los uréteres la llevan a la vejiga.', W(URI, 'through a system of converging tubules called collecting ducts, which then join to form the minor calyces, followed by the major calyces that ultimately join the renal pelvis, followed by the ureters, which transport urine into the urinary bladder')],
        ['Las nefronas, los túbulos y los cálices no están en el modelo; sí la pelvis renal, dentro de cada riñón.', MODELO],
      ],
      vista: { ver: ['pelvis-renal', 'ureter', 'vejiga'], contexto: [], fantasma: ['rinon'], esqueleto: true, camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'ureter', texto: 'Toca el conducto que baja del riñón a la vejiga.' },
      comprobar: 'ureter',
    },
    {
      id: 'sexos', tipo: 'relaciones', titulo: 'Hombres y mujeres',
      texto: [
        ['El sistema urinario femenino y el masculino son muy parecidos: solo cambia la longitud de la uretra, que lleva la orina desde la vejiga a través del pene o de la vulva.', W(URI, 'The female and male urinary system are very similar, differing only in the length of the urethra, which transports urine from the bladder through the penis or vulva during urination.')],
        ['Cambia de modelo para comparar la vejiga y la uretra en los dos.', GUIA],
      ],
      vista: { ver: ['vejiga', 'uretra'], contexto: [], esqueleto: true, camara: 'lateral', lado: 'R' },
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['Riñones, uréteres, vejiga y uretra.', W(URI, 'it consists of the kidneys, ureters, bladder, and the urethra')],
        ['La orina se forma en las nefronas y sigue por túbulos, cálices y pelvis renal hasta los uréteres, que la llevan a la vejiga.', W(URI, 'which then join to form the minor calyces, followed by the major calyces that ultimately join the renal pelvis, followed by the ureters')],
        ['Además de eliminar la orina, regula el volumen, la presión y el pH de la sangre.', W(URI, 'regulate blood volume and blood pressure, control levels of electrolytes and metabolites, and regulate blood pH')],
      ],
    },
  ],
  preguntas: [
    { id: 'id-rinon', tipo: 'identificar', estructura: 'rinon', objetivo: 0, paso: 'organos' },
    { id: 'id-vejiga', tipo: 'identificar', estructura: 'vejiga', objetivo: 0, paso: 'camino' },
    { id: 'id-ureter', tipo: 'identificar', estructura: 'ureter', objetivo: 0, paso: 'camino' },
    {
      id: 'funcion', tipo: 'funcion', objetivo: 1, paso: 'funciones',
      enunciado: 'Además de eliminar la orina, ¿qué regula el sistema urinario?',
      correcta: 'El volumen, la presión y el pH de la sangre', distractores: ['La temperatura del cuerpo', 'La producción de glóbulos rojos', 'La digestión de las grasas'],
      explicacion: 'También controla los electrolitos y los metabolitos de la sangre.',
      evidencia: [W(URI, 'regulate blood volume and blood pressure, control levels of electrolytes and metabolites, and regulate blood pH')],
    },
    {
      id: 'nefrona', tipo: 'relacion', objetivo: 2, paso: 'camino',
      enunciado: '¿Cómo se llama la unidad funcional del riñón, donde empieza a formarse la orina?',
      correcta: 'La nefrona', distractores: ['El cáliz', 'La pelvis renal', 'El alvéolo'],
      explicacion: 'De la nefrona, la orina pasa a los túbulos colectores, los cálices y la pelvis renal.',
      evidencia: [W(URI, 'The formation of urine begins within the functional unit of the kidney, the nephrons.')],
    },
    {
      id: 'orden', tipo: 'secuencia', objetivo: 2, paso: 'camino',
      enunciado: 'Ordena el camino de la orina.',
      orden: ['Nefrona', 'Cálices', 'Pelvis renal', 'Uréter', 'Vejiga urinaria'],
      explicacion: 'Nefronas → túbulos colectores → cálices menores y mayores → pelvis renal → uréter → vejiga.',
      evidencia: [W(URI, 'Urine then flows through the nephrons, through a system of converging tubules called collecting ducts, which then join to form the minor calyces, followed by the major calyces that ultimately join the renal pelvis, followed by the ureters, which transport urine into the urinary bladder.')],
    },
    {
      id: 'ureter', tipo: 'relacion', objetivo: 2, paso: 'camino', estructuras: ['ureter'],
      enunciado: '¿Qué hacen los uréteres?',
      correcta: 'Llevan la orina de los riñones a la vejiga', distractores: ['Llevan la orina de la vejiga al exterior', 'Llevan la sangre a los riñones', 'Guardan la orina entre micciones'],
      explicacion: 'La uretra lleva la orina de la vejiga al exterior; la vejiga la guarda.',
      evidencia: [W(URI, 'the ureters transport urine from the kidneys into the urinary bladder')],
    },
    {
      id: 'sexos', tipo: 'comparacion', objetivo: 3, paso: 'sexos', estructuras: ['uretra'],
      enunciado: '¿En qué se diferencian el sistema urinario masculino y el femenino?',
      correcta: 'En la longitud de la uretra', distractores: ['En el número de uréteres', 'En el tamaño de los riñones', 'En que solo uno tiene vejiga'],
      explicacion: 'Son muy parecidos; solo cambia la longitud de la uretra.',
      evidencia: [W(URI, 'The female and male urinary system are very similar, differing only in the length of the urethra')],
    },
  ],
});
