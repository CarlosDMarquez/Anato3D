// Fichas anatómicas en español: nombre, término latino (Terminologia Anatomica),
// etimología, descripción y puntos clave. Las claves coinciden con el nombre base del
// objeto en el modelo (sin _L/_R) o con una clave de patrón asignada en resolve.js.
//
// tipo: clasificación que se muestra como etiqueta. Los textos están pensados para todo
// público, pero con terminología correcta para estudiantes.

export const ANATOMIA = {
  // ── Neurocráneo ───────────────────────────────────────────────
  Frontal_Bone: {
    nombre: 'Hueso frontal', latin: 'Os frontale', tipo: 'Hueso plano',
    etimologia: 'Del latín frons, frontis, «frente».',
    descripcion: 'Forma la frente, la parte anterior de la bóveda del cráneo y el techo de las órbitas. Protege los lóbulos frontales del cerebro y contiene los senos frontales, cavidades con aire que aligeran el hueso.',
    datos: [
      'Al nacer está formado por dos mitades que se fusionan en los primeros años de vida (sutura metópica).',
      'Se articula con los parietales mediante la sutura coronal.',
      'Por la escotadura o foramen supraorbitario pasa el nervio supraorbitario.',
    ],
  },
  Parietal_Bone: {
    nombre: 'Hueso parietal', latin: 'Os parietale', tipo: 'Hueso plano',
    etimologia: 'Del latín paries, parietis, «pared»: forma las paredes laterales del cráneo.',
    descripcion: 'Par de huesos planos y cuadriláteros que forman la mayor parte del techo y de los lados de la bóveda craneal. Cubren y protegen la parte superior del cerebro.',
    datos: [
      'Los dos parietales se unen en la línea media por la sutura sagital.',
      'Se articulan con el frontal (sutura coronal), el occipital (sutura lambdoidea) y el temporal (sutura escamosa).',
      'En su cara interna tienen surcos por donde discurren las ramas de la arteria meníngea media.',
    ],
  },
  Occipital_Bone: {
    nombre: 'Hueso occipital', latin: 'Os occipitale', tipo: 'Hueso plano',
    etimologia: 'Del latín occiput, «parte posterior de la cabeza» (de ob-, «detrás», y caput, «cabeza»).',
    descripcion: 'Forma la parte posterior y la base del cráneo. Tiene un gran orificio, el foramen magno, por donde el encéfalo se continúa con la médula espinal.',
    datos: [
      'Sus cóndilos se articulan con el atlas (C1) y permiten el movimiento de asentir con la cabeza.',
      'La protuberancia occipital externa se palpa fácilmente en la nuca.',
      'Aloja al cerebelo y a los lóbulos occipitales del cerebro, responsables de la visión.',
    ],
  },
  Temporal_Bone: {
    nombre: 'Hueso temporal', latin: 'Os temporale', tipo: 'Hueso irregular',
    etimologia: 'Del latín tempora, «sienes», emparentado con tempus, «tiempo». Una explicación tradicional es que en las sienes aparecen las primeras canas, señal del paso del tiempo.',
    descripcion: 'Par de huesos situados a los lados y en la base del cráneo. Contienen los órganos del oído medio e interno y forman parte de la articulación de la mandíbula.',
    datos: [
      'Su porción petrosa es una de las más densas del cuerpo y aloja la cóclea y los conductos semicirculares.',
      'La apófisis mastoides se palpa detrás de la oreja.',
      'Su fosa mandibular se articula con la mandíbula (articulación temporomandibular).',
    ],
  },
  Sphenoid_Bone: {
    nombre: 'Hueso esfenoides', latin: 'Os sphenoidale', tipo: 'Hueso irregular',
    etimologia: 'Del griego sphēn, «cuña», y eidos, «forma»: está encajado como una cuña entre los demás huesos del cráneo.',
    descripcion: 'Hueso impar con forma de mariposa situado en el centro de la base del cráneo. Se articula con todos los demás huesos del neurocráneo y funciona como su «piedra angular».',
    datos: [
      'La silla turca, en su cara superior, aloja la hipófisis.',
      'Por sus orificios pasan nervios craneales y vasos importantes; por ejemplo, el nervio óptico atraviesa el conducto óptico.',
      'Contiene los senos esfenoidales.',
    ],
  },
  Ethmoid_Bone: {
    nombre: 'Hueso etmoides', latin: 'Os ethmoidale', tipo: 'Hueso irregular',
    etimologia: 'Del griego ēthmos, «criba» o «colador», y eidos, «forma», por su lámina perforada.',
    descripcion: 'Hueso ligero y esponjoso situado entre las órbitas, detrás de la nariz. Forma parte del techo y de las paredes de la cavidad nasal y de la pared medial de las órbitas.',
    datos: [
      'Su lámina cribosa está perforada por los filetes del nervio olfatorio.',
      'Forma los cornetes nasales superior y medio.',
      'Contiene numerosas celdillas aéreas (senos etmoidales).',
    ],
  },

  // ── Viscerocráneo ─────────────────────────────────────────────
  Nasal_Bone: {
    nombre: 'Hueso nasal', latin: 'Os nasale', tipo: 'Hueso plano',
    etimologia: 'Del latín nasus, «nariz».',
    descripcion: 'Par de huesos pequeños y alargados que forman el puente de la nariz. Por debajo continúan los cartílagos nasales, que dan forma a la punta.',
    datos: [
      'Es el hueso de la cara que se fractura con más frecuencia.',
      'Se articula con el frontal, el etmoides, el maxilar y con el nasal del lado opuesto.',
    ],
  },
  Lacrimal_Bone: {
    nombre: 'Hueso lagrimal', latin: 'Os lacrimale', tipo: 'Hueso plano',
    etimologia: 'Del latín lacrima, «lágrima».',
    descripcion: 'Es el hueso más pequeño y frágil de la cara. Está en la pared medial de la órbita y forma parte del conducto por donde las lágrimas drenan hacia la nariz.',
    datos: [
      'Contiene la fosa del saco lagrimal.',
      'Por el conducto nasolagrimal las lágrimas llegan al meato nasal inferior; por eso llorar hace que «moquee» la nariz.',
    ],
  },
  Zygomatic_Bone: {
    nombre: 'Hueso cigomático', latin: 'Os zygomaticum', tipo: 'Hueso irregular',
    etimologia: 'Del griego zygōma, «yugo» o «unión», porque une la cara con el cráneo formando el arco cigomático.',
    descripcion: 'Conocido como pómulo, da forma a la mejilla y a la parte lateral e inferior de la órbita.',
    datos: [
      'Su apófisis temporal se une a la del temporal para formar el arco cigomático.',
      'En él se origina parte del músculo masetero, uno de los principales músculos de la masticación.',
    ],
  },
  Maxilla: {
    nombre: 'Maxilar', latin: 'Maxilla', tipo: 'Hueso irregular',
    etimologia: 'Del latín maxilla, «mandíbula» o «quijada».',
    descripcion: 'Par de huesos que forman la mandíbula superior. Sostienen los dientes superiores y forman parte del paladar, del suelo de las órbitas y de las paredes de la cavidad nasal.',
    datos: [
      'Contiene el seno maxilar, el más grande de los senos paranasales.',
      'Su apófisis alveolar aloja las raíces de los dientes superiores.',
      'Los dos maxilares se unen en la línea media y forman la mayor parte del paladar duro.',
    ],
  },
  Palatine_Bone: {
    nombre: 'Hueso palatino', latin: 'Os palatinum', tipo: 'Hueso irregular',
    etimologia: 'Del latín palatum, «paladar».',
    descripcion: 'Par de huesos en forma de L situados detrás de los maxilares. Forman la parte posterior del paladar duro y parte de la cavidad nasal y de la órbita.',
    datos: [
      'Su lámina horizontal completa el paladar duro.',
      'Por sus agujeros palatinos pasan nervios y vasos hacia el paladar.',
    ],
  },
  Inferior_Nasal_Concha: {
    nombre: 'Cornete nasal inferior', latin: 'Concha nasalis inferior', tipo: 'Hueso plano',
    etimologia: 'Del latín concha, «concha», por su forma enrollada.',
    descripcion: 'Lámina ósea curva que sobresale de la pared lateral de la cavidad nasal. Aumenta la superficie de la mucosa, que calienta, humedece y filtra el aire que respiramos.',
    datos: [
      'Es un hueso independiente; los cornetes superior y medio forman parte del etmoides.',
      'Debajo de él desemboca el conducto nasolagrimal.',
    ],
  },
  Vomer: {
    nombre: 'Vómer', latin: 'Vomer', tipo: 'Hueso plano',
    etimologia: 'Del latín vomer, «reja del arado», por su forma.',
    descripcion: 'Hueso delgado e impar que forma la parte posterior e inferior del tabique nasal, la pared que divide la nariz en dos fosas.',
    datos: [
      'Por delante continúa con el cartílago del tabique nasal.',
      'Se articula con el esfenoides, el etmoides, los maxilares y los palatinos.',
    ],
  },
  Mandible: {
    nombre: 'Mandíbula', latin: 'Mandibula', tipo: 'Hueso irregular',
    etimologia: 'Del latín mandibula, derivado de mandere, «masticar».',
    descripcion: 'Es el hueso más grande y fuerte de la cara y el único hueso del cráneo que se mueve. Sostiene los dientes inferiores y permite masticar y hablar.',
    datos: [
      'Se articula con el temporal a cada lado (articulación temporomandibular).',
      'En ella se insertan los músculos de la masticación.',
      'El nervio alveolar inferior la recorre por dentro y da sensibilidad a los dientes inferiores.',
    ],
  },
  Hyoid_Bone: {
    nombre: 'Hueso hioides', latin: 'Os hyoideum', tipo: 'Hueso irregular',
    etimologia: 'Del griego hyoeidēs, «con forma de ípsilon (υ)», por su forma de U.',
    descripcion: 'Hueso en forma de herradura situado en el cuello, por encima de la laringe. Es el único hueso del cuerpo que no se articula con ningún otro: está suspendido por músculos y ligamentos.',
    datos: [
      'Sirve de anclaje a la lengua y a músculos que intervienen en la deglución y el habla.',
      'Su fractura puede indicar estrangulamiento, por lo que es relevante en medicina forense.',
    ],
  },

  // ── Huesecillos del oído ──────────────────────────────────────
  Malleus: {
    nombre: 'Martillo', latin: 'Malleus', tipo: 'Huesecillo del oído',
    etimologia: 'Del latín malleus, «martillo», por su forma.',
    descripcion: 'El más externo de los tres huesecillos del oído medio. Está unido a la membrana del tímpano y transmite sus vibraciones al yunque.',
    datos: [
      'Los huesecillos del oído son los huesos más pequeños del cuerpo.',
      'En él se inserta el músculo tensor del tímpano.',
    ],
  },
  Incus: {
    nombre: 'Yunque', latin: 'Incus', tipo: 'Huesecillo del oído',
    etimologia: 'Del latín incus, «yunque».',
    descripcion: 'Huesecillo intermedio del oído medio. Recibe las vibraciones del martillo y las transmite al estribo.',
    datos: ['Se articula con el martillo y con el estribo mediante pequeñas articulaciones sinoviales.'],
  },
  Stapes: {
    nombre: 'Estribo', latin: 'Stapes', tipo: 'Huesecillo del oído',
    etimologia: 'Del latín medieval stapes, «estribo», por su forma.',
    descripcion: 'Es el hueso más pequeño del cuerpo humano (unos 3 mm). Su base encaja en la ventana oval y transmite las vibraciones al líquido del oído interno.',
    datos: [
      'El músculo estapedio, el más pequeño del cuerpo, lo frena ante ruidos fuertes.',
      'Su fijación anómala (otosclerosis) es una causa de sordera.',
    ],
  },

  // ── Dientes ───────────────────────────────────────────────────
  Medial_Incisor: {
    nombre: 'Incisivo central', latin: 'Dens incisivus medialis', tipo: 'Diente permanente',
    etimologia: 'Del latín incidere, «cortar».',
    descripcion: 'Diente con corona afilada en forma de pala situado en la parte frontal de la boca. Corta los alimentos al morder.',
    datos: ['Tiene una sola raíz.', 'Es de los primeros dientes permanentes en salir, entre los 6 y los 8 años.'],
  },
  Lateral_Incisor: {
    nombre: 'Incisivo lateral', latin: 'Dens incisivus lateralis', tipo: 'Diente permanente',
    etimologia: 'Del latín incidere, «cortar».',
    descripcion: 'Diente cortante situado junto al incisivo central. Es algo más pequeño que este y ayuda a cortar los alimentos.',
    datos: ['Tiene una sola raíz.', 'El incisivo lateral superior es uno de los dientes que con más frecuencia faltan de forma congénita.'],
  },
  Canine: {
    nombre: 'Canino', latin: 'Dens caninus', tipo: 'Diente permanente',
    etimologia: 'Del latín canis, «perro», por su parecido con los colmillos de este animal.',
    descripcion: 'Diente puntiagudo situado en la esquina de la arcada dental. Desgarra los alimentos.',
    datos: ['Tiene la raíz más larga de todos los dientes.', 'Popularmente se le llama colmillo.'],
  },
  First_Premolar: {
    nombre: 'Primer premolar', latin: 'Dens premolaris', tipo: 'Diente permanente',
    etimologia: 'Del latín prae-, «delante de», y molaris (de mola, «piedra de molino»): está delante de los molares.',
    descripcion: 'Diente de transición, generalmente con dos cúspides, que desgarra y tritura los alimentos.',
    datos: ['Los premolares no existen en la dentición de leche: sustituyen a los molares temporales.', 'El primer premolar superior suele tener dos raíces.'],
  },
  Second_Premolar: {
    nombre: 'Segundo premolar', latin: 'Dens premolaris', tipo: 'Diente permanente',
    etimologia: 'Del latín prae-, «delante de», y molaris (de mola, «piedra de molino»): está delante de los molares.',
    descripcion: 'Diente de transición situado entre el primer premolar y el primer molar. Tritura los alimentos.',
    datos: ['Los premolares no existen en la dentición de leche: sustituyen a los molares temporales.', 'Suele tener una sola raíz.'],
  },
  First_Molar: {
    nombre: 'Primer molar', latin: 'Dens molaris', tipo: 'Diente permanente',
    etimologia: 'Del latín mola, «piedra de molino».',
    descripcion: 'Diente ancho con varias cúspides que muele los alimentos. Es el diente más grande de la arcada.',
    datos: ['Sale hacia los 6 años sin reemplazar a ningún diente de leche, por eso a veces se confunde con uno temporal.', 'Los molares superiores suelen tener tres raíces y los inferiores dos.'],
  },
  Second_Molar: {
    nombre: 'Segundo molar', latin: 'Dens molaris', tipo: 'Diente permanente',
    etimologia: 'Del latín mola, «piedra de molino».',
    descripcion: 'Diente posterior con varias cúspides que muele los alimentos.',
    datos: ['Sale hacia los 12 años.', 'Detrás de él puede aparecer el tercer molar o «muela del juicio», que este modelo no incluye.'],
  },

  // ── Columna vertebral ─────────────────────────────────────────
  Atlas: {
    nombre: 'Atlas (C1)', latin: 'Atlas', tipo: 'Vértebra cervical',
    etimologia: 'Por el titán Atlas de la mitología griega, condenado a sostener la bóveda celeste: esta vértebra sostiene el cráneo.',
    descripcion: 'Primera vértebra cervical. Tiene forma de anillo, sin cuerpo vertebral ni apófisis espinosa, y soporta el cráneo.',
    datos: [
      'Con el occipital forma la articulación atlantooccipital, que permite el movimiento de «sí».',
      'Gira alrededor del diente del axis, lo que permite el movimiento de «no».',
    ],
  },
  Axis: {
    nombre: 'Axis (C2)', latin: 'Axis', tipo: 'Vértebra cervical',
    etimologia: 'Del latín axis, «eje», porque es el pivote alrededor del cual gira el atlas.',
    descripcion: 'Segunda vértebra cervical. Tiene una prolongación vertical, el diente o apófisis odontoides, que actúa como eje de rotación de la cabeza.',
    datos: [
      'La articulación atlantoaxial aporta cerca de la mitad de la rotación del cuello.',
      'El diente del axis es una referencia importante en los traumatismos cervicales.',
    ],
  },
  Cervical_Vertebra: {
    nombre: 'Vértebra cervical', latin: 'Vertebra cervicalis', tipo: 'Hueso irregular',
    etimologia: 'Vértebra, del latín vertere, «girar»; cervical, de cervix, «cuello».',
    descripcion: 'Las siete vértebras cervicales (C1–C7) forman el esqueleto del cuello. Son las más pequeñas y móviles de la columna.',
    datos: [
      'Sus apófisis transversas tienen un orificio por donde sube la arteria vertebral hacia el encéfalo.',
      'De C3 a C6 sus apófisis espinosas suelen ser bífidas (divididas en dos).',
    ],
  },
  Thoracic_Vertebra: {
    nombre: 'Vértebra torácica', latin: 'Vertebra thoracica', tipo: 'Hueso irregular',
    etimologia: 'Del griego thōrax, «coraza» o «pecho».',
    descripcion: 'Las doce vértebras torácicas (T1–T12) forman la parte de la columna que corresponde al tórax y se articulan con las costillas.',
    datos: [
      'Tienen carillas articulares para las cabezas y los tubérculos de las costillas.',
      'Sus apófisis espinosas son largas y se inclinan hacia abajo, como tejas.',
      'Es el segmento menos móvil de la columna.',
    ],
  },
  Lumbar_Vertebra: {
    nombre: 'Vértebra lumbar', latin: 'Vertebra lumbalis', tipo: 'Hueso irregular',
    etimologia: 'Del latín lumbus, «lomo».',
    descripcion: 'Las cinco vértebras lumbares (L1–L5) son las más grandes de la columna porque soportan la mayor parte del peso del tronco.',
    datos: [
      'Sus cuerpos son anchos y con forma de riñón.',
      'Permiten sobre todo flexionar y extender el tronco.',
      'La mayoría de las hernias de disco se producen entre L4–L5 y L5–S1.',
    ],
  },
  Sacrum: {
    nombre: 'Sacro', latin: 'Os sacrum', tipo: 'Hueso irregular',
    etimologia: 'Del latín os sacrum, «hueso sagrado», traducción del griego hieron osteon. El origen del nombre es incierto: se ha relacionado con ofrendas en sacrificios o con el sentido de «hueso grande».',
    descripcion: 'Hueso triangular formado por la fusión de cinco vértebras sacras. Encaja entre los dos coxales y forma la pared posterior de la pelvis.',
    datos: [
      'Se articula con los coxales en las articulaciones sacroilíacas, que transmiten el peso del tronco a las piernas.',
      'Las vértebras sacras terminan de fusionarse en la edad adulta temprana.',
      'Por sus agujeros sacros salen los nervios sacros.',
    ],
  },
  Coccyx: {
    nombre: 'Cóccix', latin: 'Os coccygis', tipo: 'Hueso irregular',
    etimologia: 'Del griego kokkyx, «cuco», por su parecido con el pico de esta ave.',
    descripcion: 'Pequeño hueso triangular al final de la columna, formado por tres a cinco vértebras rudimentarias fusionadas. Es el vestigio de la cola.',
    datos: [
      'Sirve de anclaje a músculos y ligamentos del suelo pélvico y al glúteo mayor.',
      'Soporta parte del peso al sentarse inclinado hacia atrás.',
    ],
  },

  // ── Tórax ─────────────────────────────────────────────────────
  Rib: {
    nombre: 'Costilla', latin: 'Costa', tipo: 'Hueso plano',
    etimologia: 'Del latín costa, «costilla» o «costado».',
    descripcion: 'Las costillas son doce pares de huesos curvos que forman la caja torácica. Protegen el corazón y los pulmones y se mueven al respirar.',
    datos: [
      'Todas se articulan por detrás con las vértebras torácicas.',
      'Por el surco de su borde inferior discurren la vena, la arteria y el nervio intercostales (en ese orden, de arriba abajo).',
    ],
  },
  Costal_Cartilage: {
    nombre: 'Cartílago costal', latin: 'Cartilago costalis', tipo: 'Cartílago hialino',
    etimologia: 'Del latín cartilago, «ternilla»; costal, de costa, «costilla».',
    descripcion: 'Barras de cartílago hialino que prolongan las costillas hacia delante. Su elasticidad permite que el tórax se expanda al respirar.',
    datos: [
      'Los cartílagos de las costillas 1 a 7 llegan directamente al esternón; los de la 8 a la 10 se unen al cartílago de la costilla de arriba.',
      'Con la edad pueden calcificarse parcialmente.',
    ],
  },
  Sternum_Manubrium: {
    nombre: 'Manubrio del esternón', latin: 'Manubrium sterni', tipo: 'Hueso plano',
    etimologia: 'Del latín manubrium, «mango» o «empuñadura»: el esternón se compara con una espada cuyo mango es el manubrio.',
    descripcion: 'Parte superior y más ancha del esternón. Se articula con las clavículas y con los cartílagos de las primeras costillas.',
    datos: [
      'La escotadura yugular, en su borde superior, se palpa en la base del cuello.',
      'Se une al cuerpo del esternón formando el ángulo esternal (de Louis), donde se articula la 2.ª costilla: es la referencia para contar costillas.',
    ],
  },
  Sternum_Body: {
    nombre: 'Cuerpo del esternón', latin: 'Corpus sterni', tipo: 'Hueso plano',
    etimologia: 'Esternón, del griego sternon, «pecho».',
    descripcion: 'Parte media y más larga del esternón, la «hoja» de la espada. Se articula con los cartílagos de las costillas 2.ª a 7.ª.',
    datos: [
      'En la reanimación cardiopulmonar las compresiones se hacen sobre la mitad inferior del esternón.',
      'Conserva médula ósea roja productora de sangre durante toda la vida.',
    ],
  },
  Sternum_Xiphoid_Process: {
    nombre: 'Apófisis xifoides', latin: 'Processus xiphoideus', tipo: 'Parte del esternón',
    etimologia: 'Del griego xiphos, «espada», y eidos, «forma»: es la punta de la espada.',
    descripcion: 'Pequeña prolongación en el extremo inferior del esternón. Es cartilaginosa en la juventud y se osifica con la edad.',
    datos: [
      'En ella se insertan fibras del diafragma y del músculo recto del abdomen.',
      'En la RCP las manos se colocan por encima de ella para no fracturarla.',
    ],
  },

  // ── Cintura escapular y miembro superior ──────────────────────
  Clavicle: {
    nombre: 'Clavícula', latin: 'Clavicula', tipo: 'Hueso largo',
    etimologia: 'Del latín clavicula, «llavecita», diminutivo de clavis, «llave», por su forma de S que recuerda a una llave antigua.',
    descripcion: 'Hueso largo en forma de S que une el miembro superior con el tronco. Actúa como un puntal que mantiene el hombro separado del tórax.',
    datos: [
      'Es el único hueso largo dispuesto horizontalmente.',
      'Se articula con el esternón (articulación esternoclavicular) y con la escápula (articulación acromioclavicular).',
      'Es de los huesos que más se fracturan, sobre todo en su tercio medio.',
    ],
  },
  Scapula: {
    nombre: 'Escápula (omóplato)', latin: 'Scapula', tipo: 'Hueso plano',
    etimologia: 'Del latín scapula, «hombro». Omóplato viene del griego ōmos, «hombro», y platē, «superficie plana».',
    descripcion: 'Hueso plano y triangular situado en la parte posterior del tórax. Se desliza sobre las costillas y forma la cavidad donde encaja la cabeza del húmero.',
    datos: [
      'Su cavidad glenoidea forma con el húmero la articulación del hombro.',
      'En ella se insertan 17 músculos, entre ellos los del manguito rotador.',
      'El acromion forma el punto más alto del hombro.',
    ],
  },
  Humerus: {
    nombre: 'Húmero', latin: 'Humerus', tipo: 'Hueso largo',
    etimologia: 'Del latín humerus, «hombro».',
    descripcion: 'Hueso largo del brazo, entre el hombro y el codo.',
    datos: [
      'Su cabeza se articula con la escápula en el hombro.',
      'El nervio radial rodea su diáfisis por detrás; una fractura en esa zona puede lesionarlo.',
      'El nervio cubital pasa detrás del epicóndilo medial: es el «hueso de la risa».',
    ],
  },
  Radius: {
    nombre: 'Radio', latin: 'Radius', tipo: 'Hueso largo',
    etimologia: 'Del latín radius, «rayo de una rueda» o «vara».',
    descripcion: 'Hueso lateral del antebrazo, del lado del pulgar. Gira alrededor de la ulna para voltear la palma de la mano hacia arriba (supinación) o hacia abajo (pronación).',
    datos: [
      'Su extremo distal forma la mayor parte de la articulación de la muñeca.',
      'La fractura de su extremo distal (fractura de Colles) es muy frecuente al caer sobre la mano extendida.',
    ],
  },
  Ulna: {
    nombre: 'Ulna (cúbito)', latin: 'Ulna', tipo: 'Hueso largo',
    etimologia: 'Del latín ulna, «codo» o «antebrazo». El nombre tradicional, cúbito, viene del latín cubitus, «codo».',
    descripcion: 'Hueso medial del antebrazo, del lado del meñique. Forma con el húmero la principal articulación del codo.',
    datos: [
      'Su olécranon es la punta del codo, la que apoyamos sobre la mesa.',
      'Permanece fija mientras el radio gira a su alrededor.',
    ],
  },
  Scaphoid: {
    nombre: 'Escafoides', latin: 'Os scaphoideum', tipo: 'Hueso corto · carpo',
    etimologia: 'Del griego skaphē, «barca», y eidos, «forma».',
    descripcion: 'El más grande de la fila proximal del carpo, del lado del pulgar. Une las dos filas de huesos de la muñeca.',
    datos: [
      'Es el hueso del carpo que más se fractura.',
      'Su irrigación entra por el extremo distal, por eso una fractura puede dejar sin sangre al fragmento proximal (necrosis).',
      'Se palpa en la «tabaquera anatómica», en la base del pulgar.',
    ],
  },
  Lunate: {
    nombre: 'Semilunar', latin: 'Os lunatum', tipo: 'Hueso corto · carpo',
    etimologia: 'Del latín luna, por su forma de media luna.',
    descripcion: 'Hueso central de la fila proximal del carpo. Se articula con el radio.',
    datos: ['Es el hueso del carpo que se luxa con más frecuencia.', 'Su necrosis se conoce como enfermedad de Kienböck.'],
  },
  Triquetrum: {
    nombre: 'Piramidal', latin: 'Os triquetrum', tipo: 'Hueso corto · carpo',
    etimologia: 'Del latín triquetrus, «de tres puntas» o «triangular».',
    descripcion: 'Hueso de la fila proximal del carpo, del lado del meñique, con forma de pirámide.',
    datos: ['Sobre su cara anterior se apoya el pisiforme.'],
  },
  Pisiform: {
    nombre: 'Pisiforme', latin: 'Os pisiforme', tipo: 'Hueso sesamoideo · carpo',
    etimologia: 'Del latín pisum, «guisante», y forma.',
    descripcion: 'Es el hueso más pequeño del carpo. Se forma dentro del tendón del músculo flexor cubital del carpo, por lo que se considera un hueso sesamoideo.',
    datos: ['Se palpa en la base de la palma, del lado del meñique.'],
  },
  Trapezium: {
    nombre: 'Trapecio', latin: 'Os trapezium', tipo: 'Hueso corto · carpo',
    etimologia: 'Del griego trapezion, «mesita».',
    descripcion: 'Hueso de la fila distal del carpo situado en la base del pulgar.',
    datos: [
      'Su articulación en silla de montar con el primer metacarpiano permite la oposición del pulgar.',
      'Esta articulación se ve afectada a menudo por artrosis (rizartrosis).',
    ],
  },
  Trapezoid: {
    nombre: 'Trapezoide', latin: 'Os trapezoideum', tipo: 'Hueso corto · carpo',
    etimologia: 'Del griego trapezion, «mesita», y eidos, «forma».',
    descripcion: 'Pequeño hueso de la fila distal del carpo, entre el trapecio y el grande. Se articula con el segundo metacarpiano.',
    datos: ['Es el hueso del carpo que menos se fractura.'],
  },
  Capitate: {
    nombre: 'Grande', latin: 'Os capitatum', tipo: 'Hueso corto · carpo',
    etimologia: 'Del latín caput, «cabeza», por su extremo redondeado.',
    descripcion: 'El hueso más grande del carpo, situado en el centro de la muñeca.',
    datos: ['Es el primer hueso del carpo en osificarse, hacia el primer año de vida.', 'Se articula con el tercer metacarpiano.'],
  },
  Hamate: {
    nombre: 'Ganchoso', latin: 'Os hamatum', tipo: 'Hueso corto · carpo',
    etimologia: 'Del latín hamus, «gancho».',
    descripcion: 'Hueso de la fila distal del carpo, del lado del meñique, con una prolongación en forma de gancho hacia la palma.',
    datos: [
      'Su gancho limita el canal de Guyon, por donde pasa el nervio cubital.',
      'Se articula con los metacarpianos IV y V.',
    ],
  },
  Metacarpal: {
    nombre: 'Metacarpiano', latin: 'Os metacarpi', tipo: 'Hueso largo · mano',
    etimologia: 'Del griego meta, «después de», y karpos, «muñeca».',
    descripcion: 'Los cinco metacarpianos forman el esqueleto de la palma. Cada uno se articula con el carpo y con la falange proximal de un dedo.',
    datos: [
      'Sus cabezas forman los nudillos al cerrar el puño.',
      'Se numeran del I (pulgar) al V (meñique).',
      'La fractura del cuello del V metacarpiano se conoce como «fractura del boxeador».',
    ],
  },
  Proximal_Phalanx: {
    nombre: 'Falange proximal', latin: 'Phalanx proximalis', tipo: 'Hueso largo',
    etimologia: 'Del griego phalanx, «formación de soldados en fila», por su disposición alineada.',
    descripcion: 'Primera falange de cada dedo y la más larga. Se articula con la cabeza del metacarpiano o metatarsiano correspondiente.',
    datos: ['La mano y el pie tienen 14 falanges cada uno: tres por dedo y dos en el pulgar o el dedo gordo.'],
  },
  Middle_Phalanx: {
    nombre: 'Falange media', latin: 'Phalanx media', tipo: 'Hueso largo',
    etimologia: 'Del griego phalanx, «formación de soldados en fila», por su disposición alineada.',
    descripcion: 'Falange intermedia de los dedos segundo a quinto. El pulgar y el dedo gordo del pie no la tienen.',
    datos: ['La mano y el pie tienen 14 falanges cada uno: tres por dedo y dos en el pulgar o el dedo gordo.'],
  },
  Distal_Phalanx: {
    nombre: 'Falange distal', latin: 'Phalanx distalis', tipo: 'Hueso largo',
    etimologia: 'Del griego phalanx, «formación de soldados en fila», por su disposición alineada.',
    descripcion: 'Última falange de cada dedo. Su extremo ensanchado (tuberosidad) sostiene el pulpejo y la uña.',
    datos: ['La mano y el pie tienen 14 falanges cada uno: tres por dedo y dos en el pulgar o el dedo gordo.'],
  },

  // ── Cintura pélvica y miembro inferior ────────────────────────
  Hip_Bone: {
    nombre: 'Coxal (hueso de la cadera)', latin: 'Os coxae', tipo: 'Hueso irregular',
    etimologia: 'Del latín coxa, «cadera». Antiguamente se le llamaba hueso innominado, es decir, «sin nombre».',
    descripcion: 'Hueso grande e irregular que, junto con el sacro, forma la pelvis. Resulta de la fusión de tres huesos: ilion, isquion y pubis.',
    datos: [
      'Los tres huesos se fusionan en el acetábulo durante la adolescencia.',
      'El acetábulo recibe la cabeza del fémur y forma la articulación de la cadera.',
      'La pelvis femenina es más ancha y tiene una abertura superior más redondeada que la masculina, adaptada al parto.',
    ],
  },
  Femur: {
    nombre: 'Fémur', latin: 'Femur', tipo: 'Hueso largo',
    etimologia: 'Del latín femur, «muslo».',
    descripcion: 'Es el hueso más largo y fuerte del cuerpo. Va de la cadera a la rodilla y soporta el peso del cuerpo al estar de pie y al caminar.',
    datos: [
      'Su longitud equivale aproximadamente a una cuarta parte de la estatura.',
      'La fractura del cuello del fémur es frecuente en personas mayores con osteoporosis.',
      'El trocánter mayor se palpa en la cara lateral de la cadera.',
    ],
  },
  Patella: {
    nombre: 'Rótula', latin: 'Patella', tipo: 'Hueso sesamoideo',
    etimologia: 'Del latín rotula, «ruedecita». Su nombre latino, patella, significa «platito».',
    descripcion: 'Hueso plano y triangular situado delante de la rodilla. Es el hueso sesamoideo más grande del cuerpo: se forma dentro del tendón del cuádriceps.',
    datos: [
      'Aumenta la palanca del cuádriceps para extender la rodilla.',
      'Protege la parte anterior de la articulación de la rodilla.',
    ],
  },
  Tibia: {
    nombre: 'Tibia', latin: 'Tibia', tipo: 'Hueso largo',
    etimologia: 'Del latín tibia, «flauta», porque las flautas antiguas se fabricaban con tibias de animales.',
    descripcion: 'Hueso principal de la pierna, situado en el lado medial. Transmite el peso del cuerpo del fémur al pie.',
    datos: [
      'Su borde anterior, la espinilla, está justo debajo de la piel.',
      'Su extremo distal forma el maléolo medial del tobillo.',
      'Es el hueso largo que con más frecuencia sufre fracturas abiertas.',
    ],
  },
  Fibula: {
    nombre: 'Fíbula (peroné)', latin: 'Fibula', tipo: 'Hueso largo',
    etimologia: 'Del latín fibula, «broche» o «hebilla». Peroné viene del griego peronē, con el mismo significado.',
    descripcion: 'Hueso largo y delgado situado en el lado lateral de la pierna. Soporta poco peso, pero estabiliza el tobillo y sirve de anclaje a músculos.',
    datos: [
      'Su extremo distal forma el maléolo lateral del tobillo.',
      'El nervio fibular (peroneo) común rodea su cuello y puede lesionarse en fracturas de esa zona.',
      'Se puede extraer parte de ella para injertos óseos.',
    ],
  },
  Talus: {
    nombre: 'Talus (astrágalo)', latin: 'Talus', tipo: 'Hueso corto · tarso',
    etimologia: 'Del latín talus, «tobillo». Astrágalo viene del griego astragalos, «taba», el hueso que se usaba antiguamente como dado.',
    descripcion: 'Hueso del tobillo que conecta la pierna con el pie. Recibe el peso del cuerpo desde la tibia y lo reparte hacia el talón y la parte anterior del pie.',
    datos: ['No tiene inserciones musculares.', 'Gran parte de su superficie está cubierta de cartílago articular.'],
  },
  Calcaneus: {
    nombre: 'Calcáneo', latin: 'Calcaneus', tipo: 'Hueso corto · tarso',
    etimologia: 'Del latín calx, calcis, «talón».',
    descripcion: 'Es el hueso más grande del pie y forma el talón, la primera parte que toca el suelo al caminar.',
    datos: [
      'En su tuberosidad se inserta el tendón calcáneo (de Aquiles).',
      'Suele fracturarse en caídas desde altura al aterrizar de pie.',
    ],
  },
  Navicular: {
    nombre: 'Navicular', latin: 'Os naviculare', tipo: 'Hueso corto · tarso',
    etimologia: 'Del latín navicula, «barquito».',
    descripcion: 'Hueso del tarso situado en el lado medial del pie, entre el talus y los cuneiformes.',
    datos: [
      'Su tuberosidad se palpa en el borde interno del pie; en ella se inserta el músculo tibial posterior.',
      'Es una pieza clave del arco longitudinal medial del pie.',
    ],
  },
  Cuboid: {
    nombre: 'Cuboides', latin: 'Os cuboideum', tipo: 'Hueso corto · tarso',
    etimologia: 'Del griego kybos, «cubo», y eidos, «forma».',
    descripcion: 'Hueso del tarso situado en el borde lateral del pie, delante del calcáneo.',
    datos: ['Se articula con los metatarsianos IV y V.', 'Tiene un surco por donde pasa el tendón del músculo fibular (peroneo) largo.'],
  },
  Medial_Cuneiform: {
    nombre: 'Cuneiforme medial', latin: 'Os cuneiforme mediale', tipo: 'Hueso corto · tarso',
    etimologia: 'Del latín cuneus, «cuña», y forma.',
    descripcion: 'El más grande de los tres cuneiformes. Se articula con el navicular y con la base del primer metatarsiano.',
    datos: ['La forma de cuña de los tres cuneiformes ayuda a formar el arco transverso del pie.'],
  },
  Intermediate_Cuneiform: {
    nombre: 'Cuneiforme intermedio', latin: 'Os cuneiforme intermedium', tipo: 'Hueso corto · tarso',
    etimologia: 'Del latín cuneus, «cuña», y forma.',
    descripcion: 'El más pequeño de los tres cuneiformes. Se articula con el navicular y con la base del segundo metatarsiano.',
    datos: ['La forma de cuña de los tres cuneiformes ayuda a formar el arco transverso del pie.'],
  },
  Lateral_Cuneiform: {
    nombre: 'Cuneiforme lateral', latin: 'Os cuneiforme laterale', tipo: 'Hueso corto · tarso',
    etimologia: 'Del latín cuneus, «cuña», y forma.',
    descripcion: 'Cuneiforme situado junto al cuboides. Se articula con el navicular y con la base del tercer metatarsiano.',
    datos: ['La forma de cuña de los tres cuneiformes ayuda a formar el arco transverso del pie.'],
  },
  Metatarsal: {
    nombre: 'Metatarsiano', latin: 'Os metatarsi', tipo: 'Hueso largo · pie',
    etimologia: 'Del griego meta, «después de», y tarsos, «superficie plana».',
    descripcion: 'Los cinco metatarsianos forman la parte media del pie. Se numeran del I (dedo gordo) al V (dedo pequeño).',
    datos: [
      'El primero es el más corto y grueso y soporta mucho peso al caminar.',
      'La base del V metatarsiano se palpa en el borde externo del pie y se fractura a menudo en torceduras de tobillo.',
      'Las fracturas por estrés («fractura de marcha») afectan sobre todo al II y al III.',
    ],
  },
  Sesamoid_Bones_Foot: {
    nombre: 'Huesos sesamoideos del pie', latin: 'Ossa sesamoidea pedis', tipo: 'Huesos sesamoideos',
    etimologia: 'Del griego sēsamon, «sésamo», por su parecido con estas semillas.',
    descripcion: 'Pequeños huesos incluidos en tendones; los principales son dos, bajo la cabeza del primer metatarsiano. Protegen el tendón y mejoran su palanca.',
    datos: [
      'Soportan mucho peso al impulsarse con la parte anterior del pie.',
      'Su inflamación (sesamoiditis) es frecuente en bailarines y corredores.',
    ],
  },

  // ── Tegumentario y sentidos ───────────────────────────────────
  Skin_Body: {
    nombre: 'Piel', latin: 'Cutis', tipo: 'Órgano',
    etimologia: 'Del latín pellis, «piel». El nombre del sistema tegumentario viene de tegumentum, «cubierta», de tegere, «cubrir».',
    descripcion: 'Es el órgano más grande del cuerpo: en un adulto cubre entre 1,5 y 2 m². Protege frente a golpes, microbios y rayos ultravioleta, regula la temperatura y permite sentir el tacto, el dolor y el calor.',
    datos: [
      'Tiene tres capas: epidermis, dermis e hipodermis (tejido subcutáneo).',
      'Con la luz del sol produce vitamina D.',
      'Sus anexos son el pelo, las uñas y las glándulas sudoríparas y sebáceas.',
    ],
  },
  Skin_Genitals: {
    nombre: 'Piel del pene y del escroto', latin: null, tipo: 'Órgano',
    etimologia: 'Escroto, del latín scrotum, «bolsa de cuero»; pene, de penis, «cola».',
    descripcion: 'Piel de los genitales externos masculinos. La del pene es fina, elástica y se desliza sobre los cuerpos eréctiles. La del escroto forma una bolsa con un músculo liso (dartos) que la arruga con el frío para acercar los testículos al cuerpo.',
    datos: [
      'El escroto mantiene los testículos unos 2–3 °C por debajo de la temperatura del abdomen, lo que necesitan para producir espermatozoides.',
      'El rafe del escroto, la línea media de su piel, marca por dónde se unieron sus dos mitades en el embrión.',
      'En este modelo esta piel se generó alrededor de los órganos de Z-Anatomy, porque la piel base no tenía genitales.',
    ],
  },
  Vulva: {
    nombre: 'Vulva', latin: 'Vulva', tipo: 'Órgano',
    etimologia: 'Del latín vulva, «envoltura», «matriz». Labio, de labium; clítoris, del griego kleitorís.',
    descripcion: 'Conjunto de los genitales externos femeninos: el monte del pubis, los labios mayores y menores, el clítoris (su glande, bajo el capuchón) y el vestíbulo, donde se abren la uretra y la vagina.',
    datos: [
      'Los labios mayores, con grasa y pelo, son el equivalente del escroto; los menores, finos y sin grasa, rodean el vestíbulo y se unen por delante en el capuchón y el frenillo del clítoris.',
      'En el vestíbulo, el orificio de la uretra queda unos 2 cm por detrás del glande del clítoris y por delante del orificio de la vagina; a los lados de este se abren las glándulas vestibulares mayores (de Bartolino).',
      'En este modelo la vulva se modeló sobre la piel base, que no tenía genitales, con medidas de mujeres adultas (Lloyd et al., 2005).',
    ],
  },
  Eyeball: {
    nombre: 'Globo ocular', latin: 'Bulbus oculi', tipo: 'Órgano de los sentidos',
    etimologia: 'Del latín oculus, «ojo»; globo, de globus, «esfera».',
    descripcion: 'Órgano de la visión. Es una esfera de unos 24 mm de diámetro que enfoca la luz sobre la retina, donde se convierte en señales que viajan al cerebro por el nervio óptico.',
    datos: [
      'Tiene tres capas: fibrosa (esclera y córnea), vascular (úvea) y nerviosa (retina).',
      'Lo mueven seis músculos extraoculares.',
      'Se aloja en la órbita, protegido por grasa y por los huesos del cráneo.',
    ],
  },
};
