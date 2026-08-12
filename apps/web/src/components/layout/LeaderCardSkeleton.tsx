import { Box } from '@/components/system/Box';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function LeaderCardSkeleton() {
  return (
    <Card className="rounded-xl py-0 shadow-[0_6px_18px_rgba(17,24,39,0.04)]">
      <Box display="flex" direction="column" gap="sm" className="p-3 sm:p-4">
        <Box display="flex" align="center" justify="between" gap="sm">
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-7 w-16" />
        </Box>
        <Box display="flex" align="center" gap="md">
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="h-5 min-w-0 flex-1" />
        </Box>
      </Box>
    </Card>
  );
}
