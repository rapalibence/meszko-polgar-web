import { expect, test } from '@playwright/test';

test.describe('shell at desktop', () => {
  test('hero, nav and CTA discipline', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveText('Zúzottkő, egyenesen a bányából.');

    const heroCta = page.locator('#hero [data-cta]').first();
    const box = await heroCta.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.y + box!.height).toBeLessThan(900);

    const nav = page.locator('header[data-nav]');
    const navBox = await nav.boundingBox();
    expect(navBox!.height).toBeGreaterThanOrEqual(64);
    expect(navBox!.height).toBeLessThanOrEqual(80);

    const ctas = page.locator('[data-cta]');
    expect(await ctas.count()).toBeGreaterThanOrEqual(1);
    // textContent, not innerText: the display face is uppercased via CSS.
    for (const text of await ctas.allTextContents()) {
      expect(text.trim()).toBe('Ajánlatkérés');
    }

    await expect(page.locator('[data-eyebrow]')).toHaveCount(1);
  });
});

test.describe('shell at mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test('hamburger shown and hero CTA near the fold', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header[data-nav] button[aria-label="Menü"]')).toBeVisible();
    const box = await page.locator('#hero [data-cta]').first().boundingBox();
    expect(box!.y + box!.height).toBeLessThan(844 * 1.1);
  });
});
