import { ApiStartupLoading } from '@/components/layout/ApiStartupLoading';
import { GamesPageSkeleton } from '@/components/layout/GamesPageSkeleton';

export default function Loading() {
  return (
    <ApiStartupLoading>
      <GamesPageSkeleton />
    </ApiStartupLoading>
  );
}
