// Buscador de la biblioteca («¿Qué quieres aprender hoy?»). Sin DOM y sin servicios externos: lo prueba `npm test`.
//
// Entiende frases sencillas («quiero aprender los huesos», «músculos de la pierna», «repasar antebrazo»):
//  1. normaliza (sin acentos ni mayúsculas; «œ» como «oe») y quita las palabras vacías («quiero», «de», «los»…);
//  2. reconoce la intención (repasar, practicar) y los términos de la taxonomía: lugares (regiones y subregiones) y
//     materias (sistemas y temas), en español, inglés o latín, con plurales y con una errata razonable; si se le pasan
//     las etiquetas traducidas de la interfaz, también en el idioma que esté puesto («cœur», «Herz», «cuore»);
//  3. con el resto de palabras busca en el texto de las lecciones (título, estructuras, objetivos, resumen), de los
//     recorridos y en los nombres de las estructuras (español, latín, inglés y sinónimos documentados).
// Lugares, sistemas y temas se combinan como filtros: (lugar1 o lugar2) y (sistema1 o sistema2) y (tema1 o tema2). Si así
// no sale nada, se relaja: primero sin el tema y después solo con el lugar (y se dice). Las erratas solo se corrigen en
// palabras de 5 letras o más que no existen tal cual en el vocabulario, y hacia la palabra más parecida: «radio» no se
// convierte en «radial» porque «radio» existe.
//
// Las palabras que en una app de anatomía no dicen el tema («anatomía», «órgano», «sistema», «partes») no se exigen en
// el texto; dentro de una frase de la taxonomía sí cuentan («aparato digestivo», «órganos pélvicos»).
// Con `{ flexible: true }` (lo usa Neuri sin IA, src/pet/local.js), si no sale nada se dejan de exigir las palabras que
// no aparecen en ninguna lección («cómo respiramos») y, si aun así no hay nada, valen las lecciones con alguna de ellas.
import { REGIONES, SISTEMAS, TEMAS, REGION_POR_ID, SUBREGION_POR_ID, SISTEMA_POR_ID, TEMA_POR_ID } from './taxonomia.js';

export const normalizar = (s) => String(s ?? '').replace(/[œŒ]/g, 'oe').replace(/[æÆ]/g, 'ae').replace(/ß/g, 'ss')
  .normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ').trim();
const palabras = (s) => normalizar(s).split(' ').filter(Boolean);

const VACIAS = new Set(('a al algo algun alguna como con cual cuales de del el en entre es esta estan este esto hoy la las le lo los me mi mis '
  + 'muy necesito o para por puedo que quiero quisiera se ser sobre su sus te tu un una uno unos unas y ya ver aprender aprenda estudiar '
  + 'estudio conocer saber entender dame muestrame ensename explicame mas cosas parte partes '
  + 'i want to the of and in on how for my about learn study show me what is are').split(' '));
const REPASAR = new Set(['repasar', 'repaso', 'repasa', 'repasemos', 'revisar', 'review', 'revise']);
const PRACTICAR = new Set(['practicar', 'practica', 'practice', 'examen', 'evaluar', 'evaluarme', 'test', 'quiz']);
const TODOS = new Set(['todos', 'todas', 'todo', 'toda', 'all', 'every', 'entero', 'entera', 'completo']);

// Palabras que en una app de anatomía no dicen de qué tema se trata, en los cinco idiomas de la app.
const GENERICAS = new Set(('anatomia anatomico anatomica anatomicos anatomicas anatomy anatomical anatomie anatomisch anatomische anatomischen '
  + 'anatomique anatomiques organo organos organ organs organe organes organi sistema sistemas system systems systeme systemes '
  + 'aparato aparatos apparatus appareil appareils apparato apparati parte partes part parts partie parties teil teile parti '
  + 'estructura estructuras structure structures struktur strukturen struttura strutture cuerpo humano humana human body '
  + 'corps humain korper korpers menschlichen menschliche corpo umano').split(' '));
/** Si una palabra (normalizada) es de las que no dicen el tema: «anatomía», «órgano», «sistema»… */
export const esGenerica = (w) => GENERICAS.has(w);

// Palabras que en anatomía significan algo más preciso que en el habla corriente: se avisa y se ofrece la otra lectura.
export const AMBIGUOS = {
  pierna: { region: 'miembro-inferior', aviso: 'buscar.avisoPierna' },
  brazo: { region: 'miembro-superior', aviso: 'buscar.avisoBrazo' },
};

