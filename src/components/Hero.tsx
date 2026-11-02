import { Check } from '@phosphor-icons/react';
import { useLayoutEffect, useRef } from 'react';
import { site } from '../content/site';
import { EASE_OUT, gsap, MOTION_OK, ScrollTrigger } from '../lib/gsap';
import { useScrollStore } from '../lib/scrollStore';
import { PitPoster } from './PitPoster';
import { ButtonLink } from './ui/Button';

/** Split the headline into clipped lines so each can rise in from below. */
function Lines({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, i, all) => (
        <span key={i} className="line-clip">
          <span data-line>{line}{i < all.length - 1 ? ' ' : ''}</span>
        </span>
      ))}
    </>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const set = useScrollStore((s) => s.set);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => set({ heroVisible: !!e?.isIntersecting }), { threshold: 0.05 });
    io.observe(el);

    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const layers = gsap.utils.toArray<SVGGElement>(el.querySelectorAll('[data-layer]'));
      const copy = el.querySelectorAll('[data-copy]');
      const lines = el.querySelectorAll('[data-line]');

      // Intro: layers rise into place, then the headline lines, then the rest of the copy.
      // Skipped when the page is reloaded mid-scroll so nothing replays over the user.
      if (window.scrollY <= 40) {
        const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });
        tl.from(layers, { y: 140, opacity: 0, duration: 1.1, stagger: 0.08 }, 0)
          .from('[data-sun]', { scale: 0.6, transformOrigin: '50% 50%', duration: 1.2 }, 0.1)
          .from(lines, { yPercent: 112, duration: 0.9, stagger: 0.09 }, 0.35)
          .from(copy, { y: 18, opacity: 0, duration: 0.6, stagger: 0.08 }, 0.7);
      }

      // Scroll: parallax by depth. Sky and far wall recede, strata/machines sink slowly,
      // the dark foreground ledge rushes past: the eye drops into the pit.
      const depth = [-150, -110, -40, -40, -70, -200];
      const st = { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.6 } as const;
      layers.forEach((layer, n) => gsap.to(layer, { y: depth[n] ?? -40, ease: 'none', scrollTrigger: st }));
      gsap.to('[data-truck]', { x: 110, ease: 'none', scrollTrigger: st });
      gsap.to('[data-boom]', { rotation: -14, ease: 'none', scrollTrigger: st });
      gsap.to('[data-sun]', { y: 90, ease: 'none', scrollTrigger: st });
      gsap.to('[data-hero-copy]', {
        y: -60,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: el, start: '30% top', end: 'bottom top', scrub: 0.6 },
      });
    });
    return () => {
      io.disconnect();
      mm.revert();
      ScrollTrigger.refresh();
    };
  }, [set]);

  return (
    <section id="hero" ref={ref} className="relative min-h-[100dvh] bg-sky text-dark-ink overflow-hidden">
      {/* Poster: full-bleed on desktop, top band on phones. */}
      <div className="absolute inset-0 md:inset-0 h-[44dvh] md:h-auto">
        <PitPoster />
      </div>
      {/* On phones the copy sits on solid sky under the poster band. */}
      <div aria-hidden="true" className="absolute inset-x-0 top-[44dvh] bottom-0 bg-sky md:hidden" />

      <div className="relative mx-auto grid max-w-[1400px] grid-cols-12 gap-x-6 px-5 md:px-8 min-h-[100dvh] pt-[72px] items-end md:items-center">
        <div data-hero-copy className="col-span-12 md:col-span-6 lg:col-span-5 pb-8 pt-[46dvh] md:py-0">
          <p data-eyebrow data-copy className="font-mono text-[12px] tracking-[0.18em] text-dark-ink/70">
            {site.hero.eyebrow}
          </p>
          <h1 className="mt-5 text-[11.5vw] md:text-[7vw] lg:text-[6.2rem] font-bold text-dark-ink leading-[0.92]">
            <Lines text={site.hero.h1} />
          </h1>
          <p data-copy className="mt-6 max-w-[46ch] text-[17px] leading-[1.55] text-dark-ink/78">
            {site.hero.sub}
          </p>
          <ul data-copy className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
            {site.hero.proof.map((p) => (
              <li key={p} className="flex items-center gap-2 text-[14px] text-dark-ink/90">
                <Check size={16} weight="bold" className="text-accent" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
          <div data-copy className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="#kapcsolat" data-cta>{site.cta}</ButtonLink>
            <ButtonLink href="#termekek" variant="ghost">{site.hero.secondary}</ButtonLink>
          </div>
        </div>
        <div className="hidden md:block md:col-span-6 lg:col-span-7" aria-hidden="true" />
      </div>

      {/* Survey readout, bottom right. */}
      <dl data-copy className="pointer-events-none absolute bottom-8 right-5 md:right-8 hidden md:flex items-center gap-6 font-mono text-[12px] text-dark-ink/70">
        {site.hero.data.map((d, i) => (
          <div key={d} className="flex items-center gap-6">
            {i > 0 && <span className="h-3 w-px bg-dark-ink/30" aria-hidden="true" />}
            <dd>{d}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
