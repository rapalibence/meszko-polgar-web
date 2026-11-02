import { prefersReducedMotion } from './useReducedMotion';

export const EASE = [0.23, 1, 0.32, 1] as const;
export const EASE_MOVE = [0.77, 0, 0.175, 1] as const;

const base = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.6, ease: EASE },
} as const;

/** Reveal preset. Under prefers-reduced-motion the element renders at its final state. */
export const reveal = base;

export function stagger(i: number) {
  const preset = {
    ...base,
    transition: { ...base.transition, delay: Math.min(i, 5) * 0.06 },
  };
  // Evaluated at render time so SSR/jsdom stay deterministic.
  return prefersReducedMotion() ? { ...preset, initial: false as const } : preset;
}
