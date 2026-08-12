import Link from 'next/link';

import { Box } from '@/components/system/Box';
import { Card } from '@/components/ui/card';
import type { GameResponse } from '@/lib/api/games';
import { formatGameDateWithWeekday } from '@/lib/formatters';
import { withListQuery } from '@/lib/list-query';

import { GameResultSummary } from './GameResultSummary';

/**
 * 試合一覧の1行表示Props。
 *
 * returnQueryは詳細ページから一覧へ戻る際にfilterとpageを復元するために利用する。
 */
type GameListItemProps = {
  game: GameResponse;
  opponentLogoUrl?: string | null;
  /** 詳細ページへのリンクに引き継ぐ一覧query。 */
  returnQuery?: string;
};

type GameWithOptionalOpponentLogo = GameResponse & {
  opponentLogoUrl?: string | null;
};

export function GameListItem({
  game,
  opponentLogoUrl,
  returnQuery,
}: Readonly<GameListItemProps>) {
  const gameId = game.gameId ?? 0;
  const opponentName = game.opponentName?.trim() || '対戦相手未定';
  const logoUrl =
    opponentLogoUrl ?? (game as GameWithOptionalOpponentLogo).opponentLogoUrl;
  return (
    <Link
      href={withListQuery(`/games/${gameId}`, returnQuery)}
      aria-label={`${formatGameDateWithWeekday(game.gameDate)}の試合詳細を見る`}
      className="focus-visible:ring-ring group block rounded-xl focus-visible:ring-3 focus-visible:outline-none"
    >
      <Card
        size="default"
        className="border-border/75 bg-card group-hover:border-primary/40 gap-0 rounded-xl py-0 shadow-[0_8px_24px_rgba(17,24,39,0.04)] transition-colors"
      >
        <Box
          display="grid"
          align="center"
          className="grid-cols-1 gap-2 px-3 py-3 sm:px-6 lg:grid-cols-[minmax(200px,1fr)_minmax(360px,2fr)_minmax(200px,1fr)] lg:gap-4 lg:px-6 lg:py-4"
        >
          <GameResultSummary
            layout="list"
            gameDate={game.gameDate}
            tournamentName={game.tournamentName}
            stadiumName={game.stadiumName}
            venueName={game.venueName}
            homeTeamName="新琴似CATS"
            awayTeamName={opponentName}
            homeLogoUrl="/brand/cats-logo-mark.png"
            awayLogoUrl={logoUrl}
            homeScore={game.runsFor}
            awayScore={game.runsAgainst}
            showDetailAction
          />
        </Box>
      </Card>
    </Link>
  );
}
