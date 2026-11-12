// Limitaciones conocidas del modelo 3D: piezas mal situadas, de identidad dudosa o incompletas. Sin DOM: lo usan la
// ficha de la pieza (ui/info.js), la biblioteca de estudio (biblioteca/evaluar.js y ui/biblioteca/), Neuri (server/) y
// las pruebas. Un aviso o una restricción NO corrigen la geometría: solo evitan que la app presente como fiable, o
// puntúe, lo que el modelo muestra mal. Cómo se comprobó cada una: docs/revision/limitaciones-modelo/hallazgos.md; cómo
// añadir o retirar una: docs/estudio/limitaciones-modelo.md. `node scripts/limitaciones.mjs --comprobar` lo valida.
//
// Cada limitación:
//   id          identificador estable (minúsculas y guiones)
//   piezas      nombres de las mallas sin el lado («Paracentral_sulcus»), como en el inventario y en las lecciones
//   lados       lados afectados ('L', 'R'); [] si la pieza no tiene lado
//   modelos     modelos en los que se comprobó ('male', 'female'); en el otro no se presupone nada
//   tipo        'ubicacion' (la pieza está en otro sitio) · 'identidad' (su nombre es dudoso) · 'incompleta' (falta parte)
//   estado      'confirmada' (se ve en la geometría) · 'sospechosa' (pendiente de revisión)
//   comprobada  fecha; recurso: { modelo: 'archivo@blob de git' } de lo que se examinó; evidencia: el registro
//   restringe   usos que no se permiten en las preguntas que puntúan: 'identificar' (resaltarla y pedir su nombre),
//               'localizar' (pedir que se toque o ofrecerla para tocar) y 'distractor' (su nombre como opción errónea)
//   aviso       una frase para la ficha (qué le pasa); detalle: qué pasa, para qué sirve y qué uso engaña. Los dos en los
//               cinco idiomas de la interfaz; el contenido se escribe en español y lo demás es traducción sin revisar
//   fuentes     citas literales que respaldan lo que se dice de la anatomía: { f: 'wp:Título', c: cita, revid }
//               (`node scripts/limitaciones.mjs --citas` comprueba cada cita en esa versión de la página)
const T = (es, en, de, fr, it) => ({ es, en, de, fr, it });

export const TIPOS = ['ubicacion', 'identidad', 'incompleta'];
export const ESTADOS = ['confirmada', 'sospechosa'];
export const USOS = ['identificar', 'localizar', 'distractor'];

