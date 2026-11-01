import { GRUPOS } from './grupos.js';
import { latinEtymology } from './musculos.js';

// Fichas de los sistemas respiratorio, digestivo, urogenital, endocrino y linfático. Cada tejido tiene una descripción general; los órganos
// principales tienen ficha propia (clave: nombre inglés de Z-Anatomy con «_»).

const TEJIDO = {
  lung: { tipo: 'Pulmón', descripcion: 'Lóbulo pulmonar: porción del pulmón separada por fisuras, con su propio bronquio lobar. En los alvéolos de los pulmones el oxígeno pasa a la sangre y sale el dióxido de carbono.' },
  bronchus: { tipo: 'Vía aérea', descripcion: 'Tubo del árbol traqueobronquial que conduce el aire hacia los alvéolos. Sus paredes tienen anillos o placas de cartílago que lo mantienen abierto.' },
  cartilage: { tipo: 'Cartílago', descripcion: 'Pieza de cartílago que da forma a la vía aérea y la mantiene abierta.' },
  mucosa: { tipo: 'Mucosa', descripcion: 'Revestimiento húmedo de las vías por donde pasan el aire o los alimentos.' },
  pleura: { tipo: 'Serosa', descripcion: 'Membrana doble que envuelve cada pulmón y tapiza el interior del tórax. Entre sus hojas hay una fina capa de líquido que permite que el pulmón se deslice al respirar.', datos: ['Si entra aire entre sus hojas se produce un neumotórax y el pulmón se colapsa.'] },
  mouth: { tipo: 'Boca', descripcion: 'Parte de la cavidad bucal, donde empieza la digestión con la masticación y la saliva.' },
  stomach: { tipo: 'Tubo digestivo', descripcion: 'Parte del estómago, que mezcla los alimentos con el jugo gástrico ácido.' },
  intestine: { tipo: 'Intestino delgado', descripcion: 'Parte del intestino delgado, donde se digieren y absorben la mayoría de los nutrientes. Mide de 6 a 7 metros.' },
  colon: { tipo: 'Intestino grueso', descripcion: 'Parte del intestino grueso, que absorbe agua y sales y forma las heces.' },
  taenia: { tipo: 'Tenia del colon', descripcion: 'Una de las tres bandas de músculo longitudinal del colon. Al ser más cortas que el propio colon, lo fruncen en saculaciones (haustras).' },
  liver: { tipo: 'Hígado', descripcion: 'Segmento hepático: unidad del hígado con su propia rama de la vena porta, de la arteria hepática y del conducto biliar, de modo que puede extirparse sin dañar al resto.', datos: ['El hígado se divide en 8 segmentos (clasificación de Couinaud), numerados del I al VIII.'] },
  gallbladder: { tipo: 'Vía biliar', descripcion: 'Parte de la vía biliar, que almacena y conduce la bilis desde el hígado hasta el duodeno.' },
  gland: { tipo: 'Glándula', descripcion: 'Glándula del aparato digestivo o su conducto excretor, que vierte sus secreciones al tubo digestivo.' },
  peritoneum: { tipo: 'Peritoneo', descripcion: 'Pliegue del peritoneo, la membrana que tapiza el abdomen y envuelve las vísceras, sostiene sus vasos y las une entre sí.' },
  // Urogenital
  kidney: { tipo: 'Riñón', descripcion: 'Órgano que filtra la sangre y forma la orina.' },
  renal_pelvis: { tipo: 'Vía urinaria', descripcion: 'Parte de la vía urinaria, que recoge la orina y la conduce hacia la vejiga.' },
  ureter: { tipo: 'Vía urinaria', descripcion: 'Conducto de la vía urinaria.' },
  bladder: { tipo: 'Vía urinaria', descripcion: 'Órgano que almacena la orina.' },
  testis: { tipo: 'Glándula sexual', descripcion: 'Glándula sexual masculina, que produce espermatozoides y testosterona.' },
  epididymis: { tipo: 'Vía espermática', descripcion: 'Parte de la vía espermática.' },
  duct: { tipo: 'Vía espermática', descripcion: 'Conducto que transporta los espermatozoides.' },
  seminal: { tipo: 'Glándula anexa', descripcion: 'Glándula que produce parte del líquido del semen.' },
  prostate: { tipo: 'Glándula anexa', descripcion: 'Glándula que produce parte del líquido del semen.' },
  erectile: { tipo: 'Tejido eréctil', descripcion: 'Tejido esponjoso que se llena de sangre durante la erección.' },
  // Femeninos (modelo femenino; formas paramétricas de Anato3D, no de Z-Anatomy)
  uterus: { tipo: 'Genital interno', descripcion: 'Órgano muscular hueco de la pelvis donde se implanta y crece el embrión.' },
  vagina: { tipo: 'Genital interno', descripcion: 'Conducto fibromuscular que une el útero con la vulva.' },
  ovary: { tipo: 'Glándula sexual', descripcion: 'Glándula sexual femenina, que produce los óvulos y las hormonas sexuales.' },
  tube: { tipo: 'Genital interno', descripcion: 'Parte de la trompa uterina, que capta el óvulo y lo lleva al útero.' },
  ligament: { tipo: 'Ligamento', descripcion: 'Cordón de tejido conjuntivo que sostiene los órganos genitales internos.' },
  urethra: { tipo: 'Vía urinaria', descripcion: 'Conducto que lleva la orina de la vejiga al exterior.' },
  gland_f: { tipo: 'Glándula anexa', descripcion: 'Glándula que lubrica el vestíbulo de la vagina.' },
  mammary: { tipo: 'Mama', descripcion: 'Glándula que produce la leche tras el parto.' },
  duct_f: { tipo: 'Mama', descripcion: 'Conducto que lleva la leche de la glándula mamaria al pezón.' },
  // Endocrino
  thyroid: { tipo: 'Glándula endocrina', descripcion: 'Glándula que vierte sus hormonas directamente a la sangre.' },
  parathyroid: { tipo: 'Glándula endocrina', descripcion: 'Glándula diminuta que regula el calcio de la sangre.' },
  adrenal: { tipo: 'Glándula endocrina', descripcion: 'Glándula que vierte sus hormonas directamente a la sangre.' },
  pituitary: { tipo: 'Glándula endocrina', descripcion: 'Parte de la hipófisis, la glándula que dirige a muchas otras.' },
  pineal: { tipo: 'Glándula endocrina', descripcion: 'Glándula que vierte sus hormonas directamente a la sangre.' },
  // Linfático
  spleen: { tipo: 'Órgano linfoide', descripcion: 'Órgano que filtra la sangre y participa en la defensa del cuerpo.' },
  thymus: { tipo: 'Órgano linfoide', descripcion: 'Órgano donde maduran los linfocitos T.' },
  tonsil: { tipo: 'Órgano linfoide', descripcion: 'Acúmulo de tejido linfoide en la garganta.' },
  node: {
    tipo: 'Nodo linfático',
    descripcion: 'Grupo de nodos linfáticos, también llamados ganglios linfáticos: pequeños órganos con forma de judía, de unos milímetros a 2 cm, que filtran la linfa de una región del cuerpo. En ellos los linfocitos detectan microbios y células anormales y ponen en marcha la respuesta inmunitaria.',
    datos: ['Aumentan de tamaño y se palpan cuando hay una infección en la zona que drenan.', 'Muchos cánceres se extienden primero a los nodos de su región; por eso se examinan para saber en qué fase está la enfermedad.'],
  },
};

