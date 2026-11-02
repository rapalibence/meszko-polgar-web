import type { PitData, PitOptions } from './terrain';

export type ContourData = {
  /** Line-segment pairs, xyz per point. */
  positions: Float32Array;
  /** Height level per point (positions.length / 3). */
  levels: Float32Array;
};

const Y_OFFSET = 0.05;

/**
 * Marching squares over the sampled heightmap at every level
 * 0, -interval, -2*interval, ... down to -depth.
 */
export function buildContours(pit: PitData, opts: PitOptions, interval: number): ContourData {
  const { segments, depth } = opts;
  const extent = pit.extent;
  const cell = (extent * 2) / segments;
  const n = segments + 1;

  const grid = new Float32Array(n * n);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      grid[j * n + i] = pit.heightAt(-extent + i * cell, -extent + j * cell);
    }
  }
  const h = (i: number, j: number) => grid[j * n + i];

  const out: number[] = [];
  const lv: number[] = [];

  const lerpPoint = (
    ax: number, az: number, ah: number,
    bx: number, bz: number, bh: number,
    level: number,
  ): [number, number] => {
    const t = ah === bh ? 0.5 : (level - ah) / (bh - ah);
    return [ax + (bx - ax) * t, az + (bz - az) * t];
  };

  const levelCount = Math.floor(depth / interval);
  for (let k = 0; k <= levelCount; k++) {
    const level = -k * interval;
    // Skip the exact rim level: it would trace the whole flat outer field.
    if (level === 0) continue;
    for (let j = 0; j < segments; j++) {
      for (let i = 0; i < segments; i++) {
        const x0 = -extent + i * cell, x1 = x0 + cell;
        const z0 = -extent + j * cell, z1 = z0 + cell;
        const a = h(i, j), b = h(i + 1, j), c = h(i + 1, j + 1), d = h(i, j + 1);
        const idx = (a >= level ? 8 : 0) | (b >= level ? 4 : 0) | (c >= level ? 2 : 0) | (d >= level ? 1 : 0);
        if (idx === 0 || idx === 15) continue;

        // Edge midpoints: top (a-b), right (b-c), bottom (d-c), left (a-d)
        const top = () => lerpPoint(x0, z0, a, x1, z0, b, level);
        const right = () => lerpPoint(x1, z0, b, x1, z1, c, level);
        const bottom = () => lerpPoint(x0, z1, d, x1, z1, c, level);
        const left = () => lerpPoint(x0, z0, a, x0, z1, d, level);

        const seg = (p: [number, number], q: [number, number]) => {
          out.push(p[0], level + Y_OFFSET, p[1], q[0], level + Y_OFFSET, q[1]);
          lv.push(level, level);
        };

        switch (idx) {
          case 1: case 14: seg(left(), bottom()); break;
          case 2: case 13: seg(bottom(), right()); break;
          case 3: case 12: seg(left(), right()); break;
          case 4: case 11: seg(top(), right()); break;
          case 5: seg(left(), top()); seg(bottom(), right()); break;
          case 6: case 9: seg(top(), bottom()); break;
          case 7: case 8: seg(left(), top()); break;
          case 10: seg(top(), right()); seg(left(), bottom()); break;
        }
      }
    }
  }

  return { positions: Float32Array.from(out), levels: Float32Array.from(lv) };
}
