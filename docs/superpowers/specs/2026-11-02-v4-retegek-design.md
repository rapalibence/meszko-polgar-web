# v4 „Rétegek” — design spec

## Cél
A meszko-polgar-web látványának és mozgásának újraépítése úgy, hogy minden
animáció GPU-barát legyen (transform/opacity DOM és SVG elemeken, GSAP
ScrollTrigger), ne legyen canvas, WebGL vagy képszekvencia. A hangulat merész,
plakátszerű, flat grafikai világ erős színekkel.

## Nem változik
Tartalom (`src/content/*`), QuoteForm + zod + `/api/quote`, Nav, Footer,
Contact, Services szövegei; vitest + Playwright keretrendszer; Vercel deploy.

## Kikerül
`FrameScrubber`, `public/frames/`, `src/render/`, `render.html`,
`scripts/render-frames.mjs`, `scripts/frames-to-webp.py`, `src/three/`, three.js.

## Paletta (tokens)
- `--bg` #F3EADB (homok, világos), `--bg-raised` #FBF6EC
- `--sand` #E9D8B4, `--sand-deep` #CDB58A
- `--rust` #D9521A (= accent), `--rust-deep` #A83E12
- `--sky` #1F3A5F, `--sky-deep` #14283F
- `--stone` #8C867A, `--ink` #15130F
- Hairline: rgba(21,19,15,.14)

## Hero (`PitPoster`)
Teljes képernyős inline SVG (viewBox 1440×900, `preserveAspectRatio="xMidYMax slice"`),
6 réteg, mindegyik saját `<g data-layer="n">`:
0 ég (sky, nagy nap-korong sand színnel), 1 távoli dombsor (sky-deep),
2 felső terasz (sand), 3 középső terasz (sand-deep), 4 alsó terasz (stone),
5 bányafenék (ink) + kis sziluettek: kotró, depó-háromszögek, teherautó.
A szöveg (eyebrow, h1, lead, proof, CTA) a bal oldalon, az SVG fölött;
mobilon az SVG a felső 55%-ot foglalja, a szöveg alatta.

Intro (betöltéskor, GSAP timeline, 1,3 s): rétegek `y: 120→0`, `opacity 0→1`,
stagger 0.08, ease `power3.out`; h1 sorok `y: '110%'→0` clip-pelt sorokban;
lead/proof/CTA fade+rise. Reduced motion: végállapot azonnal.

Scroll (ScrollTrigger scrub 0.6 a hero szakaszon): parallax, réteg n
`y: -(n+1)*22px`-től `-(n+1)*90px`-ig; a nap `y` lassabban; a szöveg
`opacity 1→0`, `y -40`.

## Folyamat (`Descent`)
Pin-elt szekció (GSAP pin, 420vh). Bal oldalon függőleges narancs vonal
(`<line>` `stroke-dashoffset` 1→0 a szekció scrub-ja szerint) 5 csomóponttal;
a csomópontok sorban „kigyulladnak” (scale .6→1, fill). Jobbra a lépés
kártyája: az aktív lépés `opacity/y`-val vált (GSAP, nem framer). Háttér:
a hero rétegeiből 3 ismétlődő csík (sand/sand-deep/stone) lassan tolódik
felfelé, hogy a „lesüllyedés” érzet megmaradjon. Reduced motion: egymás
alatti lista.

## Termékek
Mozaik marad; kártyák `data-reveal` (lásd Motion). Textúrák: a jelenlegi
világos placeholderek; kártya alsó sávja sand színű, méret-címke mono.

## Rólunk
Számlálók GSAP-pal (`textContent` animáció, snap egész). Jobb oldalon a
kontúrgrafika helyett SVG „rétegkártya”: a 6 réteg kicsiben, vízszintes
hairline-okkal, enter-animációval.

## Szolgáltatások, Kapcsolat, Footer
Színmezők: Szolgáltatások `bg-sky` fehér tipóval; Kapcsolat `bg-bg`;
Footer `bg-ink`. A szekcióhatárokon ferde (`clip-path: polygon`) él, 3vw.

## Motion (globális)
- `src/lib/gsap.ts`: regisztrálja a ScrollTrigger-t, exportál `EASE_OUT`
  (`power3.out`) és `revealBatch(selector)` segédet (`ScrollTrigger.batch`,
  `y: 28→0`, `opacity`, stagger .06, once).
- Minden szekció cím `data-reveal`. Hover csak `@media (hover:hover)`.
- Press: `scale(.97)` 160 ms (meglévő Button).
- `prefers-reduced-motion`: `gsap.globalTimeline.timeScale(100)` helyett
  `gsap.matchMedia()` ág, ami nem animál.
- framer-motion eltávolítása (GSAP váltja ki).

## Teljesítmény
- Csak transform/opacity. `will-change` csak a hero rétegeken.
- Nincs runtime kép a mozgásban. Lighthouse perf cél ≥ 90 mobilon.
- Bundle: gsap (~70 kB gz) + react; three/framer kikerül.

## Tesztek
- Unit: tokens (új színek), bundle (nincs three/framer/frames), contents.
- E2E: shell, products, sections, a11y (focus ring rust), descent
  (pin működik 3 viewporton, lépéscímek váltanak), reduced-motion
  (nem mozog semmi), fallbacks törlése (nincs WebGL-függés).
