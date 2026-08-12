import { Box } from '@/components/system/Box';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function MetricCardSkeleton() {
  return (
    <Card className="h-full rounded-xl py-0 shadow-[0_6px_18px_rgba(17,24,39,0.04)]">
      <Box
        display="flex"
        align="center"
        justify="between"
        gap="md"
        className="p-3 sm:p-4"
      >
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-7 w-14" />
      </Box>
    </Card>
  );
}
