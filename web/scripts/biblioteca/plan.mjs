// Plan de la biblioteca de estudio (2026-11-09): las lecciones previstas, con su lugar, sus sistemas y sus temas. Es el
// mapa de lo que se quiere cubrir antes de escribirlo; scripts/biblioteca.mjs lo cruza con las lecciones que existen
// (src/biblioteca/lecciones/ y los módulos antiguos) para decir qué está disponible y qué falta.
// Cada lección tiene un propósito propio: no hay dos que estudien lo mismo con otro título.

const MS = 'miembro-superior';
const MI = 'miembro-inferior';
const P = (id, titulo, lugares, sistemas, formato, temas) => ({ id, titulo, lugares, sistemas, formato, temas });

export const PLAN = [
  // Fundamentos
  P('fund-orientacion', 'Posición anatómica, planos y términos de dirección', [], [], 'fundamentos', []),
  P('fund-movimientos', 'Términos de movimiento', [], ['articular', 'muscular'], 'fundamentos', ['movimientos', 'articulaciones']),
  // Visión general de cada sistema
  P('sis-oseo', 'El esqueleto: axial y apendicular', [], ['oseo'], 'vision-general', ['huesos']),
  P('sis-articular', 'Tipos de articulaciones', [], ['articular'], 'vision-general', ['articulaciones']),
  P('sis-muscular', 'El músculo esquelético: origen, inserción, acción e inervación', [], ['muscular'], 'vision-general', ['musculos', 'movimientos']),
  P('sis-nervioso', 'Organización del sistema nervioso', [], ['nervioso'], 'vision-general', ['nervios']),
  P('sis-cardiovascular', 'Corazón y circulación', [], ['cardiovascular'], 'vision-general', ['arterias-venas']),
  P('sis-linfatico', 'El sistema linfático', [], ['linfatico'], 'vision-general', ['organos']),
  P('sis-respiratorio', 'Vías respiratorias y pulmones', [['cuello', 'visceras-cuello'], ['torax', 'pulmones-pleura']], ['respiratorio'], 'vision-general', ['organos']),
  P('sis-digestivo', 'Tubo digestivo y glándulas anexas', [['abdomen', 'organos-abdominales']], ['digestivo'], 'vision-general', ['organos']),
  P('sis-urinario', 'Riñones, uréteres, vejiga y uretra', [['abdomen', 'retroperitoneo'], ['pelvis', 'organos-pelvicos']], ['urinario'], 'vision-general', ['organos']),
  P('sis-reproductor-masculino', 'Sistema reproductor masculino', [['pelvis', 'organos-pelvicos'], ['pelvis', 'perine']], ['reproductor-masculino'], 'vision-general', ['organos']),
  P('sis-reproductor-femenino', 'Sistema reproductor femenino', [['pelvis', 'organos-pelvicos'], ['pelvis', 'perine'], ['torax', 'mama']], ['reproductor-femenino'], 'vision-general', ['organos']),
  P('sis-endocrino', 'Glándulas endocrinas', [], ['endocrino'], 'vision-general', ['organos']),
  P('sis-tegumentario', 'La piel', [], ['tegumentario'], 'vision-general', ['organos']),
  P('sis-sentidos', 'Órganos de los sentidos', [['cabeza', 'orbita-ojo'], ['cabeza', 'oido']], ['sentidos'], 'vision-general', ['organos']),
  // Cabeza
  P('cab-craneo', 'Huesos del cráneo y suturas', [['cabeza', 'craneo']], ['oseo', 'articular'], 'estructuras', ['huesos', 'accidentes-oseos']),
  P('cab-cara-huesos', 'Huesos de la cara y mandíbula', [['cabeza', 'cara']], ['oseo'], 'estructuras', ['huesos']),
  P('cab-musculos-cara', 'Músculos de la expresión facial', [['cabeza', 'cara']], ['muscular', 'nervioso'], 'estructuras', ['musculos']),
  P('cab-masticacion', 'Músculos de la masticación y articulación temporomandibular', [['cabeza', 'cara']], ['muscular', 'articular'], 'estructuras', ['musculos', 'articulaciones', 'movimientos']),
  P('cab-ojo', 'Órbita, globo ocular y músculos extraoculares', [['cabeza', 'orbita-ojo']], ['sentidos', 'muscular', 'nervioso'], 'estructuras', ['musculos', 'organos']),
  P('cab-oido', 'Oído externo, medio e interno', [['cabeza', 'oido']], ['sentidos', 'oseo'], 'estructuras', ['organos', 'huesos']),
  P('cab-nariz', 'La nariz y la cavidad nasal', [['cabeza', 'cavidad-nasal']], ['respiratorio', 'oseo', 'sentidos'], 'estructuras', ['organos', 'huesos']),
  P('cab-encefalo', 'Partes del encéfalo', [['cabeza', 'encefalo']], ['nervioso'], 'estructuras', ['organos']),
  P('cab-surcos-lateral', 'Surcos y giros de la cara lateral', [['cabeza', 'encefalo']], ['nervioso'], 'estructuras', ['organos', 'nervios']),
  P('cab-surcos-medial', 'Surcos y giros de las caras medial e inferior', [['cabeza', 'encefalo']], ['nervioso'], 'estructuras', ['organos', 'nervios']),
  P('cab-nervios-craneales', 'Los doce nervios craneales', [['cabeza', null]], ['nervioso'], 'trayectos', ['nervios']),
  P('cab-arterias-encefalo', 'Arterias del encéfalo', [['cabeza', 'encefalo']], ['cardiovascular'], 'trayectos', ['arterias-venas']),
  P('cab-arterias-corticales', 'Las ramas de las arterias del encéfalo', [['cabeza', 'encefalo']], ['cardiovascular'], 'trayectos', ['arterias-venas']),
  P('cab-senos-venosos', 'La duramadre y los senos venosos', [['cabeza', 'encefalo']], ['cardiovascular', 'nervioso'], 'trayectos', ['arterias-venas']),
  P('cab-nucleos-basales', 'Núcleos basales y diencéfalo', [['cabeza', 'encefalo']], ['nervioso'], 'estructuras', ['organos', 'nervios']),
  P('cab-limbico', 'El sistema límbico', [['cabeza', 'encefalo']], ['nervioso'], 'estructuras', ['organos', 'nervios']),
  P('cab-tronco-encefalo', 'El tronco del encéfalo: relieves y núcleos de los nervios craneales', [['cabeza', 'encefalo']], ['nervioso'], 'estructuras', ['nervios']),
  P('cab-boca', 'Boca: dientes, lengua y glándulas salivales', [['cabeza', 'cavidad-oral']], ['digestivo'], 'estructuras', ['organos']),
  // Cuello
  P('cue-musculos', 'Músculos del cuello y hueso hioides', [['cuello', 'musculos-cuello']], ['muscular', 'oseo'], 'estructuras', ['musculos', 'huesos']),
  P('cue-visceras', 'Vísceras del cuello: laringe, faringe, tráquea y tiroides', [['cuello', 'visceras-cuello']], ['respiratorio', 'digestivo', 'endocrino'], 'topografia', ['organos']),
  P('cue-vasos', 'Carótidas y yugulares', [['cuello', 'vasos-nervios-cuello']], ['cardiovascular'], 'trayectos', ['arterias-venas']),
  // Espalda
  P('esp-columna', 'Columna vertebral', [['espalda', 'columna']], ['oseo', 'articular'], 'estructuras', ['huesos', 'accidentes-oseos', 'articulaciones']),
  P('esp-musculos', 'Músculos de la espalda', [['espalda', 'musculos-espalda']], ['muscular'], 'estructuras', ['musculos']),
  P('esp-medula', 'Médula espinal, meninges y nervios espinales', [['espalda', 'medula']], ['nervioso'], 'estructuras', ['nervios']),
  // Tórax
  P('tor-caja', 'Caja torácica: esternón, costillas y cartílagos', [['torax', 'pared-toracica']], ['oseo', 'articular'], 'estructuras', ['huesos']),
  P('tor-respiracion', 'Músculos de la respiración: diafragma e intercostales', [['torax', 'diafragma'], ['torax', 'pared-toracica']], ['muscular', 'respiratorio'], 'estructuras', ['musculos', 'movimientos']),
  P('tor-corazon', 'El corazón: cavidades, válvulas y vasos coronarios', [['torax', 'corazon']], ['cardiovascular'], 'estructuras', ['organos', 'arterias-venas']),
  P('tor-pulmones', 'Pulmones, bronquios y pleura', [['torax', 'pulmones-pleura']], ['respiratorio'], 'estructuras', ['organos']),
  P('tor-mediastino', 'Mediastino', [['torax', 'mediastino']], ['cardiovascular', 'respiratorio', 'digestivo', 'nervioso', 'linfatico'], 'topografia', ['organos']),
  P('tor-pared-vasos', 'Vasos y nervios de la pared del tórax', [['torax', 'pared-toracica'], ['torax', 'mediastino']], ['cardiovascular', 'nervioso'], 'trayectos', ['arterias-venas', 'nervios']),
  P('tor-segmentos', 'Segmentos broncopulmonares: bronquios, arterias y venas', [['torax', 'pulmones-pleura'], ['torax', 'mediastino']], ['respiratorio', 'cardiovascular'], 'estructuras', ['organos', 'arterias-venas']),
  P('tor-linfaticos', 'Nodos linfáticos del tórax', [['torax', 'mediastino']], ['linfatico'], 'topografia', ['organos']),
  // Abdomen
  P('abd-pared', 'Pared abdominal anterolateral', [['abdomen', 'pared-abdominal']], ['muscular'], 'estructuras', ['musculos']),
  P('abd-tubo-digestivo', 'Estómago, intestino y peritoneo', [['abdomen', 'organos-abdominales'], ['abdomen', 'peritoneo']], ['digestivo'], 'estructuras', ['organos']),
  P('abd-higado-pancreas', 'Hígado, vesícula biliar, páncreas y bazo', [['abdomen', 'organos-abdominales']], ['digestivo', 'linfatico'], 'estructuras', ['organos']),
  P('abd-rinones', 'Riñones y glándulas suprarrenales', [['abdomen', 'retroperitoneo']], ['urinario', 'endocrino'], 'topografia', ['organos']),
  P('abd-vasos', 'Aorta abdominal, vena cava inferior y vena porta', [['abdomen', 'vasos-nervios-abdomen']], ['cardiovascular'], 'trayectos', ['arterias-venas']),
  P('abd-peritoneo', 'La cavidad abdominal y el peritoneo', [['abdomen', 'peritoneo']], ['digestivo'], 'topografia', ['organos']),
  // Pelvis y periné
  P('pel-pelvis-osea', 'Pelvis ósea', [['pelvis', 'pelvis-osea'], [MI, 'cintura-pelvica']], ['oseo', 'articular'], 'estructuras', ['huesos', 'accidentes-oseos']),
  P('pel-suelo', 'Suelo pélvico y periné', [['pelvis', 'suelo-pelvico'], ['pelvis', 'perine']], ['muscular'], 'estructuras', ['musculos']),
  P('pel-vasos', 'Arterias y venas de la pelvis', [['pelvis', 'vasos-nervios-pelvis']], ['cardiovascular'], 'trayectos', ['arterias-venas']),
  P('pel-nervios-linfaticos', 'Nervios y nodos linfáticos de la pelvis', [['pelvis', 'vasos-nervios-pelvis']], ['nervioso', 'linfatico'], 'trayectos', ['nervios']),
  // Miembro superior
  P('ms-cintura-escapular', 'Clavícula y escápula', [[MS, 'cintura-escapular']], ['oseo', 'articular'], 'estructuras', ['huesos', 'accidentes-oseos']),
  P('ms-hombro-musculos', 'Músculos del hombro: deltoides y manguito rotador', [[MS, 'hombro'], [MS, 'cintura-escapular']], ['muscular'], 'estructuras', ['musculos', 'movimientos', 'nervios']),
  P('ms-hombro-articulacion', 'Articulación del hombro', [[MS, 'hombro']], ['articular'], 'articulacion', ['articulaciones']),
  P('ms-axila', 'La axila', [[MS, 'axila']], ['cardiovascular', 'nervioso', 'linfatico'], 'topografia', ['arterias-venas', 'nervios']),
  P('brazo', 'El brazo: compartimentos anterior y posterior', [[MS, 'brazo']], ['muscular', 'oseo', 'nervioso', 'cardiovascular'], 'estructuras', ['musculos', 'compartimentos']),
  P('ms-codo', 'El codo y la fosa cubital', [[MS, 'codo']], ['articular'], 'articulacion', ['articulaciones']),
  P('antebrazo', 'El antebrazo: compartimento anterior', [[MS, 'antebrazo']], ['muscular', 'oseo', 'nervioso', 'cardiovascular'], 'estructuras', ['musculos', 'compartimentos']),
  P('ms-antebrazo-posterior', 'El antebrazo: compartimento posterior', [[MS, 'antebrazo']], ['muscular'], 'estructuras', ['musculos', 'compartimentos']),
  P('ms-mano-huesos', 'Huesos de la muñeca y la mano', [[MS, 'muneca'], [MS, 'mano']], ['oseo'], 'estructuras', ['huesos']),
  P('ms-mano-musculos', 'Músculos de la mano', [[MS, 'mano']], ['muscular'], 'estructuras', ['musculos']),
  P('ms-nervios', 'Plexo braquial y nervios del miembro superior', [[MS, null]], ['nervioso'], 'trayectos', ['nervios']),
  P('ms-vasos', 'Arterias y venas del miembro superior', [[MS, null]], ['cardiovascular'], 'trayectos', ['arterias-venas']),
  // Miembro inferior
  P('mi-glutea', 'Región glútea', [[MI, 'glutea']], ['muscular', 'nervioso'], 'estructuras', ['musculos']),
  P('mi-cadera', 'Articulación de la cadera', [[MI, 'cadera']], ['articular'], 'articulacion', ['articulaciones']),
  P('mi-huesos', 'Fémur, rótula, tibia y fíbula', [[MI, 'muslo'], [MI, 'rodilla'], [MI, 'pierna']], ['oseo'], 'estructuras', ['huesos', 'accidentes-oseos']),
  P('mi-muslo-anterior-medial', 'Muslo: compartimentos anterior y medial', [[MI, 'muslo']], ['muscular'], 'estructuras', ['musculos', 'compartimentos']),
  P('mi-muslo-posterior', 'Muslo: compartimento posterior', [[MI, 'muslo']], ['muscular'], 'estructuras', ['musculos', 'compartimentos']),
  P('mi-rodilla', 'Articulación de la rodilla', [[MI, 'rodilla']], ['articular'], 'articulacion', ['articulaciones']),
  P('mi-pierna-anterior-lateral', 'Pierna: compartimentos anterior y lateral', [[MI, 'pierna']], ['muscular'], 'estructuras', ['musculos', 'compartimentos']),
  P('mi-pierna-posterior', 'Pierna: compartimento posterior', [[MI, 'pierna']], ['muscular'], 'estructuras', ['musculos', 'compartimentos']),
  P('mi-pie-huesos-tobillo', 'Huesos del pie y articulación del tobillo', [[MI, 'tobillo'], [MI, 'pie']], ['oseo', 'articular'], 'estructuras', ['huesos', 'articulaciones']),
  P('mi-pie-musculos', 'Músculos del pie', [[MI, 'pie']], ['muscular'], 'estructuras', ['musculos']),
  P('mi-nervios', 'Nervios del miembro inferior', [[MI, null]], ['nervioso'], 'trayectos', ['nervios']),
  P('mi-vasos', 'Arterias y venas del miembro inferior', [[MI, null]], ['cardiovascular'], 'trayectos', ['arterias-venas']),
  // Comparación
  P('comp-miembro-superior', 'Confusiones frecuentes del miembro superior', [[MS, null]], ['muscular', 'oseo', 'nervioso', 'cardiovascular'], 'comparacion', ['confusiones']),
  P('comp-miembro-inferior', 'Confusiones frecuentes del miembro inferior', [[MI, null]], ['muscular', 'oseo', 'cardiovascular'], 'comparacion', ['confusiones']),
];
