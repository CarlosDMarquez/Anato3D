// Fichas escritas de los músculos principales. Clave: nombre inglés de Z-Anatomy con «_» (p. ej.
// Rectus_femoris_muscle) o el grupo que reúne sus partes (Deltoid_muscle). Si un músculo no tiene ficha,
// la app muestra los datos del modelo (región, acción, inervación) y la etimología generada del latín.

const MANGUITO = 'Forma parte del manguito rotador (supraespinoso, infraespinoso, redondo menor y subescapular), que mantiene la cabeza del húmero centrada en la cavidad glenoidea.';
const BICEPS = {
  descripcion: 'Músculo de dos cabezas en la cara anterior del brazo. Además de flexionar el codo, es el supinador más potente del antebrazo (gira la palma hacia arriba).',
  origen: 'Cabeza larga: tubérculo supraglenoideo de la escápula. Cabeza corta: apófisis coracoides.',
  insercion: 'Tuberosidad del radio y, mediante la aponeurosis bicipital, fascia del antebrazo.',
  accion: 'Flexión del codo, supinación del antebrazo y flexión del hombro.',
  datos: ['El tendón de la cabeza larga pasa por dentro de la articulación del hombro.', 'El reflejo bicipital explora los segmentos C5–C6 de la médula.'],
};
const TRICEPS = {
  descripcion: 'Único músculo de la cara posterior del brazo. Sus tres cabezas se unen en un tendón que llega al codo.',
  origen: 'Cabeza larga: tubérculo infraglenoideo de la escápula. Cabeza lateral: cara posterior del húmero, por encima del surco del nervio radial. Cabeza medial: cara posterior, por debajo de ese surco.',
  insercion: 'Olécranon de la ulna.',
  accion: 'Extensión del codo; la cabeza larga también extiende y aduce el hombro.',
  datos: ['El reflejo tricipital explora el segmento C7 de la médula.'],
};
const GASTROCNEMIO = {
  descripcion: 'Músculo superficial de dos cabezas que forma el relieve de la pantorrilla, los popularmente llamados «gemelos».',
  origen: 'Cabeza medial: cara posterior del cóndilo medial del fémur. Cabeza lateral: cóndilo lateral del fémur.',
  insercion: 'Tuberosidad del calcáneo, mediante el tendón calcáneo (de Aquiles).',
  accion: 'Flexión plantar del pie (ponerse de puntillas) y flexión de la rodilla.',
  datos: ['Con el sóleo forma el tríceps sural.'],
};
const BICEPS_FEMORAL = {
  descripcion: 'Isquiotibial lateral, en la parte posterior del muslo.',
  origen: 'Cabeza larga: tuberosidad isquiática. Cabeza corta: labio lateral de la línea áspera del fémur.',
  insercion: 'Cabeza de la fíbula.',
  accion: 'Flexión de la rodilla y rotación lateral de la pierna; la cabeza larga también extiende la cadera.',
  datos: ['Los isquiotibiales (bíceps femoral, semitendinoso y semimembranoso) se lesionan a menudo en los esprints.'],
};
const MASETERO = {
  descripcion: 'Músculo rectangular de la mejilla; en proporción a su tamaño es uno de los más fuertes del cuerpo. Se palpa sobre el ángulo de la mandíbula al apretar los dientes.',
  origen: 'Arco cigomático.', insercion: 'Cara lateral de la rama y del ángulo de la mandíbula.',
  accion: 'Elevación de la mandíbula (cierra la boca).',
  datos: ['Su hipertrofia es frecuente en quienes aprietan o rechinan los dientes (bruxismo).'],
};
const ORBICULAR_OJO = {
  descripcion: 'Músculo circular que rodea el ojo. Su porción palpebral cierra los párpados con suavidad (parpadeo) y su porción orbitaria los cierra con fuerza.',
  accion: 'Cierre de los párpados.',
  datos: ['En la parálisis facial no se puede cerrar el ojo del lado afectado.'],
};
const CUADRICEPS = 'Forma parte del cuádriceps femoral (recto femoral y vastos lateral, medial e intermedio), el gran extensor de la rodilla.';

