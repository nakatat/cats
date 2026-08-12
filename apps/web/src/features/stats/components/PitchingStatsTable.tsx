'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';

import { Box } from '@/components/system/Box';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/design/utils';
import { formatMobilePlayerName } from '@/lib/formatters';

import type { PitchingStat } from '../data/stats';
import { DataTableColumnHeader } from './DataTableColumnHeader';
import { PitchingStatsEmpty } from './PitchingStatsEmpty';
import { RankBadge } from './RankBadge';
import { getRankMap, numericSorting } from './statsTableUtils';

type PitchingStatsTableProps = {
  stats: PitchingStat[];
};

const pitchingColumns: ColumnDef<PitchingStat>[] = [
  {
    id: 'rank',
    header: '順位',
    enableSorting: false,
  },
  {
    accessorKey: 'playerName',
    header: '選手名',
    enableSorting: false,
    cell: ({ row }) => {
      const stat = row.original;
      return (
        <Box display="flex" align="center" gap="sm">
          <Link
            href={`/players/${stat.playerId}`}
            className="text-primary focus-visible:ring-ring hover:underline focus-visible:ring-3 focus-visible:outline-none"
          >
            <span className="sm:hidden">
              {formatMobilePlayerName(stat.playerName)}
            </span>
            <span className="hidden sm:inline">{stat.playerName}</span>
          </Link>
          {!stat.isQualified ? (
            <Badge variant="outline" title="規定未満">
              未達
            </Badge>
          ) : null}
        </Box>
      );
    },
  },
  {
    accessorKey: 'games',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="試合" />
    ),
    sortingFn: numericSorting,
  },
  {
    accessorKey: 'outsPitched',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="投球回" />
    ),
    sortingFn: numericSorting,
    cell: ({ row }) => row.original.inningsPitched,
  },
  {
    accessorKey: 'wins',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="勝" />
    ),
    sortingFn: numericSorting,
  },
  {
    accessorKey: 'losses',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="敗" />
    ),
    sortingFn: numericSorting,
  },
  {
    accessorKey: 'saves',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="セーブ" />
    ),
    sortingFn: numericSorting,
  },
  {
    accessorKey: 'strikeouts',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="奪三振" />
    ),
    sortingFn: numericSorting,
  },
  {
    accessorKey: 'hitsAllowed',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="被安打" />
    ),
    sortingFn: numericSorting,
  },
  {
    accessorKey: 'runsAllowed',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="失点" />
    ),
    sortingFn: numericSorting,
  },
  {
    accessorKey: 'earnedRuns',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="自責点" />
    ),
    sortingFn: numericSorting,
  },
  {
    accessorKey: 'era',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="防御率" />
    ),
    sortingFn: numericSorting,
    sortDescFirst: false,
  },
  {
    accessorKey: 'whip',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="WHIP" />
    ),
    sortingFn: numericSorting,
    sortDescFirst: true,
  },
  {
    accessorKey: 'walks',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="与四球" />
    ),
    sortingFn: numericSorting,
  },
];

export function PitchingStatsTable({
  stats,
}: Readonly<PitchingStatsTableProps>) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'era', desc: false },
  ]);
  const table = useReactTable({
    data: stats,
    columns: pitchingColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  const rows = table.getRowModel().rows;
  const rankMap = getRankMap(rows, sorting[0]?.id);

  return stats.length > 0 ? (
    <Table className="min-w-0 text-xs sm:min-w-280 sm:text-sm">
      <TableCaption className="sr-only">選手別の投手成績一覧</TableCaption>
      <TableHeader>
        <TableRow className="border-primary bg-primary hover:bg-primary [&>th:first-child]:rounded-tl-md [&>th:last-child]:rounded-tr-md">
          {table.getHeaderGroups()[0].headers.map((header) => (
            <TableHead
              key={header.id}
              className={cn(
                'text-primary-foreground text-center',
                header.column.id === 'playerName'
                  ? 'w-auto text-left sm:w-32'
                  : header.column.id === 'rank'
                    ? 'w-14'
                    : 'w-16'
              )}
            >
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id} className="bg-card">
            {row.getVisibleCells().map((cell) => (
              <TableCell
                key={cell.id}
                className={cn(
                  cell.column.id === 'playerName'
                    ? 'text-left'
                    : 'text-center tabular-nums',
                  sorting[0]?.id === cell.column.id && 'font-bold'
                )}
              >
                {cell.column.id === 'rank' ? (
                  <RankBadge rank={rankMap.get(row.id) ?? row.index + 1} />
                ) : (
                  flexRender(cell.column.columnDef.cell, cell.getContext())
                )}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : (
    <PitchingStatsEmpty />
  );
}
