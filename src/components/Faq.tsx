import { Plus } from '@phosphor-icons/react';
import { cn } from '../lib/cn';
import { useRef, useState } from 'react';
import { site } from '../content/site';
import { useReveal } from '../lib/gsap';

export function Faq() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number>(-1);
  useReveal(ref);
  return (
    <section id="gyik" ref={ref} className="relative z-10 bg-bg py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="grid gap-8 border-t border-hairline pt-8 md:grid-cols-12">
          <h2 data-reveal className="text-[clamp(26px,3.2vw,44px)] font-semibold text-ink md:col-span-4">{site.faq.h2}</h2>
          <dl data-reveal className="border-t border-hairline md:col-span-8">
            {site.faq.items.map((it, i) => {
              const isOpen = open === i;
              return (
                <div key={it.q} data-faq className="border-b border-hairline">
                  <dt>
                    <button type="button" aria-expanded={isOpen} aria-controls={`faq-${i}`} onClick={() => setOpen(isOpen ? -1 : i)} className="flex w-full items-center justify-between gap-6 py-5 text-left text-[18px] font-semibold text-ink">
                      {it.q}
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-hairline">
                        <Plus size={14} weight="bold" aria-hidden="true" className={cn('transition-transform duration-200 [transition-timing-function:var(--ease)]', isOpen && 'rotate-45')} />
                      </span>
                    </button>
                  </dt>
                  <dd id={`faq-${i}`} className="acc" data-open={isOpen ? 'true' : 'false'}>
                    <div><p className="max-w-[62ch] pb-6 text-[16px] text-stone">{it.a}</p></div>
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
