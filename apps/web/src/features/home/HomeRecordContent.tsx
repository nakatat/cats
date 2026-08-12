import type { ApiResult } from '@/lib/api/client';
import type { TeamSummaryResponse } from '@/lib/api/responses';

import { TeamRecordCard } from './components/TeamRecordCard';

export async function HomeRecordContent({
  summaryResult,
}: Readonly<{
  summaryResult: Promise<ApiResult<TeamSummaryResponse>>;
}>) {
  const result = await summaryResult;

  return result.ok && result.data.record ? (
    <TeamRecordCard record={result.data.record} />
  ) : null;
}
