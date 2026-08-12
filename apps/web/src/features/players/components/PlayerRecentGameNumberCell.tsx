import { TableCell } from '@/components/ui/table';

export function PlayerRecentGameNumberCell({
  value,
}: Readonly<{ value?: number }>) {
  return (
    <TableCell className="text-center tabular-nums">{value ?? '—'}</TableCell>
  );
}
