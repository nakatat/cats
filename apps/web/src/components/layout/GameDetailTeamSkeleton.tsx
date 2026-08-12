import { Box } from '@/components/system/Box';
import { Skeleton } from '@/components/ui/skeleton';

export function GameDetailTeamSkeleton() {
  return (
    <Box
      display="flex"
      direction="column"
      align="center"
      gap="sm"
      className="min-w-0 self-start sm:gap-2"
    >
      <Skeleton className="size-12 rounded-xl sm:size-24" />
      <Skeleton className="h-5 w-32 max-w-full" />
    </Box>
  );
}