export const LIMITACIONES = [
  {
    id: 'surco-paracentral-fuera-de-sitio',
    piezas: ['Paracentral_sulcus'],
    lados: ['L', 'R'],
    modelos: ['male', 'female'],
    tipo: 'ubicacion',
    estado: 'confirmada',
    comprobada: '2026-11-09',
    recurso: { male: 'web/public/models/male-nervous.glb@b060d6820ea3', female: 'web/public/models/female-nervous.glb@d2a961b844e1' },
    evidencia: 'docs/revision/limitaciones-modelo/hallazgos.md',
    restringe: ['identificar', 'localizar', 'distractor'],
    aviso: T(
      'Pieza fuera de sitio en el modelo: no sirve para aprender dónde está el surco paracentral.',
      'Misplaced piece in the model: it cannot be used to learn where the paracentral sulcus is.',
      'Falsch platziertes Teil im Modell: Es eignet sich nicht, um zu lernen, wo der Sulcus paracentralis liegt.',
      'Pièce mal placée dans le modèle : elle ne permet pas d’apprendre où se trouve le sillon paracentral.',
      'Pezzo fuori posto nel modello: non serve per imparare dove si trova il solco paracentrale.',
    ),
    detalle: T(
      'El surco paracentral está en la cara medial del hemisferio, junto al lóbulo paracentral: es una rama del surco cingulado. En este modelo, la pieza con ese nombre está en la cara lateral del lóbulo frontal, dentro del giro frontal medio. Indica que el modelo la incluye, no dónde está; por eso no entra en las preguntas de identificar ni de localizar.',
      'The paracentral sulcus lies on the medial surface of the hemisphere, next to the paracentral lobule: it is a branch of the cingulate sulcus. In this model, the piece with that name sits on the lateral surface of the frontal lobe, inside the middle frontal gyrus. It shows that the model includes it, not where it is; that is why it is left out of identify and locate questions.',
      'Der Sulcus paracentralis liegt an der medialen Fläche der Hemisphäre, neben dem Lobulus paracentralis: Er ist ein Ast des Sulcus cinguli. In diesem Modell liegt das Teil mit diesem Namen an der lateralen Fläche des Frontallappens, im Gyrus frontalis medius. Es zeigt, dass das Modell ihn enthält, nicht wo er liegt; deshalb kommt er in Fragen zum Erkennen und Lokalisieren nicht vor.',
      'Le sillon paracentral se trouve sur la face médiale de l’hémisphère, près du lobule paracentral : c’est une branche du sillon cingulaire. Dans ce modèle, la pièce qui porte ce nom se trouve sur la face latérale du lobe frontal, dans le gyrus frontal moyen. Elle indique que le modèle l’inclut, pas où il se trouve ; c’est pourquoi elle est exclue des questions d’identification et de localisation.',
      'Il solco paracentrale si trova sulla faccia mediale dell’emisfero, accanto al lobulo paracentrale: è un ramo del solco del cingolo. In questo modello, il pezzo con quel nome si trova sulla faccia laterale del lobo frontale, nel giro frontale medio. Indica che il modello lo include, non dove si trova; per questo è escluso dalle domande di riconoscimento e localizzazione.',
    ),
    fuentes: [
      { f: 'wp:Paracentral_lobule', c: 'the paracentral lobule is on the medial surface of the cerebral hemisphere', revid: 1296279219 },
      { f: 'wp:Paracentral_lobule', c: 'the paracentral sulcus (branch of the cingulate sulcus)', revid: 1296279219 },
    ],
  },
  {
    id: 'surco-temporal-inferior-nombre-dudoso',
    piezas: ['Inferior_temporal_sulcus'],
    lados: ['L', 'R'],
    modelos: ['male', 'female'],
    tipo: 'identidad',
    estado: 'sospechosa',
    comprobada: '2026-11-09',
    recurso: { male: 'web/public/models/male-nervous.glb@b060d6820ea3', female: 'web/public/models/female-nervous.glb@d2a961b844e1' },
    evidencia: 'docs/revision/limitaciones-modelo/hallazgos.md',
    restringe: ['identificar', 'localizar', 'distractor'],
    aviso: T(
      'Nombre dudoso en el modelo: esta pieza no está donde hoy se describe el surco temporal inferior.',
      'Doubtful name in the model: this piece is not where the inferior temporal sulcus is described today.',
      'Fraglicher Name im Modell: Dieses Teil liegt nicht dort, wo der Sulcus temporalis inferior heute beschrieben wird.',
      'Nom douteux dans le modèle : cette pièce n’est pas là où l’on décrit aujourd’hui le sillon temporal inférieur.',
      'Nome dubbio nel modello: questo pezzo non è dove oggi si descrive il solco temporale inferiore.',
    ),
    detalle: T(
      'Hoy se llama surco temporal inferior al de la cara lateral, que separa el giro temporal inferior del medio. Esta pieza está en la cara inferior del lóbulo temporal, entre el giro temporal inferior y el fusiforme, donde se describe el surco occipitotemporal. Sirve para ver esa zona de la cara inferior; su nombre está pendiente de revisión, así que no entra en las preguntas de identificar ni de localizar.',
      'Today the name inferior temporal sulcus is given to the one on the lateral surface, which separates the inferior temporal gyrus from the middle one. This piece lies on the inferior surface of the temporal lobe, between the inferior temporal and fusiform gyri, where the occipitotemporal sulcus is described. It helps to see that part of the inferior surface; its name is pending review, so it is left out of identify and locate questions.',
      'Heute heißt Sulcus temporalis inferior die Furche an der lateralen Fläche, die den Gyrus temporalis inferior vom mittleren trennt. Dieses Teil liegt an der Unterseite des Schläfenlappens, zwischen dem Gyrus temporalis inferior und dem Gyrus fusiformis, wo der Sulcus occipitotemporalis beschrieben wird. Es hilft, diesen Bereich der Unterseite zu sehen; sein Name wird noch geprüft, deshalb kommt es in Fragen zum Erkennen und Lokalisieren nicht vor.',
      'Aujourd’hui, on appelle sillon temporal inférieur celui de la face latérale, qui sépare le gyrus temporal inférieur du moyen. Cette pièce se trouve sur la face inférieure du lobe temporal, entre le gyrus temporal inférieur et le gyrus fusiforme, là où l’on décrit le sillon occipito-temporal. Elle aide à voir cette partie de la face inférieure ; son nom est en cours de révision, elle est donc exclue des questions d’identification et de localisation.',
      'Oggi si chiama solco temporale inferiore quello della faccia laterale, che separa il giro temporale inferiore da quello medio. Questo pezzo si trova sulla faccia inferiore del lobo temporale, tra il giro temporale inferiore e il giro fusiforme, dove si descrive il solco occipitotemporale. Aiuta a vedere quella parte della faccia inferiore; il suo nome è in revisione, quindi è escluso dalle domande di riconoscimento e localizzazione.',
    ),
    fuentes: [
      { f: 'wp:Inferior_temporal_gyrus', c: 'is separated from the middle temporal gyrus located directly above by the inferior temporal sulcus', revid: 1369116272 },
      { f: 'wp:Inferior_temporal_gyrus', c: 'the inferior temporal gyrus is separated from the fusiform gyrus by the occipital-temporal sulcus', revid: 1369116272 },
    ],
  },
  {
    id: 'arteria-meningea-media-incompleta',
    piezas: ['Middle_meningeal_artery'],
    lados: ['L', 'R'],
    modelos: ['male', 'female'],
    tipo: 'incompleta',
    estado: 'confirmada',
    comprobada: '2026-11-09',
    recurso: { male: 'web/public/models/male-arterial.glb@48f0eefe56cc', female: 'web/public/models/female-arterial.glb@010357346d09' },
    evidencia: 'docs/revision/limitaciones-modelo/hallazgos.md',
    // Lo que se ve está bien identificado: puede preguntarse señalando ese tramo. Su recorrido y sus ramas, no.
    restringe: [],
    aviso: T(
      'Pieza incompleta en el modelo: solo está el tramo corto de la arteria junto al esfenoides.',
      'Incomplete piece in the model: only the short segment of the artery next to the sphenoid is there.',
      'Unvollständiges Teil im Modell: Es gibt nur das kurze Stück der Arterie am Keilbein.',
      'Pièce incomplète dans le modèle : seul le court segment de l’artère près du sphénoïde est présent.',
      'Pezzo incompleto nel modello: c’è solo il breve tratto dell’arteria vicino allo sfenoide.',
    ),
    detalle: T(
      'La arteria meníngea media entra en el cráneo por el agujero espinoso y se divide en una rama anterior y otra posterior, cuyas ramas se extienden entre la duramadre y la cara interna del cráneo. En este modelo solo está el tramo corto junto al esfenoides: sirve para situar su origen, pero no muestra su recorrido ni sus ramas. Las preguntas pueden señalar ese tramo.',
      'The middle meningeal artery enters the skull through the foramen spinosum and divides into an anterior and a posterior branch, whose branches spread out between the dura mater and the inner surface of the skull. This model only has the short segment next to the sphenoid: it helps to place its origin, but it does not show its course or its branches. Questions may point to that segment.',
      'Die Arteria meningea media tritt durch das Foramen spinosum in den Schädel ein und teilt sich in einen vorderen und einen hinteren Ast, deren Zweige sich zwischen der Dura mater und der Innenseite des Schädels ausbreiten. In diesem Modell gibt es nur das kurze Stück am Keilbein: Es hilft, ihren Ursprung einzuordnen, zeigt aber weder ihren Verlauf noch ihre Äste. Fragen können auf dieses Stück zeigen.',
      'L’artère méningée moyenne pénètre dans le crâne par le foramen épineux et se divise en une branche antérieure et une branche postérieure, dont les rameaux s’étendent entre la dure-mère et la face interne du crâne. Ce modèle ne contient que le court segment près du sphénoïde : il aide à situer son origine, mais ne montre ni son trajet ni ses branches. Les questions peuvent désigner ce segment.',
      'L’arteria meningea media entra nel cranio attraverso il forame spinoso e si divide in un ramo anteriore e uno posteriore, i cui rami si estendono tra la dura madre e la faccia interna del cranio. In questo modello c’è solo il breve tratto vicino allo sfenoide: aiuta a collocare la sua origine, ma non mostra il suo decorso né i suoi rami. Le domande possono indicare quel tratto.',
    ),
    fuentes: [
      { f: 'wp:Middle_meningeal_artery', c: 'it runs through the foramen spinosum to supply the dura mater', revid: 1296440562 },
      { f: 'wp:Middle_meningeal_artery', c: 'divides into two branches, anterior and posterior', revid: 1296440562 },
      { f: 'wp:Middle_meningeal_artery', c: 'spread out between the dura mater and internal surface of the cranium', revid: 1296440562 },
    ],
  },
];

