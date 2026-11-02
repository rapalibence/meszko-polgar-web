import { ArrowUpRight } from '@phosphor-icons/react';
import { useRef } from 'react';
import { products } from '../content/products';
import { site } from '../content/site';
import { useReveal } from '../lib/gsap';
import { cn } from '../lib/cn';
import { Photo } from './Photo';

/** Three organic cut-out shapes (objectBoundingBox) so the photos read as specimens on the panel. */
const BLOBS = [
  'M0.5,0.02 C0.72,0.0 0.93,0.12 0.97,0.34 C1.01,0.56 0.92,0.8 0.74,0.93 C0.56,1.04 0.3,1.01 0.14,0.88 C-0.02,0.74 -0.03,0.48 0.07,0.28 C0.16,0.1 0.3,0.03 0.5,0.02 Z',
  'M0.42,0.03 C0.66,-0.03 0.9,0.08 0.97,0.3 C1.03,0.5 0.95,0.72 0.82,0.88 C0.68,1.03 0.42,1.03 0.24,0.93 C0.06,0.82 -0.03,0.6 0.03,0.4 C0.09,0.2 0.22,0.07 0.42,0.03 Z',
  'M0.55,0.0 C0.78,0.02 0.97,0.18 0.99,0.4 C1.01,0.62 0.88,0.84 0.68,0.95 C0.48,1.05 0.22,0.98 0.09,0.82 C-0.04,0.66 -0.02,0.4 0.1,0.22 C0.22,0.05 0.36,-0.02 0.55,0.0 Z',
];

const layout = [
  'md:col-span-7 md:row-span-2',
  'md:col-span-5',
  'md:col-span-5',
  'md:col-span-4',
  'md:col-span-4',
  'md:col-span-4',
];

export function Fractions() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    <section id="termekek" ref={ref} className="relative z-10 bg-panel py-24 md:py-32">
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <defs>
          {BLOBS.map((d, i) => (
            <clipPath key={i} id={`blob-${i}`} clipPathUnits="objectBoundingBox"><path d={d} /></clipPath>
          ))}
        </defs>
      </svg>
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p data-reveal className="font-mono text-[12px] uppercase tracking-[0.18em] text-khaki">Termékek</p>
            <h2 data-reveal className="mt-4 text-5xl md:text-7xl text-ink leading-[0.92]">{site.products.h2}</h2>
          </div>
          <p data-reveal className="max-w-[48ch] text-[17px] text-stone-deep md:col-span-5 md:justify-self-end">{site.products.intro}</p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-12 md:gap-y-16">
          {products.map((p, i) => {
            const big = i === 0;
            return (
              <article key={p.slug} data-product data-span={p.span} data-reveal className={cn('group flex flex-col', layout[i])}>
                <div className={cn('relative', big ? 'aspect-[5/4] md:h-full md:min-h-[520px]' : 'aspect-[4/3]')}>
                  <div className="absolute inset-[4%]" style={{ clipPath: `url(#blob-${i % 3})` }}>
                    <Photo
                      src={p.photo}
                      w={1400}
                      h={1050}
                      alt={`${p.name}, ${p.range}`}
                      sizes={big ? '(min-width: 768px) 55vw, 100vw' : '(min-width: 768px) 30vw, 100vw'}
                      className="h-full w-full"
                      imgClassName="transition-transform duration-700 [transition-timing-function:var(--ease)] group-hover:[@media(hover:hover)_and_(pointer:fine)]:scale-[1.04]"
                    />
                  </div>
                  <span className="absolute left-0 top-0 bg-ink px-3 py-1.5 font-mono text-[12px] tracking-[0.12em] text-dark-ink tabular-nums">{p.range.replace('-', '/')}</span>
                </div>
                <div className="row-dashed mt-6 flex items-start justify-between gap-4 pb-5">
                  <div>
                    <h3 className={cn('font-display font-bold uppercase leading-none text-ink', big ? 'text-4xl md:text-5xl' : 'text-3xl')}>{p.name}</h3>
                    <p className="mt-2 text-[15px] text-stone">{p.use}</p>
                  </div>
                  <a href="#kapcsolat" aria-label={`Ajánlatkérés: ${p.name}`} className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center border border-hairline text-ink transition-colors hover:bg-ink hover:text-dark-ink">
                    <ArrowUpRight size={18} weight="bold" aria-hidden="true" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
        <p data-reveal className="mt-12 max-w-[70ch] text-[15px] text-stone-deep">{site.products.outro}</p>
      </div>
    </section>
  );
}
