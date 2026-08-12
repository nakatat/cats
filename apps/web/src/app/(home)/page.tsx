import { HomePage } from '@/features/home/HomePage';
import { getTeamSummary } from '@/lib/api/team';
import { env } from '@/lib/env';
import { createPageMetadata } from '@/lib/site-metadata';

export const metadata = createPageMetadata({ title: 'トップ', path: '/' });

export default function Page() {
  return <HomePage summaryResult={getTeamSummary(env.DEFAULT_TEAM_SLUG)} />;
}
