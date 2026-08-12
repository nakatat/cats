import type { ReactNode } from 'react';

import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';

export function PlayerProfileValue({
  label,
  value,
}: Readonly<{
  label: string;
  value?: ReactNode;
}>) {
  if (value == null || value === '') {
    return null;
  }

  return (
    <Box display="flex" direction="column" gap="xs" className="min-w-0">
      <Typography as="span" variant="caption" tone="muted">
        {label}
      </Typography>
      <Typography
        as="span"
        variant="bodySm"
        weight="semibold"
        className="wrap-break-word"
      >
        {value}
      </Typography>
    </Box>
  );
}
