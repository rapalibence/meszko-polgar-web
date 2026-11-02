import { Clock, Envelope, MapPin, Phone } from '@phosphor-icons/react';
import { site } from '../content/site';
import { useRef } from 'react';
import { useReveal } from '../lib/gsap';
import { QuoteForm } from './QuoteForm';

const icons = { MapPin, Phone, Envelope, Clock } as const;

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const [lat, lng] = site.contact.mapCenter;
  return (
    <section id="kapcsolat" ref={ref} className="relative z-10 bg-bg py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <p data-reveal className="font-mono text-[12px] uppercase tracking-[0.18em] text-khaki">Kapcsolat</p>
        <h2 data-split className="mt-4 text-5xl md:text-7xl leading-[0.92] text-olive">{site.contact.h2}</h2>
        <p data-reveal className="mt-5 max-w-[60ch] text-[17px] text-stone-deep">{site.contact.sub}</p>

        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <div data-reveal className="md:col-span-7">
            <QuoteForm />
          </div>
          <aside data-reveal className="md:col-span-5 bg-panel p-6 md:p-8">
            <ul className="divide-y divide-hairline">
              {site.contact.rows.map((r) => {
                const Icon = icons[r.icon];
                return (
                  <li key={r.label} className="flex items-start gap-4 py-4 first:pt-0">
                    <Icon size={22} weight="regular" className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                    <div>
                      <span className="block text-[12px] uppercase tracking-[0.08em] text-stone-deep">{r.label}</span>
                      <span className="text-ink/90">{r.value}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
            {/* TODO: replace with the exact telephely pin. */}
            <iframe
              title="Telephely térképe"
              src={`https://www.google.com/maps?q=${lat},${lng}&z=13&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="mt-6 aspect-[4/3] w-full border-0 [filter:grayscale(1)_contrast(1.05)]"
            />
          </aside>
        </div>
      </div>
    </section>
  );
}
