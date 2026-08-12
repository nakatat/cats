import { Box } from '@/components/system/Box';
import { Skeleton } from '@/components/ui/skeleton';

import { StatsPageContentSkeleton } from './StatsPageContentSkeleton';

export { StatsPageContentSkeleton } from './StatsPageContentSkeleton';
export { StatsSectionsSkeleton } from './StatsSectionsSkeleton';

export function StatsPageSkeleton() {
  return (
    <Box
      width="100%"
      maxWidth={1440}
      className="mx-auto px-4 pt-4 pb-6 sm:px-6 sm:pt-6 sm:pb-8 lg:px-8 lg:pt-8 lg:pb-10"
    >
      <Box display="flex" direction="column" gap="xl">
        <Box display="flex" direction="column" gap="lg">
          <Skeleton className="h-4 w-32" />
          <Box display="flex" direction="column" gap="md">
            <Box display="flex" align="center" gap="lg">
              <Skeleton className="size-10 rounded-xl sm:size-12" />
              <Skeleton className="h-10 w-48 max-w-full" />
            </Box>
            <Skeleton className="h-5 w-80 max-w-full" />
          </Box>
        </Box>
        <StatsPageContentSkeleton />
      </Box>
    </Box>
  );
}
