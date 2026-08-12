import { expect, test } from '@playwright/test';

test('選手一覧から詳細へ遷移し、一覧queryを維持したまま戻れる', async ({
  page,
}) => {
  await page.goto('/players?sort=name');

  await expect(page.getByRole('heading', { name: '選手一覧' })).toBeVisible();

  const playerLink = page.getByRole('link', { name: /詳細を見る$/ }).first();
  await expect(playerLink).toBeVisible();
  const playerName =
    (await playerLink.getAttribute('aria-label'))?.replace(
      /の詳細を見る$/,
      ''
    ) ?? '名前未設定';
  const playerNameText = playerLink.getByText(playerName, { exact: true });
  await expect(playerNameText).toBeVisible();
  await Promise.all([
    page.waitForURL(/\/players\/\d+\?sort=name$/),
    playerNameText.click(),
  ]);

  await expect(page).toHaveURL(/\/players\/\d+\?sort=name$/);
  await expect(
    page.getByRole('heading', { name: playerName, exact: false })
  ).toBeVisible();
  await expect(page.getByRole('link', { name: '選手一覧' })).toBeVisible();

  await page.goBack();

  await expect(page).toHaveURL(/\/players\?sort=name$/);
  await expect(page.getByRole('heading', { name: '選手一覧' })).toBeVisible();

  await page.goForward();

  await expect(page).toHaveURL(/\/players\/\d+\?sort=name$/);
  await expect(
    page.getByRole('heading', { name: playerName, exact: false })
  ).toBeVisible();
});
