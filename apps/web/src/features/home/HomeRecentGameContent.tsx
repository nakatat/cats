import { toInningScoreRows } from '@/features/games/components/scoreboard';
import type { ApiResult } from '@/lib/api/client';
import { getScoreboard } from '@/lib/api/games';
import type { TeamSummaryResponse } from '@/lib/api/responses';
import { env } from '@/lib/env';

import { RecentGameSection } from './components/RecentGameSection';

export async function HomeRecentGameContent({
  summaryResult,
}: Readonly<{
  summaryResult: Promise<ApiResult<TeamSummaryResponse>>;
}>) {
  const result = await summaryResult;

  if (!result.ok) {
    return null;
  }

  const game = result.data.recentGames?.[0];
  const scoreboardResult =
    game?.gameId != null
      ? await getScoreboard(env.DEFAULT_TEAM_SLUG, game.gameId)
      : undefined;

  return (
    <RecentGameSection
      game={game}
      inningScores={
        scoreboardResult?.ok
          ? toInningScoreRows(scoreboardResult.data)
          : undefined
      }
      inningScoreStatus={
        scoreboardResult?.ok ? scoreboardResult.data.status : undefined
      }
      inningScoreError={scoreboardResult != null && !scoreboardResult.ok}
    />
  );
}
