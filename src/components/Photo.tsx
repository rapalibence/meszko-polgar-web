import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../lib/useReducedMotion';
import { cn } from '../lib/cn';

type Props = {
  src: string;
  w: number;
  h: number;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** Above-the-fold image: eager + high fetch priority. */
  priority?: boolean;
  /** Responsive sizes hint, e.g. '(min-width: 768px) 50vw, 100vw'. */
  sizes?: string;
  /** Skip the wipe reveal (e.g. when a parent animates). */
  still?: boolean;
};

/** Responsive photo (`-sm` variant for small viewports) with an optional wipe reveal. */
export function Photo({ src, w, h, alt, className, imgClassName, priority, sizes = '(min-width: 768px) 40vw, 100vw', still }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || still) return;
    const io = new IntersectionObserver(([e]) => { if (e?.isIntersecting) { setInView(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, [still]);
  const shown = still || inView || reduced;
  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      <div className={cn('absolute inset-0', !still && 'reveal-photo', shown && 'is-in')}>
        <img
          src={src}
          srcSet={`${src.replace('.webp', '-sm.webp')} ${Math.round(w / 2)}w, ${src} ${w}w`}
          sizes={sizes}
          width={w}
          height={h}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
          decoding="async"
          className={cn('h-full w-full object-cover', imgClassName)}
        />
      </div>
    </div>
  );
}
