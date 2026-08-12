import { Box } from '@/components/system/Box';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { PlayerResponse } from '@/lib/api/players';

import { PlayerListItem } from './PlayerListItem';

type PlayerTableProps = {
  players: PlayerResponse[];
  hasPitchInfo: boolean;
  hasJoinedAt: boolean;
  returnQuery?: string;
};

export function PlayerTable({
  players,
  hasPitchInfo,
  hasJoinedAt,
  returnQuery,
}: Readonly<PlayerTableProps>) {
  return (
    <Box className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="border-primary bg-primary hover:bg-primary [&>th:first-child]:rounded-tl-md [&>th:last-child]:rounded-tr-md">
            <TableHead
              scope="col"
              className="text-primary-foreground w-20 text-center"
            >
              背番号
            </TableHead>
            <TableHead scope="col" className="text-primary-foreground">
              選手名
            </TableHead>
            <TableHead scope="col" className="text-primary-foreground">
              ポジション
            </TableHead>
            {hasPitchInfo && (
              <TableHead scope="col" className="text-primary-foreground">
                投打
              </TableHead>
            )}
            {hasJoinedAt && (
              <TableHead scope="col" className="text-primary-foreground">
                加入年
              </TableHead>
            )}
            <TableHead scope="col" className="text-primary-foreground">
              在籍状況
            </TableHead>
            <TableHead scope="col" aria-label="詳細" className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player) => (
            <PlayerListItem
              key={player.playerId ?? `${player.name}-${player.uniformNumber}`}
              player={player}
              hasPitchInfo={hasPitchInfo}
              hasJoinedAt={hasJoinedAt}
              returnQuery={returnQuery}
            />
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
