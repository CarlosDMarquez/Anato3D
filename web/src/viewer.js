import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { classify } from './systems.js';
import { resolvePart } from './data/resolve.js';
import { SSAO, profileFor, toPhysical, applyProfile, NEEDS_FIBERS } from './realism.js';

// ?plain en la URL desactiva los materiales realistas (para comparar rendimiento y aspecto).
const PLAIN = new URLSearchParams(location.search).has('plain');
const HOME = { target: new THREE.Vector3(0, 0.95, 0), position: new THREE.Vector3(0, 1.05, 3.1) };

// Resalte compartido por todos los materiales seleccionados o bajo el cursor:
// tiñe la superficie y añade un brillo de borde (fresnel), como en los atlas 3D profesionales.
const HIGHLIGHT = {
  color: { value: new THREE.Color('#4da3ff') },
  sel: { value: 0 },
  hover: { value: 0.4 },
};

// Parches de shader acumulables: un material puede llevar fibras musculares y además resalte.
const PATCHES = new WeakMap();
function addPatch(mat, key, fn) {
  const list = [...(PATCHES.get(mat) ?? []), { key, fn }];
  PATCHES.set(mat, list);
  mat.onBeforeCompile = (shader) => list.forEach((p) => p.fn(shader));
  mat.customProgramCacheKey = () => list.map((p) => p.key).join('+');
}

function addHighlight(mat, kind) {
  addPatch(mat, `hl-${kind}`, (shader) => {
    shader.uniforms.uHlColor = HIGHLIGHT.color;
    shader.uniforms.uHlAmount = HIGHLIGHT[kind];
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform vec3 uHlColor;\nuniform float uHlAmount;')
      .replace('#include <map_fragment>', `#include <map_fragment>
        diffuseColor.rgb = mix(diffuseColor.rgb, uHlColor * (0.45 + 0.55 * dot(diffuseColor.rgb, vec3(0.333))), 0.62 * uHlAmount);`)
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
        float hlRim = pow(1.0 - saturate(dot(normal, normalize(vViewPosition))), 2.2);
        totalEmissiveRadiance += uHlColor * (0.08 + hlRim * 1.1) * uHlAmount;`);
  });
}

// Estrías de fibra muscular: ruido alargado en la dirección principal de cada músculo (atributo aFib).
const FIBER_GLSL = `
  varying vec3 vFib;
  float fibHash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
  float fibNoise(vec3 p) {
    vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(fibHash(i), fibHash(i + vec3(1,0,0)), f.x), mix(fibHash(i + vec3(0,1,0)), fibHash(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(fibHash(i + vec3(0,0,1)), fibHash(i + vec3(1,0,1)), f.x), mix(fibHash(i + vec3(0,1,1)), fibHash(i + vec3(1,1,1)), f.x), f.y), f.z);
  }`;
function addFibers(mat) {
  addPatch(mat, 'fiber', (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nattribute vec3 aFib;\nvarying vec3 vFib;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvFib = aFib;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${FIBER_GLSL}`)
      .replace('#include <map_fragment>', `#include <map_fragment>
        float fib = fibNoise(vFib) * 0.65 + fibNoise(vFib * 2.7) * 0.35;
        diffuseColor.rgb *= 0.74 + 0.42 * fib;`);
  });
}

