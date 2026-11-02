# v5 „Hibrid” — design spec

Reference blend: **Bumi** (Vektora, Dribbble 27479945) gives the web structure and tempo;
**Mining Pitch Deck** (Halo Lab, Dribbble 25543518) gives the character: heavy condensed
uppercase headlines, specimen-style stone photos, topographic line texture, earth palette.

## Goals
- Photo-led, editorial, calm. Premium industrial, not playful.
- Every animation is transform/opacity only (GSAP + ScrollTrigger). No canvas, WebGL, frames.
- Mobile first-class: nothing heavier than one image per viewport; LCP = hero photo.

## Palette
- `--bg` #F4F1EA (warm off-white), `--bg-raised` #FBF9F4
- `--panel` #DCD4C0 (beige panel), `--panel-deep` #C9BFA6
- `--khaki` #6B6A4F, `--olive` #2A2A1E (dark band), `--ink` #0E0D09
- `--stone` #6E685F (text secondary), `--hairline` rgba(14,13,9,.14)
- Accent `--accent` #D9521A rust (CTA, one accent per screen), `--accent-deep` #A83E12
- Dark surfaces use `--dark-ink` #F4F1EA text

## Type
Barlow Condensed 700 uppercase for h1/h2 (tight leading .9, tracking -0.01em);
Barlow 400/500 body; JetBrains Mono 12px tracking .18em uppercase for eyebrows, labels, figures.

## Photos
`public/photo/*.webp` (+`-sm`), Unsplash placeholders; CREDITS.json lists pages. Footer: „Fotók: Unsplash (ideiglenes)”.

## Sections (in order)
1. **Nav**: transparent over hero (light text), off-white with hairline after. Brand left, 4 links, CTA „Ajánlatkérés →”.
2. **Hero**: full-bleed `hero-quarry` photo, bottom-to-top dark gradient (olive 85%→0). Copy bottom-left: eyebrow, h1 (3 clipped lines), lead, two CTAs. Bottom-right survey readout (existing). Photo: slow scale 1.0→1.08 scrubbed by scroll; copy fades/rises out. Intro: lines rise, copy rises (no opacity on LCP text).
3. **Stats list** (Bumi): label left, figure right, dashed hairline rows, counters animate once.
4. **Fractions** (Halo specimen): beige `panel` field. Each fraction a specimen: photo clipped by an irregular SVG blob mask (looks cut out) on the panel, mono size label „0/4 mm”, name, use line. Layout: 2 large + 3 small + 1 wide; reveal stagger. Hover (pointer:fine): photo scale 1.03.
5. **Process** (dark olive band): left column h2 + 5 steps with dashed dividers; steps are not pinned. Right column sticky (CSS sticky) topographic SVG: 7 contour paths draw in (stroke-dashoffset scrub) and a depth tick moves to the active step as it crosses mid-viewport. Active step: full dark-ink text, others 55%.
6. **Services** (Bumi tiles): 3 rows, photo (`truck-road`, `loading`, `boulders`) left 5/12, text right; dashed dividers.
7. **About**: h2 + body + proof checklist; right: `hero-quarry` cropped portrait with contour overlay; company figures already in stats.
8. **CTA band** (Bumi „Ready to optimize”): photo `truck-road` full-bleed, off-white card overlapping with h3 + CTA.
9. **Contact**: existing QuoteForm, unchanged logic; styled to palette.
10. **Footer** `--ink`.

## Motion rules
- Reveal: y 24→0, opacity 0→1, .7s power3.out, stagger .06, once (existing `useReveal`).
- Hero photo scale: `scale` 1→1.08 over the hero scroll, scrub .6, `will-change: transform`.
- Contours: `stroke-dasharray` = path length, `stroke-dashoffset` scrubbed over the process section.
- Counters: existing `useCountUp`.
- Reduced motion: no animation, everything final.
- Nothing animates `height`, `top`, filters, or box-shadow.

## Remove
PitPoster, Descent (pinned), Marquee if still present, slanted edges, sky tokens.

## Tests
Unit: tokens (`--bg: #F4F1EA`, `--olive`), bundle (no three/framer), content.
E2E: shell (h1 text, CTA count), hero (photo scale grows on scroll; reduced motion static),
process (contour dashoffset decreases; active step changes across 5 scroll samples at
1440×900, 390×844, 844×390), sections (services bg olive, fractions panel bg), a11y (contrast
via Lighthouse ≥ 100, focus ring), products (6 specimens, labels).

## Performance budget
Lighthouse mobile perf ≥ 90, a11y 100. Hero photo ≤ 220 kB (lg) / ≤ 80 kB (sm), `fetchpriority="high"`.
