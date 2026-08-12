import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FilterResetButton } from '@/components/ui/filter-reset-button';
import { ListPagination } from '@/components/ui/list-pagination';
import type { PlayerResponse } from '@/lib/api/players';

import { EmptyPlayers } from './EmptyPlayers';
import { FilteredEmptyPlayers } from './FilteredEmptyPlayers';
import { PlayerCard } from './PlayerCard';
import { PlayerTable } from './PlayerTable';

/**
 * filter・pagination適用後の選手一覧表示状態。
 *
 * playersは元データ、filteredPlayersはfilter後の全件、visiblePlayersは現在ページの表示対象を表す。
 */
type PlayerListResultsProps = {
  players: PlayerResponse[];
  filteredPlayers: PlayerResponse[];
  visiblePlayers: PlayerResponse[];
  /** 1件でも投打情報がある場合に、全行へ投打列を表示する。 */
  hasPitchInfo: boolean;
  /** 1件でも加入日がある場合に、全行へ加入年列を表示する。 */
  hasJoinedAt: boolean;
  /** filterを既定値へ戻す操作。 */
  onReset: () => void;
  /** リセット操作が必要かどうか。 */
  hasActiveFilters: boolean;
  /** 1始まりの現在ページ。 */
  currentPage: number;
  /** filter後の総ページ数。 */
  totalPages: number;
  /** ユーザーがページを選択したときに呼び出す。 */
  onPageChange: (page: number) => void;
  /** 詳細ページから一覧へ戻るために保持するfilter/page query。 */
  returnQuery: string;
};

export function PlayerListResults({
  players,
  filteredPlayers,
  visiblePlayers,
  hasPitchInfo,
  hasJoinedAt,
  onReset,
  hasActiveFilters,
  currentPage,
  totalPages,
  onPageChange,
  returnQuery,
}: Readonly<PlayerListResultsProps>) {
  if (players.length === 0) {
    return <EmptyPlayers />;
  }

  return (
    <>
      <Box
        display="flex"
        align="center"
        justify="between"
        gap="md"
        className="md:hidden"
      >
        <Typography as="h2" variant="headingSm">
          全{filteredPlayers.length}名
        </Typography>
        <FilterResetButton
          onReset={onReset}
          disabled={!hasActiveFilters}
          className="h-6 shrink-0 md:hidden"
        />
      </Box>

      {visiblePlayers.length === 0 ? (
        <FilteredEmptyPlayers />
      ) : (
        <>
          <Card className="hidden gap-0 rounded-xl py-0 shadow-[0_8px_24px_rgba(17,24,39,0.04)] md:flex">
            <CardHeader className="px-4 pt-4 pb-3 lg:px-5">
              <CardTitle className="text-sm font-bold">
                全{filteredPlayers.length}名
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 lg:px-5">
              <PlayerTable
                players={visiblePlayers}
                hasPitchInfo={hasPitchInfo}
                hasJoinedAt={hasJoinedAt}
                returnQuery={returnQuery}
              />
            </CardContent>
          </Card>

          <Box className="grid gap-3 md:hidden">
            {visiblePlayers.map((player) => (
              <PlayerCard
                key={
                  player.playerId ?? `${player.name}-${player.uniformNumber}`
                }
                player={player}
                hasPitchInfo={hasPitchInfo}
                hasJoinedAt={hasJoinedAt}
                returnQuery={returnQuery}
              />
            ))}
          </Box>

          <ListPagination
            currentPage={currentPage}
            totalPages={totalPages}
            href="#players"
            onPageChange={onPageChange}
          />
        </>
      )}
    </>
  );
}
