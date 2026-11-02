# Mészkő Polgár Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a dark, single-page Hungarian B2B site for Mészkő Polgár Kft. with a procedural 3D terraced-pit centrepiece that the user descends through on scroll, deployed to Vercel.

**Architecture:** Vite + React SPA. DOM sections are ordinary React components reading copy from `src/content/*`. One fixed, full-screen React Three Fiber canvas sits behind the DOM; pure TypeScript modules (`terrain.ts`, `contours.ts`) build the pit geometry deterministically and are unit-tested; a Zustand store carries scroll progress from a GSAP-pinned section into the 3D camera rig. A Vercel serverless function receives the quote form.

**Tech Stack:** Vite 5, React 18, TypeScript (strict), Tailwind 3.4, shadcn/ui, framer-motion, gsap, three, @react-three/fiber, @react-three/drei, zustand, zod, react-hook-form, @phosphor-icons/react, @fontsource (barlow, barlow-condensed, jetbrains-mono), simplex-noise, Vitest, Playwright, ESLint, Prettier.

**Spec:** `docs/superpowers/specs/2026-11-02-meszko-polgar-website-design.md`

## Global Constraints

- All visible copy in Hungarian with correct accents; strings live in `src/content/*.ts`, never inline in components.
- Zero `—` (U+2014) or `–` (U+2013) in any visible string.
- Exactly one uppercase eyebrow on the page (hero). Every CTA label is exactly `Ajánlatkérés`.
- Colors, spacing, radii, easing and durations only from the token set in spec §3, exposed as CSS variables in `src/index.css` and mapped into Tailwind; no raw hex in components.
- Dark theme only; no section uses a light background.
- Only `transform`, `opacity`, `clip-path` are animated. No `window.addEventListener("scroll")`; GSAP ScrollTrigger only in `DescentSection`.
- Fonts self-hosted via @fontsource. Numbers rendered in JetBrains Mono.
- Icons only from `@phosphor-icons/react`, weight `regular`.
- `prefers-reduced-motion: reduce` → nothing moves, everything visible.
- Lighthouse desktop: performance ≥ 85, accessibility ≥ 95, SEO ≥ 95.

## Review Focus

1. **No WebGL (old corporate laptop, locked-down browser):** page must render the static `pit-fallback.png` in the hero and the descent must still show the five step cards. Test added in Task 12 (Playwright with `--disable-gpu --disable-webgl`).
2. **Very tall or very short viewport during the pinned descent (iPad portrait, 4K):** step cards must never overlap the nav or exceed viewport height. Test added in Task 10 (Playwright at 768×1024 and 2560×1440).
3. **Form submitted with Hungarian characters and a 10-digit domestic phone (`06 30 123 4567`):** must validate and reach `/api/quote` without mangling UTF-8. Test added in Task 11.
4. **Keyboard-only user:** Tab order hero CTA → nav → form; focus ring visible on dark background (accent, 2px). Test added in Task 12.
5. **Reduced motion on iOS:** marquee stopped, descent cards visible without scrolling the pin, pit static. Test added in Task 12 (Playwright `reducedMotion: "reduce"`).

---

### Task 1: Project scaffold, tokens, fonts, lint, test runners

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `.eslintrc.cjs`, `.prettierrc`, `vitest.config.ts`, `playwright.config.ts`, `.gitignore`
- Test: `tests/unit/tokens.test.ts`

**Interfaces:**
- Produces: CSS variables named exactly as spec §3 (`--bg`, `--bg-raised`, `--ink`, `--stone`, `--stone-deep`, `--hairline`, `--accent`, `--accent-hover`, `--accent-deep`, `--ease`, `--ease-move`, `--dur-ui`, `--dur-reveal`); Tailwind colors `bg`, `bg-raised`, `ink`, `stone`, `stone-deep`, `accent`, `accent-hover`, `accent-deep`, `hairline`; font families `display`, `body`, `mono`; npm scripts `dev`, `build`, `test`, `test:e2e`, `lint`.

