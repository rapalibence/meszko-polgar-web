import { expect, test } from '@playwright/test';

test('hero has a muted looping video with a poster, two link cards, and the CTA above the fold', async ({ page }) => {
  await page.goto('/');
  const video = page.locator('#hero video[data-hero-video]');
  await expect(video).toHaveCount(1);
  await expect(video).toHaveAttribute('poster', '/video/hero-poster.webp');
  expect(await video.evaluate((v: HTMLVideoElement) => v.muted && v.loop && v.playsInline)).toBe(true);
  await expect(page.locator('#hero [data-hero-card]')).toHaveCount(2);
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
  test('poster image instead of video; nothing animates', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#hero video')).toHaveCount(0);
    await expect(page.locator('#hero img[src="/video/hero-poster.webp"]')).toHaveCount(1);
  });
});
