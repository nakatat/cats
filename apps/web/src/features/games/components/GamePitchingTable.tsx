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
import type { PitchingLineResponse } from '@/lib/api/games';
import { formatMobilePlayerName } from '@/lib/formatters';

type PitchingStatsTableProps = {
  stats: PitchingLineResponse[];
};

type PitchingTotals = Required<
  Pick<
    PitchingLineResponse,
    | 'outsPitched'
    | 'battersFaced'
    | 'pitches'
    | 'hitsAllowed'
    | 'runsAllowed'
    | 'earnedRuns'
    | 'walks'
    | 'hitByPitch'
    | 'strikeouts'
  >
>;

export function GamePitchingTable({
  stats,
}: Readonly<PitchingStatsTableProps>) {
  const totals = stats.reduce<PitchingTotals>(
    (total, stat) => ({
      outsPitched: total.outsPitched + (stat.outsPitched ?? 0),
      battersFaced: total.battersFaced + (stat.battersFaced ?? 0),
      pitches: total.pitches + (stat.pitches ?? 0),
      hitsAllowed: total.hitsAllowed + (stat.hitsAllowed ?? 0),
      runsAllowed: total.runsAllowed + (stat.runsAllowed ?? 0),
      earnedRuns: total.earnedRuns + (stat.earnedRuns ?? 0),
      walks: total.walks + (stat.walks ?? 0),
      hitByPitch: total.hitByPitch + (stat.hitByPitch ?? 0),
      strikeouts: total.strikeouts + (stat.strikeouts ?? 0),
    }),
    {
      outsPitched: 0,
      battersFaced: 0,
      pitches: 0,
      hitsAllowed: 0,
      runsAllowed: 0,
      earnedRuns: 0,
      walks: 0,
      hitByPitch: 0,
      strikeouts: 0,
    }
  );

  return (
    <Table className="min-w-max table-auto text-[10px] sm:min-w-190 sm:text-sm">
      <TableHeader>
        <TableRow className="border-primary bg-primary hover:bg-primary [&>th]:text-primary-foreground [&>th:first-child]:rounded-tl-md [&>th:last-child]:rounded-tr-md">
          <TableHead className="px-2">選手名</TableHead>
          <TableHead className="px-1 text-center sm:px-2">回</TableHead>
          <TableHead className="px-1 text-center sm:px-2">打者</TableHead>
          <TableHead className="px-1 text-center sm:px-2">投球数</TableHead>
          <TableHead className="px-1 text-center sm:px-2">被安打</TableHead>
          <TableHead className="px-1 text-center sm:px-2">失点</TableHead>
          <TableHead className="px-1 text-center sm:px-2">自責</TableHead>
          <TableHead className="px-1 text-center sm:px-2">四死球</TableHead>
          <TableHead className="px-1 text-center sm:px-2">三振</TableHead>
          <TableHead className="px-1 pr-3 text-center sm:px-2 sm:pr-4">
            防御率
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stats.map((stat, index) => (
          <TableRow
            key={stat.pitchingLineId ?? stat.gameParticipantId ?? index}
          >
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
                    {formatMobilePlayerName(stat.displayName ?? '投手名未設定')}
                  </span>
                  <span className="hidden sm:inline">
                    {stat.displayName ?? '投手名未設定'}
                  </span>
                </Link>
              ) : (
                <>
                  <span className="sm:hidden">
                    {formatMobilePlayerName(stat.displayName ?? '投手名未設定')}
                  </span>
                  <span className="hidden sm:inline">
                    {stat.displayName ?? '投手名未設定'}
                  </span>
                </>
              )}
            </TableHead>
            <TableCell className="px-1 text-center tabular-nums sm:px-2">
              {formatInnings(stat.outsPitched)}
            </TableCell>
            <TableCell className="px-1 text-center tabular-nums sm:px-2">
              {stat.battersFaced ?? 0}
            </TableCell>
            <TableCell className="px-1 text-center tabular-nums sm:px-2">
              {stat.pitches ?? 0}
            </TableCell>
            <TableCell className="px-1 text-center tabular-nums sm:px-2">
              {stat.hitsAllowed ?? 0}
            </TableCell>
            <TableCell className="px-1 text-center tabular-nums sm:px-2">
              {stat.runsAllowed ?? 0}
            </TableCell>
            <TableCell className="px-1 text-center tabular-nums sm:px-2">
              {stat.earnedRuns ?? 0}
            </TableCell>
            <TableCell className="px-1 text-center tabular-nums sm:px-2">
              {(stat.walks ?? 0) + (stat.hitByPitch ?? 0)}
            </TableCell>
            <TableCell className="px-1 text-center tabular-nums sm:px-2">
              {stat.strikeouts ?? 0}
            </TableCell>
            <TableCell className="px-1 pr-3 text-center tabular-nums sm:px-2 sm:pr-4">
              {formatEra(stat.earnedRuns, stat.outsPitched)}
            </TableCell>
          </TableRow>
        ))}
        <TableRow className="bg-muted/35 hover:bg-muted/35 font-bold">
          <TableHead className="px-1 text-right sm:px-2">合計</TableHead>
          <TableCell className="px-1 text-center tabular-nums sm:px-2">
            {formatInnings(totals.outsPitched)}
          </TableCell>
          <TableCell className="px-1 text-center tabular-nums sm:px-2">
            {totals.battersFaced}
          </TableCell>
          <TableCell className="px-1 text-center tabular-nums sm:px-2">
            {totals.pitches}
          </TableCell>
          <TableCell className="px-1 text-center tabular-nums sm:px-2">
            {totals.hitsAllowed}
          </TableCell>
          <TableCell className="px-1 text-center tabular-nums sm:px-2">
            {totals.runsAllowed}
          </TableCell>
          <TableCell className="px-1 text-center tabular-nums sm:px-2">
            {totals.earnedRuns}
          </TableCell>
          <TableCell className="px-1 text-center tabular-nums sm:px-2">
            {totals.walks + totals.hitByPitch}
          </TableCell>
          <TableCell className="px-1 text-center tabular-nums sm:px-2">
            {totals.strikeouts}
          </TableCell>
          <TableCell className="px-1 pr-3 text-center tabular-nums sm:px-2 sm:pr-4">
            {formatEra(totals.earnedRuns, totals.outsPitched)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

function formatInnings(outsPitched?: number) {
  if (!outsPitched) {
    return '0.0';
  }

  return `${Math.floor(outsPitched / 3)}.${outsPitched % 3}`;
}

function formatEra(earnedRuns?: number, outsPitched?: number) {
  if (!outsPitched) {
    return '-';
  }

  return (((earnedRuns ?? 0) * 27) / outsPitched).toFixed(2);
}
