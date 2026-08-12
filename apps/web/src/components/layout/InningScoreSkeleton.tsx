import { Box } from '@/components/system/Box';
import { Skeleton } from '@/components/ui/skeleton';

export function InningScoreSkeleton() {
  return (
    <Box className="w-full overflow-x-auto">
      <Box className="min-w-190">
        <Box className="bg-muted/45 grid grid-cols-9 gap-2 px-2 py-3">
          {Array.from({ length: 9 }, (_, index) => (
            <Skeleton key={index} className="mx-auto h-3 w-full" />
          ))}
        </Box>
        {[1, 2].map((item) => (
          <Box
            key={item}
            className="grid grid-cols-9 gap-2 border-b px-2 py-3 last:border-b-0"
          >
            {Array.from({ length: 9 }, (_, index) => (
              <Skeleton key={index} className="mx-auto h-4 w-full" />
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
