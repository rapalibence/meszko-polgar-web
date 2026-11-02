import { describe, expect, it } from 'vitest';
import { useScrollStore } from '../../src/lib/scrollStore';

describe('scroll store', () => {
  it('starts at the rim and accepts progress updates', () => {
    expect(useScrollStore.getState().descent).toBe(0);
    useScrollStore.getState().set({ descent: 0.5 });
    expect(useScrollStore.getState().descent).toBe(0.5);
  });
});

