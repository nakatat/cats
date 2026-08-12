import { Suspense } from 'react';

import { ApiStartupLoading } from '@/components/layout/ApiStartupLoading';
import {
  HomeHeroSkeleton,
  RecentGameSectionSkeleton,
  TeamRecordCardSkeleton,
} from '@/components/layout/HomePageSkeleton';
import { Box } from '@/components/system/Box';
import type { ApiResult } from '@/lib/api/client';
import type { TeamSummaryResponse } from '@/lib/api/responses';

import { NavigationCards } from './components/NavigationCards';
import { HomeHeroContent } from './HomeHeroContent';
import { HomeRecentGameContent } from './HomeRecentGameContent';
import { HomeRecordContent } from './HomeRecordContent';

/**
 * Home画面で共有するチームサマリーの非同期取得結果。
 *
 * 同じPromiseを複数のServer Componentへ渡し、各領域が同じ取得結果を
 * Suspense境界の中で利用する。
 */
interface HomePageProps {
  /** 成功時はチームサマリー、失敗時は共通の`ApiError`を保持するPromise。 */
  summaryResult: Promise<ApiResult<TeamSummaryResponse>>;
}

export function HomePage({ summaryResult }: Readonly<HomePageProps>) {
  return (
    <Box data-page="home">
      <Suspense
        fallback={
          <ApiStartupLoading>
            <HomeHeroSkeleton />
          </ApiStartupLoading>
        }
      >
        <HomeHeroContent summaryResult={summaryResult} />
      </Suspense>
      <Box
        width="100%"
        maxWidth={1440}
        className="relative z-20 mx-auto -mt-4 px-4 sm:-mt-4 sm:px-6 lg:-mt-4 lg:px-8"
      >
        <Suspense fallback={<TeamRecordCardSkeleton />}>
          <HomeRecordContent summaryResult={summaryResult} />
        </Suspense>
      </Box>

      <Box
        width="100%"
        maxWidth={1440}
        className="mx-auto px-4 pt-8 pb-12 sm:px-6 sm:pt-10 sm:pb-16 lg:px-8 lg:pt-12"
      >
        <Box display="flex" direction="column" gap="xl">
          <Suspense fallback={<RecentGameSectionSkeleton />}>
            <HomeRecentGameContent summaryResult={summaryResult} />
          </Suspense>
          <NavigationCards />
        </Box>
      </Box>
    </Box>
  );
}
