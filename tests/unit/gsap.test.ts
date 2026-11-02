import { describe, expect, it, vi } from 'vitest';

// jsdom has no matchMedia; GSAP probes it at registration. Must run before the import is evaluated.
vi.hoisted(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false }),
  });
});

const mod = await import('../../src/lib/gsap');

describe('gsap setup', () => {
  it('registers ScrollTrigger and exports the house ease', () => {
    expect(mod.ScrollTrigger).toBeDefined();
    expect(mod.gsap.core.globals().ScrollTrigger).toBe(mod.ScrollTrigger);
    expect(mod.EASE_OUT).toBe('power3.out');
  });
});