export const MUSCULOS = {
  // ── Hombro y brazo ──
  Deltoid_muscle: {
    descripcion: 'Músculo triangular que forma el relieve redondeado del hombro. Tiene tres porciones: clavicular (anterior), acromial (media) y espinal (posterior).',
    origen: 'Tercio lateral de la clavícula, acromion y espina de la escápula.',
    insercion: 'Tuberosidad deltoidea del húmero.',
    accion: 'Abducción del brazo (porción acromial); la clavicular flexiona y rota medialmente, y la espinal extiende y rota lateralmente.',
    datos: ['Es un lugar habitual para las inyecciones intramusculares.', 'Una lesión del nervio axilar lo paraliza y el hombro pierde su forma redondeada.'],
  },
  Supraspinatus_muscle: {
    descripcion: 'Músculo de la fosa supraespinosa de la escápula, bajo el trapecio.',
    origen: 'Fosa supraespinosa de la escápula.', insercion: 'Carilla superior del tubérculo mayor del húmero.',
    accion: 'Inicia la abducción del brazo y estabiliza el hombro.',
    datos: [MANGUITO, 'Es el tendón del manguito rotador que más se lesiona.'],
  },
  Infraspinatus_muscle: {
    descripcion: 'Músculo grueso que ocupa la fosa infraespinosa de la escápula.',
    origen: 'Fosa infraespinosa de la escápula.', insercion: 'Carilla media del tubérculo mayor del húmero.',
    accion: 'Rotación lateral del brazo.', datos: [MANGUITO],
  },
  Teres_minor_muscle: {
    descripcion: 'Músculo pequeño y alargado del borde lateral de la escápula.',
    origen: 'Borde lateral de la escápula.', insercion: 'Carilla inferior del tubérculo mayor del húmero.',
    accion: 'Rotación lateral del brazo.', datos: [MANGUITO],
  },
  Subscapularis_muscle: {
    descripcion: 'Músculo ancho que ocupa la cara anterior de la escápula, apoyado sobre las costillas.',
    origen: 'Fosa subescapular.', insercion: 'Tubérculo menor del húmero.',
    accion: 'Rotación medial del brazo.', datos: [MANGUITO],
  },
  Teres_major_muscle: {
    descripcion: 'Músculo grueso que va del ángulo inferior de la escápula al húmero; ayuda al dorsal ancho.',
    origen: 'Cara posterior del ángulo inferior de la escápula.', insercion: 'Cresta del tubérculo menor del húmero.',
    accion: 'Aducción, extensión y rotación medial del brazo.', datos: ['Junto con el dorsal ancho forma el pliegue posterior de la axila.'],
  },
  Long_head_of_biceps_brachii: BICEPS,
  Short_head_of_biceps_brachii: BICEPS,
  Brachialis_muscle: {
    descripcion: 'Músculo ancho situado bajo el bíceps, en la parte inferior de la cara anterior del brazo.',
    origen: 'Mitad distal de la cara anterior del húmero.', insercion: 'Apófisis coronoides y tuberosidad de la ulna.',
    accion: 'Flexión del codo.', datos: ['Es el flexor principal del codo: actúa en cualquier posición del antebrazo.'],
  },
  Coracobrachialis_muscle: {
    descripcion: 'Músculo alargado de la parte superior y medial del brazo.',
    origen: 'Apófisis coracoides de la escápula.', insercion: 'Tercio medio de la cara medial del húmero.',
    accion: 'Flexión y aducción del brazo.', datos: ['Lo atraviesa el nervio musculocutáneo.'],
  },
  Long_head_of_triceps_brachii: TRICEPS,
  Lateral_head_of_triceps_brachii: TRICEPS,
  Medial_head_of_triceps_brachii: TRICEPS,
  Brachioradialis_muscle: {
    descripcion: 'Músculo superficial del borde lateral del antebrazo.',
    origen: 'Cresta supracondílea lateral del húmero.', insercion: 'Apófisis estiloides del radio.',
    accion: 'Flexión del codo, sobre todo con el antebrazo a medio camino entre pronación y supinación.',
    datos: ['Aunque es flexor, lo inerva el nervio radial, que suele inervar extensores.'],
  },

  // ── Tronco superior y espalda ──
  Trapezius_muscle: {
    descripcion: 'Gran músculo plano en forma de trapecio que cubre la nuca y la parte superior de la espalda. Mueve y estabiliza la escápula.',
    origen: 'Protuberancia occipital externa, línea nucal superior, ligamento nucal y apófisis espinosas de C7 a T12.',
    insercion: 'Tercio lateral de la clavícula, acromion y espina de la escápula.',
    accion: 'Eleva (porción descendente), retrae (transversa) y desciende (ascendente) la escápula, y la rota hacia arriba.',
    datos: ['Al encoger los hombros se contrae su porción descendente.'],
  },
  Pectoralis_major_muscle: {
    descripcion: 'Músculo grande en forma de abanico que forma el relieve del pecho y la pared anterior de la axila.',
    origen: 'Mitad medial de la clavícula (cabeza clavicular), esternón y cartílagos costales 1 a 6 (cabeza esternocostal).',
    insercion: 'Cresta del tubérculo mayor del húmero.',
    accion: 'Aducción y rotación medial del brazo; la cabeza clavicular también lo flexiona.',
    datos: ['Su borde inferior forma el pliegue anterior de la axila.'],
  },
  Pectoralis_minor_muscle: {
    descripcion: 'Músculo triangular y delgado situado bajo el pectoral mayor.',
    origen: 'Costillas 3 a 5.', insercion: 'Apófisis coracoides de la escápula.',
    accion: 'Desciende y lleva hacia delante la escápula; ayuda en la inspiración forzada.',
    datos: ['Divide la arteria axilar en tres porciones, una referencia clásica en anatomía.'],
  },
  Serratus_anterior_muscle: {
    descripcion: 'Músculo con forma de sierra en la pared lateral del tórax. Es imprescindible para levantar el brazo por encima de la cabeza.',
    origen: 'Caras externas de las costillas 1 a 8 o 9.', insercion: 'Borde medial de la escápula, por su cara anterior.',
    accion: 'Lleva la escápula hacia delante, la rota hacia arriba y la mantiene pegada al tórax.',
    datos: ['La lesión del nervio torácico largo produce la «escápula alada».', 'Se le llama «músculo del boxeador» porque proyecta el brazo hacia delante al golpear.'],
  },
  Latissimus_dorsi_muscle: {
    descripcion: 'El músculo más ancho del cuerpo: cubre la parte inferior de la espalda. Es clave para trepar, remar o empujar el cuerpo hacia arriba.',
    origen: 'Apófisis espinosas de T7 a L5 (por la fascia toracolumbar), sacro, cresta ilíaca y últimas costillas.',
    insercion: 'Surco intertubercular del húmero.', accion: 'Extensión, aducción y rotación medial del brazo.',
    datos: ['Con el redondo mayor forma el pliegue posterior de la axila.'],
  },
  Rhomboid_major_muscle: {
    descripcion: 'Músculo con forma de rombo entre la columna y la escápula, bajo el trapecio.',
    origen: 'Apófisis espinosas de T2 a T5.', insercion: 'Borde medial de la escápula, por debajo de la espina.',
    accion: 'Retrae y eleva la escápula.', datos: ['Lo inerva el nervio dorsal de la escápula.'],
  },
  Rhomboid_minor_muscle: {
    descripcion: 'Pequeño músculo situado justo por encima del romboides mayor.',
    origen: 'Apófisis espinosas de C7 y T1.', insercion: 'Borde medial de la escápula, a la altura de la espina.',
    accion: 'Retrae y eleva la escápula.', datos: ['Lo inerva el nervio dorsal de la escápula.'],
  },
  Levator_scapulae: {
    descripcion: 'Músculo alargado de la parte posterior y lateral del cuello.',
    origen: 'Apófisis transversas de C1 a C4.', insercion: 'Ángulo superior de la escápula.',
    accion: 'Eleva la escápula e inclina el cuello hacia el mismo lado.', datos: ['Su contractura es una causa frecuente de dolor de cuello.'],
  },
  Erector_spinae: {
    descripcion: 'Conjunto de músculos (iliocostal, longísimo y espinoso) que recorre la columna a ambos lados. La extiende y la mantiene erguida.',
    accion: 'Extensión y flexión lateral de la columna.', datos: ['Su sobrecarga es una causa habitual de lumbalgia.'],
  },
  Quadratus_lumborum_muscle: {
    descripcion: 'Músculo cuadrangular de la pared posterior del abdomen, entre la última costilla y la pelvis.',
    origen: 'Cresta ilíaca.', insercion: '12.ª costilla y apófisis transversas de L1 a L4.',
    accion: 'Flexión lateral del tronco; fija la 12.ª costilla en la inspiración.', datos: [],
  },

  // ── Cabeza y cuello ──
  Sternocleidomastoid_muscle: {
    descripcion: 'Músculo largo que cruza el cuello en diagonal, desde el esternón y la clavícula hasta detrás de la oreja.',
    origen: 'Manubrio del esternón y tercio medial de la clavícula.', insercion: 'Apófisis mastoides y línea nucal superior.',
    accion: 'Uno solo gira la cabeza al lado opuesto y la inclina al mismo lado; los dos juntos flexionan el cuello.',
    datos: ['Divide el cuello en los triángulos anterior y posterior.', 'Su acortamiento congénito produce la tortícolis del recién nacido.'],
  },
  Platysma: {
    descripcion: 'Lámina muscular muy fina situada justo bajo la piel del cuello.',
    origen: 'Fascia de la parte superior del tórax.', insercion: 'Borde inferior de la mandíbula y piel de la parte inferior de la cara.',
    accion: 'Tensa la piel del cuello y desciende la comisura de la boca.', datos: ['Es un músculo de la expresión facial: lo inerva el nervio facial.'],
  },
  Temporalis_muscle: {
    descripcion: 'Músculo en abanico a los lados del cráneo. Se nota en la sien al apretar los dientes.',
    origen: 'Fosa temporal.', insercion: 'Apófisis coronoides de la mandíbula.',
    accion: 'Elevación y retracción de la mandíbula.', datos: ['Su tensión se relaciona con algunos dolores de cabeza.'],
  },
  Superficial_part_of_masseter: MASETERO,
  Deep_part_of_masseter: MASETERO,
  Orbicularis_oris_muscle: {
    descripcion: 'Músculo circular que rodea la boca. La cierra, frunce los labios y participa en el habla, al silbar y al besar.',
    accion: 'Cierre y protrusión de los labios.', datos: ['Lo inerva el nervio facial.'],
  },
  Orbital_part_of_orbicularis_oculi: ORBICULAR_OJO,
  Palpebral_part_of_orbicularis_oculi: ORBICULAR_OJO,
  Frontalis_muscle: {
    descripcion: 'Vientre frontal del músculo occipitofrontal. Eleva las cejas y arruga la frente horizontalmente.',
    accion: 'Elevación de las cejas.', datos: ['Se une al vientre occipital mediante la aponeurosis epicraneal.'],
  },
  Occipitalis_muscle: {
    descripcion: 'Vientre occipital del músculo occipitofrontal, en la parte posterior del cráneo.',
    accion: 'Tira del cuero cabelludo hacia atrás.', datos: [],
  },
  Zygomaticus_major_muscle: {
    descripcion: 'Músculo de la expresión facial que eleva la comisura de la boca: es el músculo de la sonrisa.',
    origen: 'Hueso cigomático.', insercion: 'Comisura de la boca.', accion: 'Eleva la comisura de la boca y la lleva hacia fuera.',
    datos: ['Una sonrisa sincera combina su acción con la del orbicular del ojo.'],
  },
  Bucinator: {
    descripcion: 'Músculo de la mejilla. Mantiene los alimentos entre los dientes al masticar y permite soplar con fuerza.',
    accion: 'Comprime la mejilla contra los dientes.', datos: ['Su nombre viene del latín buccinator, «trompetista».'],
  },

  // ── Tórax y abdomen ──
  Diaphragm: {
    descripcion: 'Lámina musculotendinosa en forma de cúpula que separa el tórax del abdomen. Es el principal músculo de la respiración.',
    origen: 'Apófisis xifoides, cartílagos costales 7 a 12 y vértebras lumbares superiores (pilares).',
    insercion: 'Centro tendinoso.', accion: 'Inspiración: al contraerse desciende y aumenta el volumen del tórax.',
    datos: ['Lo inerva el nervio frénico (C3–C5).', 'Lo atraviesan la vena cava inferior (T8), el esófago (T10) y la aorta (T12).'],
  },
  Rectus_abdominis_muscle: {
    descripcion: 'Par de músculos largos a ambos lados de la línea media del abdomen. Sus intersecciones tendinosas dibujan la «tableta».',
    origen: 'Cresta y sínfisis del pubis.', insercion: 'Apófisis xifoides y cartílagos costales 5 a 7.',
    accion: 'Flexión del tronco y compresión del abdomen.', datos: ['Está envuelto por la vaina de los rectos.'],
  },
  External_abdominal_oblique_muscle: {
    descripcion: 'El más superficial y grande de los músculos anchos del abdomen; sus fibras bajan hacia delante, como las manos en los bolsillos.',
    origen: 'Caras externas de las costillas 5 a 12.', insercion: 'Línea alba, tubérculo del pubis y cresta ilíaca.',
    accion: 'Flexión del tronco, rotación hacia el lado opuesto y compresión abdominal.', datos: ['El borde inferior de su aponeurosis forma el ligamento inguinal.'],
  },
  Internal_abdominal_oblique_muscle: {
    descripcion: 'Músculo ancho del abdomen situado bajo el oblicuo externo, con fibras en dirección opuesta.',
    origen: 'Fascia toracolumbar, cresta ilíaca y ligamento inguinal.', insercion: 'Costillas 10 a 12 y línea alba.',
    accion: 'Flexión del tronco y rotación hacia el mismo lado.', datos: [],
  },
  Transversus_abdominis_muscle: {
    descripcion: 'El más profundo de los músculos anchos del abdomen; sus fibras son horizontales, como una faja.',
    origen: 'Cartílagos costales 7 a 12, fascia toracolumbar, cresta ilíaca y ligamento inguinal.', insercion: 'Línea alba y pubis.',
    accion: 'Comprime el abdomen y estabiliza la columna lumbar.', datos: [],
  },
  External_intercostal_muscles: {
    descripcion: 'Músculos que ocupan los espacios entre costillas, con fibras dirigidas hacia abajo y hacia delante.',
    accion: 'Elevan las costillas en la inspiración.', datos: [],
  },
  Internal_intercostal_muscles: {
    descripcion: 'Músculos intercostales situados bajo los externos, con fibras en dirección perpendicular.',
    accion: 'Descienden las costillas en la espiración forzada.', datos: [],
  },

  // ── Cadera y muslo ──
  Gluteus_maximus_muscle: {
    descripcion: 'El músculo más voluminoso del cuerpo; forma la nalga.',
    origen: 'Ilion (detrás de la línea glútea posterior), sacro, cóccix y ligamento sacrotuberoso.',
    insercion: 'Tracto iliotibial y tuberosidad glútea del fémur.',
    accion: 'Extensión y rotación lateral del muslo: levantarse de una silla o subir escaleras.', datos: ['Lo inerva el nervio glúteo inferior.'],
  },
  Gluteus_medius_muscle: {
    descripcion: 'Músculo en abanico de la cara lateral de la cadera, en parte cubierto por el glúteo mayor.',
    origen: 'Cara externa del ilion.', insercion: 'Cara lateral del trocánter mayor.',
    accion: 'Abducción y rotación medial del muslo; mantiene la pelvis nivelada al caminar.', datos: ['Su debilidad provoca que la pelvis caiga al apoyar (signo de Trendelenburg).'],
  },
  Gluteus_minimus_muscle: {
    descripcion: 'El más pequeño y profundo de los glúteos, bajo el glúteo medio.',
    origen: 'Cara externa del ilion.', insercion: 'Cara anterior del trocánter mayor.',
    accion: 'Abducción y rotación medial del muslo.', datos: [],
  },
  Piriformis_muscle: {
    descripcion: 'Músculo profundo de la nalga con forma de pera, que sale de la pelvis por el foramen ciático mayor.',
    origen: 'Cara anterior del sacro.', insercion: 'Borde superior del trocánter mayor.',
    accion: 'Rotación lateral del muslo.', datos: ['El nervio ciático suele pasar justo por debajo; si lo comprime causa el «síndrome del piriforme».'],
  },
  Iliacus_muscle: {
    descripcion: 'Músculo triangular que tapiza la fosa ilíaca, en el interior de la pelvis.',
    origen: 'Fosa ilíaca.', insercion: 'Trocánter menor del fémur (junto con el psoas mayor).',
    accion: 'Flexión del muslo.', datos: ['Con el psoas mayor forma el iliopsoas, el flexor más potente de la cadera.'],
  },
  Psoas_major: {
    descripcion: 'Músculo largo a ambos lados de la columna lumbar que baja hasta el muslo.',
    origen: 'Cuerpos vertebrales y apófisis transversas de T12 a L4.', insercion: 'Trocánter menor del fémur.',
    accion: 'Flexión de la cadera y flexión lateral del tronco.', datos: ['Con el ilíaco forma el iliopsoas.'],
  },
  Tensor_fasciae_latae: {
    descripcion: 'Músculo corto de la cara lateral de la cadera que tensa la fascia del muslo.',
    origen: 'Espina ilíaca anterosuperior.', insercion: 'Tracto iliotibial.',
    accion: 'Abducción, flexión y rotación medial del muslo; estabiliza la rodilla en extensión.', datos: [],
  },
  Iliotibial_tract: {
    descripcion: 'Banda fibrosa gruesa de la cara lateral del muslo, que va de la cresta ilíaca a la tibia.',
    insercion: 'Tubérculo del tracto iliotibial (de Gerdy) en la tibia.', accion: 'Estabiliza la cadera y la rodilla.',
    datos: ['Su roce sobre el fémur produce el «síndrome de la cintilla iliotibial», típico de corredores.'],
  },
  Sartorius_muscle: {
    descripcion: 'El músculo más largo del cuerpo: cruza en diagonal la cara anterior del muslo.',
    origen: 'Espina ilíaca anterosuperior.', insercion: 'Cara medial de la tibia, en la «pata de ganso».',
    accion: 'Flexión, abducción y rotación lateral de la cadera, y flexión de la rodilla: la postura del sastre.', datos: [],
  },
  Rectus_femoris_muscle: {
    descripcion: 'Músculo superficial del centro del muslo. Es la única cabeza del cuádriceps que cruza también la cadera.',
    origen: 'Espina ilíaca anteroinferior.', insercion: 'Tuberosidad de la tibia, por el tendón rotuliano.',
    accion: 'Extensión de la rodilla y flexión de la cadera.', datos: [CUADRICEPS],
  },
  Vastus_lateralis_muscle: {
    descripcion: 'La porción más grande del cuádriceps, en la cara lateral del muslo.',
    origen: 'Trocánter mayor y labio lateral de la línea áspera del fémur.', insercion: 'Rótula y tuberosidad de la tibia.',
    accion: 'Extensión de la rodilla.', datos: [CUADRICEPS, 'Es un lugar de inyección intramuscular en lactantes.'],
  },
  Vastus_medialis_muscle: {
    descripcion: 'Porción del cuádriceps en la cara medial del muslo, con forma de lágrima sobre la rodilla.',
    origen: 'Línea intertrocantérea y labio medial de la línea áspera.', insercion: 'Rótula y tuberosidad de la tibia.',
    accion: 'Extensión de la rodilla; su porción inferior estabiliza la rótula.', datos: [CUADRICEPS],
  },
  Vastus_intermedius_muscle: {
    descripcion: 'La porción más profunda del cuádriceps, bajo el recto femoral.',
    origen: 'Caras anterior y lateral de la diáfisis del fémur.', insercion: 'Rótula y tuberosidad de la tibia.',
    accion: 'Extensión de la rodilla.', datos: [CUADRICEPS],
  },
  Adductor_longus: {
    descripcion: 'Músculo triangular de la cara medial del muslo.',
    origen: 'Cuerpo del pubis.', insercion: 'Tercio medio de la línea áspera del fémur.',
    accion: 'Aducción del muslo.', datos: ['Su lesión es el típico «tirón en la ingle» de los futbolistas.'],
  },
  Adductor_magnus: {
    descripcion: 'El aductor más grande y profundo, en la cara medial del muslo.',
    origen: 'Rama isquiopúbica y tuberosidad isquiática.', insercion: 'Línea áspera y tubérculo del aductor del fémur.',
    accion: 'Aducción del muslo; su porción isquiotibial también lo extiende.', datos: ['Tiene doble inervación: nervio obturador y porción tibial del nervio ciático.'],
  },
  Gracilis_muscle: {
    descripcion: 'Músculo largo y delgado, el más superficial de la cara medial del muslo.',
    origen: 'Cuerpo y rama inferior del pubis.', insercion: 'Cara medial de la tibia, en la «pata de ganso».',
    accion: 'Aducción del muslo y flexión de la rodilla.', datos: ['Se usa a menudo como injerto en cirugía reconstructiva.'],
  },
  Long_head_of_biceps_femoris: BICEPS_FEMORAL,
  Short_head_of_biceps_femoris: BICEPS_FEMORAL,
  Semitendinosus_muscle: {
    descripcion: 'Isquiotibial medial superficial; su mitad inferior es un tendón largo.',
    origen: 'Tuberosidad isquiática.', insercion: 'Cara medial de la tibia, en la «pata de ganso».',
    accion: 'Flexión de la rodilla y extensión de la cadera.', datos: ['Su tendón se usa como injerto para reconstruir el ligamento cruzado anterior.'],
  },
  Semimembranosus_muscle: {
    descripcion: 'Isquiotibial medial profundo, con un tendón de origen ancho y membranoso.',
    origen: 'Tuberosidad isquiática.', insercion: 'Cara posterior del cóndilo medial de la tibia.',
    accion: 'Flexión de la rodilla, extensión de la cadera y rotación medial de la pierna.', datos: [],
  },

  // ── Pierna ──
  Lateral_head_of_gastrocnemius: GASTROCNEMIO,
  Medial_head_of_gastrocnemius: GASTROCNEMIO,
  Soleus_muscle: {
    descripcion: 'Músculo ancho y plano situado bajo el gastrocnemio.',
    origen: 'Cabeza y cara posterior de la fíbula y línea del sóleo de la tibia.', insercion: 'Tuberosidad del calcáneo, mediante el tendón calcáneo.',
    accion: 'Flexión plantar del pie; mantiene la postura de pie.', datos: ['Se le llama «segundo corazón» porque al contraerse impulsa la sangre de las venas de la pierna hacia arriba.'],
  },
  Calcaneal_tendon: {
    descripcion: 'El tendón más grueso y fuerte del cuerpo. Une el gastrocnemio y el sóleo con el calcáneo.',
    etimologia: 'Del latín tendo calcaneus, «tendón del talón» (calx, «talón»). También se le llama tendón de Aquiles, por el héroe griego cuyo único punto vulnerable era el talón.',
    insercion: 'Tuberosidad del calcáneo.', accion: 'Transmite la fuerza de la flexión plantar.',
    datos: ['Su rotura se siente como una «pedrada» en la pantorrilla.', 'El reflejo aquíleo explora el segmento S1 de la médula.'],
  },
  Tibialis_anterior_muscle: {
    descripcion: 'Músculo superficial de la cara anterior de la pierna, junto al borde de la tibia.',
    origen: 'Cóndilo lateral y mitad superior de la cara lateral de la tibia.', insercion: 'Cuneiforme medial y base del I metatarsiano.',
    accion: 'Flexión dorsal (levantar la punta del pie) e inversión del pie.', datos: ['Si se paraliza aparece el «pie caído».'],
  },
  // ── Periné (modelo femenino: piezas paramétricas, tools/female_perineum.py) ──
  Ischiocavernosus_muscle: {
    descripcion: 'Músculo alargado que cubre cada raíz (pilar) del clítoris a lo largo de la rama isquiopubiana, en el espacio perineal superficial.',
    origen: 'Tuberosidad isquiática y rama isquiopubiana.', insercion: 'Raíz y cuerpo del clítoris.',
    accion: 'Comprime la raíz del clítoris y frena la salida de sangre: mantiene su erección.',
    datos: ['En el hombre cubre las raíces del pene y es más grande.', 'Lo inerva el nervio perineal, ramo del pudendo (S2–S4).'],
  },
  Bulbospongiosus_muscle: {
    descripcion: 'En la mujer son dos láminas, una a cada lado del vestíbulo, que cubren el bulbo del vestíbulo y la glándula vestibular mayor; por delante llegan al cuerpo del clítoris.',
    origen: 'Cuerpo perineal.', insercion: 'Cuerpo del clítoris, membrana perineal y fascia del bulbo.',
    accion: 'Estrecha el orificio de la vagina, comprime la glándula vestibular mayor y ayuda a la erección del clítoris.',
    datos: ['En el hombre las dos mitades se unen bajo el bulbo del pene y vacían la uretra al final de la micción.'],
  },
  Superficial_transverse_perineal_muscle: {
    descripcion: 'Banda muscular fina que cruza el periné de un lado al otro, por detrás del vestíbulo.',
    origen: 'Cara medial de la tuberosidad isquiática.', insercion: 'Cuerpo perineal.',
    accion: 'Fija el cuerpo perineal y sostiene el suelo de la pelvis.', datos: [],
  },
  Deep_transverse_perineal_muscle: {
    descripcion: 'Lámina muscular del espacio perineal profundo, por encima de la membrana perineal. En la mujer es delgada y tiene mucho músculo liso.',
    origen: 'Rama del isquion.', insercion: 'Cuerpo perineal y pared lateral de la vagina.',
    accion: 'Fija el cuerpo perineal y sostiene las vísceras de la pelvis.', datos: [],
  },
  Compressor_urethrae: {
    descripcion: 'Banda muscular del espacio perineal profundo que pasa en arco por delante de la uretra, de una rama isquiopubiana a la otra.',
    origen: 'Ramas isquiopubianas.', insercion: 'Su compañero del otro lado, por delante de la uretra.',
    accion: 'Comprime la uretra y ayuda a la continencia.', datos: ['Solo existe en la mujer; con el esfínter externo y el uretrovaginal forma el esfínter urogenital.'],
  },
  Sphincter_urethrovaginalis: {
    descripcion: 'Banda muscular que rodea por delante la uretra y baja por los lados de la vagina hasta el cuerpo perineal.',
    origen: 'Cuerpo perineal.', insercion: 'Su compañero del otro lado, por delante de la uretra.',
    accion: 'Comprime la uretra y estrecha la vagina.', datos: ['Solo existe en la mujer.'],
  },
  External_urethral_sphincter: {
    descripcion: 'Anillo de músculo estriado alrededor del tercio medio de la uretra.',
    accion: 'Cierra la uretra de forma voluntaria: permite retener la orina.',
    datos: ['El suelo de la pelvis y este esfínter se debilitan con los partos y la edad; los ejercicios de Kegel los fortalecen.'],
  },
  Perineal_membrane: {
    descripcion: 'Lámina fibrosa triangular tendida entre las dos ramas isquiopubianas, atravesada por la uretra y la vagina. Separa el espacio perineal superficial del profundo.',
    insercion: 'Ramas isquiopubianas y cuerpo perineal.', accion: 'Da apoyo a las raíces y bulbos del clítoris y sostiene la uretra y la vagina.', datos: [],
  },
  Perineal_body: {
    descripcion: 'Nudo fibromuscular entre la vagina y el ano, donde se unen los músculos del periné: bulboesponjoso, transversos, esfínter externo del ano y fibras del elevador del ano.',
    accion: 'Sostiene el suelo de la pelvis.',
    datos: ['En el parto puede desgarrarse; la episiotomía es un corte quirúrgico que evita un desgarro mayor.'],
  },
  // ── Periné (modelo masculino: envuelven los órganos de Z-Anatomy, tools/male_perineum.py) ──
  'Ischiocavernosus_muscle@male': {
    descripcion: 'Músculo alargado que cubre cada raíz (pilar) del pene a lo largo de la rama isquiopubiana, en el espacio perineal superficial.',
    origen: 'Tuberosidad isquiática y rama isquiopubiana.', insercion: 'Caras inferior y medial de la raíz del pene, hasta la unión de las dos raíces.',
    accion: 'Comprime la raíz del pene y frena la salida de sangre: mantiene la erección.',
    datos: ['Es más grande que en la mujer, donde cubre las raíces del clítoris.', 'Lo inerva el nervio perineal, ramo del pudendo (S2–S4).'],
  },
  'Bulbospongiosus_muscle@male': {
    descripcion: 'Dos mitades unidas por un rafe en la línea media, bajo el bulbo del pene. Lo envuelven por abajo y por los lados, y por delante rodean el cuerpo esponjoso.',
    origen: 'Cuerpo perineal y rafe medio bajo el bulbo.', insercion: 'Membrana perineal, cara dorsal del cuerpo esponjoso y fascia de los cuerpos cavernosos.',
    accion: 'Vacía la uretra al final de la micción y expulsa el semen en la eyaculación; ayuda a la erección.',
    datos: ['Sus contracciones rítmicas producen la eyaculación.', 'En la mujer son dos láminas separadas por el vestíbulo.'],
  },
  'Superficial_transverse_perineal_muscle@male': {
    descripcion: 'Banda muscular fina que cruza el periné de un lado al otro, por detrás del bulbo del pene.',
    origen: 'Cara medial de la tuberosidad isquiática.', insercion: 'Cuerpo perineal.',
    accion: 'Fija el cuerpo perineal y sostiene el suelo de la pelvis.', datos: [],
  },
  'Deep_transverse_perineal_muscle@male': {
    descripcion: 'Lámina muscular del espacio perineal profundo, por encima de la membrana perineal y detrás del esfínter externo de la uretra.',
    origen: 'Rama del isquion.', insercion: 'Cuerpo perineal.',
    accion: 'Fija el cuerpo perineal y sostiene la próstata y las vísceras de la pelvis.', datos: ['En el hombre está mejor definido que en la mujer.'],
  },
  'External_urethral_sphincter@male': {
    descripcion: 'Músculo estriado en herradura, abierto hacia atrás, alrededor de la uretra membranosa. Sube por la cara anterior de la próstata.',
    accion: 'Cierra la uretra de forma voluntaria: permite retener la orina.',
    datos: [
      'Tras extirpar la próstata es el principal mecanismo de continencia; por eso se conserva en la cirugía.',
      'En este modelo (como en Z-Anatomy) la próstata se apoya en el bulbo y falta el tramo membranoso de la uretra: el esfínter se ve sobre el vértice de la próstata, donde sale la uretra.',
    ],
  },
  'Perineal_membrane@male': {
    descripcion: 'Lámina fibrosa triangular tendida entre las dos ramas isquiopubianas, bajo la próstata y atravesada por la uretra. Separa el espacio perineal superficial del profundo.',
    insercion: 'Ramas isquiopubianas y cuerpo perineal.', accion: 'Las raíces y el bulbo del pene se fijan en su cara inferior; sostiene la uretra.', datos: [],
  },
  'Perineal_body@male': {
    descripcion: 'Nudo fibromuscular entre el bulbo del pene y el ano, donde se unen los músculos del periné: bulboesponjoso, transversos, esfínter externo del ano y fibras del elevador del ano.',
    accion: 'Sostiene el suelo de la pelvis.', datos: [],
  },

  Fibularis_longus_muscle: {
    descripcion: 'Músculo de la cara lateral de la pierna cuyo tendón cruza la planta del pie.',
    origen: 'Cabeza y dos tercios superiores de la cara lateral de la fíbula.', insercion: 'Cuneiforme medial y base del I metatarsiano.',
    accion: 'Eversión y flexión plantar del pie; sostiene los arcos del pie.', datos: ['Antes se llamaba peroneo largo.'],
  },
};
