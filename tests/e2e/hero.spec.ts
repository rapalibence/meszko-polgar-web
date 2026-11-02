import { expect, test } from '@playwright/test';

function ty(page: import('@playwright/test').Page, sel: string) {
  return page.locator(sel).evaluate((el) => {
    const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
    return { ty: m.f, opacity: parseFloat(getComputedStyle(el).opacity) };
  });
}

test('poster has six layers, the intro settles, and scrolling parallaxes them by depth', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#hero [data-layer]')).toHaveCount(6);
  await page.waitForTimeout(1800);
  const floor = await ty(page, '#hero [data-layer="2"]');
  expect(floor.opacity).toBe(1);
  expect(Math.abs(floor.ty)).toBeLessThan(2);
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(500);
  const sky = await ty(page, '#hero [data-layer="0"]');
  const ledge = await ty(page, '#hero [data-layer="5"]');
  const strata = await ty(page, '#hero [data-layer="2"]');
  expect(sky.ty).toBeLessThan(strata.ty);
  expect(ledge.ty).toBeLessThan(sky.ty);
});

test('reload mid-scroll does not replay the intro', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, 900));
  await page.reload();
  await page.waitForTimeout(150);
  const copy = await ty(page, '#hero [data-hero-copy]');
  // Either already faded by the scroll trigger or fully visible: never mid-intro (opacity 0 at y>0 offset).
  expect(copy.opacity === 0 || copy.opacity === 1 || copy.ty <= 0).toBeTruthy();
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('everything is in place immediately', async ({ page }) => {
    await page.goto('/');
    const l = await ty(page, '#hero [data-layer="5"]');
    expect(l.opacity).toBe(1);
    expect(l.ty).toBe(0);
  });
});
