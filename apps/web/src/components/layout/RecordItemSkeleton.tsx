import { Box } from '@/components/system/Box';
import { Skeleton } from '@/components/ui/skeleton';

export function RecordItemSkeleton() {
  return (
    <Box
      display="flex"
      direction="column"
      align="center"
      gap="xs"
      className="min-w-0 border-r border-white/15 px-1.5 py-3 last:border-r-0 md:px-3 md:py-4"
    >
      <Skeleton className="h-3 w-10 bg-white/20" />
      <Skeleton className="h-6 w-8 bg-white/20" />
    </Box>
  );
}
