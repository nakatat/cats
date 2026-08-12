import { Box } from '@/components/system/Box';
import { Skeleton } from '@/components/ui/skeleton';

import { StatsSectionsSkeleton } from './StatsSectionsSkeleton';

export function StatsPageContentSkeleton() {
  return (
    <Box display="flex" direction="column" gap="xl">
      <Box
        display="grid"
        gap="xl"
        className="grid-cols-1 gap-y-1 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-y-4"
      >
        <Box
          display="flex"
          align="center"
          gap="sm"
          className="order-1 w-full sm:col-start-2 sm:row-start-1 sm:w-auto sm:gap-4"
        >
          <Skeleton className="h-11 min-w-0 flex-1 rounded-md sm:w-44 sm:flex-none" />
          <Box
            display="flex"
            align="center"
            gap="sm"
            className="min-w-0 flex-1 justify-end sm:flex-none"
          >
            <Skeleton className="size-5 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </Box>
        </Box>
        <Skeleton className="order-2 h-12 w-full rounded-md sm:col-start-1 sm:row-start-1" />
      </Box>
      <StatsSectionsSkeleton />
    </Box>
  );
}
