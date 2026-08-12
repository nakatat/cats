import { Box } from '@/components/system/Box';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function PlayerProfileCardSkeleton() {
  return (
    <Card
      padding="content"
      className="border-border/75 bg-card gap-4 rounded-xl shadow-[0_10px_30px_rgba(17,24,39,0.05)] lg:p-8"
    >
      <Box className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-4 lg:gap-x-8 lg:gap-y-5">
        <Skeleton className="row-start-1 size-16 shrink-0 rounded-full sm:size-20 md:row-span-3 md:size-24 lg:size-28" />

        <Box
          display="flex"
          align="center"
          justify="between"
          gap="sm"
          className="col-start-2 row-start-1 min-w-0"
        >
          <Skeleton className="h-8 max-w-[75%] min-w-0 flex-1 sm:h-9 md:h-10 lg:h-12" />
          <Skeleton className="h-6 w-16 shrink-0 rounded-md" />
        </Box>

        <Box className="col-span-2 row-start-2 grid grid-cols-3 gap-x-3 gap-y-3 sm:gap-x-6 sm:gap-y-4 lg:col-span-1 lg:col-start-2 lg:max-w-3xl">
          {[1, 2, 3].map((item) => (
            <Box key={item} display="flex" direction="column" gap="xs">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-20 max-w-full" />
            </Box>
          ))}
        </Box>

        <Box className="border-border/70 col-span-2 row-start-3 border-t pt-2 lg:col-span-1 lg:col-start-2 lg:max-w-3xl lg:pt-3">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="mt-2 h-5 w-40 max-w-full" />
        </Box>
      </Box>
    </Card>
  );
}
