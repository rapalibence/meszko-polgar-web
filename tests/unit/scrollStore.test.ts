import { describe, expect, it } from 'vitest';
import { useScrollStore } from '../../src/lib/scrollStore';
import { stagger, reveal, EASE } from '../../src/lib/motion';

describe('scroll store', () => {
  it('starts at the rim and accepts progress updates', () => {
    expect(useScrollStore.getState().descent).toBe(0);
    useScrollStore.getState().set({ descent: 0.5 });
    expect(useScrollStore.getState().descent).toBe(0.5);
  });
});

describe('motion presets', () => {
  it('caps the stagger at six items', () => {
    expect(stagger(9).transition.delay).toBeCloseTo(0.3);
    expect(stagger(2).transition.delay).toBeCloseTo(0.12);
  });
  it('uses the strong ease-out and a 600ms reveal', () => {
    expect(reveal.transition.ease).toEqual(EASE);
    expect(reveal.transition.duration).toBe(0.6);
  });
});
