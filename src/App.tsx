import { lazy, Suspense, useLayoutEffect } from 'react';
import { useLenis } from './lib/lenis';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';

// Below-the-fold sections load after the hero so the first paint carries only what it needs.
const Fractions = lazy(() => import('./components/Fractions').then((m) => ({ default: m.Fractions })));
const Process = lazy(() => import('./components/Process').then((m) => ({ default: m.Process })));
const Services = lazy(() => import('./components/Services').then((m) => ({ default: m.Services })));
const About = lazy(() => import('./components/About').then((m) => ({ default: m.About })));
const CtaBand = lazy(() => import('./components/CtaBand').then((m) => ({ default: m.CtaBand })));
const Contact = lazy(() => import('./components/Contact').then((m) => ({ default: m.Contact })));
import { Stats } from './components/Stats';
import { Legal } from './pages/Legal';


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

function Home() {
  useHashLanding();
  useLenis();
  return (
    <>
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Stats />
        <Suspense fallback={<div className="min-h-[100dvh] bg-panel" aria-hidden="true" />}>
          <Fractions />
          <Process />
          <Services />
          <About />
          <CtaBand />
          <Contact />
        </Suspense>
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="grain" aria-hidden="true" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/adatkezeles" element={<Legal title="Adatkezelési tájékoztató" />} />
        <Route path="/impresszum" element={<Legal title="Impresszum" />} />
      </Routes>
    </BrowserRouter>
  );
}
