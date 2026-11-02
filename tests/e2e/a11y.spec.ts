import { expect, test } from '@playwright/test';

test('keyboard reaches the hero CTA with a visible accent focus ring; headings and alts are sound', async ({ page }) => {
  await page.goto('/');
  let reached = false;
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press('Tab');
    const info = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      return el ? { cta: el.hasAttribute('data-cta'), inHero: !!el.closest('#hero'), outline: getComputedStyle(el).outlineColor } : null;
    });
    if (info?.cta && info.inHero) {
      expect(info.outline).toBe('rgb(217, 82, 26)');
      reached = true;
      break;
    }
  }
  expect(reached).toBe(true);

  expect(await page.locator('img:not([alt])').count()).toBe(0);
  expect(await page.locator('h1').count()).toBe(1);
  const levels = await page.locator('h1, h2, h3').evaluateAll((els) => els.map((e) => Number(e.tagName[1])));
  for (let i = 1; i < levels.length; i++) expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
});
