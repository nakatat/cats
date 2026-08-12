import { Box } from '@/components/system/Box';
import { Skeleton } from '@/components/ui/skeleton';

export function NavigationCardSkeleton() {
  return (
    <Box className="border-border/70 bg-card h-full rounded-xl border p-3 shadow-[0_14px_30px_rgba(17,24,39,0.04)] sm:p-4">
      <Box display="flex" align="center" gap="md" className="h-full">
        <Skeleton className="size-12 shrink-0 rounded-xl md:size-14" />
        <Box
          display="flex"
          direction="column"
          gap="xs"
          className="min-w-0 items-center md:items-start"
        >
          <Skeleton className="h-5 w-20 max-w-full" />
          <Skeleton className="hidden h-5 w-32 max-w-full md:block" />
        </Box>
      </Box>
    </Box>
  );
}
