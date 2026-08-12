import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { BattingStatsResponse } from '@/lib/api/players';

import { BattingCareerRow } from './BattingCareerRow';
import type { PlayerSeasonStats } from './player-detail.types';
import { PlayerStatsTableWrapper } from './PlayerStatsTableWrapper';

export function BattingCareerTable({
  batting,
  seasons,
}: Readonly<{
  batting?: BattingStatsResponse;
  seasons: Array<PlayerSeasonStats & { batting: BattingStatsResponse }>;
}>) {
  return (
    <PlayerStatsTableWrapper>
      <Table className="min-w-0 text-xs sm:min-w-270 sm:text-sm">
        <TableHeader>
          <TableRow className="border-primary bg-primary hover:bg-primary [&>th]:text-primary-foreground [&>th:first-child]:rounded-tl-md [&>th:last-child]:rounded-tr-md">
            <TableHead>年度</TableHead>
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
          {seasons.map(({ year, batting: stats }) => (
            <BattingCareerRow key={year} label={`${year}年`} stats={stats} />
          ))}
          {batting ? (
            <BattingCareerRow label="通算" stats={batting} total />
          ) : null}
        </TableBody>
      </Table>
    </PlayerStatsTableWrapper>
  );
}
