import { Box } from '@/components/system/Box';
import { Skeleton } from '@/components/ui/skeleton';

import { DetailNavigationSkeleton } from './DetailNavigationSkeleton';
import { PlayerProfileCardSkeleton } from './PlayerProfileCardSkeleton';
import { PlayerStatsCardSkeleton } from './PlayerStatsCardSkeleton';

export function PlayerDetailPageSkeleton() {
  return (
    <Box
      width="100%"
      maxWidth={1440}
      className="mx-auto px-4 pt-4 pb-6 sm:px-6 sm:pt-6 sm:pb-8 lg:px-8 lg:pt-8 lg:pb-10"
    >
      <Box display="flex" direction="column" gap="xl">
        <Skeleton className="h-4 w-72 max-w-full" />
        <PlayerProfileCardSkeleton />
        <PlayerStatsCardSkeleton />
        <PlayerStatsCardSkeleton />
        <DetailNavigationSkeleton />
      </Box>
    </Box>
  );
}
