import { expect, test } from '@playwright/test';

test('three numbered services; hovering a row shows the cursor preview on desktop', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  const rows = page.locator('#szolgaltatasok [data-service]');
  await expect(rows).toHaveCount(3);
  await rows.first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  const preview = page.locator('[data-service-preview]');
  expect(await preview.evaluate((el) => getComputedStyle(el).opacity)).toBe('0');
  await rows.nth(1).hover();
  await page.waitForTimeout(400);
  expect(await preview.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
  await expect(page.locator('section[aria-label="Számokban"] [data-reveal]')).toHaveCount(4);
});

test.describe('phone', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test('inline previews instead of the cursor preview', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-service-preview]')).toBeHidden();
    await expect(page.locator('#szolgaltatasok [data-service] img')).toHaveCount(3);
  });
});