- [ ] **Step 1: Scaffold** — `npm create vite@latest . -- --template react-ts`, then install: `tailwindcss@3 postcss autoprefixer framer-motion gsap three @react-three/fiber @react-three/drei zustand zod react-hook-form @hookform/resolvers @phosphor-icons/react @fontsource/barlow @fontsource/barlow-condensed @fontsource/jetbrains-mono simplex-noise clsx tailwind-merge` and dev deps `vitest @testing-library/react jsdom @playwright/test eslint prettier eslint-plugin-react-hooks @types/three`. Note: Playwright browsers are preinstalled in this environment; do not run `playwright install`.
- [ ] **Step 2: Write failing test** `tests/unit/tokens.test.ts`: reads `src/index.css` as text, asserts it contains `--accent: #E4561B`, `--bg: #141311`, `--ease: cubic-bezier(.23,1,.32,1)`, and does not contain `#FFFFFF` or `#000000`.
- [ ] **Step 3: Run** `npx vitest run tests/unit/tokens.test.ts` → FAIL (file missing).
- [ ] **Step 4: Implement** `src/index.css` with `@import` of the three fontsource families (weights 400/500 Barlow, 600/700 Barlow Condensed, 400 JetBrains Mono), `:root` tokens verbatim from spec §3, base styles (`body` bg/ink/body font, `h1-h3` display uppercase leading .92), `.grain` fixed overlay (5% opacity SVG noise, `pointer-events:none`, z-50), global reduced-motion block (`*{transition-duration:1ms!important;animation-duration:1ms!important}`), and `@media (hover:hover) and (pointer:fine)` wrapper convention documented in a comment. `tailwind.config.ts` maps colors to `var(--…)`, fonts to the three families, spacing stays Tailwind default (multiples of 4 cover the 8-pt scale), `borderRadius` set to `{none:'0', tag:'2px'}` only.
- [ ] **Step 5: Run** test → PASS. Run `npm run build` → succeeds.
- [ ] **Step 6: Commit** `chore: scaffold vite react ts tailwind with design tokens`.

### Task 2: Content modules

**Files:**
- Create: `src/content/site.ts`, `src/content/products.ts`, `src/content/process.ts`, `src/content/services.ts`
- Test: `tests/unit/content.test.ts`

**Interfaces:**
- Produces:
  - `site: { brand: 'MÉSZKŐ POLGÁR'; brandSuffix: 'Kft.'; nav: {label:string; href:string}[]; cta: 'Ajánlatkérés'; hero: {eyebrow; h1; sub; secondary:'Termékek'}; marquee: string[]; figures: {value:string; label:string; numeric:number|null}[]; about: {h2; body; facts:string[]}; contact: {h2; sub; rows:{icon:'MapPin'|'Phone'|'Envelope'|'Clock'; label; value}[]; mapCenter:[number,number]}; footer: {legal:string; links:{label;href}[]; copyright:string} }`
  - `products: { slug:string; name:string; range:string; use:string; photoSeed:string; span:'lg'|'md'|'sm' }[]` (6 items, exactly one `lg`)
  - `processSteps: { slug:string; title:string; body:string; photoSeed:string; depthM:number }[]` (5 items, `depthM` = 0, 12, 24, 36, 48)
  - `services: { featured:{icon:'FileCheck'; title; body; photoSeed}; rows:{icon:'Truck'|'Scales'; title; body}[] }`
- All copy verbatim from spec §4 (and v4 prompt text for bodies).

- [ ] **Step 1: Write failing test** `content.test.ts`: imports all four modules, flattens every string value recursively, asserts no string contains `—` or `–`; asserts `products.length === 6` and exactly one `span === 'lg'`; asserts `processSteps.map(s=>s.depthM)` equals `[0,12,24,36,48]`; asserts every CTA-like field (`site.cta`) equals `'Ajánlatkérés'`; asserts `site.hero.sub.split(' ').length <= 20`.
- [ ] **Step 2: Run** → FAIL (modules missing).
- [ ] **Step 3: Implement** the four modules with the copy from spec §4.
- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** `feat(content): hungarian copy modules`.

### Task 3: Terrain geometry (pure)

**Files:**
- Create: `src/three/terrain.ts`
- Test: `tests/unit/terrain.test.ts`

