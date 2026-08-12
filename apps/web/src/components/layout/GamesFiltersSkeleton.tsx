import { Box } from '@/components/system/Box';
import { Skeleton } from '@/components/ui/skeleton';

export function GamesFiltersSkeleton() {
  return (
    <Box
      as="section"
      aria-label="試合一覧の検索条件"
      className="grid gap-2 sm:gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-x-8 lg:gap-y-5"
    >
      <Box className="-mx-4 flex min-w-0 gap-2 overflow-hidden pr-0 pl-4 sm:-mx-6 sm:pl-6 lg:mx-0 lg:grid lg:grid-cols-[max-content_max-content_max-content_max-content] lg:gap-5 lg:overflow-visible lg:pl-0">
        {[1, 2, 3, 4].map((item) => (
          <Skeleton
            key={item}
            className="h-11 w-24 shrink-0 rounded-md lg:w-28"
          />
        ))}
      </Box>
      <Skeleton className="hidden h-6 w-28 justify-self-end sm:block lg:justify-self-end" />
    </Box>
  );
}
