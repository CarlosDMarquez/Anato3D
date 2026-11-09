import * as THREE from 'three';

// Realismo de los materiales. Lo que hacía que los modelos se vieran «de plástico»:
//   1. casi todos llevaban un barniz (clearcoat) con rugosidad 0, que reflejaba las luces del estudio como un caramelo;
//   2. colores planos, sin variación ni relieve fino;
//   3. sin oclusión ambiental: las grietas entre estructuras recibían tanta luz como las superficies expuestas;
//   4. la luz se cortaba en seco en la zona de sombra, como en una superficie opaca y dura. En los tejidos vivos la
//      luz entra, se dispersa y sale teñida (dispersión subsuperficial).
// Cada material recibe aquí un perfil según el tejido: brillo húmedo pero difuso, variación de color y relieve
// procedurales (ruido en coordenadas del objeto, así el dibujo no «resbala» al girar) y luz envolvente teñida.

// Oclusión ambiental en pantalla (GTAO, la calcula el visor antes de cada fotograma).
export const SSAO = {
  tex: { value: null },
  invSize: { value: new THREE.Vector2(1, 1) },
  amount: { value: 0 },
};

const NOISE_GLSL = /* glsl */ `
  varying vec3 vTisPos;
  uniform vec4 uTisA;   // escala del dibujo (1/m), variación de color, altura del relieve (m), variación de rugosidad
  uniform vec4 uTisB;   // tinte de las zonas oscuras (rgb), cantidad de motas
  uniform vec4 uTisSSS; // color de la luz dispersada (rgb), cuánto envuelve la luz
  uniform vec4 uTisSkin; // solo piel (patrón 5): rojeces, palidez, variación de brillo (grasa), sin uso
  // Ruido precalculado en una textura 3D periódica (ver makeNoiseTexture): r y g, ruido suave con 16 nodos por
  // repetición; b y a, celdas de Worley (distancia al centro más cercano y diferencia con el segundo) con 8 celdas.
  // Calcularlo en el shader (27 vecinos por celda, fbm de 4 octavas) bajaba la app de 51 a 2 fps.
  uniform highp sampler3D uTisNoise;
  float tnNoise(vec3 p) { return texture(uTisNoise, p * 0.0625).r; }
  float tnNoise2(vec3 p) { return texture(uTisNoise, p * 0.0625).g; }
  float tnFbm(vec3 p) { return tnNoise(p) * 0.57 + tnNoise(p * 2.03 + 0.37) * 0.29 + tnNoise2(p * 4.07 + 0.71) * 0.14; }
  vec2 tnCells(vec3 p) { return texture(uTisNoise, p * 0.125).ba; }
  // Relieve a partir de una altura procedural (gradiente de superficie de Mikkelsen, con derivadas en pantalla).
  vec3 tnBump(vec3 surfPos, vec3 surfNorm, float h, float faceDir) {
    vec3 sx = dFdx(surfPos), sy = dFdy(surfPos);
    vec3 r1 = cross(sy, surfNorm), r2 = cross(surfNorm, sx);
    float det = dot(sx, r1) * faceDir;
    vec3 grad = sign(det) * (dFdx(h) * r1 + dFdy(h) * r2);
    return normalize(abs(det) * surfNorm - grad);
  }`;

