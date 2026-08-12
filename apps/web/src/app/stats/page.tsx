import { Suspense } from 'react';

import { ApiStartupLoading } from '@/components/layout/ApiStartupLoading';
import { StatsPageContentSkeleton } from '@/components/layout/StatsPageSkeleton';
import { StatsPageLayout } from '@/features/stats/components/StatsPageLayout';
import { createPageMetadata } from '@/lib/site-metadata';

import {
  StatsPageContent,
  type StatsPageSearchParams,
} from './StatsPageContent';

export const metadata = createPageMetadata({
  title: '成績',
  path: '/stats',
  description: '新琴似CATSの打撃成績・投手成績・ランキングを確認できます。',
});

export default function Page({
  searchParams,
}: Readonly<{ searchParams: Promise<StatsPageSearchParams> }>) {
  return (
    <StatsPageLayout>
      <Suspense
        fallback={
          <ApiStartupLoading>
            <StatsPageContentSkeleton />
          </ApiStartupLoading>
        }
      >
        <StatsPageContent searchParams={searchParams} />
      </Suspense>
    </StatsPageLayout>
  );
}
