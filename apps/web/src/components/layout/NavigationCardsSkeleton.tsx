import { Box } from '@/components/system/Box';
import { Skeleton } from '@/components/ui/skeleton';

import { NavigationCardSkeleton } from './NavigationCardSkeleton';

export function NavigationCardsSkeleton() {
  return (
    <Box as="section" display="flex" direction="column" gap="lg">
      <Box display="flex" align="center" gap="sm">
        <Skeleton className="size-6 rounded-full" />
        <Skeleton className="h-6 w-32" />
      </Box>
      <Box display="grid" gap="md" className="grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <NavigationCardSkeleton key={item} />
        ))}
      </Box>
    </Box>
  );
}
