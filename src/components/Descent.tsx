import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { processSteps } from '../content/process';
import { site } from '../content/site';
import { EASE } from '../lib/motion';
import { useScrollStore } from '../lib/scrollStore';
import { useReducedMotion } from '../lib/useReducedMotion';
import { hasWebGL } from '../three/webgl';

gsap.registerPlugin(ScrollTrigger);

const STEPS = processSteps.length;

function StepCard({ index }: { index: number }) {
  const step = processSteps[index];
  return (
    <div data-step-card className="w-full max-w-[520px] border border-hairline bg-bg-raised p-5 md:p-8 short:p-4">
      <span className="font-mono text-[13px] text-accent tabular-nums">{step.depthM === 0 ? '0 m' : `-${step.depthM} m`}</span>
      <h3 className="mt-2 md:mt-3 text-3xl md:text-5xl short:text-2xl font-semibold text-ink">{step.title}</h3>
      <p className="mt-3 md:mt-4 text-[15px] md:text-[17px] short:text-[14px] short:leading-snug text-stone">{step.body}</p>
      <div className="mt-4 md:mt-6 short:mt-3 flex gap-1.5" aria-hidden="true">
        {processSteps.map((s, i) => (
          <span key={s.slug} className={i <= index ? 'h-0.5 flex-1 bg-accent' : 'h-0.5 flex-1 bg-hairline'} />
        ))}
      </div>
    </div>
  );
}

export function Descent() {
  const sectionRef = useRef<HTMLElement>(null);
  const set = useScrollStore((s) => s.set);
  const reducedPref = useReducedMotion();
  // Without WebGL there is no pit to descend into: show the steps as a plain list.
  const [webgl] = useState(() => hasWebGL());
  const reduced = reducedPref || !webgl;
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || reduced) return;
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        set({ descent: self.progress });
        const next = Math.min(STEPS - 1, Math.floor(self.progress * STEPS));
        setActive((prev) => (prev === next ? prev : next));
      },
      onToggle: (self) => set({ descentVisible: self.isActive }),
    });
    // Also mark visible while the section is anywhere on screen (sticky lead-in/out).
    const io = new IntersectionObserver(([e]) => set({ descentVisible: e.isIntersecting }), { threshold: 0 });
    io.observe(el);
    return () => {
      trigger.kill();
      io.disconnect();
      set({ descent: 0, descentVisible: false });
    };
  }, [reduced, set]);

  if (reduced) {
    return (
      <section id="folyamat" ref={sectionRef} className="relative z-10 bg-bg py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8">
          <h2 className="text-5xl md:text-6xl text-ink">{site.process.h2}</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {processSteps.map((_, i) => <StepCard key={i} index={i} />)}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="folyamat" ref={sectionRef} className="relative z-10" style={{ height: `${STEPS * 100}vh` }}>
      <div data-sticky className="sticky top-0 h-[100dvh] overflow-hidden">
        {/* Scrim on the left so the card reads over the pit. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg/80 via-bg/30 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-[1400px] flex-col px-5 md:px-8 pt-[92px] md:pt-[112px] short:pt-[76px] pb-6 short:pb-3">
          <h2 className="text-3xl md:text-5xl short:text-2xl text-ink">{site.process.h2}</h2>
          <div className="flex flex-1 items-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                className="w-full md:w-5/12 short:w-7/12"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <StepCard index={active} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
