import { ArrowRight } from '@phosphor-icons/react';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { site } from '../content/site';
import { EASE_OUT, gsap, MOTION_OK } from '../lib/gsap';
import { useScrollStore } from '../lib/scrollStore';
import { ButtonLink } from './ui/Button';

/**
 * Still hero: one large photograph, a solid panel riding over its lower-left edge with the
 * headline and the CTA (Heidelberg), two link cards on the right (Cominvi). Nothing moves after
 * the first paint except a one-time fade/rise of the panel.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const set = useScrollStore((s) => s.set);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => set({ heroVisible: !!e?.isIntersecting }), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, [set]);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      if (window.scrollY > 40) return;
      gsap.from(el.querySelectorAll('[data-copy]'), { y: 16, opacity: 0, duration: 0.6, ease: EASE_OUT, stagger: 0.08, delay: 0.1 });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="hero" ref={ref} className="relative bg-dark text-dark-ink">
      {/* Photo band */}
      <div className="relative h-[56dvh] min-h-[360px] md:h-[68dvh] md:min-h-[520px]">
        <img
          src="/photo/hero-plant.webp"
          srcSet="/photo/hero-plant-sm.webp 1200w, /photo/hero-plant.webp 2400w"
          sizes="100vw"
          width={2400}
          height={1343}
          alt="Mészkő bányafal, előtte törő-osztályozó üzem és depók"
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover object-[60%_50%]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-dark/60 via-dark/10 via-40% to-transparent" />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-dark/60 to-transparent" />
        {/* Link cards, desktop: bottom-right of the photo */}
        <div data-copy className="absolute bottom-6 right-5 hidden grid-cols-2 gap-3 md:right-8 md:grid md:w-[420px]">
          {site.hero.cards.map((c) => (
            <HeroCard key={c.href} {...c} />
          ))}
        </div>
      </div>

      {/* Panel riding over the photo's lower-left edge */}
      <div className="relative mx-auto max-w-[1400px] px-0 md:px-8">
        <div data-copy className="relative -mt-0 bg-dark px-5 pb-10 pt-8 md:-mt-[200px] md:max-w-[640px] md:px-10 md:pb-10 md:pt-9">
          <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-dark-ink/70">{site.hero.label}</p>
          <h1 className="mt-4 max-w-[16ch] text-[clamp(30px,3.9vw,52px)] text-dark-ink">{site.hero.h1}</h1>
          <p className="mt-5 max-w-[46ch] text-[16px] text-dark-ink/75">{site.hero.sub}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink href="#kapcsolat" data-cta>{site.cta}</ButtonLink>
            <ButtonLink href="#termekek" variant="ghost">{site.hero.secondary}</ButtonLink>
          </div>
        </div>
        {/* Link cards, phones: 2-up under the panel */}
        <div data-copy className="grid grid-cols-2 gap-3 px-5 pb-8 md:hidden">
          {site.hero.cards.map((c) => (
            <HeroCard key={c.href} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroCard({ href, label, photo, alt }: { href: string; label: string; photo: string; alt: string }) {
  return (
    <a href={href} data-hero-card className="group relative aspect-[4/3] overflow-hidden bg-dark-raised">
      <img src={photo.replace('.webp', '-sm.webp')} alt={alt} loading="lazy" decoding="async" className="h-full w-full object-cover opacity-85" />
      <span className="absolute inset-x-2 bottom-2 flex items-center justify-between bg-dark/85 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-dark-ink">
        {label}
        <ArrowRight size={14} weight="bold" aria-hidden="true" className="transition-transform duration-200 group-hover:[@media(hover:hover)_and_(pointer:fine)]:translate-x-0.5" />
      </span>
    </a>
  );
}