**Interfaces:**
- Produces: `buildPit(opts: PitOptions): PitData` where `PitOptions = { tiers:number; radius:number; depth:number; segments:number; seed:number }` and `PitData = { positions: Float32Array; normals: Float32Array; heightAt(x:number,z:number):number; tierHeight(i:number):number }`. Geometry is non-indexed triangles (flat shading), a square grid of `segments × segments` quads spanning `[-radius*1.4, radius*1.4]`. Height function: distance from centre `d`; `tier = floor(clamp((radius - d)/radius, 0, 1) * tiers)`; height = `-depth * tier/tiers` plus simplex noise(seed) jitter of ±3% depth on the bench floors and a 6%-of-radius wide 60°-ish slope between tiers (linear ramp) so benches read as terraces with faces. Outside the rim, height 0 with gentle ±1% noise.

- [ ] **Step 1: Write failing test**: `buildPit({tiers:7,radius:10,depth:48,segments:64,seed:7})` → `positions.length === 64*64*2*3*3`; min y within `[-48*1.05, -48*0.9]`; max y ≤ `0.5`; two calls with same seed give identical `positions`; `tierHeight(0) === 0`, `tierHeight(7) === -48`; `heightAt(0,0) < heightAt(9,0) < heightAt(14,0)`.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** in `terrain.ts` using `simplex-noise` `createNoise2D(seededRandom)` with a tiny LCG for the seed; compute per-vertex heights, emit two triangles per quad, compute flat normals per triangle.
- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** `feat(three): deterministic terraced pit geometry`.

### Task 4: Contour lines (pure)

**Files:**
- Create: `src/three/contours.ts`
- Test: `tests/unit/contours.test.ts`

**Interfaces:**
- Consumes: `PitData.heightAt`, `PitOptions`.
- Produces: `buildContours(pit: PitData, opts: PitOptions, interval: number): ContourData` where `ContourData = { positions: Float32Array; levels: Float32Array }`; `positions` is line-segment pairs (x,y,z per point) from marching squares on a `segments×segments` sample grid at every height level `-interval*k` for k ≥ 0 down to `-depth`; `levels` holds the level height per vertex (same length/3) so the shader can highlight a band; y of each point is the level height + 0.05 offset.

- [ ] **Step 1: Write failing test**: with the Task 3 pit and `interval=2`, `positions.length > 0`, `positions.length % 6 === 0`, `levels.length === positions.length/3`, every `levels[i]` is a multiple of 2 within `[-48, 0]`, every point's `|y - level - 0.05| < 1e-6`.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** marching squares (16-case table, linear interpolation along edges) over the sampled heights.
- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** `feat(three): contour line extraction`.

### Task 5: Scroll store and motion utilities

**Files:**
- Create: `src/lib/scrollStore.ts`, `src/lib/motion.ts`, `src/lib/useReducedMotion.ts`
- Test: `tests/unit/scrollStore.test.ts`

**Interfaces:**
- Produces: Zustand store `useScrollStore` with `{ descent: number /*0..1*/; heroVisible: boolean; descentVisible: boolean; set(partial) }`; `motion.ts` exports `EASE = [0.23,1,0.32,1] as const`, `EASE_MOVE = [0.77,0,0.175,1] as const`, `reveal = { initial:{opacity:0,y:16}, whileInView:{opacity:1,y:0}, viewport:{once:true,amount:0.15}, transition:{duration:0.6, ease:EASE} }`, `stagger(i:number) => ({ ...reveal, transition:{...reveal.transition, delay: Math.min(i,5)*0.06} })`; `useReducedMotion(): boolean` (matchMedia, SSR-safe).

- [ ] **Step 1: Write failing test**: store default `descent === 0`; `set({descent:0.5})` reads back 0.5; `stagger(9).transition.delay === 0.3`; `stagger(2).transition.delay` ≈ 0.12.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement**.
- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** `feat: scroll store and motion presets`.

### Task 6: PitScene (R3F canvas, materials, camera rig, dust, fallback)

**Files:**
- Create: `src/three/PitScene.tsx`, `src/three/ContourMaterial.ts`, `src/three/CameraRig.tsx`, `src/three/Dust.tsx`, `src/three/webgl.ts`, `public/pit-fallback.png` (generated in Step 6)
- Test: `tests/unit/webgl.test.ts`; visual check via screenshot

