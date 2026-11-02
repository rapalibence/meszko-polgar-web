import { Check } from '@phosphor-icons/react';
import { site } from '../content/site';
import { useRef } from 'react';
import { useReveal } from '../lib/gsap';
import { CountUp } from './CountUp';
import { PitPoster } from './PitPoster';

export function About() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section id="rolunk" ref={ref} className="relative z-10 bg-bg py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 border-y border-hairline">
          {site.figures.map((f) => (
            <div key={f.label} data-reveal className="py-8 md:py-10 md:px-8 first:pl-0 md:border-l border-hairline md:first:border-l-0 border-t md:border-t-0 first:border-t-0">
              <CountUp value={f.value} numeric={f.numeric} className="block font-mono text-[clamp(40px,5.2vw,80px)] leading-none text-accent tabular-nums whitespace-nowrap" />
              <span className="mt-3 block text-stone">{f.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-6">
            <h2 data-reveal className="text-5xl md:text-6xl text-ink text-balance">{site.about.h2}</h2>
            <p data-reveal className="mt-6 max-w-[60ch] text-stone">{site.about.body}</p>
            <ul data-reveal className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {site.about.facts.map((fact) => (
                <li key={fact} className="flex items-start gap-3 text-ink/90">
                  <Check size={20} weight="bold" className="mt-1 shrink-0 text-accent" aria-hidden="true" />
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal className="md:col-span-5 md:col-start-8 relative">
            <div className="aspect-[3/4] overflow-hidden bg-sky" role="img" aria-label="A bánya teraszainak metszete"><PitPoster fit="xMidYMid slice" /></div>
            {[30, 55, 80].map((p) => (
              <div key={p} aria-hidden="true" className="pointer-events-none absolute inset-x-0 h-px bg-accent/80" style={{ top: `${p}%` }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