// Patrones: 0 motas suaves · 1 lobulillos (hígado, pulmón, glándulas, grasa) · 2 fibras (tendón, nervio; usa aFib)
//           3 poros (hueso) · 4 vasos finos (serosas: intestino, corteza cerebral) · 5 piel
const PATTERN_GLSL = /* glsl */ `
  float tnH = 0.0, tnShade = 1.0, tnDark = 0.0, tnOil = 0.0;
  vec3 tnTint = vec3(1.0);
  {
    float s = uTisA.x;
    vec3 p = vTisPos * s;
    // El detalle se desvanece cuando es más pequeño que un píxel (si no, centellea al alejarse).
    float tnFade = 1.0 - smoothstep(0.35, 1.1, length(fwidth(p)));
    float m = tnFbm(vTisPos * 35.0);                 // manchas lentas de color (~3 cm), en todos los tejidos
    #if TN_PATTERN == 0
      float n = tnFbm(p);
      tnH = n; tnShade = mix(1.0, 0.8 + 0.4 * n, tnFade);
    #elif TN_PATTERN == 1
      // Celdas deformadas con ruido para que no parezcan un mosaico regular; bordes finos y suaves.
      vec3 pw = p + (vec3(tnNoise(p * 0.6), tnNoise2(p * 0.6), tnNoise(p * 0.6 + 7.3)) - 0.5) * 0.9;
      vec2 c = tnCells(pw);
      float edge = (1.0 - smoothstep(0.0, 0.09, c.y)) * (0.55 + 0.45 * tnNoise(p * 1.7));
      float speck = smoothstep(0.78, 0.92, tnNoise2(p * 4.3));
      tnH = -edge * 0.6 + 0.4 * tnNoise(p * 3.1);
      tnShade = mix(1.0, (0.95 + 0.1 * tnNoise2(pw * 0.5)) * (1.0 - 0.12 * edge), tnFade);
      tnDark = max(edge * 0.6, speck) * tnFade;
    #elif TN_PATTERN == 2
      vec3 q = vTisFib;
      tnFade = 1.0 - smoothstep(0.35, 1.1, length(fwidth(q)));
      float f = tnNoise(q) * 0.6 + tnNoise(q * 2.3) * 0.4;
      tnH = f; tnShade = mix(1.0, 0.82 + 0.36 * f, tnFade);
    #elif TN_PATTERN == 3
      vec2 c = tnCells(p);
      float pit = 1.0 - smoothstep(0.0, 0.35, c.x);
      tnH = -pit + 0.35 * tnNoise(p * 0.5);
      tnShade = mix(1.0, 1.0 - 0.18 * pit, tnFade);
    #elif TN_PATTERN == 4
      // Vasos finos y ramificados: dos redes de ruido de distinta escala (las grandes son más gruesas).
      float v = abs(tnFbm(p) - 0.5), v2 = abs(tnFbm(p * 2.3 + 5.1) - 0.5);
      float vessel = max(1.0 - smoothstep(0.0, 0.018, v), (1.0 - smoothstep(0.0, 0.012, v2)) * 0.7);
      tnH = -vessel * 0.5 + 0.2 * tnNoise(p * 2.0);
      tnDark = vessel * tnFade;
      tnShade = mix(1.0, 0.92 + 0.16 * tnNoise(p * 0.5), tnFade);
    #elif TN_PATTERN == 5
      // Piel. Con un solo color, liso y un brillo uniforme parecía de vinilo. A escala de milímetros: poros (celdas de
      // ~0,45 mm) y la red de surcos finos de la piel (~1,5 mm, dos familias cruzadas), que rompen el brillo; cada uno se
      // desvanece al alejarse a su propia escala. A escala de centímetros: rojeces, zonas algo más pálidas y zonas con
      // más o menos grasa (brillo). (Unas motas de pecas o folículos se probaron y parecían suciedad: no van.)
      vec2 c = tnCells(p);
      float pit = 1.0 - smoothstep(0.0, 0.32, c.x);
      vec3 q = vTisPos * 700.0;
      float gFade = 1.0 - smoothstep(0.35, 1.1, length(fwidth(q)));
      // (Finos y poco hondos: más marcados, la piel parecía cuero cuarteado.)
      float g1 = 1.0 - smoothstep(0.0, 0.14, abs(tnNoise(q * vec3(1.0, 0.3, 0.6)) - 0.5));
      float g2 = 1.0 - smoothstep(0.0, 0.14, abs(tnNoise2(q * vec3(0.35, 1.0, 0.8) + 4.7) - 0.5));
      float groove = max(g1, g2) * 0.4;
      // Y un relieve suave de 2–5 mm, que todavía se ve con el cuerpo entero en pantalla y rompe los brillos anchos.
      vec3 qm = vTisPos * 230.0;
      float mFade = 1.0 - smoothstep(0.35, 1.1, length(fwidth(qm)));
      tnH = -pit * 0.55 * tnFade + (-groove * 0.6 + 0.35 * tnNoise(q * 0.45)) * gFade + (tnFbm(qm) - 0.5) * 1.6 * mFade;
      tnShade = mix(1.0, 1.0 - 0.07 * pit, tnFade) * mix(1.0, 1.0 - 0.02 * groove, gFade);
      float r1 = tnFbm(vTisPos * 9.0 + 1.7), r2 = tnFbm(vTisPos * 40.0 + 6.1);
      float red = (r1 - 0.5) * 1.1 + (r2 - 0.5) * 0.7;
      float pale = tnFbm(vTisPos * 14.0 + 9.3) - 0.5;
      tnTint = vec3(1.0 + uTisSkin.x * red, 1.0 - 0.35 * uTisSkin.x * red, 1.0 - 0.55 * uTisSkin.x * red) * (1.0 + uTisSkin.y * pale);
      tnOil = (r2 - 0.5) * uTisSkin.z;
    #endif
    #if TN_PATTERN != 5
      tnH *= tnFade;                 // (la piel desvanece cada escala de relieve por su cuenta)
    #endif
    tnShade *= mix(1.0 - uTisA.y, 1.0 + uTisA.y, m);
  }`;

