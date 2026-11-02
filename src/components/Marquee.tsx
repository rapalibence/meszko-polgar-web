import { site } from '../content/site';

/** The page's one marquee. CSS-driven; pauses on hover (pointer devices), stops under reduced motion. */
export function Marquee() {
  const items = [...site.marquee, ...site.marquee, ...site.marquee];
  return (
    <div data-marquee className="relative z-10 overflow-hidden border-y border-hairline bg-bg-raised py-5 group" aria-hidden="true">
      <div data-marquee-track className="marquee-track flex w-max items-center gap-8 whitespace-nowrap">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center gap-8">
            {items.map((item, i) => (
              <span key={`${copy}-${i}`} className="flex items-center gap-8 font-display text-[44px] md:text-[56px] font-bold uppercase leading-none text-stone">
                <span className={/\d/.test(item) ? 'font-mono font-normal tracking-tight' : ''}>{item}</span>
                <span className="text-accent">·</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
