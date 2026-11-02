// Dev helper: section screenshots of the preview build for visual review.
// Usage: node scripts/shots.mjs [baseUrl]  → /tmp/s-*.png and /tmp/m-*.png
import { chromium } from 'playwright';

const base = process.argv[2] || 'http://localhost:4173/';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(base);
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(2000);
await p.screenshot({ path: '/tmp/s-hero.png' });
await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
const sections = [
  ['section[aria-label="Számokban"]', 'stats'],
  ['#termekek', 'products'],
  ['#folyamat', 'process'],
  ['#szolgaltatasok', 'services'],
  ['#rolunk', 'about'],
  ['section[aria-label="Ajánlatkérés felhívás"]', 'cta'],
  ['#kapcsolat', 'contact'],
];
for (const [sel, name] of sections) {
  await p.evaluate((s) => document.querySelector(s)?.scrollIntoView(), sel);
  await p.waitForTimeout(1400);
  await p.screenshot({ path: `/tmp/s-${name}.png` });
}
await p.evaluate(() => scrollTo(0, document.body.scrollHeight));
await p.waitForTimeout(900);
await p.screenshot({ path: '/tmp/s-footer.png' });

const m = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await m.goto(base);
await m.waitForTimeout(2000);
await m.screenshot({ path: '/tmp/m-hero.png' });
await m.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
for (const [sel, name] of [['#termekek', 'products'], ['#folyamat', 'process'], ['#szolgaltatasok', 'services']]) {
  await m.evaluate((s) => document.querySelector(s)?.scrollIntoView(), sel);
  await m.waitForTimeout(1200);
  await m.screenshot({ path: `/tmp/m-${name}.png` });
}
await b.close();