// fiberMode: 'shared' si el material ya tiene el parche de fibras musculares (vFib), 'own' si el patrón de fibras
// necesita su propio atributo aFib (tendones, ligamentos, nervios), 'none' si no usa fibras.
function patchTissue(shader, pattern, fiberMode, fat) {
  const own = fiberMode === 'own';
  shader.vertexShader = shader.vertexShader
    .replace('#include <common>', `#include <common>\nvarying vec3 vTisPos;${own ? '\nattribute vec3 aFib;\nvarying vec3 vTisFib;' : ''}${fat ? '\nattribute float aFat;\nvarying float vFat;' : ''}`)
    .replace('#include <begin_vertex>', `#include <begin_vertex>\nvTisPos = position;${own ? '\nvTisFib = aFib;' : ''}${fat ? '\nvFat = aFat;' : ''}`);
  const fibDecl = own ? 'varying vec3 vTisFib;' : fiberMode === 'shared' ? '#define vTisFib vFib' : '#define vTisFib vTisPos';
  shader.fragmentShader = shader.fragmentShader
    .replace('#include <common>', `#include <common>\n#define TN_PATTERN ${pattern}\n${fibDecl}\n${NOISE_GLSL}${fat ? '\nvarying float vFat;\nuniform vec3 uTisFat;' : ''}`)
    .replace('#include <map_fragment>', `#include <map_fragment>\n${PATTERN_GLSL}
      diffuseColor.rgb *= tnShade * tnTint;
      diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * uTisB.rgb, tnDark * uTisB.a);
      ${fat ? `// Grasa lobulada: el borde se deshace con ruido.
      float tnFat = smoothstep(0.3, 0.8, vFat + (tnNoise(vTisPos * 260.0) - 0.5) * 0.5) * 0.92;
      diffuseColor.rgb = mix(diffuseColor.rgb, uTisFat * (0.9 + 0.2 * tnNoise(vTisPos * 900.0)), tnFat);` : 'float tnFat = 0.0;'}`)
    .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
      roughnessFactor = clamp(roughnessFactor + uTisA.w * (tnShade - 1.0) * -2.0 + uTisA.w * tnDark + tnOil, 0.04, 1.0);
      roughnessFactor = mix(roughnessFactor, 0.32, tnFat);`)
    .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
      if (uTisA.z > 0.0) normal = tnBump(-vViewPosition, normal, tnH * uTisA.z, faceDirection);`)
    // Luz envolvente: parte de la luz que no llega por el lado iluminado entra por la zona de sombra, teñida.
    .replace('#include <lights_physical_pars_fragment>', THREE.ShaderChunk.lights_physical_pars_fragment.replace(
      'vec3 irradiance = dotNL * directLight.color;',
      `vec3 irradiance = dotNL * directLight.color;
       float tnWrap = saturate((dot(geometryNormal, directLight.direction) + uTisSSS.a) / (1.0 + uTisSSS.a));
       reflectedLight.directDiffuse += max(tnWrap - dotNL, 0.0) * uTisSSS.rgb * directLight.color * BRDF_Lambert(material.diffuseColor);`));
}

