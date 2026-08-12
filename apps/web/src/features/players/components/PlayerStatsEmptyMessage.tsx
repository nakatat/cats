import type { ReactNode } from 'react';

import { Typography } from '@/components/system/Typography';

export function PlayerStatsEmptyMessage({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <Typography as="p" variant="bodySm" tone="muted">
      {children}
    </Typography>
  );
}
