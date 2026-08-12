import type {
  BattingStatsResponse,
  PitchingStatsResponse,
  PlayerResponse,
} from '@/lib/api/players';

import type { PlayerRecentGame } from './player-detail.types';

export const playerDetailPlayer: PlayerResponse = {
  playerId: 1,
  name: '田中 健太',
  kana: 'たなか けんた',
  uniformNumber: '10',
  primaryPosition: '投手',
  throwingHand: '右',
  battingHand: '右',
  joinedAt: '2018-04-01',
  leftAt: undefined,
  profileImageUrl: undefined,
  description: 'チームの中心選手として投打で活躍しています。',
};

export const playerWithImage: PlayerResponse = {
  ...playerDetailPlayer,
  profileImageUrl: '/brand/cats-logo-mark.png',
};

export const retiredPlayer: PlayerResponse = {
  ...playerDetailPlayer,
  playerId: 6,
  name: '斎藤 拓也',
  uniformNumber: '11',
  leftAt: '2024-03-31',
};

export const longNamePlayer: PlayerResponse = {
  ...playerDetailPlayer,
  name: 'とても長い選手名の表示確認サンプル 太郎',
  kana: 'とてもながいせんしゅめいのひょうじかくにんさんぷる たろう',
};

export const playerWithoutOptionalFields: PlayerResponse = {
  playerId: 99,
  name: '芳尾',
};

export const playerDetailBatting: BattingStatsResponse = {
  playerId: 1,
  displayName: '田中 健太',
  uniformNumber: '10',
  guest: false,
  games: 48,
  plateAppearances: 61,
  atBats: 53,
  hits: 14,
  doubles: 3,
  triples: 0,
  homeRuns: 8,
  runsBattedIn: 32,
  runs: 28,
  walks: 7,
  hitByPitch: 1,
  strikeouts: 11,
  sacrificeHits: 0,
  sacrificeFlies: 1,
  stolenBases: 6,
  caughtStealing: 1,
  reachedOnErrors: 2,
  battingAverage: '0.264',
  onBasePercentage: '0.361',
  sluggingPercentage: '0.811',
  ops: '1.172',
};

export const playerDetailPitching: PitchingStatsResponse = {
  playerId: 1,
  displayName: '田中 健太',
  uniformNumber: '10',
  guest: false,
  games: 36,
  outsPitched: 497,
  battersFaced: 688,
  pitches: 2200,
  hitsAllowed: 121,
  homeRunsAllowed: 4,
  runsAllowed: 49,
  earnedRuns: 35,
  walks: 37,
  hitBatters: 3,
  strikeouts: 142,
  wins: 18,
  losses: 8,
  saves: 3,
  holds: 0,
  inningsPitchedText: '165回2/3',
  earnedRunAverage: '1.901',
  walksAndHitsPerInningPitched: '0.953',
  strikeoutsPerSevenInnings: '5.985',
};

export const playerDetailCareerSeasons = [
  {
    year: 2025,
    batting: {
      ...playerDetailBatting,
      games: 12,
      hits: 4,
      atBats: 15,
      battingAverage: '0.267',
      onBasePercentage: '0.333',
      sluggingPercentage: '0.533',
      ops: '0.866',
    },
    pitching: {
      ...playerDetailPitching,
      games: 8,
      outsPitched: 72,
      inningsPitchedText: '24回',
      earnedRunAverage: '2.333',
      walksAndHitsPerInningPitched: '1.167',
      strikeoutsPerSevenInnings: '6.417',
    },
  },
  {
    year: 2024,
    batting: {
      ...playerDetailBatting,
      games: 10,
      hits: 3,
      atBats: 12,
      battingAverage: '0.250',
      onBasePercentage: '0.333',
      sluggingPercentage: '0.500',
      ops: '0.833',
    },
    pitching: {
      ...playerDetailPitching,
      games: 6,
      outsPitched: 54,
      inningsPitchedText: '18回',
      earnedRunAverage: '1.556',
      walksAndHitsPerInningPitched: '1.111',
      strikeoutsPerSevenInnings: '7.000',
    },
  },
];

export const playerBattingOnly: BattingStatsResponse = {
  ...playerDetailBatting,
  playerId: 2,
  displayName: '佐藤 翔太',
  uniformNumber: '1',
};

export const playerPitchingOnly: PitchingStatsResponse = {
  ...playerDetailPitching,
  playerId: 3,
  displayName: '鈴木 大輔',
  uniformNumber: '3',
};

const playerRecentBattingLine: NonNullable<PlayerRecentGame['battingLine']> = {
  battingLineId: 501,
  gameParticipantId: 501,
  gameId: 501,
  playerId: 1,
  displayName: '田中 健太',
  uniformNumber: '10',
  battingOrder: 4,
  position: '投手',
  guest: false,
  plateAppearances: 3,
  atBats: 3,
  hits: 0,
  runsBattedIn: 0,
  runs: 0,
  walks: 0,
  hitByPitch: 0,
  strikeouts: 1,
  stolenBases: 0,
  sacrificeHits: 0,
};

export const playerDetailRecentGames: PlayerRecentGame[] = [
  {
    game: {
      gameId: 501,
      gameDate: '2025-05-18',
      opponentName: 'ファルコンズ',
      runsFor: 2,
      runsAgainst: 4,
      result: 'loss',
      status: 'completed',
    },
    battingLine: playerRecentBattingLine,
    pitchingLine: {
      pitchingLineId: 501,
      gameParticipantId: 501,
      gameId: 501,
      playerId: 1,
      displayName: '田中 健太',
      uniformNumber: '10',
      pitchingOrder: 1,
      guest: false,
      outsPitched: 18,
      battersFaced: 24,
      pitches: 89,
      hitsAllowed: 6,
      runsAllowed: 4,
      earnedRuns: 3,
      walks: 2,
      hitByPitch: 0,
      strikeouts: 7,
      wins: 0,
      losses: 1,
      saves: 0,
      holds: 0,
    },
  },
  {
    game: {
      gameId: 502,
      gameDate: '2025-05-11',
      opponentName: 'イーグルス',
      runsFor: 5,
      runsAgainst: 1,
      result: 'win',
      status: 'completed',
    },
    battingLine: {
      ...playerRecentBattingLine,
      battingLineId: 502,
      gameParticipantId: 502,
      gameId: 502,
      atBats: 3,
      hits: 1,
      runsBattedIn: 1,
      runs: 1,
    },
  },
];
