import type { ReactNode } from 'react';

import { Box } from '@/components/system/Box';

export function GameDetailPageContainer({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <Box
      width="100%"
      maxWidth={1440}
      className="mx-auto px-4 pt-4 pb-6 sm:px-6 sm:pt-6 sm:pb-8 lg:px-8 lg:pt-8 lg:pb-10"
    >
      {children}
    </Box>
  );
}
