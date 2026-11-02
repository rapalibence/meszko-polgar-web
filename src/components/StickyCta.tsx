import { site } from '../content/site';
import { useScrollStore } from '../lib/scrollStore';
import { ButtonLink } from './ui/Button';

/** Phone-only bottom bar with the one CTA; appears once the hero has scrolled away. */
export function StickyCta() {
  const heroVisible = useScrollStore((s) => s.heroVisible);
  return (
    <div
      data-sticky-cta
      aria-hidden={heroVisible}
      className="fixed inset-x-0 bottom-0 z-30 border-t border-hairline bg-bg/95 p-3 backdrop-blur transition-transform duration-300 md:hidden"
      style={{ transform: heroVisible ? 'translateY(100%)' : 'translateY(0)', transitionTimingFunction: 'var(--ease)', paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
    >
      <ButtonLink href="#kapcsolat" data-cta className="w-full" tabIndex={heroVisible ? -1 : 0}>{site.cta}</ButtonLink>
    </div>
  );
}
