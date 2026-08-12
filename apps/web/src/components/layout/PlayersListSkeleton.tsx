import { Box } from '@/components/system/Box';
import { Card } from '@/components/ui/card';
import { CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { PlayerCardSkeleton } from './PlayerCardSkeleton';
import { PlayerTableSkeleton } from './PlayerTableSkeleton';

export function PlayersListSkeleton() {
  return (
    <Box as="section" id="players" display="flex" direction="column" gap="lg">
      <Box
        display="flex"
        align="center"
        justify="between"
        gap="md"
        className="md:hidden"
      >
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-28" />
      </Box>

      <Card className="hidden gap-0 rounded-xl py-0 shadow-[0_8px_24px_rgba(17,24,39,0.04)] md:flex">
        <CardHeader className="px-4 pt-4 pb-3 lg:px-5">
          <Skeleton className="h-5 w-20" />
        </CardHeader>
        <CardContent className="px-4 pb-4 lg:px-5">
          <PlayerTableSkeleton />
        </CardContent>
      </Card>

      <Box className="grid gap-3 md:hidden">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <PlayerCardSkeleton key={item} />
        ))}
      </Box>

      <Skeleton className="mx-auto h-10 w-56 rounded-md" />
    </Box>
  );
}
