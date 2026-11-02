import { chromium } from 'playwright';
const url = process.argv[2] || 'http://localhost:4173/';
const vps = [[1280,720],[1366,768],[1440,900],[1920,1080]];
const b = await chromium.launch();
for (const [w,h] of vps) {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.waitForTimeout(600);
  await p.screenshot({ path: `/tmp/hero-${w}.png`, clip: { x: 0, y: 0, width: w, height: h } });
  await p.close();
}
await b.close();
