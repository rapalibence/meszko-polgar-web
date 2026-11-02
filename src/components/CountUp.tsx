import { useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../lib/useReducedMotion';

type Props = { value: string; numeric: number | null; className?: string };

/** Counts 0 → numeric over 900ms once in view; renders `value` verbatim when numeric is null. */
export function CountUp({ value, numeric, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const [shown, setShown] = useState<string>(numeric === null || reduced ? value : '0');

  useEffect(() => {
    if (numeric === null || reduced || !inView) return;
    const start = performance.now();
    const dur = 900;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(String(Math.round(numeric * eased)));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setShown(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, numeric, reduced, value]);

  return (
    <span ref={ref} data-figure className={className}>
      {shown}
    </span>
  );
}