// ── Consultas ──
/** Nombre de una malla sin el lado: { base, lado } («Paracentral_sulcus_L» → Paracentral_sulcus, L), como resolve.js. */
export function partirLado(nombre) {
  const s = String(nombre ?? '');
  const m = /^(.*)_(L|R)$/.exec(s);
  if (m) return { base: m[1], lado: m[2] };
  const e = /^(Left|Right)_(.*)$/.exec(s);
  if (e) return { base: e[2], lado: e[1] === 'Left' ? 'L' : 'R' };
  return { base: s, lado: null };
}

const POR_PIEZA = new Map();
for (const lim of LIMITACIONES) for (const p of lim.piezas) POR_PIEZA.set(p, [...(POR_PIEZA.get(p) ?? []), lim]);

/**
 * Limitaciones de una malla, con lado («Paracentral_sulcus_L») o sin él (vale para los dos), en un modelo; sin modelo,
 * las de cualquiera.
 */
export function limitacionesDe(nombre, modelo = null) {
  const { base, lado } = partirLado(nombre);
  return (POR_PIEZA.get(base) ?? []).filter((l) => (!modelo || l.modelos.includes(modelo)) && (!lado || !l.lados.length || l.lados.includes(lado)));
}

/** ¿No se permite este uso de esta malla en este modelo? (uso: 'identificar' | 'localizar' | 'distractor'). */
export const restringida = (nombre, modelo, uso) => limitacionesDe(nombre, modelo).some((l) => l.restringe.includes(uso));

