import { ClipboardText, Scales, Truck } from '@phosphor-icons/react';
import { services } from '../content/services';
import { useRef } from 'react';
import { useReveal } from '../lib/gsap';
import { Photo } from './Photo';

const icons = { FileCheck: ClipboardText, Truck, Scales } as const;

export function Services() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const Featured = icons[services.featured.icon];
  return (
    <section id="szolgaltatasok" ref={ref} className="relative z-10 bg-sky text-dark-ink py-24 md:py-32 edge-slant">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <h2 data-reveal className="text-5xl md:text-6xl text-dark-ink text-balance max-w-[18ch]">{services.h2}</h2>

        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <article data-reveal className="md:col-span-7 group">
            <Photo src={services.featured.photo} w={960} h={720} alt="Billencs rakodása a telephelyen" sizes="(min-width: 768px) 55vw, 100vw" className="aspect-video" />
            <div className="relative -mt-8 mr-0 md:mr-12 bg-bg-raised p-6 md:p-8">
              <Featured size={32} weight="regular" className="text-accent" aria-hidden="true" />
              <h3 className="mt-4 text-3xl font-semibold text-ink">{services.featured.title}</h3>
              <p className="mt-3 max-w-[55ch] text-stone-deep">{services.featured.body}</p>
            </div>
          </article>

          <div className="md:col-span-5 flex flex-col">
            {services.rows.map((r) => {
              const Icon = icons[r.icon];
              return (
                <article key={r.title} data-reveal className="border-t border-dark-hairline py-8 first:border-t-0 first:pt-0 md:first:border-t md:first:pt-8">
                  <Icon size={32} weight="regular" className="text-accent" aria-hidden="true" />
                  <h3 className="mt-4 text-3xl font-semibold text-dark-ink">{r.title}</h3>
                  <p className="mt-3 text-dark-ink/70">{r.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
