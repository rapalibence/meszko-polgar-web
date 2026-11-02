import { expect, test } from '@playwright/test';

test('services, about figures and the quote form', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('#szolgaltatasok')).toContainText('Digitális szállítólevél');
  expect(await page.locator('#folyamat').evaluate((el) => getComputedStyle(el).backgroundColor)).toBe('rgb(42, 42, 30)');
  expect(await page.locator('#termekek').evaluate((el) => getComputedStyle(el).backgroundColor)).toBe('rgb(220, 212, 192)');
  await expect(page.locator('footer')).toContainText('Unsplash');

  const figure = page.locator('[data-figure]').first();
  await figure.scrollIntoViewIfNeeded();
  await expect(figure).toHaveText('2011', { timeout: 3000 });

  await page.locator('#kapcsolat').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Ajánlatkérés' }).click();
  await expect(page.locator('#kapcsolat [role="alert"]', { hasText: 'Kötelező mező' })).toHaveCount(4, { timeout: 3000 }); // név, telefon, e-mail, termék

  await page.route('**/api/quote', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }));
  await page.getByLabel('Név').fill('Kovács Ákos');
  await page.getByLabel('Telefon').fill('06 30 123 4567');
  await page.getByLabel('E-mail').fill('akos@example.hu');
  await page.getByLabel('Termék / frakció').selectOption('zuzottko-0-4');
  await page.getByLabel(/Elfogadom az adatkezelési/).check();
  await page.getByRole('button', { name: 'Ajánlatkérés' }).click();
  await expect(page.locator('#kapcsolat')).toContainText('Köszönjük! Egy munkanapon belül jelentkezünk.');
});
