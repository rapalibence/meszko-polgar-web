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
  const rows = [
    { icon: Featured, title: services.featured.title, body: services.featured.body, photo: services.featured.photo, alt: 'Rakodógép tölti a billencset' },
    ...services.rows.map((r) => ({ icon: icons[r.icon], title: r.title, body: r.body, photo: r.photo, alt: r.title })),
  ];
  return (
    <section id="szolgaltatasok" ref={ref} className="relative z-10 bg-bg py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p data-reveal className="font-mono text-[12px] uppercase tracking-[0.18em] text-khaki">Szolgáltatások</p>
            <h2 data-reveal className="mt-4 text-5xl md:text-7xl leading-[0.92] text-ink max-w-[14ch]">{services.h2}</h2>
          </div>
        </div>

        <div className="mt-14">
          {rows.map((r, i) => {
            const Icon = r.icon;
            return (
              <article key={r.title} data-reveal className="row-dashed grid grid-cols-1 gap-6 py-10 md:grid-cols-12 md:items-center md:gap-8 md:py-12">
                <div className="md:col-span-5">
                  <Photo src={r.photo} w={1800} h={1200} alt={r.alt} sizes="(min-width: 768px) 40vw, 100vw" className="aspect-[16/10]" />
                </div>
                <div className="md:col-span-6 md:col-start-7">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[12px] tracking-[0.18em] text-khaki tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                    <Icon size={26} weight="regular" className="text-accent" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 font-display text-4xl font-bold uppercase leading-none text-ink md:text-5xl">{r.title}</h3>
                  <p className="mt-4 max-w-[52ch] text-[17px] text-stone-deep">{r.body}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
