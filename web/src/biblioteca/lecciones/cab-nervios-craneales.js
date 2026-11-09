// Lección «Los doce nervios craneales». Formato y evidencias: ../formato.js.
import { leccion, W, T, GUIA } from '../formato.js';

const NC = 'head/cranial-nerves/';
const RES = `${NC}summary`;
const nervio = (nombre, piezas) => ({ nombre, piezas, lado: 'bilateral', papel: 'nucleo', tipo: 'nervio' });
const contexto = (nombre, piezas, tipo, lado = 'bilateral') => ({ nombre, piezas, lado, papel: 'contexto', tipo });

const TODOS = ['olfatorio', 'optico', 'oculomotor', 'troclear', 'trigemino', 'abducens', 'facial', 'vestibulococlear', 'glosofaringeo', 'vago', 'accesorio', 'hipogloso'];
const TRONCO = ['mesencefalo', 'puente', 'bulbo'];
const OJO = ['oculomotor', 'troclear', 'abducens'];
const BULBARES = ['glosofaringeo', 'vago', 'accesorio', 'hipogloso'];
// El vago baja hasta el abdomen y el accesorio hasta el hombro: resaltados, alejan tanto la cámara que los demás no se ven.
const LARGOS = ['vago', 'accesorio'];

export default leccion({
  id: 'cab-nervios-craneales',
  version: 1,
  titulo: 'Los doce nervios craneales',
  resumen: 'Los doce pares de nervios que salen directamente del encéfalo: de dónde sale cada uno, por qué se numeran así, cuáles son sensitivos, motores o mixtos, qué hace cada uno (del olfato a los músculos de la lengua) y qué se ve cuando se lesionan el oculomotor, el facial o el hipogloso.',
  lugares: [['cabeza', null]],
  sistemas: ['nervioso'],
  formato: 'trayectos',
  temas: ['nervios'],
  nivel: 2,
  minutos: 22,
  requisitos: ['sis-nervioso', 'cab-encefalo'],
  siguiente: ['cab-ojo', 'cab-oido', 'cue-vasos'],
  objetivos: [
    'Enumerar los doce nervios craneales en orden y decir de qué parte del encéfalo sale cada uno.',
    'Clasificar los nervios craneales en sensitivos, motores o mixtos.',
    'Asociar cada nervio craneal con su función principal.',
    'Localizar en el modelo los nervios craneales en su salida del encéfalo.',
    'Predecir qué se observa cuando se lesionan el oculomotor, el facial o el hipogloso.',
  ],
  estructuras: {
    olfatorio: nervio('Nervio olfatorio (I)', ['Olfactory_nerve_I']),
    optico: nervio('Nervio óptico (II)', ['Optic_nerve_II']),
    oculomotor: nervio('Nervio oculomotor (III)', ['Oculomotor_nerve_III']),
    troclear: nervio('Nervio troclear (IV)', ['Trochlear_nerve_IV']),
    trigemino: nervio('Nervio trigémino (V)', ['Trigeminal_nerve_V', 'Ophthalmic_nerve', 'Maxillary_nerve']),
    abducens: nervio('Nervio abducens (VI)', ['Abducens_nerve_VI']),
    facial: nervio('Nervio facial (VII)', ['Facial_nerve_VII']),
    vestibulococlear: nervio('Nervio vestibulococlear (VIII)', ['Vestibulocochlear_nerve_VIII']),
    glosofaringeo: nervio('Nervio glosofaríngeo (IX)', ['Glossopharyngeal_nerve_IX']),
    vago: nervio('Nervio vago (X)', ['Vagus_nerve_X']),
    accesorio: nervio('Nervio accesorio (XI)', ['Accessory_nerve_XI']),
    hipogloso: nervio('Nervio hipogloso (XII)', ['Hypoglossal_nerve_XII']),
    quiasma: contexto('Quiasma óptico', ['Optic_chiasm'], 'snc', 'ambos'),
    mesencefalo: contexto('Mesencéfalo', ['Midbrain'], 'snc', 'ambos'),
    puente: contexto('Puente', ['Pons'], 'snc', 'ambos'),
    bulbo: contexto('Bulbo raquídeo', ['Medulla_oblongata'], 'snc', 'ambos'),
    'cuerda-timpano': contexto('Cuerda del tímpano', ['Chorda_tympani'], 'nervio'),
    occipital: contexto('Hueso occipital', ['Occipital_Bone'], 'hueso', 'impar'),
    esfenoides: contexto('Esfenoides', ['Sphenoid_Bone'], 'hueso', 'impar'),
    etmoides: contexto('Etmoides', ['Ethmoid_Bone'], 'hueso', 'impar'),
    temporal: contexto('Hueso temporal', ['Temporal_Bone'], 'hueso'),
  },
  pasos: [
    {
      id: 'orientacion', tipo: 'orientacion', titulo: 'Doce pares',
      texto: [
        ['Los nervios craneales son doce pares que salen directamente del encéfalo y se numeran con romanos, del I al XII.', T(RES, 'The cranial nerves are a set of 12 paired nerves that arise directly from the brain.'), W('Cranial_nerves', 'There are conventionally twelve pairs of cranial nerves, which are described with Roman numerals I–XII.')],
        ['El olfatorio y el óptico salen del cerebro; los otros diez, del tronco del encéfalo.', T(RES, 'The first two nerves (olfactory and optic) arise from the cerebrum, whereas the remaining ten emerge from the brainstem.')],
        ['Se numeran por su salida en el tronco (de arriba abajo y de dentro afuera) y por el orden en que dejan el cráneo, de delante atrás.', T(RES, 'The cranial nerves are numbered by their location on the brainstem (superior to inferior, then medial to lateral) and the order of their exit from the cranium (anterior to posterior)')],
        ['Míralos desde abajo, como en la base del encéfalo.', GUIA],
      ],
      vista: { ver: TODOS.filter((id) => !LARGOS.includes(id)), contexto: [...LARGOS, ...TRONCO, 'quiasma'], camara: 'inferior', lado: 'R' },
      actividad: { tipo: 'vistas', texto: 'Recorre los doce pares.', vistas: [{ nombre: 'Desde abajo', camara: 'inferior' }, { nombre: 'De lado', camara: 'lateral' }, { nombre: 'De frente', camara: 'anterior' }] },
      comprobar: 'rel-origen',
    },
    {
      id: 'origen', tipo: 'explicacion', titulo: 'De dónde sale cada uno',
      texto: [
        ['Del mesencéfalo sale el troclear, por detrás; de la unión con el puente, el oculomotor.', T(RES, 'Midbrain – the trochlear nerve (IV) comes from the posterior side of the midbrain.'), T(RES, 'Midbrain-pontine junction – oculomotor (III).')],
        ['Del puente sale el trigémino; de la unión del puente con el bulbo, el abducens, el facial y el vestibulococlear.', T(RES, 'Pons – trigeminal (V).'), T(RES, 'Pontine-medulla junction – abducens, facial, vestibulocochlear (VI-VIII).')],
        ['Del bulbo salen el glosofaríngeo, el vago y el accesorio (detrás de la oliva) y el hipogloso (delante).', T(RES, 'Posterior to the olive: glossopharyngeal, vagus, accessory (IX-XI).'), T(RES, 'Anterior to the olive: hypoglossal (XII).')],
      ],
      vista: { ver: TRONCO, contexto: TODOS, camara: 'lateral', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['trigemino', 'facial', 'vago', 'hipogloso'], texto: 'Alterna de arriba abajo: el trigémino en el puente, el facial en su unión con el bulbo, y el vago y el hipogloso en el bulbo.' },
      comprobar: 'rel-troclear',
    },
    {
      id: 'sentidos', tipo: 'exploracion', titulo: 'Olfato, vista, oído y equilibrio',
      texto: [
        ['El olfatorio (I) lleva el olfato: sus fibras cruzan la lámina cribosa del etmoides.', T(`${NC}olfactory-cni`, 'The olfactory nerve is responsible for the sense of smell.'), T(`${NC}olfactory-cni`, 'which penetrate the small foramina in the cribriform plate of the ethmoid bone and enter the cranial cavity.')],
        ['El óptico (II) lleva la visión; sale de la órbita por el canal óptico y en el quiasma se cruzan las fibras de la mitad nasal de cada retina.', T(`${NC}optic-cnii`, 'responsible for transmitting the special sensory information for vision.'), T(`${NC}optic-cnii`, 'the nerve leaves the bony orbit via the optic canal'), T(`${NC}optic-cnii`, 'fibres from the nasal (medial) half of each retina cross over to the contralateral optic tract')],
        ['El vestibulococlear (VIII) sale por el conducto auditivo interno y se divide en el vestibular (equilibrio) y el coclear (audición).', T(`${NC}vestibulocochlear`, 'exits the cranium via the internal acoustic meatus of the temporal bone.'), T(`${NC}vestibulocochlear`, 'which is responsible for detecting balance.'), T(`${NC}vestibulocochlear`, 'The cochlear nerve travels to cochlea of the inner ear, forming the spiral ganglia which serve the sense of hearing.')],
      ],
      detalle: [
        ['Un tumor de la hipófisis, junto al quiasma, puede comprimir las fibras que se cruzan y quitar la visión de los dos lados externos (hemianopsia bitemporal).', T(`${NC}optic-cnii`, 'A pituitary adenoma can compress the optic chiasm, leading to bitemporal hemianopia, a visual defect that affects peripheral vision in both eyes.')],
      ],
      vista: { ver: ['olfatorio', 'optico', 'vestibulococlear'], contexto: ['quiasma', 'etmoides', ...TRONCO], camara: 'inferior', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['olfatorio', 'optico', 'vestibulococlear'], texto: 'Alterna los tres nervios de los sentidos especiales.' },
      comprobar: 'fun-quiasma',
    },
    {
      id: 'ojo', tipo: 'exploracion', titulo: 'Los que mueven el ojo',
      texto: [
        ['El oculomotor (III) mueve la mayoría de los músculos del ojo y el elevador del párpado, y contrae la pupila.', T(`${NC}oculomotor`, 'Motor – Innervates the majority of the extraocular muscles (levator palpebrae superioris, superior rectus, inferior rectus, medial rectus and inferior oblique).'), T(`${NC}oculomotor`, 'Parasympathetic – Supplies the sphincter pupillae and the ciliary muscles of the eye.')],
        ['El troclear (IV) inerva un solo músculo, el oblicuo superior; es el único que sale por detrás del mesencéfalo y el de recorrido intracraneal más largo.', T(`${NC}trochlear-nerve`, 'The trochlear nerve innervates a single muscle – the superior oblique, which is a muscle of oculomotion.'), T(`${NC}trochlear-nerve`, 'it is the only cranial nerve to exit from the posterior midbrain'), T(`${NC}trochlear-nerve`, 'yet has the longest intracranial course.')],
        ['El abducens (VI) inerva el recto lateral, que lleva el ojo hacia fuera.', T(`${NC}abducens-nerve`, 'It has a purely somatic motor function – providing innervation to the lateral rectus muscle.')],
      ],
      vista: { ver: OJO, contexto: ['optico', 'esfenoides', ...TRONCO], camara: 'lateral', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: OJO, texto: 'Alterna los tres: el oculomotor, el troclear (fino, desde atrás) y el abducens.' },
      comprobar: 'fun-abducens',
    },
    {
      id: 'trigemino-facial', tipo: 'exploracion', titulo: 'Trigémino y facial',
      texto: [
        ['El trigémino (V), el más grande, da la sensibilidad de la piel, las mucosas y los senos de la cara, y mueve los músculos de la masticación; tiene tres divisiones: oftálmica, maxilar y mandibular.', T(`${NC}trigeminal-nerve`, 'It is also the largest cranial nerve.'), T(`${NC}trigeminal-nerve`, 'Sensory: Innervation to the skin, mucous membranes and sinuses of the face.'), T(`${NC}trigeminal-nerve`, 'Motor: Innervation to the muscles of mastication'), T(`${NC}trigeminal-nerve`, 'gives rise to 3 divisions: ophthalmic (V1), maxillary (V2) and mandibular (V3).')],
        ['El facial (VII) mueve los músculos de la expresión de la cara y, por la cuerda del tímpano, lleva el gusto de los dos tercios anteriores de la lengua.', T(`${NC}facial-nerve`, 'Motor – muscles of facial expression, posterior belly of the digastric, stylohyoid and stapedius muscles.'), T(`${NC}facial-nerve`, 'Special Sensory – provides special taste sensation to the anterior 2/3 of the tongue via the chorda tympani.')],
        ['El facial sale del cráneo por el agujero estilomastoideo.', T(`${NC}facial-nerve`, 'The facial nerve then exits the facial canal (and the cranium) via the stylomastoid foramen.')],
      ],
      vista: { ver: ['trigemino', 'facial'], contexto: ['cuerda-timpano', 'temporal', ...TRONCO], camara: 'lateral', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: ['trigemino', 'facial'], texto: 'Alterna: el trigémino, sensibilidad de la cara y masticación; el facial, expresión y gusto.' },
      comprobar: 'comp-trigemino-facial',
    },
    {
      id: 'bulbares', tipo: 'relaciones', titulo: 'Los cuatro del bulbo',
      texto: [
        ['El glosofaríngeo (IX) lleva el gusto y la sensibilidad del tercio posterior de la lengua y de la orofaringe.', T(`${NC}glossopharyngeal-nerve`, 'Sensory: Innervates the oropharynx, carotid body and sinus, posterior 1/3 of the tongue, middle ear cavity and Eustachian tube.'), T(`${NC}glossopharyngeal-nerve`, 'Special sensory: Provides taste sensation to the posterior 1/3 of the tongue.')],
        ['El vago (X), el de recorrido más largo, llega hasta el abdomen: mueve la faringe y la laringe y regula el corazón y el tubo digestivo; sale por el agujero yugular con el IX y el XI.', T(`${NC}vagus-nerve-cn-x`, 'The vagus nerve has the longest course of all the cranial nerves, extending from the head to the abdomen.'), T(`${NC}vagus-nerve-cn-x`, 'Motor: Provides motor innervation to the majority of the muscles of the pharynx, soft palate and larynx.'), T(`${NC}vagus-nerve-cn-x`, 'regulates heart rhythm.'), T(`${NC}vagus-nerve-cn-x`, 'It exits the cranium via the jugular foramen, with the glossopharyngeal and accessory nerves (CN IX and XI respectively).')],
        ['El accesorio (XI) mueve el esternocleidomastoideo y el trapecio; el hipogloso (XII), casi todos los músculos de la lengua.', T(`${NC}accessory`, 'It has a purely somatic motor function, innervating the sternocleidomastoid and trapezius muscles.'), T(`${NC}hypoglossal`, 'The nerve has a purely somatic motor function, innervating all the extrinsic and intrinsic muscles of the tongue (except the palatoglossus, innervated by vagus nerve).')],
      ],
      vista: { ver: ['glosofaringeo', 'accesorio', 'hipogloso'], contexto: ['vago', 'bulbo', 'puente', 'occipital'], camara: 'lateral', lado: 'R' },
      actividad: { tipo: 'comparar', estructuras: BULBARES, texto: 'Alterna los cuatro: el glosofaríngeo, el vago (que baja por el cuello), el accesorio y el hipogloso (hacia la lengua).' },
      comprobar: 'fun-accesorio',
    },
    {
      id: 'tipos', tipo: 'funcion', titulo: 'Sensitivos, motores y mixtos',
      texto: [
        ['Cada nervio craneal es sensitivo, motor o las dos cosas.', T(RES, 'Each cranial nerve can be described as being sensory, motor or both.')],
        ['Son sensitivos el olfatorio, el óptico y el vestibulococlear, que llevan los sentidos especiales; solo motores, el troclear, el abducens, el accesorio y el hipogloso.', T(`${NC}olfactory-cni`, 'It is a special visceral afferent nerve, which transmits information relating to smell.'), T(`${NC}optic-cnii`, 'responsible for transmitting the special sensory information for vision.'), T(`${NC}vestibulocochlear`, 'Both have a purely sensory function.'), T(`${NC}trochlear-nerve`, 'It has a purely somatic motor function.'), T(`${NC}abducens-nerve`, 'It has a purely somatic motor function'), T(`${NC}accessory`, 'It has a purely somatic motor function'), T(`${NC}hypoglossal`, 'The nerve has a purely somatic motor function')],
        ['El trigémino, el facial, el glosofaríngeo y el vago son mixtos.', T(`${NC}trigeminal-nerve`, 'Sensory: Innervation to the skin, mucous membranes and sinuses of the face.'), T(`${NC}facial-nerve`, 'Motor – muscles of facial expression'), T(`${NC}vagus-nerve-cn-x`, 'Motor: Provides motor innervation to the majority of the muscles of the pharynx, soft palate and larynx.')],
      ],
      vista: { ver: ['troclear', 'abducens', 'accesorio', 'hipogloso'], contexto: [...TRONCO, 'olfatorio', 'optico', 'vestibulococlear'], camara: 'inferior', lado: 'R' },
      comprobar: 'rel-motores',
    },
    {
      id: 'lesiones', tipo: 'relaciones', titulo: 'Qué se ve cuando se lesionan',
      texto: [
        ['Si falla el oculomotor, el párpado cae, el ojo queda hacia abajo y afuera y la pupila se dilata.', T(`${NC}oculomotor`, 'Ptosis (drooping upper eyelid) – due to paralysis of the levator palpabrae superioris'), T(`${NC}oculomotor`, 'Down and out‘ position of the eye at rest'), T(`${NC}oculomotor`, 'Dilated pupil – due to the unopposed action of the dilator pupillae muscle.')],
        ['Si falla el facial (en la parálisis de Bell, sin causa conocida), se debilitan los músculos de la expresión de ese lado.', T(`${NC}facial-nerve`, 'If no definitive cause can be found, the disease is termed Bell’s palsy.'), T(`${NC}facial-nerve`, 'Only the motor function of the facial nerve is affected, therefore resulting in paralysis or severe weakness of the muscles of facial expression.')],
        ['Si falla un hipogloso, al sacar la lengua esta se desvía hacia el lado dañado.', T(`${NC}hypoglossal`, 'Patients will present with deviation of the tongue towards the damaged side on protrusion')],
      ],
      vista: { ver: ['oculomotor', 'facial', 'hipogloso'], contexto: TRONCO, camara: 'lateral', lado: 'R' },
      comprobar: 'rel-hipogloso',
    },
    {
      id: 'sintesis', tipo: 'sintesis', titulo: 'En resumen',
      texto: [
        ['I y II salen del cerebro; III a XII, del tronco, ordenados de arriba abajo.', T(RES, 'The olfactory nerve (CN I) and optic nerve (CN II) originate from the cerebrum. Cranial nerves III – XII arise from the brainstem')],
        ['Sentidos: I olfato, II vista, VIII oído y equilibrio. Ojo: III, IV y VI. Cara: V sensibilidad y masticación, VII expresión y gusto.', T(`${NC}olfactory-cni`, 'The olfactory nerve is responsible for the sense of smell.'), T(`${NC}vestibulocochlear`, 'transmit information for hearing and balance.')],
        ['Bulbo: IX gusto posterior, X hasta el abdomen, XI cuello y hombro, XII lengua.', T(`${NC}vagus-nerve-cn-x`, 'extending from the head to the abdomen.'), T(`${NC}accessory`, 'innervating the sternocleidomastoid and trapezius muscles.')],
      ],
    },
  ],
  preguntas: [
    {
      id: 'rel-origen', tipo: 'relacion', objetivo: 0, paso: 'orientacion', estructuras: ['olfatorio', 'optico'],
      enunciado: '¿Qué dos nervios craneales salen del cerebro y no del tronco del encéfalo?',
      correcta: 'El olfatorio y el óptico',
      distractores: ['El oculomotor y el troclear', 'El vago y el accesorio', 'El trigémino y el facial'],
      explicacion: 'I y II salen del cerebro; los diez restantes, del tronco del encéfalo.',
      evidencia: [T(RES, 'The olfactory nerve (CN I) and optic nerve (CN II) originate from the cerebrum. Cranial nerves III – XII arise from the brainstem')],
    },
    {
      id: 'rel-troclear', tipo: 'relacion', objetivo: 0, paso: 'origen', estructuras: ['troclear', 'mesencefalo'],
      enunciado: '¿Qué tiene de particular la salida del nervio troclear?',
      correcta: 'Es el único que sale por la cara posterior del mesencéfalo',
      distractores: ['Sale del cerebro, como el óptico', 'Sale del bulbo, delante de la oliva', 'Sale por la lámina cribosa'],
      explicacion: 'Además es el de recorrido intracraneal más largo; delante de la oliva sale el hipogloso.',
      evidencia: [T(`${NC}trochlear-nerve`, 'it is the only cranial nerve to exit from the posterior midbrain')],
    },
    {
      id: 'sec-tronco', tipo: 'secuencia', objetivo: 0, paso: 'origen',
      enunciado: 'Ordena de arriba abajo según su salida del tronco del encéfalo.',
      orden: ['Oculomotor (III)', 'Trigémino (V)', 'Facial (VII)', 'Hipogloso (XII)'],
      explicacion: 'Unión mesencéfalo-puente, puente, unión puente-bulbo y bulbo.',
      evidencia: [T(RES, 'Midbrain-pontine junction – oculomotor (III).'), T(RES, 'Pons – trigeminal (V).'), T(RES, 'Pontine-medulla junction – abducens, facial, vestibulocochlear (VI-VIII).'), T(RES, 'Anterior to the olive: hypoglossal (XII).')],
    },
    { id: 'id-optico', tipo: 'identificar', estructura: 'optico', objetivo: 3, paso: 'sentidos' },
    { id: 'id-trigemino', tipo: 'identificar', estructura: 'trigemino', objetivo: 3, paso: 'trigemino-facial' },
    { id: 'id-vago', tipo: 'identificar', estructura: 'vago', objetivo: 3, paso: 'bulbares' },
    { id: 'id-hipogloso', tipo: 'identificar', estructura: 'hipogloso', objetivo: 3, paso: 'bulbares' },
    { id: 'id-oculomotor', tipo: 'identificar', estructura: 'oculomotor', objetivo: 3, paso: 'ojo' },
    {
      id: 'fun-quiasma', tipo: 'funcion', objetivo: 2, paso: 'sentidos', estructuras: ['optico', 'quiasma'],
      enunciado: '¿Qué fibras se cruzan en el quiasma óptico?',
      correcta: 'Las de la mitad nasal (medial) de cada retina',
      distractores: ['Las de la mitad temporal (lateral) de cada retina', 'Todas las de los dos ojos', 'Ninguna: solo se juntan'],
      explicacion: 'Las nasales pasan al lado contrario; las temporales siguen en su lado.',
      evidencia: [T(`${NC}optic-cnii`, 'fibres from the nasal (medial) half of each retina cross over to the contralateral optic tract, while fibres from the temporal (lateral) halves remain ipsilateral')],
    },
    {
      id: 'fun-abducens', tipo: 'funcion', objetivo: 2, paso: 'ojo', estructuras: ['abducens'],
      enunciado: '¿Qué músculo inerva el nervio abducens?',
      correcta: 'El recto lateral',
      distractores: ['El oblicuo superior', 'El recto medial', 'El elevador del párpado superior'],
      explicacion: 'El oblicuo superior es del troclear; el recto medial y el elevador, del oculomotor.',
      evidencia: [T(`${NC}abducens-nerve`, 'providing innervation to the lateral rectus muscle.')],
    },
    {
      id: 'comp-trigemino-facial', tipo: 'comparacion', objetivo: 2, paso: 'trigemino-facial', estructuras: ['trigemino', 'facial'],
      enunciado: '¿Qué nervio mueve los músculos de la expresión de la cara?',
      correcta: 'El facial',
      distractores: ['El trigémino', 'El hipogloso', 'El oculomotor'],
      explicacion: 'El trigémino da la sensibilidad de la cara y mueve los de la masticación; el facial, los de la expresión.',
      evidencia: [T(`${NC}facial-nerve`, 'Motor – muscles of facial expression'), T(`${NC}trigeminal-nerve`, 'Motor: Innervation to the muscles of mastication')],
    },
    {
      id: 'fun-gusto', tipo: 'funcion', objetivo: 2, paso: 'bulbares', estructuras: ['glosofaringeo', 'facial'],
      enunciado: '¿Qué nervio lleva el gusto del tercio posterior de la lengua?',
      correcta: 'El glosofaríngeo',
      distractores: ['El facial', 'El hipogloso', 'El trigémino'],
      explicacion: 'Los dos tercios anteriores son del facial (cuerda del tímpano); el hipogloso es motor.',
      evidencia: [T(`${NC}glossopharyngeal-nerve`, 'Special sensory: Provides taste sensation to the posterior 1/3 of the tongue.')],
    },
    {
      id: 'fun-accesorio', tipo: 'funcion', objetivo: 2, paso: 'bulbares', estructuras: ['accesorio'],
      enunciado: '¿Qué músculos inerva el nervio accesorio?',
      correcta: 'El esternocleidomastoideo y el trapecio',
      distractores: ['Los de la lengua', 'Los de la faringe y la laringe', 'Los de la masticación'],
      explicacion: 'La lengua es del hipogloso; la faringe y la laringe, del vago; la masticación, del trigémino.',
      evidencia: [T(`${NC}accessory`, 'innervating the sternocleidomastoid and trapezius muscles.')],
    },
    {
      id: 'rel-vago', tipo: 'relacion', objetivo: 2, paso: 'bulbares', estructuras: ['vago'],
      enunciado: '¿Qué nervio craneal tiene el recorrido más largo, hasta el abdomen?',
      correcta: 'El vago',
      distractores: ['El troclear', 'El accesorio', 'El glosofaríngeo'],
      explicacion: 'El troclear tiene el recorrido intracraneal más largo; el vago, el total.',
      evidencia: [T(`${NC}vagus-nerve-cn-x`, 'The vagus nerve has the longest course of all the cranial nerves, extending from the head to the abdomen.')],
    },
    {
      id: 'rel-motores', tipo: 'relacion', objetivo: 1, paso: 'tipos', estructuras: ['troclear', 'abducens', 'accesorio', 'hipogloso'],
      enunciado: '¿Cuál de estos nervios craneales es solo motor?',
      correcta: 'El hipogloso',
      distractores: ['El vestibulococlear', 'El trigémino', 'El vago'],
      explicacion: 'El vestibulococlear es sensitivo; el trigémino y el vago, mixtos.',
      evidencia: [T(`${NC}hypoglossal`, 'The nerve has a purely somatic motor function')],
    },
    {
      id: 'rel-sensitivo', tipo: 'relacion', objetivo: 1, paso: 'tipos', estructuras: ['olfatorio', 'optico', 'vestibulococlear'],
      enunciado: '¿Cuál de estos nervios es sensitivo?',
      correcta: 'El vestibulococlear',
      distractores: ['El abducens', 'El accesorio', 'El troclear'],
      explicacion: 'Los otros tres son solo motores.',
      evidencia: [T(`${NC}vestibulocochlear`, 'Both have a purely sensory function.')],
    },
    {
      id: 'rel-oculomotor', tipo: 'relacion', objetivo: 4, paso: 'lesiones', estructuras: ['oculomotor'],
      enunciado: 'Un paciente tiene el párpado caído, el ojo hacia abajo y afuera y la pupila dilatada. ¿Qué nervio está lesionado?',
      correcta: 'El oculomotor',
      distractores: ['El abducens', 'El troclear', 'El óptico'],
      explicacion: 'Sin el oculomotor solo quedan el recto lateral y el oblicuo superior, y el dilatador de la pupila sin oposición.',
      evidencia: [T(`${NC}oculomotor`, 'Oculomotor nerve palsy presents with ptosis, or drooping of the upper eyelid, and a')],
    },
    {
      id: 'rel-hipogloso', tipo: 'relacion', objetivo: 4, paso: 'lesiones', estructuras: ['hipogloso'],
      enunciado: 'Al sacar la lengua, se desvía a la derecha. ¿Qué nervio está lesionado?',
      correcta: 'El hipogloso derecho',
      distractores: ['El hipogloso izquierdo', 'El facial derecho', 'El glosofaríngeo izquierdo'],
      explicacion: 'La lengua se desvía hacia el lado del nervio dañado.',
      evidencia: [T(`${NC}hypoglossal`, 'Right hypoglossal nerve palsy, characterised by deviation of the tongue to the right.')],
    },
  ],
});
