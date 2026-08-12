import { TableCell, TableRow } from '@/components/ui/table';
import { formatGameResult } from '@/lib/formatters';

import type { PlayerRecentGame } from './player-detail.types';
import {
  calculatePitchingEarnedRunAverage,
  calculatePitchingStrikeoutsPerSeven,
  calculatePitchingWhip,
  formatRecentGameOuts,
} from './player-recent-games-calculations';
import { PlayerRecentGameDateCell } from './PlayerRecentGameDateCell';
import { PlayerRecentGameNumberCell } from './PlayerRecentGameNumberCell';
import { PlayerRecentGameOpponentCell } from './PlayerRecentGameOpponentCell';
import { PlayerRecentGameRateCell } from './PlayerRecentGameRateCell';
import { PlayerRecentGameScoreCell } from './PlayerRecentGameScoreCell';
import { usePlayerRecentGameRow } from './usePlayerRecentGameRow';

export function RecentPitchingRow({
  item,
}: Readonly<{ item: PlayerRecentGame }>) {
  const line = item.pitchingLine;
  const rowProps = usePlayerRecentGameRow(item);

  return (
    <TableRow {...rowProps}>
      <PlayerRecentGameDateCell item={item} />
      <PlayerRecentGameOpponentCell item={item} />
      <PlayerRecentGameScoreCell item={item} />
      <TableCell>{formatGameResult(item.game.result)}</TableCell>
      <PlayerRecentGameNumberCell value={line ? 1 : undefined} />
      <TableCell className="text-center tabular-nums">
        {formatRecentGameOuts(line?.outsPitched)}
      </TableCell>
      <PlayerRecentGameNumberCell value={line?.wins} />
      <PlayerRecentGameNumberCell value={line?.losses} />
      <PlayerRecentGameNumberCell value={line?.saves} />
      <PlayerRecentGameNumberCell value={line?.strikeouts} />
      <PlayerRecentGameNumberCell value={line?.hitsAllowed} />
      <PlayerRecentGameNumberCell value={line?.runsAllowed} />
      <PlayerRecentGameNumberCell value={line?.earnedRuns} />
      <PlayerRecentGameRateCell
        value={line ? calculatePitchingEarnedRunAverage(line) : undefined}
      />
      <PlayerRecentGameRateCell
        value={line ? calculatePitchingWhip(line) : undefined}
      />
      <PlayerRecentGameRateCell
        value={line ? calculatePitchingStrikeoutsPerSeven(line) : undefined}
      />
    </TableRow>
  );
}
