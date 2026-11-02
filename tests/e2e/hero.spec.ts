import { expect, test } from '@playwright/test';

test('hero has a priority photograph, two link cards, and the CTA above the fold', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#hero video')).toHaveCount(0);
  await expect(page.locator('#hero img[fetchpriority="high"]')).toHaveCount(1);
  await expect(page.locator('#hero [data-hero-card]:visible')).toHaveCount(2);
  const h1 = await page.locator('h1').boundingBox();
  const lines = Math.round(h1!.height / 72 / 1.02);
  expect(lines).toBeLessThanOrEqual(4);
  const cta = await page.locator('#hero [data-cta]').first().boundingBox();
  expect(cta!.y + cta!.height).toBeLessThan(900);
});

test('landing on an anchor deep in the page works with lazy sections', async ({ page }) => {
  await page.goto('/#gyik');
  await page.locator('#gyik').waitFor();
  await page.waitForTimeout(500);
  const top = await page.locator('#gyik').evaluate((el) => el.getBoundingClientRect().top);
  expect(Math.abs(top)).toBeLessThan(120);
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('copy is in place immediately', async ({ page }) => {
    await page.goto('/');
    const o = await page.locator('#hero [data-copy]').first().evaluate((el) => getComputedStyle(el).opacity);
    expect(o).toBe('1');
  });
});
