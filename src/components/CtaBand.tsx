import { ArrowUpRight } from '@phosphor-icons/react';
import { useRef } from 'react';
import { site } from '../content/site';
import { useReveal } from '../lib/gsap';
import { Headline } from './Headline';
import Magnet from '../vendor/react-bits/Magnet';
import { ButtonLink } from './ui/Button';

/** Full-bleed photo with an off-white card riding over its edge. */
export function CtaBand() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section ref={ref} aria-label="Ajánlatkérés felhívás" className="relative z-10 bg-choco text-dark-ink on-dark py-24 md:py-36">
      <div className="mx-auto flex max-w-[1100px] flex-col items-center px-4 text-center md:px-8">
        <Headline as="h3" text={site.ctaBand.h3} mark={site.ctaBand.h3Mark} className="text-6xl md:text-[7.5rem] text-dark-ink" />
        <p data-reveal className="mt-6 max-w-[46ch] text-[17px] text-dark-ink/80">{site.ctaBand.sub}</p>
        <div data-reveal className="mt-10">
          <Magnet padding={60} magnetStrength={4} exclusive={false}>
            <ButtonLink href="#kapcsolat" data-cta className="gap-2">{site.cta}<ArrowUpRight size={16} weight="bold" aria-hidden="true" /></ButtonLink>
          </Magnet>
        </div>
      </div>
    </section>
  );
}
