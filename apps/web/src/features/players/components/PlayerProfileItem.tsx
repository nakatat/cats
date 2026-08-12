import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';

export function PlayerProfileItem({
  label,
  value,
}: Readonly<{
  label: string;
  value?: string;
}>) {
  if (!value) {
    return null;
  }

  return (
    <Box as="div" className="flex min-w-0 flex-col gap-1">
      <Typography as="span" variant="caption" tone="muted">
        {label}
      </Typography>
      <Typography
        as="span"
        variant="bodySm"
        weight="medium"
        className="wrap-break-word"
      >
        {value}
      </Typography>
    </Box>
  );
}
