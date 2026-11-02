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


function Home() {
  return (
    <>
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
