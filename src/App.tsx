import { useLayoutEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { Stats } from './components/Stats';
import { Fractions } from './components/Fractions';
import { Process } from './components/Process';
import { CtaBand } from './components/CtaBand';
import { Services } from './components/Services';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Legal } from './pages/Legal';


/** The browser's hash jump fires before React has rendered the sections; redo it once they exist. */
function useHashLanding() {
  useLayoutEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    el.scrollIntoView();
    document.documentElement.style.scrollBehavior = prev;
  }, []);
}

function Home() {
  useHashLanding();
  return (
    <>
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Stats />
        <Fractions />
        <Process />
        <Services />
        <About />
        <CtaBand />
        <Contact />
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
