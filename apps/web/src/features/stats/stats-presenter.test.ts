import { describe, expect, it } from 'vitest';

import type { SeasonResponse } from '@/lib/api/games';
import type {
  BattingStatsResponse,
  PitchingStatsResponse,
} from '@/lib/api/players';
import type { RankingResponse } from '@/lib/api/rankings';

import {
  createBattingLeadersFromRanking,
  createPitchingLeadersFromRanking,
} from './data/statLeaders';
import { CAREER_SEASON } from './data/stats';
import {
  createStatsData,
  createStatsSeasonOptions,
  resolveStatsSeason,
} from './stats-presenter';

function createBattingStat(
  overrides: Partial<BattingStatsResponse> = {}
): BattingStatsResponse {
  return {
    playerId: 7,
    displayName: '山田 太郎',
    uniformNumber: '7',
    games: 5,
    plateAppearances: 20,
    atBats: 10,
    hits: 4,
    homeRuns: 2,
    runsBattedIn: 5,
    runs: 6,
    walks: 2,
    hitByPitch: 1,
    sacrificeFlies: 1,
    stolenBases: 1,
    battingAverage: '0.400',
    onBasePercentage: '0.500',
    sluggingPercentage: '0.900',
    ops: '1.400',
    ...overrides,
  };
}

function createPitchingStat(
  overrides: Partial<PitchingStatsResponse> = {}
): PitchingStatsResponse {
  return {
    playerId: 3,
    displayName: '佐藤 一郎',
    uniformNumber: '18',
    games: 4,
    wins: 2,
    losses: 1,
    saves: 1,
    outsPitched: 9,
    inningsPitchedText: '3回',
    strikeouts: 6,
    walks: 2,
    hitsAllowed: 2,
    runsAllowed: 3,
    earnedRuns: 1,
    earnedRunAverage: '2.000',
    walksAndHitsPerInningPitched: '1.333',
    ...overrides,
  };
}

describe('createStatsSeasonOptions', () => {
  it('yearがないseasonを除外し、年度を降順で返す', () => {
    const seasons: SeasonResponse[] = [
      { year: 2022 },
      { year: 2024 },
      { name: '年度未設定' },
      { year: 2023 },
    ];

    expect(createStatsSeasonOptions(seasons)).toEqual(['2024', '2023', '2022']);
  });
});

describe('resolveStatsSeason', () => {
  it('careerが指定された場合はcareerを優先する', () => {
    expect(
      resolveStatsSeason([{ year: 2024, isCurrent: true }], 2023, CAREER_SEASON)
    ).toBe(CAREER_SEASON);
  });

  it('seasonYearが指定された場合はその年度を返す', () => {
    expect(resolveStatsSeason([{ year: 2024, isCurrent: true }], 2023)).toBe(
      '2023'
    );
  });

  it('seasonYearがない場合はcurrent season、なければ先頭年度、最後にcurrentYearを使う', () => {
    expect(
      resolveStatsSeason([{ year: 2023 }, { year: 2024, isCurrent: true }])
    ).toBe('2024');
    expect(resolveStatsSeason([{ year: 2023 }, { name: '年度未設定' }])).toBe(
      '2023'
    );
    expect(
      resolveStatsSeason([{ name: '年度未設定' }], undefined, undefined, 2025)
    ).toBe('2025');
  });
});

