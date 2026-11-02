import { createNoise2D } from 'simplex-noise';

export type PitOptions = {
  tiers: number;
  radius: number;
  depth: number;
  segments: number;
  seed: number;
};

export type PitData = {
  positions: Float32Array;
  normals: Float32Array;
  heightAt(x: number, z: number): number;
  tierHeight(i: number): number;
  /** Points along the haul-ramp centreline from rim (i=0) to floor. */
  rampSamples(count: number): { x: number; y: number; z: number; angle: number }[];
  extent: number;
};

/** Haul ramp: a helix from rim to floor. */
const RAMP_TURNS = 1.15;
const RAMP_START_ANGLE = -0.9;
const RAMP_HALF_WIDTH = 0.95; // world units across the ramp
const RAMP_INNER = 0.22; // ramp ends at this fraction of radius (the floor)

/** Fraction of a ring's width taken by the sloped face between two benches. */
const SLOPE_RING_FRACTION = 0.3;
/** Terrain reaches `extent` from the centre; the rim sits at `radius`. */
const EXTENT_FACTOR = 3;
/** Share of rings spent inside the rim, where the benches need resolution. */
const INNER_RING_SHARE = 0.75;

function lcg(seed: number): () => number {
  let s = (seed >>> 0) || 1;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function buildPit(opts: PitOptions): PitData {
  const { tiers, radius, depth, segments, seed } = opts;
  const noise = createNoise2D(lcg(seed));
  const extent = radius * EXTENT_FACTOR;
  const tierStep = depth / tiers;

  const tierHeight = (i: number) => 0 - tierStep * Math.min(tiers, Math.max(0, i)) + 0;

  // Ramp geometry in polar terms: at distance d (rim=radius → floor=RAMP_INNER*radius)
  // the centreline angle is start + progress * turns * 2π, and its height follows the pit slope.
  const rampProgress = (d: number) => clamp01((radius - d) / (radius * (1 - RAMP_INNER)));
  const rampAngleAt = (d: number) => RAMP_START_ANGLE + rampProgress(d) * RAMP_TURNS * Math.PI * 2;
  const rampHeightAt = (d: number) => -depth * rampProgress(d);
  const angDiff = (a: number, b: number) => {
    let x = a - b;
    while (x > Math.PI) x -= Math.PI * 2;
    while (x < -Math.PI) x += Math.PI * 2;
    return x;
  };

  const heightAt = (x: number, z: number): number => {
    // Low-frequency wobble so the benches are not perfect circles.
    const wobble = noise(x * 0.05 + 31, z * 0.05 - 17) * radius * 0.06;
    const d = Math.hypot(x, z) + wobble;
    const t = clamp01((radius - d) / radius); // 0 at rim, 1 at centre
    const u = t * tiers;
    const tier = Math.floor(u);
    const frac = u - tier;
    const ramp = clamp01(frac / SLOPE_RING_FRACTION);
    const level = Math.min(tiers, tier + ramp);
    const base = -tierStep * level;

    const onSlope = d < radius && ramp > 0 && ramp < 1;
    const insideRim = d < radius;
    const amplitude = insideRim ? (onSlope ? depth * 0.004 : depth * 0.012) : depth * 0.01;
    const n = noise(x * 0.12, z * 0.12);
    const bench = base + n * amplitude;

    // Carve the haul ramp: blend toward the ramp height within its angular width.
    const dRaw = Math.hypot(x, z);
    if (dRaw < radius * 1.02 && dRaw > radius * RAMP_INNER * 0.9) {
      const a = Math.atan2(z, x);
      const across = Math.abs(angDiff(a, rampAngleAt(dRaw))) * Math.max(dRaw, 0.5);
      if (across < RAMP_HALF_WIDTH * 1.6) {
        const k = 1 - clamp01((across - RAMP_HALF_WIDTH) / (RAMP_HALF_WIDTH * 0.6));
        return bench + (rampHeightAt(dRaw) - bench) * k;
      }
    }
    return bench;
  };

  const rampSamples = (count: number) =>
    Array.from({ length: count }, (_, i) => {
      const d = radius - (i / (count - 1)) * radius * (1 - RAMP_INNER);
      const angle = rampAngleAt(d);
      return { x: Math.cos(angle) * d, z: Math.sin(angle) * d, y: rampHeightAt(d), angle };
    });

  // Polar grid: `segments` rings x `segments` angular steps. Rings follow the
  // benches, so terrace faces triangulate cleanly (no sawtooth).
  const quads = segments * segments;
  const positions = new Float32Array(quads * 2 * 3 * 3);
  const normals = new Float32Array(positions.length);
  const innerRings = Math.round(segments * INNER_RING_SHARE);
  const ringRadius = (i: number) =>
    i <= innerRings
      ? (radius * i) / innerRings
      : radius + ((extent - radius) * (i - innerRings)) / (segments - innerRings);

  const n = segments + 1;
  const gx = new Float32Array(n * n);
  const gz = new Float32Array(n * n);
  const gh = new Float32Array(n * n);
  for (let i = 0; i <= segments; i++) {
    const r = ringRadius(i);
    for (let a = 0; a <= segments; a++) {
      const ang = (a / segments) * Math.PI * 2;
      const x = Math.cos(ang) * r;
      const z = Math.sin(ang) * r;
      const k = i * n + a;
      gx[k] = x; gz[k] = z; gh[k] = heightAt(x, z);
    }
  }

  let p = 0;
  const pushTri = (a: number, b: number, c: number) => {
    const ax = gx[a], ay = gh[a], az = gz[a];
    const bx = gx[b], by = gh[b], bz = gz[b];
    const cx = gx[c], cy = gh[c], cz = gz[c];
    const ux = bx - ax, uy = by - ay, uz = bz - az;
    const vx = cx - ax, vy = cy - ay, vz = cz - az;
    let nx = uy * vz - uz * vy;
    let ny = uz * vx - ux * vz;
    let nz = ux * vy - uy * vx;
    const len = Math.hypot(nx, ny, nz) || 1;
    nx /= len; ny /= len; nz /= len;
    if (ny < 0) { nx = -nx; ny = -ny; nz = -nz; }
    const pts = [ax, ay, az, bx, by, bz, cx, cy, cz];
    for (let k = 0; k < 9; k += 3) {
      positions[p] = pts[k]; positions[p + 1] = pts[k + 1]; positions[p + 2] = pts[k + 2];
      normals[p] = nx; normals[p + 1] = ny; normals[p + 2] = nz;
      p += 3;
    }
  };

  for (let i = 0; i < segments; i++) {
    for (let a = 0; a < segments; a++) {
      const k00 = i * n + a, k01 = i * n + a + 1;
      const k10 = (i + 1) * n + a, k11 = (i + 1) * n + a + 1;
      pushTri(k00, k10, k11);
      pushTri(k00, k11, k01);
    }
  }

  return { positions, normals, heightAt, tierHeight, rampSamples, extent };
}
