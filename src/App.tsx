import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { Marquee } from './components/Marquee';
import { Products } from './components/Products';
import { Descent } from './components/Descent';
import { Services } from './components/Services';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { Legal } from './pages/Legal';

const PitScene = lazy(() => import('./three/PitScene').then((m) => ({ default: m.PitScene })));

function Home() {
  return (
    <>
      <Suspense fallback={null}>
        <PitScene />
      </Suspense>
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Marquee />
        <Products />
        <Descent />
        <Services />
        <About />
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
