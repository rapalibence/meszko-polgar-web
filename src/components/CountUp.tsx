import { useRef } from 'react';
import { useCountUp } from '../lib/gsap';

type Props = { value: string; numeric: number | null; className?: string };

/** Counts 0 → numeric over 900ms once in view; renders `value` verbatim when numeric is null. */
export function CountUp({ value, numeric, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  useCountUp(ref, numeric, value);
  return (
    <span ref={ref} data-figure className={className}>
      {value}
    </span>
  );
}
