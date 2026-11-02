import { describe, expect, it } from 'vitest';
import { buildPit } from '../../src/three/terrain';
import { buildContours } from '../../src/three/contours';

const opts = { tiers: 7, radius: 10, depth: 48, segments: 64, seed: 7 };

describe('buildContours', () => {
  const pit = buildPit(opts);
  const c = buildContours(pit, opts, 2);

  it('produces line segment pairs with a level per vertex', () => {
    expect(c.positions.length).toBeGreaterThan(0);
    expect(c.positions.length % 6).toBe(0);
    expect(c.levels.length).toBe(c.positions.length / 3);
  });

  it('places every point 0.05 above a level that is a multiple of the interval', () => {
    for (let i = 0; i < c.levels.length; i++) {
      const level = c.levels[i];
      expect(level).toBeLessThanOrEqual(0);
      expect(level).toBeGreaterThanOrEqual(-48);
      expect(Math.abs(level / 2 - Math.round(level / 2))).toBeLessThan(1e-6);
      expect(Math.abs(c.positions[i * 3 + 1] - level - 0.05)).toBeLessThan(1e-6);
    }
  });
});
