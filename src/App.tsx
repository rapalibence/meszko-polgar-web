import { PitScene } from './three/PitScene';

export default function App() {
  return (
    <>
      <div className="grain" aria-hidden="true" />
      <PitScene />
      <main className="relative z-10 min-h-[200dvh]" />
    </>
  );
}
