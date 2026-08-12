import { Box } from '@/components/system/Box';
import { Skeleton } from '@/components/ui/skeleton';

import { RecentGameScoreSkeleton } from './RecentGameScoreSkeleton';

export function RecentGameSectionSkeleton() {
  return (
    <Box as="section" id="recent-games">
      <Box className="border-border/70 bg-card overflow-hidden rounded-xl border shadow-[0_14px_32px_rgba(17,24,39,0.05)]">
        <Box
          display="flex"
          align="center"
          gap="sm"
          className="border-border/70 border-b px-5 py-4 sm:px-6"
        >
          <Skeleton className="size-6 rounded-full" />
          <Skeleton className="h-6 w-40" />
        </Box>

        <Box
          display="flex"
          direction="column"
          gap="xs"
          className="px-4 py-4 sm:px-6"
        >
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-5 w-64 max-w-full" />
        </Box>

        <Box className="px-3 py-4 sm:px-6 sm:py-6">
          <RecentGameScoreSkeleton />
        </Box>

        <Box className="border-border/70 flex items-center justify-end gap-1 border-t px-5 py-3 sm:px-6">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="size-4 rounded-full" />
        </Box>
      </Box>
    </Box>
  );
}
