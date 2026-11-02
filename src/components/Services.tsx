import { ClipboardText, Scales, Truck } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { services } from '../content/services';
import { stagger } from '../lib/motion';
import { Photo } from './Photo';

const icons = { FileCheck: ClipboardText, Truck, Scales } as const;

export function Services() {
  const Featured = icons[services.featured.icon];
  return (
    <section id="szolgaltatasok" className="relative z-10 bg-bg py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <motion.h2 {...stagger(0)} className="text-5xl md:text-6xl text-ink text-balance max-w-[18ch]">{services.h2}</motion.h2>

        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
          <motion.article {...stagger(1)} className="md:col-span-7 group">
            <Photo src={services.featured.photo} w={1200} h={675} alt="Billencs rakodása a telephelyen" className="aspect-video" />
            <div className="relative -mt-8 mr-0 md:mr-12 bg-bg-raised border border-hairline p-6 md:p-8">
              <Featured size={32} weight="regular" className="text-accent" aria-hidden="true" />
              <h3 className="mt-4 text-3xl font-semibold text-ink">{services.featured.title}</h3>
              <p className="mt-3 max-w-[55ch] text-stone">{services.featured.body}</p>
            </div>
          </motion.article>

          <div className="md:col-span-5 flex flex-col">
            {services.rows.map((r, i) => {
              const Icon = icons[r.icon];
              return (
                <motion.article key={r.title} {...stagger(2 + i)} className="border-t border-hairline py-8 first:border-t-0 first:pt-0 md:first:border-t md:first:pt-8">
                  <Icon size={32} weight="regular" className="text-accent" aria-hidden="true" />
                  <h3 className="mt-4 text-3xl font-semibold text-ink">{r.title}</h3>
                  <p className="mt-3 text-stone">{r.body}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