**Interfaces:**
- Consumes: `buildPit`, `buildContours`, `useScrollStore`, `useReducedMotion`.
- Produces: `<PitScene />` — a `position:fixed; inset:0; z-index:0; pointer-events:none` wrapper containing the R3F `<Canvas>`; opacity bound to `heroVisible || descentVisible` (CSS transition 400ms). `hasWebGL(): boolean` in `webgl.ts`. Camera path constant `CAMERA_PATH: Vector3[]` of 6 points from rim `(14, 9, 16)` down to floor `(2, -40, 4)`; `CameraRig` lerps camera along `CatmullRomCurve3(CAMERA_PATH)` at `t = descent`, looks at `(0, -depth*descent*0.9, 0)`; when `descent === 0` adds idle drift `±0.6` units sinusoidal, period 14s. `ContourMaterial` uniforms: `uActiveMin`, `uActiveMax` (height band), `uSweep` (0..1 sweep position along x for the survey grid), colors from tokens: base `#EDE8DF` alpha .18, active `#E4561B` alpha .9; sweep brightens lines within 1.5 units of the sweep plane to alpha .5. Terrain material: `MeshStandardMaterial` color `#4A463F`, roughness 1, flatShading. Lights: directional `#FFF1E0` 2.0 from `(10,20,8)`, ambient 0.3, rim point light `#E4561B` 0.8 at `(-12, -10, -8)`. `Dust`: 600 points, size 0.06, bone alpha .35, sinusoidal drift, skipped when `window.innerWidth < 768` or reduced motion. Canvas `dpr=[1,1.5]` (≥768) / `1` (<768), `frameloop` = `'always'` when visible else `'demand'`, `gl={{antialias:true, alpha:true}}`.

- [ ] **Step 1: Write failing test** `webgl.test.ts`: `hasWebGL()` returns `false` in jsdom (no WebGL context) and does not throw.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** `webgl.ts`, `ContourMaterial.ts` (shaderMaterial via drei), `CameraRig.tsx`, `Dust.tsx`, `PitScene.tsx` (geometry via `useMemo(buildPit({tiers:7,radius:10,depth:48,segments:96,seed:7}))`, contours interval 2; active band from `descent` → bench index `round(descent*4)` mapped to `tierHeight` range; sweep driven by clock mod 8s when `descent===0`). When `!hasWebGL()` render `<img src="/pit-fallback.png" alt="">` instead of the canvas.
- [ ] **Step 4: Run** unit test → PASS. Mount `<PitScene/>` temporarily in `App.tsx` with a 100vh spacer; `npm run dev`; Playwright screenshot at 1440×900 → file `tmp/pit.png`; inspect: terraces visible as 7 steps, contour lines readable, orange rim light on the left faces, no z-fighting.
- [ ] **Step 5: Generate fallback**: with the dev server up, Playwright script sets `descent=0`, waits 1s, calls `canvas.toDataURL('image/png')` and writes `public/pit-fallback.png` (1600×1000). Verify file exists and > 50 KB.
- [ ] **Step 6: Commit** `feat(three): pit scene with contours, camera rig, dust, fallback`.

### Task 7: Layout shell — Nav, Hero, Footer, grain, routes

**Files:**
- Create: `src/components/Nav.tsx`, `src/components/Hero.tsx`, `src/components/Footer.tsx`, `src/components/ui/Button.tsx` (shadcn-style, variants `primary|outline`), `src/pages/Legal.tsx`, modify `src/App.tsx`, `src/main.tsx` (react-router-dom, routes `/`, `/adatkezeles`, `/impresszum`)
- Test: `tests/e2e/shell.spec.ts`

**Interfaces:**
- Consumes: `site` content, `useScrollStore.set({heroVisible})`, `PitScene`, `reveal`.
- Produces: `<Nav/>` (sticky 72px, transparent until `scrollY > 40` via IntersectionObserver on a sentinel, then `bg-bg/90` + hairline; active-link accent underline via IntersectionObserver on sections; mobile Sheet built with a simple dialog, 240ms in / 180ms out), `<Hero/>` (grid 12; text col-span-5; right 7 cols left empty for the fixed canvas; sets `heroVisible` via IntersectionObserver), `<Footer/>`, `<Button variant intent>` with `:active scale-[.97]` and `transition-transform duration-[160ms]`.

