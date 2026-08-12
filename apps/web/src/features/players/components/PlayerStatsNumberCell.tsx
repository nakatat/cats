import { TableCell } from '@/components/ui/table';

export function PlayerStatsNumberCell({ value }: Readonly<{ value?: number }>) {
  return (
    <TableCell className="text-center tabular-nums">{value ?? '—'}</TableCell>
  );
}
