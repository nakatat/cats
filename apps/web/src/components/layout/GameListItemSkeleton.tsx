import { Box } from '@/components/system/Box';
import { Skeleton } from '@/components/ui/skeleton';

import { GameTeamSkeleton } from './GameTeamSkeleton';

export function GameListItemSkeleton() {
  return (
    <Box className="border-border/75 bg-card overflow-hidden rounded-xl border shadow-[0_8px_24px_rgba(17,24,39,0.04)]">
      <Box
        display="grid"
        align="center"
        className="grid-cols-1 gap-2 px-4 py-3 sm:px-6 lg:grid-cols-[minmax(200px,1fr)_minmax(360px,2fr)_minmax(200px,1fr)] lg:gap-4 lg:px-6 lg:py-4"
      >
        <Box display="flex" direction="column" gap="xs" className="min-w-0">
          <Skeleton className="h-5 w-36 max-w-full" />
          <Skeleton className="h-4 w-44 max-w-full" />
        </Box>

        <Box
          display="grid"
          align="center"
          className="grid-cols-[minmax(0,1fr)_6rem_minmax(0,1fr)] gap-2 sm:grid-cols-[minmax(0,1fr)_8rem_minmax(0,1fr)] sm:gap-5 lg:gap-8"
        >
          <GameTeamSkeleton />
          <Skeleton className="mx-auto h-9 w-20 sm:h-10" />
          <GameTeamSkeleton />
        </Box>

        <Box className="border-border/70 flex items-center justify-end gap-1 border-t pt-2 lg:border-0 lg:pt-0">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="size-4 rounded-full" />
        </Box>
      </Box>
    </Box>
  );
}
