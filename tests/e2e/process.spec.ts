import { expect, test } from '@playwright/test';

const TITLES = ['Jövesztés', 'Törés', 'Osztályozás', 'Mérlegelés', 'Szállítás'];

async function walk(page: import('@playwright/test').Page, withContours: boolean) {
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  const steps = page.locator('#folyamat [data-step]');
  await expect(steps).toHaveCount(5);
  const seen: string[] = [];
  const offsets: number[] = [];
  for (let i = 0; i < 5; i++) {
    await steps.nth(i).evaluate((el) => {
      const r = el.getBoundingClientRect();
      window.scrollTo(0, window.scrollY + r.top + r.height / 2 - window.innerHeight / 2);
    });
    await page.waitForTimeout(500);
    const active = await page.locator('#folyamat [data-step][data-active="true"] h3').textContent();
    seen.push((active ?? '').trim());
    if (withContours) {
      offsets.push(parseFloat((await page.locator('#folyamat [data-contour]').first().getAttribute('stroke-dashoffset')) ?? '0'));
      const svg = await page.locator('#folyamat [data-sticky]').boundingBox();
      const vh = await page.evaluate(() => window.innerHeight);
      expect(svg!.height).toBeLessThanOrEqual(vh - 80);
    }
  }
  expect(seen.map((s) => s.toLowerCase())).toEqual(TITLES.map((s) => s.toLowerCase()));
  for (let i = 1; i < offsets.length; i++) expect(offsets[i]).toBeLessThanOrEqual(offsets[i - 1]);
  if (offsets.length) expect(offsets[offsets.length - 1]).toBeLessThan(offsets[0]);
}

test('process steps activate in order and the contours draw in', async ({ page }) => {
  await page.goto('/');
  await walk(page, true);
});

test.describe('phone', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test('steps activate in order', async ({ page }) => {
    await page.goto('/');
    await walk(page, false);
  });
});

test.describe('landscape phone', () => {
  test.use({ viewport: { width: 844, height: 390 } });
  test('steps activate and the sticky column fits', async ({ page }) => {
    await page.goto('/');
    await walk(page, true);
  });
});
