import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

type Props = { count?: number; extent: number; depth: number };

export function Dust({ count = 600, extent, depth }: Props) {
  const ref = useRef<THREE.Points>(null);
  const { positions, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    let s = 1234;
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rnd() * 2 - 1) * extent;
      positions[i * 3 + 1] = -rnd() * depth * 0.9 + 4;
      positions[i * 3 + 2] = (rnd() * 2 - 1) * extent;
      phases[i] = rnd() * Math.PI * 2;
    }
    return { positions, phases };
  }, [count, extent, depth]);

  useFrame((state) => {
    const pts = ref.current;
    if (!pts) return;
    const e = state.clock.elapsedTime;
    const arr = pts.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] = positions[i * 3 + 1] + Math.sin(e * 0.25 + phases[i]) * 0.6;
      arr[i * 3] = positions[i * 3] + Math.cos(e * 0.18 + phases[i]) * 0.4;
    }
    pts.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions.slice(), 3]} />
      </bufferGeometry>
      <pointsMaterial color="#EDE8DF" size={0.06} transparent opacity={0.35} sizeAttenuation depthWrite={false} />
    </points>
  );
}
