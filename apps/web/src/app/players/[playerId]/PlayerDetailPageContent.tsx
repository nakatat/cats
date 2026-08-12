import type {
  PlayerRecentGame,
  PlayerSeasonStats,
} from '@/features/players/components/player-detail.types';
import { PlayerDetailPage } from '@/features/players/PlayerDetailPage';
import type { GameResponse, SeasonResponse } from '@/lib/api/games';
import {
  getBattingLines,
  getGames,
  getPitchingLines,
  getSeasons,
} from '@/lib/api/games';
import {
  getBattingStats,
  getPitchingStats,
  getPlayer,
  getPlayers,
} from '@/lib/api/players';
import { env } from '@/lib/env';
import {
  type PageSearchParams,
  pickListQuery,
  PLAYER_LIST_FILTER_KEYS,
} from '@/lib/list-query';

export async function PlayerDetailPageContent({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ playerId: string }>;
  searchParams: Promise<PageSearchParams>;
}>) {
  const { playerId: playerIdParam } = await params;
  const listQuery = pickListQuery(await searchParams, PLAYER_LIST_FILTER_KEYS);
  const playerId = Number(playerIdParam);

  if (!Number.isInteger(playerId)) {
    return (
      <PlayerDetailPage
        playerResult={{
          ok: false,
          status: 400,
          error: {
            code: 'INVALID_PLAYER_ID',
            message: '選手IDが不正です。',
            details: [],
          },
        }}
        listQuery={listQuery}
      />
    );
  }

  const [
    playerResult,
    playersResult,
    battingResult,
    pitchingResult,
    gamesResult,
    seasonsResult,
  ] = await Promise.all([
    getPlayer(env.DEFAULT_TEAM_SLUG, playerId),
    getPlayers(env.DEFAULT_TEAM_SLUG),
    getBattingStats(env.DEFAULT_TEAM_SLUG),
    getPitchingStats(env.DEFAULT_TEAM_SLUG),
    getGames(env.DEFAULT_TEAM_SLUG),
    getSeasons(env.DEFAULT_TEAM_SLUG),
  ]);

  if (!playerResult.ok) {
    return (
      <PlayerDetailPage playerResult={playerResult} listQuery={listQuery} />
    );
  }

  const players = playersResult.ok ? playersResult.data : [];
  const currentIndex = players.findIndex(
    (player) => player.playerId === playerId
  );
  const careerSeasons = seasonsResult.ok
    ? await getPlayerSeasonStats(
        env.DEFAULT_TEAM_SLUG,
        playerId,
        seasonsResult.data
      )
    : [];

  return (
    <PlayerDetailPage
      playerResult={playerResult}
      battingResult={battingResult}
      pitchingResult={pitchingResult}
      careerSeasons={careerSeasons}
      recentGames={
        gamesResult.ok
          ? await getRecentGames(
              env.DEFAULT_TEAM_SLUG,
              playerId,
              gamesResult.data
            )
          : []
      }
      previousPlayer={currentIndex > 0 ? players[currentIndex - 1] : undefined}
      nextPlayer={
        currentIndex >= 0 && currentIndex < players.length - 1
          ? players[currentIndex + 1]
          : undefined
      }
      listQuery={listQuery}
    />
  );
}

async function getPlayerSeasonStats(
  teamSlug: string,
  playerId: number,
  seasons: SeasonResponse[]
): Promise<PlayerSeasonStats[]> {
  const seasonStats: Array<PlayerSeasonStats | undefined> = await Promise.all(
    seasons
      .filter(
        (season): season is SeasonResponse & { year: number } =>
          season.year != null
      )
      .sort((left, right) => right.year - left.year)
      .map(async (season) => {
        const [battingResult, pitchingResult] = await Promise.all([
          getBattingStats(teamSlug, { seasonYear: season.year }),
          getPitchingStats(teamSlug, { seasonYear: season.year }),
        ]);

        const batting = battingResult.ok
          ? battingResult.data.find((item) => item.playerId === playerId)
          : undefined;
        const pitching = pitchingResult.ok
          ? pitchingResult.data.find((item) => item.playerId === playerId)
          : undefined;

        if (!batting && !pitching) {
          return undefined;
        }

        return { year: season.year, batting, pitching };
      })
  );

  return seasonStats.filter((item): item is PlayerSeasonStats => item != null);
}

async function getRecentGames(
  teamSlug: string,
  playerId: number,
  games: GameResponse[]
): Promise<PlayerRecentGame[]> {
  const candidates = games
    .filter((game) => game.gameId != null)
    .sort((left, right) =>
      (right.gameDate ?? '').localeCompare(left.gameDate ?? '')
    )
    .slice(0, 10);

  const recentGames: Array<PlayerRecentGame | undefined> = await Promise.all(
    candidates.map(async (game): Promise<PlayerRecentGame | undefined> => {
      const [battingResult, pitchingResult] = await Promise.all([
        getBattingLines(teamSlug, game.gameId!),
        getPitchingLines(teamSlug, game.gameId!),
      ]);
      const battingLine = battingResult.ok
        ? battingResult.data.find((line) => line.playerId === playerId)
        : undefined;
      const pitchingLine = pitchingResult.ok
        ? pitchingResult.data.find((line) => line.playerId === playerId)
        : undefined;

      if (!battingLine && !pitchingLine) {
        return undefined;
      }

      const recentGame: PlayerRecentGame = { game };

      if (battingLine) {
        recentGame.battingLine = battingLine;
      }
      if (pitchingLine) {
        recentGame.pitchingLine = pitchingLine;
      }

      return recentGame;
    })
  );

  return recentGames
    .filter((item): item is PlayerRecentGame => item != null)
    .slice(0, 5);
}
