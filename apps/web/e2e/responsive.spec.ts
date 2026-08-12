import { devices, expect, test } from '@playwright/test';

const mobileDevice = devices['iPhone 13'];

test.describe('Mobile viewport', () => {
  test.use({
    viewport: mobileDevice.viewport,
    deviceScaleFactor: mobileDevice.deviceScaleFactor,
    userAgent: mobileDevice.userAgent,
    isMobile: mobileDevice.isMobile,
    hasTouch: mobileDevice.hasTouch,
  });

  test('試合一覧の主要導線をMobile viewportで利用できる', async ({ page }) => {
    await page.goto('/games');

    await expect(page.getByRole('heading', { name: '試合一覧' })).toBeVisible();
    await expect(
      page.getByRole('link', { name: /試合詳細を見る$/ }).first()
    ).toBeVisible();
  });

  test('選手一覧の主要導線をMobile viewportで利用できる', async ({ page }) => {
    await page.goto('/players');

    await expect(page.getByRole('heading', { name: '選手一覧' })).toBeVisible();
    await expect(
      page.getByRole('link', { name: /詳細を見る$/ }).first()
    ).toBeVisible();
  });
});
