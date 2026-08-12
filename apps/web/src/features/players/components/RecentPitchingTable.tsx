import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type { PlayerRecentGame } from './player-detail.types';
import { PlayerRecentStatsTableWrapper } from './PlayerRecentStatsTableWrapper';
import { RecentPitchingRow } from './RecentPitchingRow';

export function RecentPitchingTable({
  games,
}: Readonly<{ games: PlayerRecentGame[] }>) {
  return (
    <PlayerRecentStatsTableWrapper>
      <Table className="min-w-0 text-xs sm:min-w-245 sm:text-sm">
        <TableHeader>
          <TableRow className="border-primary bg-primary hover:bg-primary [&>th]:text-primary-foreground [&>th:first-child]:rounded-tl-md [&>th:last-child]:rounded-tr-md">
            <TableHead>日付</TableHead>
            <TableHead>対戦相手</TableHead>
            <TableHead>スコア</TableHead>
            <TableHead>結果</TableHead>
            <TableHead className="text-center">登板</TableHead>
            <TableHead className="text-center">投球回</TableHead>
            <TableHead className="text-center">勝利</TableHead>
            <TableHead className="text-center">敗戦</TableHead>
            <TableHead className="text-center">セーブ</TableHead>
            <TableHead className="text-center">奪三振</TableHead>
            <TableHead className="text-center">被安打</TableHead>
            <TableHead className="text-center">失点</TableHead>
            <TableHead className="text-center">自責点</TableHead>
            <TableHead className="text-center">防御率</TableHead>
            <TableHead className="text-center">WHIP</TableHead>
            <TableHead className="text-center">K/7</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {games.map((item) => (
            <RecentPitchingRow
              key={item.game.gameId ?? item.game.gameDate}
              item={item}
            />
          ))}
        </TableBody>
      </Table>
    </PlayerRecentStatsTableWrapper>
  );
}
