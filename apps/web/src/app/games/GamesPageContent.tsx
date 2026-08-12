import { GamesPageData } from '@/features/games/GamesPageData';
import { getGames, getSeasons, getTournaments } from '@/lib/api/games';
import { env } from '@/lib/env';
import {
  GAME_LIST_FILTER_KEYS,
  type PageSearchParams,
  pickListQuery,
} from '@/lib/list-query';

export async function GamesPageContent({
  searchParams,
}: Readonly<{ searchParams: Promise<PageSearchParams> }>) {
  const params = await searchParams;
  const [gamesResult, seasonsResult, tournamentsResult] = await Promise.all([
    getGames(env.DEFAULT_TEAM_SLUG),
    getSeasons(env.DEFAULT_TEAM_SLUG),
    getTournaments(env.DEFAULT_TEAM_SLUG),
  ]);

  return (
    <GamesPageData
      gamesResult={gamesResult}
      seasonsResult={seasonsResult}
      tournamentsResult={tournamentsResult}
      initialFilterQuery={pickListQuery(params, GAME_LIST_FILTER_KEYS)}
    />
  );
}
