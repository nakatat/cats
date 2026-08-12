import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { PitchingStatsResponse } from '@/lib/api/players';

import { PitchingCareerRow } from './PitchingCareerRow';
import type { PlayerSeasonStats } from './player-detail.types';
import { PlayerStatsTableWrapper } from './PlayerStatsTableWrapper';

export function PitchingCareerTable({
  pitching,
  seasons,
}: Readonly<{
  pitching?: PitchingStatsResponse;
  seasons: Array<PlayerSeasonStats & { pitching: PitchingStatsResponse }>;
}>) {
  return (
    <PlayerStatsTableWrapper>
      <Table className="min-w-0 text-xs sm:min-w-245 sm:text-sm">
        <TableHeader>
          <TableRow className="border-primary bg-primary hover:bg-primary [&>th]:text-primary-foreground [&>th:first-child]:rounded-tl-md [&>th:last-child]:rounded-tr-md">
            <TableHead>年度</TableHead>
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
          {seasons.map(({ year, pitching: stats }) => (
            <PitchingCareerRow key={year} label={`${year}年`} stats={stats} />
          ))}
          {pitching ? (
            <PitchingCareerRow label="通算" stats={pitching} total />
          ) : null}
        </TableBody>
      </Table>
    </PlayerStatsTableWrapper>
  );
}
