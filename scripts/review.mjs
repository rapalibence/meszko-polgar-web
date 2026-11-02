// Full-page review captures: 1440 / 768 / 390, menu overlay, form error state, 404.
import { chromium } from 'playwright';
const base = process.argv[2] || 'http://localhost:4173/';
const b = await chromium.launch();
for (const [w, h, tag] of [[1440, 900, 'd'], [768, 1024, 't'], [390, 844, 'm']]) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: tag === 'm' ? 2 : 1 });
  await p.goto(base); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(1500);
  await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  // trigger all reveals by scrolling through
  const H = await p.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < H; y += h * 0.8) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(120); }
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(600);
  await p.screenshot({ path: `/tmp/r-${tag}-full.png`, fullPage: true });
  if (tag !== 'm') {
    await p.getByRole('button', { name: 'Menü' }).click(); await p.waitForTimeout(400);
    await p.screenshot({ path: `/tmp/r-${tag}-menu.png` });
    await p.keyboard.press('Escape');
  }
  await p.locator('#kapcsolat').scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
  await p.getByRole('button', { name: 'Ajánlatkérés' }).click(); await p.waitForTimeout(400);
  await p.locator('#kapcsolat form').screenshot({ path: `/tmp/r-${tag}-form-error.png` });
  await p.close();
}
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(base + 'nincs'); await p.waitForTimeout(500); await p.screenshot({ path: '/tmp/r-404.png' });
await b.close();
