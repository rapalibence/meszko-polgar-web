# v6 „Poszter” — design spec

Reference: **G MINING corporate redesign** (Ivan Medvedev / UPROCK, Behance 202653295) layered on the
v5 hybrid (Bumi structure, Halo specimens). Design read: industrial B2B landing for construction
buyers, poster-typographic language, earth palette. Dials: VARIANCE 7, MOTION 6, DENSITY 4.

## What G MINING contributes
- Palette: cream `#F3E7CC`, chocolate `#4A3730`, olive `#3F5A48`; one highlight colour behind a word.
- Ultra-condensed heavy uppercase display; centered or full-bleed giant word heroes; headline words
  highlighted with a solid colour block (`<mark>`).
- Cut-out machinery on flat colour (no photo background). Duotone (sepia-tinted mono) photography.
- Numbered service list with hover preview image; stat tiles with hairline borders.

## Palette (tokens)
- `--bg` #F3E7CC (cream), `--bg-raised` #F8EFDC, `--panel` #E8DABA
- `--choco` #4A3730 (dark bands, hero), `--choco-deep` #34251F
- `--olive` #3F5A48 (display text on cream, highlight blocks on dark), `--olive-deep` #2E4335
- `--ink` #1E1611, `--stone` #6B5F55 (secondary text on cream), `--hairline` rgba(30,22,17,.16)
- Accent `--accent` #D9521A (CTA, highlight on cream), `--accent-light` #F0742F (on dark)
- `--dark-ink` #F3E7CC. One accent per screen.

## Type
Barlow Condensed 700 uppercase, tracking -0.01em, leading .88. Body Barlow. Mono labels only where
they carry data (sizes, depths). Eyebrows: max 3 on the page (hero none).

## Motion stack
- **Lenis** smooth scroll (desktop pointer:fine only, `lerp .1`), synced to GSAP ticker;
  `ScrollTrigger.update` on lenis scroll; `anchors: true`; disabled under reduced motion.
- **GSAP + SplitText** (free in 3.13+): hero word chars rise with mask; section h2 words rise on view.
- **React Bits** (MIT + Commons Clause, vendored in `src/vendor/react-bits/`): `Magnet` on the primary
  CTA and nav CTA (desktop), `SplitText` wrapper. Credited in README.
- Parallax: truck cut-out `y -80` scrub; hero word `y -40`; duotone photos `scale 1→1.06`.
- Everything transform / opacity / stroke-dashoffset. No canvas, no filters animated.

## Sections
1. Nav: transparent on hero (cream text), cream after.
2. **Hero** (chocolate, full-bleed): giant single word `ZÚZOTTKŐ` across the full width (fluid
   `clamp`, one line at every width), letters cream. Over the word's lower half, right-anchored, the
   truck cut-out (duotone-tinted). Below the word: left `MÉSZKŐ POLGÁR KFT.` and right
   `SZÉKESFEHÉRVÁR` in olive-on-cream small caps bars (G MINING corner labels). Bottom row: lead (≤ 20
   words) left, CTA pair right. 4 text elements max.
3. **Stats**: 4 tiles with hairline borders (3 figures + 1 duotone photo tile), 2×2 on mobile.
4. **Fractions** (cream panel): headline with highlighted word `<mark>FRAKCIÓ</mark>`, specimen blobs kept.
5. **Process** (chocolate band): eyebrow allowed; contours olive; steps list; depth rail.
6. **Services** (G MINING numbered list): rows `(01) SZÁLLÍTÁS … ↗`, hairline between, hover shows a
   duotone preview thumbnail that follows the cursor (desktop), inline thumbnail on mobile.
7. **About**: duotone photo + copy, highlighted word in h2.
8. **CTA band**: chocolate, centered headline `KELL KŐ A <mark>JÖVŐ HÉTRE</mark>?`, CTA.
9. Contact (cream), Footer (ink).

## Photos
Same Unsplash set; duotone via CSS (`grayscale(1) sepia(.4) contrast(1.05)` + chocolate multiply
overlay at 35%). Cut-outs: `public/photo/truck-cut.webp` (rembg). Placeholders until the client's.

## 3D
Not in this release. A real-time model would reintroduce the stutter risk on phones. If the client
can provide a photogrammetry scan (GLB, ≤ 2 MB Draco, ≤ 60k tris) of a boulder or a loaded truck,
it goes desktop-only in the hero behind the word, with the cut-out as the mobile fallback.

## Tests
Unit: tokens (`--choco`, `--bg: #F3E7CC`), bundle (lenis present, no three), contours.
E2E: hero (word single line at 390/1440/2560; cut-out parallax; intro settles), services (hover
preview appears at desktop; 3 rows), stats (4 tiles), fractions, process, a11y, reduced motion,
Lenis (wheel event moves scroll; anchors work).
