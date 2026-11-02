export const EASE = [0.23, 1, 0.32, 1] as const;
export const EASE_MOVE = [0.77, 0, 0.175, 1] as const;

export const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.6, ease: EASE },
} as const;

export function stagger(i: number) {
  return {
    ...reveal,
    transition: { ...reveal.transition, delay: Math.min(i, 5) * 0.06 },
  };
}
