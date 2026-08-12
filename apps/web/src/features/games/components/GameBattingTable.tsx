'use client';

import Link from 'next/link';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { BattingLineResponse } from '@/lib/api/games';
import { formatMobilePlayerName, formatRate } from '@/lib/formatters';

type BattingStatsTableProps = {
  stats: BattingLineResponse[];
};

type BattingTotals = Required<
  Pick<
    BattingLineResponse,
    | 'atBats'
    | 'hits'
    | 'runsBattedIn'
    | 'runs'
    | 'walks'
    | 'hitByPitch'
    | 'strikeouts'
    | 'sacrificeHits'
    | 'stolenBases'
  >
>;

export function GameBattingTable({ stats }: Readonly<BattingStatsTableProps>) {
  const totals = stats.reduce<BattingTotals>(
    (total, stat) => ({
      atBats: total.atBats + (stat.atBats ?? 0),
      hits: total.hits + (stat.hits ?? 0),
      runsBattedIn: total.runsBattedIn + (stat.runsBattedIn ?? 0),
      runs: total.runs + (stat.runs ?? 0),
      walks: total.walks + (stat.walks ?? 0),
      hitByPitch: total.hitByPitch + (stat.hitByPitch ?? 0),
      strikeouts: total.strikeouts + (stat.strikeouts ?? 0),
      sacrificeHits: total.sacrificeHits + (stat.sacrificeHits ?? 0),
      stolenBases: total.stolenBases + (stat.stolenBases ?? 0),
    }),
    {
      atBats: 0,
      hits: 0,
      runsBattedIn: 0,
      runs: 0,
      walks: 0,
      hitByPitch: 0,
      strikeouts: 0,
      sacrificeHits: 0,
      stolenBases: 0,
    }
  );

  return (
    <Table className="min-w-max table-auto text-[10px] sm:min-w-230 sm:text-sm">
      <TableHeader>
        <TableRow className="border-primary bg-primary hover:bg-primary [&>th]:text-primary-foreground [&>th:first-child]:rounded-tl-md [&>th:last-child]:rounded-tr-md">
          <TableHead className="px-1 text-center sm:px-2">打順</TableHead>
          <TableHead className="px-1 sm:px-2">選手名</TableHead>
          <TableHead className="px-1 text-center sm:px-2">打数</TableHead>
          <TableHead className="px-1 text-center sm:px-2">安打</TableHead>
          <TableHead className="px-1 text-center sm:px-2">打点</TableHead>
          <TableHead className="px-1 text-center sm:px-2">得点</TableHead>
          <TableHead className="px-1 text-center sm:px-2">四球</TableHead>
          <TableHead className="px-1 text-center sm:px-2">死球</TableHead>
          <TableHead className="px-1 text-center sm:px-2">三振</TableHead>
          <TableHead className="px-1 text-center sm:px-2">犠打</TableHead>
          <TableHead className="px-1 text-center sm:px-2">盗塁</TableHead>
          <TableHead className="px-1 text-center sm:px-2">打率</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stats.map((stat, index) => (
          <TableRow key={stat.battingLineId ?? stat.gameParticipantId ?? index}>
            <TableCell className="px-1 text-center tabular-nums sm:px-2">
              {stat.battingOrder ?? index + 1}
            </TableCell>
            <TableHead
              scope="row"
              className="px-1 text-[11px] font-bold sm:px-2 sm:text-sm"
            >
              {stat.playerId != null ? (
                <Link
                  href={`/players/${stat.playerId}`}
                  className="text-primary hover:underline focus-visible:ring-3 focus-visible:outline-none"
                >
                  <span className="sm:hidden">
                    {formatMobilePlayerName(stat.displayName ?? '選手名未設定')}
                  </span>
                  <span className="hidden sm:inline">
                    {stat.displayName ?? '選手名未設定'}
                  </span>
                </Link>
              ) : (
                <>
                  <span className="sm:hidden">
                    {formatMobilePlayerName(stat.displayName ?? '選手名未設定')}
                  </span>
                  <span className="hidden sm:inline">
                    {stat.displayName ?? '選手名未設定'}
                  </span>
                </>
              )}
              <span className="text-muted-foreground ml-1 text-[10px] font-normal">
                {formatMobilePosition(stat.position)}
              </span>
            </TableHead>
            <TableCell className="px-1 text-center tabular-nums sm:px-2">
              {stat.atBats ?? 0}
            </TableCell>
            <TableCell className="px-1 text-center tabular-nums sm:px-2">
              {stat.hits ?? 0}
            </TableCell>
            <TableCell className="px-1 text-center tabular-nums sm:px-2">
              {stat.runsBattedIn ?? 0}
            </TableCell>
            <TableCell className="px-1 text-center tabular-nums sm:px-2">
              {stat.runs ?? 0}
            </TableCell>
            <TableCell className="px-1 text-center tabular-nums sm:px-2">
              {stat.walks ?? 0}
            </TableCell>
            <TableCell className="px-1 text-center tabular-nums sm:px-2">
              {stat.hitByPitch ?? 0}
            </TableCell>
            <TableCell className="px-1 text-center tabular-nums sm:px-2">
              {stat.strikeouts ?? 0}
            </TableCell>
            <TableCell className="px-1 text-center tabular-nums sm:px-2">
              {stat.sacrificeHits ?? 0}
            </TableCell>
            <TableCell className="px-1 text-center tabular-nums sm:px-2">
              {stat.stolenBases ?? 0}
            </TableCell>
            <TableCell className="px-1 text-center tabular-nums sm:px-2">
              {formatAverage(stat.hits, stat.atBats)}
            </TableCell>
          </TableRow>
        ))}
        <TableRow className="bg-muted/35 hover:bg-muted/35 font-bold">
          <TableHead colSpan={2} className="px-1 text-right sm:px-2">
            合計
          </TableHead>
          <TableCell className="px-1 text-center tabular-nums sm:px-2">
            {totals.atBats}
          </TableCell>
          <TableCell className="px-1 text-center tabular-nums sm:px-2">
            {totals.hits}
          </TableCell>
          <TableCell className="px-1 text-center tabular-nums sm:px-2">
            {totals.runsBattedIn}
          </TableCell>
          <TableCell className="px-1 text-center tabular-nums sm:px-2">
            {totals.runs}
          </TableCell>
          <TableCell className="px-1 text-center tabular-nums sm:px-2">
            {totals.walks}
          </TableCell>
          <TableCell className="px-1 text-center tabular-nums sm:px-2">
            {totals.hitByPitch}
          </TableCell>
          <TableCell className="px-1 text-center tabular-nums sm:px-2">
            {totals.strikeouts}
          </TableCell>
          <TableCell className="px-1 text-center tabular-nums sm:px-2">
            {totals.sacrificeHits}
          </TableCell>
          <TableCell className="px-1 text-center tabular-nums sm:px-2">
            {totals.stolenBases}
          </TableCell>
          <TableCell className="px-1 text-center tabular-nums sm:px-2">
            {formatAverage(totals.hits, totals.atBats)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

function formatAverage(hits?: number, atBats?: number) {
  if (!atBats) {
    return '.000';
  }

  return formatRate(((hits ?? 0) / atBats).toFixed(3));
}

function formatMobilePosition(position?: string | null) {
  const normalizedPosition = position?.trim();

  if (!normalizedPosition) {
    return '–';
  }

  const positionLabels: Record<string, string> = {
    投手: '投',
    捕手: '捕',
    一塁手: '一',
    二塁手: '二',
    三塁手: '三',
    遊撃手: '遊',
    左翼手: '左',
    中堅手: '中',
    右翼手: '右',
    内野手: '内',
    外野手: '外',
  };

  return positionLabels[normalizedPosition] ?? normalizedPosition.slice(0, 1);
}
