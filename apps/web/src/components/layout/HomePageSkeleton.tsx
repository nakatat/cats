import { Box } from '@/components/system/Box';

import { HomeHeroSkeleton } from './HomeHeroSkeleton';
import { NavigationCardsSkeleton } from './NavigationCardsSkeleton';
import { RecentGameSectionSkeleton } from './RecentGameSectionSkeleton';
import { TeamRecordCardSkeleton } from './TeamRecordCardSkeleton';

export { HomeHeroSkeleton } from './HomeHeroSkeleton';
export { RecentGameSectionSkeleton } from './RecentGameSectionSkeleton';
export { TeamRecordCardSkeleton } from './TeamRecordCardSkeleton';

export function HomePageSkeleton() {
  return (
    <Box data-page="home">
      <HomeHeroSkeleton />

      <Box
        width="100%"
        maxWidth={1440}
        className="relative z-20 mx-auto -mt-4 px-4 sm:px-6 lg:px-8"
      >
        <TeamRecordCardSkeleton />
      </Box>

      <Box
        width="100%"
        maxWidth={1440}
        className="mx-auto px-4 pt-8 pb-12 sm:px-6 sm:pt-10 sm:pb-16 lg:px-8 lg:pt-12"
      >
        <Box display="flex" direction="column" gap="xl">
          <RecentGameSectionSkeleton />
          <NavigationCardsSkeleton />
        </Box>
      </Box>
    </Box>
  );
}
