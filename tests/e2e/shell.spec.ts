import { expect, test } from '@playwright/test';

test.describe('shell at desktop', () => {
  test('hero, nav and CTA discipline', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveAttribute('aria-label', 'Zúzottkő');

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

    // Eyebrow restraint: at most 3 small-caps labels above headlines on the whole page.
    expect(await page.locator('main p.font-mono.uppercase').count()).toBeLessThanOrEqual(3);
  });
});

test('nav underline clears when no nav section is in view', async ({ page }) => {
  await page.goto('/');
  // Fonts settle layout (and trigger a ScrollTrigger refresh) within the first second; wait them out.
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  await page.locator('#termekek').waitFor();
  await page.evaluate(() => document.getElementById('termekek')!.scrollIntoView());
  await page.waitForTimeout(600);
  await expect(page.locator('header[data-nav] a[data-active="true"]')).toHaveCount(1);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);
  await expect(page.locator('header[data-nav] a[data-active="true"]')).toHaveCount(0);
  // Mid-descent (#folyamat is not a nav item) nothing should be underlined either.
  const box = await page.locator('#folyamat').evaluate((el) => ({ top: el.getBoundingClientRect().top + window.scrollY, height: el.getBoundingClientRect().height }));
  await page.evaluate((y) => window.scrollTo(0, y), box.top + box.height * 0.5);
  await page.waitForTimeout(800);
  await expect(page.locator('header[data-nav] a[data-active="true"]')).toHaveCount(0);
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
