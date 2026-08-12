import { Box } from '@/components/system/Box';
import { Skeleton } from '@/components/ui/skeleton';

export function PlayerDetailStatsTableSkeleton() {
  return (
    <Box className="min-w-245">
      <Box className="bg-primary/10 grid grid-cols-10 gap-3 px-3 py-3">
        {Array.from({ length: 10 }, (_, index) => (
          <Skeleton key={index} className="h-3 w-full" />
        ))}
      </Box>
      {Array.from({ length: 5 }, (_, index) => (
        <Box
          key={index}
          display="grid"
          className="grid-cols-10 gap-3 border-b px-3 py-3 last:border-b-0"
        >
          {Array.from({ length: 10 }, (_, cellIndex) => (
            <Skeleton key={cellIndex} className="h-4 w-full" />
          ))}
        </Box>
      ))}
    </Box>
  );
}