/** Variantes de una palabra para comparar plurales: «huesos» → hueso, «nervios» → nervio, «pies» → pie. */
function variantes(w) {
  const v = [w];
  if (w.length > 4 && w.endsWith('es')) v.push(w.slice(0, -2));
  if (w.length > 3 && w.endsWith('s')) v.push(w.slice(0, -1));
  return v;
}

// Para los nombres traducidos (alemán, francés, italiano): singular y plural por la terminación («cuore» y «cuori»,
// «Knochen», «des Herzens»). No se usa con el español, donde quitar letras confundiría «tibia» con «tibio».
const FINALES = ['ens', 'en', 'es', 'e', 'i', 'o', 'a', 's', 'n'];
function raices(w) {
  const r = new Set([w]);
  for (const f of FINALES) if (w.endsWith(f) && w.length - f.length >= 3) r.add(w.slice(0, -f.length));
  return [...r];
}
const iguales = (q, p, traducida) => variantes(q).some((x) => variantes(p).includes(x)) || (traducida && raices(q).some((x) => raices(p).includes(x)));

/** Distancia de edición (con transposiciones) acotada: devuelve max + 1 si la supera. */
export function distancia(a, b, max = 2) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    let fila = Infinity;
    for (let j = 1; j <= b.length; j++) {
      const c = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + c);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      fila = Math.min(fila, d[i][j]);
    }
    if (fila > max) return max + 1;
  }
  return d[a.length][b.length];
}
const tolerancia = (w) => (w.length >= 8 ? 2 : w.length >= 5 ? 1 : 0);

// Un nombre compuesto («Órbita y ojo», «Gehirn und Hirnhäute», «Laringe, faringe y tiroides») también vale por partes,
// salvo que alguna lleve preposición: «Vessels and nerves of the neck» no convierte «vessels» en el cuello.
const UNION = /\s+(?:y|e|and|und|et)\s+|\s*,\s*/;
const PREPOSICION = /(?:^|\s)(?:de|del|of|the|von|vom|des|der|du|di|della|dello|dei|degli|delle)(?:\s|$)/i;

// Vocabulario de la taxonomía: frase normalizada → faceta. Las frases de varias palabras se buscan primero; a igual
// largo, las de la taxonomía antes que las traducidas. Con `etiquetas` (ETIQUETAS de i18n), además los nombres que ve la
// persona en inglés y en `idioma`; nunca los de otro idioma, para que el «dos» francés no sea la espalda en español.
function vocabulario(idioma = null, etiquetas = null) {
  const out = [];
  // `espanol`: escrita en español (nombre o forma de búsqueda). `miembro`: una forma de búsqueda de un lugar, que puede
  // ser algo que está en él («próstata» en los órganos pélvicos): no se compara con el nombre de todo el lugar.
  // Sin palabras vacías, como la consulta: «Vasos y nervios del cuello» se encuentra al escribirlo entero.
  const add = (texto, faceta, { traducida = false, espanol = false, miembro = false } = {}) => {
    const frase = normalizar(texto).split(' ').filter((w) => w && !VACIAS.has(w));
    if (frase.length) out.push({ frase, faceta, traducida, espanol, miembro });
  };
  const idiomas = [...new Set(['en', idioma].filter((x) => x && x !== 'es'))];
  const traducciones = (...es) => {
    if (!etiquetas) return [];
    const res = [];
    for (const nombre of es.filter(Boolean)) {
      for (const l of idiomas) {
        const tr = etiquetas[nombre]?.[l];
        if (!tr) continue;
        res.push(tr);
        const partes = tr.split(UNION);
        if (partes.length > 1 && !partes.some((p) => PREPOSICION.test(p))) res.push(...partes);
      }
    }
    return res;
  };
  for (const r of REGIONES) {
    const f = { tipo: 'lugar', region: r.id, sub: null };
    add(r.nombre, f, { espanol: true });
    for (const t of r.buscar ?? []) add(t, f, { espanol: true, miembro: true });
    for (const t of [r.en, r.la].filter(Boolean)) add(t, f);
    for (const t of traducciones(r.nombre)) add(t, f, { traducida: true });
    for (const s of r.sub) {
      const fs = { tipo: 'lugar', region: r.id, sub: s.id };
      add(s.nombre, fs, { espanol: true });
      for (const t of s.buscar ?? []) add(t, fs, { espanol: true, miembro: true });
      for (const t of [s.en, s.la].filter(Boolean)) add(t, fs);
      for (const t of traducciones(s.nombre)) add(t, fs, { traducida: true });
    }
  }
  for (const s of SISTEMAS) {
    const f = { tipo: 'materia', sistema: s.id };
    for (const t of [s.nombre, s.corto, ...(s.buscar ?? [])].filter(Boolean)) add(t, f, { espanol: true });
    for (const t of [s.en, s.la].filter(Boolean)) add(t, f);
    for (const t of traducciones(s.corto, s.nombre)) add(t, f, { traducida: true });
  }
  for (const t of TEMAS) {
    const f = { tipo: 'materia', tema: t.id };
    for (const x of [t.nombre, ...(t.buscar ?? [])]) add(x, f, { espanol: true });
    for (const x of traducciones(t.nombre)) add(x, f, { traducida: true });
  }
  // Una sola palabra genérica no es una faceta por sí sola salvo que sea un tema («órganos»): «system» no es nada.
  const utiles = out.filter((v) => v.frase.length > 1 || !GENERICAS.has(v.frase[0]) || v.faceta.tema);
  return utiles.sort((a, b) => b.frase.length - a.frase.length || a.traducida - b.traducida);
}