// Marco de las fibras de una pieza, calculado con todas sus mallas juntas: el vientre y las partes tendinosas de un
// músculo son mallas distintas (un material por cara en Z-Anatomy) y sus fibras deben seguir la misma dirección.
function fiberFrame(geometries) {
  const P = [];
  for (const g of geometries) {
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) P.push(new THREE.Vector3().fromBufferAttribute(pos, i));
  }
  const n = P.length;
  const c = new THREE.Vector3();
  for (const p of P) c.add(p);
  c.divideScalar(n);
  const cov = [0, 0, 0, 0, 0, 0];
  const v = new THREE.Vector3();
  for (const p of P) {
    v.subVectors(p, c);
    cov[0] += v.x * v.x; cov[1] += v.x * v.y; cov[2] += v.x * v.z; cov[3] += v.y * v.y; cov[4] += v.y * v.z; cov[5] += v.z * v.z;
  }
  const axis = new THREE.Vector3(1, 1, 1).normalize();
  for (let k = 0; k < 24; k++) {
    axis.set(cov[0] * axis.x + cov[1] * axis.y + cov[2] * axis.z, cov[1] * axis.x + cov[3] * axis.y + cov[4] * axis.z,
      cov[2] * axis.x + cov[4] * axis.y + cov[5] * axis.z).normalize();
  }
  const u = new THREE.Vector3(0, 1, 0).cross(axis);
  if (u.lengthSq() < 1e-6) u.set(1, 0, 0).cross(axis);
  u.normalize();
  const w = axis.clone().cross(u);
  // Músculos en abanico (pectoral, deltoides, trapecio…): un extremo es mucho más estrecho que el otro (el tendón).
  // Sus fibras convergen hacia ese vértice en lugar de ir paralelas al eje.
  const t = P.map((p) => v.subVectors(p, c).dot(axis));
  let tMin = Infinity, tMax = -Infinity;
  for (const x of t) { if (x < tMin) tMin = x; if (x > tMax) tMax = x; }
  const end = (lo, hi) => {
    const cen = new THREE.Vector3();
    let k = 0, spread = 0;
    P.forEach((p, i) => { if (t[i] >= lo && t[i] <= hi) { cen.add(p); k++; } });
    if (!k) return { cen, spread: 0 };
    cen.divideScalar(k);
    P.forEach((p, i) => { if (t[i] >= lo && t[i] <= hi) spread += p.distanceTo(cen); });
    return { cen, spread: spread / k };
  };
  const span = tMax - tMin;
  const a = end(tMin, tMin + span * 0.15), b = end(tMax - span * 0.15, tMax);
  const [narrow, wide] = a.spread < b.spread ? [a, b] : [b, a];
  const fan = wide.spread > narrow.spread * 1.8;
  // Vértice del abanico un poco más allá del extremo estrecho, para que las fibras no se junten en un punto visible.
  const apex = narrow.cen.clone().addScaledVector(narrow.cen.clone().sub(c).normalize(), span * 0.12);
  let meanR = 0;
  if (fan) { for (const p of P) meanR += p.distanceTo(apex); meanR /= n; }
  return { axis, u, w, fan, apex, meanR };
}

// Coordenadas para las fibras: escala alta a lo ancho del músculo y baja a lo largo de sus fibras.
function addFiberAttribute(geometry, frame = fiberFrame([geometry])) {
  if (geometry.attributes.aFib) return;
  const { axis, u, w, fan, apex, meanR } = frame;
  const pos = geometry.attributes.position;
  const n = pos.count;
  const v = new THREE.Vector3(), d = new THREE.Vector3();
  const data = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    v.fromBufferAttribute(pos, i);
    if (fan) {
      d.subVectors(v, apex);
      const r = d.length();
      d.divideScalar(r || 1);
      data[i * 3] = d.dot(u) * meanR * 900;
      data[i * 3 + 1] = d.dot(w) * meanR * 900;
      data[i * 3 + 2] = r * 40;
    } else {
      data[i * 3] = v.dot(u) * 900;
      data[i * 3 + 1] = v.dot(w) * 900;
      data[i * 3 + 2] = v.dot(axis) * 40;
    }
  }
  geometry.setAttribute('aFib', new THREE.BufferAttribute(data, 3));
}

function radialTexture(size, stops) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (const [at, color] of stops) g.addColorStop(at, color);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Región externa de los genitales (male-genital-region.json, de tools/build_genital_skin.py): rejilla de vóxeles en
// coordenadas glTF; un bit por celda, 1 si queda fuera de la piel del cuerpo.
function decodeRegion(r) {
  const bytes = Uint8Array.from(atob(r.bits), (ch) => ch.charCodeAt(0));
  const [nx, ny, nz] = r.dims;
  const [ox, oy, oz] = r.origin;
  const s = r.voxel;
  return {
    box: new THREE.Box3(new THREE.Vector3(ox, oy, oz), new THREE.Vector3(ox + nx * s, oy + ny * s, oz + nz * s)),
    has(v) {
      const i = Math.floor((v.x - ox) / s), j = Math.floor((v.y - oy) / s), k = Math.floor((v.z - oz) / s);
      if (i < 0 || j < 0 || k < 0 || i >= nx || j >= ny || k >= nz) return false;
      const b = i + nx * (j + ny * k);
      return (bytes[b >> 3] >> (b & 7)) & 1;
    },
  };
}
// Piezas que se ocultan enteras con «Mostrar genitales externos» desactivado (su borde entra un poco en el cuerpo), y
// sistemas que pueden tener tramos externos (los músculos y fascias de la ingle no se recortan nunca).
const MODEST_HIDE = new Set(['Skin_Genitals']);
const MODEST_SYSTEMS = new Set(['urogenital', 'arterial', 'venous', 'nervous', 'lymphatic']);

