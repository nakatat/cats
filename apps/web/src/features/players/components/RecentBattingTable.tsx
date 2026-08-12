import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type { PlayerRecentGame } from './player-detail.types';
import { PlayerRecentStatsTableWrapper } from './PlayerRecentStatsTableWrapper';
import { RecentBattingRow } from './RecentBattingRow';

export function RecentBattingTable({
  games,
}: Readonly<{ games: PlayerRecentGame[] }>) {
  return (
    <PlayerRecentStatsTableWrapper>
      <Table className="min-w-0 text-xs sm:min-w-270 sm:text-sm">
        <TableHeader>
          <TableRow className="border-primary bg-primary hover:bg-primary [&>th]:text-primary-foreground [&>th:first-child]:rounded-tl-md [&>th:last-child]:rounded-tr-md">
            <TableHead>日付</TableHead>
            <TableHead>対戦相手</TableHead>
            <TableHead>スコア</TableHead>
            <TableHead>結果</TableHead>
            <TableHead className="text-center">試合</TableHead>
            <TableHead className="text-center">打席</TableHead>
            <TableHead className="text-center">打数</TableHead>
            <TableHead className="text-center">安打</TableHead>
            <TableHead className="text-center">本塁打</TableHead>
            <TableHead className="text-center">打点</TableHead>
            <TableHead className="text-center">得点</TableHead>
            <TableHead className="text-center">盗塁</TableHead>
            <TableHead className="text-center">打率</TableHead>
            <TableHead className="text-center">出塁率</TableHead>
            <TableHead className="text-center">長打率</TableHead>
            <TableHead className="text-center">OPS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {games.map((item) => (
            <RecentBattingRow
              key={item.game.gameId ?? item.game.gameDate}
              item={item}
            />
          ))}
        </TableBody>
      </Table>
    </PlayerRecentStatsTableWrapper>
  );
}
