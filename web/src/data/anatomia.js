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
    descripcion: 'Forma la frente y el techo de las órbitas, y contiene los senos frontales.',
    datos: [
      'Al nacer está formado por dos piezas separadas por la sutura frontal, que suele cerrarse hacia los 8 años, aunque a veces persiste toda la vida.',
      'Se articula con los parietales en la sutura coronal.',
      'Por el foramen supraorbitario sale el nervio supraorbitario.',
    ],
  },
  Parietal_Bone: {
    nombre: 'Hueso parietal', latin: 'Os parietale', tipo: 'Hueso plano',
    etimologia: 'Del latín paries, parietis, «pared»: forma las paredes laterales del cráneo.',
    descripcion: 'Par de huesos aproximadamente cuadriláteros que forman los lados y el techo del neurocráneo. En su cara interna tienen depresiones que corresponden a las circunvoluciones del cerebro.',
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
      'Se articula con el atlas (C1); la articulación atlantooccipital permite mover la cabeza arriba y abajo, como al asentir.',
      'En el centro de su cara externa sobresale la protuberancia occipital externa.',
      'Cubre los lóbulos occipitales del cerebro.',
    ],
  },
  Temporal_Bone: {
    nombre: 'Hueso temporal', latin: 'Os temporale', tipo: 'Hueso irregular',
    etimologia: 'Su origen exacto no se conoce. Se relaciona con el latín tempus, «tiempo»: una explicación es que en las sienes suelen salir las primeras canas.',
    descripcion: 'Par de huesos situados a los lados y en la base del cráneo. Alojan las estructuras del oído medio e interno y se articulan con la mandíbula.',
    datos: [
      'Su porción petrosa es uno de los huesos más densos del cuerpo y aloja en su interior el oído interno.',
      'La apófisis mastoides forma un relieve óseo detrás y debajo de la oreja.',
      'En su fosa mandibular se articula el cóndilo de la mandíbula (articulación temporomandibular).',
    ],
  },
  Sphenoid_Bone: {
    nombre: 'Hueso esfenoides', latin: 'Os sphenoideum', tipo: 'Hueso irregular',
    etimologia: 'Del griego sphēnoeidḗs, «en forma de cuña», de sphēn, «cuña».',
    descripcion: 'Hueso impar del neurocráneo, en el centro de la base del cráneo, hacia delante, por delante del occipital. Se articula con todos los demás huesos del neurocráneo y ayuda a unirlo con el esqueleto de la cara.',
    datos: [
      'La silla turca, en su cara superior, aloja la hipófisis.',
      'Por sus orificios y fisuras pasan nervios y vasos de la cabeza y el cuello, como los nervios oftálmico, maxilar y mandibular.',
      'Contiene los senos esfenoidales.',
    ],
  },
  Ethmoid_Bone: {
    nombre: 'Hueso etmoides', latin: 'Os ethmoidale', tipo: 'Hueso irregular',
    etimologia: 'Del griego hēthmós, «criba».',
    descripcion: 'Hueso ligero y esponjoso situado en el techo de la nariz, entre las dos órbitas. Forma parte del techo de la cavidad nasal (con su lámina cribosa), del tabique nasal y de la pared medial de las órbitas.',
    datos: [
      'Su lámina cribosa está perforada por los orificios olfatorios, por donde pasan los nervios olfatorios hacia el techo de la cavidad nasal.',
      'Los cornetes nasales superior y medio forman parte de él.',
      'Entre sus láminas hay un número variable de pequeñas cavidades con aire: las celdillas etmoidales (senos etmoidales).',
    ],
  },

  // ── Viscerocráneo ─────────────────────────────────────────────
  Nasal_Bone: {
    nombre: 'Hueso nasal', latin: 'Os nasale', tipo: 'Hueso plano',
    etimologia: 'Del latín nasus, «nariz».',
    descripcion: 'Par de huesos pequeños y alargados, uno junto al otro en la parte media y alta de la cara; juntos forman el puente del tercio superior de la nariz.',
    datos: [
      'Las fracturas nasales son frecuentes: suponen alrededor del 40 % de las fracturas de la cara.',
      'Se articula con el frontal, el etmoides, el maxilar y con el nasal del lado opuesto.',
    ],
  },
  Lacrimal_Bone: {
    nombre: 'Hueso lagrimal', latin: 'Os lacrimale', tipo: 'Hueso plano',
    etimologia: 'Del latín lacrima, «lágrima».',
    descripcion: 'Es el hueso más pequeño y frágil del cráneo y de la cara. Está en la parte anterior de la pared medial de la órbita y ayuda a formar el conducto nasolagrimal, por donde drenan las lágrimas.',
    datos: [
      'Su fosa lagrimal aloja el saco lagrimal.',
      'Las lágrimas sobrantes bajan por el conducto nasolagrimal hasta el meato nasal inferior; por eso llorar mucho hace que «moquee» la nariz.',
    ],
  },
  Zygomatic_Bone: {
    nombre: 'Hueso cigomático', latin: 'Os zygomaticum', tipo: 'Hueso irregular',
    etimologia: 'Del griego zygōma, «yugo».',
    descripcion: 'El pómulo: hueso par situado en la parte alta y lateral de la cara, que forma parte de la pared lateral y del suelo de la órbita.',
    datos: [
      'Su apófisis temporal se une a la apófisis cigomática del temporal para formar el arco cigomático.',
      'En su borde inferior se fija el músculo masetero.',
    ],
  },
  Maxilla: {
    nombre: 'Maxilar', latin: 'Maxilla', tipo: 'Hueso irregular',
    etimologia: 'Del latín maxilla, «mandíbula» o «quijada».',
    descripcion: 'Par de huesos que se fusionan para formar la mandíbula superior. Sostienen los dientes superiores y forman parte del techo de la boca, de la pared de la órbita y del suelo y la pared lateral de la cavidad nasal.',
    datos: [
      'Contiene el seno maxilar, el más grande de los senos paranasales.',
      'Su apófisis alveolar sostiene los dientes superiores (la arcada maxilar).',
      'Los dos maxilares se unen en la línea media, en la sutura intermaxilar.',
    ],
  },
  Palatine_Bone: {
    nombre: 'Hueso palatino', latin: 'Os palatinum', tipo: 'Hueso irregular',
    etimologia: 'Del latín palatum, «paladar».',
    descripcion: 'Par de huesos con forma de L situados en la parte posterior de la cavidad nasal, entre el maxilar y el esfenoides. Forman la parte posterior del paladar duro y parte de la cavidad nasal y del suelo de la órbita.',
    datos: [
      'Sus láminas horizontales forman la parte posterior del paladar duro y separan la boca de la cavidad nasal.',
      'Por los agujeros palatinos mayor y menor pasan nervios y vasos hacia el paladar.',
    ],
  },
  Inferior_Nasal_Concha: {
    nombre: 'Cornete nasal inferior', latin: 'Concha nasalis inferior', tipo: 'Hueso plano',
    etimologia: 'Del latín concha, «concha» (de molusco).',
    descripcion: 'Lámina de hueso esponjoso, enrollada como un pergamino, que se extiende a lo largo de la pared lateral de la cavidad nasal. El aire que pasa entre los cornetes se calienta, se humedece y se limpia al rozar su mucosa.',
    datos: [
      'Se considera un hueso propio de la cara; los cornetes superior y medio, en cambio, forman parte del etmoides.',
      'Ayuda a formar el canal del conducto nasolagrimal.',
    ],
  },
  Vomer: {
    nombre: 'Vómer', latin: 'Vomer', tipo: 'Hueso plano',
    etimologia: 'Del latín vomer, «reja del arado», por su forma.',
    descripcion: 'Hueso delgado e impar que forma la parte posterior e inferior del tabique nasal.',
    datos: [
      'Su borde anterior se articula con el cartílago del tabique nasal.',
      'Se articula con seis huesos: el esfenoides, el etmoides, los dos maxilares y los dos palatinos.',
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
    etimologia: 'Del griego hyoeidḗs, «con forma de la letra ípsilon (υ)».',
    descripcion: 'Hueso en forma de herradura situado en la parte anterior del cuello, entre el mentón y el cartílago tiroides. Es el único hueso del cuerpo que no se articula con ningún otro: lo sujetan músculos y ligamentos.',
    datos: [
      'Sirve de anclaje a la lengua y a músculos que intervienen en la deglución y el habla.',
      'Su fractura puede indicar estrangulamiento, por lo que es relevante en medicina forense.',
    ],
  },

  // ── Huesecillos del oído ──────────────────────────────────────
  Malleus: {
    nombre: 'Martillo', latin: 'Malleus', tipo: 'Huesecillo del oído',
    etimologia: 'Del latín malleus, «martillo» o «mazo».',
    descripcion: 'El primero de los tres huesecillos del oído medio. Está unido a la membrana del tímpano y transmite sus vibraciones al yunque.',
    datos: [
      'Los huesecillos del oído están entre los huesos más pequeños del cuerpo.',
      'El tendón del músculo tensor del tímpano se fija en su mango.',
    ],
  },
  Incus: {
    nombre: 'Yunque', latin: 'Incus', tipo: 'Huesecillo del oído',
    etimologia: 'Del latín incus, «yunque».',
    descripcion: 'Huesecillo intermedio del oído medio. Recibe las vibraciones del martillo y las transmite al estribo.',
    datos: [
      'Se articula con el martillo (articulación incudomaleolar) y con el estribo (articulación incudoestapedial).',
    ],
  },
  Stapes: {
    nombre: 'Estribo', latin: 'Stapes', tipo: 'Huesecillo del oído',
    etimologia: 'Del latín medieval stapes, «estribo», por su forma.',
    descripcion: 'Es el hueso más pequeño del cuerpo humano: mide unos 2 a 3 mm. Su base se apoya en la ventana oval, unida a ella por el ligamento anular, y transmite las vibraciones del sonido al oído interno.',
    datos: [
      'El músculo estapedio, el músculo esquelético más pequeño del cuerpo, amortigua sus vibraciones tirando de su cuello.',
      'En la otosclerosis el estribo se fija a la ventana oval y conduce peor el sonido: es una causa de hipoacusia de conducción.',
    ],
  },

  // ── Dientes ───────────────────────────────────────────────────
  Medial_Incisor: {
    nombre: 'Incisivo central', latin: 'Dens incisivus medialis', tipo: 'Diente permanente',
    etimologia: 'Del latín incidere, «cortar».',
    descripcion: 'Diente de la parte delantera de la boca. Como todos los incisivos, corta los alimentos al masticar.',
    datos: [
      'El incisivo central superior casi siempre tiene un solo conducto radicular.',
      'Después de los primeros molares, los incisivos son los primeros dientes permanentes en salir; el central superior lo hace hacia los 7–8 años.',
    ],
  },
  Lateral_Incisor: {
    nombre: 'Incisivo lateral', latin: 'Dens incisivus lateralis', tipo: 'Diente permanente',
    etimologia: 'Del latín incidere, «cortar».',
    descripcion: 'Diente cortante situado junto al incisivo central. Se parece a este, pero es más pequeño en todas sus dimensiones salvo la longitud de la raíz.',
    datos: [
      'Los incisivos laterales pueden faltar de forma congénita.',
    ],
  },
  Canine: {
    nombre: 'Canino', latin: 'Dens caninus', tipo: 'Diente permanente',
    etimologia: 'Del latín canis, «perro»: estos dientes son especialmente prominentes en los perros.',
    descripcion: 'Diente largo y puntiagudo, situado por fuera de cada incisivo lateral. Sirve sobre todo para sujetar y desgarrar los alimentos.',
    datos: [
      'El canino superior tiene la raíz más larga de todos los dientes.',
      'También se le llama colmillo.',
    ],
  },
  First_Premolar: {
    nombre: 'Primer premolar', latin: 'Dens premolaris', tipo: 'Diente permanente',
    etimologia: 'Del latín dens praemolaris, «diente que va delante de los molares»; molar viene de mola, «piedra de molino».',
    descripcion: 'Diente de transición, con dos cúspides bien definidas, que ayuda a los caninos a sujetar y desgarrar los alimentos y a los molares a triturarlos.',
    datos: [
      'Los premolares solo existen en la dentición permanente: ocupan el lugar de los molares de leche.',
      'El primer premolar superior suele tener dos raíces.',
    ],
  },
  Second_Premolar: {
    nombre: 'Segundo premolar', latin: 'Dens premolaris', tipo: 'Diente permanente',
    etimologia: 'Del latín dens praemolaris, «diente que va delante de los molares»; molar viene de mola, «piedra de molino».',
    descripcion: 'Diente de transición situado entre el primer premolar y el primer molar.',
    datos: [
      'Los premolares solo existen en la dentición permanente: ocupan el lugar de los molares de leche.',
      'Los premolares inferiores y el segundo premolar superior suelen tener una sola raíz.',
    ],
  },
  First_Molar: {
    nombre: 'Primer molar', latin: 'Dens molaris', tipo: 'Diente permanente',
    etimologia: 'Del latín mola, «piedra de molino».',
    descripcion: 'Diente grande y plano, con cuatro o cinco cúspides, que muele los alimentos al masticar.',
    datos: [
      'Suele ser el primer diente permanente en salir, hacia los 6–7 años, y no sustituye a ningún diente de leche.',
      'El primer molar superior suele tener tres raíces y el inferior, dos.',
    ],
  },
  Second_Molar: {
    nombre: 'Segundo molar', latin: 'Dens molaris', tipo: 'Diente permanente',
    etimologia: 'Del latín mola, «piedra de molino».',
    descripcion: 'Diente posterior con varias cúspides que muele los alimentos.',
    datos: [
      'Detrás de él puede aparecer el tercer molar o «muela del juicio», que este modelo no incluye.',
    ],
  },

  // ── Columna vertebral ─────────────────────────────────────────
  Atlas: {
    nombre: 'Atlas (C1)', latin: 'Atlas', tipo: 'Vértebra cervical',
    etimologia: 'Por el titán Atlas de la mitología griega, condenado a sostener la bóveda celeste: esta vértebra sostiene el cráneo.',
    descripcion: 'Primera vértebra cervical. Tiene forma de anillo, no tiene cuerpo vertebral y sostiene la cabeza.',
    datos: [
      'Con el occipital forma la articulación atlantooccipital, que permite el movimiento de «sí».',
      'Gira alrededor del diente del axis, lo que permite el movimiento de «no».',
    ],
  },
  Axis: {
    nombre: 'Axis (C2)', latin: 'Axis', tipo: 'Vértebra cervical',
    etimologia: 'Del latín axis, «eje».',
    descripcion: 'Segunda vértebra cervical. Tiene una prolongación vertical, el diente o apófisis odontoides, que actúa como eje de rotación de la cabeza.',
    datos: [
      'La articulación atlantoaxial aporta entre el 40 y el 70 % de la rotación de la cabeza.',
      'Las fracturas del diente del axis se clasifican en tres tipos.',
    ],
  },
  Cervical_Vertebra: {
    nombre: 'Vértebra cervical', latin: 'Vertebra cervicalis', tipo: 'Hueso irregular',
    etimologia: 'Vértebra, del latín vertebra, de vertere, «girar»; cervical, del latín cervix, «cuello».',
    descripcion: 'Las siete vértebras cervicales (C1–C7) son las vértebras más pequeñas, y la columna cervical es relativamente móvil.',
    datos: [
      'En las seis superiores, el agujero de las apófisis transversas da paso a la arteria y la vena vertebrales.',
      'De C3 a C6 la apófisis espinosa es corta y bífida (dividida en dos).',
    ],
  },
  Thoracic_Vertebra: {
    nombre: 'Vértebra torácica', latin: 'Vertebra thoracica', tipo: 'Hueso irregular',
    etimologia: 'Del griego thōrax, «coraza» o «pecho».',
    descripcion: 'Las doce vértebras torácicas (T1–T12) forman el segmento medio de la columna y se articulan con las costillas.',
    datos: [
      'Tienen carillas articulares para las cabezas y para los tubérculos de las costillas.',
      'Sus apófisis espinosas son largas y se dirigen oblicuamente hacia abajo; sus láminas se solapan como las tejas de un tejado.',
    ],
  },
  Lumbar_Vertebra: {
    nombre: 'Vértebra lumbar', latin: 'Vertebra lumbalis', tipo: 'Hueso irregular',
    etimologia: 'Del latín lumbus, «lomo».',
    descripcion: 'Las cinco vértebras lumbares (L1–L5), entre la caja torácica y la pelvis, son las más grandes de la columna y ayudan a soportar el peso del cuerpo.',
    datos: [
      'Sus cuerpos tienen forma de riñón: más anchos de lado a lado que de delante atrás.',
      'Entre ellas predominan la flexión y la extensión del tronco (de 12 a 17° por segmento), mucho más que la inclinación lateral o la rotación.',
      'La mayoría de las hernias de disco se producen en la columna lumbar: el 95 %, entre L4–L5 o L5–S1.',
    ],
  },
  Sacrum: {
    nombre: 'Sacro', latin: 'Os sacrum', tipo: 'Hueso irregular',
    etimologia: 'Del latín tardío os sacrum, «hueso sagrado», traducción del griego hieron osteon que usaba Galeno. El origen del nombre no está claro: se ha supuesto que era la parte del animal que se ofrecía en los sacrificios.',
    descripcion: 'Hueso triangular en la base de la columna, formado por la fusión de las cinco vértebras sacras (S1–S5). Está en la parte posterior y superior de la cavidad pélvica, entre las dos alas de la pelvis.',
    datos: [
      'Sus alas se articulan con los iliones en las articulaciones sacroilíacas.',
      'Las vértebras sacras se fusionan entre los 18 y los 30 años.',
      'Por sus agujeros sacros salen las ramas de los nervios sacros.',
    ],
  },
  Coccyx: {
    nombre: 'Cóccix', latin: 'Os coccygis', tipo: 'Hueso irregular',
    etimologia: 'Del griego kokkyx, «cuco», por su parecido con el pico de esta ave.',
    descripcion: 'Último tramo de la columna, formado por tres a cinco vértebras coccígeas, separadas o fusionadas, por debajo del sacro. Es el resto de una cola vestigial.',
    datos: [
      'En su cara anterior se fijan el elevador del ano y el coccígeo; en la posterior, el glúteo mayor.',
    ],
  },

  // ── Tórax ─────────────────────────────────────────────────────
  Rib: {
    nombre: 'Costilla', latin: 'Costa', tipo: 'Hueso plano',
    etimologia: 'Del latín costa, «costilla».',
    descripcion: 'Las costillas son doce pares de huesos curvos que forman la caja torácica. Protegen el corazón y los pulmones y se mueven al respirar.',
    datos: [
      'Todas se articulan por detrás con las vértebras torácicas.',
      'Entre cada dos costillas, la vena, la arteria y el nervio intercostales van siempre en ese orden, de arriba abajo.',
    ],
  },
  Costal_Cartilage: {
    nombre: 'Cartílago costal', latin: 'Cartilago costalis', tipo: 'Cartílago hialino',
    etimologia: 'Del latín cartilago, «cartílago, ternilla»; costal, de costa, «costilla».',
    descripcion: 'Barras de cartílago hialino que prolongan las costillas hacia delante y dan elasticidad a las paredes del tórax.',
    datos: [
      'Los siete primeros pares se unen al esternón; los tres siguientes, al borde inferior del cartílago de la costilla de arriba.',
      'Con la edad tienden a osificarse en la superficie, sobre todo en mujeres de 50 años o más.',
    ],
  },
  Sternum_Manubrium: {
    nombre: 'Manubrio del esternón', latin: 'Manubrium sterni', tipo: 'Hueso plano',
    etimologia: 'Del latín manubrium, «mango».',
    descripcion: 'Parte superior y más ancha del esternón. Se une al cuerpo del esternón, a las clavículas y a los cartílagos de las primeras costillas.',
    datos: [
      'La escotadura yugular, en el centro de su borde superior, se palpa entre las dos clavículas.',
      'Se une al cuerpo del esternón formando el ángulo esternal (de Louis), donde se articula la 2.ª costilla: es la referencia para contar costillas.',
    ],
  },
  Sternum_Body: {
    nombre: 'Cuerpo del esternón', latin: 'Corpus sterni', tipo: 'Hueso plano',
    etimologia: 'Esternón, del griego sternon, «pecho».',
    descripcion: 'La parte más larga del esternón (también llamada gladiolo). Se articula con los cartílagos de las costillas 2.ª a 7.ª.',
    datos: [
      'En la reanimación cardiopulmonar las compresiones se hacen sobre la mitad inferior del esternón.',
      'Contiene médula ósea, por lo que a veces se usa para hacer biopsias de médula.',
    ],
  },
  Sternum_Xiphoid_Process: {
    nombre: 'Apófisis xifoides', latin: 'Processus xiphoideus', tipo: 'Parte del esternón',
    etimologia: 'Del griego xiphos, «espada»: xiphoeidḗs significa «con forma de espada».',
    descripcion: 'Pequeña prolongación del extremo inferior del esternón. Es cartilaginosa y suele osificarse en el adulto, hacia los 40 años.',
    datos: [
      'En ella se insertan fibras del diafragma y del músculo recto del abdomen.',
      'En las compresiones de la RCP puede fracturarse o desplazarse y llegar a dañar el diafragma.',
    ],
  },

  // ── Cintura escapular y miembro superior ──────────────────────
  Clavicle: {
    nombre: 'Clavícula', latin: 'Clavicula', tipo: 'Hueso largo',
    etimologia: 'Del latín clavicula, «llavecita», porque el hueso gira sobre su eje como una llave al separar el brazo del cuerpo.',
    descripcion: 'Hueso largo y delgado en forma de S, de unos 15 cm, que une el brazo con el tronco. Actúa como un puntal entre la escápula y el esternón y mantiene el miembro superior separado del tórax.',
    datos: [
      'Es el único hueso largo del cuerpo dispuesto horizontalmente.',
      'Se articula con el esternón (articulación esternoclavicular) y con el acromion de la escápula (articulación acromioclavicular).',
      'Es el hueso que más se fractura; el 80 % de sus fracturas son en el tercio medio.',
    ],
  },
  Scapula: {
    nombre: 'Escápula (omóplato)', latin: 'Scapula', tipo: 'Hueso plano',
    etimologia: 'Del latín scapula, nombre que se relaciona con una paleta o pala pequeña, a la que se parece. Omóplato viene del griego ōmoplátē, de ōmos, «hombro», y plátē, «algo plano o ancho».',
    descripcion: 'Hueso plano y aproximadamente triangular, situado en la parte posterolateral de la caja torácica.',
    datos: [
      'Su cavidad glenoidea se articula con la cabeza del húmero: es la articulación del hombro (glenohumeral).',
      'En ella se fijan muchos músculos, entre ellos los del manguito rotador: subescapular, supraespinoso, infraespinoso y redondo menor.',
      'El acromion forma el punto más alto del hombro.',
    ],
  },
  Humerus: {
    nombre: 'Húmero', latin: 'Humerus', tipo: 'Hueso largo',
    etimologia: 'Del latín umerus (después humerus), «parte superior del brazo, hombro».',
    descripcion: 'Hueso largo del brazo, entre el hombro y el codo.',
    datos: [
      'Su cabeza se articula con la cavidad glenoidea de la escápula: es la articulación del hombro.',
      'El nervio radial cruza la mitad de su diáfisis, de atrás adelante, por el surco del nervio radial; una fractura en esa zona puede lesionarlo.',
      'El nervio cubital pasa detrás del epicóndilo medial, donde se palpa: es el «hueso de la risa».',
    ],
  },
  Radius: {
    nombre: 'Radio', latin: 'Radius', tipo: 'Hueso largo',
    etimologia: 'Del latín radius, «rayo».',
    descripcion: 'Hueso lateral del antebrazo: va del lado lateral del codo al lado del pulgar de la muñeca, paralelo a la ulna. Gira alrededor de ella en los movimientos de supinación y pronación.',
    datos: [
      'Su extremo distal se articula con los huesos del carpo (escafoides y semilunar) y con la ulna.',
      'Las fracturas de su extremo distal son frecuentes, sobre todo por caídas sobre la mano extendida; en la de Colles, la muñeca y la mano se desplazan hacia atrás.',
    ],
  },
  Ulna: {
    nombre: 'Ulna (cúbito)', latin: 'Ulna', tipo: 'Hueso largo',
    etimologia: 'Del latín ulna, «codo». El nombre tradicional, cúbito, viene de cubitus, que también designa el codo.',
    descripcion: 'Hueso del antebrazo del lado del meñique, paralelo al radio. En el codo se articula con la tróclea del húmero en una articulación en bisagra.',
    datos: [
      'Su olécranon, en la parte superior y posterior del hueso, es subcutáneo y está cubierto por una bolsa sinovial.',
      'Cerca del codo forma con el radio una articulación en pivote que permite al radio cruzarse sobre ella en la pronación.',
    ],
  },
  Scaphoid: {
    nombre: 'Escafoides', latin: 'Os scaphoideum', tipo: 'Hueso corto · carpo',
    etimologia: 'Del griego skaphos, «barca», y eidos, «tipo».',
    descripcion: 'El más grande de la fila proximal del carpo, del lado del pulgar. Une las dos filas de huesos de la muñeca.',
    datos: [
      'Es el hueso del carpo que más se fractura.',
      'Su sangre entra por el extremo distal y llega al proximal; por eso, tras una fractura, el fragmento proximal puede quedar sin riego (necrosis avascular).',
      'Se palpa en el fondo de la «tabaquera anatómica».',
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
    descripcion: 'Pequeño hueso sesamoideo de la muñeca, situado dentro del tendón del músculo flexor cubital del carpo.',
    datos: [
      'Forma el «talón» de la mano, del lado del meñique.',
    ],
  },
  Trapezium: {
    nombre: 'Trapecio', latin: 'Os trapezium', tipo: 'Hueso corto · carpo',
    etimologia: 'Del griego trapezion, «mesita».',
    descripcion: 'Hueso de la fila distal del carpo, junto al metacarpiano del pulgar.',
    datos: [
      'Su articulación en silla de montar con el primer metacarpiano contribuye a la oposición del pulgar.',
      'Esa articulación es propensa a la artritis por sobreuso.',
    ],
  },
  Trapezoid: {
    nombre: 'Trapezoide', latin: 'Os trapezoideum', tipo: 'Hueso corto · carpo',
    etimologia: 'Del griego trapezion, «mesita», y eidos, «forma».',
    descripcion: 'El hueso más pequeño de la fila distal del carpo, entre el trapecio y el grande. Se articula con el segundo metacarpiano.',
    datos: ['Es el hueso del carpo que menos se fractura.'],
  },
  Capitate: {
    nombre: 'Grande', latin: 'Os capitatum', tipo: 'Hueso corto · carpo',
    etimologia: 'Del latín capitatus, «que tiene cabeza» (de caput, capitis, «cabeza»).',
    descripcion: 'El hueso más grande del carpo, situado en el centro de la muñeca.',
    datos: [
      'Empieza a osificarse hacia el tercer mes de vida.',
      'Se articula con el tercer metacarpiano.',
    ],
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
    etimologia: 'Del griego meta, «más allá», y karpos, «muñeca».',
    descripcion: 'Los cinco metacarpianos forman el esqueleto de la palma. Cada uno se articula con el carpo y con la falange proximal de un dedo.',
    datos: [
      'La fractura del cuello del V metacarpiano se conoce como «fractura del boxeador».',
    ],
  },
  Proximal_Phalanx: {
    nombre: 'Falange proximal', latin: 'Phalanx proximalis', tipo: 'Hueso largo',
    etimologia: 'Del griego phalanx, la formación del ejército griego en la que los soldados forman en filas, como los dedos.',
    descripcion: 'Primera falange de cada dedo. Se une al metacarpiano o al metatarsiano en la articulación metacarpofalángica o metatarsofalángica.',
    datos: ['La mano y el pie tienen 14 falanges cada uno: tres por dedo y dos en el pulgar o el dedo gordo.'],
  },
  Middle_Phalanx: {
    nombre: 'Falange media', latin: 'Phalanx media', tipo: 'Hueso largo',
    etimologia: 'Del griego phalanx, la formación del ejército griego en la que los soldados forman en filas, como los dedos.',
    descripcion: 'Falange intermedia de los dedos segundo a quinto. El pulgar y el dedo gordo del pie no la tienen.',
    datos: ['La mano y el pie tienen 14 falanges cada uno: tres por dedo y dos en el pulgar o el dedo gordo.'],
  },
  Distal_Phalanx: {
    nombre: 'Falange distal', latin: 'Phalanx distalis', tipo: 'Hueso largo',
    etimologia: 'Del griego phalanx, la formación del ejército griego en la que los soldados forman en filas, como los dedos.',
    descripcion: 'Última falange de cada dedo. Su extremo ensanchado (tuberosidad) sostiene el pulpejo y la uña.',
    datos: ['La mano y el pie tienen 14 falanges cada uno: tres por dedo y dos en el pulgar o el dedo gordo.'],
  },

  // ── Cintura pélvica y miembro inferior ────────────────────────
  Hip_Bone: {
    nombre: 'Coxal (hueso de la cadera)', latin: 'Os coxae', tipo: 'Hueso irregular',
    etimologia: 'Del latín coxa, «cadera». También se le llama hueso innominado.',
    descripcion: 'Hueso grande y plano que, con el sacro y el cóccix, forma el esqueleto de la pelvis. Está formado por tres huesos: ilion, isquion y pubis.',
    datos: [
      'Los tres huesos se unen en el acetábulo mediante un cartílago en forma de Y; se fusionan al final de la pubertad y terminan de osificarse hacia los 25 años.',
      'Se une al fémur en la articulación de la cadera, de tipo esfera y cavidad.',
      'La pelvis femenina es más ancha que la masculina, para el parto, y su estrecho superior es más grande y ovalado.',
    ],
  },
  Femur: {
    nombre: 'Fémur', latin: 'Femur', tipo: 'Hueso largo',
    etimologia: 'Del latín femur, «muslo».',
    descripcion: 'Es el único hueso del muslo y el más largo del cuerpo; según algunas medidas, también el más fuerte. Va de la cadera a la rodilla.',
    datos: [
      'Su longitud equivale, de media, al 26,7 % de la estatura: algo más de una cuarta parte.',
      'La fractura de cadera suele ser una fractura del cuello del fémur; es más frecuente con la edad, y la osteoporosis es uno de sus factores de riesgo.',
      'El trocánter mayor, la prominencia más lateral del fémur, se palpa con facilidad.',
    ],
  },
  Patella: {
    nombre: 'Rótula', latin: 'Patella', tipo: 'Hueso sesamoideo',
    etimologia: 'Del latín rotula, «ruedecita» (de rota, «rueda»). Su nombre latino, patella, viene de patina, «plato poco hondo».',
    descripcion: 'Hueso plano, redondeado y triangular situado delante de la rodilla. Es el hueso sesamoideo más grande del cuerpo.',
    datos: [
      'Aumenta la palanca del cuádriceps para extender la rodilla.',
      'Protege la parte anterior de la articulación de la rodilla.',
    ],
  },
  Tibia: {
    nombre: 'Tibia', latin: 'Tibia', tipo: 'Hueso largo',
    etimologia: 'Del latín tibia, «flauta»: las primeras flautas se hacían con tibias.',
    descripcion: 'El mayor y más fuerte de los dos huesos de la pierna, en su lado medial. Une la rodilla con el tobillo.',
    datos: [
      'Buena parte de su cara medial está justo debajo de la piel.',
      'Su extremo distal forma el maléolo medial del tobillo.',
      'Es el hueso largo que más se fractura y, como un tercio de ella está bajo la piel, sus fracturas abiertas son más frecuentes que en otros huesos largos.',
    ],
  },
  Fibula: {
    nombre: 'Fíbula (peroné)', latin: 'Fibula', tipo: 'Hueso largo',
    etimologia: 'Del latín fibula, «broche» o «hebilla». El adjetivo peroneo viene del griego peronē, también «broche».',
    descripcion: 'Hueso largo y delgado situado en el lado lateral de la pierna. Soporta poco peso, pero estabiliza el tobillo y sirve de anclaje a músculos.',
    datos: [
      'Su extremo inferior forma la parte lateral del tobillo (el maléolo lateral).',
      'El nervio fibular (peroneo) común rodea su cuello.',
      'Como puede quitarse buena parte de ella sin impedir la marcha, se usa como fuente de hueso en cirugía reconstructiva, por ejemplo para rehacer la mandíbula.',
    ],
  },
  Talus: {
    nombre: 'Talus (astrágalo)', latin: 'Talus', tipo: 'Hueso corto · tarso',
    etimologia: 'Del latín talus, «tobillo». Astrágalo viene del griego astragalos, «tobillo»; con tabas de animales se hacían los primeros dados.',
    descripcion: 'Hueso del tobillo que une la pierna con el pie y transmite todo el peso del cuerpo de la pierna al pie.',
    datos: ['No tiene inserciones musculares.', 'Gran parte de su superficie está cubierta de cartílago articular.'],
  },
  Calcaneus: {
    nombre: 'Calcáneo', latin: 'Calcaneus', tipo: 'Hueso corto · tarso',
    etimologia: 'Del latín calx, calcis, «talón».',
    descripcion: 'Es el hueso más grande del tarso y del pie, y forma el talón.',
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
      'En su tuberosidad se inserta el músculo tibial posterior, el único músculo que se fija en él.',
      'Es la «clave» del pie: forma parte de los arcos longitudinal y transverso.',
    ],
  },
  Cuboid: {
    nombre: 'Cuboides', latin: 'Os cuboideum', tipo: 'Hueso corto · tarso',
    etimologia: 'Del griego kybos, «cubo».',
    descripcion: 'El más lateral de los huesos de la fila distal del tarso; por detrás se articula con el calcáneo.',
    datos: ['Se articula con los metatarsianos IV y V.', 'Tiene un surco por donde pasa el tendón del músculo fibular (peroneo) largo.'],
  },
  Medial_Cuneiform: {
    nombre: 'Cuneiforme medial', latin: 'Os cuneiforme mediale', tipo: 'Hueso corto · tarso',
    etimologia: 'Del latín cuneus, «cuña»: cuneiforme significa «en forma de cuña».',
    descripcion: 'El más grande de los tres cuneiformes. Se articula con el navicular, con el cuneiforme intermedio y con los metatarsianos I y II.',
    datos: [],
  },
  Intermediate_Cuneiform: {
    nombre: 'Cuneiforme intermedio', latin: 'Os cuneiforme intermedium', tipo: 'Hueso corto · tarso',
    etimologia: 'Del latín cuneus, «cuña»: cuneiforme significa «en forma de cuña».',
    descripcion: 'Cuneiforme situado entre los otros dos. Se articula con el navicular por detrás, con el segundo metatarsiano por delante y con los otros cuneiformes a los lados.',
    datos: [],
  },
  Lateral_Cuneiform: {
    nombre: 'Cuneiforme lateral', latin: 'Os cuneiforme laterale', tipo: 'Hueso corto · tarso',
    etimologia: 'Del latín cuneus, «cuña»: cuneiforme significa «en forma de cuña».',
    descripcion: 'Cuneiforme situado entre el intermedio y el cuboides. Se articula con el navicular por detrás y con el tercer metatarsiano por delante.',
    datos: [],
  },
  Metatarsal: {
    nombre: 'Metatarsiano', latin: 'Os metatarsi', tipo: 'Hueso largo · pie',
    etimologia: 'Del griego tarsos, «planta del pie», con el prefijo meta-, «más allá».',
    descripcion: 'Los cinco metatarsianos son huesos largos de la parte media del pie. Se numeran desde el lado del dedo gordo, del I al V.',
    datos: [
      'De más largo a más corto: segundo, tercero, cuarto, quinto y primero.',
      'La fractura de Jones afecta al V metatarsiano, entre su base y su parte media; suele producirse con los dedos en punta y el pie doblado hacia dentro.',
      'Las fracturas por estrés («fractura de marcha») afectan sobre todo al II y al III.',
    ],
  },
  Sesamoid_Bones_Foot: {
    nombre: 'Huesos sesamoideos del pie', latin: 'Ossa sesamoidea pedis', tipo: 'Huesos sesamoideos',
    etimologia: 'Del griego, por la semilla de sésamo, a la que se parecen por su pequeño tamaño.',
    descripcion: 'Pequeños huesos incluidos en un tendón o en un músculo; en el pie, los principales son dos, en la articulación del dedo gordo. Actúan como poleas: los tendones se deslizan sobre ellos y transmiten mejor la fuerza.',
    datos: [
      'Al caminar soportan una presión añadida, por lo que sus lesiones cuestan de curar.',
      'Su inflamación (sesamoiditis) es frecuente en bailarines.',
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
  // Zonas de la piel (tools/skin_regions.py): la piel se exporta dividida para poder seleccionar cada zona.
  Skin_Scalp: {
    nombre: 'Cuero cabelludo', latin: 'Calva', tipo: 'Zona de la piel',
    descripcion: 'Piel de la cabeza donde crece el pelo, con numerosos folículos pilosos y glándulas sebáceas. Se describe con cinco capas: piel, tejido conjuntivo denso, aponeurosis epicraneal, tejido areolar laxo y pericráneo.',
    datos: ['En inglés, las iniciales de sus capas forman la palabra SCALP («cuero cabelludo»).', 'Sus vasos corren en el tejido conjuntivo denso, que los mantiene abiertos: por eso sus heridas sangran mucho.'],
  },
  Skin_Face: {
    nombre: 'Piel de la cara', latin: 'Facies', tipo: 'Zona de la piel',
    descripcion: 'Piel de la cara, en la que se insertan los músculos de la expresión facial, que la mueven.',
    datos: ['Su sensibilidad la recoge el nervio trigémino, en tres territorios (oftálmico, maxilar y mandibular); sus músculos los mueve el nervio facial.'],
  },
  Skin_Eyelids: {
    nombre: 'Párpados', latin: 'Palpebrae', tipo: 'Zona de la piel',
    descripcion: 'Pliegues finos de piel que cubren y protegen el ojo. De fuera adentro tienen piel, tejido subcutáneo, el músculo orbicular del ojo, el septo orbitario con los tarsos y la conjuntiva.',
    datos: ['Su piel es relativamente fina y tiene más células pigmentadas que la de otras zonas.', 'Las glándulas tarsales (de Meibomio) segregan la capa de grasa de la lágrima.', 'El parpadeo reflejo protege el ojo de los cuerpos extraños.'],
  },
  Skin_Nose: {
    nombre: 'Nariz', latin: 'Nasus externus', tipo: 'Zona de la piel',
    descripcion: 'Parte externa de la nariz: huesos y cartílagos cubiertos de piel. La piel de la punta es gruesa y tiene muchas glándulas sebáceas grandes.',
    datos: ['El vestíbulo, la entrada de cada fosa nasal, está tapizado de piel con pelos y glándulas sebáceas.'],
  },
  Skin_Lips: {
    nombre: 'Labios', latin: 'Labia oris', tipo: 'Zona de la piel',
    descripcion: 'Pliegues que rodean la boca, con el músculo orbicular de la boca dentro. En su zona roja (bermellón), la piel tiene solo de tres a cinco capas de células, frente a las hasta dieciséis de la cara: por eso se transparentan los vasos y se ve roja.',
    datos: ['La parte roja del labio (bermellón) no tiene pelo ni glándulas sudoríparas.', 'El borde del labio superior forma el «arco de Cupido».'],
  },
  Skin_Ear: {
    nombre: 'Oreja', latin: 'Auricula', tipo: 'Zona de la piel',
    descripcion: 'Pabellón auricular: cartílago elástico cubierto de una piel muy fina, casi sin grasa debajo y muy unida al pericondrio. El lóbulo no tiene cartílago.',
    datos: ['Un golpe puede despegar la piel del cartílago y acumular sangre entre ambos: si no se drena, el cartílago se daña y queda la «oreja en coliflor».', 'Por estar expuesta, sufre a menudo congelaciones y quemaduras de sol.'],
  },
  Skin_Neck: {
    nombre: 'Piel del cuello', latin: 'Collum', tipo: 'Zona de la piel',
    descripcion: 'Piel fina y móvil del cuello; por delante, bajo ella, está el músculo platisma.',
    datos: ['A través de ella suele verse la vena yugular externa, en la línea que va del ángulo de la mandíbula a la mitad de la clavícula.'],
  },
  Skin_Chest: {
    nombre: 'Piel del tórax', latin: 'Thorax', tipo: 'Zona de la piel',
    descripcion: 'Piel de la parte anterior y lateral del tórax. Su sensibilidad la recogen los nervios intercostales, cada uno en una franja (dermatoma).',
    datos: ['El dermatoma T4 llega a la altura de los pezones.'],
  },
  Skin_Breast: {
    nombre: 'Mama', latin: 'Mamma', tipo: 'Zona de la piel',
    descripcion: 'Relieve del pecho formado por la glándula mamaria, grasa y tejido conjuntivo, cubiertos de piel. En el centro están el pezón y la areola.',
    datos: ['Los ligamentos suspensorios (de Cooper) van de la fascia a la piel y sostienen la mama.', 'La areola tiene glándulas sebáceas, las glándulas de Montgomery, que lubrican el pezón y la areola.', 'Una piel con aspecto de «piel de naranja» puede ser signo de un cáncer de mama inflamatorio y obliga a consultar.'],
  },
  Skin_Abdomen: {
    nombre: 'Piel del abdomen', latin: 'Abdomen', tipo: 'Zona de la piel',
    descripcion: 'Piel de la pared anterior y lateral del abdomen, con el ombligo en el centro.',
    datos: ['El ombligo está en el dermatoma T10.', 'Si la piel se estira deprisa (embarazo, aumento de peso) pueden aparecer estrías.'],
  },
  Skin_Back: {
    nombre: 'Piel de la espalda', latin: 'Dorsum thoracis', tipo: 'Zona de la piel',
    descripcion: 'Piel de la parte posterior del tórax, sobre las escápulas y la columna torácica. Es más gruesa y tiene menos terminaciones nerviosas que la del resto del tronco.',
    datos: ['Su sensibilidad la recogen los ramos posteriores de los nervios espinales.', 'En personas encamadas pueden aparecer úlceras por presión sobre la parte posterior de los hombros.'],
  },
  Skin_Lumbar: {
    nombre: 'Piel de la región lumbar', latin: 'Regio lumbalis', tipo: 'Zona de la piel',
    descripcion: 'Piel de la parte baja de la espalda, entre las últimas costillas y las crestas ilíacas.',
    datos: ['La punción lumbar se hace en esta zona, entre las vértebras L3 y L4 o L4 y L5, por debajo del final de la médula espinal (L1).'],
  },
  Skin_Buttock: {
    nombre: 'Piel de la región glútea', latin: 'Regio glutea', tipo: 'Zona de la piel',
    descripcion: 'Piel de la nalga, sobre una capa gruesa de grasa subcutánea y los músculos glúteos.',
    datos: ['Sobre el sacro, el cóccix y las caderas aparecen con más frecuencia las úlceras por presión de las personas encamadas.', 'Las inyecciones intramusculares se ponen en el cuadrante superior externo, lejos del nervio ciático.'],
  },
  Skin_Perineum: {
    nombre: 'Piel del periné', latin: 'Perineum', tipo: 'Zona de la piel',
    descripcion: 'Piel de la región entre los muslos, de los genitales al ano. En la línea media tiene un rafe.',
    datos: [],
  },
  Skin_Shoulder: {
    nombre: 'Piel del hombro', latin: 'Regio deltoidea', tipo: 'Zona de la piel',
    descripcion: 'Piel que cubre el relieve redondeado del hombro, sobre el músculo deltoides.',
    datos: ['La sensibilidad de su parte inferior la recoge el nervio axilar: si se lesiona, esa zona se queda dormida.'],
  },
  Skin_Axilla: {
    nombre: 'Piel de la axila', latin: 'Regio axillaris', tipo: 'Zona de la piel',
    descripcion: 'Piel del hueco entre el brazo y el tórax: blanda, con mucho pelo y muchas glándulas sudoríparas.',
    datos: ['El olor corporal se produce sobre todo en la axila.', 'Bajo ella están los nodos linfáticos axilares, que se palpan en la exploración de la mama.'],
  },
  Skin_Arm: {
    nombre: 'Piel del brazo', latin: 'Brachium', tipo: 'Zona de la piel',
    descripcion: 'Piel del brazo, entre el hombro y el codo.',
    datos: [],
  },
  Skin_Elbow: {
    nombre: 'Piel del codo', latin: 'Regio cubitalis', tipo: 'Zona de la piel',
    descripcion: 'Por detrás, sobre el olécranon, la piel es gruesa y holgada para que el codo pueda doblarse; por delante, en la flexura, es fina.',
    datos: ['En la flexura está la vena cubital mediana, que comunica la cefálica con la basílica; es la que más se usa para sacar sangre.', 'Bajo la piel del olécranon hay una bolsa sinovial que se inflama con el apoyo repetido (bursitis olecraniana).'],
  },
  Skin_Forearm: {
    nombre: 'Piel del antebrazo', latin: 'Antebrachium', tipo: 'Zona de la piel',
    descripcion: 'Piel del antebrazo, entre el codo y la muñeca.',
    datos: [],
  },
  Skin_Hand: {
    nombre: 'Piel de la mano', latin: 'Manus', tipo: 'Zona de la piel',
    descripcion: 'La piel de la palma y de la cara palmar de los dedos es gruesa, sin pelo, con muchas glándulas sudoríparas y crestas que forman las huellas dactilares; la del dorso es fina y móvil.',
    datos: ['La piel sin pelo (glabra) de palmas y plantas no tiene glándulas sebáceas y tiene una capa más de epidermis, el estrato lúcido.', 'Las uñas son anexos de la piel.'],
  },
  Skin_Thigh: {
    nombre: 'Piel del muslo', latin: 'Femur', tipo: 'Zona de la piel',
    descripcion: 'Piel del muslo, entre la ingle y la rodilla.',
    datos: [],
  },
  Skin_Knee: {
    nombre: 'Piel de la rodilla', latin: 'Genu', tipo: 'Zona de la piel',
    descripcion: 'Por delante, sobre la rótula, la piel es gruesa y holgada; por detrás, en la fosa poplítea, es fina.',
    datos: ['Bajo la piel de la rótula está la bolsa prerrotuliana, que se inflama en quienes trabajan de rodillas («rodilla de ama de casa»).'],
  },
  Skin_Leg: {
    nombre: 'Piel de la pierna', latin: 'Crus', tipo: 'Zona de la piel',
    descripcion: 'Piel de la pierna, entre la rodilla y el tobillo. Por delante está directamente sobre la tibia, sin músculo entre medias.',
    datos: ['Por eso las heridas de la espinilla llegan enseguida al hueso.', 'Por su cara medial sube la vena safena mayor; su dilatación forma varices.'],
  },
  Skin_Foot: {
    nombre: 'Piel del pie', latin: 'Pes', tipo: 'Zona de la piel',
    descripcion: 'La planta tiene la piel más gruesa del cuerpo, sin pelo ni pigmento y con muchas glándulas sudoríparas, porque soporta el peso; la del dorso es fina.',
    datos: ['El talón es uno de los sitios donde más aparecen úlceras por presión en personas encamadas.'],
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
    etimologia: 'Del latín oculus, «ojo».',
    descripcion: 'Órgano de la visión. Es una esfera de unos 24 mm de diámetro que enfoca la luz sobre la retina, donde se convierte en señales que viajan al cerebro por el nervio óptico.',
    datos: [
      'Tiene tres capas: fibrosa (esclera y córnea), vascular (úvea) y nerviosa (retina).',
      'Lo mueven seis músculos extraoculares.',
      'Se aloja en la órbita, una cavidad ósea del cráneo.',
    ],
  },
};
