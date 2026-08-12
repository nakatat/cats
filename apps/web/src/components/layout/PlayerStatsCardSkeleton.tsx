import { Box } from '@/components/system/Box';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { PlayerDetailStatsTableSkeleton } from './PlayerDetailStatsTableSkeleton';

export function PlayerStatsCardSkeleton() {
  return (
    <Card
      padding="content"
      className="border-border/75 bg-card gap-5 rounded-xl shadow-[0_10px_30px_rgba(17,24,39,0.05)]"
    >
      <Skeleton className="h-6 w-28" />
      <Box className="border-border/70 flex w-full gap-2 border-b sm:w-fit">
        <Skeleton className="h-10 w-20 rounded-none" />
        <Skeleton className="h-10 w-20 rounded-none" />
      </Box>
      <Box className="w-full overflow-x-auto">
        <PlayerDetailStatsTableSkeleton />
      </Box>
    </Card>
  );
}
