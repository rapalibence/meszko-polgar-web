import { useRef } from 'react';
import { site } from '../content/site';
import { useReveal } from '../lib/gsap';
import { CountUp } from './CountUp';
import { Photo } from './Photo';

/** Four hairline tiles: three figures and one duotone photo. */
export function Stats() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section ref={ref} aria-label="Számokban" className="relative z-10 bg-bg py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="grid grid-cols-2 border border-hairline md:grid-cols-4">
          {site.figures.map((f) => (
            <div key={f.label} data-reveal className="flex min-h-[200px] flex-col justify-between border-b border-r border-hairline p-5 md:min-h-[260px] md:border-b-0 md:p-7 [&:nth-child(2)]:border-r-0 md:[&:nth-child(2)]:border-r">
              <CountUp value={f.value} numeric={f.numeric} className="font-display text-[clamp(34px,4.2vw,64px)] font-bold leading-none text-olive tabular-nums whitespace-nowrap" />
              <span className="mt-6 text-[15px] text-stone">{f.label}</span>
            </div>
          ))}
          <div data-reveal className="duotone relative min-h-[200px] md:min-h-[260px]">
            <Photo src="/photo/loading.webp" w={1800} h={1200} alt="Rakodógép tölti a billencset" sizes="(min-width: 768px) 25vw, 50vw" className="absolute inset-0 h-full w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
