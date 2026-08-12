import { describe, expect, it } from 'vitest';

import type {
  GameResponse,
  SeasonResponse,
  TournamentResponse,
} from '@/lib/api/games';

import {
  createSeasonOptions,
  createTournamentOptions,
  filterGames,
  sortGames,
} from './game-list-calculations';
import { ALL_GAME_FILTER_VALUE } from './game-list-query';

function createGame(overrides: Partial<GameResponse> = {}): GameResponse {
  return {
    gameId: 1,
    seasonYear: 2024,
    tournamentId: 1,
    tournamentName: '大会A',
    gameDate: '2024-05-01',
    result: 'win',
    ...overrides,
  };
}

describe('filterGames', () => {
  const games = [
    createGame({ gameId: 1, seasonYear: 2024, tournamentId: 1, result: 'win' }),
    createGame({
      gameId: 2,
      seasonYear: 2024,
      tournamentId: 2,
      result: 'loss',
    }),
    createGame({
      gameId: 3,
      seasonYear: 2023,
      tournamentId: 1,
      result: 'draw',
    }),
  ];

  it('season、tournament、resultの指定をすべて満たす試合だけを返す', () => {
    expect(
      filterGames(games, { season: '2024', tournament: '2', result: 'loss' })
    ).toEqual([games[1]]);
  });

  it('allが指定されたfilterはその条件を適用せず全試合を残す', () => {
    expect(
      filterGames(games, {
        season: ALL_GAME_FILTER_VALUE,
        tournament: ALL_GAME_FILTER_VALUE,
        result: ALL_GAME_FILTER_VALUE,
      })
    ).toEqual(games);
  });

  it('入力が空配列の場合は空配列を返す', () => {
    expect(
      filterGames([], {
        season: '2024',
        tournament: ALL_GAME_FILTER_VALUE,
        result: 'win',
      })
    ).toEqual([]);
  });
});

describe('sortGames', () => {
  const games = [
    createGame({ gameId: 1, gameDate: '2024-05-01' }),
    createGame({ gameId: 2, gameDate: '2024-05-03' }),
    createGame({ gameId: 3, gameDate: undefined }),
  ];

  it('date-ascは日付の古い順にし、日付未設定を先頭に置く', () => {
    expect(sortGames(games, 'date-asc').map((game) => game.gameId)).toEqual([
      3, 1, 2,
    ]);
  });

  it('date-asc以外は日付の新しい順にする', () => {
    expect(sortGames(games, 'date-desc').map((game) => game.gameId)).toEqual([
      2, 1, 3,
    ]);
  });
});

describe('createSeasonOptions', () => {
  it('season情報を優先し、gamesにだけ存在する年度を補完して重複年度を除く', () => {
    const seasons: SeasonResponse[] = [
      { year: 2023, name: '2023年度' },
      { year: 2024 },
    ];
    const games = [
      createGame({ seasonYear: 2024 }),
      createGame({ seasonYear: 2022 }),
      createGame({ seasonYear: 2022 }),
      createGame({ seasonYear: undefined }),
    ];

    expect(createSeasonOptions(games, seasons)).toEqual([
      [2024, '2024年'],
      [2023, '2023年度'],
      [2022, '2022年'],
    ]);
  });

  it('入力が空の場合は空配列を返す', () => {
    expect(createSeasonOptions([], [])).toEqual([]);
  });
});

describe('createTournamentOptions', () => {
  it('tournament情報を優先し、gamesにだけ存在する大会を補完して大会名重複を除く', () => {
    const tournaments: TournamentResponse[] = [
      { tournamentId: 1, name: '大会B' },
      { tournamentId: 2 },
    ];
    const games = [
      createGame({ tournamentId: 1, tournamentName: '別名' }),
      createGame({ tournamentId: 3, tournamentName: '大会A' }),
      createGame({ tournamentId: 3, tournamentName: '大会A' }),
      createGame({ tournamentId: undefined }),
    ];

    expect(createTournamentOptions(games, tournaments)).toEqual([
      {
        value: 'tournament-name:大会a',
        label: '大会A',
        tournamentIds: [3],
      },
      {
        value: 'tournament-name:大会b',
        label: '大会B',
        tournamentIds: [1],
      },
      {
        value: 'tournament-id:2',
        label: '大会未設定',
        tournamentIds: [2],
      },
    ]);
  });

  it('年度をまたぐ同名大会を1件にまとめ、選択時は全年度のIDで絞り込む', () => {
    const tournaments = [
      { tournamentId: 10, name: 'BCリーグ', seasonYear: 2019 },
      { tournamentId: 11, name: 'BCリーグ', seasonYear: 2020 },
    ];
    const games = [
      createGame({ gameId: 1, seasonYear: 2019, tournamentId: 10 }),
      createGame({ gameId: 2, seasonYear: 2020, tournamentId: 11 }),
      createGame({ gameId: 3, seasonYear: 2020, tournamentId: 12 }),
    ];

    const options = createTournamentOptions(games, tournaments);
    const bcLeague = options.find((option) => option.label === 'BCリーグ');

    expect(bcLeague).toEqual({
      value: 'tournament-name:bcリーグ',
      label: 'BCリーグ',
      tournamentIds: [10, 11],
    });
    expect(
      filterGames(
        games,
        {
          season: ALL_GAME_FILTER_VALUE,
          tournament: bcLeague?.value ?? ALL_GAME_FILTER_VALUE,
          result: ALL_GAME_FILTER_VALUE,
        },
        options
      ).map((game) => game.gameId)
    ).toEqual([1, 2]);
  });

  it('入力が空の場合は空配列を返す', () => {
    expect(createTournamentOptions([], [])).toEqual([]);
  });
});
