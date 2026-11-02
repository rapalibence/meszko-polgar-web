import { expect, test } from '@playwright/test';

const TITLES = ['Jövesztés', 'Törés', 'Osztályozás', 'Mérlegelés', 'Szállítás'];

async function scrollDescent(page: import('@playwright/test').Page) {
  const box = await page.locator('#folyamat').evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { top: r.top + window.scrollY, height: r.height, vh: window.innerHeight };
  });
  const seen: string[] = [];
  const travel = box.height - box.vh;
  for (let i = 0; i < 5; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), box.top + (travel * (i + 0.5)) / 5);
    await page.waitForTimeout(1100); // card cross-fade is 400ms out + 400ms in
    const t = await page.locator('#folyamat [data-step-card] h3').first().textContent();
    seen.push((t ?? '').trim());
    const sticky = await page.locator('#folyamat [data-sticky]').boundingBox();
    expect(sticky!.y).toBeGreaterThanOrEqual(-1);
    expect(sticky!.y + sticky!.height).toBeLessThanOrEqual(box.vh + 1);
    const card = await page.locator('#folyamat [data-step-card]').first().boundingBox();
    expect(card!.y).toBeGreaterThan(72);
    expect(card!.y + card!.height).toBeLessThan(box.vh);
  }
  return seen;
}

test('descent shows five steps in order and keeps the card inside the viewport', async ({ page }) => {
  await page.goto('/');
  const seen = await scrollDescent(page);
  expect(seen.map((s) => s.toLowerCase())).toEqual(TITLES.map((s) => s.toLowerCase()));
});

test.describe('tall viewport', () => {
  test.use({ viewport: { width: 768, height: 1024 } });
  test('card fits', async ({ page }) => {
    await page.goto('/');
    await scrollDescent(page);
  });
});

test.describe('large viewport', () => {
  test.use({ viewport: { width: 2560, height: 1440 } });
  test('card fits', async ({ page }) => {
    test.setTimeout(240_000); // software WebGL at 2560x1440 is slow in CI
    await page.goto('/');
    await scrollDescent(page);
  });
});

test.describe('landscape phone', () => {
  test.use({ viewport: { width: 844, height: 390 } });
  test('card fits', async ({ page }) => {
    await page.goto('/');
    await scrollDescent(page);
  });
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('all five titles present without pinning', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#folyamat h3')).toHaveCount(5);
  });
});
