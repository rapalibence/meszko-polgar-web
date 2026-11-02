# Mészkő Polgár Kft. website — design spec

Date: 2026-11-02. Owner: Zsolt (Avenir Solutions). Client: Mészkő Polgár Kft. (Radics Mihály), stone quarry, Székesfehérvár.

## 1. Purpose and success

A single-page Hungarian B2B marketing site replacing meszko.com. Audience: road builders, concrete plants, construction firms, landscapers, municipalities ordering crushed stone by the truckload. Success: a visitor understands what is sold, trusts the operation, and sends an ajánlatkérés. Secondary: the site must look distinctly non-template (dark, cinematic, one memorable 3D idea) so it also serves as an Avenir Solutions showcase.

Constraints: facts and photos are placeholders until the client supplies them (marked `[…]` or `TODO` in code). Hungarian copy with correct accents. No em/en dashes in visible text. Hosted on Vercel from a GitHub repo in Zsolt's account.

## 2. Concept: "Lefelé a bányába"

The 3D centrepiece is the quarry itself: a procedural terraced open pit. The hero shows it from the rim; a pinned scroll section descends through its benches, one bench per process step. The pit is low-poly, flat-shaded warm grey, with contour lines drawn as an emissive overlay (bone hairlines, every 10th line orange). No rocks, no photos behind the 3D.

## 3. Visual system (tokens, the only values allowed)

```
--bg #141311  --bg-raised #1D1B18  --ink #EDE8DF  --stone #A9A295  --stone-deep #5E5A53
--hairline rgba(237,232,223,.12)
--accent #E4561B  --accent-hover #F0672E  --accent-deep #B8420F
spacing 8-pt: 8 16 24 32 48 64 96 128
radius 0 everywhere; 2px for tags
--ease cubic-bezier(.23,1,.32,1)  --ease-move cubic-bezier(.77,0,.175,1)
--dur-ui 160ms  --dur-reveal 600ms
fonts: Barlow Condensed 600/700 (display, uppercase, leading .92), Barlow 400/500 (body 17px/1.55), JetBrains Mono 400 (all numbers)
```
Fixed 5% grain overlay over the page. Dark theme locked; no light sections. One uppercase eyebrow on the page (hero). Every CTA label is `Ajánlatkérés`.

## 4. Page structure

1. **Nav**: sticky 72px, transparent over hero, `--bg`/90% + hairline after 40px scroll. Wordmark `MÉSZKŐ POLGÁR` + `Kft.`; links Termékek, Szolgáltatások, Rólunk, Kapcsolat; CTA. Mobile: Sheet.
2. **Hero**: `min-h-[100dvh]`, text left 5/12, 3D pit right 7/12 bleeding to edge (mobile: text, then canvas 50vh). Eyebrow `KŐBÁNYA · SZÉKESFEHÉRVÁR`; H1 `ZÚZOTTKŐ, EGYENESEN A BÁNYÁBÓL.`; sub `Minőségi kőanyag útépítéshez, betongyártáshoz és tereprendezéshez. Saját rakodás, hitelesített mérlegelés, rövid határidő.`; buttons `Ajánlatkérés`, `Termékek`.
3. **Fractions strip**: the page's one marquee, `0/4 · 4/8 · 8/16 · 16/32 · Z 0/32 · TERMÉSKŐ`, mono digits, accent separators, 40px/s linear, pauses on hover, stops under reduced motion.
4. **Termékek** (`#termekek`): H2 `Frakciók és felhasználás`; intro; uneven mosaic (not uniform cards): six tiles with photos revealed by clip-path wipe, name, grain range (mono), one-line use. Data in `src/content/products.ts`. Closing sentence about kiszerelés.
5. **Lefelé a bányába** (`#folyamat`): pinned section, height 500vh. 3D camera scrubs down a spline, one bench per step. Steps (title, body, bench index): Jövesztés, Törés, Osztályozás, Mérlegelés, Szállítás (copy from v4). Active bench's contours brighten to accent; label card slides in left with mono step counter rendered as the bench depth in metres (e.g. `-12 m`), not "1. lépés". Mobile: same, lower dpr.
6. **Szolgáltatások** (`#szolgaltatasok`): H2 `Nem csak követ adunk. Megoldást.`; featured panel (Digitális szállítólevél, FileCheck) left 7/12 with photo overlapped by text panel; two rows right 5/12 (Szállítás/Truck, Rakodás a telephelyen/Scales). Copy from v4.
7. **Rólunk** (`#rolunk`): count-up figures `2011`, `[200 000]`, `[60]`; H2, body, 2×2 trust facts with Check icons; right: tall grayscale photo with three accent bench hairlines.
8. **Kapcsolat** (`#kapcsolat`): H2 `Ajánlatkérés`; form (Név*, Cég, Telefon*, E-mail*, Termék/frakció select, Mennyiség (tonna), Szállítási cím, Megjegyzés, adatkezelés checkbox*), validation with zod + react-hook-form, success state; submit posts to a Vercel serverless function `/api/quote` that logs for now (TODO: Resend e-mail). Contact rows + grayscale Google Maps iframe (TODO exact pin).
9. **Footer**: wordmark, company data placeholders, links `/adatkezeles`, `/impresszum` (stub pages), copyright.

