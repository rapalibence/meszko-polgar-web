import { ArrowUpRight } from '@phosphor-icons/react';
import { useRef } from 'react';
import { site } from '../content/site';
import { useReveal } from '../lib/gsap';
import { Photo } from './Photo';
import { ButtonLink } from './ui/Button';

/** Full-bleed photo with an off-white card riding over its edge. */
export function CtaBand() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section ref={ref} aria-label="Ajánlatkérés felhívás" className="relative z-10 bg-bg">
      <div className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <Photo src="/photo/truck-road.webp" w={2000} h={1333} alt="Narancssárga billencs a bánya útján" sizes="100vw" className="h-full w-full" imgClassName="object-[50%_55%]" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-ink/40 to-transparent" />
      </div>
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div data-reveal className="-mt-28 ml-auto max-w-[620px] bg-bg-raised p-8 md:-mt-36 md:p-12 shadow-[0_30px_80px_-40px_rgba(14,13,9,.45)]">
          <h3 className="text-4xl md:text-6xl leading-[0.92] text-ink">{site.ctaBand.h3}</h3>
          <p className="mt-5 text-[17px] text-stone-deep">{site.ctaBand.sub}</p>
          <ButtonLink href="#kapcsolat" data-cta className="mt-8 gap-2">{site.cta}<ArrowUpRight size={16} weight="bold" aria-hidden="true" /></ButtonLink>
        </div>
      </div>
    </section>
  );
}
