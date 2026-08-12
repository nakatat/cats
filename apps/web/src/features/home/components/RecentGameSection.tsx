import Link from 'next/link';
import { CalendarDays } from 'lucide-react';

import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';
import { Card, CardContent } from '@/components/ui/card';
import type {
  InningScoreRow,
  InningScoreStatus,
} from '@/features/games/components/game-detail.types';
import { GameResultSummary } from '@/features/games/components/GameResultSummary';
import type { SummaryGameResponse } from '@/lib/api/responses';

/**
 * トップページの最近の試合表示Props。
 *
 * gameがない場合は空状態を表示し、scoreboardの取得失敗は試合基本情報と分けて表示する。
 */
interface RecentGameSectionProps {
  game: SummaryGameResponse | null | undefined;
  inningScores?: InningScoreRow[];
  inningScoreStatus?: InningScoreStatus;
  /** scoreboard APIの取得に失敗した場合にエラー表示へ切り替える。 */
  inningScoreError?: boolean;
}

export function RecentGameSection({
  game,
  inningScores = [],
  inningScoreStatus,
  inningScoreError = false,
}: Readonly<RecentGameSectionProps>) {
  const detailHref = game?.gameId != null ? `/games/${game.gameId}` : null;
  const card = (
    <Card className="border-border/70 bg-card gap-0 overflow-hidden rounded-xl py-0 shadow-[0_14px_32px_rgba(17,24,39,0.05)]">
      <Box
        display="flex"
        align="center"
        gap="sm"
        className="border-border/70 group-hover:bg-muted/30 border-b px-5 py-4 transition-colors sm:px-6"
      >
        <CalendarDays aria-hidden="true" className="text-primary size-6" />
        <Typography as="h2" variant="headingMd">
          最近の試合結果
        </Typography>
      </Box>

      {game ? (
        <>
          <GameResultSummary
            gameDate={game.gameDate}
            tournamentName={game.tournamentName}
            stadiumName={game.stadiumName}
            venueName={game.venueName}
            homeTeamName="新琴似CATS"
            awayTeamName={game.opponentName ?? '対戦相手未定'}
            homeLogoUrl="/brand/cats-logo-mark.png"
            homeScore={game.runsFor}
            awayScore={game.runsAgainst}
            inningScores={inningScores}
            inningScoreStatus={inningScoreStatus}
            inningScoreError={inningScoreError}
            showScoreboard
            showDetailAction={game.gameId != null}
            className="px-3 py-3 sm:px-6 sm:py-4"
          />
        </>
      ) : (
        <CardContent className="p-4 sm:p-6">
          <Typography as="p" variant="bodySm" className="leading-7">
            まだ試合結果がありません。試合が入ると、ここに最新の結果が表示されます。
          </Typography>
        </CardContent>
      )}
    </Card>
  );

  return (
    <Box as="section" id="recent-games">
      {detailHref ? (
        <Link
          href={detailHref}
          className="focus-visible:ring-ring group block rounded-xl focus-visible:ring-3 focus-visible:outline-none"
        >
          {card}
        </Link>
      ) : (
        card
      )}
    </Box>
  );
}
