import { useEffect, useRef } from 'react';
import { useScrollStore } from '../lib/scrollStore';
import { useReducedMotion } from '../lib/useReducedMotion';

export const FRAME_COUNT = 72;
/** Frames used by the hero intro (0..INTRO_END) and by the descent (INTRO_END..LAST). */
const INTRO_END = 10;
const LAST = 64;
const INTRO_MS = 1800;

const src = (i: number, size: 'lg' | 'sm') => `/frames/${size}/f-${String(i).padStart(3, '0')}.webp`;

/**
 * Pre-rendered quarry camera path, scrubbed by scroll. One fixed canvas behind hero + descent.
 * Frames are decoded once; the draw loop only repaints when the (smoothed) frame index changes.
 */
export function FrameScrubber() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const visible = useScrollStore((s) => s.heroVisible || s.descentVisible);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const size: 'lg' | 'sm' = window.innerWidth >= 900 ? 'lg' : 'sm';
    const frames: (HTMLImageElement | null)[] = Array(FRAME_COUNT).fill(null);
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let current = -1;
    let target = 0;
    let shown = 0;
    let raf = 0;
    let dead = false;
    const start = performance.now();

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      current = -1;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = (i: number) => {
      const img = frames[i] ?? frames.slice(0, i).reverse().find(Boolean) ?? frames.find(Boolean);
      if (!img) return;
      const cw = canvas.width, ch = canvas.height;
      if (ch > cw) {
        // Portrait: keep the whole pit in the upper half; the frame's own background matches --bg.
        ctx.fillStyle = '#F2EFE9';
        ctx.fillRect(0, 0, cw, ch);
        const s = (cw / img.naturalWidth) * 1.45;
        const w = img.naturalWidth * s, h = img.naturalHeight * s;
        const top = 56 * dpr;
        ctx.drawImage(img, (cw - w) / 2, top, w, h);
        // Feather the image's bottom edge into the page background.
        const g = ctx.createLinearGradient(0, top + h * 0.62, 0, top + h);
        g.addColorStop(0, 'rgba(242,239,233,0)');
        g.addColorStop(1, 'rgba(242,239,233,1)');
        ctx.fillStyle = g;
        ctx.fillRect(0, top + h * 0.62, cw, h * 0.38 + 2);
      } else {
        const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
        const w = img.naturalWidth * s, h = img.naturalHeight * s;
        ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
      }
      current = i;
    };

    const load = (i: number) =>
      new Promise<void>((res) => {
        if (frames[i]) return res();
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => { frames[i] = img; res(); };
        img.onerror = () => res();
        img.src = src(i, size);
      });

    // Priority: first frame, then intro frames, then every 4th, then the rest.
    (async () => {
      await load(0);
      if (!dead) draw(0);
      for (let i = 1; i <= INTRO_END; i++) await load(i);
      for (let i = INTRO_END; i < FRAME_COUNT; i += 4) await load(i);
      for (let i = 0; i < FRAME_COUNT; i++) await load(i);
    })();

    const tick = (now: number) => {
      if (dead) return;
      const { descent, descentVisible } = useScrollStore.getState();
      let introT = Math.min(1, (now - start) / INTRO_MS);
      introT = 1 - Math.pow(1 - introT, 3);
      if (reduced) introT = 1;
      target = descentVisible || descent > 0
        ? INTRO_END + descent * (LAST - INTRO_END)
        : introT * INTRO_END;
      // Heavy smoothing for weight; snap when close.
      shown += (target - shown) * (reduced ? 1 : 0.14);
      if (Math.abs(target - shown) < 0.05) shown = target;
      const i = Math.round(shown);
      if (i !== current) draw(i);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [reduced]);

  return (
    <div
      aria-hidden="true"
      data-frames
      className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-[500ms]"
      style={{ opacity: visible ? 1 : 0, transitionTimingFunction: 'var(--ease)' }}
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
