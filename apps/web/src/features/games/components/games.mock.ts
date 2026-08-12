import type {
  GameResponse,
  SeasonResponse,
  TournamentResponse,
} from '@/lib/api/games';

export const gameListGames: GameResponse[] = [
  {
    gameId: 101,
    seasonYear: 2019,
    gameDate: '2019-10-06',
    tournamentId: 1,
    tournamentName: 'ルーキーリーグ',
    stadiumName: '手稲稲積公園野球場',
    opponentName: '手稲ガッツ',
    status: 'completed',
    result: 'win',
    runsFor: 5,
    runsAgainst: 2,
  },
  {
    gameId: 102,
    seasonYear: 2019,
    gameDate: '2019-09-29',
    tournamentId: 1,
    tournamentName: 'ルーキーリーグ',
    stadiumName: '麻生球場',
    opponentName: '北区ベースボールクラブ',
    status: 'completed',
    result: 'loss',
    runsFor: 1,
    runsAgainst: 4,
  },
  {
    gameId: 103,
    seasonYear: 2019,
    gameDate: '2019-09-22',
    tournamentId: 1,
    tournamentName: 'ルーキーリーグ',
    stadiumName: '篠路東公園野球場',
    opponentName: '屯田ファイターズ',
    status: 'completed',
    result: 'draw',
    runsFor: 3,
    runsAgainst: 3,
  },
  {
    gameId: 104,
    seasonYear: 2019,
    gameDate: '2019-09-15',
    tournamentId: 1,
    tournamentName: 'ルーキーリーグ',
    stadiumName: '月寒公園野球場',
    opponentName: '白石スネークス',
    status: 'completed',
    result: 'win',
    runsFor: 6,
    runsAgainst: 1,
  },
  {
    gameId: 105,
    seasonYear: 2019,
    gameDate: '2019-09-08',
    tournamentId: 1,
    tournamentName: 'ルーキーリーグ',
    stadiumName: '発寒河畔公園野球場',
    opponentName: '厚別レジェンド',
    status: 'completed',
    result: 'loss',
    runsFor: 2,
    runsAgainst: 7,
  },
];

export const gameListSeasons: SeasonResponse[] = [
  { id: 1, year: 2019, name: '2019年' },
  { id: 2, year: 2018, name: '2018年' },
];

export const gameListTournaments: TournamentResponse[] = [
  { tournamentId: 1, name: 'ルーキーリーグ' },
  { tournamentId: 2, name: '練習試合' },
];
