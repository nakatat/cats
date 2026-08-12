import type { ApiResult } from '@/lib/api/client';
import type { PlayerResponse } from '@/lib/api/players';

import { PlayersPageData } from './PlayersPageData';
import { PlayersPageLayout } from './PlayersPageLayout';

type PlayersPageProps = {
  playersResult: ApiResult<PlayerResponse[]>;
};

export function PlayersPage({ playersResult }: Readonly<PlayersPageProps>) {
  return (
    <PlayersPageLayout>
      <PlayersPageData playersResult={playersResult} />
    </PlayersPageLayout>
  );
}
