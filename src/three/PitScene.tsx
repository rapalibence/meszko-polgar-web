import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import type { PitWorkerResponse } from './pit.worker';
import { createContourMaterial } from './ContourMaterial';
import { createTerrainMaterial } from './TerrainMaterial';
import { CameraRig } from './CameraRig';
import { Dust } from './Dust';
import { hasWebGL } from './webgl';
import { useScrollStore } from '../lib/scrollStore';
import { useReducedMotion } from '../lib/useReducedMotion';

export const PIT_OPTIONS = { tiers: 7, radius: 10, depth: 14, segments: 112, seed: 7 };
const CONTOUR_INTERVAL = 1;
const SWEEP_PERIOD = 8;

/** Geometry is generated off the main thread; null until the worker answers. */
function usePitGeometry() {
  const [data, setData] = useState<PitWorkerResponse | null>(null);
  useEffect(() => {
    const worker = new Worker(new URL('./pit.worker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (e: MessageEvent<PitWorkerResponse>) => setData(e.data);
    worker.postMessage({ opts: PIT_OPTIONS, interval: CONTOUR_INTERVAL });
    return () => worker.terminate();
  }, []);
  return data;
}

function Pit({ reducedMotion, data }: { reducedMotion: boolean; data: PitWorkerResponse }) {
  const terrainGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(data.positions, 3));
    g.setAttribute('normal', new THREE.BufferAttribute(data.normals, 3));
    return g;
  }, [data]);

  const contourGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(data.contourPositions, 3));
    g.setAttribute('aLevel', new THREE.BufferAttribute(data.contourLevels, 1));
    return g;
  }, [data]);

  const material = useMemo(() => createContourMaterial(), []);
  const terrain = useMemo(() => createTerrainMaterial(), []);
  const tierStep = data.tierStep;

  useFrame((state) => {
    const descent = useScrollStore.getState().descent;
    const u = material.uniforms;
    const t = terrain.uniforms;
    if (descent > 0.01) {
      // Five process steps map onto benches 1..5 (bench 0 is the rim).
      const bench = Math.min(5, Math.floor(descent * 5) + 1);
      const max = -tierStep * (bench - 1) + 0.01;
      const min = -tierStep * bench - 0.01;
      u.uActiveMax.value = max;
      u.uActiveMin.value = min;
      t.uActiveMax.value = max;
      t.uActiveMin.value = min;
      t.uGlow.value += (1 - t.uGlow.value) * 0.08;
      u.uSweep.value = -999;
    } else {
      u.uActiveMin.value = 1;
      u.uActiveMax.value = 1;
      t.uGlow.value += (0 - t.uGlow.value) * 0.08;
      if (!reducedMotion) {
        const phase = (state.clock.elapsedTime % SWEEP_PERIOD) / SWEEP_PERIOD;
        u.uSweep.value = -data.extent - 2 + phase * (data.extent * 2 + 4);
      }
    }
  });

  return (
    <group>
      <mesh geometry={terrainGeom} material={terrain.material} />
      <lineSegments geometry={contourGeom} material={material} />
      
    </group>
  );
}

function Lights() {
  return (
    <>
      <directionalLight position={[18, 9, 6]} intensity={2.6} color="#FFF1E0" />
      <hemisphereLight args={['#7A7468', '#141311', 1.0]} />
      <pointLight position={[-12, -4, -9]} intensity={1.4} color="#E4561B" distance={50} decay={1.1} />
    </>
  );
}

export function PitScene() {
  const reducedMotion = useReducedMotion();
  const heroVisible = useScrollStore((s) => s.heroVisible);
  const descentVisible = useScrollStore((s) => s.descentVisible);
  const visible = heroVisible || descentVisible;
  const [webgl, setWebgl] = useState(true);
  const [narrow, setNarrow] = useState(false);
  const data = usePitGeometry();

  useEffect(() => {
    setWebgl(hasWebGL());
    const update = () => setNarrow(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const pitExtent = PIT_OPTIONS.radius * 1.4;

  return (
    <div
      aria-hidden="true"
      data-pit-scene
      className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-[400ms]"
      style={{ opacity: visible && data ? 1 : 0, transitionTimingFunction: 'var(--ease)' }}
    >
      {webgl ? (
        <Canvas
          dpr={narrow ? 1 : [1, 1.5]}
          frameloop={visible ? 'always' : 'demand'}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          camera={{ fov: 36, near: 0.1, far: 200, position: [17, 10, 19] }}
        >
          <fog attach="fog" args={['#141311', 24, 60]} />
          <Lights />
          {data && <Pit reducedMotion={reducedMotion} data={data} />}
          {!narrow && !reducedMotion && <Dust extent={pitExtent} depth={PIT_OPTIONS.depth} />}
          <CameraRig depth={PIT_OPTIONS.depth} reducedMotion={reducedMotion} />
        </Canvas>
      ) : (
        <img src="/pit-fallback.webp" alt="" className="h-full w-full object-cover opacity-80" />
      )}
    </div>
  );
}
