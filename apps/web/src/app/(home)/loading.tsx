import { ApiStartupLoading } from '@/components/layout/ApiStartupLoading';
import { HomePageSkeleton } from '@/components/layout/HomePageSkeleton';

export default function Loading() {
  return (
    <ApiStartupLoading>
      <HomePageSkeleton />
    </ApiStartupLoading>
  );
}
