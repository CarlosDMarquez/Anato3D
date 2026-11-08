// Recorrido de la web (solo en desarrollo): pasa por los dos modelos, todos los sistemas y todas sus capas, cuenta las
// piezas visibles de cada capa y comprueba que no haya capas vacías ni piezas del otro modelo (en la revisión del
// 2026-11-01, 481 músculos masculinos acabaron en el cuerpo femenino al cambiar de modelo durante una descarga).
//
// Uso: npm --prefix web run dev, abrir la app (no hace falta pasar la pantalla de inicio) y pegar este archivo en la
// consola del navegador. Tarda lo que tarden en descargarse los sistemas (unos 30 MB por modelo la primera vez).
// Resultado: una tabla en la consola y window.recorrido = { filas, problemas }. Al terminar, todas las capas quedan
// apagadas salvo las del inicio de cada sistema: recargar la página para volver a empezar.
//
// Era un fragmento suelto de la revisión de errores del 2026-11-01; se guarda aquí desde el 2026-11-08.
(async () => {
  const a = window.anato3d;
  if (!a?.setStage) throw new Error('Solo en desarrollo (npm --prefix web run dev): falta window.anato3d');
  const nombres = async (m) => new Set(Object.values(await (await fetch(`/models/${m}-index.json`)).json()).flat().map(([n]) => n));
  const idx = { male: await nombres('male'), female: await nombres('female') };
  const solo = (m, otro) => new Set([...idx[m]].filter((n) => !idx[otro].has(n)));
  const ajenasDe = { male: solo('female', 'male'), female: solo('male', 'female') };   // piezas que no deben aparecer
  const esperar = (fn, ms = 120000) => new Promise((ok, ko) => {
    const t0 = performance.now();
    const tick = () => (fn() ? ok() : performance.now() - t0 > ms ? ko(new Error('tiempo agotado')) : setTimeout(tick, 100));
    tick();
  });
  const filas = [];
  const problemas = [];
  for (const modelo of ['male', 'female']) {
    if (a.state.model !== modelo) {
      a.loadModel(modelo);
      await esperar(() => a.state.model === modelo && a.sessions.current?.model === modelo);
    }
    for (const sys of a.SYSTEMS) {
      for (const st of sys.stages) {
        if (!a.available[sys.id]?.has(st.id)) continue;               // capa sin piezas en este modelo («pronto»)
        await a.setStage(sys.id, st.id);
        const visibles = a.viewer.parts.filter((p) => p.visible);
        const propias = visibles.filter((p) => p.system === sys.id).length;
        filas.push({ modelo, sistema: sys.id, capa: st.id, visibles: visibles.length, propias });
        if (!propias) problemas.push(`${modelo} · ${sys.id} / ${st.id}: la capa no muestra ninguna pieza de su sistema`);
      }
      await a.setStage(sys.id, null);
    }
    const ajenas = a.viewer.parts.filter((p) => ajenasDe[modelo].has(p.id)).map((p) => p.id);
    if (ajenas.length) problemas.push(`${modelo}: ${ajenas.length} piezas del otro modelo (${ajenas.slice(0, 6).join(', ')}…)`);
    filas.push({ modelo, sistema: '(todas)', capa: '—', visibles: a.viewer.parts.length, propias: a.viewer.parts.length - ajenas.length });
  }
  console.table(filas);
  console.log(problemas.length ? problemas.join('\n') : 'Recorrido sin problemas: todas las capas muestran piezas y ninguna es del otro modelo.');
  window.recorrido = { filas, problemas };
})();
