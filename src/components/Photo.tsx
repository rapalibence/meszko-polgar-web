import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useReducedMotion } from '../lib/useReducedMotion';
import { cn } from '../lib/cn';

type Props = {
  src: string;
  w: number;
  h: number;
  alt: string;
  className?: string;
  eager?: boolean;
};

/** Photo with wipe reveal. Current sources are procedural placeholders. */
export function Photo({ src, w, h, alt, className, eager }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const reduced = useReducedMotion();
  return (
    <div ref={ref} className={cn('relative', className)}>
      {/* The clipped child is separate from the observed wrapper: Chrome's IntersectionObserver
          treats a fully clipped target as non-intersecting. */}
      <div className={cn('absolute inset-0 overflow-hidden reveal-clip', (inView || reduced) && 'is-in')}>
      <img
        src={src}
        width={w}
        height={h}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className="h-full w-full object-cover [filter:saturate(.8)_contrast(1.08)] transition-transform duration-500 group-hover:[@media(hover:hover)_and_(pointer:fine)]:scale-[1.03]"
        style={{ transitionTimingFunction: 'var(--ease)' }}
      />
      </div>
    </div>
  );
}
