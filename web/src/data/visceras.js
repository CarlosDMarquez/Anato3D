import { GRUPOS } from './grupos.js';
import { latinEtymology } from './musculos.js';
import { fuentesViscera } from './fuentes.js';

// Fichas de los sistemas respiratorio, digestivo, urogenital, endocrino y linfático. Cada tejido tiene una descripción general; los órganos
// principales tienen ficha propia (clave: nombre inglés de Z-Anatomy con «_»).

const TEJIDO = {
  lung: { tipo: 'Pulmón', descripcion: 'Lóbulo pulmonar: porción del pulmón separada de las demás por fisuras. En los alvéolos de los pulmones el oxígeno pasa a la sangre y sale el dióxido de carbono.' },
  bronchus: { tipo: 'Vía aérea', descripcion: 'Tubo de la vía aérea que conduce el aire hacia los alvéolos. Sus paredes tienen anillos o placas de cartílago que lo mantienen abierto.' },
  cartilage: { tipo: 'Cartílago', descripcion: 'Pieza de cartílago que da forma a la vía aérea y la mantiene abierta.' },
  mucosa: { tipo: 'Mucosa', descripcion: 'Revestimiento húmedo de las vías por donde pasan el aire o los alimentos.' },
  pleura: { tipo: 'Serosa', descripcion: 'Membrana doble que envuelve cada pulmón y tapiza el interior del tórax. Entre sus hojas hay una fina capa de líquido que permite que el pulmón se deslice al respirar.', datos: ['La acumulación de aire entre sus hojas es el neumotórax.'] },
  mouth: { tipo: 'Boca', descripcion: 'Parte de la cavidad bucal, donde empieza la digestión con la masticación y la saliva.' },
  stomach: { tipo: 'Tubo digestivo', descripcion: 'Parte del estómago, que mezcla los alimentos con los jugos gástricos.' },
  intestine: { tipo: 'Intestino delgado', descripcion: 'Parte del intestino delgado, donde se absorbe la mayor parte de los nutrientes de los alimentos. En una persona viva suele medir de 3 a 5 metros.' },
  colon: { tipo: 'Intestino grueso', descripcion: 'Parte del intestino grueso, donde se absorben agua y sales; los restos se almacenan en el recto como heces.' },
  taenia: { tipo: 'Tenia del colon', descripcion: 'Una de las tres bandas longitudinales de músculo liso de la cara externa del colon.' },
  liver: { tipo: 'Hígado', descripcion: 'Segmento hepático: unidad funcional del hígado con su propia entrada y salida de sangre y su propio drenaje biliar.', datos: ['El hígado se divide en 8 segmentos (clasificación de Couinaud), numerados del I al VIII.'] },
  gallbladder: { tipo: 'Vía biliar', descripcion: 'Parte de la vía biliar, que almacena y conduce la bilis desde el hígado hasta el duodeno.' },
  gland: { tipo: 'Glándula', descripcion: 'Glándula del aparato digestivo o su conducto excretor, que vierte sus secreciones al tubo digestivo.' },
  peritoneum: { tipo: 'Peritoneo', descripcion: 'Pliegue del peritoneo, la membrana que tapiza el abdomen y envuelve las vísceras, sostiene sus vasos y las une entre sí.' },
  // Urogenital
  kidney: { tipo: 'Riñón', descripcion: 'Órgano que filtra la sangre y forma la orina.' },
  renal_pelvis: { tipo: 'Vía urinaria', descripcion: 'Parte de la vía urinaria, que recoge la orina de los cálices y la conduce al uréter.' },
  ureter: { tipo: 'Vía urinaria', descripcion: 'Conducto de la vía urinaria.' },
  bladder: { tipo: 'Vía urinaria', descripcion: 'Órgano que almacena la orina.' },
  testis: { tipo: 'Glándula sexual', descripcion: 'Glándula sexual masculina, que produce espermatozoides y testosterona.' },
  epididymis: { tipo: 'Vía espermática', descripcion: 'Parte de la vía espermática.' },
  duct: { tipo: 'Vía espermática', descripcion: 'Conducto que transporta los espermatozoides.' },
  seminal: { tipo: 'Glándula anexa', descripcion: 'Glándula que produce parte del líquido del semen.' },
  prostate: { tipo: 'Glándula anexa', descripcion: 'Glándula que produce parte del líquido del semen.' },
  erectile: { tipo: 'Tejido eréctil', descripcion: 'Tejido esponjoso que se llena de sangre durante la erección.' },
  // Femeninos (modelo femenino; formas paramétricas de Anato3D, no de Z-Anatomy)
  uterus: { tipo: 'Genital interno', descripcion: 'Órgano muscular de la pelvis donde se implanta y se desarrolla el embrión.' },
  vagina: { tipo: 'Genital interno', descripcion: 'Conducto elástico y muscular que va de la vulva al cuello del útero.' },
  ovary: { tipo: 'Glándula sexual', descripcion: 'Glándula sexual femenina, que produce los óvulos y las hormonas sexuales.' },
  tube: { tipo: 'Genital interno', descripcion: 'Parte de la trompa uterina, que capta el óvulo y lo lleva al útero.' },
  ligament: { tipo: 'Ligamento', descripcion: 'Ligamento que une entre sí los órganos genitales internos, como el ovario con el útero.' },
  urethra: { tipo: 'Vía urinaria', descripcion: 'Conducto que lleva la orina de la vejiga al exterior.' },
  gland_f: { tipo: 'Glándula anexa', descripcion: 'Glándula que segrega moco para lubricar la vagina.' },
  mammary: { tipo: 'Mama', descripcion: 'Glándula que produce la leche tras el parto.' },
  duct_f: { tipo: 'Mama', descripcion: 'Conducto que lleva la leche de la glándula mamaria al pezón.' },
  fat: { tipo: 'Tejido adiposo', descripcion: 'Grasa que rodea la glándula mamaria bajo la piel y le da a la mama su forma. La proporción de los tejidos de la mama varía de una mujer a otra.' },
  // Endocrino
  thyroid: { tipo: 'Glándula endocrina', descripcion: 'Glándula que vierte sus hormonas directamente a la sangre.' },
  parathyroid: { tipo: 'Glándula endocrina', descripcion: 'Glándula diminuta que regula el calcio de la sangre.' },
  adrenal: { tipo: 'Glándula endocrina', descripcion: 'Glándula que vierte sus hormonas directamente a la sangre.' },
  pituitary: { tipo: 'Glándula endocrina', descripcion: 'Parte de la hipófisis, la glándula que, junto con el hipotálamo, controla gran parte del sistema endocrino.' },
  pineal: { tipo: 'Glándula endocrina', descripcion: 'Glándula que vierte sus hormonas directamente a la sangre.' },
  // Linfático
  spleen: { tipo: 'Órgano linfoide', descripcion: 'Órgano que filtra la sangre y participa en la defensa del cuerpo.' },
  thymus: { tipo: 'Órgano linfoide', descripcion: 'Órgano donde maduran los linfocitos T.' },
  tonsil: { tipo: 'Órgano linfoide', descripcion: 'Acúmulo de tejido linfoide en la garganta.' },
  node: {
    tipo: 'Nodo linfático',
    descripcion: 'Grupo de nodos linfáticos, también llamados ganglios linfáticos: pequeños órganos con forma de riñón u ovalados, de 2 a 25 mm de largo. Su función principal es filtrar la linfa para detectar y combatir las infecciones.',
    datos: ['Cuando aumentan de tamaño algunos pueden notarse al tacto; que crezcan los de una sola zona puede indicar una infección o un tumor en esa zona.', 'Muchos cánceres pueden extenderse a los nodos cercanos; por eso su estado es muy importante para saber en qué fase está el cáncer.'],
  },
};

