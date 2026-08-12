import { Box } from '@/components/system/Box';
import { Skeleton } from '@/components/ui/skeleton';

import { LeaderCardSkeleton } from './LeaderCardSkeleton';
import { MetricCardSkeleton } from './MetricCardSkeleton';
import { StatsTableSkeleton } from './StatsTableSkeleton';

export function StatsSectionSkeleton() {
  return (
    <Box as="section" display="flex" direction="column" gap="lg">
      <Box display="flex" direction="column" gap="md">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-4 w-48" />
      </Box>

      <Box display="grid" gap="md" className="grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <LeaderCardSkeleton key={item} />
        ))}
      </Box>

      <Box
        display="grid"
        gap="md"
        className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
      >
        {[1, 2, 3, 4].map((item) => (
          <MetricCardSkeleton key={item} />
        ))}
      </Box>

      <StatsTableSkeleton />
      <Skeleton className="h-4 w-40" />
    </Box>
  );
}
