import { ArrowUpRight } from '@phosphor-icons/react';
import { SplitText } from 'gsap/SplitText';
import { useLayoutEffect, useRef } from 'react';
import { site } from '../content/site';
import { EASE_OUT, gsap, MOTION_OK, ScrollTrigger } from '../lib/gsap';
import { useScrollStore } from '../lib/scrollStore';
import Magnet from '../vendor/react-bits/Magnet';
import { ButtonLink } from './ui/Button';

gsap.registerPlugin(SplitText);

/**
 * Poster hero: one giant word across the full width on chocolate, the duotone truck cut-out
 * riding over its lower half, two label bars under it, lead + CTAs along the bottom.
 * Intro: letters rise through a mask, truck slides in. Scroll: word and truck parallax apart.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const wordRef = useRef<HTMLHeadingElement>(null);
  const set = useScrollStore((s) => s.set);

  useLayoutEffect(() => {
    const el = ref.current;
    const word = wordRef.current;
    if (!el || !word) return;
    const io = new IntersectionObserver(([e]) => set({ heroVisible: !!e?.isIntersecting }), { threshold: 0.05 });
    io.observe(el);

    // The word always spans the container exactly: measure once per resize, scale the font.
    const fit = () => {
      const box = word.parentElement!;
      word.style.fontSize = '100px';
      word.style.width = 'max-content';
      const ratio = box.clientWidth / word.getBoundingClientRect().width;
      word.style.width = '';
      word.style.fontSize = `${Math.floor(100 * ratio * 0.99)}px`;
    };
    fit();
    let t = 0;
    const onResize = () => { clearTimeout(t); t = window.setTimeout(fit, 120); };
    window.addEventListener('resize', onResize);

    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      let split: SplitText | null = null;
      let raf = 0;
      const truck = el.querySelector('[data-truck]');
      const bars = el.querySelectorAll('[data-bar]');
      const copy = el.querySelectorAll('[data-copy]');

      const run = () => {
        fit();
        split = new SplitText(word, { type: 'chars', mask: 'chars', charsClass: 'hero-char' });
        const fresh = window.scrollY <= 40;
        if (fresh) {
          gsap.set(split.chars, { yPercent: 110 });
          gsap.set(truck, { x: 160 });
          gsap.set(bars, { scaleX: 0, transformOrigin: '0 50%' });
          gsap.set(copy, { y: 18, opacity: 0 });
          raf = requestAnimationFrame(() => {
            const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });
            tl.to(split!.chars, { yPercent: 0, duration: 0.9, stagger: { each: 0.045, from: 'start' } }, 0.1)
              .to(truck, { x: 0, duration: 1.1, ease: 'power3.out' }, 0.3)
              .to(bars, { scaleX: 1, duration: 0.6, stagger: 0.08 }, 0.7)
              .to(copy, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 }, 0.85);
            const bail = () => { if (window.scrollY > 40 && tl.progress() < 0.4) tl.progress(1); };
            window.addEventListener('scroll', bail, { passive: true, once: true });
          });
        }
        const st = { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.6 } as const;
        gsap.to(word, { y: -60, ease: 'none', scrollTrigger: st });
        gsap.to(truck, { y: -140, x: 40, ease: 'none', scrollTrigger: st });
        gsap.to('[data-hero-bottom]', { y: -30, opacity: 0, ease: 'none', scrollTrigger: { ...st, start: '20% top' } });
      };

      run();
      document.fonts?.addEventListener('loadingdone', fit);

      return () => {
        cancelAnimationFrame(raf);
        split?.revert();
      };
    });
    return () => {
      io.disconnect();
      window.removeEventListener('resize', onResize);
      mm.revert();
      ScrollTrigger.refresh();
    };
  }, [set]);

  return (
    <section id="hero" ref={ref} className="relative min-h-[100dvh] overflow-hidden bg-choco text-dark-ink on-dark">
      <div className="relative mx-auto flex min-h-[100dvh] max-w-[1600px] flex-col px-4 pt-[84px] pb-6 md:px-8 md:pb-10">
        {/* The word. Fluid size so it is always exactly one line. */}
        <div className="relative my-auto pt-6">
          <h1
            ref={wordRef}
            data-hero-word
            className="font-display font-bold uppercase leading-[0.82] tracking-[-0.02em] text-dark-ink whitespace-nowrap"
            aria-label={site.hero.word}
          >
            {site.hero.word}
          </h1>
          {/* Truck cut-out over the lower half of the word, right-anchored. */}
          <div data-truck className="pointer-events-none relative -mt-4 ml-auto w-[72%] md:absolute md:right-[1%] md:bottom-[-26%] md:mt-0 md:w-[34%] [will-change:transform]">
            <img
              src="/photo/truck-cut.webp"
              srcSet="/photo/truck-cut-sm.webp 487w, /photo/truck-cut.webp 975w"
              sizes="(min-width: 768px) 38vw, 46vw"
              width={975}
              height={532}
              alt=""
              fetchPriority="high"
              decoding="async"
              className="block h-auto w-full drop-shadow-[0_30px_40px_rgba(30,22,17,.45)]"
            />
          </div>
        </div>

        {/* Label bars under the word, G MINING corner labels. */}
        <div className="mt-3 flex items-start justify-between gap-4 md:mt-4 relative z-10">
          <span data-bar className="inline-block bg-bg px-3 py-1.5 font-display text-[clamp(16px,2.2vw,30px)] font-bold uppercase leading-none text-olive">
            {site.brand} <span className="text-olive-deep">{site.brandSuffix}</span>
          </span>
          <span data-bar className="inline-block bg-bg px-3 py-1.5 font-display text-[clamp(16px,2.2vw,30px)] font-bold uppercase leading-none text-olive">
            Székesfehérvár
          </span>
        </div>

        {/* Bottom row: lead left, CTAs right. */}
        <div data-hero-bottom className="mt-auto grid gap-6 pt-16 md:grid-cols-12 md:items-end">
          <p data-copy className="max-w-[44ch] text-[17px] leading-[1.5] text-dark-ink/85 md:col-span-6">{site.hero.sub}</p>
          <div data-copy className="flex flex-wrap gap-3 md:col-span-6 md:justify-end">
            <Magnet padding={60} magnetStrength={4} exclusive={false}>
              <ButtonLink href="#kapcsolat" data-cta className="gap-2">{site.cta}<ArrowUpRight size={16} weight="bold" aria-hidden="true" /></ButtonLink>
            </Magnet>
            <ButtonLink href="#termekek" variant="ghost">{site.hero.secondary}</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
