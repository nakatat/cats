import type { SeasonResponse } from '@/lib/api/games';
import type {
  BattingStatsResponse,
  PitchingStatsResponse,
} from '@/lib/api/players';
import type { RankingResponse } from '@/lib/api/rankings';
import { formatRate } from '@/lib/formatters';

import {
  createBattingLeaders,
  createPitchingLeaders,
} from './data/statLeaders';
import { CAREER_SEASON, type StatsViewData } from './data/stats';

/**
 * APIのseason一覧をStats画面の選択肢へ変換する。
 *
 * <p>年度がない要素は除外し、表示順は新しい年度からとする。
 */
export function createStatsSeasonOptions(seasons: SeasonResponse[]): string[] {
  return seasons
    .filter((season) => season.year != null)
    .sort((left, right) => (right.year ?? 0) - (left.year ?? 0))
    .map((season) => String(season.year));
}

/**
 * Stats画面で使用するseasonを解決する。
 *
 * `career`の指定を最優先し、次に明示された年度、current season、
 * 年度が設定されたseasonの先頭、最後に現在年を使用する。
 */
export function resolveStatsSeason(
  seasons: SeasonResponse[],
  seasonYear?: number,
  seasonKey?: string,
  currentYear = new Date().getFullYear()
): string {
  if (seasonKey === CAREER_SEASON) {
    return CAREER_SEASON;
  }

  return seasonYear != null
    ? String(seasonYear)
    : String(
        seasons.find((season) => season.isCurrent)?.year ??
          seasons.find((season) => season.year != null)?.year ??
          currentYear
      );
}

/**
 * APIの打撃成績・投手成績・rankingをStats画面の表示用データへ変換する。
 *
 * <p>rankingから取得した規定打席・規定投球回数を使って規定到達を判定し、
 * 通常rankingに閾値がない場合はqualified rankingの閾値を利用する。
 * nullableな数値は表示上0、名前と背番号はそれぞれplaceholderへ補完する。
 * 率は既存の表示形式へ変換し、seasonには解決済みの年度または`career`を保持する。
 */
export function createStatsData(
  battingResponse: BattingStatsResponse[],
  pitchingResponse: PitchingStatsResponse[],
  season: string,
  seasons: string[],
  rankings?: RankingResponse,
  qualifiedRankings?: RankingResponse
): StatsViewData {
  const battingQualificationThreshold =
    rankings?.requiredPlateAppearances ??
    qualifiedRankings?.requiredPlateAppearances ??
    null;
  const pitchingQualificationThresholdOuts =
    rankings?.requiredInningsPitchedOuts ??
    qualifiedRankings?.requiredInningsPitchedOuts ??
    null;
  const pitchingQualificationThresholdText =
    rankings?.requiredInningsPitchedText ??
    qualifiedRankings?.requiredInningsPitchedText ??
    null;
  const batting = battingResponse.map((stat, index) => ({
    playerId: stat.playerId ?? index,
    rank: index + 1,
    uniformNumber: stat.uniformNumber ?? '—',
    playerName: stat.displayName ?? '名前未登録',
    profileImageUrl: stat.profileImageUrl,
    position: undefined,
    battingAverage: formatRate(stat.battingAverage),
    games: stat.games ?? 0,
    plateAppearances: stat.plateAppearances ?? 0,
    atBats: stat.atBats ?? 0,
    hits: stat.hits ?? 0,
    homeRuns: stat.homeRuns ?? 0,
    runsBattedIn: stat.runsBattedIn ?? 0,
    runs: stat.runs ?? 0,
    stolenBases: stat.stolenBases ?? 0,
    onBasePercentage: formatRate(stat.onBasePercentage),
    sluggingPercentage: formatRate(stat.sluggingPercentage),
    ops: formatRate(stat.ops),
    isQualified:
      battingQualificationThreshold != null &&
      battingQualificationThreshold > 0 &&
      (stat.plateAppearances ?? 0) >= battingQualificationThreshold,
  }));

  const pitching = pitchingResponse.map((stat, index) => ({
    playerId: stat.playerId ?? index,
    rank: index + 1,
    uniformNumber: stat.uniformNumber ?? '—',
    playerName: stat.displayName ?? '名前未登録',
    profileImageUrl: stat.profileImageUrl,
    era: formatRate(stat.earnedRunAverage),
    games: stat.games ?? 0,
    wins: stat.wins ?? 0,
    losses: stat.losses ?? 0,
    saves: stat.saves ?? 0,
    outsPitched: stat.outsPitched ?? 0,
    inningsPitched: stat.inningsPitchedText ?? '0回',
    strikeouts: stat.strikeouts ?? 0,
    walks: stat.walks ?? 0,
    whip: formatRate(stat.walksAndHitsPerInningPitched),
    hitsAllowed: stat.hitsAllowed ?? 0,
    runsAllowed: stat.runsAllowed ?? 0,
    earnedRuns: stat.earnedRuns ?? 0,
    isQualified:
      pitchingQualificationThresholdOuts != null &&
      pitchingQualificationThresholdOuts > 0 &&
      (stat.outsPitched ?? 0) >= pitchingQualificationThresholdOuts,
  }));

  return {
    season,
    seasons,
    battingQualificationThreshold,
    pitchingQualificationThresholdOuts,
    pitchingQualificationThresholdText,
    battingSummary: createBattingSummary(battingResponse),
    pitchingSummary: createPitchingSummary(pitchingResponse),
    battingLeaders: createBattingLeaders(batting),
    pitchingLeaders: createPitchingLeaders(pitching),
    rankings: {
      all: rankings,
      qualified: qualifiedRankings,
    },
    batting,
    pitching,
  };
}

