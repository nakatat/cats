import { Box } from '@/components/system/Box';
import type { ApiResult } from '@/lib/api/client';
import type { TeamSummaryResponse } from '@/lib/api/responses';

import { TeamHero } from './components/TeamHero';
import { HomePageError } from './HomePageError';
import { HomePageMissingData } from './HomePageMissingData';

export async function HomeHeroContent({
  summaryResult,
}: Readonly<{
  summaryResult: Promise<ApiResult<TeamSummaryResponse>>;
}>) {
  const result = await summaryResult;

  if (!result.ok) {
    return <HomePageError />;
  }

  if (!result.data.team || !result.data.season) {
    return <HomePageMissingData />;
  }

  return (
    <Box className="bg-primary -mt-16 pt-16 md:-mt-20 md:pt-20">
      <TeamHero team={result.data.team} />
    </Box>
  );
}
