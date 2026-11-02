import { useLayoutEffect, useRef } from 'react';
import { processSteps } from '../content/process';
import { site } from '../content/site';
import { EASE_OUT, gsap, MOTION_OK, ScrollTrigger, useReveal } from '../lib/gsap';

/** Five columns (horizontal scroll-snap on phones). Each column's top rule fills in as it enters. */
export function Process() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const rules = gsap.utils.toArray<HTMLElement>(el.querySelectorAll('[data-rule]'));
      gsap.set(rules, { scaleX: 0, transformOrigin: '0 50%' });
      ScrollTrigger.batch(rules, {
        start: 'top 85%',
        once: true,
        onEnter: (b) => gsap.to(b, { scaleX: 1, duration: 0.9, ease: EASE_OUT, stagger: 0.12 }),
      });
    });
    return () => mm.revert();
  }, []);
  return (
    <section id="folyamat" ref={ref} className="relative z-10 bg-bg py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <h2 data-reveal className="border-t border-hairline pt-8 text-[clamp(26px,3.2vw,44px)] font-semibold text-ink">{site.process.h2}</h2>
        <p data-reveal className="mt-4 max-w-[56ch] text-[17px] text-stone">{site.process.sub}</p>
        <ol className="mt-12 -mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 md:mx-0 md:grid md:grid-cols-5 md:gap-6 md:overflow-visible md:px-0 md:pb-0">
          {processSteps.map((s, i) => (
            <li key={s.slug} data-step className="relative w-[78vw] shrink-0 snap-start md:w-auto">
              <div className="h-px w-full bg-hairline" aria-hidden="true">
                <div data-rule className="h-px w-full bg-ink" />
              </div>
              <div className="flex items-baseline justify-between gap-3 pt-4 text-[13px] text-stone">
                <span className="font-mono text-[12px] tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <span className="truncate">{s.meta}</span>
              </div>
              <h3 className="mt-4 text-[22px] font-semibold text-ink">{s.title}</h3>
              <p className="mt-3 text-[15px] text-stone">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
