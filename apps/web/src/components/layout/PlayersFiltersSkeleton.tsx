import { Box } from '@/components/system/Box';
import { Skeleton } from '@/components/ui/skeleton';

export function PlayersFiltersSkeleton() {
  return (
    <Box
      as="section"
      aria-label="選手一覧の検索条件"
      className="grid grid-cols-3 gap-2 sm:gap-4 lg:grid-cols-[minmax(220px,20rem)_auto_auto] lg:items-end lg:gap-x-8 lg:gap-y-5"
    >
      <Skeleton className="col-span-3 h-11 w-full rounded-md lg:col-span-1" />
      <Box className="col-span-3 -mx-4 flex min-w-0 gap-2 overflow-hidden pr-0 pl-4 sm:-mx-6 sm:pl-6 lg:col-span-1 lg:mx-0 lg:grid lg:grid-cols-[max-content_max-content_max-content] lg:gap-5 lg:overflow-visible lg:pl-0">
        {[1, 2, 3].map((item) => (
          <Skeleton
            key={item}
            className="h-11 w-28 shrink-0 rounded-md lg:w-32"
          />
        ))}
      </Box>
      <Skeleton className="col-span-3 hidden h-6 w-28 justify-self-end md:col-span-1 md:block lg:justify-self-end" />
    </Box>
  );
}