- [ ] **Step 1: Write failing e2e** `shell.spec.ts`: at 1440×900 `h1` text equals `ZÚZOTTKŐ, EGYENESEN A BÁNYÁBÓL.`; primary hero button bounding box bottom < 900; nav height between 64 and 80; `getByRole('link',{name:'Ajánlatkérés'})` count ≥ 1 and every element matching `[data-cta]` has text `Ajánlatkérés`; at 390×844 nav shows hamburger and hero CTA bottom < 844*1.1; page has exactly one element with `data-eyebrow`.
- [ ] **Step 2: Run** `npx playwright test tests/e2e/shell.spec.ts` → FAIL.
- [ ] **Step 3: Implement** components; add `data-cta` to every CTA, `data-eyebrow` to the hero eyebrow; `index.html` sets `lang="hu"`, title `Mészkő Polgár Kft. | Zúzottkő és kőanyag Székesfehérvárról`, meta description, OG tags, favicon SVG (accent square, `MP` in display font).
- [ ] **Step 4: Run** e2e → PASS. Screenshot 1440 and 390 to `tmp/`, inspect: hero reads, canvas visible behind right column, nothing overlaps.
- [ ] **Step 5: Commit** `feat: nav, hero, footer shell with routes`.

### Task 8: Marquee and Products mosaic

**Files:**
- Create: `src/components/Marquee.tsx`, `src/components/Products.tsx`, `src/components/Photo.tsx`
- Test: `tests/e2e/products.spec.ts`

**Interfaces:**
- Consumes: `site.marquee`, `products`, `stagger`, `useReducedMotion`.
- Produces: `<Marquee/>` (CSS keyframe `translateX(-50%)` on a duplicated track, duration computed as `trackWidth/40` seconds, `animation-play-state: paused` on hover inside the pointer media query, `animation: none` under reduced motion; separators `·` in accent; digits in mono). `<Photo seed w h alt className/>` renders `<img loading="lazy" decoding="async" src="https://picsum.photos/seed/${seed}/${w}/${h}">` with `filter: saturate(.8) contrast(1.08)` and a `clip-path` wipe from `inset(0 0 100% 0)` to `inset(0)` 700ms on in-view (framer `whileInView`), static when reduced motion. `<Products/>`: 12-col mosaic; `lg` tile `col-span-7 row-span-2`, four `md` tiles 3/2/2/3 alternating, one `sm`; tiles are not boxed: photo with name/range/use underneath, hairline only as a top rule; stagger via `stagger(i)`.

- [ ] **Step 1: Write failing e2e**: section `#termekek` exists with 6 `[data-product]` tiles; exactly one tile has `data-span="lg"`; the marquee element contains `Z 0/32`; marquee has `animation-play-state: paused` when hovered at 1440 (use `page.hover`, then `getComputedStyle`); after scrolling `#termekek` into view every tile image has `clip-path` equal to `inset(0px)` within 1.5s.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement**.
- [ ] **Step 4: Run** → PASS; screenshot and inspect mosaic rhythm (no row of equal tiles).
- [ ] **Step 5: Commit** `feat: fractions marquee and products mosaic`.

### Task 9: Services, About (figures, count-up), Contact DOM

**Files:**
- Create: `src/components/Services.tsx`, `src/components/About.tsx`, `src/components/CountUp.tsx`, `src/components/Contact.tsx`, `src/components/QuoteForm.tsx`, `src/lib/quoteSchema.ts`
- Test: `tests/unit/quoteSchema.test.ts`, `tests/e2e/sections.spec.ts`

**Interfaces:**
- Consumes: `services`, `site.figures`, `site.about`, `site.contact`, `products` (for the select).
- Produces: `quoteSchema` (zod): `name` min 2, `company` optional, `phone` matches `/^(\+36|06)[\s-]?\d{1,2}[\s-]?\d{3}[\s-]?\d{3,4}$/`, `email` email, `product` enum of product slugs plus `egyeb`, `quantityT` optional number ≥ 1, `address` optional, `note` optional max 1000, `consent` literal true; error messages: `Kötelező mező`, `Érvénytelen e-mail-cím`, `Érvénytelen telefonszám`, `El kell fogadnia az adatkezelési tájékoztatót`. `QuoteForm` posts JSON to `/api/quote`; states: idle, submitting (`Küldés...`, disabled), success (replaces form with `Köszönjük! Egy munkanapon belül jelentkezünk.`), error (inline `Hiba történt, próbálja újra.`). `CountUp value numeric` animates 0→value over 900ms ease-out once in view; renders the string `value` as-is when `numeric` is null (bracketed placeholders).

