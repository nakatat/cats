import type { ReactNode } from 'react';

import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';

interface PageStateProps {
  code: string;
  title: string;
  description: string;
  icon: ReactNode;
  actions: ReactNode;
}

export function PageState({
  code,
  title,
  description,
  icon,
  actions,
}: Readonly<PageStateProps>) {
  return (
    <Box
      as="section"
      display="flex"
      align="center"
      justify="center"
      className="min-h-[60vh] px-4 py-16 sm:px-6 lg:px-8"
    >
      <Box
        display="flex"
        direction="column"
        align="center"
        className="w-full max-w-xl text-center"
      >
        <Box
          display="flex"
          align="center"
          justify="center"
          className="bg-primary/10 text-primary mb-6 size-16 rounded-2xl"
          aria-hidden="true"
        >
          {icon}
        </Box>
        <Typography
          as="p"
          variant="caption"
          tone="primary"
          weight="semibold"
          className="tracking-[0.28em] uppercase"
        >
          {code}
        </Typography>
        <Typography as="h1" variant="headingXl" className="mt-3">
          {title}
        </Typography>
        <Typography
          as="p"
          variant="bodySm"
          tone="muted"
          className="mt-4 max-w-md leading-7"
        >
          {description}
        </Typography>
        <Box display="flex" wrap="wrap" justify="center" className="mt-8 gap-3">
          {actions}
        </Box>
      </Box>
    </Box>
  );
}
