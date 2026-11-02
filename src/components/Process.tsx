import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { processSteps } from '../content/process';
import { site } from '../content/site';
import { gsap, MOTION_OK } from '../lib/gsap';
import { cn } from '../lib/cn';
import { Contours } from './Contours';

/**
 * Dark band. Left: the five steps, scrolling normally; the one crossing the viewport's middle is
 * active. Right (sticky): topographic contours drawn in as the section scrolls, and a depth tick
 * that slides to the active step. Everything is stroke-dashoffset / transform / opacity.
 */
export function Process() {
  const ref = useRef<HTMLElement>(null);
  const tickRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Active step via IntersectionObserver on a thin band around the viewport middle.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>('[data-step]'));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    items.forEach((it) => io.observe(it));
    return () => io.disconnect();
  }, []);

  // Contour drawing scrubbed over the section.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const paths = gsap.utils.toArray<SVGPathElement>(el.querySelectorAll('[data-contour]'));
      paths.forEach((p, i) => {
        const len = p.getTotalLength();
        gsap.set(p, { attr: { 'stroke-dasharray': len, 'stroke-dashoffset': len } });
        gsap.to(p, {
          attr: { 'stroke-dashoffset': 0 },
          ease: 'none',
          scrollTrigger: { trigger: el, start: `top ${80 - i * 4}%`, end: `bottom ${60 + i * 5}%`, scrub: 0.5 },
        });
      });
    });
    return () => mm.revert();
  }, []);

  // Depth tick slides to the active step.
  useLayoutEffect(() => {
    const tick = tickRef.current;
    if (!tick) return;
    gsap.to(tick, { yPercent: active * 100, duration: 0.5, ease: 'power3.out', overwrite: true });
  }, [active]);

  return (
    <section id="folyamat" ref={ref} className="relative z-10 bg-choco text-dark-ink py-24 md:py-32 on-dark">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 md:grid-cols-12 md:gap-8 md:px-8">
        <div className="md:col-span-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-dark-ink/80">{site.process.eyebrow}</p>
          <h2 data-split className="mt-4 text-5xl md:text-7xl leading-[0.92] text-dark-ink">{site.process.h2}</h2>
          <p className="mt-6 max-w-[52ch] text-[17px] text-dark-ink/70">{site.process.sub}</p>

          <ol className="mt-14 md:mt-20">
            {processSteps.map((s, i) => (
              <li
                key={s.slug}
                data-step
                data-index={i}
                data-active={active === i ? 'true' : undefined}
                className="row-dashed row-dashed-dark grid grid-cols-[64px_1fr] gap-4 py-8 md:py-10"
              >
                <span className="font-mono text-[13px] text-dark-ink/85 tabular-nums pt-1">{s.depthM === 0 ? '0 m' : `-${s.depthM} m`}</span>
                <div className={cn('transition-opacity duration-500', active === i ? 'opacity-100' : 'opacity-75')} style={{ transitionTimingFunction: 'var(--ease)' }}>
                  <h3 className="font-display text-3xl font-bold uppercase leading-none md:text-4xl">{s.title}</h3>
                  <p className="mt-3 max-w-[48ch] text-[16px] text-dark-ink/85">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="hidden md:block md:col-span-5 md:col-start-8">
          <div data-sticky className="sticky top-24 flex gap-6">
            {/* depth rail */}
            <div className="relative w-12 shrink-0 self-stretch">
              <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-dark-hairline" />
              <div className="absolute left-0 top-0 h-full w-full" style={{ display: 'grid', gridTemplateRows: `repeat(${processSteps.length}, 1fr)` }}>
                {processSteps.map((s) => (
                  <span key={s.slug} className="flex items-start justify-center pt-1 font-mono text-[11px] text-dark-ink/50 tabular-nums">{s.depthM}</span>
                ))}
              </div>
              <div
                ref={tickRef}
                aria-hidden="true"
                className="absolute left-0 top-0 w-full"
                style={{ height: `${100 / processSteps.length}%` }}
              >
                <span className="absolute left-1/2 top-1 h-3 w-3 -translate-x-1/2 rounded-full bg-accent" />
              </div>
            </div>
            <div className="relative h-[min(60vh,560px)] flex-1 text-bg/60">
              <Contours className="absolute inset-0" />
              <div className="absolute bottom-0 left-0 font-mono text-[11px] uppercase tracking-[0.18em] text-dark-ink/50">Szintvonalak, 2 m-enként</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
