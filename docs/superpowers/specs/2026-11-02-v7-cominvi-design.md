# v7 „Nehézgép” — design spec

References: **Cominvi** (cinematic dark hero, numbered sections, mono micro-labels, fleet accordion,
restrained motion) and **Heidelberg Materials** (white corporate body, overlapping panel, outlined
buttons, photo cards). Fortescue as a tone check. Design read: industrial B2B landing for
construction buyers; minimalist, heavy-machinery calm. Dials: VARIANCE 5, MOTION 4, DENSITY 4.

## Theme
Dark cinematic hero and closing band, light body (warm grey), one accent. One corner radius: 0.
- `--bg` #EFEDE8 (warm grey), `--bg-raised` #FFFFFF, `--ink` #141412, `--stone` #5F5B55,
  `--hairline` rgba(20,20,18,.14), `--dark` #141412, `--dark-raised` #1E1E1B, `--dark-ink` #F2F0EB,
  `--dark-hairline` rgba(242,240,235,.16), `--accent` #E0561C (safety orange), `--accent-deep` #B8420F.
- Type: Barlow only, sentence case. Headlines 600 weight, tracking -0.01em, leading 1.0.
  Mono (JetBrains) for micro-labels and data only. No uppercase display, no condensed, no marks.

## Media
- Hero: looping muted video `public/video/hero-720.{mp4,webm}` (Pexels 8382429, limestone quarry
  aerial, 14 s), poster `hero-poster.webp`. `preload="metadata"`, `playsinline`, `autoplay`, `loop`,
  starts only when in view; reduced motion or `saveData` → poster only. Dark bottom gradient.
- CTA band: `loading-720.mp4` (Pexels 8382433) or still.
- Photos: existing Unsplash set, natural colour (no duotone).

## Sections (numbered 01-06 as Cominvi, mono index next to the title)
0. **Nav**: logo left; right `Ajánlatkérés` (outlined on dark, filled after) + `Menü` button opening a
   full-screen dark overlay: anchors large, contact details, hours. Desktop keeps the 4 links too.
1. **Hero**: video; bottom-left h1 (2 lines, sentence case, ≤ 10 words), mono line
   `Székesfehérvár III. és IV. bányatelek`; bottom-right two link cards (photo + mono label + arrow):
   Termékek, Szolgáltatások. Mobile: cards become a 2-up row under the copy.
2. **01 Rólunk**: large paragraph (the about body) as the headline-sized text, photo right, then a
   single stats strip: 2011 óta · [200 000] t/év · 60 km · 7 terasz · 14 m (hairline-separated).
3. **02 Termékek** (dark, Cominvi fleet accordion): left list of 6 fractions, each row: name,
   mono range, `+`; open row reveals use line + `Ajánlat →`. Right: sticky photo that cross-fades to
   the active row. Mobile: photo inline inside the open row.
4. **03 Folyamat**: five columns (mobile: horizontal scroll-snap), each: mono depth, title, body,
   top hairline that fills in as the column scrolls into view.
5. **04 Szolgáltatások** (Heidelberg cards): featured wide card (photo + title + text + outlined
   button) and two stacked cards. Not three equal cards.
6. **05 Gyakori kérdések**: 5 FAQs, accordion, real quarry questions, answers with [placeholders]
   where the client must confirm.
7. **06 Kapcsolat**: response-time promise line, form (success → `/koszonjuk` page), details,
   map, `Útvonalterv` link to Google Maps directions.
8. **Footer** (dark): columns Felfedezés / Jogi / Kapcsolat; copyright; photo credit.
Plus: sticky mobile CTA bar (after hero), custom 404 page, `/koszonjuk` thank-you page,
LocalBusiness JSON-LD, og image regenerated, robots.txt kept, GA left as a documented env hook.

## Motion (motivated, restrained)
- Hero: copy fades up once; video plays. No parallax.
- Reveal: y 20→0 + opacity, .6 s, once (useReveal).
- Accordion: `grid-template-rows 0fr→1fr` 320 ms; photo cross-fade 400 ms; column hairline
  `scaleX 0→1` on view. Counters count up once.
- Lenis on pointer devices only. No SplitText, no Magnet, no contours, no marks.
- Reduced motion: no animation, poster instead of video.

## Tests
Unit: tokens (`--bg: #EFEDE8`, `--accent: #E0561C`), bundle (no three/framer/react-bits), content.
E2E: shell (h1 2 lines ≤, CTA above fold, nav height), hero (video element present with poster;
reduced motion → no video playing), products accordion (open row shows use; photo switches),
process (5 columns; hairline fills), faq (5 items, toggles), sections (bg colours), contact (form →
thank-you route), a11y, lenis, sticky mobile CTA visible after scrolling past hero at 390.
