import Lenis from 'lenis';
import { useEffect } from 'react';
import { gsap, MOTION_OK, ScrollTrigger } from './gsap';

/**
 * Smooth scrolling on pointer devices only: Lenis wraps native scroll and feeds GSAP's ticker, so
 * ScrollTrigger and Lenis share one frame. Touch devices keep native scrolling (no stutter risk),
 * reduced-motion users get nothing extra.
 */
export function useLenis() {
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const ok = window.matchMedia(MOTION_OK).matches;
    if (!fine || !ok) return;
    const lenis = new Lenis({ lerp: 0.1, autoRaf: false, anchors: true, smoothWheel: true });
    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.off('scroll', onScroll);
      lenis.destroy();
    };
  }, []);
}
