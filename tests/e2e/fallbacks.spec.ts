import { expect, test } from '@playwright/test';

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('nothing moves and everything is visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    const moving = await page.evaluate(() =>
      Array.from(document.querySelectorAll('main *')).filter((el) => {
        const t = getComputedStyle(el).transform;
        return t !== 'none' && t !== 'matrix(1, 0, 0, 1, 0, 0)';
      }).length,
    );
    expect(moving).toBe(0);
    const hidden = await page.evaluate(() =>
      Array.from(document.querySelectorAll('[data-reveal], .reveal-photo')).filter((el) => parseFloat(getComputedStyle(el).opacity) < 1).length,
    );
    expect(hidden).toBe(0);
  });
});
