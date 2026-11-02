import { describe, expect, it } from 'vitest';
import { buildPit } from '../../src/three/terrain';

const opts = { tiers: 7, radius: 10, depth: 48, segments: 64, seed: 7 };

describe('buildPit', () => {
  const pit = buildPit(opts);

  it('emits two flat-shaded triangles per grid quad', () => {
    expect(pit.positions.length).toBe(64 * 64 * 2 * 3 * 3);
    expect(pit.normals.length).toBe(pit.positions.length);
  });

  it('spans from the rim down to the pit floor', () => {
    let min = Infinity;
    let max = -Infinity;
    for (let i = 1; i < pit.positions.length; i += 3) {
      min = Math.min(min, pit.positions[i]);
      max = Math.max(max, pit.positions[i]);
    }
    expect(min).toBeGreaterThanOrEqual(-48 * 1.05);
    expect(min).toBeLessThanOrEqual(-48 * 0.9);
    expect(max).toBeLessThanOrEqual(0.5);
  });

  it('is deterministic for a given seed', () => {
    const again = buildPit(opts);
    expect(Array.from(again.positions)).toEqual(Array.from(pit.positions));
  });

  it('carves a continuous haul ramp that descends monotonically from rim to floor', () => {
    const samples = pit.rampSamples(40);
    expect(samples.length).toBe(40);
    for (let i = 1; i < samples.length; i++) {
      expect(samples[i].y).toBeLessThanOrEqual(samples[i - 1].y + 1e-6);
      // Terrain height on the ramp centreline follows the ramp, not the bench step.
      expect(Math.abs(pit.heightAt(samples[i].x, samples[i].z) - samples[i].y)).toBeLessThan(0.6);
    }
    expect(samples[0].y).toBeGreaterThan(-1);
    expect(samples[samples.length - 1].y).toBeLessThan(-opts.depth * 0.85);
  });

  it('exposes tier heights and a monotonic height function toward the rim', () => {
    expect(pit.tierHeight(0)).toBe(0);
    expect(pit.tierHeight(7)).toBe(-48);
    expect(pit.heightAt(0, 0)).toBeLessThan(pit.heightAt(9, 0));
    expect(pit.heightAt(9, 0)).toBeLessThan(pit.heightAt(14, 0));
  });
});
