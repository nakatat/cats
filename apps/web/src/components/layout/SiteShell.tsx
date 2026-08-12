import type { ReactNode } from 'react';

import { Box } from '@/components/system/Box';

import { RouteScrollReset } from './RouteScrollReset';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';

export function SiteShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <Box
      display="flex"
      direction="column"
      className="site-shell bg-background min-h-screen overflow-x-clip"
    >
      <RouteScrollReset />
      <SiteHeader />
      <Box as="main" className="bg-background flex-1 pt-16 md:pt-20">
        {children}
      </Box>
      <SiteFooter />
    </Box>
  );
}
