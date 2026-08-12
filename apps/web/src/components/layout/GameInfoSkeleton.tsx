import { Box } from '@/components/system/Box';
import { Skeleton } from '@/components/ui/skeleton';

export function GameInfoSkeleton() {
  return (
    <Box
      display="flex"
      direction="column"
      gap="md"
      className="lg:border-l lg:pl-6"
    >
      {[1, 2, 3, 4].map((item) => (
        <Box key={item} display="flex" align="center" gap="sm">
          <Skeleton className="size-4 shrink-0 rounded-full" />
          <Skeleton className="h-5 w-48 max-w-full" />
        </Box>
      ))}
      <Box
        display="flex"
        direction="column"
        gap="xs"
        className="col-span-2 w-full"
      >
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-20 self-end" />
      </Box>
    </Box>
  );
}
