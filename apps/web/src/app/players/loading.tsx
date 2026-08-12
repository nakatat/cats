import { ApiStartupLoading } from '@/components/layout/ApiStartupLoading';
import { PlayersPageSkeleton } from '@/components/layout/PlayersPageSkeleton';

export default function Loading() {
  return (
    <ApiStartupLoading>
      <PlayersPageSkeleton />
    </ApiStartupLoading>
  );
}
