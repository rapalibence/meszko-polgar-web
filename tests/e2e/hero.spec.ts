import { expect, test } from '@playwright/test';

async function wordFits(page: import('@playwright/test').Page) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  return page.locator('[data-hero-word]').evaluate((el) => {
    const w = el.getBoundingClientRect().width;
    const box = el.parentElement!.getBoundingClientRect().width;
    const lines = Math.round(el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).fontSize) / 0.82);
    return { ratio: w / box, lines };
  });
}

test('the poster word spans the container on one line and the truck parallaxes on scroll', async ({ page }) => {
  await page.goto('/');
  const fit = await wordFits(page);
  expect(fit.lines).toBe(1);
  expect(fit.ratio).toBeGreaterThan(0.9);
  expect(fit.ratio).toBeLessThanOrEqual(1.02);
  await page.waitForTimeout(1800);
  const before = await page.locator('[data-truck]').evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).f);
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, 500); });
  await page.waitForTimeout(600);
  const after = await page.locator('[data-truck]').evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).f);
  expect(after).toBeLessThan(before - 20);
});

test('landing on an anchor deep in the page does not leave the hero mid-intro', async ({ page }) => {
  await page.goto('/#rolunk');
  await page.locator('#rolunk').waitFor();
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(400);
  const hidden = await page.locator('[data-hero-bottom] [data-copy]').first().evaluate((el) => parseFloat(getComputedStyle(el).opacity));
  // Either settled (1) or already faded by the scroll trigger (0): never a mid-intro value.
  expect(hidden === 1 || hidden === 0).toBeTruthy();
});

for (const vp of [{ width: 390, height: 844 }, { width: 2560, height: 1440 }]) {
  test.describe(`viewport ${vp.width}`, () => {
    test.use({ viewport: vp });
    test('word still fits on one line', async ({ page }) => {
      await page.goto('/');
      const fit = await wordFits(page);
      expect(fit.lines).toBe(1);
      expect(fit.ratio).toBeGreaterThan(0.9);
    });
  });
}

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('truck and word stay put', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(400);
    const t = await page.locator('[data-truck]').evaluate((el) => getComputedStyle(el).transform);
    expect(t === 'none' || t === 'matrix(1, 0, 0, 1, 0, 0)').toBeTruthy();
  });
});
