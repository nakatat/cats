import type { RankingResponse } from '@/lib/api/rankings';
import { formatRate } from '@/lib/formatters';

import type {
  BattingStat,
  PitchingStat,
  StatLeader,
  StatLeaderPlayer,
} from './stats';

const battingLeaderDefinitions = [
  { category: 'battingAverage', metric: '打率' },
  { category: 'homeRuns', metric: '本塁打', unit: '本' },
  { category: 'runsBattedIn', metric: '打点', unit: '点' },
  { category: 'ops', metric: 'OPS' },
] as const;

const pitchingLeaderDefinitions = [
  { category: 'earnedRunAverage', metric: '防御率' },
  { category: 'wins', metric: '勝利', unit: '勝' },
  { category: 'strikeouts', metric: '奪三振', unit: '個' },
  { category: 'saves', metric: 'セーブ', unit: 'S' },
] as const;

/**
 * 表示用の打撃成績から各指標のleaderを作成する。
 *
 * <p>値が0以下または数値として扱えない指標はleaderに含めず、各指標の最大値を採用する。
 */
export function createBattingLeaders(stats: BattingStat[]): StatLeader[] {
  return [
    createLeader('打率', stats, (stat) => stat.battingAverage),
    createLeader('本塁打', stats, (stat) => stat.homeRuns, '本'),
    createLeader('打点', stats, (stat) => stat.runsBattedIn, '点'),
    createLeader('OPS', stats, (stat) => stat.ops),
  ].filter((leader): leader is StatLeader => leader != null);
}

/**
 * 表示用の投手成績から各指標のleaderを作成する。
 *
 * <p>値が0以下または数値として扱えない指標はleaderに含めず、通常指標は最大値、防御率は最小値を採用する。
 */
export function createPitchingLeaders(stats: PitchingStat[]): StatLeader[] {
  return [
    createLeader('防御率', stats, (stat) => stat.era, undefined, true),
    createLeader('勝利', stats, (stat) => stat.wins, '勝'),
    createLeader('奪三振', stats, (stat) => stat.strikeouts, '個'),
    createLeader('セーブ', stats, (stat) => stat.saves, 'S'),
  ].filter((leader): leader is StatLeader => leader != null);
}

/**
 * APIの打撃rankingからleader表示を作成する。
 *
 * <p>rankが1の選手は同率leaderとして全員を保持する。値が0のカテゴリは
 * 表示対象から除外し、APIの率表記を画面用の表記へ変換する。
 */
export function createBattingLeadersFromRanking(
  response?: RankingResponse
): StatLeader[] {
  return createLeadersFromRanking(response?.batting, battingLeaderDefinitions);
}

/**
 * APIの投手rankingからleader表示を作成する。
 *
 * <p>rankが1の選手は同率leaderとして全員を保持する。防御率以外の値が0のカテゴリは
 * 表示対象から除外し、APIの率表記を画面用の表記へ変換する。
 */
export function createPitchingLeadersFromRanking(
  response?: RankingResponse
): StatLeader[] {
  return createLeadersFromRanking(
    response?.pitching,
    pitchingLeaderDefinitions
  );
}

function createLeadersFromRanking(
  groups: RankingResponse['batting'] | RankingResponse['pitching'],
  definitions: ReadonlyArray<{
    category: string;
    metric: string;
    unit?: string;
  }>
): StatLeader[] {
  return definitions
    .map((definition): StatLeader | undefined => {
      const group = groups?.find(
        (candidate) => candidate.category === definition.category
      );
      const tiedLeaders =
        group?.leaders?.filter((candidate) => candidate.rank === 1) ?? [];
      const leader = tiedLeaders?.[0];

      if (
        leader?.playerId == null ||
        !leader.displayName ||
        leader.value == null ||
        leader.rawValue == null ||
        (definition.category !== 'earnedRunAverage' && leader.rawValue <= 0)
      ) {
        return undefined;
      }

      const players = tiedLeaders
        .filter(
          (
            candidate
          ): candidate is typeof candidate & {
            playerId: number;
            displayName: string;
          } => candidate.playerId != null && Boolean(candidate.displayName)
        )
        .map((candidate): StatLeaderPlayer => ({
          playerId: candidate.playerId,
          playerName: candidate.displayName,
          uniformNumber:
            candidate.uniformNumber != null
              ? String(candidate.uniformNumber)
              : undefined,
          profileImageUrl: candidate.profileImageUrl,
        }));

      return {
        metric: definition.metric,
        playerId: leader.playerId,
        playerName: leader.displayName,
        uniformNumber:
          leader.uniformNumber != null ? String(leader.uniformNumber) : '—',
        profileImageUrl: leader.profileImageUrl,
        value: formatRate(leader.value),
        unit: definition.unit,
        players,
      } satisfies StatLeader;
    })
    .filter((leader): leader is StatLeader => leader != null);
}

function createLeader<T extends BattingStat | PitchingStat>(
  metric: string,
  stats: T[],
  getValue: (stat: T) => number | string,
  unit?: string,
  ascending = false
): StatLeader | undefined {
  const leader = stats
    .map((stat) => ({ stat, value: Number(getValue(stat)) }))
    .filter(({ value }) => Number.isFinite(value) && value > 0)
    .sort((left, right) =>
      ascending ? left.value - right.value : right.value - left.value
    )[0];

  if (!leader) {
    return undefined;
  }

  return {
    metric,
    playerId: leader.stat.playerId,
    playerName: leader.stat.playerName,
    uniformNumber: leader.stat.uniformNumber,
    profileImageUrl: leader.stat.profileImageUrl,
    value: String(getValue(leader.stat)),
    unit,
  };
}