const COUINAUD = 'El hígado se divide en 8 segmentos (Couinaud), cada uno con su propia irrigación y drenaje biliar.';
export const VISCERAS = {
  // ── Respiratorio ──
  Trachea: { descripcion: 'Tubo de unos 10–12 cm que va de la laringe a los bronquios principales. Lo mantienen abierto entre 16 y 20 anillos de cartílago en forma de C, abiertos por detrás.', datos: ['Se divide en los dos bronquios principales a la altura de T4–T5 (la carina).', 'La traqueostomía es una abertura quirúrgica en su parte cervical.'] },
  Right_main_bronchus: { descripcion: 'Bronquio que lleva el aire al pulmón derecho. Es más corto, más ancho y más vertical que el izquierdo.', datos: ['Por eso los objetos aspirados suelen ir a parar al pulmón derecho.'] },
  Left_main_bronchus: { descripcion: 'Bronquio que lleva el aire al pulmón izquierdo. Es más largo y horizontal que el derecho porque pasa bajo el arco aórtico.', datos: [] },
  Superior_lobe_of_right_lung: { descripcion: 'Lóbulo superior del pulmón derecho, separado del medio por la fisura horizontal.', datos: ['El pulmón derecho tiene tres lóbulos; el izquierdo, solo dos, para dejar sitio al corazón.'] },
  Middle_lobe_of_right_lung: { descripcion: 'Lóbulo medio, exclusivo del pulmón derecho, entre las fisuras horizontal y oblicua.', datos: ['Es el más pequeño de los cinco lóbulos.'] },
  Inferior_lobe_of_right_lung: { descripcion: 'Lóbulo inferior del pulmón derecho, el mayor, apoyado sobre el diafragma.', datos: ['Sus bases se auscultan en la espalda.'] },
  Superior_lobe_of_left_lung: { descripcion: 'Lóbulo superior del pulmón izquierdo. Incluye la língula, que equivale al lóbulo medio del pulmón derecho.', datos: ['Su borde tiene la escotadura cardíaca, el hueco que deja el corazón.'] },
  Inferior_lobe_of_left_lung: { descripcion: 'Lóbulo inferior del pulmón izquierdo, separado del superior por la fisura oblicua.', datos: [] },
  Pleura: TEJIDO.pleura,
  Thyroid_cartilage: { descripcion: 'El mayor cartílago de la laringe, formado por dos láminas unidas por delante. Su relieve es la «nuez de Adán».', datos: ['Es más prominente en los hombres porque la laringe crece en la pubertad.', 'Protege las cuerdas vocales, que se insertan en su cara interna.'] },
  Cricoid_cartilage: { descripcion: 'El único anillo cartilaginoso completo de la vía aérea, en la base de la laringe, con forma de anillo de sello.', datos: ['Por encima de él, entre el cricoides y el tiroides, está la membrana cricotiroidea: por ella se hace la cricotiroidotomía de urgencia.'] },
  Arytenoid_cartilage: { descripcion: 'Par de cartílagos piramidales sobre el cricoides. Sus movimientos abren y cierran las cuerdas vocales.', datos: [] },
  Epiglottis: { descripcion: 'Lámina de cartílago elástico con forma de hoja que cierra la entrada de la laringe al tragar, para que los alimentos vayan al esófago.', datos: ['Su inflamación (epiglotitis) puede obstruir la vía aérea.'] },
  Mucosa_of_nasal_cavity: { descripcion: 'Revestimiento de la cavidad nasal, muy irrigado, que calienta, humedece y filtra el aire inspirado.', datos: ['En su techo está la mucosa olfatoria.'] },
  Nasopharynx: { descripcion: 'Parte superior de la faringe, detrás de las fosas nasales. Solo conduce aire.', datos: ['En ella desembocan las trompas auditivas y están las adenoides.'] },
  // ── Digestivo ──
  Tongue: { descripcion: 'Órgano muscular de la boca que mueve los alimentos al masticar, inicia la deglución y es esencial para hablar. En su superficie están las papilas gustativas.', datos: ['Sus músculos los inerva el nervio hipogloso (XII).'] },
  Parotid_gland: { descripcion: 'La mayor de las glándulas salivales, delante y debajo de la oreja. Vierte la saliva en la boca a la altura del segundo molar superior.', datos: ['Se inflama en las paperas.', 'El nervio facial la atraviesa.'] },
  Submandibular_gland: { descripcion: 'Glándula salival bajo la mandíbula que produce la mayor parte de la saliva en reposo.', datos: ['Es la glándula salival donde más se forman cálculos.'] },
  Sublingual_gland: { descripcion: 'La más pequeña de las glándulas salivales mayores, bajo la lengua.', datos: [] },
  Soft_palate: { descripcion: 'Parte posterior y muscular del paladar. Al tragar se eleva y cierra la comunicación con la nariz.', datos: [] },
  Uvula_of_palate: { descripcion: 'Pequeña prolongación colgante del borde del paladar blando.', datos: [] },
  Oropharynx: { descripcion: 'Parte media de la faringe, detrás de la boca, por donde pasan tanto el aire como los alimentos.', datos: ['En sus paredes están las amígdalas palatinas.'] },
  Laryngopharynx: { descripcion: 'Parte inferior de la faringe, detrás de la laringe, que continúa con el esófago.', datos: [] },
  Oesophagus: { descripcion: 'Tubo muscular de unos 25 cm que lleva los alimentos de la faringe al estómago, atravesando el tórax y el diafragma.', datos: ['Sus ondas de contracción (peristaltismo) permiten tragar incluso cabeza abajo.', 'El reflujo de ácido desde el estómago produce ardor (pirosis).'] },
  Stomach: { descripcion: 'Dilatación del tubo digestivo bajo el diafragma, a la izquierda. Almacena los alimentos y los mezcla con ácido y enzimas hasta formar el quimo.', datos: ['Vacío tiene unos 50 ml de capacidad; lleno puede superar 1,5 litros.'] },
  Mucosa_of_stomach: { descripcion: 'Capa interna del estómago, con pliegues y glándulas que producen ácido clorhídrico, enzimas y moco protector.', datos: ['La bacteria Helicobacter pylori puede dañarla y causar úlceras.'] },
  Duodenum: { descripcion: 'Primer tramo del intestino delgado, de unos 25 cm y en forma de C, que rodea la cabeza del páncreas.', datos: ['En él desembocan la bilis y el jugo pancreático.'] },
  Jejunum: { descripcion: 'Tramo del intestino delgado tras el duodeno, con muchos pliegues, donde se absorbe gran parte de los nutrientes.', datos: [] },
  Ascending_colon: { descripcion: 'Tramo del intestino grueso que sube por el lado derecho del abdomen.', datos: [] },
  Transverse_colon: { descripcion: 'Tramo del intestino grueso que cruza el abdomen de derecha a izquierda, colgado del mesocolon transverso.', datos: [] },
  Descending_colon: { descripcion: 'Tramo del intestino grueso que baja por el lado izquierdo del abdomen.', datos: [] },
  Sigmoid_colon: { descripcion: 'Tramo final del colon, en forma de S, que continúa con el recto.', datos: ['Es una zona frecuente de divertículos.'] },
  Vermiform_appendix: { descripcion: 'Pequeño tubo ciego que sale del ciego, al principio del intestino grueso, en la parte inferior derecha del abdomen.', datos: ['Su inflamación (apendicitis) produce un dolor que suele empezar en el ombligo y pasa a la fosa ilíaca derecha.'] },
  Liver: { descripcion: 'El órgano interno más grande (unos 1,5 kg). Procesa los nutrientes, produce la bilis, almacena glucógeno, fabrica proteínas de la sangre y elimina sustancias tóxicas.', datos: ['Puede regenerarse incluso tras extirparse más de la mitad.'] },
  Gallbladder: { descripcion: 'Saco con forma de pera bajo el hígado que almacena y concentra la bilis, y la vacía al duodeno tras las comidas grasas.', datos: ['Los cálculos biliares se forman en ella.'] },
  Bile_duct: { descripcion: 'Conducto que lleva la bilis del hígado y la vesícula al duodeno, junto con el conducto pancreático.', datos: ['Su obstrucción produce ictericia (piel y ojos amarillos).'] },
  Pancreas: { descripcion: 'Glándula alargada detrás del estómago. Produce jugo digestivo que vierte al duodeno y hormonas como la insulina y el glucagón.', datos: ['Su parte hormonal son los islotes de Langerhans.'] },
  Pancreatic_duct: { descripcion: 'Conducto principal del páncreas, que recorre la glándula y vierte el jugo pancreático al duodeno.', datos: [] },
  Greater_omentum: { descripcion: 'Gran pliegue de peritoneo con grasa que cuelga del estómago como un delantal sobre los intestinos.', datos: ['Se le llama «policía del abdomen» porque se desplaza hacia las zonas inflamadas y las aísla.'] },
  Lesser_omentum: { descripcion: 'Pliegue de peritoneo que une el estómago y el duodeno con el hígado.', datos: [] },
  // ── Urinario ──
  Kidney: { descripcion: 'Órgano par con forma de judía, de unos 11 cm de largo, en la parte posterior del abdomen, detrás del peritoneo, a ambos lados de la columna (entre las vértebras T12 y L3). Filtra unos 180 litros de plasma al día y forma de 1 a 2 litros de orina.', datos: ['El riñón derecho suele estar algo más bajo que el izquierdo, porque el hígado lo empuja hacia abajo.', 'Cada riñón tiene alrededor de un millón de nefronas, sus unidades de filtración.', 'También produce eritropoyetina, que estimula la formación de glóbulos rojos, y renina, que ayuda a regular la presión arterial.'] },
  Renal_pelvis: { descripcion: 'Embudo dentro del riñón donde se reúnen los cálices. Recoge la orina y la vierte en el uréter.', datos: ['Es un lugar frecuente de cálculos renales.'] },
  Ureter: { descripcion: 'Tubo muscular de 25 a 30 cm que lleva la orina de cada riñón a la vejiga mediante ondas de contracción (peristaltismo).', datos: ['Tiene tres estrechamientos donde suelen atascarse los cálculos: la salida de la pelvis renal, el cruce con los vasos ilíacos y la entrada en la vejiga.', 'El cólico renal es el dolor intenso que produce un cálculo al avanzar por él.'] },
  Urinary_bladder: { descripcion: 'Órgano muscular hueco, detrás del pubis, que almacena la orina hasta que se expulsa.', datos: ['En un adulto suele contener entre 400 y 600 ml; las ganas de orinar aparecen mucho antes.', 'Su pared es el músculo detrusor, que se contrae al orinar.'] },
  Urethra: { descripcion: 'Conducto que lleva la orina desde la vejiga al exterior. En el hombre mide unos 18 a 20 cm, atraviesa la próstata y el pene, y también da salida al semen.', datos: ['En el hombre tiene tres porciones: prostática, membranosa y esponjosa.', 'La uretra femenina mide solo unos 4 cm; por eso las infecciones urinarias son más frecuentes en las mujeres.'] },
  // ── Genital masculino ──
  Testis: { descripcion: 'Glándula sexual masculina, ovalada, de 4 a 5 cm, alojada en el escroto. Produce los espermatozoides y la testosterona.', datos: ['Está fuera del abdomen porque los espermatozoides se forman mejor 2 o 3 °C por debajo de la temperatura corporal.', 'Se forma en el abdomen y desciende al escroto antes del nacimiento; si no lo hace se habla de criptorquidia.'] },
  Epididymis: { descripcion: 'Conducto muy enrollado, pegado a la parte posterior del testículo, que estirado mediría unos 6 m. En él maduran y se almacenan los espermatozoides.', datos: ['Al recorrerlo, los espermatozoides adquieren la capacidad de moverse.'] },
  Ductus_deferens: { descripcion: 'Conducto muscular de 30 a 45 cm que lleva los espermatozoides del epidídimo a la uretra. Sube por el cordón espermático, atraviesa el conducto inguinal y rodea la vejiga por detrás.', datos: ['La vasectomía consiste en cortarlo o ligarlo.'] },
  Ejaculatory_duct: { descripcion: 'Conducto corto, de unos 2 cm, formado por la unión del conducto deferente y el de la glándula seminal. Atraviesa la próstata y desemboca en la uretra.', datos: [] },
  Seminal_gland: { descripcion: 'Glándula par y alargada, detrás de la vejiga, también llamada vesícula seminal. Produce la mayor parte del líquido del semen, rico en fructosa, que da energía a los espermatozoides.', datos: ['Aporta alrededor del 60–70 % del volumen del semen.'] },
  Prostate: { descripcion: 'Glándula del tamaño de una nuez, bajo la vejiga, que rodea el primer tramo de la uretra. Produce parte del líquido del semen.', datos: ['Con la edad suele crecer (hiperplasia benigna de próstata) y dificultar la salida de la orina.', 'Se puede palpar a través del recto (tacto rectal).'] },
  Corpus_cavernosum_of_penis: { descripcion: 'Par de cilindros de tejido eréctil que forman la parte dorsal del pene. Al llenarse de sangre producen la erección.', datos: ['En este modelo los dos cuerpos cavernosos forman una sola pieza.'] },
  Corpus_spongiosum_of_penis: { descripcion: 'Cilindro de tejido eréctil en la cara inferior del pene, que rodea la uretra. Su extremo forma el glande.', datos: ['Su extremo posterior, ensanchado, es el bulbo del pene, en el periné; lo cubre el músculo bulboesponjoso y en él entra la uretra al salir de la próstata.'] },
  Glans_penis: { descripcion: 'Extremo ensanchado del cuerpo esponjoso, en la punta del pene, donde se abre la uretra.', datos: [] },
  // ── Genitales femeninos y mama ──
  Uterus: { descripcion: 'Órgano muscular hueco con forma de pera invertida, de unos 7,5 cm, entre la vejiga y el recto. Se divide en fondo, cuerpo y cuello (cérvix); el cuello asoma en la parte alta de la vagina. Su capa interna, el endometrio, se renueva en cada ciclo menstrual.', datos: ['Suele estar en anteversión y anteflexión: inclinado hacia delante sobre la vejiga.', 'En el embarazo pasa de unos 60 g a cerca de 1 kg y llega a la altura de las costillas.', 'Su pared muscular (miometrio) es la que se contrae en el parto.'] },
  Vagina: { descripcion: 'Conducto fibromuscular elástico de unos 8 cm que va del vestíbulo de la vulva al cuello del útero, hacia arriba y atrás. Es el canal del parto y la vía de salida de la menstruación.', datos: ['Sus paredes anterior y posterior están normalmente en contacto, por eso en sección tiene forma de H.', 'El cuello del útero entra en su extremo superior, formando alrededor los fondos de saco (fórnix).'] },
  Ovary: { descripcion: 'Glándula sexual femenina, del tamaño de una almendra (unos 3,5 × 2 × 1,5 cm), en la pared lateral de la pelvis. Contiene los folículos con los óvulos y produce estrógenos y progesterona.', datos: ['Al nacer hay cerca de un millón de folículos; solo unos 400 llegan a liberar un óvulo a lo largo de la vida.', 'Cada mes, en la ovulación, un folículo maduro se rompe y libera un óvulo.'] },
  Uterine_tube: { descripcion: 'Conducto de 10 a 12 cm que va del ángulo del útero al ovario: istmo, ampolla e infundíbulo, que se abre a la cavidad del abdomen rodeado de fimbrias. Recoge el óvulo y lo lleva al útero.', datos: ['La fecundación suele producirse en la ampolla.', 'Si el embrión se implanta en ella se produce un embarazo ectópico.', 'También se llama trompa de Falopio.'] },
  Fimbriae_of_uterine_tube: { descripcion: 'Prolongaciones en forma de flecos del extremo de la trompa uterina, que se mueven sobre el ovario y recogen el óvulo al ser liberado.', datos: [] },
  Ligament_of_ovary: { descripcion: 'Cordón fibromuscular que une el polo inferior del ovario con el ángulo del útero, por debajo de la trompa.', datos: [] },
  Round_ligament_of_uterus: { descripcion: 'Cordón que va del ángulo del útero, por el conducto inguinal, hasta el labio mayor. Mantiene el útero inclinado hacia delante.', datos: ['Es el equivalente femenino del gubernáculo del testículo.', 'Su estiramiento en el embarazo produce dolor en la ingle.'] },
  Female_urethra: { descripcion: 'Conducto corto, de unos 4 cm, que lleva la orina desde el cuello de la vejiga hasta el vestíbulo de la vulva, por delante de la vagina.', datos: ['Por ser tan corta, las infecciones urinarias son mucho más frecuentes en las mujeres.', 'Se abre entre el clítoris y el orificio de la vagina.'] },
  Glans_of_clitoris: { descripcion: 'Parte visible del clítoris, en la unión anterior de los labios menores, cubierta por el capuchón. Es la zona con más terminaciones nerviosas sensitivas del cuerpo.', datos: ['Es el equivalente del glande del pene, aunque sin la uretra.'] },
  Body_of_clitoris: { descripcion: 'Parte del clítoris, de unos 2–3 cm, formada por dos cuerpos cavernosos, que se dobla hacia abajo bajo la sínfisis del pubis y termina en el glande.', datos: ['El clítoris completo mide de 9 a 11 cm; la mayor parte está bajo la piel.'] },
  Crus_of_clitoris: { descripcion: 'Raíz del clítoris: cada uno de los dos cuerpos cavernosos que siguen las ramas isquiopubianas y se unen en el cuerpo.', datos: ['Las cubre el músculo isquiocavernoso.'] },
  Bulb_of_vestibule: { descripcion: 'Masa alargada de tejido eréctil a cada lado del orificio de la vagina, bajo los labios menores. Se llena de sangre durante la excitación.', datos: ['Es el equivalente del bulbo del pene.', 'Lo cubre el músculo bulboesponjoso.'] },
  Greater_vestibular_gland: { descripcion: 'Glándula del tamaño de un guisante detrás de cada bulbo del vestíbulo. Su secreción lubrica el vestíbulo.', datos: ['También se llama glándula de Bartolino; la obstrucción de su conducto forma un quiste.'] },
  Duct_of_greater_vestibular_gland: { descripcion: 'Conducto de unos 2 cm que lleva la secreción de la glándula vestibular mayor al vestíbulo, donde se abre por fuera del himen, a las 5 y a las 7 si se mira el orificio vaginal como la esfera de un reloj.', datos: ['Si se obstruye, la secreción se acumula y forma un quiste de Bartolino.'] },
  Mammary_gland: { descripcion: 'Glándula de la mama, formada por 15 a 20 lóbulos que desembocan en el pezón y rodeada de grasa. Se apoya sobre el músculo pectoral mayor, de la 2.ª a la 6.ª costilla, y se prolonga hacia la axila.', datos: ['La prolongación axilar (cola de Spence) es una zona frecuente de tumores.', 'La sostienen los ligamentos suspensorios (de Cooper).', 'La linfa drena sobre todo a los nodos de la axila.'] },
  Lactiferous_ducts: { descripcion: 'Conductos que llevan la leche de cada lóbulo de la glándula mamaria al pezón. Junto a la areola se ensanchan un poco (senos galactóforos).', datos: ['En el pezón desembocan de 15 a 20 conductos.'] },
  // ── Endocrino ──
  Thyroid_gland: { descripcion: 'Glándula con forma de mariposa en la parte anterior del cuello, delante de la tráquea y bajo la laringe. Produce las hormonas tiroideas (T3 y T4), que regulan el metabolismo, y la calcitonina.', datos: ['Necesita yodo para fabricar sus hormonas; su falta produce bocio.', 'Sube al tragar porque está unida a la laringe.', 'Sus dos lóbulos se unen por un istmo que pasa por delante de los anillos 2.º a 4.º de la tráquea.'] },
  Superior_parathyroid_gland: { descripcion: 'Glándula diminuta, del tamaño de un grano de arroz, en la cara posterior de la tiroides. Las paratiroides, normalmente cuatro, producen la hormona paratiroidea (PTH), que eleva el calcio de la sangre.', datos: ['Pueden dañarse al operar la tiroides; entonces baja el calcio (hipocalcemia) y aparecen calambres y hormigueo.'] },
  Suprarenal_gland: { descripcion: 'Glándula sobre el polo superior de cada riñón. Su corteza produce cortisol, aldosterona y andrógenos; su médula, adrenalina y noradrenalina.', datos: ['La derecha tiene forma triangular y la izquierda, de media luna.', 'La adrenalina prepara al cuerpo para la respuesta de «lucha o huida».'] },
  Adenohypophysis: { descripcion: 'Lóbulo anterior de la hipófisis. Produce las hormonas que controlan la tiroides, las suprarrenales y las gónadas, además de la hormona del crecimiento y la prolactina.', datos: ['El hipotálamo la controla mediante una red propia de vasos sanguíneos (sistema porta hipofisario).', 'La hipófisis descansa en la silla turca del hueso esfenoides.'] },
  Neurohypophysis: { descripcion: 'Lóbulo posterior de la hipófisis, formado por prolongaciones de neuronas del hipotálamo. Libera a la sangre la oxitocina y la hormona antidiurética (vasopresina).', datos: ['La hormona antidiurética hace que el riñón ahorre agua.'] },
  Pineal_gland: { descripcion: 'Pequeña glándula con forma de piña en el centro del encéfalo, detrás del tercer ventrículo. Produce melatonina, que ayuda a regular el ciclo de sueño y vigilia.', datos: ['Su secreción aumenta en la oscuridad.', 'Con la edad suele calcificarse y se ve en las radiografías.'] },
  // ── Linfático ──
  Spleen: { descripcion: 'Órgano linfoide del tamaño de un puño, arriba y a la izquierda en el abdomen, bajo el diafragma y protegido por las costillas 9.ª a 11.ª. Filtra la sangre, retira los glóbulos rojos viejos y participa en la defensa frente a infecciones.', datos: ['Es el órgano que más se rompe en los golpes abdominales.', 'Se puede vivir sin él, aunque aumenta el riesgo de algunas infecciones.'] },
  Left_lobe_of_thymus: { descripcion: 'Lóbulo del timo, órgano linfoide situado detrás del esternón, delante del corazón y de los grandes vasos. En él maduran los linfocitos T.', datos: ['Es grande en la infancia y desde la pubertad se va sustituyendo por grasa.'] },
  Palatine_tonsil: { descripcion: 'Masa de tejido linfoide a cada lado de la garganta, entre los arcos del paladar. Es la «amígdala» que se ve al abrir la boca; en la terminología anatómica se llama tonsila palatina.', datos: ['Forma parte del anillo linfático de la faringe (anillo de Waldeyer), que vigila lo que entra por la boca y la nariz.', 'Su inflamación es la amigdalitis.'] },
  // Nodos con datos propios (la descripción general es la del tejido).
  Supraclavicular_nodes: { datos: ['Un nodo supraclavicular izquierdo aumentado (nodo de Virchow) puede ser la primera señal de un cáncer del abdomen.'] },
  Jugulodigastric_node: { datos: ['Recibe la linfa de la amígdala palatina: es el nodo que más se palpa en las amigdalitis.'] },
  Central_axillary_nodes: { datos: ['Los nodos axilares reciben la mayor parte de la linfa de la mama; en su cáncer se estudia el primero de ellos (nodo centinela).'] },
  Superomedial_superficial_inguinal_nodes: { datos: ['Los nodos inguinales superficiales reciben la linfa de la pierna, los genitales externos, el ano y la parte baja de la pared del abdomen.'] },
};
VISCERAS.Inferior_parathyroid_gland = VISCERAS.Superior_parathyroid_gland;
VISCERAS.Right_lobe_of_thymus = VISCERAS.Left_lobe_of_thymus;
for (const k of ['Anterior_axillary_nodes', 'Posterior_axillary_nodes', 'Lateral_axillary_nodes', 'Apical_axillary_nodes']) VISCERAS[k] = VISCERAS.Central_axillary_nodes;
for (const k of ['Superolateral_superficial_inguinal_nodes', 'Inferior_superficial_inguinal_nodes']) VISCERAS[k] = VISCERAS.Superomedial_superficial_inguinal_nodes;
for (const [k, n] of [['Posterior_segment_of_liver_I', 'I'], ['Left_posterior_lateral_segment_of_liver_II', 'II'], ['Left_anterior_lateral_segment_of_liver_III', 'III'],
  ['Left_medial_segment_of_liver_IV', 'IV'], ['Anterior_medial_segment_of_liver_V', 'V'], ['Anterior_lateral_segment_of_liver_VI', 'VI'],
  ['Posterior_lateral_segment_of_liver_VII', 'VII'], ['Posterior_medial_segment_of_liver_VIII', 'VIII']]) {
  VISCERAS[k] = { descripcion: `Segmento ${n} del hígado. ${COUINAUD}`, datos: n === 'I' ? ['El segmento I (lóbulo caudado) drena directamente a la vena cava inferior.'] : ['Los cirujanos usan los segmentos para extirpar solo la parte enferma del hígado.'] };
}

const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const parse = (s) => {
  try { return JSON.parse(s || '[]'); } catch { return []; }
};

export function resolveVisceral(name, x) {
  const side = /_L$/.test(name) ? 'L' : /_R$/.test(name) ? 'R' : null;
  const region = parse(x.region);
  const key = String(x.name_en ?? '').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '');
  const own = VISCERAS[key] ?? null;
  const tejido = TEJIDO[x.tissue] ?? TEJIDO.mucosa;
  const group = [...region].reverse().map((g) => GRUPOS[g]).find(Boolean);
  return {
    key: x.name_en,
    side,
    title: cap(x.name_es || x.name_en),
    latin: x.name_la || null,
    tissue: null,
    chips: [tejido.tipo, side && (side === 'L' ? 'Lado izquierdo' : 'Lado derecho')].filter(Boolean),
    fields: [group && { label: 'Región', value: group.nombre }].filter(Boolean),
    entry: {
      descripcion: own?.descripcion ?? tejido.descripcion,
      etimologia: latinEtymology(x.name_la),
    },
    datos: [...(own?.datos ?? []), ...(own?.descripcion ? [] : tejido.datos ?? [])],
    source: x.source ?? null,
  };
}
