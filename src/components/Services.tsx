import { ArrowUpRight } from '@phosphor-icons/react';
import { useLayoutEffect, useRef, useState } from 'react';
import { services } from '../content/services';
import { gsap, MOTION_OK, useReveal } from '../lib/gsap';
import { cn } from '../lib/cn';
import { Headline } from './Headline';
import { Photo } from './Photo';

type Row = { title: string; body: string; photo: string; alt: string };

/**
 * Numbered service list (G MINING). Desktop: a duotone preview follows the cursor over the hovered
 * row. Mobile: the preview sits inline under the row. Preview position is driven by quickTo, never
 * by React state.
 */
export function Services() {
  const ref = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  useReveal(ref);

  const rows: Row[] = [
    { title: services.featured.title, body: services.featured.body, photo: services.featured.photo, alt: 'Rakodógép tölti a billencset' },
    ...services.rows.map((r) => ({ title: r.title, body: r.body, photo: r.photo, alt: r.title })),
  ];

  useLayoutEffect(() => {
    const el = ref.current;
    const pv = previewRef.current;
    if (!el || !pv) return;
    const mm = gsap.matchMedia();
    mm.add(`${MOTION_OK} and (pointer: fine) and (min-width: 768px)`, () => {
      const xTo = gsap.quickTo(pv, 'x', { duration: 0.5, ease: 'power3.out' });
      const yTo = gsap.quickTo(pv, 'y', { duration: 0.5, ease: 'power3.out' });
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo(e.clientX - r.left + 28);
        yTo(e.clientY - r.top - 120);
      };
      el.addEventListener('pointermove', move, { passive: true });
      return () => el.removeEventListener('pointermove', move);
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="szolgaltatasok" ref={ref} className="relative z-10 bg-bg py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <Headline text={services.h2} mark="Megoldást." className="text-5xl md:text-7xl text-olive max-w-[16ch]" />

        <ol className="mt-14 border-t border-hairline" onPointerLeave={() => setHover(null)}>
          {rows.map((r, i) => (
            <li
              key={r.title}
              data-service
              data-reveal
              onPointerEnter={() => setHover(i)}
              className={cn('group border-b border-hairline transition-colors duration-300', hover !== null && hover !== i && 'md:opacity-50')}
              style={{ transitionTimingFunction: 'var(--ease)' }}
            >
              <a href="#kapcsolat" className="grid grid-cols-[48px_1fr_40px] items-start gap-4 py-7 md:grid-cols-[80px_1fr_1fr_48px] md:items-center md:py-9">
                <span className="font-mono text-[13px] text-stone tabular-nums">({String(i + 1).padStart(2, '0')})</span>
                <h3 className="font-display text-3xl font-bold uppercase leading-none text-ink md:text-5xl">{r.title}</h3>
                <p className="col-span-3 col-start-1 mt-3 max-w-[52ch] text-[15px] text-stone md:col-span-1 md:col-start-3 md:mt-0 md:text-[16px]">{r.body}</p>
                <span className="col-start-3 row-start-1 flex h-10 w-10 items-center justify-center border border-hairline text-ink transition-colors group-hover:bg-ink group-hover:text-dark-ink md:col-start-4 md:h-12 md:w-12">
                  <ArrowUpRight size={18} weight="bold" aria-hidden="true" />
                </span>
              </a>
              {/* Mobile inline preview */}
              <div className="duotone relative mb-7 aspect-[16/9] overflow-hidden md:hidden">
                <Photo src={r.photo} w={1800} h={1200} alt={r.alt} sizes="100vw" className="absolute inset-0 h-full w-full" />
              </div>
            </li>
          ))}
        </ol>

        {/* Desktop cursor-following preview */}
        <div
          ref={previewRef}
          aria-hidden="true"
          data-service-preview
          className={cn('pointer-events-none absolute left-0 top-0 hidden w-[300px] aspect-[4/3] overflow-hidden md:block transition-opacity duration-300', hover === null ? 'opacity-0' : 'opacity-100')}
          style={{ willChange: 'transform' }}
        >
          {rows.map((r, i) => (
            <img
              key={r.title}
              src={r.photo}
              alt=""
              className={cn('absolute inset-0 h-full w-full object-cover transition-opacity duration-300 [filter:grayscale(1)_sepia(.42)_contrast(1.06)]', hover === i ? 'opacity-100' : 'opacity-0')}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
