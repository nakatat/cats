import { Suspense } from 'react';

import { ApiStartupLoading } from '@/components/layout/ApiStartupLoading';
import {
  PlayersFiltersSkeleton,
  PlayersListSkeleton,
} from '@/components/layout/PlayersPageSkeleton';
import { PlayersPageLayout } from '@/features/players/PlayersPageLayout';
import type { PageSearchParams } from '@/lib/list-query';
import { createPageMetadata } from '@/lib/site-metadata';

import { PlayersPageContent } from './PlayersPageContent';

export const metadata = createPageMetadata({
  title: '選手一覧',
  path: '/players',
  description: '新琴似CATSの選手一覧とプロフィールを確認できます。',
});

export default function Page({
  searchParams,
}: Readonly<{ searchParams: Promise<PageSearchParams> }>) {
  return (
    <PlayersPageLayout>
      <Suspense
        fallback={
          <ApiStartupLoading>
            <PlayersFiltersSkeleton />
            <PlayersListSkeleton />
          </ApiStartupLoading>
        }
      >
        <PlayersPageContent searchParams={searchParams} />
      </Suspense>
    </PlayersPageLayout>
  );
}
