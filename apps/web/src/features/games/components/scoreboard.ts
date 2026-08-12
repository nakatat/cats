import type { ScoreboardResponse } from '@/lib/api/games';

import type { InningScoreRow } from './game-detail.types';

export function toInningScoreRows(
  scoreboard: ScoreboardResponse,
  opponentLogoUrl?: string | null
): InningScoreRow[] {
  const rows = scoreboard.rows ?? [];
  const maxInning = Math.max(
    ...rows.flatMap((row) =>
      (row.innings ?? []).map((inning) => inning.inningNumber ?? 0)
    ),
    0
  );

  return rows.map((row) => {
    const inningsByNumber = new Map(
      (row.innings ?? []).map((inning) => [inning.inningNumber, inning])
    );

    return {
      scoreLineId: row.scoreLineId,
      teamName: row.teamName ?? (row.opponent ? '対戦相手' : '新琴似CATS'),
      logoUrl: row.opponent ? opponentLogoUrl : '/brand/cats-logo-mark.png',
      innings: Array.from({ length: maxInning }, (_, index) => {
        const inning = inningsByNumber.get(index + 1);

        if (!inning) {
          return null;
        }
        if (inning.status === 'not_batted') {
          return '×';
        }

        return inning.runs ?? 0;
      }),
      runs: row.runs ?? 0,
      hits: row.hits ?? 0,
      errors: row.errors ?? 0,
    };
  });
}
