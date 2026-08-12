import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';
import type { ApiResult } from '@/lib/api/client';
import type {
  GameResponse,
  SeasonResponse,
  TournamentResponse,
} from '@/lib/api/games';

import { GameList } from './components/GameList';

/**
 * 試合一覧で利用する複数APIの取得結果。
 *
 * 試合一覧は必須だが、season・tournamentの取得に失敗した場合は
 * 試合データから作成できる選択肢へfallbackする。
 */
type GamesPageDataProps = {
  /** 試合一覧本体。失敗時は一覧のエラー表示に切り替える。 */
  gamesResult: ApiResult<GameResponse[]>;
  /** 年度選択肢の元データ。失敗時は試合データから補完する。 */
  seasonsResult: ApiResult<SeasonResponse[]>;
  /** 大会選択肢の元データ。失敗時は試合データから補完する。 */
  tournamentsResult: ApiResult<TournamentResponse[]>;
  /** 初期URLから復元したfilter・sort・page query。 */
  initialFilterQuery?: string;
};

export function GamesPageData({
  gamesResult,
  seasonsResult,
  tournamentsResult,
  initialFilterQuery,
}: Readonly<GamesPageDataProps>) {
  if (!gamesResult.ok) {
    return (
      <Box
        surface="default"
        display="flex"
        direction="column"
        gap="md"
        className="p-6"
      >
        <Typography as="h2" variant="headingMd">
          試合情報を取得できませんでした
        </Typography>
        <Typography as="p" variant="bodySm" tone="muted">
          時間をおいて再度お試しください。
        </Typography>
      </Box>
    );
  }

  return (
    <GameList
      games={gamesResult.data}
      seasons={seasonsResult.ok ? seasonsResult.data : undefined}
      tournaments={tournamentsResult.ok ? tournamentsResult.data : undefined}
      initialFilterQuery={initialFilterQuery}
    />
  );
}
