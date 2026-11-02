import { useEffect, useState } from 'react';
import { cn } from '../lib/cn';

type Props = { className?: string; id?: string; /** Override the viewBox fit (default: anchored bottom, right on phones). */ fit?: string };

/**
 * Flat, layered cross-section of the quarry. Horizontal rock strata, a stepped pit cut into
 * them on the right, and a dark foreground ledge on the left that the hero copy sits on.
 * `data-layer` 0..5 (sky, far wall, strata, machines, dust, ledge) so GSAP can move them
 * independently. Pure SVG, no raster, no filters.
 */
export function PitPoster({ className, id, fit }: Props) {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const on = () => setNarrow(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  return (
    <svg
      id={id}
      data-poster
      viewBox="0 0 1440 900"
      preserveAspectRatio={fit ?? (narrow ? 'xMaxYMax slice' : 'xMidYMax slice')}
      aria-hidden="true"
      focusable="false"
      className={cn('block h-full w-full', className)}
    >
      {/* 0 · sky + sun */}
      <g data-layer="0" style={{ willChange: 'transform' }}>
        <rect x="-200" y="-700" width="1840" height="1800" fill="var(--sky)" />
        <circle data-sun cx="1120" cy="180" r="112" fill="var(--sand)" />
      </g>

      {/* 1 · far wall of the quarry */}
      <g data-layer="1" style={{ willChange: 'transform' }}>
        <polygon
          fill="var(--slate)"
          points="-200,540 0,528 140,506 300,522 460,494 620,520 780,502 940,528 1100,508 1260,532 1420,512 1640,536 1640,1100 -200,1100"
        />
      </g>

      {/* 2 · strata, cut by the stepped pit (right side) */}
      <g data-layer="2" style={{ willChange: 'transform' }}>
        <polygon fill="var(--sand)" points="-200,660 780,660 840,730 -200,730" />
        <polygon fill="var(--sand-deep)" points="-200,730 1000,730 1060,800 -200,800" />
        <polygon fill="var(--stone)" points="-200,800 1200,800 1250,860 -200,860" />
        <rect x="-200" y="860" width="1840" height="300" fill="var(--ink)" />
        {/* bench edge highlights */}
        <g stroke="var(--bg)" strokeOpacity=".45" strokeWidth="3">
          <line x1="686" y1="660" x2="780" y2="660" />
          <line x1="840" y1="730" x2="1000" y2="730" />
          <line x1="1060" y1="800" x2="1200" y2="800" />
        </g>
      </g>

      {/* 3 · machines and stockpiles on the benches */}
      <g data-layer="3" style={{ willChange: 'transform' }}>
        {/* stockpiles, bench 2 */}
        <g fill="var(--stone)">
          <polygon points="856,730 916,672 976,730" />
          <polygon points="948,730 1000,690 1052,730" opacity=".85" />
        </g>
        {/* haul truck, bench 3 */}
        <g data-truck>
          <polygon points="1072,786 1166,786 1156,760 1084,760" fill="var(--rust)" />
          <rect x="1070" y="784" width="100" height="14" fill="var(--sky-deep)" />
          <rect x="1170" y="772" width="30" height="26" fill="var(--sky-deep)" />
          <circle cx="1092" cy="800" r="9" fill="var(--ink)" />
          <circle cx="1146" cy="800" r="9" fill="var(--ink)" />
          <circle cx="1190" cy="800" r="8" fill="var(--ink)" />
        </g>
        {/* excavator, pit floor */}
        <g data-excavator>
          <rect x="1262" y="846" width="92" height="12" fill="var(--sky-deep)" />
          <rect x="1272" y="820" width="70" height="28" fill="var(--rust)" />
          <rect x="1282" y="798" width="34" height="24" fill="var(--rust)" />
          <g data-boom style={{ transformOrigin: '1316px 814px', transformBox: 'view-box' }}>
            <polygon points="1312,808 1402,756 1410,768 1322,822" fill="var(--rust)" />
            <polygon points="1402,756 1470,806 1462,816 1396,768" fill="var(--rust)" />
            <polygon points="1470,806 1494,846 1456,846 1450,816" fill="var(--rust-deep)" />
          </g>
        </g>
        {/* survey depth line */}
        <line x1="1404" y1="560" x2="1404" y2="856" stroke="var(--sand)" strokeWidth="2" strokeDasharray="5 9" opacity=".5" />
      </g>

      {/* 4 · dust puffs */}
      <g data-layer="4" style={{ willChange: 'transform' }} fill="var(--sand)" opacity=".28">
        <circle cx="1404" cy="790" r="22" />
        <circle cx="1434" cy="774" r="14" />
        <circle cx="1180" cy="748" r="12" />
      </g>

      {/* 5 · foreground ledge (dark) with the crusher plant on the rim */}
      <g data-layer="5" style={{ willChange: 'transform' }} fill="var(--sky-deep)">
        <polygon points="-200,600 640,600 686,660 686,1100 -200,1100" />
        {/* crusher plant */}
        <rect x="560" y="478" width="46" height="122" />
        <rect x="606" y="516" width="40" height="84" />
        <polygon points="640,524 790,610 786,624 636,540" />
        <rect x="538" y="540" width="22" height="60" />
        <rect x="574" y="450" width="8" height="28" />
      </g>
    </svg>
  );
}
