import type { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

import { cn } from '@/lib/design/utils';

type DataTableColumnHeaderProps<TData, TValue> = {
  column: Column<TData, TValue>;
  title: string;
  className?: string;
};

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: Readonly<DataTableColumnHeaderProps<TData, TValue>>) {
  const sorted = column.getIsSorted();

  function handleSort() {
    const nextDescending =
      sorted === false ? column.getFirstSortDir() === 'desc' : sorted === 'asc';
    column.toggleSorting(nextDescending);
  }

  return (
    <button
      type="button"
      className={cn(
        'focus-visible:ring-ring inline-flex items-center gap-1 rounded-sm whitespace-nowrap hover:underline focus-visible:ring-3 focus-visible:outline-none',
        className
      )}
      onClick={handleSort}
      aria-label={`${title}で並べ替え`}
    >
      {title}
      {sorted === 'asc' ? (
        <ArrowUp aria-hidden="true" className="size-3" />
      ) : sorted === 'desc' ? (
        <ArrowDown aria-hidden="true" className="size-3" />
      ) : (
        <ArrowUpDown aria-hidden="true" className="size-3 opacity-60" />
      )}
    </button>
  );
}