// El nombre en español de una faceta, por partes («Encéfalo y meninges» → [encefalo], [meninges]), sin palabras genéricas.
function partesCanonicas(f) {
  const nombre = f.tipo === 'lugar' ? (f.sub ? SUBREGION_POR_ID.get(f.sub)?.nombre : REGION_POR_ID.get(f.region)?.nombre)
    : f.sistema ? SISTEMA_POR_ID.get(f.sistema)?.corto : TEMA_POR_ID.get(f.tema)?.nombre;
  return String(nombre ?? '').split(UNION).map((p) => palabras(p).filter((w) => !GENERICAS.has(w) && !VACIAS.has(w))).filter((p) => p.length);
}

/**
 * Prepara un índice de búsqueda sobre el catálogo (lecciones y recorridos) y, opcionalmente, una lista de estructuras
 * [{ clave, nombre, latin, en, sinonimos: [] }]. `etiquetas` e `idioma` (texto o función): los nombres traducidos de la
 * taxonomía (ETIQUETAS de src/i18n/textos.js) y el idioma de la interfaz. Devuelve { buscar(texto, { flexible, idioma }) }.
 */
export function crearBuscador({ lecciones = [], recorridos = [], estructuras = [], etiquetas = null, idioma = null } = {}) {
  const docL = lecciones.map((L) => {
    const nucleo = (L.estructuras ?? []).filter((e) => e.papel !== 'contexto');
    const contexto = (L.estructuras ?? []).filter((e) => e.papel === 'contexto');
    // Las estructuras que dan nombre a la lección («Hígado, vesícula biliar…»): buscarlas en otro idioma («liver») la pone antes.
    const titulo = palabras(L.titulo);
    const delTitulo = nucleo.filter((e) => { const ws = palabras(e.nombre); return ws.length > 0 && ws.every((w) => titulo.includes(w)); })
      .flatMap((e) => palabras(`${e.nombre} ${e.en ?? ''} ${e.la ?? ''}`));
    return {
      L, delTitulo,
      campos: [
        [palabras(L.titulo), 6],
        [palabras(nucleo.map((e) => e.nombre).join(' ')), 4],                                // las estructuras que enseña
        [palabras(nucleo.map((e) => `${e.en ?? ''} ${e.la ?? ''}`).join(' ')), 3],           // y sus nombres en inglés y latín
        [palabras((L.objetivos ?? []).join(' ')), 2],
        [palabras(L.resumen), 2],
        [palabras(contexto.map((e) => `${e.nombre ?? ''} ${e.en ?? ''} ${e.la ?? ''}`).join(' ')), 1],   // las de contexto
      ],
    };
  });
  const docR = recorridos.map((R) => ({ R, campos: [[palabras(R.titulo), 6], [palabras(R.descripcion), 2]] }));
  const docE = estructuras.map((E) => ({ E, texto: palabras([E.nombre, E.latin, E.en, ...(E.sinonimos ?? [])].filter(Boolean).join(' ')) }));
  // Diccionario de palabras conocidas (para corregir erratas) y sus variantes.
  const dicc = new Set();
  for (const d of [...docL, ...docR]) for (const [ws] of d.campos) for (const w of ws) dicc.add(w);
  for (const d of docE) for (const w of d.texto) dicc.add(w);
  const vocabs = new Map();
  const vocabDe = (l) => {
    const k = l ?? '';
    if (!vocabs.has(k)) {
      const v = vocabulario(l, etiquetas);
      const traducidas = new Set(v.filter((x) => x.traducida).flatMap((x) => x.frase.flatMap(raices)));
      vocabs.set(k, { v, traducidas });
    }
    return vocabs.get(k);
  };
  for (const x of vocabDe(null).v) for (const w of x.frase) dicc.add(w);

  // Una palabra de la consulta coincide con una palabra del texto: igual, plural o, desde 4 letras, como prefijo.
  const coincide = (q, w) => variantes(q).some((v) => w === v || variantes(w).includes(v) || (v.length >= 4 && w.startsWith(v)));
  const puntuar = (campos, qs) => {
    let total = 0;
    for (const q of qs) {
      let mejor = 0;
      for (const [ws, peso] of campos) if (ws.some((w) => coincide(q, w))) mejor = Math.max(mejor, peso);
      if (!mejor) return 0;                                // todas las palabras libres tienen que aparecer
      total += mejor;
    }
    return total;
  };
  // Para la búsqueda flexible: cuántas de las palabras aparecen, y con qué peso.
  const puntuarAlguna = (campos, qs) => {
    let n = 0;
    let total = 0;
    for (const q of qs) {
      let mejor = 0;
      for (const [ws, peso] of campos) if (ws.some((w) => coincide(q, w))) mejor = Math.max(mejor, peso);
      if (mejor) { n++; total += mejor; }
    }
    return n ? n * 100 + total : 0;
  };
  const enAlgunaLeccion = (q) => docL.some((d) => d.campos.some(([ws]) => ws.some((w) => coincide(q, w))));

  function buscar(texto, { flexible = false, idioma: pedido = null } = {}) {
    const l = pedido ?? (typeof idioma === 'function' ? idioma() : idioma);
    const { v: vocab, traducidas } = vocabDe(l);
    const conocida = (w) => variantes(w).some((x) => dicc.has(x) || dicc.has(`${x}s`) || dicc.has(`${x}es`)) || raices(w).some((x) => traducidas.has(x));
    const corregir = (w) => {
      if (conocida(w) || !tolerancia(w)) return null;
      let mejor = null;
      for (const x of dicc) {
        if (x.length < 4) continue;
        const d = distancia(w, x, tolerancia(w));
        // Con dos cambios, solo si empieza igual: quien se equivoca casi nunca cambia el principio («volcanes» no es «vocales»).
        if (d <= tolerancia(w) && (d <= 1 || x.slice(0, 3) === w.slice(0, 3)) && (!mejor || d < mejor.d || (d === mejor.d && x.length === w.length))) mejor = { x, d };
      }
      return mejor?.x ?? null;
    };

    const crudas = palabras(texto);
    const intencion = crudas.some((w) => REPASAR.has(w)) ? 'repasar' : crudas.some((w) => PRACTICAR.has(w)) ? 'practicar' : null;
    const todos = crudas.some((w) => TODOS.has(w));
    let ws = crudas.filter((w) => !VACIAS.has(w) && !REPASAR.has(w) && !PRACTICAR.has(w) && !TODOS.has(w));
    // Erratas: se corrige cada palabra desconocida hacia la conocida más parecida (las genéricas no se tocan).
    const correcciones = [];
    ws = ws.map((w) => { if (GENERICAS.has(w)) return w; const c = corregir(w); if (c) correcciones.push([w, c]); return c ?? w; });
    // Facetas de la taxonomía (frases más largas primero) y lo que queda como texto libre.
    const facetas = [];
    const sueltas = [];
    for (let i = 0; i < ws.length;) {
      const v = vocab.find(({ frase, traducida }) => frase.every((p, k) => ws[i + k] && iguales(ws[i + k], p, traducida)));
      if (v) { facetas.push({ ...v.faceta, palabras: ws.slice(i, i + v.frase.length), espanol: v.espanol, miembro: v.miembro }); i += v.frase.length; }
      else sueltas.push(ws[i++]);
    }
    const genericas = sueltas.filter((w) => GENERICAS.has(w));
    let libres = sueltas.filter((w) => !GENERICAS.has(w));
    const lugares = dedup(facetas.filter((f) => f.tipo === 'lugar').map(({ region, sub }) => ({ region, sub })));
    const materias = dedup(facetas.filter((f) => f.tipo === 'materia').map(({ sistema, tema }) => (sistema ? { sistema } : { tema })));
    // Un tema dicho con una palabra genérica («el órgano reproductor») filtra, pero no hace falta nombrarlo como tema.
    const debiles = new Set(facetas.filter((f) => f.tema && f.palabras.every((w) => GENERICAS.has(w))).map((f) => f.tema));
    for (const m of materias) if (m.tema && debiles.has(m.tema) && materias.some((x) => x !== m && !debiles.has(x.tema))) m.generico = true;
    const sistemas = materias.filter((m) => m.sistema).map((m) => m.sistema);
    const temas = materias.filter((m) => m.tema).map((m) => m.tema);
    const avisos = facetas.filter((f) => f.tipo === 'lugar' && f.sub && AMBIGUOS[f.sub]).map((f) => ({ clave: AMBIGUOS[f.sub].aviso, region: AMBIGUOS[f.sub].region, sub: f.sub }));

    // Un lugar también vale si su palabra está en el título: «Corazón y circulación» es de todo el cuerpo, pero
    // buscar «corazón» (lugar: tórax › corazón) tiene que encontrarla, y más aún si se busca su título exacto.
    // Tienen que estar todas sus palabras: con «miembro inferior», «… del miembro superior» no vale.
    const enCampo = (xs, d, campo) => xs.length > 0 && xs.every((q) => d.campos[campo][0].some((w) => coincide(q, w)));
    const directo = (f, d, campo = 0) => enCampo(f.palabras.filter((q) => !GENERICAS.has(q)), d, campo);
    const canonico = (f, d, campo = 0) => !f.miembro && partesCanonicas(f).some((xs) => enCampo(xs, d, campo));
    const nombra = (f, d, campo = 0) => directo(f, d, campo) || canonico(f, d, campo);
    const claveFaceta = (f) => (f.tipo === 'lugar' ? `l:${f.region}:${f.sub ?? ''}` : f.sistema ? `s:${f.sistema}` : `t:${f.tema}`);
    // El título lo nombra tal cual (+3); si no, por su nombre en español, una vez por faceta («neuroanatomía» →
    // «Sistema nervioso», «cuore» → «El corazón»; «pulmones, bronquios y pleura» no suma tres veces «pulmones»); si
    // no, una estructura central lo nombra (+2).
    const bonificacion = (d) => {
      let n = 0;
      const nombradas = new Set(facetas.filter((f) => directo(f, d)).map(claveFaceta));
      for (const f of facetas) {
        if (directo(f, d)) n += 3;
        else if (!nombradas.has(claveFaceta(f)) && canonico(f, d)) { n += 3; nombradas.add(claveFaceta(f)); }
        else if (nombra(f, d, 1)) n += 2;
      }
      return n;
    };
    const tituloNombra = (d) => facetas.some((f) => f.tipo === 'lugar' && nombra(f, d));
    const enLugar = (d) => !lugares.length || lugares.some((g) => (d.L.lugares ?? []).some(([r, s]) => r === g.region && (!g.sub || !s || s === g.sub))) || tituloNombra(d);
    const enSistema = (d) => !sistemas.length || sistemas.some((s) => (d.L.sistemas ?? []).includes(s));
    const enTema = (d, conTema) => !conTema || !temas.length || temas.some((t) => (d.L.temas ?? []).includes(t));
    const puntuarL = (d, qs, alguna = false) => {
      const base = qs.length ? (alguna ? puntuarAlguna(d.campos, qs) : puntuar(d.campos, qs)) : 1;
      if (!base) return 0;
      // Las facetas también cuentan como texto: «hombro» puntúa más si está en el título, y algo más si lo enseña.
      const extra = bonificacion(d) + qs.filter((q) => d.delTitulo.some((w) => coincide(q, w))).length * 3;
      return base + extra;
    };
    const filtrar = (qs, { conTema = true, soloLugar = false, alguna = false } = {}) => docL
      .filter((d) => enLugar(d) && (soloLugar || (enSistema(d) && enTema(d, conTema))))
      .map((d) => ({ L: d.L, p: puntuarL(d, qs, alguna) })).filter((x) => x.p > 0);
    // Sin tema ni texto (solo palabras genéricas o vacías), todas las lecciones valen igual: quien llama decide (la
    // biblioteca las enseña todas; Neuri pregunta qué tema).
    const sinTema = !facetas.length && !libres.length;
    let relajado = false;
    let parcial = false;
    let ignoradas = [];
    let lec = filtrar(libres);
    if (!lec.length && temas.length && (sistemas.length || lugares.length)) lec = filtrar(libres, { conTema: false });
    if (!lec.length && lugares.length && materias.length) {
      // Sin nada que cumpla las dos cosas: lo que cumple al menos el lugar (y se dice).
      lec = filtrar(libres, { soloLugar: true });
      relajado = lec.length > 0;
    }
    if (!lec.length && flexible && libres.length) {
      // Neuri sin IA: las palabras que no salen en ninguna lección no se exigen («cómo respiramos»)…
      ignoradas = libres.filter((q) => !enAlgunaLeccion(q));
      // Sin ninguna faceta, lo que queda tiene que ser al menos la mitad de lo que se escribió: de «astrofísica de los
      // agujeros negros» no se recomienda lo que tenga «agujeros».
      const bastante = facetas.length > 0 || (libres.length - ignoradas.length) * 2 >= libres.length;
      if (ignoradas.length && bastante) {
        libres = libres.filter((q) => !ignoradas.includes(q));
        if (libres.length || facetas.length) lec = filtrar(libres);
        if (!lec.length && temas.length && (sistemas.length || lugares.length)) lec = filtrar(libres, { conTema: false });
      }
      // …y si aun así no hay nada, valen las que tienen alguna de las palabras (primero las que tienen más).
      if (!lec.length && bastante && libres.length > 1) { lec = filtrar(libres, { alguna: true }); parcial = lec.length > 0; }
      // …y si hay un lugar, un sistema o un tema reconocidos, sus lecciones, aunque sobre alguna palabra («para qué sirve el
      // diafragma»).
      if (!lec.length && facetas.length) { lec = filtrar([]); if (!lec.length && temas.length) lec = filtrar([], { conTema: false }); parcial = lec.length > 0; }
    }
    lec.sort((a, b) => b.p - a.p || (a.L.orden ?? 0) - (b.L.orden ?? 0));

    // Recorridos: por su tema o por sus palabras («todos los huesos» → el recorrido de todos los huesos).
    const rec = docR.map((d) => {
      let p = libres.length ? puntuar(d.campos, libres) : 0;
      if (materias.some((m) => m.tema && m.tema === d.R.tema) || materias.some((m) => m.sistema && TEMA_DE_SISTEMA[m.sistema] === d.R.tema)) p += 5 + (todos ? 5 : 0);
      if (!libres.length && !materias.length) p = 0;
      return { R: d.R, p };
    }).filter((x) => x.p > 0).sort((a, b) => b.p - a.p);

    // Estructuras: todas las palabras (también las de las facetas) tienen que estar en sus nombres.
    const qE = ws.filter((w) => !GENERICAS.has(w) && !ignoradas.includes(w));
    const est = !qE.length ? [] : docE.map((d) => ({ E: d.E, p: qE.every((q) => d.texto.some((w) => coincide(q, w))) ? qE.length + (normalizar(d.E.nombre) === qE.join(' ') ? 10 : 0) : 0 }))
      .filter((x) => x.p > 0).sort((a, b) => b.p - a.p || a.E.nombre.length - b.E.nombre.length);

    return {
      consulta: texto, intencion, todos, lugares, materias, libres, correcciones, avisos, relajado, parcial, ignoradas, genericas,
      sinTema,
      lecciones: lec.map((x) => ({ ...x.L, puntuacion: x.p })),
      recorridos: rec.map((x) => x.R),
      estructuras: est.map((x) => x.E),
      vacia: !crudas.length,
    };
  }
  return { buscar };
}

// Un sistema que coincide con el tema de un recorrido («huesos» → óseo → recorrido de todos los huesos).
const TEMA_DE_SISTEMA = { oseo: 'huesos', muscular: 'musculos', articular: 'articulaciones', nervioso: 'nervios', cardiovascular: 'arterias-venas' };

function dedup(lista) {
  const vistos = new Set();
  return lista.filter((x) => { const k = JSON.stringify(x); return !vistos.has(k) && vistos.add(k); });
}

/** Ejemplos para la portada del buscador (se muestran como sugerencias). */
export const SUGERENCIAS = ['huesos de la mano', 'músculos de la pierna', 'repasar antebrazo', 'nervios del brazo', 'corazón', 'manguito rotador'];
