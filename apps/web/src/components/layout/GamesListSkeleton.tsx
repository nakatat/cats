import { Box } from '@/components/system/Box';
import { Skeleton } from '@/components/ui/skeleton';

import { GameListItemSkeleton } from './GameListItemSkeleton';

export function GamesListSkeleton() {
  return (
    <Box as="section" id="games" display="flex" direction="column" gap="lg">
      <Box display="flex" align="center" justify="between" gap="md">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-28 sm:hidden" />
      </Box>
      <Box display="flex" direction="column" gap="sm">
        {[1, 2, 3, 4, 5].map((item) => (
          <GameListItemSkeleton key={item} />
        ))}
      </Box>
      <Skeleton className="mx-auto h-10 w-56 rounded-md" />
    </Box>
  );
}
