import { TableCell } from '@/components/ui/table';
import { formatGameScore } from '@/lib/formatters';

import type { PlayerRecentGame } from './player-detail.types';

export function PlayerRecentGameScoreCell({
  item,
}: Readonly<{ item: PlayerRecentGame }>) {
  return (
    <TableCell className="tabular-nums">
      {formatGameScore(item.game.runsFor, item.game.runsAgainst)}
    </TableCell>
  );
}