/** Piezas (sin el lado) que no se pueden usar así en algún modelo: para excluirlas de una lista de claves. */
export const piezasRestringidas = (uso) => [...new Set(LIMITACIONES.filter((l) => l.restringe.includes(uso)).flatMap((l) => l.piezas))];

/** Un texto de una limitación ('aviso' o 'detalle') en un idioma; en español si en ese no está. */
export const textoLimitacion = (lim, campo, idioma = 'es') => lim?.[campo]?.[idioma] || lim?.[campo]?.es || '';

/**
 * Problemas del registro: [{ nivel: 'error', texto }]. `piezasDe(modelo)`: Set de nombres de malla con lado, o null si
 * ese modelo no se revisa (scripts/check-cards.mjs los saca de los .glb). Lo usan la revisión de `npm run check` y las
 * pruebas.
 */
export function revisarLimitaciones(lista = LIMITACIONES, { piezasDe = () => null, idiomas = ['es', 'en', 'de', 'fr', 'it'] } = {}) {
  const out = [];
  const err = (texto) => out.push({ nivel: 'error', texto });
  const vistos = new Set();
  for (const l of lista) {
    const id = l?.id ?? '?';
    if (!/^[a-z0-9-]+$/.test(l?.id ?? '')) err(`${id}: identificador no válido`);
    if (vistos.has(l.id)) err(`${id}: repetida`);
    vistos.add(l.id);
    if (!l.piezas?.length) err(`${id}: sin piezas`);
    for (const p of l.piezas ?? []) if (!/^[A-Za-z0-9_]+$/.test(p) || /_[LR]$/.test(p)) err(`${id}: pieza no válida (va sin el lado): ${p}`);
    if (!Array.isArray(l.lados) || l.lados.some((x) => !['L', 'R'].includes(x))) err(`${id}: lados no válidos`);
    if (!l.modelos?.length || l.modelos.some((m) => !['male', 'female'].includes(m))) err(`${id}: modelos no válidos`);
    if (!TIPOS.includes(l.tipo)) err(`${id}: tipo no válido (${l.tipo})`);
    if (!ESTADOS.includes(l.estado)) err(`${id}: estado no válido (${l.estado})`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(l.comprobada ?? '')) err(`${id}: sin fecha de comprobación`);
    if (!l.evidencia) err(`${id}: sin el registro de la comprobación (evidencia)`);
    for (const m of l.modelos ?? []) if (!l.recurso?.[m]) err(`${id}: sin el archivo examinado del modelo ${m}`);
    if (!Array.isArray(l.restringe) || l.restringe.some((u) => !USOS.includes(u))) err(`${id}: usos restringidos no válidos`);
    // Lo que está fuera de sitio o tiene un nombre dudoso no se puede resaltar para identificarlo ni pedir que se toque.
    if (['ubicacion', 'identidad'].includes(l.tipo) && !['identificar', 'localizar'].every((u) => l.restringe?.includes(u))) err(`${id}: una pieza fuera de sitio o de nombre dudoso no puede identificarse ni localizarse`);
    for (const campo of ['aviso', 'detalle']) {
      for (const i of idiomas) {
        const s = l[campo]?.[i];
        if (!s?.trim()) err(`${id}: falta «${campo}» en ${i}`);
        else if (/[<>]/.test(s)) err(`${id}: «${campo}» (${i}) con marcas HTML`);
      }
    }
    if ((l.aviso?.es ?? '').length > 160) err(`${id}: aviso largo (${l.aviso.es.length} caracteres); lo demás va en «detalle»`);
    if (!l.fuentes?.length) err(`${id}: sin fuentes`);
    for (const f of l.fuentes ?? []) if (!/^(wp|wpes):\S+$/.test(f?.f ?? '') || !(f.c?.length >= 20) || !Number.isInteger(f.revid)) err(`${id}: fuente mal formada (${f?.f})`);
    for (const m of l.modelos ?? []) {
      const nombres = piezasDe(m);
      if (!nombres) continue;
      for (const p of l.piezas ?? []) {
        for (const malla of l.lados?.length ? l.lados.map((x) => `${p}_${x}`) : [p]) if (!nombres.has(malla)) err(`${id}: la pieza ${malla} no existe en el modelo ${m}`);
      }
    }
  }
  return out;
}

/** URL de la versión citada de una fuente de Wikipedia («wp:Título» y su revisión). */
export function urlFuente({ f, revid }) {
  const [tipo, titulo] = [f.slice(0, f.indexOf(':')), f.slice(f.indexOf(':') + 1)];
  const host = tipo === 'wpes' ? 'es.wikipedia.org' : 'en.wikipedia.org';
  return `https://${host}/w/index.php?title=${encodeURIComponent(titulo)}&oldid=${revid}`;
}
