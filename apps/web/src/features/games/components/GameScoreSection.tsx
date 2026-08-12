import type { ReactNode } from 'react';

import { GameMatchup } from '@/components/layout/GameMatchup';
import { Box } from '@/components/system/Box';

import type { InningScoreRow, InningScoreStatus } from './game-detail.types';
import { InningScoreTable } from './InningScoreTable';

/**
 * 対戦表示とイニングスコア表を組み合わせるProps。
 *
 * showScoreboardがfalseの場合は対戦表示だけを返し、scoreboard取得エラーはerrorで明示する。
 */
type GameScoreSectionProps = {
  homeTeamName: string;
  awayTeamName: string;
  homeLogoUrl?: string | null;
  awayLogoUrl?: string | null;
  homeScore?: number | null;
  awayScore?: number | null;
  /** 1行目から順に表示するチーム別イニングスコア。 */
  inningScores?: InningScoreRow[];
  /** scoreboard APIの試合単位の登録状態。 */
  inningScoreStatus?: InningScoreStatus;
  /** scoreboard APIの取得に失敗した場合にエラー表示へ切り替える。 */
  inningScoreError?: boolean;
  details?: ReactNode;
  variant?: 'compact' | 'detail';
  /** falseの場合はイニングスコアを表示せず、対戦だけを表示する。 */
  showScoreboard?: boolean;
};

export function GameScoreSection({
  homeTeamName,
  awayTeamName,
  homeLogoUrl,
  awayLogoUrl,
  homeScore,
  awayScore,
  inningScores = [],
  inningScoreStatus,
  inningScoreError,
  details,
  variant = 'detail',
  showScoreboard = true,
}: Readonly<GameScoreSectionProps>) {
  const matchup = (
    <GameMatchup
      variant={variant}
      homeTeamName={homeTeamName}
      awayTeamName={awayTeamName}
      homeLogoUrl={homeLogoUrl}
      awayLogoUrl={awayLogoUrl}
      homeScore={homeScore}
      awayScore={awayScore}
    />
  );

  if (!showScoreboard) {
    return matchup;
  }

  return (
    <Box display="flex" direction="column" gap="xl">
      {matchup}

      <Box className="border-border/70 border-t" />

      <Box
        className={
          details
            ? 'grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-4'
            : undefined
        }
      >
        <InningScoreTable
          embedded
          rows={inningScores}
          status={inningScoreStatus}
          error={inningScoreError}
        />
        {details}
      </Box>
    </Box>
  );
}
