import { Link } from 'react-router-dom';
import { site } from '../content/site';

export function Footer() {
  return (
    <footer className="relative border-t border-hairline bg-bg">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {[30, 55, 80].map((p) => (
          <div key={p} className="absolute inset-x-0 h-px bg-hairline" style={{ top: `${p}%` }} />
        ))}
      </div>
      <div className="relative mx-auto max-w-[1400px] px-5 md:px-8 py-12 md:py-16">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-display text-[22px] font-bold uppercase text-ink">
              {site.brand} <span className="text-stone font-semibold normal-case">{site.brandSuffix}</span>
            </p>
            <p className="mt-3 max-w-[60ch] text-[14px] text-stone">{site.footer.legal}</p>
          </div>
          <nav aria-label="Jogi" className="flex gap-6 text-[14px] text-ink/85">
            {site.footer.links.map((l) => (
              <Link key={l.href} to={l.href}>{l.label}</Link>
            ))}
          </nav>
        </div>
        <p className="mt-10 text-[13px] text-stone-deep">{site.footer.copyright}</p>
      </div>
    </footer>
  );
}
