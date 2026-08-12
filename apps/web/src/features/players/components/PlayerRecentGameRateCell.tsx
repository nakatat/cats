import { TableCell } from '@/components/ui/table';
import { formatRate } from '@/lib/formatters';

export function PlayerRecentGameRateCell({
  value,
}: Readonly<{ value?: string }>) {
  return (
    <TableCell className="text-center tabular-nums">
      {formatRate(value)}
    </TableCell>
  );
}
