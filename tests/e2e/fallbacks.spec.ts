import { expect, test } from '@playwright/test';

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('nothing moves', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    const marquee = await page.locator('[data-marquee-track]').evaluate((el) => getComputedStyle(el).animationName);
    expect(marquee).toBe('none');
    const moving = await page.evaluate(() =>
      Array.from(document.querySelectorAll('main *')).filter((el) => {
        const t = getComputedStyle(el).transform;
        return t !== 'none' && t !== 'matrix(1, 0, 0, 1, 0, 0)';
      }).length,
    );
    expect(moving).toBe(0);
  });
});
