import { TableCell, TableRow } from '@/components/ui/table';
import type { BattingStatsResponse } from '@/lib/api/players';

import { PlayerStatsNumberCell } from './PlayerStatsNumberCell';
import { PlayerStatsRateCell } from './PlayerStatsRateCell';

export function BattingCareerRow({
  label,
  stats,
  total = false,
}: Readonly<{
  label: string;
  stats: BattingStatsResponse;
  total?: boolean;
}>) {
  return (
    <TableRow className={total ? 'bg-muted/30 font-semibold' : undefined}>
      <TableCell>{label}</TableCell>
      <PlayerStatsNumberCell value={stats.games} />
      <PlayerStatsNumberCell value={stats.plateAppearances} />
      <PlayerStatsNumberCell value={stats.atBats} />
      <PlayerStatsNumberCell value={stats.hits} />
      <PlayerStatsNumberCell value={stats.homeRuns} />
      <PlayerStatsNumberCell value={stats.runsBattedIn} />
      <PlayerStatsNumberCell value={stats.runs} />
      <PlayerStatsNumberCell value={stats.stolenBases} />
      <PlayerStatsRateCell value={stats.battingAverage} />
      <PlayerStatsRateCell value={stats.onBasePercentage} />
      <PlayerStatsRateCell value={stats.sluggingPercentage} />
      <PlayerStatsRateCell value={stats.ops} />
    </TableRow>
  );
}
