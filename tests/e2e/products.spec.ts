import { expect, test } from '@playwright/test';

test('six fraction specimens with size labels; photos reveal once in view', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  const tiles = page.locator('#termekek [data-product]');
  await expect(tiles).toHaveCount(6);
  await expect(page.locator('#termekek [data-product][data-span="lg"]')).toHaveCount(1);
  for (let i = 0; i < 6; i++) {
    const label = await tiles.nth(i).locator('span.font-mono').first().textContent();
    expect(label?.trim()).toMatch(/^(\d+\/\d+ mm|vegyes)$/);
    await tiles.nth(i).scrollIntoViewIfNeeded();
  }
  await page.waitForTimeout(1500);
  const opacities = await tiles.locator('.reveal-photo').evaluateAll((els) => els.map((e) => getComputedStyle(e).opacity));
  for (const o of opacities) expect(parseFloat(o)).toBe(1);
});

test.describe('phone', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test('cut-out masks leave most of each photo visible', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
    const tile = page.locator('#termekek [data-product]').first();
    await tile.scrollIntoViewIfNeeded();
    const ratio = await tile.evaluate((el) => {
      const outer = el.querySelector('[data-product] > div, div')!.getBoundingClientRect();
      const clip = el.querySelector('[style*="clip-path"]')!.getBoundingClientRect();
      return (clip.width * clip.height) / (outer.width * outer.height);
    });
    expect(ratio).toBeGreaterThan(0.6);
  });
});
