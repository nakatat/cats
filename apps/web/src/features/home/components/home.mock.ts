import type {
  SummaryGameResponse,
  SummaryRecordResponse,
  SummarySeasonResponse,
  SummaryTeamResponse,
  TeamSummaryResponse,
} from '@/lib/api/responses';

export const homeTeam: SummaryTeamResponse = {
  id: 1,
  slug: 'cats',
  name: '新琴似CATS',
  shortName: 'CATS',
  area: '北海道札幌市',
  foundedYear: 2005,
  description: '札幌市を拠点に活動する草野球チームです。',
  logoUrl: undefined,
  mainImageUrl: undefined,
};

export const homeSeason: SummarySeasonResponse = {
  id: 1,
  year: 2019,
  name: '2019年度',
  startDate: '2019-04-01',
  endDate: '2019-11-30',
  current: true,
};

export const homeRecord: SummaryRecordResponse = {
  games: 1,
  wins: 0,
  losses: 1,
  draws: 0,
  winningPercentage: '.000',
  runsFor: 0,
  runsAgainst: 3,
};

export const homeRecentGames: SummaryGameResponse[] = [
  {
    gameId: 101,
    gameDate: '2019-05-26',
    startTime: '10:30:00',
    opponentName: 'フルスイングス',
    status: 'completed',
    result: 'loss',
    runsFor: 0,
    runsAgainst: 3,
    tournamentId: 1,
    tournamentName: 'ルーキーリーグ',
    stadiumId: 1,
    stadiumName: '星置公園',
    venueName: '星置公園',
  },
  {
    gameId: 102,
    gameDate: '2019-05-19',
    startTime: '12:00:00',
    opponentName: 'サウスブレイズ',
    status: 'completed',
    result: 'win',
    runsFor: 5,
    runsAgainst: 2,
    tournamentId: 1,
    tournamentName: 'ルーキーリーグ',
    stadiumId: 2,
    stadiumName: '西岡公園',
    venueName: '西岡公園',
  },
];

export const homeUpcomingGames: SummaryGameResponse[] = [
  {
    gameId: 201,
    gameDate: '2019-06-22',
    startTime: '07:30:00',
    opponentName: '未定',
    status: 'scheduled',
    result: undefined,
    runsFor: undefined,
    runsAgainst: undefined,
    tournamentId: 2,
    tournamentName: 'BCリーグ',
    stadiumId: 3,
    stadiumName: 'もみじ台球場',
    venueName: 'もみじ台球場',
  },
];

export const homeSummary: TeamSummaryResponse = {
  team: homeTeam,
  season: homeSeason,
  record: homeRecord,
  recentGames: homeRecentGames,
  upcomingGames: homeUpcomingGames,
};
