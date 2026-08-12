import { ApiStartupLoading } from '@/components/layout/ApiStartupLoading';
import { GameDetailPageSkeleton } from '@/components/layout/GameDetailPageSkeleton';

export default function Loading() {
  return (
    <ApiStartupLoading>
      <GameDetailPageSkeleton />
    </ApiStartupLoading>
  );
}