## 5. 3D architecture

- `src/three/PitScene.tsx`: one R3F `<Canvas>` mounted once, fixed-position, `pointer-events: none`, behind the DOM. Visible in hero and descent; faded out elsewhere via opacity driven by scroll position.
- `src/three/terrain.ts`: pure function `buildPit({tiers:7, radius, depth, segments, seed}) → BufferGeometry` using a stepped radial heightmap with simplex noise jitter; flat shading via non-indexed geometry. Unit-tested (vertex count, depth range, determinism by seed).
- `src/three/contours.ts`: pure function producing `LineSegments` geometry from the terrain at fixed height intervals (marching-squares on the heightmap). Unit-tested (line count > 0, all points on-grid).
- `src/three/ContourMaterial.ts`: shader material; uniform `uActiveBand` (height range) brightens lines to accent, others bone at low alpha.
- `src/three/CameraRig.tsx`: `CatmullRomCurve3` path from rim to floor; `progress` 0..1 from a scroll store; hero idle drift when progress = 0; survey-grid sweep every 8s (shader uniform `uSweep`).
- `src/three/Dust.tsx`: 600-point `Points` with slow sine drift; skipped below 768px and under reduced motion.
- Scroll: GSAP ScrollTrigger pins `#folyamat`, writes `progress` into a Zustand store; R3F reads it in `useFrame`. No scroll listeners elsewhere.
- Performance: `dpr=[1,1.5]` desktop, 1 mobile; `frameloop="demand"` outside hero/descent; geometry built once in a `useMemo`; target 60fps on a mid-range laptop, 30fps mobile.
- Fallbacks: no WebGL → static PNG of the pit (`public/pit-fallback.png`, generated once from the scene); reduced motion → static camera at rim, no sweep, no dust, descent shows step cards without camera movement.

## 6. DOM motion

Framer Motion for reveals (`whileInView`, once, amount .15, children only, 600ms, 16px rise, 60ms stagger, max 6). Buttons `:active scale(.97)` 160ms; hover inside `@media (hover:hover) and (pointer:fine)`; links hover opacity .6. Photo wipes via `clip-path` 700ms. Global reduced-motion block.

## 7. Stack and repo

Vite 5, React 18, TypeScript strict, Tailwind 3.4 with tokens as CSS variables, shadcn/ui (Button, Input, Textarea, Select, Checkbox, Sheet), framer-motion, gsap, three, @react-three/fiber, @react-three/drei, zustand, zod, react-hook-form, @phosphor-icons/react, @fontsource/*. Vitest for unit tests (terrain, contours, content validation, form schema). Playwright for a smoke test (page renders, sections present, no console errors, screenshots at 1440 and 390). ESLint + Prettier.

Repo: `meszko-polgar-web` (GitHub, Zsolt). Deploy: Vercel, framework preset Vite, `api/quote.ts` serverless. SEO: `lang="hu"`, meta title/description, OG image generated from the hero.

## 8. Out of scope (now)

CMS, multi-language, blog, real e-mail delivery (stubbed), analytics, custom domain cut-over (later DNS task), real photography.

## 9. Acceptance

- Lighthouse desktop: performance ≥ 85, accessibility ≥ 95, SEO ≥ 95.
- Screenshots at 1440×900 and 390×844: hero CTA above fold, nav one line, no CTA wraps, every section visible without interaction, no light section.
- Grep of rendered text: zero `—`/`–`; exactly one uppercase eyebrow; every CTA = `Ajánlatkérés`.
- Descent: five distinct camera stops, active bench highlight changes each step, works with keyboard scrolling and on iOS Safari.
- Reduced motion: page fully readable, nothing moves.
- Unit tests and Playwright smoke green in CI.