// Textura de ruido 64³ periódica, generada una vez al cargar (≈ 0,3 s). Con mipmaps: el detalle lejano se promedia.
let noiseTex = null;
function makeNoiseTexture() {
  const N = 64, L = 16, C = 8;
  let seed = 12345;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const lat = [new Float32Array(L ** 3).map(rnd), new Float32Array(L ** 3).map(rnd)];
  const pts = new Float32Array(C ** 3 * 3).map(rnd);
  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  const value = (g, x, y, z) => {
    const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
    const fx = fade(x - xi), fy = fade(y - yi), fz = fade(z - zi);
    const at = (i, j, k) => g[((i % L + L) % L) + L * (((j % L + L) % L) + L * ((k % L + L) % L))];
    const lx = (j, k) => at(xi, j, k) + (at(xi + 1, j, k) - at(xi, j, k)) * fx;
    const ly = (k) => lx(yi, k) + (lx(yi + 1, k) - lx(yi, k)) * fy;
    return ly(zi) + (ly(zi + 1) - ly(zi)) * fz;
  };
  const data = new Uint8Array(N ** 3 * 4);
  for (let k = 0; k < N; k++) for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const o = (i + N * (j + N * k)) * 4;
    const s = L / N;
    data[o] = value(lat[0], i * s, j * s, k * s) * 255;
    data[o + 1] = value(lat[1], i * s, j * s, k * s) * 255;
    // Worley periódico: 8 celdas por eje, un punto por celda.
    const x = (i + 0.5) * C / N, y = (j + 0.5) * C / N, z = (k + 0.5) * C / N;
    const cx = Math.floor(x), cy = Math.floor(y), cz = Math.floor(z);
    let d1 = 9, d2 = 9;
    for (let dz = -1; dz <= 1; dz++) for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const gx = cx + dx, gy = cy + dy, gz = cz + dz;
      const q = (((gx % C + C) % C) + C * (((gy % C + C) % C) + C * ((gz % C + C) % C))) * 3;
      const d = Math.hypot(gx + pts[q] - x, gy + pts[q + 1] - y, gz + pts[q + 2] - z);
      if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d;
    }
    data[o + 2] = Math.min(d1, 1) * 255;
    data[o + 3] = Math.min(d2 - d1, 1) * 255;
  }
  const tex = new THREE.Data3DTexture(data, N, N, N);
  tex.wrapS = tex.wrapT = tex.wrapR = THREE.RepeatWrapping;
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}
const NOISE = { value: null };

function patchSSAO(shader) {
  shader.uniforms.uSSAO = SSAO.tex;
  shader.uniforms.uSSAOInvSize = SSAO.invSize;
  shader.uniforms.uSSAOAmount = SSAO.amount;
  shader.fragmentShader = shader.fragmentShader
    .replace('#include <common>', '#include <common>\nuniform sampler2D uSSAO;\nuniform vec2 uSSAOInvSize;\nuniform float uSSAOAmount;')
    .replace('#include <aomap_fragment>', `#include <aomap_fragment>
      #ifdef OPAQUE
      if (uSSAOAmount > 0.0) {
        float ssao = mix(1.0, texture2D(uSSAO, gl_FragCoord.xy * uSSAOInvSize).r, uSSAOAmount);
        reflectedLight.indirectDiffuse *= ssao;
        reflectedLight.directDiffuse *= mix(1.0, ssao, 0.55);    // sombra de contacto aproximada
        reflectedLight.directSpecular *= mix(1.0, ssao, 0.4);
        #if defined( USE_ENVMAP ) && defined( STANDARD )
          reflectedLight.indirectSpecular *= computeSpecularOcclusion(saturate(dot(geometryNormal, geometryViewDir)), ssao, material.roughness);
        #endif
      }
      #endif`);
}

