import { Box } from '@/components/system/Box';
import { Skeleton } from '@/components/ui/skeleton';

export function DetailNavigationSkeleton() {
  return (
    <Box className="border-border/75 flex flex-row items-center justify-between gap-2 border-t pt-4 sm:pt-5">
      <Box display="flex" align="center" gap="md" className="w-1/2 px-2 py-2">
        <Skeleton className="size-5 shrink-0 rounded-full" />
        <Box display="flex" direction="column" gap="xs">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="hidden h-4 w-36 sm:block" />
        </Box>
      </Box>
      <Box
        display="flex"
        align="center"
        justify="end"
        gap="md"
        className="w-1/2 px-2 py-2"
      >
        <Box display="flex" direction="column" align="end" gap="xs">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="hidden h-4 w-36 sm:block" />
        </Box>
        <Skeleton className="size-5 shrink-0 rounded-full" />
      </Box>
    </Box>
  );
}
