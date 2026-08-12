import { TableCell } from '@/components/ui/table';
import { formatGameDate } from '@/lib/formatters';

import type { PlayerRecentGame } from './player-detail.types';

export function PlayerRecentGameDateCell({
  item,
}: Readonly<{ item: PlayerRecentGame }>) {
  return <TableCell>{formatGameDate(item.game.gameDate)}</TableCell>;
}
