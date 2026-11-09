// Lección «Órganos de los sentidos». Formato y evidencias: ../formato.js.
import { leccion, W, GUIA, MODELO } from '../formato.js';

const SEN = 'Sense';
const O = (nombre, piezas, lado = 'bilateral', papel = 'nucleo', tipo = 'organo') => ({ nombre, piezas, lado, papel, tipo });

export default leccion({
  id: 'sis-sentidos',
  version: 1,
  titulo: 'Órganos de los sentidos',
  resumen: 'Qué hacen los órganos de los sentidos, las partes del ojo que forman la imagen y las tres partes del oído, con lo que sirve para oír y lo que sirve para el equilibrio; y cómo se reparten el olfato, el gusto y el tacto.',
  lugares: [['cabeza', 'orbita-ojo'], ['cabeza', 'oido']],
  sistemas: ['sentidos'],
  formato: 'vision-general',
  temas: ['organos'],
  nivel: 1,
  minutos: 11,
  requisitos: ['sis-nervioso'],
  siguiente: ['cab-ojo', 'cab-oido'],
  objetivos: [
    'Asociar cada órgano de los sentidos con el sentido que sirve.',
    'Describir el camino de la luz en el ojo hasta la retina y el nervio óptico.',
    'Distinguir el oído externo, el medio y el interno y decir qué contiene cada uno.',
    'Localizar en el modelo la córnea, el cristalino, la retina, la membrana timpánica, los huesecillos y la cóclea.',
  ],
  estructuras: {
    cornea: O('Córnea', ['Cornea']),
    iris: O('Iris', ['Iris']),
    cristalino: O('Cristalino', ['Lens']),
    retina: O('Retina', ['Retina']),
    esclera: O('Esclera', ['Sclera'], 'bilateral', 'contexto'),
    vitreo: O('Cuerpo vítreo', ['Vitreous_body'], 'bilateral', 'contexto'),
    timpano: O('Membrana timpánica', ['Tympanic_membrane']),
    huesecillos: O('Huesecillos del oído', ['Malleus', 'Incus', 'Stapes'], 'bilateral', 'nucleo', 'hueso'),
    coclea: O('Cóclea', ['Cochlea']),
    vestibulo: O('Vestíbulo', ['Vestibule']),
    'tubo-auditivo': O('Tubo auditivo', ['Auditory_tube'], 'bilateral', 'contexto'),
    oreja: O('Oreja', ['Skin_Ear'], 'bilateral', 'contexto', 'piel'),
  },
  pasos: [
    {
      id: 'organos', tipo: 'orientacion', titulo: 'Recoger estímulos',
      texto: [
        ['Los órganos de los sentidos recogen estímulos, como un sonido o un olor, y los transforman en algo que el encéfalo puede entender.', W(SEN, 'During sensation, sense organs collect various stimuli (such as a sound or smell) for transduction, meaning transformation into a form that can be understood by the brain.')],
        ['Ojos, oídos, piel, nariz y boca corresponden a la visión, la audición y el equilibrio, el tacto, el olfato y el gusto.', W(SEN, 'Humans have sensory organs (i.e. eyes, ears, skin, nose, and mouth) that correspond to a respective visual (vision), auditory (hearing) and vestibular (balance), somatosensory (touch), olfactory (smell), and gustatory systems (taste).')],
        ['Tradicionalmente se hablaba de cinco sentidos, pero hoy se reconocen muchos más.', W(SEN, 'five human senses were traditionally identified as such (namely sight, smell, touch, taste, and hearing), many more are now recognized')],
      ],
      vista: { capas: { skeletal: 'skull', nervous: 'senses' }, ver: [], contexto: [], camara: 'anterolateral', lado: 'R' },
    },
    {
      id: 'ojo', tipo: 'exploracion', titulo: 'El ojo',
      texto: [
        ['La luz atraviesa primero la córnea, la parte transparente, que hace la mayor parte del enfoque; después la pupila, una abertura en el iris, que regula cuánta luz entra; luego el cristalino, que termina de enfocar, y llega a la retina, donde se forma la imagen.', W('Human_eye', 'In order, along the optic axis, the optical components consist of a first lens (the cornea—the clear part of the eye) that accounts for most of the optical power of the eye and accomplishes most of the focusing of light from the outside world; then an aperture (the pupil) in a diaphragm (the iris—the coloured part of the eye), which controls the amount of light entering the interior of the eye; then another lens (the crystalline lens) that accomplishes the remaining focusing of light into images; and finally a light-sensitive part of the eye (the retina), where the images fall and are processed.')],
        ['El ojo está lleno de un gel transparente, el humor vítreo, y su capa externa blanca es la esclera.', W('Eye', 'filled with the transparent gel-like vitreous humour'), W('Human_eye', 'the outermost, white part of the eye (the sclera)')],
        ['Los conos (color) y los bastones (poca luz) de la retina convierten la luz en señales que el nervio óptico lleva al encéfalo.', W('Eye', 'The cone cells (for colour) and the rod cells (for low-light contrasts) in the retina detect and convert light into neural signals which are transmitted to the brain via the optic nerve to produce vision.')],
      ],
      vista: { ver: ['cornea', 'iris', 'cristalino', 'retina'], contexto: ['vitreo'], fantasma: ['esclera'], camara: 'lateral', lado: 'R' },
      actividad: { tipo: 'localizar', estructura: 'cristalino', texto: 'Toca la lente que enfoca la luz, detrás del iris.' },
      comprobar: 'camino-luz',
    },
    {
      id: 'oido', tipo: 'explicacion', titulo: 'Las tres partes del oído',
      texto: [
        ['El oído tiene tres partes: el oído externo, el medio y el interno.', W('Ear', 'In humans, the ear is described as having three parts:  the outer ear, the middle ear and the inner ear.')],
        ['El externo lo forman la oreja y el conducto auditivo; la membrana timpánica lo separa de la cavidad timpánica del oído medio.', W('Ear', 'The outer ear consists of the auricle, the visible outer part, and the ear canal.'), W('Ear', 'The ear canal of the outer ear is separated from the air-filled tympanic cavity of the middle ear by the eardrum.')],
        ['El medio contiene tres huesecillos que transmiten el sonido y se comunica con la nasofaringe por el tubo auditivo.', W('Ear', 'The middle ear contains the ossicles, three small bones involved in the transmission of sound, and is connected to the throat at the nasopharynx, via the pharyngeal opening of the Eustachian tube.')],
      ],
      vista: { ver: ['timpano', 'huesecillos'], contexto: ['oreja', 'tubo-auditivo', 'coclea', 'vestibulo'], camara: 'anterior', lado: 'R' },
    },
    {
      id: 'oir-equilibrio', tipo: 'funcion', titulo: 'Oír y mantener el equilibrio',
      texto: [
        ['El oído interno está en el laberinto óseo: los conductos semicirculares dan el equilibrio en movimiento, el utrículo y el sáculo, el equilibrio en reposo, y la cóclea permite oír.', W('Ear', 'The inner ear sits in the bony labyrinth, and contains structures which are key to several senses: the semicircular canals, which enable balance and eye tracking when moving; the utricle and saccule, which enable balance when stationary; and the cochlea, which enables hearing.')],
        ['En el modelo, el vestíbulo y la cóclea forman el oído interno; los conductos semicirculares no son piezas aparte.', MODELO],
      ],
      vista: { ver: ['coclea', 'vestibulo'], contexto: ['huesecillos', 'timpano'], camara: 'anterior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['coclea', 'vestibulo'], texto: 'Alterna entre la cóclea (audición) y el vestíbulo (equilibrio).' },
      comprobar: 'coclea',
    },
    {
      id: 'otros', tipo: 'explicacion', titulo: 'Tacto, gusto y olfato',
      texto: [
        ['El tacto se puede separar en presión ligera y profunda, vibración, picor, dolor, temperatura o movimiento del pelo.', W(SEN, 'the general sensation and perception of touch, which is known as somatosensation, can be separated into light pressure, deep pressure, vibration, itch, pain, temperature, or hair movement')],
        ['El gusto se separa en dulce, salado, ácido, amargo, picante y umami, según las sustancias que se unen a las neuronas sensitivas.', W(SEN, 'the general sensation and perception of taste can be separated into submodalities of sweet, salty, sour, bitter, spicy, and umami, all of which are based on different chemicals binding to sensory neurons')],
        ['La piel, la nariz y la boca se estudian en sus propias lecciones.', GUIA],
      ],
      vista: { capas: { integumentary: 'skin' }, ver: [], contexto: [], camara: 'anterior', lado: 'R' },
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['Ojos, oídos, piel, nariz y boca: visión, audición y equilibrio, tacto, olfato y gusto.', W(SEN, 'eyes, ears, skin, nose, and mouth')],
        ['Ojo: la luz atraviesa la córnea, la pupila y el cristalino y llega a la retina; el nervio óptico lleva la señal al encéfalo.', W('Human_eye', 'then an aperture (the pupil) in a diaphragm (the iris—the coloured part of the eye)'), W('Human_eye', 'The retina makes a connection to the brain via the optic nerve.')],
        ['Oído: externo (oreja y conducto), medio (tímpano y huesecillos) e interno (cóclea para oír; vestíbulo y conductos semicirculares para el equilibrio).', W('Ear', 'The outer ear consists of the auricle, the visible outer part, and the ear canal.'), W('Ear', 'The middle ear includes the tympanic cavity and the three ossicles.')],
      ],
    },
  ],
  preguntas: [
    { id: 'id-coclea', tipo: 'identificar', estructura: 'coclea', objetivo: 3, paso: 'oir-equilibrio' },
    { id: 'id-cristalino', tipo: 'identificar', estructura: 'cristalino', objetivo: 3, paso: 'ojo' },
    { id: 'id-timpano', tipo: 'identificar', estructura: 'timpano', objetivo: 3, paso: 'oido' },
    { id: 'loc-retina', tipo: 'localizar', estructura: 'retina', candidatas: ['cornea', 'cristalino'], objetivo: 3, paso: 'ojo' },
    {
      id: 'organo-sentido', tipo: 'relacion', objetivo: 0, paso: 'organos',
      enunciado: '¿Qué órgano sirve además para el equilibrio?',
      correcta: 'El oído', distractores: ['El ojo', 'La nariz', 'La piel'],
      explicacion: 'Los oídos corresponden a la audición y al sistema vestibular, el del equilibrio.',
      evidencia: [W(SEN, 'auditory (hearing) and vestibular (balance)')],
    },
    {
      id: 'camino-luz', tipo: 'relacion', objetivo: 1, paso: 'ojo', estructuras: ['retina'],
      enunciado: '¿Dónde se convierte la luz en señales nerviosas?',
      correcta: 'En la retina, por los conos y los bastones', distractores: ['En el cristalino', 'En la córnea', 'En el iris'],
      explicacion: 'El cristalino enfoca y el iris regula la luz; los conos y bastones de la retina la convierten en señales.',
      evidencia: [W('Eye', 'The cone cells (for colour) and the rod cells (for low-light contrasts) in the retina detect and convert light into neural signals')],
    },
    {
      id: 'orden-luz', tipo: 'secuencia', objetivo: 1, paso: 'ojo', estructuras: ['cornea', 'cristalino', 'retina'],
      enunciado: 'Ordena lo que atraviesa la luz al entrar en el ojo.',
      orden: ['Córnea', 'Pupila', 'Cristalino', 'Retina'],
      explicacion: 'La córnea enfoca la mayor parte, la pupila regula la luz, el cristalino termina de enfocar y la imagen se forma en la retina.',
      evidencia: [W('Human_eye', 'In order, along the optic axis, the optical components consist of a first lens (the cornea')],
    },
    {
      id: 'iris', tipo: 'funcion', objetivo: 1, paso: 'ojo', estructuras: ['iris'],
      enunciado: '¿Qué hacen los músculos del iris?',
      correcta: 'Cambian el tamaño de la pupila', distractores: ['Enfocan la imagen cambiando la forma de la córnea', 'Mueven el globo ocular', 'Producen las lágrimas'],
      explicacion: 'Regulan la cantidad de luz que entra en el ojo.',
      evidencia: [W('Eye', 'Muscles around the iris change the size of the pupil, regulating the amount of light that enters the eye')],
    },
    {
      id: 'oido-medio', tipo: 'relacion', objetivo: 2, paso: 'oido', estructuras: ['huesecillos'],
      enunciado: '¿Qué contiene el oído medio?',
      correcta: 'La cavidad timpánica y los tres huesecillos', distractores: ['La oreja y el conducto auditivo', 'La cóclea y los conductos semicirculares', 'El nervio vestibulococlear'],
      explicacion: 'La oreja y el conducto son del oído externo; la cóclea y los conductos semicirculares, del interno.',
      evidencia: [W('Ear', 'The middle ear includes the tympanic cavity and the three ossicles.')],
    },
    {
      id: 'coclea', tipo: 'funcion', objetivo: 2, paso: 'oir-equilibrio', estructuras: ['coclea'],
      enunciado: '¿Qué estructura del oído interno permite oír?',
      correcta: 'La cóclea', distractores: ['Los conductos semicirculares', 'El utrículo', 'El sáculo'],
      explicacion: 'Los conductos semicirculares, el utrículo y el sáculo sirven para el equilibrio.',
      evidencia: [W('Ear', 'and the cochlea, which enables hearing')],
    },
    {
      id: 'tubo', tipo: 'relacion', objetivo: 2, paso: 'oido', estructuras: ['tubo-auditivo'],
      enunciado: '¿Con qué comunica el oído medio a través del tubo auditivo?',
      correcta: 'Con la nasofaringe', distractores: ['Con la cavidad oral', 'Con el oído interno', 'Con la cavidad nasal anterior'],
      explicacion: 'El tubo auditivo (trompa de Eustaquio) llega a la garganta, en la nasofaringe.',
      evidencia: [W('Ear', 'is connected to the throat at the nasopharynx, via the pharyngeal opening of the Eustachian tube')],
    },
  ],
});
