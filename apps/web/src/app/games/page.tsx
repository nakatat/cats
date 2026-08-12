import { Suspense } from 'react';

import { ApiStartupLoading } from '@/components/layout/ApiStartupLoading';
import {
  GamesFiltersSkeleton,
  GamesListSkeleton,
} from '@/components/layout/GamesPageSkeleton';
import { GamesPageLayout } from '@/features/games/GamesPageLayout';
import type { PageSearchParams } from '@/lib/list-query';
import { createPageMetadata } from '@/lib/site-metadata';

import { GamesPageContent } from './GamesPageContent';

export const metadata = createPageMetadata({
  title: '試合一覧',
  path: '/games',
  description: '新琴似CATSの試合結果・試合予定を確認できます。',
});

export default function Page({
  searchParams,
}: Readonly<{ searchParams: Promise<PageSearchParams> }>) {
  return (
    <GamesPageLayout>
      <Suspense
        fallback={
          <ApiStartupLoading>
            <GamesFiltersSkeleton />
            <GamesListSkeleton />
          </ApiStartupLoading>
        }
      >
        <GamesPageContent searchParams={searchParams} />
      </Suspense>
    </GamesPageLayout>
  );
}
