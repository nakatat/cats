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

import type { BattingStat } from '../data/stats';
import { BattingStatsEmpty } from './BattingStatsEmpty';
import { DataTableColumnHeader } from './DataTableColumnHeader';
import { RankBadge } from './RankBadge';
import { getRankMap, numericSorting } from './statsTableUtils';

type BattingStatsTableProps = {
  stats: BattingStat[];
};

const battingColumns: ColumnDef<BattingStat>[] = [
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
    accessorKey: 'plateAppearances',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="打席" />
    ),
    sortingFn: numericSorting,
  },
  {
    accessorKey: 'atBats',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="打数" />
    ),
    sortingFn: numericSorting,
  },
  {
    accessorKey: 'hits',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="安打" />
    ),
    sortingFn: numericSorting,
  },
  {
    accessorKey: 'homeRuns',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="本塁打" />
    ),
    sortingFn: numericSorting,
  },
  {
    accessorKey: 'runsBattedIn',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="打点" />
    ),
    sortingFn: numericSorting,
  },
  {
    accessorKey: 'runs',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="得点" />
    ),
    sortingFn: numericSorting,
  },
  {
    accessorKey: 'stolenBases',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="盗塁" />
    ),
    sortingFn: numericSorting,
  },
  {
    accessorKey: 'battingAverage',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="打率" />
    ),
    sortingFn: numericSorting,
    sortDescFirst: true,
  },
  {
    accessorKey: 'onBasePercentage',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="出塁率" />
    ),
    sortingFn: numericSorting,
    sortDescFirst: true,
  },
  {
    accessorKey: 'sluggingPercentage',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="長打率" />
    ),
    sortingFn: numericSorting,
    sortDescFirst: true,
  },
  {
    accessorKey: 'ops',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="OPS" />
    ),
    sortingFn: numericSorting,
    sortDescFirst: true,
  },
];

export function BattingStatsTable({ stats }: Readonly<BattingStatsTableProps>) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'battingAverage', desc: true },
  ]);
  const table = useReactTable({
    data: stats,
    columns: battingColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  const rows = table.getRowModel().rows;
  const rankMap = getRankMap(rows, sorting[0]?.id);

  return stats.length > 0 ? (
    <Table className="min-w-0 text-xs sm:min-w-315 sm:text-sm">
      <TableCaption className="sr-only">選手別の打撃成績一覧</TableCaption>
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
    <BattingStatsEmpty />
  );
}
