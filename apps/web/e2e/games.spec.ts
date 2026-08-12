import { expect, test } from '@playwright/test';

test('試合一覧から詳細へ遷移し、一覧queryを維持したまま戻れる', async ({
  page,
}) => {
  await page.goto('/games?sort=date-asc');

  await expect(page.getByRole('heading', { name: '試合一覧' })).toBeVisible();

  const gameLink = page.getByRole('link', { name: /試合詳細を見る$/ }).first();
  await expect(gameLink).toBeVisible();
  await expect(gameLink).toHaveAttribute(
    'href',
    /\/games\/\d+\?sort=date-asc$/
  );
  await Promise.all([
    page.waitForURL(/\/games\/\d+\?sort=date-asc$/),
    gameLink.click(),
  ]);

  await expect(page).toHaveURL(/\/games\/\d+\?sort=date-asc$/);
  await expect(page.getByRole('heading', { name: '試合詳細' })).toBeVisible();
  await expect(page.getByRole('link', { name: '試合一覧' })).toBeVisible();

  await page.goBack();

  await expect(page).toHaveURL(/\/games\?sort=date-asc$/);
  await expect(page.getByRole('heading', { name: '試合一覧' })).toBeVisible();

  await page.goForward();

  await expect(page).toHaveURL(/\/games\/\d+\?sort=date-asc$/);
  await expect(page.getByRole('heading', { name: '試合詳細' })).toBeVisible();
});

test('試合一覧のseason選択をURLへ反映し、reload後も復元する', async ({
  page,
}) => {
  await page.goto('/games');

  const seasonSelect = page.getByRole('combobox', { name: 'シーズン' });
  await seasonSelect.click();

  const seasonOption = page
    .getByRole('option', { name: /^\d{4}年度$/ })
    .first();
  await expect(seasonOption).toBeVisible();
  const seasonLabel = await seasonOption.innerText();
  const seasonYear = seasonLabel.slice(0, 4);
  await seasonOption.click();

  await expect(page).toHaveURL(new RegExp(`/games\\?season=${seasonYear}$`));
  await expect(seasonSelect).toContainText(`${seasonYear}年`);

  await page.reload();

  await expect(page).toHaveURL(new RegExp(`/games\\?season=${seasonYear}$`));
  await expect(page.getByRole('combobox', { name: 'シーズン' })).toContainText(
    `${seasonYear}年`
  );
});
