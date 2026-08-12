import { Box } from '@/components/system/Box';
import { Skeleton } from '@/components/ui/skeleton';

export function PlayerCardSkeleton() {
  return (
    <Box className="border-border bg-card rounded-xl border shadow-[0_8px_24px_rgba(17,24,39,0.04)]">
      <Box display="flex" direction="column" gap="lg" className="p-3 sm:p-5">
        <Box display="flex" align="center" gap="md" className="min-w-0">
          <Skeleton className="size-10 shrink-0 rounded-full" />
          <Skeleton className="h-6 min-w-0 flex-1" />
          <Skeleton className="h-6 w-14 shrink-0 rounded-md" />
        </Box>
        <Box className="grid grid-cols-3 gap-x-3 gap-y-2">
          {[1, 2, 3].map((item) => (
            <Box key={item} display="flex" direction="column" gap="xs">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-5 w-16 max-w-full" />
            </Box>
          ))}
        </Box>
        <Box className="border-border/70 flex items-center justify-end gap-1 border-t pt-2 sm:pt-3">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="size-4 rounded-full" />
        </Box>
      </Box>
    </Box>
  );
}
