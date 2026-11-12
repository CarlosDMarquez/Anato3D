// Mide las piezas de las limitaciones conocidas del modelo (docs/revision/limitaciones-modelo/hallazgos.md).
// Uso: abrir la app (npm --prefix web run dev), pulsar «Empezar» y pegar este archivo entero en la consola del navegador.
// Solo lee. Carga los sistemas que hagan falta y cambia de modelo; termina con el modelo masculino a la vista.
// Para cada modelo y lado da el centro de la pieza, su extensión y qué giros (o qué hueso) tiene más cerca.
// Coordenadas del modelo: +Y arriba, +Z delante, +X lado izquierdo del cuerpo.
(async () => {
  const app = window.anato3d;
  const muestras = (p, n) => {
    const out = [];
    const total = p.meshes.reduce((s, m) => s + (m.geometry?.attributes?.position?.count || 0), 0);
    const paso = Math.max(1, Math.floor(total / n));
    for (const m of p.meshes) {
      m.updateWorldMatrix(true, false);
      const pos = m.geometry.attributes.position;
      const e = m.matrixWorld.elements;
      for (let i = 0; i < pos.count; i += paso) {
        const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
        out.push([e[0] * x + e[4] * y + e[8] * z + e[12], e[1] * x + e[5] * y + e[9] * z + e[13], e[2] * x + e[6] * y + e[10] * z + e[14]]);
      }
    }
    return out;
  };
  const centro = (pts) => [0, 1, 2].map((k) => +(pts.reduce((s, p) => s + p[k], 0) / pts.length).toFixed(4));
  const esGiro = (id) => !/sulcus/i.test(id) || /gyr|lobule|pole|cuneus|insula/i.test(id);

  const resultado = {};
  for (const modelo of ['female', 'male']) {
    await app.loadModel(modelo);
    for (let i = 0; i < 120 && app.state.model !== modelo; i++) await new Promise((r) => setTimeout(r, 500));
    for (const s of ['nervous', 'arterial', 'skeletal']) await app.ensureSystem(s, { quiet: true });
    const P = Array.from(app.viewer.parts);
    const porId = new Map(P.map((p) => [p.id, p]));
    const nube = [];
    for (const p of P) if (p.system === 'nervous' && p.tissue === 'cortex') for (const v of muestras(p, 400)) nube.push([...v, p.id]);
    const huesos = [];
    for (const p of P) if (/^(Sphenoid_Bone|Temporal_Bone_[LR]|Parietal_Bone_[LR]|Frontal_Bone)$/.test(p.id)) for (const v of muestras(p, 1500)) huesos.push([...v, p.id]);

    const giros = (id) => {
      const pts = muestras(porId.get(id), 500);
      const cuenta = new Map();
      for (const q of pts) {
        let mejor = Infinity, cual = null;
        for (const v of nube) {
          if (v[3] === id || !esGiro(v[3])) continue;
          const d = (v[0] - q[0]) ** 2 + (v[1] - q[1]) ** 2 + (v[2] - q[2]) ** 2;
          if (d < mejor) { mejor = d; cual = v[3]; }
        }
        cuenta.set(cual, (cuenta.get(cual) || 0) + 1);
      }
      return { centro: centro(pts), giros: [...cuenta].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([g, n]) => `${g} ${Math.round((100 * n) / pts.length)} %`) };
    };
    const arteria = (id) => {
      const p = porId.get(id);
      const pts = muestras(p, 800);
      let largo = 0;
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j += 7) largo = Math.max(largo, Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1], pts[i][2] - pts[j][2]));
      const alto = pts.reduce((m, q) => (q[1] > m[1] ? q : m), pts[0]);
      let mejor = Infinity, cual = null;
      for (const v of huesos) { const d = Math.hypot(v[0] - alto[0], v[1] - alto[1], v[2] - alto[2]); if (d < mejor) { mejor = d; cual = v[3]; } }
      return { centro: centro(pts), vertices: p.meshes.reduce((s, m) => s + m.geometry.attributes.position.count, 0), extension_mm: +(largo * 1000).toFixed(1), extremoSuperior: `${cual} a ${(mejor * 1000).toFixed(1)} mm` };
    };

    resultado[modelo] = {
      Paracentral_gyrus_and_sulcus_L: { centro: centro(muestras(porId.get('Paracentral_gyrus_and_sulcus_L'), 600)) },
      Paracentral_sulcus_L: giros('Paracentral_sulcus_L'),
      Paracentral_sulcus_R: giros('Paracentral_sulcus_R'),
      Inferior_temporal_sulcus_L: giros('Inferior_temporal_sulcus_L'),
      Inferior_temporal_sulcus_R: giros('Inferior_temporal_sulcus_R'),
      Middle_meningeal_artery_L: arteria('Middle_meningeal_artery_L'),
      Middle_meningeal_artery_R: arteria('Middle_meningeal_artery_R'),
      ramas: P.filter((p) => /middle_meningeal/i.test(p.id)).map((p) => p.id),
    };
  }
  console.log(JSON.stringify(resultado, null, 1));
  return resultado;
})();
