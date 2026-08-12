import type { Row } from '@tanstack/react-table';

export function numericSorting<TData>(
  rowA: Row<TData>,
  rowB: Row<TData>,
  columnId: string
) {
  return Number(rowA.getValue(columnId)) - Number(rowB.getValue(columnId));
}

export function getRankMap<TData>(
  rows: Row<TData>[],
  sortId: string | undefined
) {
  let previousValue: number | undefined;
  let previousRank = 0;

  return new Map(
    rows.map((row, index) => {
      const value = sortId == null ? undefined : Number(row.getValue(sortId));
      const rank =
        value != null && value === previousValue ? previousRank : index + 1;
      previousValue = value;
      previousRank = rank;
      return [row.id, rank] as const;
    })
  );
}
