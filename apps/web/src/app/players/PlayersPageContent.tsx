import { PlayersPageData } from '@/features/players/PlayersPageData';
import { getPlayers } from '@/lib/api/players';
import { env } from '@/lib/env';
import {
  type PageSearchParams,
  pickListQuery,
  PLAYER_LIST_FILTER_KEYS,
} from '@/lib/list-query';

export async function PlayersPageContent({
  searchParams,
}: Readonly<{ searchParams: Promise<PageSearchParams> }>) {
  const params = await searchParams;
  const playersResult = await getPlayers(env.DEFAULT_TEAM_SLUG);

  return (
    <PlayersPageData
      playersResult={playersResult}
      initialFilterQuery={pickListQuery(params, PLAYER_LIST_FILTER_KEYS)}
    />
  );
}
