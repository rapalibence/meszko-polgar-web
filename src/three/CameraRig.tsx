import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useScrollStore } from '../lib/scrollStore';

export const CAMERA_PATH: THREE.Vector3[] = [
  new THREE.Vector3(17, 10, 19),
  new THREE.Vector3(12, 5, 13),
  new THREE.Vector3(8, 1.5, 9),
  new THREE.Vector3(6, -2.5, 6.5),
  new THREE.Vector3(4, -6.5, 4.5),
  new THREE.Vector3(2.5, -10.5, 3),
];

type Props = { depth: number; reducedMotion: boolean };

export function CameraRig({ depth, reducedMotion }: Props) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(CAMERA_PATH, false, 'catmullrom', 0.5), []);
  const { camera } = useThree();
  const pos = useRef(new THREE.Vector3());
  const target = useRef(new THREE.Vector3());
  const smooth = useRef(0);

  useFrame((state, dt) => {
    const descent = useScrollStore.getState().descent;
    // Heavy lerp so scroll scrubbing feels weighty, not twitchy.
    smooth.current += (descent - smooth.current) * Math.min(1, dt * 4);
    const t = smooth.current;
    curve.getPointAt(t, pos.current);
    if (t < 0.02 && !reducedMotion) {
      const e = state.clock.elapsedTime;
      pos.current.x += Math.sin(e * (Math.PI * 2) / 14) * 0.6;
      pos.current.y += Math.sin(e * (Math.PI * 2) / 19) * 0.3;
    }
    camera.position.copy(pos.current);
    // Target sits left of centre so the pit lands in the right 7/12 of the hero.
    target.current.set(-3.5 * (1 - t), -depth * t * 0.9, 0);
    camera.lookAt(target.current);
  });
  return null;
}