const COUINAUD = 'El hígado se divide en 8 segmentos (Couinaud), cada uno con su propia irrigación y drenaje biliar.';
export const VISCERAS = {
  // ── Respiratorio ──
  Trachea: { descripcion: 'Tubo de unos 10 a 11 cm que va de la laringe a los bronquios principales. Lo rodean entre 16 y 20 anillos incompletos de cartílago hialino, en forma de C, que lo mantienen abierto.', datos: ['Se divide en los dos bronquios principales en la carina, a la altura de la cuarta vértebra torácica (T4).', 'La traqueostomía es una abertura quirúrgica en su parte cervical.'] },
  Right_main_bronchus: { descripcion: 'Bronquio que lleva el aire al pulmón derecho. Es más corto, más ancho y más vertical que el izquierdo.', datos: ['Por eso los objetos aspirados suelen ir a parar al pulmón derecho.'] },
  Left_main_bronchus: { descripcion: 'Bronquio que lleva el aire al pulmón izquierdo. Es más largo y estrecho que el derecho y pasa por debajo del arco aórtico.', datos: [] },
  Superior_lobe_of_right_lung: { descripcion: 'Lóbulo superior del pulmón derecho, separado del medio por la fisura horizontal.', datos: ['El pulmón derecho tiene tres lóbulos y el izquierdo, dos; el izquierdo comparte espacio con el corazón.'] },
  Middle_lobe_of_right_lung: { descripcion: 'Lóbulo medio del pulmón derecho, entre las fisuras horizontal y oblicua.', datos: ['El pulmón izquierdo no tiene lóbulo medio; tiene en cambio la língula, una prolongación de su lóbulo superior.'] },
  Inferior_lobe_of_right_lung: { descripcion: 'Lóbulo inferior del pulmón derecho, separado de los lóbulos medio y superior por la fisura oblicua.', datos: [] },
  Superior_lobe_of_left_lung: { descripcion: 'Lóbulo superior del pulmón izquierdo, separado del inferior por la fisura oblicua. Incluye la língula, que equivale al lóbulo medio del pulmón derecho.', datos: ['En el borde del pulmón izquierdo está la escotadura cardíaca, que deja sitio al corazón.'] },
  Inferior_lobe_of_left_lung: { descripcion: 'Lóbulo inferior del pulmón izquierdo, separado del superior por la fisura oblicua.', datos: [] },
  Pleura: TEJIDO.pleura,
  Thyroid_cartilage: { descripcion: 'El mayor cartílago de la laringe, formado por dos láminas unidas por delante. Su relieve es la «nuez de Adán».', datos: ['Es más prominente en los hombres porque la laringe crece en la pubertad.', 'Protege las cuerdas vocales, que están justo detrás de él.'] },
  Cricoid_cartilage: { descripcion: 'El único cartílago de la laringe que forma un anillo completo alrededor de la vía aérea; tiene forma de anillo de sello.', datos: ['Por encima de él, entre el cricoides y el tiroides, está la membrana cricotiroidea: por ella se hace la cricotiroidotomía de urgencia.'] },
  Arytenoid_cartilage: { descripcion: 'Par de cartílagos piramidales sobre el cricoides. Sus movimientos abren y cierran las cuerdas vocales.', datos: [] },
  Epiglottis: { descripcion: 'Lámina de cartílago elástico con forma de hoja que cierra la entrada de la laringe al tragar, para que los alimentos vayan al esófago.', datos: ['Su inflamación (epiglotitis) puede obstruir la vía aérea.'] },
  Mucosa_of_nasal_cavity: { descripcion: 'Revestimiento de la cavidad nasal, muy irrigado, que calienta, humedece y filtra el aire inspirado.', datos: ['En su techo está la mucosa olfatoria.'] },
  Nasopharynx: { descripcion: 'Parte superior de la faringe, detrás de las fosas nasales.', datos: ['En ella desembocan las trompas auditivas y están las adenoides.'] },
  // ── Digestivo ──
  Tongue: { descripcion: 'Órgano muscular de la boca que mueve los alimentos al masticar y al tragar, y que permite hablar. En su superficie están las papilas gustativas.', datos: ['Sus músculos los inerva el nervio hipogloso (XII), salvo el palatogloso, que depende del vago (X).'] },
  Parotid_gland: { descripcion: 'La mayor de las glándulas salivales, delante y debajo de la oreja. Vierte la saliva en la boca a la altura del segundo molar superior.', datos: ['Se inflama en las paperas.', 'El nervio facial la atraviesa.'] },
  Submandibular_gland: { descripcion: 'Glándula salival bajo la mandíbula que produce la mayor parte de la saliva en reposo.', datos: ['Es frecuente que en ella se formen cálculos (sialolitos).'] },
  Sublingual_gland: { descripcion: 'La más pequeña de las glándulas salivales mayores, bajo la lengua.', datos: [] },
  Soft_palate: { descripcion: 'Parte posterior y muscular del paladar. Al tragar cierra el paso hacia la nariz.', datos: [] },
  Uvula_of_palate: { descripcion: 'Prolongación cónica que cuelga del centro del borde posterior del paladar blando.', datos: [] },
  Oropharynx: { descripcion: 'Parte media de la faringe, detrás de la boca, por donde pasan tanto el aire como los alimentos.', datos: ['En sus paredes están las amígdalas palatinas.'] },
  Laryngopharynx: { descripcion: 'Parte inferior de la faringe, también llamada hipofaringe; es la parte de la garganta que se continúa con el esófago.', datos: [] },
  Oesophagus: { descripcion: 'Tubo muscular de unos 25 cm que lleva los alimentos de la faringe al estómago, atravesando el tórax y el diafragma.', datos: ['Los alimentos avanzan por él gracias a ondas de contracción (peristaltismo).', 'El reflujo de ácido desde el estómago produce ardor (pirosis).'] },
  Stomach: { descripcion: 'Dilatación del tubo digestivo bajo el diafragma, a la izquierda. Almacena los alimentos y los mezcla con ácido y enzimas hasta formar el quimo.', datos: ['En el adulto puede llegar a contener de 2 a 4 litros.'] },
  Mucosa_of_stomach: { descripcion: 'Capa interna del estómago, con pliegues y glándulas que producen ácido clorhídrico, enzimas y moco protector.', datos: ['La bacteria Helicobacter pylori puede dañarla y causar úlceras.'] },
  Duodenum: { descripcion: 'Primer tramo del intestino delgado: un tubo en forma de C de 25 a 38 cm.', datos: ['En él desembocan la bilis y el jugo pancreático.'] },
  Jejunum: { descripcion: 'Tramo del intestino delgado que sigue al duodeno, con muchos pliegues circulares; su revestimiento está especializado en absorber los nutrientes.', datos: [] },
  Ascending_colon: { descripcion: 'Tramo del intestino grueso que sube por el lado derecho del abdomen.', datos: [] },
  Transverse_colon: { descripcion: 'Tramo del intestino grueso que cruza el abdomen de derecha a izquierda, colgado del mesocolon transverso.', datos: [] },
  Descending_colon: { descripcion: 'Tramo del intestino grueso que baja por el lado izquierdo del abdomen.', datos: [] },
  Sigmoid_colon: { descripcion: 'Tramo final del colon, en forma de S, que continúa con el recto.', datos: ['Es una zona frecuente de divertículos.'] },
  Vermiform_appendix: { descripcion: 'Pequeño tubo ciego que sale del ciego, al principio del intestino grueso, en la parte inferior derecha del abdomen.', datos: ['En la apendicitis, el dolor puede empezar alrededor del ombligo y, al cabo de unas horas, suele pasar a la parte inferior derecha del abdomen.'] },
  Liver: { descripcion: 'El órgano interno más grande (unos 1,5 kg). Elimina sustancias tóxicas, fabrica proteínas, produce la bilis y almacena nutrientes como la glucosa y el glucógeno.', datos: ['En personas sanas puede regenerar hasta la mitad de su masa en 30 días.'] },
  Gallbladder: { descripcion: 'Saco con forma de pera bajo el hígado que almacena y concentra la bilis, y la vacía al duodeno tras las comidas grasas.', datos: ['Los cálculos biliares se forman en ella.'] },
  Bile_duct: { descripcion: 'Conducto formado por la unión del conducto hepático común y el cístico; termina uniéndose al conducto pancreático en la ampolla de Vater.', datos: ['Su obstrucción produce ictericia (piel y ojos amarillos).'] },
  Pancreas: { descripcion: 'Glándula del abdomen que se extiende desde detrás del estómago hasta la parte alta e izquierda del abdomen, cerca del bazo. Produce jugo digestivo que vierte al duodeno y hormonas como la insulina y el glucagón.', datos: ['Su parte hormonal son los islotes de Langerhans.'] },
  Pancreatic_duct: { descripcion: 'Conducto principal del páncreas; se une al colédoco justo antes de la ampolla de Vater y ambos desembocan en la segunda porción del duodeno.', datos: [] },
  Greater_omentum: { descripcion: 'Gran pliegue de peritoneo con grasa que cuelga del estómago como un delantal sobre los intestinos.', datos: ['En 1906 el cirujano James Rutherford Morison lo llamó el «policía del abdomen».'] },
  Lesser_omentum: { descripcion: 'Pliegue de peritoneo que une el estómago y el duodeno con el hígado.', datos: [] },
  // ── Urinario ──
  Kidney: { descripcion: 'Órgano par con forma de judía, de unos 12 cm de largo, situado en el espacio retroperitoneal, a ambos lados de la columna; el izquierdo está aproximadamente entre las vértebras T12 y L3. En un adulto, cada día pasan por los glomérulos más de 150 litros de líquido, y se reabsorbe el 99 % del agua filtrada.', datos: ['El riñón derecho suele estar algo más bajo que el izquierdo por la posición del hígado.', 'Cada riñón tiene alrededor de un millón de nefronas, sus unidades estructurales y funcionales.', 'También fabrica hormonas como la eritropoyetina y la renina, y convierte un precursor de la vitamina D en su forma activa, el calcitriol.'] },
  Renal_pelvis: { descripcion: 'Embudo dentro del riñón donde se reúnen los cálices. Recoge la orina y la vierte en el uréter.', datos: ['Un cálculo grande, «en asta de ciervo», puede obstruirla en todo o en parte.'] },
  Ureter: { descripcion: 'Tubo muscular de unos 20 a 30 cm que lleva la orina de cada riñón a la vejiga mediante ondas de contracción (peristaltismo).', datos: ['Hay tres puntos donde los cálculos suelen atascarse: la unión con la pelvis renal, el cruce con los vasos ilíacos y la entrada en la vejiga.', 'El cólico renal es el dolor intenso que produce un cálculo al avanzar por él.'] },
  Urinary_bladder: { descripcion: 'Órgano muscular hueco, detrás del pubis, que almacena la orina hasta que se expulsa.', datos: ['En un adulto suele contener de 300 a 500 ml antes de que aparezcan las ganas de orinar, pero puede contener bastante más.', 'Su pared es el músculo detrusor, que se contrae al orinar.'] },
  Urethra: { descripcion: 'Conducto que lleva la orina desde la vejiga al exterior. En el hombre mide unos 18 a 20 cm, atraviesa la próstata y el pene, y también da salida al semen.', datos: ['En el hombre se divide en cuatro porciones: preprostática, prostática, membranosa y esponjosa.', 'La uretra femenina mide solo unos 4 cm; por eso las infecciones urinarias son más frecuentes en las mujeres.'] },
  // ── Genital masculino ──
  Testis: { descripcion: 'Glándula sexual masculina, alojada en el escroto; en el adulto mide hasta unos 5 × 2 × 3 cm. Produce los espermatozoides y la testosterona.', datos: ['Se ha propuesto que está fuera del abdomen porque los espermatozoides se forman mejor a una temperatura algo inferior a la del cuerpo.', 'Permanece en el abdomen hasta el séptimo mes de gestación, cuando desciende al escroto; si no lo hace se habla de criptorquidia.'] },
  Epididymis: { descripcion: 'Conducto muy enrollado, pegado a la parte posterior del testículo, que estirado mediría unos 6 m. En él maduran y se almacenan los espermatozoides.', datos: ['Al recorrerlo, los espermatozoides adquieren la capacidad de moverse.'] },
  Ductus_deferens: { descripcion: 'Conducto muscular de 30 a 35 cm que lleva los espermatozoides del epidídimo a la uretra. Sube por el cordón espermático y atraviesa el conducto inguinal para llegar a la cavidad pélvica.', datos: ['La vasectomía consiste en cortarlo o ligarlo.'] },
  Ejaculatory_duct: { descripcion: 'Conducto formado por la unión del conducto deferente y el de la vesícula seminal. Atraviesa la próstata y desemboca en la uretra.', datos: [] },
  Seminal_gland: { descripcion: 'Glándula par, tubular y contorneada, situada detrás de la vejiga; también se llama vesícula seminal. Produce la mayor parte del líquido del semen, rico en fructosa, que da energía a los espermatozoides.', datos: ['Las dos vesículas aportan alrededor del 70 % del semen.'] },
  Prostate: { descripcion: 'Glándula del tamaño de una nuez, bajo la vejiga, que rodea el primer tramo de la uretra. Produce parte del líquido del semen.', datos: ['Con la edad suele crecer (hiperplasia benigna de próstata) y dificultar la salida de la orina.', 'Se puede palpar a través del recto (tacto rectal).'] },
  Corpus_cavernosum_of_penis: { descripcion: 'Par de cuerpos de tejido eréctil que recorren el pene a lo largo. Al llenarse de sangre producen la erección.', datos: ['En este modelo los dos cuerpos cavernosos forman una sola pieza.'] },
  Corpus_spongiosum_of_penis: { descripcion: 'Cilindro de tejido eréctil en la cara inferior del pene, que rodea la uretra. Su extremo forma el glande.', datos: ['Su parte proximal se ensancha y forma el bulbo, en el que entra la uretra más cerca de su cara superior que de la inferior.'] },
  Glans_penis: { descripcion: 'Extremo ensanchado del cuerpo esponjoso, en la punta del pene, donde se abre la uretra.', datos: [] },
  // ── Genitales femeninos y mama ──
  Uterus: { descripcion: 'Órgano muscular con forma de pera, de unos 7,6 cm de largo, situado justo detrás de la vejiga y delante del colon sigmoide. Se divide en fondo, cuerpo, cuello (cérvix) y conducto cervical; el cuello sobresale dentro de la vagina. Su capa interna, el endometrio, se renueva en cada ciclo menstrual.', datos: ['Suele estar en anteversión y anteflexión: inclinado hacia delante sobre la vejiga.', 'Un útero adulto típico pesa unos 60 g.', 'En el parto se contrae con fuerza mientras se dilata el cuello, hasta la salida del bebé.'] },
  Vagina: { descripcion: 'Conducto elástico y muscular que va de la vulva al cuello del útero, hacia arriba y atrás; su pared anterior mide unos 7,5 cm y la posterior, unos 9 cm. Es el canal del parto y la vía de salida de la menstruación.', datos: ['Sus paredes anterior y posterior están normalmente en contacto, por eso en sección tiene forma de H.', 'El cuello del útero entra en su extremo superior, formando alrededor los fondos de saco (fórnix).'] },
  Ovary: { descripcion: 'Glándula sexual femenina, situada en una depresión de la pared lateral de la pelvis; en la pubertad mide unos 3 × 1,5 × 1 cm. Contiene los folículos con los óvulos y produce estrógenos y progesterona.', datos: ['Al nacer quedan alrededor de un millón de folículos; a lo largo de la vida fértil solo se liberan unos 300 a 400 óvulos.', 'Una vez al mes, uno de los ovarios libera un óvulo maduro (ovulación).'] },
  Uterine_tube: { descripcion: 'Conducto de 10 a 14 cm que va del útero al ovario; tiene cuatro partes (intramural, istmo, ampolla e infundíbulo) y se abre a la cavidad peritoneal rodeado de fimbrias. Recoge el óvulo y lo lleva al útero.', datos: ['La fecundación suele producirse en la ampolla.', 'Si el embrión se implanta en ella se produce un embarazo ectópico.', 'También se llama trompa de Falopio.'] },
  Fimbriae_of_uterine_tube: { descripcion: 'Prolongaciones en forma de flecos del extremo de la trompa uterina, que se mueven sobre el ovario y recogen el óvulo al ser liberado.', datos: [] },
  Ligament_of_ovary: { descripcion: 'Cordón de tejido muscular y fibroso que va del extremo uterino del ovario al lado del útero, justo por debajo de la unión de la trompa con el útero.', datos: [] },
  Round_ligament_of_uterus: { descripcion: 'Cordón que va del ángulo del útero, por el conducto inguinal, hasta el labio mayor. Mantiene el útero inclinado hacia delante.', datos: ['Es el equivalente femenino del gubernáculo del testículo.', 'Cuando el útero crece en el embarazo, los ligamentos redondos pueden estirarse y causar dolor.'] },
  Female_urethra: { descripcion: 'Conducto de unos 4 cm de largo y 6 mm de diámetro, que va del orificio interno de la uretra, en la vejiga, al meato urinario, bajo el clítoris.', datos: ['Por ser tan corta, las infecciones urinarias son mucho más frecuentes en las mujeres.', 'Se abre entre el clítoris y el orificio de la vagina.'] },
  Glans_of_clitoris: { descripcion: 'Extremo anterior del clítoris, en la parte delantera de su cuerpo; suele tener el tamaño y la forma de un guisante. Se calcula que tiene 8000 o incluso 10 000 terminaciones nerviosas sensitivas o más, lo que lo convierte en la zona erógena más sensible.', datos: ['Es homólogo del glande del pene.'] },
  Body_of_clitoris: { descripcion: 'Parte del clítoris formada por dos estructuras eréctiles, los cuerpos cavernosos.', datos: [] },
  Crus_of_clitoris: { descripcion: 'Cada una de las dos ramas del clítoris, que se unen a las ramas del pubis y convergen en su cuerpo; junto con los bulbos del vestíbulo forman la raíz del clítoris.', datos: ['Las cubre el músculo isquiocavernoso.'] },
  Bulb_of_vestibule: { descripcion: 'Masa alargada de tejido eréctil, una a cada lado del orificio de la vagina. Se llena de sangre durante la excitación.', datos: ['Es el equivalente del bulbo del pene.', 'Lo cubre el músculo bulboesponjoso.'] },
  Greater_vestibular_gland: { descripcion: 'Glándula del tamaño de un guisante detrás de cada bulbo del vestíbulo. Segrega moco para lubricar la vagina.', datos: ['También se llama glándula de Bartolino; la obstrucción de su conducto forma un quiste.'] },
  Duct_of_greater_vestibular_gland: { descripcion: 'Conducto de 1,5 a 2 cm que lleva la secreción de la glándula vestibular mayor. Se abre a cada lado del orificio vaginal, en un surco entre el himen y el labio menor, a las 4 y a las 8 si se mira el orificio como la esfera de un reloj.', datos: ['Si se obstruye, la secreción se acumula y forma un quiste de Bartolino.'] },
  Mammary_gland: { descripcion: 'Glándula de la mama, formada por 14 a 18 lóbulos irregulares que convergen en el pezón, envueltos en grasa. Se apoya sobre el músculo pectoral mayor, de la 2.ª a la 6.ª costilla, y puede extenderse hasta la axila.', datos: ['La sostienen los ligamentos suspensorios (de Cooper).', 'La mayor parte de su linfa, alrededor del 75 %, drena a los nodos de la axila.'] },
  Lactiferous_ducts: { descripcion: 'Conductos que llevan la leche de cada lóbulo de la glándula mamaria al pezón.', datos: [] },
  Fat_of_breast: { descripcion: 'Grasa que rodea la glándula mamaria bajo la piel y le da a la mama su forma. La proporción de los tejidos de la mama varía de una mujer a otra.', datos: ['Cuando bajan los estrógenos, la mama puede reducirse: la grasa y las glándulas se atrofian.', 'No tiene un término propio en la Terminologia Anatomica: su nombre latino aquí es descriptivo.'] },
  Suspensory_ligaments_of_breast: { descripcion: 'Tabiques de tejido conjuntivo que van de la clavícula y la fascia clavipectoral, a través del tejido de la mama, hasta la piel que la cubre. Sostienen la mama en su posición y mantienen su forma.', datos: ['También se llaman ligamentos de Cooper.', 'Si un tumor los acorta, tiran de la piel y la hunden (retracción cutánea).'] },
  // ── Endocrino ──
  Thyroid_gland: { descripcion: 'Glándula con forma de mariposa en la parte anterior del cuello, delante de la tráquea y bajo la laringe. Produce las hormonas tiroideas (T3 y T4), que regulan el metabolismo, y la calcitonina.', datos: ['Necesita yodo para fabricar sus hormonas; la falta de yodo causa más del 90 % de los bocios en el mundo.', 'Como está unida a los cartílagos tiroides y cricoides, sube y baja con ellos al tragar.', 'Sus dos lóbulos se unen por un istmo que va del segundo al tercer anillo de la tráquea.'] },
  Superior_parathyroid_gland: { descripcion: 'Glándula pequeña con forma de lenteja, de unos 6 mm de largo, en la cara posterior de la tiroides. Las paratiroides, normalmente cuatro, producen la hormona paratiroidea (PTH), que eleva el calcio de la sangre.', datos: ['Pueden dañarse al operar la tiroides; entonces baja el calcio (hipocalcemia) y aparecen calambres y hormigueo.'] },
  Suprarenal_gland: { descripcion: 'Glándula situada encima de cada riñón, un poco hacia dentro. Su corteza produce cortisol, aldosterona y andrógenos; su médula, adrenalina y noradrenalina.', datos: ['La derecha tiene forma de pirámide y la izquierda, de media luna; la izquierda es algo mayor.', 'Las catecolaminas de su médula, como la adrenalina, producen una respuesta rápida de todo el cuerpo ante el estrés.'] },
  Adenohypophysis: { descripcion: 'Lóbulo anterior de la hipófisis. Produce las hormonas que controlan la tiroides, las suprarrenales y las gónadas, además de la hormona del crecimiento y la prolactina.', datos: ['El hipotálamo la controla mediante una red propia de vasos sanguíneos (sistema porta hipofisario).', 'La hipófisis descansa en la silla turca del hueso esfenoides.'] },
  Neurohypophysis: { descripcion: 'Lóbulo posterior de la hipófisis, formado por prolongaciones de neuronas del hipotálamo. Libera a la sangre la oxitocina y la hormona antidiurética (vasopresina).', datos: ['La hormona antidiurética hace que el riñón ahorre agua.'] },
  Pineal_gland: { descripcion: 'Pequeña glándula con forma de piña en el centro del encéfalo, detrás del tercer ventrículo. Produce melatonina, que ayuda a regular el ciclo de sueño y vigilia.', datos: ['Su secreción aumenta en la oscuridad.', 'Con la edad suele calcificarse y se ve en las radiografías.'] },
  // ── Linfático ──
  Spleen: { descripcion: 'Órgano de 7 a 14 cm de largo, bajo la parte izquierda del diafragma, por debajo de las costillas 9.ª a 11.ª. Filtra la sangre, retira los glóbulos rojos viejos y participa en la defensa frente a infecciones.', datos: ['Su extirpación (esplenectomía) aumenta el riesgo de algunas infecciones graves, como la sepsis.'] },
  Left_lobe_of_thymus: { descripcion: 'Lóbulo del timo, órgano linfoide situado en la parte alta y anterior del tórax, detrás del esternón y delante del corazón. En él maduran los linfocitos T.', datos: ['Desde el comienzo de la adolescencia se reduce y su tejido se va sustituyendo por grasa.'] },
  Palatine_tonsil: { descripcion: 'Masa de tejido linfoide a cada lado de la garganta, entre los arcos del paladar. Es la «amígdala» que se ve al abrir la boca; en la terminología anatómica se llama tonsila palatina.', datos: ['Forma parte del anillo de Waldeyer, a la entrada de las vías respiratoria y digestiva, que protege al cuerpo de lo que entra por las mucosas.', 'Su inflamación es la amigdalitis.'] },
  // Nodos con datos propios (la descripción general es la del tejido).
  Supraclavicular_nodes: { datos: ['El nodo supraclavicular izquierdo (nodo de Virchow) recibe linfa de la cavidad abdominal; su aumento puede deberse a un cáncer del abdomen que se ha extendido por los vasos linfáticos.'] },
  Jugulodigastric_node: { datos: ['Es de los primeros nodos que reciben la linfa de la cara, la boca, la faringe y las amígdalas; en la amigdalitis suele estar aumentado.'] },
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
  VISCERAS[k] = { descripcion: `Segmento ${n} del hígado. ${COUINAUD}`, datos: n === 'I' ? ['El segmento I (lóbulo caudado) drena directamente a la vena cava inferior.'] : ['En las hepatectomías anatómicas, la línea de resección sigue los límites de uno o varios segmentos.'] };
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
  const tejidoKey = TEJIDO[x.tissue] ? x.tissue : 'mucosa';
  const tejido = TEJIDO[tejidoKey];
  const group = [...region].reverse().map((g) => GRUPOS[g]).find(Boolean);
  return {
    key: x.name_en,
    side,
    title: cap(x.name_es || x.name_en),
    latin: x.name_la || null,
    tissue: null,
    chips: [tejido.tipo, side && (side === 'L' ? 'Lado izquierdo' : 'Lado derecho')].filter(Boolean),
    fields: [group && { label: 'Región', value: group.nombreEs ?? group.nombre }].filter(Boolean),
    entry: {
      descripcion: own?.descripcion ?? tejido.descripcion,
      etimologia: latinEtymology(x.name_la),
    },
    datos: [...(own?.datos ?? []), ...(own?.descripcion ? [] : tejido.datos ?? [])],
    source: x.source ?? null,
    // Las del tejido solo si su descripción (y sus puntos clave) son los que se ven.
    fuentes: fuentesViscera(key, tejidoKey, !own?.descripcion),
  };
}
