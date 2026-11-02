import { useRef } from 'react';
import { site } from '../content/site';
import { useReveal } from '../lib/gsap';
import { CountUp } from './CountUp';
import { Photo } from './Photo';

export function About() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section id="rolunk" ref={ref} className="relative z-10 bg-bg py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="grid gap-10 border-t border-hairline pt-8 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7">
            <h2 data-reveal className="text-[clamp(26px,3.2vw,44px)] font-semibold text-ink">{site.about.h2}</h2>
            <p data-reveal className="mt-6 max-w-[62ch] text-[17px] text-stone">{site.about.body}</p>
            <ul data-reveal className="mt-8 grid gap-x-8 gap-y-2 text-[15px] text-ink/85 sm:grid-cols-2">
              {site.about.facts.map((f) => (
                <li key={f} className="border-t border-hairline py-3">{f}</li>
              ))}
            </ul>
          </div>
          <div data-reveal className="md:col-span-5">
            <Photo src={site.about.photo} w={880} h={1168} alt="Rakodógép a mészkő bányafal tövében" sizes="(min-width: 768px) 40vw, 100vw" className="aspect-[3/4]" />
          </div>
        </div>

        {/* Stats strip */}
        <dl data-reveal className="mt-16 grid grid-cols-2 border-t border-hairline md:grid-cols-3 lg:grid-cols-6">
          {site.figures.map((f) => (
            <div key={f.label} className="border-b border-hairline py-6 pr-6 lg:border-b-0 lg:border-r lg:last:border-r-0 lg:px-6 lg:first:pl-0">
              <dd className="text-[30px] font-semibold leading-none text-ink tabular-nums md:text-[34px]">
                <CountUp value={f.value} numeric={f.numeric} />
              </dd>
              <dt className="mt-2 text-[14px] text-stone">{f.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
