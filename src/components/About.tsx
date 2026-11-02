import { Check } from '@phosphor-icons/react';
import { useRef } from 'react';
import { site } from '../content/site';
import { useReveal } from '../lib/gsap';
import { Contours } from './Contours';
import { Headline } from './Headline';
import { Photo } from './Photo';

export function About() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section id="rolunk" ref={ref} className="relative z-10 bg-bg py-24 md:py-32">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-5 md:grid-cols-12 md:gap-8 md:px-8">
        <div className="md:col-span-6">
          <Headline text={site.about.h2} mark={site.about.h2Mark} className="text-5xl md:text-6xl text-olive" />
          <p data-reveal className="mt-6 max-w-[60ch] text-[17px] text-stone-deep">{site.about.body}</p>
          <ul data-reveal className="mt-10">
            {site.about.facts.map((fact) => (
              <li key={fact} className="row-dashed flex items-center gap-3 py-4 text-ink/90">
                <Check size={18} weight="bold" className="shrink-0 text-accent" aria-hidden="true" />
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </div>
        <div data-reveal className="relative md:col-span-5 md:col-start-8">
          <Photo src={site.about.photo} w={2400} h={1600} alt="A bánya teraszai" sizes="(min-width: 768px) 40vw, 100vw" className="duotone aspect-[3/4]" imgClassName="object-[70%_50%]" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-10 -left-10 hidden h-[56%] w-[56%] text-accent md:block">
            <Contours strokeWidth={1.25} />
          </div>
        </div>
      </div>
    </section>
  );
}
