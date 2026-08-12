import { GameDetailPage } from '@/features/games/GameDetailPage';
import {
  getBattingLines,
  getGame,
  getGames,
  getPitchingLines,
  getScoreboard,
} from '@/lib/api/games';
import { env } from '@/lib/env';
import {
  GAME_LIST_FILTER_KEYS,
  type PageSearchParams,
  pickListQuery,
} from '@/lib/list-query';

export async function GameDetailPageContent({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ gameId: string }>;
  searchParams: Promise<PageSearchParams>;
}>) {
  const { gameId: gameIdParam } = await params;
  const listQuery = pickListQuery(await searchParams, GAME_LIST_FILTER_KEYS);
  const gameId = Number(gameIdParam);

  if (!Number.isInteger(gameId)) {
    return (
      <GameDetailPage
        gameResult={{
          ok: false,
          status: 400,
          error: {
            code: 'INVALID_GAME_ID',
            message: '試合IDが不正です。',
            details: [],
          },
        }}
        battingResult={{ ok: true, status: 200, data: [] }}
        pitchingResult={{ ok: true, status: 200, data: [] }}
        scoreboardResult={{
          ok: false,
          status: 400,
          error: {
            code: 'INVALID_GAME_ID',
            message: '試合IDが不正です。',
            details: [],
          },
        }}
        listQuery={listQuery}
      />
    );
  }

  const [
    gameResult,
    battingResult,
    pitchingResult,
    scoreboardResult,
    gamesResult,
  ] = await Promise.all([
    getGame(env.DEFAULT_TEAM_SLUG, gameId),
    getBattingLines(env.DEFAULT_TEAM_SLUG, gameId),
    getPitchingLines(env.DEFAULT_TEAM_SLUG, gameId),
    getScoreboard(env.DEFAULT_TEAM_SLUG, gameId),
    getGames(env.DEFAULT_TEAM_SLUG),
  ]);

  const neighboringGames = gamesResult.ok
    ? gamesResult.data
        .filter((game) => game.gameId !== gameId)
        .sort((left, right) =>
          (left.gameDate ?? '').localeCompare(right.gameDate ?? '')
        )
    : [];
  const currentIndex = gameResult.ok
    ? neighboringGames.findIndex(
        (game) => (game.gameDate ?? '') > (gameResult.data.gameDate ?? '')
      )
    : -1;

  return (
    <GameDetailPage
      gameResult={gameResult}
      battingResult={battingResult}
      pitchingResult={pitchingResult}
      scoreboardResult={scoreboardResult}
      previousGame={
        currentIndex > 0
          ? neighboringGames[currentIndex - 1]
          : neighboringGames.at(-1)
      }
      nextGame={currentIndex >= 0 ? neighboringGames[currentIndex] : undefined}
      listQuery={listQuery}
    />
  );
}
