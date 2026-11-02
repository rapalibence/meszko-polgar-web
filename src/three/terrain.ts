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
  extent: number;
};

/** Fraction of a ring's width taken by the sloped face between two benches. */
const SLOPE_RING_FRACTION = 0.42;
/** Terrain spans [-extent, extent]; the rim sits at `radius`. */
const EXTENT_FACTOR = 1.4;

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

  const heightAt = (x: number, z: number): number => {
    const d = Math.hypot(x, z);
    const t = clamp01((radius - d) / radius); // 0 at rim, 1 at centre
    const u = t * tiers;
    const tier = Math.floor(u);
    const frac = u - tier;
    const ramp = clamp01(frac / SLOPE_RING_FRACTION);
    const level = Math.min(tiers, tier + ramp);
    const base = -tierStep * level;

    const onSlope = d < radius && ramp > 0 && ramp < 1;
    const insideRim = d < radius;
    const amplitude = insideRim ? (onSlope ? depth * 0.01 : depth * 0.03) : depth * 0.01;
    const n = noise(x * 0.18, z * 0.18);
    return base + n * amplitude;
  };

  const quads = segments * segments;
  const positions = new Float32Array(quads * 2 * 3 * 3);
  const normals = new Float32Array(positions.length);
  const cell = (extent * 2) / segments;

  // Cache heights on the (segments+1)^2 grid.
  const grid = new Float32Array((segments + 1) * (segments + 1));
  for (let j = 0; j <= segments; j++) {
    for (let i = 0; i <= segments; i++) {
      const x = -extent + i * cell;
      const z = -extent + j * cell;
      grid[j * (segments + 1) + i] = heightAt(x, z);
    }
  }
  const h = (i: number, j: number) => grid[j * (segments + 1) + i];

  let p = 0;
  const pushTri = (
    ax: number, ay: number, az: number,
    bx: number, by: number, bz: number,
    cx: number, cy: number, cz: number,
  ) => {
    const ux = bx - ax, uy = by - ay, uz = bz - az;
    const vx = cx - ax, vy = cy - ay, vz = cz - az;
    let nx = uy * vz - uz * vy;
    let ny = uz * vx - ux * vz;
    let nz = ux * vy - uy * vx;
    const len = Math.hypot(nx, ny, nz) || 1;
    nx /= len; ny /= len; nz /= len;
    const pts = [ax, ay, az, bx, by, bz, cx, cy, cz];
    for (let k = 0; k < 9; k += 3) {
      positions[p] = pts[k]; positions[p + 1] = pts[k + 1]; positions[p + 2] = pts[k + 2];
      normals[p] = nx; normals[p + 1] = ny; normals[p + 2] = nz;
      p += 3;
    }
  };

  for (let j = 0; j < segments; j++) {
    for (let i = 0; i < segments; i++) {
      const x0 = -extent + i * cell, x1 = x0 + cell;
      const z0 = -extent + j * cell, z1 = z0 + cell;
      const h00 = h(i, j), h10 = h(i + 1, j), h01 = h(i, j + 1), h11 = h(i + 1, j + 1);
      // Counter-clockwise when viewed from above (+y).
      pushTri(x0, h00, z0, x0, h01, z1, x1, h10, z0);
      pushTri(x1, h10, z0, x0, h01, z1, x1, h11, z1);
    }
  }

  return { positions, normals, heightAt, tierHeight, extent };
}
