import { lazy, Suspense, useEffect, useLayoutEffect, useState } from 'react';
import { useLenis } from './lib/lenis';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';

// Below-the-fold sections load after the hero so the first paint carries only what it needs.
const Products = lazy(() => import('./components/Products').then((m) => ({ default: m.Products })));
const Process = lazy(() => import('./components/Process').then((m) => ({ default: m.Process })));
const Services = lazy(() => import('./components/Services').then((m) => ({ default: m.Services })));
const Faq = lazy(() => import('./components/Faq').then((m) => ({ default: m.Faq })));
const Contact = lazy(() => import('./components/Contact').then((m) => ({ default: m.Contact })));
import { About } from './components/About';
import { Legal } from './pages/Legal';
import { Simple } from './pages/Simple';
import { StickyCta } from './components/StickyCta';
import { site } from './content/site';


/** The browser's hash jump fires before React has rendered the sections; redo it once they exist. */
function useHashLanding() {
  useLayoutEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    // Below-the-fold sections are lazy, so the target may mount a moment later: watch for it.
    const jump = (el: HTMLElement) => {
      const prev = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = 'auto';
      el.scrollIntoView();
      document.documentElement.style.scrollBehavior = prev;
    };
    const now = document.getElementById(id);
    if (now) { jump(now); return; }
    const mo = new MutationObserver(() => {
      const el = document.getElementById(id);
      if (el) { mo.disconnect(); jump(el); }
    });
    mo.observe(document.body, { childList: true, subtree: true });
    const stop = window.setTimeout(() => mo.disconnect(), 4000);
    return () => { mo.disconnect(); clearTimeout(stop); };
  }, []);
}

/**
 * Mount the below-the-fold sections only once the page has loaded (or on the first sign of intent),
 * so their chunks never race the hero image for bandwidth. A hash landing mounts them at once.
 */
function useDeferredSections() {
  const [ready, setReady] = useState(() => !!window.location.hash || document.readyState === 'complete');
  useEffect(() => {
    if (ready) return;
    const go = () => setReady(true);
    const intent = ['scroll', 'pointerdown', 'touchstart', 'keydown', 'wheel'] as const;
    intent.forEach((t) => window.addEventListener(t, go, { once: true, passive: true, capture: true }));
    window.addEventListener('load', go, { once: true });
    return () => {
      intent.forEach((t) => window.removeEventListener(t, go, { capture: true }));
      window.removeEventListener('load', go);
    };
  }, [ready]);
  // An anchor clicked before its section exists: mount, wait for the element, then jump.
  useEffect(() => {
    if (ready) return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = decodeURIComponent(a.getAttribute('href')!.slice(1));
      if (!id || document.getElementById(id)) return;
      e.preventDefault();
      setReady(true);
      const mo = new MutationObserver(() => {
        const el = document.getElementById(id);
        if (el) { mo.disconnect(); el.scrollIntoView(); history.replaceState(null, '', `#${id}`); }
      });
      mo.observe(document.body, { childList: true, subtree: true });
      window.setTimeout(() => mo.disconnect(), 4000);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [ready]);
  return ready;
}

function Home() {
  useHashLanding();
  useLenis();
  const ready = useDeferredSections();
  const placeholder = <div className="min-h-[100dvh] bg-dark" aria-hidden="true" />;
  return (
    <>
      <Nav />
      <main className="relative z-10">
        <Hero />
        <About />
        {ready ? (
          <Suspense fallback={placeholder}>
            <Products />
            <Process />
            <Services />
            <Faq />
            <Contact />
          </Suspense>
        ) : placeholder}
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
      <StickyCta />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/adatkezeles" element={<Legal title="Adatkezelési tájékoztató" />} />
        <Route path="/impresszum" element={<Legal title="Impresszum" />} />
        <Route path="/koszonjuk" element={<Simple h1={site.thanks.h1} body={site.thanks.body} back={site.thanks.back} />} />
        <Route path="*" element={<Simple h1={site.notFound.h1} body={site.notFound.body} back={site.notFound.back} />} />
      </Routes>
    </BrowserRouter>
  );
}
