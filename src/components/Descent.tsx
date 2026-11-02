import { useLayoutEffect, useRef, useState } from 'react';
import { processSteps } from '../content/process';
import { site } from '../content/site';
import { EASE_OUT, gsap, MOTION_OK, ScrollTrigger } from '../lib/gsap';
import { useScrollStore } from '../lib/scrollStore';
import { useReducedMotion } from '../lib/useReducedMotion';
import { cn } from '../lib/cn';

const STEPS = processSteps.length;
const RAIL_H = 1000; // SVG units; the rail is drawn in a 0..1000 vertical space and scaled by CSS.

function StepCard({ index, className }: { index: number; className?: string }) {
  const step = processSteps[index];
  return (
    <div data-step-card className={cn('w-full max-w-[560px] bg-bg-raised p-6 md:p-9 short:p-4 shadow-[0_24px_60px_-30px_rgba(21,19,15,.35)]', className)}>
      <span className="font-mono text-[13px] text-accent tabular-nums">{step.depthM === 0 ? '0 m' : `-${step.depthM} m`}</span>
      <h3 className="mt-2 md:mt-3 text-4xl md:text-6xl short:text-2xl font-bold text-ink leading-[0.95]">{step.title}</h3>
      <p className="mt-4 text-[15px] md:text-[17px] short:text-[14px] short:leading-snug text-stone-deep">{step.body}</p>
      <div className="mt-5 md:mt-7 short:mt-3 flex gap-1.5" aria-hidden="true">
        {processSteps.map((s, i) => (
          <span key={s.slug} className={i <= index ? 'h-1 flex-1 bg-accent' : 'h-1 flex-1 bg-hairline'} />
        ))}
      </div>
    </div>
  );
}

export function Descent() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const set = useScrollStore((s) => s.set);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el || reduced) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const pin = el.querySelector<HTMLElement>('[data-pin]')!;
      const line = el.querySelector<SVGLineElement>('[data-progress-line]')!;
      const nodes = gsap.utils.toArray<SVGCircleElement>(el.querySelectorAll('[data-node]'));
      const bands = gsap.utils.toArray<HTMLElement>(el.querySelectorAll('[data-band]'));

      gsap.set(line, { attr: { 'stroke-dasharray': RAIL_H, 'stroke-dashoffset': RAIL_H } });
      gsap.set(nodes, { scale: 0.55, transformOrigin: '50% 50%', opacity: 0.35 });

      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: 'bottom bottom',
        pin,
        pinSpacing: false,
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress;
          set({ descent: p });
          gsap.set(line, { attr: { 'stroke-dashoffset': RAIL_H * (1 - p) } });
          const next = Math.min(STEPS - 1, Math.floor(p * STEPS));
          setActive((prev) => (prev === next ? prev : next));
          nodes.forEach((n, i) => {
            const on = p >= i / (STEPS - 1) - 0.02;
            gsap.to(n, { scale: on ? 1 : 0.55, opacity: on ? 1 : 0.35, duration: 0.3, ease: EASE_OUT, overwrite: 'auto' });
          });
        },
        onToggle: (self) => set({ descentVisible: self.isActive }),
      });

      // Background bands drift upward at different speeds: the ground slides past as we sink.
      bands.forEach((b, i) => {
        gsap.fromTo(b, { yPercent: 0 }, {
          yPercent: -(18 + i * 14),
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: 0.5 },
        });
      });

      ScrollTrigger.refresh();
      return () => st.kill();
    });
    return () => {
      mm.revert();
      set({ descent: 0, descentVisible: false });
    };
  }, [reduced, set]);

  // Card swap: fade/rise the new step in.
  useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card || reduced) return;
    gsap.fromTo(card, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.38, ease: EASE_OUT, overwrite: true });
  }, [active, reduced]);

  if (reduced) {
    return (
      <section id="folyamat" ref={sectionRef} className="relative z-10 bg-bg py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-5 md:px-8">
          <h2 className="text-5xl md:text-6xl text-ink">{site.process.h2}</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {processSteps.map((_, i) => <StepCard key={i} index={i} className="border border-hairline shadow-none" />)}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="folyamat" ref={sectionRef} className="relative z-10 bg-bg" style={{ height: `${STEPS * 90}vh` }}>
      <div data-pin className="relative h-[100dvh] overflow-hidden">
        {/* Strata bands: three ground colours that drift as the section scrubs. */}
        <div aria-hidden="true" className="absolute inset-0">
          <div data-band className="absolute inset-x-0 top-[55%] h-[70%] bg-sand edge-slant" />
          <div data-band className="absolute inset-x-0 top-[78%] h-[60%] bg-sand-deep edge-slant-r" />
          <div data-band className="absolute inset-x-0 top-[96%] h-[50%] bg-stone edge-slant" />
        </div>

        <div className="relative mx-auto flex h-full max-w-[1400px] flex-col px-5 md:px-8 pt-[92px] md:pt-[112px] short:pt-[76px] pb-6 short:pb-3">
          <div className="flex items-end justify-between gap-6">
            <h2 className="text-4xl md:text-6xl short:text-2xl text-ink leading-[0.95]">{site.process.h2}</h2>
            <span className="hidden md:block font-mono text-[12px] tracking-[0.18em] text-stone">{String(active + 1).padStart(2, '0')} / {String(STEPS).padStart(2, '0')}</span>
          </div>

          <div className="relative flex flex-1 items-end pb-6 md:items-center md:pb-0 gap-6 md:gap-12">
            {/* Depth rail with 5 nodes, drawn as you scroll. */}
            <svg
              aria-hidden="true"
              viewBox={`0 0 40 ${RAIL_H}`}
              preserveAspectRatio="none"
              className="hidden md:block absolute left-0 inset-y-[12%] short:inset-y-[8%] w-10 overflow-visible"
            >
              <line x1="20" y1="0" x2="20" y2={RAIL_H} stroke="var(--hairline)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <line data-progress-line x1="20" y1="0" x2="20" y2={RAIL_H} stroke="var(--accent)" strokeWidth="3" vectorEffect="non-scaling-stroke" />
              {processSteps.map((s, i) => (
                <circle key={s.slug} data-node cx="20" cy={(i / (STEPS - 1)) * RAIL_H} r="9" fill="var(--accent)" vectorEffect="non-scaling-stroke" />
              ))}
            </svg>

            <div ref={cardRef} className="w-full md:ml-20 md:w-6/12 short:w-7/12">
              <StepCard index={active} />
            </div>

            {/* Big depth figure on the right, desktop only. */}
            <div aria-hidden="true" className="hidden lg:flex flex-1 items-center justify-end">
              <span className="font-display text-[14vw] font-bold leading-none text-ink/8 tabular-nums select-none">
                {processSteps[active].depthM === 0 ? '0' : `-${processSteps[active].depthM}`}
                <span className="text-[4vw] align-top">m</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
