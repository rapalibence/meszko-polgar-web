import { useMemo } from 'react';

type Props = {
  /** Haul-ramp centreline samples from the terrain (rim → floor). */
  ramp: { x: number; y: number; z: number; angle: number }[];
  floorY: number;
  radius: number;
};

const STONE = '#8F887A';
const STONE_DARK = '#5C564D';
const STEEL = '#3A3833';
const ACCENT = '#E4561B';

/** Low-poly quarry props: stockpile cones on the floor, a crusher plant, two tippers on the ramp. */
export function Props({ ramp, floorY, radius }: Props) {
  const stockpiles = useMemo(() => {
    const out: { pos: [number, number, number]; r: number; h: number; c: string }[] = [];
    const seeds = [0.15, 0.95, 1.9, 2.8, 3.9];
    seeds.forEach((a, i) => {
      const d = radius * (0.06 + 0.055 * (i % 3));
      const r = 0.55 + 0.25 * ((i * 7) % 3);
      out.push({ pos: [Math.cos(a) * d, floorY, Math.sin(a) * d], r, h: r * 0.9, c: i % 2 ? STONE : STONE_DARK });
    });
    return out;
  }, [floorY, radius]);

  const trucks = useMemo(() => {
    const picks = [Math.floor(ramp.length * 0.3), Math.floor(ramp.length * 0.72)];
    return picks.map((i) => {
      const p = ramp[i];
      const n = ramp[Math.min(ramp.length - 1, i + 1)];
      const heading = Math.atan2(n.x - p.x, n.z - p.z);
      return { pos: [p.x, p.y + 0.18, p.z] as [number, number, number], rot: heading };
    });
  }, [ramp]);

  const crusherAngle = ramp[ramp.length - 1].angle + Math.PI * 0.9;
  const crusherPos: [number, number, number] = [Math.cos(crusherAngle) * radius * 0.12, floorY, Math.sin(crusherAngle) * radius * 0.12];

  return (
    <group>
      {stockpiles.map((s, i) => (
        <mesh key={i} position={[s.pos[0], s.pos[1] + s.h / 2, s.pos[2]]}>
          <coneGeometry args={[s.r, s.h, 9]} />
          <meshStandardMaterial color={s.c} roughness={1} flatShading />
        </mesh>
      ))}

      {/* Crusher plant: hopper block + conveyor */}
      <group position={crusherPos} rotation={[0, crusherAngle, 0]}>
        <mesh position={[0, 0.45, 0]}>
          <boxGeometry args={[1.1, 0.9, 0.8]} />
          <meshStandardMaterial color={STEEL} roughness={0.9} flatShading />
        </mesh>
        <mesh position={[0.9, 0.75, 0]} rotation={[0, 0, 0.5]}>
          <boxGeometry args={[1.8, 0.08, 0.3]} />
          <meshStandardMaterial color={STEEL} roughness={0.9} />
        </mesh>
        <mesh position={[0.2, 0.95, 0]}>
          <boxGeometry args={[0.5, 0.1, 0.5]} />
          <meshStandardMaterial color={ACCENT} roughness={0.8} />
        </mesh>
      </group>

      {/* Tippers on the haul ramp */}
      {trucks.map((t, i) => (
        <group key={i} position={t.pos} rotation={[0, t.rot, 0]}>
          <mesh position={[0, 0.13, 0.1]}>
            <boxGeometry args={[0.36, 0.22, 0.62]} />
            <meshStandardMaterial color={STONE_DARK} roughness={1} flatShading />
          </mesh>
          <mesh position={[0, 0.2, -0.3]}>
            <boxGeometry args={[0.34, 0.26, 0.22]} />
            <meshStandardMaterial color={ACCENT} roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
