import { ApiStartupLoading } from '@/components/layout/ApiStartupLoading';
import { PlayerDetailPageSkeleton } from '@/components/layout/PlayerDetailPageSkeleton';

export default function Loading() {
  return (
    <ApiStartupLoading>
      <PlayerDetailPageSkeleton />
    </ApiStartupLoading>
  );
}
