import { Box } from '@/components/system/Box';
import { Typography } from '@/components/system/Typography';

export function PlayerCardDetail({
  label,
  value,
}: Readonly<{
  label: string;
  value: string;
}>) {
  return (
    <Box display="flex" direction="column" gap="xs" className="min-w-0">
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