// Las piezas izquierdas de la Fase 2 se generaron en espejo y quedaron con las caras hacia dentro.
// Un volumen con signo negativo delata una malla cerrada invertida: se invierten triángulos y normales.
function fixInvertedWinding(geometry) {
  if (geometry.userData.windingChecked) return;
  geometry.userData.windingChecked = true;
  const pos = geometry.attributes.position;
  const index = geometry.index;
  if (!index) return;
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  let volume = 0;
  for (let i = 0; i < index.count; i += 3) {
    a.fromBufferAttribute(pos, index.getX(i));
    b.fromBufferAttribute(pos, index.getX(i + 1));
    c.fromBufferAttribute(pos, index.getX(i + 2));
    volume += a.dot(b.cross(c));
  }
  if (volume >= 0) return;
  for (let i = 0; i < index.count; i += 3) {
    const t = index.getX(i + 1);
    index.setX(i + 1, index.getX(i + 2));
    index.setX(i + 2, t);
  }
  index.needsUpdate = true;
  const nrm = geometry.attributes.normal;
  if (nrm) {
    for (let i = 0; i < nrm.array.length; i++) nrm.array[i] = -nrm.array[i];
    nrm.needsUpdate = true;
  }
  geometry.userData.windingFixed = true;
}

// Escena, carga de modelos, materiales por estado (normal / translúcido / resaltado), selección y cámara.
export class Viewer extends EventTarget {
  constructor(container) {
    super();
    this.container = container;
    this.parts = [];
    this.partByMesh = new Map();
    this.pickMeshes = [];
    this.selection = new Set();
    this.hovered = null;
    this.anchor = null;
    this.hoverEnabled = true;
    this.modesty = false;        // true = genitales externos ocultos
    this.genitalRegion = null;
    this.variantCache = new Map();
    this.cache = new Map();
    this.needsRender = true;
    this.tween = null;
    this.selFade = null;
    this.insets = { top: 56, bottom: 100 };

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // Khronos PBR Neutral respeta los colores de atlas (ACES aclaraba y desaturaba los rojos: el miocardio salía salmón).
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 0.92;
    container.appendChild(renderer.domElement);
    this.renderer = renderer;
    this.physCache = new Map();

    this.scene = new THREE.Scene();
    this.scene.background = radialTexture(1024, [[0, '#1d2733'], [0.55, '#121820'], [1, '#07090c']]);
    const pmrem = new THREE.PMREMGenerator(renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.5;

    const key = new THREE.DirectionalLight(0xfff4e8, 1.55);
    key.position.set(1.6, 3, 2.6);
    const fill = new THREE.DirectionalLight(0xd8e4ff, 0.45);
    fill.position.set(-2.4, 1.2, 1.5);
    const rim = new THREE.DirectionalLight(0xa9c8ff, 1.1);
    rim.position.set(-1.5, 2.5, -3);
    this.scene.add(key, fill, rim, new THREE.HemisphereLight(0xffffff, 0x1b222b, 0.5));

    // Sombra de contacto suave bajo los pies.
    this.ground = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({
        map: radialTexture(256, [[0, 'rgba(0,0,0,0.6)'], [0.45, 'rgba(0,0,0,0.25)'], [1, 'rgba(0,0,0,0)']]),
        transparent: true, depthWrite: false, toneMapped: false,
      }),
    );
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.renderOrder = -1;
    this.scene.add(this.ground);

    this.camera = new THREE.PerspectiveCamera(32, 1, 0.01, 50);
    // Oclusión ambiental (GTAO): se calcula en una textura antes de cada fotograma y cada material la aplica a la luz
    // indirecta (y en parte a la directa), no como una capa oscura encima de la imagen.
    this.aoEnabled = true;
    this.ao = new GTAOPass(this.scene, this.camera, 2, 2);
    this.ao.output = GTAOPass.OUTPUT.Off;
    this.ao.updateGtaoMaterial({ radius: 0.045, distanceExponent: 1.2, thickness: 0.6, distanceFallOff: 1, scale: 1.15, samples: 16 });
    this.ao.updatePdMaterial({ radius: 6, rings: 2, samples: 16, lumaPhi: 10, depthPhi: 2, normalPhi: 3 });
    SSAO.tex.value = this.ao.pdRenderTarget.texture;
    this.camera.position.copy(HOME.position);
    this.controls = new OrbitControls(this.camera, renderer.domElement);
    this.controls.target.copy(HOME.target);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.12;
    this.controls.minDistance = 0.08;
    this.controls.maxDistance = 7;
    this.controls.zoomToCursor = true;
    this.controls.addEventListener('change', () => (this.needsRender = true));

    const draco = new DRACOLoader().setDecoderPath('/draco/');
    this.loader = new GLTFLoader().setDRACOLoader(draco);

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.#bindPointer();

    new ResizeObserver(() => this.resize()).observe(container);
    this.resize();
    renderer.setAnimationLoop(() => this.#frame());
  }

  get selected() {
    return [...this.selection];
  }

  resize() {
    const { clientWidth: w, clientHeight: h } = this.container;
    if (!w || !h) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    const buf = this.renderer.getDrawingBufferSize(new THREE.Vector2());
    this.ao.setSize(buf.x, buf.y);
    SSAO.invSize.value.set(1 / buf.x, 1 / buf.y);
    this.needsRender = true;
  }

  // Calidad baja: resolución 1:1 y sin oclusión ambiental (es el paso más caro: dibuja la escena una vez más).
  setQuality(high) {
    this.renderer.setPixelRatio(high ? Math.min(window.devicePixelRatio, 2) : 1);
    this.aoEnabled = high;
    this.resize();
  }

  setAO(on) {
    this.aoEnabled = on;
    this.needsRender = true;
  }

  // Calcula la oclusión con las piezas opacas visibles (sin el suelo ni las translúcidas, que no deben tapar nada).
  #renderAO() {
    const hidden = [];
    const hide = (o) => { if (o.visible) { o.visible = false; hidden.push(o); } };
    hide(this.ground);
    for (const part of this.parts) {
      if (!part.visible) continue;
      for (const m of part.meshes) if (m.material.transparent) hide(m);
    }
    this.ao.render(this.renderer, null, null);
    for (const o of hidden) o.visible = true;
    this.renderer.setRenderTarget(null);
  }

