import { TableCell, TableRow } from '@/components/ui/table';
import type { PitchingStatsResponse } from '@/lib/api/players';

import { PlayerStatsNumberCell } from './PlayerStatsNumberCell';
import { PlayerStatsRateCell } from './PlayerStatsRateCell';

export function PitchingCareerRow({
  label,
  stats,
  total = false,
}: Readonly<{
  label: string;
  stats: PitchingStatsResponse;
  total?: boolean;
}>) {
  return (
    <TableRow className={total ? 'bg-muted/30 font-semibold' : undefined}>
      <TableCell>{label}</TableCell>
      <PlayerStatsNumberCell value={stats.games} />
      <TableCell className="text-center tabular-nums">
        {stats.inningsPitchedText ?? '—'}
      </TableCell>
      <PlayerStatsNumberCell value={stats.wins} />
      <PlayerStatsNumberCell value={stats.losses} />
      <PlayerStatsNumberCell value={stats.saves} />
      <PlayerStatsNumberCell value={stats.strikeouts} />
      <PlayerStatsNumberCell value={stats.hitsAllowed} />
      <PlayerStatsNumberCell value={stats.runsAllowed} />
      <PlayerStatsNumberCell value={stats.earnedRuns} />
      <PlayerStatsRateCell value={stats.earnedRunAverage} />
      <PlayerStatsRateCell value={stats.walksAndHitsPerInningPitched} />
      <PlayerStatsRateCell value={stats.strikeoutsPerSevenInnings} />
    </TableRow>
  );
}
