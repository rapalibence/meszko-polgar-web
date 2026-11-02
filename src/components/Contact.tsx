import { ArrowUpRight, Clock, Envelope, MapPin, Phone } from '@phosphor-icons/react';
import { useRef } from 'react';
import { site } from '../content/site';
import { useReveal } from '../lib/gsap';
import { QuoteForm } from './QuoteForm';

const icons = { MapPin, Phone, Envelope, Clock } as const;

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const [lat, lng] = site.contact.mapCenter;
  return (
    <section id="kapcsolat" ref={ref} className="relative z-10 bg-bg py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6 border-t border-hairline pt-8">
          <div>
            <h2 data-reveal className="text-[clamp(26px,3.2vw,44px)] font-semibold text-ink">{site.contact.h2}</h2>
            <p data-reveal className="mt-4 max-w-[56ch] text-[17px] text-stone">{site.contact.sub}</p>
          </div>
          <p data-reveal className="inline-flex items-center gap-2 border border-hairline px-3 py-2 text-[14px] text-ink">
            <Clock size={14} aria-hidden="true" /> {site.contact.promise}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <div data-reveal className="md:col-span-7">
            <QuoteForm />
          </div>
          <aside data-reveal className="md:col-span-5 bg-bg-raised p-6 md:p-8">
            <ul className="divide-y divide-hairline">
              {site.contact.rows.map((r) => {
                const Icon = icons[r.icon];
                return (
                  <li key={r.label} className="flex items-start gap-4 py-4 first:pt-0">
                    <Icon size={20} weight="regular" className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                    <div>
                      <span className="block text-[13px] text-stone">{r.label}</span>
                      <span className="text-ink/90">{r.value}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
            <iframe
              title="Telephely térképe"
              src={`https://www.google.com/maps?q=${lat},${lng}&z=13&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="mt-6 aspect-[4/3] w-full border-0 [filter:grayscale(1)_contrast(1.05)]"
            />
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-[15px] font-semibold text-ink"
            >
              {site.contact.directions} <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
