import { expect, test } from '@playwright/test';

test('marquee and products mosaic', async ({ page }) => {
  await page.goto('/');

  const marquee = page.locator('[data-marquee]');
  await expect(marquee).toContainText('Z 0/32');
  await marquee.hover();
  const state = await marquee.locator('[data-marquee-track]').evaluate((el) => getComputedStyle(el).animationPlayState);
  expect(state).toBe('paused');

  const tiles = page.locator('#termekek [data-product]');
  await expect(tiles).toHaveCount(6);
  await expect(page.locator('#termekek [data-product][data-span="lg"]')).toHaveCount(1);

  // Scroll every tile into view (reveal is once-in-view), then check the wipe finished.
  for (let i = 0; i < 6; i++) await tiles.nth(i).scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  const clips = await tiles.locator('img').evaluateAll((imgs) => imgs.map((i) => getComputedStyle(i.parentElement!).clipPath));
  for (const c of clips) expect(c.replace(/\s/g, '')).toMatch(/^inset\(0(px|%)?(0(px|%)?)*\)$/);
});
