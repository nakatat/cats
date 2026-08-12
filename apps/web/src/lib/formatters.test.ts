import { describe, expect, it } from 'vitest';

import {
  formatGameDate,
  formatGameResult,
  formatGameScore,
  formatMobilePlayerName,
  formatRate,
} from './formatters';

describe('formatGameDate', () => {
  it('日付を東京timezoneの年月日として表示する', () => {
    expect(formatGameDate('2024-01-01T15:00:00.000Z')).toBe('2024/01/02');
  });

  it('日付がnullableの場合は日付未定を返す', () => {
    expect(formatGameDate(null)).toBe('日付未定');
  });
});

describe('formatGameResult', () => {
  it('既知の試合結果を日本語表示へ変換する', () => {
    expect(formatGameResult('win')).toBe('勝ち');
    expect(formatGameResult('loss')).toBe('負け');
    expect(formatGameResult('draw')).toBe('引き分け');
  });

  it('結果がない場合は未定、未知の値はそのまま返す', () => {
    expect(formatGameResult(undefined)).toBe('未定');
    expect(formatGameResult('postponed')).toBe('postponed');
  });
});

describe('formatGameScore', () => {
  it('両チームの得点がある場合はスコアを表示する', () => {
    expect(formatGameScore(5, 3)).toBe('5 - 3');
  });

  it('どちらかの得点がnullableの場合は未定を返す', () => {
    expect(formatGameScore(5, null)).toBe('未定');
  });
});

describe('formatRate', () => {
  it('0から始まる率の先頭0を省略し、nullable値は.000にする', () => {
    expect(formatRate('0.400')).toBe('.400');
    expect(formatRate(null)).toBe('.000');
  });
});

describe('formatMobilePlayerName', () => {
  it('空白区切りの選手名から先頭の名前だけを返す', () => {
    expect(formatMobilePlayerName('  山田   太郎 ')).toBe('山田');
  });
});
