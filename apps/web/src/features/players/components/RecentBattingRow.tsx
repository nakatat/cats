import { TableCell, TableRow } from '@/components/ui/table';
import { formatGameResult } from '@/lib/formatters';

import type { PlayerRecentGame } from './player-detail.types';
import {
  calculateBattingAverage,
  calculateOnBasePercentage,
  calculateOps,
  calculateSluggingPercentage,
} from './player-recent-games-calculations';
import { PlayerRecentGameDateCell } from './PlayerRecentGameDateCell';
import { PlayerRecentGameNumberCell } from './PlayerRecentGameNumberCell';
import { PlayerRecentGameOpponentCell } from './PlayerRecentGameOpponentCell';
import { PlayerRecentGameRateCell } from './PlayerRecentGameRateCell';
import { PlayerRecentGameScoreCell } from './PlayerRecentGameScoreCell';
import { usePlayerRecentGameRow } from './usePlayerRecentGameRow';

export function RecentBattingRow({
  item,
}: Readonly<{ item: PlayerRecentGame }>) {
  const line = item.battingLine;
  const rowProps = usePlayerRecentGameRow(item);

  return (
    <TableRow {...rowProps}>
      <PlayerRecentGameDateCell item={item} />
      <PlayerRecentGameOpponentCell item={item} />
      <PlayerRecentGameScoreCell item={item} />
      <TableCell>{formatGameResult(item.game.result)}</TableCell>
      <PlayerRecentGameNumberCell value={line ? 1 : undefined} />
      <PlayerRecentGameNumberCell value={line?.plateAppearances} />
      <PlayerRecentGameNumberCell value={line?.atBats} />
      <PlayerRecentGameNumberCell value={line?.hits} />
      <PlayerRecentGameNumberCell value={line?.homeRuns} />
      <PlayerRecentGameNumberCell value={line?.runsBattedIn} />
      <PlayerRecentGameNumberCell value={line?.runs} />
      <PlayerRecentGameNumberCell value={line?.stolenBases} />
      <PlayerRecentGameRateCell
        value={line ? calculateBattingAverage(line) : undefined}
      />
      <PlayerRecentGameRateCell
        value={line ? calculateOnBasePercentage(line) : undefined}
      />
      <PlayerRecentGameRateCell
        value={line ? calculateSluggingPercentage(line) : undefined}
      />
      <PlayerRecentGameRateCell value={line ? calculateOps(line) : undefined} />
    </TableRow>
  );
}
