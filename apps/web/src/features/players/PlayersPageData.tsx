import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';
import type { ApiResult } from '@/lib/api/client';
import type { PlayerResponse } from '@/lib/api/players';

import { PlayerList } from './components/PlayerList';

/**
 * 選手一覧へ渡す取得結果と初期URL状態。
 *
 * playersResultが失敗した場合は一覧を描画せず、取得エラーを表示する。
 */
type PlayersPageDataProps = {
  /** 選手一覧本体。失敗時は一覧のエラー表示に切り替える。 */
  playersResult: ApiResult<PlayerResponse[]>;
  /** 初期URLから復元したfilter・sort・search・page query。 */
  initialFilterQuery?: string;
};

export function PlayersPageData({
  playersResult,
  initialFilterQuery,
}: Readonly<PlayersPageDataProps>) {
  if (!playersResult.ok) {
    return (
      <Box
        surface="default"
        display="flex"
        direction="column"
        gap="md"
        className="p-6"
      >
        <Typography as="h2" variant="headingMd">
          選手情報を取得できませんでした
        </Typography>
        <Typography as="p" variant="bodySm" tone="muted">
          時間をおいて再度お試しください。
        </Typography>
      </Box>
    );
  }

  return (
    <PlayerList
      players={playersResult.data}
      initialFilterQuery={initialFilterQuery}
    />
  );
}
