import { Box } from '@/components/system/Box';
import { Skeleton } from '@/components/ui/skeleton';

export function PlayerTableSkeleton() {
  const columns = [1, 2, 3, 4, 5, 6, 7];

  return (
    <Box className="w-full min-w-180 overflow-hidden">
      <Box className="bg-primary/10 grid grid-cols-[3rem_minmax(10rem,2fr)_minmax(6rem,1fr)_minmax(8rem,1.2fr)_minmax(6rem,1fr)_minmax(5rem,1fr)_2rem] px-3 py-3">
        {columns.map((item) => (
          <Skeleton key={item} className="mx-auto h-3 w-14 first:ml-0" />
        ))}
      </Box>
      {[1, 2, 3, 4, 5].map((item) => (
        <Box
          key={item}
          display="grid"
          align="center"
          className="grid-cols-[3rem_minmax(10rem,2fr)_minmax(6rem,1fr)_minmax(8rem,1.2fr)_minmax(6rem,1fr)_minmax(5rem,1fr)_2rem] border-b px-3 py-3 last:border-b-0"
        >
          <Skeleton className="mx-auto h-4 w-5" />
          <Box display="flex" align="center" gap="md">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </Box>
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-6 w-14 rounded-md" />
          <Skeleton className="mx-auto size-5 rounded-full" />
        </Box>
      ))}
    </Box>
  );
}
