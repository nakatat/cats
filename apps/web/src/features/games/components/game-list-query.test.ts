import { describe, expect, it } from 'vitest';

import {
  ALL_GAME_FILTER_VALUE,
  createGameFilterQuery,
  type GameFilterValues,
  getGameFilterValue,
} from './game-list-query';

describe('getGameFilterValue', () => {
  it('queryに存在する値をURL decodeして返す', () => {
    expect(
      getGameFilterValue('season=2024&result=win%20or%20draw', 'result', 'all')
    ).toBe('win or draw');
  });

  it('queryにkeyがない場合はfallbackを返す', () => {
    expect(
      getGameFilterValue('season=2024', 'tournament', ALL_GAME_FILTER_VALUE)
    ).toBe(ALL_GAME_FILTER_VALUE);
  });
});

describe('createGameFilterQuery', () => {
  it('default値以外のfilterだけをURL queryとして生成する', () => {
    const filters: GameFilterValues = {
      season: '2024',
      tournament: '2',
      result: 'win',
      sort: 'date-asc',
    };

    expect(createGameFilterQuery(filters)).toBe(
      'season=2024&tournament=2&result=win&sort=date-asc'
    );
  });

  it('全filterがdefault値の場合は空queryを返す', () => {
    expect(
      createGameFilterQuery({
        season: ALL_GAME_FILTER_VALUE,
        tournament: ALL_GAME_FILTER_VALUE,
        result: ALL_GAME_FILTER_VALUE,
        sort: 'date-desc',
      })
    ).toBe('');
  });

  it('値をURL queryに設定するときはURLSearchParamsのencodingを使う', () => {
    expect(
      createGameFilterQuery({
        season: '2024年度',
        tournament: ALL_GAME_FILTER_VALUE,
        result: 'win & draw',
        sort: 'date-desc',
      })
    ).toBe('season=2024%E5%B9%B4%E5%BA%A6&result=win+%26+draw');
  });
});