function createBattingSummary(stats: BattingStatsResponse[]) {
  type BattingTotals = {
    atBats: number;
    hits: number;
    homeRuns: number;
    runs: number;
    onBaseNumerator: number;
    onBaseDenominator: number;
  };

  const totals = stats.reduce<BattingTotals>(
    (result, stat) => ({
      atBats: result.atBats + (stat.atBats ?? 0),
      hits: result.hits + (stat.hits ?? 0),
      homeRuns: result.homeRuns + (stat.homeRuns ?? 0),
      runs: result.runs + (stat.runs ?? 0),
      onBaseNumerator:
        result.onBaseNumerator +
        (stat.hits ?? 0) +
        (stat.walks ?? 0) +
        (stat.hitByPitch ?? 0),
      onBaseDenominator:
        result.onBaseDenominator +
        (stat.atBats ?? 0) +
        (stat.walks ?? 0) +
        (stat.hitByPitch ?? 0) +
        (stat.sacrificeFlies ?? 0),
    }),
    {
      atBats: 0,
      hits: 0,
      homeRuns: 0,
      runs: 0,
      onBaseNumerator: 0,
      onBaseDenominator: 0,
    }
  );

  return [
    {
      label: 'チーム打率',
      value: formatRate(rate(totals.hits, totals.atBats)),
      comparison: '',
      icon: 'average' as const,
    },
    {
      label: 'チーム本塁打',
      value: String(totals.homeRuns),
      unit: '本',
      comparison: '',
      icon: 'home-run' as const,
    },
    {
      label: 'チーム得点',
      value: String(totals.runs),
      unit: '点',
      comparison: '',
      icon: 'runs' as const,
    },
    {
      label: 'チーム出塁率',
      value: formatRate(rate(totals.onBaseNumerator, totals.onBaseDenominator)),
      comparison: '',
      icon: 'on-base' as const,
    },
  ];
}

function createPitchingSummary(stats: PitchingStatsResponse[]) {
  type PitchingTotals = {
    outsPitched: number;
    earnedRuns: number;
    wins: number;
    strikeouts: number;
    walks: number;
    hitsAllowed: number;
  };

  const totals = stats.reduce<PitchingTotals>(
    (result, stat) => ({
      outsPitched: result.outsPitched + (stat.outsPitched ?? 0),
      earnedRuns: result.earnedRuns + (stat.earnedRuns ?? 0),
      wins: result.wins + (stat.wins ?? 0),
      strikeouts: result.strikeouts + (stat.strikeouts ?? 0),
      walks: result.walks + (stat.walks ?? 0),
      hitsAllowed: result.hitsAllowed + (stat.hitsAllowed ?? 0),
    }),
    {
      outsPitched: 0,
      earnedRuns: 0,
      wins: 0,
      strikeouts: 0,
      walks: 0,
      hitsAllowed: 0,
    }
  );

  return [
    {
      label: 'チーム防御率',
      value: formatRate(rate(totals.earnedRuns * 21, totals.outsPitched)),
      comparison: '',
      icon: 'era' as const,
    },
    {
      label: 'チーム勝利数',
      value: String(totals.wins),
      unit: '勝',
      comparison: '',
      icon: 'wins' as const,
    },
    {
      label: 'チーム奪三振',
      value: String(totals.strikeouts),
      unit: '個',
      comparison: '',
      icon: 'strikeouts' as const,
    },
    {
      label: 'チームWHIP',
      value: formatRate(
        rate((totals.walks + totals.hitsAllowed) * 3, totals.outsPitched)
      ),
      comparison: '',
      icon: 'whip' as const,
    },
  ];
}

function rate(numerator: number, denominator: number) {
  return denominator === 0 ? '0.000' : (numerator / denominator).toFixed(3);
}
