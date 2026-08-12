import { Box } from '@/components/system/Box';
import { Skeleton } from '@/components/ui/skeleton';

export function RecentTeamSkeleton() {
  return (
    <Box
      display="flex"
      direction="column"
      align="center"
      gap="sm"
      className="min-w-0 self-start"
    >
      <Skeleton className="size-12 rounded-xl sm:size-14" />
      <Skeleton className="h-5 w-28 max-w-full" />
    </Box>
  );
}
