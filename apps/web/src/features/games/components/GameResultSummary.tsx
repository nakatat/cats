import { ChevronRight } from 'lucide-react';

import { Box } from '@/components/system/Box';
import { cn } from '@/lib/design/utils';

import type { InningScoreRow, InningScoreStatus } from './game-detail.types';
import { GameInfo } from './GameInfo';
import { GameScoreSection } from './GameScoreSection';

/**
 * 試合情報・対戦・必要に応じたscoreboardをまとめて表示するProps。
 *
 * showScoreboardとshowDetailActionは表示場所に応じて独立して指定し、layoutは一覧表示時の配置を切り替える。
 */
type GameResultSummaryProps = {
  gameDate?: string | null;
  tournamentName?: string | null;
  stadiumName?: string | null;
  venueName?: string | null;
  homeTeamName: string;
  awayTeamName: string;
  homeLogoUrl?: string | null;
  awayLogoUrl?: string | null;
  homeScore?: number | null;
  awayScore?: number | null;
  inningScores?: InningScoreRow[];
  inningScoreStatus?: InningScoreStatus;
  /** scoreboard APIの取得に失敗した場合にエラー表示へ切り替える。 */
  inningScoreError?: boolean;
  /** trueの場合、対戦の下にイニングスコア表を表示する。 */
  showScoreboard?: boolean;
  /** trueの場合、詳細ページへの導線を表示する。 */
  showDetailAction?: boolean;
  /** `list`では試合一覧向けの横配置、`stack`では縦配置にする。 */
  layout?: 'stack' | 'list';
  className?: string;
};

export function GameResultSummary({
  gameDate,
  tournamentName,
  stadiumName,
  venueName,
  homeTeamName,
  awayTeamName,
  homeLogoUrl,
  awayLogoUrl,
  homeScore,
  awayScore,
  inningScores,
  inningScoreStatus,
  inningScoreError,
  showScoreboard = false,
  showDetailAction = false,
  layout = 'stack',
  className,
}: Readonly<GameResultSummaryProps>) {
  const isListLayout = layout === 'list';

  return (
    <Box
      display="flex"
      direction="column"
      className={cn(isListLayout && 'lg:contents', className)}
    >
      <Box
        display="flex"
        direction="column"
        gap="lg"
        className={isListLayout ? 'lg:contents' : undefined}
      >
        <GameInfo
          variant="compact"
          gameDate={gameDate}
          tournamentName={tournamentName}
          stadiumName={stadiumName}
          venueName={venueName}
        />
        <GameScoreSection
          variant="compact"
          showScoreboard={showScoreboard}
          homeTeamName={homeTeamName}
          awayTeamName={awayTeamName}
          homeLogoUrl={homeLogoUrl}
          awayLogoUrl={awayLogoUrl}
          homeScore={homeScore}
          awayScore={awayScore}
          inningScores={inningScores}
          inningScoreStatus={inningScoreStatus}
          inningScoreError={inningScoreError}
        />
      </Box>
      {showDetailAction ? (
        <Box
          className={
            isListLayout
              ? 'text-primary border-border/70 mt-2 flex items-center justify-end gap-1 border-t pt-2 text-sm font-semibold whitespace-nowrap lg:mt-0 lg:border-0 lg:pt-0'
              : 'border-border/70 text-primary group-hover:bg-muted/30 -mx-3 -mb-3 flex w-auto items-center justify-end gap-1 border-t px-5 py-3 text-sm font-medium transition-colors sm:-mx-6 sm:-mb-4 sm:px-6'
          }
        >
          詳細を見る
          <ChevronRight aria-hidden="true" className="size-4" />
        </Box>
      ) : null}
    </Box>
  );
}
