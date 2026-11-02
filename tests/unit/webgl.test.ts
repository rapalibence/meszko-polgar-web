import { describe, expect, it } from 'vitest';
import { hasWebGL } from '../../src/three/webgl';

describe('hasWebGL', () => {
  it('returns false in jsdom without throwing', () => {
    expect(hasWebGL()).toBe(false);
  });
});
