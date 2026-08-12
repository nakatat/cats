import type { ApiResult } from '@/lib/api/client';
import type {
  GameResponse,
  SeasonResponse,
  TournamentResponse,
} from '@/lib/api/games';

import { GamesPageData } from './GamesPageData';
import { GamesPageLayout } from './GamesPageLayout';

type GamesPageProps = {
  gamesResult: ApiResult<GameResponse[]>;
  seasonsResult: ApiResult<SeasonResponse[]>;
  tournamentsResult: ApiResult<TournamentResponse[]>;
};

export function GamesPage({
  gamesResult,
  seasonsResult,
  tournamentsResult,
}: Readonly<GamesPageProps>) {
  return (
    <GamesPageLayout>
      <GamesPageData
        gamesResult={gamesResult}
        seasonsResult={seasonsResult}
        tournamentsResult={tournamentsResult}
      />
    </GamesPageLayout>
  );
}
