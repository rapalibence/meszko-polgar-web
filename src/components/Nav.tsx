import { List, X } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { site } from '../content/site';
import { EASE } from '../lib/motion';
import { cn } from '../lib/cn';
import { ButtonLink } from './ui/Button';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>('');
  const [open, setOpen] = useState(false);

  // Scrolled state via a sentinel, not a scroll listener.
  useEffect(() => {
    const sentinel = document.getElementById('nav-sentinel');
    if (!sentinel) return;
    const io = new IntersectionObserver(([e]) => setScrolled(!e.isIntersecting), { threshold: 0 });
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  // Active section: track the set of nav sections crossing the viewport's middle band;
  // when none does (hero, descent, footer) no link is underlined.
  useEffect(() => {
    const ids = site.nav.map((n) => n.href.slice(1));
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const inView = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) inView.add(e.target.id);
          else inView.delete(e.target.id);
        }
        const first = ids.find((id) => inView.has(id));
        setActive(first ? `#${first}` : '');
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <div id="nav-sentinel" className="absolute top-10 h-px w-px" aria-hidden="true" />
      <header
        data-nav
        className={cn(
          'fixed inset-x-0 top-0 z-40 h-[72px] transition-colors duration-200',
          scrolled ? 'bg-bg/90 backdrop-blur-[2px] border-b border-hairline' : 'bg-transparent',
        )}
        style={{ transitionTimingFunction: 'var(--ease)' }}
      >
        <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-5 md:px-8">
          <a href="#hero" className="font-display text-[22px] font-bold uppercase leading-none tracking-[0.01em] text-ink">
            {site.brand} <span className="text-stone font-semibold normal-case">{site.brandSuffix}</span>
          </a>

          <nav aria-label="Fő navigáció" className="hidden md:flex items-center gap-8">
            {site.nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                data-active={active === n.href ? 'true' : undefined}
                className={cn(
                  'relative py-1 text-[15px] font-medium text-ink/85 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-accent after:origin-left after:scale-x-0 after:transition-transform after:duration-200',
                  active === n.href && 'after:scale-x-100',
                )}
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ButtonLink href="#kapcsolat" data-cta className="hidden md:inline-flex">
              {site.cta}
            </ButtonLink>
            <button
              type="button"
              aria-label="Menü"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="md:hidden flex h-11 w-11 items-center justify-center text-ink"
            >
              <List size={26} weight="regular" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Menü"
            className="fixed inset-0 z-50 bg-bg"
            initial={{ transform: 'translateX(100%)' }}
            animate={{ transform: 'translateX(0%)' }}
            exit={{ transform: 'translateX(100%)' }}
            transition={{ duration: 0.24, ease: EASE }}
          >
            <div className="flex h-[72px] items-center justify-between px-5">
              <span className="font-display text-[22px] font-bold uppercase text-ink">{site.brand}</span>
              <button type="button" aria-label="Bezárás" onClick={() => setOpen(false)} className="flex h-11 w-11 items-center justify-center text-ink">
                <X size={26} />
              </button>
            </div>
            <nav aria-label="Mobil navigáció" className="flex flex-col gap-2 px-5 pt-8">
              {site.nav.map((n) => (
                <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="font-display text-4xl font-semibold uppercase text-ink py-2 border-b border-hairline">
                  {n.label}
                </a>
              ))}
              <ButtonLink href="#kapcsolat" data-cta onClick={() => setOpen(false)} className="mt-8 w-full">
                {site.cta}
              </ButtonLink>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
