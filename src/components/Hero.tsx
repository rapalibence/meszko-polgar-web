import { ArrowUpRight, Check } from '@phosphor-icons/react';
import { useLayoutEffect, useRef } from 'react';
import { site } from '../content/site';
import { EASE_OUT, gsap, MOTION_OK, ScrollTrigger } from '../lib/gsap';
import { useScrollStore } from '../lib/scrollStore';
import { Photo } from './Photo';
import { ButtonLink } from './ui/Button';

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
      const img = el.querySelector('[data-hero-photo] img');
      const lines = el.querySelectorAll('[data-line]');
      const copy = el.querySelectorAll('[data-copy]');

      // Intro only on a fresh top-of-page load. Scroll restoration can land a frame after mount,
      // so hide first and decide on the next frame.
      let raf = 0;
      if (window.scrollY <= 40) {
        gsap.set(lines, { yPercent: 112 });
        gsap.set(copy, { y: 22 });
        raf = requestAnimationFrame(() => {
          if (window.scrollY > 40) {
            gsap.set([lines, copy], { clearProps: 'transform' });
            return;
          }
          const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });
          tl.from(img, { scale: 1.08, transformOrigin: '50% 60%', duration: 1.6, ease: 'power2.out' }, 0)
            .to(lines, { yPercent: 0, duration: 0.85, stagger: 0.08 }, 0.1)
            .to(copy, { y: 0, duration: 0.6, stagger: 0.07 }, 0.35);
          // If the browser restores a deep scroll position late, finish instantly instead of playing.
          const bail = () => { if (window.scrollY > 40 && tl.progress() < 0.4) tl.progress(1); };
          window.addEventListener('scroll', bail, { passive: true, once: true });
        });
      }

      const st = { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.6 } as const;
      // The photo slowly pushes in as you leave; copy lifts away a touch faster than the page.
      gsap.to(img, { scale: 1.1, transformOrigin: '50% 60%', ease: 'none', scrollTrigger: st });
      gsap.to('[data-hero-copy]', { y: -70, opacity: 0, ease: 'none', scrollTrigger: { ...st, start: '25% top' } });
      return () => cancelAnimationFrame(raf);
    });
    return () => {
      io.disconnect();
      mm.revert();
      ScrollTrigger.refresh();
    };
  }, [set]);

  return (
    <section id="hero" ref={ref} className="relative min-h-[100dvh] overflow-hidden bg-olive text-dark-ink">
      <div data-hero-photo className="absolute inset-0">
        <Photo
          src="/photo/hero-quarry.webp"
          w={2400}
          h={1600}
          alt="Teraszos kőbánya hegyekkel a háttérben"
          priority
          still
          sizes="100vw"
          className="h-full w-full"
          imgClassName="[will-change:transform] object-[50%_60%]"
        />
      </div>
      {/* Bottom-up scrim so the copy reads; the top stays photographic. */}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-olive via-olive/55 via-45% to-olive/5" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-olive/50 to-transparent md:to-50%" />
      {/* Top scrim keeps the nav legible over bright sky. */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/55 to-transparent" />

      <div className="relative mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col justify-end px-5 pb-10 pt-[88px] md:px-8 md:pb-16">
        <div data-hero-copy className="max-w-[760px]">
          <p data-eyebrow data-copy className="font-mono text-[12px] tracking-[0.18em] text-dark-ink/70">{site.hero.eyebrow}</p>
          <h1 className="mt-5 text-[14vw] font-bold leading-[0.9] tracking-[-0.01em] text-dark-ink md:text-[7.4vw] lg:text-[6.6rem]">
            <Lines text={site.hero.h1} />
          </h1>
          <div className="mt-7 grid gap-6 md:grid-cols-12 md:items-end">
            <p data-copy className="max-w-[46ch] text-[17px] leading-[1.55] text-dark-ink/80 md:col-span-7">{site.hero.sub}</p>
            <div data-copy className="flex flex-wrap gap-3 md:col-span-5 md:justify-end">
              <ButtonLink href="#kapcsolat" data-cta className="gap-2">{site.cta}<ArrowUpRight size={16} weight="bold" aria-hidden="true" /></ButtonLink>
              <ButtonLink href="#termekek" variant="ghost">{site.hero.secondary}</ButtonLink>
            </div>
          </div>
          <ul data-copy className="mt-7 flex flex-wrap gap-x-6 gap-y-2 border-t border-dark-hairline pt-5">
            {site.hero.proof.map((p) => (
              <li key={p} className="flex items-center gap-2 text-[14px] text-dark-ink/85">
                <Check size={16} weight="bold" className="text-accent" aria-hidden="true" />
                {p}
              </li>
            ))}
            <li className="ml-auto hidden items-center gap-6 font-mono text-[12px] text-dark-ink/60 md:flex">
              {site.hero.data.map((d, i) => (
                <span key={d} className="flex items-center gap-6">
                  {i > 0 && <span className="h-3 w-px bg-dark-ink/30" aria-hidden="true" />}
                  {d}
                </span>
              ))}
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
