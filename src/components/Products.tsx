import { ArrowRight, Minus, Plus } from '@phosphor-icons/react';
import { useRef, useState } from 'react';
import { products } from '../content/products';
import { site } from '../content/site';
import { useReveal } from '../lib/gsap';
import { cn } from '../lib/cn';
import { SectionIndex } from './SectionIndex';

/**
 * Fraction accordion on dark (Cominvi fleet). One row open at a time; the sticky photo on the
 * right cross-fades to the open row. On phones the photo sits inside the open row.
 */
export function Products() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(0);
  useReveal(ref);
  return (
    <section id="termekek" ref={ref} className="relative z-10 bg-dark py-20 text-dark-ink md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <SectionIndex n="02" label="Termékek" dark />
        <div className="mt-10 grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7">
            <h2 data-reveal className="text-[clamp(26px,3.2vw,44px)] font-semibold">{site.products.h2}</h2>
            <p data-reveal className="mt-4 max-w-[56ch] text-[17px] text-dark-ink/70">{site.products.intro}</p>

            <ul data-reveal className="mt-10 border-t border-dark-hairline">
              {products.map((p, i) => {
                const isOpen = open === i;
                return (
                  <li key={p.slug} data-product data-open={isOpen ? 'true' : undefined} className="border-b border-dark-hairline">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`frac-${p.slug}`}
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      className="grid w-full grid-cols-[1fr_auto_32px] items-center gap-4 py-5 text-left md:grid-cols-[1fr_120px_32px]"
                    >
                      <span className={cn('text-[20px] font-semibold transition-colors md:text-[24px]', isOpen ? 'text-dark-ink' : 'text-dark-ink/80')}>{p.name}</span>
                      <span className="font-mono text-[12px] text-dark-ink/60 tabular-nums">{p.range}</span>
                      <span className="flex h-8 w-8 items-center justify-center border border-dark-hairline text-dark-ink">
                        {isOpen ? <Minus size={14} weight="bold" aria-hidden="true" /> : <Plus size={14} weight="bold" aria-hidden="true" />}
                      </span>
                    </button>
                    <div id={`frac-${p.slug}`} className="acc" data-open={isOpen ? 'true' : 'false'}>
                      <div>
                        <div className="pb-6">
                          <p className="max-w-[52ch] text-[16px] text-dark-ink/75">{p.use}</p>
                          <div className="mt-4 aspect-[4/3] overflow-hidden md:hidden">
                            <img src={p.photo.replace('.webp', '-sm.webp')} alt={`${p.name}, ${p.range}`} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                          </div>
                          <a href="#kapcsolat" className="mt-5 inline-flex items-center gap-2 text-[15px] font-semibold text-dark-ink">
                            Ajánlat erre a frakcióra <ArrowRight size={16} weight="bold" aria-hidden="true" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p data-reveal className="mt-8 max-w-[62ch] text-[15px] text-dark-ink/60">{site.products.outro}</p>
          </div>

          <div className="hidden md:col-span-5 md:block">
            <div data-product-photo className="sticky top-24 aspect-[4/3] overflow-hidden bg-dark-raised">
              {products.map((p, i) => (
                <img
                  key={p.slug}
                  src={p.photo}
                  srcSet={`${p.photo.replace('.webp', '-sm.webp')} 700w, ${p.photo} 1400w`}
                  sizes="40vw"
                  alt=""
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  data-active={open === i ? 'true' : undefined}
                  className={cn('absolute inset-0 h-full w-full object-cover transition-opacity duration-500 [transition-timing-function:var(--ease)]', open === i ? 'opacity-100' : 'opacity-0')}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
