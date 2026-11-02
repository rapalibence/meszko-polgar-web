// Renders the quarry camera path to public/frames/*.webp using the /render.html page.
// Usage: node scripts/render-frames.mjs [frames=72] [w=1600] [h=1000]
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const FRAMES = Number(process.argv[2] ?? 72);
const W = Number(process.argv[3] ?? 1600);
const H = Number(process.argv[4] ?? 1000);
const BASE = process.env.RENDER_BASE ?? 'http://localhost:5173';

mkdirSync('tmp/frames-png', { recursive: true });
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: W, height: H } });
for (let i = 0; i < FRAMES; i++) {
  const t = i / (FRAMES - 1);
  await page.goto(`${BASE}/render.html?t=${t}&w=${W}&h=${H}`, { waitUntil: 'load' });
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 120_000 });
  const data = await page.evaluate(() => document.querySelector('canvas').toDataURL('image/png'));
  writeFileSync(`tmp/frames-png/f-${String(i).padStart(3, '0')}.png`, Buffer.from(data.split(',')[1], 'base64'));
  process.stdout.write(`\rframe ${i + 1}/${FRAMES}`);
}
await browser.close();
console.log('\nconverting…');
execSync('python3 -I scripts/frames-to-webp.py', { stdio: 'inherit' });
