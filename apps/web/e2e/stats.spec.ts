import { expect, test } from '@playwright/test';

test('Statsのseason選択をURLへ反映し、reload後も復元する', async ({ page }) => {
  await page.goto('/stats');

  const seasonSelect = page.getByRole('combobox', { name: 'シーズン' });
  await expect(seasonSelect).toBeVisible();
  await expect(seasonSelect).toContainText(/\d{4}年シーズン/);
  const currentSeasonYear = (await seasonSelect.innerText()).match(
    /\d{4}/
  )?.[0];
  await seasonSelect.click();

  const seasonOptions = page.getByRole('option', { name: /^\d{4}年$/ });
  const seasonLabels = await seasonOptions.allTextContents();
  const seasonLabel = seasonLabels.find(
    (label) => !currentSeasonYear || !label.startsWith(currentSeasonYear)
  );
  if (!seasonLabel) {
    throw new Error('現在のシーズン以外の選択肢が見つかりません');
  }
  const seasonYear = seasonLabel.slice(0, 4);
  const seasonOption = page.getByRole('option', {
    name: seasonLabel,
    exact: true,
  });
  await expect(seasonOption).toBeVisible();
  await Promise.all([
    page.waitForURL(
      new RegExp(`/stats\\?section=batting&seasonYear=${seasonYear}$`)
    ),
    seasonOption.click(),
  ]);

  await expect(page).toHaveURL(
    new RegExp(`/stats\\?section=batting&seasonYear=${seasonYear}$`)
  );
  await expect(seasonSelect).toContainText(`${seasonYear}年シーズン`);

  await page.reload();

  await expect(page).toHaveURL(
    new RegExp(`/stats\\?section=batting&seasonYear=${seasonYear}$`)
  );
  await expect(page.getByRole('combobox', { name: 'シーズン' })).toContainText(
    `${seasonYear}年シーズン`
  );
});

test('Statsのseasonとsectionをquery付きURLから復元する', async ({ page }) => {
  await page.goto('/stats?season=career&section=pitching');

  await expect(page).toHaveURL(/\/stats\?season=career&section=pitching$/);
  await expect(page.getByRole('combobox', { name: 'シーズン' })).toContainText(
    '通算'
  );
  await expect(
    page.getByRole('heading', { name: 'チーム投手成績サマリー' })
  ).toBeVisible();
});