- [ ] **Step 1: Write failing unit test** `quoteSchema.test.ts`: valid payload with `name:'Kovács Ákos'`, `phone:'06 30 123 4567'`, `email:'akos@example.hu'`, `product:'zuzottko-0-4'`, `consent:true` passes; `phone:'1234'` fails with `Érvénytelen telefonszám`; missing consent fails with `El kell fogadnia az adatkezelési tájékoztatót`; `email:'x'` fails with `Érvénytelen e-mail-cím`.
- [ ] **Step 2: Run** → FAIL. Implement `quoteSchema.ts`. Run → PASS.
- [ ] **Step 3: Write failing e2e** `sections.spec.ts`: `#szolgaltatasok` contains `Digitális szállítólevél`; `#rolunk` contains `2011` and after scroll into view the first figure text becomes `2011` (not `0`) within 1.5s; `#kapcsolat` form submit with empty fields shows ≥ 3 error texts `Kötelező mező`; filling the valid payload and submitting (route `/api/quote` mocked with `page.route` → 200) shows `Köszönjük! Egy munkanapon belül jelentkezünk.`.
- [ ] **Step 4: Run** → FAIL. Implement components (Services: featured panel photo `aspect-video` with text panel `-mt-8` overlap; two rows with Phosphor `Truck`, `Scales` at 32px accent; About: three figures with mono 88px digits and vertical hairlines, body, 2×2 facts with `Check`, right photo grayscale with three absolutely positioned 1px accent lines at 30/55/80%; Contact: form on `bg-raised` panel, rows with icons, iframe `https://www.google.com/maps?q=47.19,18.46&z=13&output=embed` with `filter: grayscale(1) invert(.9) contrast(1.1)` and a `TODO exact pin` comment).
- [ ] **Step 5: Run** → PASS. Screenshot and inspect.
- [ ] **Step 6: Commit** `feat: services, about with count-up, contact form`.

### Task 10: Descent section (pinned scroll scrub)

**Files:**
- Create: `src/components/Descent.tsx`
- Modify: `src/three/PitScene.tsx` (read `descentVisible`)
- Test: `tests/e2e/descent.spec.ts`

**Interfaces:**
- Consumes: `processSteps`, `useScrollStore.set({descent, descentVisible})`, GSAP ScrollTrigger.
- Produces: `<Descent/>`: outer `section#folyamat` height `500vh`; inner `div` sticky `top-0 h-[100dvh]` holding the H2 `A kőtől a fuvarig` top-left and a step card (left 5 cols, `bg-raised`, mono depth label `-12 m`, title, body) that cross-fades (opacity + 16px rise, 400ms) when the active index changes. ScrollTrigger: `trigger: section`, `start: 'top top'`, `end: 'bottom bottom'`, `scrub: 0.6`, `onUpdate: self => set({descent: self.progress})`; `descentVisible` from `onToggle`. Active index = `Math.min(4, Math.floor(progress*5))`. Reduced motion: no ScrollTrigger; section becomes a plain stack of the five cards, `descent` stays 0. ScrollTrigger is created in `useEffect` and killed on cleanup.

- [ ] **Step 1: Write failing e2e**: at 1440×900, scroll so that `#folyamat` top is at 0, then scroll 4 × (section height/5): the visible card title sequence is `Jövesztés, Törés, Osztályozás, Mérlegelés, Szállítás`; the sticky inner div's bounding box stays within the viewport during the pin; at 768×1024 and 2560×1440 the step card's bottom < viewport height and top > 72; with `reducedMotion:'reduce'` all five titles are visible in the DOM without scrolling the pin.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement**; in `PitScene` bind the active contour band to `descent` as specified in Task 6.
- [ ] **Step 4: Run** → PASS. Record 5 screenshots along the pin and inspect: camera visibly descends, active bench orange, cards legible over the scene (card has `bg-raised` so no contrast issue).
- [ ] **Step 5: Commit** `feat: pinned descent through the pit`.