// ── Perfiles por tejido ──────────────────────────────────────────
// rough: rugosidad · cc/ccr: barniz y su rugosidad (película húmeda) · sheen: terciopelo · spec: intensidad especular
// env: reflejos del entorno · pat: patrón · s: escala (1/m) · alb: variación de color · bump: relieve (m)
// rv: variación de rugosidad · dark: tinte de bordes/vasos y cuánto · sss: color dispersado y envoltura
const P = {
  bone: { cc: 0, spec: 0.35, env: 0.75, pat: 3, s: 650, alb: 0.07, bump: 0.00007, rv: 0.05, sss: [0.55, 0.42, 0.3, 0.25] },
  tooth: { rough: 0.32, cc: 0.15, ccr: 0.25, spec: 0.6, pat: 0, s: 300, alb: 0.04, bump: 0.00002, rv: 0.05, sss: [0.55, 0.5, 0.42, 0.3] },
  // Cartílago hialino: nacarado y translúcido, con un moteado suave; menos brillante que un plástico blanco.
  cartilage: { rough: 0.42, cc: 0.15, ccr: 0.4, spec: 0.42, env: 0.8, pat: 0, s: 160, alb: 0.09, bump: 0.00004, rv: 0.1, sss: [0.5, 0.58, 0.78, 0.7] },
  ligament: { tint: [0.9, 0.9, 0.9], rough: 0.36, cc: 0.15, ccr: 0.35, sheen: 0.5, sheenRough: 0.35, sheenColor: '#e8eef5', spec: 0.5, pat: 2, s: 1, alb: 0.08, bump: 0.00015, rv: 0.12, sss: [0.6, 0.6, 0.65, 0.35] },
  // Tendón y aponeurosis: blanco nacarado con estrías longitudinales marcadas (no un blanco liso).
  tendon: { tint: [0.84, 0.82, 0.78], rough: 0.32, cc: 0.2, ccr: 0.3, sheen: 0.6, sheenRough: 0.3, sheenColor: '#dfe8f2', spec: 0.55, pat: 2, s: 1, alb: 0.09, bump: 0.0002, rv: 0.14, sss: [0.65, 0.58, 0.5, 0.35] },
  // Músculo: relieve y brillo siguen las fibras (estrías), con un satinado rojizo en lugar de un brillo de caramelo.
  muscle: { rough: 0.5, cc: 0.22, ccr: 0.32, sheen: 0.25, sheenRough: 0.45, sheenColor: '#ff8f80', spec: 0.5, env: 0.85, pat: 2, s: 1, alb: 0.05, bump: 0.00012, rv: 0.16, sss: [0.75, 0.12, 0.08, 0.55] },
  // Corazón: grasa epicárdica amarilla en los surcos, alrededor de las coronarias (atributo aFat, lo calcula el visor).
  heart: { rough: 0.46, cc: 0.25, ccr: 0.3, sheen: 0.2, sheenRough: 0.45, sheenColor: '#ff8f80', spec: 0.5, env: 0.85, pat: 2, s: 1, alb: 0.05, bump: 0.00008, rv: 0.14, sss: [0.75, 0.12, 0.08, 0.55], fat: '#d6bb7a' },
  valve: { rough: 0.4, cc: 0.15, ccr: 0.35, sheen: 0.3, spec: 0.5, pat: 0, s: 400, alb: 0.05, bump: 0.00002, rv: 0.1, sss: [0.7, 0.6, 0.5, 0.5] },
  artery: { rough: 0.42, cc: 0.18, ccr: 0.32, spec: 0.5, pat: 0, s: 250, alb: 0.06, bump: 0.00002, rv: 0.1, sss: [0.8, 0.18, 0.12, 0.45] },
  vein: { rough: 0.4, cc: 0.18, ccr: 0.32, spec: 0.5, pat: 0, s: 250, alb: 0.06, bump: 0.00002, rv: 0.1, sss: [0.35, 0.3, 0.65, 0.45] },
  nerve: { rough: 0.45, cc: 0.1, ccr: 0.4, sheen: 0.35, sheenRough: 0.4, sheenColor: '#fff3cf', spec: 0.45, pat: 2, s: 1, alb: 0.07, bump: 0.00004, rv: 0.1, sss: [0.7, 0.6, 0.3, 0.45] },
  cortex: { rough: 0.42, cc: 0.22, ccr: 0.28, spec: 0.45, env: 0.85, pat: 4, s: 55, alb: 0.06, bump: 0.00006, rv: 0.1, dark: ['#a8505e', 0.45], sss: [0.75, 0.42, 0.4, 0.6] },
  neural: { rough: 0.45, cc: 0.18, ccr: 0.3, spec: 0.45, pat: 0, s: 220, alb: 0.05, bump: 0.00003, rv: 0.08, sss: [0.72, 0.5, 0.45, 0.55] },
  lung: { rough: 0.5, cc: 0.22, ccr: 0.25, spec: 0.5, env: 0.85, pat: 1, s: 55, alb: 0.07, bump: 0.00008, rv: 0.08, dark: ['#7a6470', 0.4], sss: [0.85, 0.35, 0.35, 0.6] },
  bronchus: { rough: 0.42, cc: 0.15, ccr: 0.3, spec: 0.5, pat: 0, s: 300, alb: 0.05, bump: 0.00003, rv: 0.08, sss: [0.7, 0.5, 0.45, 0.5] },
  // Hígado: lobulillos de ~1–2 mm (se ven de cerca) y moteado de ~1 cm que se ve a cualquier distancia.
  liver: { rough: 0.4, cc: 0.3, ccr: 0.22, spec: 0.5, env: 0.85, pat: 1, s: 160, alb: 0.12, bump: 0.00003, rv: 0.08, dark: ['#4a1812', 0.3], sss: [0.55, 0.12, 0.08, 0.35] },
  gallbladder: { rough: 0.3, cc: 0.35, ccr: 0.15, spec: 0.55, pat: 0, s: 200, alb: 0.06, bump: 0.00002, rv: 0.06, sss: [0.35, 0.55, 0.18, 0.45] },
  gut: { rough: 0.42, cc: 0.28, ccr: 0.22, spec: 0.5, env: 0.85, pat: 4, s: 45, alb: 0.07, bump: 0.00003, rv: 0.08, dark: ['#b5544c', 0.25], sss: [0.85, 0.42, 0.32, 0.6] },
  mucosa: { rough: 0.5, cc: 0.2, ccr: 0.3, sheen: 0.35, sheenRough: 0.5, sheenColor: '#ffd0c8', spec: 0.45, pat: 3, s: 900, alb: 0.06, bump: 0.00003, rv: 0.1, sss: [0.85, 0.3, 0.28, 0.6] },
  gland: { rough: 0.5, cc: 0.15, ccr: 0.35, spec: 0.45, pat: 1, s: 280, alb: 0.08, bump: 0.00006, rv: 0.1, dark: ['#a07050', 0.35], sss: [0.8, 0.55, 0.35, 0.5] },
  fat: { rough: 0.45, cc: 0.2, ccr: 0.3, spec: 0.45, pat: 1, s: 180, alb: 0.06, bump: 0.0001, rv: 0.08, dark: ['#c99a40', 0.35], sss: [0.9, 0.75, 0.35, 0.65] },
  organ: { rough: 0.4, cc: 0.3, ccr: 0.2, spec: 0.5, pat: 0, s: 180, alb: 0.07, bump: 0.00003, rv: 0.08, sss: [0.6, 0.15, 0.12, 0.4] },
  node: { rough: 0.45, cc: 0.15, ccr: 0.32, spec: 0.45, pat: 0, s: 400, alb: 0.06, bump: 0.00003, rv: 0.08, sss: [0.45, 0.6, 0.3, 0.45] },
  glossy: { rough: 0.3, cc: 0.3, ccr: 0.15, spec: 0.55, pat: 0, s: 300, alb: 0.04, bump: 0.00002, rv: 0.06, sss: [0.6, 0.6, 0.65, 0.45] },
  membrane: { rough: 0.35, cc: 0.2, ccr: 0.25, spec: 0.5, pat: 0, s: 200, alb: 0.04, bump: 0, rv: 0.05, sss: [0.7, 0.7, 0.75, 0.4] },
  // Piel (patrón 5): skin = rojeces, palidez y variación de brillo por grasa. Luz dispersada más cálida y envolvente que en
  // los demás tejidos: en la piel, la zona de sombra se ve rojiza, no gris.
  skin: { rough: 0.5, cc: 0, sheen: 0.22, sheenRough: 0.5, sheenColor: '#e8a48e', spec: 0.42, env: 0.65, pat: 5, s: 2200, alb: 0.06, bump: 0.00004, rv: 0.12, skin: [0.18, 0.1, 0.15, 0], sss: [1.0, 0.45, 0.35, 0.8] },
};