  // Perfil de tejido (realism.js): brillo, variación de color, relieve fino, luz dispersada y oclusión.
  #realism(base, part) {
    const prof = profileFor(base, part);
    const fiberMode = PATCHES.get(base)?.some((p) => p.key === 'fiber') ? 'shared' : NEEDS_FIBERS.has(prof) ? 'own' : 'none';
    let src = base;
    if (prof && !base.isMeshPhysicalMaterial) {
      if (!this.physCache.has(base)) {
        const phys = toPhysical(base);
        for (const p of PATCHES.get(base) ?? []) addPatch(phys, p.key, p.fn);
        this.physCache.set(base, phys);
      }
      src = this.physCache.get(base);
    }
    return { prof, fiberMode, mat: this.#variant(src, `real-${prof}`, (mat) => applyProfile(mat, prof, addPatch, fiberMode)) };
  }

  async loadModel(url, onProgress) {
    let gltf = this.cache.get(url);
    if (!gltf) {
      gltf = await this.loader.loadAsync(url, (e) => e.total && onProgress?.(e.loaded / e.total));
      this.cache.set(url, gltf);
    }
    for (const r of this.roots ?? []) this.scene.remove(r);
    this.select([]);
    this.partByMesh.clear();
    this.root = gltf.scene;
    this.roots = [this.root];
    this.scene.add(this.root);
    this.parts = this.#collectParts(this.root);
    const box = new THREE.Box3().setFromObject(this.root);
    const center = box.getCenter(new THREE.Vector3());
    this.ground.position.set(center.x, box.min.y + 0.001, center.z + 0.02);
    this.ground.scale.set(0.95, 0.6, 1);
    this.needsRender = true;
    return this.parts;
  }

  // Añade el GLB de un sistema (p. ej. el muscular) al modelo cargado; se descarga solo al activarlo.
  async addSystem(url, onProgress) {
    let gltf = this.cache.get(url);
    if (!gltf) {
      gltf = await this.loader.loadAsync(url, (e) => e.total && onProgress?.(e.loaded / e.total));
      this.cache.set(url, gltf);
    }
    if (this.roots.includes(gltf.scene)) return [];
    this.roots.push(gltf.scene);
    this.scene.add(gltf.scene);
    const parts = this.#collectParts(gltf.scene);
    this.parts.push(...parts);
    if (this.modesty) this.#applyModesty(parts);
    this.#epicardialFat();
    return parts;
  }

