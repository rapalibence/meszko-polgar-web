import { Link } from 'react-router-dom';
import { site } from '../content/site';

type Props = { h1: string; body: string; back: string; status?: number };

/** Thank-you and 404 pages share one quiet layout. */
export function Simple({ h1, body, back }: Props) {
  return (
    <main className="relative z-10 flex min-h-[100dvh] items-center bg-bg">
      <div className="mx-auto w-full max-w-[1400px] px-5 pt-[88px] pb-20 md:px-8">
        <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-stone">{site.brand} {site.brandSuffix}</p>
        <h1 className="mt-4 max-w-[16ch] text-[clamp(32px,5vw,64px)] text-ink">{h1}</h1>
        <p className="mt-6 max-w-[52ch] text-[17px] text-stone">{body}</p>
        <Link to="/" className="mt-10 inline-flex h-12 items-center border border-ink px-6 text-[15px] font-semibold text-ink">{back}</Link>
      </div>
    </main>
  );
}
