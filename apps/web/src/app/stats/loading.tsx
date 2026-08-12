import { ApiStartupLoading } from '@/components/layout/ApiStartupLoading';
import { StatsPageSkeleton } from '@/components/layout/StatsPageSkeleton';

export default function Loading() {
  return (
    <ApiStartupLoading>
      <StatsPageSkeleton />
    </ApiStartupLoading>
  );
}
