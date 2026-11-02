import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { site } from '../content/site';
import { EASE } from '../lib/motion';
import { useScrollStore } from '../lib/scrollStore';
import { useReducedMotion } from '../lib/useReducedMotion';
import { ButtonLink } from './ui/Button';

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const set = useScrollStore((s) => s.set);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => set({ heroVisible: e.isIntersecting }), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, [set]);

  const item = (i: number) => ({
    initial: reduced ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: EASE, delay: 0.1 + i * 0.08 },
  });

  return (
    <section id="hero" ref={ref} className="relative min-h-[100dvh] pt-[72px]">
      {/* Scrim so the headline stays legible over the pit; fades out toward the canvas. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg via-bg/75 to-transparent md:via-bg/60 md:to-55%"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />
      <div className="relative mx-auto grid max-w-[1400px] grid-cols-12 gap-x-6 px-5 md:px-8 min-h-[calc(100dvh-72px)] items-center">
        <div className="col-span-12 md:col-span-6 lg:col-span-5 py-12 md:py-0">
          <motion.p data-eyebrow {...item(0)} className="font-mono text-[12px] tracking-[0.18em] text-stone">
            {site.hero.eyebrow}
          </motion.p>
          <motion.h1 {...item(1)} className="mt-5 text-[13vw] md:text-[7.2vw] lg:text-[6.4rem] font-bold text-ink text-balance">
            {site.hero.h1}
          </motion.h1>
          <motion.p {...item(2)} className="mt-6 max-w-[46ch] text-[17px] leading-[1.55] text-stone">
            {site.hero.sub}
          </motion.p>
          <motion.div {...item(3)} className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="#kapcsolat" data-cta>{site.cta}</ButtonLink>
            <ButtonLink href="#termekek" variant="outline">{site.hero.secondary}</ButtonLink>
          </motion.div>
        </div>
        {/* Right 7/12 intentionally empty: the fixed PitScene canvas shows through. */}
        <div className="hidden md:block md:col-span-6 lg:col-span-7" aria-hidden="true" />
      </div>
    </section>
  );
}
