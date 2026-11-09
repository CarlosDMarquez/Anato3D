// Lección «Oído externo, medio e interno». Formato y evidencias: ../formato.js.
// Se estudia en el lado izquierdo: el nervio coclear del modelo solo existe en ese lado.
import { leccion, W, GUIA, MODELO } from '../formato.js';

const nucleo = (nombre, piezas, tipo, extra = {}) => ({ nombre, piezas, lado: 'bilateral', papel: 'nucleo', tipo, ...extra });
const contexto = (nombre, piezas, tipo, lado = 'bilateral') => ({ nombre, piezas, lado, papel: 'contexto', tipo });

const HUESECILLOS = ['martillo', 'yunque', 'estribo'];
const L = 'L';

export default leccion({
  id: 'cab-oido',
  version: 1,
  titulo: 'Oído externo, medio e interno',
  resumen: 'El camino del sonido desde la oreja hasta la cóclea: el tímpano, los tres huesecillos y cómo amplifican la vibración, el tubo auditivo, la cóclea (audición), el vestíbulo (equilibrio) y el nervio vestibulococlear. Amplía lo que se ve en «Órganos de los sentidos».',
  lugares: [['cabeza', 'oido']],
  sistemas: ['sentidos', 'oseo'],
  formato: 'estructuras',
  temas: ['organos', 'huesos'],
  nivel: 2,
  minutos: 15,
  requisitos: ['sis-sentidos', 'cab-craneo'],
  siguiente: ['cab-nervios-craneales'],
  objetivos: [
    'Localizar en el modelo las partes del oído externo, medio e interno.',
    'Ordenar el camino del sonido desde la oreja hasta la cóclea.',
    'Describir los tres huesecillos y explicar cómo amplifican la vibración.',
    'Distinguir la parte del oído interno que sirve para oír de la que sirve para el equilibrio, y nombrar el nervio que las inerva.',
    'Explicar para qué sirve el tubo auditivo.',
  ],
  estructuras: {
    oreja: nucleo('Oreja (pabellón auricular)', ['Skin_Ear'], 'piel'),
    timpano: nucleo('Membrana timpánica (tímpano)', ['Tympanic_membrane'], 'organo'),
    martillo: nucleo('Martillo', ['Malleus'], 'hueso'),
    yunque: nucleo('Yunque', ['Incus'], 'hueso'),
    estribo: nucleo('Estribo', ['Stapes'], 'hueso'),
    'tubo-auditivo': nucleo('Tubo auditivo (trompa de Eustaquio)', ['Auditory_tube'], 'organo'),
    coclea: nucleo('Cóclea', ['Cochlea'], 'organo', { confusiones: ['Conductos semicirculares'] }),
    vestibulo: nucleo('Vestíbulo', ['Vestibule'], 'organo', { confusiones: ['Conductos semicirculares'] }),
    'nervio-viii': nucleo('Nervio vestibulococlear (VIII)', ['Vestibulocochlear_nerve_VIII'], 'nervio'),
    'nervio-vestibular': contexto('Nervio vestibular', ['Vestibular_nerve'], 'nervio'),
    'nervio-coclear': contexto('Nervio coclear', ['Cochlear_nerve_L'], 'nervio', 'exacto'),
    temporal: contexto('Hueso temporal', ['Temporal_Bone'], 'hueso'),
  },
  pasos: [
    {
      id: 'orientacion', tipo: 'orientacion', titulo: 'Las tres partes del oído',
      texto: [
        ['El oído externo son la oreja y el conducto auditivo; el medio es una cavidad, la cavidad timpánica; el interno se encarga sobre todo de oír y del equilibrio.', W('Outer_ear', 'The outer ear, external ear, or auris externa is the external part of the ear, which consists of the auricle (also pinna) and the ear canal.'), W('Middle_ear', 'The hollow space of the middle ear is also known as the tympanic cavity'), W('Inner_ear', 'In vertebrates, the inner ear is mainly responsible for sound detection and balance.')],
        ['El oído medio y el interno están dentro del hueso temporal.', W('Middle_ear', 'is surrounded by the tympanic part of the temporal bone'), W('Inner_ear', 'a hollow cavity in the temporal bone of the skull')],
        ['El modelo deja translúcido el temporal para que veas lo que hay dentro.', MODELO],
        ['Esta lección muestra el oído izquierdo; gira el modelo para mirarlo de lado.', GUIA],
      ],
      vista: { ver: ['oreja', 'timpano', ...HUESECILLOS, 'coclea', 'vestibulo', 'tubo-auditivo'], fantasma: ['temporal'], camara: 'lateral', lado: L },
    },
    {
      id: 'externo', tipo: 'explicacion', titulo: 'El oído externo y el tímpano',
      texto: [
        ['La oreja es una lámina fina de cartílago elástico cubierta de piel.', W('Outer_ear', 'It is composed of a thin plate of yellow elastic cartilage, covered with integument')],
        ['Desde la oreja, el sonido entra en el conducto auditivo externo, un tubo que llega hasta el oído medio.', W('Outer_ear', 'From the pinna, the sound waves move into the ear canal (also known as the external acoustic meatus) a simple tube running through to the middle ear.')],
        ['El tímpano es una membrana fina, en forma de cono, que separa el oído externo del medio.', W('Eardrum', 'is a thin, cone-shaped membrane that separates the external ear from the middle ear.')],
        ['Su función es transmitir los cambios de presión del sonido a los huesecillos del oído medio.', W('Eardrum', 'Its function is to transmit changes in pressure of sound from the air to the ossicles inside the middle ear')],
      ],
      detalle: [
        ['El conducto auditivo externo no es una pieza del modelo.', MODELO],
      ],
      vista: { ver: ['oreja', 'timpano'], fantasma: ['temporal'], camara: 'lateral', lado: L },
      actividad: { tipo: 'localizar', estructura: 'timpano', texto: 'Toca la membrana que separa el oído externo del medio.' },
    },
    {
      id: 'huesecillos', tipo: 'explicacion', titulo: 'Los huesecillos',
      texto: [
        ['En el oído medio hay tres huesecillos, de los más pequeños del cuerpo: el martillo, el yunque y el estribo.', W('Ossicles', 'are irregular bones in the middle ear of humans and other animals, and are among the smallest bones in the human body.'), W('Ossicles', 'it typically refers specifically to the malleus, incus and stapes ("hammer, anvil, and stirrup") of the middle ear.')],
        ['El martillo está unido al tímpano y se articula con el yunque; el yunque se une a los otros dos; el estribo se articula con el yunque y se apoya en la ventana oval, la entrada al oído interno.', W('Ossicles', 'The malleus ("hammer") articulates with the incus through the incudomalleolar joint and is attached to the tympanic membrane (eardrum)'), W('Ossicles', 'The incus ("anvil") is connected to both the other bones.'), W('Ossicles', 'The stapes ("stirrup") articulates with the incus through the incudostapedial joint and is attached to the membrane of the fenestra ovalis')],
        ['El estribo es el hueso más pequeño del cuerpo.', W('Ossicles', 'It is the smallest bone in the body.')],
      ],
      vista: { ver: HUESECILLOS, fantasma: ['timpano', 'temporal'], camara: 'lateral', lado: L },
      actividad: { tipo: 'comparar', estructuras: HUESECILLOS, texto: 'Resalta cada huesecillo, del tímpano hacia dentro.' },
      comprobar: 'rel-estribo',
    },
    {
      id: 'amplificar', tipo: 'funcion', titulo: 'Por qué los huesecillos amplifican',
      texto: [
        ['Cuando el sonido hace vibrar el tímpano, este mueve el martillo, que pasa la vibración por el yunque al estribo y de ahí a la ventana oval.', W('Ossicles', 'As sound waves vibrate the tympanic membrane (eardrum), it in turn moves the nearest ossicle, the malleus, to which it is attached.'), W('Ossicles', 'The malleus then transmits the vibrations, via the incus, to the stapes, and so ultimately to the membrane of the fenestra ovalis (oval window), the opening to the vestibule of the inner ear.')],
        ['Si el sonido pasara directamente del aire a un líquido, se reflejaría casi todo: solo pasaría alrededor de 1/30 de su energía.', W('Ossicles', 'Sound traveling through the air is mostly reflected when it comes into contact with a liquid medium; only about 1/30 of the sound energy moving through the air would be transferred into the liquid.')],
        ['Los huesecillos funcionan como una palanca y concentran la fuerza recogida en el tímpano sobre una superficie más pequeña, la ventana oval, y así aumenta la presión.', W('Ossicles', 'The ossicles give the eardrum a mechanical advantage via lever action and a reduction in the area of force distribution'), W('Middle_ear', 'The forces collected over the eardrum are concentrated over a smaller area, thus increasing the pressure over the oval window.')],
        ['En conjunto, multiplican la presión unas 26 veces, unos 30 dB.', W('Middle_ear', 'Together, they amplify pressure by 26 times, or about 30 dB.')],
      ],
      vista: { ver: ['timpano', ...HUESECILLOS], contexto: ['coclea', 'vestibulo'], fantasma: ['temporal'], camara: 'anterior', lado: L },
      comprobar: 'fun-amplificar',
    },
    {
      id: 'tubo', tipo: 'relaciones', titulo: 'El tubo auditivo',
      texto: [
        ['El oído medio es un espacio hueco, la cavidad timpánica, rodeado por la parte timpánica del temporal.', W('Middle_ear', 'The hollow space of the middle ear is also known as the tympanic cavity and is surrounded by the tympanic part of the temporal bone.')],
        ['El tubo auditivo (trompa de Eustaquio) une la cavidad timpánica con la nasofaringe y permite igualar la presión entre el oído medio y la garganta.', W('Middle_ear', 'The auditory tube (also known as the Eustachian tube or the pharyngotympanic tube) joins the tympanic cavity with the nasal cavity (nasopharynx), allowing pressure to equalize between the middle ear and throat.')],
      ],
      vista: { ver: ['tubo-auditivo'], contexto: ['timpano', ...HUESECILLOS], fantasma: ['temporal'], camara: 'anterolateral', lado: L },
      actividad: { tipo: 'localizar', estructura: 'tubo-auditivo', texto: 'Toca el conducto que va del oído medio hacia la faringe.' },
      comprobar: 'fun-tubo',
    },
    {
      id: 'interno', tipo: 'explicacion', titulo: 'El oído interno: cóclea y vestíbulo',
      texto: [
        ['El oído interno está en el laberinto óseo, una cavidad del temporal con dos partes: la cóclea, dedicada a la audición, y el sistema vestibular, dedicado al equilibrio.', W('Inner_ear', 'it consists of the bony labyrinth, a hollow cavity in the temporal bone of the skull with a system of passages comprising two main functional parts:'), W('Inner_ear', 'The cochlea, dedicated to hearing'), W('Inner_ear', 'The vestibular system, dedicated to balance.')],
        ['La cóclea es una cavidad en espiral, como la concha de un caracol, que da 2,75 vueltas; dentro está el órgano de Corti, el órgano sensorial de la audición.', W('Cochlea', 'It is a spiral-shaped cavity in the bony labyrinth, in humans making 2.75 turns around its axis, the modiolus.'), W('Cochlea', "The name 'cochlea' is derived from the Latin word for snail shell"), W('Cochlea', 'A core component of the cochlea is the organ of Corti, the sensory organ of hearing')],
        ['En el vestíbulo están el utrículo y el sáculo, que responden a la gravedad y a la aceleración lineal; los tres conductos semicirculares, en ángulo recto entre sí, se encargan del equilibrio en movimiento.', W('Ear', 'A central area known as the vestibule contains two small fluid-filled recesses, called the utricle and saccule.'), W('Inner_ear', 'which respond to linear acceleration and the force of gravity.'), W('Ear', 'There are three semicircular canals angled at right angles to each other which are responsible for dynamic balance.')],
      ],
      detalle: [
        ['El modelo no tiene los conductos semicirculares: solo la cóclea y el vestíbulo.', MODELO],
      ],
      vista: { ver: ['coclea', 'vestibulo'], contexto: ['estribo'], fantasma: ['temporal'], camara: 'lateral', lado: L },
      actividad: { tipo: 'comparar', estructuras: ['coclea', 'vestibulo'], texto: 'Alterna entre las dos: la cóclea es la espiral; el vestíbulo, la cámara central junto al estribo.' },
      comprobar: 'comp-coclea-vestibulo',
    },
    {
      id: 'nervio', tipo: 'relaciones', titulo: 'El nervio vestibulococlear',
      texto: [
        ['La cóclea convierte el sonido en impulsos nerviosos que llegan al encéfalo por el nervio auditivo.', W('Inner_ear', 'converting sound pressure patterns from the outer ear into electrochemical impulses which are passed on to the brain via the auditory nerve.')],
        ['El oído interno lo inerva el octavo par craneal, el nervio vestibulococlear, que lleva la información al lóbulo temporal del cerebro, donde se percibe como sonido.', W('Inner_ear', 'The inner ear is innervated by the eighth cranial nerve in all vertebrates.'), W('Ear', 'This nerve transmits information to the temporal lobe of the brain, where it is registered as sound.')],
        ['En el modelo, el nervio vestibulococlear se continúa con el nervio coclear y el vestibular.', MODELO],
      ],
      detalle: [
        ['El nervio coclear del modelo solo está en el lado izquierdo.', MODELO],
      ],
      vista: { ver: ['nervio-viii'], contexto: ['coclea', 'vestibulo', 'nervio-vestibular', 'nervio-coclear'], fantasma: ['temporal'], camara: 'lateral', lado: L },
      comprobar: 'rel-nervio',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['El sonido entra por la oreja y el conducto auditivo y hace vibrar el tímpano, que separa el oído externo del medio.', W('Outer_ear', 'From the pinna, the sound waves move into the ear canal'), W('Eardrum', 'is a thin, cone-shaped membrane that separates the external ear from the middle ear.')],
        ['Martillo, yunque y estribo llevan la vibración a la ventana oval y la amplifican unas 26 veces.', W('Ossicles', 'The malleus then transmits the vibrations, via the incus, to the stapes'), W('Middle_ear', 'Together, they amplify pressure by 26 times, or about 30 dB.')],
        ['El tubo auditivo iguala la presión del oído medio con la de la garganta.', W('Middle_ear', 'allowing pressure to equalize between the middle ear and throat.')],
        ['En el oído interno, la cóclea sirve para oír y el sistema vestibular, para el equilibrio; el nervio vestibulococlear lleva su información al encéfalo.', W('Inner_ear', 'The cochlea, dedicated to hearing'), W('Inner_ear', 'The vestibular system, dedicated to balance.'), W('Inner_ear', 'The inner ear is innervated by the eighth cranial nerve in all vertebrates.')],
      ],
    },
  ],
  preguntas: [
    { id: 'id-timpano', tipo: 'identificar', estructura: 'timpano', objetivo: 0, paso: 'externo' },
    { id: 'id-tubo', tipo: 'identificar', estructura: 'tubo-auditivo', objetivo: 0, paso: 'tubo' },
    { id: 'id-coclea', tipo: 'identificar', estructura: 'coclea', objetivo: 0, paso: 'interno' },
    { id: 'id-vestibulo', tipo: 'identificar', estructura: 'vestibulo', objetivo: 0, paso: 'interno' },
    { id: 'loc-oreja', tipo: 'localizar', estructura: 'oreja', candidatas: ['timpano', 'coclea'], objetivo: 0, paso: 'externo' },
    {
      id: 'seq-sonido', tipo: 'secuencia', objetivo: 1, paso: 'amplificar', estructuras: ['oreja', 'timpano', ...HUESECILLOS, 'coclea'],
      enunciado: 'Ordena el camino del sonido desde fuera hacia dentro:',
      orden: ['Oreja', 'Conducto auditivo externo', 'Tímpano', 'Martillo', 'Yunque', 'Estribo', 'Ventana oval'],
      explicacion: 'De la oreja, el sonido pasa al conducto y al tímpano; el martillo, el yunque y el estribo llevan la vibración a la ventana oval, la entrada al oído interno.',
      evidencia: [W('Outer_ear', 'From the pinna, the sound waves move into the ear canal (also known as the external acoustic meatus) a simple tube running through to the middle ear.'), W('Ossicles', 'The malleus then transmits the vibrations, via the incus, to the stapes, and so ultimately to the membrane of the fenestra ovalis (oval window), the opening to the vestibule of the inner ear.')],
    },
    { id: 'id-martillo', tipo: 'identificar', estructura: 'martillo', objetivo: 2, paso: 'huesecillos' },
    { id: 'id-yunque', tipo: 'identificar', estructura: 'yunque', objetivo: 2, paso: 'huesecillos' },
    { id: 'id-estribo', tipo: 'identificar', estructura: 'estribo', objetivo: 2, paso: 'huesecillos' },
    {
      id: 'rel-estribo', tipo: 'relacion', objetivo: 2, paso: 'huesecillos', estructuras: ['estribo'],
      enunciado: '¿Qué huesecillo se apoya en la ventana oval?',
      correcta: 'El estribo',
      distractores: ['El martillo', 'El yunque', 'Ninguno: el tímpano toca directamente la ventana oval'],
      explicacion: 'El martillo está unido al tímpano; el estribo, el más pequeño, se apoya en la ventana oval.',
      evidencia: [W('Ossicles', 'is attached to the membrane of the fenestra ovalis, (opening between the middle ear and the vestibule of the inner ear also known as oval window).')],
    },
    {
      id: 'rel-martillo', tipo: 'relacion', objetivo: 2, paso: 'huesecillos', estructuras: ['martillo', 'timpano'],
      enunciado: '¿Qué huesecillo está unido al tímpano?',
      correcta: 'El martillo',
      distractores: ['El yunque', 'El estribo', 'Los tres'],
      explicacion: 'El martillo está unido al tímpano y se articula con el yunque.',
      evidencia: [W('Ossicles', 'The malleus ("hammer") articulates with the incus through the incudomalleolar joint and is attached to the tympanic membrane (eardrum)')],
    },
    {
      id: 'fun-amplificar', tipo: 'funcion', objetivo: 2, paso: 'amplificar', estructuras: ['timpano', ...HUESECILLOS],
      enunciado: '¿Por qué hacen falta los huesecillos entre el tímpano y el oído interno?',
      correcta: 'Porque concentran la fuerza del tímpano en la ventana oval, más pequeña, y así el sonido pasa al líquido sin perderse',
      distractores: ['Porque convierten el sonido en impulsos nerviosos', 'Porque igualan la presión del oído medio con la de la garganta', 'Porque detectan la posición de la cabeza'],
      explicacion: 'Del aire a un líquido, el sonido se reflejaría casi entero; la palanca de los huesecillos y la diferencia de superficie aumentan la presión unas 26 veces.',
      evidencia: [W('Ossicles', 'only about 1/30 of the sound energy moving through the air would be transferred into the liquid.'), W('Middle_ear', 'The forces collected over the eardrum are concentrated over a smaller area, thus increasing the pressure over the oval window.')],
    },
    {
      id: 'comp-coclea-vestibulo', tipo: 'comparacion', objetivo: 3, paso: 'interno', estructuras: ['coclea', 'vestibulo'],
      enunciado: '¿Qué diferencia la cóclea del sistema vestibular?',
      correcta: 'La cóclea sirve para oír; el sistema vestibular, para el equilibrio',
      distractores: ['La cóclea sirve para el equilibrio; el sistema vestibular, para oír', 'Los dos sirven solo para oír', 'La cóclea está en el oído medio y el vestíbulo en el interno'],
      explicacion: 'Las dos partes del oído interno están en el laberinto del temporal: la cóclea, para la audición; el vestíbulo y los conductos semicirculares, para el equilibrio.',
      evidencia: [W('Inner_ear', 'The cochlea, dedicated to hearing'), W('Inner_ear', 'The vestibular system, dedicated to balance.')],
    },
    {
      id: 'rel-semicirculares', tipo: 'relacion', objetivo: 3, paso: 'interno', estructuras: ['vestibulo'],
      enunciado: '¿De qué se encargan los conductos semicirculares?',
      correcta: 'Del equilibrio cuando la cabeza se mueve',
      distractores: ['De amplificar el sonido', 'De igualar la presión del oído medio', 'De convertir el sonido en impulsos nerviosos'],
      explicacion: 'Los tres conductos, en ángulo recto entre sí, se encargan del equilibrio dinámico; el utrículo y el sáculo, de la gravedad y la aceleración lineal.',
      evidencia: [W('Ear', 'There are three semicircular canals angled at right angles to each other which are responsible for dynamic balance.')],
    },
    {
      id: 'rel-nervio', tipo: 'relacion', objetivo: 3, paso: 'nervio', estructuras: ['nervio-viii', 'coclea'],
      enunciado: '¿Qué nervio inerva el oído interno?',
      correcta: 'El nervio vestibulococlear (VIII par craneal)',
      distractores: ['El nervio facial (VII par craneal)', 'El nervio trigémino (V par craneal)', 'El nervio glosofaríngeo (IX par craneal)'],
      explicacion: 'El octavo par craneal lleva al encéfalo la información de la cóclea (audición) y del vestíbulo (equilibrio).',
      evidencia: [W('Inner_ear', 'The inner ear is innervated by the eighth cranial nerve in all vertebrates.')],
    },
    {
      id: 'fun-tubo', tipo: 'funcion', objetivo: 4, paso: 'tubo', estructuras: ['tubo-auditivo'],
      enunciado: '¿Para qué sirve el tubo auditivo?',
      correcta: 'Para igualar la presión del oído medio con la de la garganta',
      distractores: ['Para llevar el sonido de la oreja al tímpano', 'Para detectar la aceleración de la cabeza', 'Para llevar las lágrimas a la nariz'],
      explicacion: 'Une la cavidad timpánica con la nasofaringe y así la presión a los dos lados del tímpano se iguala.',
      evidencia: [W('Middle_ear', 'allowing pressure to equalize between the middle ear and throat.')],
    },
    {
      id: 'rel-tubo-une', tipo: 'relacion', objetivo: 4, paso: 'tubo', estructuras: ['tubo-auditivo'],
      enunciado: '¿Qué une el tubo auditivo?',
      correcta: 'La cavidad timpánica con la nasofaringe',
      distractores: ['La cóclea con el vestíbulo', 'El conducto auditivo externo con el tímpano', 'La órbita con la cavidad nasal'],
      explicacion: 'El tubo auditivo va del oído medio a la nasofaringe.',
      evidencia: [W('Middle_ear', 'joins the tympanic cavity with the nasal cavity (nasopharynx)')],
    },
  ],
});
