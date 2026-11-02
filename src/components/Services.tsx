import { useRef } from 'react';
import { services } from '../content/services';
import { useReveal } from '../lib/gsap';
import { Photo } from './Photo';
import { SectionIndex } from './SectionIndex';
import { ButtonLink } from './ui/Button';

/** Heidelberg-style cards: one featured wide card, two stacked beside it. */
export function Services() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const f = services.featured;
  return (
    <section id="szolgaltatasok" ref={ref} className="relative z-10 bg-bg py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <SectionIndex n="04" label="Szolgáltatások" />
        <h2 data-reveal className="mt-10 max-w-[20ch] text-[clamp(26px,3.2vw,44px)] font-semibold text-ink">{services.h2}</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-12">
          <article data-reveal data-service className="bg-bg-raised md:col-span-7">
            <Photo src={f.photo} w={1800} h={1200} alt="Rakodógép tölti a billencset" sizes="(min-width: 768px) 55vw, 100vw" className="aspect-[16/9]" />
            <div className="p-6 md:p-8">
              <h3 className="text-[24px] font-semibold text-ink">{f.title}</h3>
              <p className="mt-3 max-w-[60ch] text-[16px] text-stone">{f.body}</p>
              <ButtonLink href="#kapcsolat" variant="outline" className="mt-6">Részletek az ajánlatban</ButtonLink>
            </div>
          </article>
          <div className="grid gap-8 md:col-span-5">
            {services.rows.map((r) => (
              <article key={r.title} data-reveal data-service className="grid grid-cols-[112px_1fr] gap-5 bg-bg-raised md:grid-cols-[160px_1fr]">
                <Photo src={r.photo} w={1800} h={1200} alt={r.title} sizes="160px" className="h-full min-h-[140px]" still />
                <div className="py-5 pr-5">
                  <h3 className="text-[20px] font-semibold text-ink">{r.title}</h3>
                  <p className="mt-2 text-[15px] text-stone">{r.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