  // Grasa epicárdica: en el corazón real está en los surcos, donde se juntan las cavidades: el surco coronario
  // (aurículas con ventrículos) y los interventriculares (ventrículo derecho con izquierdo). Peso por vértice según la
  // distancia a la cavidad vecina (con las ramas de las coronarias salía una red amarilla por todo el corazón).
  #epicardialFat() {
    const ch = (re) => this.parts.find((p) => re.test(p.id) && p.tissue === 'heart');
    const RA = ch(/^Right_atrium$/), LA = ch(/^Left_atrium$/), RV = ch(/^Right_ventricle$/), LV = ch(/^Left_ventricle$/);
    if (!RA || !LA || !RV || !LV || [RA, LA, RV, LV].every((p) => p.meshes.every((m) => m.geometry.attributes.aFat))) return;
    const v = new THREE.Vector3();
    const points = (parts) => {
      const out = [];
      for (const p of parts) for (const m of p.meshes) {
        m.updateWorldMatrix(true, false);
        const pos = m.geometry.attributes.position;
        for (let i = 0; i < pos.count; i += 2) out.push(v.fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld).clone());
      }
      return out;
    };
    const grid = (pts, cell) => {
      const g = new Map();
      for (const q of pts) {
        const k = `${Math.floor(q.x / cell)},${Math.floor(q.y / cell)},${Math.floor(q.z / cell)}`;
        if (!g.has(k)) g.set(k, []);
        g.get(k).push(q);
      }
      return { g, cell };
    };
    const near = ({ g, cell }, q, R) => {
      const cx = Math.floor(q.x / cell), cy = Math.floor(q.y / cell), cz = Math.floor(q.z / cell);
      let best = R;
      for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) for (let dz = -1; dz <= 1; dz++) {
        for (const o of g.get(`${cx + dx},${cy + dy},${cz + dz}`) ?? []) best = Math.min(best, o.distanceTo(q));
      }
      return best;
    };
    const AV = 0.013, IV = 0.011;
    const atria = grid(points([RA, LA]), AV), ventricles = grid(points([RV, LV]), AV);
    const rv = grid(points([RV]), IV), lv = grid(points([LV]), IV);
    const weight = (d, R) => { const t = Math.min(Math.max((R - d) / (R * 0.75), 0), 1); return t * t * (3 - 2 * t); };
    for (const [part, other, ivGrid] of [[RA, ventricles, null], [LA, ventricles, null], [RV, atria, lv], [LV, atria, rv]]) {
      for (const m of part.meshes) {
        const pos = m.geometry.attributes.position;
        const fat = new Float32Array(pos.count);
        for (let i = 0; i < pos.count; i++) {
          v.fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld);
          let f = weight(near(other, v, AV), AV);
          if (ivGrid) f = Math.max(f, weight(near(ivGrid, v, IV), IV) * 0.85);
          fat[i] = f;
        }
        m.geometry.setAttribute('aFat', new THREE.BufferAttribute(fat, 1));
      }
    }
    this.needsRender = true;
  }

  // ── Genitales externos (opción de los ajustes) ──
  setGenitalRegion(region) {
    this.genitalRegion = region ? decodeRegion(region) : null;
    this.#applyModesty(this.parts);
  }

  setModesty(on) {
    this.modesty = on;
    this.#applyModesty(this.parts);
  }

  // Con la opción activa, quita de cada malla los triángulos con algún vértice en la región externa: la uretra o el
  // conducto deferente pierden solo su tramo externo, y la raíz del pene, dentro del periné, se mantiene.
  #applyModesty(parts) {
    const R = this.genitalRegion;
    for (const part of parts) {
      if (this.modesty && R && part.modestEmpty === undefined) part.modestEmpty = this.#modestCut(part, R);
      for (const m of part.meshes) {
        if (!m.userData.modestIndex) continue;
        m.geometry.setIndex(this.modesty && R ? m.userData.modestIndex : m.userData.fullIndex);
      }
    }
    this.needsRender = true;
  }

  // Calcula el índice recortado de cada malla de la pieza (una sola vez por malla); devuelve si queda vacía.
  #modestCut(part, R) {
    if (MODEST_HIDE.has(part.id)) return true;
    if (!MODEST_SYSTEMS.has(part.system)) return false;
    let empty = true;
    const v = new THREE.Vector3();
    for (const m of part.meshes) {
      const g = m.geometry;
      if (!('modestIndex' in m.userData)) {
        m.userData.modestIndex = null;
        m.updateWorldMatrix(true, false);
        if (!g.boundingBox) g.computeBoundingBox();
        const full = g.index;
        if (full && g.boundingBox.clone().applyMatrix4(m.matrixWorld).intersectsBox(R.box)) {
          const pos = g.attributes.position;
          const out = new Uint8Array(pos.count);
          let any = false;
          for (let i = 0; i < pos.count; i++) {
            if (R.has(v.fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld))) { out[i] = 1; any = true; }
          }
          if (any) {
            const keep = [];
            for (let t = 0; t < full.count; t += 3) {
              const a = full.getX(t), b = full.getX(t + 1), c = full.getX(t + 2);
              if (!out[a] && !out[b] && !out[c]) keep.push(a, b, c);
            }
            m.userData.fullIndex = full;
            m.userData.modestIndex = new THREE.BufferAttribute(pos.count > 65535 ? new Uint32Array(keep) : new Uint16Array(keep), 1);
          }
        }
      }
      if (!m.userData.modestIndex || m.userData.modestIndex.count) empty = false;
    }
    return empty;
  }

  #collectParts(root) {
    const parts = [];
    root.traverse((node) => {
      const extras = node.userData ?? {};
      const cls = extras.system && classify(extras);
      if (!cls) return;
      const meshes = [];
      node.traverse((o) => o.isMesh && meshes.push(o));
      if (!meshes.length) return;
      const groups = [];
      for (let p = node.parent; p && p !== root; p = p.parent) groups.push(p.name);
      const part = {
        id: node.name,
        node,
        meshes,
        extras,
        groups,
        system: cls.system,
        subsystem: cls.subsystem ?? extras.subsystem ?? null,
        tissue: extras.tissue ?? null,
        layer: extras.layer ?? 1,
        major: !!extras.major,
        sheet: !!extras.sheet,
        info: resolvePart(node.name, extras),
        visible: true,
        ghost: false,
      };
      for (const m of meshes) {
        if (part.system === 'skeletal' || extras.system === 'skeletal') fixInvertedWinding(m.geometry);
        let base = m.material;
        if (part.tissue === 'cartilage') base = this.#variant(base, 'cartilage', (mat) => {
          // El cartílago hialino es blanco azulado y nacarado. Sin la textura del hueso: multiplicada por el azul daba
          // un gris oliva, como de plástico.
          mat.map = null;
          mat.color = new THREE.Color('#bac5d3');
          mat.roughness = 0.4;
        });
        if (part.system === 'integumentary') base = this.#variant(base, 'skin', (mat) => {
          // Tono de piel más cálido y satinado: con la iluminación de estudio el original se veía casi blanco.
          mat.color.multiply(new THREE.Color(0.8, 0.6, 0.52));
          Object.assign(mat, { specularIntensity: 0.45, roughness: 0.62, sheen: 0.35, sheenRoughness: 0.6 });
          mat.sheenColor = new THREE.Color('#d8907a');
        });
        const frame = () => (part.fiberFrame ??= fiberFrame(meshes.map((x) => x.geometry)));
        const tendinous = /Tendon|Aponeurosis/.test(base.name ?? '');
        if (((part.system === 'muscular' && part.tissue === 'muscle') || part.tissue === 'heart') && !tendinous) {
          addFiberAttribute(m.geometry, frame());
          base = this.#variant(base, 'fiber', (mat) => {
            addFibers(mat);
            // Rojo de músculo fresco, como en los atlas: medido contra una referencia, el anterior quedaba un 15 % más
            // oscuro y algo pardo (sRGB 140, 58, 45 frente a 165, 63, 52).
            mat.color.multiply(new THREE.Color(0.88, 0.6, 0.6));
          });
        }
        if (!PLAIN) {
          const real = this.#realism(base, part);
          if (real.fiberMode === 'own') addFiberAttribute(m.geometry, frame());
          base = real.mat;
        }
        // Su AO horneado salió oscuro por las caras invertidas; hasta re-hornearlo, se omite.
        if (m.geometry.userData.windingFixed) base = this.#variant(base, 'noAO', (mat) => (mat.aoMap = null));
        // Aponeurosis de los músculos anchos del abdomen: blanca; su opacidad viene por vértice (alfa del color): velo
        // delante del recto (vaina anterior), que deja verlo, y blanca a sus lados.
        // Láminas musculares de la piel (platisma): translúcidas, dejan ver lo que cubren.
        if (/Aponeurosis/.test(base.name ?? '')) base = this.#variant(base, 'apo', (mat) => Object.assign(mat, { transparent: true, depthWrite: false }));
        else if (part.sheet) base = this.#variant(base, 'skinsheet', (mat) => Object.assign(mat, { transparent: true, opacity: 0.3, depthWrite: false }));
        m.userData.baseMaterial ??= base;
        this.partByMesh.set(m, part);
      }
      parts.push(part);
    });
    return parts;
  }

  #variant(base, name, edit) {
    const key = `${base.uuid}|${name}`;
    if (!this.variantCache.has(key)) {
      const mat = base.clone();
      for (const p of PATCHES.get(base) ?? []) addPatch(mat, p.key, p.fn);
      edit(mat);
      this.variantCache.set(key, mat);
    }
    return this.variantCache.get(key);
  }

  #material(base, ghost, highlight) {
    if (!ghost && !highlight) return base;
    return this.#variant(base, `${ghost ? 'ghost' : ''}${highlight ?? ''}`, (mat) => {
      if (ghost) Object.assign(mat, { transparent: true, opacity: 0.16, depthWrite: false });
      if (highlight) addHighlight(mat, highlight);
    });
  }

  #applyMaterials(part) {
    const hl = this.selection.has(part) ? 'sel' : part === this.hovered ? 'hover' : null;
    for (const m of part.meshes) {
      m.material = this.#material(m.userData.baseMaterial, part.ghost, hl);
      m.renderOrder = part.ghost ? 2 : 0;
    }
  }

  // Aplica visibilidad y transparencia calculadas por la app.
  updateParts() {
    this.pickMeshes = [];
    for (const part of this.parts) {
      if (!part.visible) {
        this.selection.delete(part);
        if (part === this.hovered) this.hovered = null;
      }
    }
    for (const part of this.parts) {
      part.node.visible = part.visible;
      this.#applyMaterials(part);
      if (part.visible && !part.ghost) this.pickMeshes.push(...part.meshes);
    }
    this.ground.visible = this.parts.some((p) => p.visible);
    if (!this.selection.size) this.anchor = null;
    this.needsRender = true;
  }

  // Selecciona una o varias partes; `anchor` es el punto 3D donde se clava la etiqueta.
  select(parts, anchor = null) {
    const prev = this.selection;
    this.selection = new Set([].concat(parts ?? []));
    for (const p of new Set([...prev, ...this.selection])) this.#applyMaterials(p);
    this.anchor = this.selection.size ? (anchor?.clone() ?? this.#center(this.selected)) : null;
    if (this.selection.size) this.selFade = performance.now();
    this.needsRender = true;
  }

  setHover(part) {
    if (part === this.hovered) return;
    const prev = this.hovered;
    this.hovered = part;
    for (const p of [prev, part]) if (p) this.#applyMaterials(p);
    this.needsRender = true;
  }

  // Posición en pantalla del ancla de la etiqueta.
  anchorScreen() {
    if (!this.anchor) return null;
    const v = this.anchor.clone().project(this.camera);
    const { clientWidth: w, clientHeight: h } = this.container;
    return { x: ((v.x + 1) / 2) * w, y: ((1 - v.y) / 2) * h, visible: v.z < 1 && Math.abs(v.x) < 1.05 && Math.abs(v.y) < 1.05 };
  }

  #center(parts) {
    const box = new THREE.Box3();
    for (const p of parts) for (const m of p.meshes) box.expandByObject(m);
    return box.isEmpty() ? null : box.getCenter(new THREE.Vector3());
  }

  // Encuadra una o varias partes con una transición suave.
  focus(parts) {
    const box = new THREE.Box3();
    for (const p of [].concat(parts)) for (const m of p.meshes) box.expandByObject(m);
    if (box.isEmpty()) return;
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    const radius = Math.max(sphere.radius, 0.07);
    // Encaja la esfera en el hueco libre (entre barras y, en móvil, encima de la ficha).
    const H = this.container.clientHeight;
    const { top, bottom } = this.insets;
    const avail = Math.max(H - top - bottom, H * 0.25);
    const vHalf = THREE.MathUtils.degToRad(this.camera.fov / 2);
    const hHalf = Math.atan(Math.tan(vHalf) * this.camera.aspect);
    const dist = Math.max((radius / Math.sin(vHalf)) * (H / avail), radius / Math.sin(hHalf)) * 1.2;
    const dir = this.camera.position.clone().sub(this.controls.target).normalize();
    const perPx = (2 * dist * Math.tan(vHalf)) / H;
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(this.camera.quaternion);
    const target = sphere.center.clone().addScaledVector(up, -(H / 2 - (top + avail / 2)) * perPx);
    this.#animateTo(target, target.clone().add(dir.multiplyScalar(dist)));
  }

  // Vista inicial: el cuerpo entero cabe en el hueco libre entre la barra superior y la barra de sistemas.
  #homeView(dir = new THREE.Vector3(0, 0.03, 1)) {
    const box = new THREE.Box3();
    for (const p of this.parts) if (p.visible) for (const m of p.meshes) box.expandByObject(m);
    if (box.isEmpty() && this.root) box.setFromObject(this.root);
    if (box.isEmpty()) return { target: HOME.target, position: HOME.position };
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const H = this.container.clientHeight;
    const { top, bottom } = this.insets;
    const avail = Math.max(H - top - bottom, H * 0.4);
    const tan = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    const perPx = Math.max((size.y * 1.06) / avail, (size.x * 1.15) / (this.container.clientWidth || 1));
    const dist = (perPx * H) / (2 * tan) + size.z / 2;
    const target = center.clone();
    target.y -= (H / 2 - (top + avail / 2)) * perPx;
    return { target, position: target.clone().add(dir.normalize().multiplyScalar(dist)) };
  }

  home() {
    const v = this.#homeView();
    this.#animateTo(v.target, v.position);
  }

  view(name) {
    const home = this.#homeView();
    const d = home.position.distanceTo(home.target);
    const dirs = {
      anterior: [0, 0.03, 1], posterior: [0, 0.03, -1], izquierda: [1, 0.03, 0],
      derecha: [-1, 0.03, 0], superior: [0, 1, 0.001],
    };
    const dir = new THREE.Vector3(...dirs[name]).normalize().multiplyScalar(d);
    this.#animateTo(home.target, home.target.clone().add(dir));
  }

  #animateTo(target, position) {
    this.tween = {
      t0: performance.now(), dur: 650,
      fromT: this.controls.target.clone(), toT: target.clone(),
      fromP: this.camera.position.clone(), toP: position.clone(),
    };
  }

  setAutoRotate(on) {
    this.controls.autoRotate = on;
    this.controls.autoRotateSpeed = 1.2;
  }

  #frame() {
    if (this.tween) {
      const tw = this.tween;
      const k = Math.min((performance.now() - tw.t0) / tw.dur, 1);
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      this.controls.target.lerpVectors(tw.fromT, tw.toT, e);
      this.camera.position.lerpVectors(tw.fromP, tw.toP, e);
      if (k === 1) this.tween = null;
      this.needsRender = true;
    }
    this.controls.update();
    if (this.selFade !== null) {
      const k = Math.min((performance.now() - this.selFade) / 260, 1);
      HIGHLIGHT.sel.value = 1 - Math.pow(1 - k, 3);
      if (k === 1) this.selFade = null;
      this.needsRender = true;
    }
    if (this.controls.autoRotate) this.needsRender = true;
    if (!this.needsRender) return;
    this.needsRender = false;
    SSAO.amount.value = this.aoEnabled ? 1 : 0;
    if (this.aoEnabled) this.#renderAO();
    this.renderer.render(this.scene, this.camera);
    this.dispatchEvent(new Event('render'));
  }

  #pick(clientX, clientY) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.pointer.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hit = this.raycaster.intersectObjects(this.pickMeshes, false)[0];
    return hit ? { part: this.partByMesh.get(hit.object), point: hit.point } : { part: null, point: null };
  }

  #bindPointer() {
    const el = this.renderer.domElement;
    let down = null;
    let lastHover = 0;
    el.addEventListener('pointerdown', (e) => {
      down = { x: e.clientX, y: e.clientY };
      this.tween = null;
    });
    el.addEventListener('pointerup', (e) => {
      if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) return;
      this.dispatchEvent(new CustomEvent('pick', { detail: this.#pick(e.clientX, e.clientY) }));
    });
    el.addEventListener('dblclick', (e) => {
      const { part } = this.#pick(e.clientX, e.clientY);
      if (part) this.focus(part);
    });
    el.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse' || !this.hoverEnabled || e.buttons) return;
      const now = performance.now();
      if (now - lastHover < 60) return;
      lastHover = now;
      const { part } = this.#pick(e.clientX, e.clientY);
      el.style.cursor = part ? 'pointer' : 'grab';
      this.setHover(part);
      this.dispatchEvent(new CustomEvent('hover', { detail: { part, x: e.clientX, y: e.clientY } }));
    });
    el.addEventListener('pointerleave', () => {
      this.setHover(null);
      this.dispatchEvent(new CustomEvent('hover', { detail: { part: null } }));
    });
  }
}