describe('createStatsData', () => {
  it('statsから表示行、summary、leaderを生成し、規定値以上をqualifiedにする', () => {
    const data = createStatsData(
      [createBattingStat()],
      [createPitchingStat()],
      '2024',
      ['2024'],
      {
        batting: [],
        pitching: [],
        requiredPlateAppearances: 20,
        requiredInningsPitchedOuts: 9,
        requiredInningsPitchedText: '3回',
      }
    );

    expect(data.batting[0]).toMatchObject({
      playerId: 7,
      rank: 1,
      uniformNumber: '7',
      playerName: '山田 太郎',
      battingAverage: '.400',
      onBasePercentage: '.500',
      sluggingPercentage: '.900',
      ops: '1.400',
      isQualified: true,
    });
    expect(data.pitching[0]).toMatchObject({
      playerId: 3,
      rank: 1,
      playerName: '佐藤 一郎',
      era: '2.000',
      whip: '1.333',
      inningsPitched: '3回',
      isQualified: true,
    });
    expect(data.battingSummary.map((metric) => metric.value)).toEqual([
      '.400',
      '2',
      '6',
      '.500',
    ]);
    expect(data.pitchingSummary.map((metric) => metric.value)).toEqual([
      '2.333',
      '2',
      '6',
      '1.333',
    ]);
    expect(data.battingLeaders[0]).toMatchObject({
      metric: '打率',
      playerId: 7,
      value: '.400',
    });
    expect(data.pitchingLeaders[0]).toMatchObject({
      metric: '防御率',
      playerId: 3,
      value: '2.000',
    });
    expect(data.battingQualificationThreshold).toBe(20);
    expect(data.pitchingQualificationThresholdOuts).toBe(9);
    expect(data.pitchingQualificationThresholdText).toBe('3回');
  });

  it('空またはnullableなresponseはplaceholder、0、空leaderとして表示する', () => {
    const data = createStatsData([{}], [{}], '2024', []);

    expect(data.batting[0]).toMatchObject({
      playerId: 0,
      rank: 1,
      uniformNumber: '—',
      playerName: '名前未登録',
      battingAverage: '.000',
      games: 0,
      plateAppearances: 0,
      isQualified: false,
    });
    expect(data.pitching[0]).toMatchObject({
      playerId: 0,
      rank: 1,
      uniformNumber: '—',
      playerName: '名前未登録',
      era: '.000',
      inningsPitched: '0回',
      whip: '.000',
      isQualified: false,
    });
    expect(data.battingSummary.map((metric) => metric.value)).toEqual([
      '.000',
      '0',
      '0',
      '.000',
    ]);
    expect(data.pitchingSummary.map((metric) => metric.value)).toEqual([
      '.000',
      '0',
      '0',
      '.000',
    ]);
    expect(data.battingLeaders).toEqual([]);
    expect(data.pitchingLeaders).toEqual([]);
  });

  it('rankingsの規定値がない場合はqualified rankingsの規定値を使う', () => {
    const data = createStatsData(
      [createBattingStat({ plateAppearances: 10 })],
      [createPitchingStat({ outsPitched: 3 })],
      'qualified',
      [],
      undefined,
      {
        requiredPlateAppearances: 10,
        requiredInningsPitchedOuts: 3,
        requiredInningsPitchedText: '1回',
      }
    );

    expect(data.batting[0].isQualified).toBe(true);
    expect(data.pitching[0].isQualified).toBe(true);
    expect(data.battingQualificationThreshold).toBe(10);
    expect(data.pitchingQualificationThresholdOuts).toBe(3);
    expect(data.pitchingQualificationThresholdText).toBe('1回');
  });

  it('rankingの同率1位をleaderのplayersに含め、打撃の0値leaderを除外する', () => {
    const rankings: RankingResponse = {
      batting: [
        {
          category: 'battingAverage',
          leaders: [
            {
              rank: 1,
              playerId: 7,
              displayName: '山田 太郎',
              uniformNumber: 7,
              value: '0.400',
              rawValue: 0.4,
            },
            {
              rank: 1,
              playerId: 8,
              displayName: '鈴木 次郎',
              uniformNumber: 8,
              value: '0.400',
              rawValue: 0.4,
            },
          ],
        },
        {
          category: 'homeRuns',
          leaders: [
            {
              rank: 1,
              playerId: 9,
              displayName: '佐々木 三郎',
              value: '0',
              rawValue: 0,
            },
          ],
        },
      ],
    };

    const leaders = createBattingLeadersFromRanking(rankings);

    expect(leaders).toHaveLength(1);
    expect(leaders[0]).toMatchObject({
      metric: '打率',
      playerId: 7,
      value: '.400',
      players: [
        { playerId: 7, playerName: '山田 太郎', uniformNumber: '7' },
        { playerId: 8, playerName: '鈴木 次郎', uniformNumber: '8' },
      ],
    });
  });

  it('pitchingの防御率leaderは0値を許容し、他の0値カテゴリは除外する', () => {
    const rankings: RankingResponse = {
      pitching: [
        {
          category: 'earnedRunAverage',
          leaders: [
            {
              rank: 1,
              playerId: 3,
              displayName: '高橋 投手',
              value: '0.000',
              rawValue: 0,
            },
          ],
        },
        {
          category: 'wins',
          leaders: [
            {
              rank: 1,
              playerId: 4,
              displayName: '中村 投手',
              value: '0',
              rawValue: 0,
            },
          ],
        },
      ],
    };

    const leaders = createPitchingLeadersFromRanking(rankings);

    expect(leaders).toHaveLength(1);
    expect(leaders[0]).toMatchObject({
      metric: '防御率',
      playerId: 3,
      value: '.000',
    });
  });
});
