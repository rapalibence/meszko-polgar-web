import { expect, test } from '@playwright/test';

test('wheel scrolling moves the page smoothly and anchor links land on their section', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => document.documentElement.classList.contains('lenis'))).toBe(true);
  await page.mouse.move(700, 450);
  await page.mouse.wheel(0, 1200);
  await page.waitForTimeout(900);
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(600);
  await page.locator('header[data-nav] a[href="#rolunk"]').click();
  await page.waitForTimeout(1600);
  const top = await page.locator('#rolunk').evaluate((el) => el.getBoundingClientRect().top);
  expect(Math.abs(top)).toBeLessThan(120);
});
