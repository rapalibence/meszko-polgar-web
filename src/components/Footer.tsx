import { Link } from 'react-router-dom';
import { site } from '../content/site';

export function Footer() {
  return (
    <footer className="relative bg-dark text-dark-ink">
      <div className="relative mx-auto max-w-[1400px] px-5 md:px-8 py-12 md:py-16">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-display text-[22px] font-bold uppercase text-dark-ink">
              {site.brand} <span className="text-dark-ink/60 font-semibold normal-case">{site.brandSuffix}</span>
            </p>
            <p className="mt-3 max-w-[60ch] text-[14px] text-dark-ink/60">{site.footer.legal}</p>
          </div>
          <nav aria-label="Jogi" className="flex gap-6 text-[14px] text-dark-ink/85">
            {site.footer.links.map((l) => (
              <Link key={l.href} to={l.href}>{l.label}</Link>
            ))}
          </nav>
        </div>
        <div className="mt-10 flex flex-col gap-2 text-[13px] text-dark-ink/50 md:flex-row md:justify-between">
          <p>{site.footer.copyright}</p>
          <p>{site.footer_credit}</p>
        </div>
      </div>
    </footer>
  );
}
