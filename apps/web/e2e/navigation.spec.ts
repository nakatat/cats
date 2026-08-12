import { devices, expect, test } from '@playwright/test';

const mobileDevice = devices['iPhone 13'];

test('Desktopでは主要ナビゲーションから成績へ遷移できる', async ({ page }) => {
  await page.goto('/players');

  const navigation = page.getByRole('navigation', {
    name: '主要ナビゲーション',
  });
  await expect(navigation).toBeVisible();
  await navigation.getByRole('link', { name: '成績' }).click();

  await expect(page).toHaveURL(/\/stats$/);
  await expect(page.getByRole('heading', { name: '成績一覧' })).toBeVisible();
});

test.describe('Mobile navigation', () => {
  test.use({
    viewport: mobileDevice.viewport,
    deviceScaleFactor: mobileDevice.deviceScaleFactor,
    userAgent: mobileDevice.userAgent,
    isMobile: mobileDevice.isMobile,
    hasTouch: mobileDevice.hasTouch,
  });

  test('メニューから選手一覧へ遷移できる', async ({ page }) => {
    await page.goto('/');

    const menuButton = page.getByRole('button', { name: 'メニューを開く' });
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    const navigation = page.getByRole('navigation', {
      name: 'モバイルナビゲーション',
    });
    await expect(navigation).toBeVisible();
    await navigation.getByRole('link', { name: '選手' }).click();

    await expect(page).toHaveURL(/\/players$/);
    await expect(page.getByRole('heading', { name: '選手一覧' })).toBeVisible();
  });
});
