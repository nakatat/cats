import { Box } from '@/components/system/Box';
import { Skeleton } from '@/components/ui/skeleton';

import { PlayersFiltersSkeleton } from './PlayersFiltersSkeleton';
import { PlayersListSkeleton } from './PlayersListSkeleton';

export { PlayersFiltersSkeleton } from './PlayersFiltersSkeleton';
export { PlayersListSkeleton } from './PlayersListSkeleton';

export function PlayersPageSkeleton() {
  return (
    <Box
      width="100%"
      maxWidth={1440}
      className="mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8"
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
        <PlayersFiltersSkeleton />
        <PlayersListSkeleton />
      </Box>
    </Box>
  );
}
