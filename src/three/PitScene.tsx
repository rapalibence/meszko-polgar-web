import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { buildPit } from './terrain';
import { buildContours } from './contours';
import { createContourMaterial } from './ContourMaterial';
import { CameraRig } from './CameraRig';
import { Dust } from './Dust';
import { hasWebGL } from './webgl';
import { useScrollStore } from '../lib/scrollStore';
import { useReducedMotion } from '../lib/useReducedMotion';

export const PIT_OPTIONS = { tiers: 7, radius: 10, depth: 14, segments: 128, seed: 7 };
const CONTOUR_INTERVAL = 1;
const SWEEP_PERIOD = 8;

function Pit({ reducedMotion }: { reducedMotion: boolean }) {
  const pit = useMemo(() => buildPit(PIT_OPTIONS), []);
  const contours = useMemo(() => buildContours(pit, PIT_OPTIONS, CONTOUR_INTERVAL), [pit]);

  const terrainGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pit.positions, 3));
    g.setAttribute('normal', new THREE.BufferAttribute(pit.normals, 3));
    return g;
  }, [pit]);

  const contourGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(contours.positions, 3));
    g.setAttribute('aLevel', new THREE.BufferAttribute(contours.levels, 1));
    return g;
  }, [contours]);

  const material = useMemo(() => createContourMaterial(), []);
  const tierStep = PIT_OPTIONS.depth / PIT_OPTIONS.tiers;

  useFrame((state) => {
    const descent = useScrollStore.getState().descent;
    const u = material.uniforms;
    if (descent > 0.01) {
      // Five process steps map onto benches 1..5 (bench 0 is the rim).
      const bench = Math.min(5, Math.round(descent * 5));
      u.uActiveMax.value = -tierStep * (bench - 1) + 0.01;
      u.uActiveMin.value = -tierStep * bench - 0.01;
      u.uSweep.value = -999;
    } else {
      u.uActiveMin.value = 1;
      u.uActiveMax.value = 1;
      if (!reducedMotion) {
        const phase = (state.clock.elapsedTime % SWEEP_PERIOD) / SWEEP_PERIOD;
        u.uSweep.value = -pit.extent - 2 + phase * (pit.extent * 2 + 4);
      }
    }
  });

  return (
    <group>
      <mesh geometry={terrainGeom} receiveShadow>
        <meshStandardMaterial color="#5A554C" roughness={1} metalness={0} flatShading side={THREE.DoubleSide} />
      </mesh>
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
      style={{ opacity: visible ? 1 : 0, transitionTimingFunction: 'var(--ease)' }}
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
          <Pit reducedMotion={reducedMotion} />
          {!narrow && !reducedMotion && <Dust extent={pitExtent} depth={PIT_OPTIONS.depth} />}
          <CameraRig depth={PIT_OPTIONS.depth} reducedMotion={reducedMotion} />
        </Canvas>
      ) : (
        <img src="/pit-fallback.jpg" alt="" className="h-full w-full object-cover opacity-80" />
      )}
    </div>
  );
}
