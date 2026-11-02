import { useRef } from 'react';
import { site } from '../content/site';
import { useReveal } from '../lib/gsap';
import { CountUp } from './CountUp';

/** Editorial figure list: label left, number right, dashed rules between rows. */
export function Stats() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section ref={ref} aria-label="Számokban" className="relative z-10 bg-bg py-16 md:py-24">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 md:grid-cols-12 md:px-8">
        <p data-reveal className="font-mono text-[12px] tracking-[0.18em] uppercase text-stone md:col-span-3">Számokban</p>
        <dl className="md:col-span-9 md:col-start-4">
          {site.figures.map((f) => (
            <div key={f.label} data-reveal className="row-dashed flex items-baseline justify-between gap-6 py-6 md:py-7">
              <dt className="text-[15px] text-stone md:text-[17px]">{f.label}</dt>
              <dd className="font-display text-[44px] font-bold leading-none text-ink md:text-[72px] tabular-nums">
                <CountUp value={f.value} numeric={f.numeric} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
