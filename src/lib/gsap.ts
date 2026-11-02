import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLayoutEffect, type RefObject } from 'react';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
export const EASE_OUT = 'power3.out';
export const EASE_INOUT = 'power2.inOut';
export const REDUCED = '(prefers-reduced-motion: reduce)';
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';

/** Keep ScrollTrigger measurements honest after resizes and orientation changes. */
if (typeof window !== 'undefined') {
  let t = 0;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = window.setTimeout(() => ScrollTrigger.refresh(), 200);
  });
  // Layout shifts after first paint (web fonts, late images) would leave pins misplaced.
  window.addEventListener('load', () => ScrollTrigger.refresh());
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  document.fonts?.addEventListener('loadingdone', () => ScrollTrigger.refresh());
}

/**
 * Reveal every `[data-reveal]` under `root` once as it scrolls in: 28px rise + fade, staggered.
 * Under reduced motion nothing animates (elements render in their final state).
 */
export function useReveal(root: RefObject<HTMLElement | null>, selector = '[data-reveal]') {
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const targets = gsap.utils.toArray<HTMLElement>(el.querySelectorAll(selector));
      if (targets.length) {
        gsap.set(targets, { y: 20, opacity: 0 });
        ScrollTrigger.batch(targets, {
          start: 'top 88%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { y: 0, opacity: 1, duration: 0.6, ease: EASE_OUT, stagger: 0.06, overwrite: true }),
        });
      }
    });
    return () => mm.revert();
  }, [root, selector]);
}

/** Count a numeric figure from 0 to `to` over 0.9s when it scrolls in; renders `final` at the end. */
export function useCountUp(ref: RefObject<HTMLElement | null>, to: number | null, final: string) {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || to === null) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const obj = { v: 0 };
      el.textContent = '0';
      gsap.to(obj, {
        v: to,
        duration: 0.9,
        ease: EASE_OUT,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        onUpdate: () => { el.textContent = String(Math.round(obj.v)); },
        onComplete: () => { el.textContent = final; },
      });
    });
    return () => mm.revert();
  }, [ref, to, final]);
}
