import { Box } from '@/components/system/Box';
import { Skeleton } from '@/components/ui/skeleton';

import { RecentTeamSkeleton } from './RecentTeamSkeleton';

export function RecentGameScoreSkeleton() {
  return (
    <Box display="flex" direction="column" gap="xl">
      <Box className="grid grid-cols-[minmax(0,1fr)_8rem_minmax(0,1fr)] items-center gap-3 sm:gap-5 lg:gap-8">
        <RecentTeamSkeleton />
        <Skeleton className="mx-auto h-9 w-20 sm:h-10" />
        <RecentTeamSkeleton />
      </Box>
      <Box className="border-border/70 border-t" />
      <Box className="w-full overflow-x-auto">
        <Box className="min-w-190">
          <Box className="bg-muted/45 grid grid-cols-9 gap-2 px-2 py-3">
            {Array.from({ length: 9 }, (_, index) => (
              <Skeleton key={index} className="h-3 w-full" />
            ))}
          </Box>
          {[1, 2].map((item) => (
            <Box
              key={item}
              className="grid grid-cols-9 gap-2 border-b px-2 py-3 last:border-b-0"
            >
              {Array.from({ length: 9 }, (_, index) => (
                <Skeleton key={index} className="h-4 w-full" />
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
