import { Link } from 'react-router-dom';
import { site } from '../content/site';

export function Legal({ title }: { title: string }) {
  return (
    <main className="relative z-10 mx-auto max-w-[72ch] px-5 pt-[120px] pb-24">
      <h1 className="text-5xl text-ink">{title}</h1>
      <p className="mt-6 text-stone">[A dokumentum szövege a megrendelőtől érkezik.]</p>
      <p className="mt-10"><Link to="/" className="text-ink underline underline-offset-4">Vissza a főoldalra</Link></p>
      <p className="mt-16 text-[13px] text-stone-deep">{site.footer.copyright}</p>
    </main>
  );
}
