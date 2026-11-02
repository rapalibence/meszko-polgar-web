import { expect, test } from '@playwright/test';

test('process shows five steps whose rules fill in; services are 1 featured + 2; FAQ has five toggling items', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  const steps = page.locator('#folyamat [data-step]');
  await steps.first().waitFor();
  await steps.first().scrollIntoViewIfNeeded();
  await expect(steps).toHaveCount(5);
  await page.waitForTimeout(1600);
  const sx = await page.locator('#folyamat [data-rule]').last().evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).a);
  expect(sx).toBeGreaterThan(0.95);

  await expect(page.locator('#szolgaltatasok [data-service]')).toHaveCount(3);

  const faqs = page.locator('#gyik [data-faq]');
  await expect(faqs).toHaveCount(5);
  await faqs.nth(1).locator('button').click();
  await expect(faqs.nth(1).locator('button')).toHaveAttribute('aria-expanded', 'true');
  await expect(faqs.nth(1).locator('dd')).toHaveAttribute('data-open', 'true');
});

test('menu overlay opens, lists the sections, closes on Escape', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Menü' }).click();
  const menu = page.locator('[data-menu]');
  await expect(menu).toHaveAttribute('aria-hidden', 'false');
  await expect(menu.locator('nav a')).toHaveCount(4);
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-hidden', 'true');
});

test('unknown routes get the custom 404; the thank-you page exists', async ({ page }) => {
  await page.goto('/nincs-ilyen');
  await expect(page.locator('h1')).toContainText('nem létezik');
  await page.goto('/koszonjuk');
  await expect(page.locator('h1')).toContainText('Köszönjük');
});

test.describe('phone', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test('sticky CTA appears once the hero scrolls away', async ({ page }) => {
    await page.goto('/');
    const bar = page.locator('[data-sticky-cta]');
    await expect(bar).toHaveAttribute('aria-hidden', 'true');
    await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, 1400); });
    await page.waitForTimeout(600);
    await expect(bar).toHaveAttribute('aria-hidden', 'false');
    const box = await bar.boundingBox();
    expect(box!.y + box!.height).toBeLessThanOrEqual(845);
  });
});
