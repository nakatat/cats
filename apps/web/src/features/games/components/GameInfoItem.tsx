import type { ReactNode } from 'react';

import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';

export function GameInfoItem({
  label,
  value,
  icon,
}: Readonly<{ label?: string; value: ReactNode; icon?: ReactNode }>) {
  return (
    <Box display="flex" align="center" gap="sm" className="min-w-0">
      <Box className="text-muted-foreground shrink-0">{icon}</Box>
      <Typography
        as="span"
        variant="bodySm"
        weight="semibold"
        className="min-w-0 wrap-break-word"
      >
        {label ? `${label}：` : null}
        {value}
      </Typography>
    </Box>
  );
}
