import type { ReactNode } from 'react';

import { Box } from '@/components/system/Box';

export function PlayerRecentStatsTableWrapper({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <Box className="w-full overflow-x-auto">{children}</Box>;
}
