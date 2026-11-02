import { List, X } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { site } from '../content/site';
import { cn } from '../lib/cn';
import { useScrollStore } from '../lib/scrollStore';
import { ButtonLink } from './ui/Button';

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>('');
  const [open, setOpen] = useState(false);
  const heroVisible = useScrollStore((s) => s.heroVisible);
  const onDark = heroVisible && !open;

  useEffect(() => {
    const sentinel = document.getElementById('nav-sentinel');
    if (!sentinel) return;
    const io = new IntersectionObserver(([e]) => setScrolled(!e.isIntersecting), { threshold: 0 });
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const ids = site.nav.map((n) => n.href.slice(1));
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
    const seen = new Set<string>();
    const attach = () => {
      for (const id of ids) {
        if (seen.has(id)) continue;
        const el = document.getElementById(id);
        if (el) { seen.add(id); io.observe(el); }
      }
      if (seen.size === ids.length) mo.disconnect();
    };
    const mo = new MutationObserver(attach);
    mo.observe(document.body, { childList: true, subtree: true });
    attach();
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [open]);

  return (
    <>
      <div id="nav-sentinel" className="absolute top-10 h-px w-px" aria-hidden="true" />
      <header
        data-nav
        className={cn(
          'fixed inset-x-0 top-0 z-40 h-[72px] transition-colors duration-200',
          scrolled && !heroVisible ? 'bg-bg/95 border-b border-hairline text-ink' : 'bg-transparent',
          onDark ? 'text-dark-ink' : 'text-ink',
        )}
        style={{ transitionTimingFunction: 'var(--ease)' }}
      >
        <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-5 md:px-8">
          <a href="#hero" className="text-[18px] font-semibold leading-none tracking-[-0.01em] text-current">
            {site.brand} <span className="opacity-70 font-normal">{site.brandSuffix}</span>
          </a>

          <nav aria-label="Fő navigáció" className="hidden md:flex items-center gap-7">
            {site.nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                data-active={active === n.href ? 'true' : undefined}
                className={cn(
                  'relative py-1 text-[15px] text-current/85 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-current after:origin-left after:scale-x-0 after:transition-transform after:duration-200',
                  active === n.href && 'after:scale-x-100',
                )}
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ButtonLink href="#kapcsolat" data-cta variant={onDark ? 'ghost' : 'primary'} className="hidden md:inline-flex h-10 px-5">
              {site.cta}
            </ButtonLink>
            <button
              type="button"
              aria-label={site.menu.open}
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="flex h-10 items-center gap-2 border border-current/40 px-3 text-[14px] text-current"
            >
              <span className="hidden sm:inline">{site.menu.open}</span>
              <List size={20} weight="regular" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen menu, Cominvi-style */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={site.menu.open}
        aria-hidden={!open}
        inert={!open}
        data-menu
        className="fixed inset-0 z-50 bg-dark text-dark-ink transition-opacity duration-[240ms]"
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transitionTimingFunction: 'var(--ease)' }}
      >
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 md:px-8">
          <span className="text-[18px] font-semibold">{site.brand} <span className="opacity-70 font-normal">{site.brandSuffix}</span></span>
          <button type="button" aria-label={site.menu.close} onClick={() => setOpen(false)} className="flex h-10 items-center gap-2 border border-dark-hairline px-3 text-[14px]">
            <span className="hidden sm:inline">{site.menu.close}</span>
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 pt-10 md:grid-cols-12 md:px-8 md:pt-20">
          <nav aria-label="Menü" className="md:col-span-7">
            {site.nav.map((n, i) => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="group flex items-baseline gap-5 border-b border-dark-hairline py-4 md:py-6">
                <span className="font-mono text-[12px] text-dark-ink/50 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-[32px] font-semibold md:text-[48px]">{n.label}</span>
              </a>
            ))}
          </nav>
          <div className="md:col-span-4 md:col-start-9">
            <ul className="space-y-4 text-[15px] text-dark-ink/80">
              {site.contact.rows.map((r) => (
                <li key={r.label}>
                  <span className="block font-mono text-[11px] uppercase tracking-[0.12em] text-dark-ink/50">{r.label}</span>
                  {r.value}
                </li>
              ))}
            </ul>
            <ButtonLink href="#kapcsolat" data-cta onClick={() => setOpen(false)} className="mt-10 w-full md:w-auto">{site.cta}</ButtonLink>
          </div>
        </div>
      </div>
    </>
  );
}
