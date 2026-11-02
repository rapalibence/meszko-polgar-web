import { ArrowRight } from '@phosphor-icons/react';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { site } from '../content/site';
import { EASE_OUT, gsap, MOTION_OK } from '../lib/gsap';
import { useScrollStore } from '../lib/scrollStore';
import { useReducedMotion } from '../lib/useReducedMotion';
import { ButtonLink } from './ui/Button';

/**
 * Cinematic hero: a muted quarry loop behind sentence-case copy. The video only plays while on
 * screen and is replaced by its poster under reduced motion or Save-Data. No parallax.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const set = useScrollStore((s) => s.set);
  const reduced = useReducedMotion();
  const saveData = typeof navigator !== 'undefined' && 'connection' in navigator && !!(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  const showVideo = !reduced && !saveData;

  useEffect(() => {
    const el = ref.current;
    const video = videoRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      const on = !!e?.isIntersecting;
      set({ heroVisible: on });
      if (!video) return;
      if (on) video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, [set]);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      if (window.scrollY > 40) return;
      gsap.from(el.querySelectorAll('[data-copy]'), { y: 18, opacity: 0, duration: 0.7, ease: EASE_OUT, stagger: 0.08, delay: 0.15 });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="hero" ref={ref} className="relative min-h-[100dvh] overflow-hidden bg-dark text-dark-ink">
      <div className="absolute inset-0">
        {showVideo ? (
          <video
            ref={videoRef}
            data-hero-video
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            poster="/video/hero-poster.webp"
            aria-hidden="true"
            className="h-full w-full object-cover"
          >
            <source src="/video/hero-720.webm" type="video/webm" />
            <source src="/video/hero-720.mp4" type="video/mp4" />
          </video>
        ) : (
          <img src="/video/hero-poster.webp" srcSet="/video/hero-poster-sm.webp 800w, /video/hero-poster.webp 1600w" sizes="100vw" alt="" fetchPriority="high" className="h-full w-full object-cover" />
        )}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-dark/85 via-dark/35 via-45% to-dark/10" />
      </div>

      <div className="relative mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col justify-end px-5 pb-8 pt-[88px] md:px-8 md:pb-10">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p data-copy className="font-mono text-[12px] uppercase tracking-[0.14em] text-dark-ink/70">{site.hero.label}</p>
            <h1 data-copy className="mt-4 max-w-[14ch] text-[clamp(34px,5.2vw,72px)] text-dark-ink">{site.hero.h1}</h1>
            <div data-copy className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="#kapcsolat" data-cta>{site.cta}</ButtonLink>
            </div>
          </div>
          {/* Two link cards, Cominvi-style */}
          <div data-copy className="grid grid-cols-2 gap-3 md:col-span-5 md:justify-self-end md:w-[440px]">
            {site.hero.cards.map((c) => (
              <a key={c.href} href={c.href} data-hero-card className="group relative aspect-[4/3] overflow-hidden bg-dark-raised">
                <img src={c.photo.replace('.webp', '-sm.webp')} alt={c.alt} loading="lazy" decoding="async" className="h-full w-full object-cover opacity-80 transition-transform duration-700 [transition-timing-function:var(--ease)] group-hover:[@media(hover:hover)_and_(pointer:fine)]:scale-[1.04]" />
                <span className="absolute inset-x-2 bottom-2 flex items-center justify-between bg-dark/80 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-dark-ink">
                  {c.label}
                  <ArrowRight size={14} weight="bold" aria-hidden="true" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
