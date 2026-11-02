import { expect, test } from '@playwright/test';

test('fraction accordion: one row open at a time, the sticky photo follows the open row', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  const rows = page.locator('#termekek [data-product]');
  await rows.first().waitFor();
  await rows.first().scrollIntoViewIfNeeded();
  await expect(rows).toHaveCount(6);
  await expect(rows.nth(0)).toHaveAttribute('data-open', 'true');
  await rows.nth(2).locator('button').click();
  await page.waitForTimeout(500);
  await expect(rows.nth(2)).toHaveAttribute('data-open', 'true');
  expect(await rows.nth(0).getAttribute('data-open')).toBeNull();
  await expect(rows.nth(2).locator('button')).toHaveAttribute('aria-expanded', 'true');
  const active = await page.locator('[data-product-photo] img[data-active="true"]').getAttribute('src');
  expect(active).toContain('frac-4-8');
  // Closing the open row leaves none open.
  await rows.nth(2).locator('button').click();
  await page.waitForTimeout(400);
  expect(await page.locator('#termekek [data-product][data-open="true"]').count()).toBe(0);
});

test.describe('phone', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test('open row shows its photo inline', async ({ page }) => {
    await page.goto('/');
    const row = page.locator('#termekek [data-product]').first();
    await row.waitFor();
    await row.scrollIntoViewIfNeeded();
    await expect(row.locator('img')).toBeVisible();
    await expect(page.locator('[data-product-photo]')).toBeHidden();
  });
});
