/**
 * Offline render page: /render.html?t=0..1&w=1600&h=1000
 * Draws one frame of the quarry camera path at high quality. Driven by scripts/render-frames.mjs.
 */
import * as THREE from 'three';
import { buildPit } from '../three/terrain';
import { buildContours } from '../three/contours';

const q = new URLSearchParams(location.search);
const t = Number(q.get('t') ?? 0);
const W = Number(q.get('w') ?? 1600);
const H = Number(q.get('h') ?? 1000);

const OPTS = { tiers: 7, radius: 10, depth: 14, segments: 420, seed: 7 };
const BG = new THREE.Color('#F2EFE9');

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(W, H);
renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.95;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = BG;
scene.fog = new THREE.Fog('#E9E4DA', 22, 80);

const camera = new THREE.PerspectiveCamera(34, W / H, 0.1, 200);

// Camera path: rim → floor, with a slight orbit so the ramp and props come into view.
const PATH = [
  new THREE.Vector3(18, 11, 20),
  new THREE.Vector3(14, 7.5, 15.5),
  new THREE.Vector3(10.5, 4, 11),
  new THREE.Vector3(7.5, 0.5, 7.5),
  new THREE.Vector3(5.2, -3.2, 5),
  new THREE.Vector3(3.6, -6.6, 3.4),
  new THREE.Vector3(2.6, -9.2, 2.6),
];
const curve = new THREE.CatmullRomCurve3(PATH, false, 'catmullrom', 0.5);

// Terrain with smooth normals: build indexed grid from the pit height function.
const pit = buildPit(OPTS);
const extent = OPTS.radius * 3;
const N = OPTS.segments;
const innerRings = Math.round(N * 0.75);
const ringRadius = (i: number) =>
  i <= innerRings ? (OPTS.radius * i) / innerRings : OPTS.radius + ((extent - OPTS.radius) * (i - innerRings)) / (N - innerRings);
const pos: number[] = [];
const col: number[] = [];
const idx: number[] = [];
const stoneA = new THREE.Color('#A69D8D');
const stoneB = new THREE.Color('#6F6759');
const stoneC = new THREE.Color('#CFC7B8');
const hash = (x: number, z: number) => {
  const s = Math.sin(x * 127.1 + z * 311.7) * 43758.5453;
  return s - Math.floor(s);
};
for (let i = 0; i <= N; i++) {
  const r = ringRadius(i);
  for (let a = 0; a <= N; a++) {
    const ang = (a / N) * Math.PI * 2;
    const x = Math.cos(ang) * r;
    const z = Math.sin(ang) * r;
    const y = pit.heightAt(x, z);
    pos.push(x, y, z);
    // Strata banding by height + facet noise.
    const band = 0.5 + 0.5 * Math.sin(y * 2.2 + 0.7);
    const n = hash(Math.floor(x * 1.5), Math.floor(z * 1.5));
    const c = stoneA.clone().lerp(stoneB, band * 0.6).lerp(stoneC, n * 0.25);
    // Floor and benches slightly dustier/lighter.
    const slope = Math.abs(pit.heightAt(x + 0.08, z) - y) + Math.abs(pit.heightAt(x, z + 0.08) - y);
    if (slope < 0.02) c.lerp(stoneC, 0.3); else c.lerp(stoneB, 0.35);
    // Fine grain so flat areas are not plastic.
    const g = hash(Math.floor(x * 9), Math.floor(z * 9));
    c.multiplyScalar(0.92 + 0.16 * g);
    col.push(c.r, c.g, c.b);
  }
}
for (let i = 0; i < N; i++) {
  for (let a = 0; a < N; a++) {
    const k00 = i * (N + 1) + a, k01 = k00 + 1, k10 = (i + 1) * (N + 1) + a, k11 = k10 + 1;
    idx.push(k00, k10, k11, k00, k11, k01);
  }
}
const geo = new THREE.BufferGeometry();
geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
geo.setIndex(idx);
geo.computeVertexNormals();
const terrain = new THREE.Mesh(
  geo,
  new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, metalness: 0, side: THREE.DoubleSide }),
);
terrain.receiveShadow = true;
terrain.castShadow = true;
scene.add(terrain);

