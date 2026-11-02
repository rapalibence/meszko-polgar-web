import { Link } from 'react-router-dom';
import { site } from '../content/site';

export function Footer() {
  return (
    <footer className="relative bg-dark text-dark-ink">
      <div className="relative mx-auto max-w-[1400px] px-5 py-14 md:px-8 md:py-20">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-[18px] font-semibold">{site.brand} <span className="opacity-70 font-normal">{site.brandSuffix}</span></p>
            <p className="mt-3 max-w-[48ch] text-[14px] text-dark-ink/70">{site.footer.legal}</p>
          </div>
          <nav aria-label="Felfedezés" className="md:col-span-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-dark-ink/50">Felfedezés</p>
            <ul className="mt-3 space-y-2 text-[15px] text-dark-ink/85">
              {site.nav.map((n) => <li key={n.href}><a href={n.href}>{n.label}</a></li>)}
              <li><a href="#gyik">Gyakori kérdések</a></li>
            </ul>
          </nav>
          <nav aria-label="Jogi" className="md:col-span-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-dark-ink/50">Jogi</p>
            <ul className="mt-3 space-y-2 text-[15px] text-dark-ink/85">
              {site.footer.links.map((l) => <li key={l.href}><Link to={l.href}>{l.label}</Link></li>)}
            </ul>
          </nav>
          <div className="md:col-span-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-dark-ink/50">Kapcsolat</p>
            <ul className="mt-3 space-y-2 text-[15px] text-dark-ink/85">
              {site.contact.rows.slice(0, 3).map((r) => <li key={r.label}>{r.value}</li>)}
            </ul>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t border-dark-hairline pt-6 text-[13px] text-dark-ink/60 md:flex-row md:justify-between">
          <p>{site.footer.copyright}</p>
          <p>{site.footer_credit}</p>
        </div>
      </div>
    </footer>
  );
}
