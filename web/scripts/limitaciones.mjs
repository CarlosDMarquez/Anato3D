// Limitaciones conocidas del modelo (src/data/limitaciones.js): comprueba que cada cita de sus fuentes está, palabra por
// palabra, en la versión citada de su página. La baja si no está guardada en build/biblioteca/fuentes/ (fuera de git),
// sin registrarla en fuentes.json (el registro de la biblioteca es de las lecciones).
// Uso (desde web/): node scripts/limitaciones.mjs --citas
// La validez del registro (piezas que existen en los modelos, textos en los cinco idiomas, campos) la revisa
// `npm run check` (scripts/check-cards.mjs, revisarLimitaciones).
import { LIMITACIONES } from '../src/data/limitaciones.js';
import { fuente, normalizar } from './biblioteca/fuentes.mjs';

if (process.argv.includes('--citas')) {
  let mal = 0;
  for (const l of LIMITACIONES) {
    for (const c of l.fuentes) {
      let ok = false;
      let nota = '';
      try {
        const d = await fuente(c.f, { registro: { [c.f]: { revid: c.revid } }, guardarRegistro: false });
        ok = d.revid === c.revid && normalizar(d.texto).includes(normalizar(c.c));
        if (d.revid !== c.revid) nota = ` (la página guardada es la revisión ${d.revid})`;
      } catch (e) { nota = ` (${e.message})`; }
      console.log(`${ok ? 'ok   ' : 'FALLA'} ${l.id} · ${c.f}@${c.revid}: «${c.c}»${nota}`);
      if (!ok) mal++;
    }
  }
  console.log(mal ? `${mal} citas sin encontrar` : 'todas las citas están en su fuente');
  process.exitCode = mal ? 1 : 0;
} else {
  console.log('Uso: node scripts/limitaciones.mjs --citas');
}
