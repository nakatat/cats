import { TableCell } from '@/components/ui/table';

import type { PlayerRecentGame } from './player-detail.types';

export function PlayerRecentGameOpponentCell({
  item,
}: Readonly<{ item: PlayerRecentGame }>) {
  return <TableCell>{item.game.opponentName || '対戦相手未定'}</TableCell>;
}
