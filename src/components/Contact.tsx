import { Clock, Envelope, MapPin, Phone } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { site } from '../content/site';
import { stagger } from '../lib/motion';
import { QuoteForm } from './QuoteForm';

const icons = { MapPin, Phone, Envelope, Clock } as const;

export function Contact() {
  const [lat, lng] = site.contact.mapCenter;
  return (
    <section id="kapcsolat" className="relative z-10 bg-bg py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <motion.h2 {...stagger(0)} className="text-5xl md:text-6xl text-ink">{site.contact.h2}</motion.h2>
        <motion.p {...stagger(1)} className="mt-5 max-w-[60ch] text-stone">{site.contact.sub}</motion.p>

        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <motion.div {...stagger(2)} className="md:col-span-7">
            <QuoteForm />
          </motion.div>
          <motion.aside {...stagger(3)} className="md:col-span-5 border border-hairline p-6 md:p-8">
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
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