// Material de Blender/Z-Anatomy → perfil (en orden; gana el primero que coincida).
const BY_NAME = [
  [/Cornea|Lens|Vitreous|CSF|Iris|Eye$|MAT_Eye/, null],          // ojo: se deja como está (transparente o con textura)
  [/MAT_Skin/, 'skin'],
  [/Bone_/, 'bone'],
  [/Cartilage/, 'cartilage'],
  [/Ligament|Capsule|Sheath|Bursa|Fascia|Valve|Labyrinth/, 'ligament'],
  [/Tendon|Taenia|Aponeurosis/, 'tendon'],
  [/Muscle/, 'muscle'],
  [/Myocardium/, 'heart'],
  [/Pulmonary_Vein|Artery/, 'artery'],
  [/Vein|Pulmonary_Artery/, 'vein'],
  [/Nerve|Ganglion/, 'nerve'],
  [/Cortex|Cerebellum/, 'cortex'],
  [/White_Matter|Brainstem|Nucleus|Pineal|Pituitary/, 'neural'],
  [/Meninges|Pleura/, 'membrane'],
  [/Lung/, 'lung'],
  [/Bronchus|Ureter|Renal_Pelvis|Ductus/, 'bronchus'],
  [/Liver/, 'liver'],
  [/Gallbladder/, 'gallbladder'],
  [/Stomach|Small_Intestine|Colon|Bladder/, 'gut'],
  [/Mucosa|Tongue|Tonsil|Erectile/, 'mucosa'],
  [/Gland|Thyroid|Parathyroid|Adrenal|Prostate|Seminal|Thymus|Epididymis|Lacrimal|Sclera|Ciliary/, 'gland'],
  [/Fat|Omentum/, 'fat'],
  [/Kidney|Spleen/, 'organ'],
  [/Lymph_Node/, 'node'],
  [/Testis/, 'glossy'],
];

