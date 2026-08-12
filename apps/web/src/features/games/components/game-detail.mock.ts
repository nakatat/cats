import type {
  BattingLineResponse,
  GameResponse,
  PitchingLineResponse,
  ScoreboardResponse,
} from '@/lib/api/games';

import type { InningScoreRow } from './game-detail.types';

export const gameDetailGame: GameResponse = {
  gameId: 126,
  seasonYear: 2019,
  gameDate: '2019-05-26',
  tournamentId: 1,
  tournamentName: 'ルーキーリーグ',
  stadiumId: 2,
  stadiumName: '星置公園野球場',
  startTime: '09:00',
  opponentName: 'フルスイングス',
  homeAway: 'home',
  gameType: 'tournament',
  status: 'completed',
  runsFor: 0,
  runsAgainst: 3,
  result: 'loss',
  note: '9回コールド',
};

export const detailInningScores: InningScoreRow[] = [
  {
    teamName: '新琴似CATS',
    innings: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    runs: 0,
    hits: 2,
    errors: 1,
  },
  {
    teamName: 'フルスイングス',
    innings: [0, 0, 1, 1, 0, 1, 0, 0, '×'],
    runs: 3,
    hits: 6,
    errors: 0,
  },
];

export const detailScoreboard: ScoreboardResponse = {
  status: 'complete',
  rows: detailInningScores.map((row, rowIndex) => ({
    scoreLineId: rowIndex + 1,
    teamId: rowIndex === 0 ? 1 : undefined,
    teamName: row.teamName,
    opponent: rowIndex === 1,
    innings: row.innings.map((runs, inningIndex) => ({
      inningNumber: inningIndex + 1,
      runs: typeof runs === 'number' ? runs : undefined,
      status: runs === '×' ? 'not_batted' : 'played',
    })),
    runs: Number(row.runs),
    hits: Number(row.hits),
    errors: Number(row.errors),
  })),
};

const battingNames = [
  ['山田 太郎', '中'],
  ['佐藤 健介', '遊'],
  ['鈴木 大地', '右'],
  ['田中 翔太', '一'],
  ['伊藤 悠真', '左'],
  ['高橋 亮介', '三'],
  ['青木 拓', '捕'],
  ['小林 優斗', '二'],
  ['渡辺 大輔', '投'],
] as const;

const battingAtBats = [4, 4, 4, 4, 3, 3, 3, 2, 2];

export const detailBattingLines: BattingLineResponse[] = battingNames.map(
  ([displayName, position], index) => ({
    battingLineId: index + 1,
    gameParticipantId: index + 1,
    gameId: gameDetailGame.gameId,
    playerId: index + 1,
    displayName,
    battingOrder: index + 1,
    position,
    guest: false,
    plateAppearances:
      battingAtBats[index] + (index === 1 || index === 3 ? 1 : 0),
    atBats: battingAtBats[index],
    hits: index === 0 || index === 2 ? 1 : 0,
    runsBattedIn: 0,
    runs: 0,
    walks: index === 1 || index === 3 ? 1 : 0,
    hitByPitch: 0,
    strikeouts:
      index === 0 || index === 1 || index === 3 || index === 5 ? 1 : 0,
    stolenBases: index === 1 ? 1 : 0,
    sacrificeHits: 0,
  })
);

export const detailPitchingLines: PitchingLineResponse[] = [
  {
    pitchingLineId: 1,
    gameParticipantId: 9,
    gameId: gameDetailGame.gameId,
    playerId: 9,
    displayName: '渡辺 大輔',
    pitchingOrder: 1,
    guest: false,
    outsPitched: 18,
    battersFaced: 23,
    pitches: 82,
    hitsAllowed: 5,
    runsAllowed: 3,
    earnedRuns: 3,
    walks: 2,
    hitByPitch: 0,
    strikeouts: 4,
  },
  {
    pitchingLineId: 2,
    gameParticipantId: 8,
    gameId: gameDetailGame.gameId,
    playerId: 8,
    displayName: '小林 優斗',
    pitchingOrder: 2,
    guest: false,
    outsPitched: 6,
    battersFaced: 7,
    pitches: 24,
    hitsAllowed: 1,
    runsAllowed: 0,
    earnedRuns: 0,
    walks: 1,
    hitByPitch: 0,
    strikeouts: 1,
  },
];

export const extraInningScores: InningScoreRow[] = detailInningScores.map(
  (row) => ({
    ...row,
    innings: [...row.innings, 0],
  })
);

export const shortenedInningScores = detailInningScores.map((row) => ({
  ...row,
  innings: row.innings.slice(0, 7),
}));

export const previousGame: GameResponse = {
  gameId: 125,
  gameDate: '2019-05-19',
  opponentName: 'サウスブレイズ',
  runsFor: 4,
  runsAgainst: 2,
  status: 'completed',
  result: 'win',
};

export const nextGame: GameResponse = {
  gameId: 127,
  gameDate: '2019-06-22',
  opponentName: 'イーグルス',
  runsFor: 5,
  runsAgainst: 1,
  status: 'completed',
  result: 'win',
};
