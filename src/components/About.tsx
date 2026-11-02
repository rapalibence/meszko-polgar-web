import { Check } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { site } from '../content/site';
import { stagger } from '../lib/motion';
import { CountUp } from './CountUp';
import { Photo } from './Photo';

export function About() {
  return (
    <section id="rolunk" className="relative z-10 bg-bg py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 border-y border-hairline">
          {site.figures.map((f, i) => (
            <motion.div key={f.label} {...stagger(i)} className="py-8 md:py-10 md:px-8 first:pl-0 md:border-l border-hairline md:first:border-l-0 border-t md:border-t-0 first:border-t-0">
              <CountUp value={f.value} numeric={f.numeric} className="block font-mono text-[clamp(40px,5.2vw,80px)] leading-none text-accent tabular-nums whitespace-nowrap" />
              <span className="mt-3 block text-stone">{f.label}</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-6">
            <motion.h2 {...stagger(0)} className="text-5xl md:text-6xl text-ink text-balance">{site.about.h2}</motion.h2>
            <motion.p {...stagger(1)} className="mt-6 max-w-[60ch] text-stone">{site.about.body}</motion.p>
            <motion.ul {...stagger(2)} className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {site.about.facts.map((fact) => (
                <li key={fact} className="flex items-start gap-3 text-ink/90">
                  <Check size={20} weight="bold" className="mt-1 shrink-0 text-accent" aria-hidden="true" />
                  <span>{fact}</span>
                </li>
              ))}
            </motion.ul>
          </div>
          <motion.div {...stagger(1)} className="md:col-span-5 md:col-start-8 relative">
            <Photo src={site.about.photo} w={720} h={960} sizes="(min-width: 768px) 40vw, 100vw" alt="A bánya teraszainak szintvonalai felülnézetből" className="aspect-[3/4]" />
            {[30, 55, 80].map((p) => (
              <div key={p} aria-hidden="true" className="pointer-events-none absolute inset-x-0 h-px bg-accent/80" style={{ top: `${p}%` }} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
