import { chromium, expect, test } from '@playwright/test';

test('without WebGL the static pit image shows and all steps remain readable', async () => {
  const browser = await chromium.launch({ args: ['--disable-gpu', '--disable-webgl', '--disable-webgl2', '--disable-3d-apis'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(process.env.BASE_URL || 'http://localhost:4173/');
  await expect(page.locator('img[src="/pit-fallback.webp"]')).toBeAttached({ timeout: 10_000 });
  await expect(page.locator('#folyamat h3')).toHaveCount(5);
  await browser.close();
});

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