export function profileFor(material, part) {
  if (part.tissue === 'tooth') return 'tooth';
  if (part.tissue === 'cartilage') return 'cartilage';
  for (const [re, prof] of BY_NAME) if (re.test(material.name ?? '')) return prof;
  return part.system === 'skeletal' ? 'bone' : 'organ';
}

// MeshStandardMaterial no tiene barniz ni terciopelo: se pasa a MeshPhysicalMaterial conservando todo lo demás.
export function toPhysical(mat) {
  if (mat.isMeshPhysicalMaterial || !mat.isMeshStandardMaterial) return mat;
  const phys = new THREE.MeshPhysicalMaterial();
  THREE.MeshStandardMaterial.prototype.copy.call(phys, mat);
  phys.defines = { STANDARD: '', PHYSICAL: '' };
  phys.name = mat.name;
  return phys;
}

// Aplica el perfil al material (ya clonado por el visor) y le añade los parches de tejido y de oclusión.
// `addPatch(mat, key, fn)` es el sistema de parches acumulables del visor.
export function applyProfile(mat, name, addPatch, fiberMode) {
  const p = P[name];
  if (p) {
    if (p.tint) mat.color.multiply(new THREE.Color(...p.tint));
    if (p.rough !== undefined) mat.roughness = p.rough;
    if (mat.isMeshPhysicalMaterial) {
      mat.clearcoat = p.cc ?? 0;
      mat.clearcoatRoughness = p.ccr ?? 0.3;
      if (p.sheen) {
        mat.sheen = p.sheen;
        mat.sheenRoughness = p.sheenRough ?? 0.5;
        mat.sheenColor = new THREE.Color(p.sheenColor ?? '#ffffff');
      }
      mat.specularIntensity = p.spec ?? 0.5;
    }
    mat.envMapIntensity = p.env ?? 0.9;
    const dark = new THREE.Color(p.dark?.[0] ?? '#000000');
    const uniforms = {
      uTisA: { value: new THREE.Vector4(p.s, p.alb, p.bump, p.rv) },
      uTisB: { value: new THREE.Vector4(dark.r, dark.g, dark.b, p.dark?.[1] ?? 0) },
      uTisSSS: { value: new THREE.Vector4(...p.sss) },
      uTisSkin: { value: new THREE.Vector4(...(p.skin ?? [0, 0, 0, 0])) },
      uTisFat: { value: new THREE.Color(p.fat ?? '#ffffff') },
    };
    mat.userData.tejido = uniforms;          // para ajustar el perfil a mano desde la consola (en desarrollo)
    const pattern = p.pat;
    const mode = pattern === 2 ? fiberMode : fiberMode === 'shared' ? 'shared' : 'none';
    NOISE.value ??= makeNoiseTexture();
    addPatch(mat, `tis-${name}-${pattern}-${mode}${p.fat ? '-fat' : ''}`, (shader) => {
      Object.assign(shader.uniforms, uniforms, { uTisNoise: NOISE });
      patchTissue(shader, pattern, mode, !!p.fat);
    });
  }
  addPatch(mat, 'ssao', patchSSAO);
}

export const NEEDS_FIBERS = new Set(['ligament', 'tendon', 'nerve']);
