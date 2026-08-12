import Link from 'next/link';

import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';

export function StatsError() {
  return (
    <Box
      surface="default"
      display="flex"
      direction="column"
      gap="md"
      className="p-6"
    >
      <Typography as="h2" variant="headingMd">
        成績情報を取得できませんでした
      </Typography>
      <Typography as="p" variant="bodySm" tone="muted">
        時間をおいて再度お試しください。
      </Typography>
      <Link
        href="/stats"
        className="text-primary text-sm font-semibold hover:underline"
      >
        成績一覧を再読み込み
      </Link>
    </Box>
  );
}