### Task 11: Serverless quote endpoint

**Files:**
- Create: `api/quote.ts`, `vercel.json`
- Test: `tests/unit/quoteHandler.test.ts`

**Interfaces:**
- Consumes: `quoteSchema`.
- Produces: `export default async function handler(req, res)` (Vercel Node runtime): rejects non-POST with 405; parses JSON, validates with `quoteSchema`; 400 with `{errors}` on failure; on success logs `[quote]` + JSON with UTF-8 intact and returns 200 `{ok:true}`; `// TODO: send via Resend` comment with the env var name `RESEND_API_KEY`. `vercel.json` sets SPA rewrite `{"source":"/(.*)","destination":"/index.html"}` excluding `/api/*`.

- [ ] **Step 1: Write failing unit test**: mock `req/res`; GET → 405; POST invalid → 400 with `errors`; POST with `name:'Kovács Ákos'`, `phone:'06 30 123 4567'` → 200 and the logged string contains `Kovács Ákos` unchanged.
- [ ] **Step 2: Run** → FAIL. Implement. Run → PASS.
- [ ] **Step 3: Commit** `feat(api): quote endpoint`.

### Task 12: Accessibility, reduced motion, no-WebGL, SEO, Lighthouse

**Files:**
- Create: `tests/e2e/a11y.spec.ts`, `tests/e2e/fallbacks.spec.ts`, `public/og.png`
- Modify: components as needed

- [ ] **Step 1: Write failing e2e** `a11y.spec.ts`: Tab from page load reaches the hero `Ajánlatkérés` link within 6 presses; the focused element has an outline color equal to `rgb(228, 86, 27)`; every `img` has an `alt` attribute; exactly one `h1`; headings do not skip levels. `fallbacks.spec.ts`: launch with `args:['--disable-gpu','--disable-webgl']` → `img[src="/pit-fallback.png"]` is visible and `#folyamat` shows five titles; with `reducedMotion:'reduce'` the marquee's computed `animation-name` is `none` and no element has a non-identity `transform` after 1s.
- [ ] **Step 2: Run** → FAIL; fix components (focus-visible ring `outline: 2px solid var(--accent); outline-offset: 2px`, alt texts from content, heading order).
- [ ] **Step 3: Run** → PASS.
- [ ] **Step 4: Generate `public/og.png`** 1200×630 from a hero screenshot; add `og:image` meta.
- [ ] **Step 5: Lighthouse**: `npm run build && npx vite preview` then `npx lighthouse http://localhost:4173 --preset=desktop --output=json --output-path=tmp/lh.json`; assert performance ≥ 85, accessibility ≥ 95, SEO ≥ 95; fix (lazy-load PitScene with `React.lazy`, preload fonts, `fetchpriority` on nothing since hero has no image) until green.
- [ ] **Step 6: Commit** `feat: a11y, fallbacks, seo, lighthouse budget`.

### Task 13: Repo, CI, Vercel deploy

**Files:**
- Create: `.github/workflows/ci.yml`, `README.md`

- [ ] **Step 1:** Create GitHub repo `meszko-polgar-web` in Zsolt's account (via `gh repo create --private --source . --push` after `add_repo`/auth as the environment allows), push `main`.
- [ ] **Step 2:** `ci.yml`: on push/PR → `npm ci`, `npm run lint`, `npm test`, `npm run build`, `npx playwright test` (uses preinstalled browsers; in CI add `npx playwright install --with-deps chromium`).
- [ ] **Step 3:** Vercel: create project from the repo via the Vercel MCP tools (framework Vite, output `dist`), trigger production deploy, record the `*.vercel.app` URL in `README.md`.
- [ ] **Step 4:** Run the full Playwright suite against the deployed URL (`BASE_URL` env) → PASS. Final screenshots 1440/390 saved to `tmp/` and sent to Zsolt.
- [ ] **Step 5:** Commit `chore: ci and deploy notes`; push.
