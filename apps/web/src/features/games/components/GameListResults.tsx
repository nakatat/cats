import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';
import { Card } from '@/components/ui/card';
import { FilterResetButton } from '@/components/ui/filter-reset-button';
import { ListPagination } from '@/components/ui/list-pagination';
import type { GameResponse } from '@/lib/api/games';

import { GameListItem } from './GameListItem';

/**
 * filter・pagination適用後のGameList表示状態。
 *
 * gamesは全filtered結果、visibleGamesは現在ページに表示するsliceを表す。
 */
type GameListResultsProps = {
  games: GameResponse[];
  /** 現在ページに表示する試合だけを、gamesの順序で保持する。 */
  visibleGames: GameResponse[];
  /** 1始まりの現在ページ。 */
  currentPage: number;
  /** filter後の総ページ数。 */
  totalPages: number;
  /** filterを既定値へ戻す操作。 */
  onReset: () => void;
  /** リセット操作が必要かどうか。 */
  hasActiveFilters: boolean;
  /** ユーザーがページを選択したときに呼び出す。 */
  onPageChange: (page: number) => void;
  /** 詳細ページから一覧へ戻るために保持するfilter/page query。 */
  returnQuery: string;
};

export function GameListResults({
  games,
  visibleGames,
  currentPage,
  totalPages,
  onReset,
  hasActiveFilters,
  onPageChange,
  returnQuery,
}: Readonly<GameListResultsProps>) {
  return (
    <Box as="section" id="games" display="flex" direction="column" gap="lg">
      <Box display="flex" align="center" justify="between" gap="md">
        <Typography as="h2" variant="headingSm">
          全{games.length}試合
        </Typography>
        <FilterResetButton
          onReset={onReset}
          disabled={!hasActiveFilters}
          className="h-6 shrink-0 sm:hidden"
        />
      </Box>

      {visibleGames.length > 0 ? (
        <Box display="flex" direction="column" gap="sm">
          {visibleGames.map((game) => (
            <GameListItem
              key={game.gameId}
              game={game}
              returnQuery={returnQuery}
            />
          ))}
        </Box>
      ) : (
        <Card className="bg-card items-center justify-center gap-2 rounded-xl border-dashed px-6 py-14 text-center shadow-none">
          <Typography as="p" variant="headingSm">
            該当する試合がありません
          </Typography>
          <Typography as="p" variant="bodySm" tone="muted">
            条件を変更して、もう一度お試しください。
          </Typography>
        </Card>
      )}

      {games.length > 0 && (
        <ListPagination
          currentPage={currentPage}
          totalPages={totalPages}
          href="#games"
          onPageChange={onPageChange}
        />
      )}
    </Box>
  );
}