// Contours: subtle survey lines.
const c = buildContours(pit, OPTS, 1);
const cg = new THREE.BufferGeometry();
cg.setAttribute('position', new THREE.Float32BufferAttribute(c.positions, 3));
const contours = new THREE.LineSegments(cg, new THREE.LineBasicMaterial({ color: '#E4561B', transparent: true, opacity: 0.55 }));
scene.add(contours);

// Props: stockpiles, crusher, trucks on the ramp.
const ramp = pit.rampSamples(64);
const floorY = -OPTS.depth;
const propMat = (hex: string, rough = 1) => new THREE.MeshStandardMaterial({ color: hex, roughness: rough });
const addMesh = (g: THREE.BufferGeometry, m: THREE.Material, p: THREE.Vector3, ry = 0) => {
  const mesh = new THREE.Mesh(g, m);
  mesh.position.copy(p);
  mesh.rotation.y = ry;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  return mesh;
};
[0.15, 0.95, 1.9, 2.8, 3.9, 4.7].forEach((a, i) => {
  const d = OPTS.radius * (0.06 + 0.06 * (i % 3));
  const r = 0.6 + 0.3 * ((i * 7) % 3);
  addMesh(new THREE.ConeGeometry(r, r * 0.85, 24), propMat(i % 2 ? '#C9C2B4' : '#9E978A'), new THREE.Vector3(Math.cos(a) * d, floorY + r * 0.425, Math.sin(a) * d));
});
const ca = ramp[ramp.length - 1].angle + Math.PI * 0.9;
const cp = new THREE.Vector3(Math.cos(ca) * OPTS.radius * 0.13, floorY, Math.sin(ca) * OPTS.radius * 0.13);
addMesh(new THREE.BoxGeometry(1.2, 1.0, 0.9), propMat('#4A4740', 0.8), cp.clone().add(new THREE.Vector3(0, 0.5, 0)), ca);
addMesh(new THREE.BoxGeometry(2.0, 0.08, 0.3), propMat('#4A4740', 0.8), cp.clone().add(new THREE.Vector3(Math.cos(ca) * 1.0, 0.85, Math.sin(ca) * 1.0)), ca).rotation.z = 0.5;
addMesh(new THREE.BoxGeometry(0.5, 0.12, 0.5), propMat('#E4561B', 0.7), cp.clone().add(new THREE.Vector3(0, 1.05, 0)), ca);
[0.28, 0.55, 0.78].forEach((f) => {
  const i = Math.floor(ramp.length * f);
  const p = ramp[i], n = ramp[Math.min(ramp.length - 1, i + 1)];
  const heading = Math.atan2(n.x - p.x, n.z - p.z);
  const base = new THREE.Vector3(p.x, p.y + 0.16, p.z);
  addMesh(new THREE.BoxGeometry(0.38, 0.22, 0.64), propMat('#5A564F'), base, heading);
  addMesh(new THREE.BoxGeometry(0.36, 0.26, 0.22), propMat('#E4561B', 0.7), base.clone().add(new THREE.Vector3(Math.sin(heading) * -0.3, 0.1, Math.cos(heading) * -0.3)), heading);
});

// Lights: warm sun with soft shadows, bright sky fill.
const sun = new THREE.DirectionalLight('#FFF1DC', 3.2);
sun.position.set(26, 16, 6);
sun.castShadow = true;
sun.shadow.mapSize.set(4096, 4096);
sun.shadow.camera.left = -22; sun.shadow.camera.right = 22; sun.shadow.camera.top = 22; sun.shadow.camera.bottom = -22;
sun.shadow.camera.near = 1; sun.shadow.camera.far = 90;
sun.shadow.bias = -0.0005;
sun.shadow.radius = 4;
scene.add(sun);
scene.add(new THREE.HemisphereLight('#DDE6F2', '#8E8678', 0.75));

// Pose camera.
const p = curve.getPointAt(t);
camera.position.copy(p);
camera.lookAt(new THREE.Vector3(-2.5 * (1 - t), -OPTS.depth * t * 0.9, 0));
camera.updateProjectionMatrix();

renderer.render(scene, camera);
(window as unknown as { __ready: boolean }).__ready = true;
