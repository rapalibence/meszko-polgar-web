import { expect, test } from '@playwright/test';

const scaleOf = (page: import('@playwright/test').Page) =>
  page.locator('#hero [data-hero-photo] img').evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).a);

test('hero photo is the priority image, pushes in on scroll, and the copy lifts away', async ({ page }) => {
  await page.goto('/');
  const img = page.locator('#hero [data-hero-photo] img');
  await expect(img).toHaveAttribute('fetchpriority', 'high');
  await page.waitForTimeout(1900);
  const settled = await scaleOf(page);
  expect(Math.abs(settled - 1)).toBeLessThan(0.01);
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, 600); });
  await page.waitForTimeout(600);
  expect(await scaleOf(page)).toBeGreaterThan(1.02);
  const copyOpacity = await page.locator('[data-hero-copy]').evaluate((el) => parseFloat(getComputedStyle(el).opacity));
  expect(copyOpacity).toBeLessThan(1);
});

test('landing on an anchor deep in the page does not leave the hero mid-intro', async ({ page }) => {
  await page.goto('/#rolunk');
  await page.waitForTimeout(250);
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(400);
  const lineY = await page.locator('#hero [data-line]').first().evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).f);
  expect(lineY).toBeLessThanOrEqual(0.5);
});

test.describe('large viewport', () => {
  test.use({ viewport: { width: 2560, height: 1440 } });
  test('photo covers the hero', async ({ page }) => {
    await page.goto('/');
    const hero = await page.locator('#hero').boundingBox();
    const img = await page.locator('#hero [data-hero-photo] img').boundingBox();
    expect(img!.width).toBeGreaterThanOrEqual(hero!.width - 1);
    expect(img!.height).toBeGreaterThanOrEqual(hero!.height - 1);
  });
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('photo never scales', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(400);
    expect(await scaleOf(page)).toBe(1);
  });
});
