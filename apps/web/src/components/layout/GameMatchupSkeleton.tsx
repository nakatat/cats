import { Box } from '@/components/system/Box';
import { Skeleton } from '@/components/ui/skeleton';

import { GameDetailTeamSkeleton } from './GameDetailTeamSkeleton';

export function GameMatchupSkeleton() {
  return (
    <Box className="grid grid-cols-[minmax(0,1fr)_8rem_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[minmax(0,1fr)_14rem_minmax(0,1fr)] sm:gap-8 lg:gap-12">
      <GameDetailTeamSkeleton />
      <Skeleton className="mx-auto h-10 w-28 sm:h-20" />
      <GameDetailTeamSkeleton />
    </Box>
  );
}
